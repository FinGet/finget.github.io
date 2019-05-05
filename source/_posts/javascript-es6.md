---
title: JavaScript从初级往高级走系列————ES6
date: 2018-05-10 11:50:50
type: "tags"
tags:
	- JS
categories: "JS"
description: "JavaScript从初级往高级走系列，一次学习记录吧，一直在路上"
---

## ES6

> 现在基本上开发中都在使用ES6，浏览器环境支持不好，可以用babel插件来解决。

采用‘二八定律’，主要涉及ES6常用且重要的部分。

### 问题： 
- ES6模块化如何使用，开发环境如何打包
- Class和普通构造函数有何区别
- Promise的基本使用和原理
- 总结一下ES6其他常用功能

### ES6模块化如何使用，开发环境如何打包

#### 模块化的基本语法
```javascript
// util1.js
export default {
  a : 100
}

const str = 'hello';
export default str;
// export default const str = 'hello'; X
```
```javascript
// util2.js
export function fn1() {
  console.log('fn1');
}
export function fn2() {
  console.log('fn2');
}
export const fn3 = ()=> {
  console.log('fn3');
}
```
```javascript
// index.js
import str from './util1.js';
import {fn1 , fn2} from './util2.js';
import * as fn from './util2.js';
console.log(str);
fn1();
fn2();

fn.fn1();
fn.fn2();
```
> `export default` 默认输出这个，然后在`import`的时候就会拿到默认输出的内容。例子中默认输出的`a=100`。
>`export`多个内容，在`import`时需要使用`{}`进行引用你需要的内容。

#####  `export`和`export default`与`exports`和`module.exports`的区别

>`require`: node 和 es6 都支持的引入
>`export` / `import` : 只有es6 支持的导出引入
>`module.exports` / `exports`: 只有 node 支持的导出



1. `module.exports` 初始值为一个空对象 {}
 2. `exports` 是指向的 `module.exports` 的引用
 3. `require()` 返回的是 `module.exports` 而不是 `exports`



`Node`里面的模块系统遵循的是CommonJS规范。

>CommonJS定义的模块分为: 模块标识(`module`)、模块定义(`exports`) 、模块引用(`require`)

在nodejs，`exports` 是 `module.exports`的引用，初始化时，它们都指向同一个`{}`对象。

对象在JS中属于引用类型，意思就是`exports`和`module.exports`是指向同一个内存地址的。
![](https://i.imgur.com/pA9FAlZ.png)

看下面的例子：
```javascript
exports.fn = function(){
  console.log('fn');
}
// 这两种情况的效果是一样的，上面说了exports与`module.exports初始化同一个对象，所以两种定义方就是给这个同对象定义了一个fn的属性，该属性值为一个函数。
module.exports.fn = function(){
  console.log('fn');
}
```

```javascript
exports = function(){
  console.log('fn');
}
// 这两种情况就不一样了。上面的exports想当于指向了另一个内存地址。而下面这种情况是可以正常导出的。
module.exports = function(){
  console.log('fn');
}
```

> **exports对象是当前模块的导出对象，用于导出模块公有方法和属性。别的模块通过require函数使用当前模块时得到的就是当前模块的exports对象。**



- module.exports 的使用

```javascript
// sayHello.js

function sayHello() {
  console.log('hello');
}

module.exports = sayHello;

// app.js
var sayHello = require('./sayHello');

sayHello();
```

定义一个sayHello模块，模块里定义了一个sayHello方法，通过替换当前模块exports对象的方式将sayHello方法导出。
在app.js中加载这个模块，得到的是一个函数，调用该函数，控制台打印hello。


```javascript
// sayWorld.js
module.exports = function(){
  console.log('world');
}
// app.js
var sayWorld = require('./sayWorld'); // 匿名替换
sayWorld();
```

- exports 导出多个变量

当要导出多个变量怎么办呢？这个时候替换当前模块对象的方法就不实用了，我们需要用到exports对象。

```javascript
// userExports.js
exports.a = function () {
  console.log('a exports');
}
 
exports.b = function () {
  console.log('b exports');
}

// app.js
var useExports = require('./userExports');
useExports.a();
useExports.b();
// a exports
// b exports
```
当然，将useExports.js改成这样也是可以的:
```javascript
// userExports.js
module.exports.a = function () {
  console.log('a exports');
}
 
module.exports.b = function () {
  console.log('b exports');
}
```
> 在实际开发当中可以只使用`module.exports`避免造成不必要的问题。

#### 开发环境配置
##### babel
[Babel中文网](https://babeljs.cn/)

- nodejs环境 npm init
- npm i babel-core babel-preset-es2015 babel-preset-latest --save-dev
- 创建.babelrc文件
- npm i --global babel-cli

```javascript
// .babelrc
{
  "presets": ["es2015","latest"],
  "plugins": []
}
```
##### webpack
[四大维度解锁webpack3笔记](https://finget.github.io/2018/02/08/webpack/)
##### rollup.js
[Rollup.js官网](http://www.rollupjs.com/)

- `npm init`
- 安装 `rollup.js`需要的一些插件
`npm i rollup rollup-plugin-node-resolve rollup-plugin-babel babel-core babel-plugin-external-helpers babel-preset-latest --save-dev`
- 配置 .babelrc
- 配置 rollup.config.js

> rollup 功能单一（打包js模块化）， webpack功能强大
> 工具尽量功能单一，可继承，可扩展

```javascript
// .babelrc
{
  "presets":[
    ["latest", {
      "es2015":{
        "modules": false
      }
    }]
  ],
  "plugins":["external-helpers"]
}
```

```javascript
// rollup.config.js
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'src/index.js',
  format: 'umd',
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    })
  ],
  dest: 'build/bundle.js'
}
```
```javascript
// package.json
...
"scripts":{
  "start": "rollup -c rollup.config.js"
}
...
```
`npm run start`


#### 关于JS众多模块化标准

- 没有模块化
- AMD成为标准，require.js
- 前端打包工具，使得nodejs模块化（CommonJS）可以被使用
- ES6出现，想统一现在所有模块化标准
- nodejs积极支持，浏览器尚未统一
- 你可以自造lib，但是不要自造标准！！！

### Class和普通构造函数有何区别
#### JS构造函数

```javascript
// 构造函数
function MathHandle(x, y){
  this.x = x;
  this.y = y;
}
// 原型扩展
MathHandle.prototype.add = function(){
  return this.x + this.y;
}

