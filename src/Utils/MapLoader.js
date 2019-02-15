import Logger from "./LoggerByDefault";

/**
 * Geoportal map loader.
 *
 * Provide convenience method to create a Map (instance of {@link Gp.Map}) and attach it to a HTML element.
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
     *      Gp.Map.load(
     *          'geoportalMap',
     *          {
     *              apiKey : "YOUR_API_KEY",
     *              center : {
     *                  location : "rue pasteur, Saint-Mandé"
     *              },
     *              zoom : 16,
     *              layersOptions : {
     *                  'GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.STANDARD' : {}
     *              }
     *          }
     *      );
     * @returns {Gp.Map} _ The Geoportal map.
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

export {MapLoader};
