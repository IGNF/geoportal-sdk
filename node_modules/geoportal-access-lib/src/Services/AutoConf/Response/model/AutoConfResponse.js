
/**
 * Response object for {@link module:Services~getConfig Gp.Services.getConfig ()} invocation when successful. Received as the argument of onSuccess callback function.
 *
 * @property {Object} generalOptions - General properties for default map configuration resources.
 * @property {Object} generalOptions.apiKeys - Object that associates apiKey (s) with an array of resources IDs availables with that key.
 * @property {String} generalOptions.title - Underlying web service Title.
 * @property {String} generalOptions.defaultGMLGFIStyle - XSL URL used by default to translate an XML GetFeatureInfo response into an HTML array.
 * @property {String} generalOptions.theme - default theme (FIXME : for what ?)
 * @property {Array.<Float>} generalOptions.wgs84Resolutions - geographical resolutions Array for each [zoom level of the Geoportal platform]{@link http://api.ign.fr/tech-docs-js/webmaster/layers.html#Geoportal_resolutions} from 0 to 21. Expressed in degrees/pixel.
 * @property {Object} layers - Associative array mapping resources availables IDs (keys) with their properties (values given as {@link Gp.Services.Config.Layer}).
 * @property {Object} territories - Associative array mapping french territories IDs (keys) with their properties (values given as {@link Gp.Services.Config.Territory}).
 * @property {Object} tileMatrixSets - Associative Array mapping TileMatrixSets IDs (keys) availables with their properties (values given as {@link Gp.Services.Config.TileMatrixSet}).
 * @property {Object} services - Associative Array mapping Geoportal web services IDs (keys) availables with their properties (values given as {@link Gp.Services.Config.Service}).
 *
 * @namespace
 * @alias Gp.Services.GetConfigResponse
 */
function AutoConfResponse () {
    if (!(this instanceof AutoConfResponse)) {
        throw new TypeError("AutoConfResponse constructor cannot be called as a function.");
    }

    this.generalOptions = {
        apiKeys : {},
        title : null,
        defaultGMLGFIStyle : null,
        theme : null,
        wgs84Resolutions : []
    };

    this.layers = {};

    this.territories = {};

    this.tileMatrixSets = {};

    this.services = {};
}

AutoConfResponse.prototype = {

    /*
     * Constructor (alias)
     */
    constructor : AutoConfResponse,

    /**
     * Check if config is loaded for a given key
     *
     * @param {String} apiKey - Access key to Geoportal platform
     * @returns {Boolean} isConfLoaded - true if config is already loaded, false otherwise
     */
    isConfLoaded : function (apiKey) {
        if (!apiKey) {
            return;
        }
        if (this.generalOptions.apiKeys[apiKey]) {
            return true;
        }
        return false;
    },

    /**
     * Returns an array of Geoportal layers identifiers, corresponding to an API contract key.
     *
     * @param {String} apiKey - Access key to Geoportal platform
     * @returns {Array} apiKeys - Array of geoportal layers identifiers
     */
    getLayersId : function (apiKey) {
        return this.generalOptions.apiKeys[apiKey];
    },

    /**
     * Returns an associative array of Geoportal layers configurations, corresponding to an API contract key.
     * If no key is specified, all layers from configuration are returned.
     *
     * @param {String} apiKey - Access key to Geoportal platform
     * @returns {Object} layers - Object which properties are layers identifiers, and corresponding
     *      values are instances of <Gp.Services.Config.Layer>.
     */
    getLayersConf : function (apiKey) {
        var layers = {};
        var layersIdArray = this.getLayersId(apiKey);
        if (layersIdArray) {
            for (var i = 0; i < layersIdArray.length; i++) {
                var lyrId = layersIdArray[i];
                layers[lyrId] = this.layers[lyrId];
            }
        }
        return layers;
    },

    /**
     * Returns a geoportal layer configuration, given its identifier
     *
     * @param {String} layerId - Geoportal layer identifier (e.g. "GEOGRAPHICALGRIDSYSTEMS.MAPS$GEOPORTAIL:OGC:WMTS")
     * @return {Object} layer - Layer configuration : instance of {@link Gp.Services.Config.Layer}
     */
    getLayerConf : function (layerId) {
        if (!this.layers) {
            return;
        }
        return this.layers[layerId];
    },

    /**
     * Returns an associative array of Tile Matrix Sets configurations.
     *
     * @return {Object} tileMatrixSets - Object which properties are TMS identifiers,
     *      and corresponding values are instances of {@link Gp.Services.Config.TileMatrixSet}.
     */
    getTileMatrixSets : function () {
        return this.tileMatrixSets;
    },

    /**
     * Returns a Tile Matrix Sets configuration, given its identifier.
     *
     * @param {String} tmsID - Tile Matrix Set identifier (e.g. : "PM")
     * @return {Object} tileMatrixSet - Tile Matrix Set configuration, instance of {@link Gp.Services.Config.TileMatrixSet}
     */
    getTMSConf : function (tmsID) {
        if (!this.tileMatrixSets) {
            return;
        }
        return this.tileMatrixSets[tmsID];
    },

    /**
     * Returns an associative array of territories configurations.
     *
     * @return {Object} territories - Object which properties are territory identifiers,
     *      and corresponding values are instances of {@link Gp.Services.Config.Territory}.
     */
    getTerritories : function () {
        return this.territories;
    },

    /**
     * Returns a territory configuration, given its identifier.
     *
     * @param {String} territoryID - territory identifier (e.g. "FXX")
     * @return {Object} territory - Territory configuration, instance of {@link Gp.Services.Config.Territory}
     */
    getTerritoryConf : function (territoryID) {
        if (!this.territories) {
            return;
        }
        return this.territories[territoryID];
    },

    /**
     * Returns an associative array of services configurations.
     *
     * @return {Object} services - Object which properties are services identifiers,
     *      and corresponding values are instances of {@link Gp.Services.Config.Service}.
     */
    getServices : function () {
        return this.services;
    },

    /**
     * Returns a service configuration, given its identifier.
     *
     * @param {String} serviceID - service identifier (e.g. "OGC:WMTS")
     * @return {Object} service - service configuration, instance of {@link Gp.Services.Config.Service}
     */
    getServiceConf : function (serviceID) {
        if (!this.services) {
            return;
        }
        return this.services[serviceID];
    }

};

export default AutoConfResponse;
