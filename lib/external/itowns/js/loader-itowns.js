"use strict";

/*
 * Exemple :
 * _loadScript("./lib/itowns.js",
 *     function () {
 *         console.warn("Itowns engine, loaded...");
 *         // some stuff...
 *     },
 *     function () {
 *         console.warn("Itowns engine, failed !");
 *     },
 *     this);
 */

/** loader engine itowns */
var _loadScript = function (src, callbackSuccess, callbackError, scope) {

    if (!scope) {
        scope = this;
    }

    if (document.getElementById("engine-itowns")) {
        callbackSuccess.call(scope);
        return;
    }

    var scriptEngine = document.createElement("script");
    scriptEngine.id = "engine-itowns";
    scriptEngine.src = src;
    scriptEngine.async = "async";

    if (callbackSuccess !== null) {
        if (scriptEngine.readyState) { // IE, incl. IE9
            /** ... */
            scriptEngine.onreadystatechange = function () {
                if (scriptEngine.readyState == "loaded" || scriptEngine.readyState == "complete") {
                    scriptEngine.onreadystatechange = null;
                    callbackSuccess.call(scope, arguments);
                }
            };
        } else { // Other browsers
            /** ... */
            scriptEngine.onload = function () {
                callbackSuccess.call(scope, arguments);
            };
            if (callbackError !== null) {
                /** ... */
                scriptEngine.onerror = function () {
                    callbackError.call(scope, arguments);
                };
            }
        }
    }

    var script = document.getElementsByTagName("script")[0];
    script.parentNode.insertBefore(scriptEngine, script);

};

/** ... */
var _getCurrentPath = function () {

    var path = document.currentScript ? document.currentScript.src : (function () {
        var e = document.getElementsByTagName("script");
        return e[e.length - 1].src;
    })();
    path = path.substr(0, path.lastIndexOf("/") + 1);
    return path;
};

/** ... */
var _getPath = function (scriptName) {

    var path = "";
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; ++i) {
        var src = scripts[i].getAttribute("src");
        if (src.indexOf(scriptName) !== -1) {
            var url = document.createElement("a");
            url.href = src;
            path = url.origin + url.pathname.substring(0, url.pathname.indexOf(scriptName));
            break;
        }
    }
    return path;
};
