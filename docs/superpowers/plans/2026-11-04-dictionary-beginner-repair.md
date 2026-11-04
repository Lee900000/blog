# Dictionary beginner readability repair

**Goal:** Every visible concept has a real plain-Chinese definition, a concrete example and relevant caveats; quantitative concepts gain a compact, scoped live calculator.

**Approved design:** Keep template 02 navigation and blog theme. The user confirmed numeric inputs, immediate results and Chinese substitution steps for calculable concepts; non-calculable concepts use examples, not artificial calculators. Keep existing native animations.

**Root cause:** The reader promotes any qualifying source note into a definition. On 2026-11-04 the 413-entry browser audit found 160 exact title repeats, 266 definitions under 25 characters, 1 scope-only definition, 380 without a separately labelled example, and 375 with only documentation indexes. These are screening indicators, not proof of conceptual completeness.

## File ownership and work

- Editorial A: `beginner-trading.js`, its focused test; noncurated native entries and professional entry IDs below 157.
- Editorial B: `beginner-fields.js`, its focused test; noncurated professional entry IDs 157 and above.
- Calculator component: `calculators.js`, `calculators.css`, calculator tests; no reader or editorial edits.
- Integration: `directory-reader.js`, existing stylesheet, post script includes, inventory helper, integration tests and audit report. Only the main agent changes these files.

## Verification gates

- [ ] Reproduce scope-only `pro-record-552` and audit the whole current directory.
- [ ] Write failing tests for learner copy and calculator validation before corresponding production code.
- [ ] Supply each owned entry with definition, example, caution and precise reference or explicit reference status; never fill with generic repeated paragraphs or undocumented platform thresholds.
- [ ] Integrate beginner copy without replacing stronger existing curated articles or losing source IDs/animation listeners.
- [ ] Use explicit numerical calculator models; Chinese labels and units, nonfinite/empty/zero validation, reset, accessible result updates, no external API.
- [ ] Run all tests, then build (not in parallel, because route tests read public files).
- [ ] Recheck every rendered entry for definition/example coverage and exact duplication; inspect screenshot and exercise calculator inputs, validation and cross-entry navigation.
- [ ] Leave changes local; no commit, publication or deployment requested.
