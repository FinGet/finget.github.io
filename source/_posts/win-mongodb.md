---
title: win10下安装配置mongodb
date: 2018-05-05 14:59:28
type: "tags"
tags:
	- mongodb
categories: "mongodb"
description: "win10下安装配置mongodb"
---

## 下载Mongodb
[各个版本下载地址](http://dl.mongodb.org/dl/win32/x86_64)
![](https://i.imgur.com/Oh0ZwCV.png)
## 安装Mongodb
一路下一步就行了
![](https://i.imgur.com/evefSbo.png)
### 配置Mongodb

 1. 在c:\MongoDB（可随意起）下面建一个data文件夹 c:\MongoDB\data
   
 2. 在c:\MongoDB（可随意起）下面建一个logs文件夹 c:\MongoDB\logs ，在里面建一个文件mongo.log
   
 3. 在c:\MongoDB（可随意起）下面建一个etc(随意起，放配置文件)文件夹 c:\MongoDB\etc ,在里面建一个文件mongo.conf

打开mongo.conf文件，修改如下：
```
#数据库路径
dbpath=c:\MongoDB\data\
#日志输出文件路径
logpath=c:\MongoDB\logs\mongodb.log
#错误日志采用追加模式，配置这个选项后mongodb的日志会追加到现有的日志文件，而不是从新创建一个新文件
logappend=true
#启用日志文件，默认启用
journal=true
#这个选项可以过滤掉一些无用的日志信息，若需要调试使用请设置为false
quiet=false
#端口号 默认为27017
port=27017
```

### 运行mongodb
![](https://i.imgur.com/sRNRLpT.png)

### 配置mongodb服务

`mongod --config c:\MongoDB\etc\mongo.conf --install --serviceName "MongoDB"`

![](https://i.imgur.com/kFFf50n.png)

### 配置环境变量
![](https://i.imgur.com/JlL9IiO.png)

## 下载安装Robo 3T
下载一个图形化界面工具
![](https://i.imgur.com/EST4sUn.png)
