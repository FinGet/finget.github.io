---
title: Vue + Element + vue-quill-editor 实现源码编辑、自定义图片上传和汉化
---

> 集百家之长，看了很多博客再结合自身情况，写了这个小组件功能，仅供参考。


## 实现源码编辑

vue-quill-editor的配置文件：
```javascript
// toolbar工具栏的工具选项（默认展示全部）
const toolOptions = [
	// 加粗 斜体 下划线 删除线
	['bold', 'italic', 'underline', 'strike'],
	// 加粗 斜体 下划线 删除线
	['blockquote', 'code-block'],
	// 1、2 级标题
	[{header: 1}, {header: 2}],
	// 有序、无序列表
	[{list: 'ordered'}, {list: 'bullet'}],
	// 上标/下标
	[{script: 'sub'}, {script: 'super'}],
	// 缩进
	[{indent: '-1'}, {indent: '+1'}],
	// 文本方向
	[{direction: 'rtl'}],
	// 字体大小
	[{size: ['small', false, 'large', 'huge']}],
	// 标题
	[{header: [1, 2, 3, 4, 5, 6, false]}],
	// 字体颜色、字体背景颜色
	[{color: []}, {background: []}],
	// 字体种类
	[{font: []}],
	// 对齐方式
	[{align: []}],
	[{clean: '源码编辑'}], // 这是自己加的
	// 链接、图片、视频
	['link', 'image'],
	// 新添加的工具
	['sourceEditor']
];
const handlers = {
	shadeBox: null,
	// 添加工具方法
	sourceEditor: function () {
		// alert('我新添加的工具方法');
		const container = this.container;
		const firstChild = container.nextElementSibling.firstChild;

// 在第一次点击源码编辑的时候，会在整个工具条上加一个div，层级比工具条高，再次点击工具条任意位置，就会退出源码编辑。可以在下面cssText里面加个背景颜色看看效果。

		if (!this.shadeBox) {
			let shadeBox = this.shadeBox = document.createElement('div');
            
			shadeBox.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; cursor:pointer';
			container.style.position = 'relative';
			container.appendChild(shadeBox);
			firstChild.innerText = firstChild.innerHTML;

			shadeBox.addEventListener('click', function () {
				this.style.display = 'none';
				firstChild.innerHTML = firstChild.innerText.trim();
			}, false);
		} else {
			this.shadeBox.style.display = 'block';
			firstChild.innerText = firstChild.innerHTML;
		}
	}
};

export default {
	placeholder: '',
	// 主题
	theme: 'snow',
	modules: {
		toolbar: {
			// 工具栏选项
			container: toolOptions,
			// 事件重写
			handlers: handlers
		}
	},
	// 在使用的页面中初始化按钮样式
	initButton: function () {
	    // 样式随便改
		const sourceEditorButton = document.querySelector('.ql-sourceEditor');
		sourceEditorButton.style.cssText = 'font-size:18px';
        
        // 加了elementui的icon
		sourceEditorButton.classList.add('el-icon-edit-outline');          
		// 鼠标放上去显示的提示文字
		sourceEditorButton.title = '源码编辑';
	}
};
```

> 工具名，工具方法名，类名:
这里要注意的是：工具名和工具方法名是一样的，并且生成的`button`工具拥有`ql-`工具名的类名。
例如上面代码中，我的工具名是`sourceEditor`，我的方法名也是`sourceEditor`，而生成的`button`工具的类名就是`ql-sourceEditor`了。

