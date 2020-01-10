import { IMap } from "../Interface/IMap";
import Logger from "../Utils/LoggerByDefault";
import { Engine3DLoader } from "../Utils/Engine3DLoader";
// itowns & extended extensions
import { itownsExtended } from "geoportal-extensions-itowns";
import * as itowns from "itowns";

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

    /**
     * Variable interne : les extensions itowns
     */
    this.Itowns = itownsExtended;

    // fonction de copie des properties
    function deepCopy (source, target) {
        // Implementing Tail Call Elimination
        function tce (source, target) {
            for (var prop in source) {
                if (source.hasOwnProperty(prop)) {
                    if (!target.hasOwnProperty(prop)) {
                        target[prop] = source[prop];
                    } else if (typeof source[prop] === "object") {
                        tce(source[prop], target[prop]);
                    }
                }
            }
        }
        return tce(source, target);
    }

    // INFO sur le mode de chargement d'itowns :
    // - si l'option est renseignée, c'est le mode differé de la lib itowns, et on charge
    // le bundle (delayLoadingEngine:true)
    // - sinon, on utilse la lib interne d'itowns, et elle est en mode modules ES6
    // (delayLoadingEngine:false)

    // mais, on désactive le mode differé..., pour le moment !
    var delayLoadingEngine = false; // (this.mapOptions.enginePath3d) ? true : false;
    if (delayLoadingEngine) {
        this.logger.warn("Itowns engine, loading differed mode is not yet implemented !");

        var _enginePath3d = Engine3DLoader.getEnginePath(this.mapOptions.enginePath3d);
        Engine3DLoader.loadEngine(_enginePath3d,
            function (itowns) {
                this.logger.warn("Itowns engine, loaded...", itowns);

                // INFO
                // il faudrait faire de l'import dynamique du module des extensions
                // mais c'est assez difficile à realiser..., car je ne sais pas comment
                // transmettre la dependance 'itowns' au module des extensions !?
                // Ex.
                // import("geoportal-extensions-itowns").then(module => {
                //     // do something with the translations
                //     console.log("geoportal-extensions-itowns", module);
                //     this.Itowns = module.itownsExtended;
                // });
            },
            function (error) {
                this.logger.warn("Itowns engine, failed...", error);
            },
            this);
    } else {
        // On fusionne les extensions et la librairie itowns
        if (itowns) {
            deepCopy(itowns, this.Itowns);
            deepCopy(this.Itowns, itowns);
        }

        var center;
        if (this.mapOptions.center) {
            center = new this.Itowns.Coordinates('EPSG:4326', this.mapOptions.center.x, this.mapOptions.center.y, 0);
        } else {
            center = new this.Itowns.Coordinates('EPSG:4326', 2, 48, 0);
        }

        // position à l'initialisation
        var positionOnGlobe = {
            coord: center,
            zoom: this.mapOptions.zoom || 10,
            tilt: this.mapOptions.tilt || 45,
            heading: this.mapOptions.azimuth || 0
        };

        // const positionOnGlobe = {
        //     coord: new itowns.Coordinates('EPSG:4326', 2.3465, 48.88, 0),
        //     zoom: 10,
        //     tilt: 45,
        //     heading: 0
        // };

        var viewerDiv = this.div;

        // creation de la map vide
        this.libMap = new this.Itowns.GlobeViewExtended(viewerDiv, positionOnGlobe, {
            // to display the last zoom level of Ortho layer
            maxSubdivisionLevel : 18
        });

        var self = this;
        // when globe is loaded, we set the user map parameters
        var key = this.libMap.listen(this.Itowns.GlobeViewExtended.EVENTS.GLOBE_INITIALIZED, function () {
            // because itowns dispatch this event at each layer adding
            self.libMap.forgetByKey(key);

            // we show the div when globe is loaded
            window.setTimeout(function () {
                self.div.style.visibility = "";
            }, 1);
            // FIXME en attendant que la variable positionOnGlobe puisse prendre
            // un zoom / une echelle (et non une altitude) et les params necessaires.

            // if (parseFloat(self.mapOptions.zoom) > 14) {
            //     self.mapOptions.zoom = 14;
            // }

            // self.setZoom(self.mapOptions.zoom);

            // self.setAzimuth(parseFloat(self.mapOptions.azimuth) || 0);
            // self.setAutoCenter(self.mapOptions.center, self.mapOptions.zoom);

            // if a tilt is set
            //if (self.mapOptions.tilt !== 90) {
            //    self.setTilt(self.mapOptions.tilt);
            //}

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
    }
};

/**
 * returns the Itowns.GlobeView object
 *
 * @return {Object} itowns globe
 */
ItMap.prototype.getLibMap = function () {
    return this.libMap;
};

export { ItMap };
