
let html_template = `
        <div data-toggle="cubeui-tabs" id='eastTabs'>
            <div title="容器信息"
                 data-options="id:'eastTab0',iconCls:'fa fa-headphones'">                 
                <div style="margin: 0px;">
                </div>
                
                <div class="cubeui-fluid">
                    <fieldset>
                        <legend>容器信息</legend>
                    </fieldset>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">NAME:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>Name}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">ID:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>ID}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Path:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Path" readonly
                                       value='{{>Path}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Entrypoint:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Entrypoint" readonly
                                       value='{{>Config.EntrypointStr}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Args:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>ArgStr}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">CreatAt:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>CreatAt}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Image:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>ImageName}} / {{>ImageID}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Restart Count:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{:RestartCount}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Port:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>Port}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">IP:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>IPStr}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">MAC:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>MACStr}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Platform:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>Platform}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                   
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Driver:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>Driver}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">SizeRootFs:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{:SizeRootFs}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">SizeRw:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{:SizeRw}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">StartAt:</label>
                            <div class="cubeui-input-block">
                                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{if Running==1}}{{>StartAt}}{{else}}未启动{{/if}}'
                                       data-options="
                                            "
                                >
                                
                            </div>
                        </div>
                    </div>
                   
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">LastFinish:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>FinishAt}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">ResolvConf:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>ResolvConfPath}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Hostname:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>HostnamePath}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Hosts:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>HostsPath}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Log:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>LogPath}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                </div>          
                 
            </div>
            <div title="宿主配置信息"
                 data-options="id:'eastTab1',iconCls:'fa fa-superpowers'">
                <div style="margin: 0px;">
                </div>
                
                <div class="cubeui-fluid">
                    <fieldset>
                        <legend>宿主配置</legend>
                    </fieldset>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">NAME:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>Name}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">ID:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>ID}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
						<!--
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Restart:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>HostConfig.RestartPolicy.Name}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
						-->
						<div class="cubeui-col-sm7">
                            <label class="cubeui-form-label" 
                            title="容器退出时要应用的行为。默认情况下不会重新启动。每次重新启动前都会增加一个不断增加的延迟（是之前延迟的两倍，从100ms开始），以防止服务器被淹没。">重新策略:</label>
                            <div class="cubeui-input-block">
                
                                <input readonly type="text" id='view_RestartPolicy' data-toggle="cubeui-combobox" name="RestartPolicy"
                                       value1='{{>HostConfig.RestartPolicy.Name}}'
                                       data-options="
                                       onClear:function(){
                                                $('#MaximumRetryCount').numberspinner('disable')
                                       },
                                       onSelect:function(record){
                                            if(record && record.KEY == 'on-failure'){
                                                $('#MaximumRetryCount').numberspinner('enable')
                                            }else{
                                                $('#MaximumRetryCount').numberspinner('disable')
                                            }
                                       },                                                                              
                                       prompt:'容器退出时要应用的行为。默认为不重新启动',
                                       required:false,
                                       valueField:'KEY',
                                       textField:'TEXT',
                                       data:[{'KEY':'no','TEXT':'不重新启动'},{'KEY':'always','TEXT':'始终重新启动'},
                                       {'KEY':'unless-stopped','TEXT':'除非用户手动停止容器，否则始终重新启动'},
                                       {'KEY':'on-failure','TEXT':'仅当容器退出代码为非零时重新启动; 同时设置最大重试次数'}]
                                            "
                                >
                            </div>
                        </div>                        
                        <div class="cubeui-col-sm4">
                            <label class="cubeui-form-label">最大重试次数:</label>
                            <div class="cubeui-input-block">
                                <input readonly type="text" id='MaximumRetryCount' data-toggle="cubeui-numberspinner" name="MaximumRetryCount"
                                       value='{{:HostConfig.RestartPolicy.MaximumRetryCount}}'
                                       data-options="     
                                       disabled:true,                                   
                                       prompt:'仅当容器退出代码为非零时重新启动。最大重试次数',                                                                   
                                       min:0,
                                       max:10000000,                                       
                                       required:false"
                                >
                            </div>
                        </div>                        
                        <div class="cubeui-col-sm1">						
							<a  href="javascript:void(0)" id='update_restart_policy_btn' data-toggle='cubeui-menubutton' data-options="{
								onClick:function(){
										updateRestartPolicy(this, '{{:ID}}');
								},
								btnCls: 'cubeui-btn-blue',
								iconCls: 'fa fa-pencil-square-o'
							}">修改</a>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Privileged:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>HostConfig.Privileged}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Maximum Retry:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:HostConfig.RestartPolicy.MaximumRetryCount}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">ShmSize:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:HostConfig.ShmSizeStr}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">AutoRemove:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:HostConfig.AutoRemove}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Container:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Driver" readonly
                                       value='{{>Container}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Image:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>Config.Image}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Hostname:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>Config.Hostname}}'
                                       data-options="
                                            ">
                            </div>
                        </div>
                    </div>
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Domainname:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>Config.Domainname}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">User:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>Config.User}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm6">
                            <label class="cubeui-form-label">AttachStdin:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:Config.AttachStdin}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                        <div class="cubeui-col-sm6">
                            <label class="cubeui-form-label">AttachStdout:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:Config.AttachStdout}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm6">
                            <label class="cubeui-form-label">AttachStderr:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:Config.AttachStderr}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                        <div class="cubeui-col-sm6">
                            <label class="cubeui-form-label">Tty:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:Config.Tty}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm6">
                            <label class="cubeui-form-label">OpenStdin:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:Config.OpenStdin}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                        <div class="cubeui-col-sm6">
                            <label class="cubeui-form-label">StdinOnce:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:Config.StdinOnce}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">WorkingDir:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>Config.WorkingDir}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <fieldset>
                        <legend style="margin-bottom: 0px;">Env</legend>
                    </fieldset>
                
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            {{for Config.EnvList}}
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm10 cubeui-col-sm-offset1">
                                    <span style='line-height: 20px;padding-right:0px;'>{{:value}}</span>
                                </div>
                            </div>
                            {{/for}}
                        </div>
                    </div>
                    <!--
                    <fieldset>
                        <legend style="margin-bottom: 0px;">Cmd</legend>
                    </fieldset>
                
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm10 cubeui-col-sm-offset1">
                            <div class="cubeui-row">
                                <span style='line-height: 20px;padding-right:0px;'>{{:Config.CmdStr}}</span>
                            </div>
                        </div>
                    </div>
					-->
                    <!--
                    <fieldset>
                        <legend style="margin-bottom: 0px;">Entrypoint</legend>
                    </fieldset>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            {{for Config.EntrypointList}}
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm10 cubeui-col-sm-offset1">
                                    <span style='line-height: 20px;padding-right:0px;'>{{:value}}</span>
                                </div>
                            </div>
                            {{/for}}
                        </div>
                    </div>
                    -->
                    <fieldset>
                        <legend style="margin-bottom: 0px;">Volume</legend>
                    </fieldset>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <div class="cubeui-row" style="margin-top: 0px;">
                                <div class="cubeui-col-sm4 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <span style='line-height: 20px;padding-right:0px;'>源数据卷</span>
                                </div>
                                <div class="cubeui-col-sm5" >
                                    <span style='line-height: 20px;padding-right:0px;'>目标</span>
                                </div>
                            </div>
                            {{if Mounts}}
                            {{for Mounts}}
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm4 cubeui-col-sm-offset1">
                                    <span style='line-height: 20px;padding-right:0px;'>{{:Source}}{{if RW}}(RW){{/if}}</span>
                                </div>
                                <div class="cubeui-col-sm5" >
                                    <span style='line-height: 20px;padding-right:0px;'>{{:Destination}}</span>
                                </div>
                            </div>
                            {{/for}}
                            {{/if}}
                        </div>
                    </div>
                    
                    
                    <fieldset>
                        <legend style="margin-bottom: 0px;">PortBindings</legend>
                    </fieldset>
                    
                    {{if HostConfig.PublishAllPorts}}
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm10 cubeui-col-sm-offset1">
                            <div class="cubeui-row">
                                <span style='line-height: 20px;padding-right:0px;'>为容器的所有暴露端口分配临时主机端口</span>
                            </div>
                        </div>
                    </div>
                    {{else}}
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <div class="cubeui-row"  style="margin-top: 0px;">
                                <div class="cubeui-col-sm4 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <span style='line-height: 20px;padding-right:0px;'>端口</span>
                                </div>
                                <div class="cubeui-col-sm5" >
                                    <span style='line-height: 20px;padding-right:0px;'>Publish端口</span>
                                </div>
                            </div>
                            {{props HostConfig.BindingPortMap}}
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm4 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <span style='line-height: 20px;padding-right:0px;'>{{:key}}</span>
                                </div>
                                <div class="cubeui-col-sm5" >
                                    <span style='line-height: 20px;padding-right:0px;'>{{:prop}}</span>
                                </div>
                            </div>
                            {{/props}}
                        </div>
                    </div>
                    {{/if}}
                
                    <fieldset>
                        <legend style="margin-bottom: 0px;">标签选项</legend>
                    </fieldset>
                
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <div class="cubeui-row"  style="margin-top: 0px;">
                                <div class="cubeui-col-sm4 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <span style='line-height: 20px;padding-right:0px;'>标签</span>
                                </div>
                                <div class="cubeui-col-sm5" >
                                    <span style='line-height: 20px;padding-right:0px;'>值</span>
                                </div>
                            </div>
                            {{props Config.Labels}}
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm4 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <span style='line-height: 20px;padding-right:0px;'>{{>key}}</span>
                                    
                                </div>
                                <div class="cubeui-col-sm5">
                                    <span style='line-height: 20px;padding-right:0px;'>{{>prop}}</span>
                                </div>
                            </div>
                            {{/props}}
                        </div>
                    </div>
                    
                    
                    
                </div>
            </div>
            
            
            <div title="配置信息" 
                 data-options="id:'eastTab2',iconCls:'fa fa-gear'">
                <div style="margin: 0px;">
                </div>
                
                <div class="cubeui-fluid">
                    <fieldset>
                        <legend>构建信息</legend>
                    </fieldset>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">NAME:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>Name}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">ID:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>Id}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Image:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>Config.Image}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Hostname:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>Config.Hostname}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Domainname:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>Config.Domainname}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">User:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>Config.User}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm6">
                            <label class="cubeui-form-label">AttachStdin:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:Config.AttachStdin}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                        <div class="cubeui-col-sm6">
                            <label class="cubeui-form-label">AttachStdout:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:Config.AttachStdout}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm6">
                            <label class="cubeui-form-label">AttachStderr:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:Config.AttachStderr}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                        <div class="cubeui-col-sm6">
                            <label class="cubeui-form-label">Tty:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:Config.Tty}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm6">
                            <label class="cubeui-form-label">OpenStdin:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:Config.OpenStdin}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                        <div class="cubeui-col-sm6">
                            <label class="cubeui-form-label">StdinOnce:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:Config.StdinOnce}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm6">
                            <label class="cubeui-form-label">StopSignal:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:Config.StopSignal}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                        <div class="cubeui-col-sm6">
                            <label class="cubeui-form-label">Runtime:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{:HostConfig.Runtime}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">WorkingDir:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>Config.WorkingDir}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Cmd:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>Config.CmdStr}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">Entrypoint:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name" readonly
                                       value='{{>Config.EntrypointStr}}'
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <fieldset>
                        <legend style="margin-bottom: 0px;">Env</legend>
                    </fieldset>
                
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            {{for Config.EnvList}}
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm10 cubeui-col-sm-offset1">
                                    <span style='line-height: 20px;padding-right:0px;'>{{:value}}</span>
                                </div>
                            </div>
                            {{/for}}
                        </div>
                    </div>
					
                    <!--
                    <fieldset>
                        <legend style="margin-bottom: 0px;">Cmd</legend>
                    </fieldset>
                
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm10 cubeui-col-sm-offset1">
                            <div class="cubeui-row">
                                <span style='line-height: 20px;padding-right:0px;'>{{:Config.CmdStr}}</span>
                            </div>
                        </div>
                    </div>
                    
                    <fieldset>
                        <legend style="margin-bottom: 0px;">Entrypoint</legend>
                    </fieldset>
                    
                     <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            {{for Config.EntrypointList}}
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm10 cubeui-col-sm-offset1">
                                    <span style='line-height: 20px;padding-right:0px;'>{{:value}}</span>
                                </div>
                            </div>
                            {{/for}}
                        </div>
                    </div>
                    -->
					
                    <fieldset>
                        <legend style="margin-bottom: 0px;">Volume</legend>
                    </fieldset>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <div class="cubeui-row" style="margin-top: 0px;">
                                <div class="cubeui-col-sm4 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <span style='line-height: 20px;padding-right:0px;'>源数据卷</span>
                                </div>
                                <div class="cubeui-col-sm5" >
                                    <span style='line-height: 20px;padding-right:0px;'>目标</span>
                                </div>
                            </div>
                            {{if Mounts}}
                            {{for Mounts}}
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm4 cubeui-col-sm-offset1">
                                    <span style='line-height: 20px;padding-right:0px;'>{{:Source}}{{if RW}}(RW){{/if}}</span>
                                </div>
                                <div class="cubeui-col-sm5" >
                                    <span style='line-height: 20px;padding-right:0px;'>{{:Destination}}</span>
                                </div>
                            </div>
                            {{/for}}
                            {{/if}}
                        </div>
                    </div>
                    
                    <fieldset>
                        <legend style="margin-bottom: 0px;">Port</legend>
                    </fieldset>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <div class="cubeui-row"  style="margin-top: 0px;">
                                <div class="cubeui-col-sm4 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <span style='line-height: 20px;padding-right:0px;'>端口</span>
                                </div>
                                <div class="cubeui-col-sm5" >
                                    <span style='line-height: 20px;padding-right:0px;'>Publish端口</span>
                                </div>
                            </div>
                            {{props PortMap}}
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm4 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <span style='line-height: 20px;padding-right:0px;'>{{:key}}</span>
                                </div>
                                <div class="cubeui-col-sm5" >
                                    <span style='line-height: 20px;padding-right:0px;'>{{:prop}}</span>
                                </div>
                            </div>
                            {{/props}}
                        </div>
                    </div>
                    
                    <fieldset>
                        <legend style="margin-bottom: 0px;">标签选项</legend>
                    </fieldset>
                
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <div class="cubeui-row"  style="margin-top: 0px;">
                                <div class="cubeui-col-sm4 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <span style='line-height: 20px;padding-right:0px;'>标签</span>
                                </div>
                                <div class="cubeui-col-sm5" >
                                    <span style='line-height: 20px;padding-right:0px;'>值</span>
                                </div>
                            </div>
                            {{props Config.Labels}}
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm4 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <span style='line-height: 20px;padding-right:0px;'>{{>key}}</span>
                                </div>
                                <div class="cubeui-col-sm5">
                                    <span style='line-height: 20px;padding-right:0px;'>{{>prop}}</span>
                                </div>
                            </div>
                            {{/props}}
                        </div>
                    </div>
                    
                    
                    <fieldset>
                        <legend style="margin-bottom: 0px;">启动命令</legend>
                    </fieldset>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <div class="cubeui-row"  style="margin-top: 0px;">
                                <div class="cubeui-col-sm10 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <span style='line-height: 20px;padding-right:0px;'>{{:CmdLine}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>                
            </div>
            
            
            
            <div title="Json" 
             data-options="id:'eastTab_4',iconCls:'fa fa-text-width',fit:true, border:false">                   
                <div style="margin: 10px;">
                </div>
                
                <div class="cubeui-fluid">
                
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <div id="json" style="word-break:break-all!important;"></div>
                        </div>
                    </div>
                                       
                </div>
            </div>    
            
            
            <!--<div title="Console" 
             data-options="id:'eastTab_5',iconCls:'fa fa-text-width',fit:true, border:false">                   
                <div class="cubeui-col-sm12 container-termina-body">
                            <div id="container-terminal" sytle="width:99%;"></div>
                        </div>
            </div>   -->
                        
        </div>
        
`

