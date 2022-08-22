function loadLease(){

    // let node = $.docker.menu.getCurrentTabAttachNode();
    let node = local_node;

    $(function(){
        $("#containersDg").iDatagrid({
            idField: 'ID',
            sortOrder:'asc',
            sortName:'Id',
            pageSize:50,
            queryParams:{all:1},
            frozenColumns:[[
                {field: 'ID', title: '', checkbox: true},
                {field: 'op', title: '操作', sortable: false, halign:'center',align:'left',
                    width1: 300, formatter:leaseOperateFormatter},
                {field: 'Name', title: 'NAME', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 160},
                {field: 'Id', title: 'CONTAINER ID', sortable: true,
                    formatter:$.iGrid.buildformatter([$.iGrid.templateformatter('{Id}'), $.iGrid.tooltipformatter()]),
                    width: 260},
            ]],
            onBeforeLoad:function (param){
                console.log(param)
                refreshLease(param)
            },
            columns: [[
                {field: 'Image', title: 'IMAGE', sortable: true,
                    formatter:$.iGrid.tooltipformatter('ImageID'),
                    width: 220},
                {field: 'Command', title: 'COMMAND', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 220},
                {field: 'SizeRootFs', title: 'SIZE', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),width: 100},
                {field: 'Status', title: 'STATUS', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 220},
                {field: 'Port', title: 'PORTS', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 350},
                {field: 'IPStr', title: 'IP', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 150},
                {field: 'MACStr', title: 'MAC', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 150},
                {field: 'Created', title: 'CREATED', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),
                    width: 180},
                {field: 'LabelStr', title: 'LABELS', sortable: true,
                    formatter:$.iGrid.tooltipformatter(),width: 900}
            ]],
            onLoadSuccess:$.easyui.event.wrap(
                $.fn.iDatagrid.defaults.onLoadSuccess,
                function(data){
                    console.log("@@@@@@@@@@@@@@@@");
                    let dg = this;
                    if(data.rows){
                        $.each(data.rows, function (idx, val) {
                        });
                    }
                }
            ),
        });
    });
}

function leaseOperateFormatter(value, row, index) {
    let htmlstr = "";

    //superpowers
    htmlstr += '<button class="layui-btn-orange layui-btn layui-btn-xs" onclick="inspectContainer(\'' + row.ID + '\')">查看</button>';



    if(row.Running==1){
        htmlstr += '<button class="layui-btn-ivory layui-btn layui-btn-xs" onclick="restartContainer(\'' + row.ID + '\')">重启</button>';
        htmlstr += '<button class="layui-btn-brown layui-btn layui-btn-xs" onclick="stopLease(\'' + row.ID + '\', \'' + index + '\')">停止</button>';
        htmlstr += '<button class="layui-btn-dodgerblue layui-btn layui-btn-xs" onclick="killLease(\'' + row.ID + '\', \'' + index + '\')">强止</button>';
        htmlstr += '<button class="layui-btn-olive layui-btn layui-btn-xs" onclick="showConsole(\'' + row.ID + '\', \'' + index + '\')">控制台</button>';
        htmlstr += '<button class="layui-btn-gray layui-btn layui-btn-xs" onclick="execContainer(\'' + row.ID + '\')">执行</button>';
    }else{
        htmlstr += '<button disabled class="layui-btn-ivory layui-btn layui-btn-xs disabled" onclick="restartContainer(\'' + row.ID + '\')">重启</button>';
        htmlstr += '<button class="layui-btn-yellowgreen layui-btn layui-btn-xs" onclick="startLease(\'' + row.ID + '\', \'' + index + '\')">启动</button>';
        htmlstr += '<button disabled class="layui-btn-dodgerblue layui-btn layui-btn-xs disabled" onclick="killLease(\'' + row.ID + '\', \'' + index + '\')">强止</button>';
        htmlstr += '<button disabled class="layui-btn-olive layui-btn layui-btn-xs disabled" onclick="showConsole(\'' + row.ID + '\', \'' + index + '\')">控制台</button>';
        htmlstr += '<button disabled class="layui-btn-gray layui-btn layui-btn-xs disabled" onclick="execContainer(\'' + row.ID + '\')">执行</button>';
    }
    htmlstr += '<button class="layui-btn-red layui-btn layui-btn-xs" onclick="removeLease(\'' + index + '\', \'' + row.ID + '\')">删除</button>';
    htmlstr += '<button class="layui-btn-blue layui-btn layui-btn-xs" onclick="showLog(\'' + row.ID + '\', \'' + index + '\')">日志</button>';

    return htmlstr;
}

function removePanel(){
    $('#layout').layout('remove', 'east');
}

function runContainer(){
    createContainer(function(response, data) {
        let info = this;
        let node = local_node;
        reloadDg();

        showLog(response.Id);

        $.docker.request.container.start(function(response2){
            reloadDg();

            if($.extends.isEmpty(response.Warnings)){
                $.app.show('容器{0}运行成功'.format(info.Name));
            }else{
                $.app.show('容器{0}运行成功, 出现警告信息{0}'.format(response.Warnings.join(",").htmlEncode()))
            }
            //$('#layout').layout('collapse', 'east');
        }, node, response.Id);
    });
}

function cloneContainer(id, flag){

    let node = local_node;

    $.docker.request.container.inspect(function (response) {
        let newContainerData = $.docker.utils.data.newContainer();

        newContainerData = $.extend(true, newContainerData, response);

        newContainerData.Name = response.Name;
        newContainerData.Image = response.ImageName;
        newContainerData.WorkingDir = response.Config.WorkingDir;
        newContainerData.HostConfig.RestartPolicy = response.HostConfig.RestartPolicy;
        newContainerData.HostConfig.PublishAllPorts = response.HostConfig.PublishAllPorts;
        newContainerData.HostConfig.BindingPortMap = $.docker.utils.getPortBindingMap(response.HostConfig.PortBindings);
        newContainerData.HostConfig.Labels = response.Config.Labels;

        newContainerData.Hostname = response.Config.Hostname;
        newContainerData.HostConfig.Privileged = response.HostConfig.Privileged;
        newContainerData.HostConfig.AutoRemove = response.HostConfig.AutoRemove;
        newContainerData.Domainname = response.Config.Domainname;
        newContainerData.User = response.Config.User;
        newContainerData.NetworkingConfig.MacAddress = response.NetworkSettings.MacAddress;

        newContainerData.Mounts = response.Mounts;

        newContainerData.Config.CmdStr = $.docker.utils.getListStr(response.Config.Cmd, ' ');
        newContainerData.Config.EntrypointStr = $.docker.utils.getListStr(response.Config.Entrypoint, ' ');

        newContainerData.Config.Env = $.docker.utils.getKeyValue(response.Config.Env);
        newContainerData.Config.Cmd = $.docker.utils.list2ObjectList(response.Config.Cmd);
        newContainerData.Config.Entrypoint = $.docker.utils.list2ObjectList(response.Config.Entrypoint);

        newContainerData.HostConfig.Links = $.docker.utils.getKeyValue(response.HostConfig.LinkAlias, ":");


        createContainerPanel(newContainerData, flag);
    }, node, id);
}

function cloneContainerPanel(){
    let rows = $('#containersDg').datagrid('getChecked');
    if(rows.length>1){
        $.app.show('本版本仅支持选择一个容器进行克隆');
        return ;
    }

    if(rows.length==0){
        $.app.show('选择一个容器进行克隆');
        return ;
    }

    cloneContainer(rows[0].ID);
}

function createContainerPanel(data, flag){
    flag = flag||1;

    let node = local_node;
    removePanel();

    let title = '创建容器';
    let iconCls = 'fa fa-info-circle';

    if(flag == 2){
        title = '运行容器';
        iconCls = 'fa fa-play-circle-o';
    }
    else if(flag == 3){
        title = '执行命令';
        iconCls = 'fa fa-random';
    }

    let east_layout_options = {
        region:'east',
        split:false,border:false,width:'100%',collapsed:true,
        iconCls:iconCls,
        collapsible:false,
        showHeader1:false,
        titleformat:title, title:'创建容器',
        headerCls:'border_right',bodyCls:'border_right',collapsible:true,
        footerHtml: $.templates(create_panel_buttons_html).render({Flag:flag}),
        // render1:$.templates(html_template).render(rowData),
        render:function (panel, option) {

            if(data==null){
                data = $.docker.utils.data.newContainer();
            }

            //let newContainer = $.docker.utils.data.newContainer();
            let newContainer = data;
            newContainer.Flag = flag;

            let cnt = $($.templates(create_container_html).render(newContainer));

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

            $('#create_RestartPolicy').iCombobox('setValue', newContainer.HostConfig.RestartPolicy.Name||'');
        }
    }

    east_layout_options.onPanelClosed = function (option) {
        console.log("Close now");
        console.log(option);
    }

    $('#layout').layout('options').rowData = {};

    $.docker.utils.ui.showSlidePanel($('#layout'), east_layout_options)
}

function inspectContainer(id){
    showContainerPanel(id)
}


