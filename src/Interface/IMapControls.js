import { IMap } from "./IMapBase";

/**
 * Default autoPanOptions
 * @private
 */
IMap.DEFAULT_AUTOPAN_OPTIONS = {
    autoPan : true,
    duration : 250,
    margin : 5
};

/**
 * Options par défaut des styles de dessin
 * @private
 */
IMap.DEFAULT_MEAS_STYLES = {
    pointer : {
        strokeColor : "#002A50",
        strokeWidth : 2,
        radius : 5,
        fillColor : "rgba(255, 155, 0, 0.7)"
    },
    start : {
        strokeColor : "#002A50",
        strokeWidth : 2,
        strokeLineDash : "[10, 10]",
        fillColor : "rgba(0, 183, 152, 0.2)"
    },
    finish : {
        strokeColor : "#002A50",
        strokeWidth : 3,
        fillColor : "rgba(0, 183, 152, 0.3)"
    }
};

/**
 * Converts hex color and opacity value to rgba String.
 * (Code adapted from : http://stackoverflow.com/a/5624139)
 * TODO : mettre ailleurs (extension)
 *
 * @param {String} hex - hex color
 * @param {Number} opacity - opacity
 *
 * @return {String} rgba String
 *
 * @private
 */
IMap.prototype._hexToRgba = function (hex, opacity) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    rgb = rgb ? {
        r : parseInt(rgb[1], 16),
        g : parseInt(rgb[2], 16),
        b : parseInt(rgb[3], 16)
    } : null;
    var result = rgb ? "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + opacity + ")" : null;
    return result;
};

/**
 * Returns the current control options. If controlIds is precised, returns just the options of the controls listed. If controlIds = null, returns the options of all the map's controls.<br/>
 *
 * @alias Gp.Map.getControlsOptions
 * @param {Array.<String> | null} controlIds - A list of control's id or null.
 * @returns {Object} - The options of the map's controls : Associative Array, mapping given controls Ids with their {@link Gp.ControlOptions} properties.
 */
IMap.prototype.getControlsOptions = function (controlIds) {
    // aucun controlIds fourni => on les retourne tous
    if (!controlIds || (Array.isArray(controlIds) && controlIds.length === 0)) {
        controlIds = [];
        this._controls.forEach(function (control) {
            controlIds.push(control.id);
        },
        this);
    }
    var controlsOptions = {};
    if (!Array.isArray(controlIds)) {
        controlIds = [controlIds];
    }
    this._controls.forEach(function (control) {
        if (controlIds.indexOf(control.id) < 0) {
            return;
        }
        controlsOptions[control.id] = control.options;
    },
    this);
    return controlsOptions;
};

/**
 * Returns underlying implementation of the control identified by controlId. Can be :
 * - an [ol.control.Control](https://openlayers.org/en/latest/apidoc/module-ol_control_Control-Control.html) subclass with current OpenLayers 3 implementation if the current map is in 2D.
 * - an [itowns.control.Widget](https://ignf.github.io/geoportal-extensions/current/jsdoc/itowns/itowns.control.Widget.html) subclass with current OpenLayers 3 implementation if the current map is in 2D.
 *
 * @alias Gp.Map.getLibMapControl
 * @param {String} controlId - identifier of the control
 * @returns {Object} - implementation object of the control if it is on the map. null otherwise.
 */
IMap.prototype.getLibMapControl = function (controlId) {
    // TO BE OVERRIDDEN
    var olControl = null;
    return olControl;
};

