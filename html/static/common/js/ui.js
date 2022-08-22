
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

function getParamFromUrl(url, name) {
    let s = url.indexOf("?")
    if(s<=0){
        return null
    }
    url = url.substring(s+1);

    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = url.match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

var dynamicLoading = {
    css: function (path) {
        if (!path || path.length === 0) {
            throw new Error('argument "path" is required !');
        }
        let head = document.getElementsByTagName('head')[0];
        let link = document.createElement('link');
        link.href = path;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        head.appendChild(link);
    },
    loadCss: function (paths) {
        for(let i=0;i< paths.length;i++){
            dynamicLoading.css(paths[i]);
        }
    },
    js: function (path) {
        if (!path || path.length === 0) {
            throw new Error('argument "path" is required !');
        }
        document.write("<script src='" + path + "'><\/script>");
    },
    js2: function (path) {
        if (!path || path.length === 0) {
            throw new Error('argument "path" is required !');
        }
        let head = document.getElementsByTagName('head')[0];
        let script = document.createElement('script');
        script.src = path;
        script.type = 'text/javascript';
        head.appendChild(script);
    },
    loadScript: function(src, callback) {
        let script = document.createElement('script'),
            head = document.getElementsByTagName('head')[0];
        script.type = 'text/javascript';
        script.charset = 'UTF-8';
        script.src = src;
        if (script.addEventListener) {
            script.addEventListener('load', function () {
                if(callback)
                    callback();
            }, false);
        } else if (script.attachEvent) {
            script.attachEvent('onreadystatechange', function () {
                var target = window.event.srcElement;
                if (target.readyState == 'loaded') {
                    if(callback)
                        callback();
                }
            });
        }
        head.appendChild(script);
    },
    dynLoadJs: function(urlArr, callback) {

        if(!urlArr){
            if(callback)
                callback()
            return
        }

        let allt = urlArr.length;

        if(allt == 0)
        {
            if(callback)
                callback()

            return
        }

        let sp = document.createElement("script"); // 动态创建 script 标签
        sp.type = 'text/javascript'; // 设置 script 的ype类型
        sp.src = urlArr[0]; // 设置 script 的src属性
        console.log("Load " + urlArr[0]);
        document.getElementsByTagName('head')[0].appendChild(sp); // 把 script 标签 插入head头部

        if (sp.readyState) { // IE
            sp.onreadystatechange = function () { // IE 加载完成
                if (sp.readyState == 'loaded' || sp.readyState == 'complete') {
                    sp.onreadystatechange = null;
                    if(allt > 0){
                        var newArr =  urlArr.slice(1)
                        dynamicLoading.dynLoadJs(newArr, callback)
                    }
                }
            };
        } else { //其他浏览器
            sp.onload = function () { // 加载完成
                if(allt > 0){
                    var newArr =  urlArr.slice(1)
                    dynamicLoading.dynLoadJs(newArr, callback)
                }
            };
        }
    }
}


function loadOne(css, js, cb){
    dynamicLoading.loadCss(css)
    dynamicLoading.dynLoadJs(js, cb)
}

contextpath = "";
window.APP_DEBUG = true;
window.APP_VERSION = '1.0.22';
window.ROOT_RES_URL = '';

function loadAllCss(){
    dynamicLoading.loadCss([
        ROOT_RES_URL + "/static/plugins/jquery/daterangepicker-master/daterangepicker.css?" + APP_VERSION,
        ROOT_RES_URL + "/static/cubeui/themes/default/cubeui.core.min.css?" + APP_VERSION,
        ROOT_RES_URL + "/static/cubeui/themes/default/cubeui.blacklight.css?" + APP_VERSION,
        ROOT_RES_URL + "/static/cubeui/themes/default/cubeui.extends.css?" + APP_VERSION,
        ROOT_RES_URL + "/static/plugins/font-awesome/css/font-awesome.min.css?" + APP_VERSION,
        ROOT_RES_URL + "/static/plugins/layui/css/layui.css?" + APP_VERSION,
        ROOT_RES_URL + "/static/common/css/app.css?" + APP_VERSION,
        ROOT_RES_URL + "/static-extend/css/common.css?" + APP_VERSION,
    ]);
}

function loadAll(cb){
    let js = [
        ROOT_RES_URL + "/static/package.js?" + APP_VERSION,
        ROOT_RES_URL + "/static/plugins/jquery/jquery.min.js?" + APP_VERSION,
        ROOT_RES_URL + "/static/plugins/jquery/jquery.cookie.js?" + APP_VERSION,
        ROOT_RES_URL + "/static/common/js/Math.uuid.js?" + APP_VERSION,
        ROOT_RES_URL + "/static/common/js/bigdecimal.js?" + APP_VERSION,
        ROOT_RES_URL + "/static/common/js/Math.uuid.js?" + APP_VERSION,
        ROOT_RES_URL + "/static/common/js/date.js?" + APP_VERSION,
        ROOT_RES_URL + "/static/common/js/jquery.extends.js?" + APP_VERSION,
        ROOT_RES_URL + "/static/common/js/jquery.extends-excel.js?" + APP_VERSION,

        ROOT_RES_URL + "/static/plugins/jquery/jquery.base64.min.js?" + APP_VERSION,
        ROOT_RES_URL + "/static/plugins/jquery/daterangepicker-master/moment.min.js?" + APP_VERSION,
        ROOT_RES_URL + "/static/plugins/jquery/daterangepicker-master/daterangepicker.js?" + APP_VERSION,
        ROOT_RES_URL + "/static/plugins/jquery/store.js-master/dist/store.everything.min.js?" + APP_VERSION,
        ROOT_RES_URL + "/static/cubeui/js/locale/lang.js?" + APP_VERSION,
        ROOT_RES_URL + "/static/cubeui/js/locale/lang.zh_CN.js?" + APP_VERSION,
        ROOT_RES_URL + "/static/public/js/cubeui.config.js?" + APP_VERSION,
        ROOT_RES_URL + "/static/public/js/cubeui.li.js?" + APP_VERSION,
        ROOT_RES_URL + "/static/cubeui/js/cubeui.core.min.js?" + APP_VERSION,
        ROOT_RES_URL + "/static/plugins/easyui/easyui-datagridview/datagrid-groupview.js?" + APP_VERSION,
        ROOT_RES_URL + "/static/plugins/easyui/easyui-datagridview/datagrid-detailview.js?" + APP_VERSION,
        ROOT_RES_URL + "/static/plugins/easyui/datagrid-export/datagrid-export.js?" + APP_VERSION,
        ROOT_RES_URL + "/static/plugins/easyui/datagrid-filter/datagrid-filter.js?" + APP_VERSION,
        ROOT_RES_URL + "/static/cubeui/js/cubeui.extends.min.js?" + APP_VERSION,
        ROOT_RES_URL + "/static/cubeui/js/locale/cubeui.lang.js?" + APP_VERSION,
        ROOT_RES_URL + "/static/cubeui/js/locale/cubeui.lang.zh_CN.js?" + APP_VERSION,
        ROOT_RES_URL + "/static/common/js/locale/core.message.js?" + APP_VERSION,
        ROOT_RES_URL + "/static/common/js/locale/core.message.zh_CN.js?" + APP_VERSION,

        ROOT_RES_URL + "/static/plugins/layui/layui.js?" + APP_VERSION,
        ROOT_RES_URL + "/static/common/js/app.js?" + APP_VERSION,
        ROOT_RES_URL + "/static/common/js/mvvm.js?" + APP_VERSION,
        ROOT_RES_URL + "/static/plugins/jquery/jquery-tmpl-master/jsrender.min.js?" + APP_VERSION,


        ROOT_RES_URL + "/static/plugins/pdfmake/pdfmake.js?" + APP_VERSION,

        ROOT_RES_URL + "/static-extend/js/common.js?" + APP_VERSION,
        ROOT_RES_URL + "/api/node.config.js?" + APP_VERSION,
    ];

    dynamicLoading.dynLoadJs(js, function (){
        console.log("APP LoadJs start ")

        let myHelpers = {
            upper: function(val) { return val?val.toUpperCase():''; },
            lower: function(val) { return val?val.toLowerCase():''; },
            trim: function(val) { return val?val.trim():''; },
            js: function(val) { return val?val.trim().jsEncode():''; },
            html: function(val) { return val?val.trim().htmlEncode():''; },
            title: "Debug"
        };

        $.views.helpers(myHelpers);

        $.views.converters("upper", function(val) { return val?(val+'').toUpperCase():''; });
        $.views.converters("lower", function(val) { return val?(val+'').toLowerCase():''; });
        $.views.converters("trim", function(val) { return val?(val+'').trim():''; });
        $.views.converters("js", function(val) { return val?(val+'').trim().jsEncode():''; });
        $.views.converters("html", function(val) { return val?(val+'').trim().htmlEncode():''; });

        pdfMake.fonts = {
            gbk:{
                normal: ROOT_RES_URL +'/static/plugins/pdfmake/fonts/FZLTCXHJW.TTF',
                bold: ROOT_RES_URL +'/static/plugins/pdfmake/fonts/FZLTCXHJW.TTF',
                italics: ROOT_RES_URL +'/static/plugins/pdfmake/fonts/FZLTCXHJW.TTF',
                bolditalics: ROOT_RES_URL +'/static/plugins/pdfmake/fonts/FZLTCXHJW.TTF'
            }
        };

        if(cb){
            cb()
        }

        console.log("APP LoadJs End ")
    });

}

let APP = function(config){

    loadAll(function(){

        if(typeof config === "function"){
            config = config()
        }

        let jsFiles = [];

        if(config){
            if(config.css){
                dynamicLoading.loadCss(config.css)
            }
            if(config.js){
                config.js.forEach(function (item, i){
                    jsFiles.push(item)
                })
            }
        }

        let cb = function (){}

        if(config.render){
            cb = config.render
        }

        let h = function (){
            cb()

            $(function (){
                for (let idx = 0; idx < APP._init.length; idx ++) {
                    APP._init[idx]()
                }
            });
        }

        dynamicLoading.dynLoadJs(jsFiles, h)
    })
}

APP.renderBody = function (template, data){

    if($(template).isNull())
        return

    let t = $.templates(template).render(data)
    $('body div').remove()
    $(t).appendTo($('body'))
    //$.parser.parse($('body'));
};

APP.render = function (template, data){

    if($(template).isNull())
        return ''

    let t = $.templates(template).render(data)
    return t;
};

APP._init = [];

APP.fn = function (loadFn){
    this._init.push(loadFn)
}

loadAllCss()

var local_node = {
    node_host: "192.168.56.102",
    node_port: "2375",
    node_version: "v1.32",
    volumes: [],
    logs:[],
}