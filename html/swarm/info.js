function rendSwarmPage(){
    $.docker.request.info(local_node, function (data) {
        let d = {};

        d.info = $.extend({}, data);
        d.info.swarm = {};
        if(data.Swarm && !$.extends.isEmpty(data.Swarm.NodeID)){
            d.info.swarm.status = 'On';
            d.info.swarm.custerid = d.info.Swarm.Cluster?(d.info.Swarm.Cluster.ID+'[管理节点]'):'[工作节点]';
            d.info.swarm.nodeid = d.info.Swarm.NodeID;
            d.info.swarm.address = d.info.Swarm.NodeAddr;
        }else{
            d.info.swarm.status = 'Off';
        }

        if(d.info.RegistryConfig.Mirrors){
            d.info.Mirrors = d.info.RegistryConfig.Mirrors.join(" ")
        }

        if(d.info.MemTotal && d.info.MemTotal/1000000000>1){
            d.info.MemTotal = (d.info.MemTotal/1000000000.0).toFixed(2) + ' G'
        }else if(d.info.MemTotal){
            d.info.MemTotal = (d.info.MemTotal/1000000.0).toFixed(2) + ' M'
        }

        $.docker.request.version(local_node, function (vdata) {
            d.version = $.extend({}, vdata);

            $.docker.request.info(local_node, function (data) {

                APP.renderBody("#tmpl1", d);

                refreshSwarmData();

                let d1 = {};
                d1.info = $.extend({}, data);
                fillSwarmData(d1)

                $('#refreshBtn').switchbutton({
                    checked: true,
                    onText:'',offText:'',
                    onChange: function(checked){
                        console.log(checked);
                        if(checked){
                            let r = startSwarmInterval();
                            if(r){
                                $.app.show('自动刷新已经开启')
                            }
                        }else{
                            stopSwamInterval();
                            $.app.show('自动刷新已经关闭')
                        }
                    }
                })

                startSwarmInterval()

            }, true);

        });
    })

    refreshSwarmInfo();
}

let swarm_handle = null

function stopSwamInterval(){
    if (swarm_handle){
        $.easyui.thread.stopLoop(swarm_handle)
    }
    swarm_handle = null
}

function startSwarmInterval(){
    if (swarm_handle){
        $.easyui.thread.stopLoop(swarm_handle)
    }

    swarm_handle = $.easyui.thread.loop(function (){
        refreshSwarmData();
    }, 5000)

    return swarm_handle
}

function fillSwarmData(data){


    if(data.info.Swarm && !$.extends.isEmpty(data.info.Swarm.Cluster)){
        $('#activeCount').text(data.info.Swarm.Nodes);
        $('#managerCount').text(data.info.Swarm.Managers);


        $('#imageCount').text(data.info.Images);
        $('#startCount').text(data.info.ContainersRunning);
        $('#containerCount').text(data.info.Containers);

    }else{

        if(data.info.Swarm && !$.extends.isEmpty(data.info.Swarm.NodeID)){
            $('#activeCount').text('N/A');
            $('#managerCount').text('非管理节点');
        }else{
            $('#activeCount').text('N/A');
            $('#managerCount').text('非Swarm环境');
        }

        $('#imageCount').text('N/A');
        $('#startCount').text('N/A');
        $('#containerCount').text('N/A');
        $('#TaskCount').text('N/A');
        $('#TaskTotal').text('N/A');
    }


    let isChanged = false;
    window.parent.$('.title-summary').hide()

    if(data.info.Images != window.parent.$('.title-image').text()
        || data.info.ContainersRunning != window.parent.$('.title-container').text()
        || data.info.Containers != window.parent.$('.title-container2').text()){
        isChanged = true
    }

    window.parent.$('.title-image').text(data.info.Images)
    window.parent.$('.title-container').text(data.info.ContainersRunning)
    window.parent.$('.title-container2').text(data.info.Containers)


    if(isChanged){
        window.parent.$('.title-summary').show()
    }

}

function refreshSwarmData(){
    $.docker.request.info(local_node, function (data) {
        let d = {};
        d.info = $.extend({}, data);
        fillSwarmData(d)

    }, true);

    refreshUsages();
    refreshConfigCount();
    refreshServiceCount();

    refreshSwarmInfo();
}