/**
 * Add the list of controls to the map
 *
 * @alias Gp.Map.addControls
 * @param {Object} controlsOptions - Controls to add to the map and their options. Associative array mapping the control's name (keys) with a Boolean (value) for activating / deactivating or with their properties (values given as {@link Gp.ControlOptions}).
 *
 * **Common 2D/3D controls :**
 *
 * | Key | Control Description |
 * |-|-|
 * | 'layerswitcher' | Adds layers selector widget to the map. See [options availables](./Gp.ControlOptions.html#layerswitcher) |
 * | 'graphicscale' | Adds scale line widget to the map. See [options availables](./Gp.ControlOptions.html#graphicscale) |
 * | 'mouseposition' | Adds mouse position widget to the map. See [options availables](./Gp.ControlOptions.html#mouseposition) |
 * | 'overview' | Adds mini overview map to the map. See [options availables](./Gp.ControlOptions.html#overview) |
 * | 'attributions' | Adds layers originators display to the map. See [options availables](./Gp.ControlOptions.html#attributions) |
 *
 * **Specific 2D controls :**
 *
 * | Key | Control Description |
 * |-|-|
 * | 'draggable' | Enable (true) / disable (false) map dragging/zoomming by mouse or pointer interaction.|
 * | 'keyboard' | Enable (true) / disable (false) map dragging/zoomming by keybord interaction. |
 * | 'selectable' | Enable (true) / disable (false) feature selection on the map. [**DEPRECATED**] : use ['getfeatureinfo'](./Gp.ControlOptions.html#getfeatureinfo) control instead to allow users to interact with features.|
 * | 'zoom' | Adds Zoom widget to the map. See [options availables](./Gp.ControlOptions.html#zoom) |
 * | 'orientation' | Adds orientation widget to the map. See [options availables](./Gp.ControlOptions.html#orientation) |
 * | 'length' | Adds length measurement widget to the map. See [options availables](./Gp.ControlOptions.html#length).|
 * | 'area' | Adds area measurment widget to the map. See [options availables](./Gp.ControlOptions.html#area) |
 * | 'azimuth' | Adds azimuth measurment to the map. See [options availables](./Gp.ControlOptions.html#azimuth) |
 * | 'elevationpath' | Adds elevationpath computation widget to the map. See [options availables](./Gp.ControlOptions.html#elevationpath) |
 * | 'search' | Adds search widget to the map. See [options availables](./Gp.ControlOptions.html#searchctrl) |
 * | 'reversesearch' | Adds reverse search widget to the map. See [options availables](./Gp.ControlOptions.html#reversesearch) |
 * | 'layerimport' | Adds layer import widget to the map. See [options availables](./Gp.ControlOptions.html#layerimport) |
 * | 'drawing' | Adds drawing tools widget to the map. See [options availables](./Gp.ControlOptions.html#drawing) |
 * | 'route' | Adds route control to the map. See [options availables](./Gp.ControlOptions.html#route) |
 * | 'isocurve' | Adds isocurve control to the map. See [options availables](./Gp.ControlOptions.html#isocurve) |
 * | 'graticule' | Adds graticule control to the map. See [options availables](./Gp.ControlOptions.html#graticule) |
 * | 'getfeatureinfo' | Adds capability to retrieve and display information about layer features. See [options availables](./Gp.ControlOptions.html#getfeatureinfo) |
 *
 */
IMap.prototype.addControls = function (controlsOptions) {
    this.logger.trace("[IMap] addControls");
    var controlId = null;
    for (controlId in controlsOptions) {
        var controlObj = null;
        var controlOpts = controlsOptions[controlId];
        // on regarde s'il existe dejà :
        // d'abord dans le registre this._controls
        var idx = -1;
        var libControl = this.getLibMapControl(controlId);
        idx = this._findRegisteredControl(controlId);
        if (idx >= 0 || libControl) {
            // trouve sur la carte et / ou dans le registre
            this.logger.info("[IMap] addControls : [" + controlId + "] déjà présent.");
            // on l'enleve
            this.removeControls([controlId]);
            if (controlOpts === null || controlOpts === undefined) {
                // si l'objet options associé est null : simple suppression.
                // FIXME : comportement à maintenir ?
                continue;
            }
        }
        this.logger.trace("[IMap] addControls : adding : [" + controlId + "]");
        switch (controlId.toLowerCase()) {
            case "draggable":
                controlObj = this.setDraggable(controlOpts);
                break;
            case "keyboard":
                controlObj = this.setKeyboard(controlOpts);
                break;
            case "selectable":
                controlObj = this.setSelectable(controlOpts);
                break;
            case "zoom":
                controlObj = this.addZoomControl(controlOpts);
                break;
            /* A REVOIR
             * Le control n'a pas le comportement attendu
             */
            case "zoombox":
                controlObj = this._addZoomBoxControl(controlOpts);
                break;
            case "overview":
                controlObj = this.addOverviewControl(controlOpts);
                break;
            case "orientation":
                controlObj = this.addOrientationControl(controlOpts);
                break;
            case "graphicscale":
                controlObj = this.addGraphicScaleControl(controlOpts);
                break;
            case "mouseposition":
                controlObj = this.addMousePositionControl(controlOpts);
                break;
            case "route":
                controlObj = this.addRouteControl(controlOpts);
                break;
            case "isocurve":
                controlObj = this.addIsocurveControl(controlOpts);
                break;
            case "graticule":
                controlObj = this.addGraticuleControl(controlOpts);
                break;
            case "layerswitcher":
                controlObj = this.addLayerSwitcherControl(controlOpts);
                break;
            case "layerimport":
                controlObj = this.addLayerImportControl(controlOpts);
                break;
            case "length":
                controlObj = this.addLengthControl(controlOpts);
                break;
            case "area":
                controlObj = this.addAreaControl(controlOpts);
                break;
            case "azimuth":
                controlObj = this.addAzimuthControl(controlOpts);
                break;
            case "elevationpath":
                controlObj = this.addElevationPathControl(controlOpts);
                break;
            case "search":
                controlObj = this.addSearchControl(controlOpts);
                break;
            case "reversesearch":
                controlObj = this.addReverseSearchControl(controlOpts);
                break;
            case "drawing":
                controlObj = this.addDrawingControl(controlOpts);
                break;
            case "attributions":
                controlObj = this.addAttributionsControl(controlOpts);
                break;
            case "camera":
                controlObj = this.addCameraControl(controlOpts);
                break;
            case "getfeatureinfo":
                controlObj = this.addGetFeatureInfoControl(controlOpts);
                break;
            default :
                this.logger.info("Controle " + controlId + "inconnu.");
                // if the controlId is not recognized, we skip it
                continue;
        }
        this.logger.trace("[IMap] addControls : registering : [" + controlId + "]");
        // if the control is not implemented in 3D, controlObj doesn't exist
        // then we register it as "2D-only-control", to re-add it in case of switch 3D->2D
        this._controls.push({
            obj : controlObj || "2D-only-control",
            id : controlId.toLowerCase(),
            options : controlOpts
        });
    }
};

