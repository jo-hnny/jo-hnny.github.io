---
title: "一些有趣的面试题"
description:
date: 2021-08-23T15:43:33+08:00
draft: true
image: https://picsum.photos/seed/1629704613/4096/2160
categories:
  - 编程
tags:
---

## 链式调用加睡眠

大概是这样，记不太清

```ts
function people(name: string) {
  // something
}

people("jo").eat("apple").sleep(1000).talk("something").sleep(500).eat("peach");
// console apple
// wait 1000ms
//console something
// wait 500ms
// console peach
```
