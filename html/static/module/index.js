// 首页加载完后，取消加载中状态
$(window).load(function () {
    $("#loading").fadeOut();
});

var isFullScreen = false;

var App = function () {
    var setFullScreen = function () {
        var docEle = document.documentElement;
        if (docEle.requestFullscreen) {
            //W3C
            docEle.requestFullscreen();
        } else if (docEle.mozRequestFullScreen) {
            //FireFox
            docEle.mozRequestFullScreen();
        } else if (docEle.webkitRequestFullScreen) {
            //Chrome等
            docEle.webkitRequestFullScreen();
        } else if (docEle.msRequestFullscreen) {
            //IE11
            docEle.msRequestFullscreen();
        } else {
            $.iMessager.alert(message.core.kind_warning, message.core.notsupport_fullscreen, 'messager-warning');
        }
    };

    //退出全屏 判断浏览器种类
    var exitFullScreen = function () {
        // 判断各种浏览器，找到正确的方法
        var exitMethod = document.exitFullscreen || //W3C
            document.mozCancelFullScreen ||    //Chrome等
            document.webkitExitFullscreen || //FireFox
            document.msExitFullscreen; //IE11
        if (exitMethod) {
            exitMethod.call(document);
        }
        else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
    };

    return {
        init: function () {

        },
        handleFullScreen: function () {
            if (isFullScreen) {
                exitFullScreen();
                isFullScreen = false;
            } else {
                setFullScreen();
                isFullScreen = true;
            }
        }
    };
};

$(function () {
    $(".collapseMenu").on("click", function () {
        var p = $("#index_layout").iLayout("panel", "west")[0].clientWidth;
        if (p > 0) {
            $('#index_layout').iLayout('collapse', 'west');
            $(this).children('span').removeClass('fa-chevron-circle-left').addClass('fa-chevron-circle-right');
        } else {
            $('#index_layout').iLayout('expand', 'west');
            $(this).children('span').removeClass('fa-chevron-circle-right').addClass('fa-chevron-circle-left');
        }
    });

    // 首页tabs选项卡
    var index_tabs = $('#index_tabs').iTabs({
        fit: true,
        onSelect:function(title,index){
        	let opts = $(this).tabs('getTab', index).panel('options');
        	$.app.debug(title + '  ' + index);
        	
        	if(opts.clickevent){
        		opts.clickevent = undefined;
        		return false;
        	}
        	
        	if(opts.navpath){
        		setMenuSelected.apply(this, opts.navpath);
        	}else{
                setMenuSelected.apply(this,['ALL',title])
            }

            try{
                console.log('selected panel(title='+title+', index='+ index +') is onActivated');

                let activatedParam = window.__activatedParam;

                if(opts.iframe){
                    let tab = $(this).tabs('getTab', index);
                    let w = tab.find('iframe')[0].contentWindow;

                    if(w.onActivated && $.isFunction(w.onActivated)){
                        w.onActivated.call(tab, opts, title, index, activatedParam);
                    }
                }else{
                    if(opts.onActivated && $.isFunction(opts.onActivated) ){
                        opts.onActivated.call(tab, opts, title, index, activatedParam);
                        $(this).tabs('getTab', index).panel('resize');
                    }else{
                        $(this).tabs('getTab', index).panel('resize');
                    }
                }

                delete window.__activatedParam;

            }catch (e) {
                console.error(e)
            }

        },
        tools: [{
            iconCls: 'fa fa-home',
            tip:message.core.label.home,
            handler: function () {
                $('#index_tabs').iTabs('select', 0);
            }
        }, {
            iconCls: 'fa fa-refresh',
            tip:message.core.label.refresh,
            handler: function () {
            	

				/**
                $.app.getJson(contextpath + '/passport/heartbeat', null, function(data, status, xhr){
                	var status = data.status;

                	if(status==1){

                		var refresh_tab = $('#index_tabs').iTabs('getSelected');
                		var opts = $.data(refresh_tab[0], 'panel').options;

                		if (opts.iframe) {
                			var refresh_iframe = refresh_tab.find('iframe')[0];
                			refresh_iframe.contentWindow.location.href = refresh_iframe.src;
                		}else{
                			$(refresh_tab[0]).panel('refresh');
                		}

                	}else{
                		$.app.onSessionTime(xhr);
                	}

                });
                **/

				var refresh_tab = $('#index_tabs').iTabs('getSelected');
                		var opts = $.data(refresh_tab[0], 'panel').options;

                		if (opts.iframe) {
                			var refresh_iframe = refresh_tab.find('iframe')[0];
                			refresh_iframe.contentWindow.location.href = refresh_iframe.src;
                		}else{
                			$(refresh_tab[0]).panel('refresh');
                		}

                /*
                var refresh_tab = $('#index_tabs').iTabs('getSelected');
                var refresh_iframe = refresh_tab.find('iframe')[0];
                refresh_iframe.contentWindow.location.href = refresh_iframe.src;
                */

                //$('#index_tabs').trigger(CubeUI.eventType.initUI.base);

                //var index = $('#index_tabs').iTabs('getTabIndex', $('#index_tabs').iTabs('getSelected'));
                //console.log(index);
                //$('#index_tabs').iTabs('getTab', index).iPanel('refresh');
            }
        }, {
            iconCls: 'fa fa-close',
            tip:message.core.label.close,
            handler: function () {
                var index = $('#index_tabs').iTabs('getTabIndex', $('#index_tabs').iTabs('getSelected'));
                var tab = $('#index_tabs').iTabs('getTab', index);
                if (tab.iPanel('options').closable) {
                    $('#index_tabs').iTabs('close', index);
                }else
            	{
                	$.app.show(message.core.kind_warning, message.core.not_closed);
            	}
            }
        }, {
            iconCls: 'fa fa-arrows-alt',
            tip:message.core.label.fullscreen,
            handler: function () {
                App().handleFullScreen();
            }
        }],
        //监听右键事件，创建右键菜单
        onContextMenu: function (e, title, index) {
            e.preventDefault();
            if (index >= 0) {
                $('#mm').iMenu('show', {
                    left: e.pageX,
                    top: e.pageY
                }).data("tabTitle", title);
            }
        }
    });

    //tab右键菜单
    $("#mm").iMenu({
        onClick: function (item) {
            tabMenuOprate(this, item.name);
        }
    });

    // 初始化accordion
    $("#RightAccordion").iAccordion({
        fit: true,
        border: false,
        onSelect:function (title,index){
            let allSelected = $("#RightAccordion").iAccordion('getSelections')
            $.each(allSelected, function (idx, p){
                let currentIndex = $('#RightAccordion').iAccordion('getPanelIndex', p);
                if(currentIndex != index)
                    $("#RightAccordion").iAccordion('unselect', currentIndex)
            });
        },
        onAdd:function (title,index) {
            let opt = $(this).iAccordion('getPanel', index).panel('options')


            if(opt.actionData!=null){
                console.log(title + ' ' + index + ' use click action')
                console.log(opt.actionData)

                let titleObj = $(this).iAccordion('getPanel', index).parent().find('.panel-header')

                $(titleObj).on('click', function (obj) {

                    $("#RightAccordion").iAccordion('select', index);
                    let node = opt.actionData
                    console.log(node)

                    if (node.url) {
                        /*if(typeof node.attributes != "object") {
                         node.attributes = $.parseJSON(node.attributes);
                         }*/
                        if(node.url.indexOf('javascript:')>=0)
                        {
                            var script = node.url.replace('javascript:','');
                            eval(script);
                        }else{
                            addTab(node);
                        }
                    }
                })
            }

        }
    });



    // 主页打开初始化时显示第一个系统的菜单
    initmodules();
    //$('.systemName').eq('0').trigger('click');
    //generateMenu(1325, "系统配置");
});

