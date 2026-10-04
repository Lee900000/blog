# 博客工作区规则

本目录是 Leon 博客唯一工作空间。适用于 Codex、Claude Code 及其他自动化代理。

## 固定边界

- 只在本目录中编辑博客源码；不要回写 `/Users/karp/Code/ikarp-blog-web`。
- 正式网站是 `https://leon-book.github.io/`。
- 正式发布仓库只能是 `leon-book/leon-book.github.io`。
- 不得向 `kary2999` 账号、`leon-book/blog` 或其他仓库推送。
- 文章 `237`、`704` 不得进入公开构建或发布产物。
- 不要执行全站干净 URL 迁移；当前线上文章路径仍保留 `index.php`，除非用户重新明确授权。
- 不接入访问量统计或第三方跟踪脚本，除非用户重新明确授权。

## 标准流程

1. 新文章写入 `source/_posts/`，图片写入 `source/assets/` 下的合适目录。
2. 运行 `npm test`。
3. 运行 `npm run build:leon-root`。
4. 本地预览使用 `npm run server -- --port 4000`。
5. 发布前提交已审阅的源码修改，确保 `git status --porcelain` 为空。
6. 只有用户明确要求发布时，运行：
   `npm run publish:leon -- --confirm leon-book.github.io`

发布工具会再次检查 GitHub 登录账号、唯一目标仓库、测试、构建和敏感文章排除状态。不要绕过工具直接复制或推送 `public/`。

更多背景见 `docs/博客工作区交接.md`。
