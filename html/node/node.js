function loadLease(){

    // let node = $.docker.menu.getCurrentTabAttachNode();
    let node = local_node;

    $(function(){
        $("#nodesDg").iDatagrid({
            idField: 'ID',
            sortOrder:'asc',
            sortName:'Id',
            pageSize:50,
            queryParams:{all1:1},
            frozenColumns:[[
                {field: 'ID', title: '', checkbox: true},
                {field: 'op', title: '操作', sortable: false, halign:'center',align:'left',
                    width1: 300, formatter:leaseOperateFormatter},
                {field: 'Hostname', title: 'NODE', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 140},
                {field: 'Id', title: 'NODE ID', sortable: true,
                    formatter:$.iGrid.buildformatter([$.iGrid.templateformatter('{Id}'), $.iGrid.tooltipformatter()]),
                    width: 220},
                {field: 'Addr', title: 'Addr', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 130},
            ]],
            onBeforeLoad:function (param){
                refreshNodes(param)
            },
            columns: [[
                {field: 'StatuStr', title: 'Status', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 100},
                {field: 'Name', title: 'NAME', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 140},
                {field: 'RoleStr', title: 'Role', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 100},
                {field: 'MAddrStr', title: 'ADVERTISE', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 210},
                {field: 'Created', title: 'CREATED', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 170},
                {field: 'Updated', title: 'UPDATED', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 170},
                {field: 'Platform', title: 'OS', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),width: 120},
                {field: 'EVersion', title: '版本', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),width: 100},
                {field: 'CPUs', title: 'CPUS', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),width: 60},
                {field: 'MemoryBytes', title: '内存', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),width: 80},
                {field: 'SVersion', title: '节点版本', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),width: 80},
                {field: 'LabelStr', title: 'LABELS', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),width: 900}
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
    htmlstr += '<button class="layui-btn-yellowgreen layui-btn layui-btn-xs" onclick="inspectNode(\'' + row.ID + '\')">查看</button>';
    htmlstr += '<button class="layui-btn-gray layui-btn layui-btn-xs" onclick="removeLease(\'' + row.ID + '\')">删除</button>';
    htmlstr += '<button title="提升为管理节点" class="layui-btn-blue layui-btn layui-btn-xs" onclick="promoteLease(\'' + row.ID + '\')">提升</button>';
    htmlstr += '<button title="降级为工作节点"  class="layui-btn-red layui-btn layui-btn-xs" onclick="demoteLease(\'' + row.ID + '\')">降级</button>';

    if(row.Status.State == 'ready' && row.LeaderStr != "Leader"){
        if(row.Spec.Availability == 'active'){
            htmlstr += '<button title="作为污点节点排空"  class="layui-btn-orange layui-btn layui-btn-xs" onclick="drainLease(\'' + row.ID + '\')">污点</button>';
            htmlstr += '<button title="暂停节点服务"  class="layui-btn-brown layui-btn layui-btn-xs" onclick="pauseLease(\'' + row.ID + '\')">暂停</button>';
        }else if(row.Spec.Availability == 'pause'){
            htmlstr += '<button title="作为污点节点排空"  class="layui-btn-orange layui-btn layui-btn-xs" onclick="drainLease(\'' + row.ID + '\')">污点</button>';
            htmlstr += '<button title="激活节点"  class="layui-btn-slateblue layui-btn layui-btn-xs" onclick="activeLease(\'' + row.ID + '\')">激活</button>';
        }else if(row.Spec.Availability == 'drain'){
            htmlstr += '<button title="暂停节点服务"  class="layui-btn-brown layui-btn layui-btn-xs" onclick="pauseLease(\'' + row.ID + '\')">暂停</button>';
            htmlstr += '<button title="激活节点"  class="layui-btn-slateblue layui-btn layui-btn-xs" onclick="activeLease(\'' + row.ID + '\')">激活</button>';
        }
    }

    return htmlstr;
}

