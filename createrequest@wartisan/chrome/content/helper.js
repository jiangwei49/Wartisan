// Wei: used in listener.js, to unwrap a XUL element ? to HTML element (maybe i am not correct here)
function unwrap(o) {
	// unwraps an XPCNativeWrapper, if necessary, to get access to JavaScript properties
	// This became necessary as of Firefox 3.0.*
	// This function helps us avoid having to check for it in numerous places.
	// See here: https://developer.mozilla.org/en/XPCNativeWrapper
	if(o && o.wrappedJSObject) {
		return o.wrappedJSObject;
	}
	return o;
}