let panel_buttons_html = `

        <a  href="javascript:void(0)" id='tab_start_btn' data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                    startContainer('{0}');
            },
            btnCls: 'cubeui-btn-yellowgreen',
            iconCls: 'fa fa-play-circle'
        }">启动</a>
           
        <a  href="javascript:void(0)"  id='tab_stop_btn'  data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                    stopContainer('{0}');
            },
            btnCls: 'cubeui-btn-brown',
            iconCls: 'fa fa-stop-circle'
        }">停止</a>        
        <a  href="javascript:void(0)"  id='tab_stop_btn'  data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                    exportContainer('{0}');
            },
            btnCls: 'cubeui-btn-silver',
            iconCls: 'fa fa-sign-out'
        }">导出</a>   
        <a  href="javascript:void(0)"  id='tab_stop_btn'  data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                    cloneContainer('{0}');
            },
            btnCls: 'cubeui-btn-pink',
            iconCls: 'fa fa-clone'
        }">克隆</a>   
        <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                    showLogTab('{0}')
            },
            btnCls: 'cubeui-btn-blue',
            iconCls: 'fa fa-history'
        }">日志</a>       
        <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                    showChangesTab('{0}')
            },
            btnCls: 'cubeui-btn-navy',
            iconCls: 'fa fa-random'
        }">变更</a>        
        <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                    showProcess('{0}')
            },
            btnCls: 'cubeui-btn-orange',
            iconCls: 'fa fa-spinner'
        }">进程</a>
        <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                    showUsage('{0}')
            },
            btnCls: 'cubeui-btn-yellowgreen',
            iconCls: 'fa fa-thermometer-half'
        }">状况</a>
        <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                    showExportFile('{0}')
            },
            btnCls: 'cubeui-btn-limegreen',
            iconCls: 'fa fa-sign-out'
        }">归档文件</a>
        <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                    showImportFile('{0}')
            },
            btnCls: 'cubeui-btn-dodgerblue',
            iconCls: 'fa fa-sign-in'
        }">导入文件</a>
        <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                    showConsolePanel('{0}')
            },
            btnCls: 'cubeui-btn-DeepSkyBlue',
            iconCls: 'fa fa-terminal'
        }">控制台</a>
        <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                    lsContainer('{0}')
            },
            btnCls: 'cubeui-btn-BrightGold',
            iconCls: 'fa fa-clone'
        }">文件系统</a>
         <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                    $('#layout').layout('collapse', 'east');
            },
            btnCls: 'cubeui-btn-red',
            iconCls: 'fa fa-close'
        }">关闭</a>
`;