// Tab菜单操作
function tabMenuOprate(menu, type) {
    var allTabs = $('#index_tabs').iTabs('tabs');
    var allTabtitle = [];
    $.each(allTabs, function (i, n) {
        var opt = $(n).iPanel('options');
        if (opt.closable)
            allTabtitle.push(opt.title);
    });
    var curTabTitle = $(menu).data("tabTitle");
    var curTabIndex = $('#index_tabs').iTabs("getTabIndex", $('#index_tabs').iTabs("getTab", curTabTitle));
    switch (type) {
        case "1"://关闭当前
            if (curTabIndex > 0) {
                $('#index_tabs').iTabs("close", curTabTitle);
                return false;
                break;
            } else {
                $.app.show(message.core.kind_warning, message.core.not_home_closed);
                break;
            }
        case "2"://全部关闭
            for (var i = 0; i < allTabtitle.length; i++) {
                $('#index_tabs').iTabs('close', allTabtitle[i]);
            }
            $('#index_tabs').iTabs('scrollBy', 10);
            break;
        case "3"://除此之外全部关闭
            for (var i = 0; i < allTabtitle.length; i++) {
                if (curTabTitle != allTabtitle[i])
                    $('#index_tabs').iTabs('close', allTabtitle[i]);
            }
            $('#index_tabs').iTabs('scrollBy', 10);
            $('#index_tabs').iTabs('select', curTabTitle);
            break;
        case "4"://当前侧面右边
            for (var i = curTabIndex; i < allTabtitle.length; i++) {
                $('#index_tabs').iTabs('close', allTabtitle[i]);
            }

            $('#index_tabs').iTabs('select', curTabTitle);
            break;
        case "5": //当前侧面左边
            for (var i = 0; i < curTabIndex - 1; i++) {
                $('#index_tabs').iTabs('close', allTabtitle[i]);
            }
            $('#index_tabs').iTabs('scrollBy', 10);
            $('#index_tabs').iTabs('select', curTabTitle);
            break;
        case "6": //刷新

			var currentTab = $('#index_tabs').iTabs('getSelected');
			var opts = $.data(currentTab[0], 'panel').options;
			if (opts.iframe) {
				var currentIframe = currentTab.find('iframe')[0];
				currentIframe.contentWindow.location.href = currentIframe.src;
			} else {
				$(currentTab[0]).panel('refresh');
			}

			/**
            $.app.getJson(contextpath + '/passport/heartbeat', null, function(data, status, xhr){
            	var status = data.status;

            	if(status==1){

                    var currentTab = $('#index_tabs').iTabs('getSelected');
                    var opts = $.data(currentTab[0], 'panel').options;
                    if (opts.iframe) {
                        var currentIframe = currentTab.find('iframe')[0];
                        currentIframe.contentWindow.location.href = currentIframe.src;
                    } else {
                        $(currentTab[0]).panel('refresh');
                    }

            	}else{
            		$.app.onSessionTime(xhr);
            	}

            });
			**/
            break;
        case "7": //在新窗口打开
            var refresh_tab = $('#index_tabs').iTabs('getSelected');
            var refresh_iframe = refresh_tab.find('iframe')[0];
            window.open(refresh_iframe.src);
            break;
    }

}

