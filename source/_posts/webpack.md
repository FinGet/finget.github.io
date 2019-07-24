---
title: 四大维度解锁webpack3笔记
date: 2018-02-08 10:44:38
type: "tags"
tags:
	- webpack
categories: "webpack"
description: "webpack学习笔记"
---
![](https://ask.qcloudimg.com/draft/5687933/sqqa3q34m4.png?imageView2/2/w/1620)

## Webpack简介
### Webpack 概述
>本质上，webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

![](https://ask.qcloudimg.com/draft/5687933/ecrt1u7m9h.png?imageView2/2/w/1620)
[**Webpack官网**](https://webpack.js.org/)

### Webpack 的版本更迭

- Webpack v1.0.0 --- 2014.2.20
- Webpack v2.2.0 --- 2017.1.18
- Webpack v3.0.0 --- 2017.6.19

### Webpack 功能进化
- Webpack V1
	- 编译、打包
	- HMR(模块热更新)
	- 代码分割
	- 文件处理(loader、plugin)
- Webpack V2
	- Tree Shaking(在项目中没有实际运用的代码会被删除，打包体积更小)
	- ES module
	- 动态Import
- Webpack V3
	- Scope Hoisting(作用域提升)
	- Magic Comments(配合动态import使用)

## 核心概念
### Entry
> 代码的入口，打包入口

```javascript
// 一个入口
module.exports = {
  entry: 'index.js'
};
// 推荐写法
module.exports = {
  entry: {
	index: 'index.js'
  }
};
// 多个入口
module.exports = {
  entry: {
    pageOne: './src/pageOne/index.js',
    pageTwo: './src/pageTwo/index.js',
    pageThree: './src/pageThree/index.js'
  }
}
```
### Output
```javascript
{
  entry: {
    app: './src/app.js',
    search: './src/search.js'
  },
  output: {
    filename: '[name].js', // 打包之后的文件名 [name]就对应entry里面的key值。
    path: __dirname + '/dist' // 打包输出文件路径
  }
}
```
### Loaders

``` javascript
// 单个loader
module.exports = {
  module: {
    rules: [
      { test: /\.css$/, use: 'css-loader' },
      { test: /\.ts$/, use: 'ts-loader' }
    ]
  }
};
```

```javascript
// 多个loader
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/, // 正则匹配css文件
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: { // loader配置
              modules: true
            }
          }
        ]
      }
    ]
  }
};
```
### Plugins
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const path = require('path');

const config = {
  entry: './path/to/my/entry/file.js',
  output: {
    filename: 'my-first-webpack.bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'}) // 根据`./src/index.html`生成一个首页，会引入打包的js、css文件
  ]
};

module.exports = config;
```

## 使用Webpack
### 安装Webpack
`npm i -g webpack`
当然你得先安装nodejs、Git

在命令行输入`webpack -h`，成功就出现下图，有很多webpack命令可以看一看
![](https://i.imgur.com/U53NRJ8.png)

### 打包js
`webpack entry<entry> output`
`webpack --config webpack.config.js`
#### 第一个栗子
新建一个app.js和sum.js

app.js
```javascript
// es module
import sum form './sum'

console.log(sun(1,2));
```
sum.js
```javascript
export default function (a,b) {
  return a + b;
}
```

通过命令行打包：
```javascript
webpack app.js bundle.js
// app.js 是入口文件 bundle.js是打包输出文件
```

### 编译ES6

需要两个loader：
`npm i babel-loader babel-core -D`

```javascript
module.exports = {
	entry: {
		app: 'app.js'
	},
	output: {
		filename: '[name].[hash:8].js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: 'babel-loader',
				exclude: '/node_modules/' // 将node_module中的文件排除在外，因为已经是编译过的
			}
		]
	}
}
```

`{ test: Condition }`：匹配特定条件。一般是提供一个正则表达式或正则表达式的数组，但这不是强制的。

`{ include: Condition }`：匹配特定条件。一般是提供一个字符串或者字符串数组，但这不是强制的。

`{ exclude: Condition }`：排除特定条件。一般是提供一个字符串或字符串数组，但这不是强制的。

`{ and: [Condition] }`：必须匹配数组中的所有条件

`{ or: [Condition] }`：匹配数组中任何一个条件

`{ not: [Condition] }`：必须排除这个条件

#### Babel Presets
虽然引入了`babel-loader`，但是它并不知道是根据什么规范来打包的，这个时候就需要配置一个Babel Presets（预设）
`npm i babel-preset-env -D`

```javascript
module.exports = {
...
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: { // options 属性为字符串或对象。值可以传递到 loader 中，将其理解为 loader 选项。
						presets: ['babel-preset-env']
					}
				},
				exclude: '/node_modules/' // 将node_module中的文件排除在外，因为已经是编译过的
			}
		]
	}
}
```
#### Babel Polyfill
`npm install --save babel-polyfill`
使用babel-polyfill
`import 'babel-polyfill'`

Babel 默认只转换新的 JavaScript 语法，而不转换新的 API。例如，Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign）都不会转译。如果想使用这些新的对象和方法，必须使用 babel-polyfill，为当前环境提供一个垫片。

>Polyfill 垫片：
`polyfill`这个英文单词在js babel中的翻译可以说是垫片，本来指的是衣服中的填充物。
在这里可以说是为了使用某个浏览器或者其他执行环境不支持的函数或者对象能够使用而添加的原型方法，或者第三方库。

例如：
我们想要使用es2015的语法中的某些新的对象方法或者数据类型，就需要添加`babel-polyfill`，例如`Array.from`方法很多浏览器不支持，你就需要垫片来提高兼容性。
为了在版本低浏览器中能够使用`promise`，我们需要提前执行一个`promise`文件，以便能够在全局中使用。

#### babel-runtime
`npm i --save babel-runtime`
Babel 转译后的代码要实现源代码同样的功能需要借助一些帮助函数，例如，{ [name]: 'JavaScript' } 转译后的代码如下所示：
```javascript
'use strict';
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var obj = _defineProperty({}, 'name', 'JavaScript');
```
类似上面的帮助函数 _defineProperty 可能会重复出现在一些模块里，导致编译后的代码体积变大。Babel 为了解决这个问题，提供了单独的包 `babel-runtime` 供编译模块复用工具函数。

`npm i babel-plugin-transform-runtime -D`

新建`.babelrc`文件,之前是直接将presets设置在loader中的，也可以单独写在`.babelrc`文件中，babel会自动读取
```
{
	"presets": [
		["babel-preset-env"]
	],
	"plugins": ["transform-runtime"]
}
```

启用插件 `babel-plugin-transform-runtime` 后，Babel 就会使用 `babel-runtime` 下的工具函数，转译代码如下：
```javascript
'use strict';
// 之前的 _defineProperty 函数已经作为公共模块 `babel-runtime/helpers/defineProperty` 使用
var _defineProperty2 = require('babel-runtime/helpers/defineProperty');
var _defineProperty3 = _interopRequireDefault(_defineProperty2);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var obj = (0, _defineProperty3.default)({}, 'name', 'JavaScript');
```
除此之外，babel 还为源代码的非实例方法（Object.assign，实例方法是类似这样的 "foobar".includes("foo")）和 babel-runtime/helps 下的工具函数自动引用了 polyfill。这样可以避免污染全局命名空间，非常适合于 JavaScript 库和工具包的实现。例如 const obj = {}, Object.assign(obj, { age: 30 }); 转译后的代码如下所示：
```javascript
'use strict';
// 使用了 core-js 提供的 assign
var _assign = require('babel-runtime/core-js/object/assign');
var _assign2 = _interopRequireDefault(_assign);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var obj = {};
(0, _assign2.default)(obj, {
  age: 30
});
```

### Typescript

>js的超集，可以在typescript中写JavaScript

#### typescript-loader
官方loader
`npm i typescript ts-loader -D` 
第三方loader
`npm i typescript awesome-typescript-loader -D`

webpack.config.js
```javascript
module.exports = {
  entry: {
    'app': './src/app.ts'
  },
  output: {
    filename: '[name].bundle.js'
  },
  module: {
    rules: {
      test: /\.tsx?$/,
      use: {
        loader: 'ts-loader'
      }
    }
  }
}
```
tsconfig.json
```javascript
{
  "compilerOptions" : {
    "module": "commonjs",
    "target": "es5", // 将ts编译成es5语法
    "allowJs": true  // 是否允许出现js语法
  },
  "include": {
    "./src/*"
  },
  "exclude": {
    "./node_module"
  }
}
```

### 打包公共代码

#### CommonsChunkPlugin

##### 配置：
```javascript
{
  name: string, // or
  names: string[],
  // 这是 common chunk 的名称。已经存在的 chunk 可以通过传入一个已存在的 chunk 名称而被选择。
  // 如果一个字符串数组被传入，这相当于插件针对每个 chunk 名被多次调用
  // 如果该选项被忽略，同时 `options.async` 或者 `options.children` 被设置，所有的 chunk 都会被使用，
  // 否则 `options.filename` 会用于作为 chunk 名。
  // When using `options.async` to create common chunks from other async chunks you must specify an entry-point
  // chunk name here instead of omitting the `option.name`.

  filename: string,
  // common chunk 的文件名模板。可以包含与 `output.filename` 相同的占位符。
  // 如果被忽略，原本的文件名不会被修改(通常是 `output.filename` 或者 `output.chunkFilename`)。
  // This option is not permitted if you're using `options.async` as well, see below for more details.

  minChunks: number|Infinity|function(module, count) -> boolean,
  // 在传入  公共chunk(commons chunk) 之前所需要包含的最少数量的 chunks 。
  // 数量必须大于等于2，或者少于等于 chunks的数量
  // 传入 `Infinity` 会马上生成 公共chunk，但里面没有模块。
  // 你可以传入一个 `function` ，以添加定制的逻辑（默认是 chunk 的数量）

  chunks: string[],
  // 通过 chunk name 去选择 chunks 的来源。chunk 必须是  公共chunk 的子模块。
  // 如果被忽略，所有的，所有的 入口chunk (entry chunk) 都会被选择。


  children: boolean,
  // 如果设置为 `true`，所有  公共chunk 的子模块都会被选择

  deepChildren: boolean,
  // If `true` all descendants of the commons chunk are selected

  async: boolean|string,
  // 如果设置为 `true`，一个异步的  公共chunk 会作为 `options.name` 的子模块，和 `options.chunks` 的兄弟模块被创建。
  // 它会与 `options.chunks` 并行被加载。
  // Instead of using `option.filename`, it is possible to change the name of the output file by providing
  // the desired string here instead of `true`.

  minSize: number,
  // 在 公共chunk 被创建立之前，所有 公共模块 (common module) 的最少大小。
}
```

##### 例子
```javascript
var webpack = require('webpack');
var path = require('path');
module.exports = {
  entry: {
    'pageA': './src/pageA',
    'pageB': './src/pageB'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: 2
    })
  ]
}
```
pageA.js
```javascript
import './subPageA';
import './subPageB';
export default 'pageA';
```
pageB.js
```javascript
import './subPageA';
import './subPageB';
export default 'pageB';
```
subPageA.js
```javascript
import './moudleA';
export default 'subPageA'
```
subPageB.js
```
import './moudleA';
export default 'subPageB'
```
moduleA.js
```javascript
export default 'moduleA'
```
![](https://ask.qcloudimg.com/draft/5687933/6lctjrkhm0.png?imageView2/2/w/1620)

### 代码分割 和 懒加载
>并不是通过配置webpack实现代码分割和懒加载，而是通过改变写代码的方式

#### 两种实现方法
##### webpack methods
###### require.ensure

- []: dependencies
- callback
- errorCallback
- chunkName

###### require.include

##### ES 2015 Loader spec

System.import() -> import()
import() -> Promise
import().then()

#### 代码分割场景
- 分离业务代码 和 第三方依赖
- 分离业务代码 和 业务公共代码 和 第三方依赖
- 分离首次加载 和 访问后加载的代码 (优化，首屏加载)

#### 例子

```javascript
var webpack = require('webpack');
var path = require('path');
module.exports = {
  entry: {
    'pageA': './src/pageA'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
	publicPath: './dist/',
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js'
  }
}
```
pageA.js
```javascript
import './subPageA';
import './subPageB';