function drainLease(id, inspect){
    if($.extends.isEmpty(id)){
        let rows = $('#nodesDg').datagrid('getChecked');

        if(rows.length>1){
            $.app.show('本版本仅支持选择一个节点作为污点节点排空');
            return ;
        }

        if(rows.length==0){
            $.app.show('请选择一个节点作为污点节点排空');
            return;
        }else{
            id = rows[0].ID;
        }
    }


    $.app.confirm("作为污点节点排空","确定将当前节点作为污点节点排空？", function (){

        let node = local_node;

        $.docker.request.node.drain(function (response) {
            $.app.show("节点{0}作为污点节点排空成功".format(response.Info.Description.Hostname));
            $.app.showProgress("重新获取节点{0}信息".format(response.Info.Description.Hostname));

            $.easyui.thread.sleep(function () {
                reloadDg();
                if(inspect){
                    inspectNode(id)
                }

            }, 1000);
        }, node, id);
    });
}

function pauseLease(id, inspect){

    if($.extends.isEmpty(id)){
        let rows = $('#nodesDg').datagrid('getChecked');

        if(rows.length>1){
            $.app.show('本版本仅支持选择一个节点暂停');
            return ;
        }

        if(rows.length==0){
            $.app.show('请选择一个节点暂停');
            return;
        }else{
            id = rows[0].ID;
        }
    }


    $.app.confirm("暂停节点","确定将当前节点暂停？", function (){

        let node = local_node;

        $.docker.request.node.pause(function (response) {
            $.app.show("节点{0}暂停成功".format(response.Info.Description.Hostname));
            $.app.showProgress("重新获取节点{0}信息".format(response.Info.Description.Hostname));

            $.easyui.thread.sleep(function () {
                reloadDg();
                if(inspect){
                    inspectNode(id)
                }

            }, 1000);
        }, node, id);
    });
}

function activeLease(id, inspect){

    if($.extends.isEmpty(id)){
        let rows = $('#nodesDg').datagrid('getChecked');

        if(rows.length>1){
            $.app.show('本版本仅支持选择一个节点激活');
            return ;
        }

        if(rows.length==0){
            $.app.show('请选择一个节点激活');
            return;
        }else{
            id = rows[0].ID;
        }
    }


    $.app.confirm("激活节点","确定将当前节点激活？", function (){

        let node = local_node;

        $.docker.request.node.active(function (response) {
            $.app.show("节点{0}激活成功".format(response.Info.Description.Hostname));
            $.app.showProgress("重新获取节点{0}信息".format(response.Info.Description.Hostname));

            $.easyui.thread.sleep(function () {
                reloadDg();
                if(inspect){
                    inspectNode(id)
                }

            }, 1000);
        }, node, id);
    });
}

function promoteLease(id, inspect){

    if($.extends.isEmpty(id)){
        let rows = $('#nodesDg').datagrid('getChecked');

        if(rows.length>1){
            $.app.show('本版本仅支持选择一个节点提升为管理节点');
            return ;
        }

        if(rows.length==0){
            $.app.show('请选择一个节点提升为管理节点');
            return;
        }else{
            id = rows[0].ID;
        }
    }

    $.app.confirm("提升节点","确定提升当前节点为管理节点？", function (){
        let node = local_node;
        $.docker.request.node.promote(function(response){
            $.app.show("节点{0}提升为管理节点成功".format(response.Info.Description.Hostname));
            $.app.showProgress("重新获取节点{0}信息".format(response.Info.Description.Hostname));

            $.easyui.thread.sleep(function () {

                reloadDg();
                if(inspect){
                    inspectNode(id)
                }

            }, 1000);

        }, node, id)
    });
}

function demoteLease(id, inspect){

    if($.extends.isEmpty(id)){
        let rows = $('#nodesDg').datagrid('getChecked');

        if(rows.length>1){
            $.app.show('本版本仅支持选择一个节点降级当前节点为工作节点');
            return ;
        }

        if(rows.length==0){
            $.app.show('请选择一个节点降级当前节点为工作节点');
            return;
        }else{
            id = rows[0].ID;
        }
    }

    $.app.confirm("降级节点","确定降级当前节点为工作节点？", function (){
        let node = local_node;
        $.docker.request.node.demote(function(response){
            $.app.show("节点{0}降级为为工作节点成功".format(response.Info.Description.Hostname));

            $.app.showProgress("重新获取节点{0}信息".format(response.Info.Description.Hostname));
            $.easyui.thread.sleep(function () {

                reloadDg();
                if(inspect){
                        inspectNode(id)
                }
            }, 1000);
        }, node, id)
    });

}

