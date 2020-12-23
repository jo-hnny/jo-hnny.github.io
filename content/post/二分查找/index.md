---
title: "二分查找"
date: 2020-12-23T11:55:21+08:00
draft: true
---

## 循环

```typescript
function find2(data: number[], n) {
  let low = 0;
  let higth = data.length;
  let middleIndex = low + Math.floor((higth - low) / 2);

  let middleValue = data[middleIndex];

  while (n !== middleValue) {
    if (higth <= low) {
      return -1;
    }

    if (n < middleValue) {
      higth = middleIndex;
    } else {
      low = middleIndex;
    }

    middleIndex = low + Math.floor((higth - low) / 2);
    middleValue = data[middleIndex];
  }

  return middleIndex;
}

// test

const array = [...new Array(1000)].map((_, index) => index);
const n = 500;

console.log(find2(array, n));
```

## 递归

```typescript
// 二分查找 - 递归法
function find2(data: number[], n: number, preIndex: number = 0) {
  const len = data.length;

  if (len <= 0) {
    return -1;
  }

  const middleIndex = Math.floor(len / 2);

  const middleValue = data[middleIndex];

  if (n < middleValue) {
    return find2(data.slice(0, middleIndex), n, preIndex);
  }

  if (n === middleValue) {
    return preIndex + middleIndex;
  }

  if (n > middleValue) {
    return find2(
      data.slice(middleIndex + 1, len),
      n,
      preIndex + middleIndex + 1
    );
  }
}

// test

const array = [...new Array(1000)].map((_, index) => index);
const n = 500;

console.log(find2(array, n));
```
