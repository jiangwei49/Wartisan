// main file with functions

var mainWindow;
var mySidebarWindow;

function toggleCreateRequest(event){  
	// open or close the wartisan sidebar
    if(!requestSidebarIsOpen()){
    	//createRequestInitiator = new Initiator();
        //update = true; 
        //alert("not open"); // if not opened but request to open
        toggleSidebar('viewRequestSidebar');
	} else {
		//alert("opened"); // if already opened but request to close
		//requestCleanUp();
		toggleSidebar('viewRequestSidebar');
	}
}

function requestSidebarIsOpen(){
	if(document.getElementById('viewRequestSidebar')){
       	//alert("found id");
	  	rqelt = document.getElementById('viewRequestSidebar');
	  	if(rqelt.getAttribute("checked") == 'true')	return true;
	}
	return false;
}

