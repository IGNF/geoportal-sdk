import { ItMap } from "./ItMapBase";
import { IMap } from "../Interface/IMap";

/**
 * Proprietes observables des couches pour le SDK
 */
ItMap.LAYERPROPERTIES = {
    visible : "visibility",
    opacity : "opacity",
    sequence : "position"
};

/**
 * Removes of the map the layers given as parameters
 *
 * @param {Array.<String>} layerIds - A list of layer's id or null.
 */
ItMap.prototype.removeLayers = function (layerIds) {
    if (!IMap.prototype.removeLayers.apply(this, arguments)) {
        return;
    }
    if (!Array.isArray(layerIds)) {
        layerIds = [layerIds];
    }
    // ici on sait que layerIds est un tableau
    layerIds.forEach(function (_layerId) {
        if (this._getLayersObj(_layerId) && Array.isArray(this._getLayersObj(_layerId)) && this._getLayersObj(_layerId).length > 0) {
            this.libMap.removeLayer(_layerId);
        } else {
            this.logger.info("[ItMap]  : Impossible to remove " + _layerId + " - not Found");
        }
    },
    this);
};

/**
 * Modifies the listed layers'options of the map
 *
 * @param {Object} layersOptions - Layers to add to the map and their options. Associative array mapping official name of the Geoportal layer or the id of a personal layer (keys) with their properties (values given as {@link Gp.LayerOptions}).
 */
