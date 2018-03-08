/* global requirejs */

requirejs.config({
    baseUrl : "",
    paths : {
        // lib external
        log4js      : "../lib/external/woodman/woodman-amd",
        ol          : "../lib/external/ol3/ol",
        itowns      : "../lib/external/itowns/js/itowns",
        gp          : "../node_modules/geoportal-extensions-openlayers/dist/GpPluginOl3-src",
        // Use lib external to test dev releases of geoportal-extensions
        // gp          : "../lib/external/geoportail/plugins-ol3/GpPluginOl3-src",
        // "plugins-itowns" : "../lib/external/geoportail/plugins-mix/GpPluginOl3Itowns-src",
        // "plugins-ol3"   : "../lib/external/geoportail/plugins-ol3/GpPluginOl3-src",
        // "plugins-mix"   : "../lib/external/geoportail/plugins-mix/GpPluginOl3Vg-src",

        // config du logger
        "logger-cfg" : "Utils/Logger.cfg"
    }
});
