var property={
    initLabelText: "在线流程图",
    width1:1200,
    heigh1t:600,
    toolBtns:["start","end","task","node","chat","state","plug","join","fork","complex"],
    haveHead:true,
    headBtns:["new","open","save","undo","redo","reload"],//如果haveHead=true，则定义HEAD区的按钮
    haveTool:true,
    haveGroup:true,
    useOperStack:true
};
var remark={
    cursor:"选择指针",
    direct:"转换连线",
    start:"开始结点",
    end:"结束结点",
    task:"任务结点",
    node:"自动结点",
    chat:"决策结点",
    state:"状态结点",
    plug:"附加插件",
    join:"联合结点",
    fork:"分支结点",
    complex:"复合结点",
    group:"组织划分框编辑开关"
};
var process;
$(document).ready(function(){
    process=$.createGooFlow($("#process"),property);
    process.setNodeRemarks(remark);
});
function Export(){
    document.getElementById("result").value=JSON.stringify(process.exportData());
}