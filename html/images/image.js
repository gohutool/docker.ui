function loadLease(){

    // let node = $.docker.menu.getCurrentTabAttachNode();
    let node = local_node;

    $(function(){
        $("#imagesDg").iDatagrid({
            idField: 'ID',
            sortOrder:'asc',
            sortName:'Id',
            pageSize:50,
            queryParams:{all1:1},
            frozenColumns:[[
                {field: 'ID', title: '', checkbox: true},
                {field: 'op', title: '操作', sortable: false, halign:'center',align:'center',
                    width: 210, formatter:leaseOperateFormatter},
                {field: 'Id', title: 'IMAGE ID', sortable: true,
                    formatter:$.iGrid.buildformatter([$.iGrid.templateformatter('{Id}'), $.iGrid.tooltipformatter()]),
                    width: 260},
                {field: 'Repository', title: 'REPOSITORY', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 220},
                {field: 'Tag', title: 'TAG', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 120},
            ]],
            onBeforeLoad:function (param){
                refreshLease(param)
            },
            columns: [[
                {field: 'Created', title: 'CREATED', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 180},
                {field: 'Size', title: 'SIZE', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),width: 100},
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
    htmlstr += '<button class="layui-btn-yellowgreen layui-btn layui-btn-xs" onclick="inspectImage(\'' + index + '\', \'' + row.ID + '\')">查看</button>';
    htmlstr += '<button class="layui-btn-blue layui-btn layui-btn-xs" onclick="createContainerFromImage(\'' + index + '\', \'' + row.ID + '\')">运行</button>';
    htmlstr += '<button class="layui-btn-gray layui-btn layui-btn-xs" onclick="removeLease(\'' + row.ID + '\')">删除</button>';
    htmlstr += '<button class="layui-btn-orange layui-btn layui-btn-xs" onclick="tagLease(\'' + index + '\', \'' + row.ID + '\')">标记</button>';

    return htmlstr;
}

function removePanel(){
    $('#layout').layout('remove', 'east');
}

function deleteBuild(){
    let node = local_node;

    $.app.confirm("您确定删除所有的构建缓存？", function (response) {
        $.docker.request.build.delete(function(response){
            response.CachesDeleted = response.CachesDeleted||[];

            console.log(response.CachesDeleted);

            let msg = '构建缓存清理成功，清理空间{0}, 清理构建缓存{1}个'.format($.docker.utils.getSize(response.SpaceReclaimed), response.CachesDeleted.length);

            $.app.show(msg)

            reloadDg()
        }, node)
    })
}

function buildImage(){

    let node = local_node;

    let import_html = `
                <div style="margin: 0px;">
                </div>
                <div class="cubeui-fluid">
                    <fieldset>
                        <legend>构建镜像选项</legend>
                    </fieldset>
                    <style>
                    .radiobutton.inputbox{
                        cursor: pointer;
                    }
                    </style>

                    <div style="margin-top:5px">
                            <div class="cubeui-row" style="margin-top: 5px">
                                <div class="cubeui-col-sm12" >
                                    <label class="cubeui-form-label" title="Git存储库URI或HTTP/HTTPS上下文URI。如果URI指向单个文本文件，则该文件的内容将被放置到名为Dockerfile的文件中，并从该文件构建图像。如果URI指向tarball，则守护进程将下载该文件，其中的内容将用作构建的上下文。如果URI指向tarball，并且还指定了dockerfile参数，则tarball内必须有一个具有相应路径的文件。">构建源方式:</label>
                                    <div class="cubeui-input-block">
                                        <input data-toggle="cubeui-radiobutton" checked name="mode" 
                                            data-options="title:'从本地上传tarball文件',
                                            onChange:function(checked){
                                                if(checked){
                                                    $('.upload_image_file').show();
                                                    $('.remote_image_url').hide();
                                                    
                                                    $('#import_file').filebox('enableValidation');
                                                    $('#import_file').filebox('resize');
                                                    $('#remote_uri').textbox('disableValidation');
                                                    
                                                }
                                            }
                                            " value="file" label1="本地Tarball文件">
                                        <span style='line-height: 30px;padding-right:0px' title="从本地上传tarball文件"><b>本地Tarball文件</b>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                        <input data-toggle="cubeui-radiobutton" name="mode"
                                            data-options="title:'从远程URI上传tarball文件',
                                            onChange:function(checked){
                                                if(checked){
                                                    $('.upload_image_file').hide();
                                                    $('.remote_image_url').show();
                                                    
                                                    $('#import_file').filebox('disableValidation');
                                                    $('#remote_uri').textbox('enableValidation');   
                                                    $('#remote_uri').textbox('resize');                                                 
                                                }
                                            }
                                            "
                                        value="url" label1="远程URI">            
                                        <span style='line-height: 30px;padding-right:0px' title="it存储库URI或HTTP/HTTPS上下文URI。如果URI指向单个文本文件，则该文件的内容将被放置到名为Dockerfile的文件中，并从该文件构建图像。如果URI指向tarball，则守护进程将下载该文件，其中的内容将用作构建的上下文。如果URI指向tarball，并且还指定了dockerfile参数，则tarball内必须有一个具有相应路径的文件"><b>远程URI</b>&nbsp;&nbsp;&nbsp;&nbsp;</span>                        
                                    </div>
                                </div>
                                
                                <div class="cubeui-col-sm12" style="margin-top: 5px">
                                    <label class="cubeui-form-label">Dockerfile路径:</label>
                                    <div class="cubeui-input-block">
                                        <input type="text" data-toggle="cubeui-textbox" name="dockerfile"
                                               value=''
                                               data-options="
                                                        required:false,prompt:'生成上下文中Dockerfile的路径。默认为Dockerfile。'
                                                        "
                                        >
                                    </div>
                                </div>
                                             
                                <div class="upload_image_file cubeui-col-sm12" style="margin-top: 5px">
                                    <label class="cubeui-form-label">构建镜像包:</label>
                                    <div class="cubeui-input-block">
                                        <input  data-toggle="cubeui-filebox" id="import_file" data-options="
                                            prompt:'必须是使用以下算法之一压缩的tar存档：identity（无压缩）、gzip、bzip2或xz。',
                                            buttonText: '选择文件',
                                            required:true,
                                            accept:'.tar',
                                            " style="width:100%">  
                                    </div>
                                </div>        
                                   
                                <div class="remote_image_url cubeui-col-sm12" style="margin-top: 5px;display:none">
                                    <label class="cubeui-form-label">存储库URI:</label>
                                    <div class="cubeui-input-block">
                                        <input  data-toggle="cubeui-textbox" id="remote_uri" name="remote" data-options="
                                            prompt:'Git存储库URI或HTTP/HTTPS上下文URI。如果URI指向单个文本文件，则该文件的内容将被放置到名为Dockerfile的文件中',                                            
                                            required:true,
                                            novalidate:true,
                                            " >  
                                    </div>
                                </div>  
                                                                          
                                <div class="cubeui-col-sm12" style="margin-top: 5px">
                                    <label class="cubeui-form-label" title="以repos:tag格式应用于图像的名称和可选标记。如果省略标记，则假定为默认的最新值。">镜像标记:</label>
                                    <div class="cubeui-input-block">
                                        <input type="text" data-toggle="cubeui-textbox" name="t"
                                               value=''
                                               data-options="
                                                        required:true,prompt:'以repos:tag格式应用于图像的名称和可选标记。如果省略标记，则假定为默认的最新值。'
                                                        "
                                        >
                                    </div>
                                </div>   
                                       
                                <div class="cubeui-col-sm12" style="margin-top: 5px">
                                    <label class="cubeui-form-label" title="要添加到/etc/hosts的额外主机">额外主机名:</label>
                                    <div class="cubeui-input-block">
                                        <input type="text" data-toggle="cubeui-textbox" name="extrahosts"
                                               value=''
                                               data-options="
                                                        required:false,prompt:'要添加到/etc/hosts的额外主机。'
                                                        "
                                        >
                                    </div>
                                </div> 
                                
                            </div> 
                            
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm3">
                                    <label class="cubeui-form-label" title="如果选中；详细生成输出；不选中；抑制详细生成输出">抑制详细:</label>
                                    <div class="cubeui-input-block">
                                        <input data-toggle="cubeui-switchbutton" checked 
                                            name="q" value="1" data-options="onText:'',offText:'',width:60">
                                    </div>
                                </div>
                            </div> 
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm3">
                                    <label class="cubeui-form-label" title="如果选中；生成镜像时使用缓存；不选中；生成镜像时不使用缓存">使用缓存:</label>
                                    <div class="cubeui-input-block">
                                        <input data-toggle="cubeui-switchbutton" checked
                                            name="cache" value="1" data-options="onText:'',offText:'',width:60">
                                    </div>
                                </div>
                            </div> 
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm3">
                                    <label class="cubeui-form-label" title="如果选中；成功生成后删除中间容器。">删除中间容器:</label>
                                    <div class="cubeui-input-block">
                                        <input data-toggle="cubeui-switchbutton" checked
                                            name="rm" value="1" data-options="onText:'',offText:'',width:60">
                                    </div>
                                </div>
                            </div> 
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm3">
                                    <label class="cubeui-form-label" title="如果选中；即使发生故障，也应始终拆下中间容器。">强制删除:</label>
                                    <div class="cubeui-input-block">
                                        <input data-toggle="cubeui-switchbutton"
                                            name="forcerm" value="1" data-options="onText:'',offText:'',width:60">
                                    </div>
                                </div>
                            </div> 
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm12" style="margin-top: 5px">
                                    <label class="cubeui-form-label" title="要在镜像上上设置的任意键/值标签的元数据,格式为KEY1=VALUE1[ KEY2=VAVLUE2]">标签:</label>
                                    <div class="cubeui-input-block">
                                        <input type="text" data-toggle="cubeui-tagbox" name="labels"
                                               value=''
                                               data-options="
                                                        required:false,prompt:'键/值标签的元数据,格式为KEY1=VALUE1[ KEY2=VAVLUE2]。'
                                                        "
                                        >
                                    </div>
                                </div> 
                            </div> 
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm12" style="margin-top: 5px">
                                    <label class="cubeui-form-label" title="生成时变量的字符串对。用户在构建时传递这些值。Docker将buildargs用作通过Dockerfile运行指令运行的命令的环境上下文，或用于其他Dockerfile指令中的变量扩展">构建期参数:</label>
                                    <div class="cubeui-input-block">
                                        <input type="text" data-toggle="cubeui-tagbox" name="buildargs"
                                               value=''
                                               data-options="
                                                        required:false,prompt:'构建期参数,格式为KEY1=VALUE1[,KEY2=VAVLUE2]。例如，FOO=bar'
                                                        "
                                        >
                                    </div>
                                </div> 
                            </div> 
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm12" style="margin-top: 5px">
                                    <label class="cubeui-form-label" title="目标构建阶段">目标构建阶段:</label>
                                    <div class="cubeui-input-block">
                                        <input type="text" data-toggle="cubeui-textbox" name="target"
                                               value=''
                                               data-options="
                                                        required:false,prompt:'目标构建阶段。'
                                                        "
                                        >
                                    </div>
                                </div> 
                            </div> 
                            
<!--                            <div class="cubeui-row  {0}-build-image-progress" style="display: none">-->
<!--                                <div class="cubeui-col-sm11 cubeui-col-sm-offset1" style="margin-top: 5px">-->
<!--                                <div id="{0}-build-image-progress" data-toggle="cubeui-progressbar"></div>-->
<!--                                </div>-->
<!--                            </div>-->
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm11 cubeui-col-sm-offset1 {0}-build-image-log" style="margin-top: 10px" >                                    
                                </div> 
                            </div>
                            
                    </div>
                </div>
        `;

    let id = Math.uuid();

    $.docker.utils.optionConfirm('上传构建包进行镜像构建', '选择构建包并使用构建包构建镜像？', import_html.format(id),
        function(param, closeFn) {

            let data = {};

            if ($.extends.isEmpty(param.t)) {
                $.app.show("需要填写构建镜像的镜像名称")
                return false;
            }

            data.dockerfile = $.extends.isEmpty(param.dockerfile, 'Dockerfile');

            data.t = $.extends.isEmpty(param.t, '');
            data.q = $.extends.isEmpty(param.t, false);
            data.nocache = $.extends.isEmpty(param.cache, 1)==1?false:true;
            data.rm = $.extends.isEmpty(param.rm, true);
            data.forcerm = $.extends.isEmpty(param.forcerm, false);
            data.target = $.extends.isEmpty(param.target, "");
            data.outputs = $.extends.isEmpty(param.outputs, "");

            let values = $.docker.utils.convert2ListParamValue(param.labels);
            //let labelstr = $.extends.isEmpty(param.labels, "");
            //let values = labelstr.split2(" ")

            if(!$.extends.isEmpty(values)){
                data.labels = $.docker.utils.getKeyValue(values);
                data.labels = $.extends.json.tostring(data.labels);
            }


            //let buildArgsStr = $.extends.isEmpty(param.buildargs, "");
            //values = buildArgsStr.split2(",")
            values = $.docker.utils.convert2ListParamValue(param.buildargs);

            if(!$.extends.isEmpty(values)){
                data.buildargs = $.docker.utils.getKeyValue(values);
                data.buildargs = $.extends.json.tostring(data.buildargs);
            }

            let buildFn = function(querydata, content){

                $('.{0}-build-image-log'.format(id)).empty()
                $('.{0}-build-image-log'.format(id)).append('<span>开始构建镜像{0}....</span>'.format(querydata.t));
                $.app.showProgress('开始构建镜像{0}....'.format(querydata.t));

                $.docker.request.image.build(function (json, xhr, state) {
                    console.log(json)
                    if(json){
                        if(!$.extends.isEmpty(json.stream)){
                            $('.{0}-build-image-log'.format(id)).append('<br>{0}'.format(json.stream));
                        }

                        if(!$.extends.isEmpty(json.status)){
                            $('.{0}-build-image-log'.format(id)).append('<br>{0}'.format(json.progress));
                        }

                        if(!$.extends.isEmpty(json.errorDetail)){
                            $('.{0}-build-image-log'.format(id)).append('<br><font color="red">{0}</font>'.format(json.errorDetail.message||json.errorDetail));
                        }
                        if(!$.extends.isEmpty(json.message)){
                            $('.{0}-build-image-log'.format(id)).append('<br><font color="red">{0}</font>'.format(json.message));
                        }
                    }

                }, node, content, querydata, function (xhr, status) {
                    //('#{0}-build-image-progress'.format(id)).progressbar('stopLoading');
                    //$('.{0}-build-image-progress'.format(id)).hide()

                    $.app.closeProgess();

                    if(xhr.status<400&&!this.ErrorMsg){
                        $.app.show('构建包进行镜像构建{0}成功'.format(querydata.t.htmlEncode()));
                        reloadDg();
                    }else{
                        if(this.ErrorMsg){
                            $.app.show('构建包进行镜像构建{0}失败:{1}'.format(querydata.t.htmlEncode(), this.ErrorMsg));
                            $('.{0}-build-image-log'.format(id)).append('<br><font color="red">{0}</font>'.format('构建包进行镜像构建{0}失败:{1}'.format(querydata.t.htmlEncode(), this.ErrorMsg)));
                        }
                        else{
                            $.app.show('构建包进行镜像构建{0}失败'.format(querydata.t.htmlEncode()));
                            $('.{0}-build-image-log'.format(id)).append('<br><font color="red">{0}</font>'.format('构建包进行镜像构建{0}失败'.format(querydata.t.htmlEncode())));
                        }

                    }

                })
            }

            let mode = param.mode||'file';
            if(mode=='file'){
                let files = $('#import_file').filebox('files');
                console.log(files)

                if(files.length<1){
                    $.app.show("需要选择进行上传的构建包进行镜像构建")
                    return false;
                }

                $.easyui.file.getReader(function(e){
                    console.log(e);
                    buildFn(data, this.result);

                },function(e){
                    console.log(e);
                },function(e){
                    console.log(e);
                },function(e){
                    console.log(e);
                },function(e){
                    console.log(e);
                },function(e){
                    console.log(e);
                }).readAsArrayBuffer(files[0])
            }else{
                if($.extends.isEmpty(param.remote)){
                    $.app.show("需要选择Git存储库URI或HTTP/HTTPS上下文URI")
                    return false;
                }

                data.remote = param.remote;
                buildFn(data, null);
            }

        }, function () {
            $('#{0}-build-image-progress'.format(id)).progressbar('stopLoading');
        }, 700, 850, null)
}

function createContainerAtImage(){

    createContainer(function (response, data) {
        reloadDg();
        $.app.confirm('创建容器成功, 是否跳转到容器管理模块，对新创建的容器进行管理？选择“是”，进行跳转，否则进行停留在当前页面', function () {
            // $('#layout').layout('collapse', 'east');
            triggerNavMenuClick('ALL', 'containers');
            $('#layout').layout('collapse', 'east');
        });
    });
}

function createAndStartContainerAtImage(){

    createContainer(function(response, data) {
        let info = this;
        let node = local_node;
        reloadDg();

        if($.extends.isEmpty(response.Warnings)){

            $.app.show('创建容器{0}成功, 正在启动容器'.format(response.Id));

            $.docker.request.container.start(function(){
                $.app.confirm('创建启动容器{0}成功, 是否跳转到容器管理模块，对新创建的容器进行管理？选择“是”，进行跳转，否则进行停留在当前页面'.format(response.Id), function () {
                    // $('#layout').layout('collapse', 'east');
                    triggerNavMenuClick('ALL', 'containers');
                    $('#layout').layout('collapse', 'east');
                });

                //$.app.show('容器{0}启动成功'.format(response.Id));
                //reloadDg();
                //triggerNavMenuClick('ALL', 'containers');
                //$('#layout').layout('collapse', 'east');
            }, node, response.Id);
        }else{
            $.app.show('创建容器{0}成功, 出现警告信息，请手动启动容器，{0}'.format(response.Warnings.join(",").htmlEncode()))
        }

    });

}

function openCreateContainerFromImagePanel(rowData){
    if(rowData == null){
        rowData = $.docker.utils.data.newContainer();
    }

    let data = rowData;
    let flag = 1;
    data.Flag = flag;

    removePanel();

    let east_layout_options = {
        region:'east',
        split:false,border:false,width:'100%',collapsed:true,
        iconCls:'fa fa-info-circle',
        collapsible:false,
        showHeader1:false,
        titleformat:'创建容器', title:'创建容器',
        headerCls:'border_right',bodyCls:'border_right',collapsible:true,
        footerHtml: $.templates(create_panel_buttons_html).render({Flag:flag,From:'image'}),
        render:function (panel, option) {

            let cnt = $($.templates(create_container_html).render(data));

            panel.append(cnt);
            $.parser.parse(cnt);

            $('#eastTabs').tabs({
                fit:true,
                border:false,
                tabPosition1:'bottom',
                narrow:true,
                pill:true,
            })

            $('#eastTabs').tabs('disableTab', 1);

            //$('#create_RestartPolicy').iCombobox('setValue', 'no');
        }
    }

    east_layout_options.onPanelClosed = function (option) {
        console.log("Close now");
        console.log(option);
    }

    $('#layout').layout('options').rowData = {};

    $.docker.utils.ui.showSlidePanel($('#layout'), east_layout_options)
}

function createContainerFromImage(idx, id){

    if($.extends.isEmpty(id)){
        let rows = $('#imagesDg').datagrid('getChecked');

        if(rows.length>1){
            $.app.show('本版本仅支持选择一个镜像创建容器');
            return ;
        }

        if(rows.length==0){
            openCreateContainerFromImagePanel(null);
            return;
        }else{
            id = rows[0].ID;
        }
    }

    let node = local_node;

    $.docker.request.image.inspect(function (response){

        let data = $.docker.utils.data.newContainer();
        data.Healthcheck = {};

        data.Image = response.RepoTags[0];

        if(!$.extends.isEmpty(response.Config.ExposedPorts)){
            data.HostConfig.BindingPortMap = $.docker.utils.getPortBindingMap(response.Config.ExposedPorts);
        }

        openCreateContainerFromImagePanel(data)

    }, node, id)
}

function refreshLease(param){

    let pageSize = $.docker.utils.getPageRowsFromParam(param);

    let skip = $.docker.utils.getSkipFromParam(param);

    //let node = $.v3browser.menu.getCurrentTabAttachNode();
    let node = local_node;

    $.docker.request.image.list(function (response) {
        $('#imagesDg').datagrid('loadData', {
            total: response.total,
            rows: response.list
        })
        
        refreshImageAndContainerInfo();
    }, node, skip, pageSize, param.all!=null, param.search_type, param.search_key, param.sort, param.order);
}

function _tagLease(id, repo, tag, fn){

    let node = local_node;

    let row = {
        ID:id,
        Repository:repo,
        Tag:tag
    }

    $.iDialog.openDialog({
        title: '标记镜像',
        minimizable:false,
        id:'tagImgDlg',
        iconCls: 'fa fa-headphones',
        width: 600,
        height: 340,
        href:'./tag.html',
        render:function(opts, handler){
            let d = this;
            console.log("Open dialog");
            handler.render(row)
        },
        buttonsGroup: [{
            text: '标记',
            iconCls: 'fa fa-headphones',
            btnCls: 'cubeui-btn-orange',
            handler:'ajaxForm',
            beforeAjax:function(o){
                let t = this;

                o.ajaxData = $.extends.json.param2json(o.ajaxData);
                let info = o.ajaxData;

                $.app.confirm('确定标记当前镜像为{0}:{1}'.format(info.fromImage, info.tag), function () {

                    $.docker.request.image.tag(function (response) {
                        $.app.show('标记当前镜像为{0}:{1}成功'.format(info.fromImage, info.tag))
                        reloadDg()

                        if(fn)
                            fn.call(t, row, info, response)
                    }, node, id, info.fromImage, info.tag)
                })

                return false;
            }
        }]
    })
}

function tagLease(index, leaseId) {
    let row = $('#imagesDg').datagrid('getRows')[index]

    _tagLease(row.ID, row.Repository, row.Tag)
}

function removeLease(leaseId) {

    let node = local_node;

    if($.extends.isEmpty(leaseId)){
        let rows = $('#imagesDg').datagrid('getChecked');

        if(rows.length == 0) {
            $.app.alert('请选择需要删除的镜像')
        }else{
            $.docker.utils.deleteConfirm('删除镜像', '您确认要删除当前想选择的镜像', function (param, closeFn){

                let ids = $.extends.collect(rows, function(r){
                    if(r.ID=='<none>:<none>'||r.ID=='<none>@<none>')
                        return r.Id;

                    return r.ID;
                });

                $.docker.request.image.deleteBulk(function(response){
                    let msg = '';
                    if(response.fail.length==0){
                        msg = '删除成功，已经成功删除'+response.ok.length+'个镜像';
                    }else{
                        msg = '已经成功删除'+response.ok.length+'个镜像, 失败删除'+response.fail.length+'个镜像';
                    }

                    reloadDg()
                    closeFn()

                    $.app.show(msg)

                }, node, ids, param.force==="1", param.prune==="1")
            }, null, true)
        }

    }else{
        $.docker.utils.deleteConfirm('删除镜像', '您确认要删除当前的镜像', function (param, closeFn){
            $.docker.request.image.delete(function(response){

                let msg = '删除成功，已经成功删除'+response.length+'个镜像';
                $.app.show(msg)

                reloadDg()
                closeFn()
            }, node, leaseId, param.force==="1", param.prune==="1")
        }, null,true)
    }
}

function reloadDg(){
    $('#imagesDg').datagrid('reload');
    $('#layout').layout('resize');
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
                            <input data-toggle="cubeui-checkbox" name="dangling" value="1" label="">
                            <span style='line-height: 30px;padding-right:0px'><b>Dangling</b></span>
                        </div>
                        <div class="cubeui-row">
                            <span style='line-height: 30px;padding-right:0px'><b>清理指定镜像标签:</b>(默认清理全部)</span>
                        </div>
                        <div class="cubeui-row">
                            <span style='line-height: 20px;padding-right:0px;color: red'>label格式: label1=a,label2!=b(不等于),label!=...(没有标签)</span>
                        </div>
                        <div class="cubeui-row">
                            <input type="text" data-toggle="cubeui-textbox" name="labels"
                                   value='' data-options="required:false,prompt:'label格式: label1=a,label2!=b,label!=...'">
                        </div>
                    </div>
                </div>
        `;

    $.docker.utils.optionConfirm('清理镜像', '重要警告：确定要清空所有未使用的镜像，清理后数据卷数据将无法恢复', html,
        function(param, closeFn){

            $.docker.request.image.prune(function(response){
                let msg = '成功清除{0}个镜像，回收空间{1}'.format(response.Count, response.Size)

                closeFn();

                $.app.show(msg)
                reloadDg()
            }, node, param.labels, param.dangling==="1")
        }, null, 400)
}

function pushImage(id){
    if($.extends.isEmpty(id)){
        let rows = $('#imagesDg').datagrid('getChecked');

        if(rows.length>1){
            $.app.show('本版本仅支持选择一个镜像推送至仓库');
            return ;
        }

        if(rows.length==0){
            $.app.show('请选择一个镜像推送至仓库');
            return;
        }else{
            id = rows[0].ID;
        }
    }

    let node = local_node;

    let import_html = `
                <div style="margin: 0px;">
                </div>
                <div class="cubeui-fluid">
                    <fieldset>
                        <legend>推送镜像至仓库选项</legend>
                    </fieldset>
                    <div style="margin-top:5px">
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm12" style="margin-top: 5px">
                                    <label class="cubeui-form-label">镜像名称:</label>
                                    <div class="cubeui-input-block">
                                        <input type="text" data-toggle="cubeui-textbox" name="repos"
                                               value='{0}'
                                               data-options="
                                                        required:true,prompt:'镜像名称，选择填写；比如joinsunsoft/docker-ui:latest'
                                                        "
                                        >
                                    </div>
                                </div>
                                <div class="cubeui-col-sm12" style="margin-top: 5px">
                                    <label class="cubeui-form-label">仓库地址:</label>
                                    <div class="cubeui-input-block">
                                    
                                        <input type="text" name="serveraddress" data-toggle="cubeui-combobox"
                                               value=''
                                               data-options="
                                                        onSelect:function(record){
                                                            console.log(record);
                                                            $('#push_username').textbox('setValue', record.Username);
                                                            $('#push_password').passwordbox('setValue', record.Password);
                                                        },
                                                        required:true,prompt:'镜像仓库地址，格式：https://index.docker.io/v1/ 如果不填写，为默认docker hub仓库',
                                                        valueField:'ID',
                                                        textField:'Name',
                                                        data:$.docker.request.repos.getReposItem()
                                               ">
                                               
                                    <!--
                                        <input type="text" data-toggle="cubeui-textbox" name="serveraddress"
                                               value=''
                                               data-options="
                                                        required:false,prompt:'镜像仓库地址，格式：https://index.docker.io/v1/ 如果不填写，为默认docker hub仓库'
                                                        "
                                        >
                                        -->
                                    </div>
                                </div>
                                
                                <div class="cubeui-col-sm12" style="margin-top: 5px">
                                    <label class="cubeui-form-label">用户名:</label>
                                    <div class="cubeui-input-block">
                                        <input type="text" data-toggle="cubeui-textbox" id='push_username' name="username"
                                               value='{1}'
                                               data-options="
                                                        required:false,prompt:'登录镜像仓库的用户名'
                                                        "
                                        >
                                    </div>
                                </div>
                               
                                <div class="cubeui-col-sm12" style="margin-top: 5px">
                                    <label class="cubeui-form-label">密码:</label>
                                    <div class="cubeui-input-block">
                                        <input type="text" data-toggle="cubeui-passwordbox" id='push_password' name="password"
                                               value='{2}'
                                               data-options="
                                                        required:false,prompt:'登录镜像仓库的用户密码'
                                                        "
                                        >
                                    </div>
                                </div>
                            </div> 
                    </div>
                </div>
        `;

    let username = $.app.localStorage.getItem("repos-docker-username", "");
    let password = $.app.localStorage.getItem("repos-docker-password", "");

    $.docker.request.image.inspect(function (response){

        if($.extends.isEmpty(response.RepoTags)){
            $.app.show("待推送镜像名称和标签不正确，请先给该镜像进行标签操作");
            return false;
        }

        $.docker.utils.optionConfirm('推送至镜像仓库', '选择推送至镜像仓库的推送选项？',
            import_html.format(response.RepoTags[0].htmlEncode(),username.htmlEncode(), password.htmlEncode()),
            function(param, closeFn){

                console.log(param)

                if($.extends.isEmpty(param.repos)){
                    $.app.show("需要填写镜像名称及标签")
                    return false;
                }

                let repos = $.docker.request.repos.getRepoById(node, param.serveraddress);

                if(repos == null){
                    $.app.show('没有找到对应的仓库信息');
                    return false;
                }

                param.serveraddress = repos.Endpoint;

                $.docker.request.image.push(function (json, xhr, status) {
                    console.log(json)
                }, node, param.repos, param.serveraddress, param.username, param.password, function () {
                    $.app.show('镜像已经推送镜像仓库成功');

                    // let key = $.extends.isEmpty(param.serveraddress, "default");

                    $.app.localStorage.saveItem("repos-docker-username", param.username);
                    $.app.localStorage.saveItem("repos-docker-password", param.password);

                    closeFn();
                    reloadDg()
                });

            }, null, 500);

    }, node, id);

}

var menuContextRow = null;

function pullImage(){
    let node = local_node;

    $.iDialog.openDialog({
        title: '拉取镜像',
        minimizable:false,
        id:'pullImgDlg',
        width: 600,
        height: 440,
        href:'./pull.html',
        render:function(opts, handler){
            let d = this;
            console.log("Open dialog");
            handler.render({})
        },
        leftButtonsGroup:[{
            text: '搜索镜像',
            iconCls: 'fa fa-search',
            btnCls: 'cubeui-btn-blue',
            handler1:'ajaxForm',
            handler:function(o){

                let dlgObj = $.iDialog.findOutterFormJquery(this)
                let imageName = $(dlgObj).find("input[name='fromImage']").val()

                $.iDialog.openDialog({
                    title: '搜索镜像',
                    minimizable:false,
                    id:'queryForm-search',
                    width: 1200,
                    height: 640,
                    href:'./search.html',
                    render:function(opts, handler){

                        handler.render({"imageName":imageName})

                        let params = {}

                        if(!$.extends.isEmpty(imageName)){
                            params.search = 1;
                            params.term = imageName;
                        }

                        $(function () {
                            $("#searchDg").iDatagrid({
                                idField: 'name',
                                sortOrder: 'desc',
                                sortName: 'star_count',
                                pageSize: 10,
                                queryParams:params,
                                onBeforeLoad:function (param){
                                    return refreshSearch(param)
                                },
                                onRowContextMenu:function(e, index, row){
                                    menuContextRow = row

                                    $('#searchImageMm').menu('show', {
                                        left: e.pageX,
                                        top: e.pageY
                                    });

                                    $.extends.stopPropagation(e);

                                    return false;
                                },
                                frozenColumns:[[
                                    {field: 'name', title: 'NAME', sortable: true,
                                        formatter:$.iGrid.tooltipformatter(),
                                        width: 300}
                                ]],
                                columns: [[
                                    {field: 'description', title: 'DESCRIPTION', sortable: true,
                                        formatter:$.iGrid.tooltipformatter(),width: 540},
                                    {field: 'star_count', title: 'STARS', sortable: true,
                                        formatter:$.iGrid.tooltipformatter(),width: 100},
                                    {field: 'official', title: 'OFFICIAL', sortable: true,
                                        formatter:$.iGrid.tooltipformatter(),width: 100},
                                    {field: 'automated', title: 'AUTOMATED', sortable: true,
                                        formatter:$.iGrid.tooltipformatter(),width: 120}
                                ]],
                            })
                        })
                    },
                })
            }
        }],
        buttonsGroup: [{
            text: '拉取镜像',
            iconCls: 'fa fa-plus-square-o',
            btnCls: 'cubeui-btn-orange',
            handler:'ajaxForm',
            beforeAjax:function(o){
                let t = this;

                o.ajaxData = $.extends.json.param2json(o.ajaxData);
                let info = o.ajaxData;

                console.log(info)

                let repos = $.docker.request.repos.getRepoById(node, info.repo);

                if(repos == null){
                    $.app.show('没有找到对应的仓库信息');
                    return false;
                }

                info.repo = repos.Endpoint;

                $.docker.request.image.pull(function (response) {
                    $.app.show('拉取镜像{0}:{1}成功'.format(info.fromImage, info.tag))
                    reloadDg()
                }, node, info.repo, info.fromImage, info.tag, function(xhr, state){
                    console.log('onSend')
                    console.log(xhr)

                    if(state==1){
                        console.log('onSendOver')
                        $.app.show('pull镜像请求已经发送')
                        //$.iDialog.closeOutterDialog($(t))
                        //reloadDg()
                    }
                }, info.username, info.password)

                return false;
            }
        }]
    });
}

function loadImage(){

    let node = local_node;

    let load_html = `
                <div style="margin: 0px;">
                </div>
                <div class="cubeui-fluid">
                    <fieldset>
                        <legend>加载选项</legend>
                    </fieldset>
                    <div style="margin-top:5px">
                            <div class="cubeui-row">                                
                                <div class="cubeui-col-sm12" style="margin-top: 5px">
                                    <label class="cubeui-form-label">镜像文件:</label>
                                    <div class="cubeui-input-block">
                                        <input  data-toggle="cubeui-filebox" id="load_file" data-options="
                                            prompt:'从本地文件系统选择已导出的镜像tar文件...',
                                            buttonText: '选择文件',
                                            accept:'.tar',
                                            " style="width:100%">  
                                    </div>
                                </div>
                            </div> 
                    </div>
                </div>
        `;

    $.docker.utils.optionConfirm('导入', '选择镜像文件加载镜像？', load_html,
        function(param, closeFn){
            console.log(param)

            let files = $('#load_file').filebox('files');
            $.easyui.file.getReader(function(e){
                console.log(e);
                $.docker.request.image.import2(function (response) {
                    console.log(response);
                }, node, this.result, function(){
                    $.app.show('加载成功');
                    reloadDg()
                });
            },function(e){
                console.log(e);
            },function(e){
                console.log(e);
            },function(e){
                console.log(e);
            },function(e){
                console.log(e);
            },function(e){
                console.log(e);
            }).readAsArrayBuffer(files[0])

        }, null, 400);
}

function importImage(){

    let node = local_node;

    let import_html = `
                <div style="margin: 0px;">
                </div>
                <div class="cubeui-fluid">
                    <fieldset>
                        <legend>导入选项</legend>
                    </fieldset>
                    <div style="margin-top:5px">
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm12" style="margin-top: 5px">
                                    <label class="cubeui-form-label">镜像名称:</label>
                                    <div class="cubeui-input-block">
                                        <input type="text" data-toggle="cubeui-textbox" id="fromImage" name="fromImage"
                                               value=''
                                               data-options="
                                                        required:false,prompt:'镜像名称，选择填写；比如joinsunsoft/docker-ui'
                                                        "
                                        >
                                    </div>
                                </div>
                                <div class="cubeui-col-sm12" style="margin-top: 5px">
                                    <label class="cubeui-form-label">TAG:</label>
                                    <div class="cubeui-input-block">
                                        <input type="text" data-toggle="cubeui-textbox" name="tag"
                                               value=''
                                               data-options="
                                                        required:false,prompt:'TAG，选择填写；为空使用默认latest'
                                                        "
                                        >
                                    </div>
                                </div>
                                <div class="cubeui-col-sm12" style="margin-top: 5px">
                                    <label class="cubeui-form-label">Tarball文件:</label>
                                    <div class="cubeui-input-block">
                                        <input  data-toggle="cubeui-filebox" id="import_file" data-options="
                                            prompt:'从本地文件系统选择Tarball文件...',
                                            buttonText: '选择文件',
                                            accept:'.tar',
                                            " style="width:100%">  
                                    </div>
                                </div>
                                <div class="cubeui-col-sm12" style="margin-top: 5px">
                                    <label class="cubeui-form-label">备注:</label>
                                    <div class="cubeui-input-block">
                                        <input type="text" data-toggle="cubeui-textbox" name="message"
                                               value=''
                                               data-options="
                                                        required:false,prompt:'导入的备注信息'
                                                        "
                                        >
                                    </div>
                                </div>
                            </div> 
                    </div>
                </div>
        `;

    $.docker.utils.optionConfirm('导入', '选择tarball文件导入镜像？', import_html,
        function(param, closeFn){


            console.log(param)

            if($.extends.isEmpty(param.fromImage)){
                $.app.show("需要填写新镜像")
                return false;
            }

            param.tag = $.extends.isEmpty(param.tag, "latest");

            let files = $('#import_file').filebox('files');
            console.log(files)

            $.easyui.file.getReader(function(e){
                console.log(e);
                
                $.docker.request.image.import(function (response) {

                    $.app.show('导入成功');
                    //closeFn();
                    reloadDg()

                }, node, this.result, param.fromImage, param.tag, param.message);

            },function(e){
                console.log(e);
            },function(e){
                console.log(e);
            },function(e){
                console.log(e);
            },function(e){
                console.log(e);
            },function(e){
                console.log(e);
            }).readAsArrayBuffer(files[0])

        }, null, 400);
}

function inspectImage(idx){
    showImagePanel(idx)
}
function showImagePanel(index){

    let node = local_node;
    let row = $('#imagesDg').datagrid('getRows')[index]
    let id = row.Id;

    $.docker.request.image.inspect(function (response){
        let rowData = response;
        rowData.Name = row.Name;

        $('#layout').layout('remove', 'east');

        let east_layout_options = {
            region:'east',
            split:false,border:false,width:'100%',collapsed:true,
            iconCls:'fa fa-info-circle',
            collapsible:false,
            showHeader1:false,
            titleformat:'{0}-镜像信息'.format(row.Name, row.ID), title:'镜像',
            headerCls:'border_right',bodyCls:'border_right',collapsible:true,
            footerHtml:`
        <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                    _tagLease('{0}','{1}','{2}', function(){
                        inspectImage({3});
                    })
            },
            btnCls: 'cubeui-btn-orange',
            iconCls: 'fa fa-headphones'
        }">标记</a>
        <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
                onClick:function(){
                    pushImage('{0}');
                },
                extend: '#imagesDg-toolbar',
                btnCls: 'cubeui-btn-ivory',
                iconCls: 'fa fa-arrow-circle-up'
            }">推送镜像</a>
        <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){                    
                    createContainerFromImage({3}, '{0}');
            },
            btnCls: 'cubeui-btn-blue',
            iconCls: 'fa fa-superpowers'
        }">创建容器</a>
         <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                    $('#layout').layout('collapse', 'east');
            },
            btnCls: 'cubeui-btn-red',
            iconCls: 'fa fa-close'
        }">关闭</a>
        `.format(row.ID, row.Repository, row.Tag, index),
            render:function (panel, option) {
                let cnt = $($.templates(image_html_template).render(rowData));

                panel.append(cnt);
                $.parser.parse(cnt);

                $('#eastTabs').tabs({
                    fit:true,
                    border:false,
                    bodyCls1:'border_right_none,border_bottom_none',
                    tabPosition1:'bottom',
                    narrow:true,
                    pill:true,
                })

                $.docker.request.image.history(function (res){

                    $('#historysDg').iDatagrid({
                        pagination:false,
                        showHeader:true,
                        showFooter:true,
                        frozenColumns:[[
                            {field: 'Image', title: 'IMAGE', sortable: false,
                                formatter:$.iGrid.tooltipformatter(),width: 400},
                        ]],
                        data:res,
                        columns: [[
                            {field: 'CreatAt', title: 'CREATED', sortable: false,
                                formatter:$.iGrid.tooltipformatter(),
                                width: 180},
                            {field: 'CreatedBy', title: 'CREATED BY', sortable: false,
                                formatter:$.iGrid.tooltipformatter(),width: 550},
                            {field: 'SizeStr', title: 'SIZE', sortable: false,
                                formatter:$.iGrid.tooltipformatter(),width: 100},
                            {field: 'Comment', title: 'COMMENT', sortable: false,
                                formatter:$.iGrid.tooltipformatter(),width: 400}
                        ]]
                    })

                }, node, id);

                let json = $.extend({}, response.ORIG)
                $("#json").JSONView(json);
            }
        }

        $.docker.utils.ui.showSlidePanel($('#layout'), east_layout_options)
        let opts = $.iLayout.getLayoutPanelOptions('#layout',  'east');
        console.log(opts)


    }, node, id)
}

function pullImgFromMenu(){
    let row = menuContextRow;

    let node = local_node;

    $.docker.request.image.pull(function (response) {
        $.app.show('拉取镜像{0}:{1}成功'.format(row.name, 'latest'))
        reloadDg()
    }, node, null, row.name, 'latest', function(xhr, state){
        console.log('onSend')
        console.log(xhr)

        if(state==1){
            console.log('onSendOver')
            $.app.show('pull镜像{0}:{1}请求已经发送'.format(row.name, 'latest'))
        }
    })

}

function setImgFromMenu(){
    let row = menuContextRow;
    $('#pullImgDlg').find('#fromImage').textbox('setValue', row.name)
    $.iDialog.closeDialog('queryForm-search')
}

function refreshSearch(p) {
    if(!p.search){
        return ;
    }

    if($.extends.isEmpty(p.term)){
        $.app.show('没有输入过滤条件');
        return false;
    }

    let pageSize = $.docker.utils.getPageRowsFromParam(p);
    let skip = $.docker.utils.getSkipFromParam(p);

    let node = local_node;

    $.docker.request.image.search(function (response) {
        $('#searchDg').datagrid('loadData', {
            total: response.total,
            rows: response.list
        })
    }, node, skip, pageSize,
        (p.is_official===null||p.is_official==='ALL')?null:p.is_official,
        (p.is_automated===null||p.is_automated=='ALL')?null:p.is_automated,
        p.stars===null?null:p.stars,
        p.term, p.sort, p.order);
}


let image_html_template = `
        <div data-toggle="cubeui-tabs" id='eastTabs'>
            <div title="基础信息"
                 data-options="id:'eastTab0',iconCls:'fa fa-headphones'">                 
                <div style="margin: 0px;">
                </div>
                
                <div class="cubeui-fluid">
                    <fieldset>
                        <legend>镜像信息</legend>
                    </fieldset>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">NAME:</label>
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
                            <label class="cubeui-form-label">ID:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>Id}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">RepoTags:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>RepoTagStr}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">RepoDigests:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>RepoDigestStr}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Parent:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>Parent}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Comment:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>Comment}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">CreatAt:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>CreatAt}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                   
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">DockerVersion:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>DockerVersion}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Author:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>Author}}'
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
                                       value='{{>Os}} {{>Architecture}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Size:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>SizeStr}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                   
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">LastTagTime:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>LastTagTimeStr}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                
                </div>          
                 
            </div>
            <div title="构建信息"
                 data-options="id:'eastTab1',iconCls:'fa fa-superpowers'">
                <div style="margin: 0px;">
                </div>
                
                <div class="cubeui-fluid">
                    <fieldset>
                        <legend>构建信息</legend>
                    </fieldset>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">NAME:</label>
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
                            <label class="cubeui-form-label">ID:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>Id}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Container:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>Container}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Image:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>ContainerConfig.Image}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Hostname:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>ContainerConfig.Hostname}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Domainname:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>ContainerConfig.Domainname}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">User:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>ContainerConfig.User}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm6">
                            <label class="cubeui-form-label">AttachStdin:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:ContainerConfig.AttachStdin}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                        <div class="cubeui-col-sm6">
                            <label class="cubeui-form-label">AttachStdout:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:ContainerConfig.AttachStdout}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm6">
                            <label class="cubeui-form-label">AttachStderr:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:ContainerConfig.AttachStderr}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                        <div class="cubeui-col-sm6">
                            <label class="cubeui-form-label">Tty:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:ContainerConfig.Tty}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm6">
                            <label class="cubeui-form-label">OpenStdin:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:ContainerConfig.OpenStdin}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                        <div class="cubeui-col-sm6">
                            <label class="cubeui-form-label">StdinOnce:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:ContainerConfig.StdinOnce}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">WorkingDir:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>ContainerConfig.WorkingDir}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <fieldset>
                        <legend style="margin-bottom: 0px;">Env</legend>
                    </fieldset>
                
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            {{for ContainerConfig.EnvList}}
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm10 cubeui-col-sm-offset1">
                                    <span style='line-height: 20px;padding-right:0px;'>{{:value}}</span>
                                </div>
                            </div>
                            {{/for}}
                        </div>
                    </div>
                    
                    <fieldset>
                        <legend style="margin-bottom: 0px;">Cmd</legend>
                    </fieldset>
                
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm10 cubeui-col-sm-offset1">
                            <div class="cubeui-row">
                                <span style='line-height: 20px;padding-right:0px;'>{{:ContainerConfig.CmdStr}}</span>
                            </div>
                        </div>
                    </div>
                    
                    <fieldset>
                        <legend style="margin-bottom: 0px;">Entrypoint</legend>
                    </fieldset>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            {{for ContainerConfig.EntrypointList}}
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm10 cubeui-col-sm-offset1">
                                    <span style='line-height: 20px;padding-right:0px;'>{{:value}}</span>
                                </div>
                            </div>
                            {{/for}}
                        </div>
                    </div>
                    
                    <fieldset>
                        <legend style="margin-bottom: 0px;">Volume</legend>
                    </fieldset>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <div class="cubeui-row" style="margin-top: 0px;">
                                <div class="cubeui-col-sm4 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <span style='line-height: 20px;padding-right:0px;'>源数据卷</span>
                                </div>
                                <div class="cubeui-col-sm5" >
                                    <span style='line-height: 20px;padding-right:0px;'>目标</span>
                                </div>
                            </div>
                            {{for ContainerConfig.Volumes}}
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm10 cubeui-col-sm-offset1">
                                    <span style='line-height: 20px;padding-right:0px;'>{{:src}}</span>
                                </div>
                            </div>
                            {{/for}}
                        </div>
                    </div>
                    
                    <fieldset>
                        <legend style="margin-bottom: 0px;">ExposedPorts</legend>
                    </fieldset>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <div class="cubeui-row"  style="margin-top: 0px;">
                                <div class="cubeui-col-sm4 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <span style='line-height: 20px;padding-right:0px;'>端口</span>
                                </div>
                            </div>
                            {{props ContainerConfig.ExposedPorts}}
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm4 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <span style='line-height: 20px;padding-right:0px;'>{{>key}}</span>
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
                            <div class="cubeui-row"  style="margin-top: 0px;">
                                <div class="cubeui-col-sm4 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <span style='line-height: 20px;padding-right:0px;'>标签</span>
                                </div>
                                <div class="cubeui-col-sm5" >
                                    <span style='line-height: 20px;padding-right:0px;'>值</span>
                                </div>
                            </div>
                            {{props ContainerConfig.Labels}}
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm4 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <span style='line-height: 20px;padding-right:0px;'>{{>key}}</span>
                                    
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
            
            
            <div title="配置信息" 
                 data-options="id:'eastTab2',iconCls:'fa fa-gear'">
                <div style="margin: 0px;">
                </div>
                
                <div class="cubeui-fluid">
                    <fieldset>
                        <legend>构建信息</legend>
                    </fieldset>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">NAME:</label>
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
                            <label class="cubeui-form-label">ID:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>Id}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Image:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>Config.Image}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Hostname:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>Config.Hostname}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Domainname:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>Config.Domainname}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">User:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>Config.User}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm6">
                            <label class="cubeui-form-label">AttachStdin:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:Config.AttachStdin}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                        <div class="cubeui-col-sm6">
                            <label class="cubeui-form-label">AttachStdout:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:Config.AttachStdout}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm6">
                            <label class="cubeui-form-label">AttachStderr:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:Config.AttachStderr}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                        <div class="cubeui-col-sm6">
                            <label class="cubeui-form-label">Tty:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:Config.Tty}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm6">
                            <label class="cubeui-form-label">OpenStdin:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:Config.OpenStdin}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                        <div class="cubeui-col-sm6">
                            <label class="cubeui-form-label">StdinOnce:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:Config.StdinOnce}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm6">
                            <label class="cubeui-form-label">StopSignal:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:Config.StopSignal}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">WorkingDir:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>Config.WorkingDir}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <fieldset>
                        <legend style="margin-bottom: 0px;">Env</legend>
                    </fieldset>
                
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            {{for Config.EnvList}}
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm10 cubeui-col-sm-offset1">
                                    <span style='line-height: 20px;padding-right:0px;'>{{:value}}</span>
                                </div>
                            </div>
                            {{/for}}
                        </div>
                    </div>
                    
                    <fieldset>
                        <legend style="margin-bottom: 0px;">Cmd</legend>
                    </fieldset>
                
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm10 cubeui-col-sm-offset1">
                            <div class="cubeui-row">
                                <span style='line-height: 20px;padding-right:0px;'>{{:Config.CmdStr}}</span>
                            </div>
                        </div>
                    </div>
                    
                    <fieldset>
                        <legend style="margin-bottom: 0px;">Entrypoint</legend>
                    </fieldset>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            {{for Config.EntrypointList}}
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm10 cubeui-col-sm-offset1">
                                    <span style='line-height: 20px;padding-right:0px;'>{{:value}}</span>
                                </div>
                            </div>
                            {{/for}}
                        </div>
                    </div>
                    
                    <fieldset>
                        <legend style="margin-bottom: 0px;">Volume</legend>
                    </fieldset>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <div class="cubeui-row" style="margin-top: 0px;">
                                <div class="cubeui-col-sm4 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <span style='line-height: 20px;padding-right:0px;'>源数据卷</span>
                                </div>
                                <div class="cubeui-col-sm5" >
                                    <span style='line-height: 20px;padding-right:0px;'>目标</span>
                                </div>
                            </div>
                            {{if Config.Volumes}}
                            {{for Config.Volumes}}
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm10 cubeui-col-sm-offset1">
                                    <span style='line-height: 20px;padding-right:0px;'>{{:src}}</span>
                                </div>
                            </div>
                            {{/for}}
                            {{/if}}
                        </div>
                    </div>
                    
                    <fieldset>
                        <legend style="margin-bottom: 0px;">ExposedPorts</legend>
                    </fieldset>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <div class="cubeui-row"  style="margin-top: 0px;">
                                <div class="cubeui-col-sm4 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <span style='line-height: 20px;padding-right:0px;'>端口</span>
                                </div>
                            </div>
                            {{props Config.ExposedPorts}}
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm4 cubeui-col-sm-offset1" style="padding-right: 5px">
                                <span style='line-height: 20px;padding-right:0px;'>{{>key}}</span>
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
                            <div class="cubeui-row"  style="margin-top: 0px;">
                                <div class="cubeui-col-sm4 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <span style='line-height: 20px;padding-right:0px;'>标签</span>
                                </div>
                                <div class="cubeui-col-sm5" >
                                    <span style='line-height: 20px;padding-right:0px;'>值</span>
                                </div>
                            </div>
                            {{props Config.Labels}}
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm4 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <span style='line-height: 20px;padding-right:0px;'>{{>key}}</span>
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
            
            <div title="历史信息" 
             data-options="id:'eastTab3',iconCls:'fa fa-history',fit:true, border:false">   
                <table id="historysDg"></table>
            </div>
            
            <div title="Json" 
             data-options="id:'eastTab4',iconCls:'fa fa-text-width',fit:true, border:false">   
                <div id="json" style="word-break:break-all!important;"></div>
            </div>
        </div>
        
`

function onActivated(opts, title, idx){
    console.log('Image onActivated')
    reloadDg();
    //refreshCharts();
}