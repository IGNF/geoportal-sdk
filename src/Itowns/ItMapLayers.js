import { ItMap } from "./ItMapBase";
import { IMap } from "../Interface/IMap";
import {
    Extent,
    WMSSource,
    WMTSSource,
    FileSource,
    VectorTilesSource,
    ElevationLayer,
    ColorLayer,
    Fetcher,
    KMLParser,
    GeoJsonParser,
    GpxParser
} from "itowns";

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

/* Adds a vector Layer to the map
 *
 * @param {Object} layerObj - geoportalLayer to add.
 * @param {Gp.LayerOptions} layerObj.geoportalLayerID - options of the layer
 *
 * @private
 */
ItMap.prototype._addVectorLayer = function (layerObj) {
    // FIXME : ajout d'un parametre projection pour les donnees
    var layerId = Object.keys(layerObj)[0];
    var layerOpts = layerObj[layerId];
    var layer = {};
    var layerStyleOptions = layerOpts.styleOptions || {};
    var defaultMapOptions = this.mapOptions.defaultFeaturesStyle || {};
    var defaultOptions = IMap.DEFAULT_VECTORLAYERS_STYLES;
    layerOpts.format = layerOpts.format.toLowerCase();
    switch (layerOpts.format.toUpperCase()) {
        case "KML":
            this.logger.trace("ajout d'une couche KML");
            layer.source = new FileSource({
                url : layerOpts.url,
                crs : "EPSG:4326",
                fetcher : Fetcher.xml,
                parser : KMLParser.parse
            });
            // extractStyles from layerOpts is prioritary (if true, itowns will automatically retrieve the KML style)
            if (layerOpts.extractStyles === false) {
                layer.style = {
                    fill : {
                        color : layerStyleOptions.polyFillColor || defaultMapOptions.polyFillColor || defaultOptions.polyFillColor,
                        opacity : layerStyleOptions.polyFillOpacity || defaultMapOptions.polyFillOpacity || defaultOptions.polyFillOpacity
                    },
                    stroke : {
                        color : layerStyleOptions.strokeColor || defaultMapOptions.strokeColor || defaultOptions.strokeColor,
                        opacity : layerStyleOptions.strokeOpacity || defaultMapOptions.strokeOpacity || defaultOptions.strokeOpacity,
                        width : layerStyleOptions.strokeWidth || defaultMapOptions.strokeWidth || defaultOptions.strokeWidth
                    }
                };
            }
            break;
        case "GEOJSON":
            this.logger.trace("ajout d'une couche GEOJSON");
            layer.source = new FileSource({
                url : layerOpts.url,
                crs : "EPSG:4326",
                fetcher : Fetcher.json,
                parser : GeoJsonParser.parse
            });

            layer.style = {
                fill : {
                    color : layerStyleOptions.polyFillColor || defaultMapOptions.polyFillColor || defaultOptions.polyFillColor,
                    opacity : layerStyleOptions.polyFillOpacity || defaultMapOptions.polyFillOpacity || defaultOptions.polyFillOpacity
                },
                stroke : {
                    color : layerStyleOptions.strokeColor || defaultMapOptions.strokeColor || defaultOptions.strokeColor,
                    opacity : layerStyleOptions.strokeOpacity || defaultMapOptions.strokeOpacity || defaultOptions.strokeOpacity,
                    width : layerStyleOptions.strokeWidth || defaultMapOptions.strokeWidth || defaultOptions.strokeWidth
                },
                point : {
                    color : layerStyleOptions.pointColor || defaultMapOptions.pointColor || defaultOptions.pointColor,
                    opacity : layerStyleOptions.pointOpacity || defaultMapOptions.pointOpacity || defaultOptions.pointOpacity,
                    radius : layerStyleOptions.pointRadius || defaultMapOptions.pointRadius || defaultOptions.pointRadius
                }
            };

            break;
        case "GPX":
            this.logger.trace("ajout d'une couche GPX");
            layer.source = new FileSource({
                url : layerOpts.url,
                crs : "EPSG:4326",
                fetcher : Fetcher.xml,
                parser : GpxParser.parse
            });
            layer.visible = (layerOpts.visibility === undefined) ? true : layerOpts.visibility;
            layer.opacity = (layerOpts.opacity === undefined) ? 1 : layerOpts.opacity;
            layer.style = {
                stroke : {
                    color : layerStyleOptions.strokeColor || defaultMapOptions.strokeColor || defaultOptions.strokeColor,
                    opacity : layerStyleOptions.strokeOpacity || defaultMapOptions.strokeOpacity || defaultOptions.strokeOpacity,
                    width : layerStyleOptions.strokeWidth || defaultMapOptions.strokeWidth || defaultOptions.strokeWidth
                }
            };
            break;
        case "GEORSS":
            // TODO GeoRSS
            break;
        case "WFS":
            // TODO ???
            break;
        case "DRAWING":
            // TODO ??
            break;
        default:
            break;
    }

    // le controle geoportalAttribution exploite la propriete _originators
    if (layerOpts.hasOwnProperty("originators")) {
        layer._originators = layerOpts.originators;
    }

    // Dans le cas où aucune visibilité n'est spécifiée
    if (!layerOpts.hasOwnProperty("visibility") || typeof layerOpts.visibility === "undefined") {
        // on la règle à "true" par défaut
        layerOpts.visibility = true;
    }

    this._layers.push({
        id : layerId,
        obj : layer,
        options : layerOpts
    });

    var LSControl = this.getLibMapControl("layerswitcher");
    // if the LS already exists, we have to save the conf of the layer to add it to the LS
    if (LSControl) {
        LSControl._addedLayerConf[layerId] = layerOpts;
    }

    // we add the layer and refresh the itowns viewer
    // this will launch the addedLayer callback (dans "ItMap._onLayerChanged")

    var vectorLayerOptions = {
        name : layer.id,
        transparent : true,
        crs : "EPSG:4326",
        source : layer.source
    };

    if (layer.style) {
        vectorLayerOptions.style = layer.style;
    }

    var vectorLayer = new ColorLayer(layerId, vectorLayerOptions);

    this.libMap.getGlobeView().addLayer(vectorLayer);
};

