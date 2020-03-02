---
title: JavaScript数据结构与算法-Array
---

## 只出现一次的数字i

```
给定一个非空整数数组，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。

说明：

你的算法应该具有线性时间复杂度。 你可以不使用额外空间来实现吗？

示例 1:

输入: [2,2,1]
输出: 1
示例 2:

输入: [4,1,2,1,2]
输出: 4
```

主要运用的就是[异或运算](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators)和交换定律。

例如：`1 ^ 1 = 0` 、 `2 ^ 2 = 0`、 `0 ^ 1 = 1` 、`1 ^ 1 ^ 2 ^ 3 ^ 2 ^ 4 ^ 3 = 4`

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function(nums) {
    // 这个方法可以找出存在奇数次的数字，不一定只有一次
    for(let i = 1;i<nums.length;i++) {
        nums[0] = nums[0] ^ nums[i]
    }
    return nums[0]
};
```

## 只出现一次的数字ii

```
给定一个非空整数数组，除了某个元素只出现一次以外，其余每个元素均出现了三次。找出那个只出现了一次的元素。

说明：

你的算法应该具有线性时间复杂度。 你可以不使用额外空间来实现吗？

示例 1:

输入: [2,2,3,2]
输出: 3
示例 2:

输入: [0,1,0,1,0,1,99]
输出: 99
```

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function(nums) {
    // 这个方法也可以做上面的题，i+=2，可以以此类推下去
    nums.sort();
    for (let i = 0; i < nums.length; i+=3) {
        if (nums[i] !== nums[i + 1]) {
          return nums[i];
          break;
        }
    }
};
```

## 两个数组的交集i

```
给定两个数组，编写一个函数来计算它们的交集。

示例 1:

输入: nums1 = [1,2,2,1], nums2 = [2,2]
输出: [2]
示例 2:

输入: nums1 = [4,9,5], nums2 = [9,4,9,8,4]
输出: [9,4]
说明:

输出结果中的每个元素一定是唯一的。 *
我们可以不考虑输出结果的顺序。
```

思路：这个题比较简单，用`filter`遍历，用`indexOf`判断`nums1`中的数字是否存在于`nums2`中，这可能会有重复出现的情况，再用`Set` 去重就行了。

```javascript
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersection = function(nums1, nums2) {
    return Array.from(new Set(nums1.filter(item => nums2.indexOf(item)>-1)))
};
```

## 两个数组的交集ii

```
给定两个数组，编写一个函数来计算它们的交集。

示例 1:

输入: nums1 = [1,2,2,1], nums2 = [2,2]
输出: [2,2]
示例 2:

输入: nums1 = [4,9,5], nums2 = [9,4,9,8,4]
输出: [4,9]
说明：

输出结果中每个元素出现的次数，应与元素在两个数组中出现的次数一致。
我们可以不考虑输出结果的顺序。
进阶:

如果给定的数组已经排好序呢？你将如何优化你的算法？
如果 nums1 的大小比 nums2 小很多，哪种方法更优？
如果 nums2 的元素存储在磁盘上，磁盘内存是有限的，并且你不能一次加载所有的元素到内存中，你该怎么办？
```

思路：这个题和上面那个题，最大的区别是，数组中有重复的数字，也得返回，。而且还的考虑一下，数组的长度对遍历的优化。我的解法是判断数组的长度，遍历长度短的数组，因为两个数组的交集不可能超出最短的数组，然后用`indexOf`判断是否是交集，**再删除长数组中重复的这一项，进行下一次循环**，因为`indexOf`只能找出第一个出现的位置，会出错。例如：`[2,2]`和`[1,2,1]`,如果不删，返回结果是`[2,2]`，正确结果是`[2]`。

```javascript
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersect = function(nums1, nums2) {
    let res = []
    function fnc(min, max) {
        let index = -1
        for (let i = 0; i < min.length; i++) {
            if (max.indexOf(min[i]) > -1) {
                res.push(min[i])
                max.splice(max.indexOf(min[i]),1)
            }
        }
    }
    if (nums1.length > nums2.length) {
        fnc(nums2, nums1)
    } else {
        fnc(nums1, nums2)
    }
    return res
};
```
## 加一
```
给定一个由整数组成的非空数组所表示的非负整数，在该数的基础上加一。

最高位数字存放在数组的首位， 数组中每个元素只存储一个数字。

你可以假设除了整数 0 之外，这个整数不会以零开头。

示例 1:

输入: [1,2,3]
输出: [1,2,4]
解释: 输入数组表示数字 123。
示例 2:

输入: [4,3,2,1]
输出: [4,3,2,2]
解释: 输入数组表示数字 4321。
```