function showContainerPanel(id){

    let node = local_node;

    let index = $('#containersDg').datagrid('getRowIndex', id);
    let row = $('#containersDg').datagrid('getRows')[index];

    $.docker.request.container.inspect(function (response){
        let rowData = response;
        rowData.Name = response.Name;

        removePanel();

        let east_layout_options = {
            region:'east',
            split:false,border:false,width:'100%',collapsed:true,
            iconCls:'fa fa-info-circle',
            collapsible:false,
            showHeader1:false,
            titleformat:'{0}-容器信息'.format(row.Name, row.ID), title:'容器',
            headerCls:'border_right',bodyCls:'border_right',collapsible:true,
            footerHtml: panel_buttons_html.format(row.ID, row.Repository, row.Tag, index),
            onBeforeDestroy:function () {
                if(!$.extends.isEmpty($('#eastTabs'))){
                    let tabs = [];
                    $.each($('#eastTabs').tabs('tabs'), function(idx, v){
                        tabs.push($(v).panel('options').title)
                    });
                    $.each(tabs, function (idx, title) {
                        console.log(title);
                    })
                }

                if(current_ws.console!= null && current_ws.console.readyState == 1){
                    closeWs(current_ws.console)
                }
                if(current_ws.exec!= null && current_ws.exec.readyState == 1){
                    closeWs(current_ws.exec)
                }
            },
            // render1:$.templates(html_template).render(rowData),
            render:function (panel, option) {

                rowData.CmdLine = buildCommand(rowData);

               let cnt = $($.templates(html_template).render(rowData));

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

                if(response.Running==1){
                    $('#tab_start_btn').hide();
                    $('#tab_stop_btn').show();
                }else{
                    $('#tab_start_btn').show();
                    $('#tab_stop_btn').hide();
                }

                $('#view_RestartPolicy').iCombobox('setValue', rowData.HostConfig.RestartPolicy.Name||'');

                let json = $.extend({}, response.ORIG)
                $("#json").JSONView(json);
            }
        }

        east_layout_options.onPanelClosed = function (option) {
            console.log("Close now");
            console.log(option);
            let logXhr = $('#layout').layout('options').logXhr;
            if(logXhr){
                $('#layout').layout('options').logXhr = null;
                try{
                    console.log("Close logXhr")
                    logXhr.abort()
                }catch (e) {

                }
                //option.xhr = xhr
            }

            let statXhr = $('#layout').layout('options').statXhr;
            if(statXhr){
                $('#layout').layout('options').statXhr = null;
                try{
                    console.log("Close statXhr")
                    statXhr.abort()
                }catch (e) {

                }
                //option.xhr = xhr
            }
        }

        east_layout_options.rowData = rowData;
        $('#layout').layout('options').rowData = rowData;

        $.docker.utils.ui.showSlidePanel($('#layout'), east_layout_options)
        let opts = $.iLayout.getLayoutPanelOptions('#layout',  'east');
        console.log(opts)


    }, node, id)
}

function showLogTab(id){

    let node = local_node;

    let rowData = $('#layout').layout('options').rowData;
    let logXhr = $('#layout').layout('options').logXhr;

    addPanel({
        title:"日志",
        id:'eastTab3',
        iconCls:'fa fa-history',
        fit:true,
        border:false
    }, $.templates(log_tab_html).render(rowData), function (panel, title, flag) {
        if(logXhr){

        }else{
            logXhr = $.docker.request.container.log(node, id, function (chunk, state, xhr) {
                console.log("Container Log")
                if(!$.extends.isEmpty(chunk)){
                    //let panelTarget = $(panel).find('#eastTab3');
                    let panelTarget = $(panel);

                    $.each(chunk, function (idx, v) {
                        let newLog = $('<span></span>');
                        newLog.html(v.htmlEncodeBracket().replaceAll('\n', '<br>'))

                        newLog.appendTo(panelTarget.find('.container-logs'))
                    });

                    scrollBottom($(panelTarget));
                    $(panelTarget).find('t').html('[已启动]');
                }

            }, function (xhr, state) {
                console.log('onSend')
            }, function (xhr, state){
                console.log("Log is finished")
                $(panel).find('t').html('[已停止]');
                $('#layout').layout('options').logXhr = null;
            })

            if(logXhr){
                $('#layout').layout('options').logXhr = logXhr
                //option.xhr = xhr
            }
        }
    })
}

function pauseLease(id){
    let node = local_node;
    $.docker.request.container.pause(function(response){
        $.app.show('暂停容器所有进程完成');
        showProcess(id)
    }, node, id)
}

function resumeLease(id){
    let node = local_node;
    $.docker.request.container.unpause(function(response){
        $.app.show('恢复容器所有进程完成');
        showProcess(id)
    }, node, id)
}

function showUsage(id){
    let node = local_node;

    let statXhr = $('#layout').layout('options').statXhr;

    addPanel({
        title:"状况",
        iconCls:'fa fa-thermometer-half',
        fit:true,
        selected:true,
        border:false
    }, usage_tab_html.format(id), function (panel, title, flag) {

        if(statXhr){

        }else{

            statXhr = $.docker.request.container.usage(node, id, function(json, state, xhr){

                console.log("Container Stat")

                if(!$.extends.isEmpty(json)){
                    let panelTarget = $(panel);

                    let read_time = $.docker.utils.getDateStr4GMT(json.read)
                    let preread_time = $.docker.utils.getDateStr4GMT(json.preread)

                    if($.extends.isEmpty(read_time)){

                    }else{
                        json.data = {};

                        json.data.read = read_time;
                        json.data.preread = preread_time;

                        let used_memory = json.memory_stats.usage - json.memory_stats.stats.cache;
                        let available_memory = json.memory_stats.limit;
                        let memory_usage_percentage = ((used_memory / available_memory) * 100.0).toFixed(2);
                        let cpu_delta = json.cpu_stats.cpu_usage.total_usage - json.precpu_stats.cpu_usage.total_usage;
                        let system_cpu_delta = (json.cpu_stats.system_cpu_usage - json.precpu_stats.system_cpu_usage)||cpu_delta;
                        let number_cpus = json.cpu_stats.online_cpus;
                        let cpu_usage_percentage = ((cpu_delta / system_cpu_delta) * number_cpus * 100.0).toFixed(2);
                        let pid_percentage = ( json.pids_stats.current/ json.pids_stats.limit * 100.0).toFixed(2);
                        let block_io_r = 0;
                        let block_io_w = 0;
                        let net_io_r = 0;
                        let net_io_t = 0;


                        $.each(json.networks, function (k, v) {

                            net_io_r += v.rx_bytes;
                            net_io_t += v.tx_bytes;

                        })

                        // build netio
                        $.each(json.networks, function (k, v) {
                            if(panelTarget.find('.net-io-div .'+k+'-r-usages').isNull()){
                                let div = $(netio_div_html.format(k+"(R)", k+"-r"))
                                div.appendTo(panelTarget.find('.net-io-div'))
                                div = $(netio_div_html.format(k+"(T)", k+"-t"))
                                div.appendTo(panelTarget.find('.net-io-div'))
                            }

                            let netio_r_percentage =  ((v.rx_bytes / net_io_r) * 100.0).toFixed(2)

                            let v1 ;
                            v1 = (netio_r_percentage - $.extends.isEmpty(panelTarget.find('.'+k+'-r-usages-value').text().replace("%",""), "0")).toFixed(2);
                            panelTarget.find('.'+k+'-r-usages-value-3').removeClass("layui-edge-top");
                            panelTarget.find('.'+k+'-r-usages-value-3').removeClass("layui-edge-bottom");
                            if(v1>0){
                                panelTarget.find('.'+k+'-r-usages-value-3').addClass("layui-edge-top");
                            }else{
                                panelTarget.find('.'+k+'-r-usages-value-3').addClass("layui-edge-bottom");
                            }
                            v1  = v1>0?("+" + v1):v1;
                            panelTarget.find('.'+k+'-r-usages-value').text(netio_r_percentage+"%");
                            panelTarget.find('.'+k+'-r-usages-value-2').text(v1);
                            panelTarget.find('.'+k+'-r-usages').css("width", netio_r_percentage+"%")
                            panelTarget.find('.'+k+'-r-usages-1').text($.docker.utils.getSize(v.rx_bytes))

                            let netio_t_percentage =  ((v.tx_bytes / net_io_t) * 100.0).toFixed(2)
                            v1 = (netio_t_percentage - $.extends.isEmpty(panelTarget.find('.'+k+'-t-usages-value').text().replace("%",""), "0")).toFixed(2);
                            panelTarget.find('.'+k+'-t-usages-value-3').removeClass("layui-edge-top");
                            panelTarget.find('.'+k+'-t-usages-value-3').removeClass("layui-edge-bottom");
                            if(v1>0){
                                panelTarget.find('.'+k+'-t-usages-value-3').addClass("layui-edge-top");
                            }else{
                                panelTarget.find('.'+k+'-t-usages-value-3').addClass("layui-edge-bottom");
                            }
                            v1  = v1>0?("+" + v1):v1;
                            panelTarget.find('.'+k+'-t-usages-value').text(netio_t_percentage+"%");
                            panelTarget.find('.'+k+'-t-usages-value-2').text(v1);
                            panelTarget.find('.'+k+'-t-usages').css("width", netio_t_percentage+"%")
                            panelTarget.find('.'+k+'-t-usages-1').text($.docker.utils.getSize(v.tx_bytes))
                        })



                        json.data.used_memory = used_memory;
                        json.data.available_memory = available_memory;
                        json.data.memory_usage_percentage = memory_usage_percentage;
                        json.data.cpu_delta = cpu_delta;
                        json.data.system_cpu_delta = system_cpu_delta;
                        json.data.number_cpus = number_cpus;
                        json.data.cpu_usage_percentage = cpu_usage_percentage;
                        json.data.block_io_r=block_io_r;
                        json.data.block_io_w=block_io_w;
                        json.data.net_io_r=net_io_r;
                        json.data.net_io_t=net_io_t;

                        console.log(json)

                        panelTarget.find('.online_cpus').text(number_cpus);
                        panelTarget.find('.system_cpu_delta').text($.docker.utils.getSize(system_cpu_delta, ''));
                        panelTarget.find('.available_memory').text($.docker.utils.getSize(available_memory));
                        panelTarget.find('.limit').text(json.pids_stats.limit);
                        panelTarget.find('.blockio').text($.docker.utils.getSize(block_io_r) + "/" + $.docker.utils.getSize(block_io_w));
                        panelTarget.find('.netio').text($.docker.utils.getSize(net_io_r) + "/" + $.docker.utils.getSize(net_io_t));

                        let v ;
                        v = (cpu_usage_percentage - $.extends.isEmpty(panelTarget.find('.cpu-usages-value').text().replace("%",""), "0")).toFixed(2);
                        panelTarget.find('.cpu-usages-value-3').removeClass("layui-edge-top");
                        panelTarget.find('.cpu-usages-value-3').removeClass("layui-edge-bottom");
                        if(v>0){
                            panelTarget.find('.cpu-usages-value-3').addClass("layui-edge-top");
                        }else{
                            panelTarget.find('.cpu-usages-value-3').addClass("layui-edge-bottom");
                        }
                        v  = v>0?("+" + v):v;
                        panelTarget.find('.cpu-usages-value').text(cpu_usage_percentage+"%");
                        panelTarget.find('.cpu-usages-value-2').text(v);
                        panelTarget.find('.cpu-usages').css("width", cpu_usage_percentage+"%")
                        panelTarget.find('.cpu-usages-1').text($.docker.utils.getSize(cpu_delta, ''))

                        v = (memory_usage_percentage - $.extends.isEmpty(panelTarget.find('.memory-usages-value').text().replace("%",""), "0")).toFixed(2);
                        panelTarget.find('.memory-usages-value-3').removeClass("layui-edge-top");
                        panelTarget.find('.memory-usages-value-3').removeClass("layui-edge-bottom");
                        if(v>0){
                            panelTarget.find('.memory-usages-value-3').addClass("layui-edge-top");
                        }else{
                            panelTarget.find('.memory-usages-value-3').addClass("layui-edge-bottom");
                        }
                        v  = v>0?("+" + v):v;
                        panelTarget.find('.memory-usages-value').text(memory_usage_percentage+"%");
                        panelTarget.find('.memory-usages-value-2').text(v);
                        panelTarget.find('.memory-usages').css("width", memory_usage_percentage+"%")
                        panelTarget.find('.memory-usages-1').text($.docker.utils.getSize(used_memory))

                        v = (pid_percentage - $.extends.isEmpty(panelTarget.find('.pid-usages-value').text().replace("%",""), "0")).toFixed(2);
                        panelTarget.find('.pid-usages-value-3').removeClass("layui-edge-top");
                        panelTarget.find('.pid-usages-value-3').removeClass("layui-edge-bottom");
                        if(v>0){
                            panelTarget.find('.pid-usages-value-3').addClass("layui-edge-top");
                        }else{
                            panelTarget.find('.pid-usages-value-3').addClass("layui-edge-bottom");
                        }
                        v  = v>0?("+" + v):v;
                        panelTarget.find('.pid-usages-value').text(pid_percentage+"%");
                        panelTarget.find('.pid-usages-value-2').text(v);
                        panelTarget.find('.pid-usages').css("width", pid_percentage+"%")
                        panelTarget.find('.pid-usages-1').text(json.pids_stats.current)



                    }

                }

            }, function (xhr, state) {
                console.log("Stat is finished");
                $('#layout').layout('options').statXhr = null;
            }, function (xhr, state){
                console.log('onSend');
            })

            if(statXhr){
                $('#layout').layout('options').statXhr = statXhr
                //option.xhr = xhr
            }

        }
    })
}

