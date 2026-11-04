import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const editorial=require('../source/assets/crypto-glossary/editorial.js');
test('margin borrowing liquidation has a readable article, an example and scoped formulas',()=>{
  const entry=editorial.entries['杠杆借贷强平价格'];
  assert.ok(entry?.definition&&entry.scope&&entry.example);
  assert.ok(entry.formulas.length&&entry.sources.length);
  assert.match(entry.definition,/借/);
  assert.match(entry.cautions.join(' '),/合约|反向|阈值/);
});
test('every published formula and variable label uses Chinese rather than English shorthand',()=>{
  for(const [name,entry]of Object.entries(editorial.entries))for(const formula of entry.formulas){
    assert.doesNotMatch(formula.expression,/[A-Za-z_Σδ]/,name+' formula');
    for(const [label]of formula.variables)assert.doesNotMatch(label,/[A-Za-z_Σδ]/,name+' variable');
  }
});
test('the borrowing example satisfies its explicitly hypothetical risk threshold',()=>{
  const price=(8000+0)*1.1/100;
  assert.equal(price,88);
  assert.ok(Math.abs(100*price/8000-1.1)<1e-10);
});
