import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{JSDOM}=require('jsdom');
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('replica replaces simplified demo and retains all original view modules',()=>{
  assert.match(read('source/js/quant-opportunities.js'),/quant-demo\/index.html/);
  const src=read('source/assets/quant-demo/view.js');
  for(const fn of ['loadOpps','ratesBox','oppDetail','playbookBox','depthBox','candleBox','drawMerged','drawCandles','drawLS','drawTaker'])assert.match(src,new RegExp('function '+fn+'\\('));
  assert.doesNotMatch(src,/sync-jobs|\/watchlist|cli-info|accounts\/list|finance arb|dlgArbCmd/);
  assert.match(read('source/assets/quant-demo/index.html'),/connect-src 'self'/);
  assert.match(read('_config.yml'),/assets\/quant-demo\/\*\*/);
  assert.doesNotMatch(read('source/assets/quant-demo/view.css'),/\.card\.z>\.scroll\{max-height/);
});
test('static data adapter denies writes and reads only same-site snapshot files',async()=>{
  const dom=new JSDOM('<div id="opps"></div>',{runScripts:'outside-only',url:'http://localhost/assets/quant-demo/index.html'});
  try{
    const calls=[];
    dom.window.fetch=async path=>{calls.push(path);assert.match(path,/^(catalog\.json|snapshots\/[-A-Z0-9]+\/(core|ratios|1m|4H|1D)\.json)$/);return{ok:true,json:async()=>JSON.parse(read('source/assets/quant-demo/'+path))};};
    dom.window.eval(read('source/assets/quant-demo/adapter.js'));
    await dom.window.QuantDemo.ready;
    await assert.rejects(()=>dom.window.QuantDemo.api('POST','/finance/watchlist',{}),/只读|禁止/);
    await assert.rejects(()=>dom.window.QuantDemo.api('POST','/finance/sync-jobs/run',{}),/只读|禁止/);
    const list=await dom.window.QuantDemo.api('POST','/finance/opportunities/list',{pagination:{size:30},filters:{keyword:'UNI'}});
    assert.equal(list.list.length,1);assert.equal(list.list[0].symbol,'UNI-USD-SWAP');
    const detail=await dom.window.QuantDemo.api('GET','/finance/opportunities/UNI-USD-SWAP');assert.ok(detail.playbook.steps.length);
    const candle=await dom.window.QuantDemo.api('POST','/finance/market/candles',{symbol:'UNI-USD-SWAP',bar:'4H'});assert.ok(candle.series.every(s=>s.list.length));
    assert.ok(calls.every(path=>!path.includes('http')&&!path.includes('finance')));
  }finally{dom.window.close();}
});
