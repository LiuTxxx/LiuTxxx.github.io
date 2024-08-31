---
title: braft Source Code Analysis
date: 2024-08-19T15:43:23+0800
type: posts
description: 
resources:
  - name: featured-image
    src: 911.jpg
tags:
  - braft
  - Raft
  - SMR
  - Consensus
categories:
  - Code Notes
collections:
  - CFT Consensus
---
## Introduction

braft [[1]](#1) is developed by Baidu, and it's an industrial-grade C++ implementation of RAFT consensus algorithm [[2]](#2) and replicated state machine based on brpc [[3]](#3). braft is designed and implemented for scenarios demanding for high workload and low overhead of latency, with the consideration for easy-to-understand concepts.



## Source Code Analysis

EINVAL: Invalid Argument.



what is pending in braft??

_pending_meta_queue what is this?

closure_queue for what?

butil??



two conf?

grant is to return a hint?



builtin service for what?



{{< admonition tip >}}
If you have any questions or find any errors, feel free to interact in the comments section or email me!
{{< /admonition >}}
