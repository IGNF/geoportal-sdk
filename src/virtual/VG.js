/* globals VirtualGeo: true */
define([
    "Utils/LoggerByDefault",
    "vg",
    "plugins-vg",
    "IMap"
],
function (
    Logger,
    vg,
    plugins,
    IMap
) {

    "use strict";

    /**
    * VG IMap implementation class.
    */
    function VG (opts) {

        if (!(this instanceof VG)) {
            throw new TypeError("VG constructor cannot be called as a function.");
        }

        /**
        * Nom de la classe (heritage)
        */
        this.CLASSNAME = "VG";

        // appel du constructeur par heritage
        IMap.apply(this, arguments);

        this.logger = Logger.getLogger("VG");
        this.logger.trace("[Constructeur VG (options)]");

    }

    /**
     * Proprietes observables des couches pour l'AHN
     */
    VG.LAYERPROPERTIES = {
        visible : "visibility",
        opacity : "opacity"
    };

    /**
     * Association controlId <-> classe VirtualGeo d'implemenation
     */
    VG.CONTROLSCLASSES = {
        zoom : VirtualGeo.ZoomControl,
        overview : VirtualGeo.MiniMapControl,
        orientation : VirtualGeo.PanRotateControl,
        graphicscale : VirtualGeo.ScaleBarControl,
        mouseposition : VirtualGeo.MousePosition,
        layerswitcher : VirtualGeo.LayerSwitcher,
        drawing : VirtualGeo.DrawingControl,
        attributions : VirtualGeo.IPRControl
    } ;

    // heritage
    VG.prototype = Object.create(IMap.prototype, {
        // getter/setter
    });

    /*
    * Constructeur (alias)
    */
    VG.prototype.constructor = VG;

    /**
     * Empty Map initialization
     */
    VG.prototype._initMap = function () {
        this.logger.trace("[VG] : _initMap") ;
        var contexte = this;
        // creation de la view
        this.libMap = new VirtualGeo.Map({
            // the VirtualGeo Licensekey for a GP API use
            licenseKey : "aYiISRmYJscMAt2dfooROdTl7iktDWFGKHIc5qMYA89PNpr8lURHGtKA7GlACI6kSZN2QXLZTMoOXAOrCZHQ067K",
            enginePath : this.mapOptions.enginePath3d || "",
            target : this.div.id,
            useSky : true,
            /**
            * Actions à mener lorsque le globe est créé
            * Ajout du/des MNTs
            */
            whenLoaded : function (map) {
                contexte._afterInitMap();
            }
        });

    };

    /**
     * Overload the map initialisation with constructor parameters (after _initMap call)
     * needed to set the rotation and tilt of the 3D camera
     *
     * @private
     */
    VG.prototype._afterInitMap = function () {
        var afterInit = IMap.prototype._afterInitMap;
        afterInit.apply(this);
        // Overload of IMap._afterInitMap to set the camera
        // position (tilt/zoom/heading) with the 3D API, after the map is loaded
        this.setTilt(this.mapOptions.tilt);
        this.setZoom(this.mapOptions.zoom);
        this.setAzimuth(this.mapOptions.azimuth);
        // Add mapClick listener to show featureInfo
        this.libMap.addEventListener("centerchanged", this._removeInfoDivs);
        this.libMap.addEventListener("orientationchanged", this._removeInfoDivs);
        this.div.addEventListener("click",this._onMapClick.bind(this));

    } ;

    /**
     * center Map on a given point
     *
     * @param {Object} point - center point
     * @param {Float} point.x - x (lon) coordinates for center
     * @param {Float} point.y - y (lat) coordinates for center
     * @param {String} point.projection - srs center coordinates
     */
    VG.prototype.setXYCenter = function (point) {
        this.logger.trace("[VG] - setXYCenter") ;
        if ( !point.hasOwnProperty("x") || !point.hasOwnProperty("y")) {
            console.log("No valid coordinates for map center") ;
            return ;
        }
        // center the camera with the current camera orientation and zoom settings
        var center = {
            lon : point.x,
            lat : point.y,
            heading : this.libMap.getHeading() || 0,
            tilt : this.libMap.getTilt() || 0,
            zoom : this.libMap.getZoomLevel() || 12
        };
        // FIXME en dur pour la 3D
        var mapProj = "EPSG:4326" ;

        this.libMap.setCenterAdvanced(center, true);
        this.logger.trace("[VG] - setXYCenter(" + point.x + "," + point.y + "), projection Map : " + mapProj) ;

        // FIXME : markerFeature
        // if (this.markerFeature)
        //    this.markerFeature.setGeometry(new ol.geom.Point(geocodeCenter));
    };

    /**
     * retourne les coordonnées courantes du centre de la carte
     */
    VG.prototype.getCenter = function () {
        var center = this.libMap.getCenter();
        return center;
    };

    /**
     * Retourne les coordonnées de l'extent de la vue courante
     */
    VG.prototype.getViewExtent = function () {
        var vgExtent = this.libMap.getViewExtent();
        var viewExtent = {
            left : vgExtent.west,
            right : vgExtent.east,
            top : vgExtent.north,
            bottom : vgExtent.south
        };
        return viewExtent;
    };

    /**
     * retourne l'azimut courant de la carte
     */
    VG.prototype.getAzimuth = function () {
        return this.libMap.getHeading();
    };

    /**
     * définit le niveau de zoom de la carte
     */
    VG.prototype.setAzimuth = function (azimuth) {
        if (isNaN(azimuth)) {
            console.log("Not a valid azimuth : must be a float") ;
            return ;
        }
        // VG method to set the camera orientation
        this.libMap.setHeading(azimuth, true);
        this.logger.trace("[VG] - setAzimuth(" + azimuth + ")") ;

    };
    /**
     * retourne le zoom Géoportail de la carte à partir de l'echelle courante de la carte
     */
    VG.prototype.getZoom = function () {
        var zoomScale = this.libMap.getZoomScale();
        var zoom = 0;
        var scales = IMap.WMTSDEFAULTS["EPSG:3857"].scales;
        // get the nearest zoomLevel from the retrieved scaleLevel by the 3D API
        for (var zoomLevel in scales) {
            if (scales[zoomLevel] >= zoomScale && scales[zoomLevel] < scales[zoom]) {
                zoom = parseInt(zoomLevel, 10);
            }
        }
        return zoom;
    };

    /**
     * Définit le niveau de zoom de la carte (en utilisant setZoomScale)
     */
    VG.prototype.setZoom = function (zoom) {
        if ((parseFloat(zoom) !== parseInt(zoom, 10)) || isNaN(zoom)) {
            console.log("no valid zoomLevel") ;
            return ;
        }
        var zoomScale = IMap.WMTSDEFAULTS["EPSG:3857"].scales[zoom];
        var currentCenter = this.libMap.getCenter();
        var zoomLvl = {
            lon : currentCenter.lon,
            lat : currentCenter.lat,
            scale : zoomScale
        };
        // On utilise la méthode setCenterAdvanced pour
        // pouvoir désactiver l'animation de zoom
        this.libMap.setCenterAdvanced(zoomLvl, true);
        this.logger.trace("[VG] - setZoom(" + zoom + ")") ;

    };

    /**
     * Incrémente le niveau de zoom de la carte de 1.
     */
    VG.prototype.zoomIn = function () {
        this.libMap.setZoomLevel(this.libMap.getZoomLevel() - 1);
    };

    /**
     * Décrémente le niveau de zoom de la carte de 1.
     */
    VG.prototype.zoomOut = function () {
        this.libMap.setZoomLevel(this.libMap.getZoomLevel() + 1);
    };

    /**
     * retourne l'inclinaison de courante de la caméra
     */
    VG.prototype.getTilt = function () {
        return this.libMap.getTilt();
    };

    /**
     * définit l'inclinaison de la caméra
     */
    VG.prototype.setTilt = function (tilt) {
        if (isNaN(tilt) || tilt < 0 || tilt > 90) {
            console.log("no valid tilt angle") ;
            return ;
        }
        var currentCenter = this.libMap.getCenter();
        var tiltAngle = {
            lon : currentCenter.lon,
            lat : currentCenter.lat,
            tilt : tilt
        };
        // On utilise la méthode setCenterAdvanced pour
        // pouvoir désactiver l'animation d'inclinaison
        this.libMap.setCenterAdvanced(tiltAngle, true);
        this.logger.trace("[VG] - setTilt(" + tilt + ")") ;
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
    VG.prototype.addMousePositionControl = function (controlOpts) {
        var mpOpts = {
            options : {
                collapsed : !(controlOpts && controlOpts.maximised)
            }
        } ;
        if (controlOpts.div) {
            mpOpts.options.div = controlOpts.div ;
        }
        mpOpts.collapsed = controlOpts.maximised ? false : true ;
        if (controlOpts.systems &&
            Array.isArray(controlOpts.systems) &&
            controlOpts.systems.length > 0 ) {
            for (var i = 0 ; i < controlOpts.systems.length ; i++ ) {
                /*
                if (!ol.proj.get(controlOpts.systems[i].crs)) {
                    // on retire les systèmes non définis
                    this.logger.trace("[VG] addMousePositionControl : crs [" + controlOpts.systems[i].crs + "] not found." ) ;
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
                    this.logger.trace("[VG] addMousePositionControl : adding unit   [" + controlOpts.units[j].toUpperCase() ) ;
                    mpOpts.units.push(controlOpts.units[j]) ;
                }
            }
        }
        mpOpts.displayAltitude = controlOpts.displayAltitude ;
        mpOpts.displayCoordinates = controlOpts.displayCoordinates ;
        if (controlOpts.altitude) {
            mpOpts.altitude = controlOpts.altitude ;
        }
        var control = new VirtualGeo.MousePosition(mpOpts);
        this.libMap.addControl(control);

        return control ;
    } ;

    /**
     * Adds LayerSwitcher control to the map.
     *
     * @param {Object} controlOpts - control options
     * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
     * @param {Boolean} controlOpts.maximised - if the control has to be opened or not.
     */
    VG.prototype.addLayerSwitcherControl = function (controlOpts) {
        this.logger.trace("[VG] : addLayerSwitcherControl ... ");
        // TODO : parametrage des couches
        var lsOpts = {
            layers : [],
            options : {
                collapsed : !(controlOpts && controlOpts.maximised)
            }
        } ;
        if (controlOpts.div) {
            lsOpts.options.div = controlOpts.div ;
        }
        // application des configuration des couches :
        for (var i = 0 ; i < this._layers.length ; i++) {
            var layer = this._layers[i] ;
            // Si la couche est un MNT, on ne l'ajoute pas au layerSwitcher
            if (layer.options.isElevation === true) {
                continue;
            }
            this.logger.trace("[VG] : layerSwitcher : configuring layer : " + layer.id) ;
            // INFO : les couches Geoportail sont aussi configurées.
            var layerConf = {
                layer : layer.obj,
                config : {}
            } ;
            if (layer.options.title) {
                this.logger.trace("[VG] : layerSwitcher : setting title to [" + layer.options.title + "] for layer " + layer.id) ;
                layerConf.config.title = layer.options.title ;
            }
            if (layer.options.description) {
                this.logger.trace("[VG] : layerSwitcher : setting description to [" + layer.options.description + "] for layer " + layer.id) ;
                layerConf.config.description = layer.options.description ;
            }
            if (layer.options.quicklookUrl) {
                this.logger.trace("[VG] : layerSwitcher : setting quicklookUrl to [" + layer.options.quicklookUrl + "] for layer " + layer.id) ;
                layerConf.config.quicklookUrl = layer.options.quicklookUrl ;
            }
            if (layer.options.legends) {
                this.logger.trace("[VG] : layerSwitcher : setting legends to [" + layer.options.legends + "] for layer " + layer.id) ;
                layerConf.config.legends = layer.options.legends ;
            }
            if (layer.options.metadata) {
                this.logger.trace("[VG] : layerSwitcher : setting metadata to [" + layer.options.metadata + "] for layer " + layer.id) ;
                layerConf.config.metadata = layer.options.metadata ;
            }
            lsOpts.layers.push(layerConf) ;
        }

        this.logger.trace("[VG] : layerSwitcher Opts : ... ") ;
        var control = new VirtualGeo.LayerSwitcher(lsOpts) ;
        this.libMap.addControl(control) ;
        return control ;
    } ;

    /**
     * Adds zoomControl to the map.
     *
     * @param {Object} controlOpts - control options
     * @param {Boolean} controlOpts.displayBar - Display the bar or not, default is true
     */
    VG.prototype.addZoomControl = function (controlOpts) {
        this.logger.trace("[VG] addZoomControl : ... ") ;
        var ovControlOptions = {};
        if (controlOpts) {
            ovControlOptions = controlOpts;
        }
        var control = new VirtualGeo.ZoomControl(ovControlOptions) ;
        this.libMap.addControl(control) ;

        return control ;
    } ;

    /**
     * Adds orientationControl to the map.
     *
     * @param {Object} controlOpts - control options
     * @param {Boolean} controlOpts.displayResetTilt - Show a button to reset the tilt, default is true
     * @param {Boolean} controlOpts.displayTurnAround - Show a button to turn around the center point, default is true
     */
    VG.prototype.addOrientationControl = function (controlOpts) {
        this.logger.trace("[VG] addOrientationControl : ... ") ;
        var ovControlOptions = {};
        if (controlOpts) {
            ovControlOptions = controlOpts;
        }
        var control = new VirtualGeo.PanRotateControl(ovControlOptions) ;
        this.libMap.addControl(control) ;

        return control ;
    } ;

    /**
     * Adds overview map to the map.
     *
     * @param {Object} controlOpts - control options
     * @param {Number} controlOpts.x - The x position of the minimap in the page from the left border of the map window
     * @param {Number} controlOpts.y - The y position of the minimap in the page from the bottom border of the map window
     * @param {Number} controlOpts.width - The width of the minimap
     * @param {Number} controlOpts.height - The height of the minimap
     */
    VG.prototype.addOverviewControl = function (controlOpts) {
        this.logger.trace("[VG] addOverviewControl : ... ") ;
        var ovControlOptions = {};
        if (controlOpts) {
            ovControlOptions = controlOpts;
        }
        var control = new VirtualGeo.MiniMapControl(ovControlOptions) ;
        this.libMap.addControl(control) ;
        // hide the div if maximised option = false
        if (document.getElementById("VirtualGeo_MiniMap")) {
            if (controlOpts.maximised == false) {
                document.getElementById("VirtualGeo_MiniMap").style.display = "none";
            } else {
                document.getElementById("VirtualGeo_MiniMap").style.display = "inline";
            }
        }
        if (controlOpts.div && document.getElementById("VirtualGeo_MiniMap")) {
            document.getElementById(controlOpts.div).appendChild(document.getElementById("VirtualGeo_MiniMap"));
        }

        return control ;
    } ;

    /**
     * Ajoute l'echelle graphique sur la carte
     *
     * @param {Object} controlOpts - options du controle
     */
    VG.prototype.addGraphicScaleControl = function (controlOpts) {
        this.logger.trace("[VG] addGraphicScaleControl...") ;
        var control = new VirtualGeo.ScaleBarControl();
        this.libMap.addControl(control) ;
        // hide the div if maximised option = false
        if (document.getElementById("VirtualGeo_ScaleBar")) {
            if (controlOpts.maximised == false) {
                document.getElementById("VirtualGeo_ScaleBar").style.display = "none";
            } else {
                document.getElementById("VirtualGeo_ScaleBar").style.display = "inline";
            }
        }
        if (controlOpts && controlOpts.div && document.getElementById("VirtualGeo_ScaleBar")) {
            document.getElementById(controlOpts.div).appendChild(document.getElementById("VirtualGeo_ScaleBar"));
        }
        return control ;
    } ;

    /**
    * Ajoute l'outil d'attributions
    *
    * @param {Object} controlOpts - options du controle
    */
    VG.prototype.addAttributionsControl = function (controlOpts) {
        // if the div already exist, we clean it
        if (document.getElementById("VirtualGeo_IPR")) {
            document.getElementById("VirtualGeo_IPR").parentNode.removeChild(document.getElementById("VirtualGeo_IPR"));
        }
        if (!document.getElementById("VirtualGeo_IPR")) {
            this.logger.trace("[VG] addAttributionsControl...");
            var control = new VirtualGeo.IPRControl();
            control.listenToMap("centerchanged", this._displayOriginators.bind(this));
            control.listenToMap("zoomchanged", this._displayOriginators.bind(this));
            control.listenToMap("layeradded", this._displayOriginators.bind(this));
            control.listenToMap("layerremoved", this._displayOriginators.bind(this));
            this.libMap.addControl(control);
            this._displayOriginators();
            if (document.getElementById("VirtualGeo_IPR")) {
                if (controlOpts.maximised == false) {
                    document.getElementById("VirtualGeo_IPR").style.display = "none";
                } else {
                    document.getElementById("VirtualGeo_IPR").style.display = "inline";
                }
            }
        }
        if (controlOpts && controlOpts.div && document.getElementById(controlOpts.div) && document.getElementById("VirtualGeo_IPR")) {
            document.getElementById(controlOpts.div).appendChild(document.getElementById("VirtualGeo_IPR"));
            return control;
        } else {
            // call the function again after 500 milliseconds if the footer DOM is not totally created (IE11 bug)
            setTimeout(this.addAttributionsControl, 500);
        }
    };

    /**
    * Method use as callback of listenToMap, used to display appropriate
    * originators
    */
    VG.prototype._displayOriginators = function () {
        var layersAHN = this._layers;
        var mapAttributions = {};
        var countLayerAttribution;
        var extent = this.getViewExtent();
        var bbox = [extent.top, extent.left, extent.bottom, extent.right];
        var zoomLevel = this.getZoom();
        for (var i = 0; i < layersAHN.length; i++) {
            // srcAttributionHtml : html, composed of all layer's attributions html
            // empty by default
            var srcAttributionHtml = "";
            // if the view is further that the farthest zoom defined for the layer
            // we do not display its originators
            if (zoomLevel >= layersAHN[i].options.minZoom ) {
                // count the number of attributions associated to a layer
                countLayerAttribution = 0;
                // give all the attributions of the layer based on the zoom and extend
                // constraints of the originators
                var layerAttributions = Gp.LayerUtils.getAttributions({
                    extent : bbox,
                    crs : "EPSG:4326",
                    zoom : this.getZoom(),
                    visibility : layersAHN[i].obj.visible,
                    originators : layersAHN[i].options.originators
                });

                for ( var j = 0; j < layerAttributions.length; j++ ) {
                    var attributionj = layerAttributions[j];
                    // check that this attribution hasn't been added yet for another layer
                    if ( !mapAttributions || !mapAttributions[attributionj] ) {
                        if (countLayerAttribution != 0) {
                            // if it is not the first attribution of the layer, we add a separator
                            // (several attributions for the same layer)
                            srcAttributionHtml = srcAttributionHtml + "| " + attributionj;
                        } else {
                            // add attribution html to source attributions html
                            srcAttributionHtml += attributionj;
                        }
                        // add attribution to mapAttributions, to manage all layers attributions
                        mapAttributions[attributionj] = true;
                        countLayerAttribution ++;
                    }
                };
            }
            // VG method to add attribution on the map (automatically add the separator between the layers)
            // an empty attribution "" deletes the layer IPR
            this.libMap.setLayerIPR({
                id : layersAHN[i].id,
                ipr : srcAttributionHtml
            });
        }
    };

    /**
     * Remove the controls listed to the map.
     *
     * @param {Array.<String>} controlIds - A list of control's id or null.
     */
    VG.prototype.removeControls = function (controlIds) {
        this.logger.trace("[VG] : removeControls ... ");
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
                this.logger.trace("[VG] : removeControls : removing [" + controlId + "] from register.");
                this._controls.splice(idx,1) ;

            }

            var vgControl = this.getLibMapControl(controlId);

            if (!vgControl) {
                console.log("Impossible to remove control [" + controlId + "] : not found or unhandled") ;
                continue ;
            }

            this.logger.trace("[VG] : removeControls : removing [" + controlId + "] from Map.");
            this.libMap.removeControl(vgControl) ;
        }
    } ;

    /**
     * Gets Layer Container div ID for a given layerId.
     *
     * @param {String} layerId - layer identifier
     * @returns {String} - Layer Container div Id in the LayerSwitcher
     */
    VG.prototype.getLSLayerContainerDivId = function ( layerId ) {
        var id = null ;
        var idxLS = this._findRegisteredControl("layerswitcher") ;
        if (idxLS < 0) {
            this.logger.trace("[VG] : getLSLayerContainerDivId : no layerswitcher on map !") ;
            return id ;
        }
        var vglayers = this._getLayersObj([layerId]) ;
        if (vglayers.length > 0) {
            var vgLayerList = this._controls[idxLS].obj._layerListContainer ;
            var divId = vgLayerList.id;
            var uid = divId.substring(divId.indexOf("-"));
            if (vgLayerList && vgLayerList.childNodes) {
                for (var layerDivKey = 0; layerDivKey < vgLayerList.childNodes.length; layerDivKey++) {
                    if (vgLayerList.childNodes[layerDivKey].id === "GPlayerSwitcher_ID_" + layerId + uid) {
                        var foundId = "GPlayerSwitcher_ID_" + layerId + uid;
                        return foundId;
                    }
                }
            }
        }
        this.logger.trace("[VG] : getLSLayerContainerDivId : layer [" + layerId + "] not found on map !") ;
        return id ;
    } ;

    /**
     * Returns implementation of the control
     *
     * @param {String} controlId - identifier of the control
     * @returns {Object} - implementation object of the control if it is on the map. null otherwise.
     */
    VG.prototype.getLibMapControl = function (controlId) {
        var foundVgControl = null ;
        // verifications de base : controlId est bien gere.
        if (!VG.CONTROLSCLASSES.hasOwnProperty(controlId.toLowerCase()) ||
            !VG.CONTROLSCLASSES[controlId.toLowerCase()] ) {
            this.logger.trace("[VG] getLibMapControl : control " + controlId + " non implémenté.") ;
            return foundVgControl ;
        }
        // on regarde du cote des controles
        var vgControls = this.libMap.getControls() ;
        if (vgControls.length == 0 ) {
            this.logger.trace("[VG] getLibMapControl : no control found on map") ;
            return foundVgControl ;
        }
        // for the natives virtualGeo Controls, we have to match the control names
        // between the VG library and the SDK
        if (controlId === "attributions") {
            controlId = "IPR Control";
        }
        if (controlId === "zoom") {
            controlId = "Zoom Control";
        }
        if (controlId === "graphicscale") {
            controlId = "ScaleBar Control";
        }
        if (controlId === "orientation") {
            controlId = "Orientation Control";
        }
        if (controlId === "overview") {
            controlId = "MiniMap Control";
        }
        for (var j = 0 ; j < vgControls.length ; j++ ) {
            this.logger.trace("[VG] getLibMapControl : analyzing : " + controlId);
            // Test on control Options name for Gp plugins Control
            var controlOpts = vgControls[j].getOptions();
            if (controlOpts.name && controlOpts.name.toLowerCase() === controlId.toLowerCase()) {
                foundVgControl = vgControls[j];
                this.logger.trace("[VG] getLibMapControl : found GP Plugin Control ! ") ;
                break;
            }
            // Test with getName method for natives Control (VG.Zoom_Control, VG.IPR_Control, VG.Orientation_Control...)
            else if (vgControls[j].getName().toLowerCase() === controlId.toLowerCase()) {
                foundVgControl = vgControls[j];
                this.logger.trace("[VG] getLibMapControl : found VG native Control ! ") ;
                break;
            }
        }

        return foundVgControl ;
    } ;

    /**
     * Add a vector Layer to the map
     *
     * @param {Object} layerObj - geoportalLayer to add.
     * @param {Gp.LayerOptions} layerObj.geoportalLayerID - options of the layer
     *
     * @private
     */
    VG.prototype._addVectorLayer = function (layerObj) {
        // FIXME : ajout d'un parametre projection pour les donnees
        var layerId = Object.keys(layerObj)[0] ;
        var layerOpts = layerObj[layerId] ;

        switch (layerOpts.format.toUpperCase()) {
            case "KML":
                this.logger.trace("ajout d'une couche KML");
                var layer = {
                        url : layerOpts.url,
                        protocol : layerOpts.format,
                        id : layerId,
                        title : layerOpts.title || layerId,
                        version : layerOpts.version,
                        styleName : layerOpts.styleName,
                        extractStyle : "true"
                    };

                break;
            case "GPX":
                this.logger.trace("ajout d'une couche GPX");
                layer = {
                        url : layerOpts.url,
                        protocol : layerOpts.format,
                        id : layerId,
                        title : layerOpts.title || layerId,
                        version : layerOpts.version,
                        styleName : layerOpts.styleName,
                        extractStyle : "true"
                    };
                break;
            case "GEORSS":
                // TODO GeoRSS
                break;
            case "GEOJSON":
                // TODO ???
                break;
            case "WFS":
                // Non géré par VirtualGeo
                this.logger.trace("Le protocole WFS n'est pas géré par le client VirtualGeo");
                break;
            case "drawing":
                // TODO ??
                break;
            default:

        }
        if (layer) {

            // le controle geoportalAttribution exploite la propriete _originators
            if (layerOpts.hasOwnProperty("originators")) {
                layer._originators = layerOpts.originators ;
            }

            // Dans le cas où aucune visibilité n'est spécifiée
            if (!layerOpts.hasOwnProperty("visibility") || typeof(layerOpts.visibility) === "undefined") {
                // on la règle à "true" par défaut
                layerOpts.visibility = 1;
            }

            this._layers.push({
                id : layerId,
                obj : layer,
                options : layerOpts
            }) ;

            var LSControl = this.getLibMapControl("layerswitcher");
            // if the LS already exists, we have to save the conf of the layer to add it to the LS
            if (LSControl) {
                LSControl._addedLayerConf[layerId] = layerOpts;
            }

            this.libMap.addFeatureLayer(layer) ;
            // Once added
            // On règle la visibilité de la couche
            this.libMap.setLayerVisible({
                id : layerId,
                visible : layerOpts.visibility
            });
        }
    } ;

    /**
     * Add a Raster Layer to the map
     *
     * @param {Object} layerObj - raster layer to add.
     * @param {Gp.LayerOptions} layerObj.geoportalLayerID - options of the layer
     *
     * @private
     */
    VG.prototype._addRasterLayer = function (layerObj) {
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
                        mimeType : layerOpts.outputFormat,
                        name : layerNames,
                        style : layerOpts.styleName
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
                    protocol : layerOpts.format,
                    id : layerId,
                    title : layerOpts.title || layerId,
                    wmtsOptions : {
                        tileMatrixSet : layerOpts.tileMatrixSet,
                        tileMatrixSetLimits : layerOpts.tileMatrixSetLimits,
                        mimeType : layerOpts.outputFormat,
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
            } else {
                var LSControl = this.getLibMapControl("layerswitcher");
                // if the LS already exists, we have to save the conf of the layer to add it to the LS
                if (LSControl) {
                    LSControl._addedLayerConf[layerId] = layerOpts;
                }
                var layerConf = JSON.parse(JSON.stringify(layerOpts));
                this.libMap.addImageryLayer(layer) ;

                // Once added, set opacity and visibility of the layer
                // On règle l'opacité de la couche
                this.libMap.setLayerOpacity({
                    id : layerId,
                    opacity : layerConf.opacity
                });
                // On règle la visibilité de la couche
                this.libMap.setLayerVisible({
                    id : layerId,
                    visible : layerConf.visibility
                });
            }

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
    VG.prototype._addGeoportalLayer = function (layerObj, layerConf) {
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
                layerObj[layerId].tileMatrixSetLimits = layerObj[layerId].tileMatrixSetLimits || layerConf.wmtsOptions.tileMatrixSetLimit;
                layerObj[layerId].layer = layerId || layerConf.getName() ;
                layerObj[layerId].styleName = layerObj[layerId].styleName || layerConf.getStyles()[0].name ;
            }
        }
        // Ajout de la couche avec VirtualGeo
        this._addRasterLayer(layerObj);

    } ;

    /**
     * Remove the layers listed to the map.
     *
     * @param {Array.<String>} layerIds - A list of layer's id or null.
     */
    VG.prototype.removeLayers = function (layerIds) {
        if (!IMap.prototype.removeLayers.apply(this,arguments)) {
            return false ;
        }
        if (!Array.isArray(layerIds)) {
            layerIds = [layerIds] ;
        }
        // ici on sait que layerIds est un tableau
        layerIds.forEach(function (_layerId) {
            this.libMap.removeLayer({
                id : _layerId
            }) ;
        },
        this) ;

    } ;

    /**
     * Modify the layers'options listed to the map
     *
     * @param {Object} layersOptions - Layers to add to the map and their options. Associative array mapping official name of the Geoportal layer or the id of a personal layer (keys) with their properties (values given as {@link Gp.LayerOptions}).
     */
    VG.prototype.modifyLayers = function (layersOptions) {
        if (!IMap.prototype.modifyLayers.apply(this,arguments)) {
            return false ;
        }
        var layerIds = Object.keys(layersOptions) ;
        // on recupere les objets correspondants dejà sur la carte
        var _layerObjs = this._getLayersObj(layerIds) ;
        _layerObjs.forEach(function (_layerObj) {
            this.logger.trace("[IMap] modifyLayers : modifying : [" + _layerObj.id + "]") ;
            // traduction options ahn => options VG
            var commonOpts = this._applyCommonLayerParams(layersOptions[_layerObj.id]) ;
            // application des options VG aux couches VG
            // l'objet _layerObj.options sera mis à jour par le mécanisme des evenements.
            if (commonOpts.hasOwnProperty("opacity")) {
                this.logger.trace("[IMap] modifyLayers : setting opacity of : [" + _layerObj.id + "] to : " + commonOpts.opacity) ;
                this.libMap.setLayerOpacity({
                    id : _layerObj.id,
                    opacity : commonOpts.opacity
                });
            }
            if (commonOpts.hasOwnProperty("visible")) {
                this.logger.trace("[IMap] modifyLayers : setting visible of : [" + _layerObj.id + "] to : " + commonOpts.visible) ;
                this.libMap.setLayerVisible({
                    id : _layerObj.id,
                    visible : commonOpts.visible
                });
            }
            /* TODO A compléter
            if (commonOpts.hasOwnProperty("minResolution")) {
                this.logger.trace("[IMap] modifyLayers : setting minResolution of : [" + _layerObj.id + "] to : " + commonOpts.minResolution) ;
                _layerObj.obj.setMinResolution(commonOpts.minResolution) ;
            }
            if (commonOpts.hasOwnProperty("maxResolution")) {
                this.logger.trace("[IMap] modifyLayers : setting maxResolution of : [" + _layerObj.id + "] to : " + commonOpts.maxResolution) ;
                _layerObj.obj.setMaxResolution(commonOpts.maxResolution) ;
            }
            */
        },
        this) ;
    } ;

    /**
     * Apply params common to all kind of layers :
     * opacity, visibility, minZoom, maxZoom
     *
     * @param {Gp.LayerOptions} layerOpts - options of the layer
     * @returns {Object} a ol.layer.Layer constructor options object
     *
     * @private
     */
    VG.prototype._applyCommonLayerParams = function (layerOpts) {
        var commonOpts = {} ;
        this.logger.trace("[VG] : _applyCommonLayerParams ");
        if (layerOpts.hasOwnProperty("opacity")) {
            this.logger.trace("[VG] : _applyCommonLayerParams - opacity : " + layerOpts.opacity) ;
            commonOpts.opacity = layerOpts.opacity ;
        }
        if (layerOpts.hasOwnProperty("visibility")) {
            this.logger.trace("[VG] : _applyCommonLayerParams - visibility : " + layerOpts.visibility) ;
            commonOpts.visible = layerOpts.visibility ;
        }
        /* TODO à compléter
        if (layerOpts.hasOwnProperty("maxZoom") &&
            layerOpts.maxZoom >= 0 &&
            layerOpts.maxZoom <= 20 ) {
            var minRes = this._getResolutionFromZoomLevel(layerOpts.maxZoom) ;
            this.logger.trace("[OL3] : _applyCommonLayerParams - minRes : " + minRes) ;
            commonOpts.minResolution = minRes ;
        }
        if (layerOpts.hasOwnProperty("minZoom") &&
            layerOpts.minZoom >= 0 &&
            layerOpts.minZoom <= 20 ) {
            var maxRes = this._getResolutionFromZoomLevel(layerOpts.minZoom) ;
            this.logger.trace("[OL3] : _applyCommonLayerParams - maxRes : " + maxRes) ;
            commonOpts.maxResolution = maxRes ;
        }*/

        return commonOpts ;
    } ;

    /**
     * get layer params from VG layer params
     * opacity, visibility, minZoom, maxZoom
     *
     * @param {Object} vglayerOpts - options of the layer
     * @returns {Gp.LayerOptions} - object with common options
     *
     * @private
     */
    VG.prototype._getCommonLayerParams = function (vglayerOpts) {
        var commonOpts = {} ;
        this.logger.trace("[VG] : _getCommonLayerParams ");
        if (vglayerOpts.hasOwnProperty("opacity")) {
            this.logger.trace("[VG] : _getCommonLayerParams - opacity : " + vglayerOpts.opacity) ;
            commonOpts.opacity = vglayerOpts.opacity ;
        }
        if (vglayerOpts.hasOwnProperty("visible")) {
            this.logger.trace("[VG] : _getCommonLayerParams - visibility : " + vglayerOpts.visible) ;
            commonOpts.visibility = vglayerOpts.visible ;
        }
        /* TODO a compléter
        if (vglayerOpts.hasOwnProperty("zIndex")) {
            this.logger.trace("[VG] : _getCommonLayerParams - position : " + vglayerOpts.zIndex) ;
            commonOpts.position = vglayerOpts.zIndex ;
        }

        if (ol3layerOpts.hasOwnProperty("maxResolution")) {
            var minZoom = this._getZoomFromResolution(ol3layerOpts.maxResolution) ;
            this.logger.trace("[VG] : _getCommonLayerParams - minZoom : " + minZoom) ;
            commonOpts.minZoom = minZoom ;
        }
        if (ol3layerOpts.hasOwnProperty("minResolution")) {
            var maxZoom = this._getZoomFromResolution(ol3layerOpts.minResolution) ;
            this.logger.trace("[VG] : _getCommonLayerParams - maxZoom : " + maxZoom) ;
            commonOpts.maxZoom = maxZoom ;
        }
        */
        return commonOpts ;
    } ;

    /**
     * Associate a function to trigger when an event is received.
     *
     * @param {String} eventId - The map's event listened. Possible values are : 'loaded', 'failure', 'geolocated', 'located', 'zoomchanged', 'azimuthchanged', 'tiltchanged', 'dragstart', 'drag', 'dragend', 'projectionchanged', 'layerchanged', 'controlchanged'.
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

    VG.prototype.listen = function (eventId, action,context) {
        this.logger.trace("[VG] : listen...") ;
        // verifications de base de la classe mère
        if (!IMap.prototype.listen.apply(this,arguments)) {
            return false ;
        }
        context = context || this ;
        var map = this ;
        var vgEventKey = null ;
        switch (eventId) {
            case "mapLoaded" :
            case "mapFailure" :
                break ;
            case "located" :
                // handled in IMap
                break ;
            case "geolocated" :
                // handled in IMap
                break ;
            case "configured" :
                // handled in IMap
                break ;
            case "centerChanged" :
                /**
                * centerChanged callback
                */
                var callbackCenterchange =  function (vgevt) {
                    var centerChangedEvt = {} ;
                    if (vgevt) {
                        centerChangedEvt.newCenter = {
                            x : vgevt.lon,
                            y : vgevt.lat
                        } ;
                    }
                    action.call(context,centerChangedEvt) ;
                };
                // ajout de l'evenement au tableau des événements
                this._registerEvent(callbackCenterchange,eventId,action,context) ;

                this.libMap.addEventListener("centerchanged", callbackCenterchange, map) ;
                break ;
            case "zoomChanged" :
                /**
                * zoomChanged callback
                */
                var callbackZoomchange = function (vgevt) {
                    var newZoom;
                    if (vgevt) {
                        newZoom = vgevt;
                    }
                    action.call(context,newZoom) ;
                };
                // ajout de l'evenement au tableau des événements
                this._registerEvent(callbackZoomchange,eventId,action,context) ;

                this.libMap.addEventListener("zoomchanged",callbackZoomchange, map) ;
                break ;
            case "azimuthChanged" :
                /**
                * azimuthChanged callback
                */
                var callbackAzimuthchange = function (vgevt) {
                    var newAzimuth = {};
                    if (vgevt) {
                        newAzimuth = vgevt.heading;
                    }
                    action.call(context, newAzimuth) ;
                };
                // ajout de l'evenement au tableau des événements
                this._registerEvent(callbackAzimuthchange,eventId,action,context) ;

                this.libMap.addEventListener("orientationchanged", callbackAzimuthchange, map) ;
                break ;
            case "tiltChanged" :
                /**
                * tiltChanged callback
                */
                var callbackTiltchange = function (vgevt) {
                    var newTilt = {};
                    if (vgevt) {
                        newTilt = vgevt.tilt;
                    }
                    action.call(context, newTilt) ;
                };
                // ajout de l'evenement au tableau des événements
                this._registerEvent(callbackTiltchange,eventId,action,context) ;

                this.libMap.addEventListener("orientationchanged", callbackTiltchange, map) ;
                break ;
            case "projectionChanged" :
                // TODO : interet ?
                break ;
            case "layerChanged" :
                /**
                * layerAdded callback
                */
                var callbackLayerAdded = function (vgevt) {
                    var ladded = vgevt ;

                    var layerOpts = map._getLayerOpts(ladded) ;
                    if (!layerOpts) {
                        map.logger.trace("[VG] listen : enregistrement d'une couche 'inconnue'.") ;
                        layerOpts = map._registerUnknownLayer(ladded) ;
                    }
                    action.call(context,{
                        layerAdded : layerOpts
                    }) ;
                } ;
                // ajout de l'evenement au tableau des événements
                this._registerEvent(callbackLayerAdded,eventId,action,context) ;

                // abonnement à un ajout de couche
                this.libMap.addEventListener("layeradded", callbackLayerAdded, map) ;

                /**
                * layerRemoved callback
                */
                var callbackLayerRemoved = function (vgevt) {
                    var lremoved = vgevt;
                    var layerOpts = map._getLayerOpts(lremoved) ||
                                    map._getLayerOpts(lremoved, map._layersRemoved) ;
                    action.call(context,{
                        layerRemoved : layerOpts
                    }) ;
                };

                // ajout de l'evenement au tableau des événements
                this._registerEvent(callbackLayerRemoved,eventId,action,context) ;

                // abonnement à un retrait de couche
                this.libMap.addEventListener("layerremoved",callbackLayerRemoved,map) ;

                vgEventKey = null ;

                /**
                * layerChanged callback
                */
                var callbackLayerChanged = function (vgevt) {
                    var lchanged = vgevt;
                    var layerOpts = map._getLayerOpts(lchanged) ;
                    action.call(context,{
                        layerChanged : layerOpts
                    }) ;
                };
                // ajout de l'evenement au tableau des événements
                this._registerEvent(callbackLayerChanged,eventId,action,context) ;

                // abonnement à un changement sur une couche
                this.libMap.addEventListener("layerchanged",callbackLayerChanged ,map) ;

                vgEventKey = null ;
                break ;
            case "controlChanged" :
                break ;
            default :
                console.log("unhandled event : " + eventId ) ;
        } ;
        // enregistrement de l'evenement
        /*
        if (eventId) {
            this._registerEvent(eventId,eventId,action,context) ;
        }*/

        return true ;
    };

    /**
     * Cancel an event listening.
     *
     * @param {String} eventId - The map's event to forget. Possible values are :
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
    VG.prototype.forget = function (eventId, action) {
        this.logger.trace("[VG] : forget...") ;
        // verifications de base de la classe mère
        if (!IMap.prototype.forget.apply(this,arguments)) {
            return false ;
        }
        // on cherche l'enregistrement de l'evenement
        var rEvents = this._events[eventId] ;
        if (!rEvents) {
            console.log("nothing to forget for : " + eventId) ;
            return false ;
        }
        var vgCallback = null;
        for (var i = 0 ; i < rEvents.length ; i ++) {
            if (rEvents[i].action == action) {
                vgCallback = rEvents[i].key ;
                rEvents.splice(i,1) ;
                this.logger.trace("[VG] : forgetting : " + eventId + " (" + vgCallback + ")") ;
                // interface entre les Ids de l'AHN et ceux de VG
                if (eventId.toLowerCase() === "tiltchanged" || eventId.toLowerCase() === "azimuthchanged") {
                    eventId = "orientationchanged";
                }
                this.libMap.removeEventListener(eventId, vgCallback);
                // on decale i d'un cran en arriere pour ne pas sauter d'elements
                i -= 1 ;
            }
        }
        if (!rEvents) {
            console.log("action to forget not found for : " + eventId) ;
            return false ;
        }

    } ;

    /**
     * Trouve l'objet layerOpts correspondant au layer VG
     *
     * @param {Object} layerObj - VG layer
     */
    VG.prototype._getLayerOpts = function ( layerObj, layersStack ) {
        var layerOpts = null ;
        layersStack = layersStack || this._layers ;
        for (var i = 0; i < layersStack.length; i++ ) {
            var l = layersStack[i] ;
            if (l.id === layerObj.id) {
                this.logger.trace("[VG] : found layer : " + l.id) ;
                layerOpts = {} ;
                layerOpts[l.id] = layerObj ;
                break ;
            }
        }
        return layerOpts ;
    } ;

    /**
     * Registers unknown unregistered layer
     *
     * @param {Object} layerObj -  VG layer
     * @returns {Object} - new layer index in this._layers
     */
    VG.prototype._registerUnknownLayer = function ( layerObj ) {
        // couches de résultat (itineraire, isochrone)
        var layerId = "unknownLayer" ;
        if (layerObj.hasOwnProperty("gpResultLayerId")) {
            // isochrones : [GraphName]$GEOPORTAIL:GPP:Isocurve
            // itineraire : [GraphName]$GEOPORTAIL:GPP:Itineraire
            layerId = layerObj.gpResultLayerId ;
        }
        // on rajoute un timestamp
        layerId += "-" + Date.now() ;
        this._layers.push({
            id : layerId,
            obj : layerObj,
            options : {}
        }) ;
        var layerOpts = {} ;
        layerOpts[layerId] = {} ;

        return layerOpts ;
    } ;

    /**
     * Ecrasement de la fonction de IMap
     * Ecouteur de changements sur les couches pour gerer le tableau this._layers.
     *
     * @param {Gp.LayerChangedEvent} evt - evenement de changement sur les couches
     * @private
     */
    VG.prototype._onLayerChanged = function (evt) {
        var layerOpts = null ;
        var idx = -1 ;
        if (evt.hasOwnProperty("layerAdded")) {
            layerOpts = evt.layerAdded ;
            idx = this._getLayerIndexByLayerOpts(layerOpts) ;
            if (idx >= 0 && idx < this._layers.length) {
                var layerId = this._layers[idx].id ;
                this._layers[idx].obj = this.libMap.getLayer(layerId);
                this.logger.trace("[IMap] _onLayerChanged : setting position value to " + evt.position + " for layer : " + layerId ) ;
            } else {
                this.logger.warn("[IMap] _onLayerChanged : layerOpts (" + Object.keys(layerOpts)[0] + ") not found for layerAdded Event") ;
            }
        } else if (evt.hasOwnProperty("layerRemoved")) {
            layerOpts = evt.layerRemoved ;
            idx = this._getLayerIndexByLayerOpts(layerOpts) ;
            if (idx >= 0 && idx < this._layers.length) {
                this.logger.trace("[IMap] _onLayerChanged : removing layer at index " + idx) ;
                // il faut garder trace de la couche supprimmée pour
                // d'autres abonnements à layerChanged.layerRemoved
                var layerRemoved = {} ;
                layerRemoved["id"] = this._layers[idx].id ;
                layerRemoved["options"] = this._layers[idx].options ;
                layerRemoved["obj"] = this._layers[idx].obj ;
                this._layersRemoved.push(layerRemoved) ;
                this._layers.splice(idx,1) ;
                this.logger.trace("[IMap] _onLayerChanged : #(layers) == " + this._layers.length) ;
            } else {
                this.logger.warn("[IMap] _onLayerChanged : layerOpts not found for layerRemoved Event") ;
            }
        } else if (evt.hasOwnProperty("layerChanged")) {
            layerOpts = evt.layerChanged ;
            idx = this._getLayerIndexByLayerOpts(layerOpts) ;
            // Maj des options de la couche
            if (layerOpts[this._layers[idx].id].opacity == null) {
                layerOpts[this._layers[idx].id].opacity = 1;
            }
            this._layers[idx].options.opacity = layerOpts[this._layers[idx].id].opacity ;
            this._layers[idx].options.visibility = layerOpts[this._layers[idx].id].visible ;
            // MaJ de l'objet VG à l'entrée du tableau _layers correspondant à la couche
            this._layers[idx].obj = layerOpts[this._layers[idx].id] ;
        }
        // dans tous les cas, à chaque changement de couche, on remet bien à jour la propriété position de toutes les couches de la carte
        for (var layerIdx = 0; layerIdx < this._layers.length; layerIdx++) {
            this._layers[layerIdx].options.position = this.libMap.getLayerIndex(this._layers[layerIdx].id);
        }
    };

    /**
     * Gets HTML content from features array
     *
     * @param {Array.<ol.Features>} features - vg features Array
     * @returns {String} HTML content.
     */
    VG.prototype._features2html = function (features) {
        this.logger.trace("[VG] : _features2html...") ;
        var content = document.createElement("div") ;
        features.forEach(function (f) {
            var props = {};
            if (f.properties) {
                props = f.properties;
            }
            var nameDiv;
            nameDiv = document.createElement("div") ;
            nameDiv.className =  "gp-att-name-div" ;
            if (props.hasOwnProperty("name")) {
                nameDiv.innerHTML = props["name"] ;
                content.appendChild(nameDiv) ;
            } else if (f.featureId !== "") {
                nameDiv.innerHTML = f["featureId"];
                content.appendChild(nameDiv) ;
            } else if (f.properties.description) {
                nameDiv.innerHTML = props["description"];
                content.appendChild(nameDiv) ;
            }  else {
                nameDiv.innerHTML = "UNKNOWN FEATURE NAME";
                content.appendChild(nameDiv) ;
            }
            if (props.hasOwnProperty("description")) {
                var descDiv = document.createElement("div") ;
                descDiv.className = "gp-att-description-div" ;
                descDiv.innerHTML = props["description"] ;
                content.appendChild(descDiv) ;
            }
            var p = null ;
            var others = false ;
            var oDiv = null ;
            var ul = null ;
            var li = null ;
            for (p in props) {
                if (p == "geometry" || p == "name" || p == "description" || p == "encoding") {
                    continue ;
                }
                if (!others) {
                    oDiv = document.createElement("div") ;
                    oDiv.className = "gp-att-others-div" ;
                    ul = document.createElement("ul") ;
                    others = true ;
                }
                li = document.createElement("li") ;
                var span = document.createElement("span") ;
                span.className = "gp-attname-others-span" ;
                span.innerHTML = p + " : ";
                li.appendChild(span) ;
                li.appendChild(document.createTextNode(props[p])) ;
                ul.appendChild(li) ;
            }
            if (ul) {
                oDiv.appendChild(ul) ;
                content.appendChild(oDiv) ;
            }
        },this) ;

        return content ;
    } ;

    /**
     * Info Popup creation and display
     *
     * @param {Object} position - position on the screen where to display the popUp
     * @param {HTMLElement} content - content to display
     */
    VG.prototype._displayInfo = function (position, content) {
        this.logger.trace("[VG] : _displayInfo...") ;

        // Affichage des features.
        var element = document.createElement("div");
        element.className = "gp-feature-info-div-vg";

        var closer = document.createElement("input");
        closer.type = "button" ;
        closer.className = "gp-styling-button closer";
        var vgMap = this.libMap ;
        /**
         * fait disparaître la popup au clic sur x
         */
        closer.onclick = function () {
            element.parentNode.removeChild(element);
            return false;
        };

        var contentDiv = document.createElement("div");
        var mapDiv = document.getElementById(this.div.id);
        contentDiv.className = "gp-features-content-div-vg" ;
        contentDiv.innerHTML = content ;
        element.appendChild(contentDiv);
        element.appendChild(closer);
        element.style.position = "absolute";
        element.style.width = "280px";
        element.style.height = "130px";
        var posX = mapDiv.offsetWidth / 2 - parseInt(element.style.width, 10) / 2;
        var posY = mapDiv.offsetHeight / 2 - parseInt(element.style.height, 10) / 2;
        element.style.left = posX + "px";
        element.style.top = posY + "px";
        element.style.zIndex = "10";
        element.style.overflow = "auto";
        // You can use native DOM methods to insert the fragment:

        mapDiv.appendChild(element);
    } ;

    /**
     * Action triggered when map is clicked
     */
    VG.prototype._onMapClick = function (evt) {
        this.logger.trace("[VG] : _onMapClick...") ;
        this._removeInfoDivs();
        if (evt.target.id !== "VirtualGeo_Map") {
            return;
        }
        var position = {
            x : evt.layerX,
            y : evt.layerY
        };

        var features = this.libMap.pickFeatures(position);
        var visibleFeatures = [];
        for (var i = 0; i < features.length; i++) {
            // on ne tient pas compte de la feature si la couche à laquelle elle appartient n'est pas visible
            for (var idx = 0; idx < this._layers.length; idx++) {
                if (this._layers[idx].id === features[i].layerId && this._layers[idx].obj.visible === true) {
                    visibleFeatures.push(features[i]);
                    break;
                }
            }
        }

        if (visibleFeatures.length == 0) {
            // no visible features
            return ;
        }

        var content = this._features2html(visibleFeatures) ;
        // Affichage des features.
        this._displayInfo(position, content.innerHTML) ;
    } ;

    /**
    * Remove all the feature info PopUp displayed on the map.
    *
    */
    VG.prototype._removeInfoDivs = function () {
        var featureInfoDivs = document.getElementsByClassName("gp-feature-info-div-vg");
        if (featureInfoDivs.length > 0) {
            for (var i = 0;  i < featureInfoDivs.length; i++) {
                featureInfoDivs[i].parentNode.removeChild(featureInfoDivs[i]);
            }
        }
    };

    /**
     * retourne l'objet VirtualGeo.Map
     */
    VG.prototype.getLibMap = function () {
        return this.libMap;
    };

    return VG;
});
