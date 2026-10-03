# Market Series Home Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give posts 884–887 coherent series covers and explicit homepage summaries so Butterfly never displays article CSS as excerpt text.

**Architecture:** Generate four static cover illustrations with one shared art direction, store them under `source/assets/market-series/`, and add `cover` plus `description` metadata to the four posts. Keep the 885–887 importer as the source of truth for their metadata, while post 884 receives the same fields directly. Built-output tests inspect the actual homepage cards and protect all existing detail-page behavior.

**Tech Stack:** Image generation, Node.js 24, Hexo 8.1.2, Butterfly 5.7.0, Cheerio 1.2.0, Node test runner.

**Spec:** `docs/superpowers/specs/2026-10-03-market-series-home-cards-design.md`

## Global Constraints

- Change only homepage-facing cover and summary metadata for posts 884–887.
- Preserve every detail-page body, table, formula, confidence colour, and external link.
- Keep generated covers local until the user approves the preview.
- Do not touch `_multiconfig.yml`, articles 237 or 704, GitHub remotes, or Pages deployment.

## Review Focus

- Homepage text must contain no CSS selectors, custom-property declarations, or `<style>` content.
- A future rerun of the market-report importer must preserve the three new posts' cover and description fields.
- Cover paths must use the configured `/blog/` root in local preview without hardcoding `/blog/` in frontmatter.
- The four cover files must share dimensions and remain legible when cropped by Butterfly.
- Detail-page regression tests must remain green after homepage metadata changes.

---

### Task 1: Generate the four-cover visual series

**Files:**
- Create: `source/assets/market-series/nvda.jpg`
- Create: `source/assets/market-series/commodities.jpg`
- Create: `source/assets/market-series/fx.jpg`
- Create: `source/assets/market-series/index.jpg`

**Interfaces:**
- Produces: four equal-dimension, text-light cover images consumed by post frontmatter.

- [ ] Generate a cohesive black, warm-gold, and ivory editorial-finance cover set with distinct subject symbols for NVIDIA, commodities, FX, and indices.
- [ ] Inspect all four images for unwanted text, logos, distorted objects, and weak crop composition.
- [ ] Normalize the files to the same web-ready dimensions and compressed JPEG format.

### Task 2: Protect homepage-card behavior with tests

**Files:**
- Modify: `tests/market-reports.test.mjs`
- Modify: `tests/nvda-report-built.test.mjs`

**Interfaces:**
- Consumes: generated homepage HTML and four cover paths.
- Produces: regression coverage for cover presence, natural-language summaries, and CSS exclusion.

- [ ] Add assertions that each homepage card links to the correct post, uses its assigned series cover, includes its literal summary, and contains none of `.market-report`, `.nvda-report`, `--bg:`, or `<style>`.
- [ ] Run the focused tests before metadata changes and verify they fail on the existing CSS excerpts.

### Task 3: Add stable cover and summary metadata

**Files:**
- Modify: `source/_posts/884.md`
- Modify: `migration/import-market-reports.mjs`
- Regenerate: `source/_posts/885.md`
- Regenerate: `source/_posts/886.md`
- Regenerate: `source/_posts/887.md`

**Interfaces:**
- Consumes: four cover files and fixed human-written summaries.
- Produces: `cover` and `description` frontmatter fields used by Butterfly homepage cards.

- [ ] Add a cover path and an 80–120-character factual summary to post 884.
- [ ] Extend the importer data map with literal cover paths and summaries for posts 885–887, then render both fields into frontmatter.
- [ ] Rerun the importer and verify the article bodies remain semantically unchanged.
- [ ] Build with `_config.yml,_config.leon-book-pages.yml` and run the focused homepage and detail-page tests.

### Task 4: Local visual verification

**Files:**
- Generated: `public/index.html`

**Interfaces:**
- Consumes: Task 3's local build.
- Produces: user-reviewable homepage at `http://localhost:4001/blog/`.

- [ ] Verify HTTP 200 for the homepage, all four cover assets, and all four article routes.
- [ ] Inspect the homepage at desktop width and a narrow viewport, checking crop, text readability, and absence of CSS excerpts.
- [ ] Commit source, tests, and images locally without pushing any remote.
