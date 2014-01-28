//the integer-value for the flag representing the end of the main page browser load
//Wei: didn't figure out how to use below three constants, keep for now

const STATE_PAGE_LOADED = 786448; //STATE_STOP, STATE_IS_NETWORK, and STATE_IS_WINDOW flags
const NOTIFY_STATE_DOCUMENT =
	Components.interfaces.nsIWebProgress.NOTIFY_STATE_DOCUMENT;
const STATE_STOP =
	Components.interfaces.nsIWebProgressListener.STATE_STOP;

// The Global CreateRequest Sidebar Object
var mysidebar;
var browser;
//var mainWindow;
var $mb = jQuery.noConflict();
var doc;
var path_style; //csspath or xpath
var action_type; // update or action
//for ajax;
var xmlHttp;
var countClicks = 0; //numberof clicks on right side after started update.
//var isStartPageSet = false;
var actionsContent; // store general infor for each action step: pageurl, desc, etc.
var actionContent; // store infor for the specific step
var elementsContent;
var actionLoopCount = 1;
var actionPropertyLoopCount = 1;
var isListeningSidebarDoc = false;
var hasSetStepGeneralInfor = false;
var wartisan_recordingHTML;
var latestInputContent = '';
var latestInputElementPath = '';


function S_xmlhttprequest() {
	if (window.ActiveXObject) {
		xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
	} else if (window.XMLHttpRequest) {
		xmlHttp = new XMLHttpRequest();
	}
}

function getSideBar() {
	if (!mysidebar) {
		mysidebar = top.document.getElementById('sidebar').contentWindow;
	}
	return mysidebar;
}

function getSideBarBrowser() {
	if (!browser) {
		browser = getSideBar().document.getElementById("createrequestBrowser");
	}
	return browser;
}

// Load a url in the content window.
function LoadSideBarContent(url) {
	getSideBarBrowser().webNavigation.loadURI(url, 0, null, null, null);
}

function registerClickListener() {
	// alert("registerMyListener");
	// Wei: myListener is from ClickMap
	//alert("registerMyListener1: "+top.getBrowser());
	//top.getBrowser().addProgressListener(myListener, NOTIFY_STATE_DOCUMENT);
	// Wei: clickReporter is used for Create Request
	top.getBrowser().addEventListener("click", clickReporter, false);
	top.getBrowser().addEventListener("mouseover", wartisan_mouseover, false);
	//alert("registerMyListener2: "+top.getBrowser());
}

function unregisterClickListener() {
	try {
		//alert("unregisterMyListener1: "+top.getBrowser());
		//top.getBrowser().removeProgressListener(myListener);
		// Wei: have to clickReporter, otherwise even we close sidebar, this listener will keep working
		// Wei: this should work with "Recording" button later
		////alert("unregisterMyListener");
		top.getBrowser().removeEventListener("click", clickReporter, false);
		top.getBrowser().removeEventListener("mouseover", wartisan_mouseover, false);
		//alert("unregisterMyListener2: "+top.getBrowser());
	} catch (ex) {}
}

function registerRecordListener() {
	// mouse: click, onpaste, oninput
	// keyboard: keydown, keypress, keyup
	//top.getBrowser().addEventListener("keypress", getChar, false);
	//top.getBrowser().addEventListener("textinput", recordGetTextInput, false);
	top.getBrowser().addEventListener("input", record_getInput, false); //firefox
	top.getBrowser().addEventListener("click", record_clickReporter, false);
	//top.getBrowser().addEventListener("onpropertychange", recordGetPropertyChange, false);
}

function unregisterRecordListener() {
	// top.getBrowser().removeEventListener("textinput", recordGetTextInput, false);
	top.getBrowser().removeEventListener("input", record_getInput, false);
	top.getBrowser().removeEventListener("click", record_clickReporter, false);
	//top.getBrowser().removeEventListener("onpropertychange", recordGetPropertyChange, false);
}

function registerSaveButtonListener() {
	if (isListeningSidebarDoc) { 
	} else {
		isListeningSidebarDoc = true;
		alert("sidebarDocListener loaded");
		//var wartisan_sidebar = top.document.getElementById('sidebar').contentWindow.document.getElementById("createrequestBrowser").contentWindow;
		// var sidebardocument = unwrap(top.document.getElementById('sidebar').contentWindow.document.getElementById("createrequestBrowser").contentWindow.document);
		// sidebardocument.getElementById('save').onclick(checkSaveButtonClick(e));
	
	}
}

function checkSaveButtonClick(e) {
	// if click save, force "record" button to be "record"
	alert("click: " + e.target);
	alert("url: " + window.top.getBrowser().selectedBrowser.contentWindow.location.href);
	// remove listener
	// 
}

function getChar(e) {
	if (e.which === null) {
		alert(String.fromCharCode(e.keyCode));
	} else if (e.which !== 0 && e.charCode !== 0) {
		alert(String.fromCharCode(e.which));
	} else {
		return null;
	}
}

// function recordGetTextInput(e) {
//   alert("textinput: " + e.data;)
// }
function record_getInput(e) {
	//alert("latest input: " + e.target.value);
	latestInputContent = e.target.value;
	latestInputElementPath = readXPath(e.target);
}
// function recordGetPropertyChange(e) {  // for IE
//   if (e.propertyName.toLowerCase() == "value") {
//     alert("propertychange: " + e.srcElement.value);
//   }
// }

var removeOuterRedline = 1; //used for remove class
function wartisan_mouseover(e) {
	e = e || window.event;

	var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
	var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
	var uri = ios.newURI('chrome://createrequest/skin/style.css', null, null);
	sss.loadAndRegisterSheet(uri, sss.USER_SHEET);

	$mb('*', doc).removeClass("tcurrent");
	var test = $mb('.tcurrent', doc);
	if (test.length === 0) {
		//alert(doc);
	}

	// $mb('html',doc).removeClass("tcurrent");
	// alert(e.target);
	//  $mb(e.target,doc).addClass("tcurrent");
	if (removeOuterRedline > 1) {
		$mb(e.target, doc).addClass("tcurrent");
	}
	removeOuterRedline = removeOuterRedline + 1;

}

