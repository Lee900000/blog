---
title: AI实践
description: AI 落地与开源作品：开发工具、桌面应用与实践记录。
source_url: https://www.ikarp.top/index.php/ai.html
comments: false
toc: true
disableNunjucks: true
---
<!-- [skill: go-team-standards · 独立页面迁移] 沿用旧站正文，更新本站展示身份。 -->

# 我的开源项目展示

这些年陆陆续续写了一些小项目，从交易工具、开发效率插件、macOS 桌面应用到一系列「每天给你一个日本角落」的静态小站。这里集中展示 16 个作品：网页类部署在 GitHub Pages 上，点开即玩；macOS 应用在 GitHub Releases 提供安装包。

源码全部开源在 GitHub：[github.com/kary2999](https://github.com/kary2999)

* * *

## 🛠 开发 / 交易工具

### 1\. monitor · 现货做市监控工具箱

![](/assets/pages/b50b4a817dbc34b3fc21.png)

加密货币现货做市的监控工具箱，聚合做市过程中需要盯的各项指标，PHP 实现。

*   在线体验：[https://kary2999.github.io/monitor/](https://kary2999.github.io/monitor/)
*   源码：[https://github.com/kary2999/monitor](https://github.com/kary2999/monitor)

### 2\. quant-tool · 量化监控工具

![](/assets/pages/9fda50d9fde42ac67647.png) ![](/assets/pages/f468c49baeb1d2071a14.png) ![](/assets/pages/b5caf2593dbd2186cfca.png) ![](/assets/pages/814845c7d3b26d09d7ca.png)

自研的量化监控工具，纯静态页面，打开即用。

*   在线体验：[https://kary2999.github.io/quant-tool/](https://kary2999.github.io/quant-tool/)
*   源码：[https://github.com/kary2999/quant-tool](https://github.com/kary2999/quant-tool)

### 3\. trade-backtest · 交易回测

![](/assets/pages/9823e548a81b9ccb8a4c.png)

在浏览器里跑的交易策略回测工具，无需后端，数据与计算都在本地完成。

*   在线体验：[https://kary2999.github.io/trade-backtest/](https://kary2999.github.io/trade-backtest/)
*   源码：[https://github.com/kary2999/trade-backtest](https://github.com/kary2999/trade-backtest)

### 4\. SChat · 加密 P2P 聊天

![](/assets/pages/95bacacdab919dff932e.png)

Encrypted ephemeral P2P chat —— 无服务器、无日志、无痕迹的端到端加密临时聊天。提供 Chrome 扩展和 Web 两个端。

*   在线体验：[https://kary2999.github.io/SChat/](https://kary2999.github.io/SChat/)
*   源码：[https://github.com/kary2999/SChat](https://github.com/kary2999/SChat)

### 5\. go-skill · Go 团队规范分发器

![](/assets/pages/e5544bfbe37f74f246a3.png)

Go 微服务团队编码规范的单一源分发工具：一份 `standards/*.md`，同时产出 Claude Code Skill 和 Cursor `.mdc` 规则，附轻量 demo 模板、术语表和图形化安装器，双击即可把团队规范装进 AI 编辑器。

*   在线体验：[https://kary2999.github.io/go-skill/](https://kary2999.github.io/go-skill/)
*   源码：[https://github.com/kary2999/go-skill](https://github.com/kary2999/go-skill)

### 6\. markdownShow · Markdown 展示工具

![](/assets/pages/d116f67bcd562187eed6.png)

轻量的在线 Markdown 渲染展示工具。

*   在线体验：[https://kary2999.github.io/markdownShow/](https://kary2999.github.io/markdownShow/)
*   源码：[https://github.com/kary2999/markdownShow](https://github.com/kary2999/markdownShow)

### 7\. WebJudge · Web 接口检测扩展

![](/assets/pages/00dc5540181b1c4334ae.png) ![](/assets/pages/372d424bc3f5e55dd2de.png)

Chrome 浏览器扩展，用于检测当前页面的 Web 接口调用情况，前端联调好帮手。

*   在线体验：[https://kary2999.github.io/WebJudge/](https://kary2999.github.io/WebJudge/)
*   源码：[https://github.com/kary2999/WebJudge](https://github.com/kary2999/WebJudge)
*   [Chrome 应用商店](https://chromewebstore.google.com/detail/judge-%E9%A1%B5%E9%9D%A2%E6%80%A7%E8%83%BD%E4%BD%93%E6%A3%80/nnmmdginmdfgdekmmonclklaccghbnkg)

### 8\. atool · WebSocket 辅助开发工具

![](/assets/pages/7d39416be4be31e57762.png)

WebSocket 辅助开发 / 调试工具，发消息、看帧、测连通性都在网页里完成。

*   在线体验：[https://kary2999.github.io/atool/](https://kary2999.github.io/atool/)
*   源码：[https://github.com/kary2999/atool](https://github.com/kary2999/atool)
*   [Chrome 应用商店](https://chromewebstore.google.com/detail/atool-%E2%80%94-websocket-+-%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7%E7%AE%B1/jfceecgegjmogljicmpliciecngndlbb)

* * *

## 🖥 macOS 桌面应用

### 9\. code-ferry · 实时代码同步工具

![Code Ferry 项目管理窗口](/assets/pages/7315f8274ea27980e98c.png) ![Code Ferry 项目管理窗口](/assets/pages/b6e0995b204fdab51d1c.png) ![Code Ferry 项目管理窗口](/assets/pages/980df9486ca6f4685e53.png)

macOS 菜单栏实时代码同步工具：本地改完自动经 SFTP 推到远程，支持多项目、增量/全量上传、暂停继续、文件过滤与浮窗进度监控。Python 实现，常驻菜单栏不占主窗口。

*   源码：[https://github.com/kary2999/code-ferry](https://github.com/kary2999/code-ferry)
*   下载：[GitHub Releases](https://github.com/kary2999/code-ferry/releases)

### 10\. mini-bar · Meowser 浮动浏览器

![mini-bar 大窗模式看视频](https://www.ikarp.top/usr/uploads/2026/08/4071084162.png) ![mini-bar 菜单栏控制菜单](/assets/pages/4960fae3a72224389c72.png)

macOS 菜单栏浮动浏览器（摸鱼神器）：多个始终置顶的独立浮窗，工作间隙随时瞄一眼视频、文档或消息。支持大小窗自由切换（200×150 ↔ 1200×800）、全局快捷键、网格 / 级联自动布局、多工作区（各自独立的代理与书签配置）。Python 实现，CI 自动产出 DMG / ZIP 安装包。

*   源码：[https://github.com/kary2999/mini-bar](https://github.com/kary2999/mini-bar)
*   下载：[GitHub Releases](https://github.com/kary2999/mini-bar/releases)（DMG / ZIP）

### 11\. PerfMon · macOS 性能监控与诊断

![PerfMon 主窗口：CPU 占用环 / 温度计 / 趋势曲线](https://www.ikarp.top/usr/uploads/2026/08/2577656047.png) ![PerfMon 悬浮球收起态](/assets/pages/922cc3c44934dd4fae42.png)

macOS 原生性能监控与诊断工具：实时 CPU / 内存 / 温度，菜单栏常驻 + 桌面悬浮窗 + 一键加速 + 基于真实内存压力的智能诊断。Swift 6 + SwiftUI 毛玻璃风格，适配 Apple Silicon（M1–M5），打 tag 即自动编译、测试并发布 Release。

*   源码：[https://github.com/kary2999/PerfMon](https://github.com/kary2999/PerfMon)
*   下载：[GitHub Releases](https://github.com/kary2999/PerfMon/releases)（DMG / ZIP）

### 12\. LazyCat · 桌面萌宠 ToDo 助手

![LazyCat 主窗口：四栏任务管理 ](/assets/pages/9509aeac52ee22273fd4.png) ![LazyCat 桌面悬浮橘猫](/assets/pages/6f41dd0ccadb63a24531.png)

桌面萌宠 + ToDo + Telegram 消息聚合 + 专注遮罩四合一 macOS 助手：菜单栏小猫统一入口，悬浮宠物实时显示未完成任务数，TG 消息一键转任务（私聊 24 小时内自动合并），全屏专注遮罩防走神，还有打字键数统计。Swift 实现。

*   源码：[https://github.com/kary2999/LazyCat](https://github.com/kary2999/LazyCat)
*   下载：[GitHub Releases](https://github.com/kary2999/LazyCat/releases)

* * *

## 🗾 远方来信 · 日本系列

一个「每天给你一个真实地点 + 一句话」的静态小站系列。统一的数据结构，每期一种视觉风格，纯 HTML + JSON，每日更新。

### 系列入口 · the-drawer 诗和远方总抽屉

![](/assets/pages/e81377d1bbf3985e6756.png)

整个系列的总目录：一张日本地图，11 期内容全部收纳其中，点地图上的 pin 或列表即可跳转到对应小站。

*   在线体验：[https://kary2999.github.io/the-drawer/](https://kary2999.github.io/the-drawer/)
*   源码：[https://github.com/kary2999/the-drawer](https://github.com/kary2999/the-drawer)

* * *

## 🗼 旅行攻略

### tokyo-guide · 东京 9 日攻略

一份完整的东京 9 日游攻略网页版。最大亮点是同一份数据驱动三套 UI：樱花粉彩（和风浪漫）、复古印刷（报刊手册风）、手账风（方格本 + 胶带便签），改一处数据全站同步。

*   在线体验：[https://kary2999.github.io/tokyo-guide/](https://kary2999.github.io/tokyo-guide/)
*   源码：[https://github.com/kary2999/tokyo-guide](https://github.com/kary2999/tokyo-guide)

* * *

_以上项目均为个人学习 / 兴趣作品，持续更新中。欢迎 Star & Issue。_
