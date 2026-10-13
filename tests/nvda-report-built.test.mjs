import { createRequire as routeRequire } from 'node:module';
const articleRoutes = routeRequire(import.meta.url)('../article-routes.json');
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { load } from 'cheerio';

const html = readFileSync(new URL(`../public/${articleRoutes[884]}`, import.meta.url), 'utf8');
const $ = load(html);
const report = $('.nvda-report');

test('NVDA report renders its article-only visual system inside Butterfly', () => {
  assert.equal(report.length, 1);
  assert.equal(report.find('h1').length, 0, 'Butterfly owns the page title');
  assert.ok(report.find('.card.tldr').length > 0);
  assert.ok(report.find('.card.warnbox').length > 0);
  assert.ok(report.find('.grid .k').length > 0);
  assert.ok(report.find('.tw table').length >= 4);
  assert.ok(report.find('nav a[href="#s0"]').length === 1);

  const styles = $('style').text();
  assert.match(styles, /\.nvda-report\s*\{/);
  assert.match(styles, /\[data-theme=['"]dark['"]\]\s+\.nvda-report/);
  assert.match(styles, /--ok:#1a7f4b/);
  assert.match(styles, /--warn:#b45309/);
  assert.match(styles, /--bad:#b91c1c/);
});

test('NVDA report preserves confidence colours and every cited external link', () => {
  for (const [label, className] of [['实测', 'v'], ['转述', 'g'], ['未证实', 'u'], ['推论', 'tag']]) {
    const matches = report.find(`.${className}`).filter((_, node) => $(node).text().trim() === label);
    assert.ok(matches.length > 0, `${label} remains visually identified`);
  }

  const expected = [
    'https://www.binance.com/en/academy/articles/what-are-bstocks-a-guide-to-tokenized-stocks-on-binance',
    'https://www.binance.com/en/support/faq/detail/f0c03cd6509a4085b4cce1636f16be38',
    'https://www.manilatimes.net/2026/06/12/tmt-newswire/pr-newswire/binance-exchange-launches-bstocks-tokenized-securities-11-backing-and-247-trading/2364231/amp',
    'https://yellow.com/asset/nvdab',
    'https://www.techflowpost.com/en-US/newsletter/136294',
    'https://phemex.com/academy/tradfi-perpetuals-moving-during-us-market-closed',
    'https://www.prnewswire.com/news-releases/binance-adds-us-stock-options-to-its-multi-asset-platform-302866167.html',
    'https://cryptoslate.com/binance-deepens-tradfi-push-with-physically-settled-options-on-over-1000-us-equities/',
    'https://www.binance.com/zh-CN/stocks/options/EQ_NVDA',
    'https://www.binance.com/en/support/faq/detail/a7469c7703524024b5bc2d492b03639d'
  ];

  const links = new Map();
  report.find('a[href^="http"]').each((_, node) => links.set($(node).attr('href'), node));
  for (const href of expected) {
    const node = links.get(href);
    assert.ok(node, `preserves ${href}`);
    assert.equal($(node).attr('target'), '_blank');
    assert.match($(node).attr('rel') ?? '', /noopener/);
    assert.match($(node).attr('rel') ?? '', /noreferrer/);
  }
});
