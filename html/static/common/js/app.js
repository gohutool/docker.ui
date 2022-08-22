window._ms = new Date().getTime();

$.app = {};

$.app.trace = function(obj){
	$.app.debug(obj);
}

$.app.debug = function(info) {

	if (window.APP_DEBUG || window.APP_DEBUG.toUpperCase() == 'TRUE') {
		if (window.console) {
			window.console.debug(info);
		}
	}
}

$.app.debug_costing = function(title){
	var costing = (new Date().getTime() - _ms);
	$.app.debug($.extends.isEmpty(title, 'debug') + ' cost ' + costing + 'ms');

	return costing;
}

$.app.err = function(info) {

	if (window.APP_DEBUG || window.APP_DEBUG.toUpperCase() == 'TRUE') {
		if (window.console) {
			window.console.info("Error : *************************** "+ info);
		}
	}
}


ERROR_INFO_TEMP = message.core.info.error_info_temp; //'{0}，错误代码{1}，请联系系统管理员';
ERROR_INFO = function(code){
	if (arguments.length == 1 ){
	    //var arg = [];
	    //arg.push(ERROR_CODE[code]);
	    //$.each(arguments, function(k,v){
	    //    arg.push(v);
	    //});
	    //return ERROR_INFO_TEMP.format(arg);
		return ERROR_INFO_TEMP.format(ERROR_CODE[code], code);
	}

	var key = arguments[0];
	var msg = ERROR_CODE[key];
	var newArr = Array.prototype.slice.call(arguments);
	newArr.shift();
	msg = msg.format.apply(msg, newArr);

	return ERROR_INFO_TEMP.format(msg, code);
}

/**
 * override JQuery.ajax()
 */

function dispatchErrorMsg(msg){
	if($.extends.isEmpty(msg))
		$.app.show(ERROR_INFO('-99999'));
	else
		$.app.show(msg);
}

function prepareData4Result(data, defaultStatus){

    if(!$.isPlainObject(data))
        return ;

    if(defaultStatus==null)
        defaultStatus = 0;

    if(data!=null){
        data.resp_code = (data.resp_code==null?defaultStatus:data.resp_code);
    	data.resp_msg = data.resp_msg||data.error_description||data.message||'';

        data.status=(data.status==null?data.resp_code:data.status);
        data.status=(data.status==null?defaultStatus:data.status);

        data.msg=(data.msg==null?data.resp_msg:data.msg);
        data.msg=(data.msg==null?'':data.msg);
    }
}

function doError(_error, request, _url, ignoreerror, _success) {
	if (_error) {
		if (request.responseJSON) {
			var data = request.responseJSON;
			data.statusCode = request.status;
			prepareData4Result(data, -1);
			//dispatchErrorMsg(data.msg);
			_error.call(this, data, request.status, request);
		} else {
			var data = {};
			data.statusCode = request.status;
			prepareData4Result(data, -1);
			//dispatchErrorMsg(request.responseText);
			_error.call(this, data, request.status, request);
		}
		$.app.err(ERROR_INFO('-10086', _url));
	} else {
		if (request.responseJSON) {
			if (ignoreerror && _success) {
				var data = request.responseJSON;
				data.statusCode = request.status;
				data.msg = data.msg || data.resp_msg || data.error_description || data.message;
				data.resp_msg = data.resp_msg || data.error_description || data.message;
				prepareData4Result(data, -1);
				_success.apply(this, [data, request.status, request]);
			} else {
				var data = request.responseJSON;
				data.statusCode = request.status;
				data.msg = data.msg || data.resp_msg || data.error_description || data.message;
				data.resp_msg = data.resp_msg || data.error_description || data.message;
				prepareData4Result(data, -1);

				if (request.responseJSON.resp_code > 0
					&& request.responseJSON.resp_msg) {
					dispatchErrorMsg(request.responseJSON.resp_msg);
					$.app.err(ERROR_INFO('-18000', _url, request.responseJSON.resp_msg));
				} else if (request.responseJSON.error_description) {
					dispatchErrorMsg(request.responseJSON.error_description);
					$.app.err(ERROR_INFO('-18000', _url, request.responseJSON.error_description));
				} else if (request.responseJSON.message) {
					dispatchErrorMsg(request.responseJSON.message);
					$.app.err(ERROR_INFO('-18000', _url, request.responseJSON.message));
				} else if (request.responseJSON.msg) {
					dispatchErrorMsg(request.responseJSON.msg);
					$.app.err(ERROR_INFO('-18000', _url, request.responseJSON.msg));
				} else {
					dispatchErrorMsg(request.responseText);
					$.app.err(ERROR_INFO('-18000', _url, request.responseText));
				}
			}
		} else {
			if (ignoreerror && _success) {
				let data = {};
				data.statusCode = request.status;
				data.msg = request.responseText;
				data.resp_msg = request.responseText;
				data.resp_code = -1;
				data.status = -1;
				_success.apply(this, [data, request.status, request]);
			}else{
				dispatchErrorMsg(ERROR_INFO('-10086', 'rpc-call'));
				if (request.responseText) {
					$.app.err(ERROR_INFO('-10086', _url) + ' text : ' + request.responseText);
				} else {

					$.app.err(ERROR_INFO('-10086', _url));
				}
			}
		}
	}
}


$.app.beforeRequest = function (options){
	console.log(options)
}

$.app.afterSuccess = function (response){
	console.log(response)
}

$.app.afterError = function (response){
	console.log(response)
}

initAjax = function(){
	$.app.jqueryAjax = $.ajax;

	$.ajax = function(url, options){

		if ( typeof url === "object" ) {
            options = url;
            url = undefined;
        }

		options = options || {};


		var _url = options.url;
		if($.extends.isEmpty(_url))
			_url = url;

		var ms = new Date().getTime();

		var afterSendfn = function(){
			if(!$.extends.isEmpty(options.progressing)){
				$.app.closeProgess();
			}

			var ms2 = new Date().getTime();
			var costing = (ms2 - ms);

			$.app.debug("send " + _url + ' cost ' + costing + 'ms');

			return ms2;

		};

		var header = {
            uid: $.app.localStorage.getItem(window.app.clientId+'.userid', '') ,
            Authorization: $.app.localStorage.getItem(window.app.clientId+'.tokenType', 'Bearer') + " " + $.app.localStorage.getItem(window.app.clientId+'.token', '')
           };

        if(options.headers==null){
            options.headers = {};
        }

        $.extend(header, options.headers);
		options.headers = header

		/**
		 *
		 * 处理系统级别的请求，拦截有关sessiontimeout和错误信息级别的请求信息
		 */
		var _success = options.success;
		var _error = options.error;
		//var _error = options.error==null?_success:options.error;

		var newsuccess = function(data, textStatus, xhr){
			  ms = afterSendfn();

			  let issessiontime = xhr.getResponseHeader("is-session-timeout");
			  let isnotauthorized = xhr.getResponseHeader("is-not-authorized");
			  let isapplicationexception = xhr.getResponseHeader("is-application-exception");

			  let response = {};
			  response.issessiontime=issessiontime;
			  response.isnotauthorized=isnotauthorized;
			  response.isapplicationexception=isapplicationexception;
			  response.xhr=xhr;
			  response.data=data;

			  if ($.app.afterSuccess && $.isFunction($.app.afterSuccess) && $.app.afterSuccess(options, response)===false){
				  return;
			  }

			  data = response.data;
			  xhr = response.xhr;

			  if(response.issessiontime && response.issessiontime == '1')
			  {

				  if(_error){
                        prepareData4Result(data, -1);
						_error.call(this, data, xhr.status, xhr);
					}

				  $.app.onSessionTime(xhr);
				  return;
			  }
			  else if(response.isnotauthorized && response.isnotauthorized == '1')
			  {
				  if(_error){
                        prepareData4Result(data, -1);
						_error.call(this, data, xhr.status, xhr);
					}

				  dispatchErrorMsg(ERROR_INFO('-95555'));
				  return;
			  }
			  else if(response.isapplicationexception && response.isapplicationexception == '1')
			  {
				  if(_error){
                        prepareData4Result(data, -1);
						_error.call(this, data, xhr.status, xhr);
					}

				  var contenttype = xhr.getResponseHeader("Content-Type");

				  if(contenttype && contenttype.toLowerCase().indexOf('json')>=0){
					  if(options.ignoreerror && _success){
                          prepareData4Result(data, -1);
						  _success.apply(this, [data, xhr.status, xhr]);
					  }else{
						  var obj = $.extends.json.toobject(data);
						  dispatchErrorMsg(obj.msg);
					  }
				  }
				  else{
					  var obj = $.extends.json.toobject(data);
					  dispatchErrorMsg(obj.msg);
				  }

				  return ;
			  //alertTip("未授权相关的操作权限，联系公司管理员进行授权", 1000);
			  }
			  else
			  {
				  if(xhr.responseJSON && xhr.responseJSON.status > 0){

					  doError(_error, xhr, _url, options.ignoreerror, _success);

				  }else{
					  if(_success){
						  prepareData4Result(data, 0);
						  _success.apply(this, [data, xhr.status, xhr]);
					  }
				  }

				  var ms2 = new Date().getTime();
				  var costing = (ms2 - ms);

				  $.app.debug("ajax-callback " + _url + ' cost ' + costing + 'ms');
			  }
		}

		$.extend(options, {'success':newsuccess});


		var newerror = function(request){
			afterSendfn();

			let issessiontime = request.getResponseHeader("is-session-timeout");
			let isnotauthorized = request.getResponseHeader("is-not-authorized");
			let isapplicationexception = request.getResponseHeader("is-application-exception");

			let response = {};
			response.issessiontime=issessiontime;
			response.isnotauthorized=isnotauthorized;
			response.isapplicationexception=isapplicationexception;
			response.xhr=request;
			response.data= request.responseJSON||{};

			if ($.app.afterError && $.isFunction($.app.afterError) && $.app.afterError(options, response)===false){
				return;
			}

			let data = response.data;
			//let xhr = response.xhr;

		 	if(response.issessiontime && response.issessiontime == '1')
			  {

				  if(_error){
                      if(data){
                            prepareData4Result(data, -1);
                            _error.call(this, data, request.status, request);
                        }else{
                            prepareData4Result(data, -1);
                            _error.call(this, data, request.status, request);
                        }
				  }

				  $.app.onSessionTime(request);
				  return;
			  }
			  else if(response.isnotauthorized && response.isnotauthorized == '1')
			  {
				  if(_error){
						if(data){
                            prepareData4Result(data, -1);
                            _error.call(this, data, request.status, request);
                        }else{
                            prepareData4Result(data, -1);
                            _error.call(this, data, request.status, request);
                        }
				  }

				  dispatchErrorMsg(ERROR_INFO('-95555'));
				  return;
			  }

			doError(_error, request, _url, options.ignoreerror, _success);
		}

		$.extend(options, {'error':newerror});

		/**
		 * 如果包含progressing 显示加载进度条，信息为progressing的文字
		 * */
		if(!$.extends.isEmpty(options.progressing)){

			var _progressfn = function(request){
				//$.app.showProgress(options.progressing);
			};
			var newbeforeSend;

			if(options.beforeSend){
				var _beforeSend = options.beforeSend;
				newbeforeSend = function(request){
					_progressfn.call(this, request);
					_beforeSend.call(this, request);
				}
			}else{
				newbeforeSend = function(request){
					_progressfn.call(this, request);
				}
			}
			$.extend(options, {'beforeSend':newbeforeSend});
		}

		/**
		 * Do for complete
		 */
		/*
		var newcomplete;
		var _complete = options.complete;

		var newcomplete = function(request){
			if(!$.extends.isEmpty(options.progressing)){
				$.app.closeProgess();
			}

			var ms2 = new Date().getTime();
			var costing = (ms2 - ms);

			$.app.debug(_url + ' cost ' + costing + 'ms');

			if(_complete)
				_complete.call(this, request);
		};
		$.extend(options, {'complete':newcomplete});
		*/

		if(!$.extends.isEmpty(options.progressing))
			$.app.showProgress(options.progressing);
		/*
		window.setTimeout(function(){
			$.app.jqueryAjax(url, options);
		}, 200 * 1);
		*/

		if ($.app.beforeRequest && $.isFunction($.app.beforeRequest) && $.app.beforeRequest(options)===false){
			return
		}

		$.app.jqueryAjax(url, options);
	};


	/* One-time setup (run once before other code)
     *   adds onreadystatechange to $.ajax options
     *   from https://gist.github.com/chrishow/3023092)
     *   success etc will still fire if provided
     */
	$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
		if ( options.onreadystatechange ) {
			var xhrFactory = options.xhr;
			options.xhr = function() {
				var xhr = xhrFactory.apply( this, arguments );
				function handler() {
					options.onreadystatechange( xhr, jqXHR );
				}
				if ( xhr.addEventListener ) {
					xhr.addEventListener( "readystatechange", handler, false );
				} else {
					setTimeout( function() {
						var internal = xhr.onreadystatechange;
						if ( internal ) {
							xhr.onreadystatechange = function() {
								handler();
								internal.apply( this, arguments );
							};
						}
					}, 0 );
				}
				return xhr;
			};
		}
	});

};

initAjax();

$.app.upload = function(url, data, fileInputs, fn, ignoreerror, progressing, requestHeader){

	if(progressing==null){
		progressing = "正在请求数据中......"
	}

	let header = {
		uid: $.app.localStorage.getItem(window.app.clientId+'.userid', '') ,
		Authorization: $.app.localStorage.getItem(window.app.clientId+'.tokenType', 'Bearer') + " " + $.app.localStorage.getItem(window.app.clientId+'.token', '')
	};

	header = $.extend(header, requestHeader);

	// 创建formdata
	var fd = new FormData()
	// 向formdata中传入数据
	// fd.append()
	// file是一个伪数组

	if(data){
		$.each(data, function (k, v) {
			fd.append(k, v)
		})
	}

	if(fileInputs){
		$.each(fileInputs, function (k, v) {
			if($.isArray(v)){
				$.each(v, function (i, file) {
					fd.append(k, file)
				})
			}else{
				fd.append(k, v)
			}
		})
	}

	let errorFn = null

	if($.isFunction(ignoreerror)){
		errorFn = ignoreerror
	}

	$.ajax({
		url: url,
		type: "post",
		headers: header ,
		// 数据不需要编码
		contentType: false,
		// 数据对象不需要转换成键值对格式
		processData: false,
		data: fd,
		progressing: progressing,
		success: fn,
		error: errorFn,
		'ignoreerror':ignoreerror
	});
}

$.app.websocket = function(url, onopen, onmessage, onclose, onerror, options){
	let ws = new WebSocket(url, options);

	onopen = onopen||function(){};
	onmessage = onmessage||function(e){};
	onclose = onclose||function(e){};
	onerror = onerror||function(e){};

	ws.onopen = onopen;
	ws.onmessage = onmessage;
	ws.onclose = onclose;
	ws.onerror = onerror;

	return ws;
}

$.app.ajaxStream = function(url, options, onreadystatechange, onSend, onChunksFn, onOneChunkFn){

	options = $.extend({}, options);

	// ----- myReadyStateChange(): this will do my incremental processing -----
	var last_start = 0; // using global var for over-simplified example
	var remain = '';

	function myReadyStateChange(xhr /*, jqxhr */) {
		let one = this;

		if(xhr.readyState <= 2){

			if(onSend){
				onSend.call(one, xhr, xhr.readyState)
			}
		}
		else if(xhr.readyState >= 3 && xhr.responseText.length > last_start) {
			let chunk = xhr.responseText.slice(last_start);
			last_start += chunk.length;
			//alert('Got chunk: ' + chunk);
			//console.log('Got chunk: ', chunk);
			if(onreadystatechange||onChunksFn||onOneChunkFn){

				if(onreadystatechange){
					onreadystatechange.call(one, xhr, xhr.readyState, chunk);
				}

				if(onChunksFn||onOneChunkFn){

					chunk = remain + chunk

					if(chunk.endsWith('\n')){
						let ones = chunk.split('\n');
						let chunks = [];

						$.each(ones, function (idx, v) {
							//onChunkFn(xhr, xhr.readyState, v+"\n");
							if(onOneChunkFn)
								onOneChunkFn.call(one, xhr, xhr.readyState, v+"\n");

							if(!$.extends.isEmpty(v))
								chunks.push(v+"\n")
						})

						if(onChunksFn)
							onChunksFn.call(one, xhr, xhr.readyState, chunks);

						remain = '';
					}else{
						let ones = chunk.split('\n');
						let lastIndex = ones.length-1;
						let chunks = [];

						$.each(ones, function (idx, v) {
							if(idx<lastIndex){

								if(!$.extends.isEmpty(v))
									chunks.push(v+"\n")

								if(onOneChunkFn)
									onOneChunkFn.call(one, xhr, xhr.readyState, v+"\n");

								//onChunkFn(xhr, xhr.readyState, v+"\n");
							}else{
								remain = v;
							}
						})

						if(onChunksFn)
							onChunksFn.call(one, xhr, xhr.readyState, chunks);
					}
				}
			}
		}else{
			if(onreadystatechange){
				onreadystatechange.call(one, xhr, xhr.readyState, null)
			}
		}
	}

	options.onreadystatechange = myReadyStateChange
	options.cache = false;

	let requestHeader = options.headers||{};
	options.headers = requestHeader;

	requestHeader['Content-Type'] = requestHeader['Content-Type']||'application/json; charset=UTF-8';

	if(requestHeader['Content-Type'].toLowerCase().indexOf('json')>=0){
		if(!$.extends.isEmpty(options.data)){
			if(typeof options.data == 'object'){
				options.data=$.extends.json.tostring(options.data)
			}
		}
	}

	if($.extends.isEmpty(options.method)){
		options['method'] = 'POST';
	}

	return $.app.jqueryAjax(url, options);

}

/**
 * easyui event register
 */
