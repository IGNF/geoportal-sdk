import { ItMap } from "./ItMapBase";
import { itownsExtended } from "geoportal-extensions-itowns";
import {
    WMTSSource,
    ColorLayer
} from "itowns";

/**
 * Association controlId <-> classe iTowns d'implemenation
 */
ItMap.CONTROLSCLASSES = {
    mouseposition : "itowns.control.MousePosition",
    layerswitcher : "itowns.control.LayerSwitcher",
    attributions : "itowns.control.Attributions",
    overview : "itowns.control.MiniGlobe",
    graphicscale : "itowns.control.Scale",
    boostrelief : "itowns.control.BoostRelief",
    buildings : "itowns.control.Buildings"
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
 *
 * @returns {Object} control - mousePosition control
 */
ItMap.prototype.addMousePositionControl = function (controlOpts) {
    var mpOpts = {};
    if (controlOpts.div) {
        mpOpts.target = controlOpts.div;
    }
    mpOpts.collapsed = !controlOpts.maximised;
    if (!this._isConfLoaded) {
        mpOpts.apiKey = this.apiKey;
    }
    if (controlOpts.systems &&
        Array.isArray(controlOpts.systems) &&
        controlOpts.systems.length > 0) {
        for (var i = 0; i < controlOpts.systems.length; i++) {
            /*
            if (!ol.proj.get(controlOpts.systems[i].crs)) {
                // on retire les systèmes non définis
                this.logger.trace("[ItMap] addMousePositionControl  : crs [" + controlOpts.systems[i].crs + "] not found." ) ;
                continue ;
            } */
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
        for (var j = 0; j < controlOpts.units.length; j++) {
            if (typeof controlOpts.units[j] === "string") {
                this.logger.trace("[ItMap] addMousePositionControl : adding unit   [" + controlOpts.units[j].toUpperCase());
                mpOpts.units.push(controlOpts.units[j]);
            }
        }
    }
    mpOpts.displayAltitude = controlOpts.displayAltitude;
    mpOpts.displayCoordinates = controlOpts.displayCoordinates;
    if (controlOpts.altitude) {
        mpOpts.altitude = controlOpts.altitude;
    }
    var control = new itownsExtended.control.MousePosition(mpOpts);
    this.libMap.addWidget(control);
    if (!isNaN(controlOpts.x)) {
        control.getElement().style.left = Number(controlOpts.x) + "px";
        control.getElement().style.right = "unset";
    }
    if (!isNaN(controlOpts.y)) {
        control.getElement().style.bottom = Number(controlOpts.y) + "px";
        control.getElement().style.top = "unset";
    }
    return control;
};

/**
 * Adds LayerSwitcher control to the map.
 *
 * @param {Object} controlOpts - control options
 * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
 * @param {Boolean} controlOpts.maximised - if the control has to be opened or not.
 *
 * @returns {Object} control - layerSwitcher control
 */
ItMap.prototype.addLayerSwitcherControl = function (controlOpts) {
    this.logger.trace("[ItMap]  : addLayerSwitcherControl ... ");
    // TODO  : parametrage des couches
    var lsOpts = {
        layers : (controlOpts && controlOpts.layers) || [],
        options : {
            collapsed : !(controlOpts && controlOpts.maximised)
        }
    };
    if (controlOpts && controlOpts.div) {
        lsOpts.options.target = controlOpts.div;
    }
    // application des configuration des couches  :
    for (var i = 0; i < this._layers.length; i++) {
        var layer = this._layers[i];
        // Si la couche est un MNT, on ne l'ajoute pas au layerSwitcher
        if (layer.obj.type !== "color" && !layer.obj.isColorLayer) {
            continue;
        }
        this.logger.trace("[ItMap]  : layerSwitcher  : configuring layer  : " + layer.id);
        // INFO  : les couches Geoportail sont aussi configurées.
        var layerConf = {
            id : layer.id,
            layer : layer.obj,
            config : {}
        };
        if (layer.options.title) {
            this.logger.trace("[ItMap]  : layerSwitcher  : setting title to [" + layer.options.title + "] for layer " + layer.id);
            layerConf.config.title = layer.options.title;
        }
        if (layer.options.description) {
            this.logger.trace("[ItMap  : layerSwitcher  : setting description to [" + layer.options.description + "] for layer " + layer.id);
            layerConf.config.description = layer.options.description;
        }
        if (layer.options.quicklookUrl) {
            this.logger.trace("[ItMap]  : layerSwitcher  : setting quicklookUrl to [" + layer.options.quicklookUrl + "] for layer " + layer.id);
            layerConf.config.quicklookUrl = layer.options.quicklookUrl;
        }
        if (layer.options.legends) {
            this.logger.trace("[ItMap]  : layerSwitcher  : setting legends to [" + layer.options.legends + "] for layer " + layer.id);
            layerConf.config.legends = layer.options.legends;
        }
        if (layer.options.metadata) {
            this.logger.trace("[ItMap]  : layerSwitcher  : setting metadata to [" + layer.options.metadata + "] for layer " + layer.id);
            layerConf.config.metadata = layer.options.metadata;
        }
        lsOpts.layers.push(layerConf);
    }

    this.logger.trace("[ItMap]  : layerSwitcher Opts  : ... ");
    var control = new itownsExtended.control.LayerSwitcher(lsOpts);
    this.libMap.addWidget(control);
    // modify the position of the layerswitcher button if x or y is given as option
    if (controlOpts && !isNaN(controlOpts.x)) {
        control.getElement().style.left = Number(controlOpts.x) + "px";
        control.getElement().style.right = "unset";
    }
    if (controlOpts && !isNaN(controlOpts.y)) {
        control.getElement().style.bottom = Number(controlOpts.y) + "px";
        control.getElement().style.top = "unset";
    }
    return control;
};

/**
 * Adds overview map to the map.
 *
 * @param {Object} controlOpts - control options
 * @param {HTMLElement} controlOpts.div - The HTML Element where the overview is put
 * @param {Boolean} controlOpts.maximised - Display or not the control
 * @param {String} controlOpts.layerId - The Geoportal layerId of the miniGlobeLayer (by default, "ORTHOIMAGERY.ORTHOPHOTOS")
 * @param {Object} controlOpts.layer - The layer object formatted as expected by itowns (layerId ignored if layer param specified)
 * @param {String} controlOpts.position - The type of positionment of the overview element inside its container ("relative or absolute", by default)
 * @param {Number} controlOpts.width - The width of the minimap (100px by default)
 * @param {Number} controlOpts.height - The height of the minimap (100px by default)
 * @param {Number} controlOpts.x - The position of the minimap from the left of the container div (20px by default)
 * @param {Number} controlOpts.y - The position of the minimap from the bottom of the container div (20px by default)
 *
 * @returns {Object} control - overview control
 */
ItMap.prototype.addOverviewControl = function (controlOpts) {
    this.logger.trace("[ItMap] addOverviewControl : ... ");
    // clone car on ne veut pas modifier l'original !
    var opts = JSON.parse(JSON.stringify(controlOpts));

    var ovControlOptions = {};
    if (opts.position) {
        ovControlOptions.position = opts.position;
    } else {
        ovControlOptions.position = "absolute";
    }
    if (opts.div) {
        ovControlOptions.target = opts.div;
    }
    if (opts.layer) {
        ovControlOptions.layer = opts.layer;
        // conf d'une couche, possibilité de ne pas utiliser l'autoconf !
        if (!this._isConfLoaded) {
            ovControlOptions.layer.apiKey = this.apiKey;
        }
        // on ajoute les limites du tileMatrix
        if (!opts.layer.source.tileMatrixSet) {
            ovControlOptions.layer.source.tileMatrixSet = "PM";
        }
        if (!opts.layer.source.tileMatrixSetLimits) {
            ovControlOptions.layer.source.tileMatrixSetLimits = this._getTMSLimits(opts.layer.source.tileMatrixSet);
        }
        ovControlOptions.layer.source = new WMTSSource(ovControlOptions.layer.source);
        ovControlOptions.layer = new ColorLayer(ovControlOptions.layer.id, ovControlOptions.layer);
    } else if (controlOpts.layerId) {
        // utilisation de l'autoconf !
        ovControlOptions.layer = new itownsExtended.layer.GeoportalWMTS({
            layer : controlOpts.layerId,
            ssl : true
        });
    } else {
        // orthophotos layer by default on the miniglobe
        // utilisation de l'autoconf !
        ovControlOptions.layer = new itownsExtended.layer.GeoportalWMTS({
            layer : "ORTHOIMAGERY.ORTHOPHOTOS",
            ssl : true
        });
    }
    var control = new itownsExtended.control.MiniGlobe(ovControlOptions);
    this.libMap.addWidget(control);
    if (control.getElement()) {
        // hide the div if maximised option = false
        if (controlOpts.maximised === false) {
            control.getElement().style.display = "none";
        } else {
            control.getElement().style.display = "inline";
        }
        // modify the size of the miniglobe if width or height is given as option
        if (!isNaN(controlOpts.width)) {
            control.getElement().style.width = controlOpts.width + "px";
            control.getElement().getElementsByTagName("canvas")[0].style.width = controlOpts.width + "px";
        }
        if (!isNaN(controlOpts.height)) {
            control.getElement().style.height = controlOpts.height + "px";
            control.getElement().getElementsByTagName("canvas")[0].style.height = controlOpts.height + "px";
        }
        // modify the position of the miniglobe if x or y is given as option

        if (!isNaN(controlOpts.x)) {
            control.getElement().style.left = Number(controlOpts.x) + "px";
            control.getElement().style.right = "unset";
        }
        if (!isNaN(controlOpts.y)) {
            control.getElement().style.bottom = Number(controlOpts.y) + "px";
            control.getElement().style.top = "unset";
        }

        // update the canvas to fit with the overview element size
        var elementSize = {};
        elementSize.width = parseFloat(control.getElement().style.width) || 100;
        elementSize.height = parseFloat(control.getElement().style.height) || 100;
        control._globeObj.resize(elementSize.width, elementSize.height);
    }

    return control;
};

/**
 * Adds the graphic scale control to the map
 *
 * @param {Object} controlOpts - control options
 * @param {HTMLElement} controlOpts.div - The HTML Element where the scalebar is put
 * @param {Boolean} controlOpts.maximised - Display or not the control
 * @param {Number} controlOpts.x - The position of the minimap from the left of the container div (20px by default)
 * @param {Number} controlOpts.y - The position of the minimap from the bottom of the container div (20px by default)
 *
 * @returns {Object} control - graphic scale control
 */
ItMap.prototype.addGraphicScaleControl = function (controlOpts) {
    this.logger.trace("[ItMap] addGraphicScaleControl...");
    var scaleControlOptions = {};
    if (controlOpts.position) {
        scaleControlOptions.position = controlOpts.position;
    } else {
        scaleControlOptions.position = "absolute";
    }
    if (controlOpts.div) {
        scaleControlOptions.target = controlOpts.div;
    }
    var control = new itownsExtended.control.Scale(scaleControlOptions);
    this.libMap.addWidget(control);
    if (control.getElement()) {
        // hide the div if maximised option = false
        if (controlOpts.maximised === false) {
            control.getElement().style.display = "none";
        } else {
            control.getElement().style.display = "inline";
        }
        // modify the position of the scaleBar if x or y is given as option
        if (!isNaN(controlOpts.x)) {
            control.getElement().style.left = Number(controlOpts.x) + "px";
            control.getElement().style.right = "unset";
        }
        if (!isNaN(controlOpts.y)) {
            control.getElement().style.bottom = Number(controlOpts.y) + "px";
            control.getElement().style.top = "unset";
        }
    }
    return control;
};

/**
 * Adds the attributions control to to the map
 *
 * @param {Object} controlOpts - control options
 *
 * @returns {Object} control - attributions control
 */
ItMap.prototype.addAttributionsControl = function (controlOpts) {
    var attOpts = {};
    attOpts.options = {};
    if (controlOpts.div) {
        attOpts.options.target = controlOpts.div;
    }
    attOpts.options.collapsed = !controlOpts.maximised;
    var control = new itownsExtended.control.Attributions(attOpts);
    this.libMap.addWidget(control);
    return control;
};

/**
 * Adds the boostRelief control to the map
 *
 * @param {Object} controlOpts - control options
 * @param {HTMLElement} controlOpts.div - The HTML Element where the boostrelief control is put
 * @param {Boolean} controlOpts.maximised - Display or not the control
 * @param {Number} [controlOpts.x] - The position of the boostRelief button from the left of the container div
 * @param {Number} [controlOpts.y] - The position of the boostRelief button from the bottom of the container div
 * @param {Object} [controlOpts.scale] - Defines the scale used to boost the relief
 * @param {Number} [controlOpts.scale.min] - Minimum of the scale - 1 by default
 * @param {Number} [controlOpts.scale.max] - Maximum of the scale - 50 by default
 * @param {Number} [controlOpts.scale.step] - Step of the scale - 1 by default
 * @param {Number} [controlOpts.defaultBoost = 1] - Default boost value applied to the widget and the elevation layers when loaded
 *
 * @returns {Object} control - boostRelief Control
 */
ItMap.prototype.addBoostReliefControl = function (controlOpts) {
    this.logger.trace("[ItMap] addBoostReliefControl...");
    var boostReliefControlOptions = {};
    if (controlOpts.position) {
        boostReliefControlOptions.position = controlOpts.position;
    } else {
        boostReliefControlOptions.position = "absolute";
    }
    if (controlOpts.div) {
        boostReliefControlOptions.target = controlOpts.div;
    }
    if (controlOpts.scale) {
        boostReliefControlOptions.scale = controlOpts.scale;
    }
    if (controlOpts.defaultBoost) {
        boostReliefControlOptions.defaultBoost = controlOpts.defaultBoost;
    }
    var control = new itownsExtended.control.BoostRelief(boostReliefControlOptions);
    this.libMap.addWidget(control);
    if (control.getElement()) {
        // hide the div if maximised option = false
        if (controlOpts.maximised === false) {
            control.getElement().style.display = "none";
        } else {
            control.getElement().style.display = "inline";
        }
        // modify the position of the boostRelief button if x or y is given as option
        if (!isNaN(controlOpts.x)) {
            control.getElement().style.left = Number(controlOpts.x) + "px";
            control.getElement().style.right = "unset";
        }
        if (!isNaN(controlOpts.y)) {
            control.getElement().style.bottom = Number(controlOpts.y) + "px";
            control.getElement().style.top = "unset";
        }
    }
    return control;
};

/**
 * Adds the buildings control to the globe
 *
 * @param {Object} controlOpts - control options
 * @param {Boolean} controlOpts.maximised - Display or not the control
 * @param {Number} [controlOpts.x] - The position of the buildings button from the left of the container div
 * @param {Number} [controlOpts.y] - The position of the buildings button from the bottom of the container div
 * @param {HTMLElement} controlOpts.div - The HTML Element where the scalebar is put
 * @param {String} [controlOpts.key = "essentiels"] - Defines the apiKey used to add the buildings layer
 * @param {Boolean} [controlOpts.MNT = true] - adds the MNT to the globe (ELEVATION.ELEVATIONGRIDCOVERAGE.HIGHRES)
 * @param {Boolean} [controlOpts.buildingsOnGround = false] - If true, put the buildings without elevation
 * @param {Number} [controlOpts.defaultVisibility = true] - Display the building when the globe is initialized
 * @param {Number} [controlOpts.minZoom = 15] - Minimum zoom level to display the buildings.
 *
 * @returns {Object} control - buildings Control
 */
ItMap.prototype.addBuildingsControl = function (controlOpts) {
    this.logger.trace("[ItMap] addBuildingsControl...");
    var buildingsControlOptions = controlOpts;
    var control = new itownsExtended.control.Buildings(buildingsControlOptions);
    this.libMap.addWidget(control);
    if (control.getElement()) {
        // hide the div if maximised option = false
        if (buildingsControlOptions.maximised === false) {
            control.getElement().style.display = "none";
        } else {
            control.getElement().style.display = "inline";
        }
        // modify the position of the buildings button if x or y is given as option
        if (!isNaN(controlOpts.x)) {
            control.getElement().style.left = Number(controlOpts.x) + "px";
            control.getElement().style.right = "unset";
        }
        if (!isNaN(controlOpts.y)) {
            control.getElement().style.bottom = Number(controlOpts.y) + "px";
            control.getElement().style.top = "unset";
        }
    }
    return control;
};

/**
 * Removes the listed controls of the map.
 *
 * @param {Array.<String>} controlIds - A list of control's id or null.
 */
ItMap.prototype.removeControls = function (controlIds) {
    this.logger.trace("[ItMap]  : removeControls ... ");
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
            this.logger.trace("[ItMap]  : removeControls  : removing [" + controlId + "] from register.");
            this._controls.splice(idx, 1);
        }

        var itownsControl = this.getLibMapControl(controlId);

        if (!itownsControl) {
            this.logger.info("Impossible to remove control [" + controlId + "]  : not found or unhandled");
            continue;
        }

        this.logger.trace("[ItMap]  : removeControls  : removing [" + controlId + "] from Map.");
        this.libMap.removeWidget(itownsControl);
    }
};

