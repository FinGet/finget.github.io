---
title: 我在实际项目开发中遇到的关于ElementUI各种表单验证
date: 2020-02-11 21:07:32
type: "tags"
tags:
	- elementUI
	- JS
categories: "elementUI"
description: "记录实际项目开发过程中，遇到的各种类型的表单验证情况"
---

## 第一种 最简单的必填字段

![](https://user-gold-cdn.xitu.io/2020/2/11/1703464a5f5055ac?w=738&h=220&f=jpeg&s=7105)
```javascript
<el-form-item
  label="委托方"
  prop="real_operator_id"
>
    <operators-select v-model="form.real_operator_id"></operators-select>
</el-form-item>
```
```javascript
rules: {
  real_operator_id: {required: true, message: '请选择委托方', trigger: 'change'}
}
```

## 第二种 正则验证字段

![](https://user-gold-cdn.xitu.io/2020/2/11/1703464a64874355?w=726&h=190&f=jpeg&s=8354)

```html
<el-form-item
  label="容纳人数"
  prop="capacity"
>
  <el-input
    v-model="form.capacity"
    placeholder="请输入容纳人数"
  ></el-input>
</el-form-item>
```
```javascript
rules:{
  capacity: [
    {required: true, message: '请输入容纳人数', trigger: 'change'},
    {pattern: /^[1-9][0-9]{0,3}$/, message: '只能输入正整数，且不超过4位数', trigger: 'change'}],
}
```

> ⚠️什么电话、邮箱、数字、英文、汉字...等能用正则验证都可以用这个方式。

## 第三种 富文本必填验证
![](https://user-gold-cdn.xitu.io/2020/2/11/1703464a660c3371?w=1410&h=1020&f=jpeg&s=45773)
```html
<el-form-item
  label="政策内容"
  prop="content"
>
  <Tinymce
    ref="editor"
    v-model="form.content"
    :height="300"
  />
  <el-input
    v-model="form.content"
    style="display:none;"
  ></el-input>
</el-form-item>
```
```javascript
rules: {
  content: [
    {required: true, message: '请填写政策内容', trigger: 'change'}
  ],
}
```

> 这里采用一个骚操作，原本输入框的验证都是监听的输入框的各种事件（change,blur）,然而富文本都是第三方插件，无法监听到，所以就利用了vue的双向绑定原理，写一个隐藏的输入框，搞定。

## 第四种 多个输入框

![](https://user-gold-cdn.xitu.io/2020/2/11/1703464a668ae808?w=1728&h=206&f=jpeg&s=14563)
```html
<el-form-item
  label="关联写字楼"
  prop="building_id"
>
  <div class="display-flex align-items-center">
    <el-select
      v-model="form.building_id"
      filterable
      remote
      placeholder="请输入写字楼名称"
      :remote-method="getProjectLists"
      :loading="loading"
      @change="getBuilding">
        <el-option
          v-for="item in projectOptions"
          :key="item.id"
          :label="item.project_name"
          :value="item.id">
        </el-option>
    </el-select>
    <el-select
      class="marginL10"
      v-if="form.building_id"
      v-model="form.building_detail.id"
      placeholder="请选择楼栋"
      @change="getUnit">
        <el-option
          v-for="item in buildingList"
          :key="item.id"
          :label="item.building_name"
          :value="item.id">
        </el-option>
    </el-select>
    <el-select
      class="marginL10"
      v-if="unitList.length && form.building_detail.id"
      v-model="form.building_detail.unit_id"
      placeholder="请选择单元"
      @change="changeUnit">
        <el-option
          v-for="item in unitList"
          :key="item.id"
          :label="item.unit"
          :value="item.id">
        </el-option>
    </el-select>
    <numberInput
      :append="'层'"
      :isDecimal="false"
      :intlength="4"
      :placeholder="'请输入楼层'"
      v-model="form.building_detail.floor"></numberInput>
  </div>
</el-form-item>
```

```javascript
data() {
  let checkBuilding = (rule, value, callback) => {
	if (!this.form.building_id) {
		callback(new Error('请选择写字楼'));
	} else if (!this.form.building_detail.id) {
		callback(new Error('请选择楼栋'));
	} else if (this.unitList.length && !this.form.building_detail.unit_id) {
		callback(new Error('请选择单元'));
	} else if (!this.form.building_detail.floor) {
		callback(new Error('请填写楼层'));
	} else {
		callback();
	}
  };
  return {
    rules: {
      building_id: {required: true, validator: checkBuilding, trigger: 'change'},
    }
  }
}
```



## 第五种 动态验证-普通的动态验证
![](https://user-gold-cdn.xitu.io/2020/2/11/1703464a6859d452?w=884&h=262&f=jpeg&s=12208)
> 官网拷贝的代码，占个位置。

```html
<el-form-item
    v-for="(domain, index) in dynamicValidateForm.domains"
    :label="'域名' + index"
    :key="domain.key"
    :prop="'domains.' + index + '.value'"
    :rules="{
      required: true, message: '域名不能为空', trigger: 'blur'
    }"
  >
    <el-input v-model="domain.value"></el-input>
    <el-button @click.prevent="removeDomain(domain)">删除</el-button>
</el-form-item>
```

## 第六种 动态验证-多个输入框验证
![](https://user-gold-cdn.xitu.io/2020/2/11/1703464a68c83834?w=1818&h=128&f=jpeg&s=17684)

### 第一种情况 每个输入框单独验证

> 在样式很好控制的情况下,循环生成多个`<el-form-item>`,单独验证

```html
<div
  v-for="(item,index) in form.project"
  :key="index"
>
<div class="display-flex">
  <el-form-item
    :label="index==0?'关联写字楼':''"
    :prop="'project.' + index + '.project_id'"
    :rules="{required: true, message: '请选择关联写字楼', trigger: 'blur'}">
      <el-select
        v-model="item.project_id"
        filterable
        clearable
        remote
        reserve-keyword
        placeholder="请输入关键词"
        :remote-method="getProjectLists"
        :loading="loading"
        @change="projectChange($event,index)">
          <el-option
            v-for="item in projectOptions"
            :key="item.id"
            :label="item.project_name"
            :value="item.id">
          </el-option>
      </el-select>
  </el-form-item>
  <el-form-item
    label-width="20px"
    :prop="'project.' + index + '.building_id'"
    :rules="{required: true, message: '请选择关联写字楼楼栋', trigger: 'blur'}">
      <el-select
        v-model="item.building_id"
        placeholder="请选择楼栋"
        @change="buildChange($event,index)">
          <el-option
            v-for="item in item.buildOptions"
            :key="item.id"
            :label="item.building_name"
            :value="item.id">
          </el-option>
      </el-select>
  </el-form-item>
  <el-form-item
    v-if="item.unitOptions && item.unitOptions.length"
    label-width="20px"
    :prop="'project.' + index + '.unit_id'"
    :rules="{required: true, message: '请选择关联写字楼单元', trigger: 'blur'}">
      <el-select
        v-model="item.unit_id"
        placeholder="请选择单元">
        <el-option
          v-for="item1 in item.unitOptions"
          :key="item1.id"
          :label="item1.unit"
          :value="item1.id">
        </el-option>
      </el-select>
  </el-form-item>
  <el-form-item
    label="所在楼层"
    :prop="'project.' + index + '.floor'"
    :rules="[{required: true, message: '请填写所在楼层', trigger: 'blur'},
      {pattern: /^([1-9][0-9]{0,2})$/,message:'只能输入正整数，且不超过三位数',trigger:'change'}]">
      <div class="display-flex">
        <el-input
          v-model.number="item.floor"
          placeholder="请填写楼层，3位数以内"
          autocomplete="off">
            <el-button  slot="append">层</el-button>
        </el-input>
      </div>
  </el-form-item>
</div>
</div>
```

### 第二种情况 统一验证

![](https://user-gold-cdn.xitu.io/2020/2/11/1703464a87395e61?w=1402&h=434&f=jpeg&s=42783)

> 有的时候，迫于样式的困扰，我们只能写多个输入框，而不能生成多个`<el-form-item>`,在同一个`<el-form-item>`下统一验证

```html
<div style="list-style:none;"
  v-for="(item, index) in form.rules"
  :key="index">
  <el-form-item
    :label="index == 0?'添加规则(未到使用时间)':''"
    :prop="'rules.'+index+'.hours'"
    :rules ="{required:true, validator:checkRules , trigger: 'change'}">
    <div class="display-flex li-box">
      <div> 
          <span>使用前 </span>
          <numberInput
            class="small-input"
            size="small"
            v-model="item.hours"
            :isDecimal="false"
            :intlength="4"
            :clearable="false"
            placeholder=""/>
          <span> 小时取消，扣除订单总额 </span>
          <numberInput
            class="small-input"
            size="small"
            v-model="item.percent"
            :isDecimal="false"
            :clearable="false"
            :intlength="3"
            placeholder=""/>
          <span> %费用(不含保证金)</span>
        </div>
    </div>
  </el-form-item>
</div>
```
rule长这样:
![](https://user-gold-cdn.xitu.io/2020/2/11/1703464a8130eec3?w=1622&h=236&f=jpeg&s=31519)

```javascript
methods: {
  // 验证rule
  checkRules(rule, value, callback) {
    // 通过rule.field 拿到index ，剩下的都常规操作了 
    let index = rule.field.split('.')[1] - 0;
    if (!this.form.rules[index].hours || !this.form.rules[index].percent) {
      callback(new Error('请填写规则'));
    } else if (Number(this.form.rules[index].percent) > 100) {
      callback(new Error('百分比不能超过100%'));
    } else {
      callback();
    }
  },
}
```



## 第七种 动态验证-关联验证
![](https://user-gold-cdn.xitu.io/2020/2/11/1703464a8ab7346f?w=2116&h=256&f=jpeg&s=33166)

> 填了租金才会触发对应的租金时间段验证

```html
<div
v-for="(item, index) in form.payment.rent_period"
:key="'rent' + index"
>
  <el-form-item
    :label="'租金'+(index+1)"
    class="flex-1"
    :prop="'payment.rent_period.'+index+'.rent_fee'"
    :rules ="{validator:moneyValidator, trigger:'change'}"
>
  </el-form-item>
  <el-form-item
    class="flex-1"
    label="租金时间段"
    :prop="'payment.rent_period.'+index+'.start_time'"
    // 就是这里判断一下item.rent_fee是否存在
    :rules="item.rent_fee?{required: true, message:'请填写租金时间段', trigger: 'change'}:{}">
  </el-form-item>
</div>
```

## 第八种 动态验证-判重

![](https://user-gold-cdn.xitu.io/2020/2/11/1703464a8b194a8b?w=1340&h=268&f=jpeg&s=39420)

```html
<el-form-item
    v-for="(item,index) in industryForm.follow"
    :key="item.id"
    :label="'关注行业'+(index+1)"
    :prop="'follow.'+index+'.industry'"
    :rules="{validator: attentionIndustryValidator, trigger:'change'}"
    >
    ....
</el-form-item>
```
```javascript
attentionIndustryValidator(rule, val, callback) {
  let num = 0;
  this.industryForm.follow.forEach(item => {
  // 这里做一次数组判重
    if (this.equals(val, item.industry)) {
      num++;
    }
  });
  if (num >= 2) {
    callback(new Error('请勿重复选择相同的行业!'));
  } else {
    callback();
  }
},
```

## 第九种 清除某一个输入项验证

![](https://user-gold-cdn.xitu.io/2020/2/11/1703464a9686d81a?w=1392&h=244&f=jpeg&s=19339)

> 如图开始选择了意向类型为**按面积**，此时已经验证了意向面积的值，并提示错误信息，然后切换为**按工位**,如果不清除意向面积的验证，则**错误信息会一直存在**。

```html
<el-form-item
  ref="areaForm"
  prop="intention_area"
  :label="form.intention_type==1?'意向面积':'意向工位'"
  :label-width="formLabelWidth"
  :rules="[{required:true, validator: areaValidator, trigger:'blur'}]">
...
</el-form-item>
```
```javascript
watch: {
  'form.intention_type': {
    handler() {
      this.$refs['areaForm'].clearValidate();
    }
  }
},
```

## 最后

我们自定义验证（validator），有两种方式。

- 第一种 定义在data中

```javascript
data() {
  let testrule1 = (rule,val,callback) => {};
  return {}
}
```

使用方式是在`data`中的`rule`里引入：

```javascript
data(){
  let testRule1 = (rule,val,callback) => {};
  return {
    rules: {
      name:{required: true, validator:testRule1, trigger:'blur'}
    }
  }
}
```

- 第二种 定义在methods中

```javascript
methods: {
  testRule2(rule, val, callback) {}
}
```

使用方式是在`<el-form-item>`中引入:

```html
<el-form-item
  prop="name"
  :rules="{required:true, validator: testRule2, trigger:'blur'}">
    ...
</el-form-item>
```


