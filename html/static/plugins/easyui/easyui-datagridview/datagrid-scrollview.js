$.extend($.fn.datagrid.defaults, {
	rowHeight: null,
	maxDivHeight: 10000000,
	maxVisibleHeight: 15000000,
	deltaTopHeight: 0,
	onBeforeFetch: function(page){},
	onFetch: function(page, rows){},
	loader: function(param, success, error){
		var opts = $(this).datagrid('options');
		if (!opts.url) return false;
		if (opts.view.type == 'scrollview'){
			param.page = param.page || 1;
			param.rows = param.rows || opts.pageSize;
		}
		$.ajax({
			type: opts.method,
			url: opts.url,
			data: param,
			dataType: 'json',
			success: function(data){
				success(data);
			},
			error: function(){
				error.apply(this, arguments);
			}
		});
	}
});
$.extend($.fn.datagrid.defaults.finder, {
	getRow: function(target, p){	// p can be row index or tr object
		var index = (typeof p == 'object') ? p.attr('datagrid-row-index') : p;
		var data = $.data(target, 'datagrid').data;
		var opts = $(target).datagrid('options');
		if (opts.view.type == 'scrollview'){
			if (index < data.firstRows.length){
				return data.firstRows[index];
			} else {
				index -= opts.view.index;
			}
		}
		return data.rows[index];
	}
});

