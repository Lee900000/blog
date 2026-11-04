import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require=createRequire(import.meta.url);
const { uniqueCopy }=require('../source/assets/crypto-glossary/copy-dedup.js');
test('expanded supplementary copy never repeats the main definition or warnings',()=>{
  const definition='与交易平台相关的代币，可能用于手续费折扣或其他权益。';
  assert.deepEqual(uniqueCopy([definition,' '+definition+' ','另一条有用说明。','另一条有用说明。'],[definition]),['另一条有用说明。']);
});
test('differences in substantive wording are retained',()=>{
  assert.deepEqual(uniqueCopy(['不含手续费。','包含手续费。']),['不含手续费。','包含手续费。']);
  assert.deepEqual(uniqueCopy(['mgnRatio（账户级）','mgnRatio（持仓级）']),['mgnRatio（账户级）','mgnRatio（持仓级）']);
  assert.deepEqual(uniqueCopy(['mgnRatio（账户级）','mgnRatio(账户级)']),['mgnRatio（账户级）']);
});
test('reader has no duplicated source archive and opens all surviving disclosures',()=>{
  const source=readFileSync('source/assets/crypto-glossary/directory-reader.js','utf8');
  assert.doesNotMatch(source,/summary\.textContent='查看资料原文与核对记录'/);
  assert.match(source,/detail\.open\s*=\s*true/);
});
