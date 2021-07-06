---
title: "冒泡排序与快排以及算法的时间复杂度"
date: 2019-09-18T21:10:17+08:00
image: https://picsum.photos/seed/2b71bb853ecf406b9f615b4d6f90b521/4096/2160
draft: false
---

# 简单的排序总是要会的嘛

推荐一个很好的 APP - 算法动画图解，以下解法都是参考该 APP 实现

## 冒泡排序

我不太好把 APP 的动画贴上来，大家可以自己搜索一下，但是主要的思想就是，从数组末位开始，依次和上一位两两比较，将较小的数交换到左边，那么第一轮下来之后，最左侧就是该数组最小的值，接下来重复之前的动作，将第二小的数字排在左侧倒数第二个，重复数组长度的次数之后即完成排序，下面是我的实现：

```javascript
// 定义一个工具函数，用于交换数组中两个位置的值
function exchange(list, index1, index2) {
  [list[index1], list[index2]] = [list[index2], list[index1]];
}

function bubbleSort(list) {
  let position = 0;

  const len = list.length;

  while (position < len) {
    for (let i = len - 1; i > position; i--) {
      if (list[i] < list[i - 1]) {
        exchange(list, i, i - 1);
      }
    }

    position++;
  }

  return list;
}
```

## 快速排序

顾名思义，该排序的特点就是快，主要思想就是从原始数组中取一个基准值，然后比此值大的都放到右边，小的都放左边，然后取基准值左边的和右边的各为新数组，重复之前的步骤，也就是一种递归，最后直至左侧、右侧都只有一个元素或者 0 个元素，我的实现如下：

```javascript
function quickSort(list) {
  const len = list.length;

  if (len < 2) return list;

  const left = [];
  const right = [];
  const basic = list[0];

  list
    .slice(1)
    .forEach((item) => (item >= basic ? right.push(item) : left.push(item)));

  return quickSort(left).concat(basic, quickSort(right));
}
```

## 算法时间复杂度

算法有好有坏，那么我们怎么衡量算法的好怀呢？这里就引入了时间复杂度的概念，比如上边的冒泡排序的时间复杂度为 O(n^2),而快排的时间复杂度则为 O(n\*Logn),那么这个复杂度到底是如何得来的,我在知乎上边找到一篇[回答](https://www.zhihu.com/question/21387264/answer/422323594)讲的很好
