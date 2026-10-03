import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';

const REPORTS = [
  {
    id: 885,
    slug: 'commodities',
    title: '币安大宗商品玩法拆解',
    date: '2026-10-03 00:30:00',
    tags: ['大宗商品', '币安'],
    cover: '/assets/market-series/commodities.jpg',
    description: '盘点币安黄金、白银、原油、铜等大宗商品永续与期权，分析指数来源、流动性、休市定价和主要风险。'
  },
  {
    id: 886,
    slug: 'fx',
    title: '币安外汇玩法拆解',
    date: '2026-10-03 08:30:00',
    tags: ['外汇', '币安'],
    cover: '/assets/market-series/fx.jpg',
    description: '梳理币安外汇永续与法币现货，说明指数构成、USDT 影响、流动性差异、资金费率和产品边界。'
  },
  {
    id: 887,
    slug: 'index',
    title: '币安指数玩法拆解',
    date: '2026-10-03 16:30:00',
    tags: ['指数', '币安'],
    cover: '/assets/market-series/index.jpg',
    description: '梳理币安股票指数、ETF 永续、主题指数与相关代币化产品，分析定价来源、成分结构、流动性和风险。'
  }
];

const SERIES_ROUTES = new Map([
  ['nvda-binance-report.html', '/index.php/archives/884.html'],
  ['binance-commodities-report.html', '/index.php/archives/885.html'],
  ['binance-fx-report.html', '/index.php/archives/886.html'],
  ['binance-index-report.html', '/index.php/archives/887.html']
]);

const STYLE = `<style>
.market-report{--bg:#fafaf8;--fg:#1c1c1a;--mut:#6b6b66;--card:#fff;--line:#e4e3dd;--acc:#b8860b;--ok:#1a7f4b;--warn:#b45309;--bad:#b91c1c;--chip:#f1efe6;box-sizing:border-box;margin:0 -1rem;padding:1.25rem 1rem 3rem;border-radius:12px;background:var(--bg);color:var(--fg);font:16px/1.75 -apple-system,BlinkMacSystemFont,"PingFang SC","Noto Sans SC",sans-serif}
[data-theme='dark'] .market-report{--bg:#141412;--fg:#ecebe4;--mut:#9a9990;--card:#1d1d1a;--line:#333330;--acc:#e0b040;--ok:#4ade80;--warn:#fbbf24;--bad:#f87171;--chip:#26261f}
.market-report *{box-sizing:border-box}.market-report h2{margin:48px 0 12px;padding-top:16px;border-top:2px solid var(--line);color:var(--fg);font-size:22px}.market-report h3{margin:24px 0 6px;color:var(--fg);font-size:17px}.market-report p,.market-report li{margin:6px 0}.market-report .sub{color:var(--mut);font-size:14px}.market-report .card{margin:12px 0;padding:14px 16px;border:1px solid var(--line);border-radius:10px;background:var(--card);box-shadow:none}.market-report .tldr{border-left:4px solid var(--acc)}.market-report .warnbox{border-left:4px solid var(--bad)}
.market-report table{width:100%;margin:10px 0;border-collapse:collapse;background:var(--card);color:var(--fg);font-size:14px}.market-report th,.market-report td{padding:7px 9px;border:1px solid var(--line);text-align:left;vertical-align:top}.market-report th{background:var(--chip);color:var(--fg);white-space:nowrap}.market-report .tw{max-width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}.market-report .tag{display:inline-block;margin-right:4px;padding:1px 7px;border-radius:9px;background:var(--chip);font-size:12px;line-height:1.75;white-space:nowrap}.market-report .v{color:var(--ok)}.market-report .g{color:var(--warn)}.market-report .u{color:var(--bad)}
.market-report code{padding:1px 5px;border-radius:4px;background:var(--chip);color:var(--fg);font-size:13px;word-break:break-all}.market-report .flow{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:10px 0}.market-report .flow span.b{padding:6px 10px;border:1px solid var(--line);border-radius:8px;background:var(--chip);font-size:14px}.market-report .flow span.a{color:var(--mut)}.market-report .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}.market-report .k{color:var(--fg);font-size:24px;font-weight:600}
.market-report nav{display:flex;flex-wrap:wrap;gap:6px 12px;margin:18px 0}.market-report nav a{color:var(--acc);font-size:14px}.market-report a{color:var(--acc);text-decoration:underline;text-decoration-color:var(--line);text-underline-offset:3px}.market-report a:hover{color:var(--fg)}.market-report .sib{margin-top:40px;padding-top:12px;border-top:1px solid var(--line)}.market-report :focus-visible{outline:2px solid var(--acc);outline-offset:2px}
@media (max-width:600px){.market-report{margin:0 -.5rem;padding:1rem .75rem 2.5rem}.market-report h2{margin-top:36px}.market-report .card{padding:12px}.market-report .grid{grid-template-columns:1fr}.market-report th,.market-report td{padding:6px 8px}}
</style>`;

function frontmatter(report) {
  return `---\ntitle: ${report.title}\ndate: ${report.date}\nlegacy_id: ${report.id}\npermalink: index.php/archives/${report.id}.html\ncover: ${report.cover}\ndescription: ${report.description}\npostDesc: ${report.description}\ncategories:\n  - - 金融科技\ntags:\n${report.tags.map(tag => `  - ${tag}`).join('\n')}\nsource_date: 2026-10-03T00:10:00+09:00\nupdated: ${report.date}\ndisableNunjucks: true\ncomments: false\n---\n`;
}

export async function importMarketReports({ sourceDir, postsDir }) {
  await mkdir(postsDir, { recursive: true });
  const written = [];

  for (const report of REPORTS) {
    const sourcePath = join(sourceDir, `binance-${report.slug}-report.html`);
    const $ = load(await readFile(sourcePath, 'utf8'), { decodeEntities: false });
    const main = $('main').first();
    if (!main.length) throw new Error(`Missing <main> in ${sourcePath}`);
    main.children('h1').first().remove();
    main.find('a[href]').each((_, node) => {
      const link = $(node);
      const href = link.attr('href');
      if (SERIES_ROUTES.has(href)) link.attr('href', SERIES_ROUTES.get(href));
      if (/^https?:\/\//.test(href)) link.attr('target', '_blank').attr('rel', 'noopener noreferrer');
    });

    const content = `${frontmatter(report)}<!-- 原始调研正文、数字与来源链接保持不变；样式仅作用于本文。 -->\n\n${STYLE}\n\n<div class="market-report">\n${main.html().trim()}\n</div>\n`;
    await writeFile(join(postsDir, `${report.id}.md`), content);
    written.push(report.id);
  }

  return { written };
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === currentFile) {
  const projectRoot = resolve(dirname(currentFile), '..');
  const result = await importMarketReports({
    sourceDir: '/Users/karp/Code/Claude/lab',
    postsDir: join(projectRoot, 'source/_posts')
  });
  process.stdout.write(`${JSON.stringify(result)}\n`);
}
