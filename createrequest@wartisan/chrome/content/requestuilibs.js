/**
(c) Wartisan 2014
$Author: weijiang $ $Revision: #2 $
$Date: 2014/02/10 $
**/

var K_NOT_LOGGED_ON = 0; // not logged in
var K_LOGGED_ON = 1;
var K_STARTUP = 2; // user logged in
var K_NEW_CASE = 3; // create a new case
var K_LOAD_CASE = 4; // load an existing case
var K_SAVE_CASE = 5; // saved a case, back to K_STARTUP
var K_RECORDING_CASE = 6;

var G_ApplicationState = K_NOT_LOGGED_ON;
//var server = "10.162.138.201";
//var server = "10.162.139.41";

//var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
//alert(prefManager.getCharPref("extensions.createrequest.server"));

var server = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch).getCharPref("extensions.createrequest.server");
//getSideBarDocument().getElementById("contentIFrame").loadURI("http://" + server + "/requestui/home.html");
getSideBarDocument().getElementById("contentIFrame").setAttribute("src", "http://" + server + "/requestui/home.html");
//alert(xyz);
//alert(server);
var userName;
var password;
var startPage;
var requestId = "";

function openLoginWindow() {
    var lWindow = window.openDialog("login.xul", "LOGON", "chrome,modal,centerscreen", setUNPW);
    if ((userName !== null) && (password !== null)) {
        doLogin(userName, password);
        // doLogin('bugsbunny', 'wabbit');
    }
    //userName = null;
    password = null;
}

function setUNPW(uN, pW) {
    userName = uN;
    password = pW;
}

function doLogin(uN, pW) {
    try {
        var theArgs = new Array();
        //theArgs = "un=" + uN + "&" + "pd=" + pW; 
        // theArgs[0] = new commandArg("un", document.getElementById("userName").value);
        // theArgs[1] = new commandArg("pd", document.getElementById("password").value);
        theArgs[0] = new commandArg("un", uN);
        theArgs[1] = new commandArg("pd", pW);
        lastCommand = "login";
        dump("Loggin in with uname and pw = " + theArgs[0].value + "," + theArgs[1].value + "\n");
        doServerRequest("login", theArgs);
    } catch (e) {
        alert("doLogin exception: " + e);
    }
}

var theServerRequest;
var commandArg;

function doServerRequest(commandString, commandArgs) {
    theServerRequest = new XMLHttpRequest();
    var theString = "http://" + server + "/doCommand.php?" + "command=" + commandString + "&";
    for (var i = 0; i < commandArgs.length; i++) {
        theString += commandArgs[i].key + "=" + commandArgs[i].value;
        if (i != (commandArgs.length - 1)) theString += "&";
    }
    alert("to do: " + theString);
    theServerRequest.onreadystatechange = retrieveServerResponse;
    theServerRequest.open("GET", theString, true);
    dump("About to send " + theString + "\n");
    theServerRequest.send(null);
}

function retrieveServerResponse() {
    try {
        dump("server response ready state = " + theServerRequest.readyState + "\n");

        if (theServerRequest.readyState == 4) { // all done
            dump("Server request stauts = " + theServerRequest.status + "\n");

            if (theServerRequest.status == 200) {
                dump("Received from server: " + theServerRequest.responseText + "\n");
                //alert("Response is " + theServerRequest.responseText);
                var theResults = theServerRequest.responseText.split(",");
                var rCode = (theResults[0].substring((theResults[0].indexOf("=") + 1),
                    theResults[0].length)).toLowerCase();
                //alert("rCode: " + rCode);

                if (lastCommand == "login") {
                    if (rCode == "true") {
                        var lastSession = "last login was ";
                        lastSession += (theResults[1].substring((theResults[1].indexOf("=") + 1),
                            theResults[1].length)).toLowerCase();
                        loginOK();
                        lastSession += " as " + userName;
                        setStatusText(lastSession);
                    } else {
                        loginFail();
                        setStatusText("No user logged in.");
                    } // user NG
                } // process login command

            } // request terminated oK
            else {
                alert("Response failed.");
            } // something is wrong
        } // all done
    } // try
    catch (e) {
        alert("Retrieve response exception: " + e);
        dump(e);
    }
}

