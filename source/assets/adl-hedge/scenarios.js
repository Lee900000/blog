(async function () {
  'use strict';
  const M = window.AdlModel;
  if (!M) return;
  let candles;
  try {
    const response = await fetch('/assets/adl-hedge/okx-uni-20251010.json');
    if (!response.ok) throw new Error('K 线数据加载失败');
    candles = (await response.json()).candles;
    if (!Array.isArray(candles) || candles.length !== 60) throw new Error('K 线数据不完整');
  } catch (_) {
    document.querySelectorAll('[data-adl-case]').forEach(el => { el.textContent = '历史 K 线加载失败，请刷新页面；下方表格仍可查看场景结果。'; });
    return;
  }
  const N = 1000, entry = candles[0].close;
  const fmt = n => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const qty = n => n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  const cases = { early: 13, middle: 19, bottom: 22 };
  document.querySelectorAll('[data-adl-case]').forEach(container => {
    const adl = cases[container.dataset.adlCase];
    if (adl === undefined) return;
    const adlPrice = candles[adl].close;
    const state = M.afterAdl(N, entry, adlPrice);
    const left = 45, right = 666, top = 32, bottom = 270, min = 2, max = 7.5;
    const x = i => left + i * (right - left) / 59;
    const y = p => bottom - (p - min) * (bottom - top) / (max - min);
    const grid = [2, 3, 4, 5, 6, 7].map(p => `<line x1="${left}" y1="${y(p)}" x2="${right}" y2="${y(p)}" class="adl-grid"/><text x="675" y="${y(p) + 4}" class="adl-axis-label">${p.toFixed(2)}</text>`).join('');
    const bars = candles.map((c, i) => {
      const rising = c.close >= c.open, color = rising ? 'up' : 'down';
      const bodyTop = y(Math.max(c.open, c.close)), h = Math.max(1.5, Math.abs(y(c.open) - y(c.close)));
      return `<g class="adl-candle adl-${color}" data-index="${i}"><line x1="${x(i)}" y1="${y(c.high)}" x2="${x(i)}" y2="${y(c.low)}"/><rect x="${x(i)-3}" y="${bodyTop}" width="6" height="${h}"/></g>`;
    }).join('');
    const ticks = [0, 10, 20, 30, 40, 50, 59].map(i => `<text x="${x(i)}" y="296" text-anchor="middle" class="adl-axis-label">06:${String(i).padStart(2, '0')}</text>`).join('');
    container.innerHTML = `<div class="adl-trading-head"><div><strong>UNI-USD-SWAP</strong><span>OKX · 1分钟 · 2025-10-11 JST</span></div><span class="adl-live">历史 K 线回放</span></div><div class="adl-ohlc"></div>
      <svg class="adl-chart" viewBox="0 0 730 310" role="img" aria-label="OKX UNI-USD 永续真实一分钟 K 线，红色和绿色蜡烛表示价格变化"><defs><clipPath id="clip-${adl}"><rect class="adl-clip" x="0" y="0" width="0" height="310"/></clipPath></defs>${grid}<g clip-path="url(#clip-${adl})">${bars}</g><line class="adl-cursor" y1="${top}" y2="${bottom}"/><g class="adl-event" visibility="hidden"><line x1="${x(adl)}" y1="${top}" x2="${x(adl)}" y2="${bottom}"/><circle cx="${x(adl)}" cy="${y(adlPrice)}" r="5"/><text x="${x(adl)+8}" y="${Math.max(top+14,y(adlPrice)-10)}">假设 ADL</text></g>${ticks}</svg>
      <div class="adl-toolbar"><button type="button" class="adl-play">▶ 播放</button><button type="button" class="adl-reset">↺ 重置</button><label class="adl-slider-label">时间进度 <input class="adl-range" type="range" min="0" max="59" step="1" value="0" aria-label="拖动查看一分钟 K 线"></label><span class="adl-phase"></span></div>
      <div class="adl-state"><div><small>当前收盘价</small><strong class="adl-price"></strong></div><div><small>不补仓持有 UNI</small><strong class="adl-coins"></strong></div><div><small>假设空单状态</small><strong class="adl-position"></strong></div></div><div class="adl-flow"></div>
      <div class="adl-compare"><div><span>不补仓 · 组合价值</span><strong class="adl-no"></strong><small class="adl-no-diff"></small></div><div><span>立即补空 · 组合价值</span><strong class="adl-yes"></strong><small class="adl-yes-diff"></small></div></div><p class="adl-note" aria-live="polite"></p>`;
    const range = container.querySelector('.adl-range'), play = container.querySelector('.adl-play');
    let timer, userPaused = false, inView = false;
    const set = (selector, text) => { container.querySelector(selector).textContent = text; };
    function render() {
      const i = Number(range.value), c = candles[i], p = c.close, closed = i >= adl;
      const unhedged = closed ? M.value(state.coins, 0, adlPrice, p) : N;
      const hedged = closed ? M.value(state.coins, N, adlPrice, p) : N;
      const diff = value => { const change = Math.abs(value - N) < 0.005 ? 0 : value - N; return `较原对冲 ${change >= 0 ? '+' : '−'}${fmt(Math.abs(change))}`; };
      set('.adl-phase', `06:${String(i).padStart(2,'0')} JST${i === adl ? ' · 假设 ADL' : ''}`);
      set('.adl-ohlc', `开 ${c.open.toFixed(3)}　高 ${c.high.toFixed(3)}　低 ${c.low.toFixed(3)}　收 ${c.close.toFixed(3)}`);
      set('.adl-price', '$' + p.toFixed(3));
      set('.adl-coins', qty(closed ? state.coins : state.initialCoins) + ' UNI');
      set('.adl-position', closed ? 'ADL 平空；补仓分支已重开' : '原空单持有中');
      set('.adl-flow', closed ? `假设 ADL 结算：${qty(state.initialCoins)} UNI 保证金 + ${qty(state.pnlCoins)} UNI 盈利 = ${qty(state.coins)} UNI` : `ADL 前：${qty(state.initialCoins)} UNI 保证金币 + 原空单；两种选择还没有分叉。`);
      set('.adl-no', fmt(unhedged)); set('.adl-yes', fmt(hedged));
      set('.adl-no-diff', diff(unhedged)); set('.adl-yes-diff', diff(hedged));
      set('.adl-note', closed ? '理想对照：假设同价全部补仓，不含盘口深度、价格跳变、滑点与手续费；真实行情不证明发生过 ADL。' : '以 06:00 收盘价建立理想对冲。K 线不包含买盘深度，不能证明可以同价补仓。');
      const cursor = container.querySelector('.adl-cursor'); cursor.setAttribute('x1', x(i)); cursor.setAttribute('x2', x(i));
      container.querySelector('.adl-clip').setAttribute('width', x(i)+5);
      container.querySelector('.adl-event').setAttribute('visibility', closed ? 'visible' : 'hidden');
    }
    function stop() { if (timer) clearInterval(timer); timer = null; play.textContent = '▶ 播放'; }
    function start() {
      if (timer) return;
      if (+range.value >= 59) range.value = 0;
      render(); play.textContent = '❚❚ 暂停';
      timer = setInterval(() => { if (+range.value >= 59) return stop(); range.value = +range.value + 1; render(); }, 175);
    }
    play.addEventListener('click', () => { if (timer) { userPaused = true; stop(); } else { userPaused = false; start(); } });
    container.querySelector('.adl-reset').addEventListener('click', () => { userPaused = true; stop(); range.value = 0; render(); });
    range.addEventListener('input', () => { userPaused = true; stop(); render(); });
    render();
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if ('IntersectionObserver' in window && !reducedMotion) {
      const observer = new IntersectionObserver(entries => {
        inView = entries[0].isIntersecting;
        if (!inView) stop();
        else if (!userPaused && +range.value < 59 && !document.hidden) start();
      }, { threshold: 0.35 });
      observer.observe(container.querySelector('.adl-chart'));
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) stop();
        else if (inView && !userPaused && +range.value < 59) start();
      });
    }
  });
})();