let processes_tab_html = `
        <!-- 表格工具栏开始 -->
        <div id="processesDg-toolbar" class="cubeui-toolbar"
             data-options="grid:{
                   type:'datagrid',
                   id:'processesDg'
               }">

            <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
                    onClick:function(){
                        pauseLease('{0}');
                    },
                    extend: '#processesDg-toolbar',
                    btnCls: 'cubeui-btn-orange',
                    iconCls: 'fa fa-pause-circle-o'
                }">暂停进程</a>
                
                
            <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
                    onClick:function(){
                        resumeLease('{0}');
                    },
                    extend: '#processesDg-toolbar',
                    btnCls: 'cubeui-btn-blue',
                    iconCls: 'fa fa-play-circle-o'
                }">恢复进程</a>
            <form class="search-box">    
            
                <span style='line-height: 30px;padding-right:0px'>显示格式：</span>
                <input type="text" value="aux" data-toggle="cubeui-combobox"
                       data-options="
                                width:220,
                                required:true,prompt:'结果显示格式，选择填写，默认aux',
                                valueField:'KEY',
                                onSelect:function(record){
                                    try{
                                        let param = $.extend({}, $('#processesDg').datagrid('options').queryParams);
                                        param.ARGS = record.KEY;
                                        $('#processesDg').datagrid('reload', param);
                                    }catch(e){
                                    }
                                },
                                textField:'TEXT',
                                data:[{'KEY':'aux','TEXT':'aux'},{'KEY':'-ef','TEXT':'-ef'}]
                       ">
            </form>
        </div>
        <!-- 表格工具栏结束 -->
        
    <table id="processesDg"></table>
`;

let changes_tab_html = `
        <!-- 表格工具栏开始 -->
        <div id="changesDg-toolbar" class="cubeui-toolbar"
             data-options="grid:{
                   type:'datagrid',
                   id:'changesDg'
               }">
                
            <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
                    onClick:function(){
                        $('#changesDg').datagrid('reload');
                    },
                    extend: '#changesDg-toolbar',
                    btnCls: 'cubeui-btn-orange',
                    iconCls: 'fa fa-refresh'
                }">刷新</a>
        
            <form id="changes_queryForm" class="search-box">            
                <input type="text" id='path_key' name="path_key" data-toggle="cubeui-textbox"
                       data-options="onClear:function(){                        
                            $('#changes_searchbtn').trigger('click');
                       }, prompt:'查询条件；多条件逗号分隔；/etc/conf,/var/run',width:420">
                <a href="javascript:void(0)" id="changes_searchbtn"
                   data-toggle="cubeui-menubutton"
                   data-options="method:'query',
                   iconCls:'fa fa-search',
                   btnCls:'cubeui-btn-blue',
                   form:{id:'changes_queryForm'},
                   grid:{type:'datagrid','id':'changesDg'}">查询</a>
            </form>
        </div>
        <!-- 表格工具栏结束 -->
            
    <table id="changesDg"></table>
`;

