---
title: 深入理解浮动
date: 2018-05-05 11:13:47
tags:
	- css
categories: "css"
description: "css浮动到底是怎么回事"
---
## 常规流
- 常规流（文档流）与包含块
>常规流就是页面元素（dom节点）从上往下，从左往右的排列

>包含块：一个元素的包含块是离它最近的**块级祖先**

- 脱离常规流
> 定位`position:absolute/fixed`,脱离常规流的元素，其前后的元素会当它不存在

## 浮动

>《CSS权威指南》中说，浮动元素同时处于（常规）流内和流外

- 浮动元素不会影响块级元素的布局（块级元素会当它不存在）--流外
- 浮动元素会影响行内元素的布局 -- 流内
	- 间接影响块级元素布局

元素浮动之后会变成一个块框，相当于一个div

> 浮动和定位一起用，浮动会失效 （浮动和相对定位可以一起用，先浮动，再相对于浮动之后的位置进行定位）

### 浮动元素的摆放方式
- 尽量靠上
- 尽量靠左
- 尽量挨着，margin外边缘挨着
- 不能超出包含块（除非元素本身已经比包含块更宽）
- 不能超出所在行的最高点
- 不能超过它前面的的浮动元素的最高点
- 行内元素绕着浮动元素摆放
	- 行内元素会出现在左浮动元素的右边及右浮动元素的左边
	- 左浮动元素的左边及右浮动元素的右边是不会摆放行内元素的

### 图例
![](https://i.imgur.com/XBozugz.png)
![](https://i.imgur.com/HsgBADf.png)
下图中最长的浮动块，长度太长，所以它没法挨着第二个浮动元素的左边
![](https://i.imgur.com/XSes8Xn.png)
下图中虽然第二个后面可以放下第四个，但是它并不能浮动到那里，它也不能浮动到第一个的下面
![](https://i.imgur.com/U4rQkf7.png)

![](https://i.imgur.com/WAnun0V.png)

行内元素会出现在左浮动元素的右边及右浮动元素的左边，div3的左边是没有文字的
![](https://i.imgur.com/O4ceub3.png)
不能超出所在行的最高点（图中的span虽然浮动了，它还是在它所在行，不会超出）
![](https://i.imgur.com/fgNLBX6.png)
浮动元素不会影响块级元素的布局（块级元素会当它不存在）--流外
![](https://i.imgur.com/Cr3YAal.png)

### 浮动清除（clear,常规流中的块级元素）

>`clear: none | left | right | both;`

> 浮动清除是指块框下移，直到某一边（或两边）没有浮动元素为止

![](https://i.imgur.com/LGLDtS2.png)
清除浮动

清除左浮动，会按图中箭头的方向从右往左看，将div2向下移动，直到div2的左边没有左浮动元素（清除右浮动与之相对）
![](https://i.imgur.com/hh6tHkQ.png)

### 闭合浮动

![](https://i.imgur.com/0EtOxUI.png)

给父级div加一个`overflow:hidden`
![](https://i.imgur.com/PxERVsQ.png)

- 可以添加一个行内元素，让它的宽度为100%，它就会往下移，这样就撑开了父级div
- 父级div添加`overflow:hidden`
- 伪元素 clear（clearfix）

```css
.clearfix:after{
	content:".";
	display:block;
	height:0;
	clear:both;
	visibility:hidden
}
```

## 最后

创建了一个前端学习交流群，感兴趣的朋友，一起来嗨呀！
![](https://ws1.sinaimg.cn/large/006tNc79gy1g2qi8r9stqj30a50dwdkq.jpg)