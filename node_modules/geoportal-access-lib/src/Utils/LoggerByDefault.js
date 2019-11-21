import * as Log from "loglevel";

var LoggerByDefault = {
    /**
     * logger statique
     *
     * @static
     * @param {String} name - nom du logger
     * @returns {Object} retourne un logger
     */
    getLogger : function (name) {
        // Substitute global constants configured at compile time
        // cf. webpack.config.js
        // FIXME howtodo !? DefineWebpackPlugin ? EnvironmentWebpackPlugin ?
        ("__PRODUCTION__".match(/true/))
            ? Log.disableAll() : Log.enableAll();
        var logname = name || "default";
        return Log.getLogger(logname);
    }
};

export default LoggerByDefault;
