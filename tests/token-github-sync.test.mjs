import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('Token synchronization updates the About-page source and pushes only its generated data', () => {
  const script = readFileSync(new URL('../tools/sync-token-usage-to-tago.sh', import.meta.url), 'utf8');
  assert.match(script, /export PATH="\/Users\/karp\/\.local\/bin/);
  assert.match(script, /export GIT_TERMINAL_PROMPT=0/);
  assert.match(script, /source\/assets\/token-usage\.json/);
  assert.match(script, /about-maintenance\.json/);
  assert.match(script, /git -C "\$checkout" add -- "\$token_asset" "\$about_marker"/);
  assert.match(script, /git -C "\$checkout" push origin "HEAD:\$branch"/);
});
