if ($.fn.pagination) {
    $.fn.pagination.defaults.beforePageText = '第';
    $.fn.pagination.defaults.afterPageText = '共{pages}页';
    $.fn.pagination.defaults.displayMsg = '显示{from}到{to},共{total}记录';
}
if ($.fn.datagrid) {
    $.fn.datagrid.defaults.loadMsg = '加载中，请稍候...';
}
if ($.fn.treegrid && $.fn.datagrid) {
    $.fn.treegrid.defaults.loadMsg = $.fn.datagrid.defaults.loadMsg;
}
if ($.messager) {
    $.messager.defaults.ok = '确定';
    $.messager.defaults.cancel = '取消';
}
$.map(['iValidatebox', 'iTextbox', 'iPasswordbox', 'iFilebox', 'iSearchbox',
    'iCombo', 'iCombobox', 'iCombogrid', 'iCombotree', 'iCombotreegrid',
    'iDatebox', 'iDatetimebox', 'iTagbox', 'iNumberbox',
    'iSpinner', 'iNumberspinner', 'iTimespinner', 'iDatetimespinner'], function (plugin) {
    var _plugin = plugin.toLowerCase().substr(1);
    if ($.fn[_plugin]) {
        $.fn[_plugin].defaults.missingMessage = '必填';
    }
    if ($.fn[plugin]) {
        $.fn[plugin].defaults.missingMessage = '必填';
    }
});
$.map(['iValidatebox', 'iTextbox', 'iPasswordbox', 'iFilebox', 'iSearchbox',
    'iCombo', 'iCombobox', 'iCombogrid', 'iCombotree', 'iCombotreegrid',
    'iDatebox', 'iDatetimebox', 'iTagbox', 'iNumberbox',
    'iSpinner', 'iNumberspinner', 'iTimespinner', 'iDatetimespinner', 'iLinkbutton', 'iSwitchbutton'], function (plugin) {
    var _plugin = plugin.toLowerCase().substr(1);
    if ($.fn[_plugin]) {
        $.fn[_plugin].defaults.height = 30;
    }
    if ($.fn[plugin]) {
        $.fn[plugin].defaults.height = 30;
    }
});
if ($.fn.validatebox) {
    $.fn.validatebox.defaults.rules.email.message = '请输入有效的电子邮件地址';
    $.fn.validatebox.defaults.rules.url.message = '请输入有效的URL地址';
    $.fn.validatebox.defaults.rules.length.message = '输入内容长度必须介于{0}和{1}之间';
    $.fn.validatebox.defaults.rules.remote.message = '请修正该字段';
}
if ($.fn.calendar) {
    $.fn.calendar.defaults.weeks = ['日', '一', '二', '三', '四', '五', '六'];
    $.fn.calendar.defaults.months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
}
if ($.fn.datebox) {
    $.fn.datebox.defaults.currentText = '今天';
    $.fn.datebox.defaults.closeText = '关闭';
    $.fn.datebox.defaults.okText = '确定';
    $.fn.datebox.defaults.formatter = function (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
    };
    $.fn.datebox.defaults.parser = function (s) {
        if (!s) return new Date();
        var ss = s.split('-');
        var y = parseInt(ss[0], 10);
        var m = parseInt(ss[1], 10);
        var d = parseInt(ss[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
            return new Date(y, m - 1, d);
        } else {
            return new Date();
        }
    };
}
if ($.fn.datetimebox && $.fn.datebox) {
    $.extend($.fn.datetimebox.defaults, {
        currentText: $.fn.datebox.defaults.currentText,
        closeText: $.fn.datebox.defaults.closeText,
        okText: $.fn.datebox.defaults.okText
    });
}
if ($.fn.datetimespinner) {
    $.fn.datetimespinner.defaults.selections = [[0, 4], [5, 7], [8, 10], [11, 13], [14, 16], [17, 19]]
}

//自定义汉化信息
if ($.fn.panel) {
    $.fn.dialog.defaults.loadingMessage = "";
}
if ($.fn.edatagrid) {
    $.fn.edatagrid.defaults.loadMsg = "加载中，请稍候...";
}
if ($.fn.datagrid && $.fn.datagrid.defaults && $.fn.datagrid.defaults.operators.nofilter) {
    $.fn.datagrid.defaults.operators.nofilter.text = "无";
    $.fn.datagrid.defaults.operators.contains.text = "包含";
    $.fn.datagrid.defaults.operators.equal.text = "=等于";
    $.fn.datagrid.defaults.operators.notequal.text = "!=不等于";
    $.fn.datagrid.defaults.operators.beginwith.text = "^=以*开始";
    $.fn.datagrid.defaults.operators.endwith.text = "$=以*结束";
    $.fn.datagrid.defaults.operators.less.text = "<小于";
    $.fn.datagrid.defaults.operators.lessorequal.text = "<=小于等于";
    $.fn.datagrid.defaults.operators.greater.text = ">大于";
    $.fn.datagrid.defaults.operators.greaterorequal.text = ">=大于等于";
}

if ($.fn.combogrid) {
    $.fn.combogrid.defaults.loadMsg = "加载中，请稍候...";
}

if ($.fn.combotreegrid) {
    $.fn.combotreegrid.defaults.loadMsg = "加载中，请稍候...";
}

/* CubeUI属性 */
$.locale={
	title:{
		info_title:'温馨提示',
		import_title:'数据导入',
		upload_title:'文件批量上传',
		uploadfile_title:'文件上传',
		filename_title:'文件名称',
		filemd5_title:'文件验证',
		filesize_title:'文件大小',
		fileprogress_title:'上传进度',
		filestate_title:"上传状态",
		alert_title:"操作提示",
		confirm_title:"操作确认",
		addoredit_title:"新增/编辑",
	},
	label:{
		start_import:'开始导入',
		close:'关闭',
		file_browser:'选择文件',
		start_upload:'开始上传',
		file_remove:'移除文件',
		upload_waiting:"等待上传",
		upload_ok:"上传成功",
		upload_fail:"上传失败",
		select:"选择",
		select_picture:"选择图片",
	},
	message:{
		fast_oper:'操作过快，请稍后重试！',
		getting_data:'获取数据中.....',
		processing_data:'正在处理数据中...',
		condition_invalid:'查询条件输入不符合要求，请确认输入后重试！',
		processing_ok:'操作成功',
		processing_fail:'操作失败！未知错误，请重试！',
		error:"未知错误",
		noFile:"没有上传的文件!",
		noselected:"没有选中要操作的记录！",
		unselected:"请先选择要操作的数据",
        singleSelect: "只能选择一条要操作的数据",
		checkSelfGrid: "请先勾选要操作的数据",
		selectSelfGrid: "请先选中要操作的一条数据",
		selectParentGrid: "请先选中主表中要操作的一条数据",
		permissionDenied: "对不起，你没有操作权限",
		confirmDelete: "你确定要删除所选的数据吗？",
		confirmMsg: "确定要执行该操作吗？",
		noData: "没有查询到数据",
		selectNode:"请展开选择子节点！",
		charts_error:"获取图表数据失败!",
		noallow_upload:"不允许上传此类文件!。<br>操作无法进行,如有需求请联系管理员",
		upload_error_info1:"上传的单个文件不能大于", 
		upload_error_info2:"。<br>操作无法进行,如有需求请联系管理员",
		selectrecord:"请先选中一条主表数据！",
		nosame:"两次输入的内容不一致",
		nomobile:"请输入有效的手机号码",
		nophone:"请输入有效的电话号码",
		nolength:"输入内容长度必须小于{0}",
		minlength:"输入内容长度必须大于{0}",
		noidcard:"请输入正确的身份证号",
		nozipcode:"请输入正确的邮政编码",
		nodate:"请输入正确的日期",
		alphaDash:"输入内容只能是数字、字母、下划线或横线",
		alphaNum:"输入内容只能是数字和字母",
		nonumber:"输入内容只能是数字",
	}
}

/**
defaultConfig.language.message.title={

}

defaultConfig.language.message.msg={

}
**/