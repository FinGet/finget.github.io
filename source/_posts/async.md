---
title: JavaScript从初级往高级走系列————异步
date: 2018-05-21 14:38:23
type: "tags"
tags:
	- JS
categories: "JS"
description: "JavaScript从初级往高级走系列，一次学习记录吧，一直在路上"
---

# 异步

- 什么是单线程，和异步有什么关系
- 什么是event-loop
- 是否用过jQuery的Deferred
- Promise的基本使用和原理
- 介绍一下async/await(和Promise的区别、联系)
- 异步解决方案

## 什么是单线程，和异步有什么关系

> 单线程-只有一个线程，只做一件事。JS之所以是单线程，取决于它的实际使用，例如JS不可能同添加一个DOM和删除这个DOM，所以它只能是单线程的。

```javascript
console.log(1);
alert(1);
console.log(2);
```

上面这个例子中，当执行了`alert(1)`,如果用户不点击确定按钮，`console.log(2)`是不会执行的。

> 为了利用多核CPU的计算能力，HTML5提出`WebWorker`标准，允许JavaScript脚本创建多个线程，但是子线程完全受主线程控制，且不得操作DOM。所以，这个新标准并没有改变JavaScript单线程的本质。

## js异步

```javascript
console.log(100);
setTimeout(function(){
  console.log(200);
},1000)
console.log(300);
console.log(400);
console.log(400);
.... // 这里来很多很多个console.log(400); 结果就是打印完所有的400，等一秒再打印200
```

## event-loop

![event-loop](http://www.ruanyifeng.com/blogimg/asset/2014/bg2014100802.png)

### 文字解释

- 事件轮询，JS实现异步的具体解决方案
- 同步代码，直接执行
- 异步函数先放在异步队列中
- 待同步函数执行完毕，轮询执行 异步队列 的函数

上面那个例子的执行效果就是这样的：
![](https://i.imgur.com/eAYeNea.png)
实例分析：
![](https://i.imgur.com/tW0BkDD.png)
![](https://i.imgur.com/EJ4jsZc.png)

> 这个例子中有两种情况，取决于ajax的返回时间，如果ajax时间小于100ms它就先放进异步队列

## Jquery Deferred

### Jquery1.5前后的变化

```javascript
var ajax = $.ajax({
  url: 'data.json',
  success: function(){
    console.log('success1');
    console.log('success2');
    console.log('success3');
  },
  error: function(){
    console.log('error');
  }
})

console.log(ajax); // 返回一个xhr对象
```

```javascript
// 链式操作
var ajax = $.ajax('data.json');
ajax.done(function(){
  console.log('success1');
}).fail(function(){
  console.log('error');
}).done(function(){
  console.log()
})

console.log(ajax); // 返回一个deferred对象
```

- 无法改变JS异步和单线程的本质
- 只能从写法上杜绝callback这种形式
- 它是一种语法糖形式，但是解耦了代码
- 很好的体现：开放封闭原则（对扩展开放，对修改封闭）

### 使用Jquery Deferred

```javascript
// 给出一段非常简单的异步操作代码，使用setTimeout函数
var wait = function(){
  var task = function(){
    console.log('执行完成)
  }
  setTimeout(task, 2000);
}
wait();
```

新增需求：要在执行完成之后进行某些特别复杂的操作，代码可能会很多，而且分好几个步骤

```javascript
function waitHandle(){
  var dtd = $.Deferred(); // 创建一个deferred对象
  
  var wait = function(dtd){ // 要求传入一个deferred对象
    var task = function(){
      console.log('执行完成');
      dtd.resolve(); // 表示异步任务已经完成
      // dtd.reject(); // 表示异步任务失败或出错
    }
    setTimeout(task, 2000);
    return dtd; // 要求返回deferred对象
  }
  
  // 注意，这里一定要有返回值
  return wait(dtd);
}

var w = waitHandle();
w.then(function(){
  console.log('ok 1');
}, function(){
  console.log('err 1');
}).then(function(){
  console.log('ok 2');
}, function(){
  console.log('err 2');
})
```

当执行dtd.reject()时：

```javascript
var w = waitHandle();
w.then(function(){
  console.log('ok 1');
}, function(){
  console.log('err 1');
})
// 不能链式
w.then(function(){
  console.log('ok 2');
}, function(){
  console.log('err 2');
})
```

上面封装的`waitHandle`方法,由于直接返回了`dtd`（deferred对象），所以用户可以直接调用`w.reject()`方法，导致无论是成功还是失败，最后都走失败。

```javascript
// 修改
function waitHandle(){
  var dtd = $.Deferred();
  var wait = function(dtd){
    var task = function(){
      console.log('执行完成');
      dtd.resolve(); 
    }
    setTimeout(task, 2000);
    return dtd.promise(); // 注意这里返回的是promise，而不是直接返回deferred对象
  }
  return wait(dtd);
}
```

> ES6的Promise：[点这里](https://finget.github.io/2018/03/08/promise/)

```javascript
// promise封装一个异步加载图片的方法
function loadImg(src) {
  var promise = new Promise(function(resolve,reject){
    var img = document.createElement('img');
    img.onload = function(){
      resolve(img)
    }
    img.onerror = function(){
      reject('图片加载失败')
    }
    img.src = src;
  })
  return promise;
}
```


### async/await

> 这是ES7提案中的，现在babel已经开始支持了，koa也是用async/await实现的。

- then 只是将callback拆分了
- async/await 是最直接的同步写法

```javascript
// 伪代码
const load = async function(){
  const result1 = await loadImg(src1);
  console.log(result1);
  const result2 = await loadImg(src2);
  console.log(result2);
}
load();
```
## 最后

创建了一个前端学习交流群，感兴趣的朋友，一起来嗨呀！
![](https://ws1.sinaimg.cn/large/006tNc79gy1g2qi8r9stqj30a50dwdkq.jpg)