function stopContainer(id){

    let node = local_node;
    $.docker.request.container.stop(function(){
        $.app.show('容器停止成功');
        reloadDg();
        $('#tab_start_btn').show();
        $('#tab_stop_btn').hide();
    }, node, id)
}

function exportContainer2(){

    let rows = $('#containersDg').datagrid('getChecked');
    if(rows.length>1){
        $.app.show('本版本仅支持选择一个容器导出tarball');
        return ;
    }


    if(rows.length==0){
        $.app.show('选择一个容器导出tarball');
        return ;
    }

    exportContainer(rows[0].ID);
}

function exportContainer(id){

    let node = local_node;
    let bytes =  new ByteArray();
    $.app.showProgress("导出数据获取中......")
    $.docker.request.container.export(node, id, function(data, xhr, state, flag){
        if(flag==1){
            let uint8View = new Uint8Array(data);
            bytes.push(uint8View)
            $.extends.downloadStream(bytes.readBytes(), id+'.tar', 'octet/stream');
        }else{
            console.log(data.length);
        }
    }, function (xhr, state) {
        console.log("export is finished");

        $.app.closeProgess();

        if(xhr.status<400){
            console.log(xhr)
            //bytes.push(byte2UInt8Array(xhr.responseText.bytes2()))
            //$.extends.downloadStream(bytes.readBytes(), id+'.tar', 'octet/stream');

            //$.extends.downloadStream(xhr.responseText.bytes2(), id+'.tar', 'octet/stream');
        }else{
            $.app.show('容器导出失败')
        }


    }, function (xhr, state){
        console.log('onSend');
    })
}

function startContainer(id){

    let node = local_node;
    $.docker.request.container.start(function(){
        $.app.show('启动成功');
        showLogTab(id);
        reloadDg();
        $('#tab_start_btn').hide();
        $('#tab_stop_btn').show();
    }, node, id)
}

function restartContainer(id){

    let node = local_node;
    $.docker.request.container.restart(function(){
        $.app.show('重启成功');
        reloadDg();
        $('#tab_start_btn').hide();
        $('#tab_stop_btn').show();
    }, node, id)
}

function showChangesTab(id){
    
    var reloadChangeFn = function (params) {
        let node = local_node;
        let pageSize = $.docker.utils.getPageRowsFromParam(params);
        let skip = $.docker.utils.getSkipFromParam(params);

        $.docker.request.container.changes(node, id, function(response){
            $('#changesDg').datagrid('loadData', {
                total: response.total,
                rows: response.list
            })

        },  skip, pageSize, params.path_key, params.sort, params.order)
    }
    
    addPanel({
        title:"变更",
        iconCls:'fa fa-random',
        fit:true,
        selected:true,
        border:false
    }, changes_tab_html.format(id), function (panel, title, flag) {

        let node = local_node;

        if(flag==0){
            $('#changesDg').iDatagrid({
                pagination:true,
                showHeader:true,
                showFooter:true,
                idField: 'Path',
                sortOrder:'asc',
                sortName:'Path',
                frozenColumns:[[
                    {field: 'Path', title: 'PATH', sortable: true,
                        formatter:$.iGrid.tooltipformatter(),width: 560},
                ]],
                onBeforeLoad:function (param){
                    console.log(param)
                    reloadChangeFn(param)
                },
                columns: [[
                    {field: 'KindName', title: 'KIND', sortable: true,
                        formatter:$.iGrid.tooltipformatter(),width: 120},
                ]]
            })
        }
    })
}

let DEFAULT_COLUMN_OPTIONS = {
    frozenColumns:[[
        {field: 'USER', title: 'USER', sortable: true,
            formatter:$.iGrid.tooltipformatter(),width: 180},
        {field: 'UID', title: 'UID', sortable: true,
            formatter:$.iGrid.tooltipformatter(),width: 180},
        {field: 'PID', title: 'PID', sortable: true,
            formatter:$.iGrid.tooltipformatter(),
            width: 180},
    ]],
    columns: [[
        {field: 'PPID', title: 'PPID', sortable: true,
            formatter:$.iGrid.tooltipformatter(),width: 180},
        {field: 'C', title: 'C', sortable: true,
            formatter:$.iGrid.tooltipformatter(),width: 100},
        {field: 'CMD', title: 'CMD', sortable: true,
            formatter:$.iGrid.tooltipformatter(),width: 380},
        {field: 'CPU', title: '%CPU', sortable: true,
            formatter:$.iGrid.tooltipformatter(),width: 100},
        {field: 'MEM', title: '%MEM', sortable: true,
            formatter:$.iGrid.tooltipformatter(),width: 100},
        {field: 'COMMAND', title: 'COMMAND', sortable: false,
            formatter:$.iGrid.tooltipformatter(),width: 380},
        {field: 'VSZ', title: 'VSZ', sortable: true,
            formatter:$.iGrid.tooltipformatter(),width: 100},
        {field: 'RSS', title: 'RSS', sortable: true,
            formatter:$.iGrid.tooltipformatter(),width: 100},
        {field: 'TTY', title: 'TTY', sortable: true,
            formatter:$.iGrid.tooltipformatter(),width: 100},
        {field: 'STAT', title: 'STAT', sortable: true,
            formatter:$.iGrid.tooltipformatter(),width: 180},
        {field: 'START', title: 'START', sortable: true,
            formatter:$.iGrid.tooltipformatter(),width: 180},
        {field: 'TIME', title: 'TIME', sortable: true,
            formatter:$.iGrid.tooltipformatter(),width: 180},
    ]]
};

let AUX_FIELDS = {'CPU':true,'MEM':true,'COMMAND':true,'VSZ':true,'RSS':true,'TTY':true,'STAT':true,'TIME':true}
let EF_FIELDS = {'PPID':true,'C':true,'CMD':true, 'TTY':true,'TIME':true}


function refreshProcess(params){
    let id = params.ID;
    let node = local_node;

    let pageSize = $.docker.utils.getPageRowsFromParam(params);
    let skip = $.docker.utils.getSkipFromParam(params);

    params.ARGS = $.extends.isEmpty(params.ARGS, 'aux').trim();

    $.docker.request.container.processes(node, id, function(response){
        // $('#processesDg').datagrid(DEFAULT_COLUMN_OPTIONS);

        let ShowFields = null;
        if(params.ARGS=='-ef'){
            ShowFields = EF_FIELDS;
        }else{
            ShowFields = AUX_FIELDS;
        }

        let columns = $('#processesDg').datagrid('getColumnFields');
        $.each(columns, function (idx, v) {
            console.log(v)
            if(ShowFields[v]){
                $('#processesDg').datagrid('showColumn', v);
            }else{
                $('#processesDg').datagrid('hideColumn', v);
            }
        })

        if(params.ARGS=='-ef'){
            $('#processesDg').datagrid('showColumn', 'UID');
            $('#processesDg').datagrid('hideColumn', 'USER');
        }else{
            $('#processesDg').datagrid('hideColumn', 'UID');
            $('#processesDg').datagrid('showColumn', 'USER');
        }

        $('#processesDg').datagrid('loadData', {
            total: response.total,
            rows: response.list
        })
    }, params.ARGS, skip, pageSize, params.sort, params.order)
}

