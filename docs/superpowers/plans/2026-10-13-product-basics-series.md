# Product Basics Beginner Series Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish four evidence-based beginner notes that turn the supplied product-course text and screenshots into a readable learning series.

**Architecture:** Keep each learning stage in one Hexo Markdown post, reuse the existing `产品` category, and copy only the screenshots that clarify a concept into one dedicated asset folder. Let the repository's route allocator assign stable random URLs, then verify the generated site locally and publish only through the guarded Leon Pages command.

**Tech Stack:** Hexo 8, Butterfly 5.7, Markdown, repository route/test/build/publish scripts.

---

### Task 1: Prepare traceable image assets

**Files:**
- Create: `source/assets/product-basics/kano-model.png`
- Create: `source/assets/product-basics/kano-priority.png`
- Create: `source/assets/product-basics/maslow-hierarchy.png`
- Create: `source/assets/product-basics/seven-deadly-sins.png`
- Create: `source/assets/product-basics/priority-quadrant.png`
- Create: `source/assets/product-basics/fitts-formula.png`
- Create: `source/assets/product-basics/fitts-mobile-targets.png`
- Create: `source/assets/product-basics/hick-choice-curve.png`
- Create: `source/assets/product-basics/hick-choice-list.png`
- Create: `source/assets/product-basics/occams-razor.png`
- Create: `source/assets/product-basics/teslers-law.png`
- Create: `source/assets/product-basics/magical-number-seven.png`
- Create: `source/assets/product-basics/proximity-law.png`
- Create: `source/assets/product-basics/error-prevention.png`
- Create: `source/assets/product-basics/rudder-navigation.png`
- Create: `source/assets/product-basics/drawer-navigation.png`
- Create: `source/assets/product-basics/immersive-navigation.png`

- [ ] **Step 1: Copy the selected source screenshots without modifying the originals**

Create `source/assets/product-basics/`, then copy the supplied files using this exact mapping:

```text
BDD59ED5-8562-445D-BE27-82DEB4BAB2DF.png -> kano-model.png
F0B40B8F-6434-47E0-BC5B-1B6FFC567548.png -> kano-priority.png
A6DBF377-CE8B-48D1-B084-5818BEFC4C3E.png -> maslow-hierarchy.png
D0E8824C-5AE2-45BA-9BD0-3BAD4A6CB2DD.png -> seven-deadly-sins.png
23356176-2176-405E-8C24-94A013662F48.png -> priority-quadrant.png
1B92ADB3-8199-4229-A4AE-DA845FBA2C0D.png -> fitts-formula.png
25DC24A6-7182-40D0-B775-AD2477294048.png -> fitts-mobile-targets.png
BD121A20-F7E4-4F84-A42A-DAC5B40D0E2D.png -> hick-choice-curve.png
C3193B58-F834-40B3-AF44-4F0EBA1EF7B0.png -> hick-choice-list.png
C3551619-E2C3-41EA-8333-252DB2EFB3AD.png -> occams-razor.png
9FAE6294-DA3A-4840-ADEB-BB53164A036C.png -> teslers-law.png
A5441480-16C0-41CC-AB6B-222239003EBF.png -> magical-number-seven.png
20CFD1E4-4D27-41CD-B387-007BE9826C14.png -> proximity-law.png
2400ABC0-7249-4A17-B90D-7B8234AA9518.png -> error-prevention.png
B45154D2-51B6-4ED1-9E9B-12168D55A8DB.png -> rudder-navigation.png
D4EE5491-DF1C-4303-8C17-173FB14D490B.png -> drawer-navigation.png
A87115C8-6E92-41A7-B98E-04106F6C1B7B.png -> immersive-navigation.png
```

- [ ] **Step 2: Review every selected image for secrets and privacy**

Inspect the full-resolution files for access keys, account identifiers, private addresses, QR codes, phone numbers, or internal hostnames. Exclude any unsafe image rather than editing around a secret.

- [ ] **Step 3: Confirm asset count and file integrity**

Run: `find source/assets/product-basics -type f -name '*.png' | wc -l`
Expected: `17`

### Task 2: Write the four beginner-note posts

**Files:**
- Create: `source/_posts/891.md`
- Create: `source/_posts/892.md`
- Create: `source/_posts/893.md`
- Create: `source/_posts/894.md`

- [ ] **Step 1: Write post 891, “产品新人笔记（一）：如何理解用户需求”**