function setStatusText(theText) {
    //alert("update status");
    getSideBarDocument().getElementById("status-text").setAttribute("label", theText);
}

function commandArg(argKey, argValue) {
    this.key = argKey;
    this.value = argValue;
}

function loginOK() {
    G_ApplicationState = K_LOGGED_ON;
    updateInterface();
}

function loginFail() {
    alert("Sorry, user not authenticated.");
}

function updateInterface() {
    try {
        dump("in update interface with state = " + G_ApplicationState + "\n");

        switch (G_ApplicationState) { // switch on state
            case K_NOT_LOGGED_ON: // not logged on
                //disableEverything();
                getSideBarDocument().getElementById("login_button1").setAttribute("label", "Log in");
                displayRequestMenu(false);
                displayActionMenu(false);
                displayRequestSetting(false);
                displayStepEditButton(false);
                displayStepRemoveButton(false);
                currentRowNumber = null;
                break; // not logged on
            case K_LOGGED_ON:
                getSideBarDocument().getElementById("login_button1").setAttribute("label", "Log out");
                displayRequestMenu(true);
                displayActionMenu(false);
                displayRequestSetting(true);
                displayStepEditButton(false);
                displayStepRemoveButton(false);
                //alert('clear content');
                clearContent();
                break;
            case K_STARTUP: // startup
                displayRequestSetting(true);
                displayRequestMenu(true);
                displayActionMenu(true);
                duringRecording(false);
                displayStepEditButton(false);
                displayStepRemoveButton(false);
                setView();
                break; // startup
            case K_RECORDING_CASE: // note ready for editing
                displayRequestSetting(true);
                displayRequestMenu(false);
                displayActionMenu(false);
                duringRecording(true);
                setView();
                //theEditor.contentDocument.designMode = 'on';
                //theEditor.isCSSEnabled = true;
                break; // note ready for editing
        } // switch on state
    } catch (e) {
        alert("update interface exception: " + e);
        //alert(e);
    }
}

function displayRequestSetting(yesorno) {
    // to do - to disabled all buttons till user logged in
    if (yesorno) {
        getSideBarDocument().getElementById("grid1").style.visibility = "visible";
        getSideBarDocument().getElementById("grid2").style.visibility = "visible";
    } else {
        getSideBarDocument().getElementById("grid1").style.visibility = "hidden";
        getSideBarDocument().getElementById("grid2").style.visibility = "hidden";
    }
}

function displayRequestMenu(yesorno) {
    if (yesorno) {
        getSideBarDocument().getElementById("new_button1").disabled = false;
        getSideBarDocument().getElementById("load_button1").disabled = false;
        getSideBarDocument().getElementById("save_button1").disabled = false;
        getSideBarDocument().getElementById("cancel_button1").disabled = false;
    } else {
        getSideBarDocument().getElementById("new_button1").disabled = true;
        getSideBarDocument().getElementById("load_button1").disabled = true;
        getSideBarDocument().getElementById("save_button1").disabled = true;
        getSideBarDocument().getElementById("cancel_button1").disabled = true;
    }
}

function displayActionMenu(yesorno) {
    if (yesorno) {
        getSideBarDocument().getElementById("record_button1").disabled = false;
        getSideBarDocument().getElementById("verify_button1").disabled = false;
        //getSideBarDocument().getElementById("search_button1").disabled = false;
    } else {
        getSideBarDocument().getElementById("record_button1").disabled = true;
        getSideBarDocument().getElementById("verify_button1").disabled = true;
        //getSideBarDocument().getElementById("search_button1").disabled = true;
    }

}

function displayStepEditButton(yesorno) {
    if (yesorno) {
        getSideBarDocument().getElementById("stepEditButton").disabled = false;
    } else {
        getSideBarDocument().getElementById("stepEditButton").disabled = true;
    }
}

