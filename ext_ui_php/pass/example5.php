<?php
if (isset($data_back)){
$data_back = json_decode(file_get_contents('php://input'));
$current_url = $data_back->current;
}
?>
<head><script type="text/javascript" src="jquery.min.js"></script></head>
<div id="hidden_container" style="display: none;"></div>
<img src="" id="wikistatus"/>
<script LANGUAGE="javascript">
function set_status() {
  var status_image = 'green.png';
  $('#hidden_container').empty();
  $('#hidden_container').load('<?php echo $current_url;?> #status', function() {
    var status = $('#hidden_container').html();
    if(status === 'green') {
     status_image = 'red.png';}
    $('#wikistatus').attr('src', status_image);
    setTimeout('set_status();', 5000); // execute again in 5 seconds
  });
}

$(document).ready(function() {
  set_status();
});
</script>