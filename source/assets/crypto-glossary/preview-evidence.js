// Preview-only enhancement: reuse real glossary animations and cite primary sources.
(() => {
  const sources = [
    [['OKX · USDT 介绍', 'https://www.okx.com/learn/what-is-usdt']],
    [['OKX · P2P 交易流程', 'https://www.okx.com/help/what-is-p2p-trading']],
    [['OKX API v5 · 产品信息（ctVal / ctValCcy / ctMult）', 'https://www.okx.com/docs-v5/en/#public-data-rest-api-get-instruments']],
    [['Binance · 历史资金费率', 'https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Get-Funding-Rate-History'], ['OKX · 当前资金费率接口', 'https://www.okx.com/docs-v5/en/#public-data-rest-api-get-funding-rate']],
    [['Binance · 账户信息 V3', 'https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Information-V3']],
    [['Binance · 名义价值与杠杆分层', 'https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Notional-and-Leverage-Brackets']]
  ];
  const clarifications = [
    '适用范围：这是币种概念，不是网络名称。USDT 可在不同网络上流通；提币时还须核对网络、地址和平台支持情况。',
    '适用范围：这里指平台撮合的用户间交易。平台托管加密资产与用户完成法币付款不是同一条资金路径。',
    '阅读顺序：先看 ctType（正向 / 反向），再看 ctVal 和 ctValCcy；ctMult 单独读取。示例假设乘数为 1，不代表所有产品。',
    '费率与费用不同：fundingRate 是比例，资金费用是按适用持仓价值和结算规则计算出的金额。0.01% 对应小数 0.0001；结算周期不能一律假定为 8 小时。',
    '字段范围：Binance 账户信息 V3 中 assets 数组的 crossWalletBalance 表示该资产的全仓钱包余额；不要与 totalCrossWalletBalance、availableBalance 或 crossUnPnl 混用。',
    '字段范围：Binance 杠杆分层接口中，cum 是对应档位的速算辅助值。须结合 maintMarginRatio 与名义价值读取，不能当成保证金率或独立强平价。'
  ];
  const original = card;
  let animations = new Map();
  card = function (term, index) {
    // Remove the old placeholder branch entirely, including its animation label.
    let html = original({...term, motion: null}, index);
    const key = ({0: 'usdt', 1: 'c2c', 3: 'funding'})[index];
    const figure = animations.get(key);
    const extra = `<p class="scope-note">${clarifications[index]}</p>` +
      (figure ? `<details class="real-concept"><summary>查看概念动画</summary><div class="real-animation">${figure}</div><p class="source-meta">概念动画来源：<a href="https://ngneo.com/learn/glossary" target="_blank" rel="noopener noreferrer">币算术语页 ↗</a>。动画为概念示例，非交易所实时数据。</p></details>` : '') +
      `<div class="official-sources"><span>官方资料 · 核对定义与适用范围</span>${sources[index].map(([title, href]) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${title} ↗</a>`).join('')}<p class="source-meta">查阅日期：2026-11-03 · 数字算例为本站解释性示例，非接口实时返回。</p></div>`;
    return html.replace('</article>', extra + '</article>');
  };
  // Details opening starts the original SVG animation; closing stops it.
  document.addEventListener('toggle', event => {
    if (!event.target.matches('.real-concept')) return;
    const figure = event.target.querySelector('.anim');
    figure.classList.remove('play');
    if (event.target.open) requestAnimationFrame(() => requestAnimationFrame(() => figure.classList.add('play')));
  }, true);
  document.addEventListener('click', event => {
    const figure = event.target.closest('.real-animation .anim');
    if (!figure) return;
    figure.classList.remove('play');
    requestAnimationFrame(() => requestAnimationFrame(() => figure.classList.add('play')));
  });
  document.querySelector('.footer').textContent = '设计预览 · 6 条样例 · 动画沿用现有词典资源，定义与字段附官方来源 · 正式页未修改';
  showTerm(terms[selected]);
  fetch('/assets/crypto-glossary/inline-scenes.json').then(response => {
    if (!response.ok) throw new Error('动画资源请求失败');
    return response.json();
  }).then(items => {
    animations = new Map(items.map(item => [item.key, item.html]));
    showTerm(terms[selected]);
  }).catch(() => {
    const notice = document.createElement('p');
    notice.className = 'warning';
    notice.textContent = '概念动画资源未加载成功，请刷新重试；不会以占位动画替代。';
    document.querySelector('#cards').append(notice);
  });
})();