/* Adds a Raster Layer to the map
 *
 * @param {Object} layerObj - raster layer to add.
 * @param {Gp.LayerOptions} layerObj.geoportalLayerID - options of the layer
 *
 * @private
 */
ItMap.prototype._addRasterLayer = function (layerObj) {
    var layerId = Object.keys(layerObj)[0];
    var layerOpts = layerObj[layerId];
    var layerNames;

    var boundingBox;
    // itowns needs a bbox to display the layer
    // if the layer is in PM, the bbox needs to be in planar coordinates
    if (layerOpts.bbox && layerOpts.projection === "EPSG:3857") {
        boundingBox = new Extent("EPSG:4326", layerOpts.bbox.left, layerOpts.bbox.right, layerOpts.bbox.bottom, layerOpts.bbox.top).as(layerOpts.projection);
    } else if (layerOpts.bbox && layerOpts.projection === "EPSG:4326") {
        boundingBox = new Extent(layerOpts.projection, layerOpts.bbox.left, layerOpts.bbox.right, layerOpts.bbox.bottom, layerOpts.bbox.top);
    } else if (!layerOpts.bbox && layerOpts.projection === "EPSG:3857") {
        // world bbox in PM (EPSG:3857)
        boundingBox = new Extent(layerOpts.projection, -20026376.39, 20026376.39, -20048966.10, 20048966.10);
    } else {
        // world bbox in WGS84 (EPSG:4326)
        boundingBox = new Extent("EPSG:4326", -180, 180, -90, 90);
    }

    layerOpts.format = layerOpts.format.toLowerCase();
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

            var layer = {};

            layer.type = "color";
            layer.id = layerId;
            layer.title = (layerOpts.title === undefined) ? layerId : layerOpts.title;
            layer.visible = (layerOpts.visibility === undefined) ? true : layerOpts.visibility;
            layer.opacity = (layerOpts.opacity === undefined) ? 1 : layerOpts.opacity;

            if (layerOpts.minZoom) {
                layer.maxScaleDenominator = this._getResolutionFromZoomLevel(layerOpts.minZoom) / 0.00028;
            }
            if (layerOpts.maxZoom) {
                layer.minScaleDenominator = this._getResolutionFromZoomLevel(layerOpts.maxZoom) / 0.00028;
            }

            // itowns only handles EPSG:4326 and EPSG:3857
            if (!layerOpts.projection || (layerOpts.projection.toUpperCase() !== "EPSG:4326" && layerOpts.projection.toUpperCase() !== "EPSG:3857")) {
                // EPSG:4326 by default
                layerOpts.projection = "EPSG:4326";
            } else {
                // iTowns is case sensitive
                layerOpts.projection = layerOpts.projection.toUpperCase();
            }

            layer.source = new WMSSource({
                protocol : layerOpts.format,
                version : layerOpts.version || "1.3.0",
                url : layerOpts.url,
                name : layerNames,
                crs : layerOpts.projection,
                style : layerOpts.styleName || "",
                heightMapWidth : 256,
                transparent : true,
                waterMask : false,
                featureInfoMimeType : "",
                dateTime : "",
                networkOptions : {
                    crossOrigin : "omit"
                },
                updateStrategy : {
                    type : 0,
                    options : {}
                },
                format : layerOpts.outputFormat,
                zoom : {
                    min : layerOpts.minZoom || 1,
                    max : layerOpts.maxZoom || 21
                },
                extent : boundingBox
            });
            break;
        case "WMTS" :
            this.logger.trace("ajout d'une couche WMTS");
            // chargement des options par defaut
            var lOpts = this._getWMTSDefaultOpts();
            // surcharge avec les options utilisateurs
            for (var opt in layerOpts) {
                lOpts[opt] = layerOpts[opt];
            }

            layerOpts = lOpts;
            if (!layerOpts.tileMatrixSetLimits) {
                layerOpts.tileMatrixSetLimits = this._getTMSLimits(layerOpts.tileMatrixSet);
            }

            layer = {};
            layer.type = "color";
            layer.id = layerId;
            layer.title = (layerOpts.title === undefined) ? layerId : layerOpts.title;
            layer.visible = (layerOpts.visibility === undefined) ? true : layerOpts.visibility;
            layer.opacity = (layerOpts.opacity === undefined) ? 1 : layerOpts.opacity;

            // set min and max zoom regarding the layerOpts and the TMS Limits
            var minZoom, maxZoom;
            if (layerOpts.minZoom && layerOpts.maxZoom) {
                minZoom = layerOpts.minZoom;
                maxZoom = layerOpts.maxZoom;
            } else if (layerOpts.minZoom && !layerOpts.maxZoom) {
                minZoom = layerOpts.minZoom;
                maxZoom = Math.max.apply(null, (Object.keys(layerOpts.tileMatrixSetLimits).map(Number)));
            } else if (!layerOpts.minZoom && layerOpts.maxZoom) {
                minZoom = Math.min.apply(null, (Object.keys(layerOpts.tileMatrixSetLimits).map(Number)));
                maxZoom = layerOpts.maxZoom;
            } else {
                minZoom = Math.min.apply(null, (Object.keys(layerOpts.tileMatrixSetLimits).map(Number)));
                maxZoom = Math.max.apply(null, (Object.keys(layerOpts.tileMatrixSetLimits).map(Number)));
            }

            // compute max and minScaleDenominator
            layer.maxScaleDenominator = this._getResolutionFromZoomLevel(minZoom) / 0.00028;
            layer.minScaleDenominator = this._getResolutionFromZoomLevel(maxZoom) / 0.00028;

            layer.updateStrategy = {};
            // depends on the levelsToLoad option
            if (layerOpts.levelsToLoad) {
                layer.updateStrategy = {
                    type : 0,
                    options : {
                        groups : layerOpts.levelsToLoad
                    }
                };
            } else {
                layer.updateStrategy = {
                    type : 0,
                    options : {}
                };
            };

            // itowns only handles EPSG:4326 and EPSG:3857
            if (!layerOpts.projection || (layerOpts.projection.toUpperCase() !== "EPSG:4326" && layerOpts.projection.toUpperCase() !== "EPSG:3857")) {
                // EPSG:4326 by default
                layerOpts.projection = "EPSG:4326";
            } else {
                // iTowns is case sensitive
                layerOpts.projection = layerOpts.projection.toUpperCase();
            }

            layer.source = new WMTSSource({
                protocol : layerOpts.format.toLowerCase(),
                version : layerOpts.version,
                url : layerOpts.url,
                projection : layerOpts.projection,
                networkOptions : {
                    crossOrigin : "omit"
                },
                tileMatrixSet : layerOpts.tileMatrixSet,
                tileMatrixSetLimits : layerOpts.tileMatrixSetLimits,
                format : layerOpts.outputFormat,
                name : layerOpts.layer,
                style : layerOpts.styleName,
                zoom : {
                    min : minZoom || 1,
                    max : maxZoom || 21
                },
                extent : boundingBox
            });
            break;
        default :
    }
    if (layer) {
        // le controle geoportalAttribution exploite la propriete options.originators
        if (layerOpts.hasOwnProperty("originators")) {
            layer.source.attribution = layerOpts.originators;
        }

        // Dans le cas où aucune opacité n'est spécifiée
        if (!layerOpts.hasOwnProperty("opacity") || typeof layerOpts.opacity === "undefined") {
            // on la règle à 1 par défaut
            layerOpts.opacity = 1;
        }

        // Dans le cas où aucune visibilité n'est spécifiée
        if (!layerOpts.hasOwnProperty("visibility") || typeof layerOpts.visibility === "undefined") {
            // on la règle à "true" par défaut
            layerOpts.visibility = true;
        }

        // on met à jour le tableau des couches
        this._layers.push({
            id : layerId,
            options : layerOpts,
            obj : layer
        });
        if (layerOpts.type && layerOpts.type.toUpperCase() === "ELEVATION") {
            layer.type = "elevation";
            // we add the noDataValue if it is given
            if (layerOpts.noDataValue) {
                layer.noDataValue = layerOpts.noDataValue;
            }
        } else {
            var LSControl = this.getLibMapControl("layerswitcher");
            // if the LS already exists, we have to save the conf of the layer to add it to the LS
            if (LSControl) {
                LSControl._addedLayerConf[layerId] = layerOpts;
            }
        }
        // we add the layer and refresh the itowns viewer
        // this will launch the addedLayer callback (dans "ItMap._onLayerChanged")
        switch (layer.type.toUpperCase()) {
            case "ELEVATION" :
                this.libMap.getGlobeView().addLayer(new ElevationLayer(layer.id, layer));
                break;
            case "COLOR" :
                this.libMap.getGlobeView().addLayer(new ColorLayer(layer.id, layer));
                break;
            default :
        };
    }
};

