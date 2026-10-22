'use strict';
const { execFileSync } = require('node:child_process');

const day = value => String(value || '').slice(0, 10);
const visible = post => !['237', '704'].includes(String(post.legacy_id)) && post.published !== false;

function summarize(posts, commits, today) {
  posts = posts.filter(p => visible(p) && day(p.date) <= today);
  const days = {}, categories = {}, updates = new Set();
  const add = (date, type) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date > today) return;
    days[date] ||= { publish: 0, update: 0, maintenance: 0 };
    days[date][type]++;
  };
  const bySource = new Map(posts.map(p => [p.source, p]));
  for (const p of posts) {
    add(day(p.date), 'publish');
    for (const name of new Set((p.categories || []).flat())) categories[name] = (categories[name] || 0) + 1;
  }
  for (const commit of commits) {
    // Bulk imports/route migrations are site maintenance, not hundreds of writing events.
    const bulk = commit.files.filter(([,file]) => file.startsWith('source/_posts/')).length > 50;
    let maintenance = bulk;
    for (const [status, file] of commit.files) {
      const p = bySource.get(file);
      if (p && !bulk && status === 'M' && commit.date >= day(p.date)) {
        add(commit.date, 'update');
        updates.add(`${file}:${commit.date}`);
      } else if (!file.startsWith('source/_posts/') && /^(source\/(?!assets\/activity\/)|scripts\/|themes\/|_config.*\.yml$)/.test(file)) {
        maintenance = true;
      }
    }
    if (maintenance) add(commit.date, 'maintenance');
  }
  for (const p of posts) {
    if (p.updated && String(p.updated) > String(p.date) && !updates.has(`${p.source}:${day(p.updated)}`)) add(day(p.updated), 'update');
  }
  return { articles: posts.length, days, categories, generatedAt: new Date().toISOString(), timezone: 'Asia/Tokyo' };
}

function history(cwd) {
  const raw = execFileSync('git', ['log', '--no-merges', '--format=@@%aI', '--name-status', '--no-renames'], { cwd, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024, timeout: 15000 });
  const commits = [];
  for (const line of raw.split('\n')) {
    if (line.startsWith('@@')) {
      const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo', year:'numeric',month:'2-digit',day:'2-digit' }).format(new Date(line.slice(2)));
      commits.push({ date, files: [] });
    } else if (/^[AMD]\t/.test(line) && commits.length) commits.at(-1).files.push(line.split('\t'));
  }
  return commits;
}

module.exports = { summarize, history };
