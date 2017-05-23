define([
    "Utils/LoggerByDefault",
    "ol",
    "plugins-ol3",
    "IMap"
],
    function (
        Logger,
        ol,
        plugins,
        IMap
        ) {

        "use strict";

        /**
         * OL3 IMap implementation class.
         */
        function OL3 (opts) {

            if (!(this instanceof OL3)) {
                throw new TypeError("OL3 constructor cannot be called as a function.");
            }

            /**
             * Nom de la classe (heritage)
             */
            this.CLASSNAME = "OL3";

            // appel du constructeur par heritage.
            IMap.apply(this, arguments);

            this.logger = Logger.getLogger("OL3");
            this.logger.trace("[Constructeur OL3 (options)]");

        };

        /**
         * Proprietes observables des couches pour l'AHN
         */
        OL3.LAYERPROPERTIES = {
            visible : "visibility",
            opacity : "opacity",
            zIndex  : "position",
            minResolution : "maxZoom",
            maxResolution : "minZoom"
        } ;

        /**
         * Proprietes modifiables des controles pour OL3
         */
        OL3.CONTROLPROPERTIES = {
            maximised : "collapsed"

            // TODO : rajouter mapping property AHN <-> property OL3 au fur et à mesure de l'ajout des controles.

        } ;

        /**
         * Association controlId <-> classe OpenLayers d'implemenation
         */
        OL3.CONTROLSCLASSES = {
            draggable : [ol.interaction.Pointer, ol.interaction.MouseWheelZoom, ol.interaction.DoubleClickZoom],
            keyboard : [ol.interaction.KeyboardPan, ol.interaction.KeyboardZoom],
            scrollwheel : null,
            selectable : [ol.interaction.Select],
            zoom : ol.control.Zoom,
            zoombox : null,
            overview : ol.control.OverviewMap,
            orientation : ol.control.Rotate,
            graphicscale : ol.control.ScaleLine,
            mouseposition : ol.control.GeoportalMousePosition,
            route : ol.control.Route,
            layerswitcher : ol.control.LayerSwitcher,
            layerimport : ol.control.LayerImport,
            isocurve : ol.control.Isocurve,
            length : ol.control.MeasureLength,
            area : ol.control.MeasureArea,
            azimuth : ol.control.MeasureAzimuth,
            elevationpath : ol.control.ElevationPath,
            graticule : ol.Graticule,
            search : ol.control.SearchEngine,
            reversesearch : ol.control.ReverseGeocode,
            drawing : ol.control.Drawing,
            attributions : ol.control.GeoportalAttribution,
            camera : null
        } ;

        // heritage
        OL3.prototype = Object.create(IMap.prototype, {
            // todo
            // getter/setter
        });

        /*
         * Constructeur (alias)
         */
        OL3.prototype.constructor = OL3;

        /**
         * Empty Map initialization
         */
        OL3.prototype._initMap = function () {
            this.logger.trace("[OL3] : _initMap") ;
            // creation de la view
            var view = new ol.View({
                // center : [center.x,center.y],
                zoom : this.mapOptions.zoom,
                minZoom : this.mapOptions.minZoom,
                maxZoom : this.mapOptions.maxZoom,
                projection : this.mapOptions.projection,
                rotation : this.mapOptions.azimuth * Math.PI / 180
            });

            // creation de la map vide
            this.libMap = new ol.Map({
                // interactions : interactions,
                target : this.div,
                view : view
                // controls : controls
            });

            // ecoute gfi potentiels.
            this.libMap.on("singleclick", this._onMapClick, this) ;

            this._afterInitMap() ;
        } ;

        /**
         * Active / desactive les interactions correspondant à controlId
         *
         * @param {String} controlId - identifiant du controle
         * @param {Boolean} controlOpts - etat à positionner pour les interactions.
         */
        OL3.prototype._toggleInteractions = function (controlId, controlOpts) {
            var interactions = this.getLibMapControl(controlId) ;
            if (interactions == null) {
                interactions = [] ;
                // les interactions ne sont pas sur la carte, on les rajoute, quitte à les désactiver après !
                for (var i = 0 ; i < OL3.CONTROLSCLASSES[controlId].length ; i++) {
                    this.logger.trace("[OL3] : adding interaction " + OL3.CONTROLSCLASSES[controlId][i].name + " to the map.") ;
                    var interaction = new OL3.CONTROLSCLASSES[controlId][i]() ;
                    this.libMap.addInteraction(interaction) ;
                    interactions.push(interaction) ;
                }
            }
            // on active / desactive toutes les interactions correspondantes
            for (var ii = 0 ; ii < interactions.length ; ii++ ) {
                var _interaction = interactions[ii] ;
                this.logger.trace("[OL3] : setting interaction to " + controlOpts + " for control : " + controlId) ;
                _interaction.setActive(controlOpts) ;
            }
            return interactions ;
        } ;

        /**
         * Activate / Deactivate the ability to navigate on the map with mouse or pointer interaction.
         *
         * @param {Boolean} controlOpts - true for activation / false otherwise.
         */
        OL3.prototype.setDraggable = function (controlOpts) {
            return this._toggleInteractions("draggable", controlOpts) ;
        } ;

        /**
         * Activate / Deactivate the ability to navigate on the map with keyborad.
         *
         * @param {Boolean} controlOpts - true for activation / false otherwise.
         */
        OL3.prototype.setKeyboard = function (controlOpts) {
            return this._toggleInteractions("keyboard", controlOpts) ;
        } ;

        /**
         * Activate / Deactivate the ability to select features on the map.
         *
         * @param {Boolean} controlOpts - true for activation / false otherwise.
         */
        OL3.prototype.setSelectable = function (controlOpts) {
            return this._toggleInteractions("selectable", controlOpts) ;
        } ;

        /**
         * Ajoute le controle de Zoom sur la carte
         *
         * @param {Object} controlOpts - options du controle
         */
        OL3.prototype.addZoomControl = function (controlOpts) {
            var control = new ol.control.Zoom({
                target : controlOpts.div
            }) ;
            this.libMap.addControl(control);
            return control ;
        } ;

        /**
         * Ajoute le controle de Zoom (Box) sur la carte
         *
         * @param {Object} controlOpts - options du controle
         */
        OL3.prototype.addZoomBoxControl = function (controlOpts) {
            // TODO
            return null ;
        } ;

        /**
         * Adds overview map to the map.
         *
         * @param {Object} controlOpts - control options
         * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
         * @param {Boolean} controlOpts.maximised - if the control has to be opened or not.
         * @param {Array.<String>} controlOpts.layers - List of layers Ids to be displayed on the overview map (may be part of main map layersId or a geoportal WMTS layer ID). If none, all main map layers will be used.
         * @param {Number} controlOpts.minZoom - min zoom level for overview map.
         * @param {Number} controlOpts.maxZoom - max zoom level for overview map.
         * @param {String} controlOpts.projection - projection code for overview map.
         */
        OL3.prototype.addOverviewControl = function (controlOpts) {
            this.logger.trace("[OL3] addOverviewControl : ... ") ;
            var ovOpts = {} ;
            if (controlOpts.div) {
                ovOpts.target = controlOpts.div ;
            }
            ovOpts.collapsed = controlOpts.maximised ? false : true ;
            if (controlOpts.layers && Array.isArray(controlOpts.layers)) {
                var layerObjs = this._getLayersObj(controlOpts.layers) ;
                var olLayers = [] ;
                layerObjs.forEach(function (layerObj) {
                    this.logger.trace("[OL3] addOverviewControl : adding " + layerObj.id + " to map") ;
                    olLayers.push(layerObj.obj) ;
                },
                this) ;
                if (olLayers.length == 0 && controlOpts.layers.length > 0 ) {
                    // couche(s) non chargée(s) dans la carte principale :
                    // on essaye de les créer comme des couches WMTS Géoportail.
                    for (var i = 0 ; i < controlOpts.layers.length ; i++) {
                        this.logger.trace("[OL3] addOverviewControl : adding geoportal layer : " + controlOpts.layers[i] + " to map") ;
                        var gpLayer = new ol.layer.GeoportalWMTS({
                            layer : controlOpts.layers[i]/*,
                            // on ecrase les contraintes de zoom qui peuvent
                            // exister par defaut sur la couche.
                            olParams : {
                                minResolution : this._getResolutionFromZoomLevel(21),
                                maxResolution : this._getResolutionFromZoomLevel(1)
                            }
                            */
                        }) ;
                        if (gpLayer) {
                            olLayers.push(gpLayer) ;
                        }
                    }
                }
                if (olLayers.length > 0 ) {
                    ovOpts.layers = olLayers ;
                }
            }
            var viewOpts = {} ;
            var needsView = false ;
            if (controlOpts.hasOwnProperty("minZoom")) {
                viewOpts.minZoom = controlOpts.minZoom ;
                needsView = true ;
            }
            if (controlOpts.hasOwnProperty("maxZoom")) {
                viewOpts.maxZoom = controlOpts.maxZoom ;
                needsView = true ;
            }
            if (controlOpts.hasOwnProperty("projection")) {
                viewOpts.projection = controlOpts.projection ;
                needsView = true ;
            }
            if (needsView) {
                ovOpts.view = new ol.View(viewOpts) ;
            }
            var control = new ol.control.OverviewMap(ovOpts) ;
            this.libMap.addControl(control) ;
            return control ;
        } ;

        /**
         * Ajoute le controle d'orientation sur la carte
         *
         * @param {Object} controlOpts - options du controle
         */
        OL3.prototype.addOrientationControl = function (controlOpts) {
            var control = new ol.control.Rotate({
                target : controlOpts.div,
                autoHide : controlOpts.autoHide || false // ol3 param
            }) ;
            this.libMap.addControl(control) ;
            return control ;
        } ;

        /**
         * Ajoute l'echelle graphique sur la carte
         *
         * @param {Object} controlOpts - options du controle
         */
        OL3.prototype.addGraphicScaleControl = function (controlOpts) {
            var ol3units = controlOpts.units ;
            if (ol3units && controlOpts.units.toLowerCase() == "deg" ) {
                ol3units = "degrees" ;
            } else if (ol3units && controlOpts.units.toLowerCase() == "m") {
                ol3units = "metric" ;
            }
            this.logger.trace("[OL3] addGraphicScaleControl : setting graphicscale units to " + ol3units) ;
            var control = new ol.control.ScaleLine({
                target : controlOpts.div,
                units : ol3units,
                minWidth : controlOpts.minWidth
            });
            this.libMap.addControl(control) ;
            return control ;
        } ;

        /**
         * Adds graticule control to the map.
         *
         * @param {Object} controlOpts - control options
         * @param {String} controlOpts.strokeColor - stroke color expressed in hex format (default : #000000)
         * @param {Number} controlOpts.strokeOpacity - stroke opacity expressed between 0 and 1 (default : 0.2).
         * @param {Number} controlOpts.strokeWidth - stroke width expressed in pixels (default : 1).
         */
        OL3.prototype.addGraticuleControl = function (controlOpts) {
            var options = controlOpts || {} ;
            options.strokeColor = options.strokeColor || "#000000" ;
            options.strokeOpacity = options.strokeOpacity || 0.2 ;
            options.strokeWidth = options.strokeWidth || 1 ;
            var rgba = IMap._hexToRgba(options.strokeColor,options.strokeOpacity) ;
            var graticule = new ol.Graticule({
                strokeStyle : new ol.style.Stroke({
                    color : rgba,
                    width : options.strokeWidth
                })
            }) ;
            graticule.setMap(this.libMap) ;
            // ajout sauvage du graticule pour pouvoir le recuperer après
            // FIXME : trouver plus elegant...
            this.libMap.graticule = graticule ;
            return graticule ;
        } ;

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
        OL3.prototype.addMousePositionControl = function (controlOpts) {
            var mpOpts = {} ;
            if (controlOpts.div) {
                mpOpts.target = controlOpts.div ;
            }
            mpOpts.collapsed = controlOpts.maximised ? false : true ;
            if (controlOpts.systems &&
                Array.isArray(controlOpts.systems) &&
                controlOpts.systems.length > 0 ) {
                for (var i = 0 ; i < controlOpts.systems.length ; i++ ) {
                    if (!ol.proj.get(controlOpts.systems[i].crs)) {
                        // on retire les systèmes non définis
                        this.logger.trace("[OL3] addMousePositionControl : crs [" + controlOpts.systems[i].crs + "] not found." ) ;
                        continue ;
                    }
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
                for (var ii = 0 ; ii < controlOpts.units.length ; ii++ ) {
                    if ( typeof controlOpts.units[ii] == "string") {
                        this.logger.trace("[OL3] addMousePositionControl : adding unit   [" + controlOpts.units[ii].toUpperCase() ) ;
                        mpOpts.units.push(controlOpts.units[ii]) ;
                    }
                }
            }
            mpOpts.displayAltitude = controlOpts.displayAltitude ;
            mpOpts.displayCoordinates = controlOpts.displayCoordinates ;
            if (controlOpts.altitude) {
                mpOpts.altitude = controlOpts.altitude ;
            }
            var control = new ol.control.GeoportalMousePosition(mpOpts) ;
            this.libMap.addControl(control) ;
            return control ;
        } ;

        /**
         * Adds route control to the map.
         *
         * @param {Object} controlOpts - control options
         * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
         * @param {Boolean} controlOpts.maximised - if the control has to be opened or not.
         * @param {Object} controlOpts.exclusions - exclusions to be proposed for control. Il null all exclusions will be proposed by default.
         * @param {Boolean} controlOpts.exclusions.toll - proposing toll exclusion. If true, this exclusion will be checked by default.
         * @param {Boolean} controlOpts.exclusions.bridge - proposing bridge exclusion. If true, this exclusion will be checked by default.
         * @param {Boolean} controlOpts.exclusions.tunnel - proposing tunnel exclusion. If true, this exclusion will be checked by default.
         * @param {Array.<String>} controlOpts.graphs - available graphs to be proposed by control among "Pieton" (pedestrian) and "Voiture" (car). The first element of the array will be the default proposition of the control.
         * @param {Object} controlOpts.markersOpts - options to use your own markers. Object properties can be "departure", "stages" or "arrival". Corresponding value is an object with following properties :
         * @param {String} controlOpts.markersOpts[property].url - marker base64 encoded url (ex "data:image/png;base64,...""). Mandatory for a custom marker
         * @param {Array} controlOpts.markersOpts[property].offset - Offsets in pixels used when positioning the overlay. The first element in the array is the horizontal offset. A positive value shifts the overlay right. The second element in the array is the vertical offset. A positive value shifts the overlay down. Default is [0, 0]. (see http://openlayers.org/en/latest/apidoc/ol.Overlay.html)
         * @param {Object} controlOpts.routeOptions - route service options. For advanced use only. See {@link http://depot.ign.fr/geoportail/bibacces/develop/doc/module-Services.html#~route Gp.Services.route()} to know all route options.
         * @param {Object} controlOpts.autocompleteOptions - autocomplete service options. See {@link http://depot.ign.fr/geoportail/bibacces/develop/doc/module-Services.html#~autoComplete Gp.Services.autoComplete()} to know all autocomplete options.
         */
        OL3.prototype.addRouteControl = function (controlOpts) {
            var rteOpts = {} ;
            if (controlOpts.div) {
                rteOpts.target = controlOpts.div ;
            }
            rteOpts.collapsed = controlOpts.maximised ? false : true ;
            if (controlOpts.graphs) {
                rteOpts.graphs = controlOpts.graphs ;
            }
            if (controlOpts.exclusions) {
                rteOpts.exclusions = controlOpts.exclusions ;
            }
            if (controlOpts.markersOpts) {
                rteOpts.markersOpts = {};
                if ( controlOpts.markersOpts.departure) {
                    rteOpts.markersOpts.departure = controlOpts.markersOpts.departure;
                }
                if ( controlOpts.markersOpts.stages) {
                    rteOpts.markersOpts.stages = controlOpts.markersOpts.stages;
                }
                if ( controlOpts.markersOpts.arrival) {
                    rteOpts.markersOpts.arrival = controlOpts.markersOpts.arrival;
                }
            }
            if (controlOpts.routeOptions) {
                rteOpts.routeOptions = controlOpts.routeOptions ;
            }
            if (controlOpts.autocompleteOptions) {
                rteOpts.autocompleteOptions = controlOpts.autocompleteOptions ;
            }
            var control = new ol.control.Route(rteOpts) ;
            this.libMap.addControl(control) ;
            return control ;
        } ;

        /**
         * Adds isocurve control to the map.
         *
         * @param {Object} controlOpts - control options
         * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
         * @param {Boolean} controlOpts.maximised - if the control has to be opened or not.
         * @param {Object} controlOpts.exclusions - exclusions to be proposed for control. Il null all exclusions will be proposed by default.
         * @param {Boolean} controlOpts.exclusions.toll - proposing toll exclusion. If true, this exclusion will be checked by default.
         * @param {Boolean} controlOpts.exclusions.bridge - proposing bridge exclusion. If true, this exclusion will be checked by default.
         * @param {Boolean} controlOpts.exclusions.tunnel - proposing tunnel exclusion. If true, this exclusion will be checked by default.
         * @param {Array.<String>} controlOpts.graphs - available graphs to be proposed by control among "Pieton" (pedestrian) and "Voiture" (car). The first element of the array will be the default proposition of the control.
         * @param {Array.<String>} controlOpts.methods - available methods of computation to be proposed by control among "time" (isochron) and "distance" (isodistance). The first element of the array will be the default proposition of the control.
         * @param {Array.<String>} controlOpts.directions - available directions to be proposed by control among "arrival" (isocurve to arrival point) and "departure" (isocruve from departure point). The first element of the array will be the default proposition of the control.
         * @param {Object} controlOpts.markerOpts - options to use your own marker. Default is a lightOrange marker.
         * @param {String} controlOpts.markerOpts.url - marker base64 encoded url (ex "data:image/png;base64,...""). Mandatory for a custom marker
         * @param {Array} controlOpts.markerOpts.offset - Offsets in pixels used when positioning the overlay. The first element in the array is the horizontal offset. A positive value shifts the overlay right. The second element in the array is the vertical offset. A positive value shifts the overlay down. Default is [0, 0]. (see http://openlayers.org/en/latest/apidoc/ol.Overlay.html)
         * @param {Object} controlOpts.isocurveOptions - isocurve service options. For advanced use only. See {@link http://depot.ign.fr/geoportail/bibacces/develop/doc/module-Services.html#~isocurve Gp.Services.isocurve()} to know all isocurve options.
         * @param {Object} controlOpts.autocompleteOptions - autocomplete service options. See {@link http://depot.ign.fr/geoportail/bibacces/develop/doc/module-Services.html#~autoComplete Gp.Services.autoComplete()} to know all autocomplete options.
         */
        OL3.prototype.addIsocurveControl = function (controlOpts) {
            var isoOpts = {} ;
            if (controlOpts.div) {
                isoOpts.target = controlOpts.div ;
            }
            isoOpts.collapsed = controlOpts.maximised ? false : true ;
            if (controlOpts.graphs) {
                isoOpts.graphs = controlOpts.graphs ;
            }
            if (controlOpts.exclusions) {
                isoOpts.exclusions = controlOpts.exclusions ;
            }
            if (controlOpts.methods) {
                isoOpts.methods = controlOpts.methods ;
            }
            if (controlOpts.directions) {
                isoOpts.directions = controlOpts.directions ;
            }
            if (controlOpts.markerOpts) {
                isoOpts.markerOpts = controlOpts.markerOpts;
            }
            if (controlOpts.isocurveOptions) {
                isoOpts.isocurveOptions = controlOpts.isocurveOptions ;
            }
            if (controlOpts.autocompleteOptions) {
                isoOpts.autocompleteOptions = controlOpts.autocompleteOptions ;
            }
            var control = new ol.control.Isocurve(isoOpts) ;
            this.libMap.addControl(control) ;
            return control ;
        } ;

        /**
         * Adds layer import control to the map
         *
         * @param {Object} controlOpts - control options
         * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
         * @param {Boolean} controlOpts.maximised - if the control has to be opened or not.
         * @param {Array} controlOpts.layerTypes - data types that could be imported : "KML", "GPX", "GeoJSON", "WMS" and "WMTS". Values will be displayed in the same order in widget list. Default is : ["KML", "GPX", "GeoJSON", "WMS", "WMTS"]
         * @param {Object} controlOpts.webServicesOptions - Options to import WMS or WMTS layers
         * @param {String} controlOpts.webServicesOptions.proxyUrl - Proxy URL to avoid cross-domain problems, if not already set in mapOptions. Mandatory to import WMS and WMTS layer.
         * @param {Array.<String>} [controlOpts.webServicesOptions.noProxyDomains] - Proxy will not be used for this list of domain names. Only use if you know what you're doing (if not already set in mapOptions)
         * @param {Object} [controlOpts.defaultStyles] - Styles to apply by default to imported KML or GPX layers
         * @param {Object} [controlOpts.defaultStyles.KML] - Styles to apply by default to imported KML layers
         * @param {String} [controlOpts.defaultStyles.KML.markerSrc] - URL of a marker image (for KML points styling). Default is an orange marker.
         * @param {Float} [controlOpts.defaultStyles.KML.markerXAnchor = 25.5] - position of marker anchor in X from left of the image expressed in proportion of 1 (for KML points styling).
         * @param {Float} [controlOpts.defaultStyles.KML.markerYAnchor = 38] - position of marker anchor in Y from top of the image expressed in proportion of 1 (for KML points styling).
         * @param {String} [controlOpts.defaultStyles.KML.strokeColor = "#002A50"] - Stroke color for KML lines styling (RGB hex value).
         * @param {Number} [controlOpts.defaultStyles.KML.strokeWidth = 4] - Stroke width in pixels for KML lines styling.
         * @param {Number} [controlOpts.defaultStyles.KML.strokeOpacity = 0.8] - Stroke opacity for KML lines styling (alpha value between 0:transparent and 1:opaque)
         * @param {String} [controlOpts.defaultStyles.KML.polyFillColor = "#00B798"] - KML polygons fill color (RGB hex value).
         * @param {Number} [controlOpts.defaultStyles.KML.polyFillOpacity = 0.5] - KML polygons fill opacity (alpha value between 0:transparent and 1:opaque).
         * @param {Object} [controlOpts.defaultStyles.GPX] - Styles to apply by default to imported GPX layers
         * @param {String} [controlOpts.defaultStyles.GPX.markerSrc] - URL of a marker image (for GPX waypoints styling). Default is an orange marker.
         * @param {Float} [controlOpts.defaultStyles.GPX.markerXAnchor = 25.5] - position of marker anchor in X from left of the image expressed in proportion of 1 (for GPX waypoints styling).
         * @param {Float} [controlOpts.defaultStyles.GPX.markerYAnchor = 38] - position of marker anchor in Y from top of the image expressed in proportion of 1 (for GPX waypoints styling).
         * @param {String} [controlOpts.defaultStyles.GPX.strokeColor = "#002A50"] - Stroke color for GPX routes or tracks styling (RGB hex value).
         * @param {Number} [controlOpts.defaultStyles.GPX.strokeWidth = 4] - Stroke width in pixels for GPX routes or tracks styling.
         * @param {Number} [controlOpts.defaultStyles.GPX.strokeOpacity = 0.8] - Stroke opacity for GPX routes or tracks styling (alpha value between 0:transparent and 1:opaque)
         * @param {Object} [controlOpts.defaultStyles.GeoJSON] - Styles to apply by default to imported GeoJSON layers
         * @param {String} [controlOpts.defaultStyles.GeoJSON.markerSrc] - URL of a marker image (for GeoJSON points styling). Default is an orange marker.
         * @param {Float} [controlOpts.defaultStyles.GeoJSON.markerXAnchor = 25.5] - position of marker anchor in X from left of the image expressed in proportion of 1 (for GeoJSON points styling).
         * @param {Float} [controlOpts.defaultStyles.GeoJSON.markerYAnchor = 38] - position of marker anchor in Y from top of the image expressed in proportion of 1 (for GeoJSON points styling).
         * @param {String} [controlOpts.defaultStyles.GeoJSON.strokeColor = "#002A50"] - Stroke color for GeoJSON lines styling (RGB hex value).
         * @param {Number} [controlOpts.defaultStyles.GeoJSON.strokeWidth = 4] - Stroke width in pixels for GeoJSON lines styling.
         * @param {Number} [controlOpts.defaultStyles.GeoJSON.strokeOpacity = 0.8] - Stroke opacity for GeoJSON lines styling (alpha value between 0:transparent and 1:opaque)
         * @param {String} [controlOpts.defaultStyles.GeoJSON.polyFillColor = "#00B798"] - GeoJSON polygons fill color (RGB hex value).
         * @param {Number} [controlOpts.defaultStyles.GeoJSON.polyFillOpacity = 0.5] - GeoJSON polygons fill opacity (alpha value between 0:transparent and 1:opaque).
         */
        OL3.prototype.addLayerImportControl = function (controlOpts) {
            var importOpts = {};
            if ( controlOpts.div ) {
                importOpts.target = controlOpts.div ;
            }
            importOpts.collapsed = controlOpts.maximised ? false : true ;
            if (controlOpts.layerTypes) {
                importOpts.layerTypes = controlOpts.layerTypes ;
            }
            importOpts.webServicesOptions = {};
            if (controlOpts.webServicesOptions) {
                importOpts.webServicesOptions = controlOpts.webServicesOptions ;
            } else {
                if ( this.mapOptions && this.mapOptions.proxyUrl ) {
                    importOpts.webServicesOptions.proxyUrl = this.mapOptions.proxyUrl;
                }
                if ( this.mapOptions && this.mapOptions.noProxyDomains ) {
                    importOpts.webServicesOptions.noProxyDomains = this.mapOptions.noProxyDomains;
                }
            }
            if ( controlOpts.defaultStyles ) {
                importOpts.vectorStyleOptions = {};
                var defaultMarkerSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAARDSURBVFiF3ZndaxxVGMZ/Z/YjX00Nadpo1qrFBgu56D9QbAtiLoRC7ywSNK1NURRREBKRFlSwFBW0gnSrJXY1CmISgyjFiyYSFC9ajE3MmpjdjWlMUtNos9lN9mteLzbRuCbZmTMTBB+Yi51znvd5n3nPnjnnjBIR/i/wuh4xpCpI0ojiENAA1AE1wCzwKzCE0EM5l2iShJvSyrXKnFVb8dOK4hmg3AIjifAmaU7ztMy7kYI7Zs6rQwjvka+AXcyiOMZx6XGahuE0AEHVitCFnhGAGoQugqrVaSrOKpNP4FWnSaxCGy1yWpesbyY/tLpwo7p/w0RxWHfI6Zk5q7ZSwhj6Q2sjzJLiXp1JQe+p+mllc4wA1CzHtw37lQmpCha5gbXpVxdJythh9z1kvzJJGrFixPBmOXixl+Z4mONmguZ4mIMXezG8WQsq5cs6tmDfTP7NXiSqN0vTzBD1TQfwbdmDUhX4tuyhvukATTNDlgxZ0SmUtUsgv0TZGPsv9FNSvXfNtpLqvey/0O+KTgF0zNQV7XHP4dsdtVvVKYCOmeqiPbwVOx21W9UpgI6ZWNEe2cSEo3arOgWwb0YYLp5G17Sjdqs6BdCZzYqL9B3dR2puYM221NwAfUf3uaJTAB0zaye5GmbWS6i2gdFQL5mFMCIJMgthRkO9hGobMLPFN4VWdAoptlcAQeUDRoG77YrZwDhQT4tk7JDsV6ZFMggv2+bZwyt2jYDuQnOa94GIFrc4IkzRrkPUM3NKsijatLjF0copsbJ++xec7TTPqw6EI/oB/glT+PC+13Y/aSQNv/Is+tNer09lMn7DMHwAYppp8fvTIpISkVQsFrslqww4M9OuqkgzANzl1MhCyrjZGAycm573pK1yFCyi5FoWvo/FYlPOT2fOqftRXMbB9lkEs+3zbe2f/FD5i3YMj2p3vn8/IV8DZ5yE+Gqkot+JEQCPada5dRhxEriiQ5ya90w+272916F+KpnJDLhjpkUy5HgESNqhZU2Vfr5ne+dSFtOBeso06J6cnEy6d0z0hPwEPGeH8sGVykvfjpfe1NZUci2+mHg7Go2G8z/d/goQVJ9B8S1veMYffujduo/thl+ZwUzDuBqJRGZWt7n/FcDH46lFNVLilar1uiTTxsJTnTssH/QpJVlMNQa5wbGJiWERya3Vz30zzfLb3OveY3dU5j5dp4e80Xdbd3TOu/H/yyAtpjnqgeGS8crRQRks+v5xf5gtY/KM/6NAVebhwvv90bLvHu2o/XId2pJSMmIaxo/RaHRMxN6yZtPM0K5K/7hl/FxVZgZWbs0mPDceeKcuGE95/kpSKUmaImHDNIfHrl+PiIj2zOb+MFvBY7IUOVl2ZG9g6bJH4ckJuRe/2NYZT3myKIkrGM4pNRyLjY+LW09URDb1+uaF0pfm3zJ+7zhRGdq1c9eDuwOBOzdLa/OG2X+APwE8DU64Y/5gfAAAAABJRU5ErkJggg==";
                var strokeOpacity;
                var strokeColor;
                var fillOpacity;
                var fillColor;
                if ( controlOpts.defaultStyles.KML ) {
                    var kmlDefaultStyles = controlOpts.defaultStyles.KML;
                    importOpts.vectorStyleOptions.KML = {
                        defaultStyle : {}
                    };
                    if ( kmlDefaultStyles.markerSrc || kmlDefaultStyles.markerXAnchor ||  kmlDefaultStyles.markerYAnchor ) {
                        importOpts.vectorStyleOptions.KML.defaultStyle.image = new ol.style.Icon({
                            src : kmlDefaultStyles.markerSrc || defaultMarkerSrc,
                            anchor : [ kmlDefaultStyles.markerXAnchor || 25.5, kmlDefaultStyles.markerYAnchor || 38],
                            anchorOrigin : "top-left",
                            anchorXUnits : "pixels",
                            anchorYUnits : "pixels"
                        });
                    }
                    if ( kmlDefaultStyles.strokeColor || kmlDefaultStyles.strokeWidth) {
                        strokeOpacity = kmlDefaultStyles.strokeOpacity || 0.8;
                        strokeColor = kmlDefaultStyles.strokeColor || "#002A50";
                        importOpts.vectorStyleOptions.KML.defaultStyle.stroke = new ol.style.Stroke({
                            color : IMap._hexToRgba(strokeColor, strokeOpacity),
                            width : kmlDefaultStyles.strokeWidth || 4
                        });
                    }
                    if ( kmlDefaultStyles.polyFillColor || kmlDefaultStyles.polyFillOpacity ) {
                        fillOpacity = kmlDefaultStyles.polyFillOpacity || 0.5;
                        fillColor = kmlDefaultStyles.polyFillColor || "#00B798";
                        importOpts.vectorStyleOptions.KML.defaultStyle.fill = new ol.style.Fill({
                            color : IMap._hexToRgba(fillColor, fillOpacity)
                        });
                    }
                }
                if ( controlOpts.defaultStyles.GPX ) {
                    var gpxDefaultStyles = controlOpts.defaultStyles.GPX;
                    importOpts.vectorStyleOptions.GPX = {
                        defaultStyle : {}
                    };
                    if ( gpxDefaultStyles.markerSrc || gpxDefaultStyles.markerXAnchor ||  gpxDefaultStyles.markerYAnchor ) {
                        importOpts.vectorStyleOptions.GPX.defaultStyle.image = new ol.style.Icon({
                            src : gpxDefaultStyles.markerSrc || defaultMarkerSrc,
                            anchor : [ gpxDefaultStyles.markerXAnchor || 25.5, gpxDefaultStyles.markerYAnchor || 38],
                            anchorOrigin : "top-left",
                            anchorXUnits : "pixels",
                            anchorYUnits : "pixels"
                        });
                    }
                    if ( gpxDefaultStyles.strokeColor || gpxDefaultStyles.strokeWidth) {
                        strokeOpacity = gpxDefaultStyles.strokeOpacity || 0.8;
                        strokeColor = gpxDefaultStyles.strokeColor || "#002A50";
                        importOpts.vectorStyleOptions.GPX.defaultStyle.stroke = new ol.style.Stroke({
                            color : IMap._hexToRgba(strokeColor, strokeOpacity),
                            width : gpxDefaultStyles.strokeWidth || 4
                        });
                    }
                }
                if ( controlOpts.defaultStyles.GeoJSON ) {
                    var geoJSONDefaultStyles = controlOpts.defaultStyles.GeoJSON;
                    importOpts.vectorStyleOptions.GeoJSON = {
                        defaultStyle : {}
                    };
                    if ( geoJSONDefaultStyles.markerSrc || geoJSONDefaultStyles.markerXAnchor ||  geoJSONDefaultStyles.markerYAnchor ) {
                        importOpts.vectorStyleOptions.GeoJSON.defaultStyle.image = new ol.style.Icon({
                            src : geoJSONDefaultStyles.markerSrc || defaultMarkerSrc,
                            anchor : [ geoJSONDefaultStyles.markerXAnchor || 25.5, geoJSONDefaultStyles.markerYAnchor || 38],
                            anchorOrigin : "top-left",
                            anchorXUnits : "pixels",
                            anchorYUnits : "pixels"
                        });
                    }
                    if ( geoJSONDefaultStyles.strokeColor || geoJSONDefaultStyles.strokeWidth) {
                        strokeOpacity = geoJSONDefaultStyles.strokeOpacity || 0.8;
                        strokeColor = geoJSONDefaultStyles.strokeColor || "#002A50";
                        importOpts.vectorStyleOptions.GeoJSON.defaultStyle.stroke = new ol.style.Stroke({
                            color : IMap._hexToRgba(strokeColor, strokeOpacity),
                            width : geoJSONDefaultStyles.strokeWidth || 4
                        });
                    }
                    if ( geoJSONDefaultStyles.polyFillColor || geoJSONDefaultStyles.polyFillOpacity ) {
                        fillOpacity = geoJSONDefaultStyles.polyFillOpacity || 0.5;
                        fillColor = geoJSONDefaultStyles.polyFillColor || "#00B798";
                        importOpts.vectorStyleOptions.GeoJSON.defaultStyle.fill = new ol.style.Fill({
                            color : IMap._hexToRgba(strokeColor, strokeOpacity)
                        });
                    }
                }
            }
            var control = new ol.control.LayerImport(importOpts);
            this.libMap.addControl(control);
            return control ;
        } ;

        /**
         * Rajoute une configuration de couche au LayerSwitcher
         *
         * @param {Object} implLayer - objet couche de l'implémentation
         * @param {Gp.LayerOptions} layerOptions - options de la couche.
         * @private
         */
        OL3.prototype._addLayerConfToLayerSwitcher = function (implLayer,layerOptions) {
            this.logger.trace("[OL3] : _addLayerConfToLayerSwitcher ... ");
            var lsControl = this.getLibMapControl("layerswitcher") ;
            if (lsControl) {
                lsControl.addLayer(implLayer,this._layerOptions2layerConf(layerOptions)) ;
            }
        } ;

        /**
         * Adds LayerSwitcher control to the map.
         *
         * @param {Object} controlOpts - control options
         * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
         * @param {Boolean} controlOpts.maximised - if the control has to be opened or not.
         */
        OL3.prototype.addLayerSwitcherControl = function (controlOpts) {
            this.logger.trace("[OL3] : addLayerSwitcherControl ... ");
            // TODO : parametrage des couches
            var lsOpts = {
                layers : [],
                options : {
                    collapsed : !(controlOpts && controlOpts.maximised)
                }
            } ;
            if (controlOpts.div) {
                lsOpts.options.target = controlOpts.div ;
            }
            // application des configuration des couches :
            for (var i = 0 ; i < this._layers.length ; i++) {
                var layer = this._layers[i] ;
                this.logger.trace("[OL3] : layerSwitcher : configuring layer : " + layer.id) ;
                // INFO : les couches Geoportail sont aussi configurées.
                var layerConf = {
                    layer : layer.obj,
                    config : {}
                } ;
                if (layer.options.title) {
                    this.logger.trace("[OL3] : layerSwitcher : setting title to [" + layer.options.title + "] for layer " + layer.id) ;
                    layerConf.config.title = layer.options.title ;
                }
                if (layer.options.description) {
                    this.logger.trace("[OL3] : layerSwitcher : setting description to [" + layer.options.description + "] for layer " + layer.id) ;
                    layerConf.config.description = layer.options.description ;
                }
                if (layer.options.quicklookUrl) {
                    this.logger.trace("[OL3] : layerSwitcher : setting quicklookUrl to [" + layer.options.quicklookUrl + "] for layer " + layer.id) ;
                    layerConf.config.quicklookUrl = layer.options.quicklookUrl ;
                }
                if (layer.options.legends) {
                    this.logger.trace("[OL3] : layerSwitcher : setting legends to [" + layer.options.legends + "] for layer " + layer.id) ;
                    layerConf.config.legends = layer.options.legends ;
                }
                if (layer.options.metadata) {
                    this.logger.trace("[OL3] : layerSwitcher : setting metadata to [" + layer.options.metadata + "] for layer " + layer.id) ;
                    layerConf.config.metadata = this._filterEmptyMetadata(layer.options.metadata) ;
                }
                lsOpts.layers.push(layerConf) ;
            }

            this.logger.trace("[OL3] : layerSwitcher Opts : ... ") ;
            var control = new ol.control.LayerSwitcher(lsOpts) ;
            this.libMap.addControl(control) ;
            return control ;
        } ;

        /**
         * Fill ol3 styles with params
         *
         * @param {Object} stylesProps - properties
         * @returns {ol.style.Stroke} - ol.style.Stroke Object
         * @private
         */
        OL3.prototype._fillStrokeStyles = function (stylesProps) {
            var strokeOpts = {} ;
            var resultStyle = null ;
            if (stylesProps.hasOwnProperty("strokeLineDash")) {
                strokeOpts.lineDash = stylesProps.strokeLineDash ;
            }
            if (stylesProps.hasOwnProperty("strokeColor")) {
                strokeOpts.color = stylesProps.strokeColor ;
            }
            if (stylesProps.hasOwnProperty("strokeWidth")) {
                strokeOpts.width = stylesProps.strokeWidth ;
            }
            if (Object.keys(strokeOpts).length > 0) {
                resultStyle = new ol.style.Stroke(strokeOpts) ;
            }
            return resultStyle ;
        } ;

        /**
         * Fill ol3 styles with params
         *
         * @param {Object} stylesProps - properties
         * @returns {ol.style.Stroke} - ol.style.Stroke Object
         * @private
         */
        OL3.prototype._fillPointerStyles = function (stylesProps) {
            var pointerOpts = {} ;
            if (stylesProps.hasOwnProperty("radius")) {
                pointerOpts.radius = stylesProps.radius ;
            }
            pointerOpts.stroke = this._fillStrokeStyles(stylesProps) ;
            if (stylesProps.hasOwnProperty("fillColor")) {
                pointerOpts.fill = new ol.style.Fill({
                    color : stylesProps.fillColor
                }) ;
            }
            var pStyle = new ol.style.Circle(pointerOpts) ;
            return pStyle ;
        } ;

        /**
         * Adds measure length tool bar control to the map.
         *
         * @param {Object} controlOpts - options du controle
         */
        OL3.prototype.addLengthControl = function (controlOpts) {
            var lengthOpts = {} ;
            if (controlOpts.div) {
                lengthOpts.target = controlOpts.div ;
            }

            // styles
            if (controlOpts.hasOwnProperty("styles")) {
                lengthOpts.styles = {} ;
                // pointer style creation
                if (controlOpts.styles.hasOwnProperty("pointer")) {
                    lengthOpts.styles.pointer = this._fillPointerStyles(controlOpts.styles.pointer) ;
                }
                // drawStart style creation
                if (controlOpts.styles.hasOwnProperty("start")) {
                    var startOpts = {} ;
                    startOpts.stroke = this._fillStrokeStyles(controlOpts.styles.start) ;
                    if (controlOpts.styles.start.hasOwnProperty("fillColor")) {
                        startOpts.fill = new ol.style.Fill({
                            color : controlOpts.styles.start.fillColor
                        }) ;
                    }
                    lengthOpts.styles.start = new ol.style.Style(startOpts) ;
                }
                // drawEnd style creation
                if (controlOpts.styles.hasOwnProperty("finish")) {
                    var finishOpts = {} ;
                    finishOpts.stroke = this._fillStrokeStyles(controlOpts.styles.finish) ;
                    if (controlOpts.styles.finish.hasOwnProperty("fillColor")) {
                        finishOpts.fill = new ol.style.Fill({
                            color : controlOpts.styles.finish.fillColor
                        }) ;
                    }
                    lengthOpts.styles.finish = new ol.style.Style(finishOpts) ;
                }
            }
            // geodesic
            if (controlOpts.hasOwnProperty("geodesic")) {
                lengthOpts.geodesic = controlOpts.geodesic ;
            }

            var control = new ol.control.MeasureLength(lengthOpts);
            this.libMap.addControl(control);
            return control;
        } ;

        /**
         * Adds measure area tool bar control to the map.
         *
         * @param {Object} controlOpts - options du controle
         */
        OL3.prototype.addAreaControl = function (controlOpts) {
            this.logger.trace("[OL3] addAreaControl : ... ") ;
            var areaOpts = {} ;
            if (controlOpts.div) {
                areaOpts.target = controlOpts.div ;
            }

            // styles
            if (controlOpts.hasOwnProperty("styles")) {
                areaOpts.styles = {} ;
                // pointer style creation
                if (controlOpts.styles.hasOwnProperty("pointer")) {
                    areaOpts.styles.pointer = this._fillPointerStyles(controlOpts.styles.pointer) ;
                }
                // drawStart style creation
                if (controlOpts.styles.hasOwnProperty("start")) {
                    var startOpts = {} ;
                    startOpts.stroke = this._fillStrokeStyles(controlOpts.styles.start) ;
                    if (controlOpts.styles.start.hasOwnProperty("fillColor")) {
                        startOpts.fill = new ol.style.Fill({
                            color : controlOpts.styles.start.fillColor
                        }) ;
                    }
                    areaOpts.styles.start = new ol.style.Style(startOpts) ;
                }
                // drawEnd style creation
                if (controlOpts.styles.hasOwnProperty("finish")) {
                    var finishOpts = {} ;
                    finishOpts.stroke = this._fillStrokeStyles(controlOpts.styles.finish) ;
                    if (controlOpts.styles.finish.hasOwnProperty("fillColor")) {
                        finishOpts.fill = new ol.style.Fill({
                            color : controlOpts.styles.finish.fillColor
                        }) ;
                    }
                    areaOpts.styles.finish = new ol.style.Style(finishOpts) ;
                }
            }

            // geodesic
            if (controlOpts.hasOwnProperty("geodesic")) {
                areaOpts.geodesic = controlOpts.geodesic ;
            }

            var control = new ol.control.MeasureArea(areaOpts);
            this.libMap.addControl(control);
            return control;
        } ;

        /**
         * Adds measure azimuth tool bar control to the map.
         *
         * @param {Object} controlOpts - options du controle
         */
        OL3.prototype.addAzimuthControl = function (controlOpts) {
            var azimuthOpts = {} ;
            if (controlOpts.div) {
                azimuthOpts.target = controlOpts.div ;
            }

            // styles
            if (controlOpts.hasOwnProperty("styles")) {
                azimuthOpts.styles = {} ;
                // pointer style creation
                if (controlOpts.styles.hasOwnProperty("pointer")) {
                    azimuthOpts.styles.pointer = this._fillPointerStyles(controlOpts.styles.pointer) ;
                }
                // drawStart style creation
                if (controlOpts.styles.hasOwnProperty("start")) {
                    var startOpts = {} ;
                    startOpts.stroke = this._fillStrokeStyles(controlOpts.styles.start) ;
                    if (controlOpts.styles.start.hasOwnProperty("fillColor")) {
                        startOpts.fill = new ol.style.Fill({
                            color : controlOpts.styles.start.fillColor
                        }) ;
                    }
                    azimuthOpts.styles.start = new ol.style.Style(startOpts) ;
                }
                // drawEnd style creation
                if (controlOpts.styles.hasOwnProperty("finish")) {
                    var finishOpts = {} ;
                    finishOpts.stroke = this._fillStrokeStyles(controlOpts.styles.finish) ;
                    if (controlOpts.styles.finish.hasOwnProperty("fillColor")) {
                        finishOpts.fill = new ol.style.Fill({
                            color : controlOpts.styles.finish.fillColor
                        }) ;
                    }
                    azimuthOpts.styles.finish = new ol.style.Style(finishOpts) ;
                }
            }

            var control = new ol.control.MeasureAzimuth(azimuthOpts);
            this.libMap.addControl(control);
            return control;
        } ;

        /**
         * Ajoute l'outil de profil alti sur la carte
         *
         * | property | Type | Description |
         * | - | - | - |
         * | div | String / DOMElement | Target HTML element container or its id. Default is chosen by map implementation.
         * | styles | Object | Styles to use to display the polygon area |
         * | styles.pointer | Object | Pointer (circle) style while measuring |
         * | styles.pointer.strokeColor | String | Stroke color |
         * | styles.pointer.strokeWidth | Number | Stroke width in pixels |
         * | styles.pointer.radius | Number | Circle radius in pixels |
         * | styles.pointer.fillColor | String | Circle fill color |
         * | styles.start | Object | Styles to use to display the polygon area while measuring |
         * | styles.start.strokeColor | String | Stroke color |
         * | styles.start.strokeWidth | Number | Stroke width in pixels |
         * | styles.start.strokeLineDash | Array(Number) | Line dash pattern : line and spaces widths |
         * | styles.start.fillColor | String | Polygon fill color |
         * | styles.finish | Object | Styles to use to display the polygon area when measure is finished |
         * | styles.finish.strokeColor | String | Stroke color |
         * | styles.finish.strokeWidth | Number | Stroke width in pixels |
         * | styles.finish.strokeLineDash | Array(Number) | Line dash pattern : line and spaces widths |
         * | styles.finish.fillColor | String | Polygon fill color |
         * | styles.marker | Object | Style for marker displayed on map when the user follows the elevation path.  |
         * | styles.marker.src | String | URL of a marker image. |
         * | styles.marker.xAnchor | Float | position of marker anchor in X from left of the image expressed in proportion of 1. |
         * | styles.marker.yAnchor | Float | position of marker anchor in Y from top of the image expressed in proportion of 1. |
         * | elevationPathOptions | Object | elevation path service options. See [Gp.Services.getAltitude()](http://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html#~getAltitude) for available options |
         * | displayProfileOptions | Object | Options for displaying the profile |
         * | displayProfileOptions.apply | Function | function to display profile if you want to cutomise it. By default, built-in [DISPLAY_PROFILE_BY_DEFAULT()](http://ignf.github.io/geoportal-extensions/ol3-latest/jsdoc/ol.control.ElevationPath.html#.DISPLAY_PROFILE_BY_DEFAULT) is used. You may also provide your own function using the same signature. |
         * | displayProfileOptions.target | Object | DOM container to use to display the profile. |
         *
         * @param {Object} controlOpts - options du controle
         */
        OL3.prototype.addElevationPathControl = function (controlOpts) {
            var elevOpts = {} ;
            this.logger.trace("[OL3] addElevationPathControl : ... ") ;
            if (controlOpts.div) {
                elevOpts.target = controlOpts.div ;
            }
            // styles
            if (controlOpts.styles) {
                elevOpts.stylesOptions = {} ;
                // pointer style creation
                if (controlOpts.styles.hasOwnProperty("pointer")) {
                    elevOpts.stylesOptions.draw = {} ;
                    elevOpts.stylesOptions.draw.pointer = this._fillPointerStyles(controlOpts.styles.pointer) ;
                }
                // drawStart style creation
                if (controlOpts.styles.hasOwnProperty("start")) {
                    if (!elevOpts.stylesOptions.draw) {
                        elevOpts.stylesOptions.draw = {} ;
                    }
                    elevOpts.stylesOptions.draw.start = this._fillStrokeStyles(controlOpts.styles.start) ;
                }
                // drawEnd style creation
                if (controlOpts.styles.hasOwnProperty("finish")) {
                    if (!elevOpts.stylesOptions.draw) {
                        elevOpts.stylesOptions.draw = {} ;
                    }
                    elevOpts.stylesOptions.draw.finish = this._fillStrokeStyles(controlOpts.styles.finish) ;
                }
                // marker style creation
                if (controlOpts.styles.hasOwnProperty("marker")) {
                    var markerOpts = {} ;
                    if (controlOpts.styles.marker.src) {
                        // on ne cree le marker que si une image source a été fournie
                        markerOpts.src = controlOpts.styles.marker.src ;
                        markerOpts.anchor = [
                            controlOpts.styles.marker.xAnchor ? controlOpts.styles.marker.xAnchor : 0,
                            controlOpts.styles.marker.yAnchor ? controlOpts.styles.marker.yAnchor : 0
                        ] ;
                    }
                    if (Object.keys(markerOpts).length > 0) {
                        elevOpts.stylesOptions.marker = new ol.style.Icon(markerOpts) ;
                    }
                }
            }
            // elevationPathOptions
            if (controlOpts.elevationPathOptions) {
                elevOpts.elevationPathOptions = controlOpts.elevationPathOptions;
            }
            // displayProfileOptions
            if (controlOpts.displayProfileOptions) {
                elevOpts.displayProfileOptions = controlOpts.displayProfileOptions;
            }
            var control = new ol.control.ElevationPath(elevOpts) ;
            this.libMap.addControl(control) ;
            return control ;
        } ;

        /**
         * Adds search control to the map.
         *
         * @param {Object} controlOpts - control options
         * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
         * @param {Boolean} controlOpts.maximised - if the control has to be opened or not.
         * @param {Object} controlOpts.resources - resources to be used by geocode and autocompletion services
         * @param {Array.<String>} controlOpts.resources.geocode - resources geocoding, by default : ["PositionOfInterest", "StreetAddress"]
         * @param {Array.<String>} controlOpts.resources.autocomplete - resources autocompletion, by default : ["PositionOfInterest", "StreetAddress"]
         * @param {Boolean} [ controlOpts.displayAdvancedSearch = false ] - True to display advanced search tools. Default is false (not displayed)
         * @param {Object} controlOpts.advancedSearch - advanced search options for geocoding (filters). Properties can be found among geocode options.filterOptions (see http://depot.ign.fr/geoportail/bibacces/develop/doc/module-Services.html#~geocode)
         * @param {Object} [ geocodeOptions = {} ] - options of geocode service (see http://depot.ign.fr/geoportail/bibacces/develop/doc/module-Services.html#~geocode)
         * @param {Object} [ autocompleteOptions = {} ] - options of autocomplete service (see http://depot.ign.fr/geoportail/bibacces/develop/doc/module-Services.html#~autoComplete)
         */
        OL3.prototype.addSearchControl = function (controlOpts) {
            var searchOpts = {} ;
            if (searchOpts.div) {
                searchOpts.target = controlOpts.div ;
            }
            searchOpts.collapsed = controlOpts.maximised ? false : true ;

            // zoomTo
            searchOpts.zoomTo = controlOpts.zoomTo || null;

            // resources
            if (controlOpts.hasOwnProperty("resources")) {
                searchOpts.resources = {} ;
                if (controlOpts.resources.hasOwnProperty("geocode")) {
                    searchOpts.resources.geocode = controlOpts.resources.geocode ;
                }
                if (controlOpts.resources.hasOwnProperty("autocomplete")) {
                    searchOpts.resources.autocomplete = controlOpts.resources.autocomplete ;
                }
            }
            // advancedSearch
            searchOpts.displayAdvancedSearch = (controlOpts.hasOwnProperty("displayAdvancedSearch") && controlOpts.displayAdvancedSearch === true) ? true : false ;
            if (controlOpts.hasOwnProperty("advancedSearch")) {
                searchOpts.advancedSearch = controlOpts.advancedSearch ;
            }
            if (controlOpts.hasOwnProperty("geocodeOptions")) {
                searchOpts.geocodeOptions = controlOpts.geocodeOptions ;
            }
            if (controlOpts.hasOwnProperty("autocompleteOptions")) {
                searchOpts.autocompleteOptions = controlOpts.autocompleteOptions ;
            }
            var control = new ol.control.SearchEngine(searchOpts) ;
            this.libMap.addControl(control) ;
            return control ;
        } ;

        /**
         * Adds reverse search control to the map.
         *
         * @param {Object} controlOpts - control options
         * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
         * @param {Boolean} controlOpts.maximised - if the control has to be opened or not.
         * @param {Array.<String>} controlOpts.resources - resources geocoding, by default : ["PositionOfInterest", "StreetAddress"]
         * @param {Array.<String>} controlOpts.delimitations - delimitations for reverse geocoding, by default : ["Point", "Circle", "Extent"]. Possible values are : "Point", "Circle", "Extent". Delimitations will be displayed in the same order in widget list.
         * @param {Object} [ reverseGeocodeOptions = {} ] - reverse geocode service options. see http://depot.ign.fr/geoportail/bibacces/develop/doc/module-Services.html#~reverseGeocode to know all reverse geocode options.
         */
        OL3.prototype.addReverseSearchControl = function (controlOpts) {
            var searchOpts = {} ;
            if (searchOpts.div) {
                searchOpts.target = controlOpts.div ;
            }
            searchOpts.collapsed = controlOpts.maximised ? false : true ;
            // resources
            if (controlOpts.hasOwnProperty("resources")) {
                searchOpts.resources = controlOpts.resources ;
            }
            if (controlOpts.hasOwnProperty("reverseGeocodeOptions")) {
                searchOpts.reverseGeocodeOptions = controlOpts.reverseGeocodeOptions ;
            }
            if (controlOpts.hasOwnProperty("delimitations")) {
                searchOpts.delimitations = controlOpts.delimitations ;
            }
            var control = new ol.control.ReverseGeocode(searchOpts) ;
            this.libMap.addControl(control) ;
            return control ;
        } ;

        /**
         * Adds drawing tool bar control to the map.
         *
         * @param {Object} controlOpts - control options
         * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
         * @param {Boolean} controlOpts.maximised - if the control has to be opened or not.
         * @param {String} controlOpts.layer - layerId to be used by drawing tool. If none, an empty layer will be created, with id : "drawing-xxx".
         * @param {Object} controlOpts.tools - tools to be proposed by drawing tools box. All tools will be proposed by default.
         * @param {Boolean} [controlOpts.tools.points = true] - Display points drawing tool
         * @param {Boolean} [controlOpts.tools.lines = true] - Display lines drawing tool
         * @param {Boolean} [controlOpts.tools.polygons = true] - Display polygons drawing tool
         * @param {Boolean} [controlOpts.tools.text = true] - Display text drawing tool
         * @param {Boolean} [controlOpts.tools.remove = true] - Display feature removing tool
         * @param {Boolean} [controlOpts.tools.display = true] - Display style editing tool
         * @param {Boolean} [controlOpts.tools.edit = true] - Display editing tool
         * @param {Boolean} [controlOpts.tools.export = true] - Display exporting tool
         * @param {Object} controlOpts.labels - labels to be used instead of defaults for drawing tools.
         * @param {String} [controlOpts.labels.control] - Label for Control
         * @param {String} [controlOpts.labels.points] - Label for points drawing tool
         * @param {String} [controlOpts.labels.lines] - Label for lines drawing tool
         * @param {String} [controlOpts.labels.polygons] - Label for polygons drawing tool
         * @param {String} [controlOpts.labels.text] - Label for text drawing tool
         * @param {String} [controlOpts.labels.edit] - Label for editing tool
         * @param {String} [controlOpts.labels.display] - Label for style editing tool
         * @param {String} [controlOpts.labels.remove] - Label for feature removing tool
         * @param {String} [controlOpts.labels.export] - Label for exporting tool.
         * @param {String} [controlOpts.labels.exportTitle] - Title for exporting tool.
         * @param {String} [controlOpts.labels.applyToObject] - Label for apply to abject button.
         * @param {String} [controlOpts.labels.setAsDefault] - Label for set as default style button.
         * @param {String} [controlOpts.labels.strokeColor] - Label for stroke color.
         * @param {String} [controlOpts.labels.strokeWidth] - Label for stroke width.
         * @param {String} [controlOpts.labels.fillColor] - Label for fill color.
         * @param {String} [controlOpts.labels.fillOpacity] - Label for fillOpacity.
         * @param {Array.<Object>} controlOpts.markersList - Array of markers urls and offsets to be used for points styling.
         * @param {String} controlOpts.markersList.src - URL of a marker image.
         * @param {Float} controlOpts.markersList.xAnchor - position of marker anchor in X from left of the image expressed in proportion of 1.
         * @param {Float} controlOpts.markersList.yAnchor - position of marker anchor in Y from top of the image expressed in proportion of 1.
         * @param {Object} controlOpts.defaultStyles - Styles to apply by default to drawn features.
         * @param {String} [controlOpts.defaultStyles.textFillColor = "#000000"] - Text fill color for labels (RGB hex value).
         * @param {String} [controlOpts.defaultStyles.textStrokeColor = "#FFFFFF"] - Text surrounding color for labels (RGB hex value).
         * @param {String} [controlOpts.defaultStyles.strokeColor = "#ffcc33"] - Stroke color (RGB hex value).
         * @param {String} [controlOpts.defaultStyles.polyFillColor = "#ffffff"] - Polygons fill color (RGB hex value).
         * @param {Number} [controlOpts.defaultStyles.polyFillOpacity = 0.2] - Polygon fill opacity (alpha value between 0:transparent and 1:opaque).
         * @param {Number} [controlOpts.defaultStyles.strokeWidth = 2] - Stroke width in pixels.
         * @param {Object} controlOpts.cursorStyle - cursor (circle) style when drawing or editing.
         * @param {String} [controlOpts.cursorStyle.fillColor = "rgba(0, 153, 255, 1)"] - Cursor fill color.
         * @param {String} [controlOpts.cursorStyle.strokeColor = "#FFF"] - Cursor stroke color.
         * @param {String} [controlOpts.cursorStyle.strokeWidth = 1] - Cursor surrounding stroke width.
         * @param {String} [controlOpts.cursorStyle.radius = 6] - Cursor radius.
         */
        OL3.prototype.addDrawingControl = function (controlOpts) {
            var drawingOpts = {} ;
            if (controlOpts.div) {
                drawingOpts.target = controlOpts.div ;
            }
            drawingOpts.collapsed = controlOpts.maximised ? false : true ;
            // tools
            if (controlOpts.hasOwnProperty("tools")) {
                drawingOpts.tools = controlOpts.tools ;
            }
            // labels
            if (controlOpts.hasOwnProperty("labels")) {
                drawingOpts.labels = controlOpts.labels ;
            }
            // defaultStyles
            if (controlOpts.hasOwnProperty("defaultStyles")) {
                drawingOpts.defaultStyles = controlOpts.defaultStyles ;
            }
            // cursorStyle
            if (controlOpts.hasOwnProperty("cursorStyle")) {
                drawingOpts.cursorStyle = controlOpts.cursorStyle ;
            }
            // markersList
            if (controlOpts.hasOwnProperty("markersList") &&
                Array.isArray(controlOpts.markersList) &&
                controlOpts.markersList.length > 0
                ) {
                drawingOpts.markersList = [] ;
                for (var i = 0 ; i < controlOpts.markersList.length ; i++) {
                    var mrk = controlOpts.markersList[i] ;
                    if (!mrk.src) {
                        continue ;
                    }
                    var ol3mrk = {
                        src : mrk.src
                    } ;
                    if (mrk.xAnchor && mrk.yAnchor) {
                        ol3mrk.anchor = [mrk.xAnchor , mrk.yAnchor] ;
                    }
                    drawingOpts.markersList.push(ol3mrk) ;
                }
            }
            // layer
            if (controlOpts.layer) {
                var ol3layers = this._getLayersObj([controlOpts.layer]) ;
                if (ol3layers && ol3layers.length > 0) {
                    drawingOpts.layer = ol3layers[0] ;
                }
            }
            var control = new ol.control.Drawing(drawingOpts) ;
            this.libMap.addControl(control) ;
            return control ;
        } ;

        /**
         * Ajoute l'outil d'attributions
         *
         * @param {Object} controlOpts - options du controle
         */
        OL3.prototype.addAttributionsControl = function (controlOpts) {
            var attOpts = {} ;
            if (controlOpts.div) {
                attOpts.target = controlOpts.div ;
            }
            attOpts.collapsed = controlOpts.maximised ? false : true ;
            var control = new ol.control.GeoportalAttribution(attOpts) ;
            this.libMap.addControl(control) ;
            return control ;
        } ;

        /**
         * Ajoute l'outil d'orientation de la camera sur la carte
         *
         * @param {Object} controlOpts - options du controle
         */
        OL3.prototype.addCameraControl = function (controlOpts) {
            // Not implemented (3D feature)
            return null ;
        } ;

        /**
         * Remove the controls listed to the map.
         *
         * @param {Array.<String>} controlIds - A list of control's id or null.
         */
        OL3.prototype.removeControls = function (controlIds) {
            this.logger.trace("[OL3] : removeControls ... ");
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
                    this.logger.trace("[OL3] : removeControls : removing [" + controlId + "] from register.");
                    this._controls.splice(idx,1) ;

                }
                var olControl = this.getLibMapControl(controlId) ;
                if (!olControl) {
                    console.log("Impossible to remove control [" + controlId + "] : not found or unhandled") ;
                    continue ;
                }
                // graticule n'est pas un controle : on le retire différemment
                if (controlId.toLowerCase() == "graticule") {
                    olControl.setMap(null) ;
                    delete this.getLibMap().graticule ;
                    continue ;
                }
                if (Array.isArray(olControl)) {
                    // ce sont des interactions => on ne fait rien.
                    return ;
                }
                this.logger.trace("[OL3] : removeControls : removing [" + controlId + "] from Map.");
                this.libMap.removeControl(olControl) ;
            }
        } ;

        /**
         * Returns implementation of the control
         *
         * @param {String} controlId - identifier of the control
         * @returns {Object} - implementation object of the control if it is on the map. null otherwise.
         */
        OL3.prototype.getLibMapControl = function (controlId) {
            var foundOlControl = null ;
            // verifications de base : controlId est bien gere.
            if (!OL3.CONTROLSCLASSES.hasOwnProperty(controlId.toLowerCase()) ||
                !OL3.CONTROLSCLASSES[controlId.toLowerCase()] ) {
                this.logger.trace("[OL3] getLibMapControl : control " + controlId + " non implémenté.") ;
                return foundOlControl ;
            }
            var olControlClass = OL3.CONTROLSCLASSES[controlId.toLowerCase()] ;
            // olControlClass == Array => interactions
            if (Array.isArray(olControlClass)) {
                this.logger.trace("[OL3] getLibMapControl : searching interactions.") ;
                var olInteractions = [] ;
                this.getLibMap().getInteractions().forEach(function (interaction) {
                    for (var j = 0 ; j < olControlClass.length ; j++) {
                        if (interaction instanceof olControlClass[j]) {
                            this.logger.trace("[OL3] getLibMapControl : found interaction : " + olControlClass[j].name) ;
                            olInteractions.push(interaction) ;
                            break ;
                        }
                    }
                },
                this) ;
                return olInteractions.length > 0 ? olInteractions : null ;
            }
            // cas du graticule
            if (controlId.toLowerCase() == "graticule") {
                return this.getLibMap().hasOwnProperty("graticule") ? this.getLibMap().graticule : null ;
            }
            // ici c'est un controle simple.
            this.logger.trace("[OL3] getLibMapControl : controlClass : " + olControlClass.name) ;
            // on regarde du cote des controles
            var olControls = this.getLibMap().getControls().getArray() ;
            if (olControls.length == 0 ) {
                this.logger.trace("[OL3] getLibMapControl : no control found on map") ;
                return foundOlControl ;
            }
            for (var i = 0 ; i < olControls.length ; i++) {
                var olControl = olControls[i] ;
                this.logger.trace("[OL3] getLibMapControl : analyzing : " + typeof olControl) ;
                if (olControl instanceof olControlClass) {
                    foundOlControl = olControl ;
                    this.logger.trace("[OL3] getLibMapControl : found ! ") ;
                    break ;
                }
            }
            return foundOlControl ;
        } ;

        /**
         * Adds the markers to the map
         * FIXME : make it public ?
         *
         * @param {Array.<Gp.MarkerOptions>} markersOptions - Markers to add to the Map.
         * @private
         */
        OL3.prototype._addMarkers = function (markersOptions) {
            this.logger.trace("[OL3] : _addMarkers") ;
            if (!Array.isArray(markersOptions)) {
                console.log("Can not process markersOptions. It is not an Array.") ;
                return ;
            }
            var mrkSource = null ;
            var mrkLayer = null ;
            var mo = null ;
            var context = this ;
            var ii = 0;
            /**
              * marker open popup function
              * this == img element associated to the marker
              */
            var fopenPopup = function (evt) {
                var evtPx = context.getLibMap().getEventPixel(evt) ;
                context.logger.trace("[OL3] : _addMarkers : display content : " + mo.content) ;
                context._displayInfo(
                    "mrk-" + ii,
                    context.getLibMap().getCoordinateFromPixel([
                        evtPx[0] + this.mo.ppoffset[0],
                        evtPx[1] + this.mo.ppoffset[1]
                    ]),
                    this.mo.content,
                    this.mo.contentType
                 ) ;
            } ;
            for (ii = 0 ; ii < markersOptions.length ; ii++) {
                mo = markersOptions[ii] ;
                // complete missing properties with default
                if (!mo.hasOwnProperty("content")) {
                    mo.content = "" ; // empty string to avoid errors on display
                }
                if (!mo.hasOwnProperty("url")) {
                    mo.url = ol.control.DefaultMarkers["lightOrange"] ;
                }
                // image offset
                if (!mo.hasOwnProperty("offset")) {
                    mo.offset = ol.control.DefaultMarkers["defaultOffset"] ;
                }
                this.logger.trace("[OL3] : _addMarkers : offset [" + mo.offset[0] + "," + mo.offset[1] + "]") ;
                // popup offset (from mouse click)
                if (!mo.hasOwnProperty("ppoffset")) {
                    // default popup has a 15px of y offset (see .gp-feature-info-div::before css class)
                    mo.ppoffset = [0,-15] ;
                }
                var needsLocated = false ;
                if (!mo.hasOwnProperty("position")) {
                    // no position given : use map center
                    mo.position = {
                        x : this.libMap.getView().getCenter()[0],
                        y : this.libMap.getView().getCenter()[1]
                    } ;
                    // when "located" or "geolocated", the center is not yet the final one (returned by located or geolocated event).
                    needsLocated = true ;
                }
                if (!mo.hasOwnProperty("contentType")) {
                    mo.contentType = "text/html" ;
                }
                // create overlay
                var fcoords = [mo.position.x, mo.position.y] ;
                if (mo.position.hasOwnProperty("projection")) {
                    fcoords = ol.proj.transform(fcoords,mo.position.projection,this.getProjection()) ;
                }
                this.logger.trace("[OL3] : _addMarkers : coords [" + fcoords[0] + "," + fcoords[1] + "]") ;
                var mrkImg = document.createElement("img") ;
                mrkImg.src = mo.url ;
                // mrkImg.setAttribute("content",mo.content) ;
                mrkImg.mo = mo ;
                var mrk = new ol.Overlay({
                    position : fcoords,
                    offset : mo.offset,
                    element : mrkImg
                }) ;
                this.libMap.addOverlay(mrk) ;
                // listen to geolocated and located events (if marker has to be positionned to the center of the map
                if (needsLocated === true) {
                    var gpMap = this ;
                    /**
                     * Change markerPositon - this == mrk overlay object
                     *
                     * @param {Object} locEvt - Gp.Located or Gp.GeolocatedEvent
                     */
                    var changeCenter = function (locEvt) {
                        var fcoords = [
                            locEvt.position.x,
                            locEvt.position.y
                        ] ;
                        if (locEvt.position.hasOwnProperty("projection")) {
                            fcoords = ol.proj.transform(fcoords,locEvt.position.projection,gpMap.getProjection()) ;
                        }
                        this.setPosition(fcoords) ;
                    } ;
                    this.listen("located",changeCenter,mrk) ;
                    this.listen("geolocated",changeCenter,mrk) ;
                }
                // listen to markerEvents
                mrkImg.addEventListener("click", fopenPopup, true) ;
                // TODO : test if useless or not
                mrkImg.addEventListener("touchend", fopenPopup, true) ;
                // TODO :
                //  - add option for making popup opened or not at startup

            }
        };

        /**
         * get layer params from OL3 layer params
         * opacity, visibility, minZoom, maxZoom
         *
         * @param {Object} ol3layerOpts - options of the layer
         * @returns {Gp.LayerOptions} - object with common options
         *
         * @private
         */
        OL3.prototype._getCommonLayerParams = function (ol3layerOpts) {
            var commonOpts = {} ;
            this.logger.trace("[OL3] : _getCommonLayerParams ");
            if (ol3layerOpts.hasOwnProperty("opacity")) {
                this.logger.trace("[OL3] : _getCommonLayerParams - opacity : " + ol3layerOpts.opacity) ;
                commonOpts.opacity = ol3layerOpts.opacity ;
            }
            if (ol3layerOpts.hasOwnProperty("visible")) {
                this.logger.trace("[OL3] : _getCommonLayerParams - visibility : " + ol3layerOpts.visible) ;
                commonOpts.visibility = ol3layerOpts.visible ;
            }
            if (ol3layerOpts.hasOwnProperty("zIndex")) {
                this.logger.trace("[OL3] : _getCommonLayerParams - position : " + ol3layerOpts.zIndex) ;
                commonOpts.position = ol3layerOpts.zIndex ;
            }
            if (ol3layerOpts.hasOwnProperty("maxResolution")) {
                var minZoom = this._getZoomFromResolution(ol3layerOpts.maxResolution) ;
                this.logger.trace("[OL3] : _getCommonLayerParams - minZoom : " + minZoom) ;
                commonOpts.minZoom = minZoom ;
            }
            if (ol3layerOpts.hasOwnProperty("minResolution")) {
                var maxZoom = this._getZoomFromResolution(ol3layerOpts.minResolution) ;
                this.logger.trace("[OL3] : _getCommonLayerParams - maxZoom : " + maxZoom) ;
                commonOpts.maxZoom = maxZoom ;
            }

            return commonOpts ;
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
        OL3.prototype._applyCommonLayerParams = function (layerOpts) {
            var commonOpts = {} ;
            this.logger.trace("[OL3] : _applyCommonLayerParams ");
            if (layerOpts.hasOwnProperty("opacity")) {
                this.logger.trace("[OL3] : _applyCommonLayerParams - opacity : " + layerOpts.opacity) ;
                commonOpts.opacity = layerOpts.opacity ;
            }
            if (layerOpts.hasOwnProperty("visibility")) {
                this.logger.trace("[OL3] : _applyCommonLayerParams - visibility : " + layerOpts.visibility) ;
                commonOpts.visible = layerOpts.visibility ;
            }
            if (layerOpts.hasOwnProperty("position")) {
                this.logger.trace("[OL3] : _applyCommonLayerParams - position : " + layerOpts.position) ;
                commonOpts.zIndex = layerOpts.position ;
            }
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
            }
            if (layerOpts.hasOwnProperty("grayScaled")) {
                this.logger.trace("[OL3] : _applyCommonLayerParams - grayScaled : " + layerOpts.grayScaled) ;
                commonOpts.grayScaled = layerOpts.grayScaled ;
            }

            return commonOpts ;
        } ;

        /**
         * Check params for layerDisplay
         *
         * @param {Gp.LayerOptions} layerOpts - options of the layer
         * @returns {Boolean} true if parameters are OK, false otherwise
         *
         * @private
         */
        OL3.prototype._checkLayerParams = function (layerOpts) {
            // verifications de base de la classe mère
            if (!IMap.prototype._checkLayerParams.apply(this,arguments)) {
                return false ;
            }
            // verifications specifiques pour affichage dans OL3
            // TODO
            return true ;
        } ;

        /**
         * Add a Raster Layer to the map
         *
         * @param {Object} layerObj - geoportalLayer to add.
         * @param {Gp.LayerOptions} layerObj.geoportalLayerID - options of the layer
         *
         * @private
         */
        OL3.prototype._addRasterLayer = function (layerObj) {
            var layerId = Object.keys(layerObj)[0] ;
            var layerOpts = layerObj[layerId] ;
            var constructorOpts = this._applyCommonLayerParams(layerOpts) ;
            switch (layerOpts.format.toUpperCase()) {
                case "WMS":
                    this.logger.trace("ajout d'une couche WMS");
                    var params = {};
                    params.LAYERS = layerOpts.layers.join(",");

                    if (layerOpts.version) {
                        params.VERSION = layerOpts.version;
                    }
                    // au cas ou maintien de l'ancien nom de paramètre :
                    // layerOpts.styleName (sans "s")
                    layerOpts.stylesNames = layerOpts.stylesNames || layerOpts.stylesName ;
                    if (layerOpts.stylesNames) {
                        params.STYLES = "";
                        for (var i = 0; i < layerOpts.stylesNames.length; i++) {
                            params.STYLES += layerOpts.stylesNames[i] + ",";
                        }
                    }
                    if (layerOpts.outputFormat) {
                        params.FORMAT = layerOpts.outputFormat;
                    }
                    if (layerOpts.backgroundColor) {
                        params.BGCOLOR = layerOpts.backgroundColor;
                        params.TRANSPARENT = "FALSE";
                    } else {
                        params.TRANSPARENT = "TRUE";
                    }
                    var sourceOpts = {
                        url : layerOpts.url,
                        params : params
                    } ;
                    if (layerOpts.hasOwnProperty("projection")) {
                        sourceOpts.projection = layerOpts.projection ;
                    }
                    if (layerOpts.hasOwnProperty("tiled") && layerOpts.tiled === true) {
                        constructorOpts.source = new ol.source.TileWMS(sourceOpts) ;
                    } else {
                        constructorOpts.source = new ol.source.ImageWMS(sourceOpts) ;
                    }
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
                    var sourceOpts = {
                        url : layerOpts.url,
                        layer : layerOpts.layer,
                        matrixSet : layerOpts.tileMatrixSet,
                        format : layerOpts.outputFormat,
                        version : layerOpts.version,
                        style : layerOpts.styleName,
                        tileGrid : new ol.tilegrid.WMTS({
                            origin : [
                                layerOpts.topLeftCorner.x,
                                layerOpts.topLeftCorner.y
                            ],
                            resolutions : layerOpts.resolutions,
                            matrixIds : layerOpts.matrixIds
                        })
                    } ;
                    // RESTFul or KVP encoding ?
                    if (layerOpts.url.indexOf("{TileMatrixSet}") > 0 ||
                        layerOpts.url.indexOf("{TileRow}") > 0 ||
                        layerOpts.url.indexOf("{TileCol}") > 0   ) {
                        // its an url template => RESTFul
                        sourceOpts.requestEncoding = "REST" ;
                    } else {
                        sourceOpts.requestEncoding = "KVP" ;
                    }
                    constructorOpts.source = new ol.source.WMTSExtended(sourceOpts);
                    break;
                case "OSM":
                    this.logger.trace("ajout d'une couche OSM");
                    constructorOpts.source = new ol.source.OSM({
                        url : layerOpts.url
                    });
                    break;
                default:
            }
            if (constructorOpts.hasOwnProperty("source")) {
                // le controle geoportalAttribution exploite la propriete _originators
                if (layerOpts.hasOwnProperty("originators")) {
                    constructorOpts.source._originators = layerOpts.originators ;
                }
                var layer = null ;
                if ( layerOpts.format.toUpperCase() == "WMS" &&
                     (
                       !layerOpts.hasOwnProperty("tiled") ||
                       layerOpts.tiled !== true
                     )
                   ) {
                    layer = new ol.layer.Image(constructorOpts) ;
                } else {
                    layer = new ol.layer.Tile(constructorOpts) ;
                }
                var gpLayer = {
                    id : layerId,
                    obj : layer,
                    options : layerOpts
                };

                if ( layerOpts.hasOwnProperty("grayScaled") && layerOpts.grayScaled ) {
                    this._colorGrayscaleLayerSwitch(gpLayer,true);
                }

                this._layers.push(gpLayer) ;
                this.libMap.addLayer(gpLayer.obj) ;
                this._addLayerConfToLayerSwitcher(gpLayer.obj,layerOpts) ;
            }
        } ;

        /**
         * Add a vector Layer to the map
         *
         * @param {Object} layerObj - geoportalLayer to add.
         * @param {Gp.LayerOptions} layerObj.geoportalLayerID - options of the layer
         *
         * @private
         */
        OL3.prototype._addVectorLayer = function (layerObj) {
            // FIXME : ajout d'un parametre projection pour les donnees
            var layerId = Object.keys(layerObj)[0] ;
            var layerOpts = layerObj[layerId] ;
            var constructorOpts = this._applyCommonLayerParams(layerOpts) ;
            switch (layerOpts.format.toUpperCase()) {
                case "KML":
                    this.logger.trace("ajout d'une couche KML");

                    // FIXME !?
                    // constructorOpts.source = new ol.source.Vector({
                    //     url : this.setProxy(layerOpts.url),
                    //     format : new ol.format.KMLExtended({
                    //         extractStyles : layerOpts.extractStyles,
                    //         showPointNames : false
                    //     })
                    // }) ;

                    var urlKml = this.setProxy(layerOpts.url);
                    var formatKml = new ol.format.KMLExtended({
                        extractStyles : layerOpts.extractStyles,
                        showPointNames : layerOpts.showPointNames
                    });
                    constructorOpts.source = new ol.source.Vector({
                        features : new ol.Collection(),
                        /** features loader */
                        loader : function (extent, resolution, projectionFeature) {
                            Gp.Protocols.XHR.call({
                                url : urlKml,
                                method : "GET",
                                timeOut : 15000,
                                /** callback on success */
                                onResponse : function (response) {
                                    var projectionData = formatKml.readProjection(response);
                                    var features = formatKml.readFeatures(response, {
                                        dataProjection : projectionData,
                                        featureProjection : projectionFeature
                                    });
                                    if (features.length > 0) {
                                        constructorOpts.source.addFeatures(features);
                                    }
                                },
                                /** callback on failure */
                                onFailure : function (error) {
                                    console.log("[ol.control.LayerImport] Kml/Gpx request failed : ", error);
                                }
                            });
                        }
                    });
                    break;
                case "GPX":
                    this.logger.trace("ajout d'une couche GPX");
                    constructorOpts.source = new ol.source.Vector({
                        url : this.setProxy(layerOpts.url),
                        format : new ol.format.GPX()
                    });
                    break;
                case "GEORSS":
                    // TODO GeoRSS
                    break;
                case "GEOJSON":
                    this.logger.trace("ajout d'une couche GeoJSON");
                    constructorOpts.source = new ol.source.Vector({
                        url : this.setProxy(layerOpts.url),
                        format : new ol.format.GeoJSON()
                    });
                    break;
                case "WFS":
                    // TODO : gestion des valeurs par defaut
                    this.logger.trace("ajout d'une couche WFS");
                    var maxFeatures = "";
                    var sld = "";

                    if (!layerOpts.version) {
                        layerOpts.version = "2.0.0";
                    }
                    if (!layerOpts.outputFormat) {
                        layerOpts.outputFormat = "application/json";
                    }
                    if (layerOpts.maxFeatures) {
                        if (parseInt(layerOpts.version.charAt(0)) < 2) {
                            maxFeatures = "&maxFeatures=" + layerOpts.maxFeatures;
                        } else {
                            maxFeatures = "&count=" + layerOpts.maxFeatures;
                        }
                    }
                    if (layerOpts.sld) {
                        sld = "&sld=" + layerOpts.sld;
                    }

                    var layerUrl = this.setProxy(layerOpts.url);
                    var oflc = layerOpts.outputFormat.toLowerCase() ;
                    var format = null ;
                    var formatOptions = {} ;
                    // FIXME : useless projection param ?
                    if (layerOpts.projection) {
                        // param for GeoJSON format
                        formatOptions["defaultDataProjection"] = layerOpts.projection ;
                        // param for GMLx format
                        formatOptions["srsName"] = layerOpts.projection ;
                    }
                    if (oflc.indexOf("gml") > 0 ||
                        oflc.indexOf("xml") > 0
                       ) {
                        // GML => look for version indication
                        if (oflc.indexOf("2.1") > 0 ||
                            oflc.indexOf("gml2") > 0
                           ) {
                            format = new ol.format.GML2(formatOptions) ;
                        } else {
                            // GML => defaults to GML3
                            format = new ol.format.GML3(formatOptions) ;
                        }
                    } else {
                        // Defaults format to GeoJSON
                        format = new ol.format.GeoJSON(formatOptions) ;
                    }
                    constructorOpts.source = new ol.source.Vector({
                        format : format,
                        /**
                         * envoi de la requête WFS
                         */
                        url : function (extent, resolution, projection) {
                            return layerUrl + "?service=WFS&request=GetFeature" +
                            "&version=" + layerOpts.version + "&typename=" + layerOpts.typeNames +
                            "&outputFormat=" + layerOpts.outputFormat + "&srsname=" + projection.getCode() +
                            "&bbox=" + extent.join(",") + "," + projection.getCode() + maxFeatures + sld;
                        },
                        strategy : ol.loadingstrategy.bbox
                    });

                    break;
                case "drawing":
                    // à tester avec les outils de dessins
                    this.logger.trace("ajout d'une couche de dessin");

                    constructorOpts.source = new ol.source.Vector({});
                    break;
                default:

            }
            if (constructorOpts.hasOwnProperty("source")) {

                // le controle geoportalAttribution exploite la propriete _originators
                if (layerOpts.hasOwnProperty("originators")) {
                    constructorOpts.source._originators = layerOpts.originators ;
                }
                var layer = new ol.layer.Vector(constructorOpts) ;
                this._layers.push({
                    id : layerId,
                    obj : layer,
                    options : layerOpts
                }) ;
                this.libMap.addLayer(layer) ;
                this._addLayerConfToLayerSwitcher(layer,layerOpts) ;
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
        OL3.prototype._addGeoportalLayer = function (layerObj) {
            var layerId = Object.keys(layerObj)[0] ;
            var layerOpts = layerObj[layerId] ;
            // parametres additionnels eventuels
            var olParams = {} ;
            if (layerOpts.hasOwnProperty("opacity")) {
                olParams.opacity = layerOpts.opacity ;
            }
            if (layerOpts.hasOwnProperty("visibility")) {
                olParams.visible = layerOpts.visibility ;
            }
            if (layerOpts.hasOwnProperty("position")) {
                olParams.zIndex = layerOpts.position ;
            }
            if (layerOpts.hasOwnProperty("minZoom") &&
                layerOpts.minZoom >= 0 &&
                layerOpts.minZoom <= 28 ) {
                olParams.maxResolution = this._getResolutionFromZoomLevel(layerOpts.minZoom) ;
                this.logger.trace("[OL3] : apply MaxResolution : " + olParams.maxResolution) ;
            }
            if (layerOpts.hasOwnProperty("maxZoom") &&
                layerOpts.maxZoom >= 0 &&
                layerOpts.maxZoom <= 28 ) {
                olParams.minResolution = this._getResolutionFromZoomLevel(layerOpts.maxZoom) ;
                this.logger.trace("[OL3] : apply minResolution : " + olParams.minResolution) ;
            }
            var LayerClass = null ;
            switch (layerOpts.format.toUpperCase()) {
                case "WMTS" :
                    LayerClass = ol.layer.GeoportalWMTS ;
                    break ;
                case "WMS" :
                    LayerClass = ol.layer.GeoportalWMS ;
                    break ;
                default :
                    console.log("addGeoportalLayer : no class found for " + layerOpts.format) ;
            }
            var olLayer = new LayerClass({
                layer : layerId,
                olParams : olParams
            }) ;
            // le controle geoportalAttribution exploite la propriete _originators
            // si l'utilisateur en a passé des originators en paramètres, on écrase ceux de l'autoconf.
            if (layerOpts.hasOwnProperty("originators")) {
                olLayer.getSource()._originators = layerOpts.originators ;
            }

            this._layers.push({
                id : layerId,
                obj : olLayer,
                options : layerOpts
            }) ;
            this.libMap.addLayer(olLayer) ;
            this._addLayerConfToLayerSwitcher(olLayer,layerOpts) ;
        };

        /**
         * Remove the layers listed to the map.
         *
         * @param {Array.<String>} layerIds - A list of layer's id or null.
         */
        OL3.prototype.removeLayers = function (layerIds) {
            if (!IMap.prototype.removeLayers.apply(this,arguments)) {
                return false ;
            }
            // ici on sait que layerIds est un tableau
            var _layers = this._getLayersObj(layerIds) ;
            _layers.forEach(function (_layer,i,array) {
                this.libMap.removeLayer(_layer.obj) ;
            },
            this) ;

        } ;

        /**
         * Modify the layers'options listed to the map
         *
         * @param {Object} layersOptions - Layers to add to the map and their options. Associative array mapping official name of the Geoportal layer or the id of a personal layer (keys) with their properties (values given as {@link Gp.LayerOptions}).
         */
        OL3.prototype.modifyLayers = function (layersOptions) {
            if (!IMap.prototype.modifyLayers.apply(this,arguments)) {
                return false ;
            }
            var layerIds = Object.keys(layersOptions) ;
            // on recupere les objets correspondants dejà sur la carte
            var _layerObjs = this._getLayersObj(layerIds) ;
            _layerObjs.forEach(function (_layerObj) {
                this.logger.trace("[IMap] modifyLayers : modifying : [" + _layerObj.id + "]") ;
                // traduction options ahn => options OL3
                var commonOpts = this._applyCommonLayerParams(layersOptions[_layerObj.id]) ;
                // application des options OL3 aux couches OL3
                // l'objet _layerObj.options sera mis à jour par le mécanisme des evenements.
                if (commonOpts.hasOwnProperty("opacity")) {
                    this.logger.trace("[IMap] modifyLayers : setting opacity of : [" + _layerObj.id + "] to : " + commonOpts.opacity) ;
                    _layerObj.obj.setOpacity(commonOpts.opacity) ;
                }
                if (commonOpts.hasOwnProperty("visible")) {
                    this.logger.trace("[IMap] modifyLayers : setting visible of : [" + _layerObj.id + "] to : " + commonOpts.visible) ;
                    _layerObj.obj.setVisible(commonOpts.visible) ;
                }
                if (commonOpts.hasOwnProperty("zIndex")) {
                    this.logger.trace("[IMap] modifyLayers : setting zIndex of : [" + _layerObj.id + "] to : " + commonOpts.zIndex) ;
                    _layerObj.obj.setZIndex(commonOpts.zIndex) ;
                }
                if (commonOpts.hasOwnProperty("minResolution")) {
                    this.logger.trace("[IMap] modifyLayers : setting minResolution of : [" + _layerObj.id + "] to : " + commonOpts.minResolution) ;
                    _layerObj.obj.setMinResolution(commonOpts.minResolution) ;
                }
                if (commonOpts.hasOwnProperty("maxResolution")) {
                    this.logger.trace("[IMap] modifyLayers : setting maxResolution of : [" + _layerObj.id + "] to : " + commonOpts.maxResolution) ;
                    _layerObj.obj.setMaxResolution(commonOpts.maxResolution) ;
                }
                if (commonOpts.hasOwnProperty("grayScaled")) {
                    this.logger.trace("[IMap] modifyLayers : setting grayScaled of : [" + _layerObj.id + "] to : " + commonOpts.grayScaled) ;
                    this._changeLayerColor(_layerObj.id,commonOpts.grayScaled);
                }
            },
            this) ;
        } ;

        /**
         * retourne le code de la projection courante de la carte
         */
        OL3.prototype.getProjection = function () {
            return this.libMap.getView().getProjection().getCode();
        };

        /**
         * retourne les coordonnées courantes du centre de la carte
         */
        OL3.prototype.getCenter = function () {
            var center = {
                x : this.libMap.getView().getCenter()[0],
                y : this.libMap.getView().getCenter()[1]
            };
            return center;
        };

        /**
         * Returns the current bounding box of the map in the current projection.
         *
         * @param {String} [projection=map projection] - Coordinate Reference System of returned extent.
         * @returns {Gp.BBox} - The current map's extent.
         */
        OL3.prototype.getViewExtent = function (projection) {
            var bbox = {} ;
            if (this.libMap && this.libMap.getView()) {
                var extent = this.libMap.getView().calculateExtent(this.libMap.getSize()) ;
                var mapProj = this.libMap.getView().getProjection().getCode() ;
                if ( projection &&
                     projection != mapProj ) {
                    extent = ol.proj.transformExtent(extent,mapProj,projection) ;
                }
                // extent OL3 :
                // [-136845.07118250668, 5803180.6192946555, -124691.58368516366, 5810852.986008779]
                bbox.left = extent[0] ;
                bbox.right = extent[2] ;
                bbox.bottom = extent[1] ;
                bbox.top = extent[3] ;

            }
            return bbox ;
        };

        /**
         * retourne l'azimut courant de la carte
         */
        OL3.prototype.getAzimuth = function () {
            return this.libMap.getView().getRotation() * 180 / Math.PI;
        };

        /**
         * retourne le zoom courant de la carte
         */
        OL3.prototype.getZoom = function () {
            return this._getZoomFromResolution(this.getResolution());
        };

        /**
         * retourne le zoom courant de la carte
         */
        OL3.prototype.getResolution = function () {
            return this.libMap.getView().getResolution();
        };

        /**
         * retourne la carte ol.Map
         */
        OL3.prototype.getLibMap = function () {
            return this.libMap;
        };

        /**
         * définit la projection de la carte
         * Si certaines couches ne sont pas compatibles avec la nouvelle projection, elles ne seront pas affichées.
         * // TODO : vérifier que ça fonctionne : un view.setProjection semblerait plus adapte ?
         */
        OL3.prototype.setProjection = function (projection) {
            var view = new ol.View({
                center : this.libMap.getView().getCenter(),
                // minZoom : this.mapOptions.minZoom,
                // maxZoom : this.mapOptions.maxZoom,
                projection : projection,
                rotation : this.libMap.getView().getRotation(),
                zoom : this.getZoom()
            });
            this.libMap.setView(view);
        };

        /**
         * center Map on a given point
         *
         * @param {Object} point - center point
         * @param {Float} point.x - x coordinates for center
         * @param {Float} point.y - y coordinates for center
         * @param {String} point.projection - srs center coordinates
         */
        OL3.prototype.setXYCenter = function (point) {
            this.logger.trace("[OL3] - setXYCenter") ;
            if ( !point.hasOwnProperty("x") || !point.hasOwnProperty("y")) {
                console.log("no valid coordinates for map center") ;
                return ;
            }

            var center = [ point.x , point.y ] ;
            var mapProj = this.libMap.getView().getProjection().getCode() ;
            if ( point.projection &&
                 point.projection != mapProj ) {
                center = ol.proj.transform(center,point.projection,mapProj) ;
            }
            this.libMap.getView().setCenter(center);
            this.logger.trace("[OL3] - setXYCenter(" + point.x + "," + point.y + "), projection Map : " + mapProj) ;

            // FIXME : markerFeature
            // if (this.markerFeature)
            //    this.markerFeature.setGeometry(new ol.geom.Point(geocodeCenter));
        };

        /**
         * définit l'azimut de la carte.
         */
        OL3.prototype.setAzimuth = function (azimuth) {
            this.libMap.getView().setRotation(azimuth * Math.PI / 180);
        };

        /**
         * définit le niveau de zoom de la carte
         */
        OL3.prototype.setZoom = function (zoom) {
            this.libMap.getView().setZoom(zoom);
        };

        /**
         * définit la résolution de la carte
         */
        OL3.prototype.setResolution = function (resolution) {
            this.libMap.getView().setResolution(resolution);
        };

        /**
         * Incrémente le niveau de zoom de la carte de 1.
         */
        OL3.prototype.zoomIn = function () {
            this.libMap.getView().setZoom(this.getZoom() + 1);
        };

        /**
         * Décrémente le niveau de zoom de la carte de 1.
         */
        OL3.prototype.zoomOut = function () {
            this.libMap.getView().setZoom(this.getZoom() - 1);
        };

        /**
         * Trouve l'objet layerOpts correspondant au layer OL3
         *
         * @param {Object} layerObj - ol3 layer
         * @param {Object} layersStack - tableau des couches où chercher
         */
        OL3.prototype._getLayerOpts = function ( layerObj, layersStack ) {
            var layerOpts = null ;
            layersStack = layersStack || this._layers ;
            for (var i = 0; i < layersStack.length; i ++ ) {
                var l = layersStack[i] ;
                if ( l.obj === layerObj ) {
                    layerOpts = {};
                    layerOpts[l.id] = l.options;
                    break;
                }
            }
            return layerOpts ;
        } ;

        /**
         * Registers unknown unregistered layer
         *
         * @param {Object} layerObj - ol3 layer
         * @returns {Object} - new layer index in this._layers
         */
        OL3.prototype._registerUnknownLayer = function ( layerObj ) {
            // couches de résultat (itineraire, isochrone)
            var layerId = "unknownLayer" ;
            if (layerObj.hasOwnProperty("gpResultLayerId")) {
                // isochrones : [GraphName]$GEOPORTAIL:GPP:Isocurve
                // itineraire : [GraphName]$GEOPORTAIL:GPP:Itineraire
                layerId = layerObj.gpResultLayerId ;
            }
            // on rajoute un timestamp
            layerId += "-" + Date.now() ;
            // on rajoute des infos quand on en a
            var options = {} ;
            if (layerId.indexOf("drawing-") === 0) {
                options.format = "drawing" ;
            } else if (layerId.indexOf("layerimport:KML") === 0) {
                options.format = "KML" ;
            } else if (layerId.indexOf("layerimport:GPX") === 0) {
                options.format = "GPX" ;
            } else if (layerId.indexOf("layerimport:GeoJSON") === 0) {
                options.format = "GeoJSON" ;
            } else if (layerId.indexOf("layerimport:WMS") === 0) {
                options.format = "WMS" ;
                if ( layerObj.gpGFIparams ) {
                    if ( layerObj.gpGFIparams.queryable ) {
                        options.queryable = true;
                    }
                    if ( Array.isArray(layerObj.gpGFIparams.formats) ) {
                        // par défaut on prend le premier
                        options.gfiFormat = layerObj.gpGFIparams.formats[0];
                        // si on trouve "text/html" dans les formats disponibles, on prend "text/html" par défaut
                        for (var i = 0; i < layerObj.gpGFIparams.formats.length; i++) {
                            if ( layerObj.gpGFIparams.formats[i] === "text/html" ) {
                                options.gfiFormat = "text/html";
                                break;
                            }
                        }
                    }
                }
            } else if (layerId.indexOf("layerimport:WMTS") === 0) {
                options.format = "WMTS" ;
            }
            this._layers.push({
                id : layerId,
                obj : layerObj,
                options : options
            }) ;
            var layerOpts = {} ;
            layerOpts[layerId] = {} ;

            return layerOpts ;
        } ;

        /**
         * Gets Layer Container div ID for a given layerId.
         *
         * @param {String} layerId - layer identifier
         * @returns {String} - Layer Container div Id in the LayerSwitcher
         */
        OL3.prototype.getLSLayerContainerDivId = function ( layerId ) {
            var id = null ;
            var idxLS = this._findRegisteredControl("layerswitcher") ;
            if (idxLS < 0) {
                this.logger.trace("[OL3] : getLSLayerContainerDivId : no layerswitcher on map !") ;
                return id ;
            }
            var ol3layers = this._getLayersObj([layerId]) ;
            if (ol3layers.length > 0) {
                var ol3ls = this._controls[idxLS].obj ;
                return ol3ls.getLayerDOMId(ol3layers[0].obj) ;
            }
            this.logger.trace("[OL3] : getLSLayerContainerDivId : layer [" + layerId + "] not found on map !") ;
            return id ;
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
        OL3.prototype.listen = function (eventId, action,context) {
            this.logger.trace("[OL3] : listen...") ;
            // verifications de base de la classe mère
            if (!IMap.prototype.listen.apply(this,arguments)) {
                return false ;
            }
            context = context || this ;
            var map = this ;
            var olEventKey = null ;
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
                    olEventKey = this.libMap.getView().on("change:center", function (ol3evt) {
                        var centerChangedEvt = {} ;
                        if (ol3evt.oldValue) {
                            centerChangedEvt.oldCenter = {
                                x : ol3evt.oldValue[0],
                                y : ol3evt.oldValue[1]
                            } ;
                        }
                        centerChangedEvt.newCenter = {
                            x : this.libMap.getView().getCenter()[0],
                            y : this.libMap.getView().getCenter()[1]
                        } ;
                        action.call(context,centerChangedEvt) ;
                    },
                    this) ;
                    break ;
                case "zoomChanged" :
                    olEventKey = this.libMap.getView().on("change:resolution", function (ol3evt) {
                        action.call(context,{
                            // NB : quand on n'a precise aucun tableau de resolutions à
                            //      la creation de la vue, OL3 utilise les résolutions
                            //      Géographiques.
                            oldZoom : this._getZoomFromResolution(ol3evt.oldValue/*,"EPSG:4326"*/),
                            newZoom : this._getZoomFromResolution(this.libMap.getView().getResolution()/*,"EPSG:4326"*/)
                        }) ;
                    },
                    this) ;
                    break ;
                case "azimuthChanged" :
                    olEventKey = this.libMap.getView().on("change:rotation", function (ol3evt) {
                        action.call(context,{
                            oldAzimuth : ol3evt.oldValue * 180 / Math.PI,
                            newAzimuth : this.libMap.getView().getRotation() * 180 / Math.PI
                        }) ;
                    },
                    this) ;
                    break ;
                case "tiltChanged" :
                    // non pertinent en 2D
                    break ;
                case "projectionChanged" :
                    // TODO : interet ?
                    break ;
                case "layerChanged" :
                    // abonnement à un ajout de couche
                    olEventKey = this.libMap.getLayers().on("add", function (ol3evt) {
                        var ladded = ol3evt.element ;
                        var layerOpts = this._getLayerOpts(ladded) ;
                        if (!layerOpts) {
                            map.logger.trace("[OL3] listen : enregistrement d'une couche 'inconnue'.") ;
                            layerOpts = this._registerUnknownLayer(ladded) ;
                        }
                        action.call(context,{
                            layerAdded : layerOpts,
                            position : ladded.getZIndex()
                        }) ;
                    },
                    this) ;
                    this._registerEvent(olEventKey,eventId,action,context) ;
                    // abonnement à un retrait de couche
                    olEventKey = this.libMap.getLayers().on("remove", function (ol3evt) {
                        var lremoved = ol3evt.element ;
                        // on cherche la couche a éventuellement déjà été
                        // enlevée de this._layers
                        var layerOpts = this._getLayerOpts(lremoved) ||
                                        this._getLayerOpts(lremoved, this._layersRemoved) ;

                        var self = context.getLibMap();
                        if (self.featuresOverlay && layerOpts[self.featuresOverlay.getId()]) {
                            self.removeOverlay(self.featuresOverlay);
                            self.featuresOverlay = null;
                        }
                        action.call(context,{
                            layerRemoved : layerOpts
                        }) ;
                    },
                    this) ;
                    this._registerEvent(olEventKey,eventId,action,context) ;
                    olEventKey = null ;
                    // abonnement à un changement de propriete sur chaque couche
                    for (var obsProperty in OL3.LAYERPROPERTIES) {
                        map.logger.trace("[OL3] listen : abonnement layerProperty : " + obsProperty) ;
                        this.libMap.getLayers().forEach(function (olLayer,i,array) {
                            var layerOpts = this._getLayerOpts(olLayer) ;
                            olEventKey = olLayer.on(
                                "change:" + obsProperty,
                                function (ol3evt) {
                                    // la fonction _getCommonLayerParams permet de faire la conversion
                                    // propriete ol3 => propriete commune
                                    var oldOl3obj = {} ;
                                    oldOl3obj[ol3evt.key] = ol3evt.oldValue ;
                                    var oldCommonProp = map._getCommonLayerParams(oldOl3obj) ;
                                    var newOl3obj = {} ;
                                    newOl3obj[ol3evt.key] = this.get(ol3evt.key) ;
                                    var newCommonProp = map._getCommonLayerParams(newOl3obj) ;
                                    action.call(context,{
                                        property : OL3.LAYERPROPERTIES[ol3evt.key],
                                        oldValue : oldCommonProp[OL3.LAYERPROPERTIES[ol3evt.key]],
                                        newValue : newCommonProp[OL3.LAYERPROPERTIES[ol3evt.key]],
                                        layerChanged : layerOpts
                                    }) ;
                                },
                                olLayer
                            ) ;
                            this._registerEvent(olEventKey,eventId,action,context) ;
                            olEventKey = null ;
                        },
                        map) ;
                    }
                    break ;
                case "controlChanged" :
                    break ;
                default :
                    console.log("unhandled event : " + eventId ) ;
            } ;
            // enregistrement de l'evenement
            if (olEventKey) {
                this._registerEvent(olEventKey,eventId,action,context) ;
            }

            return true ;
        } ;

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
        OL3.prototype.forget = function (eventId, action) {
            this.logger.trace("[OL3] : forget...") ;
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
            var evKey = null ;
            for (var i = 0 ; i < rEvents.length ; i ++) {
                if (rEvents[i].action == action) {
                    evKey = rEvents[i].key ;
                    rEvents.splice(i,1) ;
                    this.logger.trace("[OL3] : forgetting : " + eventId + " (" + evKey + ")") ;
                    ol.Observable.unByKey(evKey) ;
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
         * Info Popup creation and display
         *
         * @param {String} id - layerName
         * @param {ol.Coordinate} coords - coordinates wher to anchor popup.
         * @param {HTMLElement} content - content to display
         * @param {String} contentType - content mime-type
         */
        OL3.prototype._displayInfo = function (id, coords, content, contentType) {
            this.logger.trace("[OL3] : _displayInfo...") ;

            if ( content === null) {
                return;
            }

            var _htmlDoc = null;
            var _parser  = null;

            var _content = content;
            _content = _content.replace(/\n/g, "");
            _content = _content.replace(/(>)\s*(<)/g, "$1$2");

            var scope  = typeof window !== "undefined" ? window : null;

            if ( typeof exports === "object" && window === null) {
                // code for nodejs
                var DOMParser = require("xmldom").DOMParser;
                _parser = new DOMParser();
                _htmlDoc = _parser.parseFromString(_content, "text/html");
            } else if (scope.DOMParser) {
                // code for modern browsers
                _parser = new scope.DOMParser();
                _htmlDoc = _parser.parseFromString(_content, "text/html");
            } else if (scope.ActiveXObject) {
                // code for old IE browsers
                _htmlDoc = new scope.ActiveXObject("Microsoft.XMLDOM");
                _htmlDoc.async = false;
                _htmlDoc.loadXML(_content);
            } else {
                console.log("Incompatible environment for DOM Parser !");
                return;
            }

            var body = _htmlDoc.getElementsByTagName("body");
            if (body && body.length === 1) {
                if (!body[0].hasChildNodes()) {
                    return;
                }
            }

            // Affichage des features.
            var element = document.createElement("div");
            element.className = "gp-feature-info-div";

            var closer = document.createElement("input");
            closer.type = "button" ;
            closer.className = "gp-styling-button closer";
            var olMap = this.libMap ;
            /**
             * fait disparaître la popup au clic sur x
             */
            closer.onclick = function () {
                if (olMap.featuresOverlay) {
                    olMap.removeOverlay(olMap.featuresOverlay) ;
                    olMap.featuresOverlay = null ;
                }
                return false;
            };

            var contentDiv = document.createElement("div");
            contentDiv.className = "gp-features-content-div" ;
            contentDiv.innerHTML = content ;
            /*
            if (content instanceof HTMLElement) {
                this.logger.trace("[OL3] : _displayInfo : pure HTMLElement") ;
                contentDiv.appendChild(content) ;
            } else {
                var parser = new DOMParser() ;
                var doc = null ;
                try {
                    doc = parser.parseFromString(content,contentType) ;
                    this.logger.trace("[OL3] : _displayInfo : HTMLElement from parser") ;
                    // FIXME : avec cette methode, on a une balise html + body qui s'insère...
                    contentDiv.appendChild(doc.documentElement) ;
                } catch (e) {
                    console.log(e) ;
                    this.logger.trace("[OL3] : _displayInfo : parsing content failed (not HTML)") ;
                    // en cas d'erreur : on se contente de recopier le contenu.
                    contentDiv.innerHTML = content ;
                }
            }
            */
            element.appendChild(contentDiv);
            element.appendChild(closer);

            if (this.libMap.featuresOverlay) {
                // fermeture d'une éventuelle popup déjà ouverte.
                this.libMap.removeOverlay(this.libMap.featuresOverlay) ;
                this.libMap.featuresOverlay = null ;
            }
            this.libMap.featuresOverlay = new ol.Overlay({
                id : id,
                element : element,
                insertFirst : false, // popup appears on top of other overlays if any
                stopEvent : true
            });
            this.libMap.addOverlay(this.libMap.featuresOverlay);
            this.libMap.featuresOverlay.setPosition(coords) ;
            this.libMap.featuresOverlay.setPositioning("bottom-center") ;

        } ;

        /**
         * Gets HTML content from features array
         *
         * @param {Array.<ol.Features>} features - ol3 features Array
         * @returns {HTMLElement} HTML content.
         */
        OL3.prototype._features2html = function (features) {
            this.logger.trace("[OL3] : _features2html...") ;

            var content = document.createElement("div") ;
            features.forEach(function (f) {
                var props = f.getProperties() ;
                if (props.hasOwnProperty("name")) {
                    var nameDiv = document.createElement("div") ;
                    nameDiv.className =  "gp-att-name-div" ;
                    // nameDiv.appendChild(document.createTextNode(props["name"])) ;
                    nameDiv.insertAdjacentHTML("afterbegin", props["name"]);
                    content.appendChild(nameDiv) ;
                }
                if (props.hasOwnProperty("description")) {
                    var descDiv = document.createElement("div") ;
                    descDiv.className = "gp-att-description-div" ;
                    // descDiv.appendChild(document.createTextNode(props["description"])) ;
                    descDiv.insertAdjacentHTML("afterbegin", props["description"]);
                    content.appendChild(descDiv) ;
                }
                var p = null ;
                var others = false ;
                var oDiv = null ;
                var ul = null ;
                var li = null ;
                for (p in props) {
                    if (p == "geometry" || p == "name" || p == "description" || p == "styleUrl") {
                        continue ;
                    }
                    // FIXME La lecture des extensions GPX n'est pas gérée !
                    if (p == "extensionsNode_" && props[p] === undefined) {
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
                    span.appendChild(document.createTextNode(p + " : ")) ;
                    li.appendChild(span) ;
                    li.appendChild(document.createTextNode(props[p])) ;
                    ul.appendChild(li) ;
                }
                if (ul) {
                    oDiv.appendChild(ul) ;
                    content.appendChild(oDiv) ;
                }
            },this) ;

            // pas de contenu !
            if (!content.hasChildNodes()) {
                content = null;
            }

            return content ;
        } ;

        /**
         * Action triggered when map is clicked
         */
        OL3.prototype._onMapClick = function (evt) {
            this.logger.trace("[OL3] : _onMapClick...") ;
            var interactions = this.libMap.getInteractions().getArray() ;
            for (var i = 0 ; i < interactions.length ; i++ ) {
                if (interactions[i].getActive() &&
                    ( interactions[i] instanceof ol.interaction.Select ||
                      interactions[i] instanceof ol.interaction.Modify ||
                      interactions[i] instanceof ol.interaction.Draw     )
                    )  {
                    // si on a une interaction de dessin ou de sélection en cours, on ne fait rien.
                    return ;
                }
            }

            // Layers orders
            var layers = {};
            for (var j = 0; j < this._layers.length; j++) {
                var layer = this._layers[j];
                var position = this._layers[j].options.position;
                layers[position] = layer;
            }

            // FIXME doit on afficher toutes les popup d'informations ?
            // ou uniquement la première en partant du dessus...
            var requests = [];
            var positions = Object.keys(layers); // FIXME reverse !?
            positions.sort( function (a,b) {
                return b - a;
            });
            for (var k = 0 ; k < positions.length ; k++) {
                var p = positions[k];
                var l = layers[p];
                this.logger.trace("[OL3] : _onMapClick : analyzing wms") ;
                var minMaxZoomOk = true ;
                if (l.options.minZoom  && l.options.minZoom > this.getZoom()) {
                    minMaxZoomOk = false ;
                }
                if (minMaxZoomOk &&
                    l.options.maxZoom &&
                    l.options.maxZoom < this.getZoom()) {
                    minMaxZoomOk = false ;
                }
                if (l.options.format &&
                    (l.options.format.toLowerCase() == "wms" || l.options.format.toLowerCase() == "wmts" ) &&
                    l.options.queryable &&
                    l.obj.getVisible() &&
                    minMaxZoomOk
                ) {

                    var _id     = l.id;
                    var _format = l.options.gfiFormat || "text/html";
                    var _coord  = evt.coordinate;
                    var _res    = this.libMap.getView().getResolution();
                    var _url    = null;
                    if (l.options.format.toLowerCase() == "wmts") {
                        _url = Gp.olUtils.getGetFeatureInfoUrl(
                            l.obj.getSource(),
                            _coord,
                            _res,
                            this.getLibMap().getView().getProjection(),
                            {
                                INFOFORMAT : _format
                            }
                        );
                    } else {
                        _url = l.obj.getSource().getGetFeatureInfoUrl(
                            _coord,
                            _res,
                            this.getLibMap().getView().getProjection(),
                            {
                                INFO_FORMAT : _format
                            }
                        );
                    }

                    requests.push({
                        id : _id,
                        format : _format,
                        url : this.setProxy(_url),
                        scope : this,
                        coordinate : _coord
                    });
                }
            }

            /** call request sync */
            function requestsSync (list, iterator, callback) {
                if (list.length === 0) {
                    return;
                }

                var nextItemIndex = 0;

                /** function report next request */
                function report (displayed) {

                    nextItemIndex++;

                    if (displayed || nextItemIndex === list.length) {
                        callback();
                    } else {
                        iterator(list[nextItemIndex], report);
                    }
                }

                // instead of starting all the iterations, we only start the 1st one
                iterator(list[0], report);
            }

            requestsSync(requests,
                function (data, report) {
                    var self = data.scope;
                    Gp.Protocols.XHR.call({
                        url : data.url,
                        method : "GET",
                        scope : data.scope,
                        /** Handles GFI response */
                        onResponse : function (resp) {
                            var exception = false;

                            // a t on une exception ?
                            if (resp.trim().length === 0 ||
                                resp.indexOf("java.lang.NullPointerException") !== -1 ||
                                resp.indexOf("not queryable") !== -1) {
                                // rien à afficher
                                exception = true;
                            }

                            // on affiche la popup GFI !
                            if (!exception) {
                                self._displayInfo(data.id, data.coordinate, resp, data.format);
                            }

                            // on reporte sur la prochaine requête...
                            report(!exception);
                        },
                        /** Handles GFI response error */
                        onFailure : function (error) {
                            console.log(error);
                            report(false);
                        }
                    }) ;
                },
                function () {
                    console.log("Finish sync to GFI !");
                }
            );

            // FIXME doit on prendre en compte les features dans le processus synchrone
            // d'affichage des popup d'information ?

            // couches vecteur : on remplit un tableau avec les features à proximité.
            var features = [] ;
            this.libMap.forEachFeatureAtPixel(evt.pixel, function (feature) {
                features.push(feature);
            });
            if (features.length == 0) {
                // no features
                return ;
            }
            var content = this._features2html(features) ;
            // pas de contenu !
            if ( content === null) {
                return;
            }
            // Affichage des features.
            var id = "features";
            this._displayInfo(id, evt.coordinate, content.innerHTML) ;
            // this._displayInfo(evt.coordinate,content,"text/html") ;

        } ;

        /**
         * Function to disable/enable layer color (grayscale or color mode).
         *
         * @param {String} layerId - layer identifier
         * @param {Boolean} toGrayScale - indicate transformation direction (from or to grayscale)
         *
         * @private
         */
        OL3.prototype._changeLayerColor = function (layerId,toGrayScale) {
            var layerIndex = this._getLayerIndexByLayerId(layerId);
            var gpLayer = this._layers[layerIndex];

            switch (gpLayer.options.format.toUpperCase()) {
                case "KML":
                case "GPX":
                case "WFS":
                case "drawing":
                    console.log("[OL3.prototype._changeLayerColor] warning : _changeLayerColor not allowed on vector layers (layer id: " + layerId + ")");
                    return;
            }

            this._colorGrayscaleLayerSwitch(gpLayer,toGrayScale);
        };

        /**
         * Function to switch layer display mode between color and grayscale.
         *
         * @param {Object} gpLayer - gp layer object
         * @param {String} gpLayer.id - layer identifier
         * @param {ol.layer.Layer} gpLayer.obj - implementation layer object (here openlayers)
         * @param {Object} gpLayer.options - layer properties (of type layerOptions)
         * @param {Boolean} toGrayScale - indicates conversion direction.
         *
         * @private
         */
        OL3.prototype._colorGrayscaleLayerSwitch = function (gpLayer,toGrayScale) {

            // fonction de conversion de d'une image en n/b
            function gray (img) {
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage( img, 0, 0 );

                var imageData = ctx.getImageData(0, 0, img.width, img.height);
                var data = imageData.data;

                for (var i = 0; i < data.length; i += 4) {
                    var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i]     = avg; // red
                    data[i + 1] = avg; // green
                    data[i + 2] = avg; // blue
                }

                ctx.putImageData( imageData, 0, 0 );
                img.src = canvas.toDataURL();
            };

            // event handlers
            function imageloadstartHandler (evt) {
                evt.image.getImage().crossOrigin = "";
            };

            function tileloadstartHandler (evt) {
                evt.tile.getImage().crossOrigin = "";
            };

            function imageloadendHandler (evt) {
                gray( evt.image.getImage() );
            };

            function tileloadendHandler (evt) {
                gray( evt.tile.getImage() );
            };

            // abonnement/desabonnement aux evenements permettant la conversion en n/b
            var source = gpLayer.obj.getSource();
            if (toGrayScale) {
                if ( source instanceof ol.source.ImageWMS ) {
                    source.loadstartListenerKey = source.on("imageloadstart", imageloadstartHandler );
                    source.loadendListenerKey = source.on("imageloadend", imageloadendHandler );
                } else {
                    source.loadstartListenerKey = source.on("tileloadstart", tileloadstartHandler );
                    source.loadendListenerKey = source.on("tileloadend", tileloadendHandler );
                }
            } else {
                ol.Observable.unByKey( source.loadstartListenerKey );
                ol.Observable.unByKey( source.loadendListenerKey );
                source.loadstartListenerKey = null;
                source.loadendListenerKey = null;
            }
            gpLayer.options.grayScaled = toGrayScale;

            // maj du cache
            source.refresh();
        };

        return OL3;
    });
