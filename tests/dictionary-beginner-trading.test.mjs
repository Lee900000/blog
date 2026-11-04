import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
const require = createRequire(import.meta.url);
const target = '../source/assets/crypto-glossary/beginner-trading.js';
const owned = require('../tools/glossary-inventory.cjs').inventory().filter(e => e.category !== '资料与公式说明' && !e.curated && (!/^pro-record-/.test(e.id) || Number(e.id.slice(11)) < 157));
test('every introductory and trading entry has substantive beginner copy', () => {
  assert.ok(existsSync(new URL(target, import.meta.url)), 'beginner trading explanations must exist');
  const { records } = require(target);
  assert.equal(owned.length, 180);
  assert.deepEqual(Object.keys(records).sort(), owned.map(e => e.id).sort());
  for (const entry of owned) {
    const record = records[entry.id];
    assert.ok((record.definition.match(/[\u3400-\u9fff]/g) || []).length >= 35, `${entry.id}: explain what this means`);
    assert.ok(record.example.length >= 25 && /假设|例如|比如/.test(record.example), `${entry.id}: concrete illustrative example`);
    assert.ok(record.cautions.length && record.cautions.every(c => c.length >= 15), `${entry.id}: meaningful caution`);
    assert.ok(record.sources.length && record.sources.every(s => s.length === 2 && /^https:\/\//.test(s[1])), `${entry.id}: usable primary source`);
    assert.notEqual(record.definition, record.example);
  }
});
