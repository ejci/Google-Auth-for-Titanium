var GoogleAuth = require('modules/googleAuth');
var googleAuth = new GoogleAuth({
	clientId : '603133810021.apps.googleusercontent.com',
	clientSecret : 'uNUk7OSfK8p26pnuIfDQ5IKV',
	propertyName : 'googleToken',
	scope : ['https://www.googleapis.com/auth/tasks', 'https://www.googleapis.com/auth/tasks.readonly']
});

/*
* A tabbed application, consisting of multiple stacks of windows associated with tabs in a tab group.
* A starting point for tab-based application with multiple top-level windows.
* Requires Titanium Mobile SDK 1.8.0+.
*
* In app.js, we generally take care of a few things:
* - Bootstrap the application with any data we need
* - Check for dependencies like device type, platform version or network connection
* - Require and open our top-level UI component
*
*/

//bootstrap and check dependencies
if(Ti.version < 1.8) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
} else if(Ti.Platform.osname === 'mobileweb') {
	alert('Mobile web is not yet supported by this template');
} else {
	//require and open top level UI component
	var AppTabGroup = require('ui/AppTabGroup');
	new AppTabGroup().open();
}
/*
 var win = Ti.UI.createWindow({
 backgroundColor : 'white',
 modal : true,
 title : 'Google'
 });

 var url='https://accounts.google.com/o/oauth2/auth?'+
 'scope='+encodeURIComponent('https://www.googleapis.com/auth/tasks')+'&'+
 'redirect_uri=urn:ietf:wg:oauth:2.0:oob'+'&'+
 'response_type=code'+'&'+
 'client_id=603133810021.apps.googleusercontent.com'+'&'+
 'btmpl=mobile'+
 '';

 Ti.API.info(url);
 var webview = Titanium.UI.createWebView({
 width: '100%',
 height: '100%',
 url : url
 });
 win.add(webview);
 win.open();
 */