# Binance Market Reports Local Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Import the three new Binance market research HTML reports as locally previewable Leon blog posts 885–887 without publishing them to GitHub.

**Architecture:** A deterministic Node importer reads the three trusted local HTML files, extracts each report's `<main>` content, removes the duplicate `<h1>`, applies an article-scoped visual system matching post 884, preserves external links, and writes Hexo posts with explicit metadata. Built-output tests verify content, styles, links, snapshot-safe dates, and homepage discovery.

**Tech Stack:** Node.js 24, Hexo 8.1.2, Butterfly 5.7.0, Cheerio 1.2.0, Node test runner.

**Spec:** `docs/superpowers/specs/2026-10-03-binance-market-reports-preview-design.md`

## Global Constraints

- Import only `binance-commodities-report.html`, `binance-fx-report.html`, and `binance-index-report.html` from `/Users/karp/Code/Claude/lab/`.
- Preserve report facts, tables, formulas, confidence labels, text colours, and external URLs.
- Use article IDs 885, 886, and 887 and the existing `index.php/archives/:legacy_id.html` route.
- Dates must be later than `2026-10-03 00:10:00` Asia/Tokyo and mutually staggered.
- Do not touch `_multiconfig.yml`, articles 237 or 704, GitHub repositories, or Pages deployment.

## Review Focus

- An external link with query parameters or fragments must remain byte-for-byte equivalent apart from safe `target` and `rel` attributes.
- CSS selectors from the standalone documents must not style Butterfly outside the report container.
- The report `<h1>` must be removed because Butterfly already renders the post title.
- Tables must remain scrollable on narrow screens, and the confidence colours must remain distinguishable in both themes.
- The source snapshot timestamp and the assigned publication timestamp must not be confused.

---

### Task 1: Deterministic report importer

**Files:**
- Create: `scripts/import-market-reports.mjs`
- Create: `tests/market-reports.test.mjs`
- Create: `source/_posts/885.md`
- Create: `source/_posts/886.md`
- Create: `source/_posts/887.md`

**Interfaces:**
- Consumes: three absolute HTML input paths under `/Users/karp/Code/Claude/lab/`.
- Produces: `importMarketReports({sourceDir, postsDir})` returning `{written: [885, 886, 887]}` and three self-contained Hexo posts.

- [ ] **Step 1: Write failing source-import tests**

Create tests that call `importMarketReports` in a temporary posts directory and assert the exact title/ID mapping, dates `00:30`, `08:30`, and `16:30` JST, removal of `<h1>`, presence of `.market-report`, `.card.tldr`, `.warnbox`, every source table, all four confidence labels, and the same external-link href set as each source HTML.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/market-reports.test.mjs`

Expected: FAIL because `scripts/import-market-reports.mjs` does not exist.

- [ ] **Step 3: Implement the minimal importer**

Use Cheerio to extract `<main>`, remove its direct `<h1>`, add `target="_blank" rel="noopener noreferrer"` only to `http` links, wrap content in `<div class="market-report">`, prepend article-scoped light/dark CSS based on post 884, and write frontmatter with `disableNunjucks: true` and `comments: false`.

- [ ] **Step 4: Generate posts and verify GREEN**

Run:

```bash
node scripts/import-market-reports.mjs
node --test tests/market-reports.test.mjs
```

Expected: three posts written; all focused tests pass.

- [ ] **Step 5: Commit locally**

```bash
git add scripts/import-market-reports.mjs tests/market-reports.test.mjs source/_posts/885.md source/_posts/886.md source/_posts/887.md
git commit -m "feat(blog): import Binance market research series"
```

### Task 2: Build and local-browser verification

**Files:**
- Modify: `tests/market-reports.test.mjs`
- Generated: `public/index.php/archives/885.html`
- Generated: `public/index.php/archives/886.html`
- Generated: `public/index.php/archives/887.html`

**Interfaces:**
- Consumes: posts from Task 1 and the existing local `/blog/` production overlay.
- Produces: locally served pages discoverable from `http://localhost:4001/blog/`.

- [ ] **Step 1: Add failing built-output assertions**

Assert each generated page contains one `.market-report`, no report-owned `<h1>`, the source table count, preserved external links with safe attributes, all confidence labels, and no unscoped report CSS. Assert the homepage links to all three legacy article paths.

- [ ] **Step 2: Verify RED before rebuilding**

Run: `node --test tests/market-reports.test.mjs`

Expected: FAIL because the three generated pages do not yet exist.

- [ ] **Step 3: Build the local `/blog/` preview**

Run: `npx hexo clean && npx hexo generate --config _config.yml,_config.leon-book-pages.yml`

Expected: the three pages and homepage entries are generated.

- [ ] **Step 4: Verify focused output and existing report regression**

Run: `node --test tests/market-reports.test.mjs tests/nvda-report-built.test.mjs`

Expected: all focused and NVDA tests pass.

- [ ] **Step 5: Verify local HTTP routes**

Run HTTP checks against `http://localhost:4001/blog/` and all three article URLs, expecting status 200 and their distinct titles.

- [ ] **Step 6: Commit the built-output test locally**

```bash
git add tests/market-reports.test.mjs
git commit -m "test(blog): verify market report previews"
```

No GitHub push or Pages deployment occurs in this plan.
