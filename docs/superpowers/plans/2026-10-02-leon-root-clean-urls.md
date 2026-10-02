# Leon Root Site and Clean URLs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish Leon Blog at `https://leon-book.github.io/` with canonical article URLs such as `/archives/884.html`, while preserving old `/index.php/` and `/blog/index.php/` links as redirects.

**Architecture:** Keep Hexo source as the single content source, migrate stored post permalinks and future importer output to a shared clean-URL policy, and build the root site from a clean Git export. Generate a separate static redirect artifact for legacy paths; publish the full site to `leon-book/leon-book.github.io` first and the redirect-only compatibility site to `leon-book/blog` second.

**Tech Stack:** Node.js 24, Hexo 8.1.2, Butterfly 5.7.0, Node test runner, Cheerio 1.2.0, YAML 2.9.1, GitHub Pages, GitHub CLI.

**Spec:** `docs/superpowers/specs/2026-10-02-leon-root-clean-urls-design.md`

## Global Constraints

- Canonical homepage is `https://leon-book.github.io/`.
- Canonical article path is `/archives/:legacy_id.html`.
- `leon-book/leon-book.github.io` contains the generated root site; `leon-book/blog` contains redirect-only compatibility output.
- Preserve titles, article bodies, taxonomy, dates, legacy IDs, the NVDA report styles, and all external links.
- Never publish article 237 or 704, including redirects and search-index entries.
- Do not change or deploy anything under the `kary2999` account.
- Do not delete either Leon repository or rewrite remote history.
- Keep the untracked local `_multiconfig.yml` untouched.

## Review Focus

- A URL with query text and a hash, such as `/index.php/archives/20.html?a=1#x`, must retain both components after conversion.
- A third-party URL containing `/index.php/archives/` must remain external and unchanged.
- IDs 237 and 704 must be absent even when their untracked source files exist in the developer checkout.
- Root builds must contain no `/blog/` asset prefix, while compatibility pages must target the root domain exactly once.
- Redirect HTML must safely encode the target in HTML and JavaScript contexts and provide a clickable fallback.

---

## File Structure

- `scripts/url-policy.mjs`: pure URL/path conversion, held-ID policy, and redirect rendering.
- `scripts/migrate-clean-urls.mjs`: idempotent mechanical migration of tracked post frontmatter, internal links, and manifest permalinks.
- `scripts/build-legacy-redirects.mjs`: creates root-site and `/blog/` compatibility artifacts from the tracked manifest.
- `_config.leon-root-pages.yml`: root-domain production overlay.
- `tests/clean-urls.test.mjs`: policy and source-migration behavior.
- `tests/legacy-redirects.test.mjs`: redirect artifact behavior and held-ID exclusion.
- `tests/root-built.test.mjs`: user-visible root build contract.
- Existing migration, feature, and NVDA tests: updated only where their expected canonical route changes.

### Task 1: Introduce the clean URL policy

**Files:**
- Create: `scripts/url-policy.mjs`
- Create: `tests/clean-urls.test.mjs`

**Interfaces:**
- Produces: `HELD_ARTICLE_IDS`, `cleanArticlePath(id)`, `legacyArticlePath(id)`, `rewriteInternalUrl(raw)`, and `renderRedirect(target)`.
- Consumes: no project state; all functions are deterministic.

- [ ] **Step 1: Write the failing policy tests**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  HELD_ARTICLE_IDS,
  cleanArticlePath,
  legacyArticlePath,
  rewriteInternalUrl,
  renderRedirect
} from '../scripts/url-policy.mjs';

test('article paths are clean and held IDs stay explicit', () => {
  assert.equal(cleanArticlePath(884), 'archives/884.html');
  assert.equal(legacyArticlePath(884), 'index.php/archives/884.html');
  assert.deepEqual([...HELD_ARTICLE_IDS], [237, 704]);
});

test('internal legacy URLs keep query and hash while external lookalikes stay unchanged', () => {
  assert.equal(
    rewriteInternalUrl('/index.php/archives/20.html?a=1#x'),
    '/archives/20.html?a=1#x'
  );
  assert.equal(
    rewriteInternalUrl('https://www.ikarp.top/index.php/archives/20.html#x'),
    '/archives/20.html#x'
  );
  assert.equal(
    rewriteInternalUrl('https://example.com/index.php/archives/20.html#x'),
    'https://example.com/index.php/archives/20.html#x'
  );
});

