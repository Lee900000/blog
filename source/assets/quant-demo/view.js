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
/* ---------- 量化机会 ---------- */
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
      rc(tip, h('div', {class:'t'}, dFull(p[0])), h('div', {class:'r'}, h('span', {class:'k', style:'background:var(--s1)'}), o.tip || '保守净年化', h('span', {class:'val'}, tipFmt(p[1]))));
      tip.style.display = 'block'; const l = X(p[0]) + 12 + tip.offsetWidth > W ? X(p[0]) - 12 - tip.offsetWidth : X(p[0]) + 12; tip.style.left = Math.max(0, l) + 'px'; tip.style.top = '4px';
    });
    hit.addEventListener('pointerleave', () => { cross.setAttribute('visibility', 'hidden'); dot.setAttribute('visibility', 'hidden'); tip.style.display = 'none'; });
  };
  draw(); new ResizeObserver(() => { clearTimeout(host._t); host._t = setTimeout(draw, 80); }).observe(host);
}

const OTYPE = {FUNDING_RATE:'资金费率', DELIVERY_BASIS:'期现套利'};
const VERDICT = {BEAT_FIXED:['✓ 超过定期','good'], BEAT_CASH:['✓ 超过活期','good'], DEPENDS_MARGIN_MODE:['△ 视保证金模式','warn'], NOT_BEAT:['✗ 未超过','bad'], NOT_HEDGEABLE:['无现货 · 不可对冲',''], NEW_LISTING:['新上线 · 观察中','warn']};
const RISK = {LOW:['风险 低','good'], MEDIUM:['风险 中','warn'], HIGH:['风险 高','bad']};
const HZ = [1, 7, 15, 30, 60, 90];
const OCOLS = [['opportunity_type','类型'],['symbol','标的'],['latest_funding_rate','最近费率 / 价差','n'],['volume_amount','24h 成交额 (M$)','n'],['_liq','盘口 · 建议本金','n'],['gross_apr','毛年化（近 7 天）','n'],['conservative_apr','净年化 保守 ~ 乐观','n'],
  ['worst_funding_rate','最大回撤 · 30 天最差费率','n'],['verdict_rank','对比门槛'],['sustain_ratio','持续度','n'], ['break_even_days','回本天数','n'], ['risk_level','风险']];
/* 1~60 日收益有两种口径：预测 = 按近 7 天费率往后推；回测 = 按过去 N 天实际已结算的费率算（本地历史只有约 70 天，所以回测不做 90 日） */
const BT_HZ = [1, 7, 15, 30, 60];
let oppMode = 'forecast';
try { oppMode = localStorage.getItem('oppProfitMode') === 'backtest' ? 'backtest' : 'forecast'; } catch (e) {}
const profitHz = mode => mode === 'backtest' ? BT_HZ : HZ;
const profitKey = (d, mode) => (mode === 'backtest' ? 'backtest_' : 'profit_') + d + 'd';
const BT_TIP = '回测：假设 N 天前开仓、一直持有到现在，收益 = 这段时间每一期实际已结算的资金费率之和 − 来回手续费，再乘名义价值（U 本位按本金的一半）。费率为负的期数会倒扣。\n本地费率历史不够 N 天、或缺的期数太多时显示「—」，不拿少的天数凑数。期现套利没有资金费率，不回测。';
/* 机会列表表头的白话说明（鼠标放上去看）。回测列另有说明 BT_TIP */
const OTIPS = {
  opportunity_type:'这一行是哪种套利，和占用几份资金。\n资金费率套利：买现货 + 空永续，收资金费。期现套利：买现货 + 空交割合约，到交割日收价差。\nU 本位占 2 份资金（现货和合约保证金各一份），币本位占 1 份（买到的币直接当保证金）。',
  symbol:'合约名称。点这一行展开详情：风险提示、K 线、盘口深度、开仓步骤和费用。\n下面的小字：资金费每多少小时结算一次，或离交割还剩几天。',
  latest_funding_rate:'资金费率套利：最近一期已结算的资金费率，正数 = 空头收钱，负数 = 空头倒付。\n期现套利：价差 = 合约买一价 − 现货指数价，正数 = 合约比现货贵，到交割日这个差会收敛成你的收益。',
  volume_amount:'最近 24 小时的成交额（百万美元）。越小，买卖价差和滑点越大，开平仓越吃亏。',
  gross_apr:'毛年化 = 资金费率折成一年能收多少，还没扣任何成本。只用最近 7 天的平均费率；下面小字是近 30 天的，用来判断稳不稳。\n期现套利则是 基差 ÷ 剩余天数 × 365。',
  conservative_apr:'净年化 = 毛年化扣掉来回手续费后，一年能赚多少。\n保守 = 乐观 ÷ 2（U 本位要占 2 份资金，所以收益按一半本金算）；乐观 = 按全部本金算。币本位只占 1 份，所以只有一个数；小字是每天把收到的币复投的复利年化。',
  worst_funding_rate:'近 30 天里单期最差的一次资金费率。负数 = 那一期空头要倒付钱。\n下面小字：如果碰上这一期，按你的本金每期会亏多少 U。',
  verdict_rank:'净年化和你设的门槛比：超过定期 = 比买定期理财划算；超过活期 = 只比活期划算；未超过 = 不如存着。门槛在「参数设置」里改。',
  sustain_ratio:'持续度：近 30 天每天滚动算一次保守净年化，有多少天是超过定期门槛的。越高，说明这个收益越稳定，不是一两天的偶然高。',
  break_even_days:'回本天数 = 来回手续费 ÷ 每天的毛收益。要持有这么多天，资金费才把开仓的手续费赚回来。红色 = 比你设的持有天数还长，不划算。\n期现套利的收益到交割日才锁定，所以回本日就是交割日。',
  risk_level:'综合风险：看盘口厚薄、成交额、近期费率是否转负、币种是不是新上线。点开一行看具体原因。'};
const OHZ_TIP = d => '假设按现在的条件开仓、持有 ' + d + ' 天，预计赚多少 U（已扣来回手续费，U 本位按一半本金）。费率变了结果就会变，仅供参考。';
function ocols(mode){ const i = OCOLS.findIndex(c => c[0] === 'risk_level'); return [...OCOLS.slice(0, i), ...profitHz(mode).map(d => [profitKey(d, mode), d + ' 日', 'n']), ...OCOLS.slice(i)]; }
const ospan = mode => ocols(mode).length + 1; // 多一列关注铃铛
// 切换模式时，排序列跟著换；回测没有 90 日，退回默认排序
function syncSortToMode(O, mode){
  if (mode === 'backtest' && /^profit_\d+d$/.test(O.sort)) O.sort = O.sort === 'profit_90d' ? 'conservative_apr' : O.sort.replace('profit_', 'backtest_');
  if (mode === 'forecast' && /^backtest_\d+d$/.test(O.sort)) O.sort = O.sort.replace('backtest_', 'profit_');
}
const MARGIN = {USDT:['U 本位','U 本位：现货和合约保证金各占一份资金，收益按一半本金计'], COIN:['币本位','币本位：买到的币直接当保证金，全部本金都在赚收益']};
/* 量化机会拆成两个独立模组（币本位永续见「币本位费率排名」）：各有各的筛选、排序和展开行。
   fixed = 这个模组固定的筛选（用户不能改，所以界面上不再放对应的切换钮）；noBacktest = 期现套利没有资金费率，不做回测 */
const OPP_MODS = {
  coin:{title:'币本位永续', sub:'资金费率套利：买到的币直接当保证金，全部本金都在赚收益（占 1 份）', fixed:{type:'FUNDING_RATE', margin:'COIN'}},
  usdt:{title:'U 本位永续', sub:'资金费率套利：现货和永续各占一份资金（共 2 份），收益按一半本金计', fixed:{type:'FUNDING_RATE', margin:'USDT'}},
  delivery:{title:'交割合约（期现套利）', sub:'买现货 + 空交割合约，到交割日价差收敛锁定收益；没有资金费率', fixed:{type:'DELIVERY_BASIS'}, noBacktest:true}};