function refreshSwarmInfo(){
    $.docker.request.volume.listAll(local_node, function (data) {
        let total = 0;
        let count = 0;

        if(data.Volumes){
            $.each(data.Volumes, function (idx, v) {
                total ++;
                if(v.Driver == 'local'){
                    count ++;
                }
            })
        }

        $('#volumeCount').text(count);
        $('#volumeTotal').text(total);
        //window.parent.$('.title-volume').text(total);
        window.parent.$('.title-volume').text(total);
    }, true);
}

function leaveSwarm(){
    let node = local_node;

    let import_html = `
                <div style="margin: 0px;">
                </div>
                <div class="cubeui-fluid">
                    <fieldset>
                        <legend>退出Swarm集群选项</legend>
                    </fieldset>

                    <div style="margin-top:5px">    
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm3">
                                    <label class="cubeui-form-label" title="如果选中；强制离开swarm，即使这是最后一个管理器，否则它将破坏集群。">强制离开:</label>
                                    <div class="cubeui-input-block">
                                        <input data-toggle="cubeui-switchbutton"
                                            name="force" value="1" data-options="onText:'',offText:'',width:60">
                                    </div>
                                </div>
                            </div> 
                            
                            
                    </div>
                </div>
        `;

    $.docker.utils.optionConfirm('退出Swarm集群', '确认退出Swarm集群的选项？', import_html,
        function(param, closeFn) {
            console.log(param)

            $.docker.request.swarm.leave(function (json, xhr, state) {
                $.app.info("Swarm集群退出成功", function () {
                    closeFn();
                    window.location.reload()
                })
            }, node, param.force==1);

        }, null, 480, 750)
}

function copyToken(obj){
    let t = $(obj);

    let token = t.parent().find('t').text();

    $.extends.copyToClipBoard(token, function () {
        $.app.show('复制到剪贴板成功')
    },function () {
        $.app.show('复制到剪贴板失败')
    })
}

function openTokenDlg(){
    let node = local_node;
    $.docker.request.swarm.inspect(function (response) {

        $.docker.request.info(node, function (res) {

            if($.extends.isEmpty(res.Swarm.RemoteManagers)){
                $.app.show("非管理节点，无法查看令牌");
                return false;
            }

            let advertises = [];
            $.each(res.Swarm.RemoteManagers, function (idx, v) {
                advertises.push(v.Addr)
            })

            advertises = advertises.join(",");

            let import_html = `
                    <div style="margin: 0px;">
                    </div>
                    <div class="cubeui-fluid showtoken">
                        <fieldset>
                            <legend>Swarm集群令牌</legend>
                        </fieldset>
    
                        <div style="margin-top:5px">
                                <div class="cubeui-row" style="margin-top: 5px">
                                    <div class="cubeui-col-sm12" style="margin-top: 5px">
                                        <label class="cubeui-form-label" title="加入SWARM集群的管理节点advertise-addr">
                                        Advertise:
                                        </label>
                                        
                                        <div class="cubeui-input-block">
                                        <span><t class="textspan">{2}</t>
                                           <button type='button' style='float: right;' class="layui-btn-blue layui-btn layui-btn-xs" onclick="copyToken(this);">复制</button>
                                        </span>
                                        </div>
                                    </div>  
                                    
                                    <div class="cubeui-col-sm12" style="margin-top: 5px">
                                        <label class="cubeui-form-label" title="作为工作节点可以使用令牌加入SWARM集群">
                                        工作节点令牌:
                                        </label>
                                        
                                        <div class="cubeui-input-block">
                                        <span><t>{0}</t>
                                           <button type='button' style='float: right;' class="layui-btn-blue layui-btn layui-btn-xs" onclick="copyToken(this);">复制</button>
                                        </span>
                                        </div>
                                    </div>  
                                    
                                    
                                    <div class="cubeui-col-sm12" style="margin-top: 15px">
                                        <label class="cubeui-form-label" title="作为管理节点可以使用令牌加入SWARM集群">
                                        管理节点令牌:</label>
                                        <div class="cubeui-input-block">
                                        <span><t>{1}</t>
                                        <button type='button' style='float: right;' class="layui-btn-orange layui-btn layui-btn-xs" onclick="copyToken(this);">复制</button>
                                        </span>
                                        </div>
                                    </div>
                                </div>
                                
                        </div>
                    </div>
            `.format(response.JoinTokens.Worker, response.JoinTokens.Manager, advertises);

            $.docker.utils.optionConfirm('Swarm集群令牌', null, import_html, function(param, closeFn) {
                closeFn();
            }, null, null, 800);
        })

    }, node)
}