let wses = [];
let current_ws = {};

function releaseAllWSResource(){
    $.each(wses, function (idx, ws) {
        closeWs(ws)
    })

    wses = [];
}

function sendWs(ws, data){
    if(ws!=null && ws.readyState == 1){
        ws.send(data)
        return true;
    }

    return false;
}

function closeWs(ws){
    if(ws!=null && ws.readyState == 1){
        try{
            ws.send('exit\n')
            ws.close();
        }catch (e){
            console.log(e)
        }
    }
}

function consoleDg(response, fn){
    let ws = null;
    let dgId = response.ExecID+"_console";
    let term;

    return $.iDialog.openDialog({
        id:dgId,
        title: '{0}-命令行控制台'.format(response.Name),
        minimizable:true,
        modal:false,
        containerId:response.ID,
        width: 1050,
        height: 600,
        maximized:true,
        href:'./console.html',
        onResize:function (width, height){
            //let h = ( $('#'+dgId).css('height').replace('px', '') * 1 - 10 ) + "px";
            let h = $('#'+dgId).css('height');
            //let w = ( $('#'+dgId).css('width').replace('px', '') * 1 - 10 ) + "px";
            let w = $('#'+dgId).css('width');
            console.log(height+','+width)
            console.log(h+','+w)

            $('#'+dgId+' .xterm-screen').css('height', h)
            $('#'+dgId+' .xterm-screen').css('width', w)

            // if(term){
            //     h = (h.replace("px", "")-10)*1;
            //     term.row = Math.floor(h/(16+1) )
            // }

            //
            //$('#'+dgId+' .xterm-accessibility-tree').css('height', h)
            //$('#'+dgId+' .xterm-selection-layer').css('height', h)
            //$('#'+dgId+' .xterm-link-layer').css('height', h)
            //$('#'+dgId+' .xterm-cursor-layer').css('height', h)
            //$('#'+dgId+' .xterm-text-layer').css('height', h)
            //
            //
            // $('#'+dgId+' .xterm-accessibility-tree').css('width', w)
            // $('#'+dgId+' .xterm-selection-layer').css('width', w)
            // $('#'+dgId+' .xterm-link-layer').css('width', w)
            // $('#'+dgId+' .xterm-cursor-layer').css('width', w)
            // $('#'+dgId+' .xterm-text-layer').css('width', w)

        },
        render:function(opts, handler){
            handler.render(response);

            let context = window.location.href.split("/containers/container.html")[0].replace("http://", "ws://")
            context = context.replace("https://", "ws://")

            let url = context + "/docker-api-ws/exec?id="+response.ExecID;

            ws = $.app.websocket(
                url,
                function(e){
                    console.log(e);
                    term = createTerminate(document.getElementById("container-terminal-"+response.ExecID),
                        function(key, ev){
                            //ws.send(key)
                            if(!sendWs(ws, key)){
                                alert('控制端已经失去通信，请重新打开');
                            }
                    });

                    if(fn){
                        fn()
                    }

                    wses.push(ws);

                }, function (e) {
                    term.write(e.data)
                    console.log(e);
                }, function (e) {
                    console.log(e);
                    closeConsoleDg(dgId, false);
                }, function (e) {
                    console.log(e);
                    $.app.show("错误消息{0}".format(e.reason))
                }, [local_node.node_host, local_node.node_port, local_node.node_version])
        },
        onBeforeClose:function(){
            let forcing = this.forcing;
            if(forcing){
                return true;
            }

            // 属性值        属性常量        描述
            // ————————————————————————————————————
            // 0        CONNECTING        连接尚未建立
            // 1        OPEN            WebSocket的链接已经建立
            // 2        CLOSING            连接正在关闭
            // 3        CLOSED            连接已经关闭或不可用
            if(ws!=null && ws.readyState == 1){
                $.app.confirm("关闭控制台", "控制台通信还没有关闭，点击确定，将关闭控制台通信后关闭控制台窗口，否则 保持当前控制台状态", function () {
                    closeConsoleDg(dgId, true);
                    closeWs(ws);
                    // try{
                    //     ws.send('exit\n')
                    //     ws.close();
                    // }catch (e){
                    //     console.log(e)
                    // }
                }, function () {
                    
                })
            }else{
                return true;
                $.app.confirm("通道关闭", "控制台通道已经关闭，点击确定，将关闭控制台窗口，否则点击，取消", function () {
                    closeConsoleDg(dgId, true);
                })
            }

            console.log('Before close');

            return false;
        },
        buttonsGroup: []
    });
}

function closeConsoleDg(dgId, forcing){

    if($.extends.isEmpty($('#'+dgId)))
        return ;

    if(forcing){
        try{
            $('#'+dgId)[0].forcing = true
            $.iDialog.closeDialog(dgId)
        }catch (e){
        }
    }else{
        try{
            delete $('#'+dgId)[0].forcing
            $.iDialog.closeDialog(dgId)
        }catch (e){
        }
    }
}

function showExecConfirmation(id, fn){
    let node = local_node;

    $.docker.request.container.inspect(function(response){
        if(response.Running==1){
            let html = `
                <div style="margin: 0px;">
                </div>
                <div class="cubeui-fluid">
                    <fieldset>
                        <legend>执行选项</legend>
                    </fieldset>
                    <div style="margin-top:5px">  
                        <div class="cubeui-row">
                            <label class="cubeui-form-label" title="执行命令">执行命令:</label>
                            <div class="cubeui-input-block">                
                                    <input type="text" name="cmd" value="/bin/sh" data-toggle="cubeui-textbox"
                                           data-options="
                                                    required:true,
                                                    prompt:'执行命令'
                                           ">
                            </div>       
                        </div>    
                        <div class="cubeui-row">
                            <label class="cubeui-form-label" title="当前用户">当前用户:</label>
                            <div class="cubeui-input-block">                
                                    <input type="text" name="user" value="root" data-toggle="cubeui-textbox"
                                           data-options="
                                                    required:false,
                                                    prompt:'执行命令的当前用户'
                                           ">
                            </div>        
                        </div>
                        <div class="cubeui-row">
                            <label class="cubeui-form-label" title="工作目录">工作目录:</label>
                            <div class="cubeui-input-block">                
                                    <input type="text" name="work_dir" value="" data-toggle="cubeui-textbox"
                                           data-options="
                                                    required:false
                                           ">
                            </div>        
                        </div>
                        <div class="cubeui-row">
                            <div class="cubeui-col-sm3">
                                <label class="cubeui-form-label" title="使用标准输出">标准输出:</label>
                                <div class="cubeui-input-block">
                                    <input data-toggle="cubeui-switchbutton" 
                                        name="AttachStdout" value="1" checked data-options="onText:'',offText:'',width:60">
                                </div>
                            </div>
                        </div>
                        <div class="cubeui-row">
                            <div class="cubeui-col-sm3">
                                <label class="cubeui-form-label" title="使用错误输出">错误输出:</label>
                                <div class="cubeui-input-block">
                                    <input data-toggle="cubeui-switchbutton" 
                                        name="AttachStderr" value="1" checked data-options="onText:'',offText:'',width:60">
                                </div>
                            </div>
                        </div>
                        <div class="cubeui-row">
                            <div class="cubeui-col-sm3">
                                <label class="cubeui-form-label" title="使用标准输入">标准输入:</label>
                                <div class="cubeui-input-block">
                                    <input data-toggle="cubeui-switchbutton" 
                                        name="AttachStdin" value="1" checked data-options="onText:'',offText:'',width:60">
                                </div>
                            </div>
                        </div>
                        <div class="cubeui-row">
                            <div class="cubeui-col-sm3">
                                <label class="cubeui-form-label" title="仿真TTY">仿真TTY:</label>
                                <div class="cubeui-input-block">
                                    <input data-toggle="cubeui-switchbutton" disabled
                                        name="Tty" value="1" checked readonly data-options="onText:'',offText:'',width:60">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        `;

            $.docker.utils.optionConfirm('执行容器命令', null, html,
                function(param, closeFn){
                    if(fn){
                        fn.call(response, param, closeFn)
                    }
                }, null, 450, 800);

        }else{
            $.app.show('当前容器{0}还没有启动执行容器命令'.format(response.Name));
        }
    }, node, id)
}