// when mouseover a verify step, highlight the element
function element_check_highlight(e) {}

// when mouseover an action step, highlight the element
function element_record_highlight(e) {}

// var myListener = {

//   onLocationChange: function(aProgress, aRequest, aURI) {
//     /*if (!aProgress.isLoadingDocument) {
//       //getSideBarBrowser().contentWindow.external.UpdateFSettings();
//       //
//     }*/
//     ///alert("444");
//   },
//   onStateChange: function(aProgress, aRequest, aFlag, aStatus) {
//     //if (aFlag & STATE_STOP) {
//     if (aFlag == STATE_PAGE_LOADED) {
//       var attributes = new Array();
//       dispatchClickMapEvent('clickMapUpdateEvent', attributes);

//     }
//     //alert("333");
//   },
//   onProgressChange: function(a, b, c, d, e, f) {},
//   onStatusChange: function(a, b, c, d) {},
//   onSecurityChange: function(a, b, c) {},
//   onLinkIconAvailable: function(a, b) {},
//   stateAnalyzer: function(abc) {
//     var the_State = '';
//     if (abc & 1) the_State += ' START<br>';
//     if (abc & 2) the_State += ' REDIRECTING<br>';
//     if (abc & 4) the_State += ' TRANSFERRING<br>';
//     if (abc & 8) the_State += ' NEGOTIATING<br>';
//     if (abc & 16) the_State += ' STOP<br>';
//     if (abc & 65536) the_State += ' IS_REQUEST<br>';
//     if (abc & 131072) the_State += ' IS_DOCUMENT<br>';
//     if (abc & 262144) the_State += ' IS_NETWORK<br>';
//     if (abc & 524288) the_State += ' IS_WINDOW<br>';
//     return the_State;
//   }
// };


// This function is called right when the sidebar is opened
function onLoadCreateRequestSidebar() {
	// In FF4.0, the call to get the addon version in the install.rdf is asynchronous
	// so we need to poll until the variable is set.
	//alert("opened");
	if (!window.createrequest.location) {
		//alert("no createrequest.location"); // no createreqeust.location
		getCreateRequestVersion();
	} else {
		//alert("there is createrequest.location");
	}

	//top.document.getElementById('sidebar').contentWindow.document.addEventListener("load", afterLoad(e), false);

	var callback = function () {
		if (window.createrequest.location) {
			//alert("2");
			clearInterval(window.createrequest.polling);
			LoadSideBarContent(window.createrequest.location);
		} else
			return false;
	};

	window.createrequest.polling = window.setInterval(callback, 500);
}

/* Attach myListener to the browser window once clickmapSidebar has loaded */

//window.addEventListener("load",registerMyListener,false);
//window.addEventListener("unload",unregisterMyListener,false);

window.onbeforeunload = function(){  
	unregisterClickListener();     
	unregisterRecordListener();
	document.removeEventListener("load", afterLoad(e), false);
	alert('unload');
}

function afterLoad(e) {
	alert('load0');
	//top.document.getElementById('sidebar').contentWindow.document.getElementById("record_button").label = "Record";
	alert('load1');
}



// Wei: below codes comes from https://code.google.com/p/fbug/source/browse/branches/firebug1.6/content/firebug/lib.js?spec=svn12950&r=8828#1332
function readXPath(element) {

	var paths = [];

	// Use nodeName (instead of localName) so namespace prefix is included (if any).
	for (; element && element.nodeType == 1; element = element.parentNode) {
		var index = 0;
		for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
			// Ignore document type declaration.
			if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
				continue;

			if (sibling.nodeName == element.nodeName)
				++index;
		}

		var tagName = element.nodeName.toLowerCase();
		var pathIndex = (index ? "[" + (index + 1) + "]" : "[1]");
		paths.splice(0, 0, tagName + pathIndex);
	}

	//var reuslt = paths.length ? "/" + paths.join("/") : null;
	//alert(result);
	return paths.length ? "/" + paths.join("/") : null;

}

function readCssPath(element) {
	// if (!(el instanceof Element)) {
	//   alert("not an element");
	//   return;
	// }
	var paths = [];

	for (; element && element.nodeType == 1; element = element.parentNode) {
		var selector = this.getElementCSSSelector(element);
		paths.splice(0, 0, selector);
	}

	return paths.length ? paths.join(" ") : null;
}

function getElementCSSSelector(element) {
	if (!element || !element.localName)
		return "null";

	var label = element.localName.toLowerCase();
	if (element.id)
		label += "#" + element.id;

	if (element.classList && element.classList.length > 0)
		label += "." + element.classList.item(0);

	return label;
}

