import {load} from 'cheerio';
import Turndown from 'turndown';
import {gfm} from 'turndown-plugin-gfm';
export const IDS=[883,882,881,880,879,878,877,876,875,1];
export const ORIGIN='https://www.ikarp.top';
export const sourceURL=id=>`${ORIGIN}/index.php/archives/${id}.html`;
export function extractPost(html,id){
 const $=load(html), article=$('article').first(), prose=article.find('div.prose').first();
 const title=article.find('h1').first().text().trim(), date=article.find('time[datetime]').first().attr('datetime');
 if(!title||!date||!prose.length) throw new Error(`Missing article fields: ${id}`);
 const taxonomy=kind=>[...new Set(article.find(`a[href*="/${kind}/"]`).filter((i,e)=>!$(e).closest('.prose').length).map((i,e)=>$(e).text().trim()).get())];
 const counts={code:prose.find('pre').length,tables:prose.find('table').length,mermaid:prose.find('.mermaid').length,images:prose.find('img').length};
 const code=prose.find('pre').map((i,e)=>$(e).find('code').length?$(e).find('code').text():$(e).text()).get();
 const tables=prose.find('table').map((i,e)=>$(e).find('tr').map((j,r)=>[$(r).find('th,td').map((k,c)=>$(c).text()).get()]).get()).get();
 prose.find('script,style,iframe,button').remove();
 prose.find('*').each((i,e)=>{for(const key of Object.keys(e.attribs||{})) if(key.startsWith('on')) $(e).removeAttr(key);});
 prose.find('a[href],img[src]').each((i,e)=>{const key=e.name==='img'?'src':'href', raw=$(e).attr(key);if(raw.startsWith('#'))return;const url=new URL(raw,sourceURL(id));if(!['https:','http:'].includes(url.protocol)){ $(e).removeAttr(key); return; }const match=url.pathname.match(/^\/index\.php\/archives\/(\d+)\.html$/);$(e).attr(key,url.origin===ORIGIN&&match&&IDS.includes(Number(match[1]))?url.pathname+url.search+url.hash:url.href);});
 const images=prose.find('img').map((i,e)=>$(e).attr('src')).get();
 prose.find('.mermaid').each((i,e)=>{const pre=$('<pre class="mermaid"></pre>').text($(e).text());$(e).replaceWith(pre);});
 const td=new Turndown({headingStyle:'atx',codeBlockStyle:'fenced',bulletListMarker:'-'});td.use(gfm);
 td.addRule('exact-code',{filter:'pre',replacement:(_,n)=>{const c=n.querySelector('code')||n;const lang=(c.className.match(/(?:lang|language)-([\w+-]+)/)||[])[1]||'';const text=c.textContent;const fence='`'.repeat(Math.max(3,...[...text.matchAll(/`+/g)].map(m=>m[0].length+1)));return `\n\n${fence}${lang}\n${text}\n${fence}\n\n`;}});
 td.addRule('mermaid-source',{filter:n=>n.classList?.contains('mermaid'),replacement:(_,n)=>`\n\n\`\`\`mermaid\n${n.textContent}\n\`\`\`\n\n`});
 // Retain tables as HTML: merged cells and multiline cells must not be flattened.
 td.addRule('exact-table',{filter:'table',replacement:(_,n)=>`\n\n${n.outerHTML}\n\n`});
 return {title,date,legacy_id:id,permalink:`index.php/archives/${id}.html`,categories:taxonomy('category').map(x=>[x]),tags:taxonomy('tag'),body:td.turndown(prose.html()),counts,images,code,tables};
}
