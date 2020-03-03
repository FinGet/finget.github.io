---
title: 盒模型和box-sizing
---
## 标准盒模型(w3c标准)

::: tip
所有HTML元素可以看作盒子，在CSS中，"box model"这一术语是用来设计和布局时使用。
CSS盒模型本质上是一个盒子，封装周围的HTML元素，它包括：边距，边框，填充，和实际内容。
:::

![](https://ask.qcloudimg.com/draft/5687933/x8wqqio9g8.gif)

::: tip
在标准盒模型中，width 和 height 指的是内容区域的宽度和高度。增加内边距、边框和外边距不会影响内容区域的尺寸，但是会增加元素框的总尺寸。
:::

![](https://ask.qcloudimg.com/draft/5687933/p01q3f5wq0.png)


::: tip
在标准盒模型中：盒子占位width = width + 2*margin + 2*padding + 2*border,高度与之一样。
盒子真正德width = width + 2*padding + 2*border。 margin不算！margin可以改变盒子占位的大小，但是盒子的宽高并没有改变，而是位置的改变！
:::

::: tip
根据 W3C 的规范，元素内容占据的空间是由 width 属性设置的，而内容周围的 padding 和 border 值是另外计算的。不幸的是，IE5.X 和 6 在怪异模式中使用自己的非标准模型。这些浏览器的 width 属性不是内容的宽度，而是内容、内边距和边框的宽度的总和。
:::
## 怪异盒模型

![](https://ask.qcloudimg.com/draft/5687933/hh4krmgi8h.jpg)

::: tip
ie 盒子模型的 content 部分包含了 border 和 pading
:::

要让网页按标准盒模型去解析，则需要加上 doctype声明，否则不同的浏览器会按照自己的标准去解析。

## box-sizing

::: tip
box-sizing 属性允许你以某种方式定义某些元素，以适应指定区域。
例如，假如您需要并排放置两个带边框的框，可通过将 box-sizing 设置为 "border-box"。这可令浏览器呈现出带有指定宽度和高度的框，并把边框和内边距放入框中。
:::

`box-sizing`类似于ie盒模型，它会把内边距和边框包含在`width`内。在实际工作中，我们设置一个固定宽度的盒子，但当给它设置`padding`、`border`之后，它的真正宽度就会改变。这时`box-sizing`就派上用途了。它会自动调整内容的宽度，保证盒子的真正宽度还是我们设置的宽度。

可以查看实例：[box-sizing实例](http://www.runoob.com/try/try.php?filename=trycss3_box-sizing)
