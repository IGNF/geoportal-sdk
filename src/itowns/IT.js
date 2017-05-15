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

        var wgs84TileLayer = {
            protocol : "tile",
            id : "wgs84"
        };

        this.libMap.viewer.addGeometryLayer(wgs84TileLayer);

        this._afterInitMap() ;
    } ;

    /**
     * Add a geoportal Layer to the map
     *
     * @param {Object} layerObj - geoportalLayer to add.
     * @param {Gp.LayerOptions} layerObj.geoportalLayerID - options of the layer
     *
     * @private
     */
    IT.prototype._addGeoportalLayer = function (layerObj, layerConf) {
        // ajout pour VG (pas de classe geoportalLayer sur l'extension VG)
        // FIXME à faire ailleurs
        var layerId = Object.keys(layerObj)[0] ;
        // Si on a bien un objet layerConf passé, on ajoute les params spécifiques VG
        if (layerConf) {
            layerObj[layerId].url = layerConf.getServerUrl(layerConf.apiKeys[0]) ;
            layerObj[layerId].outputFormat = layerObj[layerId].outputFormat || layerConf.getDefaultFormat() ;
            // Paramètres spécifiques aux couches WMS pour ajout avec VG
            if (layerObj[layerId].format === "WMS") {
                layerObj[layerId].version = layerObj[layerId].version || layerConf.serviceParams.version;
                layerObj[layerId].stylesName = layerObj[layerId].stylesName || layerConf.styles;
            }
            // Paramètres spécifiques aux couches WMTS pour ajout avec VG
            if (layerObj[layerId].format === "WMTS") {
                layerObj[layerId].tileMatrixSet = layerObj[layerId].tileMatrixSet || layerConf.getTMSID() ;
                layerObj[layerId].tileMatrixSetLimits = layerObj[layerId].tileMatrixSetLimits || layerConf.wmtsOptions.tileMatrixSetLimits;
                layerObj[layerId].layer = layerId || layerConf.getName() ;
                layerObj[layerId].styleName = layerObj[layerId].styleName || layerConf.getStyles()[0].name ;
            }
        }
        // Ajout de la couche avec VirtualGeo
        this._addRasterLayer(layerObj);

    } ;

    /**
     * Add a Raster Layer to the map
     *
     * @param {Object} layerObj - raster layer to add.
     * @param {Gp.LayerOptions} layerObj.geoportalLayerID - options of the layer
     *
     * @private
     */
    IT.prototype._addRasterLayer = function (layerObj) {
        var layerId = Object.keys(layerObj)[0] ;
        var layerOpts = layerObj[layerId] ;
        var layerNames;
        switch (layerOpts.format.toUpperCase()) {
            case "WMS":
                // FIXME : ajout d'un parametre projection pour les donnees
                this.logger.trace("ajout d'une couche WMS");
                if (layerOpts.layers && Array.isArray(layerOpts.layers)) {
                    // external wms layer case
                    layerNames = layerOpts.layers.toString();
                } else if (layerOpts.layers) {
                    // external wms layer case if it the user didnt give an array as layers parameter
                    layerNames = layerOpts.layers;
                    layerOpts.layers = [layerOpts.layers];
                } else {
                    // geoportal wms layer case
                    layerNames = layerId;
                    layerOpts.layers = [layerId];
                }
                if (layerOpts.minZoom) {
                    var maxScaleDenominator = this._getResolutionFromZoomLevel(layerOpts.minZoom) / 0.00028;
                }
                if (layerOpts.maxZoom) {
                    var minScaleDenominator = this._getResolutionFromZoomLevel(layerOpts.maxZoom) / 0.00028;
                }
                var layer = {
                    url : layerOpts.url,
                    protocol : layerOpts.format,
                    id : layerId,
                    title : layerOpts.title || layerId,
                    wmsOptions : {
                        mimetype : layerOpts.outputFormat,
                        name : layerNames,
                        style : layerOpts.styleName,
                        projection : layerOpts.projection || "EPSG:4326"
                    },
                    version : layerOpts.version,
                    minScaleDenominator : minScaleDenominator || null,
                    maxScaleDenominator : maxScaleDenominator || null,
                    processingOptions : layerOpts.processingOptions
                };
                break;
            case "WMTS":
                this.logger.trace("ajout d'une couche WMTS");
                // chargement des options par defaut
                var lOpts = this._getWMTSDefaultOpts() ;
                // surcharge avec les options utilisateurs
                for (var opt in layerOpts) {
                    lOpts[opt] = layerOpts[opt];
                }
                layerOpts = lOpts ;
                layer = {
                    url : layerOpts.url,
                    protocol : layerOpts.format.toLowerCase(),
                    id : layerId,
                    title : layerOpts.title || layerId,
                    updateStrategy : {
                        type : "0",
                        options : {}
                    },
                    options : {
                        tileMatrixSet : layerOpts.tileMatrixSet,
                        tileMatrixSetLimits : layerOpts.tileMatrixSetLimits,
                        mimetype : layerOpts.outputFormat,
                        name : layerOpts.layer,
                        style : layerOpts.styleName
                    },
                    version : layerOpts.version,
                    minScaleDenominator : minScaleDenominator || null,
                    maxScaleDenominator : maxScaleDenominator || null,
                    processingOptions : layerOpts.processingOptions
                };
                break;
            case "VIRTUALGEO":
                this.logger.trace("ajout d'une couche VirtualGeo");
                var layer = {
                    url : layerOpts.url,
                    protocol : layerOpts.format,
                    id : layerId,
                    title : layerOpts.title || layerId
                };
                break;
            default:
        }
        if (layer) {
            // le controle geoportalAttribution exploite la propriete _originators
            if (layerOpts.hasOwnProperty("originators")) {
                layer._originators = layerOpts.originators ;
            }

            // Dans le cas où aucune opacité n'est spécifiée
            if (!layerOpts.hasOwnProperty("opacity") || typeof(layerOpts.opacity) === "undefined") {
                // on la règle à 1 par défaut
                layerOpts.opacity = 1;
            }

            // Dans le cas où aucune visibilité n'est spécifiée
            if (!layerOpts.hasOwnProperty("visibility") || typeof(layerOpts.visibility) === "undefined") {
                // on la règle à "true" par défaut
                layerOpts.visibility = 1;
            }

            // on met à jour le tableau des couches
            this._layers.push({
                id : layerId,
                options : layerOpts
            }) ;
            if (layerOpts.isElevation === true) {
                // we add the noDataValue if it is given
                if (layerOpts.noDataValue) {
                    layer.noDataValue = layerOpts.noDataValue.toString();
                }
                // we add the noDataValueTolerance if it is given and if a nodata is given
                if (layerOpts.noDataValueTolerance && layerOpts.noDataValue) {
                    layer.noDataValueTolerance = layerOpts.noDataValueTolerance.toString();
                }
                // this will launch the addedLayer callback (dans "VG._onLayerChanged")
                this.libMap.addElevationLayer(layer) ;
                this.libMap.viewer.init();
            } else {
                var LSControl = this.getLibMapControl("layerswitcher");
                // if the LS already exists, we have to save the conf of the layer to add it to the LS
                if (LSControl) {
                    LSControl._addedLayerConf[layerId] = layerOpts;
                }
                var layerConf = JSON.parse(JSON.stringify(layerOpts));

                // we add the layer and refresh the itowns viewer
                this.libMap.viewer.addImageryLayer(layer) ;
                this.libMap.viewer.init();
            }

        }
    } ;

    /**
     * center Map on a given point
     *
     * @param {Object} point - center point
     * @param {Float} point.x - x coordinates for center
     * @param {Float} point.y - y coordinates for center
     *
     */
    IT.prototype.setXYCenter = function (point) {
         this.logger.trace("[IT] - setXYCenter") ;
         if ( !point.hasOwnProperty("x") || !point.hasOwnProperty("y")) {
             console.log("no valid coordinates for map center") ;
             return ;
         }
         // we keep the current range  
         var mapRange = this.libMap.viewer.getRange();

         var coordinates = {
             longitude : point.x,
             latitude : point.y,
             range : mapRange
         };

         this.libMap.viewer.setCenter(coordinates, false);
         this.libMap.viewer.init();
         this.logger.trace("[IT] - setXYCenter(" + point.x + "," + point.y + ")") ;
     };

    return IT;
});
