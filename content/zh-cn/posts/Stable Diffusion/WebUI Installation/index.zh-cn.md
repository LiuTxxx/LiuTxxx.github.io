---
title: WebUI 安装教程
date: 2024-07-29T15:43:27+08:00
type: posts
description: 用于Stable Diffusion的WebUI安装步骤教程
resources:
  - name: featured-image
    src: 911.jpg
tags:
  - 安装教程
  - WebUI
  - AI
  - Stable Diffusion
categories:
  - 教程类
collections:
  - Stable Diffusion
---

## WebUI项目简介

Stable Diffusion (SD) 是一个强大的基于人工智能的开源生成模型，能够借助文本描述来创建高质量的图像。然而，SD的源码在使用上对用户并不友好，给那些没有学过编程的人带来了很大的学习负担。

得益于强大的开源社区，各种方便SD使用的工具和插件迅速涌现，AUTOMATIC1111开发的[WebUI](https://github.com/AUTOMATIC1111/stable-diffusion-webui)无疑是当时最强大的工具之一。

## 前期准备

1. 安装Python 3.10.6 以及 Git：

   * Windows系统：下载并运行Python 3.10.6（**需加入环境变量**）的安装包（[下载页](https://www.python.org/downloads/release/python-3106/)、[安装包](https://www.python.org/ftp/python/3.10.6/python-3.10.6-amd64.exe)、[win7 版本](https://github.com/adang1345/PythonWin7/raw/master/3.10.6/python-3.10.6-amd64-full.exe)) 以及Git（[下载页](https://git-scm.com/download/win)）。

2. 该仓库中的代码:

   - 优选方式：使用git：`git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git`.
     - 这种方法能直接 `git pull `对仓库进行更新。

   * 另外，还可以在github仓库页的Code一栏选择下载压缩包，并解压到指定位置。
     - 这种方法在更新时需要重下压缩包。



## 安装指南

#### 使用github中的发布版本

1. 下载release中版本为[v1.0.0-pre](https://github.com/AUTOMATIC1111/stable-diffusion-webui/releases/tag/v1.0.0-pre)的 `sd.webui.zip` 并解压至指定位置。
2. 运行文件夹中的`update.bat`。
3. 运行文件夹中的 `run.bat`。

#### 使用仓库的源码

1. 下载Code选项中的压缩包，或直接使用git克隆仓库 `git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git`.
2. 在**非**管理员模式下运行 `webui-user.bat`.



**TODO**: 加入linux系统下的安装指南。

