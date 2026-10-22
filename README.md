<!-- [skill: go-team-standards · 迁移运维] 公开 Typecho 全量迁移与本地验收操作。 -->
# Tago · 开发手记

Public Typecho articles migrated to Hexo with the native Butterfly theme. Scope is public articles only; comments and independent pages are not migrated. No database, credentials, private pages, or production write operations are used.

The published site is [https://www.tago.top/](https://www.tago.top/). This repository contains the Hexo source and migration evidence for Lee's blog.

The local theme hero `source/assets/theme/butterfly-teal-smoke.jpg` follows the official `jerryc127/butterfly.js.org` `_config.butterfly.yml` source, which references <https://oss.012700.xyz/butterfly/2024/10/index.jpg>. It is a theme default, not an invented illustration attributed to an article.

## Verified local result

867/867 articles pass the full local build/content verifier: 3,902 code blocks, 206 tables, 20 Mermaid diagrams, and 405 image references (including one embedded PNG). Of 399 unique remote images, 335 are localized and 64 have explicit exceptions in `migration/report.json`; their original URLs are retained. Nineteen attachment references remain unverified. All 867 checklist entries describe local verification, not publication approval.

Article 237 remains local-only and `pending-manual-key-review`: a mathematically valid RSA private key appears in its public tutorial, but its actual usage is unknown. Do not commit that article until the owner decides; no automatic redaction or remote source change was made.

## Local commands

```sh
npm ci
npm test
npm run migrate
npm run build
npm run verify
npm run server -- --port 4000
```

`migration/discovery.json` defines the exact 867-ID scope (not a contiguous range). Permalinks remain `/index.php/archives/{id}.html`; references to migrated posts on either legacy hostname become local links. `source_date` retains the original timestamp, while Hexo's date field uses its wall-clock form to avoid double timezone conversion. Post 883 retains September 17, 2026.

## Resume and evidence

- `migration/cache/pages/`: ignored raw public pages, reused on restart.
- `migration/cache/posts/`: ignored extracted article checkpoints.
- `migration/checkpoints/`: ignored per-article and per-asset atomic checkpoints.
- `migration/article-status.json`: article extraction results and explicit failures.
- `migration/manifest.json`: article metadata, content hashes, image outcomes.
- `migration/report.json`: local build verification, exact counts, failed checks, retained attachments, and image exceptions.
- `docs/article-checklist.md`: all discovered IDs; checked only after individual build/content verification.

The migration uses at most two concurrent requests in each phase, a shared 550 ms minimum request-start interval, 15-second HTTP deadlines, and at most three attempts with backoff. It fetches only discovered article paths and images explicitly referenced by those articles. Public DNS and HTTP(S) checks, redirect bounds, 12 MiB image limits, MIME/signature checks, and SVG rejection constrain downloads. Failed images retain their original URLs; they do not block article conversion or count as localized. Existing successful assets are reused. Attachments remain source references and are reported as unverified, not silently claimed downloaded.

Rerun `npm run migrate` to resume. Valid cached pages are reused; invalid HTML is discarded/refetched. Localized assets are reused only after file/SHA256 validation; transient failures are retried, while confirmed HTTP 404 outcomes are retained. To deliberately retry a confirmed 404, remove only that URL's failed entry from `migration/checkpoints/assets.json` **and** `migration/manifest.json`, then rerun. DNS addresses are checked and pinned to each connection, including redirects. Repeated failing hosts can yield explicitly unverified skips. Article files are written before the image pass, then updated with successful local paths. Do not delete raw caches merely to rebuild. A nonzero article migration or verification result means the report must be reviewed before publication.

Code source hashes are exact; rendered highlighter checks reconstruct line boundaries and account for Hexo's documented common-indent stripping and terminal newlines only. Table cells, Mermaid counts, images, IDs, legacy paths, date instants, and migrated internal links are checked against cached public-source extraction. A localized real article image becomes its cover; text-only articles inherit the native theme default.

`npm run build` writes only local `public/`; no deploy command is provided. If a local server already serves `public/`, a clean build briefly removes that directory. Publishing, privacy review, and production operations are separate owner-controlled steps.

## Native Butterfly features — local preview only

<!-- [skill: go-team-standards · 原生功能验收] 本地原生功能、数据边界与复验命令。 -->

The additional pages and new comment service below extend the earlier article-only migration; **historical Typecho comments were not imported**. Do not rerun the migration to enable these features.

- `/archives/`, `/tags/`, `/categories/`: native Butterfly/Hexo navigation and generated listings. The current source yields **867 articles, 62 tags and 12 categories**, not hand-entered display counters.
- Native local search uses `hexo-generator-searchdb@1.5.0` and `/search.xml`, containing all 867 articles' titles and content. `scripts/native-features.js` projects slash-normalized paths into the upstream XML generator: legacy frontmatter permalinks already start with `/`, otherwise searchdb would produce broken `//index.php/...` links. It never mutates post content.
- `/shuoshuo/`: native `type: shuoshuo`; `source/_data/shuoshuo.yml` is genuinely empty. The title explicitly says “暂无内容”. Only add real, author-approved entries; remove that empty-state title suffix when entries exist. No example sayings or dates are presented as the author's writing.
- `/link/`: native friend cards, containing only the five links from the body of <https://www.ikarp.top/index.php/links.html>. The old page's letter avatars are represented by Butterfly's neutral fallback, not invented site logos. These links' current destination availability is not claimed verified.
- Announcement uses a short technical-blog description. The existing official-demo hero is unchanged. Ribbon uses Butterfly's native `canvas_ribbon` settings, disabled on mobile; its native asset currently loads from jsDelivr.
- Site information uses real Hexo totals and the earliest manifest publication date, **2015-07-01**. Native “运行时间” is days since that publication baseline, **not measured continuous uptime**; last-update is the local build time. Busuanzi and Twikoo visitor counters are disabled, and the footer explicitly says visitor statistics are not connected.
- Native Twikoo article comments and the newest-comments card both use **`http://127.0.0.1:8089/`**. Backend setup/lifecycle belongs to `services/twikoo/`; this frontend build neither starts it nor seeds comments. An empty service should show the native empty state; an unreachable service must not be represented as zero historical comments.
- The browser bundle is vendored from npm `twikoo@1.7.24`, `dist/twikoo.all.min.js`, to `source/assets/vendor/twikoo-1.7.24.all.min.js` with upstream licenses. SHA256: `27c1c2be3981d32a517d6a12101bfb088bb0a643d84eacda16ac1f894286c704`. No extra root Twikoo runtime dependency is required.
- `_config.yml`'s `imported_post_comments: true` enables comments at **render time only**, and only for imported IDs in the manifest with post layout. All 867 source Markdown files retain their previous bytes and comment flags. Set the switch to `false` to restore imported-post comment suppression, then rebuild.

**Do not deploy this configuration.** A production endpoint, HTTPS/CORS/security settings and privacy review require separate approval. Loopback URLs work only on the local machine. The generated article 237 and full-text search index remain subject to the existing key-review hold: do not publish, commit, print or attach that content/index. No production/Git operation is part of these commands.

```sh
npm test                 # existing migration checks plus native-feature configuration/hook tests
npm run build            # local static artifact only
npm run verify:features  # generated routes, search coverage, native cards, all article comment containers
npm run verify           # original cached migration content/hash invariants, now config-aware for comments
```

The standalone HTTP verifier now lives at `tools/verify-http.mjs` (run `node tools/verify-http.mjs` only after the local preview server is running). It was moved unchanged out of `scripts/` because Hexo auto-loads every file there as a plugin; its ESM imports otherwise caused misleading build-time “Script load failed” errors. `scripts/` now contains only the Hexo feature hook.

Static checks prove generated wiring, not a running comment service or successful browser submission. Validate search interaction, Ribbon canvas and article/newest-comment network behavior against the running local preview and local backend separately.
