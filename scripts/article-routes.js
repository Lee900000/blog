'use strict';
const { join } = require('node:path');
const { readFileSync } = require('node:fs');
const { ROUTE, BLOCKED, rewriteLinks, assignRoutes } = require('../tools/article-routes.cjs');
const routes = JSON.parse(readFileSync(join(hexo.base_dir, 'article-routes.json'), 'utf8'));
assignRoutes([], routes);

hexo.extend.filter.register('before_post_render', data => {
  if (data.layout === 'post') {
    if (data.published === false) return data;
    const id = String(data.legacy_id ?? data.source.replace(/^_posts\//, '').replace(/\.md$/, ''));
    if (BLOCKED.has(id)) throw new Error(`Blocked article ${id} must remain unpublished`);
    if (!ROUTE.test(data.__permalink || '') || routes[id] !== data.__permalink) {
      throw new Error(`Article ${id}: run npm run routes:prepare before building`);
    }
  }
  data.content = rewriteLinks(data.content, routes);
  return data;
});
