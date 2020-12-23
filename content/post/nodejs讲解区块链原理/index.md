---
title: "Nodejs讲解区块链原理"
date: 2019-09-18T20:53:59+08:00
draft: false
---

## 前言

今天在[YouTube](https://www.youtube.com/watch?v=zVqczFZr124&feature=youtu.be)上看到了一个系列视频，总共三集，讲解了怎么用 js 实现区块链，感觉浅显易懂，为了加深理解，凭着记忆和自己的理解再次自己实现一遍。  
代码总共实现了三个类，  
1、`Block`类用于生成区块实例，主要是存储信息，生成 hash；  
2、`BlockChain`类用于将区块添加到链上，以及暴露添加交易记录、挖矿、获取用户账户资金、校验区块链安全性等方法。  
3、`Transaction`类用于生成交易信息.

## 1、Block 类

区块链字面意思上理解就是区块构成的链，区块主要是存储着一些信息，其中不可或缺的有主体，即交易信息（当然本篇主要讲的是区块链货币，区块链也可能用于其他方面），
时间戳，即区块生成时间，上一个区块的哈希值，本区块的哈希值（由上一个区块的哈希与本区块的数据共同生成，这样，当上一个区块被修改，那么本区块的哈希也需要被修改，才能与上一个区块的哈希对应起来，这样的话修改信息的人需要修改往后所有区块的信息）。  
`其中值得注意的是在区块链中有一个挖矿的概念，这个挖矿就是通过计算使得本区快的哈希值满足预设的要求，比如说比特币就是要求生成的区块的哈希值的前几位是n个0，这个n就代表了挖矿的难度系数，比特币会随着比特币的产出不断加大这个难度系数，使得挖矿变的越来越难`

```js
class Block {
  /**
   *
   * @param {Number} timestamp 时间戳
   * @param {Array} transactions 交易信息
   * @param {String} preHash 上一个区块的哈希值
   * @param {Number} difficulty 难度系数
   */
  constructor(timestamp, transactions, preHash, difficulty) {
    Object.assign(this, {
      timestamp,
      transactions,
      preHash,
      hash: this.getHash(difficulty),
    });
  }

  getHash(difficulty) {
    let hash = "";
    let nonce = 0;

    do {
      const msg = `${this.timestamp}${JSON.stringify(this.data)}${nonce}`;

      hash = crypto.createHash("sha256").update(msg).digest("hex");

      nonce++;
    } while (hash.substr(0, difficulty) !== Array(difficulty).fill(0).join(""));

    return hash;
  }
}
```

## 2、BlockChain 类

BlockChain 类在生成实例的时候会把第一个元区块放入到链中，这个区块不存储任何有用的信息，
使用者可以向实例中添加交易信息，实例会把这些交易信息暂存起来，直到矿工开始挖矿，挖矿成功后所暂存的交易信息就被写入了新生成的区块中，同时给予矿工的奖励会暂存起来，直到下一个区块生成，矿工就算真的收到了奖励。

```js
class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];

    this.pendingTransactions = []; // 暂存交易信息的地方

    this.miningReward = 100; // 给与矿工的奖励

    this.difficulty = 3; // 难度系数
  }

  createGenesisBlock() {
    return new Block(Date.now(), [], 0, 1);
  }

  lastBlock() {
    return this.chain[this.chain.length - 1];
  }

  mine(miningRewardAddress) {
    const preHash = this.lastBlock().hash;
    const block = new Block(
      Date.now(),
      this.pendingTransactions,
      preHash,
      this.difficulty
    );
    this.chain.push(block);
    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];
  }

  createTransactions(transaction) {
    if (!this.isChainValid) return false;
    this.pendingTransactions.push(transaction);
  }

  isChainValid() {
    // 校验区块链是否未被修改
    const len = this.chain.length;
    for (let i = 1; i < len; i++) {
      const curBlock = this.chain[i];
      const preBlock = this.chain[i - 1];

      if (curBlock.hash !== curBlock.getHash()) return false;
      if (curBlock.preHash !== preBlock.hash) return false;
    }

    return true;
  }

  getBalanceOfAddress(address) {
    // 获得某个账户的余额
    let balance = 0;

    this.chain.forEach(({ transactions }) => {
      transactions.forEach(({ fromAddress, toAddress, amount }) => {
        if (fromAddress === address) balance -= amount;

        if (toAddress === address) balance += amount;
      });
    });

    return balance;
  }
}
```

## 3、Transaction 类

Transaction 类没什么好说的，就是生成交易信息。

```js
class Transaction {
  constructor(fromAddress, toAddress, amount) {
    Object.assign(this, {
      fromAddress,
      toAddress,
      amount,
    });
  }
}
```

## 后语

前言还是要搭一下后语的，上面只是用代码来讲了一下区块链的原理，真正的区块链细节要更加复杂，也还有其它的东西，比如说很重要的 p2p，对 p2p 还是很有兴趣的，后面有时间了再学习一下。  
另外，我还是很看好区块链的，它的作用远不止被用来圈钱割韭菜，我也买过 EOS，当然是亏了，但是我还是很看好它作为区块链平台的出发点。

## 添一个所有代码（代码不多就不新建仓库了）

```js
const crypto = require("crypto");

class Block {
  /**
   *
   * @param {Number} timestamp 时间戳
   * @param {Array} transactions 交易信息
   * @param {String} preHash 上一个区块的哈希值
   * @param {Number} difficulty 难度系数
   */
  constructor(timestamp, transactions, preHash, difficulty) {
    Object.assign(this, {
      timestamp,
      transactions,
      preHash,
      hash: this.getHash(difficulty),
    });
  }

  getHash(difficulty) {
    // 计算哈希直到满足要求
    let hash = "";
    let nonce = 0;

    do {
      const msg = `${this.timestamp}${JSON.stringify(this.data)}${nonce}`;

      hash = crypto.createHash("sha256").update(msg).digest("hex");

      nonce++;
    } while (hash.substr(0, difficulty) !== Array(difficulty).fill(0).join(""));

    return hash;
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];

    this.pendingTransactions = []; // 暂存交易信息的地方

    this.miningReward = 100; // 给与矿工的奖励

    this.difficulty = 3; // 难度系数
  }

  createGenesisBlock() {
    return new Block(Date.now(), [], 0, 1);
  }

  lastBlock() {
    return this.chain[this.chain.length - 1];
  }

  mine(miningRewardAddress) {
    const preHash = this.lastBlock().hash;
    const block = new Block(
      Date.now(),
      this.pendingTransactions,
      preHash,
      this.difficulty
    );
    this.chain.push(block);
    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];
  }

  createTransactions(transaction) {
    if (!this.isChainValid) return false;
    this.pendingTransactions.push(transaction);
  }

  isChainValid() {
    // 校验区块链是否未被修改
    const len = this.chain.length;
    for (let i = 1; i < len; i++) {
      const curBlock = this.chain[i];
      const preBlock = this.chain[i - 1];

      if (curBlock.hash !== curBlock.getHash()) return false;
      if (curBlock.preHash !== preBlock.hash) return false;
    }

    return true;
  }

  getBalanceOfAddress(address) {
    // 获得某个账户的余额
    let balance = 0;

    this.chain.forEach(({ transactions }) => {
      transactions.forEach(({ fromAddress, toAddress, amount }) => {
        if (fromAddress === address) balance -= amount;

        if (toAddress === address) balance += amount;
      });
    });

    return balance;
  }
}

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    Object.assign(this, {
      fromAddress,
      toAddress,
      amount,
    });
  }
}

const myChain = new BlockChain();

const tran1 = new Transaction("addr1", "addr2", 10);

myChain.createTransactions(tran1);

const tran2 = new Transaction("addr1", "addr2", 1);

myChain.createTransactions(tran2);

myChain.mine("myAddr");

myChain.mine("myAddr");

console.log(myChain.getBalanceOfAddress("myAddr"));
```
