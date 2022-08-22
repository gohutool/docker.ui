/*
 * 专门负责导出流程图文件并让用户下载的扩展包方法，需要依赖:
 * ../plugin/promise.min.js
 * ../plugin/html2canvas.min.js
 * ../plugin/canvg.js (当必须在IE11及以下版本的IE浏览器上运行时)
 */
GooFlow.prototype.exportDiagram=function(fileName) {
    //0.添加临时元素
	var width = this.$workArea.width();
	var height = this.$workArea.height();
    $("body").append('<div id="demo_export" style="position:absolute;top:0;left:0;z-index:-1;width:0px;height:0px;overflow:hidden">'
        +'<div style="color:#15428B;position:absolute;left:0;right:0;width:'+width+'px;height:'+height+'px;overflow:hidden;float:none;" class="GooFlow GooFlow_work"></div>'
        +'</div>');

    //1.先COPY节点和区块的内容
    var inner = $("#demo").find(".GooFlow_work_inner");
    var divCanvas = $("#demo_export").children("div:eq(0)");
    //复制节点的内容
    inner.children("div").each(function(i){
        var item=$(this);
        if(item.hasClass("GooFlow_item")){
            item.clone().removeAttr("id").css("position","absolute").appendTo(divCanvas);
        }else if(item.hasClass("GooFlow_work_group")){
            item.clone().removeAttr("id").css("position","absolute")
                .attr("xmlns",'http://www.w3.org/1999/xhtml').appendTo(divCanvas);
        }
    });
    html2canvas(divCanvas[0], {
        allowTaint: false, taintTest: false,
        onrendered: function(canvas) {
            //2.在回调方法中，COPY连线内容
            //造出临时的IMAGE
            var context = canvas.getContext('2d');//取得画布的2d绘图上下文
            context.save();
            var strSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="1160" height="507">'
                +'<defs><style type="text/css">text{font-size:14px;line-height:1.42857143;'
                +'font-family:"Microsoft Yahei", "Helvetica Neue", Helvetica, Hiragino Sans GB, WenQuanYi Micro Hei, Arial, sans-serif;'
                +'}</style></defs>' + window.$("<svg>").append(window.$("#draw_demo").clone()).html() +'</svg>'; //COPY连线内容
            var image = null;
            if(!!window.ActiveXObject || "ActiveXObject" in window){//当为IE11及以下版本浏览器时，使用Canvg第三方工具
                image = document.createElement('canvas');
                canvg(image, strSvg);
            }else{
                var image = new Image();
                image.src='data:image/svg+xml,'+ encodeURIComponent(strSvg);
            }
            var tempFunc=function(){
                context.drawImage(image, 0, 0);
                //清除不需要的临时DOM
                $("#demo_export").empty().remove();
                try{
                    var blob = canvas.msToBlob();
                    //alert("blob2");
                    navigator.msSaveBlob(blob, "prettyImage.png");
                }
                catch(e){
                    //生成一个下载链接并点击
                    var a = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
                    a.href = canvas.toDataURL('image/png');  //将画布内的信息导出为png图片数据
                    a.download = fileName+".png";  //设定下载名称
                    document.body.appendChild(a);
                    a.click(); //点击触发下载
                    document.body.removeChild(a);
                }
            }

            if(image.complete|| (!!window.ActiveXObject || "ActiveXObject" in window)) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
                //console.log("image.complete|| IE11");
                tempFunc();
                return;// 直接返回，不用再处理onload事件
            }
            image.onload=function(){
                //console.log("image.onload");
                tempFunc();
            };
        },
        width: width,
        height: height
    });
}
