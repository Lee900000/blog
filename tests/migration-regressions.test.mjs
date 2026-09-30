import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {isIP} from 'node:net';
import {EventEmitter} from 'node:events';
import {Readable} from 'node:stream';
import {createHash} from 'node:crypto';

async function runFixture({asset,localBytes,cached='valid',fresh='valid'}={}) {
 const source=await readFile(new URL('../migration/migrate.mjs',import.meta.url),'utf8');
 const helpers=await import('../migration/recovery.mjs');
 const url='https://fixture.example/image.png',page='https://fixture.example/article';
 const png=Buffer.from([137,80,78,71,13,10,26,10]);
 const files=new Map([['migration/manifest.json',JSON.stringify({assets:asset?[{source_url:url,...asset}]:[]})]]),downloads=[],publications=[];
 if(cached!==null)files.set('migration/cache/pages/1.html',cached);
 if(localBytes)files.set('source/assets/migrated/existing.png',localBytes);
 const read=async(path,encoding)=>{if(!files.has(path))throw Object.assign(new Error('Missing'),{code:'ENOENT'});const value=files.get(path);return encoding?value.toString():Buffer.from(value);};
 const context={...helpers,URL,Buffer,createHash,process:{},console:{log(){}},IDS:[1],ORIGIN:'https://fixture.example',sourceURL:()=>page,
  YAML:{stringify:()=>''},mkdir:async()=>{},readFile:read,writeFile:async(path,data)=>files.set(path,data),rename:async(from,to)=>{files.set(to,files.get(from));files.delete(from);if(to==='migration/manifest.json')publications.push(JSON.parse(files.get(to)));},
  rm:async path=>files.delete(path),
  createDownloader:()=>async target=>{downloads.push(target);return {bytes:target===page?Buffer.from(fresh):png,type:'image/png'};},
  extractPost:(html,id)=>{if(html!=='valid')throw new Error('Invalid article');return {legacy_id:id,date:'2026-01-01T00:00:00',images:[url],body:url,code:[],tables:[],counts:{}};},
 };
 // Helpers use injected filesystem IO; never touch the real migration data.
 if(helpers.reusableAsset)context.reusableAsset=asset=>helpers.reusableAsset(asset,read);
 if(helpers.loadArticle)context.loadArticle=options=>helpers.loadArticle({...options,readFile:read,remove:context.rm});
 await vm.runInNewContext('(async()=>{'+source.replace(/^import .*;\n/gm,'')+'})()',context);
 return {files,downloads,publications,url,page,png};
}

test('resume checks asset existence and SHA256, retries transient failures, retains confirmed 404',async()=>{
 const good=Buffer.from([137,80,78,71,13,10,26,10]);const sha256=createHash('sha256').update(good).digest('hex');
 for(const [name,asset,localBytes,retry] of [
  ['missing',{state:'localized',path:'/assets/migrated/existing.png',sha256},null,true],
  ['corrupt',{state:'localized',path:'/assets/migrated/existing.png',sha256},Buffer.from('corrupt'),true],
  ['verified',{state:'localized',path:'/assets/migrated/existing.png',sha256},good,false],
  ['timeout',{state:'source-failed',error:'Request timeout'},null,true],
  ['503',{state:'source-failed',error:'HTTP 503'},null,true],
  ['429',{state:'source-failed',error:'HTTP 429'},null,true],
  ['unverified host',{state:'host-unreachable-unverified',error:'Host unavailable: skipped'},null,true],
  ['404',{state:'source-failed',error:'HTTP 404'},null,false],
 ]){
  const result=await runFixture({asset,localBytes});
  assert.equal(result.downloads.includes(result.url),retry,name);
  if(retry){assert.equal(result.publications[0].assets[0].state,'pending',name);assert.equal(result.publications.at(-1).assets[0].state,'localized',name);}
 }
});

test('invalid cached HTML is invalidated and refetched once',async()=>{
 const result=await runFixture({cached:'challenge'});
 assert.equal(result.downloads.filter(url=>url===result.page).length,1);
 assert.equal(result.files.get('migration/cache/pages/1.html'),'valid');
 assert.equal(result.publications.at(-1).post_count,1);
});

test('invalid fresh HTML never poisons the cache, including after invalid cache recovery',async()=>{
 for(const cached of [null,'challenge']){
  const result=await runFixture({cached,fresh:'challenge'});
  assert.equal(result.downloads.filter(url=>url===result.page).length,1);
  assert.equal(result.files.has('migration/cache/pages/1.html'),false);
  assert.equal(result.publications.at(-1).failures.length,1);
 }
});

