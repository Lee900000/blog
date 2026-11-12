---
title: Moss 产品调研：AI Agent 链上资本市场的运作与体验
description: 从交易所开发者与普通用户的视角，观察 Moss 的 Agent 份额、交易授权、价格解释与产品体验。
postDesc: 结合实际截图，理解 AI Agent 份额、Hyperliquid 交易与用户关心的持仓和资金透明度。
date: 2026-11-11 22:40:00
updated: 2026-11-11 22:40:00
cover: /assets/moss-agent-research/agent-marketplace.png
top_img: /assets/moss-agent-research/agent-marketplace.png
categories:
  - - 金融科技
tags:
  - AI Agent
  - 量化交易
  - Hyperliquid
  - 产品调研
permalink: archives/b1dc8308.html
---

<strong>调研时间：</strong> 2026 年 11 月 11 日<br>
<strong>调研视角：</strong> 交易所一线开发人员、潜在求职者及普通理财用户<br>
<strong>调研对象：</strong> Moss 的「AI Agent 链上资本市场」，并结合「AI 交易竞技场」进行初步观察

> <strong>免责声明</strong>：本文是本人因看到 Moss 招聘信息而进行的个人产品调研，主要依据有限的页面体验、截图及公开资料整理。文中的判断、推测和优化建议均为个人看法，不代表 Moss 官方立场，也不保证与其实际系统完全一致。文中不构成投资、法律或安全审计意见；任何策略历史表现都不代表未来收益。具体功能与规则以平台当时页面、实际部署合约及官方资料为准。

## 一、为什么调研 Moss

最近看到 Moss 的招聘信息，对它的产品产生了好奇。作为一名长期从事交易所一线开发的人员，我比较关注交易、量化和资金管理类产品，也想从用户和产品设计的角度，理解它究竟在做什么。

我重点体验了 Moss 所称的「AI Agent 链上资本市场」，并初步查看了另一个产品「AI 交易竞技场」。在创建 Agent 的过程中，我尝试填写产品信息、查看合约设置；同时参考了官方公开的代码仓库和 Hyperliquid 文档。

这次调研的目的，是理解产品机制、记录自己的疑问，并思考它如何让普通用户更容易理解和信任。<strong>本文不是对团队、招聘岗位或项目安全性的定论。</strong>

![Moss Agent 市场列表](/assets/moss-agent-research/agent-marketplace.png)

*图：用户提供的市场截图，价格和排名为截图时点数据。*

## 二、我理解的产品结构

Moss 希望把交易策略包装成可以被用户申购份额的链上 Agent：策略提供者创建 Agent，用户根据自己的判断投入资金、获得份额，再根据 Agent 资产价值的变化承担盈亏。

从传统金融产品的体验来理解，它有点像「策略广场 + 份额申购 + 资金管理」。但这种类比只用于帮助理解业务流程，并不意味着它就是受监管基金，也不意味着存在传统基金的托管、信息披露或投资者保护机制。

