(() => {
  'use strict';
  const el = (tag, cls, text) => { const node = document.createElement(tag); if (cls) node.className = cls; if (text !== undefined) node.textContent = text; return node; };
  const formatter = new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 2 });
  const compact = value => { const number = Number(value || 0); if (number >= 1e8) return `${formatter.format(number / 1e8)} 亿`; if (number >= 1e4) return `${formatter.format(number / 1e4)} 万`; return new Intl.NumberFormat('zh-CN').format(number); };
  const amount = compact;
  const stat = (label, value, accent = false) => { const node = el('div', `token-stat${accent ? ' token-stat-accent' : ''}`); node.append(el('span', '', label), el('strong', '', value)); return node; };
  function render(root, report) {
    const { totals = {}, agents = [], days = 0, generatedAt } = report;
    const section = el('section', 'token-panel');
    const heading = el('div', 'token-heading');
    const copy = el('div'); copy.append(el('p', 'token-eyebrow', 'YOUR SNAPSHOT · 本机汇总'), el('h3', '', 'Token 使用量'));
    const updated = generatedAt ? new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Tokyo' }).format(new Date(generatedAt)) : '—';
    heading.append(copy, el('p', 'token-updated', `更新于 ${updated}`));
    const stats = el('div', 'token-stats');
    stats.append(stat('所有来源总 Token', compact(totals.totalTokens), true), stat('估算成本', totals.costUsd ? `US$${Number(totals.costUsd).toLocaleString('en-US', { maximumFractionDigits: 2 })}` : '—'), stat('统计天数', String(days)), stat('已检测来源', String(agents.length)));
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
    section.append(heading, stats, detailTitle, detail, sourceTitle, note, table);
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

