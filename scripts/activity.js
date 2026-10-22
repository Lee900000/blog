'use strict';
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const YAML = require('yaml');
const { summarize, history } = require('../tools/activity.cjs');

hexo.extend.generator.register('about-activity', function (locals) {
  const posts = locals.posts.toArray().map(post => {
    const raw = readFileSync(join(hexo.source_dir, post.source), 'utf8');
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    return { ...(match ? YAML.parse(match[1]) : {}), source: `source/${post.source}` };
  });
  const today = new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const blog = summarize(posts, history(hexo.base_dir), today);
  return { path: 'assets/activity.json', data: JSON.stringify({ blog }) };
});
