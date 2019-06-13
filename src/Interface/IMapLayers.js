import { IMap } from "./IMapBase";

/**
 * Options par défaut des styles des couches vecteur (KML, GPX, GeoJSON)
 * @private
 */
IMap.DEFAULT_VECTORLAYERS_STYLES = {
    markerSrc : "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAARDSURBVFiF3ZndaxxVGMZ/Z/YjX00Nadpo1qrFBgu56D9QbAtiLoRC7ywSNK1NURRREBKRFlSwFBW0gnSrJXY1CmISgyjFiyYSFC9ajE3MmpjdjWlMUtNos9lN9mteLzbRuCbZmTMTBB+Yi51znvd5n3nPnjnnjBIR/i/wuh4xpCpI0ojiENAA1AE1wCzwKzCE0EM5l2iShJvSyrXKnFVb8dOK4hmg3AIjifAmaU7ztMy7kYI7Zs6rQwjvka+AXcyiOMZx6XGahuE0AEHVitCFnhGAGoQugqrVaSrOKpNP4FWnSaxCGy1yWpesbyY/tLpwo7p/w0RxWHfI6Zk5q7ZSwhj6Q2sjzJLiXp1JQe+p+mllc4wA1CzHtw37lQmpCha5gbXpVxdJythh9z1kvzJJGrFixPBmOXixl+Z4mONmguZ4mIMXezG8WQsq5cs6tmDfTP7NXiSqN0vTzBD1TQfwbdmDUhX4tuyhvukATTNDlgxZ0SmUtUsgv0TZGPsv9FNSvXfNtpLqvey/0O+KTgF0zNQV7XHP4dsdtVvVKYCOmeqiPbwVOx21W9UpgI6ZWNEe2cSEo3arOgWwb0YYLp5G17Sjdqs6BdCZzYqL9B3dR2puYM221NwAfUf3uaJTAB0zaye5GmbWS6i2gdFQL5mFMCIJMgthRkO9hGobMLPFN4VWdAoptlcAQeUDRoG77YrZwDhQT4tk7JDsV6ZFMggv2+bZwyt2jYDuQnOa94GIFrc4IkzRrkPUM3NKsijatLjF0copsbJ++xec7TTPqw6EI/oB/glT+PC+13Y/aSQNv/Is+tNer09lMn7DMHwAYppp8fvTIpISkVQsFrslqww4M9OuqkgzANzl1MhCyrjZGAycm573pK1yFCyi5FoWvo/FYlPOT2fOqftRXMbB9lkEs+3zbe2f/FD5i3YMj2p3vn8/IV8DZ5yE+Gqkot+JEQCPada5dRhxEriiQ5ya90w+272916F+KpnJDLhjpkUy5HgESNqhZU2Vfr5ne+dSFtOBeso06J6cnEy6d0z0hPwEPGeH8sGVykvfjpfe1NZUci2+mHg7Go2G8z/d/goQVJ9B8S1veMYffujduo/thl+ZwUzDuBqJRGZWt7n/FcDH46lFNVLilar1uiTTxsJTnTssH/QpJVlMNQa5wbGJiWERya3Vz30zzfLb3OveY3dU5j5dp4e80Xdbd3TOu/H/yyAtpjnqgeGS8crRQRks+v5xf5gtY/KM/6NAVebhwvv90bLvHu2o/XId2pJSMmIaxo/RaHRMxN6yZtPM0K5K/7hl/FxVZgZWbs0mPDceeKcuGE95/kpSKUmaImHDNIfHrl+PiIj2zOb+MFvBY7IUOVl2ZG9g6bJH4ckJuRe/2NYZT3myKIkrGM4pNRyLjY+LW09URDb1+uaF0pfm3zJ+7zhRGdq1c9eDuwOBOzdLa/OG2X+APwE8DU64Y/5gfAAAAABJRU5ErkJggg==",
    markerXAnchor : 25.5,
    markerYAnchor : 38,
    strokeColor : "#002A50",
    strokeWidth : 4,
    strokeOpacity : 0.8,
    polyFillColor : "#00B798",
    polyFillOpacity : 0.5,
    textStrokeColor : "#000000",
    textColor : "#FFFFFF"
};

