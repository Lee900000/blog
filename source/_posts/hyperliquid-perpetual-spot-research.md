---
title: Hyperliquid 调研：永续合约、现货机制与交易风险
description: 从交易所产品与技术视角梳理 Hyperliquid 运作、入金、保证金、现货与永续、历史事件和交易术语。
postDesc: 一份基于 2026 年 9 月资料与市场快照的 Hyperliquid 产品调研。
date: 2026-09-14 14:15:00
updated: 2026-09-14 14:15:00
cover: /assets/hyperliquid-research/usdc-deposit-withdrawal.png
top_img: /assets/hyperliquid-research/usdc-deposit-withdrawal.png
categories:
  - - 币圈相关
tags:
  - Hyperliquid
  - 永续合约
  - 现货交易
  - 产品调研
permalink: archives/081a6063.html
---

> **阅读说明：** 本文整理自 2026 年 9 月 14 日的调研，市场数据为 2026 年 9 月 13 日的历史快照，不代表实时行情。产品规则和接口可能变化，实际使用请查阅最新官方文档。2026 年 11 月查阅时，官方已区分 Standard、Unified Account 和 Portfolio Margin 模式，且网页默认使用 Unified Account；本文关于现货与永续分账、账户划转的描述应按账户模式理解。有关可用保证金、提现限制和清算条件，也应分别依据当前规则核算，不宜直接将维持保证金公式视为可开仓余额。参考：[账户模式](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/account-abstraction-modes)、[保证金规则](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/margining)。

> 调研目的：理解 Hyperliquid 的永续合约与现货产品、两者的组合使用方式，并总结其机制对交易所产品设计的启示。本文为产品与技术调研，不构成投资建议。
>
> 市场数据口径：Hyperliquid 公开 `info` API 的抓取结果，保存于本目录 [市场汇总快照](/assets/hyperliquid-research/live_api_summary.json) 与 [原始 API 快照](/assets/hyperliquid-research/live_api_snapshot.json)，抓取时间 <strong>2026-09-13T12:03:34.946345Z</strong>；正文简称“截至 2026-09-13T12:03:34Z”。请求类型为 `metaAndAssetCtxs` 与 `spotMetaAndAssetCtxs`（`POST https://api.hyperliquid.xyz/info`），请求格式见官方文档。<a class="hl-citation" href="#hl-source-17" aria-label="查看参考来源 17">[17]</a><a class="hl-citation" href="#hl-source-20" aria-label="查看参考来源 20">[20]</a>
>
> 阅读提示：专业术语的解释、类别（是否为标准术语）与外部来源，统一列在第 10 节术语表。

<link rel="stylesheet" href="/assets/hyperliquid-research/terms.css">

## 1. 调研概览

Hyperliquid 是为全链上开放金融系统设计的高性能 L1 区块链；其执行层分为 <span class="hl-key-term">HyperCore</span> 与 <span class="hl-key-term">HyperEVM</span>，前者原生承载永续合约、现货订单簿及强平，后者提供通用智能合约环境。<a class="hl-citation" href="#hl-source-1" aria-label="查看参考来源 1">[1]</a>

它的交易体验更接近中心化交易所（CEX），而不是基于 AMM 的去中心化交易所：现货和永续都在全链上 <span class="hl-key-term">CLOB</span> 中按价格—时间优先撮合，价格、数量分别受 tick size 与 lot size 约束。<a class="hl-citation" href="#hl-source-18" aria-label="查看参考来源 18">[18]</a> 永续是以 1 单位标的为合约单位的线性永续合约，主流模式是 <strong>USDC 作为保证金、价格以 USDT 计价</strong>；系统不做 USDC/USDT 汇率换算，官方明确称其为 quanto 合约，即“以 USDT 计算出的盈亏按 1:1 记为 USDC”，不能理解成普通 USDT 保证金合约。<a class="hl-citation" href="#hl-source-16" aria-label="查看参考来源 16">[16]</a>

永续支持做多、做空与杠杆，保证金模式分为全仓和逐仓；<span class="hl-key-term">资金费率</span>每小时在多空双方之间结算，并以 <strong><span class="hl-key-term">oracle price</span></strong> 计算名义价值。<a class="hl-citation" href="#hl-source-12" aria-label="查看参考来源 12">[12]</a><a class="hl-citation" href="#hl-source-13" aria-label="查看参考来源 13">[13]</a> 与之不同，<strong><span class="hl-key-term">mark price</span></strong> 是多源稳健价格，用于保证金、强平、止盈止损（TP/SL）触发和未实现盈亏。<a class="hl-citation" href="#hl-source-22" aria-label="查看参考来源 22">[22]</a> 现货交易会发生真实的资产余额交换：HIP-1 定义原生代币及原生现货订单簿，HIP-2 则为早期 USDC 交易对提供协议内置的自动流动性。<a class="hl-citation" href="#hl-source-24" aria-label="查看参考来源 24">[24]</a><a class="hl-citation" href="#hl-source-25" aria-label="查看参考来源 25">[25]</a>

现货与永续可以组合为 <span class="hl-key-term">delta 对冲</span>（delta hedging）、<span class="hl-key-term">期现套利</span>（cash-and-carry）、做市商库存风险对冲和跨交易所对冲；<span class="hl-key-term">Portfolio Margin</span>（组合保证金）进一步把合资格现货余额、永续仓位和借贷统一计入风险，但官方设有账户准入门槛与全局/用户借贷额度，额度触顶时回退为非组合保证金，且清算顺序不确定。<a class="hl-citation" href="#hl-source-23" aria-label="查看参考来源 23">[23]</a>

从交易所产品设计角度，最值得关注的是五条主线：统一 CLOB 撮合语义；明确区分成交价、oracle price 与 mark price；下单时和撮合时双重保证金检查；资产编号与展示名称解耦；先有标准的全仓/逐仓，再演进到组合保证金。<a class="hl-citation" href="#hl-source-2" aria-label="查看参考来源 2">[2]</a><a class="hl-citation" href="#hl-source-12" aria-label="查看参考来源 12">[12]</a><a class="hl-citation" href="#hl-source-18" aria-label="查看参考来源 18">[18]</a><a class="hl-citation" href="#hl-source-19" aria-label="查看参考来源 19">[19]</a><a class="hl-citation" href="#hl-source-22" aria-label="查看参考来源 22">[22]</a><a class="hl-citation" href="#hl-source-23" aria-label="查看参考来源 23">[23]</a>

## 2. 运作机制：一个链上的 DEX

### 2.1 一句话理解 Hyperliquid

Hyperliquid 是一个<strong>去中心化交易所（DEX）</strong>，但它不是部署在以太坊上的一个应用，而是自己做了一条区块链（L1），把“订单簿、撮合、保证金、强平”这些交易所核心功能直接写进链的底层（HyperCore）。<a class="hl-citation" href="#hl-source-1" aria-label="查看参考来源 1">[1]</a> 用户用自己的钱包地址登录和签名下单，资产记在链上该地址名下，而不是存进某家公司的账户。<a class="hl-citation" href="#hl-source-21" aria-label="查看参考来源 21">[21]</a><a class="hl-citation" href="#hl-source-26" aria-label="查看参考来源 26">[26]</a>

可以把它想象成：<strong>界面和速度像币安这类中心化交易所，但账本、撮合结果和资金都在公开的区块链上。</strong> 下单、撤单、成交、强平每一步都是链上交易，并且一个区块就确认、不可回滚。<a class="hl-citation" href="#hl-source-1" aria-label="查看参考来源 1">[1]</a> 在 Hyperliquid 上交易本身不需要付 gas，只有从其他链入金时需要在那条链上付 gas。<a class="hl-citation" href="#hl-source-21" aria-label="查看参考来源 21">[21]</a>

### 2.2 DEX 和 CEX 有什么区别

| 对比项 | 中心化交易所（CEX，如 Binance、OKX） | Hyperliquid（链上 DEX） |
|---|---|---|
| 谁保管资产 | 交易所公司保管，用户看到的是平台内部账户余额 | 资产记在链上用户自己的钱包地址名下，由区块链状态记录 |
| 如何登录 | 注册账号、身份认证、账号密码 | 连接自己的钱包（或邮箱登录），用钱包签名授权交易 |
| 撮合在哪里 | 交易所自己的服务器，外部看不到过程 | 链上订单簿，按公开规则撮合，结果写入区块 |
| 账本是否公开 | 不公开，只能相信平台 | 公开，任何人都可以查询链上状态 |
| 入金 / 提现 | 转账到平台地址，由平台记账和审批出金 | 通过链上桥入金；提现是由用户发起、提交到桥合约的链上请求 |
| 主要风险 | 平台挪用、跑路、被盗、冻结账户 | 私钥丢失、合约或跨链桥漏洞、链本身故障 |

表中关于 CEX 与 DEX 的一般区别见 <a class="hl-citation" href="#hl-source-30" aria-label="查看参考来源 30">[30]</a><a class="hl-citation" href="#hl-source-31" aria-label="查看参考来源 31">[31]</a>；Hyperliquid 的具体做法见 <a class="hl-citation" href="#hl-source-1" aria-label="查看参考来源 1">[1]</a><a class="hl-citation" href="#hl-source-3" aria-label="查看参考来源 3">[3]</a><a class="hl-citation" href="#hl-source-21" aria-label="查看参考来源 21">[21]</a><a class="hl-citation" href="#hl-source-26" aria-label="查看参考来源 26">[26]</a>。

### 2.3 如何入金：钱是怎么进来的

![USDC 通过 Arbitrum 在钱包与 HyperCore 账户之间入金和出金的流程](/assets/hyperliquid-research/usdc-deposit-withdrawal.png)