function displayStepRemoveButton(yesorno) {
    if (yesorno) {
        getSideBarDocument().getElementById("stepRemoveButton").disabled = false;
    } else {
        getSideBarDocument().getElementById("stepRemoveButton").disabled = true;
    }
}

function setView() {

}

// when status is right, load contentIFrame with proper url - home.html
function loadSubmitPage() {
    try {
        //document.getElementById("contentIFrame").loadURI(newURL);
        //bug: https://bugzilla.mozilla.org/show_bug.cgi?id=379395
        var submitPageUrl = "http://" + server + "/requestui/home.html";
        var php_doc = getSideBarDocument().getElementById("contentIFrame");
        //alert(php_doc);
        //unwrap(php_doc).setAttribute("src", submitPageUrl);
        php_doc.loadURI(submitPageUrl);
        //alert('3');
    } catch (e) {
        //since we are not using loadURI, below error won't happen
        alert("Exception loading URL " + e);
    }
    return true;
}

function duringRecording(yesorno) {
    if (yesorno) {
        getSideBarDocument().getElementById("record_button1").label = "Stop recording";
        getSideBarDocument().getElementById("record_button1").image = 'chrome://createrequest/skin/stop_record_20x20.png';
    } else {
        getSideBarDocument().getElementById("record_button1").label = "Start recording";
        getSideBarDocument().getElementById("record_button1").image = 'chrome://createrequest/skin/start_record_20x20.png';
    }
    getSideBarDocument().getElementById("record_button1").disabled = false;
}

function createTreeChildren(prop, value) {
    const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    var item = getSideBarDocument().createElementNS(XUL_NS, "treechildren");
    // item.setAttribute("container", true);
    // item.setAttribute("open",true);
    return item;
}

function createUpperTreeItem() {
    const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    var item = getSideBarDocument().createElementNS(XUL_NS, "treeitem");
    item.setAttribute("container", true);
    item.setAttribute("open", true);
    return item;
}

function createTreeItem(prop, value) {
    const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    var item = getSideBarDocument().createElementNS(XUL_NS, "treeitem");
    // item.setAttribute("container", true);
    // item.setAttribute("open",true);
    return item;
}

function createTreeRow(prop, value) {
    const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    var item = getSideBarDocument().createElementNS(XUL_NS, "treerow");
    // item.setAttribute("container", true);
    // item.setAttribute("open",true);
    return item;
}

function createTreeCell(prop, value) {
    const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    var item = getSideBarDocument().createElementNS(XUL_NS, "treecell");
    item.setAttribute(prop, value);
    // item.setAttribute("open",true);
    return item;
}

function appendToTreeChildren(treeItem) {
    var treeChildren = getSideBarDocument().getElementById("steps_tree_children");
    treeChildren.appendChild(treeItem);
}

function setStartPage() {
    var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
        .getInterface(Components.interfaces.nsIWebNavigation)
        .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
        .rootTreeItem
        .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
        .getInterface(Components.interfaces.nsIDOMWindow);
    //alert(mainWindow.content.location.href);
    var currentLocation = mainWindow.getBrowser().selectedBrowser.contentWindow.location.href;

    var wdoc = unwrap(getSideBarDocument());
    if (wdoc.getElementById("startPage").value == "...start testing from ...") {
        //only update when it is not set yet
        startPage = currentLocation;
        wdoc.getElementById("startPage").value = startPage;
        //alert('startPage set to ' + startPage);
    }
}