let usage_tab_html = `

                <!--  COL 8 -->
                <div class="layui-row">
                    <div class="layui-col">
                        <div class="card card-hoverable">
                            <div class="card-head">
                                <span class="card-head-icon"><i class="fa fa-table icon"></i></span>
                                <span>资源使用率</span>
                                <span style='float: right;position: absolute;right: 20px;height: 48px;'></span>
                            </div>
                            <div class="card-body padding-card-body" >
                            
                                <div class="layui-row layui-col-space10">
                                    <div class="layui-col-md2">
                                        <div class="panel layui-bg-number">
                                            <div class="panel-body">
                                                <div class="panel-title">
                                                    <span class="label pull-right layui-bg-blue">实时</span>
                                                    <h5>CPU核数</h5>
                                                </div>
                                                <div class="panel-content">
                                                    <h1 class="no-margins"><t class="online_cpus">3</t>&nbsp;</h1>
                                                    <small>&nbsp;</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2">
                                        <div class="panel layui-bg-number">
                                            <div class="panel-body">
                                                <div class="panel-title">
                                                    <span class="label pull-right layui-bg-cyan">实时</span>
                                                    <h5>可用CPU</h5>
                                                </div>
                                                <div class="panel-content">
                                                    <h1 class="no-margins "><t class="system_cpu_delta"></t>&nbsp;</h1>
                                                    <small>&nbsp;</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
    
    
                                    <div class="layui-col-md2">
                                        <div class="panel layui-bg-number">
                                            <div class="panel-body">
                                                <div class="panel-title">
                                                    <span class="label pull-right layui-bg-orange">实时</span>
                                                    <h5>可用内存</h5>
                                                </div>
                                                <div class="panel-content">
                                                    <h1 class="no-margins "><t class="available_memory"></t>&nbsp;</h1>
                                                    <small>&nbsp;</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
    
                                    <div class="layui-col-md2">
                                        <div class="panel layui-bg-number">
                                            <div class="panel-body">
                                                <div class="panel-title">
                                                    <span class="label pull-right layui-bg-green">实时</span>
                                                    <h5>可用文件数</h5>
                                                </div>
                                                <div class="panel-content">
                                                    <h1 class="no-margins "><t class="limit"></t>&nbsp;</h1>
                                                    <small>&nbsp;</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="layui-col-md2">
                                        <div class="panel layui-bg-number">
                                            <div class="panel-body">
                                                <div class="panel-title">
                                                    <span class="label pull-right layui-bg-red">实时</span>
                                                    <h5>BLOCK IO</h5>
                                                </div>
                                                <div class="panel-content">
                                                    <h1 class="no-margins "><t class="blockio"></t>&nbsp;</h1>
                                                    <small>&nbsp;</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="layui-col-md2">
                                        <div class="panel layui-bg-number">
                                            <div class="panel-body">
                                                <div class="panel-title">
                                                    <span class="label pull-right layui-bg-black">实时</span>
                                                    <h5>NET IO</h5>
                                                </div>
                                                <div class="panel-content">
                                                    <h1 class="no-margins "><t class="netio"></t>&nbsp;</h1>
                                                    <small>&nbsp;</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
    
                                </div>
                            
                                <div class="layui-row layui-col-space10">
                                    <div class="layui-col-md12" style="padding:10px">
                                         <div class="nepadmin-pad-b20">
                                                <h2 class="nepadmin-pad-b10">
                                                  CPU使用率<span class="nepadmin-font-14 nepadmin-c-gray nepadmin-fr"><t class='cpu-usages-1'></t> / <t class='cpu-usages-value'>85%</t>（<t class='cpu-usages-value-2'>15</t><span class="layui-edge layui-edge-top cpu-usages-value-3" lay-tips="增长" lay-offset="-15"></span>）</span>
                                                </h2>
                                                <div class="layui-progress">
                                                  <div class="layui-progress-bar layui-bg-blue cpu-usages" style="width: 85%;"></div>
                                                </div>
                                          </div>
                                    </div>
                                    <div class="layui-col-md12" style="padding:10px">
                                          <div class="nepadmin-pad-b20">
                                                <h2 class="nepadmin-pad-b10">
                                                  内存占用率<span class="nepadmin-font-14 nepadmin-c-gray nepadmin-fr"><t class='memory-usages-1'></t> / <t class='memory-usages-value'>58%</t>（<t class='memory-usages-value-2'></t><span class="layui-edge layui-edge-bottom memory-usages-value-3" lay-tips="下降" lay-offset="-15"></span>）</span>
                                                </h2>
                                                <div class="layui-progress">
                                                  <div class="layui-progress-bar layui-bg-red  memory-usages" style="width: 58%;"></div>
                                                </div>
                                          </div>
                                    </div>
                                    <div class="layui-col-md12" style="padding:10px">
                                          <div class="nepadmin-pad-b20">
                                                <h2 class="nepadmin-pad-b10">
                                                  文件句柄使用率<span class="nepadmin-font-14 nepadmin-c-gray nepadmin-fr"><t class='pid-usages-1'></t> / <t class='pid-usages-value'>58%</t>（<t class='pid-usages-value-2'></t><span class="layui-edge layui-edge-bottom pid-usages-value-3" lay-tips="下降" lay-offset="-15"></span>）</span>
                                                </h2>
                                                <div class="layui-progress">
                                                  <div class="layui-progress-bar layui-bg-orange  pid-usages" style="width: 58%;"></div>
                                                </div>
                                          </div>
                                    </div>
                                    <div class="layui-row net-io-div">
                                    
                                        
                                        
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
`;

let log_tab_html = `
                <style>
                    .align-center {
                        text-align: center;
                    }
                    .margin-top-10{
                        margin-top: 10px;
                    }
                    .layui-container-fluid {
                        margin: 5px;
                    }
                    .table-label{
                        min-width: 90px!important;
                    }
                    .table-value{
                        word-break:break-all!important;
                    }
                </style>
                
                <div style="background-color: #f7f7f7;" class="cubeui-content-selectable">
                    <div class="layui-fluid">
                        <table class="layui-table" style="margin: 0px 0;">
                            <thead>
                            <tr>
                                <th colspan="6" style="text-align: center">{{:Name}} <t>{{if Running==1}}[已启动]{{else}}[已停止]{{/if}}</t> </th>
                            </tr>
                            </thead>
                            <tr>
                                <td class="table-label">LastFinishAt：</td>
                                <td >{{>FinishAt}}</td>
                                <td class="table-label"></td>
                                <td class="table-label"></td>
                            </tr>
                        </table>
                        <table class="layui-table" style="margin: 0px 0;">
                            <tr>
                                <td class="table-label" colspan="6" >
                                    <div class=" container-logs" style="min-height: 300px">
                                    </div>
                                </td>
                            </tr>
                        </table>
                
                    </div>
                </div>
`

let netio_div_html = `
                                    <div class="layui-col-md12" style="padding:10px">
                                              <div class="nepadmin-pad-b20">
                                                    <h2 class="nepadmin-pad-b10">
                                                      {0}<span class="nepadmin-font-14 nepadmin-c-gray nepadmin-fr"><t class='{1}-usages-1'></t> / <t class='{1}-usages-value'>58%</t>（<t class='{1}-usages-value-2'></t><span class="layui-edge layui-edge-bottom {1}-usages-value-3" lay-tips="下降" lay-offset="-15"></span>）</span>
                                                    </h2>
                                                    <div class="layui-progress">
                                                      <div class="layui-progress-bar layui-bg-green  {1}-usages" style="width: 58%;"></div>
                                                    </div>
                                              </div>
                                        </div>
`;


