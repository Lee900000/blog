import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {JSDOM}=require('jsdom');
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
async function setup(storedView){
  const dom=new JSDOM(read('source/assets/quant-demo/index.html'),{runScripts:'outside-only',url:'http://localhost/assets/quant-demo/index.html'});
  dom.window.ResizeObserver=class{observe(){}disconnect(){}};
  dom.window.fetch=async(path,options)=>{
    assert.equal(options.method,'GET');assert.equal(options.credentials,'omit');
    assert.match(path,/^(catalog.json|snapshots[/][-A-Z0-9]+[/](core|ratios|1m|4H|1D).json)$/);
    return{ok:true,json:async()=>JSON.parse(read('source/assets/quant-demo/'+path))};
  };
  const errors=[];dom.window.addEventListener('error',e=>errors.push(e.message));
  if(storedView)dom.window.localStorage.setItem('candleView',storedView);
  dom.window.eval(read('source/assets/quant-demo/adapter.js'));
  dom.window.eval(read('source/assets/quant-demo/view.js'));
  await dom.window.QuantDemo.ready;
  for(let i=0;i<12;i++)await new Promise(resolve=>setImmediate(resolve));
  return{dom,d:dom.window.document,errors};
}
async function settle(){for(let i=0;i<12;i++)await new Promise(resolve=>setImmediate(resolve));}
test('demo starts merged despite legacy split preference and can switch both ways',async()=>{
  const{dom,d}=await setup('split');
  try{
    [...d.querySelectorAll('tr.opp')].find(row=>row.textContent.includes('UNI-USD-SWAP')).click();await settle();
    const button=label=>[...d.querySelectorAll('tr.det button')].find(b=>b.textContent===label);
    assert.equal(button('合併').getAttribute('aria-pressed'),'true');
    assert.ok(d.querySelector('svg[aria-label*="K 線合併對比"]'));
    button('分開').click();await settle();assert.equal(button('分開').getAttribute('aria-pressed'),'true');
    assert.equal(d.querySelector('svg[aria-label*="K 線合併對比"]'),null);
    button('合併').click();await settle();assert.ok(d.querySelector('svg[aria-label*="K 線合併對比"]'));
  }finally{dom.window.close();}
});
test('original table keeps 19 columns, real snapshots and disabled private actions',async()=>{
  const{dom,d,errors}=await setup();
  try{
    assert.equal(d.querySelectorAll('.tbl-opp>thead th').length,19);
    assert.ok(d.querySelectorAll('tr.opp').length>=12);
    assert.match(d.querySelector('.demo-note').textContent,/Mock Demo.*本地快照/);
    assert.equal(d.querySelectorAll('.bell:not(:disabled),.cmdbtn:not(:disabled)').length,0);
    const failedLiquidity=d.querySelectorAll('td.liq').length-d.querySelectorAll('.liqmain').length;
    assert.equal(failedLiquidity,2); // The source U-margined delivery API itself lacks these contract books.
    assert.ok([...d.querySelectorAll('td.liq')].filter(c=>!c.querySelector('.liqmain')).every(c=>c.textContent.includes('盤口讀取失敗')));
    assert.deepEqual(errors,[]);
  }finally{dom.window.close();}
});
test('original Enter search and full detail charts work from local recordings',async()=>{
  const{dom,d,errors}=await setup();
  try{
    const q=d.querySelector('input[type=search]');q.value='UNI';
    q.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));await settle();
    assert.equal(d.querySelectorAll('tr.opp').length,1);
    d.querySelector('tr.opp').click();await settle();
    const detail=d.querySelector('tr.det');assert.ok(detail);
    for(const label of ['套利方式','盤口深度','K 線','多空比','大戶多空賬戶數比','合約主動買賣量'])assert.match(detail.textContent,new RegExp(label));
    assert.ok(detail.querySelectorAll('svg').length>=6);
    assert.ok(detail.querySelectorAll('table.dpv').length>=2);
    assert.doesNotMatch(detail.textContent,/NaN|Infinity|讀取失敗/);
    assert.deepEqual(errors,[]);
  }finally{dom.window.close();}
});
test('all sixteen recorded symbols include depth, trend, all statistical periods and candle bars',()=>{
  const data=JSON.parse(read('source/assets/quant-demo/catalog.json'));
  assert.equal(data.list.length,16);
  for(const row of data.list){
    const prefix='source/assets/quant-demo/snapshots/'+row.symbol+'/';
    const core=JSON.parse(read(prefix+'core.json'));assert.equal(core.detail.symbol,row.symbol);assert.ok(core.depth.books.length);
    const ratios=JSON.parse(read(prefix+'ratios.json'));
    for(const p of ['5m','15m','1H','4H','1D'])for(const kind of ['long-short','top-trader-ratio','taker-volume'])assert.ok(ratios[p][kind].list?.length||ratios[p][kind].__snapshot_error);
    for(const bar of ['1m','4H','1D'])assert.ok(JSON.parse(read(prefix+bar+'.json')).candles.series.length);
    assert.doesNotMatch(JSON.stringify(core),/"(?:account_id|account_code|api_key|password|secret)"/);
  }
});
test('static depth replay validates principal and reproduces quantity weighted execution',async()=>{
  const{dom}=await setup();
  try{
    await assert.rejects(()=>dom.window.QuantDemo.api('POST','/finance/market/depth',{inst_id:'UNI-USD-SWAP',amount_usdt:'-1'}),/本金/);
    const data=await dom.window.QuantDemo.api('POST','/finance/market/depth',{inst_id:'UNI-USD-SWAP',amount_usdt:'1000'});
    assert.equal(data.amount_usdt,'1000.00');assert.ok(data.books.every(b=>Number.isFinite(Number(b.eat_bid.avg_price))));
  }finally{dom.window.close();}
});