//选项卡右键菜单
function findTabElement(target) {
    var $ele = $(target);
    if (!$ele.is("a")) {
        $ele = $ele.parents("a.menu_tab");
    }
    return $ele;
}

//保存页面id的field
var pageIdField = "data-pageId";

function getPageId(element) {
    if (element instanceof jQuery) {
        return element.attr(pageIdField);
    } else {
        return $(element).attr(pageIdField);
    }
}

function findTabTitle(pageId) {
    var $ele = null;
    $(".page-tabs-content").find("a.menu_tab").each(function () {
        var $a = $(this);
        if ($a.attr(pageIdField) == pageId) {
            $ele = $a;
            return false;//退出循环
        }
    });
    return $ele;
}

function getTabUrlById(pageId) {
    var $iframe = findIframeById(pageId);
    return $iframe[0].contentWindow.location.href;
}

function getTabUrl(element) {
    var pageId = getPageId(element);
    getTabUrlById(pageId);
}

function findTabPanel(pageId) {
    var $ele = null;
    $("#index_tabs").find("div.tab-pane").each(function () {
        var $div = $(this);
        if ($div.attr(pageIdField) == pageId) {
            $ele = $div;
            return false;//退出循环
        }
    });
    return $ele;
}

function findIframeById(pageId) {
    return findTabPanel(pageId).children("iframe");
}

function getActivePageId() {
    var $a = $('.page-tabs-content').find('.active');
    return getPageId($a);
}

//激活Tab,通过id
function activeTabByPageId(pageId) {
    $(".menu_tab").removeClass("active");
    $("#index_tabs").find(".active").removeClass("active");
    //激活TAB
    var $title = findTabTitle(pageId).addClass('active');
    findTabPanel(pageId).addClass("active");
    // scrollToTab($('.menu_tab.active'));
    scrollToTab($title[0]);
}

/**
 * 更换页面风格
 * @param themeName
 */
function changeTheme(themeName) {/* 更换主题 */
    var $dynamicTheme = $('#dynamicTheme');
    var themeHref = $dynamicTheme.attr('href');
    var themeHrefNew = themeHref.substring(0, themeHref.indexOf('themes')) + 'themes/default/cubeui.' + themeName + '.css';
    // 更换主页面风格
    $dynamicTheme.attr('href', themeHrefNew);

    // 更换iframe页面风格
    var $iframe = $('iframe');
    if ($iframe.length > 0) {
        for (var i = 1; i < $iframe.length; i++) {
            var ifr = $iframe[i];
            var $iframeDynamicTheme = $(ifr).contents().find('#dynamicTheme');
            var iframeThemeHref = $iframeDynamicTheme.attr('href');
            if (iframeThemeHref != undefined) {
                var iframeThemeHrefNew = iframeThemeHref.substring(0, iframeThemeHref.indexOf('themes')) + 'themes/default/cubeui.' + themeName + '.css';
                $iframeDynamicTheme.attr('href', iframeThemeHrefNew);
            }
        }
    }

    $.cookie('themeName', themeName, {
        expires: 7,
        path: '/'
    });
};