Moss 的[创建页面](https://moss.site/create)将 Hyperliquid 永续交易 Agent 描述为由持有人共同提供资金，并按份额参与策略表现。页面也展示治理、消费等其他模板；本文主要讨论<strong>交易类 Agent</strong>，不把所有类型混为一谈。

### 1. 两个相关产品

| 产品 | 我的初步理解 | 本次调研的边界 |
| --- | --- | --- |
| <strong>AI Agent 链上资本市场</strong> | 用户查看 Agent、申购份额，策略使用 Agent 关联资金进行交易，盈亏影响份额价值 | 重点研究产品体验、地址授权、持仓透明度与价格解释 |
| <strong>AI 交易竞技场</strong> | 展示不同策略或 Agent 的交易与表现，可作为用户了解策略的入口 | 只做了初步体验，尚未逐个核验策略来源、实时运行状态和与市场 Agent 的对应关系 |

两个产品看起来可以形成「策略创建和展示 → Agent 发布 → 用户申购」的路径。Moss 的创建页面也引导尚未创建策略的用户前往 Agent Tool，但每个线上 Agent 是否都经过这一流程，还需要逐一核实。

## 三、从用户视角看，一次参与可能经历什么

按照当前公开资料和我的理解，交易类 Agent 的概念流程大致如下：

<link rel="stylesheet" href="/assets/moss-agent-research/agent-flow.css">
<div class="moss-flow" role="group" aria-label="交易类 Agent 从发布到赎回的概念流程">
  <div class="moss-flow__header"><div><span class="moss-flow__eyebrow">THE AGENT JOURNEY</span><span class="moss-flow__title">从策略发布到份额赎回</span></div><span class="moss-flow__badge">交易类 Agent · 概念流程</span></div>
  <div class="moss-flow__stages">
    <section class="moss-flow__stage"><div class="moss-flow__stage-head"><span class="moss-flow__icon" aria-hidden="true">✦</span><span><small>STAGE 01</small><b>发布策略</b></span></div><ol class="moss-flow__steps" start="1"><li><b>创建 Agent</b><span>策略提供者创建并发布策略</span></li></ol><div class="moss-flow__who">策略提供者</div></section>
    <section class="moss-flow__stage"><div class="moss-flow__stage-head"><span class="moss-flow__icon" aria-hidden="true">◉</span><span><small>STAGE 02</small><b>了解与参与</b></span></div><ol class="moss-flow__steps" start="2"><li><b>查看信息</b><span>了解策略、历史表现与风险</span></li><li><b>申购份额</b><span>用户申购并获得 Agent 份额</span></li></ol><div class="moss-flow__who">用户 / 持有人</div></section>
    <section class="moss-flow__stage"><div class="moss-flow__stage-head"><span class="moss-flow__icon" aria-hidden="true">↗</span><span><small>STAGE 03</small><b>资金与交易</b></span></div><ol class="moss-flow__steps" start="4"><li><b>资金调配</b><span>Agent 关联账户获得可交易资金</span></li><li><b>授权执行</b><span>授权的程序或地址代表 Agent 下单</span></li><li><b>资产变化</b><span>交易盈亏影响 Agent 资产价值</span></li></ol><div class="moss-flow__who">Agent / 执行者</div></section>
    <section class="moss-flow__stage"><div class="moss-flow__stage-head"><span class="moss-flow__icon" aria-hidden="true">✓</span><span><small>STAGE 04</small><b>结算与退出</b></span></div><ol class="moss-flow__steps" start="7"><li><b>结算与赎回</b><span>结算份额价格，用户按规则申请赎回</span></li></ol><div class="moss-flow__who">持有人</div></section>
  </div>
  <div class="moss-flow__foot">概念示意 · 具体资金流与结算规则以实际合约为准</div>
</div>

这只是概念流程，不代表每个 Agent 的实时链上调用已被核验。申购、结算、领取和赎回可能分为多个步骤；具体到账时间及费用应以实际合约为准。

![Moss 创建 Agent 的合约与钱包设置](/assets/moss-agent-research/agent-contract-settings.png)

*图：用户提供的 Agent 合约设置页面。*

### HyperEVM 和 Hyperliquid 分别做什么

Hyperliquid 包含 HyperCore 和 HyperEVM 等部分。可以粗略理解为：<strong>HyperEVM 承载智能合约，HyperCore 提供现货和永续交易账户、订单簿等交易能力。</strong>两者属于同一个 Hyperliquid 生态中的不同组成部分。 [Hyperliquid 官方文档](https://hyperliquid.gitbook.io/hyperliquid-docs/hyperevm)

Moss 的[执行器公开仓库](https://github.com/moss-site/moss-executor-skill)描述了 Agent 合约、跨层资金、净值结算和交易账户的分工。代码说明有助于理解设计，但不能自动证明每个线上 Agent 使用同一版本，或已经正确执行。

## 四、我的理解：它更接近“操作集合资金”，而不是单纯复制个人带单

创建过程中，平台要求提供交易钱包地址。结合公开资料，我目前的理解是：策略提供者控制一个执行地址；如果 Agent 关联的 Hyperliquid 账户授权了该地址，提供者就有可能通过交易程序代表 Agent 账户下单，交易结果记在 Agent 账户中。 [Hyperliquid API Wallet 说明](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/nonces-and-api-wallets)；[Moss contract-agent 授权说明](https://github.com/moss-site/moss-market-place-copy-trade-agent/blob/main/SKILL.md)。

如果实际部署也是这样，那么它与我熟悉的一些“带单员使用自己账户开仓、用户在各自账户跟随”的模式不同：<strong>策略方可能通过获授权地址，操作属于 Agent 的集合交易账户，而用户持有代表权益的份额。</strong>这也是我觉得它更像基金经理管理策略的原因。

不过，传统市场和加密市场存在不同的跟单、委托和资产管理模式，不能一概而论。对 Moss 的具体 Agent，目前还需要验证：

- 填写的地址是交易签名地址、账户地址，还是其他角色；
- 授权是否真的生效，能执行哪些操作，是否能撤销；
- 交易是由策略程序自动提交、由人通过程序提交，还是两者都支持；
- Owner、Executor 和交易钱包是否由同一方控制，是否存在升级或其他管理权限。

<strong>提供一个地址本身，不代表 Agent 已开始交易，也不代表它一定会自动复制这个地址的历史操作。</strong>Moss 有公开的跟单程序，但不同的信号来源和执行模式不能直接等同。 [Moss 跟单项目](https://github.com/moss-site/moss-market-place-copy-trade-agent)

![Lee 套利机器人创建页面及钱包配置](/assets/moss-agent-research/lee-agent-settings.png)

*图：创建时的设置页面；截图不表示合约已经部署。*

## 五、AI 交易竞技场：我的观察、推测和待验证问题

我在初步查看 [AI 交易竞技场](https://moss.site/moss/agent)时，看到部分策略标注了约 <strong>32～304 天的回测周期</strong>。这是我的页面观察，不代表所有策略都使用相同周期，也不能直接当成策略已经实盘运行了这么久。此次网页抓取未能完整读取该页面，尚未逐个核对这些样本。

从页面体验出发，我产生了一个产品上的猜测：平台可能将一些常见量化思路做成策略模板，结合回测数据，让创建者选择；对应的 Agent 再利用策略信息回答用户问题，减少策略提供者重复解释的工作。按我的开发经验，也可以设想通过策略配置、知识文档或 Skill 来组织这些问答能力。

对于实际交易，我的猜测并不是“每一笔都由人手工下单”：可能由人触发程序，通过获授权的交易地址执行；也可能由事先写好的量化策略按规则自动运行。我的疑问是，<strong>AI 是否真正参与了每次交易决策，还是主要用于策略配置、解释和用户问答；实际交易中 AI、预设规则与人工各自承担什么作用，值得进一步了解。</strong>目前这仍是我的个人判断，尚需核实。

以下是我尚未核实、希望进一步了解的问题：

- 每个策略都只是把回测结果作为聊天回答依据；
- 每个 Agent 都对应一个单独的 Skill；
- 每个 Agent 的每次交易由谁触发、由什么程序决策和执行，以及 AI 具体参与到哪一步；
- 用户看到的所有历史曲线都来自回测，而非模拟或实盘。

另外，Moss 的[公开交易机器人仓库](https://github.com/moss-site/moss-trade-bot-skills)描述了将自然语言转换为策略参数、运行回测、根据结果调整参数，以及启动自动交易循环的能力。仓库将其框架描述为面向模拟 Hyperliquid 永续交易，并提到可选的平台集成；这些描述表明其方案可能不止用于回答问题，也包含程序自动运行的设计；但<strong>程序自动执行不等于 AI 对每笔交易作出决策</strong>。仓库不能单独证明某个线上 Agent 的具体运行方式或 AI 的实际参与程度。

从用户角度，如果平台能够进一步说明以下内容，会更有助于理解产品：<strong>策略是谁制定的、每笔单是谁或什么程序决策并提交的、AI 参与到哪一步、人在什么情况下可以干预。</strong>

另外，回测、模拟交易和实盘应该分开展示：

- <strong>回测</strong>：用历史行情验证策略，结果受数据质量、参数选择、费用和回测方式影响。
- <strong>模拟交易</strong>：按实时或历史行情模拟交易，不一定存在真实成交和流动性冲击。
- <strong>实盘交易</strong>：真实账户下单并承担盈亏，但仍要说明账户是否就是用户申购的 Agent 账户。

如果 304 天指的是回测周期，建议与实盘运行时间分开展示，方便用户理解。

## 六、从用户视角看：希望进一步了解的交易与资金信息

以我查看的 [AVGO #027](https://moss.site/agent/hyperliquid/27) 为例，[页面截图](/assets/moss-agent-research/avgo-027-activity.png)中能看到成交方向、价格、数量、部分已实现盈亏，以及未达到交易门槛而未执行的记录。这些信息有助于用户了解 Agent 的部分活动。

![AVGO #027 Agent 实时活动和铸造价格](/assets/moss-agent-research/avgo-027-activity.png)

*图：用户提供的 AVGO #027 页面截图，展示部分活动和当时的铸造价格。*

但站在准备投入资金的用户角度，我仍然无法仅凭这些记录回答几个问题：

1. <strong>现在实际持有什么仓位？</strong>仓位方向、数量、杠杆、保证金和强平风险是什么？
2. <strong>记录覆盖哪些内容？</strong>能否查看委托、撤单、资金费、手续费和失败操作？
3. <strong>钱现在在哪里？</strong>多少在 HyperEVM，多少在 HyperCore，多少是在途或等待赎回？
4. <strong>谁可以操作？</strong>策略创建者、合约 Owner、Executor 和平台各自拥有什么权限？
5. <strong>展示的价格怎么来的？</strong>资产、盈亏和份额总数如何对应到每份价格？

从我目前的体验看，如果能把资金、交易与定价信息进一步关联展示，并提供核对入口，普通用户会更容易理解。这是基于有限体验提出的建议，平台是否已有其他查询方式仍有待了解。

## 七、铸造价格：看起来像基金净值，但应该解释清楚

Moss 使用的 <strong>Mint Price（铸造价格）</strong>，在用户体验上类似“每份策略份额的价格”。创建页面截图允许设置初始铸造价格；之后的价格，公开执行器资料描述了根据 Agent 的 EVM 余额、HyperCore 账户价值及待处理申赎等状态进行净值结算。 [Moss Executor 仓库](https://github.com/moss-site/moss-executor-skill)

为了理解，可以先用一个简化示例：

| 时点 | 假设可归属于持有人的资产 | 有效份额 | 每份参考价值 |
| --- | ---: | ---: | ---: |
| 初始 | 1,000 USDC | 1,000 | 1 USDC |
| 假设盈利后 | 1,200 USDC | 1,000 | 1.2 USDC |
| 假设亏损后 | 800 USDC | 1,000 | 0.8 USDC |

这只是示意，<strong>不是已核验的 Moss 线上合约公式</strong>。实际价格可能受费用、待结算申赎、资金在途、未实现盈亏、快照时间和取整影响。

AVGO #027 的截图中，铸造价格显示 `0.41665 USDC`，同时显示 `+22.91%`。截图还列出若干交易，但没有足够信息说明该价格如何由这些交易计算出来，也没有独立核验这个涨幅的统计口径。如果页面能够补充价格计算依据和对应账本，用户就能更方便地理解和核对这一价格。

我希望平台在价格旁边提供：

- 净值快照时间和资产计价范围；
- 可核验的账户资产、持仓、盈亏、费用、在途资金；
- 已发行和有效计价份额，以及待申购、待赎回的处理口径；
- 价格计算公式、结算交易和数据来源；
- 页面参考价格与最终申购、赎回价格的区别。

这里尤其重要的是：<strong>初始价格可由创建者设置，不代表每次结算价格都能随意填写；但只有核实实际合约和净值输入权限后，才能判断价格约束是否充分。</strong>

## 八、个人建议优化方向

### 1. 给用户一份真正能看懂的持仓和账单

我希望在 Agent 页面直接看到持仓，而不是自己再去多个浏览器拼数据。至少包括：交易品种、方向、数量、名义价值、杠杆、开仓均价、标记价格、保证金、强平价、已实现和未实现盈亏，以及数据更新时间。

操作记录应覆盖委托、撤单、成交价格与数量、费用、资金费、资金划转和申购赎回，并能跳转原始记录。对于无法获取、延迟或缺失的数据，应直接提示，不应显示成零。

技术上有一个容易混淆的点：<strong>策略提供者填写的签名钱包，不一定就是实际持仓账户。</strong>Hyperliquid 官方说明，API Wallet 可以代主账户签名；查询持仓需要实际主账户或子账户地址，查签名钱包可能得到空结果。 [Hyperliquid 官方说明](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/nonces-and-api-wallets)

历史数据也有接口窗口限制。如果平台希望提供长期完整账单，可以考虑持续索引、保存和核对数据，并向用户提供方便的查询入口。 [Hyperliquid Info API](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/info-endpoint)

### 2. 明确平台的责任和资金控制边界

我的初始想法是：平台至少应该对资金统一管理并作出背书，让用户知道出了问题找谁。但进一步考虑后，单纯把资金全部交给平台，也会增加平台私钥、内部人员和单点故障风险。

我更希望 Moss 明确披露并承担<strong>准入审查、资金对账、风险监控、异常响应和信息披露</strong>等责任，同时让用户看懂资产实际由谁控制：

- 每个 Agent 的资金是否独立隔离；
- 谁掌握 Owner 和 Executor，谁能更换授权或升级合约；
- 执行地址可以交易、转账或做哪些其他操作；
- 是否有多签、时间锁、第三方审计和权限变更通知；
- 平台是否监控异常交易、关联账户和利益冲突。

截图中的创建页面写着平台不托管策略或私钥；这不能直接回答“平台是否托管资金”或“平台是否监管每个 Agent”。这些问题仍需要平台明确说明。统一管理或平台背书也不能自动等于保本。

### 3. 借鉴基金界面，降低学习成本

我第一次打开 Moss 时，并没有立即理解“铸造、Agent、份额、HyperEVM”之间的关系。后来借助 AI 调研，再结合近期购买基金的经验，才逐步理解它的产品形式。

如果产品希望吸引更多普通用户，可以借鉴大家熟悉的基金体验：

| 当前表达 | 可以考虑的表达 | 需要说明 |
| --- | --- | --- |
| Mint | 申购份额 | 申请、结算、领取是否分步 |
| Redeem | 赎回份额 | 锁定、结算、到账时间及失败情况 |
| Mint Price | 每份参考价格 | 计算公式和是否等同最终申购价 |
| Agent | 策略 Agent | AI、程序和人各自负责什么 |
| Holder | 份额持有人 | 持有人实际享有什么权利 |

我的建议是<strong>借鉴用户熟悉的语言，不是把产品直接宣传成传统基金</strong>。在实际规则不同的地方，要把差异写出来，避免用户误以为享有相同的监管或保障。

### 4. 把风险和收益放在同样重要的位置

Agent 列表除了展示阶段涨幅，也可以展示最大回撤、杠杆、仓位集中度、实盘运行时间、交易频率、历史净值、资金规模和费用，并明确区分回测、模拟和实盘。

用户持有后，可以选择接收通知：大额开平仓、杠杆变化、异常回撤、清算风险、资金转移、价格结算、赎回状态、权限变更与合约升级。高频交易应支持汇总通知，避免信息轰炸。

### 5. 解释“AI 到底做了什么”

对每个 Agent，建议明确标识：

- 策略由人设计，还是由 AI 辅助生成；
- 信号由规则引擎、模型、人工或组合产生；
- 交易由程序自动提交，还是允许人工介入；
- 面向用户的回答依据哪些数据，是否能链接到对应记录；
- 策略参数、模型和执行权限发生变化时，是否通知持有人。

这能帮助用户理解 Agent，也能避免把“AI 可以回答问题”误认为“每笔交易都由 AI 独立完成”。

## 九、尚未核实，需要继续向 Moss 求证

1. 截图中的交易钱包具体是签名地址还是持仓账户？创建页面要求“新地址”的条件和原因是什么？
2. Agent 的实际交易可以由创建者手动或通过第三方程序发起吗？与 Moss 自动策略、跟单服务如何区分？
3. 每个 Agent 的 Owner、Executor、合约升级和 HyperCore 授权分别由谁控制？平台能否暂停异常 Agent？
4. 资金如何在 HyperEVM 与 HyperCore 之间移动？谁负责对账，资金在途或执行器离线时如何处理？
5. Mint Price 的实际线上公式、结算时点、费用、输入数据来源和权限是什么？用户能否复算？
6. 赎回时如果存在持仓、流动性不足、合约暂停或网络异常，用户如何退出？
7. 竞技场中各条曲线分别是回测、模拟还是实盘？回测期与实盘运行期如何区分？
8. 是否存在覆盖具体部署合约、实现版本和权限配置的第三方审计？平台是否有公开事故和风险处理机制？

## 十、我的结论

我认为 Moss 有意思的地方，是尝试把量化策略、AI Agent 和链上份额结合起来，让策略提供者和资金持有人通过一个产品连接。但从我这次的体验来看，我尤其关注用户能否理解资金与风险，以及能否核对 Agent 的实际操作。

如果一个人准备申购某个 Agent，我希望他不需要先研究代码、Skill 和链上浏览器，就能回答：我把钱交给了什么规则？现在持有什么仓位？谁能操作？我什么时候能退出？

我期待的产品方向是：<strong>让用户像看基金一样容易理解，又能像查看交易账户一样核对资金、持仓和操作；AI 的参与程度、人的控制权限和平台承担的责任都清楚可见。</strong>

以上是基于目前有限调研形成的个人看法，后续如果获得具体合约、官方解释或新的产品体验，应继续修正。