function get_path(the_path_style, the_action_type) {

	registerSaveButtonListener();

	var xul_document = top.document.getElementById('sidebar').contentWindow.document;
	//alert(xul_document);

	path_style = the_path_style;
	action_type = the_action_type;

	$mb = jQuery.noConflict();
	doc = window.content.document;
	var wartisan_sidebar = top.document.getElementById('sidebar').contentWindow.document.getElementById("createrequestBrowser").contentWindow;
	var wdoc = wartisan_sidebar.document;
	var sidebardoc = unwrap(wdoc);

	if (isRecording(sidebardoc)) {
		alert("you are still recording actions, please stop first.");
		return;
	} else {  // can't handle properly when use stay in recording, and save, then re-load the sidebar
		xul_document.getElementById("record_button").label = "Record";
		stopRecording(sidebardoc);
	}

	var olElement = sidebardoc.getElementById("lupditem");
	var liElement = sidebardoc.createElement("li");

	updateStartingPage(sidebardoc);

	// if (!isStartPageSet) {
	//   startingPageUrl = content.document.URL;
	//   //alert(startingPageUrl);
	//   isStartPageSet = true;
	//   sidebardoc.getElementById("currentUrl").innerHTML = startingPageUrl;
	// }

	//if no click on right side, new textarea will not be appended on leftside.
	if ($mb("li", wdoc).length <= countClicks) { // true means we got a new update, to add into ui
		olElement.appendChild(liElement);
		var idnum = "inp" + $mb("li", wdoc).length; // the id for the inserted table
		var remnum = "rem" + $mb("li", wdoc).length; // the id for the remove icon
		var expandnum = "expand" + $mb("li", wdoc).length; // the step id for the expand/collapse icon
		var addnum = "add" + $mb("li", wdoc).length; // addx
		var stepDescriptionNum = "stepDes" + $mb("li", wdoc).length; // the test step description

		//  $mb("li:last",wdoc).html("<span style='display: inline-block; vertical-align: middle'><textarea style='width: 230px; height: 200px; max-height: 100px; min-width: 250px;min-height: 200px; max-width: 230px;margin-left:10px' id='"+idnum+"' name='"+idnum+"'></textarea></span><input style='width: 80px; height: 21px;margin-left:10px' type='button' value='Remove' id='"+remnum+"' name='"+remnum+"' />");
		$mb("li:last", wdoc).html("<b onclick=sectionClick('" + expandnum + "') class='step_description'><span><img src='images/collapse_15x15.png'/> </span> <span id='" + stepDescriptionNum + "''></span> <input style='width: 15px; height: 15px;background:url(images/delete_15x15.png) transparent; border:none;margin:0px 5px 0px 0px;cursor:pointer;' type='button' value='' id='" + remnum + "' name='" + remnum + "' /></b><div class='" + expandnum + "'><table style='display: inline-block; vertical-align: top' id='" + idnum + "' name='" + idnum + "'></table></div>");
		//$mb("#lupditem",wdoc).html("<textarea id='kika' style='width: 370px; height: 400px; min-width: 230px; max-width: 630px;'></textarea>");
		registerClickListener();

		$mb("input[id^='rem']", wdoc).click(function () {
			unregisterClickListener();
			$mb('*', doc).removeClass("tcurrent");
			var leng = $mb("li", wdoc).length; // how many li elements we got, each "VerifyText" textarea counts
			//alert("li elements = " + leng);
			//alert($mb(this, wdoc).attr("id").length); // 4
			//alert($mb(this, wdoc).attr("id")); // rem1
			var m = parseInt($mb(this, wdoc).attr("id").substr($mb(this, wdoc).attr("id").length - 1));
			var n = parseInt(m) - 1;
			var j = parseInt(m) + 1;
			//alert(n);
			$mb("li:eq(" + n + ")", wdoc).remove();
			if (m != leng) {
				for (var i = 0; i < leng - m; i++) {
					//$("#rem"+(j+i)).attr({id:"rem"+(m+i)});
					$mb("#rem" + (j + i), wdoc).attr("id", "rem" + (m + i));
					$mb("#rem" + (m + i), wdoc).attr("name", "rem" + (m + i));
					$mb("#inp" + (j + i), wdoc).attr("id", "inp" + (m + i));
					$mb("#inp" + (m + i), wdoc).attr({
						name : "inp" + (m + i)
					});
				}
			}

			event.stopPropagation();

		});
		$mb("input[id^='add']", wdoc).click(function () {
			alert("add");
			var tbId = parseInt($mb(this, wdoc).attr('id').substr($mb(this, wdoc).attr('id').length - 1));
			var tbElement = sidebardoc.getElementById("inp" + tbId);
			var rows = parseInt(tbElement.rows.length + 1);
			if (rows != 1) {
				//alert(rows);
				var trElement = "<tr><td><input type='text' value='input new attribute here'/></td><td><textarea style='max-height: 70px; min-width: 200px;min-height: 70px; max-width: 200px;' id='inp" + tbId + "_" + rows + "'></textarea></td></tr>";
				tbElement.innerHTML = tbElement.innerHTML + trElement;
			}
			event.stopPropagation();
		});

	}

}

