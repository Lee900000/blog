import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => readFileSync(join(root, path), 'utf8');
const suite = 'source/arbitrage';

test('Leon navigation exposes the self-contained arbitrage collection', () => {
  const menu = YAML.parse(read('_config.butterfly.yml')).menu;
  assert.match(menu['量化套利'], /^\/arbitrage\/ /);
  const skip = YAML.parse(read('_config.yml')).skip_render;
  assert.ok(skip.includes('arbitrage/**'));
  assert.ok(existsSync(join(root, suite, 'index.html')));
  assert.ok(existsSync(join(root, suite, 'assets/common.css')));
});

test('nine calculators and the analysis checklist retain their local links', () => {
  const index = read(`${suite}/index.html`);
  const targets = [...index.matchAll(/data-src="([^"]+\.html)"/g)].map(match => match[1]);
  assert.equal(targets.length, 10);
  assert.equal(new Set(targets).size, 10);
  for (const target of targets) {
    assert.ok(existsSync(join(root, suite, target)), target);
    const page = read(`${suite}/${target}`);
    if (/^\d\d-/.test(target)) {
      assert.match(page, /assets\/common\.css/);
      assert.match(page, /class="formula"/);
      assert.match(page, /<script>/);
    }
  }
});

test('mobile index keeps the strategy list bounded so the demo stays reachable', () => {
  const index = read(`${suite}/index.html`);
  assert.match(index, /aside\{[^}]*max-height:40vh;[^}]*overflow-y:auto/);
});

test('arbitrage pages use opaque neutral backgrounds for maximum readability', () => {
  const index = read(`${suite}/index.html`);
  const common = read(`${suite}/assets/common.css`);
  assert.doesNotMatch(index, /butterfly-teal-smoke\.jpg|backdrop-filter/);
  assert.match(index, /--bg:#f6f8fb; --card:#ffffff/);
  assert.doesNotMatch(common, /butterfly-teal-smoke\.jpg|backdrop-filter/);
  assert.match(common, /--bg:#f6f8fb; --card:#ffffff/);
});
