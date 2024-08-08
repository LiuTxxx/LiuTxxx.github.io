---
title: WebUI Installation
date: 2024-07-29T15:43:27+08:00
type: posts
description: Installation steps of WebUI for Stable Diffusion.
resources:
  - name: featured-image
    src: 911.jpg
tags:
  - Installation
  - WebUI
  - AI
  - Stable Diffusion
categories:
  - Tutorial
collections:
  - Stable Diffusion WebUI
---
## Introduction

Stable Diffusion (SD) is a powerful opensource AI-based generative model that excels at creating high-quality images from text descriptions. However, source code of SD is not quite user-friendly, imposes a significant learning burden on those who have not studied programming.

Thanks to the strong open-source community, various convenient tools and plugins for using SD quickly emerged, and the [WebUI](https://github.com/AUTOMATIC1111/stable-diffusion-webui) developed by AUTOMATIC1111 was undoubtedly one of the most powerful tools at the time.

## Prerequisite

1. Python 3.10.6 and Git etc.:

   * Windows: download and run installers for Python 3.10.6 (**Add to PATH**) ([webpage](https://www.python.org/downloads/release/python-3106/), [exe](https://www.python.org/ftp/python/3.10.6/python-3.10.6-amd64.exe), or [win7 version](https://github.com/adang1345/PythonWin7/raw/master/3.10.6/python-3.10.6-amd64-full.exe)) and git ([webpage](https://git-scm.com/download/win))
2. Code from this repository:

   - preferred way: using git: `git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git`.
     - This way is preferred because it lets you update by just running `git pull`.

   * alternative way: use the "Code" (green button) -> "Download ZIP" option on the main page of the repo.
     - To update, you'll have to download zip again and replace files.

## Installation

### Use Release

1. Download `sd.webui.zip` from [v1.0.0-pre](https://github.com/AUTOMATIC1111/stable-diffusion-webui/releases/tag/v1.0.0-pre) and extract its contents.
2. Run `update.bat`.
3. Run `run.bat`.

### Or source code

1. Download the stable-diffusion-webui repository, for example by running `git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git`.
2. Run `webui-user.bat` from Windows Explorer as normal, non-administrator, user.

**TODO**: Add installation guide on linux.
