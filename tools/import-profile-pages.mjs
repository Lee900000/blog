import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {load} from 'cheerio';
import Turndown from 'turndown';
import {gfm} from 'turndown-plugin-gfm';
import YAML from 'yaml';

const origin='https://www.ikarp.top';
const assets=new Map();
await mkdir('source/assets/pages',{recursive:true});
async function fetchResource(url){
 const response=await fetch(url,{signal:AbortSignal.timeout(15000)});
 if(!response.ok)throw new Error(`HTTP ${response.status}`);
 return response;
}
for(const [slug,title] of [['ai','AI实践'],['about','关于']]){
 const sourceURL=`${origin}/index.php/${slug}.html`;
 const $=load(await (await fetchResource(sourceURL)).text());
 const content=$('article .prose').first();
 if(!content.length)throw new Error(`Missing page content: ${slug}`);
 // Remove the old theme's profile card, not the article's content.
 content.children('.not-prose').filter((i,e)=>$(e).find('img[src="/logo.png"]').length>0).remove();
 content.find('script,style,iframe,form').remove();
 content.find('*').each((i,e)=>{for(const key of Object.keys(e.attribs||{})){if(key.startsWith('on'))$(e).removeAttr(key);}});
 content.find('a[href],img[src]').each((i,e)=>{
  const attr=e.tagName==='img'?'src':'href'; const raw=$(e).attr(attr);
  if(raw.startsWith('#'))return;
  const url=new URL(raw,sourceURL);
  if(!['https:','http:','mailto:'].includes(url.protocol)){$(e).removeAttr(attr);return;}
  $(e).attr(attr,url.href);
 });
 const images=[...new Set(content.find('img[src]').map((i,e)=>$(e).attr('src')).get())];
 let next=0;
 async function worker(){while(next<images.length){const url=images[next++];if(assets.has(url))continue;
  try{
   const parsed=new URL(url);
   if(parsed.origin!==origin||!parsed.pathname.startsWith('/usr/uploads/'))throw new Error('External image retained');
   const response=await fetchResource(url);
   const type=(response.headers.get('content-type')||'').split(';')[0];
   const extension={'image/png':'png','image/jpeg':'jpg','image/webp':'webp','image/gif':'gif'}[type];
   if(!extension)throw new Error('Unsupported image type');
   const bytes=Buffer.from(await response.arrayBuffer());
   if(bytes.length>15*1024*1024)throw new Error('Image exceeds size limit');
   const path=`/assets/pages/${createHash('sha256').update(url).digest('hex').slice(0,20)}.${extension}`;
   await writeFile(`source${path}`,bytes);assets.set(url,{path,state:'localized'});
  }catch(error){assets.set(url,{state:'original-url-retained',reason:error.message});}
 }}
 await Promise.all([worker(),worker()]);
 content.find('img[src]').each((i,e)=>{const asset=assets.get($(e).attr('src'));if(asset?.path)$(e).attr('src',asset.path);});
 const td=new Turndown({headingStyle:'atx',codeBlockStyle:'fenced'});td.use(gfm);
 let body=td.turndown(content.html());
 if(slug==='about'){
  body=body.replace('你好，我是 Karp','你好，我是 leon');
  body=body.replaceAll('karp90000@gmail.com','axon90000@gmail.com');
  body=body.replace(/到现在写了\s*\*\*844 篇\*\*文章。/,'这里积累了多年的技术文章。');
  body=`<div class="leon-profile"><img src="/assets/profile/leon-avatar.png" alt="Lee" width="140" height="153"><div><strong>Lee</strong><span>记录做过的事，也记录正在尝试的事</span></div></div>\n\n${body}`;
 }
 await mkdir(`source/${slug}`,{recursive:true});
 const meta={title,description:slug==='ai'?'AI 落地与开源作品：开发工具、桌面应用与实践记录。':'关于 leon：技术、业务与产品实践。',source_url:sourceURL,comments:false,toc:true,disableNunjucks:true};
 await writeFile(`source/${slug}/index.md`,`---\n${YAML.stringify(meta)}---\n<!-- [skill: go-team-standards · 独立页面迁移] 沿用旧站正文，更新本站展示身份。 -->\n\n${body}\n`);
 console.log(JSON.stringify({page:slug,title,source_images:images.length,localized:images.filter(u=>assets.get(u)?.path).length}));
}
await mkdir('migration',{recursive:true});
await writeFile('migration/profile-page-assets.json',JSON.stringify([...assets].map(([url,result])=>({source_url:url,...result})),null,2)+'\n');
