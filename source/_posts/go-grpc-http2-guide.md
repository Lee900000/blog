---
title: 图解 gRPC 协议：HTTP/2 中的数据长什么样？
description: 从 HTTP/2 帧、gRPC 消息头到 Protobuf 字节，拆解一次 Go gRPC 请求和响应。
cover: /assets/grpc-protocol/hero-v2.jpg
date: 2025-10-14 10:00:00
updated: 2025-10-14 10:00:00
categories:
  - 协议
tags:
  - 协议
  - HTTP
  - Go
  - gRPC
  - Protobuf
permalink: archives/3964c478.html
---

Go 中调用 `client.GetUser(ctx, request)`，看起来像调用一个函数。<strong>但网络上传输的到底是什么？</strong>这篇文章从协议结构入手，把一次请求拆到字节，再用 Go 示例对应起来。

![gRPC 与 HTTP/2 的通信示意](/assets/grpc-protocol/hero-v2.jpg)

## 先看整体：gRPC 在哪一层？

![gRPC 协议分层：Go、gRPC、HTTP/2、TLS、TCP 和 IP](/assets/grpc-protocol/layers-v2.jpg)

<strong>标准 gRPC 使用 HTTP/2 作为传输。</strong>更具体地说，gRPC 把方法名和元数据放到 HTTP/2 请求头，把带长度前缀的消息放到 DATA 帧，把最终状态放到响应尾部的 Trailers。Protobuf 常用于消息体的序列化；gRPC 也支持其他编码方式。

每一层实际做的事：

1. <strong>Go 应用</strong>构造请求对象，调用生成的客户端方法。
2. <strong>Protobuf</strong> 把对象编码成字节；它只负责数据格式，不负责网络连接。
3. <strong>gRPC</strong> 为每条消息增加 5 字节前缀，并定义方法路径、metadata 和最终状态。
4. <strong>HTTP/2</strong> 把头部与消息数据放入不同的帧，并用 Stream 区分并发调用。
5. <strong>TLS / TCP / IP</strong> 分别负责可选加密、可靠传输以及网络寻址。

这张图表示各层的职责，并不代表一个 TCP 包一定完整包含一条 gRPC 消息：TCP 和 HTTP/2 都可能把数据拆开。

把它与常见 HTTP 接口放在一起看：

|  | 常见 HTTP JSON 接口 | 标准 gRPC |
| --- | --- | --- |
| 传输 | 常见 HTTP/1.1 或 HTTP/2 | HTTP/2 |
| 调用目标 | 如 `/users/1001` | 如 `/user.UserService/GetUser` |
| 消息内容 | 常见 JSON 文本 | 默认常用 Protobuf 二进制，前面有 gRPC 消息头 |
| 调用结果 | HTTP 状态码及响应体 | HTTP 状态码 + gRPC 状态码和消息 |

HTTP/2 和 HTTP/1.1 都承载在 TCP 上；HTTP/2 使用二进制帧，并不意味着它上面的所有消息都必须是 Protobuf。浏览器场景中的 gRPC-Web 与标准 gRPC 的线路格式也有区别。

## gRPC 客户端与服务端

![gRPC 客户端与服务端通信示意](/assets/grpc-protocol/architecture-v2.jpg)

