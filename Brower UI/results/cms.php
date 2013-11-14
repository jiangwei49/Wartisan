<?php 
       session_start(); 
       if(isset($_SESSION['userid'])){
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Wartisn Content Manage System</title>
<link rel="stylesheet” type=”text/css" href="http://fonts.googleapis.com/css?family=Tangerine">
</head>


<frameset rows="76,*" frameborder="0" frameborder="no" framespacing="0" name="parents">
  <frame src="top.php" name="ftop"/>
  <frameset cols="245,*" frameborder="0" frameborder="no" framespacing="0">
      <frame src="leftnav.php"/ name="fleft">
      <frame src="main.html" name="fmain"  />
  </frameset>
</frameset>
</html>
<?php }else {echo 'No seesion, please login';}?>