思路： 我一开始想的是，转成数字直接+1，结果发现如果数字超出最大数字就会出错。那就只能从数组最后一位开始加了，遇到9就得向前进一位加一。这里用的是递归，用了一个`res`临时变量来存`0`，然后将原数组最后一位删了。如果数组长度为1，要么`=10 => return [1,0,...res]`，要么`<10 => [...arr,...res]`。

```javascript
/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function(digits) {
	let res = []
	function fnc (arr) {
		let len = arr.length - 1
		if (arr[len] + 1 == 10) {
			if (len==0) {
				return [1,0,...res]
			}
			res.unshift(0)
			arr.pop()
			// 这里需要return 递归调用，不然会得到undefined
			return fnc(arr)
		} else {
			digits[len]+=1
			return [...arr,...res]
    	}
	}
	return fnc(digits)
};
```

## 电话号码

```
给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。
给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。

示例:
输入："23"
输出：["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"].
说明:
尽管上面的答案是按字典序排列的，但是你可以任意选择答案输出的顺序。
```
![此处输入图片的描述](http://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Telephone-keypad2.svg/200px-Telephone-keypad2.svg.png)

这道题的思路就是递归，因为输入的字符串长度不确定，所以就两个两个的组合，比如输入`234`,他们对应的字符串映射成`['abc','def','ghi']`,就先组合 `abc`和 `def` => `[["ad","ae","af","bd","be","bf","cd","ce","cf"],'ghi']` 再递归。

```javascript
export default (str) => {
  // 建立电话号码键盘映射
  let map = ['', 1, 'abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz']
  // 字符串转成数组
  let num = str.split('')
  let code = []
  // code 是存储 str 对应的 映射 字符串的数组
  num.forEach(item => {
    if (map[item]) {
      code.push(map[item])
    }
  })
  // 递归函数
  let fnc = arr => {
    let tmp = []
    for (let i = 0; i < arr[0].length; i++) {
      for (let j = 0; j < arr[1].length; j++) {
        tmp.push(`${arr[0][i]}${arr[1][j]}`)
      }
    }
    // 替换数组前两项，至关重要
    arr.splice(0, 2, tmp)
    if (arr.length > 1) {
      fnc(arr)
    } else {
      return tmp
    }
    // 最后会返回一个二维数组，而我们需要的就是第一个
    return arr[0]
  }
  return fnc(code)
}
```

## 卡牌分组

```javascript
给定一副牌，每张牌上都写着一个整数。

此时，你需要选定一个数字 X，使我们可以将整副牌按下述规则分成 1 组或更多组：

每组都有 X 张牌。
组内所有的牌上都写着相同的整数。
仅当你可选的 X >= 2 时返回 true。

示例 1：

输入：[1,2,3,4,4,3,2,1]
输出：true
解释：可行的分组是 [1,1]，[2,2]，[3,3]，[4,4]
示例 2：

输入：[1,1,1,2,2,2,3,3]
输出：false
解释：没有满足要求的分组。
示例 3：

输入：[1]
输出：false
解释：没有满足要求的分组。
示例 4：

输入：[1,1]
输出：true
解释：可行的分组是 [1,1]
示例 5：

输入：[1,1,2,2,2,2]
输出：true
解释：可行的分组是 [1,1]，[2,2]，[2,2]

提示：

1 <= deck.length <= 10000
0 <= deck[i] < 10000
```

思路：这个题比较难，主要是最大公约数。

> 最大公约数：几个整数中公有的约数，叫做这几个数的公约数；其中最大的一个，叫做这几个数的最大公约数。例如：12、16的公约数有1、2、4，其中最大的一个是4，4是12与16的最大公约数，一般记为（12，16）=4。12、15、18的最大公约数是3，记为（12，15，18）=3。

```javascript
// 此方法主要用到这样一个定理：a和b的公约数==b和a%b的公约数==a%b和b%(a%b)的公约数…………； 另外要知道.a和0的公约数==a;

function Mgn(num1,num2){  
    return num2!=0 ? Mgn(num2,num1%num2):num1; 
}  
```

```javascript
按位非运算符“~”
先看看w3c的定义：

位运算 NOT 由否定号（~）表示，它是 ECMAScript 中为数不多的与二进制算术有关的运算符之一。

位运算 NOT 是三步的处理过程：

把运算数转换成 32 位数字

把二进制数转换成它的二进制反码（0->1, 1->0）

把二进制数转换成浮点数

简单的理解，对任一数值 x 进行按位非操作的结果为 -(x + 1)

console.log('~null: ', ~null);       // => -1
console.log('~undefined: ', ~undefined);  // => -1
console.log('~0: ', ~0);          // => -1
console.log('~{}: ', ~{});         // => -1
console.log('~[]: ', ~[]);         // => -1
console.log('~(1/0): ', ~(1/0));      // => -1
console.log('~false: ', ~false);      // => -1
console.log('~true: ', ~true);       // => -2
console.log('~1.2543: ', ~1.2543);     // => -2
console.log('~4.9: ', ~4.9);       // => -5
console.log('~(-2.999): ', ~(-2.999));   // => 1

那么, ~~x就为 -(-(x+1) + 1)

console.log('~~null: ', ~~null);       // => 0
console.log('~~undefined: ', ~~undefined);  // => 0
console.log('~~0: ', ~~0);          // => 0
console.log('~~{}: ', ~~{});         // => 0
console.log('~~[]: ', ~~[]);         // => 0
console.log('~~(1/0): ', ~~(1/0));      // => 0
console.log('~~false: ', ~~false);      // => 0
console.log('~~true: ', ~~true);       // => 1
console.log('~~1.2543: ', ~~1.2543);     // => 1
console.log('~~4.9: ', ~~4.9);       // => 4
console.log('~~(-2.999): ', ~~(-2.999));   // => -2

```

```javascript
/**
 * @param {number[]} deck
 * @return {boolean}
 */
var hasGroupsSizeX = function(deck) {
    
    let map = {}
    for(let item of deck) {
        map[item] = ~~map[item] + 1
    }
    // map = {0:2,1:2,3:4} 这就是各个数出现的次数，然后去它们的最大公约数
    const min = Math.min(...Object.values(map))

    if(min < 2) return false
  
    for (let index of Array(min).fill().keys()) {
        if(index === 0) continue
        // 取最大公约数
        if(Object.values(map).every(item => item % (index + 1) === 0)) {
            return true
        }
    }
  
    return false
};
```

```javascript
// 这是leetcode的最优解法
/**
 * @param {number[]} deck
 * @return {boolean}
 */

const gcd = (...arr) => {
  // 取最大公约数
  let _gcd = (x, y) => (!y ? x : gcd(y, x % y))
  return [...arr].reduce((a, b) => _gcd(a, b))
}
var hasGroupsSizeX = function (deck) {
  
  let obj = {}
  deck.forEach(v => { obj[v] ? obj[v]++ : obj[v] = 1 })
  let arr = Object.values(obj)
  return gcd(...arr) !== 1
};
```

### 找出字符串中出现次数最多的字符
根据上面的题得出了这个解法
```javascript
function maxStr(str) {
  let map = {}
  for(let v of str) {
    map[v] = ~~map[v] + 1
  }
  // 将object的value 变成一个数组
  let max = Math.max(...Object.values(map))
  for (let key in map) {
    if (map[key] == max){
      return key
    }
  }
}
```
## 种花问题

```
假设你有一个很长的花坛，一部分地块种植了花，另一部分却没有。可是，花卉不能种植在相邻的地块上，它们会争夺水源，两者都会死去。

给定一个花坛（表示为一个数组包含0和1，其中0表示没种植花，1表示种植了花），和一个数 n 。能否在不打破种植规则的情况下种入 n 朵花？能则返回True，不能则返回False。

示例 1:

输入: flowerbed = [1,0,0,0,1], n = 1
输出: True
示例 2:

输入: flowerbed = [1,0,0,0,1], n = 2
输出: False
注意:

数组内已种好的花不会违反种植规则。
输入的数组长度范围为 [1, 20000]。
n 是非负整数，且不会超过输入数组的大小。
```
思路：`[0,0,0]` 前后都是0，就可以插入一个，然后数组下标加2，再判断。
```javascript
暴力求解
/**
 * @param {number[]} flowerbed
 * @param {number} n
 * @return {boolean}
 */
var canPlaceFlowers = function(flowerbed, n) {
    let blank = 0
    if (flowerbed.length == 1&&flowerbed[0]==0) {
        return 1 >= n
    }
    for(let i = 0;i<flowerbed.length;i++) {
        if(!flowerbed[i]&&!flowerbed[i-1]&&!flowerbed[i+1]) {
            blank++;
            // 其实这里i是往后跳两位，但是这里只加一，因为for里面还有i++
            i++;
            // 及时跳槽循环，减少时间
            if (blank >= n) {
              break;
            }
        }
    }
    return blank >= n
};
```

## 洗牌算法

> 洗牌算法也就是随机打乱重组数组

```javascript
let arr = [1, 2, 3, 4, 5, 6]

Array.prototype.shuffle = function shuffle() {
    let m = this.length,
        i;
    while (m) {
        i = (Math.random() * m--) >>> 0; // 变成一个非负整数
        [this[m], this[i]] = [this[i], this[m]] // 解构
    }
    return this;
}
console.log(arr.shuffle())
```

> `>>>` 该操作符会将第一个操作数向右移动指定的位数。向右被移出的位被丢弃，左侧用0填充。因为符号位变成了 0，所以结果总是非负的。（译注：即便右移 0 个比特，结果也是非负的。）