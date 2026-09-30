import test from 'node:test';
import assert from 'node:assert/strict';
import {extractPost} from '../migration/extractor.mjs';
import {markdownCodes,renderedCode,expectedHighlightedCode} from '../migration/verification-helpers.mjs';
import {load} from 'cheerio';
test('rendered code restores highlighter br line boundaries and common indent only',()=>{const $=load('<figure><td></td><pre><span class="line">x</span><br><span class="line">  y</span><br></pre></figure>');assert.equal(renderedCode($,$('figure')[0]),'x\n  y');assert.equal(expectedHighlightedCode('    x\n      y\n'),'x\n  y');});
test('verification reads exact nested-list and blockquote code, including blank lines',()=>{
const html='<article><h1>X</h1><time datetime="2020-01-01T00:00:00+09:00"></time><div class="prose"><ul><li>First<pre><code> a\n\n b\n</code></pre></li></ul><blockquote><pre><code>x\n y</code></pre></blockquote></div></article>';
const p=extractPost(html,1);assert.deepEqual(markdownCodes(p.body),p.code);
});
