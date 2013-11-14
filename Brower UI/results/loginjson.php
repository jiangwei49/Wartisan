<?php
session_start(); 
include 'ip.php';
$rs ="";
if (isset($_POST['suserName'])){
	$suserName = $_POST['suserName'];
	$spassword = $_POST['spassword'];
	//echo $suserName;
	//echo $spassword;
}
//$connection = new MongoClient("mongodb://10.162.139.97");
$collection = wartisan_ip()->adminui->example;
$document2 = $collection->find();
foreach($document2 as $k => $row){
     $json_string = json_encode($row);
	// echo $json_string;
	// echo ',';
}
$rs = $collection->find(array("uname" => $suserName,"password" => $spassword));
//var_dump(iterator_to_array($rs));
if($rs->count()==0)
{
	echo "User name or password error";
}
else{
	//echo $_SESSION['userid'];
  	$_SESSION['userid']=$_POST['suserName'];
	}

?>