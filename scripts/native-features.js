'use strict';

// Butterfly injects configured HTML verbatim, so a root-absolute custom CSS URL
// breaks when the site is published below /blog/. Derive one link from Hexo's
// active root and remove stale copies before every generation.
hexo.extend.filter.register('before_generate', () => {
  const root = hexo.config.root === '/' ? '' : hexo.config.root.replace(/\/+$/, '');
  const stylesheet = `<link rel="stylesheet" href="${root}/css/leon.css?v=2">`;
  const inject = hexo.theme.config.inject ?? {};
  const head = (inject.head ?? []).filter(item => !item.includes('leon.css'));
  hexo.theme.config.inject = {...inject, head: [...head, stylesheet]};
  hexo.theme.config.asset = {...hexo.theme.config.asset, local_search: `${root}/js/monthly-search.js`};
}, 20);

hexo.extend.generator.register('monthly-search', function (locals) {
  const { createMonthlyIndex } = require('../tools/monthly-search.cjs');
  const result = createMonthlyIndex(locals.posts.toArray(), this.config.root);
  return [{ path: 'search/manifest.json', data: JSON.stringify(result.manifest) }, ...result.shards];
});

hexo.extend.filter.register('before_post_render', data => {
  if (hexo.config.imported_post_comments === true && data.layout === 'post') {
    data.comments = true;
  }
  return data;
});

// searchdb 1.5 concatenates root + article.path. Imported explicit permalinks
// already begin with '/', which otherwise produces protocol-relative //index.php URLs.
// Normalize a generator-only projection; never change Hexo posts or their source.
const searchGenerator = require('hexo-generator-searchdb/lib/xml_generator');
hexo.extend.generator.register('xml', function (locals) {
  const project = articles => articles.map(article => ({
    title: article.title,
    path: article.path.replace(/^\/+/, ''),
    content: article.content,
    _content: article._content,
    categories: article.categories,
    tags: article.tags
  }));
  return searchGenerator.call(this, {
    ...locals,
    posts: project(locals.posts),
    pages: project(locals.pages)
  });
});