function showAll() {
    var output = "Title: " + document.getElementById("request").value + "\n";
    output += "Description: " + document.getElementById("description").value + "\n";
    output += "Priority: " + document.getElementById("priority").value + "\n";
    output += "Start date: " + document.getElementById("startdate").value + " " + document.getElementById("starttime").value + "\n";
    output += "End date: " + document.getElementById("enddate").value + " " + document.getElementById("endtime").value + "\n";
    output += "Execute: " + document.getElementById("frequency").value + " times per " + freqUnit + "\n";
    //alert(output);
    //var item = createItem("menuitem", "label", "Test Label");
    //getSideBarDocument.getElementById('mainTree').appendChild(item);

    var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
        .getInterface(Components.interfaces.nsIWebNavigation)
        .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
        .rootTreeItem
        .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
        .getInterface(Components.interfaces.nsIDOMWindow);
    //alert(mainWindow.content.location.href);
    alert(mainWindow.getBrowser().selectedBrowser.contentWindow.location.href);

    // var x0 = createUpperTreeItem();

    // var x1 = createTreeRow();
    // var y1 = createTreeCell("label", "Category 3");


    // var x2 = createTreeChildren();
    // var y2 = createTreeItem();
    // var z2 = createTreeRow();
    // var z21 = createTreeCell("label", "product 1");
    // var z22 = createTreeCell("label", "product 2");


    // var y3 = createTreeItem();
    // var z3 = createTreeRow();
    // var z31 = createTreeCell("label", "product 3");
    // var z32 = createTreeCell("label", "product 4");

    // appendToTreeChildren(x0);
    // x0.appendChild(x1);
    // x1.appendChild(y1);

    // x0.appendChild(x2);
    // x2.appendChild(y2);
    // x2.appendChild(y3);

    // y2.appendChild(z2);
    // z2.appendChild(z21);
    // z2.appendChild(z22);

    // y3.appendChild(z3);
    // z3.appendChild(z31);
    // z3.appendChild(z32);
}

function editSelectedTreeRows() {
    var tree = getSideBarDocument().getElementById("steps_tree");
    var c = tree.currentIndex;
    //alert('edit');
    //tree.view.getItemAtIndex(c).parentNode.removeChild(tree.view.getItemAtIndex(c));
    var cell1Value = getCellText("property_to_check");
    var cell2Value = getCellText("value_to_check");
    openValueEditWindow(cell1Value, cell2Value);
    //alert("Column 1: " + cell1Value + "\n" + "Column 2: " + cell2Value);
}

function removeSelectedTreeRows() {
    var tree = getSideBarDocument().getElementById("steps_tree");

    //var rangeCount = tree.view.selection.getRangeCount();
    var c = tree.currentIndex;
    // var start = {};
    // var end   = {};
    // for (var i=0; i<rangeCount; i++)  {  
    //     tree.view.selection.getRangeAt(i, start, end);
    //     for (var c=end.value; c>=start.value; c--)  {
    //          tree.view.getItemAtIndex(c).parentNode.removeChild(tree.view.getItemAtIndex(c));
    //      }
    // }
    //alert("tree item " + tree.currentIndex + " removed.");
    tree.view.getItemAtIndex(c).parentNode.removeChild(tree.view.getItemAtIndex(c));
    displayStepRemoveButton(false);
    removeDetectionClass();
}

function rowClicked() {
    removeDetectionClass();
    var tree = getSideBarDocument().getElementById("steps_tree");
    var currentRowNumber = tree.currentIndex;
    //alert(currentRowNumber);
    //alert(tree.isContainer(currentIndex));
    // var treeitem = tree.view.getItemAtIndex(tree.currentIndex);
    // alert(treeitem.isContainer()); - not working
    var cellValue = getCellText("property_to_check"); // column 1
    //if (stringStartsWith(cellValue,"verify ") || stringStartsWith(cellValue,"search ") || stringStartsWith(cellValue,"Recording")) {

    var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
        .getInterface(Components.interfaces.nsIWebNavigation)
        .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
        .rootTreeItem
        .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
        .getInterface(Components.interfaces.nsIDOMWindow);
    //alert(mainWindow.content.location.href);
    var doc = mainWindow.getBrowser().selectedBrowser.contentWindow.document;

    if (tree.view.getItemAtIndex(currentRowNumber).getAttribute("container")) {
        getSideBarDocument().getElementById("stepEditButton").disabled = true;
        if (stringStartsWith(cellValue, "verify ")) {
            var delement = getElementByXPath(cellValue.substring(7), doc); ///??????
            $mb(delement, doc).addClass("dcurrent"); ///??????
        } else if (stringStartsWith(cellValue, "search ")) {
            var delement = getElementByCssPath(cellValue.substring(7), doc); ///??????
            $mb(delement, doc).addClass("dcurrent"); ///??????
        }
    } else if (stringStartsWith(cellValue, "to click") || stringStartsWith(cellValue, "to input")) {
        getSideBarDocument().getElementById("stepEditButton").disabled = true;
        //highlight
        var cell2Value = getCellText("value_to_check"); ///??????
        var delement = getElementByXPath(cell2Value, doc); ///??????
        $mb(delement, doc).addClass("dcurrent"); ///??????
    } else {
        getSideBarDocument().getElementById("stepEditButton").disabled = false;
        removeDetectionClass();
    }
    displayStepRemoveButton(true);
    //alert(tree.view.getItemAtIndex(currentRowNumber).hasChildNodes());
    //alert("Container: " + tree.view.getItemAtIndex(currentRowNumber).parentNode.getAttribute("container"));

    //wsSetCellText(tree.currentIndex, "property_to_check", "bananas");
}

