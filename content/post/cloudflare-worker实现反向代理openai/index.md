---
title: "Cloudflare Worker实现反向代理openai"
description:
date: 2023-03-16T11:20:33+08:00
draft: false
image: https://picsum.photos/seed/1678936833/4096/2160
categories:
  - 编程
  - 生活
tags:
---

因为想把 `chatGpt` 分享给不会翻墙的朋友使用, 然后在搜索方案的过程中就看到了 `cloudflare worker` 反代的方案，正好我有使用过 `cloudflare`，我也有一个闲置的域名，而且这个方案大杯、免费，很符合我的需求。

## 原理

`cloudflare worker` 就相当于一个云函数，你可以在云函数中监听请求事件，完了之后把请求转发到 `openai`，说到底就是 `openai` 被墙了，但是 `cloudflare worker` 没有被墙，但是也不准确，因为其实 `cloudflare worker` 域名也被墙了，但是 ip 没有，所以我们要自己准备一个域名.

## 将域名添加到 cloudflare

1. 进入首页，右侧选择`网站`，左侧点击`添加站点`
2. 输入你的域名，点击下一步
3. 选择 free 方案
4. 查看 dns 不做任何处理，直接下一步
5. 更改你的名称服务器，这里会给出两个名称服务器，复制之后到域名申请的地方替换 dns 解析地址，我的是腾讯云，直接找到域名，点击管理，dns 位置就可以修改了
6. 上一步骤完成后，点击完成，检查名称服务器, 正常情况很快就 OK 了。

## 新建 cloudflare worker

1. 回到首页，右侧点击`Workers`，左侧点击`创建服务`
2. 自定义一下你的服务名称，启动器选择`HTTP处理程序`,点击创建服务
3. 服务被创建好了，此时点击`快速编辑`
4. 此时出现代码编辑器,内容填充以下代码:

```javascript
const TELEGRAPH_URL = "https://api.openai.com";

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  url.host = TELEGRAPH_URL.replace(/^https?:\/\//, "");

  const modifiedRequest = new Request(url.toString(), {
    headers: request.headers,
    method: request.method,
    body: request.body,
    redirect: "follow",
  });

  const response = await fetch(modifiedRequest);
  const modifiedResponse = new Response(response.body, response);

  // 添加允许跨域访问的响应头
  modifiedResponse.headers.set("Access-Control-Allow-Origin", "*");

  return modifiedResponse;
}
```

5. 点击保存,在 worker 详情页面，选择触发器, 添加自定义域名，这时候把之前处理好的域名，填在这里

6. 现在 `openai` 的反向代理就搭建好了，可以使用了
