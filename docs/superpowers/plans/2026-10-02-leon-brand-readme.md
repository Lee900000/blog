# Leon Brand README Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish Leon-branded README and site identity to `leon-book/blog`, then disable only the GitHub Pages configuration of `kary2999/blog`.

**Architecture:** Source-controlled identity and README files live in the Hexo source repository. A clean archive build produces the public site so ignored local articles cannot leak; the generated tree is then pushed to the existing `leon-book/blog` repository. GitHub's Pages API disables the legacy site without deleting its repository.

**Tech Stack:** Hexo 8, Butterfly 5.7, Node.js test runner, Git, GitHub CLI/API, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-10-02-leon-brand-readme-design.md`

## Global Constraints

- Preserve the `kary2999/blog` repository, branches, files, and commit history.
- Do not rewrite historical article references, old domains, code samples, or repositories that still belong to `kary2999`.
- Never publish articles 237 or 704, including search-index content.
- Leave the user-owned untracked `_multiconfig.yml` untouched.
- Finish with GitHub CLI account `leon-book` active.

## Review Focus

- A clean build must copy the visitor README to `public/README.md` without rendering it as HTML.
- Current public identity must use exact casing `Leon`; historical content must remain unchanged.
- The published artifact must contain neither article 237 nor article 704 nor their search entries.
- Disabling the old Pages site must not delete or rewrite the old repository.
- New-site navigation and assets must retain the `/blog/` base path.

---

### Task 1: Source-managed Leon branding and README files

**Files:**
- Modify: `README.md`
- Modify: `_config.yml`
- Modify: `source/about/index.md`
- Create: `source/README.md`
- Modify: `tests/features.test.mjs`

**Interfaces:**
- Consumes: Hexo `skip_render` and source-copy behavior.
- Produces: exact `Leon` site identity, new account link, and a copied `public/README.md` for Task 2.

- [ ] **Step 1: Add failing source-contract assertions**

Add assertions to `tests/features.test.mjs` that require `title: Leon`, `author: Leon`, `skip_render` to include `README.md`, the about page to link to `https://github.com/leon-book`, and `source/README.md` to identify `Leon Blog` and `https://leon-book.github.io/blog/`.

- [ ] **Step 2: Run the focused test and observe failure**

Run: `node --test tests/features.test.mjs`

Expected: FAIL because the branding is lowercase, the old account link remains, and the deployment README does not exist.

- [ ] **Step 3: Implement the source changes**

Change the root README heading to `Leon Blog` and add the live site and publishing owner near its introduction while retaining all existing technical documentation. Set `_config.yml` title and author to `Leon`, add `README.md` to `skip_render`, update only current identity text and the personal GitHub link in the about page, and add a concise Chinese visitor README at `source/README.md`.

- [ ] **Step 4: Run source checks**

Run: `node --test tests/features.test.mjs && git diff --check`

Expected: PASS and no whitespace errors.

- [ ] **Step 5: Commit**

```bash
git add README.md _config.yml source/about/index.md source/README.md tests/features.test.mjs
git commit -m "docs(blog): publish Leon brand and repository guide"
```

### Task 2: Build and validate a clean publication artifact

**Files:**
- Generated in clean temporary archive: `public/**`

**Interfaces:**
- Consumes: committed Task 1 files plus `_config.leon-book-pages.yml`.
- Produces: verified `public/` tree ready to push to `leon-book/blog`.

- [ ] **Step 1: Create a clean source archive**

Run: `publish_dir=$(mktemp -d /tmp/leon-brand-pages.XXXXXX) && git archive HEAD | tar -x -C "$publish_dir" && printf '%s\n' "$publish_dir"`

Expected: a new temporary directory containing tracked files only.

- [ ] **Step 2: Install and build**

Run inside the clean directory: `npm ci && npx hexo clean && npx hexo generate --config _config.yml,_config.leon-book-pages.yml`

Expected: exit 0 with generated `public/`.

- [ ] **Step 3: Validate the artifact**

Run checks that `public/README.md` contains `# Leon Blog` and the live URL, `public/index.html` contains Leon branding and `/blog/` assets, neither sensitive article path exists, and `public/search.xml` contains neither `/237.html` nor `/704.html`.

Expected: every assertion exits 0.

### Task 3: Publish to the new repository

**Files:**
- Update external repository: `leon-book/blog` branch `main`

**Interfaces:**
- Consumes: Task 2 verified public tree.
- Produces: new Git commit and GitHub Pages deployment on `leon-book/blog`.

- [ ] **Step 1: Verify account and remote target**

Run: `gh auth switch --hostname github.com --user leon-book && gh api user --jq .login`

Expected: `leon-book`.

- [ ] **Step 2: Commit generated changes**

Synchronize the verified public tree into the existing generated-site checkout, preserving its `.git`, then run `git status`, `git diff --check`, `git add -A`, and commit with message `docs: publish Leon brand and README`.

Expected: only generated-site branding/README changes and no sensitive article paths.

- [ ] **Step 3: Push the new commit**

Run the push using the known working GitHub IPv4 resolve override only if ordinary network resolution fails.

Expected: `main` updates on `leon-book/blog`.

- [ ] **Step 4: Verify Pages deployment and public URLs**

Run GitHub API build-status checks plus HTTP checks for the homepage, README/avatar asset, and sensitive article 404s.

Expected: build status `built`, homepage/README/avatar return 200, articles 237 and 704 return 404.

### Task 4: Disable only the legacy Pages site

**Files:**
- External configuration only: `kary2999/blog` Pages settings

**Interfaces:**
- Consumes: explicit user authorization to disable old Pages while preserving the repository.
- Produces: no Pages configuration for `kary2999/blog`, with `leon-book` restored as the active CLI account.

- [ ] **Step 1: Capture non-destructive evidence of the old repository**

Run after switching to `kary2999`: query repository identity/default branch and current Pages configuration.

Expected: repository exists and Pages configuration is present before deletion.

- [ ] **Step 2: Disable Pages**

Run: `gh api --method DELETE repos/kary2999/blog/pages`

Expected: HTTP success with the repository untouched.

- [ ] **Step 3: Verify shutdown and repository preservation**

Run: query `repos/kary2999/blog/pages` expecting HTTP 404, then query `repos/kary2999/blog` expecting its repository identity and default branch.

Expected: Pages 404; repository query succeeds.

- [ ] **Step 4: Restore the new account and run final checks**

Run: switch back to `leon-book`, verify active login, confirm the new Pages build/site again, and run source `npm test` plus `git status --short --branch`.

Expected: `leon-book` active, new site healthy, tests pass, and only the pre-existing untracked `_multiconfig.yml` remains.
