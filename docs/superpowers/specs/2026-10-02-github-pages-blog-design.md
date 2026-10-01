# GitHub Pages Blog Deployment Design

## Goal

Publish the static Hexo blog at `https://kary2999.github.io/blog/`.

## Architecture

- Keep source history in `kary2999/ikarp-blog-web`.
- Add a production-only Hexo override with `url` set to the Pages URL and `root` set to `/blog/`.
- Build from a clean clone of the published source branch so locally ignored posts 237 and 704 cannot enter the artifact.
- Publish generated files to a new public repository, `kary2999/blog`, from its `main` branch root.

## Verification

- Confirm generated asset URLs use `/blog/`.
- Confirm posts 237 and 704 are absent from the generated site and search index.
- Confirm GitHub Pages reports `built` and the public URL returns HTTP 200.