const OS = {};
/* 选项卡：只有当前这一张会请求接口、会画内容；切走时清空，切回来重新载入一次。选择记在本机 */
const OPP_TABS = [['rank','币本位永续排名推荐'],['coin','币本位永续'],['usdt','U 本位永续'],['delivery','交割合约']];
let OPP_TAB = 'rank';
try { const t = localStorage.getItem('oppTab'); if (OPP_TABS.some(x => x[0] === t)) OPP_TAB = t; } catch (e) {}
const loadOppTab = () => OPP_TAB === 'rank' ? loadRank() : loadOpps(OPP_TAB);
const OPP_COUNTS = {}; // 每张选项卡里有几个：打开过才知道（不为了显示数字去多发请求）
function drawOppTabs(){
  rc($('#oppTabs'), OPP_TABS.map(([k, v]) => h('button', {class:'otab', type:'button', role:'tab', 'aria-selected':String(OPP_TAB === k), 'aria-pressed':String(OPP_TAB === k), onclick:guard(async () => selectOppTab(k))}, v, OPP_COUNTS[k] != null ? h('i', {}, String(OPP_COUNTS[k])) : null)));
}
async function selectOppTab(k){
  if (k === OPP_TAB) return;
  OPP_TAB = k; try { localStorage.setItem('oppTab', k); } catch (e) {}
  stopDepth();
  document.querySelectorAll('#opps [data-pane]').forEach(p => { const on = p.dataset.pane === k; p.hidden = !on; if (!on) p.replaceChildren(); });
  drawOppTabs(); oppsLoadedAt = Date.now();
  await loadOppTab();
}
function oppState(id){
  if (!OS[id]) { OS[id] = {sort:'conservative_apr', order:'desc', type:'', margin:'', verdict:'', q:'', hedge:true, size:30, open:null, vol:''};
    try { OS[id].vol = localStorage.getItem('oppVol') || ''; } catch (e) {} } // 成交额门槛：'' = 用参数设置里的值；其余是具体金额，'0' = 全部
  return OS[id];
}
const sg = s => s === '' ? null : Number(s);
/* 回本天数：来回手续费 ÷ 每天的毛收益（资金费率类型用近 7 天费率，期现套利的收益到交割日才锁定，回本日就是交割日）。日期用大阪时区 */
const beDate = days => { const t = new Date(Date.now() + days * 864e5), f = x => t.toLocaleDateString('en-CA', {timeZone:'Asia/Tokyo', year:'numeric', month:'2-digit', day:'2-digit', ...x}); return f({}).slice(0, 4) === new Date().toLocaleDateString('en-CA', {timeZone:'Asia/Tokyo'}).slice(0, 4) ? f({}).slice(5) : f({}); };
function breakEvenCell(o, holdDays){
  const fund = o.opportunity_type === 'FUNDING_RATE';
  if (o.break_even_days === '') return h('td', {class:'n', title:fund ? '近 7 天的资金费率不为正，收益付不起手续费，不会回本' : '期现基差不够付手续费（现货买卖 + 合约开仓 + 交割），持有到交割也回不了本'}, '—');
  const n = Number(o.break_even_days), late = n > Number(holdDays);
  return h('td', {class:'n' + (late ? ' down' : ''), title:(fund ? '来回手续费 ÷ 每天毛收益（按近 7 天费率推算，费率变了日期就会变；资金费每 ' + o.settle_interval_hours + ' 小时结算一次，实际在结算那一刻到帐）' : '期现套利收益到交割日才锁定，回本日 = 交割日') + (late ? '。超过设定的持有天数 ' + holdDays + ' 天' : '')},
    (n < 1 ? '<1' : n.toFixed(1)) + ' 天', h('span', {class:'sub'}, '约 ' + beDate(n)));
}
async function loadOpps(id = 'usdt'){
  const M = OPP_MODS[id], O = oppState(id), mode = M.noBacktest ? 'forecast' : oppMode;
  const sfx = ''; // 同一时间只有当前选项卡有内容，id 不会重复
  const ty = M.fixed.type || O.type, mg = M.fixed.margin || O.margin;
  syncSortToMode(O, mode);
  const filters = {is_hedgeable_only:O.hedge}; if (ty) filters.opportunity_types = [ty]; if (mg) filters.margin_types = [mg]; if (O.verdict) filters.verdicts = O.verdict.split(','); if (O.q) filters.keyword = O.q; if (O.vol !== '') filters.min_volume_amount = O.vol;
  const fresh = latest('opps:' + id);
  const d = await api('POST', '/finance/opportunities/list', {pagination:{page:1, size:O.size, sort_by:O.sort, order:O.order}, filters});
  if (!fresh() || OPP_TAB !== id) return; // 已经切到别的选项卡：不再往隐藏的面板里画
  oppsLoadedAt = Date.now();
  const sm = d.summary, host = $('#' + id);
  const seg = (items, cur, set) => h('div', {class:'seg'}, items.map(([k, v]) => h('button', {type:'button', 'aria-pressed':String(cur === k), onclick:guard(async () => { set(k); O.size = 30; await loadOpps(id); })}, v)));
  const q = h('input', {type:'search', placeholder:'搜索标的，回车确认', value:O.draft == null ? O.q : O.draft, 'aria-label':'搜索标的'});
  q.addEventListener('input', () => { O.draft = q.value; }); // 列表重新载入时保留正在输入的内容
  q.addEventListener('keydown', guard(async e => { if (e.key === 'Enter') { O.q = q.value.trim(); O.draft = null; await loadOpps(id); } }));
  q.addEventListener('search', guard(async () => { if (q.value === '' && O.q !== '') { O.q = ''; O.draft = null; await loadOpps(id); } })); // 点输入框里的 × 清空
  const th = ocols(mode).map(([f, label, cls]) => { const on = O.sort === f;
    if (f === '_liq') return h('th', {class:cls, title:'合约盘买卖各 3 档（共 6 档）折 U 后 ÷ 6 = 建议本金；点差 = (卖一 − 买一) ÷ 中间价，单位万分之一。成交额小、点差大、档位薄的标的，开平仓滑点都会很大'}, label);
    return h('th', {class:cls || '', title:f.startsWith('backtest_') ? BT_TIP : /^profit_\d+d$/.test(f) ? OHZ_TIP(f.replace(/\D/g, '')) : OTIPS[f] || null, 'aria-sort':on ? (O.order === 'asc' ? 'ascending' : 'descending') : 'none'},
      h('button', {class:'sort', type:'button', onclick:guard(async () => { O.order = on && O.order === 'desc' ? 'asc' : 'desc'; O.sort = f; await loadOpps(id); })}, label, h('span', {class:'arr'}, on ? (O.order === 'asc' ? ' ▲' : ' ▼') : ' ⇅'))); });
  const rows = [];
  d.list.forEach(o => {
    const v0 = VERDICT[o.verdict] || [o.verdict, ''], r = RISK[o.risk_level] || ['?', ''], open = O.open === o.symbol;
    const v = o.verdict === 'NEW_LISTING' ? ['新上线 ' + o.listed_days + ' 天 · 观察中', 'warn'] : v0; // 上线太短：近 7 天费率多半虚高，不出结论、不报警
    rows.push(h('tr', {class:'opp', onclick:guard(async () => { stopDepth(); O.open = open ? null : o.symbol; await loadOpps(id); })},
      h('td', {}, h('span', {class:'tag'}, OTYPE[o.opportunity_type]), h('span', {class:'sub', title:(MARGIN[o.margin_type] || ['',''])[1]}, (MARGIN[o.margin_type] || [o.margin_type])[0] + ' · 占 ' + o.capital_parts + ' 份')),
      h('td', {class:'sym'}, (open ? '▾ ' : '▸ ') + o.symbol,
        h('span', {class:'sub'}, o.opportunity_type === 'FUNDING_RATE' ? '周期 ' + o.settle_interval_hours + 'h' : '剩 ' + Number(o.days_left).toFixed(0) + ' 天'),
        h('span', {class:'lnk'}, o.links.map(l => h('a', {href:l.url, target:'_blank', rel:'noopener noreferrer', title:l.hint || ('在 OKX 打开：' + l.url), onclick:e => e.stopPropagation()}, l.label)))),
      latestCell(o),
      h('td', {class:'n'}, o.volume_amount === '' ? '—' : fN(o.volume_amount, 0)), h('td', {class:'n liq', 'data-sym':o.symbol}, h('span', {class:'sub'}, '载入中…')), h('td', {class:'n'}, fP(o.gross_apr), o.gross_apr_30d === '' ? null : h('span', {class:'sub', title:o.is_stable ? '近 30 天收益稳定：历史 ≥ 20 天、费率为正的占比 ≥ 80%、30 天与 7 天年化相差不到一倍' : o.stability_notes.join('；')}, '30 天 ' + fP(o.gross_apr_30d) + ' · ', h('span', {class:o.is_stable ? 'up' : 'down'}, o.is_stable ? '稳定' : '不稳定'))),
      h('td', {class:'n', style:'font-weight:650'}, o.capital_parts === 1 ? [fP(o.conservative_apr), o.compound_apr === '' ? null : h('span', {class:'sub', title:'每天把收到的币加开空单的复利年化，未扣加仓手续费'}, '复利 ' + fP(o.compound_apr))] : fP(o.conservative_apr) + ' ~ ' + fP(o.optimistic_apr)),
      h('td', {class:'n ' + (o.worst_funding_rate !== '' && Number(o.worst_funding_rate) < 0 ? 'down' : ''), title:o.worst_funding_rate === '' ? '' : '近 30 天单期最差的资金费率，出现在 ' + fT(o.worst_funding_at) + '。负数 = 空头要付费；每期亏损 = |费率| × 合约名义价值（本金 ÷ 占用份数）'},
        o.worst_funding_rate === '' ? '—' : [fP(o.worst_funding_rate, 4), h('span', {class:'sub hi'}, Number(o.worst_funding_rate) < 0 ? '每期亏 ' + fN(o.worst_funding_loss_amount, 2) + ' U' : '30 天无负费率')]),
      h('td', {}, h('span', {class:'tag ' + v[1]}, v[0])), h('td', {class:'n'}, o.sustain_ratio === '' ? '—' : fP(o.sustain_ratio, 0)), breakEvenCell(o, sm.hold_days),
      profitHz(mode).map(dd => { const key = profitKey(dd, mode), bt = mode === 'backtest', p = o[key], po = (bt ? o.backtest_optimistic : o.profit_optimistic)[key];
        const miss = bt ? (o.opportunity_type === 'FUNDING_RATE' ? '本地资金费率历史不足 ' + dd + ' 天（或缺的期数太多），不回测' : '期现套利没有资金费率，不回测') : '';
        return h('td', {class:'n ' + (p === '' ? '' : Number(p) >= 0 ? 'up' : 'down'), title:p === '' ? miss : (bt ? '过去 ' + dd + ' 天实际费率回测；乐观口径 ' : '乐观口径 ') + po + ' USDT'}, p === '' ? '—' : (Number(p) > 0 ? '+' : '') + fN(p)); }),
      h('td', {}, h('span', {class:'tag ' + r[1]}, r[0])),
      h('td', {}, h('button', {class:'bell', type:'button', disabled:true, title:'演示模式不可操作'}, '🔕'), h('button', {class:'btn cmdbtn', type:'button', disabled:true}, '指令'))));
    if (open) rows.push(h('tr', {class:'det'}, h('td', {colspan:ospan(mode)}, oppDetail(o))));
  });
  rc(host, h('div', {class:'bar obar'}, M.fixed.margin ? null : seg([['','U 本位 + 币本位'],['USDT','U 本位'],['COIN','币本位']], O.margin, k => O.margin = k),
      seg([['','全部'],['BEAT_CASH,BEAT_FIXED','超过活期'],['BEAT_FIXED','超过定期']], O.verdict, k => O.verdict = k),
      M.noBacktest ? null : h('span', {class:'chk', title:'预测 = 按近 7 天费率往后推算；回测 = 按过去 1～60 天实际已结算的资金费率算（本地历史约 70 天，不做 90 日）'}, '收益',
        seg([['forecast','预测'],['backtest','回测']], oppMode, k => { oppMode = k; try { localStorage.setItem('oppProfitMode', k); } catch (e) {} })),
      h('label', {class:'chk'}, h('input', {type:'checkbox', checked:O.hedge, onchange:guard(async e => { O.hedge = e.target.checked; await loadOpps(id); })}), '只看可对冲'),
      h('label', {class:'chk', title:'只显示 24 小时成交额不低于这个数的永续。成交额越小，现货和永续的滑点越大。报警始终按「参数设置」里的最小成交额，不受这里影响'}, '成交额',
        h('select', {id:'oppVol' + sfx, 'aria-label':'成交额门槛', onchange:guard(async e => { O.vol = e.target.value; O.size = 30; try { localStorage.setItem('oppVol', O.vol); } catch (er) {} await loadOpps(id); })},
          [['', '≥ ' + (Number(sm.min_volume_amount) / 1e6) + 'M（默认）'], ['5000000', '≥ 5M'], ['1000000', '≥ 1M'], ['100000', '≥ 0.1M'], ['0', '全部']].map(([k, v]) => h('option', {value:k, selected:O.vol === k}, v)))), q, h('span', {class:'sp'}),
      h('span', {class:'meta'}, '符合 ' + d.pagination.total + ' 个 · 超过定期 ' + sm.beat_fixed_count + ' 个 · 本金 ' + fN(sm.principal_amount, 0) + ' · 持有 ' + sm.hold_days + ' 天'),
      h('span', {class:'meta', id:'oppsAsOf' + sfx, title:'后台每 10 分钟同步一次行情（成交额、交割合约价差；资金费率在每期结算后更新），页面也每 10 分钟自动重新载入这张表'}, sm.market_synced_at ? '行情 ' + (fT(sm.market_synced_at).split(' ')[1] || '') : '行情尚未同步'),
      h('button', {class:'btn pri', type:'button', onclick:guard(async () => loadOpps(id))}, '刷新快照')),
    h('details', {class:'help'}, h('summary', {}, '看不懂？点开看说明'), h('div', {class:'hbody'}, '盘口栏：建议本金 = 合约买卖各 3 档折 U 的均值（6 档合计 ÷ 6）；点差以万分之一计。🟢 正常　🟡 偏薄或点差偏大　🔴 过薄，不建议做大单。', h('br'), '资金费率的毛年化只用最近 7 天的费率计算，近 30 天只用来判断是否稳定。预计收益 = 本金 ÷ 占用份数 × (毛年化 × 天数 ÷ 365 − 往返手续费)，U 本位占 2 份、币本位占 1 份；已扣一次性手续费，可能为负；悬停看乐观口径。仅供参考，本工具只读，不下单。')),
    h('div', {class:'scroll'}, h('table', {class:'tbl-opp'}, h('thead', {}, h('tr', {}, th, h('th', {title:'关注：之后跌回活期门槛以下、或资金费率转负时，Lark 提醒你退出。右边“指令”按钮：生成开仓命令（只生成文字，不会下单）。'}, '关注'))),
      h('tbody', {}, rows.length ? rows : h('tr', {}, h('td', {colspan:ospan(mode), class:'todo'}, d.pagination.total === 0 && sm.total === 0 ? '还没有行情数据：先运行 finance worker（或 worker run --job market）同步一次' : '没有符合条件的标的，放宽筛选试试')))),
      d.pagination.has_next ? h('div', {style:'margin-top:8px'}, h('button', {class:'btn', type:'button', onclick:guard(async () => { O.size += 30; await loadOpps(id); })}, '显示更多 30 个（共 ' + d.pagination.total + ' 个）')) : null),
  );
  OPP_COUNTS[id] = d.pagination.total; drawOppTabs();
  loadLiq(host, sm.principal_amount).catch(() => {});
}
const LIQ = {good:['🟢','充足','good'], warn:['🟡','偏薄','warn'], bad:['🔴','过薄','bad']};
const fK = v => { const n = Number(v); return n >= 1e6 ? (n / 1e6).toFixed(2) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : n.toFixed(0); };
/* 机会表的盘口栏：列表先出来，这一栏单独取（一次一批，服务端缓存 30 秒） */
async function loadLiq(host, principal){
  const cells = [...host.querySelectorAll('td.liq')], syms = [...new Set(cells.map(c => c.dataset.sym))];
  if (!syms.length) return;
  let r;
  try { r = await api('POST', '/finance/market/liquidity', {symbols:syms.slice(0, 40), principal_amount:String(principal || '1000')}); }
  catch (e) { cells.forEach(c => rc(c, h('span', {class:'sub', title:String(e.message || e)}, '盘口读取失败'))); return; }
  const by = {}; (r.list || []).forEach(x => by[x.symbol] = x);
  cells.forEach(c => { const x = by[c.dataset.sym];
    if (!x || x.error) { rc(c, h('span', {class:'sub', title:x ? x.error : ''}, '盘口读取失败')); return; }
    const L = LIQ[x.signal] || LIQ.warn;
    c.title = L[1] + '：' + x.signal_note + '\n买盘前 3 档 ' + fN(x.bid_depth_usd_amount, 0) + ' U（对手盘，开空吃这边）· 卖盘前 3 档 ' + fN(x.ask_depth_usd_amount, 0) + ' U\n6 档合计 ' + fN(x.depth_usd_amount, 0) + ' U ÷ 6 = ' + fN(x.suggest_principal_amount, 0) + ' U';
    rc(c, h('span', {class:'liqmain ' + L[2]}, L[0] + ' ' + fN(x.suggest_principal_amount, 0) + ' U'),
      h('span', {class:'sub hi'}, '点差 ' + Number(x.spread_bps).toFixed(1) + ' 万'),
      h('span', {class:'sub hi'}, '买3档 ' + fK(x.bid_depth_usd_amount) + ' · 卖3档 ' + fK(x.ask_depth_usd_amount)));
  });
}
/* 资金费率：最近一期已结算的费率；期现套利：价差 = 合约买一价 − 现货指数价 */
function latestCell(o){
  if (o.opportunity_type === 'FUNDING_RATE') {
    if (o.latest_funding_rate === '') return h('td', {class:'n'}, '—');
    const r = Number(o.latest_funding_rate);
    return h('td', {class:'n ' + (r < 0 ? 'down' : ''), title:'最近一期已结算的资金费率，结算于 ' + fT(o.latest_funding_at) + '。正数 = 空头收，负数 = 空头付'}, fP(r, 4),
      h('span', {class:'sub'}, '每 ' + o.settle_interval_hours + 'h'));
  }
  const sp = Number(o.spread_amount);
  return h('td', {class:'n ' + (sp < 0 ? 'down' : ''), title:'价差 = 合约买一价 ' + o.futures_price + ' − 现货指数价 ' + o.index_price + '。正数 = 合约比现货贵，做空合约到期可以赚到这个差'}, (sp > 0 ? '+' : '') + fN(sp),
    h('span', {class:'sub'}, '基差 ' + fP(o.basis_ratio)), h('span', {class:'sub'}, '合约 ' + fN(o.futures_price)), h('span', {class:'sub'}, '现货 ' + fN(o.index_price)));
}
function ratesBox(det){
  const st = det.funding_rate_stat, p4 = x => fP(x, 4);
  if (!det.funding_rates || det.funding_rates.length < 2) return h('div', {class:'meta', style:'margin-top:10px'}, '近 30 天资金费率记录不足，暂无走势');
  const ch = h('div', {class:'chart rates'});
  const box = h('div', {style:'margin-top:12px'}, h('div', {class:'meta', style:'margin-bottom:2px'}, '近 30 天每期资金费率（已结算，共 ' + st.count + ' 期）· 平均 ' + p4(st.avg_rate) + ' · 最高 ' + p4(st.max_rate) + ' · 最低 ' + p4(st.min_rate) + ' · 为负 ' + st.negative_count + ' 期'), ch);
  // 图表要等挂到页面上才知道宽度
  queueMicrotask(() => lineChart(ch, {pts:det.funding_rates.map(r => [Date.parse(r.time), Number(r.rate) * 100]), label:det.symbol + ' 近 30 天每期资金费率', ml:60,
    fmt:v => v.toFixed(3) + '%', tip:'资金费率', tipFmt:v => v.toFixed(4) + '%', refs:[{y:Number(st.avg_rate) * 100, label:'平均 ' + p4(st.avg_rate)}, {y:0, label:''}]}));
  return box;
}
function oppDetail(o){
  const box = h('div', {class:'detgrid', style:'display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:16px'}), left = h('div', {}), top = h('div', {}), rest = h('div', {}), right = h('div', {class:'risk'}, h('b', {}, '风险提示'), h('div', {class:'meta'}, '载入中…'));
  left.append(top, rest);
  box.append(left, right);
  const wrap = h('div', {}, box);
  api('GET', '/finance/opportunities/' + encodeURIComponent(o.symbol)).then(async det => {
    rc(right, h('b', {}, '风险提示'), h('ul', {}, det.risk_notes.map(t => h('li', {}, t))),
      det.positive_ratio ? h('div', {class:'foot'}, '30 天内费率为正的占比 ' + fP(det.positive_ratio, 0) + '；样本 ' + det.sample_count + ' 期，跨度 ' + det.span_days + ' 天。') : null);
    right.append(...(/-USD-/.test(o.symbol) ? [insuranceBox(o.symbol)] : []), candleBox(o.symbol), basisBox(o.symbol), lsBox(o.symbol));
    const isFut = o.opportunity_type !== 'FUNDING_RATE';
    rest.append(playbookBox(det.playbook), depthBox(o.symbol, det.playbook.notional_amount));
    const tr = await api('POST', '/finance/opportunities/trend', {symbol:o.symbol, days:30});
    const rates = () => { if (!isFut) top.append(ratesBox(det)); };
    if (tr.points.length < 2) { top.append(h('div', {class:'meta'}, isFut ? '基差历史由每次行情同步自存（每 8 小时一份），目前只有 ' + tr.points.length + ' 个点，积累到 2 个以上才画走势。毛年化 = 基差 ÷ 剩余天数 × 365；基差取空头可成交的买一价与现货指数价。' : '历史不足，没有走势')); rates(); return; }
    top.append(h('div', {class:'meta', style:'margin-bottom:2px'}, isFut ? '基差走势 · 当时建仓并持有到交割的保守净年化（虚线 = 定期 / 活期门槛）' : '近 30 天 · 7 日滚动保守净年化（虚线 = 定期 / 活期门槛）'));
    const ch = h('div', {class:'chart'}); top.append(ch);
    lineChart(ch, {pts:tr.points.map(p => [Date.parse(p.time), Number(p.conservative_apr) * 100]), label:o.symbol + ' 近 30 天保守净年化',
      refs:[{y:Number(tr.thresholds.fixed_apr) * 100, label:'定期 ' + fP(tr.thresholds.fixed_apr)}, {y:Number(tr.thresholds.cash_apr) * 100, label:'活期 ' + fP(tr.thresholds.cash_apr)}]});
    rates();
  }).catch(e => rc(right, h('b', {}, '风险提示'), h('div', {class:'meta'}, e.message)));
  return wrap;
}
/* ---------- 多空比 ----------
   合约的多头账户 ÷ 空头账户（OKX 公开统计）。柱子 = 多空账户各占多少，白线 = 多空比。 */
