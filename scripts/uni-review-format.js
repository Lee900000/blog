'use strict';

const cheerio = require('cheerio');

// Keep dates and durations readable while emphasizing financial values in this post only.
hexo.extend.filter.register('after_post_render', data => {
  if (data.source !== '_posts/uni-funding-arbitrage-close-review.md') return data;
  const $ = cheerio.load(data.content, null, false);
  const token = /(?:UTC\s*[+-]\s*\d+|\d{4}-\d{1,2}-\d{1,2}|\d{1,2}:\d{2}|\d+(?:\.\d+)?\s*(?:年|月|日|天|小时|分钟|秒)|[+−-]?\d+(?:\.\d+)?%?)/g;
  const isTime = /^(?:UTC\s*[+-]\s*\d+|\d{4}-\d{1,2}-\d{1,2}|\d{1,2}:\d{2}|\d+(?:\.\d+)?\s*(?:年|月|日|天|小时|分钟|秒))$/;
  const walk = node => {
    if (node.type === 'tag' && ['svg', 'script', 'style', 'code', 'pre', 'h1', 'h2', 'h3', 'h4'].includes(node.name)) return;
    if (node.type === 'text') {
      const text = node.data;
      const pieces = [];
      let cursor = 0;
      for (const match of text.matchAll(token)) {
        pieces.push($('<span></span>').text(text.slice(cursor, match.index)).html());
        const value = match[0];
        const escaped = $('<span></span>').text(value).html();
        pieces.push(isTime.test(value) ? escaped : `<span class="uni-review-number">${escaped}</span>`);
        cursor = match.index + value.length;
      }
      if (cursor) {
        pieces.push($('<span></span>').text(text.slice(cursor)).html());
        $(node).replaceWith(pieces.join(''));
      }
      return;
    }
    for (const child of [...(node.children || [])]) walk(child);
  };
  for (const child of [...$.root()[0].children]) walk(child);
  data.content = $.root().html();
  return data;
});
