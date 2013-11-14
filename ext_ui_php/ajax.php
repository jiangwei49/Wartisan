<?php 
include 'db_connect.php';

if (isset($_POST['name'])){
$username = $_POST['name'];
$cursor = mongo_collection()->findOne(array("username"=>$username));
echo count($cursor);
}
?>