const LS_PERIODS = [['5m','5 分钟'],['15m','15 分钟'],['1H','1 小时'],['4H','4 小时'],['1D','1 日']];
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
      catch (e) { rc(chart, h('div', {class:'meta'}, cfg.title + '读取失败：' + e.message)); rc(note, null); return; }
      cfg.draw(chart, d);
      rc(note, cfg.note(d));
    };
    loaders.push(load);
    return box;
  };
  const ratioNote = lead => d => { const lr = Number(d.latest_ratio), fr = Number(d.first_ratio);
    return '最新 多头 ' + fP(d.latest_long_share_ratio, 1) + ' · 空头 ' + fP(1 - Number(d.latest_long_share_ratio), 1) + ' · 多空比 ' + lr.toFixed(2) + '（区间起点 ' + fr.toFixed(2) + '）。' + lead; };
  const boxes = [
    mk({title:'多空比', path:'/finance/market/long-short', draw:drawLS,
      tip:'多头账户比例 = 净多头仓位账户 ÷ 总持仓账户\n空头账户比例 = 净空头仓位账户 ÷ 总持仓账户\n多空比 = 多头账户比例 ÷ 空头账户比例',
      note:ratioNote('这里是账户数之比，不是持仓量之比；多头账户多时资金费率通常为正（做空套利收费），多空比快速下降说明费率可能走低。')}),
    mk({title:'大户多空账户数比', path:'/finance/market/top-trader-ratio', draw:drawLS,
      tip:'OKX 精英交易员（大户）的多空账户数之比，口径同上，只统计大户。\n和上面全市场的多空比对照：两者方向相反时，说明大户和散户在博弈。',
      note:ratioNote('只统计大户账户，不是持仓量；和上面全市场多空比一起看，两者背离时大户的方向更值得参考。')}),
    mk({title:'合约主动买卖量', path:'/finance/market/taker-volume', draw:drawTaker,
      tip:'主动买入 = 以卖一价吃单成交的金额；主动卖出 = 以买一价吃单成交的金额，按美元计。\n向上是主动买入、向下是主动卖出，白线是净主动买入（买 − 卖）。\n最右一根是还没走完的当前周期，量偏小，颜色较淡。',
      note:d => { const l = d.list[d.list.length - 1], net = Number(l.net_amount);
        return '最新（未走完）主动买入 ' + fU(l.buy_amount) + ' · 主动卖出 ' + fU(l.sell_amount) + ' · 净' + (net >= 0 ? '买入 ' : '卖出 ') + fU(Math.abs(net)) + ' · 买入占 ' + fP(l.buy_share_ratio, 1) + '。吃单金额反映谁在追价，不是持仓量；持续净买入配合多头账户增加，费率才更可能维持为正。'; }})
  ];
  const box = h('div', {}, boxes);
  reloadAll();
  return box;
}
/* 美元金额缩写：12.3M / 4.56B */
function fU(v){ const x = Math.abs(Number(v)), sg = Number(v) < 0 ? '-' : '';
  if (x >= 1e9) return sg + (x / 1e9).toFixed(2) + 'B'; if (x >= 1e6) return sg + (x / 1e6).toFixed(2) + 'M'; if (x >= 1e3) return sg + (x / 1e3).toFixed(1) + 'K'; return sg + x.toFixed(0); }
function drawTaker(host, d){
  const pts = d.list, W = Math.max(280, host.clientWidth), H = 210, m = {l:46, r:12, t:8, b:22}, pw = W - m.l - m.r, ph = H - m.t - m.b;
  host.innerHTML = '';
  const root = svg('svg', {width:W, height:H, viewBox:`0 0 ${W} ${H}`, role:'img', 'aria-label':'合约主动买卖量'}, host);
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
      h('div', {class:'r'}, h('span', {class:'k', style:'background:var(--good)'}), '主动买入', h('span', {class:'val'}, fU(p.buy_amount))),
      h('div', {class:'r'}, h('span', {class:'k', style:'background:var(--bad)'}), '主动卖出', h('span', {class:'val'}, fU(p.sell_amount))),
      h('div', {class:'r'}, h('span', {class:'k', style:'background:var(--ink)'}), net >= 0 ? '净买入' : '净卖出', h('span', {class:'val'}, fU(Math.abs(net)))),
      h('div', {class:'r'}, h('span', {class:'k', style:'background:transparent'}), '买入占', h('span', {class:'val'}, fP(p.buy_share_ratio, 1))));
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
    rc(tip, h('div', {class:'t'}, fT(p.time)), h('div', {class:'r'}, h('span', {class:'k', style:'background:var(--good)'}), '多头', h('span', {class:'val'}, fP(p.long_share_ratio, 2))),
      h('div', {class:'r'}, h('span', {class:'k', style:'background:var(--bad)'}), '空头', h('span', {class:'val'}, fP(p.short_share_ratio, 2))),
      h('div', {class:'r'}, h('span', {class:'k', style:'background:var(--ink)'}), '多空比', h('span', {class:'val'}, Number(p.ratio).toFixed(2))));
    tip.style.display = 'block'; const l = X(i) + 12 + tip.offsetWidth > W ? X(i) - 12 - tip.offsetWidth : X(i) + 12; tip.style.left = Math.max(0, l) + 'px'; tip.style.top = '4px'; });
  hit.addEventListener('pointerleave', () => { cross.setAttribute('visibility', 'hidden'); tip.style.display = 'none'; });
}
/* ---------- K 线 ----------
   机会详情右栏：合约、现货各一张蜡烛图，最近 500 根，周期 1 分钟 / 4 小时 / 1 日，两张共用同一个周期。
   公开行情，不需要凭证；上涨绿、下跌红（和本页其他图一致）。 */
const CANDLE_BARS = [['1m','1 分钟'],['4H','4 小时'],['1D','1 日']];
let candleBar = '1m';
try { candleBar = localStorage.getItem('candleBar') || '1m'; } catch (e) {}
if (!CANDLE_BARS.some(b => b[0] === candleBar)) candleBar = '1m';
let candleView = 'merged'; // merged = 合并对比，split = 分开
try { candleView = localStorage.getItem('candleView') === 'split' ? 'split' : 'merged'; } catch (e) {}
function candleBox(symbol){
  const seg = h('div', {class:'seg'}), vseg = h('div', {class:'seg'}), body = h('div', {}, h('div', {class:'meta'}, '载入中…'));
  let seq = 0;
  const load = async () => {
    const my = ++seq;
    rc(vseg, [['merged', '合并'], ['split', '分开']].map(([k, v]) => h('button', {type:'button', 'aria-pressed':String(candleView === k), onclick:guard(async () => { candleView = k; try { localStorage.setItem('candleView', k); } catch (e) {} await load(); })}, v)));
    rc(seg, CANDLE_BARS.map(([k, v]) => h('button', {type:'button', 'aria-pressed':String(candleBar === k), onclick:guard(async () => { candleBar = k; try { localStorage.setItem('candleBar', k); } catch (e) {} await load(); })}, v)));
    let d;
    try { d = await api('POST', '/finance/market/candles', {symbol:symbol, bar:candleBar}); }
    catch (e) { if (my === seq) rc(body, h('div', {class:'meta down'}, 'K 线读取失败：' + e.message)); return; }
    if (my !== seq) return; // 连点切换周期时只认最后一次
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
        h('div', {class:'hd', style:'margin-bottom:2px'}, h('b', {}, s.kind === 'SPOT' ? '现货' : '合约'), h('span', {class:'sub'}, ' ' + s.inst_id + ' · ' + (/-USD-/.test(s.inst_id) ? 'USD 计价' : 'USDT 计价')),
          h('span', {class:'sp'}), h('span', {class:'sub'}, '最新 ' + candlePx(Number(last.close)) + ' · 共 ' + s.list.length + ' 根')),
        host);
    });
    rc(body, ...parts, (d.warnings || []).length ? h('div', {class:'meta down'}, d.warnings.join('；')) : null);
  };
  load();
  return h('div', {style:'margin-top:14px;padding-top:10px;border-top:1px solid var(--border)'},
    h('div', {class:'hd', style:'margin-bottom:2px'}, h('b', {title:'合约与现货各取最近 500 根 K 线。\n币本位合约按 USD 计价、现货按 USDT 计价，两者本身会有 USDT-USD 汇率造成的小差距。\n最右一根是还没走完的当前周期。'}, 'K 线 ⓘ'), h('span', {class:'sp'}), vseg, h('span', {style:'width:6px'}), seg),
    body);
}
function candlePx(v){ return v >= 1000 ? v.toFixed(2) : v >= 1 ? v.toFixed(4) : Number(v.toPrecision(4)).toString(); }
/* 合并对比：合约、现货收盘价画在同一张图上，下面一张是价差（万分比 = (合约 − 现货) ÷ 现货 × 10000）。
   只对齐两边都有的时间点。币本位合约是 USD 计价、现货是 USDT 计价，所以价差里含 USDT-USD 汇率造成的固定偏移。 */