/**
 * Returns implementation of the control
 *
 * @param {String} controlId - identifier of the control
 * @returns {Object} - implementation object of the control if it is on the map. null otherwise.
 */
ItMap.prototype.getLibMapControl = function (controlId) {
    var foundItControl = null;
    // verifications de base  : controlId est bien gere.
    if (!ItMap.CONTROLSCLASSES.hasOwnProperty(controlId.toLowerCase()) ||
        !ItMap.CONTROLSCLASSES[controlId.toLowerCase()]) {
        this.logger.trace("[ItMap] getLibMapControl  : control " + controlId + " non implémenté.");
        return foundItControl;
    }
    // on regarde du cote des controles
    var itControls = this.libMap.getWidgets();
    if (!itControls || itControls.length === 0) {
        this.logger.trace("[ItMap] getLibMapControl  : no control found on map");
        return foundItControl;
    }
    for (var j = 0; j < itControls.length; j++) {
        this.logger.trace("[ItMap] getLibMapControl  : analyzing  : " + controlId);
        // test on control Name
        if (itControls[j]._name && itControls[j]._name.toLowerCase() === controlId.toLowerCase()) {
            foundItControl = itControls[j];
            this.logger.trace("[ItMap] getLibMapControl  : found GP Plugin Control ! ");
            break;
        }
    }
    if (!foundItControl) {
        this.logger.trace("[ItMap] getLibMapControl  : control " + controlId + " not found ! ");
    }

    return foundItControl;
};

