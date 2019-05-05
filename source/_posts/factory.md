---
title: JavaScript设计模式之工厂模式
date: 2018-10-12 15:21:45
type: "tags"
tags:
	- JS
	- 设计模式
categories: "设计模式"
description: "学习设计模式笔记————JavaScript设计模式之工厂模式"
---


## 工厂模式 简介


> 工厂模式定义一个用于创建对象的接口，这个接口由子类决定实例化哪一个类。该模式使一个类的实例化延迟到了子类。而子类可以重写接口方法以便创建的时候指定自己的对象类型(抽象工厂)。
> 将 new 操作单独封装，遇到new时，就要考虑是否该用工厂模式

模式作用： 

- 对象的构建十分复杂
- 需要依赖具体的环境创建不同实例
- 处理大量具有相同属性的小对象

注意事项：

- 不能滥用工厂，有的时候仅仅是给代码增加复杂度

UML
![](https://i.imgur.com/yUjiRn8.png)

### 在jquery中的应用
```javascript
// product
class jQuery {
  constructor(selector) {
    let slice = Array.prototype.slice
    let dom = slice.call(document.querySelectorAll(selector))
    let len = dom ? dom.length : 0
    for (let i = 0; i < len; i++) {
        this[i] = dom[i]
    }
    this.length = len
    this.selector = selector || ''
  }
  append(node) {}
  addClass(name) {}
  html(data) {}
// 此处省略若干 API
}
// 工厂
window.$ = function (selector) {
  return new jQuery(selector)
}
```

## 简单工厂 与 抽象工厂

### 简单工厂模式

> 简单工厂模式：又叫静态工厂方法，由一个工厂对象决定创建某一种产品对象类的示例。主要用来创建同一类对象。

去KFC点一个汉堡，服务员给你的是个汉堡，而不是牛肉、面粉、佐料...
```javascript
// KFC的类
class KFC {
  // 做汉堡
  makeHbg () {
	// ...繁琐的工序
	console.log('汉堡一个')
  }
  // 炸鸡腿
  makeChk () {
	// ...繁琐的工序
	console.log('鸡腿一个')
  }
}

// 某一家KFC的店铺
let kfcFactory = function (food) {
  let kfc = new KFC()
  switch (food) {
	case hamburger:
	  return kfc.makeHbg()
	  break;
	case chicken:
	  return kfc.makeChk()
	  break;
  }
}

// 对于顾客来说，他只需要‘传入’他需要的东西就好了，不用关心汉堡是怎么做出来的
kfcFactory(hamburger); // '汉堡一个'
```

### 工厂方法

> 工厂方法：通过对产品类的抽象使其创建业务主要负责用于创建多类产品的实例。

现在有个工厂来生成所有的共享单车，模拟一下工厂模式。
```javascript
// 别较真 栗子不好吃 理解这种方式就行
let Ofo = function() {
  this.name = 'ofo'
  // ... 省略每个品牌的独有的属性方法
  (function() {
    let div = document.createElement('div')
    div.innerHTML = '这是一辆ofo单车'
    document.getElementById('box').appendChild(div)
  })()
}

let Mobike = function() {
  this.name = 'Mobike'
  // ... 省略每个品牌的独有的属性方法
  (function() {
    let div = document.createElement('div')
    div.innerHTML = '这是一辆Mobike单车'
    document.getElementById('box').appendChild(div)
  })()
}

let Hello = function() {
  this.name = 'hello'
  // ... 省略每个品牌的独有的属性方法
  (function() {
    let div = document.createElement('div')
    div.innerHTML = '这是一辆hello单车'
    document.getElementById('box').appendChild(div)
  })()
}

let Blue = function() {
  this.name = 'blue'
  // ... 省略每个品牌的独有的属性方法
  (function() {
    let div = document.createElement('div')
    div.innerHTML = '这是一辆blue单车'
    document.getElementById('box').appendChild(div)
  })()
}

let Bikefactory = function (type) {
  switch (type) {
	case 'Ofo':
	  return new Ofo()
	  break;
	case 'Mobike':
	  return new Mobike()
	  break;
	case 'Hello':
	  return new Hello()
	  break;
	case 'Blue':
	  return new Blue()
	  break;
  }
}
```

#### 安全模式类

> 安全模式类是为了解决错误使用类而造成的错误。

```javascript
var Demo = function() {}
Demo.prototype={
  show: function() {
    console.log('Hello Demo')
  }
}
// 正确使用
var d = new Demo()
d.show();
// 错误使用
var d = Demo()
d.show(); // Uncaught TypeError:Cannot read property 'show' of undefined
```
为了避免这类错误的发生，在构造函数开始时先判断当前对象this指代的是不是类(Demo)。

```javascript
var Demo = function () {
  if (!(this instanceof Demo)) {
    return new Demo()
  }
}
var d =Demo();
d.show(); // 'Hello Demo'
```


上面这样写，我们发现当共享单车的种类越来越多，需要添加新的共享单车时，就需要修改两处的代码，所以可以对它进行修改，按工厂模式方法来做。

```javascript
let Bikefactory = function (name) {
    // 使用完全模式
  if (this instanceof Bikefactory) {
    let s = new this[type](name)
    return s;
  } else {
    return new Bikefactory(name)
  }
}
Bikefactory.prototype = {
  Ofo: function() {
      this.name = 'ofo'
      // ... 省略每个品牌的独有的属性方法
      (function() {
        let div = document.createElement('div')
        div.innerHTML = '这是一辆ofo单车'
        document.getElementById('box').appendChild(div)
      })()
  },
  Mobike: function() {
    ....
  },
  ...
}
```

### 抽象工厂模式

> 抽象工厂模式：通过对类的工厂抽象使其业务用于对产品类簇的创建，而不负责创建某一类产品的实例。

#### 抽象类
在JavaScript中abstract是一个保留字，所以目前来说还不能像传统的面向对象语言那样轻松的创建抽象类。抽象类是一种声明但不能使用的类，当你使用时就会报错。

```javascript
// 抽象类
let Car = function() {}
Car.prototype = {
  run: function() {
    return new Error('抽象方法不能调用！')
  }
}
```
```javascript
// 在ES6中定义抽象类
class Car {
  constructor() {
    if (new.target === Car) {
      throw new Error ('抽象类不能实例化！')
    }
  }
}
```
定义的Car中有一个run方法，继承与Car的子类都会拥有直接使用，需要重写。这也是抽象类的一个作用，即定义一个产品簇，并声明一些必备的方法，如果子类中没有重写这些方法，直接使用就会抛出错误。

#### 抽象工厂

```javascript
var XMLHttpFactory = function() {}

XMLHttpFactory.prototype = {
// 如果真的要调用这个方法会抛出一个错误，它不能被实例化，只能用来派生子类
  createFactory: function () {
	throw new Error('This is an abstract class')
  }
}

// 经典继承
var XHRHandler = function () {
	XMLHttpFactory.call(this) 
}
XHRHandler.prototype = new XMLHttpFactory()
XHRHandler.prototype.constructor = XHRHandler

XHRHandler.prototype.createFactory = function() {
  var XMLHttp = null;
  if(window.XMLHttpRequest) {
    XMLHttp = new XMLHttpRequest()
  } else if (window.ActiveXObject){
    XMLHttp = new ActiveXObject("Microsoft.XMLHttp")
  }
  return XMLHttp;
}
```
> 如果没有看明白经典继承部分的代码，可以去看看[原型，原型链，call/apply](https://finget.github.io/2018/09/13/proto/)。

用ES6的语法来实现一下抽象工厂，还是用共享单车的例子来改写一下：
```javascript
// 别较真 栗子不好吃 理解这种方式就行
class Bike {
  constructor(name) {
    if (new.target === Bike) {
      throw new Error('抽象类不能实例化!')
    }
    this.name = name;
    // ... 此处省略100行
  }
  // ... 此处省略100行
  init () {
    return new Error('抽象方法不能调用！')
  }
}
class Ofo extends Bike {
  constructor(name) {
    super('ofo')
    this.name = name;
    // ... 此处省略100行
  }
  // ... 此处省略100行
  init () {
    console.log('这是一辆ofo单车！')
  }
}

class Mobike extends Bike {
  ...
}
class Hello extends Bike {
  ...
}
class Blue extends Bike {
  ...
}
// ... 更多的单车
let Bikefactory = function (name) {
  switch (name) {
	case 'Ofo':
	  return new Ofo()
	  break;
	case 'Mobike':
	  return new Mobike()
	  break;
	case 'Hello':
	  return new Hello()
	  break;
	case 'Blue':
	  return new Blue()
	  break;
  }
}
```


抽象工厂只留了一个“口子”，它不做具体的事，由它的子类，根据自身情况重写方法。

## 最后

创建了一个前端学习交流群，感兴趣的朋友，一起来嗨呀！
![](https://ws1.sinaimg.cn/large/006tNc79gy1g2qi8r9stqj30a50dwdkq.jpg)