define(["log4js", "logger-cfg"], function (Log4js, Config) {
    
    "use strict";
    
    /**
     * classe LoggerByDefault
     */
    var LoggerByDefault = {
        
        /**
         * methode getLogger
         */
        getLogger : function (name) {
            Log4js.load(Config, function (error) {
                if (error) {
                    // FIXME comment traite t on cette exception !? 
                    throw error;
                }
            });
            return Log4js.getLogger(name || "default");
        }
    };
    
    return LoggerByDefault;
});