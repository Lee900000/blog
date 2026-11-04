/* Local teaching calculators. Percent fields accept displayed percentages, not fractions. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.GlossaryCalculators=api;})(typeof window==='undefined'?globalThis:window,function(){
  'use strict';
  const models={};
  const format=value=>new Intl.NumberFormat('zh-CN',{maximumSignificantDigits:12}).format(Object.is(value,-0)?0:value);
  const field=(key,label,value,unit='',min=0,positive=false,max)=>({key,label,value,unit,min,positive,max});
  const positive=(key,label,value,unit='USDT')=>field(key,label,value,unit,0,true);
  const signed=(key,label,value,unit='USDT')=>({...field(key,label,value,unit),min:undefined});
  const percent=(key,label,value,allowNegative=false)=>field(key,label,value,'%',allowNegative?-100:0,false,100);
  const side={key:'side',label:'持仓方向',value:'long',options:[['long','多头 · 买涨'],['short','空头 · 买跌']]};
  const direction=input=>input.side==='long'?1:-1;
  const money=(value,label,steps,details=[])=>({value,label,unit:'USDT',steps,details});
  const detail=(value,label,unit)=>({value,label,unit});
  function define(key,title,fields,formula,scope,calculate){
    models[key]={title,fields,formula,scope,calculate(raw={}){
      const input={};
      for(const item of fields){
        const value=raw[item.key];
        if(item.options){
          if(!item.options.some(option=>option[0]===value))throw new Error('请选择'+item.label+'。');
          input[item.key]=value;continue;
        }
        if(value===null||value===undefined||String(value).trim()==='')throw new Error('请输入'+item.label+'，不能为空。');
        if(typeof value!=='number'&&typeof value!=='string')throw new Error(item.label+'必须是有限数值。');
        const number=Number(value);
        if(!Number.isFinite(number))throw new Error(item.label+'必须是有限数值。');
        if(item.min!==undefined&&(number<item.min||(item.positive&&number===item.min)))throw new Error(item.label+'必须'+(item.positive?'大于':'不小于')+item.min+'。');
        if(item.max!==undefined&&number>item.max)throw new Error(item.label+'不能大于'+item.max+item.unit+'。');
        input[item.key]=number;
      }
      const result=calculate(input);
      if(!Number.isFinite(result.value)||(result.details||[]).some(item=>!Number.isFinite(item.value)))throw new Error('数值过大或无法得到有限结果，请检查输入。');
      return result;
    }};
  }
  define('notional','名义价值',[positive('quantity','持有币数',1,'币'),positive('price','参考价格',30000,'USDT / 币')],
    '仓位总金额 = 持有币数 × 参考价格',
    '仅为以币数计量的线性仓位；张数须先按产品面值换成币数，反向合约不能直接套用。',
    x=>money(x.quantity*x.price,'仓位总金额',[`${format(x.quantity)} 币 × ${format(x.price)} USDT / 币 = ${format(x.quantity*x.price)} USDT`]));
  define('initial-margin','初始保证金',[positive('notional','仓位总金额',10000),positive('leverage','杠杆倍数',10,'倍')],
    '基础初始保证金 = 仓位总金额 ÷ 杠杆倍数',
    '线性单仓位的基础关系；不含开仓亏损、费用预留、风险档位与组合保证金抵扣，结果不是开仓所需全部余额。',
    x=>money(x.notional/x.leverage,'基础初始保证金',[`${format(x.notional)} USDT ÷ ${format(x.leverage)} 倍 = ${format(x.notional/x.leverage)} USDT`]));
  define('maintenance-margin','维持保证金',[positive('notional','档位口径仓位金额',100000),percent('rate','维持保证金率',.5),field('cum','档位速算额',50,'USDT')],
    '维持保证金 = 仓位总金额 × 维持保证金率 − 速算额',
    '仅演示固定档位；费率、速算额和名义价值必须来自同一产品及档位。示例不是当前风险参数。',
    x=>{const value=x.notional*x.rate/100-x.cum;if(value<0)throw new Error('速算额不能使维持保证金为负，请核对档位。');return money(value,'维持保证金',[`${format(x.notional)} × (${format(x.rate)} ÷ 100) − ${format(x.cum)} = ${format(value)} USDT`]);});
  define('trading-fee','交易手续费',[positive('quantity','成交币数',1,'币'),positive('price','成交价格',30000,'USDT / 币'),percent('rate','本笔成交费率',.04,true)],
    '本笔费用 = 成交币数 × 成交价格 × 手续费率',
    '一次线性成交的假设费用；开仓和平仓需分别计算。正数为费用，负数仅表示按输入负费率算出的返还，实际返还、抵扣和取整按产品规则。',
    x=>money(x.quantity*x.price*x.rate/100,'本笔成交费用',[`${format(x.quantity)} × ${format(x.price)} × (${format(x.rate)} ÷ 100) = ${format(x.quantity*x.price*x.rate/100)} USDT`]));
  define('funding-fee','资金费用',[side,positive('quantity','结算时持有币数',1,'币'),positive('price','结算标记价格',30000,'USDT / 币'),percent('rate','本期资金费率',.01,true)],
    '仓位总金额 = 持有币数 × 结算标记价\n资金费用金额 = 仓位总金额 × 费率的绝对值\n正费率多头付，负费率空头付',
    '仅算一次线性合约结算，输入的是该周期最终费率。结果约定收入为正、支出为负；持仓时点、取整与入账方式以平台规则为准。',
    x=>{const notional=x.quantity*x.price,value=-direction(x)*notional*x.rate/100;return money(value,value>0?'本次收到':value<0?'本次支付（负数）':'本次无收付',[
      `仓位总金额：${format(x.quantity)} × ${format(x.price)} = ${format(notional)} USDT`,
      `费用金额：${format(notional)} × (${format(Math.abs(x.rate))} ÷ 100) = ${format(Math.abs(value))} USDT`,
      x.rate===0?'费率为 0，本例没有资金费收付。':`${x.rate>0?'正费率：多头付、空头收':'负费率：空头付、多头收'}；当前${x.side==='long'?'多头':'空头'}${value>0?'收到':'支付'} ${format(Math.abs(value))} USDT。`
    ]);});
  define('settlement-frequency','结算频率',[positive('hours','每隔几小时结算',8,'小时'),side,positive('notional','每次结算的仓位金额',30000),percent('rate','每期资金费率',.01,true)],
    '一天结算次数 = 24 ÷ 间隔小时\n单次费用金额 = 仓位金额 × 费率的绝对值\n正费率多头支付、空头收到；负费率空头支付、多头收到\n一天合计金额 = 单次费用金额 × 一天结算次数',
    '假设从一个结算时点之后开始完整持有 24 小时，并在每个结算时点都有仓位，仓位金额和每期费率保持不变。只接收可将 24 小时分成整数期的间隔；实际结算排程和费率可能变化，这不是日收益保证。',
    x=>{const count=24/x.hours;if(!Number.isInteger(count)||count<1)throw new Error('间隔必须能把 24 小时分为完整的整数期（即整除 24）。');const fee=-direction(x)*x.notional*x.rate/100,amount=Math.abs(fee),sideName=x.side==='long'?'多头':'空头',flow=fee>0?'收到':'支付';return {value:count,label:'完整 24 小时的结算次数',unit:'次',steps:[
      `24 ÷ ${format(x.hours)} = ${format(count)} 次`,
      `单次费用金额：${format(x.notional)} × (${format(Math.abs(x.rate))} ÷ 100) = ${format(amount)} USDT`,
      x.rate===0?'资金费率为 0，本例没有收付。':`${x.rate>0?'正费率，多头支付、空头收到':'负费率，空头支付、多头收到'}；当前${sideName}${flow} ${format(amount)} USDT。`,
      x.rate===0?'假设费率不变，24 小时合计为 0 USDT。':`假设不变时，${sideName} 24 小时共${flow}：${format(amount)} × ${format(count)} = ${format(Math.abs(fee*count))} USDT`
    ],details:[detail(fee,'单次现金流（收入正、支出负）','USDT'),detail(fee*count,'假设不变时的 24 小时合计','USDT')]};});
  for(const [key,title,priceLabel] of [['unrealized-pnl','未实现盈亏','当前参考价格'],['realized-pnl','已实现盈亏','本次平仓价格']]){
    define(key,title,[side,positive('quantity',key==='realized-pnl'?'本次平仓币数':'持有币数',1,'币'),positive('entry','开仓均价',30000,'USDT / 币'),positive('price',priceLabel,31000,'USDT / 币')],
      '买涨盈亏 =（参考价 − 开仓价）× 币数\n买跌盈亏 =（开仓价 − 参考价）× 币数',
      key==='realized-pnl'?'仅计算本次平掉部分的线性成交价差盈亏；未扣手续费和资金费用，不能直接当作平台净已实现盈亏字段。':'仅计算线性仓位的价差浮盈亏，不含手续费、资金费用或汇率变化；风控口径须使用对应产品规定的参考价格。',
      x=>money(direction(x)*x.quantity*(x.price-x.entry),key==='realized-pnl'?'本次平仓价差盈亏':'当前未实现盈亏',[
        x.side==='long'?`(${format(x.price)} − ${format(x.entry)}) × ${format(x.quantity)} = ${format(x.quantity*(x.price-x.entry))} USDT`:`(${format(x.entry)} − ${format(x.price)}) × ${format(x.quantity)} = ${format(x.quantity*(x.entry-x.price))} USDT`
      ]));
  }
  define('roi','收益率',[signed('pnl','同口径收益金额',100),positive('capital','作为分母的投入金额',1000)],
    '收益率 = 收益金额 ÷ 指定投入金额 × 100%',
    '分母由你指定，可用于解释基础收益率。投入本金、仓位保证金与账户权益是不同口径；费用是否计入收益须先统一，结果不是未来回报承诺。',
    x=>({value:x.pnl/x.capital*100,label:'按所选分母计算的收益率',unit:'%',steps:[`${format(x.pnl)} ÷ ${format(x.capital)} × 100% = ${format(x.pnl/x.capital*100)}%`]}));
  define('average-entry','开仓均价',[positive('quantity1','第一笔币数',1,'币'),positive('price1','第一笔成交价',30000,'USDT / 币'),positive('quantity2','第二笔币数',1,'币'),positive('price2','第二笔成交价',32000,'USDT / 币')],
    '加权均价 =（第一笔金额 + 第二笔金额）÷ 两笔总币数',
    '两笔同方向、同产品的线性成交，不含费用。反向合约、反转持仓或特殊重置口径不能套用。',
    x=>{const total=x.quantity1*x.price1+x.quantity2*x.price2,q=x.quantity1+x.quantity2;return {value:total/q,label:'两笔加权开仓均价',unit:'USDT / 币',steps:[`成交总金额：${format(x.quantity1)} × ${format(x.price1)} + ${format(x.quantity2)} × ${format(x.price2)} = ${format(total)} USDT`,`总币数：${format(x.quantity1)} + ${format(x.quantity2)} = ${format(q)} 币`,`加权均价：${format(total)} ÷ ${format(q)} = ${format(total/q)} USDT / 币`]};});
  define('spread','买一 / 卖一与价差',[positive('bid','买一报价',99,'USDT'),positive('ask','卖一报价',101,'USDT')],
    '价差 = 卖一价 − 买一价\n中间价 =（买一价 + 卖一价）÷ 2\n相对价差 = 价差 ÷ 中间价 × 100%',
    '同产品、同时点的有效最优报价，相对价差以中间价为分母。它不是手续费，也不包含扫多档滑点；报价和可成交数量会变化。',
    x=>{if(x.ask<x.bid)throw new Error('本例要求卖一价不低于买一价，请核对报价时点。');const gap=x.ask-x.bid,mid=(x.bid+x.ask)/2;return money(gap,'买卖价差',[`${format(x.ask)} − ${format(x.bid)} = ${format(gap)} USDT`,`中间价：(${format(x.bid)} + ${format(x.ask)}) ÷ 2 = ${format(mid)} USDT`,`相对价差：${format(gap)} ÷ ${format(mid)} × 100% = ${format(gap/mid*100)}%`],[detail(gap/mid*100,'相对价差（分母为中间价）','%')]);});
  define('etf-nav','每份净值与折溢价',[positive('assets','基金资产总值',1020000,'元'),field('liabilities','基金负债总额',20000,'元'),positive('shares','存续份额数',100000,'份'),positive('price','每份市场价格',10.2,'元 / 份')],
    '每份净值 =（资产总值 − 负债总额）÷ 存续份额数\n折溢价率 =（市场价格 − 每份净值）÷ 每份净值 × 100%',
    '仅解释净值与折溢价的算术关系。资产、负债与市场价格须同币种、尽量同估值时点；份额数不是成交量，昨日净值不代表当前价值。',
    x=>{if(x.assets<=x.liabilities)throw new Error('净资产须为正，请核对资产与负债。');const nav=(x.assets-x.liabilities)/x.shares,premium=(x.price-nav)/nav*100;return {value:nav,label:'每份资产净值',unit:'元 / 份',steps:[`基金净资产：${format(x.assets)} − ${format(x.liabilities)} = ${format(x.assets-x.liabilities)} 元`,`每份净值：${format(x.assets-x.liabilities)} ÷ ${format(x.shares)} = ${format(nav)} 元 / 份`,`折溢价率：(${format(x.price)} − ${format(nav)}) ÷ ${format(nav)} × 100% = ${format(premium)}%`],details:[detail(premium,'折溢价率（正为溢价、负为折价）','%')]};});
  define('spot-share','现货产品的每份持币价值',[positive('holdings','产品持币总量',100,'币'),positive('shares','存续份额数',100000,'份'),positive('price','同时点参考币价',100000,'美元 / 币')],
    '每份对应币数 = 总持币量 ÷ 存续份额数\n每份持币价值 = 每份对应币数 × 同时点币价',
    '单一持币的教学简化，忽略现金、负债、费用和份额变化；结果不是份额成交价，也不是普通持有人可以赎回或提走的币数承诺。',
    x=>{const coin=x.holdings/x.shares;return {value:coin*x.price,label:'每份持币的简化价值',unit:'美元 / 份',steps:[`每份币数：${format(x.holdings)} ÷ ${format(x.shares)} = ${format(coin)} 币 / 份`,`每份价值：${format(coin)} × ${format(x.price)} = ${format(coin*x.price)} 美元 / 份`],details:[detail(coin,'每份简化对应币数','币 / 份')]};});
  define('liquidation','逐仓预估强平价',[side,positive('margin','分配的仓位保证金',3000),positive('quantity','持有币数',1,'币'),positive('entry','开仓均价',30000,'USDT / 币'),percent('rate','固定档位维持保证金率',5),field('cum','同档位速算额',0,'USDT')],
    '多头强平价 =（开仓价 × 持有币数 − 保证金 − 速算额）÷［持有币数 ×（1 − 维持保证金率）］\n空头强平价 =（保证金 + 速算额 + 开仓价 × 持有币数）÷［持有币数 ×（1 + 维持保证金率）］',
    '仅限 USDT 本位线性单仓位逐仓模型，固定风险档位，以候选强平价计算维持要求，不含手续费、清算费和其他仓位。输入档位必须在算出的价格处仍有效；跨档、多币种、全仓及借币卖出不适用。结果不是保证成交价或平台完整风控结果。',
    x=>{if(x.rate>=100)throw new Error('本例维持保证金率须小于 100%。');const d=direction(x),r=x.rate/100,p=(x.margin+x.cum-d*x.quantity*x.entry)/(x.quantity*(r-d));if(!(p>0))throw new Error('当前参数得不到有效的正强平价格。');const mm=x.quantity*p*r-x.cum;if(mm<0)throw new Error('候选价格下维持要求为负，请核对速算额和档位。');if((d===1&&p>=x.entry)||(d===-1&&p<=x.entry))throw new Error('按当前输入，开仓价处已经不满足本例维持要求，请核对保证金与档位。');return {value:p,label:'逐仓预估强平价格',unit:'USDT / 币',steps:[
      `维持保证金率：${format(x.rate)} ÷ 100 = ${format(r)}`,
      x.side==='long'?`多头强平价：(${format(x.entry)} × ${format(x.quantity)} − ${format(x.margin)} − ${format(x.cum)}) ÷ [${format(x.quantity)} × (1 − ${format(r)})] = ${format(p)}`:`空头强平价：(${format(x.margin)} + ${format(x.cum)} + ${format(x.entry)} × ${format(x.quantity)}) ÷ [${format(x.quantity)} × (1 + ${format(r)})] = ${format(p)}`,
      x.side==='long'?`候选价格处多头权益：${format(x.margin)} + ${format(x.quantity)} × (${format(p)} − ${format(x.entry)}) = ${format(mm)} USDT`:`候选价格处空头权益：${format(x.margin)} + ${format(x.quantity)} × (${format(x.entry)} − ${format(p)}) = ${format(mm)} USDT`,
      `同点维持要求：${format(x.quantity)} × ${format(p)} × ${format(r)} − ${format(x.cum)} = ${format(mm)} USDT`
    ]};});
  define('borrowing-liquidation','借入 USDT 买币的假设强平价',[positive('debt','尚未归还的借款本金',8000),field('interest','已产生利息',0,'USDT'),positive('quantity','账户持有全部币数',100,'币'),positive('ratio','假设强平风险比例',1.1,'倍')],
    '欠款总额 = 借款本金 + 已产生利息\n假设强平价 = 欠款总额 × 假设风险比例 ÷ 持有币数',
    '只演示借入 USDT 买一种币、账户仅持有这种币的假设模型；风险比例定义为资产价值 ÷ 欠款。阈值由你假设，示例 1.10 不是任何平台当前阈值。忽略抵押折扣、费用和风险分层；不能套用全仓多币种、永续合约或借币卖出。',
    x=>{const debt=x.debt+x.interest,value=debt*x.ratio/x.quantity;return {value,label:'假设模型的预估强平价格',unit:'USDT / 币',steps:[`欠款总额：${format(x.debt)} + ${format(x.interest)} = ${format(debt)} USDT`,`假设强平价：${format(debt)} × ${format(x.ratio)} ÷ ${format(x.quantity)} = ${format(value)} USDT / 币`,`核对风险比例：${format(x.quantity)} × ${format(value)} ÷ ${format(debt)} = ${format(x.ratio)} 倍`]};});
  define('basis','基差',[positive('contractPrice','同到期口径合约价',30020,'USDT / 币'),positive('spotPrice','同时点现货价',30000,'USDT / 币')],
    '基差 = 合约价格 − 现货价格',
    '这里采用合约价减现货价的价格差口径；须对齐产品、币种、时点及到期口径。不是资金费率中的溢价比例，也不代表可直接获得的套利收益。',
    x=>({value:x.contractPrice-x.spotPrice,label:'基差（合约减现货）',unit:'USDT / 币',steps:[`${format(x.contractPrice)} − ${format(x.spotPrice)} = ${format(x.contractPrice-x.spotPrice)} USDT / 币`]}));
  for(const [key,title,kind] of [['index-price','指数价格','price'],['average-premium','平均溢价指数','sample']]){
    const isPrice=kind==='price',valueFields=isPrice?[positive('price1','第一价格源',100,'USDT / 币'),positive('price2','第二价格源',102,'USDT / 币')]:[percent('sample1','第一溢价样本',.1,true),percent('sample2','第二溢价样本',.2,true)];
    define(key,title,[valueFields[0],field('weight1','第一项权重',3,'份权重'),valueFields[1],field('weight2','第二项权重',1,'份权重')],
      '加权平均 =（第一项数值 × 权重 + 第二项数值 × 权重）÷ 总权重',
      isPrice?'两个假设价格源的加权结构，不是当前平台的指数算法。价格须同计价口径；成分、异常剔除、断源和权重更新要按具体产品规则。':'两个假设百分比样本的加权结构；权重相等时才等于简单平均。真实窗口、采样和时间权重由产品决定，不能与价格单位的平均基差互换。',
      x=>{const sum=x.weight1+x.weight2;if(!(sum>0))throw new Error('两项权重之和必须大于 0。');const a=x[kind+'1'],b=x[kind+'2'],value=(a*x.weight1+b*x.weight2)/sum,unit=isPrice?'USDT / 币':'%';return {value,label:isPrice?'两来源加权指数价':'两样本加权平均溢价',unit,steps:[`总权重：${format(x.weight1)} + ${format(x.weight2)} = ${format(sum)}`,`(${format(a)} × ${format(x.weight1)} + ${format(b)} × ${format(x.weight2)}) ÷ ${format(sum)} = ${format(value)} ${unit}`]};});
  }
  define('contract-size','合约张数换算币数',[positive('lots','合约张数',100,'张'),positive('face','以标的币计的单张面值',.01,'币 / 张'),positive('multiplier','产品独立乘数',1,'倍')],
    '换算币数 = 合约张数 × 每张面值 × 独立乘数',
    '仅限面值以标的币表示的规格。独立乘数必须按产品文件填写，不能把同一面值字段重复乘一次；USD 面值反向合约、不同面值币种不能照搬。',
    x=>({value:x.lots*x.face*x.multiplier,label:'换算后的标的币数',unit:'币',steps:[`${format(x.lots)} 张 × ${format(x.face)} 币 / 张 × ${format(x.multiplier)} = ${format(x.lots*x.face*x.multiplier)} 币`]}));
  define('initial-margin-rate','初始保证金率',[field('margin','基础初始保证金',1000,'USDT'),positive('notional','同口径仓位总金额',10000)],
    '初始保证金率 = 基础初始保证金 ÷ 仓位总金额 × 100%',
    '基础线性单仓位比例，两项须同币种、同账户及持仓范围。只有基础保证金等于仓位金额除以杠杆时，该比例才等于杠杆倒数；不含费用和账户抵扣。',
    x=>({value:x.margin/x.notional*100,label:'基础初始保证金率',unit:'%',steps:[`${format(x.margin)} ÷ ${format(x.notional)} × 100% = ${format(x.margin/x.notional*100)}%`]}));
  const concepts={
    '名义价值':'notional','初始保证金':'initial-margin','维持保证金':'maintenance-margin','交易手续费':'trading-fee','资金费用':'funding-fee',
    '未实现盈亏':'unrealized-pnl','已实现盈亏':'realized-pnl','收益率':'roi','开仓均价':'average-entry',
    '买一 / 卖一与价差':'spread','买卖价差':'spread','ETF':'etf-nav','ETF / 交易所交易基金':'etf-nav','现货 ETF':'spot-share',
    '强平价格':'liquidation','杠杆借贷强平价格':'borrowing-liquidation',
    '基差':'basis','指数价格':'index-price','平均溢价指数':'average-premium','合约面值与乘数':'contract-size','初始保证金率':'initial-margin-rate'
  };
  function resolve(options={}){
    const key=options.calculator||concepts[options.concept];
    return Object.prototype.hasOwnProperty.call(models,key)?key:null;
  }
  let serial=0;
  function mount(target,options={}){
    const key=resolve(options);if(!key||!target||!target.ownerDocument)return null;
    const doc=target.ownerDocument,model=models[key],uid='glossary-calculator-'+(++serial);
    const el=(tag,className,text)=>{const node=doc.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;};
    const widget=el('section','gc-calculator');widget.dataset.calculator=key;widget.setAttribute('aria-labelledby',uid+'-title');
    const header=el('div','gc-header');const title=el('h5','gc-title','动手算一遍 · '+model.title);title.id=uid+'-title';
    const reset=el('button','gc-reset','重置示例');reset.type='button';header.append(title,reset);widget.append(header);
    widget.append(el('p','gc-example-note','教学假设数据，可自行修改；不代表当前产品参数。'));
    const grid=el('div','gc-grid'),form=el('form','gc-inputs');form.noValidate=true;form.addEventListener('submit',event=>event.preventDefault());
    const controls=new Map();
    for(const item of model.fields){
      const wrap=el('label','gc-field');const control=el(item.options?'select':'input','gc-input');control.id=uid+'-'+item.key;control.name=item.key;
      wrap.htmlFor=control.id;wrap.append(el('span','gc-label',item.label+(item.unit?'（'+item.unit+'）':'')));
      if(item.options){for(const [value,label] of item.options){const option=el('option','',label);option.value=value;control.append(option);}}
      else {control.type='number';control.step='any';control.inputMode='decimal';control.required=true;if(item.min!==undefined)control.min=String(item.min);if(item.max!==undefined)control.max=String(item.max);}
      control.value=String(item.value);control.setAttribute('aria-describedby',uid+'-error');wrap.append(control);form.append(wrap);controls.set(item.key,control);
    }
    const output=el('div','gc-output');output.setAttribute('aria-live','polite');output.setAttribute('aria-atomic','true');
    const error=el('p','gc-error');error.id=uid+'-error';error.hidden=true;
    const result=el('div','gc-result'),steps=el('ol','gc-steps');output.append(error,result,steps);grid.append(form,output);widget.append(grid);
    const formula=el('details','gc-formula');formula.append(el('summary','','查看本例公式'),el('div','gc-formula-text',model.formula));widget.append(formula);
    const scope=el('p','gc-scope',model.scope);widget.append(scope);
    function update(){
      try{
        const values=Object.fromEntries([...controls].map(([name,control])=>[name,control.value]));const answer=model.calculate(values);
        error.hidden=true;error.textContent='';result.hidden=false;steps.hidden=false;result.replaceChildren();steps.replaceChildren();
        result.append(el('span','gc-result-label',answer.label),el('strong','gc-value',format(answer.value)+' '+answer.unit));
        for(const item of answer.details||[]){const row=el('div','gc-detail');row.append(el('span','',item.label),el('b','',format(item.value)+' '+item.unit));result.append(row);}
        for(const step of answer.steps)steps.append(el('li','',step));
        for(const control of controls.values())control.removeAttribute('aria-invalid');
      }catch(problem){
        error.textContent=problem.message;error.hidden=false;result.hidden=true;steps.hidden=true;
        for(const [name,control] of controls){const item=model.fields.find(field=>field.key===name);if(!item.options&&(!control.value.trim()||!Number.isFinite(Number(control.value))))control.setAttribute('aria-invalid','true');else control.removeAttribute('aria-invalid');}
      }
    }
    form.addEventListener('input',update);form.addEventListener('change',update);
    reset.addEventListener('click',()=>{for(const item of model.fields)controls.get(item.key).value=String(item.value);update();});
    update();target.append(widget);return widget;
  }
  return {mount,models,resolve};
});