let create_container_html = `
<div data-toggle="cubeui-tabs" id='eastTabs'>
            <div title="容器信息"
                 data-options="id:'eastTab0',iconCls:'fa fa-headphones'">                 
                <div style="margin: 0px;">
                </div>
                <form id='createContainerForm'>
                <div class="cubeui-fluid">
                    <fieldset>
                        <legend>容器信息</legend>
                    </fieldset>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label" 
                            title="将指定的名称分配给容器。必须匹配/？[a-zA-Z0-9][a-zA-Z0-9_-]+">NAME:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Name"
                                        {{if Flag!='2'}}
                                       value='{{>Name}}'
                                       {{/if}}
                                       data-options="
                                       prompt:'将指定的名称分配给容器',
                                       required:false,
                                       ">
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label" 
                            title="创建容器时要使用的图像的名称（或引用），或创建容器时使用的图像的名称（或引用）。">IMAGE:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" data-toggle="cubeui-textbox" name="Image"
                                       value='{{>Image}}'
                                       data-options="                                       
                                       prompt:'创建容器时要使用的镜像的名称（或引用）',
                                       required:true,
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label" title="运行命令的工作目录">工作目录:</label>
                            <div class="cubeui-input-block">                
                                <input type="text" data-toggle="cubeui-textbox" name="WorkingDir"
                                       value='{{:Config.WorkingDir}}'
                                       data-options="                                       
                                       prompt:'运行命令的工作目录',
                                       required:false,
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm7">
                            <label class="cubeui-form-label" 
                            title="容器退出时要应用的行为。默认情况下不会重新启动。每次重新启动前都会增加一个不断增加的延迟（是之前延迟的两倍，从100ms开始），以防止服务器被淹没。">重新策略:</label>
                            <div class="cubeui-input-block">
                
                                <input type="text" id='create_RestartPolicy' data-toggle="cubeui-combobox" name="RestartPolicy"
                                       value=''
                                       data-options="
                                       onClear:function(){
                                                $('#MaximumRetryCount').numberspinner('disable')
                                       },
                                       onSelect:function(record){
                                            if(record && record.KEY == 'on-failure'){
                                                $('#MaximumRetryCount').numberspinner('enable')
                                            }else{
                                                $('#MaximumRetryCount').numberspinner('disable')
                                            }
                                       },                                                                              
                                       prompt:'容器退出时要应用的行为。默认为不重新启动',
                                       required:false,
                                       valueField:'KEY',
                                       textField:'TEXT',
                                       data:[{'KEY':'no','TEXT':'不重新启动'},{'KEY':'always','TEXT':'始终重新启动'},
                                       {'KEY':'unless-stopped','TEXT':'除非用户手动停止容器，否则始终重新启动'},
                                       {'KEY':'on-failure','TEXT':'仅当容器退出代码为非零时重新启动; 同时设置最大重试次数'}]
                                            "
                                >
                            </div>
                        </div>                        
                        <div class="cubeui-col-sm5">
                            <label class="cubeui-form-label">最大重试次数:</label>
                            <div class="cubeui-input-block">
                                <input type="text" id='MaximumRetryCount' data-toggle="cubeui-numberspinner" name="MaximumRetryCount"
                                       value='{{:HostConfig.RestartPolicy.MaximumRetryCount}}'
                                       data-options="     
                                       disabled:true,                                   
                                       prompt:'仅当容器退出代码为非零时重新启动。最大重试次数',                                                                   
                                       min:0,
                                       max:10000000,                                       
                                       required:false"
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label" title="用于容器的主机名，作为有效的RFC 1123主机名。">主机名:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Hostname"
                                       value='{{>Hostname}}'
                                       data-options="
                                       prompt:'用于容器的主机名，作为有效的RFC 1123主机名。',
                                       
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label" title="用于容器的域名。">容器域名:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Domainname"
                                       value='{{>Domainname}}'
                                       data-options="
                                       prompt:'用于容器的域名。',
                                       
                                            "
                                >
                            </div>
                        </div>
                    </div>
                
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label" title="在容器内运行命令的用户。">用户:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="User"
                                       value='{{>User}}'
                                       data-options="
                                       prompt:'在容器内运行命令的用户。',
                                       
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label" title="用于此容器的网络模式。支持的标准值为：: bridge, host, none, and container:：<name | id>。任何其他值都被视为此容器应连接到的自定义网络的名称。">网络模式:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="HostConfig.NetworkMode"
                                       value='{{>HostConfig.NetworkMode}}'
                                       data-options="
                                       prompt:'用于此容器的网络模式。bridge, host, none, and container:：<name | id>, 其他值都被视为此容器应连接到的自定义网络',
                                       
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm3">
                            <label class="cubeui-form-label" title="禁用容器的网络">禁用容器网络:</label>
                            <div class="cubeui-input-block">
                                <input data-toggle="cubeui-switchbutton" 
                                    name="NetworkDisabled" value="1" data-options="onText:'',offText:'',width:60">
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm3">
                            <label class="cubeui-form-label" title="当容器的进程退出时自动删除容器。如果设置了RestartPolicy，则此操作无效。">自动删除:</label>
                            <div class="cubeui-input-block">
                                <input data-toggle="cubeui-switchbutton" 
                                {{if HostConfig.AutoRemove}}checked{{/if}} 
                                    name="AutoRemove" value="1" data-options="onText:'',offText:'',width:60">
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm3">
                            <label class="cubeui-form-label" title="授予容器对主机的完全访问权限">授予完全权限:</label>
                            <div class="cubeui-input-block">
                                <input data-toggle="cubeui-switchbutton" 
                                {{if HostConfig.Privileged}}checked{{/if}} 
                                    name="Privileged" value="1" data-options="onText:'',offText:'',width:60">
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label" title="容器运行命令">容器运行命令:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Cmd"
                                       value='{{>Config.CmdStr}}'
                                       data-options="
                                       prompt:'容器运行命令',
                                       
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label"  title="如果由空字符串组成，则入口点重置为系统默认值（即docker在Dockerfile中没有入口点指令时使用的入口点）。">容器入口点:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Entrypoint"
                                       value='{{>Config.EntrypointStr}}'
                                       data-options="
                                       prompt:'如果由空字符串组成，则入口点重置为系统默认值（即docker在Dockerfile中没有入口点指令时使用的入口点）',
                                            "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <fieldset  style="margin-top: 20px!important;margin-bottom1: 10px;" title="指定用于根据此规范创建的任务的日志驱动程序。如果不存在，则将使用swarm的默认驱动程序，如果未指定，则最终返回到引擎默认驱动程序。">
                        <legend style="margin-bottom: 0px;">日志驱动</legend>
                    </fieldset>
        
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm6" style="margin-top: 2px">
                            <label class="cubeui-form-label" title="创建的任务的日志驱动程序">Log Driver:</label>
                            <div class="cubeui-input-block">
                                <input type="text" name="HostConfig.LogConfig.Type" 
                                value="{{>HostConfig.LogConfig.Type}}" data-toggle="cubeui-combobox"
                                       data-options="
                                        required:false,
                                        prompt:'创建的任务的日志驱动程序，默认为swarm的默认驱动程序',
                                        valueField:'KEY',
                                        textField:'TEXT',
                                        data:$.docker.utils.getLocalLog()
                               ">
                            </div>
                        </div>
                    </div>
        
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12 add-opt-div">
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm5 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <span style='line-height: 20px;padding-right:0px;'>配置项</span>
                                </div>
                                <div class="cubeui-col-sm5" >
                                    <span style='line-height: 20px;padding-right:0px;'>配置值</span>
                                </div>
                                <div class="cubeui-col-sm1" style="text-align: center">
                                            <span style='line-height: 20px;padding-right:0px;'>
                                                <span onClick="$.docker.utils.ui.addLogOpts(this, 'cnt-log-driver')"  class="ops-fa-icon fa fa-plus" style="font-size:14px!important;">&nbsp;</span>
                                            </span>
                                </div>
                                
                                {{if HostConfig.LogConfig.Config}}
                                {{props HostConfig.LogConfig.Config}}
                                <div class="cubeui-row">
                                    <div class="cubeui-col-sm5 cubeui-col-sm-offset1" style="padding-right: 5px">
                                        <input type="text" data-toggle="cubeui-textbox" value="{1}"
                                               name='cnt-log-driver-name' data-options="required:false,prompt:'日志驱动配置项，比如：max-log-count '">
                                    </div>
                                    <div class="cubeui-col-sm5">
                                        <input type="text" data-toggle="cubeui-textbox" value="{2}"
                                               name='cnt-log-driver-value' data-options="required:false,prompt:'日志驱动配置值，比如：10 '">
                                    </div>
                                    <div class="cubeui-col-sm1" style="text-align: center">
                                        <span style='line-height: 30px;padding-right:0px;'><span onClick="$.docker.utils.ui.removeOpt(this)"  class="ops-fa-icon fa fa-close" style="font-size:14px!important;">&nbsp;</span></span>
                                    </div>
                                </div>   
                                {{/props}}
                                {{/if}}
                            </div>
                        </div>
                    </div>
                    
                    <fieldset  style="margin-top: 20px!important;margin-bottom1: 10px;" title="健康测试策略(用于检查容器是否健康的测试)">
                        <legend style="margin-bottom: 10px;">健康测试策略(用于检查容器是否健康的测试)</legend>
                    </fieldset>
        
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12" style="margin-top: 2px">
                            <label class="cubeui-form-label" title="要执行的测试。可能的值为:空值从映像或父映像继承healthcheck; NONE禁用healthcheck;
                                    CMD args直接执行参数;CMD-SHELL command使用系统的默认SHELL运行命令">Test:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="Healthcheck.Test"
                                       value='{{>Healthcheck.Test}}'
                                       data-options="
                                               prompt:'要执行的测试。可能的值为:为空从映像或父映像继承healthcheck; NONE禁用healthcheck;CMD args直接执行参数;CMD-SHELL command使用系统的默认SHELL运行命令；使用空格分隔'
                                                    "
                                >
                            </div>
                        </div>
                        <div class="cubeui-col-sm6" style="margin-top: 2px">
                            <label class="cubeui-form-label" title="检查之间的等待时间（纳秒）。它应为0或至少1000000（1毫秒）。
                                    0表示继承。">Interval(ns):</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-numberspinner" name="Healthcheck.Interval"
                                       value='{{>Healthcheck.Interval}}'
                                       data-options="
                                       prompt:'检查之间的等待时间（纳秒）。它应为0或至少1000000（1毫秒）。0表示继承。',
                                       min:0
                                                    "
                                >
                            </div>
                        </div>
                        <div class="cubeui-col-sm6" style="margin-top: 2px">
                            <label class="cubeui-form-label" title="在检查认为为已挂时的等待时间。
                                    它应为0或至少1000000（1毫秒）。0表示继承。">Timeout(ns):</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-numberspinner" name="Healthcheck.Timeout"
                                       value='{{>Healthcheck.Timeout}}'
                                       data-options="
                                       prompt:'在检查认为为已挂时的等待时间。它应为0或至少1000000（1毫秒）。0表示继承。',
                                       min:0
                                                    "
                                >
                            </div>
                        </div>
                        <div class="cubeui-col-sm6" style="margin-top: 2px">
                            <label class="cubeui-form-label" title="认为容器不健康所需的连续故障数。
                                    0表示继承。">Retries:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-numberspinner" name="Healthcheck.HealthCheck."
                                       value='{{>Healthcheck.Retries}}'
                                       data-options="
                                       prompt:'认为容器不健康所需的连续故障数。0表示继承。',
                                       min:0
                                                    "
                                >
                            </div>
                        </div>
                        <div class="cubeui-col-sm6" style="margin-top: 2px">
                            <label class="cubeui-form-label" title="容器初始化后开始运行健康检查的开始时间（纳秒）。
                                    它应为0或至少1000000（1毫秒）。0表示继承。">StartPeriod(ns):</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-numberspinner" name="Healthcheck.StartPeriod"
                                       value='{{>Healthcheck.StartPeriod}}'
                                       data-options="
                                       prompt:'容器初始化后开始运行健康检查的开始时间（纳秒）',
                                       min:0
                                                    "
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div style="padding-top: 10px;" class="cubeui-row" title="容器端口到主机端口的映射，使用容器的端口号和协议作为密钥，格式为<port>/<protocol>，例如80/udp。如果为多个协议映射了容器的端口，则会向映射表中添加单独的条目。">
                        <fieldset >
                            <legend style="margin-bottom: 0px;">
                            容器端口发布到主机
                                        <span style='line-height: 20px;padding-right:0px'><b>&nbsp;&nbsp;&nbsp;&nbsp;分配临时主机端口</b></span>
                                     <input data-toggle="cubeui-checkbox"
                                     
                                {{if HostConfig.PublishAllPorts}}checked{{/if}} 
                                      
                                     name="PublishAllPorts" value="1" label="" data-options="
                                         onChange:function(checked){
                                            if(checked){
                                                $('#publish-ports-div input').disable();
                                                $('#publish-ports-div .fa-plus').disable();
                                                $('#publish-ports-div .fa-plus').hide();
                                            }else{
                                                $('#publish-ports-div input').enable();
                                                $('#publish-ports-div .fa-plus').enable();
                                                $('#publish-ports-div .fa-plus').show();
                                            }
                                         }
                                     ">
                            </legend>
                        </fieldset>
                    
                        <div class="cubeui-col-sm12 add-opt-div"  id="publish-ports-div">
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm5 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <span style='line-height: 20px;padding-right:0px;'>容器端口</span>
                                    
                                </div>
                                <div class="cubeui-col-sm5" >
                                    <span style='line-height: 20px;padding-right:0px;'>主机</span>
                                </div>
                                <div class="cubeui-col-sm1" style="text-align: center">
                                    <span style='line-height: 20px;padding-right:0px;'>
                                        <span onClick="$.docker.utils.ui.addContainerPorts(this, 'PortBindings')"  class="ops-fa-icon fa fa-plus" style="font-size:14px!important;">&nbsp;</span>
                                    </span>
                                </div>
                            </div>
                            
                            
                        {{if HostConfig.BindingPortMap}}
                        {{props HostConfig.BindingPortMap}}
                            
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm5 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <input type="text" data-toggle="cubeui-textbox" value="{{:key}}"
                                           name='PortBindings-name' data-options="required:false,prompt:'使用端口号和协议，例如80/tcp, 80/udp'">
                                </div>
                                <div class="cubeui-col-sm5">
                                    <input type="text" data-toggle="cubeui-textbox" value="{{:prop}}"
                                           name='PortBindings-value' data-options="required:false,prompt:'主机映射端口, 格式[ip:]port, 例如192.168.56.101:9999, 9999'">
                                </div>
                                <div class="cubeui-col-sm1" style="text-align: center">
                                    <span style='line-height: 30px;padding-right:0px;'><span onClick="$.docker.utils.ui.removeOpt(this)"  class="ops-fa-icon fa fa-close" style="font-size:14px!important;">&nbsp;</span></span>
                                </div>
                            </div>   
                            
                        {{/props}}
                        {{/if}}
                        
                        </div>                      
                    </div>
                    
                    <div class="cubeui-row" title="容器的卷绑定列表">
                        <fieldset>
                            <legend style="margin-bottom: 0px;">容器的卷绑定列表</legend>
                        </fieldset>
                                        
                        <div class="cubeui-col-sm12 add-opt-div">
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm5 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <span style='line-height: 20px;padding-right:0px;'>主机路径或者数据卷</span>
                                </div>
                                <div class="cubeui-col-sm5" >
                                    <span style='line-height: 20px;padding-right:0px;'>容器目标路径</span>
                                </div>
                                <div class="cubeui-col-sm1" style="text-align: center">
                                    <span style='line-height: 20px;padding-right:0px;'>
                                        <span onClick="$.docker.utils.ui.addMounts(this, 'volume')"  class="ops-fa-icon fa fa-plus" style="font-size:14px!important;">&nbsp;</span>
                                    </span>
                                </div>
                            </div>
                            
                        {{if Mounts}}
                        {{for Mounts}}
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm4 cubeui-col-sm-offset2" style="padding-right: 5px">
                                    <input type="text" data-toggle="cubeui-textbox" value="{{>Source}}" 
                                           name='volume-name' data-options="required:false,prompt:'绑定的主机路径或者数据卷, 主机路径必须是绝对路径'">
                                </div>
                                <div class="cubeui-col-sm3">
                                    <input type="text" data-toggle="cubeui-textbox" value="{{>Destination}}" 
                                           name='volume-value' data-options="required:false,prompt:'绑定容器目标路径, 目标路径必须是绝对路径'">
                                </div>
                                
                                <div class="cubeui-col-sm2">
                                        <span style='line-height: 30px;padding-left:5px' title='
                                         禁用将数据从容器路径自动复制到卷,仅适用于卷
                                         ' ><b >nc</b></span>
                                        <input {{if Propagation=='rprivate'}}value="0"{{else}}value="1"{{/if}} type="hidden" name="nocopy" class="nocopy">       
                                         <input {{if Propagation=='rprivate'}}{{else}}checked{{/if}} data-toggle="cubeui-checkbox" name="volume-nocopy-opt" value="1" label="" data-options="
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
                                        <input {{if RW}}value="1"{{else}}value="0"{{/if}} type="hidden" name="rw"  class="rw" >       
                                         <input {{if RW}}checked{{/if}} data-toggle="cubeui-checkbox"                                     
                                          name="volume-rw-opt" value="1" label="" data-options="
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
                                        <input  {{if Mode=='z'}}value="1"{{else}}value="0"{{/if}} type="hidden" name="z"  class="z">       
                                         <input {{if Mode=='z'}}checked{{/if}} data-toggle="cubeui-checkbox" name="volume-z-opt" value="1" label="" data-options="
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
                        {{/for}}
                        {{/if}}
                        </div>
                        
                    </div>
                    
                    <div class="cubeui-row" title="用户定义的键/值元数据">
                        <fieldset>
                            <legend style="margin-bottom: 0px;">用户定义的键/值元数据</legend>
                        </fieldset>
                                        
                        <div class="cubeui-col-sm12 add-opt-div">
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm5 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <span style='line-height: 20px;padding-right:0px;'>键</span>
                                </div>
                                <div class="cubeui-col-sm5" >
                                    <span style='line-height: 20px;padding-right:0px;'>值</span>
                                </div>
                                <div class="cubeui-col-sm1" style="text-align: center">
                                    <span style='line-height: 20px;padding-right:0px;'>
                                        <span onClick="$.docker.utils.ui.addContainerOpts(this, 'Labels')"  class="ops-fa-icon fa fa-plus" style="font-size:14px!important;">&nbsp;</span>
                                    </span>
                                </div>
                            </div>
                                
                            {{if HostConfig.Labels}}
                            {{props HostConfig.Labels}}                        
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm5 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <input type="text" data-toggle="cubeui-textbox" value="{{>key}}"
                                           name='Labels-name' data-options="required:false,prompt:'名字，比如：group '">
                                </div>
                                <div class="cubeui-col-sm5">
                                    <input type="text" data-toggle="cubeui-textbox" value="{{>prop}}"
                                           name='Labels-value' data-options="required:false,prompt:'对应值，比如：db '">
                                </div>
                                <div class="cubeui-col-sm1" style="text-align: center">
                                    <span style='line-height: 30px;padding-right:0px;'><span onClick="$.docker.utils.ui.removeOpt(this)"  class="ops-fa-icon fa fa-close" style="font-size:14px!important;">&nbsp;</span></span>
                                </div>
                            </div>    
                            {{/props}}
                            {{/if}}
                        
                        </div>
                        
                        
                    </div>
                    
                    <div class="cubeui-row" title="要在容器内设置的环境变量列表，格式为[“VAR=value”，…]。不带=的变量将从环境中删除，而不是具有空值">
                        <fieldset>
                            <legend style="margin-bottom: 0px;">容器内的环境变量</legend>
                        </fieldset>
                                        
                        <div class="cubeui-col-sm12 add-opt-div">
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm5 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <span style='line-height: 20px;padding-right:0px;'>变量名</span>
                                </div>
                                <div class="cubeui-col-sm5" >
                                    <span style='line-height: 20px;padding-right:0px;'>变量值</span>
                                </div>
                                <div class="cubeui-col-sm1" style="text-align: center">
                                    <span style='line-height: 20px;padding-right:0px;'>
                                        <span onClick="$.docker.utils.ui.addEnvs(this, 'Env')"  class="ops-fa-icon fa fa-plus" style="font-size:14px!important;">&nbsp;</span>
                                    </span>
                                </div>
                            </div>
                            
                            {{if Config.Env}}
                            {{props Config.Env}}   
                                          
                            <div class="cubeui-row">
                            
                                <div class="cubeui-col-sm5 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <input type="text" data-toggle="cubeui-textbox" value="{{>key}}"
                                           name='Env-name' data-options="required:false,prompt:'变量名，比如：profile '">
                                </div>
                                <div class="cubeui-col-sm5">
                                    <input type="text" data-toggle="cubeui-textbox" value="{{>prop}}"
                                           name='Env-value' data-options="required:false,prompt:'变量值，比如：production '">
                                </div>
                                <div class="cubeui-col-sm1" style="text-align: center">
                                    <span style='line-height: 30px;padding-right:0px;'><span onClick="$.docker.utils.ui.removeOpt(this)"  class="ops-fa-icon fa fa-close" style="font-size:14px!important;">&nbsp;</span></span>
                                </div>
                            </div>    
                            
                            {{/props}}
                            {{/if}}
                        
                        </div>
                        
                        
                    </div>
                    
                    <div class="cubeui-row" title="容器链接列表">
                        <fieldset>
                            <legend style="margin-bottom: 0px;">容器链接</legend>
                        </fieldset>
                                        
                        <div class="cubeui-col-sm12 add-opt-div">
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm5 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <span style='line-height: 20px;padding-right:0px;'>目标容器名</span>
                                </div>
                                <div class="cubeui-col-sm5" >
                                    <span style='line-height: 20px;padding-right:0px;'>链接别名</span>
                                </div>
                                <div class="cubeui-col-sm1" style="text-align: center">
                                    <span style='line-height: 20px;padding-right:0px;'>
                                        <span onClick="$.docker.utils.ui.addContainerLinks(this, 'Links')"  class="ops-fa-icon fa fa-plus" style="font-size:14px!important;">&nbsp;</span>
                                    </span>
                                </div>
                            </div>
                            
                            {{if HostConfig.Links}}
                            {{props HostConfig.Links}}
                            
                            <div class="cubeui-row">
                                <div class="cubeui-col-sm5 cubeui-col-sm-offset1" style="padding-right: 5px">
                                    <input type="text" data-toggle="cubeui-textbox" value="{{>key}}" 
                                           name='Links-name' data-options="required:false,prompt:'目标容器名，比如：mysql-001 '">
                                </div>
                                <div class="cubeui-col-sm5">
                                    <input type="text" data-toggle="cubeui-textbox" value="{{>prop}}"
                                           name='Links-value' data-options="required:false,prompt:'链接别名，比如：mysqldb '">
                                </div>
                                <div class="cubeui-col-sm1" style="text-align: center">
                                    <span style='line-height: 30px;padding-right:0px;'><span onClick="$.docker.utils.ui.removeOpt(this)"  class="ops-fa-icon fa fa-close" style="font-size:14px!important;">&nbsp;</span></span>
                                </div>
                            </div>      
                            
                            {{/props}}
                            {{/if}}
                            
                        </div>
                    </div>
                    
                </div>          
                </form> 
            </div>
            
            <div title="高级设置"
                 data-options="id:'eastTab1',iconCls:'fa fa-cogs'">
                <div style="margin: 0px;">
                </div>
                
                <div class="cubeui-fluid">
                    <fieldset>
                        <legend>宿主配置</legend>
                    </fieldset>
                    
                    <div class="cubeui-row">
                        <div class="cubeui-col-sm12">
                            <label class="cubeui-form-label">AttachStdin:</label>
                            <div class="cubeui-input-block">
                                <input type="text" data-toggle="cubeui-textbox" name="AttachStdin" readonly
                                       value=''
                                       data-options="
                                            "
                                >
                            </div>
                        </div>
                    </div>                   
                </div>
            </div>                 
</div>
`;


