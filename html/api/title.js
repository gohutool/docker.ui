
function refreshImageAndContainerInfo(){
    $.docker.request.info(local_node, function (data) {
        let d = {};
        d.info = $.extend({}, data);

        window.parent.$('.title-image').text(d.info.Images)
        window.parent.$('.title-container').text(d.info.ContainersRunning)
        window.parent.$('.title-container2').text(d.info.Containers)

    }, true);
}

function refreshVolumeInfo(){
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