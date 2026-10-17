import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { load } from 'cheerio';

test('archive covers load lazily without hiding article links or changing other images', () => {
  let filter = html => html;
  const path = new URL('../scripts/archive.js', import.meta.url);
  if (fs.existsSync(path)) vm.runInNewContext(fs.readFileSync(path, 'utf8'), {
    require: createRequire(import.meta.url),
    hexo: { extend: { filter: { register: (_name, fn) => { filter = fn; } } } }
  });
  const input = '<main id="archive"><a class="article-sort-item-img" href="/archives/abcdef12.html"><img src="/cover.jpg"></a><a class="article-sort-item-title" href="/archives/abcdef12.html">文章</a></main><img id="avatar" src="/avatar.png">';
  const $ = load(filter(input));
  assert.equal($('#archive img').attr('loading'), 'lazy');
  assert.equal($('#archive img').attr('decoding'), 'async');
  assert.equal($('#archive img').attr('src'), '/cover.jpg');
  assert.equal($('.article-sort-item-title').text(), '文章');
  assert.equal($('#avatar').attr('loading'), undefined);
  const other = '<main id="recent-posts"><img src="/cover.jpg"></main>';
  assert.equal(filter(other), other);
});
