---
title: 初识JavaScript柯理化
date: 2018-02-26 16:20:56
type: "tags"
tags:
	- JS
categories: "JS"
description: "初步认识柯理化"
---
## 什么是柯理化
>在计算机科学中，柯里化（Currying）是把接受多个参数的函数变换成接受一个单一参数(最初函数的第一个参数)的函数，并且返回接受余下的参数且返回结果的新函数的技术。

把含有N个参数的函数转变成，N个只有一个参数的函数。

中心思想：降低通用性，提高适用性。

>通用的设计比适用的设计复杂，因此更难使用。

### 特点：
- 参数复用
- 提前返回 (return)
- 延迟执行

## 参数复用

### 例子
瑞士军刀，上面有小剪刀，但是这个小剪刀肯定没有一个单独的剪刀好用。

```javascript
function square(i) {
  return i * i;
}
function dubble(i) {
  return i * 2;
}
function dobble(i) {
  return i * 1.9;
}
function map(handeler, list) {
  return list.map(handeler);
}
// 必须要传第一个参数，才能使用map函数
console.log(map(square, [1,2,3,4,5]));
console.log(map(square, [6,7,8,9,10]));
// 容易混淆
console.log(map(dubble, [1,2,3,4,5]));
console.log(map(dobble, [1,2,3,4,5]));
console.log(map(dubble, [6,7,8,9,10]));
```
```javascript
// 提高适用性 语义清除，方便使用
// 假设存在一个curry方法
var mapSQ = curry(map, square);
mapSQ([1,2,3,4,5]);
mapSQ([6,7,8,9,10]);

var mapDQ = curry(map, dubble);
mapDQ([1,2,3,4,5]);
mapDQ([6,7,8,9,10]);
```

```javascript
function ajax(type, url, data) {
  var xhr = new XMLHttpRequest();
  xhr.open(type, url, true);
  xhr.send();
}
ajax('POST', 'www.baidu.com', 'name=finget');
ajax('POST', 'www.baidu.com', 'name=bios');
ajax('POST', 'www.baidu.com', 'name=mario');

// 柯理化 减少参数
var ajaxCurry = curry(ajax);

// 用POST请求
var post = ajaxCurry('POST');
post('www.baidu.com','name=finget');

var postFromBaidu = post('www.baidu.com');
postToBaidu('name=finget');

// 以上代码类似与 $.ajax => $.post / $.get
```
- 参数的多少跟函数体的复杂性成正比
- 参数的多少跟函数的维护难度成正比
- 参数的多少跟用户的使用难度成正比

>成熟的框架jquery, lodash 一个方法基本不超过4个参数。大多数就是3个或者2个参数，方法体不超过40行

#### 一个简单的柯理化函数
```javascript
function add(a,b) {
  return a + b;
}

console.log(add(5,10)); // 15

const curryAdd = function (a) {
  return function(b) {
    return a + b;
  }
}

console.log(curryAdd(5)(10)); // 15
```

```javascript
const add5 = curryAdd(5);
// 这里就类似与var post = ajaxCurry('POST');
console.log(add5(10)); // 15
```

## 延迟执行

```javascript
var fishWeight = 0;
var addWeight = function(weight){
  fishWeight += weight;
}
addWeight(2.3);
addWeight(6.5);
addWeight(1.2);
addWeight(3);

console.log(fishWeight); // 13
```
```javascript
var curryWeight = function(fn){
  var _fishWeight = [];
  return function(){
  // apply会执行函数
  // 传入参数时，先把他们存在数组中，当没有传参就执行计算
	if (arguments.length === 0) {
	  return fn.apply(null, _fishWeight);
	} else {
	  // [].slice.call(arguments) 复制一下我们的arguments然后将内容加到我们的_fishWeight中
	  _fishWeight = _fishWeight.concat([].slice.call(arguments));
	}
 }
}
var curryAddWeight = curryWeight(function(){
  var i = 0; len = arguments.length;
  for (i; i < len; i++) {
    fishWeight += arguments[i];
  }
})
```
```javascript
curryAddWeight(2.3);
curryAddWeight(6.5);
curryAddWeight(1.2);
curryAddWeight(3);
// curryAddWeight(); 不加这句，console.log(fishWeight); // 0
console.log(fishWeight); // 0
```
柯理化后的函数是可以复用的
// 求平均值
```javascript
var avgWeight = curryWeight(function(){
  var i = 0; len = arguments.length;
  for (i; i < len; i++) {
    fishWeight += arguments[i] / len;
  }
})
```
```javascript
avgWeight(2.3);
avgWeight(6.5);
avgWeight(1.2);
avgWeight(3);
// avgWeight(); 不加这句，console.log(fishWeight); // 0
console.log(fishWeight); // 0
```

## 实现一个通用的一元curry函数
- curry函数

```javascript
function curry(fn, args) {
  var length = fn.length; // 方法参数个数 *注1
  args = args || [];
  return function(){
    var _args = args.slice(0), arg, i;
    for (i=0;i<arguments.length;i++){
	  arg = arguments[i];
	  _args.push(arg);
	}
	if (_args.length < length) {
	  return curry.call(this, fn, _args);
	} else {
	  return fn.apply(this, _args);
	}
  }
}
```
> 注1：var length = fn.length; // 方法参数个数 *注1
```javascript
function add (a, b, c) {
  return a + b + c;
}
console.dir(add);
```
![](https://i.imgur.com/c1ZhiPE.png)

- 使用curry函数

>这个curry方法可以解决一元柯理化的场景，不是万能的


```javascript
function add (a, b) {
 return a + b;
}
var curryAdd = curry(add);
var curryAdd5 = curry(add, [5]);
console.log(curryAdd(5)(10)); // 15
console.log(curryAdd5(10)); // 15
```

```javascript
function add (a, b, c) {
  return a + b + c;
}
var curryAdd = curry(add);
var curryAdd5 = curry(add, [5]);
console.log(curryAdd(5)(10)(15)); // 30
console.log(curryAdd(5,10)(15)); // 30
console.log(curryAdd(5)(10,15)); // 30
console.log(curryAdd(5,10,15));	// 30
console.log(curryAdd5(10)(15));	// 30
```
## 最后

创建了一个前端学习交流群，感兴趣的朋友，一起来嗨呀！
![](https://i.imgur.com/qbcaSEh.png)