/**
 * Caractéristiques par defaut pour les TMS Géoportail
 * @private
 */
IMap.WMTSDEFAULTS = {
    "EPSG:3857" : {
        resolutions : [156543.033928041, 78271.51696402048, 39135.758482010235, 19567.87924100512, 9783.93962050256, 4891.96981025128, 2445.98490512564, 1222.99245256282, 611.49622628141, 305.7481131407048, 152.8740565703525, 76.43702828517624, 38.21851414258813, 19.10925707129406, 9.554628535647032, 4.777314267823516, 2.388657133911758, 1.194328566955879, 0.5971642834779395, 0.2985821417389697, 0.1492910708694849, 0.0746455354347424],
        scales : {
            0 : 559082264,
            1 : 279541132,
            2 : 139770566,
            3 : 69885283,
            4 : 34942642,
            5 : 17471321,
            6 : 8735660,
            7 : 4367830,
            8 : 2183915,
            9 : 1091958,
            10 : 545979,
            11 : 272989,
            12 : 136495,
            13 : 68247,
            14 : 34124,
            15 : 17062,
            16 : 8531,
            17 : 4265,
            18 : 2133,
            19 : 1066,
            20 : 533,
            21 : 267
        },
        threshold : 0.0000001,
        topLeftCorner : {
            x : -20037508,
            y : 20037508
        }
    },
    "EPSG:4326" : {
        resolutions : [1.40625, 0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 0.0006866455078125, 0.00034332275390625, 0.000171661376953126, 0.0000858306884765628, 0.0000429153442382813, 0.0000214576721191407, 0.0000107288360595703, 0.00000536441802978517, 0.00000268220901489259, 0.0000013411045074463, 0.000000670552253723145, 0.00000033527612686157],
        threshold : 0.0000000001,
        topLeftCorner : {
            x : 90,
            y : -180
        }
    },
    "EPSG:2154" : {
        resolutions : [104579.22454989408, 52277.53235379051, 26135.487078595408, 13066.891381800004, 6533.228604113456, 3266.5595244626675, 1633.2660045974187, 816.6295549860224, 408.31391467683596, 204.15674151090204, 102.07831678324082, 51.0391448966112, 25.519569074269395, 12.759783693647506, 6.379891635966491, 3.18994576530532, 1.5949728694977277, 0.7974864315474559, 0.398743214900604, 0.19937160727567999, 0.099685803696052, 0.049842901818919996],
        threshold : 0.00000001,
        topLeftCorner : {
            x : 0,
            y : 12000000
        }
    }
};

/**
 * Returns the current layers options. If layerIds is precised, returns just the options of the layers listed. If layerIds = null, returns the options of all the map's layers.
 *
 * @param {Array.<String> | null} layerIds - A list of layer's id or null.
 * @returns {Object} - The options of map's layers. Associative array mapping given layers ids with their {@link Gp.LayerOptions} properties.
 */
IMap.prototype.getLayersOptions = function (layerIds) {
    // aucun layerIds fourni => on les retourne tous
    if (!layerIds || (Array.isArray(layerIds) && layerIds.length === 0)) {
        layerIds = [];
        this._layers.forEach(function (layer) {
            layerIds.push(layer.id);
        },
        this);
    }
    var layersOptions = {};
    // tri du tableau dans l'ordre des positions.
    this._layers.sort(function (l1, l2) {
        return (l1.options.position - l2.options.position);
    });
    if (!Array.isArray(layerIds)) {
        layerIds = [layerIds];
    }
    this._layers.forEach(function (layer) {
        if (layerIds.indexOf(layer.id) < 0) {
            return;
        }
        layersOptions[layer.id] = layer.options;
    },
    this);
    return layersOptions;
};

