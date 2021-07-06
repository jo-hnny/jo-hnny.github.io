---
title: "Husky@v7使用指南"
description:
date: 2021-07-06T14:24:51+08:00
draft: false
image: cover.jpg
categories:
  - 编程
tags:
  - npm
  - hooks
  - commit
  - husky
---

## 为什么有这篇文章

最近我为开源项目 `tkestack` 的前端控制台部分添加了对 commit 的 lint，在添加过程中遇到了一些困难和疑惑，在此记录一下

## v4 配置方式

### 安装 husky

```bash
npm i husky -D
```

### 添加配置

在 package.json 中添加如下配置

```json
//package.json
"lint-staged": {
    "./**/*.{ts,tsx,js,jsx}": [
      "eslint",
      "prettier --write"
    ]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
```

或者添加.huskyrc 文件

```json
// .huskyrc
{
  "hooks": {
    "pre-commit": "npm test"
  }
}
```

## v6+ 配置方式

第一次使用，按照 husky doc 进行配置

### 安装 husky

```bash
npm i husky -D
```

### 开启 Git hooks

```bash
npx husky install
```

执行到这里，我得到一个错误

```bash
npx husky install
.git can't be found (see https://git.io/Jc3F9)
```

可以推断出原因是这条命令需要在项目根目录执行。即`.git`所在的目录
tkestack 是一个前后端同在一个仓库的项目，目录结构如下

```
.
└── web
    └── console
```

我们现在在 console 目录，所以正确的方式应该是

```bash
cd ../../
npx husky install ./web/console/.husky
```

### 添加自动执行`husky install`的钩子

如果其他用户进行开发，显然我们是不希望他需要先阅读 husky 的文档，然后手动执行`npx husky install`的，所以我们添加一个 npm scripts 的钩子

```bash
npm set-script prepare "husky install"
```

由于目录的原因，对应的调整为

```bash
npm set-script prepare "cd ../../ && husky install ./web/console/.husky"
```

注意 ⚠️：`npm set-script` 只在 npm version 7.x 生效,如果你用的是 6.x 或者更低，还是手动在`package.json`中添加吧

现在查看`package.json` 应该可以看到

```json
// package.json
{
  "scripts": {
    "prepare": "cd ../../ && husky install ./web/console/.husky"
  }
}
```

### 添加我们的 hook

```bash
npx husky add .husky/pre-commit "lint-staged"
```

### 测试一下

修改一个文件使之不符合 eslint 规范，然后我们做一次提交

```bash
git add .
git commit 'test husky'
```

结果居然成功提交了，显然我们的 lint 没有生效

我们检查一下现在我们的 console 目录有哪些变化，会发现多了一个.husky 目录，目录下有一个`pre-commit`文件,文件内容如下：

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

lint-staged

```

大致可以猜测到当 pre-commit 时，实际是执行了这个 shell 脚本，由于我们的 lint-staged 并不是全局安装，在这里并不能执行
所以我们在 package.json 中添加一个 script

```json
// package.json
{
  "scripts": {
    "prepare": "cd ../../ && husky install",
    "pre-commit": "lint-staged"
  }
}
```

接着修改`.husky/pre-commit`文件

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run pre-commit

```

再尝试一下修改一个文件并提交

还是成功了，lint 依然没有生效，

查看文档可知`pre-commit`这个 shell 实际执行目录是在`.git`所在目录，所以接着修改`.husky/pre-commit`文件

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

cd ./web/console
npm run pre-commit

```

最后再次修改文件并 commit，终于可以看到命令行执行了`lint-staged`，lint 失败，commit 未成功

## 为什么从 v4 到 v6

很显然，v6 的配置 相比 v4 复杂了很多,那么为什么 husky 官方要修改之前的配置方式呢？
要了解这个问题之前我们先看一下 husky v4 的工作方式

### husky@v4 是如何运行的

首先 husky 在安装时会在 .git/hooks/ 目录安装所有可能会使用到的 hooks

比如当我们进行一次提交时，每个 git hook 检查我们有没有在 package.json 或者.huskyrc 中定义对应的钩子:

```bash
$ git commit

pre-commit (native) → husky/runner.js (node)
  → is a pre-commit defined in `.huskyrc.js`? → YES, run it

prepare-commit-msg (native) → husky/runner.js (node)
  → is a prepare-commit-msg defined in `.huskyrc.js`? → NO, do nothing

commit-msg (native) → husky/runner.js (node)
  → is a commit-msg defined in `.huskyrc.js`? → NO, do nothing

post-commit (native) → husky/runner.js (node)
  → is a post-commit defined in `.huskyrc.js`? → NO, do nothing
```

- 优点： 用户可以在配置文件中添加、更新、删除 hook，husky 会自动判断执行

- 缺点： 不管我们有没有配置 hook，所有的 git hook 都会执行一遍，包括执行 node husky/runner.js

### husky@v6 是如何运行的

2016 年，Git 2.9 引入了`core.hooksPath`，他使用户可以自定义 git hooks 的目录,在此之前，hooks 只能放在.git/hooks/目录下,然而.git 目录是不能提交的，但是现在配置`core.hooksPath`之后，比如 husky 使用`husky install` 配置 .husky/作为 git hooks 目录，我们可以提交.husky/目录作为项目的一部分。

- 优点：
  - 避免了创建和运行所有 git hooks
  - 现在 git hooks 和 husky 配置文件实际上是一个文件，方便管理
- 缺点：
  - 配置复杂繁琐

## 参考

[husky doc](https://typicode.github.io/husky)

[Why husky has dropped conventional JS config](https://blog.typicode.com/husky-git-hooks-javascript-config/)
