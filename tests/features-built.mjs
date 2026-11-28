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
    assert.ok($('script:not([src])').text().includes("'data-repo': 'Lee900000/tago-comments'"), `article ${legacyId} discussion repository`);
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
  assert.match(post, /cover: \/assets\/mysql-upgrade\/innodb-upgrade-hero\.jpg/);
  assert.match(post, /top_img: \/assets\/mysql-upgrade\/innodb-upgrade-hero\.jpg/);
  assert.match(post, /permalink: archives\/[a-f0-9]{8}\.html/);
});

test('recent quant-risk review uses a local hero image', () => {
  const post = read('source/_posts/897.md');
  assert.match(post, /cover: \/assets\/quant-risk-review\/performance-review-hero\.jpg/);
  assert.match(post, /top_img: \/assets\/quant-risk-review\/performance-review-hero\.jpg/);
});

test('database landscape article separates relational, non-relational, analytical and streaming choices', () => {
  const post = read('source/_posts/899.md');
  assert.match(post, /DB-Engines/);
  assert.match(post, /Stack Overflow 2026/);
  assert.match(post, /关系型数据库：保存订单、账户与最终事实/);
  assert.match(post, /非关系型与专用数据存储/);
  assert.match(post, /数仓与分析/);
  assert.match(post, /接入成本如何理解/);
  assert.match(post, /版本怎么看：最新不等于主流/);
  assert.match(post, /版本快照（最新 \/ 主流）/);
  assert.match(post, /最新：\*\*9\.7\.4 LTS\*\*[\s\S]*主流：\*\*8\.4 LTS\*\*/);
  assert.match(post, /授权 \/ 付费方式/);
  assert.match(post, /cdn\.simpleicons\.org/);
  assert.match(post, /开源 Apache-2\.0/);
  assert.match(post, /源码可见/);
  assert.match(post, /云服务按计算 \/ 存储计费/);
  assert.match(post, /最佳使用场景/);
  assert.match(post, /Apache Kafka/);
  assert.match(post, /Apache Pulsar/);
  assert.match(post, /不参加数据库排名/);
  assert.match(post, /permalink: archives\/[a-f0-9]{8}\.html/);
});

test('liquidation guide distinguishes liquidation, insurance funds, ADL and mark-price verification', () => {
  const post = read('source/_posts/900.md');
  assert.match(post, /title: 你的仓位是怎么被平仓的：从强平、风险基金到 ADL/);
  assert.match(post, /插针、维持保证金不足与没有阶梯/);
  assert.match(post, /ADL 与“风险基金看起来没有用”/);
  assert.match(post, /用户怀疑标记价被“做出来了”/);
  assert.match(post, /liquidation-risk-engine\.jpg/);
  assert.match(post, /liquidation-verification-path\.svg/);
  assert.match(post, /scenario-wick-and-margin\.svg/);
  assert.match(post, /scenario-insurance-fund-adl\.svg/);
  assert.match(post, /scenario-mark-price-audit\.svg/);
  assert.match(post, /binance\.com\/en\/support\/faq\/detail\/360033525371/);
  assert.match(post, /hyperliquid\.gitbook\.io\/hyperliquid-docs\/trading\/liquidations/);
  assert.match(post, /permalink: archives\/[a-f0-9]{8}\.html/);
  assert.doesNotMatch(post, /\/(?:Volumes|Users)\//, 'public post does not disclose local filesystem paths');
});