function record_path(the_path_style, the_action_type) {

	path_style = the_path_style;
	action_type = the_action_type;
	actionsContent = new Array();
	registerSaveButtonListener();

	$mb = jQuery.noConflict();
	doc = window.content.document;
	var xul_document = top.document.getElementById('sidebar').contentWindow.document;
	var wartisan_sidebar = xul_document.getElementById("createrequestBrowser").contentWindow;
	var wdoc = wartisan_sidebar.document;
	var sidebardoc = unwrap(wdoc);

	var olElement = sidebardoc.getElementById("lupditem");
	
	updateStartingPage(sidebardoc);
	updateRecordStatus(sidebardoc);

	if (isRecording(sidebardoc)) {
		xul_document.getElementById("record_button").label = "Recording...";
		var liElement = sidebardoc.createElement("li");
		registerRecordListener();
		//loopCount = 1;
		wartisan_recordingHTML = '';
		hasSetStepGeneralInfor = false;
		actionLoopCount = 1;
		actionPropertyLoopCount = 1;

		// alert("pageUrl: " + content.document.URL);
		// alert("action: " + action_type);
		// alert("pathtype: " + path_style);
		actionsContent['pageUrl'] = content.document.URL;
		actionsContent['action'] = action_type;
		actionsContent['pathType'] = path_style;
		
	} else {
		xul_document.getElementById("record_button").label = "Record";
		stopRecording(sidebardoc);
		return;
	}

	// if (!isStartPageSet) {
	//   startingPageUrl = content.document.URL;
	//   //alert(startingPageUrl);
	//   isStartPageSet = true;
	//   sidebardoc.getElementById("currentUrl").innerHTML = startingPageUrl;
	// }

	//if no click on right side, new textarea will not be appended on leftside.
	if ($mb("li", wdoc).length <= countClicks) { // true means we got a new update, to add into ui
		olElement.appendChild(liElement);
		var idnum = "inp" + $mb("li", wdoc).length; // the id for the inserted table
		var remnum = "rem" + $mb("li", wdoc).length; // the id for the remove icon
		var expandnum = "expand" + $mb("li", wdoc).length; // the step id for the expand/collapse icon
		var addnum = "add" + $mb("li", wdoc).length; // addx
		var stepDescriptionNum = "stepDes" + $mb("li", wdoc).length; // the test step description

		//  $mb("li:last",wdoc).html("<span style='display: inline-block; vertical-align: middle'><textarea style='width: 230px; height: 200px; max-height: 100px; min-width: 250px;min-height: 200px; max-width: 230px;margin-left:10px' id='"+idnum+"' name='"+idnum+"'></textarea></span><input style='width: 80px; height: 21px;margin-left:10px' type='button' value='Remove' id='"+remnum+"' name='"+remnum+"' />");
		$mb("li:last", wdoc).html("<b onclick=sectionClick('" + expandnum + "') class='step_description'><span><img src='images/collapse_15x15.png'/> </span> <span id='" + stepDescriptionNum + "''></span> <input style='width: 15px; height: 15px;background:url(images/delete_15x15.png) transparent; border:none;margin:0px 5px 0px 0px;cursor:pointer;' type='button' value='' id='" + remnum + "' name='" + remnum + "' /></b><div class='" + expandnum + "'><table style='display: inline-block; vertical-align: top' id='" + idnum + "' name='" + idnum + "'></table></div>");
		//$mb("#lupditem",wdoc).html("<textarea id='kika' style='width: 370px; height: 400px; min-width: 230px; max-width: 630px;'></textarea>");
		//registerRecordListener();

		mySidebarDoc = top.document.getElementById('sidebar').contentWindow.document.getElementById("createrequestBrowser").contentWindow;
		mySidebarDoc = mySidebarDoc.document;
		mySidebarDoc = unwrap(mySidebarDoc);

		mySidebarDoc.getElementById("stepDes" + $mb("li", wdoc).length).innerHTML = "recorded actions...";

		$mb("input[id^='rem']", wdoc).click(function () {
			//unregisterRecordListener();
			$mb('*', doc).removeClass("tcurrent");
			var leng = $mb("li", wdoc).length; // how many li elements we got, each "VerifyText" textarea counts
			//alert("li elements = " + leng);
			//alert($mb(this, wdoc).attr("id").length); // 4
			//alert($mb(this, wdoc).attr("id")); // rem1
			var m = parseInt($mb(this, wdoc).attr("id").substr($mb(this, wdoc).attr("id").length - 1));
			var n = parseInt(m) - 1;
			var j = parseInt(m) + 1;
			//alert(n);
			$mb("li:eq(" + n + ")", wdoc).remove();
			if (m != leng) {
				for (var i = 0; i < leng - m; i++) {
					//$("#rem"+(j+i)).attr({id:"rem"+(m+i)});
					$mb("#rem" + (j + i), wdoc).attr("id", "rem" + (m + i));
					$mb("#rem" + (m + i), wdoc).attr("name", "rem" + (m + i));
					$mb("#inp" + (j + i), wdoc).attr("id", "inp" + (m + i));
					$mb("#inp" + (m + i), wdoc).attr({
						name : "inp" + (m + i)
					});
				}
			}

			event.stopPropagation();

		});

		$mb("input[id^='add']", wdoc).click(function () {
			alert("add");
			var tbId = parseInt($mb(this, wdoc).attr('id').substr($mb(this, wdoc).attr('id').length - 1));
			var tbElement = sidebardoc.getElementById("inp" + tbId);
			var rows = parseInt(tbElement.rows.length + 1);
			if (rows != 1) {
				//alert(rows);
				var trElement = "<tr><td><input type='text' value='input new attribute here'/></td><td><textarea style='max-height: 70px; min-width: 200px;min-height: 70px; max-width: 200px;' id='inp" + tbId + "_" + rows + "'></textarea></td></tr>";
				tbElement.innerHTML = tbElement.innerHTML + trElement;
			}
			event.stopPropagation();
		});

	}

}

