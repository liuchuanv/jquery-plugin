/**
 * xlsx 文件操作封装插件
 * 依赖：jquery-2.0.3.min.js, xlsx.util.js
 * @author LiuChuanWei
 * https://github.com/iwanttodo/jquery-plugin
 */
;(function($, window, document,undefined) {
    // 定义XlsxUtil的构造函数
    var XlsxUtil = function(ele) {
        this.$element = ele,

        this.wb = null;
    }
    // 定义XlsxUtil的方法
    XlsxUtil.prototype = {
        /**
         * 导入
         */
        import: function(opt, callback) {
            var _this = this;
            defaults = {
                onlyReadFirstSheet: true,   // 只读第一个sheet
                startReadRow: 0,            // 从0开始
                // xlsx文件列对应的名称
                keys: [],
            },
            options = $.extend({}, defaults, opt),
            obj = _this.$element[0];
            if (!obj.files) {
                return;
            }

            var reader = new FileReader();
            reader.onload = function(e) {
                var data = e.target.result;
                _this.wb = XLSX.read(data, {type: 'binary'});
                var rows = _this.csvToJSONArray(options);
                if(callback && typeof (callback)) callback(rows);
            };
            reader.readAsBinaryString(obj.files[0]);
        },

        // 由csv转成json数组
        csvToJSONArray: function(options) {
            var sheets = this.wb.Sheets;
            var sheetNames = this.wb.SheetNames;
            var arr = [];
            // 遍历sheets
            for (var i=0; i<sheetNames.length; i++) {
                var worksheet = sheets[sheetNames[i]];
                var csv = XLSX.utils.sheet_to_csv(worksheet);
                var rows = csv.split('\n');
                // 遍历rows
                for (var r=options.startReadRow; r<rows.length; r++) {
                    if (!rows[r]) continue;
                    var cols = rows[r].split(',');
                    var obj = this.generateObject(options.keys, cols);
                    arr.push(obj);
                }
                // 如果只读一个sheet
                if (options.onlyReadFirstSheet) {
                    break;
                }
            }
            return arr;
        },
        /**
         * 根据keys和vals生成对象
         * @param keys
         * @param vals
         */
        generateObject: function (keys, vals) {
            var o = {};
            if (!keys || keys.length < 1) {
                for (var i=0; i<vals.length; i++) {
                    var v = vals[i];
                    o[i] = v;
                }
            } else {
                for (var i=0; i<keys.length; i++) {
                    var k = keys[i];
                    var v = vals[i];
                    o[k] = v;
                }
            }
            return o;
        },

    };
    // 在插件中使用XlsxUtil对象
    $.fn.xlsxImport = function(options, callback) {
        // 创建XlsxUtil的实体
        var xlsxUtil = new XlsxUtil(this);
        return xlsxUtil.import(options, callback);
    };
})(jQuery, window, document);