ItMap.prototype.modifyLayers = function (layersOptions) {
    if (!IMap.prototype.modifyLayers.apply(this, arguments)) {
        return;
    }
    var layerIds = Object.keys(layersOptions);
    // on recupere les objets correspondants dejà sur la carte
    var _layerObjs = this._getLayersObj(layerIds);
    _layerObjs.forEach(function (_layerObj) {
        this.logger.trace("[IMap] modifyLayers  : modifying  : [" + _layerObj.id + "]");
        // traduction options ahn => options ItMap
        var commonOpts = this._applyCommonLayerParams(layersOptions[_layerObj.id]);
        // application des options IT aux couches IT
        // l'objet _layerObj.options sera mis à jour par le mécanisme des evenements.
        if (commonOpts.hasOwnProperty("opacity")) {
            this.logger.trace("[IMap] modifyLayers  : setting opacity of  : [" + _layerObj.id + "] to  : " + commonOpts.opacity);
            this.libMap.setLayerOpacity(_layerObj.id, commonOpts.opacity);
        }
        if (commonOpts.hasOwnProperty("visible")) {
            this.logger.trace("[IMap] modifyLayers  : setting visible of  : [" + _layerObj.id + "] to  : " + commonOpts.visible);
            this.libMap.setLayerVisibility(_layerObj.id, commonOpts.visible);
        }
        if (commonOpts.hasOwnProperty("zIndex")) {
            this.logger.trace("[IMap] modifyLayers  : setting zIndex of  : [" + _layerObj.id + "] to  : " + commonOpts.zIndex);
            this.libMap.moveLayerToIndex(_layerObj.id, commonOpts.zIndex);
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
    this);
};

/**
 * Finds the layerOpts object corresponding to the IT layer
 *
 * @param {String} layerId - layer id
 * @param {Object[]} layersStack - list of layers
 * @returns {Object} layerOpts - layer options
 *
 * @private
 */
ItMap.prototype._getLayerOpts = function (layerId, layersStack) {
    var layerOpts = null;
    layersStack = layersStack || this._layers;
    for (var i = 0; i < layersStack.length; i++) {
        var l = layersStack[i];
        if (l.id === layerId) {
            this.logger.trace("[ItMap]  : found layer  : " + l.id);
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
 * @param {Object} layerObj -  IT layer
 * @returns {Object} - new layer index in this._layers
 *
 * @private
 */
ItMap.prototype._registerUnknownLayer = function (layerObj) {
    // couches de résultat (itineraire, isochrone)
    /* var layerId = "unknownLayer" ;
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
    layerOpts[layerId] = {} ; */

    return {};
};

/**
 * Gets layer parameterss from IT layer params
 * opacity, visibility, sequence
 *
 * @param {Object} itlayerOpts - options of the layer
 * @returns {Gp.LayerOptions} - object with common options
 *
 * @private
 */
ItMap.prototype._getCommonLayerParams = function (itlayerOpts) {
    var commonOpts = {};
    this.logger.trace("[ItMap] : _getCommonLayerParams ");
    if (itlayerOpts.hasOwnProperty("opacity")) {
        this.logger.trace("[ItMap] : _getCommonLayerParams - opacity : " + itlayerOpts.opacity);
        commonOpts.opacity = itlayerOpts.opacity;
    }
    if (itlayerOpts.hasOwnProperty("visible")) {
        this.logger.trace("[ItMap] : _getCommonLayerParams - visibility : " + itlayerOpts.visible);
        commonOpts.visibility = itlayerOpts.visible;
    }
    if (itlayerOpts.hasOwnProperty("sequence")) {
        this.logger.trace("[ItMap] : _getCommonLayerParams - position : " + itlayerOpts.sequence);
        commonOpts.position = itlayerOpts.sequence;
    }

    return commonOpts;
};

/**
 * Applies params common to all kind of layers  :
 * opacity, visibility, minZoom, maxZoom
 *
 * @param {Gp.LayerOptions} layerOpts - options of the layer
 * @returns {Object} a itowns Layer constructor options object
 *
 * @private
 */
ItMap.prototype._applyCommonLayerParams = function (layerOpts) {
    var commonOpts = {};
    this.logger.trace("[ItMap]  : _applyCommonLayerParams ");
    if (layerOpts.hasOwnProperty("opacity")) {
        this.logger.trace("[ItMap]  : _applyCommonLayerParams - opacity  : " + layerOpts.opacity);
        commonOpts.opacity = layerOpts.opacity;
    }
    if (layerOpts.hasOwnProperty("visibility")) {
        this.logger.trace("[ItMap]  : _applyCommonLayerParams - visibility  : " + layerOpts.visibility);
        commonOpts.visible = layerOpts.visibility;
    }
    if (layerOpts.hasOwnProperty("position")) {
        this.logger.trace("[ItMap]  : _applyCommonLayerParams - position  : " + layerOpts.position);
        commonOpts.zIndex = layerOpts.position;
    }
    /* TODO à compléter
    if (layerOpts.hasOwnProperty("maxZoom") &&
        layerOpts.maxZoom >= 0 &&
        layerOpts.maxZoom <= 20 ) {
        var minRes = this._getResolutionFromZoomLevel(layerOpts.maxZoom) ;
        this.logger.trace("[Ol]  : _applyCommonLayerParams - minRes  : " + minRes) ;
        commonOpts.minResolution = minRes ;
    }
    if (layerOpts.hasOwnProperty("minZoom") &&
        layerOpts.minZoom >= 0 &&
        layerOpts.minZoom <= 20 ) {
        var maxRes = this._getResolutionFromZoomLevel(layerOpts.minZoom) ;
        this.logger.trace("[Ol]  : _applyCommonLayerParams - maxRes  : " + maxRes) ;
        commonOpts.maxResolution = maxRes ;
    } */

    return commonOpts;
};

/**
  * Retrieves max TMSLimits with its id
  *
  * @param {String} TMSID - Id of the tileMatrixSet
  * @returns {Object} TMSLimits - limits of the tileMatrixSet
  *
  * @private
  */
ItMap.prototype._getTMSLimits = function (TMSID) {
    var TMSlimits;
    if (TMSID === "PM") {
        TMSlimits = {
            0 : {
                minTileRow : "0",
                maxTileRow : "1",
                minTileCol : "0",
                maxTileCol : "1"
            },
            1 : {
                minTileRow : "0",
                maxTileRow : "2",
                minTileCol : "0",
                maxTileCol : "2"
            },
            2 : {
                minTileRow : "0",
                maxTileRow : "4",
                minTileCol : "0",
                maxTileCol : "4"
            },
            3 : {
                minTileRow : "0",
                maxTileRow : "8",
                minTileCol : "0",
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
    if (TMSID === "WGS84G") {
        TMSlimits = {
            0 : {
                minTileRow : 0,
                maxTileRow : 1,
                minTileCol : 0,
                maxTileCol : 2
            },
            1 : {
                minTileRow : 0,
                maxTileRow : 2,
                minTileCol : 0,
                maxTileCol : 4
            },
            2 : {
                minTileRow : 0,
                maxTileRow : 4,
                minTileCol : 0,
                maxTileCol : 8
            },
            3 : {
                minTileRow : 0,
                maxTileRow : 8,
                minTileCol : 0,
                maxTileCol : 16
            },
            4 : {
                minTileRow : 0,
                maxTileRow : 16,
                minTileCol : 0,
                maxTileCol : 32
            },
            5 : {
                minTileRow : 0,
                maxTileRow : 32,
                minTileCol : 0,
                maxTileCol : 64
            },
            6 : {
                minTileRow : 0,
                maxTileRow : 64,
                minTileCol : 0,
                maxTileCol : 128
            },
            7 : {
                minTileRow : 0,
                maxTileRow : 128,
                minTileCol : 0,
                maxTileCol : 256
            },
            8 : {
                minTileRow : 0,
                maxTileRow : 256,
                minTileCol : 0,
                maxTileCol : 512
            },
            9 : {
                minTileRow : 0,
                maxTileRow : 512,
                minTileCol : 0,
                maxTileCol : 1024
            },
            10 : {
                minTileRow : 0,
                maxTileRow : 1024,
                minTileCol : 0,
                maxTileCol : 2048
            },
            11 : {
                minTileRow : 0,
                maxTileRow : 2048,
                minTileCol : 0,
                maxTileCol : 4096
            },
            12 : {
                minTileRow : 0,
                maxTileRow : 4096,
                minTileCol : 0,
                maxTileCol : 8192
            },
            13 : {
                minTileRow : 0,
                maxTileRow : 8192,
                minTileCol : 0,
                maxTileCol : 16384
            },
            14 : {
                minTileRow : 0,
                maxTileRow : 16384,
                minTileCol : 0,
                maxTileCol : 32768
            },
            15 : {
                minTileRow : 0,
                maxTileRow : 32768,
                minTileCol : 0,
                maxTileCol : 65536
            },
            16 : {
                minTileRow : 0,
                maxTileRow : 65536,
                minTileCol : 0,
                maxTileCol : 131072
            },
            17 : {
                minTileRow : 0,
                maxTileRow : 131072,
                minTileCol : 0,
                maxTileCol : 262144
            }
        };
        return TMSlimits;
    }
    this.logger.trace("[ItMap]  : no TMS Limits found for this TMS id");
};

/**
 * Adds the markers to _markers array
 *
 * @param {Array.<Gp.MarkerOptions>} markersOptions - Markers to save in the _markers array
 * @private
 */
ItMap.prototype._addMarkers = function (markersOptions) {
    this.logger.trace("[ItMap] : _addMarkers");
    if (!Array.isArray(markersOptions)) {
        this.logger.info("Can not process markersOptions. It is not an Array.");
        return;
    }
    var mo = null;
    var ii = 0;
    for (ii = 0; ii < markersOptions.length; ii++) {
        mo = markersOptions[ii];
        // update _markers array with the marker options saved in case of switch to 2D
        this._markers.push(mo);
    }
};

/**
 * Empties _markers array
 *
 * @private
 */
ItMap.prototype._removeMarkers = function () {
    // empty overlays SDK array
    this._markers = [];
};

/**
 * Gets the markers options saved in _markers array
 *
 */
ItMap.prototype.getMarkersOptions = function () {
    return this._markers;
};

/**
 * Replaces the overlays already saved in _markers with the given markersOptions
 *
 * @param {Array.<Gp.MarkerOptions>} markersOptions - Markers to add to the Map.
 */
ItMap.prototype.setMarkersOptions = function (markersOptions) {
    // 1 - remove all current overlays
    this._removeMarkers();
    // 2 - add specified overlays
    this._addMarkers(markersOptions);
};