/**
 * Adds a list of layers to the map.<br/>
 * The **layersOptions** parameter is an associative array mapping ids of layers to display and their properties.<br/>
 * For each layer, the id may be either the name of a Geoportal layer (eg : "ORTHOIMAGERY.ORTHOPHOTOS") available with the given [apiKey used to initialize the map](Gp.MapOptions.html) or an id of your choice for external resources.<br/>
 * The properties associated to each ID are given as {@link Gp.LayerOptions} objects.<br/>
 * For Geoportal Layers availables with the given apiKey, values are automaticaly fetched from key configuration. You only need to specify a {@link Gp.LayerOptions} object with properties you want to overide or an empty object if you don't want to overide anything.
 *
 * @alias Gp.Map.addLayers
 * @param {Object} layersOptions - Layers to add to the map and their options. Associative array mapping ids of layers to add (keys) and their properties (values given as {@link Gp.LayerOptions}).
 */
IMap.prototype.addLayers = function (layersOptions) {
    if (!layersOptions) {
        this.logger.trace("[IMap] addLayers : no layers to add");
        return;
    }
    // abonnement perso à l'evnement layerChanged pour tenir à jour l'objet this._layers
    this.listen("layerChanged", this._onLayerChanged, this);
    var layerId = null;
    for (layerId in layersOptions) {
        // on ne peut pas rajouter la même couche avec le même identifiant
        if (this._getLayersObj([layerId]).length > 0) {
            this.logger.info("Layer [" + layerId + "] already added to map.");
            continue;
        }
        this.logger.trace("[IMap] addLayers : adding : [" + layerId + "]");
        var layerOpts = layersOptions[layerId];
        // parametre pour l'ajout individuel de couche
        var addLayerParam = {};
        addLayerParam[layerId] = layerOpts;

        // FIXME Config est créé en runtime dans la variable globale Gp
        var scope = typeof window !== "undefined" ? window : {};
        var Config = scope.Gp ? scope.Gp.Config : undefined;

        // Est-ce un layer Geoportail ?
        // si on a donné une URL, on ne cherche pas à découvrir la couche Géoportail
        if (!layerOpts.hasOwnProperty("url") && Config) {
            var format = null;
            if (layerOpts && layerOpts.format) {
                format = layerOpts.format;
            }
            var layerConf = null;
            // on essaye d'abord WMTS
            if (format == null || format.toUpperCase() === "WMTS") {
                layerConf = Config.getLayerConf(layerId + "$GEOPORTAIL:OGC:WMTS");
                if (layerConf) {
                    format = "WMTS";
                }
            }
            // ... puis WMS GEOPORTAIL
            if (format == null || format.toUpperCase() === "WMS") {
                layerConf = Config.getLayerConf(layerId + "$GEOPORTAIL:OGC:WMS");
                if (layerConf) {
                    format = "WMS";
                } else {
                    // ... puis WMS INSPIRE
                    layerConf = Config.getLayerConf(layerId + "$INSPIRE:OGC:WMS");
                    if (layerConf) {
                        format = "WMS";
                    }
                }
            }
            // ... puis MAPBOX GEOPORTAIL
            if (format == null || format.toUpperCase() === "MAPBOX") {
                this.logger.warn("[IMap] addLayers : Format 'MapBox' not yet implemented !");
                // FIXME statuer sur le formalisme du nom de la couche interne !
                layerConf = Config.getLayerConf(layerId + "$GEOPORTAIL:MAPBOX");
                if (layerConf) {
                    format = "MAPBOX";
                }
            }
            // FIXME / TODO : WFS Geoportail ?
            if (layerConf) {
                // on a trouve la couche Geoportail : on rajoute sa configuration à ses options.
                this.logger.trace("[IMap] addLayers : [" + layerId + "] is a geoportalLayer. Adding inner properties.");
                addLayerParam[layerId].format = format;
                addLayerParam[layerId].originators = addLayerParam[layerId].originators || layerConf.originators;
                // options du layerswitcher
                addLayerParam[layerId] = this._layerOptions2layerConf(layerConf, addLayerParam[layerId]);
            }
            switch (format) {
                case "MAPBOX" :
                case "WMTS" :
                case "WMS" :
                    this._addGeoportalLayer(addLayerParam, layerConf);
                    continue;
                default :
                    this.logger.trace("[IMap] addLayers : [" + layerId + "] is not a Geoportal Layer");
            }
        }
        // Si on est ici, c'est que ce n'est pas un layer Geoportail
        // on a besoin du format et de l'URL (à minima)
        if (!layerOpts.hasOwnProperty("format") || typeof layerOpts.format !== "string") {
            this.logger.info("Impossible to add layer [" + layerId + "] : no format given");
            continue;
        }
        if (!layerOpts.hasOwnProperty("url") || typeof layerOpts.url !== "string") {
            this.logger.info("Impossible to add layer [" + layerId + "] : no url given");
            continue;
        }
        // verification des parametres obligatoires en fonction du format
        if (!this._checkLayerParams(layerOpts)) {
            this.logger.info("Impossible to add layer [" + layerId + "] : unsufficient or inadapted parameters given");
            continue;
        }
        switch (layerOpts.format.toUpperCase()) {
            case "georss":
                // TODO GeoRSS
                break;
            case "KML":
            case "GPX":
            case "GEOJSON":
            case "WFS":
            case "DRAWING":
                this._addVectorLayer(addLayerParam);
                break;
            case "MAPBOX":
                this._addMapBoxLayer(addLayerParam);
                break;
            case "WMS":
            case "WMTS":
            case "OSM":
                this._addRasterLayer(addLayerParam);
                break;
            default:
                this.logger.info("Impossible to add layer [" + layerId + "] : unhandled format [" + layerOpts.format + "]");
                break;
        }
    }

    // re-abonnement à l'evenement layerChanged
    // nécessaire pour ecouter les changements de propriétés sur la nouvelle couche
    this._resetLayerChangedEvent();
};

