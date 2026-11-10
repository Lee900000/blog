import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('Token synchronization updates the About-page source and pushes only its generated data', () => {
  const script = readFileSync(new URL('../tools/sync-token-usage-to-tago.sh', import.meta.url), 'utf8');
  assert.match(script, /export PATH="\/Users\/karp\/\.local\/bin/);
  assert.match(script, /export GIT_TERMINAL_PROMPT=0/);
  assert.match(script, /export HTTPS_PROXY="http:\/\/127\.0\.0\.1:7890"/);
  assert.match(script, /export ALL_PROXY="socks5:\/\/127\.0\.0\.1:7890"/);
  assert.match(script, /source\/assets\/token-usage\.json/);
  assert.match(script, /about-maintenance\.json/);
  assert.match(script, /git -C "\$checkout" add -- "\$token_asset" "\$about_marker"/);
  assert.match(script, /git -C "\$checkout" push origin "HEAD:\$branch"/);
});

test('sync uses a fresh temporary checkout rather than a diverged persistent branch', () => {
  const script = readFileSync(new URL('../tools/sync-token-usage-to-tago.sh', import.meta.url), 'utf8');
  assert.match(script, /checkout="\$temporary\/checkout"/);
  assert.doesNotMatch(script, /merge --ff-only/);
});

test('daily snapshots preserve the original collection time during server aggregation', () => {
  const script = readFileSync(new URL('../tools/sync-token-usage-to-tago.sh', import.meta.url), 'utf8');
  const aggregator = readFileSync(new URL('../tools/remote-token-usage-aggregate.py', import.meta.url), 'utf8');
  assert.match(script, /snapshotGeneratedAt/);
  assert.match(aggregator, /snapshotGeneratedAt/);
});