let create_panel_buttons_html = `

        {{if Flag==1}}
        <a  href="javascript:void(0)" id='tab_start_btn' data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                    {{if From=='image'}}
                    createContainerAtImage();
                    {{else}}
                    createContainer();
                    {{/if}}
            },
            btnCls: 'cubeui-btn-orange',
            iconCls: 'fa fa-headphones'
        }">创建</a>
        <a  href="javascript:void(0)" id='tab_start_btn' data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
            
                    {{if From=='image'}}
                    createAndStartContainerAtImage();
                    {{else}}
                    createAndStartContainer();
                    {{/if}}
                    
            },
            btnCls: 'cubeui-btn-yellowgreen',
            iconCls: 'fa fa-play-circle'
        }">创建&启动</a>
        {{/if}}
        {{if Flag==2}}
        <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                    runContainer();
            },
            btnCls: 'cubeui-btn-olive',
            iconCls: 'fa fa-play-circle-o'
        }">运行</a>
        {{/if}}
        
        {{if Flag==3}}
        <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                    createContainer();
            },
            btnCls: 'cubeui-btn-pink',
            iconCls: 'fa fa-random'
        }">执行</a>
        {{/if}}
        <a  href="javascript:void(0)" id='tab_start_btn' data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){                    
                $('#eastTabs').tabs('enableTab', 1);
                $('#eastTabs').tabs('select', 1);
            },
            btnCls: 'cubeui-btn-blue',
            iconCls: 'fa fa-cogs'
        }">高级设置</a>                  
         <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
            onClick:function(){
                    $('#layout').layout('collapse', 'east');
            },
            btnCls: 'cubeui-btn-red',
            iconCls: 'fa fa-close'
        }">关闭</a>
`;



