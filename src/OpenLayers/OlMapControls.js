import { OlMap } from "./OlMapBase";
import { IMap } from "../Interface/IMap";
import { olExtended as Ol } from "geoportal-extensions-openlayers";
import {
    Pointer as PointerInteraction,
    MouseWheelZoom as MouseWheelZoomInteraction,
    DoubleClickZoom as DoubleClickZoomInteraction,
    KeyboardPan as KeyboardPanInteraction,
    KeyboardZoom as KeyboardZoomInteraction,
    Select as SelectInteraction
} from "ol/interaction";
import {
    Zoom as ZoomControl,
    OverviewMap as OverviewMapControl,
    Rotate as RotateControl,
    ScaleLine as ScaleLineControl
} from "ol/control";
import Graticule from "ol/layer/Graticule";
import View from "ol/View";
import Overlay from "ol/Overlay";
import {
    Fill as FillStyle,
    Icon as IconStyle,
    Stroke as StrokeStyle,
    Style,
    Circle as CircleStyle
} from "ol/style";
import {
    transform as olTransformProj
    // get as olGetProj
} from "ol/proj";

/**
 * Proprietes modifiables des controles pour OL
 */
OlMap.CONTROLPROPERTIES = {
    maximised : "collapsed"

    // TODO : rajouter mapping property SDK <-> property OL au fur et à mesure de l'ajout des controles.

};

/**
 * Association controlId <-> classe OpenLayers d'implemenation
 */
OlMap.CONTROLSCLASSES = {
    draggable : [
        PointerInteraction,
        MouseWheelZoomInteraction,
        DoubleClickZoomInteraction
    ],
    keyboard : [
        KeyboardPanInteraction,
        KeyboardZoomInteraction
    ],
    scrollwheel : null,
    selectable : [SelectInteraction],
    zoom : ZoomControl,
    zoombox : null,
    overview : OverviewMapControl,
    orientation : RotateControl,
    graphicscale : ScaleLineControl,
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
    graticule : Graticule,
    search : Ol.control.SearchEngine,
    reversesearch : Ol.control.ReverseGeocode,
    drawing : Ol.control.Drawing,
    attributions : Ol.control.GeoportalAttribution,
    camera : null
};

/**
 * Ajoute le controle de Zoom sur la carte
 *
 * @param {Object} controlOpts - options du controle
 *
 * @returns {Ol.control.Zoom} control
 */