// import * as _ from 'lodash'

require.ensure(['lodash'],function(){ // 这一步是引入lodash并不会执行
	var _ = require('lodash'); // 这一步就会执行lodash， 异步加载
	_.join(['1','2'],'3'); // 可以使用lodash
},'vendor') // 'vendor'为 chunk name

// 上面的代码也可以写成
require.ensure([],function(){ 
	var _ = require('lodash'); 
	_.join(['1','2'],'3');
},'vendor')

export default 'pageA';
```
subPageA.js
```javascript
import './moudleA';
export default 'subPageA'
```
subPageB.js
```javascript
import './moudleA';
export default 'subPageB'
```
moduleA.js
```javascript
export default 'moduleA'
```
![](https://ask.qcloudimg.com/draft/5687933/11jb71d3u8.png?imageView2/2/w/1620)

##### 按条件加载模块

pageA.js
```javascript
// 伪代码 按条件加载模块

if(page === 'subpageA') {
	require.ensure(['./subPageA'],function(){
		var subpageA = require('./subPageA');
	},'subPageA')
} else if (page === 'subpageB') {
	require.ensure(['./subPageB'],function(){
		var subpageB = require('./subPageB');
	},'subPageB')
}

require.ensure([],function(){ 
	var _ = require('lodash'); 
	_.join(['1','2'],'3');
},'vendor')

