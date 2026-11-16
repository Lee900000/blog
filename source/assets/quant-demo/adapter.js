/* A static replay transport, not an HTTP proxy. Only local GET snapshot files
 * can be read; POST below describes the original query contract, never a wire method.
 */
(() => {
  const pending=new Map();
  const clone=value=>JSON.parse(JSON.stringify(value));
  async function file(path){
    if(!/^(catalog\.json|snapshots\/[-A-Z0-9]+\/(core|ratios|1m|4H|1D)\.json)$/.test(path))throw Error('禁止读取非快照路径');
    if(!pending.has(path))pending.set(path,fetch(path,{method:'GET',credentials:'omit'}).then(async response=>{
      if(!response.ok)throw Error('本地快照文件不可用');return response.json();
    }).catch(error=>{pending.delete(path);throw error;}));
    return pending.get(path);
  }
  let catalog;
  const ready=file('catalog.json').then(value=>{catalog=value;window.QuantDemo.catalog=value;});
  function symbolCheck(symbol){if(!catalog.list.some(row=>row.symbol===symbol))throw Error('未录入此标的快照');return symbol;}
  const core=symbol=>file('snapshots/'+symbolCheck(symbol)+'/core.json');
  function eat(levels,amount){
    let left=amount,qty=0,usd=0,weighted=0,count=0;
    for(const level of levels){if(left<=1e-8)break;const available=Number(level.usd_amount);if(available<=0)continue;const use=Math.min(left,available),part=Number(level.qty)*use/available;qty+=part;usd+=use;weighted+=part*Number(level.price);left-=use;count++;}
    const avg=qty>0?weighted/qty:0,best=Number(levels[0]?.price)||0;
    return{qty:qty.toFixed(8),usd_amount:usd.toFixed(2),avg_price:String(avg),slippage_ratio:best?String(Math.abs(avg/best-1)):'0',level_count:count,is_enough:left<=1e-8};
  }
  async function api(method,path,body={}){
    const detail=method==='GET'&&/^\/finance\/opportunities\/[-A-Z0-9]+$/.test(path);
    const queries=new Set(['/finance/funding-rank/list','/finance/market/funding-history','/finance/market/basis','/finance/market/insurance-fund','/finance/opportunities/list','/finance/opportunities/trend','/finance/market/liquidity','/finance/market/depth','/finance/market/long-short','/finance/market/top-trader-ratio','/finance/market/taker-volume','/finance/market/candles']);
    if(!detail&&!(method==='POST'&&queries.has(path)))throw Error('只读 Demo：禁止该操作');
    await ready;
    if(path==='/finance/funding-rank/list'){
      const hold=Number(body.hold_days)||30, principal=String(body.principal_amount||'2000');
      const list=catalog.list.filter(row=>row.margin_type==='COIN'&&row.opportunity_type==='FUNDING_RATE').map((row,i)=>{
        const daily=0.00016-i*0.000012, funding=daily*hold, fee=0.002, slip=0.0005+i*0.00008, basis=-0.0002, usdt=-0.0001, net=funding-fee-slip+basis+usdt, apr=net/hold*365;
        return {symbol:row.symbol,base_coin:row.base_coin,is_fillable:true,is_pass:net>0,is_stale:false,score:Math.max(0,apr/0.1095*100),depth3_usd_amount:String(15000-i*500),net_apr:apr,funding_income_ratio:funding,fee_ratio:fee,slippage_ratio:slip,basis_reversion_ratio:basis,usdt_deviation_ratio:usdt,break_even_days:((fee+slip-basis-usdt)/daily).toFixed(1),open_interest_usd_amount:String(1000000+i*100000),reasons:net>0?[]:['模拟收益不足以覆盖成本'],warnings:[],funding_daily_ratio:daily,funding_period_count:90,negative_funding_ratio:0.1,basis_now_ratio:-0.0003,basis_norm_ratio:-0.0001,net_profit_ratio:net,backtest:{is_ok:false,reason:'演示快照未提供真实历史回测'},measured_at:'2026-11-04T17:00:00+09:00'};
      });
      return {list,total:list.length,pass_count:list.filter(x=>x.is_pass).length,principal_amount:principal,principal_options:['1000','2000','5000','10000'],hold_days:hold,apr_cap_ratio:0.1095,fee_round_trip_ratio:0.002,usdt_deviation_now_ratio:0.0002,usdt_deviation_norm_ratio:0.0001,measured_at:'2026-11-04T17:00:00+09:00',config:{funding_days:7,funding_factor:1,basis_days:30,slippage_factor:1,usdt_deviation_max_ratio:0.005}};
    }
    if(path==='/finance/market/funding-history'){
      const detail=(await core(body.symbol)).detail;
      return {list:(detail.funding_rates||[]).map(item=>({time:item.time,rate:item.rate}))};
    }
    if(path==='/finance/market/insurance-fund'){
      symbolCheck(body.symbol);
      return {fund_usd_amount:1200000,open_interest_usd_amount:50000000,fund_oi_ratio_bps:240,fund_oi_ratio_pct:2.4,fund_qty:12000,fund_ccy:'MOCK',fund_price_usd:100,updated_at:'2026-11-04T17:00:00+09:00'};
    }
    if(path==='/finance/market/basis'){
      const bar=body.bar||'5m', intervals={'1m':60000,'5m':300000,'1H':3600000,'4H':14400000,'1D':86400000};
      if(!intervals[bar])throw Error('不支持的周期');
      const candles=clone((await file('snapshots/'+symbolCheck(body.symbol)+'/4H.json')).candles);
      const series=candles.series.find(s=>s.kind==='CONTRACT')||candles.series[0];
      const end=Date.parse(series.list[series.list.length-1].time);
      return {symbol:body.symbol,quote_ccy:'USD',list:series.list.map((c,i)=>{const price=Number(c.close),index=price*(1+0.001*Math.sin(i/10));return {time:new Date(end-(series.list.length-1-i)*intervals[bar]).toISOString(),contract_price:price,index_price:index,basis_amount:price-index,basis_ratio:price/index-1,is_confirmed:true};})};
    }
    if(detail)return clone((await core(decodeURIComponent(path.split('/').pop()))).detail);
    if(path==='/finance/opportunities/list'){
      const f=body.filters||{},pagination=body.pagination||{},size=Math.max(1,Number(pagination.size)||30);
      const defaultMin=Number(catalog.summary.min_volume_amount),manual=f.min_volume_amount!==undefined;
      let list=catalog.list.filter(row=>(!f.is_hedgeable_only||row.verdict!=='NOT_HEDGEABLE')&&(!f.opportunity_types?.length||f.opportunity_types.includes(row.opportunity_type))&&(!f.margin_types?.length||f.margin_types.includes(row.margin_type))&&(!f.verdicts?.length||f.verdicts.includes(row.verdict))&&(!f.keyword||row.symbol.toLowerCase().includes(f.keyword.toLowerCase()))&&(row.opportunity_type==='DELIVERY_BASIS'||Number(row.volume_amount)*1e6>=(manual?Number(f.min_volume_amount):row.margin_type==='COIN'?0:defaultMin)));
      const field=pagination.sort_by||'conservative_apr',direction=pagination.order==='asc'?1:-1;
      list.sort((a,b)=>{if(a[field]===''||a[field]==null)return b[field]===''||b[field]==null?0:1;if(b[field]===''||b[field]==null)return-1;return(Number.isFinite(Number(a[field]))&&Number.isFinite(Number(b[field]))?Number(a[field])-Number(b[field]):String(a[field]).localeCompare(String(b[field])))*direction;});
      const total=list.length;
      list=list.map(row=>({...row,backtest_1d:'',backtest_7d:'',backtest_15d:'',backtest_30d:'',backtest_60d:'',backtest_optimistic:{}}));
      return clone({...catalog,list:list.slice(0,size),summary:{...catalog.summary,beat_fixed_count:list.filter(row=>row.verdict==='BEAT_FIXED').length},pagination:{page:1,size,total,has_next:total>size}});
    }
    if(path==='/finance/market/liquidity'){
      const groups=await Promise.all((body.symbols||[]).map(core));
      return{list:groups.flatMap(group=>clone(group.liquidity.list)),principal_amount:'2000.00'};
    }
    if(path==='/finance/opportunities/trend')return clone((await core(body.symbol)).trend);
    if(path==='/finance/market/depth'){
      const d=clone((await core(body.inst_id)).depth),amount=Number(body.amount_usdt);
      if(!Number.isFinite(amount)||amount<=0||amount>1e8)throw Error('本金请输入 1 至 100,000,000 USDT');
      // Replay the original market.EatUSD calculation against recorded depth.
      d.amount_usdt=amount.toFixed(2);d.books.forEach(book=>{book.eat_ask=eat(book.asks,amount);book.eat_bid=eat(book.bids,amount);});return d;
    }
    const symbol=symbolCheck(body.symbol);
    if(path==='/finance/market/candles'){
      const bar=body.bar||'1m';if(!['1m','4H','1D'].includes(bar))throw Error('未录入此 K 线周期');
      return clone((await file('snapshots/'+symbol+'/'+bar+'.json')).candles);
    }
    const period=body.period||'5m';if(!['5m','15m','1H','4H','1D'].includes(period))throw Error('未录入此统计周期');
    const result=(await file('snapshots/'+symbol+'/ratios.json'))[period][path.split('/').pop()];
    if(result.__snapshot_error)throw Error(result.__snapshot_error);
    return clone(result);
  }
  window.QuantDemo={ready,api};
})();