/**
 * Remove layers from the map.
 *
 * @alias Gp.Map.removeLayers
 * @param {Array.<String>} layerIds - A list of layer's id to be removed.
 * @returns {Boolean} - true if OK, false otherwise.
 */
IMap.prototype.removeLayers = function (layerIds) {
    if (!layerIds || (Array.isArray(layerIds) && layerIds.length === 0)) {
        this.logger.info("removeLayers : nothing to remove !");
        return false;
    }
    if (!Array.isArray(layerIds)) {
        layerIds = [layerIds];
    }
    return true;
};

/**
 * Modify the layers given with layersOptions parameter
 *
 * @alias Gp.Map.modifyLayers
 * @param {Object} layersOptions - Layers to modify and their options. Associative array mapping official name of the Geoportal layer or the id of a personal layer (keys) with their properties (values given as {@link Gp.LayerOptions}). Only following options are modified : opacity, visibility, maxZoom and minZoom.
 * @return {Boolean} indicates if the le parameter layersOptions has the correct format
 */
IMap.prototype.modifyLayers = function (layersOptions) {
    if (!layersOptions) {
        this.logger.info("modifyLayers : nothing to modify !");
        return false;
    }
    var layerIds = Object.keys(layersOptions);
    if (!layerIds || !Array.isArray(layerIds)) {
        this.logger.info("modifyLayers : wrong format for layersOptions !");
        return false;
    }
    return true;
};

/**
 * Defautl options for WMTS layers
 *
 * @return {Object} wmts options
 *
 * @private
 */