function drawMerged(host, cs, sp){
  const sm = new Map(sp.list.map(p => [p.time, Number(p.close)]));
  const pts = cs.list.filter(p => sm.has(p.time)).map(p => { const c = Number(p.close), s = sm.get(p.time); return {t:p.time, c:c, s:s, bp:(c - s) / s * 1e4}; });
  const n = pts.length;
  if (n < 2) { rc(host, h('div', {class:'meta'}, '合约与现货没有可对齐的 K 线')); return; }
  const W = Math.max(280, host.clientWidth), H = 300, m = {l:6, r:58, t:8, b:22}, pw = W - m.l - m.r, H1 = 170, g = 22, H2 = H - m.t - m.b - H1 - g;
  host.innerHTML = '';
  const root = svg('svg', {width:W, height:H, viewBox:`0 0 ${W} ${H}`, role:'img', 'aria-label':'合约与现货 K 线合并对比 ' + cs.inst_id}, host);
  const X = i => m.l + (i + .5) * pw / n;
  const lo0 = Math.min(...pts.map(p => Math.min(p.c, p.s))), hi0 = Math.max(...pts.map(p => Math.max(p.c, p.s))), pad = (hi0 - lo0) * .04 || hi0 * .01, lo = lo0 - pad, hi = hi0 + pad;
  const Y = v => m.t + (1 - (v - lo) / (hi - lo)) * H1;
  [0, 1, 2, 3, 4].forEach(k => { const v = lo + (hi - lo) * k / 4; svg('line', {x1:m.l, x2:W - m.r, y1:Y(v), y2:Y(v), stroke:'var(--grid)'}, root); svg('text', {x:W - m.r + 5, y:Y(v) + 4, fill:'var(--muted)', 'font-size':10}, root).textContent = candlePx(v); });
  const line = (key, col) => svg('path', {d:pts.map((p, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(p[key]).toFixed(1)).join(''), fill:'none', stroke:col, 'stroke-width':1.3, 'stroke-linejoin':'round'}, root);
  line('s', 'var(--s2)'); line('c', 'var(--s1)');
  // 价差面板：以 0 为中线，柱子正 = 合约比现货贵
  const bps = pts.map(p => p.bp), mean = bps.reduce((a, b) => a + b, 0) / n, bmx = Math.max(1, ...bps.map(Math.abs)) * 1.1, y2 = m.t + H1 + g, B = v => y2 + (1 - (v + bmx) / (2 * bmx)) * H2;
  [-1, 0, 1].forEach(k => { const v = bmx * k; svg('line', {x1:m.l, x2:W - m.r, y1:B(v), y2:B(v), stroke:k === 0 ? 'var(--axis)' : 'var(--grid)'}, root); svg('text', {x:W - m.r + 5, y:B(v) + 4, fill:'var(--muted)', 'font-size':10}, root).textContent = v.toFixed(1); });
  const bw = Math.max(1, pw / n - (pw / n > 3 ? 1 : 0)); let up = '', dn = '';
  pts.forEach((p, i) => { const a = B(0), b = B(p.bp), seg = 'M' + (X(i) - bw / 2).toFixed(1) + ' ' + Math.min(a, b).toFixed(1) + 'h' + bw.toFixed(1) + 'v' + Math.max(.6, Math.abs(a - b)).toFixed(1) + 'h' + (-bw).toFixed(1) + 'Z'; if (p.bp >= 0) up += seg; else dn += seg; });
  if (up) svg('path', {d:up, fill:'var(--good)', opacity:.85}, root);
  if (dn) svg('path', {d:dn, fill:'var(--bad)', opacity:.85}, root);
  svg('line', {x1:m.l, x2:W - m.r, y1:B(mean), y2:B(mean), stroke:'var(--ink)', 'stroke-dasharray':'3 3'}, root);
  svg('text', {x:m.l + 2, y:y2 - 5, fill:'var(--muted)', 'font-size':10}, root).textContent = '价差（万分比）· 平均 ' + mean.toFixed(1) + ' · 最新 ' + bps[n - 1].toFixed(1) + ' · 最大 ' + Math.max(...bps).toFixed(1) + ' · 最小 ' + Math.min(...bps).toFixed(1);
  const fmtT = t => candleBar === '1D' ? t.slice(5, 10) : t.slice(5, 10) + ' ' + t.slice(11, 16);
  [0, Math.floor((n - 1) / 2), n - 1].forEach((i, k) => svg('text', {x:Math.max(m.l, Math.min(W - m.r, X(i))), y:H - 6, 'text-anchor':k === 0 ? 'start' : k === 2 ? 'end' : 'middle', fill:'var(--muted)', 'font-size':10}, root).textContent = fmtT(pts[i].t));
  // 图例
  svg('rect', {x:m.l + 2, y:m.t + 2, width:10, height:3, fill:'var(--s1)'}, root); svg('text', {x:m.l + 16, y:m.t + 7, fill:'var(--ink2)', 'font-size':10}, root).textContent = '合约 ' + cs.inst_id + (/-USD-/.test(cs.inst_id) ? '（USD）' : '');
  svg('rect', {x:m.l + 2, y:m.t + 14, width:10, height:3, fill:'var(--s2)'}, root); svg('text', {x:m.l + 16, y:m.t + 19, fill:'var(--ink2)', 'font-size':10}, root).textContent = '现货 ' + sp.inst_id + '（USDT）';
  const cross = svg('line', {y1:m.t, y2:y2 + H2, stroke:'var(--axis)', visibility:'hidden'}, root);
  const tip = h('div', {class:'tip', style:'display:none'}); host.append(tip);
  const hit = svg('rect', {x:m.l, y:m.t, width:pw, height:y2 + H2 - m.t, fill:'transparent', style:'cursor:crosshair'}, root);
  hit.addEventListener('pointermove', ev => { const r = hit.getBoundingClientRect(), i = Math.max(0, Math.min(n - 1, Math.floor((ev.clientX - r.left) / r.width * n))), p = pts[i];
    cross.setAttribute('x1', X(i)); cross.setAttribute('x2', X(i)); cross.setAttribute('visibility', 'visible');
    const row = (k, v, c) => h('div', {class:'r'}, h('span', {class:'k', style:'background:' + (c || 'transparent')}), k, h('span', {class:'val'}, v));
    rc(tip, h('div', {class:'t'}, fT(p.t)), row('合约', candlePx(p.c), 'var(--s1)'), row('现货', candlePx(p.s), 'var(--s2)'), row('价差', (p.bp >= 0 ? '+' : '') + p.bp.toFixed(1) + ' 万分比', p.bp >= 0 ? 'var(--good)' : 'var(--bad)'));
    tip.style.display = 'block'; const l = X(i) + 12 + tip.offsetWidth > W ? X(i) - 12 - tip.offsetWidth : X(i) + 12; tip.style.left = Math.max(0, l) + 'px'; tip.style.top = '4px'; });
  hit.addEventListener('pointerleave', () => { cross.setAttribute('visibility', 'hidden'); tip.style.display = 'none'; });
}
function drawCandles(host, s){
  const pts = s.list.map(p => ({t:p.time, o:Number(p.open), h:Number(p.high), l:Number(p.low), c:Number(p.close), v:Number(p.volume), done:p.is_confirmed}));
  const n = pts.length, W = Math.max(280, host.clientWidth), H = 190, m = {l:6, r:58, t:8, b:22}, pw = W - m.l - m.r, ph = H - m.t - m.b;
  host.innerHTML = '';
  const root = svg('svg', {width:W, height:H, viewBox:`0 0 ${W} ${H}`, role:'img', 'aria-label':(s.kind === 'SPOT' ? '现货' : '合约') + ' K 线 ' + s.inst_id}, host);
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
    rc(tip, h('div', {class:'t'}, fT(p.t) + (p.done ? '' : '（未走完）')), row('开', candlePx(p.o)), row('高', candlePx(p.h)), row('低', candlePx(p.l)), row('收', candlePx(p.c), col),
      row('涨跌', (chg >= 0 ? '+' : '') + (chg * 100).toFixed(2) + '%'), row('量', fU(p.v)));
    tip.style.display = 'block'; const l = X(i) + 12 + tip.offsetWidth > W ? X(i) - 12 - tip.offsetWidth : X(i) + 12; tip.style.left = Math.max(0, l) + 'px'; tip.style.top = '4px'; });
  hit.addEventListener('pointerleave', () => { cross.setAttribute('visibility', 'hidden'); tip.style.display = 'none'; });
}
/* ---------- 合约基差 ----------
   机会详情右栏：合约价与指数价（取各周期收盘价）画在上面，下面是基差或价差率柱子。
   基差 = 合约价 − 指数价（合约比指数贵为正）；价差率 = 基差 ÷ 指数价。公开行情，最近 500 点。 */
const BASIS_BARS = [['1m','1 分钟'],['5m','5 分钟'],['1H','1 小时'],['4H','4 小时'],['1D','1 日']];
let basisBar = '5m', basisMetric = 'amount'; // amount = 基差，ratio = 价差率
try { basisBar = localStorage.getItem('basisBar') || '5m'; basisMetric = localStorage.getItem('basisMetric') === 'ratio' ? 'ratio' : 'amount'; } catch (e) {}
if (!BASIS_BARS.some(b => b[0] === basisBar)) basisBar = '5m';
const basisFmt = v => { const a = Math.abs(v); return (v > 0 ? '+' : v < 0 ? '-' : '') + (a >= 100 ? a.toFixed(2) : a >= 1 ? a.toFixed(4) : Number(a.toPrecision(3)).toString()); };
const basisPct = v => (v > 0 ? '+' : v < 0 ? '-' : '') + (Math.abs(v) * 100).toFixed(3) + '%';
function basisBox(symbol){
  const seg = h('div', {class:'seg', 'data-box':'basis'}), mseg = h('div', {class:'seg', 'data-box':'basis'}), body = h('div', {}, h('div', {class:'meta'}, '载入中…'));
  let seq = 0, last = null;
  const draw = () => { if (!last) return;
    const host = h('div', {class:'chart', style:'min-height:280px'});
    queueMicrotask(() => drawBasis(host, last));
    rc(body, h('div', {style:'margin-top:8px'}, host)); };
  const buttons = () => {
    rc(seg, BASIS_BARS.map(([k, v]) => h('button', {type:'button', 'aria-pressed':String(basisBar === k), onclick:guard(async () => { basisBar = k; try { localStorage.setItem('basisBar', k); } catch (e) {} await load(); })}, v)));
    rc(mseg, [['amount', '基差'], ['ratio', '价差率']].map(([k, v]) => h('button', {type:'button', 'aria-pressed':String(basisMetric === k), onclick:guard(async () => { basisMetric = k; try { localStorage.setItem('basisMetric', k); } catch (e) {} buttons(); draw(); })}, v)));
  };
  const load = async () => {
    const my = ++seq; buttons();
    let d;
    try { d = await api('POST', '/finance/market/basis', {symbol:symbol, bar:basisBar}); }
    catch (e) { if (my === seq) rc(body, h('div', {class:'meta down'}, '合约基差读取失败：' + e.message)); return; }
    if (my !== seq) return; // 连点切换周期时只认最后一次
    last = d; draw();
  };
  load();
  return h('div', {style:'margin-top:14px;padding-top:10px;border-top:1px solid var(--border)'},
    h('div', {class:'hd', style:'margin-bottom:2px'}, h('b', {title:'基差 = 合约价 − 指数价（合约比指数贵为正）\n价差率 = 基差 ÷ 指数价\n合约价、指数价取每根 K 线的收盘价，最近 500 点；最右一根是还没走完的当前周期。\n指数是 OKX 的现货指数（币本位合约对应 XXX-USD，U 本位对应 XXX-USDT）。'}, '合约基差 ⓘ'), h('span', {class:'sp'}), mseg, h('span', {style:'width:6px'}), seg),
    body);
}
/* ---------- 合约风险基金 ----------
   OKX 公开接口一次只能查一个合约族，所以只在打开这个合约的详情时查一次（后端 60 秒快取）；目前只做币本位。
   占比 = 风险基金（折 U）÷ OKX 该合约族全市场总持仓（oiUsd），单位万分比（‱），旁边同时写百分比；和自己的仓位、本金无关。 */
