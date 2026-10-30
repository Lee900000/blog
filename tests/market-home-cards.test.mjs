import { createRequire as routeRequire } from 'node:module';
const articleRoutes = routeRequire(import.meta.url)('../article-routes.json');
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { load } from 'cheerio';

const renderedListPages = [
  new URL('../public/index.html', import.meta.url),
  ...readdirSync(new URL('../public/page/', import.meta.url))
    .map(page => new URL(`../public/page/${page}/index.html`, import.meta.url))
];
const findArticleCard = route => {
  for (const page of renderedListPages) {
    const $ = load(readFileSync(page, 'utf8'));
    const title = $(`a.article-title[href="/${route}"]`).first();
    if (title.length) return { $, title };
  }
  return null;
};
const cards = [
  {
    id: 884,
    cover: '/assets/market-series/nvda.jpg',
    description: '拆解币安上的 NVDA 真股票、bStocks、永续与期权，比较定价来源、流动性、周末交易和产品权利边界。'
  },
  {
    id: 885,
    cover: '/assets/market-series/commodities.jpg',
    description: '盘点币安黄金、白银、原油、铜等大宗商品永续与期权，分析指数来源、流动性、休市定价和主要风险。'
  },
  {
    id: 886,
    cover: '/assets/market-series/fx.jpg',
    description: '梳理币安外汇永续与法币现货，说明指数构成、USDT 影响、流动性差异、资金费率和产品边界。'
  },
  {
    id: 887,
    cover: '/assets/market-series/index.jpg',
    description: '梳理币安股票指数、ETF 永续、主题指数与相关代币化产品，分析定价来源、成分结构、流动性和风险。'
  }
];

test('market series cards retain covers and human summaries across paginated article lists', () => {
  for (const expected of cards) {
    const found = findArticleCard(articleRoutes[expected.id]);
    assert.ok(found, `card ${expected.id} exists`);
    const { title } = found;
    const card = title.closest('.recent-post-item');
    assert.equal(card.find(`img[src="${expected.cover}"]`).length, 1, `card ${expected.id} cover`);
    const summary = card.find('.content').text().replace(/\s+/g, ' ').trim();
    assert.equal(summary, expected.description);
    assert.doesNotMatch(summary, /\.market-report|\.nvda-report|--bg:|<style>/);
  }
});
