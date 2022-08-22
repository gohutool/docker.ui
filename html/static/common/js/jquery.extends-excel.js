
$.extends.toExcel = function(sheets, filename){

    var uri = 'data:application/vnd.ms-excel;base64,',
        html_start = '<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">',
        template_ExcelWorksheet = '<x:ExcelWorksheet><x:Name>{SheetName}</x:Name><x:WorksheetSource HRef="sheet{SheetIndex}.htm"/></x:ExcelWorksheet>',
        template_ListWorksheet = '<o:File HRef="sheet{SheetIndex}.htm"/>',
        template_HTMLWorksheet = '\n' +
            '------=_NextPart_dummy\n'+
            'Content-Location: sheet{SheetIndex}.htm\n'+
            'Content-Type: text/html; charset=utf-8\n'  +
            html_start +
            '' +
            '<head>\n'+
            '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n'+
            '<link id="Main-File" rel="Main-File" href="../WorkBook.htm">\n'+
            '<link rel="File-List" href="filelist.xml">\n'+
            '</head>\n'+
            '<body>{SheetContent}</body>\n'+
            '</html>',
        template_WorkBook = 'MIME-Version: 1.0\n'+
            'X-Document-Type: Workbook\n'+
            'Content-Type: multipart/related; boundary="----=_NextPart_dummy"\n'+
            '\n'+
            '------=_NextPart_dummy\n'+
            'Content-Location: WorkBook.htm\n'+
            'Content-Type: text/html; charset=utf-8\n\n'+
            html_start +
            '<head>\n'+
            '<meta name="Excel Workbook Frameset">\n'+
            '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n'+
            '<link rel="File-List" href="filelist.xml">\n'+
            '<!--[if gte mso 9]><xml>\n'+
            '<x:ExcelWorkbook>\n'+
            '<x:ExcelWorksheets>{ExcelWorksheets}</x:ExcelWorksheets>\n'+
            '<x:ActiveSheet>0</x:ActiveSheet>\n'+
            '</x:ExcelWorkbook>\n'+
            '</xml><![endif]-->\n'+
            '</head>\n'+
            '<frameset>\n'+
            '<frame src="sheet0.htm" name="frSheet">\n'+
            '<noframes><body><p>This page uses frames, but your browser does not support them.</p></body></noframes>\n'+
            '</frameset>\n'+
            '</html>\n'+
            '{HTMLWorksheets}\n'+
            'Content-Location: filelist.xml\n'+
            'Content-Type: text/xml; charset="utf-8"\n'+
            '\n'+
            '<xml xmlns:o="urn:schemas-microsoft-com:office:office">\n'+
            '<o:MainFile HRef="../WorkBook.htm"/>\n'+
            '{ListWorksheets}\n'+
            '<o:File HRef="filelist.xml"/>\n'+
            '</xml>\n'+
            '------=_NextPart_dummy--\n'

        , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };

    if(!sheets || sheets.length == 0)
        return null;

    var context_WorkBook = {
        ExcelWorksheets:''
        ,   HTMLWorksheets: ''
        ,   ListWorksheets: ''
    };

    $.each(sheets, function(idx, sheet){
        var SheetName = sheet.worksheet;
        if($.trim(SheetName) === ''){
            SheetName = 'Sheet' + SheetIndex;
        }

        context_WorkBook.ExcelWorksheets += format(template_ExcelWorksheet, {
            SheetIndex: idx
            ,   SheetName: SheetName
        });

        context_WorkBook.HTMLWorksheets += format(template_HTMLWorksheet, {
            SheetIndex: idx
            ,   SheetContent: sheet.table
        });

        context_WorkBook.ListWorksheets += format(template_ListWorksheet, {
            SheetIndex: idx
        });
    });

    var data = base64(format(template_WorkBook, context_WorkBook));

    if(filename==null)
        return data;


    if (window.navigator.msSaveBlob){
        var blob = b64toBlob(data);
        window.navigator.msSaveBlob(blob, filename);
    } else {

        var uri = 'data:application/vnd.ms-excel;base64,';

        var alink = $('<a style="display:none"></a>').appendTo('body');
        alink[0].href = uri + data;
        alink[0].download = filename;
        alink[0].click();
        alink.remove();
    }
}