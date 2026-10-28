import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeDays, summarizeSources } from '../tools/token-usage.cjs';

test('summarizeDays totals token fields and identifies agents from model families', () => {
  const report = summarizeDays({
    '2026-10-24': {
      inputTokens: 10, outputTokens: 20, cacheCreationTokens: 30, cacheReadTokens: 40, costUsd: 1.5,
      models: {
        'gpt-6-luna': { inputTokens: 10, outputTokens: 20, cacheCreationTokens: 0, cacheReadTokens: 40, costUsd: 0.5 },
        'claude-sonnet-5-5': { inputTokens: 0, outputTokens: 0, cacheCreationTokens: 30, cacheReadTokens: 0, costUsd: 1 }
      }
    }
  });
  assert.equal(report.totals.totalTokens, 100);
  assert.equal(report.totals.costUsd, 1.5);
  assert.deepEqual(report.agents.map(({ id, totalTokens }) => [id, totalTokens]), [['codex', 70], ['claude-code', 30]]);
  assert.equal(report.days, 1);
});

test('summarizeSources preserves Hermes and splits its DeepSeek model usage without double counting', () => {
  const report = summarizeSources({}, { hermes: { '2026-10-24': {
    inputTokens: 3, outputTokens: 4, cacheCreationTokens: 0, cacheReadTokens: 5, costUsd: 0.1,
    models: { 'deepseek-v4-pro': { inputTokens: 3, outputTokens: 4, cacheCreationTokens: 0, cacheReadTokens: 5, costUsd: 0.1 } }
  } } });
  assert.deepEqual(report.agents.map(({ id, name, totalTokens }) => [id, name, totalTokens]), [['deepseek', 'DeepSeek', 12]]);
  assert.deepEqual(report.agents[0].models, ['deepseek-v4-pro']);
});
