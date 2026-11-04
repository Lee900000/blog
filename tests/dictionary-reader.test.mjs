import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
test('production glossary mounts directory reader and preserves existing content', () => {
  const post = readFileSync('source/_posts/crypto-trading-glossary.md', 'utf8');
  assert.match(post, /directory-reader\.js/);
  const js = readFileSync('source/assets/crypto-glossary/directory-reader.js', 'utf8');
  assert.match(js, /createComment/);
  assert.match(js, /professional-record/);
  assert.match(js, /nativeMotion.*ready/);
  assert.doesNotMatch(js, /cloneNode|交互示意/);
});
