module.exports = {
  title: 'FinGet的前端之路',
  description: '前端--我一直在路上',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],
  markdown: {
    lineNumbers: true // 代码块显示行号
  },
  themeConfig: {
    // sidebarDepth: 2, // e'b将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
    lastUpdated: 'Last Updated', // 文档更新时间：每个文件git最后提交的时间
    nav:[
      { text: '博客', link: '/blog/' }, // 内部链接 以docs为根目录
      { text: '设计模式和算法', link: '/arithmeticMode/' }, 
      { text: 'GitHub', link: 'https://github.com/finget'}// 外部链接
      // 下拉列表
      // {
      //   text: 'GitHub',
      //   items: [
      //     { text: 'GitHub地址', link: 'https://github.com/finget' },
      //     {
      //       text: '算法仓库',
      //       link: 'https://github.com/OBKoro1/Brush_algorithm'
      //     }
      //   ]
      // }        
    ],
    sidebar:{
      // docs文件夹下面的blog文件夹 文档中md文件 书写的位置(命名随意)
      '/blog/': [
        // '博客介绍', // blog文件夹的README.md 不是下拉框形式
        {
          title: 'HTML+CSS',
          children: [
            '/blog/css/box-model', // 以docs为根目录来查找文件 
            '/blog/css/border1px',
            '/blog/css/float',
            '/blog/css/vertical-center'
          ]
        },
        {
          title: 'JavaScript',
          children: [
            '/blog/js/ajax',
            '/blog/js/extend',
            '/blog/js/bind-apply-call',
            '/blog/js/throttle-debounce',
            '/blog/js/javascript-es6',
            '/blog/js/promise',
            '/blog/js/new',
            '/blog/js/this',
            '/blog/js/proto',
            '/blog/js/async',
            '/blog/js/curry',
            '/blog/js/javascriptPrecompile',
          ]
        },
        {
          title: '前端框架',
          children: [
            '/blog/frame/vue-family',
            '/blog/frame/element-form',
            '/blog/frame/mvvm-vue',
            '/blog/frame/virtualDom',
            '/blog/frame/vue-react-props',
            '/blog/frame/vue-quill-editor',
            '/blog/frame/react-render',
            '/blog/frame/react-native',
            '/blog/frame/mobx',
            '/blog/frame/nuxt-koa-mongodb',
            '/blog/frame/webpack',
            '/blog/frame/webpack4.0',
          ]
        },
        {
          title: 'HTTP',
          children: [
            '/blog/http/http', // 以docs为根目录来查找文件 
            '/blog/http/tcp-http',
          ]
        },
        {
          title: '其他',
          children: [
            '/blog/other/hexo-GitHub',
            '/blog/other/win-mongodb'
          ]
        }
      ],
      '/arithmeticMode/': [
        {
          title: '设计模式',
          children: [
            '/arithmeticMode/mode/factory',
            '/arithmeticMode/mode/single',
            '/arithmeticMode/mode/decorator',
            '/arithmeticMode/mode/proxy',
            '/arithmeticMode/mode/adapter',
          ]
        },
        {
          title: '算法',
          children: [
            '/arithmeticMode/arithmetic/arithmetic-array',
            '/arithmeticMode/arithmetic/arithmetic-string',
            '/arithmeticMode/arithmetic/arithmetic-sort',
            '/arithmeticMode/arithmetic/JavaScriptArithmetic'
          ]
        },
      ]
    }
  }
}