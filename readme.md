Google Auth (OAuth 2.0) for Titanium
=======

Google Auth for Titanium is a module for Appcelerator Titanium. It allows to authenticate user with Google OAuth 2.0 and then work with Google Apis.
To understand how it works you must check [Google Accounts Authentication and Authorization docs](https://developers.google.com/accounts/docs/OAuth2InstalledApp).


## Example Usage
Check the example App to see it in action. It is pretty simple but you will need to get your CLIENT_ID and CLIENT_SECRET from [Google Api Console](https://code.google.com/apis/console/).
If you don't now how to get CLIENT_ID or CLIENT_SECRET check this [guide](http://blog.ejci.net).

### Titanium code:
	
	:::javascript
	//initialize module
	var GoogleAuth = require('modules/googleAuth');
	var googleAuth = new GoogleAuth({
		clientId : 'CLIENT_ID',
		clientSecret : 'CLIENT_SECRET',
		propertyName : 'googleToken',
		scope : ['https://www.googleapis.com/auth/tasks', 'https://www.googleapis.com/auth/tasks.readonly'],
		loginHint : 'someuser@gmail.com' 
	});
	//create some button
	var sync = Ti.UI.createButton({
		title : 'Sync'
	});
	//do some action...
	sync.addEventListener('click', function() {
		googleAuth.isAuthorized(function() {
			Ti.API.info('Access Token: ' + googleAuth.getAccessToken());
			//user is authorized so do something... just dont forget to add accessToken to your requests
			
		}, function() {
			//authorize first
			googleAuth.authorize();
		});
	});


### Titanium demo:
![Demo App][1]

Author: [Miroslav Magda](http://ejci.net)
Version 0.3.2

## License
All code is open source and dual licensed under GPL and MIT. Check the individual licenses for more information.


[1]: http://cdn.bitbucket.org/miroslavmagda/google-auth-for-titanium/downloads/Google%20auth.png
