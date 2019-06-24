var Engine3DLoader = {

    // loader engine itowns
    loadEngine : function (src, callbackSuccess, callbackError, scope) {
        if (!scope) {
            scope = this;
        }

        var env = typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : this;

        if (document.getElementById("engine-itowns")) {
            callbackSuccess.call(scope, env.itowns || {});
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
                    if (scriptEngine.readyState === "loaded" || scriptEngine.readyState === "complete") {
                        scriptEngine.onreadystatechange = null;
                        callbackSuccess.call(scope, env.itowns || {});
                    }
                };
            } else { // Other browsers
                /** ... */
                scriptEngine.onload = function () {
                    callbackSuccess.call(scope, env.itowns || {});
                };
                if (callbackError !== null) {
                    scriptEngine.onerror = function (e) {
                        callbackError.call(scope, e);
                    };
                }
            }
        }

        var script = document.getElementsByTagName("script")[0];
        script.parentNode.insertBefore(scriptEngine, script);
    },

    getCurrentPath : function () {
        // on recherche la librairie SDK dans l'entête,
        // la lib itowns se trouve au même niveau !
        var head = document.head || document.getElementsByTagName("head")[0];
        var path = (function () {
            var e = head.getElementsByTagName("script");
            return e[e.length - 1].src;
        })();
        path = path.substr(0, path.lastIndexOf("/") + 1);
        return path;
    },

    getPath : function (scriptName) {
        var path = "";
        var scripts = document.getElementsByTagName("script");
        for (var i = 0; i < scripts.length; ++i) {
            var src = scripts[i].getAttribute("src");
            if (src.indexOf(scriptName) !== -1) {
                var url = document.createElement("a");
                url.href = src;
                path = url.origin + url.pathname.substring(0, url.pathname.lastIndexOf("/") + 1);
                break;
            }
        }
        return path;
    },

    getEnginePath : function (path) {
        var _path = "";
        if (path) {
            var sep = "";
            // fichier avec extension js
            if (path.substring(path.lastIndexOf(".")) === ".js") {
                _path = path;
            } else {
                // si chemin sans "/" à la fin, on le rajoute...
                if (path.lastIndexOf("/") === path.length - 1) {
                    sep = "/";
                }
                _path = path + sep + "itowns.js";
            }
        } else {
            _path = this.getCurrentPath() + "itowns.js";
        }
        return _path;
    }
};

export { Engine3DLoader };
