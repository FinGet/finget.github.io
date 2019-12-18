---
title: react-native之navigation
date: 2018-04-04 17:03:27
type: "tags"
tags:
	- JS
	- reactNative
categories: "JS"
description: "react-native之navigation"
---

## 先看项目目录
这个文件目录除了`src` 其他的都是通过`react-native init my_app`自动生成的。

>自所以要贴目录，是我发现我在网上查找博客文章的时候，很多都没有目录，上来就是代码，一脸懵逼进来一脸懵逼出去，可能是自己太菜了。

![](https://i.imgur.com/mRe9XyT.png)

## react-navigation

>译注：从0.44版本开始，Navigator被从react native的核心组件库中剥离到了一个名为react-native-deprecated-custom-components的单独模块中。如果你需要继续使用Navigator，则需要先npm i facebookarchive/react-native-custom-components安装，然后从这个模块中import，即import { Navigator } from 'react-native-deprecated-custom-components'.——官网

### 安装react-navigation
`npm i react-navigation --save`

`yarn add react-navigation`

这个库包含了三个组件：

- StackNavigator：用来跳转页面和传递参数
- TabNavigator：类似底部导航栏，用来在同一屏幕下切换不同界面
- DrawerNavigator：侧滑菜单导航栏，用于轻松设置带抽屉导航的屏幕

>该文只说前两个怎么用，就是入门，至于有很多配置项的东西，可以查官方文档。这也是我的学习方式，先用了再说，先了解一下这个到底是长什么样的，至于它化不化妆慢慢再看。
>`DrawerNavigator`希望日后能补上。

### StackNavigator

先安照第一张文件目录图建几个文件，文件名随便。

- index.js

```javascript
import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  Image
} from 'react-native';

import {
  StackNavigator,
  TabNavigator
} from 'react-navigation';

import First from './first.js';
import Second from './second.js';
class Navigation extends Component{
	constructor(props){
		super(props);
	}
	static navigationOptions = {
    headerTitle: 'Navigation',
    // header: null, // 隐藏顶部导航
  }
  render() {
    const {navigate} = this.props.navigation;

    return (
      <View>
        <Text>This is the home screen of the app</Text>
        <Button
          onPress={() => navigate('First',{user:'参数111'})}
          title="点击我跳转"
        />
      </View>
     )
  }
}
const MyScreens = StackNavigator({
  Home: { screen: Navigation },
  First: {screen: First},
  Second: {screen: Second}
});

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor:'#fff'
    },
    icon: {
        height: 22,
        width: 22,
        resizeMode: 'contain'
    }
});
export default MyScreens;
```

- first.js

```javascript
import React, { Component } from 'react';
import {
  Text,
  View,
  Button
} from 'react-native';


export default class First extends Component{
	static navigationOptions = ({ navigation }) => ({
 		title: `${navigation.state.params.user}`,
 	});
 	static navigationOptions = {
    headerTitle: '第一页',
    // header: null, // 隐藏顶部导航
  }
  render() {
  	const {navigate} = this.props.navigation;
  	const {params} = this.props.navigation.state;
    return (
     <View>
     	<Text>我是first页面</Text>
     	<Text>上一个页面传的参数{params.user}</Text>
     	<Button
          onPress={() => navigate('Second',{papa:'参数222'})}
          title="点击我跳转"
        />
     </View>
    );
  }
}
```

- second.js

```javascript
import React, { Component } from 'react';
import {
  Text,
  View,
  Button
} from 'react-native';


export default class First extends Component{
	static navigationOptions = ({ navigation }) => ({
 		title: `${navigation.state.params.papa}`,
	});
 	static navigationOptions = {
    headerTitle: '第二页',
    // header: null, // 隐藏顶部导航
  }
  render() {
  	const {goBack} = this.props.navigation;
  	const {params} = this.props.navigation.state;
    return (
     <View>
     	<Text>我是second页面</Text>
     	<Text>上一个页面传的参数{params.papa}</Text>
     	<Button
          onPress={() => goBack()}
          title="点击我回跳"
        />
     </View>
    );
  }
}
```

效果图：

![](https://i.imgur.com/R35h4Ke.gif)

这就实现了页面之间的跳转，和传参。

`onPress={() => navigate('First',{user:'参数111'})}`,第一个参数表示跳转的页面，第二参数是传递的参数。跳转页面必须是已经注册的页面。

### TabNavigator

- index.js

```javascript
import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  Image
} from 'react-native';

import {
  StackNavigator,
  TabNavigator
} from 'react-navigation';

import First from './first.js';
import Second from './second.js';
import Other from './other.js';
class Navigation extends Component{
	constructor(props){
		super(props);
	}
	static navigationOptions = {
    headerTitle: 'Navigation',
    // header: null, // 隐藏顶部导航
    // 
  }
  render() {
    const {navigate} = this.props.navigation;

    return (
      <View>
        <Text>This is the home screen of the app</Text>
        <Button
          onPress={() => navigate('First',{user:'参数111'})}
          title="点击我跳转"
        />
        <Button
          onPress={() => navigate('Other')}
          title="点击我跳转到其他页面"
        />
      </View>
     )
  }
}
const MainScreenNavigator = TabNavigator({
    Home: {
        screen: Navigation,
        navigationOptions: {
          tabBarLabel: '首页',
          tabBarIcon: ({tintColor}) => (
              <Image
                  source={require('./home.png')}
                  style={[{tintColor: tintColor},styles.icon]}
              />
          ),
        }
    },
    First: {
        screen: First,
        navigationOptions: {
          tabBarLabel: '第一页',
          tabBarIcon: ({tintColor}) => (
              <Image
                  source={require('./home.png')}
                  style={[{tintColor: tintColor},styles.icon]}
              />
          ),
        }
    },
    Second: {
        screen: Second,
        navigationOptions: {
          tabBarLabel: '第二页',
          tabBarIcon: ({tintColor}) => (
              <Image
                  source={require('./home.png')}
                  style={[{tintColor: tintColor},styles.icon]}
              />
          ),
        }
    },
}, {
    animationEnabled: false, // 切换页面时不显示动画
    tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
    swipeEnabled: false, // 禁止左右滑动
    // backBehavior: 'none', // 按 back 键是否跳转到第一个 Tab， none 为不跳转
    tabBarOptions: {
        activeTintColor: '#008AC9', // 文字和图片选中颜色
        inactiveTintColor: '#999', // 文字和图片默认颜色
        showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
        indicatorStyle: {height: 0}, // android 中TabBar下面会显示一条线，高度设为 0 后就不显示线了
        style: {
            backgroundColor: '#000', // TabBar 背景色
        },
        labelStyle: {
            fontSize: 12, // 文字大小
        },
    },
});
const MyScreens = StackNavigator({
  Home: { screen: MainScreenNavigator },
  // First: {screen: First},
  // Second: {screen: Second}
  Other: {screen: Other}
});

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor:'#fff'
    },
    icon: {
        height: 22,
        width: 22,
        resizeMode: 'contain'
    }
});
export default MyScreens; // 这里导出的是MyScreens,而不是Navigation组件
```

- first.js

```javascript
import React, { Component } from 'react';
import {
  Text,
  View,
  Button
} from 'react-native';


export default class First extends Component{
	// static navigationOptions = ({ navigation }) => ({
 //    title: `${navigation.state.params.user}`,
 //  });
 	static navigationOptions = {
    headerTitle: '第一页',
    // header: null, // 隐藏顶部导航
    // 
  }
  render() {
  	const {navigate} = this.props.navigation;
  	// const {params} = this.props.navigation.state;
    return (
     <View>
     	<Text>我是first页面</Text>
     	{/*<Text>上一个页面传的参数{params.user}</Text>*/}
     	<Button
          onPress={() => navigate('Second',{papa:'参数222'})}
          title="点击我跳转"
        />
     </View>
    );
  }
}
```

- second.js

```javascript
import React, { Component } from 'react';
import {
  Text,
  View,
  Button
} from 'react-native';


export default class First extends Component{
	// static navigationOptions = ({ navigation }) => ({
 //    title: `${navigation.state.params.papa}`,
 //  });
 	static navigationOptions = {
    headerTitle: '第二页',
    // header: null, // 隐藏顶部导航
    // 
  }
  render() {
  	const {goBack} = this.props.navigation;
  	// const {params} = this.props.navigation.state;
    return (
     <View>
     	<Text>我是second页面</Text>
     	{/*<Text>上一个页面传的参数{params.papa}</Text>*/}
     	<Button
          onPress={() => goBack()}
          title="点击我回跳"
        />
     </View>
    );
  }
}
```

效果图：

![](https://i.imgur.com/YqJc1Ya.gif)
