'use strict';
const { createHash } = require('node:crypto');

function createMonthlyIndex(posts, root = '/') {
  const groups = new Map();
  for (const post of posts) {
    if (!post.title || !post.path || !post.date) continue;
    const month = typeof post.date.format === 'function' ? post.date.format('YYYY-MM') : new Date(post.date).toISOString().slice(0, 7);
    if (!groups.has(month)) groups.set(month, []);
    groups.get(month).push({ title: post.title, url: `${root.replace(/\/$/, '')}/${post.path.replace(/^\/+/, '')}`, content: post.content || '' });
  }
  const manifest = [], shards = [];
  for (const month of [...groups.keys()].sort().reverse()) {
    const data = JSON.stringify(groups.get(month));
    const hash = createHash('sha256').update(data).digest('hex').slice(0, 12);
    const path = `search/${month}.${hash}.json`;
    manifest.push({ month, url: `${root.replace(/\/$/, '')}/${path}` });
    shards.push({ path, data });
  }
  return { manifest, shards };
}
module.exports = { createMonthlyIndex };
