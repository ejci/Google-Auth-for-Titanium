// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

Alloy.Globals.GoogleAuth_module = require('googleAuth');

Alloy.Globals.googleAuth = new Alloy.Globals.GoogleAuth_module({
	//clientId : '219575370718-u3vb42f04899h02es4mj4uh34otgr5pe.apps.googleusercontent.com',
	clientId : '761394311941.apps.googleusercontent.com',
	clientSecret : 'KEKKU3--QVk849MHtmAJTToU',
	propertyName : 'googleToken',
	quiet: false,
	scope : [ 'https://www.googleapis.com/auth/tasks', 'https://www.googleapis.com/auth/tasks.readonly' ]
});

