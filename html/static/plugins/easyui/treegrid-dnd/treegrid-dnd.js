(function($){
	$.extend($.fn.treegrid.defaults, {
		dropAccept:'tr[node-id]',
		onBeforeDrag: function(row){},	// return false to deny drag
		onStartDrag: function(row){},
		onStopDrag: function(row){},
		onDragEnter: function(targetRow, sourceRow){},	// return false to deny drop
		onDragOver: function(targetRow, sourceRow, point){},	// return false to deny drop
		onDragLeave: function(targetRow, sourceRow){},
		onBeforeDrop: function(targetRow, sourceRow, point){},
		onDrop: function(targetRow, sourceRow, point){},	// point:'append','top','bottom'
	});
	
	$.extend($.fn.treegrid.methods, {
		resetDnd: function(jq){
			return jq.each(function(){
				var state = $.data(this, 'treegrid');
				var opts = state.options;
				var row = $(this).treegrid('find', state.draggingNodeId);
				if (row){
					var tr = opts.finder.getTr(this, row[opts.idField]);
					tr.each(function(){
						var target = this;
						$(target).data('draggable').droppables = $('.droppable:visible').filter(function(){
							return target != this;
						}).filter(function(){
							var accept = $.data(this, 'droppable').options.accept;
							if (accept){
								return $(accept).filter(function(){
									return this == target;
								}).length > 0;
							} else {
								return true;
							}
						});
					});
				}
			});
		},
		enableDndChildren: function (jq, id){
			let rows = $(jq).treegrid('getChildren', id);
			if(rows){
				$.each(rows, function (idx, row){
					if(row.hasOwnProperty('disableDnd') && row['disableDnd']!=false){
					}else{
						$(jq).treegrid('enableDnd', row.id);
					}
				})
			}
		},
		enableDnd: function(jq, id){
			if (!$('#treegrid-dnd-style').length){
				$('head').append(
						'<style id="treegrid-dnd-style">' +
						'.treegrid-row-top td{border-top:1px solid red}' +
						'.treegrid-row-bottom td{border-bottom:1px solid red}' +
						'.treegrid-row-append .tree-title{border:1px solid red}' +
						'</style>'
				);
			}
			return jq.each(function(){
				var target = this;
				var state = $.data(this, 'treegrid');
				if (!state.disabledNodes){
					state.disabledNodes = [];					
				}
				var t = $(this);
				var opts = state.options;
				if (id){
					var nodes = opts.finder.getTr(target, id);
					var rows = t.treegrid('getChildren', id);
					for(var i=0; i<rows.length; i++){
						nodes = nodes.add(opts.finder.getTr(target, rows[i][opts.idField]));
					}
				} else {
					var nodes = t.treegrid('getPanel').find('tr[node-id]');
				}
				nodes.draggable({
					disabled:false,
					revert:true,
					cursor:'pointer',
					proxy: function(source){
						var row = t.treegrid('find', $(source).attr('node-id'));
						var p = $('<div class="tree-node-proxy"></div>').appendTo('body');
						p.html('<span class="tree-dnd-icon tree-dnd-no">&nbsp;</span>'+row[opts.treeField]);
						p.hide();
						return p;
					},
					deltaX: 15,
					deltaY: 15,
					onBeforeDrag:function(e){
						if (opts.onBeforeDrag.call(target, getRow(this)) == false){return false}
						if ($(e.target).hasClass('tree-hit') || $(e.target).parent().hasClass('datagrid-cell-check')){return false;}
						if (e.which != 1){return false;}
					},
					onStartDrag:function(){
						$(this).draggable('proxy').css({
							left:-10000,
							top:-10000
						});
						var row = getRow(this);
						state.draggingNodeId = row[opts.idField];
						setValid(state.draggingNodeId, false);
						opts.onStartDrag.call(target, row);
					},
					onDrag:function(e){
						var x1=e.pageX,y1=e.pageY,x2=e.data.startX,y2=e.data.startY;
						var d = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
						if (d>3){	// when drag a little distance, show the proxy object
							$(this).draggable('proxy').show();
							var tr = opts.finder.getTr(target, $(this).attr('node-id'));
							var treeTitle = tr.find('span.tree-title');
							e.data.startX = treeTitle.offset().left;
							e.data.startY = treeTitle.offset().top;
							e.data.offsetWidth = 0;
							e.data.offsetHeight = 0;
						}
						this.pageY = e.pageY;
					},
					onStopDrag:function(){
						setValid(state.draggingNodeId, true);
						for(var i=0; i<state.disabledNodes.length; i++){
							var tr = opts.finder.getTr(target, state.disabledNodes[i]);
							tr.droppable('enable');
						}
						state.disabledNodes = [];
						var row = t.treegrid('find', state.draggingNodeId);
						state.draggingNodeId = undefined;
						opts.onStopDrag.call(target, row);
					}
				});
				var view = $(target).data('datagrid').dc.view;
				view.add(nodes).droppable({
					accept:opts.dropAccept,
					onDragEnter: function(e, source){
						var nodeId = $(this).attr('node-id');
						var dTarget = getGridTarget(this);
						var dOpts = $(dTarget).treegrid('options');
						var tr = dOpts.finder.getTr(dTarget, null, 'highlight');
						var sRow = getRow(source);
						var dRow = getRow(this);
						if (tr.length && dRow){
							cb();
						}

						function cb(){
							if (opts.onDragEnter.call(target, dRow, sRow) == false){
								allowDrop(source, false);
								tr.removeClass('treegrid-row-append treegrid-row-top treegrid-row-bottom');
								tr.droppable('disable');
								state.disabledNodes.push(nodeId);
							}
						}
					},
					onDragOver:function(e,source){
						var nodeId = $(this).attr('node-id');
						if ($.inArray(nodeId, state.disabledNodes) >= 0){return;}
						var dTarget = getGridTarget(this);
						var dOpts = $(dTarget).treegrid('options');
						var tr = dOpts.finder.getTr(dTarget, null, 'highlight');
						if (tr.length){
							if (!isValid(tr)){
								allowDrop(source, false);
								return;
							}
						}
						allowDrop(source, true);
						var sRow = getRow(source);
						var dRow = getRow(this);

						let point = 'append';

						if (tr.length){
							var pageY = source.pageY;
							var top = tr.offset().top;
							var bottom = top + tr.outerHeight();
							tr.removeClass('treegrid-row-append treegrid-row-top treegrid-row-bottom');
							if (pageY > top + (bottom - top) / 2){
								if (bottom - pageY < 10){
									tr.addClass('treegrid-row-bottom');
								} else {
									tr.addClass('treegrid-row-append');
								}
							} else {
								if (pageY - top < 10){
									tr.addClass('treegrid-row-top');
								} else {
									tr.addClass('treegrid-row-append');
								}
							}

							if (tr.hasClass('treegrid-row-append')){
								point = 'append';
							} else {
								point = tr.hasClass('treegrid-row-top') ? 'top' : 'bottom';
							}

							if (dRow){
								cb();
							}
						}

						function cb(){
							if (opts.onDragOver.call(target, dRow, sRow, point) == false){
								allowDrop(source, false);
								tr.removeClass('treegrid-row-append treegrid-row-top treegrid-row-bottom');
								tr.droppable('disable');
								state.disabledNodes.push(nodeId);
							}
						}
					},
					onDragLeave:function(e,source){
						allowDrop(source, false);
						var dTarget = getGridTarget(this);
						var dOpts = $(dTarget).treegrid('options');
						var sRow = getRow(source);
						var dRow = getRow(this);
						var tr = dOpts.finder.getTr(dTarget, $(this).attr('node-id'));
						tr.removeClass('treegrid-row-append treegrid-row-top treegrid-row-bottom');
						if (dRow){
							opts.onDragLeave.call(target, dRow, sRow);
						}
					},
					onDrop:function(e,source){
						var point = 'append';
						var dRow = null;
						var sRow = getRow(source);
						var sTarget = getGridTarget(source);
						var dTarget = getGridTarget(this);
						var dOpts = $(dTarget).treegrid('options');
						var tr = dOpts.finder.getTr(dTarget, null, 'highlight');
						if (tr.length){
							if (!isValid(tr)){
								return;
							}
							dRow = getRow(tr);
							if (tr.hasClass('treegrid-row-append')){
								point = 'append';
							} else {
								point = tr.hasClass('treegrid-row-top') ? 'top' : 'bottom';
							}
							tr.removeClass('treegrid-row-append treegrid-row-top treegrid-row-bottom');
						}
						if (opts.onBeforeDrop.call(target, dRow, sRow, point) == false){
							return;
						}
						insert.call(this);
						opts.onDrop.call(target, dRow, sRow, point);

						function insert(){
							var data = $(sTarget).treegrid('pop', sRow[opts.idField]);
							if (point == 'append'){
								if (dRow){
									$(dTarget).treegrid('append', {
										parent: dRow[opts.idField],
										data: [data]
									});
									if (dRow.state == 'closed'){
										$(dTarget).treegrid('expand', dRow[opts.idField]);
									}
								} else {
									$(dTarget).treegrid('append', {parent:null, data:[data]});
								}
								$(dTarget).treegrid('enableDnd', sRow[opts.idField]);
							} else {
								var param = {data:data};
								if (point == 'top'){
									param.before = dRow[opts.idField];
								} else {
									param.after = dRow[opts.idField];
								}
								$(dTarget).treegrid('insert', param);
								$(dTarget).treegrid('enableDnd', sRow[opts.idField]);
							}
						}
					}
				});
				
				function allowDrop(source, allowed){
					var icon = $(source).draggable('proxy').find('span.tree-dnd-icon');
					icon.removeClass('tree-dnd-yes tree-dnd-no').addClass(allowed ? 'tree-dnd-yes' : 'tree-dnd-no');
				}
				function getRow(tr){
					var target = getGridTarget(tr);
					var nodeId = $(tr).attr('node-id');
					return $(target).treegrid('find', nodeId);
				}

				function getGridTarget(el){
					return $(el).closest('div.datagrid-view').children('table')[0];
				}
				function isValid(tr){

					let opts = null;

					try{
						opts = $(tr).droppable('options');
					}catch (e){
						return false;
					}

					if (opts.disabled || opts.accept == 'no-accept'){
						return false;
					} else {
						return true;
					}
				}
				function setValid(id, valid){
					var accept = valid ? opts.dropAccept : 'no-accept';
					var tr = opts.finder.getTr(target, id);
					tr.droppable({accept:accept});
					tr.next('tr.treegrid-tr-tree').find('tr[node-id]').droppable({accept:accept});
				}
			});
		}
	});
})(jQuery);

