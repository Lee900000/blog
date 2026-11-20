import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Token export reports the core snapshot time instead of export time', () => {
  const exporter = readFileSync(new URL('../tools/export-token-usage.mjs', import.meta.url), 'utf8');
  assert.match(exporter, /report\.generatedAt\s*=\s*statSync\(latest\)\.mtime\.toISOString\(\)/);
});

test('server sync happens before the optional GitHub publication', () => {
  const script = readFileSync(new URL('../tools/sync-token-usage-to-tago.sh', import.meta.url), 'utf8');
  assert.ok(script.indexOf('Token usage data synced to') < script.indexOf('git clone --single-branch'));
});

test('Token sync does not start simultaneously with the About maintenance job', () => {
  const plist = readFileSync(new URL('../tools/com.tago.token-usage-sync.plist', import.meta.url), 'utf8');
  assert.match(plist, /<key>Minute<\/key>\s*<integer>15<\/integer>/);
});
