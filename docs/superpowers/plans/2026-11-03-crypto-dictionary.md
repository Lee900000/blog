# Crypto dictionary expansion

**Goal:** Preserve the supplied dictionary's 48 tables, 610 records and surrounding explanations, make each record searchable, and group glossary/arbitrage navigation.

**Architecture:** Generate a static, scoped professional dictionary section inside the existing post. Each table row becomes a searchable H3 record with labeled fields; retain source caveats and formulas. Keep the compact beginner index unchanged. Native details navigation groups the two links on standalone arbitrage pages; Butterfly uses its nested menu configuration.

- [x] Add regression tests for menu grouping, record counts, caveats and source-field preservation; confirm failures.
- [x] Import sanitized source content without scripts, source UI or external tracking; prefix IDs and internal links.
- [x] Update Butterfly and standalone arbitrage menus, including mobile dropdown styling.
- [x] Run tests, build and desktop browser checks for search, modal placement and both menus. 71 tests pass; 46 step animations and 10 inline animations remain. No publication or commits. Mobile styling added but not browser-verified.
