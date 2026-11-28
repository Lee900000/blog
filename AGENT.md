# Tago 博客 Agent 操作手册

本文件面向在 `/Volumes/AiCode/博客` 工作的其他 Agent。执行前先阅读根目录的 `AGENTS.md`；它是不可突破的发布边界，本文件只说明具体操作。

## 站点与发布边界

- 站点：`https://tago.top/`；`www.tago.top` 应跳转到主站。
- 作者与品牌：Lee / Tago。
- 唯一 GitHub 源码仓库：`Lee900000/blog`。
- 唯一发布分支：`preview/ten-post-migration`。
- 严禁推送至 `leon-book`、`leon-book/blog`、`kary2999/ikarp-blog-web` 或其他仓库。
- 线上静态目录：`root@47.245.29.197:/opt/webserver/tago`。
- 不使用 Docker；服务器不负责构建 Node/Hexo。必须在本机构建 `public/` 后再同步到服务器。
- `source/_posts/237.md` 与 `source/_posts/704.md` 不得出现在公开构建或生产站点。

## 写新博客

1. 新建文章：`source/_posts/<文章文件名>.md`。
2. 图片放到 `source/assets/<主题目录>/`，文章通过站内相对地址引用；不要依赖临时本地绝对路径。
3. 每篇文章都要有标题、日期、分类、标签和正文；技术内容应说明背景、实现/使用目的、限制与风险，不能把未验证信息写成事实。
4. 运行固定地址生成器：

   ```bash
   cd /Volumes/AiCode/博客
   npm run routes:prepare
   ```

   它会在文章 front matter 写入 `permalink: archives/<固定随机标识>.html`，并更新根目录 `article-routes.json`。不得重生成既有文章标识，不生成数字地址、`index.php` 地址或旧地址跳转页。

5. 完成后检查页面：

   ```bash
   npm test
   npm run build:tago
   npm run server -- --port 4000
   ```

   在浏览器确认文章、图片、分类、链接和暗色默认主题均正常。`public/` 是构建产物，不提交进源码仓库。

## GitHub 源码推送

只有用户明确说“发布 / 推送 GitHub”时才运行：

```bash
cd /Volumes/AiCode/博客
git status --short
git add <已审阅文件>
git commit -m "<准确说明改动>"
npm run publish:kary -- --confirm Lee900000/blog
```

发布脚本会校验 GitHub 登录账号、目标仓库、测试、Tago 构建、文章路由与敏感文章排除。它只推送源码到 GitHub，不会自动更新 `tago.top`。

## 手动同步生产站点

GitHub 已有新提交且需要上生产时，优先运行唯一部署脚本：

```bash
cd /Volumes/AiCode/博客
bash tools/deploy-tago-if-github-updated.sh
```

脚本行为：

1. 查询 GitHub 发布分支最新提交。
2. 将其与 `.deployment-state/tago-last-deployed` 保存的上一次成功部署提交比较。
3. 无变化即退出；有变化时只接受 GitHub 的快进提交。
4. 运行测试、构建与文章路由校验。
5. 在服务器创建 `/opt/webserver/.tago-backups/` 备份。
6. 用 `rsync --delete` 同步本地 `public/` 到 `/opt/webserver/tago`。
7. 确认服务器首页文件存在后，才记录本次部署提交。

脚本拒绝以下情况：本地有未提交改动、`origin` 不是指定仓库、GitHub 分支不存在、或者 GitHub 提交不能由当前本地提交快进得到。不要绕过这些保护直接执行 `rsync`。

部署日志与状态文件均在（已被 Git 忽略）：

```text
/Volumes/AiCode/博客/.deployment-state/tago-auto-deploy.log
/Volumes/AiCode/博客/.deployment-state/tago-last-deployed
```

部署后至少验证：

```bash
curl -I https://tago.top/
curl -I https://tago.top/archives/<文章固定标识>.html
```

## 本地每日自动部署

使用 macOS 用户级 LaunchAgent，每天本机时间 08:40 调用同一部署脚本。它从独立 GitHub 检出目录构建，因此不会读取外置盘工作区的未提交修改。

安装或更新：

```bash
cd /Volumes/AiCode/博客
bash tools/install-tago-deploy-scheduler.sh
```

立即手动触发、查看状态与日志：

```bash
launchctl kickstart -k gui/$(id -u)/top.tago.site-deploy
launchctl print gui/$(id -u)/top.tago.site-deploy
tail -f /Users/karp/.local/state/tago-deploy/tago-auto-deploy.log
```

停用任务：

```bash
launchctl bootout gui/$(id -u)/top.tago.site-deploy
```

## Token 使用量展示

- 关于页读取 `/assets/token-usage.json`；只包含每日聚合 Token、估算成本、模型与 Agent 分类，绝不上传原始会话或提示词。
- 本机原始聚合来自 `~/.kimyx-token-usage/collector-state-v5/transactions/*/aggregate.json`。可运行 `node tools/export-token-usage.mjs` 刷新仓库的展示快照。
- 手动同步：`tools/sync-token-usage-to-tago.sh`。它上传每日聚合至 `/opt/webserver/tago-data/token-usage/daily/`，服务器自动汇总为 `/opt/webserver/tago/assets/token-usage.json`。
- LaunchAgent `top.tago.token-usage-sync` 每天 08:00（本机时区）调用同步脚本；日志在 `~/.kimyx-token-usage/tago-blog-sync.log`。

## 禁止事项

- 不要把 SSH 私钥、密码、令牌、`.env` 或 `article-routes.json` 放入公开产物。
- 不要删除服务器站点目录再部署；脚本会先备份。
- 不要修改服务器 Nginx 或部署 Docker，除非用户明确要求。
- 不要因“看起来没变化”而跳过测试、构建或生产可访问性检查。
