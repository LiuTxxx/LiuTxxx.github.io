---
title: WebUI 使用教程
date: 2024-08-08T21:38:22+0800
type: posts
description: 
resources:
  - name: featured-image
    src: 911.jpg
tags:
  - WebUI
  - 使用教程
categories:
  - 教程类
collections:
  - WebUI

---







文生图

画面是先扩散再降噪生成图片

提示词，用词组，不用句子，逗号分隔，每次生成都不一样，随机性

可以提供具体提示词慢慢完善

标签的顺序对生成结果有影响，越靠前越优先。

以下为内容性提示词

![image-20240808214814508](C:\Users\liut0\AppData\Roaming\Typora\typora-user-images\image-20240808214814508.png)

以下是标准化提示词

  ![image-20240808214946171](C:\Users\liut0\AppData\Roaming\Typora\typora-user-images\image-20240808214946171.png)

以下是小模版

![image-20240808215040109](C:\Users\liut0\AppData\Roaming\Typora\typora-user-images\image-20240808215040109.png)

提示词权重，用于增强或削弱某个提示词

1. 直接在括号里指定权重：(prompt:1.5),
2. (prompt) 一层1.1倍，{prompt}一层1.05倍，[prompt]一层0.9倍 
3. 避免权重太高，推荐$1\pm0.5$  ，太高会扭曲画面
4. 如果权重不够用，尽量用同类词加强
5. 还有词条混合、迁移、迭代

![image-20240808215618115](C:\Users\liut0\AppData\Roaming\Typora\typora-user-images\image-20240808215618115.png)

负面/反向提示词

通常使用标准化提示词，防止画面质量差或者色彩单调或错误生成

![image-20240808215700803](C:\Users\liut0\AppData\Roaming\Typora\typora-user-images\image-20240808215700803.png)

出图参数

画面闪一下迭代一步，步数大于20之后，提升不大

采样方法（不同插件？）

分辨率，高更清晰，太高一个是很慢，且可能多人多手多脚

推荐低分辨率生成，然后再高清修复

面部修复推荐选上，平铺不推荐

提示词相关性，7~12推荐

随机种子

用批次和次数来抽卡，单批多张不建议

提示词的偷鸡方法

翻译大法

借助工具

atoolbox.net/Tool.php?id=1101

ai.dawnmark.cn/

抄作业，在模型网站上抄

hugging face civitai liblibai

openart.ai

arthub.ai



图生图

原理：参考图，作为提示词

除常规页面，还有一个上传图片的位置

重绘幅度，越高越ai原创，0.6-0.8

提示词最好清晰，并且带上标准化提示词

比例最好和原图一样

同一个随机种子，相似性会高，循环按钮可以使用上一次的随机种子

图生图的应用：拟人化、精细调节画面、动漫转真人、商业产品图、乱画让ai细化





模型加载

模型是针对某个类型的图片深度学习之后的打包

提示词+模型+参数，才能产出你想要的东西

checkpoint检查点或者关键点，类似于训练到某个程度的存档，ckpt

safetensors，简化的模型？使模型可靠搞笑而专门开发

放在models/stable-diffusion文件夹

在sd左上角模型中选择新的模型

vae，variational auto encoder 变分自解码器，负责将假造后的浅空间数据转化为图像。类似于调色滤镜

没有vae可能会发灰发白，有些ckpt自带vae。后缀是pt或safetensors

放在model/VAE

hypernetwok 画面微调

优化画风的 embeddings

固定特定人物角色特征的LoRA Low-Rank Adaptation

除了官方的模型，还有些私炉模型，官炉有版权限制，私炉更牛

训练ai学习图片生成模型叫做炼丹

模型网站

hugging face

civitai，抄作业网站

trained是一手模型，merge是融合模型

base model是炼丹的底模

模型分类：二次元、真实、2.5D

![image-20240808224003950](C:\Users\liut0\AppData\Roaming\Typora\typora-user-images\image-20240808224003950.png)

![image-20240808224020790](C:\Users\liut0\AppData\Roaming\Typora\typora-user-images\image-20240808224020790.png)

二次元

![image-20240808224130138](C:\Users\liut0\AppData\Roaming\Typora\typora-user-images\image-20240808224130138.png)



