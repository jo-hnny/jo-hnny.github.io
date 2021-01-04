---
title: "ZSH配置指南"
description:
date: 2021-01-04T10:39:16+08:00
draft: false
image: cover.jpg
categories:
  - 编程
tags:
  - ubuntu
  - zsh
  - ohmyzsh
  - shell
---

> 图摄于西湖

本文以 ubuntu18.0.4 为例

## 安装 ZSH

`sudo apt-get install zsh`

## 设置 ZSH 为默认 shell

`chsh -s $(which zsh)`

## 安装[ohmyzsh](https://ohmyz.sh/)

`sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`  
但是由于网络的问题，我总是遇到这个错误：  
`Failed to connect to raw.github.com port 443: Connection refused`  
所以我换了个方法，先把 ohmyzsh 的 GitHub 仓库克隆下来,然后再安装：

1. `git clone https://github.com/ohmyzsh/ohmyzsh.git`
2. `sh -c ohmyzsh/tools/install.sh`

## zsh 插件和主题配置

### 安装[spaceship](https://github.com/denysdovhan/spaceship-prompt)主题

1. `git clone https://github.com/denysdovhan/spaceship-prompt.git "$ZSH_CUSTOM/themes/spaceship-prompt" --depth=1`
2. `ln -s "$ZSH_CUSTOM/themes/spaceship-prompt/spaceship.zsh-theme" "$ZSH_CUSTOM/themes/spaceship.zsh-theme"`

### 安装[zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions)插件

这个插件主要作用是记录下历史命令，在你输入一部分时自动提示补全  
`git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions`

### 安装[zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting)插件

这个插件主要功能是高亮你输入的正确的命令  
`git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting`

### 最后配置.zshrc 文件

1. `vi ~/.zshrc`
2. `ZSH_THEME="spaceship"`
3. `plugins=(git zsh-autosuggestions zsh-syntax-highlighting)`
4. `source ~/.zshrc`

## 最后记录一下 ssh 登录 ubuntu root 所需要的一些配置

默认 ubuntu root 账号无法 ssh 连接，一开始不知道，死活连不上

### 设置 root 账户密码

`sudo passwd`  
按照提示输入并确认密码

### 修改 ssh 配置

1. 打开 ssh 配置 `sudo vi /etc/ssh/sshd_config`
2. 修改 `PermitRootLogin yes`
3. 重启 ssh `sudo service ssh restart`
4. 重新 ssh 连接 root 用户
