# tago.top 服务器部署

用户于 2026-10-17 授权部署到自己的服务器。主站为 https://tago.top，www 跳转到主站，GitHub Pages 保留。

- SSH：root@47.245.29.197，使用本机已有的 `/Users/karp/.ssh/hermes_control` 密钥；不保存或提交密码、私钥。
- 站点目录：`/opt/webserver/tago`
- Nginx 配置：`/usr/local/nginx/conf/conf.d/tago.conf`
- 证书：`/etc/letsencrypt/live/tago.top/`，包含两个域名。
- 自动续期：`/etc/cron.d/tago-renew`，只续期 tago 证书，成功后验证并重载 Nginx。

部署前运行 `npm test` 和 `npm run build:leon-root`，再用独立域名配置构建：

```sh
npx hexo clean
npx hexo generate --config _config.yml,_config.tago.yml
node tools/verify-article-routes.mjs
```

审阅并提交源码后，将验证过的 `public/` 同步到上述服务器目录。禁止将源码、article-routes.json、凭据放入站点目录。首次部署目录为空；以后部署须先备份，不直接删除旧产物。

`tago-http.conf` 仅用于首次 ACME 验证；正常运行使用 `tago.conf`。修改服务器配置前备份原配置，`nginx -t` 成功才重载。

本地预览仍使用 `npm run server -- --port 4000`；GitHub Pages 发布仍只允许原有 `npm run publish:leon -- --confirm leon-book.github.io`，它会重新生成 Pages 配置，不使用 tago 构建产物。
