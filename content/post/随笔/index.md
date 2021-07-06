---
title: "随笔"
date: 2019-09-18T20:50:02+08:00
image: https://picsum.photos/seed/a0fe4c2dd95249899623f35136c16e97/4096/2160
draft: false
---

## 1、得到一个固定长度的非空的数组

比如我需要一个数组，元素是 1-10，首先我不想用直接手写一个数组，以前的实现方式:

```js
new Array(10).fill(0).map((_, index) => ++index);
```

为什么要加个 fill 呢，是因为 Array 构造函数返回的数组都是空位，就是什么都没有，连 undefined 都不是，map 方法不生效。
es6 扩展运算符的写法：

```js
[...new Array(10)].map((_, index) => ++index);
```

扩展运算符会将空位都变成 undefined。

## 2、es6 - Symbol

好像没什么好说的，最大的特点就是唯一性，但是也感觉到了一个问题，用它作为属性名的时候，要想取出来必须使用这个 Symbol 值，那么跨模块的时候，其它模块想取出这个值，还必须把这个 Symbol 值抛出去。  
 又看到了`Symbol.for()`，好像能解决问题，但是总感觉哪不对

## 3、getter 与 setter

### getter

```js
var obj = {
  log: ["example", "test"],
  get latest() {
    if (this.log.length == 0) return undefined;
    return this.log[this.log.length - 1];
  },
};
console.log(obj.latest); // "test".
```

```js
var obj = {
  log: ["example", "test"],
  latest() {
    if (this.log.length == 0) return undefined;
    return this.log[this.log.length - 1];
  },
};
console.log(obj.latest());
```

### setter

```js
var language = {
  set current(name) {
    this.log.push(name);
  },
  log: [],
};

language.current = "EN";
console.log(language.log); // ['EN']

language.current = "FA";
console.log(language.log); // ['EN', 'FA']
```

```js
var language = {
  current(name) {
    this.log.push(name);
  },
  log: [],
};

language.current("EN");
console.log(language.log); // ['EN']

language.current("FA");
console.log(language.log); // ['EN', 'FA']
```

重要的是当取值、赋值时你可以通过`get`函数以及`set`函数做一些其它的事。

## 4、连续赋值存在的问题

```js
let a = {};

let b = a;

a.x = a = { n: 1 };

console.log(a.x); // undefined
console.log(b.x); // {n: 1}
```

不知道这段代码的结果有没有一点出人意料，原因就是在赋值之前，就已经确定了内存中的地址，然后才开始赋值

## 5、`yield*`的用法

看到了一个数组拍平的问题,其中`yield*`的作用就像是一个对其它 generator 函数的代理。

```js
const a = [1, [[2], 3, 4], 5];

function* flatten2(arr) {
  for (item of arr) {
    Array.isArray(item) ? yield* flatten2(item) : yield item;
  }
}

const numbers = flatten2(a);

console.log(numbers.next()); // 1

console.log(numbers.next()); // 2
```

## 6、实现自己的防抖函数

```js
const a = () => console.log("a");

const choke = (fn, timeout = 0) => {
  let start = 0;
  return () => {
    const now = Date.now();
    if (now - start > timeout) {
      start = now;
      return fn();
    }
  };
};

const b = choke(a, 1000);

b();
b();
```

## 7、自定义一个事件类

```js
class Event {
  constructor() {
    this.stack = {};
  }

  emit(eName, ...args) {
    if (this.stack[eName]) this.stack[eName].forEach((cb) => cb(...args));
  }

  on(eName, cb) {
    if (this.stack[eName]) return this.stack[eName].push(cb);
    this.stack[eName] = [cb];
  }

  off(eName, cb) {
    if (!this.stack[eName]) return;
    if (!cb) return delete this.stack[eName];
    this.stack[eName].forEach((acb, index) => {
      if (acb === cb) delete this.stack[eName][index];
    });
  }
}

const e = new Event();

e.on("click", (a) => console.log(a));

e.emit("click", 123);
```

## 8、egg 配合 dockers 使用时要把 scripts start 中的--demon 去掉。
