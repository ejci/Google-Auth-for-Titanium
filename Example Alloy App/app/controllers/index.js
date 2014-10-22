$.index.open();

$.index.addEventListener('open', function(e) {
	var activity = $.index.getActivity();
	activity.invalidateOptionsMenu(); //force reload of menus	
});

var googleAuth = Alloy.Globals.googleAuth;

function menuItemLogout_click() {
		googleAuth.deAuthorize();
		//googleAuth.refreshToken();
		$.table.setData([]);
}
	
function menuItemSync_click() {
		Ti.API.info('Authorized: ' + googleAuth.isAuthorized());
		googleAuth.isAuthorized(function() {
			Ti.API.info('Access Token: ' + googleAuth.getAccessToken());
			//empty table view
			$.table.setData([]);
			var xhrList = Ti.Network.createHTTPClient({
				// function called when the response data is available
				onload : function(e) {
					try {
						var resp = JSON.parse(this.responseText);
						for (var i = 0; i < resp.items.length; i++) {
							//GET DATA FOR LIST
							var xhrTasks = Ti.Network.createHTTPClient({
								// function called when the response data is available
								onload : function(e) {
									var resp = JSON.parse(this.responseText);
									for (var j = 0; j < resp.items.length; j++) {
										if (resp.items[j].title != '') {
											var row = Titanium.UI.createTableViewRow({
												title : resp.items[j].title
											});
											$.table.appendRow(row);
										}
									}
								},
								// function called when an error occurs, including a timeout
								onerror : function(e) {
									Titanium.UI.createAlertDialog({
										title : 'Error',
										message : 'Can\'t load tasks for list ' + resp[i].title
									});
								},
								timeout : 5000
							});
							xhrTasks.open("GET", 'https://www.googleapis.com/tasks/v1/lists/' + resp.items[i].id + '/tasks?access_token=' + googleAuth.getAccessToken());
							xhrTasks.send();
						}
					} catch(e) {
						Titanium.UI.createAlertDialog({
							title : 'Error',
							message : 'Can\'t load tasks for list' 
						});
						Ti.API.error('RESPONSE: '+JSON.stringify(e));
					}
				},
				// function called when an error occurs, including a timeout
				onerror : function(e) {
					Titanium.UI.createAlertDialog({
						title : 'Error',
						message : 'Can\'t load tasklists'
					});
					Ti.API.error('HTTP: '+JSON.stringify(e));
				},
				timeout : 5000
			});
			xhrList.open("GET", 'https://www.googleapis.com/tasks/v1/users/@me/lists?access_token=' + googleAuth.getAccessToken());
			xhrList.send();
		}, function() {
			Ti.API.info('Authorize google account...');
			googleAuth.authorize();
		});
}
	
	