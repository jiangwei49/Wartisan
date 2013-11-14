<?php
include 'ip.php';
$userName ="";
$newP = "";
if (isset($_POST['userName'])){
	$userName = $_POST['userName'];
	$newP = $_POST['newPassword'];
	echo $userName;
	echo $newP;
}
//$connection = new MongoClient("mongodb://10.162.139.97");
$collection = wartisan_ip()->adminui->example;
$document2 = $collection->find();
foreach($document2 as $k => $row){
     $json_string = json_encode($row);
	 echo $json_string;
	 echo ',';
}
$collection->update(array("uname" => $userName), array('$set' => array("password" => $newP)));

?>