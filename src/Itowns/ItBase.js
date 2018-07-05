import Loader from "../Utils/Loader";
import {IMap} from "../IMap";
import Logger from "../Utils/LoggerByDefault";
import {itownsExtended as Itowns} from "gp";

/**
* @param {Object} opts - map options
* Itowns IMap implementation class.
*/
function IT (opts) {
    if (!(this instanceof IT)) {
        throw new TypeError("IT constructor cannot be called as a function.");
    }

    /**
    * Nom de la classe (heritage)
    */
    this.CLASSNAME = "IT";

    // appel du constructeur par heritage,
    IMap.apply(this, arguments);

    this.logger = Logger.getLogger("IT");
    this.logger.trace("[Constructeur IT (options)]");
}

// heritage
IT.prototype = Object.create(IMap.prototype, {
    // getter/setter
});

/*
* Constructeur (alias)
*/
IT.prototype.constructor = IT;

/**
 * Empty Map initialization
 */
IT.prototype._initMap = function () {
    this.logger.trace("[IT]  : _initMap");

    var _enginePath3d = Loader.getEnginePath(this.mapOptions.enginePath3d);

    Loader.loadEngine(_enginePath3d,
        function (itowns) {
            this.logger.warn("Itowns engine, loaded...", itowns);

            function deepCopy (source, target) {
                for (var prop in source) {
                    if (source.hasOwnProperty(prop)) {
                        if (!target.hasOwnProperty(prop)) {
                            target[prop] = source[prop];
                        } else if (typeof source[prop] === "object") {
                            deepCopy(source[prop], target[prop]);
                        }
                    }
                }
            }

            // On fusionne les extensions et la librairie itowns
            deepCopy(itowns, Itowns);
            deepCopy(Itowns, itowns);

            // position à l'initialisation
            var positionOnGlobe = {
                longitude : this.mapOptions.center.x || 2,
                latitude : this.mapOptions.center.y || 48,
                altitude : 25000000
            };

            var viewerDiv = this.div;

            // creation de la map vide
            this.libMap = new Itowns.GlobeViewExtended(viewerDiv, positionOnGlobe, {
                // to display the last zoom level of Ortho layer
                maxSubdivisionLevel : 18
            });

            var self = this;
            // when globe is loaded, we set the user map parameters
            var key = this.libMap.listen(Itowns.GlobeViewExtended.EVENTS.GLOBE_INITIALIZED, function () {
                // because itowns dispatch this event at each layer adding
                self.libMap.forgetByKey(key);

                // we show the div when globe is loaded
                window.setTimeout(function () {
                    self.div.style.visibility = "";
                }, 1);
                // FIXME en attendant que la variable positionOnGlobe puisse prendre
                // un zoom / une echelle (et non une altitude) et les params necessaires.
                self.setZoom(parseFloat(self.mapOptions.zoom) || 10);
                self.setAzimuth(parseFloat(self.mapOptions.azimuth) || 0);
                self.setTilt(parseFloat(self.mapOptions.tilt) || 0);

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
        },
        function (error) {
            this.logger.warn("Itowns engine, failed...", error);
        },
        this);
};

/**
 * returns the Itowns.GlobeView object
 *
 * @return {Object} itowns globe
 */
IT.prototype.getLibMap = function () {
    return this.libMap;
};

export {IT};
