var cpage = 1; // 当前页面号
var tpage = 10;  // 总页面数

// 获取新闻评论评论
function showPageList(page,url,tableId,paginationId,rows) {
    $.ajax({
        type: "get",
        data: {},
        async: "false",
        url: url.replace("pageNum", page),
        success: function (info) {
            changeModel(info); // 更新局部页面
            var totalpage = Math.ceil(info.total/rows);
            if(totalpage == 0) totalpage = 1;
            var curtpage = page;
            if (curtpage && totalpage) {
                cpage = curtpage;
                tpage = totalpage;
            }
            showPagination(page, tpage, url, tableId, paginationId); //显示评论
        },
        error: function () {
            alert("加载失败！请稍后重试！");
        }
    });
}

/* curreentpage: 当前页面号； tpage: 总的页面数 */
//显示新闻评论
function showPagination(currentPage, totalPages, url, tableId, paginationId) {
    var options = {
        bootstrapMajorVersion: 3,
        currentPage: currentPage, //当前页面
        numberOfPages: 10,//一页显示几个按钮（在ul里面生成5个li）
        totalPages: totalPages, //总页数
        itemTexts: function (type, page, current) {
            switch (type) {
                case "first":
                    return "首页";
                case "prev":
                    return "上一页";
                case "next":
                    return "下一页";
                case "last":
                    return "末页";
                case "page":
                    return page;
            }
        },
        onPageClicked: function(e,originalEvent,type,page){
            e.stopImmediatePropagation();
            var currentTarget = $(e.currentTarget);
            var pages = currentTarget.bootstrapPaginator("getPages");
            // Ajax calling
            showPageList(page,url,tableId,paginationId);
            currentTarget.bootstrapPaginator("show",page);
            //updatePagesInfo($("#totalRecord").val(), page);
        },
        pageUrl: function(type, page, current){
            return tableId; //点击页码后，定位到锚点tableId的位置
            //return "#";
        }
    }
    $(paginationId).bootstrapPaginator(options);
}