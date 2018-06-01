import Logger from "../Utils/LoggerByDefault";
import IMap from "../IMap";
import {Protocols, olExtended as Ol} from "gp";

/**
 * OL IMap implementation class.
 *
 * @param {Object} opts - map options
 */
function OL (opts) {
    if (!(this instanceof OL)) {
        throw new TypeError("OL constructor cannot be called as a function.");
    }

    /**
     * Nom de la classe (heritage)
     */
    this.CLASSNAME = "OL";

    // appel du constructeur par heritage.
    IMap.apply(this, arguments);

    this.logger = Logger.getLogger("OL");
    this.logger.trace("[Constructeur OL (options)]");
};

/**
 * Proprietes observables des couches pour l'AHN
 */
OL.LAYERPROPERTIES = {
    visible : "visibility",
    opacity : "opacity",
    zIndex : "position",
    grayScaled : "grayScaled",
    minResolution : "maxZoom",
    maxResolution : "minZoom"
};

/**
 * Proprietes modifiables des controles pour OL
 */
OL.CONTROLPROPERTIES = {
    maximised : "collapsed"

    // TODO : rajouter mapping property AHN <-> property OL au fur et à mesure de l'ajout des controles.

};

/**
 * Association controlId <-> classe OpenLayers d'implemenation
 */
OL.CONTROLSCLASSES = {
    draggable : [Ol.interaction.Pointer, Ol.interaction.MouseWheelZoom, Ol.interaction.DoubleClickZoom],
    keyboard : [Ol.interaction.KeyboardPan, Ol.interaction.KeyboardZoom],
    scrollwheel : null,
    selectable : [Ol.interaction.Select],
    zoom : Ol.control.Zoom,
    zoombox : null,
    overview : Ol.control.OverviewMap,
    orientation : Ol.control.Rotate,
    graphicscale : Ol.control.ScaleLine,
    getfeatureinfo : Ol.control.GetFeatureInfo,
    mouseposition : Ol.control.GeoportalMousePosition,
    route : Ol.control.Route,
    layerswitcher : Ol.control.LayerSwitcher,
    layerimport : Ol.control.LayerImport,
    isocurve : Ol.control.Isocurve,
    length : Ol.control.MeasureLength,
    area : Ol.control.MeasureArea,
    azimuth : Ol.control.MeasureAzimuth,
    elevationpath : Ol.control.ElevationPath,
    graticule : Ol.Graticule,
    search : Ol.control.SearchEngine,
    reversesearch : Ol.control.ReverseGeocode,
    drawing : Ol.control.Drawing,
    attributions : Ol.control.GeoportalAttribution,
    camera : null
};

// heritage
OL.prototype = Object.create(IMap.prototype, {
    // todo
    // getter/setter
});

/*
 * Constructeur (alias)
 */
OL.prototype.constructor = OL;

/**
 * Empty Map initialization
 */
OL.prototype._initMap = function () {
    this.logger.trace("[OL] : _initMap");
    // creation de la view
    var view = new Ol.View({
        // center : [center.x, center.y],
        enableRotation : this.mapOptions.enableRotation,
        zoom : this.mapOptions.zoom,
        minZoom : this.mapOptions.minZoom,
        maxZoom : this.mapOptions.maxZoom,
        projection : this.mapOptions.projection,
        rotation : this.mapOptions.azimuth * Math.PI / 180
    });

    // creation de la map vide
    this.libMap = new Ol.Map({
        // interactions : interactions,
        target : this.div,
        view : view
        // controls : controls
    });

    this._afterInitMap();
};

/**
 * Active / desactive les interactions correspondant à controlId
 *
 * @param {String} controlId - identifiant du controle
 * @param {Boolean} controlOpts - etat à positionner pour les interactions.
 *
 * @return {Object[]} interactions
 */
OL.prototype._toggleInteractions = function (controlId, controlOpts) {
    var interactions = this.getLibMapControl(controlId);
    if (interactions == null) {
        interactions = [];
        // les interactions ne sont pas sur la carte, on les rajoute, quitte à les désactiver après !
        for (var i = 0; i < OL.CONTROLSCLASSES[controlId].length; i++) {
            this.logger.trace("[OL] : adding interaction " + OL.CONTROLSCLASSES[controlId][i].name + " to the map.");
            var interaction = new OL.CONTROLSCLASSES[controlId][i]();
            this.libMap.addInteraction(interaction);
            interactions.push(interaction);
        }
    }
    // on active / desactive toutes les interactions correspondantes
    for (var ii = 0; ii < interactions.length; ii++) {
        var _interaction = interactions[ii];
        this.logger.trace("[OL] : setting interaction to " + controlOpts + " for control : " + controlId);
        _interaction.setActive(controlOpts);
    }
    return interactions;
};

/**
 * Activate / Deactivate the ability to navigate on the map with mouse or pointer interaction.
 *
 * @param {Boolean} controlOpts - true for activation / false otherwise.
 *
 * @return {Object[]} interactions
 */
OL.prototype.setDraggable = function (controlOpts) {
    return this._toggleInteractions("draggable", controlOpts);
};

/**
 * Activate / Deactivate the ability to navigate on the map with keyborad.
 *
 * @param {Boolean} controlOpts - true for activation / false otherwise.
 *
 * @return {Object[]} interactions
 */
OL.prototype.setKeyboard = function (controlOpts) {
    return this._toggleInteractions("keyboard", controlOpts);
};

/**
 * Activate / Deactivate the ability to select features on the map.
 *
 * @param {Boolean} controlOpts - true for activation / false otherwise.
 *
 * @return {Object[]} interactions
 */
OL.prototype.setSelectable = function (controlOpts) {
    return this._toggleInteractions("selectable", controlOpts);
};

/**
 * Ajoute le controle de Zoom sur la carte
 *
 * @param {Object} controlOpts - options du controle
 *
 * @returns {Ol.control.Zoom} control
 */
OL.prototype.addZoomControl = function (controlOpts) {
    var control = new Ol.control.Zoom({
        target : controlOpts.div
    });
    this.libMap.addControl(control);
    return control;
};

/**
 * Ajoute le controle de Zoom (Box) sur la carte
 *
 * @param {Object} controlOpts - options du controle
 *
 * @returns {Object} control
 */
OL.prototype.addZoomBoxControl = function (controlOpts) {
    // TODO
    return null;
};

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
 *
 * @returns {Ol.control.OverviewMap} control
 */
OL.prototype.addOverviewControl = function (controlOpts) {
    this.logger.trace("[OL] addOverviewControl : ... ");
    var ovOpts = {};
    if (controlOpts.div) {
        ovOpts.target = controlOpts.div;
    }
    ovOpts.collapsed = !controlOpts.maximised;
    if (controlOpts.layers && Array.isArray(controlOpts.layers)) {
        var layerObjs = this._getLayersObj(controlOpts.layers);
        var olLayers = [];
        layerObjs.forEach(function (layerObj) {
            this.logger.trace("[OL] addOverviewControl : adding " + layerObj.id + " to map");
            olLayers.push(layerObj.obj);
        },
        this);
        if (olLayers.length === 0 && controlOpts.layers.length > 0) {
            // couche(s) non chargée(s) dans la carte principale :
            // on essaye de les créer comme des couches WMTS Géoportail.
            for (var i = 0; i < controlOpts.layers.length; i++) {
                this.logger.trace("[OL] addOverviewControl : adding geoportal layer : " + controlOpts.layers[i] + " to map");
                var gpLayer = new Ol.layer.GeoportalWMTS({
                    layer : controlOpts.layers[i]/*,
                    // on ecrase les contraintes de zoom qui peuvent
                    // exister par defaut sur la couche.
                    olParams : {
                        minResolution : this._getResolutionFromZoomLevel(21),
                        maxResolution : this._getResolutionFromZoomLevel(1)
                    }
                    */
                });
                if (gpLayer) {
                    olLayers.push(gpLayer);
                }
            }
        }
        if (olLayers.length > 0) {
            ovOpts.layers = olLayers;
        }
    }
    var viewOpts = {};
    var needsView = false;
    if (controlOpts.hasOwnProperty("minZoom")) {
        viewOpts.minZoom = controlOpts.minZoom;
        needsView = true;
    }
    if (controlOpts.hasOwnProperty("maxZoom")) {
        viewOpts.maxZoom = controlOpts.maxZoom;
        needsView = true;
    }
    if (controlOpts.hasOwnProperty("projection")) {
        viewOpts.projection = controlOpts.projection;
        needsView = true;
    }
    if (needsView) {
        ovOpts.view = new Ol.View(viewOpts);
    }
    var control = new Ol.control.OverviewMap(ovOpts);
    this.libMap.addControl(control);
    return control;
};

/**
 * Ajoute le controle d'orientation sur la carte
 *
 * @param {Object} controlOpts - options du controle
 *
 * @returns {Ol.control.Rotate} control
 */
OL.prototype.addOrientationControl = function (controlOpts) {
    var control = new Ol.control.Rotate({
        target : controlOpts.div,
        autoHide : controlOpts.autoHide || false // ol param
    });
    this.libMap.addControl(control);
    return control;
};

/**
 * Ajoute l'echelle graphique sur la carte
 *
 * @param {Object} controlOpts - options du controle
 * @param {String} controlOpts.div - Target HTML element container or its id. Default is chosen by map implementation.
 * @param {String} controlOpts.units - Units to display : "deg" (degrees) or "m" (metric values).
 * @param {Number} controlOpts.minWidth - Minimum width in pixels. Default is 64.
 *
 * @returns {Object} control
 */
OL.prototype.addGraphicScaleControl = function (controlOpts) {
    var olunits = controlOpts.units;
    if (olunits && controlOpts.units.toLowerCase() === "deg") {
        olunits = "degrees";
    } else if (olunits && controlOpts.units.toLowerCase() === "m") {
        olunits = "metric";
    }
    this.logger.trace("[OL] addGraphicScaleControl : setting graphicscale units to " + olunits);
    var control = new Ol.control.ScaleLine({
        target : controlOpts.div,
        units : olunits,
        minWidth : controlOpts.minWidth
    });
    this.libMap.addControl(control);
    return control;
};

/**
 * Adds graticule control to the map.
 *
 * @param {Object} controlOpts - control options
 * @param {String} controlOpts.strokeColor - stroke color expressed in hex format (default : #000000)
 * @param {Number} controlOpts.strokeOpacity - stroke opacity expressed between 0 and 1 (default : 0.2).
 * @param {Number} controlOpts.strokeWidth - stroke width expressed in pixels (default : 1).
 *
 * @return {Ol.Graticule} graticule
 */
