import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const postPath = new URL('../source/_posts/888.md', import.meta.url);
const generatedArticlePath = new URL('../public/index.php/archives/888.html', import.meta.url);
const generatedHomePath = new URL('../public/index.html', import.meta.url);

test('article 888 preserves the final aggregate report as a scoped blog post', async () => {
  const post = await readFile(postPath, 'utf8');

  assert.match(post, /^title: 币安衍生品与 TradFi 业务全景$/m);
  assert.match(post, /^legacy_id: 888$/m);
  assert.match(post, /^permalink: index\.php\/archives\/888\.html$/m);
  assert.match(post, /^date: 2026-10-03 21:00:00$/m);
  assert.match(post, /^cover: \/assets\/market-series\/binance-overview\.svg$/m);
  assert.match(post, /^description: .+$/m);
  assert.match(post, /^postDesc: .+$/m);
  assert.match(post, /<div class="market-report">/);
  assert.match(post, /<h2[^>]*>先看结论<\/h2>/);
  assert.match(post, /价格是怎么来的（重点）/);
  assert.match(post, /小体量交易所依托币安做这些业务/);
  assert.match(post, /<h2[^>]*>来源<\/h2>/);

  const externalLinks = post.match(/href="https:\/\//g) ?? [];
  assert.equal(externalLinks.length, 18, 'all 18 external sources from the final report must remain linked');

  for (const id of [884, 885, 886, 887]) {
    assert.match(post, new RegExp(`/index\\.php/archives/${id}\\.html`));
  }

  assert.doesNotMatch(post, /(^|[}\s])body\s*\{/m);
  assert.doesNotMatch(post, /(^|[}\s])main\s*\{/m);
  assert.doesNotMatch(post, /:root\s*\{/);
});

test('generated site exposes article 888 and a clean homepage card', async () => {
  const [article, home] = await Promise.all([
    readFile(generatedArticlePath, 'utf8'),
    readFile(generatedHomePath, 'utf8'),
  ]);

  assert.match(article, /币安衍生品与 TradFi 业务全景/);
  assert.match(article, /先看结论/);
  assert.match(article, /<table/);
  assert.match(article, /binance-docs\.github\.io\/Brokerage-API/);
  for (const id of [884, 885, 886, 887]) {
    assert.match(article, new RegExp(`index\\.php/archives/${id}\\.html`));
  }

  assert.match(home, /assets\/market-series\/binance-overview\.svg/);
  assert.match(home, /汇总币安股票、代币化股票、商品、外汇、指数、ETF、期货与其他衍生品/);
  assert.doesNotMatch(home, /\.market-report\{--bg:#fafaf8/);
});
