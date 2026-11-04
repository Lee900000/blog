/* Reader copy: concise definitions first. Project-model examples are explicitly
 * separated from exchange rules. Source notes never become the main narrative. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.GlossaryEditorial=api;})(typeof window==='undefined'?globalThis:window,function(){
  const api='https://www.okx.com/docs-v5/en/';
  const account='https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Information-V3';
  const tiers='https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Notional-and-Leverage-Brackets';
  const funding='https://www.binance.com/en/support/faq/360033525031';
  const mark='https://www.okx.com/help/ii-mark-price-and-last-price';
  const f=(name,scope,expression,variables)=>({name,scope,expression,variables});
  const entries={
    '强平价格':{
      title:'强平价格',english:'Liquidation Price',
      definition:'按指定账户状态估算，权益刚好触及维持要求时对应的价格。它是风险阈值的估算，不是保证平仓的成交价。',
      scope:'以下仅解释 USDT 本位线性合约的简化模型：数量用币数、档位固定、不计平仓手续费和清算费。全仓模型还假定其他合约价格暂时不变；币本位反向合约不能套用。',
      formulas:[
        f('逐仓：维持保证金按强平时价格计算','单仓位、固定档位；由“仓位权益 = 维持保证金”推导，不是交易所完整强平公式。','M + d × Q × (P − E) = Q × P × r − A\nP = (M + A − d × Q × E) / [Q × (r − d)]',[['P','预估强平价，USDT / 币'],['M','该仓位分配的保证金，USDT，不含本模型浮动盈亏'],['Q','持仓币数，取正值；张数需先乘单张合约价值'],['E','开仓均价，USDT / 币'],['d','多头 +1，空头 −1'],['r','当前档位维持保证金率，用小数表示'],['A','该档位的维持保证金速算额，USDT']]),
        f('全仓：其他合约保持当前状态','单向线性持仓、固定档位、不计费用；其他合约的浮盈亏和维持要求冻结。','P = (W − H + U + A − d × Q × E) / [Q × (r − d)]',[['W','适用于本模型的全仓钱包余额，USDT'],['H','其他合约的维持保证金之和，USDT'],['U','其他合约的未实现盈亏之和，USDT，可正可负'],['Q / E / d / r / A','含义同逐仓模型']]),
        f('双向持仓：分别保留多、空两条腿','全仓同一线性合约的多空仓位；其他合约冻结、档位固定、不计费用。分母为零时不能直接求出有效价格。','P = (W − H + U + A_L + A_S − Q_L × E_L + Q_S × E_S)\n    / (Q_L × r_L + Q_S × r_S − Q_L + Q_S)',[['Q_L / Q_S','多头 / 空头币数，均取正值'],['E_L / E_S','多头 / 空头开仓均价'],['r_L / r_S','各腿维持保证金率'],['A_L / A_S','各腿速算额'],['W / H / U','含义同全仓模型']])
      ],
      example:'逐仓多头：保证金 3,000 U、1 BTC、开仓价 30,000、维持保证金率 5%、速算额 0，得 P ≈ 28,421.05。此时权益约 1,421.05 U，维持保证金也约 1,421.05 U。若改成按开仓成本固定维持保证金，结果是 28,500；两个模型不同，不能混用。',
      cautions:['资料中的全仓和逐仓手续费修正项存在符号冲突，本页不将争议项并入示例公式。','仓位、余额、资金费用、其他合约价格或风险档位变化，都可能改变显示值；候选价格跨档时需重新核对档位。','实际强平通常依据标记价格及平台风险规则，估算值不能代替交易所风控引擎。'],
      sources:[['Binance · 杠杆分层与维持保证金参数',tiers],['OKX · 账户与持仓风险字段',api]],basis:'由本词典配套的《合约公式整理》《核心机制讲解》中的线性模型整理；本页算例已按权益与维持保证金相等验算。'
    },
    '初始保证金':{title:'初始保证金',english:'Initial Margin',definition:'为建立仓位所需的起始资金要求。它与维持保证金不同：前者关注能否开仓，后者关注能否持续持有。',scope:'下面只展示线性单仓位的基础关系，不含订单开仓亏损、预留费用和组合保证金抵扣。',formulas:[f('按名义价值估算','线性合约基础模型；平台实际初始保证金还受风险档位、账户模式和费用影响。','IM = V / L',[['IM','初始保证金，USDT'],['V','用于本次计算的仓位名义价值，USDT'],['L','杠杆倍数']])],example:'名义价值 10,000 U、杠杆 10 倍，基础初始保证金为 1,000 U；可用余额未必只需这 1,000 U。',cautions:['不要把账户级初始保证金、持仓初始保证金和订单冻结保证金相加或互换而不检查口径。'],sources:[['Binance · 账户信息',account],['Binance · 杠杆分层',tiers]]},
    '维持保证金':{title:'维持保证金',english:'Maintenance Margin',definition:'平台要求为现有仓位持续保留的风险缓冲金额。它不是维持保证金率，单位通常是金额。',scope:'以下为带速算额的分层模型。名义价值使用什么价格、档位如何确定，需要按具体产品核对。',formulas:[f('固定档位下的维持要求','线性分层模型；不代表所有交易所账户模式通用。','MM = V × r − A',[['MM','维持保证金，USDT'],['V','该档位口径下的名义价值，USDT'],['r','档位维持保证金率'],['A','档位速算额，USDT']])],example:'名义价值 100,000 U、档位费率 0.5%、速算额 50 U，则 MM = 450 U。数字为假设参数，不是当前产品档位。',cautions:['强平模型如果用候选强平价算 V，就不能同时套用按开仓成本固定的维持保证金。'],sources:[['Binance · 杠杆分层参数',tiers]]},
    '标记价格':{title:'标记价格',english:'Mark Price',definition:'按产品规则计算的参考价格，常用于未实现盈亏和风险判断。它不同于最近一笔成交形成的最新价。',scope:'这里展示本词典配套资料中的“指数价 + 平均基差”方案。Binance、OKX 与不同产品的最终方案可能不同，不能把项目方案写成统一行业规则。',formulas:[f('平均基差方案','价格差口径；只有基差取平均，指数价取当前值。窗口、样本数及异常处理需单独配置。','mid_i = (bid_i + ask_i) / 2\nbasis_i = mid_i − index_i\nbasis_ma = Σ basis_i / N\nmark = index_now + basis_ma',[['bid_i / ask_i','采样时买一 / 卖一价'],['index_i','采样时指数价'],['N','有效基差样本数'],['basis_ma','基差均值，价格单位，不是资金费率用的比例指标']])],example:'五个基差样本为 8、12、10、6、14 U，均值 10 U；当前指数价 30,000，则示例标记价 30,010。',cautions:['不能把资金费率链的平均溢价比例直接加到指数价格上。','EMA 与 SMA 不是同一算法；不同采样窗口不能只靠相同名称视为等价。'],sources:[['OKX · 标记价格与最新价格',mark]],basis:'本词典配套的《标记价生成方式》，仅作为项目方案解释。'},
    '资金费率':{title:'资金费率',english:'Funding Rate',definition:'永续合约多空双方交换资金费用所用的比例。通常正费率由多头向空头支付，负费率方向相反。',scope:'以下是本词典配套资料中的“平均溢价 + 利率钳制”基础模型。实际采样、结算周期、上下限和周期换算，以具体平台和合约为准。',formulas:[f('费率基础模型','示例采用比例单位；不默认所有产品使用相同参数，也不省略实际产品可能需要的结算周期换算。','F_raw = P_avg + clamp(I − P_avg, −δ, +δ)\nF = clamp(F_raw, floor, cap)',[['P_avg','按指定采样和权重得到的平均溢价指数'],['I','同一口径的利率'],['δ','利率差钳制范围'],['floor / cap','产品规定的费率下限 / 上限'],['clamp(x, a, b)','把 x 限制在 [a, b] 内']])],example:'假设平均溢价 0.10%、利率 0.01%、δ = 0.05%，则 F_raw = 0.05%；之后仍须检查产品上下限。',cautions:['简单平均和时间加权平均会产生不同结果。','不要把 0.01% 当成小数 0.01；正确小数是 0.0001。','结算周期不能一律假设为 8 小时，预估费率也不等于最终结算费率。'],sources:[['Binance · 资金费率机制',funding],['OKX · 当前资金费率字段',api+'#public-data-rest-api-get-funding-rate']]},
    '资金费用':{title:'资金费用',english:'Funding Fee',definition:'按照结算时持仓和资金费率计算的收付金额。资金费率是比例，资金费用是金额。',scope:'线性合约示例；本页约定用户收入为正、支出为负。实际名义价值、持仓时点、取整和入账规则由平台规定。',formulas:[f('结算金额与收付方向','Q 为无符号币数；不要同时把 V 和 d 都设为有符号量。','V = Q × mark\n用户资金费现金流 = −d × V × F',[['Q','结算时持仓币数，取正值'],['mark','结算口径采用的标记价'],['d','多头 +1、空头 −1'],['F','最终资金费率，小数形式']])],example:'1 BTC、标记价 30,000 U、费率 +0.01%：多头现金流 −3 U，空头 +3 U。',cautions:['双向持仓下是否按腿分别计费、扣款顺序及取整残差归属必须按平台规则核对。'],sources:[['Binance · 资金费用计算',funding]]},
    '未实现盈亏':{title:'未实现盈亏',english:'Unrealized PnL',definition:'当前参考价格与开仓均价之间的价差，对尚未平仓部分形成的盈亏。它随参考价格变化，不等于已到账利润。',scope:'仅适用于线性合约；使用标记价还是最新价必须事先说明。风控模型不可把两种价格口径混用。',formulas:[f('线性仓位浮盈亏','不含手续费、资金费用和汇率转换。','UPnL = d × Q × (P − E)',[['d','多头 +1、空头 −1'],['Q','持仓币数，取正值'],['P','所选参考价格'],['E','开仓均价']])],example:'多头 1 BTC，开仓 30,000、参考价 29,000，未实现盈亏为 −1,000 U。',cautions:['币本位反向合约的盈亏不能直接套用这条线性公式。'],sources:[['OKX · 持仓字段与未实现盈亏',api+'#trading-account-rest-api-get-positions']]},
    '破产价格':{title:'破产价格',english:'Bankruptcy Price',definition:'按给定模型计算，仓位权益降至零时对应的理论价格。它与触及维持要求的强平价不同。',scope:'下面是单仓位线性模型，不含费用、其他持仓、资金费和阶梯变化。',formulas:[f('单仓位权益归零','M 为该仓位分配的保证金；不把账户全部权益随意代入逐仓模型。','P_b = E − d × M / Q',[['P_b','理论破产价'],['E','开仓均价'],['M','仓位保证金，USDT'],['Q','持仓币数'],['d','多头 +1、空头 −1']])],example:'多头 1 BTC、开仓 30,000、保证金 3,000 U，理论破产价为 27,000。',cautions:['真实强平可能在权益归零前发生；破产价也不是实际平仓成交价。'],sources:[['OKX · 持仓风险与清算相关字段',api]],basis:'本词典配套的《合约公式整理》中的无费用线性模型。'},
    '名义价值':{title:'名义价值',english:'Notional Value',definition:'仓位在指定价格和计价单位下代表的交易规模，不是用户投入的保证金。',scope:'以下是线性合约按币数计算的名义价值。账户汇总时是否多空轧差，需要另行确认。',formulas:[f('数量换算与名义价值','假设合约数量可换算成标的币数；面值和乘数须从产品规格读取。','Q = n × c × k\nV = Q × P',[['n','合约张数'],['c','每张合约面值，以标的币计'],['k','独立合约乘数；不适用时按产品定义处理'],['P','指定的计价价格'],['Q / V','标的币数 / 名义价值']])],example:'100 张，每张 0.01 BTC，乘数 1，参考价 30,000 U，则对应 1 BTC、名义价值 30,000 U。',cautions:['USD 面值的反向合约不能不检查单位就照搬币面值公式。'],sources:[['OKX · 产品规格',api+'#public-data-rest-api-get-instruments']]},
    '开仓均价':{title:'开仓均价',english:'Average Entry Price',definition:'按仓位数量加权后的入场价格。它不一定等于最早一笔成交价，也不一定等于包含费用后的盈亏平衡价格。',scope:'同方向线性成交、数量以相同单位表示；仓位反转和平台特殊重置规则另行处理。',formulas:[f('数量加权均价','不含费用，不能把不同产品或不同币种直接合并。','E = Σ(P_i × Q_i) / Σ Q_i',[['P_i','该笔成交价'],['Q_i','该笔成交数量，取同向正值']])],example:'先买 1 BTC @30,000，再买 1 BTC @32,000，均价为 31,000。',cautions:['反向合约可能采用不同的成本或倒数加权口径。'],sources:[['OKX · 持仓均价字段',api+'#trading-account-rest-api-get-positions']]},
    '交易手续费':{title:'交易手续费',english:'Trading Fee',definition:'成交时按适用费率和成交规模计算的费用，通常区分 Maker 与 Taker。',scope:'以下为线性成交示例；费率等级、返佣、抵扣和取整以平台规则为准。',formulas:[f('单笔成交费用','成交量须换算为币数；若输入为张数，应先乘产品面值。','费用 = |Q| × P_fill × f',[['Q','成交币数'],['P_fill','成交价'],['f','本笔成交适用的费率']])],example:'成交 1 BTC、价格 30,000 U、假设费率 0.04%，费用为 12 U。',cautions:['这是一次成交的费用，往返开平仓须分别计算；负费率如何返还要看产品规则。'],sources:[['OKX · 费率与账单接口',api]]},
    '维持保证金速算额':{title:'维持保证金速算额',english:'Maintenance Amount',definition:'在分层维持模型中用于抵扣的金额，使跨档位的维持要求保持相应连续性。它不是费率。',scope:'适用于使用分层费率和速算额的模型；以下假设相邻档位按连续方式衔接。',formulas:[f('相邻档位的衔接','档位边界和速算额必须使用同一产品、同一计价单位。','A_new = B_prev × (r_new − r_prev) + A_prev',[['B_prev','前一档名义价值上界'],['r_new / r_prev','新档 / 前档维持保证金率'],['A_new / A_prev','新档 / 前档速算额']])],example:'前档上界 50,000 U，费率由 0.4% 升至 0.5%，前档速算额 0，则新档速算额为 50 U。',cautions:['示例档位为解释性假设，不可当成当前交易所风险表。'],sources:[['Binance · 杠杆档位中的 cum',tiers]]},
    '保证金率':{title:'保证金率',english:'Margin Ratio',definition:'比较权益与维持要求等风险量的比例。不同平台可能使用相反的分子、分母，因此百分比高低不能脱离公式判断。',scope:'以下展示两种互为倒数的简化观察口径，不把它们统一改成同一个字段。',formulas:[f('维持要求占权益的比例','仅说明比值方向；平台实际口径可能加入其他风险量。','R = MM / Equity',[['MM','适用范围内的维持要求'],['Equity','同一范围内的有效权益，须大于 0']]),f('权益覆盖维持要求的倍数','与上一比值方向相反；不能直接用相同颜色阈值解释。','Coverage = Equity / MM',[['Equity','同一范围的权益'],['MM','维持要求，须大于 0']])],example:'权益 1,000 U、维持要求 200 U：第一种口径为 20%，第二种为 5 倍（500%）。',cautions:['阈值、适用账户模式及实际强平条件必须对应平台定义；权益为零或负值时不能直接相除。'],sources:[['OKX · 账户保证金率 mgnRatio',api+'#trading-account-rest-api-get-balance']]},
    '收益率':{title:'收益率',english:'ROI / ROE',definition:'收益相对于某个基数的比例。基数可能是保证金、初始投入或名义价值，必须与数值一起说明。',scope:'下面以投入保证金为分母，只用于解释口径，不代表平台所有收益率字段。',formulas:[f('以保证金为基数','分母必须大于 0，是否扣除费用须明确。','ROI = PnL / M × 100%',[['PnL','按指定费用口径计算的收益'],['M','选定的保证金或投入基数']])],example:'收益 100 U、基数 1,000 U，则 ROI = 10%；若改用 10,000 U 名义价值作分母，则只有 1%。',cautions:['高收益率不等于高绝对收益；杠杆也会放大相对保证金的亏损比例。'],sources:[['OKX · 持仓收益率字段',api+'#trading-account-rest-api-get-positions']]},
    '已实现盈亏':{title:'已实现盈亏',english:'Realized PnL',definition:'已成交平仓或按平台规则已结算部分产生的盈亏。字段是否包含手续费和资金费用，取决于具体接口。',scope:'这里展示同一线性仓位的平仓价差盈亏，不把费用混入主公式。',formulas:[f('平仓价差盈亏','不含手续费和资金费；Q_close 为本次平仓币数。','PnL_close = d × Q_close × (P_close − E)',[['d','原仓位方向，多 +1、空 −1'],['Q_close','本次平仓币数，取正值'],['P_close / E','平仓成交价 / 开仓均价']])],example:'多头平掉 0.5 BTC，开仓均价 30,000、成交价 31,000，则价差收益 500 U，费用另算。',cautions:['某些 realizedPnl 字段已经综合费用，二次扣费会重复计算。'],sources:[['OKX · 持仓历史与盈亏字段',api+'#trading-account-rest-api-get-positions-history']]},
    '溢价指数':{title:'溢价指数',english:'Premium Index',definition:'用合约买卖侧价格相对现货指数的偏离，表达永续合约的溢价或折价。它是比例，不是价格差。',scope:'以下为本词典配套的资金费率方案中的冲击买卖价模型；不用项目旧版“以标记价截断”的写法。',formulas:[f('冲击买卖价口径','两个冲击价格须按同一冲击额度和指数口径计算。','P = [max(0, B_impact − I_px) − max(0, I_px − A_impact)] / I_px',[['B_impact / A_impact','买盘 / 卖盘冲击均价'],['I_px','同一时点指数价，须大于 0']])],example:'指数价 100、冲击买价 100.2、冲击卖价 100.3，则溢价指数为 0.2%；指数落在冲击买卖价之间时本模型为 0。',cautions:['不要与标记价链中的“平均基差（价格单位）”混用。'],sources:[['Binance · 溢价与资金费率',funding]]},
    '杠杆':{title:'杠杆',english:'Leverage',definition:'在给定模型中，名义交易规模相对于保证金的倍数。调整杠杆设置不一定立即改变现有仓位数量。',scope:'下面是单仓位的基础关系，不覆盖全仓实际杠杆或组合保证金抵扣。',formulas:[f('名义规模与保证金','按相同币种估值，保证金大于 0。','L = V / M',[['V','仓位名义价值'],['M','本模型采用的保证金金额']])],example:'名义价值 10,000 U、保证金 1,000 U，对应 10 倍。',cautions:['杠杆不是收益倍增承诺；同样价格波动对较少保证金的影响更大。'],sources:[['Binance · 杠杆分层',tiers]]},
    '钱包余额':{title:'钱包余额',english:'Wallet Balance',definition:'按平台账务规则记录的钱包资产余额。通常需要与未实现盈亏、保证金占用和可用余额分别理解。',scope:'本词典配套资料对是否包含仓位保证金存在不同定义，本页不选择一套作为通用标准。',formulas:[],example:'余额不变时，仓位浮亏仍可能降低权益；因此“余额有钱”不代表当前仍可开仓或转出。',cautions:['必须核对账户范围、币种和字段版本；项目钱包余额不能直接替代交易所钱包字段。'],sources:[['Binance · 余额与账户字段',account]]},
    '全仓钱包余额':{title:'全仓钱包余额',english:'Cross Wallet Balance',definition:'描述全仓范围钱包余额的账户字段，不等于可用余额或包含全部浮动盈亏的账户权益。',scope:'Binance 账户信息中的资产级字段与账户合计字段范围不同；金额单位按接口说明读取。',formulas:[],example:'检索 crossWalletBalance 时，还要区分 totalCrossWalletBalance、crossUnPnl 与 availableBalance。',cautions:['不能把资产级余额与美元估值的账户总量直接相加。'],sources:[['Binance · 账户信息 V3',account]]},
    '可用余额':{title:'可用余额',english:'Available Balance',definition:'按平台规则，当前可用于某种操作的金额。下单可用与最大可转出可能不是同一个量。',scope:'本词典配套资料给出了多套不等价算法，涉及是否计入浮盈亏、初始保证金和维持保证金；这里不拼成一条公式。',formulas:[],example:'转出金额需要查可转出规则，不能仅因为 availableBalance 有数值就认为可全部提走。',cautions:['应先确定操作：开仓、追加保证金、划转还是提现，再选对应字段。'],sources:[['Binance · 账户信息',account],['OKX · 最大可用与最大可提取接口',api]]},
    '合约面值与乘数':{title:'合约面值与乘数',english:'Contract Value / Multiplier',definition:'合约面值说明每张合约代表多少价值，独立乘数则是产品规格中的另一个系数。中文同名不代表跨平台语义相同。',scope:'币安“合约乘数”和 OKX ctVal 可能指相近规格；OKX ctMult 则是独立字段，不能把它们等同重命名。',formulas:[f('面值以标的币计价时的数量换算','仅适用于该面值币种与数量口径；必须同时读取面值币种。','Q = n × c × k',[['n','合约张数'],['c','以标的币计的单张面值'],['k','产品独立乘数'],['Q','换算后的标的币数']])],example:'100 张 × 0.01 BTC × 1 = 1 BTC。若面值为 100 USD，不能仍解释成 0.01 BTC。',cautions:['ctVal、ctValCcy、ctMult、ctType 必须结合起来看。'],sources:[['OKX · 产品规格字段',api+'#public-data-rest-api-get-instruments']]}
  };
  Object.assign(entries,{
    '指数价格':{title:'指数价格',english:'Index Price',definition:'按产品规则汇总多个现货价格源得到的参考价格，用于降低单一市场异常成交的影响。',scope:'以下只展示一般加权结构，不代表当前交易所的成分、权重或异常剔除规则。',formulas:[f('加权结构','价格源必须同一计价口径，有效权重之和大于 0。','Index = Σ(w_i × P_i) / Σ w_i',[['P_i','第 i 个有效价格源'],['w_i','相应权重，非负']])],example:'两个假设价格源为 100 和 102、权重为 3 和 1，则指数为 100.5。',cautions:['等权平均只是所有权重相同时的特例。','断源、异常价格、权重更新和币种换算属于产品规则，不能省略。'],sources:[['OKX · 指数与价格数据',api]]},
    '平均溢价指数':{title:'平均溢价指数',english:'Average Premium Index',definition:'在指定结算窗口内，对溢价指数采样值进行平均后得到的比例指标。',scope:'本词典配套项目资料采用简单平均；其他产品可能采用时间加权，不能互换。',formulas:[f('等权平均','每个有效样本权重相同。','P_avg = Σ P_i / n',[['P_i','第 i 个有效溢价样本'],['n','有效样本数，大于 0']]),f('加权平均','只展示结构；实际权重以对应产品为准。','P_avg = Σ(w_i × P_i) / Σ w_i',[['w_i','样本权重'],['P_i','相应溢价样本']])],example:'三个样本为 0%、0.1%、0.2%，简单平均为 0.1%；若权重为 1、2、3，则为约 0.1333%。',cautions:['标记价链的平均基差是价格单位，本指标是比例；两者名称相近但用途不同。'],sources:[['Binance · 资金费率与溢价采样',funding]]},
    '初始保证金率':{title:'初始保证金率',english:'Initial Margin Rate',definition:'按指定初始保证金和名义价值定义的比例，与维持保证金率不是同一个参数。',scope:'基础线性单仓位模型，不含订单开仓亏损、预留费用或账户抵扣。',formulas:[f('基础比例关系','V 大于 0；只有 IM = V / L 时才有 r_IM = 1 / L。','r_IM = IM / V\nr_IM = 1 / L',[['IM','基础初始保证金'],['V','名义价值'],['L','对应杠杆']])],example:'基础杠杆 10 倍，对应基础初始保证金率 10%。',cautions:['项目文件把手续费加到配置费率的做法不是所有平台的统一定义。'],sources:[['Binance · 杠杆分层',tiers]]},
    '维持保证金率':{title:'维持保证金率',english:'Maintenance Margin Rate',definition:'维持要求模型中的费率参数，常随仓位风险档位变化。它是比例，不是维持保证金金额。',scope:'带速算额的固定档位模型；不能忽略速算额直接把 MM / V 当成档位费率。',formulas:[f('与维持要求的关系','V 大于 0，所有金额须同币种。','MM = V × r − A\nr = (MM + A) / V',[['MM','维持保证金'],['V','名义价值'],['A','档位速算额'],['r','维持保证金率']])],example:'MM 为 450 U、V 为 100,000 U、A 为 50 U，档位费率为 0.5%，不是 0.45%。',cautions:['费率和档位来源必须匹配同一合约，不可使用其他产品的风险表。'],sources:[['Binance · maintMarginRatio 与 cum',tiers]]},
    '账户权益':{title:'账户权益',english:'Account Equity',definition:'按账户估值规则，将静态资产与未实现盈亏等项目合并后的权益。它不是可用余额。',scope:'以下为同币种、无复杂抵扣的基础账务关系，不覆盖组合保证金折扣或多币种汇率换算。',formulas:[f('基础权益关系','费用已计入静态余额时不可再次扣除。','Equity = Balance + Σ UPnL',[['Balance','同一范围内的静态余额'],['UPnL','各仓位未实现盈亏']])],example:'静态余额 3,000 U、未实现亏损 1,000 U，基础权益为 2,000 U；其中能否下单或转出还需另算。',cautions:['多币种账户需要先确定估值币种、抵扣率和有效资产范围。'],sources:[['OKX · 账户余额与权益字段',api+'#trading-account-rest-api-get-balance']]},
    '委托保证金':{title:'委托保证金',english:'Order Margin',definition:'为尚未成交订单冻结或预留的保证金。订单成交、撤销和改价后，所需占用可能变化。',scope:'配套资料存在含预留手续费、含开仓亏损等不同方案，下面分别列示，不作为统一平台规则。',formulas:[f('含开仓亏损的方案','配套项目模型之一，未额外加入开平手续费预留。','OrderMargin = IM + OpenLoss',[['IM','按该订单口径计算的初始保证金'],['OpenLoss','相对所选参考价的不利开仓价差损失']]),f('预留往返费用的方案','配套资料的另一种方案；只适用于明确采用此预留逻辑的产品。','OrderMargin = V_order × (r_IM + 2 × f)',[['V_order','预估订单名义价值'],['r_IM','配置的初始保证金率'],['f','用于预留的手续费率']])],example:'假设预估订单价值 10,000 U，基础保证金率 10%、预留费率 0.04%，第二种方案需预留 1,008 U。',cautions:['双向持仓的开平判断、对冲抵扣和订单之间的合并方式要另行核对。','不能把两套方案相加后当成第三套规则。'],sources:[['OKX · 订单与账户占用字段',api]],basis:'整理自本词典配套的合约公式资料；两种方案均为项目模型。'},
    '自动减仓':{title:'自动减仓',english:'Auto-Deleveraging / ADL',definition:'极端情况下，平台按规则选择部分对手方持仓减仓，以处理常规强平机制无法消化的风险。',scope:'以下只解释配套项目资料中的排序指标，不宣称所有平台使用同一算法。',formulas:[f('项目模型的排序关系','有效杠杆的分母须为正；无有效破产价时不能直接代入。','ProfitRatio = d × (P − E) / E\nEffectiveLeverage = P / [d × (P − P_b)]\n盈利排序值 = ProfitRatio × EffectiveLeverage\n亏损排序值 = ProfitRatio / EffectiveLeverage',[['P','本模型的参考价格'],['E','开仓均价，大于 0'],['P_b','本模型对应的破产价'],['d','多 +1、空 −1']])],example:'多头 E=30,000、P=33,000、P_b=27,000，盈利比例 10%，有效杠杆 5.5，模型中的盈利排序值为 0.55。',cautions:['排序分数不是触发概率，执行价格、触发条件及队列规则以平台为准。'],sources:[['OKX · 持仓与 ADL 字段',api+'#trading-account-rest-api-get-positions']],basis:'仅展示配套项目资料的排序模型。'}
  });
  entries['杠杆借贷强平价格']={
    title:'杠杆借贷强平价格',english:'Margin Liquidation Price',
    definition:'你用自己的钱作担保，再向平台借钱买币。币价跌得太多，剩下的资产快不够覆盖欠款和平台要求的安全余量时，平台可能卖掉你的币还债。这个词说的就是：大约跌到什么价格会触发这件事。',
    scope:'下面只讲“借入 USDT 买一种币”的简化例子：账户里只剩这种币，没有其他资产；借款和利息都用 USDT 计算；不考虑抵押折扣、手续费和分层规则。不是永续合约强平公式，也不能套到“借币卖出”的场景。',
    formulas:[f('先算总共欠多少钱','本金和已产生利息必须使用同一种货币。','欠款总额 = 借款本金 + 已产生利息',[['借款本金','向平台借入、尚未归还的钱'],['已产生利息','截至计算时已经欠下的借款利息']]),f('再反推币价跌到哪里','假设平台用“资产价值 ÷ 欠款总额”衡量风险，并在指定比例触发强平；实际平台规则可能不同。','账户风险比例 = 持有币数 × 当前币价 ÷ 欠款总额\n预估强平价 = 欠款总额 × 假设强平比例 ÷ 持有币数',[['持有币数','自己出的钱和借来的钱买到的全部币，数量大于零'],['假设强平比例','本例设定的风险边界；必须按实际产品核对，不是全平台统一值'],['预估强平价','在上述假设下反推的每枚币价格']])],
    example:'自己出 2,000 U，借 8,000 U，以每枚 100 U 买到 100 枚币。先忽略利息，并且只为演示假设强平比例是 1.10：8,000 × 1.10 ÷ 100 = 88 U。也就是说，本例中币价约跌到 88 U 时，100 枚币只值 8,800 U，已经碰到假设的安全边界。1.10 不是对当前产品阈值的承诺。',
    cautions:['和合约不同，这里有真实借款，还要算利息。即使币价不变，利息增加也可能让强平价靠近当前价格。','借币卖出时，币涨价会让还债更贵，不能照搬这里的借钱买币公式。','全仓、多币种、抵押折扣和产品风险规则都会改变结果。Binance 与 OKX 的风险比例也不能直接互换。'],
    sources:[['Binance · 杠杆借贷预估强平价的说明与算例','https://www.binance.com/en-GB/support/faq/how-to-calculate-estimated-margin-liquidation-price-f6b010588e55413aa58b7d63ee0125ed'],['OKX · 借币交易、利息与强平','https://www.okx.com/en-gb/help/ii-introduction-of-margin']],
    basis:'这是帮助理解“借款、资产、强平比例”关系的假设算例，不是交易所完整风险引擎。'
  };
  // Research copy: Academy explains market vocabulary; regulators and issuers
  // establish legal structures. All numerical examples below are hypothetical.
  const researchSources={
    bid:['Binance Academy · Bid Price','https://www.binance.com/en/academy/glossary/bid-price'],
    ask:['Binance Academy · Ask Price','https://www.binance.com/en/academy/glossary/asking-price'],
    spread:['Binance Academy · Bid-Ask Spread','https://www.binance.com/en/academy/glossary/bid-ask-spread'],
    bidMeaning:['Cambridge · bid 的“出价”词义','https://dictionary.cambridge.org/us/dictionary/learner-english/bid?q=bids'],
    askMeaning:['Cambridge · asking price 的“要价”词义','https://dictionary.cambridge.org/us/dictionary/english/asking-price?topic=costs-expenses'],
    etf:['Binance Academy · ETF','https://www.binance.com/en/academy/glossary/etf'],
    crypto:['Binance Academy · Crypto ETFs','https://www.binance.com/en/academy/glossary/crypto-etfs'],
    comparison:['Binance Academy · 现货与期货比特币 ETF','https://www.binance.com/en/academy/articles/bitcoin-spot-etf-vs-bitcoin-futures-etf-what-s-the-difference'],
    funds:['SEC 投资者教育 · ETF 的份额、净值与申赎','https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-24'],
    products:['SEC 投资者教育 · 比特币、以太币 ETP 的结构','https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/ETPBulletinSeptember2024'],
    taxonomy:['SEC 术语库 · ETP、ETF、商品信托与 ETN','https://www.investor.gov/introduction-investing/investing-basics/glossary/exchange-traded-products-etps'],
    notes:['SEC 投资者教育 · ETN 与发行人信用风险','https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-50'],
    premium:['iShares · 二级市场、申赎与折溢价','https://www.ishares.com/us/investor-education/etf-education/etf-premiums-and-discounts'],
    inKind:['SEC · 2025 年允许加密 ETP 实物申赎的决定','https://www.sec.gov/newsroom/press-releases/2025-101-sec-permits-kind-creations-redemptions-crypto-etps'],
    bitcoinTrust:['iShares · 比特币 ETP 与 IBIT 的法律结构','https://www.ishares.com/us/investor-education/investment-strategies/what-is-a-bitcoin-etf'],
    etfContracts:['Binance Academy · ETF 相关永续合约不等于 ETF 份额','https://www.binance.com/en/academy/articles/leveraged-etfs-you-can-trade-on-binance-futures']
  };
  const refs=(...keys)=>keys.map(key=>researchSources[key]);
  const prose=(title,paragraphs,...keys)=>({title,paragraphs,sources:refs(...keys)});
  Object.assign(entries,{
    '买一 / 卖一与价差':{
      title:'买一 / 卖一与价差',english:'Bid / Ask / Bid-Ask Spread',verifiedAt:'2026-11-04',
      definition:'Bid 是买方报出的买入价格，Ask 是卖方报出的卖出价格。盘口里最愿意出高价买的那一档叫买一，最愿意低价卖的那一档叫卖一；卖一减买一，就是买卖价差。',
      sections:[
        prose('为什么叫 Bid 和 Ask？',[
          '这两个词不是缩写。Bid 在英语里有“为购买某样东西而出价”的意思，可以记成买方说“我出这个价”；Ask 在这里来自 asking price 的“要价”含义，可以记成卖方说“我卖它要这个价”，不是“询问价格”的意思。',
          '因此，Bid 看的是出价买的人，Ask 看的是开价卖的人。这解释的是金融用法对应的语言含义，不是在断言某个人、某个交易所或某一年首次发明了这些叫法。'
        ],'bidMeaning','askMeaning'),
        prose('为什么买一取最高，卖一反而取最低？',[
          '买家分别愿意出 98、99、100，最高的 100 最容易吸引卖家，所以排买一。卖家分别要 101、102、103，最低的 101 对买家最有吸引力，所以排卖一。Bid 和 Ask 也可以泛指买卖各档报价；行情页单独写 Bid / Ask 时，通常指最优的这一对价格。'
        ],'bid','ask'),
        prose('为什么点买入，却成交在 Ask？',[
          '报价名称按挂在盘口里的那一方来叫。你想立即买入，要找愿意卖给你的人，所以先吃卖一 Ask；你想立即卖出，要找愿意接货的人，所以先吃买一 Bid。你也可以挂限价单等待别人来成交，但不能保证等得到。',
          '买一是 99、卖一是 101 时，在报价和数量都不变、盘口数量足够且不计费用的假设下，立即买入 1 个花 101，再立即卖出只能收 99，差 2 就是跨越价差的成本；大单还可能扫到更远价位。'
        ],'ask','spread')
      ],
      formulas:[f('用同一个币种算价差','买一和卖一来自同一产品、同一时点。下面的相对比例选择中间价作分母，其他页面可能用不同分母。','买卖价差 = 卖一价 − 买一价\n中间价 =（买一价 + 卖一价）÷ 2\n相对价差 = 买卖价差 ÷ 中间价 × 100%',[['买一价','当前最高的待成交买入报价'],['卖一价','当前最低的待成交卖出报价'],['中间价','两种最优报价的算术平均，不是保证成交价']])],
      example:'买一 99 USDT、卖一 101 USDT：价差为 2 USDT，中间价为 100 USDT，以中间价为分母的相对价差为 2%。',
      cautions:['价差不是交易所另收的一笔手续费，也不等于滑点；手续费、跨价差与扫多档造成的成交偏离应分别看。','最优价位的数量有限，挂单也可能被撤走；看到报价不代表下一笔一定能在该价成交。'],
      related:['订单簿与深度','市价单','挂单 / 吃单','滑点','ETF'],sources:refs('bid','ask','spread','bidMeaning','askMeaning')
    },
    'ETF':{
      title:'ETF / 交易所交易基金',english:'Exchange-Traded Fund',verifiedAt:'2026-11-04',
      definition:'把一份按规则投资的基金拆成很多份，放到证券交易所买卖。你通过证券账户买的是基金份额，不是把基金里的股票、债券或币直接拿到自己的账户或钱包。',
      sections:[
        prose('名字拆开看，就知道买的是什么',[
          'Exchange-Traded 是“在交易所挂牌交易”，Fund 是“基金”。这里的交易所指证券交易场所，不是说凡能在 Binance 交易的东西都叫 ETF。ETF 可以跟踪指数，也可以主动管理；不一定分散投资，更不等于保本。'
        ],'etf','funds'),
        prose('普通人买卖，与机构申赎是两层事情',[
          '日常买卖通常是你通过券商，从市场上的另一位持有人手中接过份额；这不意味着每成交一手，基金就必须立刻增持同额资产。',
          '直接与基金增发、赎回大批份额的通常是授权参与机构。它们按产品规则交付现金或指定资产换取份额，或交回份额换取对应资产。这个环节能影响流通份额数量，和普通投资者之间转手份额不是一回事。'
        ],'funds','premium'),
        prose('净值、成交价和折溢价，分别看哪一个？',[
          '每份净值衡量基金扣除负债后，平均每份对应多少资产；成交价则由当时买卖报价决定。成交价高于可比净值叫溢价，低于叫折价。申赎与套利有助于拉近两者，但遇到成本、时差或市场压力，偏离可能持续。',
          '比较之前要对齐估值时点：昨日收盘净值不是此刻的实时价值。基金涨跌、汇率变化、交易时段差异，也不能都算成基金“跟踪失灵”。'
        ],'premium','funds'),
        prose('币圈常说的现货 ETF，和期货 ETF 差在哪里？',[
          '关键不在名字里有没有“比特币”，而在底层持有什么。现货类产品持有对应币；期货类通过期货合约取得价格敞口，临近到期通常需要换月，因此表现还受合约价格与换月等因素影响。',
          '这是加密产品的常见区分，不是全世界 ETF 只有现货和期货两类。一般 ETF、现货加密产品与更广义的 ETP，需要结合各地法律结构分别理解。'
        ],'comparison','crypto')
      ],
      formulas:[f('先算每份资产，再比较市场价格','只作净值与折溢价的算术解释；资产与负债须同币种、同估值时点，份额数和可比净值须大于零。','每份净值 =（基金资产总值 − 基金负债总额）÷ 流通份额数\n折溢价率 =（每份市场价格 − 每份可比净值）÷ 每份可比净值 × 100%',[['流通份额数','该估值口径下已经发行并存续的份额，不是今天的成交量'],['每份可比净值','与所比较价格尽量对齐时点和口径的每份资产净值']])],
      example:'教学假设：资产 1,020,000 元、负债 20,000 元、存续份额 100,000 份，每份净值为 10 元。如果同时点市场价是 10.20 元，溢价是 2%；它不是凭空多出 2% 的基金资产。',
      cautions:['成本不只有券商佣金：还要看基金持续费用、买卖价差以及底层策略成本。不同产品不能只用一个费率比较。','证券份额交易受上市市场及券商支持的时段约束，不能因为底层币全天交易，就认为份额也必然全天交易。','ETF 名称不保证收益、分散程度或统一监管保护；看产品文件，不能只看宣传简称。'],
      related:['ETP','现货 ETF','买一 / 卖一与价差','溢价 / 折价'],sources:refs('etf','funds','premium','comparison','crypto')
    },
    'ETP':{
      title:'ETP / 交易所交易产品',english:'Exchange-Traded Product',verifiedAt:'2026-11-04',
      definition:'能在证券交易所挂牌买卖的一类投资产品的总称。ETF 是其中一种，但 ETP 不一定是基金；有些是商品信托，有些是与指数挂钩的票据。要先分清你拿到的是哪种权利。',
      sections:[
        prose('先记住：ETP 是大类，ETF 是其中一类',[
          'Product 的意思是“产品”，范围比 Fund“基金”更宽。两者不是互相竞争的两种币，也不是可以完全互换的缩写。ETP 可以关联股票、债券、商品、币价或策略；名称本身没有告诉你底层是否真的持币。'
        ],'taxonomy','funds'),
        prose('同样是挂牌交易，里面的法律关系可能完全不同',[
          'ETF：投资者持有基金份额，基金按其策略投资。商品信托：投资者持有信托受益份额，权利按信托文件确定。ETN：通常是金融机构发行的无担保债务，按约定参考指标计算应付金额，并不等于投资者拥有一份底层资产组合。',
          '因此，ETN 除了标的涨跌，还要看发行人是否有能力履约。持有资产的基金或信托也不是没有托管、运营或其他风险；只是不能把它们与“发行人欠你钱”的关系混为一谈。'
        ],'notes','taxonomy'),
        prose('为什么美国新闻会把同一产品叫 ETF，也叫 ETP？',[
          'SEC 对美国现货比特币、以太币产品的投资者说明明确指出：这些现货产品采用交易所交易商品信托结构，不是按美国《1940 年投资公司法》注册的 ETF。它们仍适用其他证券注册、披露及反欺诈要求，不能因此理解成“没有监管”。',
          '产品名称和日常新闻中可能使用 ETF；发行方 iShares 也说明 IBIT 不按该法注册。这里区分的是美国特定产品的法律结构与习惯叫法，不能套到所有国家，更不能仅凭“ETF”三个字断定适用同一套保护。'
        ],'products','bitcoinTrust'),
        prose('看一只加密 ETP，先问这几个问题',[
          '第一，实际持币、持期货，还是发行人按公式付款？第二，资产由谁托管、费用从哪里扣、能否终止？第三，普通投资者在哪里卖出，谁能直接申赎？第四，上市地区与法律文件写的产品结构是什么？只盯着“跟踪 BTC”不足以回答这些问题。'
        ],'products','notes','comparison')
      ],formulas:[],
      example:'假设甲产品是持有 BTC 的信托，乙产品是银行承诺按 BTC 指标付款的票据。两者都可能在交易所交易、也都随 BTC 波动，但乙还存在发行人不履约的风险；“走势相似”不等于“法律权利相同”。甲乙仅为教学假设，不指向具体在售产品。',
      cautions:['ETP 不等于加密产品，也不必然代表实物支持、无杠杆、低风险或可以直接赎回成币。','不同地区对 ETF、商品型产品及票据的命名和监管不同；不要把美国分类当作全球法律结论。','判断具体产品必须阅读其招募说明书、费用、托管与赎回条款；“获准挂牌”不等于监管部门担保回报。'],
      related:['ETF','现货 ETF','交易所','交割合约'],sources:refs('taxonomy','products','funds','notes','bitcoinTrust','comparison')
    },
    '现货 ETF':{
      title:'现货 ETF',english:'Spot ETF / Spot Crypto ETP',verifiedAt:'2026-11-04',
      definition:'在加密语境中，通常指底层持有 BTC、ETH 等对应现货、以证券份额形式交易的产品。你买的是产品份额，间接承担币价涨跌；不是在自己的钱包里直接收到这些币。具体法律结构还要按上市地区和产品文件区分。',
      sections:[
        prose('份额背后有币，不等于你能直接把币提出去',[
          '底层币由产品安排的托管体系保管，普通持有人通过证券账户持有和卖出份额。你不因此获得对应币的私钥，也不能把这份证券直接用作链上转账或支付；普通投资者能否直接赎回，必须看具体条款。'
        ],'comparison','crypto'),
        prose('现货持币与期货敞口，别被同一个名字带偏',[
          '现货类产品持有对应币；期货类产品主要通过期货合约取得敞口。后者需要处理合约到期与换月，不能假设长期回报就是现货涨跌。现货类也会受到持续费用、市场供需、估值时点和交易时段的影响，不会天然与币价一分不差。'
        ],'comparison','premium'),
        prose('申赎规则已经变化，别继续写成一律现金',[
          'SEC 于 2025 年 7 月 29 日批准允许授权参与机构对相关加密 ETP 进行实物申赎。因此，“美国这些产品只允许现金申赎”不能再当作永久通则。具体产品是否采用、如何执行，应看更新后的产品文件；允许机构实物申赎，不等于每位普通持有人都能提币。'
        ],'inKind'),
        prose('美国“现货 ETF”的叫法，要连同 ETP 一起理解',[
          '美国现货比特币、以太币产品常被称为 ETF，但相关 SEC 说明把它们归为商品信托型 ETP，而非按《1940 年投资公司法》注册的 ETF。IBIT 的发行方披露也明确这一点。日常叫法可以用，但不能因此省略真实法律结构。'
        ],'products','bitcoinTrust')
      ],
      formulas:[f('仅看每份对应多少币','单一持币的教学简化，忽略现金、负债、费用及份额变动；不是产品可赎回币数承诺。','每份对应币数 = 产品持币总量 ÷ 存续份额数\n每份持币价值 = 每份对应币数 × 同时点币价',[['存续份额数','已经发行且未注销的产品份额，须大于零'],['同时点币价','与持币量及估值口径相配的参考价格']])],
      example:'教学假设：产品持有 100 BTC、发行 100,000 份，每份简化对应 0.001 BTC。若参考价为每枚 100,000 美元，每份持币价值约为 100 美元；市场成交价仍可能不同，这也不代表买一份就能向发行方提走 0.001 BTC。',
      cautions:['价格风险并未消失：换成证券份额持有，也可能因币价下跌亏损。','比较费用、跟踪表现与折溢价时，要统一币种和时点；币价在证券市场休市期间仍可能变化。','不能把 Binance 上跟踪某只 ETF 的衍生合约当作直接持有该 ETF；先看产品规格和交易场所，不只看代码。'],
      related:['ETF','ETP','托管钱包 / 自托管钱包','买一 / 卖一与价差'],sources:refs('comparison','crypto','premium','inKind','products','bitcoinTrust','etfContracts')
    }
  });
  // Reader-facing formulas use words. Technical abbreviations remain only in
  // the separate exchange field-reference area and preserved source material.
  const chineseNames={
    PnL_close:'平仓盈亏',Q_close:'本次平仓币数',P_close:'平仓成交价',P_fill:'成交价',
    A_L:'多头速算额',A_S:'空头速算额',Q_L:'多头币数',Q_S:'空头币数',E_L:'多头开仓价',E_S:'空头开仓价',r_L:'多头维持保证金率',r_S:'空头维持保证金率',
    mid_i:'本次盘口中间价',bid_i:'本次买一价',ask_i:'本次卖一价',basis_i:'本次基差',index_i:'本次指数价',basis_ma:'平均基差',index_now:'当前指数价',mark:'标记价',
    F_raw:'未限制上下限的费率',P_avg:'平均溢价指数',floor:'费率下限',cap:'费率上限',
    B_impact:'买盘冲击均价',A_impact:'卖盘冲击均价',I_px:'指数价',
    A_new:'新档速算额',B_prev:'前档金额上限',r_new:'新档维持保证金率',r_prev:'前档维持保证金率',A_prev:'前档速算额',
    OrderMargin:'订单预留保证金',OpenLoss:'不利开仓价差损失',V_order:'订单预估总金额',r_IM:'初始保证金率',
    ProfitRatio:'盈利比例',EffectiveLeverage:'有效杠杆',Coverage:'权益覆盖倍数',
    Equity:'账户当前权益',Balance:'账户已结算余额',UPnL:'未实现盈亏',PnL:'收益金额',ROI:'收益率',
    P_b:'破产价',P_i:'每笔价格',Q_i:'每笔币数',w_i:'每项权重',Index:'指数价',
    IM:'初始保证金',MM:'维持保证金',M:'分配的保证金',Q:'持有币数',P:'参考价格',E:'开仓均价',d:'方向系数',r:'维持保证金率',R:'维持要求占权益的比例',A:'速算额',W:'全仓钱包余额',H:'其他合约维持保证金',U:'其他合约浮动盈亏',
    V:'仓位总金额',L:'杠杆倍数',n:'合约张数',c:'单张合约面值',k:'合约乘数',N:'样本数',I:'同周期利率',F:'资金费率',f:'手续费率',clamp:'限定范围',max:'取较大值',min:'取较小值',x:'待限制数值',a:'下限',b:'上限'
  };
  const beginnerDefinitions={
    '平均溢价指数':'不是只看此刻合约比参考价贵了多少，而是把一个指定时间段里多次记录的溢价比例汇总，得到这个时段的平均水平。它常作为资金费率的计算输入；各次记录是否同等重要，要看采用的平均方法。',
    '初始保证金率':'开仓时要先准备的钱，占这笔仓位总金额的多少。例如基础模型中，交易 1,000 U 的仓位要先放 100 U，这个比例就是 10%。它关注能不能开仓，不是仓位快被强平时使用的最低安全比例。',
    '初始保证金':'开仓时，你至少要先放进去多少钱。比如想交易 10,000 U 的仓位，基础杠杆是 10 倍，最简单的估算就是先准备 1,000 U；平台可能还会预留费用。',
    '维持保证金':'仓位开好以后，平台仍要求你保留一笔最低安全资金。亏损让账户剩下的钱碰到这条线，就可能被减仓或平仓。',
    '强平价格':'你先放一笔保证金来承担亏损。价格朝不利方向走，账户剩下的钱不再满足平台的最低要求时，平台可能替你平仓。强平价格就是对这个价格位置的估算，不是保证成交价。',
    '标记价格':'平台用来判断仓位大约值多少钱、是否快要触发强平的一种参考价。它不是市场里刚刚成交的那一笔价格，所以两者可以不一样。',
    '资金费率':'持有永续合约时，多头和空头会按规则互相付钱。资金费率决定这次按多大比例计算；它不是你一定能拿到的收益。',
    '资金费用':'到了结算时刻，你实际付出或收到的那笔钱。费率是比例，费用是金额，两者不要混在一起。',
    '名义价值':'不管你只放了多少保证金，先算这笔仓位按指定价格一共值多少钱。这个总金额就是名义价值。',
    '未实现盈亏':'如果按当前参考价格看，你还没平掉的仓位大约赚了或亏了多少钱。因为还没卖出或平仓，这个数会继续变。',
    '已实现盈亏':'已经平仓或已经按规则结算的那部分赚亏。看接口时还要问一句：这个数已经扣过手续费和资金费用了吗？',
    '破产价格':'在一个简化模型里，仓位分配的保证金刚好亏光时对应的理论价格。平台往往会在它之前就开始强平，所以它和强平价不是一回事。',
    '维持保证金速算额':'仓位越大，平台可能用越高的费率算最低安全资金。速算额就是从计算结果里减掉的一笔金额，避免跨档时算得突兀；它不是额外收费。',
    '保证金率':'把“还有多少钱”和“至少要留多少钱”作比较的一种比例。不同平台的算法可能倒过来，所以不能只看百分比大或小就判断安全。',
    '杠杆':'用较少保证金承担较大交易金额。它会让同样一笔涨跌，对你投入保证金的影响更大；不是自动多赚钱。',
    '账户权益':'按当前参考价格把浮动盈亏也算进去后，这个账户大约还剩多少钱。它和余额、可用余额不一定相同。',
    '委托保证金':'订单还没成交时，平台先替这张订单占住的钱。订单撤掉、成交或改价后，占用金额可能重新计算。',
    '自动减仓':'市场极端波动时，平台有时会按规则把另一方的部分仓位也减掉，来处理强平留下的风险。它不是你主动点了平仓。',
    '合约面值与乘数':'交易界面如果用“张”而不是“枚”，你需要知道一张到底代表多少币或多少钱。面值和乘数就是用来读懂这份合约规格的。'
  };
  for(const [name,entry]of Object.entries(entries)){
    if(beginnerDefinitions[name])entry.definition=beginnerDefinitions[name];
    for(const formula of entry.formulas){
      const names={...chineseNames};
      if(name==='强平价格')names.P='强平价';
      if(name==='溢价指数')names.P='溢价指数';
      if(name==='平均溢价指数'){names.P_i='每次溢价样本';names.n='样本数';}
      if(name==='指数价格')names.P_i='每个价格源';
      const translate=text=>text.replace(/[A-Za-z][A-Za-z_0-9]*/g,token=>names[token]||token).replace(/Σ\s*/g,'合计').replace(/δ/g,'利率差允许偏离值');
      formula.expression=translate(formula.expression).replaceAll(' / ',' ÷ ');
      formula.scope=translate(formula.scope);
      formula.variables=formula.variables.map(([name,meaning])=>[translate(name).replaceAll(' / ','、'),translate(meaning)]);
    }
  }
  entries['强平价格'].formulas=[
    f('买涨：币价下跌时，最低能撑到哪里','只适用于线性逐仓、档位固定、不计手续费的简化模型。先把合约张数换成持有币数。','多头强平价 =（开仓价 × 持有币数 − 分配的保证金 − 速算额）\n             ÷［持有币数 ×（1 − 维持保证金率）］',[['开仓价','这笔仓位的平均买入价格'],['持有币数','例如 1 枚比特币，不是合约张数'],['分配的保证金','放在这笔逐仓仓位上、用来承担亏损的钱'],['维持保证金率','平台对应档位要求的比例，用小数代入'],['速算额','该档位从维持要求中扣除的金额；示例设为零']]),
    f('买跌：币价上涨时，最高能撑到哪里','同样只适用于线性逐仓、档位固定、不计手续费的简化模型。','空头强平价 =（分配的保证金 + 速算额 + 开仓价 × 持有币数）\n             ÷［持有币数 ×（1 + 维持保证金率）］',[['开仓价、持有币数、保证金、费率、速算额','和上面的多头公式采用同一口径；空头在上涨时亏损']]),
    f('全仓：还要把别的仓位算进来','仅演示全仓单向多头。假定其他合约的盈亏和维持要求暂时不变，且不计费用。','全仓多头强平价 =（开仓价 × 持有币数 − 全仓钱包余额\n                 + 其他合约维持要求 − 其他合约浮动盈亏 − 速算额）\n                 ÷［持有币数 ×（1 − 维持保证金率）］',[['全仓钱包余额','参与这个全仓风险模型的钱包余额，不是可用余额'],['其他合约维持要求','其他全仓合约需要保留的最低安全资金合计'],['其他合约浮动盈亏','其他全仓仓位当前赚亏的合计；亏损用负数'],['其余中文量','和逐仓多头公式采用同一单位与口径']]),
    f('同一合约同时开多、开空','两条腿必须分别计算。只演示固定档位、不计费用的全仓模型，其他合约暂时不变。','双向强平价 =（全仓钱包余额 − 其他合约维持要求 + 其他合约浮动盈亏\n             + 多头速算额 + 空头速算额\n             − 多头币数 × 多头开仓价 + 空头币数 × 空头开仓价）\n             ÷（多头币数 × 多头维持保证金率\n                + 空头币数 × 空头维持保证金率 − 多头币数 + 空头币数）',[['多头币数、空头币数','两条腿各自持有的币数，都用正数'],['多头开仓价、空头开仓价','两条腿各自的平均入场价'],['多头／空头维持保证金率与速算额','各自适用的档位参数'],['全仓钱包余额、其他合约维持要求、其他合约浮动盈亏','含义同上面的全仓模型']])
  ];
  entries['资金费用'].formulas=[f('先算仓位值多少钱，再乘费率','这里只讲线性合约。收付方向用文字判断，不用正负号让你猜。','仓位总金额 = 持有币数 × 结算标记价\n这次资金费用 = 仓位总金额 × 资金费率的绝对值',[['结算标记价','平台用于本次结算的参考价，不是开仓价'],['持有币数','结算时仍持有的数量，取正数'],['资金费率','为正：多头付、空头收；为负：空头付、多头收']])];
  entries['未实现盈亏'].formulas=[f('买涨和买跌分别算','只适用于线性合约，不含手续费和资金费。未平仓时常用标记价作参考，实际仍看平台口径。','买涨的浮动盈亏 =（参考价 − 开仓价）× 持有币数\n买跌的浮动盈亏 =（开仓价 − 参考价）× 持有币数',[['参考价','这次用来估算赚亏的价格'],['开仓价','这笔持仓的平均入场价格'],['持有币数','还没有平掉的币数，取正数']])];
  entries['已实现盈亏'].formulas=[f('平掉多少，就算多少','只算平仓价差，手续费和资金费用要按平台的字段说明另外核对。','买涨的平仓盈亏 =（平仓价 − 开仓价）× 本次平仓币数\n买跌的平仓盈亏 =（开仓价 − 平仓价）× 本次平仓币数',[['平仓价','这次实际成交的平均价格'],['开仓价','原持仓的平均入场价格'],['本次平仓币数','本次真正平掉的数量，取正数']])];
  entries['破产价格'].formulas=[f('保证金刚好亏光的理论位置','单仓位线性模型，不计费用。这里不是平台一定会等到的价格。','买涨的破产价 = 开仓价 − 分配的保证金 ÷ 持有币数\n买跌的破产价 = 开仓价 + 分配的保证金 ÷ 持有币数',[['分配的保证金','放在这笔仓位上承担亏损的钱'],['持有币数','换算后的币数，取正数'],['开仓价','平均入场价格']])];
  entries['自动减仓'].formulas.forEach(formula=>formula.advanced=true);
  function isolatedLiquidation({margin,quantity,entry,rate,side,cum=0}){
    if(![margin,quantity,entry,rate,side,cum].every(Number.isFinite)||quantity<=0||![1,-1].includes(side))return null;
    const denominator=quantity*(rate-side);if(!denominator)return null;
    const result=(margin+cum-side*quantity*entry)/denominator;return Number.isFinite(result)&&result>0?result:null;
  }
  function crossLiquidation({wallet,otherMaintenance,otherPnl,...rest}){
    if(![wallet,otherMaintenance,otherPnl].every(Number.isFinite))return null;
    return isolatedLiquidation({...rest,margin:wallet-otherMaintenance+otherPnl});
  }
  return {entries,models:{isolatedLiquidation,crossLiquidation}};
});
