---
title: UNI 资金费率套利平仓复盘：39 天赚了多少，为什么我选择退出
date: 2026-11-16 20:00:00
cover: /assets/uni-review/funding-rate-cover.png
top_img: /assets/uni-review/funding-rate-cover.png
categories:
  - 币圈相关
tags:
  - UNI
  - 资金费率
  - 套利复盘
  - 风险管理
description: 复盘一次 OKX UNI 现货与币本位永续对冲：资金费率变化、手续费、开平仓价差、收益口径，以及量化机会看盘积分机制的改进。
permalink: archives/aac102cf.html
---

> <strong>说明</strong>：这是一次个人实盘复盘，数据来自我整理的成交、资金费和面板记录，金额以 U 表示，时间为日本时间。文中的收益和评分仅反映这次交易及当时的假设，不构成投资建议。对市场行为和相关主体的判断均为个人观察或猜测，尚未证明因果关系。

## 一、为什么决定平仓

我做这轮 UNI 套利的初衷，是买入现货 UNI，同时做空 OKX 的 UNI 币本位永续合约，尽量对冲币价波动，主要赚取资金费。它原本应当是一项相对省心的理财，而不是让我每天盯盘猜方向的交易。

但到了后期，UNI 价格波动明显加剧，我观察到的市场行为让我觉得不正常；OKX 的资金费率也多次改变方向，过去依赖的费率表现不再稳定。按我的交易记录，117 次资金费结算中有 14 次低于每 8 小时 0.01%，其中 8 次为负，主要集中在 11 月 7 日至 15 日。

<strong>资金费率由市场决定，历史上维持正费率不代表以后也会如此。</strong>当空头需要支付资金费，而收益又不足以补偿手续费、价差和盯盘成本时，我认为这笔仓位已经不具备继续作为省心理财持有的条件。为了省心，最终选择退出。

我也怀疑这段时间币安 UNI 市场的价格和资金费率变化，可能与币安被盗后的资产处理、以及我观察到的潜在大户吸筹有关。这些是我当时决定退出时的<strong>个人怀疑</strong>：目前没有足够的订单、账户或链上证据证明存在吸筹，也没有证据证明币安操纵了 UNI 价格或资金费率，更无法确定这些现象由盗币事件造成。

## 二、这一轮做了什么，最后赚了多少

| 项目 | 记录 |
| --- | --- |
| 策略 | 买入 UNI 现货，做空 UNI-USD-SWAP 币本位永续 |
| 持有时间 | 2026 年 10 月 7 日 19:32 至 11 月 15 日 22:46，约 39 天 |
| 建仓和平仓 | 前 9 天逐步建仓，之后约 30 天维持满仓；最后约 47 分钟完成退出 |
| 现货买入均价 / 卖出均价 | 约 7.49 U / 5.19 U，下跌约 30.7% |
| 时间加权平均占用本金 | 约 4.45 万 U |
| 最终净收益 | <strong>196.74 U</strong> |
| 年化收益 | <strong>约 4.13%</strong> |

现货价格下跌带来的损失，大部分由空头盈利对冲，但并不是完全无风险：建仓时的数量不匹配、币本位结算、资金费率、手续费和买卖价差都会影响结果。

我自己原先核算约 197.06 U，和这份复盘的 196.74 U 相差 0.32 U。本文以复盘报告的现金口径为准，不把这点差异视为已完全查清。

## 三、为什么参考年化 10.96%，最终只有 4.13%

本次复盘假设整个持仓期间每 8 小时都取得 0.01% 的正资金费，并按实际资金占用加权，得到约 <strong>522.31 U</strong> 的无成本参考收益，对应单利参考年化约 <strong>10.96%</strong>。这只是按固定费率构造的比较基准，不是市场保证收益，也不是资金费率的普遍下限。

| 影响因素 | 金额（U） | 年化影响 | 在参考收益与实际收益差额中的占比 |
| --- | ---: | ---: | ---: |
| 交易手续费 | −119.61 | −2.51 个百分点 | 36.8% |
| 资金费低于参考值 | −106.61 | −2.24 个百分点 | 32.8% |
| 开平仓价差 | −76.52 | −1.60 个百分点 | 23.4% |
| 建仓时对冲数量未对齐 | −18.06 | −0.38 个百分点 | 5.6% |
| 资金费币价变化与补空对冲后的净影响 | −4.76 | −0.10 个百分点 | 1.5% |
| <strong>合计</strong> | <strong>−325.56</strong> | <strong>−6.83 个百分点</strong> | 约 100% |