function getCellText(columnid) {
    var tree = getSideBarDocument().getElementById("steps_tree");
    var column = tree.columns.getNamedColumn(columnid);
    //alert('column:' + column);
    var value = tree.view.getCellText(tree.currentIndex, column);
    //alert(value);
    return value;
}

function getTheCellText(rowNum, columnid) {
    var tree = getSideBarDocument().getElementById("steps_tree");
    var column = tree.columns.getNamedColumn(columnid);
    //alert('column:' + column);
    var value = tree.view.getCellText(rowNum, column);
    //alert(value);
    return value;
}

function wsSetCellText(rowNum, columnid, value) {
    var tree = getSideBarDocument().getElementById("steps_tree");
    var column = tree.columns.getNamedColumn(columnid);
    //alert('column:' + column);
    //var value = tree.view.getCellText(tree.currentIndex,column);
    //alert(value);
    //return value;
    tree.view.setCellText(rowNum, column, value);
}

function stringStartsWith(x, y) {
    return x.slice(0, y.length) == y;
}

function stringEndsWith(x, y) {
    return x.slice(-y.length) == y;
}


function newRequest() {
    clearContent();
    G_ApplicationState = K_STARTUP;
    getSideBarDocument().getElementById("save_button2").disabled = true;
    updateInterface();
}

function loadRequestDetail() {
    setStartPage();
    getSideBarDocument().getElementById("save_button2").disabled = false;
    var lWindow = window.openDialog("selectRequests.xul", "EDIT", "chrome,modal,centerscreen,resizable", startPage, server, loadSelectedRequest);
}

