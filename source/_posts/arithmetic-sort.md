---
title: JavaScript数据结构与算法-Sort
date: 2019-06-14 17:40:38
type: "tags"
tags: 
	- JS
	- 算法
categories: "算法"
description: "以leetcode原题学习数据结构和算法"
---

## 排序

![](https://ws2.sinaimg.cn/large/006tNc79gy1g3w5q7v3tdj30j507e3zh.jpg)

- 时间复杂度（运行次数）

我们假设计算机运行一行基础代码需要执行一次运算。
```javascript
int aFunc(void) {
    printf("Hello, World!\n");      //  需要执行 1 次
    return 0;       // 需要执行 1 次
}
```
那么上面这个方法需要执行 2 次运算
```javascript
int aFunc(int n) {
    for(int i = 0; i<n; i++) {         // 需要执行 (n + 1) 次
        printf("Hello, World!\n");      // 需要执行 n 次
    }
    return 0;       // 需要执行 1 次
}
```
这个方法需要 (n + 1 + n  + 1) = 2n + 2 次运算。
我们把 算法需要执行的运算次数 用 输入大小n 的函数 表示，即 T(n) 。

常用算法时间复杂度：

- O(1)常数型
- O(n)线性型
- O(n^2)平方型
- O(n^3)立方型 
- O(2^n)指数型
- O(log2^n)对数型
- O(nlog2^n)二维型

时间复杂度的分析方法： 
1、时间复杂度就是函数中基本操作所执行的次数 
2、一般默认的是最坏时间复杂度，即分析最坏情况下所能执行的次数 
3、忽略掉常数项 
4、关注运行时间的增长趋势，关注函数式中增长最快的表达式，忽略系数 
5、计算时间复杂度是估算随着n的增长函数执行次数的增长趋势 
6、递归算法的时间复杂度为：递归总次数 * 每次递归中基本操作所执行的次数

- 空间复杂度（占用内存）

1. 算法消耗的空间 
一个算法的占用空间是指算法实际占用的辅助空间总和 
2. 算法的空间复杂度 
 算法的空间复杂度不计算实际占用的空间，而是算整个算法的“辅助空间单元的个数”。算法的空间复杂度S(n)定义为该算法所耗费空间的数量级，它是问题规模n的函数。记作：
> S(n)=O(f(n)) 1

若算法执行时所需要的辅助空间相对于输入数据量n而言是一个常数，则称这个算法的辅助空间为O(1); 
 递归算法的空间复杂度：递归深度N*每次递归所要的辅助空间， 如果每次递归所需的辅助空间是常数，则递归的空间复杂度是 O(N).

## 冒泡排序

> 原理：从第一个元素开始，往后比较，遇到自己小的元素就交换位置

```javascript
let arr = [89, 19, 90, 9, 3, 21, 5, 77, 10, 22]

function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
  }
  return arr;
}
bubbleSort(arr)
```

![](http://p9.pstatp.com/large/31f700004cd560512e10)

`for (let j = 0; j < arr.length - 1 - i; j++)`对于这里的理解：

1. 当 `i = 0` 时, `j`的**最大值**是`arr.length-2`,那最后一个值就不比吗？并不是，`if (arr[j] > arr[j + 1])`如果`j<arr.length`,`j+1`就会溢出。
2. 那为什么又要`-i`呢，当`i=0`时,经过第一次循环，最大值就会放到数组的最后一位，此时，在进行第二次循环的时候`i=1`，最后的最大数就没必要再比了，要比的就是前`length-1-1`项,以此类推，可以减少循环次数，控制时间复杂度，所以`j < arr.length - 1 - i`。


```javascript
// 另一种写法
let arr = [89, 19, 90, 9, 3, 21, 5, 77, 10, 22]

function bubbleSort(arr) {
// 用i来做边界最大值
  for (let i = arr.length - 1 ; i > 0 ; i--) {
    for (let j = 0; j < i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
  }
  return arr;
}
bubbleSort(arr)
```

## 选择排序

> 它的工作原理如下。首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置，然后，再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。以此类推，直到所有元素均排序完毕。

```javascript
let arr = [89, 19, 90, 9, 3, 21, 5, 77, 10, 22]
function selectionSort(arr) {
  let len = arr.length;
  let min = ''; // 定一个最小值
  // i < len-1 * 因为j = i + 1,不然会重复比较一次最后一位
  for (let i = 0 ; i < len-1 ; i++) {
  	min = i
    for (let j = i+1; j < len; j++) {
      if (arr[min] > arr[j]) {
        min = j
      }
    }
    [arr[i], arr[min]] = [arr[min], arr[i]]
    console.log(`i=${i}; min=${min}; arr=${arr}`)
  }
  return arr;
}
selectionSort(arr)
```

```
// 循环过程
i=0; min=4; arr=3,19,90,9,89,21,5,77,10,22
i=1; min=6; arr=3,5,90,9,89,21,19,77,10,22
i=2; min=3; arr=3,5,9,90,89,21,19,77,10,22
i=3; min=8; arr=3,5,9,10,89,21,19,77,90,22
i=4; min=6; arr=3,5,9,10,19,21,89,77,90,22
i=5; min=5; arr=3,5,9,10,19,21,89,77,90,22
i=6; min=9; arr=3,5,9,10,19,21,22,77,90,89
i=7; min=7; arr=3,5,9,10,19,21,22,77,90,89
i=8; min=9; arr=3,5,9,10,19,21,22,77,89,90
```


![](https://upload.wikimedia.org/wikipedia/commons/b/b0/Selection_sort_animation.gif)


## 最大间距

```
给定一个无序的数组，找出数组在排序之后，相邻元素之间最大的差值。

如果数组元素个数小于 2，则返回 0。

示例 1:

输入: [3,6,9,1]
输出: 3
解释: 排序后的数组是 [1,3,6,9], 其中相邻元素 (3,6) 和 (6,9) 之间都存在最大差值 3。
示例 2:

输入: [10]
输出: 0
解释: 数组元素个数小于 2，因此返回 0。
说明:

你可以假设数组中所有元素都是非负整数，且数值在 32 位有符号整数范围内。
请尝试在线性时间复杂度和空间复杂度的条件下解决此问题。
```

```javascript
var maximumGap = function(nums) {
    //if (nums.length < 2) {
        //return 0;
  //  }
    //nums.sort((a,b) =>  a-b)
    //let max = 0;
    //for(let i = 0; i< nums.length-1; i++) {
        //max = nums[i+1]-nums[i]>max?nums[i+1]-nums[i]:max
    //}
    //return max;
    if (nums.length < 2) {
        return 0;
    }
    nums.sort((a,b) =>  a-b)
    let max = 0,grap;
    for(let i = 0; i< nums.length-1; i++) {
        grap = nums[i+1]-nums[i]
        max = grap>max?grap:max
    }
    return max;
};
```

```javascript
// leetcode上的优解
/**
 * @param {number[]} nums
 * @return {number}
 */
var maximumGap = function (nums) {
  if (nums.length < 2) return 0
  let max = nums[0], min = nums[0]
  for (let i = 1; i < nums.length; i++) {
    max = Math.max(nums[i], max)
    min = Math.min(nums[i], min)
  }
  let delta = (max - min) / (nums.length - 1)
  let maxBucket = new Array(nums.length - 1).fill(Number.MIN_SAFE_INTEGER)
  let minBucket = new Array(nums.length - 1).fill(Number.MAX_SAFE_INTEGER)
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] == min || nums[i] == max) continue
    let index = Math.floor((nums[i] - min) / delta)
    maxBucket[index] = Math.max(maxBucket[index], nums[i])
    minBucket[index] = Math.min(minBucket[index], nums[i])
  }
  let prev = min, maxGap = 0
  for (let i = 0; i < minBucket.length; i++) {
    if (minBucket[i] == Number.MAX_SAFE_INTEGER) continue
    maxGap = Math.max(minBucket[i] - prev, maxGap)
    prev = maxBucket[i]
  }
  maxGap = Math.max(max - prev, maxGap)
  return maxGap
};

// 输入 [3,6,9,1]
// 最大值 9，最小值 1
// 最大桶 [-∞,-∞,-∞] 注意是反的，长度比原数组少1
// 最小桶 [+∞,+∞,+∞] 注意是反的，长度比原数组少1
// 平均桶间距 (9-1)/4 = 2
// 把值逐个放到桶 (nums[i]-最小值)/平均间距
// (3 - 1)/2 = 1 ，修改最小桶坐标1为3， [+∞,3,+∞]，同理最大桶 [-∞,3,-∞]
// (6 - 1)/2 = 2.5 = 2， 最小桶 [+∞,3,6] 最大桶 [-∞,3,6]
// 9 为最大值，跳过
// 1 为最小值，跳过
// 如果有落在同一个桶的则最大桶取最大值，最小桶取最小值，此例子中没有重复落入情况
// 从最小桶找到间隔最大的坐标 最小值=1，最小桶 [+∞,3,6]，最大桶[-∞,3,6] 最大值=9
// 即较大间隔有3段，1-3(最小桶)，3(最大桶)-6(最小桶)，6(最大桶)-9
// 间隔 2,3,3 取最大 3
```

## 按奇偶排序数组

```
给定一个非负整数数组 A，返回一个数组，在该数组中， A 的所有偶数元素之后跟着所有奇数元素。

你可以返回满足此条件的任何数组作为答案。

 

示例：

输入：[3,1,2,4]
输出：[2,4,3,1]
输出 [4,2,3,1]，[2,4,1,3] 和 [4,2,1,3] 也会被接受。
 

提示：

1 <= A.length <= 5000
0 <= A[i] <= 5000
```

```javascript
var sortArrayByParity = function(A) {
    let arr = []
    for(let i = 0;i<A.length;i++) {
        if(A[i]%2 == 0) {
            arr.unshift(A[i])
        } else {
            arr.push(A[i])
        }
    }
    return arr;
};
```

## 按奇偶排序数组II

```
给定一个非负整数数组 A， A 中一半整数是奇数，一半整数是偶数。

对数组进行排序，以便当 A[i] 为奇数时，i 也是奇数；当 A[i] 为偶数时， i 也是偶数。

你可以返回任何满足上述条件的数组作为答案。

示例：

输入：[4,2,5,7]
输出：[4,5,2,7]
解释：[4,7,2,5]，[2,5,4,7]，[2,7,4,5] 也会被接受。
 

提示：

2 <= A.length <= 20000
A.length % 2 == 0
0 <= A[i] <= 1000
```

思路：利用双指针，每次+2

```javascript
var sortArrayByParityII = function(A) {
    let i = 0;
    let j = 1;
    while (j < A.length && i < A.length) {
        if (A[i] % 2 == 0) {
            i += 2;
        } else {
            while (A[j] % 2 != 0 && j < A.length) {
                j += 2;
            }
            if (j < A.length) {
                let tmp = A[i]
                A[i] = A[j]
                A[j] = tmp
            }
        }
    }
    return A;
};
```

## 缺失的第一个正数

```
给定一个未排序的整数数组，找出其中没有出现的最小的正整数。

示例 1:

输入: [1,2,0]
输出: 3
示例 2:

输入: [3,4,-1,1]
输出: 2
示例 3:

输入: [7,8,9,11,12]
输出: 1
说明:

你的算法的时间复杂度应为O(n)，并且只能使用常数级别的空间。
```

```javascript
// 第一种解法
function firstMissingPositive(arr) {
    // 过滤到非正数
    arr = arr.filter(item => item > 0);

    if(arr.length ==0) {
        // 数组为空说明没有正数，那最小的正数就是1
        return 1;
    } else {
        // 排序
        arr.sort((a,b) => a-b);
        // 如果第一项不是1，那就返回1
        if(arr[0] !== 1) {
            return 1
        } else {
            for (let i = 0,len = arr.length; i < len; i++) {
                if(arr[i+1] - arr[i] > 1) {
                    return arr[i] + 1
                } 
            }
            // 如果上面没有return，那就返回数组最后一项 + 1
            return arr.pop() + 1
        }
    }
};
```

```javascript
// 利用选择排序优化代码性能,上面那种写法，最大的缺点就是对所有数据都进行了排序
function firstMissingPositive(arr) {
	arr = arr.filter(item => item > 0);

	// 选择排序，先拿到最小值，如果第一个元素不是1就返回1
	let min = 0;
	let len = arr.length;
	for (let i = 0; i < len; i++) {
		min = i;
		for (let j = i+1; j < len; j++) {
            if (arr[min] > arr[j]) {
                min = j
            }
        }
        [arr[i], arr[min]] = [arr[min], arr[i]]
        // 当进行到第二次遍历后，就可以比较了
        if (i>0) {
        	if(arr[i]-arr[i-1]>1) {
        		return arr[i-1] + 1
        	}
        } else {
            // 如果第一项最小正数不是1，就返回1 
        	if (arr[0]!==1){
        		return 1;
        	}
        }
	}
	// 上面的情况都没通过，这也是最坏的情况，就判断数组的长度如果为0就返回1，反之返回数组最后一项+1
	return arr.length?arr.pop() + 1:1
}
```

