import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';
import YAML from 'yaml';

export function verifyArticleRoutes(root) {
  const routes = JSON.parse(readFileSync(join(root, 'article-routes.json'), 'utf8'));
  const publicDir = join(root, 'public');
  const expected = new Set();
  for (const name of readdirSync(join(root, 'source/_posts'))) {
    if (!name.endsWith('.md')) continue;
    const raw = readFileSync(join(root, 'source/_posts', name), 'utf8');
    const front = YAML.parse(raw.match(/^---\s*\n([\s\S]*?)\n---/)[1]);
    const id = String(front.legacy_id ?? name.replace(/\.md$/, ''));
    if (['237', '704'].includes(id)) {
      assert.equal(front.published, false, `Held article ${id} must be unpublished`);
      assert.equal(routes[id], undefined);
      continue;
    }
    if (front.published === false) continue;
    assert.equal(front.permalink, routes[id], `Persistent route ${id}`);
    assert.match(front.permalink, /^archives\/[a-f0-9]{8}\.html$/);
    assert.ok(existsSync(join(publicDir, front.permalink)), `Missing article ${id}`);
    expected.add('/' + front.permalink);
  }
  assert.equal(expected.size, Object.keys(routes).length);
  assert.equal(existsSync(join(publicDir, 'article-routes.json')), false, 'Do not publish the ID mapping');
  assert.equal(existsSync(join(publicDir, 'index.php')), false, 'Old PHP routes must not be generated');
  let checked = 0;
  const walk = directory => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) { walk(path); continue; }
      if (!/\.(html|xml)$/.test(entry.name)) continue;
      assert.ok(!/^\d+\.html$/.test(entry.name) || !directory.endsWith('/archives'), `Numeric alias: ${path}`);
      const text = readFileSync(path, 'utf8');
      const $ = load(text, entry.name.endsWith('.xml') ? {xml: true} : {});
      const links = $('[href]').map((_, el) => $(el).attr('href')).get();
      if (entry.name === 'search.xml') links.push(...$('entry > url').map((_, el) => $(el).text()).get());
      for (const link of links) {
        let url;
        try { url = new URL(link, 'https://leon-book.github.io'); } catch { continue; }
        if (!['leon-book.github.io', 'localhost', '127.0.0.1', 'ikarp.top', 'www.ikarp.top'].includes(url.hostname)) continue;
        // A citation to an article absent from the migrated collection remains external.
        const legacy = url.pathname.match(/^\/index\.php\/archives\/(\d+)\.html$/);
        if (['ikarp.top', 'www.ikarp.top'].includes(url.hostname) && legacy && !routes[legacy[1]] && !['237','704'].includes(legacy[1])) continue;
        assert.ok(!/^\/(?:index\.php\/)?archives\/\d+\.html$/.test(url.pathname), `Old link in ${path}: ${url.pathname}`);
        if (/^\/archives\/[a-f0-9]{8}\.html$/.test(url.pathname)) {
          assert.ok(expected.has(url.pathname), `Broken article link: ${url.pathname}`);
          checked++;
        }
      }
    }
  };
  walk(publicDir);
  const search = load(readFileSync(join(publicDir, 'search.xml'), 'utf8'), {xml: true});
  const indexed = new Set(search('entry > url').map((_, el) => new URL(search(el).text(), 'https://leon-book.github.io').pathname).get());
  assert.deepEqual(indexed, expected, 'Search covers exactly the public articles');
  return { articles: expected.size, checkedLinks: checked };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(verifyArticleRoutes(fileURLToPath(new URL('..', import.meta.url))));
}
