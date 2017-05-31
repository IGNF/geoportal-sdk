define([
    "Utils/LoggerByDefault",
    "it",
    "gp",
    "IMap"
],
function (
    Logger,
    it,
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
        var viewerDiv = this.div;
        // creation de la map vide
        this.libMap = new itowns.GlobeView(viewerDiv, positionOnGlobe);
        var self = this;
        // when globe is loaded, we move forward
        this.libMap.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, function () {
            self._afterInitMap();
        });

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
                    type : layerOpts.type || "color",
                    url : layerOpts.url,
                    protocol : layerOpts.format,
                    id : layerId,
                    name : layerNames,
                    style : layerOpts.styleName || "normal",
                    title : layerOpts.title || layerId,
                    projection : layerOpts.projection || "EPSG:4326",
                    bbox : layerOpts.bbox || [-180, -90, 180, 90],
                    transparent : true,
                    waterMask : false,
                    options : {
                        mimetype : layerOpts.outputFormat
                    },
                    updateStrategy : {
                        type : 0,
                        options : {}
                    },
                    version : layerOpts.version
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
                    type : layerOpts.type || "color",
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
                this.libMap.addLayer(layer) ;
                // this.libMap.viewer.init();
            } else {
                var LSControl = this.getLibMapControl("layerswitcher");
                // if the LS already exists, we have to save the conf of the layer to add it to the LS
                if (LSControl) {
                    LSControl._addedLayerConf[layerId] = layerOpts;
                }
                var layerConf = JSON.parse(JSON.stringify(layerOpts));

                // we add the layer and refresh the itowns viewer
                this.libMap.addLayer(layer) ;
                // this.libMap.viewer.init();
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

         var coordinates = {
             longitude : point.x,
             latitude : point.y
         };
         // var coordinates = new itowns.Coordinates("EPSG:4326", point.x, point.y, mapRange);
         this.libMap.controls.setCameraTargetGeoPositionAdvanced(coordinates, false);
         // this.libMap.viewer.init();
         this.logger.trace("[IT] - setXYCenter(" + point.x + "," + point.y + ")") ;
     };

    /**
     * retourne les coordonnées courantes du centre de la carte
     */
    IT.prototype.getCenter = function () {
        var cameraCenter = this.libMap.controls.getCameraTargetGeoPosition();
        var center = {
            lon : cameraCenter.longitude(),
            lat : cameraCenter.latitude(),
            alt : cameraCenter.altitude()
        };
        return center;
    };

    /**
     * retourne le zoom Géoportail de la carte à partir de l'echelle courante de la carte
     */
    IT.prototype.getZoom = function () {
        // -1 pour se baser sur les zooms Gp
        var zoom = this.libMap.controls.getZoom() - 1;
        return zoom;
    };

    /**
     * Définit le niveau de zoom de la carte
     */
    IT.prototype.setZoom = function (zoom) {
        if ((parseFloat(zoom) !== parseInt(zoom, 10)) || isNaN(zoom)) {
            console.log("no valid zoomLevel") ;
            return ;
        }
        // On utilise la méthode setZoom d'iTowns (+1 pour se baser sur les zooms Gp)
        this.libMap.controls.setZoom(zoom + 1, false);
        this.logger.trace("[IT] - setZoom(" + zoom + ")") ;
    };

    /**
     * Incrémente le niveau de zoom de la carte de 1.
     */
    IT.prototype.zoomIn = function () {
        var zoom = this.getZoom();
        // On ne zoom pas si le zoom est à 21 (max)
        if (zoom === 20) {
            return;
        }
        this.setZoom(zoom + 1);
    };

    /**
     * Décrémente le niveau de zoom de la carte de 1.
     */
    IT.prototype.zoomOut = function () {
        var zoom = this.getZoom();
        // On ne dézoome pas si le zoom est à 0 (min)
        if (zoom === -1) {
            return;
        }
        this.setZoom(zoom - 1);
    };

    /**
     * retourne l'azimut courant de la carte
     */
    IT.prototype.getAzimuth = function () {
        return this.libMap.controls.getCameraOrientation()[1];
    };

    /**
     * définit le niveau de zoom de la carte
     */
    IT.prototype.setAzimuth = function (azimuth) {
        if (isNaN(azimuth)) {
            console.log("Not a valid azimuth : must be a float") ;
            return ;
        }
        // VG method to set the camera orientation
        this.libMap.controls.setHeading(azimuth, true);
        this.logger.trace("[VG] - setAzimuth(" + azimuth + ")") ;
    };

    /**
     * retourne l'inclinaison courante de la carte
     */
    IT.prototype.getTilt = function () {
        return this.libMap.controls.getCameraOrientation()[0];
    };

    /**
     * définit l'inclinaison de la caméra
     */
    IT.prototype.setTilt = function (tilt) {
        if (isNaN(tilt) || tilt < 0 || tilt > 90) {
            console.log("no valid tilt angle") ;
            return ;
        }
        // On utilise la méthode setCenterAdvanced pour
        // pouvoir désactiver l'animation d'inclinaison
        this.libMap.controls.setTilt(tilt, false);
        this.logger.trace("[VG] - setTilt(" + tilt + ")") ;
    };

    /**
     * Remove the layers listed to the map.
     *
     * @param {Array.<String>} layerIds - A list of layer's id or null.
     */
    IT.prototype.removeLayers = function (layerIds) {
         if (!IMap.prototype.removeLayers.apply(this,arguments)) {
             return false ;
         }
         if (!Array.isArray(layerIds)) {
             layerIds = [layerIds] ;
         }
         // ici on sait que layerIds est un tableau
         layerIds.forEach(function (_layerId) {
             this.libMap.removeLayer(_layerId) ;
         },
         this) ;

     } ;

    /**
     * retourne l'objet Itowns.GlobeView
     */
    IT.prototype.getLibMap = function () {
        return this.libMap;
    };

    return IT;
});