function insuranceBox(symbol){
  const body = h('div', {}, h('div', {class:'meta'}, '载入中…'));
  const cell = (label, value, unit, hl, sub) => h('div', {style:'background:' + (hl ? 'var(--wash)' : 'var(--bg)') + ';border-radius:8px;padding:8px 10px;min-width:0'},
    h('div', {class:'meta', style:'margin:0 0 2px'}, label), h('div', {style:'font-size:17px;font-weight:600;white-space:nowrap' + (hl ? ';color:var(--s1)' : '')}, value, h('span', {class:'meta', style:'font-weight:400;margin-left:3px'}, unit)),
    sub ? h('div', {class:'meta', style:'margin-top:1px'}, sub) : null);
  const load = async () => {
    let d;
    try { d = await api('POST', '/finance/market/insurance-fund', {symbol:symbol}); }
    catch (e) { rc(body, h('div', {class:'meta down'}, '合约风险基金读取失败：' + e.message)); return; }
    const has = d.fund_oi_ratio_bps !== '', bps = has ? fN(d.fund_oi_ratio_bps, 2) : '—', pct = has ? Math.min(100, Number(d.fund_oi_ratio_pct)) : 0;
    rc(body,
      h('div', {style:'display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:8px'},
        cell('风险基金余额（折 U）', fN(d.fund_usd_amount, 0), 'U'), cell('所有人持仓（折 U）', fN(d.open_interest_usd_amount, 0), 'U'),
        cell('基金 ÷ 所有人持仓', bps, '‱', true, has ? '= ' + fN(d.fund_oi_ratio_pct, 2) + '%' : '')),
      h('div', {style:'height:6px;background:var(--wash);border-radius:3px;margin-top:8px;overflow:hidden'}, h('div', {style:'height:100%;border-radius:3px;background:var(--s1);width:' + (has ? Math.max(pct, 1) : 0) + '%'})),
      h('div', {class:'meta', style:'margin-top:6px'}, '基金原始余额 ' + Number(d.fund_qty).toLocaleString('en-US', {maximumFractionDigits:2}) + ' ' + d.fund_ccy + ' × 指数价 ' + Number(d.fund_price_usd).toLocaleString('en-US', {maximumFractionDigits:6}) + ' USD · 更新于 ' + d.updated_at.replace('T', ' ').slice(0, 16) + ' JST'));
  };
  load();
  return h('div', {style:'margin-top:14px;padding-top:10px;border-top:1px solid var(--border)'},
    h('div', {class:'hd', style:'margin-bottom:2px'}, h('b', {title:'OKX 该合约族的风险基金（insurance fund）存量，用来在穿仓时垫付亏损，越大越安全。\n币本位合约的基金以币计，这里按该币的 USD 指数价折成 U。\n所有人持仓 = OKX 上该合约族全市场所有人的未平仓量合计（OKX 公开接口 open-interest 的 oiUsd）。\n基金 ÷ 所有人持仓 = 基金折 U 余额 ÷ 所有人持仓 × 10000（万分比 ‱，1‱ = 0.01%），旁边同时写出百分比。\n和你自己的仓位、本金无关。\nOKX 这些接口一次只能查一个合约族，所以只在打开详情时查，并且后端快取 60 秒。'}, '合约风险基金 ⓘ'), h('span', {class:'sp'}), h('span', {class:'meta'}, symbol.split('-').slice(0, 2).join('-') + ' 合约族')),
    body);
}
function drawBasis(host, d){
  const pts = d.list.map(p => ({t:p.time, c:Number(p.contract_price), i:Number(p.index_price), b:Number(p.basis_amount), r:Number(p.basis_ratio), done:p.is_confirmed}));
  const n = pts.length, ratioMode = basisMetric === 'ratio', val = p => ratioMode ? p.r : p.b, fm = ratioMode ? basisPct : basisFmt, unit = d.quote_ccy;
  if (n < 2) { rc(host, h('div', {class:'meta'}, '点数不足，画不出基差')); return; }
  const W = Math.max(280, host.clientWidth), H = 280, m = {l:6, r:62, t:8, b:22}, pw = W - m.l - m.r, H1 = 150, g = 22, H2 = H - m.t - m.b - H1 - g;
  host.innerHTML = '';
  const root = svg('svg', {width:W, height:H, viewBox:`0 0 ${W} ${H}`, role:'img', 'aria-label':'合约基差 ' + d.symbol}, host);
  const X = i => m.l + (i + .5) * pw / n;
  const lo0 = Math.min(...pts.map(p => Math.min(p.c, p.i))), hi0 = Math.max(...pts.map(p => Math.max(p.c, p.i))), pad = (hi0 - lo0) * .04 || hi0 * .01, lo = lo0 - pad, hi = hi0 + pad;
  const Y = v => m.t + (1 - (v - lo) / (hi - lo)) * H1;
  [0, 1, 2, 3, 4].forEach(k => { const v = lo + (hi - lo) * k / 4; svg('line', {x1:m.l, x2:W - m.r, y1:Y(v), y2:Y(v), stroke:'var(--grid)'}, root); svg('text', {x:W - m.r + 5, y:Y(v) + 4, fill:'var(--muted)', 'font-size':10}, root).textContent = candlePx(v); });
  const line = (key, col) => svg('path', {d:pts.map((p, k) => (k ? 'L' : 'M') + X(k).toFixed(1) + ' ' + Y(p[key]).toFixed(1)).join(''), fill:'none', stroke:col, 'stroke-width':1.3, 'stroke-linejoin':'round'}, root);
  line('i', 'var(--s2)'); line('c', 'var(--s1)');
  const vs = pts.map(val), mean = vs.reduce((a, b) => a + b, 0) / n, bmx = Math.max(1e-12, ...vs.map(Math.abs)) * 1.1, y2 = m.t + H1 + g, B = v => y2 + (1 - (v + bmx) / (2 * bmx)) * H2;
  [-1, 0, 1].forEach(k => { const v = bmx * k; svg('line', {x1:m.l, x2:W - m.r, y1:B(v), y2:B(v), stroke:k === 0 ? 'var(--axis)' : 'var(--grid)'}, root); svg('text', {x:W - m.r + 5, y:B(v) + 4, fill:'var(--muted)', 'font-size':10}, root).textContent = k === 0 ? '0' : fm(v); });
  const bw = Math.max(1, pw / n - (pw / n > 3 ? 1 : 0)); let up = '', dn = '';
  pts.forEach((p, k) => { const a = B(0), b = B(val(p)), sg = 'M' + (X(k) - bw / 2).toFixed(1) + ' ' + Math.min(a, b).toFixed(1) + 'h' + bw.toFixed(1) + 'v' + Math.max(.6, Math.abs(a - b)).toFixed(1) + 'h' + (-bw).toFixed(1) + 'Z'; if (val(p) >= 0) up += sg; else dn += sg; });
  if (up) svg('path', {d:up, fill:'var(--good)', opacity:.85}, root);
  if (dn) svg('path', {d:dn, fill:'var(--bad)', opacity:.85}, root);
  svg('line', {x1:m.l, x2:W - m.r, y1:B(mean), y2:B(mean), stroke:'var(--ink)', 'stroke-dasharray':'3 3'}, root);
  const lastP = pts[n - 1];
  svg('text', {x:m.l + 2, y:y2 - 5, fill:'var(--muted)', 'font-size':10}, root).textContent = (ratioMode ? '价差率' : '基差（' + unit + '）') + ' · 平均 ' + fm(mean) + ' · 最新 ' + fm(val(lastP)) + ' · 最大 ' + fm(Math.max(...vs)) + ' · 最小 ' + fm(Math.min(...vs));
  const fmtT = t => basisBar === '1D' ? t.slice(5, 10) : t.slice(5, 10) + ' ' + t.slice(11, 16);
  [0, Math.floor((n - 1) / 2), n - 1].forEach((i, k) => svg('text', {x:Math.max(m.l, Math.min(W - m.r, X(i))), y:H - 6, 'text-anchor':k === 0 ? 'start' : k === 2 ? 'end' : 'middle', fill:'var(--muted)', 'font-size':10}, root).textContent = fmtT(pts[i].t));
  svg('rect', {x:m.l + 2, y:m.t + 2, width:10, height:3, fill:'var(--s1)'}, root); svg('text', {x:m.l + 16, y:m.t + 7, fill:'var(--ink2)', 'font-size':10}, root).textContent = '合约价格 ' + d.symbol;
  svg('rect', {x:m.l + 2, y:m.t + 14, width:10, height:3, fill:'var(--s2)'}, root); svg('text', {x:m.l + 16, y:m.t + 19, fill:'var(--ink2)', 'font-size':10}, root).textContent = '指数价格 ' + d.index_id;
  const cross = svg('line', {y1:m.t, y2:y2 + H2, stroke:'var(--axis)', visibility:'hidden'}, root);
  const tip = h('div', {class:'tip', style:'display:none'}); host.append(tip);
  const hit = svg('rect', {x:m.l, y:m.t, width:pw, height:y2 + H2 - m.t, fill:'transparent', style:'cursor:crosshair'}, root);
  hit.addEventListener('pointermove', ev => { const r = hit.getBoundingClientRect(), i = Math.max(0, Math.min(n - 1, Math.floor((ev.clientX - r.left) / r.width * n))), p = pts[i];
    cross.setAttribute('x1', X(i)); cross.setAttribute('x2', X(i)); cross.setAttribute('visibility', 'visible');
    const row = (k, v, c) => h('div', {class:'r'}, h('span', {class:'k', style:'background:' + (c || 'transparent')}), k, h('span', {class:'val'}, v));
    const sc = p.b >= 0 ? 'var(--good)' : 'var(--bad)';
    rc(tip, h('div', {class:'t'}, fT(p.t) + (p.done ? '' : '（未走完）')), row('合约价格', candlePx(p.c) + ' ' + unit, 'var(--s1)'), row('指数价格', candlePx(p.i) + ' ' + unit, 'var(--s2)'),
      row('基差', basisFmt(p.b) + ' ' + unit, sc), row('价差率', basisPct(p.r), sc));
    tip.style.display = 'block'; const l = X(i) + 12 + tip.offsetWidth > W ? X(i) - 12 - tip.offsetWidth : X(i) + 12; tip.style.left = Math.max(0, l) + 'px'; tip.style.top = '4px'; });
  hit.addEventListener('pointerleave', () => { cross.setAttribute('visibility', 'hidden'); tip.style.display = 'none'; });
}
/* ---------- 盘口深度 ----------
   机会详情展开时显示：买卖各 200 档、每档的量与 U 估值，以及「拿本金去吃能吃下多少」。
   开著的时候每 5 秒刷一次（走公开行情接口，不需要凭证、不会下单）；收起来就停。 */
const DEPTH_REFRESH = 5000;
let depthTimer = null;
function stopDepth(){ if (depthTimer) { clearInterval(depthTimer); depthTimer = null; } }
function depthBox(symbol, principal){
  const amt = h('input', {type:'number', min:'1', step:'100', value:String(Math.round(Number(principal) || 1000)), 'aria-label':'本金 (USDT)', style:'width:110px'});
  const body = h('div', {}, h('div', {class:'meta'}, '载入中…'));
  const stamp = h('span', {class:'meta'}, '');
  const eatLine = (b, side) => {
    const e = side === 'ask' ? b.eat_ask : b.eat_bid, n = Number(e.qty);
    if (!e.is_enough) return h('div', {class:'down'}, '前 ' + (side === 'ask' ? b.ask_count : b.bid_count) + ' 档只够吃 ' + fN(e.usd_amount) + ' U（' + n.toLocaleString('en-US', {maximumFractionDigits:6}) + ' ' + b.unit + '），本金吃不完');
    return h('div', {}, h('b', {}, n.toLocaleString('en-US', {maximumFractionDigits:6}) + ' ' + b.unit),
      h('span', {class:'sub'}, ' · 均价 ' + Number(e.avg_price).toLocaleString('en-US', {maximumFractionDigits:8})
        + ' · 滑点 ' + fP(e.slippage_ratio, 3) + ' · 吃掉 ' + e.level_count + ' 档'));
  };
  const DEPTH_ROWS = 14;
  const fmtPx = x => Number(x).toLocaleString('en-US', {maximumFractionDigits:8});
  // 一本盘口画成一列（和 OKX 一样）：卖盘在上、价格由高到低，中间是最新价，买盘在下。
  // 累计 U 还在本金以内的档位用深色标出（会被吃掉的部分），刚好跨过本金的那一档画虚线并标上本金数。
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
      mid = h('tr', {class:'mid'}, h('td', {colspan:5}, fmtPx((a0 + b0) / 2), h('span', {class:'sub'}, '  价差 ' + fP((a0 - b0) / ((a0 + b0) / 2), 3))));
    }
    const head = h('thead', {}, h('tr', {}, ['价格', '量 (' + b.unit + ')', '本档 U', '累计 U', ''].map(t => h('th', {}, t))));
    return h('div', {class:'scroll'}, h('table', {class:'dpv'}, head,
      h('tbody', {}, asks.length || bids.length ? [askRows, mid, bidRows] : h('tr', {}, h('td', {colspan:5, class:'todo'}, '没有档位')))));
  };
  const load = async () => {
    try {
      const d = await api('POST', '/finance/market/depth', {inst_id:symbol, amount_usdt:String(amt.value || 1000)});
      rc(stamp, ' · 每 5 秒刷新 · 买卖各取 ' + d.level_limit + ' 档');
      const amount = Number(d.amount_usdt) || Number(amt.value) || 1000;
      rc(body, h('div', {class:'dplegend'}, h('span', {class:'sub'}, '深色 = 前 ' + fN(amount, 0) + ' U 会吃掉的档位，虚线 = 本金刚好吃完的那一档')),
        h('div', {class:'dpbooks'}, d.books.map(b => h('div', {class:'dpcol'},
        h('div', {class:'dphd'}, h('b', {}, b.inst_id), h('span', {class:'sub'}, b.kind === 'SPOT' ? '现货' : (b.ct_val_ccy && /^US/.test(b.ct_val_ccy) ? '币本位 · 一张 ' + b.ct_val + ' ' + b.ct_val_ccy : '合约 · 一张 ' + b.ct_val + ' 币')),
          h('span', {class:'sub'}, ' · 盘口 ' + (fT(b.quoted_at).split(' ')[1] || ''))),
        h('div', {class:'dpeat'}, h('span', {class:'sub'}, b.note.includes('卖盘') ? '本金能买到' : '本金能开空'), eatLine(b, b.note.includes('卖盘') ? 'ask' : 'bid')),
        h('div', {class:'meta'}, '卖盘 ' + b.ask_count + ' 档合计 ' + fN(b.total_ask_usd_amount, 0) + ' U · 买盘 ' + b.bid_count + ' 档合计 ' + fN(b.total_bid_usd_amount, 0) + ' U'),
        book(b, amount)))),
        (d.warnings || []).length ? h('div', {class:'meta down'}, d.warnings.join('；')) : null);
    } catch (e) { rc(body, h('div', {class:'meta down'}, '读不到盘口：' + e.message)); }
  };
  amt.addEventListener('change', () => { load(); });
  stopDepth(); load();
  return h('div', {class:'risk', style:'margin-top:12px'},
    h('div', {class:'hd'}, h('b', {}, '盘口深度'), h('span', {class:'sp'}), h('span', {class:'sub'}, '本金'), amt, h('span', {class:'sub'}, 'USDT')),
    h('div', {class:'meta', style:'margin:2px 0 6px'}, '开仓是「买现货吃卖盘 + 开空单吃买盘」，下面按这个方向算。只看盘口，不下单。', stamp),
    body);
}
function playbookBox(pb){
  const pc = x => fP(x, 3), u = x => Number(x).toFixed(3) + ' U', alt = pb.alternative_exit;
  const row = (no, s, cls) => h('tr', cls ? {class:cls} : {}, h('td', {class:'n'}, no), h('td', {}, s.action), h('td', {}, s.fee_ratio === '' ? '无手续费' : s.fee_name),
    h('td', {class:'n'}, s.fee_ratio === '' ? '—' : pc(s.fee_ratio)), h('td', {class:'n'}, s.fee_ratio === '' ? '—' : u(s.fee_amount)));
  const total = (label, r, a) => h('tr', {style:'font-weight:650'}, h('td', {}), h('td', {colspan:2}, label), h('td', {class:'n'}, pc(r)), h('td', {class:'n'}, u(a)));
  const body = [];
  pb.steps.forEach(s => { body.push(row(s.step_no, s)); if (alt && alt.step_no === s.step_no) body.push(row('或', alt, 'alt')); });
  body.push(total(alt ? '合计（被动交割，表中收益按这个算）' : '合计', pb.total_fee_ratio, pb.total_fee_amount));
  if (alt) body.push(total('合计（' + alt.exit_name + '）', alt.total_fee_ratio, alt.total_fee_amount));
  return h('div', {class:'risk', style:'margin-top:12px'}, h('b', {}, '套利方式：' + pb.method_name), h('div', {class:'meta', style:'margin:2px 0 4px'}, pb.summary),
    h('div', {class:'pbwrap'}, h('table', {class:'pb'}, h('thead', {}, h('tr', {}, h('th', {class:'n'}, '步骤'), h('th', {}, '操作'), h('th', {}, '手续费类型'), h('th', {class:'n'}, '费率'), h('th', {class:'n'}, '金额（名义 ' + fN(pb.notional_amount, 0) + ' U）'))),
      h('tbody', {}, body))),
    alt ? h('div', {class:'meta', style:'margin-top:4px'}, alt.exit_name + '：' + alt.note + '。') : null,
    h('ul', {style:'margin:4px 0 0;padding-left:16px;line-height:1.45'}, pb.notes.map(t => h('li', {}, t))));
}


