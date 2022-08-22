function loadOrchestrators(){
    let node = local_node;

    $(function(){
        $("#orchestratorsDg").iDatagrid({
            idField: 'ID',
            sortOrder:'asc',
            sortName:'Id',
            pageSize:50,
            frozenColumns:[[
                {field: 'ID', title: '', checkbox: true},
                {field: 'op', title: '操作', sortable: false, halign:'center',align:'left',
                    width1: 100, formatter:orchestratorsOperateFormatter},
                {field: 'Id', title: 'ID', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 220},
                {field: 'Name', title: 'Name', sortable: true,
                    formatter:$.iGrid.buildformatter([$.iGrid.templateformatter('{Name}'), $.iGrid.tooltipformatter()]),
                    width: 140},
            ]],
            onBeforeLoad:function (param){
                refreshOrchestrators(param)
            },
            columns: [[
                {field: 'Description', title: 'DESCRIPTION', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 300},
                {field: 'ServiceCount', title: 'SERVICE COUNT', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 170},
                {field: 'Createtime', title: 'CREATETIME', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),width: 260}
            ]]
        });
    });
}

function orchestratorsOperateFormatter(value, row, index) {
    let htmlstr = "";
    htmlstr += '<button class="layui-btn-blue layui-btn layui-btn-xs" onclick="updateOrchestrators(\'' + row.ID + '\')">修改仓库</button>';
    htmlstr += '<button class="layui-btn-gray layui-btn layui-btn-xs" onclick="removeOrchestrators(\'' + row.ID + '\')">删除仓库</button>';
    return htmlstr;
}


function refreshOrchestrators(param){

    let pageSize = $.docker.utils.getPageRowsFromParam(param);
    let skip = $.docker.utils.getSkipFromParam(param);

    //let node = $.v3browser.menu.getCurrentTabAttachNode();
    let node = local_node;
    // 仓库的密码基于安全考虑，仅仅只能做本地保存，不能入数据库

    $.docker.request.repos.list(function (response) {
        $('#orchestratorsDg').datagrid('loadData', {
            total: response.total,
            rows: response.list
        })
    }, node);
}

function createOrchestrators(){
    updateOrchestratorsDlg({});
}

function removeOrchestrators(id){
    if(id==null){
        let rows = $('#orchestratorsDg').datagrid('getChecked');

        if(rows.length>1){
            $.app.show('本版本仅支持选择一个编排任务删除');
            return ;
        }

        if(rows.length==0){
            $.app.show('请选择一个编排任务删除');
            return;
        }else{
            id = rows[0].ID;
        }
    }

    $.app.confirm("删除编排任务信息", "您确定要删除所选择的编排任务信息？",function () {

        let node = local_node;
        $.docker.request.repos.delete(function (data) {
            $.app.show("删除编排任务信息成功");
            reloadDg();
        }, node, id);
    })

}

function updateOrchestrators(id){
    if(id==null){
        let rows = $('#orchestratorsDg').datagrid('getChecked');

        if(rows.length>1){
            $.app.show('本版本仅支持选择一个从编排任务修改');
            return ;
        }

        if(rows.length==0){
            $.app.show('请选择一个编排任务修改');
            return;
        }else{
            id = rows[0].ID;
        }
    }
    let node = local_node;
    $.docker.request.repos.all(function (data, map) {
        let orchestratorData = map[id];
        if(orchestratorData==null){
            $.app.show('编排任务不存在，请刷新后再重新编辑')
            return false;
        }

        updateOrchestratorsDlg(orchestratorData);

    }, node);
}

function updateOrchestratorsDlg(orchestratorData){

    let showFn = function(row){

        let title = '';
        let isAdd = true;
        if(orchestratorData == null || orchestratorData.ID == null){
            orchestratorData = {};
            title = "添加编排任务";
        }else{
            title = "修改编排任务{0}".format(orchestratorData.Name);
            isAdd = false;
        }

        $('#layout').layout('remove', 'east');

        let east_layout_options = {
            region:'east',
            split:false,border:false,width:'100%',collapsed:true,
            fit:true,
            iconCls:'fa fa-info-circle',
            collapsible:false,
            showHeader1:false,
            titleformat:title, title:'服务信息',
            headerCls:'border_right',bodyCls:'border_right',
            // footerHtml:$.templates(service_panel_footer_html).render(rowData),
            render:function (panel, option) {

                let html = './add_orchestrator.html';

                if(!orchestratorData.updated)
                    html = './add_orchestrator.html';

                $.docker.getHtml(html, null,function (html) {
                    let cnt = $($.templates(html).render(orchestratorData));
                    panel.append(cnt);
                    $.parser.parse(cnt);
                    $('#orchestrator_main_layout').iLayout();

                    if(orchestratorData.updated){
                    }

                    loadTreeDg(orchestratorData);
                })
            }
        }

        $.docker.utils.ui.showSlidePanel($('#layout'), east_layout_options)
        let opts = $.iLayout.getLayoutPanelOptions('#layout',  'east');
        console.log(opts)
    }

    showFn(orchestratorData);
}

function reloadDg(){
    $('#orchestratorsDg').datagrid('reload');
    $('#layout').layout('resize');
}

function onActivated(opts, title, idx){
    console.log('Image onActivated')
    reloadDg();
    //refreshCharts();
}
