---
title: "在scss和css_module环境中切换主题"
date: 2020-12-23T11:41:47+08:00
draft: false
---

## 今天尝试在项目中完成切换主题的功能，目前已经实现，故做个记录

1. 新建一个 scss 文件保存颜色配置，例如：

```scss
// themes.scss

$themes: (
  light: (
    main: #364f6b,
    second: #3fc1c9,
    third: #f5f5f5,
    fourth: #fc5185,
  ),
  dark: (
    main: #e4f9f5,
    second: #30e3ca,
    third: #11999e,
    fourth: #40514e,
  ),
);
```

2. 新建另一个 scss 文件，创建 mixin：

```scss
// themify.scss
@import "./themes.scss";

@mixin themify($themes: $themes) {
  @each $theme, $map in $themes {
    :global(.theme-#{$theme}) & {
      $theme-map: () !global;
      @each $key, $submap in $map {
        $value: map-get(map-get($themes, $theme), "#{$key}");
        $theme-map: map-merge(
          $theme-map,
          (
            $key: $value,
          )
        ) !global;
      }

      @content;
      $theme-map: null !global;
    }
  }
}

@function themed($key) {
  @return map-get($theme-map, $key);
}
```

3. 使用：

```scss
@import "../../assets/styles/themify.scss";

.header {
  width: 100%;
  height: 60px;
  padding: 0 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  @include themify {
    background-color: themed("main");
    color: themed("third");
  }
}
```

4. 最后：

```typescript
import React, { useState } from "react";
import styles from "./app.module.scss";
import classNames from "classnames";

import { Header } from "./components/header";

enum Themes {
  Light = "light",

  Dark = "dark",
}

function App() {
  const [theme, setTheme] = useState<Themes>(Themes.Light);

  function toggleTheme() {
    setTheme(theme === Themes.Light ? Themes.Dark : Themes.Light);
  }

  return (
    <div className={classNames(styles.app, `theme-${theme}`)}>
      <Header toogleTheme={toggleTheme} />
    </div>
  );
}

export default App;
```
