---
title: 移动端1px边框解决方案
date: 2018-01-26 09:04:39
type: "tags"
tags: 
	- css
	- 移动端
categories: "css"
description: "移动端1px边框解决方案"
---

```css
.border-1px {
  position: relative;
}
.border-1px:after {
  position: absolute;
  content: '';
  top: -50%;
  bottom: -50%;
  left: -50%;
  right: -50%;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  border-top: 1px solid #666;
}
@media (-webkit-min-device-pixel-radio: 1.5), (min-device-pixel-radio: 1.5) {
  border-1px::after {
    -webkit-transform: scaleY(0.7);
    transform: scaleY(0.7);
   }
}
@media (-webkit-min-device-pixel-radio: 2), (min-device-pixel-radio: 2) {
  border-1px::after {
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
}
```

## 最后

创建了一个前端学习交流群，感兴趣的朋友，一起来嗨呀！
![](<https://image-static.segmentfault.com/207/665/2076650181-5bfe3d1a48e89_articlex>)