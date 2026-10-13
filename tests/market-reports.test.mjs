import { createRequire as routeRequire } from 'node:module';
const articleRoutes = routeRequire(import.meta.url)('../article-routes.json');
import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { load } from 'cheerio';
import { importMarketReports } from '../migration/import-market-reports.mjs';

const sourceDir = '/Users/karp/Code/Claude/lab';
const cases = [
  { id: 885, slug: 'commodities', title: '币安大宗商品玩法拆解', date: '2026-10-03 00:30:00', tables: 3 },
  { id: 886, slug: 'fx', title: '币安外汇玩法拆解', date: '2026-10-03 08:30:00', tables: 3 },
  { id: 887, slug: 'index', title: '币安指数玩法拆解', date: '2026-10-03 16:30:00', tables: 6 }
];

const hrefs = $ => $('a[href^="http"]').map((_, node) => $(node).attr('href')).get().sort();

test('import keeps each report complete while adapting it to the Butterfly article shell', async () => {
  const postsDir = await mkdtemp(join(tmpdir(), 'market-report-posts-'));
  const result = await importMarketReports({ sourceDir, postsDir });
  assert.deepEqual(result, { written: [885, 886, 887] });

  for (const item of cases) {
    const source = load(await readFile(join(sourceDir, `binance-${item.slug}-report.html`), 'utf8'));
    const postText = await readFile(join(postsDir, `${item.id}.md`), 'utf8');
    const body = postText.slice(postText.indexOf('---', 3) + 3);
    const output = load(body);

    assert.match(postText, new RegExp(`title: ${item.title}`));
    assert.match(postText, new RegExp(`date: ${item.date}`));
    assert.match(postText, new RegExp(`legacy_id: ${item.id}`));
    assert.equal(output('.market-report').length, 1);
    assert.equal(output('.market-report h1').length, 0);
    assert.equal(output('.market-report table').length, item.tables);
    assert.ok(output('.card.tldr').length > 0);
    assert.ok(output('.card.warnbox').length > 0);
    for (const label of ['实测', '转述', '未证实', '推论']) {
      assert.ok(output('.tag').filter((_, node) => output(node).text().trim() === label).length > 0, label);
    }
    assert.deepEqual(hrefs(output), hrefs(source));
    for (const route of [884, 885, 886, 887]) {
      if (route !== item.id) {
        assert.ok(output(`.sib a[href="/index.php/archives/${route}.html"]`).length > 0);
      }
    }
    output('a[href^="http"]').each((_, node) => {
      assert.equal(output(node).attr('target'), '_blank');
      assert.match(output(node).attr('rel') ?? '', /noopener/);
      assert.match(output(node).attr('rel') ?? '', /noreferrer/);
    });
  }
});

test('local blog build lists and renders all three reports without leaking report styles', async () => {
  const root = new URL('../', import.meta.url);
  const homepage = load(await readFile(new URL('public/index.html', root), 'utf8'));

  for (const item of cases) {
    const route = `/${articleRoutes[item.id]}`;
    assert.ok(homepage(`a[href="${route}"]`).length > 0, `homepage links to ${item.id}`);
    const page = load(await readFile(new URL(`public/${articleRoutes[item.id]}`, root), 'utf8'));
    assert.equal(page('.market-report').length, 1);
    assert.equal(page('.market-report h1').length, 0);
    assert.equal(page('.market-report table').length, item.tables);
    assert.equal(page('style').text().includes('\n:root{--bg:'), false, 'standalone root CSS is absent');
    assert.match(page('style').text(), /\[data-theme=['"]dark['"]\] \.market-report/);
    for (const label of ['实测', '转述', '未证实', '推论']) {
      assert.ok(page('.market-report .tag').filter((_, node) => page(node).text().trim() === label).length > 0);
    }
  }
});
