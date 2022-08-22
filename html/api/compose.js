function newServiceConfig(){
    return {
        Name:'',
        Description:'',
        Build:newBuildConfig(),
        Image:'',
        CapAdd:[],
        CapDrop:[],
        Repos:'',
        Username:'',
        Password:'',
        Labels:{}
    }
}

function newBuildConfig(){
    return {

    }
}

function newNetworkConfig(){
    return {
        Name:'',
        IPAM:{},
        Labels:{}
    }
}

function newVolumeConfig(){
    return {
        Name:'',
        DriverOpts:{},
        Labels:{}
    }
}