test('valid cached HTML is reused without a page request',async()=>{
 const result=await runFixture();
 assert.equal(result.downloads.includes(result.page),false);
 assert.equal(result.publications.at(-1).post_count,1);
});

// Evaluate only the downloader, never the CLI's crawl or publishing side effects.
async function downloader(deps) {
 const source=await readFile(new URL('../migration/migrate.mjs',import.meta.url),'utf8');
 const helpers=await import('../migration/recovery.mjs').catch(e=>{if(e.code==='ERR_MODULE_NOT_FOUND')return {};throw e;});
 const context={URL,Buffer,AbortSignal,Date,setTimeout,isIP,...deps,
  createDownloader:()=>helpers.createDownloader(deps)};
 vm.runInNewContext(source.slice(0,source.indexOf("for(const dir of")).replace(/^import .*;\n/gm,'')+'\nthis.result=download;',context);
 return context.result;
}
function transport(responses, calls) {
 return (url, options, callback)=>{
  const req=new EventEmitter();req.destroy=e=>req.emit('error',e);
  req.end=()=>queueMicrotask(()=>{calls.push({url,options});const r=Readable.from([Buffer.from('fixture')]);const response=responses.shift()||{};r.statusCode=response.status||200;r.headers=response.headers||{'content-type':'image/png'};callback(r);});
  return req;
 };
}

test('validated DNS address is pinned at each redirect with hostname and SNI preserved',async()=>{
 const calls=[],hosts=[];
 const request=transport([{status:302,headers:{location:'https://second.example/image'}},{}],calls);
 const download=await downloader({lookup:async host=>{hosts.push(host);return [{address:hosts.length===1?'8.8.8.8':'1.1.1.1',family:4}];},request,sleep:async()=>{},fetch:async()=>({ok:true,status:200,headers:new Headers(),body:Readable.from([Buffer.from('fixture')])})});
 await download('https://first.example/image');
 assert.equal(calls.length,2,'connections must use the pinned transport, not re-resolving fetch');
 assert.deepEqual(hosts,['first.example','second.example']);
 for(const [i,call] of calls.entries()){
  assert.equal(call.url.hostname,hosts[i]);assert.equal(call.options.servername,hosts[i]);assert.equal(call.options.agent,false);
  call.options.lookup(hosts[i],{},(error,address,family)=>{assert.ifError(error);assert.equal(address,i===0?'8.8.8.8':'1.1.1.1');assert.equal(family,4);});
  call.options.lookup(hosts[i],{all:true},(error,addresses)=>{assert.ifError(error);assert.deepEqual(addresses,[{address:i===0?'8.8.8.8':'1.1.1.1',family:4}]);});
 }
});

test('private redirect targets are rejected before another connection',async()=>{
 const calls=[];
 const download=await downloader({lookup:async host=>[{address:host==='first.example'?'8.8.8.8':'10.0.0.1',family:4}],request:transport([{status:302,headers:{location:'https://private.example/image'}}],calls),sleep:async()=>{}});
 await assert.rejects(download('https://first.example/image'),/Nonpublic/);
 assert.equal(calls.length,1);
});

test('pinned transport retains size limits, permanent HTTP errors and shared rate slots',async()=>{
 const calls=[],waits=[];
 const deps={lookup:async()=>[{address:'8.8.8.8',family:4}],request:transport([],calls),sleep:async ms=>waits.push(ms)};
 const download=await downloader(deps);
 await download('https://fixture.example/one');await download('https://fixture.example/two');
 assert.equal(calls.length,2);assert.ok(waits[1]>0,'second request reserves the shared 550ms slot');
 await assert.rejects(download('https://fixture.example/large',1),/Size limit/);assert.equal(calls.length,3);
 const failed=[];const notFound=await downloader({...deps,request:transport([{status:404}],failed)});
 await assert.rejects(notFound('https://fixture.example/missing'),/HTTP 404/);assert.equal(failed.length,1);
});

test('nonpublic ranges and mixed DNS answers cannot reach the transport',async()=>{
 for(const address of ['10.0.0.1','127.0.0.1','172.16.0.1','192.168.1.1','169.254.1.1','100.64.0.1','0.0.0.1','225.1.1.1','239.1.1.1','241.1.1.1','::1','::ffff:127.0.0.1','fc00::1','fe80::1','ff02::1','2001:db8::1']){
  let requested=false;
  const download=await downloader({lookup:async()=>[{address:'8.8.8.8',family:4},{address,family:isIP(address)}],request:()=>{requested=true;throw new Error('transport reached');},sleep:async()=>{},fetch:async()=>{requested=true;throw new Error('transport reached');}});
  await assert.rejects(download('https://fixture.example/image'),/Nonpublic/);assert.equal(requested,false);
 }
});
