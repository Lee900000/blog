'use strict';

// Change only the navigation brand; page titles and Leon's author avatar stay intact.
hexo.extend.filter.register('after_render:html', html => html.replace(
  /(<a\b[^>]*class="nav-site-title"[^>]*>)([\s\S]*?)(<\/a>)/g,
  (match, open, content, close) => {
    const root = hexo.config.root.replace(/\/$/, '');
    const images = `<img class="site-icon logo-hero" src="${root}/assets/brand/tago-logo-hero.svg" alt="Tago"><img class="site-icon logo-light" src="${root}/assets/brand/tago-logo-v1.svg" alt="Tago">`;
    const label = content.replace(/<img\b[^>]*>/g, '').replace(/(<span class="site-name">)[\s\S]*?(<\/span>)/, '$1开发手记$2');
    return open + images + label + close;
  }
));
