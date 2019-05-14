---
title: JavaScript设计模式之代理模式
date: 2018-11-28 18:06:49
type: "tags"
tags:
	- JS
	- 设计模式
categories: "设计模式"
description: "学习设计模式笔记————JavaScript设计模式之代理模式"
---
## 代理模式简介
> 使用者无权访问目标对象，中间加代理，通过代理做授权和控制

什么Nginx代理、JSONP、科学上网...，你平时的工作中可能都用了代理模式，只是你不知道。

模式作用：
1. 远程代理(一个对象将不同空间的对象进行局部代理)
2. 虚拟代理(根据需要创建开销很大的对象如渲染网页暂时用占位图代替真图)
3. 安全代理(控制真实对象的访问权限，经纪人一般都是暴露自己的电话，明星的电话一般情况都不会泄漏)
4. 智能指引(调用对象代理处理另外一些事情如垃圾回收机制)

UML类图
![](https://i.imgur.com/hF04ECE.png)

## 代码示例

```javascript
// 代理模式需要三方(买房的过程)
// 1.买家
function buyer() {
  this.name = 'FinGet'
}
// 2.中介
function agency(){

}
// 卖房
agency.prototype.sellhouse = function (){
  new seller(new buyer()).sell('100W')
}

// 3.卖家
function seller(buyer) {
  this.buyerName = buyer.name
  this.sell = function(money) {
    console.log(`收到了${this.buyerName}的${money},房子卖出`)
  }
}
```

## ES6 Proxy
> [阮一峰ES6,http://es6.ruanyifeng.com/#docs/proxy](http://es6.ruanyifeng.com/#docs/proxy)

>Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。

```javascript
// 明星
let star = {
  name: '张XX',
  age: 25,
  phone: '13910733521'
}

// 经纪人
let agent = new Proxy(star, {
  get: function (target, key) {
    if (key === 'phone') {
      // 返回经纪人自己的手机号
      return '18611112222'
    }
    if (key === 'price') {
      // 明星不报价，经纪人报价
      return 120000
    }
    return target[key]
  },
  set: function (target, key, val) {
    if (key === 'customPrice') {
      if (val < 100000) {
        // 最低 10w
        throw new Error('价格太低')
      } else {
        target[key] = val
        return true
      }
    }
  }
})

// 主办方
console.log(agent.name)
console.log(agent.age)
console.log(agent.phone)
console.log(agent.price)

// 想自己提供报价（砍价，或者高价争抢）
agent.customPrice = 150000
// agent.customPrice = 90000  // 报错：价格太低
console.log('customPrice', agent.customPrice)
```

## 比较

适配器模式与代理模式：
- 适配器模式：提供一个不同的接口（如不同的插头）
- 代理模式： 提供一模一样的接口
装饰器模式与代理模式：
- 装饰器模式： 扩展功能，原有功能不变且可以直接使用
- 代理模式： 显示原有功能，但是经过限制或者是阉割之后的



## 最后

创建了一个前端学习交流群，感兴趣的朋友，一起来嗨呀！
![](<https://image-static.segmentfault.com/207/665/2076650181-5bfe3d1a48e89_articlex>)