/**
if ($.cookie('themeName')) {
    changeTheme($.cookie('themeName'));
}else{
	changeTheme('bluelight');
}
**/
// 退出系统
function logout() {

	/**
	$.app.confirm(message.core.login.comfirm_logout, function (r) {
		$.app.get(contextpath+'/passport/logout',
        		null, function(){
        	window.location.href = contextpath + '/passport/login';
        }, null, message.core.login.logouting);
    });
	**/

	$.app.confirm(message.core.login.comfirm_logout, function (r) {
		$.app.get(contextpath + '/logout',null
            , function(){
        	window.location.href = contextpath + '/login.html';
        });

        $.app.localStorage.remove(window.app.clientId+'.token');
        $.app.localStorage.remove(window.app.clientId+'.permissions');
        $.app.localStorage.remove(window.app.clientId+'.permissions');
        $.app.localStorage.remove(window.app.clientId+'.userid');
        $.app.localStorage.remove(window.app.clientId+'.token');
        $.app.localStorage.remove(window.app.clientId+'.tokenType');
    });


}

$.index = {};
$.index.modules = [];

function initmodules(){

}

function getCurrentTab(){
	var index_tabs = $('#index_tabs');
	if(index_tabs.isNull()){
		index_tabs = parent.$('#index_tabs');
	}

	if(index_tabs.isNull()){
		$.app.err('not found #index_tabs');
		return undefined;
	}

	var tab = index_tabs.iTabs('getSelected');
	return tab;
}

function closeTab(titleOrIndex){
	var index_tabs = $('#index_tabs');

	if(index_tabs.isNull()){
		index_tabs = parent.$('#index_tabs');
	}

	if(index_tabs.isNull()){
		$.app.err('not found #index_tabs');
		return false;
	}

	if(index_tabs.iTabs('exists', titleOrIndex))
		index_tabs.iTabs('close', titleOrIndex);
}

function closeCurrentTab(){
	var index_tabs = $('#index_tabs');

	if(index_tabs.isNull()){
		index_tabs = parent.$('#index_tabs');
	}

	if(index_tabs.isNull()){
		$.app.err('not found #index_tabs');
		return false;
	}

	var tab = index_tabs.iTabs('getSelected');
	var index = index_tabs.iTabs('getTabIndex',tab);
	index_tabs.iTabs('close', index);
}

function setMenuSelected(navtitle, iaccordtitle, menutitle, submenutitle){
	arguments = Array.prototype.slice.call(arguments);

	var systemname = $('.systemName');
	var selected = -1;
	for(var idx = 0 ; idx < systemname.length; idx ++){
		var current = $(systemname[idx]);
		var title = current.find('span:last').text()||'';

		if(title == navtitle){
			selected = idx;

			if(!current.hasClass('selected'))
				current.trigger('click');

			break;
		}
	}

	if(selected<0){
		$.app.err('can not find nav item with ' + navtitle);
	}

	if(arguments.length==1){
		return 1;
	}

	var allPanel = null;
    try{
        allPanel = $("#RightAccordion").iAccordion('panels');
    }catch (e) {
        return ;
    }


	selected = -1;

	for(var idx = 0 ; idx < allPanel.length; idx ++){
		var current = $(allPanel[idx]);
		var title = current.panel('options').title || '' ;
        var titleId = current.panel('options').titleId || '' ;

        let temp = $('<span></span>')
        let t1 = temp.html(title).text();
        let t2 = temp.html(iaccordtitle).text();


		if(title == iaccordtitle || (titleId && titleId!='' && titleId == iaccordtitle) || t1 == t2){
			selected = idx;
			//current.trigger('click');
			$("#RightAccordion").iAccordion('select', idx);

			var treeobj = current.find('ul');

			break;
		}
	}

	if(selected<0){
		$.app.err('can not find accordion item with ' + navtitle);
		return -1;
	}

	if(!treeobj || treeobj.isNull()){
		$.app.err('can not find tree object with ' + navtitle);
		return -1;
	}

	if(arguments.length==2){
		return 1;
	}

	var nodes = $(treeobj).tree('getRoots');

	for(var levelindx = 0; levelindx < arguments.length-2; levelindx ++){
		var wantmenutitle = arguments[2+levelindx];

		if(nodes.length==0){
			$.app.err('can not find tree parent node with ' + wantmenutitle);
			return -1;
		}

		selected = -1;

		for(var idx = 0 ; idx < nodes.length; idx ++){
			var currentnode = nodes[idx];
			var nodedata = $(treeobj).tree('getData', currentnode.target);

			var title = nodedata.text ;

			if(title == wantmenutitle){
				selected = idx;
				//current.trigger('click');
				//$(treeobj).tree("expand",currentnode.target);
				//$(treeobj).tree("expand",currentnode.target);
				//var treeobj = current.find('ul');

				if(levelindx == arguments.length-3 && $(treeobj).tree('isLeaf',currentnode.target)){
                    try{
                        $(treeobj).tree('select',currentnode.target)
                    }catch (v){

                    }
				}else{
					$(currentnode.target).trigger('click');
				}

				break;
			}
		}

		if(selected<0){
			$.app.err('can not find tree menu with ' + wantmenutitle);
			return -1;
		}

		nodes = $(treeobj).tree('getChildren', currentnode.target);
	}

}