function execContainer(id){
    showExecConfirmation(id, function (param, closeFn) {
        let response = this;
        let node = local_node;

        let dgId = null;
        let term = null;

        $.docker.request.exec.exec({
                onopen:function (e, id, data) {
                    wses.push(this);
                    let ws = this;

                    closeFn();
                    dgId = id+"_console";

                    return $.iDialog.openDialog({
                        id:dgId,
                        title: '{0}-命令行控制台'.format(response.Name),
                        minimizable:true,
                        modal:false,
                        containerId:response.ID,
                        width: 1050,
                        height: 600,
                        maximized:true,
                        href:'./console.html',
                        onResize:function (width, height){
                            let h = $('#'+dgId).css('height');
                            let w = $('#'+dgId).css('width');

                            $('#'+dgId+' .xterm-screen').css('height', h)
                            $('#'+dgId+' .xterm-screen').css('width', w)

                            console.log(height+','+width)
                            console.log(h+','+w)
                        },
                        render:function(opts, handler) {
                            handler.render(data);
                            try{
                                term = createTerminate(document.getElementById("container-terminal-"+id),
                                    function(key, ev){

                                        //ws.send(key)
                                        if(!sendWs(ws, key)){
                                            alert('控制端已经失去通信，请重新打开');
                                        }
                                    });
                            }catch (e) {
                                $.app.show('控制台创建失败，请刷新后重试');
                            }
                        },
                        onBeforeClose:function(){
                            let forcing = this.forcing;

                            if(forcing){
                                return true;
                            }

                            if(ws!=null && ws.readyState == 1){
                                $.app.confirm("关闭执行窗口", "执行通信还没有关闭，点击确定，将关闭控制台通信后关闭执行控制台窗口，否则 保持当前执行控制台状态", function () {
                                    closeConsoleDg(dgId, true);
                                    closeWs(ws);
                                }, function () {})
                            }else{
                                return true;
                                // $.app.confirm("执行通道关闭", "执行通道已经关闭，点击确定，将关闭执行控制台窗口，否则点击，取消", function () {
                                //     closeConsoleDg(dgId, true);
                                // })
                            }

                            console.log('Before close');

                            return false;
                        },
                    });

                },
                onmessage:function(e, id, data){
                    term.write(e.data)
                    console.log(e);
                },
                onclose:function(e, id, data){
                    console.log(e);
                    closeConsoleDg(dgId, false);
                },
                onerror:function(e, id, data){
                    $.app.show("错误消息{0}".format(e.reason))
                    this.close();
                },
            }, node, id, param.cmd, param.user, param.work_dir
            , param.AttachStdout!=1
            , param.AttachStderr!=1
            , param.AttachStdin!=1
            , false)
    })
}

function showConsoleConfirm(id, fn){
    let node = local_node;

    $.docker.request.container.inspect(function(response){
        let containerRow = response;
        if(response.Running==1){

            let html = `
                <div style="margin: 0px;">
                </div>
                <div class="cubeui-fluid">
                    <fieldset>
                        <legend>命令行选项</legend>
                    </fieldset>
                    <div style="margin-top:5px">  
                        <div class="cubeui-row">
                            <label class="cubeui-form-label" title="控制台命令方式">控制台命令方式:</label>
                            <div class="cubeui-input-block">                
                                    <input type="text" name="cmd" value="sh" data-toggle="cubeui-combobox"
                                           data-options="
                                                    required:false,prompt:'控制台命令方式，选择填写，默认为/bin/sh',
                                                    valueField:'KEY',
                                                    textField:'TEXT',
                                                    data:[
                                                    {'KEY':'sh','TEXT':'/bin/sh'},
                                                    {'KEY':'bash','TEXT':'/bin/bash'},
                                                    {'KEY':'ash','TEXT':'/bin/ash'}]
                                           ">
                            </div>        
                        </div>    
                        <div class="cubeui-row">
                            <label class="cubeui-form-label" title="当前用户">当前用户:</label>
                            <div class="cubeui-input-block">                
                                    <input type="text" name="user" value="root" data-toggle="cubeui-textbox"
                                           data-options="
                                                    required:false,
                                                    prompt:'执行命令的当前用户'
                                           ">
                            </div>        
                        </div>
                        <div class="cubeui-row">
                            <label class="cubeui-form-label" title="工作目录">工作目录:</label>
                            <div class="cubeui-input-block">                
                                    <input type="text" name="work_dir" value="" data-toggle="cubeui-textbox"
                                           data-options="
                                                    required:false,
                                                    prompt:'执行命令的工作目录'
                                           ">
                            </div>        
                        </div>
                    </div>
                </div>
        `;

            $.docker.utils.optionConfirm('运行控制台', null, html,
                function(param, closeFn){
                    if(fn){
                        fn.call(response, param, closeFn)
                    }
                }, null, 300);

        }else{
            $.app.show('当前容器{0}还没有启动不能打开命令行'.format(response.Name));
        }
    }, node, id)
}


function lsOperateFormatter(value, row, idx) {
    let htmlstr = "";

    if($.extends.isEmpty(value)){
        return htmlstr;
    }

    if(row.DIR){
        return '<a style="color:blue;" class=\'\' href=\'#\' onclick=\'lsDir("'+idx+'", 1)\'>{0}</a>'.format(value.htmlEncodeBracket());
    }else{
        return $.iTooltip.tooltip(value);
    }

    return htmlstr;
}