function createContainer(fn){
    let node = local_node;

    if($('#createContainerForm').form('validate')) {
        let info = $.extends.json.param2json($('#createContainerForm').serialize());
        console.log(info)

        info['volume-binds'] = [];

        if (info['volume-value']&&!Array.isArray(info['volume-value'])) {
            info['volume-value'] = [info['volume-value']];
            info['volume-name'] = [info['volume-name']];
            info['rw'] = [info['rw']];
            info['z'] = [info['z']];
            info['nocopy'] = [info['nocopy']];
        }

        if(info['volume-value']){
            $.each(info['volume-value'], function (idx, v) {
                let opt = [];
                if(info['rw'][idx]=='0'){
                    opt.push('ro')
                }
                if(info['z'][idx]=='0'){
                    opt.push('Z')
                }else{
                    opt.push('z')
                }
                if(info['nocopy'][idx]=='1'){
                    opt.push('nocopy')
                }

                if(opt.length>0){
                    info['volume-binds'].push(info['volume-name']+':'+ v +':'+opt.join(","));
                }else{
                    info['volume-binds'].push(info['volume-name']+':'+ v);
                }
            })
        }


        info['PortBindings'] = {};

        if (info['PortBindings-value'] && !Array.isArray(info['PortBindings-value'])) {
            info['PortBindings-value'] = [info['PortBindings-value']];
            info['PortBindings-name'] = [info['PortBindings-name']];
        }

        if(info['PortBindings-value']){
            $.each(info['PortBindings-value'], function (idx, v) {
                let values = v.split(":")
                let host = {};
                host.HostPort=values.pop()

                if(values.length>1){
                    host.HostIp = values.join(":")
                }

                let port = info['PortBindings-name'][idx];

                if(port.indexOf("/")<=0){
                    port = port + "/tcp";
                }

                info['PortBindings'][port] = [host];
            });
        }

        let data = $.docker.utils.data.newContainer();

        data.HostConfig.Binds = info['volume-binds'];
        data.HostConfig.PortBindings = info['PortBindings'];
        data.Image = info['Image'];

        info['Links'] = [];
        if (info['Links-value'] && !Array.isArray(info['Links-value'])) {
            info['Links-value'] = [info['Links-value']];
            info['Links-name'] = [info['Links-name']];
        }

        if(info['Links-value']){
            $.each(info['Links-value'], function (idx, v) {
                info['Links'].push(info['Links-name'][idx]+':'+v);
            });
        }
        data.HostConfig.Links = info['Links'];

        let labels = $.docker.utils.buildOptsData(info['Labels-name'],info['Labels-value']);
        data.Labels = labels;

        if(info.Privileged == '1'){
            data.HostConfig.Privileged = true
        }

        if(info.AutoRemove == '1'){
            data.HostConfig.AutoRemove = true
        }

        if(!$.extends.isEmpty(info.Hostname)){
            data.Hostname = info.Hostname;
        }

        if(!$.extends.isEmpty(info.Domainname)){
            data.Domainname = info.Domainname;
        }

        if(!$.extends.isEmpty(info.User)){
            data.User = info.User;
        }


        info['Env'] = [];
        if (info['Env-value'] && !Array.isArray(info['Env-value'])) {
            info['Env-value'] = [info['Env-value']];
            info['Env-name'] = [info['Env-name']];
        }

        if(info['Env-value']){
            $.each(info['Env-value'], function (idx, v) {
                info['Env'].push(info['Env-name'][idx]+'='+v);
            });
        }
        data.Env = info['Env'];

        if(!$.extends.isEmpty(info['Entrypoint'])){
            data.Entrypoint = info['Entrypoint'].split2(" ");
        }

        if(!$.extends.isEmpty(info['Cmd'])){
            data.Cmd = info['Cmd'].split2(" ");
        }

        if(!$.extends.isEmpty(info['NetworkDisabled'])){
            data.NetworkDisabled = true;
        }

        if(!$.extends.isEmpty(info['WorkingDir'])){
            data.WorkingDir = info['WorkingDir'];
        }

        if(!$.extends.isEmpty(info['Healthcheck.Test'])){
            data.Healthcheck = {};
            data.Healthcheck.Test = $.extends.isEmpty(info['Healthcheck.Test'], '').split2(" ");
            data.Healthcheck.Interval = $.extends.isEmpty(info['Healthcheck.Interval'], '0')*1;
            data.Healthcheck.Timeout = $.extends.isEmpty(info['Healthcheck.Timeout'], '0')*1;
            data.Healthcheck.Retries = $.extends.isEmpty(info['Healthcheck.Retries'], '0')*1;
            data.Healthcheck.StartPeriod = $.extends.isEmpty(info['Healthcheck.StartPeriod'], '0')*1;
        }

        if(!$.extends.isEmpty(info['HostConfig.LogConfig.Type'])){
            data.HostConfig.LogConfig = {};
            data.HostConfig.LogConfig.Type = $.extends.isEmpty(info['HostConfig.LogConfig.Type'], '');
            data.HostConfig.LogConfig.Config = $.docker.utils.buildOptsData($.docker.utils.convert2ListParamValue(info['cnt-log-driver-name']), $.docker.utils.convert2ListParamValue(info['cnt-log-driver-value']))
        }

        if(!$.extends.isEmpty(info['RestartPolicy'])){
            data.HostConfig.RestartPolicy.Name = info['RestartPolicy'].trim();
            if(data.HostConfig.RestartPolicy.Name == 'on-failure'){
                data.HostConfig.RestartPolicy.MaximumRetryCount = (info['MaximumRetryCount']||3)*1;
            }
        }

        if(!$.extends.isEmpty(info['HostConfig.NetworkMode'])){
            data.HostConfig.NetworkMode = info['HostConfig.NetworkMode'].trim();
        }

        console.log(data)

        if($.extends.isEmpty(info.Name)){
            //info.Name = info.Image.split(":")[0]+"-"+Math.uuid();
            info.Name = Math.uuid()+"";
        }

        $.docker.request.container.create(function (response) {
            if(fn){
                fn.call(info, response, data)
            }else{
                $.app.show('创建容器{0}成功'.format(info.Name));
                reloadDg();
                //$('#layout').layout('collapse', 'east');
            }
        }, node, info.Name.indexOf('/')==0?info.Name:('/'+info.Name), data);
    }

}

