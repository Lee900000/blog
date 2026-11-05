"use strict";
const $ = s => document.querySelector(s);
function h(tag, attrs, ...kids){
  const e = document.createElement(tag);
  for (const k in (attrs || {})){
    const v = attrs[k];
    if (k === 'class') e.className = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (k === 'value') e.value = v;
    else if (k === 'checked' || k === 'selected' || k === 'disabled') { if (v) e[k] = true; }
    else if (v !== false && v != null) e.setAttribute(k, v);
  }
  kids.flat(Infinity).forEach(c => { if (c != null && c !== false) e.append(c.nodeType ? c : document.createTextNode(String(c))); });
  return e;
}
function rc(el, ...kids){ el.replaceChildren(...kids.flat(Infinity).filter(k => k != null && k !== false)); }
const fN = (s, d=2) => Number(s).toLocaleString('en-US', {minimumFractionDigits:d, maximumFractionDigits:d});
const fP = (s, d=2) => (Number(s) * 100).toFixed(d) + '%';
const fT = s => s ? s.replace('T', ' ').replace(/:\d\d\+09:00$/, '') + ' JST' : '—';
/* Original opportunity view and charts; static data transport. Private actions removed. */
const api=(...args)=>QuantDemo.api(...args);
const loadSeq={}; let oppsLoadedAt=0;
function latest(key){const n=loadSeq[key]=(loadSeq[key]||0)+1;return()=>loadSeq[key]===n;}
function say(message){document.querySelector('#msg').textContent=message;}
function guard(fn){let running=false;return async function(event){if(running)return;running=true;try{await fn(event);}catch(error){say(error.message);}finally{running=false;}};}
/* ---------- 量化機會 ---------- */
const JST_MS = 9 * 3600e3, p2 = n => String(n).padStart(2, '0');
const dFull = t => { const d = new Date(t + JST_MS); return d.getUTCFullYear() + '-' + p2(d.getUTCMonth() + 1) + '-' + p2(d.getUTCDate()) + ' ' + p2(d.getUTCHours()) + ':' + p2(d.getUTCMinutes()) + ' JST'; };
const dShort = t => { const d = new Date(t + JST_MS); return p2(d.getUTCMonth() + 1) + '-' + p2(d.getUTCDate()); };
function svg(tag, attrs, parent){ const e = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.append(e); return e; }
function niceTicks(min, max, n=3){
  const span = max - min || 1, raw = span / n, mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= raw) || raw;
  const out = []; for (let v = Math.floor(min / step) * step; v <= Math.ceil(max / step) * step + step / 2; v += step) out.push(+v.toFixed(10)); return out;
}

/* ---------- 机会计算 ----------
   存的是毛年化原始序列；净年化 / 预计收益 / 回撤全部在页面里按「持有天数、本金」实时换算。 */
function lineChart(host, o){
  const draw = () => {
    host.innerHTML = '';
    const W = Math.max(280, host.clientWidth), H = o.height || 170, m = {l:o.ml || 44, r:12, t:8, b:22}, fmt = o.fmt || (v => v.toFixed(0) + '%'), tipFmt = o.tipFmt || (v => v.toFixed(2) + '%');
    const pw = W - m.l - m.r, ph = H - m.t - m.b, pts = o.pts;
    const xs = pts.map(p => p[0]), x0 = Math.min(...xs), x1 = Math.max(...xs);
    const ys = pts.map(p => p[1]).concat(o.refs.map(r => r.y));
    const ticks = niceTicks(Math.min(...ys), Math.max(...ys)), y0 = ticks[0], y1 = ticks[ticks.length - 1];
    const X = t => m.l + (t - x0) / (x1 - x0 || 1) * pw, Y = v => m.t + (1 - (v - y0) / (y1 - y0 || 1)) * ph;
    const root = svg('svg', {width:W, height:H, viewBox:`0 0 ${W} ${H}`, role:'img', 'aria-label':o.label}, host);
    ticks.forEach(v => { svg('line', {x1:m.l, x2:W - m.r, y1:Y(v), y2:Y(v), stroke:'var(--grid)'}, root); svg('text', {x:m.l - 6, y:Y(v) + 4, 'text-anchor':'end', fill:'var(--muted)', 'font-size':11}, root).textContent = fmt(v); });
    for (let i = 0; i <= 4; i++){ const t = x0 + (x1 - x0) * i / 4; svg('text', {x:X(t), y:H - 6, 'text-anchor':i === 0 ? 'start' : i === 4 ? 'end' : 'middle', fill:'var(--muted)', 'font-size':11}, root).textContent = dShort(t); }
    o.refs.forEach(r => { svg('line', {x1:m.l, x2:W - m.r, y1:Y(r.y), y2:Y(r.y), stroke:'var(--ink2)', 'stroke-dasharray':'2 4'}, root); svg('text', {x:W - m.r - 2, y:Y(r.y) - 4, 'text-anchor':'end', fill:'var(--ink2)', 'font-size':11}, root).textContent = r.label; });
    const d = pts.map((p, i) => (i ? 'L' : 'M') + X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1)).join('');
    svg('path', {d, fill:'none', stroke:'var(--s1)', 'stroke-width':2, 'stroke-linejoin':'round'}, root);
    const last = pts[pts.length - 1];
    svg('circle', {cx:X(last[0]), cy:Y(last[1]), r:4, fill:'var(--s1)', stroke:'var(--surface)', 'stroke-width':2}, root);
    const cross = svg('line', {y1:m.t, y2:m.t + ph, stroke:'var(--axis)', visibility:'hidden'}, root);
    const dot = svg('circle', {r:4, fill:'var(--s1)', stroke:'var(--surface)', 'stroke-width':2, visibility:'hidden'}, root);
    const tip = h('div', {class:'tip', style:'display:none'}); host.append(tip);
    const hit = svg('rect', {x:m.l, y:m.t, width:pw, height:ph, fill:'transparent', style:'cursor:crosshair'}, root);
    hit.addEventListener('pointermove', ev => {
      const r = hit.getBoundingClientRect(), t = x0 + (ev.clientX - r.left) / r.width * (x1 - x0);
      let b = 0, bd = Infinity; pts.forEach((p, i) => { const dd = Math.abs(p[0] - t); if (dd < bd){ bd = dd; b = i; } });
      const p = pts[b]; cross.setAttribute('x1', X(p[0])); cross.setAttribute('x2', X(p[0])); cross.setAttribute('visibility', 'visible');
      dot.setAttribute('cx', X(p[0])); dot.setAttribute('cy', Y(p[1])); dot.setAttribute('visibility', 'visible');
      rc(tip, h('div', {class:'t'}, dFull(p[0])), h('div', {class:'r'}, h('span', {class:'k', style:'background:var(--s1)'}), o.tip || '保守淨年化', h('span', {class:'val'}, tipFmt(p[1]))));
      tip.style.display = 'block'; const l = X(p[0]) + 12 + tip.offsetWidth > W ? X(p[0]) - 12 - tip.offsetWidth : X(p[0]) + 12; tip.style.left = Math.max(0, l) + 'px'; tip.style.top = '4px';
    });
    hit.addEventListener('pointerleave', () => { cross.setAttribute('visibility', 'hidden'); dot.setAttribute('visibility', 'hidden'); tip.style.display = 'none'; });
  };
  draw(); new ResizeObserver(() => { clearTimeout(host._t); host._t = setTimeout(draw, 80); }).observe(host);
}

const OTYPE = {FUNDING_RATE:'資金費率', DELIVERY_BASIS:'期現套利'};
const VERDICT = {BEAT_FIXED:['✓ 超過定期','good'], BEAT_CASH:['✓ 超過活期','good'], DEPENDS_MARGIN_MODE:['△ 視保證金模式','warn'], NOT_BEAT:['✗ 未超過','bad'], NOT_HEDGEABLE:['無現貨 · 不可對沖',''], NEW_LISTING:['新上線 · 觀察中','warn']};
const RISK = {LOW:['風險 低','good'], MEDIUM:['風險 中','warn'], HIGH:['風險 高','bad']};
const HZ = [1, 7, 15, 30, 60, 90];
const OCOLS = [['opportunity_type','類型'],['symbol','標的'],['latest_funding_rate','最近費率 / 價差','n'],['volume_amount','24h 成交額 (M$)','n'],['_liq','盤口 · 建議本金','n'],['gross_apr','毛年化（近 7 天）','n'],['conservative_apr','淨年化 保守 ~ 樂觀','n'],
  ['worst_funding_rate','最大回撤 · 30 天最差費率','n'],['verdict_rank','對比門檻'],['sustain_ratio','持續度','n'], ['break_even_days','回本天數','n'], ...HZ.map(d => ['profit_' + d + 'd', d + ' 日', 'n']), ['risk_level','風險']];