$.easyui = $.extend(!0, $.easyui, {
	debug:{
		breakpoint:function(msg){
			//console.debug(msg);
			$.app.debug(msg);
			$.app.debug(arguments.callee.caller);
		}
	},
	thread:{
		sleep:function(fn, ms){
			if(ms == null)
				ms = 0;

			if(ms<0){
				fn();
				return ms;
			}
			return setTimeout(fn, ms)
		},
		stopLoop:function(handle){
			clearInterval(handle)
		},
		loop:function(fn, ms){
			return setInterval(fn, ms);
		},
		stopTimeout:function(handle){
			clearTimeout(handle)
		},
		timeout:function(fn, ms){
			return setTimeout(fn, ms)
		}
	},
	window:{
		showparseloading : function(target){
			var loaddiv = $('.loading-wrap');
			if(loaddiv.isNull()){
				loaddiv = $('<div class="loading-wrap">'+
								'<div class="loading-content">'+
									'<div class="loading-round"></div>'+
									'<div class="loading-dot"></div>'+
								'</div>'+
							'</div>');

				if(target)
					$(target).prepend(loaddiv);
				else
					$('body').prepend(loaddiv);
			}else{
				loaddiv.show();
			}

			var onc = $.parser.onComplete;

			$.parser.onComplete = function () {
				loaddiv.fadeOut('normal', function () {
			        $(this).remove();
			    });

				$.parser.onComplete = onc;
			}

		},
		load : function(windowtarget, href, param){
			// can not work well, as the datagrid is displayed error layout.

            $.app.getJson(contextpath + '/passport/heartbeat', null, function(data, status, xhr){
            	var status = data.status;

            	if(status==1){

        			href = href || windowtarget.location.href;
        			windowtarget.location.href = href;

            	}else{
            		$.app.onSessionTime(xhr);
            	}

            });

			return ;

			param = param||{};

			var d = $(windowtarget.document);

			$.app.debug('window.load ' + href);

			$.app.get(href, $.param(param), function(r){
				$.app.debug(r);
				var bodyhtml = '';
				var bodyscript = '';
				var t = $(r);
				$.each(t, function(idx, t1){
					var tname = t1.nodeName.toLowerCase();
					if( "link" == tname
					  ||"meta" == tname
					  ||"comment" == tname
					  ||"#comment" == tname){
						return true;
					}

					if("text" == tname
					  ||"#text" == tname){
						bodyhtml+=t1.textContent;
						return true;
					}

					if("script" == tname){
						if(!$.extends.isEmpty(t1.src))
							return true;

						bodyscript+=t1.outerHTML;
							return true;
					}

					$.extends.isEmpty(t1.outerHTML) || (bodyhtml+=t1.outerHTML);
				});

				var doc = $(bodyhtml);
				var script = $(bodyscript);
				$.app.debug(bodyhtml);
				$.app.debug(bodyscript);

				/// for found the message dialog
				$.app.closeProgess();
				/*
				var md = d.find('body').find('.panel.window.panel-htop.messager-window');
				var md1 = d.find('body').find('.window-shadow');
				var md2 = d.find('body').find('.window-mask');
				*/
				d.find('body').empty();
				d.find('body').append(doc);
				$.parser.parse(doc);
				d.find('body').append(script);

				/*
				d.find('body').append(md);
				d.find('body').append(md1);
				d.find('body').append(md2);
				*/

				$.app.debug(d);

			}, null, message.core.info.loading_text);
		}
	},
	file:{
		getReader:function(fn, errorfn, onprogress, onloadend, onloadstart, onabort){
			let reader = new FileReader();
			if($.isFunction(fn)){
				reader.onload = fn;
			}

			if($.isFunction(errorfn)){
				reader.onerror = errorfn;
			}

			if($.isFunction(onprogress)){
				reader.onprogress = onprogress;
			}

			if($.isFunction(onloadend)){
				reader.onloadend = onloadend;
			}

			if($.isFunction(onloadstart)){
				reader.onloadstart = onloadstart;
			}

			if($.isFunction(onabort)){
				reader.onabort = onabort;
			}

			return reader
		}
	},
	event:{
			apply:function(fn, context, args){
				if(fn){
					if(arguments.length>2)
					{
						fn.apply(context, args);
					}
					else{
						return fn.apply(this, context);
					}
				}
			},
			call:function(fn, context){
				if(fn){
					if(arguments.length>2)
					{
						var c = Array.prototype.slice.call(arguments).slice(2);
						fn.apply(context, c);
					}
					else{
						return fn.apply(this, context);
					}
				}
			},
			wrap : function(originalfn, fn, before){
				var newFun = function(){
					var returnarg = true;
					if(before && fn)
						returnarg = fn.apply(this, arguments);

					if(originalfn && !returnarg===false)
						originalfn.apply(this, arguments);

					if(!before && fn)
						fn.apply(this, arguments);
				};

				newFun.guid= '_'+$.guid ++;

				return newFun;
			},
			delegate : function(originalfn, fn, before){
			//var originalcall = originalfn;
			var fnisme = false;

			if(!originalfn){
				fnisme = true;
				originalfn = fn;
				originalfn.delegate = originalfn;
			}else{
				if(originalfn.delegate)
				  originalfn = originalfn.delegate;
				else{
					originalfn.delegate = originalfn;
				}
			}

			if(!originalfn.proxy){
				originalfn.proxy = {};
				originalfn.proxy.before = {};
				originalfn.proxy.after = {};

				var originalcall = originalfn;

				var newFun = function(){
					var obj = $(this);
					obj = obj[0];

					var returnval = true;
					var eventarguments = arguments;
					//$.app.debug('apply delegated(before) function');
					$.each(originalfn.proxy.before, function(k,v){

						if(v){

							var r = v.apply(obj,eventarguments);

							if(r===false){
								returnval = false;
								return false;
							}
						}else{
							delete originalfn.proxy.before.k;
						}
					});

					if(returnval===false)
						return false;

					//$.app.debug('apply originalfn function');

					if(originalfn)
						returnval = originalfn.apply(obj,eventarguments);

					if(returnval===false)
						return false;

					//$.app.debug('apply delegated(after) function');
					$.each(originalfn.proxy.after, function(k,v){
						if(v){
							var r = v.apply(obj,eventarguments);

							if(r===false){
								return false;
							}
						}else{
							delete originalfn.proxy.after.k;
						}
					});
				};

				newFun.delegate = originalfn;
				originalfn.delegated = newFun;
			}

			if(!fn.guid){
				fn.guid= '_'+$.guid ++;
			}

			if(fnisme){
				// if fn is me, need not to register.
				//$.app.debug('delegate null function, the delegate owner is ');
				//$.app.debug(fn);
			}else{
				//$.app.debug('delegate function ['+(before?'before':'after')+']');
				//$.app.debug(originalfn);
				//$.app.debug(fn);

				if(before){
					originalfn.proxy.before[fn.guid] = fn;
				}else{
					originalfn.proxy.after[fn.guid] = fn;
				}
			}

			//$.app.debug('delegated function');
			//$.app.debug(originalfn.delegated);
			return originalfn.delegated;

		},
		on : function(obj, compenent, event, fn, before){
			var eventmethod = 'on' + event['substr'](0, 1)['toUpperCase']() + event['substr'](1);

			var o = $(obj)[compenent]('options');

			if(!o){
				$.app.debug(compenent + ' options is null, return.');
				return ;
			}

			var thisobj = $(obj)[0];

			if(!o.eventregister){
				o.eventregister = {};
			}

			if(!o.eventregister[event]){
				o.eventregister[event] = {
						before:{},
						after:{}
				};
				var originalfun = o[eventmethod];
				var eventfun = function(){
					var returnval = true;
					var eventarguments = arguments;

					$.each(o.eventregister[event].before, function(k,v){

						if(v){
							var r = v.apply(thisobj,eventarguments);

							if(r===false){
								returnval = false;
								return false;
							}
						}else{
							delete o.eventregister[event].before.k;
						}
					});

					if(returnval===false)
						return false;

					originalfun.apply(thisobj,eventarguments);

					$.each(o.eventregister[event].after, function(k,v){
						if(v){
							var r = v.apply(thisobj,eventarguments);

							if(r===false){
								return false;
							}
						}else{
							delete o.eventregister[event].after.k;
						}
					});
				}
				o[eventmethod+''] = eventfun;
				//$(obj)[compenent]({eventmethod: eventfun});
			}

			if(fn.guid){
				// do nothing
				if(before){
					o.eventregister[event].before[fn.guid] = fn;
				}else{
					o.eventregister[event].after[fn.guid] = fn;
				}
			}else{
				fn.guid = '_' + $.guid ++;

				if(before){
					o.eventregister[event].before[fn.guid] = fn;
				}else{
					o.eventregister[event].after[fn.guid] = fn;
				}
			}

		},
		off: function(obj, compenent, event, fn){
			var eventmethod = 'on' + event['substr'](0, 1)['toUpperCase']() + event['substr'](1);

			var o = $(obj)[compenent]('options');

			if(!o){
				$.app.debug(compenent + ' options is null, return.');
				return ;
			}

			if(o.eventregister && o.eventregister[event]){

				if(fn){
					var guid = fn.guid;

					if(guid){
						delete o.eventregister[event].before[fn.guid];
						delete o.eventregister[event].after[fn.guid];

						o.eventregister[event].before[fn.guid] = undefined;
						o.eventregister[event].after[fn.guid] = undefined;
					}
				}else{
					delete o.eventregister[event].before;
					delete o.eventregister[event].after;
					o.eventregister[event].before = {};
					o.eventregister[event].after = {};
				}

			}
		},
		onParserComplete: function(fn){
			if(window.__onParserComplete){

			}
		}
	}
})


$.app.showProgress = function(msg)
{
	if(!msg || msg == '')
		msg = message.core.info.loading_on;

	$.iMessager.progress({
        text: msg
    });
}

$.app.closeProgess = function(){
	$.iMessager.progress('close');
}

$.app.onSessionTime = function(xhr){
	$.app.show(message.core.info.timeout_msg);

	relogin();
};

$.app.confirm = function(title, msg, fn, cancelfn){

	if(arguments.length > 2){
		if($.extends.isEmpty(title))
			title = message.core.info.confirm_title;

		if($.extends.isEmpty(msg))
			msg = message.core.info.confirm_text;

		$.iMessager.confirm(title, msg, function(r){
			if(r){
				fn && fn.call();
			}
			else
			{
				cancelfn && cancelfn.call();
			}
		});
	}else{
		$.app.confirm(null, arguments[0], arguments[1]);
	}
}

$.app.alert = function(title, msg, fn){

	if(arguments.length > 2){
		if($.extends.isEmpty(title))
			title = message.core.info.alert_title;

		if($.extends.isEmpty(msg))
			msg = message.core.info.alert_text;

		$.iMessager.alert(title, msg, null, fn);
	}else{
		$.app.alert('', arguments[0], arguments[1]);
	}
}

$.app.error = function(msg, fn){
	$.iMessager.alert(message.core.info.error_title, msg, 'messager-error', fn);
}

$.app.warning = function(msg, fn){
	$.iMessager.alert(message.core.info.warn_title, msg, 'messager-warning', fn);
}

$.app.info = function(msg, fn){
	$.iMessager.alert(message.core.info.info_title, msg, 'messager-info', fn);
}

$.app.messager_show = $.messager.show;
$.messager.show = function(opts){
	opts = $.extend({iconCls:'fa fa-info-circle'}, opts);

	$.app.messager_show(opts);
}

$.app.show = function(title, msg, iconCls){
	if(arguments.length > 1){
		if($.extends.isEmpty(title))
			title = message.core.info.show_title;

		if($.extends.isEmpty(msg))
			msg = message.core.info.show_text;

		var opts = {
	            'title': title,
	            timeout: 2000,
	            'msg': msg
	        };

		if(!$.extends.isEmpty(iconCls)){
			opts.iconCls = iconCls;
		}

        $.iMessager.show(opts);
	}else{
		$.app.show('', arguments[0]);
	}
}

$.app.localStorage = {
	getToken : function(){
		return $.app.localStorage.getItem(window.app.clientId+'.token', '')
	},
    saveItem:function(key, obj){
        window.localStorage.setItem(key, obj);
    },
    save: this.saveItem,
    getItem:function(key, dv){
        var obj = window.localStorage.getItem(key);

        if(obj==null)
            return dv;

        return obj;
    },
    get: this.getItem,
    remove : function(key){
        window.localStorage.removeItem(key);
    },
    removeItem: this.remove
}

$.app.ajax = function(urlstr, datastr, method, datatype, fn, ignoreerror, progressing, requestHeader, otheroptions){

	if(progressing==null){
		progressing = "正在请求数据中......"
	}

	if($.extends.isEmpty(method))
		method = 'GET';

    var header = {
                 	        uid: $.app.localStorage.getItem(window.app.clientId+'.userid', '') ,
                 	        Authorization: $.app.localStorage.getItem(window.app.clientId+'.tokenType', 'Bearer') + " " + $.app.localStorage.getItem(window.app.clientId+'.token', '')
                           };
	header = $.extend(header, requestHeader);

	let errorFn = null

	if($.isFunction(ignoreerror)){
		errorFn = ignoreerror
	}

	let option = $.extend({
		url: urlstr,
		type: method,
		headers: header ,
		/*beforeSend:function(x){
            console.info('do on beforeSend');
        },
        complete:function(x){
            console.info('do on complete');
        },*/
		data: datastr,
		dataType: datatype,
		progressing: progressing,
		success: fn,
		error: errorFn,
		'ignoreerror':ignoreerror
	}, otheroptions)

	$.ajax(option);
};

$.app.defaultOnsuccess = function(data){
	$.app.show(message.core.info.show_title, data.msg);
}

$.app.showerror = function(info){
	$.app.show(message.core.info.show_error_title, info, 'fa fa-warning');
}

$.app.get = function(url, datastr, fn, ignoreerror, progressing, requestHeader){
	$.app.ajax(url, datastr, 'GET', null, fn, ignoreerror, progressing, requestHeader);
};

$.app.getJson = function(url, datastr, fn, ignoreerror, progressing, requestHeader){
	$.app.ajax(url, datastr, 'GET', "json", fn, ignoreerror, progressing, requestHeader);
};

$.app.delete = function(url, datastr, fn, ignoreerror, progressing, requestHeader){
	$.app.ajax(url, datastr, 'DELETE', null, fn, ignoreerror, progressing, requestHeader);
};

$.app.deleteJson = function(url, datastr, fn, ignoreerror, progressing, requestHeader){
	$.app.ajax(url, datastr, 'DELETE', "json", fn, ignoreerror, progressing, requestHeader);
};

$.app.deleteForm = function(url, jqueryform, fn, ignoreerror, progressing, requestHeader){
    if($.extends.isEmpty(jqueryform)){
		$.app.show(ERROR_INFO('-10000'));
		return;
	}

	jqueryform = $.extends.jquery(jqueryform);

	if(jqueryform.isNull()){
		$.app.show(ERROR_INFO('-10000'));
		return;
	}

	if(!jqueryform.form('validate')){
		$.app.show(message.core.info.data_invalid);
		return;
	}

	var datastr = '';

	if(jqueryform)
		datastr = jqueryform.serialize();

	$.app.delete(url, datastr, fn, ignoreerror, progressing, requestHeader);
};

$.app.put = function(url, datastr, fn, ignoreerror, progressing, requestHeader){
	$.app.ajax(url, datastr, 'PUT', null, fn, ignoreerror, progressing, requestHeader);
};

$.app.putJson = function(url, datastr, fn, ignoreerror, progressing, requestHeader){
	$.app.ajax(url, datastr, 'PUT', "json", fn, ignoreerror, progressing, requestHeader);
};

$.app.putForm = function(url, jqueryform, fn, ignoreerror, progressing, requestHeader){
    if($.extends.isEmpty(jqueryform)){
		$.app.show(ERROR_INFO('-10000'));
		return;
	}

	jqueryform = $.extends.jquery(jqueryform);

	if(jqueryform.isNull()){
		$.app.show(ERROR_INFO('-10000'));
		return;
	}

	if(!jqueryform.form('validate')){
		$.app.show(message.core.info.data_invalid);
		return;
	}

	var datastr = '';

	if(jqueryform)
		datastr = jqueryform.serialize();

	$.app.put(url, datastr, fn, ignoreerror, progressing, requestHeader);
};

$.app.post = function(url, datastr, fn, ignoreerror, progressing, requestHeader){
	$.app.ajax(url, datastr, 'POST', null, fn, ignoreerror, progressing, requestHeader);
};

$.app.postJson = function(url, datastr, fn, ignoreerror, progressing, requestHeader){
	$.app.ajax(url, datastr, 'POST', "json", fn, ignoreerror, progressing, requestHeader);
};

$.app.postForm = function(url, jqueryform, fn, ignoreerror, progressing, requestHeader)
{
	if($.extends.isEmpty(jqueryform)){
		$.app.show(ERROR_INFO('-10000'));
		return;
	}

	jqueryform = $.extends.jquery(jqueryform);

	if(jqueryform.isNull()){
		$.app.show(ERROR_INFO('-10000'));
		return;
	}

	if(!jqueryform.form('validate')){
		$.app.show(message.core.info.data_invalid);
		return;
	}

	var datastr = '';

	if(jqueryform)
		datastr = jqueryform.serialize();

	$.app.post(url, datastr, fn, ignoreerror, progressing, requestHeader);
}

$.app.openDialog = function(id, url, datastr, opts){

	var newopt;

	if(arguments.length > 1){
		newopt = $.extends.applyIf(opts, {'id': id});

		if($.extends.isEmpty(newopt.id)){
			newopt.id = $.extends.getRandomNum();
		}

		var href = url;
		var rquery = (/\?/);
		if(!$.extends.isEmpty(datastr)){
			href += ( rquery.test( href ) ? "&" : "?" ) + datastr;
		}

		newopt.href = href;
		$.iDialog.openDialog(newopt);

		return newopt.id;
		/*
		$.app.get(url, datastr, function(data){
			newopt = $.extends.applyIf(newopt, {'content': data});
			$('#' + opts.id).iDialog('openDialog', newopt);
			//$('#' + opts.id).iDialog('center').html('htmladv');
			//$('#' + opts.id).iDialog('center').html(data);
		});
		*/
	}
	else
	{
		$.app.showDialog(id);
		return id;
	}

};


$.app.showDialog = function(id){
	$('#'+id).iDialog('open');
};

$.app.closeDialog = function(id){
	$('#'+id).iDialog('close');
};

$.app.initMenuButton = function(obj){
	var $obj = $(obj);

	$.each($obj, function(idx, data){
		var $data = $(data);
		var options = $.extends.json.toobject($data.attr('data-options'));

		$data.iMenubutton(options);
	});
}

$(function(){$.app.initMenuButton("[data-toggle='cube-menubutton']")});

/**
 * overload
 *
 * the loadfilter for datagrid
 *
 * loadFilter: function(a) {
            var b = {};
            return b.total = a[CubeUI.config.datagrid.total] ? a[CubeUI.config.datagrid.total] : a.length,
            b.rows = a[CubeUI.config.datagrid.rows] ? a[CubeUI.config.datagrid.rows] : a.rows,
            b.footer = a.footer ? a.footer : [],
            b
        },
 *
 *
 */

$.extend($.fn.layout.methods, {
	isExpand:function(a, region){
		if($(a).layout("panel", region).isNull())
			return false;

		var p = $(a).layout("panel", region)[0].clientWidth;

		return p>0;
	},
	isExist:function(a, region){
		return $(a).layout("panel", region).isNull()==false;
	}
});

$.extend($.fn.datagrid.methods, {
	isChecked:function(a, idx){
		var rows = $(a).datagrid('getChecked');

		for(var i = 0; i<rows.length; i ++){
			var rowIdx = $(a).datagrid('getRowIndex', rows[i]);
			if(idx == rowIdx)
				return true;
		}

		return false;
	},
	refreshData:function(a, param){
		var data = param;

		if(!data)
			data = $(a).datagrid('getRows');

		$(a).datagrid('loadData', data);
	},
	scrollToTop:function(a){
		var rows = $(a).datagrid('getRows');
		if(rows.length>0)
		{
			$(a).datagrid('scrollTo', 0);
		}
	},
	scrollToBottom:function(a){
		var rows = $(a).datagrid('getRows');
		if(rows.length>0)
		{
			$(a).datagrid('scrollTo', rows.length-1);
		}
	},
	removeAllRows:function(a){

		var len = $(a).datagrid('getRows').length;
        //循环
        for(var i=0;i<len;i++){
            $(a).datagrid('deleteRow',0);
        }
	},
	refreshCell:function(a, param){
		var idx = param.index;
		var columns = param.columns;
		if(!$.isArray(columns)){
			columns = [columns];
		}

		var state = $.data(a[0], 'datagrid');
		var rowid = state.rowIdPrefix + '-' ;

		var row = $(a).datagrid('getRows')[idx];

		$.each(columns, function(i, column){

			var co = $(a).datagrid('getColumnOption', column);
			var fieldtarget = $(a).datagrid('getPanel').find('tr[id^="'+rowid+'"].datagrid-row[datagrid-row-index="'+idx+'"] [field="'+column+'"]>div.datagrid-cell');

			if(fieldtarget.isNull()){
				$.app.err('Can not found ' + column + ' at ' + rowid + '-' + idx);
				return ;
			}

			if(co.formatter){
				$(fieldtarget).empty();
				var html = co.formatter(row[column], row, idx);
				$(fieldtarget).append(html);

			}else{
				$(fieldtarget).html(row[column]);
			}
		});
	},
	//$('#poDg').datagrid('getPanel').find('.datagrid-body [datagrid-row-index="0"] [field="INVENTORYTYPE"]>div.datagrid-cell')
	disabledCheckbox : function(a, idx){
    	var i = idx;
    	var box = $(a).datagrid('getPanel').find(".datagrid-row[datagrid-row-index=" + i + "] input[type='checkbox']")
    	box[0].disabled = true;
    },
	fetchAllData:function(a, afterfn){
		var options = $(a).datagrid('options');
        var queryParams = options.queryParams;
        queryParams.page=1;
        queryParams.sort=options.sortName;
		queryParams.order=options.sortOrder;
        $.app.post(options.url, queryParams, function(data){

        	data = defaultGridLoadFilter.call(a, data);

        	if(afterfn){
        		afterfn.call(a, data);
        	}

        }, null, message.core.info.getting_data);
	},
	isExpandRow:function(jq, index){
		var tr = $(jq).datagrid('getRowDetail',index).closest('tr');

		if(tr.isNull())
			return false;
		else{

			if(tr.is(':hidden')){
				return false;
			}else{
				return true;
			}

		}

	},
	expandRow2 : function(jq, index){
		var a, c;
		typeof index == 'object' ? (a = index['index'],
                c = index['data']) : (a = index, c=null);

		$(jq).datagrid('expandRow' ,a);
		var data = c;
		var index = a;

		if(data){
			var subgriddg = $(jq).datagrid('getRowDetail' ,index).find('table.ddv:first');
			$(subgriddg).datagrid('loadData', data);
		}
	},
	getSubgrid : function(jq, index){
		return $(jq).datagrid('getRowDetail' ,index).find('table.ddv:first');
	},
	getSubgridData : function(jq, index){
		var subgrid = $(jq).datagrid('getSubgrid' ,index);
		if(subgrid.isNull()){
			return [];
		}
		if($.data(subgrid[0], 'datagrid')){
			return subgrid.datagrid('getData');
		}
		return [];
	},
	getSubgridRows : function(jq, index){
		var subgrid = $(jq).datagrid('getSubgrid' ,index);
		if(subgrid==null){
			return [];
		}
		if($.data(subgrid[0], 'datagrid')){
			return subgrid.datagrid('getRows');
		}
		return [];
	},
	getParentTarget : function(jq){
		var subgrid = $(jq).datagrid('options');
		if(subgrid==null){
			return null;
		}

		return subgrid.parentTarget;
	},
	getParentRow : function(jq){
		var subgrid = $(jq).datagrid('options');
		if(subgrid==null){
			return null;
		}

		return subgrid.parentRow;
	},
	setLocalRows:function(jq, data){
		$(jq).datagrid('options').localRows = data;
	},
	getLocalRows:function(jq){
		return $(jq).datagrid('options').localRows;
	},
	setPagerOptions:function(jq, options){
		let pageTarget = $(jq).datagrid('getPager');
		if( pageTarget.isNull()){
			return
		}else{
			let ops = pageTarget.pagination("options");
			$.extend(ops, options)
		}
	},
	setLocalPage:function(jq){
		let pageTarget = $(jq).datagrid('getPager');
		if( pageTarget.isNull()){
			return
		}else{
			let ops = pageTarget.pagination("options");

			ops.onBeforeRefresh = function(pageNumber, pageSize){
				console.log('onBeforeRefresh pageNumber:'+pageNumber+',pageSize:'+pageSize);
				$(jq).datagrid('reload', {});
				return false
			}

			ops.onSelectPage = function(pageNumber, pageSize){
				console.log('onSelectPage pageNumber:'+pageNumber+',pageSize:'+pageSize);

				if(pageNumber <= 0)
					return;

				let start = (pageNumber - 1) * pageSize;
				let end = start + pageSize;

				let data = $(jq).datagrid('getLocalRows');
				data = data?data:[]

				if(data){

					let newData = null;

					if(data.length < start + 1){
						newData = [];
					}else{
						if(data.length >= end){
							newData = data.slice(start, end);
						}else{
							newData = data.slice(start);
						}
					}

					$(jq).datagrid("loadData", newData);

					pageTarget.pagination('refresh', {
						total:data.length,
						pageNumber:pageNumber
					});
				}
			}
		}
	}
});

