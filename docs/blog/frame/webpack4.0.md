---
title: webpack4.x常用配置
---

> 配套代码demo：https://github.com/FinGet/webpack4_demo。博客原文：[https://finget.github.io/2019/07/24/webpack4-0/](https://finget.github.io/2019/07/24/webpack4-0/)

> 打包多页面在git仓库里，并没有单独写出来。

初始化：

`yarn init -y`
`yarn add webpack webpack-cli -D`

> webpack-cli的作用就是让我们能在命令行中使用`webpack`、`npx webpakck` 这些指令。


## webpack基础配置

```javascript
// webpack 是node写出来，所以要按node的写法
const path = require('path');

module.exports = {
	mode: 'development', // 模式 默认值：production [development]
	entry: './src/index.js',  // 打包入口文件
	output: {
		filename: 'bundle.[hash:8].js', // 打包后的文件名
		path: path.resolve(__dirname, 'dist') // 这个路径必须是一个绝对路径，所以需要用path来解析一下
	}
}
```


```javascript
// src/index.js
console.log('hello webpack4.0');
```

`npx webpack` 命令直接打包（npm5.2之后支持的语法）。会打包出一个`main.js`文件

默认支持js模块化：

```javascript
// commonjs
// src/a.js
module.exports = 'FinGet'
// src/index.js
let name = require('./a.js');
console.log(name); // 'FinGet'
```

```javascript
// ES6 module
// src/a.js
export default = 'FinGet'
// src/index.js
import name from './a.js'
console.log(name); // 'FinGet'
```

### 手动配置webpack

- 默认配置文件的名字： `webpack.config.js`。为啥叫这个名字呢？

```javascript
// node_modules/webpack-cli/bin/config/config-yargs.js
...

module.exports = function(yargs) {
  yargs
	.help("help")
	.alias("help", "h")
	.version()
	.alias("version", "v")
	.options({
	  config: {
		type: "string",
		describe: "Path to the config file",
		group: CONFIG_GROUP,
		defaultDescription: "webpack.config.js or webpackfile.js", // 默认名字有两种
		requiresArg: true
	  },
...
```

- 可以通过--config指定配置文件：
```
npx webpack --config xxxx.js
```

- 也可以在`package.json`中配置脚本

```javascript
"script": {
  "build": "webpack --config webpack.config.my.js"
},
```
运行 `npm run build`

- 如果在`package.json`中不设置config文件

```
"script": {
  "build": "webpack"
},
```

运行 `npm run build -- --config webpack.config.my.js`
 `--` 不能少!


- 简化的webpack打包出来的文件：
```javascript
(function(modules) { // webpackBootstrap
  // The module cache 先定义一个缓存
  var installedModules = {};
  // The require function 配置了一个require方法
  function __webpack_require__(moduleId) {

    // Check if module is in cache 检查这个模块是否在缓存中
    if (installedModules[moduleId]) {
        return installedModules[moduleId].exports;
    }
    // Create a new module (and put it into the cache) 创建一个新的模块，并存入缓存
    var module = installedModules[moduleId] = {
        i: moduleId,
        l: false,
        exports: {}
    };

    // Execute the module function
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    // Flag the module as loaded
    module.l = true;

    // Return the exports of the module
    return module.exports;
  }
  // Load entry module and return exports 加载入口模块
  return __webpack_require__(__webpack_require__.s = "./src/index.js");
})({
		// key-value  key -> 模块路径 | value -> 函数
    "./src/a.js": (function(module, exports) {
        eval("module.exports=\"FinGet\";\n\n//# sourceURL=webpack:///./src/a.js?");
    }),
    "./src/index.js": (function(module, exports, __webpack_require__) {
        eval("let name = __webpack_require__(/*! ./a.js */ \"./src/a.js\");\nconsole.log('hello webpack4.0');\nconsole.log(name);\n\n//# sourceURL=webpack:///./src/index.js?");
    })

});
```

### webpack-dev-server

`yarn add webpack-dev-server -D`

它会在内存中生成打包文件。

