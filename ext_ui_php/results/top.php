<?php session_start();?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
<link rel="stylesheet" href="css/style.css" />
<link rel="stylesheet” type=”text/css" href="http://fonts.googleapis.com/css?family=Tangerine">
<style>
body{
	background:#2c89ce;
	margin:0px;
	padding:0px;
	font-size:12px;
	font-family:'宋体',Arial, Helvetica, sans-serif;}

</style>
</head>
<body>
<div class="scontainer">
	<div class="slogo"></div>
    <div class="snav">Hello,<span id="getUser"><?php echo $_SESSION['userid'];?></span>, Welcome to login! <a href="modPassword.php" target="fmain" class="slock">Modify Password</a><a href="javascript:void(0)" onclick='window.parent.location.href="index.php?loged=logout"' class="slogout">logout</a></div>
</div>
</body>
</html>