OlMap.prototype.addZoomControl = function (controlOpts) {
    var control = new ZoomControl({
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
OlMap.prototype.addZoomBoxControl = function (controlOpts) {
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
OlMap.prototype.addOverviewControl = function (controlOpts) {
    this.logger.trace("[OlMap] addOverviewControl : ... ");
    var ovOpts = {};
    if (controlOpts.div) {
        ovOpts.target = controlOpts.div;
    }
    ovOpts.collapsed = !controlOpts.maximised;
    if (controlOpts.layers && Array.isArray(controlOpts.layers)) {
        var layerObjs = this._getLayersObj(controlOpts.layers);
        var olLayers = [];
        layerObjs.forEach((layerObj) => {
            this.logger.trace("[OlMap] addOverviewControl : adding " + layerObj.id + " to map");
            olLayers.push(layerObj.obj);
        },
        this);
        if (olLayers.length === 0 && controlOpts.layers.length > 0) {
            // couche(s) non chargée(s) dans la carte principale :
            // on essaye de les créer comme des couches WMTS Géoportail.
            for (var i = 0; i < controlOpts.layers.length; i++) {
                this.logger.trace("[OlMap] addOverviewControl : adding geoportal layer : " + controlOpts.layers[i] + " to map");
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
        ovOpts.view = new View(viewOpts);
    }
    var control = new OverviewMapControl(ovOpts);
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
OlMap.prototype.addOrientationControl = function (controlOpts) {
    var control = new RotateControl({
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
OlMap.prototype.addGraphicScaleControl = function (controlOpts) {
    var olunits = controlOpts.units;
    if (olunits && controlOpts.units.toLowerCase() === "deg") {
        olunits = "degrees";
    } else if (olunits && controlOpts.units.toLowerCase() === "m") {
        olunits = "metric";
    }
    this.logger.trace("[OlMap] addGraphicScaleControl : setting graphicscale units to " + olunits);
    var control = new ScaleLineControl({
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
 * @param {Object} controlOpts - control options (other native options for Graticule Control (see https://openlayers.org/en/latest/apidoc/module-ol_Graticule-Graticule.html))
 * @param {String} controlOpts.strokeColor - stroke color expressed in hex format (default : #000000)
 * @param {Number} controlOpts.strokeOpacity - stroke opacity expressed between 0 and 1 (default : 0.2).
 * @param {Number} controlOpts.strokeWidth - stroke width expressed in pixels (default : 1).
 *
 * @return {Ol.Graticule} graticule
 */
OlMap.prototype.addGraticuleControl = function (controlOpts) {
    // TODO options redefined by default : lonLabelStyle & latLabelStyle
    var options = controlOpts || {};
    // it's an openlayers component, and this control also takes all the native options
    // "strokeStyle", detail of this option but redefined by default
    if (!options.strokeStyle) {
        options.strokeColor = options.strokeColor || "#000000";
        options.strokeOpacity = options.strokeOpacity || 0.2;
        options.strokeWidth = options.strokeWidth || 1;
        var rgba = IMap.prototype._hexToRgba.call(this, options.strokeColor, options.strokeOpacity);
        options.strokeStyle = new StrokeStyle({
            color : rgba,
            width : options.strokeWidth
        });
    }

    var graticule = new Graticule(options);
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
OlMap.prototype.addMousePositionControl = function (controlOpts) {
    var mpOpts = {};
    if (controlOpts.div) {
        mpOpts.target = controlOpts.div;
    }
    mpOpts.collapsed = !controlOpts.maximised;
    if (controlOpts.systems &&
        Array.isArray(controlOpts.systems) &&
        controlOpts.systems.length > 0) {
        for (var i = 0; i < controlOpts.systems.length; i++) {
            // si la projection n'est pas reconnue, on laisse le controle
            // ajouter cette projection... Le controle possede un mecanisme de
            // verification et ajout des projections non definies...
            // if (!olGetProj(controlOpts.systems[i].crs)) {
            //     // on retire les systèmes non définis
            //     this.logger.trace("[OlMap] addMousePositionControl : crs [" + controlOpts.systems[i].crs + "] not found.");
            //     continue;
            // }
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
                this.logger.trace("[OlMap] addMousePositionControl : adding unit   [" + controlOpts.units[ii].toUpperCase());
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
 * @param {Array} controlOpts.markersOpts[property].offset - Offsets in pixels used when positioning the overlay. The first element in the array is the horizontal offset. A positive value shifts the overlay right. The second element in the array is the vertical offset. A positive value shifts the overlay down. Default is [0, 0]. (see https://openlayers.org/en/latest/apidoc/module-ol_Overlay-Overlay.html)
 * @param {Object} controlOpts.routeOptions - route service options. For advanced use only. See {@link https://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html#~route Gp.Services.route()} to know all route options.
 * @param {Object} controlOpts.autocompleteOptions - autocomplete service options. See {@link https://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html#~autoComplete Gp.Services.autoComplete()} to know all autocomplete options.
 *
 * @return {Ol.control.Route} control
 */
OlMap.prototype.addRouteControl = function (controlOpts) {
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
 * @param {Array} controlOpts.markerOpts.offset - Offsets in pixels used when positioning the overlay. The first element in the array is the horizontal offset. A positive value shifts the overlay right. The second element in the array is the vertical offset. A positive value shifts the overlay down. Default is [0, 0]. (see https://openlayers.org/en/latest/apidoc/module-ol_Overlay-Overlay.html)
 * @param {Object} controlOpts.isocurveOptions - isocurve service options. For advanced use only. See {@link https://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html#~isocurve Gp.Services.isocurve()} to know all isocurve options.
 * @param {Object} controlOpts.autocompleteOptions - autocomplete service options. See {@link https://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html#~autoComplete Gp.Services.autoComplete()} to know all autocomplete options.
 *
 * @return {Ol.control.Isocurve} control
 */
OlMap.prototype.addIsocurveControl = function (controlOpts) {
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
OlMap.prototype.addLayerImportControl = function (controlOpts) {
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
            kmldefaultStyleOptions.image = new IconStyle({
                src : userKMLDefaultStyles.markerSrc || defaultMarkerSrc,
                anchor : [userKMLDefaultStyles.markerXAnchor || 25.5, userKMLDefaultStyles.markerYAnchor || 38],
                anchorOrigin : "top-left",
                anchorXUnits : "pixels",
                anchorYUnits : "pixels"
            });
            strokeOpacity = userKMLDefaultStyles.strokeOpacity || 0.8;
            strokeColor = userKMLDefaultStyles.strokeColor || "#002A50";
            kmldefaultStyleOptions.stroke = new StrokeStyle({
                color : IMap.prototype._hexToRgba.call(this, strokeColor, strokeOpacity),
                width : userKMLDefaultStyles.strokeWidth || 4
            });
            fillOpacity = userKMLDefaultStyles.polyFillOpacity || 0.5;
            fillColor = userKMLDefaultStyles.polyFillColor || "#00B798";
            kmldefaultStyleOptions.fill = new FillStyle({
                color : IMap.prototype._hexToRgba.call(this, fillColor, fillOpacity)
            });
            var kmldefaultStyle = new Style(kmldefaultStyleOptions);
            importOpts.vectorStyleOptions.KML = {
                defaultStyle : kmldefaultStyle
            };
        }
        if (controlOpts.defaultStyles.GPX) {
            var userGPXDefaultStyles = controlOpts.defaultStyles.GPX;
            var gpxdefaultStyleOptions = {};
            gpxdefaultStyleOptions.image = new IconStyle({
                src : userGPXDefaultStyles.markerSrc || defaultMarkerSrc,
                anchor : [userGPXDefaultStyles.markerXAnchor || 25.5, userGPXDefaultStyles.markerYAnchor || 38],
                anchorOrigin : "top-left",
                anchorXUnits : "pixels",
                anchorYUnits : "pixels"
            });
            strokeOpacity = userGPXDefaultStyles.strokeOpacity || 0.8;
            strokeColor = userGPXDefaultStyles.strokeColor || "#002A50";
            gpxdefaultStyleOptions.stroke = new StrokeStyle({
                color : IMap.prototype._hexToRgba.call(this, strokeColor, strokeOpacity),
                width : userGPXDefaultStyles.strokeWidth || 4
            });
            var gpxdefaultStyle = new Style(gpxdefaultStyleOptions);
            importOpts.vectorStyleOptions.GPX = {
                defaultStyle : gpxdefaultStyle
            };
        }
        if (controlOpts.defaultStyles.GeoJSON) {
            var userGeoJSONDefaultStyles = controlOpts.defaultStyles.GeoJSON;
            var geoJSONdefaultStyleOptions = {};
            geoJSONdefaultStyleOptions.image = new IconStyle({
                src : userGeoJSONDefaultStyles.markerSrc || defaultMarkerSrc,
                anchor : [userGeoJSONDefaultStyles.markerXAnchor || 25.5, userGeoJSONDefaultStyles.markerYAnchor || 38],
                anchorOrigin : "top-left",
                anchorXUnits : "pixels",
                anchorYUnits : "pixels"
            });
            strokeOpacity = userGeoJSONDefaultStyles.strokeOpacity || 0.8;
            strokeColor = userGeoJSONDefaultStyles.strokeColor || "#002A50";
            geoJSONdefaultStyleOptions.stroke = new StrokeStyle({
                color : IMap.prototype._hexToRgba.call(this, strokeColor, strokeOpacity),
                width : userGeoJSONDefaultStyles.strokeWidth || 4
            });
            fillOpacity = userGeoJSONDefaultStyles.polyFillOpacity || 0.5;
            fillColor = userGeoJSONDefaultStyles.polyFillColor || "#00B798";
            geoJSONdefaultStyleOptions.fill = new FillStyle({
                color : IMap.prototype._hexToRgba.call(this, strokeColor, strokeOpacity)
            });
            var geoJSONdefaultStyle = new Style(geoJSONdefaultStyleOptions);
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
 * Adds LayerSwitcher control to the map.
 *
 * @param {Object} controlOpts - control options
 * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
 * @param {Boolean} controlOpts.maximised - if the control has to be opened or not.
 *
 * @return {Ol.control.LayerSwitcher} control
 */
OlMap.prototype.addLayerSwitcherControl = function (controlOpts) {
    this.logger.trace("[OlMap] : addLayerSwitcherControl ... ");
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
        this.logger.trace("[OlMap] : layerSwitcher : configuring layer : " + layer.id);
        // INFO : les couches Geoportail sont aussi configurées.
        var layerConf = {
            layer : layer.obj,
            config : {}
        };
        if (layer.options.title) {
            this.logger.trace("[OlMap] : layerSwitcher : setting title to [" + layer.options.title + "] for layer " + layer.id);
            layerConf.config.title = layer.options.title;
        }
        if (layer.options.description) {
            this.logger.trace("[OlMap] : layerSwitcher : setting description to [" + layer.options.description + "] for layer " + layer.id);
            layerConf.config.description = layer.options.description;
        }
        if (layer.options.quicklookUrl) {
            this.logger.trace("[OlMap] : layerSwitcher : setting quicklookUrl to [" + layer.options.quicklookUrl + "] for layer " + layer.id);
            layerConf.config.quicklookUrl = layer.options.quicklookUrl;
        }
        if (layer.options.legends) {
            this.logger.trace("[OlMap] : layerSwitcher : setting legends to [" + layer.options.legends + "] for layer " + layer.id);
            layerConf.config.legends = layer.options.legends;
        }
        if (layer.options.metadata) {
            this.logger.trace("[OlMap] : layerSwitcher : setting metadata to [" + layer.options.metadata + "] for layer " + layer.id);
            layerConf.config.metadata = this._filterEmptyMetadata(layer.options.metadata);
        }
        lsOpts.layers.push(layerConf);
    }

    this.logger.trace("[OlMap] : layerSwitcher Opts : ... ");
    var control = new Ol.control.LayerSwitcher(lsOpts);
    this.libMap.addControl(control);
    return control;
};

/**
 * Adds measure length tool bar control to the map.
 *
 * @param {Object} controlOpts - options du controle
 *
 * @return {Ol.control.MeasureLength} control
 */
OlMap.prototype.addLengthControl = function (controlOpts) {
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
                startOpts.fill = new FillStyle({
                    color : controlOpts.styles.start.fillColor
                });
            }
            lengthOpts.styles.start = new Style(startOpts);
        }
        // drawEnd style creation
        if (controlOpts.styles.hasOwnProperty("finish")) {
            var finishOpts = {};
            finishOpts.stroke = this._fillStrokeStyles(controlOpts.styles.finish);
            if (controlOpts.styles.finish.hasOwnProperty("fillColor")) {
                finishOpts.fill = new FillStyle({
                    color : controlOpts.styles.finish.fillColor
                });
            }
            lengthOpts.styles.finish = new Style(finishOpts);
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
OlMap.prototype.addAreaControl = function (controlOpts) {
    this.logger.trace("[OlMap] addAreaControl : ... ");
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
                startOpts.fill = new FillStyle({
                    color : controlOpts.styles.start.fillColor
                });
            }
            areaOpts.styles.start = new Style(startOpts);
        }
        // drawEnd style creation
        if (controlOpts.styles.hasOwnProperty("finish")) {
            var finishOpts = {};
            finishOpts.stroke = this._fillStrokeStyles(controlOpts.styles.finish);
            if (controlOpts.styles.finish.hasOwnProperty("fillColor")) {
                finishOpts.fill = new FillStyle({
                    color : controlOpts.styles.finish.fillColor
                });
            }
            areaOpts.styles.finish = new Style(finishOpts);
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
OlMap.prototype.addAzimuthControl = function (controlOpts) {
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
                startOpts.fill = new FillStyle({
                    color : controlOpts.styles.start.fillColor
                });
            }
            azimuthOpts.styles.start = new Style(startOpts);
        }
        // drawEnd style creation
        if (controlOpts.styles.hasOwnProperty("finish")) {
            var finishOpts = {};
            finishOpts.stroke = this._fillStrokeStyles(controlOpts.styles.finish);
            if (controlOpts.styles.finish.hasOwnProperty("fillColor")) {
                finishOpts.fill = new FillStyle({
                    color : controlOpts.styles.finish.fillColor
                });
            }
            azimuthOpts.styles.finish = new Style(finishOpts);
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
 * | displayProfileOptions.apply | Function | function to display profile if you want to cutomise it. By default, built-in [DISPLAY_PROFILE_BY_DEFAULT()](http://ignf.github.io/geoportal-extensions/openlayers-latest/jsdoc/ol.control.ElevationPath.html#.DISPLAY_PROFILE_BY_DEFAULT) is used. You may also provide your own function using the same signature. |
 * | displayProfileOptions.target | Object | DOM container to use to display the profile. |
 *
 * @param {Object} controlOpts - options du controle
 *
 * @return {Ol.control.ElevationPath} control
 */
OlMap.prototype.addElevationPathControl = function (controlOpts) {
    var elevOpts = {};
    this.logger.trace("[OlMap] addElevationPathControl : ... ");
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
                elevOpts.stylesOptions.marker = new IconStyle(markerOpts);
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
 * @param {Object} controlOpts.advancedSearch - advanced search options for geocoding (filters). Properties can be found among geocode options.filterOptions (see https://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html#~geocode)
 * @param {Object} [controlOpts.geocodeOptions = {}] - options of geocode service (see https://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html#~geocode)
 * @param {Object} [controlOpts.autocompleteOptions = {}] - options of autocomplete service (see https://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html#~autoComplete)
 *
 * @return {Ol.control.SearchEngine} control
 */
OlMap.prototype.addSearchControl = function (controlOpts) {
    var searchOpts = {};
    if (controlOpts.div) {
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
 * @param {Object} [controlOpts.reverseGeocodeOptions = {}] - reverse geocode service options. see https://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html#~reverseGeocode to know all reverse geocode options.
 *
 * @return {Ol.control.ReverseGeocode} control
 */
OlMap.prototype.addReverseSearchControl = function (controlOpts) {
    var searchOpts = {};
    if (controlOpts.div) {
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
OlMap.prototype.addDrawingControl = function (controlOpts) {
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
OlMap.prototype.addAttributionsControl = function (controlOpts) {
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
OlMap.prototype.addCameraControl = function (controlOpts) {
    // Not implemented (3D feature)
    return null;
};

/**
 * Ajoute l'outil getFeatureInfo
 *
 * @param {Object} controlOpts - options du controle
 * @return {Ol.control.GetFeatureInfo} control
 */
OlMap.prototype.addGetFeatureInfoControl = function (controlOpts) {
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
                let format = mapLayer.options.format.toLowerCase();
                if (!mapLayer.options.queryable &&
                    format !== "kml" &&
                    format !== "geojson" &&
                    format !== "gpx" &&
                    format !== "georss" &&
                    format !== "wfs" &&
                    format !== "drawing"
                ) {
                    this.logger.info("GetFeatureInfo layer '" + gfiLayerId + "' has not been added to control because this layer is not queryable.");
                    break;
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
OlMap.prototype.removeControls = function (controlIds) {
    this.logger.trace("[OlMap] : removeControls ... ");
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
            this.logger.trace("[OlMap] : removeControls : removing [" + controlId + "] from register.");
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
        this.logger.trace("[OlMap] : removeControls : removing [" + controlId + "] from Map.");
        this.libMap.removeControl(olControl);
    }
};

/**
 * Returns implementation of the control
 *
 * @param {String} controlId - identifier of the control
 * @returns {Object} - implementation object of the control if it is on the map. null otherwise.
 */
OlMap.prototype.getLibMapControl = function (controlId) {
    var foundOlControl = null;
    // verifications de base : controlId est bien gere.
    if (!OlMap.CONTROLSCLASSES.hasOwnProperty(controlId.toLowerCase()) ||
        !OlMap.CONTROLSCLASSES[controlId.toLowerCase()]) {
        this.logger.trace("[OlMap] getLibMapControl : control " + controlId + " non implémenté.");
        return foundOlControl;
    }
    var olControlClass = OlMap.CONTROLSCLASSES[controlId.toLowerCase()];
    // olControlClass == Array => interactions
    if (Array.isArray(olControlClass)) {
        this.logger.trace("[OlMap] getLibMapControl : searching interactions.");
        var olInteractions = [];
        this.getLibMap().getInteractions().forEach((interaction) => {
            for (var j = 0; j < olControlClass.length; j++) {
                if (interaction instanceof olControlClass[j]) {
                    this.logger.trace("[OlMap] getLibMapControl : found interaction : " + olControlClass[j].name);
                    olInteractions.push(interaction);
                    break;
                }
            }
        });
        return olInteractions.length > 0 ? olInteractions : null;
    }
    // cas du graticule
    if (controlId.toLowerCase() === "graticule") {
        return this.getLibMap().hasOwnProperty("graticule") ? this.getLibMap().graticule : null;
    }
    // ici c'est un controle simple.
    this.logger.trace("[OlMap] getLibMapControl : controlClass : " + olControlClass.name);
    // on regarde du cote des controles
    var olControls = this.getLibMap().getControls().getArray();
    if (olControls.length === 0) {
        this.logger.trace("[OlMap] getLibMapControl : no control found on map");
        return foundOlControl;
    }
    for (var i = 0; i < olControls.length; i++) {
        var olControl = olControls[i];
        this.logger.trace("[OlMap] getLibMapControl : analyzing : " + typeof olControl);
        if (olControl instanceof olControlClass) {
            foundOlControl = olControl;
            this.logger.trace("[OlMap] getLibMapControl : found ! ");
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
OlMap.prototype._addMarkers = function (markersOptions) {
    this.logger.trace("[OlMap] : _addMarkers");
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
        context.logger.trace("[OlMap] : _addMarkers : display content : " + mo.content);
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
        this.logger.trace("[OlMap] : _addMarkers : offset [" + mo.offset[0] + "," + mo.offset[1] + "]");
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
                // properties of autoPanAnimation : https://openlayers.org/en/latest/apidoc/module-ol_Overlay.html#~PanOptions
                autoPanAnimation : {
                    duration : IMap.DEFAULT_AUTOPAN_OPTIONS.duration
                },
                autoPanMargin : IMap.DEFAULT_AUTOPAN_OPTIONS.margin
            };
        }
        // create overlay
        var fcoords = [mo.position.x, mo.position.y];
        if (mo.position.hasOwnProperty("projection")) {
            fcoords = olTransformProj(fcoords, mo.position.projection, this.getProjection());
        }
        this.logger.trace("[OlMap] : _addMarkers : coords [" + fcoords[0] + ", " + fcoords[1] + "]");
        var mrkImg = document.createElement("img");
        mrkImg.src = mo.url;
        // mrkImg.setAttribute("content", mo.content);
        mrkImg.mo = mo;
        var mrk = new Overlay({
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
                    fcoords = olTransformProj(fcoords, locEvt.position.projection, gpMap.getProjection());
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
 * Fill ol styles with params
 *
 * @param {Object} stylesProps - properties
 * @returns {Ol.style.Stroke} - ol.style.Stroke Object
 * @private
 */
OlMap.prototype._fillStrokeStyles = function (stylesProps) {
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
        resultStyle = new StrokeStyle(strokeOpts);
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
OlMap.prototype._fillPointerStyles = function (stylesProps) {
    var pointerOpts = {};
    if (stylesProps.hasOwnProperty("radius")) {
        pointerOpts.radius = stylesProps.radius;
    }
    pointerOpts.stroke = this._fillStrokeStyles(stylesProps);
    if (stylesProps.hasOwnProperty("fillColor")) {
        pointerOpts.fill = new FillStyle({
            color : stylesProps.fillColor
        });
    }
    var pStyle = new CircleStyle(pointerOpts);
    return pStyle;
};

/**
 * Rajoute une configuration de couche au LayerSwitcher
 *
 * @param {Object} implLayer - objet couche de l'implémentation
 * @param {Gp.LayerOptions} layerOptions - options de la couche.
 * @private
 */
OlMap.prototype._addLayerConfToLayerSwitcher = function (implLayer, layerOptions) {
    this.logger.trace("[OlMap] : _addLayerConfToLayerSwitcher ... ");
    var lsControl = this.getLibMapControl("layerswitcher");
    if (lsControl) {
        lsControl.addLayer(implLayer, this._layerOptions2layerConf(layerOptions));
    }
};

/**
 * Gets Layer Container div ID for a given layerId.
 *
 * @param {String} layerId - layer identifier
 * @returns {String} - Layer Container div Id in the LayerSwitcher
 */
OlMap.prototype.getLSLayerContainerDivId = function (layerId) {
    var id = null;
    var idxLS = this._findRegisteredControl("layerswitcher");
    if (idxLS < 0) {
        this.logger.trace("[OlMap] : getLSLayerContainerDivId : no layerswitcher on map !");
        return id;
    }
    var olLayers = this._getLayersObj([layerId]);
    if (olLayers.length > 0) {
        var olLs = this._controls[idxLS].obj;
        return olLs.getLayerDOMId(olLayers[0].obj);
    }
    this.logger.trace("[OlMap] : getLSLayerContainerDivId : layer [" + layerId + "] not found on map !");
    return id;
};
