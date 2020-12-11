import Logger from "./LoggerByDefault";

/**
 * Geoportal map loader.
 *
 * Provide convenience method to create a Map and attach it to a HTML element.
 *
 * @module
 * @alias Gp.Map.load()
 */
var MapLoader = {
    /**
     * Initialize a Geoportal map in an HTML element.
     *
     * @method load
     * @static
     * @param {String | DOMElement} div - The HTML element or its id where the map will be loaded.
     * @param {Gp.MapOptions} [mapOptions] - Options for loading the map.
     * @example
     *   var map = Gp.Map.load(
     *          'viewer-map',
     *          {
     *              apiKey: "YOUR_API_KEY",
     *              reloadConfig: true,
     *              isWebGL2: false,
     *              enginePath3d: "path/to/itowns.js",
     *              viewMode: "3d",
     *              center: {
     *                  location: "rue pasteur, Saint-Mandé"
     *              },
     *              zoom: 16,
     *              tilt: 0,
     *              azimuth: 45,
     *              controlsOptions: {
     *                  mousePosition: {},
     *                  search: { maximised : true }
     *              },
     *              mapEventsOptions: {
     *                    "mapLoaded": window.initMap,
     *                    "layerChanged": window.callbackLayerChanged,
     *                    "zoomChanged": window.callbackZoomChanged,
     *                    "centerChanged": window.callbackCenterChanged,
     *                    "azimuthChanged": window.callbackAzimuthChanged,
     *                    "tiltChanged": window.callbackTiltChanged
     *              },
     *              layersOptions: {
     *                  'GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.STANDARD': {}
     *              }
     *          }
     *    );
     *
     *    // abonnement à l'evenement "mapLoaded"
     *    map.listen("mapLoaded", function (e) { console.log("objet map", e); });
     *
     * @returns {Gp.Map} - The Geoportal map.
     */
    load : function (div, mapOptions) {
        var logger = Logger.getLogger("MapLoader.load");

        // checking required parameter : div
        if (!div) {
            throw new Error("missing parameter div !");
        }
        if (typeof div === "string") {
            div = document.getElementById(div);
        }
        if (!div) {
            throw new Error("HTML element with id [" + div + "] not found.");
        }

        if (!mapOptions) {
            mapOptions = {};
        }

        // view mode by default
        if (!mapOptions.hasOwnProperty("viewMode")) {
            mapOptions.viewMode = "2d";
        }

        // auto detect lib. loaded
        var Map2d = null;
        var Map3d = null;

        if (this.__class2d !== null && typeof this.__class2d === "function") {
            Map2d = this.__class2d;
        }

        if (this.__class3d !== null && typeof this.__class3d === "function") {
            Map3d = this.__class3d;
        }

        // TODO => autres implementations

        // creating the library map instance
        var objMap = null;

        var viewMode = mapOptions.viewMode;
        switch (viewMode) {
            case "2d":
                logger.trace("construction de la carte 2D");
                if (Map2d === null || typeof Map2d !== "function") {
                    throw new Error("library ol is not loaded !");
                }

                objMap = new Map2d({
                    div : div,
                    mapOptions : mapOptions
                });

                break;
            case "3d":
                logger.trace("construction du globe 3D");
                if (Map3d === null || typeof Map3d !== "function") {
                    throw new Error("library itowns is not loaded !");
                }

                objMap = new Map3d({
                    div : div,
                    mapOptions : mapOptions
                });

                break;
            default:
                throw new Error("not supported view mode");
        }

        return objMap;
    }
};

export { MapLoader };
