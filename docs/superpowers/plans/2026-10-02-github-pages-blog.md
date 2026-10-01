# GitHub Pages Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the existing Hexo blog at `https://kary2999.github.io/blog/` without exposing locally held private-key tutorial posts.

**Architecture:** Add a production configuration override in the source repository, then build from a clean clone. Copy only generated output into a dedicated public `blog` repository and enable GitHub Pages from `main:/`.

**Tech Stack:** Hexo 8, Git, GitHub CLI, GitHub Pages

---

### Task 1: Add production URL configuration

**Files:**
- Create: `_config.github-pages.yml`

- [ ] Add the GitHub Pages URL and `/blog/` root override.
- [ ] Commit and push the source configuration.

### Task 2: Produce a safe clean build

**Files:**
- Generated: `public/`

- [ ] Clone the published source branch into a temporary directory.
- [ ] Install locked dependencies and build with both config files.
- [ ] Verify `/blog/` asset paths and absence of posts 237 and 704.

### Task 3: Publish and verify GitHub Pages

**Files:**
- Generated repository contents from `public/`
- Create: `.nojekyll`

- [ ] Create the public `kary2999/blog` repository.
- [ ] Push generated output to `main`.
- [ ] Enable Pages from `main:/` through the GitHub API.
- [ ] Poll the deployment until GitHub reports `built` and confirm the public URL returns HTTP 200.

