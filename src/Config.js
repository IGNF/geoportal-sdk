/* global requirejs */

requirejs.config({
    baseUrl : "",
    paths : {
        // lib external
        log4js      : "../lib/external/woodman/woodman-amd",
        ol          : "../lib/external/ol3/ol",
        vg          : "../lib/external/virtual/js/VirtualGeoWeb-5.0.11",
        itowns      : "../lib/external/itowns/js/itowns",
        gp          : "../lib/external/geoportail/plugins-ol3/GpPluginOl3-src",
        // "plugins-itowns" : "../lib/external/geoportail/plugins-mix/GpPluginOl3Itowns-src",
        // "plugins-vg"    : "../lib/external/geoportail/plugins-vg/GpPluginVg-src",
        // "plugins-ol3"   : "../lib/external/geoportail/plugins-ol3/GpPluginOl3-src",
        // "plugins-mix"   : "../lib/external/geoportail/plugins-mix/GpPluginOl3Vg-src",

        // config du logger
        "logger-cfg" : "Utils/Logger.cfg"
    }
});