*以 USDC 的 Arbitrum 路径为例：入金从钱包经跨链桥进入 HyperCore；出金从 HyperCore 发起提现，到账 Arbitrum 钱包。其他资产和网络可能使用不同路径，实际操作前请核对网络、地址和费用。参考：[Hyperliquid 官方入金与提现说明](https://hyperliquid.gitbook.io/hyperliquid-docs/onboarding/how-to-start-trading)。*

官方给出的钱包入金流程是：<a class="hl-citation" href="#hl-source-21" aria-label="查看参考来源 21">[21]</a>

1. <strong>准备钱包和资产</strong>：一个 EVM 钱包（如 Rabby、MetaMask），以及 Arbitrum 链上的 USDC 和少量 ETH（ETH 只用于支付这笔入金的 gas）。也可以入金 BTC、ETH、SOL 等其他链资产，但到账后需要在 Hyperliquid 上卖成 USDC 等报价资产才能用于对应市场。
2. <strong>连接钱包</strong>：在 app.hyperliquid.xyz 点击 Connect，钱包弹窗确认连接。
3. <strong>启用交易</strong>：点击 Enable Trading，钱包弹出一个不需要 gas 的签名请求，签名后即可交易。
4. <strong>存入 USDC</strong>：输入金额点 Deposit，在钱包里确认这笔 Arbitrum 上的转账。

用邮箱登录的用户，则是把 Arbitrum、Ethereum、Base 或 Polygon 上的 USDC 转到页面显示的入金地址，到账后同样成为 HyperCore 上的 USDC。<a class="hl-citation" href="#hl-source-21" aria-label="查看参考来源 21">[21]</a> 从技术上看，USDC 已由 Circle 在 Hyperliquid L1 上原生发行，跨链到账主要走 Circle 的 CCTP；旧的 Arbitrum 桥承载的 USDC 已不到 10%。<a class="hl-citation" href="#hl-source-29" aria-label="查看参考来源 29">[29]</a>

### 2.4 入金后，保证金以什么形式存在

入金到账后，钱不是“存在交易所”，而是变成 <strong>HyperCore 链上状态里、你这个地址名下的一笔 USDC 余额</strong>。具体分两本账：<a class="hl-citation" href="#hl-source-26" aria-label="查看参考来源 26">[26]</a>

- <strong>永续账户（perps clearinghouse）</strong>：记录每个地址的永续保证金余额和仓位。<strong>入金默认先记入这里的全仓保证金余额</strong>，开仓默认也是全仓模式，这笔 USDC 就是所有全仓仓位共用的保证金。<a class="hl-citation" href="#hl-source-26" aria-label="查看参考来源 26">[26]</a>
- <strong>现货账户（spot clearinghouse）</strong>：记录每个地址的现货代币余额和挂单冻结额度。现货买卖时用的是这里的 USDC。<a class="hl-citation" href="#hl-source-26" aria-label="查看参考来源 26">[26]</a>

两本账之间的 USDC 可以通过“永续账户 ↔ 现货账户”划转互相移动，这是一笔原子操作。<a class="hl-citation" href="#hl-source-3" aria-label="查看参考来源 3">[3]</a><a class="hl-citation" href="#hl-source-24" aria-label="查看参考来源 24">[24]</a> 如果选择逐仓，就是从全仓余额里划出一部分，单独分配给某一个仓位，这个仓位被强平不会波及其他仓位。<a class="hl-citation" href="#hl-source-12" aria-label="查看参考来源 12">[12]</a><a class="hl-citation" href="#hl-source-26" aria-label="查看参考来源 26">[26]</a>

保证金的实际可用额度会随行情变化：全仓账户价值会受到保证金余额和未实现盈亏影响；开仓需要满足初始保证金要求，维持保证金则用于判断强平风险，不能直接把「账户价值减去维持保证金」作为可开仓或可提现金额。<a class="hl-citation" href="#hl-source-12" aria-label="查看参考来源 12">[12]</a><a class="hl-citation" href="#hl-source-14" aria-label="查看参考来源 14">[14]</a> 开启 Portfolio Margin 后，现货余额和永续仓位会合并计算保证金，现货资产还能按 LTV 抵押借款。<a class="hl-citation" href="#hl-source-23" aria-label="查看参考来源 23">[23]</a>

### 2.5 产品定位

Hyperliquid 将交易基础设施直接做进 L1：HyperCore 包含全链上永续与现货订单簿，每笔下单、撤单、成交和强平都记录在链上，并继承 HyperBFT 共识的单区块终局性（finality）；HyperEVM 则让智能合约复用 HyperCore 的流动性与金融功能。<a class="hl-citation" href="#hl-source-1" aria-label="查看参考来源 1">[1]</a> 因而它既是交易所，也是可供第三方应用接入的交易与结算基础设施。<a class="hl-citation" href="#hl-source-1" aria-label="查看参考来源 1">[1]</a>

### 2.6 市场微观结构

HyperCore 为每个资产维护一本 CLOB，订单按价格—时间优先撮合；价格必须是 tick size 的整数倍，数量必须是 lot size 的整数倍。<a class="hl-citation" href="#hl-source-18" aria-label="查看参考来源 18">[18]</a> 对永续订单，开单时会检查保证金，挂单作为被动方成交时还会再次检查，以保证挂单期间 oracle price 变化后保证金体系仍然一致。<a class="hl-citation" href="#hl-source-19" aria-label="查看参考来源 19">[19]</a>

公开 API 分为两类：`info` 用于读取市场、订单簿、K 线及用户状态，`exchange` 用于下单、撤单、改单、调整杠杆/逐仓保证金及资产转移等需要签名的操作。<a class="hl-citation" href="#hl-source-2" aria-label="查看参考来源 2">[2]</a><a class="hl-citation" href="#hl-source-3" aria-label="查看参考来源 3">[3]</a> 行情读取与交易写入因此在权限、签名和限流上天然分离。<a class="hl-citation" href="#hl-source-2" aria-label="查看参考来源 2">[2]</a><a class="hl-citation" href="#hl-source-3" aria-label="查看参考来源 3">[3]</a>

## 3. 永续合约如何交易

### 3.1 账户与入金

用户可用 EVM 钱包或邮箱账户登录；典型钱包路径是准备 Arbitrum 上的 USDC 和少量 ETH（用于支付入金的 gas），连接钱包、启用交易并把 USDC 存入 Hyperliquid；官方也支持 BTC、ETH、SOL 等其他链资产入金，但需先在 Hyperliquid 上卖成 USDC、USDT 等对应报价资产。<a class="hl-citation" href="#hl-source-21" aria-label="查看参考来源 21">[21]</a> 入金后的 USDC 用作永续保证金；永续建立的是价格风险敞口，用户可以做多或做空，但不会因此持有对应的现货代币。<a class="hl-citation" href="#hl-source-16" aria-label="查看参考来源 16">[16]</a><a class="hl-citation" href="#hl-source-21" aria-label="查看参考来源 21">[21]</a>

### 3.2 合约、保证金与杠杆

Hyperliquid 永续没有到期交割，依靠资金费率促使永续价格向标的现货价格靠拢；标准合约为线性永续，1 份合约对应 1 单位现货标的。<a class="hl-citation" href="#hl-source-16" aria-label="查看参考来源 16">[16]</a> 主流合约用 USDC 作保证金，但 oracle price 以 USDT 计价且不做 USDC/USDT 汇率换算，因此产品、账务和风控系统需要分别记录“保证金资产、计价资产、盈亏结算资产”。<a class="hl-citation" href="#hl-source-16" aria-label="查看参考来源 16">[16]</a>

用户可在 1 倍至该资产最大杠杆之间设置整数杠杆；开仓所需初始保证金为 `position_size × mark_price / leverage`。<a class="hl-citation" href="#hl-source-12" aria-label="查看参考来源 12">[12]</a> 默认的全仓模式在所有全仓仓位之间共享保证金，全仓仓位的未实现盈亏可直接用作新仓的初始保证金；逐仓只把指定保证金分配给单一仓位，其强平风险与其他仓位隔离。<a class="hl-citation" href="#hl-source-12" aria-label="查看参考来源 12">[12]</a>

### 3.3 下单与订单生命周期

交易流程是选择代币、选择做多或做空、输入仓位规模（杠杆 × 保证金）后提交订单。<a class="hl-citation" href="#hl-source-21" aria-label="查看参考来源 21">[21]</a> 订单类型包括市价单（market）、限价单（limit）、追价单（chase）、止损单（stop market/limit）、止盈单（take market/limit）、区间分批限价单（scale）与 TWAP；订单选项包括止盈（take profit）、止损（stop loss）、只减仓（reduce-only）、GTC、只挂单（ALO，即 post-only）与 IOC。<a class="hl-citation" href="#hl-source-15" aria-label="查看参考来源 15">[15]</a>

TWAP 按总数量与运行时长（5 分钟至 7 天，总额不低于 100 美元）计算固定间隔发送子单，间隔最短 30 秒，单个子单最大滑点 3%；未充分成交时，后续子单会尝试追赶执行目标，但追赶子单不超过常规子单的 3 倍，最终仍可能无法完成总量。<a class="hl-citation" href="#hl-source-15" aria-label="查看参考来源 15">[15]</a> API 下单以资产编号而非展示名称为核心字段，支持客户端订单 ID（cloid）；同时提供按订单 ID/cloid 撤单、批量改单、杠杆更新、逐仓保证金调整和定时全撤等能力。<a class="hl-citation" href="#hl-source-3" aria-label="查看参考来源 3">[3]</a>

### 3.4 资金费率

资金费率是多空双方之间的点对点支付，协议不从中收取费用；正费率时多头付给空头，负费率时空头付给多头。<a class="hl-citation" href="#hl-source-13" aria-label="查看参考来源 13">[13]</a> Hyperliquid 每小时结算一次，支付额为 `position_size × oracle_price × funding_rate`，这里明确使用 <strong>oracle price，而不是 mark price</strong>。<a class="hl-citation" href="#hl-source-13" aria-label="查看参考来源 13">[13]</a>

资金费率由溢价（premium，永续价格相对 oracle price 的偏离）与固定利率项共同决定；官方公式先计算 8 小时费率，再每小时按八分之一结算，溢价每 5 秒采样一次并按小时平均，利率项固定为每 8 小时 0.01%，费率上限为每小时 4%。<a class="hl-citation" href="#hl-source-13" aria-label="查看参考来源 13">[13]</a> 因此产品展示需要明确“当前小时费率、历史实际结算、下一次结算时间与方向”，不能只展示年化数字。<a class="hl-citation" href="#hl-source-13" aria-label="查看参考来源 13">[13]</a>

### 3.5 风控、mark price 与强平

oracle price 用于计算资金费率，它是多家中心化交易所现货价格的加权中位数。<a class="hl-citation" href="#hl-source-22" aria-label="查看参考来源 22">[22]</a> mark price 取三个输入的中位数：oracle price 加上 Hyperliquid 中间价与 oracle price 之差的 150 秒 EMA；本地最佳买价、最佳卖价与最新成交价的中位数；Binance、OKX、Bybit、Gate、MEXC 永续中间价的加权中位数（权重 3/2/2/1/1）。<a class="hl-citation" href="#hl-source-22" aria-label="查看参考来源 22">[22]</a> mark price 用于保证金、强平、TP/SL 触发和未实现盈亏；成交价只决定实际成交，三种价格在行情和仓位界面上应分开展示。<a class="hl-citation" href="#hl-source-22" aria-label="查看参考来源 22">[22]</a>

当账户权益低于维持保证金时触发强平；维持保证金为该资产最大杠杆对应初始保证金的一半，最大杠杆 3–40 倍对应约 1.25%–16.7%。<a class="hl-citation" href="#hl-source-12" aria-label="查看参考来源 12">[12]</a><a class="hl-citation" href="#hl-source-14" aria-label="查看参考来源 14">[14]</a> 系统先向订单簿发送市价强平单，若成交后重新满足维持保证金要求，剩余保证金仍归用户；若权益跌到维持保证金的 2/3 以下且订单簿强平未成功，则由 liquidator vault 执行兜底强平（backstop liquidation），此时维持保证金不退还用户。<a class="hl-citation" href="#hl-source-14" aria-label="查看参考来源 14">[14]</a>

价值超过 100,000 USDC 的可强平仓位，先只把 20% 作为市价强平单发往订单簿；该用户任一仓位被部分强平后进入 30 秒冷却期，冷却期内该用户的市价强平单都针对全部仓位。<a class="hl-citation" href="#hl-source-14" aria-label="查看参考来源 14">[14]</a> 强平以 mark price 判断而非瞬时盘口价，但实际平仓仍受订单簿深度、跳价和滑点影响。<a class="hl-citation" href="#hl-source-14" aria-label="查看参考来源 14">[14]</a>

## 4. 现货如何交易

### 4.1 HIP-1：原生代币与现货订单簿

HIP-1 是有供应上限的同质化原生代币标准，并为代币对提供链上现货订单簿；代币元数据包含 `weiDecimals`、`szDecimals`、最大供应量和初始余额等字段。<a class="hl-citation" href="#hl-source-24" aria-label="查看参考来源 24">[24]</a> 每个 HIP-1 代币创建时会得到一本以 Spot USDC 为报价资产的原生现货订单簿；成交后买方获得基础资产余额、卖方获得报价资产余额，这与永续只产生仓位和盈亏不同。<a class="hl-citation" href="#hl-source-24" aria-label="查看参考来源 24">[24]</a>

HIP-1 把 USDC 也表示为现货代币，并支持永续账户与现货账户之间的 USDC 原子转移。<a class="hl-citation" href="#hl-source-24" aria-label="查看参考来源 24">[24]</a> 现货持仓由 spot clearinghouse 记录为每个地址的代币余额与冻结额度；只有开启 Portfolio Margin 并发生自动借款时，才涉及 LTV、借款利息和组合强平，普通现货持仓不是杠杆仓位。<a class="hl-citation" href="#hl-source-23" aria-label="查看参考来源 23">[23]</a><a class="hl-citation" href="#hl-source-26" aria-label="查看参考来源 26">[26]</a>

### 4.2 HIP-2：Hyperliquidity

HIP-2 Hyperliquidity 是写入区块状态转换逻辑的去中心化做市策略，不依赖外部运营方；目前只适用于以 USDC 报价的现货交易对。<a class="hl-citation" href="#hl-source-25" aria-label="查看参考来源 25">[25]</a> 策略在预设价格区间内挂单，距上次更新至少 3 秒后随新区块刷新报价，与普通用户和做市商共用同一本 CLOB，而不是一个独立的 AMM 资金池。<a class="hl-citation" href="#hl-source-25" aria-label="查看参考来源 25">[25]</a>

它的作用是为刚上线、尚无成交的 HIP-1 资产提供初始挂单深度（即“冷启动”）：协议策略提供基础报价，流动性提供者（LP）可以随需求加入并改善价格发现。<a class="hl-citation" href="#hl-source-25" aria-label="查看参考来源 25">[25]</a> 从交易所设计角度，这类机制适合作为“新币上线的可选流动性模块”，但不能替代真实订单簿深度、做市商准入和异常行情熔断。

### 4.3 交易费与 API 表示

现货与永续分别有费率表，但二者成交量合并决定费率等级，现货成交量按 2 倍计入 14 日滚动成交量；质押折扣（staking discount）、maker 返佣（maker rebate）以及 HIP-3 永续的 growth mode 会进一步影响实际费率。<a class="hl-citation" href="#hl-source-11" aria-label="查看参考来源 11">[11]</a> 因此前端不应只显示静态基础费率，而应展示用户实际的 maker/taker 费率、优惠来源和收费资产。<a class="hl-citation" href="#hl-source-11" aria-label="查看参考来源 11">[11]</a>

行情 API 中，永续的 `coin` 字段使用 `meta.universe` 返回的名称；现货除 PURR/USDC 外，统一使用 `@{spotMeta.universe 序号}`，且 UI 展示名称可能与链上名称不同（官方示例：前端的 BTC/USDC 实为 HyperCore 上的 UBTC/USDC）。<a class="hl-citation" href="#hl-source-2" aria-label="查看参考来源 2">[2]</a> 交易 API 中，永续的 `asset` 是 `meta.universe` 序号，现货的 `asset` 是 `10000 + spotMeta.universe 序号`。<a class="hl-citation" href="#hl-source-3" aria-label="查看参考来源 3">[3]</a> 因此接入方需要维护不可变的内部交易品种编号，并把展示名称、基础资产、报价资产、市场类型与各 API 编号分开管理。

## 5. 永续 + 现货如何用于对冲

以下是风险管理与产品机制示例，不代表收益承诺或投资建议。各策略名称是否为标准术语，见第 10 节术语表“类别”一栏。

### 5.1 Delta 对冲（delta hedging）

持有 1 BTC 现货并做空约 1 BTC 永续，可以把组合的 delta 降到接近零，即 delta 中性：现货下跌的损失大体由永续空头盈利抵消，现货上涨的收益也会被空头亏损抵消。实际净 delta 会因滑点、资金费率、手续费、数量精度和价格源差异而偏离零。<a class="hl-citation" href="#hl-source-13" aria-label="查看参考来源 13">[13]</a><a class="hl-citation" href="#hl-source-18" aria-label="查看参考来源 18">[18]</a>

产品上应提供“现货数量—永续合约数量—净 delta”的统一视图，并允许用 reduce-only 订单调整，避免再平衡（调整仓位使对冲比例回到目标值）时误开反向仓位。<a class="hl-citation" href="#hl-source-15" aria-label="查看参考来源 15">[15]</a><a class="hl-citation" href="#hl-source-16" aria-label="查看参考来源 16">[16]</a> 普通账户下两条腿仍是独立的余额和仓位；方向相反并不意味着风控系统会让两者的保证金互相抵消。<a class="hl-citation" href="#hl-source-12" aria-label="查看参考来源 12">[12]</a>

### 5.2 期现套利（cash-and-carry / basis trade）

典型做法是买入现货并做空等量永续：价格方向风险大体抵消，收益主要来自基差收敛和空头收到的资金费率，再扣除双边手续费和执行成本。<a class="hl-citation" href="#hl-source-13" aria-label="查看参考来源 13">[13]</a><a class="hl-citation" href="#hl-source-16" aria-label="查看参考来源 16">[16]</a> 当资金费率转负、基差扩大、借贷成本上升或一条腿无法平仓时，组合可能亏损；当前资金费率为正也不代表未来持续盈利。<a class="hl-citation" href="#hl-source-13" aria-label="查看参考来源 13">[13]</a>

收益应拆分为已实现/未实现的基差盈亏、资金费率、借款利息、手续费与滑点，而不是展示一个无法审计的“套利收益率”。资金费率按 oracle price 计费、仓位风险按 mark price 计量，两套价格都要进入收益归因。<a class="hl-citation" href="#hl-source-13" aria-label="查看参考来源 13">[13]</a><a class="hl-citation" href="#hl-source-22" aria-label="查看参考来源 22">[22]</a>

### 5.3 做市商库存风险对冲

做市商在现货被动买入后会积累多头库存，可以在永续上卖出相近 delta 对冲；被动卖出现货后库存转为空头，则可以回补永续空头或建立永续多头。这类库存风险（inventory risk）是做市研究中的经典问题。<a class="hl-citation" href="#hl-source-27" aria-label="查看参考来源 27">[27]</a> CLOB 的 ALO、IOC、GTC 与批量改单能力，可分别用于只挂单保护、快速对冲和持续报价。<a class="hl-citation" href="#hl-source-3" aria-label="查看参考来源 3">[3]</a><a class="hl-citation" href="#hl-source-15" aria-label="查看参考来源 15">[15]</a><a class="hl-citation" href="#hl-source-18" aria-label="查看参考来源 18">[18]</a>

核心风险是执行风险中的“腿部风险”（leg risk）：一条腿已经成交、另一条腿未能按预期成交；此外还有行情延迟、撤单失败、触发限流、保证金不足和资产编号映射错误。对冲系统通常需要客户端订单 ID、幂等重试、由成交回报触发的对冲下单、最大未对冲时间/金额限制，以及定时全撤开关。<a class="hl-citation" href="#hl-source-2" aria-label="查看参考来源 2">[2]</a><a class="hl-citation" href="#hl-source-3" aria-label="查看参考来源 3">[3]</a><a class="hl-citation" href="#hl-source-28" aria-label="查看参考来源 28">[28]</a>

### 5.4 跨交易所对冲（cross-exchange hedging）

可以在 Hyperliquid 建立一条腿，在另一家 DEX 或 CEX 建立反向腿，以获得更深的流动性或分散单一交易场所的库存风险。此时风险从单一价格方向转化为交易所间价差、oracle price 差异、资金划转延迟、API 可用性、资产托管与跨链桥风险，以及两边强平规则不一致。<a class="hl-citation" href="#hl-source-2" aria-label="查看参考来源 2">[2]</a><a class="hl-citation" href="#hl-source-12" aria-label="查看参考来源 12">[12]</a><a class="hl-citation" href="#hl-source-14" aria-label="查看参考来源 14">[14]</a><a class="hl-citation" href="#hl-source-22" aria-label="查看参考来源 22">[22]</a>

跨交易所风控应以两边实际可成交价格而非单一中间价估算平仓成本，并分别监控 mark price、oracle price、订单簿深度、保证金余量和资金费率。自动对冲需要降级路径：降低报价规模、扩大价差、切换备用交易所或停止新增风险，而不是无限追价。

### 5.5 组合保证金下的 carry trade

Portfolio Margin 把合资格现货余额与永续仓位统一计入组合风险。官方给出的 carry trade 示例是“持有现货 + 做空永续，由现货余额作为空头仓位的保证金”：两条腿的盈亏互相抵消，从而降低永续腿被强平的风险。<a class="hl-citation" href="#hl-source-23" aria-label="查看参考来源 23">[23]</a> 下单余额不足时，系统会按抵押资产的 LTV 自动借入资产，借款连续计息、按小时计提；组合账户整体低于组合维持保证金要求时触发清算。<a class="hl-citation" href="#hl-source-23" aria-label="查看参考来源 23">[23]</a>

这与普通现货持仓、普通全仓永续都不同：它引入 LTV、借款/供应上限、利息、组合估值和不确定的清算顺序。<a class="hl-citation" href="#hl-source-23" aria-label="查看参考来源 23">[23]</a> 官方对该模式设有准入要求（主账户加权成交量超过 500 万美元或账户价值超过 1 万美元，且账户价值低于 2500 万美元）及全局/用户供应与借款上限，额度触顶即回退为非组合保证金；组合强平直接由 backstop liquidator 接管，没有订单簿强平阶段。<a class="hl-citation" href="#hl-source-23" aria-label="查看参考来源 23">[23]</a>

## 6. 实测市场快照

本节来自 Hyperliquid 公开 info API 的抓取结果（本目录 `data/live_api_summary.json`），抓取时间 <strong>2026-09-13T12:03:34.946345Z</strong>；数值是该时点的瞬时快照，不代表日均水平。<a class="hl-citation" href="#hl-source-17" aria-label="查看参考来源 17">[17]</a><a class="hl-citation" href="#hl-source-20" aria-label="查看参考来源 20">[20]</a>

- 永续市场数（`perp_count`）：<strong>234</strong>。<a class="hl-citation" href="#hl-source-20" aria-label="查看参考来源 20">[20]</a>
- 现货交易对数（`spot_pair_count`）：<strong>326</strong>。<a class="hl-citation" href="#hl-source-17" aria-label="查看参考来源 17">[17]</a>
- 现货代币数（`spot_token_count`）：<strong>501</strong>。<a class="hl-citation" href="#hl-source-17" aria-label="查看参考来源 17">[17]</a>

按 24 小时名义成交额（`dayNtlVlm`）降序排列的前 5 个永续如下；资金费率为 API 返回的当前小时费率，未平仓量（OI）原值以标的币数量计，“OI（按 mark price 估值）”为本报告按 `openInterest × markPx` 计算的近似美元名义价值，并非 API 字段。<a class="hl-citation" href="#hl-source-20" aria-label="查看参考来源 20">[20]</a>

| 排名 | 永续 | 24h 名义成交额 | 资金费率（小时） | OI（标的币） | mark price | OI（按 mark price 估值） |
|---:|---|---:|---:|---:|---:|---:|
| 1 | BTC | $780,012,367.15 | -0.00001673（-0.001673%） | 36,439.81858 BTC | $76,770.00 | ≈ $2,797,484,872.39 |
| 2 | ETH | $556,141,616.16 | 0.0000113329（0.00113329%） | 974,705.99240 ETH | $2,479.90 | ≈ $2,417,173,390.55 |
| 3 | HYPE | $204,880,228.89 | 0.0000125（0.00125%） | 20,927,636.64000 HYPE | $77.4585 | ≈ $1,621,023,342.68 |
| 4 | ZEC | $194,002,906.86 | 0.0000065066（0.00065066%） | 474,327.62000 ZEC | $1,093.20 | ≈ $518,534,954.18 |
| 5 | SOL | $77,416,019.86 | -0.0000036814（-0.00036814%） | 5,367,955.92000 SOL | $99.795 | ≈ $535,695,161.04 |

正资金费率表示多头向空头支付，负资金费率表示空头向多头支付；该快照只代表抓取时的 API 返回值，不能外推未来费率、成交量或可实现收益。<a class="hl-citation" href="#hl-source-13" aria-label="查看参考来源 13">[13]</a><a class="hl-citation" href="#hl-source-20" aria-label="查看参考来源 20">[20]</a>

## 7. 交易所设计要点

以下为基于上文官方机制整理的通用设计要点，不针对特定项目。

### 7.1 核心机制

1. <strong>统一 CLOB 与订单语义。</strong> 现货和永续共用价格—时间优先、tick size/lot size 约束及 GTC/IOC/ALO 等订单语义，便于前端、撮合、行情与做市 API 共用同一模型；但两类产品的资产交割和风险账本必须分开。<a class="hl-citation" href="#hl-source-15" aria-label="查看参考来源 15">[15]</a><a class="hl-citation" href="#hl-source-18" aria-label="查看参考来源 18">[18]</a>
2. <strong>三种价格分工。</strong> 成交价用于成交记录，oracle price 用于锚定外部标的价格和计算资金费率，mark price 用于保证金、未实现盈亏、TP/SL 和强平；界面上应标明价格来源、更新时间、偏离程度和降级状态。<a class="hl-citation" href="#hl-source-13" aria-label="查看参考来源 13">[13]</a><a class="hl-citation" href="#hl-source-22" aria-label="查看参考来源 22">[22]</a>
3. <strong>保证金检查贯穿订单生命周期。</strong> 下单时检查一次，挂单被动成交时再检查一次，避免 oracle price 或持仓变化后，旧挂单在成交瞬间带来无法承受的风险。<a class="hl-citation" href="#hl-source-19" aria-label="查看参考来源 19">[19]</a>
4. <strong>先全仓/逐仓，后组合保证金。</strong> 全仓/逐仓的保证金边界、可用余额、维持保证金、预估强平价和追加保证金是基础；Portfolio Margin 依赖抵押品估值、LTV、借款利率、额度与组合清算，复杂度高得多。<a class="hl-citation" href="#hl-source-12" aria-label="查看参考来源 12">[12]</a><a class="hl-citation" href="#hl-source-23" aria-label="查看参考来源 23">[23]</a>
5. <strong>资产编号与展示名称分离。</strong> Hyperliquid 的行情 `coin`、交易 `asset` 与 UI 名称各不相同，说明交易品种应以稳定的内部编号为主键，并分别存储市场类型、基础资产、报价资产、结算资产、oracle 标的、展示名称和 API 编号，所有映射都要有版本记录。<a class="hl-citation" href="#hl-source-2" aria-label="查看参考来源 2">[2]</a><a class="hl-citation" href="#hl-source-3" aria-label="查看参考来源 3">[3]</a>
6. <strong>强平分层。</strong> Hyperliquid 采用“订单簿强平 → 大仓位部分强平 → liquidator vault 兜底”的层次；阈值、冷却时间和接管价格与自身流动性强相关，需要结合压力测试确定。<a class="hl-citation" href="#hl-source-14" aria-label="查看参考来源 14">[14]</a>
7. <strong>对冲视图。</strong> 面向做市与资产运营，展示现货库存、永续仓位、净 delta、基差、资金费率、手续费、保证金余量与未对冲时长，并支持 reduce-only 再平衡。<a class="hl-citation" href="#hl-source-13" aria-label="查看参考来源 13">[13]</a><a class="hl-citation" href="#hl-source-15" aria-label="查看参考来源 15">[15]</a>

### 7.2 高复杂度机制

- <strong>Portfolio Margin / 自动借贷：</strong> 涉及抵押品 LTV、借款上限、利率曲线、坏账吸收和清算顺序，Hyperliquid 自身也以准入门槛和额度上限控制风险。<a class="hl-citation" href="#hl-source-23" aria-label="查看参考来源 23">[23]</a>
- <strong>协议级自动流动性：</strong> HIP-2 适合新资产冷启动，但需要明确资金来源、价格区间、库存损失、退出规则与异常停机责任。<a class="hl-citation" href="#hl-source-25" aria-label="查看参考来源 25">[25]</a>
- <strong>复杂费率结构：</strong> 成交量等级、质押折扣、maker 返佣与特定市场优惠能促进增长，但会显著增加账单解释、对账和客服成本。<a class="hl-citation" href="#hl-source-11" aria-label="查看参考来源 11">[11]</a>

## 8. 风险与不确定性

### 8.1 主要风险

1. <strong>市场与杠杆风险：</strong> 永续可以做空和加杠杆，按 mark price 触发的强平可能早于用户按最新成交价预期的位置；高波动、订单簿深度不足和跳价会放大实际损失。<a class="hl-citation" href="#hl-source-12" aria-label="查看参考来源 12">[12]</a><a class="hl-citation" href="#hl-source-14" aria-label="查看参考来源 14">[14]</a><a class="hl-citation" href="#hl-source-22" aria-label="查看参考来源 22">[22]</a>
2. <strong>资金费率与基差风险：</strong> 资金费率的方向和大小会变化，期现套利仍可能因负资金费率、基差扩大、手续费和两条腿之间的滑点而亏损。<a class="hl-citation" href="#hl-source-13" aria-label="查看参考来源 13">[13]</a>
3. <strong>价格源风险：</strong> oracle price 与 mark price 都依赖多源数据与聚合规则；外部交易所停盘、异常报价、资产映射错误或本地订单簿失真都可能影响估值和强平，因此需要价格源准入、离群值过滤、过期检测、熔断和人工降级流程。<a class="hl-citation" href="#hl-source-22" aria-label="查看参考来源 22">[22]</a>
4. <strong>流动性与执行风险：</strong> 市价单、止损单和强平单最终都要与订单簿成交；“触发”不等于按触发价成交，加了限价保护又可能无法成交。<a class="hl-citation" href="#hl-source-14" aria-label="查看参考来源 14">[14]</a><a class="hl-citation" href="#hl-source-15" aria-label="查看参考来源 15">[15]</a>
5. <strong>账户模式误解：</strong> 现货持仓、永续全仓/逐仓和 Portfolio Margin 是三种不同的风险状态；如果界面把“可交易余额、抵押价值、可借额度”混为一谈，用户会高估可提现资金或低估清算风险。<a class="hl-citation" href="#hl-source-12" aria-label="查看参考来源 12">[12]</a><a class="hl-citation" href="#hl-source-23" aria-label="查看参考来源 23">[23]</a><a class="hl-citation" href="#hl-source-24" aria-label="查看参考来源 24">[24]</a>
6. <strong>稳定币与 quanto 风险：</strong> 主流永续以 USDT 计价、以 USDC 作保证金和结算，没有自动汇率换算；USDC/USDT 价格偏离会带来盈亏失真与对账风险，不能把这类合约标注为普通 USDT 保证金合约。<a class="hl-citation" href="#hl-source-16" aria-label="查看参考来源 16">[16]</a>
7. <strong>技术接入风险：</strong> 行情 `coin`、交易 `asset` 与 UI 名称的编码不同，现货还使用 `@序号` 和 `10000 + 序号` 规则；把展示名称硬编码进下单逻辑极易下错单。<a class="hl-citation" href="#hl-source-2" aria-label="查看参考来源 2">[2]</a><a class="hl-citation" href="#hl-source-3" aria-label="查看参考来源 3">[3]</a>
8. <strong>快照局限：</strong> 本报告的实时数据只有一个抓取时点，不能代表持续流动性、历史波动、极端行情表现或长期费率分布。<a class="hl-citation" href="#hl-source-20" aria-label="查看参考来源 20">[20]</a>
9. <strong>文档变化：</strong> 费率、支持资产、最大杠杆、Portfolio Margin 准入门槛与额度、API 规则都会升级；引用前应按版本重新核对官方文档与实际 API 返回。<a class="hl-citation" href="#hl-source-2" aria-label="查看参考来源 2">[2]</a><a class="hl-citation" href="#hl-source-3" aria-label="查看参考来源 3">[3]</a><a class="hl-citation" href="#hl-source-11" aria-label="查看参考来源 11">[11]</a><a class="hl-citation" href="#hl-source-23" aria-label="查看参考来源 23">[23]</a>

### 8.2 历史风险事件与新闻（2024–2026）

以下按时间整理公开报道中与 Hyperliquid 相关的主要风险事件，统计截至 2026-09-14，金额以报道为准。“类型”一栏区分平台机制问题与用户自身安全问题。

<strong>共同规律</strong>：2025–2026 年的多起损失，都是“小市值或流动性很薄的市场 + 强平后由 HLP 接管仓位”被利用——攻击者先制造自己的强平，再把亏损转嫁给 HLP。官方陆续用下调杠杆、下架、在 mark price 中加入外部价格等方式修补。

| 时间 | 类型 | 事件 | 影响 | 一句话原因 | 链接 |
|---|---|---|---|---|---|
| 2024-12-23 | 机制/信任 | 疑似朝鲜黑客地址在平台交易 | 单日提现创纪录，CoinDesk 报道约 6000 万 USDC 净流出；官方称没有被攻击、用户资金无损 | 安全研究员发现与朝鲜黑客关联的地址从 10 月起在平台交易，市场担心对方在试探漏洞，于是集中撤资 | [CoinDesk](https://www.coindesk.com/markets/2024/12/23/hyper-liquid-sees-record-60-m-in-usdc-flee-as-north-korea-said-to-be-probing-perpetuals-exchange) · [Bloomberg](https://www.bloomberg.com/news/articles/2024-12-23/crypto-exchange-s-outflows-swell-on-north-korean-trader-concern) |
| 2025-03-12 | 协议机制 | ETH 50 倍巨鲸“主动被强平” | HLP 亏损约 400 万美元；BTC、ETH 最大杠杆随后下调到 40 倍、25 倍 | 巨鲸约 2 亿美元的 ETH 多单盈利后，提走保证金让仓位跌破维持保证金，被强平后由 HLP 接管，把大额平仓的滑点损失转嫁给了 HLP | [CoinDesk](https://www.coindesk.com/markets/2025/03/12/hyperliquid-loses-usd4m-after-whale-s-over-usd200m-ether-trade-unwinds) · [crypto.news](https://crypto.news/hyperliquid-will-adjust-leverage-limits-for-btc-and-eth-after-the-recent-50x-eth-liquidation-event/) |
| 2025-03-26 | 市场操纵 | JELLYJELLY 操纵 | HLP 一度浮亏约 1200 万美元；验证者投票下架该币，并按 0.0095 美元统一结算，引发“是否足够去中心化”的争议 | 攻击者在一个小市值币上开大额空单，再到外部市场拉高价格，让自己的空单被强平、由 HLP 接手，HLP 因此承担价格继续暴涨的风险 | [CoinDesk](https://www.coindesk.com/markets/2025/03/26/hyperliquid-delists-jellyjelly-after-vault-squeezed-in-usd13m-tussle) · [The Block](https://www.theblock.co/post/348314/hyperliquid-delists-jellyjelly-memecoin-amid-whale-manipulation-fiasco) |
| 2025-07-29 | 系统故障 | API 中断 37 分钟 | 用户无法平仓和交易，官方自动赔付约 199 万美元 | 交易流量激增导致 API 服务中断（官方称不是黑客攻击） | [The Block](https://www.theblock.co/post/364861/hyperliquid-outage-refund) · [The Defiant](https://thedefiant.io/news/defi/hyperliquid-to-refund-users-affected-by-platform-outage) |
| 2025-08-27 | 市场操纵 | XPL 盘前合约几分钟暴涨 200% | 约 1.3 亿美元未平仓量被清，大量空头被强平；官方表示将把外部交易所价格纳入 mark price | XPL 当时还没上线现货，mark price 只能参考 Hyperliquid 自己很薄的盘口，巨鲸用少量资金拉价就能触发空头连环强平 | [CoinDesk](https://www.coindesk.com/markets/2025/08/27/xpl-futures-on-hyperliquid-see-usd130m-wiped-out-ahead-of-the-plasma-token-s-launch) · [Unchained](https://unchainedcrypto.com/xpl-manipulation-nets-hyperliquid-whales-48-million/) |
| 2025-10-10 | 极端行情 | 全市场闪崩，首次触发全仓 ADL | 平台强平约 103 亿美元，12 分钟内 ADL 强制平掉约 21 亿美元仓位，不少盈利仓位和对冲组合被迫减仓 | 暴跌中强平单在订单簿上接不住、HLP 也无法全部承接，系统只能启动 ADL，用盈利方的仓位去抵补亏损方的缺口 | [arXiv 研究](https://arxiv.org/abs/2512.01112) · [AMBCrypto](https://ambcrypto.com/hyperliquid-leads-10b-liquidation-should-regulators-look-into-the-exchanges/) |
| 2025-11-12 | 市场操纵 | POPCAT 操纵 | HLP 产生约 490 万美元坏账 | 攻击者用 19 个钱包开多单，并挂出约 2000 万美元的大额买单把价格抬高，随后撤单让价格崩跌，连环强平超出盘口承接能力，亏损落到 HLP | [CoinDesk](https://www.coindesk.com/markets/2025/11/13/peak-degen-warfare-alleged-popcat-manipulation-hits-hyperliquid-with-usd4-9m-loss) · [Halborn](https://www.halborn.com/blog/post/explained-the-hyperliquid-hack-november-2025) |
| 2026-04-09 | 市场操纵 | FARTCOIN“自杀式”强平 | HLP 亏损约 150 万美元 | 攻击者在流动性低时用 4 个钱包建立约 1500 万美元多单并故意被强平，ADL 把这笔亏损仓位转给 HLP，攻击者疑似在其他交易所对冲获利 | [BeInCrypto](https://beincrypto.com/fartcoin-hyperliquid-manipulation-hlp-loss/) · [ForkLog](https://forklog.com/en/unknown-attackers-exploit-hyperliquid-storage-via-fartcoin-pump/) |
| 2026-07 | 用户端安全 | 交易者私钥被盗 | 单个用户损失约 2100 万美元 | 用户私钥泄露，攻击者直接转走钱包资产；属于用户端安全事件，不是协议漏洞 | [Cointelegraph](https://cointelegraph.com/news/hyperliquid-21m-private-key-exploit-defi-security) |
| 2026-08-24 | 用户端安全 | 假 Google 广告钓鱼 | 单个用户损失约 55 万 USDC | 用户点击仿冒广告进入克隆网站并连接钱包签名，被盗号工具 Inferno Drainer 转走资产 | [KuCoin News](https://www.kucoin.com/news/flash/hyperliquid-user-loses-550-000-usdc-after-fake-google-ad-leads-to-inferno-drainer) |
| 2026-07-30 至 08-28 | 合规/洗钱 | 朝鲜 Lazarus 关联地址通过 Hyperliquid 转移资金 | 关联地址卖出超过 3000 万美元 BTC，引发洗钱担忧 | 链上交易所不需要开户，被制裁的地址也能直接用钱包交易，把盗来的资产兑换和转移出去 | [CoinDesk](https://www.coindesk.com/business/2026/08/31/north-korean-hackers-are-moving-tens-of-millions-on-hyperliquid-as-trump-pushes-to-onshore-the-crypto-platform) · [Crowdfund Insider](https://www.crowdfundinsider.com/2026/09/304504-north-koreas-lazarus-group-routes-millions-via-hyperliquid-arkham-intelligence/) |

## 9. Sources

> 以下来源均可在线访问，已于 2026-09-14 逐条核验正文引用内容。

- <span id="hl-source-1">[1]</span> [Hyperliquid Docs — About Hyperliquid（L1 / HyperCore / HyperEVM 总览）](https://hyperliquid.gitbook.io/hyperliquid-docs)
- <span id="hl-source-2">[2]</span> [Hyperliquid Docs — Info endpoint](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/info-endpoint)
- <span id="hl-source-3">[3]</span> [Hyperliquid Docs — Exchange endpoint](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/exchange-endpoint)
- <span id="hl-source-11">[11]</span> [Hyperliquid Docs — Fees](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/fees)
- <span id="hl-source-12">[12]</span> [Hyperliquid Docs — Margining](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/margining)
- <span id="hl-source-13">[13]</span> [Hyperliquid Docs — Funding](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/funding)
- <span id="hl-source-14">[14]</span> [Hyperliquid Docs — Liquidations](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/liquidations)
- <span id="hl-source-15">[15]</span> [Hyperliquid Docs — Order types](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/order-types)
- <span id="hl-source-16">[16]</span> [Hyperliquid Docs — Contract specifications](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/contract-specifications)
- <span id="hl-source-17">[17]</span> [Hyperliquid Docs — Info endpoint / Spot（spotMeta、spotMetaAndAssetCtxs）](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/info-endpoint/spot)
- <span id="hl-source-18">[18]</span> [Hyperliquid Docs — Order book](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/order-book)
- <span id="hl-source-19">[19]</span> [Hyperliquid Docs — HyperCore / Order book（开单与撮合时双重保证金检查）](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/order-book)
- <span id="hl-source-20">[20]</span> [Hyperliquid Docs — Info endpoint / Perpetuals（metaAndAssetCtxs）](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/info-endpoint/perpetuals)；快照抓取接口 `POST https://api.hyperliquid.xyz/info`
- <span id="hl-source-21">[21]</span> [Hyperliquid Docs — How to start trading](https://hyperliquid.gitbook.io/hyperliquid-docs/onboarding/how-to-start-trading)
- <span id="hl-source-22">[22]</span> [Hyperliquid Docs — Robust price indices](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/robust-price-indices)
- <span id="hl-source-23">[23]</span> [Hyperliquid Docs — Portfolio margin](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/portfolio-margin)
- <span id="hl-source-24">[24]</span> [Hyperliquid Docs — HIP-1: Native token standard](https://hyperliquid.gitbook.io/hyperliquid-docs/hyperliquid-improvement-proposals-hips/hip-1-native-token-standard)
- <span id="hl-source-25">[25]</span> [Hyperliquid Docs — HIP-2: Hyperliquidity](https://hyperliquid.gitbook.io/hyperliquid-docs/hyperliquid-improvement-proposals-hips/hip-2-hyperliquidity)
- <span id="hl-source-26">[26]</span> [Hyperliquid Docs — HyperCore / Clearinghouse](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/clearinghouse)
- <span id="hl-source-27">[27]</span> [Avellaneda & Stoikov (2008), High-frequency trading in a limit order book（做市商库存风险模型）](https://math.nyu.edu/inmemoriam/avellaneda//HighFrequencyTrading.pdf)
- <span id="hl-source-28">[28]</span> [Wikipedia — Arbitrage § Execution risk](https://en.wikipedia.org/wiki/Arbitrage#Execution_risk)
- <span id="hl-source-29">[29]</span> [Hyperliquid Docs — HyperCore / USDC（原生 USDC 与跨链入金）](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/usdc)
- <span id="hl-source-30">[30]</span> [Wikipedia — Cryptocurrency exchange（中心化交易所）](https://en.wikipedia.org/wiki/Cryptocurrency_exchange)
- <span id="hl-source-31">[31]</span> [ethereum.org Glossary — Decentralized exchange (DEX)](https://ethereum.org/en/glossary/#dex)

## 10. 术语表

> 本节由 `glossary.json` 生成（`python3 scripts/build_html.py`），请修改 JSON 后重新生成。

| 术语 | 类别 | 解释 | 来源 |
|---|---|---|---|
| HyperCore | Hyperliquid 专有名词 | Hyperliquid L1 的交易执行层，包含全链上永续与现货订单簿，下单、撤单、成交与强平都在链上完成。 | [Hyperliquid Docs — About Hyperliquid](https://hyperliquid.gitbook.io/hyperliquid-docs) |
| HyperEVM | Hyperliquid 专有名词 | Hyperliquid 链上兼容以太坊虚拟机（EVM）的通用智能合约环境，可调用 HyperCore 的流动性。 | [Hyperliquid Docs — HyperEVM](https://hyperliquid.gitbook.io/hyperliquid-docs/hyperevm) |
| HyperBFT | Hyperliquid 专有名词 | Hyperliquid 的共识算法，是 HotStuff 共识的变体；验证者按质押的原生代币比例出块。 | [Hyperliquid Docs — HyperCore Overview](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/overview) |
| HIP-1 | Hyperliquid 专有名词 | Hyperliquid 原生同质化代币标准，供应量有上限；每个代币创建时自动获得一本以 USDC 报价的现货订单簿。 | [Hyperliquid Docs — HIP-1](https://hyperliquid.gitbook.io/hyperliquid-docs/hyperliquid-improvement-proposals-hips/hip-1-native-token-standard) |
| HIP-2（Hyperliquidity） | Hyperliquid 专有名词 | 写入区块状态转换逻辑的协议级做市策略，在价格区间内自动挂单，为新代币的 USDC 现货对提供初始流动性。 | [Hyperliquid Docs — HIP-2](https://hyperliquid.gitbook.io/hyperliquid-docs/hyperliquid-improvement-proposals-hips/hip-2-hyperliquidity) |
| HIP-3 | Hyperliquid 专有名词 | 由第三方构建者部署永续合约市场的标准。 | [Hyperliquid Docs — HIP-3](https://hyperliquid.gitbook.io/hyperliquid-docs/hyperliquid-improvement-proposals-hips/hip-3-builder-deployed-perpetuals) |
| growth mode | Hyperliquid 专有名词 | HIP-3 永续可开启的增长模式；开启后协议费、返佣、成交量贡献与限流贡献降低 90%。 | [Hyperliquid Docs — Fees](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/fees) |
| liquidator vault（兜底强平） | Hyperliquid 专有名词 | 账户权益低于维持保证金的 2/3 且订单簿强平未成功时，由该金库接管仓位；此时维持保证金不退还用户。 | [Hyperliquid Docs — Liquidations](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/liquidations) |
| HLP（Hyperliquidity Provider） | Hyperliquid 专有名词 | Hyperliquid 社区出资的协议金库，负责做市和承接强平仓位（liquidator vault 是其组成策略）；市场被操纵或强平接不住时，亏损会落到这里。 | [Hyperliquid Docs — Protocol vaults](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/vaults/protocol-vaults) |
| ADL（自动减仓） | 加密行业术语 | Auto-Deleveraging：强平单和保险金库都承接不了亏损时，交易所强制平掉部分盈利方的仓位来抵补缺口。 | [arXiv — Autodeleveraging: Impossibilities and Optimization](https://arxiv.org/abs/2512.01112) |
| Portfolio Margin（组合保证金） | 通用金融术语 | 把多个仓位作为一个组合评估、考虑仓位之间风险抵消来设定保证金的方法（CFTC 术语表收录）。Hyperliquid 版本把全仓永续仓位与现货余额合并计算。 | [CFTC Glossary — Portfolio Margining](https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/CFTCGlossary/index.htm#portfoliomargining) |
| spot clearinghouse | Hyperliquid 专有名词 | HyperCore 中记录每个地址现货状态（代币余额与冻结额度）的模块。 | [Hyperliquid Docs — Clearinghouse](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/clearinghouse) |
| 质押折扣（staking discount） | Hyperliquid 专有名词 | 按质押的 HYPE 数量给予的手续费折扣，官方费率表为 5%–40%。 | [Hyperliquid Docs — Fees](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/fees) |
| maker 返佣（maker rebate） | 加密行业术语 | 达到挂单成交量门槛的用户，其挂单成交时交易所返还一部分费用；Hyperliquid 逐笔直接支付到交易钱包。 | [Hyperliquid Docs — Fees](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/fees) |
| maker / taker | 通用金融术语 | maker 指挂单、被动成交、为订单簿提供流动性的一方；taker 指主动吃单、立即成交的一方。交易所通常对两者收取不同费率。 | [Hyperliquid Docs — Fees](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/fees) |
| 订单簿（order book） | 通用金融术语 | 按价格排列的买卖限价挂单列表；“盘口”通常指最优买卖价附近的挂单。 | [Wikipedia — Order book](https://en.wikipedia.org/wiki/Order_book) |
| CLOB（中央限价订单簿） | 通用金融术语 | Central Limit Order Book：覆盖整个市场、接受限价单的单一订单簿，通常按价格优先、时间优先撮合。美国 CFTC 官方术语表收录，不是自创词。 | [CFTC Glossary — Central Limit Order Book](https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/CFTCGlossary/index.htm#centrallimitorderbook) |
| 价格—时间优先 | 通用金融术语 | 撮合规则：价格更优的订单先成交；价格相同时，先提交的订单先成交。 | [Wikipedia — Order matching system](https://en.wikipedia.org/wiki/Order_matching_system) |
| 撮合 | 通用金融术语 | 交易所按规则把买单与卖单配对成交的过程，由撮合引擎完成。 | [Wikipedia — Order matching system](https://en.wikipedia.org/wiki/Order_matching_system) |
| tick size | 通用金融术语 | 价格的最小变动单位；订单价格必须是它的整数倍。 | [CFTC Glossary — Tick](https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/CFTCGlossary/index.htm#tick) |
| lot size | 通用金融术语 | 数量的最小单位；在 Hyperliquid，订单数量必须是 lot size 的整数倍。 | [Hyperliquid Docs — Order book](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/order-book) |
| 市价单（market） | 通用金融术语 | 按当前市场价格立即成交的订单。 | [Hyperliquid Docs — Order types](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/order-types) |
| 限价单（limit） | 通用金融术语 | 只在指定价格或更优价格成交的订单。 | [CFTC Glossary — Limit Order](https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/CFTCGlossary/index.htm#limitorder) |
| 追价单（chase） | Hyperliquid 专有名词 | 只挂单（ALO）的限价单，会自动改价跟随最优买/卖价，直到成交或终止；中文为本文译名。 | [Hyperliquid Docs — Order types](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/order-types) |
| 止损单（stop market / stop limit） | 通用金融术语 | 价格到达触发价时才激活的市价单或限价单，常用于限制亏损。 | [Hyperliquid Docs — Order types](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/order-types) |
| 止盈单（take market / take limit） | 通用金融术语 | 价格到达触发价时激活的市价单或限价单，触发方向与止损单相反，常用于锁定盈利。 | [Hyperliquid Docs — Order types](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/order-types) |
| 区间分批限价单（scale） | Hyperliquid 专有名词 | 在设定价格区间内一次挂出多笔限价单；中文为本文译名。 | [Hyperliquid Docs — Order types](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/order-types) |
| 触发价 | 通用金融术语 | 条件单被激活的价格；触发后按市价或限价下单，不保证按触发价成交。 | [Hyperliquid Docs — Order types](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/order-types) |
| TWAP | 通用金融术语 | Time-Weighted Average Price，时间加权平均价格；执行上指把大单拆成小单、在一段时间内分批下单以减少冲击。 | [Wikipedia — Time-weighted average price](https://en.wikipedia.org/wiki/Time-weighted_average_price) |
| 只减仓（reduce-only） | 通用金融术语 | 只能减少现有仓位、不会反向开新仓的订单选项。 | [Hyperliquid Docs — Order types](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/order-types) |
| GTC | 通用金融术语 | Good Till Canceled：一直有效，直到成交或被用户撤销。 | [CFTC Glossary — Good Till Canceled Order](https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/CFTCGlossary/index.htm#goodtillcanceled) |
| ALO（post-only，只挂单） | 通用金融术语 | Add Liquidity Only：只作为挂单进入订单簿，不会立即吃单成交。 | [Hyperliquid Docs — Order types](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/order-types) |
| IOC | 通用金融术语 | Immediate or Cancel：立即成交能成交的部分，未成交部分立刻撤销。 | [Hyperliquid Docs — Order types](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/order-types) |
| TP/SL（止盈止损） | 通用金融术语 | Take Profit / Stop Loss：仓位达到设定盈利或亏损价格时自动平仓；Hyperliquid 用 mark price 触发。 | [Hyperliquid Docs — TP/SL orders](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/take-profit-and-stop-loss-orders-tp-sl) |
| cloid（客户端订单 ID） | 通用金融术语 | 由下单方自己生成的订单编号，可用于撤单和去重，避免网络重试造成重复下单。 | [Hyperliquid Docs — Exchange endpoint](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/exchange-endpoint) |
| 定时全撤 | 通用金融术语 | 预先设定一个时间点自动撤销全部挂单（dead man's switch），防止程序失联后挂单暴露在市场中。 | [Hyperliquid Docs — Exchange endpoint](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/exchange-endpoint) |
| oracle（预言机） | 区块链/技术术语 | 把链外数据（如交易所价格）提供给区块链使用的机制。 | [ethereum.org Glossary — Oracle](https://ethereum.org/en/glossary/#oracle) |
| oracle price | 加密行业术语 | Hyperliquid 取多家中心化交易所现货价格的加权中位数，由验证者约每 3 秒发布；用于计算资金费率，不依赖 Hyperliquid 自身行情。 | [Hyperliquid Docs — Robust price indices](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/robust-price-indices) |
| mark price（标记价格） | 加密行业术语 | 交易所计算的稳健“公允价格”，用于保证金、强平、TP/SL 触发与未实现盈亏；不等于最新成交价，可防止短时间操纵盘口触发强平。 | [Hyperliquid Docs — Robust price indices](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/robust-price-indices) |
| 中间价 | 通用金融术语 | 最佳买价与最佳卖价的平均值。 | [Wikipedia — Mid price](https://en.wikipedia.org/wiki/Mid_price) |
| EMA | 通用金融术语 | Exponential Moving Average，指数移动平均：越新的数据权重越高的平均值。 | [Wikipedia — Moving average § EMA](https://en.wikipedia.org/wiki/Moving_average#Exponential_moving_average) |
| 加权中位数 | 通用金融术语 | 给每个数据设定权重后取中位数，权重高的数据影响更大，对单个异常值不敏感。 | [Wikipedia — Weighted median](https://en.wikipedia.org/wiki/Weighted_median) |
| 溢价（premium） | 加密行业术语 | 永续价格相对 oracle price 的偏离程度，是 Hyperliquid 计算资金费率的主要输入。 | [Hyperliquid Docs — Funding](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/funding) |
| 资金费率（funding rate） | 加密行业术语 | 永续合约多空双方之间定期互付的费用，用来让永续价格贴近现货价格；正费率多头付空头，负费率空头付多头。 | [Hyperliquid Docs — Funding](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/funding) |
| 永续合约（perpetual futures） | 加密行业术语 | 没有到期日的期货类合约，通过定期支付资金费率让合约价格贴近标的价格。 | [Wikipedia — Perpetual futures](https://en.wikipedia.org/wiki/Perpetual_futures) |
| 到期交割 | 通用金融术语 | 传统期货在约定到期日按合约结算或交收标的资产；永续合约没有这一步。 | [Wikipedia — Futures contract](https://en.wikipedia.org/wiki/Futures_contract) |
| 线性永续 | 加密行业术语 | 盈亏与标的价格变动成正比、以计价资产计算盈亏的合约；Hyperliquid 中 1 份合约对应 1 单位标的。 | [Hyperliquid Docs — Contract specifications](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/contract-specifications) |
| quanto | 通用金融术语 | 标的以一种货币计价、合约却以另一种货币按固定比例结算的衍生品。Hyperliquid 主流永续以 USDT 计价、以 USDC 按 1:1 结算、不换汇率：按 USDT 算出盈利 1,000，就直接记 1,000 USDC。 | [Wikipedia — Quanto](https://en.wikipedia.org/wiki/Quanto) |
| 标的 | 通用金融术语 | 衍生品价格所依据的资产，例如 BTC 永续的标的是 BTC。 | [Wikipedia — Underlying](https://en.wikipedia.org/wiki/Underlying) |
| 现货（spot） | 通用金融术语 | 买卖后立即交收真实资产的交易，区别于只产生仓位和盈亏的合约交易。 | [Wikipedia — Spot market](https://en.wikipedia.org/wiki/Spot_market) |
| 保证金 | 通用金融术语 | 开立和维持杠杆仓位时需要存入的抵押资金。 | [Wikipedia — Margin (finance)](https://en.wikipedia.org/wiki/Margin_%28finance%29) |
| 初始保证金 | 通用金融术语 | 开仓时需要的最低保证金；Hyperliquid 公式为 仓位数量 × mark price ÷ 杠杆。 | [Hyperliquid Docs — Margining](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/margining) |
| 维持保证金 | 通用金融术语 | 仓位继续持有所需的最低保证金，低于它就触发强平；Hyperliquid 为最大杠杆对应初始保证金的一半（约 1.25%–16.7%）。 | [Hyperliquid Docs — Liquidations](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/liquidations) |
| 追加保证金 | 通用金融术语 | 保证金不足时补充资金，以避免仓位被强平。 | [Wikipedia — Margin (finance)](https://en.wikipedia.org/wiki/Margin_%28finance%29) |
| 账户权益 | 通用金融术语 | 账户价值，即保证金余额加上未实现盈亏；与维持保证金比较以判断是否强平。 | [Hyperliquid Docs — Liquidations](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/liquidations) |
| 全仓（cross margin） | 通用金融术语 | 所有全仓仓位共享同一份保证金，资金利用率高，但一个仓位亏损会影响其他仓位。 | [Hyperliquid Docs — Margining](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/margining) |
| 逐仓（isolated margin） | 通用金融术语 | 给单个仓位分配独立保证金，该仓位强平不影响其他仓位。 | [Hyperliquid Docs — Margining](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/margining) |
| 杠杆 | 通用金融术语 | 用较少保证金控制较大仓位，盈亏按仓位规模放大。 | [Wikipedia — Leverage (finance)](https://en.wikipedia.org/wiki/Leverage_%28finance%29) |
| 强平（强制平仓） | 通用金融术语 | 账户权益低于维持保证金时，系统强制平掉仓位以防亏损超过保证金。 | [Hyperliquid Docs — Liquidations](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/liquidations) |
| 强平价 | 通用金融术语 | mark price 到达该价格时仓位会被强平。 | [Hyperliquid Docs — Liquidations](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/liquidations) |
| 未实现盈亏 | 通用金融术语 | 仓位尚未平仓时，按当前价格（Hyperliquid 用 mark price）计算的浮动盈亏。 | [Hyperliquid Docs — Robust price indices](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/robust-price-indices) |
| 盈亏（PnL） | 通用金融术语 | Profit and Loss，交易赚或赔的金额。 | [Wikipedia — Profit (accounting)](https://en.wikipedia.org/wiki/Profit_%28accounting%29) |
| 做多 / 做空 | 通用金融术语 | 做多是买入、价格上涨获利；做空是卖出、价格下跌获利。持有做多仓位的一方叫多头，做空的一方叫空头。 | [Wikipedia — Position (finance)](https://en.wikipedia.org/wiki/Position_%28finance%29) |
| 风险敞口 | 通用金融术语 | 价格变动时会产生盈亏的持仓规模与方向。例：持有 1 BTC 现货就有 1 BTC 多头敞口；再做空 1 BTC 永续，净敞口接近 0。 | [Wikipedia — Market risk § Market exposure](https://en.wikipedia.org/wiki/Market_risk#Market_exposure) |
| 名义价值 | 通用金融术语 | 合约对应标的的总价值（数量 × 价格），不是实际投入的保证金。 | [Wikipedia — Notional amount](https://en.wikipedia.org/wiki/Notional_amount) |
| 未平仓量（OI） | 通用金融术语 | Open Interest：市场上尚未平仓的合约总数量。 | [Wikipedia — Open interest](https://en.wikipedia.org/wiki/Open_interest) |
| 基础资产 / 报价资产 | 通用金融术语 | 交易对 BTC/USDC 中，BTC 是基础资产（被买卖的资产），USDC 是报价资产（用来标价和支付的资产）。 | [Wikipedia — Currency pair](https://en.wikipedia.org/wiki/Currency_pair#Base_currency) |
| delta | 通用金融术语 | 组合价值对标的价格变动的敏感度；现货和线性永续的 delta 约等于持仓数量（做空为负）。 | [Wikipedia — Greeks (finance)](https://en.wikipedia.org/wiki/Greeks_%28finance%29#Delta) |
| delta 对冲（delta hedging） | 通用金融术语 | 建立反向仓位，让组合 delta 接近零（delta 中性），使组合价值基本不随标的价格变动。衍生品教材标准术语。 | [Wikipedia — Delta neutral](https://en.wikipedia.org/wiki/Delta_neutral) |
| 期现套利（cash-and-carry / basis trade） | 通用金融术语 | 买入现货、同时卖出对应期货或永续，赚取两者价差收敛（及资金费率）的交易；也称基差交易。标准术语。 | [Wikipedia — Basis trading](https://en.wikipedia.org/wiki/Basis_trading) |
| 基差 | 通用金融术语 | 现货价格与期货（或永续）价格之差。 | [CFTC Glossary — Basis](https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/CFTCGlossary/index.htm#basis) |
| 基差收敛 | 通用金融术语 | 现货与期货价格随时间相互靠拢、价差缩小的过程（CFTC 称 convergence）。 | [CFTC Glossary — Convergence](https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/CFTCGlossary/index.htm#convergence) |
| carry trade | 通用金融术语 | 借入持有成本低的资产、持有收益高的资产以赚取差额的交易（CFTC 定义）。Hyperliquid 文档用它指“持有现货 + 做空永续”赚取资金费率的组合。 | [CFTC Glossary — Carry Trade](https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/CFTCGlossary/index.htm#carrytrade) |
| 套利 | 通用金融术语 | 同时买入和卖出相同或等价的资产，利用价差获利。 | [CFTC Glossary — Arbitrage](https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/CFTCGlossary/index.htm#arbitrage) |
| 对冲 | 通用金融术语 | 建立与现有持仓风险方向相反的仓位，以降低价格变动带来的损失。 | [Wikipedia — Hedge (finance)](https://en.wikipedia.org/wiki/Hedge_%28finance%29) |
| 跨交易所对冲（cross-exchange hedging） | 描述性说法（非标准术语） | 在两个交易场所分别建立方向相反的仓位进行对冲。该组合词是描述性说法，不是标准术语；其中“交易场所（trading venue）”是欧盟 MiFID II 法定术语。 | [ESMA — MiFID II Article 4 Definitions](https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mifid-ii/article-4-definitions) |
| 交易场所（trading venue） | 通用金融术语 | MiFID II 定义为受监管市场、多边交易设施（MTF）或有组织交易设施（OTF）；泛指可以撮合交易的场所。 | [ESMA — MiFID II Article 4 Definitions](https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mifid-ii/article-4-definitions) |
| 做市商（market maker） | 通用金融术语 | 持续同时报出买价和卖价、为市场提供流动性的交易者。 | [CFTC Glossary — Market Maker](https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/CFTCGlossary/index.htm#marketmaker) |
| 库存风险（inventory risk） | 学术术语 | 做市商因被动成交而积累单边持仓，承受价格变动损失的风险；做市研究中的经典问题。 | [Avellaneda & Stoikov (2008), High-frequency trading in a limit order book](https://math.nyu.edu/inmemoriam/avellaneda//HighFrequencyTrading.pdf) |
| 腿部风险（leg risk） | 行业俗称（非标准术语） | “腿”（leg）指组合交易里的单笔交易。腿部风险指一条腿已成交、另一条腿没能按预期价格成交；Wikipedia 将其归入套利的执行风险（execution risk）。 | [Wikipedia — Arbitrage § Execution risk](https://en.wikipedia.org/wiki/Arbitrage#Execution_risk) |
| 滑点 | 通用金融术语 | 预期成交价与实际成交价之间的差距，常见于市价单和流动性不足时。 | [Wikipedia — Slippage (finance)](https://en.wikipedia.org/wiki/Slippage_%28finance%29) |
| 跳价 | 通用金融术语 | 价格跳过中间价位直接到达新价位，中间没有成交（价格缺口）。 | [Wikipedia — Gap (chart pattern)](https://en.wikipedia.org/wiki/Gap_%28chart_pattern%29) |
| 价差 | 通用金融术语 | 两个价格之间的差，最常见的是最优卖价与最优买价之差（买卖价差）。 | [CFTC Glossary — Bid-Ask Spread](https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/CFTCGlossary/index.htm#bidaskspread) |
| 订单簿深度 | 通用金融术语 | 各价位上挂单数量的多少；深度越大，大单成交对价格的冲击越小。 | [Wikipedia — Market depth](https://en.wikipedia.org/wiki/Market_depth) |
| 流动性 | 通用金融术语 | 资产能以接近市价快速买卖的程度。 | [Wikipedia — Market liquidity](https://en.wikipedia.org/wiki/Market_liquidity) |
| 流动性提供者（LP） | 通用金融术语 | Liquidity Provider：向市场持续挂单或注入资金、提供流动性的参与者，与做市商含义接近。 | [Wikipedia — Market maker](https://en.wikipedia.org/wiki/Market_maker) |
| 价格发现 | 通用金融术语 | 买卖双方通过交易互动形成市场价格的过程。 | [CFTC Glossary — Price Discovery](https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/CFTCGlossary/index.htm#pricediscovery) |
| 熔断 | 通用金融术语 | 价格剧烈波动时交易所暂停或限制交易的机制（circuit breaker / trading curb）。 | [Wikipedia — Trading curb](https://en.wikipedia.org/wiki/Trading_curb) |
| 压力测试 | 通用金融术语 | 模拟极端行情，检验系统或组合能否承受损失。 | [Wikipedia — Stress test (financial)](https://en.wikipedia.org/wiki/Stress_test_%28financial%29) |
| 坏账 | 通用金融术语 | 无法收回的欠款；在交易所中指强平后亏损超过保证金、需要由平台或保险机制承担的部分。 | [Wikipedia — Bad debt](https://en.wikipedia.org/wiki/Bad_debt) |
| 离群值 | 区块链/技术术语 | 明显偏离其他数据的异常数值，价格源中需要过滤。 | [Wikipedia — Outlier](https://en.wikipedia.org/wiki/Outlier) |
| LTV | 通用金融术语 | Loan-to-Value，借款额与抵押品价值之比；Hyperliquid 组合保证金中 HYPE 为 0.65、BTC 为 0.5，决定可借额度。 | [Hyperliquid Docs — Portfolio margin](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/portfolio-margin) |
| AMM（自动做市商） | 加密行业术语 | Automated Market Maker：按数学公式根据资金池余额自动报价的做市机制，常见于去中心化交易所，与订单簿撮合不同。 | [Wikipedia — Constant function market maker](https://en.wikipedia.org/wiki/Constant_function_market_maker) |
| 中心化交易所（CEX） | 加密行业术语 | 由公司运营、托管用户资产并撮合交易的加密货币交易所，如 Binance、OKX。 | [Wikipedia — Cryptocurrency exchange](https://en.wikipedia.org/wiki/Cryptocurrency_exchange) |
| 去中心化交易所（DEX） | 加密行业术语 | 在区块链上运行、用户自持资产直接交易的交易所。 | [ethereum.org Glossary — DEX](https://ethereum.org/en/glossary/#dex) |
| L1（Layer 1） | 区块链/技术术语 | 自身负责共识与交易结算的主区块链，如以太坊主网。 | [ethereum.org Glossary — Layer 1](https://ethereum.org/en/glossary/#layer-1) |
| 链上 | 区块链/技术术语 | 交易和状态记录在区块链上、可公开验证。 | [Wikipedia — Blockchain](https://en.wikipedia.org/wiki/Blockchain) |
| 共识 | 区块链/技术术语 | 区块链节点就交易顺序与链状态达成一致的机制。 | [ethereum.org Glossary — Consensus](https://ethereum.org/en/glossary/#consensus) |
| 终局性（finality） | 区块链/技术术语 | 交易一旦确认就不能再被更改或回滚的保证。 | [ethereum.org Glossary — Finality](https://ethereum.org/en/glossary/#finality) |
| EVM | 区块链/技术术语 | Ethereum Virtual Machine，以太坊虚拟机；“EVM 钱包”指兼容以太坊地址体系的钱包。 | [ethereum.org Glossary — EVM](https://ethereum.org/en/glossary/#evm) |
| 智能合约 | 区块链/技术术语 | 部署在区块链上、按代码自动执行的程序。 | [ethereum.org Glossary — Smart contract](https://ethereum.org/en/glossary/#smart-contract) |
| gas | 区块链/技术术语 | 在以太坊类区块链上执行交易需要支付的手续费单位。 | [ethereum.org Glossary — Gas](https://ethereum.org/en/glossary/#gas) |
| 稳定币 | 加密行业术语 | 价格锚定法币（通常 1 美元）的加密代币，如 USDC、USDT。 | [ethereum.org Glossary — Stablecoin](https://ethereum.org/en/glossary/#stablecoin) |
| USDC | 加密行业术语 | Circle 发行的美元稳定币；Hyperliquid 主流永续的保证金与结算资产。 | [Circle — USDC](https://www.circle.com/usdc) |
| USDT | 加密行业术语 | Tether 发行的美元稳定币；Hyperliquid 主流永续的价格以它计价。 | [Tether — Official site](https://tether.to/en/) |
| Arbitrum | 区块链/技术术语 | 基于以太坊的二层扩容网络，可使用小狐狸（MetaMask）、Rabby 等支持该网络的钱包连接；钱包负责管理地址和签名，Arbitrum 是资产所在的网络。本文介绍的 USDC 入金桥部署在该网络上。 | [Arbitrum Docs — Introduction](https://docs.arbitrum.io/get-started/arbitrum-introduction) |
| 跨链桥 | 区块链/技术术语 | 在不同区块链之间转移资产的机制，存在合约漏洞和托管风险。 | [ethereum.org — Bridges](https://ethereum.org/en/developers/docs/bridges/) |
| 资产托管 | 通用金融术语 | 由第三方机构代为保管资产。 | [Wikipedia — Custodian bank](https://en.wikipedia.org/wiki/Custodian_bank) |
| 原子转移 | 区块链/技术术语 | 要么全部完成、要么完全不发生的操作，不会出现只完成一半的状态（原子性）。 | [Wikipedia — Atomicity (database systems)](https://en.wikipedia.org/wiki/Atomicity_%28database_systems%29) |
| 同质化 | 区块链/技术术语 | 每一单位完全相同、可以互换，如 1 个 USDC 等于任意另 1 个 USDC。 | [Wikipedia — Fungibility](https://en.wikipedia.org/wiki/Fungibility) |
| API | 区块链/技术术语 | Application Programming Interface：程序之间交互的接口，这里指交易所提供的行情与交易接口。 | [MDN Glossary — API](https://developer.mozilla.org/en-US/docs/Glossary/API) |
| UI | 区块链/技术术语 | User Interface，用户界面，这里指交易所网页或 App 前端。 | [MDN Glossary — UI](https://developer.mozilla.org/en-US/docs/Glossary/UI) |
| 幂等 | 区块链/技术术语 | 同一请求执行一次和执行多次的效果相同；用于网络重试时避免重复下单。 | [MDN Glossary — Idempotent](https://developer.mozilla.org/en-US/docs/Glossary/Idempotent) |
| 限流 | 区块链/技术术语 | 限制单位时间内的请求次数，超过就拒绝或排队。 | [Wikipedia — Rate limiting](https://en.wikipedia.org/wiki/Rate_limiting) |
| 私钥 | 区块链/技术术语 | 控制钱包地址资产的密钥；谁掌握私钥（或助记词）谁就能动用资产，丢失无法找回。 | [ethereum.org Glossary — Private key](https://ethereum.org/en/glossary/#private-key) |
| 钱包 | 区块链/技术术语 | 保存私钥、用来签名交易和管理链上地址的软件，如 MetaMask、Rabby。 | [ethereum.org Glossary — Wallet](https://ethereum.org/en/glossary/#wallet) |
| CCTP | 加密行业术语 | Cross-Chain Transfer Protocol，Circle 的跨链转账协议：在源链销毁 USDC、在目标链重新发行，而不是锁在桥里。 | [Circle Docs — CCTP](https://developers.circle.com/cctp) |
| clearinghouse（清算所账本） | Hyperliquid 专有名词 | HyperCore 中记账的模块：perps clearinghouse 记录永续保证金余额与仓位，spot clearinghouse 记录现货余额。 | [Hyperliquid Docs — Clearinghouse](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/clearinghouse) |
| K 线 | 通用金融术语 | 用开盘、最高、最低、收盘四个价格表示一段时间价格走势的图形（蜡烛图）。 | [Wikipedia — Candlestick chart](https://en.wikipedia.org/wiki/Candlestick_chart) |
