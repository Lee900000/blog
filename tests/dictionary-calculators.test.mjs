import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {existsSync,readFileSync} from 'node:fs';
const require=createRequire(import.meta.url);
const path='../source/assets/crypto-glossary/calculators.js';
const api=existsSync(new URL(path,import.meta.url))?require(path):{};
const calc=(key,input)=>api.models[key].calculate(input);
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} ≠ ${b}`);

test('explicit concept mapping leaves explanatory and account-specific concepts unsupported',()=>{
  assert.equal(typeof api.resolve,'function');
  assert.equal(api.resolve({concept:'资金费用'}),'funding-fee');
  assert.equal(api.resolve({concept:'ETF'}),'etf-nav');
  assert.equal(api.resolve({concept:'现货 ETF'}),'spot-share');
  assert.equal(api.resolve({concept:'任意词',calculator:'settlement-frequency'}),'settlement-frequency');
  assert.equal(api.resolve({concept:'任意词',calculator:'unknown'}),null);
  for(const concept of ['ETP','全仓保证金','可用余额','钱包余额','市价单','交易所','合约强平复杂全仓'])assert.equal(api.resolve({concept}),null,concept);
});

test('linear sizing, margins, fees and weighted entry use entered values',()=>{
  close(calc('notional',{quantity:1.25,price:30000}).value,37500);
  close(calc('initial-margin',{notional:10000,leverage:10}).value,1000);
  close(calc('maintenance-margin',{notional:100000,rate:0.5,cum:50}).value,450);
  close(calc('trading-fee',{quantity:1,price:30000,rate:0.04}).value,12);
  close(calc('trading-fee',{quantity:1,price:30000,rate:-0.01}).value,-3);
  close(calc('average-entry',{quantity1:1,price1:30000,quantity2:3,price2:32000}).value,31500);
});

test('funding cash flows handle both directions and positive, negative and zero rates',()=>{
  close(calc('funding-fee',{quantity:1,price:30000,rate:0.01,side:'long'}).value,-3);
  close(calc('funding-fee',{quantity:1,price:30000,rate:0.01,side:'short'}).value,3);
  close(calc('funding-fee',{quantity:1,price:30000,rate:-0.01,side:'long'}).value,3);
  close(calc('funding-fee',{quantity:1,price:30000,rate:-0.01,side:'short'}).value,-3);
  close(calc('funding-fee',{quantity:1,price:30000,rate:0,side:'long'}).value,0);
  const result=calc('settlement-frequency',{hours:8,notional:30000,rate:0.01,side:'long'});
  close(result.value,3);close(result.details[0].value,-3);close(result.details[1].value,-9);
  assert.match(api.models['settlement-frequency'].scope,/不变|相同/);
  assert.throws(()=>calc('settlement-frequency',{hours:7,notional:30000,rate:.01,side:'long'}),/整除|完整/);
});

test('linear PnL and ROI distinguish direction, settled price difference and capital basis',()=>{
  close(calc('unrealized-pnl',{quantity:1,entry:30000,price:29000,side:'long'}).value,-1000);
  close(calc('unrealized-pnl',{quantity:1,entry:30000,price:29000,side:'short'}).value,1000);
  close(calc('realized-pnl',{quantity:.5,entry:30000,price:31000,side:'long'}).value,500);
  close(calc('roi',{pnl:-500,capital:1000}).value,-50);
});

test('spread and share examples align units, timing and denominators',()=>{
  const spread=calc('spread',{bid:99,ask:101});close(spread.value,2);close(spread.details[0].value,2);
  const nav=calc('etf-nav',{assets:1020000,liabilities:20000,shares:100000,price:10.2});
  close(nav.value,10);close(nav.details[0].value,2);
  const share=calc('spot-share',{holdings:100,shares:100000,price:100000});
  close(share.value,100);close(share.details[0].value,.001);
  assert.throws(()=>calc('spread',{bid:101,ask:99}),/卖一|买一/);
  assert.throws(()=>calc('etf-nav',{assets:100,liabilities:101,shares:10,price:10}),/净资产|负债/);
});

test('fixed-tier isolated liquidation reconciles equity with maintenance for long and short',()=>{
  for(const side of ['long','short']){
    const p=calc('liquidation',{margin:3000,quantity:1,entry:30000,rate:5,cum:0,side}).value;
    const d=side==='long'?1:-1;
    close(3000+d*(p-30000),p*.05);
  }
  close(calc('liquidation',{margin:3000,quantity:1,entry:30000,rate:5,cum:0,side:'long'}).value,28421.052631578947);
  assert.match(api.models.liquidation.scope,/逐仓/);assert.match(api.models.liquidation.scope,/费用|手续费/);
  assert.throws(()=>calc('liquidation',{margin:40000,quantity:1,entry:30000,rate:5,cum:0,side:'long'}),/正|有效/);
});

test('beginner liquidation formulas and substitutions name the side without signed direction coefficients',()=>{
  assert.doesNotMatch(api.models.liquidation.formula,/方向系数/);
  assert.match(api.models.liquidation.formula,/多头强平价/);
  assert.match(api.models.liquidation.formula,/空头强平价/);
  for(const side of ['long','short']){
    const result=calc('liquidation',{margin:3000,quantity:1,entry:30000,rate:5,cum:0,side});
    assert.doesNotMatch(result.steps.join('\n'),/方向系数|×\s*[−-]1/);
    assert.match(result.steps.join('\n'),side==='long'?/多头强平价/:/空头强平价/);
  }
});

test('settlement substitutions explain payment direction in words rather than a signed multiplier',()=>{
  for(const [side,rate,expected] of [['long',.01,'多头支付'],['short',.01,'空头收到'],['long',-.01,'多头收到'],['short',-.01,'空头支付']]){
    const result=calc('settlement-frequency',{hours:8,notional:30000,rate,side});
    assert.match(result.steps.join('\n'),/费用金额/);
    assert.ok(result.steps.join('\n').includes(expected));
    assert.doesNotMatch(result.steps.join('\n'),/方向系数|×\s*[−-]1/);
  }
});

test('borrowing liquidation adds accrued interest without presenting an actual platform threshold',()=>{
  close(calc('borrowing-liquidation',{debt:8000,interest:100,quantity:100,ratio:1.1}).value,89.1);
  assert.match(api.models['borrowing-liquidation'].scope,/假设/);
  assert.match(api.models['borrowing-liquidation'].scope,/借入 USDT/);
});

test('basic price, sampling, sizing and initial margin ratio examples expose their actual arithmetic',()=>{
  close(calc('basis',{contractPrice:30020,spotPrice:30000}).value,20);
  close(calc('basis',{contractPrice:29980,spotPrice:30000}).value,-20);
  close(calc('index-price',{price1:100,weight1:3,price2:102,weight2:1}).value,100.5);
  close(calc('average-premium',{sample1:0.1,weight1:1,sample2:0.2,weight2:3}).value,.175);
  close(calc('contract-size',{lots:100,face:.01,multiplier:1}).value,1);
  close(calc('initial-margin-rate',{margin:1000,notional:10000}).value,10);
  for(const [concept,key] of Object.entries({'基差':'basis','指数价格':'index-price','平均溢价指数':'average-premium','合约面值与乘数':'contract-size','初始保证金率':'initial-margin-rate'}))assert.equal(api.resolve({concept}),key);
  assert.throws(()=>calc('index-price',{price1:100,weight1:0,price2:102,weight2:0}),/权重/);
  assert.throws(()=>calc('average-premium',{sample1:0.1,weight1:0,sample2:0.2,weight2:0}),/权重/);
});

test('all model examples compute finite numbers with Chinese substitution steps and scope',()=>{
  assert.ok(Object.keys(api.models||{}).length>=15);
  for(const [key,model] of Object.entries(api.models)){
    const example=Object.fromEntries(model.fields.map(field=>[field.key,field.value]));
    const result=model.calculate(example);
    assert.ok(Number.isFinite(result.value),key);
    assert.ok(result.steps.length,key);assert.ok(model.scope,key);assert.ok(model.formula,key);
    assert.ok(model.fields.every(field=>field.label),key);
    assert.doesNotMatch(model.formula,/\b(?:PnL|ROI|NAV|IM|MM|Q|P|V|L)\b/,key);
    for(const field of model.fields.filter(field=>!field.options)){
      assert.throws(()=>model.calculate({...example,[field.key]:''}),undefined,`${key}:${field.key} empty`);
      assert.throws(()=>model.calculate({...example,[field.key]:Infinity}),undefined,`${key}:${field.key} infinite`);
      assert.throws(()=>model.calculate({...example,[field.key]:'abc'}),undefined,`${key}:${field.key} nonnumber`);
    }
  }
  for(const [key,input] of [
    ['initial-margin',{notional:10000,leverage:0}],['roi',{pnl:1,capital:-1}],
    ['spot-share',{holdings:1,shares:0,price:1}],['maintenance-margin',{notional:100,rate:120,cum:0}],
    ['maintenance-margin',{notional:100,rate:1,cum:10}],
    ['funding-fee',{quantity:1,price:1,rate:101,side:'long'}],
    ['funding-fee',{quantity:1,price:1,rate:.01,side:'wrong'}]
  ])assert.throws(()=>calc(key,input),undefined,key);
});

test('mount reacts immediately, preserves input precision, resets examples and does not mount unsupported terms',async()=>{
  assert.equal(typeof api.mount,'function');
  const {JSDOM}=require('jsdom');
  const dom=new JSDOM('<main id="target"></main>');
  const target=dom.window.document.querySelector('#target');
  const widget=api.mount(target,{concept:'名义价值',id:'test'});
  assert.equal(target.children.length,1);assert.equal(widget.dataset.calculator,'notional');
  assert.ok(widget.querySelector('[aria-live="polite"]'));
  const input=widget.querySelector('[name="quantity"]');
  input.value='0.123456789123';input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));
  assert.equal(input.value,'0.123456789123');
  assert.match(widget.querySelector('.gc-result').textContent,/3,703\.70367369|3703\.70367369/);
  input.value='';input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));
  assert.match(widget.querySelector('.gc-error').textContent,/请输入|不能为空/);
  assert.equal(widget.querySelector('.gc-result').hidden,true);
  widget.querySelector('.gc-reset').click();assert.equal(input.value,'1');
  assert.equal(widget.querySelector('.gc-error').hidden,true);
  assert.equal(api.mount(target,{concept:'ETP'}),null);assert.equal(target.children.length,1);
  dom.window.close();
});

test('calculator styling uses host surfaces and compact responsive columns',()=>{
  const css=readFileSync(new URL('../source/assets/crypto-glossary/calculators.css',import.meta.url),'utf8');
  assert.match(css,/var\(--global-bg/);assert.match(css,/var\(--font-color/);
  assert.match(css,/grid-template-columns:\s*repeat\(2/);assert.match(css,/@media/);
  assert.doesNotMatch(css,/animation:|@keyframes/);
});
