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
            var obj = this.$element[0];
            if (!obj.files) {
                return;
            }
            this.importFile(obj.files[0], opt, callback);
        },
        /**
         * 导入文件对象
         * @param file
         */
        importFile: function(file, opt, callback) {
            var _this = this,
            defaults = {
                onlyReadFirstSheet: true,   // 只读第一个sheet
                startReadRow: 1,            // 从0开始
                // xlsx文件列对应的名称，如 ['id', 'name', 'sex', 'age']
                keys: [],
            };
            var options = $.extend({}, defaults, opt);
            var reader = new FileReader();
            reader.onload = function(e) {
                var data = e.target.result;
                _this.wb = XLSX.read(data, {type: 'binary'});
                var rows = _this.csvToJSONArray(options);
                if(callback && typeof (callback)) callback(rows);
            };
            reader.readAsBinaryString(file);
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


        /**
         * 保存文件
         * @param obj
         * @param fileName
         */
        saveAs: function(obj, fileName) {
            var tmpa = document.createElement("a");
            tmpa.download = fileName || "下载";
            tmpa.href = URL.createObjectURL(obj); //绑定a标签
            tmpa.click(); //模拟点击实现下载
            setTimeout(function () { //延时释放
                URL.revokeObjectURL(obj); //用URL.revokeObjectURL()来释放这个object URL
            }, 100);
        },
        /**
         * 导出
         * @param data 数据
         * @param opt 配置
         * @param callback 回调函数
         */
        export: function(data, opt, callback) {
            // 这里的数据是用来定义导出的格式类型
            var defaults = {
                bookType: 'xlsx',
                bookSST: true,
                type: 'binary'
            },
            options = $.extend({}, defaults, opt),
            wb = { SheetNames: ['Sheet1'], Sheets: {}, Props: {} };

            var sheet = XLSX.utils.json_to_sheet(data);

            // 执行回调函数
            if (callback) {
                callback(sheet);
            }
            wb.Sheets['Sheet1'] = sheet;

            var buf = this.s2ab(XLSX.write(wb, options));
            var blob = new Blob([buf], { type: "application/octet-stream"});
            var fileName = !options.fileName ? new Date().getTime() : options.fileName;
            var suffix = options.bookType == "biff2" ? "xls" : options.bookType;
            this.saveAs(blob, fileName + "." + suffix);
        },
        s2ab: function(s) {
            if (typeof ArrayBuffer !== 'undefined') {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            } else {
                var buf = new Array(s.length);
                for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }
        },

    };
    // 在插件中使用XlsxUtil对象
    $.fn.xlsxImport = function(options, callback) {
        // 创建XlsxUtil的实体
        var xlsxUtil = new XlsxUtil(this);
        return xlsxUtil.import(options, callback);
    };
    // 在插件中使用XlsxUtil对象
    $.extend({
        xlsxImportFile: function(file, options, callback) {
            // 创建XlsxUtil的实体
            var xlsxUtil = new XlsxUtil(this);
            return xlsxUtil.importFile(file, options, callback);
        },
        xlsxExport: function(data, options, callback) {
            // 创建XlsxUtil的实体
            var xlsxUtil = new XlsxUtil(this);
            return xlsxUtil.export(data, options, callback);
        },

    });
})(jQuery, window, document);