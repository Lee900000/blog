'use strict';
const { randomBytes } = require('node:crypto');
const { readFileSync, writeFileSync, readdirSync, existsSync } = require('node:fs');
const { join, resolve } = require('node:path');
const YAML = require('yaml');
const BLOCKED = new Set(['237', '704']);
const ROUTE = /^archives\/(?=[a-f0-9]*[a-f])[a-f0-9]{8}\.html$/;

function assignRoutes(ids, previous) {
  const routes = { ...previous };
  const used = new Set();
  for (const [id, route] of Object.entries(routes)) {
    if (BLOCKED.has(id) || !ROUTE.test(route) || used.has(route)) throw new Error(`Invalid article route: ${id}`);
    used.add(route);
  }
  for (const id of ids) {
    if (BLOCKED.has(String(id)) || routes[id]) continue;
    let route;
    do { route = `archives/${randomBytes(4).toString('hex')}.html`; } while (used.has(route) || !ROUTE.test(route));
    routes[id] = route;
    used.add(route);
  }
  return routes;
}

function rewriteLinks(text, routes) {
  // Match complete URLs, never the path embedded in an unrelated external URL.
  return text.replace(/https?:\/\/[^\s<>"'()]+|(?<![\w/.:])\/(?:index\.php\/)?archives\/\d+\.html(?:[?#][^\s<>"'()]*)?/g, value => {
    let path = value;
    if (/^https?:/.test(value)) {
      let url;
      try { url = new URL(value); } catch { return value; }
      if (!['leon-book.github.io', 'www.ikarp.top', 'ikarp.top', 'localhost', '127.0.0.1'].includes(url.hostname)) return value;
      path = url.pathname + url.search + url.hash;
    }
    const match = path.match(/^\/(?:index\.php\/)?archives\/(\d+)\.html([?#].*)?$/);
    if (!match) return value;
    if (BLOCKED.has(match[1])) return '/404.html';
    return routes[match[1]] ? `/${routes[match[1]]}${match[2] || ''}` : value;
  });
}

function prepare(root) {
  const file = join(root, 'article-routes.json');
  const dir = join(root, 'source/_posts');
  const posts = readdirSync(dir).filter(name => name.endsWith('.md')).map(name => {
    const text = readFileSync(join(dir, name), 'utf8');
    const front = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!front) throw new Error(`Missing frontmatter: ${name}`);
    const data = YAML.parse(front[1]);
    return { name, text, front, data, id: String(data.legacy_id ?? name.replace(/\.md$/, '')) };
  });
  const routes = assignRoutes(posts.filter(p => p.data.published !== false).map(p => p.id), existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {});
  writeFileSync(file, JSON.stringify(routes, null, 2) + '\n');
  let changed = 0;
  for (const post of posts) {
    if (BLOCKED.has(post.id) || post.data.published === false) continue;
    const header = /^permalink:.*$/m.test(post.front[1])
      ? post.front[1].replace(/^permalink:.*$/m, `permalink: ${routes[post.id]}`)
      : `${post.front[1]}\npermalink: ${routes[post.id]}`;
    const next = `---\n${header}\n---` + rewriteLinks(post.text.slice(post.front[0].length), routes);
    if (next !== post.text) { writeFileSync(join(dir, post.name), next); changed++; }
  }
  console.log(`Prepared ${Object.keys(routes).length} stable article routes; updated ${changed} posts.`);
}

module.exports = { assignRoutes, rewriteLinks, BLOCKED, ROUTE };
if (require.main === module) prepare(resolve(__dirname, '..'));