// once select an element in main window, sidebar will create a text area
function clickReporter(e) {
	var wartisan_sidebar = top.document.getElementById('sidebar').contentWindow.document.getElementById("createrequestBrowser").contentWindow;
	var wdoc = wartisan_sidebar.document;

	$mb = jQuery.noConflict();

	countClicks = $mb("li", wdoc).length;

	e = e || window.event;
	//var xpath = readXPath(e.target);

	// Wei: "sidebar" is the default ID for FF sidebar
	// Wei: ID createrequestBrowser was defined in sidebar.xul
	mySidebarDoc = top.document.getElementById('sidebar').contentWindow.document.getElementById("createrequestBrowser").contentWindow;
	mySidebarDoc = mySidebarDoc.document;

	mySidebarDoc = unwrap(mySidebarDoc);

	var request_steps = mySidebarDoc.getElementById("inp" + $mb("li", wdoc).length); // get the element <span id="catchdetails"></span>
	//var stepDescriptionNum = "stepDes" + $mb("li", wdoc).length;
	var test_step_title = mySidebarDoc.getElementById("stepDes" + $mb("li", wdoc).length);
	var textareaId = "inp" + countClicks;
	var checkboxId = "ck" + countClicks;
	//alert("details: " + request_steps);

	if (!request_steps) {
		alert("Didn't find catch details");
	}

	// alert("nodeName: " + e.target.nodeName);
	// alert("tagName: " + e.target.tagName);


	// alert(theNodeDes);
	// alert("nodeValue: " + e.target.nodeValue);
	// alert("parentNode: " + e.target.parentNode);
	test_step_title.innerHTML = action_type + " " + checkElementDetails(e);

	// pringt all need information for right side browser.

	var wartisanHtml = '';
	var loopCount = 1;
	var style = '';

	if (action_type == "verify" || action_type == "search") {

		if (inner_content(e)) {

			for (var x in inner_content(e)) {
				if ((x === 'pageUrl') || (x === 'action') || (x === 'pathType') || (x === 'pathText') || (x === 'stepdesc')) {
					style = "style='display:none'";
					ifToCheck = "<td><input type='checkbox' checked='check' id='" + checkboxId + "_" + loopCount + "' /></td>";
				} else {
					style = '';
					ifToCheck = "<td><input type='checkbox' id='" + checkboxId + "_" + loopCount + "' /></td>";
				}

				wartisanHtml += "<tr " + style + ">" + ifToCheck + "<td>" + x + "</td><td><textarea class='change' id='" + textareaId + "_" + loopCount + "' style='max-height: 70px; min-width: 200px;min-height: 70px; max-width: 200px;'>" + inner_content(e)[x] + "</textarea></td></tr>";
				//alert("1" + wartisanHtml);
				loopCount++;

			}
		} else {
			var num = "rem" + $mb("input[id^='rem']", wdoc).size();
			alert("remove wrong step " + num.substr(3));
			$mb("input[id=" + num + "]", wdoc).click();
		}

		request_steps.innerHTML += wartisanHtml;

		//prevent click <a> tag and <img> tag
		var oTarget = e.target || e.srcElement; //???????????
		tagn = oTarget.tagName;
		if (tagn.toLowerCase() == "a" || tagn.toLowerCase() == "img") {

			if (e && e.preventDefault) {
				e.preventDefault();
			} else {

				window.event.returnValue = false;
			}

			unregisterClickListener();
			$mb('*', doc).removeClass("tcurrent");
			return false;
		} else {
			unregisterClickListener();
			$mb('*', doc).removeClass("tcurrent");
		}
	} else {
		alert("unknow action type: " + action_type);
	}

}

function record_clickReporter(e) {
	//var sscontent = new Array();

	var wartisan_sidebar = top.document.getElementById('sidebar').contentWindow.document.getElementById("createrequestBrowser").contentWindow;
	var wdoc = wartisan_sidebar.document;

	$mb = jQuery.noConflict();

	countClicks = $mb("li", wdoc).length;

	e = e || window.event;
	//var xpath = readXPath(e.target);

	// Wei: "sidebar" is the default ID for FF sidebar
	// Wei: ID createrequestBrowser was defined in sidebar.xul
	mySidebarDoc = top.document.getElementById('sidebar').contentWindow.document.getElementById("createrequestBrowser").contentWindow;
	mySidebarDoc = mySidebarDoc.document;
	mySidebarDoc = unwrap(mySidebarDoc);

	var request_steps = mySidebarDoc.getElementById("inp" + $mb("li", wdoc).length); // get the element <span id="catchdetails"></span>
	//var stepDescriptionNum = "stepDes" + $mb("li", wdoc).length;

	// this part is only done once in record_path(), since for recording, we are using one step description, contains many actions
	// var test_step_title = mySidebarDoc.getElementById("stepDes" + $mb("li", wdoc).length);
	// test_step_title.innerHTML = "recorded actions...";

	var textareaId = "inp" + countClicks;
	var checkboxId = "ck" + countClicks;
	//alert("details: " + request_steps);

	if (!request_steps) {
		alert("Didn't find catch details");
	}

	// alert("nodeName: " + e.target.nodeName);
	// alert("tagName: " + e.target.tagName);


	// alert(theNodeDes);
	// alert("nodeValue: " + e.target.nodeValue);
	// alert("parentNode: " + e.target.parentNode);
	

	// pringt all need information for right side browser.

	var style = '';

	// while (isRecording) {

	// }

	

	if (action_type == "action") {
		//alert("handling actions");
		//var xyz = catch_element_action_click(e);
		//catch_element_action_click(e);
		//alert("size: " + sizeof(actionsContent));
		//alert("action start");

		if (! hasSetStepGeneralInfor) {
			wartisan_recordingHTML = '';
			for (var x in actionsContent) {
				if ((x === 'pageUrl') || (x === 'action') || (x === 'pathType')) {
					style = "style='display:none'";
				//alert("action 2");
				} else {
					style = '';
				}
			//alert(actionLoopCount);
			//alert("tml:"+wartisan_recordingHTML);
				ifToCheck = "<td style='display:block'><input type='checkbox' checked='check' id='" + checkboxId + "_" + actionPropertyLoopCount + "' /></td>";
				//alert("xx");
				// wartisanHtml += "<tr " + style + ">" + ifToCheck + "<td>" + x + "</td><td><span> " + sscontent[x] + "</span><textarea style='display:block' class='change' id='" + textareaId + "_" + loopCount + "' style='max-height: 70px; min-width: 200px;min-height: 70px; max-width: 200px;'>" + sscontent[x] + "</textarea></td></tr>";
				wartisan_recordingHTML += "<tr " + style + ">" + ifToCheck + "<td>" + x + "</td><td id='" + textareaId + "_" + actionPropertyLoopCount + "'>" + actionsContent[x] + "</td></tr>";
				//alert(wartisan_recordingHTML);
				//alert(x + "_" + textareaId+"_"+loopCount);
				actionPropertyLoopCount++;
			}
			
			request_steps.innerHTML += wartisan_recordingHTML;
			wartisan_recordingHTML = '';
			hasSetStepGeneralInfor = true;
		}

		if (latestInputContent.length > 0 ) {
			//alert('there is something to input');
			for (var x in catch_element_input_content(e)) {
				if ( stringStartsWith(x,'pathText')  ) {
					style = "style='display:none'";
					//alert("action 2");
				} else {
					style = '';
				}
				//alert(actionLoopCount);
				//alert("tml:"+wartisan_recordingHTML);
				ifToCheck = "<td style='display:none'><input type='checkbox' checked='check' id='" + checkboxId + "_" + actionPropertyLoopCount + "' /></td>";
				//alert("xx");
				// wartisanHtml += "<tr " + style + ">" + ifToCheck + "<td>" + x + "</td><td><span> " + sscontent[x] + "</span><textarea style='display:block' class='change' id='" + textareaId + "_" + loopCount + "' style='max-height: 70px; min-width: 200px;min-height: 70px; max-width: 200px;'>" + sscontent[x] + "</textarea></td></tr>";
				wartisan_recordingHTML += "<tr " + style + ">" + ifToCheck + "<td>" + x + "</td><td id='" + textareaId + "_" + actionPropertyLoopCount + "'>" + actionContent[x] + "</td></tr>";
				//alert(wartisan_recordingHTML);
				//alert(x + "_" + textareaId+"_"+loopCount);
				actionPropertyLoopCount++;
			}
			latestInputContent = '';
		}

		for (var x in catch_element_action_click(e)) {
			if ( stringStartsWith(x,'pathText') || stringStartsWith(x,'actionType') ) {
				style = "style='display:none'";
				//alert("action 2");
			} else {
				style = '';
			}
			//alert(actionLoopCount);
			//alert("tml:"+wartisan_recordingHTML);
			ifToCheck = "<td style='display:none'><input type='checkbox' checked='check' id='" + checkboxId + "_" + actionPropertyLoopCount + "' /></td>";
			//alert("xx");
			// wartisanHtml += "<tr " + style + ">" + ifToCheck + "<td>" + x + "</td><td><span> " + sscontent[x] + "</span><textarea style='display:block' class='change' id='" + textareaId + "_" + loopCount + "' style='max-height: 70px; min-width: 200px;min-height: 70px; max-width: 200px;'>" + sscontent[x] + "</textarea></td></tr>";
			wartisan_recordingHTML += "<tr " + style + ">" + ifToCheck + "<td>" + x + "</td><td id='" + textareaId + "_" + actionPropertyLoopCount + "'>" + actionContent[x] + "</td></tr>";
			//alert(wartisan_recordingHTML);
			//alert(x + "_" + textareaId+"_"+loopCount);
			actionPropertyLoopCount++;
		}
//			loopCount++;

		
		request_steps.innerHTML += wartisan_recordingHTML;
		wartisan_recordingHTML = '';

		//prevent click <a> tag and <img> tag
		var oTarget = e.target || e.srcElement; //???????????
		tagn = oTarget.tagName;

		//unregisterRecordListener();
		$mb('*', doc).removeClass("tcurrent");

	} else {
		alert("unknown action type: " + action_type);
	}

}

