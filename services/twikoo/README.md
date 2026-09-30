<!-- [skill: go-team-standards · 部署清单] Local-only official Twikoo preview service. -->
# Local Twikoo backend

Official `tkserver@1.7.24`, pinned with npm lockfile. Verified on Node v22.23.1 and npm 10.9.8. No MongoDB, Docker, cloud account, SMTP, or administrator credentials are configured.

## Start and stop

From this directory:

```sh
npm ci --ignore-scripts
npm start
```

Or from the blog root:

```sh
npm --prefix services/twikoo start
```

This foreground process stays running until Ctrl-C. The parent/operator is responsible for launching the final service; tests leave no daemon running. Send SIGTERM or SIGINT to the Node process for upstream's graceful database flush. Do not start two servers against the same data directory.

Frontend configuration: `envId: 'http://127.0.0.1:8089'` (not a public deployment URL). The launcher forces `TWIKOO_HOST=127.0.0.1` even if another host was inherited. Default `TWIKOO_PORT=8089`; a local test may override the port. `MONGODB_URI` and `MONGO_URL` are rejected rather than silently connecting remotely.

Default persistent data: `$HOME/.local/share/ikarp-blog-twikoo`. Override with an absolute `TWIKOO_DATA` path **outside this repository**. Directory mode is 0700, service-created files use umask 0077. Keep the directory and its backups private; it contains comment and anonymous identity data. Back up the entire directory while the server is stopped. Restarting or reinstalling the package does not erase comments. No runtime data belongs in Git. `node_modules/` is an installation artifact; root ignore rules are owned by the parent task.

The upstream logger is set to `warn`, avoiding verbose request and configuration dumps. Upstream error handlers can still include request data: do not publish raw runtime error logs. Smoke tests suppress child output and emit only non-sensitive assertions.

## Verification

```sh
npm test
npm run test:smoke
npm audit
```

The smoke test uses a random loopback port and private temporary data outside the repository. It exercises guest submission (no admin setup), exact-ID readback, recent comments, graceful restart and disk persistence, then deletion using that guest's identity and readback confirming removal. It shuts down the server and removes only its temporary directory. It does not pollute the permanent preview database.

Observed upstream health contract: GET `/` returns HTTP 200, `code: 100`, a normal-running message, and `version: '1.7.24'`. **It does not return `status: true`.** Do not treat code 100 on this no-argument health request as a failed daemon. POST operations use the same root URL and JSON bodies; successful comment APIs generally omit `code` rather than returning an explicit zero.

Contract exercised by `test/smoke.cjs`:

- Submit: `{ event: 'COMMENT_SUBMIT', url, href, nick: 'PreviewVerifier', mail: 'reserved@example.invalid', ua, comment }`. Required upstream fields are `url`, `ua`, `comment`. Response includes `id`, and an `accessToken` when the caller supplied none.
- Read: `{ event: 'COMMENT_GET', url, accessToken }` returns `{ data, count, more }`. Comment identifiers are `data[].id`.
- Recent: `{ event: 'GET_RECENT_COMMENTS', urls: [url], pageSize: 10, includeReply: false }` returns `{ data }`, newest first. Omit `urls` for the whole site's recent comments. Each item has `id`, `url`, `nick`, `avatar`, `mailMd5`, `link`, `comment`, `commentText`, and `created` (epoch milliseconds).
- Cleanup only your own test comment: `{ event: 'COMMENT_DELETE_FOR_USER', id, accessToken }`, then repeat read/recent to verify removal. Keep the server-issued guest token in memory; do not print it or invent an admin password.

Matching frontend: npm `twikoo@1.7.24`, tarball `https://registry.npmjs.org/twikoo/-/twikoo-1.7.24.tgz`, member `package/dist/twikoo.all.min.js` (plus its `.LICENSE.txt` and package `LICENSE`). This bundled build contains styles. Frontend/root changes belong to the frontend worker, not this service.

## Known security gate

The unmodified official dependency graph reports **15 npm audit vulnerabilities: 5 moderate, 8 high, 2 critical**. Critical entries: `form-data` and its dependent `request`; high entries include `tkserver`, `twikoo-func`, `pushoo`, old Axios and CloudBase dependencies. No automatic fixes, overrides, or major upgrades were applied. This blocks a clean security gate and any claim of production readiness. Loopback-only use narrows exposure but does not resolve vulnerabilities; a future public deployment requires separate review. No admin password is configured, so do not expose the bootstrap/admin interface publicly.

Source references: [official private deployment documentation](https://twikoo.js.org/backend.html), installed `node_modules/tkserver/server.js` and `node_modules/tkserver/index.js`. The supplied upstream RPC event names and response fields are retained exactly; they are third-party contracts, not new project API conventions.
