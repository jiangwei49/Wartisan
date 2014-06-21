//the integer-value for the flag representing the end of the main page browser load
//Wei: didn't figure out how to use below three constants, keep for now

// const STATE_PAGE_LOADED = 786448; //STATE_STOP, STATE_IS_NETWORK, and STATE_IS_WINDOW flags
// const NOTIFY_STATE_DOCUMENT =
// 	Components.interfaces.nsIWebProgress.NOTIFY_STATE_DOCUMENT;
// const STATE_STOP =
// 	Components.interfaces.nsIWebProgressListener.STATE_STOP;

// The Global CreateRequest Sidebar Object
var mySidebar; // sidebar
var mySidebarDocument; // sidebar contentwindow.document - xul
var mySidebarBrowser; // sidebar browser - php
var mySidebarBrowserDocument; // the php document
//var mainWindow;
var $mb = jQuery.noConflict();
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
//var isListeningSidebarDoc = false;
var hasSetStepGeneralInfor = false;
var wartisan_recordingHTML;
var latestInputContent = '';
var latestInputElementPath = '';
var isRecording = false;

var treeChildren; // step row

function S_xmlhttprequest() {
	if (window.ActiveXObject) {
		xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
	} else if (window.XMLHttpRequest) {
		xmlHttp = new XMLHttpRequest();
	}
}

function getSideBar() {
	if (!mySidebar) {
		mySidebar = top.document.getElementById('sidebar');
	}
	return mySidebar;
}

function getSideBarDocument() {
	if (!mySidebarDocument) {
		if (!mySidebar) {
			getSideBar();
		}
		mySidebarDocument = unwrap(mySidebar.contentWindow.document); // the xul!!!
	}
	return mySidebarDocument;
}

function getSideBarBrowser() {
	if (!mySidebarBrowser) {
		mySidebarBrowser = getSideBar().contentWindow.document.getElementById("createrequestBrowser");
	}
	return mySidebarBrowser;
}

function getSideBarBrowserDocument() {
	if (!mySidebarBrowserDocument) {
		alert('mySidebarBrowserDocument not defined');
		mySidebarBrowserDocument = unwrap(getSideBarBrowser().contentWindow.document); // the PHP!
	}
	//alert(mySidebarBrowserDocument);
	return mySidebarBrowserDocument;
}

// Load a url in the content window.
function LoadSideBarContent(url) {
	getSideBarBrowser().webNavigation.loadURI(url, 0, null, null, null);
}

function registerClickListener() {
	//alert("register click listener");
	// Wei: myListener is from ClickMap
	//alert("registerMyListener1: "+top.getBrowser());
	//top.getBrowser().addProgressListener(myListener, NOTIFY_STATE_DOCUMENT);
	// Wei: clickReporter is used for Create Request
	top.getBrowser().addEventListener("click", clickReporter, false);
	top.getBrowser().addEventListener("mouseover", wartisan_mouseover, false);
	//alert("registerMyListener2: "+top.getBrowser());
}

function unregisterClickListener() {
	//alert('unregister click listener');
	removeSelectionClass();
	removeDetectionClass();
	try {
		top.getBrowser().removeEventListener("click", clickReporter, false);
		top.getBrowser().removeEventListener("mouseover", wartisan_mouseover, false);
		//alert("unregisterMyListener2: "+top.getBrowser());
	} catch (ex) {}
}

function registerRecordListener() {
	//alert('register record listener');
	top.getBrowser().addEventListener("input", record_getInput, false); //firefox
	top.getBrowser().addEventListener("click", record_clickReporter, false);
	//top.getBrowser().addEventListener("onpropertychange", recordGetPropertyChange, false);
}

function unregisterRecordListener() {
	removeSelectionClass();
	removeDetectionClass();
	//alert('unregister record listener');
	// top.getBrowser().removeEventListener("textinput", recordGetTextInput, false);
	top.getBrowser().removeEventListener("input", record_getInput, false);
	top.getBrowser().removeEventListener("click", record_clickReporter, false);
	//top.getBrowser().removeEventListener("onpropertychange", recordGetPropertyChange, false);
}

