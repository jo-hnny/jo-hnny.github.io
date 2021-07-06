---
title: "初探react Native"
date: 2019-09-18T20:51:20+08:00
image: https://picsum.photos/seed/c2c7c029452b45aa8117a63cd653cdb4/4096/2160
draft: false
---

本文不介绍 React Native 的 API，API 可以参考官网或者 react native 中文网，主要是从环境搭建开始，利用豆瓣的开放 api 搭建一个豆瓣电影的应用。
![app截图](https://raw.githubusercontent.com/johnny19941216/storage-room/master/img/Screenshot_2018-01-02-16-02-39-091_host.exp.expon.png)

## 一、环境搭建

环境搭建可以参考[官网](https://reactnative.cn/docs/0.50/getting-started.html)  
 必要的依赖  
 ①、Python 2  
 ②、Node  
 ③、yarn  
 ④、Android Studio  
 ⑤、Expo

## 二、Hello World

`npm install -g create-react-native-app`  
 选择一个文件夹作为你的项目地址  
 `create-react-native-app douban_movie`  
 `cd douban_movie`  
 `npm start`  
 等待命令行出现一个二维码，然后在手机上打开 expo 扫面这个二维码，就可以实时预览 app 效果了。

## 三、项目构思

目前在
[豆瓣电影 API](https://developers.douban.com/wiki/title=movie_v2#subject)
中确认不用注册可以直接使用的接口有这些  
 ![豆瓣电影api截图](https://raw.githubusercontent.com/johnny19941216/storage-room/master/img/20190918202412.png)  
 按照这些 api 提供的信息大致确定页面结构为：  
 1、tab 导航页：包括搜索页面、top250、北美票房榜页面、正在上映页面、即将上映页面  
 2、详情页面：包括电影详情和演员详情

## 四、开工

### 1、项目目录结构：

```
|------components
|
|------http
|
|------views
|
App.js
|
package.json
```

### 2、获取接口数据

#### 在 react native 中进行 http 请求使用的 api 是[fetch](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)

`fetch是一种新的web HTTP请求api，现在已经内置在了大多数的浏览器中，在此之前web HTTP请求都是通过 XMLHttpRequest实现的`

#### 请注意，fetch 规范与 jQuery.ajax() 主要有两种方式的不同，牢记：

当接收到一个代表错误的 HTTP 状态码时，从 fetch()返回的 Promise 不会被标记为 reject， 即使该 HTTP 响应的状态码是 404 或 500。相反，它会将 Promise 状态标记为 resolve （但是会将 resolve 的返回值的 ok 属性设置为 false ）， 仅当网络故障时或请求被阻止时，才会标记为 reject。
默认情况下, fetch 不会从服务端发送或接收任何 cookies, 如果站点依赖于用户 session，则会导致未经认证的请求（要发送 cookies，必须设置 credentials 选项）.

#### 各浏览器对 fetch 的支持情况：

![can i use fetch](https://raw.githubusercontent.com/johnny19941216/storage-room/master//img/can_i_use_fetch.png)

#### /http/fetchApi.js

```js
export default fetchApi = (url) => {
  return fetch(url).then((rsp) => {
    if (rsp.ok) return rsp.json();
    return Promise.reject(rsp.json());
  });
};
```

#### /http/api.js

```js
import fetchApi from "./fetchApi";
const baseUrl = "https://api.douban.com/v2/movie/";

exports.movieInfo = (id) => fetchApi(`${baseUrl}subject/${id}`);

exports.actorInfo = (id) => fetchApi(`${baseUrl}celebrity/${id}`);

exports.search = (q, start = 0, count = 10) =>
  fetchApi(`${baseUrl}search?q=${q}&start=${start}&count=${count}`);

exports.top250 = (start = 0, count = 10) =>
  fetchApi(`${baseUrl}top250?start=${start}&count=${count}`);

exports.usBox = () => fetchApi(`${baseUrl}us_box`);

exports.showing = () => fetchApi(`${baseUrl}in_theaters`);

exports.comingSoon = (start = 0, count = 10) =>
  fetchApi(`${baseUrl}coming_soon?start=${start}&count=${count}`);
```

### 3、基础组件 /components

#### 首先需要一个卡片组件来展示最基本的电影信息---电影名称、海报、评分 /components/MovieCard.js

这里用到了一个组件库[react-native-elements](https://react-native-training.github.io/react-native-elements/)

```jsx
import React from "react";
import { StyleSheet, Text, Image } from "react-native";
import { Card, Rating } from "react-native-elements";

export default class MovieCard extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Card
        title={this.props.title}
        image={{ uri: this.props.img }}
        containerStyle={styles.card}
      >
        <Rating
          type="star"
          fractions={1}
          startingValue={this.props.rating}
          readonly
          imageSize={25}
        />
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 240,
    justifyContent: "space-around",
    alignItems: "center",
  },
});
```

#### 卡片列表组件 /components/ListPage.js

```jsx
import React from "react";
import { FlatList, TouchableHighlight, View, StyleSheet } from "react-native";
import MovieCard from "./MovieCard";

export default class ListPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { navigate } = this.props.navigation;
    if (!this.props.movies.length) return <View></View>;
    return (
      <FlatList
        data={this.props.movies}
        renderItem={({ item }) => (
          <TouchableHighlight
            onPress={() => navigate("MovieInfo", { id: item.id })}
          >
            <View>
              <MovieCard
                img={item.images.small}
                rating={item.rating.average}
                title={item.title}
              />
            </View>
          </TouchableHighlight>
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        onEndReachedThreshold={0.5}
        onEndReached={this.props.loadData}
      />
    );
  }
}
```

### 4、页面 /views

#### /views/Top250 /views/UsBox.js /views/Showing.js /views/ComingSoon.js 这几个页面的逻辑是相似的，只是数据不一样而已,就只看一下 Top250.js 的代码

```jsx
import React from "react";
import { top250 } from "../http/api";
import ListPage from "../components/ListPage";

export default class Top250 extends React.Component {
  constructor() {
    super();
    this.state = {
      movies: [],
    };
    this.getTop250();
  }

  static navigationOptions = {
    tabBarLabel: "Top 250",
  };

  getTop250 = () => {
    top250(this.state.movies.length)
      .then((rsp) => {
        this.setState((preSate) => ({
          movies: preSate.movies.concat(rsp.subjects),
        }));
      })
      .catch((err) => {
        console.log("getTop250 error", err);
      });
  };

  render() {
    return (
      <ListPage
        movies={this.state.movies}
        loadData={this.getTop250}
        navigation={this.props.navigation}
      />
    );
  }
}
```

#### 搜索页面 /views/Home.js

```jsx
import React from "react";
import { StyleSheet, View } from "react-native";
import { SearchBar } from "react-native-elements";
import { search } from "../http/api";
import ListPage from "../components/ListPage";

export default class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      movies: [],
      key: "",
    };
  }

  static navigationOptions = {
    tabBarLabel: "主页",
  };

  keyChange = (key) => {
    this.setState({
      key,
    });
    this.getSearch();
  };

  getSearch = () => {
    search(this.state.key).then((rsp) => {
      this.setState({
        movies: rsp.subjects,
      });
    });
  };

  render() {
    return (
      <View>
        <SearchBar onChangeText={this.keyChange} placeholder="输入关键字搜索" />
        <ListPage
          movies={this.state.movies}
          loadData={this.getSearch}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
}
```

### 5、导航实现

```jsx
import React from "react";
import { TabNavigator, StackNavigator } from "react-navigation";
import Home from "./views/Home";
import Top250 from "./views/Top250";
import UsBox from "./views/UsBox";
import Showing from "./views/Showing";
import ComingSoon from "./views/ComingSoon";
import MovieInfo from "./views/MovieInfo";
import ActorInfo from "./views/ActorInfo";

export default MyApp = StackNavigator(
  {
    FirstScreen: {
      screen: TabNavigator(
        {
          Top250: {
            screen: Top250,
          },
          UsBox: {
            screen: UsBox,
          },
          Home: {
            screen: Home,
          },
          Showing: {
            screen: Showing,
          },
          ComingSoon: {
            screen: ComingSoon,
          },
        },
        {
          tabBarPosition: "bottom",
          animationEnabled: true,
          lazy: true,
          initialRouteName: "Home",
        }
      ),
    },
    MovieInfo: {
      screen: MovieInfo,
    },
    ActorInfo: {
      screen: ActorInfo,
    },
  },
  {
    headerMode: "none",
  }
);
```
