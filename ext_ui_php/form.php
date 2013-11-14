<?php 
include 'db_connect.php';

if (isset($_POST['name']) && isset($_POST['password'])){
$username = $_POST['name'];
$cursor = mongo_collection()->findOne(array("username"=>$username,"password"=>$_POST['password']));
if ($cursor){
   header("Location: http://localhost/wartisan/ok.php");
   exit;
}
else{
    echo 'failed';
}
}
?>
<html>
    <head>
        <script type="text/javascript" src="js/jquery.min.js"></script>
        <script type="text/javascript" src="js/script.js"></script>
    </head>
    
Login:<br>
<form id="wartisan_login_form" action="#">
    username:<input name="name" type="text" value=""/><br>
    password:<input name="password" type="password"/><br>
    <input id="wartisan_form_submit" type="submit" value="submit" />
</form>
<body>
<button id="show">button</button>

</body>
</html>
