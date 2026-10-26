'use strict';

const fields = ['inputTokens', 'outputTokens', 'cacheCreationTokens', 'cacheReadTokens'];
const sourceNames = { codex: 'Codex', 'claude-code': 'Claude Code', hermes: 'Hermes', deepseek: 'DeepSeek' };
const agentForModel = model => {
  const name = String(model || '').toLowerCase();
  if (name.startsWith('gpt-') || name.includes('codex')) return { id: 'codex', name: sourceNames.codex };
  if (name.startsWith('claude-')) return { id: 'claude-code', name: sourceNames['claude-code'] };
  if (name.startsWith('deepseek')) return { id: 'deepseek', name: sourceNames.deepseek };
  return { id: 'other', name: '其他 Agent' };
};
const empty = () => Object.fromEntries([...fields, 'costUsd'].map(key => [key, 0]));
const add = (target, source = {}) => { for (const field of [...fields, 'costUsd']) target[field] += Number(source[field] || 0); return target; };
const total = value => fields.reduce((sum, field) => sum + Number(value[field] || 0), 0);
const addAgent = (agents, id, name, usage, models = []) => {
  const current = agents.get(id) || { id, name, ...empty(), models: [] };
  add(current, usage);
  for (const model of models) if (model && !current.models.includes(model)) current.models.push(model);
  agents.set(id, current);
};

// Core records contain Codex and Claude only. Extra collectors are retained by
// source, preventing Hermes' DeepSeek usage from being silently folded into Codex.
function summarizeSources(coreDays = {}, extraSources = {}) {
  const totals = empty(); const agents = new Map(); const daily = {};
  const dates = new Set([...Object.keys(coreDays), ...Object.values(extraSources).flatMap(source => Object.keys(source || {}))]);
  for (const date of [...dates].sort()) {
    const day = { ...empty(), models: {}, sources: {} };
    const core = coreDays[date];
    if (core) {
      add(totals, core); add(day, core); day.models = core.models || {};
      for (const [model, usage] of Object.entries(core.models || {})) {
        if (model === '<synthetic>') continue;
        const agent = agentForModel(model); addAgent(agents, agent.id, agent.name, usage, [model]);
      }
    }
    for (const [sourceId, snapshots] of Object.entries(extraSources)) {
      const usage = snapshots && snapshots[date]; if (!usage) continue;
      add(totals, usage); add(day, usage); day.sources[sourceId] = usage;
      const models = Object.entries(usage.models || {}).filter(([model]) => model !== '<synthetic>');
      // Hermes is an execution client. Its DeepSeek calls deserve their own
      // visible row, while the rest remains Hermes; the two rows still add up
      // to the one Hermes source snapshot and never double count.
      if (sourceId === 'hermes' && models.length) {
        const accounted = empty();
        for (const [model, modelUsage] of models) {
          const agent = agentForModel(model);
          const targetId = agent.id === 'deepseek' ? 'deepseek' : 'hermes';
          const targetName = targetId === 'deepseek' ? sourceNames.deepseek : sourceNames.hermes;
          addAgent(agents, targetId, targetName, modelUsage, [model]); add(accounted, modelUsage);
        }
        const remainder = empty();
        for (const key of [...fields, 'costUsd']) remainder[key] = Math.max(0, Number(usage[key] || 0) - Number(accounted[key] || 0));
        if (total(remainder) || remainder.costUsd) addAgent(agents, 'hermes', sourceNames.hermes, remainder);
      } else addAgent(agents, sourceId, sourceNames[sourceId] || sourceId, usage, models.map(([model]) => model));
    }
    daily[date] = day;
  }
  totals.totalTokens = total(totals);
  return { schemaVersion: 2, generatedAt: new Date().toISOString(), timezone: 'Asia/Tokyo', days: Object.keys(daily).length, totals,
    agents: [...agents.values()].map(agent => ({ ...agent, totalTokens: total(agent) })).filter(agent => agent.totalTokens > 0).sort((a, b) => b.totalTokens - a.totalTokens), daily };
}
function summarizeDays(days = {}) { return summarizeSources(days, {}); }
module.exports = { summarizeDays, summarizeSources, agentForModel, fields, empty, add, total };

