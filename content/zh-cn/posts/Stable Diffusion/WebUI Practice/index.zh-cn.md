---
title: WebUI 日常练手记录
date: 2024-08-16T16:45:47+0800
type: posts
description: 
resources:
  - name: featured-image
    src: 911.jpg
tags:
  - 
categories:
  - 
collections:
  - 
---
## 简介

本文用作记录本人在日常学习WebUI [[1]](#1)时整个练手的过程，包括但不限于对各模型、各参数进行测试对比，尝试体验各种不同组合产生的效果，并记录期间心得体会与评论。



## 参数、功能试探

本阶段我大约会进行一下事务的尝试：

1. 尝试在Stable Diffusion v1.5的原版模型 [[2]](#2)、WebUI默认参数下尝试使用不同提示词改善画面要素，我会侧重于人像的测试，并逐步添加细化提示词让产出画面符合我的预期，在内容提示词完善之后，根据网上模板，测试正向标准化提示词以及反向标准化提示词对画面的作用。确定提示词之后，继续用于后续练手。
2. 同样在Stable Diffusion v1.5的原版模型下，对WebUI中基础的一些参数进行调节测试，看看效果如何。期间暂时不使用其他外挂的包括LoRA、VAE、CLIP等其他模型。总结参数调节对产出画面带来的影响，找到最合适或者说个人感觉最舒服的某个参数范围，并用作后续其他练手环节。
3. 继续第二步的内容，在提示词和参数完善之后，开始尝试进一步的功能，如简单尝试使用各类高清修复、refiner、Ultimate 3D upscaLer等功能，尝试将画面美化精进。



### 提示词效果测试

#### 内容性提示词

{< admonition note >}
这一部分将关注产出的内容，诸如画风、画面质量等暂且不讨论。
{< /admonition >}

**画面场景为：一个坐着看书的女孩**

首先将场景设定翻译成英文，并且断句成词，初步尝试（为控制变量，我固定了随机种子）：

```
# 正向提示词
A girl, sitting, reading,
```

![prompt1](/images/prompt1.png)

可以看到产出的图片都是小女孩，而我想要的是20岁左右的少女；并且可以看到背景稍微有点单一，场景也有些是在课桌上的，我想要的场景是女孩坐在客厅沙发上的感觉，因此加入以下提示词：

```
# 正向提示词
A girl, sitting, reading, 20 years old, on couch,
```

![prompt2](/images/prompt2.png)

这版的产出更加符合预期，但有些画面比较暗沉，感觉加点阳光洒下的感觉会更加唯美；同时，有些产出里表情并不好，我想要的是看着书微笑的女孩，因此继续加入以下提示词：

```
# 正向提示词
A girl, sitting, reading, 20 years old, on couch, sunlight, smile,
```

![prompt3](/images/prompt3.png)

画面崩坏的问题我们暂且不管，这个和标准化提示词有关，但对于人种、发型、姿势、服饰上我还是略微不太满意，并且角度上我想要的是正面的全景，因此继续细化提示词：

```
# 正向提示词
A girl, sitting, reading, 20 years old, on couch, sunlight, smile, head tilt, legs together, asian, long hair, wavy hair, silver hair, white dress, panorama, front view
```

![prompt4](/images/prompt4.png)

只能说原版模型确实对亚洲面孔并不友好，而且我的银发似乎一点都没有被接收到，因此我准备放弃亚洲面孔，改为白人、金发：

```
# 正向提示词
A girl, sitting, reading, 20 years old, on couch, sunlight, smile, head tilt, legs together, long hair, wavy hair, blonde hair, white, white dress, panorama, front view, 
```

![prompt5](/images/prompt5.png)

画面还是感觉有点奇怪，ai理解起来可能比较混乱，我试试重新组织一下提示词：

```
# 正向提示词
1 girl, sitting on couch, (reading book:1.2), white dress, 20 years old, sunlight, smile, long wavy hair, (blonde hair:1.2), front view, legs together, white race
```

![prompt6](/images/prompt6.png)

好吧没啥用，感觉是模型能力就这样了，但要素应该没啥要改的了

#### 标准化提示词

标准化提示词网上鱼龙混杂，感觉不如抄作业，除了通用的”高质量、无坏手脚”等，关于色调单调、无水印等可根据具体生成出来的效果自行调节使用，单独删除某些关于画质的提示词对画面实际的影响不大，加上也有时候并不会起作用，因此我就不对单独的某个词进行测试了。以下是我从nenly同学的课程 [[3]](#3) 上抄来的作业：

```
# 正向提示词
(masterpiece:1.2), best quality, highres, original, extremely detailed wallpaper, perfect lighting, 8k wallpaper, photorealistic, perfect face

# 反向提示词
NSFW, (worst quality:2), (low quality:2), (normal quality:2), lowres, ((monochrome)), ((grayscale)), skin spots, acnes, skinl blemishes, age spot, (ugly:1.331), (duplicate:1.331), (morbid:1.21), (mutilated:1.21), (tranny:1.331), mutated hands, (poorly drawn hands:1.5), blurry, (bad anatomy:1.21), (bad proportions:1.331), extra limbs, (disfigured:1.331), (missing arms:1.331), (extra legs:1.331), (fused fingers:1.61051), (too many fingers:1.61051), (unclear eyes:1.331), lowers, bad hands, 
missing fingers, extra digit,bad hands, (((extra arms and legs))), watermark, signature,
```

在看nenly实际使用这些提示词的时候，发现有些提示词是反复出现的，我也不太清楚是多次复用导致多次输入，还是为了进一步强调某个词的作用而故意添加的，但我把重复的都删了，因为感觉在模型限制之下，重复与否对画面的提升并不明显。

同时在我后续的学习中，如果我能接触到更多的关于标准化提示词

这里主要针对上面产出的场景，加上标准化提示词再输出一遍：

![prompt7](/images/prompt7.png)

好像有那么一点点用，但人物的脸和四肢还是出现了崩坏的情况，不过仔细看，整体画面的色调、清晰度、细节都有些微的提升。我感觉提示词更多还是辅助的作用，能稍稍控制SD的发挥，但还是会受到模型本身的限制，后续使用其他微调过或是更强大的模型的时候应该能明显感觉到质量上的差距。



### 简单参数调试测试

这一步主要侧重于对一些简单参数的调节，使用附带质量提示词的完整提示词测试产出效果。

#### 采样迭代步数 (Steps)

采样迭代步数的可调节范围为1-150，为尽量控制变量，我将固定随机种子进行测试。我测试了步数为1-50的时的产出，同时为了结果更详尽，我在更高步数的范围里，离散地测试了60, 80, 100, 125, 150五个步数的产出，完整的图片结果可以在我的github中查看。

根据这一版测试的结果显示，步数在1-3步时都较为模糊，且1和2之间变化非常小，当来到4时模糊会有明显消失，随后开始逐渐出现细节。当步数来到10时，已经有几张图片质量不错了，到了大概17、18步的样子，大多数图片都开始收敛，后续步数变化会变小，这也是为什么默认的步数被设置在20。

以下分别为步数1-15和16-30的gif展示：

![step1-15](/images/step1-15.gif "step1-15")

![step16-30](/images/step16-30.gif "step16-30")

但是，并非步数高质量就一定好，首先可能存在的情况是图片收敛之后继续迭代带来的效果会比较不明显，如一些扭曲模糊的部位并不会因为继续迭代而变的更好，但时间开销却会继续增大。如下图，左为20步右为40步。

![step stable](/images/step stable.png)

其次是也有出现步数高的情况下，某一步突然出现局部崩坏的情况，因此在出图时如果某个步数并不理想，可以试试当前步数前后一步的效果。如下图，左为42步右为43步。

![step mutate](/images/step mutate.png)

甚至，在步数特别高的时候，会带来更严重且“稳定”的崩坏。如下图，步数分别为20, 60, 150。

![step high](/images/step high.png)

根据测试，我们可以大致判断，一张图片应当会在某个步数之后收敛，随后小幅度的波动，因此有时候并不一定需要更高步数来继续提升质量，如果图片仍然存在质量问题，更有可能是模型的能力出现了上限或是提示词不合适造成的，这个时候应当调整其他的参数或更换模型来解决问题。

#### 采样器 (Sampler)

将步数设置为15-40，步长为5，随机种子不变，测试不同采样器带来的效果。随机种子的选取应该对采样器效果还是有影响的，但我没有去找出每个采样器适配的随机种子，就采用之前一直用的随即种子进行了测试。

这里发现不同采样器甚至会导致相同随机种子生成完全不同的图片，对比出来效果并不太明显，后续等练手到了LoRA和ControlNet能使得出图内容、人物、姿势更加稳定后，将再次对采样器进行对比。

因为我是用批量生成的，所以没有对比单个采样器在生成时间上的差异，本次仅简单总结采样器大致效果差异。

{< admonition note >}
针对WebUI目前支持的20种采样器，我按顺序分成3批进行测试，并没有根据采样器之间的关联分组。
{< /admonition >}

![sampler1](/images/sampler1.png)

第一批测试的结果来看DPM++ 2M在人像上会有更高的稳定性，相较于其他的采样器崩坏的程度更低，并且可以看到这个采样器似乎也有更稳定的收敛，DPM++ 2S a次之，而其他的采样器或多或少质量都偏差一些，而且有明显的收敛不稳定情况，甚至出现画面内容大幅变动的情况。这一批里感觉能用的只有DPM++ 2M。

![sampler2](/images/sampler2.png)

在第二批测试里，可以看到大多出图结果都和DPM++ 2M相似，DDIM略有偏差，DDIM CFG++和Euler a风格上就与其他的采样器有较大差异，并且质量也一般，但是这一批整体都有不错的收敛，不会像上一批一样有画面内容大幅变动的情况。对比之下在这一批当中，Euler的脸部处理似乎比DPM++ 2M还要再好一点，而LMS、Heun效果与DPM++ 2M齐平，Restart有少部分崩坏。Euler a到后面甚至有点偏动画风，可能更适合用来生成动画图片。

![samplerx](/images/samplerx.png)

不过在闹闹不闹的视频 [[4]](#4) 里出现了LMS画面整个崩掉的情况，在我这次测试中并没有发生。

![sampler3](/images/sampler3.png)

第三批测试结果中，DPM2与DPM2++ 2M有十分类似的产出，面部效果比较相似，但多出手臂的情况比DPM2++ 2M略多，DMP2 a效果不太稳定，但似乎手指的处理会相较于其他更加合理。DMP fast收敛似乎比其他采样器会更慢，从名字上听可能这个采样器速度更快？PLMS和UniPC在和DPM2++ 2M有齐平的脸部水平的情况下，对手指的处理要好上很多。LCM画面有大幅变动，但产出的质量很高，似乎适用于动画风格。而DPM adaptive则有非常稳定的产出效果，虽然与其他采样器画面不同，但在人脸处于侧脸且较小的情况下没有出现严重崩坏。

以上三批测试并不全面，固定的随机种子可能会利好其中某些采样器，并且仅针对原版SD1.5模型，当模型改变或加入其他附加网络时，可能会有采样器的适用与不适用，针对不同的情况应当选择不同适合的采样器多次实验，同时也需要多次抽卡，确保找到合适的随机种子。

#### 噪声调度器类型 (Schedule type)

测试方法与采样器一样，随机种子没变，采用DPM++ 2M作为采样器，分成两批测试。

![schedule1](/images/schedule1.png)

![schedule2](/images/schedule2.png)

两批测试下来，对步数20的图片进行对比，会发现会出现两种类别的脸部，并且不同调度器似乎对手上的书的形状会有影响，DDIM似乎对手指处理更好，到了40步时，差异就会比较细微了。

这个对比我的感想不过，但既然有自动这个选项，那应该维持默认使用自动就好了。

#### 提示词相关性 (CFG Scale)

随机种子没变，采用DPM++ 2M作为采样器，分别测试步数为20和30时，相关性从1-30（步长0.5）变化的结果。

因为没有会员，gif只能连续制作15张图，就不放gif了，有兴趣的就去github看吧。

CFG Scale越低，AI就会越放飞自我，而越高则会越收到限制，大概是这么个关系。

从我看到的感受来说，Scale过于低的时候，像1-5，会有很严重的画面崩坏，如下图1.0时的样子：

![scale1](/images/scale1.png)

到了6以上画面会稳定很多，WebUI默认的是7，但我发现往后一段甚至到12、13左右，对画面都还是有优化的，不过再往后调，画面崩坏的情况又会开始，并且到了20左右往后，画面会有点过饱和，颜色非常鲜艳，对比度很高，甚至到了奇怪的地步，并且崩坏也会加剧。如下图28.0的样子：

![scale2](/images/scale2.png)

但整体趋势还是渐变，不会像step一样出现某一部爆炸的情况，所以调的时候可以二分。

#### 生成批次和每批数量

这个没什么好说的，就是批量出图抽卡用的。

经测试发现，只要固定随机种子，不管是增加批次还是增加每批数量，出来的图按顺序排布都是一样的，每次生成出来的第x张会是同一张内容，但重启过WebUI之后好像会变？不知道是不是我自己的问题。

### 进阶功能

#### Refiner

这个功能我发现是组合两个模型用的，切换时机就是前后两个模型的分割点，这个应该就是在你同时想要两个模型的效果的时候用，我这里还没体验到别的模型，就先不细写了，但我测了一下麦橘写实 [[5]](#5)，生成出来和这个1.5的基础模型简直就不是一个量级，就不吐槽了。

#### 高清修复

其实就是放大功能，体验一下里面的参数吧：

##### 放大倍率

这个没啥好说的吧，就是尺寸长款的倍率，我就固定倍率为2继续后面的测试吧。

##### 放大算法

![upscale1](/images/upscale1.png)

![upscale2](/images/upscale2.png)

![upscale3](/images/upscale3.png)

说实话我这张图本来就太崩了，实在是看不出来什么，但全部放大算法的手都崩了，而且错的非常相似，然后还有几个算法不能用，但据说高清修复没有Ultimate 3D upscaLer好用，我就不仔细看了。有兴趣的可以参考这篇文章 [[6]](#6)，对高清修复和其他几种方法都有介绍，还算详细。

##### 重设高分迭代步数

就是高清修复的步数，据说是是没啥用。

##### 重绘幅度

重绘幅度就是和原图的差异大小，最好不超过0.5，毕竟高清修复一般不会想要画面有太大变化。对比各算法其实差异不会太大，但是R-ESRGAN算法似乎会有不错的稳定性，当然也可以使用当前模型的作者推荐的算法。

#### Ultimate 3D upscaler和SD upscale

这几个和高清修复差不多，用法也很像，所以放在一起对比吧。

对比之下，同参数算法，感觉Ultimate 3D upscaler细节会更加好。如下图，分别为Ultimate、SD、高清修复。

![upscale4](/images/upscale4.png)

OK，到这位置这个基于基础模型的测试终于要结束了，这个1.5基础模型说实话不加附加网络的画生成效果实在是有点过于拉垮了，人物不美观暂且不说，画面崩坏还有点多，接下来终于可以体验一下牛逼的模型了。

## 模型体验

本阶段则会更注重于对不同模型的体验，广泛的使用不同的大模型、LoRA、ControlNet等其他功能，进行进一步的探索。对于每个模型，都将采用上阶段1-2步中产出的合适参数和提示词，并套用第3步中尝试的不同的进阶功能进行更广泛的探索。同时配合不同的模型，探索是否有更多样的玩法。

### 写实类模型

#### majic realistic 麦橘写实 [[5]](#5)







## References

<text id="1">[1]</a> [github](https://github.com/AUTOMATIC1111/stable-diffusion-webui) - AUTOMATIC1111. stable-diffusion-webui

<text id="2">[2]</a> [huggingface](https://huggingface.co/runwayml/stable-diffusion-v1-5) - runwayml. stable-diffusion-v1-5 (已被runway删除)

<text id="3">[3]</a> [bilibili](https://www.bilibili.com/video/BV12X4y1r7QB/?spm_id_from=333.999.0.0&vd_source=fc8f9636498149a595ddbed39119a849) - nenly同学. 20分钟搞懂Prompt与参数设置，你的AI绘画“咒语”学明白了吗？ | 零基础入门Stable Diffusion·保姆级新手教程 | Prompt关键词教学

<text id="4">[4]</a> [youtube](https://www.youtube.com/watch?v=b8thoOFfy7E) - 闹闹不闹. 【SD教程】20种 Sampling method 采样方法详解，直接出图对比 Stable Diffusion中哪个采样器最好？我的建议是...

<text id="5">[5]</a> [civitai](https://civitai.com/models/43331?modelVersionId=176425) - Merjic. majicMIX realistic 麦橘写实

<text id="6">[6]</a> [CSDN](https://blog.csdn.net/cxyxx12/article/details/137862226) - 程序员晓晓. AI绘画Stable DIffusion教程 | 如何利用 Stable Diffusion webui 将图片变得更清晰？全方位对比4种放大方法！

<text id="1">[4]</a>

<text id="1">[4]</a>

{< admonition tip >}
如果对本文有问题或发现错误，欢迎在评论区参与互动或发送邮件联系我！
{< /admonition >}
