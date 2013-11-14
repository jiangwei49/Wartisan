$(document).ready(function(){

 $('#wartisan_login_form').submit(function(){
      
     var data = $(this).serialize();
        $.ajax({
                type: "POST",
                url: "./ajax.php",
                data: data,
                success: function(msg)
                {

                }
        });

 });
});