function loadLease(){

    // let node = $.docker.menu.getCurrentTabAttachNode();
    let node = local_node;

    $(function(){
        $("#volumesDg").iDatagrid({
            idField: 'ID',
            sortOrder:'asc',
            sortName:'Name',
            pageSize:50,
            frozenColumns:[[
                {field: 'ID', title: '', checkbox: true},
                {field: 'op', title: '操作', sortable: false, halign:'center',align:'center',
                    width: 150, formatter:leaseOperateFormatter},
                {field: 'Name', title: 'VOLUME NAME', sortable: true,
                    formatter:$.iGrid.buildformatter([$.iGrid.templateformatter('{Name}'), $.iGrid.tooltipformatter()]),
                    width: 390},
            ]],
            onBeforeLoad:function (param){
                console.log(param)
                refreshLease(param)
            },
            columns: [[
                {field: 'Driver', title: 'DRIVER', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 90},
                {field: 'Scope', title: 'SCOPE', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 90},
                {field: 'Created', title: 'CREATED', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 220},
                {field: 'Mountpoint', title: 'MOUNT POINT', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),width: 450},
                {field: 'LabelStr', title: 'LABELS', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),width: 900},
                {field: 'OptionStr', title: 'Options', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),width: 900}

            ]],
            onLoadSuccess:$.easyui.event.wrap(
                $.fn.iDatagrid.defaults.onLoadSuccess,
                function(data){
                }
            ),
        });
    });
}

function leaseOperateFormatter(value, row, index) {
    let htmlstr = "";
    htmlstr += '<button class="layui-btn-yellowgreen layui-btn layui-btn-xs" onclick="inspectLease(\'' + index + '\')">查看卷</button>';
    htmlstr += '<button class="layui-btn-gray layui-btn layui-btn-xs" onclick="removeLease(\'' + row.ID + '\')">删除卷</button>';

    return htmlstr;
}

function refreshLease(param){
    let pageSize = $.docker.utils.getPageRowsFromParam(param);
    
    let skip = $.docker.utils.getSkipFromParam(param);

    //let node = $.v3browser.menu.getCurrentTabAttachNode();
    let node = local_node;

    $.docker.request.volume.list(function (response) {
        $('#volumesDg').datagrid('loadData', {
            total: response.total,
            rows: response.list
        })
    }, node, skip, pageSize, true, param.search_type, param.search_key, param.sort, param.order);
}

function removeLease(leaseId) {
    let node = local_node;

    if($.extends.isEmpty(leaseId)){
        let rows = $('#volumesDg').datagrid('getChecked');

        if(rows.length == 0) {
            $.app.alert('请选择需要删除的租期')
        }else{
            $.docker.utils.deleteConfirm('删除卷', '您确认要删除当前想选择的数据卷', function (param, closeFn){

                let ids = $.extends.collect(rows, function(r){
                    return r.ID;
                });

                $.docker.request.volume.deleteBulk(function(response){
                    let msg = '';
                    if(response.fail.length==0){
                        msg = '删除成功，已经成功删除'+response.ok.length+'个数据卷';
                    }else{
                        msg = '已经成功删除'+response.ok.length+'个数据卷, 失败删除'+response.fail.length+'个数据卷';
                    }

                    reloadDg()
                    closeFn()

                    $.app.show(msg)

                }, node, ids, param.force==="1")
            })
        }

    }else{
        $.docker.utils.deleteConfirm('删除卷', '您确认要删除当前的数据卷', function (param, closeFn){
            $.docker.request.volume.delete(function(response){

                let msg = '删除成功，已经成功删除数据卷{0}'.format(leaseId);
                $.app.show(msg)

                reloadDg()
                closeFn()
            }, node, leaseId, param.force==="1")
        })
    }
}

