import Logger from "../Utils/LoggerByDefault";
import {IMap} from "../IMap";
import {olExtended as Ol} from "gp";

/**
 * OL IMap implementation class.
 *
 * @param {Object} opts - map options
 */
function OL (opts) {
    if (!(this instanceof OL)) {
        throw new TypeError("OL constructor cannot be called as a function.");
    }

    /**
     * Nom de la classe (heritage)
     */
    this.CLASSNAME = "OL";

    // appel du constructeur par heritage.
    IMap.apply(this, arguments);

    this.logger = Logger.getLogger("OL");
    this.logger.trace("[Constructeur OL (options)]");
};

// heritage
OL.prototype = Object.create(IMap.prototype, {
    // todo
    // getter/setter
});

/*
 * Constructeur (alias)
 */
OL.prototype.constructor = OL;

/**
 * Empty Map initialization
 */
OL.prototype._initMap = function () {
    this.logger.trace("[OL] : _initMap");
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
OL.prototype.getLibMap = function () {
    return this.libMap;
};

export {OL};
