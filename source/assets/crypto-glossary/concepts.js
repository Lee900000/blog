/* Explicit semantic aliases only: no fuzzy matching of financially distinct terms. */
(function (root, factory) {
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.GlossaryConcepts=api;
})(typeof window==='undefined'?globalThis:window, function () {
  const aliases=new Map();
  const families=[
    ['ETF','ETF / 交易所交易基金','交易所交易基金','Exchange-Traded Fund'],
    ['ETP','ETP / 交易所交易产品','交易所交易产品','Exchange-Traded Product'],
    ['现货 ETF','现货ETF','Spot ETF'],
    ['资金费率','实时资金费率','fundingRate','Funding Rate'],
    ['资金费用','资金费','资金费 / 资金费用','Funding Fee','fundingFee'],
    ['初始保证金','起始保证金','initialMargin','imr'],
    ['维持保证金','maintMargin','mmr'],
    ['维持保证金率','Maintenance Margin Rate'],
    ['初始保证金率','Initial Margin Rate'],
    ['维持保证金速算额','速算额','cum','Maintenance Amount'],
    ['杠杆','杠杆 / 杠杆倍数','杠杆倍数','leverage','lever'],
    ['最新价','Last Price','lastPrice','last'],
    ['标记价格','标记价','Mark Price','markPrice','markPx','MP'],
    ['指数价格','指数价','Index Price','indexPrice','idxPx'],
    ['强平价格','强平价','强平价格 / 预估强平价','U 本位强平价格','Liquidation Price','liquidationPrice','liqPx'],
    ['破产价格','破产价','Bankruptcy Price'],
    ['开仓均价','持仓均价','开仓均价 / 持仓均价','Entry Price','entryPrice','avgPx'],
    ['强平 / 爆仓','强制平仓 / 强平','强平','爆仓','Liquidation'],
    ['未实现盈亏','unrealizedProfit','Unrealized PnL','upl'],
    ['已实现盈亏','Realized PnL','realizedPnl'],
    ['收益率','回报率','未实现收益率','uplRatio','ROI','ROE'],
    ['名义价值','持仓名义价值','Notional Value','notional','notionalUsd'],
    ['合约面值与乘数','合约面值 / 合约乘数','合约面值 / 单张合约价值 / 单张价值','单张合约价值 / 单张价值','单张合约价值','单张价值','合约面值','合约乘数','合约乘数 Contract Multiplier','OKX 合约乘数','ctVal','ctMult','ctValCcy'],
    ['永续合约','PERPETUAL','SWAP'],['交割合约','Delivery Futures'],
    ['全仓 / 逐仓','Cross vs Isolated'],
    ['全仓保证金','Cross Margin'],['逐仓保证金','Isolated Margin','isolatedMargin / isolatedWallet'],
    ['保证金率','账户保证金率','mgnRatio'],
    ['钱包余额','Wallet Balance','walletBalance / balance'],
    ['全仓钱包余额','crossWalletBalance'],
    ['可用余额','availableBalance'],
    ['账户权益','总权益','Equity'],
    ['持仓方向','positionSide','posSide'],
    ['持仓量','持仓数量','positionAmt','pos'],
    ['保险基金','Insurance Fund'],['自动减仓','ADL'],
    ['风险限额 / 杠杆分层','风险限额 / 档位','风险限额','Risk Tiers'],
    ['交易手续费','手续费','Trading Fee'],
    ['挂单 / 吃单','吃单方 / 挂单方','Maker vs Taker'],
    ['仅减仓','只减仓','Reduce Only','reduceOnly'],
    ['限价单','LIMIT'],['市价单','MARKET'],
    ['客户端订单号','客户自定义订单号','newClientOrderId / origClientOrderId','clOrdId'],
    ['撤单','撤单 / 撤单失败'],
    ['USDT','USDT / U'],['C2C / P2P','P2P'],
    ['基础币 / 计价币','交易对、基础资产、计价资产'],
    ['保证金币','保证金币种'],['结算币','结算币种'],
    ['价格精度','pricePrecision'],['数量精度','quantityPrecision'],
    ['最小价格变动','tickSz'],['基差','Basis'],
    ['溢价指数','Premium Index'],['资金费率上下限','资金费率上限 / 下限'],
    ['阶梯 / 档位','风险档位'],['收益率','PNL Percentage'],
    ['保证金余额','marginBalance / totalMarginBalance']
  ];
  function displayTitle(title,topic=''){
    if(/^F\d+$/i.test(title.trim()))return topic||'官方资料与适用说明';
    return title.replace(/(^|·\s*)(?:\d+(?:\.\d+)+\.?|\d+\.)\s+/g,'$1').replace(/[（(]\s*F\d+[^）)]*[）)]/gi,'').replace(/\bF\d+(?:[、 /]+F\d+)*\b/gi,'').replace(/\s+/g,' ').trim();
  }
  function clean(title){return displayTitle(title).replace(/（[^）]*）|\([^)]*\)/g,'').replace(/\s+/g,' ').trim().toLowerCase();}
  for(const family of families)for(const alias of family)aliases.set(clean(alias),family[0]);
  function canonical(title){const key=clean(title);return aliases.get(key)||key;}
  function mergeEntries(entries){
    const groups=new Map();
    for(const entry of entries){
      // Explanatory chapters can merge with their exact concept; generic numbered
      // source indexes remain independently accessible rather than being discarded.
      const key=canonical(entry.title);
      if(!groups.has(key))groups.set(key,{...entry,concept:key,members:[],nodes:[],aliasIds:[],categories:[],text:''});
      const group=groups.get(key);group.members.push(entry);group.nodes.push(...entry.nodes);group.aliasIds.push(entry.id);
      if(!group.categories.includes(entry.category))group.categories.push(entry.category);
      group.text+=' '+entry.title.toLowerCase()+' '+entry.text;
      if(!entry.professional&&group.professional){group.title=entry.title;group.id=entry.id;group.category=entry.category;group.professional=false;}
    }
    return [...groups.values()];
  }
  return {canonical,mergeEntries,displayTitle};
});
