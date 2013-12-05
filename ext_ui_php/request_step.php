<html>
<head>
	<meta name="GENERATOR" content="Microsoft FrontPage 6.0">
	<meta name="ProgId" content="FrontPage.Editor.Document">
	<meta http-equiv="Content-Type" content="text/html; charset=gb2312">
	<title>test for expandable section</title>
</head>
<body>
	<style type="text/css">
<!--
body,td,th {
 font-size: 12px;
}
span {cursor:pointer;color:blue;
}
-->
</style>
<script>
	window.onload = function(){
    var divs = document.getElementsByTagName('div');//????div??
    for (var i = 0; i < divs.length; i++) {
        if (divs[i].className != 'jsdemo')
            continue;//????class???jsdemo,????
        //divs[i].style.display='none';   //???????????,???????
        var title = divs[i].previousSibling;//??????????????
        if (title.nodeType != 1) { //????????????
            title = title.previousSibling;
        }
        title.next = divs[i]; //?????next?????div[i]
        title.onclick = function(){//????
            var curStyle = this.next.style.display;//?div[i]???display?,????title.next?????
            var newStyle;//????display?
            var ico = title.getElementsByTagName('span')[0];//???????????
            if (curStyle == 'none') {//???????????
                newStyle = 'block';//????????,?????
                ico.innerHTML = '-';//????????

            }

            else {

                newStyle = 'none';//????????,?????

                ico.innerHTML = '+';//????????

            };

            title.next.style.display = newStyle;//?????div[i]??

        }

    }

}
</script>

<div id="demo">
<h2><span>-</span>Click to expand/collapse</h2>
<div class="jsdemo">
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

</body>
</html>