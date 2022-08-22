
var logsMap = {};
function closeEvent(taskId){
    let logsObj = logsMap[taskId]
    if(logsObj){
        console.log("Close " + taskId + " log event.")
        try{
            logsObj.xhr.abort()
        }catch (e) {
            console.log(e)
        }
    }
    return logsObj;
}


function logService(serviceId){
    let eventFn = function(dialogId){
        return function(row){
            let node = local_node;
            let xhr = $.docker.request.service.log(node, serviceId, function (chunk, state, xhr) {
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
                closeEvent(serviceId)
            })

            if(xhr){
                logsMap[serviceId] = {
                    dialogId:dialogId,
                    xhr:xhr
                }
            }
        }
    }

    if(logsMap[serviceId]){
        let dialogId = logsMap[serviceId].dialogId;

        try{
            logsMap[serviceId].xhr.abort()
            $('#'+logsMap[serviceId].dialogId).iDialog('restore');
            let panel = $($('#'+dialogId).dialog('panel'))
            panel.find('.container-logs').empty();
            eventFn(dialogId)()
        }catch (e){
            console.log('start log error')
            console.log(e)
        }

    }else{
        let dialogId = null;
        dialogId = Math.uuid()

        $.iDialog.openDialog({
            id:dialogId,
            title: '{0}-日志'.format(serviceId),
            minimizable:true,
            modal:false,
            objectId:serviceId,
            width: 1050,
            height: 700,
            href:contextpath+'/logs/service-logs.html',
            render:function(opts, handler){
                handler.render({});
                eventFn(dialogId)();
            },
            onBeforeClose:function(){
                let option = $(this).dialog('options');
                let objectId = option.objectId;
                closeEvent(objectId);
                delete logsMap[objectId]
            },
            buttonsGroup: [{
                text: '清除',
                iconCls: 'fa fa-plus-square-o',
                btnCls: 'cubeui-btn-orange',
                handler:function(){
                    alert(1)
                }
            }]
        })
    }
}

function logTask(taskId){
    let eventFn = function(dialogId){
        return function(row){
            let node = local_node;
            let xhr = $.docker.request.task.log(node, taskId, function (chunk, state, xhr) {
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
                closeEvent(taskId)
            })

            if(xhr){
                logsMap[taskId] = {
                    dialogId:dialogId,
                    xhr:xhr
                }
            }
        }
    }

    if(logsMap[taskId]){
        let dialogId = logsMap[taskId].dialogId;

        try{
            logsMap[taskId].xhr.abort()
            $('#'+logsMap[taskId].dialogId).iDialog('restore');
            let panel = $($('#'+dialogId).dialog('panel'))
            panel.find('.container-logs').empty();
            eventFn(dialogId)()
        }catch (e){
            console.log('start log error')
            console.log(e)
        }

    }else{
        let dialogId = null;
        dialogId = Math.uuid()

        $.iDialog.openDialog({
            id:dialogId,
            title: '{0}-日志'.format(taskId),
            minimizable:true,
            modal:false,
            objectId:taskId,
            width: 1050,
            height: 700,
            href:contextpath+'/logs/service-logs.html',
            render:function(opts, handler){
                handler.render({});
                eventFn(dialogId)();
            },
            onBeforeClose:function(){
                let option = $(this).dialog('options');
                let objectId = option.objectId;
                closeEvent(objectId);
                delete logsMap[objectId]
            },
            buttonsGroup: [{
                text: '清除',
                iconCls: 'fa fa-plus-square-o',
                btnCls: 'cubeui-btn-orange',
                handler:function(){
                    alert(1)
                }
            }]
        })
    }
}