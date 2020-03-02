---
title:  MVVM-Vue
---

## MVVM

- 如何理解 MVVM
- 如何实现 MVVM
- 是否解读过 Vue 的源码



### Jquery 与 框架的区别

#### jquery 实现 todo-list

```html
<div>
    <input type="text" name="" id="txt-title">
    <button id="btn-submit">submit</button>
</div>
<div>
    <ul id="ul-list"></ul>
</div>

<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
<script type="text/javascript">
    var $txtTitle = $('#txt-title');
    var $btnSubmit = $('#btn-submit');
    var $ulList = $('#ul-list');
    $btnSubmit.click(function () {
        var title = $txtTitle.val();
        if (!title) {
            return
        }
        var $li = $('<li>' + title + '</li>');
        $ulList.append($li);
        $txtTitle.val('');
    })
</script>
```



#### vue 实现 todo-list

```html
<div id="app">
  <div>
    <input v-model="title">
    <button v-on:click="add">submit</button>
  </div>
  <div>
    <ul>
      <li v-for="item in list">{{item}}</li>
    </ul>
  </div>
</div>

<script type="text/javascript">
  // data 独立
  var data = {
      title: '',
      list: []
  }
  // 初始化 Vue 实例
  var vm = new Vue({
      el: '#app',
      data: data,
      methods: {
          add: function () {
              this.list.push(this.title);
              this.title = '';
          }
      }
    })
</script>
```

#### 两者的区别

- 数据和视图的分离，解耦（开放封闭原则，对扩展开放，对修改封闭）

  在jQuery中在jQuery代码中操作视图和数据，混在一块了

- 以数据驱动视图，只关心数据变化，DOM操作被封装

  只改数据，视图自动更新

### MVVM的理解