// 创建实例
var m = new ManthHandle(1,2);
console.log(m.add()); // 3
```

#### Class基本语法
```javascript
class MathHandle { // 直接跟大括号
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  
  add() {
    return this.x + this.y;
  }
}
const m = new ManthHandle(1,2);
console.log(m.add()); // 3
```
#### 语法糖
> `typeof MathHandle`  = `'function'`
> `MathHandle`其实是个`function`,‘构造函数’
> `MathHandle` === `MathHandle.prototype.constructor`

### 继承
#### 原生js继承
```javascript
// 动物
function Animal() {
  this.eat = function() {
    console.log('animal eat');
  }
}
// 狗
function Dog() {
  this.bark = function(){
    console.log('dog bark');
  }
}
// 绑定原型，实现继承
Dog.prototype = new Animal();
// 实例化一只狗
var hashiqi = new Dog();

// hashiqi就有了eat方法
hashiqi.eat(); // animal eat
```
> 廖雪峰老师的原型继承：[点这里](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/0014344997013405abfb7f0e1904a04ba6898a384b1e925000)

#### ES6继承

```javascript
class Animal {
  constructor(name){
    this.name = name;
  }
  eat() {
    console.log(`${this.name} eat`);
  }
}

class Dog extends Animal { // extends 继承
  constructor(name){
    super(name); // 必须*  记得用super调用父类的构造方法!
    this.name = name;
  }
  say() {
    console.log(`${this.name} say`);
  }
}

const dog = new Dog('hashiqi');
dog.eat(); // hashiqi eat
```
### Promise 的基础使用

> 解决回调地狱（Callback Hell）
> 详细点的Promise：[点这里](https://finget.github.io/2018/03/08/promise/)

#### Promise 基础语法
```javascript
new Promise((resolve, reject) => {
  // 一段耗时很长的异步操作
	.....
  resolve(); // 数据处理完成
  reject(); // 数据处理出错
}).then(function A() {
  // 成功，下一步
}, function B(){
  // 失败，做相应处理
})
```
>我最开始接触到`Promise`的时候，一直傻了吧唧的在想`resolve()`和`reject()`在什么时候调用。
`resolve()`和`reject()`就是为后面`then()`中的两个函数服务的。

#### resolve和reject
```javascript
new Promise((resolve, reject) => {
  setTimeout(()=>{
    resolve('good，我要传给then里的一个函数');
  },2000);
  setTimeout(()=>{
    reject('错了，把我给我then里的第二个函数');
  },2000);
}).then(value => {
  console.log(value); // good，我要传给then里的一个函数
},value => {
  console.log(value); // 错了，把我给我then里的第二个函数
});
```

#### 来个实际的例子

```javascript
/**
 * 基于jquery封装一个promise ajax请求
 * @param  {[type]} param [选项]
 * @return {[type]}       [description]
 */
