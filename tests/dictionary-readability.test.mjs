import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
const require=createRequire(import.meta.url);

test('short curated ratio and average definitions explain the concept in ordinary language',()=>{
  const entries=require('../source/assets/crypto-glossary/editorial.js').entries;
  for(const name of ['平均溢价指数','初始保证金率'])assert.ok(entries[name].definition.length>=35,name);
});

test('all current main entries have real explanations and examples, not source notes',()=>{
  const entries=require('../tools/glossary-inventory.cjs').inventory().filter(e=>e.category!=='资料与公式说明');
  assert.equal(entries.length,413,'no source records silently promoted or removed');
  for(const entry of entries){
    assert.ok(entry.copy?.definition?.length>=35,entry.id+' '+entry.title+' definition');
    assert.ok(entry.copy?.example?.length>=25,entry.id+' '+entry.title+' example');
    assert.notEqual(entry.copy.definition.trim(),entry.title.trim(),entry.id);
    assert.doesNotMatch(entry.copy.definition,/^(只适用|仅适用|本项目禁|单位陷阱同)/,entry.id);
    assert.ok(entry.copy.cautions?.length,entry.id+' caveat');
    assert.ok(entry.copy.sources?.length,entry.id+' references');
  }
});

test('settlement frequency explains periodic cash flow, not just product exclusions',()=>{
  const entry=require('../tools/glossary-inventory.cjs').inventory().find(e=>e.id==='pro-record-552');
  assert.match(entry.copy?.definition||'',/资金费/);
  assert.match(entry.copy?.example||'',/8|八/);
  assert.equal(entry.copy?.calculator,'settlement-frequency');
});

test('new scripts are mounted before the reader and calculators remain optional by concept',()=>{
  const post=readFileSync('source/_posts/crypto-trading-glossary.md','utf8');
  for(const file of ['beginner-trading.js','beginner-fields.js','calculators.js']){
    assert.ok(post.indexOf('/'+file)>0,file);
    assert.ok(post.indexOf('/'+file)<post.indexOf('/directory-reader.js'),file+' order');
  }
  const reader=readFileSync('source/assets/crypto-glossary/directory-reader.js','utf8');
  assert.match(reader,/function entryCopy\(/);
  assert.match(reader,/GlossaryCalculators\??\.mount/);
  assert.match(reader,/calculator:copy\?\.calculator/);
  assert.match(reader,/!detail\.closest\('\.dr-calculator-slot'\)/,'calculator formula disclosure keeps its own compact state');
});
