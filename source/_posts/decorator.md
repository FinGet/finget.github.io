---
title: JavaScript设计模式之装饰器模式
date: 2018-11-22 17:41:36
type: "tags"
tags:
	- JS
	- 设计模式
categories: "设计模式"
description: "学习设计模式笔记————JavaScript设计模式之装饰器模式"
---
## 装饰器模式

> 为对象添加新功能；不改变其原有的结构和功能。

手机壳就是装饰器，没有它手机也能正常使用，原有的功能不变，手机壳可以减轻手机滑落的损耗。
![](https://i.imgur.com/16vwyqI.png)

### 代码示例

```javascript
class Circle {
  draw() {
    console.log('画一个圆形')
  }
}
class Decorator {
  constructor(circle) {
    this.circle = circle
  }
  draw() {
    this.circle.draw()
    this.setRedBorder(circle)
  }
  setRedBorder(circle) {
    console.log('设置红色边框')
  }
}

// 测试
let circle = new Circle()
circle.draw()

let decorator = new Decorator(cicle)
decorator.draw()
```

### ES7装饰器

```javascript
// 简单的装饰器
@testDec // 装饰器
class Demo {}

function testDec(target){
  target.isDec = true
}
console.log(Demo.isDec) // true
```

```javascript
// 装饰器原理
@decorator
class A {}

// 等同于
class A {}
A = decorator(A) || A; // 把A 作为参数，返回运行的结果
```

```javascript
// 传参数
function testDec(isDec) {
  return function(target) { // 这里要 return 一个函数
    target.isDec = isDec;
  }
}
@testDec(true)
class Demo {
  // ...
}
alert(Demo.isDec) // true
```
#### 装饰类
```javascript
function mixins(...list) {
  return function (target) {
    Object.assign(target.prototype, ...list)
  }
}
const Foo = {
  foo() {
    console.log('foo')
  }
}
@mixins(Foo)
class MyClass{}

let myclass = new MyClass()
myclass.foo() // 'foo'
```
#### 装饰方法

```javascript
// 例1 只读
function readonly(target, name, descriptor){
  // descriptor对象原来的值如下
  // {
  //   value: specifiedFunction,
  //   enumerable: false, // 可枚举
  //   configurable: true, // 可配置
  //   writable: true // 可写
  // };
  descriptor.writable = false;
  return descriptor;
}

class Person {
  constructor() {
    this.first = 'A'
    this.last = 'B'
  }

  @readonly
  name() { return `${this.first} ${this.last}` }
}

var p = new Person()
console.log(p.name())
p.name = function () {} // 这里会报错，因为 name 是只读属性
```

```javascript
// 例2 打印日志
function log(target, name, descriptor) {
  var oldValue = descriptor.value;

  descriptor.value = function() {
    // 1. 先打印日子
    console.log(`Calling ${name} with`, arguments);
    // 2. 执行原来的代码，并返回
    return oldValue.apply(this, arguments);
  };

  return descriptor;
}

class Math {
  @log
  add(a, b) {
    return a + b;
  }
}

const math = new Math();
const result = math.add(2, 4);
console.log('result', result);
```

[成熟的装饰器库](https://github.com/jayphelps/core-decorators)