/**
 * Removes given controls from the map.
 *
 * @alias Gp.Map.removeControls
 * @param {Array.<String>} controlIds - A list of control's id to be removed.
 */
IMap.prototype.removeControls = function (controlIds) {
    // TO BE OVERRIDDEN
};

/**
 * Modify the control'options listed to the map
 *
 * @alias Gp.Map.modifyControls
 * @param {Object} controlsOptions - Controls to modify on the map and their options. Associative array mapping the control's name (keys) with a Boolean (value) for activating / deactivating or with their properties (values given as {@link Gp.ControlOptions}). See [Gp.Map.addControls()](Gp.Map.html#addControls) for availables controls keys.
 */
IMap.prototype.modifyControls = function (controlsOptions) {
    this.logger.trace("[IMap] : modifyControls ... ");
    var controlIds = Object.keys(controlsOptions);
    if (!controlIds || controlIds.length === 0) {
        this.logger.info("No control to modify.");
        return;
    }
    var controlId = null;
    for (var i = 0; i < controlIds.length; i++) {
        controlId = controlIds[i];
        // presence du controle sur la carte ?
        var controlObj = this.getLibMapControl(controlId);
        // si le controle est enregistre, on recupere ses options initiales.
        var idx = this._findRegisteredControl(controlId);
        if (idx >= 0) {
            // si le controle n'est plus sur la carte mais qu'il est enregistre, on se contente de le supprimmer
            if (!controlObj) {
                this.logger.trace("[IMap] : modifyControls : removing control : " + controlId);
                this.removeControls([controlId]);
                // on enleve le controle de controlsOptions
                delete controlsOptions[controlId];
                continue;
            }
            // on enrichit les anciennes options des nouvelles
            var newCtrlOptions = this._controls[idx].options;
            for (var opt in controlsOptions[controlId]) {
                newCtrlOptions[opt] = controlsOptions[controlId][opt];
            }
            controlsOptions[controlId] = newCtrlOptions;
        } else if (!controlObj) {
            // controle absent de la carte et du registre :
            // on enleve le controle de controlsOptions
            delete controlsOptions[controlId];
            continue;
        }
    }
    // ici, controlsOptions contient uniquement les controles
    // pouvant être modifiés avec toutes les propriétés voulues.
    // => il suffit de faire un addcontrols
    this.addControls(controlsOptions);
};

/**
 * Adds zoom control to the Map.
 *
 * @param {Gp.ControlOptions} controlOpts - control options
 * @private
 */
IMap.prototype.addZoomControl = function (controlOpts) {};

/**
 * Adds zoombox control to the Map.
 *
 * @param {Gp.ControlOptions} controlOpts - control options
 * @private
 */
IMap.prototype.addZoomBoxControl = function (controlOpts) {};

/**
 * Adds overview map to the map.
 *
 * @param {Object} controlOpts - control options
 * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
 * @param {Boolean} controlOpts.maximised - if the control has to be opened or not.
 * @param {Array.<String>} controlOpts.layers - List of layers Ids to be displayed on the overview map (may be part of main map layersId or a geoportal WMTS layer ID).
 * @private
 */
IMap.prototype.addOverviewControl = function (controlOpts) {};

