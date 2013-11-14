<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
<link href="css/loginstyle.css" rel="stylesheet" type="text/css" />
<!--   引入jQuery -->
<script src="js/jquery-1.10.2.js" type="text/javascript"></script>
<script type="text/javascript">
//<![CDATA[
$(function(){
		//如果是必填的，则加红星标识.
		$("form :input.required").each(function(){
			var $required = $("<strong class='high'> *</strong>"); //创建元素
			$(this).parent().append($required); //然后将它追加到文档中
		});
         //文本框失去焦点后
	    $('form :input').blur(function(){
			 var $parent = $(this).parent();
			 $parent.find(".formtips").remove();
			 //验证用户名
			 if( $(this).is('#username') ){
					if( this.value=="" || this.value.length < 4 ){
					    var errorMsg = '请输入至少6位的用户名.';
                        $parent.append('<span class="formtips onError">'+errorMsg+'</span>');
					}else{
					    var okMsg = '输入正确.';
					    $parent.append('<span class="formtips onSuccess">'+okMsg+'</span>');
					}
			 }
			 //验证邮件
			 if( $(this).is('#password') ){
				if( this.value==""){
                      var errorMsg = '请输入密码.';
					  $parent.append('<span class="formtips onError">'+errorMsg+'</span>');
				}else{
                      var okMsg = '输入正确.';
					  $parent.append('<span class="formtips onSuccess">'+okMsg+'</span>');
				}
			 }
		}).keyup(function(){
		   $(this).triggerHandler("blur");
		}).focus(function(){
	  	   $(this).triggerHandler("blur");
		});//end blur

		
		//提交，最终验证。
		 $('#send').click(function(){
				$("form :input.required").trigger('blur');
				var numError = $('form .onError').length;
				if(numError){
					return false;
				} 
				else
				{
					var XHR3 = createXMLHttpReq();
					XHR3.open("POST","loginjson.php",true);
					XHR3.setRequestHeader("Content-type","application/x-www-form-urlencoded");
					var suser= document.getElementById('username');
					var spassword = document.getElementById('password');
					XHR3.send("suserName="+suser.value+"&spassword="+spassword.value);
					XHR3.onreadystatechange = function (){
						if(XHR3.readyState==4)
						{
							var str3 = XHR3.responseText;
							var str2="User name or password error";
							if(str3 == str2)
							{
								alert(str3);
							}
							else
							{
								window.location.href="index.php";
							}
						}
					}
					
				}
				//alert("注册成功,密码已发到你的邮箱,请查收.");
		 });

		//重置
		 $('#res').click(function(){
				$(".formtips").remove(); 
		 });
})
//]]>
</script>
</head>
<body>
<form id="form1">
	<div class="int">
		<label for="username">用户名:</label>
		<input type="text" id="username" class="required" />
	</div>
	<div class="int">
		<label for="password">密&nbsp;&nbsp;&nbsp;&nbsp;码:</label>
		<input type="text" id="password" class="required" />
	</div>
	<div class="sub">
		<input type="button" value="提交" id="send"/><input type="reset" id="res"/>
	</div>
</form>
</body>
</html>
<script type="text/javascript">
var oForm = document.getElementById('form1');
function position()
{
	var oW = document.documentElement.clientWidth || document.body.clientWidth;
	var oH = document.documentElement.clientHeight || document.body.clientHeight;
	oForm.style.left = oW/2-oForm.offsetWidth/2+'px';
	oForm.style.top = oH/2-oForm.offsetHeight/2+'px';	
}
position();

window.onresize = function()
{
	position();
}
// 创建跨浏览器的XMLHttpRequest对象
function createXMLHttpReq(){
   if(window.XMLHttpRequest){//如果是火狐等标准浏览器，则这样创建XMLHttpRequest对象
      return new XMLHttpRequest();
   }else if(window.ActiveXObject){
   var aVersions=["MSXML2.XMLHttp.6.0",
      "MSXML2.XMLHttp.5.0", "MSXML2.XMLHttp.4.0",
      "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp","Microsoft.XMLHttp"]; //把IE的所有XMLHttpRequest模式放在这个数组里
   //不过这个有点太细了，其实只要var xmlHttpReq = new ActiveXObject("MSXML2.XMLHTTP.3.0");就够了， 不必写这个循环。
   //详见手册

      for(var i=0; i<aVersions.length; i++){
         try{//如果出错了，就执行下一个创建
            var oXmlHttpReq=new ActiveXObject(aVersions[i]);
            return oXmlHttpReq;//没出错，则说明是正确的，返回正确结果并退出
         }catch(oError){
            //Do nothing
         }
      }
   }
   alert('error');
   throw new Error("不能创建XMLHttpRequest对象。");
}

</script>