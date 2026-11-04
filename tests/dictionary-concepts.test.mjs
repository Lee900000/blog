import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { canonical, mergeEntries, displayTitle } = require('../source/assets/crypto-glossary/concepts.js');

test('public labels do not expose chapter numbers or source reference codes', () => {
  assert.equal(displayTitle('17.2 强平价格（F6、F7、F8、F20）'), '强平价格');
  assert.equal(displayTitle('专业词典 · 13.2 公式总表'), '专业词典 · 公式总表');
  assert.equal(displayTitle('F6', 'U 本位强平'), 'U 本位强平');
  assert.equal(displayTitle('资金费率（Funding Rate）'), '资金费率（Funding Rate）');
  assert.equal(displayTitle('24 小时涨跌幅'), '24 小时涨跌幅');
  assert.equal(displayTitle('8 小时平均溢价指数'), '8 小时平均溢价指数');
});

test('introductory names, professional synonyms and fields resolve to one concept', () => {
  for (const names of [
    ['资金费率（Funding Rate）','资金费率','17.3 资金费率（F1）','fundingRate'],
    ['初始保证金（Initial Margin）','起始保证金','initialMargin'],
    ['强平价格 / 预估强平价（Liquidation Price）','强平价','liquidationPrice'],
    ['开仓均价 / 持仓均价（Entry Price）','开仓均价','entryPrice']
  ]) assert.equal(new Set(names.map(canonical)).size, 1, names.join(','));
});
test('different quantities stay distinct', () => {
  assert.notEqual(canonical('资金费率'), canonical('资金费用'));
  assert.notEqual(canonical('钱包余额'), canonical('全仓钱包余额'));
  assert.notEqual(canonical('维持保证金'), canonical('维持保证金率'));
});
test('merged entries retain original ids, descriptions, nodes and categories', () => {
  const a={title:'资金费率（Funding Rate）',id:'a',category:'入门',professional:false,text:'definition',nodes:['a']};
  const b={title:'fundingRate',id:'b',category:'字段',professional:true,text:'field',nodes:['b']};
  const [entry]=mergeEntries([a,b]);
  assert.deepEqual(entry.aliasIds,['a','b']);
  assert.deepEqual(entry.nodes,['a','b']);
  assert.equal(entry.members.length,2);
  assert.ok(entry.text.includes('definition')&&entry.text.includes('field'));
  assert.deepEqual(entry.categories,['入门','字段']);
});
