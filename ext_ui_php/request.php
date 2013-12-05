<?php 
//if (isset($_POST['submitb'])){
//    echo $_POST['startdate'];
//}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Wartisan update interface</title>

	<link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css">
	<link rel="stylesheet" type="text/css" href="css/style-br.css"/>
	<link rel="stylesheet" type="text/css" href="css/tcal.css" />
	<script src="js/tcal.js"></script>
	<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
	<script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
	<script src="js/jquery-customize-br.js"></script>

	<link rel="stylesheet" type="text/css" href="http://www.adobe.com/ubi/template/identity/adobe/screen.css" media="screen" />
<link ref="stylesheet" type="text/css" href="http://www.adobe.com/ubi/template/identity/adobe/screen/common.css" />

</head>

<body>

	<div id="isStartPageSet" style="display:none">no</div>
	<div id="lpanel">
		<!--<div id="lfunc">
		<input type="button" id="newb" class="lfunc" name="newb" value="New!"/>
		<input type="button" id="updateb" class="lfunc" name="updateb" value="Update"/>
		<input type="button" id="deleteb" class="lfunc" name="deleteb" value="Delete"/>
		<input type="button" id="timelb" class="lfunc" name="timelb" value="Timeline"/>
	</div>
	-->
	<div class="starting_url">
		<p> <b><span id="currentUrl"></span></b> 
		</p>
	</div>

	<form >
		<table id='w_table'>
			<tr>
				<td>
					<div align="right">Request:</div>
				</td>
				<td>
					<input type="text" id="w_title" name="title" value=""></td>
			</tr>
			<tr>
				<td>
					<div align="right">Description:</div>
				</td>
				<td>
					<textarea id="w_description" name="description"></textarea>
				</td>
			</tr>
		</table>

		<!--   <input type="text" id="newb" class="lfunc" name="newb" value="New!"/>
		-->
		<!-- content for steps -->
		<div id="lmain">
			<ol id="lupditem"></ol>
		</div>

		<!-- content for due date -->
		<br />
		<div id="ldate">
			<div style="float: left">
				<table>
					<tr>
						<td>
							<div align="right">Start Date:</div>
						</td>
						<td>
							<input type="text" id="startdate" name="startdate" class="tcal" value=""></td>
					</tr>
					<tr>
						<td>
							<div align="right">End Date:</div>
						</td>
						<td>
							<input type="text" id="enddate" name="enddate" class="tcal" value=""/>
						</td>
					</tr>
				</table>
			</div>
			<div style="float: right; margin-top: 15px; margin-right: 30px;"></div>
		</div>

		<!-- buttons -->
		<div id="lcommit">
			<!--<input type="button" id="create-user" class="lcommit" name="verifyb" value="Verify"/>-->
			
			<input type="button" id="save" class="lcommit" name="saveb" value="Save"/>
			<input type="button" id="load" class="lcommit" name="loadb" value="Load"/>
			<!-- <input type="button" id="refresh" class="lcommit" name="refresh" value="Refresh"/>
			-->
		</div>

	</form>
</div>

<script>
function sectionClick(sectionId){
    var divs = document.getElementsByTagName('div'); //find all div elements
    for (var i = 0; i < divs.length; i++) {
        if (divs[i].className != sectionId) {
            continue; // if class is not jsdemo, continue
        }
        //divs[i].style.display='none';   //if you want everything hidden, uncomment this line
        var title = divs[i].previousSibling; //from the previous element, locate the title
       
        if (title.nodeType != 1) { //make sure we find the element node
            title = title.previousSibling;
        }
        title.next = divs[i]; //set title's next property and pointing to div[i]
        //title.onclick = function(){ // click event - wei: since we are not using window.onLoad(), we don't need to define the onclick function, we are already in the click event
            var curStyle = title.next.style.display; //get div[i]'s default display value
            var newStyle; // define new display value
            var ico = title.getElementsByTagName('span')[0]; // get the node for expand/collapse
            if (curStyle == 'none') { // decide to collapse or expand
                newStyle = 'block'; // when hide, make visibla
                ico.innerHTML = '<img src="images/collapse_15x15.png"/>'; // change icon to collapse

            }

            else {

                newStyle = 'none'; // when expand, change to collapse

                ico.innerHTML = '<img src="images/expand_15x15.png"/>'; // change icon to expand

            };

            title.next.style.display = newStyle; // assign the new display for div[i]

        //}

    }

}
</script>

<script>
	// give date/time a default value - current date
	var today = new Date();

	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	if(dd<10){dd='0'+dd};
	if(mm<10){mm='0'+mm};

	today = mm+'/'+dd+'/'+yyyy;

	document.getElementById('startdate').value = today;
	document.getElementById('enddate').value = today;
</script>


<script>
// $(function() {
//   var name = $( "#name" ),
//   email = $( "#email" ),
//   password = $( "#password" ),
//   allFields = $( [] ).add( name ).add( email ).add( password ),
//   tips = $( ".validateTips" );

//   function updateTips( t ) {
// 	tips.text( t ).addClass( "ui-state-highlight" );
// 	setTimeout(function() {
// 			tips.removeClass( "ui-state-highlight", 1500 );
// 		}, 500 );
// 	}

// 	function checkLength( o, n, min, max ) {
// 		if ( o.val().length > max || o.val().length < min ) {
// 			o.addClass( "ui-state-error" );
// 			updateTips( "Length of " + n + " must be between " + min + " and " + max + "." );
// 			return false;
// 		} else {
// 			return true;
// 		}
// 	}