test('redirect document exposes canonical, refresh, replace and fallback target', () => {
  const html = renderRedirect('https://leon-book.github.io/archives/884.html');
  assert.match(html, /rel="canonical" href="https:\/\/leon-book\.github\.io\/archives\/884\.html"/);
  assert.match(html, /http-equiv="refresh"/);
  assert.match(html, /location\.replace/);
  assert.match(html, />https:\/\/leon-book\.github\.io\/archives\/884\.html<\/a>/);
});

test('redirect renderer rejects another origin and neutralizes script delimiters', () => {
  assert.throws(() => renderRedirect('https://example.com/archives/884.html'), /origin/);
  const html = renderRedirect('https://leon-book.github.io/archives/%3C/script%3E.html');
  assert.doesNotMatch(html, /<\/script>\.html/);
});
```

- [ ] **Step 2: Run the tests and verify the module is missing**

Run: `node --test tests/clean-urls.test.mjs`

Expected: FAIL because `scripts/url-policy.mjs` does not exist.

- [ ] **Step 3: Implement the minimal pure policy module**

```js
export const HELD_ARTICLE_IDS = new Set([237, 704]);
const INTERNAL_HOSTS = new Set(['ikarp.top', 'www.ikarp.top', 'leon-book.github.io']);

export const cleanArticlePath = id => `archives/${Number(id)}.html`;
export const legacyArticlePath = id => `index.php/archives/${Number(id)}.html`;

export function rewriteInternalUrl(raw) {
  const base = new URL('https://leon-book.github.io/');
  const url = new URL(raw, base);
  const match = url.pathname.match(/^(?:\/blog)?\/index\.php\/archives\/(\d+)\.html$/);
  if (!match || (url.origin !== base.origin && !INTERNAL_HOSTS.has(url.hostname))) return raw;
  return `/archives/${Number(match[1])}.html${url.search}${url.hash}`;
}

