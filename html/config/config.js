function loadLease(){

    // let node = $.docker.menu.getCurrentTabAttachNode();
    let node = local_node;

    $(function(){
        $("#configsDg").iDatagrid({
            idField: 'ID',
            sortOrder:'asc',
            sortName:'Id',
            pageSize:50,
            queryParams:{all1:1},
            frozenColumns:[[
                {field: 'ID', title: '', checkbox: true},
                {field: 'op', title: '操作', sortable: false, halign:'center',align:'left',
                    width1: 100, formatter:leaseOperateFormatter},
                {field: 'Id', title: 'ID', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 220},
                {field: 'Name', title: 'Name', sortable: true,
                    formatter:$.iGrid.buildformatter([$.iGrid.templateformatter('{Name}'), $.iGrid.tooltipformatter()]),
                    width: 140},
            ]],
            onBeforeLoad:function (param){
                refreshConfigs(param)
            },
            columns: [[
                {field: 'DataStr', title: 'CONTENT', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 260},
                {field: 'Created', title: 'CREATED', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 170},
                {field: 'Updated', title: 'UPDATED', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 170},
                {field: 'SVersion', title: 'Raft', sortable: true,
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
    htmlstr += '<button class="layui-btn-yellowgreen layui-btn layui-btn-xs" onclick="inspectConfig(\'' + row.ID + '\')">查看</button>';
    htmlstr += '<button class="layui-btn-blue layui-btn layui-btn-xs" onclick="updateData(\'' + row.ID + '\')">修改配置</button>';
    htmlstr += '<button class="layui-btn-gray layui-btn layui-btn-xs" onclick="removeLease(\'' + row.ID + '\')">删除</button>';
    return htmlstr;
}



function createLease(){
    inspectConfig();
}

function removePanel(){
    $('#layout').layout('remove', 'east');
}

function refreshConfigs(param){

    let pageSize = $.docker.utils.getPageRowsFromParam(param);

    let skip = $.docker.utils.getSkipFromParam(param);

    //let node = $.v3browser.menu.getCurrentTabAttachNode();
    let node = local_node;

    $.docker.request.config.list(function (response) {
        $('#configsDg').datagrid('loadData', {
            total: response.total,
            rows: response.list
        })

        refreshImageAndContainerInfo();

    }, node, skip, pageSize, param.search_type, param.search_key, param.sort, param.order);
}

function removeLease(id, closePanel) {
    if($.extends.isEmpty(id)){
        let rows = $('#configsDg').datagrid('getChecked');

        if(rows.length>1){
            $.app.show('本版本仅支持选择一个配置删除');
            return ;
        }

        if(rows.length==0){
            $.app.show('请选择一个配置删除');
            return;
        }else{
            id = rows[0].ID;
        }
    }

    $.app.confirm('您确认要删除当前配置',function (){

        let node = local_node;
        $.docker.request.config.delete(function(response){
            $.app.show("删除配置成功".format(""));
            reloadDg();

            if(closePanel){
                removePanel();
            }

        }, node, id)
    });

}

function reloadDg(){
    $('#configsDg').datagrid('reload');
    $('#layout').layout('resize');
}

function inspectConfig(id){
    let node = local_node;
    if($.extends.isEmpty(id)){
        let rowData = $.docker.request.config.buildNewRowData();
        rowData.updated = false;
        showConfigPanel(rowData)
    }else{
        $.docker.request.config.inspect(function (response){
            let rowData = response;
            rowData.Name = response.Spec.Name;
            rowData.updated = true;
            showConfigPanel(rowData)
        }, node, id)
    }
}

function showConfigPanel(rowData){
    $('#layout').layout('remove', 'east');

    let east_layout_options = {
        region:'east',
        split:false,border:false,width:'100%',collapsed:true,
        iconCls:'fa fa-gear',
        collapsible:false,
        showHeader1:false,
        titleformat:'配置信息-{0}'.format($.extends.isEmpty(rowData.Name, '新建')), title:'配置信息',
        headerCls:'border_right',bodyCls:'border_right',collapsible:true,
        footerHtml:$.templates(footer_html_template).render(rowData),
        render:function (panel, option) {

            let cnt = $($.templates(config_html_template).render(rowData));
            panel.append(cnt);
            $.parser.parse(cnt);

            $('#eastTabs').tabs({
                fit:true,
                border:false,
                bodyCls1:'border_right_none,border_bottom_none',
                narrow:true,
                pill:true,
            });

        }
    }

    $.docker.utils.ui.showSlidePanel($('#layout'), east_layout_options)
    let opts = $.iLayout.getLayoutPanelOptions('#layout',  'east');
    console.log(opts)
}

function saveConfig(fn){

    let node = local_node;

    if($('#createConfigForm').form('validate')) {
        let info = $.extends.json.param2json($('#createConfigForm').serialize());
        console.log(info)
        let data = $.docker.request.config.buildNewRowData();
        data.Name = info.Name;

        let labels = $.docker.utils.buildOptsData(info['Labels-name'],info['Labels-value']);
        data.Labels = labels;


        let doFn = function (row) {
            $.app.confirm("您确定新建当前配置信息？", function () {
                $.docker.request.config.create(function (response) {
                    if (fn) {
                        fn.call(row, response, row)
                    } else {
                        $.app.show('创建配置信息{0}成功'.format(row.Name));
                        reloadDg();
                        removePanel();
                        //$('#layout').layout('collapse', 'east');
                    }
                }, node, row);
            });
        }

        info.mode = $.extends.isEmpty(info.mode, 'data');

        if(info.mode == 'data'){
            if($.extends.isEmpty(info.data_text)){
                $.app.show("必须填写配置信息文本内容");
                return false;
            }
            data.Data = info.data_text;
            doFn(data);
        }else{
            let files = $('#data_file').filebox('files');

            if($.extends.isEmpty(files)){
                $.app.show("必须选择需要上传的配置信息文件");
                return false;
            }

            $.easyui.file.getReader(function(e){
                data.Data = this.result;
                console.log(data.Data);
                doFn(data);
            }).readAsText(files[0], "utf-8")
        }

    }
}

let footer_html_template = `

        {{if updated}}
        <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                updateTags('{{:ID}}', true);
            },
            btnCls: 'cubeui-btn-slateblue',
            iconCls: 'fa fa-tags'
        }">编辑元数据</a>        
        <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                removeLease('{{:ID}}', true);
            },
            btnCls: 'cubeui-btn-orange',
            iconCls: 'fa fa-times'
        }">删除</a>
        {{else}}   
        <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                saveConfig();
            },
            btnCls: 'cubeui-btn-blue',
            iconCls: 'fa fa-plus'
        }">添加</a>
        {{/if}}
         <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                    $('#layout').layout('collapse', 'east');
            },
            btnCls: 'cubeui-btn-red',
            iconCls: 'fa fa-close'
        }">关闭</a>
`;

let config_html_template = `
        <div data-toggle="cubeui-tabs" id='eastTabs'>
            <div title="配置信息"
                 data-options="id:'eastTab0',iconCls:'fa fa-info-circle'">                 
                <div style="margin: 0px;">
                </div>
                
                <div class="cubeui-fluid">
                    <fieldset>
                        <legend>基础信息</legend>
                    </fieldset>
                    
                    <form id='createConfigForm'>
                    
                    {{if updated}}
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
                        <div class="cubeui-col-sm11">
                            <label class="cubeui-form-label">NAME:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" id="ConfigName" name="Name" readonly
                                       value='{{>Name}}'
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
                            <label class="cubeui-form-label">                                          
                            配置信息:</label>
                            <div class="cubeui-input-block">                
                                <input readonly type="text" data-toggle="cubeui-textbox" name="data_text" id="data_text"
                                       value='{{>DataStr}}'
                                       data-options="
                                       prompt:'配置数据内容，必填项目',
                                       required:true,
                                       multiline:true,
                                       height:200,
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    {{else}}
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">NAME:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" id="ConfigName" name="Name"
                                       value=''
                                       data-options="
                                       prompt:'配置的名称，必填项目',
                                       required:true,
                                            "
                                >
                            </div>
                        </div>           
                    </div>
                    
                    
                    <style>
                    .radiobutton.inputbox{
                        cursor: pointer;
                    }
                    </style>
                    
                    <div class="cubeui-row">    
                        <div class="cubeui-col-sm12" style="margin-top: 5px">
                            <label class="cubeui-form-label">
                            <input data-toggle="cubeui-radiobutton" checked name="mode" 
                                            data-options="title:'从本地上传配置文件',
                                            onChange:function(checked){    
                                                    $('#data_file').filebox('enableValidation');
                                                    $('#data_file').filebox('enable');
                                                    $('#data_file').filebox('resize');
                                                    $('#data_text').textbox('disableValidation'); 
                                                    $('#data_text').textbox('disable');                                            
                                            }
                                            " value="file" >
                            选择配置文件:</label>
                            <div class="cubeui-input-block">
                                <input  data-toggle="cubeui-filebox" id="data_file" data-options="
                                    prompt:'从本地文件系统选择配置文件...',
                                    buttonText: '选择文件',
                                    required:true,
                                    accept:'.*',
                                    " style="width:100%">  
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">                            
                            <input data-toggle="cubeui-radiobutton" name="mode" 
                                            data-options="title:'直接输入配置文本内容',
                                            onChange:function(checked){               
                                                    $('#data_text').textbox('enableValidation');  
                                                    $('#data_text').textbox('enable');   
                                                                                                     
                                                    $('#data_file').filebox('disableValidation');
                                                    $('#data_file').filebox('disable');
                                                    $('#data_file').filebox('resize');         
                                            }
                                            " value="data" >                                            
                            配置信息:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="data_text" id="data_text"
                                       value=''
                                       data-options="
                                       disabled:true,
                                       prompt:'配置数据内容，必填项目',
                                       required:true,
                                       multiline:true,
                                       height:200,
                                            "
                                >
                            </div>
                        </div>
                    </div>                          
                    {{/if}}
                                    
                    <fieldset  style="margin-top: 10px;">
                        <legend style="margin-bottom: 0px;">标签选项</legend>
                    </fieldset>
                                
                    {{if updated}}
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
                            {{if Spec.Labels}}
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
                            {{/if}}
                        </div>
                    </div>
                    {{else}}
                    <div class="cubeui-row">                            
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
                    {{/if}}
                    
                </form>
                </div>
                
            </div>
            
        </div>
        
`

function updateData(id){
    if($.extends.isEmpty(id)){
        let rows = $('#configsDg').datagrid('getChecked');

        if(rows.length>1){
            $.app.show('本版本仅支持选择一个配置信息修改');
            return ;
        }

        if(rows.length==0){
            $.app.show('请选择一个配置信息修改');
            return;
        }else{
            id = rows[0].ID;
        }
    }

    let node = local_node;

    $.docker.request.config.inspect(function (response){
        let rowData = response;
        rowData.Name = response.Spec.Name;

        let html = `
                <div style="margin: 0px;">
                </div>
                <div class="cubeui-fluid">
                    <div style="margin-top:5px">      
                        <div class="cubeui-row" title="配置信息数据">
                            <fieldset>
                                <legend style="margin-bottom: 0px;"配置信息数据</legend>
                            </fieldset>
                        
                        <form id='updateConfigForm'>    
                        <div class="cubeui-row">
                            <div class="cubeui-col-sm12">
                                <label class="cubeui-form-label">NAME:</label>
                                <div class="cubeui-input-block">
                                    <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                           value='{{>Name}}'
                                           data-options="
                                           prompt:'配置的名称，必填项目',
                                           required:true,
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
                        
                        
                        <style>
                        .radiobutton.inputbox{
                            cursor: pointer;
                        }
                        </style>
                        
                        <div class="cubeui-row">    
                            <div class="cubeui-col-sm12" style="margin-top: 5px">
                                <label class="cubeui-form-label">
                                <input data-toggle="cubeui-radiobutton" checked name="mode" 
                                                data-options="title:'从本地上传配置文件',
                                                onChange:function(checked){    
                                                        $('#data_file').filebox('enableValidation');
                                                        $('#data_file').filebox('enable');
                                                        $('#data_file').filebox('resize');
                                                        $('#data_text').textbox('disableValidation'); 
                                                        $('#data_text').textbox('disable');                                            
                                                }
                                                " value="file" >
                                选择配置文件:</label>
                                <div class="cubeui-input-block">
                                    <input  data-toggle="cubeui-filebox" id="data_file" data-options="
                                        prompt:'从本地文件系统选择配置文件...',
                                        buttonText: '选择文件',
                                        required:true,
                                        accept:'.*',
                                        " style="width:100%">  
                                </div>
                            </div>
                        </div>
                        
                        <div class="cubeui-row">
                            <div class="cubeui-col-sm12">
                                <label class="cubeui-form-label">                            
                                <input data-toggle="cubeui-radiobutton" name="mode" 
                                                data-options="title:'直接输入配置文本内容',
                                                onChange:function(checked){               
                                                        $('#data_text').textbox('enableValidation');  
                                                        $('#data_text').textbox('enable');   
                                                                                                         
                                                        $('#data_file').filebox('disableValidation');
                                                        $('#data_file').filebox('disable');
                                                        $('#data_file').filebox('resize');         
                                                }
                                                " value="data" >                                            
                                配置信息:</label>
                                <div class="cubeui-input-block">
                    
                                    <input type="text" data-toggle="cubeui-textbox" name="data_text" id="data_text"
                                           value=''
                                           data-options="
                                           disabled:true,
                                           prompt:'配置数据内容，必填项目',
                                           required:true,
                                           multiline:true,
                                           height:240,
                                                "
                                    >
                                </div>
                            </div>
                        </div>     
                            
                        
                        </form>
                    </div>
                </div>
        `;

        html = $.templates(html).render(response)

        $.docker.utils.optionConfirm('修改配置信息数据', null, html, function (param, closeFn) {

            if($('#updateConfigForm').form('validate')) {

                let param = $.extends.json.param2json($('#updateConfigForm').serialize());
                console.log(param)

                let doFn = function (param) {

                    if($.extends.isEmpty(param.Data)){
                        $.app.show("请输入配置信息数据内容");
                        return false;
                    }

                    $.docker.request.config.update_data(function (response) {
                        $.app.show("配置信息{0}数据修改成功".format(response.Info.Spec.Name));

                        reloadDg();
                        inspectConfig(id)
                        closeFn();
                    }, node, id, param.Data);

                }

                param.mode = $.extends.isEmpty(param.mode, 'data');

                if(param.mode == 'data'){
                    if($.extends.isEmpty(param.data_text)){
                        $.app.show("必须填写配置信息文本内容");
                        return false;
                    }
                    param.Data = param.data_text;
                    doFn(param);
                }else{
                    let files = $('#data_file').filebox('files');

                    if($.extends.isEmpty(files)){
                        $.app.show("必须选择需要上传的配置信息文件");
                        return false;
                    }

                    $.easyui.file.getReader(function(e){
                        param.Data = this.result;
                        console.log(param.Data);
                        doFn(param);
                    }).readAsText(files[0], "utf-8")
                }
            }
        }, null, 540, 900);

    }, node, id)
}

function updateTags(id, inspect){
    if($.extends.isEmpty(id)){
        let rows = $('#configsDg').datagrid('getChecked');

        if(rows.length>1){
            $.app.show('本版本仅支持选择一个配置信息编辑元数据');
            return ;
        }

        if(rows.length==0){
            $.app.show('请选择一个配置信息编辑元数据');
            return;
        }else{
            id = rows[0].ID;
        }
    }

    let node = local_node;

    $.docker.request.config.inspect(function (response){

        let html = `
                <div style="margin: 0px;">
                </div>
                <div class="cubeui-fluid">
                    <div style="margin-top:5px">      
                        <div class="cubeui-row" title="用户定义的配置信息键/值元数据">
                            <fieldset>
                                <legend style="margin-bottom: 0px;">用户定义的配置信息键/值元数据</legend>
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

        $.docker.utils.optionConfirm('修改配置信息键/值标签的元数据', null, html,
            function(param, closeFn){
                let labels = $.docker.utils.buildOptsData(param['Labels-name'],param['Labels-value']);

                $.docker.request.config.update_labels(function (response) {
                    $.app.show("配置信息{0键/值标签的元数据修改成功".format(response.Info.Spec.Name));

                    reloadDg();
                    if(inspect){
                        inspectConfig(id)
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

        $.app.confirm("确定修改配置信息名称？", function(){

            let name = $('#ConfigName').textbox('getValue');

            if($.extends.isEmpty(name)){
                $.app.show("请输入配置信息的名字");
                return false;
            }

            $.docker.request.config.update_name(function (response) {
                $.app.show('修改配置信息名称已经完成');
                opts.flag = 1;
                $(btn).linkbutton({
                    text:'修改',
                    iconCls: 'fa fa-pencil-square-o'
                });

                $('#ConfigName').textbox('readonly', true);

                reloadDg();
                inspectConfig(id)
            }, node, id, name)
        })

    }else{
        opts.flag = 2;
        $('#ConfigName').textbox('readonly', false);
        $('#ConfigName').textbox('textbox').focus();
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
