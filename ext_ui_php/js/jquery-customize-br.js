// onload function
$(document).ready(function(){

      var steps = {}; 
      var id = 0; 
      var step = [];
//      $('.change').change(function(){
//          alert('aaa');
//      })
    
    $("#refresh").click(function(){
	location.reload(true);
	})
    
    $("#save").click(function(){
            
      $('li').each(function() {
          var actions = {};
          id++;
          
          var idname = '#inp'+id;
          var id2 =0;
             $(idname+'> tbody > tr').each(function() {
                 id2 ++;

                 actions[$(this).find("td:first").text()]=$(idname+'_'+id2).val();

             });
                 step.push(actions);
      });
      


    var duration = {};
    duration['startdate'] = $('#startdate').val();
    duration['enddate'] = $('#enddate').val();
    duration['total'] = 2;
    duration['runtime'] = 0;
    steps['title'] = $('#w_title').val();
    steps['description'] = $('#w_description').val();
    steps['duration'] =  duration;
    steps['steps'] =  step;
    if ( (duration['startdate']=='') || (duration['enddate']=='') || (steps['title'] == '') || (steps['description']== '')){
        alert('please complete the form');
        return false;
    }
    
       //validate     

        var json = JSON.stringify(steps);

              // alert (json);
                    $.ajax({
                           type: "POST",
                           url: "./yifei.php",
                           data: {steps:json},
                           success: function(msg)
                           {
                               alert('case created sucessfully');
                           }
                   });
				   
				//   alert ('case created sucessfully');
				   
//           
	});
        


});