// get action on the element
function catch_element_action_click(e) {
	e = e || window.event;
	actionContent = new Array();
	// sscontent['pageUrl'] = sscontent['pageUrl'] ? sscontent['pageUrl'] : content.document.URL;
	// sscontent['action'] = sscontent['action'] ? sscontent['action'] : action_type;
	// sscontent['pathType'] = sscontent['pathType'] ? sscontent['pathType'] : path_style;
	actionContent['stepdesc' + "_" + actionLoopCount] = action_type + " " + checkElementDetails(e) + " " + e.type;
	if (path_style == "xpath") {
		actionContent['pathText' + "_" + actionLoopCount] = readXPath(e.target);
	} else if (path_style == "csspath") {
		actionContent['pathText' + "_" + actionLoopCount] = readCssPath(e.target);
	} else {
		return false;
	}
	//alert(e.type);

	actionContent['actionType' + "_" + actionLoopCount] = e.type;
	// alert(e.type);
	// return sscontent;
	actionLoopCount++;
	return actionContent;
	// now just track the action
}

function catch_element_input_content(e) {
	e = e || window.event;
	actionContent = new Array();
	// sscontent['pageUrl'] = sscontent['pageUrl'] ? sscontent['pageUrl'] : content.document.URL;
	// sscontent['action'] = sscontent['action'] ? sscontent['action'] : action_type;
	// sscontent['pathType'] = sscontent['pathType'] ? sscontent['pathType'] : path_style;
	actionContent['stepdesc' + "_" + actionLoopCount] = action_type + " " + checkElementDetails(e) + " " + e.type;
	if (path_style == "xpath") {
		actionContent['pathText' + "_" + actionLoopCount] = latestInputElementPath;
	} else if (path_style == "csspath") {
		actionContent['pathText' + "_" + actionLoopCount] = latestInputElementPath;
	} else {
		return false;
	}
	//alert(e.type);

	actionContent['inputContent' + "_" + actionLoopCount] = latestInputContent;
	latestInputContent = '';
	// alert(e.type);
	// return sscontent;
	actionLoopCount++;
	return actionContent;
	// now just track the action
}

