# Arbitrage Standalone Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sync the latest quantitative-finance pages and make every arbitrage article render as a Leon Blog single-column detail page without the right sidebar.

**Architecture:** Keep the collection index as the left-navigation shell. Give all article HTML files one shared stylesheet and one small shell script that renders the blog navigation for direct visits and suppresses it inside the collection iframe.

**Tech Stack:** Static HTML/CSS/JavaScript, Hexo 8, Butterfly-compatible design tokens, Node test runner.

---

### Task 1: Lock the standalone-page contract with tests

**Files:**
- Modify: `tests/arbitrage.test.mjs`

- [ ] Assert that the index contains ten calculators plus the checklist.
- [ ] Assert that all calculator pages load `assets/common.css` and `assets/theme-shell.js`.
- [ ] Assert that the shared shell contains the Leon navigation links, embedded-mode handling, and no sidebar widgets.
- [ ] Run `node --test tests/arbitrage.test.mjs` and confirm the new assertions fail for the missing tenth page and shell.

### Task 2: Sync the current source material

**Files:**
- Modify: `source/arbitrage/01-资金费率套利.html`
- Modify: `source/arbitrage/02-期现套利.html`
- Modify: `source/arbitrage/03-日历价差套利.html`
- Modify: `source/arbitrage/08-闪电贷套利.html`
- Modify: `source/arbitrage/index.html`
- Create: `source/arbitrage/10-期权套利.html`

- [ ] Copy the changed source content without modifying the original source directory.
- [ ] Reapply the blog-specific index link, ten-strategy label, and bounded mobile navigation.
- [ ] Verify every `data-src` resolves to a local file.

### Task 3: Implement the shared Leon Blog article shell

**Files:**
- Modify: `source/arbitrage/assets/common.css`
- Create: `source/arbitrage/assets/theme-shell.js`
- Modify: `source/arbitrage/01-资金费率套利.html`
- Modify: `source/arbitrage/02-期现套利.html`
- Modify: `source/arbitrage/03-日历价差套利.html`
- Modify: `source/arbitrage/04-跨交易所套利.html`
- Modify: `source/arbitrage/05-三角套利.html`
- Modify: `source/arbitrage/06-跨所资金费率套利.html`
- Modify: `source/arbitrage/07-统计套利.html`
- Modify: `source/arbitrage/08-闪电贷套利.html`
- Modify: `source/arbitrage/09-稳定币脱锚套利.html`
- Modify: `source/arbitrage/10-期权套利.html`

- [ ] Add the shared script reference before every calculator page's existing inline script.
- [ ] Render the exact blog menu links from `_config.butterfly.yml` for direct article visits.
- [ ] Apply the Butterfly background asset and a single opaque content card without any right sidebar.
- [ ] Hide the duplicate nav/background shell when the page is rendered inside the collection iframe.
- [ ] Run `node --test tests/arbitrage.test.mjs` and confirm it passes.

### Task 4: Full verification and visual review

**Files:**
- Verify: `source/arbitrage/**`
- Verify: `public/arbitrage/**`

- [ ] Run `npm test` and require zero failures.
- [ ] Run `npm run build:leon-root` and require exit code 0.
- [ ] Start `npm run server -- --port 4000`.
- [ ] Inspect `/arbitrage/01-资金费率套利.html` on desktop and mobile widths.
- [ ] Inspect `/arbitrage/` to confirm its left navigation remains and the embedded article has no duplicate top navigation.
- [ ] Review `git diff` and confirm articles `237` and `704` are absent from the public build.