IMap.prototype._getWMTSDefaultOpts = function () {
    this.logger.trace("[IMap] : _getWMTSDefaultOpts");

    var wmtsOpts = {
        version : "1.0.0",
        outputFormat : "image/jpeg"
    };
    // identifiants des niveaux de zooms : 0, 1, 2, ...
    var matrixIds = [];
    for (var i = 0; i <= 20; i++) {
        matrixIds.push("" + i);
    }
    wmtsOpts.matrixIds = matrixIds;

    // resolutions par defaut :
    var resolutions = null;
    var topLeftCorner = null;
    var mapProj = this.getProjection();
    // topLeftCorner par defaut :
    if (typeof mapProj !== "string" || ["EPSG:3857"].indexOf(mapProj.toUpperCase()) >= 0) {
        resolutions = IMap.WMTSDEFAULTS["EPSG:3857"].resolutions;
        topLeftCorner = IMap.WMTSDEFAULTS["EPSG:3857"].topLeftCorner;
    } else if (["EPSG:4326", "CRS:84"].indexOf(mapProj.toUpperCase()) >= 0) {
        resolutions = IMap.WMTSDEFAULTS["EPSG:4326"].resolution7s;
        topLeftCorner = IMap.WMTSDEFAULTS["EPSG:4326"].topLeftCorner;
    } else if (["EPSG:2154"].indexOf(mapProj.toUpperCase()) >= 0) {
        resolutions = IMap.WMTSDEFAULTS["EPSG:2154"].resolution7s;
        topLeftCorner = IMap.WMTSDEFAULTS["EPSG:2154"].topLeftCorner;
    }
    if (resolutions) {
        wmtsOpts.resolutions = resolutions;
        wmtsOpts.topLeftCorner = topLeftCorner;
    }

    return wmtsOpts;
};

/**
 * Returns the layers Obj identified by layerIds
 *
 * @param {Array.<String>} layerIds - A list of layer's id.
 * @returns {Array.<Object>} - The internal objects layers identified by layerIds.
 * @private
 */
IMap.prototype._getLayersObj = function (layerIds) {
    var _layerObjs = [];
    this._layers.forEach(function (layer, i, array) {
        if (layerIds.indexOf(layer.id) < 0) {
            this.logger.trace("[IMap] _getLayersObj : " + layer.id + " not found.");
            return;
        }
        this.logger.trace("[IMap] _getLayersObj : found obj for : " + layer.id);
        _layerObjs.push(layer);
    },
    this);
    return _layerObjs;
};

/**
 * Add the markers to the map
 * FIXME : make it public ?
 *
 * @param {Array.<Gp.MarkerOptions>} markersOptions - Markers to add to the Map.
 * @private
 */
IMap.prototype._addMarkers = function (markersOptions) {
    this.logger.trace("[IMap] _addMarkers : generic function");
};

/**
 * Check params for layerDisplay
 *
 * @param {Gp.LayerOptions} layerOpts - options of the layer
 * @returns {Boolean} true if parameters are OK, false otherwise
 *
 * @private
 */