setGroupViewOptions = function(target,dgoptions,  groupviewoptions){
	var groupopts = groupviewoptions;
	dgoptions.view=groupview;

	if(typeof groupopts.groupFiled == 'function'){
		dgoptions.groupField = groupopts.groupFiled(target);
	}else if($.extends.isString(groupopts.groupField)){
		dgoptions.groupField = groupopts.groupField;
	}
	else{
		var defaultgroup = groupopts.groupField['default'];
		var sortname = dgoptions.sortName;
		var groupfield = groupopts.groupField[sortname] || defaultgroup;

		dgoptions.groupField = groupfield;
	}

	if(groupopts.groupFormatter){
		dgoptions.groupFormatter = groupopts.groupFormatter;
	}else{
		if(groupopts.groupFormatterHandle){
			dgoptions.groupFormatter = groupopts.groupFormatterHandle.call(target);
		}
	}
}

defaultSubgidExpandRow = function(target,dgoptions, subgridviewoptions){

	return function(index,row){
		var ddv = $(target).datagrid('getRowDetail',index).find('table.ddv:first');

		var state = $.data(ddv[0], 'datagrid');

		if(state){

			var url = $(ddv).datagrid('options').url;

			if(url){
				$(ddv).datagrid('reload');
			}else{
				$(ddv).datagrid('loadData', $(ddv).datagrid('getData'));
				/*if($.extends.isEmpty(dgopts.subdatafield))
					$(ddv).datagrid('loadData', $(ddv).datagrid('getData'));
				else
					$(ddv).datagrid('loadData', row[dgopts.subdatafield]);*/
			}

			//$(target).datagrid('fixDetailRowHeight',index);
			return ;
		}

		var newsubgridviewoptions = null;

		if($.isFunction(subgridviewoptions)){
			newsubgridviewoptions = subgridviewoptions.call($(target), index, row);
		}else{
			newsubgridviewoptions = $.extend(1, {}, subgridviewoptions)
		}

		newsubgridviewoptions.parentTarget = $(target);
		newsubgridviewoptions.parentRow = row;

		var dgopts = $(target).datagrid('options');
		var subgridopts = $.extend({}, newsubgridviewoptions);

		subgridopts.onResize = null;
		subgridopts.onLoadSuccess = null;

		subgridopts.onResize = $.easyui.event.wrap(
				newsubgridviewoptions.onResize,
				function(){
		            $(target).datagrid('fixDetailRowHeight',index);
		        }
		);
		subgridopts.onLoadSuccess = $.easyui.event.wrap(
				$.fn.iDatagrid.defaults.onLoadSuccess,
				$.easyui.event.wrap(
						newsubgridviewoptions.onLoadSuccess,
					function(data){
						/*
						var hideWhenEmpty = subgridopts.hideWhenEmpty;
						if(hideWhenEmpty){
							var rows = $(ddv).datagrid('getRows');
							if(rows==null || rows.length==0){
								$(ddv).closest('div').hide();
							}else{
								$(ddv).closest('div').show();
							}
						}

						*/
						setTimeout(function(){
			                $(target).datagrid('fixDetailRowHeight',index);
			            },0);
			        }
				)
		);

		var urlformatter = newsubgridviewoptions.urlformatter;
		if(urlformatter){
			if($.isFunction(urlformatter)){
				subgridopts.url = urlformatter.call(target, index, row);
			}else{
				subgridopts.url = urlformatter.format(row);
			}
		}

		if(newsubgridviewoptions.initRowsField && row[newsubgridviewoptions.initRowsField]){
			subgridopts.data = {rows:row[newsubgridviewoptions.initRowsField]};
		}


		//subgridopts.fitColumns=true;
		subgridopts.height=subgridopts.height||'auto';


		if($.extends.isEmpty($(ddv).attr('id'))){
			if($.extends.isEmpty(subgridopts.id)){
				subgridopts.id = $.extends.getRandomNum();
			}

			$(ddv).attr('id', subgridopts.id);
		}


		ddv.datagrid(subgridopts);

	    //$(target).datagrid('fixDetailRowHeight',index);
	    subgridopts.onLoadSuccess.call(ddv[0], ddv.datagrid('getData'));
	}
};

setSubgridViewOptions = function(target,dgoptions,  subgridviewoptions){
	var subgridopts = subgridviewoptions;
	dgoptions.view=detailview;

	if(subgridopts.detailFormatter)
		dgoptions.detailFormatter = subgridopts.detailFormatter;
	else{
		dgoptions.detailFormatter = function(index,row){
            return '<div style="padding:2px;position:relative;"><table class="ddv"></table></div>';
        };
	}

	dgoptions.onExpandRow = defaultSubgidExpandRow(target, dgoptions,  subgridviewoptions)
}

function ConvertResult2Data(data) {
	//console.log(data);
	var rtn = {};
	if (data && data.datas && data.datas.list) {
		var rtn = {};
		rtn.rows = data.datas.list;
		rtn.total = data.datas.totalRow || data.datas.list.length;

		if (data.summary)
			rtn.summary = data.summary;
		else if (data.datas.summary)
			rtn.summary = data.datas.summary;

		return rtn;
	} else if (data && data.data && data.data.list) {
		var rtn = {};
		rtn.rows = data.data.list;
		rtn.total = data.data.totalRow || data.data.list.length;

		if (data.summary)
			rtn.summary = data.summary;
		else if (data.data.summary)
			rtn.summary = data.data.summary;

		return rtn;
	} else {
		return data;
	}
}

defaultGridLoadFilter = function(data){

	// just a 不好的方法，没有适当的回调函数支持
	var options = $(this).datagrid('options')||{};
	// groupView
	if(options.group){
		setGroupViewOptions(this, options, options.group);
	}
	else if(options.subgrid){ //subgridView
		setSubgridViewOptions(this, options, options.subgrid);
	}
	return ConvertResult2Data(data);

}

$.fn.combogrid.defaults.loadFilter = defaultGridLoadFilter;
$.fn.iCombogrid.defaults.loadFilter = defaultGridLoadFilter;
$.fn.datagrid.defaults.loadFilter = defaultGridLoadFilter;
$.fn.iDatagrid.defaults.loadFilter = defaultGridLoadFilter;

$.fn.datagrid.defaults.onRowContextMenu = function(e,index,row){
	$.app.debug('onRowContextMenu');
	$.app.debug(e);
	$.extends.stopPropagation();
};
$.fn.iDatagrid.defaults.onRowContextMenu = function(e,index,row){
	$.app.debug('onRowContextMenu');
	$.app.debug(e);
	$.extends.stopPropagation();
};

$.iDialog = $.extend(!0, $.iDialog||{}, {
	onOpen4Cube:function(){  // check button and title
		var o = $.data(this,'dialog');
		if(o && o.options && o.options.id){

			// for remove the button with removebuttons attribute in dialog page
			var c = $('#'+o.options.id).dialog('dialog').find('[removebuttons]').attr('removebuttons');

			if(!$.extends.isEmpty(c)){
				c = $.extends.json.toobject(c);

				$.iDialog.removeDialogButton(this, c);
			}

			/// for disable the button with disablebuttons attribute in dialog page
			c = $('#'+o.options.id).dialog('dialog').find('[disablebuttons]').attr('disablebuttons');

			if(!$.extends.isEmpty(c)){
				c = $.extends.json.toobject(c);
				$.iDialog.disableDialogButton(this, c);
			}

			c = $('#'+o.options.id).dialog('dialog').find('[dialogtitle]').attr('dialogtitle');
			if(!$.extends.isEmpty(c)){
				$('#'+o.options.id).iDialog('setTitle', c);
			}
			//$('#prvidialog').iDialog('setTitle','设定公司权限-#html($!data.companyname)');

		}
	},
	removeDialogButton : function(dialogobj, buttonIdx){
		var o = $.data(dialogobj,'dialog');
		if(o && o.options && o.options.id){
			var a;
			if(!$.isArray(buttonIdx)){
				a = [buttonIdx];
			}else{
				a = buttonIdx;
			}

			var s = $('#'+o.options.id).dialog('dialog').find('.dialog-button a[group]');
			var n = [];

			$.each(s, function(idx, data){
				var t = $(data).linkbutton('options').text||'';
				n.push(t.trim());
			});

			$.each(a, function(idx, data){
				if(typeof data == "number"){
					if(data>=0)
						$(s[data]).remove();
				}
				else if(typeof data == "string"){
					var x = $.inArray2(data.trim(), n);
					if(x>=0)
						$(s[x]).remove();
				}


			});
		}
	},
	disableDialogButton : function(dialogobj, buttonIdx){
		var o = $.data(dialogobj,'dialog');
		if(o && o.options && o.options.id){
			var a;
			if(!$.isArray(buttonIdx)){
				a = [buttonIdx];
			}else{
				a = buttonIdx;
			}

			var s = $('#'+o.options.id).dialog('dialog').find('.dialog-button a[group]');
			var n = [];

			$.each(s, function(idx, data){
				var t = $(data).linkbutton('options').text;
				n.push(t);
			});

			$.each(a, function(idx, data){
				if(typeof data == "number"){
					if(data>=0)
						$(s[data]).linkbutton('disable');
				}
				else if(typeof data == "string"){
					var x = $.inArray2(data, n);
					if(x>=0)
						$(s[x]).linkbutton('disable');
				}


			});
		}
	}
});

$.iTooltip = $.extend(!0, $.iTooltip, {
	template : '<span title="{0}" class="easyui-tooltip">{1}</span>',
	tooltip : function(text, title){
		title = title || text;
		var t = $.extends.htmlencode(title);
		return '<span title="'+t+'" class="easyui-tooltip">' + text + '</span>';
	}
});

$.iLayout = $.extend({}, $.iLayout, {
	getLayoutPanelOptions : function(target, region){
		let p = $(target).layout('panel', region);

		if(p.isNull()){
			return null;
		}else{

			try{
				return p.panel('options');
			}catch (e){
				console.error(e);
				return null;
			}
		}
	}
});

$.iGrid = $.extend(!0, $.iGrid||{}, {
	click_cell_herf_handler:function(href, dg_selector, registery_event,  rowIndex){
		var dg = $(dg_selector);
		var fn = $(dg).datagrid('options')[registery_event];
		$.extends.stopPropagation();

		if(fn == null){
			return ;
		}

		if($.isFunction(fn)){
			var rowdata = dg.datagrid('getRows')[rowIndex];
			fn.call(href, dg, rowdata, rowIndex);
		}else{
			throw fn + " is not a functcion";
		}
	},
	click_cell_href_formatter:function(dg_selector, registery_event){
		return function(val, rowData, rowIndex){

			if(rowData.ISFOOTER)
				return val;

			if($.extends.isEmpty(val))
				return '';

			var v = '<a style="color:blue;" class=\'\' href=\'#\' onclick=\'$.iGrid.click_cell_herf_handler(this, "'+dg_selector+'", "'+registery_event+'", "'+rowIndex+'")\'>{0}</a>'.format(val);

			return v;
		}
	},
	click_trigger_event:function(dgId, eventName, idx, isFooter){
		let dg = $('#'+dgId);
		let fn = $(dg).datagrid('options')['on' + eventName.UpperCaseFirst()];
		$.extends.stopPropagation();

		if(fn == null){
			return ;
		}

		if($.isFunction(fn)){
			let rowData = null;

			if(isFooter){
				rowData = dg.datagrid('getFooterRows')[idx];
			}else{
				rowData = dg.datagrid('getRows')[idx];
			}

			fn.call(dg, rowData, idx, isFooter);
		}else{
			throw fn + " is not a functcion";
		}
	},
	click_trigger_formatter:function(eventName, includeFooter){

		return function(value, rowData, idx){
			let isFooter = false;

			if(rowData.ISFOOTER && !includeFooter)
				return val;

			if(rowData.ISFOOTER)
				isFooter = true;

			if($.extends.isEmpty(value))
				return '';

			let dgId = this.formatter.caller.arguments[0].id;

			let txt = `<a style='color:blue;' class='click_cell_href' href='#' onclick='$.iGrid.click_trigger_event("{1}","{2}","{3}", {4})'>{0}</a>`;
			txt = txt.format(value.htmlEncode(), dgId, eventName, idx, isFooter);

			if(!$.extends.isEmpty(rowData.title)){
				return $.iTooltip.tooltip(txt, rowData.title);
			}else{
				return txt;
			}
		}
	},
	buildformatter:function(formatters){

		return function(value, rowData, rowIndex){

			if(rowData.ISFOOTER)
				return value;

			var v = value;

			$.each(formatters, function(idx, formatter){
				if($.isFunction(formatter)){
					v = formatter(v, rowData, rowIndex);
				}else{
					throw "formatter is not a functcion";
				}
			});

			return v;
		}
	},
	colorformatter:function(color){
		if(!color)
			color = 'red';

		return function(value, rowData, rowIndex){
			return '<span class="cube-label cube-label-'+color+'">'+value+'</span>'
		}
	},
	displayValue:function(value, tip){
		if(tip==null || tip===false){
			if(!$.extends.isEmpty(value))
				return $.iTooltip.tooltip(value);
			return '';
		}

		return $.iTooltip.tooltip(value, tip);
	},
	numberformatter:function(fractiondigits){

		if(fractiondigits==null)
			fractiondigits = 2;

		return function(value, rowData, rowIndex){

			if(rowData.ISFOOTER)
				return value;

			if($.extends.isEmpty(value)){
				return '';
			}else{

				if(isNaN(value)){
					return value;
				}

				return $.extends.maths.toFixed($.extends.number(value, 0), fractiondigits);
			}
		}
	},
	dateformatter:function(field, hiddentip){
		return function(value, rowData, rowIndex){

			if(rowData.ISFOOTER)
				return value;

			var value = (!$.extends.isEmpty(field)&&rowData[field])?rowData[field]:value;

			if($.extends.isEmpty(value))
				return '';
			else{

				return $.iGrid.displayValue(value.substr(0,10), value);

			}

		};
	},
	datetimeformatter:function(field, hiddentip){
		return function(value, rowData, rowIndex){

			if(rowData.ISFOOTER)
				return value;

			var value = (!$.extends.isEmpty(field)&&rowData[field])?rowData[field]:value;

			if($.extends.isEmpty(value))
				return '';
			else{

				if(value.length>=16)
					return $.iGrid.displayValue(value.substr(0,16), value);
				else
					return $.iGrid.displayValue(value, value);

			}

		};
	},
	isnullformatter:function(display, hiddentip){
		return function(value, rowData, rowIndex){

			if(rowData.ISFOOTER)
				return value;

			if($.extends.isEmpty(value))
				return $.iGrid.displayValue(display.format(rowIndex).format2(rowData), hiddentip);

			return $.iGrid.displayValue(value, hiddentip);
		};
	},
	addorremoveformatter:function(addaction, removeaction, rollbackaction, acceptaction){
		var addspan = '<span title="'+message.core.label.add+'" class="easyui-tooltip"><a href="javascript:;" onclick="{0}" class="cell-textbox-icon fa fa-plus-square fa-lg" icon-index="0" tabindex="-1" ></a></span>';
		var removespan = '<span title="'+message.core.label.remove+'" class="easyui-tooltip"><a href="javascript:;" onclick="{0}" class="cell-textbox-icon fa fa-trash-o fa-lg" icon-index="0" tabindex="-1" ></a></span>';
		var rollbackspan = '<span title="'+message.core.label.rollback+'" class="easyui-tooltip"><a href="javascript:;" onclick="{0}" class="cell-textbox-icon fa fa-refresh fa-lg" icon-index="0" tabindex="-1" ></a></span>';
		var acceptspan = '<span title="'+message.core.label.accept+'" class="easyui-tooltip"><a href="javascript:;" onclick="{0}" class="cell-textbox-icon fa fa-check-square fa-lg" icon-index="0" tabindex="-1" ></a></span>';
		var all = '<span class="" style="right: 0px; top: 0px;">{0}{1}{2}{3}</span>';

		addaction = addaction||'';
		removeaction = removeaction||'';
		rollbackaction = rollbackaction||'';
		acceptaction = acceptaction||'';

		return function(value, rowData, rowIndex){

			if(rowData.ISFOOTER)
				return value;

			rowData.rowIndex = rowIndex;
			var html = '';
			var ca = addspan.format(addaction.format({rowIndex:rowIndex}).format2(rowData));
			var cr = ' ';
			cr = removespan.format(removeaction.format({rowIndex:rowIndex}).format2(rowData));
			var cr1 = rollbackspan.format(rollbackaction.format({rowIndex:rowIndex}).format2(rowData));
			var ca1 = acceptspan.format(acceptaction.format({rowIndex:rowIndex}).format2(rowData));

			html = all.format(ca, cr, cr1, ca1);

			return html;
		};
	},
	optionsformatter:function(options, textfield, valuefield, checkfield, template, hiddentip){
		textfield = textfield||'TEXT';
		valuefield = valuefield ||'VALUE';

		return function(value, rowData, rowIndex){

			if(rowData.ISFOOTER)
				return value;

			value = checkfield?rowData[checkfield]:value;
			var html = '';
			$.each(options, function(idx, option){
				if(option[valuefield]==value){
					if(template){
						html = template.format(option[textfield]).format(option).format2(rowData);
					}else{
						html = option[textfield];
					}

					return false;
				}
			});

			return $.iGrid.displayValue(html, hiddentip);
		};
	},
	tooltipformatter2 : function(){
		return function(value, rowData, rowIndex){

			if(rowData.ISFOOTER)
				return value;

			if(!$.extends.isEmpty(value)){
				var t = $.extends.htmlencode(value);
				return '<span title="'+t+'" class="easyui-tooltip">' + t + '</span>';
			}
		}
	},
	tooltipformatter : function(field){
		return function(value, rowData, rowIndex){

			if(rowData.ISFOOTER)
				return value;

			if(!$.extends.isEmpty(value)){
				var t;

				if(field)
					t = rowData[field];
				else
					t = value;

				var t = $.extends.htmlencode(t);

				return '<span title="'+t+'" class="easyui-tooltip">' + value + '</span>';
			}
		}
	},
	trimformatter : function(count){
		return function(value, rowData, rowIndex){
			if(rowData.ISFOOTER)
				return value;

			var htmlstr = "";

			var v = (value || ' ') + '';

			if(v.length > count)
			{
				var t = $.extends.htmlencode(v);
				htmlstr += '<span href="#" title="'+t+'" class="easyui-tooltip">'+v.substring(0, (count-1))+'...</span>';
			}
			else{
				htmlstr = v;
			}

			return htmlstr;
		}
	},
	evalconditionformatter: function(conditions, eqdispaly, defaultdissplay){

		var c = conditions || [];
		var e = eqdispaly || [];
		var d = defaultdissplay || '';

		return function(value, rowData, rowIndex){

			if(rowData.ISFOOTER)
				return value;

			var htmlstr = "";
			var f = "";

			$.each(c, function(idx, o){
				var r = eval(o);
				if(r){
					if(idx < e.length){// find and dispaly is ok
						f += (e[idx] || '');
					}
				}
			});

			if($.extends.isEmpty(f)){
				f = d;
			}

			var o = $.extend(!0, {'rowIndex':rowIndex}, rowData);
			htmlstr += f.format(value).format2(o);

		    return htmlstr;
		}
	},
	templateformatter : function(template){
		return function(value, rowData, rowIndex){

			if(rowData.ISFOOTER)
				return value;

			var o = $.extend(!0, {'rowIndex':rowIndex}, rowData);
			var htmlstr = "";
			htmlstr += template.format(value).format2(o);
			return htmlstr;
			//return $.iTooltip.tooltip(htmlstr, value);
		}
	},
	checkedformatter4: function(obj, field, defaultdissplay, hiddentip){

		var d = defaultdissplay || '';

		return function(value, rowData, rowIndex){

			if(rowData.ISFOOTER)
				return value;

			var htmlstr;
			var o = field?rowData[field]:value;

			if(obj){
				$.each(obj, function(k, v){
					if(k==o)
					{
						htmlstr = v;
						return ;
					}
				});
			}

			htmlstr = htmlstr||d;

			htmlstr = htmlstr.format(value).format2(rowData);

			return $.iGrid.displayValue(htmlstr, hiddentip);
		}
	},
	checkedformatter3: function(field, checkvalue, eqdispaly, defaultdissplay, hiddentip){

		var c = checkvalue || [];
		var e = eqdispaly || [];
		var d = defaultdissplay || (e.length>0&&e[e.length-1]) || '';

		return function(value, rowData, rowIndex){

			if(rowData.ISFOOTER)
				return value;

			var htmlstr = "";
			var v = value;

			if(!$.extends.isEmpty(field)){
				v = rowData[field];
			}

			var i = $.inArray2(v, c);
			var t;

			if(i>=0 && i < e.length){// find and dispaly is ok
				t = e[i] || d;
			}else  // with default value
			{
				t = d;
			}

			var o = $.extend(!0, {'rowIndex':rowIndex}, rowData);

			htmlstr += t.format(value).format2(o);

			return $.iGrid.displayValue(htmlstr, hiddentip);
		}
	},
	checkedformatter2: function(checkvalue, eqdispaly, defaultdissplay){

		var c = checkvalue || [];
		var e = eqdispaly || [];
		var d = defaultdissplay || (e.length>0&&e[e.length-1]) || '';

		return function(value, rowData, rowIndex){

			if(rowData.ISFOOTER)
				return value;

			var htmlstr = "";

			var i = $.inArray2(value, c);
			var t;

			if(i>=0 && i < e.length){// find and dispaly is ok
				t = e[i] || d;
			}else  // with default value
			{
				t = d;
			}

			var o = $.extend(!0, {'rowIndex':rowIndex}, rowData);

			htmlstr += t.format(value).format2(o);

			return htmlstr;
		}
	},
	checkedformatter: function(checkvalue, eqdispaly, neqdisplay){

		checkvalue = checkvalue || "1";
		eqdispaly = eqdispaly==null?"<i class='fa fa-check' aria-hidden='true'></i>":eqdispaly;
		neqdisplay = neqdisplay==null?"<i class='fa fa-times' aria-hidden='true'></i>":neqdisplay;

		return function(value, rowData, rowIndex){

			if(rowData.ISFOOTER)
				return value;

			var htmlstr = "";
			var o = $.extend(!0, {'rowIndex':rowIndex}, rowData);

		    if(value+''==checkvalue+'') //DEPARTMENT_SYSTEMTAG
	    	{
		    	var v1 = eqdispaly.format(value).format2(o);
		    	htmlstr += v1;
	    	}
		    else{
		    	var v2 = neqdisplay.format(value).format2(o);
		    	htmlstr += v2;
		    }

		    return htmlstr;
		}
	},
	rowDatas2Array:  function(rows, datafield){
		var functionids = [];
		if(rows){
	    	$.each(rows, function(idx, row){
	    		functionids.push(row[datafield]);
	    	});
		}
		return functionids;
	},
	rowDatas2Arrayjson:  function(rows, datafield){
		var functionids = $.iGrid.rowDatas2Array(rows, datafield)

		return JSON.stringify(functionids);
	},
	selectedRowDatas2Array: function(id, datafield){
		return $.iGrid.rowDatas2Array($('#'+id).iDatagrid('getSelections'), datafield);
	},
	selectedRowDatas2Arrayjson: function(id, datafield){
		var functionids = $.iGrid.selectedRowDatas2Array(id, datafield)

		return JSON.stringify(functionids);
	},
	checkedRowDatas2Array: function(id, datafield){
		return $.iGrid.rowDatas2Array($('#'+id).iDatagrid('getChecked'), datafield);
	},
	checkedRowDatas2Arrayjson: function(id, datafield){
		var functionids = $.iGrid.checkedRowDatas2Array(id, datafield)

		return JSON.stringify(functionids);
	},
	checkedNodeDatas2Array: function(id, datafield, state){
		return $.iGrid.rowDatas2Array($('#'+id).treegrid('getCheckedNodes'), datafield);
	},
	checkedNodeDatas2Arrayjson: function(id, datafield, state){
		var functionids = $.iGrid.checkedNodeDatas2Array(id, datafield)

		return JSON.stringify(functionids);
	},
	sorter:function(a, b){
		return a>b?1:-1;
	}

});

