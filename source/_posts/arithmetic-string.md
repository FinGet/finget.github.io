---
title: JavaScript数据结构与算法-String
date: 2019-05-14 16:15:44
type: "tags"
tags: 
	- JS
	- 算法
categories: "JS"
description: "以leetcode原题学习数据结构和算法"
---

## 反转整数

```
给出一个 32 位的有符号整数，你需要将这个整数中每位上的数字进行反转。

示例 1:

输入: 123
输出: 321
 示例 2:

输入: -123
输出: -321
示例 3:

输入: 120
输出: 21
注意:

假设我们的环境只能存储得下 32 位的有符号整数，则其数值范围为 [−231,  231 − 1]。请根据这个假设，如果反转后整数溢出那么就返回 0。
```

思路：数字变字符串再变数组，这个主要就是运用的数组的常用api了，`pop`、`shift`、 `unshift`、`join`。

```javascript
/**
 * @param {number} x
 * @return {number}
 */
var reverse = function(x) {
    let arr = (x + '').split('').reverse()
        let len = arr.length
        // 最大最小边界
        let min = -(2**31)
        let max = (2**31) - 1
        if (arr[len - 1] == '-') {
            arr.pop()
            if (arr[0] == 0) {   
                arr.shift()
                arr.unshift('-')
                let res = Number(arr.join(''))
                return res>=min&&res<=max?res:0
            } else {
                arr.unshift('-')
                let res = Number(arr.join(''))
                return res>=min&&res<=max?res:0
            }

        } else if (arr[0] == '0' && arr[len - 1] != '-') {
            arr.shift()
            let res = Number(arr.join(''))
            return res>min&&res<max?res:0
        } else {
            return Number(arr.join(''))>min&&Number(arr.join(''))<max?Number(arr.join('')):0
        }
};
```



## 字符串中的第一个唯一字符

```
给定一个字符串，找到它的第一个不重复的字符，并返回它的索引。如果不存在，则返回 -1。

案例:

s = "leetcode"
返回 0.

s = "loveleetcode",
返回 2.
 

注意事项：您可以假定该字符串只包含小写字母。
```

思路：`for of`循环，找出字符出现的第一个位置和最后一个位置，如果两个值相等，则返回

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var firstUniqChar = function(s) {
    for (let v of s) {
        if (s.indexOf(v) === s.lastIndexOf(v)) return s.indexOf(v)
    }
    return -1
};
```


## 反转字符串中的单词

```
给定一个字符串，你需要反转字符串中每个单词的字符顺序，同时仍保留空格和单词的初始顺序。
示例 1:
输入: "Let's take LeetCode contest"
输出: "s'teL ekat edoCteeL tsetnoc" 
注意：在字符串中，每个单词由单个空格分隔，并且字符串中不会有任何额外的空格。
```

主要就是用到了数组的`split`、`reverse` 、`join`、`map`方法，原理：就是把字符串变成数组，再利用数组自带的反转方法，最后再变成字符串返回。

```javascript
export default (str) => {
  // 1.先将字符串转为数组
  let arr = str.split(' ')
  // 2.遍历数组，反转数组中的每一项
  let result = arr.map(item => {
    return item.split('').reverse().join('')
  })
  // 3.把新生成的数组转成字符串，用空格分开，返回结果
  return result.join(' ')
}

// 合并写法
export default (str) => {
    return s.split(/\s/g).map(item => {
        return item.split('').reverse().join('')
    }).join(' ')
}
```

## 计数二进制子串

```
给定一个字符串 s，计算具有相同数量0和1的非空(连续)子字符串的数量，并且这些子字符串中的所有0和所有1都是组合在一起的。
重复出现的子串要计算它们出现的次数。

示例 1 :
输入: "00110011"
输出: 6
解释: 有6个子串具有相同数量的连续1和0：“0011”，“01”，“1100”，“10”，“0011” 和 “01”。
请注意，一些重复出现的子串要计算它们出现的次数。
另外，“00110011”不是有效的子串，因为所有的0（和1）没有组合在一起。

示例 2 :
输入: "10101"
输出: 4
解释: 有4个子串：“10”，“01”，“10”，“01”，它们具有相同数量的连续1和0。

注意：
- s.length 在1到50,000之间。
- s 只包含“0”或“1”字符。
```

思路：使用一个`for`循环，将字符串从第一个开始传入`match`函数中，在`match`函数中利用正则表达式获取到字符串开头的字符（或是多个0或是多个1），再使用`repeat`方法，将开头获取到的多个0或1利用异或运算反转重复相同次数（举个例子：获取到了`‘00’`，那么反转之后就是`‘11’`），然后再建立一个正则表达式，将获取到的字符和反转后的字符拼接，使用test方法与传入的字符串进行比对，返回第一个比对成功的字符串，保存到数组`r`中。以此类推，剃掉原字符串的第一个字符后再调用一次`match`方法，直到原字符串只剩下1个字符，返回数组`r`的长度，即为题解。

```javascript
export default (str) => {
  // 建立数据结构，堆栈，保存数据
  let r = []
  // 给定任意子输入都返回第一个符合条件的子串
  let match = (str) => {
    // 使用正则表达式获取字符串开头的字符
    let j = str.match(/^(0+|1+)/)[0]
    // 利用“异或”运算将字符反转并复制相同个数
    let o = (j[0] ^ 1).toString().repeat(j.length)
    // 合并上面两个字符串，创建正则表达式
    let reg = new RegExp(`^(${j}${o})`)
    // 与传入的字符串进行比对，返回第一个比对成功的子串
    if (reg.test(str)) {
      return RegExp.$1
    } else {
      return ''
    }
  }
  // 通过for循环控制程序运行的流程
  for (let i = 0, len = str.length - 1; i < len; i++) {
    let sub = match(str.slice(i))
    if (sub) {
      r.push(sub)
    }
  }
  return r.length
}
```

## 最后

创建了一个前端学习交流群，感兴趣的朋友，一起来嗨呀！
![](<https://image-static.segmentfault.com/207/665/2076650181-5bfe3d1a48e89_articlex>)