提高分辨率和质量

高清修复、超分辨率

真人在低分时会出现模糊的情况，需要使用高清修复

修复次数=采样步数

重绘幅度，最好不超过0.5

潜空间？

高清修复不能突破显存限制，可以尝试固定随机种子

降低重绘幅度会让ai少加戏

放大算法：

![image-20240808224931126](C:\Users\liut0\AppData\Roaming\Typora\typora-user-images\image-20240808224931126.png) 

没啥差异？gan对细节保留更好



SD upscale

图库浏览器点图生图，方便很多

脚本加载sd放大

重叠像素？

切成四块，重叠像素可以让四块衔接更丝滑，越多越丝滑，要增大图片尺寸



附加功能放大算法

重绘幅度为0的放大

可以两个算法，可见度可调，没有前两种细腻，但用起来简单





进阶模型

checkpoint是最大的模型，类似于大字典

embeddings lora hypernetwork controlnet lycoris

embeddings文本嵌入 嵌入式向量

很小，类似于一个书签，指向某个字词的含义，让ai更好理解特定形象

基于某个角色的特定训练

目录/embeddings

使用方式是在提示词加上某个东西

charTurner easyNegative

反推提示词，clip deepbooru



LoRA low rank adaptation 低秩适应模型

对某个特定角色的详细介绍，比embedding更细致有效

目录/models/lora

提示词框用文件名触发<lora: 文件名>

0.5-0.8，保留特征且对画面画风影响较小





hypernetwork 超网络 ，和lora差不多，用于画风

目录/models/hypernetwork

在设置-附加网络选中hypernetwork使用





局部重绘

某个地方没画好时用于修复

图库中点击局部重绘

重绘幅度0.7-0.8？

蒙版 mask 

蒙版模糊，没有模糊拼接很生硬



in paint sketch

可以使用画笔，画笔可以指定颜色，要在提示词也说清楚，给一些权重

蒙版透明度，颜色在画面中的呈现程度



in paint upload

上传一个图，然后上传一个蒙版





插件/拓展

![image-20240809134559905](C:\Users\liut0\AppData\Roaming\Typora\typora-user-images\image-20240809134559905.png)

链接下载，官方整合下载automatic1111，下包放进目录/extensions





lora是什么

lora需要配合触发词，达到最好效果

目录/models/lora

<lora :文件名:权重>

用additional，不显示在提示词，可以用模板、肢体动作等

用lora 赛博coser

有针对单独角色

也有针对某种审美、画风

也有针对某种特定类型、形式、概念

gacha splash

anime tarot card art style

mugshot lora

mugshot

lottalewds’ thisisfine

也有针对服饰类型的

mecha 机甲

![image-20240809150114549](C:\Users\liut0\AppData\Roaming\Typora\typora-user-images\image-20240809150114549.png) 

hanfu

holographic cloths

也有针对某个特定物体元素

如产品图 产品设计

m4卡宾枪

food photography

product design

blue print

cyberhelmet，

物体和服饰，可以用于局部重绘

训练lora是新世界的大门

多个lora可以叠加使用







controlnet

对ai出图进行精准控制，降维打击

可以控制姿势等十几种

可以从预处理器提取出姿势信息

不与其他模型冲突，

参数介绍

control weight，决定呈现强度

starting/ending control step 生效的步数

姿势为例，仅模糊姿势，需要微调

五个例子

openpose 姿势

有对手、脸部表情的细化标注

depth 深度

场景深度，也可以用来刻画人物，能让姿势前后堆叠更精细，比单纯骨架更准，可以组合使用

canny 边缘检测 线稿

线稿图，勾勒线条能让出图更像原图，文字不变形

阈值越高越多线，但也会更杂乱

可以用于线稿上色，用上invert，反转线稿颜色， 白色是线稿，黑色是背景

softedge 柔和边缘

线稿，但是更模糊，能让输出更柔和，更有发挥空间

scribble 涂鸦乱花

自由奔放的描摹，灵魂画手功能





{{< admonition tip >}}
如果对本文有问题或发现错误，欢迎在评论区参与互动或发送邮件联系我！
{{< /admonition >}}
