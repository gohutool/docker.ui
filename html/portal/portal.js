function rendPage(){
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

            if(local_node.node_host.toUpperCase().indexOf("UNIX")==0){
                d.info.DOCKERUI_MODE = 1;
            }else{
                d.info.DOCKERUI_MODE = 2;
            }

            fillData(d)

            APP.renderBody("#tmpl1", d);

            console.log(d)

            $('#refreshBtn').switchbutton({
                checked: true,
                onText:'',offText:'',
                onChange: function(checked){
                    console.log(checked);
                    if(checked){
                        let r = startInterval();
                        if(r){
                            $.app.show('自动刷新已经开启')
                        }
                    }else{
                        stopInterval();
                        $.app.show('自动刷新已经关闭')
                    }
                }
            })

            fillData(d)
            startInterval()
        });
    })

    refreshVolumeInfo();
}

function refreshData(){
    $.docker.request.info(local_node, function (data) {
        let d = {};
        d.info = $.extend({}, data);
        fillData(d)

    }, true);

    refreshUsages();

    refreshVolumeInfo();
}

function fillData(data){
    $('#imageCount').text(data.info.Images);
    $('#startCount').text(data.info.ContainersRunning);
    $('#containerCount').text(data.info.Containers);


    if(data.info.Swarm && !$.extends.isEmpty(data.info.Swarm.Cluster)){
        $('#activeCount').text(data.info.Swarm.Nodes);
        $('#managerCount').text(data.info.Swarm.Managers);

        data.info.Swarm.IP = data.info.Swarm.NodeAddr;

    }else{

        if(data.info.Swarm && !$.extends.isEmpty(data.info.Swarm.NodeID)){
            $('#activeCount').text('N/A');
            $('#managerCount').text('非管理节点');
            data.info.Swarm.IP = data.info.Swarm.NodeAddr;
        }else{
            $('#activeCount').text('N/A');
            $('#managerCount').text('非Swarm环境');

            if(local_node.node_host.toLowerCase()=='unix'){
                data.info.Swarm.IP = "Unix(Host)";
            }else{
                data.info.Swarm.IP = local_node.node_host+":"+local_node.node_port;
            }

        }


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

let dgOK  = false

function refreshCharts(){
    // $("#pieChart").charts({
    //     url:"https://www.ginghan.com/pie.json",
    //     onBeforeRender: function (chart, options, option){
    //         console.log("Come in")
    //         return option
    //     },
    //     height:400
    // })
    //
    //
    // $("#lineChart").charts({
    //     url:"https://www.ginghan.com/line.json",
    //     height:400
    // })
    //
    // $("#barChart").charts({
    //     url:"https://www.ginghan.com/bar.json",
    //     height:400
    // })
}

let handle = null

function startInterval(){
    refreshData();

    if (handle){
        $.easyui.thread.stopLoop(handle)
    }

    handle = $.easyui.thread.loop(function (){
        refreshData();
    }, 5000)

    return handle
}

function stopInterval(){
    if (handle){
        $.easyui.thread.stopLoop(handle)
    }
    handle = null
}

function onActivated(opts, title, idx){
    console.log('onActivated')
    refreshData();
    //refreshCharts();
}
