---
title: 数字货币量化套利
description: 十种量化套利策略的原理图、公式与交互计算器。
layout: page
type: arbitrage
aside: false
top_img: false
comments: false
toc: false
disableNunjucks: true
---

<div class="arbitrage-app">
  <div class="arbitrage-intro">
    <div>
      <span class="arbitrage-eyebrow">QUANT ARBITRAGE PLAYBOOK</span>
      <p class="arbitrage-lead">十种策略的图解、公式与交互计算器。选择左侧策略进入正文；模型为简化情景估算，不构成投资建议。</p>
    </div>
    <span class="arbitrage-count">10 种策略</span>
  </div>
  <section class="quant-showcase" aria-labelledby="quantShowcaseTitle">
    <div class="quant-showcase-copy">
      <span class="quant-showcase-kicker">PERSONAL QUANT FINANCE</span>
      <h2 id="quantShowcaseTitle">个人量化理财</h2>
      <p>围绕资金费率、期现与跨期策略建立的监控与执行界面，用于查看仓位、风险提示、资金与策略运行状态。</p>
      <a class="quant-contact" href="mailto:axon90000@gmail.com?subject=%E9%87%8F%E5%8C%96%E7%90%86%E8%B4%A2%E5%92%A8%E8%AF%A2">有量化理财需求？请通过邮件联系我 <strong>axon90000@gmail.com</strong><i class="fas fa-arrow-up-right-from-square"></i></a>
    </div>
    <div class="quant-showcase-gallery" role="region" aria-label="个人量化理财界面预览，可横向滚动" tabindex="0">
      <button class="quant-showcase-trigger" type="button" data-quant-index="0" aria-label="放大预览：全景监控">
      <span class="quant-showcase-media">
        <img src="/assets/arbitrage-showcase/dashboard.png" alt="个人量化理财的总览监控界面" loading="lazy">
        <span class="quant-showcase-caption">全景监控 · 仓位、策略与风险提示</span>
      </span>
      </button>
      <button class="quant-showcase-trigger" type="button" data-quant-index="1" aria-label="放大预览：策略执行">
      <span class="quant-showcase-media">
        <img src="/assets/arbitrage-showcase/open-order.png" alt="BCH 合约开仓指令界面" loading="lazy">
        <span class="quant-showcase-caption">策略执行 · 合约开仓指令</span>
      </span>
      </button>
      <button class="quant-showcase-trigger" type="button" data-quant-index="2" aria-label="放大预览：交易记录">
      <span class="quant-showcase-media">
        <img src="/assets/arbitrage-showcase/trade-history.png" alt="BTC 合约历史成交记录" loading="lazy">
        <span class="quant-showcase-caption">交易记录 · 成交与手续费明细</span>
      </span>
      </button>
      <button class="quant-showcase-trigger" type="button" data-quant-index="3" aria-label="放大预览：资金费率收益">
      <span class="quant-showcase-media">
        <img src="/assets/arbitrage-showcase/funding-history.png" alt="SOL 合约资金费收益记录" loading="lazy">
        <span class="quant-showcase-caption">资金费率 · 收益结算记录</span>
      </span>
      </button>
      <button class="quant-showcase-trigger" type="button" data-quant-index="4" aria-label="放大预览：策略分析">
      <span class="quant-showcase-media">
        <img src="/assets/arbitrage-showcase/funding-overview.png" alt="资金费率策略与多空比走势" loading="lazy">
        <span class="quant-showcase-caption">策略分析 · 资金费率与多空比</span>
      </span>
      </button>
    </div>
  </section>
  <div class="quant-lightbox" id="quantLightbox" role="dialog" aria-modal="true" aria-label="量化理财图片预览" hidden>
    <button class="quant-lightbox-close" type="button" data-quant-lightbox="close" aria-label="关闭图片预览"><i class="fas fa-xmark"></i></button>
    <button class="quant-lightbox-nav previous" type="button" data-quant-lightbox="previous" aria-label="查看上一张"><i class="fas fa-chevron-left"></i></button>
    <figure class="quant-lightbox-content">
      <img id="quantLightboxImage" src="" alt="">
      <figcaption id="quantLightboxCaption"></figcaption>
    </figure>
    <button class="quant-lightbox-nav next" type="button" data-quant-lightbox="next" aria-label="查看下一张"><i class="fas fa-chevron-right"></i></button>
  </div>
  <div class="arbitrage-workspace">
    <aside class="strategy-nav" id="strategyNav" aria-label="套利策略导航">
      <div class="strategy-label">总览</div>
      <button class="strategy-card" data-src="数字货币量化理财-基础分析清单.html" data-name="基础分析清单">
        <span class="strategy-title"><b class="strategy-number overview">◎</b>基础分析清单</span>
        <span class="strategy-description">十种策略与平台网站全景表，先建立整体框架。</span>
      </button>
      <div class="strategy-label strategy-label-spaced">十种套利（含计算器）</div>
      <button class="strategy-card active" data-src="01-资金费率套利.html" data-name="资金费率套利">
        <span class="strategy-title"><b class="strategy-number">1</b>资金费率套利</span>
        <span class="strategy-description">现货与永续对冲，收取多空互付的资金费。</span><span class="risk low">难度低</span>
      </button>
      <button class="strategy-card" data-src="02-期现套利.html" data-name="期现套利">
        <span class="strategy-title"><b class="strategy-number">2</b>期现套利</span>
        <span class="strategy-description">买现货、空交割合约，等待基差到期收敛。</span><span class="risk low">难度低</span>
      </button>
      <button class="strategy-card" data-src="03-日历价差套利.html" data-name="日历价差套利">
        <span class="strategy-title"><b class="strategy-number">3</b>日历价差（跨期）</span>
        <span class="strategy-description">近远月两腿对冲，捕捉期限价差变化。</span><span class="risk mid">难度中</span>
      </button>
      <button class="strategy-card" data-src="04-跨交易所套利.html" data-name="跨交易所套利">
        <span class="strategy-title"><b class="strategy-number">4</b>跨交易所搬砖</span>
        <span class="strategy-description">不同交易所同步买卖，捕捉瞬时价差。</span><span class="risk mid">难度中</span>
      </button>
      <button class="strategy-card" data-src="05-三角套利.html" data-name="三角套利">
        <span class="strategy-title"><b class="strategy-number">5</b>三角套利</span>
        <span class="strategy-description">同一交易所内三币循环，捕捉汇率偏差。</span><span class="risk high">难度高</span>
      </button>
      <button class="strategy-card" data-src="06-跨所资金费率套利.html" data-name="跨所资金费率套利">
        <span class="strategy-title"><b class="strategy-number">6</b>跨所资金费率套利</span>
        <span class="strategy-description">高费率所做空、低费率所做多，赚取费率差。</span><span class="risk mid">难度中</span>
      </button>
      <button class="strategy-card" data-src="07-统计套利.html" data-name="统计套利 / 配对交易">
        <span class="strategy-title"><b class="strategy-number">7</b>统计套利 / 配对交易</span>
        <span class="strategy-description">相关资产价差异常时，押注均值回归。</span><span class="risk high">难度高</span>
      </button>
      <button class="strategy-card" data-src="08-闪电贷套利.html" data-name="闪电贷套利">
        <span class="strategy-title"><b class="strategy-number">8</b>闪电贷套利</span>
        <span class="strategy-description">用原子交易完成借款、套利与归还。</span><span class="risk high">难度高</span>
      </button>
      <button class="strategy-card" data-src="09-稳定币脱锚套利.html" data-name="稳定币脱锚套利">
        <span class="strategy-title"><b class="strategy-number">9</b>稳定币脱锚套利</span>
        <span class="strategy-description">脱锚时低买并等待回锚，风险较高。</span><span class="risk high">风险高</span>
      </button>
      <button class="strategy-card" data-src="10-期权套利.html" data-name="期权套利">
        <span class="strategy-title"><b class="strategy-number">10</b>期权套利</span>
        <span class="strategy-description">利用平价、盒式与蝶式结构捕捉定价偏差。</span><span class="risk high">难度高</span>
      </button>
    </aside>
    <section class="strategy-reader" aria-label="策略正文">
      <div class="reader-toolbar">
        <span>正在阅读：<strong id="strategyName">资金费率套利</strong></span>
        <a id="openStrategy" href="01-资金费率套利.html" target="_blank" rel="noopener">独立打开 <i class="fas fa-arrow-up-right-from-square"></i></a>
      </div>
      <div class="viewer-shell">
        <iframe id="strategyViewer" src="01-资金费率套利.html" title="资金费率套利策略内容"></iframe>
      </div>
    </section>
  </div>
</div>