// --------- 1. 通用部分-------- 如需使用下面 2 或3 功能代码，请copy这部分

var editIndex = undefined;// 记录当前编辑行的index
// -------------2. 单元格编辑实现代码----------------------

/**
 *@description 可编辑单元的操作对象，无特殊要求无需改动此处
 */

/**
*  Date 2021-07-15 15:00
*  refactor some function for editIndex's index must be selector.
*  if  dataGridSelector is a jquery object will lead bug.  because we ofter begin with xpath selector. and this xpath will be put into editIndex's index.
*  but when check it maybe be wrap again to be a jquery to dataGridSelector. it will not found the index now.
*   so We found and put the index of editIndex with the selector.
**/
$.iGrid.EditCell = {
	reloadComboText4EndEdit: function(index,row,changes){
		var obj = this;
		$.each(changes, function(k, v){
			var field = k;

			var co = $(obj).datagrid('getColumnOption', field);

			if(co.editor && co.editor.type){
				if(co.editor.type.indexOf('combo')==0){
					if(co.editor.options && $.extends.isEmpty(co.editor.options.textcol)){
						var ed = $(obj).datagrid('getEditor', {
			                index: index,
			                field: field
			            });

						row[co.editor.options.textcol] = $(ed.target).combo('getText');
						$.app.debug('change [' + co.editor.options.textcol + '] = ' + row[co.editor.options.textcol]);
					}
				}
			}

		});


	},
	editIndex:{},
	setEditIndex:function(dataGridSelector, idx){

		var key = dataGridSelector;

		if(dataGridSelector instanceof jQuery)
			key = dataGridSelector.selector;

		this.editIndex[key] = idx;
	},
	getEditIndex:function(dataGridSelector){

		var key = dataGridSelector;

		if(dataGridSelector instanceof jQuery)
			key = dataGridSelector.selector;

		return this.editIndex[key];
	},
    endEditing: function(dataGridSelector, force) {

		var key = dataGridSelector;

		if(dataGridSelector instanceof jQuery)
			key = dataGridSelector.selector;

      if (this.editIndex[key] == undefined) {
        return true
      }else if (force || $(dataGridSelector).iDatagrid('validateRow', this.editIndex[key])) {// 验证指定的行，当验证有效的时候返回true
        $(dataGridSelector).iDatagrid('endEdit', this.editIndex[key]);
        this.editIndex[key] = undefined;
		delete this.editIndex[key];
        return true;
      } else {
        return false;
      }
    },
    isEditing: function(dataGridSelector) {
    	return this.getEditIndex(dataGridSelector) != null;
    },
    rowedit:function (dataGridSelector, index,row,onBeforeInitEditorFn) {
    	 // 1.定义变量
        var opts = $(dataGridSelector).iDatagrid('options');//  获得表格的属性
        var frozenFields = $(dataGridSelector).iDatagrid('getColumnFields',true); // 获取冻结列
        var fields = $(dataGridSelector).iDatagrid('getColumnFields'); // 获取解冻列
        fields = frozenFields.concat(fields); // 连接冻结列和解冻列的数组

        var coloptoins = {};
        // 2.遍历fields 确定点击状态cell的editor属性放出来 ， 非点击状态下cell的editor属性使用另一个变量保存
        for(var i=0; i<fields.length; i++){
          var col = $(dataGridSelector).iDatagrid('getColumnOption', fields[i]); // 拿到列属性
          //col.editor1 = col.editor;// 新增列属性editor1保存editor

          var coloption = $.extend(1, {}, col);
          coloptoins[col.field] = coloption;
          //col.editor = null;
        }

		row = row||$(dataGridSelector).datagrid('getRows');

        if(onBeforeInitEditorFn){
        	var e = onBeforeInitEditorFn.call(this, index,row, coloptoins);
        }

        if(e===false)
        	return ;

        if($.isPlainObject(e) && $.isPlainObject(e.editor)){
        	e = e.editor;
        	for(var i=0; i<fields.length; i++){
                var col = $(dataGridSelector).iDatagrid('getColumnOption', fields[i]); // 拿到列属性
                var newColopt = e[col.field];

                if(newColopt&&newColopt.editor){
                	col.editor1 = col.editor;
                	col.editor = newColopt.editor;
                }
              }
        }

        // 3.开始编辑行
        $(dataGridSelector).iDatagrid('beginEdit', index);
        this.setEditIndex(dataGridSelector, index);

        // 4.还原editor属性
        if($.isPlainObject(e)){
	        for(var i=0; i<fields.length; i++){
	          var col = $(dataGridSelector).iDatagrid('getColumnOption', fields[i]);
	          var newColopt = e[col.field];

	          if(newColopt&&newColopt.editor){
	        	  col.editor = col.editor1;
	        	  col.editor1 = null;
	          }
	        }
        }
    },
    edit:function (dataGridSelector, index,field,onBeforeInitEditorFn) {
        // 1.定义变量
        var opts = $(dataGridSelector).iDatagrid('options');//  获得表格的属性
        var frozenFields = $(dataGridSelector).iDatagrid('getColumnFields',true); // 获取冻结列
        var fields = $(dataGridSelector).iDatagrid('getColumnFields'); // 获取解冻列
        fields = frozenFields.concat(fields); // 连接冻结列和解冻列的数组

        //第一次遍历是为了得到callback的返回值，新的editor。
        var e;
        if(onBeforeInitEditorFn){

            for(var i=0; i<fields.length; i++){
                var col = $(dataGridSelector).iDatagrid('getColumnOption', fields[i]); // 拿到列属性

                if (fields[i] == field){ //判断是否是被点击的cell 进行回调
              	  var row = $(dataGridSelector).iDatagrid('getRows')[index];
              	  e = onBeforeInitEditorFn.call(this, col, row, col.editor, index, field);
                }
            }
        }

        if(e===false)
        	return ; // 如果返回false，表示跳过cell editor状态

     // 2.遍历fields 确定点击状态cell的editor属性放出来 ， 非点击状态下cell的editor属性使用另一个变量保存

        for(var i=0; i<fields.length; i++){
          var col = $(dataGridSelector).iDatagrid('getColumnOption', fields[i]); // 拿到列属性
          col.editor1 = col.editor;// 新增列属性editor1保存editor
          if (fields[i] != field){ //判断是否是被点击的cell 如果不是先将editor属性清除
            col.editor = null;
          }else{
        	  if($.isPlainObject(e)){
        		  col.editor = e;
        	  }
          }
        }
        // 3.开始编辑行
        $(dataGridSelector).iDatagrid('beginEdit', index);
        this.setEditIndex(dataGridSelector, index);

        // 4.还原editor属性
        for(var i=0; i<fields.length; i++){
          var col = $(dataGridSelector).iDatagrid('getColumnOption', fields[i]);
          col.editor = col.editor1;
        }
    },
    init:function(dataGridSelector,index,field, onBeforeInitEditorFn){

      if (this.endEditing(dataGridSelector)){
        $(dataGridSelector).iDatagrid('selectRow', index) ;
        this.edit(dataGridSelector, index,field, onBeforeInitEditorFn);
      }else{
    	  $.app.show(message.core.info.data_invalid_4grid);
    	  return;
      }
    },
    initRow:function(dataGridSelector,index,row, onBeforeInitEditorFn){
    	if (this.endEditing(dataGridSelector)){
            $(dataGridSelector).iDatagrid('selectRow', index) ;
            this.rowedit(dataGridSelector, index,row, onBeforeInitEditorFn);
          }else{
        	  $.app.show(message.core.info.data_invalid_4grid);
        	  return;
          }
    },
    /**
     * rollback the changes
     * callback(changes) return true or false,
     * return false will do no. and others will do reject.
     */
    rollback:function(dataGridSelector, callback, force, notconfirm){

    	var c = $(dataGridSelector);
		var cs = c.iDatagrid('getChanges');

		if(cs.length==0)
		{
			$.iGrid.EditCell.endEditing(dataGridSelector, true);

			if(notconfirm){

			}else
			{
				$.app.show(message.core.info.not_changed_4grid);
			}

			c.iDatagrid('rejectChanges');

			return true;
		}else
		{
			$.app.debug(cs);

			if(notconfirm){

				if($.iGrid.EditCell.endEditing(dataGridSelector, force)){

    				if(callback){
    					var r = callback.call($(dataGridSelector).datagrid('options'), cs,
    							function(){
    						c.iDatagrid('rejectChanges');
    						});
    					}

    				else
    					c.iDatagrid('rejectChanges');
				}else
				{
		    		$.app.show(message.core.info.data_invalid2);
		    		return false;
				}

			}else
			{
				$.app.confirm(message.core.info.reject_confirm.format(cs.length), function(){

					if($.iGrid.EditCell.endEditing(dataGridSelector, force)){

	    				if(callback){
	    					var r = callback.call($(dataGridSelector).datagrid('options'), cs,
	    							function(){
	    						c.iDatagrid('rejectChanges');
	    						});
	    					}

	    				else
	    					c.iDatagrid('rejectChanges');
					}else
					{
			    		$.app.show(message.core.info.data_invalid2);
			    		return false;
					}
				});
			}

		}

    },
    save:function(dataGridSelector, callback, notconfirm){

		if($.iGrid.EditCell.endEditing(dataGridSelector))
		{
			var c = $(dataGridSelector);
			var cs = c.iDatagrid('getChanges');

			if(cs.length==0)
			{
				if(notconfirm){

				}else{
					$.app.show(message.core.info.not_changed);
				}

				if(callback){
					var r = callback.call($(dataGridSelector).datagrid('options'), cs, function(){c.iDatagrid('acceptChanges');});
				}
				else{
					c.iDatagrid('acceptChanges');
				}
			}
			else
			{
				//$.app.debug(cs);

				if(notconfirm)
				{
					if(callback){
						var r = callback.call($(dataGridSelector).datagrid('options'), cs, function(){c.iDatagrid('acceptChanges');});
					}
					else{
						c.iDatagrid('acceptChanges');
					}
				}
				else{
					$.app.confirm(message.core.info.save_confirm.format(cs.length), function(){
						if(callback){
							var r = callback.call($(dataGridSelector).datagrid('options'), cs, function(){c.iDatagrid('acceptChanges');});
						}
						else{
							c.iDatagrid('acceptChanges');
						}

					});
				}
			}

			return true;
		}else{
			$.app.show(message.core.info.data_invalid2);
			return false;
		}
    },
    addRow:function(dataGridSelector, callback, addIndex){
    	var c = $(dataGridSelector);
        if ($.iGrid.EditCell.endEditing(dataGridSelector)){
        	var row;
        	if(callback){
            	row = callback.call($(dataGridSelector).datagrid('options'));
            }

        	if(row===false)
            	return ;

        	$.app.showProgress(message.core.info.in_processing);

        	row = row || {};
        	row['__new__'] = true;

        	if(addIndex)
        		var index = addIndex;
        	else{
        		var index = 0 ;// 添加行的编号

				if(row['rowIndex']){
					index = row['rowIndex'];
				}
			}

			if(row['needAppend']){
				c.iDatagrid('appendRow',row);
				index = c.datagrid('getRows').length-1;
			}else{
				// 1.插入一行
				c.iDatagrid('insertRow',{
				  index:index,   // 索引从0开始
				  row: row
				});
			}


            ////
            e = row.editor;
            if($.isPlainObject(e)){
            	// 1.定义变量
            	var opts = $(dataGridSelector).iDatagrid('options');//  获得表格的属性
                var frozenFields = $(dataGridSelector).iDatagrid('getColumnFields',true); // 获取冻结列
                var fields = $(dataGridSelector).iDatagrid('getColumnFields'); // 获取解冻列
                fields = frozenFields.concat(fields); // 连接冻结列和解冻列的数组

                var coloptoins = {};

             // 2.遍历fields 确定点击状态cell的editor属性放出来 ， 非点击状态下cell的editor属性使用另一个变量保存
                for(var i=0; i<fields.length; i++){
                  var col = $(dataGridSelector).iDatagrid('getColumnOption', fields[i]); // 拿到列属性
                  //col.editor1 = col.editor;// 新增列属性editor1保存editor

                  var coloption = $.extend(1, {}, col);
                  coloptoins[col.field] = coloption;
                  //col.editor = null;
                }

                for(var i=0; i<fields.length; i++){
                    var col = $(dataGridSelector).iDatagrid('getColumnOption', fields[i]); // 拿到列属性
                    var newColopt = e[col.field];

                    if(newColopt&&newColopt.editor){
                    	col.editor1 = col.editor;
                    	col.editor = newColopt.editor;
                    }
                  }
            }

            // 3.开始编辑行
            $(dataGridSelector).iDatagrid('beginEdit', index);

            // 4.选中当前行
            $.iGrid.EditCell.setEditIndex(dataGridSelector, index);

			$(dataGridSelector).iDatagrid('scrollTo', index);


            // 4.还原editor属性
            if($.isPlainObject(e)){
    	        for(var i=0; i<fields.length; i++){
    	          var col = $(dataGridSelector).iDatagrid('getColumnOption', fields[i]);
    	          var newColopt = e[col.field];

    	          if(newColopt&&newColopt.editor){
    	        	  col.editor = col.editor1;
    	        	  col.editor1 = null;
    	          }
    	        }
            }
            $.app.closeProgess();
            return true;
        }else{
        	$.app.show(message.core.info.data_invalid2);
        	return false;
        }
    },
    removeRowByIndex:function(dataGridSelector, index, after, notconfirm) {
    	var c = $(dataGridSelector);

        if(notconfirm){

        	var success = function(){
                if ($.iGrid.EditCell.getEditIndex(dataGridSelector) == undefined){
                  c.iDatagrid('deleteRow', index);
                }else if($.iGrid.EditCell.getEditIndex(dataGridSelector) == index ){
                  c.iDatagrid('cancelEdit', index).iDatagrid('deleteRow', index);
                  $.iGrid.EditCell.setEditIndex(dataGridSelector, undefined);
                }else{
                  c.iDatagrid('deleteRow', index)
                }
        	}

        	if(after){
        		after.call($(dataGridSelector).datagrid('options'), index, success);
        	}else
    		{
        		success.call();
    		}
        }
        else
    	{

            $.app.confirm(message.core.info.remove_confirm.format(rows.length),function(){

            	var success = function(){

                    if ($.iGrid.EditCell.getEditIndex(dataGridSelector) == undefined){
                      c.iDatagrid('deleteRow', index);
                    }else if($.iGrid.EditCell.getEditIndex(dataGridSelector) == index ){
                      c.iDatagrid('cancelEdit', index).iDatagrid('deleteRow', index);
                      $.iGrid.EditCell.setEditIndex(dataGridSelector, undefined);
                    }else{
                      c.iDatagrid('deleteRow', index)
                    }
            	}

            	if(after){
            		after.call($(dataGridSelector).datagrid('options'), index, success);
            	}else
        		{
            		success.call();
        		}

            });
    	}


        if (this.getEditIndex(dataGridSelector) == undefined){return}

    },
    removeRow:function(dataGridSelector, after, notconfirm) {
    	var c = $(dataGridSelector);
        var rows =  c.iDatagrid('getChecked');

        if(rows.length == 0){
         return  $.app.alert(message.core.info.remove_without_selection); // 未勾选的话弹出消息窗口
        }

        if(notconfirm){

        	var success = function(){

            	var newRows = $.extend([], rows);

                $.each(newRows, function (i) {
                  var index = undefined;
                  index = c.iDatagrid('getRowIndex',newRows[i]);

                  if(index<0){
                	  $.app.err('can find getRowIndex');
                	  return true;
                  }

                  if ($.iGrid.EditCell.getEditIndex(dataGridSelector) == undefined){
                    c.iDatagrid('deleteRow', index);
                  }else if($.iGrid.EditCell.getEditIndex(dataGridSelector) == index ){
                    c.iDatagrid('cancelEdit', index).iDatagrid('deleteRow', index);
                    $.iGrid.EditCell.setEditIndex(dataGridSelector, undefined);
                  }else{
                    c.iDatagrid('deleteRow', index)
                  }
                });

                delete newRows;
                newRows = undefined;

        	}

        	if(after){
        		after.call($(dataGridSelector).datagrid('options'), rows, success);
        	}else
    		{
        		success.call();
    		}
        }
        else
    	{

            $.app.confirm(message.core.info.remove_confirm.format(rows.length),function(){

            	var success = function(){

                	var index = undefined;
                    $.each(rows, function (i) {
                      index = c.iDatagrid('getRowIndex',rows[i]);
                      if ($.iGrid.EditCell.getEditIndex(dataGridSelector) == undefined){
                        c.iDatagrid('deleteRow', index);
                      }else if($.iGrid.EditCell.getEditIndex(dataGridSelector) == index ){
                        c.iDatagrid('cancelEdit', index).iDatagrid('deleteRow', index);
                        $.iGrid.EditCell.setEditIndex(dataGridSelector, undefined);
                      }else{
                        c.iDatagrid('deleteRow', index)
                      }
                    });

            	}

            	if(after){
            		after.call($(dataGridSelector).datagrid('options'), rows, success);
            	}else
        		{
            		success.call();
        		}

            });
    	}


        if (this.getEditIndex(dataGridSelector) == undefined){return}

    }
};



