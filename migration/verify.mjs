import assert from 'node:assert/strict';
import {readFile,readdir,stat,writeFile,rename} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {load} from 'cheerio';
import YAML from 'yaml';
import {IDS,extractPost} from './extractor.mjs';
import {markdownCodes,renderedCode,expectedHighlightedCode} from './verification-helpers.mjs';
const hash=x=>createHash('sha256').update(x).digest('hex');
const manifest=JSON.parse(await readFile('migration/manifest.json','utf8'));
const siteConfig=YAML.parse(await readFile('_config.yml','utf8'));
const themeConfig=YAML.parse(await readFile('_config.butterfly.yml','utf8'));
const expectedComments=siteConfig.imported_post_comments===true && Boolean(themeConfig.comments?.use) ? 1 : 0;
const failures=[],verified=[],attachments=[];let code=0,tables=0,mermaid=0,images=0,embeddedImages=0,internalLinks=0;
const check=(name,fn)=>{try{fn();}catch(e){failures.push({check:name,error:e.message});}};
check('exact manifest IDs',()=>{assert.equal(manifest.post_count,IDS.length);assert.deepEqual(manifest.posts.map(p=>p.legacy_id),IDS);});
const sourceIds=(await readdir('source/_posts')).filter(p=>p.endsWith('.md')).map(p=>Number(p.slice(0,-3))).sort((a,b)=>a-b);
check('exact source IDs',()=>assert.deepEqual(sourceIds,IDS));
const outputIds=(await readdir('public/index.php/archives')).filter(p=>p.endsWith('.html')).map(p=>Number(p.slice(0,-5))).sort((a,b)=>a-b);
check('exact output IDs',()=>assert.deepEqual(outputIds,IDS));
for(const p of manifest.posts){try{
 const source=await readFile(`source/_posts/${p.legacy_id}.md`,'utf8');const front=YAML.parse(source.split('---\n')[1]);assert.equal(front.legacy_id,p.legacy_id);assert.equal(front.disableNunjucks,true);assert.deepEqual(front.categories,p.categories);assert.equal(front.source_date,p.date);assert.equal(front.date,p.date.slice(0,19).replace('T',' '));
 const original=extractPost(await readFile(`migration/cache/pages/${p.legacy_id}.html`,'utf8'),p.legacy_id);
 const expectedCover=p.images.map(url=>manifest.assets.find(a=>a.source_url===url)?.path).find(Boolean);assert.equal(front.cover,expectedCover,`real article cover ${p.legacy_id}`);
 const $=load(await readFile(`public/${p.permalink}`,'utf8'));assert.equal($('h1.post-title').text(),p.title);
 const body=$('#article-container');assert.equal($('time.post-meta-date-created').text(),p.date.slice(0,10),`displayed date ${p.legacy_id}`);assert.equal(new Date($('time.post-meta-date-created').attr('datetime')).toISOString(),new Date(p.date).toISOString(),`date instant ${p.legacy_id}`);
 const renderedTables=body.find('table').not('.highlight table');assert.equal(renderedTables.length,p.counts.tables,`tables ${p.legacy_id}`);
 const cells=renderedTables.map((i,e)=>$(e).find('tr').map((j,r)=>[$(r).find('th,td').map((k,c)=>$(c).text()).get()]).get()).get();assert.equal(hash(JSON.stringify(cells)),p.tables_sha256,`table cells ${p.legacy_id}`);
 assert.equal(body.find('.mermaid').length,p.counts.mermaid,`mermaid ${p.legacy_id}`);
 const sourceCodes=markdownCodes(source);
 assert.equal(sourceCodes.length,p.counts.code,`code blocks ${p.legacy_id}`);assert.deepEqual(sourceCodes.map(hash),p.code_sha256,`exact code source ${p.legacy_id}`);
 assert.deepEqual(original.code.map(hash),p.code_sha256,`original code hashes ${p.legacy_id}`);
 const renderedCodes=body.find('figure.highlight').map((i,e)=>renderedCode($,e)).get();assert.equal(renderedCodes.length,original.code.length,`rendered code count ${p.legacy_id}`);assert.deepEqual(renderedCodes.map(hash),original.code.map(x=>hash(expectedHighlightedCode(x))),`rendered code hashes ${p.legacy_id}`);
 assert.equal(body.find('img').length,p.counts.images,`images ${p.legacy_id}`);assert.equal($('#post-comment').length,expectedComments);
 for(const el of body.find('img').toArray()){const src=$(el).attr('data-src')||$(el).attr('src');if(src?.startsWith('/assets/migrated/'))assert.ok((await stat(`public${src}`)).size>0);}
 for(const url of p.images){const a=manifest.assets.find(a=>a.source_url===url);assert.ok(a,`image accounted ${p.legacy_id}`);assert.ok(source.includes(a.path||url),`image reference retained ${p.legacy_id}`);}
 for(const el of body.find('a[href]').toArray()){const href=$(el).attr('href');const u=new URL(href,'https://www.ikarp.top');const m=u.pathname.match(/^\/index\.php\/archives\/(\d+)\.html$/);if(m&&['www.ikarp.top','ikarp.top'].includes(u.hostname)&&IDS.includes(Number(m[1]))){assert.ok(href.startsWith('/'),`unlocalized internal link ${p.legacy_id}`);assert.ok((await stat(`public${u.pathname}`)).size);internalLinks++;}if(/\.(pdf|zip|tar|gz|md|docx?|xlsx?|mp[34]|rar|7z)(?:$|\?)/i.test(href))attachments.push({legacy_id:p.legacy_id,url:href,state:'retained-unverified'});}
 if(p.legacy_id===883)assert.equal(p.date.slice(0,10),'2026-09-17');
 embeddedImages+=body.find('img[src^="data:image/"]').length;verified.push(p.legacy_id);code+=p.counts.code;tables+=p.counts.tables;mermaid+=p.counts.mermaid;images+=p.counts.images;
 }catch(e){failures.push({legacy_id:p.legacy_id,error:e.message});}}