function openJoinSwarmDlg(){

    let node = local_node;

    let import_html = `
                <div style="margin: 0px;">
                </div>
                <div class="cubeui-fluid">
                    <fieldset>
                        <legend>Swarm集群加入选项</legend>
                    </fieldset>

                    <div style="margin-top:5px">
                            <div class="cubeui-row" style="margin-top: 5px">
                                
                                <div class="cubeui-col-sm12" style="margin-top: 5px">
                                    <label class="cubeui-form-label" title="通告给其他节点的外部可访问地址。这可以是192.168.1.1:4567格式的地址/端口组合，也可以是后跟端口号的接口，如eth0:4567。如果省略端口号，则使用侦听地址中的端口号。如果未指定AdvertiseAddr，则会在可能的情况下自动检测到它">
                                    播发地址:</label>
                                    <div class="cubeui-input-block">
                                        <input  data-toggle="cubeui-textbox" name="AdvertiseAddr" data-options="
                                            prompt:'Advertised address播发地址（格式：<ip |接口>[：端口]）; 如果省略端口号，则使用侦听地址中的端口号',                                            
                                            required:true,
                                            " >  
                                    </div>
                                </div>  
                                
                                
                                <div class="cubeui-col-sm12" style="margin-top: 5px">
                                    <label class="cubeui-form-label" title="侦听用于管理器间通信的地址，以及确定用于VXLAN隧道端点（VTEP）的网络接口。这可以是192.168.1.1:4567格式的地址/端口组合，也可以是后跟端口号的接口，如eth0:4567。如果省略端口号，则使用默认swarm侦听端口">
                                    通信侦听地址:</label>
                                    <div class="cubeui-input-block">
                                        <input type="text" data-toggle="cubeui-textbox" name="ListenAddr"
                                               value='0.0.0.0:2377'
                                               data-options="
                                                        required:true,prompt:'侦听用于管理器间通信的地址。如果省略端口号，则使用默认swarm侦听端口; 可以是192.168.1.1:4567格式。也可以是eth0:4567'
                                                        "
                                        >
                                    </div>
                                </div>
                                
                                <div class="cubeui-col-sm12" style="margin-top: 5px;">
                                    <label class="cubeui-form-label" title="用于数据路径通信的地址或接口（格式：<ip | interface>），例如192.168.1.1或接口，
                                    如eth0。如果未指定DataPathAddr，则使用与AdvertiseAddr相同的地址。DataPathAddr指定全局作用域网络驱动程序将向其他节点发布的地址，以便访问在此节点上运行的容器。使用此参数可以将容器数据流量与集群的管理流量分离。">
                                    数据通信地址:</label>
                                    <div class="cubeui-input-block">
                                        <input  data-toggle="cubeui-textbox" name="DataPathAddr" data-options="
                                            prompt:'用于数据路径通信的地址或接口（格式：<ip | interface>）; 如果未指定DataPathAddr，则使用与AdvertiseAddr相同的地址',                                            
                                            required:false,
                                            " >  
                                    </div>
                                </div>  
                                
                                
                                <div class="cubeui-col-sm12" style="margin-top: 5px;">
                                    <label class="cubeui-form-label" title="已经参与swarm的manager节点的地址。">
                                    manager地址:</label>
                                    <div class="cubeui-input-block">
                                        <input  data-toggle="cubeui-textbox" name="RemoteAddrs" data-options="
                                            prompt:'已经参与swarm的manager节点的地址。多个manager使用,号分隔',                                            
                                            required:true,
                                            " >  
                                    </div>
                                </div>  
                                
                                <div class="cubeui-col-sm12" style="margin-top: 5px;">
                                    <label class="cubeui-form-label" title="加入此群的秘密令牌。">
                                    秘密令牌:</label>
                                    <div class="cubeui-input-block">
                                        <input  data-toggle="cubeui-textbox" name="JoinToken" data-options="
                                            prompt:'加入此群的秘密令牌。',     
                                            multiline:true,                                       
                                            required:true,
                                            height:60,
                                            " >  
                                    </div>
                                </div>  
                                
                            </div>
                            
                    </div>
                </div>
        `;

    $.docker.utils.optionConfirm('加入Swarm集群', '确认加入Swarm集群的选项？', import_html,
        function(param, closeFn) {
            console.log(param)

            if ($.extends.isEmpty(param.AdvertiseAddr)) {
                $.app.show("需要填写Advertised address播发地址")
                return false;
            }

            if ($.extends.isEmpty(param.JoinToken)) {
                $.app.show("需要填写加入此群的秘密令牌")
                return false;
            }

            if ($.extends.isEmpty(param.RemoteAddrs)) {
                $.app.show("需要填写加入此swarm的manager节点的地址")
                return false;
            }

            let values = param.RemoteAddrs.split2(" ")

            if($.extends.isEmpty(values)) {
                $.app.show("需要填写加入此swarm的manager节点的地址")
                return false;
            }

            let data = {
                Spec:{

                }
            };

            data.RemoteAddrs = values;

            data.AdvertiseAddr = param.AdvertiseAddr;

            if(!$.extends.isEmpty(param.ListenAddr)){
                data.ListenAddr = param.ListenAddr;
            }

            if(!$.extends.isEmpty(param.DataPathAddr)){
                data.DataPathAddr = param.DataPathAddr;
            }

            data.JoinToken = param.JoinToken;


            $.docker.request.swarm.join(function (json, xhr, state) {
                $.app.info("加入Swarm集群成功", function () {
                    closeFn();
                    window.location.reload()
                })
            }, node, data);

        }, null, 480, 750)
}