// do for update row['__new__'] = true;

/** not need this segment. As add delete row['__new__'] code in cubeui.core.min.js at line 11958, after judge it.
$.fn.datagrid.defaults.onAfterEdit = $.easyui.event.delegate(
		$.fn.datagrid.defaults.onAfterEdit,
		function(index,row,changes){
			row['__new__'] == undefined;
			delete row['__new__'];
		}
);
**/

/**
 * 专门处理onclickCell来进行Cell修改的handle生成器，如果要进行cell的edit，
 * onClickCell:$.iGrid.createEditCellHandle(
                	function(col, row, editor, index, field){});

 * onBeforeInitEditorFn是回调，返回值是null或者editor，如果需要定制同一个column的不同值有不同的类型，即可扩展这个
 * 回调函数， function(col, row, editor, index, field){}
 *   col  当前的col 为column的options对象
 *   row  当前行数据
 *   editor 当前的编辑器，如果不修改编辑器，
 *   		直接返回editor即可。 要修改返回修改好的editor，
 *   		返回null，无编辑器，即无法编辑
 *   index  当前记录的index
 *   field  当前column对应的field
 */
$.iGrid.EdatagridHandle = {
	cellClickHanle : function(onBeforeInitEditorFn){
		return function(index,field){
			var dataGridSelector = '#'+$(this).datagrid('options').id;
			$.iGrid.EditCell.init(dataGridSelector,index,field, onBeforeInitEditorFn);

			$.extends.stopPropagation();
		}
	},
	rowEditRowEventHanle : function(onBeforeInitEditorFn){
		return function(index,row){
			var dataGridSelector = '#'+$(this).datagrid('options').id;
			$.iGrid.EditCell.initRow(dataGridSelector,index,row, onBeforeInitEditorFn);

			$.extends.stopPropagation();
		}
	},
	rowEditCellEventHanle : function(onBeforeInitEditorFn){
		return function(index,field){
			var dataGridSelector = '#'+$(this).datagrid('options').id;
			var row = $(dataGridSelector).datagrid('getRows')[index];
			$.iGrid.EditCell.initRow(dataGridSelector,index,row, onBeforeInitEditorFn);

			$.extends.stopPropagation();
		}
	},
	saveHandle : function(dataGridSelector, before, after, notconfirm){
		return function(e){

	        var r = null;

	        if(before){
	        	r = before.call($(dataGridSelector).datagrid('options'), $(dataGridSelector).iDatagrid('getChanges'));
	        }

	        if(r===false){
	        	return ; // do no
	        }

			$.iGrid.EditCell.save(dataGridSelector, after, notconfirm);
		}
	},
	rollbackHandle : function(dataGridSelector, before, after, force, notconfirm){
		return function(e){

	        var r = null;

	        if(before){
	        	r = before.call($(dataGridSelector).datagrid('options'), $(dataGridSelector).iDatagrid('getChanges'));
	        }

	        if(r===false){
	        	return ; // do no
	        }

			$.iGrid.EditCell.rollback(dataGridSelector, after, force, notconfirm);
		}
	},
	addRowHandle : function(dataGridSelector, before, after){
		return function(e){
			var r = null;
			if(before!=null)
				r = before.call($(dataGridSelector).datagrid('options'));

			if(r===false){
				return ;// do no
			}else{
				$.iGrid.EditCell.addRow(dataGridSelector, after);
			}
		}
	},
	removeRowHandle : function(dataGridSelector, before, after, notconfirm){
		return function(e){

	        var r = null;

	        if(before){
	        	r = before.call($(dataGridSelector).datagrid('options'), $(dataGridSelector).iDatagrid('getChecked'));
	        }

	        if(r===false){
	        	return ; // do no
	        }

			$.iGrid.EditCell.removeRow(dataGridSelector, after, notconfirm);
		}
	}
};

$.iDialog = $.extend(!0, $.iDialog, {
	findOutterFormJquery:function(target){
		var form =   $(target).closest('div.panel.window').find('form');
		return form;
	},
	findOutterForm:function(target){
		var form =   $(target).closest('div.panel.window').find('form');
		return form.isNull()?null:form[0];
	},
	findOutterDialogJquery:function(target){
		var dialog =  $(target).closest('div.panel.window').find('.panel-body.window-body');
		return dialog;
	},
	findOutterDialog:function(target){
		var dialog =  $.iDialog.findOutterDialogJquery(target);
		return dialog.isNull()?null:dialog[0];
	},
	closeOutterDialog:function(target){
		var c = $.iDialog.findOutterDialog(target);

		c && $(c).iDialog('close');
	},
	openDialog:  function(b){
		$("#" + b.id).iDialog("createDialog", b);
		//$("#" + b.id).iDialog
		//b = $("#" + b.id)
		checkAndOpenDialog(b.href, $("#" + b.id));

		return b.id;
	},
	closeDialog:function(id){
		$.app.closeDialog(id);
	},
	findDialogId4Button: function(btnobj){
		return ($.data(btnobj, 'linkbutton')
				&& $.data(btnobj, 'linkbutton').options)?
		$.data(btnobj, 'linkbutton').options.dialogId:null;
	},
	closeDialog4Btn : function(btnobj){
		var did = $.iDialog.findDialogId4Button(btnobj);

		if(did)
			$.app.closeDialog(did);
	}
});


///// cube default

$.cube = $.extend(1, $.cube, {
	dialog:{
		defaults:{
			openAnimation: 'slide',
			collapsible:false,
			height: "auto",
            /*maximized:true,*/
		}
	},
	datagrid:{
		defaults:{
			rownumberWidth: 30,
			selectOnCheck: true,
		    checkOnSelect: true,
		    singleSelect: false,
		    rownumbers: true,
		    pagination: true,
			method: 'get',
		    pageSize: 20,
		    pageList:[10,20,30,50],
			remoteFilter: !1,
			loader:function(param, okfn, failfn){
				var d = $(this).datagrid('options');
				var dg = $(this);
				return !!d['url'] && void $['ajax']({
					type: d['method'],
					url: d['url'],
					data: param,
					dataType: 'json',
					success: function(a) {
						dg.datagrid('setLocalRows', a.data.list);
						okfn(a)
					},
					error: function() {
						failfn['apply'](this, arguments)
					}
				})
			}
		}
	},
	panel:{
			getZindex:function(target){
				var ps = $(target).parents('.panel.panel-htop');
				var zindex = 0;
				$.each(ps, function(idx, p){
					var cssstr = $(p).css('z-index');

					if(cssstr && !$.extends.isEmpty(cssstr)){
						if(cssstr!='auto'){
							zindex = cssstr - 0;
						}
					}
				});

				return zindex;
			}
	}
});


///// extends datagrid defaults

$.fn.datagrid.defaults = $.extend({},
		$.fn.datagrid.defaults,
		$.cube.datagrid.defaults);

$.fn.iDatagrid.defaults = $.extend({},
		$.fn.iDatagrid.defaults,
		$.cube.datagrid.defaults);

///// extends iDialog defaults
$.fn.dialog.defaults = $.extend({},
		$.fn.dialog.defaults,
		$.cube.dialog.defaults,{
			onClose:$.easyui.event.wrap(
					$.fn.dialog.defaults.onClose,
					function(){
						$(this).dialog("destroy");
					}
			),
            onMaximize:function(){
            	var opt = $(this).dialog('options');

            	if(opt.restorable===false){
		            $(this).dialog('dialog').find('.panel-tool-restore').hide();
            	}
            }
		});

$.fn.iDialog.defaults = $.extend({},
		$.fn.iDialog.defaults,
		$.cube.dialog.defaults,{
			onClose:$.easyui.event.wrap(
					$.fn.dialog.defaults.onClose,
					function(){
						$(this).dialog("destroy");
					}
			)
		});

$.fn.datagrid.defaults.onLoadSuccess = $.easyui.event.wrap(
		$.fn.datagrid.defaults.onLoadSuccess,
		function(data){

			 $(".easyui-tooltip").tooltip({
                 onShow: function () {
                     $(this).tooltip('tip').css({
                         borderColor: '#000'
                     });
                 }
             });

			var target = this;
			var options = $(target).datagrid('options');
			data = $(target).datagrid('getData');

			if(options && options.onRefreshFooter){
				var newfooterdata = options.onRefreshFooter.call(target, data);

				if(newfooterdata && $.isArray(newfooterdata) && newfooterdata.length>0){
					$.each(newfooterdata, function(idx, row){
						row.ISFOOTER = true;
					});

					$(target).datagrid('reloadFooter', newfooterdata);
				}
			}

			var keepChecked = options.keepChecked;

			if(!keepChecked){
				$(target).datagrid('clearChecked');
			}

			var checkedField = options.checkedField;

			if(checkedField){
				var rows = $(target).datagrid('getRows');

				$.each(rows, function(idx, row){
					if(row[checkedField]){
						$(target).datagrid('checkRow', idx);
					}
				})
			}
		}
);


$.fn.iTreegrid.defaults.onLoadSuccess4RefreshFooter = function(target, data){
	//var target = this;
	var options = $(target).treegrid('options');
	data = $(target).treegrid('getData');

	if(options && options.onRefreshFooter){
		var newfooterdata = options.onRefreshFooter.call(target, data);

		if(newfooterdata && $.isArray(newfooterdata) && newfooterdata.length>0){
			$.each(newfooterdata, function(idx, row){
				row.ISFOOTER = true;
			});

			$(target).treegrid('reloadFooter', newfooterdata);
		}
	}
}

$.fn.iDatagrid.defaults.onLoadSuccess4CheckSelected = $.easyui.event.wrap(
		$.fn.datagrid.defaults.onLoadSuccess,
		function(data){
			//$.app.debug(this);

			 $(".easyui-tooltip").tooltip({
                onShow: function () {
					try{
						$(this).tooltip('tip').css({
							borderColor: '#000'
						});
					}catch (e) {

					}
                }
            });

			$.app.debug('invoke on load success with iDatagrid.defaults.onLoadSuccess4CheckSelected.');

			var c = $(this).iDatagrid('options');


			var cr = c ? (c.checkedRows||data.checkedRows): data.checkedRows;

			var d = this;

			if(data && cr){
				if(c && c.idField){
					$.each(data.rows, function (index, item) {

						if($.inArray2(item[c.idField], cr)>=0){
							$(d).datagrid('checkRow', index);
						}
			        });
				}

			}
		}
);

$.fn.iTreegrid.defaults.onLoadSuccess4CheckSelected = function(row, data){
	//$.app.debug(this);
	$.app.debug('invoke on load success with $.fn.iTreegrid.defaults.onLoadSuccess4CheckSelected.');
	$.fn.iTreegrid.defaults.onLoadSuccess4RefreshFooter(this, data);


	 $(".easyui-tooltip").tooltip({
        onShow: function () {
            $(this).tooltip('tip').css({
                borderColor: '#000'
            });
        }
    });

	var c = $(this).treegrid('options');
	var keepChecked = c.keepChecked;

	if(!keepChecked){
		$(this).treegrid('clearChecked');
	}

	var cr = c ? (c.checkedRows||data.checkedRows): data.checkedRows;

	var d = this;

	if(data && cr){
		$.each(cr, function(idx, item){
			if($(d).treegrid('find', cr[idx]))
				$(d).treegrid('select', cr[idx]);
		});
	}

	var cn = c ? (c.checkedNodes||data.checkedNodes): data.checkedNodes;
	if(data && cn){
		$.each(cn, function(idx, item){
			if($(d).treegrid('find', cn[idx]))
				$(d).treegrid('checkNode', cn[idx]);
		});
	}

}

////// static methods
$.iGrid = $.extend(!0, $.iGrid, {
	getRowIndex : function(target){
		    var tr =  $(target).closest('tr.datagrid-row');
		// add by david for detailView extends with groupview and subgridview, the tr will return null

		if(tr && !tr.isNull()){
			//
			try{
				return parseInt(tr.attr("datagrid-row-index"));  
			}catch(err){
				return -1;
			}
		}else{
			var subgridtr = $(target).closest('tr>td>.datagrid-row-detail').closest('tr');
			//$(target).closest('tr .datagrid-row-detail').closest('tr')
			//<tr id="datagrid-row-r4-2-0" class="datagrid-row  " datagrid-row-index="0" style="">
			//<tr style="display: table-row; height: 38px;">
			//		<td colspan="9">
			//			<div class="datagrid-row-detail">

			if(subgridtr && !subgridtr.isNull()){
				tr = subgridtr.prev("[datagrid-row-index].datagrid-row");
				return parseInt(tr.attr("datagrid-row-index"));
			}else{
				return -1;
			}
		}
		                
	},
	editorFireEvent:function(datagrid, idx, field){
		var ed = $.iGrid.getEditor(datagrid, idx, field);
		var c = ed.actions.getValue(ed.target);
		ed.actions.setValue(ed.target,'');
		ed.actions.setValue(ed.target,c);
	},
	getEditor : function(datagrid, idx, field){
		return $(datagrid).datagrid('getEditor',{index:idx,field:field});
	},
	getEditorTarget : function(datagrid, idx, field){
		var ed = $.iGrid.getEditor(datagrid, idx, field);
		return ed.target;
	},
	getEditorValue : function(datagrid, idx, field){
		var ed = $.iGrid.getEditor(datagrid, idx, field);
		return ed.actions.getValue(ed.target);
	},
	setEditorValue : function(datagrid, idx, field, value){
		var ed = $.iGrid.getEditor(datagrid, idx, field);
		ed.actions.setValue(ed.target,value);
	},
	setEditorValueNoTrigger : function(datagrid, idx, field, value){
		var ed = $.iGrid.getEditor(datagrid, idx, field);
		$(ed.target).textbox('initValue', value);
		//ed.actions.setValue(ed.target,value);
	},
	toExcel: function(exportopts, filename){
		if(exportopts.length==1){
			var opt = $.extend(0, exportopts[0]);
			opt.datagrid = null;
			opt.datagrid = undefined;
			opt.filename = filename;

			$(exportopts[0].datagrid).datagrid('toExcel', opt);
			return ;
		};

		var sheets = [];

		$.each(exportopts, function(idx, exportopt){
			var sheet = {};
			sheet.worksheet = exportopt.worksheet;
			sheet.table = $(exportopt.datagrid).datagrid('toHtml2', {rows:exportopt.rows, title:exportopt.title});

			sheets.push(sheet);
		});

		$.extends.toExcel(sheets, filename);
	}
});

$.iMenubutton = $.extend(!0, $.iMenubutton, {
	find: function(target, name){
		if(target)
			target = $(target);
		else{
			return null;
		}

		var btns = target.find('.l-btn span.l-btn-text');
		var rtn = null;
		$.each(btns, function(idx, btn){
			var btntext= $(btn).text();

			if(btntext.trim()==name.trim()){
				rtn = $(btn).closest('.l-btn');
				return false;
			}
		});

		return rtn;
	},
	find2: function(target, name){
		if(target){
			target = $(target).closest('.panel');

			return $.iMenubutton.find(target, name);
		}
		else{
			return null;
		}
	}
});

