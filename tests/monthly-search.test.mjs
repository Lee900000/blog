import test from 'node:test';
import assert from 'node:assert/strict';
import { createMonthlyIndex } from '../tools/monthly-search.cjs';

test('monthly search shards are newest first and preserve full text', () => {
  const result = createMonthlyIndex([
    {date: new Date('2022-08-02T00:00:00Z'), title: 'old', path: 'archives/a.html', content: '<p>old body</p>'},
    {date: new Date('2026-10-01T00:00:00Z'), title: 'new', path: 'archives/b.html', content: '<p>new body</p>'}
  ], '/');
  assert.deepEqual(result.manifest.map(item => item.month), ['2026-10', '2022-08']);
  assert.match(result.shards[0].data, /new body/);
  assert.match(result.shards[1].data, /old body/);
  assert.match(result.manifest[0].url, /^\/search\/2026-10\.[a-f0-9]+\.json$/);
});
