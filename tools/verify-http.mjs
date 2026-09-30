import assert from 'node:assert/strict';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {load} from 'cheerio';

const origin = process.env.PREVIEW_ORIGIN || 'http://127.0.0.1:4000';
const discovery = JSON.parse(await readFile('migration/discovery.json', 'utf8'));
const expected = [...discovery.ids].sort((a, b) => a - b);
const manifest = JSON.parse(await readFile('migration/manifest.json', 'utf8'));
const records = new Map(manifest.posts.map(post => [Number(post.legacy_id), post]));
assert.equal(expected.length, discovery.count);
assert.equal(records.size, expected.length, 'Manifest must cover the discovery snapshot');
assert.ok(expected.every(id => records.has(id)), 'Manifest ID set differs from discovery');

const failures = [];
const verified = [];
const localImages = new Set();
let next = 0;
async function readPage(path) {
  const url = new URL(path, origin);
  assert.equal(url.origin, new URL(origin).origin);
  const response = await fetch(url, {signal: AbortSignal.timeout(20000), redirect: 'manual'});
  assert.equal(response.status, 200, `Unexpected HTTP status for ${url.pathname}`);
  assert.match(response.headers.get('content-type') || '', /text\/html/);
  return load(await response.text());
}

async function worker() {
  while (next < expected.length) {
    const id = expected[next++];
    try {
      const record = records.get(id);
      const $ = await readPage(`/index.php/archives/${id}.html`);
      assert.equal($('h1.post-title').text().trim(), record.title.trim(), 'Article title');
      const body = $('#article-container');
      assert.equal(body.length, 1, 'Article body container');
      assert.ok(body.text().trim().length || body.find('img').length, 'Empty article body');
      const sourceDate = record.source_date || record.date;
      if (sourceDate) {
        const actual = new Date($('time.post-meta-date-created').attr('datetime')).toISOString();
        assert.equal(actual, new Date(sourceDate).toISOString(), 'Publication instant');
      }
      for (const element of body.find('img').toArray()) {
        const src = $(element).attr('data-lazy-src') || $(element).attr('data-src') || $(element).attr('src');
        if (src?.startsWith('/') && !src.startsWith('//')) localImages.add(src);
      }
      verified.push(id);
    } catch (error) {
      failures.push({legacy_id: id, error: error.message});
    }
  }
}
await Promise.all(Array.from({length: 8}, () => worker()));
for (const path of ['/', '/archives/', '/page/2/']) {
  try { await readPage(path); }
  catch (error) { failures.push({path, error: error.message}); }
}
for (const path of localImages) {
  try {
    const response = await fetch(new URL(path, origin), {method: 'HEAD', signal: AbortSignal.timeout(15000), redirect: 'manual'});
    assert.equal(response.status, 200, `Image HTTP ${response.status}`);
    assert.match(response.headers.get('content-type') || '', /^image\//);
  } catch (error) { failures.push({path, error: error.message}); }
}
const report = {origin,expected: expected.length,verified: verified.length,verified_ids: verified.sort((a,b)=>a-b),local_image_paths: localImages.size,failures};
await mkdir('.cache', {recursive: true});
await writeFile('.cache/http-verification.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify({expected: report.expected, verified: report.verified,local_image_paths: report.local_image_paths,failures}, null, 2));
assert.equal(failures.length, 0, 'Local HTTP verification failed; see .cache/http-verification.json');
assert.equal(verified.length, expected.length);