const escapeHtml = value => value
  .replaceAll('&', '&amp;').replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export function renderRedirect(target) {
  const url = new URL(target);
  if (url.origin !== 'https://leon-book.github.io') throw new Error('Unexpected redirect origin');
  const safe = escapeHtml(url.href);
  const js = JSON.stringify(url.href).replaceAll('<', '\\u003c');
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=${safe}"><link rel="canonical" href="${safe}"><title>页面已迁移</title></head><body><p>页面已迁移到 <a href="${safe}">${safe}</a></p><script>location.replace(${js})</script></body></html>\n`;
}
```

- [ ] **Step 4: Run the policy tests**

Run: `node --test tests/clean-urls.test.mjs`

Expected: 3 tests pass.

- [ ] **Step 5: Commit the policy**

```bash
git add scripts/url-policy.mjs tests/clean-urls.test.mjs
git commit -m "feat(blog): define clean article URL policy"
```

### Task 2: Migrate stored and future article URLs

**Files:**
- Create: `scripts/migrate-clean-urls.mjs`
- Modify: `migration/extractor.mjs`
- Modify: `migration/verify.mjs`
- Modify: `migration/manifest.json`
- Modify: `_config.yml`
- Modify: `source/_posts/*.md` mechanically
- Modify: `tests/full.test.mjs`
- Modify: `tests/extractor.test.mjs`
- Extend: `tests/clean-urls.test.mjs`

**Interfaces:**
- Consumes: clean-path functions from `scripts/url-policy.mjs`.
- Produces: `migrateSourceTree(root, {write})` returning `{changedFiles, oldLinksRemaining}` and an idempotently migrated tracked source tree.

- [ ] **Step 1: Add failing migration and importer tests**

Add fixtures under a temporary directory and assert:

```js
test('source migration rewrites frontmatter and internal links without touching external lookalikes', async () => {
  const result = await migrateSourceTree(fixtureRoot, {write: true});
  const post = readFileSync(join(fixtureRoot, 'source/_posts/20.md'), 'utf8');
  assert.match(post, /permalink: archives\/20\.html/);
  assert.match(post, /\]\(\/archives\/21\.html\?a=1#x\)/);
  assert.match(post, /https:\/\/example\.com\/index\.php\/archives\/21\.html/);
  assert.equal(result.oldLinksRemaining, 0);
});

test('source migration is idempotent', async () => {
  await migrateSourceTree(fixtureRoot, {write: true});
  const second = await migrateSourceTree(fixtureRoot, {write: true});
  assert.equal(second.changedFiles, 0);
});
```

Update extractor expectations to require `archives/883.html` and `/archives/882.html` while keeping `sourceURL(id)` on the old source host unchanged.

- [ ] **Step 2: Run focused tests and verify old behavior fails**

Run: `node --test tests/clean-urls.test.mjs tests/extractor.test.mjs tests/full.test.mjs`

Expected: FAIL on old `index.php` output and missing migration module.

- [ ] **Step 3: Implement the idempotent migration script**

Implement `migrateSourceTree` to:

1. enumerate `source/_posts/*.md`;
2. replace only frontmatter matching `permalink: index.php/archives/\\d+.html`;
3. rewrite only relative links and known internal hosts through `rewriteInternalUrl`;
4. update `migration/manifest.json` post `permalink` values;
5. support `--check` without writes and default to explicit `--write`;
6. return exact changed-file and remaining-old-link counts.

Use this implementation shape so the rewrite is narrow and repeatable:

```js
import {readdir, readFile, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {cleanArticlePath, rewriteInternalUrl} from './url-policy.mjs';

const LEGACY_INTERNAL = /(?:(?:https?:\/\/(?:www\.)?(?:ikarp\.top|leon-book\.github\.io))?\/(?:blog\/)?index\.php\/archives\/\d+\.html(?:\?[^\s)"']*)?(?:#[^\s)"']*)?)/g;

export async function migrateSourceTree(root, {write}) {
  const postsDir = join(root, 'source/_posts');
  const names = (await readdir(postsDir)).filter(name => name.endsWith('.md')).sort();
  let changedFiles = 0;
  let oldLinksRemaining = 0;
  for (const name of names) {
    const path = join(postsDir, name);
    const before = await readFile(path, 'utf8');
    const id = Number(name.slice(0, -3));
    const after = before
      .replace(/^permalink: index\.php\/archives\/\d+\.html$/m, `permalink: ${cleanArticlePath(id)}`)
      .replace(LEGACY_INTERNAL, value => rewriteInternalUrl(value));
    if (after !== before) {
      changedFiles += 1;
      if (write) await writeFile(path, after);
    }
    oldLinksRemaining += (after.match(/(?:^|[(/])index\.php\/archives\//g) ?? []).length;
  }

  const manifestPath = join(root, 'migration/manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  let manifestChanged = false;
  for (const post of manifest.posts) {
    const clean = cleanArticlePath(post.legacy_id);
    if (post.permalink !== clean) {
      post.permalink = clean;
      manifestChanged = true;
    }
  }
  if (manifestChanged) {
    changedFiles += 1;
    if (write) await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  }
  return {changedFiles, oldLinksRemaining};
}
```

The command entry point must reject running without one of `--check` or `--write`:

```js
const mode = process.argv[2];
if (!['--check', '--write'].includes(mode)) {
  throw new Error('Usage: node scripts/migrate-clean-urls.mjs --check|--write');
}
const result = await migrateSourceTree(process.cwd(), {write: mode === '--write'});
console.log(JSON.stringify(result));
if (mode === '--check' && result.changedFiles > 0) process.exitCode = 1;
```

- [ ] **Step 4: Change future extraction and verification paths**

In `migration/extractor.mjs`, retain the old `sourceURL` for fetching but return `cleanArticlePath(id)` and rewrite recognized internal links with `rewriteInternalUrl`.

In `migration/verify.mjs`, read generated files from `public/archives`, write checklist links as `/archives/${id}.html`, and explicitly exclude held IDs from publishable output checks.

Set `_config.yml`:

```yaml
permalink: archives/:legacy_id.html
```

- [ ] **Step 5: Apply the migration and prove idempotence**

Run:

```bash
node scripts/migrate-clean-urls.mjs --write
node scripts/migrate-clean-urls.mjs --check
```

Expected: first command reports migrated tracked files; second reports `changedFiles: 0` and exits 0.

- [ ] **Step 6: Run focused tests**

Run: `node --test tests/clean-urls.test.mjs tests/extractor.test.mjs tests/full.test.mjs`

Expected: all focused tests pass.

- [ ] **Step 7: Commit stored and future URL migration**

```bash
git add _config.yml migration/extractor.mjs migration/verify.mjs migration/manifest.json scripts/migrate-clean-urls.mjs tests/clean-urls.test.mjs tests/extractor.test.mjs tests/full.test.mjs source/_posts
git commit -m "feat(blog): migrate articles to clean URLs"
```

### Task 3: Build and verify the root-domain site

**Files:**
- Create: `_config.leon-root-pages.yml`
- Create: `tests/root-built.test.mjs`
- Modify: `tests/nvda-report-built.test.mjs`
- Modify: `tests/features-built.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: clean post permalinks from Task 2.
- Produces: `public/` rooted at `/`, suitable for `leon-book/leon-book.github.io`.

- [ ] **Step 1: Write failing built-output tests**

`tests/root-built.test.mjs` must inspect real generated HTML with Cheerio:

```js
test('root build uses clean canonical, asset and article links', () => {
  const article = page('archives/884.html');
  assert.equal(article('link[rel="canonical"]').attr('href'), 'https://leon-book.github.io/archives/884.html');
  assert.equal(article('a[href^="/blog/"]').length, 0);
  assert.equal(article('[src^="/blog/"]').length, 0);
  assert.ok(page('index.html')('a[href="/archives/884.html"]').length > 0);
});

test('root build never publishes held articles or indexes them', () => {
  assert.equal(existsSync(join(root, 'public/archives/237.html')), false);
  assert.equal(existsSync(join(root, 'public/archives/704.html')), false);
  const search = read('public/search.xml');
  assert.doesNotMatch(search, /archives\/(237|704)\.html/);
});
```

Update the NVDA test input from `public/index.php/archives/884.html` to `public/archives/884.html`; keep every visual and external-link assertion unchanged.

- [ ] **Step 2: Run a clean root build and verify the tests fail on missing configuration or paths**

Run:

```bash
npx hexo clean
npx hexo generate --config _config.yml,_config.leon-root-pages.yml
node --test tests/root-built.test.mjs tests/nvda-report-built.test.mjs
```

Expected: FAIL until the root overlay and held-source-safe build process exist.

- [ ] **Step 3: Add the root production overlay and scripts**

Create `_config.leon-root-pages.yml`:

```yaml
url: https://leon-book.github.io
root: /
```

Add package scripts:

```json
"build:leon-root": "hexo clean && hexo generate --config _config.yml,_config.leon-root-pages.yml",
"test:root-built": "node --test tests/root-built.test.mjs tests/features-built.mjs tests/nvda-report-built.test.mjs"
```

The release workflow must run these commands from a clean Git archive rather than the developer checkout, because local untracked held posts exist.

- [ ] **Step 4: Build from a clean Git export and run built-output tests**

```bash
release_root=$(mktemp -d /tmp/leon-root-source.XXXXXX)
git archive HEAD | tar -x -C "$release_root"
cd "$release_root"
npm ci
npm run build:leon-root
npm run test:root-built
```

Expected: root build succeeds; all built-output tests pass; held article files are absent.

- [ ] **Step 5: Commit root build support**

```bash
git add _config.leon-root-pages.yml package.json tests/root-built.test.mjs tests/features-built.mjs tests/nvda-report-built.test.mjs
git commit -m "feat(blog): add root-domain Pages build"
```

### Task 4: Generate legacy compatibility sites

**Files:**
- Create: `scripts/build-legacy-redirects.mjs`
- Create: `tests/legacy-redirects.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: tracked `migration/manifest.json`, `HELD_ARTICLE_IDS`, path helpers, and `renderRedirect`.
- Produces: `buildLegacyRedirects({manifestPath, outputDir, rootTarget})` returning `{articles, sections}`.

- [ ] **Step 1: Write failing artifact tests**

Use a temporary output directory and a fixture manifest containing IDs 20, 237, 704, and 884:

```js
test('legacy builder creates article and section redirects but excludes held IDs', async () => {
  const result = await buildLegacyRedirects({manifestPath, outputDir, rootTarget: 'https://leon-book.github.io/'});
  assert.equal(result.articles, 2);
  assert.ok(existsSync(join(outputDir, 'index.html')));
  assert.ok(existsSync(join(outputDir, 'index.php/archives/20.html')));
  assert.ok(existsSync(join(outputDir, 'index.php/archives/884.html')));
  assert.equal(existsSync(join(outputDir, 'index.php/archives/237.html')), false);
  assert.equal(existsSync(join(outputDir, 'index.php/archives/704.html')), false);
  assert.match(readFileSync(join(outputDir, 'index.php/archives/884.html'), 'utf8'), /https:\/\/leon-book\.github\.io\/archives\/884\.html/);
});
```

Also assert redirects exist for `/archives/`, `/categories/`, `/tags/`, `/about/`, `/ai/`, `/arbitrage/`, and `/link/`.

- [ ] **Step 2: Run the artifact test and verify it fails**

Run: `node --test tests/legacy-redirects.test.mjs`

Expected: FAIL because the builder does not exist.

- [ ] **Step 3: Implement the builder**

The CLI contract is:

```bash
legacy_root=$(mktemp -d /tmp/leon-legacy-redirects.XXXXXX)
node scripts/build-legacy-redirects.mjs --output "$legacy_root"
```

It must empty only the explicitly supplied output directory after validating its basename starts with `leon-legacy-redirects`, write `.nojekyll`, create one article redirect for every publishable manifest entry, and create section redirects. All targets are absolute `https://leon-book.github.io/...` URLs.

The core implementation is:

```js
import {mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import {basename, dirname, join, resolve} from 'node:path';
import {HELD_ARTICLE_IDS, cleanArticlePath, legacyArticlePath, renderRedirect} from './url-policy.mjs';

const SECTIONS = ['', 'archives/', 'categories/', 'tags/', 'about/', 'ai/', 'arbitrage/', 'link/'];

async function writeRedirect(outputDir, path, target) {
  const file = join(outputDir, path || 'index.html');
  await mkdir(dirname(file), {recursive: true});
  await writeFile(file, renderRedirect(target));
}

export async function buildLegacyRedirects({manifestPath, outputDir, rootTarget}) {
  const output = resolve(outputDir);
  if (!basename(output).startsWith('leon-legacy-redirects')) throw new Error('Unsafe output directory');
  await rm(output, {recursive: true, force: true});
  await mkdir(output, {recursive: true});
  await writeFile(join(output, '.nojekyll'), '');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const posts = manifest.posts.filter(post => !HELD_ARTICLE_IDS.has(post.legacy_id));
  for (const post of posts) {
    await writeRedirect(output, legacyArticlePath(post.legacy_id), new URL(cleanArticlePath(post.legacy_id), rootTarget).href);
  }
  for (const section of SECTIONS) {
    await writeRedirect(output, section ? `${section}index.html` : 'index.html', new URL(section, rootTarget).href);
  }
  return {articles: posts.length, sections: SECTIONS.length};
}
```

- [ ] **Step 4: Run redirect and policy tests**

Run: `node --test tests/legacy-redirects.test.mjs tests/clean-urls.test.mjs`

Expected: all tests pass.

- [ ] **Step 5: Commit the redirect builder**

```bash
git add scripts/build-legacy-redirects.mjs tests/legacy-redirects.test.mjs package.json
git commit -m "feat(blog): generate legacy URL redirects"
```

### Task 5: Run the release gate

**Files:**
- No new product files.
- Generated artifacts: clean root build and redirect-only compatibility build in separate temporary directories.

**Interfaces:**
- Consumes: all prior tasks.
- Produces: two verified immutable deployment directories.

- [ ] **Step 1: Run source and migration checks**

```bash
npm test
node scripts/migrate-clean-urls.mjs --check
git diff --check
```

Expected: the clean-URL, extractor, redirect, NVDA, and build-contract tests pass. If the two known menu assertions still fail, report them by name and do not represent the full suite as green; the user's explicit release override applies only after all task-specific tests are green.

- [ ] **Step 2: Create the clean source export and root artifact**

```bash
release_root=$(mktemp -d /tmp/leon-root-source.XXXXXX)
git archive HEAD | tar -x -C "$release_root"
cd "$release_root"
npm ci
npm run build:leon-root
npm run test:root-built
```

Expected: the root artifact is under `$release_root/public` and contains `archives/884.html`.

- [ ] **Step 3: Add root-domain legacy redirect pages**

Run the redirect builder into a separate validated directory, then copy only `index.php/` from it into `$release_root/public/index.php/`. Confirm canonical content pages remain under `$release_root/public/archives/`.

- [ ] **Step 4: Create the old `/blog/` redirect-only artifact**

```bash
legacy_root=$(mktemp -d /tmp/leon-legacy-redirects.XXXXXX)
node scripts/build-legacy-redirects.mjs --output "$legacy_root"
```

Expected: the directory contains `.nojekyll`, `index.html`, section redirects, and `index.php/archives/884.html`, but no page or search entry for 237 or 704.

- [ ] **Step 5: Validate both artifacts**

Run exact checks for:

- no `href="/blog/` or `src="/blog/` in root HTML;
- no `/archives/237.html`, `/archives/704.html`, or search references;
- NVDA report class and 10 protected external links;
- every redirect target begins with `https://leon-book.github.io/` and contains neither duplicated `/blog/` nor canonical `/index.php/`.

### Task 6: Publish in dependency order and verify production

**Files:**
- Remote generated repository: `leon-book/leon-book.github.io`, branch `main`.
- Remote redirect repository: `leon-book/blog`, branch `main`.

**Interfaces:**
- Consumes: verified artifacts from Task 5.
- Produces: live root site plus backward-compatible old URLs.

- [ ] **Step 1: Confirm identity and remote heads**

```bash
gh auth status
gh api repos/leon-book/leon-book.github.io/commits/main --jq .sha
gh api repos/leon-book/blog/commits/main --jq .sha
```

Expected: active account is `leon-book`; record both SHAs for rollback.

- [ ] **Step 2: Publish the root site without rewriting history**

Clone `leon-book/leon-book.github.io` into a fresh `mktemp -d` directory, synchronize the verified root artifact into that checkout while preserving `.git`, inspect the diff, commit with `feat(site): publish clean root URLs`, and push normally to `main`. A rejected non-fast-forward push stops the release; never force-push.

- [ ] **Step 3: Wait for and verify root Pages**

```bash
gh run list --repo leon-book/leon-book.github.io --limit 1 --json databaseId,status,conclusion,headSha,url
root_run_id=$(gh run list --repo leon-book/leon-book.github.io --limit 1 --json databaseId --jq '.[0].databaseId')
gh run watch "$root_run_id" --repo leon-book/leon-book.github.io --exit-status
curl -fsSL https://leon-book.github.io/archives/884.html
```

Verify HTTP 200, `.nvda-report`, ten protected external links, clean canonical URL, and root-relative assets before changing the old site.

- [ ] **Step 4: Publish the redirect-only `/blog/` site**

Clone `leon-book/blog` into a second fresh temporary directory, synchronize only the verified compatibility artifact, inspect that all removed content is already live at the root site, commit with `feat(site): redirect legacy blog URLs`, and push normally to `main`.

- [ ] **Step 5: Wait for and verify old-link behavior**

```bash
gh run list --repo leon-book/blog --limit 1 --json databaseId,status,conclusion,headSha,url
legacy_run_id=$(gh run list --repo leon-book/blog --limit 1 --json databaseId --jq '.[0].databaseId')
gh run watch "$legacy_run_id" --repo leon-book/blog --exit-status
```

Use a browser to verify:

- `https://leon-book.github.io/` shows the blog homepage;
- `https://leon-book.github.io/archives/884.html` shows the styled report;
- `https://leon-book.github.io/index.php/archives/884.html` reaches the clean article;
- `https://leon-book.github.io/blog/` reaches the root homepage;
- `https://leon-book.github.io/blog/index.php/archives/884.html` reaches the clean article.

- [ ] **Step 6: Record completion and rollback points**

Report the source commit, both deployment commits, both Pages run URLs, canonical article URL, old-link verification, held-ID exclusion, and the two pre-release remote SHAs. Leave `_multiconfig.yml` and all `kary2999` resources untouched.
