---
title: "实现拉格朗日插值算法"
date: 2019-09-18T21:10:50+08:00
draft: false
---

# 实现拉格朗日插值算法

之前做图片曲线调节的时候使用到了拉格朗日插值算法，主要参考了[维基百科](https://zh.wikipedia.org/wiki/%E6%8B%89%E6%A0%BC%E6%9C%97%E6%97%A5%E6%8F%92%E5%80%BC%E6%B3%95)，这里简单记录一下

## 什么是拉格朗日插值算法

![](https://raw.githubusercontent.com/johnny19941216/storage-room/master/img/20190918203302.png)

## 如何通过给定的有限点得到拉格朗日插值函数

![](https://raw.githubusercontent.com/johnny19941216/storage-room/master/img/20190918203320.png)

## 示例

![](https://raw.githubusercontent.com/johnny19941216/storage-room/master/img/20190918203341.png)

## 维基百科上交代的算是比较明白了，然后我们要做的就是用代码去实现这个算法了，下面给出我的实现

```javascript
const points = [
  [4, 10],
  [5, 5.25],
  [6, 1],
];

const getLa = (points) => {
  return (i) => {
    function la(points, index = 0) {
      if (index === points.length) return 0;

      const [x, y] = points[index];

      const up = points.reduce(
        (pre, [xn], upIndex) => (upIndex === index ? pre : pre * (i - xn)),
        1
      );

      const down = points.reduce(
        (pre, [xn], downIndex) => (downIndex === index ? pre : pre * (x - xn)),
        1
      );

      return y * (up / down) + la(points, index + 1);
    }

    return la(points);
  };
};

const laFn = getLa(points);

console.log(laFn(18)); // -11
```

我写这个的时候感觉难点倒是不在算法上，而是如何把算法转换为我们在程序中可用的函数
