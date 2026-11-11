---
title: Go 文件监听入门：用 fsnotify 发现配置文件变化
description: 从零了解 fsnotify 如何监听配置文件、操作系统事件、完整示例以及常见替代方案。
date: 2026-06-14 10:00:00
updated: 2026-06-14 10:00:00
categories:
  - - 编程语言
tags:
  - Go
  - fsnotify
  - 配置管理
permalink: archives/01320bec.html
---

程序启动后读取了 `config.json`，如果修改了文件，程序能不能不用重启就发现变化？

可以。Go 里常用的 [fsnotify](https://github.com/fsnotify/fsnotify) 可以接收文件系统的变化通知。它负责告诉我们“文件可能发生了变化”，**读取、校验和应用新配置仍然需要程序自己完成**。

本文先从一个可以运行的小例子开始，再说明它的实现方式、注意事项，以及其他 Go 库适合什么场景。

## 一、fsnotify 是怎么发现变化的？

不需要每隔一秒主动读取文件。fsnotify 根据操作系统选择对应的通知接口：

```text
编辑器保存 config.json
        ↓
操作系统产生文件系统事件
        ↓
fsnotify 接收并转换成统一格式
        ↓
Go 程序从 Events 通道读取事件
        ↓
程序自行读取、校验、应用新配置
```

例如 Linux 使用 <a href="https://man7.org/linux/man-pages/man7/inotify.7.html" target="_blank" rel="noopener noreferrer" style="color: #ef5350;">inotify</a>，macOS 和 BSD 使用 <a href="https://developer.apple.com/library/archive/documentation/System/Conceptual/ManPages_iPhoneOS/man2/kqueue.2.html" target="_blank" rel="noopener noreferrer" style="color: #ef5350;">kqueue</a>，Windows 使用 <a href="https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-readdirectorychangesw" target="_blank" rel="noopener noreferrer" style="color: #ef5350;">ReadDirectoryChangesW</a>。fsnotify 把不同平台的通知整理成 Go 中相似的使用方式；但不同系统、文件系统和编辑器产生的事件并不完全相同。详见[官方平台说明](https://github.com/fsnotify/fsnotify#platform-support)。

## 二、先认识几个概念

| 名称 | 作用 |
| --- | --- |
| `Watcher` | 监听器，负责管理监听路径与接收事件 |
| `Add` | 向监听器添加文件或目录 |
| `Events` | 接收文件系统事件的通道 |
| `Errors` | 接收监听过程错误的通道 |
| `Event.Name` | 发生变化的路径 |
| `Event.Op` | 操作类型，可以用位运算检查 |
| `Close` | 停止监听并释放资源 |

常见事件有 `Create`（创建）、`Write`（写入）、`Remove`（删除）、`Rename`（重命名）和 `Chmod`（权限或属性变化）。一次保存可能触发多个事件，不保证和“保存一次”一一对应。

## 三、动手：监听配置文件并重新读取

### 1. 创建项目

下面在一个新的空目录运行。当前 fsnotify 文档要求 Go 1.23 或更新版本；实际版本要求以你安装的版本为准。

```bash
mkdir fsnotify-demo
cd fsnotify-demo
go mod init example.com/fsnotify-demo
go get github.com/fsnotify/fsnotify
```

新建 `config.json`：

```json
{"message":"初始配置","interval":5}
```

### 2. 编写 main.go

这个示例监听配置文件的**父目录**，只处理目标文件的创建和写入。连续事件用 300 毫秒的静默窗口合并；读取或校验失败时保留上一次有效配置。

```go
package main

import (
    "encoding/json"
    "fmt"
    "log/slog"
    "os"
    "os/signal"
    "path/filepath"
    "syscall"
    "time"

    "github.com/fsnotify/fsnotify"
)

type Config struct {
    Message  string `json:"message"`
    Interval int    `json:"interval"`
}

// loadConfig 读取并校验配置。
func loadConfig(path string) (Config, error) {
    var config Config
    data, err := os.ReadFile(path)
    if err != nil {
        return config, fmt.Errorf("读取配置: %w", err)
    }
    if err := json.Unmarshal(data, &config); err != nil {
        return config, fmt.Errorf("解析配置: %w", err)
    }
    if config.Message == "" || config.Interval <= 0 {
        return config, fmt.Errorf("message 不能为空，interval 必须大于 0")
    }
    return config, nil
}

func run() error {
    path, err := filepath.Abs("config.json") // 转成绝对路径，方便匹配事件。
    if err != nil {
        return fmt.Errorf("解析配置路径: %w", err)
    }
    watcher, err := fsnotify.NewWatcher() // 创建文件监听器。
    if err != nil {
        return fmt.Errorf("创建监听器: %w", err)
    }
    defer watcher.Close()

    // 监听父目录，避免文件被替换后丢失监听。
    if err := watcher.Add(filepath.Dir(path)); err != nil {
        return fmt.Errorf("监听配置目录: %w", err)
    }
    current, err := loadConfig(path) // 加载初始配置。
    if err != nil {
        return err
    }
    slog.Info("初始配置已加载", "message", current.Message, "interval", current.Interval)

    stop := make(chan os.Signal, 1)
    signal.Notify(stop, os.Interrupt, syscall.SIGTERM) // 接收退出信号。
    defer signal.Stop(stop)

    // 合并短时间内的重复事件。
    var timer *time.Timer
    var timerC <-chan time.Time
    defer func() {
        if timer != nil {
            timer.Stop()
        }
    }()

    for {
        select {
        case event, ok := <-watcher.Events: // 接收文件变化。
            if !ok {
                return nil
            }
            if filepath.Clean(event.Name) != path { // 忽略其他文件。
                continue
            }
            if event.Has(fsnotify.Remove) || event.Has(fsnotify.Rename) {
                slog.Warn("配置文件被删除或移走，保留旧配置", "event", event.Op.String())
            }
            if event.Has(fsnotify.Write) || event.Has(fsnotify.Create) {
                if timer == nil {
                    timer = time.NewTimer(300 * time.Millisecond)
                } else {
                    if !timer.Stop() {
                        select { case <-timer.C: default: }
                    }
                    timer.Reset(300 * time.Millisecond)
                }
                timerC = timer.C
            }
        case <-timerC: // 事件稳定后重新加载。
            timerC = nil
            next, err := loadConfig(path)
            if err != nil {
                slog.Error("配置更新失败，继续使用旧配置", "error", err)
                continue
            }
            current = next
            slog.Info("配置已更新", "message", current.Message, "interval", current.Interval)
        case err, ok := <-watcher.Errors: // 处理监听错误。
            if !ok {
                return nil
            }
            slog.Error("文件监听出错，请检查监听状态", "error", err)
        case <-stop: // 收到信号后退出。
            slog.Info("停止监听")
            return nil
        }
    }
}

func main() {
    if err := run(); err != nil {
        slog.Error("程序退出", "error", err)
        os.Exit(1)
    }
}
```

### 3. 运行并观察

在第一个终端运行：

```bash
go run .
```

在另一个终端修改配置：

```bash
printf '%s\n' '{"message":"配置已改变","interval":10}' > config.json
```

观察第一个终端，应能看到“配置已更新”和新的 `message`、`interval`。再尝试把文件改成无效 JSON：程序会报告解析失败，并保留先前的有效配置。按 `Ctrl+C` 退出。

也可以模拟编辑器先写临时文件，再替换原文件：

```bash
printf '%s\n' '{"message":"替换文件后更新","interval":20}' > config.tmp
mv config.tmp config.json
```

具体事件名称和打印次数会随平台及编辑方式变化。示例只在内存中更新变量并打印，**并未连接真实业务**；实际服务需要把新配置安全地交给使用它的组件。

## 四、为什么监听目录，而不是直接监听文件？

一些编辑器保存时，并不是直接覆盖原文件，而是先创建临时文件，再把临时文件重命名成原来的名字。原来被监听的文件对象可能已经不存在，即使路径看上去还是 `config.json`，也不一定还能继续收到事件。

因此官方建议：监听父目录，并通过 `Event.Name` 过滤目标文件。上面的示例就是这样做的。[查看 fsnotify 官方说明](https://github.com/fsnotify/fsnotify#watching-a-file-doesnt-work-well)。

需要注意：监听普通目录不能自动解决所有软链接场景。例如 Kubernetes ConfigMap 投影卷可能通过替换 `..data` 链接更新，目标文件名本身未必产生示例预期的事件；需要针对挂载方式测试，必要时监听相关目录变化或采用轮询 / 配置中心。

## 五、接入业务之前，要注意什么？

1. **通知不等于热更新成功。** 重新读取后要解析、校验；配置非法时应记录错误并继续使用旧版本。
2. **多个 goroutine 共用配置要保证并发安全。** 可以使用互斥锁或 `atomic.Value` 原子替换完整配置；不要一边读取一边修改共享结构体。
3. **不是所有参数都能立即生效。** 比如服务监听端口、连接池、已有客户端可能需要重新初始化；设计好生效范围和失败回退。
4. **事件可能重复、丢失或合并。** 防抖只能减少重复处理，不能保证文件已经写完或保证零丢失；解析失败要有告警，必要时增加重试或定期核对。
5. **默认不是递归监听。** 子目录需要分别添加监听，新增目录也需要自行处理。以所使用 fsnotify 版本文档为准。
6. **网络和虚拟文件系统需验证。** NFS、SMB、FUSE 等环境可能不提供预期通知，不要假定所有挂载都可靠。
7. **留意系统资源上限。** Linux 有 inotify 实例和 watch 数限制；macOS / BSD 的 kqueue 可能消耗较多文件描述符。出现限制错误应检查机器配置和实际监听数量。

上面的示例用于理解机制，不是生产级配置中心：它没有重试、持久化版本、并发安全发布、目录被替换后的恢复或变更审计。

## 六、还有哪些 Go 库？

“更好用”取决于需求：有的负责底层事件，有的是配置管理，有的选择轮询。它们并不完全是同一类东西。

| 方案 | 工作方式 | 适合场景 | 需要注意 |
| --- | --- | --- | --- |
| [fsnotify](https://github.com/fsnotify/fsnotify) | 操作系统文件通知 | 想直接处理文件、目录事件；依赖相对简单 | 不自动解析配置；平台与文件系统行为有差异 |
| [Viper](https://github.com/spf13/viper#watching-and-re-reading-config-files) | 配置管理，提供 `WatchConfig` 和回调 | 已经用 Viper 读取配置，希望少写监听和解析代码 | 不是独立的文件系统监听器；回调后业务如何安全应用新配置仍需自己处理 |
| [radovskyb/watcher](https://github.com/radovskyb/watcher) | 定时轮询文件信息，可递归 | 特定环境收不到系统事件、需要递归扫描时可评估 | 有扫描延迟和资源开销，轮询间隔内的短暂变化可能漏掉；需验证项目维护状态和目标文件系统 |
| [rjeczalik/notify](https://github.com/rjeczalik/notify) | 文件系统事件通知 | 需要评估不同平台事件接口的项目 | 不代表一定比 fsnotify 更易用；接入前应核对平台、维护状态和 API |

如果只是给现有服务增加少量文件监听，我会先看 fsnotify；如果已经使用 Viper 管理配置，则先评估它的配置监听接口。对于不可靠的文件系统通知，轮询可能更合适，但必须在自己的挂载环境中测试。

## 参考资料

- [fsnotify 官方仓库与 FAQ](https://github.com/fsnotify/fsnotify)
- [fsnotify Go API 文档](https://pkg.go.dev/github.com/fsnotify/fsnotify)
- [Viper：监听并重新读取配置](https://github.com/spf13/viper#watching-and-re-reading-config-files)
- [radovskyb/watcher 项目](https://github.com/radovskyb/watcher)
- [rjeczalik/notify 项目](https://github.com/rjeczalik/notify)
