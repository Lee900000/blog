import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

test('only home and archive generators exclude unlisted posts', () => {
  const generators = {};
  let setup;
  vm.runInNewContext(readFileSync('scripts/listing-visibility.js', 'utf8'), {
    require: () => function (locals) { return locals.posts; },
    hexo: { extend: {
      filter: { register: (_, fn) => { setup = fn; } },
      generator: { register: (name, fn) => { generators[name] = fn; } }
    } }
  });
  setup();
  const visible = { title: 'article' }, hidden = { title: 'dictionary', listed: false };
  for (const name of ['index', 'archive']) {
    assert.deepEqual(generators[name]({ posts: [visible, hidden] }), [visible]);
  }
  assert.deepEqual(Object.keys(generators).sort(), ['archive', 'index']);
});
