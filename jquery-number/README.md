# [jquery-number](https://github.com/customd/jquery-number)

使用步骤

### 1. 引入js
```html
<script src="jquery-x.x.x.js" type="text/javascript"></script>
<script src="jquery.number.js" type="text/javascript"></script>
```

### 2. 方法说明
```javascript

// 初始化千分位数值输入框，
// 第1个参数true表示输入框以千分位形式显示输入的数值，而不是将 true 赋值给输入框
// 第2个参数2表示保留小数点后2位，默认为0
$("#number, #number2").number(true, 2);


// 给数值输入框赋值
// 第1个参数是给数值输入框要赋的值
$("#number").number(999.9489, 2);


/** 格式化数值 **/

// 保留小数点后2位
$.number(888.8856, 2);    // 输出：888.89

// 替换小数点字符（这里以星号*替换了小数点.，注意不能用逗号，github上给的例子是错误的）
$.number(135.8769, 3, '*'); // 输出: 135*877

// 替换千分位的分隔符（这里以空格替换了逗号,）
$.number(5020.2364, 1, '.', ' ' );  // 输出：5 020.2

```