function loadSelectedRequest(index, data) {
    G_ApplicationState = K_STARTUP;
    updateInterface();


    // alert('we got the json data, need to parse then fill current request');
    // get document with _id=57 http://localhost:28017/casetest/ffcase/?filter__id=57
    // get collections http://localhost:28017/casetest/ffcase/

    var wdoc = unwrap(getSideBarDocument());

    wdoc.getElementById("request").value = decodeURIComponent(data.title);
    wdoc.getElementById("description").value = decodeURIComponent(data.description);
    wdoc.getElementById("startdate").value = data.duration.startDate;
    wdoc.getElementById("starttime").value = data.duration.startTime;
    wdoc.getElementById("enddate").value = data.duration.endDate;
    wdoc.getElementById("endtime").value = data.duration.endTime;
    wdoc.getElementById("priority").value = data.priority;
    wdoc.getElementById("frequency").value = data.duration.frequency;
    freqUnit = data.duration.frequencyUnit;
    if (freqUnit == 'hour') {
        document.getElementById("freqUnitList").selectedIndex = 0;
    } else if (freqUnit == 'day') {
        document.getElementById("freqUnitList").selectedIndex = 1;
    } else if (freqUnit == 'week') {
        document.getElementById("freqUnitList").selectedIndex = 2;
    } else if (freqUnit == 'month') {
        document.getElementById("freqUnitList").selectedIndex = 3;
    } else {
        alert('unrecognized frequency unit: ' + freqUnit + ". Set to hour");
        document.getElementById("freqUnitList").selectedIndex = 0;
        freqUnit = "hour";
    }

    requestId = data._id;
    //alert('read id = ' + requestId);
    // now we process the steps
    var theActions = data.actions;
    var num_of_actions = theActions.length; // how many actions we got
    // alert('num of actions = ' + num_of_actions);
    for (i = 0; i < num_of_actions; i++) {
        var theAction = theActions[i];
        // alert(theAction.description);
        // alert(theAction.path);

        var treeUpperItem = createUpperTreeItem();
        appendToTreeChildren(treeUpperItem);
        var x1 = createTreeRow();
        var y1 = createTreeCell("label", theAction.description + " " + theAction.path);
        x1.appendChild(y1);
        treeUpperItem.appendChild(x1);

        var treeChildren = createTreeChildren();
        treeUpperItem.appendChild(treeChildren);

        j = 1;
        var stepName = 'step_1';
        while (theAction.hasOwnProperty(stepName)) {
            //alert(stepName);
            var theStep = theAction[stepName];
            var y2 = createTreeItem();
            treeChildren.appendChild(y2);
            var z2 = createTreeRow();
            y2.appendChild(z2);

            var z21 = createTreeCell("label", theStep["property"]);
            var z22 = createTreeCell("label", decodeURIComponent(theStep["condition"]));
            alert(theStep["condition"] + '--' + decodeURIComponent(theStep["condition"]));
            var z23 = createTreeCell("label", decodeURIComponent(theStep["value"]));
            //alert(theStep['value'] + "=" + unescape(theStep["value"]));
            z2.appendChild(z21);
            z2.appendChild(z22);
            z2.appendChild(z23);
            j++;
            stepName = 'step_' + j;
        }

    }
}

