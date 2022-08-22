$(window).load(function () {
    $("#loading").fadeOut();
});

    if (navigator.appName == "Microsoft Internet Explorer" &&
            (navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE6.0" ||
            navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE7.0" ||
            navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE8.0")
    ) {
        alert(message.core.navigator_warning);
    }

    var _hmt = _hmt || [];
	/**
    (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?hmid999999999999";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();
	**/

    $(function () {

        $('#password').keyup(function (event) {
            if (event.keyCode == "13") {
                $("#login").trigger("click");
                return false;
            }
        });
        
        $("#login").on("click", function () {
            submitForm();
        });
        
        

        function submitForm() {
            if (navigator.appName == "Microsoft Internet Explorer" &&
                    (navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE6.0" ||
                    navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE7.0" ||
                    navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE8.0")
            ) {
                alert(message.core.navigator_warning);
            } else {
            	$.app.postJson( './login',
                    $('#form1').serializeJson(),
                    function (c) {
                    	if(c.status!=0)
    					{
                    		$('#myModal #msg').html("用户名和密码不正确");
                            $('#myModal').modal();	 
    					}else{
    					    $.app.localStorage.saveItem(window.app.clientId+'.token', c.data.token);
                            $.app.localStorage.saveItem(window.app.clientId+'.userid', c.data.userid);
    						location.href=contextpath + "/main.html";
    					}
                    }, true,message.core.login.error, {
                    'Authorization': 'Basic ' + window.btoa(window.app.clientId + ":" + window.app.clientSecret)
                    });
            }
        }

        $("#reset").on("click", function () {
            $("#email").val("");
            $("#password").val("");
        });
    });

