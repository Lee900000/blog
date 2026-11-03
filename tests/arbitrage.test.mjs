import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => readFileSync(join(root, path), 'utf8');
const suite = 'source/arbitrage';

test('formula blocks preserve authored line breaks and wrap on small screens', () => {
  const css = read(`${suite}/assets/common.css`);
  assert.match(css, /\.formula\{[^}]*white-space:pre-wrap/);
  assert.match(css, /\.formula\{[^}]*overflow-wrap:anywhere/);
});

test('Leon navigation exposes the self-contained arbitrage collection', () => {
  const menu = YAML.parse(read('_config.butterfly.yml')).menu;
  assert.match(menu['币圈指南']['量化套利'], /^\/arbitrage\/ /);
  const skip = YAML.parse(read('_config.yml')).skip_render;
  assert.ok(skip.includes('arbitrage/*.html'));
  assert.ok(!skip.includes('arbitrage/**'));
  assert.ok(existsSync(join(root, suite, 'index.md')));
  assert.ok(existsSync(join(root, suite, 'assets/common.css')));
});

test('ten calculators and the analysis checklist retain their local links', () => {
  const index = read(`${suite}/index.md`);
  const targets = [...index.matchAll(/data-src="([^"]+\.html)"/g)].map(match => match[1]);
  assert.equal(targets.length, 11);
  assert.equal(new Set(targets).size, 11);
  for (const target of targets) {
    assert.ok(existsSync(join(root, suite, target)), target);
    const page = read(`${suite}/${target}`);
    assert.match(page, /assets\/common\.css/);
    assert.match(page, /assets\/theme-shell\.js/);
    if (/^\d\d-/.test(target)) {
      assert.match(page, /class="formula"/);
      assert.match(page, /<script>/);
    }
  }
});

test('mobile index keeps the strategy list bounded so the demo stays reachable', () => {
  const index = read('source/css/arbitrage.css');
  assert.match(index, /\.strategy-nav\{[^}]*max-height:40vh/);
  assert.match(index, /\.strategy-nav\{[^}]*overflow:auto/);
});

test('collection index is rendered by Butterfly and keeps the framed reading pane', () => {
  const index = read(`${suite}/index.md`);
  assert.match(index, /layout:\s*page/);
  assert.match(index, /aside:\s*false/);
  assert.match(index, /top_img:\s*false/);
  assert.doesNotMatch(index, /class="site-nav"/);
  assert.match(index, /class="viewer-shell"/);
  const theme = read('_config.butterfly.yml');
  assert.match(theme, /css\/arbitrage\.css/);
  assert.match(theme, /js\/arbitrage\.js/);
});

test('collection index introduces the personal quant finance showcase and contact channel', () => {
  const index = read(`${suite}/index.md`);
  const css = read('source/css/arbitrage.css');

  assert.match(index, /class="quant-showcase"/);
  assert.match(index, /mailto:axon90000@gmail\.com/);
  assert.match(index, /有量化理财需求/);
  assert.match(css, /\.quant-showcase\{/);
  assert.match(index, /class="quant-showcase-gallery"/);
  assert.equal((index.match(/class="quant-showcase-media"/g) || []).length, 5);
  for (const asset of ['dashboard.png', 'open-order.png', 'trade-history.png', 'funding-history.png', 'funding-overview.png']) {
    assert.match(index, new RegExp(`assets/arbitrage-showcase/${asset.replace('.', '\\.')}`));
    assert.ok(existsSync(join(root, 'source/assets/arbitrage-showcase', asset)), asset);
  }
  assert.match(css, /\.quant-showcase-gallery\{[^}]*overflow-x:auto/);
  assert.match(css, /\.quant-showcase-trigger\{[^}]*flex:0 0/);
});

test('quant finance screenshots open in a keyboard-operable lightbox', () => {
  const index = read(`${suite}/index.md`);
  const css = read('source/css/arbitrage.css');
  const script = read('source/js/arbitrage.js');

  assert.equal((index.match(/class="quant-showcase-trigger/g) || []).length, 5);
  assert.match(index, /id="quantLightbox"/);
  assert.match(index, /data-quant-lightbox="previous"/);
  assert.match(index, /data-quant-lightbox="next"/);
  assert.match(index, /data-quant-lightbox="close"/);
  assert.match(css, /\.quant-lightbox\{/);
  assert.match(script, /quantLightbox/);
  assert.match(script, /ArrowLeft/);
  assert.match(script, /ArrowRight/);
  assert.match(script, /Escape/);
});

test('standalone calculator pages use the Leon Blog shell without sidebar widgets', () => {
  const common = read(`${suite}/assets/common.css`);
  const shell = read(`${suite}/assets/theme-shell.js`);

  assert.doesNotMatch(common, /butterfly-teal-smoke\.jpg/);
  assert.match(common, /\.arbitrage-site-nav/);
  assert.match(common, /body\.is-embedded/);
  assert.match(common, /body\.is-embedded \.wrap\{[^}]*background:var\(--card\)[^}]*box-shadow:var\(--shadow\)/);
  assert.match(common, /body\.is-embedded\{[^}]*background:transparent/);
  assert.match(shell, /window\.self\s*!==\s*window\.top/);
  assert.match(shell, /canvas-ribbon\.min\.js/);
  assert.match(shell, /ribbon\.setAttribute\('size', '150'\)/);
  assert.match(shell, /ribbon\.setAttribute\('alpha', '0\.6'\)/);
  for (const path of ['/', '/archives/', '/tags/', '/link/', '/works/', '/arbitrage/', '/about/']) {
    assert.ok(shell.includes(path), path);
  }
  assert.doesNotMatch(shell, /aside-content|card-author|card-announcement|card-toc|card-recent-post/);
});
