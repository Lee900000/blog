(() => {
  'use strict';
  // [skill: dev-dna] 展示已采集的用量，缺失日期不推断为零。
  const el = (tag, cls, text) => { const node = document.createElement(tag); if (cls) node.className = cls; if (text !== undefined) node.textContent = text; return node; };
  const formatter = new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 2 });
  const compact = value => { const number = Number(value || 0); if (number >= 1e8) return `${formatter.format(number / 1e8)} 亿`; if (number >= 1e4) return `${formatter.format(number / 1e4)} 万`; return new Intl.NumberFormat('zh-CN').format(number); };
  const amount = compact;
  const stat = (label, value, accent = false) => { const node = el('div', `token-stat${accent ? ' token-stat-accent' : ''}`); node.append(el('span', '', label), el('strong', '', value)); return node; };
  const dayTotal = day => ['inputTokens', 'outputTokens', 'cacheCreationTokens', 'cacheReadTokens'].reduce((sum, key) => sum + Number(day?.[key] || 0), 0);
  const dayKey = date => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
  function calendar(daily, today) {
    const wrapper = el('div', 'token-calendar');
    const heading = el('div', 'token-calendar-heading');
    heading.append(el('h4', '', '每日 Token 使用记录'));
    const dates = Object.keys(daily).filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date)).sort();
    if (!dates.length) { wrapper.append(heading, el('p', 'token-note', '暂无每日记录。')); return wrapper; }
    const years = [...new Set([...dates.map(date => date.slice(0, 4)), today.slice(0, 4)])].sort().reverse();
    const select = el('select', 'token-calendar-year'); select.setAttribute('aria-label', 'Token 使用记录年份');
    years.forEach(year => { const option = el('option', '', `${year} 年`); option.value = year; select.append(option); });
    heading.append(select); wrapper.append(heading);
    const body = el('div'); wrapper.append(body);
    function draw(year) {
      const grid = el('div', 'token-calendar-grid');
      const status = el('p', 'token-calendar-status', '点击或聚焦日期格，查看当天 Token 用量。');
      const yearDates = dates.filter(date => date.startsWith(year));
      const max = Math.max(1, ...yearDates.map(date => dayTotal(daily[date])));
      const start = Date.UTC(Number(year), 0, 1), end = Date.UTC(Number(year) + 1, 0, 1);
      for (let i = 0; i < new Date(start).getUTCDay(); i++) grid.append(el('span', 'token-day-blank'));
      for (let cursor = start; cursor < end; cursor += 86400000) {
        const date = new Date(cursor).toISOString().slice(0, 10);
        const exists = Object.hasOwn(daily, date), value = exists ? dayTotal(daily[date]) : 0;
        const level = value ? Math.max(1, Math.ceil(value / max * 4)) : 0;
        const button = el('button', `token-day token-level-${level}${date > today ? ' token-day-future' : ''}`);
        button.type = 'button';
        const description = `${date}：${exists ? `${compact(value)} Token` : '无数据'}`;
        button.title = description; button.setAttribute('aria-label', description);
        if (date > today) button.disabled = true;
        button.addEventListener('click', () => { status.textContent = description; });
        button.addEventListener('focus', () => { status.textContent = description; });
        grid.append(button);
      }
      const months = el('div', 'token-calendar-months');
      for (let month = 1; month <= 12; month++) months.append(el('span', '', `${month}月`));
      const scroll = el('div', 'token-calendar-scroll'); scroll.append(months, grid);
      const legend = el('div', 'token-calendar-legend'); legend.append(el('span', '', '少'));
      for (let level = 0; level <= 4; level++) legend.append(el('i', `token-day token-level-${level}`));
      legend.append(el('span', '', '多'));
      body.replaceChildren(scroll, legend, status);
    }
    select.addEventListener('change', () => draw(select.value));
    draw(years[0]); return wrapper;
  }
  function render(root, report) {
    const { totals = {}, agents = [], days = 0, generatedAt, daily = {} } = report;
    const today = dayKey(new Date());
    const section = el('section', 'token-panel');
    const heading = el('div', 'token-heading');
    const copy = el('div'); copy.append(el('p', 'token-eyebrow', 'YOUR SNAPSHOT · 本机汇总'), el('h3', '', 'Token 使用量'));
    const updated = generatedAt ? new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Tokyo' }).format(new Date(generatedAt)) : '—';
    heading.append(copy, el('p', 'token-updated', `更新于 ${updated}`));
    const stats = el('div', 'token-stats');
    stats.append(stat('所有来源总 Token', compact(totals.totalTokens), true), stat('今日 Token', Object.hasOwn(daily, today) ? compact(dayTotal(daily[today])) : '暂无数据'), stat('估算成本', totals.costUsd ? `US$${Number(totals.costUsd).toLocaleString('en-US', { maximumFractionDigits: 2 })}` : '—'), stat('统计天数', String(days)), stat('已检测来源', String(agents.length)));
    const detailTitle = el('h4', '', 'Token 细分');
    const detail = el('div', 'token-detail');
    for (const [label, key] of [['输入', 'inputTokens'], ['输出', 'outputTokens'], ['缓存创建', 'cacheCreationTokens'], ['缓存读取', 'cacheReadTokens']]) detail.append(stat(label, amount(totals[key])));
    const sourceTitle = el('div', 'token-source-heading'); sourceTitle.append(el('div', '', '已检测 Token 来源'), el('span', '', `已检测 ${agents.length} 个`));
    const note = el('p', 'token-note', '只汇总本机 Agent 的用量字段；不上传或展示原始对话、提示词与项目文件。');
    const table = el('div', 'token-agent-table');
    const head = el('div', 'token-agent-row token-agent-head'); head.append(el('span', '', '来源 / Agent'), el('span', '', '涉及模型'), el('span', '', 'Token')); table.append(head);
    for (const agent of agents) {
      const row = el('div', 'token-agent-row');
      const name = el('div'); name.append(el('strong', '', agent.name), el('small', '', `占总量 ${totals.totalTokens ? (agent.totalTokens / totals.totalTokens * 100).toFixed(1) : '0.0'}%`));
      const models = el('div', 'token-models', (agent.models || []).slice(0, 3).join(' · ') || '—');
      row.append(name, models, el('strong', 'token-agent-total', compact(agent.totalTokens))); table.append(row);
    }
    section.append(heading, stats, detailTitle, detail, sourceTitle, note, table, calendar(daily, today));
    root.replaceChildren(section);
  }
  async function init() {
    const root = document.getElementById('token-usage');
    if (!root || root.dataset.loaded) return;
    root.dataset.loaded = 'true';
    try { const response = await fetch('/assets/token-usage.json', { cache: 'no-store' }); if (!response.ok) throw new Error('unavailable'); render(root, await response.json()); }
    catch { root.replaceChildren(el('p', 'token-unavailable', 'Token 使用汇总暂不可用，将在下一次日同步后显示。')); delete root.dataset.loaded; }
  }
  init(); document.addEventListener('pjax:complete', init);
})();