request(param){
  return new Promise((resolve,reject) => {
    $.ajax({
      type : param.type || 'get',
      url : param.url || '',
      dataType : param.dataType || 'json',
      data : param.data || null,
      success:(res)=>{ // 用箭头函数避免this指向问题
        if (0 === res.status) {
	       typeof resolve === 'function'&&resolve(res.data, res.msg); // 成功就把请求到的数据用resolve返回，这样就可以在then的第一个函数里拿到值了
        } else {
	       typeof reject === 'function'&&reject(res.msg || res.data); // 失败就返回错误信息
        }

      },
      error:(err)=>{ // 这个失败是请求失败，上面那个失败是请求成功发送了，但是没有拿到数据失败了
	     typeof reject === 'function'&&reject(err.statusText);
      }
    })
  })
}
```

### ES6常用其他功能

#### let/const

>`let` `const`与`var`都是用来定义变量的，不同的是`let`自带作用域，`const`不能重复赋值。

```javascript
let name = 'FinGet'
while (true) {
    let name = 'GetFin'
    console.log(name)  //GetFin
    break
}
console.log(name)  //FinGet
```
> `let`定义的变量只在包含它的代码块内有用

```javascript
const PI = 3.1415926;
PI = 3.14; // 错误
```

#### 多行字符串/模板变量

```javascript
let name = 'FinGet';
let age = 22;
// js
var str = '我是'+ name+',今年'+age+'岁'; // 很麻烦

let str1 = `我是${name},今年${age}岁`; // 简单多了
```

> 模板字符串就是用``（Tab键上面那个）包含，变量就是用`${}`表示

#### 解构赋值

```javascript
let obj = {
  name: 'FinGet',
  age: 22,
  job: '前端',
  addr: '成都'
}
let {name,age} = obj;
console.log(name); // FinGet
console.log(age); // 22
```

还可以反过来：
```javascript
let  name = 'FinGet';
let  age = 22;
let  job = '前端';
let  addr = '成都';

let obj = {name,age,job,addr};
//obj = {name: 'FinGet',age: 22,job: '前端',addr: '成都'}
```
#### 块级作用域

另外一个`var`带来的不合理场景就是用来计数的循环变量泄露为全局变量，看下面的例子：
```javascript
// js
var a = [];
for (var i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a[6](); // 10
```
> let 自带块级作用域

```javascript
// ES6
var a = [];
for (let i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a[6](); // 6
```
原生js想实现这种效果，需要用到闭包：

```javascript
var a = [];
for (var i = 0; i < 10; i++) {
  (function(j){ // 立即执行函数
    a[j] = function() {
      console.log(j);
    }
  }(i))
}
a[6](); // 6
```
> 立即执行函数形成了一个块级作用域，将参数j保存了下来，并不会被‘污染’，原生js没有块级作用域，`var`在`for`中定义的变量是个全局变量，可以在外部访问，也就可以被改变，所以每次`for`循环都是重置修改`i`的值，导致最后只能输出10。

#### 函数默认参数与rest

> `default`很简单，意思就是默认值。大家可以看下面的例子，调用animal()方法时忘了传参数，传统的做法就是加上这一句`type = type || 'cat' `来指定默认值。

```javascript
function animal(type){
    type = type || 'cat'  
    console.log(type)
}
animal()
```
如果用ES6我们而已直接这么写：

```javascript
function animal(type = 'cat'){
    console.log(type)
}
animal(); // cat
```
最后一个rest语法也很简单，直接看例子：

```javascript
function animals(...types){
    console.log(types)
}
animals('cat', 'dog', 'fish') //["cat", "dog", "fish"]
```
> 而如果不用ES6的话，我们则得使用ES5的arguments。

#### 箭头函数

```javascript
// js函数
function (a,b){
  console.log(a+b);
}
```

```javascript
// es6箭头函数
(a,b) => {
  console.log(a+b);
}
```

> 把`function`去掉，在`()`与`{}`之间加上`=>`

---

> 当我们使用箭头函数时，函数体内的`this`对象，就是定义时所在的对象，而不是使用时所在的对象。
并不是因为箭头函数内部有绑定this的机制，实际原因是箭头函数根本没有自己的`this`，它的`this`是继承外面的，因此内部的`this`就是外层代码块的`this`。

## 最后

创建了一个前端学习交流群，感兴趣的朋友，一起来嗨呀！
![](https://ws1.sinaimg.cn/large/006tNc79gy1g2qi8r9stqj30a50dwdkq.jpg)