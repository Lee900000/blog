# Leon 主站与干净文章链接迁移设计

## 目标

将 Leon 博客的正式入口从 `https://leon-book.github.io/blog/` 迁移到 `https://leon-book.github.io/`，并将文章正式链接从：

```text
https://leon-book.github.io/blog/index.php/archives/884.html
```

改为：

```text
https://leon-book.github.io/archives/884.html
```

迁移后，用户访问首页和文章都不再需要 `/blog` 或 `/index.php`；已分享的旧链接继续可用，并自动跳转到新地址。

## 已确认范围

- `leon-book/leon-book.github.io` 是正式主站仓库，发布地址为根域 `https://leon-book.github.io/`。
- `leon-book/blog` 保留，作为旧 `/blog/` 链接兼容入口，不删除仓库。
- 全部公开历史文章统一采用 `/archives/:legacy_id.html`。
- 分类、标签、归档、搜索、上一篇和下一篇等内部链接全部使用新地址。
- 历史文章正文、标题、分类、标签和文章编号不因 URL 迁移而改写。
- 继续排除此前确认不得公开的敏感文章 237 和 704，包括页面本身和搜索索引记录。
- `kary2999` 账号、仓库和 Pages 站点不参与本次迁移。

## 仓库职责

### 源码仓库

当前 `ikarp-blog-web` 仓库继续保存 Hexo 源文件、主题配置、迁移脚本和自动化测试。它是内容和链接规则的唯一源头。

### 正式主站仓库

`leon-book/leon-book.github.io` 的 `main` 分支根目录只保存生成后的静态文件和 `.nojekyll`。GitHub Pages 从 `main` 的 `/` 发布。

### 旧项目站仓库

`leon-book/blog` 的 `main` 分支保留兼容页面。旧页面不再作为正式内容副本，而是将旧路径映射到主站的新路径。

## 正式 URL 规则

| 内容 | 正式地址 |
| --- | --- |
| 首页 | `/` |
| 文章 | `/archives/:legacy_id.html` |
| 归档 | `/archives/` |
| 分类 | `/categories/` |
| 标签 | `/tags/` |
| 关于 | `/about/` |
| AI 页面 | `/ai/` |
| 量化套利专题 | `/arbitrage/` |

文章继续使用原 `legacy_id`，因此只移除历史 PHP 路径外壳，不改变文章身份。例如文章 884 固定为 `/archives/884.html`。

## 旧链接兼容

GitHub Pages 是静态托管，无法配置服务器端 301。本次使用轻量静态跳转页：

- `/index.php/archives/884.html` 跳转到 `/archives/884.html`。
- `/blog/index.php/archives/884.html` 跳转到 `https://leon-book.github.io/archives/884.html`。
- `/blog/` 跳转到 `https://leon-book.github.io/`。

跳转页同时包含：

- `meta refresh`，支持禁用 JavaScript 的浏览器；
- `location.replace`，避免旧地址留在浏览器后退历史；
- canonical 链接，声明新地址是正式页面；
- 可点击的新地址，作为跳转失败时的兜底。

旧地址兼容只负责导航，不继续维护第二份正文，从而避免搜索引擎把新旧页面视为重复内容。

## 源码与构建调整

1. 将 Hexo 默认文章永久链接改为 `archives/:legacy_id.html`。
2. 机械更新已有文章 frontmatter 中显式写死的 `index.php/archives/...` permalink。
3. 更新正文中的站内旧文章链接，使新生成页面直接指向干净地址，而不是依赖跳转。
4. 更新迁移器，使以后重新导入文章时生成干净 permalink，同时仍能识别旧站输入链接。
5. 新增主站构建配置：
   - `url: https://leon-book.github.io`
   - `root: /`
6. 构建正式主站静态文件，并单独生成旧路径兼容页。
7. 将完整主站产物发布到 `leon-book/leon-book.github.io`。
8. 将兼容跳转产物发布到 `leon-book/blog`。

## 测试与验收

自动化测试需要覆盖：

- 新文章构建到 `public/archives/884.html`，而不是把旧路径作为正式正文页面。
- 正式页面的 canonical、分享链接、搜索索引和站内链接使用根域干净地址。
- 文章 884 的专属样式、四种可信度颜色和 10 条外链继续存在。
- 每篇公开历史文章均有对应旧路径跳转页。
- 旧跳转目标不得包含重复的 `/blog` 或 `index.php`。
- 敏感文章 237 和 704 不出现在正式产物、旧兼容产物和搜索索引中。
- 根路径资源在桌面端与移动端均能加载，无 `/blog/` 硬编码残留。

线上验收包括：

- `https://leon-book.github.io/` 返回 200。
- `https://leon-book.github.io/archives/884.html` 返回 200，并显示新样式。
- `https://leon-book.github.io/index.php/archives/884.html` 自动到达新地址。
- `https://leon-book.github.io/blog/index.php/archives/884.html` 自动到达新地址。
- 两个 Pages 部署任务均成功完成。

## 发布顺序

1. 先发布根域主站，确认新页面和资源可用。
2. 再发布主站仓库中的旧 `/index.php/` 兼容页。
3. 最后把 `leon-book/blog` 改为兼容跳转站。

这个顺序保证任何旧链接开始跳转前，新目标已经可访问。

## 回滚

- 正式主站异常时，将 `leon-book/leon-book.github.io` 回退到迁移前提交。
- 在主站恢复前，不发布或回退 `leon-book/blog` 的跳转提交，使旧站正文继续可访问。
- 源码变更保留独立提交，可以整体回退永久链接与迁移器调整。
- 不删除任何仓库或历史提交，因此回滚不依赖重新上传内容。

## 不在本次范围

- 不购买或绑定自定义域名。
- 不修改文章事实、正文观点或历史发布时间。
- 不批量重命名文章标题或 legacy ID。
- 不调整 `kary2999` 下的 GitHub 配置。