function openInitSwarmDlg(){

    let node = local_node;

    let import_html = `
                <div style="margin: 0px;">
                </div>
                <div class="cubeui-fluid">
                    <fieldset>
                        <legend>Swarm集群初始化选项</legend>
                    </fieldset>

                    <div style="margin-top:5px">
                            <div class="cubeui-row" style="margin-top: 5px">
                                
                                <div class="cubeui-col-sm12" style="margin-top: 5px">
                                    <label class="cubeui-form-label" title="通告给其他节点的外部可访问地址。这可以是192.168.1.1:4567格式的地址/端口组合，也可以是后跟端口号的接口，如eth0:4567。如果省略端口号，则使用侦听地址中的端口号。如果未指定AdvertiseAddr，则会在可能的情况下自动检测到它">
                                    播发地址:</label>
                                    <div class="cubeui-input-block">
                                        <input  data-toggle="cubeui-textbox" name="AdvertiseAddr" data-options="
                                            prompt:'Advertised address播发地址（格式：<ip |接口>[：端口]）; 如果省略端口号，则使用侦听地址中的端口号',                                            
                                            required:true,
                                            " >  
                                    </div>
                                </div>  
                                
                                
                                <div class="cubeui-col-sm12" style="margin-top: 5px">
                                    <label class="cubeui-form-label" title="侦听用于管理器间通信的地址，以及确定用于VXLAN隧道端点（VTEP）的网络接口。这可以是192.168.1.1:4567格式的地址/端口组合，也可以是后跟端口号的接口，如eth0:4567。如果省略端口号，则使用默认swarm侦听端口">
                                    通信侦听地址:</label>
                                    <div class="cubeui-input-block">
                                        <input type="text" data-toggle="cubeui-textbox" name="ListenAddr"
                                               value='0.0.0.0:2377'
                                               data-options="
                                                        required:true,prompt:'侦听用于管理器间通信的地址。如果省略端口号，则使用默认swarm侦听端口; 可以是192.168.1.1:4567格式。也可以是eth0:4567'
                                                        "
                                        >
                                    </div>
                                </div>
                                
                                <div class="cubeui-col-sm12" style="margin-top: 5px;">
                                    <label class="cubeui-form-label" title="用于数据路径通信的地址或接口（格式：<ip | interface>），例如192.168.1.1或接口，
                                    如eth0。如果未指定DataPathAddr，则使用与AdvertiseAddr相同的地址。DataPathAddr指定全局作用域网络驱动程序将向其他节点发布的地址，以便访问在此节点上运行的容器。使用此参数可以将容器数据流量与集群的管理流量分离。">
                                    数据通信地址:</label>
                                    <div class="cubeui-input-block">
                                        <input  data-toggle="cubeui-textbox" name="DataPathAddr" data-options="
                                            prompt:'用于数据路径通信的地址或接口（格式：<ip | interface>）; 如果未指定DataPathAddr，则使用与AdvertiseAddr相同的地址',                                            
                                            required:false,
                                            " >  
                                    </div>
                                </div>  
                                
                                
                                <div class="cubeui-col-sm12" style="margin-top: 5px;">
                                    <label class="cubeui-form-label" title="DataPathPort指定数据通信的数据路径端口号。可接受的端口范围为1024到49151。
                                    如果未设置端口或设置为0，则将使用默认端口4789。">
                                    数据路径端口:</label>
                                    <div class="cubeui-input-block">
                                        <input  data-toggle="cubeui-numberspinner" name="DataPathPort" data-options="
                                            prompt:'指定数据通信的数据路径端口号。可接受的端口范围为1024到49151。如果未设置端口，则将使用默认端口4789。',                                            
                                            required:false,
                                            min:1014,
                                            max:49151
                                            " >  
                                    </div>
                                </div>  
                                
                            </div>
                            
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm12" style="margin-top: 5px">
                                    <label class="cubeui-form-label" title="SWARM集群设置的任意键/值标签的元数据,格式为KEY1=VALUE1[ KEY2=VAVLUE2]">标签:</label>
                                    <div class="cubeui-input-block">
                                        <input type="text" data-toggle="cubeui-textbox" name="Labels"
                                               value=''
                                               data-options="
                                                        required:false,prompt:'键/值标签的元数据,格式为KEY1=VALUE1[ KEY2=VAVLUE2]。'
                                                        "
                                        >
                                    </div>
                                </div> 
                            </div> 
                            
                            
                    </div>
                </div>
        `;

    $.docker.utils.optionConfirm('初始化想新的Swarm集群', '确认初始化新的Swarm集群的选项？', import_html,
        function(param, closeFn) {
            console.log(param)

            if ($.extends.isEmpty(param.AdvertiseAddr)) {
                $.app.show("需要填写Advertised address播发地址")
                return false;
            }

            let data = {
                Spec:{

                }
            };
            data.AdvertiseAddr = param.AdvertiseAddr;

            if(!$.extends.isEmpty(param.ListenAddr)){
                data.ListenAddr = param.ListenAddr;
            }

            if(!$.extends.isEmpty(param.DataPathAddr)){
                data.DataPathAddr = param.DataPathAddr;
            }

            if(!$.extends.isEmpty(param.DataPathPort)){
                data.DataPathPort = param.DataPathPort;
            }

            if(!$.extends.isEmpty(param.Name)){
                data.Spec.Name = param.Name;
            }

            if(!$.extends.isEmpty(param.Labels)){
                let values = param.Labels.split2(" ")
                if(!$.extends.isEmpty(values)) {
                    data.Spec.labels = $.docker.utils.getKeyValue(values);
                }
            }

            $.docker.request.swarm.init(function (json, xhr, state) {
                $.app.info("Swarm集群初始化成功", function () {
                    closeFn();
                    window.location.reload()
                })
            }, node, data);

        }, null, 480, 750)
}

function refreshConfigCount(){
    $.docker.request.config.total(function(response){
        $('#configCount').text(response.total)
    }, local_node, 0, 0);
}

function refreshServiceCount(){
    $.docker.request.service.total(function(response){
        $('#ServiceCount').text(response.total);
        let DesiredTasks = 0;
        let RunningTasks = 0
        $.each(response.list, function (idx, v) {
            DesiredTasks += $.extends.isEmpty(v.ServiceStatus.DesiredTasks, 0);
            RunningTasks += $.extends.isEmpty(v.ServiceStatus.RunningTasks, 0);
        });
        $('#ReplicasCount').text(DesiredTasks);
        $('#TaskCount').text(RunningTasks);


        $.docker.request.task.listTotal(function(response){
            $('#TaskTotal').text(response.total);
        }, local_node);

    }, local_node, 0, 0);
}

function onActivated(opts, title, idx){
    console.log('onActivated')
    refreshSwarmData();
    //refreshCharts();
}