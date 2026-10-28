import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { load } from 'cheerio';
import YAML from 'yaml';
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const page = route => load(read(`public/${route}`));
const manifest = JSON.parse(read('migration/manifest.json'));
const articleRoutes = JSON.parse(read('article-routes.json'));
const theme = YAML.parse(read('_config.butterfly.yml'));

test('built search XML covers every public article without printing indexed content', () => {
  assert.ok(existsSync(new URL('../public/search.xml', import.meta.url)), 'generated search index exists');
  const $ = load(read('public/search.xml'), {xml: true});
  const publicRoutes = Object.values(articleRoutes);
  assert.equal($('entry').length, publicRoutes.length);
  const routes = new Set($('entry > url').map((_, node) => new URL($(node).text(), 'http://localhost:4000').pathname).get());
  assert.equal(routes.size, publicRoutes.length);
  for (const route of publicRoutes) assert.ok(routes.has(`/${route}`), `indexed route ${route}`);
  const home = page('index.html');
  assert.equal(home('#local-search input').length, 1);
  assert.ok(home('script[src]').toArray().some(node => home(node).attr('src').includes('local-search')));
});

test('native taxonomy, archive, empty shuoshuo and genuine friends render', () => {
  const tags = page('tags/index.html');
  const categories = page('categories/index.html');
  const expectedTags = new Set(manifest.posts.flatMap(post => post.tags));
  const expectedCategories = new Set(manifest.posts.flatMap(post => post.categories).flat(Infinity));
  assert.ok(tags('.tag-cloud-list a').length >= expectedTags.size, 'all imported tags remain visible alongside newer tags');
  assert.ok(categories('.category-list-item').length >= expectedCategories.size, 'all imported categories remain visible alongside newer categories');
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
  const publicArticleCount = Object.keys(articleRoutes).length;
  assert.ok($('.card-webinfo .webinfo-item').first().text().includes(String(publicArticleCount)));
  assert.equal($('#runtimeshow').attr('data-publishdate'), new Date('2015-07-01T00:00:00+09:00').toISOString());
  assert.equal($('[id^="busuanzi_value"]').length, 0);
  assert.equal($('.site-data .length-num').first().text(), String(publicArticleCount));
});

test('about page loads the generated Token usage display without exposing source logs', () => {
  const about = page('about/index.html');
  assert.equal(about('#token-usage').length, 1);
  assert.ok(about('script[src]').toArray().some(node => about(node).attr('src').includes('token-usage.js')));
  assert.ok(existsSync(new URL('../public/assets/token-usage.json', import.meta.url)));
  const report = JSON.parse(read('public/assets/token-usage.json'));
  assert.ok(report.totals.totalTokens > 0);
  assert.ok(report.agents.every(agent => !Object.hasOwn(agent, 'sessions')));
});

test('Giscus renders on every public article only and has no homepage comments feed', () => {
  for (const [legacyId, route] of Object.entries(articleRoutes)) {
    const $ = page(route);
    assert.equal($('#giscus-wrap').length, 1, `article ${legacyId} comment container`);
    assert.ok($('script:not([src])').text().includes("'data-repo': 'kary2999/tago-comments'"), `article ${legacyId} discussion repository`);
    assert.ok($('script:not([src])').text().includes('"data-mapping":"pathname"'), `article ${legacyId} fixed path mapping`);
  }
  const home = page('index.html');
  assert.equal(home('#card-newest-comments').length, 0);
  assert.equal(home('#giscus-wrap').length, 0);
});

test('mysql incremental-upgrades article has a stable public route and developer SQL examples', () => {
  const post = read('source/_posts/898.md');
  assert.match(post, /title: MySQL 5\.7 到 8\.4：给 InnoDB 旧表的增量升级清单/);
  assert.match(post, /CONSTRAINT ck_orders_positive_qty CHECK \(qty > 0\)/);
  assert.match(post, /CONSTRAINT ck_orders_rest_qty CHECK \(rest_qty >= 0 AND rest_qty <= qty\)/);
  assert.match(post, /ERROR 3819 \(HY000\): Check constraint 'ck_orders_rest_qty' is violated/);
  assert.match(post, /max_connections.*151/);
  assert.match(post, /REPEATABLE READ/);
  assert.match(post, /GitHub 2018 MySQL 集群网络分区/);
  assert.match(post, /character_set_client/);
  assert.match(post, /SET NAMES utf8mb4/);
  assert.match(post, /Illegal mix of collations/);
  assert.match(post, /permalink: archives\/[a-f0-9]{8}\.html/);
});
