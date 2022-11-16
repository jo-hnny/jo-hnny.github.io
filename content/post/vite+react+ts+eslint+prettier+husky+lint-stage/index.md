---
title: "Vite+react+ts+eslint+prettier+husky+lint Stage"
description:
date: 2022-11-16T19:39:40+08:00
draft: true
image: https://picsum.photos/seed/1668598780/4096/2160
categories:
  - 编程
tags:
---

# vite + react + ts + eslint + prettier + husky + lint-stage

## 初始化项目

`npm create vite@latest`

## 安装 eslint

`npm i eslint -D`

## 初始化 eslint

`./node_modules/.bin/eslint --init`

## 添加补充

`npm i eslint-config-airbnb-typescript -D`

## 安装 prettier

`npm i prettier eslint-plugin-prettier eslint-config-prettier -D `

## .eslintrc.json 最终配置

```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "plugin:react/recommended",
    "airbnb",
    "airbnb-typescript",
    "plugin:react/jsx-runtime",
    "plugin:prettier/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json",
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["react", "@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-shadow": "off"
  }
}
```

## 安装 husky _commitlint_ _lint-staged_

`npm i husky lint-staged @commitlint/{config-conventional,cli} -D`

`npx husky add .husky/pre-commit "npx lint-staged"`

`npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'`

添加`.commitlintrc.json`

```json
{
  "extends": ["@commitlint/config-conventional"]
}
```

添加 lint-staged 配置到 package.json

```json
{
  "lint-staged": {
    "src/**/*.{ts,tsx}": ["prettier --write", "eslint --fix --quiet"]
  }
}
```

## 最后提交测试一下 是否有 eslint 和自动修复以及对 commit message 的校验
