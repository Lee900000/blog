---
title: 数字货币与交易术语词典：从买币、钱包到合约风控
description: 用通俗解释、例子和图解认识数字货币、链上钱包、现货、合约、保证金、资金费率及交易所常见字段。
postDesc: 从第一次买 U 到读懂合约与风控，把容易混淆的数字货币术语放在一起讲清楚。
date: 2026-11-03 18:00:00
categories:
  - - 数字货币
tags:
  - 数字货币
  - 交易术语
  - 永续合约
  - 风险管理
comments: false
permalink: archives/5596f036.html
listed: false
---

第一次打开交易所，看到的可能是 U、C2C、Maker、标记价格、维持保证金率……每个词单独看似乎都不难，放到一次交易里就容易混在一起。

这篇词典从买币、转账讲起，再走到下单、合约、资金费率与强平。它参考了[币算的入门术语页面](https://ngneo.com/learn/glossary)，并结合我整理的交易专业词典补充中英文名称、交易所字段和容易弄错的细节。数字示例仅用于解释，不代表实时行情或交易建议。不同交易所、产品和账户模式的规则可能不同，实际操作以前台说明及官方规则为准。

<div class="crypto-glossary-search"><label for="crypto-term-search">搜索本篇术语</label><input id="crypto-term-search" type="search" placeholder="输入中文或英文，在弹窗中查看结果"><p id="crypto-term-status" aria-live="polite">搜索结果只展示匹配的术语、解释和动画。</p></div>

<div id="glossary-starter"></div>
<div id="glossary-index"></div>

**按主题浏览：** [基础与账户](#基础与账户) · [链上与钱包](#链上与钱包) · [现货与订单](#现货与订单) · [合约与仓位](#合约与仓位) · [价格与盈亏](#价格与盈亏) · [保证金与强平](#保证金与强平) · [费用与资金费率](#费用与资金费率) · [策略与市场](#策略与市场) · [交易所字段](#交易所字段) · [完整专业词典 · 610 条记录](#专业术语与交易所字段)

## 先看懂一笔交易



现货买到的是资产；合约获得的是合约价格变化带来的盈亏敞口。合约可以使用杠杆，需要持续关注保证金与强平风险。两个市场都可能亏损。

<span id="crypto-glossary"></span>

## 基础与账户

### 数字货币 / 加密资产（Crypto Assets）

利用密码学和分布式账本等技术记录或转移的数字资产。不同资产的发行机制、用途和风险差别很大，不能因为都叫“币”就当成同一种产品。

### 比特币（Bitcoin / BTC）

比特币网络的原生资产。网络通过共识规则记录交易；BTC 的价格随市场变化，并不承诺固定收益。

### 以太坊与以太币（Ethereum / ETH）

以太坊是一条支持智能合约的区块链，ETH 是其原生资产，也用于支付以太坊上的交易费用。

### 稳定币（Stablecoin）

以维持相对某种参考资产的价格为目标的代币。例如美元稳定币通常希望接近 1 美元。**目标不等于保证**：发行方、储备、赎回和市场流动性等风险都可能导致脱锚。

### USDT / U

USDT 是 Tether 发行的美元稳定币。“买 U”通常指买入 USDT，市场价格可能偏离 1 美元。

### USDC

USDC 是 Circle 发行的美元稳定币。理解稳定币时，除了目标价格，还要关注发行方、储备资产、赎回条件和托管风险。

### 脱锚（Depeg）

稳定币市场价格持续或明显偏离其目标价格。例如目标为 1 美元，市场报价暂时跌到 0.97 美元。价格随后是否恢复，没有保证。

### 交易所（Exchange）

提供数字资产交易等服务的平台。中心化交易所通常负责账户、订单撮合和托管；去中心化交易所通常通过链上协议完成交易，用户仍需承担合约和钱包风险。

### C2C / P2P

个人之间买卖资产的交易方式。以平台撮合的法币买 U 为例，买方按订单付款，卖方确认实际到账后放币，平台的托管和申诉规则依产品而异。

### 入金 / 出金

入金是把资金转入交易环境，出金是把资金转出；具体可能指法币、链上资产或平台内部划转，要结合场景看。

### 溢价 / 折价（Premium / Discount）

市场报价高于参考价格叫溢价，低于叫折价。例如参考汇率为 7.00 元/美元，某方向 USDT 报价 7.07 元，按此参考计算溢价约 1%；实际还要区分买卖方向、费用和参考汇率时间。

### KYC / 身份认证

平台核验用户身份的流程。需要提交哪些资料、能使用哪些服务，取决于平台、地区和认证等级。

### 双重验证（2FA）

在登录密码之外增加另一种身份验证，例如验证器或安全密钥。验证凭证与备份密钥都应妥善保管。

### 防钓鱼码

用户在平台设置的邮件核对标记。收到声称来自平台的邮件时，核对该标记，并继续检查发件来源和链接；代码一致也不能单独证明邮件安全。

### 提币白名单

将经过核对的提币地址登记到允许列表，限制资产只能转到名单中的地址。修改名单的验证条件和等待时间依平台规则而定。

### 储备金证明（Proof of Reserves / PoR）

平台展示某个时点的储备资产及部分用户余额证明的方法。能验证余额被纳入，并不自动证明所有负债已被覆盖，也不等同完整审计。

### 平台币（Exchange Token）

与交易平台相关的代币，可能用于手续费折扣或其他权益。具体权益和风险由发行及平台规则决定。

## 链上与钱包

### 区块链 / 公链（Blockchain）

由网络参与者共同维护的交易记录系统。不同网络的地址规则、手续费、确认速度和支持的资产可能不同。

### 网络与代币标准：ERC-20 / TRC-20 / BEP-20

这些名称常被用来区分代币所在的网络或标准。转账时要以收款方支持的**币种与网络**为准；两个地址都以 `0x` 开头，不代表可以忽略网络选择。


### 地址（Address）

接收链上资产的标识。地址格式看似相同也不代表网络相同；先从收款方的正规入口复制并核对，必要时先小额测试。

### 地址投毒（Address Poisoning）

攻击者让相似地址出现在交易记录中，诱导用户复制错误地址。不要只看地址首尾几位，应从可信地址簿或收款页面取得并完整核对。

### Memo / Tag / 备注标签

某些平台用额外标签区分共用地址下的用户。收款方要求填写时，地址与标签都要正确；漏填可能导致无法自动入账，需按平台流程处理。

### 交易哈希（TxID / Transaction Hash）

链上交易的标识，可用于相应区块浏览器查询状态。拿到哈希不等于交易已成功，也不等于交易所已经完成入账。

### 确认数（Confirmations）

交易所在区块之后又被链上确认的进度。平台通常会设置入账或开放提现所需的确认条件，具体门槛因网络和平台而异。

### Gas / 网络手续费

链上执行交易或智能合约操作需要消耗资源，费用由对应网络的规则决定。例如以太坊上的交易费用通常以 ETH 支付。平台收取的提币手续费与实际链上费用不一定相同。

### 托管钱包 / 自托管钱包

托管账户通常由服务商管理签名所需密钥；自托管钱包由用户控制密钥并授权交易。自己保管增加控制权，也意味着需要自己保护和备份凭证。

### 私钥 / 助记词（Private Key / Recovery Phrase）

私钥用于控制对应账户的签名；助记词通常可以恢复钱包并派生多个账户。不要把它们交给客服、陌生人或网页，[以太坊安全指南](https://ethereum.org/security/)也强调恢复短语的保管风险。

### 智能合约与授权（Smart Contract / Approval）

智能合约是在链上执行规则的程序；授权是允许指定合约在额度内使用某种代币，不一定立即转账。签名前核对合约、代币与额度，不再使用时检查并撤销不必要的授权。

### 减半（Halving）

比特币的区块补贴按协议每 21 万个区块减半。减半影响新增发行，不保证价格上涨；矿工的交易手续费收入是另一部分。

## 现货与订单

### 现货（Spot）

直接买卖资产本身。例如用 100 USDT 买入 BTC，成交后持有 BTC；不用借款的普通现货不会发生合约强平，但价格下跌仍会造成亏损。

### 交易对、基础资产、计价资产

`BTC/USDT` 中，BTC 是基础资产，USDT 是计价资产。价格 100,000 USDT 表示每 1 BTC 对应的报价，不代表必须买满 1 BTC。

### 订单簿与深度（Order Book / Depth）

订单簿展示不同价格上等待成交的买单和卖单；深度描述各价位的挂单数量。看到的挂单可能随时撤销，不能保证大额订单按一个价格成交。

### 买一 / 卖一与价差（Bid / Ask / Spread）

买一是当前最高买价，卖一是当前最低卖价，差额是买卖价差。例如买一 99、卖一 101，价差为 2；买入和立即卖出之间可能产生损耗。

### 限价单（Limit Order）

指定可接受的价格边界。限价买单只接受指定价或更低价格，但触及该价格也可能因为排队、数量不足而不成交或只成交一部分。

### 市价单（Market Order）

按订单簿中可用价格寻求成交。它不保证看到的最新价就是最终成交价；流动性不足时也可能受平台规则限制。

### 挂单 / 吃单（Maker / Taker）

为订单簿增加流动性的成交部分通常称 Maker；立即与已有订单成交的部分通常称 Taker。限价单也可能立即成交成为 Taker，费用按实际成交身份及平台规则计算。

### 滑点（Slippage）

预期价格与实际成交价格的差异。预期买价为 100、实际均价为 101，即买入成本高出约 1%；也可能出现对交易者有利的滑点。

### 成交均价与部分成交

一笔订单可以拆成多笔成交，成交均价是按成交数量加权后的价格。部分成交表示只有部分数量成交，剩余数量可能继续挂单或被取消。

### 撤单 / 撤单失败

撤单请求是要求取消尚未成交的部分；在请求到达撮合系统之前订单仍可能成交。最终状态应以平台返回和成交记录为准。

### 订单状态（Order Status）

常见状态包括新建、部分成交、全部成交、已取消、已过期或拒绝。不同接口的状态枚举和撤单后部分成交的展示方式可能不同。

### GTC / IOC / FOK / Post Only

GTC 通常表示订单持续有效直到成交或取消；IOC 要求立即成交可成交部分并取消剩余；FOK 要求立即全部成交，否则取消；Post Only 要求订单只作为挂单，若会立即吃单则依平台规则处理。

### 止盈 / 止损（Take Profit / Stop Loss）

预设条件达到时发出平仓或交易指令。触发价不是成交价：触发后若使用市价单可能发生滑点；若使用限价单则可能无法成交。

### 触发价、触发类型与委托价

触发价决定何时激活条件单；触发类型可能选择最新价、标记价或指数价；委托价是触发后限价订单的价格。三者不能混为一谈，具体支持项依平台而定。

### 闪兑（Convert）

按平台给出的报价直接兑换资产。它通常简化了下单过程，实际成本可能体现在报价中，应比较最终到账数量。

### 插针（Price Wick）

K 线短时间出现明显偏离周边价格的长影线。原因可能涉及流动性或大额交易等，不能仅凭图形断定有人操纵。

## 合约与仓位

### 衍生品 / 合约（Derivatives / Contract）

价值与某种标的资产或指数相关的金融合约。买入合约并不等同于持有对应现货，结算方式、期限和风险由产品规则决定。

### 永续合约（Perpetual / Swap）

没有固定到期日的合约，通常通过资金费率等机制帮助合约价格贴近参考市场。没有到期日不等于可以无条件一直持有：仓位仍可能被平仓或强平。

### 交割合约（Delivery Futures）

有约定到期日的合约，到期时按平台规则结算。不同产品可能采用现金或其他形式结算，应查看具体合约说明。

### U 本位 / 币本位

常见 U 本位合约以稳定币计价并以相关稳定币结算；币本位合约通常以数字资产作为保证金或结算资产。收益计算、抵押资产波动和合约规格各不相同。

### 做多 / 做空（Long / Short）

做多通常在价格上涨时受益，做空通常在价格下跌时受益；反向波动则可能亏损。收益还会受手续费、资金费和具体合约规则影响。

### 开仓 / 平仓（Open / Close）

开仓建立市场敞口；平仓减少或结束现有敞口。一个订单是开仓还是平仓，还要结合账户的持仓模式和订单参数判断。

### 持仓、持仓方向与持仓数量

持仓是尚未平掉的合约敞口。数量可能以币、张或其他单位展示；多空方向和数量不能只靠订单的买卖方向推断。

### 单向持仓 / 双向持仓

单向模式通常将同一合约的多空交易合并为净持仓；双向模式允许分别持有多头和空头。是否支持、如何下单由平台与账户设置决定。

### 仅减仓（Reduce Only）

用于限制订单只能减少已有仓位，避免平仓订单意外变成反向开仓。不同持仓模式和交易所对该参数的支持可能不同。

### 合约面值 / 合约乘数（Contract Value / Multiplier）

合约以“张”为单位时，每张代表多少标的或名义金额取决于规格。例如假设每张代表 0.01 BTC，100 张对应 1 BTC 的数量敞口。**不要把不同交易所同名字段当作同一单位**；OKX 的 `ctVal`、`ctMult` 等字段需结合产品定义查看。

### 杠杆（Leverage）

用相对较少的初始保证金建立较大名义仓位。例如忽略费用与风险限额，100 USDT 保证金以 10 倍建立约 1,000 USDT 名义仓位；标的价格反向变动 1%，仓位亏损约 10 USDT，约占初始保证金的 10%。杠杆放大的是保证金收益率和风险，不改变标的本身的涨跌幅。

## 价格与盈亏

### 最新价（Last Price）

最近一笔成交的价格。它反映最新成交，不一定等于你下一笔订单的实际成交价，也不一定是强平判断依据。

### 指数价（Index Price）

按交易所规则从一个或多个参考市场价格计算出的指数。成分市场、权重、异常处理和更新频率需看平台说明。

### 标记价格（Mark Price）

平台按规则计算、用于风险评估等场景的参考价格。以币安合约为例，强平和未实现盈亏计算会使用标记价格；它可能与最新成交价不同。[币安强平说明](https://www.binance.com/en-AE/support/faq/detail/360033525271)


### 开仓均价 / 持仓均价（Entry Price）

用于计算仓位盈亏的参考成本价格。加仓、部分平仓以及不同产品的计算规则可能影响展示值，应查看平台口径。

### 未实现盈亏 / 已实现盈亏（Unrealized / Realized PnL）

未实现盈亏是仍持有仓位按参考价格估算的盈亏；已实现盈亏通常来自已平仓部分。手续费和资金费是否包含在展示值中取决于页面口径。

### 盈亏示例：线性合约多头

假设持有 0.1 BTC 等值的线性多头，开仓价 100,000 USDT，参考平仓价 101,000 USDT，忽略费用时盈亏约为 `(101,000 − 100,000) × 0.1 = 100 USDT`。空头方向相反。币本位等反向合约公式不同，不能直接套用。

### 收益率（ROI / ROE）

收益与所选成本或保证金的比例。分母是初始保证金、当前保证金还是其他金额，会改变结果；比较前先确认口径，也要区分是否计入费用。

### 基差（Basis）

合约价格与现货或指数参考价格之间的差额或比例。不同分析可能用不同方向相减、不同价格作分母，引用数字时应写明公式。

## 保证金与强平

### 保证金（Margin）

用于支持合约仓位、吸收亏损的资金或合格抵押资产。它不是交易手续费，也不是对亏损上限的普遍保证。

### 初始保证金（Initial Margin）

开立或维持某个名义仓位所需的初始资金要求。简单示例可用“名义价值 ÷ 杠杆”理解，但实际还需考虑风险档位、费用、账户模式等。

### 维持保证金（Maintenance Margin）

维持仓位所需满足的最低保证金要求的一部分。实际风控还可能考虑手续费、其他仓位和账户权益，不能把它理解为固定不变的剩余余额。

### 全仓 / 逐仓（Cross / Isolated）

逐仓通常将特定保证金分配给某个仓位；全仓通常由账户中符合规则的可用资金共同支持相关仓位。具体共享范围、追加保证金和风险限制依平台与账户模式而异。

### 保证金率（Margin Ratio）

衡量保证金与风险要求关系的指标，但**不同平台的分子、分母和强平方向可能不同**。看到“保证金率 80%”时，应先看该平台公式，而不是直接比较高低。

### 强平 / 爆仓（Liquidation）

账户或仓位触及平台规定的风险条件后，系统可能采取减仓或平仓等措施。强平通常在权益不足以满足维持要求时发生，并不需要等到保证金恰好亏完；“爆仓”是常见口语，具体结果依规则和市场情况而异。

### 强平价格 / 预估强平价（Liquidation Price）

按当前账户和风险参数估算可能触发强平的价格，不是保证成交的价格。追加或减少保证金、其他仓位盈亏、资金费和风险档位变化都可能改变它。

### 破产价格（Bankruptcy Price）

按平台特定模型计算，相关仓位保证金权益降至零附近的理论价格。它与强平触发价、实际平仓成交价不是同一个概念。

### 风险限额 / 杠杆分层（Risk Tiers）

交易所可能按仓位名义价值设置不同的最大杠杆和保证金要求。仓位变大后，允许杠杆可能降低，维持保证金要求也可能变化。

### 保险基金（Insurance Fund）

按平台规则用于处理部分强平穿仓等风险的资金池。它的来源、使用条件和覆盖范围因平台而异，不代表用户不会亏损。

### 自动减仓（Auto-Deleveraging / ADL）

极端情况下，平台可能按规则对部分对手方仓位自动减仓，以处理无法通过常规强平机制消化的风险。排序、触发条件和执行方式以平台规则为准。

### 穿仓（Negative Balance / Bankruptcy Loss）

市场剧烈波动或流动性不足时，平仓损失可能超过分配的保证金，出现风险缺口。由谁承担、如何处置取决于平台规则、账户安排及适用条款。

## 费用与资金费率

### 交易手续费（Trading Fee）

成交时按平台费率计算的费用。费率可能随 Maker / Taker 身份、交易量、等级和折扣变化；下单未成交通常不等于已经产生交易手续费。

### 资金费率（Funding Rate）

永续合约多空双方按规则定期交换资金费用的费率。通常费率为正时多头支付空头，为负时空头支付多头；具体结算时间和计算口径以产品为准。[币安说明](https://www.binance.com/en/support/faq/detail/360033525031)

### 资金费用（Funding Fee）

按结算时仓位和费率计算的金额。示例：名义仓位 10,000 USDT、费率 +0.01%，多头应付约 1 USDT；实际名义价值、持仓时点及精度按平台规则计算。结算周期可能调整，不能假定所有产品永远每 8 小时结算。



### 返佣（Rebate）

按平台或合作方规则返还部分手续费等费用的安排。返佣比例、计算基础、结算时间以及是否存在其他条件，需要以具体规则为准。

## 策略与市场

### 定投（DCA）

按固定时间间隔投入一定金额的方式。它可以减少一次性择时的依赖，但不保证盈利，也不能消除长期下跌风险。

### 补仓

通常指价格不利时继续买入以调整平均成本。平均成本下降不代表亏损消失，继续下跌时更大的仓位也会带来更多损失。

### 加仓

在原有持仓上继续增加数量。加仓可以发生在盈利或亏损时，会增加资金占用与市场敞口。

### 滚仓

利用已有盈利、保证金或仓位继续扩大持仓。行情反转时更大的仓位也可能更快侵蚀原有利润，具体机制依策略而异。

### 网格交易（Grid Trading）

在设定价格区间内按多个价位布置买卖的策略。价格反复波动时可能产生多次交易；单边行情、超出区间和手续费都可能造成损失。

### 以损定仓

先确定愿意承受的计划损失，再根据入场价与止损价之间的距离估算仓位。跳空或滑点可能使实际亏损超过计划。

### 盈亏比

比较计划获利与计划亏损的比例。例如计划获利 300、计划亏损 100，盈亏比为 3:1。它不包含胜率，也不保证订单最终按计划成交。

### 期现套利（Cash-and-Carry）

通过现货和合约建立相反方向的敞口，尝试获取基差或资金费等收益。它仍有资金费变化、流动性、交易所、保证金及强平等风险。

### 牛市 / 熊市

对较长时期市场上涨或下跌趋势的概括，没有唯一通用划线。趋势描述不能保证下一段行情方向。

### 历史最高价（ATH）

某种资产在指定数据来源和计价口径下的历史最高价格。不同交易所、币种单位和数据区间可能产生不同结果。

### 山寨币 / 平台代币

山寨币通常泛指比特币之外的其他加密资产，分类边界并不严格。平台代币是与某个平台相关的一类代币，不能简单据此判断资产价值。

### 恐惧与贪婪指数

综合多种数据衡量市场情绪的指标。它有自己的计算方法和数据覆盖范围，情绪高低不能直接预测下一步价格。

### AHR999

用于观察比特币历史价格位置的模型指标，涉及价格、定投成本及模型估值等数据。模型区间是观察工具，不是保本或收益承诺。

### 彩虹图

用颜色带展示价格与某种历史拟合模型之间的位置关系。颜色带取决于模型假设，历史拟合效果不能保证未来走势。

### 比特币市值占比（BTC Dominance）

比特币市值占所选加密资产总市值的比例。数据来源的资产覆盖范围和市值算法不同，结果也可能不同；占比上升不必然代表 BTC 价格上涨。

### 现货 ETF

在交易所交易、按产品文件持有或跟踪相关现货资产的基金产品。它与直接持币在托管、费用、交易时间和投资者权利上不同，具体结构和可购买范围依产品与地区而定。

## 交易所字段

下面是阅读接口或产品规格时的速查。字段是否存在、单位、账户模式以及返回语义要以对应交易所和接口版本为准；同一个英文词在不同平台不一定代表同一个计算量。

| 概念 | 币安常见字段或取值 | OKX 常见字段或取值 | 阅读时注意 |
| --- | --- | --- | --- |
| 永续合约 | `PERPETUAL` | `SWAP` | 两者属于各自接口枚举，不能直接互换。 |
| 交割合约 | 合约类型及到期时间 | `FUTURES`、`expTime` | 具体枚举和时间单位查对应接口。 |
| 客户自定义订单号 | `newClientOrderId` | `clOrdId` | 长度和允许字符依接口规则。 |
| 订单有效方式 | `timeInForce` | 下单类型中的相关取值 | 平台枚举不完全一致。 |
| 仓位方向 | `positionSide` | `posSide` | 依单向或双向持仓模式解释。 |
| 标记价格 | `markPrice` | `markPx` | 属于参考价格，不是成交价格。 |
| 指数价格 | `indexPrice` | `idxPx` | 不同接口的字段可能变化。 |
| 合约面值 | 查看具体合约规格 | `ctVal`、`ctValCcy` | 需同时看数值和面值币种。 |
| 合约乘数 | 查看具体合约规格 | `ctMult` | 不应直接等同 `ctVal`。 |

例如 OKX 产品信息同时给出 `ctVal`、`ctValCcy` 和 `ctMult` 时，需要结合产品类型和单位解释；不要只把任意一个字段重命名为 `contract_value` 就开始计算。[OKX API 文档](https://my.okx.com/docs-v5/)

## 专业术语与交易所字段

以下完整收录自我整理的专业词典（v0.9，2026-10-27）：48 张字段表、610 条记录，以及公式、算例、来源和核实局限。✅ 表示原词典的项目规范，不是交易所官方认证；💡 是建议命名。原文未核实、未抓取和冲突说明均保留，不能视为当前交易规则。可在上方搜索中文、英文或字段名。

{% raw %}
<details id="professional-dictionary" class="professional-dictionary"><summary>展开完整专业词典 · 610 条字段与术语记录</summary>
  

<blockquote>
<p>用途：给合约 / 字段 / 接口 / Topic 命名时快速查英文。
约定：「字段参考」列中带 ✅ 的来自团队《全局统一字段命名词典》（<code>field-naming.md</code>），已是规范；带 💡 的是<strong>建议命名</strong>，尚未进入规范，落库前需对照规范复核。
来源说明：第 1～11 节基于主流交易所（Binance / OKX / Bybit 等）通用叫法整理，<strong>未逐一联网核对</strong>；第 12～16 节是从币安 / OKX 官方文档抓取的映照、公式与举例，来源与局限见各节；<strong>第 17 节是币安公式汇总，含每个公式的页面链接</strong>。各所叫法有差异处在「备注」列标注。</p>
</blockquote>
<hr>
<h4 id="professional-0-okx">0. 币安 × OKX 对照总表（主表）</h4>
<blockquote>
<p>查词先看这张表；细节在第 12～17 节。
<strong>标记</strong>：无标记 = 已在该所官方文档页面看到；〔通识〕= 我的记忆，<strong>本次未核实</strong>；「未抓取」= 该所对应页面本次没读到，<strong>不代表没有</strong>；「—」= 该所没有对应概念（已确认或基本确认）。
币安 = U 本位 / 币本位合约 API 中文版及帮助中心；OKX = API v5 文档（账户 instruments、余额、持仓表）。
币安字段是 camelCase、OKX 字段是缩写 camelCase，本项目统一 snake_case；「本项目字段」中 ✅ = 已入规范，💡 = 建议。</p>
</blockquote>
<h4 id="professional-01">0.1 合约规格</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="1"><article class="professional-record"><h3 id="pro-record-1">产品类型</h3><dl><dt>概念</dt><dd>产品类型</dd><dt>币安 中文</dt><dd>交易对类型 / 合约类型</dd><dt>币安 英文 / 字段</dt><dd><code>contractType</code>：PERPETUAL、CURRENT_MONTH、NEXT_MONTH、CURRENT_QUARTER、NEXT_QUARTER</dd><dt>OKX 中文</dt><dd>产品类型</dd><dt>OKX 英文 / 字段</dt><dd><code>instType</code>：SPOT、MARGIN、SWAP、FUTURES、OPTION、EVENTS</dd><dt>本项目字段</dt><dd>💡 <code>contract_type</code></dd><dt>注解</dt><dd>币安把永续与交割按「期限」拆成 5 档枚举；OKX 只分 SWAP / FUTURES，具体到期靠 <code>expTime</code>。两边枚举<strong>不能直接互转</strong></dd></dl></article><article class="professional-record"><h3 id="pro-record-2">永续合约</h3><dl><dt>概念</dt><dd>永续合约</dd><dt>币安 中文</dt><dd>永续合约</dd><dt>币安 英文 / 字段</dt><dd>PERPETUAL</dd><dt>OKX 中文</dt><dd>永续</dd><dt>OKX 英文 / 字段</dt><dd>SWAP</dd><dt>本项目字段</dt><dd>永续 / PERP</dd><dt>注解</dt><dd>OKX 的 SWAP 就是永续，别当成「互换」</dd></dl></article><article class="professional-record"><h3 id="pro-record-3">交割合约</h3><dl><dt>概念</dt><dd>交割合约</dd><dt>币安 中文</dt><dd>当月 / 次月 / 当季 / 次季交割合约</dd><dt>币安 英文 / 字段</dt><dd>CURRENT_MONTH 等</dd><dt>OKX 中文</dt><dd>交割</dd><dt>OKX 英文 / 字段</dt><dd>FUTURES</dd><dt>本项目字段</dt><dd>交割 / FUT</dd><dt>注解</dt><dd>币安的「期货」在文档里指整个 FUTURE 交易对类型，<strong>含永续</strong>，OKX 的 FUTURES <strong>不含永续</strong></dd></dl></article><article class="professional-record"><h3 id="pro-record-4">合约代码</h3><dl><dt>概念</dt><dd>合约代码</dd><dt>币安 中文</dt><dd>交易对</dd><dt>币安 英文 / 字段</dt><dd><code>symbol</code>（形如 BTCUSDT）〔通识〕</dd><dt>OKX 中文</dt><dd>产品 ID</dd><dt>OKX 英文 / 字段</dt><dd><code>instId</code>（形如 BTC-USDT-SWAP）</dd><dt>本项目字段</dt><dd><code>symbol</code> ✅</dd><dt>注解</dt><dd>OKX 的 ID 里带类型后缀，币安不带；本项目规范是 <code>BTC-USDT-PERP</code> 风格</dd></dl></article><article class="professional-record"><h3 id="pro-record-5">标的</h3><dl><dt>概念</dt><dd>标的</dd><dt>币安 中文</dt><dd>标的类型 / 子类型</dd><dt>币安 英文 / 字段</dt><dd><code>underlyingType</code> / <code>underlyingSubType</code></dd><dt>OKX 中文</dt><dd>标的指数 / 交易品种</dd><dt>OKX 英文 / 字段</dt><dd><code>uly</code> / <code>instFamily</code>（形如 BTC-USD）</dd><dt>本项目字段</dt><dd>💡 <code>underlying</code></dd><dt>注解</dt><dd>OKX 的 <code>uly</code> 是<strong>指数名</strong>，币安是<strong>标的分类</strong>，语义不同</dd></dl></article><article class="professional-record"><h3 id="pro-record-6">基础币 / 计价币</h3><dl><dt>概念</dt><dd>基础币 / 计价币</dd><dt>币安 中文</dt><dd>基础币 / 计价币</dd><dt>币安 英文 / 字段</dt><dd><code>baseAsset</code> / <code>quoteAsset</code>〔通识〕</dd><dt>OKX 中文</dt><dd>交易货币 / 计价货币</dd><dt>OKX 英文 / 字段</dt><dd><code>baseCcy</code> / <code>quoteCcy</code>（<strong>仅币币 / 杠杆</strong>）</dd><dt>本项目字段</dt><dd><code>base_coin</code> / <code>quote_coin</code> ✅</dd><dt>注解</dt><dd>OKX 衍生品<strong>不填</strong> <code>baseCcy</code>，要用 <code>instFamily</code> / <code>settleCcy</code> 拆；币安另规定币字段名叫 <code>asset</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-7">结算 / 保证金币种</h3><dl><dt>概念</dt><dd>结算 / 保证金币种</dd><dt>币安 中文</dt><dd>保证金币种</dd><dt>币安 英文 / 字段</dt><dd><code>marginAsset</code>〔通识〕</dd><dt>OKX 中文</dt><dd>盈亏结算和保证金币种</dd><dt>OKX 英文 / 字段</dt><dd><code>settleCcy</code></dd><dt>本项目字段</dt><dd>💡 <code>settle_coin</code></dd><dt>注解</dt><dd>同一概念，OKX 明确「结算币 = 保证金币」</dd></dl></article><article class="professional-record"><h3 id="pro-record-8">单张合约价值</h3><dl><dt>概念</dt><dd><strong>单张合约价值</strong></dd><dt>币安 中文</dt><dd><strong>合约乘数</strong>（币本位，如 BTCUSD = 100 USD）</dd><dt>币安 英文 / 字段</dt><dd>字段名本次未抓取；资金费文写 Size of a Contract</dd><dt>OKX 中文</dt><dd><strong>合约面值</strong></dd><dt>OKX 英文 / 字段</dt><dd><strong><code>ctVal</code></strong></dd><dt>本项目字段</dt><dd>✅ <strong><code>contract_value</code></strong></dd><dt>注解</dt><dd><strong>用户已定名</strong>。币安用「乘数」一词表达的是 OKX 的「面值」，<strong>不是 OKX 的 <code>ctMult</code></strong></dd></dl></article><article class="professional-record"><h3 id="pro-record-9">合约乘数（独立）</h3><dl><dt>概念</dt><dd>合约乘数（独立）</dd><dt>币安 中文</dt><dd>—</dd><dt>币安 英文 / 字段</dt><dd>—</dd><dt>OKX 中文</dt><dd>合约乘数</dd><dt>OKX 英文 / 字段</dt><dd><code>ctMult</code></dd><dt>本项目字段</dt><dd>💡 <code>contract_multiplier</code></dd><dt>注解</dt><dd>OKX 独有。<strong>OKX 帮助中心公式里它是连乘项</strong>：仓位价值 = 张数 × 合约面值 × 合约乘数 × 标记价格（正向），反向则 ÷ 标记价格，见 15.6。<code>ctMult</code> 通常为 1〔未验证〕</dd></dl></article><article class="professional-record"><h3 id="pro-record-10">面值币种</h3><dl><dt>概念</dt><dd>面值币种</dd><dt>币安 中文</dt><dd>—（币本位固定 USD）</dd><dt>币安 英文 / 字段</dt><dd>—</dd><dt>OKX 中文</dt><dd>合约面值计价币种</dd><dt>OKX 英文 / 字段</dt><dd><code>ctValCcy</code></dd><dt>本项目字段</dt><dd>💡 <code>contract_value_coin</code></dd><dt>注解</dt><dd>面值必须带币种，不然不知道是 0.01 BTC 还是 100 USD</dd></dl></article><article class="professional-record"><h3 id="pro-record-11">正向 / 反向</h3><dl><dt>概念</dt><dd>正向 / 反向</dd><dt>币安 中文</dt><dd>U 本位 / 币本位</dd><dt>币安 英文 / 字段</dt><dd>USDⓈ-M（线性）/ COIN-M（反向）；<strong>两套 API</strong></dd><dt>OKX 中文</dt><dd>正向 / 反向</dd><dt>OKX 英文 / 字段</dt><dd><code>ctType</code>：linear / inverse</dd><dt>本项目字段</dt><dd>💡 <code>contract_type</code>（线性 / 反向）</dd><dt>注解</dt><dd>币安靠<strong>不同产品线</strong>区分，OKX 靠<strong>字段</strong>区分</dd></dl></article><article class="professional-record"><h3 id="pro-record-12">最大杠杆</h3><dl><dt>概念</dt><dd>最大杠杆</dd><dt>币安 中文</dt><dd>该层允许的最高初始杠杆倍数</dd><dt>币安 英文 / 字段</dt><dd><code>initialLeverage</code>（在 <code>leverageBracket</code> 的<strong>每个档位</strong>里）</dd><dt>OKX 中文</dt><dd>最大杠杆倍数</dd><dt>OKX 英文 / 字段</dt><dd><code>lever</code>（<strong>产品级单个值</strong>，不适用币币和期权）</dd><dt>本项目字段</dt><dd>💡 <code>max_leverage</code></dd><dt>注解</dt><dd>币安<strong>随仓位变</strong>，OKX 产品页上是单值，随仓位变化的上限在 <code>position-tiers</code> 的 <code>maxLever</code>（见 15.6，三方 SDK 来源）</dd></dl></article><article class="professional-record"><h3 id="pro-record-13">价格精度</h3><dl><dt>概念</dt><dd>价格精度</dd><dt>币安 中文</dt><dd>价格小数位</dd><dt>币安 英文 / 字段</dt><dd><code>pricePrecision</code>（≠ tickSize）</dd><dt>OKX 中文</dt><dd>下单价格精度</dd><dt>OKX 英文 / 字段</dt><dd><code>tickSz</code></dd><dt>本项目字段</dt><dd>💡 <code>tick_size</code></dd><dt>注解</dt><dd>币安 <code>pricePrecision</code> 是<strong>位数</strong>，OKX <code>tickSz</code> 是<strong>最小变动值</strong>，别混</dd></dl></article><article class="professional-record"><h3 id="pro-record-14">数量精度 / 最小下单量</h3><dl><dt>概念</dt><dd>数量精度 / 最小下单量</dd><dt>币安 中文</dt><dd>数量小数位</dd><dt>币安 英文 / 字段</dt><dd><code>quantityPrecision</code>（≠ stepSize）</dd><dt>OKX 中文</dt><dd>下单数量精度 / 最小下单数量</dd><dt>OKX 英文 / 字段</dt><dd><code>lotSz</code> / <code>minSz</code></dd><dt>本项目字段</dt><dd>💡 <code>lot_size</code> / <code>min_qty</code></dd><dt>注解</dt><dd>OKX 衍生品<strong>单位是张</strong>，币安 U 本位<strong>单位是币</strong></dd></dl></article><article class="professional-record"><h3 id="pro-record-15">上线时间</h3><dl><dt>概念</dt><dd>上线时间</dd><dt>币安 中文</dt><dd>合约上线时间</dd><dt>币安 英文 / 字段</dt><dd><code>onboardDate</code>（毫秒）</dd><dt>OKX 中文</dt><dd>上线时间</dd><dt>OKX 英文 / 字段</dt><dd><code>listTime</code>（毫秒）</dd><dt>本项目字段</dt><dd>💡 <code>list_time</code></dd><dt>注解</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-16">到期 / 下线时间</h3><dl><dt>概念</dt><dd>到期 / 下线时间</dd><dt>币安 中文</dt><dd>—</dd><dt>币安 英文 / 字段</dt><dd>交割日期字段本次未抓取</dd><dt>OKX 中文</dt><dd>产品下线时间</dd><dt>OKX 英文 / 字段</dt><dd><code>expTime</code>（毫秒）</dd><dt>本项目字段</dt><dd><code>expire_time</code> ✅</dd><dt>注解</dt><dd>币安 <code>deliveryDate</code> 〔通识〕未核实</dd></dl></article><article class="professional-record"><h3 id="pro-record-17">产品状态</h3><dl><dt>概念</dt><dd>产品状态</dd><dt>币安 中文</dt><dd>合约状态</dd><dt>币安 英文 / 字段</dt><dd><code>contractStatus</code>：PENDING_TRADING、TRADING、PRE_DELIVERING、DELIVERING、DELIVERED、PRE_SETTLE、SETTLING、CLOSE、TRADING_HALT、TRADING_CANCEL_ONLY</dd><dt>OKX 中文</dt><dd>产品状态</dd><dt>OKX 英文 / 字段</dt><dd><code>state</code>：live、suspend、rebase、post_only、preopen、test、settling</dd><dt>本项目字段</dt><dd><code>status</code></dd><dt>注解</dt><dd>币安 10 种、OKX 7 种；<code>TRADING_CANCEL_ONLY</code>（「只挂单」，文档自相矛盾）与 <code>post_only</code> <strong>语义不一定相同</strong>，见 12.2 / 15.1</dd></dl></article></div></div>
<h4 id="professional-02">0.2 账户与持仓</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="2"><article class="professional-record"><h3 id="pro-record-18">杠杆倍数</h3><dl><dt>概念</dt><dd>杠杆倍数</dd><dt>币安 中文</dt><dd>当前杠杆倍数</dd><dt>币安 英文 / 字段</dt><dd><code>leverage</code></dd><dt>OKX 中文</dt><dd>杠杆倍数</dd><dt>OKX 英文 / 字段</dt><dd><code>lever</code>（持仓级）</dd><dt>本项目字段</dt><dd>💡 <code>leverage</code></dd><dt>注解</dt><dd>币安默认值未在 U 本位页确认；币本位页写「默认 20 倍」</dd></dl></article><article class="professional-record"><h3 id="pro-record-19">保证金模式</h3><dl><dt>概念</dt><dd>保证金模式</dd><dt>币安 中文</dt><dd>是否逐仓</dd><dt>币安 英文 / 字段</dt><dd><code>isolated</code>（<strong>布尔</strong>）</dd><dt>OKX 中文</dt><dd>保证金模式</dd><dt>OKX 英文 / 字段</dt><dd><code>mgnMode</code>：cross / isolated（<strong>字符串</strong>）</dd><dt>本项目字段</dt><dd>💡 <code>margin_mode</code>（TINYINT）</dd><dt>注解</dt><dd>本项目禁布尔存三态，用枚举</dd></dl></article><article class="professional-record"><h3 id="pro-record-20">持仓方向</h3><dl><dt>概念</dt><dd>持仓方向</dd><dt>币安 中文</dt><dd>单一 / 多 / 空</dd><dt>币安 英文 / 字段</dt><dd><code>positionSide</code>：BOTH、LONG、SHORT</dd><dt>OKX 中文</dt><dd>买卖模式 / 开平仓模式</dd><dt>OKX 英文 / 字段</dt><dd><code>posSide</code>：net、long、short</dd><dt>本项目字段</dt><dd><code>position_side</code> ✅（BOTH / LONG / SHORT）</dd><dt>注解</dt><dd>OKX 的 <code>net</code> 对应币安 <code>BOTH</code>；本项目用币安的枚举名</dd></dl></article><article class="professional-record"><h3 id="pro-record-21">持仓量</h3><dl><dt>概念</dt><dd>持仓量</dd><dt>币安 中文</dt><dd>持仓数量</dd><dt>币安 英文 / 字段</dt><dd><code>positionAmt</code>（<strong>币的数量</strong>）</dd><dt>OKX 中文</dt><dd>持仓量</dd><dt>OKX 英文 / 字段</dt><dd><code>pos</code>（<strong>张数</strong>；net 模式正多负空）</dd><dt>本项目字段</dt><dd>💡 <code>position_qty</code></dd><dt>注解</dt><dd><strong>单位不同</strong>：币安是币，OKX 是张，落库前要统一，并配 <code>contract_value</code> 换算</dd></dl></article><article class="professional-record"><h3 id="pro-record-22">开仓均价</h3><dl><dt>概念</dt><dd>开仓均价</dd><dt>币安 中文</dt><dd>持仓成本价</dd><dt>币安 英文 / 字段</dt><dd><code>entryPrice</code></dd><dt>OKX 中文</dt><dd>成交量加权平均开仓价</dd><dt>OKX 英文 / 字段</dt><dd><code>avgPx</code></dd><dt>本项目字段</dt><dd>💡 <code>entry_price</code></dd><dt>注解</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-23">标记价格</h3><dl><dt>概念</dt><dd>标记价格</dd><dt>币安 中文</dt><dd>标记价格</dd><dt>币安 英文 / 字段</dt><dd><code>markPrice</code> / MARK_PRICE</dd><dt>OKX 中文</dt><dd>最新标记价格</dd><dt>OKX 英文 / 字段</dt><dd><code>markPx</code></dd><dt>本项目字段</dt><dd><code>mark_price</code> ✅</dd><dt>注解</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-24">强平价</h3><dl><dt>概念</dt><dd>强平价</dd><dt>币安 中文</dt><dd>强平价格</dd><dt>币安 英文 / 字段</dt><dd>公式为图片；API 字段本次未抓取</dd><dt>OKX 中文</dt><dd>预估强平价格</dd><dt>OKX 英文 / 字段</dt><dd><code>liqPx</code>（<strong>估算值</strong>）</dd><dt>本项目字段</dt><dd><code>liquidation_price</code> ✅</dd><dt>注解</dt><dd>OKX 官方明确是估算，实际会变</dd></dl></article><article class="professional-record"><h3 id="pro-record-25">初始保证金</h3><dl><dt>概念</dt><dd>初始保证金</dd><dt>币安 中文</dt><dd>起始保证金 / 初始保证金</dd><dt>币安 英文 / 字段</dt><dd><code>initialMargin</code> / <code>totalInitialMargin</code></dd><dt>OKX 中文</dt><dd>初始保证金要求</dd><dt>OKX 英文 / 字段</dt><dd><code>imr</code></dd><dt>本项目字段</dt><dd>💡 <code>initial_margin</code></dd><dt>注解</dt><dd>币安单位跟账户模式（USDT 或美元）；OKX <strong>一律 USD</strong>；逐仓持仓 OKX 返回<strong>空串</strong></dd></dl></article><article class="professional-record"><h3 id="pro-record-26">维持保证金</h3><dl><dt>概念</dt><dd>维持保证金</dd><dt>币安 中文</dt><dd>维持保证金</dd><dt>币安 英文 / 字段</dt><dd><code>maintMargin</code> / <code>totalMaintMargin</code></dd><dt>OKX 中文</dt><dd>维持保证金要求</dd><dt>OKX 英文 / 字段</dt><dd><code>mmr</code></dd><dt>本项目字段</dt><dd>💡 <code>maintenance_margin</code></dd><dt>注解</dt><dd>OKX 账户级 <code>mmr</code> 是「低于它开始强平」的<strong>阈值</strong></dd></dl></article><article class="professional-record"><h3 id="pro-record-27">维持保证金率</h3><dl><dt>概念</dt><dd>维持保证金率</dd><dt>币安 中文</dt><dd>维持保证金率 / 比率 / 费率</dd><dt>币安 英文 / 字段</dt><dd><code>maintMarginRatio</code>（档位里）、MMR</dd><dt>OKX 中文</dt><dd>维持保证金率（持仓级）</dd><dt>OKX 英文 / 字段</dt><dd><code>mgnRatio</code>（<strong>持仓级</strong>）</dd><dt>本项目字段</dt><dd>💡 <code>maintenance_margin_rate</code></dd><dt>注解</dt><dd>币安<strong>按档位</strong>给，OKX 这里是<strong>该仓位当前的值</strong></dd></dl></article><article class="professional-record"><h3 id="pro-record-28">账户保证金率</h3><dl><dt>概念</dt><dd>账户保证金率</dd><dt>币安 中文</dt><dd>—</dd><dt>币安 英文 / 字段</dt><dd>—（无同名字段）</dd><dt>OKX 中文</dt><dd>账户保证金率 = adjEq ÷ mmr</dd><dt>OKX 英文 / 字段</dt><dd><code>mgnRatio</code>（<strong>账户级</strong>）</dd><dt>本项目字段</dt><dd>💡 <code>margin_ratio</code></dd><dt>注解</dt><dd>⚠ OKX 同名字段<strong>账户级与持仓级含义不同</strong>，落库必须分开命名</dd></dl></article><article class="professional-record"><h3 id="pro-record-29">速算额</h3><dl><dt>概念</dt><dd>速算额</dd><dt>币安 中文</dt><dd>速算额 / 速算数 / 维持保证金额</dd><dt>币安 英文 / 字段</dt><dd><code>cum</code>（API）、<code>maintenance amount</code></dd><dt>OKX 中文</dt><dd>—（档位接口无此字段）</dd><dt>OKX 英文 / 字段</dt><dd><code>position-tiers</code> 返回里无速算额字段〔三方 SDK，非官方〕</dd><dt>本项目字段</dt><dd>💡 <code>maintenance_amount</code></dd><dt>注解</dt><dd><strong>模型差异</strong>：币安是累进 + 速算额；OKX 链上永续页写「当前 MMR 适用于整个仓位价值，维持保证金 = 仓位价值 × MMR」，<strong>普通永续是否同样规则本次未核实</strong>。不能假定两所公式同构</dd></dl></article><article class="professional-record"><h3 id="pro-record-30">阶梯 / 档位</h3><dl><dt>概念</dt><dd>阶梯 / 档位</dd><dt>币安 中文</dt><dd>分级 / 档位 / 杠杆分层</dd><dt>币安 英文 / 字段</dt><dd><code>bracket</code>、<code>notionalFloor</code>、<code>notionalCap</code></dd><dt>OKX 中文</dt><dd>仓位档位</dd><dt>OKX 英文 / 字段</dt><dd><code>position-tiers</code>：<code>tier</code>、<code>minSz</code>、<code>maxSz</code>、<code>mmr</code>、<code>imr</code>、<code>maxLever</code>、<code>optMgnFactor</code>、<code>quoteMaxLoan</code>、<code>baseMaxLoan</code>〔三方 SDK，非官方〕</dd><dt>本项目字段</dt><dd>💡 <code>margin_tier</code></dd><dt>注解</dt><dd>币安档位按<strong>名义价值</strong>上下限；OKX 档位按<strong>持仓量</strong> <code>minSz</code>~<code>maxSz</code>（单位是张还是币，随产品，本次未核实）。OKX 档位<strong>同时给 <code>imr</code> 和 <code>mmr</code></strong>，币安档位只给维持保证金率</dd></dl></article><article class="professional-record"><h3 id="pro-record-31">逐仓保证金</h3><dl><dt>概念</dt><dd>逐仓保证金</dd><dt>币安 中文</dt><dd>逐仓保证金 / 逐仓钱包余额</dd><dt>币安 英文 / 字段</dt><dd><code>isolatedMargin</code> / <code>isolatedWallet</code></dd><dt>OKX 中文</dt><dd>保证金余额（仅逐仓，可增减）</dd><dt>OKX 英文 / 字段</dt><dd><code>margin</code></dd><dt>本项目字段</dt><dd>💡 <code>isolated_margin</code></dd><dt>注解</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-32">名义价值</h3><dl><dt>概念</dt><dd>名义价值</dd><dt>币安 中文</dt><dd>持仓名义价值</dd><dt>币安 英文 / 字段</dt><dd><code>notional</code>（计价单位跟账户）</dd><dt>OKX 中文</dt><dd>持仓名义价值（USD，多空不轧差）</dd><dt>OKX 英文 / 字段</dt><dd><code>notionalUsd</code></dd><dt>本项目字段</dt><dd><code>notional_amount</code> ✅</dd><dt>注解</dt><dd>OKX 账户级<strong>多空不轧差</strong>，币安单仓口径，注意汇总方式</dd></dl></article><article class="professional-record"><h3 id="pro-record-33">未实现盈亏</h3><dl><dt>概念</dt><dd>未实现盈亏</dd><dt>币安 中文</dt><dd>未实现盈亏</dd><dt>币安 英文 / 字段</dt><dd><code>unrealizedProfit</code></dd><dt>OKX 中文</dt><dd>未实现盈亏</dd><dt>OKX 英文 / 字段</dt><dd><code>upl</code></dd><dt>本项目字段</dt><dd>💡 <code>unrealized_pnl</code></dd><dt>注解</dt><dd>OKX 按标记价格、以<strong>结算币</strong>计价</dd></dl></article><article class="professional-record"><h3 id="pro-record-34">未实现收益率</h3><dl><dt>概念</dt><dd>未实现收益率</dd><dt>币安 中文</dt><dd>—</dd><dt>币安 英文 / 字段</dt><dd>—（计算器页叫 ROI）</dd><dt>OKX 中文</dt><dd>未实现收益率</dd><dt>OKX 英文 / 字段</dt><dd><code>uplRatio</code></dd><dt>本项目字段</dt><dd>💡 <code>unrealized_pnl_ratio</code></dd><dt>注解</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-35">钱包余额</h3><dl><dt>概念</dt><dd>钱包余额</dd><dt>币安 中文</dt><dd>钱包余额</dd><dt>币安 英文 / 字段</dt><dd><code>walletBalance</code> / <code>balance</code></dd><dt>OKX 中文</dt><dd>币种余额</dd><dt>OKX 英文 / 字段</dt><dd><code>cashBal</code></dd><dt>本项目字段</dt><dd>💡 <code>wallet_balance</code></dd><dt>注解</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-36">可用余额</h3><dl><dt>概念</dt><dd>可用余额</dd><dt>币安 中文</dt><dd>可用余额</dd><dt>币安 英文 / 字段</dt><dd><code>availableBalance</code></dd><dt>OKX 中文</dt><dd>币种可用余额</dd><dt>OKX 英文 / 字段</dt><dd><code>availBal</code></dd><dt>本项目字段</dt><dd><code>available_balance</code> ✅</dd><dt>注解</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-37">冻结 / 占用</h3><dl><dt>概念</dt><dd>冻结 / 占用</dd><dt>币安 中文</dt><dd>—（用 <code>openOrderInitialMargin</code> 等拆分）</dd><dt>币安 英文 / 字段</dt><dd><code>positionInitialMargin</code> / <code>openOrderInitialMargin</code></dd><dt>OKX 中文</dt><dd>币种占用金额 / 挂单冻结数量</dd><dt>OKX 英文 / 字段</dt><dd><code>frozenBal</code> / <code>ordFrozen</code></dd><dt>本项目字段</dt><dd><code>frozen_balance</code> ✅</dd><dt>注解</dt><dd>两边拆法不同，币安按「持仓 / 挂单」拆，OKX 按「占用 / 挂单冻结」拆</dd></dl></article><article class="professional-record"><h3 id="pro-record-38">总权益</h3><dl><dt>概念</dt><dd>总权益</dd><dt>币安 中文</dt><dd>保证金余额</dd><dt>币安 英文 / 字段</dt><dd><code>marginBalance</code> / <code>totalMarginBalance</code></dd><dt>OKX 中文</dt><dd>总权益 / 调整后权益 / 可用保证金</dd><dt>OKX 英文 / 字段</dt><dd><code>totalEq</code> / <code>adjEq</code> / <code>availEq</code>（USD）；<code>eq</code>（分币种）</dd><dt>本项目字段</dt><dd>💡 <code>total_equity</code></dd><dt>注解</dt><dd>币安「保证金余额」与 OKX「权益」是否完全等价，本次<strong>没核实</strong>，不要直接互换</dd></dl></article><article class="professional-record"><h3 id="pro-record-39">累计资金费用</h3><dl><dt>概念</dt><dd>累计资金费用</dd><dt>币安 中文</dt><dd>—</dd><dt>币安 英文 / 字段</dt><dd>未抓取</dd><dt>OKX 中文</dt><dd>累计资金费用</dd><dt>OKX 英文 / 字段</dt><dd><code>fundingFee</code></dd><dt>本项目字段</dt><dd>💡 <code>funding_fee_amount</code></dd><dt>注解</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-40">累计手续费</h3><dl><dt>概念</dt><dd>累计手续费</dd><dt>币安 中文</dt><dd>—</dd><dt>币安 英文 / 字段</dt><dd>未抓取</dd><dt>OKX 中文</dt><dd>开仓以来累计手续费</dd><dt>OKX 英文 / 字段</dt><dd><code>fee</code>（<strong>正数 = 平台返佣，负数 = 平台扣除</strong>）</dd><dt>本项目字段</dt><dd><code>fee_amount</code> ✅</dd><dt>注解</dt><dd>⚠ OKX 符号约定与多数系统相反</dd></dl></article><article class="professional-record"><h3 id="pro-record-41">自动减仓</h3><dl><dt>概念</dt><dd>自动减仓</dd><dt>币安 中文</dt><dd>ADL 风险评级</dd><dt>币安 英文 / 字段</dt><dd>高 / 中 / 低（行情接口，约每半小时更新）</dd><dt>OKX 中文</dt><dd>ADL 指标</dd><dt>OKX 英文 / 字段</dt><dd><code>adl</code>（0–5，越大越优先被减）</dd><dt>本项目字段</dt><dd>💡 <code>adl_rank</code></dd><dt>注解</dt><dd><strong>一个是三档，一个是 0–5 数值</strong>，不能直接换算</dd></dl></article><article class="professional-record"><h3 id="pro-record-42">强平费率</h3><dl><dt>概念</dt><dd>强平费率</dd><dt>币安 中文</dt><dd>强平费率</dd><dt>币安 英文 / 字段</dt><dd><code>liquidationFee</code></dd><dt>OKX 中文</dt><dd>爆仓手续费</dd><dt>OKX 英文 / 字段</dt><dd>帮助中心公式：爆仓手续费 = 杠杆借币手续费 + 交割永续手续费 + 期权手续费；交割永续手续费 = 仓位价值 × 用户 taker 费率</dd><dt>本项目字段</dt><dd>💡 <code>liquidation_fee_rate</code></dd><dt>注解</dt><dd><strong>口径不同</strong>：币安是单一「强平费率」，OKX 是「按 taker 费率」且<strong>计入保证金率分母</strong>（见 15.6）</dd></dl></article></div></div>
<h4 id="professional-03-okx-post-apiv5tradeorder">0.3 订单（OKX 取自 <code>POST /api/v5/trade/order</code> 请求参数）</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="3"><article class="professional-record"><h3 id="pro-record-43">方向</h3><dl><dt>概念</dt><dd>方向</dd><dt>币安 中文</dt><dd>买入 / 卖出</dd><dt>币安 英文 / 字段</dt><dd><code>side</code>：BUY / SELL</dd><dt>OKX 中文 / 英文 / 字段</dt><dd>订单方向 <code>side</code>：buy / sell；持仓方向 <code>posSide</code>：long / short / net（开平仓模式必填 long 或 short）</dd><dt>本项目字段</dt><dd><code>order_side</code> ✅</dd><dt>注解</dt><dd>OKX 的开平靠 <code>side</code> + <code>posSide</code> 组合表达，币安靠 <code>side</code> + <code>positionSide</code> + <code>reduceOnly</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-44">订单类型</h3><dl><dt>概念</dt><dd>订单类型</dd><dt>币安 中文</dt><dd>限价 / 市价 / 止损限价 / 止损市价 / 止盈限价 / 止盈市价 / 跟踪止损</dd><dt>币安 英文 / 字段</dt><dd><code>type</code>：LIMIT、MARKET、STOP、STOP_MARKET、TAKE_PROFIT、TAKE_PROFIT_MARKET、TRAILING_STOP_MARKET</dd><dt>OKX 中文 / 英文 / 字段</dt><dd>订单类型 <code>ordType</code>：market、limit、post_only、fok、ioc、optimal_limit_ioc 等</dd><dt>本项目字段</dt><dd><code>order_type</code> ✅</dd><dt>注解</dt><dd><strong>OKX 把 Post-Only / FOK / IOC 放进 <code>ordType</code></strong>，币安放进 <code>timeInForce</code>；本项目用币安的拆法。止盈止损：OKX 在 <code>attachAlgoOrds</code> 里用 <code>tpTriggerPx</code> / <code>slTriggerPx</code> 附带，币安做成订单类型</dd></dl></article><article class="professional-record"><h3 id="pro-record-45">有效方式</h3><dl><dt>概念</dt><dd>有效方式</dd><dt>币安 中文</dt><dd>成交为止 / 立即成交否则撤销 / 全成否则撤销 / Post-Only / 到期自动撤销</dd><dt>币安 英文 / 字段</dt><dd><code>timeInForce</code>：GTC、IOC、FOK、GTX、GTD、RPI</dd><dt>OKX 中文 / 英文 / 字段</dt><dd>无独立字段，并入 <code>ordType</code>（post_only、fok、ioc）</dd><dt>本项目字段</dt><dd><code>time_in_force</code> ✅</dd><dt>注解</dt><dd>币安 <code>GTX</code> = OKX <code>post_only</code>；<code>GTD</code>、<code>RPI</code> 是币安的扩展；OKX 的 <code>optimal_limit_ioc</code> 币安无对应</dd></dl></article><article class="professional-record"><h3 id="pro-record-46">只减仓</h3><dl><dt>概念</dt><dd>只减仓</dd><dt>币安 中文</dt><dd>只减仓</dd><dt>币安 英文 / 字段</dt><dd><code>reduceOnly</code></dd><dt>OKX 中文 / 英文 / 字段</dt><dd>是否只减仓 <code>reduceOnly</code>（默认 false）</dd><dt>本项目字段</dt><dd>💡 <code>is_reduce_only</code></dd><dt>注解</dt><dd>币安双向持仓模式下<strong>不接受</strong>此参数</dd></dl></article><article class="professional-record"><h3 id="pro-record-47">客户端订单号</h3><dl><dt>概念</dt><dd>客户端订单号</dd><dt>币安 中文</dt><dd>用户自定义订单编号</dd><dt>币安 英文 / 字段</dt><dd><code>newClientOrderId</code> / <code>origClientOrderId</code></dd><dt>OKX 中文 / 英文 / 字段</dt><dd>客户自定义订单 ID <code>clOrdId</code>（1–32 位字母与数字组合）</dd><dt>本项目字段</dt><dd><code>client_order_id</code> ✅</dd><dt>注解</dt><dd>币安长度限制本次未抓取，OKX 仅字母数字</dd></dl></article><article class="professional-record"><h3 id="pro-record-48">触发价格类型</h3><dl><dt>概念</dt><dd>触发价格类型</dd><dt>币安 中文</dt><dd>条件价格触发类型</dd><dt>币安 英文 / 字段</dt><dd><code>workingType</code>：MARK_PRICE / CONTRACT_PRICE</dd><dt>OKX 中文 / 英文 / 字段</dt><dd>止盈止损触发价类型字段本次未抓取</dd><dt>本项目字段</dt><dd>💡 <code>trigger_price_type</code></dd><dt>注解</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-49">交易模式</h3><dl><dt>概念</dt><dd>交易模式</dd><dt>币安 中文</dt><dd>—（靠保证金类型设置）</dd><dt>币安 英文 / 字段</dt><dd><code>marginType</code> 类枚举未抓取</dd><dt>OKX 中文 / 英文 / 字段</dt><dd>交易模式 <code>tdMode</code>：cash、isolated、cross、spot_isolated</dd><dt>本项目字段</dt><dd>💡 <code>margin_mode</code></dd><dt>注解</dt><dd>OKX 下单时就带保证金模式，币安先设置账户的保证金类型</dd></dl></article><article class="professional-record"><h3 id="pro-record-50">下单数量</h3><dl><dt>概念</dt><dd>下单数量</dd><dt>币安 中文</dt><dd>数量</dd><dt>币安 英文 / 字段</dt><dd><code>quantity</code></dd><dt>OKX 中文 / 英文 / 字段</dt><dd>委托数量 <code>sz</code>（衍生品单位是<strong>张</strong>，币币市价单随 <code>tgtCcy</code>）</dd><dt>本项目字段</dt><dd><code>quantity</code> ✅</dd><dt>注解</dt><dd>单位陷阱同 0.4 注解 1</dd></dl></article><article class="professional-record"><h3 id="pro-record-51">币币市价单数量单位</h3><dl><dt>概念</dt><dd>币币市价单数量单位</dd><dt>币安 中文</dt><dd>—</dd><dt>币安 英文 / 字段</dt><dd>—</dd><dt>OKX 中文 / 英文 / 字段</dt><dd><code>tgtCcy</code>：base_ccy / quote_ccy</dd><dt>本项目字段</dt><dd>💡 <code>target_coin_type</code></dd><dt>注解</dt><dd>仅 OKX 币币有</dd></dl></article><article class="professional-record"><h3 id="pro-record-52">最大可下单数量</h3><dl><dt>概念</dt><dd>最大可下单数量</dd><dt>币安 中文</dt><dd>—</dd><dt>币安 英文 / 字段</dt><dd>未抓取</dd><dt>OKX 中文 / 英文 / 字段</dt><dd>最大可买卖 <code>maxBuy</code> / <code>maxSell</code>（<code>account/max-size</code>）</dd><dt>本项目字段</dt><dd>💡 <code>max_buy_qty</code> / <code>max_sell_qty</code></dd><dt>注解</dt><dd>OKX 单独有接口算上限，币安未抓取</dd></dl></article><article class="professional-record"><h3 id="pro-record-53">最大可用余额</h3><dl><dt>概念</dt><dd>最大可用余额</dd><dt>币安 中文</dt><dd>—</dd><dt>币安 英文 / 字段</dt><dd>未抓取</dd><dt>OKX 中文 / 英文 / 字段</dt><dd><code>availBuy</code> / <code>availSell</code>（<code>account/max-avail-size</code>）</dd><dt>本项目字段</dt><dd>💡 <code>avail_buy_balance</code> / <code>avail_sell_balance</code></dd><dt>注解</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-54">调整杠杆预估</h3><dl><dt>概念</dt><dd>调整杠杆预估</dd><dt>币安 中文</dt><dd>—</dd><dt>币安 英文 / 字段</dt><dd>未抓取</dd><dt>OKX 中文 / 英文 / 字段</dt><dd><code>estAvailTrans</code>、<code>estMgn</code>、<code>estLiqPx</code>、<code>estMaxAmt</code>、<code>maxLever</code>、<code>minLever</code>（<code>account/adjust-leverage-info</code>）</dd><dt>本项目字段</dt><dd>—</dd><dt>注解</dt><dd>调杠杆前的预估接口</dd></dl></article><article class="professional-record"><h3 id="pro-record-55">调整保证金</h3><dl><dt>概念</dt><dd>调整保证金</dd><dt>币安 中文</dt><dd>—</dd><dt>币安 英文 / 字段</dt><dd>未抓取</dd><dt>OKX 中文 / 英文 / 字段</dt><dd><code>type</code>：add / reduce、<code>amt</code>、<code>posSide</code>（<code>account/position/margin-balance</code>）</dd><dt>本项目字段</dt><dd>💡 <code>margin_adjust_type</code></dd><dt>注解</dt><dd>逐仓追加 / 减少保证金</dd></dl></article></div></div>
<h4 id="professional-04">0.4 注解</h4>
<ol>
<li><strong>单位陷阱（最大的坑）</strong>：币安 U 本位的数量是<strong>币</strong>，OKX 衍生品的数量是<strong>张</strong>。迁移或对接时要用 <code>contract_value</code> 换算：币量 = 张数 × <code>contract_value</code>（正向，OKX 文档公式）。</li>
<li><strong>同名不同义</strong>：OKX <code>mgnRatio</code> 账户级 = 账户保证金率，持仓级 = 维持保证金率（见 15.4）。币安「合约乘数」≈ OKX「合约面值」，<strong>≠</strong> OKX 的 <code>ctMult</code>。币安「期货」含永续，OKX FUTURES 不含永续。</li>
<li><strong>币种单位</strong>：币安账户级金额的计价单位取决于账户模式（单资产 = USDT，多资产 = 美元）；OKX 的 <code>imr</code> / <code>mmr</code> / <code>notionalUsd</code> 一律美元。</li>
<li><strong>符号约定</strong>：OKX 持仓 <code>fee</code> 正数是返佣，负数是扣除。</li>
<li><strong>空白不代表没有</strong>：OKX 官方文档单页被抓取工具截断，公共数据章节（公共 instruments、资金费率接口、档位、标记价、保险基金、强平单）拿不到官方正文。这部分改用<strong>三方 SDK 的字段定义</strong>和 OKX 帮助中心代替，已在表中标注「三方 SDK」。字段名可信，<strong>单位和精确语义以官方文档为准</strong>，落地前要补核。仍为空白的有：币安订单类字段（<code>marginType</code>、最大可下单量）、币安资金费率 / 标记价接口字段名、币安账户级强平相关字段。</li>
<li>字段名对应关系是<strong>语义对照</strong>，不是字段映射表；两家的取值精度、计价单位、更新时机可能不同，对接前要逐字段核对。</li>
<li>〔通识〕条目是我凭记忆填的，用之前需要对照官方文档。</li>
</ol>
<hr>
<h4 id="professional-1">1. 合约与产品类型</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="4"><article class="professional-record"><h3 id="pro-record-56">合约</h3><dl><dt>中文</dt><dd>合约</dd><dt>English</dt><dd>Contract</dd><dt>备注 / 别名</dt><dd>泛指衍生品合约；Derivatives</dd></dl></article><article class="professional-record"><h3 id="pro-record-57">衍生品</h3><dl><dt>中文</dt><dd>衍生品</dd><dt>English</dt><dd>Derivatives</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-58">现货</h3><dl><dt>中文</dt><dd>现货</dd><dt>English</dt><dd>Spot</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-59">永续合约</h3><dl><dt>中文</dt><dd>永续合约</dd><dt>English</dt><dd>Perpetual Contract / Perpetual Swap</dd><dt>备注 / 别名</dt><dd>缩写 PERP；OKX 称 <code>SWAP</code>，Binance / Bybit 称 <code>Perpetual</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-60">交割合约</h3><dl><dt>中文</dt><dd>交割合约</dd><dt>English</dt><dd>Delivery Futures / Expiry Futures</dd><dt>备注 / 别名</dt><dd>简称 Futures；OKX 称 <code>FUTURES</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-61">当周 / 次周</h3><dl><dt>中文</dt><dd>当周 / 次周</dd><dt>English</dt><dd>This Week / Next Week</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-62">当季 / 次季</h3><dl><dt>中文</dt><dd>当季 / 次季</dd><dt>English</dt><dd>Quarterly / Bi-Quarterly (Next Quarter)</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-63">正向合约 / U 本位合约</h3><dl><dt>中文</dt><dd>正向合约 / U 本位合约</dd><dt>English</dt><dd>Linear Contract / USDT-Margined (USDⓈ-M)</dd><dt>备注 / 别名</dt><dd>以稳定币计价并结算</dd></dl></article><article class="professional-record"><h3 id="pro-record-64">反向合约 / 币本位合约</h3><dl><dt>中文</dt><dd>反向合约 / 币本位合约</dd><dt>English</dt><dd>Inverse Contract / Coin-Margined (COIN-M)</dd><dt>备注 / 别名</dt><dd>以币本身作保证金并结算</dd></dl></article><article class="professional-record"><h3 id="pro-record-65">期权</h3><dl><dt>中文</dt><dd>期权</dd><dt>English</dt><dd>Options</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-66">看涨期权 / 看跌期权</h3><dl><dt>中文</dt><dd>看涨期权 / 看跌期权</dd><dt>English</dt><dd>Call Option / Put Option</dd><dt>备注 / 别名</dt><dd>缩写 C / P</dd></dl></article><article class="professional-record"><h3 id="pro-record-67">行权价</h3><dl><dt>中文</dt><dd>行权价</dd><dt>English</dt><dd>Strike Price</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-68">到期日</h3><dl><dt>中文</dt><dd>到期日</dd><dt>English</dt><dd>Expiry Date</dd><dt>备注 / 别名</dt><dd>字段 <code>expire_time</code> 为「计划到期时间」✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-69">杠杆代币</h3><dl><dt>中文</dt><dd>杠杆代币</dd><dt>English</dt><dd>Leveraged Token</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-70">模拟盘</h3><dl><dt>中文</dt><dd>模拟盘</dd><dt>English</dt><dd>Paper Trading / Demo Trading / Simulated Trading</dd><dt>备注 / 别名</dt><dd>各所叫法：OKX、Bybit 为 Demo Trading，Binance 为 Futures Testnet</dd></dl></article><article class="professional-record"><h3 id="pro-record-71">标的</h3><dl><dt>中文</dt><dd>标的</dd><dt>English</dt><dd>Underlying</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-72">基础币</h3><dl><dt>中文</dt><dd>基础币</dd><dt>English</dt><dd>Base Coin</dd><dt>备注 / 别名</dt><dd>字段 <code>base_coin</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-73">计价币</h3><dl><dt>中文</dt><dd>计价币</dd><dt>English</dt><dd>Quote Coin</dd><dt>备注 / 别名</dt><dd>字段 <code>quote_coin</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-74">保证金币</h3><dl><dt>中文</dt><dd>保证金币</dd><dt>English</dt><dd>Margin Coin</dd><dt>备注 / 别名</dt><dd>💡 <code>margin_coin</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-75">结算币</h3><dl><dt>中文</dt><dd>结算币</dd><dt>English</dt><dd>Settlement Coin</dd><dt>备注 / 别名</dt><dd>💡 <code>settle_coin</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-76">交易对</h3><dl><dt>中文</dt><dd>交易对</dd><dt>English</dt><dd>Trading Pair</dd><dt>备注 / 别名</dt><dd>规范统一字段名 <code>symbol</code> ✅（禁用 pair / instrument_id / market）</dd></dl></article><article class="professional-record"><h3 id="pro-record-77">合约代码 / 交易对代码</h3><dl><dt>中文</dt><dd>合约代码 / 交易对代码</dd><dt>English</dt><dd>Symbol</dd><dt>备注 / 别名</dt><dd><code>BTC-USDT</code> / <code>BTC-USDT-PERP</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-78">合约面值 / 单张合约价值 / 单张价值</h3><dl><dt>中文</dt><dd>合约面值 / 单张合约价值 / 单张价值</dd><dt>English</dt><dd>Contract Value（OKX <code>ctVal</code>）；Face Value</dd><dt>备注 / 别名</dt><dd>✅ <strong>定名 <code>contract_value</code></strong>（用户决定，参考 OKX）；币种见 <code>contract_value_coin</code>（OKX <code>ctValCcy</code>）</dd></dl></article><article class="professional-record"><h3 id="pro-record-79">合约乘数</h3><dl><dt>中文</dt><dd>合约乘数</dd><dt>English</dt><dd>Contract Multiplier（OKX <code>ctMult</code>）</dd><dt>备注 / 别名</dt><dd>💡 <code>contract_multiplier</code>，<strong>与 <code>contract_value</code> 不是同一个东西</strong>，见第 15 节</dd></dl></article><article class="professional-record"><h3 id="pro-record-80">张</h3><dl><dt>中文</dt><dd>张</dd><dt>English</dt><dd>Contract (unit) / Lot</dd><dt>备注 / 别名</dt><dd>以「张」为单位下单时；Lot 另指最小交易手数</dd></dl></article><article class="professional-record"><h3 id="pro-record-81">上线 / 下架</h3><dl><dt>中文</dt><dd>上线 / 下架</dd><dt>English</dt><dd>Listing / Delisting</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-82">交易状态</h3><dl><dt>中文</dt><dd>交易状态</dd><dt>English</dt><dd>Trading Status</dd><dt>备注 / 别名</dt><dd>例：Pending / Trading / Suspended / Settling / Delisted</dd></dl></article><article class="professional-record"><h3 id="pro-record-83">暂停交易</h3><dl><dt>中文</dt><dd>暂停交易</dd><dt>English</dt><dd>Suspended / Halted</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-84">结算中</h3><dl><dt>中文</dt><dd>结算中</dd><dt>English</dt><dd>Settling</dd><dt>备注 / 别名</dt><dd></dd></dl></article></div></div>
<hr>
<h4 id="professional-2">2. 订单</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="5"><article class="professional-record"><h3 id="pro-record-85">委托 / 订单</h3><dl><dt>中文</dt><dd>委托 / 订单</dd><dt>English</dt><dd>Order</dd><dt>备注 / 别名</dt><dd>订单自身 ID 字段 <code>oid</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-86">客户端订单号</h3><dl><dt>中文</dt><dd>客户端订单号</dd><dt>English</dt><dd>Client Order ID</dd><dt>备注 / 别名</dt><dd><code>client_order_id</code> ✅（幂等键）</dd></dl></article><article class="professional-record"><h3 id="pro-record-87">买入 / 卖出</h3><dl><dt>中文</dt><dd>买入 / 卖出</dd><dt>English</dt><dd>Buy / Sell</dd><dt>备注 / 别名</dt><dd><code>order_side</code>：BUY=1 / SELL=2 ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-88">开多</h3><dl><dt>中文</dt><dd>开多</dd><dt>English</dt><dd>Open Long</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-89">开空</h3><dl><dt>中文</dt><dd>开空</dd><dt>English</dt><dd>Open Short</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-90">平多</h3><dl><dt>中文</dt><dd>平多</dd><dt>English</dt><dd>Close Long</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-91">平空</h3><dl><dt>中文</dt><dd>平空</dd><dt>English</dt><dd>Close Short</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-92">限价单</h3><dl><dt>中文</dt><dd>限价单</dd><dt>English</dt><dd>Limit Order</dd><dt>备注 / 别名</dt><dd><code>order_type</code> ✅ LIMIT</dd></dl></article><article class="professional-record"><h3 id="pro-record-93">市价单</h3><dl><dt>中文</dt><dd>市价单</dd><dt>English</dt><dd>Market Order</dd><dt>备注 / 别名</dt><dd>MARKET ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-94">止损单</h3><dl><dt>中文</dt><dd>止损单</dd><dt>English</dt><dd>Stop Loss (SL)</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-95">止盈单</h3><dl><dt>中文</dt><dd>止盈单</dd><dt>English</dt><dd>Take Profit (TP)</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-96">止损限价单</h3><dl><dt>中文</dt><dd>止损限价单</dd><dt>English</dt><dd>Stop-Limit Order</dd><dt>备注 / 别名</dt><dd>STOP_LIMIT ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-97">止损市价单</h3><dl><dt>中文</dt><dd>止损市价单</dd><dt>English</dt><dd>Stop-Market Order</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-98">条件单 / 计划委托</h3><dl><dt>中文</dt><dd>条件单 / 计划委托</dd><dt>English</dt><dd>Conditional Order / Trigger Order</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-99">触发价</h3><dl><dt>中文</dt><dd>触发价</dd><dt>English</dt><dd>Trigger Price</dd><dt>备注 / 别名</dt><dd>💡 <code>trigger_price</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-100">触发价类型</h3><dl><dt>中文</dt><dd>触发价类型</dd><dt>English</dt><dd>Trigger Price Type</dd><dt>备注 / 别名</dt><dd>最新价 / 标记价 / 指数价（Last / Mark / Index）</dd></dl></article><article class="professional-record"><h3 id="pro-record-101">追踪委托</h3><dl><dt>中文</dt><dd>追踪委托</dd><dt>English</dt><dd>Trailing Stop</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-102">回调幅度</h3><dl><dt>中文</dt><dd>回调幅度</dd><dt>English</dt><dd>Callback Rate</dd><dt>备注 / 别名</dt><dd>追踪委托使用</dd></dl></article><article class="professional-record"><h3 id="pro-record-103">冰山委托</h3><dl><dt>中文</dt><dd>冰山委托</dd><dt>English</dt><dd>Iceberg Order</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-104">时间加权委托</h3><dl><dt>中文</dt><dd>时间加权委托</dd><dt>English</dt><dd>TWAP (Time-Weighted Average Price)</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-105">一取消一</h3><dl><dt>中文</dt><dd>一取消一</dd><dt>English</dt><dd>OCO (One-Cancels-the-Other)</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-106">只做 Maker</h3><dl><dt>中文</dt><dd>只做 Maker</dd><dt>English</dt><dd>Post-Only</dd><dt>备注 / 别名</dt><dd>对应 <code>time_in_force</code> GTX ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-107">一直有效</h3><dl><dt>中文</dt><dd>一直有效</dd><dt>English</dt><dd>GTC (Good-Til-Canceled)</dd><dt>备注 / 别名</dt><dd>✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-108">立即成交否则撤销</h3><dl><dt>中文</dt><dd>立即成交否则撤销</dd><dt>English</dt><dd>IOC (Immediate-Or-Cancel)</dd><dt>备注 / 别名</dt><dd>✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-109">全部成交否则撤销</h3><dl><dt>中文</dt><dd>全部成交否则撤销</dd><dt>English</dt><dd>FOK (Fill-Or-Kill)</dd><dt>备注 / 别名</dt><dd>✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-110">只减仓</h3><dl><dt>中文</dt><dd>只减仓</dd><dt>English</dt><dd>Reduce-Only</dd><dt>备注 / 别名</dt><dd>💡 <code>is_reduce_only</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-111">平仓单</h3><dl><dt>中文</dt><dd>平仓单</dd><dt>English</dt><dd>Close-Position Order</dd><dt>备注 / 别名</dt><dd>💡 <code>is_close_position</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-112">生效时间策略</h3><dl><dt>中文</dt><dd>生效时间策略</dd><dt>English</dt><dd>Time in Force</dd><dt>备注 / 别名</dt><dd><code>time_in_force</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-113">撤单</h3><dl><dt>中文</dt><dd>撤单</dd><dt>English</dt><dd>Cancel Order</dd><dt>备注 / 别名</dt><dd>状态拼写用美式 <code>canceled</code>（单 l）✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-114">改单</h3><dl><dt>中文</dt><dd>改单</dd><dt>English</dt><dd>Amend Order</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-115">全部撤单</h3><dl><dt>中文</dt><dd>全部撤单</dd><dt>English</dt><dd>Cancel All Orders</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-116">部分成交</h3><dl><dt>中文</dt><dd>部分成交</dd><dt>English</dt><dd>Partially Filled</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-117">全部成交</h3><dl><dt>中文</dt><dd>全部成交</dd><dt>English</dt><dd>Filled</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-118">已拒绝</h3><dl><dt>中文</dt><dd>已拒绝</dd><dt>English</dt><dd>Rejected</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-119">已过期</h3><dl><dt>中文</dt><dd>已过期</dd><dt>English</dt><dd>Expired</dd><dt>备注 / 别名</dt><dd><code>expired_time</code>（已过期事实）与 <code>expire_time</code>（计划）区分 ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-120">委托数量</h3><dl><dt>中文</dt><dd>委托数量</dd><dt>English</dt><dd>Quantity / Order Qty</dd><dt>备注 / 别名</dt><dd><code>quantity</code> / <code>original_qty</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-121">已成交数量</h3><dl><dt>中文</dt><dd>已成交数量</dd><dt>English</dt><dd>Filled Qty</dd><dt>备注 / 别名</dt><dd><code>filled_qty</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-122">剩余数量</h3><dl><dt>中文</dt><dd>剩余数量</dd><dt>English</dt><dd>Remaining Qty</dd><dt>备注 / 别名</dt><dd><code>remaining_qty</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-123">成交均价</h3><dl><dt>中文</dt><dd>成交均价</dd><dt>English</dt><dd>Average Price / Avg Fill Price</dd><dt>备注 / 别名</dt><dd><code>avg_price</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-124">委托价格</h3><dl><dt>中文</dt><dd>委托价格</dd><dt>English</dt><dd>Order Price</dd><dt>备注 / 别名</dt><dd><code>price</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-125">成交 / 成交明细</h3><dl><dt>中文</dt><dd>成交 / 成交明细</dd><dt>English</dt><dd>Trade / Fill</dd><dt>备注 / 别名</dt><dd>成交流水 ID <code>trade_fill_oid</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-126">吃单方 / 挂单方</h3><dl><dt>中文</dt><dd>吃单方 / 挂单方</dd><dt>English</dt><dd>Taker / Maker</dd><dt>备注 / 别名</dt><dd><code>taker_order_oid</code> / <code>maker_order_oid</code> ✅</dd></dl></article></div></div>
<hr>
<h4 id="professional-3">3. 仓位与保证金</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="6"><article class="professional-record"><h3 id="pro-record-127">仓位 / 持仓</h3><dl><dt>中文</dt><dd>仓位 / 持仓</dd><dt>English</dt><dd>Position</dd><dt>备注 / 别名</dt><dd><code>position_oid</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-128">多头 / 空头</h3><dl><dt>中文</dt><dd>多头 / 空头</dd><dt>English</dt><dd>Long / Short</dd><dt>备注 / 别名</dt><dd><code>position_side</code>：LONG=1 / SHORT=2 / BOTH=3 ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-129">单向持仓模式</h3><dl><dt>中文</dt><dd>单向持仓模式</dd><dt>English</dt><dd>One-Way Mode</dd><dt>备注 / 别名</dt><dd><code>position_side</code> = BOTH</dd></dl></article><article class="professional-record"><h3 id="pro-record-130">双向持仓模式</h3><dl><dt>中文</dt><dd>双向持仓模式</dd><dt>English</dt><dd>Hedge Mode</dd><dt>备注 / 别名</dt><dd>同标的可同时持多、空</dd></dl></article><article class="professional-record"><h3 id="pro-record-131">持仓量</h3><dl><dt>中文</dt><dd>持仓量</dd><dt>English</dt><dd>Open Interest (OI)</dd><dt>备注 / 别名</dt><dd>全市场未平仓合约总量</dd></dl></article><article class="professional-record"><h3 id="pro-record-132">持仓数量</h3><dl><dt>中文</dt><dd>持仓数量</dd><dt>English</dt><dd>Position Size / Position Qty</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-133">开仓均价</h3><dl><dt>中文</dt><dd>开仓均价</dd><dt>English</dt><dd>Entry Price / Average Entry Price</dd><dt>备注 / 别名</dt><dd>💡 <code>entry_price</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-134">全仓保证金</h3><dl><dt>中文</dt><dd>全仓保证金</dd><dt>English</dt><dd>Cross Margin</dd><dt>备注 / 别名</dt><dd>💡 <code>margin_mode</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-135">逐仓保证金</h3><dl><dt>中文</dt><dd>逐仓保证金</dd><dt>English</dt><dd>Isolated Margin</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-136">组合保证金</h3><dl><dt>中文</dt><dd>组合保证金</dd><dt>English</dt><dd>Portfolio Margin</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-137">杠杆 / 杠杆倍数</h3><dl><dt>中文</dt><dd>杠杆 / 杠杆倍数</dd><dt>English</dt><dd>Leverage</dd><dt>备注 / 别名</dt><dd>💡 <code>leverage</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-138">调整杠杆</h3><dl><dt>中文</dt><dd>调整杠杆</dd><dt>English</dt><dd>Adjust Leverage</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-139">保证金</h3><dl><dt>中文</dt><dd>保证金</dd><dt>English</dt><dd>Margin</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-140">初始保证金</h3><dl><dt>中文</dt><dd>初始保证金</dd><dt>English</dt><dd>Initial Margin (IM)</dd><dt>备注 / 别名</dt><dd>💡 <code>initial_margin</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-141">维持保证金</h3><dl><dt>中文</dt><dd>维持保证金</dd><dt>English</dt><dd>Maintenance Margin (MM)</dd><dt>备注 / 别名</dt><dd>💡 <code>maintenance_margin</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-142">初始保证金率</h3><dl><dt>中文</dt><dd>初始保证金率</dd><dt>English</dt><dd>Initial Margin Rate (IMR)</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-143">维持保证金率</h3><dl><dt>中文</dt><dd>维持保证金率</dd><dt>English</dt><dd>Maintenance Margin Rate (MMR)</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-144">保证金率</h3><dl><dt>中文</dt><dd>保证金率</dd><dt>English</dt><dd>Margin Ratio</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-145">保证金余额</h3><dl><dt>中文</dt><dd>保证金余额</dd><dt>English</dt><dd>Margin Balance</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-146">可用保证金</h3><dl><dt>中文</dt><dd>可用保证金</dd><dt>English</dt><dd>Available Margin</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-147">占用保证金</h3><dl><dt>中文</dt><dd>占用保证金</dd><dt>English</dt><dd>Used Margin / Occupied Margin</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-148">追加保证金</h3><dl><dt>中文</dt><dd>追加保证金</dd><dt>English</dt><dd>Add Margin</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-149">减少保证金</h3><dl><dt>中文</dt><dd>减少保证金</dd><dt>English</dt><dd>Reduce Margin / Remove Margin</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-150">保证金追缴</h3><dl><dt>中文</dt><dd>保证金追缴</dd><dt>English</dt><dd>Margin Call</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-151">名义价值</h3><dl><dt>中文</dt><dd>名义价值</dd><dt>English</dt><dd>Notional Value</dd><dt>备注 / 别名</dt><dd><code>notional_amount</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-152">风险限额 / 档位</h3><dl><dt>中文</dt><dd>风险限额 / 档位</dd><dt>English</dt><dd>Risk Limit / Tier</dd><dt>备注 / 别名</dt><dd>档位表：Tiered Margin Table</dd></dl></article><article class="professional-record"><h3 id="pro-record-153">最大杠杆</h3><dl><dt>中文</dt><dd>最大杠杆</dd><dt>English</dt><dd>Max Leverage</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-154">未实现盈亏</h3><dl><dt>中文</dt><dd>未实现盈亏</dd><dt>English</dt><dd>Unrealized PnL (uPnL)</dd><dt>备注 / 别名</dt><dd>PnL = Profit and Loss</dd></dl></article><article class="professional-record"><h3 id="pro-record-155">已实现盈亏</h3><dl><dt>中文</dt><dd>已实现盈亏</dd><dt>English</dt><dd>Realized PnL</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-156">收益率</h3><dl><dt>中文</dt><dd>收益率</dd><dt>English</dt><dd>ROE (Return on Equity) / ROI</dd><dt>备注 / 别名</dt><dd>合约页面常用 ROE</dd></dl></article><article class="professional-record"><h3 id="pro-record-157">仓位交换 / 仓位互换</h3><dl><dt>中文</dt><dd>仓位交换 / 仓位互换</dd><dt>English</dt><dd>Position Swap</dd><dt>备注 / 别名</dt><dd>项目内特定定义，见 <code>axon-admin</code> 记忆，非行业通用词</dd></dl></article></div></div>
<hr>
<h4 id="professional-4">4. 价格与行情</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="7"><article class="professional-record"><h3 id="pro-record-158">最新价</h3><dl><dt>中文</dt><dd>最新价</dd><dt>English</dt><dd>Last Price</dd><dt>备注 / 别名</dt><dd><code>last_price</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-159">标记价格</h3><dl><dt>中文</dt><dd>标记价格</dd><dt>English</dt><dd>Mark Price</dd><dt>备注 / 别名</dt><dd><code>mark_price</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-160">指数价格</h3><dl><dt>中文</dt><dd>指数价格</dd><dt>English</dt><dd>Index Price</dd><dt>备注 / 别名</dt><dd><code>index_price</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-161">结算价</h3><dl><dt>中文</dt><dd>结算价</dd><dt>English</dt><dd>Settlement Price</dd><dt>备注 / 别名</dt><dd><code>settle_price</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-162">交割价</h3><dl><dt>中文</dt><dd>交割价</dd><dt>English</dt><dd>Delivery Price</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-163">强平价</h3><dl><dt>中文</dt><dd>强平价</dd><dt>English</dt><dd>Liquidation Price</dd><dt>备注 / 别名</dt><dd><code>liquidation_price</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-164">破产价</h3><dl><dt>中文</dt><dd>破产价</dd><dt>English</dt><dd>Bankruptcy Price</dd><dt>备注 / 别名</dt><dd><code>bankruptcy_price</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-165">开盘价 / 收盘价</h3><dl><dt>中文</dt><dd>开盘价 / 收盘价</dd><dt>English</dt><dd>Open Price / Close Price</dd><dt>备注 / 别名</dt><dd><code>open_price</code> / <code>close_price</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-166">最高价 / 最低价</h3><dl><dt>中文</dt><dd>最高价 / 最低价</dd><dt>English</dt><dd>High Price / Low Price</dd><dt>备注 / 别名</dt><dd><code>high_price</code> / <code>low_price</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-167">溢价指数</h3><dl><dt>中文</dt><dd>溢价指数</dd><dt>English</dt><dd>Premium Index</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-168">基差</h3><dl><dt>中文</dt><dd>基差</dd><dt>English</dt><dd>Basis</dd><dt>备注 / 别名</dt><dd>期货价 − 现货（指数）价</dd></dl></article><article class="professional-record"><h3 id="pro-record-169">买一价 / 卖一价</h3><dl><dt>中文</dt><dd>买一价 / 卖一价</dd><dt>English</dt><dd>Best Bid / Best Ask</dd><dt>备注 / 别名</dt><dd>盘口最优价</dd></dl></article><article class="professional-record"><h3 id="pro-record-170">买卖价差</h3><dl><dt>中文</dt><dd>买卖价差</dd><dt>English</dt><dd>Spread</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-171">中间价</h3><dl><dt>中文</dt><dd>中间价</dd><dt>English</dt><dd>Mid Price</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-172">盘口</h3><dl><dt>中文</dt><dd>盘口</dd><dt>English</dt><dd>Order Book</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-173">深度</h3><dl><dt>中文</dt><dd>深度</dd><dt>English</dt><dd>Depth</dd><dt>备注 / 别名</dt><dd>档位 Level</dd></dl></article><article class="professional-record"><h3 id="pro-record-174">逐笔成交</h3><dl><dt>中文</dt><dd>逐笔成交</dd><dt>English</dt><dd>Trade Tick / Recent Trades</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-175">K 线</h3><dl><dt>中文</dt><dd>K 线</dd><dt>English</dt><dd>Candlestick / Kline</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-176">开高低收</h3><dl><dt>中文</dt><dd>开高低收</dd><dt>English</dt><dd>OHLC</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-177">成交量</h3><dl><dt>中文</dt><dd>成交量</dd><dt>English</dt><dd>Volume</dd><dt>备注 / 别名</dt><dd>基础币计量</dd></dl></article><article class="professional-record"><h3 id="pro-record-178">成交额</h3><dl><dt>中文</dt><dd>成交额</dd><dt>English</dt><dd>Turnover / Quote Volume</dd><dt>备注 / 别名</dt><dd>计价币计量</dd></dl></article><article class="professional-record"><h3 id="pro-record-179">24 小时涨跌幅</h3><dl><dt>中文</dt><dd>24 小时涨跌幅</dd><dt>English</dt><dd>24h Change (Percent)</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-180">最小价格变动</h3><dl><dt>中文</dt><dd>最小价格变动</dd><dt>English</dt><dd>Tick Size</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-181">最小下单量 / 数量步长</h3><dl><dt>中文</dt><dd>最小下单量 / 数量步长</dd><dt>English</dt><dd>Min Order Qty / Step Size (Lot Size)</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-182">最小名义价值</h3><dl><dt>中文</dt><dd>最小名义价值</dd><dt>English</dt><dd>Min Notional</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-183">价格保护 / 价格笼子</h3><dl><dt>中文</dt><dd>价格保护 / 价格笼子</dd><dt>English</dt><dd>Price Protection / Price Band</dd><dt>备注 / 别名</dt><dd>限制委托价偏离标记价</dd></dl></article><article class="professional-record"><h3 id="pro-record-184">滑点</h3><dl><dt>中文</dt><dd>滑点</dd><dt>English</dt><dd>Slippage</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-185">行情快照</h3><dl><dt>中文</dt><dd>行情快照</dd><dt>English</dt><dd>Snapshot</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-186">增量更新</h3><dl><dt>中文</dt><dd>增量更新</dd><dt>English</dt><dd>Incremental Update / Delta</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-187">订阅 / 推送</h3><dl><dt>中文</dt><dd>订阅 / 推送</dd><dt>English</dt><dd>Subscribe / Push (Stream)</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-188">心跳</h3><dl><dt>中文</dt><dd>心跳</dd><dt>English</dt><dd>Heartbeat</dd><dt>备注 / 别名</dt><dd></dd></dl></article></div></div>
<hr>
<h4 id="professional-5">5. 资金费率</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="8"><article class="professional-record"><h3 id="pro-record-189">资金费率</h3><dl><dt>中文</dt><dd>资金费率</dd><dt>English</dt><dd>Funding Rate</dd><dt>备注 / 别名</dt><dd><code>funding_rate</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-190">资金费 / 资金费用</h3><dl><dt>中文</dt><dd>资金费 / 资金费用</dd><dt>English</dt><dd>Funding Fee / Funding Payment</dd><dt>备注 / 别名</dt><dd>多空之间互付，非平台收入</dd></dl></article><article class="professional-record"><h3 id="pro-record-191">资金费率结算间隔</h3><dl><dt>中文</dt><dd>资金费率结算间隔</dd><dt>English</dt><dd>Funding Interval</dd><dt>备注 / 别名</dt><dd>常见 8 小时，各所及各合约可能不同</dd></dl></article><article class="professional-record"><h3 id="pro-record-192">预测资金费率</h3><dl><dt>中文</dt><dd>预测资金费率</dd><dt>English</dt><dd>Predicted Funding Rate</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-193">资金费率上下限</h3><dl><dt>中文</dt><dd>资金费率上下限</dd><dt>English</dt><dd>Funding Rate Cap / Floor</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-194">利率</h3><dl><dt>中文</dt><dd>利率</dd><dt>English</dt><dd>Interest Rate</dd><dt>备注 / 别名</dt><dd><code>interest_rate</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-195">溢价</h3><dl><dt>中文</dt><dd>溢价</dd><dt>English</dt><dd>Premium</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-196">资金费时间</h3><dl><dt>中文</dt><dd>资金费时间</dd><dt>English</dt><dd>Funding Time</dd><dt>备注 / 别名</dt><dd>💡 <code>funding_time</code>（毫秒，遵循 <code>_time</code> 后缀）</dd></dl></article></div></div>
<hr>
<h4 id="professional-6">6. 风控与强平</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="9"><article class="professional-record"><h3 id="pro-record-197">强制平仓 / 强平</h3><dl><dt>中文</dt><dd>强制平仓 / 强平</dd><dt>English</dt><dd>Liquidation</dd><dt>备注 / 别名</dt><dd><code>liquidation_oid</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-198">爆仓</h3><dl><dt>中文</dt><dd>爆仓</dd><dt>English</dt><dd>Blowout / Liquidated</dd><dt>备注 / 别名</dt><dd>口语，文档统一用 Liquidation</dd></dl></article><article class="professional-record"><h3 id="pro-record-199">部分强平</h3><dl><dt>中文</dt><dd>部分强平</dd><dt>English</dt><dd>Partial Liquidation</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-200">全部强平</h3><dl><dt>中文</dt><dd>全部强平</dd><dt>English</dt><dd>Full Liquidation</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-201">强平手续费</h3><dl><dt>中文</dt><dd>强平手续费</dd><dt>English</dt><dd>Liquidation Fee</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-202">破产 / 穿仓</h3><dl><dt>中文</dt><dd>破产 / 穿仓</dd><dt>English</dt><dd>Bankruptcy / Negative Equity</dd><dt>备注 / 别名</dt><dd>亏损超出保证金</dd></dl></article><article class="professional-record"><h3 id="pro-record-203">穿仓损失</h3><dl><dt>中文</dt><dd>穿仓损失</dd><dt>English</dt><dd>Bankruptcy Loss</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-204">保险基金</h3><dl><dt>中文</dt><dd>保险基金</dd><dt>English</dt><dd>Insurance Fund</dd><dt>备注 / 别名</dt><dd>弥补穿仓损失</dd></dl></article><article class="professional-record"><h3 id="pro-record-205">自动减仓</h3><dl><dt>中文</dt><dd>自动减仓</dd><dt>English</dt><dd>ADL (Auto-Deleveraging)</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-206">ADL 排名 / 指示灯</h3><dl><dt>中文</dt><dd>ADL 排名 / 指示灯</dd><dt>English</dt><dd>ADL Ranking / Indicator</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-207">风险率</h3><dl><dt>中文</dt><dd>风险率</dd><dt>English</dt><dd>Risk Ratio</dd><dt>备注 / 别名</dt><dd>各所定义不同，使用前须固定公式</dd></dl></article><article class="professional-record"><h3 id="pro-record-208">熔断</h3><dl><dt>中文</dt><dd>熔断</dd><dt>English</dt><dd>Circuit Breaker</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-209">限仓</h3><dl><dt>中文</dt><dd>限仓</dd><dt>English</dt><dd>Position Limit</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-210">限频</h3><dl><dt>中文</dt><dd>限频</dd><dt>English</dt><dd>Rate Limit</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-211">风控</h3><dl><dt>中文</dt><dd>风控</dd><dt>English</dt><dd>Risk Control / Risk Management</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-212">风险评分</h3><dl><dt>中文</dt><dd>风险评分</dd><dt>English</dt><dd>Risk Score</dd><dt>备注 / 别名</dt><dd><code>risk_score</code> ✅</dd></dl></article></div></div>
<hr>
<h4 id="professional-7">7. 费用与返佣</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="10"><article class="professional-record"><h3 id="pro-record-213">手续费</h3><dl><dt>中文</dt><dd>手续费</dd><dt>English</dt><dd>Fee / Trading Fee</dd><dt>备注 / 别名</dt><dd><code>fee_amount</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-214">挂单（做市）</h3><dl><dt>中文</dt><dd>挂单（做市）</dd><dt>English</dt><dd>Maker</dd><dt>备注 / 别名</dt><dd>增加订单簿流动性</dd></dl></article><article class="professional-record"><h3 id="pro-record-215">吃单（接盘）</h3><dl><dt>中文</dt><dd>吃单（接盘）</dd><dt>English</dt><dd>Taker</dd><dt>备注 / 别名</dt><dd>消耗订单簿流动性</dd></dl></article><article class="professional-record"><h3 id="pro-record-216">Maker 费率 / Taker 费率</h3><dl><dt>中文</dt><dd>Maker 费率 / Taker 费率</dd><dt>English</dt><dd>Maker Fee Rate / Taker Fee Rate</dd><dt>备注 / 别名</dt><dd><code>maker_rate</code> / <code>taker_rate</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-217">返佣</h3><dl><dt>中文</dt><dd>返佣</dd><dt>English</dt><dd>Rebate</dd><dt>备注 / 别名</dt><dd><code>rebate_amount</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-218">手续费等级</h3><dl><dt>中文</dt><dd>手续费等级</dd><dt>English</dt><dd>Fee Tier / VIP Level</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-219">手续费抵扣</h3><dl><dt>中文</dt><dd>手续费抵扣</dd><dt>English</dt><dd>Fee Discount</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-220">手续费币种</h3><dl><dt>中文</dt><dd>手续费币种</dd><dt>English</dt><dd>Fee Coin</dd><dt>备注 / 别名</dt><dd>💡 <code>fee_coin</code></dd></dl></article></div></div>
<hr>
<h4 id="professional-8">8. 账户与资产</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="11"><article class="professional-record"><h3 id="pro-record-221">账户</h3><dl><dt>中文</dt><dd>账户</dd><dt>English</dt><dd>Account</dd><dt>备注 / 别名</dt><dd><code>uid</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-222">主账户 / 子账户</h3><dl><dt>中文</dt><dd>主账户 / 子账户</dd><dt>English</dt><dd>Main Account / Sub-Account</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-223">合约账户</h3><dl><dt>中文</dt><dd>合约账户</dd><dt>English</dt><dd>Futures Account / Derivatives Account</dd><dt>备注 / 别名</dt><dd><code>account_type</code> FUTURES=2 ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-224">现货账户</h3><dl><dt>中文</dt><dd>现货账户</dd><dt>English</dt><dd>Spot Account</dd><dt>备注 / 别名</dt><dd>SPOT=1 ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-225">钱包</h3><dl><dt>中文</dt><dd>钱包</dd><dt>English</dt><dd>Wallet</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-226">币种</h3><dl><dt>中文</dt><dd>币种</dd><dt>English</dt><dd>Coin</dd><dt>备注 / 别名</dt><dd>字段 <code>coin</code> ✅（禁用 asset / token）</dd></dl></article><article class="professional-record"><h3 id="pro-record-227">法币</h3><dl><dt>中文</dt><dd>法币</dd><dt>English</dt><dd>Fiat Currency</dd><dt>备注 / 别名</dt><dd>字段 <code>currency</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-228">账户权益</h3><dl><dt>中文</dt><dd>账户权益</dd><dt>English</dt><dd>Equity / Account Equity</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-229">总余额</h3><dl><dt>中文</dt><dd>总余额</dd><dt>English</dt><dd>Total Balance</dd><dt>备注 / 别名</dt><dd><code>total_balance</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-230">可用余额</h3><dl><dt>中文</dt><dd>可用余额</dd><dt>English</dt><dd>Available Balance</dd><dt>备注 / 别名</dt><dd><code>available_balance</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-231">冻结余额</h3><dl><dt>中文</dt><dd>冻结余额</dd><dt>English</dt><dd>Frozen Balance / Locked Balance</dd><dt>备注 / 别名</dt><dd><code>frozen_balance</code> / <code>locked_balance</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-232">划转</h3><dl><dt>中文</dt><dd>划转</dd><dt>English</dt><dd>Transfer</dd><dt>备注 / 别名</dt><dd><code>transfer_amount</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-233">资金流水 / 账单</h3><dl><dt>中文</dt><dd>资金流水 / 账单</dd><dt>English</dt><dd>Ledger / Bill / Statement</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-234">资金冻结 / 释放</h3><dl><dt>中文</dt><dd>资金冻结 / 释放</dd><dt>English</dt><dd>Freeze / Release</dd><dt>备注 / 别名</dt><dd><code>freeze_amount</code> / <code>release_amount</code> ✅，流水 <code>freeze_oid</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-235">虚拟资金 / 体验金</h3><dl><dt>中文</dt><dd>虚拟资金 / 体验金</dd><dt>English</dt><dd>Virtual Funds / Bonus</dd><dt>备注 / 别名</dt><dd>模拟盘用</dd></dl></article><article class="professional-record"><h3 id="pro-record-236">重置账户</h3><dl><dt>中文</dt><dd>重置账户</dd><dt>English</dt><dd>Reset Account</dd><dt>备注 / 别名</dt><dd>模拟盘常用</dd></dl></article></div></div>
<hr>
<h4 id="professional-9">9. 撮合、清算与结算</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="12"><article class="professional-record"><h3 id="pro-record-237">撮合引擎</h3><dl><dt>中文</dt><dd>撮合引擎</dd><dt>English</dt><dd>Matching Engine</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-238">订单簿</h3><dl><dt>中文</dt><dd>订单簿</dd><dt>English</dt><dd>Order Book</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-239">价格时间优先</h3><dl><dt>中文</dt><dd>价格时间优先</dd><dt>English</dt><dd>Price-Time Priority</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-240">做市商</h3><dl><dt>中文</dt><dd>做市商</dd><dt>English</dt><dd>Market Maker (MM)</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-241">流动性</h3><dl><dt>中文</dt><dd>流动性</dd><dt>English</dt><dd>Liquidity</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-242">清算</h3><dl><dt>中文</dt><dd>清算</dd><dt>English</dt><dd>Clearing</dd><dt>备注 / 别名</dt><dd>项目内有「清算服务」</dd></dl></article><article class="professional-record"><h3 id="pro-record-243">结算</h3><dl><dt>中文</dt><dd>结算</dd><dt>English</dt><dd>Settlement</dd><dt>备注 / 别名</dt><dd><code>settlement_status</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-244">交割</h3><dl><dt>中文</dt><dd>交割</dd><dt>English</dt><dd>Delivery</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-245">日内结算</h3><dl><dt>中文</dt><dd>日内结算</dd><dt>English</dt><dd>Intraday Settlement</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-246">无负债结算</h3><dl><dt>中文</dt><dd>无负债结算</dd><dt>English</dt><dd>Mark-to-Market Settlement</dd><dt>备注 / 别名</dt><dd>逐日盯市</dd></dl></article><article class="professional-record"><h3 id="pro-record-247">对账</h3><dl><dt>中文</dt><dd>对账</dd><dt>English</dt><dd>Reconciliation</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-248">幂等</h3><dl><dt>中文</dt><dd>幂等</dd><dt>English</dt><dd>Idempotency</dd><dt>备注 / 别名</dt><dd><code>idempotency_key</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-249">订单状态机</h3><dl><dt>中文</dt><dd>订单状态机</dd><dt>English</dt><dd>Order State Machine</dd><dt>备注 / 别名</dt><dd>状态流转用 <code>status</code>，审计日志用 <code>state</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-250">成交回报</h3><dl><dt>中文</dt><dd>成交回报</dd><dt>English</dt><dd>Execution Report / Trade Report</dd><dt>备注 / 别名</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-251">委托回报</h3><dl><dt>中文</dt><dd>委托回报</dd><dt>English</dt><dd>Order Update / Order Report</dd><dt>备注 / 别名</dt><dd></dd></dl></article></div></div>
<hr>
<h4 id="professional-10">10. 合约命名常见格式（参考）</h4>
<blockquote>
<p>以下为各所<strong>常见</strong>写法，来自通用知识，<strong>具体以各所官方文档为准</strong>。</p>
</blockquote>
<div class="table-wrap"><div class="professional-table" data-source-table="13"><article class="professional-record"><h3 id="pro-record-252">本项目规范</h3><dl><dt>场景</dt><dd>本项目规范</dd><dt>常见格式示例</dt><dd><code>BTC-USDT</code> / <code>BTC-USDT-PERP</code> / <code>BTC-25APR26-50000-C</code></dd><dt>备注</dt><dd>来自 <code>field-naming.md</code> §1.4 ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-253">Binance 正向永续</h3><dl><dt>场景</dt><dd>Binance 正向永续</dd><dt>常见格式示例</dt><dd><code>BTCUSDT</code></dd><dt>备注</dt><dd>无分隔符</dd></dl></article><article class="professional-record"><h3 id="pro-record-254">Binance 交割</h3><dl><dt>场景</dt><dd>Binance 交割</dd><dt>常见格式示例</dt><dd><code>BTCUSDT_250627</code></dd><dt>备注</dt><dd>到期日 YYMMDD</dd></dl></article><article class="professional-record"><h3 id="pro-record-255">Binance 币本位永续</h3><dl><dt>场景</dt><dd>Binance 币本位永续</dd><dt>常见格式示例</dt><dd><code>BTCUSD_PERP</code></dd><dt>备注</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-256">OKX 永续</h3><dl><dt>场景</dt><dd>OKX 永续</dd><dt>常见格式示例</dt><dd><code>BTC-USDT-SWAP</code></dd><dt>备注</dt><dd>分隔符 <code>-</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-257">OKX 交割</h3><dl><dt>场景</dt><dd>OKX 交割</dd><dt>常见格式示例</dt><dd><code>BTC-USDT-250627</code></dd><dt>备注</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-258">OKX 期权</h3><dl><dt>场景</dt><dd>OKX 期权</dd><dt>常见格式示例</dt><dd><code>BTC-USD-250627-50000-C</code></dd><dt>备注</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-259">Bybit 正向</h3><dl><dt>场景</dt><dd>Bybit 正向</dd><dt>常见格式示例</dt><dd><code>BTCUSDT</code></dd><dt>备注</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-260">内部代码命名建议</h3><dl><dt>场景</dt><dd>内部代码命名建议</dd><dt>常见格式示例</dt><dd><code>{base}-{quote}-{type}[-{expiry}]</code></dd><dt>备注</dt><dd>💡 先定统一 <code>type</code> 枚举：<code>PERP</code> / <code>FUT</code> / <code>OPT</code></dd></dl></article></div></div>
<hr>
<h4 id="professional-11">11. 速查：易混淆术语</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="14"><article class="professional-record"><h3 id="pro-record-261">Liquidation vs Settlement</h3><dl><dt>容易混淆</dt><dd>Liquidation vs Settlement</dd><dt>区别</dt><dd>前者是风险触发的强制平仓；后者是到期 / 周期性的盈亏结算</dd></dl></article><article class="professional-record"><h3 id="pro-record-262">Margin vs Balance</h3><dl><dt>容易混淆</dt><dd>Margin vs Balance</dd><dt>区别</dt><dd>Margin 是被占用的担保金；Balance 是账户资金</dd></dl></article><article class="professional-record"><h3 id="pro-record-263">Equity vs Balance</h3><dl><dt>容易混淆</dt><dd>Equity vs Balance</dd><dt>区别</dt><dd>Equity = Balance + Unrealized PnL</dd></dl></article><article class="professional-record"><h3 id="pro-record-264">Mark Price vs Last Price</h3><dl><dt>容易混淆</dt><dd>Mark Price vs Last Price</dd><dt>区别</dt><dd>强平、未实现盈亏用 Mark Price；最新成交价用 Last Price</dd></dl></article><article class="professional-record"><h3 id="pro-record-265">Index Price vs Mark Price</h3><dl><dt>容易混淆</dt><dd>Index Price vs Mark Price</dd><dt>区别</dt><dd>Index 来自多个现货所加权；Mark 在 Index 基础上叠加基差/资金费修正</dd></dl></article><article class="professional-record"><h3 id="pro-record-266">Maker vs Taker</h3><dl><dt>容易混淆</dt><dd>Maker vs Taker</dd><dt>区别</dt><dd>看是否提供流动性（挂单）还是消耗流动性（吃单），不是看买卖方向</dd></dl></article><article class="professional-record"><h3 id="pro-record-267">Realized vs Unrealized PnL</h3><dl><dt>容易混淆</dt><dd>Realized vs Unrealized PnL</dd><dt>区别</dt><dd>已平仓结算的盈亏 vs 未平仓浮动盈亏</dd></dl></article><article class="professional-record"><h3 id="pro-record-268">Position vs Order</h3><dl><dt>容易混淆</dt><dd>Position vs Order</dd><dt>区别</dt><dd>Position 是持有结果；Order 是请求</dd></dl></article><article class="professional-record"><h3 id="pro-record-269">Perpetual vs Futures</h3><dl><dt>容易混淆</dt><dd>Perpetual vs Futures</dd><dt>区别</dt><dd>永续无到期日、靠资金费率锚定现货；交割有到期日</dd></dl></article><article class="professional-record"><h3 id="pro-record-270">Cross vs Isolated</h3><dl><dt>容易混淆</dt><dd>Cross vs Isolated</dd><dt>区别</dt><dd>Cross 共用全账户保证金；Isolated 仅用该仓位专属保证金</dd></dl></article><article class="professional-record"><h3 id="pro-record-271">expire_time vs expired_time</h3><dl><dt>容易混淆</dt><dd><code>expire_time</code> vs <code>expired_time</code></dd><dt>区别</dt><dd>计划到期时间 vs 已过期事实</dd></dl></article></div></div>
<hr>
<h4 id="professional-12-u-api">12. 币安官方中英映照（来自币安 U 本位合约 API 文档中文版）</h4>
<blockquote>
<p>来源：币安开发者文档中文版（USDⓈ-M Futures）的「公共定义 / 账户信息 V3 / 下单 / 交易规则信息」页，2026-10-27 抓取。
英文枚举与字段名是币安原文；中文说明是文档原文或其概括。<strong>币安字段为 camelCase，本项目统一 snake_case</strong>，右侧「本项目对应」列是与 <code>field-naming.md</code> 对齐后的建议。
币安中文文档里「起始保证金」即本词典的「初始保证金」（Initial Margin），同义词，本项目文档统一写「初始保证金」。</p>
</blockquote>
<h4 id="professional-121-contracttype">12.1 合约类型 <code>contractType</code></h4>
<div class="table-wrap"><div class="professional-table" data-source-table="15"><article class="professional-record"><h3 id="pro-record-272">PERPETUAL</h3><dl><dt>币安枚举</dt><dd>PERPETUAL</dd><dt>币安中文</dt><dd>永续合约</dd><dt>备注</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-273">CURRENT_MONTH</h3><dl><dt>币安枚举</dt><dd>CURRENT_MONTH</dd><dt>币安中文</dt><dd>当月交割合约</dd><dt>备注</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-274">NEXT_MONTH</h3><dl><dt>币安枚举</dt><dd>NEXT_MONTH</dd><dt>币安中文</dt><dd>次月交割合约</dd><dt>备注</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-275">CURRENT_QUARTER</h3><dl><dt>币安枚举</dt><dd>CURRENT_QUARTER</dd><dt>币安中文</dt><dd>当季交割合约</dd><dt>备注</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-276">NEXT_QUARTER</h3><dl><dt>币安枚举</dt><dd>NEXT_QUARTER</dd><dt>币安中文</dt><dd>次季交割合约</dd><dt>备注</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-277">PERPETUAL_DELIVERING</h3><dl><dt>币安枚举</dt><dd>PERPETUAL_DELIVERING</dd><dt>币安中文</dt><dd>交割结算中合约</dd><dt>备注</dt><dd></dd></dl></article></div></div>
<h4 id="professional-122-contractstatus">12.2 合约状态 <code>contractStatus</code></h4>
<div class="table-wrap"><div class="professional-table" data-source-table="16"><article class="professional-record"><h3 id="pro-record-278">PENDING_TRADING</h3><dl><dt>币安枚举</dt><dd>PENDING_TRADING</dd><dt>币安中文</dt><dd>待上市</dd></dl></article><article class="professional-record"><h3 id="pro-record-279">TRADING</h3><dl><dt>币安枚举</dt><dd>TRADING</dd><dt>币安中文</dt><dd>交易中</dd></dl></article><article class="professional-record"><h3 id="pro-record-280">PRE_DELIVERING</h3><dl><dt>币安枚举</dt><dd>PRE_DELIVERING</dd><dt>币安中文</dt><dd>预交割</dd></dl></article><article class="professional-record"><h3 id="pro-record-281">DELIVERING</h3><dl><dt>币安枚举</dt><dd>DELIVERING</dd><dt>币安中文</dt><dd>交割中</dd></dl></article><article class="professional-record"><h3 id="pro-record-282">DELIVERED</h3><dl><dt>币安枚举</dt><dd>DELIVERED</dd><dt>币安中文</dt><dd>已交割</dd></dl></article><article class="professional-record"><h3 id="pro-record-283">PRE_SETTLE</h3><dl><dt>币安枚举</dt><dd>PRE_SETTLE</dd><dt>币安中文</dt><dd>预结算</dd></dl></article><article class="professional-record"><h3 id="pro-record-284">SETTLING</h3><dl><dt>币安枚举</dt><dd>SETTLING</dd><dt>币安中文</dt><dd>结算中</dd></dl></article><article class="professional-record"><h3 id="pro-record-285">CLOSE</h3><dl><dt>币安枚举</dt><dd>CLOSE</dd><dt>币安中文</dt><dd>已下架</dd></dl></article><article class="professional-record"><h3 id="pro-record-286">TRADING_HALT</h3><dl><dt>币安枚举</dt><dd>TRADING_HALT</dd><dt>币安中文</dt><dd>交易暂停</dd></dl></article><article class="professional-record"><h3 id="pro-record-287">TRADING_CANCEL_ONLY</h3><dl><dt>币安枚举</dt><dd>TRADING_CANCEL_ONLY</dd><dt>币安中文</dt><dd>只挂单（仅允许撤单）</dd></dl></article></div></div>
<blockquote>
<p>币安对 TRADING_CANCEL_ONLY 的中文原文是「只挂单」，字面易误解；从枚举名看实际语义是「只能撤单」，文档未展开说明，<strong>需以实际行为验证</strong>。</p>
</blockquote>
<h4 id="professional-123">12.3 订单</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="17"><article class="professional-record"><h3 id="pro-record-288">NEW</h3><dl><dt>币安枚举</dt><dd>NEW</dd><dt>币安中文</dt><dd>新建订单</dd><dt>备注</dt><dd>订单状态</dd></dl></article><article class="professional-record"><h3 id="pro-record-289">PARTIALLY_FILLED</h3><dl><dt>币安枚举</dt><dd>PARTIALLY_FILLED</dd><dt>币安中文</dt><dd>部分成交</dd><dt>备注</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-290">FILLED</h3><dl><dt>币安枚举</dt><dd>FILLED</dd><dt>币安中文</dt><dd>全部成交</dd><dt>备注</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-291">CANCELED</h3><dl><dt>币安枚举</dt><dd>CANCELED</dd><dt>币安中文</dt><dd>已撤销</dd><dt>备注</dt><dd>单 l 拼写，与本项目一致</dd></dl></article><article class="professional-record"><h3 id="pro-record-292">REJECTED</h3><dl><dt>币安枚举</dt><dd>REJECTED</dd><dt>币安中文</dt><dd>订单被拒绝</dd><dt>备注</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-293">EXPIRED</h3><dl><dt>币安枚举</dt><dd>EXPIRED</dd><dt>币安中文</dt><dd>订单过期</dd><dt>备注</dt><dd>按 timeInForce 规则</dd></dl></article><article class="professional-record"><h3 id="pro-record-294">EXPIRED_IN_MATCH</h3><dl><dt>币安枚举</dt><dd>EXPIRED_IN_MATCH</dd><dt>币安中文</dt><dd>订单被 STP 过期</dd><dt>备注</dt><dd>STP = Self-Trade Prevention</dd></dl></article><article class="professional-record"><h3 id="pro-record-295">LIMIT</h3><dl><dt>币安枚举</dt><dd>LIMIT</dd><dt>币安中文</dt><dd>限价单</dd><dt>备注</dt><dd>订单类型</dd></dl></article><article class="professional-record"><h3 id="pro-record-296">MARKET</h3><dl><dt>币安枚举</dt><dd>MARKET</dd><dt>币安中文</dt><dd>市价单</dd><dt>备注</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-297">STOP</h3><dl><dt>币安枚举</dt><dd>STOP</dd><dt>币安中文</dt><dd>止损限价单</dd><dt>备注</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-298">STOP_MARKET</h3><dl><dt>币安枚举</dt><dd>STOP_MARKET</dd><dt>币安中文</dt><dd>止损市价单</dd><dt>备注</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-299">TAKE_PROFIT</h3><dl><dt>币安枚举</dt><dd>TAKE_PROFIT</dd><dt>币安中文</dt><dd>止盈限价单</dd><dt>备注</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-300">TAKE_PROFIT_MARKET</h3><dl><dt>币安枚举</dt><dd>TAKE_PROFIT_MARKET</dd><dt>币安中文</dt><dd>止盈市价单</dd><dt>备注</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-301">TRAILING_STOP_MARKET</h3><dl><dt>币安枚举</dt><dd>TRAILING_STOP_MARKET</dd><dt>币安中文</dt><dd>跟踪止损单</dd><dt>备注</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-302">BUY / SELL</h3><dl><dt>币安枚举</dt><dd>BUY / SELL</dd><dt>币安中文</dt><dd>买入 / 卖出</dd><dt>备注</dt><dd><code>side</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-303">BOTH</h3><dl><dt>币安枚举</dt><dd>BOTH</dd><dt>币安中文</dt><dd>单一持仓方向</dd><dt>备注</dt><dd><code>positionSide</code>，单向模式</dd></dl></article><article class="professional-record"><h3 id="pro-record-304">LONG / SHORT</h3><dl><dt>币安枚举</dt><dd>LONG / SHORT</dd><dt>币安中文</dt><dd>多头 / 空头（双向持仓下）</dd><dt>备注</dt><dd></dd></dl></article></div></div>
<h4 id="professional-124-timeinforce">12.4 有效方式 <code>timeInForce</code></h4>
<div class="table-wrap"><div class="professional-table" data-source-table="18"><article class="professional-record"><h3 id="pro-record-305">GTC</h3><dl><dt>币安枚举</dt><dd>GTC</dd><dt>币安中文</dt><dd>成交为止（下单后仅有 1 年有效期）</dd></dl></article><article class="professional-record"><h3 id="pro-record-306">IOC</h3><dl><dt>币安枚举</dt><dd>IOC</dd><dt>币安中文</dt><dd>无法立即成交的部分立即撤销</dd></dl></article><article class="professional-record"><h3 id="pro-record-307">FOK</h3><dl><dt>币安枚举</dt><dd>FOK</dd><dt>币安中文</dt><dd>无法全部立即成交则撤销</dd></dl></article><article class="professional-record"><h3 id="pro-record-308">GTX</h3><dl><dt>币安枚举</dt><dd>GTX</dd><dt>币安中文</dt><dd>无法成为挂单方则撤销（即 Post-Only）</dd></dl></article><article class="professional-record"><h3 id="pro-record-309">GTD</h3><dl><dt>币安枚举</dt><dd>GTD</dd><dt>币安中文</dt><dd>在特定时间之前有效，到期自动撤销（Good-Til-Date）</dd></dl></article><article class="professional-record"><h3 id="pro-record-310">RPI</h3><dl><dt>币安枚举</dt><dd>RPI</dd><dt>币安中文</dt><dd>Retail Price Improvement，仅与 APP / 网页端订单成交，且为 Post Only</dd></dl></article></div></div>
<h4 id="professional-125">12.5 下单参数</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="19"><article class="professional-record"><h3 id="pro-record-311">reduceOnly</h3><dl><dt>币安字段</dt><dd>reduceOnly</dd><dt>币安中文</dt><dd>只减仓（双向持仓模式下不接受）</dd><dt>本项目对应</dt><dd>💡 <code>is_reduce_only</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-312">closePosition</h3><dl><dt>币安字段</dt><dd>closePosition</dd><dt>币安中文</dt><dd>条件单触发后全部平仓（仅 STOP_MARKET / TAKE_PROFIT_MARKET，不可与 quantity 合用）</dd><dt>本项目对应</dt><dd>💡 <code>is_close_position</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-313">stopPrice / triggerPrice</h3><dl><dt>币安字段</dt><dd>stopPrice / triggerPrice</dd><dt>币安中文</dt><dd>触发价</dd><dt>本项目对应</dt><dd>💡 <code>trigger_price</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-314">activatePrice</h3><dl><dt>币安字段</dt><dd>activatePrice</dd><dt>币安中文</dt><dd>追踪止损激活价格（仅 TRAILING_STOP_MARKET；注意是 <code>activatePrice</code> 不是 <code>activationPrice</code>）</dd><dt>本项目对应</dt><dd>💡 <code>activate_price</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-315">callbackRate</h3><dl><dt>币安字段</dt><dd>callbackRate</dd><dt>币安中文</dt><dd>追踪止损回调比例，范围 [0.1, 20]，1 代表 1%</dd><dt>本项目对应</dt><dd>💡 <code>callback_rate</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-316">workingType</h3><dl><dt>币安字段</dt><dd>workingType</dd><dt>币安中文</dt><dd>条件价格触发类型：MARK_PRICE（标记价格）/ CONTRACT_PRICE（合约最新价），默认 CONTRACT_PRICE</dd><dt>本项目对应</dt><dd>💡 <code>trigger_price_type</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-317">priceProtect</h3><dl><dt>币安字段</dt><dd>priceProtect</dd><dt>币安中文</dt><dd>触发保护：触发时标记价与最新价价差不得超过阈值</dd><dt>本项目对应</dt><dd>💡 <code>is_price_protect</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-318">priceMatch</h3><dl><dt>币安字段</dt><dd>priceMatch</dd><dt>币安中文</dt><dd>盘口价格下单模式</dd><dt>本项目对应</dt><dd>💡 <code>price_match</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-319">selfTradePreventionMode</h3><dl><dt>币安字段</dt><dd>selfTradePreventionMode</dd><dt>币安中文</dt><dd>自成交保护模式：NONE / EXPIRE_TAKER / EXPIRE_MAKER / EXPIRE_BOTH</dd><dt>本项目对应</dt><dd>💡 <code>stp_mode</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-320">goodTillDate</h3><dl><dt>币安字段</dt><dd>goodTillDate</dd><dt>币安中文</dt><dd>GTD 订单自动取消时间戳（须晚于当前 600 秒以上）</dd><dt>本项目对应</dt><dd>💡 <code>good_till_time</code>（遵循 <code>_time</code>）</dd></dl></article><article class="professional-record"><h3 id="pro-record-321">newClientOrderId / origClientOrderId</h3><dl><dt>币安字段</dt><dd>newClientOrderId / origClientOrderId</dd><dt>币安中文</dt><dd>用户自定义订单编号 / 原订单自定义编号</dd><dt>本项目对应</dt><dd><code>client_order_id</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-322">clientAlgoId</h3><dl><dt>币安字段</dt><dd>clientAlgoId</dd><dt>币安中文</dt><dd>用户自定义条件单编号</dd><dt>本项目对应</dt><dd>💡 <code>client_algo_oid</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-323">newOrderRespType</h3><dl><dt>币安字段</dt><dd>newOrderRespType</dd><dt>币安中文</dt><dd>响应类型：ACK / RESULT，默认 ACK</dd><dt>本项目对应</dt><dd>—</dd></dl></article><article class="professional-record"><h3 id="pro-record-324">recvWindow</h3><dl><dt>币安字段</dt><dd>recvWindow</dd><dt>币安中文</dt><dd>请求有效时间窗口（毫秒，最大 60000）</dd><dt>本项目对应</dt><dd>—</dd></dl></article></div></div>
<p>盘口价下单模式 <code>priceMatch</code>：</p>
<div class="table-wrap"><div class="professional-table" data-source-table="20"><article class="professional-record"><h3 id="pro-record-325">OPPONENT</h3><dl><dt>枚举</dt><dd>OPPONENT</dd><dt>中文</dt><dd>盘口对手价</dd></dl></article><article class="professional-record"><h3 id="pro-record-326">OPPONENT_5 / 10 / 20</h3><dl><dt>枚举</dt><dd>OPPONENT_5 / 10 / 20</dd><dt>中文</dt><dd>盘口对手 5 / 10 / 20 档价</dd></dl></article><article class="professional-record"><h3 id="pro-record-327">QUEUE</h3><dl><dt>枚举</dt><dd>QUEUE</dd><dt>中文</dt><dd>盘口同向价</dd></dl></article><article class="professional-record"><h3 id="pro-record-328">QUEUE_5 / 10 / 20</h3><dl><dt>枚举</dt><dd>QUEUE_5 / 10 / 20</dd><dt>中文</dt><dd>盘口同向排队 5 / 10 / 20 档价</dd></dl></article></div></div>
<h4 id="professional-126-v3">12.6 账户 / 持仓字段（账户信息 V3）</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="21"><article class="professional-record"><h3 id="pro-record-329">totalWalletBalance</h3><dl><dt>币安字段</dt><dd>totalWalletBalance</dd><dt>币安中文</dt><dd>账户总余额</dd><dt>本项目对应</dt><dd><code>total_balance</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-330">availableBalance</h3><dl><dt>币安字段</dt><dd>availableBalance</dd><dt>币安中文</dt><dd>可用余额</dd><dt>本项目对应</dt><dd><code>available_balance</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-331">maxWithdrawAmount</h3><dl><dt>币安字段</dt><dd>maxWithdrawAmount</dd><dt>币安中文</dt><dd>最大可转出余额</dd><dt>本项目对应</dt><dd>💡 <code>max_withdraw_amount</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-332">walletBalance / balance</h3><dl><dt>币安字段</dt><dd>walletBalance / balance</dd><dt>币安中文</dt><dd>钱包余额</dd><dt>本项目对应</dt><dd>—</dd></dl></article><article class="professional-record"><h3 id="pro-record-333">crossWalletBalance</h3><dl><dt>币安字段</dt><dd>crossWalletBalance</dd><dt>币安中文</dt><dd>全仓账户余额</dd><dt>本项目对应</dt><dd>💡 <code>cross_wallet_balance</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-334">unrealizedProfit</h3><dl><dt>币安字段</dt><dd>unrealizedProfit</dd><dt>币安中文</dt><dd>未实现盈亏</dd><dt>本项目对应</dt><dd>💡 <code>unrealized_pnl</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-335">crossUnPnl</h3><dl><dt>币安字段</dt><dd>crossUnPnl</dd><dt>币安中文</dt><dd>全仓持仓未实现盈亏</dd><dt>本项目对应</dt><dd>—</dd></dl></article><article class="professional-record"><h3 id="pro-record-336">marginBalance / totalMarginBalance</h3><dl><dt>币安字段</dt><dd>marginBalance / totalMarginBalance</dd><dt>币安中文</dt><dd>保证金余额 / 保证金总余额</dd><dt>本项目对应</dt><dd>💡 <code>margin_balance</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-337">initialMargin / totalInitialMargin</h3><dl><dt>币安字段</dt><dd>initialMargin / totalInitialMargin</dd><dt>币安中文</dt><dd>所需起始（初始）保证金</dd><dt>本项目对应</dt><dd>💡 <code>initial_margin</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-338">maintMargin / totalMaintMargin</h3><dl><dt>币安字段</dt><dd>maintMargin / totalMaintMargin</dd><dt>币安中文</dt><dd>维持保证金</dd><dt>本项目对应</dt><dd>💡 <code>maintenance_margin</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-339">positionInitialMargin</h3><dl><dt>币安字段</dt><dd>positionInitialMargin</dd><dt>币安中文</dt><dd>持仓所需起始保证金</dd><dt>本项目对应</dt><dd>—</dd></dl></article><article class="professional-record"><h3 id="pro-record-340">openOrderInitialMargin</h3><dl><dt>币安字段</dt><dd>openOrderInitialMargin</dd><dt>币安中文</dt><dd>当前挂单所需起始保证金</dd><dt>本项目对应</dt><dd>—</dd></dl></article><article class="professional-record"><h3 id="pro-record-341">positionAmt</h3><dl><dt>币安字段</dt><dd>positionAmt</dd><dt>币安中文</dt><dd>持仓数量</dd><dt>本项目对应</dt><dd>💡 <code>position_qty</code>（规范禁 amt，数量用 qty）</dd></dl></article><article class="professional-record"><h3 id="pro-record-342">entryPrice</h3><dl><dt>币安字段</dt><dd>entryPrice</dd><dt>币安中文</dt><dd>持仓成本价</dd><dt>本项目对应</dt><dd>💡 <code>entry_price</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-343">notional</h3><dl><dt>币安字段</dt><dd>notional</dd><dt>币安中文</dt><dd>持仓名义价值</dd><dt>本项目对应</dt><dd><code>notional_amount</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-344">leverage</h3><dl><dt>币安字段</dt><dd>leverage</dd><dt>币安中文</dt><dd>当前杠杆倍数</dd><dt>本项目对应</dt><dd>💡 <code>leverage</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-345">isolated</h3><dl><dt>币安字段</dt><dd>isolated</dd><dt>币安中文</dt><dd>是否为逐仓模式</dd><dt>本项目对应</dt><dd>💡 <code>margin_mode</code>（本项目用 TINYINT 枚举，不用布尔）</dd></dl></article><article class="professional-record"><h3 id="pro-record-346">isolatedMargin / isolatedWallet</h3><dl><dt>币安字段</dt><dd>isolatedMargin / isolatedWallet</dd><dt>币安中文</dt><dd>逐仓保证金 / 逐仓钱包余额</dd><dt>本项目对应</dt><dd>—</dd></dl></article><article class="professional-record"><h3 id="pro-record-347">maxNotional</h3><dl><dt>币安字段</dt><dd>maxNotional</dd><dt>币安中文</dt><dd>当前杠杆下可用最大名义价值</dd><dt>本项目对应</dt><dd>—</dd></dl></article><article class="professional-record"><h3 id="pro-record-348">accountAlias</h3><dl><dt>币安字段</dt><dd>accountAlias</dd><dt>币安中文</dt><dd>唯一账户别名</dd><dt>本项目对应</dt><dd>—</dd></dl></article><article class="professional-record"><h3 id="pro-record-349">marginAvailable</h3><dl><dt>币安字段</dt><dd>marginAvailable</dd><dt>币安中文</dt><dd>多资产模式下该资产是否可作为保证金</dd><dt>本项目对应</dt><dd>—</dd></dl></article><article class="professional-record"><h3 id="pro-record-350">updateTime</h3><dl><dt>币安字段</dt><dd>updateTime</dd><dt>币安中文</dt><dd>最后更新时间（毫秒）</dd><dt>本项目对应</dt><dd><code>update_time</code> ✅</dd></dl></article></div></div>
<h4 id="professional-127-exchangeinfo">12.7 交易规则 <code>exchangeInfo</code></h4>
<div class="table-wrap"><div class="professional-table" data-source-table="22"><article class="professional-record"><h3 id="pro-record-351">pricePrecision</h3><dl><dt>币安字段</dt><dd>pricePrecision</dd><dt>币安说明</dt><dd>价格小数位数（仅系统精度，≠ tickSize）</dd><dt>对应词条</dt><dd>Tick Size 另算</dd></dl></article><article class="professional-record"><h3 id="pro-record-352">quantityPrecision</h3><dl><dt>币安字段</dt><dd>quantityPrecision</dd><dt>币安说明</dt><dd>数量小数位数（仅系统精度，≠ stepSize）</dd><dt>对应词条</dt><dd>Step Size 另算</dd></dl></article><article class="professional-record"><h3 id="pro-record-353">liquidationFee</h3><dl><dt>币安字段</dt><dd>liquidationFee</dd><dt>币安说明</dt><dd>强平费率</dd><dt>对应词条</dt><dd>Liquidation Fee</dd></dl></article><article class="professional-record"><h3 id="pro-record-354">marketTakeBound</h3><dl><dt>币安字段</dt><dd>marketTakeBound</dd><dt>币安说明</dt><dd>市价单相对标记价的最大允许偏离</dd><dt>对应词条</dt><dd>Price Protection</dd></dl></article><article class="professional-record"><h3 id="pro-record-355">triggerProtect</h3><dl><dt>币安字段</dt><dd>triggerProtect</dd><dt>币安说明</dt><dd>开启 priceProtect 的条件单触发阈值</dd><dt>对应词条</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-356">onboardDate</h3><dl><dt>币安字段</dt><dd>onboardDate</dd><dt>币安说明</dt><dd>合约上线时间（毫秒）</dd><dt>对应词条</dt><dd>Listing</dd></dl></article><article class="professional-record"><h3 id="pro-record-357">underlyingType / underlyingSubType</h3><dl><dt>币安字段</dt><dd>underlyingType / underlyingSubType</dd><dt>币安说明</dt><dd>标的类型 / 子类型</dd><dt>对应词条</dt><dd>Underlying</dd></dl></article><article class="professional-record"><h3 id="pro-record-358">settlePlan</h3><dl><dt>币安字段</dt><dd>settlePlan</dd><dt>币安说明</dt><dd>结算计划</dd><dt>对应词条</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-359">filters：PRICE_FILTER、LOT_SIZE、MARKET_LOT_SIZE、MAX_NUM_ORDERS、PERCENT_PRICE、MIN_NOTIONAL</h3><dl><dt>币安字段</dt><dd>filters：PRICE_FILTER、LOT_SIZE、MARKET_LOT_SIZE、MAX_NUM_ORDERS、PERCENT_PRICE、MIN_NOTIONAL</dd><dt>币安说明</dt><dd>文档本次抓取被截断，<strong>未拿到说明</strong></dd><dt>对应词条</dt><dd>待补</dd></dl></article></div></div>
<h4 id="professional-128">12.8 币安资金费率文章里的英文对应</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="23"><article class="professional-record"><h3 id="pro-record-360">永续合约</h3><dl><dt>中文</dt><dd>永续合约</dd><dt>英文</dt><dd>perpetual</dd><dt>来源可信度</dt><dd>页面链接路径</dd></dl></article><article class="professional-record"><h3 id="pro-record-361">实时资金费率</h3><dl><dt>中文</dt><dd>实时资金费率</dd><dt>英文</dt><dd>real-time funding rate</dd><dt>来源可信度</dt><dd>页面链接路径</dd></dl></article><article class="professional-record"><h3 id="pro-record-362">资金费率历史</h3><dl><dt>中文</dt><dd>资金费率历史</dd><dt>英文</dt><dd>funding fee history</dd><dt>来源可信度</dt><dd>页面链接路径</dd></dl></article><article class="professional-record"><h3 id="pro-record-363">标记价格</h3><dl><dt>中文</dt><dd>标记价格</dd><dt>英文</dt><dd>mark price</dd><dt>来源可信度</dt><dd>文章英文标题</dd></dl></article><article class="professional-record"><h3 id="pro-record-364">价格指数</h3><dl><dt>中文</dt><dd>价格指数</dd><dt>英文</dt><dd>price index</dd><dt>来源可信度</dt><dd>文章英文标题</dd></dl></article><article class="professional-record"><h3 id="pro-record-365">U 本位合约</h3><dl><dt>中文</dt><dd>U 本位合约</dd><dt>英文</dt><dd>USDⓈ-margined futures</dd><dt>来源可信度</dt><dd>文章英文标题</dd></dl></article><article class="professional-record"><h3 id="pro-record-366">溢价指数</h3><dl><dt>中文</dt><dd>溢价指数</dd><dt>英文</dt><dd>premium index</dd><dt>来源可信度</dt><dd>文中变量名</dd></dl></article><article class="professional-record"><h3 id="pro-record-367">冲击保证金额</h3><dl><dt>中文</dt><dd>冲击保证金额</dd><dt>英文</dt><dd>IMN（Impact Margin Notional，<strong>全称为我据缩写推测，页面未给出</strong>）</dd><dt>来源可信度</dt><dd>仅缩写</dd></dl></article><article class="professional-record"><h3 id="pro-record-368">冲击买价 / 冲击卖价</h3><dl><dt>中文</dt><dd>冲击买价 / 冲击卖价</dd><dt>英文</dt><dd>impact bid price / impact ask price</dd><dt>来源可信度</dt><dd>抓取工具的补充翻译，<strong>非币安原文</strong></dd></dl></article></div></div>
<h4 id="professional-129">12.9 币安其它术语（第三方文章转述，未在官方页核实）</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="24"><article class="professional-record"><h3 id="pro-record-369">强平费用</h3><dl><dt>中文</dt><dd>强平费用</dd><dt>English</dt><dd>Liquidation Fee</dd><dt>说明</dt><dd>有第三方称 Level 1 强平（净敞口 &lt; 500,000 USDT）按名义价值收 0.5%，<strong>未核实</strong>，不要当规范引用</dd></dl></article><article class="professional-record"><h3 id="pro-record-370">分级保证金</h3><dl><dt>中文</dt><dd>分级保证金</dd><dt>English</dt><dd>Tiered Margin</dd><dt>说明</dt><dd>仓位越大要求越高</dd></dl></article><article class="professional-record"><h3 id="pro-record-371">ADL 风险评级</h3><dl><dt>中文</dt><dd>ADL 风险评级</dd><dt>English</dt><dd>ADL Risk Rating</dd><dt>说明</dt><dd>高 / 中 / 低，约每半小时更新（来自行情接口说明）</dd></dl></article><article class="professional-record"><h3 id="pro-record-372">保险基金余额</h3><dl><dt>中文</dt><dd>保险基金余额</dd><dt>English</dt><dd>Insurance Fund Balance</dd><dt>说明</dt><dd>行情接口有此项</dd></dl></article><article class="professional-record"><h3 id="pro-record-373">持仓量</h3><dl><dt>中文</dt><dd>持仓量</dd><dt>English</dt><dd>Open Interest</dd><dt>说明</dt><dd>行情接口有此项及历史</dd></dl></article><article class="professional-record"><h3 id="pro-record-374">多空账户比 / 大户持仓比</h3><dl><dt>中文</dt><dd>多空账户比 / 大户持仓比</dd><dt>English</dt><dd>Long/Short Account Ratio / Top Trader Ratio</dd><dt>说明</dt><dd>行情接口</dd></dl></article><article class="professional-record"><h3 id="pro-record-375">主动买卖量</h3><dl><dt>中文</dt><dd>主动买卖量</dd><dt>English</dt><dd>Taker Buy/Sell Volume</dd><dt>说明</dt><dd>行情接口</dd></dl></article><article class="professional-record"><h3 id="pro-record-376">基差</h3><dl><dt>中文</dt><dd>基差</dd><dt>English</dt><dd>Basis</dd><dt>说明</dt><dd>行情接口</dd></dl></article><article class="professional-record"><h3 id="pro-record-377">连续合约 K 线</h3><dl><dt>中文</dt><dd>连续合约 K 线</dd><dt>English</dt><dd>Continuous Contract Kline</dd><dt>说明</dt><dd>行情接口</dd></dl></article><article class="professional-record"><h3 id="pro-record-378">标记价格 K 线 / 指数价格 K 线 / 溢价指数 K 线</h3><dl><dt>中文</dt><dd>标记价格 K 线 / 指数价格 K 线 / 溢价指数 K 线</dd><dt>English</dt><dd>Mark Price / Index Price / Premium Index Kline</dd><dt>说明</dt><dd>行情接口</dd></dl></article></div></div>
<h4 id="professional-1210">12.10 抓取的局限</h4>
<ul>
<li>以上只来自 4 个文档页，<strong>不是币安全站的术语表</strong>。币安 App / 网页端界面的中英文案（如「减仓」「开仓价格」等）没有抓到，需要的话可以再补：对照 <code>binance.com/zh-CN</code> 和 <code>binance.com/en</code> 同一页面逐项采集。</li>
<li>资金费率、保证金、强平的公式术语见第 13 节；逐仓 / 全仓模式的官方说明页仍未抓到。</li>
<li>币安文档会更新，使用前以官方当时页面为准。</li>
</ul>
<hr>
<h4 id="professional-13-faq">13. 公式相关术语专区（币安官方帮助中心 + 合约计算器 FAQ）</h4>
<blockquote>
<p>来源：币安帮助中心中英文页（U 本位杠杆与保证金、币本位杠杆与保证金、合约计算器、资金费率介绍、U 本位强平价格），2026-10-27 抓取。
标记：<strong>【官方】</strong> 页面原文公式；<strong>【推断】</strong> 我据页面推出、页面没明说，上线前必须核对；<strong>【存疑】</strong> 页面内容互相矛盾。
命名：英文变量保留币安原符号，字段名按本项目 snake_case，💡 为建议命名。</p>
</blockquote>
<h4 id="professional-131-7">13.1 术语对照（你提到的 7 个词）</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="25"><article class="professional-record"><h3 id="pro-record-379">单张合约价值 / 单张价值</h3><dl><dt>中文（你的叫法）</dt><dd>单张合约价值 / 单张价值</dd><dt>币安中文叫法</dt><dd>币安叫 <strong>合约乘数</strong>；OKX 叫 <strong>合约面值</strong></dd><dt>币安英文</dt><dd>币安：Contract Multiplier（资金费页面称 Size of a Contract）；OKX：Contract value（<code>ctVal</code>）【官方，已核实】</dd><dt>💡 字段建议</dt><dd><strong><code>contract_value</code></strong>（用户决定）</dd><dt>备注</dt><dd>币安<strong>不用</strong>「单张价值」「合约面值」（计算器页面明确无此定义）。币安币本位 BTCUSD 示例「合约乘数 = 100 USD」【官方】，语义上对应 OKX 的 <code>ctVal</code>【推断】。OKX 另有独立的合约乘数 <code>ctMult</code>，不是同一个量，见第 15 节</dd></dl></article><article class="professional-record"><h3 id="pro-record-380">杠杆</h3><dl><dt>中文（你的叫法）</dt><dd>杠杆</dd><dt>币安中文叫法</dt><dd>杠杆倍数</dd><dt>币安英文</dt><dd>Leverage</dd><dt>💡 字段建议</dt><dd><code>leverage</code></dd><dt>备注</dt><dd>用户未设置时系统默认 20 倍（币本位页面）【官方】；最高可用杠杆取决于仓位名义价值（分级）</dd></dl></article><article class="professional-record"><h3 id="pro-record-381">资金费率</h3><dl><dt>中文（你的叫法）</dt><dd>资金费率</dd><dt>币安中文叫法</dt><dd>资金费率</dd><dt>币安英文</dt><dd>Funding Rate (F)</dd><dt>💡 字段建议</dt><dd><code>funding_rate</code> ✅</dd><dt>备注</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-382">起始保证金</h3><dl><dt>中文（你的叫法）</dt><dd>起始保证金</dd><dt>币安中文叫法</dt><dd>起始保证金 / 初始保证金（币安两种写法并存）</dd><dt>币安英文</dt><dd>Initial Margin</dd><dt>💡 字段建议</dt><dd><code>initial_margin</code></dd><dt>备注</dt><dd>本项目文档统一写「初始保证金」</dd></dl></article><article class="professional-record"><h3 id="pro-record-383">初始保证金率</h3><dl><dt>中文（你的叫法）</dt><dd>初始保证金率</dd><dt>币安中文叫法</dt><dd>初始保证金率</dd><dt>币安英文</dt><dd>Initial Margin Rate (IMR)</dd><dt>💡 字段建议</dt><dd><code>initial_margin_rate</code></dd><dt>备注</dt><dd>IMR = 1 / 杠杆倍数【官方】</dd></dl></article><article class="professional-record"><h3 id="pro-record-384">维持保证金</h3><dl><dt>中文（你的叫法）</dt><dd>维持保证金</dd><dt>币安中文叫法</dt><dd>维持保证金</dd><dt>币安英文</dt><dd>Maintenance Margin (MM)</dd><dt>💡 字段建议</dt><dd><code>maintenance_margin</code></dd><dt>备注</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-385">维持保证金率</h3><dl><dt>中文（你的叫法）</dt><dd>维持保证金率</dd><dt>币安中文叫法</dt><dd>维持保证金率 / 维持保证金比率</dd><dt>币安英文</dt><dd>Maintenance Margin Rate / Ratio (MMR)</dd><dt>💡 字段建议</dt><dd><code>maintenance_margin_rate</code></dd><dt>备注</dt><dd><strong>不随杠杆变化，只随仓位名义价值所在档位变化</strong>【官方】</dd></dl></article><article class="professional-record"><h3 id="pro-record-386">维持保证金速算额</h3><dl><dt>中文（你的叫法）</dt><dd>维持保证金速算额</dd><dt>币安中文叫法</dt><dd><strong>速算额 / 速算数 / 维持保证金额</strong>（币安中文文档三种写法并存）</dd><dt>币安英文</dt><dd>Maintenance Amount；API 字段 <code>cum</code></dd><dt>💡 字段建议</dt><dd><code>maintenance_amount</code></dd><dt>备注</dt><dd>本词典统一用「速算额」</dd></dl></article><article class="professional-record"><h3 id="pro-record-387">阶梯维持保证金</h3><dl><dt>中文（你的叫法）</dt><dd>阶梯维持保证金</dd><dt>币安中文叫法</dt><dd><strong>分级</strong> / 仓位名义价值等级；杠杆分层</dd><dt>币安英文</dt><dd>Maintenance Margin Tiers；Position Bracket；币安称 <strong>"Tax Bracket" setup</strong>（税收超额累进法）</dd><dt>💡 字段建议</dt><dd><code>margin_tier</code> / <code>bracket</code></dd><dt>备注</dt><dd>API 字段 <code>bracket</code>、<code>notionalFloor</code>、<code>notionalCap</code>、<code>initialLeverage</code>、<code>maintMarginRatio</code>、<code>cum</code></dd></dl></article></div></div>
<h4 id="professional-132">13.2 公式总表</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="26"><article class="professional-record"><h3 id="pro-record-388">初始保证金率</h3><dl><dt>公式</dt><dd>初始保证金率</dd><dt>公式内容</dt><dd><code>IMR = 1 / 杠杆倍数</code></dd><dt>标记</dt><dd>【官方】</dd></dl></article><article class="professional-record"><h3 id="pro-record-389">持仓名义价值（U 本位）</h3><dl><dt>公式</dt><dd>持仓名义价值（U 本位）</dd><dt>公式内容</dt><dd><code>名义价值 = 标记价格 × 持仓数量</code></dd><dt>标记</dt><dd>【官方：资金费页 "Mark Price × Size"】</dd></dl></article><article class="professional-record"><h3 id="pro-record-390">持仓名义价值（币本位）</h3><dl><dt>公式</dt><dd>持仓名义价值（币本位）</dd><dt>公式内容</dt><dd><code>名义价值（币）= 张数 × 合约乘数 ÷ 价格</code>，示例 <code>(10 × 100 USD) / 9,800 USD = 0.1020 BTC</code></dd><dt>标记</dt><dd>【官方示例】</dd></dl></article><article class="professional-record"><h3 id="pro-record-391">初始保证金（U 本位）</h3><dl><dt>公式</dt><dd>初始保证金（U 本位）</dd><dt>公式内容</dt><dd><code>初始保证金 = 成交数量 × 开仓价格 × IMR</code></dd><dt>标记</dt><dd>【官方：计算器页】</dd></dl></article><article class="professional-record"><h3 id="pro-record-392">初始保证金（币本位）</h3><dl><dt>公式</dt><dd>初始保证金（币本位）</dd><dt>公式内容</dt><dd><code>初始保证金 = 成交数量(张) × 合约乘数 × IMR ÷ 开仓价格</code></dd><dt>标记</dt><dd>【官方】</dd></dl></article><article class="professional-record"><h3 id="pro-record-393">维持保证金（通用）</h3><dl><dt>公式</dt><dd>维持保证金（通用）</dd><dt>公式内容</dt><dd><code>维持保证金 = 仓位名义价值 × 维持保证金率 − 维持保证金速算额</code></dd><dt>标记</dt><dd>【官方】MMR 和速算额取自名义价值所在的档位</dd></dl></article><article class="professional-record"><h3 id="pro-record-394">开仓亏损（币本位）</h3><dl><dt>公式</dt><dd>开仓亏损（币本位）</dd><dt>公式内容</dt><dd><code>开仓亏损 = 委托数量 × 合约乘数 × |min{0, 方向 × (1/委托价格 − 1/标记价格)}|</code></dd><dt>标记</dt><dd>【官方】</dd></dl></article><article class="professional-record"><h3 id="pro-record-395">开仓成本（币本位）</h3><dl><dt>公式</dt><dd>开仓成本（币本位）</dd><dt>公式内容</dt><dd><code>开仓成本 = 初始保证金 + 开仓亏损（如有）</code></dd><dt>标记</dt><dd>【官方】</dd></dl></article><article class="professional-record"><h3 id="pro-record-396">盈亏（U 本位）</h3><dl><dt>公式</dt><dd>盈亏（U 本位）</dd><dt>公式内容</dt><dd>多：<code>PnL = (结算价 − 开仓价) × 数量</code>；空：<code>PnL = (开仓价 − 结算价) × 数量</code></dd><dt>标记</dt><dd>【官方】</dd></dl></article><article class="professional-record"><h3 id="pro-record-397">盈亏（币本位）</h3><dl><dt>公式</dt><dd>盈亏（币本位）</dd><dt>公式内容</dt><dd><code>PnL = 方向 × 张数 × 合约乘数 × (1/开仓价 − 1/结算价)</code>，多 = 1，空 = −1</dd><dt>标记</dt><dd>【官方】</dd></dl></article><article class="professional-record"><h3 id="pro-record-398">回报率</h3><dl><dt>公式</dt><dd>回报率</dd><dt>公式内容</dt><dd><code>ROI = PnL ÷ 初始保证金</code></dd><dt>标记</dt><dd>定义【官方】。币安计算器页面 U 本位的展开式按字面算出符号反了（多头上涨得负值），<strong>【存疑】</strong>，实现时用 <code>PnL ÷ 初始保证金</code>，勿抄展开式</dd></dl></article><article class="professional-record"><h3 id="pro-record-399">资金费用</h3><dl><dt>公式</dt><dd>资金费用</dd><dt>公式内容</dt><dd><code>资金费用 = 持仓名义价值 × 资金费率</code></dd><dt>标记</dt><dd>【官方】多空互付，正费率多付空</dd></dl></article><article class="professional-record"><h3 id="pro-record-400">溢价指数</h3><dl><dt>公式</dt><dd>溢价指数</dd><dt>公式内容</dt><dd><code>P = [Max(0, 冲击买价 − 价格指数) − Max(0, 价格指数 − 冲击卖价)] ÷ 价格指数</code></dd><dt>标记</dt><dd>【官方】</dd></dl></article><article class="professional-record"><h3 id="pro-record-401">资金费率</h3><dl><dt>公式</dt><dd>资金费率</dd><dt>公式内容</dt><dd><code>F = [平均溢价指数 P + clamp(利率 I − P, −0.05%, +0.05%)] ÷ (8 ÷ N)</code>，N = 资金费间隔（小时）</dd><dt>标记</dt><dd>【官方】英文页把 clamp 边界写成 <code>(0.05%, −0.05%)</code>，顺序反了，以中文页 <code>(−0.05%, 0.05%)</code> 为准</dd></dl></article><article class="professional-record"><h3 id="pro-record-402">资金费率上下限</h3><dl><dt>公式</dt><dd>资金费率上下限</dd><dt>公式内容</dt><dd><code>下限 = −0.75 × 维持保证金率</code>；<code>上限 = 0.75 × 维持保证金率</code>；<code>实际费率 = clamp(F, 下限, 上限)</code></dd><dt>标记</dt><dd>【官方】英文页注明仅适用于列表内合约，其它 U 本位合约用 ±2%；<strong>这条未在中文页出现</strong></dd></dl></article><article class="professional-record"><h3 id="pro-record-403">默认利率</h3><dl><dt>公式</dt><dd>默认利率</dd><dt>公式内容</dt><dd>0.03% / 日 = 0.01% / 8 小时</dd><dt>标记</dt><dd>【官方英文页】个别合约（如 ETHBTC）为 0%</dd></dl></article><article class="professional-record"><h3 id="pro-record-404">冲击保证金额</h3><dl><dt>公式</dt><dd>冲击保证金额</dd><dt>公式内容</dt><dd><code>IMN = 200 USDT ÷ 最高杠杆下的初始保证金率</code></dd><dt>标记</dt><dd>【官方】示例 BNBUSDT：20 倍 → 5% → 4,000 USDT</dd></dl></article><article class="professional-record"><h3 id="pro-record-405">8 小时平均溢价指数</h3><dl><dt>公式</dt><dd>8 小时平均溢价指数</dd><dt>公式内容</dt><dd>时间加权：<code>(1·P₁ + 2·P₂ + … + n·Pₙ) ÷ (1 + 2 + … + n)</code>，n = 5,760</dd><dt>标记</dt><dd>【官方英文页】</dd></dl></article><article class="professional-record"><h3 id="pro-record-406">1 小时平均溢价指数</h3><dl><dt>公式</dt><dd>1 小时平均溢价指数</dd><dt>公式内容</dt><dd>等权：<code>(P₁ + … + Pₙ) ÷ n</code>，n = 720</dd><dt>标记</dt><dd>【官方英文页】</dd></dl></article><article class="professional-record"><h3 id="pro-record-407">U 本位强平价格</h3><dl><dt>公式</dt><dd>U 本位强平价格</dd><dt>公式内容</dt><dd>公式在币安页面中是一张<strong>图片</strong>，文字抓取拿不到</dd><dt>标记</dt><dd>【缺失】见 13.3 变量表</dd></dl></article></div></div>
<blockquote>
<p><strong>U 本位 / 币本位的 MMR 可对照档位表：</strong> 币本位 BTC 永续第 1 档 MMR = 0.40%，上限 5 张（来自第三方转述，<strong>未核实</strong>）；U 本位示例：名义价值 264,000 USDT → MMR 1%、速算额 1,300 USDT（来自第三方对强平价格 FAQ 的转述，<strong>未核实</strong>）。</p>
</blockquote>
<h4 id="professional-133-u">13.3 强平价格公式的变量（U 本位，全仓/逐仓）</h4>
<p>币安给的是变量表，公式本身是图片没抓到。以下是变量与中文名（【官方】）：</p>
<div class="table-wrap"><div class="professional-table" data-source-table="27"><article class="professional-record"><h3 id="pro-record-408">WB</h3><dl><dt>符号</dt><dd>WB</dd><dt>中文</dt><dd>账户余额（全仓为 crossWalletBalance）</dd><dt>说明</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-409">TMM1</h3><dl><dt>符号</dt><dd>TMM1</dd><dt>中文</dt><dd>其它合约的全部维持保证金（除合约 1）</dd><dt>说明</dt><dd>逐仓模式下视为 0</dd></dl></article><article class="professional-record"><h3 id="pro-record-410">UPNL1</h3><dl><dt>符号</dt><dd>UPNL1</dd><dt>中文</dt><dd>其它合约的未实现盈亏之和（除合约 1）</dd><dt>说明</dt><dd>逐仓模式下视为 0</dd></dl></article><article class="professional-record"><h3 id="pro-record-411">cumB / cumL / cumS</h3><dl><dt>符号</dt><dd>cumB / cumL / cumS</dd><dt>中文</dt><dd>单向 / 双向多 / 双向空的维持保证金速算额</dd><dt>说明</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-412">MMRB / MMRL / MMRS</h3><dl><dt>符号</dt><dd>MMRB / MMRL / MMRS</dd><dt>中文</dt><dd>单向 / 双向多 / 双向空的维持保证金率</dd><dt>说明</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-413">Side1BOTH</h3><dl><dt>符号</dt><dd>Side1BOTH</dd><dt>中文</dt><dd>合约 1 方向（单向模式），1 = 多，−1 = 空</dd><dt>说明</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-414">Position1BOTH / Position1LONG / Position1SHORT</h3><dl><dt>符号</dt><dd>Position1BOTH / Position1LONG / Position1SHORT</dd><dt>中文</dt><dd>持仓大小（取绝对值）</dd><dt>说明</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-415">EP1BOTH / EP1LONG / EP1SHORT</h3><dl><dt>符号</dt><dd>EP1BOTH / EP1LONG / EP1SHORT</dd><dt>中文</dt><dd>开仓均价</dd><dt>说明</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-416">MP</h3><dl><dt>符号</dt><dd>MP</dd><dt>中文</dt><dd>合约 1 的最新标记价格</dd><dt>说明</dt><dd></dd></dl></article></div></div>
<p>注意：强平价对应的名义价值所属档位，与计算时用的档位不一致时，要换成对应档位的 MMR 和速算额重算（【官方】）。</p>
<h4 id="professional-134-apifapiv1leveragebracket">13.4 币安 API「杠杆分层」字段（<code>/fapi/v1/leverageBracket</code>）</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="28"><article class="professional-record"><h3 id="pro-record-417">bracket</h3><dl><dt>字段</dt><dd>bracket</dd><dt>中文</dt><dd>层级编号</dd><dt>本项目对应</dt><dd>💡 <code>tier_no</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-418">initialLeverage</h3><dl><dt>字段</dt><dd>initialLeverage</dd><dt>中文</dt><dd>该层允许的最高初始杠杆倍数</dd><dt>本项目对应</dt><dd>💡 <code>max_leverage</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-419">notionalFloor</h3><dl><dt>字段</dt><dd>notionalFloor</dd><dt>中文</dt><dd>该层名义价值下限</dd><dt>本项目对应</dt><dd>💡 <code>notional_floor_amount</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-420">notionalCap</h3><dl><dt>字段</dt><dd>notionalCap</dd><dt>中文</dt><dd>该层名义价值上限</dd><dt>本项目对应</dt><dd>💡 <code>notional_cap_amount</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-421">maintMarginRatio</h3><dl><dt>字段</dt><dd>maintMarginRatio</dd><dt>中文</dt><dd>该层维持保证金率</dd><dt>本项目对应</dt><dd>💡 <code>maintenance_margin_rate</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-422">cum</h3><dl><dt>字段</dt><dd>cum</dd><dt>中文</dt><dd>速算数</dd><dt>本项目对应</dt><dd>💡 <code>maintenance_amount</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-423">notionalCoef</h3><dl><dt>字段</dt><dd>notionalCoef</dd><dt>中文</dt><dd>用户分层相对默认分层的倍数</dd><dt>本项目对应</dt><dd>—</dd></dl></article></div></div>
<h4 id="professional-135">13.5 本章遗留问题（落地前要验证）</h4>
<ol>
<li><strong>「单张价值」</strong>：已定名 <code>contract_value</code>（用户决定，对齐 OKX <code>ctVal</code>）。币安 U 本位用币数量下单，没有「张」的概念；币本位的「合约乘数」（如 BTCUSD = 100 USD）语义对应 <code>contract_value</code>。如果模拟盘 U 本位也按张下单，<code>contract_value</code> 的单位由 <code>contract_value_coin</code> 说明；是否同时需要 OKX 式独立的 <code>contract_multiplier</code>，见第 15 节。</li>
<li><strong>速算额的单位</strong>：U 本位是 USDT，币本位是币。币本位具体数值页面没给，需要从币安杠杆与保证金页面或 <code>leverageBracket</code> 接口取。</li>
<li><strong>资金费率上下限</strong>：中文页和英文页对 ADAUSDT 示例用的 MMR 不同（中文页 0.5%，英文页派生 0.65%），上下限数值不一致，<strong>以实际接口 <code>fundingInfo</code> 为准</strong>，不要抄示例数字。</li>
<li><strong>本章公式没有经过代码验证</strong>，只是抓取和整理。要落到清算服务前，建议用币安合约计算器对几组数据做交叉验证。</li>
</ol>
<hr>
<h4 id="professional-14">14. 同义多写法汇总（同一概念的所有叫法）</h4>
<blockquote>
<p>规则：一个概念有多种写法时全部列出。
「币安页面」列：<strong>✔</strong> = 在本次抓取的币安页面中实际看到；<strong>行业</strong> = 行业常见说法，<strong>未在币安页面核实</strong>。
「统一用」列是本项目文档 / 字段命名时应选的那一个，其余视为别名，不得再出现在字段名里（以 <code>field-naming.md</code> 为准）。</p>
</blockquote>
<h4 id="professional-141">14.1 保证金与公式</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="29"><article class="professional-record"><h3 id="pro-record-424">初始保证金</h3><dl><dt>概念</dt><dd>初始保证金</dd><dt>中文写法</dt><dd>起始保证金 ✔、初始保证金 ✔</dd><dt>英文写法</dt><dd>Initial Margin ✔、IM（行业）</dd><dt>币安页面</dt><dd>两种中文写法在币安文档并存</dd><dt>统一用</dt><dd>初始保证金 / Initial Margin</dd></dl></article><article class="professional-record"><h3 id="pro-record-425">初始保证金率</h3><dl><dt>概念</dt><dd>初始保证金率</dd><dt>中文写法</dt><dd>初始保证金率 ✔</dd><dt>英文写法</dt><dd>Initial Margin Rate ✔、IMR ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>IMR</dd></dl></article><article class="professional-record"><h3 id="pro-record-426">维持保证金</h3><dl><dt>概念</dt><dd>维持保证金</dd><dt>中文写法</dt><dd>维持保证金 ✔</dd><dt>英文写法</dt><dd>Maintenance Margin ✔、MM（行业）、<code>maintMargin</code>（API）✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>维持保证金</dd></dl></article><article class="professional-record"><h3 id="pro-record-427">维持保证金率</h3><dl><dt>概念</dt><dd>维持保证金率</dd><dt>中文写法</dt><dd>维持保证金率 ✔、维持保证金比率 ✔、维持保证金费率 ✔</dd><dt>英文写法</dt><dd>Maintenance Margin Rate ✔、Maintenance Margin Ratio ✔、MMR ✔、<code>maintMarginRatio</code>（API）✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>维持保证金率 / MMR</dd></dl></article><article class="professional-record"><h3 id="pro-record-428">速算额</h3><dl><dt>概念</dt><dd>速算额</dd><dt>中文写法</dt><dd>速算额 ✔、速算数 ✔、维持保证金额 ✔、维持保证金速算额 ✔</dd><dt>英文写法</dt><dd>Maintenance Amount ✔、<code>cum</code>（API）✔、cumB / cumL / cumS（强平变量）✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>速算额 / Maintenance Amount</dd></dl></article><article class="professional-record"><h3 id="pro-record-429">阶梯维持保证金</h3><dl><dt>概念</dt><dd>阶梯维持保证金</dd><dt>中文写法</dt><dd>分级 ✔、档位 ✔、仓位名义价值等级 ✔、杠杆分层 ✔、阶梯（行业）、税收超额累进法 ✔</dd><dt>英文写法</dt><dd>Tier、Bracket ✔、Position Bracket ✔、Maintenance Margin Tiers ✔、Tax Bracket setup ✔、<code>brackets</code>（API）✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>阶梯 / Tier（字段 <code>margin_tier</code>）</dd></dl></article><article class="professional-record"><h3 id="pro-record-430">保证金余额</h3><dl><dt>概念</dt><dd>保证金余额</dd><dt>中文写法</dt><dd>保证金余额 ✔、保证金总余额 ✔</dd><dt>英文写法</dt><dd>Margin Balance ✔、<code>marginBalance</code>、<code>totalMarginBalance</code> ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>保证金余额</dd></dl></article><article class="professional-record"><h3 id="pro-record-431">保证金率</h3><dl><dt>概念</dt><dd>保证金率</dd><dt>中文写法</dt><dd>保证金率（行业）、保证金水平 ✔（标题「保证金水平」）、风险率（行业）</dd><dt>英文写法</dt><dd>Margin Ratio（币安搜索结果标题）、Margin Level</dd><dt>币安页面</dt><dd>部分 ✔</dd><dt>统一用</dt><dd>保证金率 / Margin Ratio（定义必须固定公式）</dd></dl></article><article class="professional-record"><h3 id="pro-record-432">全仓 / 逐仓</h3><dl><dt>概念</dt><dd>全仓 / 逐仓</dd><dt>中文写法</dt><dd>全仓 ✔、逐仓 ✔</dd><dt>英文写法</dt><dd>Cross ✔、Isolated ✔、<code>isolated</code>（API）✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>全仓 / 逐仓</dd></dl></article><article class="professional-record"><h3 id="pro-record-433">名义价值</h3><dl><dt>概念</dt><dd>名义价值</dd><dt>中文写法</dt><dd>名义价值 ✔、仓位名义价值 ✔、持仓名义价值 ✔</dd><dt>英文写法</dt><dd>Notional Value ✔、Nominal Value of Positions ✔、<code>notional</code>（API）✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>名义价值 / Notional Value（字段 <code>notional_amount</code> ✅）</dd></dl></article><article class="professional-record"><h3 id="pro-record-434">单张合约价值</h3><dl><dt>概念</dt><dd>单张合约价值</dd><dt>中文写法</dt><dd>币安：合约乘数 ✔；OKX：合约面值 ✔；其它：单张合约价值 / 单张价值 / 每张面值（币安计算器页明确未使用）</dd><dt>英文写法</dt><dd>Contract Multiplier ✔（币安）、Size of a Contract ✔（币安）、Contract Size ✔（币安强平文，CM）、Contract Value ✔（OKX <code>ctVal</code>）、Face Value（行业）</dd><dt>币安页面</dt><dd>币安 ✔ / OKX ✔</dd><dt>统一用</dt><dd><strong>合约面值 / Contract Value（字段 <code>contract_value</code>）</strong></dd></dl></article><article class="professional-record"><h3 id="pro-record-435">OKX 合约乘数</h3><dl><dt>概念</dt><dd>OKX 合约乘数</dd><dt>中文写法</dt><dd>合约乘数 ✔（OKX）</dd><dt>英文写法</dt><dd>Contract multiplier ✔（OKX <code>ctMult</code>）</dd><dt>币安页面</dt><dd>OKX ✔</dd><dt>统一用</dt><dd><code>contract_multiplier</code>，与上一行是<strong>两个不同概念</strong>，别合并</dd></dl></article><article class="professional-record"><h3 id="pro-record-436">合约面值币种</h3><dl><dt>概念</dt><dd>合约面值币种</dd><dt>中文写法</dt><dd>合约面值计价币种 ✔（OKX）</dd><dt>英文写法</dt><dd>Contract value currency ✔（OKX <code>ctValCcy</code>）</dd><dt>币安页面</dt><dd>OKX ✔</dd><dt>统一用</dt><dd><code>contract_value_coin</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-437">杠杆</h3><dl><dt>概念</dt><dd>杠杆</dd><dt>中文写法</dt><dd>杠杆 ✔、杠杆倍数 ✔、杠杆等级 ✔</dd><dt>英文写法</dt><dd>Leverage ✔、Leverage Level ✔、<code>leverage</code> ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>杠杆倍数 / Leverage</dd></dl></article><article class="professional-record"><h3 id="pro-record-438">最高杠杆</h3><dl><dt>概念</dt><dd>最高杠杆</dd><dt>中文写法</dt><dd>最高杠杆 ✔、该层允许的最高初始杠杆倍数 ✔</dd><dt>英文写法</dt><dd>Max Leverage、<code>initialLeverage</code> ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>Max Leverage</dd></dl></article><article class="professional-record"><h3 id="pro-record-439">开仓价格</h3><dl><dt>概念</dt><dd>开仓价格</dd><dt>中文写法</dt><dd>开仓价格 ✔、开仓均价 ✔、持仓成本价 ✔、委托价格 ✔</dd><dt>英文写法</dt><dd>Entry Price ✔、<code>EP</code> ✔、<code>entryPrice</code> ✔、Average Entry Price（行业）、Open Price</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>开仓均价 / Entry Price</dd></dl></article><article class="professional-record"><h3 id="pro-record-440">回报率</h3><dl><dt>概念</dt><dd>回报率</dd><dt>中文写法</dt><dd>回报率 ✔、收益率（行业）</dd><dt>英文写法</dt><dd>ROI ✔、ROE（行业）</dd><dt>币安页面</dt><dd>ROI ✔</dd><dt>统一用</dt><dd>回报率 / ROI（合约页若写 ROE 视为同义）</dd></dl></article><article class="professional-record"><h3 id="pro-record-441">盈亏</h3><dl><dt>概念</dt><dd>盈亏</dd><dt>中文写法</dt><dd>盈亏 ✔、未实现盈亏 ✔、已实现盈亏（行业）</dd><dt>英文写法</dt><dd>PnL ✔、<code>unrealizedProfit</code> ✔、<code>UPNL</code> ✔、uPnL（行业）</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>PnL</dd></dl></article><article class="professional-record"><h3 id="pro-record-442">钱包余额</h3><dl><dt>概念</dt><dd>钱包余额</dd><dt>中文写法</dt><dd>钱包余额 ✔、账户余额 ✔、账户总余额 ✔、全仓账户余额 ✔</dd><dt>英文写法</dt><dd>Wallet Balance ✔、<code>walletBalance</code> ✔、<code>balance</code> ✔、<code>WB</code> ✔、<code>crossWalletBalance</code> ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>钱包余额（范围不同需写清全仓 / 逐仓）</dd></dl></article><article class="professional-record"><h3 id="pro-record-443">可用余额</h3><dl><dt>概念</dt><dd>可用余额</dd><dt>中文写法</dt><dd>可用余额 ✔</dd><dt>英文写法</dt><dd>Available Balance ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>可用余额</dd></dl></article><article class="professional-record"><h3 id="pro-record-444">最大可转出</h3><dl><dt>概念</dt><dd>最大可转出</dd><dt>中文写法</dt><dd>最大可转出余额 ✔</dd><dt>英文写法</dt><dd><code>maxWithdrawAmount</code> ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>最大可转出余额</dd></dl></article></div></div>
<h4 id="professional-142">14.2 价格</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="30"><article class="professional-record"><h3 id="pro-record-445">标记价格</h3><dl><dt>概念</dt><dd>标记价格</dd><dt>中文写法</dt><dd>标记价格 ✔、标记价 ✔</dd><dt>英文写法</dt><dd>Mark Price ✔、<code>MP</code> ✔、<code>MARK_PRICE</code> ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>标记价格</dd></dl></article><article class="professional-record"><h3 id="pro-record-446">指数价格</h3><dl><dt>概念</dt><dd>指数价格</dd><dt>中文写法</dt><dd>价格指数 ✔、指数价格（行业）</dd><dt>英文写法</dt><dd>Price Index ✔、Index Price（行业；币安 API 用 index price K 线）</dd><dt>币安页面</dt><dd>两种都有</dd><dt>统一用</dt><dd><strong>价格指数</strong>（币安资金费文）；字段 <code>index_price</code> ✅ 已入规范，保持</dd></dl></article><article class="professional-record"><h3 id="pro-record-447">最新价</h3><dl><dt>概念</dt><dd>最新价</dd><dt>中文写法</dt><dd>最新价 ✔、合约价格 ✔、合约最新价 ✔</dd><dt>英文写法</dt><dd>Last Price（行业）、<code>CONTRACT_PRICE</code> ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>最新价</dd></dl></article><article class="professional-record"><h3 id="pro-record-448">结算价</h3><dl><dt>概念</dt><dd>结算价</dd><dt>中文写法</dt><dd>结算价格 ✔</dd><dt>英文写法</dt><dd>Settlement Price ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>结算价</dd></dl></article><article class="professional-record"><h3 id="pro-record-449">溢价指数</h3><dl><dt>概念</dt><dd>溢价指数</dd><dt>中文写法</dt><dd>溢价指数 ✔</dd><dt>英文写法</dt><dd>Premium Index ✔、<code>P</code> ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>溢价指数</dd></dl></article><article class="professional-record"><h3 id="pro-record-450">冲击买价 / 卖价</h3><dl><dt>概念</dt><dd>冲击买价 / 卖价</dd><dt>中文写法</dt><dd>冲击买价 ✔、冲击卖价 ✔</dd><dt>英文写法</dt><dd>Impact Bid Price ✔、Impact Ask Price ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>冲击买价 / 卖价</dd></dl></article><article class="professional-record"><h3 id="pro-record-451">冲击保证金额</h3><dl><dt>概念</dt><dd>冲击保证金额</dd><dt>中文写法</dt><dd>冲击保证金额 ✔</dd><dt>英文写法</dt><dd>Impact Margin Notional ✔、IMN ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>IMN</dd></dl></article><article class="professional-record"><h3 id="pro-record-452">强平价格</h3><dl><dt>概念</dt><dd>强平价格</dd><dt>中文写法</dt><dd>强平价 ✔、强平价格 ✔</dd><dt>英文写法</dt><dd>Liquidation Price ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>强平价</dd></dl></article><article class="professional-record"><h3 id="pro-record-453">触发价</h3><dl><dt>概念</dt><dd>触发价</dd><dt>中文写法</dt><dd>触发价 ✔、触发价格 ✔、激活价 ✔（追踪）</dd><dt>英文写法</dt><dd>Trigger Price ✔、Stop Price ✔、<code>stopPrice</code> ✔、<code>triggerPrice</code> ✔、<code>activatePrice</code> ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>触发价（追踪用「激活价」另算）</dd></dl></article><article class="professional-record"><h3 id="pro-record-454">跟踪止损</h3><dl><dt>概念</dt><dd>跟踪止损</dd><dt>中文写法</dt><dd>跟踪止损单 ✔、追踪委托（行业）</dd><dt>英文写法</dt><dd>Trailing Stop ✔、<code>TRAILING_STOP_MARKET</code> ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>跟踪止损</dd></dl></article><article class="professional-record"><h3 id="pro-record-455">回调比例</h3><dl><dt>概念</dt><dd>回调比例</dd><dt>中文写法</dt><dd>回调比例 ✔、回调幅度（行业）</dd><dt>英文写法</dt><dd>Callback Rate ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>回调比例</dd></dl></article></div></div>
<h4 id="professional-143">14.3 资金费率</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="31"><article class="professional-record"><h3 id="pro-record-456">资金费率</h3><dl><dt>概念</dt><dd>资金费率</dd><dt>中文写法</dt><dd>资金费率 ✔</dd><dt>英文写法</dt><dd>Funding Rate ✔、<code>F</code> ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>资金费率</dd></dl></article><article class="professional-record"><h3 id="pro-record-457">资金费用</h3><dl><dt>概念</dt><dd>资金费用</dd><dt>中文写法</dt><dd>资金费用 ✔、资金费 ✔</dd><dt>英文写法</dt><dd>Funding Fee ✔、Funding Amount ✔、Funding Payment（行业）</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>资金费用</dd></dl></article><article class="professional-record"><h3 id="pro-record-458">资金费率间隔</h3><dl><dt>概念</dt><dd>资金费率间隔</dd><dt>中文写法</dt><dd>资金费用收取间隔 ✔、资金支付间隔 ✔、结算间隔</dd><dt>英文写法</dt><dd>Funding Interval ✔、<code>N</code> ✔、Funding Interval Adjustment ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>资金费间隔</dd></dl></article><article class="professional-record"><h3 id="pro-record-459">利率</h3><dl><dt>概念</dt><dd>利率</dd><dt>中文写法</dt><dd>利率 ✔</dd><dt>英文写法</dt><dd>Interest Rate ✔、<code>I</code> ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>利率</dd></dl></article><article class="professional-record"><h3 id="pro-record-460">资金费率上下限</h3><dl><dt>概念</dt><dd>资金费率上下限</dd><dt>中文写法</dt><dd>资金费率上限 / 下限 ✔</dd><dt>英文写法</dt><dd>Cap / Floor ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>上限 / 下限</dd></dl></article><article class="professional-record"><h3 id="pro-record-461">平均溢价指数</h3><dl><dt>概念</dt><dd>平均溢价指数</dd><dt>中文写法</dt><dd>平均溢价指数 ✔、时间加权 ✔</dd><dt>英文写法</dt><dd>Average Premium Index ✔、time-weighted ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>平均溢价指数</dd></dl></article></div></div>
<h4 id="professional-144">14.4 订单与持仓</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="32"><article class="professional-record"><h3 id="pro-record-462">持仓</h3><dl><dt>概念</dt><dd>持仓</dd><dt>中文写法</dt><dd>持仓 ✔、仓位 ✔、头寸 ✔</dd><dt>英文写法</dt><dd>Position ✔、<code>positionAmt</code> ✔</dd><dt>币安页面</dt><dd>✔（三种都出现）</dd><dt>统一用</dt><dd>仓位 / Position</dd></dl></article><article class="professional-record"><h3 id="pro-record-463">持仓方向</h3><dl><dt>概念</dt><dd>持仓方向</dd><dt>中文写法</dt><dd>持仓方向 ✔、单一持仓方向 ✔</dd><dt>英文写法</dt><dd>Position Side ✔、<code>positionSide</code> ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>持仓方向</dd></dl></article><article class="professional-record"><h3 id="pro-record-464">持仓模式</h3><dl><dt>概念</dt><dd>持仓模式</dd><dt>中文写法</dt><dd>单向持仓 / 双向持仓 ✔</dd><dt>英文写法</dt><dd>One-Way Mode / Hedge Mode（行业）</dd><dt>币安页面</dt><dd>中文 ✔</dd><dt>统一用</dt><dd>单向 / 双向持仓</dd></dl></article><article class="professional-record"><h3 id="pro-record-465">订单</h3><dl><dt>概念</dt><dd>订单</dd><dt>中文写法</dt><dd>订单 ✔、委托 ✔</dd><dt>英文写法</dt><dd>Order ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>订单（界面用「委托」）</dd></dl></article><article class="professional-record"><h3 id="pro-record-466">撤单</h3><dl><dt>概念</dt><dd>撤单</dd><dt>中文写法</dt><dd>撤销 ✔、撤单 ✔</dd><dt>英文写法</dt><dd>Cancel ✔、<code>CANCELED</code> ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>撤单</dd></dl></article><article class="professional-record"><h3 id="pro-record-467">只减仓</h3><dl><dt>概念</dt><dd>只减仓</dd><dt>中文写法</dt><dd>只减仓 ✔、减仓（行业）</dd><dt>英文写法</dt><dd>Reduce Only ✔、<code>reduceOnly</code> ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>只减仓</dd></dl></article><article class="professional-record"><h3 id="pro-record-468">只做 Maker</h3><dl><dt>概念</dt><dd>只做 Maker</dd><dt>中文写法</dt><dd>无法成为挂单方则撤销 ✔（GTX）、只做 Maker（行业）</dd><dt>英文写法</dt><dd>GTX ✔、Post Only ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>Post-Only（GTX）</dd></dl></article><article class="professional-record"><h3 id="pro-record-469">平仓</h3><dl><dt>概念</dt><dd>平仓</dd><dt>中文写法</dt><dd>全部平仓 ✔、平仓单</dd><dt>英文写法</dt><dd>Close Position ✔、<code>closePosition</code> ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>全部平仓</dd></dl></article><article class="professional-record"><h3 id="pro-record-470">止损 / 止盈</h3><dl><dt>概念</dt><dd>止损 / 止盈</dd><dt>中文写法</dt><dd>止损单 ✔、止盈单 ✔、止损限价 ✔、止损市价 ✔</dd><dt>英文写法</dt><dd>Stop / Take Profit ✔、SL / TP（行业）</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>止损 / 止盈</dd></dl></article><article class="professional-record"><h3 id="pro-record-471">自成交保护</h3><dl><dt>概念</dt><dd>自成交保护</dd><dt>中文写法</dt><dd>防止自成交 ✔、自成交保护 ✔</dd><dt>英文写法</dt><dd>Self Trade Prevention ✔、STP ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>自成交保护 / STP</dd></dl></article><article class="professional-record"><h3 id="pro-record-472">触发类型</h3><dl><dt>概念</dt><dd>触发类型</dd><dt>中文写法</dt><dd>条件价格触发类型 ✔</dd><dt>英文写法</dt><dd>Working Type ✔、<code>workingType</code> ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>触发价格类型</dd></dl></article></div></div>
<h4 id="professional-145">14.5 合约与风控</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="33"><article class="professional-record"><h3 id="pro-record-473">永续合约</h3><dl><dt>概念</dt><dd>永续合约</dd><dt>中文写法</dt><dd>永续合约 ✔、永续</dd><dt>英文写法</dt><dd>Perpetual ✔、PERP ✔、Perpetual Swap（行业）、SWAP（OKX）</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>永续合约 / Perpetual</dd></dl></article><article class="professional-record"><h3 id="pro-record-474">交割合约</h3><dl><dt>概念</dt><dd>交割合约</dd><dt>中文写法</dt><dd>交割合约 ✔、期货 ✔</dd><dt>英文写法</dt><dd>Delivery Futures（行业）、FUTURE ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>交割合约</dd></dl></article><article class="professional-record"><h3 id="pro-record-475">币本位合约</h3><dl><dt>概念</dt><dd>币本位合约</dd><dt>中文写法</dt><dd>币本位 ✔、幣本位（繁体）✔</dd><dt>英文写法</dt><dd>Coin-Margined ✔、COIN-M ✔、Inverse（行业）</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>币本位</dd></dl></article><article class="professional-record"><h3 id="pro-record-476">U 本位合约</h3><dl><dt>概念</dt><dd>U 本位合约</dd><dt>中文写法</dt><dd>U 本位 ✔、U本位 ✔</dd><dt>英文写法</dt><dd>USDⓈ-Margined ✔、USDⓈ-M ✔、USDT-Margined ✔、Linear（行业）</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>U 本位</dd></dl></article><article class="professional-record"><h3 id="pro-record-477">强平</h3><dl><dt>概念</dt><dd>强平</dd><dt>中文写法</dt><dd>强平 ✔、强制平仓（行业）、爆仓（口语）</dd><dt>英文写法</dt><dd>Liquidation ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>强平 / Liquidation</dd></dl></article><article class="professional-record"><h3 id="pro-record-478">强平费用</h3><dl><dt>概念</dt><dd>强平费用</dd><dt>中文写法</dt><dd>强平费 / 强平费率 ✔</dd><dt>英文写法</dt><dd>Liquidation Fee ✔、<code>liquidationFee</code> ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>强平费率</dd></dl></article><article class="professional-record"><h3 id="pro-record-479">下架</h3><dl><dt>概念</dt><dd>下架</dd><dt>中文写法</dt><dd>已下架 ✔</dd><dt>英文写法</dt><dd>Delisted（行业）、<code>CLOSE</code> ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>已下架</dd></dl></article><article class="professional-record"><h3 id="pro-record-480">暂停交易</h3><dl><dt>概念</dt><dd>暂停交易</dd><dt>中文写法</dt><dd>交易暂停 ✔</dd><dt>英文写法</dt><dd>Halt ✔、<code>TRADING_HALT</code> ✔</dd><dt>币安页面</dt><dd>✔</dd><dt>统一用</dt><dd>交易暂停</dd></dl></article></div></div>
<h4 id="professional-146">14.6 使用约定</h4>
<ol>
<li><strong>同概念只能有一种字段名</strong>：上表「统一用」之外的写法只作为查词别名，不得进入 DB / Kafka / Redis / API 字段。</li>
<li><strong>币安的 camelCase 字段</strong> 全部要转 snake_case，并按 <code>field-naming.md</code> 禁用别名再核一次（例如 <code>positionAmt</code> 的 <code>amt</code> 在本项目规范里不可用，要用 <code>_qty</code>）。</li>
<li><strong>表中「行业」标记的写法没有在币安页面核实</strong>，只能作为参考，不能当作币安官方叫法对外引用。</li>
<li>发现新的写法，补进对应行并标注出处；写法冲突时，在「统一用」里写明选择理由。</li>
</ol>
<hr>
<h4 id="professional-15-okx-okx-api-v5">15. OKX 字段中英映照（来自 OKX API v5 文档）</h4>
<blockquote>
<p>来源：OKX API v5 中文 / 英文文档，「获取交易产品基础信息」(<code>/api/v5/account/instruments</code>) 和「账户余额」「持仓信息」的响应参数表，2026-10-27 抓取。
<strong>局限</strong>：OKX 官方文档单页被抓取工具截断，公共接口（<code>public/instruments</code>、<code>funding-rate</code>、<code>position-tiers</code> 等）官方正文<strong>没有抓到</strong>；账户 instruments 与公共 instruments 字段基本相同，但我没有逐项核对。补抓结果（三方 SDK + 帮助中心）见 15.6。
用户决定：单张合约价值定名 <strong><code>contract_value</code></strong>，对齐 OKX <code>ctVal</code>。</p>
</blockquote>
<h4 id="professional-151">15.1 产品基础信息</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="34"><article class="professional-record"><h3 id="pro-record-481">instType</h3><dl><dt>OKX 字段</dt><dd>instType</dd><dt>OKX 中文</dt><dd>产品类型：SPOT 币币、MARGIN 币币杠杆、SWAP 永续、FUTURES 交割、OPTION 期权、EVENTS 事件合约</dd><dt>OKX 英文</dt><dd>Instrument type</dd><dt>本项目对应</dt><dd>💡 <code>inst_type</code>（项目用 <code>account_type</code> / <code>symbol</code>，需定是否单列）</dd></dl></article><article class="professional-record"><h3 id="pro-record-482">instId</h3><dl><dt>OKX 字段</dt><dd>instId</dd><dt>OKX 中文</dt><dd>产品 ID，如 BTC-USDT-SWAP</dd><dt>OKX 英文</dt><dd>Instrument ID</dd><dt>本项目对应</dt><dd><code>symbol</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-483">uly</h3><dl><dt>OKX 字段</dt><dd>uly</dd><dt>OKX 中文</dt><dd>标的指数，如 BTC-USD</dd><dt>OKX 英文</dt><dd>Underlying index</dd><dt>本项目对应</dt><dd>💡 <code>underlying</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-484">instFamily</h3><dl><dt>OKX 字段</dt><dd>instFamily</dd><dt>OKX 中文</dt><dd>交易品种，如 BTC-USD</dd><dt>OKX 英文</dt><dd>Instrument family</dd><dt>本项目对应</dt><dd>💡 <code>inst_family</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-485">baseCcy</h3><dl><dt>OKX 字段</dt><dd>baseCcy</dd><dt>OKX 中文</dt><dd>交易货币（仅币币 / 币币杠杆）</dd><dt>OKX 英文</dt><dd>Base currency</dd><dt>本项目对应</dt><dd><code>base_coin</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-486">quoteCcy</h3><dl><dt>OKX 字段</dt><dd>quoteCcy</dd><dt>OKX 中文</dt><dd>计价货币（仅币币 / 币币杠杆）</dd><dt>OKX 英文</dt><dd>Quote currency</dd><dt>本项目对应</dt><dd><code>quote_coin</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-487">settleCcy</h3><dl><dt>OKX 字段</dt><dd>settleCcy</dd><dt>OKX 中文</dt><dd>盈亏结算和保证金币种（交割 / 永续 / 期权）</dd><dt>OKX 英文</dt><dd>Settlement and margin currency</dd><dt>本项目对应</dt><dd>💡 <code>settle_coin</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-488">ctVal</h3><dl><dt>OKX 字段</dt><dd><strong>ctVal</strong></dd><dt>OKX 中文</dt><dd><strong>合约面值</strong>（交割 / 永续 / 期权）</dd><dt>OKX 英文</dt><dd><strong>Contract value</strong></dd><dt>本项目对应</dt><dd>✅ <strong><code>contract_value</code></strong></dd></dl></article><article class="professional-record"><h3 id="pro-record-489">ctMult</h3><dl><dt>OKX 字段</dt><dd>ctMult</dd><dt>OKX 中文</dt><dd>合约乘数（交割 / 永续 / 期权）</dd><dt>OKX 英文</dt><dd>Contract multiplier</dd><dt>本项目对应</dt><dd>💡 <code>contract_multiplier</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-490">ctValCcy</h3><dl><dt>OKX 字段</dt><dd>ctValCcy</dd><dt>OKX 中文</dt><dd>合约面值计价币种</dd><dt>OKX 英文</dt><dd>Contract value currency</dd><dt>本项目对应</dt><dd>💡 <code>contract_value_coin</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-491">ctType</h3><dl><dt>OKX 字段</dt><dd>ctType</dd><dt>OKX 中文</dt><dd>合约类型：linear 正向、inverse 反向</dd><dt>OKX 英文</dt><dd>Contract type</dd><dt>本项目对应</dt><dd>💡 <code>contract_type</code>（线性 / 反向，TINYINT）</dd></dl></article><article class="professional-record"><h3 id="pro-record-492">optType</h3><dl><dt>OKX 字段</dt><dd>optType</dd><dt>OKX 中文</dt><dd>期权类型 C / P</dd><dt>OKX 英文</dt><dd>Option type</dd><dt>本项目对应</dt><dd>💡 <code>option_type</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-493">stk</h3><dl><dt>OKX 字段</dt><dd>stk</dd><dt>OKX 中文</dt><dd>行权价格</dd><dt>OKX 英文</dt><dd>Strike price</dd><dt>本项目对应</dt><dd>💡 <code>strike_price</code> ✅（规范 §4.4 已有）</dd></dl></article><article class="professional-record"><h3 id="pro-record-494">listTime</h3><dl><dt>OKX 字段</dt><dd>listTime</dd><dt>OKX 中文</dt><dd>上线时间（毫秒）</dd><dt>OKX 英文</dt><dd>Listing time</dd><dt>本项目对应</dt><dd>💡 <code>list_time</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-495">expTime</h3><dl><dt>OKX 字段</dt><dd>expTime</dd><dt>OKX 中文</dt><dd>产品下线时间；交割 / 期权为交割或行权日期</dd><dt>OKX 英文</dt><dd>Expiry time</dd><dt>本项目对应</dt><dd><code>expire_time</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-496">lever</h3><dl><dt>OKX 字段</dt><dd>lever</dd><dt>OKX 中文</dt><dd>该产品支持的最大杠杆倍数</dd><dt>OKX 英文</dt><dd>Maximum leverage</dd><dt>本项目对应</dt><dd>💡 <code>max_leverage</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-497">tickSz</h3><dl><dt>OKX 字段</dt><dd>tickSz</dd><dt>OKX 中文</dt><dd>下单价格精度</dd><dt>OKX 英文</dt><dd>Tick size</dd><dt>本项目对应</dt><dd>💡 <code>tick_size</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-498">lotSz</h3><dl><dt>OKX 字段</dt><dd>lotSz</dd><dt>OKX 中文</dt><dd>下单数量精度（合约单位为张）</dd><dt>OKX 英文</dt><dd>Lot size</dd><dt>本项目对应</dt><dd>💡 <code>lot_size</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-499">minSz</h3><dl><dt>OKX 字段</dt><dd>minSz</dd><dt>OKX 中文</dt><dd>最小下单数量（单位同 lotSz）</dd><dt>OKX 英文</dt><dd>Minimum order size</dd><dt>本项目对应</dt><dd>💡 <code>min_qty</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-500">maxLmtSz / maxMktSz</h3><dl><dt>OKX 字段</dt><dd>maxLmtSz / maxMktSz</dd><dt>OKX 中文</dt><dd>限价 / 市价单笔最大委托数量</dd><dt>OKX 英文</dt><dd>Max limit / market order size</dd><dt>本项目对应</dt><dd>💡 <code>max_limit_qty</code> / <code>max_market_qty</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-501">maxLmtAmt</h3><dl><dt>OKX 字段</dt><dd>maxLmtAmt</dd><dt>OKX 中文</dt><dd>限价单笔最大美元价值</dd><dt>OKX 英文</dt><dd>Max limit order notional (USD)</dd><dt>本项目对应</dt><dd>💡 <code>max_limit_notional_amount</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-502">state</h3><dl><dt>OKX 字段</dt><dd>state</dd><dt>OKX 中文</dt><dd>产品状态：live 交易中、suspend 暂停、rebase 变基中、post_only 仅挂单、preopen 预上线、test 测试中、settling 结算中</dd><dt>OKX 英文</dt><dd>Instrument status</dd><dt>本项目对应</dt><dd><code>status</code></dd></dl></article></div></div>
<blockquote>
<p><strong>OKX <code>post_only</code>（仅挂单）与币安 <code>TRADING_CANCEL_ONLY</code>（只挂单）名字像但语义不一定相同</strong>：前者字面是「只允许挂单」，币安该枚举的中文「只挂单」与枚举名「仅撤单」互相矛盾，见 12.2。</p>
</blockquote>
<h4 id="professional-152">15.2 账户</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="35"><article class="professional-record"><h3 id="pro-record-503">totalEq</h3><dl><dt>OKX 字段</dt><dd>totalEq</dd><dt>OKX 中文</dt><dd>总权益（USD）</dd><dt>英文</dt><dd>Total equity</dd><dt>本项目对应</dt><dd>💡 <code>total_equity</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-504">adjEq</h3><dl><dt>OKX 字段</dt><dd>adjEq</dd><dt>OKX 中文</dt><dd>调整后权益（USD）</dd><dt>英文</dt><dd>Adjusted equity</dd><dt>本项目对应</dt><dd>💡 <code>adjusted_equity</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-505">availEq</h3><dl><dt>OKX 字段</dt><dd>availEq</dd><dt>OKX 中文</dt><dd>可用保证金（USD / 分币种）</dd><dt>英文</dt><dd>Available equity</dd><dt>本项目对应</dt><dd>💡 <code>available_equity</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-506">eq</h3><dl><dt>OKX 字段</dt><dd>eq</dd><dt>OKX 中文</dt><dd>该币种总权益</dd><dt>英文</dt><dd>Equity of currency</dd><dt>本项目对应</dt><dd>💡 <code>equity</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-507">cashBal</h3><dl><dt>OKX 字段</dt><dd>cashBal</dd><dt>OKX 中文</dt><dd>该币种余额</dd><dt>英文</dt><dd>Cash balance</dd><dt>本项目对应</dt><dd>💡 <code>cash_balance</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-508">availBal</h3><dl><dt>OKX 字段</dt><dd>availBal</dd><dt>OKX 中文</dt><dd>该币种可用余额</dd><dt>英文</dt><dd>Available balance</dd><dt>本项目对应</dt><dd><code>available_balance</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-509">frozenBal</h3><dl><dt>OKX 字段</dt><dd>frozenBal</dd><dt>OKX 中文</dt><dd>该币种占用金额</dd><dt>英文</dt><dd>Frozen balance</dd><dt>本项目对应</dt><dd><code>frozen_balance</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-510">ordFrozen</h3><dl><dt>OKX 字段</dt><dd>ordFrozen</dd><dt>OKX 中文</dt><dd>挂单冻结数量</dd><dt>英文</dt><dd>Frozen for orders</dd><dt>本项目对应</dt><dd>💡 <code>order_frozen_balance</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-511">isoEq</h3><dl><dt>OKX 字段</dt><dd>isoEq</dd><dt>OKX 中文</dt><dd>该币种逐仓仓位权益</dd><dt>英文</dt><dd>Isolated equity</dd><dt>本项目对应</dt><dd>💡 <code>isolated_equity</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-512">imr</h3><dl><dt>OKX 字段</dt><dd>imr</dd><dt>OKX 中文</dt><dd>初始保证金要求（全仓持仓及挂单之和）</dd><dt>英文</dt><dd>Initial margin requirement</dd><dt>本项目对应</dt><dd>💡 <code>initial_margin</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-513">mmr</h3><dl><dt>OKX 字段</dt><dd>mmr</dd><dt>OKX 中文</dt><dd>维持保证金要求，低于该值时开始强平</dd><dt>英文</dt><dd>Maintenance margin requirement</dd><dt>本项目对应</dt><dd>💡 <code>maintenance_margin</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-514">mgnRatio（账户级）</h3><dl><dt>OKX 字段</dt><dd><strong>mgnRatio（账户级）</strong></dd><dt>OKX 中文</dt><dd><strong>账户保证金率 = adjEq ÷ mmr，接近 1.0 为强平边界</strong></dd><dt>英文</dt><dd>Margin ratio</dd><dt>本项目对应</dt><dd>💡 <code>margin_ratio</code>，见 15.4</dd></dl></article><article class="professional-record"><h3 id="pro-record-515">notionalUsd</h3><dl><dt>OKX 字段</dt><dd>notionalUsd</dd><dt>OKX 中文</dt><dd>所有衍生品持仓名义价值合计（USD），多空不轧差</dd><dt>英文</dt><dd>Notional value in USD</dd><dt>本项目对应</dt><dd><code>notional_amount</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-516">upl</h3><dl><dt>OKX 字段</dt><dd>upl</dd><dt>OKX 中文</dt><dd>未实现盈亏</dd><dt>英文</dt><dd>Unrealized P&amp;L</dd><dt>本项目对应</dt><dd>💡 <code>unrealized_pnl</code></dd></dl></article></div></div>
<h4 id="professional-153">15.3 持仓</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="36"><article class="professional-record"><h3 id="pro-record-517">mgnMode</h3><dl><dt>OKX 字段</dt><dd>mgnMode</dd><dt>OKX 中文</dt><dd>保证金模式：cross 全仓、isolated 逐仓</dd><dt>英文</dt><dd>Margin mode</dd><dt>本项目对应</dt><dd>💡 <code>margin_mode</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-518">posSide</h3><dl><dt>OKX 字段</dt><dd>posSide</dd><dt>OKX 中文</dt><dd>持仓方向：long 开多、short 开空（开平仓模式），net 为买卖模式</dd><dt>英文</dt><dd>Position side</dd><dt>本项目对应</dt><dd><code>position_side</code> ✅（LONG / SHORT / BOTH）</dd></dl></article><article class="professional-record"><h3 id="pro-record-519">pos</h3><dl><dt>OKX 字段</dt><dd>pos</dd><dt>OKX 中文</dt><dd>持仓量，衍生品单位为张；net 模式正数为多、负数为空</dd><dt>英文</dt><dd>Position quantity</dd><dt>本项目对应</dt><dd>💡 <code>position_qty</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-520">avgPx</h3><dl><dt>OKX 字段</dt><dd>avgPx</dd><dt>OKX 中文</dt><dd>成交量加权平均开仓价</dd><dt>英文</dt><dd>Average open price</dd><dt>本项目对应</dt><dd>💡 <code>entry_price</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-521">markPx</h3><dl><dt>OKX 字段</dt><dd>markPx</dd><dt>OKX 中文</dt><dd>最新标记价格</dd><dt>英文</dt><dd>Mark price</dd><dt>本项目对应</dt><dd><code>mark_price</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-522">lever</h3><dl><dt>OKX 字段</dt><dd>lever</dd><dt>OKX 中文</dt><dd>杠杆倍数</dd><dt>英文</dt><dd>Leverage</dd><dt>本项目对应</dt><dd>💡 <code>leverage</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-523">liqPx</h3><dl><dt>OKX 字段</dt><dd>liqPx</dd><dt>OKX 中文</dt><dd>预估强平价格（估算值）</dd><dt>英文</dt><dd>Estimated liquidation price</dd><dt>本项目对应</dt><dd><code>liquidation_price</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-524">imr</h3><dl><dt>OKX 字段</dt><dd>imr</dd><dt>OKX 中文</dt><dd>全仓持仓初始保证金（逐仓返回空串）</dd><dt>英文</dt><dd>Initial margin</dd><dt>本项目对应</dt><dd><code>initial_margin</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-525">mmr</h3><dl><dt>OKX 字段</dt><dd>mmr</dd><dt>OKX 中文</dt><dd>维持保证金</dd><dt>英文</dt><dd>Maintenance margin</dd><dt>本项目对应</dt><dd><code>maintenance_margin</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-526">mgnRatio（持仓级）</h3><dl><dt>OKX 字段</dt><dd><strong>mgnRatio（持仓级）</strong></dd><dt>OKX 中文</dt><dd><strong>维持保证金率</strong></dd><dt>英文</dt><dd>Maintenance margin ratio</dd><dt>本项目对应</dt><dd>💡 <code>maintenance_margin_rate</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-527">margin</h3><dl><dt>OKX 字段</dt><dd>margin</dd><dt>OKX 中文</dt><dd>保证金余额，可增减，仅逐仓适用</dd><dt>英文</dt><dd>Margin</dd><dt>本项目对应</dt><dd>💡 <code>isolated_margin</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-528">upl / uplRatio</h3><dl><dt>OKX 字段</dt><dd>upl / uplRatio</dd><dt>OKX 中文</dt><dd>未实现盈亏 / 未实现收益率（按标记价格）</dd><dt>英文</dt><dd>Unrealized P&amp;L / ratio</dd><dt>本项目对应</dt><dd><code>unrealized_pnl</code> / <code>unrealized_pnl_ratio</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-529">fee</h3><dl><dt>OKX 字段</dt><dd>fee</dd><dt>OKX 中文</dt><dd>开仓以来累计手续费；正数为平台返佣、负数为平台扣除</dd><dt>英文</dt><dd>Accumulated fee</dd><dt>本项目对应</dt><dd><code>fee_amount</code> ✅（<strong>符号约定与多数系统相反，务必注明</strong>）</dd></dl></article><article class="professional-record"><h3 id="pro-record-530">fundingFee</h3><dl><dt>OKX 字段</dt><dd>fundingFee</dd><dt>OKX 中文</dt><dd>累计资金费用</dd><dt>英文</dt><dd>Accumulated funding fee</dd><dt>本项目对应</dt><dd>💡 <code>funding_fee_amount</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-531">adl</h3><dl><dt>OKX 字段</dt><dd>adl</dd><dt>OKX 中文</dt><dd>ADL 指标 0–5，数值越大越可能被优先减仓</dd><dt>英文</dt><dd>Auto-deleveraging indicator</dd><dt>本项目对应</dt><dd>💡 <code>adl_rank</code></dd></dl></article></div></div>
<h4 id="professional-154">15.4 同名不同义（最容易踩坑）</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="37"><article class="professional-record"><h3 id="pro-record-532">mgnRatio</h3><dl><dt>字段名</dt><dd><code>mgnRatio</code></dd><dt>OKX 账户级含义</dt><dd><strong>账户保证金率</strong> = adjEq ÷ mmr（越大越安全，≈1 强平）</dd><dt>OKX 持仓级含义</dt><dd><strong>维持保证金率</strong>（档位比率）</dd><dt>与币安的关系</dt><dd>币安「维持保证金率」是后者；币安账户级没有同名字段。<strong>两个口径落库必须分开命名</strong>：<code>margin_ratio</code> vs <code>maintenance_margin_rate</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-533">imr / mmr</h3><dl><dt>字段名</dt><dd><code>imr</code> / <code>mmr</code></dd><dt>OKX 账户级含义</dt><dd>账户内全仓之和，USD</dd><dt>OKX 持仓级含义</dt><dd>单仓位，USD</dd><dt>与币安的关系</dt><dd>币安 <code>initialMargin</code> / <code>maintMargin</code> 单位跟随账户模式，口径不同</dd></dl></article><article class="professional-record"><h3 id="pro-record-534">合约乘数</h3><dl><dt>字段名</dt><dd>合约乘数</dd><dt>OKX 账户级含义</dt><dd><code>ctMult</code>（独立字段）</dd><dt>OKX 持仓级含义</dt><dd>—</dd><dt>与币安的关系</dt><dd>币安「合约乘数」≈ OKX <code>ctVal</code>，不是 OKX <code>ctMult</code></dd></dl></article></div></div>
<h4 id="professional-155-contract_value">15.5 <code>contract_value</code> 使用说明</h4>
<ol>
<li><strong>字段定名</strong>：<code>contract_value</code>（单张合约价值）+ <code>contract_value_coin</code>（面值计价币种），对应 OKX <code>ctVal</code> + <code>ctValCcy</code>。需要时再加 <code>contract_multiplier</code>（对应 OKX <code>ctMult</code>）。</li>
<li><strong>用于名义价值的公式【推断，未验证】</strong>：
   - 反向（币本位）：<code>名义价值（币）= 张数 × contract_value ÷ 价格</code>，与币安币本位示例 <code>(10 × 100 USD) ÷ 9,800</code> 同构。
   - 正向（U 本位按张）：<code>名义价值 = 张数 × contract_value × 价格</code>，此时 <code>contract_value</code> 的单位是标的币（如 0.01 BTC/张，<strong>数值来自我的记忆，未核实</strong>）。
   - <code>ctMult</code> 的作用：OKX 帮助中心的资金费用页给出，U 本位仓位价值 = 张数 × 合约面值 × 合约乘数 × 标记价格，币本位 = 张数 × 合约面值 × 合约乘数 ÷ 标记价格（见 15.6）。所以 <code>contract_value</code> 与 <code>contract_multiplier</code> 是<strong>连乘</strong>关系，不能合并。</li>
<li><strong>规范核对</strong>：<code>contract_value</code> 不在 <code>field-naming.md</code> 禁用别名内；但「金额必须带业务前缀」规则针对裸 <code>amount</code>，这里不触发。若你们希望统一后缀，也可考虑 <code>contract_value_amount</code>，需过一下架构组。</li>
</ol>
<h4 id="professional-156">15.6 补抓结果（公共接口字段 + 帮助中心公式）</h4>
<blockquote>
<p>来源标记：<strong>【帮助中心】</strong>OKX 帮助中心页面原文；<strong>【三方SDK】</strong>Go / Rust SDK 的结构体定义（字段名可靠，单位和语义须以官方文档为准）；<strong>【计算】</strong>我算的。</p>
</blockquote>
<p><strong>(1) 公共 instruments 额外字段【三方SDK】</strong>：<code>groupId</code>、<code>tradeQuoteCcyList</code>、<code>settCcy</code>（与 <code>settleCcy</code> 并存，含义差异未核实）、<code>ruleType</code>、<code>instIdCode</code>、<code>instCategory</code>。SDK 里最大杠杆字段叫 <code>leverage</code>，官方账户 instruments 文档里叫 <code>lever</code>，<strong>两者命名不一致，以实际返回为准</strong>。</p>
<p><strong>(2) 资金费率接口字段（<code>public/funding-rate</code>）【三方SDK】</strong></p>
<div class="table-wrap"><div class="professional-table" data-source-table="38"><article class="professional-record"><h3 id="pro-record-535">fundingRate</h3><dl><dt>OKX 字段</dt><dd>fundingRate</dd><dt>含义（按字段名，未逐项核对官方说明）</dt><dd>当期资金费率</dd><dt>💡 本项目字段</dt><dd><code>funding_rate</code> ✅</dd></dl></article><article class="professional-record"><h3 id="pro-record-536">nextFundingRate</h3><dl><dt>OKX 字段</dt><dd>nextFundingRate</dd><dt>含义（按字段名，未逐项核对官方说明）</dt><dd>下一期预测资金费率</dd><dt>💡 本项目字段</dt><dd>💡 <code>next_funding_rate</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-537">fundingTime</h3><dl><dt>OKX 字段</dt><dd>fundingTime</dd><dt>含义（按字段名，未逐项核对官方说明）</dt><dd>本次资金费结算时间（毫秒）</dd><dt>💡 本项目字段</dt><dd>💡 <code>funding_time</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-538">nextFundingTime</h3><dl><dt>OKX 字段</dt><dd>nextFundingTime</dd><dt>含义（按字段名，未逐项核对官方说明）</dt><dd>下次结算时间</dd><dt>💡 本项目字段</dt><dd>💡 <code>next_funding_time</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-539">premium</h3><dl><dt>OKX 字段</dt><dd>premium</dd><dt>含义（按字段名，未逐项核对官方说明）</dt><dd>溢价</dd><dt>💡 本项目字段</dt><dd>💡 <code>premium_index</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-540">settFundingRate / settState</h3><dl><dt>OKX 字段</dt><dd>settFundingRate / settState</dd><dt>含义（按字段名，未逐项核对官方说明）</dt><dd>已结算资金费率 / 结算状态</dd><dt>💡 本项目字段</dt><dd>💡 <code>settled_funding_rate</code> / <code>settle_state</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-541">ts</h3><dl><dt>OKX 字段</dt><dd>ts</dd><dt>含义（按字段名，未逐项核对官方说明）</dt><dd>数据时间戳</dd><dt>💡 本项目字段</dt><dd>—</dd></dl></article></div></div>
<p>SDK 里没出现 <code>interestRate</code>、<code>impactValue</code>、<code>maxFundingRate</code>、<code>minFundingRate</code>、<code>method</code>，这些字段在官方文档里<strong>是否存在没核实</strong>。</p>
<p><strong>(3) 持仓档位接口字段（<code>public/position-tiers</code>）【三方SDK】</strong>：<code>uly</code>、<code>instFamily</code>、<code>instId</code>、<code>tier</code>、<code>minSz</code>、<code>maxSz</code>、<code>mmr</code>（维持保证金率）、<code>imr</code>（初始保证金率）、<code>maxLever</code>、<code>optMgnFactor</code>（期权保证金系数，仅期权）、<code>quoteMaxLoan</code>、<code>baseMaxLoan</code>（借币上限，仅杠杆）。请求参数：<code>instType</code>、<code>tdMode</code>、<code>uly</code>、<code>instFamily</code>、<code>instId</code>、<code>ccy</code>、<code>tier</code>。</p>
<p><strong>(4) 持仓量接口（<code>public/open-interest</code>）【三方SDK】</strong>：<code>oi</code>（张数）、<code>oiCcy</code>（币数量）、<code>oiUsd</code>（美元）、<code>ts</code>。</p>
<p><strong>(5) OKX 链上永续的分档公式【帮助中心】</strong>：<code>初始保证金率 IMR = 基础 IMR + max(0, (仓位价值 − 基础档位上限) ÷ 100,000 USD) × IMR 变化率</code>，MMR 同理；维持保证金 = 仓位价值 × MMR。<strong>这是链上永续，不是普通永续</strong>。</p>
<p><strong>(6) 币安 vs OKX 资金费率公式对比</strong></p>
<div class="table-wrap"><div class="professional-table" data-source-table="39"><article class="professional-record"><h3 id="pro-record-542">溢价指数</h3><dl><dt>项</dt><dd>溢价指数</dd><dt>币安</dt><dd>[Max(0, 冲击买价 − 价格指数) − Max(0, 价格指数 − 冲击卖价)] ÷ 价格指数</dd><dt>OKX</dt><dd>完全同形：Premium index = [Max(0, Impact bid − Index price) − Max(0, Index price − Impact ask)] ÷ Index price【帮助中心】</dd><dt>备注</dt><dd>同形</dd></dl></article><article class="professional-record"><h3 id="pro-record-543">资金费率</h3><dl><dt>项</dt><dd>资金费率</dd><dt>币安</dt><dd>F = [P + clamp(I − P, −0.05%, +0.05%)] ÷ (8 ÷ N)，再 clamp(上下限)</dd><dt>OKX</dt><dd>F = clamp{[P + clamp(I − P, 0.05%, −0.05%)] ÷ (8 ÷ N)，cap，floor}【帮助中心】</dd><dt>备注</dt><dd>同形（OKX 英文页同样把内层 clamp 边界写成 (0.05%, −0.05%)，顺序反了，含义同为 ±0.05%）</dd></dl></article><article class="professional-record"><h3 id="pro-record-544">平均溢价指数</h3><dl><dt>项</dt><dd>平均溢价指数</dd><dt>币安</dt><dd>8 小时时间加权 n = 5,760；1 小时等权 n = 720</dd><dt>OKX</dt><dd>上一结算周期内加权移动平均，权重 1,2,…,n【帮助中心】</dd><dt>备注</dt><dd>币安 1 小时周期是<strong>等权</strong>，OKX 页面没分</dd></dl></article><article class="professional-record"><h3 id="pro-record-545">利率</h3><dl><dt>项</dt><dd>利率</dd><dt>币安</dt><dd>0.03% / 日 = 0.01% / 8 小时，个别合约 0%</dd><dt>OKX</dt><dd><strong>固定 0.01%</strong>，所有结算间隔都一样【帮助中心】</dd><dt>备注</dt><dd>OKX 利率不随 N 缩放；币安 1 小时间隔如何折算本次未核实</dd></dl></article><article class="professional-record"><h3 id="pro-record-546">N</h3><dl><dt>项</dt><dd>N</dd><dt>币安</dt><dd>资金费间隔（小时）</dd><dt>OKX</dt><dd>结算间隔，取值 1、2、4、8【帮助中心】</dd><dt>备注</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-547">冲击价格</h3><dl><dt>项</dt><dd>冲击价格</dd><dt>币安</dt><dd>IMN = 200 USDT ÷ 最高杠杆下的初始保证金率</dd><dt>OKX</dt><dd>冲击价值 = 200 × 该永续允许的最大杠杆【帮助中心】</dd><dt>备注</dt><dd>两式等价：200 ÷ (1/最大杠杆) = 200 × 最大杠杆【计算】</dd></dl></article><article class="professional-record"><h3 id="pro-record-548">上下限</h3><dl><dt>项</dt><dd>上下限</dd><dt>币安</dt><dd>下限 −0.75 × MMR，上限 +0.75 × MMR（仅列表内合约），其它 U 本位 ±2%</dd><dt>OKX</dt><dd>帮助中心页<strong>没给具体数值</strong>，另链接独立页面</dd><dt>备注</dt><dd>OKX 上下限数值本次未取到</dd></dl></article><article class="professional-record"><h3 id="pro-record-549">资金费用</h3><dl><dt>项</dt><dd>资金费用</dd><dt>币安</dt><dd>持仓名义价值 × 资金费率；名义价值 = 标记价格 × 持仓数量</dd><dt>OKX</dt><dd>持仓价值 × 资金费率【帮助中心】</dd><dt>备注</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-550">仓位价值（U 本位）</h3><dl><dt>项</dt><dd>仓位价值（U 本位）</dd><dt>币安</dt><dd>标记价格 × 数量（币）</dd><dt>OKX</dt><dd><strong>张数 × 合约面值 × 合约乘数 × 标记价格</strong>【帮助中心】</dd><dt>备注</dt><dd>OKX 多了乘数项</dd></dl></article><article class="professional-record"><h3 id="pro-record-551">仓位价值（币本位）</h3><dl><dt>项</dt><dd>仓位价值（币本位）</dd><dt>币安</dt><dd>张数 × 合约乘数 ÷ 价格（币安示例，乘数 = 面值）</dd><dt>OKX</dt><dd><strong>张数 × 合约面值 × 合约乘数 ÷ 标记价格</strong>【帮助中心】</dd><dt>备注</dt><dd></dd></dl></article><article class="professional-record"><h3 id="pro-record-552">结算频率</h3><dl><dt>项</dt><dd>结算频率</dd><dt>币安</dt><dd>默认 8 小时，极端费率时可切换为每小时（币安广场第三方转述，未核实）</dd><dt>OKX</dt><dd>默认 00:00 / 08:00 / 16:00 UTC；触及上下限逐级加频 8h→4h→2h→1h；过去 12 小时都在 ±0.20% 内回到默认【帮助中心】</dd><dt>备注</dt><dd>只适用于加密永续，不适用股票 / ETF / 商品永续</dd></dl></article><article class="professional-record"><h3 id="pro-record-553">取用的费率</h3><dl><dt>项</dt><dd>取用的费率</dd><dt>币安</dt><dd>币安中文页：未说明</dd><dt>OKX</dt><dd>取结算前一分钟记录的值（例：16:00 结算用 15:59 的费率）【帮助中心，搜索摘要】</dd><dt>备注</dt><dd></dd></dl></article></div></div>
<p><strong>(7) OKX 资金费用示例【帮助中心】</strong>
- U 本位：10 张，每张 0.01 BTC，标记价 60,000 USDT，费率 0.1% → 仓位价值 6,000 USDT，资金费 6 USDT。
- 币本位：100 张，每张 10 USD，标记价 4,000 USD，费率 0.1% → 仓位价值 0.25 ETH，资金费 0.00025 ETH。
- 页面自身示例里「平台收取 / 平台支付」的措辞，与页面另一处「OKX 不收取也不留存资金费」冲突，以后者（多空互付）为准。</p>
<p><strong>(8) OKX 中文页的保证金率与平仓公式【帮助中心】</strong>
- 仓位维持保证金率（反映仓位安全程度，≤100% 触发减仓或爆仓）：现货和合约模式全仓 = （该币种全仓内余额 + 全仓收益 − 该币种挂单卖出数量 − 期权买单所需该币种数量 − 逐仓开仓所需该币种数量 − 所有挂单手续费）÷（维持保证金 + 爆仓手续费）；跨币种保证金模式全仓 = 有效保证金 ÷（维持保证金 + 减仓手续费）。
- 平仓收益（多）= （面值 × 合约乘数 × 张数）÷ 开仓均价 − （面值 × 合约乘数 × 张数）÷ 平仓均价；空头对调开仓和平仓均价。<strong>面值与合约乘数在这里同样连乘。</strong>
- 爆仓手续费 = 杠杆借币手续费 + 交割永续手续费 + 期权手续费；交割永续手续费 = 仓位价值 × 用户 taker 费率。
- 强平前：档位 3 及以上可能先部分减仓；档位 2 及以下，或档位 3 及以上但低于档位 1 要求时，按破产价格委托强平。
- 页面该条是较老的中文说明，页面自己也说「预估强平价可能与实际有出入，建议以仓位维持保证金率为准」。</p>
<p><strong>(9) 仍未取到的 OKX 项</strong>：普通永续的<strong>具体 MMR 档位表</strong>（只拿到 2023 年 AAVEUSDT 公告的举例，tier 1 MMR 0.65%、IMR 2.00%、50 倍，已过时不引用）、资金费率上下限具体数值、标记价格 / 限价 / 保险基金 / 强平单接口字段。</p>
<hr>
<h4 id="professional-16">16. 合约乘数 / 合约面值：说明与举例</h4>
<blockquote>
<p>来源标记：<strong>【币安】</strong>币安帮助中心页面原文 / 示例；<strong>【OKX】</strong>OKX 官方 agent-trade-kit 文档（经搜索摘要，未读全文）与 OKX 字段表；<strong>【三方】</strong>第三方库说明；<strong>【通识】</strong>我的一般知识，未在本次搜索中核实；<strong>【计算】</strong>我据上述数字做的算术，页面没有写。</p>
</blockquote>
<h4 id="professional-161">16.1 一句话理解</h4>
<p><strong>合约乘数（Contract Multiplier）</strong>：把「合约张数」或「价格」换算成「实际价值」的那个固定系数。<strong>一张合约到底代表多少东西，就看它。</strong></p>
<p>在加密合约里，这个概念被不同交易所拆成了两个词，<strong>容易混用</strong>：</p>
<div class="table-wrap"><div class="professional-table" data-source-table="40"><article class="professional-record"><h3 id="pro-record-554">合约面值 Contract Value（ctVal）</h3><dl><dt>词</dt><dd><strong>合约面值</strong> Contract Value（<code>ctVal</code>）</dd><dt>谁在用</dt><dd>OKX 【OKX】</dd><dt>含义</dt><dd>一张合约代表的标的数量或美元面值，例如 1 张 = 0.01 BTC，或 1 张 = 100 USD</dd><dt>本项目字段</dt><dd><strong><code>contract_value</code></strong>（已定名）</dd></dl></article><article class="professional-record"><h3 id="pro-record-555">合约乘数 Contract Multiplier</h3><dl><dt>词</dt><dd><strong>合约乘数</strong> Contract Multiplier</dd><dt>谁在用</dt><dd>币安币本位 【币安】</dd><dt>含义</dt><dd>币安用这个词表达的就是上一行的含义，BTCUSD = 100 USD/张</dd><dt>本项目字段</dt><dd>归入 <code>contract_value</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-556">合约乘数 Contract Multiplier（ctMult）</h3><dl><dt>词</dt><dd><strong>合约乘数</strong> Contract Multiplier（<code>ctMult</code>）</dd><dt>谁在用</dt><dd>OKX 【OKX】</dd><dt>含义</dt><dd>OKX 里另有一个独立字段，<strong>与面值连乘</strong>：仓位价值 = 张数 × 面值 × 乘数 × 标记价格（正向），反向 ÷ 标记价格【OKX 帮助中心】；通常为 1【通识，未验证】</dd><dt>本项目字段</dt><dd><code>contract_multiplier</code>，需要时单列</dd></dl></article></div></div>
<h4 id="professional-162">16.2 举例</h4>
<p><strong>例 1：币安币本位（反向）BTCUSD，合约乘数 = 100 USD/张 【币安】</strong></p>
<p>币安帮助中心的原文示例：买 10 张，开仓价 9,800 USD，20 倍杠杆。</p>
<div class="table-wrap"><div class="professional-table" data-source-table="41"><article class="professional-record"><h3 id="pro-record-557">仓位名义价值（币）</h3><dl><dt>项目</dt><dd>仓位名义价值（币）</dd><dt>计算</dt><dd>(10 × 100 USD) ÷ 9,800 USD</dd><dt>结果</dt><dd>约 0.1020 BTC</dd></dl></article><article class="professional-record"><h3 id="pro-record-558">初始保证金率</h3><dl><dt>项目</dt><dd>初始保证金率</dd><dt>计算</dt><dd>1 ÷ 20</dd><dt>结果</dt><dd>5%</dd></dl></article><article class="professional-record"><h3 id="pro-record-559">初始保证金</h3><dl><dt>项目</dt><dd>初始保证金</dd><dt>计算</dt><dd>0.1020 BTC ÷ 20</dd><dt>结果</dt><dd>约 0.0051 BTC</dd></dl></article></div></div>
<p>含义：一张合约固定值 100 美元；BTC 越贵，同样 10 张折成的 BTC 越少。</p>
<p><strong>例 2：OKX BTC-USDT-SWAP（正向，U 本位），合约面值 = 0.01 BTC/张 【OKX】</strong></p>
<p>OKX 官方文档给出：<code>BTC-USDT-SWAP</code> 1 张 = 0.01 BTC，<code>ETH-USDT-SWAP</code> 1 张 = 0.1 ETH；持仓名义价值 = 张数 × ctVal × 价格。</p>
<div class="table-wrap"><div class="professional-table" data-source-table="42"><article class="professional-record"><h3 id="pro-record-560">买 10 张对应的币量</h3><dl><dt>项目</dt><dd>买 10 张对应的币量</dd><dt>计算</dt><dd>10 × 0.01 BTC</dd><dt>结果</dt><dd>0.1 BTC 【计算】</dd></dl></article><article class="professional-record"><h3 id="pro-record-561">名义价值（假设 BTC = 90,000 USDT）</h3><dl><dt>项目</dt><dd>名义价值（假设 BTC = 90,000 USDT）</dd><dt>计算</dt><dd>10 × 0.01 × 90,000</dd><dt>结果</dt><dd>9,000 USDT 【计算】</dd></dl></article><article class="professional-record"><h3 id="pro-record-562">10 倍杠杆初始保证金</h3><dl><dt>项目</dt><dd>10 倍杠杆初始保证金</dd><dt>计算</dt><dd>9,000 ÷ 10</dd><dt>结果</dt><dd>900 USDT 【计算】</dd></dl></article></div></div>
<p>含义：这里面值按<strong>标的币数量</strong>给，价格涨了，名义价值跟着涨。</p>
<p><strong>例 3：OKX BTC-USD-SWAP（反向），合约面值 = 100 USD/张 【三方】</strong></p>
<p>第三方库的说明是 BTC-USD-SWAP 每张 100 USD。与例 1 币安币本位的「合约乘数 100 USD」同构。</p>
<p><strong>例 4：传统期货里的合约乘数 【通识】</strong></p>
<p>E-mini 标普 500 期货：每一个指数点价值 50 美元，合约乘数 = 50。指数 5,000 点时，一张合约价值 = 5,000 × 50 = 250,000 美元；指数涨 1 点，一张合约盈亏 50 美元。传统期货里合约乘数是「每 1 点价格变动对应多少钱」。</p>
<h4 id="professional-163">16.3 两种面值怎么区分</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="43"><article class="professional-record"><h3 id="pro-record-563">面值计价单位</h3><dl><dt>说明</dt><dd>面值计价单位</dd><dt>正向（U 本位、线性）</dt><dd>标的币（如 0.01 BTC/张）</dd><dt>反向（币本位）</dt><dd>美元（如 100 USD/张）</dd></dl></article><article class="professional-record"><h3 id="pro-record-564">名义价值公式</h3><dl><dt>说明</dt><dd>名义价值公式</dd><dt>正向（U 本位、线性）</dt><dd>张数 × 面值 × 合约乘数 × 标记价格（OKX 帮助中心；agent-trade-kit 文档写的是不含乘数的 张数 × ctVal × 价格，乘数通常为 1）【OKX】</dd><dt>反向（币本位）</dt><dd>张数 × 面值 × 合约乘数 ÷ 标记价格（OKX）；币安示例乘数即面值：张数 × 面值 ÷ 价格【币安】</dd></dl></article><article class="professional-record"><h3 id="pro-record-565">保证金币种</h3><dl><dt>说明</dt><dd>保证金币种</dd><dt>正向（U 本位、线性）</dt><dd>USDT 等稳定币</dd><dt>反向（币本位）</dt><dd>标的币本身</dd></dl></article><article class="professional-record"><h3 id="pro-record-566">本项目字段</h3><dl><dt>说明</dt><dd>本项目字段</dd><dt>正向（U 本位、线性）</dt><dd><code>contract_value</code> + <code>contract_value_coin</code>（面值的单位币种）</dd><dt>反向（币本位）</dt><dd>同左，<code>contract_value_coin</code> 为 USD</dd></dl></article></div></div>
<h4 id="professional-164">16.4 对命名的影响</h4>
<ol>
<li>币安文档里的「合约乘数」，翻成字段时用 <code>contract_value</code>，<strong>不要</strong>照搬成 <code>contract_multiplier</code>。</li>
<li><code>contract_value</code> 必须配 <code>contract_value_coin</code> 一起存，否则不知道面值的单位是币还是美元。</li>
<li>只有当你们需要 OKX 式的独立乘数（<code>ctMult</code>）时才加 <code>contract_multiplier</code>；OKX 帮助中心公式里它与 <code>contract_value</code> <strong>连乘</strong>（见 15.6），所以两者不能合并成一个字段。如果不需要 OKX 的这个字段，可以不建。</li>
<li>面值写进合约配置表，不要在代码里写死；<code>BTC-USDT-SWAP</code> 0.01 BTC/张 只是 OKX 当前值，各所各合约不同，以接口返回为准。</li>
</ol>
<hr>
<h4 id="professional-17">17. 币安公式汇总（链接 + 公式原文）</h4>
<blockquote>
<p>抓取日期：2026-10-27。优先英文页（公式更完整），有中文页的一并给出。
<strong>标记</strong>：【原文】页面文字原样；【验算】我用页面自己的算例重算，结果一致；【推导】我自己代数推出，页面没写；【缺失】页面公式是图片，文字抓不到；【搜索摘要】只读到搜索结果摘要，没读正文。
<strong>版本冲突</strong>：币安不同页面对同一公式的写法有出入，<strong>全部列出，不选边</strong>，每处都标明。使用前必须以币安当时的页面为准。</p>
</blockquote>
<h4 id="professional-170">17.0 公式索引</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="44"><article class="professional-record"><h3 id="pro-record-567">F1</h3><dl><dt>#</dt><dd>F1</dd><dt>主题</dt><dd>资金费率、溢价指数、冲击价格</dd><dt>英文页</dt><dd><a href="https://www.binance.com/en/support/faq/introduction-to-binance-futures-funding-rates-360033525031">Introduction to Binance Futures Funding Rates</a></dd><dt>中文页</dt><dd><a href="https://www.binance.com/zh-CN/support/faq/360033525031">中文</a></dd><dt>读取情况</dt><dd>已读正文</dd></dl></article><article class="professional-record"><h3 id="pro-record-568">F2</h3><dl><dt>#</dt><dd>F2</dd><dt>主题</dt><dd>U 本位杠杆与保证金（维持保证金、阶梯）</dd><dt>英文页</dt><dd><a href="https://www.binance.com/en/support/faq/leverage-and-margin-of-usd%E2%93%A2-m-futures-360033162192">Leverage and Margin of USDⓈ-M Futures</a></dd><dt>中文页</dt><dd><a href="https://www.binance.com/zh-CN/support/faq/360033162192">中文</a></dd><dt>读取情况</dt><dd>已读正文</dd></dl></article><article class="professional-record"><h3 id="pro-record-569">F3</h3><dl><dt>#</dt><dd>F3</dd><dt>主题</dt><dd>币本位杠杆与保证金（初始保证金、开仓亏损）</dd><dt>英文页</dt><dd><a href="https://www.binance.com/en/support/faq/leverage-and-margin-in-coin-margined-futures-contracts-be2c7d9d95b04a7e8044ed02dd7dfe5c">Leverage and Margin in Coin-Margined Futures</a></dd><dt>中文页</dt><dd><a href="https://www.binance.com/zh-CN/support/faq/be2c7d9d95b04a7e8044ed02dd7dfe5c">中文</a></dd><dt>读取情况</dt><dd>已读正文</dd></dl></article><article class="professional-record"><h3 id="pro-record-570">F4</h3><dl><dt>#</dt><dd>F4</dd><dt>主题</dt><dd>阶梯档位表（各合约 MMR、速算额）</dd><dt>英文页</dt><dd><a href="https://www.binance.com/en/futures/trading-rules/perpetual/leverage-margin">Leverage &amp; Margin of Futures Contracts</a></dd><dt>中文页</dt><dd><a href="https://www.binance.com/zh-CN/futures/trading-rules/perpetual/leverage-margin">中文</a></dd><dt>读取情况</dt><dd>只有链接，<strong>表格没读</strong></dd></dl></article><article class="professional-record"><h3 id="pro-record-571">F5</h3><dl><dt>#</dt><dd>F5</dd><dt>主题</dt><dd>合约计算器（初始保证金、盈亏、回报率）</dd><dt>英文页</dt><dd><a href="https://www.binance.com/en/support/faq/how-to-use-the-binance-futures-calculator-360036498511">How to Use the Binance Futures Calculator</a></dd><dt>中文页</dt><dd><a href="https://www.binance.com/zh-CN/support/faq/360036498511">中文</a></dd><dt>读取情况</dt><dd>已读中文正文</dd></dl></article><article class="professional-record"><h3 id="pro-record-572">F6</h3><dl><dt>#</dt><dd>F6</dd><dt>主题</dt><dd>U 本位强平价</dd><dt>英文页</dt><dd><a href="https://www.binance.com/en/support/faq/how-to-calculate-liquidation-price-of-usd%E2%93%A2-m-futures-contracts-b3c689c1f50a44cabb3a84e663b81d93">How to Calculate Liquidation Price of USDⓈ-M Futures</a></dd><dt>中文页</dt><dd><a href="https://www.binance.com/cn/support/faq/b3c689c1f50a44cabb3a84e663b81d93">中文</a></dd><dt>读取情况</dt><dd>已读，公式是图片</dd></dl></article><article class="professional-record"><h3 id="pro-record-573">F7</h3><dl><dt>#</dt><dd>F7</dd><dt>主题</dt><dd>币本位强平价</dd><dt>英文页</dt><dd><a href="https://www.binance.com/en/support/faq/ceccfcfb4e3a45e3b48b0b1bb1a8ae46">How to Calculate Liquidation Price of Coin-M Futures</a></dd><dt>中文页</dt><dd>—</dd><dt>读取情况</dt><dd>已读，公式是图片</dd></dl></article><article class="professional-record"><h3 id="pro-record-574">F8</h3><dl><dt>#</dt><dd>F8</dd><dt>主题</dt><dd>强平协议、保证金率、部分强平</dd><dt>英文页</dt><dd><a href="https://www.binance.com/en/support/faq/binance-futures-liquidation-protocols-360033525271">Binance Futures Liquidation Protocols</a></dd><dt>中文页</dt><dd>—</dd><dt>读取情况</dt><dd>已读正文</dd></dl></article><article class="professional-record"><h3 id="pro-record-575">F9</h3><dl><dt>#</dt><dd>F9</dd><dt>主题</dt><dd>保险基金</dd><dt>英文页</dt><dd><a href="https://www.binance.com/en/support/faq/introduction-to-futures-insurance-funds-360033525371">Introduction to Futures Insurance Funds</a></dd><dt>中文页</dt><dd>—</dd><dt>读取情况</dt><dd>已读正文</dd></dl></article><article class="professional-record"><h3 id="pro-record-576">F10</h3><dl><dt>#</dt><dd>F10</dd><dt>主题</dt><dd>自动减仓 ADL 排名</dd><dt>英文页</dt><dd><a href="https://www.binance.com/en/support/faq/what-is-auto-deleveraging-adl-and-how-does-it-work-360033525471">What Is Auto-Deleveraging (ADL)</a></dd><dt>中文页</dt><dd>—</dd><dt>读取情况</dt><dd>已读正文</dd></dl></article><article class="professional-record"><h3 id="pro-record-577">F11</h3><dl><dt>#</dt><dd>F11</dd><dt>主题</dt><dd>U 本位标记价格、价格指数</dd><dt>英文页</dt><dd><a href="https://www.binance.com/en/support/faq/what-are-mark-price-and-price-index-in-usd%E2%93%A2-margined-futures-360033525071">What Are Mark Price and Price Index in USDⓈ-Margined Futures</a></dd><dt>中文页</dt><dd>—</dd><dt>读取情况</dt><dd>已读正文</dd></dl></article><article class="professional-record"><h3 id="pro-record-578">F12</h3><dl><dt>#</dt><dd>F12</dd><dt>主题</dt><dd>币本位标记价格、价格指数</dd><dt>英文页</dt><dd><a href="https://www.binance.com/en-NG/support/faq/mark-price-and-price-index-of-coin-margined-contracts-fff6ec1b3f5845d19f1fb924644a0877">Mark Price and Price Index of Coin-Margined Contracts</a></dd><dt>中文页</dt><dd>—</dd><dt>读取情况</dt><dd>已读正文（en-NG 页面）</dd></dl></article><article class="professional-record"><h3 id="pro-record-579">F13</h3><dl><dt>#</dt><dd>F13</dd><dt>主题</dt><dd>标记价格计算窗口调整公告（2024-04-03）</dd><dt>英文页</dt><dd><a href="https://www.binance.com/en/support/announcement/updates-on-mark-price-calculation-for-usd%E2%93%A2-m-and-coin-m-futures-contracts-2024-04-03-30ef571caf2c487dbac20f63a2a49949">Updates on Mark Price Calculation</a></dd><dt>中文页</dt><dd>—</dd><dt>读取情况</dt><dd>已读正文</dd></dl></article><article class="professional-record"><h3 id="pro-record-580">F14</h3><dl><dt>#</dt><dd>F14</dd><dt>主题</dt><dd>U 本位季度合约标记价格</dd><dt>英文页</dt><dd><a href="https://www.binance.com/en/support/faq/mark-price-in-usd%E2%93%A2-margined-quarterly-futures-e9b19c16189249c7902c1457e24a36f8">Mark Price in USDⓈ-Margined Quarterly Futures</a></dd><dt>中文页</dt><dd>—</dd><dt>读取情况</dt><dd><strong>该链接返回「文章不存在」</strong>，公式改取自 F11</dd></dl></article><article class="professional-record"><h3 id="pro-record-581">F15</h3><dl><dt>#</dt><dd>F15</dd><dt>主题</dt><dd>盈亏 PnL 与回报率</dd><dt>英文页</dt><dd><a href="https://www.binance.com/en/support/faq/how-to-calculate-profit-and-loss-for-futures-contracts-3a55a23768cb416fb404f06ffedde4b2">How to Calculate Profit and Loss for Futures Contracts</a></dd><dt>中文页</dt><dd>—</dd><dt>读取情况</dt><dd>已读正文</dd></dl></article><article class="professional-record"><h3 id="pro-record-582">F16</h3><dl><dt>#</dt><dd>F16</dd><dt>主题</dt><dd>手续费计算</dd><dt>英文页</dt><dd><a href="https://www.binance.com/en/support/faq/binance-futures-fee-structure-fee-calculations-360033544231">Binance Futures Fee Structure &amp; Fee Calculations</a></dd><dt>中文页</dt><dd>—</dd><dt>读取情况</dt><dd>已读正文</dd></dl></article><article class="professional-record"><h3 id="pro-record-583">F17</h3><dl><dt>#</dt><dd>F17</dd><dt>主题</dt><dd>统一账户 uniMMR（组合保证金）</dd><dt>英文页</dt><dd><a href="https://www.binance.com/en/support/faq/what-is-the-unified-account-maintenance-margin-ratio-unimmr-and-how-is-it-calculated-4868b2f1aa6c4d08af973328462bb0bd">What Is uniMMR and How Is It Calculated</a></dd><dt>中文页</dt><dd>—</dd><dt>读取情况</dt><dd>已读正文</dd></dl></article><article class="professional-record"><h3 id="pro-record-584">F18</h3><dl><dt>#</dt><dd>F18</dd><dt>主题</dt><dd>组合保证金 MMR 计算</dd><dt>英文页</dt><dd><a href="https://www.binance.com/en/support/faq/binance-portfolio-margin-pro-maintenance-margin-ratio-calculation-5e33af8e6ac04d57a1d0a3398e0a0752">Portfolio Margin Pro MMR Calculation</a></dd><dt>中文页</dt><dd>—</dd><dt>读取情况</dt><dd>已读正文</dd></dl></article><article class="professional-record"><h3 id="pro-record-585">F19</h3><dl><dt>#</dt><dd>F19</dd><dt>主题</dt><dd>多资产模式保证金率</dd><dt>英文页</dt><dd><a href="https://www.binance.com/en/support/faq/how-to-calculate-margin-ratio-in-the-multi-assets-mode-c983a9268cfa4e70a4916c276bb3b7bc">How to Calculate Margin Ratio in the Multi-Assets Mode</a></dd><dt>中文页</dt><dd>—</dd><dt>读取情况</dt><dd>已读正文</dd></dl></article><article class="professional-record"><h3 id="pro-record-586">F20</h3><dl><dt>#</dt><dd>F20</dd><dt>主题</dt><dd>杠杆保证金交易（Margin）强平价</dd><dt>英文页</dt><dd><a href="https://www.binance.com/en/support/faq/how-to-calculate-margin-liquidation-price-f6b010588e55413aa58b7d63ee0125ed">How to Calculate Margin Liquidation Price</a></dd><dt>中文页</dt><dd>—</dd><dt>读取情况</dt><dd>已读，主公式是图片</dd></dl></article><article class="professional-record"><h3 id="pro-record-587">F21</h3><dl><dt>#</dt><dd>F21</dd><dt>主题</dt><dd>交易规则：价格保护、PERCENT_PRICE</dd><dt>英文页</dt><dd><a href="https://www.binance.com/en/futures/trading-rules/perpetual">Trading Rules of USDⓈ-M Contracts</a> · <a href="https://www.binance.com/en/support/faq/how-to-enable-the-price-protection-function-2b9dc811ce7340469357867122b975dc">How to Enable Price Protection</a></dd><dt>中文页</dt><dd>—</dd><dt>读取情况</dt><dd>【搜索摘要】，正文未读</dd></dl></article><article class="professional-record"><h3 id="pro-record-588">F22</h3><dl><dt>#</dt><dd>F22</dd><dt>主题</dt><dd>开发者文档：交易规则 / 档位 / 账户 / 下单字段</dd><dt>英文页</dt><dd><a href="https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Exchange-Information">Exchange Information</a> · <a href="https://developers.binance.com/docs/zh-CN/derivatives/usds-margined-futures/account/rest-api/Notional-and-Leverage-Brackets">Notional and Leverage Brackets</a> · <a href="https://developers.binance.com/docs/zh-CN/derivatives/usds-margined-futures/account/rest-api/Account-Information-V3">Account Information V3</a> · <a href="https://developers.binance.com/docs/zh-CN/derivatives/usds-margined-futures/trade/rest-api/New-Order">New Order</a> · <a href="https://developers.binance.com/docs/zh-CN/derivatives/usds-margined-futures/common-definition">Common Definition</a></dd><dt>中文页</dt><dd>—</dd><dt>读取情况</dt><dd>字段表，见第 12 节</dd></dl></article></div></div>
<p><strong>读到链接但没读正文（可补抓）</strong>：<a href="https://www.binance.com/en/support/faq/how-liquidation-works-in-futures-trading-7ba80e1b406f40a0a140a84b3a10c387">How Liquidation Works in Futures Trading</a>、<a href="https://www.binance.com/en/support/faq/what-fees-are-generated-in-binance-futures-trading-98488a516eb84e3eb34605683dffd554">What Fees are Generated in Binance Futures Trading</a>、<a href="https://www.binance.com/en/support/faq/binance-portfolio-margin-trading-rules-174861644e7049aaa64845f1db2e4376">Binance Portfolio Margin Trading Rules</a>、<a href="https://www.binance.com/en/support/faq/how-does-liquidation-work-in-the-binance-portfolio-margin-account-d0c3558829fa41eabeeaf3c32dbe1dad">How Does Liquidation Work in the Portfolio Margin Account</a>、<a href="https://www.binance.com/en/support/faq/rate-limits-on-binance-futures-281596e222414cdd9051664ea621cdc3">Rate Limits on Binance Futures</a>。</p>
<hr>
<h4 id="professional-171-f2f3f5">17.1 保证金与杠杆（F2、F3、F5）</h4>
<p><strong>初始保证金率</strong></p>
<pre><code>IMR = 1 / Leverage                                   【原文：F5、F15】
</code></pre>
<p><strong>初始保证金</strong></p>
<pre><code>U 本位：Initial Margin = Quantity × Entry Price × IMR      【原文：F5，中文「成交数量 x 开仓价格 x IMR」】
币本位：Initial Margin = Contract Size × Contract Multiplier × IMR / Entry Price      【原文：F3、F5】
</code></pre>
<p>币本位示例（F3 原文）：杠杆 20 倍，10 张，合约乘数 100 USD，开仓价 9,800 USD：</p>
<pre><code>仓位名义价值 = (10 × 100 USD) / 9,800 USD = 0.1020 BTC
初始保证金   = 0.1020 BTC / 20 = 0.0051 BTC
</code></pre>
<p><strong>币本位开仓亏损与开仓成本</strong></p>
<pre><code>Open Loss = Number of Contract × Contract Multiplier × | min[0, direction of order × (1 / order price − 1 / mark price)] |   【原文：F3】
Cost to open a position = Initial Margin + Open Loss (if any)                                                                    【原文：F3】
</code></pre>
<p>F3 示例：做多 0.002096562 BTC、做空 0；开仓成本做多 0.0072 BTC、做空 0.0051 BTC。</p>
<p><strong>维持保证金（阶梯）</strong></p>
<pre><code>Maintenance Margin = Notional Position Value × Maintenance Margin Rate − Maintenance Amount      【原文：F2、F7】
</code></pre>
<p>规则（【原文：F2、F3】）：
- 维持保证金率 <strong>不随用户设置的杠杆倍数变化</strong>，只随仓位名义价值所在档位变化。
- 档位越大，维持保证金率越高。
- 「从一个档位进入另一个档位，不会改变先前档位的杠杆」。
- 币本位页面把这种算法称为 <strong>"Tax Bracket" setup（税收超额累进）</strong>。
- 具体各档 MMR 与速算额在 <strong>F4 档位表</strong>（图片 / 动态表格，本次没读到），API 见第 12 节 <code>leverageBracket</code>。</p>
<p>示例（F6 原文）：
- 10 BTCUSDT，标记价 26,000 → 名义价值 260,000，落在第 3 档，MMR 1%，速算额 1,300 → 维持保证金 = 260,000 × 1% − 1,300 = <strong>1,300 USDT</strong>。【验算：一致】
- 币本位（F7 原文）：100 张 BTCUSDT 永续（合约乘数 100），标记价 25,000 → 名义价值 = 100 × 100 / 25,000 = 0.4 BTC，落在第 1 档（MMR 0.4%，速算额 0）→ 维持保证金 = 0.4 × 0.4% − 0 = <strong>0.0016 BTC</strong>。【验算：一致】
- 币本位另一示例（F3 原文）：300 BTC 的 BTCUSD 仓位 → MMR 12.5%，速算额 11.605 BTC（页面未给出档位表和推导）。</p>
<blockquote>
<p>币安中文页里「速算额」有三种写法（速算额 / 速算数 / 维持保证金额），英文是 Maintenance Amount；API 字段 <code>cum</code>。</p>
</blockquote>
<hr>
<h4 id="professional-172-f6f7f8f20">17.2 强平价格（F6、F7、F8、F20）</h4>
<p><strong>U 本位强平价（全仓 / 逐仓，单向 / 双向）</strong></p>
<p>页面（F6）的公式是<strong>图片</strong>【缺失】，文字只给了变量表。变量（【原文】）：</p>
<div class="table-wrap"><div class="professional-table" data-source-table="45"><article class="professional-record"><h3 id="pro-record-589">WB</h3><dl><dt>符号</dt><dd>WB</dd><dt>含义</dt><dd>钱包余额。全仓为 <code>crossWalletBalance</code>；逐仓为该仓位的 <code>isolatedWalletBalance</code></dd></dl></article><article class="professional-record"><h3 id="pro-record-590">TMM1</h3><dl><dt>符号</dt><dd>TMM1</dd><dt>含义</dt><dd>除合约 1 外所有其它合约的维持保证金之和；逐仓为 0</dd></dl></article><article class="professional-record"><h3 id="pro-record-591">UPNL1</h3><dl><dt>符号</dt><dd>UPNL1</dd><dt>含义</dt><dd>除合约 1 外所有其它合约的未实现盈亏之和；逐仓为 0</dd></dl></article><article class="professional-record"><h3 id="pro-record-592">cumB / cumL / cumS</h3><dl><dt>符号</dt><dd>cumB / cumL / cumS</dd><dt>含义</dt><dd>单向模式 BOTH / 双向模式 LONG / 双向模式 SHORT 仓位的维持保证金速算额</dd></dl></article><article class="professional-record"><h3 id="pro-record-593">Side1BOTH</h3><dl><dt>符号</dt><dd>Side1BOTH</dd><dt>含义</dt><dd>BOTH 仓位方向，多 = 1，空 = −1</dd></dl></article><article class="professional-record"><h3 id="pro-record-594">Position1BOTH / Position1LONG / Position1SHORT</h3><dl><dt>符号</dt><dd>Position1BOTH / Position1LONG / Position1SHORT</dd><dt>含义</dt><dd>仓位大小，取绝对值</dd></dl></article><article class="professional-record"><h3 id="pro-record-595">EP1BOTH / EP1LONG / EP1SHORT</h3><dl><dt>符号</dt><dd>EP1BOTH / EP1LONG / EP1SHORT</dd><dt>含义</dt><dd>开仓均价</dd></dl></article><article class="professional-record"><h3 id="pro-record-596">MMRB / MMRL / MMRS</h3><dl><dt>符号</dt><dd>MMRB / MMRL / MMRS</dd><dt>含义</dt><dd>对应仓位的维持保证金率</dd></dl></article><article class="professional-record"><h3 id="pro-record-597">MP</h3><dl><dt>符号</dt><dd>MP</dd><dt>含义</dt><dd>合约 1 的最新标记价格</dd></dl></article></div></div>
<p><strong>单向模式公式【推导 + 验算】</strong>：币安给的两个算例，用下式重算与页面结果完全一致：</p>
<pre><code>LP = ( WB − TMM1 + UPNL1 + cumB − Side1BOTH × Position1BOTH × EP1BOTH )
     / ( Position1BOTH × MMRB − Side1BOTH × Position1BOTH )
</code></pre>
<p>验算（F6 的 WB = 1,535,443.01）：
- ETHUSDT：TMM1 = 71,200.81144，UPNL1 = −56,354.57，cumB = 135,365，Side = 1，Position = 3,683.979，EP = 1,456.84，MMR = 10% → <strong>1,153.26</strong>，页面 1153.26。
- BTCUSDT：TMM1 = 356,512.508，UPNL1 = −448,192.89，cumB = 16,300，Side = 1，Position = 109.488，EP = 32,481.98，MMR = 2.5% → <strong>26,316.89</strong>，页面 26,316.89。</p>
<p>推导思路：强平发生在「保证金余额 = 维持保证金」。保证金余额 = WB − TMM1 + UPNL1 + Side × Position × (MP − EP)；维持保证金 = Position × MP × MMR − cum。令二者相等，解出 MP 即得上式。</p>
<p><strong>双向模式公式【推导，未用页面算例验算】</strong>：同样令保证金余额 = 维持保证金：</p>
<pre><code>LP = ( WB − TMM1 + UPNL1 + cumL + cumS − Position1LONG × EP1LONG + Position1SHORT × EP1SHORT )
     / ( Position1LONG × MMRL + Position1SHORT × MMRS − Position1LONG + Position1SHORT )
</code></pre>
<p><strong>逐仓</strong>：用同一公式，WB 取该仓位的逐仓钱包余额，TMM1 = UPNL1 = 0（F6 原文）。</p>
<blockquote>
<p>若算出的强平价对应的名义价值所在档位，与计算时使用的 MMR、cum 不是同一档，要换到对应档位重算（F6 原文）。</p>
</blockquote>
<p><strong>币本位强平价</strong>：F7 的公式同样是<strong>图片</strong>【缺失】。变量（【原文】）：WB、TMM1、UPNL1、cumB / cumL / cumS、SideBOTH、B（单向仓位大小绝对值）、EPB、L / EPL、S / EPS、MMR B / L / S、<strong>CM（合约面值 Contract Size of the Symbol）</strong>。不同于 U 本位，币本位公式里含合约面值 CM。<strong>我没有推导币本位公式</strong>，保证金币种和价格取倒数的细节容易出错，需要看图或用币安计算器。</p>
<p><strong>强平触发与保证金率（F8 原文）</strong></p>
<pre><code>Collateral = Initial Collateral + Realized PnL + Unrealized PnL &lt; Maintenance Margin   → 触发强平
Margin Ratio = Maintenance Margin / Margin Balance
</code></pre>
<ul>
<li>保证金率达到 <strong>100%</strong> 时强平；页面建议保持在 <strong>80%</strong> 以下。</li>
<li>触发价：标记价格触及强平价（<code>Liquidation occurs when the Mark Price hits the liquidation price</code>）。</li>
<li><strong>强平清算费</strong>：按「适用的强平清算费率 × 仓位名义价值」，页面<strong>没有给费率</strong>。</li>
<li><strong>部分强平（Smart Liquidation）</strong>：系统先下一笔 IOC 订单减仓；若减仓后剩余资产 ≥ 所需保证金（扣除已实现亏损和清算费后）则停止。</li>
<li><strong>破产</strong>：强平后该仓位可用资产 &lt; 0，或无法强平。</li>
<li><strong>负余额清零</strong>：对符合条件的账户每 10 分钟运行一次，由合约保险基金出资。</li>
<li>示例：做空 BTCUSDT，开仓时标记价 17,000，计算强平价 17,006；标记价一秒内跳到 17,100，<strong>实际成交价 17,100，不是 17,006</strong>，强平历史显示 17,100。</li>
</ul>
<p><strong>杠杆保证金（Margin）强平</strong>（F20，与合约不同，别混）</p>
<pre><code>Risk Ratio = Total Assets / (Total Amount Borrowed + Interest Payable)        【原文】
</code></pre>
<p>变量：Ai 资产 i 总量，Li 借入量，Ri 应付利息，Pi 资产 i 对 BTC / USDT 的指数价，li 资产 i 的强平价。主强平价公式是图片【缺失】。示例（【原文】）：全仓强平线 1.1，抵押 10,000 USDT，借 20,000 USDT，1 BTC 买价 30,000 → 强平价 = 1.1 × 20,000 = <strong>22,000</strong>。页面自身有算术错误（4 小时利息 0.00004 vs 0.00016 ETH 等），引用时不要照抄页面里的利息数字。</p>
<hr>
<h4 id="professional-173-f1">17.3 资金费率（F1）</h4>
<pre><code>Funding Amount = Nominal Value of Positions × Funding Rate                         【原文】
Nominal Value of Positions = Mark Price × Size of a Contract                      【原文】

Funding Rate (F) = [ Average Premium Index (P) + clamp( Interest Rate (I) − Premium Index (P), 0.05%, −0.05% ) ] / ( 8 / N )   【原文：英文页，N = 资金费间隔小时数】
Capped Funding Rate = clamp( Funding Rate, Floor, Cap )                           【原文】
    Floor = −0.75 × Maintenance Margin Ratio
    Cap   =  0.75 × Maintenance Margin Ratio                                        （仅列表内合约；其它 USDⓈ-M 合约上限 ±2%，英文页）

Premium Index (P) = [ Max(0, Impact Bid Price − Price Index) − Max(0, Price Index − Impact Ask Price) ] / Price Index          【原文】

Average Premium Index (8 小时间隔，时间加权) = (1×P₁ + 2×P₂ + … + n×Pₙ) / (1 + 2 + … + n)，n = 5,760       【原文】
Average Premium Index (1 小时间隔，等权)     = (P₁ + P₂ + … + Pₙ) / n，n = 720                                 【原文】

Impact Margin Notional (IMN) = 200 USDT / Initial Margin Rate at the maximum leverage level                 【原文】
Impact Bid/Ask Price = IMN / [ (IMN − multiplier × ∑p(x−1)·q(x−1)) / p(x) + multiplier × ∑q(x−1) ]       【原文：x 是累计名义价值首次超过 IMN 的订单簿档位】
</code></pre>
<ul>
<li>利率：默认 <strong>0.03% / 日 = 0.01% / 8 小时</strong>；个别合约（页面举 ETHBTC）为 0%。</li>
<li><strong>版本差异</strong>：英文页 clamp 边界写成 <code>(0.05%, −0.05%)</code>，顺序是反的；中文页写 <code>(−0.05%, 0.05%)</code>。含义都是 ±0.05%。</li>
<li>中文页的资金费率上下限算例：ADAUSDT 最高杠杆 75 倍，维持保证金率 0.5%，下限 −0.375%，上限 +0.375%。英文页派生算例用了 0.65%（−0.4875% / +0.4875%）。<strong>两页数值不一致，以实际接口为准</strong>。</li>
<li>算例（原文）：溢价指数 0.0369%；8 小时加权溢价指数 0.0429%、利率 0.01% → F = 0.0429% + clamp(0.01% − 0.0429%, ±0.05%) = <strong>0.0100%</strong>。BNBUSDT 最大杠杆 20 倍 → IMR 5% → IMN = 200 / 5% = <strong>4,000 USDT</strong>。</li>
<li>资金费间隔调整（Example 5）：BTCUSDT 上下限 ±0.3%，08:00 UTC 结算若触及 −0.3%，下次结算改为每小时，从 09:00 UTC 开始。</li>
</ul>
<hr>
<h4 id="professional-174-f11f12f13">17.4 标记价格与价格指数（F11、F12、F13）</h4>
<blockquote>
<p><strong>这是版本冲突最多的一组</strong>：三个来源三种窗口，页面都没说哪个是现行的。</p>
</blockquote>
<p><strong>公共结构（三个来源一致）</strong></p>
<pre><code>Mark Price = Median( Price 1, Price 2, Contract Price )
Price 1    = Price Index × ( 1 + Last Funding Rate × ( Time Until Next Funding / Funding Period ) )      【F11 原文】
Price 2    = Price Index + Moving Average
</code></pre>
<p><strong>Price 2 的移动平均基差——三种写法</strong></p>
<div class="table-wrap"><div class="professional-table" data-source-table="46"><article class="professional-record"><h3 id="pro-record-598">F11（U 本位 FAQ，现页面）</h3><dl><dt>来源</dt><dd>F11（U 本位 FAQ，现页面）</dd><dt>写法</dt><dd><code>Moving Average (30 seconds basis) = Σ[(Bid1_i + Ask1_i)/2 − PI_i] / 30</code>，每秒采样 30 点；TradFi 永续用 60 秒</dd><dt>样本</dt><dd>30 个点</dd><dt>适用</dt><dd>USDⓈ-M 永续</dd></dl></article><article class="professional-record"><h3 id="pro-record-599">F13（2024-04-03 公告）</h3><dl><dt>来源</dt><dd>F13（2024-04-03 公告）</dd><dt>写法</dt><dd>从 <code>5 分钟基差（60 点）</code> 调整为 <code>2.5 分钟基差（30 点）</code>；两者都是每 5 秒采样</dd><dt>样本</dt><dd>30 个点（每 5 秒）</dd><dt>适用</dt><dd>USDⓈ-M 和 COIN-M 永续</dd></dl></article><article class="professional-record"><h3 id="pro-record-600">F12（币本位 FAQ，en-NG）</h3><dl><dt>来源</dt><dd>F12（币本位 FAQ，en-NG）</dd><dt>写法</dt><dd><code>Moving Average (1-Minute Basis) = Σ[(Bid1_i + Ask1_i)/2 − PI_i] / 60</code>，页面文字称「每 5 秒 60 个点」，<strong>自相矛盾</strong>（60 × 5 秒 = 5 分钟，不是 1 分钟）；且 Price 1 用的是 <code>Time Until Funding / 8</code> 而不是资金费周期</dd><dt>样本</dt><dd>60 个点</dd><dt>适用</dt><dd>COIN-M 永续（页面较旧）</dd></dl></article></div></div>
<p>F11 的补充规则（【原文】）：
- 极端行情或数据源偏离时，Mark Price 直接取 Price 2。
- 系统升级或停机期间，Price 2 里的移动平均置 0。
- 单一数据源偏离中位数超过 3% 时，被限制在中位数的 1.03 倍或 0.97 倍（示例：指数中位数 20,000，+7% 偏离 → 20,600；−6% → 19,400）。
- 个别交易对（BNBUSDC、BNBUSDT、BTCUSDC、BTCUSDT、BTCUSD1、ETHUSDC、ETHUSDT、SOLUSDT、USDCUSDT、XRPUSDT）偏离上限为 1%。
- 交易所连不上或 5 分钟没更新，权重置 0。</p>
<p><strong>价格指数（Price Index）</strong></p>
<pre><code>Price Index = Σ( Weight Percent of Exchange i × Symbol's Spot Price on Exchange i )        【原文：F11】
Weight Percent = Weight of Exchange i / Total Weight
</code></pre>
<p>页面没给各交易所具体权重。F11 列出的成分：Binance、KuCoin、OKX、HitBTC、Gate.io、MEXC、Coinbase、Kraken、Bitget、Bitfinex、Bybit、PancakeSwap（BNB Chain）、Uniswap（Ethereum）、Raydium（Solana）、Aster，以及 Binance Futures 最新价（币安自行决定）。F12（币本位）的成分列表是旧的：Bitstamp、Coinbase Pro、Kraken、Binance、Huobi、Kucoin、OKX，且按<strong>相对成交量</strong>加权。</p>
<p><strong>交割合约标记价（F11 原文）</strong></p>
<pre><code>交割前：Mark Price = Price Index + Moving Average (30 seconds basis)
        Moving Average = (Bid1 + Ask1) / 2 − Price Index，每秒采样，30 秒
交割日且距交割 &gt; 30 分钟：同上
交割日且距交割 ≤ 30 分钟：Mark Price = Average of Price Index，每秒采样，从 07:30:00 到 07:59:59 UTC
</code></pre>
<p>F12（币本位）：交割前 <code>Mark Price = Price Index + Moving Average (1-Minute Basis)</code>；最后 30 分钟同样取 07:30–07:59 UTC 指数均值。F13：USDⓈ-M 交割合约从 5 分钟改 2.5 分钟，COIN-M 交割合约从 15 分钟改 2.5 分钟。</p>
<p><strong>预上市永续（F11 原文）</strong></p>
<pre><code>Mark Price = Average of last 10 seconds trade prices，每秒计算
若 10 秒内成交价少于 21 个，取最近 20 笔成交价对应的价格指数均值
预上市结束后恢复标准 Median 公式
</code></pre>
<blockquote>
<p>原则（F15 原文）：未实现盈亏、强平用标记价格；已实现盈亏用最新价。</p>
</blockquote>
<hr>
<h4 id="professional-175-f5f15f16">17.5 盈亏、回报率、手续费（F5、F15、F16）</h4>
<p><strong>盈亏 PnL（F15 原文）</strong></p>
<pre><code>U 本位未实现盈亏（标记价）：Unrealized PNL = Contract Size × |position| × Direction × (Mark Price − Entry Price)
U 本位未实现盈亏（最新价）：同上，Mark Price 换成 Last Price
币本位未实现盈亏：Unrealized PNL = Contract Size × Contract Multiplier × |position| × Direction × (1/Entry Price − 1/Mark Price)

Direction of Order：多 = 1，空 = −1
</code></pre>
<p><strong>回报率</strong></p>
<pre><code>ROI% = Unrealized PNL in USDT / Entry Margin
     = ( (Mark − Entry) × Direction × Contract Size × |position| ) / ( Contract Size × Mark Price × IMR )          【原文：F15，U 本位，标记价口径】
含手续费：ROI = ( realizedPNL + commissionFeeTotal + fundingFee + insuranceClearFee ) / ( entryPrice × openedVolume / leverage )   【原文：F15】

币本位：ROI% = Unrealized PNL × price / ( abs(size) × Contract Multiplier × IMR )                             【原文：F15】
</code></pre>
<p><strong>计算器页（F5，中文）</strong>：</p>
<pre><code>U 本位：  PnL(多) = (结算价 − 开仓价) × 成交数量 ；PnL(空) = (开仓价 − 结算价) × 成交数量
          ROI = PnL / 初始保证金 = 方向 × (1 − 结算价 / 开仓价) / IMR（页面展开式，按字面做多上涨得负值，疑似符号问题，使用时用 PnL / 初始保证金）
币本位：  PnL = 交易方向 × 成交数量 × 合约乘数 × (1/开仓价 − 1/结算价)，多 = 1，空 = −1
          ROI = PnL / 初始保证金 = 方向 × (1 − 开仓价 / 结算价) / IMR
目标价：  U 本位 多 = 开仓价 × (1 + ROI / 杠杆)，空 = 开仓价 × (1 − ROI / 杠杆)
          币本位 目标价 = 方向 × 开仓价 / (方向 − ROI × IMR)
</code></pre>
<p>F15 算例（【原文】）：
- U 本位多：1 BTC，50,000 → 55,000，盈利 <strong>5,000 USDT</strong>。
- U 本位空：1 BTC，50,000 → 45,000，盈利 <strong>5,000 USDT</strong>。
- 币本位多：BTCUSD 100 张 × 100 USD，50,000 → 55,000 → <code>(1/50,000 − 1/55,000) × (100 × 100)</code> = <strong>0.0182 BTC</strong>。
- 币本位空：BTCUSD 0925，100 张 × 100 USD，50,000 → 45,500 → <strong>0.0198 BTC</strong>。</p>
<p><strong>手续费（F16 原文）</strong></p>
<pre><code>Trading Fee = Position Value × trading fee rate
U 本位：  Position Value = Contract Size × execution price
币本位：  Position Value = ( Contract Size × Contract Multiplier ) / execution price
BNB 抵扣（仅 U 本位）：标准费用 × 0.90（页面写「10% 折扣」，无显式公式，需 BNB 转入 U 本位合约账户且余额足够）
</code></pre>
<p>示例（页面口径：普通用户 maker 0.02%、taker 0.05%）：
- U 本位 taker：1 BTC，10,104 USDT → 位置价值 10,104，手续费 <strong>5.052 USDT</strong>。
- U 本位 maker：1 BTC，11,104 USDT → <strong>2.2208 USDT</strong>。
- 币本位 taker：10 张 BTCUSD 0925 × 100，10,104 USD → 位置价值 0.09897 BTC，手续费 <strong>0.000049485 BTC</strong>。
- 币本位 maker：11,104 USD → 0.09 BTC，<strong>0.000018 BTC</strong>。</p>
<blockquote>
<p><strong>版本差异</strong>：该页面是旧页面，费率与现行不符。另有搜索摘要称 2023 年公告把 COIN-M 普通用户费率调整为 maker 0.020% / taker 0.040%（旧 0.010% / 0.050%）。<strong>费率一律不要引用本页数字</strong>，以币安现行费率页为准。本页未给出强平费和资金费的公式。</p>
</blockquote>
<hr>
<h4 id="professional-176-adlf9f10">17.6 保险基金、ADL（F9、F10）</h4>
<p><strong>ADL 排名（F10 原文）</strong></p>
<pre><code>PNL Percentage = Unrealized Profit / abs(Position Notional)
Effective Leverage = abs(Position Notional) / ( Account Balance + Unrealized Profit )
若 PNL Percentage ≥ 0：ranking = PNL Percentage × Effective Leverage
若 PNL Percentage &lt; 0： ranking = PNL Percentage / Effective Leverage
Leverage PNL Quantile = rank(user.ranking) / Total User Count
</code></pre>
<p>组合保证金账户：Effective Leverage = abs(Position Notional) / accountEquity。PNL Percentage 和 |Position Notional| 在<strong>交易对层面</strong>计算，Account Balance + Unrealized Profit 在<strong>账户层面</strong>计算。ADL 指示灯的档位和阈值在页面图片里，<strong>文字没有</strong>。盈利越多、杠杆越高的仓位越先被减。被 ADL 的仓位按被强平订单的破产价成交，<strong>不收手续费</strong>。</p>
<p><strong>保险基金（F9 原文）</strong>
- 基金填补「破产价与强平订单成交价之间的差额」，不偿还交易者亏损。
- <strong>最大接管能力 = 基金余额 × 保密乘数</strong>；页面示例：余额 100 万美元、乘数 3 倍 → 300 万美元。乘数币安不公开。
- 接管仓位的未实现亏损超过基金可用余额时，强平引擎不能再交易该合约类型，<strong>触发 ADL</strong>。
- 最小规模按 99.9% 置信区间和历史压力情景校准，每季度复核；页面特别说明这<strong>不等于</strong> 99.9% 的情况不会 ADL。
- 基金分组（U 本位）：BTC / ETH / BNB 的 USDT 本位合约共用一个基金；DOT、LINK、XMR、ADA、BCH、EOS、ETC、LTC、TRX、XLM、XRP 的 USDT 本位合约共用另一个；所有 USDC 本位共用一个；其它 USDT 本位用其它基金池；币本位按同一保证金币种共用一个基金。
- 页面<strong>没有</strong>破产价公式、负余额清零公式、强平清算费率。</p>
<blockquote>
<p>破产价的定义见 F10：「被强平用户的保证金余额等于零时的价格」。</p>
</blockquote>
<hr>
<h4 id="professional-177-f17f18f19">17.7 统一账户 / 组合保证金（F17、F18、F19）</h4>
<p><strong>uniMMR（F17 原文）</strong></p>
<pre><code>uniMMR = ∑adjustedEquity / ∑MM
∑adjustedEquity = ∑Equity − ∑OpenLoss × assetIndexPrice
∑Equity = ∑ min( (MarginAsset − MarginLoan + futuresAsset + futuresUnrealPnL) × assetIndexPrice × collateralRate,
                 (MarginAsset − MarginLoan + futuresAsset + futuresUnrealPnL) × assetIndexPrice )
∑MM = ∑futuresMM × assetIndexPrice + ∑MarginMM × assetIndexPrice
futuresMM (USDⓈ-M) = | MMR × Position × MarkPrice | − cum
futuresMM (COIN-M) = | MMR × Notional | = | MMR × Amount × contract multiplier | − cum
∑MarginMM = ∑( Loan × MMR )               （杠杆倍数 3x / 5x / 10x 对应 MMR 10% / 8% / 5%）
Open Loss = ∑ qty × price × min( 0, side × ( collateralRateA − collateralRateB ) )       （side：卖 = 1，买 = −1）
Margin IM = MarginLoan / ( leverage − 1 )
Futures IM = Notional / Leverage
</code></pre>
<p><strong>派生限额（F17 原文）</strong></p>
<pre><code>MaxWithdraw = max( min( margin free asset − ∑MM of positions settled in that asset, virtualAvailable / assetIndexPrice / collateralRate ), 0 )
virtualAvailable = max( ∑adjustedEquity − ∑IM − ∑futuresNegativeBalanceReserveUsd − ∑balanceLock × assetIndexPrice, 0 )
MaxLoan = max( min( virtualMaxLoan / assetIndexPrice, Max_Borrow − Current Loan ), 0 )
virtualMaxLoan = ( Leverage − 1 ) × max( virtualAvailable, 0 )，其中 virtualAvailable = max( ∑adjustedEquity − ∑IM, 0 )
</code></pre>
<p><strong>阈值——两处写法有出入</strong></p>
<div class="table-wrap"><div class="professional-table" data-source-table="47"><article class="professional-record"><h3 id="pro-record-601">F17</h3><dl><dt>来源</dt><dd>F17</dd><dt>&gt; 1.5</dt><dd>自由交易</dd><dt>1.2 ~ 1.5</dt><dd>提醒划转 / 还款 / 减仓</dd><dt>1.05 ~ 1.2</dt><dd>不能开新单，只允许 reduce-only，不能提高保证金等级</dd><dt>≤ 1.05</dt><dd>强平</dd></dl></article><article class="professional-record"><h3 id="pro-record-602">F18（组合保证金 MMR 页）</h3><dl><dt>来源</dt><dd>F18（组合保证金 MMR 页）</dd><dt>&gt; 1.5</dt><dd>&gt; 150% 自由交易</dd><dt>1.2 ~ 1.5</dt><dd>120% ~ 150% 提醒</dd><dt>1.05 ~ 1.2</dt><dd>105% ~ 120% 拒绝新单</dd><dt>≤ 1.05</dt><dd>100% ~ 105% 强平；≤ 100% 强平且可能收取还款费</dd></dl></article></div></div>
<p>F17 算例的合计：Unified Adjusted Equity 20,125.08，Unified MM 3,378.41，uniMMR ≈ <strong>5.96</strong>（595.6%）；F18 同一场景的算例结果为 20,285.26 / 3,378.41 = <strong>600.44%</strong>。<strong>两页对同一场景给出不同的权益值</strong>（相差约 160.18）。可能原因是 F17 公式扣了 Open Loss（F17 另一算例的 Open Loss 为 −160.02，数值接近但不相等），而 F18 页面没有这一项（F18 页面本身也说没有独立的 open loss 术语）；这只是<strong>推测</strong>，页面没有解释。</p>
<p><strong>多资产模式保证金率（F19 原文）——注意方向和 uniMMR 相反</strong></p>
<pre><code>Account Margin Ratio = Account Maintenance Margin / Account Equity            （越小越安全，≥ 100% 时全部强平）
Account Equity = ∑ min( assetEquity × bidRate, assetEquity × askRate )
Account Maintenance Margin = ∑ assetMM × askRate
uniAvailableForOrder = accountEquity − ∑( assetCrossInitialMargin × askRate )
</code></pre>
<p>示例：USDTUSD 指数 0.99，买价缓冲 0.01、卖价缓冲 0.005 → bidRate 0.9801、askRate 0.99495；无持仓时 Account Equity = 200 × 0.9801 + 220 × 1 = 416.02；有持仓（无未实现盈亏）：Account MM = 0.5 × 20,000 × 0.008 × 0.99495 + 20 × 600 × 0.01 × 1 = 199.596，Margin Ratio = 199.596 / 416.02 = <strong>47.98%</strong>。</p>
<blockquote>
<p><strong>方向陷阱</strong>：同叫「保证金率」，F8（Margin Ratio = MM / Margin Balance）和 F19（MM / Equity）是<strong>维持保证金 ÷ 权益</strong>，越大越危险；F17 的 uniMMR 是 <strong>权益 ÷ 维持保证金</strong>，越大越安全，方向相反。OKX 账户级 <code>mgnRatio</code> 同样是 adjEq ÷ mmr，与 uniMMR 同向。落库命名必须区分，见第 15.4 节。</p>
</blockquote>
<hr>
<h4 id="professional-178-f21">17.8 价格保护与价格限制（F21，仅搜索摘要）</h4>
<p><strong>【搜索摘要，正文没读】</strong>，要用请先读正文：
- <strong>价格保护（Price Protection）</strong>：条件单触发前，若最新价与标记价偏离超过阈值，则不触发止盈止损。USDⓈ-M 页面举例阈值 5%（多个来源写法不同：公告称订单会过期，FAQ 称订单留在簿里）；API 下单不受影响。
- <strong>PERCENT_PRICE 过滤器</strong>：期货口径下 <code>BUY: price ≤ markPrice × multiplierUp</code>，<code>SELL: price ≥ markPrice × multiplierDown</code>。API 示例值 <code>multiplierUp</code> 1.1500、<code>multiplierDown</code> 0.8500、<code>multiplierDecimal</code> 4（来自开发者文档示例，<strong>仅示例，不是定义</strong>）。
- 相关错误码：-4113 <code>MARKET_ORDER_REJECT</code>、-4151 / -4152（限价超出上下限）。
- <code>marketTakeBound</code>：市价单相对标记价的最大偏离率；<code>triggerProtect</code>：开启 <code>priceProtect</code> 的条件单触发阈值（开发者文档字段说明）。</p>
<hr>
<h4 id="professional-179">17.9 本节未取到的币安公式 / 页面</h4>
<div class="table-wrap"><div class="professional-table" data-source-table="48"><article class="professional-record"><h3 id="pro-record-603">档位表（各合约 MMR、速算额、最大杠杆）</h3><dl><dt>项</dt><dd>档位表（各合约 MMR、速算额、最大杠杆）</dd><dt>原因</dt><dd>F4 是动态表格或图片，没读到</dd></dl></article><article class="professional-record"><h3 id="pro-record-604">U 本位和币本位强平价的图片公式</h3><dl><dt>项</dt><dd>U 本位和币本位强平价的<strong>图片公式</strong></dd><dt>原因</dt><dd>文字抓取拿不到。U 本位已用代数推导并用算例验算，币本位未推导</dd></dl></article><article class="professional-record"><h3 id="pro-record-605">季度合约标记价专页</h3><dl><dt>项</dt><dd>季度合约标记价专页</dd><dt>原因</dt><dd>链接返回「文章不存在」，公式从 F11 取</dd></dl></article><article class="professional-record"><h3 id="pro-record-606">强平清算费率、保险基金接管乘数</h3><dl><dt>项</dt><dd>强平清算费率、保险基金接管乘数</dd><dt>原因</dt><dd>页面明说保密或没给</dd></dl></article><article class="professional-record"><h3 id="pro-record-607">资金费率实际上下限（每个合约的 cap / floor）</h3><dl><dt>项</dt><dd>资金费率实际上下限（每个合约的 cap / floor）</dd><dt>原因</dt><dd>要查 <code>fundingInfo</code> 接口，未抓</dd></dl></article><article class="professional-record"><h3 id="pro-record-608">交易规则过滤器的完整定义（LOT_SIZE、MIN_NOTIONAL、MAX_NUM_ORDERS 等）</h3><dl><dt>项</dt><dd>交易规则过滤器的完整定义（<code>LOT_SIZE</code>、<code>MIN_NOTIONAL</code>、<code>MAX_NUM_ORDERS</code> 等）</dd><dt>原因</dt><dd>开发者文档页被截断</dd></dl></article><article class="professional-record"><h3 id="pro-record-609">组合保证金交易规则、PM 强平、费用类型页</h3><dl><dt>项</dt><dd>组合保证金交易规则、PM 强平、费用类型页</dd><dt>原因</dt><dd>只有链接，没读正文</dd></dl></article><article class="professional-record"><h3 id="pro-record-610">币安账户模式里 Position Value 与 Notional 的关系</h3><dl><dt>项</dt><dd>币安账户模式里 <code>Position Value</code> 与 <code>Notional</code> 的关系</dd><dt>原因</dt><dd>页面用词不统一：F16 叫 Position Value，F2 叫 Notional Position Value，F1 叫 Nominal Value of Positions</dd></dl></article></div></div>
<hr>
<h4 id="professional-_2">维护</h4>
<ul>
<li>新增术语：优先查本表；英文有争议时，参考团队 <code>field-naming.md</code>，规范内已定的以规范为准。</li>
<li>版本：v0.9（2026-10-27）改为 HTML 维护，新增第 17 节币安公式汇总（链接 + 公式原文 + 验算）；v0.8（2026-10-27）补抓 OKX 档位 / 资金费率 / 订单 / 杠杆字段与帮助中心公式，新增 15.6；v0.7 增加第 0 节币安 × OKX 对照总表；v0.6 增加第 16 节合约乘数说明与举例；v0.1 初版，v0.2 增加第 12 节币安官方映照，v0.3 增加第 13 节公式术语专区，v0.4 增加第 14 节同义多写法汇总，v0.5 增加第 15 节 OKX 映照，单张合约价值定名 <code>contract_value</code>。</li>
</ul>
</details>
{% endraw %}

## 容易混淆的几组词

| 术语 | 区别 |
| --- | --- |
| 最新价 / 标记价 | 一个来自最近成交，一个由平台规则计算；强平依据要看交易所。 |
| 强平价 / 破产价 | 强平价是触发风险处置的估算阈值；破产价是另一种理论风险价格。 |
| 初始保证金 / 维持保证金 | 前者与开仓所需资金相关，后者与持续维持仓位的风险要求相关。 |
| 资金费 / 手续费 | 前者是永续合约多空之间的定期资金交换；后者通常在交易成交时产生。 |
| 触发价 / 成交价 | 条件达到后才发出订单；最终成交价由之后的市场和订单类型决定。 |
| 币种 / 网络 / 地址 | 三者都要匹配；地址前缀相同不能证明网络相同。 |
| 挂单 / 限价单 | 限价单是一种价格约束；若立即成交，其成交部分仍可能是吃单。 |
| 账户权益 / 可用余额 | 权益通常综合资产和盈亏；可用余额是当前可用于特定操作的部分，口径依平台而定。 |

## 延伸阅读

- [币算：币圈术语大全](https://ngneo.com/learn/glossary)——入门术语与交互示意，本文参考了其选题范围。
- [币安：永续合约资金费率](https://www.binance.com/en/support/faq/detail/360033525031)——结算及费率机制。
- [币安：合约强平机制](https://www.binance.com/en-AE/support/faq/detail/360033525271)——标记价格与强平说明。
- [OKX API 文档](https://my.okx.com/docs-v5/)——产品、账户、持仓和订单字段。
- [Ethereum.org：安全与防诈骗](https://ethereum.org/security/)——钱包密钥和常见安全风险。

<style>
.glossary-search-dialog{position:fixed;inset:20dvh auto auto 50%;transform:translateX(-50%);margin:0;box-sizing:border-box;width:min(900px,94vw);max-width:94vw;max-height:75dvh;border:1px solid #d5d0c4;border-radius:14px;padding:20px 26px;background:#eeece5;color:#383a34;overflow:auto;overscroll-behavior:contain;box-shadow:0 24px 90px #0006}.glossary-search-dialog::backdrop{background:#0009;backdrop-filter:blur(3px)}.glossary-dialog-header{position:sticky;top:-20px;z-index:2;display:flex;gap:12px;align-items:center;background:#eeece5;padding:12px 0;border-bottom:1px solid #d5d0c4}.glossary-dialog-header input{min-width:0;flex:1;padding:11px 12px;border:1px solid #b6b2a7;border-radius:8px;background:#faf9f5;color:#292b27;font-size:16px}.glossary-dialog-header button{flex:none;padding:10px;border:0;border-radius:7px;background:#e1dcd1;color:#383a34;cursor:pointer}.glossary-search-result{margin-bottom:24px}.glossary-search-dialog>p{font-size:14px;color:#706c61}.glossary-search-dialog .gm-expand>summary{cursor:pointer}body:has(.glossary-search-dialog[open]){overflow:hidden}@media(max-width:520px){.glossary-search-dialog{padding:12px 16px}.glossary-dialog-header{top:-12px}}
.professional-dictionary{margin:20px 0;border:1px solid #d5d0c4;border-radius:10px;padding:14px 18px}.professional-dictionary>summary{cursor:pointer;font-size:14px;font-weight:600;color:#b43f00}.professional-dictionary h4{margin-top:28px;color:#615e55}.professional-record{margin:16px 0;padding:0 0 12px;border-bottom:1px solid #d9d5ca}.professional-record dl{display:grid;grid-template-columns:minmax(95px,150px) minmax(0,1fr);gap:6px 16px;margin:10px 0;font-size:13px;line-height:1.7}.professional-record dt{font-weight:600;color:#706c61}.professional-record dd{margin:0;min-width:0;overflow-wrap:anywhere}.professional-record dd p{margin:0!important}.professional-record code{white-space:normal;overflow-wrap:anywhere}@media(max-width:520px){.professional-record dl{grid-template-columns:1fr;gap:3px}.professional-record dd{margin-bottom:8px}.professional-dictionary{padding:12px}}
.glossary-search-dialog:not([open]){display:none!important}.glossary-search-dialog[open]{display:block}
#post:has(#crypto-term-search){--font-color:#383a34;--text-highlight-color:#20231e;--hr-border:#d6d1c6;background:#eeece5;color:#383a34;width:100%;max-width:1440px;margin:0 auto;padding:clamp(20px,3vw,40px);font-weight:400;box-shadow:none;border-radius:12px}
.layout:has(#crypto-term-search){max-width:1520px;width:calc(100% - 32px)}.layout:has(#crypto-term-search) #aside-content{display:none}
#article-container:has(#crypto-term-search){font-size:15px;line-height:1.85;font-weight:400}#article-container:has(#crypto-term-search) h2{color:#20231e;font-size:25px;font-weight:700;margin:2.3rem 0 1rem}#article-container:has(#crypto-term-search) h3{color:#20231e;font-size:19px;font-weight:600;margin:1.6rem 0 .5rem;padding-top:1.2rem;border-color:#d9d5ca}#article-container:has(#crypto-term-search) p{margin:.5rem 0 1rem}
#article-container:has(#crypto-term-search) .gm-expand>summary{color:#b43f00;font-size:12px;font-weight:600;padding:8px 0}#article-container:has(#crypto-term-search) .gm-expand{margin:8px 0 18px}#article-container:has(#crypto-term-search) .gm{margin:8px 0 0;max-width:440px;font-weight:400}#article-container:has(#crypto-term-search) .gm-caption{padding-top:8px}#article-container:has(#crypto-term-search) .gm-stage{min-height:150px}
.crypto-glossary-search{padding:1rem 1.2rem;margin:1.5rem 0;border:1px solid #80b8bd;border-radius:12px;background:rgba(77,160,166,.08)}
.crypto-glossary-search label{display:block;font-weight:700;margin-bottom:.5rem}.crypto-glossary-search input{box-sizing:border-box;width:100%;padding:.7rem;border:1px solid #94a3a8;border-radius:8px;background:var(--card-bg,#fff);color:var(--font-color,#333)}.crypto-glossary-search p{font-size:.85em;margin:.5rem 0 0}#article-container [hidden]{display:none!important}
#article-container{min-width:0;overflow-wrap:anywhere}#article-container img{max-width:100%;height:auto}#article-container pre,#article-container .table-wrap{max-width:100%;overflow-x:auto}#article-container h3{padding-top:1.2rem;border-top:1px solid rgba(140,150,150,.25)}
.glossary-starter-title{font-size:13px;font-weight:600;margin:1.3rem 0 .2rem;letter-spacing:.06em;color:#706c61}.glossary-starter-desc{font-size:13px;line-height:1.6;color:#777267;margin-bottom:.6rem}.glossary-starter-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:28px;row-gap:0}.glossary-starter-card{display:grid;grid-template-columns:26px minmax(0,1fr) auto;column-gap:8px;row-gap:1px;padding:10px 0;border-bottom:1px solid #d9d5ca;color:inherit!important;text-decoration:none!important;border-radius:0}.glossary-starter-card:hover .glossary-starter-name{color:#b43f00}.glossary-starter-number{grid-column:1;grid-row:1 / 3;color:#777267;font:12px/1.7 ui-monospace,monospace}.glossary-starter-name{grid-column:2;grid-row:1;font-size:14px;font-weight:600;line-height:1.5;margin:0}.glossary-starter-copy{grid-column:2 / 4;grid-row:2;font-size:12px;line-height:1.55;color:#777267}.glossary-starter-badge{grid-column:3;grid-row:1;font-size:10px;color:#b43f00;white-space:nowrap;align-self:center}.glossary-index{margin:1.2rem 0;padding:18px 22px;border:1px solid #d9d5ca;border-radius:12px;background:#f6f5f1}.glossary-index-row{display:block;margin:0 0 12px}.glossary-index-row:last-child{margin-bottom:0}.glossary-index-label{display:block;font-size:10px;font-weight:400;line-height:1.5;color:#777267;margin-bottom:5px}.glossary-index-links{display:flex;flex-wrap:wrap;gap:6px}.glossary-index-links a{font-size:10px;font-weight:400;line-height:1.45;border:1px solid #ccc6ba;border-radius:99px;padding:5px 9px;color:#615e55!important;text-decoration:none!important;white-space:nowrap}.glossary-index-links a:hover{border-color:#e76731;color:#b43f00!important}@media(max-width:620px){.glossary-starter-grid{grid-template-columns:1fr}.glossary-index{padding:14px}.glossary-index-links{gap:5px}.glossary-index-links a{font-size:10px;padding:4px 8px}.layout:has(#crypto-term-search){width:calc(100% - 16px)}}
</style>
<script>
function initCryptoGlossary() {
  var input = document.getElementById('crypto-term-search');
  var marker = document.getElementById('crypto-glossary');
  var root = marker && marker.closest('#article-container');
  var status = document.getElementById('crypto-term-status');
  if (!input || !root || !status || input.dataset.ready) return;
  input.dataset.ready = 'true';
  var headings = Array.from(root.querySelectorAll('h3'));
  function shortTerm(text) {
    var value = text.replace(/（[^）]*）|[(][^)]*[)]/g, '').replace(/^网络与代币标准[：:]/, '').trim();
    var aliases = {
      '数字货币 / 加密资产':'加密资产','以太坊与以太币':'以太坊','USDT / U':'USDT','C2C / P2P':'C2C / P2P','KYC / 身份认证':'KYC','双重验证':'2FA','储备金证明':'储备证明',
      '区块链 / 公链':'公链','ERC-20 / TRC-20 / BEP-20':'转账网络','Memo / Tag / 备注标签':'Memo / Tag','交易哈希':'TxID','确认数':'确认数','Gas / 网络手续费':'Gas','托管钱包 / 自托管钱包':'钱包托管','私钥 / 助记词':'密钥备份','智能合约与授权':'授权',
      '交易对、基础资产、计价资产':'交易对','订单簿与深度':'订单深度','买一 / 卖一与价差':'买卖价差','成交均价与部分成交':'成交均价','撤单 / 撤单失败':'撤单','GTC / IOC / FOK / Post Only':'有效方式','触发价、触发类型与委托价':'触发条件',
      '衍生品 / 合约':'合约','持仓、持仓方向与持仓数量':'持仓','单向持仓 / 双向持仓':'持仓模式','合约面值 / 合约乘数':'面值与乘数','开仓均价 / 持仓均价':'持仓均价','未实现盈亏 / 已实现盈亏':'持仓盈亏','盈亏示例：线性合约多头':'盈亏算例','强平价格 / 预估强平价':'强平价','风险限额 / 杠杆分层':'风险档位','比特币市值占比':'BTC 占比','恐惧与贪婪指数':'情绪指数','历史最高价':'ATH','山寨币 / 平台代币':'山寨币'
    };
    return aliases[value] || value;
  }
  var starters = [['USDT / U','认识交易中常见的美元稳定币'],['C2C / P2P','了解用户之间怎样买卖资产'],['区块链 / 公链','转账前确认币种、网络与地址'],['地址投毒','识别交易记录里的相似地址'],['挂单 / 吃单','看懂订单怎样进入市场'],['杠杆（Leverage）','理解仓位与保证金之间的关系'],['强平 / 爆仓','看看风险条件触发后的处置'],['资金费率（Funding','理解永续合约的多空资金交换'],['定投（DCA）','认识分时间投入的方式'],['网格交易','了解价格区间内的策略']];
  var starterRoot = document.getElementById('glossary-starter');
  var title = document.createElement('div'); title.className = 'glossary-starter-title'; title.textContent = '常用术语快速入口'; starterRoot.appendChild(title);
  var intro = document.createElement('p'); intro.className = 'glossary-starter-desc'; intro.textContent = '从最常见的概念开始，点击卡片跳到对应解释。'; starterRoot.appendChild(intro);
  var grid = document.createElement('div'); grid.className = 'glossary-starter-grid'; starterRoot.appendChild(grid);
  starters.forEach(function (entry, index) { var heading = headings.find(function (h) { return h.textContent.includes(entry[0]); }); if (!heading) return; var card = document.createElement('a'); card.className = 'glossary-starter-card'; card.href = '#' + encodeURIComponent(heading.id); var number = document.createElement('div'); number.className = 'glossary-starter-number'; number.textContent = String(index + 1).padStart(2, '0'); var name = document.createElement('div'); name.className = 'glossary-starter-name'; name.textContent = shortTerm(heading.textContent); var copy = document.createElement('div'); copy.className = 'glossary-starter-copy'; copy.textContent = entry[1]; var badge = document.createElement("span"); badge.className = "glossary-starter-badge"; badge.textContent = "▶ 动画"; card.append(number, name, copy, badge); card.addEventListener('click', function () { if (input.value) { input.value = ''; input.dispatchEvent(new Event('input')); } }); grid.appendChild(card); });
  var indexRoot = document.getElementById('glossary-index'); indexRoot.className = 'glossary-index'; var currentRow;
  Array.from(root.children).forEach(function (node) { if (node.tagName === 'H2') { currentRow = null; if (node.compareDocumentPosition(marker) & Node.DOCUMENT_POSITION_PRECEDING) { currentRow = document.createElement('div'); currentRow.className = 'glossary-index-row'; var label = document.createElement('span'); label.className = 'glossary-index-label'; label.textContent = node.textContent.trim(); var links = document.createElement('div'); links.className = 'glossary-index-links'; currentRow.append(label, links); indexRoot.appendChild(currentRow); } } else if (node.tagName === 'H3' && currentRow) { var a = document.createElement('a'); a.href = '#' + encodeURIComponent(node.id); a.textContent = shortTerm(node.textContent); a.title = node.textContent.trim(); a.addEventListener('click', function () { if (input.value) { input.value = ''; input.dispatchEvent(new Event('input')); } }); currentRow.lastElementChild.appendChild(a); } });
  indexRoot.querySelectorAll('.glossary-index-row').forEach(function (row) { if (!row.querySelector('a')) row.remove(); });
  var dialog = document.createElement('dialog');
  dialog.className = 'glossary-search-dialog';
  dialog.setAttribute('aria-label', '本篇术语搜索结果');
  var header = document.createElement('div'); header.className = 'glossary-dialog-header';
  var dialogInput = document.createElement('input'); dialogInput.type = 'search'; dialogInput.placeholder = '搜索中文或英文术语'; dialogInput.setAttribute('aria-label', '弹窗内搜索术语');
  var close = document.createElement('button'); close.type = 'button'; close.textContent = '关闭 ×'; close.setAttribute('aria-label', '关闭术语搜索');
  var count = document.createElement('p'); count.setAttribute('aria-live', 'polite');
  var results = document.createElement('div'); results.className = 'glossary-dialog-results';
  header.append(dialogInput, close); dialog.append(header, count, results); root.appendChild(dialog);
  var moved = [];
  function restore() { moved.forEach(function (entry) { entry.placeholder.replaceWith(entry.node); }); moved = []; }
  function search() {
    restore(); results.replaceChildren();
    var query = dialogInput.value.trim().toLocaleLowerCase(), matches = 0;
    if (query) headings.forEach(function (heading) {
      var nodes = [heading], node = heading.nextElementSibling;
      while (node && !/^H[234]$/.test(node.tagName) && node !== dialog && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE' && node.tagName !== 'LINK') { nodes.push(node); node = node.nextElementSibling; }
      if (!nodes.some(function (part) { return part.textContent.toLocaleLowerCase().includes(query); })) return;
      var section = document.createElement('section'); section.className = 'glossary-search-result' + (heading.closest('.professional-record') ? ' professional-record' : '');
      nodes.forEach(function (part) { var placeholder = document.createComment('term-search-position'); part.replaceWith(placeholder); moved.push({node:part,placeholder:placeholder}); section.appendChild(part); });
      results.appendChild(section); matches++;
    });
    count.textContent = query ? (matches ? '找到 ' + matches + ' 个相关术语' : '没有找到相关术语，请换个关键词。') : '输入关键词后，仅显示匹配内容。';
  }
  input.addEventListener('input', function () {
    if (!input.value.trim()) return;
    dialogInput.value = input.value;
    search();
    if (!dialog.open) dialog.showModal();
    dialogInput.focus();
  });
  dialogInput.addEventListener('input', search);
  close.addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (event) { if (event.target === dialog) { var rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
  dialog.addEventListener('close', function () { restore(); results.replaceChildren(); input.value = ''; dialogInput.value = ''; input.focus(); });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCryptoGlossary);
else initCryptoGlossary();
document.addEventListener('pjax:complete', initCryptoGlossary);
</script>
<link rel="stylesheet" href="/assets/crypto-glossary/concept-motion.css">
<link rel="stylesheet" href="/assets/crypto-glossary/inline-motion.css">
<style>
#article-container .gm{--line:rgba(145,145,135,.35);--line-2:#c7c2b7;--text-1:#292b27;--text-3:#777970;--surface:#f7f5ef;--accent:#ed632c;--accent-soft:#f8e6db;--accent-text:#b5471d;--series-2:#65a39b;--r-md:12px;--sans:system-ui,sans-serif;--mono:ui-monospace,monospace;--ease-io:cubic-bezier(.4,0,.2,1);box-sizing:border-box;width:100%;text-align:left}
#article-container .gm .gm-steps{padding-left:0;margin:0;list-style:none}#article-container .gm .gm-steps li{list-style:none}#article-container .gm svg{display:inline-block;margin:0;vertical-align:middle}#article-container .gm figcaption{color:var(--text-1)}
#article-container .anim{--line:#dcd8ce;--line-2:#c8c3b6;--text-1:#22221e;--text-3:#6a665c;--surface:#f6f5f1;--surface-2:#fbfaf7;--accent:#f05a12;--series-2:#2a78d6;--up:#12894f;--down:#d42f25;--sans:system-ui,sans-serif;--mono:ui-monospace,monospace;box-sizing:border-box;width:100%}#article-container .anim svg{width:100%;height:auto;display:block;margin:0}#article-container .anim:focus-visible{outline:2px solid #f05a12;outline-offset:3px}
</style>
<script src="/assets/crypto-glossary/scene-captions.js"></script>
<style>.crypto-glossary-search input{background:#faf9f5;color:#292b27}.crypto-glossary-search input::placeholder{color:#827c70;opacity:1}</style>
<script src="/assets/crypto-glossary/concept-motion.js"></script>