// get inner content of the element
function inner_content(e) {
	e = e || window.event;
	elementsContent = new Array();
	//current page Url
	elementsContent['pageUrl'] = content.document.URL;

	//current target xpath
	elementsContent['action'] = action_type;
	elementsContent['stepdesc'] = action_type + " " + checkElementDetails(e);
	if (path_style == "csspath") {
		//alert("report csspath");
		elementsContent['pathType'] = path_style;
		//alert(readCssPath(e.target));
		elementsContent['pathText'] = readCssPath(e.target);
		//alert("finish reading csspath");
	} else if (path_style == "xpath") {
		elementsContent['pathType'] = path_style;
		//alert(readXPath(e.target));
		elementsContent['pathText'] = readXPath(e.target);
	} else {
		//alert("unknow path style");
	}
	/*check if this target has child nodes.*/
	var haschild = $mb(e.target, doc).children();
	var inlineEle = "";
	haschild.each(function () {
		inlineEle += this.tagName + ",";
	});
	var inlineArr = inlineEle.split(",");

	var inlineBase = "a,abbr,acronym,b,bdo,big,br,cite,code,dfn,em,font,i,img,input,kbd,label,q,s,samp,select,small,span,strike,strong,sub,sup,textarea,tt,u,var";
	//check if inner ele is inline elements.
	var inlineLength = inlineArr.length;
	var childLength = 0;
	for (var i = 0; i < inlineLength; i++) {
		var isFound = inlineBase.indexOf(inlineArr[i].toLowerCase() + ",");

		if (isFound < 0) {
			childLength++;
		} else {
			//break;
		}
	}

	/*check if this target has child nodes.*/
	// if has child tags and child tags containing non-inline elements
	if ((haschild.length > 0) && (childLength > 0)) {

		//   sscontent["verifyText"] = 'has inner element';
		alert('Your selection contains inner element, please select more specifically.');
		return false;

	}
	//
	else {
		//            /* if content containing <br>, split it into two parts.*/
		//            var rawContent = $mb(e.target,doc).find('br');
		//            if (rawContent.length > 0){
		//                var regex = /<br\s*[\/]?>/gi;
		//                var rawHtml = $mb(e.target,doc).html();
		//                var splitHtml = rawHtml.split(regex);
		//                var splitLength = splitHtml.length;
		//                for ( var i = 0; i< splitLength; i++ ){
		//                    sscontent["verifyText_"+i] = splitHtml[i].replace(/(<([^>]+)>)/ig,"");
		//                }
		//
		//            }
		//            else {
		var rawContent = $mb(e.target, doc).text();

		var finalContent = String(rawContent).replace(/^\s+|\s+$/g, '');

		if (finalContent.length === 0) {
			elementsContent["verifyText"] = "#n/a#";

		} else {
			elementsContent["verifyText"] = finalContent;
			//alert("content=" + finalContent);
		}

		//            }

		/*end check <br>*/

		var tagName = $mb(e.target, doc).prop("tagName").toUpperCase();
		//alert(tagName);
		//check targets tagname
		switch (tagName) {
		case "IMG":
			var properties = GetAttributes(e.target);
			for (var x in properties) {
				elementsContent[tagName + "_" + x] = properties[x]; // IMG_src, IMG_alt, etc.
			}

			elementsContent["tagname"] = tagName;

			//if this image is a link;
			var isLink = $mb(e.target, doc).parent().prop("tagName").toUpperCase();
			if (isLink == "A") {
				var linkProperties = GetAttributes(e.target.parentNode);

				for (var y in linkProperties) {

					elementsContent[isLink + "_" + y] = linkProperties[y];

				}
			}
			break;

		case "SPAN":
			var properties = GetAttributes(e.target);
			for (x in properties) {
				elementsContent[tagName + "_" + x] = properties[x]; // IMG_src, IMG_alt, etc.
			}

			elementsContent["tagname"] = tagName;

			//if this image is a link;
			isLink = $mb(e.target, doc).parent().prop("tagName").toUpperCase();
			if (isLink == "A") {
				var linkProperties = GetAttributes(e.target.parentNode);

				for (var yy in linkProperties) {

					elementsContent[isLink + "_" + yy] = linkProperties[yy];

				}
			}
			break;

		case "A":
			var linkAttrs = GetAttributes(e.target);
			for (var ii in linkAttrs) {
				elementsContent["linproperty_" + ii] = linkAttrs[ii];

			}
			break;

		default:
			var hasAtag = $mb(e.target, doc).find('a');
			var AtagLength = hasAtag.length;
			if (AtagLength > 0) {
				hasAtag.each(function (index) {
					elementsContent["linkcontent_" + index] = $mb(this, doc).text();
					//  sscontent["linklocation_"+index] = $mb(e.target,doc).find('a')[index];
					var linkAttrs = GetAttributes($mb(e.target, doc).find('a')[index]);
					for (var i in linkAttrs) {
						elementsContent["linproperty_" + i + "_" + index] = linkAttrs[i];

					}
					//
					//                           sscontent['link']['content'] = $mb(this,doc).text();
					//                           var linkAttrs = GetAttributes($mb(e.target,doc).find('a')[index]);
					//                           for( var i in linkAttrs) {
					//                                sscontent['link'][i] = linkAttrs[i];
					//
					//                            }
				});

			}
		}

	}

	//    var textContent = fullContent.replace(/(<([^>]+)>)/ig,"");


	return elementsContent;
}

function GetAttributes(att) {
	var instElement = att.attributes;
	var Properties = {};
	for (var attr in instElement) {
		// only need 5 attrs for now: src, value, alt, target,
		if ((instElement[attr].value === undefined) || (instElement[attr].name != 'src') && (instElement[attr].name != 'value') && (instElement[attr].name != 'alt') && (instElement[attr].name != 'href') && (instElement[attr].name != 'target')) {
			delete instElement[attr]; //firefox true
		} else {

			//var Everypro ="\"" + instElement[attr].name + "\"" + ":\"" + instElement[attr].value + "\"";
			Properties[instElement[attr].name] = instElement[attr].value;
			//Properties.push(Everypro);
		}
	}
	return Properties;
	// || (instElement[attr].name != 'src') || (instElement[attr].name != 'href') || (instElement[attr].name != 'alt') || (instElement[attr].name != 'value')
}

// function modalWin(edit_id) {
//   var wartisan_sidebar = top.document.getElementById('sidebar').contentWindow.document.getElementById("createrequestBrowser").contentWindow;
//   var wdoc = wartisan_sidebar.document;
//   var sidebardoc = unwrap(wdoc);

//   alert(sidebardoc);

//   var a = new Array;
//    a[0] = 1;
//    a[1] = 4;
//   if (window.showModalDialog) {
//     alert("step " + edit_id.substr(4) + ":");
//     var r = top.document.getElementById('sidebar').contentWindow.showModalDialog("http://localhost/wartisan/request_step.php", a,
//       "dialogWidth:455px;dialogHeight:550px;resizable:yes");
//     //alert("modalWindow: " + window.document.getElementById("333"));
//     alert(r);
//     var xxx = top.document.getElementById('sidebar').contentWindow.document.getElementById("333");

