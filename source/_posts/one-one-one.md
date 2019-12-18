---
title: 一张图、一句话、一段代码
date: 2018-02-06 13:27:50
type: "tags"
tags:
	- 杂记
categories: "杂记"
description: "一张图、一句话、一段代码给我带来的提示"
---

>有时候别人一句话就把你点通了——写给自己

## 一句话

- javascript中没有独立的函数和属性，每一个函数和属性都是属于一个对象。（this的理解）
- New的过程
	1. 声明一个中间对象
	2. 将中间对象的原型指向构造函数的原型
	3. 将构造函数的this指向中间对象
	4. 返回中间对象，即实例对象
- 从逻辑角度来看， null值表示一个空对象指针，而这也正是使用`typeof`操作符检测null值时会返回"object"的原因。
- `parseInt()`函数在转换字符串时，更多的是看其是否符合数值模式。它会忽略字符串前面的空格，直至找到第一个非空格字符。如果第一个字符不是数字字符或者负号，`parseInt()`就会返回 NaN；也就是说，用`parseInt()`转换空字符串会返回NaN(`Number()`对空字符串返回0);

```javascript
// Number()
var num1 = Number("Hello world!"); //NaN 
var num2 = Number(""); //0 
var num3 = Number("000011"); //11 
var num4 = Number(true); //1 

// parseInt()
var num1 = parseInt("1234blue"); // 1234 
var num2 = parseInt(""); // NaN 
var num3 = parseInt("0xA"); // 10（十六进制数）
var num4 = parseInt(22.5); // 22 
var num5 = parseInt("070"); // 56（八进制数）70 (十进制数)
var num6 = parseInt("70"); // 70（十进制数）
var num7 = parseInt("0xf"); // 15（十六进制数）
```
>在使用 parseInt()解析像八进制字面量的字符串时，ECMAScript 3 和 5 存在分歧。例如：
//ECMAScript 3 认为是 56（八进制），ECMAScript 5 认为是 70（十进制）
var num = parseInt("070"); 

- 在任意一个时间点，只能有唯一一个执行上下文在运行之中。js不能同时增加和删除同一个DOM元素，这就是为什么 JavaScript 是“单线程”的原因，意思就是一次只能处理一个请求。一般来说，浏览器会用“栈”来保存这个执行上下文。栈是一种“后进先出” (Last In First Out) 的数据结构，即最后插入该栈的元素会最先从栈中被弹出（这是因为我们只能从栈的顶部插入或删除元素）。当前的执行上下文，或者说正在运行中的执行上下文永远在栈顶。当运行中的上下文被完全执行以后，它会由栈顶弹出，使得下一个栈顶的项接替它成为正在运行的执行上下文。
- 普通函数中的this指向的是对象，匿名函数中的this指向的是windows，和全局变量一样

---

## 一段代码
- 判断对象的类型

```javascript
Object.prototype.toString.call(obj).slice(8,-1);
```
![](https://i.imgur.com/TqrGqCB.png)
- 插件的套路

``` javascript
(function (global, factory) {
	/**
	 * 模块环境探测
	 * AMD 定义了 define 函数，我们可以使用 typeof 探测该函数是否已定义。若要更严格一点，可以继续判断 define.amd 是否有定义。
	 * 另外，SeaJS 也使用了 define 函数，但和 AMD 的 define 又不太一样。
	 */
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.lozad = factory());
}(this, (function () { 'use strict';
	// 为什么传入this，而不传入window，因为在不同的环境下，全局变量不同，在nodejs就没有window对象
}
```
- 获取元素(插件里面的，根据用户传的element)

```javascript
var getElements = function getElements(selector) {
  if (selector instanceof Element) {
    return [selector];
  }
  if (selector instanceof NodeList) {
    return selector;
  }
  return document.querySelectorAll(selector); // querySelectorAll
};
```
- call

```javascript
var cat = {
  name: '咪咪'
}
function beatTheMonster(){
  console.log(this.name);
}
beatTheMonster.call(cat);

// 1.call 改变了this的指向。改变到了cat上。
// 2.beatTheMonster函数/方法执行了
// 3.bind()，保存了方法，并没有直接调用它
```

- Vue axios默认地址

```javascript
// main.js
//全局挂载
Vue.prototype.$axios = axios;
axios.defaults.baseURL = 'http://XXXXX';
```
- 数组concat

```javascript
// es6
const arr1 = [1,2,3,4,5];
const arr2 = [6,7,8,9,0];
const arrTarget = [...arr1,...arr2];
// [1,2,3,4,5,6,7,8,9,0]
```
- 为对象动态地添加字段

```javascript
const dynamicKey = "wearsSpectacles";
const user = {name: 'Shivek Khurana'};
const updatedUser = {...user,[dynamicKey]: true};
// updateUser is {name: 'Shivek Khurana',wearsSpectacles: true}
```
- 标准时间转换为时间戳

```javascript
var date = new Date();
var d1 = +new Date(date);
```

---

## 一张图

- 面向对象

![](https://i.imgur.com/bCdhs7L.png)

- webpack

![](https://i.imgur.com/NbPRvzp.png)

- 浏览器主要进程

![](https://i.imgur.com/cXloUjf.png)

- 宏任务(macrotask)与微任务(microtask)

![](https://i.imgur.com/otax4mX.png)

- 网络七层协议

![](https://i.imgur.com/Ft5xzr5.gif)

