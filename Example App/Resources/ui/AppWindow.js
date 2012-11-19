function AppWindow(title) {
	var self = Ti.UI.createWindow({
		title : title,
		backgroundColor : 'white',
		barColor : 'black',
	});

	var sync = Ti.UI.createButton({
		title : 'Sync'
	});
	var logout = Ti.UI.createButton({
		title : 'Logout'
	});
	var table = Titanium.UI.createTableView();
	self.add(table);
	self.rightNavButton = sync;
	self.leftNavButton = logout;

	logout.addEventListener('click', function() {
		googleAuth.deAuthorize();
		//googleAuth.refreshToken();
		table.setData([]);
	});
	sync.addEventListener('click', function() {
		Ti.API.info('Authorized: ' + googleAuth.isAuthorized());
		googleAuth.isAuthorized(function() {
			Ti.API.info('Access Token: ' + googleAuth.getAccessToken());
			//empty table view
			table.setData([]);
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
											table.appendRow(row);
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
	});
	return self;
};

module.exports = AppWindow;
