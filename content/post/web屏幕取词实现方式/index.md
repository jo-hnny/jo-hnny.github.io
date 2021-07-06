---
title: "Web屏幕取词实现方式"
date: 2019-09-18T20:47:53+08:00
image: https://picsum.photos/seed/72184b95064c4307b47f42fcf2c85619/4096/2160
draft: false
---

前些天项目需求要实现屏幕取词，通过我的调研使用 range api 实现了这个功能，后来我又分析了扇贝的开放 api，了解了扇贝的屏幕取词实现方式，在这里总结一下。

## Range 方式

这是我在项目中实现屏幕取词的方式，其关键在于`document.caretRangeFromPoint(float x, float y)`方法，这个方法接收一个坐标，通过这个坐标生成一个 range 对象，通过这个 range 对象可以获取到当前点击的文本内容，以及当前点击的文本位置，我把这个实现方式封装成了一个包[theword](https://www.npmjs.com/package/theword)，已经上传到了 npm 仓库，下边通过代码分析一下：

```js
export default (event, regexp = /[a-zA-Z'’]/) => {
  // 监测一个字符是否是构成单词的字符
  const isWord = (str) => str && regexp.test(str);

  const { clientX, clientY } = event;

  // 通过一个点生成range
  const range = document.caretRangeFromPoint(clientX, clientY);

  // 点击的dome节点的文本内容
  const data = range.startContainer.data;

  // 点击的字符在文本中的位置
  const point = range.startOffset;

  if (!isWord(data[point])) return;

  let j = point - 1;
  let k = point + 1;
  let wordArr = [data[point]];

  // 从点击位置向前寻找符合构成单词条件的字符，直到遇到非构成单词的字符
  while (isWord(data[j])) {
    wordArr.unshift(data[j]);
    j--;
  }

  // 重新设置range开始的位置
  range.setStart(range.startContainer, j + 1);

  // // 从点击位置向后寻找符合构成单词条件的字符，直到遇到非构成单词的字符
  while (isWord(data[k])) {
    wordArr.push(data[k]);
    k++;
  }

  // 重新设置range结束的位置
  range.setEnd(range.endContainer, k);

  // 获取当前window下的选区，并且清空所有选区
  const s = window.getSelection();
  s.removeAllRanges();

  // 一开始使用了原始拖蓝效果表示选中，但是可定制性差，达不到UI想要的效果，所以注释掉了
  // s.addRange(range)

  const word = wordArr.join("");

  // 获取range的位置信息
  const rect = range.getBoundingClientRect();

  return {
    word,
    rect,
  };
};
```

最后通过这个方法，我们成功的获取到了点击的单词，以及该单词的位置信息，包括宽高、距离屏幕的位置，最后通过一个定位的 div 覆盖掉原先的单词，实现了选中效果。

## 分割文章的方式

这个其实就是拿到全篇文章，用空格将全文分割成单词构成的数组，然后循环生成 dom，给每个 dom 绑定点击事件；我一开始也是这么想的，但是当时觉得这个方法太暴力了，并且可能带来性能问题，当然我现在还是觉得它很暴力，但是它足够简单。

## 词组查询

扇贝的实现方式是还有一个接口会返回词组在文章中的位置，位置的表示是以该词组的起始单词和结束单词分别是第几个单词确定的，按照我的方法假如要实现词组查询功能，也是需要这么一个词组的接口，但是位置信息就应该是字符位置了。
