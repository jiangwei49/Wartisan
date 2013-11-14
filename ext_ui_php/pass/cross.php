<?php
$data_back = json_decode(file_get_contents('php://input'));
$current_url = $data_back->current;
echo $current_url;
die()
;
?>
