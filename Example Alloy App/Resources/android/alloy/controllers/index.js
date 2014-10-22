function Controller() {
    function __alloyId3() {
        $.__views.index.removeEventListener("open", __alloyId3);
        if ($.__views.index.activity) $.__views.index.activity.onCreateOptionsMenu = function(e) {
            var __alloyId1 = {
                id: "sync",
                title: "Sync",
                showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM
            };
            $.__views.sync = e.menu.add(_.pick(__alloyId1, Alloy.Android.menuItemCreateArgs));
            $.__views.sync.applyProperties(_.omit(__alloyId1, Alloy.Android.menuItemCreateArgs));
            menuItemSync_click ? $.__views.sync.addEventListener("click", menuItemSync_click) : __defers["$.__views.sync!click!menuItemSync_click"] = true;
            var __alloyId2 = {
                id: "logout",
                title: "Logout",
                showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM
            };
            $.__views.logout = e.menu.add(_.pick(__alloyId2, Alloy.Android.menuItemCreateArgs));
            $.__views.logout.applyProperties(_.omit(__alloyId2, Alloy.Android.menuItemCreateArgs));
            menuItemLogout_click ? $.__views.logout.addEventListener("click", menuItemLogout_click) : __defers["$.__views.logout!click!menuItemLogout_click"] = true;
        }; else {
            Ti.API.warn("You attempted to attach an Android Menu to a lightweight Window");
            Ti.API.warn("or other UI component which does not have an Android activity.");
            Ti.API.warn("Android Menus can only be opened on TabGroups and heavyweight Windows.");
        }
    }
    function menuItemLogout_click() {
        googleAuth.deAuthorize();
        $.table.setData([]);
    }
    function menuItemSync_click() {
        Ti.API.info("Authorized: " + googleAuth.isAuthorized());
        googleAuth.isAuthorized(function() {
            Ti.API.info("Access Token: " + googleAuth.getAccessToken());
            $.table.setData([]);
            var xhrList = Ti.Network.createHTTPClient({
                onload: function(e) {
                    try {
                        var resp = JSON.parse(this.responseText);
                        for (var i = 0; resp.items.length > i; i++) {
                            var xhrTasks = Ti.Network.createHTTPClient({
                                onload: function() {
                                    var resp = JSON.parse(this.responseText);
                                    for (var j = 0; resp.items.length > j; j++) if ("" != resp.items[j].title) {
                                        var row = Titanium.UI.createTableViewRow({
                                            title: resp.items[j].title
                                        });
                                        $.table.appendRow(row);
                                    }
                                },
                                onerror: function() {
                                    Titanium.UI.createAlertDialog({
                                        title: "Error",
                                        message: "Can't load tasks for list " + resp[i].title
                                    });
                                },
                                timeout: 5e3
                            });
                            xhrTasks.open("GET", "https://www.googleapis.com/tasks/v1/lists/" + resp.items[i].id + "/tasks?access_token=" + googleAuth.getAccessToken());
                            xhrTasks.send();
                        }
                    } catch (e) {
                        Titanium.UI.createAlertDialog({
                            title: "Error",
                            message: "Can't load tasks for list"
                        });
                        Ti.API.error("RESPONSE: " + JSON.stringify(e));
                    }
                },
                onerror: function(e) {
                    Titanium.UI.createAlertDialog({
                        title: "Error",
                        message: "Can't load tasklists"
                    });
                    Ti.API.error("HTTP: " + JSON.stringify(e));
                },
                timeout: 5e3
            });
            xhrList.open("GET", "https://www.googleapis.com/tasks/v1/users/@me/lists?access_token=" + googleAuth.getAccessToken());
            xhrList.send();
        }, function() {
            Ti.API.info("Authorize google account...");
            googleAuth.authorize();
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    var __alloyId0 = [];
    $.__views.win1 = Ti.UI.createWindow({
        id: "win1",
        title: "Google Tasks",
        backgroundColor: "white",
        barColor: "black"
    });
    $.__views.table = Ti.UI.createTableView({
        id: "table"
    });
    $.__views.win1.add($.__views.table);
    $.__views.tab1 = Ti.UI.createTab({
        window: $.__views.win1,
        id: "tab1",
        title: "Google Tasks",
        icon: "/images/259-list.png"
    });
    __alloyId0.push($.__views.tab1);
    $.__views.index = Ti.UI.createTabGroup({
        tabs: __alloyId0,
        id: "index"
    });
    $.__views.index.addEventListener("open", __alloyId3);
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    $.index.addEventListener("open", function() {
        var activity = $.index.getActivity();
        activity.invalidateOptionsMenu();
    });
    var googleAuth = Alloy.Globals.googleAuth;
    __defers["$.__views.sync!click!menuItemSync_click"] && $.__views.sync.addEventListener("click", menuItemSync_click);
    __defers["$.__views.logout!click!menuItemLogout_click"] && $.__views.logout.addEventListener("click", menuItemLogout_click);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;