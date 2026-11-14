(async function () {
  'use strict';
  const container = document.querySelector('[data-adl-batch]'), M = window.AdlModel;
  if (!container || !M) return;
  let snapshots, candles;
  try {
    const [book, bars] = await Promise.all(['/assets/adl-hedge/okx-batch-orderbook.json', '/assets/adl-hedge/okx-batch-candles.json'].map(url => fetch(url)));
    if (!book.ok || !bars.ok) throw new Error('历史数据加载失败');
    snapshots = (await book.json()).snapshots; candles = (await bars.json()).candles;
    if (snapshots.length !== 50 || candles.length !== 50) throw new Error('历史数据不完整');
  } catch (_) { container.textContent = '分批回放数据加载失败，请刷新；下方文字仍可查看计算口径。'; return; }
  const priceAdl = 2.251, notional = 50000, coins = notional / priceAdl;
  const money = x => '$' + x.toLocaleString('en-US', { maximumFractionDigits: 0 });
  const number = x => x.toLocaleString('en-US', { maximumFractionDigits: 0 });
  function replay(n, guarded, price) {
    let filled = 0, inverse = 0, partial = 0;
    for (const snap of snapshots.slice(0, n)) {
      const best = snap.bids[0]?.[0] || 0;
      const fill = M.fillSell(snap.bids, 100, guarded ? best * 0.99 : 0);
      filled += fill.filled; inverse += fill.inverse;
      if (fill.filled < 100) partial++;
    }
    return { filled, partial, avg: filled ? filled * 10 / inverse : null, equity: (coins + filled * 10 / price - inverse) * price };
  }
  const min = 2, max = 7, left = 45, right = 666, top = 32, bottom = 270;
  const x = i => left + i * (right - left) / 49;
  const y = p => bottom - (p - min) * (bottom - top) / (max - min);
  const grid = [2,3,4,5,6,7].map(p => `<line x1="${left}" y1="${y(p)}" x2="${right}" y2="${y(p)}" class="adl-grid"/><text x="675" y="${y(p)+4}" class="adl-axis-label">${p.toFixed(2)}</text>`).join('');
  const bars = candles.map((c, i) => {
    const up = c.close >= c.open, body = y(Math.max(c.open,c.close)), height = Math.max(1.5,Math.abs(y(c.open)-y(c.close)));
    return `<g class="adl-candle adl-${up ? 'up' : 'down'}"><line x1="${x(i)}" y1="${y(c.high)}" x2="${x(i)}" y2="${y(c.low)}"/><rect x="${x(i)-3}" y="${body}" width="6" height="${height}"/></g>`;
  }).join('');
  const time = ms => new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Tokyo',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(ms));
  const ticks = [0,10,20,30,40,49].map(i => `<text x="${x(i)}" y="296" text-anchor="middle" class="adl-axis-label">${time(snapshots[i].time)}</text>`).join('');
  container.innerHTML = `<div class="adl-trading-head"><div><strong>UNI-USD-SWAP · 分批补空</strong><span>50 笔 × 100 张 · JST</span></div><span class="adl-live">真实盘口快照 / 假设成交</span></div><div class="adl-ohlc batch-last"></div>
    <svg class="adl-chart" viewBox="0 0 730 310" role="img" aria-label="ADL 后 50 分钟历史 K 线回放"><defs><clipPath id="batch-clip"><rect class="adl-clip" x="0" y="0" width="0" height="310"/></clipPath></defs>${grid}<g clip-path="url(#batch-clip)">${bars}</g><line class="adl-cursor" y1="${top}" y2="${bottom}"/>${ticks}</svg>
    <div class="adl-toolbar"><button type="button" class="adl-play">▶ 播放</button><button type="button" class="adl-reset">↺ 重置</button><label class="adl-slider-label">补仓进度 <input class="adl-range" type="range" min="0" max="50" step="1" value="0" aria-label="拖动查看逐分钟补仓"></label><span class="adl-phase"></span></div>
    <div class="adl-state"><div><small>预计下单批次</small><strong class="batch-order"></strong></div><div><small>当前估值参考</small><strong class="batch-price"></strong></div><div><small>始终不补仓的权益</small><strong class="batch-hold"></strong></div></div>
    <div class="adl-compare"><div><span>不设自定义价格限制 · 静态扫盘</span><strong class="batch-market"></strong><small class="batch-market-detail"></small></div><div><span>买一向下 1% 限价 · 未成交取消</span><strong class="batch-guard"></strong><small class="batch-guard-detail"></small></div></div><p class="adl-note">上方金额为按最近一分钟收盘价估算的组合权益，并非标记价或真实成交；静态盘口未模拟交易所价格限制、滑点保护、延迟、手续费和自身冲击。</p>`;
  const range = container.querySelector('.adl-range'), play = container.querySelector('.adl-play');
  let timer, userPaused = false, inView = false;
  const set = (s,t) => { container.querySelector(s).textContent = t; };
  function render() {
    const n = +range.value, price = n ? candles[n-1].close : priceAdl;
    const raw = replay(n, false, price), guard = replay(n, true, price);
    set('.adl-phase', n ? time(snapshots[n-1].time) + ' JST' : 'ADL 后');
    set('.batch-last', n ? `第 ${n} 笔 · 买一 ${snapshots[n-1].bids[0][0].toFixed(3)} · 快照更新 ${((snapshots[n-1].time-snapshots[n-1].lastUpdate)/1000).toFixed(2)} 秒前` : '假设 06:22 收盘 ADL，06:23 开始每分钟下一笔。');
    set('.batch-order', `${n} / 50 笔`); set('.batch-price', '$' + price.toFixed(3)); set('.batch-hold', money(coins * price));
    set('.batch-market', money(raw.equity)); set('.batch-guard', money(guard.equity));
    const detail = result => `已补 ${number(result.filled)} / 5,000 张 · 缺 ${number(5000-result.filled)} 张 · 均价 ${result.avg ? '$'+result.avg.toFixed(3) : '—'} · 未满 ${result.partial} 笔`;
    set('.batch-market-detail', detail(raw)); set('.batch-guard-detail', detail(guard));
    const cursor=container.querySelector('.adl-cursor'), px=x(Math.max(0,n-1)); cursor.setAttribute('x1',px); cursor.setAttribute('x2',px);
    container.querySelector('.adl-clip').setAttribute('width', n ? px+5 : 0);
  }
  function stop() { if (timer) clearInterval(timer); timer = null; play.textContent = '▶ 播放'; }
  function start() { if(timer)return; if(+range.value>=50)range.value=0; render(); play.textContent='❚❚ 暂停'; timer=setInterval(()=>{ if(+range.value>=50)return stop(); range.value=+range.value+1; render(); },175); }
  play.addEventListener('click',()=>{ if(timer){userPaused=true;stop()}else{userPaused=false;start()} });
  container.querySelector('.adl-reset').addEventListener('click',()=>{userPaused=true;stop();range.value=0;render()});
  range.addEventListener('input',()=>{userPaused=true;stop();render()});
  render();
  if ('IntersectionObserver' in window && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(!inView)stop();else if(!userPaused && +range.value<50 && !document.hidden)start()},{threshold:0.35});
    observer.observe(container.querySelector('.adl-chart'));
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(inView&&!userPaused&&+range.value<50)start()});
  }
})();