function emptyLease(){
    let node = local_node;
    let html = `
                <div style="margin: 0px;">
                </div>
                <div class="cubeui-fluid">
                    <fieldset>
                        <legend>选项</legend>
                    </fieldset>
                    <div style="margin-top:5px">
                
                        <div class="cubeui-row">
                            <span style='line-height: 30px;padding-right:0px'><b>清理指定标签:</b>(默认清理全部)</span>
                        </div>
                        <div class="cubeui-row">
                            <span style='line-height: 20px;padding-right:0px;color: red'>label格式: label1=a label2!=b(不等于) label!=...(没有标签)</span>
                        </div>
                        <div class="cubeui-row">
                            <input type="text" data-toggle="cubeui-textbox" name="labels"
                                   value='' data-options="required:false,prompt:'label格式: label1=a,label2!=b,label!=...'">
                        </div>
                    </div>
                </div>
        `;

    $.docker.utils.optionConfirm('清理数据卷', '重要警告：确定要清空所有未使用的数据卷，清理后数据卷数据将无法恢复', html,
        function(param, closeFn){

            $.docker.request.volume.prune(function(response){
                let msg = '成功清除{0}个数据卷，回收空间{1}'.format(response.Count, response.Size)

                closeFn();

                $.app.show(msg)
                reloadDg()
            }, node, param.labels)
        })
}

function reloadDg(){
    $('#volumesDg').datagrid('reload');
    refreshVolumeInfo()
}

function inspectLease(idx){
    showVolumePanel(idx)
}

function addLease(){


    let rowData = {};

    $('#layout').layout('remove', 'east');

    let east_layout_options = {
        region:'east',
        split:false,border:false,width:'100%',collapsed:true,
        iconCls:'fa fa-database',
        titleformat:'添加数据卷'.format(rowData.Name), title:'数据卷',
        headerCls:'border_right',bodyCls:'border_right',collapsible:true,
        footerHtml:`
             <a  href="javascript:void(0)" data-toggle="cubeui-menubutton" data-options="{
                onClick:function(){
                    save()
                },
                btnCls: 'cubeui-btn-orange',
                iconCls: 'fa fa-plus-square-o'
            }">创建</a>
             <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
                onClick:function(){
                        $('#layout').layout('collapse', 'east');
                },
                btnCls: 'cubeui-btn-red',
                iconCls: 'fa fa-close'
            }">关闭</a>
            `,
        render:$('#addVolumeTpl').html()
    }

    $.docker.utils.ui.showSlidePanel($('#layout'), east_layout_options)
    let opts = $.iLayout.getLayoutPanelOptions('#layout',  'east');
    console.log(opts)

    return ;
}

function save(){

    let node = local_node;

    if($('#addVolumeForm').form('validate')){

        let info = $.extends.json.param2json($('#addVolumeForm').serialize());
        console.log(info)



        let driverOpts = $.docker.utils.buildOptsData(info['driver-opt-name'],info['driver-opt-value']);
        let labels = $.docker.utils.buildOptsData(info['label-name'],info['label-value']);

        $.docker.request.volume.create(function (response) {
            $.app.show('添加数据卷{0}成功'.format(info.Name))
            reloadDg()
            $('#layout').layout('collapse', 'east');

        }, node, info.Name, info.Driver, driverOpts, labels)

    }
}

function showVolumePanel(index){
    let rowData = $('#volumesDg').datagrid('getRows')[index]
    let id = rowData.ID;
    let node = local_node;
    $.docker.request.volume.inspect(function (response){
        rowData = response;

        $('#layout').layout('remove', 'east');

        let east_layout_options = {
            region:'east',
            split:false,border:false,width:'100%',collapsed:true,
            iconCls:'fa fa-database',
            titleformat:'数据卷-{0}'.format(rowData.Name), title:'数据卷',
            headerCls:'border_right',bodyCls:'border_right',collapsible:true,
            footerTpl1:'#footerTpl',
            footerHtml:`
             <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
                onClick:function(){
                        $('#layout').layout('collapse', 'east');
                },
                btnCls: 'cubeui-btn-red',
                iconCls: 'fa fa-close'
            }">关闭</a>
            `,
            render:$.templates(html_template).render(rowData)
        }

        $.docker.utils.ui.showSlidePanel($('#layout'), east_layout_options)
        let opts = $.iLayout.getLayoutPanelOptions('#layout',  'east');
        console.log(opts)

    }, node, id)
}

