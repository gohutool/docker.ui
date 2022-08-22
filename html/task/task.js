function loadLease(){

    $(function(){
        $("#tasksDg").iDatagrid({
            pagination:true,
            showHeader:true,
            showFooter:true,
            remoteSort:true,
            queryParams:{'desired-state':'running'},
            sortName:'SortField',
            sortOrder:'desc',
            pageSize:50,
            onBeforeLoad:function (param){
                refreshTasks(param);
            },
            group:{
                groupField:'SlotStr',
                groupFormatter:function (value, rows) {
                    var rtnStr = value + '({0})'.format(rows?rows.length:0);
                    // rtnStr += '<input type="checkbox" onclick="FGPCkbClick(this)" helpGPVal="' + value + '" name="gpChk" />';
                    // rtnStr += value + ' 单据数量=' + rows.length + '条';
                    return rtnStr;
                }
            },
            frozenColumns:[[
                {field: 'op', title: '操作', sortable: false, halign:'center',align:'left',
                    width1: 300, formatter:leaseOperateFormatter},
                {field: 'ID', title: 'ID', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),width: 250},
                {field: 'SlotStr', title: 'Slot',hidden:true, sortable: true,
                    formatter:$.iGrid.tooltipformatter(),width: 180},
                {field: 'SortField', title: 'SortField',hidden:true, sortable: true,
                    formatter:$.iGrid.tooltipformatter(),width: 180},
                {field: 'TaskName', title: 'NAME', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 160},
            ]],
            columns: [[
                {field: 'Image', title: 'Image', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),width: 180},
                {field: 'Hostname', title: 'Node', sortable: false,
                    formatter:$.iGrid.tooltipformatter(),width: 140},
                {field: 'NodeID', title: 'NodeID', sortable: false,
                    formatter:$.iGrid.tooltipformatter(),width: 160},
                {field: 'NodeName', title: 'NodeName', sortable: false,
                    formatter:$.iGrid.tooltipformatter(),width: 160},
                {field: 'DesiredState', title: 'DESIRED', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 100},
                {field: 'CurrentState', title: 'CURRENT', sortable: true,
                    formatter:relatedTaskStatusFormatter,
                    width: 250},
                {field: 'NetAddress', title: 'IP', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 200},
                {field: 'SVersion', title: 'Raft', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),width: 80},
                {field: 'Created', title: 'CREATED', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 170},
                {field: 'Updated', title: 'UPDATED', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 170},
                {field: 'LabelStr', title: 'Labels', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),width: 280}
            ]]
        })
    });
}

function relatedTaskStatusFormatter(value, row, index) {
    if(row.Status.State=='running'){
        return '<span class="label cubeui-row-label layui-bg-orange">{0}</span>'.format(value);
    }else{
        return value;
    }
}

function refreshAllServices(param){
    let pageSize = $.docker.utils.getPageRowsFromParam(param);
    let skip = $.docker.utils.getSkipFromParam(param);

    let node = local_node;

    $.docker.request.service.list(function (response) {
        setNetworkMap(function () {

            $('#tasklist-service').combogrid('grid').datagrid('loadData',
                {
                    total: response.total,
                    rows: response.list
                });

        }, node);

    }, node, skip, pageSize, param.mode, param.search_type, param.search_key, param.sort, param.order);
}

function refreshAllNodes(param){
    let pageSize = $.docker.utils.getPageRowsFromParam(param);

    let skip = $.docker.utils.getSkipFromParam(param);

    //let node = $.v3browser.menu.getCurrentTabAttachNode();
    let node = local_node;

    $.docker.request.node.list(function (response) {
        $('#tasklist-node').combogrid('grid').datagrid('loadData',
            {
                total: response.total,
                rows: response.list
            });
    }, node, skip, pageSize, param.role, param.membership, param.search_type, param.search_key, param.sort, param.order);
}

function refreshTasks(param){
    let pageSize = $.docker.utils.getPageRowsFromParam(param);
    let skip = $.docker.utils.getSkipFromParam(param);
    let node = local_node;

    setNetworkMap(function () {

        $.docker.request.service.all(function(all){

            let allServiceMap = {};
            $.each(all.list, function (idx, v) {
                allServiceMap[v.ID] = v;
            })

            $.docker.request.task.list(function (response) {

                $.each(response.list, function (idx, v) {
                    let service = allServiceMap[v.ServiceID];
                    v.SlotStr = (service?service.Name:"") + '.' + v.Slot;
                    v.TaskName = v.SlotStr;
                })

                $('#tasksDg').datagrid('loadData', {
                    total: response.total,
                    rows: response.list
                })

            }, node, skip, pageSize, param.service, param.nodeid, param['desired-state'], param.search_type, param.search_key, param.sort, param.order);

        }, node);
    }, node)

}

function leaseOperateFormatter(value, row, index) {
    let htmlstr = "";
    //superpowers
    if(row.Status.State=='running'){
        htmlstr += '<button class="layui-btn-yellowgreen layui-btn layui-btn-xs" onclick="inspectTask(\''+row.ID+'\', \'' + row.ID + '\')">查看</button>';
    }else{
        htmlstr += '<button class="layui-btn-brown layui-btn layui-btn-xs" onclick="inspectTask(\''+row.ID+'\', \'' + row.ID + '\')">查看</button>';
    }

    htmlstr += '<button class="layui-btn-orange layui-btn layui-btn-xs" onclick="logTask(\''+row.ID+'\', \'' + row.ID + '\')">日志</button>';

    return htmlstr;
}

function reloadDg(){
    $('#tasksDg').datagrid('reload');
    $('#layout').layout('resize');
}

function inspectTask(taskId){
    let node = local_node;
    $.docker.request.task.inspect(function (response) {

        $.docker.request.service.inspect(function (serviceData) {

            response.ServiceData = serviceData;
            response.SlotStr = response.ServiceData.Name + '.' + response.Slot;
            response.TaskName = v.SlotStr;
            showTaskPanel(response);

        }, node, response.ServiceID)

    }, node, taskId);
}


function showTaskPanel(rowData){

    let showFn = function(row){
        let rowData =  row;

        rowData.Name = row.Spec.Name;

        $('#tasklist-layout').layout('remove', 'east');

        let east_layout_options = {
            region:'east',
            split:false,border:false,width:'100%',collapsed:true,
            iconCls:'fa fa-info-circle',
            collapsible:false,
            showHeader1:false,
            titleformat:'任务信息-{0}'.format($.extends.isEmpty(rowData.SlotStr, rowData.ID)), title:'服务信息',
            headerCls:'border_right',bodyCls:'border_right',collapsible:true,
            footerHtml:`
         <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                    $('#tasklist-layout').layout('collapse', 'east');
            },
            btnCls: 'cubeui-btn-red',
            iconCls: 'fa fa-close'
        }">关闭</a>
        `.format(rowData.ID),
            render:function (panel, option) {
                $.docker.getHtml('./inspect-task.html', null, function(html){
                    let cnt = $($.templates(html).render(rowData));
                    panel.append(cnt);
                    $.parser.parse(cnt);
                })
            }
        }

        $.docker.utils.ui.showSlidePanel($('#tasklist-layout'), east_layout_options)
        let opts = $.iLayout.getLayoutPanelOptions('#tasklist-layout',  'east');
        console.log(opts)
    }


    showFn(rowData);

}

function onActivated(opts, title, idx, param){
    console.log('Task Page onActivated')
    console.log(param);
    reloadDg();
}
