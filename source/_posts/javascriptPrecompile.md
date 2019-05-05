---
title: JavaScript的预编译过程
date: 2018-03-01 17:28:25
type: "tags"
tags:
	- JS
categories: "JS"
description: "通过JavaScript的预编译过程，充分理解变量提升"
---


>JavaScript在运行时，要经历三步
>
>1. 语法分析 2.预编译 3.解析执行(自上而下)

## JavaScript预编译

先思考这么一个题
``` javascript
function fn (a) {
  console.log(a);

  var a = 123;

  console.log(a);
  
  function a(){};

  console.log(a);

  var b =function (){};

  console.log(b);
}
fn(1);
```

### 预编译四部曲
1. 创建AO对象 Activation Object（执行期上下文）
2. 找形参和变量声明，将变量和形参名作为AO属性名，值为undefined
3. 将实参值和形参统一
4. 在函数体里面找函数声明，值赋予函数体

这四步的权重比4>3>2>1,也就是一个覆盖的过程.
函数声明在变量声明的前面

>函数声明才存在变量提升。即`function a(){};`,而`var b =function (){};`不会提升。

### 详细分析

#### 先看一个面试中常遇到的问题

```javascript
console.log(a); // function a(){}
var a = 1;
function a(){};
```
逐行执行，在AO中是：
```javascript
AO{
  a: undefied
}
AO{
  a: function(){}
}
```
#### 换一换



```javascript
var a = 1;
console.log(a); // 1
function a(){};
```
逐行执行，在AO中是：
```javascript
AO{
  a: undefied
}

AO{
  a: function(){}
}

// js是自上而下执行的，先执行var a = 1; 所有AO中的a就被覆盖
AO{
  a: 1
}
```


#### 按步骤分析文章开头的例子

- 第一步

```javascript
AO{
}
```
- 第二步

```javascript
AO{
  a: undefined,
  b: undefined
}
```
- 第三步

```javascript
AO{
  a: 1,
  b: undefined
}
```
- 第四步

```javascript
AO{
  a: function a(){},
  b: undefined
}
```
## 解释执行
执行的时候：
```javascript
AO{
  a: function a(){},
  b: undefined
}
// a = 123;
AO{
  a: 123,
  b: undefined
}
```

### 结果:
```javascript
function fn (a) {
  console.log(a); // function(){}

  var a = 123;

  console.log(a); // 123
  
  function a(){};

  console.log(a); // 123

  var b =function (){};
 
  console.log(b); // function(){}
}
fn(1);
```


## 加入window,全局环境

```javascript
global = 100;
function fn() {
  console.log(global);
  global = 200;
  console.log(global);
  var global = 300;
}
fn();
var global;
```

在全局环境中会生成一个 GO对象 （Global Object），还是按照上面的四步执行。
```javascript
GO {
  global: undefined  
}
```
// 执行到 `global = 100` :
```javascript
GO {
  global: 100  
}
```

当执行`fn`之前会先生成一个AO:
```javascript
AO {
  global: undefined  
}
```
所以第一次打印`global`是`undefined`。
>这个时候虽然全局变量中的`global`已经是`100`,但是`fn`函数中自己有`global`变量，所以不会引用全局中的。

当执行到`global = 200` :

```javascript
AO {
  global: 200  
}
```
所以第二次打印`global`是`200`

> 这里这中情况涉及到了‘作用域’。

## 作用域

>  JavaScript 采用的是词法作用域，函数的作用域在函数定义的时候就决定了。

词法作用域是一种静态作用域

```javascript
var value = 1;

function foo() {
    console.log(value);
}

function bar() {
    var value = 2;
    foo();
}

bar();
```

这个例子的结果：1
### 按静态作用域来分析

执行 foo 函数，先从 foo 函数内部查找是否有局部变量 value，如果没有，就根据书写的位置，查找上面一层的代码，也就是 value 等于 1，所以结果会打印 1。

### JavaScript的预编译过程来分析

这里有全局的环境：
```javascript
// 这里我就写最后一步了
GO {
  value: 1,
  foo: function() {console.log(value)},
  bar: function() {var value = 2; foo()}
}
// 函数在执行时也会生成自己的AO
fooAO{
  // 没有
}
barAO{
  value: 2，
  foo: foo()
}
```
![](https://i.imgur.com/BOh1hJO.png)

foo函数中没有定义value，所以它会到它所在的上一层去找，并不会去bar里面找

把这个题做一个小小的改变：

```javascript
var value = 1;

function foo() {
    console.log(value);
}

function bar() {
    value = 2;
    foo();
}

bar();
```

这样结果就是2了。
![](https://i.imgur.com/JPpPtMu.png)

在bar函数中不定义value，而是让它直接改变value的值，他自己没有定义，它也会去全局GO里面找，这样bar里面的value和全局中的value就是同一个内存中的数，当代码执行到`value=2`，再执行foo()时，全局中的value也是2，所以输出2。在第一种，情况中，`var value=2`只改变了barAO中的值。

再来，我们再变一下：
```javascript
function foo() {
    console.log(value);
}

function bar() {
    value = 2;
    foo();
}

bar();
```
结果还是2.

这次我们没有全局定义value，在bar中也没有定义，而是直接赋值。在JavaScript中如果一个变量未声明就直接赋值，那么这个变量就是个全局变量。所以GO中会定义一个`value:2`,foo也没有去bar里面找value。

>静态作用域，决定的是作用域链的顺序。


## 最后思考一个问题
```javascript
function fn(){
  var a = b = 100;
  console.log(window.a);
  console.log(window.b);
}
```

>var a = b =100;
先将100赋值给b，即b=100，此时b没有声明就被赋值。

## 最后

创建了一个前端学习交流群，感兴趣的朋友，一起来嗨呀！
![](https://ws1.sinaimg.cn/large/006tNc79gy1g2qi8r9stqj30a50dwdkq.jpg)