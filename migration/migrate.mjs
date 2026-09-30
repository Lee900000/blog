import {mkdir,writeFile,readFile,rename} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createDownloader,reusableAsset,loadArticle} from './recovery.mjs';
import YAML from 'yaml';
import {IDS,ORIGIN,sourceURL,extractPost} from './extractor.mjs';
const hash=x=>createHash('sha256').update(x).digest('hex');
async function atomic(path,data){await writeFile(path+'.tmp',data);await rename(path+'.tmp',path);}
async function json(path,fallback){try{return JSON.parse(await readFile(path,'utf8'));}catch(e){if(e.code==='ENOENT')return fallback;throw e;}}
const download=createDownloader();
for(const dir of ['source/_posts','source/assets/migrated','migration/cache/pages','migration/cache/posts','migration/checkpoints'])await mkdir(dir,{recursive:true});
const old=await json('migration/manifest.json',{assets:[]});
const assets=new Map(old.assets.map(a=>[a.source_url,a]));
const assetState=await json('migration/checkpoints/assets.json',[]);for(const a of assetState)assets.set(a.source_url,a);
// Validate before the articles-complete publish can rewrite any image paths.
for(const [url,asset] of assets)if(!await reusableAsset(asset))assets.delete(url);
const posts=[],failures=[];
let next=0,done=0;
async function articleWorker(){while(next<IDS.length){const id=IDS[next++];try{
 const {html,post:p}=await loadArticle({path:`migration/cache/pages/${id}.html`,id,url:sourceURL(id),download,extractPost,atomic});
 await atomic(`migration/cache/posts/${id}.json`,JSON.stringify(p));posts.push(p);
 await atomic(`migration/checkpoints/${id}.json`,JSON.stringify({legacy_id:id,state:'extracted',page_sha256:hash(html)}));
 }catch(e){failures.push({legacy_id:id,state:'failed',error:e.message});await atomic(`migration/checkpoints/${id}.json`,JSON.stringify(failures.at(-1)));}
 done++;if(done%25===0)console.log(JSON.stringify({phase:'articles',done,total:IDS.length,failed:failures.length}));}}
await Promise.all([articleWorker(),articleWorker()]);posts.sort((a,b)=>a.legacy_id-b.legacy_id);
await atomic('migration/article-status.json',JSON.stringify({extracted:posts.length,failures},null,2)+'\n');
const urls=[...new Set(posts.flatMap(p=>p.images))];
// Download only explicit article image URLs; no crawl, no credentials or executable SVG.
let assetNext=0,assetDone=0;const hostFailures=new Map();let assetSave=Promise.resolve();
async function assetWorker(){while(assetNext<urls.length){const url=urls[assetNext++];
 if(!assets.has(url)){
 try{const host=new URL(url).hostname;if((hostFailures.get(host)||0)>=3)throw new Error('Host unavailable: skipped after repeated failures (unverified)');
 const {bytes,type}=await download(url);const mime=type.split(';')[0].trim();const ext=({'image/png':'png','image/jpeg':'jpg','image/gif':'gif','image/webp':'webp','image/bmp':'bmp','image/x-icon':'ico'})[mime];
 const valid=ext==='png'?bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):ext==='jpg'?bytes[0]===255&&bytes[1]===216:ext==='gif'?bytes.subarray(0,3).toString()==='GIF':ext==='webp'?bytes.subarray(0,4).toString()==='RIFF'&&bytes.subarray(8,12).toString()==='WEBP':ext==='bmp'?bytes.subarray(0,2).toString()==='BM':ext==='ico'?bytes.length>=4&&bytes.readUInt16LE(0)===0:false;
 if(!ext||!valid)throw new Error('Unsupported or invalid image type');const path=`/assets/migrated/${hash(url).slice(0,20)}.${ext}`;await atomic(`source${path}`,bytes);assets.set(url,{source_url:url,state:'localized',path,bytes:bytes.length,sha256:hash(bytes)});hostFailures.set(host,0);
 }catch(e){const host=new URL(url).hostname;if(!/HTTP 404|Unsupported|skipped/.test(e.message))hostFailures.set(host,(hostFailures.get(host)||0)+1);assets.set(url,{source_url:url,state:e.message.includes('skipped')?'host-unreachable-unverified':'source-failed',error:e.message});}
 assetSave=assetSave.then(()=>atomic('migration/checkpoints/assets.json',JSON.stringify([...assets.values()],null,2)+'\n'));await assetSave;
 }
 assetDone++;if(assetDone%25===0)console.log(JSON.stringify({phase:'assets',done:assetDone,total:urls.length}));
}}
// Make every article durable before potentially slow third-party image requests.
await publish('articles-complete');
await Promise.all([assetWorker(),assetWorker()]);
await publish('complete');
if(failures.length)process.exitCode=1;
async function publish(phase){
const records=[];
for(const original of posts){
 const p={...original};
 for(const url of p.images){const a=assets.get(url);if(a?.path)p.body=p.body.split(url).join(a.path);}
 const {body,counts,images,code,tables,...meta}=p;const cover=images.map(u=>assets.get(u)?.path).find(Boolean);
 await atomic(`source/_posts/${p.legacy_id}.md`,`---\n${YAML.stringify({...meta,source_date:meta.date,date:meta.date.slice(0,19).replace('T',' '),updated:meta.date.slice(0,19).replace('T',' '),disableNunjucks:true,comments:false,...(cover?{cover}:{})})}---\n<!-- [skill: go-team-standards · 迁移] 公开正文迁移，保留原文与来源标识。 -->\n\n${body}\n`);
 records.push({...meta,source_url:sourceURL(p.legacy_id),state:'migrated',counts,images,code_sha256:code.map(hash),tables_sha256:hash(JSON.stringify(tables))});
 await atomic(`migration/checkpoints/${p.legacy_id}.json`,JSON.stringify({legacy_id:p.legacy_id,state:'migrated'}));
}
const usedAssets=urls.map(u=>assets.get(u)||{source_url:u,state:'pending'});
await atomic('migration/manifest.json',JSON.stringify({schema_version:2,source:ORIGIN,expected_count:IDS.length,post_count:records.length,posts:records,assets:usedAssets,failures},null,2)+'\n');
console.log(JSON.stringify({phase,posts:records.length,expected:IDS.length,assets:usedAssets.length,localized:usedAssets.filter(a=>a.state==='localized').length,failed_assets:usedAssets.filter(a=>a.state!=='localized').length,failed_articles:failures.length}));
}
