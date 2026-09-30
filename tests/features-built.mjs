import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { load } from 'cheerio';
import YAML from 'yaml';
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const page = route => load(read(`public/${route}`));
const manifest = JSON.parse(read('migration/manifest.json'));
const theme = YAML.parse(read('_config.butterfly.yml'));

test('built search XML covers every imported article without printing indexed content', () => {
  assert.ok(existsSync(new URL('../public/search.xml', import.meta.url)), 'generated search index exists');
  const $ = load(read('public/search.xml'), {xml: true});
  assert.equal($('entry').length, manifest.posts.length);
  const routes = new Set($('entry > url').map((_, node) => new URL($(node).text(), 'http://localhost:4000').pathname).get());
  assert.equal(routes.size, manifest.posts.length);
  for (const post of manifest.posts) assert.ok(routes.has(`/${post.permalink}`), `indexed route ${post.legacy_id}`);
  const home = page('index.html');
  assert.equal(home('#local-search input').length, 1);
  assert.ok(home('script[src]').toArray().some(node => home(node).attr('src').includes('local-search')));
});

test('native taxonomy, archive, empty shuoshuo and genuine friends render', () => {
  const tags = page('tags/index.html');
  const categories = page('categories/index.html');
  const expectedTags = new Set(manifest.posts.flatMap(post => post.tags));
  const expectedCategories = new Set(manifest.posts.flatMap(post => post.categories).flat(Infinity));
  assert.equal(tags('.tag-cloud-list a').length, expectedTags.size);
  assert.equal(categories('.category-list-item').length, expectedCategories.size);
  assert.ok(page('archives/index.html')('.article-sort-item').length > 0);
  const shuoshuo = page('shuoshuo/index.html');
  assert.ok(shuoshuo('h1').text().includes('暂无内容'));
  assert.equal(shuoshuo('.shuoshuo-item').length, 0);
  const friends = page('link/index.html');
  const configured = YAML.parse(read('source/_data/link.yml')).flatMap(group => group.link_list);
  assert.equal(friends('.flink-list-item').length, configured.length);
  for (const friend of configured) assert.equal(friends(`.flink-list-item a[href="${friend.link}"]`).length, 1);
});

test('native cards, original hero and ribbon load without fabricated visitor counts', () => {
  const $ = page('index.html');
  assert.ok($('#page-header').attr('style').includes(theme.index_img));
  assert.equal($('#ribbon').length, 1);
  assert.equal($('.card-announcement').length, 1);
  assert.ok($('.card-webinfo .webinfo-item').first().text().includes(String(manifest.posts.length)));
  assert.equal($('#runtimeshow').attr('data-publishdate'), new Date('2015-07-01T00:00:00+09:00').toISOString());
  assert.equal($('[id^="busuanzi_value"]').length, 0);
  assert.equal($('.site-data .length-num').first().text(), String(manifest.posts.length));
});

test('native Twikoo renders all imported articles plus homepage recent-comments wiring', () => {
  assert.ok(existsSync(new URL('../public/assets/vendor/twikoo-1.7.24.all.min.js', import.meta.url)));
  for (const post of manifest.posts) {
    const $ = page(post.permalink);
    assert.equal($('#twikoo-wrap').length, 1, `article ${post.legacy_id} comment container`);
    assert.ok($('script:not([src])').text().includes("envId: 'http://127.0.0.1:8089/'"), `article ${post.legacy_id} local endpoint`);
  }
  const home = page('index.html');
  assert.equal(home('#card-newest-comments').length, 1);
  assert.ok(home('script:not([src])').text().includes('twikoo.getRecentComments'));
});