for(const a of manifest.assets.filter(x=>x.state==='localized')){try{const bytes=await readFile(`public${a.path}`);assert.equal(hash(bytes),a.sha256);}catch(e){failures.push({asset:a.path,error:e.message});}}
const report={privacy_warnings:[{legacy_id:237,category:'private-key-suspect',status:'pending-manual-key-review',note:'Mathematically valid RSA private key in public tutorial; actual usage unknown. Local copy retained; exclude article 237 from Git pending owner decision. Value intentionally omitted; no automatic redaction.'}],expected:IDS.length,migrated:manifest.post_count,verified:verified.length,verified_ids:verified,code_blocks:code,tables,mermaid,image_references:images,embedded_images:embeddedImages,unique_assets:manifest.assets.length,localized_assets:manifest.assets.filter(a=>a.state==='localized').length,asset_exceptions:manifest.assets.filter(a=>a.state!=='localized'),attachments,internal_links_checked:internalLinks,failures};
await writeFile('migration/report.json.tmp',JSON.stringify(report,null,2)+'\n');await rename('migration/report.json.tmp','migration/report.json');
await writeFile('docs/article-checklist.md','<!-- [skill: go-team-standards · 迁移验收] 每项仅在本地构建与正文验证通过后勾选。 -->\n# Public article migration checklist\n\n'+IDS.map(id=>`- [${verified.includes(id)?'x':' '}] ${id} — /index.php/archives/${id}.html${id===237?' — local verification only; pending-manual-key-review, excluded from Git':''}`).join('\n')+'\n');
console.log(JSON.stringify({...report,verified_ids:undefined,asset_exceptions:report.asset_exceptions.length,attachments:attachments.length,failures:failures.map(f=>({legacy_id:f.legacy_id,check:f.check,error:f.error.slice(0,220)}))},null,2));
if(failures.length||verified.length!==IDS.length)process.exitCode=1;
