---
title: "学习RxJS"
date: 2019-09-18T20:58:39+08:00
draft: false
---

一直想学习一下 RxJS，从一开始学习 android 的时候就听说过 RxJAVA，但是之前每次都看不下去，不太清楚这个是干什么的。今天下定决心要好好看一看。

## 1、Observable (可观察对象)

RxJS 的核心概念就是观察者模式，也就是一个可观察对象会推送数据，一个观察者通过订阅接受这些数据，  
创建一个可观察对象

```js
var observable = Rx.Observable.create(function (observer) {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  setTimeout(() => {
    observer.next(4);
    observer.complete();
  }, 1000);
});
```

每个 next()会向外抛出一个数据

## 2、Observer (观察者)

观察者通过订阅来拉取可观察对象的数据。  
创建一个观察者

```js
var observer = {
  next: (x) => console.log("Observer got a next value: " + x),
  error: (err) => console.error("Observer got an error: " + err),
  complete: () => console.log("Observer got a complete notification"),
};
```

观察者对象中你可以省略某一个函数，另外观察者也可以只是一个函数，那么它对应的就是 next 通知的处理方法。

## 3、Subscription (订阅)

上边我们有了一个可观察对象和以一个可观察者，那么现在我们就需要使用订阅将他们联系起来

```js
var subscription = observable.subscribe(observer);
// Observer got a next value: 1
// Observer got a next value: 2
// Observer got a next value: 3
// Observer got a next value: 4
// Observer got a complete notification
```

当你订阅的时候，观察者就开始拉取数据了，同时会得到一个 Subscription 对象,它有一个`unsubscribe()`函数可以取消订阅，还有一个`add()`方法可以把另一个 Subscription 对象合并到自己身上，以及一个`remove(otherSubscription)` 方法，用来撤销一个已添加的子 Subscription。

上边就是 RxJS 的基本概念了，下边会讲一些其它的扩展

## 4、Subject (主体)

subject 即是 Observable，又是 Observer

### 作为 Observable（可观察对象）

```js
var subject = new Rx.Subject();

subject.subscribe({
  next: (v) => console.log("observerA: " + v),
});

subject.subscribe({
  next: (v) => console.log("observerB: " + v),
});

subject.next(1);
subject.next(2);

// 打印结果:

/*
observerA: 1
observerB: 1
observerA: 2
observerB: 2
*/
```

### 作为 Observer（观察者）

```js
var subject = new Rx.Subject();

subject.subscribe({
  next: (v) => console.log("observerA: " + v),
});
subject.subscribe({
  next: (v) => console.log("observerB: " + v),
});

var observable = Rx.Observable.from([1, 2, 3]);

observable.subscribe(subject); // 你可以提供一个 Subject 进行订阅

// 打印结果

/*
observerA: 1
observerB: 1
observerA: 2
observerB: 2
observerA: 3
observerB: 3
*/
```

### subject 的多播

多播这个我有点不知道怎么说，普通的 observable 是单播的，意思就是两个订阅是互不影响、独立的，一个订阅完毕之后再进行下一个订阅，但是 subject 是多播的，下边通过代码看一下他们的区别：

```js
// 普通observable单播
const { Observable, Subject } = require("rxjs");

const observable = Observable.create((observer) => {
  observer.next(1);
  observer.next(2);
});

observable.subscribe((k) => console.log("from observer a:", k));

observable.subscribe((k) => console.log("from observer b:", k));

// from observer a: 1
// from observer a: 2
// from observer b: 1
// from observer b: 2
```

可以通过打印结果看出来，两个订阅是独立的，先打印完了 a，再打印完了 b。

```js
const { Observable, Subject } = require("rxjs");

const subject = new Subject();

const observable = Observable.create((observer) => {
  observer.next(1);
  observer.next(2);
});

subject.subscribe((k) => console.log("from observer a:", k));

subject.subscribe((k) => console.log("from observer b:", k));

observable.subscribe(subject);

// from observer a: 1
// from observer b: 1
// from observer a: 2
// from observer b: 2
```

两个订阅是同时执行的。

另外 subject 还有几个变种，我回头再补充。

这一次的先讲到这吧，rxjs 的东西好多，头痛，下次更新 observable 的几种创建方法以及常用的操作符

## 5、今天补充 observable 的几种创建方法

### 来自一个或多个值

```js
Rx.Observable.of("foo", "bar");
```

### 来自数组

```js
Rx.Observable.from([1, 2, 3]);
```

### 来自事件

```js
Rx.Observable.fromEvent(document.querySelector("button"), "click");
```

### 来自 promise

```js
Rx.Observable.fromPromise(fetch("/users"));
```

### 来自回调函数

```js
// fs.exists = (path, cb(exists))
const exists = Rx.Observable.bindCallback(fs.exists);
exists("file.txt").subscribe((exists) =>
  console.log("Does file exist?", exists)
);
```

### 自己创建

一开始讲到得 observable 都是这种自己创建得。

```js
var myObservable = new Rx.Subject();
myObservable.subscribe((value) => console.log(value));
myObservable.next("foo");
```

```js
var myObservable = Rx.Observable.create((observer) => {
  observer.next("foo");
  setTimeout(() => observer.next("bar"), 1000);
});
myObservable.subscribe((value) => console.log(value));
```

## 6、操作符

`操作符是 Observable 类型上的方法，比如 .map(...)、.filter(...)、.merge(...)，等等。当操作符被调用时，它们不会改变已经存在的 Observable 实例。相反，它们返回一个新的 Observable ，它的 subscription 逻辑基于第一个 Observable 。`  
看着看着发现其实 RxJS 的操作符的概念很宽，并不止我一开始以为的`map`、`filter`这些东西，总的来说它把操作符分为了实例操作符和静态操作符，和 js 中的实例方法与静态方法的意思差不多。  
简单来说实例操作符就是`Observable`实例上的方法，比如`map`、`filter`，而静态操作符就是`Observable`上挂载的方法，比如各种创建 Observable 实例的方法`create`、`of`、`from`
