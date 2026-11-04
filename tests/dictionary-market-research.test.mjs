import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require=createRequire(import.meta.url);
const {entries}=require('../source/assets/crypto-glossary/editorial.js');
const {canonical}=require('../source/assets/crypto-glossary/concepts.js');

test('ETF, ETP and spot ETF remain distinct concepts with stable aliases',()=>{
  assert.equal(canonical('ETF'), 'ETF');
  assert.equal(canonical('交易所交易基金'), 'ETF');
  assert.equal(canonical('ETP'), 'ETP');
  assert.equal(canonical('交易所交易产品'), 'ETP');
  assert.equal(canonical('现货 ETF'), '现货 ETF');
  assert.notEqual(canonical('ETF'),canonical('ETP'));
  assert.notEqual(canonical('ETF'),canonical('现货 ETF'));
});

test('Bid and Ask explain naming, quote perspective and execution with direct sources',()=>{
  const entry=entries['买一 / 卖一与价差'];
  assert.ok(entry);
  const copy=JSON.stringify(entry);
  for(const word of ['出价','要价','买一','卖一','立即买入','立即卖出','不是缩写'])assert.ok(copy.includes(word),word);
  assert.match(copy,/词义|语言/);
  assert.ok(entry.sources.some(([,url])=>url.endsWith('/glossary/bid-price')));
  assert.ok(entry.sources.some(([,url])=>url.endsWith('/glossary/asking-price')));
});

test('fund and product articles explain structures, costs and relationships rather than one-line definitions',()=>{
  for(const name of ['ETF','ETP','现货 ETF']){
    const entry=entries[name];assert.ok(entry,name);
    assert.ok(entry.definition&&entry.example&&entry.cautions.length,name);
    assert.ok(entry.sections.length>=3,name);
    assert.equal(entry.verifiedAt,'2026-11-04');
    for(const section of entry.sections){
      assert.ok(section.title&&section.paragraphs.length,name);
      assert.ok(section.sources.length,name+' section source');
      for(const [,url] of section.sources)assert.ok(entry.sources.some(([,known])=>known===url),url);
    }
    assert.ok(entry.related.length>=2,name+' related entries');
  }
  assert.match(JSON.stringify(entries.ETF),/净值/);
  assert.match(JSON.stringify(entries.ETF),/授权参与机构/);
  assert.match(JSON.stringify(entries.ETF),/主动管理/);
  assert.match(JSON.stringify(entries.ETP),/商品信托/);
  assert.match(JSON.stringify(entries.ETP),/无担保债务/);
  assert.match(JSON.stringify(entries.ETP),/1940/);
  assert.match(JSON.stringify(entries['现货 ETF']),/2025 年 7 月 29 日/);
  assert.doesNotMatch(JSON.stringify(entries['现货 ETF']),/只能现金申赎|只能用现金申赎/);
});

test('reader renders sourced sections and navigable related concepts without raw HTML injection',()=>{
  const js=readFileSync('source/assets/crypto-glossary/directory-reader.js','utf8');
  assert.match(js,/copy\?\.sections/);
  assert.match(js,/copy\?\.related/);
  assert.match(js,/sectionCopy\.sources/);
  assert.match(js,/textContent\s*=\s*relatedEntry\.title/);
});
