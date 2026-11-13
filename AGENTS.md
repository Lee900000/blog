# 博客工作区规则

本目录是 Tago（Lee）博客唯一工作空间。适用于 Codex、Claude Code 及其他自动化代理。

## 固定边界

- 只在本目录中编辑博客源码；不要回写 `/Users/karp/Code/ikarp-blog-web`。
- 主站是 `https://tago.top/`，`www.tago.top` 跳转到主站；旧 `leon-book` 站点不再发布。
- 用户于 2026-10-17 授权额外部署到 `root@47.245.29.197:/opt/webserver/tago`，服务器部署见 `docs/deploy/tago.md`。
- GitHub 源码发布仓库只能是 `kary2999/leon-blog-web`，默认分支为 `preview/ten-post-migration`。
- 不得向 `leon-book`、`leon-book/blog`、`kary2999/ikarp-blog-web` 或其他仓库推送。
- 文章 `237`、`704` 不得进入公开构建或发布产物。
- 用户于 2026-10-13 授权移除文章路径中的 `index.php` 并停用数字地址。文章使用 `archives/<固定随机标识>.html`；不生成旧数字地址或跳转页。
- 新增文章后运行 `npm run routes:prepare`，将固定随机地址写入文章及根目录 `article-routes.json`；不得重新生成既有标识，也不得将映射表放入公开目录。
- 不接入访问量统计或第三方跟踪脚本，除非用户重新明确授权。
- 所有新增图片在用于博客之前，必须先使用 TinyPNG 压缩，再将压缩后的图片放入源码；核对压缩后图片可正常显示、文字清晰。无法使用 TinyPNG 或压缩后影响内容时，应告知用户，不要直接使用未压缩图片。

## 标准流程

1. 新文章写入 `source/_posts/`，图片写入 `source/assets/` 下的合适目录。
2. 运行 `npm test`。
3. 运行 `npm run build:tago`。
4. 本地预览使用 `npm run server -- --port 4000`。
5. 发布前提交已审阅的源码修改，确保 `git status --porcelain` 为空。
6. 只有用户明确要求发布时，运行：
   `npm run publish:kary -- --confirm kary2999/leon-blog-web`

发布工具会再次检查 GitHub 登录账号、唯一目标仓库、测试、构建和敏感文章排除状态，并只推送源码；不要将 `public/` 提交到源码仓库。已授权的独立服务器部署按 `docs/deploy/tago.md` 执行。

更多背景见 `docs/博客工作区交接.md`。
