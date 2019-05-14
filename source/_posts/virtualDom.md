---
title: JavaScript从初级往高级走系列————Virtual Dom
date: 2018-05-22 13:02:01
type: "tags"
tags:
	- JS
categories: "JS"
description: "JavaScript从初级往高级走系列，一次学习记录吧，一直在路上"
---
## 什么是虚拟DOM

- 用JS模拟DOM结构
- DOM变化的对比，放在JS层来做（图灵完备语言）
- 提高重绘性能

###  重绘和回流
页面渲染过程：
![重绘和回流](https://i.imgur.com/WEJCK1f.jpg)

- 当render tree中的一部分(或全部)因为元素的规模尺寸，布局，隐藏等改变而需要重新构建。这就称为回流(reflow)。
- 当render tree中的一些元素需要更新属性，而这些属性只是影响元素的外观，风格，而不会影响布局的，比如background-color。则就叫称为重绘。

### 模拟虚拟DOM

```html
<ul id="list">
  <li class="item">Item 1</li>
  <li class="item">Item 2</li>
</ul>
```

```javascript
// js模拟虚拟DOM
{
  tag: 'ul',
  attrs:{
    id: 'list'
  },
  children:[
    {
      tag: 'li',
      attrs: {className: 'item'},
      children: ['Item 1']
    },
    {
      tag: 'li',
      attrs: {className: 'item'},
      children: ['Item 2']
    }
  ]
}
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="https://cdn.bootcss.com/jquery/2.2.0/jquery.min.js"></script>
</head>
<body>
  <div id="container"></div>
  <button id="btn-change">change</button>

  <script>
	var data = [
	  {name: '张三',age: '20',address: '北京'},
	  {name: '王五',age: '22',address: '成都'},
	  {name: '李四',age: '21',address: '上海'}
	]

	// 渲染函数
    function render(data) {
      var $container = $('#container');

      // 清空容器，重要！！！
      $container.html('');

      // 拼接 table
      var $table = $('<table>');

      $table.append($('<tr><td>name</td><td>age</td><td>address</td>/tr>'));
      data.forEach(function (item) {
      $table.append($('<tr><td>' + item.name + '</td><td>' + item.age + '</td><td>' + item.address   + '</td>/tr>'))
    });

      // 渲染到页面
      $container.append($table);
    }
    $('#btn-change').click(function () {
      data[1].age = 30;
      data[2].address = '深圳';
      // re-render  再次渲染
      render(data);
    })
    // 页面加载完立刻执行（初次渲染）
    render(data);
  </script>
</body>
</html>
```
虽然只改变了两个数据，但是整个table都闪烁了（回流&重绘）
![](https://i.imgur.com/x7JUVud.gif)

- DOM操作是‘昂贵’的，js运行效率高
- 尽量减少DOM操作，尽量减少回流重绘

## 虚拟DOM如何应用，核心API是什么

### 介绍 snabbdom

[snabbdom GitHub地址](https://github.com/snabbdom/snabbdom)

官网例子：
```javascript
var snabbdom = require('snabbdom');
var patch = snabbdom.init([ // Init patch function with chosen modules
  require('snabbdom/modules/class').default, // makes it easy to toggle classes
  require('snabbdom/modules/props').default, // for setting properties on DOM elements
  require('snabbdom/modules/style').default, // handles styling on elements with support for animations
  require('snabbdom/modules/eventlisteners').default, // attaches event listeners
]);
var h = require('snabbdom/h').default; // helper function for creating vnodes

var container = document.getElementById('container');

// h函数生成一个虚拟节点
var vnode = h('div#container.two.classes', {on: {click: someFn}}, [
  h('span', {style: {fontWeight: 'bold'}}, 'This is bold'),
  ' and this is just normal text',
  h('a', {props: {href: '/foo'}}, 'I\'ll take you places!')
]);
// Patch into empty DOM element – this modifies the DOM as a side effect
patch(container, vnode); // 把vnode加入到container中

// 数据改变，重新生成一个newVnode
var newVnode = h('div#container.two.classes', {on: {click: anotherEventHandler}}, [
  h('span', {style: {fontWeight: 'normal', fontStyle: 'italic'}}, 'This is now italic type'),
  ' and this is still just normal text',
  h('a', {props: {href: '/bar'}}, 'I\'ll take you places!')
]);
// Second `patch` invocation
// 将newVnode更新到之前的vnode中，从而更新视图
patch(vnode, newVnode); // Snabbdom efficiently updates the old view to the new state
```

#### snabbdom h 函数
```javascript
var vnode = h('ul#list',{},[
  h('li.item',{},'Item 1'),
  h('li.item',{},'Item 2')
])


{
  tag: 'ul',
  attrs:{
    id: 'list'
  },
  children:[
    {
      tag: 'li',
      attrs: {className: 'item'},
      children: ['Item 1']
    },
    {
      tag: 'li',
      attrs: {className: 'item'},
      children: ['Item 2']
    }
  ]
}
```

#### snabbdom patch 函数
```javascript
var vnode = h('ul#list',{},[
  h('li.item',{},'Item 1'),
  h('li.item',{},'Item 2')
])
var container = document.getElementById('container');
patch(container, vnode);

// 模拟改变
var btnChange = document.getElementById('btn-change');
btnChange.addEventListener('click',function(){
  var newVnode = h('ul#list',{},[
    h('li.item',{},'Item 111'),
    h('li.item',{},'Item 222'),
    h('li.item',{},'Item 333')
  ])
  patch(vnode, newVnode);
})
```
#### snabbdom例子 

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="https://cdn.bootcss.com/snabbdom/0.7.1/snabbdom-class.js"></script>
  <script src="https://cdn.bootcss.com/snabbdom/0.7.1/snabbdom.js"></script>
  <script src="https://cdn.bootcss.com/snabbdom/0.7.1/snabbdom-props.js"></script>
  <script src="https://cdn.bootcss.com/snabbdom/0.7.1/snabbdom-style.js"></script>
  <script src="https://cdn.bootcss.com/snabbdom/0.7.1/h.js"></script>
  <script src="https://cdn.bootcss.com/snabbdom/0.7.1/snabbdom-eventlisteners.js"></script>
</head>
<body>
  <div id="container"></div>
  <button id="btn-change">change</button>
  <script>
	var snabbdom = window.snabbdom;
	// 定义 patch
	var patch = snabbdom.init([
		snabbdom_class,
		snabbdom_props,
		snabbdom_style,
		snabbdom_eventlisteners
	])
	// 定义 h
	var h = snabbdom.h;
	var container = document.getElementById('container');
	// 生成 vnode
	var vnode = h('ul#list',{},[
	  h('li.item',{},'Item 1'),
  	  h('li.item',{},'Item 2')
	])
	patch(container, vnode);
	// 模拟数据改变
	var btnChange = document.getElementById('btn-change');
	btnChange.addEventListener('click',function(){
	  var newVnode = h('ul#list',{},[
	    h('li.item',{},'Item 1'),
	    h('li.item',{},'Item 222'),
	    h('li.item',{},'Item 333')
	  ])
	  patch(vnode, newVnode);
	})
  </script>
</body>
</html>
```
看图，只有修改了的数据才进行了刷新，减少了DOM操作，这其实就是vnode与newVnode对比，找出改变了的地方，然后只重新渲染改变的
![](https://i.imgur.com/bkGqypK.gif)

### 重做之前的demo

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <div id="container"></div>
  <button id="btn-change">change</button>

  <script src="https://cdn.bootcss.com/snabbdom/0.7.0/snabbdom.js"></script>
  <script src="https://cdn.bootcss.com/snabbdom/0.7.0/snabbdom-class.js"></script>
  <script src="https://cdn.bootcss.com/snabbdom/0.7.0/snabbdom-props.js"></script>
  <script src="https://cdn.bootcss.com/snabbdom/0.7.0/snabbdom-style.js"></script>
  <script src="https://cdn.bootcss.com/snabbdom/0.7.0/snabbdom-eventlisteners.js"></script>
  <script src="https://cdn.bootcss.com/snabbdom/0.7.0/h.js"></script>
  <script type="text/javascript">
    var snabbdom = window.snabbdom;
    // 定义关键函数 patch
    var patch = snabbdom.init([
      snabbdom_class,
      snabbdom_props,
      snabbdom_style,
      snabbdom_eventlisteners
    ]);

    // 定义关键函数 h
    var h = snabbdom.h;

    // 原始数据
    var data = [
      {name: '张三',age: '20',address: '北京'},
	  {name: '王五',age: '22',address: '成都'},
	  {name: '李四',age: '21',address: '上海'}
	]
    // 把表头也放在 data 中
    data.unshift({
      name: '姓名',
      age: '年龄',
      address: '地址'
    });

    var container = document.getElementById('container')

    // 渲染函数
    var vnode;
    function render(data) {
      var newVnode = h('table', {}, data.map(function (item) {
        var tds = [];
        var i;
        for (i in item) {
          if (item.hasOwnProperty(i)) {
            tds.push(h('td', {}, item[i] + ''));
          }
        }
        return h('tr', {}, tds)
      }));

      if (vnode) {
        // re-render
        patch(vnode, newVnode);
      } else {
        // 初次渲染
        patch(container, newVnode);
      }
      // 存储当前的 vnode 结果
      vnode = newVnode;
    }
    // 初次渲染
    render(data)
    var btnChange = document.getElementById('btn-change')
    btnChange.addEventListener('click', function () {
      data[1].age = 30
      data[2].address = '深圳'
      // re-render
      render(data)
    })
    </script>
</body>
</html>
```
![](https://i.imgur.com/aptwoC0.gif)

### 核心API

- h('<标签名>',{...属性...},[...子元素...])
- h('<标签名>',{...属性...},'...')
- patch(container,vnode)
- patch(vnode,newVnode)

## 简单介绍 diff 算法

### 什么是 diff 算法

这里有两个文本文件：
![](https://i.imgur.com/RSJ5XMS.png)
借用`git bash`中 `diff` 命令可以比较两个文件的区别：
![](https://i.imgur.com/cHgP1Rv.png)

[在线diff工具](https://www.diffchecker.com/)

![](https://i.imgur.com/S1yiL9h.png)


虚拟DOM ---> DOM
```javascript
// 一个实现流程，实际情况还很复杂
function createElement(vnode) {
  var tag = vnode.tag  // 'ul'
  var attrs = vnode.attrs || {}
  var children = vnode.children || []
  if (!tag) {
    return null
  }

  // 创建真实的 DOM 元素
  var elem = document.createElement(tag)
  // 属性
  var attrName
  for (attrName in attrs) {
    if (attrs.hasOwnProperty(attrName)) {
      // 给 elem 添加属性
      elem.setAttribute(attrName, attrs[attrName])
    }
  }
  // 子元素
  children.forEach(function (childVnode) {
    // 给 elem 添加子元素
    elem.appendChild(createElement(childVnode))  // 递归
  })

  // 返回真实的 DOM 元素
  return elem
}
```

vnode ---> newVnode
```javascript
function updateChildren(vnode, newVnode) {
  var children = vnode.children || [];
  var newChildren = newVnode.children || [];

  children.forEach(function (childVnode, index) {
    var newChildVnode = newChildren[index];
    if (childVnode.tag === newChildVnode.tag) {
        // 深层次对比，递归
        updateChildren(childVnode, newChildVnode);
    } else {
        // 替换
        replaceNode(childVnode, newChildVnode);
    }
  })
}

function replaceNode(vnode, newVnode) {
  var elem = vnode.elem;  // 真实的 DOM 节点
  var newElem = createElement(newVnode);
  // 替换
}
```

## 最后

创建了一个前端学习交流群，感兴趣的朋友，一起来嗨呀！
![](<https://image-static.segmentfault.com/207/665/2076650181-5bfe3d1a48e89_articlex>)