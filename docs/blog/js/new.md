---
title: 深入理解new操作
---

>热身
New 这个关键字 是创建对象的？
JS中万物皆是对象。
new 关键字是用来继承的。 => 面向对象的基础

## new
```javascript
function DN(name, age) {
  this.name = name;
  this.age = age;
  this.salary = '30k';
}
DN.prototype.ability = 100;
DN.prototype.sayYourName = function(){
  console.log('I am' + this.name);
}
var person = new DN('张三', '18');
console.log(person.name); // 张三
person.sayYourName(); // I am张三
```

>可以得出使用过New关键字之后生成的person对象具有哪些特点。
1：可以访问DN构造函数里的属性
2：可以访问到DN.prototype中的属性

## 经典继承(构造继承)
```javascript
function Parent() {
  this.names = ['Bios', 'FinGet'];
}
function Child() {
  Parent.call(this);
}
var child1 = new Child();
child1.names.push('zhangsan');
console.log(child1.names); // ["Bios", "FinGet", "zhangsan"]

var child2 = new Child();
console.log(child2.names); // ["Bios", "FinGet"]

```
![](https://i.imgur.com/4EHPKyE.png)
## DNew
```javascript
function DNew() {
  var obj = {}; // 创建一个空对象
  Constructor = [].shift.call(arguments); // 获取第一个参数即构造函数
  obj.__proto__ = Constructor.prototype; // 隐式原型指向显式原型 将obj的原型链指向构造函数，这样onj就可以访问到构造函数原型链上的属性
  Constructor.apply(obj, arguments); // 使用apply(call)改变构造函数this的指向到新建的对象，这样obj可以访问构造函数的属性。这里的arguments是剔除了第一个参数的。
  return obj; // 返回对象
}
var person = DNew(DN,'张三', '18');
console.log(person.name); // 张三
person.sayYourName(); // I am张三

```
### 存在的问题
>构造函数是可能有返回值的！

#### 返回对象
```javascript
function DN(name, age) {
  this.name = name;
  this.age = age;
  this.salary = '30k';
  return {
  	name: name,
	salary: "30k"
  }
}
DN.prototype.ability = 100;
DN.prototype.sayYourName = function(){
  console.log('I am' + this.name);
}
var person = new DN('张三', '18');
console.log(person.name); // undefined
console.log(person.age); // undefined
person.sayYourName(); // error
```
#### 返回基本类型
```javascript
function DN(name, age) {
  this.name = name;
  this.age = age;
  this.salary = '30k';
  return "finget"
}
DN.prototype.ability = 100;
DN.prototype.sayYourName = function(){
  console.log('I am' + this.name);
}
var person = new DN('张三', '18');
console.log(person.name); // 张三
console.log(person.name); // 18
person.sayYourName(); // I am张三
```

- 当构造函数的返回值为对象时，返回的内容能取到，其他内部属性和原型上的方法都取不到。
- 当构造函数的返回值为基本类型时， 跟没写`return`语句效果一样。

### 改进DNew
```javascript
function DNew() {
  var obj = {}; // 创建一个空对象
  Constructor = [].shift.call(arguments); // 获取第一个参数即构造函数
  obj.__proto__ = Constructor.prototype; // 隐式原型指向显式原型 将obj的原型链指向构造函数，这样onj就可以访问到构造函数原型链上的属性
  var result = Constructor.apply(obj, arguments); // 使用apply(call)改变构造函数this的指向到新建的对象，这样obj可以访问构造函数的属性。这里的arguments是剔除了第一个参数的。
  return typeof result === 'object' ? result : obj; // 返回对象
}
```

### 当返回null的时候
>当构造函数返回`null`的时候，我们应该返回obj而不是result

```javascript
function DNew() {
  var obj = {}; // 创建一个空对象
  Constructor = [].shift.call(arguments); // 获取第一个参数即构造函数
  obj.__proto__ = Constructor.prototype; // 隐式原型指向显式原型 将obj的原型链指向构造函数，这样onj就可以访问到构造函数原型链上的属性
  var result = Constructor.apply(obj, arguments); // 使用apply(call)改变构造函数this的指向到新建的对象，这样obj可以访问构造函数的属性。这里的arguments是剔除了第一个参数的。
  return typeof result === 'object' ? result || obj : obj; // 返回对象
}
```
>typeof null == Object;

## 优化

>var obj = {}; => var obj = new Object();我们在封装new，却在内部使用了new，所有需要改变一下

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

## 代码过程(我自己看)
```javascript
// 热身
// New 这个关键字 是创建对象的？
// JS中万物皆是对象。
// new 关键字是用来继承的。 => 面向对象的基础

function DN(name, age) {
  this.name = name;
  this.age = age;
  this.salary = '30k';
}
DN.prototype.ability = 100;
DN.prototype.sayYourName = function(){
  console.log('I am' + this.name);
}
var person = new DN('张三', '18');
console.log(person.name);
person.sayYourName();
// 可以得出使用过New关键字之后生成的person对象具有哪些特点。
// 1：可以访问DN构造函数里的属性
// 2：可以访问到DN.prototype中的属性

// 要如何去实现
// 经典继承（借用构造函数的方式）
function Parent() {
  this.names = ['Bios', 'FinGet'];
}
function Child() {
  Parent.call(this);
}
var child1 = new Child();
child1.names.push('zhangsan');
console.log(child1.names); // ["Bios", "FinGet", "zhangsan"]

var child2 = new Child();
console.log(child2.names); // ["Bios", "FinGet"]

// 避免引用类型的属性，被所有实例对象共享

// 2、怎么获取原型链上的属性
// __proto__

function DNew() {
  // var obj = {}; // var obj = new Object() 创建一个空对象 
  // var obj = Object.create(null);
  Constructor = [].shift.call(arguments); // 获取第一个参数即构造函数
  // obj.__proto__ = Constructor.prototype; 
  var obj = Object.create(Constructor.prototype);
  var result = Constructor.apply(obj, arguments); 
  return typeof result === 'object' ? result || obj : obj; // 返回对象
}


(function(root, factory){
  root.$ = root.DN = factory();
})(this, function(){
  var DN = {
	DNew: function() {
	  // var obj = {}; // var obj = new Object() 创建一个空对象 
	  // var obj = Object.create(null);
	  Constructor = [].shift.call(arguments); // 获取第一个参数即构造函数
	  // obj.__proto__ = Constructor.prototype; 
	  var obj = Object.create(Constructor.prototype);
	  var result = Constructor.apply(obj, arguments); 
	  return typeof result === 'object' ? result || obj : obj; // 返回对象
	}
  };
  return DN;
})
```