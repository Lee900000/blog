import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const {JSDOM}=createRequire(import.meta.url)('jsdom');

test('新版机会保留四个选项卡和只读排名数据', () => {
  const view = readFileSync('source/assets/quant-demo/view.js', 'utf8');
  const adapter = readFileSync('source/assets/quant-demo/adapter.js', 'utf8');
  for (const label of ['币本位永续排名推荐', '币本位永续', 'U 本位永续', '交割合约']) assert.ok(view.includes(label), label);
  assert.ok(adapter.includes('/finance/funding-rank/list'));
  assert.ok(adapter.includes('只读 Demo'));
});

test('四个选项卡可用且所有请求只读取本站快照', async () => {
  const read = path => readFileSync('source/assets/quant-demo/' + path, 'utf8');
  const dom = new JSDOM(read('index.html'), {runScripts:'outside-only',url:'http://localhost/assets/quant-demo/index.html'});
  dom.window.ResizeObserver = class { observe(){} disconnect(){} };
  dom.window.fetch = async (path, options) => {
    assert.equal(options.method, 'GET'); assert.equal(options.credentials, 'omit');
    assert.match(path, /^(catalog\.json|snapshots\/[-A-Z0-9]+\/(core|ratios|1m|4H|1D)\.json)$/);
    return {ok:true,json:async()=>JSON.parse(read(path))};
  };
  try {
    dom.window.eval(read('adapter.js')); dom.window.eval(read('view.js'));
    const settle=async()=>{for(let i=0;i<15;i++) await new Promise(resolve=>setImmediate(resolve));};
    await settle();
    assert.equal(dom.window.document.querySelectorAll('.otab').length,4);
    for (let i=0;i<4;i++) {
      dom.window.document.querySelectorAll('.otab')[i].click(); await settle();
      assert.ok(dom.window.document.querySelectorAll('[data-pane]:not([hidden]) tr.opp').length>0);
    }
    await assert.rejects(()=>dom.window.QuantDemo.api('POST','/finance/watchlist',{}),/只读|禁止/);
  } finally { dom.window.close(); }
});
