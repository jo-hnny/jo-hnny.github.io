---
title: "面试记录"
date: 2019-09-18T21:00:11+08:00
image: https://picsum.photos/seed/dced38d5da1f47a591d1011c5276f6b4/4096/2160
draft: false
---

这里主要记录一些我没有回答上来的面试题

## 1、作用域链

今天接到了一个电话面试，感觉回答的很不好，我对 css 尤其不太擅长，BFC 这个没答上来，其实之前是有看到过的，但是由于自己对 css 的不重视，导致没有关注。  
但是这篇文章要说的是作用域链，本来 js 算是我擅长的，这个没答上来实属不应该，就算我没关注这个概念，但是我应该知道它的正确情况的，就这么一个平时写代码觉得理所应当的东西，被问起来的时候我竟然答错了。

### 1.1、执行环境

执行环境定义了变量或函数有权访问的其他数据，每个执行环境都有一个与之关联的变量对象（variable object），环境中定义的变量和函数都保存在这个对象中，全局执行环境是最外层的一个执行环境，每个函数都有自己的执行环境，当执行流进入一个函数时，函数的环境就会被推入到一个环境栈中，当函数执行完毕，这个环境就会出栈并销毁，同时保存在其中的变量和函数也随之销毁，控制权交还给之前的执行环境。

### 1.2、作用域链

当代码在一个环境中执行时，会创建变量对象的一个作用域链，作用域链的最前端，始终是当前执行的代码所在环境的变量对象，如果这个环境是函数，则将其活动对象（activation object）作为变量对象，，活动对象最开始只有一个变量，即 arguments 对象，作用域链中的下一个变量对象来自外部环境，再下一个则来自外部环境的外部环境，直到末端全局执行环境，这就形成了一个作用域链。

### 1.3、活动对象

1、当调用函数时，首先创建一个活动对象
2、为活动对象添加一个类似数组的 arguments 对象  
3、将定义函数时所在的执行环境对应的作用域链复制到函数内部的`[[scope]]`属性上，把自己的活动对象推入作用域链的顶端  
4、之后发生由 ECMA-262 中所谓’活动对象’完成的’变量实例化’(Variable Instatiation)的过程

```
(1)、此时将函数的形参创建为活动对象(变量对象)的属性，如果调用函数时传递的参数与形式参数一致，则将相应参数值赋给这些属性，否则，会给属性赋 undefined 值。

(2)、将函数内部声明的所有局部变量创建为活动对象(变量对象)的属性，其值都被'预解析'为undefined值，以上两步完成活动对象(变量对象)保存变量的过程。

(3)、对于定义的内部函数，用声明的函数名innerMethod，为活动对象(变量对象)创建同名属性，而定义的内部函数则被创建为函数对象并指定给该属性，完成活动对象(变量对象)保存函数的过程。

注：在这个过程中，除了实际参数和函数声明有值外，其它都被'预解析'为undefined值。

注：对于(1)、(2)、(3)步骤的顺序，因为变量声明比函数声明的优先级高，变量声明优先于函数声明被提升，如果两者同名同时存在，后被提升的函数声明会覆盖先被提升的变量声明**(引用来源作者(2)、(3)顺序反了)**。

注：对于(2)，函数被赋值为函数定义的字符串，并不会对函数体中的JS代码做特殊处理(如运算等)，只是将函数体JS代码的扫描结果(字符串)保存在活动对象(变量对象)的与此函数名对应的属性上，在函数执行时再做进一步处理。

```

## 2、数组去重

这是一个很经典的问题，当然最简单的回答就是使用 Set

```js
const array = [1,2,3,2,4]
[... new Set(array)]
```

很明显面试官不想再听到这个回答，然后我说了另一种方式

```js
const array = [1, 2, 3, 2, 4];
array.reduce((targetAarr, item) => {
  if (!targetAarr.includes(item)) targetAarr.push(item);
  return targetAarr;
}, []);
```

然后面试官还想听到其他的方法，我就又说了一个对象键值对的方式

```js
const array = [1, 2, 3, 2, 4];
const targetObject = {};
array.forEach((item) => (targetObject[item] = item));
Object.keys(targetObject);
```

很明显这种方式有个问题，不能区分`'1'`和`1`
再问我，我说了可以先排序，再查看相邻项是否相同，代码实现大概是这个样子，这儿不得不说到 sort 方法传参的问题，我之前一直是有自定义 callback 来排序的，面试官问我如果不传参是什么情况，这个我还正没注意到原来可以不传参，当然我直觉是如果不传参，应该是从小到大排序，但是我不知道的东西当然不敢胡说，就直接回答了不知道，回来一看，不传参的话，元素按照转换为的字符串的各个字符的 Unicode 位点进行排序。

```js
const array = [1, 2, 3, 2, 4];
const targetArr = array.sort();
targetArr.forEach((item, index, arr) => {
  if (item === arr[index + 1]) arr.splice(index, 1);
});

console.log(targetArr);
```

