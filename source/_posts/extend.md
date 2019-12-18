---
title: 原生javascript实现extend
date: 2018-02-06 10:59:44
type: "tags"
tags:
	- JS
categories: "JS"
description: "原生javascript实现extend;es6之Object.assign;call 和 apply"
---

## 代码
```javascript
var obj1 = {'a': 'obj2','b':'2'};
var obj2 = {name: 'obj3'};
function extend() {
	var length = arguments.length;
	var target = arguments[0] || {};
	if (typeof target!="object" && typeof target != "function") {
		target = {};
	}
	if (length == 1) {
		target = this;
		i--;
	}
	for (var i = 1; i < length; i++) { 
		var source = arguments[i]; 
		for (var key in source) { 
			// 使用for in会遍历数组所有的可枚举属性，包括原型。
			if (Object.prototype.hasOwnProperty.call(source, key)) { 
				target[key] = source[key]; 
			} 
		} 
	}
	return target; 
}
console.log(extend(obj1,obj2));
```
![](https://i.imgur.com/joi66PN.png)
>extend 要实现的是给任意对象扩展

## 分析一下 
在extend()函数中没有写死参数，是为了更好的扩展性，永远也不知道需要扩展的对象有几个。
而是通过arguments来获取传进来的参数。
>arguments对象不是一个 Array 。它类似于Array，但除了length属性和索引元素之外没有任何Array属性。

```javascript
// 可以转换为数组 ES2015
const args = Array.from(arguments);

console.log(typeof arguments); // 'object'
```
### target
target是传进来的第一个参数，也就是需要扩展的对象。
```javascript
var target = arguments[0] || {}; // 如果没有传参，则设为一个空对象

// 进行这一步判断是为了保证代码的可执行性，如果传进来的是个数字、布尔值，则设为一个空对象
if (typeof target!="object" && typeof target != "function") {
	target = {};
}
```
### 循环遍历赋值
```javascript
for (var i = 1; i < length; i++) { 
	var source = arguments[i]; 
	for (var key in source) { 
		// 使用for in会遍历数组所有的可枚举属性，包括原型。
		if (Object.prototype.hasOwnProperty.call(source, key)) { 
			target[key] = source[key]; 
		} 
	} 
}
```
这一步就是将扩展源里的属性、方法循环遍历赋值到扩展项中。
>如果扩展项和扩展源中有相同的属性、方法，后面的会覆盖前面的。 这个思想也是插件开发中，实现用户配置覆盖默认设置的实现思想。

### hasOwnProperty
为什么需要使用hasOwnProperty，这跟`for in`有密切关系。
>使用for in会遍历所有的可枚举属性，包括原型。

所以需要判断一下，是否是对象自身的属性，而不是继承于原型的。

### 那为什么不直接使用`source.hasOwnProperty(source[key])`呢？

JavaScript 并没有保护 hasOwnProperty 属性名，因此某个对象是有可能存在使用这个属性名的属性，使用外部的 hasOwnProperty 获得正确的结果是需要的：
```javascript
var foo = {
    hasOwnProperty: function() {
        return false;
    },
    bar: 'Here be dragons'
};

foo.hasOwnProperty('bar'); // 始终返回 false

// 如果担心这种情况，可以直接使用原型链上真正的 hasOwnProperty 方法
({}).hasOwnProperty.call(foo, 'bar'); // true

// 也可以使用 Object 原型上的 hasOwnProperty 属性
Object.prototype.hasOwnProperty.call(foo, 'bar'); // true
```

### call apply
上面用到的call和apply，就在这里记录一下。
>1.每个函数都包含两个非继承而来的方法：call()方法和apply()方法。
2.相同点：这两个方法的作用是一样的。
都是在特定的作用域中调用函数，等于设置函数体内this对象的值，以扩充函数赖以运行的作用域。
一般来说，this总是指向调用某个方法的对象，但是使用call()和apply()方法时，就会改变this的指向。
3.不同点：接收参数的方式不同。
- apply()方法 接收两个参数，一个是函数运行的作用域（this），另一个是参数数组。
语法：apply([thisObj [,argArray] ]);，调用一个对象的一个方法，2另一个对象替换当前对象。
说明：如果argArray不是一个有效数组或不是arguments对象，那么将导致一个TypeError，如果没有提供argArray和thisObj任何一个参数，那么Global对象将用作thisObj。
- call()方法 第一个参数和apply()方法的一样，但是传递给函数的参数必须列举出来。
语法：call([thisObject[,arg1 [,arg2 [,...,argn]]]]);，应用某一对象的一个方法，用另一个对象替换当前对象。
说明： call方法可以用来代替另一个对象调用一个方法，call方法可以将一个函数的对象上下文从初始的上下文改变为thisObj指定的新对象，如果没有提供thisObj参数，那么Global对象被用于thisObj。

``` javascript
// call
    window.name = 'FinGet';
    document.name = 'FinGet1';

    var boy = {name: 'FinGet2' };
    function showName(){
        console.log(this.name);
    }

    showName.call();         //FinGet (默认传递参数)  this 是指向window
    showName.call(window);   //FinGet
    showName.call(document); //FinGet1
    showName.call(this);     //FinGet
    showName.call(boy);       //FinGet2

    var Pet = {
        words : 'hello',
        speak : function (say) {
            console.log(say + ''+ this.words)
        }
    }
    Pet.speak('Speak'); // 结果：Speakhello

    var Dog = {
        words:'Wang'
    }

    //将this的指向改变成了Dog
    Pet.speak.call(Dog, 'Speak'); //结果： SpeakWang
```
可以将上面代码中的call换成apply，也是可以执行的。


## Object.assign
>Object.assign(target, ...sources)
- target 目标对象
- sources 源对象

>如果目标对象中的属性具有相同的键，则属性将被源中的属性覆盖。后来的源的属性将类似地覆盖早先的属性。
注意，Object.assign 会跳过那些值为 null 或 undefined 的源对象。

``` javascript
var obj1 = {a:'1',b:'2'};
var obj2 = {c:'3',d:'4'};
Object.assign(obj1,obj2); // Object {a: "1", b: "2", c: "3", d: "4"}

obj1 也改变
Object {a: "1", b: "2", c: "3", d: "4"}

obj2
Object {c: "3", d: "4"}
```
更多相关Object.assign可以[查看官网。](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