const OSPAN = OCOLS.length + 1; // 多一列關注鈴鐺
const MARGIN = {USDT:['U 本位','U 本位：現貨和合約保證金各佔一份資金，收益按一半本金計'], COIN:['幣本位','幣本位：買到的幣直接當保證金，全部本金都在賺收益']};
let O = {sort:'conservative_apr', order:'desc', type:'', margin:'', verdict:'', q:'', hedge:true, size:30, open:null, vol:''};
try { O.vol = localStorage.getItem('oppVol') || ''; } catch (e) {} // 成交額門檻：'' = 用參數設置裡的值；其餘是具體金額，'0' = 全部
const sg = s => s === '' ? null : Number(s);
/* 回本天數：來回手續費 ÷ 每天的毛收益（資金費率類型用近 7 天費率，期現套利的收益到交割日才鎖定，回本日就是交割日）。日期用大阪時區 */
const beDate = days => { const t = new Date(Date.parse(QuantDemo.catalog.snapshot.captured_at) + days * 864e5), f = x => t.toLocaleDateString('en-CA', {timeZone:'Asia/Tokyo', year:'numeric', month:'2-digit', day:'2-digit', ...x}); return f({}).slice(0, 4) === new Date().toLocaleDateString('en-CA', {timeZone:'Asia/Tokyo'}).slice(0, 4) ? f({}).slice(5) : f({}); };
function breakEvenCell(o, holdDays){
  const fund = o.opportunity_type === 'FUNDING_RATE';
  if (o.break_even_days === '') return h('td', {class:'n', title:fund ? '近 7 天的資金費率不為正，收益付不起手續費，不會回本' : '期現基差不夠付手續費（現貨買賣 + 合約開倉 + 交割），持有到交割也回不了本'}, '—');
  const n = Number(o.break_even_days), late = n > Number(holdDays);
  return h('td', {class:'n' + (late ? ' down' : ''), title:(fund ? '來回手續費 ÷ 每天毛收益（按近 7 天費率推算，費率變了日期就會變；資金費每 ' + o.settle_interval_hours + ' 小時結算一次，實際在結算那一刻到帳）' : '期現套利收益到交割日才鎖定，回本日 = 交割日') + (late ? '。超過設定的持有天數 ' + holdDays + ' 天' : '')},
    (n < 1 ? '<1' : n.toFixed(1)) + ' 天', h('span', {class:'sub'}, '約 ' + beDate(n)));
}
async function loadOpps(){
  const filters = {is_hedgeable_only:O.hedge}; if (O.type) filters.opportunity_types = [O.type]; if (O.margin) filters.margin_types = [O.margin]; if (O.verdict) filters.verdicts = O.verdict.split(','); if (O.q) filters.keyword = O.q; if (O.vol !== '') filters.min_volume_amount = O.vol;
  const fresh = latest('opps');
  const d = await api('POST', '/finance/opportunities/list', {pagination:{page:1, size:O.size, sort_by:O.sort, order:O.order}, filters});
  if (!fresh()) return;
  oppsLoadedAt = Date.now();
  const sm = d.summary, host = $('#opps');
  const seg = (items, cur, set) => h('div', {class:'seg'}, items.map(([k, v]) => h('button', {type:'button', 'aria-pressed':String(cur === k), onclick:guard(async () => { set(k); O.size = 30; await loadOpps(); })}, v)));
  const q = h('input', {type:'search', placeholder:'搜索標的，回車確認', value:O.draft == null ? O.q : O.draft, 'aria-label':'搜索標的'});
  q.addEventListener('input', () => { O.draft = q.value; }); // 列表重新載入時保留正在輸入的內容
  q.addEventListener('keydown', guard(async e => { if (e.key === 'Enter') { O.q = q.value.trim(); O.draft = null; await loadOpps(); } }));
  q.addEventListener('search', guard(async () => { if (q.value === '' && O.q !== '') { O.q = ''; O.draft = null; await loadOpps(); } })); // 點輸入框裡的 × 清空
  const th = OCOLS.map(([f, label, cls]) => { const on = O.sort === f;
    if (f === '_liq') return h('th', {class:cls, title:'合約盤買賣各 3 檔（共 6 檔）折 U 後 ÷ 6 = 建議本金；點差 = (賣一 − 買一) ÷ 中間價，單位萬分之一。成交額小、點差大、檔位薄的標的，開平倉滑點都會很大'}, label);
    return h('th', {class:cls || '', 'aria-sort':on ? (O.order === 'asc' ? 'ascending' : 'descending') : 'none'},
      h('button', {class:'sort', type:'button', onclick:guard(async () => { O.order = on && O.order === 'desc' ? 'asc' : 'desc'; O.sort = f; await loadOpps(); })}, label, h('span', {class:'arr'}, on ? (O.order === 'asc' ? ' ▲' : ' ▼') : ' ⇅'))); });
  const rows = [];
  d.list.forEach(o => {
    const v0 = VERDICT[o.verdict] || [o.verdict, ''], r = RISK[o.risk_level] || ['?', ''], open = O.open === o.symbol;
    const v = o.verdict === 'NEW_LISTING' ? ['新上線 ' + o.listed_days + ' 天 · 觀察中', 'warn'] : v0; // 上線太短：近 7 天費率多半虛高，不出結論、不報警
    rows.push(h('tr', {class:'opp', tabindex:0, role:'button', 'aria-label':'展開 '+o.symbol, onkeydown:e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.currentTarget.click();}}, onclick:guard(async () => { stopDepth(); O.open = open ? null : o.symbol; await loadOpps(); })},
      h('td', {}, h('span', {class:'tag'}, OTYPE[o.opportunity_type]), h('span', {class:'sub', title:(MARGIN[o.margin_type] || ['',''])[1]}, (MARGIN[o.margin_type] || [o.margin_type])[0] + ' · 佔 ' + o.capital_parts + ' 份')),
      h('td', {class:'sym'}, (open ? '▾ ' : '▸ ') + o.symbol,
        h('span', {class:'sub'}, o.opportunity_type === 'FUNDING_RATE' ? '週期 ' + o.settle_interval_hours + 'h' : '剩 ' + Number(o.days_left).toFixed(0) + ' 天'),
        h('span', {class:'lnk'}, o.links.map(l => h('a', {href:l.url, target:'_blank', rel:'noopener noreferrer', title:l.hint || ('在 OKX 打開：' + l.url), onclick:e => e.stopPropagation()}, l.label)))),
      latestCell(o),
      h('td', {class:'n'}, o.volume_amount === '' ? '—' : fN(o.volume_amount, 0)), h('td', {class:'n liq', 'data-sym':o.symbol}, h('span', {class:'sub'}, '載入中…')), h('td', {class:'n'}, fP(o.gross_apr), o.gross_apr_30d === '' ? null : h('span', {class:'sub', title:o.is_stable ? '近 30 天收益穩定：歷史 ≥ 20 天、費率為正的佔比 ≥ 80%、30 天與 7 天年化相差不到一倍' : o.stability_notes.join('；')}, '30 天 ' + fP(o.gross_apr_30d) + ' · ', h('span', {class:o.is_stable ? 'up' : 'down'}, o.is_stable ? '穩定' : '不穩定'))),
      h('td', {class:'n', style:'font-weight:650'}, o.capital_parts === 1 ? [fP(o.conservative_apr), o.compound_apr === '' ? null : h('span', {class:'sub', title:'每天把收到的幣加開空單的複利年化，未扣加倉手續費'}, '複利 ' + fP(o.compound_apr))] : fP(o.conservative_apr) + ' ~ ' + fP(o.optimistic_apr)),
      h('td', {class:'n ' + (o.worst_funding_rate !== '' && Number(o.worst_funding_rate) < 0 ? 'down' : ''), title:o.worst_funding_rate === '' ? '' : '近 30 天單期最差的資金費率，出現在 ' + fT(o.worst_funding_at) + '。負數 = 空頭要付費；每期虧損 = |費率| × 合約名義價值（本金 ÷ 佔用份數）'},
        o.worst_funding_rate === '' ? '—' : [fP(o.worst_funding_rate, 4), h('span', {class:'sub hi'}, Number(o.worst_funding_rate) < 0 ? '每期虧 ' + fN(o.worst_funding_loss_amount, 2) + ' U' : '30 天無負費率')]),
      h('td', {}, h('span', {class:'tag ' + v[1]}, v[0])), h('td', {class:'n'}, o.sustain_ratio === '' ? '—' : fP(o.sustain_ratio, 0)), breakEvenCell(o, sm.hold_days),
      HZ.map(dd => { const p = o['profit_' + dd + 'd'], po = o.profit_optimistic['profit_' + dd + 'd'];
        return h('td', {class:'n ' + (p === '' ? '' : Number(p) >= 0 ? 'up' : 'down'), title:p === '' ? '' : '樂觀口徑 ' + po + ' USDT'}, p === '' ? '—' : (Number(p) > 0 ? '+' : '') + fN(p)); }),
      h('td', {}, h('span', {class:'tag ' + r[1]}, r[0])),
      h('td', {}, h('button', {class:'bell', type:'button', disabled:true, title:'靜態 Demo：關注功能已禁用'}, '🔕'), h('button', {class:'btn cmdbtn',type:'button',disabled:true,title:'靜態 Demo：不生成開倉指令'}, '指令'))));
    if (open) rows.push(h('tr', {class:'det'}, h('td', {colspan:OSPAN}, oppDetail(o))));
  });
  rc(host, h('div', {class:'hd'}, h('h2', {}, '量化機會', h('small', {}, '資金費率套利 + 期現套利；U 本位佔用 2 份資金（收益按一半本金），幣本位佔用 1 份（全部本金）')), h('span', {class:'sp'}),
      h('span', {class:'meta'}, '符合 ' + d.pagination.total + ' 個 · 超過定期 ' + sm.beat_fixed_count + ' 個 · 本金 ' + fN(sm.principal_amount, 0) + ' · 持有 ' + sm.hold_days + ' 天'),
      h('span', {class:'meta', id:'oppsAsOf', title:'已錄製的行情時間；此 Demo 不會自動同步或請求外部行情'}, sm.market_synced_at ? '行情 ' + (fT(sm.market_synced_at).split(' ')[1] || '') : '行情尚未同步'),
      h('button', {class:'btn pri', type:'button', id:'oppsRefresh', title:'只重載本站快照，不刷新交易所行情',onclick:guard(async()=>{await loadOpps();say('已重載本地快照；未連接行情服務');})}, '重載快照')),
    h('div', {class:'bar'}, seg([['','全部類型'],['FUNDING_RATE','資金費率'],['DELIVERY_BASIS','期現套利']], O.type, k => O.type = k),
      seg([['','U 本位 + 幣本位'],['USDT','U 本位'],['COIN','幣本位']], O.margin, k => O.margin = k),
      seg([['','全部'],['BEAT_CASH,BEAT_FIXED','超過活期'],['BEAT_FIXED','超過定期']], O.verdict, k => O.verdict = k),
      h('label', {class:'chk'}, h('input', {type:'checkbox', checked:O.hedge, onchange:guard(async e => { O.hedge = e.target.checked; await loadOpps(); })}), '只看可對沖'),
      h('label', {class:'chk', title:'只顯示 24 小時成交額不低於這個數的永續。成交額越小，現貨和永續的滑點越大。報警始終按「參數設置」裡的最小成交額，不受這裡影響'}, '成交額',
        h('select', {id:'oppVol', 'aria-label':'成交額門檻', onchange:guard(async e => { O.vol = e.target.value; O.size = 30; try { localStorage.setItem('oppVol', O.vol); } catch (er) {} await loadOpps(); })},
          [['', '≥ ' + (Number(sm.min_volume_amount) / 1e6) + 'M（默認）'], ['5000000', '≥ 5M'], ['1000000', '≥ 1M'], ['100000', '≥ 0.1M'], ['0', '全部']].map(([k, v]) => h('option', {value:k, selected:O.vol === k}, v)))), q),
    h('div', {class:'scroll'}, h('table', {class:'tbl-opp'}, h('thead', {}, h('tr', {}, th, h('th', {}, '關注'))),
      h('tbody', {}, rows.length ? rows : h('tr', {}, h('td', {colspan:OSPAN, class:'todo'}, d.pagination.total === 0 && sm.total === 0 ? '還沒有行情數據：先運行 finance worker（或 worker run --job market）同步一次' : '沒有符合條件的標的，放寬篩選試試')))),
      d.pagination.has_next ? h('div', {style:'margin-top:8px'}, h('button', {class:'btn', type:'button', onclick:guard(async () => { O.size += 30; await loadOpps(); })}, '顯示更多 30 個（共 ' + d.pagination.total + ' 個）')) : null),
    h('div', {class:'foot'}, '盤口欄：建議本金 = 合約買賣各 3 檔折 U 的均值（6 檔合計 ÷ 6）；點差以萬分之一計。🟢 正常　🟡 偏薄或點差偏大　🔴 過薄，不建議做大單。'),
    h('div', {class:'foot'}, '資金費率的毛年化只用最近 7 天的費率計算，近 30 天只用來判斷是否穩定。預計收益 = 本金 ÷ 佔用份數 × (毛年化 × 天數 ÷ 365 − 往返手續費)，U 本位佔 2 份、幣本位佔 1 份；已扣一次性手續費，可能為負；懸停看樂觀口徑。僅供參考，本工具只讀，不下單。'));
  loadLiq(host, sm.principal_amount).catch(() => {});
}
const LIQ = {good:['🟢','充足','good'], warn:['🟡','偏薄','warn'], bad:['🔴','過薄','bad']};
const fK = v => { const n = Number(v); return n >= 1e6 ? (n / 1e6).toFixed(2) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : n.toFixed(0); };
/* 機會表的盤口欄：列表先出來，這一欄單獨取（一次一批，服務端緩存 30 秒） */
async function loadLiq(host, principal){
  const cells = [...host.querySelectorAll('td.liq')], syms = [...new Set(cells.map(c => c.dataset.sym))];
  if (!syms.length) return;
  let r;
  try { r = await api('POST', '/finance/market/liquidity', {symbols:syms.slice(0, 40), principal_amount:String(principal || '1000')}); }
  catch (e) { cells.forEach(c => rc(c, h('span', {class:'sub', title:String(e.message || e)}, '盤口讀取失敗'))); return; }
  const by = {}; (r.list || []).forEach(x => by[x.symbol] = x);
  cells.forEach(c => { const x = by[c.dataset.sym];
    if (!x || x.error) { rc(c, h('span', {class:'sub', title:x ? x.error : ''}, '盤口讀取失敗')); return; }
    const L = LIQ[x.signal] || LIQ.warn;
    c.title = L[1] + '：' + x.signal_note + '\n買盤前 3 檔 ' + fN(x.bid_depth_usd_amount, 0) + ' U（對手盤，開空吃這邊）· 賣盤前 3 檔 ' + fN(x.ask_depth_usd_amount, 0) + ' U\n6 檔合計 ' + fN(x.depth_usd_amount, 0) + ' U ÷ 6 = ' + fN(x.suggest_principal_amount, 0) + ' U';
    rc(c, h('span', {class:'liqmain ' + L[2]}, L[0] + ' ' + fN(x.suggest_principal_amount, 0) + ' U'),
      h('span', {class:'sub hi'}, '點差 ' + Number(x.spread_bps).toFixed(1) + ' 萬'),
      h('span', {class:'sub hi'}, '買3檔 ' + fK(x.bid_depth_usd_amount) + ' · 賣3檔 ' + fK(x.ask_depth_usd_amount)));
  });
}
/* 資金費率：最近一期已結算的費率；期現套利：價差 = 合約買一價 − 現貨指數價 */
function latestCell(o){
  if (o.opportunity_type === 'FUNDING_RATE') {
    if (o.latest_funding_rate === '') return h('td', {class:'n'}, '—');
    const r = Number(o.latest_funding_rate);
    return h('td', {class:'n ' + (r < 0 ? 'down' : ''), title:'最近一期已結算的資金費率，結算於 ' + fT(o.latest_funding_at) + '。正數 = 空頭收，負數 = 空頭付'}, fP(r, 4),
      h('span', {class:'sub'}, '每 ' + o.settle_interval_hours + 'h'));
  }
  const sp = Number(o.spread_amount);
  return h('td', {class:'n ' + (sp < 0 ? 'down' : ''), title:'價差 = 合約買一價 ' + o.futures_price + ' − 現貨指數價 ' + o.index_price + '。正數 = 合約比現貨貴，做空合約到期可以賺到這個差'}, (sp > 0 ? '+' : '') + fN(sp),
    h('span', {class:'sub'}, '基差 ' + fP(o.basis_ratio)), h('span', {class:'sub'}, '合約 ' + fN(o.futures_price)), h('span', {class:'sub'}, '現貨 ' + fN(o.index_price)));
}
function ratesBox(det){
  const st = det.funding_rate_stat, p4 = x => fP(x, 4);
  if (!det.funding_rates || det.funding_rates.length < 2) return h('div', {class:'meta', style:'margin-top:10px'}, '近 30 天資金費率記錄不足，暫無走勢');
  const ch = h('div', {class:'chart rates'});
  const box = h('div', {style:'margin-top:12px'}, h('div', {class:'meta', style:'margin-bottom:2px'}, '近 30 天每期資金費率（已結算，共 ' + st.count + ' 期）· 平均 ' + p4(st.avg_rate) + ' · 最高 ' + p4(st.max_rate) + ' · 最低 ' + p4(st.min_rate) + ' · 為負 ' + st.negative_count + ' 期'), ch);
  // 圖表要等掛到頁面上才知道寬度
  queueMicrotask(() => lineChart(ch, {pts:det.funding_rates.map(r => [Date.parse(r.time), Number(r.rate) * 100]), label:det.symbol + ' 近 30 天每期資金費率', ml:60,
    fmt:v => v.toFixed(3) + '%', tip:'資金費率', tipFmt:v => v.toFixed(4) + '%', refs:[{y:Number(st.avg_rate) * 100, label:'平均 ' + p4(st.avg_rate)}, {y:0, label:''}]}));
  return box;
}
function oppDetail(o){
  const box = h('div', {class:'detgrid', style:'display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:16px'}), left = h('div', {}), top = h('div', {}), rest = h('div', {}), right = h('div', {class:'risk'}, h('b', {}, '風險提示'), h('div', {class:'meta'}, '載入中…'));
  left.append(top, rest);
  box.append(left, right);
  const wrap = h('div', {}, box);
  api('GET', '/finance/opportunities/' + encodeURIComponent(o.symbol)).then(async det => {
    rc(right, h('b', {}, '風險提示'), h('ul', {}, det.risk_notes.map(t => h('li', {}, t))),
      det.positive_ratio ? h('div', {class:'foot'}, '30 天內費率為正的佔比 ' + fP(det.positive_ratio, 0) + '；樣本 ' + det.sample_count + ' 期，跨度 ' + det.span_days + ' 天。') : null);
    right.append(candleBox(o.symbol), lsBox(o.symbol));
    const isFut = o.opportunity_type !== 'FUNDING_RATE';
    rest.append(playbookBox(det.playbook), depthBox(o.symbol, det.playbook.notional_amount));
    const tr = await api('POST', '/finance/opportunities/trend', {symbol:o.symbol, days:30});
    const rates = () => { if (!isFut) top.append(ratesBox(det)); };
    if (tr.points.length < 2) { top.append(h('div', {class:'meta'}, isFut ? '基差歷史由每次行情同步自存（每 8 小時一份），目前只有 ' + tr.points.length + ' 個點，積累到 2 個以上才畫走勢。毛年化 = 基差 ÷ 剩餘天數 × 365；基差取空頭可成交的買一價與現貨指數價。' : '歷史不足，沒有走勢')); rates(); return; }
    top.append(h('div', {class:'meta', style:'margin-bottom:2px'}, isFut ? '基差走勢 · 當時建倉並持有到交割的保守淨年化（虛線 = 定期 / 活期門檻）' : '近 30 天 · 7 日滾動保守淨年化（虛線 = 定期 / 活期門檻）'));
    const ch = h('div', {class:'chart'}); top.append(ch);
    lineChart(ch, {pts:tr.points.map(p => [Date.parse(p.time), Number(p.conservative_apr) * 100]), label:o.symbol + ' 近 30 天保守淨年化',
      refs:[{y:Number(tr.thresholds.fixed_apr) * 100, label:'定期 ' + fP(tr.thresholds.fixed_apr)}, {y:Number(tr.thresholds.cash_apr) * 100, label:'活期 ' + fP(tr.thresholds.cash_apr)}]});
    rates();
  }).catch(e => rc(right, h('b', {}, '風險提示'), h('div', {class:'meta'}, e.message)));
  return wrap;
}
/* ---------- 多空比 ----------
   合約的多頭賬戶 ÷ 空頭賬戶（OKX 公開統計）。柱子 = 多空賬戶各佔多少，白線 = 多空比。 */
