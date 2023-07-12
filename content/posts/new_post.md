---
title: new_post
subtitle:
date: 2023-07-11T18:00:48+08:00
draft: false
author:
  name: df
  link: https://liutxxx.github.io/
  email: liut0130@gmail.com
  avatar: /favicon.ico
description:
keywords: 
license:
comment: false
weight: 0
tags:
  - draft
categories:
  - draft
hiddenFromHomePage: false
hiddenFromSearch: false
summary:
resources:
  - name: featured-image
    src: featured-image.jpg
  - name: featured-image-preview
    src: featured-image-preview.jpg
toc: true
math: false
lightgallery: false
password:
message:
repost:
  enable: true
  url:

# See details front matter: https://fixit.lruihao.cn/documentation/content-management/introduction/#front-matter

---



Learn to create a Hugo **FixIt** site in minutes.

The following steps are here to help you initialize your new website. If you don’t know Hugo at all, we strongly suggest you learn more about it by following this [great documentation for beginners](https://gohugo.io/getting-started/). Or if you already know Hugo, you can start directly with a template:

- [A quick-start template base on Git submodule](https://github.com/hugo-fixit/hugo-fixit-blog-git)
- [A quick-start template base on Hugo Modules](https://github.com/hugo-fixit/hugo-fixit-blog-go)

## Prerequisites

Thanks to the simplicity of Hugo, [Hugo](https://gohugo.io/) is the only dependency of this theme.

Just install latest version of [ Hugo extended edition(>= 0.109.0)](https://gohugo.io/getting-started/installing/) for your machine (**macOS**, **Linux**, **Windows**, **BSD**, and any machine that can run the Go compiler tool chain).

## Create a Site

Hugo provides a `new` command to create a new website:

```java
hugo new site my_website cd my_website
d
dd
d
d

```

## test heading 2

## Install the Theme

[The repository of FixIt themehttps://github.com/hugo-fixit/FixIt](https://github.com/hugo-fixit/FixIt)

Initialize an empty Git repository in the current directory.

Clone the [FixIt](https://github.com/hugo-fixit/FixIt) theme into the `themes` directory, adding it to your project as a [Git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules).

And later you can update the submodule in your site directory to the latest commit using this command:

## test heading 2

[The repository of FixIt themehttps://github.com/hugo-fixit/FixIt](https://github.com/hugo-fixit/FixIt)

Initialize an empty Git repository in the current directory.

Clone the [FixIt](https://github.com/hugo-fixit/FixIt) theme into the `themes` directory, adding it to your project as a [Git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules).

### test heading 3

some details





## Basic Configuration

The following is a basic configuration for the FixIt theme:

## Add Content

Here is the way to create your first post:

| `1 ` | `hugo new posts/first_post.md` |
| ---- | ------------------------------ |
|      |                                |

Hugo created the post file in the `content/posts` directory.

Open it with your editor and feel free to edit it by adding some sample content and replacing the title value in the beginning of the file.

```markdown
`--- title: My First Post date: 2023-02-20T20:14:22+08:00 draft: true --- A blog (a truncation of "weblog") is an informational website published on the World Wide Web consisting of discrete, often informal diary-style text entries (posts). Posts are typically displayed in reverse chronological order so that the most recent post appears first, at the top of the web page. Until 2009, blogs were usually the work of a single individual,[citation needed] occasionally of a small group, and often covered a single subject or topic. In the 2010s, "multi-author blogs" (MABs) emerged, featuring the writing of multiple authors and sometimes professionally edited. MABs from newspapers, other media outlets, universities, think tanks, advocacy groups, and similar institutions account for an increasing quantity of blog traffic. The rise of Twitter and other "microblogging" systems helps integrate MABs and single-author blogs into the news media. Blog can also be used as a verb, meaning to maintain or add content to a blog.`
```



Note

By default all posts and pages are created as a draft. If you want to render these pages, remove the property `draft: true` from the metadata, set the property `draft: false` or add `-D`/`--buildDrafts` parameter to `hugo` command in the following steps.

## Launching the Site

Save the file, then launch the website locally by using the following command:

| `1 ` | `hugo server` |
| ---- | ------------- |
|      |               |

Tip

When you run `hugo server`, when the contents of the files change, the page automatically refreshes with the changes.

Note

Since the theme use `.Scratch` in Hugo to implement some features, it is highly recommended that you add `--disableFastRender` parameter to `hugo server` command for the live preview of the page you are editing.

| `1 ` | `hugo server --disableFastRender` |
| ---- | --------------------------------- |
|      |                                   |

Go to `http://localhost:1313`.



[![Basic configuration preview](https://fixit.lruihao.cn/documentation/getting-started/basic-configuration-preview.png)](https://fixit.lruihao.cn/documentation/getting-started/basic-configuration-preview.png)Basic configuration preview



## Build the Site

When your site is ready to deploy, run the following command:

| `1 ` | `hugo` |
| ---- | ------ |
|      |        |

A `public` folder will be generated, containing all static content and assets for your website. It can now be deployed on any web server.

Most of our users deploy their sites using a CI/CD workflow, where a push[1](https://fixit.lruihao.cn/documentation/getting-started/#fn:1) to their GitHub or GitLab repository triggers a build and deployment. Popular providers include [Vercel](https://vercel.com/)[2](https://fixit.lruihao.cn/documentation/getting-started/#fn:2), [Netlify](https://www.netlify.com/)[3](https://fixit.lruihao.cn/documentation/getting-started/#fn:3), [AWS Amplify](https://aws.amazon.com/amplify/), [CloudCannon](https://cloudcannon.com/), [Cloudflare Pages](https://pages.cloudflare.com/), [GitHub Pages](https://pages.github.com/) and [GitLab Pages](https://docs.gitlab.com/ee/user/project/pages/).

Learn more in the [hosting and deployment](https://gohugo.io/hosting-and-deployment/) section.

## Ask for help