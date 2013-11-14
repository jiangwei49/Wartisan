<?php 
include 'db_connect.php';

if (isset($_POST['steps'])){
    
$steps = json_decode($_POST['steps']);
$array = array();
$array['title'] = $steps->title;
$array['description'] = $steps->description;
$array['state'] = 0;
$array['email'] = "wartisan@wartisan.com";

/*convert duration into array;*/
$durations = $steps->duration;
$datainfo = array();
foreach ( $durations as $key => $duration){
    $datainfo[0][$key] = $duration;
}
$array['duration'] = $datainfo;
/*convert duration into array end*/

$inputs = $steps->steps;

/*conver page steps to steps which used to insert into mongo*/
//foreach loop: $url == all page urls which have been updated, and strip pageUrl.

foreach ( $inputs as $key_ob => $input_object){
   $url[] = (isset($input_object->pageUrl))?$input_object->pageUrl:'';
   foreach ( $input_object as $key => $input ){
       $final_input[$key_ob][$key] = $input;
      unset($final_input[$key_ob]['pageUrl']);
   }
}
if (isset($url)){
$urls = array_count_values($url); //$urls:find total opened pages, and array value == number of steps on this page. 

$total_steps = count($urls) + count($final_input);//total steps saved in mongo;

$sub_steps = array_sum($urls); //number of li elements=== number of updtates





//save url as an action in front of steps which under this url, then merge all of these into one array;
$previousValue = 0;
$outputs = array();
foreach ( $urls as $key => $value){
    $sum_value = $value + $previousValue;
    $slice = array_slice($final_input,$previousValue, $sum_value); //every same page url under same slice,
    $openurl = array('action'=>'openurl','verifyText'=>$key);
    array_unshift($slice, $openurl);
    $outputs[] = $slice;
    $previousValue = $sum_value;
    
}
$steps_to_mongo = array();
foreach ( $outputs as $output){
   $steps_to_mongo = array_merge($steps_to_mongo,$output); 
}
$step_numb = 0;
foreach ($steps_to_mongo as &$value){
    $step_numb++;
    $value['step'] = $step_numb;
    
}
}

/*end conver*/

//print_r($steps_to_mongo);



//$info = array();
//$info[0]['step'] = 0;
//$info[0]['action'] = 'openurl';
//$info[0]['verifyText'] = $inputs->pageUrl;
//$info[1]['step'] = 1;
//foreach ($inputs as $key=>$input){
//    if ( $key != 'pageUrl'){
//    $info[1][$key] = $input; 
//    }
//}
if (isset($steps_to_mongo)){
$array['steps'] = $steps_to_mongo;
}

//
$collection = mongo_collection();
$count = $collection->count();
$array['_id'] = $count+1;
//$collection = $connection->extensionui->ui;
$collection->insert($array);
print_r($array);
 
}
?>