function removePanel(){
    $('#layout').layout('remove', 'east');
}

function refreshNodes(param){

    let pageSize = $.docker.utils.getPageRowsFromParam(param);

    let skip = $.docker.utils.getSkipFromParam(param);

    //let node = $.v3browser.menu.getCurrentTabAttachNode();
    let node = local_node;

    $.docker.request.node.list(function (response) {
        $('#nodesDg').datagrid('loadData', {
            total: response.total,
            rows: response.list
        })
        
        refreshImageAndContainerInfo();

    }, node, skip, pageSize, param.role, param.membership, param.search_type, param.search_key, param.sort, param.order);
}

function removeLease(id, closePanel) {
    if($.extends.isEmpty(id)){
        let rows = $('#nodesDg').datagrid('getChecked');

        if(rows.length>1){
            $.app.show('本版本仅支持选择一个节点从SWARM集群里删除');
            return ;
        }

        if(rows.length==0){
            $.app.show('请选择一个节点从SWARM集群里删除');
            return;
        }else{
            id = rows[0].ID;
        }
    }

    let node = local_node;

    $.docker.utils.deleteConfirm('从SWARM集群里删除节点', '您确认要从SWARM集群里删除当前节点', function (param, closeFn){

        let node = local_node;
        $.docker.request.node.delete(function(response){
            $.app.show("从SWARM集群里删除节点成功".format(""));
            reloadDg();
            closeFn();

            if(closePanel){
                removePanel();
            }

        }, node, id, param.force==="1")
    }, null,false)

}

function reloadDg(){
    $('#nodesDg').datagrid('reload');
    $('#layout').layout('resize');
}

function inspectNode(id){
    showNodePanel(id)
}

function showNodePanel(id){

    let node = local_node;

    $.docker.request.node.inspect(function (response){
        let rowData = response;
        rowData.Name = response.Spec.Name;

        $('#layout').layout('remove', 'east');

        let east_layout_options = {
            region:'east',
            split:false,border:false,width:'100%',collapsed:true,
            iconCls:'fa fa-info-circle',
            collapsible:false,
            showHeader1:false,
            titleformat:'SWARM节点信息-{0}'.format($.extends.isEmpty(rowData.Description.Hostname, rowData.ID)), title:'节点信息',
            headerCls:'border_right',bodyCls:'border_right',collapsible:true,
            footerHtml:`
        <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                updateTags('{0}', true);
            },
            btnCls: 'cubeui-btn-slateblue',
            iconCls: 'fa fa-tags'
        }">编辑元数据</a>
        <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                removeLease('{0}', true);
            },
            btnCls: 'cubeui-btn-orange',
            iconCls: 'fa fa-times'
        }">删除</a>
        <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
                onClick:function(){
                    promoteLease('{0}', true);
                },
                extend: '#nodesDg-toolbar',
                btnCls: 'cubeui-btn-ivory',
                iconCls: 'fa fa-hand-o-up'
            }">提升管理节点</a>
        <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){                    
                    demoteLease('{0}', true);
            },
            btnCls: 'cubeui-btn-blue',
            iconCls: 'fa fa-hand-o-down'
        }">降级工作节点</a>
         <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                    $('#layout').layout('collapse', 'east');
            },
            btnCls: 'cubeui-btn-red',
            iconCls: 'fa fa-close'
        }">关闭</a>
        `.format(rowData.ID),
            render:function (panel, option) {

                let cnt = $($.templates(node_html_template).render(rowData));
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

            }
        }

        $.docker.utils.ui.showSlidePanel($('#layout'), east_layout_options)
        let opts = $.iLayout.getLayoutPanelOptions('#layout',  'east');
        console.log(opts)


    }, node, id)
}

