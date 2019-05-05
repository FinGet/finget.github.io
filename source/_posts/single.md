---
title: JavaScript设计模式之单例模式
date: 2018-11-06 14:37:01
type: "tags"
tags:
	- JS
	- 设计模式
categories: "设计模式"
description: "学习设计模式笔记————JavaScript设计模式之单例模式"
---

## 单例模式

> 系统中被唯一使用，一个类只有一个实例。实现方法一般是先判断实例是否存在，如果存在就返回，不存在就创建再返回。
在JavaScript里，单例作为空间提供者，从全局命名空间里提供一个唯一的访问点来访问该对象。


模式作用：
- 模块间通信
- 系统中某个类的对象只能存在一个
- 保护自己的属性和方法

注意事项：
- 注意this的使用
- 闭包容易造成内存泄漏，不需要的赶快干掉
- 注意new的成本

## 代码示例
java中的单例模式
![](https://i.imgur.com/hAMkgsZ.png)
java请类型可以私有化，外部new就会报错。


JavaScript中的单例模式
```javascript
class SingleObject {
  login() {
	console.log('login')
  }
}
// 利用闭包实现了私有变量
SingleObject.getInstance = (fucntion () {
  let instance
  return function () {
	if (!instance) {
	  instance = new SingleObject()
	}
	return instance
  }
})()

let obj1 = SingleObject.getInstance()
obj1.login()
let obj2 = SingleObject.getInstance()
obj2.login()
// 两者是否相等
console.log(obj1 === obj2)


// js弱类型，没有私有方法，使用者还是可以直接new 一个 SingleObject，也会有 login方法
console.log('------------分割线------------')
let obj3 = new SingleObject()
obj3.login()
console.log('obj1===obj3',obj1 === obj3) // false 不是单例
```

> 最简单的单例模式，就是对象。在 JavaScript 中 定义一个对象(Object)，那么它的属性，就只能通过它自己调用。就算两个不同的对象，有相同的属性名，也不能相互调用，保护了自己属性。

登录框 单例
```javascript
class LoginForm {
  constructor() {
    this.state = 'hide'
  }
  show() {
    if (this.state === 'show') {
      alert('已经显示')
      return
    }
    this.state = 'show'
    console.log('登录框已显示')
  }
  hide() {
    if (this.state === 'hide') {
      alert('已经隐藏')
      return
    }
    this.state = 'hide'
    console.log('登录框已隐藏')
  }
}
LoginForm.getInstance = (function () {
  let instance
  return function () {
    if (!instance) {
      instance = new LoginForm();
    }
    return instance
  }
})()

// 一个页面中调用登录框
let login1 = LoginForm.getInstance()
login1.show()
// login1.hide()

// 另一个页面中调用登录框
let login2 = LoginForm.getInstance()
login2.show()

// 两者是否相等
console.log('login1 === login2', login1 === login2)
```

## 最后

创建了一个前端学习交流群，感兴趣的朋友，一起来嗨呀！
![](https://ws1.sinaimg.cn/large/006tNc79gy1g2qi8r9stqj30a50dwdkq.jpg)