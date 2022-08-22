$.extend($.fn.datagrid.defaults, {
	rowHeight: null,
	onBeforeFetch: function(page){},
	onFetch: function(page, rows){}
});

var bufferview = $.extend({}, $.fn.datagrid.defaults.view, {
	render: function(target, container, frozen){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var rows = this.rows || [];
		if (!rows.length) {
			return;
		}
		var fields = $(target).datagrid('getColumnFields', frozen);
		
		if (frozen){
			if (!(opts.rownumbers || (opts.frozenColumns && opts.frozenColumns.length))){
				return;
			}
		}
		
		var index = parseInt(opts.finder.getTr(target,'','last',(frozen?1:2)).attr('datagrid-row-index'))+1 || 0;
		var table = ['<table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0"><tbody>'];
		for(var i=0; i<rows.length; i++) {
			// get the class and style attributes for this row
			var css = opts.rowStyler ? opts.rowStyler.call(target, index, rows[i]) : '';
			var classValue = '';
			var styleValue = '';
			if (typeof css == 'string'){
				styleValue = css;
			} else if (css){
				classValue = css['class'] || '';
				styleValue = css['style'] || '';
			}
			
			var cls = 'class="datagrid-row ' + (index % 2 && opts.striped ? 'datagrid-row-alt ' : ' ') + classValue + '"';
			var style = styleValue ? 'style="' + styleValue + '"' : '';
			var rowId = state.rowIdPrefix + '-' + (frozen?1:2) + '-' + index;
			table.push('<tr id="' + rowId + '" datagrid-row-index="' + index + '" ' + cls + ' ' + style + '>');
			table.push(this.renderRow.call(this, target, fields, frozen, index, rows[i]));
			table.push('</tr>');
			index++;
		}
		table.push('</tbody></table>');
		
		$(container).append(table.join(''));
	},
	
	onBeforeRender: function(target){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var dc = state.dc;
		var view = this;
		this.renderedCount = 0;
		this.rows = [];
		
		dc.body1.add(dc.body2).empty();
		init();
		
		function init(){
			opts.rowHeight = $(target).datagrid('getRowHeight');
			// erase the onLoadSuccess event, make sure it can't be triggered
			state.onLoadSuccess = opts.onLoadSuccess;
			opts.onLoadSuccess = function(){};
			setTimeout(function(){
				dc.body2.unbind('.datagrid').bind('scroll.datagrid', function(e){
					if (state.onLoadSuccess){
						opts.onLoadSuccess = state.onLoadSuccess;	// restore the onLoadSuccess event
						state.onLoadSuccess = undefined;
					}
					if (view.scrollTimer){
						clearTimeout(view.scrollTimer);
					}
					view.scrollTimer = setTimeout(function(){
						scrolling.call(view);
					}, 50);
				});
				dc.body2.triggerHandler('scroll.datagrid');
			}, 0);
		}
		
		function scrolling(){
			if (getDataHeight() < dc.body2.height() && view.renderedCount < state.data.total){
				this.getRows.call(this, target, function(rows){
					this.rows = rows;
					this.populate.call(this, target);
					dc.body2.triggerHandler('scroll.datagrid');
				});
			} else if (dc.body2.scrollTop() >= getDataHeight() - dc.body2.height()){
				this.getRows.call(this, target, function(rows){
					this.rows = rows;
					this.populate.call(this, target);
				});
			}
		}
		
		function getDataHeight(){
			// var h = 0;
			// dc.body2.children('table.datagrid-btable').each(function(){
			// 	h += $(this).outerHeight();
			// });
			// if (!h){
			// 	h = view.renderedCount * opts.rowHeight;
			// }
			// return h;
			return view.renderedCount * opts.rowHeight;
		}
	},
	
	getRows: function(target, callback){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var page = Math.floor(this.renderedCount/opts.pageSize) + 1;
		
		if (this.renderedCount >= state.data.total){return;}
		if (opts.onBeforeFetch.call(target, page) == false){return}
		
//		var rows = state.data.rows.slice(this.renderedCount, this.renderedCount+opts.pageSize);
		var index = (page-1)*opts.pageSize;
		var rows = state.data.rows.slice(index, index+opts.pageSize);
		if (rows.length){
			opts.onFetch.call(target, page, rows);
			callback.call(this, rows);
		} else {
			var param = $.extend({}, opts.queryParams, {
				page: Math.floor(this.renderedCount/opts.pageSize)+1,
				rows: opts.pageSize
			});
			if (opts.sortName){
				$.extend(param, {
					sort: opts.sortName,
					order: opts.sortOrder
				});
			}
			if (opts.onBeforeLoad.call(target, param) == false){return;}
			
			$(target).datagrid('loading');
			var result = opts.loader.call(target, param, function(data){
				$(target).datagrid('loaded');
				var data = opts.loadFilter.call(target, data);
				opts.onFetch.call(target, page, data.rows);
				if (data.rows && data.rows.length){
					state.data.rows = state.data.rows.concat(data.rows);
					callback.call(opts.view, data.rows);
				} else {
					opts.onLoadSuccess.call(target, data);
				}
			}, function(){
				$(target).datagrid('loaded');
				opts.onLoadError.apply(target, arguments);
			});
			if (result == false){
				$(target).datagrid('loaded');
				if (!state.data.rows.length){
					opts.onFetch.call(target, page, state.data.rows);
					opts.onLoadSuccess.call(target, state.data);
				}
			}
		}
	},
	
	populate: function(target){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var dc = state.dc;
		if (this.rows.length){
			this.renderedCount += this.rows.length;
			this.render.call(this, target, dc.body2, false);
			this.render.call(this, target, dc.body1, true);
			opts.onLoadSuccess.call(target, {
				total: state.data.total,
				rows: this.rows
			});
//			for(var i=this.renderedCount-this.rows.length; i<this.renderedCount; i++){
//				$(target).datagrid('fixRowHeight', i);
//			}
		}
	}
});
$.extend($.fn.datagrid.methods, {
	getRowHeight: function(jq){
		var opts = jq.datagrid('options');
		if (!opts.rowHeight){
			var d = $('<div style="position:absolute;top:-1000px;width:100px;height:100px;padding:5px"><table><tr class="datagrid-row"><td>cell</td></tr></table></div>').appendTo('body');
			var rowHeight = d.find('tr').outerHeight();
			d.remove();
			opts.rowHeight = rowHeight;
		}
		return opts.rowHeight;
	}
});

