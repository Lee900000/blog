import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('root GitHub Pages build uses root-relative asset and navigation URLs', async () => {
  const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');

  assert.match(html, /href="\/css\/index\.css\?v=/);
  assert.match(html, /href="\/css\/leon\.css\?v=2"/);
  assert.match(html, /src="\/js\/main\.js\?v=/);
  assert.doesNotMatch(html, /(?:href|src)="\/blog\//);
});
