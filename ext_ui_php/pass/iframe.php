<?php

if (isset($_POST['name'])){
    echo $_POST['name'];

?>
<html>
    <input type="text" name="name1" value="<?php echo isset($_POST['name'])?$_POST['name']:"";?>">
</html>
<?php } ?>