# Dictionary Proofreading Implementation Plan

> **For agentic workers:** Use the parallel review assignments below; the main agent integrates corrections and runs verification. No publication or commit is requested.

**Goal:** Proofread the full visible dictionary, correct unsupported or misleading terminology and calculations, and record evidence without promising an impossible guarantee of permanent correctness.

**Architecture:** Read the final `inventory()` output rather than trusting raw source rows or intermediate overwritten editorial objects. Review 180 beginner entries, 200 professional entries, and 33 curated articles/20 calculator models independently. The main agent checks source-field promotion, citations and rendered output, integrates specific evidence-backed corrections, and preserves original source data and article IDs.

**Tech Stack:** Chinese editorial JavaScript registries, Node tests, Hexo, Binance/OKX official documentation, browser-rendered verification.

---

## Tasks and ownership

- [x] Read-only trading review: all 180 entries in `beginner-trading.js`; findings in `docs/校稿-交易文案核对.md`.
- [x] Read-only field review: all 200 entries in `beginner-fields.js`; findings in `docs/校稿-专业字段核对.md`.
- [x] Read-only curated/model review: final 33 entries in `editorial.js` and 20 models in `calculators.js`; findings in `docs/校稿-公式与精编核对.md`.
- [x] Main: inspect all promoted field mappings and supplement sources; do not present unverifiable project names or historical API enums as confirmed current product rules.
- [x] Main: add regression assertions for verified substantive errors before editing the relevant source; observe failures, apply precise replacement copy and confirm pass.
- [x] Main: re-read integrated definitions, examples, formulas and caveats. Check arithmetic, quantity/price/currency units, time windows, positive/negative payment conventions, legal product distinctions, and certainty wording.
- [x] Main: run `npm test`, then `npm run build:tago` sequentially; require exit 0. Run `git diff --check`.
- [x] Main: browser-check corrected high-risk entries, search/navigation, calculator edge cases and source disclosures; save screenshot, record scope and any unverified sources in `docs/交易术语字典-校稿结果.md`.
- [x] Leave all work local, preserve existing user changes, do not push or deploy.

## Closure evidence

2026-11-04: 132 tests passed, build generated 2,007 files. Browser opened all 413 default catalogue entries: no missing definition/example/source-or-disclosure and no blank formula labels. The original animations were preserved. Screenshot: `/tmp/tago-dictionary-proofreading.png`.

Two project-specific mechanisms remain unverified, not completed as facts: position swap and risk score. The supplied dictionary only names them; public exchange documents do not establish the project's implementation. Their visible warnings and the evidence needed to resolve them are recorded in the final report. This is an evidence boundary, not a claim that the private rules have been checked.

## Acceptance boundaries

Official sources establish only their named platform, product, region, account mode and documented date/version. Numerical teaching examples are explicitly hypothetical. Mathematical consistency alone cannot verify current platform rules. A linked official homepage is not evidence for a specific assertion. Unverified claims must be corrected, removed, or clearly bounded—not declared verified by automated word-count tests.
