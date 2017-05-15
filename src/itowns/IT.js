define([
    "Utils/LoggerByDefault",
    "it",
    "gp",
    "IMap"
],
function (
    Logger,
    itowns,
    plugins, // Gp globale !?
    IMap
) {

    "use strict";

    /**
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

        // appel du constructeur par heritage
        IMap.apply(this, arguments);

        this.logger = Logger.getLogger("IT");
        this.logger.trace("[Constructeur IT (options)]");

    }

    /**
     * Proprietes observables des couches pour l'AHN
     */
    IT.LAYERPROPERTIES = {
        visible : "visibility",
        opacity : "opacity"
    };

    /**
     * Association controlId <-> classe VirtualGeo d'implemenation
     */
    /*IT.CONTROLSCLASSES = {
        mouseposition : itowns.MousePosition,
        layerswitcher : itowns.LayerSwitcher
    } ;
*/
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
        this.logger.trace("[IT] : _initMap") ;
        // creation de la view
        /* global itowns,document,GuiTools*/
        var positionOnGlobe = {
            longitude : 0,
            latitude : 0,
            altitude : 25000000
        };

        // iTowns namespace defined here
        var viewerDiv = document.getElementById("viewerDiv");
        // this.libMap = itowns;
        // creation de la map vide
        this.libMap = window.itowns;
        this.libMap.viewer.createSceneGlobe(positionOnGlobe, viewerDiv);
        this._afterInitMap() ;
    } ;

    /**
     * center Map on a given point
     *
     * @param {Object} point - center point
     * @param {Float} point.x - x coordinates for center
     * @param {Float} point.y - y coordinates for center
     * @param {String} point.projection - srs center coordinates
     */
    IT.prototype.setXYCenter = function (point) {
        this.logger.trace("[IT] - setXYCenter") ;
        if ( !point.hasOwnProperty("x") || !point.hasOwnProperty("y")) {
            console.log("no valid coordinates for map center") ;
            return ;
        }
        this.libMap.viewer.setCenter(point, false);
        this.logger.trace("[IT] - setXYCenter(" + point.x + "," + point.y + ")") ;
    };

    return IT;
});