let node_html_template = `
        <div data-toggle="cubeui-tabs" id='eastTabs'>
            <div title="节点信息"
                 data-options="id:'eastTab0',iconCls:'fa fa-info-circle'">                 
                <div style="margin: 0px;">
                </div>
                
                <div class="cubeui-fluid">
                    <fieldset>
                        <legend>基础信息</legend>
                    </fieldset>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Hostname:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Hostname" readonly
                                       value='{{>Description.Hostname}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>                    
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm11">
                            <label class="cubeui-form-label">NAME:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" id="Nodename" name="Name" readonly
                                       value='{{>Spec.Name}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>                                    
                        <div class="cubeui-col-sm1">						
							<a  href="javascript:void(0)" id='update_restart_policy_btn' data-toggle='cubeui-menubutton' data-options="{
								onClick:function(){
										updateName(this, '{{:ID}}');
								},
								btnCls: 'cubeui-btn-blue',
								iconCls: 'fa fa-pencil-square-o'
							}">修改</a>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">ID:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>ID}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Raft:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>SVersion}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Plugins:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>Plugins}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">CreateAt:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="CreateAt" readonly
                                       value='{{>Created}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">UpdateAt:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Updated" readonly
                                       value='{{>Updated}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Role:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="RoleStr" readonly
                                       value='{{>RoleStr}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Status:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="StatuStr" readonly
                                       value='{{>StatuStr}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Addr:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Addr" readonly
                                       value='{{>Addr}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                   
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Engine:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>Description.Engine.EngineVersion}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Os:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>OS}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Architecture:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>Architecture}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">CPUs:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>CPUs}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                   
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Memory:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>MemoryBytes}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                                        
                    <fieldset>
                        <legend style="margin-bottom: 0px;">标签选项</legend>
                    </fieldset>
                
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <div class="cubeui-row"  style="margin-top: 0px;">
                                <div class="cubeui-col-sm5 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <span style='line-height: 20px;padding-right:0px;'>标签</span>
                                </div>
                                <div class="cubeui-col-sm1">
                                    <span style='line-height: 20px;padding-right:0px;'>&nbsp;</span>
                                </div>
                                <div class="cubeui-col-sm5" >
                                    <span style='line-height: 20px;padding-right:0px;'>值</span>
                                </div>
                            </div>
                            {{props Spec.Labels}}
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm5 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <span style='line-height: 20px;padding-right:0px;'>{{>key}}</span>
                                    
                                </div>                                
                                <div class="cubeui-col-sm1">
                                    <span style='line-height: 20px;padding-right:0px;'>=</span>
                                </div>
                                <div class="cubeui-col-sm5">
                                    <span style='line-height: 20px;padding-right:0px;'>{{>prop}}</span>
                                </div>
                            </div>
                            {{/props}}
                        </div>
                    </div>
                
                </div>
                
            </div>
            
            <div title="管理节点信息"
                 data-options="id:'eastTab1',iconCls:'fa fa-sitemap',disabled:{{if Role == 'manager'}}false{{else}}true{{/if}}">                 
                <div style="margin: 0px;">
                </div>
                
                <div class="cubeui-fluid">
                    <fieldset>
                        <legend>管理信息</legend>
                    </fieldset>             
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Hostname:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>Hostname}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">ID:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>ID}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Role:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="RoleStr" readonly
                                       value='{{>RoleStr}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Status:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="StatuStr" readonly
                                       value='{{>StatuStr}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Addr:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Addr" readonly
                                       value='{{>Addr}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">管理节点角色:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="CreateAt" readonly
                                       value='{{>LeaderStr}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">ADVERTISE:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Updated" readonly
                                       value='{{>MAddrStr}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                                                  
                </div>          
                 
            </div>
            
        </div>
        
`

function updateTags(id, inspect){


    if($.extends.isEmpty(id)){
        let rows = $('#nodesDg').datagrid('getChecked');

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
                        inspectNode(id)
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
                inspectNode(id)
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


function onActivated(opts, title, idx){
    console.log('Image onActivated')
    reloadDg();
    //refreshCharts();
}
