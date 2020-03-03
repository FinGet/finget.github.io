---
title: 垂直居中的6种方式
---

```css
// 共用样式
.container{
	position: relative;
	width: 500px;
	height: 500px;
	border: 1px solid;
}
.cid{
	width: 100px !important;
	height: 100px !important;
	background: red;
}
```

- 第一种

```html
.cid1 {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}

<div class="container">
	<div class="cid cid1">第一种</div>
</div>
```

<center><img src="https://tva1.sinaimg.cn/large/00831rSTgy1gcfoaorh2ij30sc0s6q3n.jpg" width = "300" alt="图片名称" align=center />
</center>

- 第二种

```html
.cid2{
	position: absolute;
	left: 50%;
	top: 50%;
	margin-left: -50px;
	margin-top: -50px;
}
<div class="container">
	<div class="cid cid2">第二种</div>
</div>
```

<center><img src="https://tva1.sinaimg.cn/large/00831rSTgy1gcfobawqlij30t00rymxx.jpg" width = "300" alt="图片名称" align=center />
</center>

- 第三种

```html
.table{
	display: table;
}
.cid3 {
	display: table-cell;
	vertical-align: middle;
}


<div class="container table">
	<div class="cid cid3">第三种</div>
</div>
```

<center><img src="https://tva1.sinaimg.cn/large/00831rSTgy1gcfodaz0nsj30su0ryjs7.jpg" width = "300" alt="图片名称" align=center />
</center>


- 第四种

```html
.cid4{
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	right: 0;
	margin: auto;
}
<div class="container">
	<div class="cid cid4">第四种</div>
</div>
```

<center><img src="https://tva1.sinaimg.cn/large/00831rSTgy1gcfodkv39uj30t60s0js8.jpg" width = "300" alt="图片名称" align=center />
</center>



- 第五种

```html
.flex{
	display: flex;
}
.cid5{
	margin: auto;
}
<div class="container flex">
	<div class="cid cid5">第五种</div>
</div>
```

<center><img src="https://tva1.sinaimg.cn/large/00831rSTgy1gcfoe8jsmjj30sc0rygmg.jpg" width = "300" alt="图片名称" align=center />
</center>


- 第六种

```html
.flex-center{
	display: flex;
	justify-content: center;
	align-items: center;
}
<div class="container flex-center">
	<div class="cid">第六种</div>
</div>
```

<center><img src="https://tva1.sinaimg.cn/large/00831rSTgy1gcfodx86m6j30s80s0gmg.jpg" width = "300" alt="图片名称" align=center />
</center>






