---
title: "Parcel简单试用"
date: 2019-09-18T21:11:32+08:00
draft: false
---

## 为什么要使用

有时候我想写个简单的 demo，但是我依然想要使用 ES6+的语法，还有 scss 以，node modules 包括一些其它的依赖，比如我要写 webgl 的 demo，我可能还需要引入一些 shader 文件，这个时候最先想到的肯定是 webpack 了，但是 webpack 的配置是真的麻烦，而我只是想写个 demo 而已，所以我把目光放到了 parcel 上，我 17 年就看到这货了，以为它能颠覆 webpack 呢，然并卵，我现在开始新项目还是得配置一大堆的 webpack 属性，但是在这种写个小 demo 的需求下，我想 parcel 应该能发挥它的价值。

## 开始

### 新建项目文件

```bash
mkdir webgl-demo
```

### 初始化项目

```bash
npm init -y
```

### 新建文件

![](https://raw.githubusercontent.com/johnny19941216/storage-room/master/img/20190918203412.png)

### 在 index.html 文件中引入 index.js 文件，然后其他的依赖我们都会在 index.js 文件中引入

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    <canvas></canvas>
    <script src="./index.js"></script>
  </body>
</html>
```

### 在 index.js 中编写代码，引入依赖,我这代码就不写了，引入一下依赖吧

```javascript
import fragShader from "./index.frag";
import vertShader from "./index.vert";

import "./index.scss";
```

### 安装 parcel,可以全局安装，也可以安装到项目，我这就安装到项目了,推荐安装到项目，这样不会别人拿去不知道怎么用

```bash
npm i parcel-bundler -D
```

### 启动项目，实际上我把它加到 npm script 里面了

```json
{
  "name": "webgl-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "parcel index.html",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "parcel-bundler": "^1.12.3"
  },
  "devDependencies": {
    "glslify-bundle": "^5.1.1",
    "glslify-deps": "^1.3.1"
  }
}
```

接着启动项目

```bash
npm start

```

它就这么跑起来了，我真的是有点惊讶，我以为起码要自己安装一下其他的 loader 什么的，但是完全不需要，它会自己根据文件后缀，自动安装 loader 什么的，反正你是真的什么配置文件都不用写。

## 结束

parcel 是真的强大，我以后终于可以随心所欲的写 demo 了，用我自己最喜欢的方式。
