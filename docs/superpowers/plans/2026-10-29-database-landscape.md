# 数据库与数据基础设施地图 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增一篇以最佳使用场景为核心的数据库与数据基础设施对照文章。

**Architecture:** 文章以 Markdown 表格表达数据库清单，另用一张消息与流处理表表达 Kafka/Pulsar。公开排名只引用 DB-Engines 与 Stack Overflow；每条常见评价以来源链接收尾。

**Tech Stack:** Hexo、Markdown、Node.js built-in test、现有稳定文章路由生成器。

---

### Task 1: 增加文章契约测试

**Files:**
- Modify: `tests/features-built.mjs`

- [ ] **Step 1: 写入失败断言**

```js
test('database landscape article separates database rankings from streaming infrastructure', () => {
  const post = read('source/_posts/899.md');
  assert.match(post, /DB-Engines/);
  assert.match(post, /最佳使用场景/);
  assert.match(post, /Apache Kafka/);
  assert.match(post, /Apache Pulsar/);
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `node --test tests/features-built.mjs`

Expected: FAIL because `source/_posts/899.md` does not exist.

### Task 2: 编写文章并生成固定路由

**Files:**
- Create: `source/_posts/899.md`
- Modify: `article-routes.json` via `npm run routes:prepare`

- [ ] **Step 1: 写入文章**

使用六列对照表：产品、类型、市场参考、最佳使用场景、不适合优先使用、常见评价 / 来源；消息与流处理单列，不展示数据库市场名次。

- [ ] **Step 2: 生成路由**

Run: `npm run routes:prepare`

Expected: `899` 获得一次性随机 `archives/<8 hex>.html` 路径。

- [ ] **Step 3: 运行文章契约测试**

Run: `node --test tests/features-built.mjs`

Expected: PASS.

### Task 3: 构建并验证渲染产物

**Files:**
- Generated: `public/archives/<route>.html`

- [ ] **Step 1: 执行完整测试与构建**

Run: `npm test && npm run build:tago && node tools/verify-article-routes.mjs`

Expected: all tests pass, build succeeds, and route verification reports no errors.

- [ ] **Step 2: 检查构建页面**

Run: `rg -n "最佳使用场景|Kafka 不参与数据库排名|DB-Engines" public/archives/<route>.html`

Expected: all three markers appear in the generated public article.
