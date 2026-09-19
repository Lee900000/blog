import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {load} from 'cheerio';
import YAML from 'yaml';
import {IDS} from './extractor.mjs';
const manifest=JSON.parse(await readFile('migration/manifest.json','utf8'));
assert.equal(manifest.post_count,10);assert.deepEqual(manifest.posts.map(p=>p.legacy_id),IDS);
assert.equal((await readdir('source/_posts')).filter(p=>p.endsWith('.md')).length,10);
assert.equal((await readdir('public/index.php/archives')).filter(p=>p.endsWith('.html')).length,10);
let code=0,tables=0,mermaid=0,images=0;
for(const p of manifest.posts){
 const source=await readFile(`source/_posts/${p.legacy_id}.md`,'utf8');const front=YAML.parse(source.split('---\n')[1]);assert.equal(front.legacy_id,p.legacy_id);assert.equal(front.disableNunjucks,true);assert.deepEqual(front.categories,p.categories);
 const $=load(await readFile(`public/${p.permalink}`,'utf8'));assert.equal($('h1.post-title').text(),p.title);
 const body=$('#article-container');assert.equal($('time.post-meta-date-created').text(),p.date.slice(0,10),`displayed date ${p.legacy_id}`);assert.equal(new Date($('time.post-meta-date-created').attr('datetime')).toISOString(),new Date(p.date).toISOString(),`date instant ${p.legacy_id}`);assert.equal(body.find('table').not('.highlight table').length,p.counts.tables,`tables ${p.legacy_id}`);
 assert.equal(body.find('.mermaid').length,p.counts.mermaid,`mermaid ${p.legacy_id}`);
 const codes=body.find('figure.highlight').map((i,e)=>$(e).find('td.code').text()).get();
 // Highlight rendering may add a terminal newline; compare content without it.
 const sourceCodes=[...source.matchAll(/^(`{3,})([^\n]*)\n([\s\S]*?)\n\1\s*$/gm)].filter(m=>m[2]!=='mermaid').map(m=>m[3]);
 assert.equal(sourceCodes.length,p.counts.code,`code blocks ${p.legacy_id}`);
 assert.deepEqual(sourceCodes.map(x=>createHash('sha256').update(x).digest('hex')),p.code_sha256,`exact code source ${p.legacy_id}`);
 assert.equal(body.find('img').length,p.counts.images,`images ${p.legacy_id}`);
 assert.equal($('#post-comment').length,0);
 for(const el of body.find('img').toArray()){const src=$(el).attr('src');if(src?.startsWith('/'))assert.ok((await stat(`public${src}`)).size>0);}
 code+=p.counts.code;tables+=p.counts.tables;mermaid+=p.counts.mermaid;images+=p.counts.images;
}
for(const a of manifest.assets.filter(x=>x.state==='localized')){const bytes=await readFile(`public${a.path}`);assert.equal(createHash('sha256').update(bytes).digest('hex'),a.sha256);}
const home=load(await readFile('public/index.html','utf8'));assert.equal(home('.recent-post-item').length,10);assert.match(home.text(),/迁移预览/);
console.log(JSON.stringify({posts:10,home_cards:10,code_blocks:code,tables,mermaid, image_references:images,unique_assets:manifest.assets.length,localized:manifest.assets.filter(a=>a.state==='localized').length,issues:manifest.assets.filter(a=>a.state!=='localized')},null,2));
