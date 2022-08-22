let ROOT_ID = '0';

let ROOT_SERVICES_ID = 'services-0';
let ROOT_NETWORKS_ID = 'networks-0';
let ROOT_VOLUMES_ID = 'volumes-0';
let ROOT_SECRETS_ID = 'secrets-0';
let ROOT_CONFIGS_ID = 'configs-0';
let ROOT_EXTRAS_ID = 'extras-0';

function getRoot(){
    return getTreeObj().treegrid('getFooterRows');
}

function getTreeObj(){
    return $('#composeDg');
}

function getServices(){
    return getTreeObj().treegrid('getChildren', ROOT_SERVICES_ID);
}

function getNetworks(){
    return getTreeObj().treegrid('getChildren', ROOT_NETWORKS_ID);
}

function getVolumes(){
    return getTreeObj().treegrid('getChildren', ROOT_VOLUMES_ID);
}

function buildTreeDatas(orchestratorData){
    return [{
        text: '编排计划',
        "id": ROOT_ID,
        'type':'root',
        "iconCls": "fa fa-delicious",
        children:[{
            text: '服务',
            "id": ROOT_SERVICES_ID,
            'type':'services',
            state: "closed",
            "iconCls": "fa fa-spinner",
        },{
            text: '网络',
            "id": ROOT_NETWORKS_ID,
            'type':'networks',
            state: "closed",
            "iconCls": "fa fa-usb",
        },{
            text: '数据卷',
            "id": ROOT_VOLUMES_ID,
            'type':'volumes',
            state: "closed",
            "iconCls": "fa fa-database",
        },{
            text: '密码文件',
            "id": ROOT_SECRETS_ID,
            'type':'secrets',
            state: "closed",
            "iconCls": "fa fa-key",
        },{
            text: '配置文件',
            "id": ROOT_CONFIGS_ID,
            'type':'configs',
            state: "closed",
            "iconCls": "fa fa-gear",
        },{
            text: '其他项目',
            "id": ROOT_EXTRAS_ID,
            'type':'extras',
            state: "closed",
            "iconCls": "fa fa-tasks",
        }]
    }];
}

function addService2Root(serviceConfig){
    let services = getServices();

    let idx = findIdx(services, serviceConfig.Name, 'text')
    if(idx>=0 && services[idx].id!=serviceConfig.id){
        return false;
    }

    let to = getTreeObj();
    serviceConfig.parent = ROOT_SERVICES_ID;

    if($.extends.isEmpty(serviceConfig.id)){
        serviceConfig.id = Math.uuid();
    }

    to.treegrid('append',{
        parent : serviceConfig.parent,  // the node has a 'id' value that defined through 'idField' property
        data: [{
            data:serviceConfig,
            text:serviceConfig.Name,
            id: serviceConfig.id,
            type:'service',
            iconCls: "fa fa-circle-o-notch"
        }]
    });

    to.treegrid('refresh', serviceConfig.parent);
    to.treegrid('expand', serviceConfig.parent);

    return true;
}

function addNetwork2Root(networkConfig){
    let networks = getNetworks();

    let idx = findIdx(networks, networkConfig.Name, 'text')
    if(idx>=0 && networks[idx].id!=networkConfig.id){
        return false;
    }

    let to = getTreeObj();
    networkConfig.parent = ROOT_NETWORKS_ID;

    if($.extends.isEmpty(networkConfig.id)){
        networkConfig.id = Math.uuid();
    }

    to.treegrid('append',{
        parent : networkConfig.parent,  // the node has a 'id' value that defined through 'idField' property
        data: [{
            data:networkConfig,
            text:networkConfig.Name,
            id: networkConfig.id,
            type:'network',
            iconCls: "fa fa-sitemap"
        }]
    });

    to.treegrid('refresh', networkConfig.parent);
    to.treegrid('expand', networkConfig.parent);

    return true;
}

function addVolume2Root(volumeConfig){
    let volumes = getVolumes();

    let idx = findIdx(volumes, volumeConfig.Name, 'text')
    if(idx>=0 && volumes[idx].id!=volumeConfig.id){
        return false;
    }

    let to = getTreeObj();
    volumeConfig.parent = ROOT_VOLUMES_ID;

    if($.extends.isEmpty(volumeConfig.id)){
        volumeConfig.id = Math.uuid();
    }

    to.treegrid('append',{
        parent : volumeConfig.parent,  // the node has a 'id' value that defined through 'idField' property
        data: [{
            data:volumeConfig,
            text:volumeConfig.Name,
            id: volumeConfig.id,
            type:'volume',
            iconCls: "fa fa-tasks"
        }]
    });

    to.treegrid('refresh', volumeConfig.parent);
    to.treegrid('expand', volumeConfig.parent);

    return true;
}

function loadTreeDg(orchestratorData){
    $('#composeDg').iTreegrid({
        idField:'id',
        treeField:'text',
        singleSelect:true,
        showHeader:false,
        animate:true,
        onLoadSuccess:$.easyui.event.wrap($.fn.treegrid.defaults.onLoadSuccess,function (row) {
            console.log(row);
            if(row && row.data){
                $(this).treegrid('enableDnd', row?row.id:null);
            }
        }),
        onDblClickRow:function (row) {
            if(row == null){
                return ;
            }
            if(!row.data){
                getTreeObj().treegrid('toggle', row.id);
            }else{
                if(row.type == 'service'){
                    showServicePanel(row.data);
                }else if(row.type == 'network'){
                    showNetworkPanel(row.data);
                }else if(row.type == 'volume'){
                    showVolumePanel(row.data);
                }
            }
        },
        onContextMenu:function(e, row){
            console.log(row)
            e.preventDefault();

            createContextMenu(e, row);
        },
        //data:[{"id":"2","creatorId":"admin","creator":"系统管理员","createTime":"2016-10-06 13:31:38","modifierId":"admin","modifier":"系统管理员","modifyTime":"2018-06-08 08:44:15","creatorOrgId":0,"typeValue":"公司企业","typeText":"1","id":2,"pid":1,"node_name":"192.168.56.101:32379","checked":null,"state":"closed","attributes":null,"levelId":1,"sort":1,"code":"ginghan","status":"1","isDel":0,"leaderId":"ginghan000001","iconCls":null}],
        data:buildTreeDatas(orchestratorData),
        columns: [[
            {
                field:'text',
                width:'100%'
            }]]
    })
}
