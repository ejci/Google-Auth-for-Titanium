Google Auth for Titanium
=======

Google Auth for Titanium is a module for Appcelerator Titanium. It allows to authenticate user with Google OAuth 2.0.


##Example Usage
Check the example App to see it in action.

Titanium:
	
	:::javascript
	//initialize module
	var GoogleAuth = require('modules/googleAuth');
	var googleAuth = new GoogleAuth({
		clientId : '603133810021.apps.googleusercontent.com',
		clientSecret : 'uNUk7OSfK8p26pnuIfDQ5IKV',
		propertyName : 'googleToken',
		scope : ['https://www.googleapis.com/auth/tasks', 'https://www.googleapis.com/auth/tasks.readonly']
	});
	//create some button
	var sync = Ti.UI.createButton({
		title : 'Sync'
	});
	//do some action...
	sync.addEventListener('click', function() {
		googleAuth.isAuthorized(function() {
			//user is authorized so do something...
			
		}, function() {
			//authorize first
			googleAuth.authorize();
		});
	});

![Demo App][1]

@author [Miroslav Magda](http://ejci.net)

@version 0.3.0

##License
All code is open source and dual licensed under GPL and MIT. Check the individual licenses for more information.


[1]: http://cdn.bitbucket.org/miroslavmagda/google-auth-for-titanium/downloads/Google%20auth.png