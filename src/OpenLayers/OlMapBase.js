import Logger from "../Utils/LoggerByDefault";
import { IMap } from "../Interface/IMap";
import View from "ol/View";
import Map from "ol/Map";

/**
 * OpenLayers IMap implementation class.
 *
 * @param {Object} opts - map options
 * @constructor
 * @private
 */
function OlMap (opts) {
    if (!(this instanceof OlMap)) {
        throw new TypeError("OlMap constructor cannot be called as a function.");
    }

    /**
     * Nom de la classe (heritage)
     */
    this.CLASSNAME = "OlMap";

    /**
     * Mode de visualisation (heritage)
     */
    if (!opts.mapOptions) opts.mapOptions = {};
    if (!opts.mapOptions.viewMode) opts.mapOptions.viewMode = "2d";

    // appel du constructeur par heritage.
    IMap.apply(this, arguments);

    this.logger = Logger.getLogger("OlMap");
    this.logger.trace("[Constructeur OlMap (options)]");
};

// heritage
OlMap.prototype = Object.create(IMap.prototype, {
    // todo
    // getter/setter
});

/*
 * Constructeur (alias)
 */
OlMap.prototype.constructor = OlMap;

/**
 * Empty Map initialization
 */
OlMap.prototype._initMap = function () {
    this.logger.trace("[OlMap] : _initMap");
    // creation de la view
    var viewParams = {
        // center : [center.x, center.y],
        enableRotation : this.mapOptions.enableRotation,
        zoom : this.mapOptions.zoom,
        minZoom : this.mapOptions.minZoom,
        maxZoom : this.mapOptions.maxZoom,
        projection : this.mapOptions.projection,
        rotation : this.mapOptions.azimuth * Math.PI / 180
    };

    // openlayers create an extent by itself if none is given
    if (this.mapOptions.extent) {
        viewParams.extent = this.mapOptions.extent;
    }

    var view = new View(viewParams);

    // creation de la map vide
    this.libMap = new Map({
        // interactions : interactions,
        target : this.div,
        view : view
        // controls : controls
    });

    this._afterInitMap();
};

/**
 * retourne la carte ol.Map
 * @return {Object} openlayers map
 */
OlMap.prototype.getLibMap = function () {
    return this.libMap;
};

/**
 * Destroy map by canceling all events listening and removing DOM elements
 */
OlMap.prototype.destroyMap = function () {
    // 1 - suppression de tous les listeners
    this.forgetAllListeners();
    // 2 - suppression de la div
    this.libMap.setTarget(null);
};

export { OlMap };
