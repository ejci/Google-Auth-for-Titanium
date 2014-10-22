var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

Alloy.Globals.GoogleAuth_module = require("googleAuth");

Alloy.Globals.googleAuth = new Alloy.Globals.GoogleAuth_module({
    clientId: "761394311941.apps.googleusercontent.com",
    clientSecret: "KEKKU3--QVk849MHtmAJTToU",
    propertyName: "googleToken",
    quiet: false,
    scope: [ "https://www.googleapis.com/auth/tasks", "https://www.googleapis.com/auth/tasks.readonly" ]
});

Alloy.createController("index");