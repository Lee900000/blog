import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
const require=createRequire(import.meta.url);
const {JSDOM}=require('jsdom');
const editorial=require('../source/assets/crypto-glossary/editorial.js').entries;
const trading=require('../source/assets/crypto-glossary/beginner-trading.js').records;

test('AHR999 uses a disclosed historical archive rather than a fabricated official method',()=>{
  const entry=trading.AHR999;
  assert.notEqual(entry.sourceStatus,'unverified');
  assert.match(entry.scope,/第三方.*存档/);
  assert.match(entry.cautions.join(''),/不是.*Binance.*OKX/);
  assert.match(entry.formulas[0].expression,/200 日定投成本/);
  assert.match(entry.example,/0\.5/);
  assert.ok(entry.sources.some(([,url])=>url.includes('hodl-bitcoin.pdf#page=53')));
  assert.ok(!entry.sources.some(([,url])=>url==='https://github.com/ahr999/ahr999'));
});

test('unverified project mechanisms do not receive generic official-index evidence',()=>{
  const dom=renderedReader();
  try{
    const document=dom.window.document;
    document.querySelector('.dr-terms button[data-id="pro-record-157"]').click();
    assert.match(document.querySelector('.dr-source-status')?.textContent||'',/来源待核实/);
    assert.ok(![...document.querySelectorAll('.dr-source-links a')].some(a=>a.textContent.includes('延伸核对入口')));
  }finally{dom.window.close();}
});

test('trading definitions declare product scope, execution units and source product status',()=>{
  assert.equal(trading['pro-record-106'].title,'只做挂单（Post Only）');
  assert.match(trading['pro-record-69'].cautions.join(''),/2024.*停止/);
  assert.match(trading['成交均价与部分成交'].definition,/现货.*线性/);
  assert.match(trading['pro-record-123'].definition,/张数/);
  assert.match(trading['未实现盈亏-已实现盈亏（Unrealized-Realized-PnL）'].example,/1\s*枚/);
  assert.match(trading['pro-record-138'].example,/10\s*USDT/);
  assert.ok(trading['保险基金（Insurance-Fund）'].sources.some(([,url])=>url.includes('360033525371')));
  assert.ok(trading['返佣（Rebate）'].sources.some(([,url])=>url.includes('d10f95a5ac8847bdb6f422a26921745d')));
});

test('reader does not append old hard-coded citations to reviewed entry sources',()=>{
  const dom=renderedReader();
  try{
    const document=dom.window.document;
    for(const [title,id]of [['C2C / P2P','C2C-P2P'],['USDT / U','USDT-U']]){
      [...document.querySelectorAll('.dr-terms button')].find(b=>b.textContent===title).click();
      assert.equal(document.querySelectorAll('.dr-source-links a').length,trading[id].sources.length,title);
    }
  }finally{dom.window.close();}
});

test('inaccessible Academy article URLs are replaced with readable concept-specific evidence',()=>{
  const expected={
    '交易所（Exchange）':'/glossary/centralized-exchange',
    '减半（Halving）':'/glossary/halving',
    '挂单-吃单（Maker-Taker）':'/articles/what-are-makers-and-takers',
    '强平-爆仓（Liquidation）':'/support/faq/detail/360033525271',
    '穿仓（Negative-Balance-Bankruptcy-Loss）':'/support/faq/detail/360033525371'
  };
  for(const [id,path]of Object.entries(expected))assert.ok(trading[id].sources.some(([,url])=>url.endsWith(path)),id);
  assert.equal(trading['交易所（Exchange）'].sources.length,2);
});

test('corrected Chinese terminology keeps its related-entry links after title changes',()=>{
  const dom=renderedReader();
  try{
    const document=dom.window.document;
    document.querySelector('.dr-terms button[data-id="pro-record-368"]').click();
    const link=[...document.querySelectorAll('.dr-related-links a')].find(a=>a.textContent==='冲击名义金额（IMN）');
    assert.ok(link,'renamed IMN term is still linked');
    assert.equal(link.getAttribute('href'),'#pro-record-367');
  }finally{dom.window.close();}
});