[官方文档： https://webpack.docschina.org/configuration/dev-server/](https://webpack.docschina.org/configuration/dev-server/)

#### 本地服务
```javascript
// webpack.config.js
// 开发服务器的配置 官方文档： https://webpack.docschina.org/configuration/dev-server/
devServer: {
	contentBase: './dist', // 告诉服务器从哪个目录中提供内容。只有在你想要提供静态文件时才需要。
	publicPath: './dist', // 将用于确定应该从哪里提供 bundle，并且此选项优先。 此路径下的打包文件可在浏览器中访问。
	port: 3000, // 端口
	progress: true, // 打包过程
	open: true, // 自动打开浏览器
	compress: true, // 一切服务都启用 gzip 压缩
	// host: '' , // 指定使用一个 host
	hot: true, // 启用 webpack 的 模块热替换 功能 依赖于HotModuleReplacementPlugin
}

plugins: [
  // 开启webpack全局热更新
  new webpack.HotModuleReplacementPlugin()
]
```

#### 做代理

```javascript
devServer : {
  	proxy: { // 代理
      '/api': {
          target: 'http://localhost:3000',
          pathRewrite: {'^/api' : ''}
      }
    }
}
```

#### mock数据

```javascript
devServer: {
  // 前端mock数据 不存在跨域
  before(app) {
    app.get('/api/goods', (req, res) => {
 	  res.json({
 		code: 0,
 		list: [
 		  {id:1,name:'苹果'},
 		  {id:2,name:'香蕉'}
 	   ]
 	  })
 	})
  }
}
```

### html-webpack-plugin

`yarn add html-webpack-plugin -D`

```javascript
plugins: [
  new HtmlWebpackPlugin({
	template: path.resolve(__dirname,'./public/index.html'), // 模版路径
	filename: 'index.html', // 打包后的文件名
	title: 'webpack4.0', // 顾名思义，设置生成的 html 文件的标题
	/**  
		注入选项。有四个选项值 true, body, head, false
		
		true 默认值，script标签位于html文件的 
		body 底部body 同 true
		head script 标签位于 head 标签内
		false 不插入生成的 js 文件，只是单纯的生成一个 html 文件
	*/
	inject: true, 
	// favicon: 'xxx.ico' // 给生成的 html 文件生成一个 favicon
	minify: { // 压缩
		removeAttributeQuotes: true, // 去掉属性的双引号
		collapseWhitespace: true // 代码压缩成一行
	},
	hash: true, // hash选项的作用是 给生成的 js 文件一个独特的 hash 值，该 hash 值是该次 webpack 编译的 hash 值
	cahe: true, // 默认值是 true。表示只有在内容变化时才生成一个新的文件
	showErrors: true, // 如果 webpack 编译出现错误，webpack会将错误信息包裹在一个 pre 标签内，属性的默认值为 true 

	/**
		chunks 选项的作用主要是针对多入口(entry)文件。当你有多个入口文件的时候，对应就会生成多个编译后的 js 文件。那么 chunks 选项就可以决定是否都使用这些生成的 js 文件。
		chunks 默认会在生成的 html 文件中引用所有的 js 文件，当然你也可以指定引入哪些特定的文件。
	**/
	// chunks: ['index','index2'], 
  })
]
```

### css样式

`yarn add css-loader style-loader less less-loader -D`

在index.js中引入css|less模块
```javascript
// src/index.js
let name = require('./a.js');
require('./assets/css/index.css');
require('./assets/css/commom.less');
console.log('hello webpack4.0');
console.log(name);
```


```javascript
module: { // 模块
  rules: [
	// loader的顺序 默认是从右往左，从上到下
    // css-loader 解析 @import 这种语法的
    // style-loader 将css引入html的head中 style标签
	// {test: /\.css$/, use: ['style-loader','css-loader']}
	{test: /\.(css|less)$/, 
	  use: [
		{
		  loader: 'style-loader',
		  options: {
			insertAt: 'top' // 插入顶部 这样就会被后面的样式覆盖
		  }
		},
		'css-loader',
		'less-loader'
	  ]
	}
  ]
}, 
```

### mini-css-extract-plugin

`yarn add mini-css-extract-plugin -D`

上面打包css会把css文件以style标签的形式写入`index.html`,现在我们就来把它们单独打包成文件。

```javascript
module: { // 模块
	rules: [
		{test: /\.(css|less)$/, 
			use: [
				MiniCssExtractPlugin.loader,
				'css-loader',
				'less-loader'
			]
		}
	]
}, 

plugins: [
  	new MiniCssExtractPlugin({
		filename: 'assets/css/index.css' // 打包到dist/assets/css/index.css
	})
]
```
css3 自动添加各种浏览器前缀:

`yarn add postcss-loader autoprefixer -D`

```javascript
// postcss.config.js
module.exports = {
	plugins: [require('autoprefixer')({'browsers': ['> 1%', 'last 2 versions']})]
}

// webpack.config.js
module: { // 模块
	rules: [
		{test: /\.(css|less)$/, 
			use: [
				MiniCssExtractPlugin.loader,
				'css-loader',
				'postcss-loader',
				'less-loader'
			]
		}
	]
}, 
```

推荐用法是在`package.json`中设置:

> Replace Autoprefixer browsers option to Browserslist config.
  Use browserslist key in package.json or .browserslistrc file.

```javascript
// postcss.config.js
module.exports = {
	plugins: [require('autoprefixer')]
}
```

```javascript
 "browserslist": [
    "> 1%",
    "last 2 versions",
    "not ie <= 8"
  ]
```


压缩css：

⚠️压缩css也要压缩js，不如js不会压缩。

`yarn add optimize-css-assets-webpack-plugin terser-webpack-plugin -D`

```javascript
// webpack.config.js
mode:'production', // * development不会压缩
optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
```

### 处理js

`yarn add babel-loader @babel/babel-core @babel/preset-env  -D`

> ⚠️`@babel/babel-core` 和`@babel/preset-env` 与 `babel-core`和
`babel-preset-env` 不一样

```javascript
// webpack.config.js
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: '/node_modules',
      include: 'src',
      use: {
    	loader: 'babel-loader',
    	options: {
    	    // 配置预设
    		presets: [
    			'@babel/preset-env'
    		]
    	}
      }
    }
  ]
}
```

或者：

```
// .babelrc
{
  "presets": ["@babel/preset-env"]
}
```

### 处理高级版本js

> babel-runtime 是供编译模块复用工具函数,是锦上添花。
babel-polyfil是雪中送炭，是转译没有的api。

[详细讲解](https://segmentfault.com/q/1010000005596587?from=singlemessage&isappinstalled=1)

```javascript
// 示例
class Person{
	constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

let person = new Person('FinGet',24);
console.log(person.name);

// 高级api
console.log('FinGet'.includes('Get'));
```


```
yarn add @babel/plugin-transform-runtime -D
// @babel/runtime as a production dependency (since it's for the "runtime").
yarn add @babel/runtime
```

使用：
```
// .babelrc
"plugins": ["@babel/plugin-transform-runtime"]
```

> `@babel/runtime` 会在打包的js中，注入一些脚本，所以要安装production依赖

```
yarn add @babel/polyfill
```

使用：

```javascript
require("@babel/polyfill");
// or 
import "@babel/polyfill";
// or
// webpack.config.js
module.exports = {
  entry: ["@babel/polyfill", "./app/js"],
};
```

> 这样引入会导致打包出来的js很大

![](http://ww1.sinaimg.cn/large/006tNc79gy1g58e7szargj30us04awfi.jpg)


按需引入：

```javascript
// .babelrd
{
  "presets": [["@babel/preset-env", {
    "useBuiltIns": "usage" 
  }]],
}
```

关键点是`useBuiltIns`这一配置项，它的值有三种：

- `false`: 不对`polyfills`做任何操作
- `entry`: 根据`target`中浏览器版本的支持，将`polyfills`拆分引入，仅引入有浏览器不支持的`polyfill`
- `usage`(新)：检测代码中ES6/7/8等的使用情况，仅仅加载代码中用到的`polyfills`

![](http://ww1.sinaimg.cn/large/006tNc79gy1g58e706o6zj30v204ct9n.jpg)

### ESlint 检测语法

```
yarn add eslint eslint-loader -D
```

[https://cn.eslint.org/demo/](https://cn.eslint.org/demo/)

在根目录下生成一个`.eslint.json`来配置规则。

```javascript
{
    "parserOptions": {
        "ecmaVersion": 5,
        "sourceType": "script",
        "ecmaFeatures": {}
    },
    "rules": {
        // 允许console
        "no-console": "off",
        // 允许空语句块
        "no-empty": ["error", { "allowEmptyCatch": true }],
        // 强制关键字周围空格的一致性 (keyword-spacing)
        "keyword-spacing": "error",
        // 把 var 语句看作是在块级作用域范围之内
        "block-scoped-var": "error",
        // 要求遵循大括号约定
        "curly": "error",
        // switch 要有default分支
        "default-case": "error",
        // no-eq-null 禁止与null进行比较
        "no-eq-null": "error",
        // 禁止使用多个空格
        "no-multi-spaces": ["error", {"exceptions": { "Property": true }}],
        // 禁止多行字符串
        "no-multi-str": "error",
        // 禁止使用 new 以避免产生副作用
        "no-new": "error",
        // 数组中的空格
        "array-bracket-spacing": ["error", "never"],
        // 禁止或强制在代码块中开括号前和闭括号后有空格
        "block-spacing": "error",
        // 大括号风格要求
        "brace-style": ["error",  "1tbs", { "allowSingleLine": true }],
        // 逗号前后使用一致的空格
        "comma-spacing": ["error", { "before": false, "after": true }],
        // 逗号风格
        "comma-style": ["error", "last"],
        // 计算属性不使用空格
        "computed-property-spacing": ["error", "never"],
        // 函数标识符和其调用之间禁止空格
        "func-call-spacing": ["error", "never"],
        // 箭头函数函数体的位置
        "implicit-arrow-linebreak": ["error", "beside"],
        // tab缩进
        "indent": ["error", "tab", { "SwitchCase": 1 }],
        // 对象key-value空格
        "key-spacing": ["error", { "beforeColon": false }],
        // 行注释位置
        "line-comment-position": ["error", { "position": "above" }],
        // 类成员之间需要空行
        "lines-between-class-members": ["error", "always"],
        // 要求构造函数首字母大写
        "new-cap": "error",
        // 调用无参构造函数时带括号
        "new-parens": "error",
        // 禁止使用 Array 构造函数
        "no-array-constructor": "error",
        // 禁止使用内联注释
        "no-inline-comments": "error",
        // 禁止连续赋值
        "no-multi-assign": "error",
        // 不允许多个空行
        "no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1 }],
        // 禁止使用 Object 构造函数
        "no-new-object": "error",
        // 禁用行尾空白
        "no-trailing-spaces": "error",
        // 禁止属性前有空白
        "no-whitespace-before-property": "error",
        // 强制在花括号内使用一致的换行符
        "object-curly-newline": ["error", { "ImportDeclaration": "always", "ExportDeclaration": "always" }],
        // 花括号中使用一致的空格
        "object-curly-spacing": ["error", "never"],
        // 要求在变量声明周围换行
        "one-var-declaration-per-line": ["error", "always"],
        // 禁止块内填充
        "padded-blocks": ["error", "never"],
        // 语句间填充空行
        "padding-line-between-statements": [
            "error",
            { "blankLine": "always", "prev": ["const", "let", "var"], "next": "*"},
            { "blankLine": "any", "prev": ["const", "let", "var"], "next": ["const", "let", "var"]},
            { "blankLine": "always", "prev": "directive", "next": "*" },
            { "blankLine": "any", "prev": "directive", "next": "directive" }
        ],
        // 强制使用一致的反勾号、双引号或单引号
        "quotes": ["error", "single", { "allowTemplateLiterals": true }],
        // 对象字面量属性名称使用引号
        "quote-props": ["error", "as-needed"],
        // 行尾分号
        "semi": ["error", "always"],
        // 分号前后空格
        "semi-spacing": ["error", {"before": false, "after": true}],
        // 分号位置
        "semi-style": ["error", "last"],
        // 语句块之前的空格
        "space-before-blocks": "error",
        // function空格
        "space-before-function-paren": ["error", {
            "anonymous": "always",
            "named": "never",
            "asyncArrow": "always"
        }],
        // 禁止圆括号内的空格
        "space-in-parens": "error",
        // 要求中缀操作符周围有空格
        "space-infix-ops": "error",
        // 要求或禁止在一元操作符之前或之后存在空格
        "space-unary-ops": ["error", {"words": true, "nonwords": false}],
        // 要求或禁止在注释前有空白
        "spaced-comment": ["error", "always"],
        // 强制在 switch 的冒号左右有空格
        "switch-colon-spacing": "error",
        // 要求正则表达式被包裹起来
        "wrap-regex": "error",

        // ES6
        // 要求箭头函数体使用大括号
        "arrow-body-style": "error",
        // 要求箭头函数的箭头之前或之后有空格
        "arrow-spacing": "error",
        // 禁止重复导入
    },
    "env": {}
}
```

```javascript
{
  test: /\.js$/,
  loader: ['babel-loader', 'eslint-loader'],
}
// or 
{
  test: /\.js$/,
  use: {
    loader: 'eslint-loader',
    options: {
      enforce: 'pre' // 先执行
    }
  }
}
```

### 打包图片

- js中创建图片引入

```javascript
import jpg from './assets/snail.jpg'
let img = new Image();
img.src = jpg 

document.body.appendChild(img);
```
- css背景图引入

```css
body{
	background-image: url(../logo.svg);
}
```

- html img标签引入

```html
<img src="../src/assets/snail.jpg" alt="">
```

#### file-loader
```
yarn add file-loader -D
```

`file-loader` 会默认在内部生成生成一张图片，到dist目录下,把生成图片的名字返回回来

```javascript
{
  test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
  use: 'file-loader' 
}
```

#### html-withimg-loader

> html中直接使用img标签src加载图片的话，因为没有被依赖，图片将不会被打包。

```
yarn add html-withimg-loader
```

使用：
```javascript
{
  test: /\.(htm|html)$/i,
  loader: 'html-withimg-loader'
}
```

#### url-loader

> 如果图片较多，会发很多http请求，会降低页面性能。这个问题可以通过url-loader解决。url-loader会将引入的图片编码，生成dataURl。相当于把图片数据翻译成一串字符。再把这串字符打包到文件中，最终只需要引入这个文件就能访问图片了。当然，如果图片较大，编码会消耗性能。因此url-loader提供了一个limit参数，小于limit字节的文件会被转为DataURl，大于limit的还会使用file-loader进行copy。

---

>  url-loader和file-loader是什么关系呢？简答地说，url-loader封装了file-loader。url-loader不依赖于file-loader，即使用url-loader时，只需要安装url-loader即可，不需要安装file-loader，因为url-loader内置了file-loader。

```
yarn add url-loader -D
```

```javascript
{
  test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
  use: {
  	loader: 'url-loader',
  	options: {
  	    name: '[name].[ext]', // 保持名称不变
  		limit: 20*1024, // 小于20k的图片 打包成base64
  		outputPath: 'assets/' // 打包后的存放路径 dist/assets
  	} 
  }
},
```

### output.publicPath

> 此选项指定在浏览器中所引用的「此输出目录对应的公开 URL」。相对 URL(relative URL) 会被相对于 HTML 页面（或 <base> 标签）解析。相对于服务的 URL(Server-relative URL)，相对于协议的 URL(protocol-relative URL) 或绝对 URL(absolute URL) 也可是可能用到的，或者有时必须用到，例如：当将资源托管到 CDN 时。

```javascript
module.exports = {
  //...
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'https://cdn.example.com/assets/'
  }
};
```

⚠️也可以单独给图片的options下配一个publicPath

### source-map

生产模式会压缩代码成一行，就没法调试了。

```
...
️mode:'developmen', //production 不会生成map文件
entry: './src/index.js',
devtool: "source-map", // 增加映射文件
...
```

![](https://upload-images.jianshu.io/upload_images/5307186-ad7857316478cd69.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/805/format/webp)

## webpack 高级配置

### watch
```
...
entry: entry: './src/index.js',
// build 监控，变化自动打包
watch: true,
watchOptions: { // 监控选项
  poll: 1000, // 每秒 watch 1000次
  aggregateTimeout: 500, // 防抖
  ignored: '/node_modules/' //不需要监控的文件
},
...
```

### clean-webpack-plugin

每次打包之前，都删除dist目录下的文件。

```
yarn add clean-webpack-plugin -D
```

`clean-webpack-plugin: ^3.00`
```
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

plugins: [    
    new CleanWebpackPlugin()  
]
```

```javascript
export { CleanWebpackPlugin };//3.0.0导出方式

export default CleanWebpackPlugin;//2.0.2导出方式
所以在2.0.2版本我们可以直接require拿到CleanWebpackPlugin 
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = CleanWebpackPlugin;//1.0.1导出方式
```

> 他会默认清空我们output里面设置的所有文件夹

```
https://github.com/johnagan/clean-webpack-plugin#options-and-defaults-optional

By default, this plugin will remove all files inside webpack's output.path directory, as well as all unused webpack assets after every successful rebuild.
```

### copy-webpack-plugin
拷贝文件
```
yarn add copy-webpack-plugin -D
```

```javascript
const CopyPlugin = require('copy-webpack-plugin');

plugins: [
  new CopyPlugin([
    { from: 'src/assets', to: 'assets' }
  ]),
]
```

### BannerPlugin
版权声明
```
plugins:[
  new webpack.BannerPlugin('CopyRight by FinGet!')
]
// 会在打包文件头部加上 /*! CopyRight by FinGet! */
```

```javascript
// 配置选项
{
  banner: string | function, // 其值为字符串或函数，将作为注释存在
  raw: boolean, // 如果值为 true，将直出，不会被作为注释
  entryOnly: boolean, // 如果值为 true，将只在入口 chunks 文件中添加
  test: string | RegExp | Array,
  include: string | RegExp | Array,
  exclude: string | RegExp | Array,
}
```

### resolve

```javascript
module.exports = {
  resolve: { // 解析第三方包
    alias: { // 创建 import 或 require 的别名，来确保模块引入变得更简单。
      '@': path.resolve(__dirname, 'src')
    },
    extensions: ['.js','.css','.json'], // 自动解析确定的扩展 就是没有后缀名时，按这个顺序匹配
    modules: [path.resolve('node_modules')] //告诉 webpack 解析模块时应该搜索的目录
  },
}
```

点这里查看[更多配置项。](https://webpack.docschina.org/configuration/resolve/)

### DefinePlugin

定义一些全局变量。
```javascript
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      VERSION: JSON.stringify('5fa3b9'),
      BROWSER_SUPPORTS_HTML5: true,
      TWO: '1+1',
      'typeof window': JSON.stringify('object'),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    });
  ]
}
```

> 注意，因为这个插件直接执行文本替换，给定的值必须包含字符串本身内的实际引号。通常，有两种方式来达到这个效果，使用 '"production"', 或者使用 JSON.stringify('production')。

### webpack-merge

分别配置不同的环境打包文件。

```
yarn add webpack-merge -D
```

```javascript
// build/webpack.base.conf.js
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname,'../src/index.js'), // 打包入口文件
  output: {
    filename: 'bundle.[hash:8].js', // 打包后的文件名
    path: path.resolve(__dirname, '../dist') // 这个路径必须是一个绝对路径，所以需要用path来解析一下
  },
  module: { // 模块
    rules: [
      {
        test: /\.(css|less)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1,
            outputPath: 'assets/images' // 打包后的存放路径
          }
        }
      },
      {
        test: /\.(htm|html)$/i,
        loader: 'html-withimg-loader'
      }
    ]
  },

  // 配置插件

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'), // 模版路径
      filename: 'index.html', // 打包后的文件名
      title: 'webpack4.0', // 顾名思义，设置生成的 html 文件的标题
      inject: true,
      hash: true, // hash选项的作用是 给生成的 js 文件一个独特的 hash 值，该 hash 值是该次 webpack 编译的 hash 值
      cahe: true, // 默认值是 true。表示只有在内容变化时才生成一个新的文件
      showErrors: true, // 如果 webpack 编译出现错误，webpack会将错误信息包裹在一个 pre 标签内，属性的默认值为 true 
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/css/index.css'
    })
  ]
}
```

```javascript
// build/webpack.pro.cong.js
const merge = require('webpack-merge');
const base = require('./webpack.base.conf');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

mmodule.exports = merge(base, {
	mode: 'production',
	optimization: {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    plugins: [
  	  // 文件头部注入
      new webpack.BannerPlugin('CopyRight by FinGet!')
    ]
})
```

```javascript
// build/webpack.dev.cong.js
const merge = require('webpack-merge');
const webpack = require('webpack');
const base = require('./webpack.base.conf');

mmodule.exports = merge(base, {
  mode: 'development',
  // 开发服务器的配置 官方文档： https://webpack.docschina.org/configuration/dev-server/
  devServer: {
    contentBase: path.resolve(__dirname, "../dist"), // 告诉服务器从哪个目录中提供内容。只有在你想要提供静态文件时才需要。
    // publicPath: './dist', // 将用于确定应该从哪里提供 bundle，并且此选项优先。 此路径下的打包文件可在浏览器中访问。
    port: 3000, // 端口
    progress: true, // 打包过程
    open: true, // 自动打开浏览器
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    })
  ],
})
```

```
yarn run dev -- --config build/webpack.dev.conf.js


yarn run build -- --config build/webpack.pro.conf.js
```

## webpack 优化

### noParse
防止 webpack 解析那些任何与给定正则表达式相匹配的文件。
```javascript
module.exports = {
  //...
  module: {
    noParse: /jquery|lodash/,
  }
};
```

### happyPack 多线程打包

js、css、img都可以多线程打包，提高打包速度。

```
yarn add happypack -D
```

```javascript
module.exports = {
 module:{
   {
     test: /\.js$/,
     use: 'Happypack/loader?id=js'
   }
 }
 plugins:[
   new Happypack({
     id: 'js', // id与上面对应
     use: [{
       loader: 'babel-loader',
       options: {
         presets:['@babel/preset-env']
       }
     }]
   })
 ]
}
```

### tree-shaking

（webpack 自带）把没用的代码删除掉。

> `import` 在生产环境下 会自动去掉没用的代码。es6 模块会把结果放到`default`上。

```javascript
// test.js
let sum = (a,b) => {
  return a+b;
}
let minus = (a,b) => {
  return a-b;
}
export default {sum,minus}
```

```javascript
import calc from './test.js';
console.log(calc.add(1,2));

let calc = require('./test');
console.log(calc.default.sum(1,2));
```

这里没用`minus`方法，在`import`方式打包中会`tree-shaking`,`require`则不会。

### scope hosting 

```javascript
let a = 1;
let b = 2;
let c = 3;
let d = a + b + c;
console.log(d);
```

这个代码很啰嗦，在打包之后，webpack会自动分析，省略代码。

```javascript
// 打包后
console.log(6);
```

### 抽离公共代码

多入口项目，多个入口，引用同一个js/css，则可以抽离公共代码。
```javascript
module.exports = {
  optimization: {
    splitChunks: { // 分割代码块
      cacheGroups: { // 缓存组
        common: { // 公共模块
          chunks: 'initial',
          minSize: 0,
          minChunks: 2,
        }
      }
    }
  },
}
```

```javascript
// 把第三方模块单独打包 比如jquery、lodash
module.exports = {
  optimization: {
    splitChunks: { // 分割代码块
      cacheGroups: { // 缓存组
        common: { // 公共模块
          chunks: 'initial',
          minSize: 0,
          minChunks: 2,
        },
        
        // 单独打包第三方模块
        vendor: {
          priority: 1, // 优先级别
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          name(module, chunks, cacheGroupKey) {
            const moduleFileName = module.identifier().split('/').reduceRight(item => item);
            return `${moduleFileName}`;
          },
          minSize: 0,
          minChunks: 2
        }
      }
    }
  },
}
```

optimization参数介绍：

```javascript
optimization: {
    splitChunks: { 
      chunks: "initial",         // 代码块类型 必须三选一： "initial"（初始化） | "all"(默认就是all) | "async"（动态加载） 
      minSize: 0,                // 最小尺寸，默认0
      minChunks: 1,              // 最小 chunk ，默认1
      maxAsyncRequests: 1,       // 最大异步请求数， 默认1
      maxInitialRequests: 1,     // 最大初始化请求书，默认1
      name: () => {},            // 名称，此选项课接收 function
      cacheGroups: {                // 缓存组会继承splitChunks的配置，但是test、priorty和reuseExistingChunk只能用于配置缓存组。
        priority: "0",              // 缓存组优先级 false | object |
        vendor: {                   // key 为entry中定义的 入口名称
          chunks: "initial",        // 必须三选一： "initial"(初始化) | "all" | "async"(默认就是异步)
          test: /react|lodash/,     // 正则规则验证，如果符合就提取 chunk
          name: "vendor",           // 要缓存的 分隔出来的 chunk 名称
          minSize: 0,
          minChunks: 1,
          enforce: true,
          reuseExistingChunk: true   // 可设置是否重用已用chunk 不再创建新的chunk
        }
      }
    }
  }
```


点击这里[查看更多配置。](https://webpack.js.org/plugins/split-chunks-plugin/#root)


### 懒加载

在用户触发一个点击操作才加载需要的文件。
```javascript
// lazy.js
export default '懒加载';
```
```javascript
// test.js
function handleClick() {
  import('./lazy.js').then(module => {
    console.log(module.default);
  })
}
```
