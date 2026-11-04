---
title: Go 结构体 Tag 怎么用？从 JSON 到反射读取
description: 通过 JSON、参数校验和反射示例，了解 Go 结构体 Tag 的写法、常见用途和注意事项。
postDesc: 一篇 Go 结构体 Tag 使用笔记，说明字段映射、omitempty、忽略字段和自定义标签。
date: 2025-07-02 12:00:00
updated: 2025-07-02 12:00:00
categories:
  - - 编程语言
tags:
  - Go
  - golang
  - 结构体
  - JSON
comments: false
permalink: archives/848ae335.html
---

写 Go 结构体时，经常会看到字段后面跟着一段反引号包住的内容：

```go
type User struct {
    UserID int64  `json:"user_id"`
    Name   string `json:"name"`
}
```

这里的 `json:"user_id"` 就是结构体字段的 **Tag（标签）**。它给字段附加一段元信息，让 JSON 编码器、校验库或者我们自己的程序决定如何处理这个字段。

Tag 本身不是业务逻辑：**写上标签，不代表 Go 会自动执行对应操作；只有使用它的库或代码读取并解释标签，才会产生效果。**

本文参考 [LearnKu：Go Tag 标签详解](https://learnku.com/articles/78000)，结合 Go 官方文档整理常见用法。

## 一、Tag 的基本写法

```go
type User struct {
    Name string `json:"name" form:"name"`
}
```

一个字段可以有多个标签，以空格分隔。每个标签通常使用 `key:"value"` 格式：

| 部分 | 含义 |
| --- | --- |
| 反引号 | 包住整个 Tag 字符串 |
| `json`、`form` | 标签的 key，不同的库读取不同的 key |
| `"name"` | 标签值，具体含义由对应库决定 |

例如 `encoding/json` 读取 `json`，Web 框架可能读取 `form`。标签值里的选项也由对应库解释，不能认为所有库的语法都一样。

## 二、最常见的用途：JSON 字段映射

下面是一个完整示例：

```go
package main

import (
    "encoding/json"
    "fmt"
    "os"
)

type User struct {
    UserID   int64  `json:"user_id"`
    Name     string `json:"name"`
    Password string `json:"-"`
}

func main() {
    user := User{UserID: 1001, Name: "Lee", Password: "secret"}
    data, err := json.Marshal(user)
    if err != nil {
        fmt.Fprintln(os.Stderr, "JSON 编码失败:", err)
        return
    }
    fmt.Println(string(data))
}
```

输出：

```json
{"user_id":1001,"name":"Lee"}
```

`UserID` 对外输出为 `user_id`；`json:"-"` 表示标准库忽略这个字段。反序列化时，JSON 中的 `user_id` 也可以映射回 `UserID`。敏感信息不应只依赖标签保护，还需要控制日志、数据库和其他输出方式。

## 三、`omitempty`：空值时不输出

```go
type Profile struct {
    Name  string `json:"name"`
    Email string `json:"email,omitempty"`
    Age   int    `json:"age,omitempty"`
}
```

对于 `encoding/json`，`omitempty` 会在编码时省略空值，例如空字符串、`false`、数值 `0`、`nil` 指针，以及长度为 0 的切片、映射或数组。

```go
profile := Profile{Name: "Lee"}
data, err := json.Marshal(profile)
if err != nil {
    return err
}
// 输出：{"name":"Lee"}
```

这里省略了 `email` 和 `age`。如果业务需要区分“没有传年龄”和“年龄明确为 0”，可以考虑使用 `*int`：`nil` 表示未提供，非 `nil` 指针即使指向 0 也能保留。具体请求校验规则仍需单独处理。

## 四、字段必须可导出

```go
type User struct {
    Name  string `json:"name"`
    email string `json:"email"`
}
```

`Name` 首字母大写，是导出字段；`email` 首字母小写，是未导出字段。标准库 JSON 不会因为写了标签就序列化未导出字段，所以上面的 `email` 不会出现在输出中。

## 五、通过反射读取自己的 Tag

```go
package main

import (
    "fmt"
    "reflect"
)

type User struct {
    Name string `json:"name" label:"用户名"`
}

func main() {
    field, ok := reflect.TypeOf(User{}).FieldByName("Name")
    if !ok {
        return
    }

    fmt.Println(field.Tag.Get("json"))  // name
    fmt.Println(field.Tag.Get("label")) // 用户名
    value, exists := field.Tag.Lookup("label")
    fmt.Println(value, exists) // 用户名 true
}
```

`Get` 适合直接取值；当需要区分“标签不存在”和“标签存在但值为空”时，用 `Lookup` 返回的布尔值判断。`label` 只是自定义元信息，只有自己写代码或使用支持它的库才有作用。

反射读取的是结构体的字段信息。传入 `reflect.TypeOf(&User{})` 时拿到的是指针类型，需要先用 `Elem()` 获取结构体类型；实际写通用工具时，还应先判断类型，避免直接调用造成 panic。

## 六、校验和数据库映射

同一个字段可以给不同的库提供不同的信息：

```go
type CreateUserRequest struct {
    Email string `json:"email" binding:"required,email"`
}

type UserModel struct {
    Email string `gorm:"column:email;not null"`
}
```

这里的 `binding` 是 Gin 参数绑定和校验相关的约定，`gorm` 是 GORM 的约定，**都不是 Go 内置的校验或数据库规则**。只定义结构体不会自动执行校验或修改数据库；还需要调用对应框架的绑定、校验或迁移功能。实际支持的选项及行为请以所用版本的文档为准。

## 七、容易忽略的细节

- 标签建议按 `key:"value"` 写，多个标签之间用空格；错误格式可能让库无法按预期读取，可用 `go vet` 检查常见格式问题。
- `json:"-"` 表示忽略；而 `json:"-,"` 表示 JSON 字段名就是 `-`，两者不同。
- `omitempty` 会省略数字 0 和 `false`，对“0 也是有效业务值”的字段要特别注意。
- Tag 是类型信息的一部分，不能在运行时像普通字段那样直接修改；读取反射和标签解析也不是完全没有成本，是否需要优化应以实际测量为准。
- 不同库对 Tag 的解释不同。看见 `required` 等单词时，先确认是哪个库在读取、什么时候执行。

## 参考资料

- [LearnKu：Go Tag 标签详解](https://learnku.com/articles/78000)
- [Go 语言规范：结构体类型](https://go.dev/ref/spec#Struct_types)
- [Go reflect.StructTag](https://pkg.go.dev/reflect#StructTag)
- [Go encoding/json](https://pkg.go.dev/encoding/json#Marshal)
- [Gin：模型绑定与校验](https://gin-gonic.com/en/docs/examples/binding-and-validation/)
- [GORM：模型声明](https://gorm.io/docs/models.html)
