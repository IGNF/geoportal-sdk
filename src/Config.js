/* global requirejs */

requirejs.config({
    baseUrl : "",
    paths : {
        // lib external
        log4js      : "../lib/external/woodman/woodman-amd",
        ol          : "../lib/external/ol3/ol",
        "plugins-vg"  : "../lib/external/geoportail/plugins-vg/GpPluginVg-src",
        "plugins-ol3"  : "../lib/external/geoportail/plugins-ol3/GpPluginOl3-src",
        vg  : "../lib/external/virtual/js/VirtualGeoWeb-5.0.8",
        // config du logger
        "logger-cfg" : "Utils/Logger.cfg"
    }
});
