import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {lookup} from 'node:dns/promises';
import {isIP} from 'node:net';
import YAML from 'yaml';
import {IDS,ORIGIN,sourceURL,extractPost} from './extractor.mjs';
const allowed=new Set(['www.ikarp.top','ikarp.top','raw.githubusercontent.com','repo-assets.open-design.ai']);
async function download(url,limit=12*1024*1024){
 for(let hops=0;hops<4;hops++){
  const u=new URL(url);if(u.protocol!=='https:'||!allowed.has(u.hostname)||u.port||u.username||u.password)throw new Error('URL not allowlisted');
  const ips=await lookup(u.hostname,{all:true});
  if(!ips.length||ips.some(({address:a})=>!isIP(a)||/^(127\.|10\.|192\.168\.|169\.254\.|0\.|172\.(1[6-9]|2\d|3[01])\.|::1$|f[cd]|fe80:)/i.test(a)))throw new Error('Nonpublic address');
  const r=await fetch(u,{signal:AbortSignal.timeout(25000),redirect:'manual'});
  if(r.status>=300&&r.status<400){url=new URL(r.headers.get('location'),u).href;continue;}
  if(!r.ok)throw new Error(`HTTP ${r.status}`);
  const chunks=[];let size=0;for await(const chunk of r.body){size+=chunk.length;if(size>limit)throw new Error('Size limit exceeded');chunks.push(chunk);}
  return {bytes:Buffer.concat(chunks),type:r.headers.get('content-type')||''};
 }throw new Error('Redirect limit');
}
await mkdir('source/_posts',{recursive:true});await mkdir('source/assets/migrated',{recursive:true});
const assets=new Map(),posts=[];
for(const id of IDS){
 const {bytes}=await download(sourceURL(id),4*1024*1024);const p=extractPost(bytes.toString('utf8'),id);
 for(const url of p.images){
  if(!assets.has(url)){
   try{const {bytes,type}=await download(url);if(!type.startsWith('image/'))throw new Error('Not an image');const ext=({'image/png':'png','image/jpeg':'jpg','image/gif':'gif','image/webp':'webp','image/svg+xml':'svg'})[type.split(';')[0]];if(!ext||ext==='svg')throw new Error('Unsupported image type');const path=`/assets/migrated/${createHash('sha256').update(url).digest('hex').slice(0,20)}.${ext}`;await writeFile(`source${path}`,bytes);assets.set(url,{source_url:url,state:'localized',path,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});}
   catch(e){assets.set(url,{source_url:url,state:'source-failed',error:e.message});}
  }
  if(assets.get(url).path)p.body=p.body.split(url).join(assets.get(url).path);
 }
 const {body,counts,images,code,tables,...meta}=p;
 await writeFile(`source/_posts/${id}.md`,`---\n${YAML.stringify({...meta,source_date:meta.date,date:meta.date.slice(0,19).replace('T',' '),updated:meta.date.slice(0,19).replace('T',' '),disableNunjucks:true,comments:false,cover:false})}---\n<!-- [skill: go-team-standards · 迁移预览] 公开正文迁移，保留原文与来源标识。 -->\n\n${body}\n`);
 posts.push({...meta,source_url:sourceURL(id),state:'migrated',counts,images,code_sha256:code.map(x=>createHash('sha256').update(x).digest('hex')),known_issues:id===877?[{url:new URL('./market_wind_tables.md',sourceURL(id)).href,state:'preexisting-source-404'}]:[]});
 console.log(JSON.stringify({legacy_id:id,title:p.title,counts}));
}
if(posts.length!==10||new Set(posts.map(p=>p.legacy_id)).size!==10)throw new Error('Expected exactly 10 posts');
await writeFile('migration/manifest.json',JSON.stringify({schema_version:1,source:ORIGIN,post_count:posts.length,posts,assets:[...assets.values()].sort((a,b)=>a.source_url.localeCompare(b.source_url))},null,2)+'\n');
console.log(JSON.stringify({posts:posts.length,assets:assets.size,localized:[...assets.values()].filter(a=>a.state==='localized').length,failed:[...assets.values()].filter(a=>a.state!=='localized')}));
