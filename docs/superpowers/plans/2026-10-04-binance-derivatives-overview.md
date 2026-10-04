# Binance Derivatives Overview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the final Binance derivatives and TradFi aggregate report as local-preview-only Leon blog article 888.

**Architecture:** Convert the standalone `report.html` document into one Hexo post whose CSS is scoped beneath `.market-report`, while preserving its report body and external links. Add a dedicated content regression test that verifies metadata, key sections, link preservation, series navigation, and generated output.

**Tech Stack:** Hexo 8, Markdown with embedded HTML/CSS, Node.js built-in test runner, Cheerio.

**Spec:** `docs/superpowers/specs/2026-10-04-binance-derivatives-overview-design.md`

## Global Constraints

- Create only article 888 and its dedicated cover/test/plan artifacts; do not edit 884–887.
- The publication timestamp must be no earlier than `2026-10-03 20:44:39`.
- Preserve report facts, tables, confidence markers, and external source links.
- Scope all imported visual rules to the article container.
- Build and preview locally only; do not commit or push GitHub.
- Leave the existing untracked `_multiconfig.yml` untouched.

## Review Focus

- Standalone `body`, `main`, and `:root` rules must not leak into the Butterfly theme.
- The homepage must use front-matter `description` rather than inline CSS as its excerpt.
- External source URLs and key data tables must survive conversion.
- The long report must remain readable on mobile, especially wide tables.
- Existing market reports 884–887 must remain byte-for-byte unchanged.

---

### Task 1: Pin article 888 content contract

**Files:**
- Create: `tests/binance-overview.test.mjs`
- Create: `source/_posts/888.md`
- Create: `source/assets/market-series/binance-overview.svg`

**Interfaces:**
- Consumes: `/Users/karp/Code/Claude/lab/binance-report/report.html` as read-only final report input.
- Produces: Hexo post route `/index.php/archives/888.html` and cover `/assets/market-series/binance-overview.svg`.

- [ ] **Step 1: Write the failing source-content test**

Create a Node test that reads `source/_posts/888.md` and asserts the exact title, legacy ID, permalink, non-early date, cover, description, scoped `.market-report` wrapper, key section headings, all 18 external source links, links to archives 884–887, and absence of unscoped `body{`, `main{`, and `:root{` selectors.

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/binance-overview.test.mjs`

Expected: FAIL because `source/_posts/888.md` does not exist.

- [ ] **Step 3: Convert the report into the Hexo post**

Create front matter with title `币安衍生品与 TradFi 业务全景`, `legacy_id: 888`, `permalink: index.php/archives/888.html`, timestamp after the report snapshot, a plain-language `description`/`postDesc`, category `金融科技`, relevant Binance/TradFi tags, `disableNunjucks: true`, and `comments: false`. Copy the final report body, scope its stylesheet to `.market-report`, remove standalone document elements, and append links to 884–887.

- [ ] **Step 4: Add the dedicated SVG cover**

Create a restrained 16:9 Leon market-series cover with the labels `BINANCE`, `DERIVATIVES`, and `TRADFI`, using the existing dark-blue/gold market-series palette and no remote assets.

- [ ] **Step 5: Run the source-content test to verify it passes**

Run: `node --test tests/binance-overview.test.mjs`

Expected: PASS.

### Task 2: Verify generated page and local preview

**Files:**
- Modify: `tests/binance-overview.test.mjs`
- Generated: `public/index.php/archives/888.html`
- Generated: `public/index.html`

**Interfaces:**
- Consumes: article and cover produced by Task 1.
- Produces: validated local HTML suitable for review at port 4001.

- [ ] **Step 1: Add the failing generated-output test**

Extend the test to assert that the generated article contains the report title, key conclusion section, tables, source links, and archive links 884–887, and that the generated homepage contains the cover and plain summary without report CSS appearing as card text.

- [ ] **Step 2: Run it before build to verify the generated-output check fails**

Run: `node --test tests/binance-overview.test.mjs`

Expected: FAIL because the 888 generated page does not yet exist.

- [ ] **Step 3: Generate the local `/blog/` preview**

Run: `npx hexo clean && npx hexo generate --config _config.yml,_multiconfig.yml`

Expected: Hexo generates `public/index.php/archives/888.html` and the updated homepage.

- [ ] **Step 4: Run focused and full regression tests**

Run: `node --test tests/binance-overview.test.mjs tests/market-reports.test.mjs tests/market-home-cards.test.mjs`

Then run: `npm test`

Expected: focused tests PASS. Any pre-existing full-suite failures must be reported by test name and must not be hidden.

- [ ] **Step 5: Start or refresh local preview and inspect visually**

Run the Hexo server on port 4001 with the local `/blog/` configuration, inspect `/blog/` and `/blog/index.php/archives/888.html`, and confirm desktop/mobile readability, intact colors, working external links, and a clean homepage excerpt.

- [ ] **Step 6: Hand off without publishing**

Provide the local article and homepage URLs plus verification results. Do not run `git commit` or `git push`.
