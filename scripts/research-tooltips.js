'use strict';
const fs = require('node:fs');
const path = require('node:path');
const routes = JSON.parse(fs.readFileSync(path.join(hexo.base_dir, 'article-routes.json'), 'utf8'));
const index = fs.readFileSync(path.join(hexo.base_dir, 'source/research/index.md'), 'utf8');
const included = new Set([...index.matchAll(/\/archives\/([a-f\d]{8})\.html/g)].map(match => `archives/${match[1]}.html`));
hexo.extend.filter.register('after_post_render', data => {
  const id = String(data.legacy_id ?? (data.source || '').replace(/^_posts\//, '').replace(/\.md$/, ''));
  if (!included.has(routes[id])) return data;
  if (routes[id] !== 'archives/5596f036.html' && !data.content.includes('/archives/5596f036.html')) {
    data.content += '\n<p class="research-related">相关阅读：<a href="/archives/5596f036.html">交易术语字典</a> · <a href="/research/">调研清单</a></p>';
  }
  data.content += '\n<link rel="stylesheet" href="/css/research-tooltips.css"><script defer src="/js/research-tooltips.js"></script>';
  return data;
});