var scrollview = $.extend({}, $.fn.datagrid.defaults.view, {
	type: 'scrollview',
	index: 0,
	r1: [],
	r2: [],
	rows: [],
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
		
		var index = this.index;
		var table = ['<div class="datagrid-btable-top"></div>',
		             '<table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0"><tbody>'];
		for(var i=0; i<rows.length; i++) {
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

			// render the detail row
			if (opts.detailFormatter){
				table.push('<tr style="display:none;">');
				if (frozen){
					table.push('<td colspan=' + (fields.length+(opts.rownumbers?1:0)) + ' style="border-right:0">');
				} else {
					table.push('<td colspan=' + (fields.length) + '>');
				}
				table.push('<div class="datagrid-row-detail">');
				if (frozen){
					table.push('&nbsp;');
				} else {
					table.push(opts.detailFormatter.call(target, index, rows[i]));
				}
				table.push('</div>');
				table.push('</td>');
				table.push('</tr>');
			}

			index++;
		}
		table.push('</tbody></table>');
		table.push('<div class="datagrid-btable-bottom"></div>');
		
		$(container).html(table.join(''));
	},
	
	renderRow: function(target, fields, frozen, rowIndex, rowData){
		var opts = $.data(target, 'datagrid').options;
		
		var cc = [];
		if (frozen && opts.rownumbers){
			var rownumber = rowIndex + 1;
			// if (opts.pagination){
			// 	rownumber += (opts.pageNumber-1)*opts.pageSize;
			// }
			cc.push('<td class="datagrid-td-rownumber"><div class="datagrid-cell-rownumber">'+rownumber+'</div></td>');
		}
		for(var i=0; i<fields.length; i++){
			var field = fields[i];
			var col = $(target).datagrid('getColumnOption', field);
			if (col){
				var value = rowData[field];	// the field value
				var css = col.styler ? (col.styler(value, rowData, rowIndex)||'') : '';
				var classValue = '';
				var styleValue = '';
				if (typeof css == 'string'){
					styleValue = css;
				} else if (cc){
					classValue = css['class'] || '';
					styleValue = css['style'] || '';
				}
				var cls = classValue ? 'class="' + classValue + '"' : '';
				var style = col.hidden ? 'style="display:none;' + styleValue + '"' : (styleValue ? 'style="' + styleValue + '"' : '');
				
				cc.push('<td field="' + field + '" ' + cls + ' ' + style + '>');
				
				if (col.checkbox){
					style = '';
				} else if (col.expander){
					style = "text-align:center;height:16px;";
				} else {
					style = styleValue;
					if (col.align){style += ';text-align:' + col.align + ';'}
					if (!opts.nowrap){
						style += ';white-space:normal;height:auto;';
					} else if (opts.autoRowHeight){
						style += ';height:auto;';
					}
				}
				
				cc.push('<div style="' + style + '" ');
				if (col.checkbox){
					cc.push('class="datagrid-cell-check ');
				} else {
					cc.push('class="datagrid-cell ' + col.cellClass);
				}
				cc.push('">');
				
				if (col.checkbox){
					cc.push('<input type="checkbox" name="' + field + '" value="' + (value!=undefined ? value : '') + '">');
				} else if (col.expander) {
					//cc.push('<div style="text-align:center;width:16px;height:16px;">');
					cc.push('<span class="datagrid-row-expander datagrid-row-expand" style="display:inline-block;width:16px;height:16px;cursor:pointer;" />');
					//cc.push('</div>');
				} else if (col.formatter){
					cc.push(col.formatter(value, rowData, rowIndex));
				} else {
					cc.push(value);
				}
				
				cc.push('</div>');
				cc.push('</td>');
			}
		}
		return cc.join('');
	},
	
	bindEvents: function(target){
		var state = $.data(target, 'datagrid');
		var dc = state.dc;
		var opts = state.options;
		var body = dc.body1.add(dc.body2);
		var clickHandler = ($.data(body[0],'events')||$._data(body[0],'events')).click[0].handler;
		body.unbind('click').bind('click', function(e){
			var tt = $(e.target);
			var tr = tt.closest('tr.datagrid-row');
			if (!tr.length){return}
			if (tt.hasClass('datagrid-row-expander')){
				var rowIndex = parseInt(tr.attr('datagrid-row-index'));
				if (tt.hasClass('datagrid-row-expand')){
					$(target).datagrid('expandRow', rowIndex);
				} else {
					$(target).datagrid('collapseRow', rowIndex);
				}
				$(target).datagrid('fixRowHeight');
				
			} else {
				clickHandler(e);
			}
			e.stopPropagation();
		});
	},
	
	onBeforeRender: function(target){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var dc = state.dc;
		var view = this;

		opts._emptyMsg = opts.emptyMsg;	// store the emptyMsg value
		opts.emptyMsg = '';	// erase it to prevent from displaying it
		state.data.firstRows = state.data.rows;
		state.data.rows = [];

		dc.body1.add(dc.body2).empty();
		this.rows = [];	// the rows to be rendered
		this.r1 = this.r2 = [];	// the first part and last part of rows
		
		init();
		createHeaderExpander();
		
		function init(){
			opts.rowHeight = $(target).datagrid('getRowHeight');
			var pager = $(target).datagrid('getPager');
			pager.each(function(){
				$(this).pagination('options').onSelectPage = function(pageNum, pageSize){
					opts.pageNumber = pageNum || 1;
					opts.pageSize = pageSize;
					pager.pagination('refresh',{
						pageNumber:pageNum,
						pageSize:pageSize
					});
					$(target).datagrid('gotoPage', opts.pageNumber);
				};
			});
			// erase the onLoadSuccess event, make sure it can't be triggered
			state.onLoadSuccess = opts.onLoadSuccess;
			opts.onLoadSuccess = function(){};
			if (!opts.remoteSort){
				var onBeforeSortColumn = opts.onBeforeSortColumn;
				opts.onBeforeSortColumn = function(name, order){
					var result = onBeforeSortColumn.call(this, name, order);
					if (result == false){
						return false;
					}
					state.data.rows = state.data.firstRows;
				}
			}
			dc.body2.unbind('.datagrid');
			setTimeout(function(){
				dc.body2.unbind('.datagrid').bind('scroll.datagrid', function(e){
					if (state.onLoadSuccess){
						opts.onLoadSuccess = state.onLoadSuccess;	// restore the onLoadSuccess event
						state.onLoadSuccess = undefined;
						state.originalRows = $.extend(true,[],state.data.firstRows);
					}
					if (view.scrollTimer){
						clearTimeout(view.scrollTimer);
					}
					view.scrollTimer = setTimeout(function(){
						view.scrolling.call(view, target);
					}, 50);
				});
				dc.body2.triggerHandler('scroll.datagrid');
			}, 0);
		}
		function createHeaderExpander(){
			if (!opts.detailFormatter){return}
			
			var t = $(target);
			var hasExpander = false;
			var fields = t.datagrid('getColumnFields',true).concat(t.datagrid('getColumnFields'));
			for(var i=0; i<fields.length; i++){
				var col = t.datagrid('getColumnOption', fields[i]);
				if (col.expander){
					hasExpander = true;
					break;
				}
			}
			if (!hasExpander){
				if (opts.frozenColumns && opts.frozenColumns.length){
					opts.frozenColumns[0].splice(0,0,{field:'_expander',expander:true,width:24,resizable:false,fixed:true});
				} else {
					opts.frozenColumns = [[{field:'_expander',expander:true,width:24,resizable:false,fixed:true}]];
				}
				
				var t = dc.view1.children('div.datagrid-header').find('table');
				var td = $('<td rowspan="'+opts.frozenColumns.length+'"><div class="datagrid-header-expander" style="width:24px;"></div></td>');
				if ($('tr',t).length == 0){
					td.wrap('<tr></tr>').parent().appendTo($('tbody',t));
				} else if (opts.rownumbers){
					td.insertAfter(t.find('td:has(div.datagrid-header-rownumber)'));
				} else {
					td.prependTo(t.find('tr:first'));
				}
			}
			
			setTimeout(function(){
				view.bindEvents(target);
			},0);
		}
	},
	
	onAfterRender: function(target){
		$.fn.datagrid.defaults.view.onAfterRender.call(this, target);
		var dc = $.data(target, 'datagrid').dc;
		var footer = dc.footer1.add(dc.footer2);
		footer.find('span.datagrid-row-expander').css('visibility', 'hidden');
	},

	scrolling: function(target){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var dc = state.dc;
		if (!opts.finder.getRows(target).length){
			this.reload.call(this, target);
		} else {
			if (!dc.body2.is(':visible')){return}
			var headerHeight = dc.view2.children('div.datagrid-header').outerHeight();
			
			var topDiv = dc.body2.children('div.datagrid-btable-top');
			var bottomDiv = dc.body2.children('div.datagrid-btable-bottom');
			if (!topDiv.length || !bottomDiv.length){return;}
			var top = topDiv.position().top + topDiv._outerHeight() - headerHeight;
			var bottom = bottomDiv.position().top - headerHeight;
			top = Math.floor(top);
			bottom = Math.floor(bottom);

			if (top > dc.body2.height() || bottom < 0){
				this.reload.call(this, target);
			} else if (top > 0){
				var page = Math.floor(this.index/opts.pageSize);
				this.getRows.call(this, target, page, function(rows){
					this.page = page;
					this.r2 = this.r1;
					this.r1 = rows;
					this.index = (page-1)*opts.pageSize;
					this.rows = this.r1.concat(this.r2);
					this.populate.call(this, target);
				});
			} else if (bottom < dc.body2.height()){
				if (state.data.rows.length+this.index >= state.data.total){
					return;
				}
				var page = Math.floor(this.index/opts.pageSize)+2;
				if (this.r2.length){
					page++;
				}
				this.getRows.call(this, target, page, function(rows){
					this.page = page;
					if (!this.r2.length){
						this.r2 = rows;
					} else {
						this.r1 = this.r2;
						this.r2 = rows;
						this.index += opts.pageSize;
					}
					this.rows = this.r1.concat(this.r2);
					this.populate.call(this, target);
				});
			}
		}
	},
	reload: function(target){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var dc = state.dc;
		var top = $(dc.body2).scrollTop() + opts.deltaTopHeight;
		var index = Math.floor(top/opts.rowHeight);
		var page = Math.floor(index/opts.pageSize) + 1;
		
		this.getRows.call(this, target, page, function(rows){
			this.page = page;
			this.index = (page-1)*opts.pageSize;
			this.rows = rows;
			this.r1 = rows;
			this.r2 = [];
			this.populate.call(this, target);
			dc.body2.triggerHandler('scroll.datagrid');
		});
	},
	
	getRows: function(target, page, callback){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var index = (page-1)*opts.pageSize;

		// if possible display the empty message
		opts.emptyMsg = opts._emptyMsg;
		if (this.setEmptyMsg){
			this.setEmptyMsg(target);
		}

		if (index < 0){return}
		if (opts.onBeforeFetch.call(target, page) == false){return;}

		var rows = state.data.firstRows.slice(index, index+opts.pageSize);
		if (rows.length && (rows.length==opts.pageSize || index+rows.length==state.data.total)){
			opts.onFetch.call(target, page, rows);
			callback.call(this, rows);
		} else {
			var param = $.extend({}, opts.queryParams, {
				page: page,
				rows: opts.pageSize
			});
			if (opts.sortName){
				$.extend(param, {
					sort: opts.sortName,
					order: opts.sortOrder
				});
			}
			if (opts.onBeforeLoad.call(target, param) == false) return;
			
			$(target).datagrid('loading');
			var result = opts.loader.call(target, param, function(data){
				$(target).datagrid('loaded');
				var data = opts.loadFilter.call(target, data);
				opts.onFetch.call(target, page, data.rows);
				if (data.rows && data.rows.length){
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
				if (!state.data.firstRows.length){
					opts.onFetch.call(target, page, state.data.firstRows);
					opts.onLoadSuccess.call(target, state.data);
				}
			}
		}
	},
	
	populate: function(target){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var dc = state.dc;
		var rowHeight = opts.rowHeight;
		var maxHeight = opts.maxDivHeight;

		if (this.rows.length){
			opts.view.render.call(opts.view, target, dc.body2, false);
			opts.view.render.call(opts.view, target, dc.body1, true);
			
			var body = dc.body1.add(dc.body2);
			var topDiv = body.children('div.datagrid-btable-top');
			var bottomDiv = body.children('div.datagrid-btable-bottom');
			var topHeight = this.index * rowHeight;
			var bottomHeight = state.data.total*rowHeight - this.rows.length*rowHeight - topHeight;
			fillHeight(topDiv, topHeight);
			fillHeight(bottomDiv, bottomHeight);

			state.data.rows = this.rows;
			
			var spos = dc.body2.scrollTop() + opts.deltaTopHeight;
			if (topHeight > opts.maxVisibleHeight){
				opts.deltaTopHeight = topHeight - opts.maxVisibleHeight;
				fillHeight(topDiv, topHeight - opts.deltaTopHeight);
			} else {
				opts.deltaTopHeight = 0;
			}
			if (bottomHeight > opts.maxVisibleHeight){
				fillHeight(bottomDiv, opts.maxVisibleHeight);
			} else if (bottomHeight == 0){
				var lastCount = state.data.total % opts.pageSize;
				if (lastCount){
					fillHeight(bottomDiv, dc.body2.height() - lastCount * rowHeight);
				}
			}

			$(target).datagrid('setSelectionState');
			dc.body2.scrollTop(spos - opts.deltaTopHeight);

			opts.pageNumber = this.page;
			var pager = $(target).datagrid('getPager');
			if (pager.length){
				var popts = pager.pagination('options');
				var displayMsg = popts.displayMsg;
				var msg = displayMsg.replace(/{from}/, this.index+1);
				msg = msg.replace(/{to}/, this.index+this.rows.length);
				pager.pagination('refresh', {
					pageNumber: this.page,
					displayMsg: msg
				});
				popts.displayMsg = displayMsg;
			}
			if (this.setEmptyMsg){
				this.setEmptyMsg(target);
			}
			
			opts.onLoadSuccess.call(target, {
				total: state.data.total,
				rows: this.rows
			});
		}
		function fillHeight(div, height){
			var count = Math.floor(height/maxHeight);
			var leftHeight = height - maxHeight*count;
			if (height < 0){
				leftHeight = 0;
			}
			var cc = [];
			for(var i=0; i<count; i++){
				cc.push('<div style="height:'+maxHeight+'px"></div>');
			}
			cc.push('<div style="height:'+leftHeight+'px"></div>');
			$(div).html(cc.join(''));
		}
	},

	updateRow: function(target, rowIndex, row){
		var opts = $.data(target, 'datagrid').options;
		var rows = $(target).datagrid('getRows');
		var rowData = opts.finder.getRow(target, rowIndex);
		var oldStyle = _getRowStyle(rowIndex);
		$.extend(rowData, row);
		var newStyle = _getRowStyle(rowIndex);
		var oldClassValue = oldStyle.c;
		var styleValue = newStyle.s;
		var classValue = 'datagrid-row ' + (rowIndex % 2 && opts.striped ? 'datagrid-row-alt ' : ' ') + newStyle.c;
		
		function _getRowStyle(rowIndex){
			var css = opts.rowStyler ? opts.rowStyler.call(target, rowIndex, rowData) : '';
			var classValue = '';
			var styleValue = '';
			if (typeof css == 'string'){
				styleValue = css;
			} else if (css){
				classValue = css['class'] || '';
				styleValue = css['style'] || '';
			}
			return {c:classValue, s:styleValue};
		}
		function _update(frozen){
			var fields = $(target).datagrid('getColumnFields', frozen);
			var tr = opts.finder.getTr(target, rowIndex, 'body', (frozen?1:2));
			var checked = tr.find('div.datagrid-cell-check input[type=checkbox]').is(':checked');
			tr.html(this.renderRow.call(this, target, fields, frozen, rowIndex, rowData));
			tr.attr('style', styleValue).removeClass(oldClassValue).addClass(classValue);
			if (checked){
				tr.find('div.datagrid-cell-check input[type=checkbox]')._propAttr('checked', true);
			}
		}
		
		_update.call(this, true);
		_update.call(this, false);
		$(target).datagrid('fixRowHeight', rowIndex);
	},

	// insertRow: function(target, index, row){
	// 	var state = $.data(target, 'datagrid');
	// 	var data = state.data;

	// 	if (index == undefined || index == null) index = data.rows.length;
	// 	if (index > data.rows.length) index = data.rows.length;
	// 	$.fn.datagrid.defaults.view.insertRow.call(this, target, index, row);
	// 	if (data.firstRows && index <= data.firstRows.length){
	// 		data.firstRows.splice(index, 0, row);
	// 	}
	// },
	insertRow: function(target, index, row){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var data = state.data;

		var total = $(target).datagrid('getData').total;
		if (index == null){index = total;}
		if (index > total){index = total;}
		if (data.firstRows && index <= data.firstRows.length){
			data.firstRows.splice(index, 0, row);
		}
		data.total++;

		var rows = this.r1.concat(this.r2);
		if (index < this.index){
			this.reload.call(this, target);
		} else if (index <= this.index+rows.length){
			rows.splice(index - this.index, 0, row);
			this.r1 = rows.splice(0, opts.pageSize);
			if (this.r2.length){
				this.r2 = rows.splice(0, opts.pageSize);
			}
			this.rows = this.r1.concat(this.r2);
			this.populate.call(this, target);
			state.dc.body2.triggerHandler('scroll.datagrid');
		}
	},

	// deleteRow: function(target, index){
	// 	var data = $(target).datagrid('getData');
	// 	$.fn.datagrid.defaults.view.deleteRow.call(this, target, index);
	// 	if (data.firstRows){
	// 		data.firstRows.splice(index, 1);
	// 	}
	// },
	deleteRow: function(target, index){
		var state = $.data(target, 'datagrid');
		var data = state.data;
		var opts = state.options;
		data.total--;
		if (data.firstRows){
			if (index < data.firstRows.length){
				data.firstRows.splice(index, 1);
				if (data.total){
					this.reload.call(this, target);
				} else {
					// $(target).datagrid('loadData', [])
					state.data.rows = [];
					$(state.dc.body1).empty();
					$(state.dc.body2).empty();
					if (this.setEmptyMsg){
						this.setEmptyMsg.call(this, target);
					}
				}
				//this.reload.call(this, target);
				return;
			}
		}

		var rows = this.r1.concat(this.r2);
		if (index < this.index){
			this.reload.call(this, target);
		} else if (index < this.index+rows.length){
			rows.splice(index - this.index, 1);
			this.r1 = rows.splice(0, opts.pageSize);
			if (this.r1.length < opts.pageSize){
				this.reload.call(this, target);
			} else {
				this.r2 = [];
				this.rows = this.r1.concat(this.r2);
				this.populate.call(this, target);
				state.dc.body2.triggerHandler('scroll.datagrid');
			}
		}
	}
});

$.fn.datagrid.methods.baseUpdateRow = $.fn.datagrid.methods.updateRow;
$.fn.datagrid.methods.baseGetRowIndex = $.fn.datagrid.methods.getRowIndex;
$.fn.datagrid.methods.baseScrollTo = $.fn.datagrid.methods.scrollTo;
$.fn.datagrid.methods.baseGotoPage = $.fn.datagrid.methods.gotoPage;
$.fn.datagrid.methods.baseSetSelectionState = $.fn.datagrid.methods.setSelectionState;
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
	},
	updateRow: function(jq, param){
		return jq.each(function(){
			var opts = $(this).datagrid('options');
			var row = opts.finder.getRow(this, param.index);
			if (row){
				$(this).datagrid('baseUpdateRow', param);
			} else {
				var firstRows = $(this).datagrid('getData').firstRows||[];
				if (param.index < firstRows.length){
					$.extend(firstRows[param.index], param.row);
				}
			}
		});
	},
	getRowIndex: function(jq, row){
		var opts = jq.datagrid('options');
		if (opts.view.type == 'scrollview'){
			var data = jq.datagrid('getData');
			if (typeof row == 'object'){
				var index = $.easyui.indexOfArray(data.firstRows, row);
			} else {
				var index = $.easyui.indexOfArray(data.firstRows, opts.idField, row);
			}
			if (index >= 0){
				return index;
			} else {
				index = jq.datagrid('baseGetRowIndex', row);
				return (index == -1) ? -1 : index+opts.view.index;
			}
		} else {
			return jq.datagrid('baseGetRowIndex', row);
		}
	},
	getRow: function(jq, index){
		return jq.datagrid('options').finder.getRow(jq[0], index);
	},
	gotoPage: function(jq, param){
		return jq.each(function(){
			var target = this;
			var opts = $(target).datagrid('options');
			if (opts.view.type == 'scrollview'){
				var page, callback;
				if (typeof param == 'object'){
					page = param.page;
					callback = param.callback;
				} else {
					page = param;
				}
				opts.view.getRows.call(opts.view, target, page, function(rows){
					this.page = page;
					this.index = (page-1)*opts.pageSize;
					this.rows = rows;
					this.r1 = rows;
					this.r2 = [];
					this.populate.call(this, target);
					$(target).data('datagrid').dc.body2.scrollTop(this.index * opts.rowHeight - opts.deltaTopHeight);
					if (callback){
						callback.call(target, page);
					}
				});
			} else {
				$(target).datagrid('baseGotoPage', param);
			}
		});
	},
	scrollTo: function(jq, param){
		return jq.each(function(){
			var target = this;
			var opts = $(target).datagrid('options');
			var index, callback;
			if (typeof param == 'object'){
				index = param.index;
				callback = param.callback;
			} else {
				index = param;
			}
			var view = opts.view;
			if (view.type == 'scrollview'){
				if (index >= view.index && index < view.index+view.rows.length){
					$(target).datagrid('baseScrollTo', index);
					if (callback){
						callback.call(target, index);
					}
				} else if (index >= 0){
					var page = Math.floor(index/opts.pageSize) + 1;
					$(target).datagrid('gotoPage', {
						page: page,
						callback: function(){
							setTimeout(function(){
								$(target).datagrid('baseScrollTo', index);
								if (callback){
									callback.call(target, index);
								}
							}, 0);							
						}
					});
				}
			} else {
				$(target).datagrid('baseScrollTo', index);
				if (callback){
					callback.call(target, index);
				}
			}
		});
	},
	setSelectionState: function(jq){
		return jq.each(function(){
			var target = this;
			var opts = $(target).datagrid('options');
			if (opts.view.type == 'scrollview'){
				$(target).datagrid('baseSetSelectionState');
				var state = $(target).data('datagrid');
				if (state.data.firstRows.length != state.checkedRows.length){
					var dc = state.dc;
					dc.header1.add(dc.header2).find('input[type=checkbox]')._propAttr('checked', false);
				}
			} else {
				$(target).datagrid('baseSetSelectionState');
			}
		})
	}
});