![](http://ww1.sinaimg.cn/large/006tNc79gy1g4c1dpsjibj31hm088wfe.jpg)

## 自定义上传图片

`vue-quill-editor`自带的上传，是把图片变成了base64的格式，不符合一般的项目需求。我猜它是用的`FileReader`的API。

有兴趣的可以试试这个，拖拽图片转base64预览：
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
    <style media="screen">
    #div1 {width:400px; height:300px; background:#CCC; border:1px solid black; text-align:center; line-height:300px;}
    </style>
    <script>
    window.onload=function (){
      let oDiv=document.getElementById('div1');
      let oImg=document.getElementById('img1');

      oDiv.addEventListener('dragenter', function (){
        oDiv.innerHTML='请松手';
      }, false);
      oDiv.addEventListener('dragleave', function (){
        oDiv.innerHTML='拖到这里上传';
      }, false);

      oDiv.addEventListener('dragover', function (ev){
        ev.preventDefault();
      }, false);
      oDiv.addEventListener('drop', function (ev){
        ev.preventDefault();
        //
        let oFile=ev.dataTransfer.files[0];
        //读取
        let reader=new FileReader();
        reader.readAsDataURL(oFile);
        reader.onload=function (){
          //alert('成功');
          oImg.src=this.result;
        };
        reader.onerror=function (){
          alert('读取失败了');
        };
        console.log(reader);
      }, false);
    }
    </script>
  </head>
  <body>
    <div id="div1">拖到这里上传</div>
    <img src="" id="img1">
  </body>
</html>
```

```javascript
// 自定义vue-quill-editor的主要文件
<template>
	<div
		v-loading="imageLoading"
		element-loading-text="请稍等，图片上传中"
	>
		<quill-editor
			ref="myTextEditor"
			v-model="content"
			:options="quillOption"
			@change="onEditorChange($event)"
			@focus="onEditorFocus($event)"
			@ready="onEditorReady($event)"
		>
		</quill-editor>
		// 这个是elementui的上传，把它display:none
		<el-upload
			style="display:none;"
			:class="name"
			:action="upload"
			:show-file-list="false"
			:on-success="handleAvatarSuccess"
			:before-upload="beforeAvatarUpload"
			:on-progress="onProgress"
		>
		</el-upload>
	</div>

</template>

<script>

import {
	quillEditor
} from 'vue-quill-editor';
import {
	upload
} from '@/api/upload_api.js';
import Quill from 'quill';

import quillConfig from './quill_config.js';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
export default {
	props: {
		// 富文本内容
		value: String,
		// 富文本的名字 同一个页面的多个富文本name不能重复的
		name: String,
		// 图片类型
		imgType: {
			type: Array,
			default: () => ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp']
		},
		// 图片限制大小 单位 M
		limitSize: {
			type: Number,
			default: 1
		}
	},
	components: {
		quillEditor
	},
	mounted() {
	    // 
		quillConfig.initButton();
		var vm = this;
		// 当点击图书上传是，触发elementui的upload点击
		var imgHandler = async function (image) {
			vm.addImgRange = vm.$refs.myTextEditor.quill.getSelection();
			if (image) {
				document.querySelector(`.${vm.name} input`).click();
			}
		};

		vm.$refs.myTextEditor.quill.getModule('toolbar').addHandler('image', imgHandler);
	},
	model: {
		props: 'content',
		// 必须的change事件不然是不会响应的
		event: 'change'
	},
	computed: {
		content: {
			get: function () {
				return this.value;
			},
			set: function () {}
		}
	},
	data() {
		return {
			// 配置文件
			quillOption: quillConfig,
			imageLoading: false,
			upload: upload(),
		};
	},
	methods: {
		onEditorChange(e) {
			this.$emit('change', e.html);
		},
		onEditorFocus(e) {
			this.$emit('focus', e);
		},
		onEditorReady(e) {
			this.$emit('ready', e);
		},
		// 图片上传成功
		handleAvatarSuccess(res) {
			// console.log(res, file);
			if (res.code == 200) {
				// this.form.custom_logo_url = res.data.url;
				let url = res.data.url,
					vm = this;

				if (url !== null && url.length > 0) {
					var value = url;

					// ***主要的东西就是这里：上传成功回显
					vm.addImgRange = vm.$refs.myTextEditor.quill.getSelection();
					value = value.indexOf('http') != -1 ? value : 'http:' + value;
					vm.$refs.myTextEditor.quill.insertEmbed(vm.addImgRange !== null ? vm.addImgRange.index : 0, 'image', value, Quill.sources.USER);
				} else {
					vm.$message.warning('图片增加失败');
				}
			} else {
				this.$message.error(res.message);
			}
			this.imageLoading = false;
		},
		// 图片上传前
		beforeAvatarUpload(file) {
			let date = new Date().getTime();
			let imgType = this.imgType;

			const fileType = file.type;
			const isLt1M = file.size / 1024 / 1024 < this.limitSize;

			const isAllowType = imgType.indexOf(fileType) != -1;
			// console.log(fileType);
			// const isPng = fileType == 'image/jpeg';

			if (!isAllowType) {
				this.$message.error('请上传符合文件格式的图片!');
				return false;
			}
			if (!isLt1M) {
				this.$message.error('上传logo图片大小不能超过 1MB!');
				return false;
			}
			return isAllowType && isLt1M;
		},
		onProgress() {
			this.imageLoading = true;
		}
	}
};
</script>
```

```javascript
// 使用方式
<quill-editor v-model="form.content" name="policy"/>
// 做了双向绑定的，也可以自己监听change事件
```

> ⚠️注意点：
1. name不能一样
2. 上传逻辑按自己的来，跟我应该不一样
3. 其实最重要的是回显到富文本中的那段代码，无论你怎么上传，甚至可以不用elementui的上传组件，最后拿到上传成功的url，再放进去就搞定了。

## 汉化

把这段代码放到你的页面中就行了。
```css
.ql-snow .ql-tooltip[data-mode=link]::before {
  content: "请输入链接地址:" !important;
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: '保存' !important;
    padding-right: 0px;
}
.ql-snow .ql-tooltip[data-mode=video]::before {
	content: "请输入视频地址:" !important;
}
.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
	content: '14px' !important;
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
	content: '10px' !important;
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
	content: '18px' !important;
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
	content: '32px' !important;
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
	content: '文本' !important;
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
	content: '标题1' !important;
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
	content: '标题2' !important;
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
	content: '标题3' !important;
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
	content: '标题4' !important;
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
	content: '标题5' !important;
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
	content: '标题6' !important;
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
	content: '标准字体' !important;
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
	content: '衬线字体' !important;
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
	content: '等宽字体' !important;
}
```