架构示意参考：[gRPC 官方介绍](https://grpc.io/docs/what-is-grpc/introduction/)。下面继续拆解请求实际传输的内容。

## 一个请求在 HTTP/2 里是什么样？

以 `GetUser(id=1001)` 为例。下面是<strong>解码后的逻辑示意</strong>，不是原始抓包文本；HTTP/2 的头部在实际网络中经过 HPACK 编码。

![一次 gRPC 调用中请求与响应的 HTTP/2 帧](/assets/grpc-protocol/exchange-v2.jpg)

```text
客户端 → 服务端
  HEADERS
    :method       POST
    :path         /user.UserService/GetUser
    :scheme       http
    :authority    localhost:50051
    content-type  application/grpc
    te            trailers
    grpc-timeout  3S                     # 示例，实际值由客户端编码

  DATA
    [gRPC 消息头：5 字节] [Protobuf 数据]
    END_STREAM                           # 请求发送结束

服务端 → 客户端
  HEADERS
    :status       200
    content-type  application/grpc
  DATA
    [gRPC 消息头：5 字节] [Protobuf 数据]
  HEADERS / Trailers
    grpc-status   0                      # 调用成功
    END_STREAM                           # 响应结束
```

`:path` 的格式是 `/<包名>.<服务名>/<方法名>`；它标识要调用哪个 RPC。认证信息等 metadata 也放在 HTTP/2 头部。`grpc-timeout` 可告知服务端调用的剩余时限；值与单位由客户端实际编码决定。

## DATA 里面：5 字节头 + 消息体

gRPC 消息不是把 Protobuf 直接塞进去就结束了。<strong>每条消息前有 5 字节前缀</strong>，让接收方知道消息是否压缩，以及消息有多长。

![HTTP/2 DATA 帧头、gRPC 消息头和 Protobuf 字节结构](/assets/grpc-protocol/bytes-v2.jpg)

上图中的前 9 字节属于 HTTP/2，后 8 字节才是 DATA 的内容。其中前 5 字节是 gRPC 消息头，最后 3 字节是 Protobuf。

| HTTP/2 帧头字节 | 含义 |
| --- | --- |
| `00 00 08` | DATA 负载长度为 8 字节，不包括帧头 |
| `00` | 帧类型为 DATA |
| `01` | END_STREAM，客户端不再发送请求数据 |
| `00 00 00 01` | Stream ID 为 1；最高位保留 |

HTTP/2 帧头中的长度是这一帧的负载长度；gRPC 前缀中的长度是这一条消息的长度。它们不是同一个值。这里假设 DATA 没有 padding，并且消息恰好装进一个帧。实际情况可能拆成多个帧。

例如 `.proto` 中定义 `int64 id = 1`，传入 `id=1001`：

```text
gRPC 消息：  00 | 00 00 00 03 | 08 e9 07
             │  │              └── Protobuf 内容：3 字节
             │  └───────────────── 消息内容长度：3，大端序
             └──────────────────── 0 = 未压缩

Protobuf：   08       e9 07
             │        └── 1001 的 varint 编码
             └─────────── 字段 1，wire type 0（varint）
```

这个例子只包含一个字段，因此长度是 3。压缩标志为 `1` 时，消息内容按 `grpc-encoding` 指定的算法压缩；长度是压缩后消息体的字节数，不包括前面 5 字节。

<strong>注意边界不同：一个 gRPC 消息不保证恰好对应一个 HTTP/2 DATA 帧。</strong>消息可能跨多个 DATA 帧，一帧也可能包含多条消息的数据；接收方要先拼接字节流，再根据长度前缀还原消息。

## 响应为什么还需要 Trailers？

`HTTP :status = 200` 说明响应使用了正常的 HTTP 层状态，<strong>不代表 RPC 业务调用成功</strong>。最终还要检查 `grpc-status`：

| Trailers | 含义 |
| --- | --- |
| `grpc-status: 0` | 成功 |
| `grpc-status: 5` | NOT_FOUND，未找到 |
| `grpc-status: 4` | DEADLINE_EXCEEDED，超时 |
| `grpc-status: 14` | UNAVAILABLE，服务不可用 |

发生错误时，服务端还可以提供 `grpc-message`；部分立即失败的响应可以只发送包含状态的头部（Trailers-Only），不一定有 DATA。Go 客户端通常通过返回的 `error` 获取状态，不需要自己解析原始 Trailers。

## HTTP/2 的 Stream 与 gRPC 流是什么关系？

一次 gRPC 调用通常映射到一个 HTTP/2 Stream；同一连接可复用多个 Stream。<strong>一个 RPC Stream 里又可以有多条 gRPC 消息</strong>，因此既能一问一答，也能持续发送消息。

```text
一条 TCP 连接 / 一个 HTTP/2 连接
├─ Stream 1：GetUser     请求消息 1 条 → 响应消息 1 条
├─ Stream 3：WatchPrice  请求消息 1 条 → 响应消息多条
└─ Stream 5：Chat        请求和响应各可发送多条消息
```

流之间共享连接，但独立传送消息；连接中断仍可能同时影响其中多个调用。具体分帧、调度与重连由实现决定。

## 用 Go 验证消息字节

下面的示例定义 `id=1001`，生成的请求消息正好对应上面的 `08 e9 07`。可以在客户端创建请求后添加：

```go
req := &userpb.GetUserRequest{Id: 1001}
data, err := proto.Marshal(req)
if err != nil { log.Fatal(err) }
log.Printf("Protobuf: % x", data) // 08 e9 07
```

需要额外导入 `google.golang.org/protobuf/proto`。这里打印的是 <strong>Protobuf 消息体</strong>，不是完整的 gRPC 5 字节前缀，也不是 HTTP/2 帧；后两部分由 gRPC 库和传输层处理。使用 TLS 时，网络抓包中还会看到加密后的 TLS 记录，而不是直接可读的请求。

## 完整 Go 示例：让请求跑起来

下面是一个可以本机运行的一元调用。目录如下：

```text
grpc-demo/
├── proto/user.proto
├── server/main.go
└── client/main.go
```

### 1. 定义接口

`proto/user.proto`：

```protobuf
syntax = "proto3";

package user;
option go_package = "example.com/grpc-demo/proto;userpb";

service UserService {
  rpc GetUser (GetUserRequest) returns (GetUserResponse);
}

message GetUserRequest {
  int64 id = 1;
}

message GetUserResponse {
  int64 id = 1;
  string name = 2;
}
```

`= 1` 和 `= 2` 是 Protobuf 的字段编号，用于编码识别字段，不是默认值。演进接口时不要随意更改或复用旧编号。

### 2. 生成 Go 代码

先安装 [protoc](https://grpc.io/docs/protoc-installation/)，然后在项目目录执行：

```bash
go mod init example.com/grpc-demo
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
export PATH="$PATH:$(go env GOPATH)/bin"
protoc --go_out=. --go_opt=paths=source_relative \
  --go-grpc_out=. --go-grpc_opt=paths=source_relative proto/user.proto
go mod tidy
```

生成的 `user.pb.go` 负责消息类型与编码；`user_grpc.pb.go` 提供客户端和服务端接口。`go_package` 必须与实际模块路径一致。

### 3. 实现服务端

`server/main.go`：

```go
package main

import (
    "context"
    "log"
    "net"

    userpb "example.com/grpc-demo/proto"
    "google.golang.org/grpc"
)

type userServer struct {
    userpb.UnimplementedUserServiceServer
}

func (s *userServer) GetUser(ctx context.Context, req *userpb.GetUserRequest) (*userpb.GetUserResponse, error) {
    return &userpb.GetUserResponse{Id: req.GetId(), Name: "Lee"}, nil
}

func main() {
    listener, err := net.Listen("tcp", "127.0.0.1:50051")
    if err != nil { log.Fatal(err) }
    server := grpc.NewServer()
    userpb.RegisterUserServiceServer(server, &userServer{})
    log.Println("gRPC 监听 127.0.0.1:50051")
    if err := server.Serve(listener); err != nil { log.Fatal(err) }
}
```

### 4. 调用客户端

`client/main.go`：

```go
package main

import (
    "context"
    "log"
    "time"

    userpb "example.com/grpc-demo/proto"
    "google.golang.org/grpc"
    "google.golang.org/grpc/credentials/insecure"
)

func main() {
    conn, err := grpc.NewClient("localhost:50051", grpc.WithTransportCredentials(insecure.NewCredentials()))
    if err != nil { log.Fatal(err) }
    defer conn.Close()

    client := userpb.NewUserServiceClient(conn)
    ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
    defer cancel()
    user, err := client.GetUser(ctx, &userpb.GetUserRequest{Id: 1001})
    if err != nil { log.Fatal(err) }
    log.Printf("用户 ID=%d，名称=%s", user.GetId(), user.GetName())
}
```

分别在两个终端运行：

```bash
go run ./server
go run ./client
```

预期客户端输出 `用户 ID=1001，名称=Lee`。示例只监听本机，`insecure` 用于本地演示；生产环境需要按实际部署配置 TLS、身份认证和权限控制。设置超时后客户端可能先收到超时，但不能据此断定服务端操作没有执行，写入接口需要考虑幂等。

## 四种通信方式

| 方式 | 数据方向 | 示例 |
| --- | --- | --- |
| 一元调用 | 一次请求 → 一次响应 | 查询用户 |
| 服务端流 | 一次请求 → 多次响应 | 订阅行情 |
| 客户端流 | 多次请求 → 一次响应 | 分批上传数据 |
| 双向流 | 双方各自发送多条消息 | 实时聊天 |

流式调用不是自动永久可靠的连接：断线重连、消息去重和恢复位置等仍需要结合业务设计。

## 常见问题

- <strong>HTTP 状态码 200 就一定成功吗？</strong> 不一定。gRPC 还有自己的状态码，例如 `NOT_FOUND`、`UNAVAILABLE` 和 `DEADLINE_EXCEEDED`，客户端应检查返回的 gRPC 错误。
- <strong>一定要每次重新建连接吗？</strong> 不需要。通常复用客户端连接，具体生命周期由应用管理。
- <strong>能直接用浏览器访问吗？</strong> 标准 gRPC 与普通网页请求不同；浏览器场景一般使用 gRPC-Web 或通过网关转换。
- <strong>适合所有接口吗？</strong> 服务间强类型接口、跨语言调用和流式通信比较适合；公开 HTTP API、简单调试和现有 REST 集成也需要考虑团队习惯。

## 参考资料

- [gRPC over HTTP/2 协议格式](https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md)
- [gRPC 官方介绍与架构图](https://grpc.io/docs/what-is-grpc/introduction/)
- [gRPC Go 快速开始](https://grpc.io/docs/languages/go/quickstart/)
- [gRPC 核心概念](https://grpc.io/docs/what-is-grpc/core-concepts/)
- [gRPC 状态码](https://grpc.io/docs/guides/status-codes/)
- [Protocol Buffers 官方文档](https://protobuf.dev/overview/)