const LS_PERIODS = [['5m','5 分鐘'],['15m','15 分鐘'],['1H','1 小時'],['4H','4 小時'],['1D','1 日']];
let lsPeriod = '5m';
try { lsPeriod = localStorage.getItem('lsPeriod') || '5m'; } catch (e) {}
function lsBox(symbol){
  const loaders = [];
  const reloadAll = () => Promise.all(loaders.map(f => f().catch(() => {})));
  // 三张图共用同一个周期：点任意一张的周期按钮，三张一起刷新
  const mk = cfg => {
    const chart = h('div', {class:'chart', style:'min-height:210px'}), note = h('div', {class:'foot'}, '');
    const seg = h('div', {class:'seg'});
    const box = h('div', {style:'margin-top:14px;padding-top:10px;border-top:1px solid var(--border)'},
      h('div', {class:'hd', style:'margin-bottom:4px'}, h('b', {title:cfg.tip}, cfg.title + ' ⓘ'), h('span', {class:'sp'}), seg), chart, note);
    const load = async () => {
      rc(seg, LS_PERIODS.map(([k, v]) => h('button', {type:'button', 'aria-pressed':String(lsPeriod === k), onclick:guard(async () => { lsPeriod = k; try { localStorage.setItem('lsPeriod', k); } catch (e) {} await reloadAll(); })}, v)));
      let d;
      try { d = await api('POST', cfg.path, {symbol:symbol, period:lsPeriod}); }
      catch (e) { rc(chart, h('div', {class:'meta'}, cfg.title + '讀取失敗：' + e.message)); rc(note, null); return; }
      cfg.draw(chart, d);
      rc(note, cfg.note(d));
    };
    loaders.push(load);
    return box;
  };
  const ratioNote = lead => d => { const lr = Number(d.latest_ratio), fr = Number(d.first_ratio);
    return '最新 多頭 ' + fP(d.latest_long_share_ratio, 1) + ' · 空頭 ' + fP(1 - Number(d.latest_long_share_ratio), 1) + ' · 多空比 ' + lr.toFixed(2) + '（區間起點 ' + fr.toFixed(2) + '）。' + lead; };
  const boxes = [
    mk({title:'多空比', path:'/finance/market/long-short', draw:drawLS,
      tip:'多頭賬戶比例 = 淨多頭倉位賬戶 ÷ 總持倉賬戶\n空頭賬戶比例 = 淨空頭倉位賬戶 ÷ 總持倉賬戶\n多空比 = 多頭賬戶比例 ÷ 空頭賬戶比例',
      note:ratioNote('這裡是賬戶數之比，不是持倉量之比；多頭賬戶多時資金費率通常為正（做空套利收費），多空比快速下降說明費率可能走低。')}),
    mk({title:'大戶多空賬戶數比', path:'/finance/market/top-trader-ratio', draw:drawLS,
      tip:'OKX 精英交易員（大戶）的多空賬戶數之比，口徑同上，只統計大戶。\n和上面全市場的多空比對照：兩者方向相反時，說明大戶和散戶在博弈。',
      note:ratioNote('只統計大戶賬戶，不是持倉量；和上面全市場多空比一起看，兩者背離時大戶的方向更值得參考。')}),
    mk({title:'合約主動買賣量', path:'/finance/market/taker-volume', draw:drawTaker,
      tip:'主動買入 = 以賣一價吃單成交的金額；主動賣出 = 以買一價吃單成交的金額，按美元計。\n向上是主動買入、向下是主動賣出，白線是淨主動買入（買 − 賣）。\n最右一根是還沒走完的當前週期，量偏小，顏色較淡。',
      note:d => { const l = d.list[d.list.length - 1], net = Number(l.net_amount);
        return '最新（未走完）主動買入 ' + fU(l.buy_amount) + ' · 主動賣出 ' + fU(l.sell_amount) + ' · 淨' + (net >= 0 ? '買入 ' : '賣出 ') + fU(Math.abs(net)) + ' · 買入佔 ' + fP(l.buy_share_ratio, 1) + '。吃單金額反映誰在追價，不是持倉量；持續淨買入配合多頭賬戶增加，費率才更可能維持為正。'; }})
  ];
  const box = h('div', {}, boxes);
  reloadAll();
  return box;
}
/* 美元金額縮寫：12.3M / 4.56B */
function fU(v){ const x = Math.abs(Number(v)), sg = Number(v) < 0 ? '-' : '';
  if (x >= 1e9) return sg + (x / 1e9).toFixed(2) + 'B'; if (x >= 1e6) return sg + (x / 1e6).toFixed(2) + 'M'; if (x >= 1e3) return sg + (x / 1e3).toFixed(1) + 'K'; return sg + x.toFixed(0); }