IMap.prototype._checkLayerParams = function (layerOpts) {
    // La vérification peut être surchargée selon les spécificités de l'implémentation.
    var missingParams = [];
    switch (layerOpts.format.toUpperCase()) {
        case "WMS":
            if (!layerOpts.hasOwnProperty("layers") || !(layerOpts.layers instanceof Array)) {
                missingParams.push("layers");
            }
            break;
        case "WMTS":
            if (!layerOpts.hasOwnProperty("layer") || typeof layerOpts.layer !== "string") {
                missingParams.push("layer");
            }
            if (!layerOpts.hasOwnProperty("tileMatrixSet") || typeof layerOpts.tileMatrixSet !== "string") {
                missingParams.push("tileMatrixSet");
            }
            if (!layerOpts.hasOwnProperty("styleName") || typeof layerOpts.styleName !== "string") {
                missingParams.push("styleName");
            }
            break;
        case "WFS":
            if (!layerOpts.hasOwnProperty("typeNames") || typeof layerOpts.typeNames !== "string") {
                missingParams.push("typeNames");
            }
            break;
        case "MAPBOX":
            // TODO y'a t-il des options obligatoires (autre que url) ?
            break;
    }
    if (missingParams.length > 0) {
        this.logger.info("Impossible to add " + layerOpts.format + " layer : missing mandatory parameter(s) : " + missingParams.toString());
        return false;
    }
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
IMap.prototype._addRasterLayer = function (layerObj) {
    // Abstract method to be overridden
};

/**
 * Add a vector Layer to the map
 *
 * @param {Object} layerObj - geoportalLayer to add.
 * @param {Gp.LayerOptions} layerObj.geoportalLayerID - options of the layer
 *
 * @private
 */
IMap.prototype._addVectorLayer = function (layerObj) {
    // Abstract method to be overridden
};

/**
 * Add a vector Layer MapBox to the map
 *
 * @param {Object} layerObj - geoportalLayer to add.
 * @param {Gp.LayerOptions} layerObj.geoportalLayerID - options of the layer
 *
 * @private
 */
IMap.prototype._addMapBoxLayer = function (layerObj) {
    // Abstract method to be overridden
};

/**
 * Add a geoportal Layer to the map
 *
 * @param {Object} layerObj - geoportalLayer to add.
 * @param {Gp.LayerOptions} layerObj.geoportalLayerID - options of the layer
 *
 * @private
 */
IMap.prototype._addGeoportalLayer = function (layerObj) {
    // Abstract method to be overridden
};

/**
 * Apply params common to all kind of layers :
 * opacity, visibility, minZoom, maxZoom
 *
 * @param {Gp.LayerOptions} layerOpts - options of the layer
 * @returns {Object} the modified implementation layer object
 *
 * @private
 */
IMap.prototype._applyCommonLayerParams = function (layerOpts) {
    // TO BE OVERRIDDEN
    return {};
};

/**
 * Recherche une couche dans le tableau this._layers à partir de son objet descriptif.
 *
 * @param {Gp.LayerOptions} layerOpts - objet de descrition de la couche
 * @return {Integer} l'index de la couche dans le tableau; -1 si non trouvé.
 * @private
 */
IMap.prototype._getLayerIndexByLayerOpts = function (layerOpts) {
    if (!layerOpts) {
        return -1;
    }
    for (var i = 0; i < this._layers.length; i++) {
        var l = this._layers[i];
        if (layerOpts.hasOwnProperty(l.id)) {
            return i;
        }
    }
    return -1;
};

/**
 * Recherche une couche dans le tableau this._layers à partir de son identifiant.
 *
 * @param {String} layerId - identifiant de la couche
 * @return {Integer} l'index de la couche dans le tableau; -1 si non trouvé.
 * @private
 */
IMap.prototype._getLayerIndexByLayerId = function (layerId) {
    for (var i = 0; i < this._layers.length; i++) {
        var l = this._layers[i];
        if (layerId === l.id) {
            return i;
        }
    }
    return -1;
};

/**
 * Filtre les metadata avec un url vide.
 *
 * @param {Array.<Object>} metadata - metadata objects array to filter
 * @returns {Array.<Object>} - filtered metadata objects array.
 * @private
 */
IMap.prototype._filterEmptyMetadata = function (metadata) {
    if (!metadata || !Array.isArray(metadata)) {
        return metadata;
    }
    var fullMetadata = [];
    for (var i = 0; i < metadata.length; i++) {
        if (metadata[i].url && metadata[i].url.trim().length > 0) {
            fullMetadata.push(metadata[i]);
        }
    }
    return fullMetadata;
};

/**
 * Copie les proprietes des couches (layerOptions) en configuration pour le layerSwitcher (layerOpts)
 *
 * @param {Object} layerOptions - options de configuration d'une couche
 * @param {Object} layerConf - options de configuration de la couche pour le LayerSwitcher à completer.
 * @returns {Object} - options de configuration pour le layerSwitcher.
 * @private
 */
IMap.prototype._layerOptions2layerConf = function (layerOptions, layerConf) {
    var lConf = layerConf || {};

    lConf.title = lConf.title || layerOptions.title;
    lConf.description = lConf.description || layerOptions.description;
    lConf.quicklookUrl = lConf.quicklookUrl || layerOptions.quicklookUrl;
    lConf.legends = lConf.legends || layerOptions.legends;
    lConf.metadata = lConf.metadata || layerOptions.metadata;
    lConf.metadata = this._filterEmptyMetadata(lConf.metadata);
    return lConf;
};