//     sdiebardoc.getElementById('foo').textContent = r;
//     xxx.getElementById('test').innerHTML = "Hello";
//     $("#test").innerHTML = "Hello";
//   } else {
//     alert("modal window not supported");
//   }


//   //modalWinDocument = top.document.getElementById(edit_id).contentWindow.document;

//   alert("2 wartisan_doc: " + wdoc);
//   //modalWinDocument = top.document.getElementById("sidebar").contentWindow.document.getElementById("createrequestBrowser").contentWindow.document.getElementById("333");
//   modalWindowDocument = modalWindow.document.getElementById("333");
//   alert("3 modalWinDocument: " + modalWindow);
//   modalWinDocument.getElementById('w_title1').innerHTML = "<p>hello</p>";
//   // alert(3);
//   alert(modalWinDocument);
//   // alert(4);
// }

// sample parent.html
// <html>
// <head>
// <script>
// function openModal()
// {
//   var a = new Array;
//   a[0] = 1;
//   a[1] = 4;

//   var r = window.showModalDialog('http://developer.mozilla.org/samples/domref/showModalDialogBox.html',
//       a, "dialogwidth: 450; dialogheight: 300; resizable: yes");
//   document.getElementById('foo').textContent = r;
//   alert(r);
// }
// </script>
// </head>

// <body>
// <input type="button" value="Open modal dialog" onclick="openModal();">
// <div>
// <p>Modal dialog return value:</p>
// <p id="foo">
// </div>
// </body>
// </html>

// Sample child.html
// <html>
// <body>
// <script>
// document.write("Modal dialog got argument: " + window.dialogArguments);
// </script>
// <input id="foo" type="text" value="Dialog value...">
// <input type="button" value="Close" onclick="window.returnValue = document.getElementById('foo').value; window.close();">
// <a href="safe.html">link</a>
// </body>
// </html>

function checkElementDetails(e) {
	switch (e.target.nodeType) {
	case 1:
		//alert(e.target.nodeName);
		theNodeDes = "Element " + checkElementNodeName(e);
		break;
	case 2:
		theNodeDes = "Attr " + e.target.nodeName;
		break;
	case 3:
		theNodeDes = "Text " + e.target.nodeName;
		break;
	case 4:
		theNodeDes = "CDATASection " + e.target.nodeName;
		break;
	case 5:
		theNodeDes = "EntityReference " + e.target.nodeName;
		break;
	case 6:
		theNodeDes = "Entity " + e.target.nodeName;
		break;
	case 7:
		theNodeDes = "ProcessingInstruction " + e.target.nodeName;
		break;
	case 8:
		theNodeDes = "Comment " + e.target.nodeName;
		break;
	case 9:
		theNodeDes = "Document " + e.target.nodeName;
		break;
	case 10:
		theNodeDes = "DocumentType " + e.target.nodeName;
		break;
	case 11:
		theNodeDes = "DocumentFragment " + e.target.nodeName;
		break;
	case 12:
		theNodeDes = "Notation " + e.target.nodeName;
		break;
	default:
		theNodeDes = "Unknown type " + e.target.nodeName;
	}
	return theNodeDes;
}

function checkElementNodeName(e) {
	switch (e.target.nodeName) {
	case "A":
		return "link " + getElementDescription(e.target);
	case "P":
		return "paragraph";
	case "IMG":
		return "image " + getElementDescription(e.target);
	case "DIV":
		return "div";
	case "B":
		return "bold text";
	case "I":
		return "italic text";
	case "INPUT":
		// temp_result = e.target.getAttribute("id") ? e.target.getAttribute("id") : (e.target.getAttribute("value") ? e.target.getAttribute("value") : "");
		// temp_result = "input " + temp_result;
		return "input " + getElementDescription(e.target);
	case "BUTTON":
		return "button " + getElementDescription(e.target);
	case "H1":
		return "h1";
	default:
		//alert("node name not defined: " + e.target.nodeName);
		return e.target.nodeName;
	}
}

function getElementDescription(ele) {
	return ele.getAttribute("id") ? ele.getAttribute("id") : (
		ele.getAttribute("name") ? ele.getAttribute("name") : (
			ele.getAttribute("value") ? ele.getAttribute("value") : (
				ele.getAttribute("title") ? ele.getAttribute("title") : (
					ele.getAttribute("alt") ? ele.getAttribute("alt") : (
						ele.getAttribute("href") ? ele.getAttribute("href") : (
							ele.getAttribute("src") ? ele.getAttribute("src") : ""
						)
					)
				)
			)
		)
	);
}

function showHelp() {
	window.showModalDialog('http://www.wartisan.com', 'help_window', 'dialogWidth=200px;dialogHeight=100px;resizable=yes');
}

function updateStartingPage(doc) {
	if ((doc.getElementById("isStartPageSet").innerHTML == "no")) {
		//alert("not set yet");
		startingPageUrl = content.document.URL;
		doc.getElementById("currentUrl").innerHTML = startingPageUrl;
		doc.getElementById("isStartPageSet").innerHTML = "yes";
	} else {
		//alert("already set");
	}
}

function updateRecordStatus(doc) {
	if ((doc.getElementById("isRecording").innerHTML == "no")) {
		//alert("not set yet");
		doc.getElementById("isRecording").innerHTML = "yes";
		actionLoopCount = 1;
	} else {
		doc.getElementById("isRecording").innerHTML = "no";
	}
}

function isRecording(doc) {

	if ((doc.getElementById("isRecording").innerHTML == "no")) {
		//alert("not set yet");
		return false;
	} else {
		return true;
	}
}

function stopRecording(doc) {
	unregisterRecordListener();
	doc.getElementById("isRecording").innerHTML = "no";
	actionLoopCount = 1;
}

function stringStartsWith(x, y) {
	return x.slice(0, y.length) == y;
}

function stringEndsWith(x, y) {
	return x.slice(-y.length) == y;
}
