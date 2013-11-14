<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Left Navigation</title>
<link rel="stylesheet" type="text/css" href="css/style.css">
<script src="js/jquery-1.10.2.js"></script>
<script src="js/jquery-customize.js"></script>
<style>
html,body{height:100%; margin:0;}
body, div, h4, ul, li{ background:none;}
</style>
</head>
<body>
<div style="height:100%; border-right:1px solid #C1BCB6;">
    <div id="leftnav">
    <div id="lroof"></div>
    <div>
    <div onclick='javascript:window.parent.fmain.location.href="main.html"' class="lnav" id="lnav1"><img src="images/nav_icon.png"/ class="nav_icon"><h4>Review Cases</h4>
    <img src="images/bg_nav1_bt.jpg" class="bg_nav1_bt"/>
    </div>
   <!-- <div class="lnav_sub" id="lnav1_1">
    <ul class="myli1">
    <li class="bg01"><a href="#"><h5>功能菜单二</h5></a></li>
    <li class="bg02"><a href="#"><h5>功能菜单二</h5></a></li>
    <li class="bg01"><a href="#"><h5>功能菜单二</h5></a></li>
    <li class="bg02"><a href="#"><h5>功能菜单二</h5></a></li>
    <li class="bg01"><a href="#"><h5>功能菜单二</h5></a></li>
    </ul>
    </div>-->
    </div>
    
    <div>
    <div onclick='javascript:window.parent.fmain.location.href="modPassword.php"' class="lnav" id="lnav2"><img src="images/nav_icon.png"/ class="nav_icon"><h4>Modify Password</h4>
    <img src="images/bg_nav1_bt.jpg" class="bg_nav1_bt"/>
    </div>
    <!--<div class="lnav_sub" id="lnav2_1">
    <ul class="myli2">
    <li class="bg01"><a href="#"><h5>功能菜单二</h5></a></li>
    <li class="bg02"><a href="#"><h5>功能菜单二</h5></a></li>
    <li class="bg01"><a href="#"><h5>功能菜单二</h5></a></li>
    <li class="bg02"><a href="#"><h5>功能菜单二</h5></a></li>
    <li class="bg01"><a href="#"><h5>功能菜单二</h5></a></li>
    </ul>
    </div>-->
    </div>
    
   <!-- <div>
    <div class="lnav" id="lnav3"><img src="images/nav_icon.png"/ class="nav_icon"><h4>功能菜单一</h4>
    <img src="images/bg_nav1_bt.jpg" class="bg_nav1_bt"/>
    </div>
    <div class="lnav_sub" id="lnav3_1">
    <ul class="myli3">
    <li class="bg01"><a href="#"><h5>功能菜单二</h5></a></li>
    <li class="bg02"><a href="#"><h5>功能菜单二</h5></a></li>
    <li class="bg01"><a href="#"><h5>功能菜单二</h5></a></li>
    <li class="bg02"><a href="#"><h5>功能菜单二</h5></a></li>
    <li class="bg01"><a href="#"><h5>功能菜单二</h5></a></li>
    </ul>
    </div>
    </div>
    
    <div>
    <div class="lnav" id="lnav4"><img src="images/nav_icon.png"/ class="nav_icon"><h4>功能菜单一</h4>
    <img src="images/bg_nav1_bt.jpg" class="bg_nav1_bt"/>
    </div>
    <div class="lnav_sub" id="lnav4_1">
    <ul class="myli4">
    <li class="bg01"><a href="#"><h5>功能菜单二</h5></a></li>
    <li class="bg02"><a href="#"><h5>功能菜单二</h5></a></li>
    <li class="bg01"><a href="#"><h5>功能菜单二</h5></a></li>
    <li class="bg02"><a href="#"><h5>功能菜单二</h5></a></li>
    <li class="bg01"><a href="#"><h5>功能菜单二</h5></a></li>
    </ul>
    </div>
    </div>
    
    <div>
    <div class="lnav" id="lnav5"><img src="images/nav_icon.png"/ class="nav_icon"><h4>功能菜单一</h4>
    <img src="images/bg_nav1_bt.jpg" class="bg_nav1_bt"/>
    </div>
    <div class="lnav_sub" id="lnav5_1">
    <ul  class="myli5">
    <li class="bg01"><a href="#"><h5>功能菜单二</h5></a></li>
    <li class="bg02"><a href="#"><h5>功能菜单二</h5></a></li>
    <li class="bg01"><a href="#"><h5>功能菜单二</h5></a></li>
    <li class="bg02"><a href="#"><h5>功能菜单二</h5></a></li>
    <li class="bg01"><a href="#"><h5>功能菜单二</h5></a></li>
    </ul>
    </div>
    </div>
    </div>-->
</div>
</body>
</html>
<script>/*
var oDivs = document.getElementsByClassName('lnav');
for(var i=0;i<oDivs.length;i++)
{
	;(function(i){
		oDivs[i].onclick = function(){
			for(var j=0;j<oDivs.length;j++)
			{
				oDivs[j].style.background='url("images/bg_nav1.jpg") repeat-x';
				oDivs[j].getElementsByTagName("img")[1].src="images/bg_nav1_bt.jpg";
			}
			this.style.background='url("images/bg_dark-1x44.jpg") repeat-x';
			this.getElementsByTagName("img")[1].src="";
			
		}
		return false;
	})(i);
}*/
</script>