/**
 * Gets Layer Container div ID for a given layerId.
 *
 * @param {String} layerId - layer identifier
 * @returns {String} - Layer Container div Id in the LayerSwitcher
 */
ItMap.prototype.getLSLayerContainerDivId = function (layerId) {
    var id = null;
    var idxLS = this._findRegisteredControl("layerswitcher");
    if (idxLS < 0) {
        this.logger.trace("[ItMap] : getLSLayerContainerDivId : no layerswitcher on map !");
        return id;
    }
    var itlayers = this._getLayersObj([layerId]);
    if (itlayers && itlayers.length > 0) {
        var itLayerList = this._controls[idxLS].obj._layerListContainer;
        if (itLayerList) {
            var divId = itLayerList.id;
            var uid = divId.substring(divId.indexOf("-"));
            if (itLayerList.childNodes) {
                for (var layerDivKey = 0; layerDivKey < itLayerList.childNodes.length; layerDivKey++) {
                    if (itLayerList.childNodes[layerDivKey].id === "GPlayerSwitcher_ID_" + layerId + uid) {
                        var foundId = "GPlayerSwitcher_ID_" + layerId + uid;
                        return foundId;
                    }
                }
            }
        }
    }
    this.logger.trace("[ItMap] : getLSLayerContainerDivId : layer [" + layerId + "] not found on map !");
    return id;
};
