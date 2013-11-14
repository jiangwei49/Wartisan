<?php session_start();?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
<link href="css/adminStyle.css" type="text/css" rel="stylesheet" />
<style>
.sPassStyle{ width:600px; border:0; font-size:14px;}
.sPassStyle table{ border:0; background:#ccc;}
.sPassStyle table tr td{ border-right:0; border-bottom:0; background:#FFF;}
.sPassStyle table tr td.teven{ background:url(images/even.png) repeat-x; width:5%; padding-right:10px; text-align:right;}
.sButtonSub{ text-align:center;}
.sButtonSub input{ padding:2px 10px; border:1px solid #CCC; background: #81d4ff; cursor:pointer;}
</style>
</head>

<body>
<div class="tPageBody sPassStyle">     
<form id="spassform" action="" >
     <table cellpadding="0" cellspacing="1" border="0">
    	<tr>
            <td class="teven">UserName</td>
            <td><span id="getUser"><?php echo $_SESSION['userid'];?></span></td>
        </tr>
        <tr>
            <td class="teven">New Password</td>
            <td><input id="newPassword" type="text" value="" /></td>
        </tr>
        <tr>
            <td class="teven">Repeat Password</td>
            <td><input id="newPassword2" type="text"  value=""/></td>
        </tr>
         <tr>
            <td colspan="2" class="teven sButtonSub" style="text-align:center;"><input type="button" value="Submit" id="ssubmit" /><input type="button"  value="reset" id="sreset"/></td>
        </tr>
        </table> 
</form>
</div>  
</body>
</html>
<script type="text/javascript"> 
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
var getUser = document.getElementById('getUser');

var XHR = createXMLHttpReq();
XHR.open("GET","json.php",true);
XHR.send();
XHR.onreadystatechange = callPhp;
function callPhp()
{
	if(XHR.readyState==4 && XHR.status == 200)
		{
			var str = XHR.responseText;
			//alert(str);
			str = "["+str.substring(0,str.length-1)+"]";
			console.log(str);
			if(window.JSON)
			{
				var a = JSON.parse(str);
			}
			else
			{
				var a = eval("("+str+")");	
			}
			for(var i=0;i<a.length;i++)
			{
				if(a[i].uname == getUser.innerHTML)
				{
					var oldPassw = a[i].password;
					console.log(oldPassw);
				}
			}			
		}

	var oSubmit = document.getElementById('ssubmit');
	
	oSubmit.onclick = function()
	{
		var newPassw = document.getElementById('newPassword');
		var newPassw2 = document.getElementById('newPassword2');
		var input1 = newPassw.value.replace(/ /g,'');
		var input2 = newPassw2.value.replace(/ /g,'');
		if(input1 =="" || input2 == "")
		{
			alert('The password can\'t  be empty.');	
			document.location.reload();
		}
		else if(!(newPassw2.value ==newPassw.value))
		{
			alert('The two passwords filled aren\'t same. Please fill in again.');
			document.location.reload();
		}
		else{
			if(newPassw2.value === oldPassw)
			{
				alert("The new and old passwords are same. Please fill in again.");
				document.location.reload();
			}
			else
			{
				var XHR2 = createXMLHttpReq();
				XHR2.open("POST","json.php",true);
				XHR2.setRequestHeader("Content-type","application/x-www-form-urlencoded");
				XHR2.send("userName="+getUser.innerHTML+"&newPassword="+newPassw2.value);
				XHR2.onreadystatechange = function (){
					var str2 = XHR2.responseText;
					//console.log(str2);
					}
				alert('Modified success.');
				document.location.reload();
			}
		}
	}
	var oReset = document.getElementById('sreset');
	oReset.onclick = function()
	{
		var newPassw = document.getElementById('newPassword');
		var newPassw2 = document.getElementById('newPassword2');
		newPassw.value="";
		newPassw2.value="";
	}
}
</script>