let html_template = `    
<div style="margin: 0px;">
</div>

<div class="cubeui-fluid">
    <fieldset>
        <legend>数据卷信息</legend>
    </fieldset>
    <div class="cubeui-row">
        <div class="cubeui-col-sm12">
            <label class="cubeui-form-label">数据卷:</label>
            <div class="cubeui-input-block">
                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                       value='{{>Name}}'
                       data-options="
                            "
                >
            </div>
        </div>
    </div>

    <div class="cubeui-row">
        <div class="cubeui-col-sm12">
            <label class="cubeui-form-label">Mountpoint:</label>
            <div class="cubeui-input-block">

                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                       value='{{>Mountpoint}}'
                       data-options="
                            "
                >
            </div>
        </div>
    </div>

    <div class="cubeui-row">
        <div class="cubeui-col-sm12">
            <label class="cubeui-form-label">Scope:</label>
            <div class="cubeui-input-block">

                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                       value='{{>Scope}}'
                       data-options="
                            "
                >
            </div>
        </div>
    </div>

    <div class="cubeui-row">
        <div class="cubeui-col-sm12">
            <label class="cubeui-form-label">CreatedAt:</label>
            <div class="cubeui-input-block">

                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                       value='{{>Created}}'
                       data-options="
                            "
                >
            </div>
        </div>
    </div>

    <div class="cubeui-row">
        <div class="cubeui-col-sm12">
            <label class="cubeui-form-label">数据卷驱动:</label>
            <div class="cubeui-input-block">

                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                       value='{{>Driver}}'
                       data-options="
                            "
                >
            </div>
        </div>
    </div>

    <fieldset>
        <legend style="margin-bottom: 0px;">驱动选项</legend>
    </fieldset>

    <div class="cubeui-row">
        <div class="cubeui-col-sm12">
            <div class="cubeui-row">
                <div class="cubeui-col-sm4 cubeui-col-sm-offset2" style="padding-right: 5px">
                    <span style='line-height: 20px;padding-right:0px;'>选项</span>
                </div>
                <div class="cubeui-col-sm5" >
                    <span style='line-height: 20px;padding-right:0px;'>值</span>
                </div>
            </div>
            {{props Options}}
            <div class="cubeui-row">
                <div class="cubeui-col-sm4 cubeui-col-sm-offset2" style="padding-right: 5px">
                    <input type="text" data-toggle="cubeui-textbox" readonly
                           value='{{>key}}' data-options="required:false,prompt:'租约ID，选择填写，默认为空，不使用租约'">
                </div>
                <div class="cubeui-col-sm5">
                    <input type="text" data-toggle="cubeui-textbox" readonly
                           value='{{>prop}}' data-options="required:false,prompt:'租约ID，选择填写，默认为空，不使用租约'">
                </div>
            </div>
            {{/props}}
        </div>
    </div>

    <fieldset>
        <legend style="margin-bottom: 0px;">标签选项</legend>
    </fieldset>

    <div class="cubeui-row">
        <div class="cubeui-col-sm12">
            <div class="cubeui-row">
                <div class="cubeui-col-sm4 cubeui-col-sm-offset2" style="padding-right: 5px">
                    <span style='line-height: 20px;padding-right:0px;'>标签</span>
                </div>
                <div class="cubeui-col-sm5" >
                    <span style='line-height: 20px;padding-right:0px;'>值</span>
                </div>
            </div>
            {{props Labels}}
            <div class="cubeui-row">
                <div class="cubeui-col-sm4 cubeui-col-sm-offset2" style="padding-right: 5px">
                    <input type="text" data-toggle="cubeui-textbox" readonly
                           value='{{>key}}' data-options="required:false,prompt:'租约ID，选择填写，默认为空，不使用租约'">
                </div>
                <div class="cubeui-col-sm5">
                    <input type="text" data-toggle="cubeui-textbox" readonly
                           value='{{>prop}}' data-options="required:false,prompt:'租约ID，选择填写，默认为空，不使用租约'">
                </div>
            </div>
            {{/props}}
        </div>
    </div>



</div>

`