---
title: "记一次webgl文本特效所踩的坑"
date: 2019-09-18T21:06:15+08:00
image: https://picsum.photos/seed/8b427e54cff84b0fbdfdce68b842a094/4096/2160
draft: false
---

## 前情

项目做的是视频渲染，也就是视频渲染到 webgl 上，同时加上一些转场特效，文本效果，之前的文本效果我是用 DIV 标签加上 css3 的 animation 定位到 canvas 区域实现的，本着能用 webgl 实现就用 webgl 实现的初衷最后决定文本效果也用 webgl 实现，大致思路就是得到文本的纹理，然后用 shader 处理纹理实现动效,遇到的坑主要来自得到纹理时的字体效果。

## 使用 svg 得到文本纹理

由于 svg 前后端通用，能够保持一致，故初步决定使用 svg 实现文本纹理，步骤也就是拼接上颜色、字体、字号的属性得到一个 svg 字符串，然后将字符串转为一个 blob 地址，把这个地址给图片，以此得到纹理。

## 字体不生效

这么做了之后发现其余的文本大小、颜色都没问题，就是字体不生效，最后经过研究得出初步结论，我们使用的只是一个 svg 字符，并不能和项目中 css 声明的 font-face 关联起来，要想字体生效，必须把字体用 base64 的形式内联到 svg 中。

## 说干就干

不就是 base64 嘛，经过我修改 webpack loader 配置，字体文件成功内联到 svg 中，但是妈呀，这个 svg 真他么的大，几十 M 的字符，页面加载要转老半天，如果以后支持字体越来越多，那这个肯定不行的，得改一下，我觉得 ajax 动态请求字体为 blob，然后转 base64，果然这个方案好多了，页面加载很快，没有影响，于是接着开搞，结果到了从图片到纹理这一步的时候线程直接阻塞了，视频播放到这的时候，我的进度指针总会卡上一秒左右，非常影响体验，应该是这个图片体积太大了，这就无解了啊，又要字体生效，又要文件小，办不到啊。

## 换方案

没办法这个是行不通了，换方案吧，好像也没什么能换的了，只剩 canvas 了，那就上吧，生成一个 canvas 元素，画上文本，设置字体颜色，嗯，完美。

## 离完美还差一根头发丝的距离

最后还是发现了一点问题，那就是一开始切换字体的时候并没有生效，但是切上几次就又生效了，经过我多年前端经验猜测，浏览器本着为用户节约资源的美好想法，总是等你确实用到了这个字体的时候才去加载字体，也就是 canvas 上用到这个字体的时候才去加载字体，但是 canvas 是要马上生成纹理的，它可等不了你，于是就出现了一开始不生效，后面又生效的状况，那就提前使用字体吧，于是我在最外层的 html 上加了一些文本，分别指定了使用的字体，然后 display：none，结果居然还是不管用，妈的，浏览器想太多了，由于 display：none 你也看不到，所以浏览器还是没去加载资源，so，改成了绝对定位，top： -1000px，再一试，哈哈，好了。

## 总结

svg 坑比较多，而且我对他并不熟悉，还是 canvas 比较可爱
