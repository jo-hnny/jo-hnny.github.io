---
title: "React项目中同时添加css Modules与普通class"
date: 2019-09-18T21:16:58+08:00
draft: false
---

当我在 react 项目中为一个元素添加了 css modules 的样式，但是由于我要使用 iconfont，必须在元素上添加一个名为 iconfont 的 class 名称，搜来搜去也没找到什么优雅的实现，那就按照 class 的本质实现吧，class 本质就是一个字符串，多个 class 名由空格分割，故:

```tsx
public render() {
    return (
      <div className={`${styles.uploader} iconfont`}>
        <input type="file" className={styles['file-input']} />
        &#xe7da;
      </div>
    )
  }
```

今天新发现一个库[classnames](https://github.com/JedWatson/classnames)可以很好的解决这个问题,使用如下：

```tsx
import classNames from "classnames";
import React, { Component } from "react";
import styles from "./index.module.scss";

export default class extends Component {
  public uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
  };

  public render() {
    return (
      <div className={classNames("iconfont", styles.uploader)}>
        <input
          type="file"
          accept="image/png, image/jpeg"
          multiple={true}
          className={styles["file-input"]}
          onChange={this.uploadImage}
        />
        &#xe81c;
      </div>
    );
  }
}
```
