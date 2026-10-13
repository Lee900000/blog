import { createRequire as routeRequire } from 'node:module';
const articleRoutes = routeRequire(import.meta.url)('../article-routes.json');
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { load } from 'cheerio';

const $ = load(readFileSync(new URL('../public/index.html', import.meta.url), 'utf8'));
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

test('market series homepage cards use covers and human summaries instead of article CSS', () => {
  for (const expected of cards) {
    const title = $(`a.article-title[href="/${articleRoutes[expected.id]}"]`).first();
    assert.equal(title.length, 1, `card ${expected.id} exists`);
    const card = title.closest('.recent-post-item');
    assert.equal(card.find(`img[src="${expected.cover}"]`).length, 1, `card ${expected.id} cover`);
    const summary = card.find('.content').text().replace(/\s+/g, ' ').trim();
    assert.equal(summary, expected.description);
    assert.doesNotMatch(summary, /\.market-report|\.nvda-report|--bg:|<style>/);
  }
});
