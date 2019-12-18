---
title: 原生——ajax
date: 2018-01-26 09:33:17
type: "tags"
tags: 
	- JS
	- ajax
categories: "JS"
description: "什么是Ajax? 详解原生js封装ajax"
---
## 什么是Ajax？（前后端数据交互）
Asynchronous JavaScript and XML（异步JavaScript和XML）

### ajax的作用：
a.节省用户操作时间，提高用户体验，减少数据请求
b.传输、获取数据

### ajax流程：
```javascript
oBtn.onclick=function(){
  //第一步    ‘打开浏览器’    创建ajax对象
  /*
    var xmlhttp;
    第一种方式
    if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari//ie6下不存在XMLHttpRequest，所以不能用XMLHttpRequest作判断条件  应该判断window下有没有XMLHttpRequest属性，如果没有只会返回undefined，不会报错
         xmlhttp=new XMLHttpRequest();
    }else{// code for IE6, IE5
             xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
         }
    第二种方式
    try{
        xmlhttp=new XMLHttpRequest();
    }catch(e){
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
* */
   var xhr=new XMLHttpRequest();

   //第二步    ‘在地址栏输入地址’
   /**
   open()
   参数
     1.打开方式
     2.地址
     3.是否异步
         异步：非阻塞
         同步：阻塞
   * */
   xhr.open('get','1.txt',true);

   //第三步    ‘提交’    发送请求
  xhr.send();
//第四步    ‘等待服务器返回结果’
/** 请求状态监控
  on readystate change事件
  readyState属性：请求状态
     0    （初始化）还没有调用open()方法
     1    （载入）已调用send()方法，正在发送请求
     2    （载入完成）send()方法完成，已收到全部响应内容
     3    （解析）正在解析响应内容
     4    （完成）响应内容解析完成，可以在客户端调用了

    status属性：服务器(请求资源)的状态      http状态码
    返回的内容
        responseText：返回以文本形式存放的内容
        responseXML：返回XML形式的内容
    * readyState:ajax工作状态
    responseText:ajax请求返回的内容就被存放到这个属性下面
    * */
    xhr.onreadystatechange=function(){
         if (xhr.readyState==4) {

             //容错处理
             if(xhr.status==200){
                   alert(xhr.responseText);
             }else{
                   alert('出错了，Err:'+xhr.status);
            }

       }
    }
}
```
## form表单:
action：数据提交地址，默认是当前页面
method：数据提交方式，默认是get方式

1. get 
把数据名称和数据值用=连接，如果有多个的话，那么他会把多个数据组合用&进 行连接，然后把数据放到url?后面传到指定页面 url长度限制的原因，我们不要通过get方式传递过多的数据 
2. post 理论上无限制 
enctype：提交的数据格式 ，默认是：application/x-www-form-unlencoded 
application/x-www-form-urlencoded

### 清除ajax缓存:
一、GET 方式请求

如果两次请求的url相同的话 浏览器（不同缓存机制的浏览器会有所不同）会直接将第一次请求的结果给第二次请求

防止这种缓存的方法：

请求的url地址？t=new Date()

二、 POST 方式请求

浏览器认为Post的提交必然是有改变的 所以一般post请求 不会从缓存中去数据

三、 jQuery中的有设置缓存的开关

不管是哪中方式请求 我们可以设置缓存开关：
```javascript
$ajax.Setup(｛ cache:false｝);
```
```javascript
xhr.open(‘get’, ‘2.get.PHP?username=’ + encodeURI(‘刘伟’) + ‘&age=30&’ + new Date().getTime(), true); 
 // encodeURL()处理中文乱码问题
```

