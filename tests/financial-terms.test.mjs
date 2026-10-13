import { createRequire as routeRequire } from 'node:module';
const articleRoutes = routeRequire(import.meta.url)('../article-routes.json');
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const postPath = new URL('../source/_posts/889.md', import.meta.url);
const generatedArticlePath = new URL(`../public/${articleRoutes[889]}`, import.meta.url);

test('article 889 preserves the three-layer financial terms guide', async () => {
  const post = await readFile(postPath, 'utf8');

  assert.match(post, /^title: 从股票到永续合约：用三层模型读懂金融交易术语$/m);
  assert.match(post, /^date: 2026-09-19 12:00:00$/m);
  assert.match(post, /^legacy_id: 889$/m);
  assert.ok(post.includes('permalink: ' + articleRoutes[889]));
  assert.match(post, /标的层回答“交易什么”/);
  assert.match(post, /同样跟踪苹果股价/);
  assert.match(post, /用 Binance 做一个现实案例/);
  assert.match(post, /资料来源与边界/);

  const externalLinks = post.match(/\]\(https:\/\//g) ?? [];
  assert.equal(externalLinks.length, 5);
});

test('generated site exposes article 889 as HTML', async () => {
  const html = await readFile(generatedArticlePath, 'utf8');

  assert.match(html, /<title>\s*从股票到永续合约：用三层模型读懂金融交易术语/);
  assert.match(html, /标的层回答“交易什么”/);
  assert.match(html, /2026-09-19/);
});