$.extend($.fn.datagrid.methods, {
	fixDetailRowHeight: function(jq, index){
		return jq.each(function(){
			var opts = $.data(this, 'datagrid').options;
			var dc = $.data(this, 'datagrid').dc;
			var tr1 = opts.finder.getTr(this, index, 'body', 1).next();
			var tr2 = opts.finder.getTr(this, index, 'body', 2).next();
			// fix the detail row height
			if (tr2.is(':visible')){
				tr1.css('height', '');
				tr2.css('height', '');
				var height = Math.max(tr1.height(), tr2.height());
				tr1.css('height', height);
				tr2.css('height', height);
			}
			dc.body2.triggerHandler('scroll');
		});
	},
	getExpander: function(jq, index){	// get row expander object
		var opts = $.data(jq[0], 'datagrid').options;
		return opts.finder.getTr(jq[0], index).find('span.datagrid-row-expander');
	},
	// get row detail container
	getRowDetail: function(jq, index){
		var opts = $.data(jq[0], 'datagrid').options;
		var tr = opts.finder.getTr(jq[0], index, 'body', 2);
		return tr.next().find('div.datagrid-row-detail');
	},
	expandRow: function(jq, index){
		return jq.each(function(){
			var opts = $(this).datagrid('options');
			var dc = $.data(this, 'datagrid').dc;
			var expander = $(this).datagrid('getExpander', index);
			if (expander.hasClass('datagrid-row-expand')){
				expander.removeClass('datagrid-row-expand').addClass('datagrid-row-collapse');
				var tr1 = opts.finder.getTr(this, index, 'body', 1).next();
				var tr2 = opts.finder.getTr(this, index, 'body', 2).next();
				tr1.show();
				tr2.show();
				$(this).datagrid('fixDetailRowHeight', index);
				if (opts.onExpandRow){
					var row = $(this).datagrid('getRows')[index];
					opts.onExpandRow.call(this, index, row);
				}
			}
		});
	},
	collapseRow: function(jq, index){
		return jq.each(function(){
			var opts = $(this).datagrid('options');
			var dc = $.data(this, 'datagrid').dc;
			var expander = $(this).datagrid('getExpander', index);
			if (expander.hasClass('datagrid-row-collapse')){
				expander.removeClass('datagrid-row-collapse').addClass('datagrid-row-expand');
				var tr1 = opts.finder.getTr(this, index, 'body', 1).next();
				var tr2 = opts.finder.getTr(this, index, 'body', 2).next();
				tr1.hide();
				tr2.hide();
				dc.body2.triggerHandler('scroll');
				if (opts.onCollapseRow){
					var row = $(this).datagrid('getRows')[index];
					opts.onCollapseRow.call(this, index, row);
				}
			}
		});
	}
});
