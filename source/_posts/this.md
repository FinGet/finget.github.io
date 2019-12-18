---
title: 归纳总结this的指向问题
date: 2018-11-28 14:00:20
type: "tags"
tags:
	- this
	- JS
categories: "JS"
description: "this关键字，指向问题总结"
---

## this

> this:上下文,会根据执行环境变化而发生指向的改变.

1.单独的this，指向的是window这个对象

```javascript
alert(this); // this -> window 
```

2.全局函数中的this

```javascript
function demo() {
  alert(this); // this -> window
}
demo();
```
**在严格模式下，this是undefined.**

```javascript
function demo() {
  'use strict';
  alert(this); // undefined
}
demo();
```
3.函数调用的时候，前面加上new关键字

> 所谓构造函数，就是通过这个函数生成一个新对象，这时，this就指向这个对象。

```javascript
function demo() {
  //alert(this); // this -> object
  this.testStr = 'this is a test';
}
let a = new demo();
alert(a.testStr); // 'this is a test'
```

4.用call与apply的方式调用函数

```javascript
function demo() {
  alert(this);
}
demo.call('abc'); // abc
demo.call(null); // this -> window
demo.call(undefined); // this -> window
```

5.定时器中的this，指向的是window

```javascript
setTimeout(function() {
  alert(this); // this -> window ，严格模式 也是指向window
},500)
```
6.元素绑定事件，事件触发后，执行的函数中的this，指向的是当前元素

```javascript
window.onload = function() {
  let $btn = document.getElementById('btn');
  $btn.onclick = function(){
    alert(this); // this -> 当前触发
  }
}
```
7.函数调用时如果绑定了bind，那么函数中的this指向了bind中绑定的元素
```javascript
window.onload = function() {
  let $btn = document.getElementById('btn');
  $btn.addEventListener('click',function() {
    alert(this); // window
  }.bind(window))
}
```
8.对象中的方法，该方法被哪个对象调用了，那么方法中的this就指向该对象

```javascript
let name = 'finget'
let obj = {
  name: 'FinGet',
  getName: function() {
    alert(this.name);
  }
}
obj.getName(); // FinGet
---------------------------分割线----------------------------
let fn = obj.getName;
fn(); //finget   this -> window
```

**腾讯笔试题**

```javascript
var x = 20;
var a = {
  x: 15,
  fn: function() {
    var x = 30;
    return function() {
      return this.x
    }
  }
}
console.log(a.fn());
console.log((a.fn())());
console.log(a.fn()());
console.log(a.fn()() == (a.fn())());
console.log(a.fn().call(this));
console.log(a.fn().call(a));
```


**答案**

1.`console.log(a.fn());`
对象调用方法，返回了一个方法。
`# function() {return this.x}`

2.`console.log((a.fn())());`
a.fn()返回的是一个函数，`()()`这是自执行表达式。this -> window
`# 20`

3.`console.log(a.fn()());`
a.fn()相当于在全局定义了一个函数，然后再自己调用执行。this -> window
`# 20`

4.`console.log(a.fn()() == (a.fn())());`
`# true`

5.`console.log(a.fn().call(this));`
这段代码在全局环境中执行，this -> window
`# 20`

6.`console.log(a.fn().call(a));`
this -> a
`# 15`
