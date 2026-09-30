import {readFile as read,rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';

export async function loadArticle({path,id,url,download,extractPost,atomic,readFile=read,remove=rm}){
 let html;
 try{html=await readFile(path,'utf8');}catch(error){if(error.code!=='ENOENT')throw error;}
 if(html!==undefined){
  try{return {html,post:extractPost(html,id)};}
  catch{await remove(path,{force:true});}
 }
 html=(await download(url,4*1024*1024)).bytes.toString('utf8');
 const post=extractPost(html,id);
 await atomic(path,html);
 return {html,post};
}

export async function reusableAsset(asset,readFile=read){
 if(asset?.state==='localized'){
  if(!/^\/assets\/migrated\/[a-zA-Z0-9_-]+\.[a-z]+$/.test(asset.path||'')||!asset.sha256)return false;
  try{return createHash('sha256').update(await readFile(`source${asset.path}`)).digest('hex')===asset.sha256;}
  catch(error){if(error.code==='ENOENT')return false;throw error;}
 }
 // Only confirmed permanent HTTP failures survive a resume; timeouts, rate
 // limits, DNS errors and host circuit-breaker skips must be tried again.
 return asset?.state==='source-failed'&&/^HTTP (404|410)$/.test(asset.error||'');
}

import {lookup as dnsLookup} from 'node:dns/promises';
import {isIP,BlockList} from 'node:net';
import {request as httpRequest} from 'node:http';
import {request as httpsRequest} from 'node:https';

const blocked=new BlockList();
for(const [address,prefix] of [['0.0.0.0',8],['10.0.0.0',8],['100.64.0.0',10],['127.0.0.0',8],['169.254.0.0',16],['172.16.0.0',12],['192.0.0.0',24],['192.0.2.0',24],['192.168.0.0',16],['198.18.0.0',15],['198.51.100.0',24],['203.0.113.0',24],['224.0.0.0',3]])blocked.addSubnet(address,prefix,'ipv4');
for(const [address,prefix] of [['2001::',23],['2001:db8::',32],['2002::',16],['3fff::',20]])blocked.addSubnet(address,prefix,'ipv6');
const globalIPv6=new BlockList();globalIPv6.addSubnet('2000::',3,'ipv6');
function publicAddress(address){const family=isIP(address);return family===4?!blocked.check(address,'ipv4'):family===6&&globalIPv6.check(address,'ipv6')&&!blocked.check(address,'ipv6');}
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function resolvePublic(host,lookup){
 let timer;
 try{
  const ips=await Promise.race([lookup(host,{all:true}),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('DNS timeout')),5000);})]);
  if(!ips.length||ips.some(ip=>!publicAddress(ip.address)))throw new Error('Nonpublic address');
  return {address:ips[0].address,family:isIP(ips[0].address)};
 }finally{clearTimeout(timer);}
}
function pinnedRequest(url,ip,limit,request){
 return new Promise((resolve,reject)=>{
  const req=request(url,{agent:false,servername:isIP(url.hostname.replace(/^\[|\]$/g,''))?undefined:url.hostname,
   lookup:(_host,options,callback)=>callback(null,...(options?.all?[[ip]]:[ip.address,ip.family]))},async response=>{
   try{
    const status=response.statusCode;
    if(status>=300&&status<400){response.destroy();resolve({location:response.headers.location});return;}
    if(status<200||status>=300)throw new Error(`HTTP ${status}`);
    const chunks=[];let size=0;
    for await(const chunk of response){size+=chunk.length;if(size>limit)throw new Error('Size limit exceeded');chunks.push(chunk);}
    resolve({bytes:Buffer.concat(chunks),type:response.headers['content-type']||''});
   }catch(error){response.destroy();reject(error);}finally{clearTimeout(timer);}
  });
  const timer=setTimeout(()=>req.destroy(new Error('Request timeout')),15000);
  req.on('error',error=>{clearTimeout(timer);reject(error);});req.end();
 });
}

export function createDownloader({lookup=dnsLookup,request=(url,...args)=>(url.protocol==='https:'?httpsRequest:httpRequest)(url,...args),sleep=delay}={}){
 let slot=0;
 return async function download(url,limit=12*1024*1024){
  for(let attempt=0;attempt<3;attempt++){
   try{
    for(let hops=0;hops<4;hops++){
     const u=new URL(url);if(!['https:','http:'].includes(u.protocol)||u.port||u.username||u.password)throw new Error('Unsafe URL');
     const ip=await resolvePublic(u.hostname.replace(/^\[|\]$/g,''),lookup);
     const wait=Math.max(Date.now(),slot);slot=wait+550;await sleep(wait-Date.now());
     const result=await pinnedRequest(u,ip,limit,request);
     if('location' in result){if(!result.location)throw new Error('Invalid redirect');url=new URL(result.location,u).href;continue;}
     return result;
    }throw new Error('Redirect limit');
   }catch(error){if(attempt===2||/HTTP (?!429|5\d\d)\d+|Unsafe|Nonpublic|Size limit/.test(error.message))throw error;await sleep(1000*2**attempt);}
  }
 };
}
