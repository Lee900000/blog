# Leon 品牌 README 与旧站停用设计

## 目标

让公开发布的博客明确使用 **Leon** 品牌，并为源码仓库和发布仓库补充易读的 README；同时停止 `kary2999/blog` 的 GitHub Pages 服务，但保留旧仓库、提交历史和文件。

## 修改范围

### 源码仓库 `ikarp-blog-web`

- 将根目录 `README.md` 的标题改为 `Leon Blog`。
- 在开头补充新站地址 `https://leon-book.github.io/blog/`、用途和当前发布归属。
- 保留现有迁移验证、隐私边界、构建命令和运维说明，不删减技术证据。
- 将站点公开品牌中的作者/标题统一为 `Leon`，并把“关于”页的个人 GitHub 入口改为 `https://github.com/leon-book`。

### 发布仓库 `leon-book/blog`

- 增加面向访客的 `README.md`，说明站点地址、内容方向、技术栈以及由 `leon-book` 发布维护。
- README 作为发布产物的一部分由源码管理，避免下一次 Hexo 构建时丢失。
- 重新构建并发布，继续排除本地敏感文章 `237` 和 `704`。

### 历史内容边界

- 不批量改写历史文章中的 `ikarp.top`、旧域名、代码示例或引用。
- 不把仍实际位于 `kary2999` 账号下的其他项目链接强行改成 `leon-book`，避免产生失效链接。
- 本次统一的是博客的当前公开品牌与 README，不伪造历史来源或项目归属。

## 旧站处理

- 停用 `kary2999/blog` 的 GitHub Pages 发布配置，使旧网址不再提供博客。
- 保留 `kary2999/blog` 仓库、分支、文件和提交历史；不删除仓库，不覆盖内容。
- 操作完成后将本机 GitHub CLI 的活动账号切回 `leon-book`，确保后续发布默认使用新账号。

## 验收标准

- `https://leon-book.github.io/blog/` 可正常访问，页面公开品牌显示为 `Leon`。
- `leon-book/blog` 仓库首页可见新的 README。
- 新站头像仍与指定的 `leon.png` 一致。
- 新站的文章 `237`、`704` URL 仍返回 404。
- GitHub API 显示 `kary2999/blog` 已无 Pages 配置；旧网址可能因 CDN 缓存短暂延迟失效。
- 两个 GitHub 账号仍保留在本机，最终活动账号为 `leon-book`。

## 回滚方式

- 旧仓库没有删除，未来可在 `kary2999/blog` 仓库设置中重新启用 GitHub Pages。
- README 和品牌修改均通过 Git 提交保留，可按提交回滚。
