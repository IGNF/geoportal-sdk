/* global requirejs */

requirejs.config({
    baseUrl : "",
    paths : {
        // lib external
        log4js      : "../lib/external/woodman/woodman-amd",
        ol          : "../lib/external/ol3/ol",
        vg  : "../lib/external/virtual/js/VirtualGeoWeb-5.0.9",
        gp          : "../lib/external/geoportail/plugins-ol3/GpPluginOl3-src",
        
        // "plugins-vg"  : "../lib/external/geoportail/plugins-vg/GpPluginVg-src",
        // "plugins-ol3" : "../lib/external/geoportail/plugins-ol3/GpPluginOl3-src",
        // "plugins-mix" : "../lib/external/geoportail/plugins-mix/GpPluginOl3Vg-src",

        // config du logger
        "logger-cfg" : "Utils/Logger.cfg"
    }
});
