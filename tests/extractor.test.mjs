import test from 'node:test';
import assert from 'node:assert/strict';
import {extractPost} from '../migration/extractor.mjs';
test('article-scoped extraction preserves technical content and independent taxonomy',()=>{
 const p=extractPost(`<h1>Site</h1><aside><a href='/category/no/'>Wrong</a></aside><article><header><h1>Actual title</h1><time datetime='2026-09-17T02:18:00+09:00'></time><a href='/index.php/category/a/'>A</a><a href='/index.php/category/b/'>B</a></header><div class='prose'><p>Body</p><pre><code class='lang-js'>if (a &lt; b) {\n  {{ x }}\n}</code></pre><table><tr><th>X</th></tr><tr><td>Y</td></tr></table><div class='mermaid'>graph TD\nA--&gt;B</div><a href='/index.php/archives/882.html'>Local</a><a href='/index.php/archives/20.html'>Old</a></div><a href='/index.php/tag/t/'>Tag</a></article>`,883);
 assert.equal(p.title,'Actual title'); assert.deepEqual(p.categories,[['A'],['B']]); assert.deepEqual(p.tags,['Tag']); assert.equal(p.date,'2026-09-17T02:18:00+09:00'); assert.equal(p.permalink,'index.php/archives/883.html'); assert.equal(p.legacy_id,883); assert.match(p.body,/if \(a < b\)/); assert.match(p.body,/\{\{ x \}\}/); assert.match(p.body,/```mermaid\ngraph TD\nA-->B/); assert.match(p.body,/\/index.php\/archives\/882.html/); assert.match(p.body,/\/index.php\/archives\/20.html/); assert.equal(p.counts.code,1); assert.equal(p.counts.tables,1);
});
