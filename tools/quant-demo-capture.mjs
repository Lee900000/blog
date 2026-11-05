// Read-only, loopback-only snapshot collector. Outputs an apply_patch document;
// it never writes files, reads credentials, or calls account/trading endpoints.
import {readFileSync} from 'node:fs';
const [symbol,group]=process.argv.slice(2);
const catalog=JSON.parse(readFileSync(new URL('../source/assets/quant-demo/catalog.json',import.meta.url)));
if(!catalog.list.some(row=>row.symbol===symbol))throw Error('Symbol must exist in the approved demo catalog');
const allowed=new Set(['/finance/market/liquidity','/finance/opportunities/trend','/finance/market/depth','/finance/market/taker-volume','/finance/market/long-short','/finance/market/top-trader-ratio','/finance/market/candles']);
const result={};
async function read(path,body){
  if(!(allowed.has(path)||path==='/finance/opportunities/'+encodeURIComponent(symbol)))throw Error('Read endpoint not allowed');
  const method=body===undefined?'GET':'POST';
  const response=await fetch('http://127.0.0.1:8080'+path,{method,headers:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(45000)});
  const envelope=await response.json();
  if(!response.ok||envelope.code!=='0')throw Error(path+': '+envelope.msg);
  return envelope.data;
}
if(group==='core'){
  result.detail=await read('/finance/opportunities/'+encodeURIComponent(symbol));
  result.trend=await read('/finance/opportunities/trend',{symbol,days:30});
  result.liquidity=await read('/finance/market/liquidity',{symbols:[symbol],principal_amount:'2000'});
  result.depth=await read('/finance/market/depth',{inst_id:symbol,amount_usdt:result.detail.playbook.notional_amount});
}else if(group==='ratios'){
  for(const period of ['5m','15m','1H','4H','1D']){
    result[period]={};
    for(const kind of ['long-short','top-trader-ratio','taker-volume']){
      try{result[period][kind]=await read('/finance/market/'+kind,{symbol,period});}
      catch(error){result[period][kind]={__snapshot_error:'原查询未返回可用数据：'+error.message};}
    }
  }
}else if(['1m','4H','1D'].includes(group)){
  result.candles=await read('/finance/market/candles',{symbol,bar:group});
}else throw Error('Unsupported snapshot group');
// Market-only responses must never include account-level or secret material.
function scrub(value){
  if(Array.isArray(value))return value.map(scrub);
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).filter(([key])=>!/(?:account|credential|secret|password|api_key|is_watched|watchlist)/i.test(key)).map(([key,v])=>[key,scrub(v)]));
  return value;
}
console.log('*** Begin Patch\n*** Add File: /Volumes/AiCode/博客/source/assets/quant-demo/snapshots/'+symbol+'/'+group+'.json\n+'+JSON.stringify(scrub(result))+'\n*** End Patch');
