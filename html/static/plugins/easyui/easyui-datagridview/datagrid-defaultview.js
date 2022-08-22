var defaultView = {
	render: function(target, container, frozen){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var rows = state.data.rows;
		var fields = $(target).datagrid('getColumnFields', frozen);
		
		if (frozen){
			if (!(opts.rownumbers || (opts.frozenColumns && opts.frozenColumns.length))){
				return;
			}
		}
		
		var table = ['<table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0"><tbody>'];
		for(var i=0; i<rows.length; i++) {
			// get the class and style attributes for this row
			var css = opts.rowStyler ? opts.rowStyler.call(target, i, rows[i]) : '';
			var classValue = '';
			var styleValue = '';
			if (typeof css == 'string'){
				styleValue = css;
			} else if (css){
				classValue = css['class'] || '';
				styleValue = css['style'] || '';
			}
			
			var cls = 'class="datagrid-row ' + (i % 2 && opts.striped ? 'datagrid-row-alt ' : ' ') + classValue + '"';
			var style = styleValue ? 'style="' + styleValue + '"' : '';
			var rowId = state.rowIdPrefix + '-' + (frozen?1:2) + '-' + i;
			table.push('<tr id="' + rowId + '" datagrid-row-index="' + i + '" ' + cls + ' ' + style + '>');
			table.push(this.renderRow.call(this, target, fields, frozen, i, rows[i]));
			table.push('</tr>');
		}
		table.push('</tbody></table>');
		
		$(container).html(table.join(''));
	},
	
	renderFooter: function(target, container, frozen){
		var opts = $.data(target, 'datagrid').options;
		var rows = $.data(target, 'datagrid').footer || [];
		var fields = $(target).datagrid('getColumnFields', frozen);
		var table = ['<table class="datagrid-ftable" cellspacing="0" cellpadding="0" border="0"><tbody>'];
		
		for(var i=0; i<rows.length; i++){
			table.push('<tr class="datagrid-row" datagrid-row-index="' + i + '">');
			table.push(this.renderRow.call(this, target, fields, frozen, i, rows[i]));
			table.push('</tr>');
		}
		
		table.push('</tbody></table>');
		$(container).html(table.join(''));
	},
	
	renderRow: function(target, fields, frozen, rowIndex, rowData){
		var opts = $.data(target, 'datagrid').options;
		
		var cc = [];
		if (frozen && opts.rownumbers){
			var rownumber = rowIndex + 1;
			if (opts.pagination){
				rownumber += (opts.pageNumber-1)*opts.pageSize;
			}
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
					var style = '';
				} else {
					var style = styleValue;
					if (col.align){style += ';text-align:' + col.align + ';'}
					if (!opts.nowrap){
						style += ';white-space:normal;height:auto;';
					} else if (opts.autoRowHeight){
						style += ';height:auto;';
					}
				}
				
				cc.push('<div style="' + style + '" ');
				cc.push(col.checkbox ? 'class="datagrid-cell-check"' : 'class="datagrid-cell ' + col.cellClass + '"');
				cc.push('>');
				
				if (col.checkbox){
					cc.push('<input type="checkbox" name="' + field + '" value="' + (value!=undefined ? value : '') + '">');
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
	
	refreshRow: function(target, rowIndex){
		this.updateRow.call(this, target, rowIndex, {});
	},
	
	updateRow: function(target, rowIndex, row){
		var opts = $.data(target, 'datagrid').options;
		var rows = $(target).datagrid('getRows');
		$.extend(rows[rowIndex], row);
		var css = opts.rowStyler ? opts.rowStyler.call(target, rowIndex, rows[rowIndex]) : '';
		var classValue = '';
		var styleValue = '';
		if (typeof css == 'string'){
			styleValue = css;
		} else if (css){
			classValue = css['class'] || '';
			styleValue = css['style'] || '';
		}
		var classValue = 'datagrid-row ' + (rowIndex % 2 && opts.striped ? 'datagrid-row-alt ' : ' ') + classValue;
		
		function _update(frozen){
			var fields = $(target).datagrid('getColumnFields', frozen);
			var tr = opts.finder.getTr(target, rowIndex, 'body', (frozen?1:2));
			var checked = tr.find('div.datagrid-cell-check input[type=checkbox]').is(':checked');
			tr.html(this.renderRow.call(this, target, fields, frozen, rowIndex, rows[rowIndex]));
			tr.attr('style', styleValue).attr('class', classValue);
			if (checked){
				tr.find('div.datagrid-cell-check input[type=checkbox]')._propAttr('checked', true);
			}
		}
		
		_update.call(this, true);
		_update.call(this, false);
		$(target).datagrid('fixRowHeight', rowIndex);
	},
	
	insertRow: function(target, index, row){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var dc = state.dc;
		var data = state.data;
		
		if (index == undefined || index == null) index = data.rows.length;
		if (index > data.rows.length) index = data.rows.length;
		
		function _incIndex(frozen){
			var serno = frozen?1:2;
			for(var i=data.rows.length-1; i>=index; i--){
				var tr = opts.finder.getTr(target, i, 'body', serno);
				tr.attr('datagrid-row-index', i+1);
				tr.attr('id', state.rowIdPrefix + '-' + serno + '-' + (i+1));
				if (frozen && opts.rownumbers){
					var rownumber = i+2;
					if (opts.pagination){
						rownumber += (opts.pageNumber-1)*opts.pageSize;
					}
					tr.find('div.datagrid-cell-rownumber').html(rownumber);
				}
				if (opts.striped){
					tr.removeClass('datagrid-row-alt').addClass((i+1)%2 ? 'datagrid-row-alt' : '');
				}
			}
		}
		
		function _insert(frozen){
			var serno = frozen?1:2;
			var fields = $(target).datagrid('getColumnFields', frozen);
			var rowId = state.rowIdPrefix + '-' + serno + '-' + index;
			var tr = '<tr id="' + rowId + '" class="datagrid-row" datagrid-row-index="' + index + '"></tr>';
//				var tr = '<tr id="' + rowId + '" class="datagrid-row" datagrid-row-index="' + index + '">' + this.renderRow.call(this, target, fields, frozen, index, row) + '</tr>';
			if (index >= data.rows.length){	// append new row
				if (data.rows.length){	// not empty
					opts.finder.getTr(target, '', 'last', serno).after(tr);
				} else {
					var cc = frozen ? dc.body1 : dc.body2;
					cc.html('<table cellspacing="0" cellpadding="0" border="0"><tbody>' + tr + '</tbody></table>');
				}
			} else {	// insert new row
				opts.finder.getTr(target, index+1, 'body', serno).before(tr);
			}
		}
		
		_incIndex.call(this, true);
		_incIndex.call(this, false);
		_insert.call(this, true);
		_insert.call(this, false);
		
		data.total += 1;
		data.rows.splice(index, 0, row);
		
		this.refreshRow.call(this, target, index);
	},
	
	deleteRow: function(target, index){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var data = state.data;
		
		function _decIndex(frozen){
			var serno = frozen?1:2;
			for(var i=index+1; i<data.rows.length; i++){
				var tr = opts.finder.getTr(target, i, 'body', serno);
				tr.attr('datagrid-row-index', i-1);
				tr.attr('id', state.rowIdPrefix + '-' + serno + '-' + (i-1));
				if (frozen && opts.rownumbers){
					var rownumber = i;
					if (opts.pagination){
						rownumber += (opts.pageNumber-1)*opts.pageSize;
					}
					tr.find('div.datagrid-cell-rownumber').html(rownumber);
				}
				if (opts.striped){
					tr.removeClass('datagrid-row-alt').addClass((i-1)%2 ? 'datagrid-row-alt' : '');
				}
			}
		}
		
		opts.finder.getTr(target, index).remove();
		_decIndex.call(this, true);
		_decIndex.call(this, false);
		
		data.total -= 1;
		data.rows.splice(index,1);
	},
	
	onBeforeRender: function(target, rows){},
	onAfterRender: function(target){
		var opts = $.data(target, 'datagrid').options;
		if (opts.showFooter){
			var footer = $(target).datagrid('getPanel').find('div.datagrid-footer');
			footer.find('div.datagrid-cell-rownumber,div.datagrid-cell-check').css('visibility', 'hidden');
		}
	}
};
