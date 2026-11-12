(() => {
  'use strict';
  const terms = {
    'Builder Fee': '第三方交易界面可在用户授权范围内对 Hyperliquid 订单收取的费用；是否收取以具体订单为准。',
    'Pump.fun': 'Solana 上的代币发行平台，提供创建代币及早期交易功能；具体发行规则可能变化。',
    'PumpSwap': 'Solana 上的去中心化交易协议，用户可在其流动性池中兑换代币。',
    'Meme': '围绕网络文化、人物、动物或热点事件形成社区关注的代币类型，不代表拥有相关资产。',
    'KOL': '关键意见领袖；平台可能根据公开资料将某些钱包标记为相关地址，标签不保证准确。',
    'FOMO': '害怕错过机会的心理；平台上的具体地址标签及数字口径需要查看平台说明。',
    'LP': '流动性提供者或相关池份额；具体含义需要结合页面上下文。',
    'Gas': '执行区块链交易所支付的网络费用，金额随网络及交易情况变化。',
    '扫链': '收集和筛选链上代币、交易池及钱包活动的过程；不等于审计或安全认证。',
    '聪明钱': '平台根据交易表现等条件识别出的观察对象，历史表现不能保证未来收益。',
    '狙击': '在代币上线或流动性开放时迅速买入的交易行为，常使用自动化工具。',
    '捆绑地址': '平台基于捆绑交易等链上行为识别的地址集合，不自动证明地址由同一主体控制。',
    '阴谋集团': '平台对资金来源或行为相似地址群的风险画像，属于推断而非操纵事实的证明。',
    'AI Agent': '能够根据目标调用工具、执行任务的软件系统；自主程度和权限取决于具体设计。',
    'HIP-1': 'Hyperliquid 的原生代币与现货订单簿机制，资产发行方和权利各不相同。',
    'HIP-2': 'Hyperliquid 为部分现货市场提供协议内置流动性的机制。',
    'LTV': '贷款价值比：借款金额与抵押品价值的比例，风险阈值依平台规则而异。',
    'TVL': '总锁仓价值：按一定价格口径统计协议中资产的价值，不等同于收入。',
    'C2C': '个人对个人交易模式；平台可能提供撮合或托管，付款和对手方风险仍需关注。',
    'RFQ': '询价：用户提出交易需求并获得报价，再决定是否成交。',
    'EMA': '指数移动平均：对较近数据赋予较高权重的平均方法。',
    'EWMA': '指数加权移动平均：以递减权重汇总历史数据的平滑方法。',
    '多头': '预期价格上涨而建立的方向性仓位，价格下跌时可能亏损。',
    '空头': '预期价格下跌而建立的方向性仓位，价格上涨时可能亏损。',
    '全仓': '符合规则的保证金由全仓仓位共享；一笔亏损可能影响其他仓位。',
    '逐仓': '为特定仓位单独分配保证金的模式，具体规则依平台而定。',
    '资金费率': '计算永续合约多空之间资金费的比例，费率和结算周期随市场变化。',
    '维持保证金': '维持仓位需满足的保证金要求之一，达到风险阈值可能触发强平。',
    '初始保证金': '建立仓位时通常需要提供的保证金，计算方式由交易场所规定。',
    'EQNVDA': 'EQX 发行的 NVIDIA 股票关联代币代码；它不是 NVIDIA 的原始股票，具体权利取决于发行人条款。',
    'XNVDA': 'OKX 平台内以等效股数记账的 NVIDIA 股票代币化资产；账户余额本身不是链上代币。',
    'NVDAX': 'xStocks 发行人提供的 NVIDIA 关联链上代币；其持有权利和赎回条件由发行人条款规定。',
    'xStocks': '第三方发行的股票和 ETF 关联链上代币产品系列，发行人称由相应证券支持；不等同直接登记持有股票。',
    'bStocks': '币安生态中的股票代币化产品系列；其证书结构、发行人和适用地区以产品文件为准。',
    'EQX': '提供股票代币相关技术和产品服务的品牌；具体代币由 EQX SPC Ltd. 发行，法律权利以发行文件为准。',
    'HIP-3': 'Hyperliquid 的第三方部署永续市场机制；部署者负责市场规格和预言机等运营事项。',
    'HyperCore': 'Hyperliquid 的原生交易执行层，承载现货和永续订单簿、撮合等功能。',
    'Arbitrum': '基于以太坊的二层扩容网络，可通过小狐狸（MetaMask）、Rabby 等支持该网络的钱包连接。钱包用于管理地址和签名；Arbitrum 是资产所在的网络。',
    'HyperEVM': 'Hyperliquid 的 EVM 兼容执行环境，用于运行智能合约，与 HyperCore 各有不同职责。',
    'Hyperliquid': '提供链上现货与永续交易基础设施的区块链生态，第三方也能在其上部署市场。',
    'ETF': '交易所交易基金：在交易所买卖的基金份额，可跟踪股票指数、行业或其他资产，不等同于指数本身。',
    'CFD': '差价合约：以开仓和平仓之间的价格差结算盈亏的衍生品，一般不转移标的资产所有权。',
    'TradFi': '传统金融的简称，通常指股票、债券、外汇和大宗商品等传统市场及其机构。',
    'X-Perps': 'OKX 某些地区提供的、带资金费机制的衍生合约；产品可能有到期日，具体规则以当地文件为准。',
    'UTS': 'OKX 的统一股票代币服务：平台账户中按等效股数记录的合同权利，余额本身不是链上代币。',
    'NVDA': 'NVIDIA（英伟达）在美国股票市场使用的股票代码；在衍生品或代币名称中仅用于标识相关标的。',
    'SPY': '追踪标普 500 指数的美国上市 ETF 代码；SPY 份额、指数本身和相关永续合约是不同产品。',
    'QQQ': '追踪纳斯达克 100 指数的美国上市 ETF 代码；持有相关合约不等于持有 ETF 份额。',
    'USDT': '与美元价值挂钩的稳定币，由 Tether 发行；它不是美元银行存款，价格也可能偏离 1 美元。',
    'USDC': '与美元价值挂钩的稳定币，由 Circle 发行；它不是美元现金，仍有发行人及脱锚风险。',
    'DEX': '去中心化交易所：通过区块链协议提供交易或结算的场所；不同协议的托管与风险结构不同。',
    'CEX': '中心化交易所：由运营方提供账户、交易及相关服务的平台，用户需承担平台及托管风险。',
    'CLOB': '中央限价订单簿：汇集买卖限价委托，并按市场规则撮合成交的交易机制。',
    'AMM': '自动做市商：使用预设规则或算法报价的交易机制，常见于链上流动性池。',
    'API': '应用程序接口：允许软件按约定方式读取行情或提交交易请求的接口。',
    'KYC': '了解你的客户：平台核验用户身份及资格的流程，具体要求依地区和产品而异。',
    'ADL': '自动减仓：极端行情下，交易系统按规则减少其他交易者仓位以处理未覆盖风险的机制。',
    'PnL': '盈亏：持仓或交易产生的利润与亏损；未实现盈亏会随市场价格变化。',
    'ROI': '投资回报率：收益相对于投入资金的比例；不同计算口径会影响结果。',
    'TWAP': '时间加权平均价格，或按时间拆分执行的交易策略；具体含义取决于上下文。',
    'VWAP': '成交量加权平均价格：将每笔或每段价格按成交量加权得到的平均价格。',
    '做市商': '持续提供买卖报价、为市场提供流动性的参与者；报价和库存风险由其承担。',
    '流动性': '以合理成本和较小价格影响完成买卖的能力；需要结合盘口深度、价差和成交量判断。',
    '订单簿': '交易场所按价格列出的买单和卖单集合，成交由委托价格及撮合规则决定。',
    '滑点': '预期成交价格与实际成交价格之间的差异，常见原因包括盘口不足和价格快速变化。',
    '点差': '卖一价与买一价之间的差额，是交易成本的一部分。',
    '预言机': '向链上系统提供外部数据的机制；数据源、更新频率和异常处理会影响定价与清算。',
    '标记价': '交易系统用于估算仓位价值和风险的参考价格，通常不等于最新成交价。',
    '指数价': '根据一个或多个市场或数据源计算出的参考价格，用于合约定价和风险管理。',
    '资金费': '永续合约多空双方按规则定期交换的费用，具体方向、费率和结算时间随市场变化。',
    '永续合约': '通常没有固定到期日的衍生合约，通过保证金和资金费等机制提供价格敞口，不代表持有标的。',
    '保证金': '为交易或维持衍生品仓位提供的抵押资产；不足时可能触发限制或强平。',
    '强平': '当账户风险达到平台规定阈值时，系统按规则关闭或减少仓位的过程。',
    '杠杆': '用一定保证金控制更大名义价值仓位的机制，会同时放大盈亏和清算风险。',
    '现货': '买卖资产本身或平台记账资产的交易方式；资产具体法律权利仍取决于产品条款。',
    '期权': '赋予持有人在约定条件下买入、卖出标的或获得结算的合约，买方通常支付权利金。',
    '期货': '约定在未来按合约规则进行交割或现金结算的衍生品，持有期货不等于持有标的。',
    '合约面值': '每一张合约对应的标的数量或价值单位，不同产品的面值可能不同。',
    '持仓量': '尚未平仓的合约规模；它不是成交量，也不能直接代表单边净资金流入。',
    '赎回': '按发行人规则将代币或凭证兑换成约定资产的流程；资格、费用与可获得资产依条款而异。',
    '托管': '由指定机构保管资产或记录权益的安排，需核查资产隔离、责任和适用规则。',
    '股息': '公司向符合条件的股东分配的收益；股票代币是否以及如何体现，要看发行人条款。',
    '股东权利': '持有股票可能享有的投票、分红等权利；股票代币持有人未必直接享有这些权利。',
    '股票代币化': '以链上代币或平台记账形式表示与股票有关的权益或价格敞口；法律结构依具体产品而异。',
    '二级市场': '投资者之间买卖已发行资产的市场；与直接向发行人申购或赎回的一级市场不同。',
    '公司行动': '上市公司发生分红、拆股、并购或退市等事件，可能影响证券和相关代币的处理方式。',
    '对冲': '建立另一笔相关仓位以降低部分价格风险；不同市场可能不能完全抵消，且存在成本。',
    '价差': '两个买卖报价或两种相关资产价格之间的差额；含义需要结合上下文判断。',
    '套利': '利用相关市场价格差建立交易组合的策略，实际仍面临费用、执行和价差变化风险。',
    '基差': '两个相关价格之间的差额，例如合约价格与参考现货价格之差。',
    '抵押率': '抵押资产价值与借款或仓位风险之间的比例；具体公式和阈值由平台定义。',
    '合约': '约定交易权利义务的产品；具体可能是永续、期货、期权等，规则各不相同。',
    '市价单': '以当前市场可成交价格尽快成交的委托，实际成交价可能出现滑点。',
    '限价单': '指定可接受价格的委托，只在满足价格条件时成交，可能部分成交或不成交。'
  };
  // Only this historical Hyperliquid research uses its own glossary.
  if (/^\/archives\/081a6063(?:\.html)?\/?$/.test(location.pathname)) {
    const hyperliquidArticleTerms = {
    "quanto": "一种计价资产与保证金或结算资产不同的合约结构；其具体盈亏换算方式以合约规则为准。",
    "Unified Account": "统一账户模式：符合规则的同一资产余额可用于现货及相关全仓永续保证金，具体范围以官方规则为准。",
    "HyperBFT": "Hyperliquid 的共识算法，是 HotStuff 共识的变体；验证者按质押的原生代币比例出块。",
    "HIP-3": "由第三方构建者部署永续合约市场的标准。",
    "growth mode": "HIP-3 永续可开启的增长模式；开启后协议费、返佣、成交量贡献与限流贡献降低 90%。",
    "liquidator vault": "账户权益低于维持保证金的 2/3 且订单簿强平未成功时，由该金库接管仓位；此时维持保证金不退还用户。",
    "backstop liquidation": "账户权益低于维持保证金的 2/3 且订单簿强平未成功时，由该金库接管仓位；此时维持保证金不退还用户。",
    "HLP": "Hyperliquid 社区出资的协议金库，负责做市和承接强平仓位（liquidator vault 是其组成策略）；市场被操纵或强平接不住时，亏损会落到这里。",
    "Portfolio Margin": "把多个仓位作为一个组合评估、考虑仓位之间风险抵消来设定保证金的方法（CFTC 术语表收录）。Hyperliquid 版本把全仓永续仓位与现货余额合并计算。",
    "spot clearinghouse": "HyperCore 中记录每个地址现货状态（代币余额与冻结额度）的模块。",
    "perps clearinghouse": "HyperCore 中记账的模块：perps clearinghouse 记录永续保证金余额与仓位，spot clearinghouse 记录现货余额。",
    "clearinghouse": "HyperCore 中记账的模块：perps clearinghouse 记录永续保证金余额与仓位，spot clearinghouse 记录现货余额。",
    "staking discount": "按质押的 HYPE 数量给予的手续费折扣，官方费率表为 5%–40%。",
    "maker rebate": "达到挂单成交量门槛的用户，其挂单成交时交易所返还一部分费用；Hyperliquid 逐笔直接支付到交易钱包。",
    "maker": "maker 指挂单、被动成交、为订单簿提供流动性的一方；taker 指主动吃单、立即成交的一方。交易所通常对两者收取不同费率。",
    "taker": "maker 指挂单、被动成交、为订单簿提供流动性的一方；taker 指主动吃单、立即成交的一方。交易所通常对两者收取不同费率。",
    "order book": "按价格排列的买卖限价挂单列表；“盘口”通常指最优买卖价附近的挂单。",
    "tick size": "价格的最小变动单位；订单价格必须是它的整数倍。",
    "lot size": "数量的最小单位；在 Hyperliquid，订单数量必须是 lot size 的整数倍。",
    "market maker": "持续同时报出买价和卖价、为市场提供流动性的交易者。",
    "market": "市价委托：尽快以市场可成交价格执行，成交价格可能出现滑点。",
    "limit": "限价委托：按指定价格或更优价格成交，可能部分成交或无法成交。",
    "chase": "只挂单（ALO）的限价单，会自动改价跟随最优买/卖价，直到成交或终止；中文为本文译名。",
    "stop market": "价格到达触发价时才激活的市价单或限价单，常用于限制亏损。",
    "stop limit": "止损限价单：触发后提交限价委托，行情快速波动时可能无法成交。",
    "take market": "价格到达触发价时激活的市价单或限价单，触发方向与止损单相反，常用于锁定盈利。",
    "take limit": "止盈限价单：达到触发条件后提交限价委托，成交不保证。",
    "scale": "在设定价格区间内一次挂出多笔限价单；中文为本文译名。",
    "reduce-only": "只能减少现有仓位、不会反向开新仓的订单选项。",
    "GTC": "Good Till Canceled：一直有效，直到成交或被用户撤销。",
    "ALO": "Add Liquidity Only：只作为挂单进入订单簿，不会立即吃单成交。",
    "post-only": "Add Liquidity Only：只作为挂单进入订单簿，不会立即吃单成交。",
    "IOC": "Immediate or Cancel：立即成交能成交的部分，未成交部分立刻撤销。",
    "TP/SL": "Take Profit / Stop Loss：仓位达到设定盈利或亏损价格时自动平仓；Hyperliquid 用 mark price 触发。",
    "take profit": "Take Profit / Stop Loss：仓位达到设定盈利或亏损价格时自动平仓；Hyperliquid 用 mark price 触发。",
    "stop loss": "Take Profit / Stop Loss：仓位达到设定盈利或亏损价格时自动平仓；Hyperliquid 用 mark price 触发。",
    "cloid": "由下单方自己生成的订单编号，可用于撤单和去重，避免网络重试造成重复下单。",
    "oracle price": "Hyperliquid 取多家中心化交易所现货价格的加权中位数，由验证者约每 3 秒发布；用于计算资金费率，不依赖 Hyperliquid 自身行情。",
    "oracle": "把链外数据（如交易所价格）提供给区块链使用的机制。",
    "mark price": "交易所计算的稳健“公允价格”，用于保证金、强平、TP/SL 触发与未实现盈亏；不等于最新成交价，可防止短时间操纵盘口触发强平。",
    "EMA": "Exponential Moving Average，指数移动平均：越新的数据权重越高的平均值。",
    "premium": "永续价格相对 oracle price 的偏离程度，是 Hyperliquid 计算资金费率的主要输入。",
    "funding rate": "永续合约多空双方之间定期互付的费用，用来让永续价格贴近现货价格；正费率多头付空头，负费率空头付多头。",
    "perpetual futures": "没有到期日的期货类合约，通过定期支付资金费率让合约价格贴近标的价格。",
    "perp": "没有到期日的期货类合约，通过定期支付资金费率让合约价格贴近标的价格。",
    "cross margin": "所有全仓仓位共享同一份保证金，资金利用率高，但一个仓位亏损会影响其他仓位。",
    "isolated margin": "给单个仓位分配独立保证金，该仓位强平不影响其他仓位。",
    "PnL": "Profit and Loss，交易赚或赔的金额。",
    "OI": "Open Interest：市场上尚未平仓的合约总数量。",
    "open interest": "Open Interest：市场上尚未平仓的合约总数量。",
    "delta hedging": "建立反向仓位，让组合 delta 接近零（delta 中性），使组合价值基本不随标的价格变动。衍生品教材标准术语。",
    "delta": "组合价值对标的价格变动的敏感度；现货和线性永续的 delta 约等于持仓数量（做空为负）。",
    "cash-and-carry": "买入现货、同时卖出对应期货或永续，赚取两者价差收敛（及资金费率）的交易；也称基差交易。标准术语。",
    "basis trade": "买入现货、同时卖出对应期货或永续，赚取两者价差收敛（及资金费率）的交易；也称基差交易。标准术语。",
    "carry trade": "借入持有成本低的资产、持有收益高的资产以赚取差额的交易（CFTC 定义）。Hyperliquid 文档用它指“持有现货 + 做空永续”赚取资金费率的组合。",
    "cross-exchange hedging": "在两个交易场所分别建立方向相反的仓位进行对冲。该组合词是描述性说法，不是标准术语；其中“交易场所（trading venue）”是欧盟 MiFID II 法定术语。",
    "trading venue": "MiFID II 定义为受监管市场、多边交易设施（MTF）或有组织交易设施（OTF）；泛指可以撮合交易的场所。",
    "inventory risk": "做市商因被动成交而积累单边持仓，承受价格变动损失的风险；做市研究中的经典问题。",
    "leg risk": "“腿”（leg）指组合交易里的单笔交易。腿部风险指一条腿已成交、另一条腿没能按预期价格成交；Wikipedia 将其归入套利的执行风险（execution risk）。",
    "legging risk": "“腿”（leg）指组合交易里的单笔交易。腿部风险指一条腿已成交、另一条腿没能按预期价格成交；Wikipedia 将其归入套利的执行风险（execution risk）。",
    "LP": "Liquidity Provider：向市场持续挂单或注入资金、提供流动性的参与者，与做市商含义接近。",
    "LTV": "Loan-to-Value，借款额与抵押品价值之比；Hyperliquid 组合保证金中 HYPE 为 0.65、BTC 为 0.5，决定可借额度。",
    "CLOB": "Central Limit Order Book：覆盖整个市场、接受限价单的单一订单簿，通常按价格优先、时间优先撮合。美国 CFTC 官方术语表收录，不是自创词。",
    "AMM": "Automated Market Maker：按数学公式根据资金池余额自动报价的做市机制，常见于去中心化交易所，与订单簿撮合不同。",
    "CEX": "由公司运营、托管用户资产并撮合交易的加密货币交易所，如 Binance、OKX。",
    "DEX": "在区块链上运行、用户自持资产直接交易的交易所。",
    "L1": "自身负责共识与交易结算的主区块链，如以太坊主网。",
    "Layer 1": "自身负责共识与交易结算的主区块链，如以太坊主网。",
    "finality": "交易一旦确认就不能再被更改或回滚的保证。",
    "EVM": "Ethereum Virtual Machine，以太坊虚拟机；“EVM 钱包”指兼容以太坊地址体系的钱包。",
    "gas": "在以太坊类区块链上执行交易需要支付的手续费单位。",
    "API": "Application Programming Interface：程序之间交互的接口，这里指交易所提供的行情与交易接口。",
    "UI": "User Interface，用户界面，这里指交易所网页或 App 前端。",
    "CCTP": "Cross-Chain Transfer Protocol，Circle 的跨链转账协议：在源链销毁 USDC、在目标链重新发行，而不是锁在桥里。",
    "Hyperliquidity": "写入区块状态转换逻辑的协议级做市策略，在价格区间内自动挂单，为新代币的 USDC 现货对提供初始流动性。",
    "HyperCore": "Hyperliquid L1 的交易执行层，包含全链上永续与现货订单簿，下单、撤单、成交与强平都在链上完成。",
    "HyperEVM": "Hyperliquid 链上兼容以太坊虚拟机（EVM）的通用智能合约环境，可调用 HyperCore 的流动性。",
    "Arbitrum": "以太坊的二层扩容网络，Hyperliquid 的 USDC 入金桥部署在上面。",
    "TWAP": "Time-Weighted Average Price，时间加权平均价格；执行上指把大单拆成小单、在一段时间内分批下单以减少冲击。"
};
    Object.assign(terms, hyperliquidArticleTerms);
    delete terms.USDC;
    delete terms.USDT;
  }
  const root = document.querySelector('#article-container');
  if (!root) return;
  const escaped = Object.keys(terms).sort((a,b) => b.length-a.length).map(x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(escaped.join('|'), 'gi');
  const keys = Object.fromEntries(Object.keys(terms).map(k => [k.toLowerCase(), k]));
  const seen = new Set();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode(node) {
    const p = node.parentElement;
    return !p || p.closest('a,button,script,style,code,pre,textarea,svg,summary,h1,h2,h3,h4,h5,h6,.research-term-popover') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
  }});
  const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const text = node.nodeValue; let match; let last = 0; let fragment = null;
    pattern.lastIndex = 0;
    while ((match = pattern.exec(text))) {
      const word = match[0]; const key = keys[word.toLowerCase()];
      if (seen.has(key)) continue;
      if (/^[a-z0-9-]+$/i.test(word) && ((match.index && /[a-z0-9]/i.test(text[match.index-1])) || /[a-z0-9]/i.test(text[match.index+word.length] || ''))) continue;
      if (!fragment) fragment = document.createDocumentFragment();
      fragment.append(text.slice(last, match.index + word.length));
      const button = document.createElement('button'); button.type='button'; button.className='research-term-help';
      button.textContent='❓'; button.setAttribute('aria-label', `解释 ${word}`); button.setAttribute('aria-expanded','false');
      button.dataset.term = key; fragment.append(button); seen.add(key); last = match.index + word.length;
    }
    if (fragment) { fragment.append(text.slice(last)); node.replaceWith(fragment); }
  }
  const popup = document.createElement('div'); popup.className='research-term-popover'; popup.id='research-term-popover'; popup.hidden=true; popup.setAttribute('role','dialog'); popup.setAttribute('aria-label','术语解释'); document.body.append(popup);
  let active = null;
  function close() { popup.hidden=true; if(active) active.setAttribute('aria-expanded','false'); active=null; }
  function place(button) { const box=button.getBoundingClientRect(); const w=popup.offsetWidth, h=popup.offsetHeight; popup.style.left=`${Math.max(12, Math.min(innerWidth-w-12, box.left))}px`; popup.style.top=`${box.bottom+8+h > innerHeight-12 ? Math.max(12,box.top-h-8) : box.bottom+8}px`; }
  root.addEventListener('click', event => { const button=event.target.closest('.research-term-help'); if(!button) return; if(active===button){close();return;} close();active=button;button.setAttribute('aria-expanded','true');button.setAttribute('aria-controls',popup.id);popup.replaceChildren();const title=document.createElement('strong');title.textContent=button.dataset.term;const desc=document.createElement('span');desc.textContent=terms[button.dataset.term];popup.append(title,desc);popup.hidden=false;place(button); });
  document.addEventListener('click', event => {if(active && !popup.contains(event.target) && !active.contains(event.target))close();});
  document.addEventListener('keydown', event => {if(event.key==='Escape' && active){const b=active;close();b.focus();}});
  addEventListener('scroll', event => { if (!popup.contains(event.target)) close(); },true); addEventListener('resize',close);
})();