/* ---------- 币本位资金费率套利排名 ----------
   后端每 30 分钟测一次（费率、价差、盘口、USDT 偏离）并存库；这里按所选本金和持有天数读出每个币的「一单的账」。
   积分 = 预计净年化 ÷ 资金费理论上限 × 100。各因子仅用于模拟展示。 */
let RK = {principal:'', hold:0, only:false, open:null, sort:null}; // 默认显示全部（按预计净年化从高到低）：现在行情下往往一个都不赚钱，只看赚钱的会是空白
try { RK.only = localStorage.getItem('rankOnly') === '1'; } catch (e) {}
try { const t = (localStorage.getItem('rankSort') || '').split(':'); if (t.length === 2 && /^[a-z]+$/.test(t[0]) && (t[1] === 'asc' || t[1] === 'desc')) RK.sort = {k:t[0], dir:t[1]}; } catch (e) {}
const rkP = (v, d = 3) => (Number(v) >= 0 ? '+' : '') + (Number(v) * 100).toFixed(d) + '%';
const rkN = (v, d = 3) => (Number(v) * 100).toFixed(d) + '%';
// USDT 偏离 = 1 − USDT 的美元价：正数 = USDT 比 1 美元便宜
const rkU = v => (Number(v) >= 0 ? '比 1 美元低 ' : '比 1 美元高 ') + (Math.abs(Number(v)) * 100).toFixed(3) + '%';
const RK_PASS_TIP = '「预计赚钱」= 按你选的本金和持有天数，同时满足 5 条：\n① 这个币有现货可以对冲\n② 这个本金在合约盘口吃得满\n③ 近期平均资金费大于 0\n④ USDT 偏离没超过设置的上限\n⑤ 预计净收益大于 0（资金费收入扣掉所有成本后还有剩）\n有一条不过，状态那一格就写没过的原因。';
const RK_HEAD_TIPS0 = ['币本位永续合约。点一行展开：这一单的账、回测账本、费率和价格的对比图', '积分 = 预计净年化 ÷ 资金费理论上限 × 100（0～100）。理论上限 = 资金费一直拿满、又没有任何成本时的年化',
  '回测：假设「计划持有」那么多天前开仓、按现在的条件平仓，这一单的真实盈亏 = 这段时间实际收到的资金费 − 手续费 − 吃盘口 + 开仓价差与平仓价差的差。最多往前看 90 天；历史不够就显示原因。点开一个币看明细',
  '预计一年能净赚多少（扣掉所有成本之后）。右边五列加起来是这一单的预计净收益，再折成年化：÷ 持有天数 × 365', '预计能收到多少资金费。资金费 = 做空永续合约每 8 小时从多头那里收到的一笔钱（费率为正时），是这个套利赚钱的来源。算法：最近 7 天平均每天收到的 × 你选的持有天数，占本金的比例。这是用最近一周推算的预计；实际已发生的看左边「回测盈亏」', '用市价单进出的成本：买卖价差 + 盘口太薄要往深处吃。金额越大越贵；开、平各算一次', '合约相对现货的价差（已按 USDT 换成美元），入场时和平时比：入场比平时差，之后回到平时就亏这一截，反之赚',
  'USDT 自己相对 1 美元的价格（不是合约和现货的价差）：现在和平时比，现在偏得更多就吃亏', '开仓先付的成本（手续费 + 吃盘口 ± 价差 ± USDT）÷ 每天收到的资金费 = 要持有几天才把成本赚回来。比计划持有天数长就不划算',
  '绿色「预计赚钱」要同时满足 5 条（点左边复选框的说明看）。红色是没过的原因，⚠ 是提示'];
// 列顺序：标的 积分 [深度建议本金] 回测盈亏 预计净年化 资金费 手续费 吃盘口 价差回归 USDT 偏离 几天回本 [当前持仓价值] 状态
const RK_HEAD_TIPS = (() => { const t = RK_HEAD_TIPS0.slice();
  t.splice(2, 0, '合约盘口买卖各前 3 档（共 6 档）折 U 的合计 ÷ 6 = 建议本金，和机会列表里的「建议本金」同一个算法。你选的本金超过它越多，开仓越要拆单、滑点越大：\n🟢 不超过 1 倍 = 充足\n🟡 1～2 倍 = 偏薄\n🔴 超过 2 倍 = 过薄，不建议做这么大\n积分里已经把「吃盘口」的成本算进去了；这一列直接告诉你盘口能承受多大金额。');
  t.splice(t.length - 1, 0, 'OKX 上这个永续合约全市场的总持仓量（open interest）折 U：所有人未平仓的合约合计，不是你自己的仓位。越大说明这个合约越活跃、能容纳的资金越多；很小说明市场冷清，进出都吃亏。和左边「深度建议本金」一起看：深度是此刻盘口能吃多少，持仓量是整个市场有多大。下面小字：你选的本金占它的比例。数据来自 OKX 公开接口，5 分钟更新一次。');
  return t; })();
const RK_SORTS = {symbol:e => e.base_coin, score:e => e.is_fillable ? Number(e.score) : null, depth:e => Number(e.depth3_usd_amount) > 0 ? Number(e.depth3_usd_amount) / 6 : null,
  back:e => e.backtest && e.backtest.is_ok ? Number(e.backtest.net_profit_ratio) : null, netapr:e => e.is_fillable ? Number(e.net_apr) : null,
  funding:e => Number(e.funding_income_ratio), fee:e => Number(e.fee_ratio), slip:e => e.is_fillable ? Number(e.slippage_ratio) : null, basis:e => Number(e.basis_reversion_ratio),
  usdt:e => Number(e.usdt_deviation_ratio), be:e => e.break_even_days === '' ? null : Number(e.break_even_days), oi:e => e.open_interest_usd_amount === '' ? null : Number(e.open_interest_usd_amount), status:e => e.is_pass ? 1 : 0};
const RK_COLS = [['symbol', '标的'], ['score', '积分'], ['depth', '深度建议本金'], ['back', '回测盈亏'], ['netapr', '预计净年化'], ['funding', '＋资金费收入'], ['slip', '−吃盘口（开＋平）'],
  ['basis', '±价差回归'], ['usdt', '±USDT 偏离'], ['be', '几天回本'], ['oi', 'OKX 持仓量（折 U）'], ['status', '状态']];
// 按列排序：没有值的永远排最后；点一下降序，再点升序，第三下恢复默认（可做的在前、预计净年化从高到低）
function rkSorted(list){
  if (!RK.sort || !RK_SORTS[RK.sort.k]) return list;
  const g = RK_SORTS[RK.sort.k], dir = RK.sort.dir === 'asc' ? 1 : -1;
  return list.map((e, i) => ({e, i, v:g(e)})).sort((a, b) => {
    if (a.v === null || a.v === undefined) return b.v === null || b.v === undefined ? a.i - b.i : 1;
    if (b.v === null || b.v === undefined) return -1;
    const c = typeof a.v === 'string' ? a.v.localeCompare(b.v) : a.v - b.v;
    return c ? c * dir : a.i - b.i; }).map(x => x.e);
}
const RK_FACTORS = [
  ['① 资金费少收', '费率贴著下限 0.01%/8h 才收得满，低于它就是少收（转负则倒付）', '模拟数据', '近 N 天平均费率 × 持有天数；另看负费率占比判断稳不稳', '进积分'],
  ['② 手续费', '现货买入、合约开空、卖出各收一次，与标的无关', '模拟数据', '2 ×（现货吃单 + 合约吃单），除以持有天数；持有越短越重', '进积分'],
  ['③ 开平仓价差', '开仓合约比现货便宜多少、平仓又回多少。由两部分组成：入场基差与平时的差，加上吃盘口', '模拟数据', '现在的基差 − 近 M 天中位数基差；吃盘口 = 当前盘口来回各做一次市价单，金额越大盘口越薄越贵', '进积分'],
  ['④ USDT 偏离', 'USDT 这个币自己相对 1 美元的价格（不是合约和现货的价差）。现货用 USDT 买、合约按美元算，USDT 比 1 美元便宜越多，开仓换算越吃亏', '模拟数据', '看 USDT 现在比 1 美元低多少，和近 M 天的平时水平比；比平时更低＝入场吃亏；超过上限时直接不推荐开新仓', '进积分'],
  ['⑤ 建仓不对齐', '建仓要几天，期间现货比空单多，价格跌就亏', '模拟数据', '事先算不准，只提示「本金超过盘口前 3 档」要拆单', '只提示'],
  ['⑥ 资金币贬值 ↔ 补空', '币本位收到的资金费是币，币跌就缩水；每天补小额空单对冲', '模拟数据', '做法问题不是选币问题，每天补空，净影响接近 0', '只提示']];
function rkFactorBox(d){
  const c = d.config;
  return h('details', {style:'margin:6px 0'}, h('summary', {style:'cursor:pointer;font-weight:600'}, '积分怎么算、每个因子是什么（点开）'),
    h('div', {class:'foot', style:'margin:6px 0;line-height:1.8'}, '预计净收益 = 资金费收入 − 手续费 − 开平仓吃盘口 ± 价差回归 ± USDT 偏离',
      h('br'), '预计净年化 = 预计净收益 ÷ 持有天数 × 365',
      h('br'), h('b', {}, '积分 = 预计净年化 ÷ ' + rkN(d.apr_cap_ratio, 2) + ' × 100'), '（0～100）。' + rkN(d.apr_cap_ratio, 2) + ' 是资金费一直拿满上限又没有任何成本时的年化，积分就是你能拿到理论上限的百分之几；预计为负记 0 分。'),
    h('div', {class:'scroll'}, h('table', {class:'rkfac'}, h('thead', {}, h('tr', {}, ['因子', '是什么', '示例影响（Mock）', '开仓前怎么量', '']
      .map(t => h('th', {}, t)))), h('tbody', {}, RK_FACTORS.map(r => h('tr', {}, r.map((t, i) => h(i === 0 ? 'th' : 'td', {}, t))))))),
    h('div', {class:'foot'}, '入场基差和盘口深度要一起看：基差是两边中间价的差，真正开仓的价差 = 基差 再加上吃盘口。基差只有 −0.07%、盘口薄的话实际可能是 −0.3%。基差也不是越高越好，要和平时水平比：入场时比平时差，之后回到平时，差的这一截才是亏损。'),
    h('div', {class:'foot'}, '目前设置：近 ' + c.funding_days + ' 天平均费率（预估打折 ' + c.funding_factor + '）· 平时基差看 ' + c.basis_days + ' 天 · 吃盘口预估打折 ' + c.slippage_factor + ' · USDT 偏离上限 ' + rkN(c.usdt_deviation_max_ratio, 2) + '。在「参数设置」里改，保存后立即生效。'),
    h('div', {class:'foot'}, '「占损失」比例只来自 模拟示例，是起点；实际情况应根据自己的交易重新计算。吃盘口按市价单算，偏贵；慢慢挂单建仓会比预计好。'));
}
function rkLedger(e, d){
  const day = Number(e.funding_income_ratio) / (d.hold_days || 1), bn = Number(e.basis_now_ratio), bm = Number(e.basis_norm_ratio);
  const items = [
    ['资金费收入', Number(e.funding_income_ratio), '近 ' + d.config.funding_days + ' 天平均每天收 ' + rkN(day, 4) + '，乘 ' + d.hold_days + ' 天'],
    ['手续费', -Number(e.fee_ratio), '现货买、合约开空、合约平空、现货卖，共 4 次吃单费'],
    ['开仓 + 平仓吃盘口', -Number(e.slippage_ratio), '用市价单进出，吃掉买卖价差和薄盘口的损失（开一次、平一次）'],
    ['价差回归', Number(e.basis_reversion_ratio), '合约相对现货的价差：现在 ' + rkN(bn) + '、平时 ' + rkN(bm) + '。' + (bn < bm ? '现在比平时更便宜，之后回到平时，空单要亏这一截' : bn > bm ? '现在比平时更贵，之后回到平时，空单赚这一截' : '和平时一样，没有影响')],
    ['USDT 偏离', Number(e.usdt_deviation_ratio), 'USDT ' + rkU(d.usdt_deviation_now_ratio) + '（平时 ' + rkU(d.usdt_deviation_norm_ratio) + '）。' + (Number(e.usdt_deviation_ratio) < 0 ? '现在比平时偏得更多，入场换算吃亏' : Number(e.usdt_deviation_ratio) > 0 ? '现在比平时偏得少，入场换算占点便宜' : '和平时一样')]];
  return rkGrid(items, Number(e.net_profit_ratio), '预计净收益');
}
// 账本网格：每行 = 名称 + 一句白话，中间一根红绿条，右边是占名义价值的比例；最后一行是合计
function rkGrid(items, net, netLabel){
  const sc = Math.max(...items.map(i => Math.abs(i[1])), Math.abs(net), 1e-9), cells = [];
  items.forEach(([t, v, hint]) => cells.push(h('span', {}, t, h('span', {style:'display:block;font-size:11px;font-weight:400;opacity:.75;line-height:1.4'}, hint)), h('span', {class:'bz'}, h('i', {style:(v >= 0 ? 'left:50%;background:var(--good)' : 'right:50%;background:var(--bad)') + ';width:' + (Math.abs(v) / sc * 48) + '%'})), h('span', {class:'n ' + (v >= 0 ? 'up' : 'down')}, rkP(v))));
  cells.push(h('b', {}, netLabel), h('span'), h('b', {class:'n ' + (net >= 0 ? 'up' : 'down')}, rkP(net)));
  return h('div', {class:'rkled'}, cells);
}
// 回测账：N 天前开仓、现在平仓。数据全是真实的：资金费 = 这段时间实际结算的每一期，价差 = 开仓那天日线收盘和现在盘口
function rkBackLedger(e, d){
  const b = e.backtest;
  if (!b.is_ok) return h('div', {class:'foot'}, '回测：' + b.reason);
  const n = Number(b.net_profit_ratio), u = n * Number(d.principal_amount);
  const bo = Number(b.open_basis_ratio), bn = Number(b.now_basis_ratio);
  const items = [
    ['资金费收入（实际）', Number(b.funding_ratio), '这 ' + b.days + ' 天实际结算了 ' + b.funding_period_count + ' 期，其中 ' + b.negative_period_count + ' 期为负（空头倒付）'],
    ['手续费', -Number(b.fee_ratio), '现货买、合约开空、合约平空、现货卖，共 4 次吃单费'],
    ['开仓 + 平仓吃盘口', -Number(b.slippage_ratio), '按现在的盘口、' + Number(d.principal_amount).toLocaleString() + ' U 用市价单来回各做一次估的'],
    ['开仓价差 vs 平仓价差', Number(b.spread_ratio), '开仓那天合约比现货 ' + (bo < 0 ? '便宜 ' : '贵 ') + rkN(Math.abs(bo)) + '，现在 ' + (bn < 0 ? '便宜 ' : '贵 ') + rkN(Math.abs(bn)) + '。开仓时越贵、平仓时越便宜，空单越赚；反过来就亏'],
  ];
  const grid = rkGrid(items, n, '回测净盈亏');
  // 「其中」两行不重复进合计：放在价差那一行的下面当说明
  const sub = h('div', {class:'foot', style:'margin-top:4px'}, '价差损益的来源：USDT 因素 ' + rkP(b.usdt_part_ratio) + '，合约真折价 ' + rkP(b.contract_part_ratio) + '。');
  return h('div', {}, h('b', {}, e.base_coin + ' 回测：' + b.days + ' 天前（' + String(b.open_at).slice(5, 10) + '）开仓，按现在的条件平仓'),
    h('span', {class:'sub', style:'display:inline;margin-left:8px'}, '本金 ' + Number(d.principal_amount).toLocaleString() + ' U · 约 ' + (u >= 0 ? '+' : '') + fN(u, 0) + ' U · 折年化 ' + rkP(b.net_apr, 1)),
    h('div', {style:'margin-top:8px'}, grid), sub,
    h('div', {class:'foot'}, '说明：资金费用的是这段时间真实结算的每一期；开仓价差取开仓那天日线收盘的合约 ÷ 现货，平仓价差取现在的盘口中间价（两边都含 USDT 因素，为模拟计算口径）；手续费固定按设置里的费率，吃盘口按现在的盘口。这是「如果当时开了」的事后账，不代表以后。币本位收到的是币，币价变动和补空的影响没算进来。'));
}
/* 费率 × K 线 同步对比：三张图共用横轴和十字线。上 = 合约与现货收盘价，中 = 价差（合约 ÷ 现货 − 1），下 = 每期已结算的资金费率。
   费率来自本地库（自存，不受交易所只保留约 98 天的限制），K 线来自交易所。 */