$.fn.iMenubutton.defaults.onClick = $.easyui.event.wrap(
		$.fn.iMenubutton.defaults.onClick,
			function(){
				var buttontarget = this;
				$.app.debug('imenubutton click.');
				var opts = $(this).menubutton('options');
				if(opts.filter){

					var gridobj = $('#'+opts.filter.id);

					if(gridobj.isNull()){
						console.error('can not find '+opts.filter.id);
						return ;
					}

					var panelobj = gridobj[opts.filter.type]('getPanel');

					if(panelobj.isNull()){
						console.error('can not find grid panel.');
						return ;
					}

					var filterdiv = panelobj.find('div.cube-filter');

					if(filterdiv.isNull()){
						if(opts.filter.fields && opts.filter.fields.length>0){
							filterdiv = $("<div class='cube-filter'></div>");

							var filterinner = $('<div class="cubeui-fluid"><fieldset><legend>过滤条件</legend></fieldset></div>');
							filterdiv.append(filterinner);

							panelobj.find('.cubeui-toolbar').append(filterdiv);

							$.each(opts.filter.fields, function(idx, fields){
								if(fields&&fields.length>0){
									var rowcount = parseInt(12/fields.length);

									var rowobj = $('<div class="cubeui-row span5" ></div>');

									$.each(fields, function(i, field){

										var fieldcolobj = $('<div class="cubeui-col-sm'+rowcount+'"></div>');
										rowobj.append(fieldcolobj);

										if(!field.field){
											fieldcolobj.append('<label class="cubeui-form-label"></label>');
											return true;
										}

										fieldcolobj.append('<label class="cubeui-form-label">'+field.title+':</label><div class="cubeui-input-block"></div>');

										field.type = field.type||'textbox';
										field.title = field.title || field.field;

										var fieldobj = $('<input type="text">');
										/*
										if(!$.extends.isEmpty(field.options.value)){
											fieldobj.val(field.options.value);
										}
										*/

										var optionstr = $.extends.json.tostring(field.options);

										fieldobj.attr('name', field.field);
										fieldobj.attr('data-toggle', "cubeui-"+field.type);
										fieldobj.attr('data-options', optionstr);

										fieldcolobj.find('.cubeui-input-block').append(fieldobj);

										//field.target = fieldobj;
										/*
										if(field.type){
											$(fieldobj)[field.type](field.options);
										}
										*/
									});

									filterinner.append(rowobj);

								}
								else{
									return true;
								}

							});

							$.parser.parse(filterinner);

							$.each(opts.filter.fields, function(idx, fields){
								if(fields&&fields.length>0){

									$.each(fields, function(i, field){
										var target = field.targetobj;
										field.target = null;
										/*
										if(field.type){
											$(target)[field.type](field.options);
										}
										*/
									});
								}
							});

						}else{
							console.error('can not find div.cube-filter and options.filter.fields');
							return;
						}
					}

					if(filterdiv.isNull()){
						console.error('can not find div.cube-filter');
						return;
					}else{
						var cube = filterdiv.data('cube');
						var opened = false;

						if(cube==null){
							cube = {opened:false};
							filterdiv.data('cube', cube);
						}

						var id = $.extends.getRandomNum();
						var diaobj = $("<form id='form_"+id+"' class='filter'></form>");

						opened = cube.opened;

						diaobj.append(filterdiv.children());
						$('body').append(diaobj);

						$(buttontarget).menubutton('disable');

						width = opts.filter.width || 800;
						height = opts.filter.height || 'auto';

						diaobj.dialog({
							modal:false,
							collapsible:true,
				            width: width,
				            height:height,
							title:message.core.label.filter_query,
							openAnimation:'fade',
							iconCls:'fa fa-search',
							onBeforeDestroy:function(){
								$(buttontarget).menubutton('enable');
								filterdiv.append(diaobj.children());
							},
							buttons:[
			                    {
			                        text: message.core.label.reset,
			                        iconCls: 'fa fa-refresh',
			                        btnCls: 'cubeui-btn-green',
			                        onClick:function(){

			                        	var formobj = $('#form_'+id);
			                        	$('#form_'+id).form('reset');
			                        	var param = diaobj.serializeJson();

			                        	if(!$('#form_'+id).form('validate')){
			                        		$.app.showerror(message.core.info.filter_invalid);
			                    			return false;
			                    		}

			                        	if(opts.filter.onBeforeReset){
			                        		var rtnobj = opts.filter.onBeforeReset.call(formobj, param);

			                        		if(rtnobj){
			                        			$.app.showerror(rtnobj);
				                    			return false;
			                        		}
			                        	}

			                        	var oldurl = gridobj.datagrid('options').url;

			                        	if(opts.filter.url){
				                        	gridobj.datagrid('options').url = opts.filter.url;
			                        	}

			                        	gridobj.datagrid('load', param);

			                        	gridobj.datagrid('options').url=oldurl;

			                        	if(opts.filter.onAfterReset){

			                        		var rtnobj = opts.filter.onAfterReset.call(formobj, param);

			                        		if(rtnobj){
			                        			$.app.showerror(rtnobj);
				                    			return false;
			                        		}
			                        	}
			                        	/*
			                        	$('#form_'+id).form('clear');
			                        	gridobj.datagrid('load', {});
			                        	*/
			                        	//
			                        	//$.iDialog.findOutterDialogJquery(this).dialog('close');
			                        }
			                    },
			                    {
			                        text: message.core.label.search,
			                        iconCls: 'fa fa-search',
			                        onClick:function(){
			                        	var formobj = $('#form_'+id);
			                        	var param = diaobj.serializeJson();
			                        	if(!$('#form_'+id).form('validate')){
			                        		$.app.showerror(message.core.info.filter_invalid);
			                    			return false;
			                    		}

			                        	if(opts.filter.onBeforeAction){
			                        		var rtnobj = opts.filter.onBeforeAction.call(formobj, param);

			                        		if(rtnobj){
			                        			$.app.showerror(rtnobj);
				                    			return false;
			                        		}
			                        	}

			                        	var oldurl = gridobj.datagrid('options').url;

			                        	if(opts.filter.url){
				                        	gridobj.datagrid('options').url = opts.filter.url;
			                        	}

			                        	gridobj.datagrid('load', param);

			                        	gridobj.datagrid('options').url=oldurl;

			                        	if(opts.filter.onAfterAction){

			                        		var rtnobj = opts.filter.onAfterAction.call(formobj, param);

			                        		if(rtnobj){
			                        			$.app.showerror(rtnobj);
				                    			return false;
			                        		}
			                        	}
			                        },
			                        btnCls: 'cubeui-btn-orange'
			                    },
			                    {
			                        text: message.core.label.close,
			                        iconCls: 'fa fa-close',
			                        btnCls: 'cubeui-btn-red',
			                        onClick:function(){


			                        	if(opts.filter.onClose){
			                        		var formobj = $('#form_'+id);
			                        		var param = diaobj.serializeJson();
			                        		var rtnobj = opts.filter.onClose.call(formobj, param);

			                        		if(rtnobj){
			                        			$.app.showerror(rtnobj);
				                    			return false;
			                        		}
			                        	}

			                        	$.iDialog.findOutterDialogJquery(this).dialog('close');
			                        }
			                    }
							]
						});

						//if(opened==false)
						//	$('#form_'+id).form('clear');

						cube.opened = true;
						//filterdiv.dialog({modal:true});
					}
				}
			}
		)

function synto_fn(target, newValue,oldValue){

	var opts = $(target).textbox('options');

	if(opts.synto){
		var synto = $(target).closest('form').find('[textboxname="'+opts.synto.field+'"]');

		if(synto.isNull())
			return;

		var type = opts.synto.type||'textbox';

		if($(synto)[type]('options')){

			var value = $(synto)[type]('getValue');
			if($.extends.isEmpty(value) || value==oldValue){
				$(synto)[type]('setValue', newValue);
				return ;
			}
		}
	}

}

$.fn.numberbox.defaults.onChange = $.easyui.event.wrap(
		$.fn.numberbox.defaults.onChange,
		function(newValue,oldValue){
			synto_fn(this, newValue,oldValue);
		}
)

$.fn.numberspinner.defaults.onChange = $.easyui.event.wrap(
		$.fn.numberspinner.defaults.onChange,
		function(newValue,oldValue){
			synto_fn(this, newValue,oldValue);
		}
)

$.fn.textbox.defaults.onChange = $.easyui.event.wrap(
		$.fn.textbox.defaults.onChange,
		function(newValue,oldValue){
			var opts = $(this).textbox('options');

			if(opts.synto){
				var synto = $(this).closest('form').find('[textboxname="'+opts.synto.field+'"]');

				if(synto.isNull())
					return;

				var type = opts.synto.type||'textbox';

				if($(synto)[type]('options')){

					var value = $(synto)[type]('getValue');
					if($.extends.isEmpty(value) || value==oldValue){
						$(synto)[type]('setValue', newValue);
						return ;
					}
				}
			}
		}
)

$.iTextbox = $.extend(!0, $.iTextbox, {
	/**
	 * bind associate for textbox in EditDatagrid editor.
	 */
	bindcalculated:function(fields, datagrid, idx, row, calculatefn){
		if(calculatefn){
			var obj = $(datagrid);
			$.each(fields, function(i, field){
				var ed = obj.datagrid('getEditor',{index:idx,field:field});

				$.easyui.event.on(ed.target, 'textbox', 'change', function(nv, ov){
					return calculatefn.call(ed, field, idx, row, nv, ov);
				}, true);
			});
		}
	},
	/**
	 * bind associate for textbox in form.
	 */
	bindcalculatedfield:function(objs, calculatefn){
		if(calculatefn){
			$.each(objs, function(i, obj){
				$.easyui.event.on(obj, 'textbox', 'change', function(nv, ov){
					calculatefn.call(obj, nv, ov);
				});
			});
		}
	},
	findByName:function(target, name){
		return $(target).closest('form').find('[textboxname="'+name+'"]');
	},
	findInByName:function(target, name){
		return $(target).find('[textboxname="'+name+'"]');
	}
});

$.iCombogrid = $.extend(!0, $.iCombogrid, {
	/**
	 * bind associate for combogrid in EditDatagrid editor.
	 */
	bindassociated:function(obj, datagrid, idx, row){
		var c = $(obj).combogrid('options');

		if(c.associates){

			var as = null;
			if(!$.isArray(c.associates))
				as = [c.associates];
			else
				as = c.associates;

			var dg = $(datagrid);

			if(!c.associates_bind){
				$.easyui.event.on(obj, 'combogrid', 'select', function(i, record){

					$.each(as, function(index, a){
						//a.field
						var f = a.rowfield;
						var f2 = a.field;

						if(f && f2){

							var ed = dg.datagrid('getEditor',{index:idx,field:f});
							if(ed){
								var f3 = a.expression;
								if(f3){
									// context object include row, record
									var re = eval(f3);
									ed.actions.setValue(ed.target,re);
								}else{
									if(a.template){
										ed.actions.setValue(ed.target, a.template.format(row).format2(record));
									}else{
										ed.actions.setValue(ed.target,record[f2]);
									}
								}
							}else{
								var f3 = a.expression;
								if(f3){
									// context object include row, record
									var re = $.extends.eval(f3);
									row[f] = re;
								}else{
									if(a.template){
										row[f] = a.template.format(row).format2(record);
									}else{
										row[f] = record[f2];
									}
								}
							}
						}

					});
				});
			}

		}
	}
});


$.iCombobox = $.extend(!0, $.iCombobox, {
	bindAssociated : function(obj, associateds, append){
		if(obj && associateds){
			var ls = null;
			if(!$.isArray(associateds)){
				ls = [associateds];
			}else{
				ls = associateds;
			}

			var o = $(obj).combobox('options');

			if(!o['__associateds__']){
				$.easyui.event.on(obj, 'combobox', 'select', function(r){
					var o = $(this).combobox('options');
					var ls = o['__associateds__'];

					if(ls){
			        	$.each(ls, function(i, l){
			        		if(l.target && l.url){
			        			var href = l.url.format(r);
			        			$.app.debug('reload associateds  ' + l.target + ' with ' + href);
			        			$(l.target).combobox('reload',href);
			        		}else{
			        			if(l.field && l.rowfield && l.target){
			        				l.target[l.rowfield] = r[l.field ];
			        			}
			        		}
			        	});
					}
				});

				$.easyui.event.on(obj, 'combo', 'change', function(newv, oldv){
					var o = $(this).combobox('options');
					var ls = o['__associateds__'];
					if(ls){
						if($.extends.isEmpty(newv)){
							$.each(ls, function(i, l){
				    			if(l.target && l.url){
				    				$.app.debug('clear associateds  ' + l.target);
				    				$(l.target).combobox('loadData',[]);
				        			$(l.target).combobox('clear');
				    			}else{
				    				if(l.field && l.rowfield && l.target){
				        				l.target[l.rowfield] = '';
				        			}
				    			}
				        	});
						}
					}
				});
			}

			if(append && o['__associateds__']){
				o['__associateds__'] = concat(o['__associateds__'], ls);
			}else{
				o['__associateds__'] = ls;
			}




		}
	},
	linkageSelect : function(record){
		var o = $(this).combobox('options');
		//var vs = $(this).combobox('getValues');
		$.app.debug(' onselect ' + record[o.valueField]);

		var o = $(this).combobox('options');

		if(!o.linkage || o.linkage.length == 0)
			return true;

		var ls = null;

		if(!$.isArray(o.linkage)){
			ls = [o.linkage];
		}else{
			ls = o.linkage;
		}

		newv = record[o.valueField];

    	var obj = this;

    	if(!$.extends.isEmpty(newv)){
			var stockid = $(this).combobox('valueIndex', newv);
		}

    	if(stockid>=0){

    		var r = $(this).combobox('getData')[stockid];
    		$.app.debug(r);
        	$.each(ls, function(i, l){
        		if(l.ele && l.url){
        			var href = l.url.format(r);
        			$.app.debug('reload linkage  ' + l.ele + ' with ' + href);
        			$(l.ele).combobox('reload',href);
        		}
        	});

    	}else{



    		$.each(ls, function(i, l){
    			if(l.ele){
    				$.app.debug('clear linkage  ' + l.ele);
    				$(l.ele).combobox('loadData',[]);
        			$(l.ele).combobox('clear');
    			}
        	});
    	}
		//$.iCombobox.linkageChange.call(this, record[o.valueField]);

	},
	linkageChange : function(newv, oldv){
		var o = $(this).combobox('options');

		if(!o.linkage || o.linkage.length == 0)
			return true;

		var ls = null;

		if(!$.isArray(o.linkage)){
			ls = [o.linkage];
		}else{
			ls = o.linkage;
		}

    	$.app.debug('onchange = ' + newv);

    	var obj = this;

    	if(!$.extends.isEmpty(newv)){
			var stockid = $(this).combobox('valueIndex', newv);
		}

    	if(stockid>=0){
    		/*
    		var r = $(this).combobox('getData')[stockid];
    		$.app.debug(r);
        	$.each(ls, function(i, l){
        		if(l.ele && l.url){
        			$(l.ele).combobox('reload',l.url.format(r));
        		}
        	});
        	*/
    	}else{
    		$.each(ls, function(i, l){
    			if(l.ele){
    				$.app.debug('clear linkage  ' + l.ele);

    				$(l.ele).combobox('loadData',[]);
        			$(l.ele).combobox('clear');
    			}
        	});
    	}
	},
	initLinkageChangeEvent: function(jq){
		$.easyui.event.on(jq, 'combobox', 'change', $.iCombobox.linkageChange);
		$.easyui.event.on(jq, 'combobox', 'select', $.iCombobox.linkageSelect);
		//$(jq).combobox({onChange:$.iCombobox.linkageChange});
	},
	findByName: function(name){
		return $('[name="'+name+'"]').parent().prev('input.combobox-f[textboxname="'+name+'"]');
	},
	findBySource: function(src){
		return src.parent().prev('input.combobox-f');
	}
});

/**
 * Default extends
 */
$.fn.iDatagrid.defaults.onLoadSuccess = $.fn.iDatagrid.defaults.onLoadSuccess4CheckSelected;

$.fn.iTreegrid.defaults.onLoadSuccess = $.fn.iTreegrid.defaults.onLoadSuccess4CheckSelected;

$.fn.iCombo.defaults.onChange = $.easyui.event.delegate(
		$.fn.iCombo.defaults.onChange,

		function(newv, oldV){
			//$.app.debug(this);
			$.app.debug(' icombo onChange');
			var o = $(this).combo('options');
			var elementname = o.elementname;

			var formobj = $(this).closest('form');

			if(!$.extends.isEmpty(elementname)){
				if($.extends.isString(elementname)){
					formobj.find("input[name='"+elementname+"']").val(newv);
					$.app.debug(formobj.find("input[name='"+elementname+"']"));
				}else{
					/*$.each(elementname, function(k, v){
						$("input[name='"+k+"']").val(newv);
					});*/
				}
			}

			// on SelectCell callback.
			if(o.onChangeCell){
				var fn = o.onChangeCell;
				var c = $(this).combo('textbox');
				var c = $.iGrid.getRowIndex(c);

				fn.call(this, c, newv, oldV);
			}
			// on ClearCell callback.
			if($.extends.isEmpty(newv)){

				if(!$.extends.isEmpty(elementname)){
					if($.extends.isString(elementname)){
						formobj.find("input[name='"+elementname+"']").val(newv);
						$.app.debug(formobj.find("input[name='"+elementname+"']"));
					}else{
						/*$.each(elementname, function(k, v){
							$("input[name='"+k+"']").val(newv);
						});*/
					}
				}

				if(o.onClearCell){
					var fn = o.onClearCell;
					var c = $(this).combo('textbox');
					var c = $.iGrid.getRowIndex(c);

					fn.call(this, c, oldV);
				}
			}
		}
);

/**
 * onChangeCell for combo in EditDatagrid editor.
 * onClearCell for combo in EditDatagrid editor.
 */
$.fn.combo.defaults.onChange = $.easyui.event.delegate(
		$.fn.combo.defaults.onChange,
		function(newv, oldV){
			//$.app.debug(this);
			$.app.debug(' combo onChange');
			var o = $(this).combo('options');
			var elementname = o.elementname;

			var formobj = $(this).closest('form');

			if(!$.extends.isEmpty(elementname)){
				if($.extends.isString(elementname)){
					formobj.find("input[name='"+elementname+"']").val(newv);
					$.app.debug(formobj.find("input[name='"+elementname+"']"));
				}else{
					/*$.each(elementname, function(k, v){
						$("input[name='"+k+"']").val(newv);
					});*/
				}
			}

			// on SelectCell callback.
			if(o.onChangeCell){
				var fn = o.onChangeCell;
				var c = $(this).combo('textbox');
				var c = $.iGrid.getRowIndex(c);

				fn.call(this, c, newv, oldV);
			}
			// on ClearCell callback.
			if($.extends.isEmpty(newv)){

				if(!$.extends.isEmpty(elementname)){
					if($.extends.isString(elementname)){
						formobj.find("input[name='"+elementname+"']").val(newv);
						$.app.debug(formobj.find("input[name='"+elementname+"']"));
					}else{
						/*$.each(elementname, function(k, v){
							$("input[name='"+k+"']").val(newv);
						});*/
					}
				}

				if(o.onClearCell){
					var fn = o.onClearCell;
					var c = $(this).combo('textbox');
					var c = $.iGrid.getRowIndex(c);

					fn.call(this, c, oldV);
				}
			}
		}
);

/**
 * onSelectCell for combobox in EditDatagrid editor.
 */

$.fn.combobox.defaults.onInit = function(){
	var o = $(this).combobox('options');
	var target = this;
	if(o.dataUrl){
		$.app.debug('onInit load data with ' + o.dataUrl);
		$.app.getJson(o.dataUrl, null, function(data){
			var listdata = data.datas || data.data || data;
			$(target).combobox('loadData', listdata);
			$.app.debug('onInit load data with ' + o.dataUrl + ' sucessed');
		}, null);
	}
};

$.fn.combobox.defaults.onResize = $.easyui.event.delegate($.fn.combobox.defaults.onResize, function(){
	var o = $(this).combobox('options');
	var isInit = o.isInit;
	if(o.onInit && isInit == null){
		var fn = o.onInit;
		fn.call(this);
		o.isInit = 1;
	}
});

$.fn.combobox.defaults.onSelect = $.easyui.event.delegate(
		$.fn.combobox.defaults.onSelect,
		function(record){
			$.app.debug(this);
			$.app.debug(' combobox onSelect');
			$.app.debug(record);

			var o = $(this).combobox('options');
			var elementname = o.elementname;
			var formobj = $(this).closest('form');

			if(!$.extends.isEmpty(elementname)){
				if($.extends.isString(elementname)){
					formobj.find("input[name='"+elementname+"']").val(record[o.textField]);
					$.app.debug(formobj.find("input[name='"+elementname+"']"));
				}else{
					$.each(elementname, function(k, v){
						formobj.find("input[name='"+k+"']").val(record[v]);
					});
				}
				/*
				$("input[name='"+elementname+"']").val(record[o.textField]);
				$.app.debug($("input[name='"+elementname+"']"));
				*/
			}

			// on SelectCell callback.
			if(o.onSelectCell){
				var fn = o.onSelectCell;
				var c = $(this).combo('textbox');
				var c = $.iGrid.getRowIndex(c);

				fn.call(this, c, record);
			}
		}
);

