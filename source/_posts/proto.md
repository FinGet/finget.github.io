---
title: 原型，原型链，call/apply
date: 2018-09-13 14:16:39
type: "tags"
tags:
	- JS
categories: "JS"
description: "重新理解一下原型与原型链"
---

> [JavaScript从初级往高级走系列————prototype](https://finget.github.io/2018/05/10/javascript-prototype/)

## 原型

> 定义： 原型是function对象的一个属性，它定义了构造函数制造出的对象的公共祖先。通过该构造函数产生的对象，可以继承该原型的属性和方法。**原型也是对象。**

用一张图简单解释一下定义。
![](https://i.imgur.com/pCqIPWN.png)

1. 每个函数上面都有一个原型属性(prototype)，这个属性会指向构造函数的原型对象(Person.prototype)
2. 每个函数的原型对象(Person.protorype)默认都有一个constructor属性指向构造函数本身(Person)
3. 每个实例都有一个隐式原型(__proto__)指向构造函数的原型对象(Person.prototype)
4. 每个原型对象也有隐式原型(__proto__)

```javascript
// 构造函数
function Person() {
  this.LastName = 'zhang'
}
// Person.prototype  --- 原型 (自带的，当定义了构造函数，它就孕育而生了)
// Person.prototype = {} --- 原型对象 是祖先
Person.prototype.name = 'xiaoming';
var person = new Person()
var person1 = new Person()
console.log(person.name); // xiaoming (它自己没有，就会到原型(祖先)上去找)
console.log(person1.LastName); // zhang (它自己有，就会取自身的)
```

### constructor

```javascript
function Person() {
}
var person = new Person()
console.log(person.constructor) // function Person() {} 
// person自己没有constructor,所以继承至原型
```
Person.prototype:
![](https://i.imgur.com/HA2kE3X.png)

> 图中浅紫色的都是自带的

```javascript
function Person() {
}
function Car() {
}
Person.prototype.constructor = Car; // 改变constructor
var person = new Person()
console.log(person.constructor) // function Car() {}
```

### __proto__

```javascript
// __proto__
function Person() {
	
}
Person.prototype.name = 'zhangsan'
var person = new Person()
console.log(person.__proto__)
```

![](https://i.imgur.com/CevHIfG.png)

#### new

New的过程
1. 声明一个中间对象
2. 将中间对象的原型指向构造函数的原型
3. 将构造函数的this指向中间对象
4. 返回中间对象，即实例对象

[JavaScript —— New](https://finget.github.io/2018/02/27/new/)

```javascript
function DNew() {
  // var obj = {}; // var obj = new Object() 创建一个空对象 
  // var obj = Object.create(null);
  Constructor = [].shift.call(arguments); // 获取第一个参数即构造函数
  // obj.__proto__ = Constructor.prototype; 
  var obj = Object.create(Constructor.prototype);
  var result = Constructor.apply(obj, arguments); 
  return typeof result === 'object' ? result || obj : obj; // 返回对象
}
```

```javascript
在通过new 一个实例对象时：
function Person() {
  var this = {
    __proto__ : Person.prototype
  }
}
```
![](https://i.imgur.com/wte5wno.png)

> `person.__proto__` 与 `Person.prototype`是指向**同一个内存地址**，这也就是 为什么实例没有属性或方法会到原型上去查找

```javascript
function Person() {
	
}
Person.prototype.name = 'zhangsan'
var person = new Person()
Person.prototype.name = 'lisi'
console.log(person.name) // ???
```

```javascript
function Person() {
	
}
Person.prototype.name = 'zhangsan'
var person = new Person()
Person.prototype = {
  name : 'lisi'
}
console.log(person.name) // ???
```

## 原型链

先扔一张图：
![](https://i.imgur.com/n00mTEp.png)

```javascript
Person.prototype.__proto__ : Object.prototype
```

![](https://i.imgur.com/geOTuN7.png)

例子：
```javascript
function Grand() {

}
Grand.prototype.lastName = "zhang"
var grand = new Grand()

function Father() {

}
Father.prototype = grand // Father的原型指向grand对象
var father = new Father()

function Son() {

}
Son.prototype = father // Son的原型指向father
var son = new Son()
```

![](https://i.imgur.com/I7oOvUi.png)

> 上图中红线表示的就是原型链了

### Object.create()

```javascript
// Object.create(原型)
var obj = {name: 'zhang',age: 23}
var obj1 = Object.create(obj)

Person.prototype.name = 'zhang'
function Person() {}
var person = Object.create(Person.prototype)
```

![](https://i.imgur.com/gYLt4y8.png)
> `Object.create(null)`,null就是一个空对象，没有原型。这也是·typeof null == 'object'的原因

## toString

> `undefined`和`null`没有`toString()`

```javascript
true.toString()

'abc'.toString()

var num = 123
num.toString()
// 123.toString() 试一试会怎样

var obj = {}
obj.toString() // "[object Object]"
```

toString来自哪？？
```javascript
var num = 123
// num.toString(); --> new Number(num).toString()
// Number重写 toString
Number.prototype.toString = function() {}

// Number.prototype.__proto__ = Object.prototype
```

```javascript
function Person(){}
Person.prototype.toString = function () {
  return '重写toString'
}
var person = new Person()
person.toString() // '重写toString'

// Object.prototype.toString
// Number.prototype.toString
// Array.prototype.toString
// Boolean.prototype.toString
// String.prototype.toString
```

toString隐藏功能：判断变量、对象的类型
![](https://i.imgur.com/wN3E3GW.png)

## call/apply

```javascript
function Person(name, age) {
  this.name = name
  this.age = age
}
var person = new Person('zhang', 23)
var obj = {}
Person.call(obj,'wang',30) // this指向obj
// obj = {age:30,name:"wang"}
```

> call/apply不仅改变了this的指向，还会执行对应的方法

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

## 最后

创建了一个前端学习交流群，感兴趣的朋友，一起来嗨呀！
![](<https://image-static.segmentfault.com/207/665/2076650181-5bfe3d1a48e89_articlex>)