/**
 * Adds a mapbox Layer to the globe
 *
 * @param {Object} layerObj - vectorLayer layer to add.
 * @param {Gp.LayerOptions} layerObj.geoportalLayerID - options of the layer
 *
 * @private
 */
ItMap.prototype._addMapBoxLayer = function (layerObj) {
    var layerId = Object.keys(layerObj)[0];
    var layerOpts = layerObj[layerId];

    // si les mapbox options ne sont pas données par les options de la couche,
    // on crée quand même la propriété
    if (!layerOpts.hasOwnProperty("mapboxOptions") || typeof layerOpts.mapboxOptions === "undefined") {
        layerOpts.mapboxOptions = {};
    }

    // déclaration des variables style par défaut
    var _url;
    var _thumbnail;
    var _name;
    var _description;

    var _urlDefaultOrSelected = layerOpts.url;

    /* Gestion de l'url selectionnée :
    // Les options nous donnent l'url du style par defaut.
    // Mais, il faut aussi gerer le cas où un theme est sélectionné via les options,
    // car c'est bien l'url du style (ou theme) sélectionné qui doit être utilisé par la suite !
    // De plus, on recherche si le style par defaut a été placé dans la liste des themes.
    // Si le style par defaut n'existe pas dans la liste des themes, on l'ajoute pour simplifier
    // les traitements ulterieurs...
    */
    if (Array.isArray(layerOpts.styles)) {
        var foundDefaultStyle = false; // recherche du style par defaut
        var foundSelectedStyle = false; // recherche du theme sélectionné

        for (var i = 0; i < layerOpts.styles.length; i++) {
            var t = layerOpts.styles[i];
            // algo assez simpliste... car on compare juste les urls
            // mais les urls devraient être uniques...
            if (t.url === layerOpts.url) {
                // le theme par defaut est dans la liste,
                // on prend donc en compte les valeurs
                // "name", "thumbnail", "url", "description" de la liste des
                // themes (à defaut des options "defaultStyle*") !
                foundDefaultStyle = true;
            }
            if (t.selected) {
                // l'url selectionnée devient l'url par defaut
                _urlDefaultOrSelected = t.url;
                foundSelectedStyle = true;
            }
        }

        // le style par defaut n'est pas dans la liste, alors on l'ajoute dans
        // dans la liste des themes...
        if (!foundDefaultStyle) {
            _url = layerOpts.url;
            _thumbnail = layerOpts.defaultStyleThumbnail || null;
            _name = layerOpts.defaultStyleName || "Style par défaut";
            _description = layerOpts.defaultStyleDescription || "Style par défaut";
            layerOpts.styles.unshift({
                thumbnail : _thumbnail,
                name : _name,
                url : _url,
                description : _description,
                selected : !foundSelectedStyle
            });
        }
    } else {
        // pas de styles spécifiés en options : nous ajouton l'url de la couche comme style par défaut
        // en réglant le paramètre "selected" à true (seul style, donc selectionné)
        _url = layerOpts.url;
        _thumbnail = layerOpts.defaultStyleThumbnail || null;
        _name = layerOpts.defaultStyleName || "Style par défaut";
        _description = layerOpts.defaultStyleDescription || "Style par défaut";
        layerOpts.styles = [
            {
                thumbnail : _thumbnail,
                name : _name,
                url : _url,
                description : _description,
                selected : true
            }
        ];
    }
    // Ajout couche Vecteur tuilé par itowns (fx: 2.5 => transparent)
    var vectorTileSourceOpts = {
        style : _urlDefaultOrSelected,
        // filter : function (layer) {
        //     // Array.includes() -> pas compatibilité IE 11 !
        //     return ["fill", "line"].includes(layer.type);
        // },
        zoom : {
            min : 2,
            max : 16
        }
    };

    if (layerOpts.sprite) {
        vectorTileSourceOpts.sprite = layerOpts.sprite;
    }
    var vectorTileSource = new VectorTilesSource(vectorTileSourceOpts);

    var vectorTileLayer = {};

    vectorTileLayer = new ColorLayer(layerId, {
        // FIXME wait for next itowns release to remove this
        isValidData : function () {
            return false;
        },
        noTextureParentOutsideLimit : true,
        labelEnabled : layerOpts.showLabels || true,
        source : vectorTileSource
    });

    // definition de l'opacité et de la visibilité de la couche
    vectorTileLayer.visible = (layerOpts.visibility === undefined) ? true : layerOpts.visibility;
    vectorTileLayer.opacity = (layerOpts.opacity === undefined) ? 1 : layerOpts.opacity;

    var LSControl = this.getLibMapControl("layerswitcher");
    // if the LS already exists, we have to save the conf of the layer to add it to the LS
    if (LSControl) {
        LSControl._addedLayerConf[layerId] = layerOpts;
    }

    // on met à jour le tableau des couches
    this._layers.push({
        id : layerId,
        options : layerOpts,
        obj : vectorTileLayer
    });

    this.libMap.getGlobeView().addLayer(vectorTileLayer);
};