OL.prototype.addGraticuleControl = function (controlOpts) {
    var options = controlOpts || {};
    options.strokeColor = options.strokeColor || "#000000";
    options.strokeOpacity = options.strokeOpacity || 0.2;
    options.strokeWidth = options.strokeWidth || 1;
    var rgba = IMap._hexToRgba(options.strokeColor, options.strokeOpacity);
    var graticule = new Ol.Graticule({
        strokeStyle : new Ol.style.Stroke({
            color : rgba,
            width : options.strokeWidth
        })
    });
    graticule.setMap(this.libMap);
    // ajout sauvage du graticule pour pouvoir le recuperer après
    // FIXME : trouver plus elegant...
    this.libMap.graticule = graticule;
    return graticule;
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
 * @param {Boolean} [controlOpts.editCoordinates = false] - add edit coordinates options. False by default.
 * @param {Object} [controlOpts.positionMarker] - options for position marker to use while editingCoordinates.
 * @param {String} controlOpts.positionMarker.url - Marker url
 * @param {Array} controlOpts.positionMarker.offset - Offsets in pixels used when positioning the marker towards targeted point.
 *      The first element in the array is the horizontal offset. A positive value shifts the marker right.
 *      The second element in the array is the vertical offset. A positive value shifts the marker down. [0, 0] value positions the top-left corner of the marker image to the targeted point.
 *      Default is offset associated to default marker image.
 * @param {Boolean} controlOpts.positionMarker.hide - if true, marker is not displayed, otherwise displayed (False by default.)
 * @param {Object} controlOpts.altitude - altitude interaction specific configuration. Implementation specific.
 *
 * @return {Ol.control.GeoportalMousePosition} control
 */
OL.prototype.addMousePositionControl = function (controlOpts) {
    var mpOpts = {};
    if (controlOpts.div) {
        mpOpts.target = controlOpts.div;
    }
    mpOpts.collapsed = !controlOpts.maximised;
    if (controlOpts.systems &&
        Array.isArray(controlOpts.systems) &&
        controlOpts.systems.length > 0) {
        for (var i = 0; i < controlOpts.systems.length; i++) {
            if (!Ol.proj.get(controlOpts.systems[i].crs)) {
                // on retire les systèmes non définis
                this.logger.trace("[OL] addMousePositionControl : crs [" + controlOpts.systems[i].crs + "] not found.");
                continue;
            }
            if (!mpOpts.systems) {
                mpOpts.systems = [];
            }
            mpOpts.systems.push(controlOpts.systems[i]);
        }
    }
    if (controlOpts.units &&
        Array.isArray(controlOpts.units) &&
        controlOpts.units.length > 0) {
        mpOpts.units = [];
        for (var ii = 0; ii < controlOpts.units.length; ii++) {
            if (typeof controlOpts.units[ii] === "string") {
                this.logger.trace("[OL] addMousePositionControl : adding unit   [" + controlOpts.units[ii].toUpperCase());
                mpOpts.units.push(controlOpts.units[ii]);
            }
        }
    }
    mpOpts.displayAltitude = controlOpts.displayAltitude;
    mpOpts.displayCoordinates = controlOpts.displayCoordinates;
    if (controlOpts.altitude) {
        mpOpts.altitude = controlOpts.altitude;
    }
    mpOpts.editCoordinates = controlOpts.editCoordinates;
    mpOpts.positionMarker = controlOpts.positionMarker;
    var control = new Ol.control.GeoportalMousePosition(mpOpts);
    this.libMap.addControl(control);
    return control;
};

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
 * @param {String} controlOpts.markersOpts[property].url - marker base64 encoded url (ex "data:image/png;base64, ...""). Mandatory for a custom marker
 * @param {Array} controlOpts.markersOpts[property].offset - Offsets in pixels used when positioning the overlay. The first element in the array is the horizontal offset. A positive value shifts the overlay right. The second element in the array is the vertical offset. A positive value shifts the overlay down. Default is [0, 0]. (see http://openlayers.org/en/latest/apidoc/ol.Overlay.html)
 * @param {Object} controlOpts.routeOptions - route service options. For advanced use only. See {@link http://depot.ign.fr/geoportail/bibacces/develop/doc/module-Services.html#~route Gp.Services.route()} to know all route options.
 * @param {Object} controlOpts.autocompleteOptions - autocomplete service options. See {@link http://depot.ign.fr/geoportail/bibacces/develop/doc/module-Services.html#~autoComplete Gp.Services.autoComplete()} to know all autocomplete options.
 *
 * @return {Ol.control.Route} control
 */
OL.prototype.addRouteControl = function (controlOpts) {
    var rteOpts = {};
    if (controlOpts.div) {
        rteOpts.target = controlOpts.div;
    }
    rteOpts.collapsed = !controlOpts.maximised;
    if (controlOpts.graphs) {
        rteOpts.graphs = controlOpts.graphs;
    }
    if (controlOpts.exclusions) {
        rteOpts.exclusions = controlOpts.exclusions;
    }
    if (controlOpts.markersOpts) {
        rteOpts.markersOpts = {};
        if (controlOpts.markersOpts.departure) {
            rteOpts.markersOpts.departure = controlOpts.markersOpts.departure;
        }
        if (controlOpts.markersOpts.stages) {
            rteOpts.markersOpts.stages = controlOpts.markersOpts.stages;
        }
        if (controlOpts.markersOpts.arrival) {
            rteOpts.markersOpts.arrival = controlOpts.markersOpts.arrival;
        }
    }
    if (controlOpts.routeOptions) {
        rteOpts.routeOptions = controlOpts.routeOptions;
    }
    if (controlOpts.autocompleteOptions) {
        rteOpts.autocompleteOptions = controlOpts.autocompleteOptions;
    }
    var control = new Ol.control.Route(rteOpts);
    this.libMap.addControl(control);
    return control;
};

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
 * @param {String} controlOpts.markerOpts.url - marker base64 encoded url (ex "data:image/png;base64, ...""). Mandatory for a custom marker
 * @param {Array} controlOpts.markerOpts.offset - Offsets in pixels used when positioning the overlay. The first element in the array is the horizontal offset. A positive value shifts the overlay right. The second element in the array is the vertical offset. A positive value shifts the overlay down. Default is [0, 0]. (see http://openlayers.org/en/latest/apidoc/ol.Overlay.html)
 * @param {Object} controlOpts.isocurveOptions - isocurve service options. For advanced use only. See {@link http://depot.ign.fr/geoportail/bibacces/develop/doc/module-Services.html#~isocurve Gp.Services.isocurve()} to know all isocurve options.
 * @param {Object} controlOpts.autocompleteOptions - autocomplete service options. See {@link http://depot.ign.fr/geoportail/bibacces/develop/doc/module-Services.html#~autoComplete Gp.Services.autoComplete()} to know all autocomplete options.
 *
 * @return {Ol.control.Isocurve} control
 */
OL.prototype.addIsocurveControl = function (controlOpts) {
    var isoOpts = {};
    if (controlOpts.div) {
        isoOpts.target = controlOpts.div;
    }
    isoOpts.collapsed = !controlOpts.maximised;
    if (controlOpts.graphs) {
        isoOpts.graphs = controlOpts.graphs;
    }
    if (controlOpts.exclusions) {
        isoOpts.exclusions = controlOpts.exclusions;
    }
    if (controlOpts.methods) {
        isoOpts.methods = controlOpts.methods;
    }
    if (controlOpts.directions) {
        isoOpts.directions = controlOpts.directions;
    }
    if (controlOpts.markerOpts) {
        isoOpts.markerOpts = controlOpts.markerOpts;
    }
    if (controlOpts.isocurveOptions) {
        isoOpts.isocurveOptions = controlOpts.isocurveOptions;
    }
    if (controlOpts.autocompleteOptions) {
        isoOpts.autocompleteOptions = controlOpts.autocompleteOptions;
    }
    var control = new Ol.control.Isocurve(isoOpts);
    this.libMap.addControl(control);
    return control;
};

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
 *
 * @return {Ol.control.LayerImport} control
 */
OL.prototype.addLayerImportControl = function (controlOpts) {
    var importOpts = {};
    if (controlOpts.div) {
        importOpts.target = controlOpts.div;
    }
    importOpts.collapsed = !controlOpts.maximised;
    if (controlOpts.layerTypes) {
        importOpts.layerTypes = controlOpts.layerTypes;
    }
    importOpts.webServicesOptions = {};
    if (controlOpts.webServicesOptions) {
        importOpts.webServicesOptions = controlOpts.webServicesOptions;
    } else {
        if (this.mapOptions && this.mapOptions.proxyUrl) {
            importOpts.webServicesOptions.proxyUrl = this.mapOptions.proxyUrl;
        }
        if (this.mapOptions && this.mapOptions.noProxyDomains) {
            importOpts.webServicesOptions.noProxyDomains = this.mapOptions.noProxyDomains;
        }
    }
    if (controlOpts.defaultStyles) {
        importOpts.vectorStyleOptions = {};
        var defaultMarkerSrc = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAARDSURBVFiF3ZndaxxVGMZ/Z/YjX00Nadpo1qrFBgu56D9QbAtiLoRC7ywSNK1NURRREBKRFlSwFBW0gnSrJXY1CmISgyjFiyYSFC9ajE3MmpjdjWlMUtNos9lN9mteLzbRuCbZmTMTBB+Yi51znvd5n3nPnjnnjBIR/i/wuh4xpCpI0ojiENAA1AE1wCzwKzCE0EM5l2iShJvSyrXKnFVb8dOK4hmg3AIjifAmaU7ztMy7kYI7Zs6rQwjvka+AXcyiOMZx6XGahuE0AEHVitCFnhGAGoQugqrVaSrOKpNP4FWnSaxCGy1yWpesbyY/tLpwo7p/w0RxWHfI6Zk5q7ZSwhj6Q2sjzJLiXp1JQe+p+mllc4wA1CzHtw37lQmpCha5gbXpVxdJythh9z1kvzJJGrFixPBmOXixl+Z4mONmguZ4mIMXezG8WQsq5cs6tmDfTP7NXiSqN0vTzBD1TQfwbdmDUhX4tuyhvukATTNDlgxZ0SmUtUsgv0TZGPsv9FNSvXfNtpLqvey/0O+KTgF0zNQV7XHP4dsdtVvVKYCOmeqiPbwVOx21W9UpgI6ZWNEe2cSEo3arOgWwb0YYLp5G17Sjdqs6BdCZzYqL9B3dR2puYM221NwAfUf3uaJTAB0zaye5GmbWS6i2gdFQL5mFMCIJMgthRkO9hGobMLPFN4VWdAoptlcAQeUDRoG77YrZwDhQT4tk7JDsV6ZFMggv2+bZwyt2jYDuQnOa94GIFrc4IkzRrkPUM3NKsijatLjF0copsbJ++xec7TTPqw6EI/oB/glT+PC+13Y/aSQNv/Is+tNer09lMn7DMHwAYppp8fvTIpISkVQsFrslqww4M9OuqkgzANzl1MhCyrjZGAycm573pK1yFCyi5FoWvo/FYlPOT2fOqftRXMbB9lkEs+3zbe2f/FD5i3YMj2p3vn8/IV8DZ5yE+Gqkot+JEQCPada5dRhxEriiQ5ya90w+272916F+KpnJDLhjpkUy5HgESNqhZU2Vfr5ne+dSFtOBeso06J6cnEy6d0z0hPwEPGeH8sGVykvfjpfe1NZUci2+mHg7Go2G8z/d/goQVJ9B8S1veMYffujduo/thl+ZwUzDuBqJRGZWt7n/FcDH46lFNVLilar1uiTTxsJTnTssH/QpJVlMNQa5wbGJiWERya3Vz30zzfLb3OveY3dU5j5dp4e80Xdbd3TOu/H/yyAtpjnqgeGS8crRQRks+v5xf5gtY/KM/6NAVebhwvv90bLvHu2o/XId2pJSMmIaxo/RaHRMxN6yZtPM0K5K/7hl/FxVZgZWbs0mPDceeKcuGE95/kpSKUmaImHDNIfHrl+PiIj2zOb+MFvBY7IUOVl2ZG9g6bJH4ckJuRe/2NYZT3myKIkrGM4pNRyLjY+LW09URDb1+uaF0pfm3zJ+7zhRGdq1c9eDuwOBOzdLa/OG2X+APwE8DU64Y/5gfAAAAABJRU5ErkJggg==";
        var strokeOpacity;
        var strokeColor;
        var fillOpacity;
        var fillColor;
        if (controlOpts.defaultStyles.KML) {
            var userKMLDefaultStyles = controlOpts.defaultStyles.KML;
            var kmldefaultStyleOptions = {};
            kmldefaultStyleOptions.image = new Ol.style.Icon({
                src : userKMLDefaultStyles.markerSrc || defaultMarkerSrc,
                anchor : [userKMLDefaultStyles.markerXAnchor || 25.5, userKMLDefaultStyles.markerYAnchor || 38],
                anchorOrigin : "top-left",
                anchorXUnits : "pixels",
                anchorYUnits : "pixels"
            });
            strokeOpacity = userKMLDefaultStyles.strokeOpacity || 0.8;
            strokeColor = userKMLDefaultStyles.strokeColor || "#002A50";
            kmldefaultStyleOptions.stroke = new Ol.style.Stroke({
                color : IMap._hexToRgba(strokeColor, strokeOpacity),
                width : userKMLDefaultStyles.strokeWidth || 4
            });
            fillOpacity = userKMLDefaultStyles.polyFillOpacity || 0.5;
            fillColor = userKMLDefaultStyles.polyFillColor || "#00B798";
            kmldefaultStyleOptions.fill = new Ol.style.Fill({
                color : IMap._hexToRgba(fillColor, fillOpacity)
            });
            var kmldefaultStyle = new Ol.style.Style(kmldefaultStyleOptions);
            importOpts.vectorStyleOptions.KML = {
                defaultStyle : kmldefaultStyle
            };
        }
        if (controlOpts.defaultStyles.GPX) {
            var userGPXDefaultStyles = controlOpts.defaultStyles.GPX;
            var gpxdefaultStyleOptions = {};
            gpxdefaultStyleOptions.image = new Ol.style.Icon({
                src : userGPXDefaultStyles.markerSrc || defaultMarkerSrc,
                anchor : [userGPXDefaultStyles.markerXAnchor || 25.5, userGPXDefaultStyles.markerYAnchor || 38],
                anchorOrigin : "top-left",
                anchorXUnits : "pixels",
                anchorYUnits : "pixels"
            });
            strokeOpacity = userGPXDefaultStyles.strokeOpacity || 0.8;
            strokeColor = userGPXDefaultStyles.strokeColor || "#002A50";
            gpxdefaultStyleOptions.stroke = new Ol.style.Stroke({
                color : IMap._hexToRgba(strokeColor, strokeOpacity),
                width : userGPXDefaultStyles.strokeWidth || 4
            });
            var gpxdefaultStyle = new Ol.style.Style(gpxdefaultStyleOptions);
            importOpts.vectorStyleOptions.GPX = {
                defaultStyle : gpxdefaultStyle
            };
        }
        if (controlOpts.defaultStyles.GeoJSON) {
            var userGeoJSONDefaultStyles = controlOpts.defaultStyles.GeoJSON;
            var geoJSONdefaultStyleOptions = {};
            geoJSONdefaultStyleOptions.image = new Ol.style.Icon({
                src : userGeoJSONDefaultStyles.markerSrc || defaultMarkerSrc,
                anchor : [userGeoJSONDefaultStyles.markerXAnchor || 25.5, userGeoJSONDefaultStyles.markerYAnchor || 38],
                anchorOrigin : "top-left",
                anchorXUnits : "pixels",
                anchorYUnits : "pixels"
            });
            strokeOpacity = userGeoJSONDefaultStyles.strokeOpacity || 0.8;
            strokeColor = userGeoJSONDefaultStyles.strokeColor || "#002A50";
            geoJSONdefaultStyleOptions.stroke = new Ol.style.Stroke({
                color : IMap._hexToRgba(strokeColor, strokeOpacity),
                width : userGeoJSONDefaultStyles.strokeWidth || 4
            });
            fillOpacity = userGeoJSONDefaultStyles.polyFillOpacity || 0.5;
            fillColor = userGeoJSONDefaultStyles.polyFillColor || "#00B798";
            geoJSONdefaultStyleOptions.fill = new Ol.style.Fill({
                color : IMap._hexToRgba(strokeColor, strokeOpacity)
            });
            var geoJSONdefaultStyle = new Ol.style.Style(geoJSONdefaultStyleOptions);
            importOpts.vectorStyleOptions.GeoJSON = {
                defaultStyle : geoJSONdefaultStyle
            };
        }
    }
    var control = new Ol.control.LayerImport(importOpts);
    this.libMap.addControl(control);
    return control;
};

/**
 * Rajoute une configuration de couche au LayerSwitcher
 *
 * @param {Object} implLayer - objet couche de l'implémentation
 * @param {Gp.LayerOptions} layerOptions - options de la couche.
 * @private
 */
OL.prototype._addLayerConfToLayerSwitcher = function (implLayer, layerOptions) {
    this.logger.trace("[OL] : _addLayerConfToLayerSwitcher ... ");
    var lsControl = this.getLibMapControl("layerswitcher");
    if (lsControl) {
        lsControl.addLayer(implLayer, this._layerOptions2layerConf(layerOptions));
    }
};

/**
 * Adds LayerSwitcher control to the map.
 *
 * @param {Object} controlOpts - control options
 * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
 * @param {Boolean} controlOpts.maximised - if the control has to be opened or not.
 *
 * @return {Ol.control.LayerSwitcher} control
 */
OL.prototype.addLayerSwitcherControl = function (controlOpts) {
    this.logger.trace("[OL] : addLayerSwitcherControl ... ");
    // TODO : parametrage des couches
    var lsOpts = {
        layers : [],
        options : {
            collapsed : !(controlOpts && controlOpts.maximised)
        }
    };
    if (controlOpts.div) {
        lsOpts.options.target = controlOpts.div;
    }
    // application des configuration des couches :
    for (var i = 0; i < this._layers.length; i++) {
        var layer = this._layers[i];
        this.logger.trace("[OL] : layerSwitcher : configuring layer : " + layer.id);
        // INFO : les couches Geoportail sont aussi configurées.
        var layerConf = {
            layer : layer.obj,
            config : {}
        };
        if (layer.options.title) {
            this.logger.trace("[OL] : layerSwitcher : setting title to [" + layer.options.title + "] for layer " + layer.id);
            layerConf.config.title = layer.options.title;
        }
        if (layer.options.description) {
            this.logger.trace("[OL] : layerSwitcher : setting description to [" + layer.options.description + "] for layer " + layer.id);
            layerConf.config.description = layer.options.description;
        }
        if (layer.options.quicklookUrl) {
            this.logger.trace("[OL] : layerSwitcher : setting quicklookUrl to [" + layer.options.quicklookUrl + "] for layer " + layer.id);
            layerConf.config.quicklookUrl = layer.options.quicklookUrl;
        }
        if (layer.options.legends) {
            this.logger.trace("[OL] : layerSwitcher : setting legends to [" + layer.options.legends + "] for layer " + layer.id);
            layerConf.config.legends = layer.options.legends;
        }
        if (layer.options.metadata) {
            this.logger.trace("[OL] : layerSwitcher : setting metadata to [" + layer.options.metadata + "] for layer " + layer.id);
            layerConf.config.metadata = this._filterEmptyMetadata(layer.options.metadata);
        }
        lsOpts.layers.push(layerConf);
    }

    this.logger.trace("[OL] : layerSwitcher Opts : ... ");
    var control = new Ol.control.LayerSwitcher(lsOpts);
    this.libMap.addControl(control);
    return control;
};

/**
 * Fill ol styles with params
 *
 * @param {Object} stylesProps - properties
 * @returns {Ol.style.Stroke} - ol.style.Stroke Object
 * @private
 */
OL.prototype._fillStrokeStyles = function (stylesProps) {
    var strokeOpts = {};
    var resultStyle = null;
    if (stylesProps.hasOwnProperty("strokeLineDash")) {
        strokeOpts.lineDash = stylesProps.strokeLineDash;
    }
    if (stylesProps.hasOwnProperty("strokeColor")) {
        strokeOpts.color = stylesProps.strokeColor;
    }
    if (stylesProps.hasOwnProperty("strokeWidth")) {
        strokeOpts.width = stylesProps.strokeWidth;
    }
    if (Object.keys(strokeOpts).length > 0) {
        resultStyle = new Ol.style.Stroke(strokeOpts);
    }
    return resultStyle;
};

/**
 * Fill ol styles with params
 *
 * @param {Object} stylesProps - properties
 * @returns {Ol.style.Stroke} - ol.style.Stroke Object
 * @private
 */
OL.prototype._fillPointerStyles = function (stylesProps) {
    var pointerOpts = {};
    if (stylesProps.hasOwnProperty("radius")) {
        pointerOpts.radius = stylesProps.radius;
    }
    pointerOpts.stroke = this._fillStrokeStyles(stylesProps);
    if (stylesProps.hasOwnProperty("fillColor")) {
        pointerOpts.fill = new Ol.style.Fill({
            color : stylesProps.fillColor
        });
    }
    var pStyle = new Ol.style.Circle(pointerOpts);
    return pStyle;
};

/**
 * Adds measure length tool bar control to the map.
 *
 * @param {Object} controlOpts - options du controle
 *
 * @return {Ol.control.MeasureLength} control
 */
OL.prototype.addLengthControl = function (controlOpts) {
    var lengthOpts = {};
    if (controlOpts.div) {
        lengthOpts.target = controlOpts.div;
    }

    // styles
    if (controlOpts.hasOwnProperty("styles")) {
        lengthOpts.styles = {};
        // pointer style creation
        if (controlOpts.styles.hasOwnProperty("pointer")) {
            lengthOpts.styles.pointer = this._fillPointerStyles(controlOpts.styles.pointer);
        }
        // drawStart style creation
        if (controlOpts.styles.hasOwnProperty("start")) {
            var startOpts = {};
            startOpts.stroke = this._fillStrokeStyles(controlOpts.styles.start);
            if (controlOpts.styles.start.hasOwnProperty("fillColor")) {
                startOpts.fill = new Ol.style.Fill({
                    color : controlOpts.styles.start.fillColor
                });
            }
            lengthOpts.styles.start = new Ol.style.Style(startOpts);
        }
        // drawEnd style creation
        if (controlOpts.styles.hasOwnProperty("finish")) {
            var finishOpts = {};
            finishOpts.stroke = this._fillStrokeStyles(controlOpts.styles.finish);
            if (controlOpts.styles.finish.hasOwnProperty("fillColor")) {
                finishOpts.fill = new Ol.style.Fill({
                    color : controlOpts.styles.finish.fillColor
                });
            }
            lengthOpts.styles.finish = new Ol.style.Style(finishOpts);
        }
    }
    // geodesic
    if (controlOpts.hasOwnProperty("geodesic")) {
        lengthOpts.geodesic = controlOpts.geodesic;
    }

    var control = new Ol.control.MeasureLength(lengthOpts);
    this.libMap.addControl(control);
    return control;
};

/**
 * Adds measure area tool bar control to the map.
 *
 * @param {Object} controlOpts - options du controle
 *
 * @return {Ol.control.MeasureArea} control
 */
OL.prototype.addAreaControl = function (controlOpts) {
    this.logger.trace("[OL] addAreaControl : ... ");
    var areaOpts = {};
    if (controlOpts.div) {
        areaOpts.target = controlOpts.div;
    }

    // styles
    if (controlOpts.hasOwnProperty("styles")) {
        areaOpts.styles = {};
        // pointer style creation
        if (controlOpts.styles.hasOwnProperty("pointer")) {
            areaOpts.styles.pointer = this._fillPointerStyles(controlOpts.styles.pointer);
        }
        // drawStart style creation
        if (controlOpts.styles.hasOwnProperty("start")) {
            var startOpts = {};
            startOpts.stroke = this._fillStrokeStyles(controlOpts.styles.start);
            if (controlOpts.styles.start.hasOwnProperty("fillColor")) {
                startOpts.fill = new Ol.style.Fill({
                    color : controlOpts.styles.start.fillColor
                });
            }
            areaOpts.styles.start = new Ol.style.Style(startOpts);
        }
        // drawEnd style creation
        if (controlOpts.styles.hasOwnProperty("finish")) {
            var finishOpts = {};
            finishOpts.stroke = this._fillStrokeStyles(controlOpts.styles.finish);
            if (controlOpts.styles.finish.hasOwnProperty("fillColor")) {
                finishOpts.fill = new Ol.style.Fill({
                    color : controlOpts.styles.finish.fillColor
                });
            }
            areaOpts.styles.finish = new Ol.style.Style(finishOpts);
        }
    }

    // geodesic
    if (controlOpts.hasOwnProperty("geodesic")) {
        areaOpts.geodesic = controlOpts.geodesic;
    }

    var control = new Ol.control.MeasureArea(areaOpts);
    this.libMap.addControl(control);
    return control;
};

/**
 * Adds measure azimuth tool bar control to the map.
 *
 * @param {Object} controlOpts - options du controle
 *
 * @return {Ol.control.MeasureAzimuth} control
 */
OL.prototype.addAzimuthControl = function (controlOpts) {
    var azimuthOpts = {};
    if (controlOpts.div) {
        azimuthOpts.target = controlOpts.div;
    }

    // styles
    if (controlOpts.hasOwnProperty("styles")) {
        azimuthOpts.styles = {};
        // pointer style creation
        if (controlOpts.styles.hasOwnProperty("pointer")) {
            azimuthOpts.styles.pointer = this._fillPointerStyles(controlOpts.styles.pointer);
        }
        // drawStart style creation
        if (controlOpts.styles.hasOwnProperty("start")) {
            var startOpts = {};
            startOpts.stroke = this._fillStrokeStyles(controlOpts.styles.start);
            if (controlOpts.styles.start.hasOwnProperty("fillColor")) {
                startOpts.fill = new Ol.style.Fill({
                    color : controlOpts.styles.start.fillColor
                });
            }
            azimuthOpts.styles.start = new Ol.style.Style(startOpts);
        }
        // drawEnd style creation
        if (controlOpts.styles.hasOwnProperty("finish")) {
            var finishOpts = {};
            finishOpts.stroke = this._fillStrokeStyles(controlOpts.styles.finish);
            if (controlOpts.styles.finish.hasOwnProperty("fillColor")) {
                finishOpts.fill = new Ol.style.Fill({
                    color : controlOpts.styles.finish.fillColor
                });
            }
            azimuthOpts.styles.finish = new Ol.style.Style(finishOpts);
        }
    }

    // geodesic
    if (controlOpts.hasOwnProperty("geodesic")) {
        azimuthOpts.geodesic = controlOpts.geodesic;
    }

    var control = new Ol.control.MeasureAzimuth(azimuthOpts);
    this.libMap.addControl(control);
    return control;
};

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
 *
 * @return {Ol.control.ElevationPath} control
 */
OL.prototype.addElevationPathControl = function (controlOpts) {
    var elevOpts = {};
    this.logger.trace("[OL] addElevationPathControl : ... ");
    if (controlOpts.div) {
        elevOpts.target = controlOpts.div;
    }
    // styles
    if (controlOpts.styles) {
        elevOpts.stylesOptions = {};
        // pointer style creation
        if (controlOpts.styles.hasOwnProperty("pointer")) {
            elevOpts.stylesOptions.draw = {};
            elevOpts.stylesOptions.draw.pointer = this._fillPointerStyles(controlOpts.styles.pointer);
        }
        // drawStart style creation
        if (controlOpts.styles.hasOwnProperty("start")) {
            if (!elevOpts.stylesOptions.draw) {
                elevOpts.stylesOptions.draw = {};
            }
            elevOpts.stylesOptions.draw.start = this._fillStrokeStyles(controlOpts.styles.start);
        }
        // drawEnd style creation
        if (controlOpts.styles.hasOwnProperty("finish")) {
            if (!elevOpts.stylesOptions.draw) {
                elevOpts.stylesOptions.draw = {};
            }
            elevOpts.stylesOptions.draw.finish = this._fillStrokeStyles(controlOpts.styles.finish);
        }
        // marker style creation
        if (controlOpts.styles.hasOwnProperty("marker")) {
            var markerOpts = {};
            if (controlOpts.styles.marker.src) {
                // on ne cree le marker que si une image source a été fournie
                markerOpts.src = controlOpts.styles.marker.src;
                markerOpts.anchor = [
                    controlOpts.styles.marker.xAnchor ? controlOpts.styles.marker.xAnchor : 0,
                    controlOpts.styles.marker.yAnchor ? controlOpts.styles.marker.yAnchor : 0
                ];
            }
            if (Object.keys(markerOpts).length > 0) {
                elevOpts.stylesOptions.marker = new Ol.style.Icon(markerOpts);
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
    var control = new Ol.control.ElevationPath(elevOpts);
    this.libMap.addControl(control);
    return control;
};

/**
 * Adds search control to the map.
 *
 * @param {Object} controlOpts - control options
 * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
 * @param {Boolean} controlOpts.maximised - if the control has to be opened or not.
 * @param {Object} controlOpts.resources - resources to be used by geocode and autocompletion services
 * @param {Array.<String>} controlOpts.resources.geocode - resources geocoding, by default : ["PositionOfInterest", "StreetAddress"]
 * @param {Array.<String>} controlOpts.resources.autocomplete - resources autocompletion, by default : ["PositionOfInterest", "StreetAddress"]
 * @param {Boolean} [controlOpts.displayAdvancedSearch = false] - True to display advanced search tools. Default is false (not displayed)
 * @param {Object} controlOpts.advancedSearch - advanced search options for geocoding (filters). Properties can be found among geocode options.filterOptions (see http://depot.ign.fr/geoportail/bibacces/develop/doc/module-Services.html#~geocode)
 * @param {Object} [controlOpts.geocodeOptions = {}] - options of geocode service (see http://depot.ign.fr/geoportail/bibacces/develop/doc/module-Services.html#~geocode)
 * @param {Object} [controlOpts.autocompleteOptions = {}] - options of autocomplete service (see http://depot.ign.fr/geoportail/bibacces/develop/doc/module-Services.html#~autoComplete)
 *
 * @return {Ol.control.SearchEngine} control
 */
OL.prototype.addSearchControl = function (controlOpts) {
    var searchOpts = {};
    if (searchOpts.div) {
        searchOpts.target = controlOpts.div;
    }
    searchOpts.collapsed = !controlOpts.maximised;

    // zoomTo
    searchOpts.zoomTo = controlOpts.zoomTo || null;

    // resources
    if (controlOpts.hasOwnProperty("resources")) {
        searchOpts.resources = {};
        if (controlOpts.resources.hasOwnProperty("geocode")) {
            searchOpts.resources.geocode = controlOpts.resources.geocode;
        }
        if (controlOpts.resources.hasOwnProperty("autocomplete")) {
            searchOpts.resources.autocomplete = controlOpts.resources.autocomplete;
        }
    }
    // advancedSearch
    searchOpts.displayAdvancedSearch = controlOpts.hasOwnProperty("displayAdvancedSearch") && controlOpts.displayAdvancedSearch;
    if (controlOpts.hasOwnProperty("advancedSearch")) {
        searchOpts.advancedSearch = controlOpts.advancedSearch;
    }
    if (controlOpts.hasOwnProperty("geocodeOptions")) {
        searchOpts.geocodeOptions = controlOpts.geocodeOptions;
    }
    if (controlOpts.hasOwnProperty("autocompleteOptions")) {
        searchOpts.autocompleteOptions = controlOpts.autocompleteOptions;
    }
    var control = new Ol.control.SearchEngine(searchOpts);
    this.libMap.addControl(control);
    return control;
};

/**
 * Adds reverse search control to the map.
 *
 * @param {Object} controlOpts - control options
 * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
 * @param {Boolean} controlOpts.maximised - if the control has to be opened or not.
 * @param {Array.<String>} controlOpts.resources - resources geocoding, by default : ["PositionOfInterest", "StreetAddress"]
 * @param {Array.<String>} controlOpts.delimitations - delimitations for reverse geocoding, by default : ["Point", "Circle", "Extent"]. Possible values are : "Point", "Circle", "Extent". Delimitations will be displayed in the same order in widget list.
 * @param {Object} [controlOpts.reverseGeocodeOptions = {}] - reverse geocode service options. see http://depot.ign.fr/geoportail/bibacces/develop/doc/module-Services.html#~reverseGeocode to know all reverse geocode options.
 *
 * @return {Ol.control.ReverseGeocode} control
 */
OL.prototype.addReverseSearchControl = function (controlOpts) {
    var searchOpts = {};
    if (searchOpts.div) {
        searchOpts.target = controlOpts.div;
    }
    searchOpts.collapsed = !controlOpts.maximised;
    // resources
    if (controlOpts.hasOwnProperty("resources")) {
        searchOpts.resources = controlOpts.resources;
    }
    if (controlOpts.hasOwnProperty("reverseGeocodeOptions")) {
        searchOpts.reverseGeocodeOptions = controlOpts.reverseGeocodeOptions;
    }
    if (controlOpts.hasOwnProperty("delimitations")) {
        searchOpts.delimitations = controlOpts.delimitations;
    }
    var control = new Ol.control.ReverseGeocode(searchOpts);
    this.libMap.addControl(control);
    return control;
};

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
 *
 * @return {Ol.control.Drawing} control
 */
OL.prototype.addDrawingControl = function (controlOpts) {
    var drawingOpts = {};
    if (controlOpts.div) {
        drawingOpts.target = controlOpts.div;
    }
    drawingOpts.collapsed = !controlOpts.maximised;
    // tools
    if (controlOpts.hasOwnProperty("tools")) {
        drawingOpts.tools = controlOpts.tools;
    }
    // labels
    if (controlOpts.hasOwnProperty("labels")) {
        drawingOpts.labels = controlOpts.labels;
    }
    // defaultStyles
    if (controlOpts.hasOwnProperty("defaultStyles")) {
        drawingOpts.defaultStyles = controlOpts.defaultStyles;
    }
    // cursorStyle
    if (controlOpts.hasOwnProperty("cursorStyle")) {
        drawingOpts.cursorStyle = controlOpts.cursorStyle;
    }
    // markersList
    if (controlOpts.hasOwnProperty("markersList") &&
        Array.isArray(controlOpts.markersList) &&
        controlOpts.markersList.length > 0
    ) {
        drawingOpts.markersList = [];
        for (var i = 0; i < controlOpts.markersList.length; i++) {
            var mrk = controlOpts.markersList[i];
            if (!mrk.src) {
                continue;
            }
            var olmrk = {
                src : mrk.src
            };
            if (mrk.xAnchor && mrk.yAnchor) {
                olmrk.anchor = [mrk.xAnchor, mrk.yAnchor];
            }
            drawingOpts.markersList.push(olmrk);
        }
    }
    // layer
    if (controlOpts.layer) {
        var olLayers = this._getLayersObj([controlOpts.layer]);
        if (olLayers && olLayers.length > 0) {
            drawingOpts.layer = olLayers[0];
        }
    }
    var control = new Ol.control.Drawing(drawingOpts);
    this.libMap.addControl(control);
    return control;
};

/**
 * Ajoute l'outil d'attributions
 *
 * @param {Object} controlOpts - options du controle
 * @return {Ol.control.GeoportalAttribution} control
 */
OL.prototype.addAttributionsControl = function (controlOpts) {
    var attOpts = {};
    if (controlOpts.div) {
        attOpts.target = controlOpts.div;
    }
    attOpts.collapsed = !controlOpts.maximised;
    var control = new Ol.control.GeoportalAttribution(attOpts);
    this.libMap.addControl(control);
    return control;
};

/**
 * Ajoute l'outil d'orientation de la camera sur la carte
 *
 * @param {Object} controlOpts - options du controle
 * @return {Object} control
 */
OL.prototype.addCameraControl = function (controlOpts) {
    // Not implemented (3D feature)
    return null;
};

/**
 * Ajoute l'outil getFeatureInfo
 *
 * @param {Object} controlOpts - options du controle
 * @return {Ol.control.GetFeatureInfo} control
 */
OL.prototype.addGetFeatureInfoControl = function (controlOpts) {
    var gfiOpts = {};
    gfiOpts.options = {};

    if (controlOpts.hasOwnProperty("options")) {
        if (controlOpts.options.hasOwnProperty("auto")) {
            gfiOpts.options.auto = controlOpts.options.auto;
        }
        if (controlOpts.options.hasOwnProperty("active")) {
            gfiOpts.options.active = controlOpts.options.active;
        }
        if (controlOpts.options.hasOwnProperty("hidden")) {
            gfiOpts.options.hidden = controlOpts.options.hidden;
        }
        if (controlOpts.options.hasOwnProperty("defaultEvent")) {
            gfiOpts.options.defaultEvent = controlOpts.options.defaultEvent;
        }
        if (controlOpts.options.hasOwnProperty("defaultInfoFormat")) {
            gfiOpts.options.defaultInfoFormat = controlOpts.options.defaultInfoFormat;
        }
        if (controlOpts.options.hasOwnProperty("cursorStyle")) {
            gfiOpts.options.cursorStyle = controlOpts.options.cursorStyle;
        }
        // autoPan Options. If undefined : set defaults
        if (!controlOpts.options.hasOwnProperty("autoPanOptions")) {
            controlOpts.options.autoPanOptions = IMap.DEFAULT_AUTOPAN_OPTIONS;
        }
        gfiOpts.options.autoPan = controlOpts.options.autoPanOptions.autoPan;
        gfiOpts.options.autoPanAnimation = {
            duration : controlOpts.options.autoPanOptions.duration
        };
        gfiOpts.options.autoPanMargin = controlOpts.options.autoPanOptions.margin;
    }
    if (this.mapOptions && this.mapOptions.proxyUrl) {
        gfiOpts.options.proxyUrl = this.mapOptions.proxyUrl;
    }
    if (this.mapOptions && this.mapOptions.noProxyDomains) {
        gfiOpts.options.noProxyDomains = this.mapOptions.noProxyDomains;
    }

    gfiOpts.layers = [];
    for (var gfiLayerId in controlOpts.layers) {
        var gfiLayer = controlOpts.layers[gfiLayerId];

        for (var i = 0; i < this._layers.length; ++i) {
            var mapLayer = this._layers[i];

            if (gfiLayerId === mapLayer.id) {
                if (!mapLayer.options.queryable) {
                    this.logger.info("GetFeatureInfo layer '" + gfiLayerId + "' has not been added to control because this layer is not queryable.");
                } else {
                    var layerConf = {
                        obj : mapLayer.obj
                    };
                    if (gfiLayer.event) {
                        layerConf.event = gfiLayer.event;
                    }
                    if (mapLayer.options.gfiFormat) {
                        layerConf.infoFormat = mapLayer.options.gfiFormat;
                    }

                    gfiOpts.layers.push(layerConf);
                    break;
                }
            }
        }
    }

    var control = new Ol.control.GetFeatureInfo(gfiOpts);
    this.libMap.addControl(control);
    return control;
};

/**
 * Remove the controls listed to the map.
 *
 * @param {Array.<String>} controlIds - A list of control's id or null.
 */
OL.prototype.removeControls = function (controlIds) {
    this.logger.trace("[OL] : removeControls ... ");
    if (!controlIds || (Array.isArray(controlIds) && controlIds.length === 0)) {
        this.logger.info("No control to remove.");
        return;
    }
    if (!Array.isArray(controlIds)) {
        controlIds = [controlIds];
    }
    var controlId = null;
    for (var i = 0; i < controlIds.length; i++) {
        controlId = controlIds[i];
        var idx = this._findRegisteredControl(controlId);
        if (idx >= 0) {
            this.logger.trace("[OL] : removeControls : removing [" + controlId + "] from register.");
            this._controls.splice(idx, 1);
        }
        var olControl = this.getLibMapControl(controlId);
        if (!olControl) {
            this.logger.info("Impossible to remove control [" + controlId + "] : not found or unhandled");
            continue;
        }
        // graticule n'est pas un controle : on le retire différemment
        if (controlId.toLowerCase() === "graticule") {
            olControl.setMap(null);
            delete this.getLibMap().graticule;
            continue;
        }
        if (Array.isArray(olControl)) {
            // ce sont des interactions => on ne fait rien.
            return;
        }
        this.logger.trace("[OL] : removeControls : removing [" + controlId + "] from Map.");
        this.libMap.removeControl(olControl);
    }
};

/**
 * Returns implementation of the control
 *
 * @param {String} controlId - identifier of the control
 * @returns {Object} - implementation object of the control if it is on the map. null otherwise.
 */
OL.prototype.getLibMapControl = function (controlId) {
    var foundOlControl = null;
    // verifications de base : controlId est bien gere.
    if (!OL.CONTROLSCLASSES.hasOwnProperty(controlId.toLowerCase()) ||
        !OL.CONTROLSCLASSES[controlId.toLowerCase()]) {
        this.logger.trace("[OL] getLibMapControl : control " + controlId + " non implémenté.");
        return foundOlControl;
    }
    var olControlClass = OL.CONTROLSCLASSES[controlId.toLowerCase()];
    // olControlClass == Array => interactions
    if (Array.isArray(olControlClass)) {
        this.logger.trace("[OL] getLibMapControl : searching interactions.");
        var olInteractions = [];
        this.getLibMap().getInteractions().forEach(function (interaction) {
            for (var j = 0; j < olControlClass.length; j++) {
                if (interaction instanceof olControlClass[j]) {
                    this.logger.trace("[OL] getLibMapControl : found interaction : " + olControlClass[j].name);
                    olInteractions.push(interaction);
                    break;
                }
            }
        },
        this);
        return olInteractions.length > 0 ? olInteractions : null;
    }
    // cas du graticule
    if (controlId.toLowerCase() === "graticule") {
        return this.getLibMap().hasOwnProperty("graticule") ? this.getLibMap().graticule : null;
    }
    // ici c'est un controle simple.
    this.logger.trace("[OL] getLibMapControl : controlClass : " + olControlClass.name);
    // on regarde du cote des controles
    var olControls = this.getLibMap().getControls().getArray();
    if (olControls.length === 0) {
        this.logger.trace("[OL] getLibMapControl : no control found on map");
        return foundOlControl;
    }
    for (var i = 0; i < olControls.length; i++) {
        var olControl = olControls[i];
        this.logger.trace("[OL] getLibMapControl : analyzing : " + typeof olControl);
        if (olControl instanceof olControlClass) {
            foundOlControl = olControl;
            this.logger.trace("[OL] getLibMapControl : found ! ");
            break;
        }
    }
    return foundOlControl;
};

/**
 * Adds the markers to the map
 * FIXME : make it public ?
 *
 * @param {Array.<Gp.MarkerOptions>} markersOptions - Markers to add to the Map.
 * @private
 */
OL.prototype._addMarkers = function (markersOptions) {
    this.logger.trace("[OL] : _addMarkers");
    if (!Array.isArray(markersOptions)) {
        this.logger.info("Can not process markersOptions. It is not an Array.");
        return;
    }
    var mo = null;
    var context = this;
    var ii = 0;
    // marker open popup function
    // this == img element associated to the marker
    var fopenPopup = function (evt) {
        var evtPx = context.getLibMap().getEventPixel(evt);
        context.logger.trace("[OL] : _addMarkers : display content : " + mo.content);
        Ol.gp.GfiUtils.displayInfo(
            context.getLibMap(),
            context.getLibMap().getCoordinateFromPixel([
                evtPx[0] + this.mo.ppoffset[0],
                evtPx[1] + this.mo.ppoffset[1]
            ]),
            this.mo.content,
            this.mo.contentType,
            this.mo.autoPanOptions
        );
    };
    for (ii = 0; ii < markersOptions.length; ii++) {
        mo = markersOptions[ii];
        // complete missing properties with default
        if (!mo.hasOwnProperty("content")) {
            mo.content = ""; // empty string to avoid errors on display
        }
        if (!mo.hasOwnProperty("url")) {
            mo.url = Ol.control.DefaultMarkers["lightOrange"];
        }
        // image offset
        if (!mo.hasOwnProperty("offset")) {
            mo.offset = Ol.control.DefaultMarkers["defaultOffset"];
        }
        this.logger.trace("[OL] : _addMarkers : offset [" + mo.offset[0] + ", " + mo.offset[1] + "]");
        // popup offset (from mouse click)
        if (!mo.hasOwnProperty("ppoffset")) {
            // default popup has a 15px of y offset (see .gp-feature-info-div::before css class)
            mo.ppoffset = [0, -15];
        }
        var needsLocated = false;
        if (!mo.hasOwnProperty("position")) {
            // no position given : use map center
            mo.position = {
                x : this.libMap.getView().getCenter()[0],
                y : this.libMap.getView().getCenter()[1]
            };
            // when "located" or "geolocated", the center is not yet the final one (returned by located or geolocated event).
            needsLocated = true;
        }
        if (!mo.hasOwnProperty("contentType")) {
            mo.contentType = "text/html";
        }
        // autoPan Options
        if (!mo.hasOwnProperty("autoPanOptions")) {
            // by default : autoPan true
            mo.autoPanOptions = {
                autoPan : IMap.DEFAULT_AUTOPAN_OPTIONS.autoPan,
                // properties of autoPanAnimation : https://openlayers.org/en/latest/apidoc/olx.html#.OverlayPanOptions
                autoPanAnimation : {
                    duration : IMap.DEFAULT_AUTOPAN_OPTIONS.duration
                },
                autoPanMargin : IMap.DEFAULT_AUTOPAN_OPTIONS.margin
            };
        }
        // create overlay
        var fcoords = [mo.position.x, mo.position.y];
        if (mo.position.hasOwnProperty("projection")) {
            fcoords = Ol.proj.transform(fcoords, mo.position.projection, this.getProjection());
        }
        this.logger.trace("[OL] : _addMarkers : coords [" + fcoords[0] + ", " + fcoords[1] + "]");
        var mrkImg = document.createElement("img");
        mrkImg.src = mo.url;
        // mrkImg.setAttribute("content", mo.content);
        mrkImg.mo = mo;
        var mrk = new Ol.Overlay({
            position : fcoords,
            offset : mo.offset,
            element : mrkImg
        });
        this.libMap.addOverlay(mrk);
        // listen to geolocated and located events (if marker has to be positionned to the center of the map
        if (needsLocated === true) {
            var gpMap = this;
            /**
             * Change markerPositon - this == mrk overlay object
             *
             * @param {Object} locEvt - Gp.Located or Gp.GeolocatedEvent
             */
            var changeCenter = function (locEvt) {
                var fcoords = [
                    locEvt.position.x,
                    locEvt.position.y
                ];
                if (locEvt.position.hasOwnProperty("projection")) {
                    fcoords = Ol.proj.transform(fcoords, locEvt.position.projection, gpMap.getProjection());
                }
                this.setPosition(fcoords);
            };
            this.listen("located", changeCenter, mrk);
            this.listen("geolocated", changeCenter, mrk);
        }
        // listen to markerEvents
        mrkImg.addEventListener("click", fopenPopup, true);
        // TODO : test if useless or not
        mrkImg.addEventListener("touchend", fopenPopup, true);
        // TODO :
        //  - add option for making popup opened or not at startup
    }
};

/**
 * get layer params from OL layer params
 * opacity, visibility, minZoom, maxZoom
 *
 * @param {Object} olLayerOpts - options of the layer
 * @returns {Gp.LayerOptions} - object with common options
 *
 * @private
 */
OL.prototype._getCommonLayerParams = function (olLayerOpts) {
    var commonOpts = {};
    this.logger.trace("[OL] : _getCommonLayerParams ");
    if (olLayerOpts.hasOwnProperty("opacity")) {
        this.logger.trace("[OL] : _getCommonLayerParams - opacity : " + olLayerOpts.opacity);
        commonOpts.opacity = olLayerOpts.opacity;
    }
    if (olLayerOpts.hasOwnProperty("visible")) {
        this.logger.trace("[OL] : _getCommonLayerParams - visibility : " + olLayerOpts.visible);
        commonOpts.visibility = olLayerOpts.visible;
    }
    if (olLayerOpts.hasOwnProperty("zIndex")) {
        this.logger.trace("[OL] : _getCommonLayerParams - position : " + olLayerOpts.zIndex);
        commonOpts.position = olLayerOpts.zIndex;
    }
    if (olLayerOpts.hasOwnProperty("maxResolution")) {
        var minZoom = this._getZoomFromResolution(olLayerOpts.maxResolution);
        this.logger.trace("[OL] : _getCommonLayerParams - minZoom : " + minZoom);
        commonOpts.minZoom = minZoom;
    }
    if (olLayerOpts.hasOwnProperty("minResolution")) {
        var maxZoom = this._getZoomFromResolution(olLayerOpts.minResolution);
        this.logger.trace("[OL] : _getCommonLayerParams - maxZoom : " + maxZoom);
        commonOpts.maxZoom = maxZoom;
    }

    return commonOpts;
};

/**
 * Apply params common to all kind of layers :
 * opacity, visibility, minZoom, maxZoom
 *
 * @param {Gp.LayerOptions} layerOpts - options of the layer
 * @returns {Object} a ol.layer.Layer constructor options object
 *
 * @private
 */
OL.prototype._applyCommonLayerParams = function (layerOpts) {
    var commonOpts = {};
    this.logger.trace("[OL] : _applyCommonLayerParams ");
    if (layerOpts.hasOwnProperty("opacity")) {
        this.logger.trace("[OL] : _applyCommonLayerParams - opacity : " + layerOpts.opacity);
        commonOpts.opacity = layerOpts.opacity;
    }
    if (layerOpts.hasOwnProperty("visibility")) {
        this.logger.trace("[OL] : _applyCommonLayerParams - visibility : " + layerOpts.visibility);
        commonOpts.visible = layerOpts.visibility;
    }
    if (layerOpts.hasOwnProperty("position")) {
        this.logger.trace("[OL] : _applyCommonLayerParams - position : " + layerOpts.position);
        commonOpts.zIndex = layerOpts.position;
    }
    if (layerOpts.hasOwnProperty("maxZoom") &&
        layerOpts.maxZoom >= 0 &&
        layerOpts.maxZoom <= 20) {
        var minRes = this._getResolutionFromZoomLevel(layerOpts.maxZoom);
        this.logger.trace("[OL] : _applyCommonLayerParams - minRes : " + minRes);
        commonOpts.minResolution = minRes;
    }
    if (layerOpts.hasOwnProperty("minZoom") &&
        layerOpts.minZoom >= 0 &&
        layerOpts.minZoom <= 20) {
        var maxRes = this._getResolutionFromZoomLevel(layerOpts.minZoom);
        this.logger.trace("[OL] : _applyCommonLayerParams - maxRes : " + maxRes);
        commonOpts.maxResolution = maxRes;
    }
    if (layerOpts.hasOwnProperty("grayScaled")) {
        this.logger.trace("[OL] : _applyCommonLayerParams - grayScaled : " + layerOpts.grayScaled);
        commonOpts.grayScaled = layerOpts.grayScaled;
    }

    return commonOpts;
};

/**
 * Check params for layerDisplay
 *
 * @param {Gp.LayerOptions} layerOpts - options of the layer
 * @returns {Boolean} true if parameters are OK, false otherwise
 *
 * @private
 */
OL.prototype._checkLayerParams = function (layerOpts) {
    // verifications de base de la classe mère
    if (!IMap.prototype._checkLayerParams.apply(this, arguments)) {
        return false;
    }
    // verifications specifiques pour affichage dans OL
    // TODO
    return true;
};

/**
 * Add a Raster Layer to the map
 *
 * @param {Object} layerObj - geoportalLayer to add.
 * @param {Gp.LayerOptions} layerObj.geoportalLayerID - options of the layer
 *
 * @private
 */
OL.prototype._addRasterLayer = function (layerObj) {
    var layerId = Object.keys(layerObj)[0];
    var layerOpts = layerObj[layerId];
    // au cas où la couche ajoutée est un MNT, on essaye pas de l'ajouter en 2D
    if (layerOpts.isElevation !== true) {
        var constructorOpts = this._applyCommonLayerParams(layerOpts);
        switch (layerOpts.format.toUpperCase()) {
            case "WMS":
            {
                this.logger.trace("ajout d'une couche WMS");
                var params = {};
                params.LAYERS = layerOpts.layers.join(", ");

                if (layerOpts.version) {
                    params.VERSION = layerOpts.version;
                }
                // au cas ou maintien de l'ancien nom de paramètre :
                // layerOpts.styleName (sans "s")
                layerOpts.stylesNames = layerOpts.stylesNames || layerOpts.stylesName;
                if (layerOpts.stylesNames) {
                    if (Array.isArray(layerOpts.stylesNames)) {
                        params.STYLES = layerOpts.stylesNames.join();
                    } else {
                        this.logger.info("'stylesNames' parameter should be an array of style names (string)");
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
                let sourceOpts = {
                    url : layerOpts.url,
                    params : params
                };
                if (layerOpts.hasOwnProperty("projection")) {
                    sourceOpts.projection = layerOpts.projection;
                }
                if (layerOpts.hasOwnProperty("tiled") && layerOpts.tiled === true) {
                    constructorOpts.source = new Ol.source.TileWMS(sourceOpts);
                } else {
                    constructorOpts.source = new Ol.source.ImageWMS(sourceOpts);
                }
                break;
            }
            case "WMTS":
            {
                this.logger.trace("ajout d'une couche WMTS");
                // chargement des options par defaut
                var lOpts = this._getWMTSDefaultOpts();
                // surcharge avec les options utilisateurs
                for (var opt in layerOpts) {
                    lOpts[opt] = layerOpts[opt];
                }
                layerOpts = lOpts;
                let sourceOpts = {
                    url : layerOpts.url,
                    layer : layerOpts.layer,
                    matrixSet : layerOpts.tileMatrixSet,
                    format : layerOpts.outputFormat,
                    version : layerOpts.version,
                    style : layerOpts.styleName,
                    tileGrid : new Ol.tilegrid.WMTS({
                        origin : [
                            layerOpts.topLeftCorner.x,
                            layerOpts.topLeftCorner.y
                        ],
                        resolutions : layerOpts.resolutions,
                        matrixIds : layerOpts.matrixIds
                    })
                };
                // RESTFul or KVP encoding ?
                if (layerOpts.url.indexOf("{TileMatrixSet}") > 0 ||
                    layerOpts.url.indexOf("{TileRow}") > 0 ||
                    layerOpts.url.indexOf("{TileCol}") > 0) {
                    // its an url template => RESTFul
                    sourceOpts.requestEncoding = "REST";
                } else {
                    sourceOpts.requestEncoding = "KVP";
                }
                constructorOpts.source = new Ol.source.WMTSExtended(sourceOpts);
                break;
            }
            case "OSM":
                this.logger.trace("ajout d'une couche OSM");
                constructorOpts.source = new Ol.source.OSM({
                    url : layerOpts.url
                });
                break;
            default:
        }
        if (constructorOpts.hasOwnProperty("source")) {
            // le controle geoportalAttribution exploite la propriete _originators
            if (layerOpts.hasOwnProperty("originators")) {
                constructorOpts.source._originators = layerOpts.originators;
            }
            var layer = null;
            if (layerOpts.format.toUpperCase() === "WMS" &&
                 (!layerOpts.hasOwnProperty("tiled") || layerOpts.tiled !== true)
            ) {
                layer = new Ol.layer.Image(constructorOpts);
            } else {
                layer = new Ol.layer.Tile(constructorOpts);
            }
            // pour forcer la prise en compte par le LayerSwitcher du zIndex quand il vaut zéro (extension OL) (cf. issue #12)
            if (constructorOpts.hasOwnProperty("zIndex") && constructorOpts.zIndex === 0) {
                layer._forceNullzIndex = true;
            }
            var gpLayer = {
                id : layerId,
                obj : layer,
                options : layerOpts
            };

            if (layerOpts.hasOwnProperty("grayScaled") && layerOpts.grayScaled) {
                this._colorGrayscaleLayerSwitch(gpLayer, true);
            }

            this._layers.push(gpLayer);
            this.libMap.addLayer(gpLayer.obj);
            this._addLayerConfToLayerSwitcher(gpLayer.obj, layerOpts);
        }
    } else {
        // dans ce cas, on est sur une couche d'élévation
        // on la sauvegarde dans le tableau 3Dlayers pour l'ajouter si on passe en contexte 3D
        var elevationLayer = {
            id : layerId,
            obj : "3D-only-layer",
            options : layerOpts
        };
        if (!this._3Dlayers) {
            this._3Dlayers = [];
        }
        this._3Dlayers.push(elevationLayer);
    }
};

/**
 * Add a vector Layer to the map
 *
 * @param {Object} layerObj - geoportalLayer to add.
 * @param {Gp.LayerOptions} layerObj.geoportalLayerID - options of the layer
 *
 * @private
 */
OL.prototype._addVectorLayer = function (layerObj) {
    // FIXME : ajout d'un parametre projection pour les donnees
    var layerId = Object.keys(layerObj)[0];
    var layerOpts = layerObj[layerId];
    var constructorOpts = this._applyCommonLayerParams(layerOpts);

    var layerStyleOptions = layerOpts.styleOptions || {};
    var defaultMapOptions = this.mapOptions.defaultFeaturesStyle || {};
    var defaultOptions = IMap.DEFAULT_VECTORLAYERS_STYLES;
    var styleOptions = {};
    styleOptions.image = new Ol.style.Icon({
        src : layerStyleOptions.markerSrc || defaultMapOptions.markerSrc || defaultOptions.markerSrc,
        anchor : [
            layerStyleOptions.markerXAnchor || defaultMapOptions.markerXAnchor || defaultOptions.markerXAnchor,
            layerStyleOptions.markerYAnchor || defaultMapOptions.markerYAnchor || defaultOptions.markerYAnchor
        ],
        anchorOrigin : "top-left",
        anchorXUnits : "pixels",
        anchorYUnits : "pixels"
    });
    styleOptions.stroke = new Ol.style.Stroke({
        color : IMap._hexToRgba(layerStyleOptions.strokeColor || defaultMapOptions.strokeColor || defaultOptions.strokeColor, layerStyleOptions.strokeOpacity || defaultMapOptions.strokeOpacity || defaultOptions.strokeOpacity),
        width : layerStyleOptions.strokeWidth || defaultMapOptions.strokeWidth || defaultOptions.strokeWidth
    });
    styleOptions.fill = new Ol.style.Fill({
        color : IMap._hexToRgba(layerStyleOptions.polyFillColor || defaultMapOptions.polyFillColor || defaultOptions.polyFillColor, layerStyleOptions.polyFillOpacity || defaultMapOptions.polyFillOpacity || defaultOptions.polyFillOpacity)
    });
    styleOptions.text = new Ol.style.Text({
        font : "16px Sans",
        textAlign : "left",
        fill : new Ol.style.Fill({
            color : IMap._hexToRgba(layerStyleOptions.textColor || defaultMapOptions.textColor || defaultOptions.textColor, 1)
        })
    });
    if (layerStyleOptions.textStrokeColor) {
        styleOptions.text.stroke = new Ol.style.Stroke({
            color : IMap._hexToRgba(layerStyleOptions.textStrokeColor || defaultMapOptions.textStrokeColor || defaultOptions.textStrokeColor, 1),
            width : 1
        });
    }
    var vectorStyle = new Ol.style.Style(styleOptions);

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
            // });

            var urlKml = this.setProxy(layerOpts.url);
            var formatKml = new Ol.format.KMLExtended({
                extractStyles : layerOpts.extractStyles,
                showPointNames : layerOpts.showPointNames,
                defaultStyle : [vectorStyle]
            });
            constructorOpts.source = new Ol.source.Vector({
                features : new Ol.Collection(),
                // features loader
                loader : function (extent, resolution, projectionFeature) {
                    Protocols.XHR.call({
                        url : urlKml,
                        method : "GET",
                        timeOut : 15000,
                        // callback on success
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
                        // callback on failure
                        onFailure : function (error) {
                            this.logger.info("[Ol.control.LayerImport] Kml/Gpx request failed : ", error);
                        }
                    });
                }
            });
            break;
        case "GPX":
            this.logger.trace("ajout d'une couche GPX");
            constructorOpts.source = new Ol.source.Vector({
                url : this.setProxy(layerOpts.url),
                format : new Ol.format.GPX()
            });
            constructorOpts.style = vectorStyle;
            break;
        case "GEORSS":
            // TODO GeoRSS
            break;
        case "GEOJSON":
            this.logger.trace("ajout d'une couche GeoJSON");
            constructorOpts.source = new Ol.source.Vector({
                url : this.setProxy(layerOpts.url),
                format : new Ol.format.GeoJSON()
            });
            constructorOpts.style = vectorStyle;
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
            var oflc = layerOpts.outputFormat.toLowerCase();
            var format = null;
            var formatOptions = {};
            // FIXME : useless projection param ?
            if (layerOpts.projection) {
                // param for GeoJSON format
                formatOptions["defaultDataProjection"] = layerOpts.projection;
                // param for GMLx format
                formatOptions["srsName"] = layerOpts.projection;
            }
            if (oflc.indexOf("gml") > 0 ||
                oflc.indexOf("xml") > 0
            ) {
                // GML => look for version indication
                if (oflc.indexOf("2.1") > 0 ||
                    oflc.indexOf("gml2") > 0
                ) {
                    format = new Ol.format.GML2(formatOptions);
                } else {
                    // GML => defaults to GML3
                    format = new Ol.format.GML3(formatOptions);
                }
            } else {
                // Defaults format to GeoJSON
                format = new Ol.format.GeoJSON(formatOptions);
            }
            constructorOpts.source = new Ol.source.Vector({
                format : format,
                // envoi de la requête WFS
                url : function (extent, resolution, projection) {
                    return layerUrl + "?service=WFS&request=GetFeature" +
                    "&version=" + layerOpts.version + "&typename=" + layerOpts.typeNames +
                    "&outputFormat=" + layerOpts.outputFormat + "&srsname=" + projection.getCode() +
                    "&bbox=" + extent.join(", ") + ", " + projection.getCode() + maxFeatures + sld;
                },
                strategy : Ol.loadingstrategy.bbox
            });

            break;
        case "drawing":
            // à tester avec les outils de dessins
            this.logger.trace("ajout d'une couche de dessin");

            constructorOpts.source = new Ol.source.Vector({});
            break;
        default:
            break;
    }

    if (constructorOpts.hasOwnProperty("source")) {
        // le controle geoportalAttribution exploite la propriete _originators
        if (layerOpts.hasOwnProperty("originators")) {
            constructorOpts.source._originators = layerOpts.originators;
        }

        var layer = new Ol.layer.Vector(constructorOpts);
        this._layers.push({
            id : layerId,
            obj : layer,
            options : layerOpts
        });

        this.libMap.addLayer(layer);
        this._addLayerConfToLayerSwitcher(layer, layerOpts);

        var _map = this.libMap;
        var _vectorSource = constructorOpts.source;
        // "getExtent" pour les vecteurs
        if (_map.getView() && _map.getSize() && _vectorSource.getExtent) {
            var _fit = layerOpts.zoomToExtent || false;
            if (_fit) {
                var key = _vectorSource.on("change", function () {
                    var _sourceExtent = _vectorSource.getExtent();
                    var _stateExtent = _vectorSource.getState();
                    if (_stateExtent === "ready" && _sourceExtent[0] !== Infinity) {
                        Ol.Observable.unByKey(key);
                        _map.getView().fit(_sourceExtent, {
                            // size : _map.getSize(),
                            maxZoom : 18
                        });
                    }
                });

                setTimeout(function () {
                    _vectorSource.dispatchEvent("change");
                }, 100);
            }
        }
    }
};

/**
 * Add a geoportal Layer to the map
 *
 * @param {Object} layerObj - geoportalLayer to add.
 * @param {Gp.LayerOptions} layerObj.geoportalLayerID - options of the layer
 *
 * @private
 */
OL.prototype._addGeoportalLayer = function (layerObj) {
    var layerId = Object.keys(layerObj)[0];
    var layerOpts = layerObj[layerId];
    // parametres additionnels eventuels
    var olParams = {};
    if (layerOpts.hasOwnProperty("opacity")) {
        olParams.opacity = layerOpts.opacity;
    }
    if (layerOpts.hasOwnProperty("visibility")) {
        olParams.visible = layerOpts.visibility;
    }
    if (layerOpts.hasOwnProperty("position")) {
        olParams.zIndex = layerOpts.position;
    }
    if (layerOpts.hasOwnProperty("minZoom") &&
        layerOpts.minZoom >= 0 &&
        layerOpts.minZoom <= 28) {
        olParams.maxResolution = this._getResolutionFromZoomLevel(layerOpts.minZoom);
        this.logger.trace("[OL] : apply MaxResolution : " + olParams.maxResolution);
    }
    if (layerOpts.hasOwnProperty("maxZoom") &&
        layerOpts.maxZoom >= 0 &&
        layerOpts.maxZoom <= 28) {
        olParams.minResolution = this._getResolutionFromZoomLevel(layerOpts.maxZoom);
        this.logger.trace("[OL] : apply minResolution : " + olParams.minResolution);
    }
    var LayerClass = null;
    switch (layerOpts.format.toUpperCase()) {
        case "WMTS" :
            LayerClass = Ol.layer.GeoportalWMTS;
            break;
        case "WMS" :
            LayerClass = Ol.layer.GeoportalWMS;
            break;
        default :
            this.logger.info("addGeoportalLayer : no class found for " + layerOpts.format);
    }
    var olLayer = new LayerClass({
        layer : layerId,
        olParams : olParams
    });
    // le controle geoportalAttribution exploite la propriete _originators
    // si l'utilisateur en a passé des originators en paramètres, on écrase ceux de l'autoconf.
    if (layerOpts.hasOwnProperty("originators")) {
        olLayer.getSource()._originators = layerOpts.originators;
    }
    // pour forcer la prise en compte par le LayerSwitcher du zIndex quand il vaut zéro (extension OL) (cf. issue #12)
    if (olParams.hasOwnProperty("zIndex") && olParams.zIndex === 0) {
        olLayer._forceNullzIndex = true;
    }

    this._layers.push({
        id : layerId,
        obj : olLayer,
        options : layerOpts
    });
    this.libMap.addLayer(olLayer);
    this._addLayerConfToLayerSwitcher(olLayer, layerOpts);
};

/**
 * Remove the layers listed to the map.
 *
 * @param {Array.<String>} layerIds - A list of layer's id or null.
 */
OL.prototype.removeLayers = function (layerIds) {
    if (!IMap.prototype.removeLayers.apply(this, arguments)) {
        return;
    }
    // ici on sait que layerIds est un tableau
    var _layers = this._getLayersObj(layerIds);
    _layers.forEach(function (_layer, i, array) {
        this.libMap.removeLayer(_layer.obj);
    },
    this);
};

/**
 * Modify the layers'options listed to the map
 *
 * @param {Object} layersOptions - Layers to add to the map and their options. Associative array mapping official name of the Geoportal layer or the id of a personal layer (keys) with their properties (values given as {@link Gp.LayerOptions}).
 */
OL.prototype.modifyLayers = function (layersOptions) {
    if (!IMap.prototype.modifyLayers.apply(this, arguments)) {
        return;
    }
    var layerIds = Object.keys(layersOptions);
    // on recupere les objets correspondants dejà sur la carte
    var _layerObjs = this._getLayersObj(layerIds);
    _layerObjs.forEach(function (_layerObj) {
        this.logger.trace("[IMap] modifyLayers : modifying : [" + _layerObj.id + "]");
        // traduction options ahn => options OL
        var commonOpts = this._applyCommonLayerParams(layersOptions[_layerObj.id]);
        // application des options OL aux couches OL
        // l'objet _layerObj.options sera mis à jour par le mécanisme des evenements.
        if (commonOpts.hasOwnProperty("opacity")) {
            this.logger.trace("[IMap] modifyLayers : setting opacity of : [" + _layerObj.id + "] to : " + commonOpts.opacity);
            _layerObj.obj.setOpacity(commonOpts.opacity);
        }
        if (commonOpts.hasOwnProperty("visible")) {
            this.logger.trace("[IMap] modifyLayers : setting visible of : [" + _layerObj.id + "] to : " + commonOpts.visible);
            _layerObj.obj.setVisible(commonOpts.visible);
        }
        if (commonOpts.hasOwnProperty("zIndex")) {
            this.logger.trace("[IMap] modifyLayers : setting zIndex of : [" + _layerObj.id + "] to : " + commonOpts.zIndex);
            _layerObj.obj.setZIndex(commonOpts.zIndex);
            // pour forcer la prise en compte par le LayerSwitcher du zIndex quand il vaut zéro (extension OL) (cf. issue #12)
            if (commonOpts.zIndex === 0) {
                _layerObj.obj._forceNullzIndex = true;
            }
            // ou inversement pour ne plus forcer le zIndex à zéro lorsque ce n'est pas le cas
            if (commonOpts.zIndex !== 0 && _layerObj.obj._forceNullzIndex) {
                _layerObj.obj._forceNullzIndex = false;
            }
        }
        if (commonOpts.hasOwnProperty("minResolution")) {
            this.logger.trace("[IMap] modifyLayers : setting minResolution of : [" + _layerObj.id + "] to : " + commonOpts.minResolution);
            _layerObj.obj.setMinResolution(commonOpts.minResolution);
        }
        if (commonOpts.hasOwnProperty("maxResolution")) {
            this.logger.trace("[IMap] modifyLayers : setting maxResolution of : [" + _layerObj.id + "] to : " + commonOpts.maxResolution);
            _layerObj.obj.setMaxResolution(commonOpts.maxResolution);
        }
        if (commonOpts.hasOwnProperty("grayScaled")) {
            this.logger.trace("[IMap] modifyLayers : setting grayScaled of : [" + _layerObj.id + "] to : " + commonOpts.grayScaled);
            this._changeLayerColor(_layerObj.id, commonOpts.grayScaled);
        }
    },
    this);
};

/**
 * retourne le code de la projection courante de la carte
 * @return {String} projection code
 */
OL.prototype.getProjection = function () {
    return this.libMap.getView().getProjection().getCode();
};

/**
 * retourne les coordonnées courantes du centre de la carte
 * @return {Object} center
 */
OL.prototype.getCenter = function () {
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
OL.prototype.getViewExtent = function (projection) {
    var bbox = {};
    if (this.libMap && this.libMap.getView()) {
        var extent = this.libMap.getView().calculateExtent(this.libMap.getSize());
        var mapProj = this.libMap.getView().getProjection().getCode();
        if (projection &&
             projection !== mapProj) {
            extent = Ol.proj.transformExtent(extent, mapProj, projection);
        }
        // extent OL :
        // [-136845.07118250668, 5803180.6192946555, -124691.58368516366, 5810852.986008779]
        bbox.left = extent[0];
        bbox.right = extent[2];
        bbox.bottom = extent[1];
        bbox.top = extent[3];
    }
    return bbox;
};

/**
 * retourne l'azimut courant de la carte
 * @return {Number} azimuth
 */
OL.prototype.getAzimuth = function () {
    return this.libMap.getView().getRotation() * 180 / Math.PI;
};

/**
 * retourne le zoom courant de la carte
 * @return {Integer} zoom
 */
OL.prototype.getZoom = function () {
    return this._getZoomFromResolution(this.getResolution());
};

/**
 * retourne le zoom courant de la carte
 * @return {Number} resolution
 */
OL.prototype.getResolution = function () {
    return this.libMap.getView().getResolution();
};

/**
 * retourne la carte ol.Map
 * @return {Object} openlayers map
 */
OL.prototype.getLibMap = function () {
    return this.libMap;
};

/**
 * définit la projection de la carte
 * Si certaines couches ne sont pas compatibles avec la nouvelle projection, elles ne seront pas affichées.
 * // TODO : vérifier que ça fonctionne : un view.setProjection semblerait plus adapte ?
 * @param {String} projection - projection
 */
OL.prototype.setProjection = function (projection) {
    var view = new Ol.View({
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
OL.prototype.setXYCenter = function (point) {
    this.logger.trace("[OL] - setXYCenter");
    if (!point.hasOwnProperty("x") || !point.hasOwnProperty("y")) {
        this.logger.info("no valid coordinates for map center");
        return;
    }

    var center = [point.x, point.y];
    var mapProj = this.libMap.getView().getProjection().getCode();
    if (point.projection &&
         point.projection !== mapProj) {
        center = Ol.proj.transform(center, point.projection, mapProj);
    }
    this.libMap.getView().setCenter(center);
    this.logger.trace("[OL] - setXYCenter(" + point.x + ", " + point.y + "), projection Map : " + mapProj);

    // FIXME : markerFeature
    // if (this.markerFeature)
    //    this.markerFeature.setGeometry(new ol.geom.Point(geocodeCenter));
};

/**
 * center Map on a given point in case of auto centering
 *
 * @param {Object} point - center point
 * @param {Float} point.x - x coordinates for center
 * @param {Float} point.y - y coordinates for center
 * @param {Number} zoom - zoom level (optional, used for geolocate)
 *
 */
OL.prototype.setAutoCenter = function (point, zoom) {
    this.logger.trace("[IT] - setAutoCenter");
    this.setXYCenter(point, zoom);
};

/**
 * définit l'azimut de la carte.
 * @param {Number} azimuth - azimuth
 */
OL.prototype.setAzimuth = function (azimuth) {
    this.libMap.getView().setRotation(azimuth * Math.PI / 180);
};

/**
 * définit le niveau de zoom de la carte
 * @param {Integer} zoom - zoom
 */
OL.prototype.setZoom = function (zoom) {
    this.libMap.getView().setZoom(zoom);
};

/**
 * Définit la résolution de la carte
 * @param {Number} resolution - resolution
 */
OL.prototype.setResolution = function (resolution) {
    this.libMap.getView().setResolution(resolution);
};

/**
 * Incrémente le niveau de zoom de la carte de 1.
 */
OL.prototype.zoomIn = function () {
    this.libMap.getView().setZoom(this.getZoom() + 1);
};

/**
 * Décrémente le niveau de zoom de la carte de 1.
 */
OL.prototype.zoomOut = function () {
    this.libMap.getView().setZoom(this.getZoom() - 1);
};

/**
 * Trouve l'objet layerOpts correspondant au layer OL
 *
 * @param {Object} layerObj - ol layer
 * @param {Object} layersStack - tableau des couches où chercher
 *
 * @return {Object} layer options
 */
OL.prototype._getLayerOpts = function (layerObj, layersStack) {
    var layerOpts = null;
    layersStack = layersStack || this._layers;
    for (var i = 0; i < layersStack.length; i++) {
        var l = layersStack[i];
        if (l.obj === layerObj) {
            layerOpts = {};
            layerOpts[l.id] = l.options;
            break;
        }
    }
    return layerOpts;
};

/**
 * Registers unknown unregistered layer
 *
 * @param {Object} layerObj - ol layer
 * @returns {Object} - new layer index in this._layers
 */
OL.prototype._registerUnknownLayer = function (layerObj) {
    // couches de résultat (itineraire, isochrone)
    var layerId = "unknownLayer";
    if (layerObj.hasOwnProperty("gpResultLayerId")) {
        // isochrones : [GraphName]$GEOPORTAIL:GPP:Isocurve
        // itineraire : [GraphName]$GEOPORTAIL:GPP:Itineraire
        layerId = layerObj.gpResultLayerId;
    }
    // on rajoute un timestamp
    layerId += "-" + Date.now();
    // on rajoute des infos quand on en a
    var options = {};
    if (layerId.indexOf("drawing-") === 0) {
        options.format = "drawing";
    } else if (layerId.indexOf("layerimport:KML") === 0) {
        options.format = "KML";
    } else if (layerId.indexOf("layerimport:GPX") === 0) {
        options.format = "GPX";
    } else if (layerId.indexOf("layerimport:GeoJSON") === 0) {
        options.format = "GeoJSON";
    } else if (layerId.indexOf("layerimport:WMS") === 0) {
        options.format = "WMS";
        if (layerObj.gpGFIparams) {
            if (layerObj.gpGFIparams.queryable) {
                options.queryable = true;
            }
            if (Array.isArray(layerObj.gpGFIparams.formats)) {
                // par défaut on prend le premier
                options.gfiFormat = layerObj.gpGFIparams.formats[0];
                // si on trouve "text/html" dans les formats disponibles, on prend "text/html" par défaut
                for (var i = 0; i < layerObj.gpGFIparams.formats.length; i++) {
                    if (layerObj.gpGFIparams.formats[i] === "text/html") {
                        options.gfiFormat = "text/html";
                        break;
                    }
                }
            }
        }
    } else if (layerId.indexOf("layerimport:WMTS") === 0) {
        options.format = "WMTS";
    }
    this._layers.push({
        id : layerId,
        obj : layerObj,
        options : options
    });
    var layerOpts = {};
    layerOpts[layerId] = {};

    return layerOpts;
};

/**
 * Gets Layer Container div ID for a given layerId.
 *
 * @param {String} layerId - layer identifier
 * @returns {String} - Layer Container div Id in the LayerSwitcher
 */
OL.prototype.getLSLayerContainerDivId = function (layerId) {
    var id = null;
    var idxLS = this._findRegisteredControl("layerswitcher");
    if (idxLS < 0) {
        this.logger.trace("[OL] : getLSLayerContainerDivId : no layerswitcher on map !");
        return id;
    }
    var olLayers = this._getLayersObj([layerId]);
    if (olLayers.length > 0) {
        var olLs = this._controls[idxLS].obj;
        return olLs.getLayerDOMId(olLayers[0].obj);
    }
    this.logger.trace("[OL] : getLSLayerContainerDivId : layer [" + layerId + "] not found on map !");
    return id;
};

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
OL.prototype.listen = function (eventId, action, context) {
    this.logger.trace("[OL] : listen...");
    // verifications de base de la classe mère
    if (!IMap.prototype.listen.apply(this, arguments)) {
        return;
    }
    context = context || this;
    var map = this;
    var olEventKey = null;
    switch (eventId) {
        case "mapLoaded" :
            break;
        case "mapFailure" :
            break;
        case "located" :
            // handled in IMap
            break;
        case "geolocated" :
            // handled in IMap
            break;
        case "configured" :
            // handled in IMap
            break;
        case "centerChanged" :
            olEventKey = this.libMap.getView().on("change:center", function (olEvt) {
                var centerChangedEvt = {};
                if (olEvt.oldValue) {
                    centerChangedEvt.oldCenter = {
                        x : olEvt.oldValue[0],
                        y : olEvt.oldValue[1]
                    };
                }
                centerChangedEvt.newCenter = {
                    x : this.libMap.getView().getCenter()[0],
                    y : this.libMap.getView().getCenter()[1]
                };
                action.call(context, centerChangedEvt);
            },
            this);
            break;
        case "zoomChanged" :
            olEventKey = this.libMap.getView().on("change:resolution", function (olEvt) {
                action.call(context, {
                    // NB : quand on n'a precise aucun tableau de resolutions à
                    //      la creation de la vue, OL utilise les résolutions
                    //      Géographiques.
                    oldZoom : this._getZoomFromResolution(olEvt.oldValue/* , "EPSG:4326" */),
                    newZoom : this._getZoomFromResolution(this.libMap.getView().getResolution()/* , "EPSG:4326" */)
                });
            },
            this);
            break;
        case "azimuthChanged" :
            olEventKey = this.libMap.getView().on("change:rotation", function (olEvt) {
                action.call(context, {
                    oldAzimuth : olEvt.oldValue * 180 / Math.PI,
                    newAzimuth : this.libMap.getView().getRotation() * 180 / Math.PI
                });
            },
            this);
            break;
        case "tiltChanged" :
            // non pertinent en 2D
            break;
        case "projectionChanged" :
            // TODO : interet ?
            break;
        case "layerChanged" :
            // abonnement à un ajout de couche
            olEventKey = this.libMap.getLayers().on("add", function (olEvt) {
                var ladded = olEvt.element;
                var layerOpts = this._getLayerOpts(ladded);
                if (!layerOpts) {
                    map.logger.trace("[OL] listen : enregistrement d'une couche 'inconnue'.");
                    layerOpts = this._registerUnknownLayer(ladded);
                }
                action.call(context, {
                    layerAdded : layerOpts,
                    position : ladded.getZIndex()
                });
            },
            this);
            this._registerEvent(olEventKey, eventId, action, context);
            // abonnement à un retrait de couche
            olEventKey = this.libMap.getLayers().on("remove", function (olEvt) {
                var lremoved = olEvt.element;
                // on cherche la couche a éventuellement déjà été
                // enlevée de this._layers
                var layerOpts = this._getLayerOpts(lremoved) ||
                                this._getLayerOpts(lremoved, this._layersRemoved);

                var self = context.getLibMap();
                if (self.featuresOverlay && layerOpts[self.featuresOverlay.getId()]) {
                    self.removeOverlay(self.featuresOverlay);
                    self.featuresOverlay = null;
                }
                action.call(context, {
                    layerRemoved : layerOpts
                });
            },
            this);
            this._registerEvent(olEventKey, eventId, action, context);
            olEventKey = null;
            // abonnement à un changement de propriete sur chaque couche
            for (var obsProperty in OL.LAYERPROPERTIES) {
                map.logger.trace("[OL] listen : abonnement layerProperty : " + obsProperty);
                this.libMap.getLayers().forEach(function (olLayer, i, array) {
                    var layerOpts = this._getLayerOpts(olLayer);
                    if (obsProperty === "grayScaled") {
                        // layerChangeGrayScaled callback
                        var layerChangeGrayScaledCallBack = function (evt) {
                            action.call(context, {
                                property : "grayScaled",
                                oldValue : evt.detail.oldValue,
                                newValue : evt.detail.newValue,
                                layerChanged : layerOpts
                            });
                        };

                        var registredEvent = map._registerEvent(layerChangeGrayScaledCallBack, eventId, action, context);
                        registredEvent.eventOrigin = olLayer;
                        registredEvent.eventType = "change:" + obsProperty;
                        registredEvent.eventOrigin.addEventListener(registredEvent.eventType, layerChangeGrayScaledCallBack, this);
                    } else {
                        olEventKey = olLayer.on(
                            "change:" + obsProperty,
                            function (olEvt) {
                                // la fonction _getCommonLayerParams permet de faire la conversion
                                // propriete ol => propriete commune
                                var oldOlObj = {};
                                oldOlObj[olEvt.key] = olEvt.oldValue;
                                var oldCommonProp = map._getCommonLayerParams(oldOlObj);
                                var newOlObj = {};
                                newOlObj[olEvt.key] = this.get(olEvt.key);
                                var newCommonProp = map._getCommonLayerParams(newOlObj);
                                action.call(context, {
                                    property : OL.LAYERPROPERTIES[olEvt.key],
                                    oldValue : oldCommonProp[OL.LAYERPROPERTIES[olEvt.key]],
                                    newValue : newCommonProp[OL.LAYERPROPERTIES[olEvt.key]],
                                    layerChanged : layerOpts
                                });
                            },
                            olLayer
                        );

                        this._registerEvent(olEventKey, eventId, action, context);
                        olEventKey = null;
                    }
                },
                map);
            }
            break;
        case "controlChanged" :
            break;
        default :
            this.logger.info("unhandled event : " + eventId);
    };
    // enregistrement de l'evenement
    if (olEventKey) {
        this._registerEvent(olEventKey, eventId, action, context);
    }
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
OL.prototype.forget = function (eventId, action) {
    this.logger.trace("[OL] : forget...");

    // verifications de base de la classe mère
    if (!IMap.prototype.forget.apply(this, arguments)) {
        return;
    }

    // on cherche l'enregistrement de l'evenement
    var rEvents = this._events[eventId];
    if (!rEvents) {
        this.logger.info("nothing to forget for : " + eventId);
        return;
    }
    var evKey = null;
    for (var i = rEvents.length - 1; i >= 0; i--) {
        if (rEvents[i].action == action) {
            evKey = rEvents[i].key;
            rEvents.splice(i, 1);
            this.logger.trace("[OL] : forgetting : " + eventId + " (" + evKey + ")");
            Ol.Observable.unByKey(evKey);
        }
    }
};

/**
 *
 * @param {String} layerId - layer identifier
 * @param {Boolean} toGrayScale - indicate transformation direction (from or to grayscale)
 *
 * @private
 */
OL.prototype._changeLayerColor = function (layerId, toGrayScale) {
    var layerIndex = this._getLayerIndexByLayerId(layerId);
    var gpLayer = this._layers[layerIndex];

    switch (gpLayer.options.format.toUpperCase()) {
        case "KML":
        case "GPX":
        case "WFS":
        case "drawing":
            this.logger.info("[OL.prototype._changeLayerColor] warning : _changeLayerColor not allowed on vector layers (layer id: " + layerId + ")");
            return;
    }

    this._colorGrayscaleLayerSwitch(gpLayer, toGrayScale);

    var event = IMap.CustomEvent(
        "change:grayScaled",
        {
            detail : {
                oldValue : !toGrayScale,
                newValue : toGrayScale
            }
        }
    );
    gpLayer.obj.dispatchEvent(event);
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
OL.prototype._colorGrayscaleLayerSwitch = function (gpLayer, toGrayScale) {
    // fonction de conversion d'une image en n/b
    function getGrayScaledDataUrl (img) {
        // patch pour safari
        img.crossOrigin = null;

        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        var imageData = ctx.getImageData(0, 0, img.width, img.height);
        var data = imageData.data;

        for (var i = 0; i < data.length; i += 4) {
            var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg; // red
            data[i + 1] = avg; // green
            data[i + 2] = avg; // blue
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL();
    };

    // fonction de conversion et de chargement d'une image en n/b
    function convertImagetoGrayScale (image, context) {
        // conversion en n/b
        var dataUrl = getGrayScaledDataUrl(image);

        // chargement d'une image vide intermediaire pour eviter
        // l'affichage d'images couleurs (pour certains navigateurs
        // le chargement de l'image n/b et plus long et l'image originale
        // apparait de manière transitoire)
        image.src = "";

        // forcer le raffraichissement de l'affichage a l'issu
        // du chargement de l'image n/b
        /** onload */
        image.onload = function () {
            context.changed();
        };
        // chargement image n/b
        image.src = dataUrl;
    }

    // handler for event 'imageloadstart'
    function imageloadstartHandler (evt) {
        evt.image.getImage().crossOrigin = "Anonymous";
    };

    // handler for event 'tileloadstart'
    function tileloadstartHandler (evt) {
        evt.tile.getImage().crossOrigin = "Anonymous";
    };

    // handler for event 'imageloadend'
    function imageloadendHandler (evt) {
        convertImagetoGrayScale(evt.image.getImage(), evt.target);
    };

    // handler for event 'tileloadend'
    function tileloadendHandler (evt) {
        convertImagetoGrayScale(evt.tile.getImage(), evt.target);
    };

    // abonnement/desabonnement aux evenements permettant la conversion en n/b
    var source = gpLayer.obj.getSource();
    if (toGrayScale) {
        if (source instanceof Ol.source.ImageWMS) {
            source.loadstartListenerKey = source.on("imageloadstart", imageloadstartHandler);
            source.loadendListenerKey = source.on("imageloadend", imageloadendHandler);
        } else {
            source.loadstartListenerKey = source.on("tileloadstart", tileloadstartHandler);
            source.loadendListenerKey = source.on("tileloadend", tileloadendHandler);
        }
    } else {
        Ol.Observable.unByKey(source.loadstartListenerKey);
        Ol.Observable.unByKey(source.loadendListenerKey);
        source.loadstartListenerKey = null;
        source.loadendListenerKey = null;
    }

    // maj du cache
    source.refresh();
};

export default OL;
