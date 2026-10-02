# Leon Book GitHub Pages Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the existing blog at `https://leon-book.github.io/blog/` without changing or disabling the existing `kary2999` site.

**Architecture:** Keep the source repository unchanged except for a deployment-specific Hexo configuration overlay. Build from a clean Git export, push only generated static files to the new account's empty `blog` repository, and enable branch-based GitHub Pages. Store both GitHub CLI accounts locally and switch explicitly when operating on each account.

**Tech Stack:** GitHub CLI, Git, Hexo, npm, GitHub Pages

---

### Task 1: Add the new Pages configuration

**Files:**
- Create: `_config.leon-book-pages.yml`

- [ ] **Step 1: Add the deployment overlay**

```yaml
url: https://leon-book.github.io/blog
root: /blog/
```

- [ ] **Step 2: Verify the combined configuration**

Run: `npx hexo config url --config _config.yml,_config.leon-book-pages.yml && npx hexo config root --config _config.yml,_config.leon-book-pages.yml`

Expected: the two lines are `https://leon-book.github.io/blog` and `/blog/`.

- [ ] **Step 3: Commit the configuration**

```bash
git add _config.leon-book-pages.yml
git commit -m "chore(blog): add leon-book Pages config"
```

### Task 2: Add and verify the second GitHub account

**Files:** None

- [ ] **Step 1: Authenticate without removing the old account**

Run: `gh auth login --hostname github.com --git-protocol https --web`

Expected: browser authorization completes for `leon-book`.

- [ ] **Step 2: Confirm both accounts are stored**

Run: `gh auth status`

Expected: both `kary2999` and `leon-book` are listed.

- [ ] **Step 3: Select the new account and verify identity**

Run: `gh auth switch --hostname github.com --user leon-book && gh api user --jq .login`

Expected: `leon-book`.

### Task 3: Build and inspect the new static site

**Files:**
- Generate: temporary `public/` directory from a clean source export

- [ ] **Step 1: Export the tracked source into a temporary directory**

Run: `publish_dir=$(mktemp -d /tmp/leon-book-pages.XXXXXX) && git archive HEAD | tar -x -C "$publish_dir" && printf '%s\n' "$publish_dir"`

Expected: the source tree is present without local untracked files.

- [ ] **Step 2: Install dependencies and generate the site**

Run: `npm ci && npx hexo clean && npx hexo generate --config _config.yml,_config.leon-book-pages.yml`

Expected: Hexo exits successfully and creates `public/index.html`.

- [ ] **Step 3: Verify publication safety and paths**

Run checks that assert:

```text
public/index.php/archives/237.html is absent
public/index.php/archives/704.html is absent
search.xml contains neither excluded article
index.html references /blog/css/index.css
index.html references /blog/assets/profile/leon-avatar.png
no private-key PEM marker exists in generated output
```

Expected: every assertion passes.

### Task 4: Publish the generated site

**Files:**
- Create in generated output: `.nojekyll`

- [ ] **Step 1: Add `.nojekyll` and initialize the deployment repository**

Run from generated `public/`: `git init -b main && git add -A && git commit -m "deploy: publish Leon blog"`

Expected: a root commit containing the generated site.

- [ ] **Step 2: Push to the new repository**

Run: `git remote add origin https://github.com/leon-book/blog.git && git push -u origin main`

Expected: `main -> main` on `leon-book/blog`.

- [ ] **Step 3: Enable Pages from the branch root**

Run: `gh api --method POST repos/leon-book/blog/pages -F 'source[branch]=main' -F 'source[path]=/'`

Expected: the response contains `https://leon-book.github.io/blog/`.

### Task 5: Verify both accounts and both sites

**Files:** None

- [ ] **Step 1: Wait for the new Pages build**

Run: `gh api repos/leon-book/blog/pages/builds/latest --jq .status`

Expected: `built`.

- [ ] **Step 2: Verify the new site and avatar**

Run HTTP checks for the new homepage and avatar, then compare the published avatar SHA-256 with `/Users/karp/Downloads/leon.png`.

Expected: HTTP 200 for both and matching hashes.

- [ ] **Step 3: Verify the old site remains live**

Run: `curl -L -sS -o /dev/null -w '%{http_code}' https://kary2999.github.io/blog/`

Expected: `200`.

- [ ] **Step 4: Verify account switching in both directions**

Run `gh auth switch` and `gh api user --jq .login` once for each account.

Expected: each command reports the selected account; finish with `leon-book` active for the new repository.
