import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const editorial=require('../source/assets/crypto-glossary/editorial.js');
test('contract entries have planned copy, formula scope, variables and examples',()=>{
  for(const name of ['强平价格','初始保证金','维持保证金','标记价格','资金费率','资金费用','未实现盈亏','破产价格']){
    const entry=editorial.entries[name];assert.ok(entry,name);
    assert.ok(entry.definition&&entry.scope&&entry.example&&entry.cautions.length,name);
    assert.ok(entry.formulas.length,name);
    for(const formula of entry.formulas)assert.ok(formula.scope&&formula.expression&&formula.variables.length,name);
    assert.doesNotMatch(JSON.stringify(entry),/\bF\d+\b|页面.*缺失|\[S\d\]|\[X\]/);
  }
});
test('linear liquidation examples reconcile equity and maintenance without fees',()=>{
  const {isolatedLiquidation,crossLiquidation}=editorial.models;
  const p=isolatedLiquidation({margin:3000,quantity:1,entry:30000,rate:.05,side:1,cum:0});
  assert.ok(Math.abs(p-28421.052631578947)<1e-8);
  assert.ok(Math.abs(3000+p-30000-p*.05)<1e-8);
  const cross=crossLiquidation({wallet:10000,otherMaintenance:300,otherPnl:-500,quantity:1,entry:30000,rate:.005,side:1,cum:0});
  assert.ok(Math.abs(cross-20904.522613065328)<1e-8);
  assert.ok(Math.abs(10000-500+cross-30000-(300+cross*.005))<1e-8);
});
test('invalid or nonpositive liquidation roots are not presented as usable prices',()=>{
  assert.equal(editorial.models.isolatedLiquidation({margin:3000,quantity:0,entry:30000,rate:.05,side:1,cum:0}),null);
  assert.equal(editorial.models.isolatedLiquidation({margin:40000,quantity:1,entry:30000,rate:.05,side:1,cum:0}),null);
});
