---
title: Go 性能分析：用 pprof 中文界面查看调用图与函数耗时
description: 从 pprof 的函数列表、调用图和火焰图出发，记录一套借鉴 XHProf 的 Go 调用统计展示方案。
postDesc: 结合实际截图，认识 Go 性能采样、调用关系和函数调用统计的区别。
date: 2026-11-09 21:30:00
updated: 2026-11-09 21:30:00
cover: /assets/pprof-zh-intro/graph.png
top_img: /assets/pprof-zh-intro/graph.png
categories:
  - - 编程语言
tags:
  - Go
  - pprof
  - 性能分析
permalink: archives/ddcae189.html
---

用过 PHP 的 XHProf 后，再看 Go 的性能分析，有一个很直观的感受：我想知道一个接口里调用了哪些函数、调用多少次、时间花在哪里，但直接看到的往往是采样数据或一长串堆栈。

因此尝试了一个方向：先给 pprof 的 Web 界面增加中文展示，再探索把函数调用统计也整理成容易查看的表格和链路。

项目地址：[Lee900000/pprof-zh](https://github.com/Lee900000/pprof-zh)。本文结合实际截图介绍当前界面和正在探索的方案，不把采样数据当作完整的函数调用记录。

> 版本说明：截至本文整理时，仓库默认分支的中文文档介绍的是 pprof 界面汉化；本文末尾的“调用统计”来自新方案截图。默认分支暂未找到对应插桩代码，具体功能和使用方式以实际发布的版本为准。

## 一、先从函数列表看热点

![pprof 中文版函数列表](/assets/pprof-zh-intro/top.png)

列表按当前选中的采样指标展示函数。例如截图使用的是 CPU profile：`自身`表示采样归属于函数自身的 CPU 时间估计；`含子调用`还包含它调用的函数在采样中的贡献。百分比用于比较采样中各函数的占比。

截图中调用次数显示为 `-`，这是正常的：**CPU profile 的采样次数不能直接当成函数实际调用次数**。一次函数调用可能被采到多次，也可能一次都没被采到。

列表适合先找热点：哪个函数自身占用高，哪个入口的子调用累计占用高。但它不能单独回答某一次 HTTP 请求里所有函数的完整执行过程。

## 二、通过调用图查看函数关系

![pprof 中文版调用图](/assets/pprof-zh-intro/graph.png)

调用图把采样中出现的调用关系画成节点和连线。沿着连线可以观察上游入口、下游函数，以及当前选择指标在不同路径上的分布。

图中较醒目的节点可以作为排查入口：例如 `flate.(*compressor).deflate` 在当前 CPU 样本中占有一定比例，就可以继续看它是谁调用的、是否是业务预期的一部分。

需要注意，**图上的时间是当前 profile 类型对应的采样值**：CPU profile 不是包含网络或锁等待的墙钟时间；调用图也不保证画出每一次函数调用。

## 三、用火焰图查看堆栈

![pprof 中文版火焰图](/assets/pprof-zh-intro/flame.png)

火焰图把采样到的调用栈按层级展开。一个矩形越宽，表示它在当前所选采样指标中占比越大；沿垂直方向可以看到函数之间的调用层级。

截图中可以看到 `main.settle` 下多层 `main.fib`，也能看到采集逻辑自身相关的调用。这提醒我们：分析工具也会带来开销，观察到的热点需要结合实际工作负载判断。

火焰图横向位置不是一次请求的时间顺序；重复出现的函数层级也不能直接理解为所有实际调用次数。

## 四、借鉴 XHProf：展示调用次数和路径

![调用统计方案截图](/assets/pprof-zh-intro/calls.png)

这张图展示的是另一种思路：在函数调用路径上增加调用次数、总耗时、自身耗时等信息，再结合 CPU 采样辅助观察。

截图中的 `main.listOrdersBad → main.dbGetSymbolInfo` 显示父函数调用了 20 次，子函数调用了 2,000 次，平均每次父调用触发 100 次子调用。这样的数字能提醒我们检查：是不是循环里反复查询，是否存在 N+1 问题。

它只是一个**排查提示**，不是看到重复调用就能断言代码有问题：是否能批量查询、是否需要保持执行顺序，都取决于实际业务。

| 指标 | 看什么 | 注意 |
| --- | --- | --- |
| 调用次数 | 经过统计的函数执行次数 | 取决于插桩覆盖范围和采集是否完整 |
| 总耗时 | 函数从进入到返回的墙钟时间，包含子调用和等待 | 多次调用累加，并发时可能超过实际经过时间 |
| 自身耗时 | 扣除已统计子调用后的时间 | 与插桩覆盖、递归及并发归因方式有关 |
| CPU 时间 / 采样数 | 结合 CPU profile 观察热点 | 是采样估计，不是逐次调用的精确 CPU 时间 |
| 内存 | 图中展示累计分配量 | 不是峰值内存，也不能等同于单次调用独占内存 |

截图也注明了 CPU 采样按函数汇总、不区分调用路径，以及并发请求会存在相互影响。因此，表中的调用统计和 CPU / 内存数据应分别理解，不能认为它们都是同一层级、同一精度的测量结果。

对于递归、跨 goroutine 调用、内联函数和未插桩代码，完整性与归因需要针对具体实现验证；生产环境还需要单独测量插桩开销，不能仅凭示例截图认定足够轻量。

## 五、当前公开版本怎么打开

以下内容根据项目的 [README-zh.md](https://github.com/Lee900000/pprof-zh/blob/main/README-zh.md) 整理，针对仓库当前公开的中文界面版本。

### 1. 环境准备

需要 Go 1.26 或更新版本；查看调用图还需要 Graphviz。macOS 可以通过 Homebrew 安装：

```bash
brew install graphviz
```

### 2. 获取并编译

```bash
git clone https://github.com/Lee900000/pprof-zh.git
cd pprof-zh
go build -o pprof-zh ./cmd/pprof-zh
```

仓库的 Go 模块路径仍然是 `github.com/google/pprof`，README 建议克隆后编译，不要使用 `go install github.com/Lee900000/pprof-zh/...@latest`。

### 3. 查看本地 profile

使用仓库提供的示例 profile 启动本地界面：

```bash
./pprof-zh -http=127.0.0.1:8080 -no_browser cmd/pprof-zh/sample/cpu.pprof
```

然后访问 `http://127.0.0.1:8080`。公开文档里的这组命令用于打开 **pprof 采样数据的中文界面**，不代表可以生成上面截图中的调用次数统计。

也可以不提前编译，直接在仓库目录运行：

```bash
go run ./cmd/pprof-zh -http=127.0.0.1:8080 -no_browser cmd/pprof-zh/sample/cpu.pprof
```

### 4. 读取服务的 profile

如果服务已经启用 `net/http/pprof`，可以从分析机读取 CPU 或堆内存 profile。下面的地址需要替换为实际可访问的服务地址：

```bash
# 采集 30 秒 CPU profile
./pprof-zh -http=127.0.0.1:8080 -no_browser 'http://<host>:<port>/debug/pprof/profile?seconds=30'

# 查看堆内存 profile
./pprof-zh -http=127.0.0.1:8080 -no_browser 'http://<host>:<port>/debug/pprof/heap'
```

如果采集自己的服务，应限制调试端点的访问范围，不要把 pprof 调试接口直接暴露到公网。采集 CPU profile 时还要保证采集窗口内有实际负载：空闲服务可能采不到有意义的样本。

### 5. 页面功能速查

| 页面或功能 | 作用 |
| --- | --- |
| 列表（Top） | 查看函数自身和含子调用的采样指标 |
| 调用图（Graph） | 查看采样中出现的调用关系，需要 Graphviz |
| 火焰图（Flame Graph） | 按调用栈展开采样指标 |
| 上下游（Peek） | 查看某个函数的调用方和被调用方 |
| 源码（Source） | 结合源码查看采样指标 |
| 筛选（Refine） | 聚焦、忽略、隐藏或显示指定函数 |

## 六、中文界面是怎么实现的

项目 fork 自 [google/pprof](https://github.com/google/pprof)，新增 `cmd/pprof-zh` 入口。按照 README 的描述，汉化流程是：

1. 使用 pprof 的 `driver.Options.HTTPServer` 钩子接管 Web 路由。
2. 在返回的 HTML 中注入 `zh.js`。
3. 由浏览器端替换界面文案，并通过 `MutationObserver` 处理动态生成的内容。

函数名、调用图节点、源码和 `<pre>` 文本不会被翻译；翻译表没有收录的界面文案则保持英文。

需要补充翻译时，可以修改仓库中的 [`cmd/pprof-zh/zh.js`](https://github.com/Lee900000/pprof-zh/blob/main/cmd/pprof-zh/zh.js)：`EXACT` 用于整句匹配，`RULES` 用于含动态数值的文案。修改后需要重新编译，脚本通过 `go:embed` 打包进程序。

README 同时列出了几个限制：部分悬停提示尚未翻译；Peek 和 Source 中的 `<pre>` 内容不翻译；保存、删除配置的动态提示尚未逐一验证；上游文案变化后需要维护翻译表。项目沿用上游 Apache-2.0 许可证。

## 总结

目前可以把两个方向分开看：

- **pprof 中文界面**：帮助阅读函数列表、调用图和火焰图，适合从采样结果寻找热点。
- **XHProf 风格调用统计方案**：希望补充实际调用次数、调用路径和墙钟耗时；截图展示了目标效果，具体能力仍需以发布版本和实测为准。

它们互相补充：调用统计帮助发现“调用了多少次、哪里在等待”，CPU profile 帮助判断“CPU 的采样热点在哪里”。

## 参考资料

- [pprof-zh 项目及中文使用说明](https://github.com/Lee900000/pprof-zh/blob/main/README-zh.md)
- [google/pprof：性能数据分析工具](https://github.com/google/pprof)
- [Go 官方：Diagnostics](https://go.dev/doc/diagnostics)
- [Go 官方：net/http/pprof](https://pkg.go.dev/net/http/pprof)
