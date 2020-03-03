---
title: 手写call,apply,bind
---

## call

```javascript
Function.prototype.mycall = function (context, ...args) {
  var context = context || window;
  context.fn = this;

  var result = eval('context.fn(...args)');

  delete context.fn
  return result;
}
```

## apply 

```javascript
Function.prototype.myapply = function (context, ...args) {
  let context = context || window;
  context.fn = this;
  let result = eval('context.fn(...args)');

  delete context.fn
  return result;
}
```

## bind

```javascript
Function.prototype.mybind = function (context, ...args) {
  if (typeof this !== "function") {
    throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
  }

  var self = this;

  var fbound = function () {
    self.apply(this instanceof self ? 
      this : context, args.concat(Array.prototype.slice.call(arguments)));
  }

  fbound = Object.create(this.prototype);

  return fbound;
}
```