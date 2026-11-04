import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const {records}=require('../source/assets/crypto-glossary/beginner-fields.js');
const field=id=>records[`pro-record-${id}`];
const text=id=>JSON.stringify(field(id));
const has=(id,...patterns)=>patterns.forEach(pattern=>assert.match(text(id),pattern,`pro-record-${id}: ${pattern}`));

test('impact bid and ask follow the consumed book side, and IMN has an explicit assumed conversion',()=>{
  assert.equal(field(367).title,'冲击名义金额（IMN）');
  has(367,/200 USDT/,/4,000 USDT/,/5%/);
  has(368,/Impact Bid Price/,/主动卖出/,/Impact Ask Price/,/98\.99/);
  has(547,/冲击卖价/,/101 USDT/);
});

test('product ADL risk and personal quantile have separate sources and scales',()=>{
  has(371,/adlRisk/,/high/,/medium/,/low/,/30 分钟/,/symbolAdlRisk/);
  assert.ok(field(371).sources.every(([,url])=>!url.includes('Position-ADL-Quantile')));
  has(206,/0[–—-]4/,/30 秒/,/0[–—-]5/);
});

test('conditional limit orders use Algo and explain its actual parameter constraints',()=>{
  for(const id of [297,299]){
    has(id,/POST \/fapi\/v1\/algoOrder/);
    assert.ok(field(id).sources.some(([,url])=>url.includes('New-Algo-Order')));
  }
  has(312,/STOP_MARKET/,/TAKE_PROFIT_MARKET/,/quantity/,/reduceOnly/,/BUY\+LONG/,/SELL\+SHORT/);
  has(313,/triggerPrice/,/stopPrice/,/≥/,/≤/);
  has(314,/-2021/,/高于/,/低于/,/workingType/);
  has(315,/0\.1.*20/,/5%/,/0\.05/);
  has(316,/MARK_PRICE/,/CONTRACT_PRICE/,/默认/);
  has(317,/triggerProtect/,/exchangeInfo/);
  has(318,/不能.*price.*同传/,/Algo/);
  has(319,/EXPIRE_MAKER.*原有挂单/,/EXPIRE_TAKER/,/EXPIRE_BOTH/,/NONE/,/默认/);
  has(320,/毫秒/,/秒精度/,/600 秒/,/253402300799000/);
  has(322,/1[–—-]36/,/未结束/,/永久幂等/);
});

test('Binance fields retain endpoint versions, object levels and units',()=>{
  has(345,/v2\/account/,/布尔/,/isolatedMargin/);
  has(347,/v2\/account/,/maxNotionalValue/,/notionalFloor/,/notionalCap/);
  for(const id of [345,347])assert.ok(field(id).sources.some(([,url])=>url.includes('Account-Information-V2')));
  for(const id of [348,349]){
    has(id,/v3\/balance/);
    assert.ok(field(id).sources.some(([,url])=>url.includes('Futures-Account-Balance-V3')));
  }
  has(349,/布尔/,/多资产/);
  for(const id of [329,331,335,337,338,339,340])has(id,/USD/,/顶层/);
  has(329,/USDT/,/assets/,/walletBalance/);
  has(335,/assets\[\]\.crossUnPnl/,/totalCrossUnPnl/);
  for(const [id,key] of [[337,'totalInitialMargin'],[338,'totalMaintMargin'],[339,'totalPositionInitialMargin'],[340,'totalOpenOrderInitialMargin']])has(id,new RegExp(key));
  has(350,/V2/,/保留字段/,/accountConfig/,/毫秒/);
});

test('OKX product and account fields expose exact units and scopes',()=>{
  has(495,/下架/,/下线/,/Unix 毫秒/);
  has(500,/maxLmtSz/,/基础币/,/maxMktSz/,/USDT/,/张/);
  has(501,/USD/,/非美元/,/折合美元/);
  has(504,/USD/,/全仓/,/逐仓/);
  has(505,/顶层/,/details\[\]\.availEq/,/跨币种/,/组合保证金/);
  has(508,/买入期权/,/逐仓/,/全仓.*availEq/);
  has(509,/应计利息/,/机器人/,/持仓/);
  has(510,/details\[\]\.ordFrozen/,/ordFroz/,/USD/,/不一致/);
  has(511,/顶层/,/details\[\]\.isoEq/,/USD/);
  has(527,/仅适用/,/mgnMode=isolated/,/imr/,/mmr/);
  has(528,/标记价/,/uplLastPx/,/uplRatioLastPx/,/教学/);
  has(529,/负数.*收费/,/正数.*返佣/,/全部平仓后重置/,/fundingFee/,/liqPenalty/);
});

test('funding timing and market samples state documented boundaries',()=>{
  has(191,/fundingIntervalHours/,/fundingInfo/,/历史/);
  has(193,/adjustedFundingRateCap/,/adjustedFundingRateFloor/);
  has(196,/15 秒/,/一分钟/,/整点后/);
  has(552,/每期费率/,/周期.*缩放/);
  has(305,/Binance USDⓈ-M/,/一年/);
  has(310,/post-only/,/App/,/Web/,/普通 API/);
  has(374,/20%/,/保证金余额/,/净多/,/净空/,/样本/);
  assert.equal(field(374).sources.length,3);
});

test('undefined project concepts are explicitly unverified with meaningful identification examples',()=>{
  for(const id of [157,212]){
    const copy=field(id);
    assert.equal(copy.sourceStatus,'unverified',String(id));
    assert.ok(copy.sourceNote?.length>25,String(id));
    assert.match(copy.definition,/本项目|项目术语/);
    assert.match(copy.definition,/尚未|未确定|待定义|待.*确认|不能确定/);
    assert.match(copy.example,/不能|不等于|不代表|无法/);
  }
  assert.doesNotMatch(field(157).example,/转给乙|系统提出/);
  assert.ok(field(246).sources.every(([,url])=>!url.includes('okx.com')));
});

test('public definitions replace project-only placeholders with direct, scoped sources',()=>{
  for(const id of [236,242,246])assert.notEqual(field(id).sourceStatus,'unverified',String(id));
  has(236,/OKX 欧洲/,/未平仓/,/未成交/,/初始模拟金额/,/实盘/,/历史/);
  assert.ok(field(236).sources.some(([,url])=>url==='https://www.okx.com/en-eu/help/how-do-i-use-demo-trading'));
  has(242,/清算/,/结算/,/核对/,/60/,/100/,/40/,/强平/);
  assert.ok(field(242).sources.some(([,url])=>url==='https://www.ecb.europa.eu/services/glossary/html/act7c.en.html'));
  has(246,/第三十二条/,/亏损/,/补/,/100/,/98/,/10/,/20 元/,/不是.*免除/);
  assert.doesNotMatch(field(246).definition,/本项目/);
  for(const formula of field(246).formulas){
    assert.ok(formula.name?.length>0);
    assert.ok(formula.variables.every(pair=>Array.isArray(pair)&&pair.length===2));
  }
});
