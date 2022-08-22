/**
 * 配置文件说明
 * @type {string}
 * cubeUI.language: 消息提示框的中文提示，可根据情况调整
 *
 */
/* 静态演示中获取contextPath，动态演示非必须 开始 */

if(!$.locale){

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

}

var contextPath = "/cubeui";
var remoteHost = "http://localhost:8080";
if (navigator.onLine) {
}
var firstPathName = window.location.pathname.split("/")[1];

/* 静态演示中获取contextPath，动态演示非必须 结束 */

var myConfig = {
	li1:"",
    config: {
        pkName: 'uuid', //数据表主键名，用于批量提交数据时获取主键值
        singleQuotesParam: true, //是否对批量提交表格选中记录的参数值使用单引号，默认为false，true:'123','456'，false:123,456
        datagrid: {
            page: 'page', //提交到后台的显示第几页的数据
            size: 'rows', //提交到后台的每页显示多少条记录
            total: 'total', //后台返回的总记录数参数名
            rows: 'rows' //后台返回的数据行对象参数名
        },
        postJson: false, //提交表单数据时以json或x-www-form-urlencoded格式提交，true为json，false为urlencoded
        appendRefererParam: false, //自动追加来源页地址上的参数值到弹出窗口的href或表格的url上，默认为false不追加
        statusCode: {
            success: 200, //执行成功返回状态码
            failure: 300 //执行失败返回状态码
        }
    },
    language: {
        message: {
            title: {
                operationTips: $.locale.title.alert_title,
                confirmTips: $.locale.title.confirm_title
            },
            msg: {
                success: $.locale.message.processing_ok,
                failed: $.locale.message.processing_fail,
                error: $.locale.message.error,
                checkSelfGrid: $.locale.message.checkSelfGrid,
                selectSelfGrid: $.locale.message.selectSelfGrid,
                selectParentGrid: $.locale.message.selectParentGrid,//"请先选中主表中要操作的一条数据",
                permissionDenied: $.locale.message.permissionDenied,//"对不起，你没有操作权限",
                confirmDelete: $.locale.message.confirmDelete,//"你确定要删除所选的数据吗？",
                confirmMsg: $.locale.message.confirmMsg,//"确定要执行该操作吗？"
                unSelect: $.locale.message.unselected,
                singleSelect: $.locale.message.singleSelect,
                noData: $.locale.message.noData,
            }
        },
        edatagrid: {
            destroyMsg: {
                norecord: {
                    title: $.locale.title.alert_title,
                    msg: $.locale.message.noselected
                },
                confirm: {
                    title: $.locale.title.confirm_title,
                    msg: $.locale.message.confirmDelete
                }
            }
        }
    },
}
