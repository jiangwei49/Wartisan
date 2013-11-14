<?php
include 'ip.php';
//$connection = new MongoClient("mongodb://10.162.139.97");
$collection = wartisan_ip()->casetest->ffcase;
$document2 = $collection->find();
foreach($document2 as $k => $row){
     $json_string = json_encode($row);
 // $obj = json_decode($json_string);
  echo $json_string.",";
}
?>
