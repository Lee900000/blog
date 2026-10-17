'use strict';

const { load } = require('cheerio');

// Keep every archive link available without JS; defer only off-screen covers.
hexo.extend.filter.register('after_render:html', html => {
  if (!html.includes('id="archive"')) return html;
  const $ = load(html, { decodeEntities: false });
  $('#archive .article-sort-item-img img').attr({
    loading: 'lazy',
    decoding: 'async'
  });
  return $.html();
});