function triggerMenuClick(navtitle, iaccordtitle, menutitle, submenutitle, onAfterClick, refresh, param){
    
    window.__activatedParam = param;
    $.easyui.thread.sleep(function () {
        window.__activatedParam = undefined;
        delete window.__activatedParam;
    },2000);
    
	arguments = Array.prototype.slice.call(arguments);

	var systemname = $('.systemName');
	var selected = -1;
	for(var idx = 0 ; idx < systemname.length; idx ++){
		var current = $(systemname[idx]);
		var title = current.find('span:last').text()||'';

		if(title == navtitle){
			selected = idx;

			if(!current.hasClass('selected'))
				current.trigger('click');

			break;
		}
	}

	if(selected<0){
		$.app.err('can not find nav item with ' + navtitle);
	}

	if(arguments.length==1){
		return 1;
	}

	var allPanel = $("#RightAccordion").iAccordion('panels');

	selected = -1;

    let treeobj = null;

    let titleObj = null

	for(var idx = 0 ; idx < allPanel.length; idx ++){
		var current = $(allPanel[idx]);
		var title = current.panel('options').title || '' ;
        var titleId = current.panel('options').titleId || '' ;

		if(title == iaccordtitle || (titleId != '' && titleId==iaccordtitle) ){
			selected = idx;
			//current.trigger('click');
			$("#RightAccordion").iAccordion('select', idx);

            titleObj = $(current).parent().find('.panel-header')

            treeobj = current.find('ul');

			break;
		}
	}

	if(selected<0){
		$.app.err('can not find accordion item with ' + navtitle);
		return -1;
	}

	if(!treeobj || treeobj.isNull()){
		$.app.err('can not find tree object with ' + navtitle);
		return -1;
	}

	if(typeof(arguments[arguments.length-1])=='function'){
		onAfterClick = arguments.pop();
	}

	if(arguments.length==2 || arguments[2] == null){

        if(!$.isEmptyObject(titleObj)){
            titleObj.__param = param;
            titleObj.trigger('click');
        }
		return 1;
	}

	var nodes = treeobj.tree('getRoots');

	for(var levelindx = 0; levelindx < arguments.length-2; levelindx ++){
		var wantmenutitle = arguments[2+levelindx];

		if(nodes.length==0){
			$.app.err('can not find tree parent node with ' + wantmenutitle);
			return -1;
		}

		selected = -1;

		for(var idx = 0 ; idx < nodes.length; idx ++){
			var currentnode = nodes[idx];
			var nodedata = treeobj.tree('getData', currentnode.target);

			var title = nodedata.text ;
            var titleId = nodedata.titleId || '' ;

			if(title == wantmenutitle || (titleId != '' && titleId==wantmenutitle) ){
				selected = idx;
				//current.trigger('click');
				//$(treeobj).tree("expand",currentnode.target);
				//$(treeobj).tree("expand",currentnode.target);
				//var treeobj = current.find('ul');

				if(levelindx == arguments.length-3 && onAfterClick){
					currentnode.onAfterClick=onAfterClick;
				}

                let isOpen = isTabOpen(submenutitle)
                $(currentnode.target).__param = param;
				$(currentnode.target).trigger('click');

                if(isOpen && refresh){
                    if(!$.extends.isEmpty(submenutitle)){
                        refreshOpenTab(submenutitle)
                    }
                }

				break;
			}
		}

		if(selected<0){
			$.app.err('can not find tree menu with ' + wantmenutitle);
			return -1;
		}

		nodes = treeobj.tree('getChildren', currentnode.target);
	}
}

