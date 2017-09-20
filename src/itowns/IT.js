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
        visible  : "visibility",
        opacity  : "opacity",
        sequence : "position"
    };

    /**
     * Association controlId <-> classe VirtualGeo d'implemenation
     */
    IT.CONTROLSCLASSES = {
        mouseposition  : itowns.control.MousePosition,
        layerswitcher  : itowns.control.LayerSwitcher,
        attributions : itowns.control.Attribution
    } ;

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
        this.logger.trace("[IT]  : _initMap") ;
        // position à l'initialisation
        var positionOnGlobe = {
            longitude  : 0,
            latitude  : 0,
            altitude  : 25000000
        };

        var viewerDiv = this.div;
        // creation de la map vide
        this.libMap = new itowns.GlobeViewExtended(viewerDiv, positionOnGlobe);
        var self = this;
        // when globe is loaded, we set the user map parameters
        this.libMap.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, function () {
            self._afterInitMap();
            // FIXME en attendant que la variable positionOnGlobe puisse prendre
            // un zoom / une echelle (et non une altitude) et les params necessaires.
            self.setZoom(self.mapOptions.zoom || 10);
            self.setAzimuth(self.mapOptions.azimuth || 0);
            self.setTilt(self.mapOptions.tilt || 0);
        });

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
        var maxScaleDenominator;
        var minScaleDenominator;
        var boundingBox;
        switch (layerOpts.format.toUpperCase()) {
            case "WMS" :
                // FIXME  : ajout d'un parametre projection pour les donnees
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
                if (layerOpts.bbox) {
                    boundingBox = {
                        west  : layerOpts.bbox[0],
                        east  : layerOpts.bbox[2],
                        south  : layerOpts.bbox[1],
                        north  : layerOpts.bbox[3]
                    };
                } else {
                    boundingBox = {
                        west  : -180,
                        east  : 180,
                        south  : -90,
                        north  : 90
                    };
                }
                if (layerOpts.minZoom) {
                    maxScaleDenominator = this._getResolutionFromZoomLevel(layerOpts.minZoom) / 0.00028;
                }
                if (layerOpts.maxZoom) {
                    minScaleDenominator = this._getResolutionFromZoomLevel(layerOpts.maxZoom) / 0.00028;
                }
                var layer = {
                    type  : layerOpts.type || "color",
                    url  : layerOpts.url,
                    protocol  : layerOpts.format,
                    id  : layerId,
                    name  : layerNames,
                    style  : layerOpts.styleName || "",
                    title  : layerOpts.title || layerId,
                    projection  : layerOpts.projection || "EPSG:4326",
                    extent  : boundingBox,
                    transparent  : true,
                    waterMask  : false,
                    featureInfoMimeType  : "",
                    dateTime  : "",
                    heightMapWidth  : 256,
                    options  : {
                        mimetype  : layerOpts.outputFormat
                    },
                    networkOptions : {
                        crossOrigin : "omit"
                    },
                    updateStrategy  : {
                        type  : 0,
                        options  : {}
                    },
                    version  : layerOpts.version || "1.3.0"
                };
                break;
            case "WMTS" :
                this.logger.trace("ajout d'une couche WMTS");
                // chargement des options par defaut
                var lOpts = this._getWMTSDefaultOpts() ;
                // surcharge avec les options utilisateurs
                for (var opt in layerOpts) {
                    lOpts[opt] = layerOpts[opt];
                }
                if (layerOpts.minZoom) {
                    maxScaleDenominator = this._getResolutionFromZoomLevel(layerOpts.minZoom) / 0.00028;
                }
                if (layerOpts.maxZoom) {
                    minScaleDenominator = this._getResolutionFromZoomLevel(layerOpts.maxZoom) / 0.00028;
                }
                layerOpts = lOpts ;
                layer = {
                    type  : layerOpts.type || "color",
                    url  : layerOpts.url,
                    protocol  : layerOpts.format.toLowerCase(),
                    id  : layerId,
                    title  : layerOpts.title || layerId,
                    updateStrategy  : {
                        type  : "0",
                        options  : {}
                    },
                    networkOptions : {
                        crossOrigin : "omit"
                    },
                    options  : {
                        tileMatrixSet  : layerOpts.tileMatrixSet,
                        tileMatrixSetLimits  : layerOpts.tileMatrixSetLimits || this._getTMSLimits(layerOpts.tileMatrixSet),
                        mimetype  : layerOpts.outputFormat,
                        name  : layerOpts.layer,
                        style  : layerOpts.styleName
                    },
                    version  : layerOpts.version,
                    minScaleDenominator  : minScaleDenominator || null,
                    maxScaleDenominator  : maxScaleDenominator || null,
                    processingOptions  : layerOpts.processingOptions
                };
                break;
            default :
        }
        if (layer) {
            // le controle geoportalAttribution exploite la propriete options.originators
            if (layerOpts.hasOwnProperty("originators")) {
                layer.options.originators = layerOpts.originators ;
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
                id  : layerId,
                options  : layerOpts,
                obj  : layer
            }) ;
            if (layerOpts.isElevation === true) {
                layer.type = "elevation";
                // we add the noDataValue if it is given
                if (layerOpts.noDataValue) {
                    layer.noDataValue = layerOpts.noDataValue.toString();
                }
                // we add the noDataValueTolerance if it is given and if a nodata is given
                if (layerOpts.noDataValueTolerance && layerOpts.noDataValue) {
                    layer.noDataValueTolerance = layerOpts.noDataValueTolerance.toString();
                }
            } else {
                var LSControl = this.getLibMapControl("layerswitcher");
                // if the LS already exists, we have to save the conf of the layer to add it to the LS
                if (LSControl) {
                    LSControl._addedLayerConf[layerId] = layerOpts;
                }
            }
            // we add the layer and refresh the itowns viewer
            // this will launch the addedLayer callback (dans "IT._onLayerChanged")
            this.libMap.addLayer(layer) ;

        }
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
                layerObj[layerId].tileMatrixSetLimits = layerObj[layerId].tileMatrixSetLimits || layerConf.wmtsOptions.tileMatrixSetLimit;
                layerObj[layerId].layer = layerId || layerConf.getName() ;
                layerObj[layerId].styleName = layerObj[layerId].styleName || layerConf.getStyles()[0].name ;
            }

        }
        // Ajout de la couche avec VirtualGeo
        this._addRasterLayer(layerObj);
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
            longitude  : point.x,
            latitude  : point.y
        };
        // set the camera aimed point on the specified coords
        this.libMap.controls.setCameraTargetGeoPositionAdvanced(coordinates, false);
        this.logger.trace("[IT] - setXYCenter(" + point.x + "," + point.y + ")") ;
    };

    /**
     * retourne les coordonnées courantes du centre de la carte
     */
    IT.prototype.getCenter = function () {
        var cameraCenter = this.libMap.controls.getCameraTargetGeoPosition();
        var center = {
            lon  : cameraCenter.longitude(),
            lat  : cameraCenter.latitude(),
            alt  : cameraCenter.altitude()
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
            console.log("Not a valid azimuth  : must be a float") ;
            return ;
        }
        var itownsAzimuth = azimuth + 90;
        if (itownsAzimuth >= 360) {
            itownsAzimuth = itownsAzimuth - 360;
        }
        // IT method to set the camera orientation
        this.libMap.controls.setHeading(itownsAzimuth, true);
        this.logger.trace("[IT] - setAzimuth(" + itownsAzimuth + ")") ;
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
        // methode setTilt d'itowns pour régler l'inclinaison
        this.libMap.controls.setTilt(tilt, false);
        this.logger.trace("[IT] - setTilt(" + tilt + ")") ;
    };

    /**
     * Adds mouse position control to the map.
     *
     * @param {Object} controlOpts - control options
     * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
     * @param {Boolean} controlOpts.maximised - if the control has to be opened or not.
     * @param {Array.<Object>} controlOpts.systems - List of coordinates systems available for display.
     * @param {String} controlOpts.systems.crs - Coordinates system ID.
     * @param {String} controlOpts.systems.label - label used to designate the CRS.
     * @param {String} controlOpts.systems.type - "Geographical" or "Metric"
     * @param {Array.<String>} controlOpts.units - units used for coordinates display ("m", "km" for Metric coordinates, "dec", "dms", "rad" or "gon" for geographical coordinates).
     * @param {Boolean} controlOpts.displayAltitude - (de)activate altitude display
     * @param {Boolean} controlOpts.displayCoordinates - (de)activate planimetric coorinates display.
     * @param {Object} controlOpts.altitude - altitude interaction specific configuration. Implementation specific.
     */
    IT.prototype.addMousePositionControl = function (controlOpts) {
        var mpOpts = {} ;
        if (controlOpts.div) {
            mpOpts.target = controlOpts.div ;
        }
        mpOpts.collapsed = controlOpts.maximised ? false  : true ;
        if (controlOpts.systems &&
            Array.isArray(controlOpts.systems) &&
            controlOpts.systems.length > 0 ) {
            for (var i = 0 ; i < controlOpts.systems.length ; i++ ) {
                /*
                if (!ol.proj.get(controlOpts.systems[i].crs)) {
                    // on retire les systèmes non définis
                    this.logger.trace("[IT] addMousePositionControl  : crs [" + controlOpts.systems[i].crs + "] not found." ) ;
                    continue ;
                }*/
                if (!mpOpts.systems) {
                    mpOpts.systems = [] ;
                }
                mpOpts.systems.push(controlOpts.systems[i]) ;
            }
        }
        if (controlOpts.units &&
            Array.isArray(controlOpts.units) &&
            controlOpts.units.length > 0 ) {
            mpOpts.units = [] ;
            for (var j = 0 ; j < controlOpts.units.length ; j++ ) {
                if ( typeof controlOpts.units[j] == "string") {
                    this.logger.trace("[IT] addMousePositionControl  : adding unit   [" + controlOpts.units[j].toUpperCase() ) ;
                    mpOpts.units.push(controlOpts.units[j]) ;
                }
            }
        }
        mpOpts.displayAltitude = controlOpts.displayAltitude ;
        mpOpts.displayCoordinates = controlOpts.displayCoordinates ;
        if (controlOpts.altitude) {
            mpOpts.altitude = controlOpts.altitude ;
        }
        var control = new itowns.control.MousePosition(mpOpts) ;
        this.libMap.addWidget( control );
        return control ;
    } ;

    /**
     * Adds LayerSwitcher control to the map.
     *
     * @param {Object} controlOpts - control options
     * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
     * @param {Boolean} controlOpts.maximised - if the control has to be opened or not.
     */
    IT.prototype.addLayerSwitcherControl = function (controlOpts) {
        this.logger.trace("[IT]  : addLayerSwitcherControl ... ");
        // TODO  : parametrage des couches
        var lsOpts = {
            layers  : controlOpts.layers || [],
            options  : {
                collapsed  : !(controlOpts && controlOpts.maximised)
            }
        } ;
        if (controlOpts.div) {
            lsOpts.options.target = controlOpts.div ;
        }
        // application des configuration des couches  :
        for (var i = 0 ; i < this._layers.length ; i++) {
            var layer = this._layers[i];
            // Si la couche est un MNT, on ne l'ajoute pas au layerSwitcher
            if (layer.obj.type !== "color") {
                continue;
            }
            this.logger.trace("[IT]  : layerSwitcher  : configuring layer  : " + layer.id) ;
            // INFO  : les couches Geoportail sont aussi configurées.
            var layerConf = {
                id : layer.id,
                layer  : layer.obj,
                config  : {}
            } ;
            if (layer.options.title) {
                this.logger.trace("[IT]  : layerSwitcher  : setting title to [" + layer.options.title + "] for layer " + layer.id) ;
                layerConf.config.title = layer.options.title ;
            }
            if (layer.options.description) {
                this.logger.trace("[IT  : layerSwitcher  : setting description to [" + layer.options.description + "] for layer " + layer.id) ;
                layerConf.config.description = layer.options.description ;
            }
            if (layer.options.quicklookUrl) {
                this.logger.trace("[IT]  : layerSwitcher  : setting quicklookUrl to [" + layer.options.quicklookUrl + "] for layer " + layer.id) ;
                layerConf.config.quicklookUrl = layer.options.quicklookUrl ;
            }
            if (layer.options.legends) {
                this.logger.trace("[IT]  : layerSwitcher  : setting legends to [" + layer.options.legends + "] for layer " + layer.id) ;
                layerConf.config.legends = layer.options.legends ;
            }
            if (layer.options.metadata) {
                this.logger.trace("[IT]  : layerSwitcher  : setting metadata to [" + layer.options.metadata + "] for layer " + layer.id) ;
                layerConf.config.metadata = layer.options.metadata ;
            }
            lsOpts.layers.push(layerConf) ;
        }

        this.logger.trace("[IT]  : layerSwitcher Opts  : ... ") ;
        var control = new itowns.control.LayerSwitcher(lsOpts) ;
        this.libMap.addWidget( control );
        return control ;
    };

    /**
     * Ajoute l'outil d'attributions
     *
     * @param {Object} controlOpts - options du controle
     */
    IT.prototype.addAttributionsControl = function (controlOpts) {
        var attOpts = {} ;
        attOpts.options = {};
        if (controlOpts.div) {
            attOpts.options.target = controlOpts.div ;
        }
        attOpts.options.collapsed = controlOpts.maximised ? false : true ;
        var control = new itowns.control.Attribution(attOpts);
        this.libMap.addWidget(control) ;
        return control ;
    } ;

    /**
     * Remove the controls listed to the map.
     *
     * @param {Array.<String>} controlIds - A list of control's id or null.
     */
    IT.prototype.removeControls = function (controlIds) {
        this.logger.trace("[IT]  : removeControls ... ");
        if (!controlIds || (Array.isArray(controlIds) && controlIds.length == 0) ) {
            console.log("No control to remove.") ;
            return ;
        }
        if (! Array.isArray(controlIds)) {
            controlIds = [controlIds] ;
        }
        var controlId = null ;
        for (var i = 0 ; i < controlIds.length ; i++ ) {
            controlId = controlIds[i] ;

            var idx = this._findRegisteredControl(controlId) ;
            if (idx >= 0) {
                this.logger.trace("[IT]  : removeControls  : removing [" + controlId + "] from register.");
                this._controls.splice(idx,1) ;

            }

            var itownsControl = this.getLibMapControl(controlId);

            if (!itownsControl) {
                console.log("Impossible to remove control [" + controlId + "]  : not found or unhandled") ;
                continue ;
            }

            this.logger.trace("[IT]  : removeControls  : removing [" + controlId + "] from Map.");
            this.libMap.removeWidget( itownsControl );
        }
    } ;

    /**
     * Returns implementation of the control
     *
     * @param {String} controlId - identifier of the control
     * @returns {Object} - implementation object of the control if it is on the map. null otherwise.
     */
    IT.prototype.getLibMapControl = function (controlId) {
        var foundItControl = null ;
        // verifications de base  : controlId est bien gere.
        if (!IT.CONTROLSCLASSES.hasOwnProperty(controlId.toLowerCase()) ||
            !IT.CONTROLSCLASSES[controlId.toLowerCase()] ) {
            this.logger.trace("[IT] getLibMapControl  : control " + controlId + " non implémenté.") ;
            return foundItControl ;
        }
        // on regarde du cote des controles
        var itControls = this.libMap.getWidgets() ;
        if ( !itControls || itControls.length == 0 ) {
            this.logger.trace("[IT] getLibMapControl  : no control found on map") ;
            return foundItControl ;
        }
        for (var j = 0 ; j < itControls.length ; j++ ) {
            this.logger.trace("[IT] getLibMapControl  : analyzing  : " + controlId);
            // test on control Name
            if (itControls[j].name && itControls[j].name.toLowerCase() === controlId.toLowerCase()) {
                foundItControl = itControls[j];
                this.logger.trace("[IT] getLibMapControl  : found GP Plugin Control ! ") ;
                break;
            }
        }
        if (!foundItControl) {
            this.logger.trace("[IT] getLibMapControl  : control " + controlId + " not found ! ") ;
        }

        return foundItControl ;
    } ;

    /**
     * Remove of the map the layers given as parameters
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
            if (this._getLayersObj(_layerId) && Array.isArray(this._getLayersObj(_layerId)) && this._getLayersObj(_layerId).length > 0) {
                this.libMap.removeLayer(_layerId) ;
            } else {
                console.log("[IT]  : Impossible to remove " + _layerId + " - not Found");
            }
        },
        this) ;

    } ;

    /**
     * Modify the layers'options listed to the map
     *
     * @param {Object} layersOptions - Layers to add to the map and their options. Associative array mapping official name of the Geoportal layer or the id of a personal layer (keys) with their properties (values given as {@link Gp.LayerOptions}).
     */
    IT.prototype.modifyLayers = function (layersOptions) {
        if (!IMap.prototype.modifyLayers.apply(this,arguments)) {
            return false ;
        }
        var layerIds = Object.keys(layersOptions) ;
        // on recupere les objets correspondants dejà sur la carte
        var _layerObjs = this._getLayersObj(layerIds) ;
        _layerObjs.forEach(function (_layerObj) {
            this.logger.trace("[IMap] modifyLayers  : modifying  : [" + _layerObj.id + "]") ;
            // traduction options ahn => options IT
            var commonOpts = this._applyCommonLayerParams(layersOptions[_layerObj.id]) ;
            // application des options IT aux couches IT
            // l'objet _layerObj.options sera mis à jour par le mécanisme des evenements.
            if (commonOpts.hasOwnProperty("opacity")) {
                this.logger.trace("[IMap] modifyLayers  : setting opacity of  : [" + _layerObj.id + "] to  : " + commonOpts.opacity) ;
                this._getItownsColorLayerById(_layerObj.id).opacity = commonOpts.opacity;
            }
            if (commonOpts.hasOwnProperty("visible")) {
                this.logger.trace("[IMap] modifyLayers  : setting visible of  : [" + _layerObj.id + "] to  : " + commonOpts.visible) ;
                this._getItownsColorLayerById(_layerObj.id).visible = commonOpts.visible;
            }
            if (commonOpts.hasOwnProperty("zIndex")) {
                this.logger.trace("[IMap] modifyLayers  : setting zIndex of  : [" + _layerObj.id + "] to  : " + commonOpts.zIndex) ;
                itowns.ColorLayersOrdering.moveLayerToIndex(this.libMap, _layerObj.id, commonOpts.zIndex);
            }
            /* TODO A compléter
            if (commonOpts.hasOwnProperty("minResolution")) {
                this.logger.trace("[IMap] modifyLayers  : setting minResolution of  : [" + _layerObj.id + "] to  : " + commonOpts.minResolution) ;
                _layerObj.obj.setMinResolution(commonOpts.minResolution) ;
            }
            if (commonOpts.hasOwnProperty("maxResolution")) {
                this.logger.trace("[IMap] modifyLayers  : setting maxResolution of  : [" + _layerObj.id + "] to  : " + commonOpts.maxResolution) ;
                _layerObj.obj.setMaxResolution(commonOpts.maxResolution) ;
            }
            */
        },
        this) ;
    } ;

    /**
     * get layer params from IT layer params
     * opacity, visibility, sequence
     *
     * @param {Object} itlayerOpts - options of the layer
     * @returns {Gp.LayerOptions} - object with common options
     *
     * @private
     */
    IT.prototype._getCommonLayerParams = function (itlayerOpts) {
        var commonOpts = {} ;
        this.logger.trace("[IT] : _getCommonLayerParams ");
        if (itlayerOpts.hasOwnProperty("opacity")) {
            this.logger.trace("[IT] : _getCommonLayerParams - opacity : " + itlayerOpts.opacity) ;
            commonOpts.opacity = itlayerOpts.opacity ;
        }
        if (itlayerOpts.hasOwnProperty("visible")) {
            this.logger.trace("[IT] : _getCommonLayerParams - visibility : " + itlayerOpts.visible) ;
            commonOpts.visibility = itlayerOpts.visible ;
        }
        if (itlayerOpts.hasOwnProperty("sequence")) {
            this.logger.trace("[IT] : _getCommonLayerParams - position : " + itlayerOpts.sequence) ;
            commonOpts.position = itlayerOpts.sequence ;
        }

        return commonOpts ;
    } ;

    /**
     * Apply params common to all kind of layers  :
     * opacity, visibility, minZoom, maxZoom
     *
     * @param {Gp.LayerOptions} layerOpts - options of the layer
     * @returns {Object} a itowns Layer constructor options object
     *
     * @private
     */
    IT.prototype._applyCommonLayerParams = function (layerOpts) {
        var commonOpts = {} ;
        this.logger.trace("[IT]  : _applyCommonLayerParams ");
        if (layerOpts.hasOwnProperty("opacity")) {
            this.logger.trace("[IT]  : _applyCommonLayerParams - opacity  : " + layerOpts.opacity) ;
            commonOpts.opacity = layerOpts.opacity ;
        }
        if (layerOpts.hasOwnProperty("visibility")) {
            this.logger.trace("[IT]  : _applyCommonLayerParams - visibility  : " + layerOpts.visibility) ;
            commonOpts.visible = layerOpts.visibility ;
        }
        if (layerOpts.hasOwnProperty("position")) {
            this.logger.trace("[IT]  : _applyCommonLayerParams - position  : " + layerOpts.position) ;
            commonOpts.zIndex = layerOpts.position ;
        }
        /* TODO à compléter
        if (layerOpts.hasOwnProperty("maxZoom") &&
            layerOpts.maxZoom >= 0 &&
            layerOpts.maxZoom <= 20 ) {
            var minRes = this._getResolutionFromZoomLevel(layerOpts.maxZoom) ;
            this.logger.trace("[OL3]  : _applyCommonLayerParams - minRes  : " + minRes) ;
            commonOpts.minResolution = minRes ;
        }
        if (layerOpts.hasOwnProperty("minZoom") &&
            layerOpts.minZoom >= 0 &&
            layerOpts.minZoom <= 20 ) {
            var maxRes = this._getResolutionFromZoomLevel(layerOpts.minZoom) ;
            this.logger.trace("[OL3]  : _applyCommonLayerParams - maxRes  : " + maxRes) ;
            commonOpts.maxResolution = maxRes ;
        }*/

        return commonOpts ;
    } ;

    /**
      * Associate a function to trigger when an event is received.
      *
      * @param {String} eventId - The map's event listened. Possible values are  : 'loaded', 'failure', 'geolocated', 'located', 'zoomchanged', 'azimuthchanged', 'tiltchanged', 'dragstart', 'drag', 'dragend', 'projectionchanged', 'layerchanged', 'controlchanged'.
      *
      * | eventId  | description |
      * |-|-|
      * | mapLoaded | fired when map has finished loading |
      * | mapFailure | fired when map has problem loading |
      * | geolocated | fired when map has finished centering by geolocation |
      * | located | fired when map has finished centering by geocoding |
      * | configured | fired when map has finished loading geoportal configuration |
      * | centerChanged | fired when map center has changed |
      * | zoomChanged | fired when map zoom has changed |
      * | azimuthChanged | fired when map orientation has changed |
      * | tiltChanged | fired when map tilt has changed |
      * | projectionChanged | fired when map projection has changed |
      * | layerChanged | fired when map's layer(s) has changed someway |
      * | controlChanged | fired when map's control(s) has changed |
      *
      * @param {Function} action - The function to execute when the event occures.
      * @param {Object} context - The object that will be used as "this" in the action function
      */
    IT.prototype.listen = function (eventId, action,context) {
        this.logger.trace("[IT]  : listen...") ;
        // verifications de base de la classe mère
        if (!IMap.prototype.listen.apply(this,arguments)) {
            return false ;
        }
        context = context || this ;
        var map = this ;
        var itEventKey = null ;
        switch (eventId) {
            case "mapLoaded"  :
            case "mapFailure"  :
                break ;
            case "located"  :
                // handled in IMap
                break ;
            case "geolocated"  :
                // handled in IMap
                break ;
            case "configured"  :
                // handled in IMap
                break ;
            case "centerChanged"  :
                /**
                * centerChanged callback
                */
                var callBackCenterChanged = function (itEvent) {
                    var centerChangedEvt = {} ;
                    if (!itEvent) {
                        return;
                    }
                    if (itEvent.previous) {
                        var oldCoords = itEvent.previous.cameraTarget.as("EPSG:4326");
                        centerChangedEvt.oldCenter = {
                            x  : oldCoords.longitude(),
                            y  : oldCoords.latitude()
                        } ;
                    }

                    if (itEvent.new) {
                        var newCoords = itEvent.new.cameraTarget.as("EPSG:4326");
                        centerChangedEvt.newCenter = {
                            x  : newCoords.longitude(),
                            y  : newCoords.latitude()
                        } ;
                    }
                    action.call(context,centerChangedEvt) ;
                };
                // ajout de l'evenement au tableau des événements
                var registredEvent = this._registerEvent(callBackCenterChanged,eventId,action,context) ;
                registredEvent.eventOrigin = this.libMap.controls;
                registredEvent.eventType = "camera-target-changed";
                registredEvent.eventOrigin.addEventListener(registredEvent.eventType, callBackCenterChanged, this) ;
                break ;
            case "zoomChanged"  :
                var oldZoom = this.libMap.controls.getZoom();
                /**
                * zoomChanged callback
                */
                var callbackZoomchange = function (itEvent) {
                    // on récupère le zoom
                    var newZoom = context.libMap.controls.getZoom();
                    // si le zoom n'a pas changé, on sort
                    if (newZoom === oldZoom) {
                        return;
                    }
                    action.call(context,{
                        oldZoom  : oldZoom,
                        newZoom  : newZoom
                    }) ;
                    // update the oldZoom vale
                    oldZoom = newZoom;
                };

                // ajout de l'evenement au tableau des événements
                var registredEvent = this._registerEvent(callbackZoomchange,eventId,action,context) ;
                registredEvent.eventOrigin = this.libMap.controls;
                registredEvent.eventType = "range-changed";
                // on écoute le range (et non le zoom, non implémenté côté itowns)
                registredEvent.eventOrigin.addEventListener(registredEvent.eventType, callbackZoomchange, this) ;
                break ;
            case "azimuthChanged"  :
                /**
                * azimuthChanged callback
                */
                var callbackAzimuthchange = function (itEvent) {
                    if (itEvent.new.heading === itEvent.previous.heading) {
                        return;
                    }
                    action.call(context,{
                        oldAzimuth  : itEvent.previous.heading,
                        newAzimuth  : itEvent.new.heading
                    }) ;
                };
                // ajout de l'evenement au tableau des événements
                var registredEvent = this._registerEvent(callbackAzimuthchange,eventId,action,context) ;
                registredEvent.eventOrigin = this.libMap.controls;
                registredEvent.eventType = "orientation-changed";
                registredEvent.eventOrigin.addEventListener(registredEvent.eventType, callbackAzimuthchange, this) ;
                break ;
            case "tiltChanged"  :
                /**
                * tiltChanged callback
                */
                var callbackTiltchange = function (itEvent) {
                    if (itEvent.new.tilt === itEvent.previous.tilt) {
                        return;
                    }
                    action.call(context,{
                        oldTilt  : itEvent.previous.tilt,
                        newTilt  : itEvent.new.tilt
                    }) ;
                };
                // ajout de l'evenement au tableau des événements
                var registredEvent = this._registerEvent(callbackTiltchange,eventId,action,context) ;
                registredEvent.eventOrigin = this.libMap.controls;
                registredEvent.eventType = "orientation-changed";
                registredEvent.eventOrigin.addEventListener(registredEvent.eventType, callbackTiltchange, this) ;
                break ;
            case "projectionChanged"  :
                // TODO  : interet ?
                break ;
            case "layerChanged"  :
                /**
                * layerAdded callback
                */
                var callbackLayerAdded = function (itevt) {
                    var ladded = itevt ;
                    var layerIndex;
                    var layerOpts = map._getLayerOpts(ladded.layerId) ;
                    var itColorLayer = map._getItownsColorLayerById(Object.keys(layerOpts)[0]);

                    if (itColorLayer && itColorLayer.sequence >= 0) {
                        layerIndex = itColorLayer.sequence;
                    } else {
                        // if itColorLayer is not defined, the layer is an MNT  : we set its layerIndex to -1
                        layerIndex = -1;
                    }
                    if (!layerOpts) {
                        map.logger.trace("[IT] listen  : enregistrement d'une couche 'inconnue'.") ;
                        // layerOpts = map._registerUnknownLayer(ladded) ;
                    }

                    // if itColorLayer is undefined, it is an MNT  : the sequence is set to -1
                    action.call(context,{
                        layerAdded  : layerOpts,
                        position  : layerIndex
                    }) ;
                } ;
                // ajout de l'evenement au tableau des événements
                var registredEvent = this._registerEvent(callbackLayerAdded,eventId,action,context) ;
                registredEvent.eventOrigin = this.libMap;
                registredEvent.eventType = "layer-added";
                // abonnement à un ajout de couche
                registredEvent.eventOrigin.addEventListener(registredEvent.eventType, callbackLayerAdded, this) ;

                /**
                * layerRemoved callback
                */
                var callbackLayerRemoved = function (itevt) {
                    var lremoved = itevt;
                    var layerOpts = map._getLayerOpts(lremoved.layerId) || map._getLayerOpts(lremoved.layerId, map._layersRemoved) ;
                    action.call(context,{
                        layerRemoved  : layerOpts
                    }) ;
                };

                // ajout de l'evenement au tableau des événements
                var registredEvent = this._registerEvent(callbackLayerRemoved,eventId,action,context) ;
                registredEvent.eventOrigin = this.libMap;
                registredEvent.eventType = "layer-removed";
                // abonnement à un retrait de couche
                registredEvent.eventOrigin.addEventListener(registredEvent.eventType, callbackLayerRemoved, this) ;

                // abonnement à un changement de propriete sur chaque couche
                for (var obsProperty in IT.LAYERPROPERTIES) {
                    this.libMap.getColorLayers().forEach(function (itLayer) {
                        var layerOpts = map._getLayerOpts(itLayer.id) ;

                        /** callbackLayerChanged */
                        var callbackLayerChanged = function (itevt) {
                            var key = itevt.type.replace("-property-changed","");
                            var oldItObj = {} ;
                            oldItObj[key] = itevt.previous[key] ;
                            var oldCommonProp = map._getCommonLayerParams(oldItObj) ;
                            var newItObj = {} ;
                            newItObj[key] = itevt.new[key] ;
                            var newCommonProp = map._getCommonLayerParams(newItObj) ;

                            action.call(context,{
                                property : IT.LAYERPROPERTIES[key],
                                oldValue : oldCommonProp[IT.LAYERPROPERTIES[key]],
                                newValue : newCommonProp[IT.LAYERPROPERTIES[key]],
                                layerChanged : layerOpts
                            }) ;
                        };

                        // ajout de l'evenement au tableau des événements
                        var registredEvent = map._registerEvent(callbackLayerChanged,eventId,action,context) ;
                        registredEvent.eventOrigin = itLayer;
                        registredEvent.eventType = obsProperty + "-property-changed";
                        registredEvent.eventOrigin.addEventListener(registredEvent.eventType, callbackLayerChanged, this) ;
                    });
                };

                break ;
            case "controlChanged"  :
                break ;
            default  :
                console.log("unhandled event  : " + eventId ) ;
        } ;
        // enregistrement de l'evenement
        if (itEventKey) {
            this._registerEvent(itEventKey,eventId,action,context) ;
        }
        return true ;
    } ;

    /**
      * Cancel an event listening.
      *
      * @param {String} eventId - The map's event to forget. Possible values are  :
      *
      * | eventId  | description |
      * |-|-|
      * | mapLoaded | fired when map has finished loading |
      * | mapFailure | fired when map has problem loading |
      * | geolocated | fired when map has finished centering by geolocation |
      * | located | fired when map has finished centering by geocoding |
      * | configured | fired when map has finished loading geoportal configuration |
      * | centerChanged | fired when map center has changed |
      * | zoomChanged | fired when map zoom has changed |
      * | azimuthChanged | fired when map orientation has changed |
      * | tiltChanged | fired when map tilt has changed |
      * | projectionChanged | fired when map projection has changed |
      * | layerChanged | fired when map's layer(s) has changed someway |
      * | controlChanged | fired when map's control(s) has changed |
      *
      * @param {Function} action - The function associated to the event.
      */
    IT.prototype.forget = function (eventId, action) {

        this.logger.trace("[IT]  : forget...") ;
        // verifications de base de la classe mère
        if (!IMap.prototype.forget.apply(this,arguments)) {
            return false ;
        }
        // on cherche l'enregistrement de l'evenement
        var rEvents = this._events[eventId] ;
        if (!rEvents) {
            console.log("nothing to forget for  : " + eventId) ;
            return false ;
        }
        var itCallback = null;
        for (var i = rEvents.length - 1 ; i >= 0 ; i--) {
            if (rEvents[i].action == action) {
                itCallback = rEvents[i].key ;
                eventOrigin = rEvents[i].eventOrigin;
                eventType = rEvents[i].eventType;
                if (!itCallback) {
                    console.log("action to forget not found for  : " + eventId) ;
                    return false ;
                }
                rEvents.splice(i,1) ;
                this.logger.trace("[IT]  : forgetting  : " + eventId + " (" + itCallback + ")") ;

                eventOrigin.removeEventListener(eventType, itCallback);
            }
        }
        if (!rEvents) {
            console.log("action to forget not found for  : " + eventId) ;
            return false ;
        }

    } ;

    /**
     * retourne l'objet Itowns.GlobeView
     */
    IT.prototype.getLibMap = function () {
        return this.libMap;
    };

    /**
     * Trouve l'objet layerOpts correspondant au layer IT
     *
     * @param {String} layerId - layer id
     */
    IT.prototype._getLayerOpts = function ( layerId, layersStack ) {
        var layerOpts = null ;
        layersStack = layersStack || this._layers ;
        for (var i = 0; i < layersStack.length; i++ ) {
            var l = layersStack[i] ;
            if (l.id === layerId) {
                this.logger.trace("[IT]  : found layer  : " + l.id) ;
                layerOpts = {} ;
                layerOpts[l.id] = l.options ;
                break ;
            }
        }
        return layerOpts ;
    } ;

    /**
     * Trouve la couche iTowns via son id
     *
     * @param {String} layerId - IT layer id
     */
    IT.prototype._getItownsColorLayerById = function ( layerId ) {
        var layer = this.libMap.getLayers(function (layer) {
            if (layer.id === layerId && layer.type === "color") {
                return layer;
            }
        });
        if ( !layer[0] ) {
            this.logger.trace("[IT]  : no colorLayer found for this id") ;
            return;
        }
        return layer[0] ;
    } ;

    /**
     * Gets Layer Container div ID for a given layerId.
     *
     * @param {String} layerId - layer identifier
     * @returns {String} - Layer Container div Id in the LayerSwitcher
     */
    IT.prototype.getLSLayerContainerDivId = function ( layerId ) {
        var id = null ;
        var idxLS = this._findRegisteredControl("layerswitcher") ;
        if (idxLS < 0) {
            this.logger.trace("[IT] : getLSLayerContainerDivId : no layerswitcher on map !") ;
            return id ;
        }
        var itlayers = this._getLayersObj([layerId]) ;
        if (itlayers.length > 0) {
            var itLayerList = this._controls[idxLS].obj._layerListContainer ;
            var divId = itLayerList.id;
            var uid = divId.substring(divId.indexOf("-"));
            if (itLayerList && itLayerList.childNodes) {
                for (var layerDivKey = 0; layerDivKey < itLayerList.childNodes.length; layerDivKey++) {
                    if (itLayerList.childNodes[layerDivKey].id === "GPlayerSwitcher_ID_" + layerId + uid) {
                        var foundId = "GPlayerSwitcher_ID_" + layerId + uid;
                        return foundId;
                    }
                }
            }
        }
        this.logger.trace("[IT] : getLSLayerContainerDivId : layer [" + layerId + "] not found on map !") ;
        return id ;
    } ;

    /**
     * Registers unknown unregistered layer
     *
     * @param {Object} layerObj -  IT layer
     * @returns {Object} - new layer index in this._layers
     */
    IT.prototype._registerUnknownLayer = function ( layerObj ) {
        // couches de résultat (itineraire, isochrone)
        /*var layerId = "unknownLayer" ;
        if (layerObj.hasOwnProperty("gpResultLayerId")) {
            // isochrones  : [GraphName]$GEOPORTAIL :GPP :Isocurve
            // itineraire  : [GraphName]$GEOPORTAIL :GPP :Itineraire
            layerId = layerObj.gpResultLayerId ;
        }
        // on rajoute un timestamp
        layerId += "-" + Date.now() ;
        this._layers.push({
            id  : layerId,
            obj  : layerObj,
            options  : {}
        }) ;
        var layerOpts = {} ;
        layerOpts[layerId] = {} ;*/

        return {} ;
    } ;

    /**
      * retrieve max TMSLimits
      *
      */
    IT.prototype._getTMSLimits = function (TMSID) {
        if (TMSID === "PM") {
            var TMSlimits = {
                0  : {
                    minTileRow  : "0",
                    maxTileRow  : "1",
                    minTileCol  : "0",
                    maxTileCol  : "1"
                },
                1  : {
                    minTileRow  : "0",
                    maxTileRow  : "2",
                    minTileCol  : "0",
                    maxTileCol  : "2"
                },
                2 : {
                    minTileRow  : "0",
                    maxTileRow  : "4",
                    minTileCol  : "0",
                    maxTileCol  : "4"
                },
                3  : {
                    minTileRow  : "0",
                    maxTileRow  : "8",
                    minTileCol  : "0",
                    maxTileCol : "8"
                },
                4 : {
                    minTileRow : "0",
                    maxTileRow : "16",
                    minTileCol : "0",
                    maxTileCol : "16"
                },
                5 : {
                    minTileRow : "0",
                    maxTileRow : "32",
                    minTileCol : "0",
                    maxTileCol : "32"
                },
                6 : {
                    minTileRow : "0",
                    maxTileRow : "64",
                    minTileCol : "0",
                    maxTileCol : "64"
                },
                7 : {
                    minTileRow : "0",
                    maxTileRow : "128",
                    minTileCol : "0",
                    maxTileCol : "128"
                },
                8 : {
                    minTileRow : "0",
                    maxTileRow : "256",
                    minTileCol : "0",
                    maxTileCol : "256"
                },
                9 : {
                    minTileRow : "0",
                    maxTileRow : "512",
                    minTileCol : "0",
                    maxTileCol : "512"
                },
                10 : {
                    minTileRow : "0",
                    maxTileRow : "1024",
                    minTileCol : "0",
                    maxTileCol : "1024"
                },
                11 : {
                    minTileRow : "0",
                    maxTileRow : "2048",
                    minTileCol : "0",
                    maxTileCol : "2048"
                },
                12 : {
                    minTileRow : "0",
                    maxTileRow : "4096",
                    minTileCol : "0",
                    maxTileCol : "4096"
                },
                13 : {
                    minTileRow : "0",
                    maxTileRow : "8192",
                    minTileCol : "0",
                    maxTileCol : "8192"
                },
                14 : {
                    minTileRow : "0",
                    maxTileRow : "16384",
                    minTileCol : "0",
                    maxTileCol : "16384"
                },
                15 : {
                    minTileRow : "0",
                    maxTileRow : "32768",
                    minTileCol : "0",
                    maxTileCol : "32768"
                },
                16 : {
                    minTileRow : "0",
                    maxTileRow : "65536",
                    minTileCol : "0",
                    maxTileCol : "65536"
                },
                17 : {
                    minTileRow : "0",
                    maxTileRow : "131072",
                    minTileCol : "0",
                    maxTileCol : "131072"
                },
                18 : {
                    minTileRow : "0",
                    maxTileRow : "262144",
                    minTileCol : "0",
                    maxTileCol : "262144"
                },
                19 : {
                    minTileRow : "0",
                    maxTileRow : "524288",
                    minTileCol : "0",
                    maxTileCol : "524288"
                },
                20 : {
                    minTileRow : "0",
                    maxTileRow : "1048576",
                    minTileCol : "0",
                    maxTileCol : "1048576"
                },
                21 : {
                    minTileRow : "0",
                    maxTileRow : "2097152",
                    minTileCol : "0",
                    maxTileCol : "2097152"
                }
            };
            return TMSlimits;
        }

        this.logger.trace("[IT]  : no TMS Limits found for this TMS id") ;
        return;
    };

    return IT;
});
