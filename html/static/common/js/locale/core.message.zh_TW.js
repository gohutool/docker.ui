
ERROR_CODE = {
		'-10086':'服務器頁面({0})請求丟失',
		'-10000':'元素對象不存在',
		'-95555':'未授權相關的操作權限',
		'-99999':'未知服務器錯誤',
        '-18000':'服务器页面({0})请求失败，失败原因{1}'
		}


message.core = $.extend(message.core, {
	
	navigator_warning:'您的瀏覽器版本過低，請使用360安全瀏覽器的極速模式或IE9.0以上版本的瀏覽器',
	notsupport_fullscreen:'該瀏覽器不支持全屏',
	not_closed:'當前頁不允許關閉！',
	not_home_closed:'首頁不允許關閉！',
	oper_too_fast:'操作過快，請稍後重試！',
	info_title:'提示',
	kind_warning:'溫馨提示',
	
	label:{
		confirm:'確定',
		close:'關閉',
		home:'返回主頁',
		refresh:'刷新',
		fullscreen:'全屏',
		
		
		add:'新增',
		remove:'刪除',
		rollback:'撤銷',
		accept:'接受',
		reset:'重置',
		search:'查詢',
		more:'更多',
		
		filter_query:'過濾查詢',
	},
	
	info:{
		error_info_temp:'{0}，錯誤代碼{1}，請聯系系統管理員',
		loading_text: '頁面獲取中',
		loading_on:'努力加載中.......',
		timeout_msg:'登錄已經超時，請重新進行登錄',
		confirm_title:'確認提示',
		confirm_text:'確認提示信息',
		alert_title:'提示',
		alert_text:'提示信息',
		error_title:'錯誤',
		warn_title:'警告',
		info_title:'信息',
		show_title:'操作提示',
		show_error_title:'操作異常提示',
		show_text:'操作提示信息',
		getting_data:'獲取數據中......',
		in_processing:'操作中....',
		
		data_invalid:'輸入數據不符合格式要求，請確認後再次輸入',
		data_invalid2:'數據填寫不規範，請檢查填寫格式',
		data_invalid_4grid:'數據填寫未完成或者輸入不規範，請確認後再編輯其他項目數據',
		not_changed_4grid:'沒有單元格進行過編輯，無數據撤銷',
		not_changed:'數據表格沒有單元格進行了編輯',
		
		reject_confirm:'有{0}條數據進行了編輯，您確定撤銷？',
		save_confirm:'有{0}條數據已經進行了編輯，您確定保存？',
		remove_confirm:'您確認想要刪除這{0}條記錄嗎？',
		remove_without_selection:'未勾選需要刪除的數據行！',
		
		
		filter_invalid:'過濾查詢條件輸入不符合要求',
		
		leaving_confirm:'未提交的數據，離開系統後將可能不能進行保存',
		exit_confirm:'確認退出嗎?',
		
		
	},
	
	
	login:{
		error: '登錄賬號驗證中.....',
		logouting:'正在退出中...',
		comfirm_logout:'確定要退出嗎?',
		personal:'個人信息',
		change_ok:'個人信息修改成功',
		changepwd:'修改密碼',
		changepwd_ok:'個人密碼修改成功',
		login_title:'登錄系統',
		login_btn:'登錄',
		login_success:'登錄系統成功',
	}
	
	
});
