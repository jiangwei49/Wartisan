// onload function
$(document).ready(function() {

  var steps = {};
  var id = 0;
  var step = [];
  //      $('.change').change(function(){
  //          alert('aaa');
  //      })

  $("#load").click(function() {
    alert("load button clicked");
    //location.reload(true);
  });

  $("#save").click(function() {

    $('li').each(function() {
      var actions = {};
      id++;

      var idname = '#inp' + id;
      var checkboxIdName = 'ck' + id;
      var id2 = 0;
      $(idname + '> tbody > tr').each(function() {
        id2++;

        //actions[$(this).find("td:first").text()] = $(idname + '_' + id2).val();
        
        if ($(this).find("td:first").find("input:checkbox")) { 
          if ( document.getElementById(checkboxIdName+"_"+id2).checked) {
            //alert(checkboxIdName);
            actions[$(this).find("td:nth-child(2)").text()] = $(idname + '_' + id2).val();
          } else {
            //alert("no checked");
            actions[$(this).find("td:nth-child(2)").text()] = "non checking: " + $(idname + '_' + id2).val();
          }
        } else {
          alert("everything should have a checkbox");
        }

      });

      //alert("aaa");
      step.push(actions);

    });

    var duration = {};
    duration['startdate'] = $('#startdate').val();
    duration['enddate'] = $('#enddate').val();
    duration['total'] = 2;
    duration['runtime'] = 0;
    steps['title'] = $('#w_title').val();
    steps['description'] = $('#w_description').val();
    steps['duration'] = duration;
    steps['steps'] = step;
    //alert("bbb");
    if ((duration['startdate'] == '') || (duration['enddate'] == '') || (steps['title'] == '') || (steps['description'] == '')) {
      alert('please complete the form');
      return false;
    }

    if ($( "li" ).size() == 0) {
      alert('please select something to verify');
      return false;
    }
    

    //location.reload(true);

    //validate     

    var json = JSON.stringify(steps);

    // alert (json);
    $.ajax({
      type: "POST",
      url: "./yifei.php",
      data: {
        steps: json
      },
      success: function(msg) {
        alert('case created sucessfully');
        location.reload(true);
      }
    });

    //alert ('case created sucessfully');

    //     
  });



});