// 	function checkRegexp( o, regexp, n ) {
// 		if ( !( regexp.test( o.val() ) ) ) {
// 			o.addClass( "ui-state-error" );
// 			updateTips( n );
// 			return false;
// 		} else {
// 			return true;
// 		}
// 	}

// 	$( "#dialog-form" ).dialog({
// 		autoOpen: false,
// 		height: 300,
// 		width: 350,
// 		modal: true,
// 		buttons: {
// 			"Create an account": function() {
// 				var bValid = true;
// 				allFields.removeClass( "ui-state-error" );
// 				bValid = bValid && checkLength( name, "username", 3, 16 );
// 				bValid = bValid && checkLength( email, "email", 6, 80 );
// 				bValid = bValid && checkLength( password, "password", 5, 16 );
// 				bValid = bValid && checkRegexp( name, /^[a-z]([0-9a-z_])+$/i, "Username may consist of a-z, 0-9, underscores, begin with a letter." );
// 				// From jquery.validate.js (by joern), contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
// 				bValid = bValid && checkRegexp( email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "eg. ui@jquery.com" );
// 				bValid = bValid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" );
// 				if ( bValid ) {
// 					$( "#users tbody" ).append( "<tr>" +
// 						"<td>" + name.val() + "</td>" +
// 						"<td>" + email.val() + "</td>" +
// 						"<td>" + password.val() + "</td>" +
// 						"</tr>" );
// 				$( this ).dialog( "close" );
// 			}
// 		},

// 			Cancel: function() {
// 				$( this ).dialog( "close" );
// 			}
// 		},

// 		close: function() {
// 			allFields.val( "" ).removeClass( "ui-state-error" );
// 		}
// 	});

// 	$( "#create-user" ).button().click(function() {
// 		//alert("11"+currentPageUrl);
// 		$( "#dialog-form" ).dialog( "open" );
// 	});

// });
// </script>

<!-- <div id="dialog-form" title="Create new user">
<p class="validateTips">All form fields are required.</p>
<form>
	<fieldset>
		<label for="name">Description</label>
		<input type="text" name="name" id="name" class="text ui-widget-content ui-corner-all">
		<label for="email">Email</label>
		<input type="text" name="email" id="email" value="" class="text ui-widget-content ui-corner-all">
		<label for="password">Password</label>
		<input type="password" name="password" id="password" value="" class="text ui-widget-content ui-corner-all"></fieldset>
</form>
</div>
-->
<p>&nbsp;</p>

<!-- <h4 onclick=sectionClick("jsdemo1") class="step_title">
<span><img src="images/collapse_15x15.png"/></span>
<span>Click to expand/collapse</span>
</h4>
<div class="jsdemo1">
<p>Name:Mr.Think</p>
<p>Blog:http://MrThink.net</p>
<p>Date:2010.08.01</p>
<p>aaaaaaaaaaaaaaa</p>
<p>aaaaaaaaaaaaaaa</p>
<p>aaaaaaaaaaaaaaa</p>
<p>aaaaaaaaaaaaaaa</p>
<p>aaaaaaaaaaaaaaa</p>
<input id="a"/>
</div>

<h4 onclick=sectionClick("jsdemo2") class="step_title"><span><img src="images/collapse_15x15.png"/></span><span>Click to expand/collapse</span></h4>
<div class="jsdemo2">
	<table>
		<tr><td>
<p>Name:Mr.Think</p>
<p>Blog:http://MrThink.net</p>
<p>Date:2010.08.01</p>
<p>aaaaaaaaaaaaaaa</p>
<p>aaaaaaaaaaaaaaa</p>
<p>aaaaaaaaaaaaaaa</p>
<p>aaaaaaaaaaaaaaa</p>
<p>aaaaaaaaaaaaaaa</p></td></tr>
<tr><td><input id="a"/></td></tr>
</table>
</div>

<table>
<tr>
<td><div onclick=alert("xxx");sectionClick("step3") class="step_title"><img src="images/collapse_15x15.png"/>Click to expand/collapse</div></td>
<td></td>
</tr>
	
<tr class="step3" style='display:none'><td>pageUrl</td><td><textarea class='change' id='inp1_1' style='max-height: 70px; min-width: 200px;min-height: 70px; max-width: 200px;'>http://www.baidu.com/</textarea></td></tr><tr style='display:none'><td>action</td><td><textarea class='change' id='inp1_2' style='max-height: 70px; min-width: 200px;min-height: 70px; max-width: 200px;'>update</textarea></td></tr><tr style='display:none'><td>pathType</td><td><textarea class='change' id='inp1_3' style='max-height: 70px; min-width: 200px;min-height: 70px; max-width: 200px;'>xpath</textarea></td></tr><tr style='display:none'><td>pathText</td><td><textarea class='change' id='inp1_4' style='max-height: 70px; min-width: 200px;min-height: 70px; max-width: 200px;'>/html[1]/body[1]/div[1]/div[1]/div[2]/p[2]/a[1]</textarea></td></tr><tr ><td>verifyText</td><td><textarea class='change' id='inp1_5' style='max-height: 70px; min-width: 200px;min-height: 70px; max-width: 200px;'>新 闻</textarea></td></tr><tr ><td>linpropertise_href</td><td><textarea class='change' id='inp1_6' style='max-height: 70px; min-width: 200px;min-height: 70px; max-width: 200px;'>http://news.baidu.com</textarea></td></tr>
</table> -->
<!-- <input id="foo" type="text" value="Dialog value...">--></body>
</html>