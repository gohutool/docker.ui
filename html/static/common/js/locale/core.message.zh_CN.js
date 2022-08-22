
ERROR_CODE = {
		'-10086':'服务器页面({0})请求丢失',
		'-10000':'元素对象不存在',
		'-95555':'未授权相关的操作权限',
		'-99999':'未知服务器错误',
        '-18000':'服务器页面({0})请求失败，失败原因{1}'
		}


message.core = $.extend(message.core, {
	
	navigator_warning:'您的浏览器版本过低，请使用360安全浏览器的极速模式或IE9.0以上版本的浏览器',
	notsupport_fullscreen:'该浏览器不支持全屏',
	not_closed:'当前页不允许关闭！',
	not_home_closed:'概览不允许关闭！',
	oper_too_fast:'操作过快，请稍后重试！',
	info_title:'提示',
	kind_warning:'温馨提示',
	
	label:{
		confirm:'确定',
		close:'关闭',
		home:'返回主页',
		refresh:'刷新',
		fullscreen:'全屏',
		
		
		add:'新增',
		remove:'删除',
		rollback:'撤销',
		accept:'接受',
		reset:'重置',
		search:'查询',
		more:'更多',
		
		filter_query:'过滤查询',
	},
	
	info:{
		error_info_temp:'{0}，错误代码{1}，请联系系统管理员',
		loading_text: '页面获取中',
		loading_on:'努力加载中.......',
		timeout_msg:'登录已经超时，请重新进行登录',
		confirm_title:'确认提示',
		confirm_text:'确认提示信息',
		alert_title:'提示',
		alert_text:'提示信息',
		error_title:'错误',
		warn_title:'警告',
		info_title:'信息',
		show_title:'操作提示',
		show_error_title:'操作异常提示',
		show_text:'操作提示信息',
		getting_data:'获取数据中......',
		in_processing:'操作中....',
		
		data_invalid:'输入数据不符合格式要求，请确认后再次输入',
		data_invalid2:'数据填写不规范，请检查填写格式',
		data_invalid_4grid:'数据填写未完成或者输入不规范，请确认后再编辑其他项目数据',
		not_changed_4grid:'没有单元格进行过编辑，无数据撤销',
		not_changed:'数据表格没有单元格进行了编辑',
		
		reject_confirm:'有{0}条数据进行了编辑，您确定撤销？',
		save_confirm:'有{0}条数据已经进行了编辑，您确定保存？',
		remove_confirm:'您确认想要删除这{0}条记录吗？',
		remove_without_selection:'未勾选需要删除的数据行！',
		
		
		filter_invalid:'过滤查询条件输入不符合要求',
		
		leaving_confirm:'未提交的数据，离开系统后将可能不能进行保存',
		exit_confirm:'确认退出吗?',
		
		
	},
	
	
	login:{
		error: '登录账号验证中.....',
		logouting:'正在退出中...',
		comfirm_logout:'确定要退出吗?',
		personal:'个人信息',
		change_ok:'个人信息修改成功',
		changepwd:'修改密码',
		changepwd_ok:'个人密码修改成功',
		login_title:'登录系统',
		login_btn:'登录',
		login_success:'登录系统成功',
	}
	
	
});