按上述四舍五入的数字计算：522.31 − 325.56 = 196.75 U，与现金口径 196.74 U 相差 0.01 U，来自报告中的取整。各项年化数相加也会有取整误差。

最大的两项是手续费和资金费少收，合计约占差额的七成；开平仓价差又占了两成多。<strong>资金费看着有 10% 左右的年化，并不代表持有者最终能拿到这个收益。</strong>

### 1. 手续费：持有时间越短，摊到年化越重

本轮现货买入约 31.21 U、合约开平仓约 43.14 U、现货卖出约 45.26 U，合计 <strong>119.61 U</strong>。手续费发生在交易时，不会因为我提前退出就消失；持仓时间越短，这笔固定成本摊到年化中的影响越大。

### 2. 资金费率：从收钱变成倒付

117 次结算中，8 次为负，空头倒付合计约 <strong>42.14 U</strong>；另有 6 次低于参考费率。与假设每期都有 0.01% 收入相比，累计少收约 <strong>106.61 U</strong>。这不代表所有 106.61 U 都是现金倒付，其中包括原本假设能收到、实际没有收到的部分。

OKX 的永续资金费由持仓价值和结算时资金费率决定；正负费率决定多空之间的支付方向，具体结算频率应以对应合约的实际规则为准。[OKX 资金费机制](https://www.okx.com/help/perps-funding-fee-mechanism)

### 3. 价差：不能只看两边报价

本轮开仓价差影响约 −137.94 U，平仓时回收约 +61.42 U，合计 <strong>−76.52 U</strong>。其中约 −39.39 U 与 USDT 兑美元偏离的变化有关，约 −37.13 U 与扣除汇率因素后的合约折价变化有关。

现货以 USDT 计价，合约以美元计价；两边比较前需要统一计价单位。报告中建仓和退出时 USDT 的参考价格约为 0.9987 和 0.9994 美元，汇率变化可能让表面基差和真实基差不同。这个拆分是本次复盘口径下的估算，不应当再把 USDT 影响作为一笔独立损失重复相加。


<style>.uni-review-panel{background:#182332;border:1px solid #364d64;border-radius:14px;padding:22px;margin:20px 0;color:#e4edf6}.uni-review-panel h4{margin:0 0 14px;color:#f4f8fc}.uni-review-flow{display:flex;gap:12px;flex-wrap:wrap;align-items:stretch}.uni-review-card{flex:1 1 185px;background:#243449;border-radius:10px;padding:14px}.uni-review-card small{color:#b4c6d9}.uni-review-card b{display:block;font-size:1.12em;color:#ff6969;margin:8px 0}.uni-review-arrow{align-self:center;color:#79c9ff;font-size:1.4em}.uni-review-bars{display:grid;gap:12px;margin:18px 0 8px}.uni-review-track{height:10px;background:#34475b;border-radius:8px;overflow:hidden}.uni-review-bar{height:100%;background:#f46c75;border-radius:8px}.uni-chart-svg{width:100%;height:auto;display:block}.uni-chart-note{font-size:.88em;color:#b7c6d8}.uni-review-formula{display:grid;gap:10px}.uni-review-formula>div{padding:13px 15px;border-left:3px solid #69c5ff;background:#243449;border-radius:5px}.uni-review-formula b{display:block;color:#8ed8ff;margin-bottom:5px}.uni-review-number{color:#e84040;font-weight:700}@media(max-width:600px){.uni-review-arrow{display:none}.uni-review-panel{padding:15px}.uni-review-card{flex-basis:100%}}</style>

<link rel="stylesheet" href="/assets/uni-review/charts.css"><script defer src="/assets/uni-review/charts.js"></script>

<div class="uni-interactive compare" data-kind="compare"><header><h4>UNI 现货 / 币本位合约</h4><div class="uni-periods"><button type="button" data-period="minute">1 分钟</button><button type="button" data-period="daily">1 日</button></div></header><div class="uni-legend"><span><i style="background:#59aaff"></i>合约 UNI-USD-SWAP（USD）</span><span><i style="background:#ff9857"></i>现货 UNI-USDT（USDT）</span><span><i style="background:#ff7277"></i>直接报价差（万分比）</span></div><canvas tabindex="0" role="img" aria-label="UNI 现货 / 币本位合约，可移动鼠标或使用左右方向键查看行情"></canvas><div class="uni-chart-tip" role="status"></div><p class="uni-chart-status">等待加载行情…</p><p class="uni-chart-foot">悬浮查看同一时刻的价格及价差；折线下方为合约 ÷ 现货 − 1 的直接报价差。悬浮框另列 USDT 换算美元后的价差；日线以 UTC 开盘时间标记，价格为该日收盘值。</p></div>

数据来源：[OKX 现货历史 K 线](https://www.okx.com/api/v5/market/history-candles?instId=UNI-USDT&bar=1Dutc&limit=100) 与 [OKX 币本位永续历史 K 线](https://www.okx.com/api/v5/market/history-candles?instId=UNI-USD-SWAP&bar=1Dutc&limit=100)，采集于 2026 年 11 月 16 日。图表按所选周期展示收盘价并共用数值刻度；现货以 USDT、合约以 USD 报价，<strong>不能直接把两条折线的差当作统一计价后的价差</strong>。日线收盘价不等于个人实际成交价，实际成交价差还会受盘口和成交时间影响。

<div class="uni-review-panel"><h4>价差图解：先统一计价单位</h4><div class="uni-review-flow"><div class="uni-review-card"><small>① UNI 现货 · USDT 计价</small><b>7.4900 USDT</b><small>示例现货价格</small></div><div class="uni-review-arrow">→</div><div class="uni-review-card"><small>② 换算成美元</small><b>7.4900 × 0.9987 ≈ 7.4803 USD</b><small>乘以 USDT/USD 汇率</small></div><div class="uni-review-arrow">→</div><div class="uni-review-card"><small>③ 对比合约 · USD 计价</small><b>7.4715 USD</b><small>示例合约价格</small></div></div><div class="uni-review-bars"><div><small>直接比较：约 −0.247%（混入汇率偏离）</small><div class="uni-review-track"><div class="uni-review-bar" style="width:98.8%"></div></div></div><div><small>统一美元后：约 −0.118%（换算后的价差）</small><div class="uni-review-track"><div class="uni-review-bar" style="width:47.2%"></div></div></div></div><p class="uni-chart-note">两条横条使用同一百分比刻度；均为说明计算方式的示例，合约报价并非实际成交价，不包含手续费和滑点。</p></div>

<strong>USDT/USD 指数走势</strong>

<div class="uni-interactive fx" data-kind="fx"><header><h4>USDT/USD 指数</h4><div class="uni-periods"><button type="button" data-period="minute">1 分钟</button><button type="button" data-period="daily">1 日</button></div></header><div class="uni-legend"><span><i style="background:#7ac5ff"></i>OKX USDT/USD 指数收盘价</span></div><canvas tabindex="0" role="img" aria-label="USDT/USD 指数，可移动鼠标或使用左右方向键查看行情"></canvas><div class="uni-chart-tip" role="status"></div><p class="uni-chart-status">等待加载行情…</p><p class="uni-chart-foot">悬浮查看该分钟或日线的开盘、最高、最低、收盘价，以及收盘价相对 1 美元的偏离。</p></div>

数据来源：[OKX USDT/USD 历史指数接口](https://www.okx.com/api/v5/market/history-index-candles?instId=USDT-USD&bar=1Dutc&limit=100)，采集于 2026 年 11 月 16 日。分钟线为日本时间 10 月 16 日全天；日线按 UTC 划分，展示 10 月 7 日至 11 月 16 日，末日为未收盘时的暂报值。指数价格并非个人实际成交价。

### 4. 对冲偏差与资金费收入的币价风险

建仓耗时较长，完成时现货比空单多约 <strong>7.91 UNI</strong>，这部分没有及时对冲，复盘归因约 −18.06 U。币本位资金费以 UNI 结算，累计收到约 59.43 UNI；报告估算因币价变化产生约 −107.56 U 的价值变化，通过持续补充空头对冲约 +102.80 U，净影响约 <strong>−4.76 U</strong>。补空并非无成本，也不能保证未来完全抵消币价风险。

## 四、为什么面板显示盈利更多

面板分项合计约 <strong>263.68 U</strong>，实际现金口径约 <strong>196.74 U</strong>，相差约 <strong>66.94 U</strong>。复盘报告认为，主要原因是币本位资金费和手续费在不同时间按不同 UNI 价格折算；最终变现时又使用了退出价格。报告核对的 UNI 数量差约 0.00004 枚。

这次我以最终现金口径看实际结果，同时保留分项作为过程分析。不同时间的折算数字如果直接相加，容易让账面收益看起来高于实际变现收益。

## 五、币安被盗和 UNI 行情：事实与我的猜测

币安在公告中确认，2026 年 10 月底热钱包遭到攻击，涉及约 63 亿美元资产，并表示由其承担相应损失。[币安安全事件公告](https://www.binance.com/en-NG/support/announcement/detail/d3306d9dca5243548c813b605e1d1751)；[第三方事件复盘](https://lunarcrush.com/research/binance-hack-reconstructed/LunarCrush-Binance-Hack-Reconstructed.pdf)将 UNI 列入受影响代币，首笔以太坊钱包扫出记录约 619 万 UNI；我尚未独立逐笔核对这一数量。

我的交易资料显示，事件当天 UNI 约跌 3.7%，之后回到 7 U 以上，资金费在当时没有显示出明显变化；11 月 11 日至 15 日 UNI 从约 7 U 跌到约 5 U。它们是本次资料中的观察，所选时间和行情来源会影响计算结果。

<strong>我的疑问仍然存在</strong>：币安的受损资产处理、大户可能的交易行为，以及 UNI 价格和费率的异常变化，是否有联系？但现有记录无法回答这个问题：尚未验证具体大户地址、净买入、跨平台持仓及资金费驱动，也无法证明某一主体主动操纵市场。这个疑问是我降低风险、退出仓位的背景，不是对任何主体行为的事实指控。

## 六、我怎样更新量化机会看盘

这次平仓以后，我把复盘中真正影响损益的因素整理进量化机会看盘的积分方案。目标是开仓前同时看到<strong>预期资金费和可能发生的成本</strong>，而不是只按当前费率排序。

| 因素 | 面板中的处理思路 |
| --- | --- |
| 资金费 | 参考近 7 天平均费率，并观察负费率出现的比例 |
| 手续费 | 按假设的交易费率和预计持有天数估算 |
| 基差与盘口 | 比较当前基差与近 14 天中位数，并按指定资金量模拟吃单成本 |
| USDT 偏离 | 统一计价并估计偏离影响；偏离超 0.10% 时不推荐新开仓 |
| 建仓对冲偏差 | 作为执行风险提示，提醒按深度拆单、及时对齐现货与空单 |
| 币本位资金费价值变化 | 提示及时评估补充对冲，但不假定能完全消除风险 |

<div class="uni-review-panel"><h4>积分如何计算</h4><div class="uni-review-formula"><div><b>① 估算净收益率</b>预计资金费收益率 − 手续费率 − 开平仓价差与滑点影响 ± USDT 偏离影响</div><div><b>② 换算预期净年化</b>预期净收益率 ÷ 预计持有天数 × 365 天／年</div><div><b>③ 计算参考积分</b>预期净年化 ÷ 10.95% × 100，结果限制在 0～100 分</div></div></div>

这里的 10.95% 是以每 8 小时 0.01% 按 365 天计算的单利基准；前文 10.96% 沿用原复盘报告的取整口径。不同口径需统一后才能精确比较。本轮 4.13% 按 10.95% 折算约为 <strong>37.7 分</strong>。积分只是特定假设下的相对评分，不是收益保证，也不是亏损概率。

面板还设置前置条件：有对应 USDT 现货、指定金额在当前盘口可成交、近 7 天平均费率为正、USDT 偏离不超过 0.10%，且预计净收益为正。这些是我的筛选规则，并非通用安全标准。

以 2026 年 11 月 16 日的单次盘口快照、1 万 U 和持有 14 天为例，报告估算 15 个币种中仅 BTC 的预期净收益为正，约 1.6% 年化；持有 30 天时估算结果有所变化。这只是历史时点下的模型输出，不代表现在仍成立。

<strong>模型的边界也很明确</strong>：损益占比只来自这一次 UNI 交易；近 7 天费率无法预测未来转负；盘口只是瞬时快照；市价单模拟可能高估慢速建仓成本；未来基差也不一定回归历史中位数。方案还需更多已平仓样本和持续验证，不能把一次案例当成稳定规律。

## 七、这次最大的收获

这笔 UNI 最后是赚钱的，39 天净赚了 196.74 U，年化约 4.13%。但为了拿到这点收益，我得一直关注费率、仓位和市场变化，已经不符合我当初想省心理财的想法了。

所以我选择平仓。至于异常行情背后到底是谁、为什么这样，我现在没有证据，不能下结论。能确定的是，这次让我看清了手续费、价差和资金费变化对收益的影响，也让我知道自己的看盘工具还缺什么。

接下来，我会继续完善积分机制，用更多真实平仓记录检验它。以后再看到高年化，先把成本和风险算清楚，再决定要不要做。

<strong>遇到问题不可怕，可怕的是不知道出现了什么问题。</strong>
