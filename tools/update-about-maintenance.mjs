import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { nextMarker } = require('./about-maintenance.cjs');
const destination = process.argv[2];

if (!destination) throw new Error('Usage: node tools/update-about-maintenance.mjs <marker-path>');

const today = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit'
}).format(new Date());

let current = null;
try { current = JSON.parse(await readFile(destination, 'utf8')); } catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const next = nextMarker(current, today);
if (!next) {
  console.log(`Daily about marker is already current for ${today}`);
  process.exit(0);
}

await writeFile(destination, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
console.log(`Daily about marker updated: ${next.date} (#${next.total})`);