// function registerSaveButtonListener() {
// 	if (isListeningSidebarDoc) {} else {
// 		isListeningSidebarDoc = true;
// 		alert("sidebarDocListener loaded");
// 		//var wartisan_sidebar = top.document.getElementById('sidebar').contentWindow.document.getElementById("createrequestBrowser").contentWindow;
// 		// var sidebardocument = unwrap(top.document.getElementById('sidebar').contentWindow.document.getElementById("createrequestBrowser").contentWindow.document);
// 		// sidebardocument.getElementById('save').onclick(checkSaveButtonClick(e));

// 	}
// }

function getChar(e) {
	if (e.which === null) {
		alert("to do: " + String.fromCharCode(e.keyCode));
	} else if (e.which !== 0 && e.charCode !== 0) {
		alert("to do: " + String.fromCharCode(e.which));
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

	var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                   .getInterface(Components.interfaces.nsIWebNavigation)
                   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                   .rootTreeItem
                   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                   .getInterface(Components.interfaces.nsIDOMWindow);
      //alert(mainWindow.content.location.href);
	var doc = mainWindow.getBrowser().selectedBrowser.contentWindow.document;

	var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
	var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
	var uri = ios.newURI('chrome://createrequest/skin/style.css', null, null);
	sss.loadAndRegisterSheet(uri, sss.USER_SHEET);

	removeSelectionClass();
	var test = $mb('.tcurrent', doc);
	if (test.length === 0) {
		//alert(doc);
	}

	// $mb('html',doc).removeClass("tcurrent");
	// alert(e.target);
	//  $mb(e.target,doc).addClass("tcurrent");
	//if (removeOuterRedline > 1) {
		$mb(e.target, doc).addClass("tcurrent");
	//}
	//removeOuterRedline = removeOuterRedline + 1;

}

// when mouseover a verify step, highlight the element
function element_check_highlight(e) {}

// when mouseover an action step, highlight the element
function element_record_highlight(e) {}


// This function is called right when the sidebar is opened
// function onLoadCreateRequestSidebar() {
// 	if (!window.createrequest.location) {
// 		getCreateRequestLocation();
// 	} else {
// 		//alert("there is createrequest.location");
// 	}

// 	var callback = function() {
// 		if (window.createrequest.location) {
// 			//alert("2");
// 			clearInterval(window.createrequest.polling);
// 			LoadSideBarContent(window.createrequest.location);
// 		} else
// 			return false;
// 	};

// 	window.createrequest.polling = window.setInterval(callback, 500);
// }

/* Attach myListener to the browser window once clickmapSidebar has loaded */

//window.addEventListener("load",registerMyListener,false);
//window.addEventListener("unload",unregisterMyListener,false);

window.beforeunload = function() {
	unregisterClickListener();
	unregisterRecordListener();
	document.removeEventListener("load", afterLoad(e), false);
	alert('unload');
};

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

	//registerSaveButtonListener();
	treeChildren = null;
	path_style = the_path_style;
	action_type = the_action_type;

	//var doc = window.content.document;
	var wdoc = getSideBarDocument();
	var sidebardoc = unwrap(wdoc);
	updateStartingPage(sidebardoc);
	// alert(sidebardoc);
	// alert("sidebardoc="+sidebardoc);
	//updateStartingPage(sidebardoc);
	unregisterRecordListener();
	registerClickListener();
}