function saveNewRequest(doUpdate) {
    loadSubmitPage(); // only reload the submit page when necessary

    var php_doc = getSideBarDocument().getElementById("contentIFrame");
    // while (php_doc.URL.indexOf("home.html") < 0) {
    //     setTimeout(alert("not ready: " + php_doc.URL), 1000);
    // }

    //alert("ready: " + php_doc.contentWindow.location.href);

    if (!checkCaseCompleteness()) {
        return false;
    }

    // this could be a new case
    // or an existing case saved as a new case
    // we didn't add tags yet! - to do

    var tests = {}; // tests will contain actions, each step is a list of porperties to verify, or a list of actions to take

    if (doUpdate) {
        //alert('add requestid = ' + requestId);
        tests['_id'] = requestId;
        //alert('update ' + requestId);
    } else {
        requestId = -1;
        tests['_id'] = requestId;
        //alert('save as new, requestId=' + requestId);
    }

    tests['title'] = encodeURIComponent(document.getElementById("request").value);
    tests['description'] = encodeURIComponent(document.getElementById("description").value);
    tests['priority'] = document.getElementById("priority").value;
    tests['startPage'] = document.getElementById("startPage").value;
    tests['updatedBy'] = userName;
    tests['updated'] = new Date();
    //alert('case ready');

    var duration = {};
    duration['startDate'] = document.getElementById("startdate").value;
    duration['startTime'] = document.getElementById("starttime").value;
    duration['endDate'] = document.getElementById("enddate").value;
    duration['endTime'] = document.getElementById("endtime").value;
    duration['frequency'] = document.getElementById("frequency").value;
    duration['frequencyUnit'] = freqUnit;
    tests['duration'] = duration;

    //alert('case time ready');
    //alert(getTheCellText(0,"property_to_check"));
    var actions = {};
    expandingTree();
    var tree = getSideBarDocument().getElementById("steps_tree");
    var treeView = tree.treeBoxObject.view;
    var totalRows = treeView.rowCount;
    var totalSteps = 0;
    var allSteps = {};
    //var step = {};
    var containerStep = 0;
    var key, value;

    for (var i = 0; i < totalRows; i++) {
        if (treeView.isContainer(i)) {
            allSteps[totalSteps] = i;
            totalSteps++;
        }
    }
    //alert('totalSteps='+totalSteps);
    for (var i = 0; i < totalSteps; i++) {
        //alert('i='+i+'\n'+'step='+allSteps[i]);
        var startRow = allSteps[i];
        var endRow;
        var step = {};
        endRow = allSteps[i + 1] ? allSteps[i + 1] : totalRows;
        //alert('endRow=' + endRow);
        // if (allSteps[i+1]) {
        //     endRow = allSteps[i+1];
        // } else {
        //     endRow = totalRows;
        // }
        for (var j = startRow; j < endRow; j++) {


            if (treeView.isContainer(j)) {
                var value = getTheCellText(j, "property_to_check");

                if (stringStartsWith(value, "search")) {
                    step['description'] = "search";
                    step['path'] = value.substring(7);
                }

                if (stringStartsWith(value, 'verify')) {
                    step['description'] = "verify";
                    step['path'] = value.substring(7);
                }

                if (stringStartsWith(value, "Recording")) {
                    step['description'] = value;
                    step['path'] = "n/a";
                }

            } else {
                var rowData = {};
                rowData['property'] = getTheCellText(j, "property_to_check");
                rowData['condition'] = encodeURIComponent(getTheCellText(j, "condition"));
                rowData['value'] = encodeURIComponent(getTheCellText(j, "value_to_check"));
                step['step' + '_' + (j - startRow)] = rowData;

            }

        } //end of j loop
        actions[i] = step;

    } //end of i loop

    tests['actions'] = actions; // add all actions into test case

    //alert(JSON.stringify(tests)); // to check the content from 's'

    var testsInJSON = JSON.stringify(tests);
    // alert(testsInJSON);
    // var xyz = JSON.parse(testsInJSON);
    // alert(JSON.stringify(xyz));
    // var obj = eval ("(" + testsInJSON + ")"); 
    // alert(JSON.stringify(obj));

    //alert(typeof (testsInJSON));

    /* there is a cross-domain issue, can't call php direclty */
    // $.ajax({
    //     type: "GET",
    //     url: "http://localhost/requestui/request.php",
    //     data: {
    //         tests: testsInJSON
    //     },
    //     //data: tests,
    //     success: function(msg) {
    //         alert('case created sucessfully');

    //         //location.reload(true);
    //     }
    // });

    /* to fix cross-domain issue, we call the hidden form */
    var php_doc = getSideBarDocument().getElementById("contentIFrame").contentDocument;
    php_doc.getElementById("tests_content").value = testsInJSON;
    var counts = 0;
    while (php_doc.getElementById("tests_content").value !== testsInJSON) {
        setTimeout(function() {
            alert(php_doc.getElementById("tests_content").value);
        }, 1000);
    }
    //alert(php_doc.getElementById("tests"));
    //alert("value=" + php_doc.getElementById("tests_content").value);
    //php_doc.getElementById("home_submit_button").submit();
    //php_doc.forms["myform"].submit();
    php_doc.forms["myform"].submit();

    setTimeout(function() {
        //alert(php_doc.forms["myform"]);
        G_ApplicationState = K_LOGGED_ON;
        updateInterface();
    }, 3000);

    //alert('3333');
   
           

    if (doUpdate) {
        setStatusText('Request (case) updated.');
    } else {
        setStatusText('Request (case) added.');
    }
    
}

function updateRequest() {
    //alert('to do - UpdateRequest');
    if (!checkCaseCompleteness()) {
        return false;
    }
    if (requestId == "") {
        setStatusText('no existing request, save as new');
        saveNewRequest(false);
    }
    saveNewRequest(true);

}

function cancelRequest() {
    setStatusText('cancel request content');
    clearContent();
    G_ApplicationState = K_STARTUP;
    updateInterface();
}

