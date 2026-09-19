<!-- [skill: go-team-standards · 迁移预览] 十篇真实文章的本地迁移与验证说明。 -->
# Karp 的技术博客 · 迁移预览

Hexo 8 + Butterfly 5；仅迁移公开文章 `883,882,881,880,879,878,877,876,875,1`。不部署、不修改原站、不迁移评论。

## 本地运行

需要 Node.js 22（已用 22.23.1 / npm 10.9.8 验证）。

```sh
npm ci
npm test
npm run build
npm run verify
npm run server -- --ip 127.0.0.1 --port 4000
```

浏览 `http://127.0.0.1:4000/`。构建输出 `public/` 不入库；十篇 Markdown 与本地图片在 `source/`，锁文件保证安装可复现。服务器由操作者单独启动。

## 迁移与验收

`npm run migrate` 重新读取十篇公开页面（需要网络），只提取 `article h1` / `article div.prose` 与文章分类、标签，不保存整页快照。清单在 `migration/manifest.json`，包含来源、状态、计数、代码 SHA-256 与图片校验和。无当前时间等不确定字段。

- 保留旧路径 `/index.php/archives/{id}.html`、`legacy_id`、正文、代码和 Mermaid 源码；复杂表格保留 HTML。
- 平行分类使用嵌套单元素数组，防止 Hexo 误建父子层级。
- `disableNunjucks: true` 避免代码中的模板表达式被执行。
- Hexo 会按配置时区解释 front matter 时间；因此 `date` 使用东京墙上时间，原始带 `+09:00` 时间完整留在 `source_date` 和清单。验证同时检查显示日期和 UTC 瞬间。
- 样本内文章链接本地化，样本外保持生产源 URL。
- 图片下载仅允许明确白名单 HTTPS 公共域名，检查 DNS 地址，逐跳校验重定向，25 秒超时、12 MiB 上限；失败保留来源并记入清单。
- `npm test` 是合成页面提取回归测试；`npm run verify` 检查生成的十篇文章、首页十卡、日期、表格、代码哈希、Mermaid、图片及禁用评论。

## 已知限制

文章 877 的 `./market_wind_tables.md` 是原站既有 404，保持指向原站，不伪造附件。主题第三方 JS/CSS（含 Mermaid）仍使用默认 CDN，因此不是完全离线站点。未对正文观点或技术内容进行改写。正式发布前须另行人工审阅正文隐私与版权。

配置依据：[Hexo 官方文档](https://hexo.io/docs/) / [Butterfly 官方文档](https://butterfly.js.org/posts/21cfbf15/)；实际配置以锁定版本源码为准。
