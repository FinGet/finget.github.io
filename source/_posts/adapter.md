---
title: JavaScript设计模式之适配器模式
date: 2018-11-22 16:32:25
type: "tags"
tags:
	- JS
	- 设计模式
categories: "设计模式"
description: "学习设计模式笔记————JavaScript设计模式之适配器模式"
---

## 适配器模式

> 适配器模式(Adapter)是将一个类(对象)的接口(方法或属性)转换成客户希望的另外一个接口(方法或属性),适配器模式使得原本由于接口不兼容而不能一起工作的那些类(对象)可以一起工作。[旧接口格式和使用者不兼容，中间加一个适配器转换接口。]

![](https://i.imgur.com/6gHYqna.png)
![](https://i.imgur.com/cWifkCQ.png)

UML
![](https://i.imgur.com/FLUn9OL.png)

模式作用： 
- 使用一个已经存在的对象，但其方法或接口不符合你的要求。
- 创建一个可复用的对象，该对象可以与其他不相关或不可见的对象协同工作。
- 使用已经存在的一个或多个对象，但是不能进行继承已匹配它的接口。

注意事项：
- 与代理模式的区别，代理模式是不改变原接口，适配是原接口不符合规范

### 代码示例

```javascript
//谷歌地图show方法
var googleMap = {
  googlShow: function() {
    console.log("谷歌地图");
  }
};
//百度地图show方法
var baiduMap = {
  baiduShow: function() {
    console.log("百度地图");
  }
};
//渲染地图函数
var renderMap=function(map){
  if(map.show instanceof Function){
    map.show();        
  }
};
renderMap(googleMap);//输出:开始渲染谷歌地图
renderMap(baiduMap);//输出:开始渲染百度地图
```

适配器模式还有数据的适配，在现在开发中，各种UI框架层出不穷(elementUI),每个框架中对组件数据格式的定义不一样，后台返回的数据也不能完全按照框架的格式，这时作为前端程序猿，我们就需要把后台返回的数据做一次修改，以适应框架。这就是设配器的想法，不要听到设计模式就很恼火，说不定你每天都在用！！！

![](https://i.imgur.com/7j1VIsF.png)

## 最后

创建了一个前端学习交流群，感兴趣的朋友，一起来嗨呀！
![](https://i.imgur.com/qbcaSEh.png)