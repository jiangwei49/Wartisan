<?php
include 'ip.php';
$tValue = $_POST['tValue'];
$tValue = (int)$tValue;

// $tValue = 1;

//$connection = new MongoClient("mongodb://10.162.139.97");
$collection = wartisan_ip()->casetest->result;

$details = array("caseId" => $tValue);
$cursor = $collection->find($details);

foreach ($cursor as $doc) {
	# code...
	$json_string = json_encode($doc);
	echo $json_string.',';
}

?>