function createAndStartContainer(){
    createContainer(function(response, data) {
        let info = this;
        let node = local_node;
        reloadDg();

        if($.extends.isEmpty(response.Warnings)){

            $.app.show('创建容器{0}成功, 正在启动容器'.format(info.Name));

            $.docker.request.container.start(function(){
                showLog(response.Id)
                $.app.show('容器{0}启动成功'.format(info.Name));
                reloadDg();
                //triggerNavMenuClick('ALL', 'containers');
                //$('#layout').layout('collapse', 'east');
            }, node, response.Id);
        }else{
            $.app.show('创建容器{0}成功, 出现警告信息，请手动启动容器，{0}'.format(response.Warnings.join(",").htmlEncode()))
        }

    });

}

let dir_tab_html = `
        <!-- 表格工具栏开始 -->
        <div id="dirDg-toolbar" class="cubeui-toolbar"
             data-options="grid:{
                   type:'datagrid',
                   id:'dirDg'
               }">

            <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
                    onClick:function(){
                        upLs('{0}');
                    },
                    extend: '#dirDg-toolbar',
                    btnCls: 'cubeui-btn-blue',
                    iconCls: 'fa fa-level-up'
                }">上级目录</a>
                             
            <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
                    onClick:function(){
                        currentLs('{0}');
                    },
                    extend: '#dirDg-toolbar',
                    btnCls: 'cubeui-btn-red',
                    iconCls: 'fa fa-refresh'
                }">刷新</a>
                
            <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
                onClick:function(){
                        exportFolder('{0}')
                },
                btnCls: 'cubeui-btn-limegreen',
                iconCls: 'fa fa-sign-out'
            }">导出</a>
            
            <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{
                onClick:function(){
                        importFolder('{0}')
                },
                btnCls: 'cubeui-btn-dodgerblue',
                iconCls: 'fa fa-sign-in'
            }">导入</a>
                
                
<!--            <a  href="javascript:void(0)" data-toggle='cubeui-menubutton' data-options="{-->
<!--                    onClick:function(){-->
<!--                        resumeLease('{0}');-->
<!--                    },-->
<!--                    extend: '#processesDg-toolbar',-->
<!--                    btnCls: 'cubeui-btn-blue',-->
<!--                    iconCls: 'fa fa-play-circle-o'-->
<!--                }">恢复进程</a>-->
                
            <form class="search-box-2">                
                <span style='line-height: 30px;padding-right:10px;padding-left:10px;'>当前路径：</span>
                <input type="text" id='search_dir' name="search_dir" value="/" data-toggle="cubeui-textbox"
                       data-options="onClear:function(){
                            console.log(111);
                            $('#search-dirbtn').trigger('click');
                       },width:320,                        
                       prompt:'当前路径'">
                <a href="javascript:void(0)" id="search-dirbtn"
                   data-toggle="cubeui-menubutton"
                   data-options="method:'query',
                   onClick:function(){
                        //alert('{0}');
                        let path = $.extends.isEmpty($('#search_dir').textbox('getValue'),'/');
                        ls(path, null);
                   },
                   iconCls:'fa fa-folder-open',
                   btnCls:'cubeui-btn-orange',">查看</a>
            </form>
        </div>
        <!-- 表格工具栏结束 -->
        
    <table id="dirDg"></table>
`;