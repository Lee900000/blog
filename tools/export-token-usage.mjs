#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { summarizeSources } from './token-usage.cjs';

const home = process.env.HOME || '/Users/karp';
const transactions = join(home, '.kimyx-token-usage/collector-state-v5/transactions');
const multiSourceState = join(home, '.kimyx-token-usage/multi-source-v1/state.json');
const output = process.argv[2] || join(process.cwd(), 'source/assets/token-usage.json');
if (!existsSync(transactions)) throw new Error(`Token usage data directory does not exist: ${transactions}`);
const candidates = readdirSync(transactions).map(name => join(transactions, name, 'aggregate.json')).filter(existsSync);
if (!candidates.length) throw new Error('No token aggregate was found');
const latest = candidates.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0];
const coreDays = JSON.parse(readFileSync(latest, 'utf8'));
const state = existsSync(multiSourceState) ? JSON.parse(readFileSync(multiSourceState, 'utf8')) : {};
const extraSources = Object.fromEntries(Object.entries(state.sources || {})
  .filter(([id, source]) => !['codex', 'claude-code'].includes(id) && source?.status === 'ready' && Object.keys(source.snapshot || {}).length)
  .map(([id, source]) => [id, source.snapshot]));
const report = summarizeSources(coreDays, extraSources);
mkdirSync(join(output, '..'), { recursive: true });
writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ output, days: report.days, agents: report.agents.map(agent => agent.name), totalTokens: report.totals.totalTokens }));
