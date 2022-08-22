/**
 * etree - jQuery EasyUI
 * 
 * Licensed under the GPL:
 *   http://www.gnu.org/licenses/gpl.txt
 *
 * Copyright 2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 *   tree
 *   messager
 * 
 */
(function($){
	function createTree(target){
		var opts = $.data(target, 'etree').options;
		
		$(target).tree($.extend({}, opts, {
			onDblClick: function(node){
				$(this).tree('beginEdit', node.target);
			},
			onBeforeEdit: function(node){
				if (opts.onBeforeEdit.call(target, node) == false) return false;
				$(this).tree('disableDnd');
			},
			onAfterEdit: function(node){
				$.ajax({
					url: opts.updateUrl,
					type: 'post',
					dataType: 'json',
					data: {
						id: node.id,
						text: node.text
					}
				});
				$(this).tree('enableDnd');
				opts.onAfterEdit.call(target, node);
			},
			onCancelEdit: function(node){
				$(this).tree('enableDnd');
				opts.onCancelEdit.call(target, node);
			},
			onDrop: function(targetNode, source, point){
				var targetId = $(target).tree('getNode', targetNode).id;
				$.ajax({
					url: opts.dndUrl,
					type: 'post',
					dataType: 'json',
					data: {
						id: source.id,
						targetId: targetId,
						point: point
					}
				});
				opts.onDrop.call(target, targetNode, source, point);
			}
		}));
	}
	
	$.fn.etree = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.etree.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.tree(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'etree');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'etree', {
					options: $.extend({}, $.fn.etree.defaults, $.fn.etree.parseOptions(this), options)
				});
			}
			createTree(this);
		});
	};
	
	$.fn.etree.methods = {
		options: function(jq){
			return $.data(jq[0], 'etree').options;
		},
		create: function(jq){
			return jq.each(function(){
				var opts = $.data(this, 'etree').options;
				var tree = $(this);
				var node = tree.tree('getSelected');
				$.ajax({
					url: opts.createUrl,
					type: 'post',
					dataType: 'json',
					data: {
						parentId: (node ? node.id : 0)
					},
					success: function(data){
						tree.tree('append', {
							parent: (node ? node.target : null),
							data: [data]
						});
					}
				});
			});
		},
		edit: function(jq){
			return jq.each(function(){
				var opts = $.data(this, 'etree').options;
				var node = $(this).tree('getSelected');
				if (node){
					$(this).tree('beginEdit', node.target);
				} else {
					$.messager.show({
						title:opts.editMsg.norecord.title,
						msg:opts.editMsg.norecord.msg
					});
				}
			});
		},
		destroy: function(jq){
			return jq.each(function(){
				var opts = $.data(this, 'etree').options;
				var tree = $(this);
				var node = tree.tree('getSelected');
				if (node){
					$.messager.confirm(opts.destroyMsg.confirm.title,opts.destroyMsg.confirm.msg, function(r){
						if (r){
							if (opts.destroyUrl){
								$.post(opts.destroyUrl, {id:node.id}, function(){
									tree.tree('remove', node.target);
								});
							} else {
								tree.tree('remove', node.target);
							}
						}
					});
				} else {
					$.messager.show({
						title:opts.destroyMsg.norecord.title,
						msg:opts.destroyMsg.norecord.msg
					});
				}
			});
		}
	};
	
	$.fn.etree.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.tree.parseOptions(target), {
			createUrl: (t.attr('createUrl') ? t.attr('createUrl') : undefined),
			updateUrl: (t.attr('updateUrl') ? t.attr('updateUrl') : undefined),
			destroyUrl: (t.attr('destroyUrl') ? t.attr('destroyUrl') : undefined),
			dndUrl: (t.attr('dndUrl') ? t.attr('dndUrl') : undefined)
		});
	};
	
	$.fn.etree.defaults = $.extend({}, $.fn.tree.defaults, {
		editMsg:{
			norecord:{
				title:'Warning',
				msg:'No node is selected.'
			}
		},
		destroyMsg:{
			norecord:{
				title:'Warning',
				msg:'No node is selected.'
			},
			confirm:{
				title:'Confirm',
				msg:'Are you sure you want to delete?'
			}
		},
	
		dnd:true,
		url:null,	// return tree data
		createUrl:null,	// post parentId, return the created node data{id,text,...}
		updateUrl:null,	// post id,text, return updated node data.
		destroyUrl:null,	// post id, return {success:true}
		dndUrl:null	// post id,targetId,point, return {success:true}
	});
})(jQuery);