test('fees use executed quantity, and double-sided liquidation declares undefined cases',()=>{
  const fee=editorial['交易手续费'];
  assert.match(fee.formulas[0].expression,/本笔成交币数/);
  assert.doesNotMatch(fee.formulas[0].expression,/持有币数/);
  assert.match(fee.example,/0\.1/);
  assert.match(fee.example,/1\.2/);
  assert.match(editorial['强平价格'].formulas[3].scope,/分母为零/);
  assert.match(editorial['强平价格'].formulas[3].scope,/正数/);
});

test('Binance leverage reference names the actual symbol configuration endpoint',()=>{
  const reference=editorial['杠杆'].fields.find(([label])=>label.includes('Binance'));
  assert.match(reference[0],/交易对配置/);
  assert.match(reference[2],/Symbol-Config/);
});

test('learner examples and scopes do not fall back to unexplained formula abbreviations',()=>{
  for(const key of ['强平价格','维持保证金','资金费率','收益率','维持保证金率','自动减仓']){
    assert.doesNotMatch(editorial[key].example,/\b(?:P|MM|V|A|ROI|E|P_b|F_raw)\b|δ/,key);
  }
  assert.doesNotMatch(editorial['维持保证金率'].scope,/MM|\bV\b/);
  assert.match(editorial['标记价格'].formulas[0].scope,/等权|简单平均/);
  const adl=editorial['自动减仓'];
  assert.ok(adl.sources.some(([,url])=>url.includes('360033525471')));
  assert.ok(adl.sources.some(([,url])=>url.includes('iv-introduction-to-auto-deleveraging-adl')));
  assert.match(adl.example,/不是.*实际排队/);
  assert.match(editorial['初始保证金率'].formulas[0].expression,/小数/);
  assert.match(editorial['初始保证金率'].formulas[0].expression,/100.*%/);
  assert.doesNotMatch(require('../source/assets/crypto-glossary/beginner-fields.js').records['pro-record-367'].example,/\bIMN\s*=/);
});

function renderedReader(){
  const dom=new JSDOM(readFileSync('public/archives/5596f036.html','utf8'),{runScripts:'outside-only',url:'http://localhost:4000/archives/5596f036.html'});
  dom.window.requestAnimationFrame=callback=>callback();
  dom.window.HTMLElement.prototype.scrollIntoView=()=>{};
  dom.window.document.querySelector('#article-container').dataset.nativeMotion='ready';
  for(const file of ['concepts.js','editorial.js','beginner-trading.js','beginner-fields.js','copy-dedup.js','directory-reader.js'])dom.window.eval(readFileSync('source/assets/crypto-glossary/'+file,'utf8'));
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  return dom;
}

test('published field comparisons distinguish risk ratios from tier rates and omit project naming claims',()=>{
  const dom=renderedReader();
  try{
    const document=dom.window.document;
    function open(title){
      const button=[...document.querySelectorAll('.dr-terms button')].find(b=>b.textContent===title);
      assert.ok(button,title);button.click();
      return document.querySelector('.dr-content');
    }
    let content=open('保证金率');
    assert.doesNotMatch(content.querySelector('.dr-field-table')?.textContent||'',/维持保证金率（档位比率）|项目命名参考|maintenance_margin_rate/);
    assert.match(content.querySelector('.dr-field-table')?.textContent||'',/风险比例/);
    content=open('维持保证金率');
    assert.doesNotMatch(content.querySelector('.dr-field-table')?.textContent||'',/mgnRatio/);
    assert.match(content.querySelector('.dr-field-table')?.textContent||'',/maintMarginRatio/);
    content=open('合约面值与乘数');
    assert.doesNotMatch(content.querySelector('.dr-field-table')?.textContent||'',/OKX 账户级|项目命名参考|归入/);
    assert.match(content.querySelector('.dr-field-table')?.textContent||'',/产品信息/);
    content=open('自动减仓');
    assert.doesNotMatch(content.querySelector('.dr-field-table')?.textContent||'',/每半小时|高.*中.*低|项目命名参考/);
    assert.match(content.querySelector('.dr-field-table')?.textContent||'',/adlQuantile/);
    content=open('产品类型');
    assert.doesNotMatch(content.textContent,/contract_type/);
  }finally{dom.window.close();}
});
