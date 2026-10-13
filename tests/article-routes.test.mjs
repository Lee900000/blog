import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);

test('article routes are persistent, random, unique and exclude held articles', () => {
  const { assignRoutes } = require('../tools/article-routes.cjs');
  const first = assignRoutes(['890', '891', '237', '704'], {});
  assert.match(first['890'], /^archives\/[a-f0-9]{8}\.html$/);
  assert.notEqual(first['890'], first['891']);
  assert.equal(first['237'], undefined);
  assert.equal(first['704'], undefined);
  assert.deepEqual(assignRoutes(['890', '891'], first), first);
  assert.throws(() => assignRoutes(['890'], {890:'archives/890.html'}));
});

test('Hexo validates its stored frontmatter route and rejects unprepared or held posts', () => {
  const routes = require('../article-routes.json');
  let filter;
  vm.runInNewContext(readFileSync(new URL('../scripts/article-routes.js', import.meta.url), 'utf8'), {
    require: createRequire(new URL('../scripts/article-routes.js', import.meta.url)),
    hexo: {base_dir: fileURLToPath(new URL('..', import.meta.url)), extend:{filter:{register:(_, fn) => { filter = fn; }}}}
  });
  assert.doesNotThrow(() => filter({layout:'post', legacy_id:890, __permalink:routes['890'], content:'hello'}));
  assert.throws(() => filter({layout:'post', legacy_id:890, __permalink:'archives/890.html', content:''}), /routes:prepare/);
  assert.throws(() => filter({layout:'post', legacy_id:237, content:''}), /Blocked/);
  assert.doesNotThrow(() => filter({layout:'post', legacy_id:237, published:false, content:''}));
});

test('legacy internal article URLs rewrite without changing unrelated external URLs', () => {
  const { rewriteLinks } = require('../tools/article-routes.cjs');
  const routes = {'890':'archives/abcdef0123456789.html'};
  for (const old of ['/index.php/archives/890.html', '/archives/890.html', 'https://leon-book.github.io/index.php/archives/890.html', 'https://www.ikarp.top/index.php/archives/890.html']) {
    assert.equal(rewriteLinks(`[x](${old}?a=1#part)`, routes), '[x](/archives/abcdef0123456789.html?a=1#part)');
  }
  assert.equal(rewriteLinks('https://example.com/index.php/archives/890.html', routes), 'https://example.com/index.php/archives/890.html');
  assert.equal(rewriteLinks('[held](/index.php/archives/237.html)', routes), '[held](/404.html)');
});
