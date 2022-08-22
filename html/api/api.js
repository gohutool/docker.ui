let V3_ENDPOINT = '/docker-api'
let V3_ENDPOINT_STREAM = '/docker-api-stream'

let API_ENDPOINT = ''

let APIS = {}
let API2S = {}
API2S.USAGE = "/usages"

APIS.PING = '/_ping'
APIS.VERSION = '/version'
APIS.INFO = '/info'
APIS.SYSTEM_EVENT = '/events?since={0}&filters={"type":["image","container","volume","network","daemon","node","config"]}'

APIS.VOLUMES = '/volumes'

APIS.IMAGES_LIST = '/images/json'
APIS.IMAGES_DELETE = '/images/{0}'
APIS.IMAGES_PRUNE = '/images/prune'
APIS.IMAGES_PULL = '/images/create'
APIS.IMAGES_PUSH = '/images/{0}/push'
APIS.IMAGES_SEARCH = '/images/search'
APIS.IMAGES_IMPORTS = '/images/load'
APIS.IMAGES_IMPORT = '/images/create?repo={0}:{1}&fromSrc=-'
APIS.IMAGES_IMPORT2 = '/images/load?quiet=false'
APIS.IMAGES_INSPECT = '/images/{0}/json'
APIS.IMAGES_TAG = '/images/{0}/tag'
APIS.IMAGES_HISTORY = '/images/{0}/history'

APIS.BUILDS_CREATE = '/build'
APIS.BUILDS_DELETE = '/build/prune'


APIS.SWARM_INIT = '/swarm/init'
APIS.SWARM_lEAVE = '/swarm/leave'
APIS.SWARM_JOIN = '/swarm/join'
APIS.SWARM_INSPECT = '/swarm'


APIS.EXEC_CREATE = '/containers/{0}/exec'
APIS.EXEC_START = '/exec/{0}/start'


APIS.CONTAINERS_LIST = '/containers/json'
APIS.CONTAINERS_START = '/containers/{0}/start'
APIS.CONTAINERS_RESTART = '/containers/{0}/restart?t={1}'
APIS.CONTAINERS_STOP = '/containers/{0}/stop'
APIS.CONTAINERS_KILL = '/containers/{0}/kill'
APIS.CONTAINERS_LOG = '/containers/{0}/logs?follow=true&stdout=true&stderr=false&since=0&until=0&timestamps=true&tail=all'
APIS.CONTAINERS_DELETE = '/containers/{0}'
APIS.CONTAINERS_INSPECT = '/containers/{0}/json?size=true'
APIS.CONTAINERS_PROCESSES = '/containers/{0}/top'
APIS.CONTAINERS_CHANGES = '/containers/{0}/changes'
APIS.CONTAINERS_EXPORT = '/containers/{0}/export'
APIS.CONTAINERS_ARCHIVE = '/containers/{0}/archive'
APIS.CONTAINERS_EXTRACT = '/containers/{0}/archive?path={1}&noOverwriteDirNonDir={2}&copyUIDGID={3}'
APIS.CONTAINERS_PAUSE = '/containers/{0}/pause'
APIS.CONTAINERS_UNPAUSE = '/containers/{0}/unpause'
APIS.CONTAINERS_USAGE = '/containers/{0}/stats?stream=true'
APIS.CONTAINERS_CREATE = '/containers/create?name={0}'
APIS.CONTAINERS_UPDATE = '/containers/{0}/update'
APIS.CONTAINERS_PRUNE = '/containers/prune'

APIS.VOLUMES_LIST = '/volumes'
APIS.VOLUMES_CREATE = '/volumes/create'
APIS.VOLUMES_INSPECT = '/volumes/{0}'
APIS.VOLUMES_DELETE = '/volumes/{0}'
APIS.VOLUMES_PRUNE = '/volumes/prune'

APIS.NODES_LIST = '/nodes';
APIS.NODES_INSPECT = '/nodes/{0}';
APIS.NODES_DELETE = '/nodes/{0}';
APIS.NODES_UPDATE = '/nodes/{0}/update?version={1}';


APIS.SECRETS_LIST = '/secrets';
APIS.SECRETS_INSPECT = '/secrets/{0}';
APIS.SECRETS_DELETE = '/secrets/{0}';
APIS.SECRETS_CREATE = '/secrets/create';
APIS.SECRETS_UPDATE = '/secrets/{0}/update?version={1}';

APIS.CONFIGS_LIST = '/configs';
APIS.CONFIGS_INSPECT = '/configs/{0}';
APIS.CONFIGS_DELETE = '/configs/{0}';
APIS.CONFIGS_CREATE = '/configs/create';
APIS.CONFIGS_UPDATE = '/configs/{0}/update?version={1}';

APIS.NETWORKS_LIST = '/networks';
APIS.NETWORKS_INSPECT = '/networks/{0}?verbose=true';
APIS.NETWORKS_DELETE = '/networks/{0}';
APIS.NETWORKS_CREATE = '/networks/create';
APIS.NETWORKS_UPDATE = '/networks/{0}/update?version={1}';
APIS.NETWORKS_PRUNE = '/networks/prune';
APIS.NETWORKS_CONNECT = '/networks/{0}/connect';
APIS.NETWORKS_DISCONNECT = '/networks/{0}/disconnect';

APIS.SERVICES_LIST = '/services';
APIS.SERVICES_INSPECT = '/services/{0}?insertDefaults=true';
APIS.SERVICES_DELETE = '/services/{0}';
APIS.SERVICES_CREATE = '/services/create';
APIS.SERVICES_UPDATE = '/services/{0}/update?version={1}';
APIS.SERVICES_PRUNE = '/services/prune';
APIS.SERVICES_LOG = '/services/{0}/logs?details=true&follow=true&stdout=true&stderr=false&since=0&until=0&timestamps=true&tail=all';


APIS.TASKS_LIST = '/tasks';
APIS.TASKS_INSPECT = '/tasks/{0}?insertDefaults=true';
APIS.TASKS_LOG = '/tasks/{0}/logs?details=true&follow=true&stdout=true&stderr=false&since=0&until=0&timestamps=true&tail=all';

// function
$.app.beforeRequest = function (options) {
    if (options.headers && options.headers.isetcd) {
        //let data = options.data;
        options.isetcd = options.headers.isetcd

        delete options.headers.Authorization

        if (!$.extends.isEmpty(options.headers.token)) {
            options.headers.Authorization = options.headers.token

        }

        delete options.headers.isetcd
        delete options.headers.uid
        delete options.headers.token
    }

    //options.headers['Accept-Encoding'] = 'gzip, deflate, br'

    console.log(options)
}

$.app.afterSuccess = function (options, response) {

    if (options.headers.isetcd || response.xhr.getResponseHeader("Grpc-Metadata-Content-Type") == "application/grpc") {
        let data = response.data

        if (data && typeof data == 'object') {
            data.status = 0
            response.data = data
            response.data.statusCode = response.xhr.status
        } else {
        }
    }

    console.log("$.app.afterSuccess")
    console.log(response)
}

$.app.afterError = function (options, response) {
    console.log("$.app.afterError")

    if (response.data) {
        response.data.statusCode = response.xhr.status
    }

    console.log(response)
}

$.docker = {}

$.docker.getHtml = function(url, datastr, fn){
    $.app.get(url, datastr, function (html) {
        if(fn){
            fn(html)
        }
    });
}

$.docker.ajaxStream = function (url, datastr, fn, requestHeader, options, sendFn, onChunksFn, onOneChunkFn) {

    if (requestHeader == null) {
        requestHeader = {};
    }

    requestHeader['Content-Type'] = requestHeader['Content-Type'] || 'application/json; charset=UTF-8';

    /**/

    if (!$.extends.isEmpty(requestHeader.token)) {
        requestHeader.Authorization = requestHeader.token;
        delete requestHeader.token;

    }

    let method = 'POST'

    if (options && options.method) {
        method = options.method
    }


    let opt = $.extend({
        headers: requestHeader,
        method: method,
        data: datastr
    }, options);

    return $.app.ajaxStream(url, opt,
        function (xhr, state, chunk) {
            if (!$.extends.isEmpty(chunk)) {
                if (fn) {
                    fn(xhr, state, chunk)
                }
            }
        }, sendFn, onChunksFn, onOneChunkFn);
}

$.docker.get = function (url, datastr, fn, requestHeader, progressing) {

    if (requestHeader == null) {
        requestHeader = {};
    }

    requestHeader.isetcd = true

    if (datastr && typeof datastr == 'object') {
        //datastr = $.extends.json.tostring(datastr)
    }

    //requestHeader['Content-Type'] = 'application/json; charset=UTF-8';

    $.app.ajax(url, datastr, 'GET', "text", fn, true, progressing, requestHeader);
};

$.docker.getJson = function (url, datastr, fn, requestHeader, progressing) {

    if (requestHeader == null) {
        requestHeader = {};
    }

    requestHeader.isetcd = true

    if (datastr && typeof datastr == 'object') {
        //datastr = $.extends.json.tostring(datastr)
    }

    //requestHeader['Content-Type'] = 'application/json; charset=UTF-8';

    $.app.ajax(url, datastr, 'GET', "json", fn, true, progressing, requestHeader);
};


$.docker.postJsonBody = function (url, datastr, fn, requestHeader, progressing) {

    if (requestHeader == null) {
        requestHeader = {};
    }

    requestHeader.isetcd = true

    if (datastr && typeof datastr == 'object') {
        // datastr = $.extends.json.tostring(datastr)
    }

    requestHeader['Content-Type'] = 'application/json; charset=UTF-8';

    $.app.ajax(url, datastr, 'POST', "json", fn, true, progressing, requestHeader);
};


//fn, options, sendFn, onChunksFn, onOneChunkFn
$.docker.postBodyStream = function (url, datas, fn, requestHeader, options, sendFn, onChunksFn, onOneChunkFn) {

    // let longInt8View = byte2UInt8Array(bytes);
    //
    // xhr.open("POST", url, false);
    //
    // xhr.send(myArray);

    options = $.extend({}, options);
    options = $.extend(options,{
        'processData': false,
        'contentType': 'application/x-tar',
    });

    let method = options.method||'POST';

    if (requestHeader == null) {
        requestHeader = {};
    }

    requestHeader['Content-Type'] = 'application/x-tar';

    let data = new Blob([datas], {type: 'application/x-tar'});

    return $.docker.ajaxStream(url, data, fn, requestHeader, options, sendFn, onChunksFn, onOneChunkFn)
};

$.docker.postBody = function (url, datas, fn, requestHeader, progressing, method) {

    // let longInt8View = byte2UInt8Array(bytes);
    //
    // xhr.open("POST", url, false);
    //
    // xhr.send(myArray);


    if (requestHeader == null) {
        requestHeader = {};
    }

    method = method||'POST';

    requestHeader.isetcd = true

    requestHeader['Content-Type'] = 'application/x-tar';

    let data = new Blob([datas], {type: 'application/x-tar'});

    $.app.ajax(url, data, method, null, fn, true, progressing, requestHeader,{
        'processData': false,
        'contentType': 'application/x-tar',
    });
};

$.docker.postJson = function (url, datastr, fn, requestHeader, progressing, dataType) {

    if (requestHeader == null) {
        requestHeader = {};
    }

    requestHeader.isetcd = true

    if (datastr && typeof datastr == 'object') {
        //datastr = $.extends.json.tostring(datastr)
    }

    $.app.ajax(url, datastr, 'POST', dataType || "json", fn, true, progressing, requestHeader);
};

$.docker.deleteJson = function (url, datastr, fn, requestHeader, progressing) {

    if (requestHeader == null) {
        requestHeader = {};
    }

    requestHeader.isetcd = true

    if (datastr && typeof datastr == 'object') {
        //datastr = $.extends.json.tostring(datastr)
        datastr = $.param(datastr)
    }

    $.app.ajax(url + '?' + datastr, null, 'DELETE', "json", fn, true, progressing, requestHeader);
};

$.docker.callback = {
    authorizeRefreshed: function (token, response) {
    },
    tokenInvalid: function () {
    }
}