function createMenu(moduleId, systemName){

	$(".panel-header .panel-title:first").html(systemName);

    var allPanel = $("#RightAccordion").iAccordion('panels');
    var size = allPanel.length;
    if (size > 0) {
        for (i = 0; i < size; i++) {
            var index = $("#RightAccordion").iAccordion('getPanelIndex', allPanel[i]);
            $("#RightAccordion").iAccordion('remove', 0);
        }
    }

    var url = "./json/menu/menu_" + moduleId + "_all.json";

	//console.log(moduleId + ' : ' + systemName + ' : ' + url);

	var module = $.index.modules[moduleId];
	var data = module.children;

    $.each(data, function (i, e) {// 循环创建手风琴的项
        var treeid = i;
        var isSelected = i == 0 ? true : false;
		//console.log(e.text + ' : ' + e.id + ' : ' + e.iconCls + ' : ' + e.url + ' childrens: ' + e.children);
        let textId = e.textId || e.text

		if($.isEmptyObject(e.children)){



            e.navpath=[systemName, textId]

            $('#RightAccordion').iAccordion('add', {
                fit: false,
                actionData:e,
                title: e.text,
                titleId:textId,
                content: "<ul id='tree_" + treeid + "' ></ul>",
                border: false,
                //selected: isSelected,
                selected:isSelected,
                collapsible:false,
                iconCls: e.iconCls,
                onSelect:function (title,index) {
                    console.log(title + '  ' + index)
                }
            });
		}
		else{
			//var isSelected = i == 0 ? true : false;
			var isSelected = false;
			$('#RightAccordion').iAccordion('add', {
				fit: false,
				title: e.text,
                titleId:textId,
				content: "<ul id='tree_" + treeid + "' ></ul>",
				border: false,
				//selected: isSelected,
				selected:isSelected,
				iconCls: e.iconCls
			});

			$("#tree_" + treeid).tree({
                data: e.children,
                navpath:[systemName, e.text],
                lines: false,
                animate: true,
                onBeforeExpand: function (node, param) {

                    //$("#tree" + e.id).tree('options').url = "./json/menu/menu_" + node.id + ".json";
                },
                onClick: function (node) {

                    if (node.url) {
                        /*if(typeof node.attributes != "object") {
                         node.attributes = $.parseJSON(node.attributes);
                         }*/
                    	if(node.url.indexOf('javascript:')>=0)
                		{
                			var script = node.url.replace('javascript:','');
                			eval(script);
                		}else{
                			addTab(node);
                		}
                    } else {
                        if (node.state == "closed") {
                            //$("#tree" + e.id).tree('expand', node.target);
                        } else if (node.state == 'open') {
                            //$("#tree" + e.id).tree('collapse', node.target);
                        }
                    }
                }
            });

		}
    });
}

function isTabOpen(title){

    var t = $('#index_tabs');

    if (t.iTabs('exists', title)){
        return true
    }else{
        return false
    }
}

function refreshOpenTab(title){
    var t = $('#index_tabs');

    if (t.iTabs('exists', title)){
        t.iTabs('update', {
            tab: t.tabs('getTab', title),
            options: t.tabs('getTab', title).panel('options')
        });
        //t.tabs('getTab', title).panel('refresh')
        return true
    }else{
        return false
    }
}

function addNewTabByURL(title, url, options){
    let t = $('#index_tabs');

    if(t.iTabs('exists', opts.title)){
        //let tab = t.iTabs('getTab', title);  // get selected panel
        //t.iTabs('select', title);
        t.iTabs('close', title);
    }

    {
        let id = options.id || getRandomNumByDef();
        let iframe = '<iframe src="' + contextpath + url + '" scrolling="auto" frameborder="0" style="width:100%;height:100%;"></iframe>';

        var defaults = {
            id: id,
            refererTab: {},
            title: title,
            iframe: CubeUI.config.iframe,
            onlyInitParse: true,
            iconCls: 'fa fa-file-text-o',
            border: true,
            fit: true,
            closable: true
            //cls: 'leftBottomBorder'
        };

        let opts = $.extend(defaults, options);
        let ifOpts = opts.iframe ? {content: iframe} : {href: url};
        opts = $.extend(opts, ifOpts);

        t.iTabs('add', opts);
        $(t).iTabs('select', title);

        return tab;
    }
}

function addNewTab(title, html, options, fn){
    let t = $('#index_tabs');
    if(t.iTabs('exists', options.title)){
        let tab = t.iTabs('getTab', title);  // get selected panel
        //t.iTabs('select', title);

        if(t.panel('options').onCloseTab){
            t.panel('options').onCloseTab.call(tab);
        }

        t.iTabs('close', title);

        // if(fn){
        //     fn.call(tab, opt, 0)
        // }

        //return tab;
    }

    {
        let id = options.id || getRandomNumByDef();
        let defaults = {
            id: id,
            title: title,
            onlyInitParse: true,
            iconCls: 'fa fa-file-text-o',
            border: true,
            fit: true,
            selected:true,
            closable: true
        };

        let opts = $.extend(defaults, options);
        t.iTabs('add', opts);

        let tab = t.iTabs("getTab", title);

        let htmlObj = $(html);
        htmlObj.appendTo($(tab));
        $.parser.parse(htmlObj);

        $(tab).panel('resize');

        if(fn){
            fn.call(tab, opts, 1)
        }

        $(tab).iTabs('select', title)

        return tab;
    }
}

