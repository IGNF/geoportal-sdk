import Logger from "../Utils/LoggerByDefault";
import {IMap} from "../Interface/IMap";
import {olExtended as Ol} from "gp";

/**
 * OpenLayers IMap implementation class.
 *
 * @param {Object} opts - map options
 */
function OlMap (opts) {
    if (!(this instanceof OlMap)) {
        throw new TypeError("OlMap constructor cannot be called as a function.");
    }

    /**
     * Nom de la classe (heritage)
     */
    this.CLASSNAME = "OlMap";

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
    var view = new Ol.View({
        // center : [center.x, center.y],
        enableRotation : this.mapOptions.enableRotation,
        zoom : this.mapOptions.zoom,
        minZoom : this.mapOptions.minZoom,
        maxZoom : this.mapOptions.maxZoom,
        projection : this.mapOptions.projection,
        rotation : this.mapOptions.azimuth * Math.PI / 180
    });

    // creation de la map vide
    this.libMap = new Ol.Map({
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

export {OlMap};