/**
 * Adds a geoportal Layer to the map
 *
 * @param {Object} layerObj - geoportalLayer to add.
 * @param {Object} layerConf - layer configuration.
 * @param {Gp.LayerOptions} layerObj.geoportalLayerID - options of the layer
 *
 * @private
 */
ItMap.prototype._addGeoportalLayer = function (layerObj, layerConf) {
    // FIXME à faire ailleurs
    var layerId = Object.keys(layerObj)[0];
    // FIXME verrue pour gestion projection MNT = IGNF:WGS84 dans autoconf...
    // itowns ne gere que 3857 et 4326
    if (layerConf && layerConf.defaultProjection !== "EPSG:3857") {
        layerConf.defaultProjection = "EPSG:4326";
    }
    // Si on a bien un objet layerConf passé, on ajoute les params spécifiques iTowns
    if (layerConf) {
        layerObj[layerId].url = layerConf.getServerUrl(layerConf.apiKeys[0]);
        layerObj[layerId].outputFormat = layerObj[layerId].outputFormat || layerConf.getDefaultFormat();
        layerObj[layerId].projection = layerObj[layerId].projection || layerConf.defaultProjection;
        layerObj[layerId].bbox = layerObj[layerId].bbox || layerConf.globalConstraint.bbox;
        // Paramètres spécifiques aux couches WMS pour ajout avec iTowns
        if (layerObj[layerId].format === "WMS") {
            layerObj[layerId].version = layerObj[layerId].version || layerConf.serviceParams.version;
            layerObj[layerId].stylesName = layerObj[layerId].stylesName || layerConf.styles;
        }
        // Paramètres spécifiques aux couches WMTS pour ajout avec iTowns
        if (layerObj[layerId].format === "WMTS") {
            layerObj[layerId].tileMatrixSet = layerObj[layerId].tileMatrixSet || layerConf.getTMSID();
            layerObj[layerId].tileMatrixSetLimits = layerObj[layerId].tileMatrixSetLimits || layerConf.wmtsOptions.tileMatrixSetLimits;
            layerObj[layerId].layer = layerId || layerConf.getName();
            layerObj[layerId].styleName = layerObj[layerId].styleName || layerConf.getStyles()[0].name;
        }
    }
    // Ajout de la couche avec iTowns via l'interface du SDK
    this._addRasterLayer(layerObj);
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
 * @returns {Array} - markers array
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
