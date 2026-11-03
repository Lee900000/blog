import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { load } from 'cheerio';
import YAML from 'yaml';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
test('crypto menu groups the dictionary and arbitrage', () => {
  const menu = YAML.parse(read('_config.butterfly.yml')).menu;
  assert.equal(menu['量化套利'], undefined);
  assert.match(menu['币圈指南']['交易术语字典'], /^\/archives\/5596f036\.html/);
  assert.match(menu['币圈指南']['量化套利'], /^\/arbitrage\//);
  assert.match(read('source/arbitrage/assets/theme-shell.js'), /币圈指南/);
});
test('professional dictionary preserves all source table records and caveats', () => {
  const post = read('source/_posts/crypto-trading-glossary.md');
  const $ = load(post);
  assert.equal($('#professional-dictionary .professional-record').length, 610);
  assert.equal($('#professional-dictionary [data-source-table]').length, 48);
  for (const text of ['contract_value', 'ctMult', 'crossWalletBalance', 'leverageBracket', '未逐一联网核对', '尚未进入规范', '自相矛盾']) {
    assert.ok($('#professional-dictionary').text().includes(text), text);
  }
  assert.equal($('#professional-dictionary script, #professional-dictionary iframe').length, 0);
});
