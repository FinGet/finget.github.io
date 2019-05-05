---
title: JavaScript常用排序算法
date: 2018-03-01 10:15:37
type: "tags"
tags:
	- JS
	- 算法
categories: "JS"
description: "JavaScript常用排序算法"
---

## 冒泡算法

>原理：从第一个元素开始，往后比较，遇到自己小的元素就交换位置

![此处输入图片的描述][1]
代码实现：
```JavaScript
// 冒泡算法
function bubbleSort(arr) {
  var len = arr.length;
  for (var i = 0; i < len; i++) {
	for (var j = 0; j < len-1-i; j++) {
	// 为什么要减一，数组从0开始，先取第一个与第二个比，再将较大值与第三个比，一直比到最后一个，再拿第二个值与第三个比……(外层循环一次，内层循环多次)
	  if (arr[j] > arr[j+1]) { // 比较相邻两个值的大小
		var temp = arr[j+1]; // 临时变量存储arr[j+1]的值
		arr[j+1] = arr[j]; // 将arr[j]的值赋值给arr[j+1]，即把较大值往后放
		arr[j] = temp; // 又将temp的值赋值给arr[j]，即将较小值往前放
	  }
	}
  }
  return arr;
}
var arr = [2, 3, 4, 5, 6, 1, 90, 16, 35, 7];
console.log(bubbleSort(arr)); // [1, 2, 3, 4, 5, 6, 7, 16, 35, 90]
```
## 插入排序
![此处输入图片的描述][2]
Gif图：
![此处输入图片的描述][3]


>特点：
>插入排序把要排序的数组分成两部分：
>第一部分包含了这个数组的所有元素，但将第一个元素除外（让数组多一个空间才有插入的位置）。
>第二部分就是包含了这一个元素（即待插入元素）。在第一部分排序完成后，再将这个最后元素插入到已排好序的第一部分
>比冒泡排序快一点

代码实现：
```JavaScript
// 插入排序
function insertSort(arr) {
  // 从第二个元素开始，因为要留一个坑
  for (var i = 1; i < arr.length; i++) {
    var x = arr[i]; // 现将arr[i]的值存下来
	for (var j = i-1; arr[j] > x; j--) {
	  arr[j+1] = arr[j]; // i=3时 [2, 3, 6, 6, ...]
	}
	if (arr[j+1] != x) {
	  arr[j+1] = x; // i=3时 j=2 [2, 3, 4, 6, ...]
	}
  }
  return arr;
}
var arr = [2, 3, 6, 4, 2, 1, 90, 100, 20, 5];
console.log(insertSort(arr)); //[1, 2, 2, 3, 4, 5, 6, 20, 90, 100]
```
## 希尔排序
![此处输入图片的描述][4]


![此处输入图片的描述][5]


  代码实现：
```JavaScript
// 希尔排序
function shellSort(arr) {
  var gap = Math.floor(arr.length / 2);
  while (gap > 0) {
    for (var i = gap; i < arr.length; i++) {
	  temp = arr[i];
	  for (var j = i; j >= gap && arr[j-gap] > temp; j -= gap) {
	    arr[j] = arr[j - gap];
	  }
	  arr[j] = temp;
	}
	gap = Math.floor(gap / 2);
  }
  return arr;
}
var arr = [2, 3, 6, 4, 2, 1, 90, 100, 20, 5];
console.log(shellSort(arr)); //[1, 2, 2, 3, 4, 5, 6, 20, 90, 100]
```
## 快速排序
![此处输入图片的描述][6]
3、对"基准"左边和右边的两个子集，不断重复第一步和第二步，直到所有子集只剩下一个元素为止。
![此处输入图片的描述][7]
  >特点：速度最快。和归并排序不同的是，归并排序是先分为两组再继续排，而快速排序是边分边排

代码实现：
```JavaScript
// 大致分三步：
// 1、找基准（一般以中间项为基准）
// 2、遍历数组，小于基准的放在left，大于基准的放在right
// 3、递归
function quickSort(arr) {
// 如果数组<=1，则直接返回
  if (arr.length <= 1) {
    return arr;
  }
  var pivotIndex = Math.floor(arr.length / 2);
  // 找基准，并把基准从原数组删除
  var pivot = arr.splice(pivotIndex, 1)[0];
  // 定义左右数组
  var left = [];
  var right = [];
  // 比基准小的放在left，比基准大的放在right
  for (var i = 0; i < arr.length; i++) {
    if(arr[i] <= pivot) {
 	  left.push(arr[i]);
 	} else {
 	  right.push(arr[i]);
 	}
  }
  // 递归
  return quickSort(left).concat([pivot], quickSort(right));
} 
var arr = [2, 3, 6, 4, 2, 1, 90, 100, 20, 5];
console.log(quickSort(arr)); //[1, 2, 2, 3, 4, 5, 6, 20, 90, 100]
```
## 奇偶排序
![此处输入图片的描述][8]

![此处输入图片的描述][9]


[1]: http://p9.pstatp.com/large/31f700004cd560512e10
[2]: http://p1.pstatp.com/large/32040001405eee3b0feb
[3]: http://p3.pstatp.com/large/31f30005215262ad5c2c
[4]: http://p9.pstatp.com/large/31f50001fa47898d558e
[5]: http://p3.pstatp.com/large/31f7000052f9c0b67e86
[6]: http://p1.pstatp.com/large/3202000045b4fa206217
[7]: http://p3.pstatp.com/large/320b0000495f2a5aceaa
[8]: http://p3.pstatp.com/large/320200004c84b8c20819
[9]: http://p3.pstatp.com/large/320200004d44a4a1bb61

代码实现：
```JavaScript
//奇偶排序
function oddEvenSort(arr) {
// swaped用来控制循环是否要继续，如果左边的都比右边的小，则退出循环，返回排好的数组
  var swaped = true;
  var k = 0;
  while(swaped) {
    if(k > 0) {
	  swaped = false;
	}
	for (var i = k;i < arr.length-1; i += 2) {
	  if(arr[i] > arr[i+1]) {
	    // 如果左边的数字比右边的大，两边交换位置
	    arr[i] = [arr[i+1], arr[i+1] = arr[i]][0];
		swaped = true;
	  }
	}
	k = [1, 0][k]; // 奇偶数之间的转换
  }
  return arr;
}
var arr = [2, 3, 6, 4, 2, 1, 90, 100, 20, 5];
console.log(oddEvenSort(arr)); // [1, 2, 3, 4, 5, 6, 20, 90, 100]
```

## 最后

创建了一个前端学习交流群，感兴趣的朋友，一起来嗨呀！
![](https://i.imgur.com/qbcaSEh.png)