$.docker.request = {
    prefixFormat: function (prefix) {
        if ($.extends.isEmpty(prefix))
            return prefix;

        if (prefix.length == 1) {
            return String.fromCharCode(prefix.charCodeAt(0) + 1)
        } else {
            return prefix.substring(0, prefix.length - 1) + String.fromCharCode(prefix.charCodeAt(prefix.length - 1) + 1)
        }
    },
    buildTokenHeader: function (serverInfo) {
        // let local_node = {
        //     node_host:"192.168.56.102",
        //     node_port:"2375",
        //     node_version:"v1.40",
        // }

        return {
            endpoint: serverInfo.node_host + ":" + serverInfo.node_port,
            endpoint_version: serverInfo.node_version,
        };
        //
        // if(serverInfo.authorized_enabled!='1'){
        //     return {};
        // }
        //
        // return {"token":serverInfo.node_token};
    },
    ajaxStream: function (serverInfo, url, data, fn, options, sendFn, onChunksFn, onOneChunkFn) {
        return $.docker.ajaxStream(url, data, fn, $.docker.request.buildTokenHeader(serverInfo), options, sendFn, onChunksFn, onOneChunkFn)
    },
    debug: function (fn, serverInfo, uri, data) {
        $.docker.request.execute(serverInfo, function (node) {
            $.docker.postJson(V3_ENDPOINT.format2(node) + uri, data, function (response) {
                if ($.docker.response.retoken(serverInfo, response))
                    return;

                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                } else {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }
            }, $.docker.request.buildTokenHeader(serverInfo))
        });
    },
    execute: function (serverInfo, cmd) {
        if ($.extends.isEmpty(serverInfo)) {
            $.app.show('节点信息不存在，请关闭连接后重新连接');
            // cmd.call(serverInfo, {});
        } else {
            let node = serverInfo
            cmd.call(serverInfo, node);
        }
    },
    ping: function (nodeInfo, fn) {
        let url = V3_ENDPOINT.format2(nodeInfo) + APIS.PING;
        $.docker.get(url, null, function (response) {
            fn.call(nodeInfo, response)
        }, $.docker.request.buildTokenHeader(nodeInfo))
    },
    version: function (nodeInfo, fn, notProcess) {
        $.docker.getJson(V3_ENDPOINT.format2(nodeInfo) + APIS.VERSION, null, function (response) {
            // if ($.docker.response.retoken(nodeInfo, response))
            //     return;

            if ($.docker.response.check(response)) {

                nodeInfo.node_version = "v" + response.ApiVersion;

                if (fn && $.isFunction(fn)) {
                    fn.call(nodeInfo, response)
                }
            }

        }, $.docker.request.buildTokenHeader(nodeInfo), notProcess === true ? '' : null)
    },
    usages: function (nodeInfo, fn, notProcess) {
        $.docker.getJson(API_ENDPOINT.format2(nodeInfo) + API2S.USAGE, null, function (response) {
            // if ($.docker.response.retoken(nodeInfo, response))
            //     return;

            if ($.docker.response.check(response)) {
                if (fn && $.isFunction(fn)) {
                    fn.call(nodeInfo, response)
                }
            }

        }, $.docker.request.buildTokenHeader(nodeInfo), notProcess === true ? '' : null)
    },
    info: function (nodeInfo, fn, notProcess) {

        let p = null;

        if (notProcess === true) {
            p = '';
        }

        $.docker.getJson(V3_ENDPOINT_STREAM.format2(nodeInfo) + APIS.INFO, null, function (response) {
            if ($.docker.response.check(response)) {

                $.docker.utils.setLocalVolume(response.Plugins.Volume);
                $.docker.utils.setLocalLog(response.Plugins.Log);
                $.docker.driver.network.setMap(response.Plugins.Network);


                if(nodeInfo.node_host.toUpperCase().indexOf("UNIX")==0){
                    response.DOCKERUI_MODE = 1;
                }else{
                    response.DOCKERUI_MODE = 2;
                }

                if (fn && $.isFunction(fn)) {
                    fn.call(nodeInfo, response)
                }
            }

        }, $.docker.request.buildTokenHeader(nodeInfo), p)
    },
    system:{
      event:function(fn, node, sendFn, completeFn){
          let ts = parseInt(new Date().getTime()/1000 + "");
          return $.docker.request.ajaxStream(node,
              V3_ENDPOINT_STREAM.format2(node) + APIS.SYSTEM_EVENT.format(ts), null, null, {
                  method: 'get',
                  dataType: 'text',
                  success: function (result, status, xhr) {
                      console.log('success')
                      console.log(xhr)
                  },
                  error: function (xhr, status) {
                      console.log('error')
                      console.log(xhr)
                  },
                  complete: function (xhr, status) {
                      if(completeFn){
                          completeFn(xhr, status)
                      }
                  }
              }, sendFn, function (xhr, state, chucks) {
                  let json = null;

                  try {
                      if (!$.extends.isEmpty(chucks)) {
                          json = chucks
                      }
                  } catch (e) {
                      console.error(e)
                  }

                  fn(json, xhr, state)
              })
      }
    },
    container: {
        list: function (fn, node, skip, count, all, search_type, search_key, sort, order) {

            search_type = $.docker.utils.getFilterType(search_type, search_key, 'container');
            let data = $.docker.utils.buildFilterData(all, search_type, search_key, 'container');
            let filters = $.docker.utils.getFilterValues(search_type, search_key, 'container');

            data['size'] = true

            $.docker.getJson(V3_ENDPOINT.format2(node) + APIS.CONTAINERS_LIST, data, function (response) {

                if ($.docker.response.check(response)) {

                    let temp = [];

                    if (response) {
                        $.each(response, function (idx, v) {

                            v.ID = v.Id;
                            v.LabelStr = $.docker.utils.getLabels(v.Labels);
                            v.Created = $.docker.utils.getDateStr(v.Created);
                            v.Name = $.docker.utils.getContainerNames(v.Names)[0];

                            v.MountStr = $.docker.utils.getMountStr(v.Mounts);
                            v.Image = v.Image;
                            v.ImageID = $.docker.utils.getId(v.ImageID)
                            v.Command = v.Command;
                            v.Status = v.Status;
                            v.State = v.State;

                            v.Running = v.State=='running'?1:0;

                            v.Port = $.docker.utils.getPortStr(v.Ports);
                            v.SizeByte = v.SizeRootFs;
                            v.SizeRootFs = $.docker.utils.getSize(v.SizeRootFs);
                            v.SizeRw = $.docker.utils.getSize(v.SizeRw);

                            let networks = $.docker.utils.getNetworks(v.NetworkSettings?v.NetworkSettings.Networks:null);
                            
                            v.IPStr = [];
                            v.MACStr = [];
                            
                            $.each(networks, function (idx, one) {
                                if(!$.extends.isEmpty(one.IPAddress)){
                                    v.IPStr.push(one.IPAddress)
                                }
                                if(!$.extends.isEmpty(one.GlobalIPv6Address)){
                                    v.IPStr.push(one.GlobalIPv6Address)
                                }
                                if(!$.extends.isEmpty(one.MacAddress)){
                                    v.MACStr.push(one.MacAddress)
                                }
                            })

                            v.IPstr = $.docker.utils.getListStr(v.IPstr, " ");
                            v.MACStr = $.docker.utils.getListStr(v.MACStr, " ")

                            if (search_type == 'name') {
                                if (v.Id.inPrefixArray(filters) < 0 && v.Name.inPrefixArray(filters) < 0) {
                                    return true;
                                }
                            }

                            temp.push(v);
                        })

                        if (sort == 'SizeRootFs')
                            sort = 'SizeByte'

                        temp = $.docker.utils.sortList(temp, sort, order)
                    }

                    let respData = $.docker.response.list2RowData(temp, skip, count)

                    if (fn && $.isFunction(fn)) {
                        fn.call(node, respData)
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },

        create:function(fn, node, name, jsonObj){
            let data = $.extend({}, jsonObj)

            if(data.HostConfig && data.HostConfig.PortBindings && !$.extends.isEmpty(data.HostConfig.PortBindings)){
                let ExposedPorts = {};
                $.each(data.HostConfig.PortBindings, function(k, v){
                    ExposedPorts[k] = {}
                });

                data.ExposedPorts = ExposedPorts;
            }


            data = $.extends.json.tostring(data)

            $.docker.postJsonBody(V3_ENDPOINT.format2(node) + APIS.CONTAINERS_CREATE.format(name), data, function (response) {
                console.log(response)

                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
        update_restart: function(fn, node, id, name, maxcount){
            let data = $.extend({}, {})
            name = $.extends.isEmpty(name, "no")

            data.RestartPolicy = {
                Name: name
            }

            if(name=='on-failure'){
                data.RestartPolicy.MaximumRetryCount = (maxcount||3)*1;
            }

            data = $.extends.json.tostring(data)

            $.docker.postJsonBody(V3_ENDPOINT.format2(node) + APIS.CONTAINERS_UPDATE.format(id), data, function (response) {
                console.log(response)

                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
        inspect: function (fn, node, id) {
            $.docker.getJson(V3_ENDPOINT.format2(node) + APIS.CONTAINERS_INSPECT.format(id), '', function (response) {
                console.log(response)

                let original = $.extend({}, response)
                response.ORIG = original;

                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        v = $.extend(true, {
                            Healthcheck:{},
                        }, response);

                        v.ID = v.Id;
                        v.CreatAt = $.docker.utils.getDateStr4GMT(v.Created);

                        v.Path = v.Path;
                        v.ArgStr = $.docker.utils.getListStr(v.Args,",");

                        v.Running = (v.State&&v.State.Status=='running')?1:0;
                        v.StartAt = $.docker.utils.getDateStr4GMT(v.State && v.State.StartedAt)
                        v.FinishAt = $.docker.utils.getDateStr4GMT(v.State && v.State.FinishedAt)

                        v.Image = v.Image;
                        v.ImageID = $.docker.utils.getIdTrimSHA(v.Image)
                        v.ImageName = v.Config.Image

                        v.LabelStr = $.docker.utils.getLabels(v.Labels);
                        v.MountStr = $.docker.utils.getMountStr(v.Mounts);

                        v.Command = v.Command;
                        v.Status = v.Status;
                        v.State = v.State;


                        v.Port = $.docker.utils.getPortBindingStr(v.NetworkSettings.Ports);
                        v.BindingPort = $.docker.utils.getPortBindingStr(v.HostConfig.PortBindings);
                        v.HostConfig.BindingPortMap = $.docker.utils.getPortBindingMap(v.HostConfig.PortBindings);
                        v.PortMap = $.docker.utils.getPortBindingMap(v.NetworkSettings.Ports);

                        v.SizeByte = v.SizeRootFs;
                        v.SizeRootFs = $.docker.utils.getSize(v.SizeRootFs);
                        v.SizeRw = $.docker.utils.getSize(v.SizeRw);
                        v.HostConfig.ShmSizeStr = $.docker.utils.getSize(v.HostConfig.ShmSize);


                        v.Config.Volumes = v.Config.Volumes||[];
                        v.Config.EnvList = $.docker.utils.list2ObjectList(v.Config.Env);
                        v.Config.CmdStr = $.docker.utils.getListStr(v.Config.Cmd, ' ');
                        v.Config.EntrypointStr = $.docker.utils.getListStr(v.Config.Entrypoint, ' ');

                        v.Config.EntrypointList = $.docker.utils.list2ObjectList(v.Config.Entrypoint);

                        v.HostConfig.LinkAlias = [];

                        if(!$.extends.isEmpty(v.HostConfig.Links)){
                            $.each(v.HostConfig.Links, function (idx, v1) {
                                let two = v1.split(":");
                                v.HostConfig.LinkAlias.push(two[0].replace("/","") + ":" + two[1].replace(v.Name+"/", ""));
                            })
                        }

                        let networks = $.docker.utils.getNetworks(v.NetworkSettings?v.NetworkSettings.Networks:null);

                        v.IPStr = [];
                        v.MACStr = [];

                        $.each(networks, function (idx, one) {
                            if(!$.extends.isEmpty(one.IPAddress)){
                                v.IPStr.push(one.IPAddress)
                            }
                            if(!$.extends.isEmpty(one.GlobalIPv6Address)){
                                v.IPStr.push(one.GlobalIPv6Address)
                            }
                            if(!$.extends.isEmpty(one.MacAddress)){
                                v.MACStr.push(one.MacAddress)
                            }
                        })

                        v.IPstr = $.docker.utils.getListStr(v.IPstr, " ");
                        v.MACStr = $.docker.utils.getListStr(v.MACStr, " ")

                        v.Mounts = v.Mounts||[];

                        v.Name = $.docker.utils.trimContainerName(v.Name);

                        if (fn && $.isFunction(fn)) {
                            fn.call(node, v)
                        }
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
        usage:function(node, id, fn, completeFn, sendFn){
            //
            // let data = {};
            // data['stream'] = true;
            //
            // if(stream){
            //
            // }else{
            //     data['stream'] = false
            // }

            return $.docker.request.ajaxStream(node,
                V3_ENDPOINT_STREAM.format2(node) + APIS.CONTAINERS_USAGE.format(id), '', null, {
                    method: 'get',
                    dataType: 'text',
                    success: function (result, status, xhr) {
                        console.log('success')
                    },
                    error: function (xhr, status) {
                        console.log('error')
                    },
                    complete: function (xhr, status) {
                        console.log('complete')
                        console.log(xhr)
                        if(completeFn)
                            completeFn(xhr, status)
                    }
                }, sendFn, null,function (xhr, state, chuck) {
                    try {
                        if (!$.extends.isEmpty(chuck)) {
                            let json = $.extends.json.toobject2(chuck);
                            fn(json, xhr, state)
                        }
                    } catch (e) {
                        console.error(e)
                    }
                })
        },
        extract:function(fn, node, id, content, path, noOverwriteDirNonDir, copyUIDGID){
            let path2 = encodeURIComponent(path);

            noOverwriteDirNonDir = noOverwriteDirNonDir||'false';
            copyUIDGID = copyUIDGID||'false';

            $.docker.postBody(V3_ENDPOINT.format2(node) + APIS.CONTAINERS_EXTRACT.format(id, path2, noOverwriteDirNonDir, copyUIDGID), content, function (response) {
                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }
            }, $.docker.request.buildTokenHeader(node), null, 'PUT');
        },
        archive: function(node, id, path, fn, completeFn, sendFn, errorFn){

            let data = {};
            data.path = path;
            data = $.param(data)

            return $.docker.request.ajaxStream(node,
                V3_ENDPOINT_STREAM.format2(node) + APIS.CONTAINERS_ARCHIVE.format(id), data, null, {
                    method: 'get',
                    dataType: 'binary',
                    responseType: "arraybuffer",
                    success: function (result, status, xhr) {
                        if ($.isFunction(fn)) {
                            fn(result, xhr, status, 1)
                        }
                        console.log('success')
                    },
                    error: function (xhr, status) {
                        if ($.isFunction(errorFn)) {
                            errorFn(xhr, status)
                        }
                        console.log('error')
                    },
                    complete: function (xhr, status) {
                        console.log('complete')
                        console.log(xhr)
                        if(completeFn)
                            completeFn(xhr, status)
                    }
                }, sendFn, null,function (xhr, state, chuck) {
                    try {
                        if (!$.extends.isEmpty(chuck)) {
                            fn(chuck, xhr, state, 0)
                        }
                    } catch (e) {
                        console.error(e)
                    }
                })
        },
        export: function(node, id, fn, completeFn, sendFn){

            // let oReq = new XMLHttpRequest();
            // oReq.open("GET", V3_ENDPOINT_STREAM.format2(node) + APIS.CONTAINERS_EXPORT.format(id), true);
            // oReq.responseType = "arraybuffer";
            //
            // let headers = $.docker.request.buildTokenHeader(node)
            //
            // $.each(headers, function (k, v) {
            //     oReq.setRequestHeader(k, v);
            // })
            //
            // oReq.onload = function (oEvent) {
            //
            //     console.log(oReq);
            //
            //     let arrayBuffer = oReq.response; // Note: not oReq.responseText
            //     if (arrayBuffer) {
            //         let byteArray = new Uint8Array(arrayBuffer);
            //
            //         console.log(byteArray.length)
            //     }
            // };
            //
            // oReq.send(null);

            return $.docker.request.ajaxStream(node,
                V3_ENDPOINT_STREAM.format2(node) + APIS.CONTAINERS_EXPORT.format(id), '', null, {
                    method: 'get',
                    dataType: 'binary',
                    responseType: "arraybuffer",
                    success: function (result, status, xhr) {
                        if ($.isFunction(fn)) {
                            fn(result, xhr, status, 1)
                        }
                        console.log('success')
                    },
                    error: function (xhr, status) {
                        console.log('error')
                        console.log(xhr)
                    },
                    complete: function (xhr, status) {
                        console.log('complete')
                        console.log(xhr)
                        if(completeFn)
                            completeFn(xhr, status)
                    }
                }, sendFn, null,function (xhr, state, chuck) {
                    try {
                        if (!$.extends.isEmpty(chuck)) {
                            // let json = $.extends.json.toobject2(chuck);
                            fn(chuck, xhr, state, 0)
                        }
                    } catch (e) {
                        console.error(e)
                    }
                })

            // $.docker.request.ajaxStream(node, V3_ENDPOINT.format2(node) + APIS.CONTAINERS_EXPORT.format(id),
            //     {}, function(xhr, state, chuck){
            //         if(fn)
            //             fn(chuck, xhr, state)
            //     }, {
            //         success:function(result, status, xhr){
            //             if(overFn){
            //                 overFn(xhr,status, result)
            //             }
            //         },
            //         error:function(xhr,status){
            //             if(overFn){
            //                 overFn(xhr,status, null)
            //             }
            //         }
            //     });

        },
        changes:function(node, id, fn, skip, count, path, sort, order){
            $.docker.getJson(V3_ENDPOINT.format2(node) + APIS.CONTAINERS_CHANGES.format(id), '', function (response) {
                console.log(response)

                if ($.docker.response.check(response)) {

                    let datas = [];

                    let filters = null;

                    if(!$.extends.isEmpty(path)){
                        filters = path.split(",");
                    }

                    $.each(response, function (i, value) {
                        let data = $.extend({}, value);

                        if(filters&&filters.length>0){
                            if (value.Path.inPrefixArray(filters) < 0) {
                                return true;
                            }
                        }

                        if(data.Kind == 0){
                            data.KindName='Modified';
                        }
                        else if(data.Kind == 1){
                            data.KindName='Added';
                        }
                        else if(data.Kind == 2){
                            data.KindName='Deleted';
                        }else{
                            data.KindName='Modified';
                        }

                        datas.push(data)
                    })

                    datas = $.docker.utils.sortList(datas, sort, order)

                    let respData = $.docker.response.list2RowData(datas, skip, count);
                    respData.data = response;

                    if (fn && $.isFunction(fn)) {
                        fn.call(node, respData)
                    }

                }else{
                    let respData = $.docker.response.list2RowData([], 0, null)

                    if (fn && $.isFunction(fn)) {
                        fn.call(node, respData)
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
        processes:function(node, id, fn, args, skip, count, sort, order){

            let data = {}

            data['ps_args'] = args || 'aux'

            $.docker.getJson(V3_ENDPOINT.format2(node) + APIS.CONTAINERS_PROCESSES.format(id), data, function (response) {
                console.log(response)

                if ($.docker.response.check(response)) {

                    let datas = [];

                    $.each(response.Processes, function (_i, value) {
                        let data = {};
                        $.each(response.Titles, function (idx, title) {
                            data[title.replaceAll('%','')] = value[idx]
                        })
                        datas.push(data)
                    })

                    datas = $.docker.utils.sortList(datas, sort, order)
                    let respData = $.docker.response.list2RowData(datas, skip, count);
                    respData.Processes = response.Processes;

                    if (fn && $.isFunction(fn)) {
                        fn.call(node, respData)
                    }
                }else{
                    let respData = $.docker.response.list2RowData([], 0, null)

                    if (fn && $.isFunction(fn)) {
                        fn.call(node, respData)
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
        pause:function(fn, node, id){

            $.docker.postJson(V3_ENDPOINT.format2(node) + APIS.CONTAINERS_PAUSE.format(id), '', function (response) {
                console.log(response)

                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
        unpause:function(fn, node, id){

            $.docker.postJson(V3_ENDPOINT.format2(node) + APIS.CONTAINERS_UNPAUSE.format(id), '', function (response) {
                console.log(response)

                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
        log: function (nodeInfo, id, fn, sendFn, completeFn) {
            return $.docker.request.ajaxStream(nodeInfo,
                V3_ENDPOINT_STREAM.format2(nodeInfo) + APIS.CONTAINERS_LOG.format(id), null, null, {
                    method: 'get',
                    dataType: 'text',
                    success: function (result, status, xhr) {
                        console.log('success')
                        console.log(xhr)
                    },
                    error: function (xhr, status) {
                        console.log('error')
                        console.log(xhr)
                        console.log("日志接收结束[error]");
                    },
                    complete: function (xhr, status) {
                        console.log('complete')
                        console.log(xhr)
                        if(completeFn)
                            completeFn(xhr, status)
                    }
            }, sendFn, function (xhr, state, chucks) {
                    let json = null;

                    try {
                        if (!$.extends.isEmpty(chucks)) {
                            json = chucks
                        }
                    } catch (e) {
                        console.error(e)
                    }

                    fn(json, xhr, state)
            })
        },
        start:function(fn, node, id, detachKeys){
            let data = {}

            if (!$.extends.isEmpty(detachKeys)) {
                data['detachKeys'] = detachKeys;
            }else{
                data['detachKeys'] = "c";
            }
            $.docker.postJson(V3_ENDPOINT.format2(node) + APIS.CONTAINERS_START.format(id), '123', function (response) {
                console.log(response)

                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
        restart:function(fn, node, id, t){
            let data = {}

            if (!$.extends.isEmpty(t)) {
                t = t*1;
            }else{
                t = 50;
            }

            $.docker.postJson(V3_ENDPOINT.format2(node) + APIS.CONTAINERS_RESTART.format(id, t), '123', function (response) {
                console.log(response)

                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
        kill:function(fn, node, id, t){
            $.docker.postJson(V3_ENDPOINT.format2(node) + APIS.CONTAINERS_KILL.format(id), '', function (response) {
                console.log(response)

                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
        stop:function(fn, node, id, t){
            let data = {}

            if (!$.extends.isEmpty(t)||t>0) {
                data['t'] = t
            }

            $.docker.postJson(V3_ENDPOINT.format2(node) + APIS.CONTAINERS_STOP.format(id), data, function (response) {
                console.log(response)

                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
        delete:function (fn, node, id, v, link, force) {
            let data = {}

            if (force === true) {
                data['force'] = true;
            }else{
                data['force'] = false;
            }
            if (link === true) {
                data['link'] = true;
            }else{
                data['link'] = false;
            }
            if (v === true) {
                data['v'] = true;
            }else{
                data['v'] = false;
            }

            $.docker.deleteJson(V3_ENDPOINT.format2(node) + APIS.CONTAINERS_DELETE.format(id), data, function (response) {
                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }
            }, $.docker.request.buildTokenHeader(node))

        },
        prune:function(fn, node, labels, untils) {
            let data1 = $.docker.utils.buildFilterData(false, 'label', labels, 'container');
            let data2 = $.docker.utils.buildFilterData(false, 'until', untils, 'container')

            let filters = {};

            if(data1.filters && data1.filters.label){
                filters.label = $.extends.json.toobject2(data1.filters.label);
            }

            if(data2.filters && data2.filters.until){
                filters.until = $.extends.json.toobject2(data1.filters.until);
            }
            let data = {
                filters: $.extends.json.tostring(filters)
            }

            $.docker.postJson(V3_ENDPOINT.format2(node) + APIS.CONTAINERS_PRUNE, data, function (response) {
                console.log(response)

                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        if(response.ContainersDeleted){
                            response.Count = response.ContainersDeleted.length;
                        }else{
                            response.Count = 0;
                        }

                        response.Size = $.docker.utils.getSize(response.SpaceReclaimed * -1);
                        fn.call(node, response)
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
    },
    exec:{
        exec:function(wsOption, node, id, cmd, user, workDir, notStdOut, notStderr, notStdIn, notTty){

            $.docker.request.container.inspect(function(response){

                if(response.Running==1){

                    wsOption = $.extend({
                        onopen:function(e, id, data){

                        },
                        onmessage:function(e, id, data){

                        },
                        onclose:function(e, id, data){

                        },
                        onerror:function(e, id, data){

                        },
                    }, wsOption);

                    $.docker.request.exec.create(function (id) {

                        response.ExecID = id;
                        let url = "ws://" + window.location.host + "/docker-api-ws/exec?id="+id;
                        let ws = null;

                        ws = $.app.websocket(
                            url,
                            function(e){
                                wsOption.onopen.call(ws, e, id, response)
                            }, function (e) {
                                wsOption.onmessage.call(ws, e, id, response)
                            }, function (e) {
                                wsOption.onclose.call(ws, e, id, response)
                            }, function (e) {
                                wsOption.onerror.call(ws, e, id, response)
                            }, [node.node_host, node.node_port, node.node_version])

                    }, node, id, cmd, user, workDir, notStdOut, notStderr, notStdIn, notTty)

                }else{
                    $.app.show('当前容器{0}还没有启动,不嫩执行容器命令'.format(response.Name));
                }
            }, node, id);
        },
        ls:function(fn, errorFn, node, id, path, user){
            $.docker.request.container.inspect(function(response){
                    if(response.Running==1){
                        $.docker.request.exec.create(function(id){
                            response.ExecID = id;
                            let data = {};
                            data.Detach = false;
                            data.Tty = false;
                            data = $.extends.json.tostring(data);

                            $.docker.postJsonBody(V3_ENDPOINT.format2(node) + APIS.EXEC_START.format(id), data, function (res) {
                                if ($.docker.response.check(res)) {
                                    //response.response = res;
                                    if (fn && $.isFunction(fn)) {
                                        response.response = res.msg;

                                        if(!$.extends.isEmpty(res.msg)){
                                            let files = res.msg.split2("\n");
                                            if(files.length>0){
                                                let result = files.splice(0,1)
                                                result = result[0];
                                                let bs = result.bytes2();
                                                let info = bs.splice(0, 8);
                                                console.log(byteToString(bs));

                                                let FILES = [];

                                                if(info[0]==1){
                                                    let str = byteToString(bs);
                                                    if(str.indexOf("total")<0){
                                                        let attrs = str.split2(' ');

                                                        if(attrs.length>=9 && attrs[0].length == 10){

                                                            let DIR =attrs[0].startsWith("d");

                                                            // if(errorFn){
                                                            //     let msg = '当前路径`{0}`非目录,文件信息为{1}'.format(path, str);
                                                            //     errorFn.call(node, msg)
                                                            // }
                                                            // return ;
                                                            let file = {
                                                                Attr:attrs[0],
                                                                REF:attrs[1],
                                                                OWNER:attrs[2],
                                                                GROUP:attrs[3],
                                                                SIZE:attrs[4],
                                                                SIZEStr:$.docker.utils.getSize(attrs[4], ''),
                                                                DATEStr:attrs[5]+' '+attrs[6]+' '+attrs[7],
                                                                Name:attrs[8],
                                                                TARGET:attrs.length>10?attrs[10]:null,
                                                                SOURCE:v,
                                                                DIR:DIR,
                                                            }
                                                            FILES.push(file);

                                                        }else{
                                                            if(errorFn){
                                                                let msg = byteToString(bs)
                                                                errorFn.call(node, msg)
                                                            }
                                                            return ;
                                                        }
                                                    }
                                                }
                                                else if(info[0]==2){
                                                    if(errorFn){
                                                        let msg = byteToString(bs)
                                                        errorFn.call(node, msg)
                                                    }
                                                    return ;
                                                }


                                                $.each(files, function(idx, v){
                                                    let attrs = v.split2(' ');
                                                    let DIR =attrs[0].startsWith("d");

                                                    let file = {
                                                        Attr:attrs[0],
                                                        REF:attrs[1],
                                                        OWNER:attrs[2],
                                                        GROUP:attrs[3],
                                                        SIZE:attrs[4],
                                                        SIZEStr:$.docker.utils.getSize(attrs[4], ''),
                                                        DATEStr:attrs[5]+' '+attrs[6]+' '+attrs[7],
                                                        Name:attrs[8],
                                                        TARGET:attrs.length>10?attrs[10]:null,
                                                        SOURCE:v,
                                                        DIR:DIR,
                                                    }
                                                    FILES.push(file);
                                                });
                                                response.FILES = FILES;
                                            }

                                        }

                                        response.PATH = path;
                                        fn.call(node, response)
                                    }
                                }else{
                                    if(errorFn){
                                        let msg = res.message
                                        errorFn.call(node, msg)
                                    }
                                }
                            }, $.docker.request.buildTokenHeader(node))

                        }, node, id, ['ls', '-al', path], user, null, false, false, true, true)
                    }else{
                        if(errorFn){
                            errorFn.call(node, '当前容器{0}还没有启动,不嫩执行容器命令'.format(response.Name))
                        }
                    }
            }, node , id);
        },
        create:function(fn, node, id, cmd, user, workDir, notStdOut, notStderr, notStdIn, notTty){
            cmd = $.extends.isEmpty(cmd, "/bin/sh")
            if(!$.isArray(cmd)){
                cmd = cmd.split2(" ")
            }

            let body = {
                "AttachStdin": true,
                "AttachStdout": true,
                "AttachStderr": true,
                "DetachKeys": "ctrl-z",
                "Tty": true,
                "Cmd": cmd,
                "Env": [
                ]
            };

            if(!$.extends.isEmpty(user)){
                body.User = user.trim()
            }
            if(!$.extends.isEmpty(workDir)){
                body.WorkingDir = workDir.trim()
            }
            if(notStdOut){
                body.AttachStdout = false;
            }
            if(notStderr){
                body.AttachStderr = false;
            }
            if(notStdIn){
                body.AttachStdin = false;
            }
            if(notTty){
                body.Tty = false;
            }

            body = $.extends.json.tostring(body)

            $.docker.postJsonBody(V3_ENDPOINT.format2(node) + APIS.EXEC_CREATE.format(id), body, function (response) {
                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response.Id)
                    }
                }
            }, $.docker.request.buildTokenHeader(node))
        }
    },
    build:{
        delete:function(fn, node){
            let data = {};
            data.all = true;

            $.docker.postJson(V3_ENDPOINT.format2(node) + APIS.BUILDS_DELETE, data, function (response) {
                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }
            }, $.docker.request.buildTokenHeader(node))
        },
        create:function(fn, node, content, data, completeFn, sendFn){
            $.docker.request.image.build(fn, node, content, data, completeFn, sendFn);
        }
    },
    image: {
        list: function (fn, node, skip, count, all, search_type, search_key, sort, order) {

            search_type = $.docker.utils.getFilterType(search_type, search_key, 'image');
            let data = $.docker.utils.buildFilterData(all, search_type, search_key, 'image');
            let filters = $.docker.utils.getFilterValues(search_type, search_key, 'image');

            data.digests = true;

            $.docker.getJson(V3_ENDPOINT.format2(node) + APIS.IMAGES_LIST, data, function (response) {

                if ($.docker.response.check(response)) {

                    let temp = [];

                    if (response) {
                        $.each(response, function (idx, v) {
                            v.Id = $.docker.utils.getId(v.Id)
                            v.ID = v.Id

                            v.Created = $.docker.utils.getDateStr(v.Created);
                            v.SizeByte = v.Size;
                            v.Size = $.docker.utils.getSize(v.Size);
                            v.LabelStr = $.docker.utils.getLabels(v.Labels);

                            if (v.RepoTags && v.RepoTags.length > 0) {
                                $.each(v.RepoTags, function (i, tag) {
                                    let RepoTags = tag

                                    RepoTags = $.docker.utils.trimPrefix4ReposTag(RepoTags);
                                    let nv = $.extend({}, v);

                                    $.docker.utils.setReposTag2Object(nv, RepoTags);

                                    if (search_type == 'name') {
                                        if (nv.Id.inPrefixArray(filters) < 0 && nv.Name.inPrefixArray(filters) < 0) {
                                            return true;
                                        }
                                    }

/*
                                    let two = RepoTags.split(":")

                                    if(two.length==1){
                                        nv.Repository = two[0];
                                        nv.Tag = DEFAULT_TAG;
                                        nv.Name = nv.Repository + ':' + nv.Tag;
                                    }else{
                                        let firstIdx = RepoTags.indexOf("/");
                                        let firstIdx2 = RepoTags.indexOf(":");

                                        if(firstIdx<firstIdx2){
                                            nv.Repository = two[0];
                                            nv.Tag = two.length > 1 ? two[1] : DEFAULT_TAG;
                                            nv.Name = nv.Repository + ':' + two[1];
                                        }else{
                                            if(two.length>2){

                                            }else if(two.length==2){
                                                nv.Repository = two[0]+":"+two[1];
                                                nv.Tag = two.length > 1 ? two[1] : NONE;
                                                nv.Name = nv.Repository + ':' + two[1];
                                            }
                                        }
                                    }
                                    nv.Repository = nv.Repository.htmlEncodeBracket();

                                    if(nv.Name == '<none>@<none>'||nv.Name == '<none>:<none>'){
                                        nv.ID = nv.Id;
                                    }else{
                                        nv.Name = tag.htmlEncodeBracket();
                                        nv.ID = tag;
                                    }

                                    nv.Tag = nv.Tag.htmlEncodeBracket();

                                    if (search_type == 'name') {
                                        if (nv.Id.inPrefixArray(filters) < 0 && nv.Name.inPrefixArray(filters) < 0) {
                                            return true;
                                        }
                                    }*/


                                    temp.push(nv);
                                })
                            } else {
                                if(v.RepoDigests&&v.RepoDigests.length>0){
                                    v.Repository = v.RepoDigests[0].split('@')[0]
                                }else{
                                    v.Repository = NONE
                                }

                                v.Tag = NONE
                                v.Name = v.Repository + ':' + v.Tag

                                v.Repository = v.Repository.htmlEncodeBracket();
                                v.Tag = v.Tag.htmlEncodeBracket();
                                v.Name = v.Name.htmlEncodeBracket();

                                if (search_type == 'name') {
                                    if (v.Id.inPrefixArray(filters) < 0 && v.Name.inPrefixArray(filters) < 0) {
                                        return true;
                                    }
                                }

                                temp.push(v);
                            }
                        })

                        if (sort == 'Size')
                            sort = 'SizeByte'

                        temp = $.docker.utils.sortList(temp, sort, order)

                    }

                    let respData = $.docker.response.list2RowData(temp, skip, count)

                    if (fn && $.isFunction(fn)) {
                        fn.call(node, respData)
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
        history:function(fn, node, id){

            $.docker.getJson(V3_ENDPOINT.format2(node) + APIS.IMAGES_HISTORY.format(id), '', function (response) {
                console.log(response)

                if ($.docker.response.check(response)) {


                    if (response) {
                        $.each(response, function (idx, v) {
                            v.CreatAt = $.docker.utils.getDateStdStr4TS(v.Created)
                            v.Image = $.docker.utils.getIdTrimSHA(v.Id);
                            v.TagStr = $.docker.utils.getListStr(v.Tags);
                            v.SizeStr = $.docker.utils.getSize(v.Size);
                        })
                    }

                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }
            }, $.docker.request.buildTokenHeader(node))
        },
        import:function(fn, node, content, fromImage, tag, message){
            if(!$.extends.isEmpty(message)){
                message = '&message='+encodeURIComponent(message);
            }else{
                message = '';
            }

            $.docker.postBody(V3_ENDPOINT.format2(node) + APIS.IMAGES_IMPORT.format(fromImage, tag)+message, content, function (response) {
                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }
            }, $.docker.request.buildTokenHeader(node));
        },
        import2:function(fn, node, content, completeFn, sendFn){
            $.docker.postBodyStream(V3_ENDPOINT.format2(node) + APIS.IMAGES_IMPORT2, content, null, $.docker.request.buildTokenHeader(node), {
                success: function (result, status, xhr) {
                    console.log('import image success');
                },
                error: function (xhr, status) {
                    console.log("import image [error]");
                },
                complete: function (xhr, status) {
                    console.log('import image complete');
                    $.app.closeProgess();

                    if(completeFn)
                        completeFn.call(this, xhr, status)

                }
            },sendFn, null, function (xhr, state, chuck){
                let json = null;

                try {
                    if (!$.extends.isEmpty(chuck)) {
                        json = $.extends.json.toobject2(chuck);

                        if(!$.extends.isEmpty(json.errorDetail)){
                            $.app.show(json.errorDetail.message||json.errorDetail);
                            this.ErrorMsg = json.errorDetail.message||json.errorDetail;
                            console.log("Error:" + json.errorDetail.message||json.errorDetail);
                            xhr.abort();
                        }if(!$.extends.isEmpty(json.message)){
                            $.app.show(json.message);
                            this.ErrorMsg = json.message;
                            console.log("Error:" + json.message);
                            xhr.abort();
                        }else{
                            fn.call(node, json, xhr, state);
                        }
                    }
                } catch (e) {
                    console.error(e)
                }
            });
        },
        build:function(fn, node, content, data, completeFn, sendFn){
            let datastr = $.param(data)

            // $.app.showProgress('开始构建镜像{0}中......'.format(data.t));

            return $.docker.postBodyStream(
                V3_ENDPOINT_STREAM.format2(node) + APIS.BUILDS_CREATE+"?"+datastr, content, null,
                $.docker.request.buildTokenHeader(node),{
                    success: function (result, status, xhr) {
                        console.log('Build image success');
                    },
                    error: function (xhr, status) {
                        console.log("Build image [error]");
                    },
                    complete: function (xhr, status) {
                        console.log('Build image complete');
                        $.app.closeProgess();

                        if(completeFn)
                            completeFn.call(this, xhr, status)

                    }
                }, sendFn, null,
                function (xhr, state, chuck) {
                    let json = null;

                    try {
                        if (!$.extends.isEmpty(chuck)) {
                            json = $.extends.json.toobject2(chuck);

                            if(!$.extends.isEmpty(json.errorDetail)){
                                $.app.show(json.errorDetail.message||json.errorDetail);
                                this.ErrorMsg = json.errorDetail.message||json.errorDetail;
                                console.log("Error:" + json.errorDetail.message||json.errorDetail);
                                xhr.abort();
                            }if(!$.extends.isEmpty(json.message)){
                                $.app.show(json.message);
                                this.ErrorMsg = json.message;
                                console.log("Error:" + json.message);
                                xhr.abort();
                            }else{
                                // if(!$.extends.isEmpty(json.stream)){
                                //     $.app.showProgress('{0}:'.format(json.stream));
                                // }
                                // if(!$.extends.isEmpty(json.status)){
                                //     $.app.showProgress('{0}:'.format(json.progress));
                                // }
                                fn.call(node, json, xhr, state);
                            }
                        }
                    } catch (e) {
                        console.error(e)
                    }
                })

            // $.docker.postBody(V3_ENDPOINT.format2(node) + APIS.BUILDS_CREATE+"?"+datastr, content, function (response) {
            //     if ($.docker.response.check(response)) {
            //         if (fn && $.isFunction(fn)) {
            //             fn.call(node, response)
            //         }
            //     }
            // }, $.docker.request.buildTokenHeader(node));
        },
        inspect: function (fn, node, id) {
            $.docker.getJson(V3_ENDPOINT.format2(node) + APIS.IMAGES_INSPECT.format(id), '', function (response) {
                let original = $.extend({}, response)
                response.ORIG = original;

                console.log(response)

                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {

                        response.RepoTagStr = $.docker.utils.getListStr(response.RepoTags);
                        response.RepoDigestStr = $.docker.utils.getListStr(response.RepoDigests);

                        //response.LabelStr = $.docker.utils.getLabels(response.Labels);
                        response.OptionStr = $.docker.utils.getLabels(response.Options);

                        response.CreatAt = $.docker.utils.getDateStr4GMT(response.Created);
                        response.SizeStr = $.docker.utils.getSize(response.VirtualSize);
                        response.SizeStr = $.docker.utils.getSize(response.Size);

                        response.LastTagTimeStr = $.docker.utils.getDateStr4GMT(response.Metadata?response.Metadata.LastTagTime:null);
                        response.ContainerConfig.EnvList = $.docker.utils.list2ObjectList(response.ContainerConfig.Env)
                        response.ContainerConfig.CmdStr = $.docker.utils.getListStr(response.ContainerConfig.Cmd, ' ');
                        response.ContainerConfig.EntrypointList = $.docker.utils.list2ObjectList(response.ContainerConfig.Entrypoint);

                        response.ContainerConfig.Volumes = response.ContainerConfig.Volumes||[]

                        response.Config.EnvList = $.docker.utils.list2ObjectList(response.Config.Env)
                        response.Config.CmdStr = $.docker.utils.getListStr(response.Config.Cmd, ' ');
                        response.Config.EntrypointList = $.docker.utils.list2ObjectList(response.Config.Entrypoint);

                        response.Mounts = response.Mounts||[];


                        if (fn && $.isFunction(fn)) {
                            fn.call(node, response)
                        }
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
        deleteBulk: function (fn, node, ids, force, prune) {

            ids = ids || [];

            let data = {}
            if (force === true) {
                data['force'] = 'true';
            }
            if (prune == true) {
                data['noprune'] = 'false';
            } else {
                data['noprune'] = 'true';
            }


            let o = ids.length;
            let ok = [];
            let fail = [];

            let responseObj = {};
            responseObj.ok = ok;
            responseObj.fail = fail;

            if (o == 0) {
                if (fn && $.isFunction(fn)) {
                    fn.call(node, responseObj)
                }
                return;
            }

            let loopFn = function (i, idArray) {

                if (i == 0) {
                    $.app.showProgress('批量删除数据卷中......');
                }

                let id = idArray[i];

                $.docker.deleteJson(V3_ENDPOINT.format2(node) + APIS.IMAGES_DELETE.format(id), data, function (response) {

                    if ($.docker.response.check(response)) {
                        ok.push(id)
                    } else {
                        fail.push(id);
                    }

                    i++

                    if (i >= idArray.length) {
                        if (fn && $.isFunction(fn)) {
                            fn.call(node, responseObj)
                            $.app.closeProgess()
                        }
                    } else {
                        loopFn(i, idArray)
                    }

                }, $.docker.request.buildTokenHeader(node), '')
            }

            loopFn(0, ids)

        },
        delete: function (fn, node, id, force, prune) {
            let data = {}
            if (force === true) {
                data['force'] = 'true';
            }
            if (prune == true) {
                data['noprune'] = 'false';
            } else {
                data['noprune'] = 'true';
            }
            $.docker.deleteJson(V3_ENDPOINT.format2(node) + APIS.IMAGES_DELETE.format(id), data, function (response) {
                console.log(response)

                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
        prune: function (fn, node, labels, dangling) {
            let data = $.docker.utils.buildFilterData(false, 'label', labels, 'volume')
            delete data['all'];

            if (dangling == true) {
                data['dangling'] = 'true';
            } else {
                data['dangling'] = 'false';
            }

            $.docker.postJson(V3_ENDPOINT.format2(node) + APIS.IMAGES_PRUNE, data, function (response) {
                console.log(response)

                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        response.Count = response.ImagesDeleted ? response.ImagesDeleted.length : 0;
                        response.Size = $.docker.utils.getSize(response.SpaceReclaimed * -1);
                        fn.call(node, response)
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
        search: function (fn, node, skip, count, official, automated, stars, term, sort, order) {

            let data = {}

            if(official!=null){
                if(official){
                    data["is-official"] = ["true"]
                }else{
                    data["is-official"] = ["false"]
                }
            }

            if(automated!=null){
                if(automated){
                    data["is-automated"] = ["true"]
                }else{
                    data["is-automated"] = ["false"]
                }
            }

            if(!$.extends.isEmpty(stars)){
                data['stars'] = [stars+""]
            }

            let filter = data;
            data = {};
            data['filters'] = $.extends.json.tostring(filter);

            if(!$.extends.isEmpty(term)){
                data['term'] = term
            }

            data['limit'] = 100;

            $.docker.getJson(V3_ENDPOINT.format2(node) + APIS.IMAGES_SEARCH, data, function (response) {

                if ($.docker.response.check(response)) {

                    let temp = [];

                    if (response) {
                        $.each(response, function (idx, v) {

                            v.official = v.is_official==true?'[OK]':'';
                            v.automated = v.is_automated==true?'[OK]':'';
                            v.ID = v.Id
                        })

                        temp = $.docker.utils.sortList(response, sort, order)
                    }

                    let respData = $.docker.response.list2RowData(temp, skip, count)

                    if (fn && $.isFunction(fn)) {
                        fn.call(node, respData)
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
        tag:function(fn, node, id, repo, tag){
            let data = {};
            data.repo = repo;
            data.tag = tag;

            $.docker.postJson(V3_ENDPOINT.format2(node) + APIS.IMAGES_TAG.format(id), data, function (response) {
                // if ($.docker.response.retoken(nodeInfo, response))
                //     return;

                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
        push:function(fn, node, repos, serverAddress, username, password, completeFn){
            if(repos == '<none>:<none>' || repos == '<none>@<none>'){
                $.app.show("待推送镜像名称和标签不正确，请先给该镜像进行标签操作");
                return false;
            }

            $.app.showProgress('开始推送镜像{0}至镜像仓库中......'.format(repos));

            let auth = {}

            if(!$.extends.isEmpty(serverAddress)){
                auth.serveraddress = serverAddress;
            }

            auth.username = $.extends.isEmpty(username, '');
            auth.password = $.extends.isEmpty(password, '');

            auth = Base64.encode($.extends.json.tostring(auth))

            $.docker.ajaxStream(V3_ENDPOINT_STREAM.format2(node) + APIS.IMAGES_PUSH.format(repos), '', null,
                $.extend($.docker.request.buildTokenHeader(node), {
                    "X-Registry-Auth": auth
                }), {
                method: 'POST',
                dataType: 'text',
                success: function (result, status, xhr) {
                    $.app.closeProgess();
                    console.log('success')
                },
                error: function (xhr, status) {
                    $.app.closeProgess();
                    console.log('error')
                },
                complete: function (xhr, status) {
                    $.app.closeProgess();
                    console.log('complete')

                    if(!$.extends.isEmpty(this.ErrorMsg)){
                        $.app.show(this.ErrorMsg)
                        return false;
                    }

                    if(completeFn){
                        completeFn.call(this, xhr, status);
                    }
                }
            }, null, null, function (xhr, state, oneChunk) {
                let json = null;

                try {
                    if (!$.extends.isEmpty(oneChunk)) {
                        json = $.extends.json.toobject2(oneChunk);

                        if(!$.extends.isEmpty(json.errorDetail)){
                            $.app.show(json.errorDetail.message||json.errorDetail);
                            this.ErrorMsg = json.errorDetail.message||json.errorDetail;
                            $.app.show(this.ErrorMsg);
                            $.app.closeProgess();
                            xhr.abort();
                        }if(!$.extends.isEmpty(json.message)){
                            $.app.show(json.message);
                            this.ErrorMsg = json.message;
                            $.app.show(this.ErrorMsg);
                            $.app.closeProgess();
                            xhr.abort();
                        }else{
                            if(!$.extends.isEmpty(json.progressDetail)){
                                let msg = $.extends.json.tostring(json.progressDetail);
                                $.app.show(msg)
                                $.app.showProgress(msg)
                            }

                            if(!$.extends.isEmpty(json.status)){
                                let msg = '';
                                if(!$.extends.isEmpty(json.id)){
                                    msg = "{0}：{1}".format(json.id, json.status);
                                }else{
                                    msg = "{0}".format(json.status);
                                }
                                $.app.show(msg)
                                $.app.showProgress(msg)
                            }
                        }
                    }
                } catch (e) {
                    console.error(e)
                }

                fn.call(node, json, xhr, state);

            })

        },
        pull: function (fn, node, repo, image, tag, sendFn, username, password) {
            let data = {}

            if (!$.extends.isEmpty(repo)) {
                data.repo = repo
            }

            if (!$.extends.isEmpty(image)) {
                data.fromImage = image
            } else {
                data.fromImage = 'joinsunsoft/docker-ui'
            }

            if (!$.extends.isEmpty(tag)) {
                data.tag = tag
            } else {
                data.tag = 'latest'
            }

            let headers = $.docker.request.buildTokenHeader(node);
            headers["Content-Type"] = 'application/x-www-form-urlencoded; charset=UTF-8';

            if(!$.extends.isEmpty(username)){
                let auth = {};
                auth.username = $.extends.isEmpty(username, '');
                auth.password = $.extends.isEmpty(password, '');
                auth = Base64.encode($.extends.json.tostring(auth));
                headers["X-Registry-Auth"] = auth;
            }

            $.app.showProgress('开始拉取镜像{0}:{1}中......'.format(data.fromImage, data.tag));

            $.docker.ajaxStream(V3_ENDPOINT_STREAM.format2(node) + APIS.IMAGES_PULL, data, null, headers, {
                method: 'POST',
                dataType: 'text',

                success: function (result, status, xhr) {
                    if (fn) {
                        fn(result)
                    }
                },
                error: function (xhr, status) {
                    console.log('error')
                    try {
                        let response = $.extends.json.toobject2(xhr.responseText)
                        $.app.show(response.message);
                    } catch (e) {
                        $.app.show(xhr.responseText);
                    }
                },
                complete: function (xhr, status) {
                    $.app.closeProgess();
                    console.log('complete')
                }
            }, sendFn, function (xhr, state, chunks) {
                // console.log(response)
                //
                // if($.docker.response.check(response)) {
                //     if (fn && $.isFunction(fn)) {
                //         fn.call(node, response)
                //     }
                // }

                if(!$.extends.isEmpty(chunks)){
                    let msg = '{0}:[{1}] {2}'.format(new Date().pattern('yyyy-MM-dd HH:mm:ss'), state, chunks);
                    console.log(msg)
                    console.log(chunks)
                }
            })
        },
    },
    volume: {
        listAll: function (nodeInfo, fn, notProcess) {
            $.docker.getJson(V3_ENDPOINT.format2(nodeInfo) + APIS.VOLUMES, null, function (response) {
                // if ($.docker.response.retoken(nodeInfo, response))
                //     return;

                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(nodeInfo, response)
                    }
                }

            }, $.docker.request.buildTokenHeader(nodeInfo), notProcess === true ? '' : null)
        },
        list: function (fn, node, skip, count, all, search_type, search_key, sort, order) {

            search_type = $.docker.utils.getFilterType(search_type, search_key, 'volume');
            let data = $.docker.utils.buildFilterData(all, search_type, search_key, 'volume');
            let filters = $.docker.utils.getFilterValues(search_type, search_key, 'volume');

            data['size'] = true

            $.docker.getJson(V3_ENDPOINT.format2(node) + APIS.VOLUMES_LIST, data, function (response) {

                if ($.docker.response.check(response)) {

                    response = response.Volumes;

                    let temp = [];

                    if (response) {
                        $.each(response, function (idx, v) {

                            v.LabelStr = $.docker.utils.getLabels(v.Labels);
                            v.OptionStr = $.docker.utils.getLabels(v.Options);
                            v.Created = $.docker.utils.getDateStr4GMT(v.CreatedAt);
                            v.Name = v.Name;
                            v.ID = v.Name;
                            v.Mountpoint = v.Mountpoint;
                            v.Driver = v.Driver;
                            v.Options = v.Options;
                            v.Scope = v.Scope;

                            if (search_type == 'name') {
                                if (v.Id.inPrefixArray(filters) < 0 && v.Name.inPrefixArray(filters) < 0) {
                                    return true;
                                }
                            }

                            temp.push(v);
                        })

                        temp = $.docker.utils.sortList(temp, sort, order)
                    }

                    let respData = $.docker.response.list2RowData(temp, skip, count)

                    if (fn && $.isFunction(fn)) {
                        fn.call(node, respData)
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
        inspect: function (fn, node, id) {
            $.docker.getJson(V3_ENDPOINT.format2(node) + APIS.VOLUMES_INSPECT.format(id), '', function (response) {
                console.log(response)

                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {

                        response.LabelStr = $.docker.utils.getLabels(response.Labels);
                        response.OptionStr = $.docker.utils.getLabels(response.Options);

                        response.Created = $.docker.utils.getDateStr4GMT(response.CreatedAt);
                        response.Name = response.Name;
                        response.ID = response.Name;
                        response.Mountpoint = response.Mountpoint;
                        response.Driver = response.Driver;
                        response.Options = response.Options;
                        response.Scope = response.Scope;

                        fn.call(node, response)
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
        create: function (fn, node, name, driver, drvierOpt, labels) {
            let data = {}
            data.Name = name;
            data.Driver = driver;
            data.DriverOpts = $.extend({}, drvierOpt)
            data.Labels = $.extend({}, labels)

            data = $.extends.json.tostring(data)

            $.docker.postJsonBody(V3_ENDPOINT.format2(node) + APIS.VOLUMES_CREATE, data, function (response) {
                console.log(response)

                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
        prune: function (fn, node, labels) {
            let data = $.docker.utils.buildFilterData(false, 'label', labels, 'volume')

            delete data['all'];

            $.docker.postJson(V3_ENDPOINT.format2(node) + APIS.VOLUMES_PRUNE, data, function (response) {
                console.log(response)

                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {

                        if(response.VolumesDeleted){
                            response.Count = response.VolumesDeleted.length;

                        }else{
                            response.Count = 0;
                        }

                        response.Size = $.docker.utils.getSize(response.SpaceReclaimed);

                        fn.call(node, response)
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
        delete: function (fn, node, id, force) {
            let data = {}
            if (force === true) {
                data['force'] = 'true';
            }
            $.docker.deleteJson(V3_ENDPOINT.format2(node) + APIS.VOLUMES_DELETE.format(id), data, function (response) {
                console.log(response)

                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
        deleteBulk: function (fn, node, ids, force) {

            let data = {}
            if (force === true) {
                data['force'] = 'true';
            }

            ids = ids || [];

            let o = ids.length;
            let ok = [];
            let fail = [];

            let responseObj = {};
            responseObj.ok = ok;
            responseObj.fail = fail;

            if (o == 0) {
                if (fn && $.isFunction(fn)) {
                    fn.call(node, responseObj)
                }
                return;
            }

            let loopFn = function (i, idArray) {

                if (i == 0) {
                    $.app.showProgress('批量删除数据卷中......');
                }

                let id = idArray[i];

                $.docker.deleteJson(V3_ENDPOINT.format2(node) + APIS.VOLUMES_DELETE.format(id), data, function (response) {

                    if ($.docker.response.check(response)) {
                        ok.push(id)
                    } else {
                        fail.push(id);
                    }

                    i++

                    if (i >= idArray.length) {
                        if (fn && $.isFunction(fn)) {
                            fn.call(node, responseObj)
                            $.app.closeProgess()
                        }
                    } else {
                        loopFn(i, idArray)
                    }

                }, $.docker.request.buildTokenHeader(node), '')
            }

            loopFn(0, ids)

        }
    },
    node: {
        all:function(fn, node){
            $.docker.request.node.list(function(response){
                let  nodes = {};
                $.each(response.list, function(idx, v){
                    nodes[v.ID] = v;
                })

                if(fn){
                    fn.call(response, nodes);
                }
            }, node, 0, 0);
        },
        list: function (fn, node, skip, count, role, membership, search_type, search_key, sort, order) {
            search_type = $.docker.utils.getFilterType(search_type, search_key, 'node');
            let data = $.docker.utils.buildFilterData(true, search_type, search_key, 'node');

            if(!$.extends.isEmpty(data['filters'])){
                data['filters'] = $.extends.json.toobject2(data['filters']);
            }

            let one = $.extend({}, data['filters']);

            if(!$.extends.isEmpty(role)){
                if(role=='worker'){
                    one.role = ['worker'];
                }else if(role=='manager'){
                    one.role = ['manager'];
                }
            }

            if(!$.extends.isEmpty(membership)){
                if(membership=='accepted'){
                    one.membership = ['accepted'];
                }else if(membership=='pending'){
                    one.membership = ['pending'];
                }
            }

            data['filters'] =$.extends.json.tostring(one);

            $.docker.getJson(V3_ENDPOINT.format2(node) + APIS.NODES_LIST, data, function (response) {

                if ($.docker.response.check(response)) {

                    let temp = [];

                    if (response) {
                        $.each(response, function (idx, v) {

                            let one = $.docker.request.node.buildRowData(v);

                            temp.push(one);
                        })

                        if (sort == 'MemoryBytes')
                            sort = 'MemoryBytesN'

                        temp = $.docker.utils.sortList(temp, sort, order)

                    }

                    let respData = $.docker.response.list2RowData(temp, skip, count)

                    if (fn && $.isFunction(fn)) {
                        fn.call(node, respData)
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
        buildRowData:function(response){
            let v = $.extend({}, response);
            v.Id = v.ID;

            v.Created = $.docker.utils.getDateStr4GMT(v.CreatedAt);
            v.Updated = $.docker.utils.getDateStr4GMT(v.UpdatedAt);
            v.LabelStr = $.docker.utils.getLabels(v.Spec?(v.Spec.Labels):{});
            v.Status = $.extend({}, v.Status);
            v.Name = $.extends.isEmpty(v.Spec.Name, '');

            let status = $.extends.isEmpty(v.Status.State, "down");

            if(status == 'down'){
                status = "离线";
            }else if(status == 'unknown'){
                status = "未知";
            }else if(status == 'ready'){
                status = "就绪";
            }else if(status == 'disconnected'){
                status = "连接失败";
            }else{
                status = "离线";
            }

            let availability = $.extends.isEmpty(v.Spec.Availability, 'drain');

            if(availability=='drain'){
                status = status+"[污点]";
            }else if(availability=='pause'){
                status = status+"[暂停]";
            }

            v.StatuStr =status;
            v.Addr = $.extends.isEmpty(v.Status.Addr,"N/A");

            v.Plugins = $.docker.utils.getPluginsStr(v.Description.Engine.Plugins);

            v.SVersion = $.extends.isEmpty(v.Version.Index,"0");

            v.Hostname = $.extends.isEmpty(v.Description.Hostname,"");
            v.EVersion = $.extends.isEmpty(v.Description.Engine.EngineVersion,"N/A");
            v.Architecture = $.extends.isEmpty(v.Description.Platform.Architecture,"N/A");
            v.OS = $.extends.isEmpty(v.Description.Platform.OS,"N/A");
            v.Platform = $.extends.isEmpty(v.Description.Platform.OS,"") + " " + $.extends.isEmpty(v.Description.Platform.Architecture,"");
            v.MemoryBytes =  $.docker.utils.getSize(($.extends.isEmpty(v.Description.Resources.MemoryBytes,"0"))*1);
            v.MemoryBytesN =  $.extends.isEmpty(v.Description.Resources.MemoryBytes,"0")*1;
            v.CPUs =  (($.extends.isEmpty(v.Description.Resources.NanoCPUs,"0"))/1000000000).toFixed(0);

            v.Role = $.extends.isEmpty(v.Spec.Role, "worker");

            if(v.ManagerStatus && v.Role == 'manager'){
                v.RoleStr = "管理节点";
                v.Role = "manager";

                if(v.ManagerStatus.Leader){
                    v.Leader = 1;
                    v.LeaderStr = "Leader";
                    v.RoleStr = "管理节点[√]";
                }else{
                    v.Leader = 0;
                    v.LeaderStr = "";
                }

                let cstatus = $.extends.isEmpty(v.ManagerStatus.Reachability, "unreachable");

                if(cstatus == 'unreachable'){
                    cstatus = "离线";
                }else if(cstatus == 'reachable'){
                    cstatus = "可用";
                }else if(cstatus == 'unknown'){
                    cstatus = "未知";
                }else{
                    cstatus = "离线";
                }

                v.Reachability = cstatus;
                v.MAddr = $.extends.isEmpty(v.ManagerStatus.Addr, "");

                v.MAddrStr = "{0}[{1}]".format(v.MAddr, cstatus);

            }else{
                v.RoleStr = "工作节点";
                v.Role = "worker";

                v.Leader = -1;
                v.LeaderStr = "";
                v.Reachability = "N/A";
                v.MAddr = "N/A";
                v.MAddrStr = "N/A";
            }

            return v;
        },
        inspect:function(fn, node, id){
            $.docker.getJson(V3_ENDPOINT.format2(node) + APIS.NODES_INSPECT.format(id), '', function (response) {
                if ($.docker.response.check(response)) {

                    let one = $.docker.request.node.buildRowData(response);
                    one.response = response;

                    if (fn && $.isFunction(fn)) {
                        fn.call(node, one)
                    }
                }
            }, $.docker.request.buildTokenHeader(node))

        },
        delete:function(fn, node, id, force){
            let data = {};

            if(force){
                data['force']=true;
            }else{
                data['force']=false;
            }

            $.docker.deleteJson(V3_ENDPOINT.format2(node) + APIS.NODES_DELETE.format(id), data, function (response) {
                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }
            }, $.docker.request.buildTokenHeader(node))
        },
        drain:function(fn, node, id){
          $.docker.request.node.update_status(fn, node, id, 'drain')
        },
        pause:function(fn, node, id){
            $.docker.request.node.update_status(fn, node, id, 'pause')
        },
        active:function(fn, node, id){
            $.docker.request.node.update_status(fn, node, id, 'active')
        },
        update_status:function(fn, node, id, status){
            $.docker.request.node.inspect(function (response) {
                let data = {};
                data.Role = response.Spec.Role;
                data.Availability = status;
                data.Labels = $.extend({}, response.Spec.Labels);
                data.Name = $.extends.isEmpty(response.Name, '');

                data = $.extends.json.tostring(data)

                $.docker.postJsonBody(V3_ENDPOINT.format2(node) + APIS.NODES_UPDATE.format(id, response.Version.Index),
                    data, function (res) {
                        res.Info = response;
                        if ($.docker.response.check(res)) {
                            if (fn && $.isFunction(fn)) {
                                fn.call(node, res)
                            }
                        }
                    }, $.docker.request.buildTokenHeader(node))

            }, node, id);
        },
        update_name:function(fn, node, id, name){
            $.docker.request.node.inspect(function (response) {
                let data = {};
                data.Role = response.Spec.Role;
                data.Availability = response.Spec.Availability;
                data.Labels = $.extend({}, response.Spec.Labels);
                data.Name = name;

                data = $.extends.json.tostring(data)

                $.docker.postJsonBody(V3_ENDPOINT.format2(node) + APIS.NODES_UPDATE.format(id, response.Version.Index),
                    data, function (res) {
                        if ($.docker.response.check(res)) {

                            res.Info = response;

                            if (fn && $.isFunction(fn)) {
                                fn.call(node, res)
                            }
                        }
                    }, $.docker.request.buildTokenHeader(node))

            }, node, id);
        },
        update_labels:function(fn, node, id, kvs){
            $.docker.request.node.inspect(function (response) {
                let data = {};
                data.Role = response.Spec.Role;
                data.Availability = response.Spec.Availability;
                data.Labels = $.extend({}, kvs);
                data.Name = $.extends.isEmpty(response.Name, '');

                data = $.extends.json.tostring(data)

                $.docker.postJsonBody(V3_ENDPOINT.format2(node) + APIS.NODES_UPDATE.format(id, response.Version.Index),
                    data, function (res) {
                        if ($.docker.response.check(res)) {
                            res.Info = response;

                            if (fn && $.isFunction(fn)) {
                                fn.call(node, res)
                            }
                        }
                    }, $.docker.request.buildTokenHeader(node))

            }, node, id);
        },
        promote:function(fn, node, id){
            $.docker.request.node.inspect(function (response) {
                let data = {};
                data.Role = 'manager';
                data.Availability = response.Spec.Availability;
                data.Labels = $.extend({}, response.Spec.Labels);
                data.Name = $.extends.isEmpty(response.Name, '');

                data = $.extends.json.tostring(data)

                $.docker.postJsonBody(V3_ENDPOINT.format2(node) + APIS.NODES_UPDATE.format(id, response.Version.Index),
                    data, function (res) {
                    if ($.docker.response.check(res)) {
                        if (fn && $.isFunction(fn)) {

                            res.Info = response;

                            fn.call(node, res)
                        }
                    }
                }, $.docker.request.buildTokenHeader(node))

            }, node, id);
        },
        demote:function(fn, node, id){
            $.docker.request.node.inspect(function (response) {
                let data = {};
                data.Role = 'worker';
                data.Availability = response.Spec.Availability;
                data.Labels = $.extend({}, response.Spec.Labels);
                data.Name = $.extends.isEmpty(response.Name, '');

                data = $.extends.json.tostring(data)

                $.docker.postJsonBody(V3_ENDPOINT.format2(node) + APIS.NODES_UPDATE.format(id, response.Version.Index),
                    data, function (res) {
                        if ($.docker.response.check(res)) {
                            if (fn && $.isFunction(fn)) {

                                res.Info = response;

                                fn.call(node, res)
                            }
                        }
                    }, $.docker.request.buildTokenHeader(node))

            }, node, id);
        },
    },
    swarm: {
        join:function(fn, node, data){

            data = $.extend({}, data)

            if(!$.extends.isEmpty(data.RemoteAddrs)){
                data.RemoteAddrs = data.RemoteAddrs.split2(",")
            }

            if (data && typeof data == 'object') {
                data = $.extends.json.tostring(data)
            }

            $.docker.postJsonBody(V3_ENDPOINT.format2(node) + APIS.SWARM_JOIN, data, function (response) {
                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }
            }, $.docker.request.buildTokenHeader(node))

        },
        init:function(fn, node, data){
            if (data && typeof data == 'object') {
                data = $.extends.json.tostring(data)
            }

            $.docker.postJsonBody(V3_ENDPOINT.format2(node) + APIS.SWARM_INIT, data, function (response) {
                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }
            }, $.docker.request.buildTokenHeader(node))

        },
        leave:function(fn, node, force){
            let data = {};

            if(force)
                data.force = true;

            $.docker.postJson(V3_ENDPOINT.format2(node) + APIS.SWARM_lEAVE, data, function (response) {
                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }
            }, $.docker.request.buildTokenHeader(node))

        },
        inspect:function (fn, node) {

            $.docker.getJson(V3_ENDPOINT.format2(node) + APIS.SWARM_INSPECT, '', function (response) {
                if ($.docker.response.check(response)) {
                    let one = $.docker.request.node.buildRowData(response);
                    one.response = response;

                    if (fn && $.isFunction(fn)) {
                        fn.call(node, one)
                    }
                }
            }, $.docker.request.buildTokenHeader(node))
        },
    },
    service: {
        buildRowData:function(response) {
            let data = $.extend(true, {}, $.docker.request.service.buildNewRowData(), response);

            data.Id = data.ID;
            data.Name = data.Spec.Name;


            data.CreatedAt = data.CreatedAt;
            data.Created = $.docker.utils.getDateStr4GMT(data.CreatedAt);

            data.UpdatedAt = data.UpdatedAt;
            data.Updated = $.docker.utils.getDateStr4GMT(data.UpdatedAt);

            data.LabelStr = $.docker.utils.getLabels(data.Spec?(data.Spec.Labels?data.Spec.Labels:{}):{});
            data.SVersion = $.extends.isEmpty(data.Version.Index, '0');
            data.ReplicaStr = $.extends.isEmpty(data.ServiceStatus.RunningTasks, '0')+"/"+$.extends.isEmpty(data.ServiceStatus.DesiredTasks, '0');

            if(!$.extends.isEmpty(data.Spec.Mode.Replicated)){
                data.Mode = "Replicated";
                data.Replica = data.Spec.Mode.Replicated.Replicas;
            }else{
                data.Mode = "";
                data.Replica ="";
            }

            data.Image = $.docker.utils.getNameTrimSHA($.extends.isEmpty(data.Spec.TaskTemplate.ContainerSpec.Image, ''))

            if($.extends.isEmpty(data.Spec.TaskTemplate.Networks)){
                data.NetworkStr = "ingress";
            }else{
                data.NetworkStr = "";
            }

            if(data.Spec.EndpointSpec && !$.extends.isEmpty(data.Spec.EndpointSpec.Ports)){
                data.PortStr = ($.extends.isEmpty(data.Spec.EndpointSpec.Mode)?"":(data.Spec.EndpointSpec.Mode+":")) + $.docker.utils.getServiceTargetPortStr(data.Spec.EndpointSpec.Ports);
            }

            data.CommandStr = $.docker.utils.getListStr(data.Spec.TaskTemplate.ContainerSpec.Command, " ");
            data.ArgStr = $.docker.utils.getListStr(data.Spec.TaskTemplate.ContainerSpec.Args, " ");
            data.MountStr = $.docker.utils.getMountStr(data.Spec.TaskTemplate.ContainerSpec.Mounts);
            data.NameserverStr = $.docker.utils.getListStr(data.Spec.TaskTemplate.ContainerSpec.Nameservers);
            data.Search = $.docker.utils.getListStr(data.Spec.TaskTemplate.ContainerSpec.Search);
            data.CapabilityAddStr = $.docker.utils.getListStr(data.Spec.TaskTemplate.ContainerSpec.CapabilityAdd);
            data.CapabilityDropStr = $.docker.utils.getListStr(data.Spec.TaskTemplate.ContainerSpec.CapabilityDrop);
            data.UlimitStr = $.docker.utils.getListStr(data.Spec.TaskTemplate.ContainerSpec.Ulimits);
            data.EnvStr = $.docker.utils.getListStr(data.Spec.TaskTemplate.ContainerSpec.Env);
            data.DNSOptionStr = $.docker.utils.getListStr(data.Spec.TaskTemplate.ContainerSpec.DNSConfig.Options);

            data.TestStr = $.docker.utils.getListStr(data.Spec.TaskTemplate.ContainerSpec.HealthCheck.Test);

            data.ConstraintStr = $.docker.utils.getListStr(data.Spec.TaskTemplate.Placement.Constraints);
            data.PreferenceStr = $.docker.utils.getListStr(data.Spec.TaskTemplate.Placement.Preferences);
            data.PlatformStr = $.docker.utils.getListStr(data.Spec.TaskTemplate.Placement.Platforms);
            data.NWMode = $.extends.isEmpty(data.Endpoint.Spec.Mode, "");


            if(data.Spec.TaskTemplate.ContainerSpec.Configs && $.extends.isEmpty(data.Spec.TaskTemplate.ContainerSpec.Configs)){
                $.each(data.Spec.TaskTemplate.ContainerSpec.Configs, function (idx, v) {
                    if(!$.extends.isEmpty(v.Runtime)){
                        v.RuntimeStr = $.docker.utils.getLabels(v.Runtime)
                    }
                })
            }

            return data;
        },
        buildNewRowData:function() {
            let v = {
                ConfigFrom:{},
                ServiceStatus:{},
            };

            v.Id = '';
            v.ID = '';
            v.Name = '';

            v.Created = '';
            v.Updated = '';
            v.Version = {};
            v.UpdateStatus = {};
            v.Endpoint = {
                Spec:{},
            };
            v.Spec = {
                Labels:{},
                TaskTemplate:{
                    PluginSpec:{},
                    ContainerSpec:{
                        Labels:{},
                        Privileges:{},
                        DNSConfig:{},
                        Sysctl:{},
                        HealthCheck:{}
                    },
                    NetworkAttachmentSpec:{},
                    Resources:{
                        Limits:{},
                        Reservations:{
                        },
                    },
                    RestartPolicy:{},
                    Placement:{},
                    LogDriver:{}
                },
                Mode:{
                    Replicated:{},
                    //ReplicatedJob:{},
                    //Global:{},
                    //GlobalJob:{},
                },
                UpdateConfig:{},
                RollbackConfig:{},
                EndpointSpec:{},
            };

            return v;
        },
        all:function(fn, node){
            $.docker.request.service.list(fn, node, 0, 0);
        },
        total:function(fn, node){
            let data = {};
            data.status = true;
            $.docker.getJson(V3_ENDPOINT.format2(node) + APIS.SERVICES_LIST, data, function (response) {

                if ($.docker.response.check(response)) {

                    let temp = [];

                    if (response) {
                        $.each(response, function (idx, v) {

                            let one = $.docker.request.service.buildRowData(v);

                            temp.push(one);
                        })
                    }

                    let respData = $.docker.response.list2RowData(temp, 0, 0)

                    if (fn && $.isFunction(fn)) {
                        fn.call(node, respData)
                    }
                }

            }, $.docker.request.buildTokenHeader(node), "")
        },
        list: function (fn, node, skip, count, mode, search_type, search_key, sort, order) {
            search_type = $.docker.utils.getFilterType(search_type, search_key, 'service');
            let data = $.docker.utils.buildFilterData(true, search_type, search_key, 'service');

            if(!$.extends.isEmpty(data['filters'])){
                data['filters'] = $.extends.json.toobject2(data['filters']);
            }

            let one = $.extend({}, data['filters']);
            mode = $.extends.isEmpty(mode, '');

            if(!$.extends.isEmpty(mode)){
                one.mode = [mode]
            }

            data['filters'] =$.extends.json.tostring(one);
            data.status = true;

            $.docker.getJson(V3_ENDPOINT.format2(node) + APIS.SERVICES_LIST, data, function (response) {

                if ($.docker.response.check(response)) {

                    let temp = [];

                    if (response) {
                        $.each(response, function (idx, v) {

                            let one = $.docker.request.service.buildRowData(v);

                            temp.push(one);
                        })

                        temp = $.docker.utils.sortList(temp, sort, order)
                    }

                    let respData = $.docker.response.list2RowData(temp, skip, count)

                    if (fn && $.isFunction(fn)) {
                        fn.call(node, respData)
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
        inspect:function (fn, node, id) {
            let data = {};
            data.status = true;

            $.docker.getJson(V3_ENDPOINT.format2(node) + APIS.SERVICES_INSPECT.format(id), data, function (response) {
                if ($.docker.response.check(response)) {
                    response = $.docker.request.service.buildRowData(response)
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }
            }, $.docker.request.buildTokenHeader(node))
        },
        delete:function (fn, node, id) {
            $.docker.deleteJson(V3_ENDPOINT.format2(node) + APIS.SERVICES_DELETE.format(id), '123', function (response) {
                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }
            }, $.docker.request.buildTokenHeader(node))
        },
        log: function (node, id, fn, sendFn, completeFn) {
            return $.docker.request.ajaxStream(node,
                V3_ENDPOINT_STREAM.format2(node) + APIS.SERVICES_LOG.format(id), null, null, {
                    method: 'get',
                    dataType: 'text',
                    success: function (result, status, xhr) {
                        console.log('success')
                        console.log(xhr)
                    },
                    error: function (xhr, status) {
                        console.log('error')
                        console.log(xhr)
                        console.log("日志接收结束[error]");
                    },
                    complete: function (xhr, status) {
                        console.log('complete')
                        console.log(xhr)
                        if(completeFn)
                            completeFn(xhr, status)
                    }
                }, sendFn, function (xhr, state, chucks) {
                    let json = null;

                    try {
                        if (!$.extends.isEmpty(chucks)) {
                            json = chucks
                        }
                    } catch (e) {
                        console.error(e)
                    }

                    fn(json, xhr, state)
                })
        },
        create:function(fn, node, name, jsonObj){
            let data = $.extend({}, jsonObj)
            data.Name = name;
            data = $.extends.json.tostring(data)

            $.docker.postJsonBody(V3_ENDPOINT.format2(node) + APIS.SERVICES_CREATE, data, function (response) {
                console.log(response)

                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
    },
    task: {
        buildRowData:function(response) {
            let data = $.extend(true, {}, $.docker.request.task.buildNewRowData(), response);

            data.Id = data.ID;
            data.Name = data.Spec.Name;

            data.CreatedAt = data.CreatedAt;
            data.Created = $.docker.utils.getDateStr4GMT(data.CreatedAt);

            data.UpdatedAt = data.UpdatedAt;
            data.Updated = $.docker.utils.getDateStr4GMT(data.UpdatedAt);

            data.LabelStr = $.docker.utils.getLabels(data.Spec?(data.Spec.Labels?data.Spec.Labels:{}):{});
            data.SVersion = $.extends.isEmpty(data.Version.Index, '0');

            data.Image = $.docker.utils.getNameTrimSHA($.extends.isEmpty(data.Spec.ContainerSpec.Image, ''))

            data.DesiredState = $.extends.isEmpty(data.DesiredState, "").Capital();

            data.CurrentState = $.extends.isEmpty(data.Status.State, "").Capital()
                + ' ' + $.docker.utils.getDateStdStr4GMT(data.Status.Timestamp);

            data.SortField = (data.Status.State=='running'?1:0) + '-' + data.CreatedAt;
            let addrList = [];
            if(data.NetworksAttachments && !$.extends.isEmpty(data.NetworksAttachments)){
                $.each(data.NetworksAttachments, function (idx, v) {
                    if(v.Addresses && !$.extends.isEmpty(v.Addresses)){
                        addrList.push($.docker.utils.getListStr(v.Addresses, " "));
                    }
                })
            }
            data.NetAddress = $.docker.utils.getListStr(addrList, ",");
            if($.extends.isEmpty(data.Spec.Networks)){
                data.NetworkStr = "ingress";
            }else{
                data.NetworkStr = "";
            }

            if(data.Spec.EndpointSpec && !$.extends.isEmpty(data.Spec.EndpointSpec.Ports)){
                data.PortStr = ($.extends.isEmpty(data.Spec.EndpointSpec.Mode)?"":(data.Spec.EndpointSpec.Mode+":")) + $.docker.utils.getServiceTargetPortStr(data.Spec.EndpointSpec.Ports);
            }

            data.CommandStr = $.docker.utils.getListStr(data.Spec.ContainerSpec.Command, " ");
            data.ArgStr = $.docker.utils.getListStr(data.Spec.ContainerSpec.Args, " ");
            data.MountStr = $.docker.utils.getMountStr(data.Spec.ContainerSpec.Mounts);
            data.NameserverStr = $.docker.utils.getListStr(data.Spec.ContainerSpec.Nameservers);
            data.Search = $.docker.utils.getListStr(data.Spec.ContainerSpec.Search);
            data.CapabilityAddStr = $.docker.utils.getListStr(data.Spec.ContainerSpec.CapabilityAdd);
            data.CapabilityDropStr = $.docker.utils.getListStr(data.Spec.ContainerSpec.CapabilityDrop);
            data.UlimitStr = $.docker.utils.getListStr(data.Spec.ContainerSpec.Ulimits);
            data.EnvStr = $.docker.utils.getListStr(data.Spec.ContainerSpec.Env);
            data.DNSOptionStr = $.docker.utils.getListStr(data.Spec.ContainerSpec.DNSConfig.Options);


            if(data.Spec.ContainerSpec.Configs && $.extends.isEmpty(data.Spec.ContainerSpec.Configs)){
                $.each(data.Spec.ContainerSpec.Configs, function (idx, v) {
                    if(!$.extends.isEmpty(v.Runtime)){
                        v.RuntimeStr = $.docker.utils.getLabels(v.Runtime)
                    }
                })
            }

            return data;
        },
        buildNewRowData:function() {
            let v = {
                Version:{},
                Status:{
                    ContainerStatus:{}
                },
            };

            v.Id = '';
            v.ID = '';
            v.Name = '';

            v.Created = '';
            v.Updated = '';
            v.UpdateStatus = {};

            v.Spec = {
                Labels:{},
                ContainerSpec:{
                    Labels:{},
                    Privileges:{},
                    DNSConfig:{},
                    Sysctl:{},
                    HealthCheck:{}
                },
                PluginSpec:{},
                NetworkAttachmentSpec:{},
                Resources:{
                    Limits:{},
                    Reservations:{
                        GenericResources:{}
                    },
                },
                RestartPolicy:{},
                Placement:{},
                LogDriver:{}
            };

            return v;
        },
        listTotal: function (fn, node){
            $.docker.getJson(V3_ENDPOINT.format2(node) + APIS.TASKS_LIST, '123', function (response) {

                if ($.docker.response.check(response)) {

                    let temp = [];

                    if (response) {
                        let respData = $.docker.response.list2RowData(response, 0, 0)

                        if (fn && $.isFunction(fn)) {
                            fn.call(node, respData)
                        }

                    }else{
                        let respData = $.docker.response.list2RowData(temp, 0, 0)

                        if (fn && $.isFunction(fn)) {
                            fn.call(node, respData)
                        }
                    }
                }

            }, $.docker.request.buildTokenHeader(node), "")
        },
        list: function (fn, node, skip, count, serviceName, nodeId, desired, search_type, search_key, sort, order) {

            search_type = $.docker.utils.getFilterType(search_type, search_key, 'task');
            let data = $.docker.utils.buildFilterData(false, search_type, search_key, 'task');

            if(!$.extends.isEmpty(data['filters'])){
                data['filters'] = $.extends.json.toobject2(data['filters']);
            }

            let one = $.extend({}, data['filters']);

            desired = $.extends.isEmpty(desired, '');
            if(!$.extends.isEmpty(desired)){
                one['desired-state'] = [desired];
            }

            serviceName = $.extends.isEmpty(serviceName, '');
            if(!$.extends.isEmpty(serviceName)){
                one.service = [serviceName]
            }

            nodeId = $.extends.isEmpty(nodeId, '');
            if(!$.extends.isEmpty(nodeId)){
                one.node = [nodeId]
            }

            data['filters'] =$.extends.json.tostring(one);

            $.docker.getJson(V3_ENDPOINT.format2(node) + APIS.TASKS_LIST, data, function (response) {

                if ($.docker.response.check(response)) {

                    let temp = [];

                    if (response) {

                        $.docker.request.node.all(function(nodes){

                            $.each(response, function (idx, v) {

                                let one = $.docker.request.task.buildRowData(v);

                                one.Node = nodes[v.NodeID];
                                one.NodeName = one.Node?one.Node.Name:"";
                                one.Hostname = one.Node?one.Node.Hostname:"";

                                temp.push(one);

                            })

                            temp = $.docker.utils.sortList(temp, sort, order)

                            let respData = $.docker.response.list2RowData(temp, skip, count)

                            if (fn && $.isFunction(fn)) {
                                fn.call(node, respData)
                            }

                        }, node)
                    }else{
                        let respData = $.docker.response.list2RowData(temp, skip, count)

                        if (fn && $.isFunction(fn)) {
                            fn.call(node, respData)
                        }
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
        log: function (node, id, fn, sendFn, completeFn) {
            return $.docker.request.ajaxStream(node,
                V3_ENDPOINT_STREAM.format2(node) + APIS.TASKS_LOG.format(id), null, null, {
                    method: 'get',
                    dataType: 'text',
                    success: function (result, status, xhr) {
                        console.log('success')
                        console.log(xhr)
                    },
                    error: function (xhr, status) {
                        console.log('error')
                        console.log(xhr)
                        console.log("日志接收结束[error]");
                    },
                    complete: function (xhr, status) {
                        console.log('complete')
                        console.log(xhr)
                        if(completeFn)
                            completeFn(xhr, status)
                    }
                }, sendFn, function (xhr, state, chucks) {
                    let json = null;

                    try {
                        if (!$.extends.isEmpty(chucks)) {
                            json = chucks
                        }
                    } catch (e) {
                        console.error(e)
                    }

                    fn(json, xhr, state)
                })
        },
        inspect:function(fn, node, id){
            let data = {};
            data.status = true;
            $.docker.getJson(V3_ENDPOINT.format2(node) + APIS.TASKS_INSPECT.format(id), data, function (response) {
                if ($.docker.response.check(response)) {
                    response = $.docker.request.task.buildRowData(response)
                    if (fn && $.isFunction(fn)) {
                        $.docker.request.node.all(function (nodes) {
                            response.Node = nodes[response.NodeID];
                            response.NodeName = response.Node?response.Node.Name:"";
                            response.Hostname = response.Node?response.Node.Hostname:"";

                            fn.call(node, response)
                        }, node);
                    }
                }
            }, $.docker.request.buildTokenHeader(node))
        },
    },
    network:{
        buildRowData:function(response) {
            let data = $.extend({}, response);
            data.Id = data.Id;
            data.ID = data.Id;
            data.Name = data.Name;


            data.CreatedAt = data.Created;
            data.Created = $.docker.utils.getDateStr4GMT(data.CreatedAt);
            data.LabelStr = $.docker.utils.getLabels(data.Labels?(data.Labels):{});
            data.OptionStr = $.docker.utils.getLabels(data.Options?(data.Options):{});
            data.AttachableStr = $.extends.isEmpty(data.Attachable,true)==true?"√":"×";
            data.IngressStr = $.extends.isEmpty(data.Ingress,true)==true?"√":"×";
            data.InternalStr = $.extends.isEmpty(data.Internal,true)==true?"√":"×";
            data.EnableIPv6Str = $.extends.isEmpty(data.EnableIPv6,true)==true?"√":"×";

            let list = [];
            if(!$.extends.isEmpty(data.Containers)){
                $.each(data.Containers, function (k, v) {
                    v.ID = k;
                    list.push(v)
                })
            }

            data.containersRowData = $.docker.response.list2RowData(list, 0, 0);

            data.IPAMStr = $.docker.utils.getIPAMStr(data.IPAM);

            return data;
        },
        buildNewRowData:function() {
            let v = {
                IPAM:{
                },
                ConfigFrom:{},

            };

            v.Id = '';
            v.ID = '';
            v.Name = '';

            v.Created = '';
            v.LabelStr = {};
            v.OptionStr = {};
            v.IPAMStr = '';

            return v;
        },
        all:function(fn, node){
            $.docker.request.network.list(fn, node, 0, 0);
        },
        list: function (fn, node, skip, count, driver, type, scope, search_type, search_key, sort, order) {
            search_type = $.docker.utils.getFilterType(search_type, search_key, 'network');
            let data = $.docker.utils.buildFilterData(true, search_type, search_key, 'network');

            if(!$.extends.isEmpty(data['filters'])){
                data['filters'] = $.extends.json.toobject2(data['filters']);
            }

            let one = $.extend({}, data['filters']);

            driver = $.extends.isEmpty(driver, '');
            type = $.extends.isEmpty(type, '');
            scope = $.extends.isEmpty(scope, '');

            if(!$.extends.isEmpty(driver)){
                one.driver = [driver]
            }
            if(!$.extends.isEmpty(type)){
                one.type = [type]
            }
            if(!$.extends.isEmpty(scope)){
                one.scope = [scope]
            }

            data['filters'] =$.extends.json.tostring(one);

            $.docker.getJson(V3_ENDPOINT.format2(node) + APIS.NETWORKS_LIST, data, function (response) {

                if ($.docker.response.check(response)) {

                    let temp = [];

                    if (response) {
                        $.each(response, function (idx, v) {

                            let one = $.docker.request.network.buildRowData(v);

                            temp.push(one);
                        })

                        temp = $.docker.utils.sortList(temp, sort, order)
                    }

                    let respData = $.docker.response.list2RowData(temp, skip, count)

                    if (fn && $.isFunction(fn)) {
                        fn.call(node, respData)
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
        inspect:function (fn, node, id) {
            $.docker.getJson(V3_ENDPOINT.format2(node) + APIS.NETWORKS_INSPECT.format(id), '', function (response) {
                if ($.docker.response.check(response)) {
                    response = $.docker.request.network.buildRowData(response)
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }
            }, $.docker.request.buildTokenHeader(node))
        },
        create:function(fn, node, data){
            if (data && typeof data == 'object') {
                data = $.extends.json.tostring(data)
            }

            $.docker.postJsonBody(V3_ENDPOINT.format2(node) + APIS.NETWORKS_CREATE, data, function (response) {
                if ($.docker.response.check(response)) {
                    response.Info = data;

                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }
            }, $.docker.request.buildTokenHeader(node))
        },
        delete:function(fn, node, id){
            let data = {};

            $.docker.deleteJson(V3_ENDPOINT.format2(node) + APIS.NETWORKS_DELETE.format(id), '123', function (response) {
                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }
            }, $.docker.request.buildTokenHeader(node))
        },
        prune:function(fn, node, labels, untils) {
            let data1 = $.docker.utils.buildFilterData(false, 'label', labels, 'network');
            let data2 = $.docker.utils.buildFilterData(false, 'until', untils, 'network')

            let filters = {};

            if(data1.filters && data1.filters.label){
                filters.label = $.extends.json.toobject2(data1.filters.label);
            }

            if(data2.filters && data2.filters.until){
                filters.until = $.extends.json.toobject2(data1.filters.until);
            }
            let data = {
                filters: $.extends.json.tostring(filters)
            }

            $.docker.postJson(V3_ENDPOINT.format2(node) + APIS.NETWORKS_PRUNE, data, function (response) {
                console.log(response)

                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        if(response.NetworksDeleted){
                            response.Count = response.NetworksDeleted.length;
                        }else{
                            response.Count = 0;
                        }

                        fn.call(node, response)
                    }
                }

            }, $.docker.request.buildTokenHeader(node));
        },
        connect:function(fn, node, id, containerId, config){
            let data = {
                Container:containerId
            }
            data.EndpointConfig = $.extend({}, config);
            data = $.extends.json.tostring(data)

            $.docker.postJsonBody(V3_ENDPOINT.format2(node) + APIS.NETWORKS_CONNECT.format(id), data, function (response) {
                console.log(response)

                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }

            }, $.docker.request.buildTokenHeader(node));
        },
        disconnect:function(fn, node, id, containerId, force){
            let data = {
                Container:containerId
            }

            if(force){
                data.Force = true;
            }

            data = $.extends.json.tostring(data)

            $.docker.postJsonBody(V3_ENDPOINT.format2(node) + APIS.NETWORKS_DISCONNECT.format(id), data, function (response) {
                console.log(response)

                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }

            }, $.docker.request.buildTokenHeader(node));
        }
    },
    secret:{
        buildRowData:function(response) {
            let v = $.extend({}, response);
            v.Id = v.ID;
            v.Name = v.Spec.Name;

            v.Created = $.docker.utils.getDateStr4GMT(v.CreatedAt);
            v.Updated = $.docker.utils.getDateStr4GMT(v.UpdatedAt);
            v.LabelStr = $.docker.utils.getLabels(v.Spec?(v.Spec.Labels):{});
            v.SVersion = $.extends.isEmpty(v.Version.Index,"0");

            return v;
        },
        buildNewRowData:function() {
            let v = {};

            v.Id = '';
            v.Name = '';

            v.Created = '';
            v.Updated = '';
            v.Spec = {};
            v.Version = {};
            return v;
        },
        list: function (fn, node, skip, count, search_type, search_key, sort, order) {
            search_type = $.docker.utils.getFilterType(search_type, search_key, 'node');
            let data = $.docker.utils.buildFilterData(true, search_type, search_key, 'node');

            if(!$.extends.isEmpty(data['filters'])){
                data['filters'] = $.extends.json.toobject2(data['filters']);
            }

            let one = $.extend({}, data['filters']);
            data['filters'] =$.extends.json.tostring(one);

            $.docker.getJson(V3_ENDPOINT.format2(node) + APIS.SECRETS_LIST, data, function (response) {

                if ($.docker.response.check(response)) {

                    let temp = [];

                    if (response) {
                        $.each(response, function (idx, v) {

                            let one = $.docker.request.secret.buildRowData(v);

                            temp.push(one);
                        })

                        if (sort == 'MemoryBytes')
                            sort = 'MemoryBytesN'

                        temp = $.docker.utils.sortList(temp, sort, order)

                    }

                    let respData = $.docker.response.list2RowData(temp, skip, count)

                    if (fn && $.isFunction(fn)) {
                        fn.call(node, respData)
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
        inspect:function (fn, node, id) {
            $.docker.getJson(V3_ENDPOINT.format2(node) + APIS.SECRETS_INSPECT.format(id), '', function (response) {
                if ($.docker.response.check(response)) {
                    response = $.docker.request.secret.buildRowData(response)
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }
            }, $.docker.request.buildTokenHeader(node))
        },
        create:function(fn, node, data){
            data.Data = Base64.encode(data.Data);

            if (data && typeof data == 'object') {
                data = $.extends.json.tostring(data)
            }

            $.docker.postJsonBody(V3_ENDPOINT.format2(node) + APIS.SECRETS_CREATE, data, function (response) {
                if ($.docker.response.check(response)) {
                    response.Info = data;

                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }
            }, $.docker.request.buildTokenHeader(node))
        },
        delete:function(fn, node, id){
            let data = {};

            $.docker.deleteJson(V3_ENDPOINT.format2(node) + APIS.SECRETS_DELETE.format(id), '123', function (response) {
                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }
            }, $.docker.request.buildTokenHeader(node))
        },
        update_labels:function(fn, node, id, kvs){
            $.docker.request.secret.inspect(function (response) {
                let data = {};
                data.Name = response.Name;
                data.Data = response.Data;
                data.Labels = $.extend({}, kvs);

                data = $.extends.json.tostring(data)

                $.docker.postJsonBody(V3_ENDPOINT.format2(node) + APIS.SECRETS_UPDATE.format(id, response.Version.Index),
                    data, function (res) {
                        if ($.docker.response.check(res)) {
                            res.Info = response;

                            if (fn && $.isFunction(fn)) {
                                fn.call(node, res)
                            }
                        }
                    }, $.docker.request.buildTokenHeader(node))

            }, node, id);
        },
        update_name:function(fn, node, id, name){
            $.docker.request.secret.inspect(function (response) {
                let data = {};
                data.Name = name;
                data.Data = response.Data;
                data.Labels = $.extend({}, response.Labels);

                data = $.extends.json.tostring(data)

                $.docker.postJsonBody(V3_ENDPOINT.format2(node) + APIS.SECRETS_UPDATE.format(id, response.Version.Index),
                    data, function (res) {
                        if ($.docker.response.check(res)) {
                            res.Info = response;

                            if (fn && $.isFunction(fn)) {
                                fn.call(node, res)
                            }
                        }
                    }, $.docker.request.buildTokenHeader(node))

            }, node, id);
        },
        update_data:function(fn, node, id, pwdData){
            $.docker.request.secret.inspect(function (response) {
                let data = {};
                data.Name = response.Name;
                data.Data = Base64.encode(pwdData);
                data.Labels = $.extend({}, response.Labels);

                data = $.extends.json.tostring(data)

                $.docker.postJsonBody(V3_ENDPOINT.format2(node) + APIS.SECRETS_UPDATE.format(id, response.Version.Index),
                    data, function (res) {
                        if ($.docker.response.check(res)) {
                            res.Info = response;

                            if (fn && $.isFunction(fn)) {
                                fn.call(node, res)
                            }
                        }
                    }, $.docker.request.buildTokenHeader(node))

            }, node, id);
        }
    },
    config: {
        buildRowData:function(response) {
            let data = $.extend({}, response);
            data.Id = data.ID;
            data.Name = data.Spec.Name;

            data.Created = $.docker.utils.getDateStr4GMT(data.CreatedAt);
            data.Updated = $.docker.utils.getDateStr4GMT(data.UpdatedAt);
            data.LabelStr = $.docker.utils.getLabels(data.Spec?(data.Spec.Labels):{});
            data.SVersion = $.extends.isEmpty(data.Version.Index,"0");
            data.DataStr = Base64.decode($.extends.isEmpty(data.Spec.Data, ''));

            return data;
        },
        buildNewRowData:function() {
            let v = {};

            v.Id = '';
            v.Name = '';

            v.Created = '';
            v.Updated = '';
            v.Spec = {};
            v.Version = {};
            v.DataStr = '';
            return v;
        },
        total : function (fn, node) {
            $.docker.getJson(V3_ENDPOINT.format2(node) + APIS.CONFIGS_LIST, '123', function (response) {

                if ($.docker.response.check(response)) {

                    let temp = [];

                    if (response) {
                        $.each(response, function (idx, v) {

                            let one = $.docker.request.config.buildRowData(v);

                            temp.push(one);
                        })
                    }

                    let respData = $.docker.response.list2RowData(temp)

                    if (fn && $.isFunction(fn)) {
                        fn.call(node, respData)
                    }
                }

            }, $.docker.request.buildTokenHeader(node), "")
        },
        list : function (fn, node, skip, count, search_type, search_key, sort, order) {
            search_type = $.docker.utils.getFilterType(search_type, search_key, 'node');
            let data = $.docker.utils.buildFilterData(true, search_type, search_key, 'node');

            if(!$.extends.isEmpty(data['filters'])){
                data['filters'] = $.extends.json.toobject2(data['filters']);
            }

            let one = $.extend({}, data['filters']);
            data['filters'] =$.extends.json.tostring(one);

            $.docker.getJson(V3_ENDPOINT.format2(node) + APIS.CONFIGS_LIST, data, function (response) {

                if ($.docker.response.check(response)) {

                    let temp = [];

                    if (response) {
                        $.each(response, function (idx, v) {

                            let one = $.docker.request.config.buildRowData(v);

                            temp.push(one);
                        })

                        temp = $.docker.utils.sortList(temp, sort, order)
                    }

                    let respData = $.docker.response.list2RowData(temp, skip, count)

                    if (fn && $.isFunction(fn)) {
                        fn.call(node, respData)
                    }
                }

            }, $.docker.request.buildTokenHeader(node))
        },
        inspect:function (fn, node, id) {
            $.docker.getJson(V3_ENDPOINT.format2(node) + APIS.CONFIGS_INSPECT.format(id), '', function (response) {
                if ($.docker.response.check(response)) {
                    response = $.docker.request.config.buildRowData(response)
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }
            }, $.docker.request.buildTokenHeader(node))
        },
        create:function(fn, node, data){
            data.Data = Base64.encode(data.Data);

            if (data && typeof data == 'object') {
                data = $.extends.json.tostring(data)
            }

            $.docker.postJsonBody(V3_ENDPOINT.format2(node) + APIS.CONFIGS_CREATE, data, function (response) {
                if ($.docker.response.check(response)) {
                    response.Info = data;

                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }
            }, $.docker.request.buildTokenHeader(node))
        },
        delete:function(fn, node, id){
            let data = {};

            $.docker.deleteJson(V3_ENDPOINT.format2(node) + APIS.CONFIGS_DELETE.format(id), '123', function (response) {
                if ($.docker.response.check(response)) {
                    if (fn && $.isFunction(fn)) {
                        fn.call(node, response)
                    }
                }
            }, $.docker.request.buildTokenHeader(node))
        },
        update_labels:function(fn, node, id, kvs){
            $.docker.request.config.inspect(function (response) {
                let data = {};
                data.Name = response.Name;
                data.Data = response.Data;
                data.Labels = $.extend({}, kvs);

                data = $.extends.json.tostring(data)

                $.docker.postJsonBody(V3_ENDPOINT.format2(node) + APIS.CONFIGS_UPDATE.format(id, response.Version.Index),
                    data, function (res) {
                        if ($.docker.response.check(res)) {
                            res.Info = response;

                            if (fn && $.isFunction(fn)) {
                                fn.call(node, res)
                            }
                        }
                    }, $.docker.request.buildTokenHeader(node))

            }, node, id);
        },
        update_name:function(fn, node, id, name){
            $.docker.request.config.inspect(function (response) {
                let data = {};
                data.Name = name;
                data.Data = response.Data;
                data.Labels = $.extend({}, response.Labels);

                data = $.extends.json.tostring(data)

                $.docker.postJsonBody(V3_ENDPOINT.format2(node) + APIS.CONFIGS_UPDATE.format(id, response.Version.Index),
                    data, function (res) {
                        if ($.docker.response.check(res)) {
                            res.Info = response;

                            if (fn && $.isFunction(fn)) {
                                fn.call(node, res)
                            }
                        }
                    }, $.docker.request.buildTokenHeader(node))

            }, node, id);
        },
        update_data:function(fn, node, id, configData){
            $.docker.request.config.inspect(function (response) {
                let data = {};
                data.Name = response.Name;
                data.Data = Base64.encode(configData);
                data.Labels = $.extend({}, response.Labels);

                data = $.extends.json.tostring(data)

                $.docker.postJsonBody(V3_ENDPOINT.format2(node) + APIS.CONFIGS_UPDATE.format(id, response.Version.Index),
                    data, function (res) {
                        if ($.docker.response.check(res)) {
                            res.Info = response;

                            if (fn && $.isFunction(fn)) {
                                fn.call(node, res)
                            }
                        }
                    }, $.docker.request.buildTokenHeader(node))

            }, node, id);
        }
    },
    repos:{
        getRepoById:function(node, id){
            let respData = $.docker.request.repos.getAll(node).list;
            let idx = findIdx(respData, id, 'ID');
            if(idx>=0)
                return respData[idx];
            else
                return null;
        },
        getReposItem:function(){
            let node = local_node;
            let respData = $.docker.request.repos.getAll(node).list;

            $.each(respData, function(idx, v){
                v.Password = Base64.decode(v.Password);
            });

            return respData;
        },
        save:function(fn, node, data){
            data.id = $.extends.isEmpty(data.id, '').trim();

            if($.extends.isEmpty(data.id)){

                let newData = {
                    Username:data.Username.trim(),
                    Password:Base64.encode(data.Password.trim()),
                };

                newData.ID = Math.uuid();
                newData.Id = newData.ID;
                newData.Description = data.Description;
                newData.Name = data.Name.trim();
                newData.Endpoint = data.Endpoint.trim();

                data.ID = newData.ID;

                let repos = $.docker.request.repos.getAll(node).list;
                newData.Createtime = new Date().pattern('yyyy-MM-dd HH:mm:ss');
                repos.push(newData);

                $.app.localStorage.saveItem(node.node_host+'_repos', $.extends.json.tostring(repos));
            }else{

                let repos = $.docker.request.repos.getAll(node).list;
                let idx = findIdx(repos, data.id, 'ID');
                if(idx<0){
                    $.app.show('仓库{0}不存在，请刷新数据后，再进行操作'.format(id));
                    return false;
                }

                let obj = repos[idx];

                obj.Username = data.Username.trim();
                obj.Password = Base64.encode(data.Password.trim());

                if(data.id == 'Default'){
                    data.Name = 'Default';
                }else{
                    obj.Name = data.Name.trim();
                    obj.Description = data.Description;
                    obj.Endpoint = data.Endpoint.trim();
                }

                $.app.localStorage.saveItem(node.node_host+'_repos', $.extends.json.tostring(repos));
            }

            if(fn){
                fn.call(node, data)
            }
        },
        delete:function(fn, node, id){
            id = $.extends.isEmpty(id, 'Default').trim();

            if(id=='Default'){
                $.app.show('默认仓库不能删除');
                return false;
            }

            let repos = $.docker.request.repos.getAll(node).list;

            let idx = findIdx(repos, id, 'ID');

            if(idx<0){
                $.app.show('仓库{0}不存在，请刷新数据后，再进行操作'.format(id));
                return false;
            }

            let obj = repos[idx];
            repos.splice(idx,1);

            $.app.localStorage.saveItem(node.node_host+'_repos', $.extends.json.tostring(repos));

            if(fn){
                fn.call(node, obj);
            }
        },
        getAll:function(node){
            let repos = $.extends.json.toobject2($.app.localStorage.getItem(node.node_host+'_repos', '[]'));
            repos = [].concat(repos);

            let haveDefault = false;

            $.each(repos, function (idx, v) {
                v.ID = $.extends.isEmpty(v.ID, '').trim();
                v.Id = v.ID;
                if(v.ID == 'Default'){
                    haveDefault = true;
                }
            })

            if(!haveDefault){

                if($.extends.isEmpty(repos)){
                    repos.push({
                        Name:'Default',
                        ID:'Default',
                        Description:'默认Docker的官方镜像仓库',
                        Endpoint:'',
                        Username:'',
                        Password:'',
                        Createtime:'',
                    });
                }
            }

            let respData = $.docker.response.list2RowData(repos);
            return respData;
        },
        all:function(fn, node){
            $.docker.request.repos.list(function (response) {
                    let data = $.extend(true, {}, response);
                    let dataMap = {};

                    $.each(data.list, function(idx, v){
                        dataMap[v.ID] = v;
                    });

                    if(fn){
                        fn.call(node, data, dataMap);
                    }
                }, node);
        },
        list: function(fn, node){
            let respData = $.docker.request.repos.getAll(node);

            if(fn){
                fn.call(node, respData);
            }
        }
    }
};

$.docker.response = {
    list2RowData: function (response, skip, count) {

        if (!response) {
            return {
                list: [],
                count: 0,
                total: 0
            }
        }

        let limit = null;

        if (skip == null || skip <= 0)
            skip = 0;

        if (count == null || count <= 0) {
            limit = null
        } else {
            limit = skip + count
        }

        response = response;
        let respData = {}

        let endIndex = 0;
        let list = [];

        respData.total = response.length;

        if (count == null || count <= 0)
            endIndex = respData.total;
        else {
            endIndex = respData.total > (skip + count) ? (skip + count) : respData.total;
        }

        for (let idx = skip; idx < endIndex; idx++) {
            list.push(response[idx])
        }

        respData.list = list;
        respData.count = list.length;
        respData.total = response.length;
        return respData;
    },
    check: function (response) {
        if (response == null)
            return true;

        if (response.statusCode  > 0 && response.statusCode < 400) {
            return true
        }

        if (response && response.code == 16) {
            $.app.show('连接已经失效或者错误，请重新进行请求');
            return false;
        } else if (response && response.code) {
            $.app.show('服务器错误信息:' + response.error);
            return false;
        } else if (!$.extends.isEmpty(response.message)) {
            $.app.show('服务器错误信息:' + response.message);
            return false;
        } else if (!$.extends.isEmpty(response.error)) {
            $.app.show('服务器错误信息:' + response.error);
            return false;
        } else if (!$.extends.isEmpty(response.errorDetail)) {
            $.app.show('服务器错误信息:' + response.errorDetail.message);
            return false;
        } else if (response.status < 0) {
            if (!$.extends.isEmpty(response.msg)) {
                $.app.show('服务器错误信息:' + response.msg);
                return false;
            }
            $.app.show('服务器错误信息:服务器响应错误，请确定服务器响应正确后再尝试');
            return false;
        }else if (response.statusCode >= 400) {
            if (!$.extends.isEmpty(response.msg)) {
                $.app.show('服务器错误信息:' + response.msg);
                return false;
            }
            $.app.show('服务器错误信息:服务器响应错误，请确定服务器响应正确后再尝试');
            return false;
        }

        return true
    }

}

$.docker.utils = {
    getSize: function (size, unit) {
        if(unit == null)
            unit = "B";
        if (size / (1000 * 1000 * 1000) >= 1) {
            return (size / (1024 * 1024 * 1024.0)).toFixed(2) + 'G' + unit
        } else if (size / (1000 * 1000) >= 1) {
            return (size / (1024 * 1024.0)).toFixed(2) + 'M' + unit
        } else if (size == 0) {
            return 0 + unit;
        } else if (size < 1024) {
            return size + unit;
        } else {
            return (size / 1024.0).toFixed(2) + 'K'  + unit
        }
    },
    getFilterValues: function (search_type, search_key, object_type) {
        let filters = null;

        if (!$.extends.isEmpty(search_key)) {
            filters = search_key.split(",")
        } else {
            filters = [];
        }

        return filters;
    },
    getFilterType: function (search_type, search_key, object_type) {
        if ($.extends.isEmpty(search_key)) {
            search_type = '';
        }

        return search_type;
    },
    convert2ListParamValue:function(v){
        if(v==null){
            return [];
        }

        if($.extends.isEmpty(v)){
            return [""];
        }

        if (v && !Array.isArray(v)) {
            return [v];
        }

        return v;
    },
    buildOptsData: function (optNames, optValues) {

        if(optNames==null)
            return {};

        if (!Array.isArray(optNames)) {
            optNames = [optNames]
        }

        if (!Array.isArray(optValues)) {
            optValues = [optValues]
        }

        let data = {};

        if (!$.isEmptyObject(optNames)) {
            $.each(optNames, function (idx, v) {
                if (!$.extends.isEmpty(v)) {

                    data[v.trim()] = (optValues && optValues.length > idx) ? optValues[idx] : '';

                }
            })
        }

        return data;
    },
    buildFilterData: function (all, search_type, search_key, object_type) {
        let data = {};

        data['all'] = true

        if (all === false) {
            data['all'] = false
        }

        let filters = null;

        if (!$.extends.isEmpty(search_key)) {
            filters = search_key.split(",")
            let obj = {};
            search_type = search_type || 'name';

            if (search_type != 'name' || object_type == 'volume'  || object_type == 'node'
                || object_type == 'network' || object_type == 'container'  || object_type == 'service'
                || object_type == 'task') {
                let filterObj = {};
                filterObj[search_type] = filters;

                data['filters'] = $.extends.json.tostring(filterObj)
            }
        }

        return data
    },
    getPageRowsFromParam: function (param) {
        if (param.rows == null) {
            return 20;
        }
        return param.rows;
    },
    getSkipFromParam: function (param) {
        let skip;
        if (param.page == null || param.page <= 0) {
            skip = 0
        } else {
            skip = (param.page - 1) * $.docker.utils.getPageRowsFromParam(param);
        }
        return skip;
    },
    getNetworks:function(networks){
        let rtn = [];

        if(networks){
            networks = $.extend({}, networks);

            $.each(networks, function (k, v) {
                if(typeof v == 'object'){
                    if(!$.extends.isEmpty(v)){
                        let obj = $.extend(true, {}, v);
                        obj.Type = k;
                        rtn.push(obj);
                    }
                }
            })
        }

        return rtn;
    },
    getListStr:function(list, join){
        join = join||',';

        if(list){
            list = list.concat();

            $.each(list, function (idx, v) {
                if(typeof v == 'object'){
                    list[idx] = $.extends.json.tostring(v);
                }
            })

            return list.join(join)
        }

        return '';
    },
    setReposTag2Object:function(nv, RepoTags){

        let two = RepoTags.split(":")

        if(two.length==1){
            nv.Repository = two[0];
            nv.Tag = DEFAULT_TAG;
            nv.Name = nv.Repository + ':' + nv.Tag;
        }else{
            let firstIdx = RepoTags.indexOf("/");
            let firstIdx2 = RepoTags.indexOf(":");

            if(firstIdx<firstIdx2){
                let last = two.splice(two.length-1,1)
                nv.Repository = two.join(":");
                nv.Tag = last[0];
                nv.Name = nv.Repository + ':' + nv.Tag;
            }else{
                if(two.length>2){

                    let last = two.splice(two.length-1,1)
                    nv.Repository = two.join(":");
                    nv.Tag = last[0];
                    nv.Name = nv.Repository + ':' + nv.Tag;

                }else if(two.length==2){
                    nv.Repository = two[0]+":"+two[1];
                    nv.Tag = DEFAULT_TAG;
                    nv.Name = nv.Repository + ':' + nv.Tag;
                }
            }
        }

        //192.168.56.102:5000/nginx:test

        nv.Repository = nv.Repository.htmlEncodeBracket();

        if(nv.Name == '<none>@<none>'||nv.Name == '<none>:<none>'){
            nv.ID = nv.Id;
        }else{
            nv.Name = nv.Name.htmlEncodeBracket();
            nv.ID = nv.Name;
        }

        nv.Tag = nv.Tag.htmlEncodeBracket();
    },
    trimPrefix4ReposTag: function(RepoTags){
        let temp = RepoTags.replace("http://", "");
        temp = temp.replace("https://", "");
        temp = temp.split("://");

        if(temp.length>1)
            temp = temp[1];
        else
            temp = temp[0];

        return RepoTags;
    },
    getLabels: function (labels) {
        let values = [];
        if (labels) {
            $.each(labels, function (k, v) {
                values.push(k + "=" + v)
            })

            return values.join(";")
        }
        return '';
    },
    getDateStr: function (ms) {
        return new Date(ms * 1000).pattern('yyyy-MM-dd HH:mm:ss')
    },
    list2ObjectList:function(list){
        let rtn = [];
        if(list){
            $.each(list, function (idx, v) {
                rtn.push({
                    value:v
                })
            })
        }
        return rtn;
    },
    getDateStdStr4GMT: function (gmt) {
        if ($.extends.isEmpty(gmt)) {
            return '';
        }

        return $.docker.utils.getDateStdStr(new Date(gmt))
    },
    getDateStdStr4TS: function (ts) {
        if ($.extends.isEmpty(ts)) {
            return '';
        }

        return $.docker.utils.getDateStdStr(new Date(ts*1000))
    },
    getDateStdStr:function(date){
        let diff = Math.ceil(Math.abs(new Date().getTime() - date.getTime())/1000 );

        if(diff<=60){
            return diff + " seconds ago";
        }

        if(diff<60*60){
            return Math.floor(diff/60)  + " minutes ago";
        }

        if(diff<60*60*24){
            return Math.floor(diff/60/60) + " hours ago";
        }

        if(diff<60*60*24*7){
            return Math.floor(diff/60/60/24) + " days ago";
        }

        if(diff<60*60*24*40){
            return Math.floor(diff/60/60/24/7) + " weeks ago";
        }

        if(diff<60*60*24*365){
            return Math.floor(diff/60/60/24/30) + " months ago";
        }

        return Math.floor(diff/60/60/24/365) + " years ago";
    },
    getDateStr4GMT: function (gmt) {
        if ($.extends.isEmpty(gmt)) {
            return '';
        } else {

            if(gmt.indexOf('000')==0)
                return '';

            return new Date(gmt).pattern('yyyy-MM-dd HH:mm:ss')
            //return gmt.replace("T", " ")
        }
    },
    getIdTrimSHA:function (shaStr) {
        if ($.extends.isEmpty(shaStr)) {
            return '';
        }

        return shaStr.replace('sha256:', '')
    },
    getNameTrimSHA:function (shaStr) {
        if ($.extends.isEmpty(shaStr)) {
            return '';
        }

        return shaStr.split("@")[0];
    },
    getId: function (shaStr) {
        if ($.extends.isEmpty(shaStr)) {
            return '';
        }

        let r = shaStr.split(":");

        if (r.length > 1) {
            return r[1]
        } else {
            return r[0]
        }
    },
    getContainerNames: function(names) {
        if (names && names.length > 0) {
            let arr = [];

            $.each(names, function (idx, v) {
                if (!$.extends.isEmpty(v)) {
                    arr.push(v.substring(1))
                }
            })

            return arr
        } else {
            return [];
        }
    },
    getContainerName: function (names) {
        names = $.docker.utils.getContainerNames(names);
        return names.join(",");
    },
    trimContainerName: function (name) {
        if ($.extends.isEmpty(name)) {
            return '';
        }else{
            name = name.trim();
            if(name.startsWith("/")){
                return name.replace("/", "");
            }else {
                return name;
            }

        }
    },
    getMountStr: function (mounts) {
        if (mounts && mounts.length > 0) {
            let arr = [];

            $.each(mounts, function (idx, v) {
                if (!$.extends.isEmpty(v)) {
                    let str = v.Source + ":" + v.Destination;
                    // if (!$.extends.isEmpty(v.Type)) {
                    //     str = str + "/" + v.Type;
                    // }
                    arr.push(str)
                }
            })

            return arr.join("; ")
        } else {
            return '';
        }
    },
    getIPAMStr: function (ipam, delimit) {
        if(!$.extends.isEmpty(ipam) && !$.extends.isEmpty(ipam.Config)){
            let list = [];
            $.each(ipam.Config, function (idx, v) {
                list.push('{0}/{1}'.format($.extends.isEmpty(v.Subnet,''), $.extends.isEmpty(v.Gateway,'')))
            })
            return list.join(delimit||'; ')
        }else{
            return '';
        }
    },
    getPortBindingStr: function (ports) {
        if (ports) {
            let arr = [];

            $.each(ports, function (k, v) {

                if(v&&v.length>0){
                    $.each(v, function (idx, obj) {
                        if (!$.extends.isEmpty(obj))
                        {
                            arr.push(($.extends.isEmpty(obj.HostIp)?"":(obj.HostIp + ":")) + obj.HostPort + "->" + k)
                        }else{
                            arr.push(":->" + k);
                        }
                    })
                }else{
                    arr.push(":->" + k);
                }
            })

            return arr.join("; ")
        } else {
            return '';
        }
    },
    getServiceTargetPortStr: function (ports) {
        if (ports) {
            let arr = [];

            $.each(ports, function (idx, v) {
                if (!$.extends.isEmpty(v))
                {
                    // arr.push(($.extends.isEmpty(v.PublishMode)?"":(v.PublishMode + ":")) + v.PublishedPort
                    //     + "->" + v.TargetPort + ($.extends.isEmpty(v.Protocol)?"":("/" + v.Protocol)));
                    arr.push(v.PublishedPort
                        + "->" + v.TargetPort + ($.extends.isEmpty(v.Protocol)?"":("/" + v.Protocol)));
                }
            })

            return arr.join("; ")
        } else {
            return '';
        }
    },
    getKeyValue:function(lists, delimit){
        delimit = delimit||"=";

        let rtn = {};
        if(!$.extends.isEmpty(lists)){
            $.each(lists, function (idx, v) {
                let two = v.split(delimit);
                if(two.length>=2){
                    rtn[two[0].trim()] = v.substring(two[0].length+1);
                }
            })
        }
        return rtn;
    },
    getPortBindingMap: function (ports) {
        let rtn = {};

        if (ports) {


            $.each(ports, function (k, v) {
                let arr = [];

                if(!$.extends.isEmpty(v)){
                    $.each(v, function (idx, obj) {
                        if (!$.extends.isEmpty(obj))
                        {
                            arr.push(($.extends.isEmpty(obj.HostIp)?"":(obj.HostIp + ":")) + obj.HostPort)

                        }
                    })
                }

                rtn[k] = arr.join("; ")

            })
        }

        return rtn;
    },

    getPluginsMap: function (plugins) {
        let map = {};

        if(!$.extends.isEmpty(plugins)){
            $.each(plugins, function (idx, v) {
                let type = v.Type;
                let list = map[type];
                if($.extends.isEmpty(list)){
                    list = [];
                    map[type] = list;
                }

                list.push(v.Name);
            })
        }

        return map;
    },
    getPluginsStr: function (plugins, delimit) {
        delimit = delimit || ",";
        let arr = [];

        let map = $.docker.utils.getPluginsMap(plugins);

        $.each(map, function (k, v) {
            arr.push(k + "=[" + v.join("|") + "]");
        })

        return arr.join(delimit)
    },
    getPortStr: function (ports) {
        if (ports && ports.length > 0) {
            let arr = [];

            $.each(ports, function (idx, v) {
                if (!$.extends.isEmpty(v)) {
                    let str = $.extends.isEmpty(v.IP,'') + ":" + $.extends.isEmpty(v.PublicPort, '')
                        + "->" + $.extends.isEmpty(v.PrivatePort, '');

                    if (!$.extends.isEmpty(v.Type)) {
                        str = str + "/" + v.Type;
                    }
                    arr.push(str)
                }
            })

            return arr.join("; ")
        } else {
            return '';
        }
    },
    sortList: function (list, sort, order) {
        if ($.extends.isEmpty(sort)) {
            return list;
        }

        order = order || 'asc'

        let flag = 1;

        if (order != 'asc') {
            flag = -1;
        }

        return list.sort(function (a, b) {
            if (a == null) {
                return -1 * flag
            }

            if (b == null) {
                return flag
            }

            let a1 = a[sort]
            let b1 = b[sort]

            if (a1 == null) {
                return flag
            }

            if (b1 == null) {
                return -1 * flag
            }

            return a1 > b1 ? flag : (-1 * flag)
        })
    },
    deleteConfirm: function (title, msg, yesFn, noFn, havePrune) {
        let html = `
            <div style="margin: 0px;">
            </div>
            <div class="cubeui-fluid">
                <fieldset>
                    <legend>选项</legend>
                </fieldset>
                <div style="margin-top:20px">
                    <input data-toggle="cubeui-checkbox" name="force" value="1" label="">
                    <span style='line-height: 30px;padding-right:0px'><b>强制删除</b>(请谨慎选择)</span>
                </div>
                {0}
            </div>
        `;

        if (havePrune) {
            html = html.format(`            
                <div style="margin-top:5px">
                    <input data-toggle="cubeui-checkbox" name="prune" value="1" label="">
                    <span style='line-height: 30px;padding-right:0px'><b>Do not delete untagged parent images</b></span>
                </div>
            `)
        } else {
            html = html.format('')
        }

        $.docker.utils.optionConfirm(title, msg, html, yesFn, noFn)

    },
    optionConfirm: function (title, msg, optionHtml, yesFn, noFn, height, width, afterRender, notmodal) {
        $.iDialog.openDialog({
            title: title || '确认',
            minimizable: false,
            maximizable: false,
            ignoreclose: true,
            modal: notmodal?false:true,
            width: width || 600,
            height: height || 300,
            href: '/option_confirm.html',
            render: function (opts, handler) {
                let d = this;
                console.log("Open dialog");
                handler.render({message: msg, html: optionHtml});

                if($.isFunction(afterRender)){
                    afterRender.call(d, opts, handler)
                }
            },
            buttonsGroup: [{
                text: '确定',
                iconCls: 'fa fa-check-circle',
                btnCls: 'cubeui-btn-red',
                handler: 'ajaxForm',
                beforeAjax: function (o) {
                    o.ajaxData = $.extends.json.param2json(o.ajaxData);
                    console.log(o.ajaxData)

                    let t = this;

                    let closeFn = function () {
                        $.iDialog.closeOutterDialog($(t))
                    }

                    if (yesFn != null && $.isFunction(yesFn)) {
                        yesFn.call(this, o.ajaxData, closeFn)
                    }

                    return false
                },
            }, {
                text: '取消',
                iconCls: 'fa fa-check-circle',
                btnCls: 'cubeui-btn-blue',
                handler:function(o){
                    $.iDialog.closeOutterDialog($(this))
                },
                handler1: 'ajaxForm',
                beforeAjax1: function (o) {
                    o.ajaxData = $.extends.json.param2json(o.ajaxData);

                    if (noFn != null && $.isFunction(noFn)) {
                        noFn.call(this, o.ajaxData)
                    }

                    $.iDialog.closeOutterDialog($(this))

                    return false
                },
            }]
        })
    },
    initVersion: function () {
        $.docker.request.version(local_node, null, true)
    },
    setLocalVolume: function (volumes) {
        let data = [];
        $.each(volumes, function (idx, v) {
            data.push({
                TEXT: v,
                KEY: v,
            })
        })
        window.parent.local_node.volumes = data;
    },
    getLocalVolume: function () {
        return window.parent.local_node.volumes;
    },
    setLocalLog: function (logs) {
        let data = [];
        $.each(logs, function (idx, v) {
            data.push({
                TEXT: v,
                KEY: v,
            })
        })

        //$.app.localStorage.saveItem(node+'_logs', $.extends.json.tostring(data));
        window.parent.local_node.logs = data;
    },
    getLocalLog: function () {
        return window.parent.local_node.logs;
    },

    data:{
        newContainer: function(){
            return {
                HostConfig:{
                    RestartPolicy:{

                    },
                    LogConfig:{

                    },
                },
                Healthcheck:{

                },
                NetworkingConfig:{
                },
                Config:{

                },
            }
        },
    },
    ui: {
        addOpts: function (t, name) {
            let html = `
        
                <div class="cubeui-row">
                    <div class="cubeui-col-sm4 cubeui-col-sm-offset2" style="padding-right: 5px">
                        <input type="text" data-toggle="cubeui-textbox"
                               name='{0}-name' data-options="required:false,prompt:'名字，比如：group '">
                    </div>
                    <div class="cubeui-col-sm5">
                        <input type="text" data-toggle="cubeui-textbox"
                               name='{0}-value' data-options="required:false,prompt:'对应值，比如：db '">
                    </div>
                    <div class="cubeui-col-sm1" style="text-align: center">
                        <span style='line-height: 30px;padding-right:0px;'><span onClick="$.docker.utils.ui.removeOpt(this)"  class="ops-fa-icon fa fa-close" style="font-size:14px!important;">&nbsp;</span></span>
                    </div>
                </div>            
        `.format(name)

            let p = $(t).parents('.add-opt-div')
            if (!$.isEmptyObject(p)) {

                let c = $(html);
                $(p[0]).append(c);
                $.parser.parse(c);
            }

        },
        addNodeOpts: function (t, name) {
            let html = `
        
                <div class="cubeui-row">
                    <div class="cubeui-col-sm4 cubeui-col-sm-offset1" style="padding-right: 5px">
                        <input type="text" data-toggle="cubeui-textbox"
                               name='{0}-name' data-options="required:false,prompt:'名字，比如：group '">
                    </div>
                    <div class="cubeui-col-sm5">
                        <input type="text" data-toggle="cubeui-textbox"
                               name='{0}-value' data-options="required:false,prompt:'对应值，比如：db '">
                    </div>
                    <div class="cubeui-col-sm2" style="text-align: center">
                        <span style='line-height: 30px;padding-right:0px;'><span onClick="$.docker.utils.ui.removeOpt(this)"  class="ops-fa-icon fa fa-close" style="font-size:14px!important;">&nbsp;</span></span>
                    </div>
                </div>            
        `.format(name)

            let p = $(t).parents('.add-opt-div')
            if (!$.isEmptyObject(p)) {

                let c = $(html);
                $(p[0]).append(c);
                $.parser.parse(c);
            }

        },
        addNetwork: function (t, name) {
            let html = `
        
                <div class="cubeui-row">
                    <div class="cubeui-col-sm4 cubeui-col-sm-offset1" style="padding-right: 5px">
                        <input type="text" data-toggle="cubeui-textbox"
                               name='{0}-name' data-options="required:false,prompt:'Subnet，比如：172.17.0.0/16 '">
                    </div>
                    <div class="cubeui-col-sm5">
                        <input type="text" data-toggle="cubeui-textbox"
                               name='{0}-value' data-options="required:false,prompt:'Gateway，比如：172.17.0.1 '">
                    </div>
                    <div class="cubeui-col-sm2" style="text-align: center">
                        <span style='line-height: 30px;padding-right:0px;'><span onClick="$.docker.utils.ui.removeOpt(this)"  class="ops-fa-icon fa fa-close" style="font-size:14px!important;">&nbsp;</span></span>
                    </div>
                </div>            
        `.format(name)

            let p = $(t).parents('.add-opt-div')
            if (!$.isEmptyObject(p)) {

                let c = $(html);
                $(p[0]).append(c);
                $.parser.parse(c);
            }

        },
        addContainerOpts: function (t, name, rowData) {
            let key = $.extends.isEmpty(rowData?rowData.key:'', '').htmlEncodeBracket();
            let value = $.extends.isEmpty(rowData?rowData.value:'', '').htmlEncodeBracket();
            let html = `
        
                <div class="cubeui-row">
                    <div class="cubeui-col-sm5 cubeui-col-sm-offset1" style="padding-right: 5px">
                        <input type="text" data-toggle="cubeui-textbox" value="{1}"
                               name='{0}-name' data-options="required:false,prompt:'自定义元数据名，比如：group '">
                    </div>
                    <div class="cubeui-col-sm5">
                        <input type="text" data-toggle="cubeui-textbox" value="{2}"
                               name='{0}-value' data-options="required:false,prompt:'自定义元数据名值，比如：db '">
                    </div>
                    <div class="cubeui-col-sm1" style="text-align: center">
                        <span style='line-height: 30px;padding-right:0px;'><span onClick="$.docker.utils.ui.removeOpt(this)"  class="ops-fa-icon fa fa-close" style="font-size:14px!important;">&nbsp;</span></span>
                    </div>
                </div>            
        `.format(name, key, value)

            let p = $(t).parents('.add-opt-div')
            if (!$.isEmptyObject(p)) {

                let c = $(html);
                $(p[0]).append(c);
                $.parser.parse(c);
            }

        },
        addLogOpts: function (t, name, rowData) {
            let key = $.extends.isEmpty(rowData?rowData.key:'', '').htmlEncodeBracket();
            let value = $.extends.isEmpty(rowData?rowData.value:'', '').htmlEncodeBracket();
            let html = `
        
                <div class="cubeui-row">
                    <div class="cubeui-col-sm5 cubeui-col-sm-offset1" style="padding-right: 5px">
                        <input type="text" data-toggle="cubeui-textbox" value="{1}"
                               name='{0}-name' data-options="required:false,prompt:'日志驱动配置项，比如：max-log-count '">
                    </div>
                    <div class="cubeui-col-sm5">
                        <input type="text" data-toggle="cubeui-textbox" value="{2}"
                               name='{0}-value' data-options="required:false,prompt:'日志驱动配置值，比如：10 '">
                    </div>
                    <div class="cubeui-col-sm1" style="text-align: center">
                        <span style='line-height: 30px;padding-right:0px;'><span onClick="$.docker.utils.ui.removeOpt(this)"  class="ops-fa-icon fa fa-close" style="font-size:14px!important;">&nbsp;</span></span>
                    </div>
                </div>            
        `.format(name, key, value)

            let p = $(t).parents('.add-opt-div')
            if (!$.isEmptyObject(p)) {

                let c = $(html);
                $(p[0]).append(c);
                $.parser.parse(c);
            }

        },
        addConfigFile: function (t, name, rowData) {
            let file = $.extends.isEmpty(rowData?rowData.file:'', '').htmlEncodeBracket();
            let runtime = $.extends.isEmpty(rowData?rowData.runtime:'', '').htmlEncodeBracket();

            file = $.extends.isEmpty(file)?runtime:file;

            let configId = $.extends.isEmpty(rowData?rowData.configId:'', '').htmlEncodeBracket();
            let configName = $.extends.isEmpty(rowData?rowData.configName:'', '').htmlEncodeBracket();

            let html = `        
                <div class="cubeui-row">
                    <div class="cubeui-col-sm3 cubeui-col-sm-offset1" style="padding-right: 5px">
                        <input type="text" data-toggle="cubeui-textbox" value="{1}"
                               name='{0}-name' data-options="
                               required:true,
                               prompt:'配置文件/运行时配置文本，必填项目'
                               ">
                    </div>
                    <div class="cubeui-col-sm4">
                        <input type="text" data-toggle="cubeui-textbox" value="{2}"
                               name='{0}-value' data-options="required:false,prompt:'配置文件ID'">
                    </div>
                    <div class="cubeui-col-sm3">
                        <input type="text" data-toggle="cubeui-textbox" value="{3}"
                               name='{0}-value' data-options="required:false,prompt:'引用名称，仅用于查找/显示目的。配置将通过其ID识别。 '">
                    </div>
                    <div class="cubeui-col-sm1" style="text-align: center">
                        <span style='line-height: 30px;padding-right:0px;'><span onClick="$.docker.utils.ui.removeOpt(this)"  class="ops-fa-icon fa fa-close" style="font-size:14px!important;">&nbsp;</span></span>
                    </div>
                </div>            
        `.format(name, file, configId, configName);

            let p = $(t).parents('.add-opt-div')
            if (!$.isEmptyObject(p)) {

                let c = $(html);
                $(p[0]).append(c);
                $.parser.parse(c);
            }
        },
        addSecretFile: function (t, name, rowData) {
            let file = $.extends.isEmpty(rowData?rowData.file:'', '').htmlEncodeBracket();
            let secretId = $.extends.isEmpty(rowData?rowData.secretId:'', '').htmlEncodeBracket();
            let secretName = $.extends.isEmpty(rowData?rowData.secretName:'', '').htmlEncodeBracket();

            let html = `        
                <div class="cubeui-row">
                    <div class="cubeui-col-sm3 cubeui-col-sm-offset1" style="padding-right: 5px">
                        <input type="text" data-toggle="cubeui-textbox" value="{1}"
                               name='{0}-name' data-options="
                               required:true,
                               prompt:'密码文件，必填项目'
                               ">
                    </div>
                    <div class="cubeui-col-sm4">
                        <input type="text" data-toggle="cubeui-textbox" value="{2}"
                               name='{0}-value' data-options="required:false,prompt:'密码文件ID'">
                    </div>
                    <div class="cubeui-col-sm3">
                        <input type="text" data-toggle="cubeui-textbox" value="{3}"
                               name='{0}-value' data-options="required:false,prompt:'引用名称，仅用于查找/显示目的。密码将通过其ID识别。 '">
                    </div>
                    <div class="cubeui-col-sm1" style="text-align: center">
                        <span style='line-height: 30px;padding-right:0px;'><span onClick="$.docker.utils.ui.removeOpt(this)"  class="ops-fa-icon fa fa-close" style="font-size:14px!important;">&nbsp;</span></span>
                    </div>
                </div>            
        `.format(name, file, secretId, secretName);

            let p = $(t).parents('.add-opt-div')
            if (!$.isEmptyObject(p)) {

                let c = $(html);
                $(p[0]).append(c);
                $.parser.parse(c);
            }
        },
        addEndpointPorts: function (t, name, rowData) {
            let publishMode = $.extends.isEmpty(rowData?rowData.publishMode:'', '').htmlEncodeBracket();
            let publishProtocol = $.extends.isEmpty(rowData?rowData.publishProtocol:'', '').htmlEncodeBracket();
            let publishPort = $.extends.isEmpty(rowData?rowData.publishPort:'', '').htmlEncodeBracket();
            let targetPort = $.extends.isEmpty(rowData?rowData.targetPort:'', '').htmlEncodeBracket();

            let html = `        
                <div class="cubeui-row">
                    <div class="cubeui-col-sm2 cubeui-col-sm-offset1" style="padding-right: 5px">
                        <input type="text" data-toggle="cubeui-combobox" value="{1}"
                               name='{0}-publish-mode' data-options="
                               required:false,
                               prompt:'公开端口发布的模式，为空使用默认值，默认值：“ingress”',
                               valueField:'KEY',
                               textField:'TEXT',
                               data:[{KEY:'ingress',TEXT:'Ingress'},{KEY:'host',TEXT:'Host'}]
                               ">
                    </div>
                    <div class="cubeui-col-sm3">
                        <input type="text" data-toggle="cubeui-combobox" value="{2}"                               
                               name='{0}-publish-protocol' data-options="
                               required:false,
                               prompt:'公开端口协议，为空使用默认值，默认值：“tcp”',
                               valueField:'KEY',
                               textField:'TEXT',
                               data:[{KEY:'tcp',TEXT:'Tcp'},{KEY:'udp',TEXT:'Udp'},{KEY:'sctp',TEXT:'Sctp(Stream Control Transmission Protocol)'}]
                               ">
                    </div>
                    <div class="cubeui-col-sm3">
                        <input type="text" data-toggle="cubeui-numberspinner" value="{3}"
                               name='{0}-publish-port' data-options="required:false,prompt:'公开端口，比如：9090 '">
                    </div>
                    <div class="cubeui-col-sm2">
                        <input type="text" data-toggle="cubeui-numberspinner" value="{4}"
                               name='{0}-target-port' data-options="required:false,prompt:'目标端口，比如：80 '">
                    </div>
                    <div class="cubeui-col-sm1" style="text-align: center">
                        <span style='line-height: 30px;padding-right:0px;'><span onClick="$.docker.utils.ui.removeOpt(this)"  class="ops-fa-icon fa fa-close" style="font-size:14px!important;">&nbsp;</span></span>
                    </div>
                </div>            
        `.format(name, publishPort, publishProtocol, publishPort, targetPort);

            let p = $(t).parents('.add-opt-div')
            if (!$.isEmptyObject(p)) {

                let c = $(html);
                $(p[0]).append(c);
                $.parser.parse(c);
            }
        },
        addNetworkAttach: function (t, name, rowData) {
            let network = $.extends.isEmpty(rowData?rowData.network:'', '').htmlEncodeBracket();
            let alias = $.extends.isEmpty(rowData?rowData.alias:'', '').htmlEncodeBracket();
            let opts = $.extends.isEmpty(rowData?rowData.opts:'', '').htmlEncodeBracket();

            let node = local_node;

            setNetworkMap(function(map, all_list){
                    window.getAllList = function(){
                        return all_list;
                    }

                    let html = `            
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm3 cubeui-col-sm-offset1" style="padding-right: 5px">
                            <input type="text" data-toggle="cubeui-combobox" value="{1}"
                                   name='{0}-name' data-options="
                                   required:true,
                                   prompt:'选择需要连接的网络，必填项目',
                                   valueField:'KEY',
                                   textField:'TEXT',
                                   data:[].concat(getAllList())
                                   ">
                        </div>
                        <div class="cubeui-col-sm4">
                            <input type="text" data-toggle="cubeui-textbox" value="{2}"
                                   name='{0}-value' data-options="required:false,prompt:'网络内部别名，比如：node01 '">
                        </div>
                        <div class="cubeui-col-sm3">
                            <input type="text" data-toggle="cubeui-textbox" value="{3}"
                                   name='{0}-value2' data-options="required:false,prompt:'网络配置项目，格式key=value 多个配置使用;分割 '">
                        </div>
                        <div class="cubeui-col-sm1" style="text-align: center">
                            <span style='line-height: 30px;padding-right:0px;'><span onClick="$.docker.utils.ui.removeOpt(this)"  class="ops-fa-icon fa fa-close" style="font-size:14px!important;">&nbsp;</span></span>
                        </div>
                    </div>            
            `.format(name, network, alias, opts);

                    let p = $(t).parents('.add-opt-div')
                    if (!$.isEmptyObject(p)) {

                        let c = $(html);
                        $(p[0]).append(c);
                        $.parser.parse(c);
                    }
            }, node);

        },
        addLimits: function (t, name, rowData) {

            let limit = $.extends.isEmpty(rowData?rowData.limit:'', '').htmlEncodeBracket();
            let soft = $.extends.isEmpty(rowData?rowData.soft:'', '').htmlEncodeBracket();
            let hard = $.extends.isEmpty(rowData?rowData.hard:'', '').htmlEncodeBracket();

            let html = `
        
                <div class="cubeui-row">
                    <div class="cubeui-col-sm3 cubeui-col-sm-offset1" style="padding-right: 5px">
                        <input type="text" data-toggle="cubeui-textbox" value="{1}"
                               name='{0}-name' data-options="required:false,prompt:'限制资源名，比如：nofile '">
                    </div>
                    <div class="cubeui-col-sm4">
                        <input type="text" data-toggle="cubeui-textbox" value="{2}"
                               name='{0}-soft' data-options="required:false,prompt:'限制资源soft限制，比如：1024 '">
                    </div>
                    <div class="cubeui-col-sm3">
                        <input type="text" data-toggle="cubeui-textbox" value="{3}"
                               name='{0}-hard' data-options="required:false,prompt:'限制资源hard限制，比如：2048 '">
                    </div>
                    <div class="cubeui-col-sm1" style="text-align: center">
                        <span style='line-height: 30px;padding-right:0px;'><span onClick="$.docker.utils.ui.removeOpt(this)"  class="ops-fa-icon fa fa-close" style="font-size:14px!important;">&nbsp;</span></span>
                    </div>
                </div>            
        `.format(name, limit, soft, hard);

            let p = $(t).parents('.add-opt-div')
            if (!$.isEmptyObject(p)) {

                let c = $(html);
                $(p[0]).append(c);
                $.parser.parse(c);
            }

        },
        addSysctls: function (t, name, rowData) {

            let key = $.extends.isEmpty(rowData?rowData.key:'', '').htmlEncodeBracket();
            let value = $.extends.isEmpty(rowData?rowData.value:'', '').htmlEncodeBracket();

            let html = `
        
                <div class="cubeui-row">
                    <div class="cubeui-col-sm5 cubeui-col-sm-offset1" style="padding-right: 5px">
                        <input type="text" data-toggle="cubeui-textbox" value="{1}"
                               name='{0}-name' data-options="required:false,prompt:'内核命名空间参数名字，比如：kernel.core_uses_pid '">
                    </div>
                    <div class="cubeui-col-sm5">
                        <input type="text" data-toggle="cubeui-textbox" value="{2}"
                               name='{0}-value' data-options="required:false,prompt:'内核命名空间参数对应值，比如：1 '">
                    </div>
                    <div class="cubeui-col-sm1" style="text-align: center">
                        <span style='line-height: 30px;padding-right:0px;'><span onClick="$.docker.utils.ui.removeOpt(this)"  class="ops-fa-icon fa fa-close" style="font-size:14px!important;">&nbsp;</span></span>
                    </div>
                </div>            
        `.format(name, key, value);

            let p = $(t).parents('.add-opt-div')
            if (!$.isEmptyObject(p)) {

                let c = $(html);
                $(p[0]).append(c);
                $.parser.parse(c);
            }

        },
        addHosts: function (t, name, rowData) {
            let ip = $.extends.isEmpty(rowData?rowData.ip:'', '').htmlEncodeBracket();
            let hostname = $.extends.isEmpty(rowData?rowData.hostname:'', '').htmlEncodeBracket();
            let aliases = $.extends.isEmpty(rowData?rowData.aliases:'', '').htmlEncodeBracket();
            let html = `        
                <div class="cubeui-row">
                    <div class="cubeui-col-sm3 cubeui-col-sm-offset1" style="padding-right: 5px">
                        <input type="text" data-toggle="cubeui-textbox" value="{1}"
                               name='{0}-address' data-options="required:false,prompt:'IP地址，比如：192.168.56.1 '">
                    </div>
                    <div class="cubeui-col-sm4">
                        <input type="text" data-toggle="cubeui-textbox" value="{2}"
                               name='{0}-hostname' data-options="required:false,prompt:'Hosts主机名，比如：machine '">
                    </div>
                    <div class="cubeui-col-sm3">
                        <input type="text" data-toggle="cubeui-textbox" value="{3}"
                               name='{0}-aliases' data-options="required:false,prompt:'主机别名，比如：team01 team02 '">
                    </div>
                    <div class="cubeui-col-sm1" style="text-align: center">
                        <span style='line-height: 30px;padding-right:0px;'><span onClick="$.docker.utils.ui.removeOpt(this)"  class="ops-fa-icon fa fa-close" style="font-size:14px!important;">&nbsp;</span></span>
                    </div>
                </div>            
        `.format(name, ip, hostname, aliases);

            let p = $(t).parents('.add-opt-div')
            if (!$.isEmptyObject(p)) {

                let c = $(html);
                $(p[0]).append(c);
                $.parser.parse(c);
            }

        },
        addEnvs: function (t, name, rowData) {

            let key = $.extends.isEmpty(rowData?rowData.key:'', '').htmlEncodeBracket();
            let value = $.extends.isEmpty(rowData?rowData.value:'', '').htmlEncodeBracket();

            let html = `
        
                <div class="cubeui-row">
                    <div class="cubeui-col-sm5 cubeui-col-sm-offset1" style="padding-right: 5px">
                        <input type="text" data-toggle="cubeui-textbox" value="{1}"
                               name='{0}-name' data-options="required:false,prompt:'环境变量名，比如：profile '">
                    </div>
                    <div class="cubeui-col-sm5">
                        <input type="text" data-toggle="cubeui-textbox"  value="{2}"
                               name='{0}-value' data-options="required:false,prompt:'环境变量值，比如：production '">
                    </div>
                    <div class="cubeui-col-sm1" style="text-align: center">
                        <span style='line-height: 30px;padding-right:0px;'><span onClick="$.docker.utils.ui.removeOpt(this)"  class="ops-fa-icon fa fa-close" style="font-size:14px!important;">&nbsp;</span></span>
                    </div>
                </div>            
        `.format(name, key, value);

            let p = $(t).parents('.add-opt-div')
            if (!$.isEmptyObject(p)) {

                let c = $(html);
                $(p[0]).append(c);
                $.parser.parse(c);
            }

        },
        addConnectLinks: function (t, name) {
            let html = `
        
                <div class="cubeui-row">
                    <div class="cubeui-col-sm4 cubeui-col-sm-offset1" style="padding-right: 5px">
                        <input type="text" data-toggle="cubeui-textbox"
                               name='{0}-name' data-options="required:false,prompt:'目标容器名，比如：mysql-001 '">
                    </div>
                    <div class="cubeui-col-sm5">
                        <input type="text" data-toggle="cubeui-textbox"
                               name='{0}-value' data-options="required:false,prompt:'链接别名，比如：mysqldb '">
                    </div>
                    <div class="cubeui-col-sm2" style="text-align: center">
                        <span style='line-height: 30px;padding-right:0px;'><span onClick="$.docker.utils.ui.removeOpt(this)"  class="ops-fa-icon fa fa-close" style="font-size:14px!important;">&nbsp;</span></span>
                    </div>
                </div>            
        `.format(name)

            let p = $(t).parents('.add-opt-div')
            if (!$.isEmptyObject(p)) {

                let c = $(html);
                $(p[0]).append(c);
                $.parser.parse(c);
            }

        },
        addLinks: function (t, name) {
            let html = `
        
                <div class="cubeui-row">
                    <div class="cubeui-col-sm4 cubeui-col-sm-offset2" style="padding-right: 5px">
                        <input type="text" data-toggle="cubeui-textbox"
                               name='{0}-name' data-options="required:false,prompt:'目标容器名，比如：mysql-001 '">
                    </div>
                    <div class="cubeui-col-sm5">
                        <input type="text" data-toggle="cubeui-textbox"
                               name='{0}-value' data-options="required:false,prompt:'链接别名，比如：mysqldb '">
                    </div>
                    <div class="cubeui-col-sm1" style="text-align: center">
                        <span style='line-height: 30px;padding-right:0px;'><span onClick="$.docker.utils.ui.removeOpt(this)"  class="ops-fa-icon fa fa-close" style="font-size:14px!important;">&nbsp;</span></span>
                    </div>
                </div>            
        `.format(name)

            let p = $(t).parents('.add-opt-div')
            if (!$.isEmptyObject(p)) {

                let c = $(html);
                $(p[0]).append(c);
                $.parser.parse(c);
            }

        },
        addCmds: function (t, name) {
            let html = `
        
                <div class="cubeui-row">
                    <div class="cubeui-col-sm9 cubeui-col-sm-offset2" style="padding-right: 5px">
                        <input type="text" data-toggle="cubeui-textbox"
                               name='{0}-name' data-options="required:false,prompt:'容器运行命令，比如：docker.ui '">
                    </div>
                    <div class="cubeui-col-sm1" style="text-align: center">
                        <span style='line-height: 30px;padding-right:0px;'><span onClick="$.docker.utils.ui.removeOpt(this)"  class="ops-fa-icon fa fa-close" style="font-size:14px!important;">&nbsp;</span></span>
                    </div>
                </div>            
        `.format(name)

            let p = $(t).parents('.add-opt-div')
            if (!$.isEmptyObject(p)) {

                let c = $(html);
                $(p[0]).append(c);
                $.parser.parse(c);
            }

        },
        addEntrypoints: function (t, name) {
            let html = `
        
                <div class="cubeui-row">
                    <div class="cubeui-col-sm9 cubeui-col-sm-offset2" style="padding-right: 5px">
                        <input type="text" data-toggle="cubeui-textbox"
                               name='{0}-name' data-options="required:false,prompt:'入口点，如果由空字符串组成，则入口点重置为系统默认值（即docker在Dockerfile中没有入口点指令时使用的入口点）。'">
                    </div>
                    <div class="cubeui-col-sm1" style="text-align: center">
                        <span style='line-height: 30px;padding-right:0px;'><span onClick="$.docker.utils.ui.removeOpt(this)"  class="ops-fa-icon fa fa-close" style="font-size:14px!important;">&nbsp;</span></span>
                    </div>
                </div>            
        `.format(name)

            let p = $(t).parents('.add-opt-div')
            if (!$.isEmptyObject(p)) {

                let c = $(html);
                $(p[0]).append(c);
                $.parser.parse(c);
            }

        },
        addContainerLinks: function (t, name, rowData) {

            let src = $.extends.isEmpty(rowData?rowData.target:'', '').htmlEncodeBracket();
            let alias = $.extends.isEmpty(rowData?rowData.alias:'', '').htmlEncodeBracket();

            let html = `
                <div id='dg_container_header-{3}' style="display:none;margin-bottom1:15px">
                    <span style='line-height: 30px;padding-right:0px'>所有容器：</span>
                    <input id='container_refreshBtn-{3}'  value='1' data-toggle="cubeui-switchbutton" style="width:50px;height1:30px" checked1="true"
                        data-options="
                        onText:'',offText:'',
                        onChange: function(checked){
                            $('#container_searchbtn-{3}').trigger('click');
                        }
                        ">
                
                    <span style='line-height: 30px;padding-left:2px;padding-right:10px'></span>
                    <input type="text" id='container_search_type-{3}' value="name" data-toggle="cubeui-combobox"
                           data-options="
                                    width:120,
                                    required:true,prompt:'查询方式，必须填写',
                                    valueField:'KEY',
                                    textField:'TEXT',
                                    data:[{'KEY':'name','TEXT':'Name'},{'KEY':'label','TEXT':'Label'},{'KEY':'before','TEXT':'Before'},
                                    {'KEY':'since','TEXT':'Since'},{'KEY':'reference','TEXT':'Refer'},{'KEY':'ancestor','TEXT':'Ancestor'},
                                    {'KEY':'expose','TEXT':'Expose'},{'KEY':'publish','TEXT':'Publish'},{'KEY':'volume','TEXT':'Volume'}]
                           ">
                    <input type="text" id='container_search_key-{3}' data-toggle="cubeui-textbox"
                           data-options="onClear:function(){
                                $('#container_searchbtn-{3}').trigger('click');
                           }, mask:'{{:~js(prefix)}}', prompt:'查询条件, 多条件逗号分隔；label方式 label1=a,label2=b',width:420">
                    <a href="javascript:void(0)" id="container_searchbtn-{3}"
                       data-toggle="cubeui-menubutton"
                       data-options="
                       iconCls:'fa fa-search',
                       btnCls:'cubeui-btn-blue',
                       onClick:function(){
                            let param = {};
                            param.all = $('#container_refreshBtn-{3}').switchbutton('options').checked?1:null;
                            param.search_type = $('#container_search_type-{3}').combobox('getValue');
                            param.search_key = $('#container_search_key-{3}').textbox('getValue');
                            $('#containerlist-{3}').combogrid('grid').datagrid('reload',param)
                       }
                       ">查询</a>
                </div>

                <div class="cubeui-row">
                    <div class="cubeui-col-sm5 cubeui-col-sm-offset1" style="padding-right: 5px">                        
                    <input type="text" id="containerlist-{3}" value="{1}" name="{0}-name" value="" data-toggle="cubeui-combogrid"
                           data-options="
                                       required:false,
                                       reversed:true,
                                       editable:false,
                                       panelHeight:400,
                                       panelWidth:800,
                                       idField:'ID',
                                       mode:'local',
                                       textField:'Name',
                                       pagination:true,
                                       uuid:'{3}',
                                       toolbar:'#dg_container_header-{3}',
                                       sortOrder:'asc',
                                       sortName:'Id',
                                       pageSize:50,
                                       prompt:'目标容器名，比如：mysql-001 ',
                                       onBeforeLoad:function (param){                                            
                                            refreshContainer4ContainerLink(param,'{3}');
                                       },
                                        frozenColumns:[[
                                            {field: 'Name', title: 'NAME', sortable: true,
                                                formatter:$.iGrid.tooltipformatter(),
                                                width: 160},
                                            {field: 'Id', title: 'CONTAINER ID', sortable: true,
                                                formatter:$.iGrid.buildformatter([$.iGrid.templateformatter('{Id}'), $.iGrid.tooltipformatter()]),
                                                width: 260},
                                        ]],
                                       columns:[[
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
                                       ]]
                                   ">
                    </div>
                    <div class="cubeui-col-sm5">
                        <input type="text" data-toggle="cubeui-textbox" value="{2}"
                               name='{0}-value' data-options="required:false,prompt:'链接别名，比如：mysqldb,多值用空格分隔 '">
                    </div>
                    <div class="cubeui-col-sm1" style="text-align: center">
                        <span style='line-height: 30px;padding-right:0px;'><span onClick="$.docker.utils.ui.removeOpt(this)"  class="ops-fa-icon fa fa-close" style="font-size:14px!important;">&nbsp;</span></span>
                    </div>
                </div>            
        `.format(name, src, alias, Math.uuid());

            let p = $(t).parents('.add-opt-div')
            if (!$.isEmptyObject(p)) {

                let c = $(html);
                $(p[0]).append(c);
                $.parser.parse(c);
            }

        },
        addContainerPorts: function (t, name, rowData) {

            let src = $.extends.isEmpty(rowData?rowData.target:'', '').htmlEncodeBracket();
            let dest = $.extends.isEmpty(rowData?rowData.publish:'', '').htmlEncodeBracket();

            let html = `        
                <div class="cubeui-row">
                    <div class="cubeui-col-sm5 cubeui-col-sm-offset1" style="padding-right: 5px">
                        <input type="text" data-toggle="cubeui-textbox" value="{1}"
                               name='{0}-name' data-options="required:false,prompt:'使用端口号和协议，例如80/tcp, 80/udp'">
                    </div>
                    <div class="cubeui-col-sm5">
                        <input type="text" data-toggle="cubeui-textbox" value="{2}"
                               name='{0}-value' data-options="required:false,prompt:'主机映射端口, 格式[ip:]port, 例如192.168.56.101:9999, 9999'">
                    </div>
                    <div class="cubeui-col-sm1" style="text-align: center">
                        <span style='line-height: 30px;padding-right:0px;'><span onClick="$.docker.utils.ui.removeOpt(this)"  class="ops-fa-icon fa fa-close" style="font-size:14px!important;">&nbsp;</span></span>
                    </div>
                </div>            
        `.format(name, src, dest)

            let p = $(t).parents('.add-opt-div')
            if (!$.isEmptyObject(p)) {

                let c = $(html);
                $(p[0]).append(c);
                $.parser.parse(c);
            }

        },
        addPorts: function (t, name) {
            let html = `        
                <div class="cubeui-row">
                    <div class="cubeui-col-sm4 cubeui-col-sm-offset2" style="padding-right: 5px">
                        <input type="text" data-toggle="cubeui-textbox"
                               name='{0}-name' data-options="required:false,prompt:'使用端口号和协议，例如80/tcp, 80/udp'">
                    </div>
                    <div class="cubeui-col-sm5">
                        <input type="text" data-toggle="cubeui-textbox"
                               name='{0}-value' data-options="required:false,prompt:'主机映射端口, 格式[ip:]port, 例如192.168.56.101:9999, 9999'">
                    </div>
                    <div class="cubeui-col-sm1" style="text-align: center">
                        <span style='line-height: 30px;padding-right:0px;'><span onClick="$.docker.utils.ui.removeOpt(this)"  class="ops-fa-icon fa fa-close" style="font-size:14px!important;">&nbsp;</span></span>
                    </div>
                </div>            
        `.format(name)

            let p = $(t).parents('.add-opt-div')
            if (!$.isEmptyObject(p)) {

                let c = $(html);
                $(p[0]).append(c);
                $.parser.parse(c);
            }

        },
        addMounts: function (t, name, rowData) {

            let src = $.extends.isEmpty(rowData?rowData.src:'', '').htmlEncodeBracket();
            let dest = $.extends.isEmpty(rowData?rowData.dest:'', '').htmlEncodeBracket();
            let nocopy = $.extends.isEmpty(rowData?rowData.nocopy:'', false)==true?1:0;
            let nocopyChecked = nocopy==true?"checked":"";
            let rw = $.extends.isEmpty(rowData?rowData.rw:'', false)==true?1:0;
            let rwChecked = rw==true?"checked":"";
            let z = $.extends.isEmpty(rowData?rowData.z:'', false)==true?1:0;
            let zChecked = z ==true?"checked":"";

            let html = `        
                <div class="cubeui-row">
                    <div class="cubeui-col-sm5 cubeui-col-sm-offset1" style="padding-right: 5px">
                        <input type="text" data-toggle="cubeui-textbox" value="{1}"
                               name='{0}-name' data-options="required:false,prompt:'绑定的主机路径或者数据卷, 主机路径必须是绝对路径'">
                    </div>
                    <div class="cubeui-col-sm3">
                        <input type="text" data-toggle="cubeui-textbox"  value="{2}"
                               name='{0}-value' data-options="required:false,prompt:'绑定容器目标路径, 目标路径必须是绝对路径'">
                    </div>
                    
                    <div class="cubeui-col-sm2">
                            <span style='line-height: 30px;padding-left:5px' title='
                             禁用将数据从容器路径自动复制到卷,仅适用于卷
                             ' ><b >nc</b></span>
                            <input type="hidden" name="nocopy" class="nocopy" value="{3}">       
                             <input data-toggle="cubeui-checkbox" name="volume-nocopy-opt" {4} value="1" label="" data-options="
                                 onChange:function(checked){
                                    let obj = $(this).parent().find('input.nocopy')                                    
                                    if(checked){                                    
                                        obj.val(1)
                                    }else{
                                        obj.val(0)
                                    }
                                    console.log(obj)
                                 }
                             ">
                             <span style='line-height: 30px;padding-left:5px' title='
                             只读或读写方式装入卷。如果勾选为rw，卷将以读写方式装入
                             ' ><b >RW</b></span>
                            <input type="hidden" name="rw"  class="rw" value="{5}">       
                             <input data-toggle="cubeui-checkbox" {6} name="volume-rw-opt" value="1" label="" data-options="
                                 onChange:function(checked){
                                    let obj = $(this).parent().find('input.rw')                                    
                                    if(checked){                                    
                                        obj.val(1)
                                    }else{
                                        obj.val(0)
                                    }
                                    console.log(obj)
                                 }
                             ">                             
                             <span style='line-height: 30px;padding-left:5px' title='
                             应用SELinux以允许或拒绝多个容器对同一卷进行读写, 勾选表示为共享方式，否则私有方式
                             ' ><b >S</b></span>
                            <input type="hidden" name="z"  class="z"  value="{7}">       
                             <input data-toggle="cubeui-checkbox" {8} name="volume-z-opt" value="1" label="" data-options="
                                 onChange:function(checked){
                                    let obj = $(this).parent().find('input.z')                                    
                                    if(checked){                                    
                                        obj.val(1)
                                    }else{
                                        obj.val(0)
                                    }
                                    console.log(obj)
                                 }
                             ">
                    </div>
                    <div class="cubeui-col-sm1" style="text-align: center">
                        <span style='line-height: 30px;padding-right:0px;'><span onClick="$.docker.utils.ui.removeOpt(this)"  class="ops-fa-icon fa fa-close" style="font-size:14px!important;">&nbsp;</span></span>
                    </div>
                </div>            
        `.format(name, src, dest, nocopy, nocopyChecked, rw, rwChecked, z, zChecked);

            let p = $(t).parents('.add-opt-div')
            if (!$.isEmptyObject(p)) {

                let c = $(html);
                $(p[0]).append(c);
                $.parser.parse(c);
            }

        },
        addVolumes: function (t, name, rowData) {

            let src = $.extends.isEmpty(rowData?rowData.src:'', '').htmlEncodeBracket();
            let dest = $.extends.isEmpty(rowData?rowData.dest:'', '').htmlEncodeBracket();
            let nocopy = $.extends.isEmpty(rowData?rowData.nocopy:'', false)==true?1:0;
            let nocopyChecked = nocopy==true?"checked":"";
            let rw = $.extends.isEmpty(rowData?rowData.rw:'', false)==true?1:0;
            let rwChecked = rw==true?"checked":"";
            let z = $.extends.isEmpty(rowData?rowData.z:'', false)==true?1:0;
            let zChecked = z ==true?"checked":"";

            let html = `        
                <div class="cubeui-row">
                    <div class="cubeui-col-sm4 cubeui-col-sm-offset2" style="padding-right: 5px">
                        <input type="text" data-toggle="cubeui-textbox" value="{1}"
                               name='{0}-name' data-options="required:false,prompt:'绑定的主机路径或者数据卷, 主机路径必须是绝对路径'">
                    </div>
                    <div class="cubeui-col-sm3">
                        <input type="text" data-toggle="cubeui-textbox"  value="{2}"
                               name='{0}-value' data-options="required:false,prompt:'绑定容器目标路径, 目标路径必须是绝对路径'">
                    </div>
                    
                    <div class="cubeui-col-sm2">
                            <span style='line-height: 30px;padding-left:5px' title='
                             禁用将数据从容器路径自动复制到卷,仅适用于卷
                             ' ><b >nc</b></span>
                            <input type="hidden" name="nocopy" class="nocopy" value="{3}">       
                             <input data-toggle="cubeui-checkbox" name="volume-nocopy-opt" {4} value="1" label="" data-options="
                                 onChange:function(checked){
                                    let obj = $(this).parent().find('input.nocopy')                                    
                                    if(checked){                                    
                                        obj.val(1)
                                    }else{
                                        obj.val(0)
                                    }
                                    console.log(obj)
                                 }
                             ">
                             <span style='line-height: 30px;padding-left:5px' title='
                             只读或读写方式装入卷。如果勾选为rw，卷将以读写方式装入
                             ' ><b >RW</b></span>
                            <input type="hidden" name="rw"  class="rw" value="{5}">       
                             <input data-toggle="cubeui-checkbox" {6} name="volume-rw-opt" value="1" label="" data-options="
                                 onChange:function(checked){
                                    let obj = $(this).parent().find('input.rw')                                    
                                    if(checked){                                    
                                        obj.val(1)
                                    }else{
                                        obj.val(0)
                                    }
                                    console.log(obj)
                                 }
                             ">                             
                             <span style='line-height: 30px;padding-left:5px' title='
                             应用SELinux以允许或拒绝多个容器对同一卷进行读写, 勾选表示为共享方式，否则私有方式
                             ' ><b >S</b></span>
                            <input type="hidden" name="z"  class="z"  value="{7}">       
                             <input data-toggle="cubeui-checkbox" {8} name="volume-z-opt" value="1" label="" data-options="
                                 onChange:function(checked){
                                    let obj = $(this).parent().find('input.z')                                    
                                    if(checked){                                    
                                        obj.val(1)
                                    }else{
                                        obj.val(0)
                                    }
                                    console.log(obj)
                                 }
                             ">
                    </div>
                    <div class="cubeui-col-sm1" style="text-align: center">
                        <span style='line-height: 30px;padding-right:0px;'><span onClick="$.docker.utils.ui.removeOpt(this)"  class="ops-fa-icon fa fa-close" style="font-size:14px!important;">&nbsp;</span></span>
                    </div>
                </div>            
        `.format(name, src, dest, nocopy, nocopyChecked, rw, rwChecked, z, zChecked);

            let p = $(t).parents('.add-opt-div')
            if (!$.isEmptyObject(p)) {

                let c = $(html);
                $(p[0]).append(c);
                $.parser.parse(c);
            }

        },
        removeOpt: function (t) {
            let p = $(t).parents('.cubeui-row')
            if (!$.isEmptyObject(p)) {
                $(p[0]).remove()
            }
            console.log(t)
        },
        collapseWithSlide: function (layoutObj, layoutPanelObj, panelClosedEvent) {
            let opts = $(layoutPanelObj).panel('options');

            if (!layoutPanelObj.hadcame && $(layoutPanelObj).panel('options').collapsed == true) {
                layoutPanelObj.hadcame = true;
                return;
            }

            let region = $(layoutPanelObj).panel('options').region;

            if (!$(layoutObj).layout('isExpand', region)) {
                layoutPanelObj.hadcame = null;
                $.easyui.thread.sleep(function () {
                    try{
                        $(layoutObj).layout('remove', region);
                    }catch (e) {

                    }

                    if(panelClosedEvent)
                        panelClosedEvent(opts)
                }, 0);
            }
        },
        showSlidePanel: function (layoutObj, option) {
            option = $.extend({}, option)

            let region = option.region;

            $(layoutObj).layout('remove', region);

            if (!option.onCollapse) {
                option.onCollapse = function () {
                    $.docker.utils.ui.collapseWithSlide.call(option, layoutObj, this, option.onPanelClosed);
                }
            }

            layoutObj = $(layoutObj)

            layoutObj.layout('add', option);
            let r = $(layoutObj.layout('panel', region));
            let t = r.panel('options').titleformat;
            r.panel('setTitle', t);

            let panel = layoutObj.layout('panel', region);

            let panelInit = {}

            if (!$.extends.isEmpty(option.footerTpl)) {
                let uuid = Math.uuid()

                $(panel).append(`
                            <div id='{0}' style="padding: 5px; text-align: right;">
                            {1}
                            </div>                 
                    `.format(uuid, $(option.footerTpl).html()));

                panelInit.footer = '#' + uuid;
                $(panel).panel(panelInit);
                $.parser.parse('#' + uuid);
                $(panel).panel('resize', {});
            } else {
                if (option.footerHtml) {

                    let html = '';
                    if ($.isFunction(option.footerHtml)) {
                        html = option.footerHtml()
                    } else {
                        html = option.footerHtml
                    }
                    let uuid = Math.uuid()

                    $(panel).append(`
                            <div id='{0}' style="padding: 5px; text-align: right;">
                            {1}
                            </div>                 
                    `.format(uuid, html));

                    panelInit.footer = '#' + uuid;
                    $(panel).panel(panelInit);
                    $.parser.parse('#' + uuid);
                    $(panel).panel('resize', {});
                } else {
                    $(panel).panel(panelInit);
                    $(panel).panel('resize', {});
                }
            }

            if (option.render) {
                if ($.isFunction(option.render)) {
                    option.render.call(layoutObj, panel, option)
                } else {
                    let cnt = $(option.render);
                    panel.append(cnt);
                    $.parser.parse(cnt);
                }
            }

            layoutObj.layout('expand', region);

        }
    }
}

$.docker.driver = {
    network:{
        list:[],
        setMap:function(list){
            let map = [];

            if(!$.extends.isEmpty(list)){
                $.each(list, function (idx, v) {
                    map.push(v);
                })

                $.docker.driver.network.list = map;
            }
        },
        getNetworkObjectList:function(){
            let map = [];

            $.each($.docker.driver.network.list, function (idx, v) {
                map.push({
                    KEY:v,
                    TEXT:v,
                });
            })

            return map;
        },
        getNetworkOpts:function(){
            let map = [];
            map.push({
                KEY:'',
                TEXT:'所有'
            })

            $.each($.docker.driver.network.list, function (idx, v) {
                map.push({
                    KEY:v,
                    TEXT:v,
                });
            })

            return map;
        }
    }
}

$.docker.utils.initVersion()

let NONE = "<none>"
let DEFAULT_TAG = "latest"

let networkMap = {};
let networkList = [];

function getNetworkName(id){
    if($.extends.isEmpty(networkMap[id])){
        return "";
    }

    return networkMap[id].Name;
}

function getNetWorkList(){
    return networkList;
}

function setNetworkMap(fn, node){
    $.docker.request.network.all(function(all){

        networkMap = {};
        networkList = [];

        $.each(all.list, function (idx, v) {
            networkMap[v.ID] = v;
            networkList.push({KEY:v.Id, TEXT:v.Name, data:v});
        });

        if(fn){
            fn.call(all, networkMap, networkList);
        }

    }, node);
}

function networksFormatter(value, row, index){
    if($.extends.isEmpty(value)){
        let ns = [];
        $.each(row.Spec.TaskTemplate.Networks, function (idx, v){
            if($.extends.isEmpty(getNetworkName(v.Target))){
                ns.push(v.Target);
            }else{
                ns.push(networkMap[v.Target].Name);
            }
        })
        return ns.join(";")
    }else{
        return value;
    }
}

function addTabPanel(tabs, options, html, fn){
    let title = options.title;
    let tabObj = tabs;
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

function refreshUsages(){
    let node = local_node;
    $.docker.request.usages(node, function (data) {
        data = data.data
        if(data.cpu && data.cpu.length > 0){
            $('.cpu-usages').attr('style','width:'+(data.cpu[0]/1).toFixed(2)+'%')
            $('.cpu-usages-value').text((data.cpu[0]/1).toFixed(2)+'%')
        }
        if(data.disk) {
            $('.disk-usages').attr('style', 'width:'+((data.disk.used*100/data.disk.total).toFixed(2))+'%')
            $('.disk-usages-value').text(((data.disk.used*100/data.disk.total).toFixed(2))+'%')
        }
        if(data.memory) {
            $('.memory-usages').attr('style', 'width:'+((data.memory.used*100/data.memory.total).toFixed(2))+'%')
            $('.memory-usages-value').text(((data.memory.used*100/data.memory.total).toFixed(2))+'%')
        }
    }, true);
}

function createTerminate(target, onKey, rows, cols){
    rows = rows || 36;
    cols = cols || 80;
    let term ;
    term = new Terminal({

        rendererType: "canvas", //渲染类型
        convertEol: true, //启用时，光标将设置为下一行的开头
        scrollback: 100, //终端中的回滚量
        disableStdin: false, //是否应禁用输入。
        cursorStyle: "underline", //光标样式
        cursorBlink: true, //光标闪烁
        cols: cols,
        rows: rows,

        theme: {
            foreground: "#14e264", //字体
            background: "#002833", //背景色
            cursor: "help", //设置光标
            lineHeight: 16
        },
        bellStyle:'sound',
        rightClickSelectsWord:true,
        screenReaderMode:true,
        allowProposedApi: true,
        LogLevel: 'debug',
        tabStopWidth: 4,
    });

    term.onKey((event) => {
        if(onKey){
            onKey.call(term, event.key, event.domEvent)
        }
    });

    term.open(target);

    //term.open(document.getElementById('container-terminal'));
    term.writeln('Welcome to web-console of docker.ui');
    term.writeln('This is a local terminal emulation, without a real terminal in the back-end.');
    term.writeln('Type some keys and commands to play around. Press the key "ctrl-Z" to exit the console');

    term.focus()

    return term
}