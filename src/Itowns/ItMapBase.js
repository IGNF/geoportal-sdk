import { IMap } from "../Interface/IMap";
import Logger from "../Utils/LoggerByDefault";
// itowns & extended extensions
import { itownsExtended } from "geoportal-extensions-itowns";
import { Coordinates } from "itowns";

/**
* Itowns IMap implementation class.
*
* @param {Object} opts - map options
* @constructor
* @private
*/
function ItMap (opts) {
    if (!(this instanceof ItMap)) {
        throw new TypeError("ItMap constructor cannot be called as a function.");
    }

    /**
    * Nom de la classe (heritage)
    */
    this.CLASSNAME = "ItMap";

    /**
     * Mode de visualisation (heritage)
     */
    if (!opts.mapOptions) opts.mapOptions = {};
    if (!opts.mapOptions.viewMode) opts.mapOptions.viewMode = "3d";

    // appel du constructeur par heritage,
    IMap.apply(this, arguments);

    this.logger = Logger.getLogger("ItMap");
    this.logger.trace("[Constructeur ItMap (options)]");
};

// heritage
ItMap.prototype = Object.create(IMap.prototype, {
    // getter/setter
});

/*
* Constructeur (alias)
*/
ItMap.prototype.constructor = ItMap;

/**
 * Empty Map initialization
 */
ItMap.prototype._initMap = function () {
    this.logger.trace("[ItMap]  : _initMap");

    var center;
    if (this.mapOptions.center && this.mapOptions.center.x && this.mapOptions.center.y) {
        center = new Coordinates("EPSG:4326", this.mapOptions.center.x, this.mapOptions.center.y, 0);
    } else {
        center = new Coordinates("EPSG:4326", 2, 48, 0);
    }

    // position à l'initialisation (si tilt == 90, on est dans le cas d'un switch 2d->3d, on incline à 45)
    var positionOnGlobe = {
        coord : center,
        zoom : this.mapOptions.zoom || 10,
        tilt : this.mapOptions.tilt !== 90 ? this.mapOptions.tilt : 45,
        heading : this.mapOptions.azimuth || 0
    };

    var viewerDiv = this.div;

    // creation de la map vide avec les paramètres de positionnement de la caméra
    this.libMap = new itownsExtended.GlobeViewExtended(viewerDiv, positionOnGlobe, {
        // to display the last zoom level of Ortho layer
        maxSubdivisionLevel : 18
    });

    var self = this;
    // when globe is loaded, we set the user map parameters
    var key = this.libMap.listen(itownsExtended.GlobeViewExtended.EVENTS.GLOBE_INITIALIZED, function () {
        // because itowns dispatch this event at each layer adding
        self.libMap.forgetByKey(key);

        // we show the div when globe is loaded
        window.setTimeout(function () {
            self.div.style.visibility = "";
        }, 1);

        // evenements pour faire la distinction entre le click et le drag
        var isDragging = false;

        var mousedownHandler = function () {
            isDragging = false;
        };
        var registredEvent = self._registerEvent(mousedownHandler, "pickFeature", mousedownHandler, self);
        registredEvent.eventOrigin = self.div;
        registredEvent.eventType = "mousedown";
        registredEvent.eventOrigin.addEventListener(registredEvent.eventType, mousedownHandler, self);

        var mousemoveHandler = function () {
            isDragging = true;
        };
        registredEvent = self._registerEvent(mousemoveHandler, "pickFeature", mousemoveHandler, self);
        registredEvent.eventOrigin = self.div;
        registredEvent.eventType = "mousemove";
        registredEvent.eventOrigin.addEventListener(registredEvent.eventType, mousemoveHandler, self);

        var mouseupHandler = function (evt) {
            // if clicking right or dragging
            if (evt.which === 3 || isDragging) {
                self._removeInfoDivs();
            } else {
                self._onMapClick(evt);
            }
        };
        registredEvent = self._registerEvent(mouseupHandler, "pickFeature", mouseupHandler, self);
        registredEvent.eventOrigin = self.div;
        registredEvent.eventType = "mouseup";
        registredEvent.eventOrigin.addEventListener(registredEvent.eventType, mouseupHandler, self);

        self._afterInitMap();
    });
};

/**
 * returns the Itowns.GlobeView object
 *
 * @return {Object} itowns globe
 */
ItMap.prototype.getLibMap = function () {
    return this.libMap;
};

/**
 * Destroy map by canceling all events listening and removing DOM elements
 */
ItMap.prototype.destroyMap = function () {
    // 1 - suppression de tous les listeners
    this.forgetAllListeners();
    // 2 - suppression de la div
    while (this.div.firstChild) {
        this.div.removeChild(this.div.firstChild);
    }
};

export { ItMap };