说到这了，我再记录一下数组和字符串常常弄混的几个方法，之前每次用到这几个方法都会打开 mdn 的文档，虽然我觉得这样没什么，但是万一被问到了呢，我感觉我回答的时候好像就有说混了的。  
1、`Array.prototype.slice`:方法返回一个从开始到结束（不包括结束）选择的数组的一部分浅拷贝到一个新数组对象。且原始数组不会被修改。

```js
arr.slice();
// [0, end]

arr.slice(begin);
// [begin, end]

arr.slice(begin, end);
// [begin, end)
```

2、`Aarray.prototype.splice`:方法通过删除现有元素和/或添加新元素来更改一个数组的内容。

```js
array.splice(start)
// 删除start - end
array.splice(start, deleteCount)
// 从start开始，包括start，删除deletecount个元素

array.splice(start, deleteCount, item1, item2, ...)
// 删除元素，并且从start位置开始添加若干个元素
```

3、`String.prototype.slice`:方法提取一个字符串的一部分，并返回一新的字符串。不修改原字符串。

```js
str.slice(beginSlice[, endSlice])
```

`beginSlice`  
从该索引（以 0 为基数）处开始提取原字符串中的字符。如果值为负数，会被当做 sourceLength + beginSlice 看待，这里的 sourceLength 是字符串的长度 (例如， 如果 beginSlice 是 -3 则看作是: sourceLength - 3)  
`endSlice`  
可选。在该索引（以 0 为基数）处结束提取字符串。如果省略该参数，slice 会一直提取到字符串末尾。如果该参数为负数，则被看作是 sourceLength + endSlice，这里的 sourceLength 就是字符串的长度(例如，如果 endSlice 是 -3，则是, sourceLength - 3)。  
这么看的话其实他和 Array 的用法基本一样  
4、`String.prototype.split`:方法使用指定的分隔符字符串将一个 String 对象分割成字符串数组，以将字符串分隔为子字符串，以确定每个拆分的位置。  
`最后总结一下，Array和String都有slice方法，主要用来截取指定长度，Array有一个splice方法用来删除、添加元素，而String有一个slit方法用来把字符串分割成数组。`

## update 2018.03.23

## 3、Promise 返回值的问题

被面试官问到 promise 连续点 then，第二个点 then 会返回什么，我很自信的说如果自己不指定返回值的话是 resolve 的值，事实上我错了：

```js
Promise.resolve(1)
  .then((rsp) => console.log(rsp)) // 1
  .then((rsp) => console.log(rsp)); // undefined
```

so then 函数 callback 接收的值应该是上一个 thencallback 返回的值。

## 4、自己实现一个 co

下面是我一个简单的实现，主要就是要做到不断的递归调用：

```js
function co(gn) {
  gn = gn();

  return new Promise((resolve, reject) => {
    next();

    function next(data) {
      const { done, value } = gn.next(data);
      if (done) return resolve(value);
      value.then((rsp) => next(rsp)).catch((err) => reject(err));
    }
  });
}

function* test() {
  const a = yield Promise.resolve(1);
  const b = yield Promise.resolve(2);
  return a + b;
}

co(test)
  .then((rsp) => console.log(rsp)) // 3
  .catch((err) => console.log(err));
```

建议这种问题最好能让上机写一下代码，让我干想和在纸上写实在是有点困难。

## 5、prototype 的问题

现在才回想起来自己全说错了，当时还信誓旦旦，真是羞愧,都是自己的惯性思维，没有注意到这次是直接修改了 prototype 的指向,说到底还是对象引用的问题

```js
function A() {}

function B() {
  this.hello = "hello";
}

var a = new A();
A.prototype = new B();
var a1 = new A();

console.log(a.hello); // undefined
console.log(a1.hello); // hello
```

现在一看，感觉这次面试又凉了。

## 6、如何定义一个真正的常量

大家都知道 ES6 引入了 const 表示常量，但是大家也知道 const 并不能防止用户修改对象的属性，添加、删除属性，那么如何定义一个真正意义上的常量，这个并没有什么技术上的含量（当然我也试着从其他方面去实现，像是代理之类的，现在先不说），打开红宝书，翻到高级技巧-防篡改对象，在这里给大家介绍了几个对象的方法：

### 6.1、不可扩展对象-即无法为对象添加属性；

```js
var a = { name: "johnny" };

Object.preventExtensions(a);

a.age = 10;

console.log(a.age); // undefined

a.name = "saber";

console.log(a.name); // saber

delete a.name;
console.log(a.name); // undefined
```

### 6.2、密封的对象-不能添加、删除属性：

```js
var a = { name: "johnny" };

Object.seal(a);

a.age = 10;

console.log(a.age); // undefined

a.name = "saber";

console.log(a.name); // saber

delete a.name;
console.log(a.name); // saber
```

### 6.3、冻结的对象-无法添加、删除、修改属性，真正的常量：

```js
var a = { name: "johnny" };

Object.freeze(a);

a.age = 10;

console.log(a.age); // undefined

a.name = "saber";

console.log(a.name); // johnny

delete a.name;
console.log(a.name); // johnny
```

上面添加、删除、修改操作在非严格模式下为不生效，在严格模式下会报错，建议大家开启严格模式。
