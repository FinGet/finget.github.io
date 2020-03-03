---
title: 手写节流和防抖
---

## 节流

:::tip
节流的核心思想: 如果在定时器的时间范围内再次触发，则不予理睬，等当前定时器完成，才能启动下一个定时器任务。这就好比公交车，10 分钟一趟，10 分钟内有多少人在公交站等我不管，10 分钟一到我就要发车走人！
:::

```javascript
const throttle = function(fn, interval) {
  let last = 0;
  return function (...args) {
    let context = this;
    let now = +new Date();
    // 还没到时间
    if(now - last < interval) return;
    last = now;
    fn.apply(this, args)
  }
}
```

应用场景

- 鼠标不断点击触发，mousedown(单位时间内只触发一次)
- 监听滚动事件，比如是否滑到底部自动加载更多，用throttle来判断

## 防抖

:::tip
防抖核心思想: 每次事件触发则删除原来的定时器，建立新的定时器。跟王者荣耀的回城功能类似，你反复触发回城功能，那么只认最后一次，从最后一次触发开始计时。
:::

```javascript
const debounce = function(fn, delay) {
  let timer = null;
  return function (...args) {
    let context = this;
    if(timer) clearTimeout(timer);
    timer = setTimeout(function() {
      fn.apply(context, args);
    }, delay);
  }
}
```

应用场景

- search搜索联想，用户在不断输入值时，用防抖来节约请求资源。
- window触发resize的时候，不断的调整浏览器窗口大小会不断的触发这个事件，用防抖来让其只触发一次