//打开Tab窗口
function addTab(params) {
    var t = $('#index_tabs');
    var $selectedTab = t.iTabs('getSelected');
    var selectedTabOpts = $selectedTab.iPanel('options');
    var iframe = '<iframe src="' + contextpath + params.url + '" scrolling="auto" frameborder="0" style="width:100%;height:100%;"></iframe>';

    var defaults = {
        id: getRandomNumByDef(),
        refererTab: {},
        title: params.text,
        iframe: CubeUI.config.iframe,
        onlyInitParse: true,
        iconCls: 'fa fa-file-text-o',
        border: true,
        fit: true,
        closable: true
        //cls: 'leftBottomBorder'
    };
    var opts = $.extend(defaults, params);
    var ifOpts = opts.iframe ? {content: iframe} : {href: params.url};
    opts = $.extend(opts, ifOpts);

    var needrefresh = false;
    needrefresh = params.attributes && params.attributes.REFRESH;

    if (t.iTabs('exists', opts.title) && (!needrefresh) ) {
        t.iTabs('select', opts.title);

        if(params.onAfterClick){
        	var fn = params.onAfterClick;
        	params.onAfterClick = undefined;
        	fn.call(this);

        }

    } else {
        var lastMenuClickTime = $.cookie("menuClickTime");
        var nowTime = new Date().getTime();
        if ((nowTime - lastMenuClickTime) >= 500) {
            $.cookie("menuClickTime", new Date().getTime());

			var currentnode = params;
			var nodepath = [];

			var treeobj = $(currentnode.target).closest('div.accordion-body').find('>ul')

            if(!treeobj.isNull()){
                let navpath = treeobj.tree('options').navpath;

                while(currentnode){
                    nodepath.push(currentnode.text);
                    currentnode = treeobj.tree('getParent', currentnode.target);
                }

                nodepath.reverse();
                opts.navpath = navpath.concat(nodepath);
            }else{
                opts.navpath = params.navpath;
            }

			opts.clickevent = true;

			if(t.iTabs('exists', opts.title)){
				var tab = t.iTabs('getTab', opts.title);  // get selected panel
				t.iTabs('update', {
						tab: tab,
						options:opts
					});
				t.iTabs('select', opts.title);
			}else{
				t.iTabs('add', opts);
			}

			if(params.onAfterClick){
				var fn = params.onAfterClick;
				params.onAfterClick = undefined;
				fn.call(this);
			}
        } else {
        	$.app.show(message.core.oper_too_fast);
        }
    }
}

function addParentTab(options) {
    var src, title;
    src = options.href;
    title = options.title;

    var iframe = '<iframe src="' + src + '" frameborder="0" style="border:0;width:100%;height:100%;"></iframe>';
    parent.$('#index_tabs').iTabs("add", {
        title: title,
        content: iframe,
        closable: true,
        iconCls: 'fa fa-th',
        border: true
    });
}

function modifyProfile() {
    var opts = {
        id: 'profileDialog',
        title: message.core.login.personal,
        width: 500,
        height: 300,
        iconCls: 'fa fa-info-circle',
        buttons: [{
            text: message.core.label.confirm,
            iconCls: 'fa fa-save',
            btnCls: 'cubeui-btn-green',
            handler: function () {
		      $.app.postForm(
                  V3_API_URL + '/user/profile',
				 '#profileDialog',
				 function(data) {
					if (data.status > 0) {
						$("#profileDialog").iDialog('close').form(
								'reset');

						if (data.status == 1)
							$.app.show(message.core.login.change_ok);
						else
							$.app.show(data.msg);
					} else {
						$.app.alert(data.msg);
					}
				})
            }
        }, {
            text: message.core.label.close,
            iconCls: 'fa fa-close',
            btnCls: 'cubeui-btn-red',
            handler: function () {
                $("#profileDialog").iDialog('close');
            }
        }]
    };

    $.app.openDialog(opts.id, contextpath + '/domain/modifyprofile.html', null, opts);
    //$('#' + opts.id).iDialog('openDialog', opts);
};

function showuserprofile(flag){
	if(flag==2)
		modifyPwd();
	else
		modifyProfile();
}

function showNotSupport(){
	showMsg('功能还在升级中......');
}

function showMsg(msg){
	$.app.warning(msg);
}

function modifyPwd() {
    var opts = {
        id: 'pwdDialog',
        title: message.core.login.changepwd,
        width: 500,
        height: 300,
        iconCls: 'fa fa-key',
        buttons: [{
            text: message.core.label.confirm,
            iconCls: 'fa fa-save',
            btnCls: 'cubeui-btn-green',
            handler: function () {
		      $.app.postForm(
                  V3_API_URL + '/user/pwd?id='+$.app.localStorage.getItem(window.app.clientId+'.userid', ''),
				 '#pwdDialog',
				 function(data) {
					if (data.status > 0) {
						$("#pwdDialog").iDialog('close').form(
								'reset');

						if (data.status == 0)
							$.app.show(message.core.login.changepwd_ok);
						else
							$.app.show(data.msg);
					} else {
						$.app.alert(data.msg);
					}
				})
            }
        }, {
            text: message.core.label.close,
            iconCls: 'fa fa-close',
            btnCls: 'cubeui-btn-red',
            handler: function () {
                $("#pwdDialog").iDialog('close');
            }
        }]
    };

    $.app.openDialog(opts.id, contextpath + '/domain/modifypwd.html', 'test=1', opts);
    //$('#' + opts.id).iDialog('openDialog', opts);
};