function record_path(the_path_style, the_action_type) {
	treeChildren = null;
	path_style = the_path_style;
	action_type = the_action_type;

	var xul_document = top.document.getElementById('sidebar').contentWindow.document;
	var sidebardoc = unwrap(xul_document);

	updateStartingPage(sidebardoc);
	updateRecordStatus();

	//alert(isRecording);

	if (isRecording) {
		G_ApplicationState = K_RECORDING_CASE;
		updateInterface();
		//var liElement = sidebardoc.createElement("li");
		//alert('regiter record listener...');
		unregisterClickListener();
		registerRecordListener();

		// to start recording, we first prepare the parent row
		var treeUpperItem = createUpperTreeItem();
		appendToTreeChildren(treeUpperItem);
		var x1 = createTreeRow();
		// x1.setAttribute("rowType", "recording");
		// x1.setAttribute("container", "yes");
		var y1 = createTreeCell("label", "Recording");
		treeUpperItem.appendChild(x1);
		x1.appendChild(y1);
		treeChildren = treeChildren ? treeChildren : createTreeChildren();
		treeUpperItem.appendChild(treeChildren);
		//alert('table updated?');

	} else {
		G_ApplicationState = K_STARTUP;
		updateInterface();
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

}

// once select an element in main window, sidebar will create a text area
function clickReporter(e) {
	var wdoc = getSideBarDocument();
	//alert("wdoc=" + wdoc);
	var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                   .getInterface(Components.interfaces.nsIWebNavigation)
                   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                   .rootTreeItem
                   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                   .getInterface(Components.interfaces.nsIDOMWindow);
      //alert(mainWindow.content.location.href);
  var doc = unwrap(mainWindow.getBrowser().selectedBrowser.contentWindow.document);

	//countClicks = $mb("li", wdoc).length;

	e = e || window.event;
	//var xpath = readXPath(e.target);

	// Wei: "sidebar" is the default ID for FF sidebar
	// Wei: ID createrequestBrowser was defined in sidebar.xul
	var treeUpperItem = createUpperTreeItem();
	appendToTreeChildren(treeUpperItem);
	var x1 = createTreeRow();
	// x1.setAttribute("rowType", action_type);
	// x1.setAttribute("container", "yes");
	var y1;
	if (path_style == "csspath") {
		y1 = createTreeCell("label", "search " + readCssPath(e.target));
	} else {
		// path_style is xpath
		y1 = createTreeCell("label", "verify " + readXPath(e.target));
	}
	//var y2 = createTreeCell("label", readXath(e.target))
	treeUpperItem.appendChild(x1);
	x1.appendChild(y1);
	//x1.appendChild(y2);
	treeChildren = treeChildren ? treeChildren : createTreeChildren();
	treeUpperItem.appendChild(treeChildren);

	//alert('table updated?');

	//var mySidebarDoc = unwrap(wdoc);

	//test_step_title.innerHTML = action_type + " " + checkElementDetails(e);

	// pringt all need information for right side browser.

  // prevent cicks on a or image tags
	var oTarget = e.target || e.srcElement; //???????????
	tagn = oTarget.tagName;
	if (tagn.toLowerCase() == "a" || tagn.toLowerCase() == "img") {
		if (e && e.preventDefault) {
			e.preventDefault();
		} else {
			window.event.returnValue = false;
		}
		removeSelectionClass();
		unregisterClickListener();
	} else {
		removeSelectionClass();
		unregisterClickListener();
	}
	

	var wartisanHtml = '';
	var loopCount = 1;
	var style = '';

	//alert('check inner content');

	var element_inner_content = inner_content(e);

	if(element_inner_content) {
		for (var x in element_inner_content) {
			if ((x === 'pageUrl') || (x === 'action') || (x === 'pathType') || (x === 'pathText') || (x === 'stepdesc')) {
				// style = "style='display:none'";
				// ifToCheck = "<td><input type='checkbox' checked='check' id='" + checkboxId + "_" + loopCount + "' /></td>";
				// alert('nothing special');
			} else {
				// alert(x);
				// alert(x +" -- "+ element_inner_content[x]);

				var y2 = createTreeItem();
				treeChildren.appendChild(y2);
				var z2 = createTreeRow();
				// z2.setAttribute("rowType", action_type);
				// z2.setAttribute("container", "no");
				var z21 = createTreeCell("label", x);
				var z22 = createTreeCell("label", element_inner_content[x]);
				y2.appendChild(z2);
				z2.appendChild(z21);
				z2.appendChild(createTreeCell("label", "contains"));
				z2.appendChild(z22);
			}
			//alert("1" + wartisanHtml);
			//loopCount++;
		}
	} else {
		$mb('*', doc).removeClass("tcurrent");
	}

	//request_steps.innerHTML += wartisanHtml;
	//alert('remove click listener');

}

function record_clickReporter(e) {

	var wdoc = getSideBarDocument(); // the xul

	// $mb = jQuery.noConflict();
	// countClicks = $mb("li", wdoc).length;

	e = e || window.event;
	//var xpath = readXPath(e.target);

	// Wei: "sidebar" is the default ID for FF sidebar
	// Wei: ID createrequestBrowser was defined in sidebar.xul
	var mySidebarDoc = unwrap(wdoc);

	var style = '';

	var z2, z21, z22;
	if (latestInputContent.length > 0) {
		var y2 = createTreeItem();
		treeChildren.appendChild(y2);

		z2 = createTreeRow();
		// z2.setAttribute("rowType", "recording");
		// z2.setAttribute("container", "no");
		z21 = createTreeCell("label", "to input");
		z22 = createTreeCell("label", latestInputElementPath);
		
		y2.appendChild(z2);
		z2.appendChild(z21);
		z2.appendChild(createTreeCell("label", latestInputContent));
		// alert(latestInputContent);
		z2.appendChild(z22);

		latestInputContent = "";
	}
	var y2 = createTreeItem();
	treeChildren.appendChild(y2);

	z2 = createTreeRow();
	// z2.setAttribute("rowType", "recording");
	// z2.setAttribute("container", "no");
	z21 = createTreeCell("label", "to click");
	z22 = createTreeCell("label", readXPath(e.target));
	y2.appendChild(z2);
	z2.appendChild(z21);
	z2.appendChild(createTreeCell("label", "_"));
	z2.appendChild(z22);


}

// get inner content of the element
function inner_content(e) {
	e = e || window.event;
	elementsContent = new Array();
	//current page Url
	
	var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                   .getInterface(Components.interfaces.nsIWebNavigation)
                   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                   .rootTreeItem
                   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                   .getInterface(Components.interfaces.nsIDOMWindow);
      //alert(mainWindow.content.location.href);
  var doc = unwrap(mainWindow.getBrowser().selectedBrowser.contentWindow.document);

	/*check if this target has child nodes.*/
	var haschild = $mb(e.target, doc).children();
	var inlineEle = "";
	haschild.each(function() {
		inlineEle += this.tagName + ",";
	});
	//alert('inline_elements:' + inlineEle);
	var inlineArr = inlineEle.split(",");

	var inlineBase = "a,abbr,acronym,b,bdo,big,blockquote,br,center,cite,code,dfn,dir,div,dl,em,fieldset,font,form,h1,h2,h3,h4,h5,h6,hr,i,img,input,kbd,label,menu,q,s,samp,select,small,span,strike,strong,sub,sup,textarea,tt,u,var";
	//check if inner ele is inline elements.
	var inlineLength = inlineArr.length;
	var childLength = 0;
	for (var i = 0; i < inlineLength; i++) {
		var isFound = inlineBase.indexOf(inlineArr[i].toLowerCase() + ",");

		if (isFound > 0) {
			childLength++;
		} else {
			//break;
		}
	}

// to do
// 	var items = startElem.getElementsByTagName("*");
// for (var i = items.length; i--;) {
//     //do stuff
// }

	//alert("childLength="+childLength);

	/*check if this target has child nodes.*/
	// if has child tags and child tags containing non-inline elements
	if ((haschild.length > 0) && (childLength > 0)) {

		//   sscontent["verifyText"] = 'has inner element';
		alert('Your selection contains inner element, please narrow down your selection.');
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
			elementsContent["verifyText"] = "#n/a#";  // empty text content
		} else {
			elementsContent["verifyText"] = finalContent; // text content
		}

		/*end check <br>*/

		var tagName = $mb(e.target, doc).prop("tagName").toUpperCase();
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
					hasAtag.each(function(index) {
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

function login() {
	if (G_ApplicationState < K_LOGGED_ON) {
		//alert('log in');
		openLoginWindow();
	} else {
		// log out
		logout();
	}
}

function logout() {
	G_ApplicationState = K_NOT_LOGGED_ON;
	userName = null;
	unregisterClickListener();
	unregisterRecordListener();
	// to do - need to clear the content since user logged out
	mySidebarDocument.getElementById("status-text").setAttribute("label", "Logged out.");
	updateInterface();
	clearContent();
}

function updateStartingPage(wdoc) {
	if (wdoc.getElementById("startPage").value == "...start testing from ...") {
		//only update when it is not set yet
		setStartPage();
		//alert('startPage set to ' + startPage);
	}
}

function updateRecordStatus(doc) {
	isRecording = !isRecording;
}

function stopRecording(doc) {
	//actionLoopCount = 1;
	//isRecording = false;
	treeChildren = null;
	unregisterRecordListener();
}

function removeSelectionClass() {
	var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                   .getInterface(Components.interfaces.nsIWebNavigation)
                   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                   .rootTreeItem
                   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                   .getInterface(Components.interfaces.nsIDOMWindow);
      //alert(mainWindow.content.location.href);
	var doc = mainWindow.getBrowser().selectedBrowser.contentWindow.document;

	$mb('*', doc).removeClass("tcurrent");
}