//combogrid is not wrapped by icombogrid in datagrid editcell.
//do for onSelect for combogrid in datagrid editcell
$.fn.combobox.defaults = $.extend($.fn.combobox.defaults, {
	panelHeight: null,
	panelMinHeight:100,
	/*
	 * for scollbar
	panelMinHeight:100,
	panelHeight:'auto',
	panelMaxHeight:400*/
});

$.fn.iCombobox.defaults = $.extend($.fn.iCombobox.defaults, {
	panelHeight: null,
	panelMinHeight:100,
	/*
	 * for scollbar
	panelMinHeight:100,
	panelHeight:'auto',
	panelMaxHeight:400*/
});

$.fn.iCombobox.defaults.onInit = function(){
	var o = $(this).combobox('options');
	var target = this;
	if(o.dataUrl){
		$.app.debug('onInit load data with ' + o.dataUrl);
		$.app.getJson(o.dataUrl, null, function(data){
			var listdata = data.datas || data.data || data;
			$(target).combobox('loadData', listdata);
			$.app.debug('onInit load data with ' + o.dataUrl + ' sucessed');
		}, null);
	}
};

$.fn.iCombobox.defaults.onResize = $.easyui.event.delegate($.fn.combobox.defaults.onResize, function(){
	var o = $(this).combobox('options');
	var isInit = o.isInit;
	if(o.onInit && isInit == null){
		var fn = o.onInit;
		fn.call(this);
		o.isInit = 1;
	}
});

$.fn.iCombobox.defaults.onSelect = $.easyui.event.delegate(
		$.fn.iCombobox.defaults.onSelect,
		function(record){
			//$.app.debug(this);
			$.app.debug(' icombobox onSelect');
			var o = $(this).combobox('options');
			var elementname = o.elementname;
			var formobj = $(this).closest('form');
			if(!$.extends.isEmpty(elementname)){

				if($.extends.isString(elementname)){
					formobj.find("input[name='"+elementname+"']").val(record[o.textField]);
					$.app.debug(formobj.find("input[name='"+elementname+"']"));
				}else{
					$.each(elementname, function(k, v){
						formobj.find("input[name='"+k+"']").val(record[v]);
					});
				}
				/*
				$("input[name='"+elementname+"']").val(record[o.textField]);
				$.app.debug($("input[name='"+elementname+"']"));
				*/
			}

			$.app.debug(record);
		}
);


$.fn.iCombogrid.defaults.onInit = function(){
	var o = $(this).combogrid('options');
	var target = this;
	if(o.dataUrl){
		$.app.debug('onInit load data with ' + o.dataUrl);
		$.app.getJson(o.dataUrl, null, function(data){
			var listdata = data.datas || data.data || data;
			$(target).combogrid('loadData', listdata);
			$.app.debug('onInit load data with ' + o.dataUrl + ' sucessed');
		}, null);
	}
};

$.fn.iCombogrid.defaults.onResize = $.easyui.event.delegate($.fn.iCombogrid.defaults.onResize, function(){
	try{

		var o = $(this).combogrid('options');
		var isInit = o.isInit;
		if(o.onInit && isInit == null){
			var fn = o.onInit;
			fn.call(this);
			o.isInit = 1;
		}
	}catch(e){

	}
});


$.fn.iCombogrid.defaults.onSelect = $.easyui.event.delegate(
		$.fn.iCombogrid.defaults.onSelect,
		function(idx, record){
			$.app.debug('icombogrid onSelect');
			// 和combogrid调用有点差别， 这里$(this).combogrid取不到值
			var o = $(this).datagrid('options');
			var pk = o.idField;
			var oldr = o.selectedRecord;
			o.selectedChanged = true;

			if(oldr && oldr[pk] == record[pk]){
				o.selectedChanged = false;
			}

			o.selectedRecord = record;


			$.app.debug(record);
		}, true
);

$.fn.iCombogrid.defaults.onChange = $.easyui.event.wrap(
		$.fn.iCombogrid.defaults.onChange,
		function(newv, oldv){
			$.app.debug('icombogrid onChange');
			// on ClearCell callback.
			var o = $(this).combogrid('options');

			var elementname = o.elementname;
			var formobj = $(this).closest('form');

			var gridc = $(this).combogrid('grid').datagrid('options');

			if($.extends.isEmpty(newv)){
				o.selectedRecord = undefined;
				delete o.selectedRecord;

				if(!$.extends.isEmpty(elementname)){
					if($.extends.isString(elementname)){
						formobj.find("input[name='"+elementname+"']").val(newv);
						$.app.debug(formobj.find("input[name='"+elementname+"']"));
					}else{
						$.each(elementname, function(k, v){
							formobj.find("input[name='"+k+"']").val(newv);
						});
					}
				}

				if(o.onClearCell){
					var fn = o.onClearCell;
					var c = $(this).combo('textbox');
					var c = $.iGrid.getRowIndex(c);

					fn.call(this, c, oldv);
				}
			}else{
				// if come from selecting grid record. the grid will not disappear

				if(gridc.selectedRecord){
					o.selectedRecord = gridc.selectedRecord;

					var record = o.selectedRecord;

					if(o.onSelectCell && gridc.selectedChanged && gridc.selectedRecord[gridc.textField]==newv){
						var b = $(this).combo('textbox');
						var b = $.iGrid.getRowIndex(b);

						//if(b>=0)
						{
							var fn = o.onSelectCell;
							fn.call(this, b, record);
						}
					}

					if(record){

						var elementname = o.elementname;

						var formobj = $(this).closest('form');

						if(!$.extends.isEmpty(elementname)){
							if($.extends.isString(elementname)){
								formobj.find("input[name='"+elementname+"']").val(record[o.textField]);
								$.app.debug(formobj.find("input[name='"+elementname+"']"));
							}else{
								$.each(elementname, function(k, v){
									formobj.find("input[name='"+k+"']").val(record[v]);
								});
							}
						}
					}

				}
			}
			/*
			gridc.selectedRecord = undefined;
			gridc.selectedChanged = false;
			delete gridc.selectedRecord;
			delete gridc.selectedChanged;
			*/
		}
);

$.fn.combogrid.defaults.onInit = function(){
	var o = $(this).combogrid('options');
	var target = this;
	if(o.dataUrl){
		$.app.debug('onInit load data with ' + o.dataUrl);
		$.app.getJson(o.dataUrl, null, function(data){
			var listdata = data.datas || data.data || data;
			$(target).combogrid('loadData', listdata);
			$.app.debug('onInit load data with ' + o.dataUrl + ' sucessed');
		}, null);
	}
};

$.fn.combogrid.defaults.onResize = $.easyui.event.delegate($.fn.combogrid.defaults.onResize, function(){
	try{

		var o = $(this).combogrid('options');
		var isInit = o.isInit;
		if(o.onInit && isInit == null){
			var fn = o.onInit;
			fn.call(this);
			o.isInit = 1;
		}
	}catch(e){

	}
});

$.fn.combogrid.defaults.onChange = $.easyui.event.wrap(
		$.fn.combogrid.defaults.onChange,
		function(newv, oldv){
			$.app.debug('combogrid onChange');
			var o = $(this).combogrid('options');

			var elementname = o.elementname;
			var formobj = $(this).closest('form');
			var gridc = $(this).combogrid('grid').datagrid('options');

			if($.extends.isEmpty(newv)){
				o.selectedRecord = undefined;
				delete o.selectedRecord;

				if(!$.extends.isEmpty(elementname)){
					if($.extends.isString(elementname)){
						formobj.find("input[name='"+elementname+"']").val(newv);
						$.app.debug(formobj.find("input[name='"+elementname+"']"));
					}else{
						$.each(elementname, function(k, v){
							formobj.find("input[name='"+k+"']").val(newv);
						});
					}
				}

				if(o.onClearCell){
					var fn = o.onClearCell;
					var c = $(this).combo('textbox');
					var c = $.iGrid.getRowIndex(c);

					fn.call(this, c, oldv);
				}
			}else{
				// if come from selecting grid record. the grid will not disappear

				if(gridc.selectedRecord){

					o.selectedRecord = gridc.selectedRecord;

					var record = o.selectedRecord;

					if(o.onSelectCell && gridc.selectedChanged && gridc.selectedRecord[gridc.textField]==newv){
						var b = $(this).combo('textbox');
						var b = $.iGrid.getRowIndex(b);

						//if(b>=0)
						{
							var fn = o.onSelectCell;
							fn.call(this, b, record);
						}
					}

					if(record){

						var elementname = o.elementname;

						var formobj = $(this).closest('form');

						if(!$.extends.isEmpty(elementname)){
							if($.extends.isString(elementname)){
								formobj.find("input[name='"+elementname+"']").val(record[o.textField]);
								$.app.debug(formobj.find("input[name='"+elementname+"']"));
							}else{
								$.each(elementname, function(k, v){
									formobj.find("input[name='"+k+"']").val(record[v]);
								});
							}
						}
					}

				}
			}
			/*
			gridc.selectedRecord = undefined;
			gridc.selectedChanged = false;
			delete gridc.selectedRecord;
			delete gridc.selectedChanged;
			*/
		}
);

$.fn.combogrid.defaults.onSelect = $.easyui.event.delegate(
		$.fn.combogrid.defaults.onSelect,
		function(idx, record){
			$.app.debug('combogrid onSelect');
			var o = $(this).combogrid('grid').datagrid('options');

			var pk = o.idField;
			var oldr = o.selectedRecord;
			o.selectedChanged = true;

			if(oldr && oldr[pk] == record[pk]){
				o.selectedChanged = false;
			}


			o.selectedRecord = record;
		}, true
);

$.fn.combogrid.defaults.onShowPanel = function(){

	var c = $(this).combogrid('grid').datagrid('options');
	(c && !c.url && c.url2) && (c.url = c.url2, $(this).combogrid('grid').datagrid('reload'));
};

$.fn.combobox.defaults.onShowPanel = function(){

	var c = $(this).combobox('options');
	(c && !c.url && c.url2) && (c.url = c.url2, $(this).combobox('reload'));
};

$.messager.defaults = $.extend({}, $.messager.defaults, {
	width: 450,
});

/**
 * delegate dialog onopen
 */
$.fn.iDialog.defaults.onOpen = $.iDialog.onOpen4Cube;

$.fn.iDialog.defaults.onLoad = $.easyui.event.delegate(
		$.fn.iDialog.defaults.onLoad,
		function(){
			$.app.debug('dialog on load ..... ');
			var dig = $(this);
			var digjq = dig.dialog('dialog');
			var c = dig.find('.cube-toolbar');

			if(!c.isNull()){
				var toolbar = digjq.find('.dialog-toolbar');
				if(toolbar.isNull()){
					toolbar = $('<div class="dialog-toolbar" style="border-top-width: 0px; top: 0px;border-top-style:none; border-right-style:none;border-left-style:none;"></div>');
					digjq.find('.panel-header').after(toolbar);
				}else{
					toolbar.empty();
				}

				c.addClass('cubeui-toolbar');
				toolbar.append(c) && c.show();
			}

			var c = dig.find('.cube-buttons');

			if(!c.isNull()){
				var buttons = digjq.find('.dialog-button');
				if(buttons.isNull()){
					buttons = $('<div class="dialog-button" style="border-top-style:none; border-right-style:none;border-left-style:none;"></div>');
					digjq.append(buttons);
				}else{
					buttons.empty();
				}

				//c.addClass('cubeui-toolbar');
				buttons.prepend(c.children());
			}

			var c = dig.find('title');
			if(!c.isNull()){
				dig.iDialog('setTitle', c.html());
			}

		}
	);
/**/

(function(a){
	function b(b, c) {
		void 0 == c.id && (c.id = getRandomNumByDef());
		var d = 0 == c.form ? "div" : "form"
			, e = "<" + d + ' id="' + c.id + '"></' + d + ">"
			, f = ""
			, g = []; //c.buttons='#' + c.id + '-buttons1';
		if ("object" == typeof c.buttonsGroup) {
			var h = c.buttonsGroup;
			a.each(h, function(a, b) {
				b.handler || (b.handler = "ajaxForm"),
				void 0 == b.id && g.push(getRandomNumByDef()),
					f += '<a id="' + g[a] + '" href="#" data-options="mbId:\'' + c.mbId + "',menuType:'" + c.menuType + "',dialogId:'" + c.id + "'\">" + b.text + "</a>"
			})
		}

		lf = "";
		g2 = [];

		if ("object" == typeof c.leftButtonsGroup) {

			var h = c.leftButtonsGroup;
			a.each(h, function(a, b) {
				b.handler || (b.handler = "ajaxForm"),
				void 0 == b.id && g2.push(getRandomNumByDef()),
					lf += '<a id="' + g2[a] + '" href="#" data-options="mbId:\'' + c.mbId + "',menuType:'" + c.menuType + "',dialogId:'" + c.id + "'\">" + b.text + "</a>"
			})
		}

		if(c.leftButtonsGroup!= null && c.leftButtonsGroup.length > 0){
			if(!c.ignoreclose || !c.ignoreclose)
				a("body").append(e + '<div id="' + c.id + '-buttons" style="display:none"><div style="display: inline;left: 10px;position: absolute;">'+lf+'</div><div style="display: inline;">' + f + '<a href="#" class="closeDialog" onclick="closeDialog(\'' + c.id + "')\">"+$.locale.label.close+"</a><div></div>");
			else
				a("body").append(e + '<div id="' + c.id + '-buttons" style="display:none"><div style="display: inline;left: 10px;position: absolute;">'+lf+'</div><div style="display: inline;">' + f +  "<div></div>");
		}else{
			if(!c.ignoreclose || !c.ignoreclose)
				a("body").append(e + '<div id="' + c.id + '-buttons" style="display:none">' + f + '<a href="#" class="closeDialog" onclick="closeDialog(\'' + c.id + "')\">"+$.locale.label.close+"</a></div>");
			else
				a("body").append(e + '<div id="' + c.id + '-buttons" style="display:none">' + f +  "</div>");
		}

		if ("object" == typeof c.buttonsGroup) {
			var i = c.buttonsGroup;
			a.each(i, function(b, c) {
				a("#" + g[b]).iLinkbutton(c)
			})
		}


		if(c.leftButtonsGroup!= null && c.leftButtonsGroup.length > 0){
			var i = c.leftButtonsGroup;
			a.each(i, function(b, c) {
				a("#" + g2[b]).iLinkbutton(c)
			})
		}

		return a(".closeDialog").iLinkbutton({
			iconCls: "fa fa-close",
			btnCls: "cubeui-btn-red",
			text: ""+$.locale.label.close+""
		}),
			a("#" + c.id).iDialog(c),
			c
	}

	$.fn.iDialog.methods = $.extend({}, $.fn.iDialog.methods, {
		createDialog:b
	});

})($);

$.fn.parsebuttonpanel = function(){
	$.app.debug('start on Completed');
	var ms = new Date().getTime();

	$.each(this, function(idx, one){
		var bp = $(this);

		$.app.debug('start parse buttonpanel');
		$.app.debug(bp);

		var psize = $.extends.isEmpty(bp.attr('psize'), 4);

		var bs = bp.children('a');
		/**/
		if(bs.length<=psize){
			return;
		}

		var id = "exportSubMenu_"+$.extends.getRandomNum();
		var morea = $('<a href="javascript:void(0)" style="margin-left:4px">'+message.core.label.more+'</a>');

		var div = $('<div id="'+id+'" class="cubeui-toolbar" style1="width:150px;"></div>');
		/*
		for(var idx = 0; idx < bs.length; idx ++){
			bp.append($(bs[idx]));
		}
		*/
		for(var idx = psize-1; idx < bs.length; idx ++){
			div.append(bs[idx]);
			$(bs[idx]).after('<br>');
			var opt = $(bs[idx]).getoptions();
			opt && opt.btnCls && $(bs[idx]).removeClass(opt.btnCls);
		}

		$(bs[psize-2]).after(morea);
		morea.after(div);

		/**/
		/*morea.iSplitbutton({
		    iconCls: 'fa fa-list',
		    btnCls:'cubeui-btn-blue',
		    hasDownArrow:true,
		    menu: '#'+id
		});*/
		morea.iMenubutton({
		    iconCls: 'fa fa-list',
		    btnCls:'cubeui-btn-blue',
		    hasDownArrow:true,
		    menu: '#'+id
		});

		$.app.debug('end parse buttonpanel');
	});


	$.app.debug('end on Completed');
	var ms1 = new Date().getTime();
	$.app.debug('onCompleted cost ' + (ms1-ms) + '(ms).');
}

function extractorFn(html){
	let allFn = $(html)

	let htmlFn = new Array();
	let fnFn = new Array();
	let templateFn = null;

	if ( allFn.isNull() ){
		return [htmlFn, fnFn, templateFn];
	}

	$.each(allFn, function(idx, item){
		if (item.tagName != null
			&& item.tagName.toLowerCase() === 'script'
			&& item.innerHTML!= null
			&& item.innerHTML.trim().length>0) {
			fnFn.push(item)
		}else if (item.tagName != null && item.tagName.toLowerCase() === 'template-func'
			&& item.innerHTML!= null
			&& item.innerHTML.trim().length>0){
			templateFn = item;
			return false;
		}else{
			htmlFn.push(item)
		}
	});

	return [htmlFn, fnFn, templateFn];
}

// *****
function refreshGrids(a) {
	if ("object" == typeof a)
		for (var b = 0; b < a.length; b++) {
			var c = a[b];
			!function(a) {
				setTimeout(function() {
					refreshGrid(c.type, c.id, c.clearQueryParams, c.keepcheck, c)
				}, 100 * a)
			}(b)
		}
}
// config.callback(dgObj)
function refreshGrid(a, b, c, keepcheck, c) {
	var d = $("#" + b);
	if(keepcheck){
	}else{
		d[a]("unselectAll"),
			d[a]("uncheckAll");
	}

	if (c && c.fn && $.isFunction(c.fn)) {
		c.fn.call(c, d)
		return
	}

	"datagrid" == a || "edatagrid" == a ? (1 == c && d[a]({
		queryParams: {
			clearQueryParams: ""
		}
	}),
		d[a]("reload")) : "treegrid" == a && d[a]("reload")
}

function doAjax(a, fn, thisobj) {
	var b = {}
		, c = ""
		, d = {
		onSuccess: function(a) {}
	};
	a = $.extend(d, a);
	//JSON.stringify(a.ajaxData);

	if(CubeUI.config.postJson || a.postJson) {
		c = "application/json;charset=utf-8";

		if("object" != typeof a.ajaxData){
			a.ajaxData = $.serializeJson(a.ajaxData)
		}else{
			a.ajaxData = JSON.stringify(a.ajaxData);
		}

	}else{
		c = "application/x-www-form-urlencoded;charset=utf-8";
	}

	$.ajax({
		url: a.url,
		type: a.requestType||"post",
		data: a.ajaxData,
		dataType: "json",
		async: !0,
		contentType: c,
		beforeSend: function() {
			$.messager.progress({
				text: $.locale.message.processing_data
			})
		},
		complete: function(){
			$.messager.progress("close");
		},
		success: function(c, d, e) {
			$.messager.progress("close");
			checkAjaxJson(c);

			1 == c || 1 == c.statusCode || 100 == c.statusCode || c.statusCode == CubeUI.config.statusCode.success ? (b.statusCode = CubeUI.config.statusCode.success,
				b.title = c.title || CubeUI.language.message.title.operationTips,
				b.message = c.message || CubeUI.language.message.msg.success,
				a.onSuccess.call(this, c)) : (b.statusCode = CubeUI.config.statusCode.failure,
				b.title = c.title || CubeUI.language.message.title.operationTips,
				b.message = c.message || CubeUI.language.message.msg.failed),
				b = $.extend(c, b);

			if(fn)
				fn.call(thisobj, b);
		}
	})
}

function scrollTop(target, ms){
	let scrollHeight = $(target).prop("scrollHeight");
	$(target).animate({scrollTop:0}, ms||400);
}

function scrollBottom(target, ms){
	let scrollHeight = $(target).prop("scrollHeight");
	$(target).animate({scrollTop:scrollHeight}, ms||400);
}

function checkAjaxJson(c){
	if(c){
		c.statusCode = c.statusCode || c.status ;
		c.message =  c.message || c.msg ;

		if(c.status == 1)
			c.statusCode = CubeUI.config.statusCode.failure;
		else
			c.statusCode = CubeUI.config.statusCode.success;
	}
}

