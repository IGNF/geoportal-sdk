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
        this.logger.trace("[modifyLayers] : modifying : [" + _layerObj.id + "]");
        // traduction options ahn => options OlMap
        var commonOpts = this._applyCommonLayerParams(layersOptions[_layerObj.id]);
        // application des options OL aux couches OL
        // l'objet _layerObj.options sera mis à jour par le mécanisme des evenements.
        if (commonOpts.hasOwnProperty("opacity")) {
            this.logger.trace("[modifyLayers] : setting opacity of : [" + _layerObj.id + "] to : " + commonOpts.opacity);
            _layerObj.obj.setOpacity(commonOpts.opacity);
        }
        if (commonOpts.hasOwnProperty("visible")) {
            this.logger.trace("[modifyLayers] : setting visible of : [" + _layerObj.id + "] to : " + commonOpts.visible);
            _layerObj.obj.setVisible(commonOpts.visible);
        }
        if (commonOpts.hasOwnProperty("zIndex")) {
            this.logger.trace("[modifyLayers] : setting zIndex of : [" + _layerObj.id + "] to : " + commonOpts.zIndex);
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
            this.logger.trace("[modifyLayers] : setting minResolution of : [" + _layerObj.id + "] to : " + commonOpts.minResolution);
            _layerObj.obj.setMinResolution(commonOpts.minResolution);
        }
        if (commonOpts.hasOwnProperty("maxResolution")) {
            this.logger.trace("[modifyLayers] : setting maxResolution of : [" + _layerObj.id + "] to : " + commonOpts.maxResolution);
            _layerObj.obj.setMaxResolution(commonOpts.maxResolution);
        }
        if (commonOpts.hasOwnProperty("grayScaled")) {
            this.logger.trace("[modifyLayers] : setting grayScaled of : [" + _layerObj.id + "] to : " + commonOpts.grayScaled);
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
                this.logger.trace("[_addRasterLayer] : ajout d'une couche WMS");
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
                        this.logger.info("[_addRasterLayer] : 'stylesNames' parameter should be an array of style names (string)");
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
                this.logger.trace("[_addRasterLayer] : ajout d'une couche WMTS");
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
                this.logger.trace("[_addRasterLayer] : ajout d'une couche OSM");
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
            this.logger.trace("[_addVectorLayer] : ajout d'une couche KML");

            // FIXME !?
            // constructorOpts.source = new Ol.source.Vector({
            //     url : this.setProxy(layerOpts.url),
            //     format : new Ol.format.KMLExtended({
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
                            this.logger.info("[_addVectorLayer] : Kml request failed : ", error);
                        }
                    });
                }
            });
            break;
        case "GPX":
            this.logger.trace("[_addVectorLayer] : ajout d'une couche GPX");
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
            this.logger.trace("[_addVectorLayer] : ajout d'une couche GeoJSON");
            constructorOpts.source = new Ol.source.Vector({
                url : this.setProxy(layerOpts.url),
                format : new Ol.format.GeoJSON()
            });
            constructorOpts.style = vectorStyle;
            break;
        case "WFS":
            // TODO : gestion des valeurs par defaut
            this.logger.trace("[_addVectorLayer] : ajout d'une couche WFS");
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
                // FIXME
                // cf. https://github.com/openlayers/openlayers/commit/cbaa9a7567ae32629241bab4721bc429940c942e#diff-2734579f56e71d2f13d47cd894a3fe68
                // defaultDataProjection to dataProjection version > 5.0.0 !
                formatOptions["defaultDataProjection"] = layerOpts.projection;
                // param for GMLx format
                formatOptions["srsName"] = layerOpts.projection;
            }
            // FIXME à revoir...
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
            this.logger.trace("[_addVectorLayer] : ajout d'une couche de dessin");

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
 * Add a vector Layer MapBox to the map
 *
 * @param {Object} layerObj - geoportalLayer to add.
 * @param {Gp.LayerOptions} layerObj.geoportalLayerID - options of the layer
 *
 * @private
 */
