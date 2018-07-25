import {OlMap} from "./OlMapBase";
import {IMap} from "../Interface/IMap";
import {Protocols, olExtended as Ol} from "gp";

/**
 * Proprietes observables des couches pour le SDK
 */
OlMap.LAYERPROPERTIES = {
    visible : "visibility",
    opacity : "opacity",
    zIndex : "position",
    grayScaled : "grayScaled",
    minResolution : "maxZoom",
    maxResolution : "minZoom"
};

/**
 * Remove the layers listed to the map.
 *
 * @param {Array.<String>} layerIds - A list of layer's id or null.
 */
OlMap.prototype.removeLayers = function (layerIds) {
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
OlMap.prototype.modifyLayers = function (layersOptions) {
    if (!IMap.prototype.modifyLayers.apply(this, arguments)) {
        return;
    }
    var layerIds = Object.keys(layersOptions);
    // on recupere les objets correspondants dejà sur la carte
    var _layerObjs = this._getLayersObj(layerIds);
    _layerObjs.forEach(function (_layerObj) {
        this.logger.trace("[IMap] modifyLayers : modifying : [" + _layerObj.id + "]");
        // traduction options ahn => options OlMap
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
 * Add a Raster Layer to the map
 *
 * @param {Object} layerObj - geoportalLayer to add.
 * @param {Gp.LayerOptions} layerObj.geoportalLayerID - options of the layer
 *
 * @private
 */
OlMap.prototype._addRasterLayer = function (layerObj) {
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
                params.LAYERS = layerOpts.layers.join(",");

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
OlMap.prototype._addVectorLayer = function (layerObj) {
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
        color : IMap.prototype._hexToRgba.call(this, layerStyleOptions.strokeColor || defaultMapOptions.strokeColor || defaultOptions.strokeColor, layerStyleOptions.strokeOpacity || defaultMapOptions.strokeOpacity || defaultOptions.strokeOpacity),
        width : layerStyleOptions.strokeWidth || defaultMapOptions.strokeWidth || defaultOptions.strokeWidth
    });
    styleOptions.fill = new Ol.style.Fill({
        color : IMap.prototype._hexToRgba.call(this, layerStyleOptions.polyFillColor || defaultMapOptions.polyFillColor || defaultOptions.polyFillColor, layerStyleOptions.polyFillOpacity || defaultMapOptions.polyFillOpacity || defaultOptions.polyFillOpacity)
    });
    styleOptions.text = new Ol.style.Text({
        font : "16px Sans",
        textAlign : "left",
        fill : new Ol.style.Fill({
            color : IMap.prototype._hexToRgba.call(this, layerStyleOptions.textColor || defaultMapOptions.textColor || defaultOptions.textColor, 1)
        })
    });
    if (layerStyleOptions.textStrokeColor) {
        styleOptions.text.stroke = new Ol.style.Stroke({
            color : IMap.prototype._hexToRgba.call(this, layerStyleOptions.textStrokeColor || defaultMapOptions.textStrokeColor || defaultOptions.textStrokeColor, 1),
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
                    "&bbox=" + extent.join(",") + "," + projection.getCode() + maxFeatures + sld;
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
OlMap.prototype._addGeoportalLayer = function (layerObj) {
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
        this.logger.trace("[OlMap] : apply MaxResolution : " + olParams.maxResolution);
    }
    if (layerOpts.hasOwnProperty("maxZoom") &&
        layerOpts.maxZoom >= 0 &&
        layerOpts.maxZoom <= 28) {
        olParams.minResolution = this._getResolutionFromZoomLevel(layerOpts.maxZoom);
        this.logger.trace("[OlMap] : apply minResolution : " + olParams.minResolution);
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
 * Trouve l'objet layerOpts correspondant au layer OL
 *
 * @param {Object} layerObj - ol layer
 * @param {Object} layersStack - tableau des couches où chercher
 *
 * @return {Object} layer options
 */
OlMap.prototype._getLayerOpts = function (layerObj, layersStack) {
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
OlMap.prototype._registerUnknownLayer = function (layerObj) {
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
 * Check params for layerDisplay
 *
 * @param {Gp.LayerOptions} layerOpts - options of the layer
 * @returns {Boolean} true if parameters are OK, false otherwise
 *
 * @private
 */
OlMap.prototype._checkLayerParams = function (layerOpts) {
    // verifications de base de la classe mère
    if (!IMap.prototype._checkLayerParams.apply(this, arguments)) {
        return false;
    }
    // verifications specifiques pour affichage dans OL
    // TODO
    return true;
};

/**
 *
 * @param {String} layerId - layer identifier
 * @param {Boolean} toGrayScale - indicate transformation direction (from or to grayscale)
 *
 * @private
 */
OlMap.prototype._changeLayerColor = function (layerId, toGrayScale) {
    var layerIndex = this._getLayerIndexByLayerId(layerId);
    var gpLayer = this._layers[layerIndex];

    switch (gpLayer.options.format.toUpperCase()) {
        case "KML":
        case "GPX":
        case "WFS":
        case "drawing":
            this.logger.info("[OlMap.prototype._changeLayerColor] warning : _changeLayerColor not allowed on vector layers (layer id: " + layerId + ")");
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
OlMap.prototype._colorGrayscaleLayerSwitch = function (gpLayer, toGrayScale) {
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

/**
 * Apply params common to all kind of layers :
 * opacity, visibility, minZoom, maxZoom
 *
 * @param {Gp.LayerOptions} layerOpts - options of the layer
 * @returns {Object} a ol.layer.Layer constructor options object
 *
 * @private
 */
OlMap.prototype._applyCommonLayerParams = function (layerOpts) {
    var commonOpts = {};
    this.logger.trace("[OlMap] : _applyCommonLayerParams ");
    if (layerOpts.hasOwnProperty("opacity")) {
        this.logger.trace("[OlMap] : _applyCommonLayerParams - opacity : " + layerOpts.opacity);
        commonOpts.opacity = layerOpts.opacity;
    }
    if (layerOpts.hasOwnProperty("visibility")) {
        this.logger.trace("[OlMap] : _applyCommonLayerParams - visibility : " + layerOpts.visibility);
        commonOpts.visible = layerOpts.visibility;
    }
    if (layerOpts.hasOwnProperty("position")) {
        this.logger.trace("[OlMap] : _applyCommonLayerParams - position : " + layerOpts.position);
        commonOpts.zIndex = layerOpts.position;
    }
    if (layerOpts.hasOwnProperty("maxZoom") &&
        layerOpts.maxZoom >= 0 &&
        layerOpts.maxZoom <= 20) {
        var minRes = this._getResolutionFromZoomLevel(layerOpts.maxZoom);
        this.logger.trace("[OlMap] : _applyCommonLayerParams - minRes : " + minRes);
        commonOpts.minResolution = minRes;
    }
    if (layerOpts.hasOwnProperty("minZoom") &&
        layerOpts.minZoom >= 0 &&
        layerOpts.minZoom <= 20) {
        var maxRes = this._getResolutionFromZoomLevel(layerOpts.minZoom);
        this.logger.trace("[OlMap] : _applyCommonLayerParams - maxRes : " + maxRes);
        commonOpts.maxResolution = maxRes;
    }
    if (layerOpts.hasOwnProperty("grayScaled")) {
        this.logger.trace("[OlMap] : _applyCommonLayerParams - grayScaled : " + layerOpts.grayScaled);
        commonOpts.grayScaled = layerOpts.grayScaled;
    }

    return commonOpts;
};
