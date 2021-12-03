---
title: "Git创建空分支"
description:
date: 2021-12-03T15:21:17+08:00
draft: false
image: https://picsum.photos/seed/1638516077/4096/2160
categories:
  - 编程
  - 生活
tags:
---

# 问题

经常性的比如我们写了一个库，同时想搭建一个展示 demo 用的页面，这时候最理想的就是库是一个分支，demo 是一个分支，所以此时就有一个需求，希望可以创建一个空的分支，不含之前任何一个分支的文件以及 commit 记录。

# 解决方式

## 1、创建分支

`git checkout --orphan demo`

该命令会创建一个名为 demo 的分支，并且该分支下有前一个分支下的所有文件,但是不包含前一个分支的提交记录。

## 2、 删除文件

`git rm -rf .`

该命令会删除当前目录下的所有文件
