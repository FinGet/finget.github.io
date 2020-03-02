---
title: react-create-app 中配置使用 Mobx
---

## 安装配置

```
yarn add mobx mobx-react

yarn add babel-plugin-transform-decorators-legacy
```

```javascript
// webpack.config.dev.js webpack.congif.prod.js
{
    test: /\.(js|jsx|mjs)$/,
    include: paths.appSrc,
    loader: require.resolve('babel-loader'),
    options: {
      plugins: [ // 就加上这个plugins
        ['transform-decorators-legacy']
      ],
      // This is a feature of `babel-loader` for webpack (not Babel itself).
      // It enables caching results in ./node_modules/.cache/babel-loader/
      // directory for faster rebuilds.
      cacheDirectory: true,
    },
  },
```

## 使用

在 src 文件夹下 新建一个store文件夹
```javascript
// index.js
import homeStore from './home_store.js';
import otherStore from './others.js';
export {homeStore, otherStore}

// home_store.js
import {observable, action, computed} from 'mobx';

class HomeStore {
    @observable text;
    @observable num;

    constructor() {
        this.num = 0
        this.text = 'Hello Word!'
    }

    @action 
    plus = () => {
        this.num = ++this.num
    }
    
    minus = () => {
        this.num = --this.num
    }
    
    change = (str) => {
        this.text = str
    }
    @computed
    get plusNum (){
        return this.num + 5
    }
}

const homeStore = new HomeStore()//通过new 创建一个homeStore对象实例通过export导出

export default homeStore

// others.js
import {observable, action} from 'mobx';

class OthersStore {
    @observable str;

    constructor() {
        this.str = '这个值来自其他模块'
    }
    @action 
    getdata = () => {
    	fetch('api/comments/show?id=4199740256395164&page=1')
				.then(res => {res.json().
				then(action((data) => {
					// console.log(data);
					this.str = data.msg;
				}))
			})
    }
}

const otherStore = new OthersStore()//通过new 创建一个homeStore对象实例通过export导出

export default otherStore
```

> 在action 中请求数据，用action进行数据绑定

全局注册
```javascript
// app.js 
import React, { Component } from 'react';
import logo from '../../assets/img/logo.svg';
import './index.css';
import {Provider} from "mobx-react";
import * as store from '../../store/index.js'//将所有方法给预一个store的别名方面在不同组件中调用
import Mobx from '../../views/mobx_test.js';
import Mobx2 from '../../views/mobx2.js';
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>

          <Mobx></Mobx>
          <Mobx2></Mobx2>
        </div>
      </Provider>
    );
  }
}

export default App;

```

组件中使用

```javascript
// mobx2.js
import React, {Component} from "react";
import {observer,inject} from 'mobx-react';
@inject('store') // 将store注入到当前组件中
@observer // 将该组件变成响应式组件
class Mobx2 extends Component {
	handleClick = () => {
		this.props.store.otherStore.getdata()
	}
	render() {
		return (
			<div>
				<h1>体现mobx的响应式</h1>
				<h2>homeStore.text: {this.props.store.homeStore.text}</h2>
				<h2>homeStore.num: {this.props.store.homeStore.num}</h2>
				<button onClick={this.handleClick}> 点击获取数据修改str</button>
			</div>	
		)
	}
}

export default Mobx2;
```

```javascript
// mobx_test.js
import React, {Component} from "react";
import {observer,inject} from 'mobx-react';
@inject('store') // 将store注入到当前组件中
@observer // 将该组件变成响应式组件
class Mobx extends Component {
	handelPlus =() => {
		this.props.store.homeStore.plus()
	}
	handelMinus =() => {
    this.props.store.homeStore.minus()
	}
	handleChange = () => {
		this.props.store.homeStore.change('哈哈哈哈，成功！')
	}
	render() {
		return (
			<div>
				<h1>Mobx Test</h1>
				<h2>homeStore.text: {this.props.store.homeStore.text}</h2>
				<h2>homeStore.num: {this.props.store.homeStore.num}</h2>
				<h3>otherStore.str: {this.props.store.otherStore.str}</h3>
				<h3>homeStore.computed: {this.props.store.homeStore.plusNum}</h3>
				调用action: 
				<br/>
				<button onClick={this.handelMinus}>减</button>
				<button onClick={this.handelPlus}>加</button>

				<button onClick={this.handleChange}>改变 homeStore.text</button>
			</div>	
		)
	}
}

export default Mobx;
```

> 组件中使用时要注意 this 的问题，推荐使用箭头函数


## 另外一种只作为数据与视图的隔离

> 不做全局绑定 也没有响应

```javascript
// store/good.js
import { observable, action } from 'mobx';
import { httpReq } from '../api/httpReq.js';

export default class GoodsModel {
	@observable goodsList = [];

	@action
	getGoodsList = async (id) => {
		const url = 'http://dev.xyf.78dk.com/v5/firstproductlists';
		const method = 'post';
		const params = {
			merchantId: id || 1005
		} 

		const responseData = await httpReq({url, method, params}).then(res => res.json());
		this.goodsList = [].concat(responseData.data.productList);
	}
}

// view/good.js

import React, { Component } from 'react';
import {observer} from 'mobx-react';
@observer
export default class Goods extends Component{
	// new数据实例
  goodsModel = new GoodsModel();
  getProductList(){
  	// 调用实例方法
  	this.goodsModel.getGoodsList();
  }
  render() {
  	// 拿取数据
  	const { goodsList } = this.goodsModel;
    return ( 
      <div>
        {goodsList}
      </div>
    );
  }
}
```