### get方式提交数据
```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<!--<script src="jquery.js"></script>-->
<script>
//$(function(){})    //阻塞 -> 同步

//非阻塞 - 异步
/*setTimeout(function() {
    alert(1);
}, 2000);

alert(2);*/

window.onload = function() {

    var oBtn = document.getElementById('btn');

    oBtn.onclick = function() {

        var xhr = null;
        try {
            xhr = new XMLHttpRequest();
        } catch (e) {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }
        /*
            1.缓存 在url？后面连接一个随机数，时间戳
            2.乱码 编码encodeURI
        */
        xhr.open('get','2.get.php?username='+encodeURI('刘伟')+'&age=30&' + new Date().getTime(),true);
        xhr.send();

        xhr.onreadystatechange = function() {

            if ( xhr.readyState == 4 ) {
                if ( xhr.status == 200 ) {
                    alert( xhr.responseText );
                } else {
                    alert('出错了,Err：' + xhr.status);
                }
            }

        }

    }
}
</script>
</head>

<body>
    <input type="button" value="按钮" id="btn" />
</body>
</html>
```
### post方式提交数据
```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<!--<script src="jquery.js"></script>-->
<script>
//$(function(){})    //阻塞 -> 同步

//非阻塞 - 异步
/*setTimeout(function() {
    alert(1);
}, 2000);

alert(2);*/

window.onload = function() {

    var oBtn = document.getElementById('btn');

    oBtn.onclick = function() {

        var xhr = null;
        try {
            xhr = new XMLHttpRequest();
        } catch (e) {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }

        xhr.open('post','2.post.php',true);
        //post方式，数据放在send()里面作为参数传递
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');//申明发送的数据类型
        //post没有缓存问题
        //无需编码
        xhr.send('username=刘伟&age=30');

        xhr.onreadystatechange = function() {

            if ( xhr.readyState == 4 ) {
                if ( xhr.status == 200 ) {
                    alert( xhr.responseText );
                } else {
                    alert('出错了,Err：' + xhr.status);
                }
            }

        }

    }
}
</script>
</head>

<body>
    <input type="button" value="按钮" id="btn" />
</body>
</html>
```
## 封装ajax.js
```javascript
function ajax(method, url, data, success) {
        var xhr = null;
        try {
                xhr = new XMLHttpRequest();//new一个xhr对象，这个对象像信使一样存在着
        } catch (e) {
                xhr = new ActiveXObject('Microsoft.XMLHTTP');//为了兼容IE6
        }
        //如果是get请求，而且data存在，则是要通过get请求发送数据，通过get请求发送数据，数据会被链接到请求地址之后
        if (method == 'get' && data) {
                url += '?' + data;
        }
        //初始化请求，method表示请求方式，url是请求地址，true表示异步
        xhr.open(method,url,true);
        if (method == 'get') {
                xhr.send();//发送请求
        } else {
                xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');//post方式，需要设置请求头
                xhr.send(data);//发送提交数据
        }
        xhr.onreadystatechange = function() {
                if ( xhr.readyState == 4 ) {//4是请求最后的阶段，
                        //http状态码，2开头便是还请求成功
                        if ( xhr.status == 200 ) {
                                success && success(xhr.responseText);//在这里判断一下，如果success存在，则执行它，将响应数据作为参数传入回调函数
                        } else {
                                alert('出错了,Err：' + xhr.status);
                        }
                }
        }
}
```
jquery $ajax
```javascript
jQuery(document).ready(function () {
    $.ajax({
        type: "get", //jquey是不支持post方式跨域的
        async: false,
        url: "http://thinke.cn/yqschool/slide", //跨域请求的URL
        dataType: "jsonp",
        //传递给请求处理程序，用以获得jsonp回调函数名的参数名(默认为:callback)
        jsonp: "jsoncallback",
        //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
        jsonpCallback: "success_jsonpCallback",
        //成功获取跨域服务器上的json数据后,会动态执行这个callback函数
        success: function (data) {
            //console.log(json[0].title);
            //console.log(json.length);
            for(var i=0;i<data.length;i++){
                console.log(data[i].title);
                console.log(data[i].date);
                console.log(data[i].link);
            }
        }
    });
});
```
