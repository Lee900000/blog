# MySQL 8 / InnoDB 增量能力文章 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增一篇面向开发者的 MySQL 5.7 至 8.4 / InnoDB 升级文章，说明可落地的增量能力、风险与可执行 SQL 示例。

**Architecture:** 文章作为独立 Markdown 源文件，使用站点现有 front matter 和固定随机文章路由。内容按“先校正版本事实，再说明开发收益、迁移风险和演示 SQL”的顺序组织；不引入运行时代码、第三方脚本或图片依赖。

**Tech Stack:** Hexo 8、Markdown、MySQL 官方参考手册、Node.js 测试与构建脚本。

---

## File structure

- Create: `source/_posts/898.md` — 新文章正文、SQL 示例、版本与迁移风险说明。
- Modify: `article-routes.json` — 由 `npm run routes:prepare` 写入新增文章的稳定随机地址。
- Modify: `source/_posts/898.md` — 同一命令补入该文章的 `permalink`，不改已有文章地址。

### Task 1: 先建立文章路由验证，再创建文章

**Files:**
- Test: `tests/features-built.mjs`
- Create: `source/_posts/898.md`
- Modify: `article-routes.json`

- [ ] **Step 1: 写入会失败的构建行为测试**

在 `tests/features-built.mjs` 增加：

```js
test('mysql incremental-upgrades article has a stable public route and developer SQL examples', () => {
  const post = read('source/_posts/898.md');
  assert.match(post, /title: MySQL 5\.7 到 8\.4：给 InnoDB 旧表的增量升级清单/);
  assert.match(post, /CONSTRAINT ck_orders_positive_qty CHECK \(qty > 0\)/);
  assert.match(post, /CONSTRAINT ck_orders_rest_qty CHECK \(rest_qty >= 0 AND rest_qty <= qty\)/);
  assert.match(post, /permalink: archives\/[a-f0-9]{8}\.html/);
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `node --test tests/features-built.mjs`

Expected: FAIL，原因是 `source/_posts/898.md` 尚不存在。

- [ ] **Step 3: 创建最小文章与所需 front matter**

创建 `source/_posts/898.md`，先使用下面的可验证骨架：

```markdown
---
title: MySQL 5.7 到 8.4：给 InnoDB 旧表的增量升级清单
description: 从 CHECK 约束、生成列和 JSON，到窗口函数、不可见索引与在线 DDL，记录升级 MySQL 8 后开发者可落地的能力、边界与风险。
postDesc: 不把升级理解为“追新版本”，而是把约束、查询可读性、索引验证和变更安全逐步放回数据库。
date: 2026-10-28 10:00:00
updated: 2026-10-28 10:00:00
categories:
  - - 数据库
tags:
  - MySQL
  - InnoDB
  - 数据库升级
comments: false
---

## 从订单约束开始

```sql
CONSTRAINT ck_orders_positive_qty CHECK (qty > 0),
CONSTRAINT ck_orders_rest_qty CHECK (rest_qty >= 0 AND rest_qty <= qty)
```
```

- [ ] **Step 4: 分配固定公开地址**

Run: `npm run routes:prepare`

Expected: `source/_posts/898.md` 增加 `permalink: archives/<8 位随机标识>.html`，`article-routes.json` 仅增加一条对应映射。

- [ ] **Step 5: 运行测试确认通过**

Run: `node --test tests/features-built.mjs`

Expected: PASS。

### Task 2: 完成面向开发者的内容和 SQL 示例

**Files:**
- Modify: `source/_posts/898.md`

- [ ] **Step 1: 写入版本边界和约束示例**

文章明确写出：MySQL 5.7 与 8.0.15 及更早版本可解析但不执行 `CHECK`；MySQL 8.0.16 起开始执行。使用完整建表、存量数据预检和 `ALTER TABLE ... ADD CONSTRAINT` 三段 SQL，且说明 `NULL` 会通过 `CHECK` 的 `UNKNOWN` 结果。

- [ ] **Step 2: 写入可直接用于旧表治理的能力清单**

依次说明 5.7 的 JSON / 生成列，8.0 的 CTE、窗口函数、函数索引、不可见索引、直方图、`EXPLAIN ANALYZE`、原子 DDL 与 InnoDB 在线 / Instant DDL。每项均包含：解决的日常问题、最小 SQL 示例、不能替代的工程措施。

- [ ] **Step 3: 写入升级风险和检查清单**

包含存量脏数据导致加约束失败、应用兼容性、执行计划变化、长事务 / 元数据锁、复制版本顺序、备份与回滚可行性；并明确 MySQL 8.4 是 LTS 落点，`CHECK` 不是 8.4 才出现。

- [ ] **Step 4: 核查 SQL 与版本表述**

Run:

```bash
rg -n "8\.0\.16|CHECK|INVISIBLE|EXPLAIN ANALYZE|ALGORITHM|LOCK" source/_posts/898.md
```

Expected: 每个核心能力有对应版本边界、SQL 示例或风险提示；不存在“8.4 才支持 CHECK”的表述。

### Task 3: 全站验证和本地预览

**Files:**
- Verify: `source/_posts/898.md`
- Verify: `article-routes.json`

- [ ] **Step 1: 运行全量测试**

Run: `npm test`

Expected: 所有测试通过。

- [ ] **Step 2: 构建 Tago 站点并验证新路由**

Run:

```bash
npm run build:tago
node tools/verify-article-routes.mjs
```

Expected: 构建成功，路由验证成功，公开构建中不包含文章 237 或 704。

- [ ] **Step 3: 本地启动并检查页面**

Run: `npm run server -- --port 4000`

Expected: 新文章的稳定地址能打开；标题、分类、代码块与官方文档链接可见；不发布、不推送。
