import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import YAML from 'yaml';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const config = () => YAML.parse(read('_config.yml'));
const theme = () => YAML.parse(read('_config.butterfly.yml'));

test('published site exposes the Tago brand and Lee author identity', () => {
  const site = config();
  assert.equal(site.title, 'Tago · 开发手记');
  assert.equal(site.subtitle, '记录技术、量化与想法落地的过程');
  assert.deepEqual(theme().subtitle.sub, ['如果说我看得比别人更远些，那是因为我站在巨人的肩膀上。<br>而这个博客，就是我的巨人！']);
  assert.equal(site.author, 'Lee');
  assert.ok(site.skip_render.includes('README.md'));

  const about = read('source/about/index.md');
  assert.ok(about.includes('https://github.com/kary2999'));
  assert.ok(about.includes('src="../assets/profile/leon-avatar.png"'));

  const pages = YAML.parse(read('_config.leon-book-pages.yml'));
  assert.equal(site.theme_config, undefined);
  assert.equal(pages.theme_config, undefined);
  assert.ok(!(theme().inject?.head ?? []).some(item => item.includes('leon.css')));

  assert.ok(existsSync(new URL('../source/README.md', import.meta.url)));
  const deploymentReadme = read('source/README.md');
  assert.ok(deploymentReadme.includes('# Tago · 开发手记'));
  assert.ok(deploymentReadme.includes('https://www.tago.top/'));
});

test('custom stylesheet follows the configured root without duplicate links', () => {
  const scriptPath = new URL('../scripts/native-features.js', import.meta.url);
  let beforeGenerate;
  const hexo = {
    base_dir: fileURLToPath(new URL('../', import.meta.url)),
    config: {root: '/blog/', imported_post_comments: false},
    theme: {config: {inject: {head: [
      '<meta name="example" content="kept">',
      '<link rel="stylesheet" href="/css/leon.css?v=2">'
    ]}}},
    extend: {
      filter: {register: (event, fn) => { if (event === 'before_generate') beforeGenerate = fn; }},
      generator: {register: () => {}}
    }
  };

  vm.runInNewContext(read('scripts/native-features.js'), {hexo, require: createRequire(scriptPath)});
  assert.equal(typeof beforeGenerate, 'function');
  beforeGenerate();
  assert.deepEqual(JSON.parse(JSON.stringify(hexo.theme.config.inject.head)), [
    '<meta name="example" content="kept">',
    '<link rel="stylesheet" href="/blog/css/leon.css?v=2">'
  ]);

  hexo.config.root = '/';
  beforeGenerate();
  assert.deepEqual(JSON.parse(JSON.stringify(hexo.theme.config.inject.head)), [
    '<meta name="example" content="kept">',
    '<link rel="stylesheet" href="/css/leon.css?v=2">'
  ]);
});

test('navigation exposes the selected native archive and taxonomy pages', () => {
  assert.ok(theme().menu['标签']?.startsWith('/tags/'));
  assert.equal(YAML.parse(read('source/tags/index.md').split('---')[1]).type, 'tags');
  assert.equal(YAML.parse(read('source/categories/index.md').split('---')[1]).type, 'categories');
  assert.equal(theme().menu['分类'], undefined);
  assert.ok(theme().menu['归档'].startsWith('/archives/'));
});

test('AI practice uses the concise title in navigation and page metadata', () => {
  assert.equal(theme().menu['AI实践'], undefined);
  assert.equal(theme().menu['AI 落地介绍'], undefined);
  const page = YAML.parse(read('source/ai/index.md').split('---')[1]);
  assert.equal(page.title, '作品内容已迁移');
});

test('shuoshuo remains an unlisted native empty page, not invented dated content', () => {
  assert.equal(theme().menu['说说'], undefined);
  const page = YAML.parse(read('source/shuoshuo/index.md').split('---')[1]);
  assert.equal(page.type, 'shuoshuo');
  assert.ok(page.title.includes('暂无内容'));
  assert.deepEqual(YAML.parse(read('source/_data/shuoshuo.yml')), []);
});

test('friends retain only the five genuine links from the old friends page', () => {
  assert.ok(theme().menu['友链']?.startsWith('/link/'));
  assert.equal(YAML.parse(read('source/link/index.md').split('---')[1]).type, 'link');
  const friends = YAML.parse(read('source/_data/link.yml')).flatMap(group => group.link_list);
  assert.deepEqual(friends.map(({name, link}) => [name, link]), [
    ['张戈', 'https://zhangge.net/about.html'],
    ['运维派', 'http://www.yunweipai.com/category/tiku'],
    ['KoMiles', 'http://www.cnblogs.com/wangkongming/'],
    ['苏洋博客', 'https://soulteary.com/'],
    ['KimYx', 'https://www.aiking.dev/blog']
  ]);
});

test('native announcement, ribbon and siteinfo are truthful', () => {
  const t = theme();
  assert.equal(t.aside.card_announcement.enable, true);
  assert.ok(t.aside.card_announcement.content.includes('技术'));
  assert.equal(t.canvas_ribbon?.enable, true);
  assert.equal(t.canvas_ribbon.mobile, false);
  assert.equal(t.index_img, '/assets/theme/butterfly-teal-smoke.jpg');
  assert.equal(t.aside.card_webinfo?.runtime_date, '2015/07/01 00:00:00');
  assert.equal(t.aside.card_webinfo.post_count, true);
  assert.equal(t.footer.owner.since, 2015);
  assert.deepEqual(t.busuanzi, {site_uv: false, site_pv: false, page_pv: false});
});

test('article and newest comments use only the local Twikoo backend', () => {
  assert.equal(theme().comments?.use, 'Twikoo');
  assert.equal(theme().twikoo.envId, 'http://127.0.0.1:8089/');
  assert.equal(theme().twikoo.visitor, false);
  assert.equal(theme().aside.card_newest_comments.enable, true);
  assert.equal(config().imported_post_comments, true);
  assert.equal(theme().CDN.option.twikoo, '/assets/vendor/twikoo-1.7.24.all.min.js');
});

test('imported comments opt-in changes rendering only and respects scope and switch', () => {
  const scriptPath = new URL('../scripts/native-features.js', import.meta.url);
  assert.ok(existsSync(scriptPath), 'render-time comment hook must exist');
  let filter;
  const hexo = {
    base_dir: fileURLToPath(new URL('../', import.meta.url)),
    config: {imported_post_comments: true},
    extend: {filter: {register: (event, fn) => { if (event === 'before_post_render') filter = fn; }}, generator: {register: () => {}}}
  };
  vm.runInNewContext(read('scripts/native-features.js'), {hexo, require: createRequire(scriptPath)});
  const original = {layout: 'post', legacy_id: 883, comments: false, raw: 'unchanged body'};
  assert.equal(filter({...original}).comments, true);
  assert.equal(filter({...original}).raw, original.raw);
  assert.equal(filter({...original, layout: 'page'}).comments, false);
  assert.equal(filter({...original, legacy_id: 999999}).comments, false);
  assert.equal(filter({layout: 'post', comments: false}).comments, false);
  hexo.config.imported_post_comments = false;
  assert.equal(filter({...original}).comments, false);
});

test('native local search is backed by a generated XML article index', () => {
  assert.equal(theme().search?.use, 'local_search');
  assert.equal(config().search?.path, 'search.xml');
  assert.equal(config().search?.field, 'post');
  assert.equal(config().search?.content, true);
  assert.equal(JSON.parse(read('package.json')).dependencies['hexo-generator-searchdb'], '1.5.0');
});
