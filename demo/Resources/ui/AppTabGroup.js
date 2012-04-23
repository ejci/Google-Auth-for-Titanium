function AppTabGroup() {
	//declare module dependencies
	var AppWindow = require('ui/AppWindow');
	
	//create module instance
	var self = Ti.UI.createTabGroup();
	
	//create app tabs
	var win1 = new AppWindow('Google Tasks');	
	var tab1 = Ti.UI.createTab({
		title: 'Google Tasks',
		icon: '/images/259-list.png',
		window: win1
	});
	win1.containingTab = tab1;
	
	
	self.addTab(tab1);
	
	return self;
};

module.exports = AppTabGroup;