function clearContent() {
    requestId = "";
    expandingTree();
    var tree = getSideBarDocument().getElementById("steps_tree");
    var rowCount = tree.view.rowCount;
    for (var i = rowCount - 1; i >= 0; i--) {
        tree.view.getItemAtIndex(i).parentNode.removeChild(tree.view.getItemAtIndex(i));
    }

    setTimeout(clearRequest(), 500);        
    freqUnit = 'hour';
    //alert("start page null");
}

function clearRequest() {
    var wdoc = unwrap(getSideBarDocument());
    wdoc.getElementById("startPage").value = "...start testing from ...";
    startPage = "...start testing from ...";
    wdoc.getElementById("request").value = "";
    wdoc.getElementById("description").value = "";

    try {
        var d = new Date();
        var dd = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        // alert(d.getFullYear()); // 2014
        // alert(d.getMonth()); // 3
        // alert(d.getDate()); // 13
        // alert(dd); 2014-4-13
        wdoc.getElementById("startdate").value = dd;
        wdoc.getElementById("enddate").value = dd;
        //wdoc.getElementById("enddate").value = "{new Date()}";
    } catch (e) {
        alert(new Date());
        alert(e);
    }

    wdoc.getElementById("starttime").value = "01:30";
    wdoc.getElementById("endtime").value = "23:30";
    wdoc.getElementById("priority").value = "0";
    wdoc.getElementById("frequency").value = "1";
    wdoc.getElementById("freqUnitList").selectedIndex = 0;

}

function expandingTree() {
    var tree = getSideBarDocument().getElementById("steps_tree");
    var treeView = tree.treeBoxObject.view;
    for (var i = 0; i < treeView.rowCount; i++) {
        if (treeView.isContainer(i) && !treeView.isContainerOpen(i))
            treeView.toggleOpenState(i);
    }
}

function openValueEditWindow(itemLabel, originalValue) {
    // alert('itemLabel=' + itemLabel);
    // alert('originalValue=' + originalValue);
    // editCheckValue
    var lWindow = window.openDialog("editCheckValue.xul", "EDIT", "chrome,modal,centerscreen", itemLabel, originalValue, setCheckValue);
}

function setCheckValue(condition, value) {
    var tree = getSideBarDocument().getElementById("steps_tree");
    var rowNum = tree.currentIndex;
    //columnid = "value_to_check";
    wsSetCellText(rowNum, "condition", condition);
    wsSetCellText(rowNum, "value_to_check", value);
}

// when click a row, element in right side doc will highlight
function removeDetectionClass() {
    var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
        .getInterface(Components.interfaces.nsIWebNavigation)
        .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
        .rootTreeItem
        .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
        .getInterface(Components.interfaces.nsIDOMWindow);
    //alert(mainWindow.content.location.href);
    var doc = mainWindow.getBrowser().selectedBrowser.contentWindow.document;

    $mb('*', doc).removeClass("dcurrent");
}

function getElementByXPath(path, theDoc) {
    return theDoc.evaluate(path, theDoc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function getElementByCssPath(path, theDoc) {
    //var delements = theDoc.getElementsByClassName(path);
    var delement = theDoc.querySelector(path);
    return delement;
}

function checkCaseCompleteness() {
    //alert('to do - checkCaseCompleteness');

    var tree = getSideBarDocument().getElementById("steps_tree");
    if (tree.view.rowCount < 2) {
        alert('please select something to check');
        return false;
    }

    var wdoc = unwrap(getSideBarDocument());
    var requestValue = wdoc.getElementById("request").value + "";
    var descriptionValue = wdoc.getElementById("description").value + "";

    if (requestValue.length === 0) {
        alert('please input title for the request');
        return false;
    }

    if (descriptionValue.length === 0) {
        alert('please input description for the request');
        return false;
    }

        return true;
    }

    function expandingTree() {
        var tree = getSideBarDocument().getElementById("steps_tree");
        var treeView = tree.treeBoxObject.view;
        for (var i = 0; i < treeView.rowCount; i++) {
            if (treeView.isContainer(i) && !treeView.isContainerOpen(i))
                treeView.toggleOpenState(i);
        }
    }