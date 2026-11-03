import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const require = createRequire(import.meta.url);

test('daily maintenance marker advances once per Tokyo calendar day', () => {
  const { nextMarker } = require('../tools/about-maintenance.cjs');
  const initial = nextMarker(null, '2026-10-26');
  assert.deepEqual(initial, { date: '2026-10-26', total: 1 });

  assert.equal(nextMarker(initial, '2026-10-26'), null);
  assert.deepEqual(nextMarker(initial, '2026-10-27'), { date: '2026-10-27', total: 2 });
});

test('daily About sync recovers its disposable checkout when it diverges from GitHub', () => {
  const script = readFileSync(new URL('../tools/sync-daily-about-to-github.sh', import.meta.url), 'utf8');
  assert.match(script, /export HTTPS_PROXY="http:\/\/127\.0\.0\.1:7890"/);
  assert.match(script, /export ALL_PROXY="socks5:\/\/127\.0\.0\.1:7890"/);
  assert.match(script, /git -C "\$checkout" reset --hard "origin\/\$branch"/);
});
