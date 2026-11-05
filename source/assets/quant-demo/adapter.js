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
    const queries=new Set(['/finance/opportunities/list','/finance/opportunities/trend','/finance/market/liquidity','/finance/market/depth','/finance/market/long-short','/finance/market/top-trader-ratio','/finance/market/taker-volume','/finance/market/candles']);
    if(!detail&&!(method==='POST'&&queries.has(path)))throw Error('只读 Demo：禁止该操作');
    await ready;
    if(detail)return clone((await core(decodeURIComponent(path.split('/').pop()))).detail);
    if(path==='/finance/opportunities/list'){
      const f=body.filters||{},pagination=body.pagination||{},size=Math.max(1,Number(pagination.size)||30);
      const defaultMin=Number(catalog.summary.min_volume_amount),manual=f.min_volume_amount!==undefined;
      let list=catalog.list.filter(row=>(!f.is_hedgeable_only||row.verdict!=='NOT_HEDGEABLE')&&(!f.opportunity_types?.length||f.opportunity_types.includes(row.opportunity_type))&&(!f.margin_types?.length||f.margin_types.includes(row.margin_type))&&(!f.verdicts?.length||f.verdicts.includes(row.verdict))&&(!f.keyword||row.symbol.toLowerCase().includes(f.keyword.toLowerCase()))&&(row.opportunity_type==='DELIVERY_BASIS'||Number(row.volume_amount)*1e6>=(manual?Number(f.min_volume_amount):row.margin_type==='COIN'?0:defaultMin)));
      const field=pagination.sort_by||'conservative_apr',direction=pagination.order==='asc'?1:-1;
      list.sort((a,b)=>{if(a[field]===''||a[field]==null)return b[field]===''||b[field]==null?0:1;if(b[field]===''||b[field]==null)return-1;return(Number.isFinite(Number(a[field]))&&Number.isFinite(Number(b[field]))?Number(a[field])-Number(b[field]):String(a[field]).localeCompare(String(b[field])))*direction;});
      const total=list.length;
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