OlMap.prototype._addMapBoxLayer = function (layerObj) {
    // carte courante
    var map = this.libMap;

    var self = this;
    // closure avec layerObj en param
    (function (_layerObj) {
        // options
        var layerId = Object.keys(_layerObj)[0];
        var layerOpts = _layerObj[layerId];

        // url des styles
        // (proxification en fonction des options)
        var _url = self.setProxy(layerOpts.url);

        // traitements des styles/couches
        fetch(_url)
            .then(function (response) {
                if (response.ok) {
                    response.json()
                        .then(function (_glStyle) {
                            var _glSources = _glStyle.sources;

                            // multisources ?
                            var _multiSources = (Object.keys(_glSources).length > 1) ? 1 : 0;

                            for (var _glSourceId in _glSources) {
                                // format ol
                                var vectorFormat = null;
                                // source ol
                                var vectorSource = null;
                                // couche ol
                                var vectorLayer = null;

                                if (_glSources.hasOwnProperty(_glSourceId)) {
                                    // lecture des informations dans le style
                                    // ex. metadata : {
                                    //    geoportail:[title | description | quicklookUrl | legends | originators | metadata | ...]
                                    // }
                                    var _title = "";
                                    var _description = "";
                                    var _quicklookUrl = null;
                                    var _legends = null;
                                    var _metadata = null;
                                    var _originators = null;
                                    var _themes = null;
                                    var _filters = null;

                                    // on recherche si des informations sont disponibles
                                    // directement dans le fichier de style...
                                    if (_glStyle.metadata) {
                                        for (var ns in _glStyle.metadata) {
                                            if (_glStyle.metadata.hasOwnProperty(ns)) {
                                                var _keys = ns.split(":");
                                                if (_keys[0] === "geoportail") {
                                                    var key = _keys[1];
                                                    if (key === "title" && !layerOpts.title) {
                                                        _title = layerOpts.title = _glStyle.metadata[ns];
                                                        continue;
                                                    }
                                                    if (key === "description" && !layerOpts.description) {
                                                        _description = layerOpts.description = _glStyle.metadata[ns];
                                                        continue;
                                                    }
                                                    if (key === "quicklookUrl" && !layerOpts.quicklookUrl) {
                                                        _quicklookUrl = layerOpts.quicklookUrl = _glStyle.metadata[ns];
                                                        continue;
                                                    }
                                                    if (key === "legends" && !layerOpts.legends) {
                                                        _legends = layerOpts.legends = _glStyle.metadata[ns];
                                                        continue;
                                                    }
                                                    if (key === "metadata" && !layerOpts.metadata) {
                                                        _metadata = layerOpts.metadata = _glStyle.metadata[ns];
                                                        continue;
                                                    }
                                                    if (key === "originators" && !layerOpts.originators) {
                                                        _originators = layerOpts.originators = _glStyle.metadata[ns];
                                                        continue;
                                                    }
                                                    if (key === "themes" && !layerOpts.themes) {
                                                        _themes = layerOpts.themes = _glStyle.metadata[ns];
                                                        continue;
                                                    }
                                                    if (key === "filters" && !layerOpts.filters) {
                                                        _themes = layerOpts.filters = _glStyle.metadata[ns];
                                                        continue;
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    // ajout des informations issues des options :
                                    // titre et description par defaut
                                    if (!layerOpts.title) {
                                        layerOpts.title = "Couche MapBox";
                                    }
                                    if (!layerOpts.description) {
                                        layerOpts.description = "Couche MapBox";
                                    }
                                    _title = (_multiSources) ? layerOpts.title + "(" + _glSourceId + ")" : layerOpts.title;
                                    _description = layerOpts.description;
                                    _quicklookUrl = layerOpts.quicklookUrl;
                                    _metadata = layerOpts.metadata;
                                    _legends = layerOpts.legends;
                                    _originators = layerOpts.originators;
                                    _themes = layerOpts.themes; // FIXME url -> objet !
                                    _filters = layerOpts.filters;

                                    // source mapbox
                                    var _glSource = _glSources[_glSourceId];

                                    // construction de la couche en fonction du type
                                    var _glType = _glSource.type;

                                    if (_glType === "vector") {
                                        // url du tilejson ou flux mapbox
                                        var _glUrl = _glSource.url;
                                        // url du service tuilé
                                        var _glTiles = _glSource.tiles;
                                        // sprites
                                        var _glSprite = _glStyle.sprite;

                                        // remplacement d'un flux mapbox en service tuilé
                                        if (_glUrl && _glUrl.indexOf("mapbox://") === 0) {
                                            _glTiles = ["a", "b", "c", "d"].map(function (host) {
                                                var path = _glUrl.replace("mapbox://", "");
                                                var accessToken = _url.split("?")[1];
                                                return "https://" +
                                                    host + ".tiles.mapbox.com/v4/" +
                                                    path + "/{z}/{x}/{y}.vector.pbf?" +
                                                    accessToken;
                                            });

                                            // conversion des sprites sur un autre scheme que "mapbox://"
                                            if (_glSprite.indexOf("mapbox://") === 0) {
                                                var s = _url.split("?");
                                                _glStyle.sprite = s[0] + "/sprite" + "?" + s[1];
                                            }
                                        }

                                        if (_glTiles) {
                                            // service tuilé et/ou mapbox
                                            vectorFormat = new Ol.format.MVT();
                                            vectorSource = new Ol.source.VectorTile({
                                                attributions : _glSource.attribution,
                                                format : vectorFormat,
                                                tileGrid : Ol.tilegrid.createXYZ({ // TODO scheme tms ?
                                                    extent : _glSource.bounds, // [minx, miny, maxx, maxy]
                                                    maxZoom : _glSource.maxzoom || 22,
                                                    minZoom : _glSource.minzoom || 1,
                                                    tileSize : _glSource.tileSize || 256
                                                }),
                                                urls : _glTiles
                                            });
                                            vectorSource._title = _title;
                                            vectorSource._description = _description;
                                            vectorSource._quicklookUrl = _quicklookUrl;
                                            vectorSource._metadata = _metadata;
                                            vectorSource._legends = _legends;
                                            vectorSource._originators = _originators;
                                            vectorLayer = new Ol.layer.VectorTile({
                                                source : vectorSource,
                                                visible : false,
                                                // zIndex: 0, // FIXME gerer l'ordre sur des multisources ?
                                                declutter : true // TODO utile ?
                                            });
                                            vectorLayer.id = _glSourceId;
                                        } else if (_glUrl) {
                                            // service avec un tilejson
                                            vectorFormat = new Ol.format.MVT();
                                            vectorLayer = new Ol.layer.VectorTile({
                                                visible : false,
                                                // zIndex : 0
                                                declutter : true
                                            });
                                            vectorLayer.id = _glSourceId;
                                            var vectorTileJson = new Ol.source.TileJSON({
                                                url : _glUrl
                                            });
                                            // lecture du tilejson avec extension IGN
                                            // les extensions sont enregistrées
                                            // dans les propriétés de la couche : layer.set(mapbox-extension)
                                            // pour une utilisation ulterieur (ex. editeur)
                                            var _key = vectorTileJson.on("change", function (e) {
                                                if (vectorTileJson.getState() === "ready") {
                                                    var _tileJSONDoc = vectorTileJson.getTileJSON();

                                                    // on enregistre les extensions
                                                    vectorLayer.set("mapbox-extension", _tileJSONDoc["vector_layers"]);

                                                    var tiles = Array.isArray(_tileJSONDoc.tiles) ? _tileJSONDoc.tiles : [_tileJSONDoc.tiles];
                                                    for (var i = 0; i < tiles.length; i++) {
                                                        var tile = tiles[i];
                                                        if (tile.indexOf("http") !== 0) {
                                                            tiles[i] = _glUrl + tile;
                                                        }
                                                    }
                                                    vectorSource = new Ol.source.VectorTile({
                                                        attributions : vectorTileJson.getAttributions() || _tileJSONDoc.attribution,
                                                        format : vectorFormat,
                                                        tileGrid : Ol.tilegrid.createXYZ({
                                                            extent : _glSource.bounds, // [minx, miny, maxx, maxy]
                                                            maxZoom : _tileJSONDoc.maxzoom || _glSource.maxzoom || 22,
                                                            minZoom : _tileJSONDoc.minzoom || _glSource.minzoom || 0,
                                                            tileSize : _tileJSONDoc.tileSize || _glSource.tileSize || 256
                                                        }),
                                                        urls : tiles
                                                    });
                                                    vectorSource._title = _title;
                                                    vectorSource._description = _description;
                                                    vectorSource._quicklookUrl = _quicklookUrl;
                                                    vectorSource._metadata = _metadata;
                                                    vectorSource._legends = _legends;
                                                    vectorSource._originators = _originators;
                                                    vectorLayer.setSource(vectorSource);
                                                    Ol.Observable.unByKey(_key);
                                                }
                                            });
                                        }
                                    } else if (_glType === "geojson") {
                                        // FIXME
                                        // - cas avec un objet de type features ?
                                        // - cas avec une url relative ?
                                        var _glData = _glSource.data;

                                        vectorFormat = new Ol.format.GeoJSON();
                                        vectorSource = new Ol.source.VectorTile({
                                            attributions : _glSource.attribution,
                                            format : vectorFormat,
                                            url : _glData
                                        });
                                        vectorSource._title = _title;
                                        vectorSource._description = _description;
                                        vectorSource._quicklookUrl = _quicklookUrl;
                                        vectorSource._metadata = _metadata;
                                        vectorSource._legends = _legends;
                                        vectorSource._originators = _originators;
                                        vectorLayer = new Ol.layer.VectorTile({
                                            source : vectorSource,
                                            visible : false,
                                            // zIndex: 0, // FIXME gerer l'ordre sur des multisources ?
                                            declutter : true // TODO utile ?
                                        });
                                        vectorLayer.id = _glSourceId;
                                    } else {
                                        self.logger.warn("Type MapBox format unknown !");
                                        return; // FIXME promise ?
                                    }

                                    // parametre à transmettre à la fonction auto-invoquée
                                    var params = {
                                        id : _glSourceId,
                                        styles : _glStyle,
                                        layer : vectorLayer,
                                        // FIXME top pourri ! merge à faire...
                                        options : {
                                            visibility : layerOpts.visibility,
                                            queryable : layerOpts.queryable, // TODO !
                                            opacity : layerOpts.opacity,
                                            position : layerOpts.position || 0, // FIXME !
                                            url : layerOpts.url,
                                            format : layerOpts.format,
                                            themes : _themes,
                                            filters : _filters,
                                            title : _title,
                                            description : _description,
                                            quicklookUrl : _quicklookUrl,
                                            metadata : _metadata,
                                            legends : _legends,
                                            originators : _originators
                                        }
                                    };
                                    // fonction auto-invoquée
                                    (function (p) {
                                        // TODO ajouter le style de type background !
                                        // fonction de style de la couche
                                        var setStyle = function () {
                                            Ol.olms.applyStyle(p.layer, p.styles, p.id)
                                                .then(function () {
                                                    var visibility = (typeof layerOpts.visibility === "undefined") ? true : layerOpts.visibility;
                                                    p.layer.setVisible(visibility);
                                                    p.layer.setOpacity(layerOpts.opacity || 1);
                                                })
                                                .then(function () {
                                                    // gestion du centre de la cate sur la carte si center renseigné !
                                                    var projCode = map.getView().getProjection().getCode();
                                                    if (map.getView() && p.styles.center && p.styles.center.length) {
                                                        map.getView().setCenter(Ol.proj.transform(p.styles.center, "EPSG:4326", projCode));
                                                    }

                                                    // gestion du zoom sur la carte si zoom renseigné !
                                                    if (map.getView() && (p.styles.zoom || p.styles.zoom === 0)) {
                                                        map.getView().setZoom(p.styles.zoom);
                                                    }
                                                })
                                                .then(function () {
                                                    // zoom sur l'étendue avec l'option zoomToExtent
                                                    var source = p.layer.getSource();
                                                    if (map.getView() && source && source.getExtent) {
                                                        var _fit = layerOpts.zoomToExtent || false;
                                                        if (_fit) {
                                                            var key = source.on("change", function () {
                                                                var _sourceExtent = source.getExtent();
                                                                var _stateExtent = source.getState();
                                                                if (_stateExtent === "ready" && _sourceExtent[0] !== Infinity) {
                                                                    Ol.Observable.unByKey(key);
                                                                    map.getView().fit(_sourceExtent, {
                                                                        maxZoom : 18
                                                                    });
                                                                }
                                                            });
                                                            setTimeout(function () {
                                                                source.dispatchEvent("change");
                                                            }, 100);
                                                        }
                                                    }
                                                })
                                                .catch(function (e) {
                                                    self.logger.error(e);
                                                });
                                        };

                                        // enregistrement du layer
                                        var _id = (_multiSources) ? layerId + "-" + p.id : layerId;
                                        self._layers.push({
                                            id : _id,
                                            obj : p.layer,
                                            options : p.options
                                        });
                                        // etat des layers en cours
                                        self.logger.warn(self._layers);

                                        // ajout des styles dans la carte pour une utilisation
                                        // eventuelle (ex. editeur)
                                        // > map.set("mapbox-styles")
                                        var _allStyles = map.get("mapbox-styles") || {};
                                        _allStyles[_id] = p.styles;
                                        map.set("mapbox-styles", _allStyles);

                                        // ajout des differents styles de la couche
                                        // pour une utilisation eventuelle (ex. editeur)
                                        // > layer.set("mapbox-styles")
                                        var _styles = [];
                                        var _glLayers = p.styles.layers;
                                        for (var ii = 0; ii < _glLayers.length; ii++) {
                                            var _glLayer = _glLayers[ii];
                                            if (_glLayer.source === p.id) {
                                                _styles.push(_glLayer);
                                                continue;
                                            }
                                        }
                                        p.layer.set("mapbox-styles", _styles);

                                        // ajout des differents themes de la couche
                                        // pour une utilisation eventuelle (ex. portail ou editeur)
                                        // > layer.set("mapbox-themes")
                                        p.layer.set("mapbox-themes", _themes);

                                        // ajout des differents filtres attributaires de la couche
                                        // pour une utilisation eventuelle (ex. portail ou editeur)
                                        // > layer.set("mapbox-filters")
                                        p.layer.set("mapbox-filters", _filters);

                                        // ajout du layer sur la carte
                                        map.addLayer(p.layer);

                                        // maj du gestionnaire de couche
                                        self._addLayerConfToLayerSwitcher(p.layer, p.options);

                                        // application du style
                                        if (p.layer.getSource()) {
                                            setStyle();
                                        } else {
                                            p.layer.once("change:source", setStyle);
                                        }
                                    })(params);

                                    // // TODO ajouter le style de type background !
                                    // // fonction de style de la couche
                                    // var setStyle = function () {
                                    //     Ol.olms.applyStyle(vectorLayer, _glStyle, _glSourceId)
                                    //         .then(function () {
                                    //             var visibility = (typeof layerOpts.visibility === "undefined") ? true : layerOpts.visibility;
                                    //             vectorLayer.setVisible(visibility);
                                    //             vectorLayer.setOpacity(layerOpts.opacity || 1);
                                    //         })
                                    //         .then(function () {
                                    //             // gestion du centre de la cate sur la carte si center renseigné !
                                    //             var projCode = map.getView().getProjection().getCode();
                                    //             if (map.getView() && _glStyle.center && _glStyle.center.length) {
                                    //                 map.getView().setCenter(Ol.proj.transform(_glStyle.center, "EPSG:4326", projCode));
                                    //             }
                                    //
                                    //             // gestion du zoom sur la carte si zoom renseigné !
                                    //             if (map.getView() && (_glStyle.zoom || _glStyle.zoom === 0)) {
                                    //                 map.getView().setZoom(_glStyle.zoom);
                                    //             }
                                    //         })
                                    //         .then(function () {
                                    //             // zoom sur l'étendue avec l'option zoomToExtent
                                    //             if (map.getView() && vectorSource && vectorSource.getExtent) {
                                    //                 var _fit = layerOpts.zoomToExtent || false;
                                    //                 if (_fit) {
                                    //                     var key = vectorSource.on("change", function () {
                                    //                         var _sourceExtent = vectorSource.getExtent();
                                    //                         var _stateExtent = vectorSource.getState();
                                    //                         if (_stateExtent === "ready" && _sourceExtent[0] !== Infinity) {
                                    //                             Ol.Observable.unByKey(key);
                                    //                             map.getView().fit(_sourceExtent, {
                                    //                                 maxZoom : 18
                                    //                             });
                                    //                         }
                                    //                     });
                                    //                     setTimeout(function () {
                                    //                         vectorSource.dispatchEvent("change");
                                    //                     }, 100);
                                    //                 }
                                    //             }
                                    //         })
                                    //         .catch(function (e) {
                                    //             self.logger.error(e);
                                    //         });
                                    // };
                                    //
                                    // // enregistrement du layer
                                    // var _id = (_multiSources) ? layerId + "-" + vectorLayer.get("id") : layerId;
                                    // self._layers.push({
                                    //     id : _id,
                                    //     obj : vectorLayer,
                                    //     options : {
                                    //         title : _title,
                                    //         description : _description,
                                    //         quicklookUrl : _quicklookUrl,
                                    //         metadata : _metadata,
                                    //         legends : _legends,
                                    //         originators : _originators,
                                    //         themes : _themes
                                    //     }
                                    // });
                                    // // etat des layers en cours
                                    // self.logger.warn(self._layers);
                                    //
                                    // // ajout des styles dans la carte pour une utilisation
                                    // // eventuelle (ex. editeur)
                                    // // > map.set("mapbox-styles")
                                    // var _objStyles = map.get("mapbox-styles") || {};
                                    // _objStyles[_id] = _glStyle;
                                    // map.set("mapbox-styles", _objStyles);
                                    //
                                    // // FIXME utile d'avoir les styles, filtres, ... pour un layer ?
                                    // // ajout des differents styles de la couche
                                    // // pour une utilisation eventuelle (ex. editeur)
                                    // // > layer.set("mapbox-styles")
                                    //
                                    // // ajout des differents themes de la couche
                                    // // pour une utilisation eventuelle (ex. portail ou editeur)
                                    // // > layer.set("mapbox-themes")
                                    // vectorLayer.set("mapbox-themes", _themes);
                                    //
                                    // // ajout des differents filtres attributaires de la couche
                                    // // pour une utilisation eventuelle (ex. portail ou editeur)
                                    // // > layer.set("mapbox-filters")
                                    // vectorLayer.set("mapbox-filters", _filters);
                                    //
                                    // // ajout du layer sur la carte
                                    // map.addLayer(vectorLayer);
                                    //
                                    // // maj du gestionnaire de couche
                                    // self._addLayerConfToLayerSwitcher(vectorLayer, {
                                    //     title : _title,
                                    //     description : _description,
                                    //     quicklookUrl : _quicklookUrl,
                                    //     metadata : _metadata,
                                    //     legends : _legends,
                                    //     originators : _originators
                                    // });
                                    //
                                    // // application du style
                                    // if (vectorLayer.getSource()) {
                                    //     setStyle();
                                    // } else {
                                    //     vectorLayer.once("change:source", setStyle);
                                    // }
                                }
                            }
                        })
                        .catch(function () {
                            // TODO...
                        });
                }
            })
            .catch(function () {
                // TODO
            });
    })(layerObj);
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
        this.logger.trace("[_addGeoportalLayer] : apply MaxResolution : " + olParams.maxResolution);
    }
    if (layerOpts.hasOwnProperty("maxZoom") &&
        layerOpts.maxZoom >= 0 &&
        layerOpts.maxZoom <= 28) {
        olParams.minResolution = this._getResolutionFromZoomLevel(layerOpts.maxZoom);
        this.logger.trace("[_addGeoportalLayer] : apply minResolution : " + olParams.minResolution);
    }
    var LayerClass = null;
    switch (layerOpts.format.toUpperCase()) {
        case "MAPBOX" :
            this.logger.error("[_addGeoportalLayer] : not yet implemented !");
            break;
        case "WMTS" :
            LayerClass = Ol.layer.GeoportalWMTS;
            break;
        case "WMS" :
            LayerClass = Ol.layer.GeoportalWMS;
            break;
        default :
            this.logger.info("[_addGeoportalLayer] : no class found for " + layerOpts.format);
    }
    // au cas ou...
    if (LayerClass === null) {
        return;
    }
    // instance
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
 * @param {Object} layerObj - Ol layer
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
 * @param {Object} layerObj - Ol layer
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
    } else if (layerId.indexOf("layerimport:MapBox") === 0) {
        options.format = "MAPBOX";
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
        case "MAPBOX": // VectorTile n'est pas une image ?
        case "KML":
        case "GPX":
        case "WFS":
        case "drawing":
            this.logger.warn("[_changeLayerColor] : _changeLayerColor not allowed on vector layers (layer id: " + layerId + ")");
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
 * @param {Ol.layer.Layer} gpLayer.obj - implementation layer object (here openlayers)
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
 * @returns {Object} a Ol.layer.Layer constructor options object
 *
 * @private
 */
OlMap.prototype._applyCommonLayerParams = function (layerOpts) {
    var commonOpts = {};
    this.logger.trace("[_applyCommonLayerParams] : _applyCommonLayerParams ");
    if (layerOpts.hasOwnProperty("opacity")) {
        this.logger.trace("[_applyCommonLayerParams] : _applyCommonLayerParams - opacity : " + layerOpts.opacity);
        commonOpts.opacity = layerOpts.opacity;
    }
    if (layerOpts.hasOwnProperty("visibility")) {
        this.logger.trace("[_applyCommonLayerParams] : _applyCommonLayerParams - visibility : " + layerOpts.visibility);
        commonOpts.visible = layerOpts.visibility;
    }
    if (layerOpts.hasOwnProperty("position")) {
        this.logger.trace("[_applyCommonLayerParams] : _applyCommonLayerParams - position : " + layerOpts.position);
        commonOpts.zIndex = layerOpts.position;
    }
    if (layerOpts.hasOwnProperty("maxZoom") &&
        layerOpts.maxZoom >= 0 &&
        layerOpts.maxZoom <= 20) {
        var minRes = this._getResolutionFromZoomLevel(layerOpts.maxZoom);
        this.logger.trace("[_applyCommonLayerParams] : _applyCommonLayerParams - minRes : " + minRes);
        commonOpts.minResolution = minRes;
    }
    if (layerOpts.hasOwnProperty("minZoom") &&
        layerOpts.minZoom >= 0 &&
        layerOpts.minZoom <= 20) {
        var maxRes = this._getResolutionFromZoomLevel(layerOpts.minZoom);
        this.logger.trace("[_applyCommonLayerParams] : _applyCommonLayerParams - maxRes : " + maxRes);
        commonOpts.maxResolution = maxRes;
    }
    if (layerOpts.hasOwnProperty("grayScaled")) {
        this.logger.trace("[_applyCommonLayerParams] : _applyCommonLayerParams - grayScaled : " + layerOpts.grayScaled);
        commonOpts.grayScaled = layerOpts.grayScaled;
    }

    return commonOpts;
};
