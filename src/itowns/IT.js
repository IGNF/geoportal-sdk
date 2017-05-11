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
            longitude : 2.3465,
            latitude : 48.88,
            altitude : 25000000
        };

        // iTowns namespace defined here
        var viewerDiv = document.getElementById("viewerDiv");
        itowns.viewer.createSceneGlobe(positionOnGlobe, viewerDiv);
    } ;
    /**
     * Empty Map initialization
     */
    IT.prototype.testFunction = function () {
        console.log("test function is coming");
    };

    return IT;
});
