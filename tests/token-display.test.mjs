import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

test('token panel shows today and provides a selectable daily calendar', async () => {
  class Element {
    constructor(tag) { this.tagName = tag; this.children = []; this.dataset = {}; this.listeners = {}; this.textContent = ''; }
    append(...items) { this.children.push(...items); }
    replaceChildren(...items) { this.children = items; }
    setAttribute(name, value) { this[name] = value; }
    addEventListener(name, fn) { this.listeners[name] = fn; }
  }
  const root = new Element('div');
  const document = { createElement: tag => new Element(tag), getElementById: () => root, addEventListener() {} };
  const report = { timezone: 'Asia/Tokyo', totals: { inputTokens: 20010, totalTokens: 20010, costUsd: 12 }, agents: [{ name: 'Codex', totalTokens: 20010 }], days: 2, daily: { '2026-11-05': { inputTokens: 10 }, '2026-11-06': { inputTokens: 20000 } } };
  class FixedDate extends Date { constructor(...args) { super(...(args.length ? args : ['2026-11-06T03:00:00Z'])); } }
  vm.runInNewContext(readFileSync(new URL('../source/js/token-usage.js', import.meta.url), 'utf8'), { document, Date: FixedDate, Intl, fetch: async () => ({ ok: true, json: async () => report }) });
  await new Promise(resolve => setImmediate(resolve));
  const flatten = n => [n, ...n.children.flatMap(flatten)];
  let nodes = flatten(root);
  assert.ok(nodes.some(n => n.textContent === '今日 Token'));
  assert.ok(nodes.some(n => n.textContent === '6 万'));
  assert.ok(nodes.some(n => n.textContent.includes('原始 Token 用量的 3 倍')));
  assert.ok(nodes.some(n => n.textContent === 'US$12'));
  assert.ok(nodes.some(n => n.textContent === '1月'));
  assert.ok(nodes.some(n => n.textContent === '12月'));
  const day = nodes.find(n => n['aria-label']?.includes('2026-11-05'));
  assert.ok(day);
  day.listeners.click();
  nodes = flatten(root);
  assert.ok(nodes.some(n => n.textContent.includes('2026-11-05') && n.textContent.includes('30')));
  assert.equal(report.daily['2026-11-05'].inputTokens, 10);
});
