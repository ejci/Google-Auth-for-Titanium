var GoogleAuth = function(o) {
    function getProps() {
        var p = {};
        p.accessToken = Ti.App.Properties.getString(_opt.propertyName + ".accessToken");
        p.refreshToken = Ti.App.Properties.getString(_opt.propertyName + ".refreshToken");
        p.tokenType = Ti.App.Properties.getString(_opt.propertyName + ".tokenType");
        p.expiresIn = Ti.App.Properties.getString(_opt.propertyName + ".expiresIn");
        return p;
    }
    function authorize(cb) {
        cb = cb ? cb : function() {};
        win = Ti.UI.createWindow({
            backgroundColor: "white",
            barColor: _opt.winColor,
            modal: true,
            title: _opt.winTitle
        });
        var spinner = Ti.UI.createActivityIndicator({
            zIndex: 1,
            height: 50,
            width: 50,
            hide: true,
            style: Ti.UI.iPhone.ActivityIndicatorStyle.DARK
        });
        var close = Ti.UI.createButton({
            title: _opt.closeTitle
        });
        win.add(spinner);
        win.rightNavButton = close;
        close.addEventListener("click", function() {
            win.close();
        });
        var url = prepareUrl();
        var webview = Titanium.UI.createWebView({
            width: "100%",
            height: "100%",
            url: url
        });
        win.add(webview);
        var c = 0;
        webview.addEventListener("load", function() {
            c++;
            var accessDenied = webview.evalJS('document.getElementById("access_denied").value;');
            if ("" != accessDenied) {
                log.debug("GoogleAuth: Access denied!");
                Ti.App.Properties.setString(_opt.propertyName + ".accessToken", "");
                Ti.App.Properties.setString(_opt.propertyName + ".refreshToken", "");
                Ti.App.Properties.setString(_opt.propertyName + ".tokenType", "");
                Ti.App.Properties.setString(_opt.propertyName + ".expiresIn", 0);
                _prop.accessToken = null;
                _prop.refreshToken = null;
                _prop.tokenType = null;
                _prop.expiresIn = 0;
                win.close();
            }
            var code = webview.evalJS('document.getElementById("code").value;');
            if ("" != code) {
                log.debug("GoogleAuth: Access granted!");
                webview.hide();
                spinner.show();
                getToken(code, cb);
            }
            if (c > 10) {
                log.debug("GoogleAuth: To many redirects...");
                win.close();
            }
        });
        win.open();
    }
    function deAuthorize(cb) {
        cb = cb ? cb : function() {};
        log.debug("GoogleAuth: User logging out...");
        if (isAuthorized()) {
            var logoutWin = Ti.UI.createWindow({
                backgroundColor: "white",
                barColor: _opt.winColor,
                modal: true,
                title: _opt.winTitle
            });
            var close = Ti.UI.createButton({
                title: _opt.closeTitle
            });
            var spinner = Ti.UI.createActivityIndicator({
                zIndex: 1,
                height: 50,
                width: 50,
                style: Ti.UI.iPhone.ActivityIndicatorStyle.DARK
            });
            logoutWin.rightNavButton = close;
            close.addEventListener("click", function() {
                logoutWin.close();
            });
            var webview = Titanium.UI.createWebView({
                width: "100%",
                height: "100%",
                url: "https://accounts.google.com/Logout"
            });
            logoutWin.add(spinner);
            logoutWin.add(webview);
            webview.addEventListener("load", function() {
                setTimeout(function() {
                    logoutWin.close();
                    cb();
                }, 500);
                Ti.App.Properties.setString(_opt.propertyName + ".accessToken", "");
                Ti.App.Properties.setString(_opt.propertyName + ".refreshToken", "");
                Ti.App.Properties.setString(_opt.propertyName + ".tokenType", "");
                Ti.App.Properties.setString(_opt.propertyName + ".expiresIn", 0);
                _prop.accessToken = null;
                _prop.refreshToken = null;
                _prop.tokenType = null;
                _prop.expiresIn = 0;
            });
            logoutWin.open();
        }
    }
    function refreshToken(cbSuccess, cbError) {
        log.info("GoogleAuth: Access code not valid. Refreshing...");
        cbSuccess = cbSuccess ? cbSuccess : function() {};
        cbError = cbError ? cbError : function() {};
        var xhr = Ti.Network.createHTTPClient({
            onload: function() {
                var resp = JSON.parse(this.responseText);
                resp.expires_in = 1e3 * parseFloat(resp.expires_in, 10) + new Date().getTime();
                Ti.App.Properties.setString(_opt.propertyName + ".accessToken", resp.access_token);
                Ti.App.Properties.setString(_opt.propertyName + ".tokenType", resp.token_type);
                Ti.App.Properties.setString(_opt.propertyName + ".expiresIn", resp.expires_in);
                _prop.accessToken = resp.access_token;
                _prop.tokenType = resp.token_type;
                _prop.expiresIn = resp.expires_in;
                log.debug(_prop);
                cbSuccess();
            },
            onerror: function(e) {
                log.info(e.error);
                log.info(e.responseText);
                cbError();
                Titanium.UI.createAlertDialog({
                    title: "Error",
                    message: _opt.errorText
                });
                cbError();
            },
            timeout: 5e3
        });
        xhr.open("POST", _opt.url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        var d = {
            client_id: _opt.clientId,
            client_secret: _opt.clientSecret,
            refresh_token: _prop.refreshToken,
            grant_type: "refresh_token"
        };
        xhr.send(d);
    }
    function getToken(code, cb) {
        cb = cb ? cb : function() {};
        var xhr = Ti.Network.createHTTPClient({
            onload: function() {
                var resp = JSON.parse(this.responseText);
                log.info(resp.expires_in);
                resp.expires_in = 1e3 * parseFloat(resp.expires_in, 10) + new Date().getTime();
                log.info(resp.expires_in);
                Ti.App.Properties.setString(_opt.propertyName + ".accessToken", resp.access_token);
                Ti.App.Properties.setString(_opt.propertyName + ".refreshToken", resp.refresh_token);
                Ti.App.Properties.setString(_opt.propertyName + ".tokenType", resp.token_type);
                Ti.App.Properties.setString(_opt.propertyName + ".expiresIn", resp.expires_in);
                _prop.accessToken = resp.access_token;
                _prop.refreshToken = resp.refresh_token;
                _prop.tokenType = resp.token_type;
                _prop.expiresIn = resp.expires_in;
                log.debug(_prop);
                win.close();
                cb();
            },
            onerror: function() {
                Titanium.UI.createAlertDialog({
                    title: "Error",
                    message: _opt.errorText
                });
                win.close();
            },
            timeout: 5e3
        });
        xhr.open("POST", "https://accounts.google.com/o/oauth2/token");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        var d = {
            code: code,
            client_id: _opt.clientId,
            client_secret: _opt.clientSecret,
            redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
            grant_type: "authorization_code"
        };
        xhr.send(d);
    }
    function prepareUrl() {
        var scope = [];
        for (var i = 0; _opt.scope.length > i; i++) scope[i] = encodeURIComponent(_opt.scope[i]);
        var url = _opt.url + "?" + "approval_prompt=force&scope=" + scope.join("+") + "&" + "redirect_uri=urn:ietf:wg:oauth:2.0:oob" + "&" + "response_type=code" + "&" + "client_id=" + _opt.clientId + "&" + "btmpl=mobile";
        log.debug(url);
        return url;
    }
    function isAuthorized(cbSuccess, cbError) {
        cbSuccess = cbSuccess ? cbSuccess : function() {};
        cbError = cbError ? cbError : function() {};
        _prop = getProps();
        log.debug("Properties: " + JSON.stringify(_prop));
        if (null != _prop.accessToken && "" != _prop.accessToken) {
            _prop.expiresIn < new Date().getTime() ? refreshToken(cbSuccess, cbError) : cbSuccess();
            return true;
        }
        cbError();
        return false;
    }
    function getAccessToken() {
        return _prop.accessToken;
    }
    var _version = "0.3.2";
    o = o ? o : {};
    var _opt = {
        clientId: o.clientId ? o.clientId : null,
        clientSecret: o.clientSecret ? o.clientSecret : null,
        propertyName: o.propertyName ? o.propertyName : "googleToken",
        url: "https://accounts.google.com/o/oauth2/auth",
        scope: o.scope ? o.scope : [ "https://www.googleapis.com/auth/tasks" ],
        closeTitle: o.closeTitle ? o.closeTitle : "Close",
        winTitle: o.winTitle ? o.winTitle : "Google Account",
        errorText: o.errorText ? o.errorText : "Can not authorize user!",
        winColor: o.winColor ? o.winColor : "#000",
        quiet: "undefined" == typeof o.quiet ? true : o.quiet
    };
    var log = function() {};
    log.error = function(t) {
        _opt.quiet || Ti.API.error("" + t);
    };
    log.info = function(t) {
        _opt.quiet || Ti.API.info(t);
    };
    log.debug = function(t) {
        _opt.quiet || Ti.API.debug("" + t);
    };
    log.trace = function(t) {
        _opt.quiet || Ti.API.trace("" + t);
    };
    log.info("-------------------------------------");
    log.info("| Google Account Authentification   |");
    log.info("| Titanium Module (v.:" + _version + ")        |");
    log.info("| by Miroslav Magda                 |");
    log.info("-------------------------------------");
    var win;
    var _prop = {};
    _prop.accessToken = null;
    _prop.refreshToken = null;
    _prop.tokenType = null;
    _prop.expiresIn = 0;
    var prop = {};
    prop = getProps();
    if (prop.expiresIn >= new Date().getTime()) {
        log.info("GoogleAuth: Access code valid");
        _prop = prop;
    }
    return {
        isAuthorized: isAuthorized,
        deAuthorize: deAuthorize,
        getAccessToken: getAccessToken,
        refreshToken: refreshToken,
        authorize: authorize,
        version: _version
    };
};

module.exports = GoogleAuth;