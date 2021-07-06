---
title: "基于mocha的nodejs单元测试"
date: 2019-09-18T21:01:55+08:00
image: https://picsum.photos/seed/ccbd0034a97a40f299bb27b18bf93999/4096/2160
draft: false
---

为了学习这个，我写了一个例子，主要是一个基于 koa 的 restful 服务，然后是基于 mocha、supertest 的测试文件。

## 1、首先需要安装依赖

`npm i supertest mocha chai --save-dev`

## 2、npm script

```json
[
  "scripts": {
    "start": "nodemon app.js",
    "test": "mocha"
  },
]
```

## 3、目录结构

Mocha 默认运行 test 子目录里面的测试脚本。所以，一般都会把测试脚本放在 test 目录里面，然后执行 mocha 就不需要参数了

## 4、编写测试文件

在我的项目中有一个关于 user 的 rest 接口，user 的数据模型大致如下：

```json
{
  "name": "wu",
  "age": 24,
  "likes": ["movie", "music"]
}
```

### 4.1、引入需要的模块

```js
const request = require("supertest")("http://127.0.0.1:3000"); //初始化supertest
const DB = require("../db");
const USERS = new DB("users");

const { expect } = require("chai"); // 引入chai的expect断言
```

关于`chai`的使用可以去官网查看，比较简单

### 4.2、describe

对测试进行描述,可以进行嵌套

```js
describe('users api', () => {

  describe('post: 新增一个用户', () => {

  })
}
```

### 4.3、钩子

`mocha`提供了四个钩子函数`before、 after、afterEach 和 beforeEach`。  
其中`before`钩子会在本区块的所有测试用例之前执行，`beforeEach`钩子会在本区快的每个测试用例之前执行，`after`与`afterEach`同理。  
比如我想在所有测试用例开始之前清空数据库中 USERS 的数据。

```js
describe('users api', () => {

 before(async () => {
    this.user = {
      name: 'walala',
      age: 8,
      likes: []
    }
    await USERS.clear()
  })

)
```

在这个钩子中我使用了`async`函数，你在下边也会看到使用 done 方法通知这个异步回调完成的方式，
Mocha 内置对 Promise 的支持，允许直接返回 Promise，等到它的状态改变，再执行断言，而不用显式调用 done 方法

### 4.4、it

`it`第一个参数是对预期结果的描述，第二个参数是一个 callback，是详细的测试行为。

```js
describe("users api", () => {
  before(async () => {
    this.user = {
      name: "walala",
      age: 8,
      likes: [],
    };
    await USERS.clear();
  });

  describe("post: 新增一个用户", () => {
    it("返回200状态码，以及一个包含新增用户id的对象", (done) => {
      request
        .post("/user")
        .send(this.user)
        .expect(200)
        .end((err, res) => {
          if (err) done(err);
          expect(res.body).to.have.property("id").equal(0);
          this.id = res.body.id;
          done();
        });
    });
  });

  describe("get: 获取用户", () => {
    it("返回状态码200， 以及用户对象", (done) => {
      request
        .get(`/user/${this.id}`)
        .expect(200)
        .end((err, res) => {
          if (err) done(err);
          expect(res.body).to.be.deep.equal(this.user);
          done();
        });
    });
  });

  describe("put: 修改", () => {
    before((done) => {
      this.user = {
        name: "walala",
        age: 28,
        likes: [],
      };
      done();
    });
    it("返回状态码200", (done) => {
      request.put(`/user/${this.id}`).send(this.user).expect(200).end(done);
    });
  });

  describe("getAll: 获取所有用户", () => {
    it("返回状态码200，以及包含用户对象的数组", (done) => {
      request
        .get(`/user`)
        .expect(200)
        .end((err, res) => {
          if (err) done(err);
          expect(res.body).to.be.deep.include(this.user);
          done();
        });
    });
  });

  describe("delete: 删除用户", () => {
    it("返回状态码200", (done) => {
      request.get(`/user`).expect(200).end(done);
    });
  });
});
```

## 5、运行测试

`npm start`  
`npm test`  
测试就完成了  
![测试完成](../images/mocha-end.png)