- MVC （Model View Controller）

  ![](https://ask.qcloudimg.com/draft/5687933/ukr3p9h879.png?imageView2/2/w/1620 )

  ![](https://ask.qcloudimg.com/draft/5687933/wee738ursf.png?imageView2/2/w/1620)

- MVVM （Model View ViewModel）

![](https://ask.qcloudimg.com/draft/5687933/k37f46scc7.png?imageView2/2/w/1620) 

> View 通过 `事件绑定` (DOM Listeners) 操作Model; Model通过 `数据绑定` (Data Bindings)操作View。



## Vue 三要素

- 响应式： Vue 如何监听到 data 的每个属性变化？
- 模板引擎： Vue 的模板如何被解析，指令如何处理？
- 渲染：Vue 的模板如何被渲染成Html？



### Vue中如何实现响应式

#### 什么是响应式

- 修改 data 属性之后， Vue 立刻监听到
- data 属性被代理到 vm上

```javascript
var vm = new Vue({
  el: '#app',
  data: {
    name: 'zhangsan',
    age: 20
  }
})
// vm.name = 'zhangsan'
// vm.age = '20'
```

#### Object.defineProperty，Vue核心函数

```javascript
var obj = {
  name: 'zhangsan',
  age: 25
}
console.log(obj.name); // 获取属性的时候，如何监听
obj.age = 26; // 赋值属性的时候，如何监听
```

上面是无法监听对象的属性的访问以及赋值操作的，直接就产生了操作的结果。

```javascript
var obj = {}
var _name = 'shangsan'
Object.defineProperty(obj, 'name', {
  get: function () {
    console.log('get', _name) // 监听
    return _name
  },
  set: function (newVal) {
    console.log('set', newVal)  // 监听
    _name = newVal
  }
})
console.log(obj.name); // 可以监听到
obj.name = 'lisi'; // 可以监听到
```



###  Vue 中何如解析模板

#### 模板是什么

```html
<div id="app">
  <div>
    <input v-model="title">
    <button v-on:click="add">submit</button>
  </div>
  <div>
    <ul>
      <li v-for="item in list">{{item}}</li>
    </ul>
  </div>
</div>
```

- 本质： 字符串
- 有逻辑， 如` v-if` ` v-for` 等
- 与 html 标签格式很像，但有很大区别（html是静态的，模板是动态的）
- 最终还要转换为 html 来显示
  - 模板最终必须转换成 JS 代码
  - 有逻辑（`v-if` ` v-for` 等），必须用JS才能实现（图灵完备）
  - 因此，模板最重要转成一个JS函数（render函数）



#### render函数



##### with -- 实际开发不推荐用

```javascript
var obj = {
  name: 'zhangsan',
  age: 20,
  getAddress: function () {
    alert('beijing')
  }
}
// 不使用with
function fn() {
  alert(obj.name)
  alert(obj.age)
  obj.getAddress()
}
fn()

// 使用with
function fn1() {
  with(obj) {
    alert(age)
    alert(name)
    getAddress()
  }
}
fn1()
```

##### render

```html
<div id="app">
  <p>{{price}}</p>
</div>

<script>
  var vm = new Vue({
    el: '#app',
    data: {
	  price: 100
    }
  })
</script>
```

模板将变成下面这个样子：

```javascript
function render() {
  with(this) {  // this 就是 vm
	return _c(
	  'div',
	  {
	    attrs: {'id': 'app'}
	  },
	  [
	    _c('p', [_v(_s(price))])
	  ]
	)
  }
}
```



![](https://ask.qcloudimg.com/draft/5687933/wtmke1yp41.png?imageView2/2/w/1620)



##### 看todo-list的render

在vue源码里`alert`  `render` 函数

![](https://ask.qcloudimg.com/draft/5687933/wqqri98547.png?imageView2/2/w/1620) 

以上面vue实现的todolist为例：

```javascript
with(this){  // this 就是 vm
    return _c( // _c创建一个标签
        'div',
        {
            attrs:{"id":"app"}
        },
        [
            _c(
                'div',
                [
                    _c(
                        'input',
                        {
                            directives:[
                                {
                                    name:"model",
                                    rawName:"v-model",
                                    value:(title),
                                    expression:"title"
                                }
                            ],
                            domProps:{
                                "value":(title)
                            },
                            on:{
                                "input":function($event){
                                    if($event.target.composing)return;
                                    title=$event.target.value
                                }
                            }
                        }
                    ),
                    _v(" "),
                    _c(
                        'button',
                        {
                            on:{
                                "click":add
                            }
                        },
                        [_v("submit")]
                    )
                ]
            ),
            _v(" "),
            _c('div',
               [
                _c(
                    'ul',
                    _l((list),function(item){return _c('li',[_v(_s(item))])}) // _l 解析 v-for 循环
                )
            ]
          )
        ]
    )
}
```

##### render 与 Vdom

[可以先看一下virtualDom](https://finget.github.io/2018/05/22/virtualDom/)

![](https://ask.qcloudimg.com/draft/5687933/0rtc4nu8uf.png?imageView2/2/w/1620) 

- vm._c 其实相当于 snabbdom 中的 h 函数
- render 函数执行之后，返回的是 vnode

![](https://ask.qcloudimg.com/draft/5687933/davw3p1619.png?imageView2/2/w/1620) 

- updateComponent 中实现了 vdom 的 patch
- 页面首次渲染 执行updateComponent
- data 中每次修改属性， 执行 updateComponent

##### vue 的整个实现流程

- 第一步： 解析模板成render函数
    - with 的用法
    - 模板中的所有信息都被render函数包含
    - 模板中用到的data中的属性，都变成了js变量
    - 模板中的v-model v-if v-on 都变成了 js逻辑
    - render 函数返回 vnode

![](https://ask.qcloudimg.com/draft/5687933/4xomyjqkas.png?imageView2/2/w/1620)
![](https://ask.qcloudimg.com/draft/5687933/qds5yp1ln1.png?imageView2/2/w/1620)

- 第二部： 响应式开始监听
    - Object.defineProperty
    - 将 data 的属性代理到 vm 上
    

![](https://ask.qcloudimg.com/draft/5687933/6i6oxdrc1v.png?imageView2/2/w/1620)

- 第三步： 首次渲染，显示页面，且绑定依赖

![](https://ask.qcloudimg.com/draft/5687933/e7fqueqc7u.png?imageView2/2/w/1620)

- 第四步： data 属性变化，触发 rerender