---
title: Vue 与 React 父子组件之间的家长里短
date: 2018-06-08 16:43:50
type: "tags"
tags:
	- vue
	- react
categories: "vue"
description: "记录一下，vue与react父子组件之间的通信问题"
---

## Vue

```javascript
// father.js
<template>
  <div id="father">
      这是父组件：
      <p>父组件</p>
      <Child ref="child" :msg="msg" @click="faClick"></Child>
  </div>
</template>

<script>
import Child from './child';
export default {
  data() {
    return {
      msg: '父组件传给子组件' // 传递给子组件的值
    };
  },
  components: {
    Child
  },
  methods: {
    faClick(msg) { // msg 子组件传递给父组件的值
      alert(msg);
    },
    childSayHello() { // 父组件调用子组件的方法
      this.$refs,child.sayHello();
    }
  }
}
</script>
```

```javascript
// child.js
<template>
  <div id="child">
      这是子组件：<p>父组件传递的值：{{msg}}</p>
      <button @click="click">接收父组件方法</button>
  </div>
</template>

<script>
export default {
  props: ['msg'],
  data() {
    return {
      childMsg : '哈哈哈'
    };
  },
  methods: {
    click() {
      this.$emit('click',this.childMsg); // 第一个参数为派发的事件名， 第二个参数为传递的值
    },
    sayHello() {
      alert('I am child!');
    }
  }
}
</script>
```

### 父组件向子组件传值：

1. 在父组件中引入并注册子组件
2. 在子组件中定义 `props:['msg']` (不能省略引号)
3. 通过 `:msg="msg"` 的方法传递变量，也可以通过 `msg="msg"` 传递字符串

### 父组件调用子组件的方法：

1. 在父组件中给子组件绑定一个 `ref="xxx"` 属性
2. 通过 `this.$refs.xxx.方法` 调用

### 子组件向父组件传值：

1. 在子组件中定义一个方法
2. 通过 `this.$emit('事件名','参数')` 派发一个事件，并传递参数
3. 父组件中通过 `@事件名` 的方式监听事件
4. 父组件中定一个一个方法，该方法的参数对应子组件传递过来的参数

### 子组件调用父组件的方法：

子组件可以通过`this.$parent.xxx` 直接调用父组件的方法。


> 通过子组件派发的事件，不仅可以向父组件传递参数，父组件也可以通过传递的参数，改变向子组件传递的值，从而改变子组件。

props 还可以进行一系列的格式校验，更多内容[查看官网](https://cn.vuejs.org/v2/guide/components-props.html#ad)
```javascript
props: {
    // 基础的类型检查 (`null` 匹配任何类型)
    propA: Number,
    // 多个可能的类型
    propB: [String, Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true
    },
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100
    },
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组且一定会从一个工厂函数返回默认值
      default: function () {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数
    propF: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    }
  }
```

## React

```javascript
// father.js
import React, { Component } from 'react'

import Child from './child.js';

class Father extends Component {
  constructor(props) {
    super(props);
    this.state = {
      con: '父组件给子组件'
    }
  }
  // 传递给子组件的方法，并接收子组件实例，绑定在this.child上
  onRef = (ref) => {
    this.child = ref
  }
  // 通过this.child 就可以直接调用子组件的内部方法
  click = () => {
    this.child.sayHello();
  }
  // 传递个子组件的方法
  faClick = (msg) => {
    alert(msg);
  }
  render() {
    return (
      <div>
        <p>这是父组件</p>
        <button onClick={this.click}>调用子组件方法</button>
        <div>
          这是子组件
          <Child onRef={this.onRef} connect={this.state.con} click={(msg) => this.faClick(msg)}/>
        </div>
      </div>
    )
  }
}

export default Father;
```

```javascript
// child.js
import React, { Component } from 'react'

class Child extends Component {
  constructor(props) {
    super(props);
  }
  // 调用父组件传递的方法，并传递子组件实例
  componentDidMount(){
    this.props.onRef(this);
  }
  // 调用父组件传递的方法
  click= ()=> {
    this.props.click('哈啊哈');
  }
  // 子组件内部方法
  sayHello = () => {
    alert('I am child');
  }
  render() {
    return (
      <div>
         <p>{this.props.connect}</p>
         <button onClick={this.click}>接收父组件的方法</button>
      </div>
    )
  }
}

export default Child;
```

### 父组件向子组件传值：

1. 在父组件中引入子组件
2. 通过 `connect={this.state.con}` 方式可以传递值
3. 子组件通过 `this.props.connect` 接收

### 父组件调用子组件的方法：

1. 给子组件传递一个方法 `onRef={this.onRef}`
2. 子组件在 `componentDidMount` 生命周期里 调用这个方法，并回传自身实例
3. 父组在该方法中接收子组件实例，并挂载在父组件实例属性上，例：`this.child = ref`
4. 最后就可以通过 `this.child.xxx` 直接调用子组件方法

### 子组件向父组件传参：

1. 在父组件中给子组件传递一个方法，`click={(msg) => this.faClick(msg)}`
2. 在子组件中通过一个事件接收这个方法，`onClick={this.click}`
3. 通过`click= ()=> {this.props.click('哈啊哈');}` 从而传递参数

### 子组件调用父组件方法

1. 父组件可以直接传递一个方法给子组件
2. 子组件可以通过 `this.props.xxx` 调用

> 不能直接通过 `<button onClick={this.props.click('哈啊哈')}>接收父组件的方法</button>` 进行传参，这样在组件初始化时，事件就执行了。

## Vue 与 React 的不同：

1. React 的子组件中不用定义父组件传值对应的变量
2. React 的子组件不用派发事件，父组件可以直接传递方法
3. 子组件通过`this.props.click` 可以调用父组件传递的方法，并传参
## 最后

创建了一个前端学习交流群，感兴趣的朋友，一起来嗨呀！
![](https://i.imgur.com/qbcaSEh.png)