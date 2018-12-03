# [js-xlsx-plugin](https://github.com/iwanttodo/jquery-plugin)

使用步骤

### 1. 引入js
```html
<script src="js/jquery-2.0.3.min.js" type="text/javascript"></script>
<script src="js/xlsx.full.min.js" type="text/javascript"></script>
<script src="js/jquery.xlsx.util.js" type="text/javascript"></script>
```

### 2. 使用
```html
<input type="file" name="excel" id="excel" />
<script>
    $(function(){
        $("#excel").on('change', function() {
            $(this).xlsxImport({
                onlyReadFirstSheet: true,   // 只读第一个sheet
                startReadRow: 2,            // 从0开始
                keys: ['id', 'name', 'sex', 'age'],                   // 对应的key值
            }, function(rows) {
                // rows 表示读取excel记录后的数组
                // do something
                console.log(rows);
            });
        });
    });
</script>
```
