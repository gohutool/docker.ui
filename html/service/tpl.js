let service_panel_footer_html = `
        {{if updated}}
        <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                updateTags('{{>ID}}', true);
            },
            btnCls: 'cubeui-btn-slateblue',
            iconCls: 'fa fa-tags'
        }">编辑元数据</a>
        
        <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                removeLease('{{>ID}}', true);
            },
            btnCls: 'cubeui-btn-orange',
            iconCls: 'fa fa-times'
        }">删除</a>
        {{else}}
        <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
                onClick:function(){
                    saveService();
                },
                extend: '#servicesDg-toolbar',
                btnCls: 'cubeui-btn-ivory',
                iconCls: 'fa fa-spinner'
            }">创建</a>
        {{/if}}
<!--        <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
                onClick:function(){
                    promoteLease('{{>ID}}', true);
                },
                extend: '#servicesDg-toolbar',
                btnCls: 'cubeui-btn-ivory',
                iconCls: 'fa fa-hand-o-up'
            }">提升管理节点</a>
        <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                    demoteLease('{{>ID}}', true);
            },
            btnCls: 'cubeui-btn-blue',
            iconCls: 'fa fa-hand-o-down'
        }">降级工作节点</a>-->
         <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                    $('#layout').layout('collapse', 'east');
            },
            btnCls: 'cubeui-btn-red',
            iconCls: 'fa fa-close'
        }">关闭</a>
`;