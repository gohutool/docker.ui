function loadLease(){

    // let node = $.docker.menu.getCurrentTabAttachNode();
    let node = local_node;

    $(function(){
        $("#servicesDg").iDatagrid({
            idField: 'ID',
            sortOrder:'asc',
            sortName:'Id',
            pageSize:50,
            queryParams:{all1:1},
            frozenColumns:[[
                {field: 'ID', title: '', checkbox: true},
                {field: 'op', title: '操作', sortable: false, halign:'center',align:'left',
                    formatter:leaseOperateFormatter},
                {field: 'Name', title: 'NAME', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 160},
                {field: 'Id', title: 'SERVICEID', sortable: true,
                    width: 260},
            ]],
            onBeforeLoad:function (param){
                refreshServices(param)
            },
            columns: [[
                {field: 'Image', title: 'IMAGE', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 150},
                {field: 'Mode', title: 'MODE', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 100},
                {field: 'ReplicaStr', title: 'REPLICAS', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 80},
                {field: 'NetworkStr', title: 'NETWORKS', sortable: true,
                    formatter:networksFormatter,width: 140},
                {field: 'NWMode', title: 'NW Mode', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),width: 100},
                {field: 'PortStr', title: 'PORTS', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),width: 200},
                {field: 'SVersion', title: 'Raft', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),width: 80},
                {field: 'Created', title: 'CREATED', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 170},
                {field: 'Updated', title: 'UPDATED', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 170},
                {field: 'LabelStr', title: 'LABELS', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),width: 900},
            ]],
            onLoadSuccess:$.easyui.event.wrap(
                $.fn.iDatagrid.defaults.onLoadSuccess,
                function(data){
                    let dg = this;
                }
            ),
        });
    });
}

function leaseOperateFormatter(value, row, index) {
    let htmlstr = "";
    htmlstr += '<button class="layui-btn-yellowgreen layui-btn layui-btn-xs" onclick="inspectService(\'' + row.ID + '\')">查看</button>';
    htmlstr += '<button class="layui-btn-gray layui-btn layui-btn-xs" onclick="removeLease(\'' + row.ID + '\')">删除</button>';
    htmlstr += '<button title="查看服务日志" class="layui-btn-orange layui-btn layui-btn-xs" onclick="logService(\'' + row.ID + '\')">日志</button>';
    return htmlstr;
}

