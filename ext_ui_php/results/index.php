<?php
session_start();
if ((isset($_GET['loged'])) && ($_GET['loged'] == 'logout')){
	session_destroy();
	}
 ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Login page | Wartisan.com</title>
<link href="css/lgstyle.css" type="text/css" rel="stylesheet"/>

<script src="js/jquery-1.10.2.js"></script>
<script type="text/javascript">
function lresize(){
	$("#loginui").css("top", "35%");
	$("#ilogo").css("top", "5%");
	$("#loginui").css("left", "35%");
	$("#ilogo").css("left", "5%");
}
$(document).ready(function(){
	$("body").eq(0).css("height",window.innerHeight);
	lresize();
	$(window).resize(function(){
	$("body").eq(0).css("height",window.innerHeight);
	lresize();
	});

//提交，最终验证。
		 $('#send').click(function(){
			 var suser= document.getElementById('userid');
			 var spassword = document.getElementById('password');
			 if(suser.value==""  || spassword.value=="")
			 {
				 alert("Username and password can't empet");
				 return false;
			 }
					var XHR3 = createXMLHttpReq();
					XHR3.open("POST","loginjson.php",true);
					XHR3.setRequestHeader("Content-type","application/x-www-form-urlencoded");
					
					XHR3.send("suserName="+suser.value+"&spassword="+spassword.value);
					XHR3.onreadystatechange = function (msg){
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
								//alert (msg);
								window.location.href="cms.php";
							}
						}
					}
					
				
				//alert("注册成功,密码已发到你的邮箱,请查收.");
		 });

		//重置
		 $('#reset').click(function(){
			 var suser= document.getElementById('userid');
			 var spassword = document.getElementById('password');
				 suser.value="";
				 spassword.value="";
		 });


});
</script>
<style type="text/css"></style>
</head>
<body>
<img src="images/logo.png" id="ilogo"/>
<table id="loginui">
  <tr>
    <td style="padding-right:50px"><img src="images/left_peopl.png"/></td>
    <td style="vertical-align: top;width: 350px;text-align:center">
    	<form>
        <fieldset>
        <legend>
        <table><tr><td><img src="images/middle_key.png" alt="User login entry"/></td><td style="font-family:Verdana, Geneva, sans-serif; color:#666666; font-weight:bold">User login entry </td><td><img src="images/pointto.png"/></td></tr></table>
       </legend>
      <table width="200">
      <tr>
        <td style="font-family:Verdana, Geneva, sans-serif; color:#6699FF"><div align="right">Username:</div></td>
        <td><input type="text" id="userid" name="userid" class="linput"/></td>
      </tr>
      <tr>
        <td style="font-family:Verdana, Geneva, sans-serif; color:#6699FF"><div align="right">Password:	</div></td>
        <td><input type="password" id="password" name="password" class="linput"/></td>
      </tr>
      <!--<tr>
        <td>&nbsp;</td>
        <td style="font-family:Verdana, Geneva, sans-serif; font-size:15px;"> <input type="checkbox" id="lremb" name="lremb"/> remember me<br /></td>
      </tr>-->
      <tr><td colspan="2" style="padding-top: 30px; padding-left: 110px">        

        <input type="reset" value="Reset" id="reset" class="lbutton"/>
        <input type="button" value="Login" id="send" class="lbutton"/>
      </table>

        </fieldset>
        </form>
    </td>
    <td style="vertical-align: top; padding-top: 40px;padding-left: 10px"><img src="images/right_lock.png"/></td>
  </tr>
</table>
</body>
</html>
<script type="text/javascript" src="js/cookie.js"></script>
<script type="text/ecmascript">
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