function rkCompareBox(symbol){
  const bar = '4H';
  let range = 0;
  const host = h('div', {class:'rkcmp'}, h('div', {class:'meta'}, '读取中…')), box = h('div', {style:'margin-top:14px;padding-top:10px;border-top:1px solid var(--border)'});
  const seg = (items, cur, set) => h('div', {class:'seg'}, items.map(([k, v]) => h('button', {type:'button', 'aria-pressed':String(cur === k), onclick:guard(async () => { set(k); await load(); })}, v)));
  const head = h('div', {class:'hd', style:'margin-bottom:4px'});
  const load = async () => {
    rc(head, h('b', {}, symbol + ' 资金费率 × K 线 同步对比'), h('span', {class:'sp'}), seg([[0, '全部'], [60, '60 天'], [30, '30 天'], [14, '14 天']], range, k => range = k), h('span', {class:'meta'}, '4 小时线'));
    let fh, cd;
    try { [fh, cd] = await Promise.all([api('POST', '/finance/market/funding-history', {symbol, days:1000}), api('POST', '/finance/market/candles', {symbol, bar})]); }
    catch (e) { rc(host, h('div', {class:'meta'}, '读取失败：' + e.message)); return; }
    const fr = fh.list.map(p => [Date.parse(p.time), Number(p.rate)]);
    if (fr.length < 2) { rc(host, h('div', {class:'meta'}, '本地资金费率历史只有 ' + fr.length + ' 期，暂时画不出对比')); return; }
    const t1 = fr[fr.length - 1][0];
    let t0 = fr[0][0]; // 全部 = 费率历史的起点（OKX 只提供约 98 天，之后会越存越长）
    if (range) t0 = Math.max(t0, t1 - range * 864e5);
    const ser = k => ((cd.series.find(x => x.kind === k) || {}).list || []).map(c => [Date.parse(c.time), Number(c.close)]).filter(c => c[0] >= t0 && c[0] <= t1 + 864e5);
    const ct = ser('CONTRACT'), sp = ser('SPOT'), fs = fr.filter(p => p[0] >= t0);
    if (ct.length < 2) { rc(host, h('div', {class:'meta'}, 'K 线读不到：' + (cd.warnings || []).join('；'))); return; }
    const spMap = new Map(sp.map(p => [p[0], p[1]])), bs = ct.filter(p => spMap.has(p[0])).map(p => [p[0], p[1] / spMap.get(p[0]) - 1]);
    draw(ct, sp, bs, fs, t0, t1 + 144e5);
  };
  const draw = (ct, sp, bs, fs, t0, t1) => {
    const W = Math.max(320, host.clientWidth || 900), L = 56, R = 10, X = t => L + (t - t0) / (t1 - t0) * (W - L - R), panels = [[8, 150], [180, 70], [262, 90]], H = 360;
    const root = svg('svg', {width:W, height:H, viewBox:`0 0 ${W} ${H}`, role:'img', 'aria-label':symbol + ' 资金费率与 K 线同步对比'});
    const scale = (vals, top, hh, pad = 0.06) => { let lo = Math.min(...vals), hi = Math.max(...vals); const sp2 = (hi - lo) || Math.abs(hi) || 1; lo -= sp2 * pad; hi += sp2 * pad; return [v => top + hh * (1 - (v - lo) / (hi - lo)), lo, hi]; };
    const grid = (Y, lo, hi, top, hh, fmt) => niceTicks(lo, hi, 3).filter(v => v >= lo && v <= hi).forEach(v => { svg('line', {x1:L, x2:W - R, y1:Y(v), y2:Y(v), stroke:'var(--grid)'}, root); svg('text', {x:L - 6, y:Y(v) + 4, 'text-anchor':'end', fill:'var(--muted)', 'font-size':11}, root).textContent = fmt(v); });
    const [Y1, lo1, hi1] = scale(ct.map(p => p[1]).concat(sp.map(p => p[1])), panels[0][0], panels[0][1]); grid(Y1, lo1, hi1, ...panels[0], v => v >= 100 ? v.toFixed(0) : v.toPrecision(4));
    const line = (pts, Y, col, w) => svg('path', {d:pts.map((p, i) => (i ? 'L' : 'M') + X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1)).join(''), fill:'none', stroke:col, 'stroke-width':w, 'stroke-linejoin':'round'}, root);
    if (sp.length > 1) line(sp, Y1, 'var(--muted)', 1.4); line(ct, Y1, 'var(--s1)', 1.8);
    svg('text', {x:L + 4, y:panels[0][0] + 12, fill:'var(--ink2)', 'font-size':11}, root).textContent = '价格：蓝 = 合约　灰 = 现货（USDT）';
    if (bs.length > 1) { const [Y2, lo2, hi2] = scale(bs.map(p => p[1]).concat([0]), panels[1][0], panels[1][1]); grid(Y2, lo2, hi2, ...panels[1], v => (v * 100).toFixed(2) + '%');
      svg('line', {x1:L, x2:W - R, y1:Y2(0), y2:Y2(0), stroke:'var(--ink2)', 'stroke-dasharray':'3 3'}, root); line(bs, Y2, 'var(--s2, #b8860b)', 1.5);
      svg('text', {x:L + 4, y:panels[1][0] + 12, fill:'var(--ink2)', 'font-size':11}, root).textContent = '价差：合约 ÷ 现货 − 1'; }
    const fm = Math.max(...fs.map(p => Math.abs(p[1])), 1e-9), Y3 = v => panels[2][0] + panels[2][1] * (1 - (v + fm) / (2 * fm));
    grid(Y3, -fm, fm, ...panels[2], v => (v * 100).toFixed(3) + '%'); svg('line', {x1:L, x2:W - R, y1:Y3(0), y2:Y3(0), stroke:'var(--ink2)', 'stroke-dasharray':'3 3'}, root);
    const bw = Math.max(1.5, (W - L - R) / fs.length * 0.7);
    fs.forEach(p => svg('rect', {x:X(p[0]) - bw / 2, y:Math.min(Y3(p[1]), Y3(0)), width:bw, height:Math.max(1, Math.abs(Y3(p[1]) - Y3(0))), fill:p[1] >= 0 ? 'var(--good)' : 'var(--bad)'}, root));
    svg('text', {x:L + 4, y:panels[2][0] + 12, fill:'var(--ink2)', 'font-size':11}, root).textContent = '资金费率（每期已结算；绿 ≥ 0，红 < 0）';
    for (let i = 0; i <= 4; i++) { const t = t0 + (t1 - t0) * i / 4; svg('text', {x:X(t), y:H - 4, 'text-anchor':i === 0 ? 'start' : i === 4 ? 'end' : 'middle', fill:'var(--muted)', 'font-size':11}, root).textContent = dShort(t); }
    const cross = svg('line', {y1:4, y2:H - 16, stroke:'var(--axis)', visibility:'hidden'}, root), rd = h('div', {class:'rkrd'}, h('span', {class:'meta'}, '滑鼠移到图上，看同一时刻的价格、价差和费率'));
    const hit = svg('rect', {x:L, y:0, width:W - L - R, height:H - 16, fill:'transparent', style:'cursor:crosshair'}, root);
    const near = (arr, t) => arr.reduce((b, p) => Math.abs(p[0] - t) < Math.abs(b[0] - t) ? p : b, arr[0]);
    hit.addEventListener('pointermove', ev => { const r = hit.getBoundingClientRect(), t = t0 + (ev.clientX - r.left) / r.width * (t1 - t0), c = near(ct, t), f = near(fs, t), b = bs.length ? near(bs, t) : null;
      cross.setAttribute('x1', X(t)); cross.setAttribute('x2', X(t)); cross.setAttribute('visibility', 'visible');
      rc(rd, h('b', {}, dFull(t)), h('span', {}, '合约 ' + c[1]), b ? h('span', {}, '价差 ' + (b[1] * 100).toFixed(3) + '%') : null, h('span', {class:f[1] >= 0 ? 'up' : 'down'}, '最近一期费率 ' + (f[1] * 100).toFixed(4) + '%（' + dFull(f[0]).slice(5) + '）')); });
    hit.addEventListener('pointerleave', () => { cross.setAttribute('visibility', 'hidden'); });
    rc(host, rd, root);
  };
  box.append(head, host, h('div', {class:'foot'}, '费率来自本地库（后端同步时自存，交易所只保留约 98 天，不存就丢，所以从现在起会越存越长）；K 线是 4 小时线，取最近 600 根（约 100 天），刚好盖住费率历史。价差用同一时间的合约收盘价与现货收盘价相除，现货是 USDT 价，未换算 USDT/USD。'));
  queueMicrotask(() => load().catch(e => rc(host, h('div', {class:'meta'}, e.message))));
  return box;
}
async function loadRank(){
  const fresh = latest('rank');
  const d = await api('POST', '/finance/funding-rank/list', {principal_amount:RK.principal, hold_days:RK.hold});
  if (!fresh() || OPP_TAB !== 'rank') return; // 已经切到别的选项卡
  RK.principal = d.principal_amount; RK.hold = d.hold_days;
  OPP_COUNTS.rank = d.total; drawOppTabs();
  const host = $('#rank'), rows = [], list = rkSorted(RK.only ? d.list.filter(e => e.is_pass) : d.list);
  list.forEach(e => {
    const open = RK.open === e.symbol, sc = Number(e.score), net = Number(e.net_apr);
    rows.push(h('tr', {class:'opp' + (e.is_pass ? '' : ' dim'), onclick:guard(async () => { RK.open = open ? null : e.symbol; await loadRank(); })},
      h('td', {class:'sym'}, h('div', {class:'coin'}, h('span', {class:'dot' + (e.is_pass ? '' : ' no')}), h('div', {}, (open ? '▾ ' : '▸ ') + e.base_coin, h('span', {class:'sub'}, e.symbol + (e.is_stale ? ' · 数据过期' : ''))))),
      h('td', {class:'n', title:'积分 = 预计净年化 ÷ ' + rkN(d.apr_cap_ratio, 2) + ' × 100'}, e.is_fillable ? h('div', {class:'sc'}, h('b', {}, sc.toFixed(1)), h('span', {class:'bar2'}, h('i', {style:'width:' + Math.min(100, sc) + '%'}))) : '—'),
      (() => { const sug = Number(e.depth3_usd_amount) / 6, pr = Number(d.principal_amount), r = sug > 0 ? pr / sug : Infinity, L = r <= 1 ? ['🟢', '充足', 'good'] : r <= 2 ? ['🟡', '偏薄', 'warn'] : ['🔴', '过薄', 'bad'];
        if (!(sug > 0)) return h('td', {class:'n', title:'没有盘口数据'}, '—');
        return h('td', {class:'n', title:'合约盘口买卖各前 3 档（共 6 档）折 U 合计 ' + fN(Number(e.depth3_usd_amount), 0) + ' U ÷ 6 = 建议本金 ' + fN(sug, 0) + ' U。\n你选的本金 ' + fN(pr, 0) + ' U 是它的 ' + r.toFixed(1) + ' 倍：' + L[1] + (r > 1 ? '，开仓建议拆单、分批建仓' : '，盘口承受得住')},
          h('span', {class:'liqmain ' + L[2]}, L[0] + ' ' + fN(sug, 0) + ' U'), h('span', {class:'sub hi'}, L[1] + ' · ' + r.toFixed(1) + ' 倍')); })(),
      (() => { const b = e.backtest;
        if (!b || !b.is_ok) return h('td', {class:'n', title:'回测：' + (b ? b.reason : '没有数据')}, '—', h('span', {class:'sub'}, b ? (b.reason.length > 14 ? b.reason.slice(0, 13) + '…' : b.reason) : ''));
        const bn = Number(b.net_profit_ratio), u = bn * Number(d.principal_amount);
        return h('td', {class:'n ' + (bn >= 0 ? 'up' : 'down'), style:'font-weight:650', title:b.days + ' 天前开仓、现在平仓：资金费 ' + rkP(b.funding_ratio) + '（实际 ' + b.funding_period_count + ' 期）− 手续费 ' + rkN(b.fee_ratio) + ' − 吃盘口 ' + rkN(b.slippage_ratio) + ' + 价差损益 ' + rkP(b.spread_ratio) + ' = ' + rkP(bn) + '（折年化 ' + rkP(b.net_apr, 1) + '）'},
          rkP(bn, 2), h('span', {class:'sub'}, (u >= 0 ? '+' : '') + fN(u, 0) + ' U')); })(),
      h('td', {class:'n ' + (net >= 0 ? 'up' : 'down')}, e.is_fillable ? rkP(net, 1) : '—'),
      h('td', {class:'n'}, rkP(e.funding_income_ratio)),
      h('td', {class:'n mu', title:'本金 ' + d.principal_amount + ' U 在当前盘口来回各做一次市价单'}, e.is_fillable ? '−' + rkN(e.slippage_ratio) : '吃不满'),
      h('td', {class:'n mu'}, rkP(e.basis_reversion_ratio)),
      h('td', {class:'n mu'}, rkP(e.usdt_deviation_ratio)),
      (() => { const cost = Number(e.fee_ratio) + Number(e.slippage_ratio) - Number(e.basis_reversion_ratio) - Number(e.usdt_deviation_ratio), day = Number(e.funding_income_ratio) / (d.hold_days || 1);
        return h('td', {class:'n', title:e.break_even_days === '' ? '近期平均资金费不为正，永远回不了本' : '开仓先付的成本 ' + rkN(cost) + '（手续费 ' + rkN(e.fee_ratio) + ' + 吃盘口 ' + rkN(e.slippage_ratio) + ' ' + (Number(e.basis_reversion_ratio) <= 0 ? '+ 价差 ' + rkN(-Number(e.basis_reversion_ratio)) : '− 价差 ' + rkN(e.basis_reversion_ratio)) + ' ' + (Number(e.usdt_deviation_ratio) <= 0 ? '+ USDT ' + rkN(-Number(e.usdt_deviation_ratio)) : '− USDT ' + rkN(e.usdt_deviation_ratio)) + '）\n÷ 每天收到的资金费 ' + rkN(day, 4) + '\n= ' + e.break_even_days + ' 天'}, e.break_even_days === '' ? '—' : e.break_even_days + ' 天'); })(),
      (() => { const v = e.open_interest_usd_amount === '' ? null : Number(e.open_interest_usd_amount), pr = Number(d.principal_amount);
        if (v === null) return h('td', {class:'n', title:'没取到 OKX 的持仓量数据（公开接口暂时不可用），不影响排名'}, '—');
        return h('td', {class:'n', title:'OKX 上 ' + e.symbol + ' 全市场总持仓量约 ' + fN(v, 0) + ' U（所有人未平仓的合计，不是你自己的仓位）。\n你选的本金 ' + fN(pr, 0) + ' U 占它的 ' + (pr / v * 100).toFixed(4) + '%，占比越小，对市场的冲击越小。'},
          fK(v) + ' U', h('span', {class:'sub hi'}, '本金占 ' + (pr / v * 100).toFixed(3) + '%')); })(),
      h('td', {}, h('span', {class:'tag ' + (e.is_pass ? 'good' : 'bad'), title:e.reasons.join('\n')}, e.is_pass ? '预计赚钱' : '不推荐'), e.is_pass ? null : h('span', {class:'sub', title:e.reasons.join('\n')}, (e.reasons[0] || '').length > 16 ? e.reasons[0].slice(0, 15) + '…' : e.reasons[0] || ''), e.warnings.length ? h('span', {class:'sub', title:e.warnings.join('\n')}, '⚠ ' + e.warnings.length + ' 条提示') : null)));
    if (open) rows.push(h('tr', {class:'det'}, h('td', {colspan:12}, rkDetail(e, d))));
  });
  rc(host, h('div', {class:'bar obar'}, h('label', {class:'chk'}, '本金', h('select', {'aria-label':'本金', onchange:guard(async ev => { RK.principal = ev.target.value; await loadRank(); })},
        d.principal_options.map(o => h('option', {value:o, selected:o === d.principal_amount}, Number(o).toLocaleString() + ' U')))),
      h('label', {class:'chk'}, '计划持有', h('select', {'aria-label':'计划持有天数', onchange:guard(async ev => { RK.hold = Number(ev.target.value); await loadRank(); })},
        [...new Set([7, 14, 30, 60, 90, d.hold_days])].sort((a, b) => a - b).map(o => h('option', {value:o, selected:o === d.hold_days}, o + ' 天')))),
      h('label', {class:'chk'}, h('input', {type:'checkbox', checked:RK.only, onchange:guard(async ev => { RK.only = ev.target.checked; try { localStorage.setItem('rankOnly', RK.only ? '1' : '0'); } catch (e) {} await loadRank(); })}), h('span', {title:RK_PASS_TIP}, '只看预计赚钱的')), h('span', {class:'sp'}),
      h('span', {class:'chip', title:'现货买、合约开空、合约平空、现货卖，共 4 次吃单手续费。所有币都一样，所以不再单独占一列'}, '手续费 ', h('b', {}, rkN(d.fee_round_trip_ratio)), ' 固定'),
      h('span', {class:'chip' + (Number(d.usdt_deviation_now_ratio) > Number(d.config.usdt_deviation_max_ratio) ? ' warn' : ''), title:'USDT 这个币自己相对 1 美元的价格，不是合约和现货的价差。\n现货用 USDT 买、合约按美元算：USDT 比 1 美元便宜越多，开仓换算越吃亏。\n超过上限 ' + rkN(d.config.usdt_deviation_max_ratio, 2) + ' 时，所有币都标「不推荐」'}, 'USDT ', h('b', {}, rkU(d.usdt_deviation_now_ratio))),
      h('span', {class:'chip good'}, '预计赚钱 ', h('b', {}, String(d.pass_count)), ' / ' + d.total),
      h('span', {class:'chip'}, d.measured_at ? '测量于 ' + d.measured_at.slice(5, 16).replace('T', ' ') + ' JST' : '还没有测量值')),
    h('details', {class:'help'}, h('summary', {}, '看不懂？先读这几个词（点开）'), h('div', {class:'hbody'}, h('b', {}, '预计赚钱'), '：按你选的本金和持有天数，① 有现货可对冲 ② 本金盘口吃得满 ③ 近期平均资金费大于 0 ④ USDT 偏离没超上限 ⑤ 扣完所有成本后预计净收益大于 0，五条都过才标绿。', h('br'),
      h('b', {}, '几天回本'), '：开仓一定先付的成本（手续费、吃盘口、价差、USDT 的影响）÷ 每天收到的资金费。比如成本 0.6%、每天收 0.025%，约 24 天；你计划持有的天数比它短，就赚不回成本。鼠标放在那一格上看具体算式。', h('br'),
      h('b', {}, '回测盈亏'), '：假设你选的「计划持有」那么多天前就开了仓、按现在的条件平仓，这一单实际会赚或亏多少（资金费用真实结算的每一期，价差用开仓那天和现在的对比，手续费和吃盘口按固定规则）。它是事后账，用来检验预计；最多回看 90 天。', h('br'),
      h('b', {}, '价差'), '：合约价格相对现货价格的差（已按 USDT 换成美元）。负数 = 合约比现货便宜。入场时的价差和「平时」比，差的那一截会在回归时变成赚或亏。', h('br'),
      h('b', {}, 'USDT 偏离'), '：不是合约和现货的价差，而是 USDT 这个币自己相对 1 美元的价格，例如「比 1 美元低 0.105%」。现货用 USDT 买、合约按美元算，USDT 偏得越多，开仓换算越吃亏；超过上限（默认 ' + rkN(d.config.usdt_deviation_max_ratio, 2) + '）就全部标不推荐。')),
    rkFactorBox(d),
    h('div', {class:'scroll'}, h('table', {class:'tbl-a'}, h('thead', {}, h('tr', {class:'grp'}, h('th'), h('th', {colspan:3, class:'g1'}, h('span', {}, '结论')), h('th', {colspan:5, class:'g2'}, h('span', {}, '预计账（占本金比例）')), h('th', {colspan:3, class:'g3'}, h('span', {}, '参考'))), h('tr', {}, RK_COLS.map(([key, label], i) => { const on = RK.sort && RK.sort.k === key;
        return h('th', {class:i && i < 12 ? 'n' : '', title:RK_HEAD_TIPS[i] + '\n点一下按这一列排序（降序），再点升序，第三下恢复默认。', 'aria-sort':on ? (RK.sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'},
          h('button', {class:'sort', type:'button', onclick:guard(async () => {
            RK.sort = !on ? {k:key, dir:'desc'} : RK.sort.dir === 'desc' ? {k:key, dir:'asc'} : null;
            try { localStorage.setItem('rankSort', RK.sort ? RK.sort.k + ':' + RK.sort.dir : ''); } catch (e) {}
            await loadRank(); })}, label, h('span', {class:'arr'}, on ? (RK.sort.dir === 'asc' ? ' ▲' : ' ▼') : ' ⇅'))); }))),
      h('tbody', {}, rows.length ? rows : h('tr', {}, h('td', {colspan:12, class:'todo'}, d.total === 0 ? '还没有测量值：等后端第一次测量（约 1～2 分钟），或确认 qa_agg_funding_rank 已建表' : '现在没有预计赚钱的币；取消「只看预计赚钱的」可以看全部，或换更长的持有天数 / 更小的本金'))))),
    h('div', {class:'foot'}, '一行 = 一单的账，占名义价值的比例。吃盘口 = 用市价单在当前盘口来回各做一次的成本（含买卖价差），金额越大、盘口越薄越贵；本金只能选设置里配置的几档（盘口只量了这几档）。点一行看完整账、测量值和费率 × K 线对比。点表头可以排序。仅供参考，本工具只读、不下单。'));
}
function rkDetail(e, d){
  const m = [['近 ' + d.config.funding_days + ' 天日均费率', rkN(e.funding_daily_ratio, 4) + '（' + e.funding_period_count + ' 期，负费率占 ' + rkN(e.negative_funding_ratio, 0) + '）'],
    ['现在基差 / 平时基差', rkN(e.basis_now_ratio) + ' / ' + rkN(e.basis_norm_ratio)], ['合约盘口买卖各前 3 档', fN(e.depth3_usd_amount, 0) + ' U'], ['测量时间', e.measured_at ? e.measured_at.replace('T', ' ').slice(0, 16) + ' JST' : '—']];
  return h('div', {}, h('b', {}, e.base_coin + ' 这单的账'), h('span', {class:'sub', style:'display:inline;margin-left:8px'}, '本金 ' + Number(d.principal_amount).toLocaleString() + ' U · 持有 ' + d.hold_days + ' 天 · 占名义价值的比例'),
    h('div', {class:'rkcols', style:'margin-top:8px'}, h('div', {}, rkLedger(e, d)), h('div', {}, rkBackLedger(e, d))),
    h('div', {class:'foot', style:'margin-top:8px'}, '预计净年化 ' + rkP(e.net_apr, 1) + ' ÷ ' + rkN(d.apr_cap_ratio, 2) + ' = 积分 ' + (e.is_fillable ? Number(e.score).toFixed(1) : '—') + (e.reasons.length ? '。不推荐原因：' + e.reasons.join('；') : '')),
    e.is_stale ? h('div', {class:'foot', style:'color:var(--bad)'}, '这次测量失败，用的是上一次的值：' + e.error_message) : null,
    h('div', {class:'foot'}, m.map(([k, v]) => k + ' ' + v).join(' · ')), rkCompareBox(e.symbol));
}


QuantDemo.ready.then(() => { drawOppTabs(); document.querySelectorAll('#opps [data-pane]').forEach(p => {p.hidden = p.dataset.pane !== OPP_TAB;}); return loadOppTab(); }).catch(error => say('快照加载失败：' + error.message));
window.addEventListener('pagehide', stopDepth);
