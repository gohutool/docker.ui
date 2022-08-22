(function($){
	$.extend($.fn.datagrid.defaults, {
		clickToEdit: true,
		dblclickToEdit: false,
		navHandler: {
			'37': function(e){
				var opts = $(this).datagrid('options');
				return navHandler.call(this, e, opts.isRtl?'right':'left');
			},
			'39': function(e){
				var opts = $(this).datagrid('options');
				return navHandler.call(this, e, opts.isRtl?'left':'right');
			},
			'38': function(e){
				return navHandler.call(this, e, 'up');
			},
			'40': function(e){
				return navHandler.call(this, e, 'down');
			},
			'13': function(e){
				return enterHandler.call(this, e);
			},
			'27': function(e){
				return escHandler.call(this, e);
			},
			'8': function(e){
				return clearHandler.call(this, e);
			},
			'46': function(e){
				return clearHandler.call(this, e);
			},
			'keypress': function(e){
				if (e.metaKey || e.ctrlKey){
					return;
				}
				var dg = $(this);
				var param = dg.datagrid('cell');	// current cell information
				if (!param){return;}
				var input = dg.datagrid('input', param);
				if (!input){
					var tmp = $('<span></span>');
					tmp.html(String.fromCharCode(e.which));
					var c = tmp.text();
					tmp.remove();
					if (c){
						dg.datagrid('editCell', {
							index: param.index,
							field: param.field,
							value: c
						});
						return false;					
					}
				}
			}
		},
		onBeforeCellEdit: function(index, field){},
		onCellEdit: function(index, field, value){
			var input = $(this).datagrid('input', {index:index, field:field});
			if (input){
				if (value != undefined){
					input.val(value);
				}
			}
		},
		onSelectCell: function(index, field){},
		onUnselectCell: function(index, field){}
	});

	function navHandler(e, dir){
		var dg = $(this);
		var param = dg.datagrid('cell');
		var input = dg.datagrid('input', param);
		if (!input){
			dg.datagrid('gotoCell', dir);
			return false;
		}
	}

	function enterHandler(e){
		var dg = $(this);
		var cell = dg.datagrid('cell');
		if (!cell){return;}
		var input = dg.datagrid('input', cell);
		if (input){
			if (input[0].tagName.toLowerCase() == 'textarea'){
				return;
			}
			endCellEdit(this, true);
		} else {
			dg.datagrid('editCell', cell);
		}
		return false;
	}

	function escHandler(e){
		endCellEdit(this, false);
		return false;
	}

	function clearHandler(e){
		var dg = $(this);
		var param = dg.datagrid('cell');
		if (!param){return;}
		var input = dg.datagrid('input', param);
		if (!input){
			dg.datagrid('editCell', {
				index: param.index,
				field: param.field,
				value: ''
			});
			return false;
		}		
	}

	function getCurrCell(target){
		var cell = $(target).datagrid('getPanel').find('td.datagrid-row-selected');
		if (cell.length){
			return {
				index: parseInt(cell.closest('tr.datagrid-row').attr('datagrid-row-index')),
				field: cell.attr('field')
			};
		} else {
			return null;
		}
	}

	function unselectCell(target, p){
		var opts = $(target).datagrid('options');
		var cell = opts.finder.getTr(target, p.index).find('td[field="'+p.field+'"]');
		cell.removeClass('datagrid-row-selected');
		opts.onUnselectCell.call(target, p.index, p.field);
	}

	function unselectAllCells(target){
		var panel = $(target).datagrid('getPanel');
		panel.find('td.datagrid-row-selected').removeClass('datagrid-row-selected');
	}

	function selectCell(target, p){
		var opts = $(target).datagrid('options');
		if (opts.singleSelect){
			unselectAllCells(target);
		}
		var cell = opts.finder.getTr(target, p.index).find('td[field="'+p.field+'"]');
		cell.addClass('datagrid-row-selected');
		opts.onSelectCell.call(target, p.index, p.field);
	}

	function getSelectedCells(target){
		var cells = [];
		var panel = $(target).datagrid('getPanel');
		panel.find('td.datagrid-row-selected').each(function(){
			var td = $(this);
			cells.push({
				index: parseInt(td.closest('tr.datagrid-row').attr('datagrid-row-index')),
				field: td.attr('field')
			});
		});
		return cells;
	}

	function gotoCell(target, p){
		var dg = $(target);
		var opts = dg.datagrid('options');
		var panel = dg.datagrid('getPanel').focus();

		var cparam = dg.datagrid('cell');
		if (cparam){
			var input = dg.datagrid('input', cparam);
			if (input){
				input.focus();
				return;
			}
		}

		if (typeof p == 'object'){
			_go(p);
			return;
		}
		var cell = panel.find('td.datagrid-row-selected');
		if (!cell){return;}
		var fields = dg.datagrid('getColumnFields',true).concat(dg.datagrid('getColumnFields'));
		var field = cell.attr('field');
		var tr = cell.closest('tr.datagrid-row');
		var rowIndex = parseInt(tr.attr('datagrid-row-index'));
		var colIndex = $.inArray(field, fields);

		if (p == 'up' && rowIndex > 0){
			rowIndex--;
		} else if (p == 'down'){
			if (opts.finder.getRow(target, rowIndex+1)){
				rowIndex++;
			}
		} else if (p == 'left'){
			var i = colIndex - 1;
			while(i >= 0){
				var col = dg.datagrid('getColumnOption', fields[i]);
				if (!col.hidden){
					colIndex = i;
					break;
				}
				i--;
			}
		} else if (p == 'right'){
			var i = colIndex + 1;
			while(i <= fields.length-1){
				var col = dg.datagrid('getColumnOption', fields[i]);
				if (!col.hidden){
					colIndex = i;
					break;
				}
				i++;
			}
		}

		field = fields[colIndex];

		_go({index:rowIndex, field:field});

		function _go(p){
			dg.datagrid('scrollTo', p.index);
			unselectAllCells(target);
			selectCell(target, p);
			var td = opts.finder.getTr(target, p.index, 'body', 2).find('td[field="'+p.field+'"]');
			if (td.length){
				var body2 = dg.data('datagrid').dc.body2;
				var left = td.position().left;
				if (left < 0){
					body2._scrollLeft(body2._scrollLeft() + left*(opts.isRtl?-1:1));
				} else if (left+td._outerWidth()>body2.width()){
					body2._scrollLeft(body2._scrollLeft() + (left+td._outerWidth()-body2.width())*(opts.isRtl?-1:1));
				}
			}
		}
	}

	// end the current cell editing
	function endCellEdit(target, accepted){
		var dg = $(target);
		var cell = dg.datagrid('cell');
		if (cell){
			var input = dg.datagrid('input', cell);
			if (input){
				if (accepted){
					if (dg.datagrid('validateRow', cell.index)){
						dg.datagrid('endEdit', cell.index);
						dg.datagrid('gotoCell', cell);
					} else {
						dg.datagrid('gotoCell', cell);
						input.focus();
						return false;
					}
				} else {
					dg.datagrid('cancelEdit', cell.index);
					dg.datagrid('gotoCell', cell);
				}
			}
		}
		return true;
	}

	function editCell(target, param){
		var dg = $(target);
		var opts = dg.datagrid('options');
		var input = dg.datagrid('input', param);
		if (input){
			dg.datagrid('gotoCell', param);
			input.focus();
			return;
		}
		if (!endCellEdit(target, true)){return;}
		if (opts.onBeforeCellEdit.call(target, param.index, param.field) == false){
			return;
		}

		var fields = dg.datagrid('getColumnFields',true).concat(dg.datagrid('getColumnFields'));
		$.map(fields, function(field){
			var col = dg.datagrid('getColumnOption', field);
			col.editor1 = col.editor;
			if (field != param.field){
				col.editor = null;
			}
		});

		var col = dg.datagrid('getColumnOption', param.field);
		if (col.editor){
			dg.datagrid('beginEdit', param.index);
			var input = dg.datagrid('input', param);
			if (input){
				dg.datagrid('gotoCell', param);
				setTimeout(function(){
					input.unbind('.cellediting').bind('keydown.cellediting', function(e){
						if (e.keyCode == 13){
							return opts.navHandler['13'].call(target, e);
							// return false;
						}
					});
					input.focus();
				}, 0);
				opts.onCellEdit.call(target, param.index, param.field, param.value);
			} else {
				dg.datagrid('cancelEdit', param.index);
				dg.datagrid('gotoCell', param);
			}
		} else {
			dg.datagrid('gotoCell', param);
		}

		$.map(fields, function(field){
			var col = dg.datagrid('getColumnOption', field);
			col.editor = col.editor1;
		});
	}

	function enableCellSelecting(target){
		var dg = $(target);
		var state = dg.data('datagrid');
		var panel = dg.datagrid('getPanel');
		var opts = state.options;
		var dc = state.dc;
		panel.attr('tabindex',1).css('outline-style','none').unbind('.cellediting').bind('keydown.cellediting', function(e){
			var h = opts.navHandler[e.keyCode];
			if (h){
				return h.call(target, e);
			}
		});
		dc.body1.add(dc.body2).unbind('.cellediting').bind('click.cellediting', function(e){
			var tr = $(e.target).closest('.datagrid-row');
			if (tr.length && tr.parent().length){
				var td = $(e.target).closest('td[field]', tr);
				if (td.length){
					var index = parseInt(tr.attr('datagrid-row-index'));
					var field = td.attr('field');
					var p = {
						index: index,
						field: field
					};
					if (opts.singleSelect){
						selectCell(target, p);
					} else {
						if (opts.ctrlSelect){
							if (e.ctrlKey){
								if (td.hasClass('datagrid-row-selected')){
									unselectCell(target, p);
								} else {
									selectCell(target, p);
								}
							} else {
								unselectAllCells(target);
								selectCell(target, p);
							}
						} else {
							if (td.hasClass('datagrid-row-selected')){
								unselectCell(target, p);
							} else {
								selectCell(target, p);
							}
						}
					}
				}
			}
		}).bind('mouseover.cellediting', function(e){
			var td = $(e.target).closest('td[field]');
			if (td.length){
				td.addClass('datagrid-row-over');
				td.closest('tr.datagrid-row').removeClass('datagrid-row-over');
			}
		}).bind('mouseout.cellediting', function(e){
			var td = $(e.target).closest('td[field]');
			td.removeClass('datagrid-row-over');
		});

		opts.isRtl = dg.datagrid('getPanel').css('direction').toLowerCase()=='rtl';
		opts.OldOnBeforeSelect = opts.onBeforeSelect;
		opts.onBeforeSelect = function(){
			return false;
		};
		dg.datagrid('clearSelections');
	}

	function disableCellSelecting(target){
		var dg = $(target);
		var state = dg.data('datagrid');
		var panel = dg.datagrid('getPanel');
		var opts = state.options;
		opts.onBeforeSelect = opts.OldOnBeforeSelect || opts.onBeforeSelect;
		panel.unbind('.cellediting').find('td.datagrid-row-selected').removeClass('datagrid-row-selected');
		var dc = state.dc;
		dc.body1.add(dc.body2).unbind('.cellediting');
	}

	function enableCellEditing(target){
		var dg = $(target);
		var opts = dg.datagrid('options');
		var panel = dg.datagrid('getPanel');
		panel.attr('tabindex',1).css('outline-style','none').unbind('.cellediting').bind('keydown.cellediting', function(e){
			var h = opts.navHandler[e.keyCode];
			if (h){
				return h.call(target, e);
			}
		}).bind('keypress.cellediting', function(e){
			return opts.navHandler['keypress'].call(target, e);
		});
		panel.panel('panel').unbind('.cellediting').bind('keydown.cellediting', function(e){
			e.stopPropagation();
		}).bind('keypress.cellediting', function(e){
			e.stopPropagation();
		}).bind('mouseover.cellediting', function(e){
			var td = $(e.target).closest('td[field]');
			if (td.length){
				td.addClass('datagrid-row-over');
				td.closest('tr.datagrid-row').removeClass('datagrid-row-over');
			}
		}).bind('mouseout.cellediting', function(e){
			var td = $(e.target).closest('td[field]');
			td.removeClass('datagrid-row-over');
		});

		opts.isRtl = dg.datagrid('getPanel').css('direction').toLowerCase()=='rtl';
		opts.oldOnClickCell = opts.onClickCell;
		opts.oldOnDblClickCell = opts.onDblClickCell;
		opts.onClickCell = function(index, field, value){
			if (opts.clickToEdit){
				$(this).datagrid('editCell', {index:index,field:field});
			} else {
				if (endCellEdit(this, true)){
					$(this).datagrid('gotoCell', {
						index: index,
						field: field
					});
				}
			}
			opts.oldOnClickCell.call(this, index, field, value);
		}
		if (opts.dblclickToEdit){
			opts.onDblClickCell = function(index, field, value){
				$(this).datagrid('editCell', {index:index,field:field});
				opts.oldOnDblClickCell.call(this, index, field, value);
			}
		}
		opts.OldOnBeforeSelect = opts.onBeforeSelect;
		opts.onBeforeSelect = function(){
			return false;
		};
		dg.datagrid('clearSelections')
	}

	function disableCellEditing(target){
		var dg = $(target);
		var panel = dg.datagrid('getPanel');
		var opts = dg.datagrid('options');
		opts.onClickCell = opts.oldOnClickCell || opts.onClickCell;
		opts.onDblClickCell = opts.oldOnDblClickCell || opts.onDblClickCell;
		opts.onBeforeSelect = opts.OldOnBeforeSelect || opts.onBeforeSelect;
		panel.unbind('.cellediting').find('td.datagrid-row-selected').removeClass('datagrid-row-selected');
		panel.panel('panel').unbind('.cellediting');
	}


	$.extend($.fn.datagrid.methods, {
		editCell: function(jq, param){
			return jq.each(function(){
				editCell(this, param);
			});
		},
		isEditing: function(jq, index){
			var opts = $.data(jq[0], 'datagrid').options;
			var tr = opts.finder.getTr(jq[0], index);
			return tr.length && tr.hasClass('datagrid-row-editing');
		},
		gotoCell: function(jq, param){
			return jq.each(function(){
				gotoCell(this, param);
			});
		},
		enableCellEditing: function(jq){
			return jq.each(function(){
				enableCellEditing(this);
			});
		},
		disableCellEditing: function(jq){
			return jq.each(function(){
				disableCellEditing(this);
			});
		},
		enableCellSelecting: function(jq){
			return jq.each(function(){
				enableCellSelecting(this);
			});
		},
		disableCellSelecting: function(jq){
			return jq.each(function(){
				disableCellSelecting(this);
			});
		},
		input: function(jq, param){
			if (!param){return null;}
			var ed = jq.datagrid('getEditor', param);
			if (ed){
				var t = $(ed.target);
				if (t.hasClass('textbox-f')){
					t = t.textbox('textbox');
				}
				return t;
			} else {
				return null;
			}
		},
		cell: function(jq){		// get current cell info {index,field}
			return getCurrCell(jq[0]);
		},
		getSelectedCells: function(jq){
			return getSelectedCells(jq[0]);
		}
	});

})(jQuery);
