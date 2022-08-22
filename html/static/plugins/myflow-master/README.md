# 本功能基于myflow开发，主要完善有如下几点： #

1. 添加了状态之间通过鼠标多点描绘出相关路径
2. 添加了撤销，重绘，保存，发布相关功能
3. 统一封装了保存，发布，添加路径，添加状态，删除路径，删除状态，点击路径和点击状态相关接口
4. 添加了两个状态间可多线连接配置 {allowStateMutiLine:true}
5. 修复了线条不易选中的bug
6. `点击鼠标右键可清除正在描绘的路径`
7. `修复了mac上点击删除无效的bug`

# 本功能还需完善的功能： #

1. 对于撤销功能暂未处理路径和状态位置移动的问题
2. 对于重绘功能未添加清除所有路径支持
3. 未进行相关系统性测试

# 关于使用： #

    $('#myflow').myflow(
		{
			basePath : "",
			allowStateMutiLine:true,
			restore : eval("(" + flowdata + ")"),
			tools : {
				save : function(data) {
					console.log("保存",eval("("+data+")"));
					//console.log(data);
					window.localStorage.setItem("data",data)
				},
				publish:function(data){
					console.log("发布",eval("("+data+")"));
				},
				addPath:function(id,data){
					console.log("添加路径",id,eval("("+data+")"));
				},
				addRect:function(id,data){
					//console.log("添加状态",id,eval("("+data+")"));
				},
				clickPath:function(id){
					//console.log("点击线",id)
				},
				clickRect:function(id,data){
					//console.log("点击状态",id,eval("("+data+")"));
				},
				deletePath:function(id){
					//console.log("删除线",id);
				},
				deleteRect:function(id,data){
					//console.log("删除状态",id,eval("("+data+")"));
				},
				revoke:function(id){

				}
			}
		});


# Demo示例 #
```
npm install
npm start
```

# 版权申明： #

本功能基于myflow二次开发，仅为个人学习使用，如商用请遵循myflow相关版权规则。

# 参考： #

1. https://www.draw.io/