function checkAndOpenDialog(f, d){

	d.dialog({
		href: null,
		link: f
	});

	if($.extends.isEmpty(f)){
		var c = $.data(d.get(0), "panel"), dd = c.options;
		let r = $.extends.isEmpty(dd.content, '');
		if(dd.render && $.isFunction(dd.render)){
			var renderHandler = {
				cancel : function (d){
					c.isLoaded = !0;
					console.log("cancel the dialog");
				},
				render : function (templateData, html){
					if(html==null || $.extends.isEmpty(html)){
						html = r;
					}

					html = $.templates(html).render(templateData);

					console.log("render to dialog");
					d.html(html);
					$.parser.parse(d);
					dd.onLoad.apply(d, arguments);
					d.dialog("open");
					c.isLoaded = !0
				}
			}

			var dialogOptions = dd;

			dd.render.call(d, dd, renderHandler);
		}else{
			$.parser.parse(d);
			dd.onLoad.apply(d, arguments);
			d.dialog("open");
			c.isLoaded = !0
		}
	}else{
		$.ajax({
			type: 'get',
			progressing:$.locale.message.getting_data,
			url: f,
			success: function(r) {
				var c = $.data(d.get(0), "panel"), dd = c.options;
				var href = f;

				console.log(dd.extractor)

				r = dd.extractor.call(d, r);

				let all = extractorFn(r);

				d.panel("clear");

				if(all[2]!= null || (dd.render && $.isFunction(dd.render)) ){
					var renderHandler = {
						cancel : function (d){
							c.isLoaded = !0;
							console.log("cancel the dialog");
						},
						getContent : function (){
							return r;
						},
						render : function (templateData, html){
							if(html==null || $.extends.isEmpty(html)){
								html = r;
							}

							html = $.templates(html).render(templateData);

							console.log("render to dialog");
							d.html(html);
							$.parser.parse(d);
							dd.onLoad.apply(d, arguments);
							d.dialog("open");
							c.isLoaded = !0
						}
					}

					var dialogOptions = dd;
					var dialogTarget = d;

					if(all[2]!= null){
						eval(all[2].innerHTML);
					}
					if(dd.render && $.isFunction(dd.render)){
						dd.render.call(d, dd, renderHandler);
					}
				}else{
					if(all[1].length == 0){

						d.append(all[0]);
						$.parser.parse(d);
						dd.onLoad.apply(d, arguments);
						d.dialog("open");
						c.isLoaded = !0

					}else{

						d.append(all[0]);
						$.parser.parse(d);
						dd.onLoad.apply(d, arguments);
						d.dialog("open");
						d.append(all[1]);
						c.isLoaded = !0
					}
				}

				/*
                ,
                    d.html(r),
                    $.parser.parse(d),
                    dd.onLoad.apply(d, arguments),
                    d.dialog("open");
                c.isLoaded = !0
                */
			}
		});
	}
}

/**
 * @description 添加tab页面
 * @param options
 */

function addOneTab(title, src) {
  var iframe = '<iframe src="' + src + '" frameborder="0" style="border:0;width:100%;height:100%;"></iframe>';

  var t = parent.$('#index_tabs');

  //showloading();

  if(t.iTabs('exists', title)){
	  /*
	  var tab = t.iTabs('getTab', title);

	  t.iTabs('update', {
			tab: tab,
			options:{
				title: title,
			    content: iframe,
			    closable: true,
			    iconCls: 'fa fa-th',
			    border: true
			}
		});
	  */
	  t.iTabs('select', title);

  }else{
	  t.iTabs("add", {
		    title: title,
		    content: iframe,
		    closable: true,
		    iconCls: 'fa fa-th',
		    border: true
		  });
  }
}

function addOneTabAndRefresh(title, src) {
  var iframe = '<iframe src="' + src + '" frameborder="0" style="border:0;width:100%;height:100%;"></iframe>';

  var t = parent.$('#index_tabs');

  //showloading();

  if(t.iTabs('exists', title)){
	  /*
	  var tab = t.iTabs('getTab', title);

	  t.iTabs('update', {
			tab: tab,
			options:{
				title: title,
			    content: iframe,
			    closable: true,
			    iconCls: 'fa fa-th',
			    border: true
			}
		});
	  */
	  t.iTabs('close', title);

  }

  t.iTabs("add", {
	    title: title,
	    content: iframe,
	    closable: true,
	    iconCls: 'fa fa-th',
	    border: true
	  });
}

function addTab(options) {
	  var src, title;
	  src = options.href;
	  title = options.title;
	  var iframe = '<iframe src="' + src + '" frameborder="0" style="border:0;width:100%;height:100%;"></iframe>';
	  parent.$('#index_tabs').iTabs("add", {
	    title: title,
	    content: iframe,
	    closable: true,
	    iconCls: 'fa fa-th',
	    border: true
	  });
	}

function triggerCloseTab(title){
	if(window.closeTab){
		window.closeTab(title);
	}else if(parent.closeTab){
		parent.closeTab(title);
	}else{
		$.app.err('can not find triggerCloseTab');
	}
}

function getTriggerParams(){

	if(window.triggerMenuClick){
		return window.__activatedParam;
	}else if(parent.triggerMenuClick){
		return parent.__activatedParam;
	}else{
		return undefined;
	}
}

function addMainTabByURL(title, url, options){
	let arg = [title, url, options]

	if(window.addNewTabByURL){
		addNewTabByURL.apply(this, arg);
	}else if(parent.addNewTabByURL){
		parent.addNewTabByURL.apply(this, arg);
	}else{
		$.app.err('can not find addNewTabByURL');
	}
}

function addMainTab(title, html, options, fn){
	let arg = [title, html, options, fn]

	if(window.addNewTab){
		addNewTab.apply(this, arg);
	}else if(parent.addNewTab){
		parent.addNewTab.apply(this, arg);
	}else{
		$.app.err('can not find addNewTab');
	}
}

function triggerNavMenuClick(navtitle, iaccordtitle, menutitle, submenutitle, refresh, param){
	let arg = [navtitle, iaccordtitle, menutitle, submenutitle, null, refresh, param]
	if(window.triggerMenuClick){
		triggerMenuClick.apply(this, arg);
	}else if(parent.triggerMenuClick){
		parent.triggerMenuClick.apply(this, arg);
	}else{
		$.app.err('can not find triggerMenuClick');
	}
}

function closeAndTriggerNavMenuClick(navtitle, iaccordtitle, menutitle, submenutitle, param){
	var title = getMainCurrentTab().panel('options').title;
	var newArr = Array.prototype.slice.call(arguments);
	newArr.push(function(){
		$.easyui.debug.breakpoint();
		parent.closeTab(title);
	});
	triggerNavMenuClick.apply(this, newArr);
}

function closeMainCurrentTab(){
	if(window.closeCurrentTab){
		closeCurrentTab.apply(this, arguments);
	}else if(parent.closeCurrentTab){
		parent.closeCurrentTab.apply(this, arguments);
	}else{
		$.app.err('can not find closeCurrentTab');
	}
}

function getMainCurrentTab(){
	if(window.getCurrentTab){
		return getCurrentTab.apply(this, arguments);
	}else if(parent.getCurrentTab){
		return parent.getCurrentTab.apply(this, arguments);
	}else{
		$.app.err('can not find getCurrentTab');
	}
}

function closeMainTab(titleOrIndex){
	if(window.closeTab){
		closeTab.apply(this, arguments);
	}else if(parent.closeTab){
		parent.closeTab.apply(this, arguments);
	}else{
		$.app.err('can not find closeTab');
	}
}

$.app.leavewindow = function(msg){
	msg = msg || message.core.info.leaving_confirm;

	window.onbeforeunload = function(e){

    	  var t = e || window.event;
          return t.returnValue = message.core.info.exit_confirm,
          t.returnValue
    }
}

function relogin() {

	$.app.localStorage.remove(window.app.clientId+'.token');
	$.app.localStorage.remove(window.app.clientId+'.permissions');
	$.app.localStorage.remove(window.app.clientId+'.permissions');
	$.app.localStorage.remove(window.app.clientId+'.userid');
	$.app.localStorage.remove(window.app.clientId+'.token');
	$.app.localStorage.remove(window.app.clientId+'.tokenType');

	if(window.top===window.self ){
		$.app.alert(null, "登录已经超时，请重新登录", function () {
			window.location.href=contextpath + '/login.html';
		})
	}else{
		var opts = {
			title: message.core.login.login_title,
			width: 550,
			height: 300,
			iconCls: 'fa fa-info-circle',
			buttonsGroup: [{
				text: message.core.login.login_btn,
				iconCls: 'fa fa-save',
				btnCls: 'cubeui-btn-green',
				handler: function () {
					var form = $.iDialog.findOutterFormJquery(this);
					var target = this;
				  $.app.postForm(
					 contextpath + '/login',
					 form,
					 function(data) {
						if (data.status == 0) {

							$.iDialog.closeOutterDialog(target);
							$.app.localStorage.saveItem(window.app.clientId+'.token', data.data);

							if (data.msg.length == 0){
								$.app.show(message.core.login.login_success);
							}
							else
								$.app.show(data.msg);

						} else {
							$.app.alert(data.msg);
						}
					})
				}
			}],
			buttons1: [{
				text: message.core.login.login_btn,
				iconCls: 'fa fa-save',
				btnCls: 'cubeui-btn-green',
				handler: function () {
					var form = $.iDialog.findOutterFormJquery(this);
					var target = this;
				  $.app.postForm(
					 contextpath + '/passport/submit',
					 form,
					 function(data) {
						if (data.status == 0) {

							$.iDialog.closeOutterDialog(target);

							if (data.msg.length() == 0){
								$.app.show(message.core.login.login_success);
							}
							else
								$.app.show(data.msg);

						} else {
							$.app.alert(data.msg);
						}
					})
				}
			}, {
				text: message.core.label.close,
				iconCls: 'fa fa-close',
				btnCls: 'cubeui-btn-red',
				handler: function () {
					$.iDialog.closeOutterDialog(this);
					//$("#profileDialog").iDialog('close');
				}
			}]
		};
		$.app.openDialog(opts.id, contextpath + '/logindlg.html?relogin=1', null, opts);
		//$('#' + opts.id).iDialog('openDialog', opts);
	}
};

$.app.databind = {
    setComponentValue:function(target, value, toggle){
        var toggle = toggle||$(target).attr('data-toggle');
        $(target).val(value);

        if($.extends.isEmpty(toggle)){
            return ;
        }

        toggle = toggle.replace("cubeui-","");

        try{
            $(target)[toggle]('setValue', value);
        }catch(ex){
            $.app.debug(ex);
            $(target).val(value);
        }
    },
    setComponentDisabled:function(target, disabled, toggle){
        var toggle = toggle||$(target).attr('data-toggle');
        $(target).attr("disabled",disabled);

        if($.extends.isEmpty(toggle)){
            return ;
        }

        toggle = toggle.replace("cubeui-","");

        try{
            disabled = new Boolean(disabled);
            if(disabled)
                $(target)[toggle]('disable');
            else
                $(target)[toggle]('enable');
        }catch(ex){
            $.app.debug(ex);
        }
    },
    setComponentReadonly:function(target, readonly, toggle){
        var toggle = toggle||$(target).attr('data-toggle');

        if(readonly)
            $(target).attr("readonly","readonly");
        else
            $(target).removeAttr("readonly");

        if($.extends.isEmpty(toggle)){
            return ;
        }

        toggle = toggle.replace("cubeui-","");

        try{
            readonly = new Boolean(readonly);
            if(readonly)
                $(target)[toggle]('readonly', true);
            else
                $(target)[toggle]('readonly', false);
        }catch(ex){
            $.app.debug(ex);
        }
    },
    getComponentValue:function(target, value, toggle){
          var toggle = toggle||$(target).attr('data-toggle');
          if($.extends.isEmpty(toggle))
              return $(target).val();
          try{
              return $(this)[toggle]('getValue');
          }catch(ex){
              $.app.debug(ex);
              return $(target).val();
          }
    },
    bindComponent:function(parentObj, data){
        $(parentObj).find('[data-bind-text],[data-bind-value],[data-bind-attr]').each(function(idx,val){
            var tag, value, fn;
            tag = $(this).attr('data-bind-text');
            if(!$.extends.isEmpty(tag)){
                var vs = tag.split('|');
                tag = vs[0];
                var override = true&&!(vs.length>1&&vs[1].trim().toLowerCase()=='false');

                value = $.getValue(data, tag);
                fn = $(this).attr('data-bind-text-fn');

                if($.isFunction(fn)){
                    value = fn.call(this, data, tag, value);
                }
                if($.extends.isEmpty(value)){
                    value = '';
                    if(!override)
                        return;
                }
                $(this).html(value);
            }
            tag = $(this).attr('data-bind-value');
            if(!$.extends.isEmpty(tag)){
                var vs = tag.split('|');
                tag = vs[0];
                var override = true&&!(vs.length>1&&vs[1].trim().toLowerCase()=='false');

                value = $.getValue(data, tag);
                fn = $(this).attr('data-bind-value-fn');

                if($.isFunction(fn)){
                    value = fn.call(this, data, tag, value);
                }

                if($.extends.isEmpty(value)){
                    value = '';
                    if(!override)
                        return;
                }

                $(this).val(value);

                $.app.databind.setComponentValue(this, value);
                /*
                var toggle = $(this).attr('data-toggle');
                if($.extends.isEmpty(toggle))
                    return;

                toggle = toggle.replace("cubeui-","");
                try{
                    $(this)[toggle]('setValue', value);
                }catch(ex){
                }
                //$.easyui.debug.breakpoint($(this)[toggle]('options'));
                */
            }
            tag = $(this).attr('data-bind-attr');
            if(!$.extends.isEmpty(tag)){
                fn = $(this).attr('data-bind-attr-fn');

                if($.isFunction(fn)){
                    value = fn.call(this, data);
                }else{
                    var attrs = tag.split("+");

                    var t = this;

                    $.each(attrs, function(idx,val){
                        var vs = val.split("=");
                        var attr = vs[0];
                        var attrTag = vs[1];

                        var vs2 = attrTag.split('|');
                        attrTag = vs2[0];
                        var override = true&&!(vs.length>1&&vs[1].trim().toLowerCase()=='false');

                        value = $.getValue(data, attrTag);

                        if(attr.toLowerCase() == 'readonly'){
                            $.app.databind.setComponentReadonly(t, value||'false');
                            return;
                        }

                        if(attr.toLowerCase() == 'disable'){
                            $.app.databind.setComponentDisabled(t, value||'false');
                            return;
                        }

                        if($.extends.isEmpty(value)){
                            value = '';
                            if(!override)
                                return;
                        }

                        $(t).attr(attr, value);
                    });
                }
            }
        });
    },
    bind:function(parentObj, data){
        $(parentObj).find('[data-bind-text],[data-bind-value],[data-bind-attr]').each(function(idx,val){
            var tag, value, fn;
            tag = $(this).attr('data-bind-text');
            if(!$.extends.isEmpty(tag)){
                var vs = tag.split('|');
                tag = vs[0];
                var override = true&&!(vs.length>1&&vs[1].trim().toLowerCase()=='false');

                value = $.getValue(data, tag);
                fn = $(this).attr('data-bind-text-fn');

                if($.isFunction(fn)){
                    value = fn.call(this, data, tag, value);
                }
                if($.extends.isEmpty(value)){
                    value = '';
                    if(!override)
                        return;
                }
                $(this).html(value);
            }
            tag = $(this).attr('data-bind-value');
            if(!$.extends.isEmpty(tag)){
                var vs = tag.split('|');
                tag = vs[0];
                var override = true&&!(vs.length>1&&vs[1].trim().toLowerCase()=='false');

                value = $.getValue(data, tag);
                fn = $(this).attr('data-bind-value-fn');

                if($.isFunction(fn)){
                    value = fn.call(this, data, tag, value);
                }

                if($.extends.isEmpty(value)){
                    value = '';
                    if(!override)
                        return;
                }

                $(this).val(value);
                $.app.databind.setComponentValue(this, value);

                /*
                var toggle = $(this).attr('data-toggle');
                if($.extends.isEmpty(toggle))
                    return;

                toggle = toggle.replace("cubeui-","");
                try{
                    $(this)[toggle]('setValue', value);
                }catch(ex){
                }
                //$.easyui.debug.breakpoint($(this)[toggle]('options'));
                */
            }
            tag = $(this).attr('data-bind-attr');
            if(!$.extends.isEmpty(tag)){
                fn = $(this).attr('data-bind-attr-fn');

                if($.isFunction(fn)){
                    value = fn.call(this, data);
                }else{
                    var attrs = tag.split("+");

                    var t  = this;

                    $.each(attrs, function(idx,val){
                        var vs = val.split("=");
                        var attr = vs[0];
                        var attrTag = vs[1];

                        var vs2 = attrTag.split('|');
                        attrTag = vs2[0];
                        var override = true&&!(vs.length>1&&vs[1].trim().toLowerCase()=='false');

                        value = $.getValue(data, attrTag);

                        if(attr.toLowerCase() == 'readonly'){
                            $.app.databind.setComponentReadonly(t, value||'false');
                            return;
                        }

                        if(attr.toLowerCase() == 'disable'){
                            $.app.databind.setComponentDisabled(t, value||'false');
                            return;
                        }

                        if($.extends.isEmpty(value)){
                            value = '';
                            if(!override)
                                return;
                        }

                        $(t).attr(attr, value);
                    });
                }
            }
        });
    }
};

$.app.finder = {
	findByName:function(uid, name){
		if(arguments.length == 1)
		{
			return $('[name="'+uid+'"]');
		}
		else{
		    if(uid instanceof jQuery){
		        return uid.find('[name="'+name+'"]');
		    }
			return $('[uid="'+uid+'"]').find('[name="'+name+'"]');
		}
	},
	findById:function(uid, id){
		if(arguments.length == 1)
		{
			return $('#'+uid);
		}
		else{
		    if(uid instanceof jQuery){
        		        return uid.find('#'+name);
        		    }
			return $('[uid="'+uid+'"]').find('#'+name);
		}
	},
	findByClass:function(uid, classname){
		if(arguments.length == 1)
		{
			return $('.'+uid);
		}
		else{
		    if(uid instanceof jQuery){
        		        return uid.find('.'+classname);
        		    }
			return $('[uid="'+uid+'"]').find('.'+classname);
		}
	},
    findByAttr:function(uid, attr){
        if(arguments.length == 1)
        {
            return $('['+uid+']');
        }
        else{
            if(uid instanceof jQuery){
                        return uid.find('['+attr+']');
                    }
            return $('[uid="'+uid+'"]').find('['+attr+']');
        }
    }
}

$.app.permission = {
	data:{},
	load:function(){
		$.app.permission.data = {};
		$.each($.extends.json.toobject2($.app.localStorage.getItem(window.app.clientId+'.permissions', "[]")), function(idx,v){
			$.app.permission.data[v.toLowerCase()] = 1;
		});

	},
	has:function(permission){
		if($.extends.isEmpty(permission))
			return true;

		if($.app.permission.data['*'])
			return true;

		if($.app.permission.data[''+permission.toLowerCase()])
			return true;

		return false;
	}
};

$.fn.iLinkbutton.defaults.onClick = $.easyui.event.wrap(
	$.fn.iLinkbutton.defaults.onClick,
	function(){
		let b = $(this).iLinkbutton("options");
		if(b.handler==null){
			b.handler = function(){}
		}
		return true;
	},
	true
)

$(function(){

	$.app.permission.load();

	$('[permission]').each(function(){
		var p = $(this).attr('permission');

		if(!$.extends.isEmpty(p)){
			if(!$.app.permission.has(p)){
				$(this).hide();
			}
		}
	});

	$.easyui.debug.breakpoint('check permission inspection');
});

////
$(function(){
	$('.buttonpanel').parsebuttonpanel();
});

$.extends.number = {
	hex2IntString:function(str){
		if($.extends.isEmpty(str))
			return 0;

		if(!str.startsWith('0x'))
			str = '0x'+str;

		return BigInt(str).toString('10');
	},
	str2int:function(str, base){
		if(base == null)
			base = '10';

		return parseInt(str, base);
	},
	int2Str:function(str, base){
		if(base == null)
			base = '10';

		return BigInt(str).toString(base);
	},
}