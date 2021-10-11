---
title: "Github Page 自动化部署action"
description:
date: 2021-10-11T16:11:59+08:00
draft: false
image: https://picsum.photos/seed/1633939919/4096/2160
categories:
  - 编程
  - 生活
tags:
---

## 记录一下我常用的一套 github-page 自动化部署 actions

```yml
name: CI
on: push
jobs:
  deploy:
    runs-on: ubuntu-18.04
    steps:
      - name: Git checkout
        uses: actions/checkout@v2

      - name: Setup NodeJS
        uses: actions/setup-node@v2
        with:
          node-version: "14"

      - name: Build
        run: |
          npm install
          npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          personal_token: ${{ secrets.TOKEN }}
          publish_dir: ./dist
```

其中 secrets.TOKEN 为 自己创建的 [Personal access tokens](https://github.com/settings/tokens),创建成功之后将其添加到目标项目的 Settings/secrets 下
