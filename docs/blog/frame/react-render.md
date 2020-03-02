---
title: JSX到原生DOM是怎么炼成的
---

一段很平常的JSX代码：
```javascript
let ele = <div id="div" className="red">hello
  	<span className="blue">word</span>
  </div>;

ReactDOM.render(ele,document.getElementById('root'))
```
## JSX语法糖 

上面的写法是为了写起来方便也就是所谓的语法糖，我们借用babel的在线工具可以清楚的看到原生的react应该怎么写：
![](https://i.imgur.com/dWU0WAr.png)

## React.createElement()真面目

那么React.createElement()，创建的react元素又是长什么样的？
我们可以打印ele看一看：
```javascript
console.log(ele);
```
![](https://i.imgur.com/MmWpLXK.png)

简化一下它的结构
```javascript
let eleObj = {
  type: 'div', // 就是什么标签嘛
  props:{ // 属性 包括子节点
    className: 'red', // class
    id: 'div',  // id
    children:[  // 子节点
      'hello',  // 文本子节点
      {         // 子节点对象
        type:'span',
        props:{
          className:'blue',
          children:['word']
        }
      }
    ]
  }
}
```

## 模拟render()函数实现

ReactDOM.render()是怎么解析react元素的：

```javascript
// 模拟render函数
function render(eleObj, container){
  // 解构出标签的类型和属性对象
  let {type, props} = eleObj;
  // 创建一个DOM元素
  let ele = document.createElement(type);
  // 循环属性对象
  for (let attr in props){
    if(attr == 'children'){
      props[attr].forEach(item => {
        if(typeof item == 'string'){
          let textNode = document.createTextNode(item);
          ele.appendChild(textNode);
        } else {
          // 递归调用
          render(item, ele);
        }
      })
    } else if(attr == 'className') {
      ele.setAttribute('class',props[attr]);
    } else {
      ele.setAttribute(attr, props[attr]);
    }
  }
}
```