export default 'pageA';
```
![](https://ask.qcloudimg.com/draft/5687933/9fmidzttwj.png?imageView2/2/w/1620)

#### 动态import
pageA.js
```javascript
// 伪代码 按条件加载模块

if(page === 'subpageA') {
	import(/* webpackChunkName:'subpageA' */'./subPageA').then(function(subPageA){
		console.log(subPageA);
	})
} else if (page === 'subpageB') {
	import(/* webpackChunkName:'subpageB' */'./subPageB').then(function(subPageB){
		console.log(subPageB);
	})
}

export default 'pageA';
```

### 处理CSS

- css-loader 
- style-loader // 在页面中插入style标签

`npm i style-loader css-loader`

webpack.config.js
```javascript
module.exports = {
  entry: {
    'app': './src/app.js'
  },
  output: {
    filename: '[name].bundle.js'
  },
  module: {
    rules: {
      test: /\.css$/,
      use: [
		{
          loader: 'style-loader'
      	},
		{
		  loader: 'css-loader'
        }
	  ]
    }
  }
}
```

#### 配置Less/Sass

`npm i less-loader less --save-dev`

`npm i sass-loader node-sass --save-dev`

webpack.config.js
```javascript
module.exports = {
  entry: {
    'app': './src/app.js'
  },
  output: {
    filename: '[name].bundle.js'
  },
  module: {
    rules: {
      test: /\.less$/,
      use: [
		{
        	loader: 'style-loader'
      	},
		{
			loader: 'css-loader'
        },
		{
			loader: 'less-loader'
		}
      ]
    }
  }
}
```

#### 提前CSS

`npm i extract-text-webpack-plugin --save-dev`

webpack.config.js
```javascript
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin);
module.exports = {
  entry: {
    'app': './src/app.js'
  },
  output: {
    filename: '[name].bundle.js'
  },
  module: {
    rules: {
      test: /\.less$/,
      use: ExtractTextWebpackPlugin.extract({
        fallback: {
          loader: 'style-loader'
      	},
		use: [
		  {
		    loader: 'style-loader'
		  },
		  {
		    loader: 'css-loader',
			options:{
			  minimize: true // 压缩
			}
		  },
	      {
		    loader: 'less-loader'
		  }
		]
	  })
    }
  },
  plugins:[
  	new ExtractTextWebpackPlugin({
	  filename: '[name].min.css',
	  allChunks: false
	  //  allChunks默认false，只打包初始化的css，异步加载的css不会打包
	})
  ]
}
```

### PostCSS in WebPack

- PostCSS

	> A tool for transforming CSS with JavaScript

- Autoprefixer

	> 加上浏览器前缀	

- CSS-nano

	> 压缩css

- CSS-next

	> Use tomorrow's CSS syntax,today

#### 安装相关插件
`npm i postcss postss-loader autoprefixer cssnano postcss-cssnext --save-dev`

#### webpack 配置

```javascript
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
module.exports = {
	entry: {
    'app': './src/app.js'
	},
	output: {
    filename: '[name].bundle.js'
	},
	module: {
    rules: {
      test: /\.less$/,
      use: ExtractTextWebpackPlugin.extract({
        fallback: {
          loader: 'style-loader'
        },
        use: [{
          loader: 'style-loader'
        },
        {
          loader: 'css-loader',
          options: {
            minimize: true // 压缩
          }
        },
        {
          loader: 'postcss-loader',
          options: {
          	ident: 'postcss',
            plugins: [
              require('autoprefixer')(),
              require('postcss-cssnext')()
            ]
          }
        },
        {
          loader: 'less-loader'
        }]
      })
    },
    plugins: [
      new ExtractTextWebpackPlugin({
        filename: '[name].min.css',
        allChunks: false
        //  allChunks默认false，只打包初始化的css，异步加载的css不会打包
      })
    ]
  }
}
```

### 文件处理

#### 图片处理

场景：
- CSS中引入的图片 —— `file-loader`
- 自动合成雪碧图 —— `postcss-sprites`
- 压缩图片 —— `img-loader`
- Base64编码 —— `url-loader`

`npm i file-loader url-loader img-loader postcss-sprites --save-dev`

##### file-loader

```javascript
module: {
  rules: [
	{
	  test: /\.(png|jpg|gif|jpeg)$/,
	  use: [
	    {
	      loader: 'file-loader',
	      options: {
            publicPath: '',
            outputPath: 'dist/', // 设置输出文件地址
            useRelativePath: true
          }
        }
      ]
    }
  ]
}
```

##### url-loader

```javascript
module: {
  rules: [{
    test: /\.(png|jpg|gif|jpeg)$/,
    use: [{
      loader: 'url-loader',
      options: {
        publicPath: '',
        outputPath: 'dist/', // 设置输出文件地址
        useRelativePath: true,
        limit: 10000 // 10k
      }
    }]
  }]
}
```
>`urL-loader` 有`file-loader`的功能，可以只用`url-loader`

##### img-loader

```javascript
module: {
  rules: [{
    test: /\.(png|jpg|gif|jpeg)$/,
    use: [{
      loader: 'url-loader',
      options: {
        name: '[name]-[hash:5].min.[ext]', // 5位hash值
        publicPath: '',
        outputPath: 'dist/', // 设置输出文件地址
        useRelativePath: true,
        limit: 10000 // 10k
      }
  	},
    {
      loader: 'img-loader'
    }]
  }]
}
```

##### postcss-sprites

```javascript
module: {
  rules: [{
    test: /\.(png|jpg|gif|jpeg)$/,
    use: [{
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: [
          require('postcss-sprites')({
            spritePath: 'dist/assets/imgs/sprites',
            retina: true // 1@2x.png
          }),
          require('postcss-cssnext')()
        ]
      }
    }]
  }]
}
```

#### 字体文件处理

```javascript
module: {
  rules: [{
    test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
    use: [{
      loader: 'url-loader',
      options: {
        limit: 8192,
        name: 'resource/[name].[ext]'
      }
    }]
  }]
}
```

## 最后

创建了一个前端学习交流群，感兴趣的朋友，一起来嗨呀！
![](<https://image-static.segmentfault.com/207/665/2076650181-5bfe3d1a48e89_articlex>)