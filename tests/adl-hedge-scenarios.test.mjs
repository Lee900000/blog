import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync, existsSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const require = createRequire(import.meta.url);
const model = require('../source/assets/adl-hedge/model.js');
const near = (a, b) => assert.ok(Math.abs(a - b) < 0.000001, `${a} != ${b}`);

test('平仓以后同价补仓，组合价值在后续价格下保持不变', () => {
  const state = model.afterAdl(10000, 10, 5);
  near(state.coins, 2000);
  near(model.value(state.coins, 10000, 5, 7), 10000);
});

test('不补仓后价值随持币价格变化', () => {
  const state = model.afterAdl(10000, 10, 9);
  near(model.value(state.coins, 0, 9, 5), 10000 * 5 / 9);
});

test('延迟按同张数补仓不一定恢复中性', () => {
  const state = model.afterAdl(10000, 10, 3);
  near(model.value(state.coins, 10000, 5, 7), 10000 * 7 / 3 + (10000 / 7 - 10000 / 5) * 7);
});

test('滑点使补仓前损益和补仓后剩余敞口可见', () => {
  const state = model.afterAdl(10000, 10, 5);
  near(model.value(state.coins, 10000, 4.9, 4.9), 9800);
  near(model.deltaCoins(state.coins, 10000, 4.9), -40.81632653061206);
});

test('非正价格被拒绝', () => {
  assert.throws(() => model.afterAdl(10000, 10, 0), RangeError);
  assert.throws(() => model.value(2000, 10000, 5, -1), RangeError);
});

test('参考文档三种 ADL 时点及价格路径与对冲基准一致', () => {
  const early = model.afterAdl(1000, 10, 9);
  near(model.value(early.coins, 0, 9, 7.5), 833.3333333333334);
  near(model.value(early.coins, 0, 9, 3), 333.3333333333333);
  const middle = model.afterAdl(1000, 10, 5);
  near(model.value(middle.coins, 0, 5, 3), 600);
  near(model.value(middle.coins, 0, 5, 7.5), 1500);
  const bottom = model.afterAdl(1000, 10, 3);
  near(model.value(bottom.coins, 0, 3, 7.5), 2500);
  near(model.value(bottom.coins, 1000, 3, 7.5), 1000);
});

test('OKX 历史一分钟 K 线覆盖插针且时间和价格可核对', () => {
  const path = new URL('../source/assets/adl-hedge/okx-uni-20251010.json', import.meta.url);
  assert.ok(existsSync(path), '缺少 OKX 历史 K 线数据');
  const data = JSON.parse(readFileSync(path, 'utf8'));
  assert.equal(data.instrument, 'UNI-USD-SWAP');
  assert.equal(data.candles.length, 60);
  const low = data.candles.find(c => c.time === 1760131320000);
  assert.equal(low.low, 2.226);
  assert.equal(low.close, 2.251);
  for (const [i, candle] of data.candles.entries()) {
    assert.equal(candle.time, 1760130000000 + i * 60000);
    assert.ok(candle.low <= Math.min(candle.open, candle.close));
    assert.ok(candle.high >= Math.max(candle.open, candle.close));
  }
});

test('币本位分档补空按倒数价格计算，不把 K 线当盘口', () => {
  const inverse = 400 / 2.5 + 300 / 2.4 + 300 / 2.2;
  near(1000 / inverse, 2.373247033441208);
  near((400 - inverse) * 2.5, -53.409090909090935);
  const article = readFileSync(new URL('../source/_posts/adl-hedge-reopen-scenarios.md', import.meta.url), 'utf8');
  assert.match(article, /买盘太薄时，市价补空可能滑价/);
  assert.match(article, /K 线不能告诉我们当时的盘口深度/);
});

test('每批市价卖出按买盘逐档成交，数量不足保留缺口', () => {
  const result = model.fillSell([[2.5, 40], [2.4, 30], [2.2, 20]], 100);
  assert.equal(result.filled, 90);
  assert.equal(result.remaining, 10);
  near(result.avgPrice, 900 / (400 / 2.5 + 300 / 2.4 + 200 / 2.2));
  assert.equal(result.worst, 2.2);
});

test('历史盘口 50 笔补空分别计算未限价与 1% 价格保护', () => {
  const { snapshots } = JSON.parse(readFileSync(new URL('../source/assets/adl-hedge/okx-batch-orderbook.json', import.meta.url), 'utf8'));
  assert.equal(snapshots.length, 50);
  assert.equal(snapshots[0].time, 1760131380000);
  assert.equal(snapshots.at(-1).time, 1760134320000);
  let unguarded = 0, guarded = 0;
  for (const s of snapshots) {
    assert.ok(s.lastUpdate <= s.time);
    unguarded += model.fillSell(s.bids, 100).filled;
    guarded += model.fillSell(s.bids, 100, s.bids[0][0] * .99).filled;
  }
  assert.equal(unguarded, 4989);
  assert.equal(guarded, 4555);
});

test('K 线进入视野自动播放，速度加倍且手动暂停后不自动重启', async () => {
  const dom = new JSDOM('<div class="adl-sim" data-adl-case="early"></div>', { runScripts: 'outside-only', pretendToBeVisual: true });
  const { window } = dom;
  const candles = JSON.parse(readFileSync(new URL('../source/assets/adl-hedge/okx-uni-20251010.json', import.meta.url), 'utf8'));
  window.AdlModel = model;
  window.fetch = async () => ({ ok: true, json: async () => candles });
  window.matchMedia = () => ({ matches: false });
  let observer, tick, interval;
  window.IntersectionObserver = class { constructor(fn) { observer = fn; } observe() {} };
  window.setInterval = (fn, ms) => { tick = fn; interval = ms; return 1; };
  window.clearInterval = () => { tick = null; };
  window.eval(readFileSync(new URL('../source/assets/adl-hedge/scenarios.js', import.meta.url), 'utf8'));
  await new Promise(resolve => setImmediate(resolve));
  const slider = window.document.querySelector('.adl-range');
  const play = window.document.querySelector('.adl-play');
  observer([{ isIntersecting: true }]);
  assert.equal(interval, 175);
  assert.match(play.textContent, /暂停/);
  tick();
  assert.equal(slider.value, '1');
  play.click();
  assert.equal(tick, null);
  observer([{ isIntersecting: false }]);
  observer([{ isIntersecting: true }]);
  assert.equal(tick, null);
  dom.window.close();
});