Cover Kano's five demand types, Maslow as a motivation lens, and the ethical boundary of using the seven deadly sins. Use the structure “白话解释—例子—怎么用—常见误区”; label all examples as explanatory examples rather than measured production results.

- [ ] **Step 2: Write post 892, “产品新人笔记（二）：如何分析产品并确定优先级”**

Cover SWOT, the five planes of user experience, and the important/urgent quadrant. Explain that these tools organize thinking but do not replace evidence, value, effort, dependency, and risk analysis.

- [ ] **Step 3: Write post 893, “产品新人笔记（三）：产品设计常用的七条基础定律”**

Cover Fitts, Hick, Occam, Tesler, 7±2, proximity, and error prevention. Correct the source-note typo “席客” to “席克” and avoid presenting the older 7±2 claim as a universal interface limit.

- [ ] **Step 4: Write post 894, “产品新人笔记（四）：导航系统怎么设计”**

Cover rudder, drawer, and immersive navigation plus status/navigation/tab/tool/search/scope bars. Explain task fit, frequency, discoverability, and mixed navigation without treating visual novelty as a goal.

- [ ] **Step 5: Check article metadata and evidence boundaries**

Each file must use date `2026-10-13`, category `产品`, relevant tags, `disableNunjucks: true`, and `comments: false`. Do not claim production data, measurable revenue, user-growth results, or personal implementation work absent from the source.

### Task 3: Allocate routes and verify source structure

**Files:**
- Modify: `source/_posts/891.md`
- Modify: `source/_posts/892.md`
- Modify: `source/_posts/893.md`
- Modify: `source/_posts/894.md`
- Modify: `article-routes.json`

- [ ] **Step 1: Allocate stable article URLs**

Run: `npm run routes:prepare`
Expected: four new fixed `archives/<8 hex chars>.html` entries, with existing route values unchanged.

- [ ] **Step 2: Check Markdown asset references**

Run: `grep -Rho '/assets/product-basics/[a-z0-9-]*\.png' source/_posts/89{1,2,3,4}.md | sort -u`
Expected: every referenced path resolves to a file under `source/assets/product-basics/`.

- [ ] **Step 3: Confirm restricted posts remain excluded**

Run: `grep -n '^published: false' source/_posts/237.md source/_posts/704.md`
Expected: both files report `published: false`.

### Task 4: Test, build, and inspect the local site

**Files:**
- Generated only: `public/`

- [ ] **Step 1: Run the complete test suite**

Run: `npm test`
Expected: all Node tests pass.

- [ ] **Step 2: Build for the Leon root domain**

Run: `npm run build:leon-root`
Expected: Hexo generation completes with no error.

- [ ] **Step 3: Verify route safety**

Run: `node tools/verify-article-routes.mjs`
Expected: route verification passes and old numeric article pages are absent.

- [ ] **Step 4: Start the preview server**

Run: `npm run server -- --port 4000`
Expected: Hexo listens on `http://localhost:4000/`.

- [ ] **Step 5: Inspect all four rendered pages**

Open each allocated route and verify title, category, headings, image loading, mobile-width layout, and next/previous navigation. Confirm `/index.php/archives/237.html` and `/index.php/archives/704.html` are not served.

### Task 5: Review, commit, and publish

**Files:**
- Review all files changed by Tasks 1–4.

- [ ] **Step 1: Review the source diff and working tree**

Run: `git diff --check && git diff --stat && git status --short`
Expected: no whitespace errors and only task-related files are present.

- [ ] **Step 2: Commit the reviewed source**

Run: `git add source/_posts/891.md source/_posts/892.md source/_posts/893.md source/_posts/894.md source/assets/product-basics article-routes.json docs/superpowers/plans/2026-10-13-product-basics-series.md && git commit -m "feat: publish product basics beginner series"`
Expected: one source commit containing only the series and its route/assets/plan files.

- [ ] **Step 3: Confirm the source tree is clean**

Run: `git status --porcelain`
Expected: no output.

- [ ] **Step 4: Publish through the guarded command**

Run: `npm run publish:leon -- --confirm leon-book.github.io`
Expected: the tool verifies account `leon-book`, target `leon-book/leon-book.github.io`, tests, build, restricted-post exclusion, and pushes the Pages commit.

- [ ] **Step 5: Verify deployment and public pages**

Check the GitHub Pages deployment state and request each `https://leon-book.github.io/archives/<id>.html` URL until it returns the new article content. Record the source commit, Pages commit, test result, deployment result, and four public links.
