---
title: "模拟实现call和apply以及bind"
date: 2019-09-18T21:08:52+08:00
draft: false
---

## 模拟实现 call，apply 我就不写了，很相似

```javascript
Function.prototype.callMe = function (that, ...args) {
  that[this.name] = this;

  that[this.name](...args);
};
```

## 模拟实现 bind

```javascript
Function.prototype.bindMe = function (that, ...args) {
  that[this.name] = this;

  return function () {
    that[this.name](...args);
  };
};
```

## 总结

call 和 apply 都是为了改变函数在定义时原本的 this 指向，那么想想 this 的表现，始终指向调用自己的对象，我们要做的就是用 call 和 bind 提供的对象作为调用该函数的对象，即把该函数挂载为所提供对象的一个属性。
