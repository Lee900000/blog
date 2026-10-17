import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

test('brand changes navigation only and supports both logo backgrounds', () => {
  let render;
  vm.runInNewContext(readFileSync('scripts/brand.js', 'utf8'), {
    hexo: {config: {root: '/'}, extend: {filter: {register: (name, fn) => { render = fn; }}}}
  });
  const result = render('<title>Tago · 开发手记</title><a class="nav-site-title" href="/"><img src="old.svg"><span class="site-name">Tago · 开发手记</span></a><img src="/assets/profile/leon-avatar.png">');
  assert.ok(result.includes('tago-logo-hero.svg'));
  assert.ok(result.includes('tago-logo-v1.svg'));
  assert.ok(result.includes('<span class="site-name">开发手记</span>'));
  assert.ok(result.includes('<title>Tago · 开发手记</title>'));
  assert.ok(result.includes('/assets/profile/leon-avatar.png'));
  assert.ok(!result.includes('old.svg'));
});
