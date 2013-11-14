<?php

function mongo_collection(){
    
$mongo = new MongoClient();

$db = $mongo->casetest;

$collection = $db->ffcase;

return $collection;
}


//$document = array("username"=>"jinge","password"=>"123");
//$collection->insert($document);
//
//$document = array("username"=>"kika","password"=>"321");
//$collection->insert($document);

//$cursor = mongo_collection()->findOne(array("username"=>"jinge"));
// iterate through the results
//foreach ($cursor as $document) {
//    echo $document["username"] . "\n";
//    echo $document["password"] . "\n";
//    echo $document["_id"] . "\n";
//}

?>