function drawTaker(host, d){
  const pts = d.list, W = Math.max(280, host.clientWidth), H = 210, m = {l:46, r:12, t:8, b:22}, pw = W - m.l - m.r, ph = H - m.t - m.b;
  host.innerHTML = '';
  const root = svg('svg', {width:W, height:H, viewBox:`0 0 ${W} ${H}`, role:'img', 'aria-label':'合約主動買賣量'}, host);
  const n = pts.length, bw = pw / n, X = i => m.l + i * bw + bw / 2;
  const mx = Math.max(1, ...pts.map(p => Math.max(Number(p.buy_amount), Number(p.sell_amount), Math.abs(Number(p.net_amount))))) * 1.08;
  const Y = v => m.t + (1 - (v + mx) / (2 * mx)) * ph, y0 = Y(0);
  [-1, -.5, 0, .5, 1].forEach(k => { const v = mx * k; svg('line', {x1:m.l, x2:W - m.r, y1:Y(v), y2:Y(v), stroke:k === 0 ? 'var(--axis)' : 'var(--grid)'}, root); svg('text', {x:m.l - 5, y:Y(v) + 4, 'text-anchor':'end', fill:'var(--muted)', 'font-size':10}, root).textContent = fU(v); });
  const gap = n > 24 ? 0.5 : 2;
  pts.forEach((p, i) => { const x = m.l + i * bw + gap / 2, w = Math.max(1, bw - gap), op = i === n - 1 ? .45 : .85, b = Number(p.buy_amount), s = Number(p.sell_amount);
    svg('rect', {x:x, y:Y(b), width:w, height:Math.max(0, y0 - Y(b)), fill:'var(--good)', opacity:op}, root);
    svg('rect', {x:x, y:y0, width:w, height:Math.max(0, Y(-s) - y0), fill:'var(--bad)', opacity:op}, root); });
  svg('path', {d:pts.map((p, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(Number(p.net_amount)).toFixed(1)).join(''), fill:'none', stroke:'var(--ink)', 'stroke-width':1.6, 'stroke-linejoin':'round'}, root);
  [0, Math.floor((n - 1) / 2), n - 1].forEach((i, k) => { const t = fT(pts[i].time).split(' ')[1] || ''; svg('text', {x:X(i), y:H - 6, 'text-anchor':k === 0 ? 'start' : k === 2 ? 'end' : 'middle', fill:'var(--muted)', 'font-size':10}, root).textContent = lsPeriod === '1D' ? pts[i].time.slice(5, 10) : t; });
  const cross = svg('line', {y1:m.t, y2:m.t + ph, stroke:'var(--axis)', visibility:'hidden'}, root);
  const tip = h('div', {class:'tip', style:'display:none'}); host.append(tip);
  const hit = svg('rect', {x:m.l, y:m.t, width:pw, height:ph, fill:'transparent', style:'cursor:crosshair'}, root);
  hit.addEventListener('pointermove', ev => { const r = hit.getBoundingClientRect(), i = Math.max(0, Math.min(n - 1, Math.floor((ev.clientX - r.left) / r.width * n))), p = pts[i], net = Number(p.net_amount);
    cross.setAttribute('x1', X(i)); cross.setAttribute('x2', X(i)); cross.setAttribute('visibility', 'visible');
    rc(tip, h('div', {class:'t'}, fT(p.time) + (i === n - 1 ? '（未走完）' : '')),
      h('div', {class:'r'}, h('span', {class:'k', style:'background:var(--good)'}), '主動買入', h('span', {class:'val'}, fU(p.buy_amount))),
      h('div', {class:'r'}, h('span', {class:'k', style:'background:var(--bad)'}), '主動賣出', h('span', {class:'val'}, fU(p.sell_amount))),
      h('div', {class:'r'}, h('span', {class:'k', style:'background:var(--ink)'}), net >= 0 ? '淨買入' : '淨賣出', h('span', {class:'val'}, fU(Math.abs(net)))),
      h('div', {class:'r'}, h('span', {class:'k', style:'background:transparent'}), '買入佔', h('span', {class:'val'}, fP(p.buy_share_ratio, 1))));
    tip.style.display = 'block'; const l = X(i) + 12 + tip.offsetWidth > W ? X(i) - 12 - tip.offsetWidth : X(i) + 12; tip.style.left = Math.max(0, l) + 'px'; tip.style.top = '4px'; });
  hit.addEventListener('pointerleave', () => { cross.setAttribute('visibility', 'hidden'); tip.style.display = 'none'; });
}
function drawLS(host, d){
  const pts = d.list, W = Math.max(280, host.clientWidth), H = 210, m = {l:38, r:40, t:8, b:22}, pw = W - m.l - m.r, ph = H - m.t - m.b;
  host.innerHTML = '';
  const root = svg('svg', {width:W, height:H, viewBox:`0 0 ${W} ${H}`, role:'img', 'aria-label':'多空比'}, host);
  const n = pts.length, bw = pw / n, X = i => m.l + i * bw + bw / 2, Y = v => m.t + (1 - v) * ph;
  [0, .2, .4, .6, .8, 1].forEach(v => { svg('line', {x1:m.l, x2:W - m.r, y1:Y(v), y2:Y(v), stroke:'var(--grid)'}, root); svg('text', {x:m.l - 5, y:Y(v) + 4, 'text-anchor':'end', fill:'var(--muted)', 'font-size':10}, root).textContent = Math.round(v * 100) + '%'; });
  const gap = n > 24 ? 0.5 : 2;
  pts.forEach((p, i) => { const l = Number(p.long_share_ratio), x = m.l + i * bw + gap / 2, w = Math.max(1, bw - gap);
    svg('rect', {x:x, y:Y(l), width:w, height:Y(0) - Y(l), fill:'var(--good)', opacity:.85}, root);
    svg('rect', {x:x, y:Y(1), width:w, height:Y(l) - Y(1), fill:'var(--bad)', opacity:.85}, root); });
  const rs = pts.map(p => Number(p.ratio)), lo = Math.min(...rs), hi = Math.max(...rs), pad = (hi - lo) * .15 || hi * .05 || .1, r0 = Math.max(0, lo - pad), r1 = hi + pad;
  const RY = v => m.t + (1 - (v - r0) / (r1 - r0 || 1)) * ph;
  svg('path', {d:rs.map((v, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + RY(v).toFixed(1)).join(''), fill:'none', stroke:'var(--ink)', 'stroke-width':1.8, 'stroke-linejoin':'round'}, root);
  [0, 1, 2, 3].forEach(k => { const v = r0 + (r1 - r0) * k / 3; svg('text', {x:W - m.r + 5, y:RY(v) + 4, fill:'var(--muted)', 'font-size':10}, root).textContent = v.toFixed(2); });
  [0, Math.floor((n - 1) / 2), n - 1].forEach((i, k) => { const t = fT(pts[i].time).split(' ')[1] || ''; svg('text', {x:X(i), y:H - 6, 'text-anchor':k === 0 ? 'start' : k === 2 ? 'end' : 'middle', fill:'var(--muted)', 'font-size':10}, root).textContent = lsPeriod === '1D' ? pts[i].time.slice(5, 10) : t; });
  const cross = svg('line', {y1:m.t, y2:m.t + ph, stroke:'var(--axis)', visibility:'hidden'}, root);
  const tip = h('div', {class:'tip', style:'display:none'}); host.append(tip);
  const hit = svg('rect', {x:m.l, y:m.t, width:pw, height:ph, fill:'transparent', style:'cursor:crosshair'}, root);
  hit.addEventListener('pointermove', ev => { const r = hit.getBoundingClientRect(), i = Math.max(0, Math.min(n - 1, Math.floor((ev.clientX - r.left) / r.width * n))), p = pts[i];
    cross.setAttribute('x1', X(i)); cross.setAttribute('x2', X(i)); cross.setAttribute('visibility', 'visible');
    rc(tip, h('div', {class:'t'}, fT(p.time)), h('div', {class:'r'}, h('span', {class:'k', style:'background:var(--good)'}), '多頭', h('span', {class:'val'}, fP(p.long_share_ratio, 2))),
      h('div', {class:'r'}, h('span', {class:'k', style:'background:var(--bad)'}), '空頭', h('span', {class:'val'}, fP(p.short_share_ratio, 2))),
      h('div', {class:'r'}, h('span', {class:'k', style:'background:var(--ink)'}), '多空比', h('span', {class:'val'}, Number(p.ratio).toFixed(2))));
    tip.style.display = 'block'; const l = X(i) + 12 + tip.offsetWidth > W ? X(i) - 12 - tip.offsetWidth : X(i) + 12; tip.style.left = Math.max(0, l) + 'px'; tip.style.top = '4px'; });
  hit.addEventListener('pointerleave', () => { cross.setAttribute('visibility', 'hidden'); tip.style.display = 'none'; });
}
/* ---------- K 線 ----------
   機會詳情右欄：合約、現貨各一張蜡燭圖，最近 500 根，週期 1 分鐘 / 4 小時 / 1 日，兩張共用同一個週期。
   公開行情，不需要憑證；上漲綠、下跌紅（和本頁其他圖一致）。 */
const CANDLE_BARS = [['1m','1 分鐘'],['4H','4 小時'],['1D','1 日']];
let candleBar = '1m';
try { candleBar = localStorage.getItem('candleBar') || '1m'; } catch (e) {}
if (!CANDLE_BARS.some(b => b[0] === candleBar)) candleBar = '1m';
let candleView = 'merged'; // merged = 合併對比，split = 分開
// Demo always opens in comparison mode; a previous review's split state must
// not change the next visitor's initial presentation. Switching still works in-page.
function candleBox(symbol){
  const seg = h('div', {class:'seg'}), vseg = h('div', {class:'seg'}), body = h('div', {}, h('div', {class:'meta'}, '載入中…'));
  let seq = 0;
  const load = async () => {
    const my = ++seq;
    rc(vseg, [['merged', '合併'], ['split', '分開']].map(([k, v]) => h('button', {type:'button', 'aria-pressed':String(candleView === k), onclick:guard(async () => { candleView = k; await load(); })}, v)));
    rc(seg, CANDLE_BARS.map(([k, v]) => h('button', {type:'button', 'aria-pressed':String(candleBar === k), onclick:guard(async () => { candleBar = k; try { localStorage.setItem('candleBar', k); } catch (e) {} await load(); })}, v)));
    let d;
    try { d = await api('POST', '/finance/market/candles', {symbol:symbol, bar:candleBar}); }
    catch (e) { if (my === seq) rc(body, h('div', {class:'meta down'}, 'K 線讀取失敗：' + e.message)); return; }
    if (my !== seq) return; // 連點切換週期時只認最後一次
    const cs = d.series.find(x => x.kind === 'CONTRACT'), sp = d.series.find(x => x.kind === 'SPOT');
    if (candleView === 'merged' && cs && sp) {
      const host = h('div', {class:'chart', style:'min-height:300px'});
      queueMicrotask(() => drawMerged(host, cs, sp));
      rc(body, h('div', {style:'margin-top:8px'}, host), (d.warnings || []).length ? h('div', {class:'meta down'}, d.warnings.join('；')) : null);
      return;
    }
    const parts = d.series.map(s => {
      const host = h('div', {class:'chart', style:'min-height:190px'});
      const last = s.list[s.list.length - 1];
      queueMicrotask(() => drawCandles(host, s));
      return h('div', {style:'margin-top:8px'},
        h('div', {class:'hd', style:'margin-bottom:2px'}, h('b', {}, s.kind === 'SPOT' ? '現貨' : '合約'), h('span', {class:'sub'}, ' ' + s.inst_id + ' · ' + (/-USD-/.test(s.inst_id) ? 'USD 計價' : 'USDT 計價')),
          h('span', {class:'sp'}), h('span', {class:'sub'}, '最新 ' + candlePx(Number(last.close)) + ' · 共 ' + s.list.length + ' 根')),
        host);
    });
    rc(body, ...parts, (d.warnings || []).length ? h('div', {class:'meta down'}, d.warnings.join('；')) : null);
  };
  load();
  return h('div', {style:'margin-top:14px;padding-top:10px;border-top:1px solid var(--border)'},
    h('div', {class:'hd', style:'margin-bottom:2px'}, h('b', {title:'合約與現貨各取最近 500 根 K 線。\n幣本位合約按 USD 計價、現貨按 USDT 計價，兩者本身會有 USDT-USD 匯率造成的小差距。\n最右一根是還沒走完的當前週期。'}, 'K 線 ⓘ'), h('span', {class:'sp'}), vseg, h('span', {style:'width:6px'}), seg),
    body);
}
function candlePx(v){ return v >= 1000 ? v.toFixed(2) : v >= 1 ? v.toFixed(4) : Number(v.toPrecision(4)).toString(); }
/* 合併對比：合約、現貨收盤價畫在同一張圖上，下面一張是價差（萬分比 = (合約 − 現貨) ÷ 現貨 × 10000）。
   只對齊兩邊都有的時間點。幣本位合約是 USD 計價、現貨是 USDT 計價，所以價差裡含 USDT-USD 匯率造成的固定偏移。 */
function drawMerged(host, cs, sp){
  const sm = new Map(sp.list.map(p => [p.time, Number(p.close)]));
  const pts = cs.list.filter(p => sm.has(p.time)).map(p => { const c = Number(p.close), s = sm.get(p.time); return {t:p.time, c:c, s:s, bp:(c - s) / s * 1e4}; });
  const n = pts.length;
  if (n < 2) { rc(host, h('div', {class:'meta'}, '合約與現貨沒有可對齊的 K 線')); return; }
  const W = Math.max(280, host.clientWidth), H = 300, m = {l:6, r:58, t:8, b:22}, pw = W - m.l - m.r, H1 = 170, g = 22, H2 = H - m.t - m.b - H1 - g;
  host.innerHTML = '';
  const root = svg('svg', {width:W, height:H, viewBox:`0 0 ${W} ${H}`, role:'img', 'aria-label':'合約與現貨 K 線合併對比 ' + cs.inst_id}, host);
  const X = i => m.l + (i + .5) * pw / n;
  const lo0 = Math.min(...pts.map(p => Math.min(p.c, p.s))), hi0 = Math.max(...pts.map(p => Math.max(p.c, p.s))), pad = (hi0 - lo0) * .04 || hi0 * .01, lo = lo0 - pad, hi = hi0 + pad;
  const Y = v => m.t + (1 - (v - lo) / (hi - lo)) * H1;
  [0, 1, 2, 3, 4].forEach(k => { const v = lo + (hi - lo) * k / 4; svg('line', {x1:m.l, x2:W - m.r, y1:Y(v), y2:Y(v), stroke:'var(--grid)'}, root); svg('text', {x:W - m.r + 5, y:Y(v) + 4, fill:'var(--muted)', 'font-size':10}, root).textContent = candlePx(v); });
  const line = (key, col) => svg('path', {d:pts.map((p, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(p[key]).toFixed(1)).join(''), fill:'none', stroke:col, 'stroke-width':1.3, 'stroke-linejoin':'round'}, root);
  line('s', 'var(--s2)'); line('c', 'var(--s1)');
  // 價差面板：以 0 為中線，柱子正 = 合約比現貨貴
  const bps = pts.map(p => p.bp), mean = bps.reduce((a, b) => a + b, 0) / n, bmx = Math.max(1, ...bps.map(Math.abs)) * 1.1, y2 = m.t + H1 + g, B = v => y2 + (1 - (v + bmx) / (2 * bmx)) * H2;
  [-1, 0, 1].forEach(k => { const v = bmx * k; svg('line', {x1:m.l, x2:W - m.r, y1:B(v), y2:B(v), stroke:k === 0 ? 'var(--axis)' : 'var(--grid)'}, root); svg('text', {x:W - m.r + 5, y:B(v) + 4, fill:'var(--muted)', 'font-size':10}, root).textContent = v.toFixed(1); });
  const bw = Math.max(1, pw / n - (pw / n > 3 ? 1 : 0)); let up = '', dn = '';
  pts.forEach((p, i) => { const a = B(0), b = B(p.bp), seg = 'M' + (X(i) - bw / 2).toFixed(1) + ' ' + Math.min(a, b).toFixed(1) + 'h' + bw.toFixed(1) + 'v' + Math.max(.6, Math.abs(a - b)).toFixed(1) + 'h' + (-bw).toFixed(1) + 'Z'; if (p.bp >= 0) up += seg; else dn += seg; });
  if (up) svg('path', {d:up, fill:'var(--good)', opacity:.85}, root);
  if (dn) svg('path', {d:dn, fill:'var(--bad)', opacity:.85}, root);
  svg('line', {x1:m.l, x2:W - m.r, y1:B(mean), y2:B(mean), stroke:'var(--ink)', 'stroke-dasharray':'3 3'}, root);
  svg('text', {x:m.l + 2, y:y2 - 5, fill:'var(--muted)', 'font-size':10}, root).textContent = '價差（萬分比）· 平均 ' + mean.toFixed(1) + ' · 最新 ' + bps[n - 1].toFixed(1) + ' · 最大 ' + Math.max(...bps).toFixed(1) + ' · 最小 ' + Math.min(...bps).toFixed(1);
  const fmtT = t => candleBar === '1D' ? t.slice(5, 10) : t.slice(5, 10) + ' ' + t.slice(11, 16);
  [0, Math.floor((n - 1) / 2), n - 1].forEach((i, k) => svg('text', {x:Math.max(m.l, Math.min(W - m.r, X(i))), y:H - 6, 'text-anchor':k === 0 ? 'start' : k === 2 ? 'end' : 'middle', fill:'var(--muted)', 'font-size':10}, root).textContent = fmtT(pts[i].t));
  // 圖例
  svg('rect', {x:m.l + 2, y:m.t + 2, width:10, height:3, fill:'var(--s1)'}, root); svg('text', {x:m.l + 16, y:m.t + 7, fill:'var(--ink2)', 'font-size':10}, root).textContent = '合約 ' + cs.inst_id + (/-USD-/.test(cs.inst_id) ? '（USD）' : '');
  svg('rect', {x:m.l + 2, y:m.t + 14, width:10, height:3, fill:'var(--s2)'}, root); svg('text', {x:m.l + 16, y:m.t + 19, fill:'var(--ink2)', 'font-size':10}, root).textContent = '現貨 ' + sp.inst_id + '（USDT）';
  const cross = svg('line', {y1:m.t, y2:y2 + H2, stroke:'var(--axis)', visibility:'hidden'}, root);
  const tip = h('div', {class:'tip', style:'display:none'}); host.append(tip);
  const hit = svg('rect', {x:m.l, y:m.t, width:pw, height:y2 + H2 - m.t, fill:'transparent', style:'cursor:crosshair'}, root);
  hit.addEventListener('pointermove', ev => { const r = hit.getBoundingClientRect(), i = Math.max(0, Math.min(n - 1, Math.floor((ev.clientX - r.left) / r.width * n))), p = pts[i];
    cross.setAttribute('x1', X(i)); cross.setAttribute('x2', X(i)); cross.setAttribute('visibility', 'visible');
    const row = (k, v, c) => h('div', {class:'r'}, h('span', {class:'k', style:'background:' + (c || 'transparent')}), k, h('span', {class:'val'}, v));
    rc(tip, h('div', {class:'t'}, fT(p.t)), row('合約', candlePx(p.c), 'var(--s1)'), row('現貨', candlePx(p.s), 'var(--s2)'), row('價差', (p.bp >= 0 ? '+' : '') + p.bp.toFixed(1) + ' 萬分比', p.bp >= 0 ? 'var(--good)' : 'var(--bad)'));
    tip.style.display = 'block'; const l = X(i) + 12 + tip.offsetWidth > W ? X(i) - 12 - tip.offsetWidth : X(i) + 12; tip.style.left = Math.max(0, l) + 'px'; tip.style.top = '4px'; });
  hit.addEventListener('pointerleave', () => { cross.setAttribute('visibility', 'hidden'); tip.style.display = 'none'; });
}
function drawCandles(host, s){
  const pts = s.list.map(p => ({t:p.time, o:Number(p.open), h:Number(p.high), l:Number(p.low), c:Number(p.close), v:Number(p.volume), done:p.is_confirmed}));
  const n = pts.length, W = Math.max(280, host.clientWidth), H = 190, m = {l:6, r:58, t:8, b:22}, pw = W - m.l - m.r, ph = H - m.t - m.b;
  host.innerHTML = '';
  const root = svg('svg', {width:W, height:H, viewBox:`0 0 ${W} ${H}`, role:'img', 'aria-label':(s.kind === 'SPOT' ? '現貨' : '合約') + ' K 線 ' + s.inst_id}, host);
  const lo0 = Math.min(...pts.map(p => p.l)), hi0 = Math.max(...pts.map(p => p.h)), pad = (hi0 - lo0) * .04 || hi0 * .01, lo = lo0 - pad, hi = hi0 + pad;
  const bw = pw / n, X = i => m.l + i * bw + bw / 2, Y = v => m.t + (1 - (v - lo) / (hi - lo)) * ph;
  [0, 1, 2, 3, 4].forEach(k => { const v = lo + (hi - lo) * k / 4; svg('line', {x1:m.l, x2:W - m.r, y1:Y(v), y2:Y(v), stroke:'var(--grid)'}, root); svg('text', {x:W - m.r + 5, y:Y(v) + 4, fill:'var(--muted)', 'font-size':10}, root).textContent = candlePx(v); });
  const wick = {up:'', dn:''}, body = {up:'', dn:''}, w = Math.max(1, bw - (bw > 3 ? 1 : 0)), f = x => x.toFixed(1);
  pts.forEach((p, i) => { const k = p.c >= p.o ? 'up' : 'dn', x = X(i), yo = Y(p.o), yc = Y(p.c);
    wick[k] += 'M' + f(x) + ' ' + f(Y(p.h)) + 'V' + f(Y(p.l));
    body[k] += 'M' + f(x - w / 2) + ' ' + f(Math.min(yo, yc)) + 'h' + f(w) + 'v' + f(Math.max(1, Math.abs(yo - yc))) + 'h' + f(-w) + 'Z'; });
  [['up', 'var(--good)'], ['dn', 'var(--bad)']].forEach(([k, col]) => {
    if (wick[k]) svg('path', {d:wick[k], stroke:col, 'stroke-width':1, fill:'none'}, root);
    if (body[k]) svg('path', {d:body[k], fill:col, stroke:col, 'stroke-width':.3}, root); });
  const last = pts[n - 1], ly = Y(last.c);
  svg('line', {x1:m.l, x2:W - m.r, y1:ly, y2:ly, stroke:last.c >= last.o ? 'var(--good)' : 'var(--bad)', 'stroke-dasharray':'3 3', opacity:.8}, root);
  svg('rect', {x:W - m.r + 1, y:ly - 8, width:m.r - 2, height:16, rx:3, fill:last.c >= last.o ? 'var(--good)' : 'var(--bad)'}, root);
  svg('text', {x:W - m.r + 5, y:ly + 4, fill:'#fff', 'font-size':10}, root).textContent = candlePx(last.c);
  const fmtT = t => candleBar === '1D' ? t.slice(5, 10) : t.slice(5, 10) + ' ' + t.slice(11, 16);
  [0, Math.floor((n - 1) / 2), n - 1].forEach((i, k) => svg('text', {x:Math.max(m.l, Math.min(W - m.r, X(i))), y:H - 6, 'text-anchor':k === 0 ? 'start' : k === 2 ? 'end' : 'middle', fill:'var(--muted)', 'font-size':10}, root).textContent = fmtT(pts[i].t));
  const cross = svg('line', {y1:m.t, y2:m.t + ph, stroke:'var(--axis)', visibility:'hidden'}, root);
  const tip = h('div', {class:'tip', style:'display:none'}); host.append(tip);
  const hit = svg('rect', {x:m.l, y:m.t, width:pw, height:ph, fill:'transparent', style:'cursor:crosshair'}, root);
  hit.addEventListener('pointermove', ev => { const r = hit.getBoundingClientRect(), i = Math.max(0, Math.min(n - 1, Math.floor((ev.clientX - r.left) / r.width * n))), p = pts[i], chg = (p.c - p.o) / p.o, col = p.c >= p.o ? 'var(--good)' : 'var(--bad)';
    cross.setAttribute('x1', X(i)); cross.setAttribute('x2', X(i)); cross.setAttribute('visibility', 'visible');
    const row = (k, v, c) => h('div', {class:'r'}, h('span', {class:'k', style:'background:' + (c || 'transparent')}), k, h('span', {class:'val'}, v));
    rc(tip, h('div', {class:'t'}, fT(p.t) + (p.done ? '' : '（未走完）')), row('開', candlePx(p.o)), row('高', candlePx(p.h)), row('低', candlePx(p.l)), row('收', candlePx(p.c), col),
      row('漲跌', (chg >= 0 ? '+' : '') + (chg * 100).toFixed(2) + '%'), row('量', fU(p.v)));
    tip.style.display = 'block'; const l = X(i) + 12 + tip.offsetWidth > W ? X(i) - 12 - tip.offsetWidth : X(i) + 12; tip.style.left = Math.max(0, l) + 'px'; tip.style.top = '4px'; });
  hit.addEventListener('pointerleave', () => { cross.setAttribute('visibility', 'hidden'); tip.style.display = 'none'; });
}
/* ---------- 盤口深度 ----------
   機會詳情展開時顯示：買賣各 200 檔、每檔的量與 U 估值，以及「拿本金去吃能吃下多少」。
   開著的時候每 5 秒刷一次（走公開行情接口，不需要憑證、不會下單）；收起來就停。 */
const DEPTH_REFRESH = 5000;
let depthTimer = null;
function stopDepth(){ if (depthTimer) { clearInterval(depthTimer); depthTimer = null; } }
function depthBox(symbol, principal){
  const amt = h('input', {type:'number', min:'1', step:'100', value:String(Math.round(Number(principal) || 1000)), 'aria-label':'本金 (USDT)', style:'width:110px'});
  const body = h('div', {}, h('div', {class:'meta'}, '載入中…'));
  const stamp = h('span', {class:'meta'}, '');
  const eatLine = (b, side) => {
    const e = side === 'ask' ? b.eat_ask : b.eat_bid, n = Number(e.qty);
    if (!e.is_enough) return h('div', {class:'down'}, '前 ' + (side === 'ask' ? b.ask_count : b.bid_count) + ' 檔只夠吃 ' + fN(e.usd_amount) + ' U（' + n.toLocaleString('en-US', {maximumFractionDigits:6}) + ' ' + b.unit + '），本金吃不完');
    return h('div', {}, h('b', {}, n.toLocaleString('en-US', {maximumFractionDigits:6}) + ' ' + b.unit),
      h('span', {class:'sub'}, ' · 均價 ' + Number(e.avg_price).toLocaleString('en-US', {maximumFractionDigits:8})
        + ' · 滑點 ' + fP(e.slippage_ratio, 3) + ' · 吃掉 ' + e.level_count + ' 檔'));
  };
  const DEPTH_ROWS = 14;
  const fmtPx = x => Number(x).toLocaleString('en-US', {maximumFractionDigits:8});
  // 一本盤口畫成一列（和 OKX 一樣）：賣盤在上、價格由高到低，中間是最新價，買盤在下。
  // 累計 U 還在本金以內的檔位用深色標出（會被吃掉的部分），剛好跨過本金的那一檔畫虛線並標上本金數。
  const book = (b, amount) => {
    const asks = b.asks.slice(0, DEPTH_ROWS), bids = b.bids.slice(0, DEPTH_ROWS);
    const maxCum = Math.max(1, ...asks.map(l => Number(l.cum_usd_amount)), ...bids.map(l => Number(l.cum_usd_amount)));
    const edgeIdx = rows => rows.findIndex(l => Number(l.cum_usd_amount) >= amount);
    const mk = (l, side, isEdge) => {
      const cum = Number(l.cum_usd_amount), inside = Number(l.cum_usd_amount) - Number(l.usd_amount) < amount;
      return h('tr', {class:side + (inside ? ' in' : '') + (isEdge ? ' edge' : ''), style:'--w:' + (cum / maxCum * 100).toFixed(1) + '%'},
        h('td', {class:side === 'ask' ? 'down' : 'up'}, fmtPx(l.price)),
        h('td', {}, Number(l.qty).toLocaleString('en-US', {maximumFractionDigits:6})),
        h('td', {}, fN(l.usd_amount, 0)),
        h('td', {}, fN(l.cum_usd_amount, 0)),
        h('td', {class:'dpmark'}, isEdge ? '◂ ' + fN(amount, 0) + ' U' : ''));
    };
    const ae = edgeIdx(asks), be = edgeIdx(bids);
    const askRows = asks.map((l, i) => mk(l, 'ask', i === ae)).reverse();
    const bidRows = bids.map((l, i) => mk(l, 'bid', i === be));
    let mid = null;
    if (asks.length && bids.length) {
      const a0 = Number(asks[0].price), b0 = Number(bids[0].price);
      mid = h('tr', {class:'mid'}, h('td', {colspan:5}, fmtPx((a0 + b0) / 2), h('span', {class:'sub'}, '  價差 ' + fP((a0 - b0) / ((a0 + b0) / 2), 3))));
    }
    const head = h('thead', {}, h('tr', {}, ['價格', '量 (' + b.unit + ')', '本檔 U', '累計 U', ''].map(t => h('th', {}, t))));
    return h('div', {class:'scroll'}, h('table', {class:'dpv'}, head,
      h('tbody', {}, asks.length || bids.length ? [askRows, mid, bidRows] : h('tr', {}, h('td', {colspan:5, class:'todo'}, '沒有檔位')))));
  };
  const load = async () => {
    try {
      const d = await api('POST', '/finance/market/depth', {inst_id:symbol, amount_usdt:String(amt.value || 1000)});
      rc(stamp, ' · 本地快照 · 買賣各取 ' + d.level_limit + ' 檔');
      const amount = Number(d.amount_usdt) || Number(amt.value) || 1000;
      rc(body, h('div', {class:'dplegend'}, h('span', {class:'sub'}, '深色 = 前 ' + fN(amount, 0) + ' U 會吃掉的檔位，虛線 = 本金剛好吃完的那一檔')),
        h('div', {class:'dpbooks'}, d.books.map(b => h('div', {class:'dpcol'},
        h('div', {class:'dphd'}, h('b', {}, b.inst_id), h('span', {class:'sub'}, b.kind === 'SPOT' ? '現貨' : (b.ct_val_ccy && /^US/.test(b.ct_val_ccy) ? '幣本位 · 一張 ' + b.ct_val + ' ' + b.ct_val_ccy : '合約 · 一張 ' + b.ct_val + ' 幣')),
          h('span', {class:'sub'}, ' · 盤口 ' + (fT(b.quoted_at).split(' ')[1] || ''))),
        h('div', {class:'dpeat'}, h('span', {class:'sub'}, b.note.includes('賣盤') ? '本金能買到' : '本金能開空'), eatLine(b, b.note.includes('賣盤') ? 'ask' : 'bid')),
        h('div', {class:'meta'}, '賣盤 ' + b.ask_count + ' 檔合計 ' + fN(b.total_ask_usd_amount, 0) + ' U · 買盤 ' + b.bid_count + ' 檔合計 ' + fN(b.total_bid_usd_amount, 0) + ' U'),
        book(b, amount)))),
        (d.warnings || []).length ? h('div', {class:'meta down'}, d.warnings.join('；')) : null);
    } catch (e) { rc(body, h('div', {class:'meta down'}, '讀不到盤口：' + e.message)); }
  };
  amt.addEventListener('change', () => { load(); });
  stopDepth(); load();
  return h('div', {class:'risk', style:'margin-top:12px'},
    h('div', {class:'hd'}, h('b', {}, '盤口深度'), h('span', {class:'sp'}), h('span', {class:'sub'}, '本金'), amt, h('span', {class:'sub'}, 'USDT')),
    h('div', {class:'meta', style:'margin:2px 0 6px'}, '開倉是「買現貨吃賣盤 + 開空單吃買盤」，下面按這個方向算。只看盤口，不下單。', stamp),
    body);
}
function playbookBox(pb){
  const pc = x => fP(x, 3), u = x => Number(x).toFixed(3) + ' U', alt = pb.alternative_exit;
  const row = (no, s, cls) => h('tr', cls ? {class:cls} : {}, h('td', {class:'n'}, no), h('td', {}, s.action), h('td', {}, s.fee_ratio === '' ? '無手續費' : s.fee_name),
    h('td', {class:'n'}, s.fee_ratio === '' ? '—' : pc(s.fee_ratio)), h('td', {class:'n'}, s.fee_ratio === '' ? '—' : u(s.fee_amount)));
  const total = (label, r, a) => h('tr', {style:'font-weight:650'}, h('td', {}), h('td', {colspan:2}, label), h('td', {class:'n'}, pc(r)), h('td', {class:'n'}, u(a)));
  const body = [];
  pb.steps.forEach(s => { body.push(row(s.step_no, s)); if (alt && alt.step_no === s.step_no) body.push(row('或', alt, 'alt')); });
  body.push(total(alt ? '合計（被動交割，表中收益按這個算）' : '合計', pb.total_fee_ratio, pb.total_fee_amount));
  if (alt) body.push(total('合計（' + alt.exit_name + '）', alt.total_fee_ratio, alt.total_fee_amount));
  return h('div', {class:'risk', style:'margin-top:12px'}, h('b', {}, '套利方式：' + pb.method_name), h('div', {class:'meta', style:'margin:2px 0 4px'}, pb.summary),
    h('div', {class:'pbwrap'}, h('table', {class:'pb'}, h('thead', {}, h('tr', {}, h('th', {class:'n'}, '步驟'), h('th', {}, '操作'), h('th', {}, '手續費類型'), h('th', {class:'n'}, '費率'), h('th', {class:'n'}, '金額（名義 ' + fN(pb.notional_amount, 0) + ' U）'))),
      h('tbody', {}, body))),
    alt ? h('div', {class:'meta', style:'margin-top:4px'}, alt.exit_name + '：' + alt.note + '。') : null,
    h('ul', {style:'margin:4px 0 0;padding-left:16px;line-height:1.45'}, pb.notes.map(t => h('li', {}, t))));
}


QuantDemo.ready.then(()=>loadOpps()).catch(error=>say('快照載入失敗：'+error.message));
window.addEventListener('pagehide',stopDepth);