/*

事件
该事件扩展自树形网格（treegrid），下面是为树形网格（treegrid）添加的事件。

名称	参数	描述
onBeforeDrag	row	当一行的拖拽开始前触发，返回 false 则取消拖拽。
onStartDrag	row	当开始拖拽一行时触发。
onStopDrag	row	当停止拖拽一行后触发。
onDragEnter	targetRow, sourceRow	当拖拽一行进入某允许放置的目标行时触发，返回 false 则取消放置。
onDragOver	targetRow, sourceRow	当拖拽一行在某允许放置的目标行上时触发，返回 false 则取消放置。
onDragLeave	targetRow, sourceRow	当拖拽一行离开某允许放置的目标行时触发。
onBeforeDrop	targetRow,sourceRow,point	当一行被放置前触发，返回 false 则取消放置。
											targetRow：放置的目标行。
											sourceRow：拖拽的源行。
											point：指示放置的位置，可能的值：'append'、'top' 或 'bottom'。
onDrop	targetRow,sourceRow,point	当一行被放置时触发。
											targetRow：放置的目标行。
											sourceRow：拖拽的源行。
											point：指示放置的位置，可能的值：'append'、'top' 或 'bottom'。
方法
该方法扩展自树形网格（treegrid）。

名称	参数	描述
enableDnd	id	启用行的拖拽与放置。
'id' 参数指示要被拖拽与放置的行。
如果该参数未指定，则拖拽与放置所有行。

*/
