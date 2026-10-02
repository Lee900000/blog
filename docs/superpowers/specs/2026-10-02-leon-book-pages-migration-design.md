# Leon Book GitHub Pages Migration Design

## Goal

Publish the existing static blog to `https://leon-book.github.io/blog/` while keeping the current `kary2999/blog` repository and `https://kary2999.github.io/blog/` site unchanged.

## Approach

Use a copy deployment rather than transferring the existing repository. Build the blog from the current source repository with a deployment-only Hexo configuration for the `leon-book` URL, then push only the generated static output to `leon-book/blog` on its `main` branch.

## Boundaries

- Do not delete, transfer, rename, or disable `kary2999/blog`.
- Do not change the normal local-development URL configuration.
- Do not publish posts excluded because they contain private-key material.
- Preserve the existing Leon avatar and verify the published file matches the source image.
- Keep source code in the existing source repository; `leon-book/blog` contains generated static files only.

## Configuration and Data Flow

1. Add a dedicated Hexo configuration overlay with `url: https://leon-book.github.io/blog` and `root: /blog/`.
2. Generate the site in a clean export of the source commit.
3. Check that excluded sensitive posts are absent and that asset URLs use `/blog/`.
4. Authenticate GitHub CLI and Git operations as `leon-book`.
5. Push the generated files and `.nojekyll` to the empty `leon-book/blog` repository.
6. Enable GitHub Pages from `main` at `/`.

## Verification

- GitHub Pages reports a successful build.
- `https://leon-book.github.io/blog/` returns HTTP 200.
- The homepage references `/blog/` assets.
- The published avatar returns HTTP 200 and matches the provided avatar by SHA-256.
- Excluded sensitive article URLs and search-index entries are absent.
- The original `kary2999` Pages site still returns HTTP 200.

## Recovery

If the new deployment fails, leave the old site intact and repair or replace only the contents of `leon-book/blog`. No rollback action is required on the old account.