function importFolder(id){

    id = $('#dirDg').datagrid('options').queryParams.ID;
    let path = $('#dirDg').datagrid('options').CURRENT_DIR;

    let node = local_node;

    let import_html = `
                <div style="margin: 0px;">
                </div>
                <div class="cubeui-fluid">
                    <fieldset>
                        <legend>导入归档选项</legend>
                    </fieldset>
                    <div style="margin-top:5px">
                            <div class="cubeui-row">          
                                <div class="cubeui-col-sm12" style="margin-top: 5px">
                                    <label class="cubeui-form-label">归档文件:</label>
                                    <div class="cubeui-input-block">
                                        <input  data-toggle="cubeui-filebox" id="import_file" data-options="
                                            prompt:'必须是使用以下算法之一压缩的tar存档：identity（无压缩）、gzip、bzip2或xz。',
                                            buttonText: '选择文件',
                                            accept:'.tar',
                                            required:true,
                                            " style="width:100%">  
                                    </div>
                                </div>   
                                          
                            </div> 
                            
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm3">
                                    <label class="cubeui-form-label" title="如果选中；解压缩给定内容相同文件覆盖目时录，将会出现错误；不选中；可以用文件覆盖目录">非目录不覆盖:</label>
                                    <div class="cubeui-input-block">
                                        <input data-toggle="cubeui-switchbutton" checked 
                                            name="noOverwriteDirNonDir" value="1" data-options="onText:'',offText:'',width:60">
                                    </div>
                                </div>
                            </div> 
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm3">
                                    <label class="cubeui-form-label" title="如果选中；将UID/GID映射复制到目标文件或目录；不选中；不复制UID/GID映射">复制UID/GID:</label>
                                    <div class="cubeui-input-block">
                                        <input data-toggle="cubeui-switchbutton" checked
                                            name="copyUIDGID" value="1" data-options="onText:'',offText:'',width:60">
                                    </div>
                                </div>
                            </div> 
                    </div>
                </div>
        `;

    $.docker.utils.optionConfirm('导入容器目录系统归档文件', '导入已归档文件至容器文件系统目录`{0}`？'.format(path), import_html,
        function(param, closeFn) {
            console.log(param)
            let files = $('#import_file').filebox('files');
            console.log(files)

            $.easyui.file.getReader(function(e){
                console.log(e);

                $.docker.request.container.extract(function (response) {

                    $.app.show('归档导入容器目录{0}成功'.format(path.htmlEncode()));
                    // closeFn();
                    reloadDg();
                    currentLs(id);

                }, node, id, this.result, path, param.noOverwriteDirNonDir, param.copyUIDGID);

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

        }, null, 450, 750)
}

function exportFolder(id){
    id = $('#dirDg').datagrid('options').queryParams.ID;
    let path = $('#dirDg').datagrid('options').CURRENT_DIR;

    $.app.confirm("导出目录", "确定导出目录'{0}'，点击确定继续导出，否则点击取消?".format(path.htmlEncode()), function(){

        let node = local_node;
        $.app.showProgress('获取归档数据中......');

        let bytes = new ByteArray();
        $.docker.request.container.archive(node, id, path, function (data, xhr, state, flag) {

            if (flag == 1) {
                let uint8View = new Uint8Array(data);
                bytes.push(uint8View)
                $.extends.downloadStream(bytes.readBytes(), path + '.tar', 'octet/stream');
            } else {
                console.log(data.length);
            }
        }, function (xhr, state) {
            $.app.closeProgess();

            if (xhr.status < 400) {
                console.log(xhr)
                $.app.show('目录{0}已经准备成功，请等待下载'.format(path.htmlEncode()))
            } else {

                if(xhr.data!=null){
                    if(xhr.data.binary!=null){
                        let msg = ab2str(xhr.data.binary);
                        $.app.show('目录导出失败:{0}'.format(msg.htmlEncode()));
                    }else{
                        $.app.show('目录导出失败:{0}'.format((xhr.data+"").htmlEncode()));
                    }
                }else{
                    $.app.show('目录导出失败')
                }
            }
        }, function (xhr, state) {
            console.log('onSend');
        }, function (xhr, state) {
            console.log(xhr);
        })
    });
}

function upLs(id){
    ls(null, '..');
}

function currentLs(id){
    ls(null, '.');
}

function ls(current, path){
    let dir = ($.extends.isEmpty(current, $('#dirDg').datagrid('options').CURRENT_DIR));

    if($.extends.isEmpty(path)){
        dir = dir;
    }else{
        if(path==".."){
            let paths = dir.split("/");
            if(paths.length==1){
                dir = "/"
            }else{
                paths.splice(paths.length-1);
                if(paths.length==1){
                    dir = "/"
                }else{
                    dir = paths.join('/');
                }
            }
        }else if(path=="."){
            dir = dir;
        }else{
            if(dir.endsWith('/')){
                dir = dir + path;
            }else{
                dir = dir + "/" + path;
            }
        }
    }


    let node = local_node;
    $.docker.request.exec.ls(function (msg) {
        $('#dirDg').datagrid('loadData', msg.FILES);
        $('#dirDg').datagrid('options').CURRENT_DIR = msg.PATH;
        $('#search_dir').textbox('setValue', msg.PATH);
    }, function(err){
        $.app.show(err);
        $('#search_dir').textbox('setValue', $('#dirDg').datagrid('options').CURRENT_DIR);

    }, node, $('#dirDg').datagrid('options').queryParams.ID, dir, null);

}

function lsDir(idx, flag){
    let row = $('#dirDg').datagrid('getRows')[idx];

    if(flag == 1){
        ls(null, row.Name);
    }else{
        ls(row.TARGET);
    }
}

function lsTargetOperateFormatter(value, row, idx) {
    let htmlstr = "";

    if($.extends.isEmpty(value)){
        return htmlstr;
    }

    //htmlstr += ' ->  <a style="color:blue;" class=\'\' href=\'#\' onclick=\'lsDir("'+idx+'", 0)\'>{0}</a>'.format(value.htmlEncodeBracket());
    htmlstr += ' ->  {0}'.format(value);
    //
    // if(row.DIR){
    //     return ' ->  <a style="color:blue;" class=\'\' href=\'#\' onclick=\'lsDir("'+idx+'", 0)\'>{0}</a>'.format(value.htmlEncodeBracket());
    // }else{
    //     return $.iTooltip.tooltip(value);
    // }

    return htmlstr;
}

function lsContainer(id){
    let node = local_node;
    $.docker.request.container.inspect(function(response) {
        if (response.Running == 1) {
            $.docker.request.exec.ls(function (msg) {

                addPanel({
                    title:"文件系统",
                    iconCls:'fa fa-clone',
                    fit:true,
                    selected:true,
                    border:false
                }, dir_tab_html.format(id), function (panel, title, flag) {
                    if(flag==0){
                        $('#dirDg').iDatagrid({
                            pagination:false,
                            showHeader:true,
                            showFooter:true,
                            remoteSort:false,
                            CURRENT_DIR:msg.PATH,
                            queryParams: {ID:id},
                            data:msg.FILES,
                            columns: [[
                                {field: 'Attr', title: 'ATTR', sortable: true,
                                    formatter:$.iGrid.tooltipformatter(),width: 140},
                                {field: 'REF', title: 'REF', sortable: true,
                                    formatter:$.iGrid.tooltipformatter(),width: 80},
                                {field: 'OWNER', title: 'OWNER', sortable: true,
                                    formatter:$.iGrid.tooltipformatter(),width: 100},
                                {field: 'GROUP', title: 'GROUP', sortable: true,
                                    formatter:$.iGrid.tooltipformatter(),width: 100},
                                {field: 'SIZEStr', title: 'SIZE', sortable: true,
                                    formatter:$.iGrid.tooltipformatter(),width: 100},
                                {field: 'DATEStr', title: 'DATE', sortable: true,
                                    formatter:$.iGrid.tooltipformatter(),width: 150},
                                {field: 'Name', title: 'Name', sortable: true,
                                    formatter:lsOperateFormatter,width: 240},
                                {field: 'TARGET', title: 'TARGET', sortable: false,
                                    formatter:lsTargetOperateFormatter,width: 240}
                            ]]
                        });

                        $('#search_dir').textbox('textbox').bind('keydown', function(e){
                            if (e.keyCode == 13){   // 当按下回车键时接受输入的值。
                                $('#search-dirbtn').trigger('click');
                            }
                        });

                    }else{
                        console.log("show");
                        //$('#processesDg').iDatagrid('loadData', response.list);
                        $('#dirDg').iDatagrid('reload');
                    }
                })
            }, function (error){
                console.log(error);
            }, node, id, "/", null);
        }else{
            $.app.show('当前容器{0}还没有启动,不嫩执行容器命令'.format(response.Name));
        }
    }, node, id)
}

function showConsole(id){
    showConsoleConfirm(id, function (param, closeFn) {
        let node = local_node;
        let response = this;

        $.docker.request.exec.create(function (id) {
            response.ExecID = id;
            console.log(id)

            consoleDg(response, function () {
                closeFn();
            })

        }, node, id, "/bin/"+param.cmd, param.user, param.work_dir)
    });
}

function showConsolePanel(id){
    let title = "控制台";
    let tabObj = $('#eastTabs')

    $.docker.getHtml('./console.html', null, function(html){
        let ws = null;

        if($(tabObj).iTabs("exists", title)){
            let panel = $(tabObj).iTabs("getTab", title);
            ws = panel.ws;
        }

        if(ws!=null && ws.readyState == 1){
            $(tabObj).iTabs("select", title);
            return ;
        }

        showConsoleConfirm(id, function (param, closeFn) {
            let response = this;
            let panelId;
            let term = null;
            let node = local_node;

            $.docker.request.exec.exec({
                onopen:function(e, id, data){
                    closeFn();
                    wses.push(this);
                    current_ws.console = this;

                    // if not first come in, had created ws and term
                    if(ws != null){
                        let panel = $(tabObj).iTabs("getTab", title);
                        panel.YES = true;
                        //panel.ws = null;
                        //panel.term = null;
                        delete panel.ws;
                        delete panel.term;
                        $(tabObj).iTabs("close", title);
                    }

                    panelId = data.ExecID+"_console";
                    ws = this;
                    console.log(e);

                    html = $.templates(html).render(data);

                    addPanel({
                        title:title,
                        iconCls:'fa fa-terminal',
                        id: panelId,
                        fit:true,
                        selected:true,
                        onResize:function (width, height){
                            let h = $('#'+panelId).css('height');
                            let w = $('#'+panelId).css('width');
                            console.log(height+','+width)
                            console.log(h+','+w)
                            $('#'+panelId+' .xterm-screen').css('height', h)
                            $('#'+panelId+' .xterm-screen').css('width', w)
                        },
                        onBeforeClose:function(){
                            console.log("YES");
                            let yes = this.YES;
                            let ws = this.ws;
                            if(ws!=null && ws.readyState == 1){
                                closeWs(ws);
                            }
                            if(yes){
                                return true;
                            }
                            return true;
                        },
                        border:false
                    }, html, function (panel, title, flag) {
                        term = createTerminate(document.getElementById("container-terminal-"+data.ExecID),
                            function(key, ev){

                                //ws.send(key)
                                if(!sendWs(ws, key)){
                                    alert('控制端已经失去通信，请重新打开');
                                }
                            });
                        panel.panel('resize');
                        panel.ws = ws;
                        //panel.term = term;
                    })
                },
                onmessage:function(e, id, data){
                    term.write(e.data)
                    console.log(e);
                },
                onclose:function(e, id, data){
                    console.log(e);
                    $.app.confirm("关闭控制台", "控制台通道已经关闭，点击确定，关闭当前tab， 否则点击取消。", function () {
                        $('#eastTabs').tabs('close', title);
                    })
                },
                onerror:function(e, id, data){
                    console.log(e);
                    $.app.show("错误消息{0}".format(e.reason))
                    term.disable();
                },
            }, node, id, "/bin/"+param.cmd, param.user, param.work_dir)

        })
    })
}


function showProcess(id){
    addPanel({
        title:"进程",
        iconCls:'fa fa-spinner',
        fit:true,
        selected:true,
        border:false
    }, processes_tab_html.format(id), function (panel, title, flag) {

        let node = local_node;

        if(flag==0){
            $('#processesDg').iDatagrid($.extend({}, {
                    pagination:true,
                    showHeader:true,
                    showFooter:true,
                    queryParams: {ID:id, ARGS:'aux'},
                    // data:response.list,
                    onBeforeLoad:function (param){
                        console.log(param)
                        refreshProcess(param)
                    }
                }, DEFAULT_COLUMN_OPTIONS));
        }else{
            console.log("show");
            //$('#processesDg').iDatagrid('loadData', response.list);
            $('#processesDg').iDatagrid('reload');
        }
    })
}

function addPanel(options, html, fn){
    let title = options.title;
    let tabObj = $('#eastTabs')
    if($(tabObj).iTabs("exists", title)){
        let panel = $(tabObj).iTabs("getTab", title);
        if(fn){
            fn.call(tabObj, panel, title, 1)
        }

        $(tabObj).iTabs('select', title)
        return ;
    }

    $(tabObj).iTabs('add', options)

    let panel = $(tabObj).iTabs("getTab", title);
    let htmlObj = $(html);
    htmlObj.appendTo($(panel));
    $.parser.parse(htmlObj);
    $(panel).panel('resize');

    if(fn){
        fn.call(tabObj, panel, title, 0)
    }

    $(tabObj).iTabs('select', title)
}

function reloadDg(){
    $('#containersDg').datagrid('reload');
    $('#layout').layout('resize');
}

function killLease(id, idx){
    $.app.confirm("确定强制终止当前的容器实例", function () {
        let node = local_node;
        let name = $('#containersDg').datagrid('getRows')[idx].Name
        $.docker.request.container.kill(function(){
            $.app.show('容器{0}强制终止成功'.format(name));
            reloadDg();
        }, node, id)
    })
}

function stopLease(id, idx){

    $.app.confirm("确定停止当前的容器实例", function () {
        let node = local_node;
        let name = $('#containersDg').datagrid('getRows')[idx].Name
        $.docker.request.container.stop(function () {
            $.app.show('容器{0}停止成功'.format(name));
            reloadDg();
        }, node, id)
    })
}

function startLease(id, idx){
    let node = local_node;
    let name = $('#containersDg').datagrid('getRows')[idx].Name
    $.docker.request.container.start(function(){
        showLog(id, idx, true);
        reloadDg();
        $.app.show('容器{0}启动成功'.format(name));
    }, node, id)
}

var logsMap = {};

function closeLogDialog(){
    let option = $(this).dialog('options');
    let containerId = option.containerId;
    closeEvent(containerId);
    delete logsMap[containerId]
}

function closeEvent(containerId){
    let logsObj = logsMap[containerId]
    if(logsObj){
        console.log("Close " + containerId + " log event.")
        try{
            logsObj.xhr.abort()
        }catch (e) {
            console.log(e)
        }
    }
    reloadDg();
    return logsObj;
}

function showLog(id, _idx, restart){

    let eventFn = function(dialogId){
        return function(row){
            let node = local_node;
            let xhr = $.docker.request.container.log(node, id, function (chunk, state, xhr) {
                //console.log(xhr)
                console.log(chunk)
                if(!$.extends.isEmpty(chunk)){
                    let panel = $($('#'+dialogId).dialog('panel'));

                    $.each(chunk, function (idx, v) {
                        let newLog = $('<span></span>');
                        newLog.html(v.htmlEncodeBracket().replaceAll('\n', '<br>'))
                        newLog.appendTo(panel.find('.container-logs'))
                    });

                    scrollBottom($('#'+dialogId));
                    $('#'+dialogId).find('t').html('[已启动]');
                }

            }, function (xhr, state) {
                console.log('Log request onSend')
                //console.log(xhr)
                if(state==1){
                    //console.log('onSendOver')
                    console.log('Log请求已经发送')
                }
            }, function (xhr, state){
                $('#'+dialogId).find('t').html('[已停止]');
                closeEvent(id)
            })

            if(xhr){
                logsMap[id] = {
                    dialogId:dialogId,
                    xhr:xhr
                }
            }
        }
    }

    let node = local_node;
    $.docker.request.container.inspect(function(response){
        let containerRow = response;

        if(logsMap[id]){

            // let dialogId = logsMap[id].dialogId;
            // $.app.showDialog(dialogId)
            // $('#'+dialogId).iDialog('restore');
            // scrollBottom($('#'+dialogId))
            let dialogId = logsMap[id].dialogId;

            try{
                logsMap[id].xhr.abort()
                $('#'+logsMap[id].dialogId).iDialog('restore');
                let panel = $($('#'+dialogId).dialog('panel'))
                panel.find('.container-logs').empty();
                eventFn(dialogId)(containerRow)
            }catch (e){
                console.log('start log error')
                console.log(e)
            }

        }else{
            let dialogId = null;
            // if(logsMap[id]&&restart){
            //     dialogId=logsMap[id].dialogId;
            //     try{
            //         logsMap[id].xhr.abort()
            //         $('#'+logsMap[id].dialogId).iDialog('restore');
            //         let panel = $($('#'+dialogId).dialog('panel'))
            //         panel.find('.container-logs').empty();
            //         eventFn(dialogId)(containerRow)
            //     }catch (e){
            //
            //     }
            // }else{
            //     dialogId = Math.uuid()
            //     showLogDialog(dialogId, containerRow, eventFn(dialogId))
            // }
            dialogId = Math.uuid()
            showLogDialog(dialogId, containerRow, eventFn(dialogId))

        }

    }, node, id)

}


function refreshContainer4ContainerLink(param, uuid){
    let pageSize = $.docker.utils.getPageRowsFromParam(param);
    let skip = $.docker.utils.getSkipFromParam(param);

    //let node = $.v3browser.menu.getCurrentTabAttachNode();
    let node = local_node;

    $.docker.request.container.list(function (response) {
    $('#containerlist-' + uuid).combogrid('grid').datagrid('loadData',
        {
            total: response.total,
            rows: response.list
        });

    }, node, skip, pageSize, param.all!=null, param.search_type, param.search_key, param.sort, param.order);
}

function refreshLease(param){
    let pageSize = $.docker.utils.getPageRowsFromParam(param);

    let skip = $.docker.utils.getSkipFromParam(param);

    //let node = $.v3browser.menu.getCurrentTabAttachNode();
    let node = local_node;

    $.docker.request.container.list(function (response) {
        $('#containersDg').datagrid('loadData', {
            total: response.total,
            rows: response.list
        })

        refreshImageAndContainerInfo()

    }, node, skip, pageSize, param.all!=null, param.search_type, param.search_key, param.sort, param.order);
}

function removeLease(idx, leaseId) {

    if(idx == null){
        let rows = $('#containersDg').datagrid('getChecked');
        if(rows.length>1){
            $.app.show('本版本仅支持选择一个容器进行删除');
            return ;
        }


        if(rows.length==0){
            $.app.show('选择一个容器进行删除');
            return ;
        }

        idx = $('#containersDg').datagrid('getRowIndex', rows[0].ID);
        leaseId = rows[0].ID;
    }

    let node = local_node;
    let containerRow = $('#containersDg').datagrid('getRows')[idx];

    let name = containerRow.Name;


    let html = `
                <div style="margin: 0px;">
                </div>
                <div class="cubeui-fluid">
                    <fieldset>
                        <legend>容器删除选项</legend>
                    </fieldset>
                    <div style="margin-top:5px">      
                        <div class="cubeui-row">                              
                            <input data-toggle="cubeui-checkbox" name="force" value="1" label="">
                            <span style='line-height: 30px;padding-right:0px'><b>强制删除容器</b>(已运行中容器，会先Kill然后删除)</span>
                        </div>   
                        <div class="cubeui-row">                              
                            <input data-toggle="cubeui-checkbox" name="v" value="1" label="">
                            <span style='line-height: 30px;padding-right:0px'><b>删除关联匿名数据卷</b>(Remove anonymous volumes associated with the container.)</span>
                        </div>
                        <div class="cubeui-row">                              
                            <input data-toggle="cubeui-checkbox" name="link" value="1" label="">
                            <span style='line-height: 30px;padding-right:0px'><b>删除关联link</b>(Remove the specified link associated with the container.)</span>
                        </div>
                    </div>
                </div>
        `;


    $.docker.utils.optionConfirm('删除容器', '重要警告：确定要删除容器{0}？'.format(name), html,
        function(param, closeFn){

            $.docker.request.container.delete(function (response) {
                $.app.show('容器{0}删除成功'.format(name));
                closeFn();
                reloadDg()
            }, node, containerRow.ID, param.v=='1', param.link=='1', param.force=='1')

        }, null, 400);
}



function showLogDialog(dialogId, containerRow, afterRendFn){

    let node = local_node;

    $.docker.request.container.inspect(function (response) {
        containerRow.Running = response.Running;
        containerRow.Port = response.Port;
        containerRow.BindingPort = response.BindingPort;

        return $.iDialog.openDialog({
            id:dialogId,
            title: '{0}-容器日志'.format(containerRow.Name),
            minimizable:true,
            modal:false,
            containerId:containerRow.ID,
            width: 1050,
            height: 700,
            href:'./logs.html',
            render:function(opts, handler){
                handler.render(containerRow)
                afterRendFn.call(this, containerRow)
            },
            onBeforeClose:closeLogDialog,
            buttonsGroup: [{
                text: '清除',
                iconCls: 'fa fa-plus-square-o',
                btnCls: 'cubeui-btn-orange',
                handler:function(){
                    alert(1)
                }
            }]
        });

    }, node, containerRow.ID)

}

function buildCommand(rowData){
    let name = rowData.Name;
    let hostname = rowData.Config.Hostname;
    let env = rowData.Config.Env.join(" --env=");
    if (!$.extends.isEmpty(env)){
        env = " --env=" + env
    }

    let list = [];
    $.each(rowData.Mounts, function (idx, v) {
        list.push(v.Source+":"+v.Destination);
    })

    let volume = list.join( " --volume=");
    if (!$.extends.isEmpty(volume)){
        volume = " --volume=" + volume
    }

    let workdir = rowData.Config.WorkingDir;
    // --restart=no
    let restart = rowData.HostConfig.RestartPolicy.Name;

    if($.extends.isEmpty(restart)){
        restart = "no"
    }

    if(restart=='on-failure'){
        let times = rowData.HostConfig.RestartPolicy.MaximumRetryCount||3;
        restart = restart+":"+times;
    }

    // --runtime=runc
    let runtime = rowData.HostConfig.Runtime;
    // -t
    // httpd:2.4.51-alpine
    let image = rowData.Config.Image

    // httpd-foreground
    let command = rowData.Config.Cmd?rowData.Config.Cmd.join(" "):'';

    // port
    list = [];

    if(rowData.HostConfig.PortBindings){

        $.each(rowData.HostConfig.PortBindings, function (k, v) {
            let localhost = "";
            if(!$.extends.isEmpty(v)){

                $.each(v, function (idx, one) {
                    if(!$.extends.isEmpty(one.HostIP)){
                        localhost = one.HostIP + ":" + one.HostPort;
                    }else{
                        localhost = one.HostPort;
                    }

                    list.push(localhost+":"+k)
                })
            }
        })

    }

    let p = list.join( " -p ");
    if (!$.extends.isEmpty(p)){
        p = " -p " + p
    }

    // -t
    let tty = "";
    if(!$.extends.isEmpty(rowData.Config.Tty)){
        tty = "-t"
    }

    let labels = "";
    $.each(rowData.Config.Labels, function (k, v) {
        labels = labels + " --label " + k + "=" + v
    })

    let publishAll = '';

    if(rowData.HostConfig.PublishAllPorts){
        publishAll = '-P';
        p = '';
    }

    let links = '';
    if(!$.extends.isEmpty(rowData.HostConfig.LinkAlias)){
        links = rowData.HostConfig.LinkAlias.join(' --link ');
        links = '--link ' + links;
    }

    let privileged = '';
    if(rowData.HostConfig.Privileged){
        privileged = '--privileged';
    }

    let entrypoint = '';
    if(!$.extends.isEmpty(rowData.Config.EntrypointStr)){
        entrypoint = ' --entrypoint="{0}"'.format(rowData.Config.EntrypointStr);
    }

    return "docker run --name={0} --hostname={1} {2} {3} {4} {12} {13} {14}{15} --workdir={5} {11} --restart={6} --runtime={7} {8} {9} {10}".format(
        name, hostname, env, volume, p, workdir, restart, runtime, tty, image, command, labels, publishAll, links, privileged, entrypoint)
}


function pruneContainer(){

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
                            <span style='line-height: 30px;padding-right:0px'><b>清理指定容器标签:</b>(默认清理全部)</span>
                        </div>
                        <div class="cubeui-row">
                            <span style='line-height: 20px;padding-right:0px;color: red'>label格式: label1=a,label2!=b(不等于),label!=...(没有标签)</span>
                        </div>
                        <div class="cubeui-row">
                            <input type="text" data-toggle="cubeui-textbox" name="labels"
                                   value='' data-options="required:false,prompt:'label格式: label1=a,label2!=b,label!=...'">
                        </div>
                    </div>
                    <div style="margin-top:5px">     
                        <div class="cubeui-row">
                            <span style='line-height: 30px;padding-right:0px'><b>清理在此时间戳之前创建的容器:</b>(默认清理全部)</span>
                        </div>
                        <div class="cubeui-row">
                            <span style='line-height: 20px;padding-right:0px;color: red'>值可以是Unix时间戳、日期格式的时间戳或Go持续时间字符串（例如10m、1h30m）格式:10m,1h30m</span>
                        </div>
                        <div class="cubeui-row">
                            <input type="text" data-toggle="cubeui-textbox" name="untils"
                                   value='' data-options="required:false,prompt:'格式: 10m,1h30m'">
                        </div>
                    </div>
                </div>
        `;

    $.docker.utils.optionConfirm('清理未运行容器', '重要警告：确定要清空所有未运行容器，清理后数据将无法恢复', html,
        function(param, closeFn){

            $.docker.request.container.prune(function(response){
                let msg = '成功清除{0}个容器, 回收空间{1}'.format(response.Count, response.Size);

                closeFn();

                $.app.show(msg)
                reloadDg()
            }, node, param.labels, param.untils)
        }, null, 450)
}


function runLease(){
    let rows = $('#containersDg').datagrid('getChecked');
    if(rows.length>1){
        $.app.show('本版本仅支持选择一个容器作为模板进行运行');
        return ;
    }

    if(rows.length==0){
        createContainerPanel(null, 2);
        return ;
    }else{
        $.app.show('选择容器{0}作为模板进行运行'.format(rows[0].Name));
        cloneContainer(rows[0].ID, 2);
    }

}

function execLease(){
    let rows = $('#containersDg').datagrid('getChecked');
    if(rows.length>1){
        $.app.show('本版本仅支持选择一个容器执行命令');
        return ;
    }


    if(rows.length==0){
        $.app.show('选择一个容器进行执行命令');
        return ;
    }

    cloneContainer(rows[0].ID, 3);
}

function updateRestartPolicy(btn, id){

    let opts = $(btn).linkbutton('options');

    if(opts.flag==2){

        $.app.confirm("确定修改重启策略？", function(){

            let name = $('#view_RestartPolicy').combobox('getValue');
            let maxcount = $('#MaximumRetryCount').numberspinner('getValue');

            let node = local_node;

            $.docker.request.container.update_restart(function (response) {
                $.app.show('修改重启策略已经完成');

                opts.flag = 1;
                $(btn).linkbutton({
                    text:'修改',
                    iconCls: 'fa fa-pencil-square-o'
                });

                $('#view_RestartPolicy').combobox('readonly', true);
                $('#MaximumRetryCount').numberspinner('readonly', true);

            }, node, id, name, maxcount)
        })

    }else{
        opts.flag = 2;

        $('#view_RestartPolicy').combobox('readonly', false);
        $('#MaximumRetryCount').numberspinner('readonly', false);

        $(btn).linkbutton({
            text:'确定',
            iconCls: 'fa fa-check-square-o'
        });
    }
}

function showImportFile(id){

    let node = local_node;

    let import_html = `
                <div style="margin: 0px;">
                </div>
                <div class="cubeui-fluid">
                    <fieldset>
                        <legend>导入归档选项</legend>
                    </fieldset>
                    <div style="margin-top:5px">
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm12" style="margin-top: 5px">
                                    <label class="cubeui-form-label">容器系统目标目录:</label>
                                    <div class="cubeui-input-block">
                                        <input type="text" data-toggle="cubeui-textbox" name="path"
                                               value=''
                                               data-options="
                                                        required:false,prompt:'容器中要将存档内容提取到的目录的路径；比如/etc/nginx/conf'
                                                        "
                                        >
                                    </div>
                                </div>             
                                <div class="cubeui-col-sm12" style="margin-top: 5px">
                                    <label class="cubeui-form-label">归档文件:</label>
                                    <div class="cubeui-input-block">
                                        <input  data-toggle="cubeui-filebox" id="import_file" data-options="
                                            prompt:'必须是使用以下算法之一压缩的tar存档：identity（无压缩）、gzip、bzip2或xz。',
                                            buttonText: '选择文件',
                                            accept:'.tar',
                                            required:true,
                                            " style="width:100%">  
                                    </div>
                                </div>   
                                          
                            </div> 
                            
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm3">
                                    <label class="cubeui-form-label" title="如果选中；解压缩给定内容相同文件覆盖目时录，将会出现错误；不选中；可以用文件覆盖目录">非目录不覆盖:</label>
                                    <div class="cubeui-input-block">
                                        <input data-toggle="cubeui-switchbutton" checked 
                                            name="noOverwriteDirNonDir" value="1" data-options="onText:'',offText:'',width:60">
                                    </div>
                                </div>
                            </div> 
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm3">
                                    <label class="cubeui-form-label" title="如果选中；将UID/GID映射复制到目标文件或目录；不选中；不复制UID/GID映射">复制UID/GID:</label>
                                    <div class="cubeui-input-block">
                                        <input data-toggle="cubeui-switchbutton" checked
                                            name="copyUIDGID" value="1" data-options="onText:'',offText:'',width:60">
                                    </div>
                                </div>
                            </div> 
                    </div>
                </div>
        `;

    $.docker.utils.optionConfirm('导入容器文件系统归档文件', '导入已归档文件至容器文件系统目录？', import_html,
        function(param, closeFn) {
            console.log(param)

            if ($.extends.isEmpty(param.path)) {
                $.app.show("需要填写要归档导入的容器系统目标目录路径")
                return false;
            }

            let files = $('#import_file').filebox('files');
            console.log(files)

            $.easyui.file.getReader(function(e){
                console.log(e);

                $.docker.request.container.extract(function (response) {

                    $.app.show('归档导入容器目录{0}成功'.format(param.path.htmlEncode()));
                    // closeFn();
                    reloadDg()

                }, node, id, this.result, param.path, param.noOverwriteDirNonDir, param.copyUIDGID);

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

        }, null, 450, 750)
}


function showExportFile(id){

    let node = local_node;

    let export_html = `
                <div style="margin: 0px;">
                </div>
                <div class="cubeui-fluid">
                    <fieldset>
                        <legend>导出选项</legend>
                    </fieldset>
                    <div style="margin-top:5px">
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm12" style="margin-top: 5px">
                                    <label class="cubeui-form-label">归档源文件地址:</label>
                                    <div class="cubeui-input-block">
                                        <input type="text" data-toggle="cubeui-textbox" name="path"
                                               value=''
                                               data-options="
                                                        required:false,prompt:'要存档导出的容器文件系统中的资源；比如/etc/nginx/conf'
                                                        "
                                        >
                                    </div>
                                </div>                                
                            </div> 
                    </div>
                </div>
        `;

    $.docker.utils.optionConfirm('归档容器文件系统文件导出', '从容器文件系统导出指定文件或者目录？', export_html,
    function(param, closeFn) {
        console.log(param)

        if ($.extends.isEmpty(param.path)) {
            $.app.show("需要填写要存档导出的容器文件系统中的资源")
            return false;
        }

        $.app.showProgress('获取归档数据中......');

        let bytes = new ByteArray();
        $.docker.request.container.archive(node, id, param.path, function (data, xhr, state, flag) {

            if (flag == 1) {
                let uint8View = new Uint8Array(data);
                bytes.push(uint8View)
                $.extends.downloadStream(bytes.readBytes(), param.path + '.tar', 'octet/stream');
            } else {
                console.log(data.length);
            }
        }, function (xhr, state) {
            console.log("archive is finished");

            $.app.closeProgess();

            if (xhr.status < 400) {
                console.log(xhr)
                $.app.show('{0}归档已经准备成功，请等待下载'.format(param.path.htmlEncode()))
            } else {

                if(xhr.data!=null){
                    if(xhr.data.binary!=null){
                        let msg = ab2str(xhr.data.binary);
                        $.app.show('文件归档失败:{0}'.format(msg.htmlEncode()));
                    }else{
                        $.app.show('文件归档失败:{0}'.format((xhr.data+"").htmlEncode()));
                    }
                }else{
                    $.app.show('文件归档失败')
                }
            }
        }, function (xhr, state) {
            console.log('onSend');
        }, function (xhr, state) {
            console.log(xhr);
        })
    }, null, null, 750)
}


function archiveContainer2(){

    let rows = $('#containersDg').datagrid('getChecked');
    if(rows.length>1){
        $.app.show('本版本仅支持选择一个容器归档');
        return ;
    }


    if(rows.length==0){
        $.app.show('选择一个容器归档');
        return ;
    }

    showExportFile(rows[0].ID);
}

function extractContainer2(){

    let rows = $('#containersDg').datagrid('getChecked');

    if(rows.length>1){
        $.app.show('本版本仅支持选择一个容器导入归档');
        return ;
    }


    if(rows.length==0){
        $.app.show('选择一个容器导入归档');
        return ;
    }

    showImportFile(rows[0].ID);
}

function onActivated(opts, title, idx){
    console.log('Container onActivated')
    reloadDg();
    //refreshCharts();
}