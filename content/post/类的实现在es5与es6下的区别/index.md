---
title: "类的实现在es5与es6下的区别"
date: 2019-09-18T21:00:58+08:00
draft: false
---

写完标题就后悔了，es6 的 class 只是语法糖，那么我要想知道 es5 的类的实现不是应该去看 es6 的源码吗？虽然这样，但是我的例子都已经写完了，我还是 po 上来吧，回头再看看 es6 是怎么实现的。

## 首先看看 ES6 的 class

```js
class A {
  constructor(x) {
    // 构造函数
    this.x = x; // 为A的实例添加props属性
  }

  test() {
    // 给A的实例添加方法
    console.log("test 实例方法");
  }

  static test() {
    // 给A添加静态方法
    console.log("test 静态方法");
  }
}

A.som = 123; // 给A添加静态属性，这个有点low,为什么不是static som = 123

// 实现继承
class B extends A {
  constructor(x, y) {
    super(x);
    this.y = y;
  }
}

const b = new B(1, 2);

B.test(); // test 静态方法
b.test(); // test 实例方法
console.log(B.som); // 123
console.log(b.x); // 1
console.log(b.y); // 2
```

写起来很简单

## es5 的实现

```js
function A(x) {
  // 构造方法
  this.x = x; // 为A的实例添加props属性
}

A.prototype.test = function () {
  // 给A的实例添加方法
  console.log("test 实例方法");
};

A.test = function () {
  // 给A添加静态方法
  console.log("test 静态方法");
};

A.som = 123; // 给A添加静态属性

// 实现继承
function B(x, y) {
  A.apply(this, [x, y]); // 执行A的构造函数
  this.y = y;
}

// B.__proto__ = A // 继承A的静态方法,这样写eslint会报错，mdn说是会带来性能问题，但是我觉得好像不会，其它的资料都用的是对象遍历添加，感觉有点麻烦

// B.prototype.__proto__ = A.prototype // 继承A的实例方法，prototype也是一个对象，他也有__proto__

// 找到一个新方法，实质是一样的，但是eslint不报错，但是看了一下兼容性，safari不支持

Object.setPrototypeOf(B, A);

Object.setPrototypeOf(B.prototype, A.prototype);

const b = new B(1, 2);

B.test(); // test 静态方法
b.test(); // test 实例方法
console.log(B.som); // 123
console.log(b.x); // 1
console.log(b.y); // 2
```

略显复杂
