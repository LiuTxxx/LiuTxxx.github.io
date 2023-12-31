---
title: Beego 安装及配置
date: 2022-08-31T09:32:44+08:00
tags:
  - Beego
  - Go
categories:
  - Go
resources:
  - name: featured-image
    src: images/featured-image.png
---

记录 GO 及 Beego 框架安装及基础配置。

<!--more-->

## 安装 Go
{{< admonition info >}}
`vue-fullscreen` 插件处理弹窗等元素在全屏模式下不可见问题的方案是通过 `teleport` 修饰符将目标元素移动到 `document.body` 下，从而避免层级遮挡问题。个人不太喜欢这种改变 DOM 结构的方式，所以封装的插件新增一个参数 `bodyAgent`，当设置为 `true` 时，会使用 `document.body` 代理全屏元素，目标元素则改为网页全屏，此时 `document.fullscreenElement` 为 `document.body` 而不是真实设置的 `target` 元素。
{{< /admonition >}}
1. 官网下载安装包：<https://golang.google.cn/dl/>
2. 通过二进制文件快速安装，默认安装目录：`/usr/local/go`
3. 配置环境变量 `vim ~/.bash_profile`

   ```bash
   # golang
   export GOROOT=/usr/local/go
   export GOBIN=$GOROOT/bin
   export PATH=$PATH:$GOBIN
   export GOPATH=$HOME/go
   export GOPROXY=https://goproxy.cn
   # Go work bin
   export PATH=$PATH:$GOPATH/bin
   ```

## 安装 Beego

- [Beego repository](https://github.com/beego/beego)
- [Beego docs](https://beego.vip/)
- [Beego new docs](https://beego.gocn.vip/)

Beego 的安装需要在新建项目且 `go mod init <module_name>`之后，在项目下执行，具体参考 [beego#quick-start](https://github.com/beego/beego#quick-start)。

## 安装 bee

- [bee repository](https://github.com/beego/bee)

> 注意：arm64 架构的 mac (M1 ～系列)，下载安装 bee 时最好，使用 Rosetta 打开终端，不然无法下载 `darwin_arm64` 的依赖，如果已经安装了，可以使用 Rosetta 打开终端后，运行 `bee update` 升级，升级完后将终端复原。

bee 工具安装，`go install` 安裝指定版本的 bee 工具，例如：

```bash
go install github.com/beego/bee/v2@latest
```

安装成功后，可以在 `$GOPATH/bin` 下看到 `bee` 的可执行文件。

检验 bee 工具是否安装成功：

```bash
bee version
```

创建一个新的 Beego 项目

```bash
bee new hello
cd hello
go mod tidy
bee run
```