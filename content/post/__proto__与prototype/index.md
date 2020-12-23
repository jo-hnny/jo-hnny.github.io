---
title: "__Proto__与prototype"
date: 2019-09-18T20:52:35+08:00
draft: false
---

之前也有看过资料，当时觉得明白了，但是时间一久就忘记了，一方面是平时工作中没有使用，另一方面是只是看，没有自己去思考，所以这次决定自己理一理。

## 首先看几个概念

### 1、`__proto__`原型对象

对象的`__proto__`指向创建它的构造函数的`prototype`,当你调用该对象的属性的时候，如果它自身没有这个属性，它会去`__proto__`上找这个属性

### 2、`prototype`

只有函数才有`prototype`属性，当你创建一个函数的时候，JS 会为这个函数添加`prototype`属性，值是一个有`constructor`属性的`对象`,(对象两个字很关键，这意味着这个对象也有`__proto__`属性,它指向创建它的构造函数即`Object`的`prototype`。)

## 接下来看看代码

```js
function A() {}

var a = new A();

console.log(A.__proto__ === Function.prototype); // true

console.log(a.__proto__ === A.prototype); // true

console.log(a.__proto__.__proto__ === Object.prototype); // true
```

然后同理我觉得下边的也应该成立

```js
console.log(Object.prototype.__proto__ === Object.prototype); // false
```

但是事实很不幸，得到的是 false.

```js
console.log(Object.prototype.__proto__); // null
```

打印一看是 null，然后再想想，其实 js 就是这样设计的而已，要不这个原型链不得没完没了了嘛,你想想有个对象找一个属性，它找到`Object.prototype`就应该到头了，要不它就会一直找下去，无尽循环。

## 然后我们看一个问题，就是`Function`与`Object`的问题

```js
console.log(Object.__proto__ === Function.prototype); // true

console.log(Function.__proto__ === Function.prototype); // true
```

可以看出`Object`是由`Function`构造出来的，而`Function`是由`Function`自己构造出来的，这个听起来好奇怪，自己构造自己。

## `constructor`

下面再看看`prototype.constructor`

```js
function A() {}

var a = new A();

console.log(A.prototype.constructor === A); // true
```

函数的`prototype.constructor`指向了自己，除此之外，我目前还没发现这个有什么用。

```js
function A() {}

var a = new A();

console.log(A.prototype.constructor === A); // true

console.log(a.constructor === A); // true
```

找到一个说法

```
constructor属性不影响任何JavaScript的内部属性。instanceof检测对象的原型链，通常你是无法修改的（不过某些引擎通过私有的__proto__属性暴露出来）。constructor其实没有什么用处，只是JavaScript语言设计的历史遗留物。由于constructor属性是可以变更的，所以未必真的指向对象的构造函数，只是一个提示。不过，从编程习惯上，我们应该尽量让对象的constructor指向其构造函数，以维持这个惯例。

作者：贺师俊
链接：https://www.zhihu.com/question/19951896/answer/13457869
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```
