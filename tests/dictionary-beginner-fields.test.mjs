import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import vm from 'node:vm';
const require=createRequire(import.meta.url);
const location=new URL('../source/assets/crypto-glossary/beginner-fields.js',import.meta.url);
const load=()=>fs.existsSync(location)?require(location.pathname):{records:{}};

test('every field-directory entry has a substantive beginner explanation',()=>{
  const expected=require('../tools/glossary-inventory.cjs').inventory().filter(e=>e.category!=='资料与公式说明'&&!e.curated&&/^pro-record-/.test(e.id)&&Number(e.id.slice(11))>=157);
  assert.equal(expected.length,200,'inventory partition must remain visible');
  const {records}=load();
  assert.deepEqual(Object.keys(records).sort(),expected.map(e=>e.id).sort());
  for(const entry of expected){
    const copy=records[entry.id];
    assert.ok((copy.definition.match(/[\u3400-\u9fff]/g)||[]).length>=35,`${entry.id}: explain what it means and why it matters`);
    assert.ok((copy.example.match(/[\u3400-\u9fff]/g)||[]).length>=25,`${entry.id}: a concrete beginner example`);
    assert.ok(copy.cautions?.length&&copy.cautions.every(x=>x.length>=12),`${entry.id}: specific cautions`);
    assert.ok(copy.sources?.length&&copy.sources.every(([label,url])=>label&&/^https:\/\//.test(url)),`${entry.id}: linked primary sources`);
    assert.doesNotMatch(JSON.stringify(copy),/\bF\d+\b|TODO|待补充|页面字段|原文缺失|\[S\d+\]/);
    assert.ok(/[\u3400-\u9fff]/.test(copy.title||entry.title),`${entry.id}: Chinese title for raw API fields`);
  }
});

test('settlement frequency explains funding, timing and the limits of the numerical example',()=>{
  const copy=load().records['pro-record-552'];
  assert.ok(copy,'结算频率 has actual teaching copy');
  assert.match(copy.definition,/资金费/);
  assert.match(copy.definition,/间隔|每隔/);
  assert.match(copy.example,/8\s*小时/);
  assert.match(copy.example,/3\s*次/);
  assert.match(copy.example,/1\s*小时/);
  assert.match(copy.example,/24\s*次/);
  assert.match(copy.cautions.join(''),/到期|交割/);
  assert.match(copy.cautions.join(''),/不.*固定|不.*保证|不能.*倍/);
  assert.equal(copy.calculator,'settlement-frequency');
});

test('field module works in the reader browser without CommonJS',()=>{
  assert.ok(fs.existsSync(location),'field module exists');
  const window={};
  vm.runInNewContext(fs.readFileSync(location,'utf8'),{window});
  assert.equal(Object.keys(window.GlossaryBeginnerFields.records).length,200);
  assert.match(window.GlossaryBeginnerFields.records['pro-record-550'].definition,/币本位|反向/);
});

test('account and financial field pairs retain their different units and scope',()=>{
  const {records}=load();
  for(const id of [503,504,505,506,507,508,509,510,511,528,550,564])assert.ok(records[`pro-record-${id}`],String(id));
  assert.match(records['pro-record-503'].definition,/USD|美元/);
  assert.match(records['pro-record-506'].definition,/币种/);
  assert.match(records['pro-record-528'].definition,/金额|收益率/);
  assert.match(records['pro-record-564'].cautions.join(''),/币|单位/);
  assert.match(records['pro-record-287'].definition,/撤单/);
  assert.doesNotMatch(records['pro-record-287'].definition,/允许.*挂单/);
});
