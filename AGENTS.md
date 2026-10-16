# 博客工作区规则

本目录是 Leon 博客唯一工作空间。适用于 Codex、Claude Code 及其他自动化代理。

## 固定边界

- 只在本目录中编辑博客源码；不要回写 `/Users/karp/Code/ikarp-blog-web`。
- 主站是 `https://tago.top/`，`www.tago.top` 跳转到主站；原 `https://leon-book.github.io/` 保留。
- 用户于 2026-10-17 授权额外部署到 `root@47.245.29.197:/opt/webserver/tago`，服务器部署见 `docs/deploy/tago.md`。以下 GitHub 仓库限制不变。
- 正式发布仓库只能是 `leon-book/leon-book.github.io`。
- 不得向 `kary2999` 账号、`leon-book/blog` 或其他仓库推送。
- 文章 `237`、`704` 不得进入公开构建或发布产物。
- 用户于 2026-10-13 授权移除文章路径中的 `index.php` 并停用数字地址。文章使用 `archives/<固定随机标识>.html`；不生成旧数字地址或跳转页。
- 新增文章后运行 `npm run routes:prepare`，将固定随机地址写入文章及根目录 `article-routes.json`；不得重新生成既有标识，也不得将映射表放入公开目录。
- 不接入访问量统计或第三方跟踪脚本，除非用户重新明确授权。

## 标准流程

1. 新文章写入 `source/_posts/`，图片写入 `source/assets/` 下的合适目录。
2. 运行 `npm test`。
3. 运行 `npm run build:leon-root`。
4. 本地预览使用 `npm run server -- --port 4000`。
5. 发布前提交已审阅的源码修改，确保 `git status --porcelain` 为空。
6. 只有用户明确要求发布时，运行：
   `npm run publish:leon -- --confirm leon-book.github.io`

发布工具会再次检查 GitHub 登录账号、唯一目标仓库、测试、构建和敏感文章排除状态。GitHub Pages 不要绕过工具直接复制或推送 `public/`；已授权的独立服务器部署按 `docs/deploy/tago.md` 执行。

更多背景见 `docs/博客工作区交接.md`。