/**
 * Adds orientation control to the map.
 *
 * @param {Object} controlOpts - control options
 * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
 * @private
 */
IMap.prototype.addOrientationControl = function (controlOpts) {};

/**
 * Adds graphicScale control to the map.
 *
 * @param {Object} controlOpts - control options
 * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
 * @param {String} controlOpts.units - units of distances shown ("m" for metric display or "deg" for geographical display). Implementation values may also be supported.
 * @param {Number} controlOpts.minWidth - minimum size (in pixels) if the widget.
 * @private
 */
IMap.prototype.addGraphicScaleControl = function (controlOpts) {};

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
 * @private
 */
IMap.prototype.addMousePositionControl = function (controlOpts) {};

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
 * @param {Object} controlOpts.routeOptions - route service options. For advanced use only. See {@link https://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html#~route Gp.Services.route()} to know all route options.
 * @param {Object} controlOpts.autocompleteOptions - autocomplete service options. See {@link https://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html#~autoComplete Gp.Services.autoComplete()} to know all autocomplete options.
 * @private
 */
IMap.prototype.addRouteControl = function (controlOpts) {};

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
 * @param {Object} controlOpts.isocurveOptions - isocurve service options. For advanced use only. See {@link https://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html#~isocurve Gp.Services.isocurve()} to know all isocurve options.
 * @param {Object} controlOpts.autocompleteOptions - autocomplete service options. See {@link https://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html#~autoComplete Gp.Services.autoComplete()} to know all autocomplete options.
 * @private
 */
IMap.prototype.addIsocurveControl = function (controlOpts) {};

/**
 * Adds graticule control to the map.
 *
 * @param {Object} controlOpts - control options
 * @param {String} controlOpts.strokeColor - stroke color expressed in hex format (default : #000000)
 * @param {Number} controlOpts.strokeOpacity - stroke opacity expressed between 0 and 1 (default : 0.2).
 * @param {Number} controlOpts.strokeWidth - stroke width expressed in pixels (default : 1).
 * @private
 */
IMap.prototype.addGraticuleControl = function (controlOpts) {};

/**
 * Adds LayerSwitcher control to the map.
 *
 * @param {Object} controlOpts - control options
 * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
 * @param {Boolean} controlOpts.maximised - if the control has to be opened or not.
 * @private
 */
IMap.prototype.addLayerSwitcherControl = function (controlOpts) {};

/**
 * Adds layer import control to the map.
 *
 * @param {Object} controlOpts - control options
 * @private
 */
IMap.prototype.addLayerImportControl = function (controlOpts) {};

/**
 * Adds length measurment tool to the map.
 *
 * @param {Object} controlOpts - control options
 * @private
 */
IMap.prototype.addLengthControl = function (controlOpts) {};

/**
 * Adds area measurment tool to the map.
 *
 * @param {Object} controlOpts - control options
 * @private
 */
IMap.prototype.addAreaControl = function (controlOpts) {};

/**
 * Adds azimuth measurment tool to the map.
 *
 * @param {Object} controlOpts - control options
 * @private
 */
IMap.prototype.addAzimuthControl = function (controlOpts) {};

/**
 * Adds elevation profile control to the map.
 *
 * @param {Object} controlOpts - control options
 * @private
 */
IMap.prototype.addElevationPathControl = function (controlOpts) {};

/**
 * Adds search control to the map.
 *
 * @param {Object} controlOpts - control options
 * @private
 */
IMap.prototype.addSearchControl = function (controlOpts) {};

/**
 * Adds reverse geocoding control to the map.
 *
 * @param {Object} controlOpts - control options
 * @private
 */
IMap.prototype.addReverseSearchControl = function (controlOpts) {};

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
 * @param {String} [controlOpts.labels.applyToObject] - Label for apply to object button.
 * @param {String} [controlOpts.labels.saveDescription] - Label for save description button.
 * @param {String} [controlOpts.labels.setAsDefault] - Label for set as default style button.
 * @param {String} [controlOpts.labels.strokeColor] - Label for stroke color.
 * @param {String} [controlOpts.labels.strokeWidth] - Label for stroke width.
 * @param {String} [controlOpts.labels.fillColor] - Label for fill color.
 * @param {String} [controlOpts.labels.fillOpacity] - Label for fillOpacity.
 * @param {Array.<Object>} controlOpts.markersList - Array of markers urls and offsets to be used for points styling.
 * @param {String} controlOpts.markersList.src - URL of a marker image.
 * @param {Float} controlOpts.markersList.xAnchor - position of marker anchor in X from left of the image expressed in proportion of 1.
 * @param {Float} controlOpts.markersList.yAnchor - position of marker anchor in Y from top of the image expressed in proportion of 1.
 * @param {Float} controlOpts.markersList.yAnchor - URL of a marker image.
 * @param {Object} controlOpts.defaultStyles - Styles to apply by default to drawn features.
 * @param {String} [controlOpts.defaultStyles.textFillColor = "#000000"] - Text fill color for labels (RGB hex value).
 * @param {String} [controlOpts.defaultStyles.textStrokeColor = "#FFFFFF"] - Text surrounding color for labels (RGB hex value).
 * @param {String} [controlOpts.defaultStyles.strokeColor = "#ffcc33"] - Stroke color (RGB hex value).
 * @param {Number} [controlOpts.defaultStyles.strokeWidth = 2] - Stroke width in pixels.
 * @param {String} [controlOpts.defaultStyles.polyStrokeColor = "#ffcc33"] - Stroke color for polygons (RGB hex value).
 * @param {Number} [controlOpts.defaultStyles.polyStrokeWidth = 2] - Stroke width in pixels for polygons.
 * @param {String} [controlOpts.defaultStyles.polyFillColor = "#ffffff"] - Polygons fill color (RGB hex value).
 * @param {Number} [controlOpts.defaultStyles.polyFillOpacity = 0.2] - Polygon fill opacity (alpha value between 0:transparent and 1:opaque).
 * @param {Object} controlOpts.cursorStyle - cursor (circle) style when drawing or editing.
 * @param {String} [controlOpts.cursorStyle.fillColor = "rgba(0, 153, 255, 1)"] - Cursor fill color.
 * @param {String} [controlOpts.cursorStyle.strokeColor = "#FFF"] - Cursor stroke color.
 * @param {String} [controlOpts.cursorStyle.strokeWidth = 1] - Cursor surrounding stroke width.
 * @param {String} [controlOpts.cursorStyle.radius = 6] - Cursor radius.
 * @private
 */
IMap.prototype.addDrawingControl = function (controlOpts) {};

/**
 * Adds attribution control to the map.
 *
 * @param {Object} controlOpts - control options
 * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
 * @param {Boolean} controlOpts.maximised - if the control has to be opened or not.
 * @private
 */
IMap.prototype.addAttributionsControl = function (controlOpts) {};

/**
 * Adds camera orientation control to the map.
 *
 * @param {Object} controlOpts - control options
 * @private
 */
IMap.prototype.addCameraControl = function (controlOpts) {};

/**
 * Adds getFeatureInfo control to the map.
 *
 * @param {Object} controlOpts - control options
 * @private
 */
IMap.prototype.addGetFeatureInfoControl = function (controlOpts) {};

/**
 * Gets Layer Container div ID for a given layerId.
 *
 * @alias Gp.Map.getLSLayerContainerDivId
 * @param {String} layerId - layer identifier
 * @returns {String} - Layer Container div Id in the LayerSwitcher
 */
IMap.prototype.getLSLayerContainerDivId = function (layerId) {
    // TO BE OVERRIDDEN
    var id = null;
    return id;
};

/**
 * Returns default Controls for the map
 *
 * @returns {Object} associative array mapping default controlIds with their ControlOptions.
 * @private
 */
IMap.prototype._getDefaultControls = function () {
    return {
        draggable : true,
        keyboard : true,
        selectable : false,
        zoom : {},
        attributions : {
            maximised : false
        }
    };
};

/**
 * returns registerd Control in this._controls array.
 *
 * @param {String} controlId - control identifier
 * @returns {Integer} registered control index in this.controls array; -1 if not found.
 * @private
 */
IMap.prototype._findRegisteredControl = function (controlId) {
    var regCtrl = -1;
    if (!controlId || typeof controlId !== "string") {
        this.logger.warn("[IMap] _findRegisteredControl : controlId is not a straight string");
        return regCtrl;
    }
    for (var i = 0; i < this._controls.length; i++) {
        if (this._controls[i].id.toLowerCase() === controlId.toLowerCase()) {
            this.logger.trace("[IMap] _findRegisteredControl : found control " + controlId + " at index : " + i);
            return i;
        }
    }
    this.logger.trace("[IMap] _findRegisteredControl : control " + controlId + " not found.");

    return regCtrl;
};

/**
 * Rajoute une configuration de couche au LayerSwitcher
 *
 * @param {Object} layerReg - element de this._layers correspondant à la couche
 * @param {Object} layerConf - options à rajouter au layerSwitcher.
 * @private
 */
IMap.prototype._addLayerConfToLayerSwitcher = function (layerReg, layerConf) {
    // TO BE OVERRIDEN
};