function createRelatedTaskOperateFormatter(id){
    return function (value, row, index) {
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
}

function inspectTask(taskId){
    let node = local_node;
    $.docker.request.task.inspect(function (response) {
        response.ServiceData = $('#relatedTasksDg').datagrid('options').serviceData;
        response.SlotStr = response.ServiceData.Name + '.' + response.Slot;
        response.TaskName = v.SlotStr;
        showTaskPanel(response);
    }, node, taskId);
}


function relatedTaskStatusFormatter(value, row, index) {

    if(row.Status.State=='running'){
       return '<span class="label cubeui-row-label layui-bg-orange">{0}</span>'.format(value);
    }else{
        return value;
    }
}

function removePanel(){
    $('#layout').layout('remove', 'east');
}

function refreshServices(param){
    let pageSize = $.docker.utils.getPageRowsFromParam(param);
    let skip = $.docker.utils.getSkipFromParam(param);
    //let node = $.v3browser.menu.getCurrentTabAttachNode();
    let node = local_node;

    $.docker.request.service.list(function (response) {
        setNetworkMap(function () {
            $('#servicesDg').datagrid('loadData', {
                total: response.total,
                rows: response.list
            })
            refreshImageAndContainerInfo();
        }, node);

    }, node, skip, pageSize, param.mode, param.search_type, param.search_key, param.sort, param.order);
}

function refreshServiceTasks(param){
    //let pageSize = $.docker.utils.getPageRowsFromParam(param);
    //let skip = $.docker.utils.getSkipFromParam(param);
    let node = local_node;
    let serviceId = param.id;

    setNetworkMap(function () {

        $.docker.request.service.inspect(function (serviceResponse) {

            $.docker.request.task.list(function (response) {
                $('#relatedTasksDg').datagrid('options').serviceData = serviceResponse;

                $.each(response.list, function (idx, v) {
                    v.SlotStr = serviceResponse.Name + '.' + v.Slot;
                    v.TaskName = v.SlotStr;
                })

                $('#relatedTasksDg').datagrid('loadData', {
                    total: response.total,
                    rows: response.list
                })

            }, node, 0, 0, serviceResponse.Name, null, param['desired-state'], param.search_type, param.search_key, param.sort, param.order);

        }, node, serviceId);
    }, node)

}

function refreshTasks(){
    $('#relatedTasksDg').datagrid('reload');
}

function removeLease(id, closePanel) {
    if($.extends.isEmpty(id)){
        let rows = $('#servicesDg').datagrid('getChecked');

        if(rows.length>1){
            $.app.show('本版本仅支持选择一个服务删除');
            return ;
        }

        if(rows.length==0){
            $.app.show('请选择一个服务删除');
            return;
        }else{
            id = rows[0].ID;
        }
    }

    let node = local_node;

    $.docker.utils.deleteConfirm('从SWARM集群里删除服务', '您确认要从SWARM里删除当前服务', function (param, closeFn){

        let node = local_node;
        $.docker.request.service.delete(function(response){
            $.app.show("从SWARM集群里删除服务成功".format(""));
            reloadDg();
            closeFn();

            if(closePanel){
                removePanel();
            }

        }, node, id, param.force==="1")
    }, null,false)
}

function reloadDg(){
    $('#servicesDg').datagrid('reload');
    $('#layout').layout('resize');
}

function createService(){
    let rowData = $.docker.request.service.buildNewRowData();
    rowData.updated = false;
    showServicePanel(rowData);
}

function saveService(){

    let node = local_node;

    if(!$('#createServiceForm').form('validate')){
        $('#eastTabs').tabs("select", 0);
    }else if(!$('#createServiceForm2').form('validate')){
        $('#eastTabs').tabs("select", 1);
    }else{
        let info = $.extends.json.param2json($('#createServiceForm').serialize());
        info = $.extend(info, $.extends.json.param2json($('#createServiceForm2').serialize()));

        let config = $.docker.request.service.buildNewRowData().Spec;
        config.Name = info.Name;

        if(info.Mode=="replicated"){
            config.Mode.Replicated.Replicas = info['Mode.Replicated.Replicas']*1;

            if(!$.extends.isEmpty(info['Mode.ReplicatedJob.MaxConcurrent']) || !$.extends.isEmpty(info['Mode.Replicated.TotalCompletions'])){
                config.Mode.ReplicatedJob = {};

                if(!$.extends.isEmpty(info['Mode.ReplicatedJob.MaxConcurrent'])){
                    config.Mode.ReplicatedJob.MaxConcurrent = info['Mode.ReplicatedJob.MaxConcurrent'];
                }
                if(!$.extends.isEmpty(info['Mode.ReplicatedJob.TotalCompletions'])){
                    config.Mode.ReplicatedJob.TotalCompletions = info['Mode.ReplicatedJob.TotalCompletions'];
                }
            }else{
                delete config.Mode.ReplicatedJob;
            }
        }else{
            config.Mode.Global = {};
            config.Mode.GlobalJob = {};
        }

        if(!$.extends.isEmpty(info['EndpointSpec.Mode'])){
            config.EndpointSpec.Mode = info['EndpointSpec.Mode']
        }

        let publishMode = $.docker.utils.convert2ListParamValue(info['service-cnt-endpoint-publish-mode']);
        let publishProtocol = $.docker.utils.convert2ListParamValue(info['service-cnt-endpoint-publish-protocol']);
        let publishPort = $.docker.utils.convert2ListParamValue(info['service-cnt-endpoint-publish-port']);
        let targetPort = $.docker.utils.convert2ListParamValue(info['service-cnt-endpoint-target-port']);

        if(!$.extends.isEmpty(publishMode)){
            config.EndpointSpec.Ports = [];
            $.each(publishMode, function (idx, v) {
                v = $.extends.isEmpty(v, "ingress");
                config.EndpointSpec.Ports.push({
                    Protocol:$.extends.isEmpty(publishProtocol[idx], "tcp"),
                    PublishedPort:publishPort[idx]*1,
                    PublishMode:v,
                    TargetPort:targetPort[idx]*1,
                })
            })
        }

        let attachName = $.docker.utils.convert2ListParamValue(info['service-cnt-network-attach-name']);
        let attachValue1 = $.docker.utils.convert2ListParamValue(info['service-cnt-network-attach-value']);
        let attachValue2 = $.docker.utils.convert2ListParamValue(info['service-cnt-network-attach-value2']);

        if(!$.extends.isEmpty(attachName)){
            config.Networks = [];
            $.each(attachName, function (idx, v) {
                config.Networks.push({
                    Target:v,
                    Aliases:attachValue1[idx].split2(" "),
                    DriverOpts: $.docker.utils.getKeyValue(attachValue2[idx].split2(";")),
                })
            })
        }

        //config.ReplicatedService  = {};
        //config.ReplicatedService.Mode = config.Mode;

        config.TaskTemplate.ContainerSpec.Image = info['TaskTemplate.ContainerSpec.Image'];


        if(!$.extends.isEmpty(info['Healthcheck.Test'])){
            config.TaskTemplate.ContainerSpec.HealthCheck = {};
            config.TaskTemplate.ContainerSpec.HealthCheck.Test = $.extends.isEmpty(info['TaskTemplate.ContainerSpec.HealthCheck.Test'], '').split2(" ");
            config.TaskTemplate.ContainerSpec.HealthCheck.Interval = $.extends.isEmpty(info['TaskTemplate.ContainerSpec.HealthCheck.Interval'], '0')*1;
            config.TaskTemplate.ContainerSpec.HealthCheck.Timeout = $.extends.isEmpty(info['TaskTemplate.ContainerSpec.HealthCheck.Timeout'], '0')*1;
            config.TaskTemplate.ContainerSpec.HealthCheck.Retries = $.extends.isEmpty(info['TaskTemplate.ContainerSpec.HealthCheck.Retries'], '0')*1;
            config.TaskTemplate.ContainerSpec.HealthCheck.StartPeriod = $.extends.isEmpty(info['TaskTemplate.ContainerSpec.HealthCheck.StartPeriod'], '0')*1;
        }

        console.log(info);


        if(!$.extends.isEmpty(info['TaskTemplate.ContainerSpec.LogDriver.Name'])){
            data.TaskTemplate.ContainerSpec.LogDriver = {};
            data.TaskTemplate.ContainerSpec.LogDriver.Name = $.extends.isEmpty(info['TaskTemplate.ContainerSpec.LogDriver.Name'], '');
            data.TaskTemplate.ContainerSpec.LogDriver.Options =
                $.docker.utils.buildOptsData($.docker.utils.convert2ListParamValue(info['service-cnt-log-driver-name']),
                    $.docker.utils.convert2ListParamValue(info['service-cnt-log-driver-value']))
        }

        config.Labels = $.docker.utils.buildOptsData($.docker.utils.convert2ListParamValue(info['service-opt-name']),$.docker.utils.convert2ListParamValue(info['service-opt-value']));
        config.TaskTemplate.Placement.Constraints = $.docker.utils.convert2ListParamValue(info['TaskTemplate.Placement.Constraints'])
        
        $.docker.request.service.create(function (response) {
            $.app.show("服务{0}已经创建成功".format(config.Name));
            reloadDg();
        }, node, config.Name, config);
    }
}

function inspectService(id){
    let node = local_node;

    $.docker.request.service.inspect(function (response){
        let rowData = response;
        rowData.updated = true;
        showServicePanel(rowData)
    }, node, id)
}

function showServicePanel(rowData){

    let showFn = function(row){
        let rowData =  row;

        rowData.Name = row.Spec.Name;

        $('#layout').layout('remove', 'east');

        let east_layout_options = {
            region:'east',
            split:false,border:false,width:'100%',collapsed:true,
            iconCls:'fa fa-info-circle',
            collapsible:false,
            showHeader1:false,
            titleformat:'SWARM服务信息-{0}'.format($.extends.isEmpty(rowData.Name, rowData.ID)), title:'服务信息',
            headerCls:'border_right',bodyCls:'border_right',collapsible:true,
            footerHtml:$.templates(service_panel_footer_html).render(rowData),
            render:function (panel, option) {

                let html = './inspect-service.html';

                if(!rowData.updated)
                    html = './create-service.html';

                $.docker.getHtml(html, null,function (html) {
                    let cnt = $($.templates(html).render(rowData));

                    panel.append(cnt);
                    $.parser.parse(cnt);

                    $('#eastTabs').tabs({
                        fit:true,
                        border:false,
                        bodyCls1:'border_right_none,border_bottom_none',
                        tabPosition1:'bottom',
                        narrow:true,
                        pill:true,
                    });

                    if(rowData.updated){
                        $('#relatedTasksDg').iDatagrid({
                            pagination:false,
                            showHeader:true,
                            showFooter:true,
                            remoteSort:false,
                            sortName:'SortField',
                            sortOrder:'desc',
                            queryParams: {id:rowData.ID},
                            onBeforeLoad:function (param){
                                refreshServiceTasks(param);
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
                                    width1: 300, formatter:createRelatedTaskOperateFormatter(rowData.ID)},
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
                    }
                })
            }
        }

        $.docker.utils.ui.showSlidePanel($('#layout'), east_layout_options)
        let opts = $.iLayout.getLayoutPanelOptions('#layout',  'east');
        console.log(opts)
    }

    let node = local_node;

    setNetworkMap(function () {
        if(!$.extends.isEmpty(rowData.NetworkStr)){
            rowData.NetworkStr = networksFormatter(rowData.NetworkStr, rowData);
        }


        if(rowData.Endpoint.VirtualIPs && !$.extends.isEmpty(rowData.Endpoint.VirtualIPs)){

            $.each(rowData.Endpoint.VirtualIPs, function (idx, v) {
                v.NetworkName = getNetworkName(v.NetworkID);
            })
        }

        if(rowData.Spec.TaskTemplate.Networks && !$.extends.isEmpty(rowData.Spec.TaskTemplate.Networks)){

            $.each(rowData.Spec.TaskTemplate.Networks, function (idx, v) {
                v.NetworkName = getNetworkName(v.NetworkID);
            })
        }

        showFn(rowData)
    }, node);

}


function showTaskPanel(rowData){

    let one = $.iDialog.openDialog({
        title: '任务信息-{0}'.format($.extends.isEmpty(rowData.SlotStr, rowData.ID)),
        minimizable:true,
        modal:true,
        maximized:true,
        width: 1050,
        height: 600,
        href:'./inspect-task.html',
        render:function(opts, handler){
            handler.render(rowData);
        },
        buttonsGroup: []
    });

    return one;

    // let showFn = function(row){
    //     let rowData =  row;
    //
    //     rowData.Name = row.Spec.Name;
    //
    //     $('#tasklist-layout').layout('remove', 'east');
    //
    //     let east_layout_options = {
    //         region:'east',
    //         split:false,border:false,width:'100%',collapsed:true,
    //         iconCls:'fa fa-info-circle',
    //         collapsible:false,
    //         showHeader1:false,
    //         titleformat:'任务信息-{0}'.format($.extends.isEmpty(rowData.SlotStr, rowData.ID)), title:'服务信息',
    //         headerCls:'border_right',bodyCls:'border_right',collapsible:true,
    //         footerHtml:`
    //      <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
    //         onClick:function(){
    //                 $('#tasklist-layout').layout('collapse', 'east');
    //         },
    //         btnCls: 'cubeui-btn-red',
    //         iconCls: 'fa fa-close'
    //     }">关闭</a>
    //     `.format(rowData.ID),
    //         render:function (panel, option) {
    //             $.docker.getHtml('./inspect-task.html', null, function(html){
    //                 let cnt = $($.templates(html).render(rowData));
    //                 panel.append(cnt);
    //                 $.parser.parse(cnt);
    //             })
    //         }
    //     }
    //
    //     $.docker.utils.ui.showSlidePanel($('#tasklist-layout'), east_layout_options)
    //     let opts = $.iLayout.getLayoutPanelOptions('#tasklist-layout',  'east');
    //     console.log(opts)
    // }
    //
    //
    // showFn(rowData);

}

function updateTags(id, inspect){


    if($.extends.isEmpty(id)){
        let rows = $('#servicesDg').datagrid('getChecked');

        if(rows.length>1){
            $.app.show('本版本仅支持选择一个节点编辑元数据');
            return ;
        }

        if(rows.length==0){
            $.app.show('请选择一个节点降级当前节点编辑元数据');
            return;
        }else{
            id = rows[0].ID;
        }
    }

    let node = local_node;

    $.docker.request.node.inspect(function (response){

        let html = `
                <div style="margin: 0px;">
                </div>
                <div class="cubeui-fluid">
                    <div style="margin-top:5px">      
                        <div class="cubeui-row" title="用户定义的节点键/值元数据">
                            <fieldset>
                                <legend style="margin-bottom: 0px;">用户定义的节点键/值元数据</legend>
                            </fieldset>
                                            
                            <div class="cubeui-col-sm12 add-opt-div">
                                <div class="cubeui-row">
                                    <div class="cubeui-col-sm4 cubeui-col-sm-offset1" style="padding-right: 5px">
                                        <span style='line-height: 20px;padding-right:0px;'>键</span>
                                    </div>
                                    <div class="cubeui-col-sm5" >
                                        <span style='line-height: 20px;padding-right:0px;'>值</span>
                                    </div>
                                    <div class="cubeui-col-sm2" style="text-align: center">
                                        <span style='line-height: 20px;padding-right:0px;'>
                                            <span onClick="$.docker.utils.ui.addNodeOpts(this, 'Labels')"  class="ops-fa-icon fa fa-plus" style="font-size:14px!important;">&nbsp;</span>
                                        </span>
                                    </div>
                                </div>
                                    
                                {{if Spec.Labels}}
                                {{props Spec.Labels}}                        
                                <div class="cubeui-row">
                                    <div class="cubeui-col-sm4 cubeui-col-sm-offset1" style="padding-right: 5px">
                                        <input type="text" data-toggle="cubeui-textbox" value="{{>key}}"
                                               name='Labels-name' data-options="required:false,prompt:'名字，比如：group '">
                                    </div>
                                    <div class="cubeui-col-sm5">
                                        <input type="text" data-toggle="cubeui-textbox" value="{{>prop}}"
                                               name='Labels-value' data-options="required:false,prompt:'对应值，比如：db '">
                                    </div>
                                    <div class="cubeui-col-sm2" style="text-align: center">
                                        <span style='line-height: 30px;padding-right:0px;'><span onClick="$.docker.utils.ui.removeOpt(this)"  class="ops-fa-icon fa fa-close" style="font-size:14px!important;">&nbsp;</span></span>
                                    </div>
                                </div>    
                                {{/props}}
                                {{/if}}
                            
                            </div>
                            
                            
                        </div>
                    </div>
                </div>
        `;

        html = $.templates(html).render(response)

        $.docker.utils.optionConfirm('修改节点键/值标签的元数据', null, html,
            function(param, closeFn){
                let labels = $.docker.utils.buildOptsData(param['Labels-name'],param['Labels-value']);

                $.docker.request.node.update_labels(function (response) {
                    $.app.show("节点{0}节点键/值标签的元数据修改成功".format(response.Info.Description.Hostname));

                    reloadDg();
                    if(inspect){
                        inspectService(id)
                    }
                    closeFn();
                }, node, id, labels);
            }, null, 450, 800);

    }, node, id);
}


function updateName(btn, id){

    let node = local_node;
    let opts = $(btn).linkbutton('options');

    if(opts.flag==2){

        $.app.confirm("确定修改节点名称？", function(){

            let name = $('#Nodename').textbox('getValue');

            $.docker.request.node.update_name(function (response) {
                $.app.show('修改节点名称已经完成');
                opts.flag = 1;
                $(btn).linkbutton({
                    text:'修改',
                    iconCls: 'fa fa-pencil-square-o'
                });

                $('#Nodename').textbox('readonly', true);

                reloadDg();
                inspectService(id)
            }, node, id, name)
        })

    }else{
        opts.flag = 2;
        $('#Nodename').textbox('readonly', false);
        $(btn).linkbutton({
            text:'确定',
            iconCls: 'fa fa-check-square-o'
        });
    }
}


function onActivated(opts, title, idx, param){
    console.log('services onActivated')
    console.log(param);
    reloadDg();
    //refreshCharts();
}
