---
title: JavaScript——Promise
date: 2018-03-08 14:08:24
type: "tags"
tags:
	- JS
	- promise
categories: "JS"
description: "JavaScript之promise异步编程"
---

## 什么是Promise
>The Promise object is used for asynchronous computations.
Promise对象用于异步计算.
A Promise represents a value which may be available now,or in the future,or never.
一个Promise表示一个现在、将来或永不可能用的值.

Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。它由社区最早提出和实现，ES6 将其写进了语言标准，统一了用法，原生提供了`Promise`对象。

### new一个promise
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

`Promise`构造函数可以接受两个参数，`resolve`和`reject`。这两个函数是，JavaScript引擎自带的，不用自己定义他们。

`Promise` 有三个状态:
1. `pending` [待定] 初始状态
2. `fulfilled` [实现]操作成功
3. `rejected` [被否决]操作失败

`resolve`的作用就是将`pending`状态 ===> `fulfilled`，`reject`的作用是讲`pending`状态 ===> `rejected`

>`Promise`状态发送改变，就会触发`.then()`里面的响应函数处理后续步骤。
`Promise`状态一经改变，就不会再变了。

## 第一个实例
```javascript
console.log('1');
new Promise((resolve, reject) => {
  setTimeout(()=>{
    resolve('hello');
  },2000);
}).then(value => {
  console.log(value + 'world');
});
```
![](https://i.imgur.com/HOJQmbs.png)
![](https://i.imgur.com/V4rR3Fs.png)

先输出1，间隔两秒输出了helloworld。

>`.then()`中的`value`正是`resolve()`中的参数。

## 在`.then()`中返回一个Promise

```javascript
console.log('1');
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('2');
  }, 2000);
}).then(value => {
  console.log(value);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('3');
    }, 2000);
  });
}).then( value => {
  console.log(value);
})
```
间隔两秒，依次输出1 2 3
![](https://i.imgur.com/hfUIOdS.png)

## 假如一个Promise 已经完成了，再.then()会怎样？？

```javascript
console.log('go');

let promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('the promise fulfilled');
    resolve('hahahahha');
  }, 1000);
});

setTimeout(() => {
  promise.then(value => {
    console.log(value);
  })
}, 3000);
```

![](https://i.imgur.com/QqQAba9.png)

>我们在任何一个地方，生成了一个`Promise`队列之后，我们可以声明一个变量，将它传递到其他地方，如果我们的操作是很明显的一个队列的状态(先进先出)，就可以在它后面追加任意多的`.then()`，不管他前面`Promise`状态是完成了还是没完成，队列都会安装固定的顺序去执行如果已完成，后面追加的`.then()`也会得到前面`Promise`返回的值。


## 假如在.then()的函数里面不返回新的Promise，会怎样？？

```javascript
console.log('1');
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('hello');
  }, 2000);
}).then(value => {
  console.log(value);
  console.log('everyone');
  (function(){ // 立即执行函数
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('2');
        resolve('hahah');
      }, 2000);
    });
  })();
  return false;
}).then(value => {
  console.log(value + '111111111');
})
```

![](https://i.imgur.com/T7IP4ZL.png)

>`.then()`接受两个函数作为参数，分别代表`fulfilled`和`rejected`. `.then()`返回一个新的`Promise`实例，所以它可以链式调用状态响应函数可以返回新的`Promise`，或其他值如果返回新的`Promise`，那么下一级`.then()`会在新`Promise`状态改变之后执行,如果返回其他任何值，则会立刻执行下一级`.then()`

## .then()里面有.then()的情况

```javascript
console.log('1');
new Promise((resolve, reject) => {
  console.log('Step 1');
  setTimeout(() => {
    resolve(100);
  }, 1000);
}).then(value => {
  return new Promise((resolve, reject) => {
    console.log('Step 1-1');
    setTimeout(() => {
      resolve(110);
    }, 1000);
  }).then(value => {
    console.log('Step 1-2');
    return value;
  }).then(value => {
    console.log('Step 1-3');
    return value;
  })
}).then(value => {
  console.log(value); // 110
  console.log('Step 2');
})
```

![](https://i.imgur.com/kAwb2RI.png)

>因为`.then()`返回的还是`Promise`实例，所以会等到里面的`.then()`执行完，再执行外面的。

## 四种情形

### 第一种 返回一个promise实例

```javascript
doSomething().then(function() {
  return doSomethingElse();
});
```
>假定doSomethingElse返回一个promise实例;图中横向代表执行先后顺序

![](https://i.imgur.com/umARD97.png)
### 第二种 没有返回

```javascript
doSomething().then(function() {
  doSomethingElse();
});
```
![](https://i.imgur.com/y5UQu8O.png)

>第一个`.then()`没有return，虽然`doSomethingElse()`返回了一个`Promise`实例，但是这个`Promise`实例并没有返回给第一个`.then()`的响应函数，所以只能看作`doSomethingElse()`返回了一个`undefined`。

### 第三种 直接传入了一个promise实例

```javascript
doSomething().then(doSomethingElse());
```
![](https://i.imgur.com/IiO1XAP.png)

>在第一个`.then()`传入了`doSomethingElse()`，也就是传入了一个`Promise`实例
在这种情况下，`doSomething`与`doSomethingElse`的执行时间是几乎一致的，因为`doSomethingElse`返回的是一个`Promise`实例，而不是一个函数，在`Promise`规范的定义当中，这个`.then()`会被忽略掉，所以它的完成时间是无关紧要的.


### 第四种 传入一个函数
```javascript
doSomething().then(doSomethingElse);
```
![](https://i.imgur.com/FO98BHf.png)

>`.then()`接受两个参数，所以`doSomethingElse`则作为第一个`resolve`参数,并且`doSomethingElse`返回一个`Promise`实例


## 错误处理

### `catch`捕获异常
>`Promise`会自动捕获内部异常，并交给`rejected`响应函数处理。

```javascript
new Promise((resolve, reject) => {
  setTimeout(() => {
    throw new Error('err');
  }, 2000);
}).then(value => {
  console.log('success' + value);
}).catch(error => {
  console.log('error' + value);
})
```
> `catch`也是返回一个Promise实例

![](https://i.imgur.com/CsMkg1n.png)

### `reject`返回异常
```javascript
new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('bye');
  },2000);
}).then(value => {
  console.log('success:' + value);
}, value => {
  console.log('Err:'+ value)
})
```
![](https://i.imgur.com/3ytRP6q.png)

## Promise进阶

### Promise.all()

> Promise.all([p1,p2,p3,……])用于将多个Promise实例，包装成一个新的Promise实例。返回一个普通的Promise实例。

- 它接受一个数组作为参数。
- 数组里可以是Promise对象，也可以是别的值，只有Promise会等待状态的改变。
- 当所有子Promise都完成，该Promise完成，返回值是全部返回值组成的数组。
- 有任何一个失败，该Promise失败，返回值是第一个失败的子Promise的结果

```javascript
Promise.all([1, 2, 3]).then(all => {
  console.log('1:', all);
  return Promise.all([function() {
    console.log('oxxx');
  }, 'xx00',false]);
}).then(all => {
  console.log('2:', all);
  let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('I\'m P1');
    }, 1500);
  });
  let p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('I\'m P2');
    }, 1300);
  });
  return Promise.all([p1, p2]);
}).then(all => {
  console.log('3:', all);
  let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('I\'m P1');
    }, 1500);
  });
  let p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('I\'m P2');
    }, 1000);
  });
  let p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('I\'m P3');
    }, 3000);
  });
  return Promise.all([p1, p2, p3]);
}).then(all => {
  console.log('all', all);
}).catch(err => {
  console.log('Catch: ' + err);
})
```
![](https://i.imgur.com/4gEt1oQ.png)

### Promise.resolve()
> 返回一个`fulfilled`的Promise实例，或者原始的Promise实例

- 参数为空，返回一个状态为`fulfilled`的Promise实例
- 参数是一个跟Promise无关的值，同上，不过`fulfilled`响应函数会得到这个参数
- 参数为Promise实例，则返回该实例，不做任何修改
- 参数为thenable，立刻执行它的.then()

```javascript
Promise.resolve().then(() => {
  console.log('Step 1');
  return Promise.resolve('Hello');
}).then(value => {
  console.log(value, 'world');
  return Promise.resolve(new Promise(resolve => {
    setTimeout(() => {
      resolve('Good');
    }, 2000);
  }));
}).then( value => {
  console.log(value, 'evening');
  return Promise.resolve({
    then() {
      console.log(', everyone');
    }
  })
})
```

![](https://i.imgur.com/WUhhEs8.png)

### Promise.race()

`Promise.race`方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。

`Promise.race([p1, p2, p3]);`

只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给p的回调函数。

看一个`Promise.race`在实际开发中的应用

```javascript
const delay = timeout => {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject('请求超时'), timeout * 1000)
  })
}

const get = ({url, params = {}, timeout}) => {
  const paramArr = []
  if (Object.keys(params).length !== 0) {
    for (const key in params) {
      paramArr.push(`${key}=${params[key]}`)
    }
  }
  const urlStr = `${url}?${paramArr.join('&')}`

  if (timeout === undefined) {
    return fetch(urlStr)
  } else {
    // Promise.race当数组中有一个promise返回则返回，其余的不再执行。如果超时了就不执行了
    return Promise.race([fetch(urlStr), delay(timeout)])
  }
}

export { get }
```

## 最后

创建了一个前端学习交流群，感兴趣的朋友，一起来嗨呀！
![](https://i.imgur.com/qbcaSEh.png)