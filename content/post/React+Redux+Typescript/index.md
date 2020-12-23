---
title: "(译)React+Redux+Typescript"
date: 2019-09-18T21:14:23+08:00
draft: false
image: cover.jpg
categories:
  - 编程
tags:
  - typescript
  - react
  - redux
---

# React + Redux + TypeScript - 成为更好的前端（教程）

我在开始构建 React 应用，但是我希望我的应用有一个好的构建方式，这是我在 Medium 上看到的一篇不错的教程，为了方便我理解，顺便学英语，翻译在此，英语版的可以[点击查看原文](https://medium.com/swinginc/react-redux-typescript-into-the-better-frontend-tutorial-d32f46e97995)

构建一个满意的 React 应用程序是比较困难的（主要是比较难找到一份 React 的最佳实践，这点 Angular 还是很优秀的，但是我喜欢 jsx）。当你掌握了 VirtualDOM 的概念以及框架是如何工作的时候，你会很快意识到单单使用 React 本身不足以构建比 TODO-LIST 更大的应用。这个时候你开始学习使用类似 Flux 这样的 store 架构，比如说应用最广泛的 Redux，很快你会沉没在 actions 和 reducers 中，并且你开始在保持数据分离上遇到更多的困难，这听起来你是不是很熟悉？

在本文中，我将介绍如何构建一个可扩展的应用程序，再看接下里的内容之前，我希望你已经明白 React 是如何工作的，并且对 Flux 或者 Redux 有一点了解。

本文是我由 2018 年 7 月 25 日 SwingDev 在 microConf 大会上的演讲整理而成的书面版本。更多的信息可以点击[microconf.io](http://www.microconf.io/).

## 为什么要使用 Store

如果你已经使用 React 编写过一个小的应用程序，那么你会发现好像少了些什么。

假设我们正在创建由两个主要组件构成的简单应用：包含所有电子邮件列表的**侧边栏组件**和显示当前所选电子邮件内容的**内容组件**。单击侧边栏的元素时，我们使用路由来更改页面的 URL 并将电子邮件的 ID 放在其中。但是我们需要在内容组件中获取到电子邮件的具体内容，即使侧边栏组件中已经存在该数据，我们依然无法在他的兄弟组件中获取到该数据。

你也许已经想到，我们可以把数据移动到父组件（包含了侧边栏组件和内容组件）来解决这个问题，但是这会产生许多潜在的问题和瓶颈。首先我们需要从父组件传递数据到子组件，并且将所有数据处理逻辑放到父组件中（例如删除邮件）。

使用 Flux 架构有助于解决这两个问题，它抽象了存储数据和操作数据（即 actions）的逻辑，并且提供了简单的方法将数据传递给需要它的组件（即 Redux 中的 connect 函数）。

## Store 架构 101（101 是什么梗,我还特意搜了一下，好像是初级的意思，大概就是 Store 架构初级教程吧）

Store 架构是一个初级的概念，但是如果你以前从未听说，它可能听起来很奇怪，下图很好的描述了它：

![](https://raw.githubusercontent.com/johnny19941216/storage-room/master/img/20190918203459.png)

我们不再将所有数据保存到组件中，而是使用唯一的全局 Store 作为我们的事实上的数据来源。

它定义了整个 UI，保存了所有动态数据-包括来自服务器的以及用户和应用的内部状态，我们基于这个 store 来构建我们的应用。

当用户触发了一个操作 =》 比如在页面上点击一个按钮 =》 调用 Action（Action 是一个简单的对象，仅包含一个表明 action 类型的 type 属性和可选的补充数据）=》action 会发送到 reducer（一个具有单一作用的函数，它依据 action 和旧的 state 生成一个新的 state，比如用户点击按钮新创建了一封邮件，reducer 就会把新邮件添加到旧的邮件列表中，生成一个新的邮件列表，当然，reducer 返回的是一个完整的 state，邮件列表包含在其中）=》新的 store 传递给组件 =》组件相应的更新 UI

## TypeScript + React = ❤️

Angular 开发者默认使用 TypeScript 作为开发语言。React 应用仍然主要使用 javascript 开发，使用强类型语言可能会在一开始使得开发变得复杂，但是如果你按照规则使用，则会在后续的开发中给你带来极大的作用。我们在本文中构建 的应用程序使用 Typescript 进行开发，以表明在 Typescript 的帮助下重构 Redux store 是多么容易。

将 TypeScript 与 React 一起使用可以从多方面获益。除了使用类型化语言的常见好处之外（您可以[在此处](https://atomicobject.com/resources/oo-programming/object-oriented-typing)阅读更多相关信息），在编写 React 项目时您可以轻松输入 Props 和 State，比如你使用一个组件时，IDE 会提示该组件所需要的所有 props，如果你忘记了添加组件需要的必须属性，Typescript 也会提醒你（确实会避免很多低级错误，往往这种低级 bug 最为致命，浪费极多的时间）。

但是不仅如此，使用 Typescript 扩展 Redux 还有更多的好处，你的 store 键入就是其中之一，你无须点击跳转到 Reducer 来推测 store 的数据结构，此外当你键入 action 或者 action 生成器（工厂模式）时不用猜测它们接收什么类型的参数。

让我们来写个示例：

```js
function searchAction(options) {
  return {
    type: ‘SEARCH’,
    ...options
  };
}
```

这是一个简单的 action 生成器，它接收 options 参数生成一个 type 为 SEARCH 的新 action，你能告诉我它到底要接收一个什么样的 options 吗？

没有任何提示我们到底要传递什么参数给它，你可能会找遍整个项目来搞明白 options 对象到底是个什么，但是很有可能你找遍整个项目还是不知道到底要传什么参数！（深有体会，有时候甚至需要打开开发者工具查看接口到底返回了什么，然后再去推导数据结构）

下面是重写为 Typescript 的版本，一眼看去可能会觉得有点复杂，但是附加的 interface 清除了所有混乱，使用此代码，你可以清晰的看到该函数需要唯一的一个包含有必要属性 text 和可选属性 tags（由数字构成的数组）的对象。

```typescript
interface SearchActionOptions {
  text: string;
  tags?: number[];
}

interface ISearchAction extends SearchActionOptions {
  type: string;
}

function searchAction(options: SearchActionOptions): ISearchAction {
  return {
    type: "SEARCH",
    ...options,
  };
}
```

如果我们不正确的使用它，编辑器会给出相关提示！

![](https://raw.githubusercontent.com/johnny19941216/storage-room/master/img/20190918203523.png)

截图来自于 VisualStudio Code

## 记事本 APP

本文会创建一个简单的记事本 APP，你可以在[GitHub](https://github.com/SwingDev/microconf-workshops)找到这个仓库，如果你想在已有代码的基础上编写，你可以从 master 分支检出代码。

在仓库里你可以找到已配置的 React + TypeScript 项目，其中实现了所有组件并定义了所有基本 action，虽然缺少了 store。

在这个应用中我们有三个 action：

- _NOTES_FETCH_ 应用开始获取数据时调用
- _NOTES_FETCH_SUCCESS_ 应用获取数据成功时调用
- _NOTES_FETCH_ERROR_ 应用获取数据出错时调用

```typescript
export interface IActionNotesFetch extends Action {
  type: "NOTES_FETCH";
}

export interface IActionNotesFetchSuccess extends Action {
  type: "NOTES_FETCH_SUCCESS";
  notes: NoteModel[];
}

export interface IActionNotesFetchError extends Action {
  type: "NOTES_FETCH_ERROR";
  errorMessage: string;
}

export type AppActions =
  | IActionNotesFetch
  | IActionNotesFetchSuccess
  | IActionNotesFetchError;
```

我们应该如何构造 store 以方便向用户展示数据？

## 常见（不推荐）方法

最基本的 store 构造可能如下所示：

```typescript
export interface NotesListState {
  state: string; // 'INIT', 'LOADING' | 'LOADED' | 'ERROR',
  notes: NoteModel[];
  errorMessage?: string;
}
```

我们存储这个列表的当前状态：

- 初始状态 - 向服务器发送请求之前
- 加载中 - 等待服务器返回
- 加载完毕 - 已经获取数据到本地
- 错误 - 无法连接或者服务器错误

在此架构中对应的 reducer 可能如下：

```typescript
export function notesListReducer(
  state: NotesListState,
  action: AppActions
): NotesListState {
  if (action.type === "NOTES_FETCH") {
    return {
      ...state,
      state: "LOADING",
      notes: [],
    };
  }
  if (action.type === "NOTES_FETCH_SUCCESS") {
    return {
      ...state,
      state: "LOADED",
      notes: action.notes,
    };
  }
  if (action.type === "NOTES_FETCH_ERROR") {
    return {
      ...state,
      state: "ERROR",
      notes: [],
      errorMessage: action.errorMessage,
    };
  }
  return state;
}
```

这是一个简单的函数，只有三个条件语句，分别对每个 action 做出反应。

接下来唯一要做的就是把 store 与 React 组件连接起来，Redux 有一个函数 connect 可以很方便的帮我们实现这个功能，它接收两个回调函数，第一个将我们的全局 state 转换为组件的 props，第二个回调函数定义组件可用的 actions，我们把第一个函数更新为以下形式：

```typescript
const mapStateToProps = (state: AppState, ownProps: HomeViewProps) => {
  return {
    notes: state.list.notes,
    state: state.list.state,
    errorMessage: state.list.errorMessage,
  };
};
```

你可以在 github 仓库中的*sprint1-finish* tag 下找到可用的版本。

## 问与答

这个版本可以成功的加载和显示笔记（notes）。但是让我们思考一下，加入我们需要添加的下一个功能是-搜索。由于我们的 store 是一个全局单一数据源，所以当我们过滤掉某些 note 时，它就会从我们的 store 移除，这意味着在每次用户搜索时，我们都需要从服务器加载数据，以便向用户展示数据。

但是如果我们想要展示另一个具有相同数据的列表，那么势必会有一些相同的条目同时出现在两个列表中，这会产生不必要的冗余，如果实际的内容和第二个列表的条目不同，又会产生歧义。

不过，我们有一个叫做 store 规范化的方案可以将我们的 React/Redux 应用提升到一个新的水平。

## store 规范化

要使用规范化，我们需要重新构思 store，在这里我们将它分为两类：

- 第一个是我们可以视为前端数据库的数据 store，它保存着可用实体的相关信息。该 store 必须独立于用户正在与之交互的实际视图。
- 第二个是我们的 UI store，这里包含有所有有关用户 UI 状态的信息，但是我的意思不是在 UI store 另外保存一份实体数据，而是保存条目的 id。

[Redux 本身推荐的结构](https://redux.js.org/recipes/structuringreducers/normalizingstateshape)如下：

```typescript
{
  entities: {
    notes: {
      byId: {
        1: {
          id: 1,
          title: 'First Note',
            description: 'Lorem Ipsum'
        },
        3: {
          id: 3,
          title: 'Another Note',
            description: 'Dolor Sit Amet'
        }
      },
      allIds: [1, 3]
    },
  },
  ui: {
    dashboardList: {
      state: 'LOADED',
      notes: [1, 3]
    }
  }
}
```

我们主要的 store 分为两部分：entities 和 ui，ui 属性下的数据结构由开发者决定，但是最重要的是我们没有保存真正的笔记数据，而是保存笔记的 id。

数据存储更加结构化。对于每个实体类型，我们保持对象包含两个属性：

- byId:将实体的 id 映射到其内容的对象
- allIds 是我们当前商店中所有 ID 的数组

如果你想了解有关 store 规范化的更多信息，建议参考[Using the Redux Store Like a Database by Nick Sweeting](https://hackernoon.com/shape-your-redux-store-like-your-database-98faa4754fd5) 和在 StackOverflow 上的讨论 [Redux - Why normalize?](https://stackoverflow.com/questions/38222312/redux-why-normalize)

## 改良版

让我们使用规范化重写一下，首先我们需要将 reducer 转换为 UI store，然后使用.map 函数将笔记映射到 ID 属性下：

```typescript
export function notesListReducer(state: NotesListState, action: AppActions): NotesListState {
  if (action.type === 'NOTES_FETCH') {
    return {
      ...state,
      state: 'LOADING',
      notes: [],
    };
  }
  if (action.type === 'NOTES_FETCH_SUCCESS') {
    return {
      ...state,
      state: 'LOADED',
      notes: action.notes*.map((n: NoteModel) => n.id**)*,
    };
  }
  if (action.type === 'NOTES_FETCH_ERROR') {
    return {
      ...state,
      state: 'ERROR',
      notes: [],
      errorMessage: action.errorMessage
    };
  }
  return state;
}
```

接下来我们需要为数据 store 定义 type，我们可以通过以下方式实现：

```typescript
export type NotesDict = {
  [Key: number]: NoteModel;
};

export type NotesDictState = {
  byId: NotesDict;
  allIds: number[];
};
```

第一个 interface 是用 Typescript 的方式声明特定形式的对象，在这里我们定义 ById 为一个对象，以数字 id 作为键，NoteModel 作为属性。

现在我们重新编写一个 reducer 更新 store：

```typescript
export function notesDictReducer(
  state: NotesDictState,
  action: AppActions
): NotesDictState {
  if (action.type === "NOTES_FETCH_SUCCESS") {
    return {
      byId: action.notes.reduce(
        (acc, note) => ({ ...acc, [note.id]: note }),
        state
      ),
      allIds: action.notes.map((n) => n.id),
    };
  }
  return state;
}
```

我们只对*NOTES_FETCH_SUCCESS*这个 action 做出反应，因为这是提供新数据的唯一操作，然后我们构建以 id 作为键的对象和包含所有 id 的数组。

现在我们需要合并所有的 reducer 并且创建一个 main store 来保存这些数据：

```typescript
export function mainReducer(state: AppState = defaultState(), action: Action) {
  return {
    entities: {
      notes: notesDictReducer(state.entities.notes, action),
    },
    ui: {
      list: notesListReducer(state.ui.list, action),
    },
  };
}
```

在实际项目中你可能会使用*combineReducers*来简化代码。

接下来唯一要做的事就是更新我们的连接器（connector），现在我们的 UI 笔记列表只包含 id，因此我们需要将它映射到实际的笔记对象：

```typescript
const mapStateToProps = (state: AppState, ownProps: HomeViewProps) => {
  return {
    notes: state.ui.list.notes.map(
      (noteId) => state.entities.notes.byId[noteId]
    ),
    state: state.ui.list.state,
    errorMessage: state.ui.list.errorMessage,
  };
};
```

## 添加搜索

使用新架构添加搜索完全不是问题，首先，我们需要创建一个新的 action interface，看起来像下面这样：

```typescript
export interface IActionSearchNotes {
  type: "NOTES_SEARCH";
  options: {
    searchText: string;
  };
}
```

接下里我们需要更新 UI reducer：

```typescript
export function notesListReducer(
  state: NotesListState,
  action: AppActions,
  notes: NotesDictState
): NotesListState {
  /* all other reducers */
  if (action.type === "NOTES_SEARCH") {
    return {
      ...state,
      notes: notes.allIds
        .map((id) => notes.byId[id])
        .filter(filterByText(action.options.searchText.toLowerCase()))
        .map((n) => n.id),
    };
  }
  return state;
}
```

请注意，我们需要将数据 store 传递到 reducer 中，以便能够遍历所有元素并仅过滤出与搜索字符匹配的结果，你可以通过各种方式实现 filterByText 函数，下面是其中一种实现方式：

```typescript
function filterByText(text: string): (n: NoteModel) => boolean {
  return (note: NoteModel): boolean => {
    return (
      note.title.toLowerCase().indexOf(text) > -1 ||
      note.content.toLowerCase().indexOf(text) > -1
    );
  };
}
```

该函数检查了笔记的标题或者内容是否能够与搜索匹配。

好了，就是这么多了，我们已经实现了搜索，请注意我们事实上并没有触及连接器（connector），因为我们的 store 已经规范化，所以无需更新视图。添加更多的搜索功能或者排序功能也不需要有太多的更改。如果我们需要添加刷新功能与后台保持同步，我们应用中的所有实例将自动更新。

## 摘要

我希望本文能够让您基本了解 Redux store 规范化的工作原理以及如何使用它来改进项目。如果您想通过此示例进行更多操作，我建议您执行以下一项或所有练习：

- 删除元素的功能
- 添加标记功能
- 添加按标签搜索的选项

本文基于 2018 年 7 月 25 日在波兰华沙举行的 SwingDev microConf“State of the State in React”研讨会。如果您想了解有关该活动的更多信息，请访问[www.microconf.io](https://www.microconf.io/)。
