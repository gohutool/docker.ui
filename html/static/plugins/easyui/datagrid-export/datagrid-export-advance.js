(function($){
    function getRows(target){
        var state = $(target).data('datagrid');
        if (state.filterSource){
            return state.filterSource.rows;
        } else {
        	
        	var footerrows = $(target).datagrid('getFooterRows');
        	footerrows = footerrows||[];
        	
        	var alldata = state.data.rows.concat(footerrows);
        	
        	return alldata;
        }
    }
    function toHtml(target, rows, htmltitle){
        rows = rows || getRows(target);
        var dg = $(target);
        var data = ['<table border="1" rull="all" style="border-collapse:collapse">'];
        var newFieldsArray = [];
        var trStyle = 'height:32px';
        var tdStyle0 = 'vertical-align:middle;padding:0 4px';
        
        var columnArrays = dg.datagrid('options').columns;
        var column2Arrays = dg.datagrid('options').frozenColumns;
        
        var colcount = 0;
        
        var newFieldsArray_2a = [];
        var newFieldsArray_1a_idx = [];
        
        
        if(columnArrays.length > 1){
        	
        	for(var i=0; i<columnArrays.length; i++){
        		var newFieldsArray_1a = [];
        		
            	var columnArray = columnArrays[i];
            	
            	var column2Array = null;
            	if(column2Arrays!=null&&column2Arrays.length>i){
            		column2Array = column2Arrays[i];
            	}else{
            		column2Array = [];
            	}
            	
            	columnArray = column2Array.concat(columnArray);
            	
            	data.push('<tr style="'+trStyle+'">');
            	/*
            	for(var idx=0; idx<column2Array.length; idx++){
            		
            	}
            	*/
            	for(var idx=0; idx<columnArray.length; idx++){
            		var col = columnArray[idx];
            		
            		if(col.checkbox){
                     	continue;
                     }
            		
            		var rowspantxt = "";
            		var colspantxt = "";
            		
            		if(col.rowspan){
            			rowspantxt = " rowspan="+col.rowspan + " ";
            		}
            		
            		if(col.colspan){
            			colspantxt = " colspan="+col.colspan + " ";
            		}
            		
            		
            		if(col.field){
            			var colopt = dg.datagrid('getColumnOption', col.field);
            			var tdStyle = tdStyle0 + ';width:'+colopt.boxWidth+'px;';
            			
            			if(colopt.hidden || colopt.checkbox || colopt.expander){
                         	continue;
                         }else{
                        	newFieldsArray_1a.push({
                              	field:colopt.field,
                              	formatter:colopt.formatter});
                        	
                 			newFieldsArray.push({
                              	field:colopt.field,
                              	formatter:colopt.formatter});
                         }
            			
            		}else{
            			// add by david.liu for supporting grouped title data grid.
            			if(col.hidden || col.checkbox || col.expander){
                         	continue;
                         }
            			else{
            				var n = col.colspan;
            				if(col.colspan)
            					n = col.colspan * 1;
            				
            				for(var _i=0 ; _i < n; _i ++){
            					newFieldsArray_1a_idx.push(newFieldsArray_1a.length);
                				newFieldsArray_1a.push(null);
            				}
            				
            			}
            			// end
            			var tdStyle = tdStyle0;
            		}
            		
            		
            		
            		var title = col.title;
                    title = (title==null)?' ':title;
                    data.push('<th style="'+tdStyle+'"' + rowspantxt + colspantxt + '>'+title+'</th>');
            		
            	}
            	// add by david.liu for supporting grouped title data grid.
            	newFieldsArray_2a.push(newFieldsArray_1a);
            	// end
            	data.push('</tr>');
            }
        }
        else{
        	 var fields = dg.datagrid('getColumnFields',true).concat(dg.datagrid('getColumnFields',false));
             data.push('<tr style="'+trStyle+'">');
             
             for(var i=0; i<fields.length; i++){
                 var col = dg.datagrid('getColumnOption', fields[i]);
                 var tdStyle = tdStyle0 + ';width:'+col.boxWidth+'px;';
                 
                 if(col.hidden || col.checkbox || col.expander){
                 	continue;
                 }
                 
                 newFieldsArray.push({
                 	field:col.field,
                 	formatter:col.formatter});
                 
                 var title = col.title;
                 title = (title==null)?' ':title;
                 data.push('<th style="'+tdStyle+'">'+title+'</th>');
             }
             
             data.push('</tr>');
        }
        
        // add by david.liu for supporting grouped title data grid.
        if(columnArrays.length > 1){
        	var nidx = 0;
        	for(var i = 1; i < newFieldsArray_2a.length; i ++){
        		var array_1a = newFieldsArray_2a[i];
        		
        		if(array_1a||array_1a.length>0){
        			for(var j = 0; j < array_1a.length; j ++){
        				if(array_1a[j]){
                			newFieldsArray_2a[0][newFieldsArray_1a_idx[nidx]] = array_1a[j];
                			nidx ++;
        				}
        			}
        		}
        	}
        	

            newFieldsArray = newFieldsArray_2a[0];
        }
        
        // add by david.liu end
        
        $.map(rows, function(row,index){
            data.push('<tr style="'+trStyle+'">');
            for(var i=0; i<newFieldsArray.length; i++){
            	
                var field = newFieldsArray[i].field;
                var formatter = newFieldsArray[i].formatter;
                var value = row[field];
                
                if(formatter){
                	value = formatter.call(target, value, row, index);
                }
                
                value = (value==null)?' ':value;
                
                data.push(
                    '<td style="'+tdStyle0+'">'+value+'</td>'
                );
            }
            data.push('</tr>');
        });
        data.push('</table>');
        
        if(htmltitle){
        	//data.splice(1, 0, '<tr><th colspan="' + newFieldsArray.length + '" style="'+tdStyle0+'"></th></tr>' + '<tr style="height:48px;"><th colspan="' + newFieldsArray.length + '" style="'+tdStyle0+'">'+htmltitle+'</th></tr>' + '<tr><th colspan="' + newFieldsArray.length + '" style="'+tdStyle0+'"></th></tr>');
        	data.splice(1, 0, '<tr><th colspan="' + newFieldsArray.length + '" style="'+tdStyle0+'"></th></tr>' + '<tr style="height:48px;"><th colspan="' + newFieldsArray.length + '" style="'+tdStyle0+'">'+htmltitle+'</th></tr>');
        }
        
        return data.join('');
    }

    function _toHtml(target, rows){
        rows = rows || getRows(target);
        var dg = $(target);
        var data = ['<table border="1" rull="all" style="border-collapse:collapse">'];
        var fields = dg.datagrid('getColumnFields',true).concat(dg.datagrid('getColumnFields',false));
        var trStyle = 'height:32px';
        var tdStyle0 = 'vertical-align:middle;padding:0 4px';
        data.push('<tr style="'+trStyle+'">');
        var newFieldsArray = [];
        
        for(var i=0; i<fields.length; i++){
            var col = dg.datagrid('getColumnOption', fields[i]);
            var tdStyle = tdStyle0 + ';width:'+col.boxWidth+'px;';
            
            if(col.hidden || col.checkbox || col.expander){
            	continue;
            }
            
            newFieldsArray.push({
            	field:col.field,
            	formatter:col.formatter});
            
            var title = col.title;
            title = (title==null)?' ':title;
            data.push('<th style="'+tdStyle+'">'+title+'</th>');
        }
        data.push('</tr>');
        $.map(rows, function(row,index){
            data.push('<tr style="'+trStyle+'">');
            for(var i=0; i<newFieldsArray.length; i++){
            	
                var field = newFieldsArray[i].field;
                var formatter = newFieldsArray[i].formatter;
                var value = row[field];
                
                if(formatter){
                	value = formatter.call(target, value, row, index);
                }
                
                value = (value==null)?' ':value;
                
                data.push(
                    '<td style="'+tdStyle0+'">'+value+'</td>'
                );
            }
            data.push('</tr>');
        });
        data.push('</table>');
        return data.join('');
    }

    function toArray(target, rows){
        rows = rows || getRows(target);
        var dg = $(target);
        var fields = dg.datagrid('getColumnFields',true).concat(dg.datagrid('getColumnFields',false));
        var data = [];
        var r = [];
        var newFieldsArray = [];
        
        for(var i=0; i<fields.length; i++){
            var col = dg.datagrid('getColumnOption', fields[i]);

            if(col.hidden || col.checkbox  || col.expander){
            	continue;
            }
            
            newFieldsArray.push({
            	field:col.field,
            	formatter:col.formatter});
            
            r.push(col.title);
        }
        data.push(r);
        $.map(rows, function(row){
            var r = [];
            for(var i=0; i<newFieldsArray.length; i++){

                var field = newFieldsArray[i].field;
                var formatter = newFieldsArray[i].formatter;
                var value = row[field];
                
                if(formatter){
                	value = formatter.call(target, value, row, index);
                }
                
                value = (value==null)?' ':value;
                
            	
                r.push(value);
            }
            data.push(r);
        });
        return data;
    }

    function print(target, param){
        var title = null;
        var rows = null;
        if (typeof param == 'string'){
            title = param;
        } else {
            title = param['title'];
            rows = param['rows'];
        }
        var newWindow = window.open('', '', 'width=800, height=500');
        var document = newWindow.document.open();
        var content = 
            '<!doctype html>' +
            '<html>' +
            '<head>' +
            '<meta charset="utf-8">' +
            '<title>'+title+'</title>' +
            '</head>' +
            '<body>' + toHtml(target, rows) + '</body>' +
            '</html>';
        document.write(content);
        document.close();
        newWindow.print();
        newWindow.close();
    }

    function b64toBlob(data){
        var sliceSize = 512;
        var chars = atob(data);
        var byteArrays = [];
        for(var offset=0; offset<chars.length; offset+=sliceSize){
            var slice = chars.slice(offset, offset+sliceSize);
            var byteNumbers = new Array(slice.length);
            for(var i=0; i<slice.length; i++){
                byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, {
            type: ''
        });
    }

    function toExcel(target, param){
        var filename = null;
        var rows = null;
        var worksheet = 'Worksheet';
        if (typeof param == 'string'){
            filename = param;
        } else {
            filename = param['filename'];
            rows = param['rows'];
            worksheet = param['worksheet'] || 'Worksheet';
        }
        var dg = $(target);
        var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>{table}</body></html>'
        , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }

        var table = toHtml(target, rows, worksheet);
        table += table;
        var ctx = { worksheet: worksheet, table: table };
        var data = base64(format(template, ctx));
        if (window.navigator.msSaveBlob){
            var blob = b64toBlob(data);
            window.navigator.msSaveBlob(blob, filename);
        } else {
            var alink = $('<a style="display:none"></a>').appendTo('body');
            alink[0].href = uri + data;
            alink[0].download = filename;
            alink[0].click();
            alink.remove();
        }
    }

    function toExcel2(target, param){
        var filename = null;
        var rows = null;
        var worksheet = 'Worksheet';
        if (typeof param == 'string'){
            filename = param;
        } else {
            filename = param['filename'];
            rows = param['rows'];
            worksheet = param['worksheet'] || 'Worksheet';
        }
        var dg = $(target);
        var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>{table}</body></html>'
        , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }

        
        
        var table = toHtml(target, rows, worksheet);
        table += table;
        var ctx = { worksheet: worksheet, table: table };
        var data = base64(format(template, ctx));
        data += data;
        if (window.navigator.msSaveBlob){
            var blob = b64toBlob(data);
            window.navigator.msSaveBlob(blob, filename);
        } else {
            var alink = $('<a style="display:none"></a>').appendTo('body');
            alink[0].href = uri + data;
            alink[0].download = filename;
            alink[0].click();
            alink.remove();
        }
    }
    
    $.extend($.fn.datagrid.methods, {
        toHtml: function(jq, rows){
            return toHtml(jq[0], rows);
        },
        toArray: function(jq, rows){
            return toArray(jq[0], rows);
        },
        toExcel: function(jq, param){
            return jq.each(function(){
                toExcel(this, param);
            });
        },
        print: function(jq, param){
            return jq.each(function(){
                print(this, param);
            });
        }
    });
})(jQuery);