function showQuickscan(){
	$('#quickquery-div').show();
}

function hideQuickscan(){
	$('#quickquery-div').hide();
}

var ___keyhandler = $.extend(1, {}, $.fn.combogrid.defaults.keyHandler);

function setupQuickScan(url, mincharnum, opts){
	showQuickscan();
	
	if(mincharnum==null||mincharnum<=0)
		mincharnum = 1;
	
	var ___keyhandler = $.extend(1, {}, $.fn.combogrid.defaults.keyHandler);
	
	opts = $.extend(1, {
		prompt:'输入单号，快速查找',
    	idField:'ID',
    	hasDownArrow:false,
        width:240,
	       textField:'NAME',
	       mode:'remote',
	       onChange:function(nv, ov){},
	       onSelect:function(){},
	       panelWidth:500,
	       columns:[[
	               {field: 'NAME', title: '名称', width:150},
	               {field: 'NO', title: '编号', width:150}
	           ]]
	}, opts, {

	       onChange:function(nv, ov){},
	       onSelect:function(index,row){
	    	   $.easyui.debug.breakpoint(row);
	    	   opts.row = row;
	       },
	       onHidePanel:function(){
	    	    var r = opts.row;
   			
	   			if(r==null)
	   				$.easyui.debug.breakpoint('press entry without selected');
	   			else{
	   				$.easyui.debug.breakpoint('press entry with selected ' + r);
	   				
	
		    			if(opts.onquery){
		    				opts.onquery.call(this, r);
		    			}
	   			}
	   			
	   			opts.row = null;
	   			
	   			$(this).combogrid('clear');
	   			
	   			$(this).combogrid('grid').datagrid('removeAllRows');
	       },
	    	hasDownArrow:false,
	    	onBeforeLoad:function(param){
	    		var q = $.extends.isEmpty(param.q, '');
	    		
	    		if(q.length<mincharnum)
	    			return false;
	    		
	    		return true;
	    	},
	    	onLoadSuccess:$.easyui.event.wrap($.fn.datagrid.defaults.onLoadSuccess, function(data){
	    		if(opts.__querying){
		    		if($(this).datagrid('getRows').length>0){
		    			$(this).datagrid('selectRow', 0);
		    		}
		    		
		    		//this.querying = false;
	    		}
	    		
	    		opts.__querying = false;
	    		
	    	}),
	       keyHandler:{
	    	   	up: ___keyhandler.up,
	    		down: ___keyhandler.down,
	    		left: ___keyhandler.left,
	    		right: ___keyhandler.right,
	    		enter: function(e){
	    			
	    			if(opts.__querying==false){

		    			___keyhandler.enter.call(this, e);
		    			opts.row = $(this).combogrid('grid').datagrid('getSelected');
		    			//$(this).combogrid('hidePanel');
	    			}
	    			
	    		},
	    		query: function(q,e){
	    			opts.__querying = true;
	    			___keyhandler.query.call(this, q, e);
	    		}
	    	}
	});
	
	opts.url = url;
	
	$('#quickquery').combogrid(opts);
	
}

$(function(){
   $('#versioninfo').dblclick(function(){
       if(window.openDebugMode && $.isFunction(window.openDebugMode)){
           window.openDebugMode()
       }
   });
});


function show_term() {

    $.iDialog.openDialog({
        width: 1000,
        height: 600,
        title: "《条款说明》",
        href: 'https://erp-cdn.ginghan.com/public/cube/static/term/terms.html?1.0.0.23'
    });
}

function loadMenu(){

    var ps = {};

    $.app.get(V3_API_URL + '/user/menu', ps, function (data) {
        $.index.modules = data.data;

        var noshow = [];
        $.each($.index.modules, function (idx, val) {
            if (idx > 10)
                noshow.push(val.text);
            else {
                var tempnode = $($("#template001 tr").html());
                tempnode.attr("id", idx);
                tempnode.attr("title", val.text);
                tempnode.find('.label001 lable').addClass(val.iconCls);
                tempnode.find('.title001 span').text(val.text);
                $('#topmenucontent tr').append(tempnode);
            }
        });

        if ($.index.modules.length > 11) {
            $.app.info('菜单不能超过11个，共有' + $.index.modules.length + '个，菜单\'' + noshow.join(',') + '\'将不会显示');
        }


        // 绑定横向导航菜单点击事件
        $(".systemName").on("click", function (e) {
            createMenu($(this).attr("id"), $(this).attr("title"));
            $(".systemName").removeClass("selected");
            $(this).addClass("selected");
        });

        $('#topmenucontent .systemName').eq('0').trigger('click');

    });

    return ;
}
	
	
	


