import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

// The project Pages site lives at /blog/. Only change generated output.
const root = 'public';
const prefix = '/blog/';
if (!existsSync(join(root, 'index.html'))) throw new Error('Build output is missing');
const excluded = /(?:^|\/)(?:vendor|node_modules)\//;
const localPath = /^(?:assets|css|js|img|archives|categories|tags|about|arbitrage|research|search|page|works|link|ai|shuoshuo)(?:\/|$)/;
const resolvePath = path => {
  if (path === '/') return prefix;
  if (path === '/search.xml') return `${prefix}search.xml`;
  if (!path.startsWith('/') || path.startsWith('//') || path.startsWith(prefix)) return path;
  return localPath.test(path.slice(1)) ? prefix + path.slice(1) : path;
};
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) { walk(path); continue; }
    const ext = extname(path);
    if (!['.html', '.css', '.js'].includes(ext) || excluded.test(path)) continue;
    let content = readFileSync(path, 'utf8');
    if (ext === '.html') {
      content = content.replace(/\b(href|src|data-src|content)=(['"])(\/[^'"\s]*)\2/gi, (_, a, q, p) => `${a}=${q}${resolvePath(p)}${q}`);
    }
    if (ext === '.html' || ext === '.css') {
      content = content.replace(/url\(\s*(['"]?)(\/[^)'"\s]+)\1\s*\)/gi, (_, q, p) => `url(${q}${resolvePath(p)}${q})`);
    }
    // Local asset and page URLs embedded as JavaScript string literals.
    if (ext === '.html' || ext === '.js') {
      content = content.replace(/(['"`])(\/(?:assets|css|js|img|archives|categories|tags|about|arbitrage|research|search|works|link|ai|shuoshuo)\/[^'"`\s]*)\1/g, (_, q, p) => `${q}${resolvePath(p)}${q}`);
    }
    writeFileSync(path, content);
  }
}
walk(root);
const html = readFileSync(join(root, 'archives/aac102cf.html'), 'utf8');
if (!html.includes('/blog/assets/uni-review/charts.js')) throw new Error('Article chart path was not rewritten');
const chart = readFileSync(join(root, 'assets/uni-review/charts.js'), 'utf8');
if (!chart.includes("/blog/assets/uni-review/")) throw new Error('Chart data path was not rewritten');
console.log('Prepared GitHub Pages assets for /blog/');
