---
title: 在线考试系统（vue2 + elementui + express4 + MongoDB）
date: 2018-05-05 15:05:55
type: "tags"
tags:
	- vue
	- express
	- mongodb
	- elementUI
categories: "vue"
description: "这是我毕业项目，从0到1，前后台独立开发完成。功能不多，在此记录,温故而知新！"
---

>这是我毕业项目，从0到1，前后台独立开发完成。功能不多，在此记录,温故而知新！项目github地址:[https://github.com/FinGet/Exam][1] ，博客地址：[https://finget.github.io/](https://finget.github.io/)。

---

> 更新记录：2018-4-9，md5加密


## win10安装mongodb

window下安装mongodb，需要参考的可以移步我的博客中：[win10安装mongodb](https://finget.github.io/2018/05/05/win-mongodb/)

## 项目初始化
本次项目使用的是express4 + vue2+ + elementUI1+ + mongodb3.4+

先看项目文件目录结构：

![](https://i.imgur.com/RV9862f.png)

> 我页面用的vue所以`server/views`和`server/public`都没有用

- 项目建立用的是vue-cli:
`vue init webpack exam`
- 项目中前后台是写在一个项目中的：
```javascript
npm i -g express-generator
// 在项目文件根目录下
express server
```
由于前后台都是写在一个项目中的，我就将`server`下的`package.json`和`vue`下的`package.json`合并了

![](https://i.imgur.com/a5uBeQh.png)

### 安装一些插件

#### axios 请求数据
`npm i axios --save`
首先axios不支持vue.use()式声明
```javascript
// 在main.js中如下声明使用
import axios from 'axios';
Vue.prototype.$axios=axios;
// 那么在其他vue组件中就可以this.$axios调用使用
```

#### elementUI
`npm i element-ui --save`
```javascript
import ElementUI from 'element-ui' // 加载ElementUI
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI) // 全局使用elementUI
```
#### vue-lazyload 图片懒加载
`npm i vue-lazyload --save`
```javascript
// main.js
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad, { // 全局使用图片懒加载
  loading: 'static/loading-svg/loading-bars.svg', // 图片还没加载时的svg图片
  try: 1 // default 1
})
```
使用懒加载：
```javascript
<img width="300" height="53" v-lazy="logoSrc" alt="">
logoSrc:require('../common/img/logo.png')
// 不能写成：<img width="300" height="53" v-lazy="../common/img/logo.png" alt="">
```
#### mongoose 操作mongodb的
`npm i mongoose --save`

> 就不一一列举所有的插件了（没有用vuex）

## 开发上的一些事

### 前台相关
#### sessionStorage
```javascript
// commonFun.js
//获取sessionStorage
function getSessionStorage(key, format) {
  var data;
  if (sessionStorage.getItem(key)) {
    if (format == 'json') {
      data = JSON.parse(sessionStorage.getItem(key));
    } else {
      data = sessionStorage.getItem(key);
    }
  } else {
    data = false
  }
  return data;
}
//写入sessionStorage
function setSessionStorage(key, content, format) {
  var data;
  if (format == 'json') {
    data = JSON.stringify(content);
  } else {
    data = content;
  }
  sessionStorage.setItem(key, data);
}
export var mySessionStorage = {
  get: getSessionStorage,
  set: setSessionStorage
}
```
全局挂载
```javascript
// main.js
import * as commonFun from './common/js/commonFun.js'
Vue.prototype.$mySessionStorage = commonFun.mySessionStorage;
```
在页面中使用
```javascript
this.$mySessionStorage.set(key,content,format);
this.$mySessionStorage.get(key);
```

#### 登录检测
```javascript
// main.js
// 登录判断
router.beforeEach((to, from, next) => {
  var userdata = getUserData();
  if (to.path != '/managelogin'&&to.name!='404'&&to.path != '/'&&to.path != "/frontregister"&&to.path!='/manageregister') {  // 判断是否登录
    if(!userdata.userName){
      ElementUI.Message.error('抱歉，您还没有登录！');
      if(to.path.indexOf('front')>0){
        router.push({path:'/'});
      } else {
        router.push({path:'/managelogin'});
      }
    } else {
      next();
    }
  }
  else {
    next();
  }
})
```

#### 面包屑导航

> 绑定面包屑要根据实际情况来定，但是`this.$router.currentRoute.matched`是最主要的

```javascript
<template>
  <div class="bread">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(item, index) in breadData" :key="item.id" :to="{ name: item.meta.breadName=='管理系统'?'Index':item.name }">{{item.meta.breadName}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        breadData:[]
      }
    },
    watch: {
      $route () {
        this.initBreadData();
      }
    },
    methods:{
      //面包屑
      initBreadData(){
        this.breadData=this.$router.currentRoute.matched;
        // console.log(this.breadData)
      }
    },
    created(){
      this.initBreadData();
    }
  }
</script>
```
路由部分：

![](https://i.imgur.com/pagOWnL.png)

#### elementui面包屑导航与左侧导航相对应
> 根据实际情况来，不能套用，要看你的路由怎么写的 `this.$router.currentRoute.path`
`:default-active="activeIndex"`

```JavaScript
// conponents/sidebar.vue
//初始化列表active状态
...
methods:{
  initActiveIndex(){
    // var str =this.$router.currentRoute.path;
    this.activeIndex=this.$router.currentRoute.path;
    // console.log(str)
  }
},
watch:{
  '$route':'initActiveIndex'
},
created(){
  this.initActiveIndex();
}
...
```
#### 配置代理
要想请求到后台数据，这一步是必须的
配置代理之后，localhost:8088/api/* -> localhost:3000/api/*
```
config/index.js
proxyTable: {
  // proxy all requests starting with /api to jsonplaceholder
  '/api': {
    target: 'http://127.0.0.1:3000/api', // 端口号根据后台设置来，默认是3000
    changeOrigin: true,
    pathRewrite: {
      '^/api': ''  // 若target中没有/api、这里又为空，则404；
    }
  }
},
```
#### ElementUi动态增加表单的表单验证 大坑
```javascript
<div  v-if="dialogForm.type!='judgement'&&dialogForm.type!='Q&A'">
    <el-form-item v-for="(item,index) in dialogForm.surveyQuestionOptionList"
    :key="item.key"
    :label="'选项'+(index+1) +'：'"
    :prop="'surveyQuestionOptionList.' + index + '.optionContent'"
    :rules="{
      required:true, message:'选项不能为空', trigger:'blur'
    }"
    >
    // 最重要的是prop 一定要带上`.optionContent`，也就是你绑定值的key
      <el-input placeholder="请输入选项" class="dialog_input" v-model="item.optionContent"></el-input>
      <i class="el-icon-delete delete-icon" @click="deleteDlalogOption(index)"></i>
    </el-form-item>
    <el-button type="primary" size="small" class="marginB10" @click="addDialogOption">添加选项</el-button>
</div>
```

#### query要用path来引入，params要用name来引入
```javascript
goToExam(id){
// params传参只能用name引入
  this.$router.push({name:'ForntExam',params:{id:id}});
}
```

#### Elementui 单选框对上单选题

```javascript
<div class="single">
    <h4>单选题（只有一个正确答案）</h4>
    <ul>
      <li class="marginB10" v-for="(item,index) in singleQuestions" :key="item.id">
        <p class="question-title">{{index+1}} 、{{item.name}}（）</p>
    
        <span class="option"
              v-if="item.type!='judgement'&&item.type!='Q&A'"item
              v-for="(item1,index1) in item.selection" :key="item1.id">
          <el-radio v-model="item.sanswer" :label="options[index1]" :key="index1">{{options[index1]}}、{{item1}}</el-radio>
          </span>
      </li>
    </ul>
</div>
```

```javascript
init(){
  if(this.id == '' || !this.id ){
    this.$router.push({path:'forntexamindex'});
    return
  } else {
    this.$axios.get('/api/getExamInfo',{
      params:{
        id: this.id
      }
    }).then(response => {
      let res = response.data;
      if(res.status == '0') {
        for(let key in this.paperData) {
          this.paperData[key] = res.result[key];
        }
        res.result._questions.forEach(item => {
          if(item.type=='single'){
            item.sanswer = ''; // 重要的在这 给他新增一个属性，用来存答案
            this.singleQuestions.push(item);
          } else if(item.type == 'multi'){
            item.sanswer = []; // 多选题
            this.multiQuestions.push(item);
          } else if(item.type == 'Q&A') {
            item.sanswer = ''; 
            this.QAQuestions.push(item);
          } else if(item.type == 'judgement'){
            item.sanswer = '';
            this.judgeQuestions.push(item);
          }
        })
      }
  }).catch(err => {
    this.$message.error(err);
  })
}
}
```

### 后台相关
#### 连接数据库
在server根目录下新建`db.js`
```javascript
// db.js
var mongoose = require('mongoose');
var dbUrl = 'mongodb://127.0.0.1:27017/examSystem';
var db = mongoose.connect(dbUrl);
db.connection.on('error',function(error) {
	console.log('数据库链接失败：'+ error);
});
db.connection.on('connected',function() {
	console.log('数据库链接成功!');
});
db.connection.on('disconnected',function() {
	console.log('Mongoose connection disconnected');
});

module.exports = db;
```
```javascript
// server/app.js
// 链接数据库
require('./db');
```
#### 配置seesion
需要`express-session` 和 `cookie-parser`插件 
```javascript
// app.js
// 加载解析session的中间件
// session 的 store 有四个常用选项：1）内存 2）cookie 3）缓存 4）数据库
// 数据库 session。除非你很熟悉这一块，知道自己要什么，否则还是老老实实用缓存吧 需要用到（connect-mongo插件 line 7）
// app.use(sessionParser({ 会在数据库中新建一个session集合存储session
// 	secret: 'express',
// 	store: new mongoStore({
// 		url:'mongodb://127.0.0.1:27017/examSystem',
// 		collection:'session'
// 	})
// }));

// 默认使用内存来存 session，对于开发调试来说很方便
app.use(sessionParser({
  secret: '12345', // 建议使用 128 个字符的随机字符串
  name: 'userInfo',
  cookie: { maxAge: 1800000 }, // 时间可以长点
  resave:true,
  rolling:true,
  saveUninitialized:false
}));
```

#### 配置后台路由
默认的使用方式：
```javascript
// appi.js
var index = require('./routes/index');
app.use('/', index);
```
```javascript
// routes/index
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
   res.render('index', { title: 'Express' });
});

module.exports = router;
```
我之前做的一个电子商城采用的这种方式：[github地址][2]


我的项目中：
```javascript
// app.js
var indexs = require('./routes/index');
var routes = require('./routes/routes');

indexs(app);
routes(app);
```
```javascript
// routes/index.js
module.exports = function(app) {
  app.get('/api', (req, res) => {
	res.render('index', {title: 'Express'});
  })
}
```

两种方式有什么不同：
- 如果你有多个路由文件 （例如`goods.js`,`index.js`,`users.js`……）,你都需要去app.js中引入

```javascript
// app.js
var index = require('./routes/index');
var users = require('./routes/users');
var goods = require('./routes/goods');
app.use('/', index);
app.use('/users', users);
app.use('/goods', goods);
```
在前台请求的时候：
```javascript
// goods.js
....
router.get("/list", function (req, res, next) {
    ...
}
```

```javascript
// xxx.vue
...
this.$axios.get('/goods/list').then()... // 不能忘了加上goods，也就是你在app.js中定义的一级路由
...
```
> 如果没看懂，可以去[GitHub](https://github.com/FinGet/Node-vue-mongodb)上看一下实际代码，有助于理解

- 第二种方式
不用在app.js中引入各个路由文件，一个`route.js`就搞定了

```javascript
// route.js
var Teacher = require('../controllers/teacher'),
    Student = require('../controllers/student');
module.exports = function(app) {

  /*----------------------教师用户----------------------*/
  app.post('/api/register',Teacher.register);
  // 用户登录
  app.post('/api/login', Teacher.signup);
  // 登出
  app.post("/api/logout", Teacher.signout);
  // 获取用户信息
  app.post('/api/getUserInfo',Teacher.getUserInfo);
  // 修改用户信息
  app.post('/api/updateUser', Teacher.updateUser);
  // 获取试卷(分页、模糊查询)
  app.get('/api/mypapers', Teacher.getPapers);
	....


  /*----------------------学生用户----------------------*/
  // 学生注册
  app.post('/api/studentregister',Student.register);
  // 学生登录
  app.post('/api/studentlogin', Student.signup);
  ....

}
```
可以看到，我将每个路由的方法都是提取出去的，这样可以避免这个文件不会有太多的代码，可读性降低，将代码分离开来，也有助于维护

![](https://i.imgur.com/19bvKRe.png)

在使用的时候：

```javascript
// xxx.vue
...
this.$axios.get('/api/getexamlogs').then()... 
...
```

#### 数据库的相关操作
我这次用mongodb，主要是因为可以用js来操作，对我来说比较简单，mysql我不会用。在实际开发过程中发现，考试系统各个表（集合）都是需要关联，mongodb这种非关系型数据库，做起来反而麻烦了不少。在此将一些数据库增删改查的方法回顾一下。

##### 初始化一条数据
> 如果对mongodb，mongoose没有基础的了解，建议看一看[mongoose深入浅出][3] ，[mongoose基础操作][4]

```javascript
// controllers/student.js
const Student = require('../model/student');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var student = new Student({
    userId: 12001, // 学号
    userName: '张三', // 用户名
    passWord: '123321', // 密码
    grade: 3, // 年级 1~6 分别代表一年级到六年级
    class: 3, // 班级
    exams:[{ // 参加的考试
      _paper:Schema.Types.ObjectId("5a40a4ef485a584d44764ff1"), // 这个是_id，在mongodb自动生成的，从数据库复制过来，初始化一个学生，应该是没有参加考试的
      score:100,
      date: new Date(),
      answers: []
    }]
})
// 保存
student.save((err,doc) => {
  console.log(err);
});
```
##### 用户注册，其实就是创建一条数据
```javascript
exports.register = function (req,res) {
  let userInfo = req.body.userInfo; // req.body 获取post方式传递的参数
  Student.findOne(userInfo,(err,doc) => {
    if(err) {
      ...
     } else {
       if(doc) {
         res.json({
           status:'2',
           msg: '用户已存在'
         })
        } else {
          userInfo.exams = [];
          // userInfo 是个对象，包含了用户相关的信息
          Student.create(userInfo,(err1,doc1) => {
          if(err1) {
            ...
          }else {
            if(doc1) {
              ...
            } else {
             ...
          }
        }
      })
     }
    }
   })
 };
```
##### 获取考试记录,子文档数组分页模糊查询
如下图是我的`student`集合:

![](https://i.imgur.com/sjKcFYU.png)
在该集合中，学生参加过的考试记录，存在`exams`数组中，当想实现分页查询几条数据的时候，需要用到`$slice`

> `$slice:[start,size]`  第一个参数表示，数组开始的下标，第二个表示截取的数量
> 在后台接收到前台传递的`pageSize`和`pageNumber`时，需要计算出当前需要截取的下标，即`let  skip = (pageNumber-1)*pageSize`

```javascript
exports.getExamLogs = function (req, res){
  let userName =req.session.userName;
  let name = req.param('name');
    // 通过req.param()取到的值都是字符串，而limit()需要一个数字作为参数
  let  pageSize = parseInt(req.param('pageSize'));
  let  pageNumber = parseInt(req.param('pageNumber'));
  let  skip = (pageNumber-1)*pageSize; // 跳过几条
  let  reg = new RegExp(name,'i'); // 在nodejs中，必须要使用RegExp，来构建正则表达式对象。
  Student.findOne({"userName":userName},{"exams":{$slice:[skip,pageSize]}}).populate({path:'exams._paper',match:{name: reg}})
    .exec((err,doc) => {
      if (err) {
        ...
      } else {
        if (doc) {
          res.json({
            status: '0',
            msg:'success',
            result:doc,
            count: doc.exams.length?doc.exams.length:0
          })
        } else {
          ...
        }
      }
    })
};
```
##### 另一种分页模糊查询--在文档之间（document）

![](https://i.imgur.com/je9ierB.png)

>每个试卷都是独立的文档，通过他们的名称`name`实现模糊查询

```javascript
// 获取考试信息
exports.getExams = function (req,res) {
  let userName =req.session.userName;
  let name = req.param('name');
    // 通过req.param()取到的值都是字符串，而limit()需要一个数字作为参数
  let  pageSize = parseInt(req.param('pageSize'));
  let  pageNumber = parseInt(req.param('pageNumber'));
  let skip = (pageNumber-1)*pageSize; // 跳过几条
  let reg = new RegExp(name,'i'); // 在nodejs中，必须要使用RegExp，来构建正则表达式对象。
  Student.findOne({"userName":userName},(err,doc)=>{
    if(err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if(doc) {
      // 关键在这里
        Paper.find({startTime:{$exists:true},name:reg}).skip(skip).limit(pageSize).populate({path:'_questions'}).exec((err1,doc1)=>{
        ....  
  })
};
```
##### 还有一种模糊分页查询--查询关联文档再模糊分页查询

![](https://i.imgur.com/T5uaimo.png)

> 先通过`populate`查询除关联文档，在模糊分页查询

```javascript
exports.getPapers = function (req, res) {
  // console.log(req.session.userName);
  let name = req.param('name'),
    // 通过req.param()取到的值都是字符串，而limit()需要一个数字作为参数
    pageSize = parseInt(req.param('pageSize')),
    pageNumber = parseInt(req.param('pageNumber')),
    userName = req.session.userName;
  let skip = (pageNumber-1)*pageSize; // 跳过几条
  let reg = new RegExp(name,'i'); // 在nodejs中，必须要使用RegExp，来构建正则表达式对象。
  let params = {
    name: reg
  };
  Teacher.findOne({'userName':userName}).populate({path:'_papers',match:{name: reg},options:{skip:skip,limit:pageSize}})
    .exec((err, doc) => {
      ....
    })
};
```

##### populate
mongodb本来就是非关系型的数据库，但是有很多时候不同的集合直接是需要关联的，这是就用到了mongoose提供的`populate`

直接看图，不同集合直接的关联，用的就是`_id`,比如下图中，学生参加的考试，关联了试卷，试卷里面又关联了题目

![](https://i.imgur.com/n4IthLV.png)

怎么查询呢：

```javascript
Student.findOne({}).populate({path:'exams._paper'}).exec(....)
```
更多的可以看看我项目中的实际代码都在`server/controllers`下面

##### 关联集合的新增
在系统中，教师可以增加试卷，这个时候我就不知道该怎么保存前台传过来的数据。数据中既有试卷的信息，也有很多题目。题目都属于该试卷，改试卷又属于当前登录系统的老师（即创建试卷的老师）。
怎么才能让试卷、教师、问题关联起来啊，ref存的是_id,然而这些新增的数据，是保存之后才有_id的。

```javascript
exports.savePaper = function (req, res) {
  let paperForm = req.body.paperForm;
  let userName = req.session.userName;
  if(paperForm == {}){
    res.json({
      status:'5',
      msg: '数据不能为空'
    })
  }
  // 第一步查找当前登录的教师
  Teacher.findOne({"userName": userName}, (err,doc)=>{
    if (err) {
      ...
    } else {
      if (doc) {
        let paperData = {
          name:paperForm.name,
          totalPoints:paperForm.totalPoints,
          time:paperForm.time,
          _teacher: doc._id, // 这里就可以拿到教师的_id
          _questions: [],
          examnum:0
        }
        // 第二步创建试卷
        Paper.create(paperData,function (err1,doc1) {
          if (err1) {
            ...
          } else {
            if (doc1) {
              doc._papers.push(doc1._id); // 教师中添加该试卷的_id
              doc.save(); // 很重要 不save则没有数据
              
              // 第三步 创建问题
              paperForm._questions.forEach(item => {
                item._papers = [];
                item._papers.push(doc1._id); // 试卷中存入试卷的_id，因为此时已经创建了试卷，所以可以拿到_id
                item._teacher = doc._id;  // 试卷中存入教师的_id
              })
              Question.create(paperForm._questions,function (err2,doc2) {
                if (err2) {
                  ...
                } else {
                  if (doc2) {
                    doc2.forEach(item => {
                      doc1._questions.push(item._id); // 当问题创建成功，则在试卷中存入问题的_id
                    })
                    doc1.save();
                    res.json({
                      status:'0',
                      msg: 'success'
                    })
                  } else {
                    ...
                  }
                }
              })
            } else {
              ...
            }
          }
        })
      }
      else {
       ...
      }
    }
  })
};
```
##### 关联集合的删除---删除试卷
>删除某一个试卷，既要删除教师中对应的试卷_id,也要删除问题中对应的试卷_id
```javascript
// 删除试卷
exports.deletePaper = function (req, res) {
  let id = req.body.id;
  let userName = req.session.userName;
  // 第一步 删除教师中的_id _papers是一个数组，所以用到了`$pull`
  Teacher.update({"userName":userName},{'$pull':{'_papers':{$in:id}}}, (err,doc)=>{
    if (err) {
      res.json({
        status:'1',
        msg: err.message
      })
    } else {
      if (doc) {
        // 第二步  删除试卷 即 移除一个文档
        Paper.remove({"_id":{$in:id}},function (err1,doc1){
          if(err1) {
            res.json({
              status:'1',
              msg: err1.message
            })
          } else {
            if (doc1) {
            // 第三步  updateMany删除多个问题中的_id 这里并没有删除试卷中包含的问题，是为了以后题库做准备
              Question.updateMany({'_papers':{$in:id}},{'$pull':{'_papers':{$in:id}}},function (err2,doc2) {
                if(err2){
                  ...
                } else {
                  if (doc2){
                    ...
                  }
                }
              })
            } else {
              ...
            }
          }
        })
      } else {
       ...
      }
    }
  })
};
```
##### 关联集合多条数据的更新--修改试卷
```javascript
// 修改试卷-修改试卷
exports.updatePaper = function (req,res) {
  let userName = req.session.userName;
  let params = req.body.params;
  let paperParams = { // 试卷需要更新的字段
    name: params.name,
    totalPoints: params.totalPoints,
    time: params.time
  }
  let updateQuestion = []; // 需要更新的题目
  let addQuestion = []; // 需要新增的题目
  params._questions.forEach(item => {
    if(item._id) {  // 通过判断是否有_id区分已有的或者是新增的
      updateQuestion.push(item);
    } else {
      addQuestion.push(item);
    }
  })
  Teacher.findOne({'userName':userName},(err,doc)=>{
    if (err) {
      ...
    } else {
      if (doc) {
        Paper.findOneAndUpdate({"_id":params._id},paperParams,(err1,doc1) => {
          if(err1) {
            ...
          }else {
            if(doc1){
              updateQuestion.forEach((item,index)=>{ // 循环更新题目，好像很傻的方法，可能有更好的办法
                Question.update({"_id":item._id},item,(err2,doc2)=>{
                  if(err2){
                    res.json({
                      status:'1',
                      msg: err2.message
                    })
                  }else {
                    if(doc2){
                      if(index == (updateQuestion.length-1)){
                        if (addQuestion.length>0){
                          addQuestion.forEach(item => {
                            item._papers = [];
                            item._papers.push(doc1._id);
                            item._teacher = doc._id;
                          })
                          // 创建新增题目
                          Question.create(addQuestion,(err3,doc3) => {
                            if(err3) {
                             ...
                            } else {
                              if(doc3) {
                                doc3.forEach(item => {
                                  doc1._questions.push(item._id); // 还要将新增的题目关联到试卷当中
                                })

                                doc1.save(); // 很重要 不save则没有数据
                                res.json({
                                  status:'0',
                                  msg: 'success'
                                })
             // .......................判断太长省略........................
  })
};
```
##### 更新子文档数组--阅卷打分
```javascript
// 打分提交
exports.submitScore = function (req, res) {
  let name = req.param('userName'),
    date = req.param('date'),
    score = req.param('score') - 0,
    userName = req.session.userName;
  Teacher.findOne({'userName':userName},(err,doc) => {
    if(err) {
      ...
    } else {
      if(doc) {
        Student.update({"userName":name,"exams.date":date},{$set:{"exams.$.score":score,"exams.$.isSure":true}},(err1, doc1) => {
          if(err1) {
            ...
          } else {
            if(doc1) {
              ...
            } else {
              ...
            }
          }
        })
      } else {
        ...
      }
    }
  })
};
```
#### md5加密

```javascript
//student.js
const crypto = require('crypto');

let mdHash = function(data){
  // hash 的定义要写在这个方法内，不然会报错Digest already called ****
  const hash = crypto.createHash('md5');
  return hash.update(data).digest('hex');
}

// 使用
//注册
exports.register = function (req,res) {
  let userInfo = req.body.userInfo;
  //获取到前台传过来的密码，先加密再存储
  userInfo.passWord = mdHash(userInfo.passWord);
    ...

```

[1]: https://github.com/FinGet/Exam
[2]: https://github.com/FinGet/Node-vue-mongodb
[3]: https://www.villainhr.com/page/2016/05/11/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAmongoose
[4]: https://segmentfault.com/a/1190000014736907


## 最后

创建了一个前端学习交流群，感兴趣的朋友，一起来嗨呀！
![](https://i.imgur.com/qbcaSEh.png)