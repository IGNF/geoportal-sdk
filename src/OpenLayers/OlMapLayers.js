import { OlMap } from "./OlMapBase";
import { IMap } from "../Interface/IMap";
import {
    Protocols,
    olExtended as Ol
} from "geoportal-extensions-openlayers";

import VectorLayer from "ol/layer/Vector";
import ImageLayer from "ol/layer/Image";
import TileLayer from "ol/layer/Tile";

import VectorSource from "ol/source/Vector";
import TileWMSSource from "ol/source/TileWMS";
import ImageWMSSource from "ol/source/ImageWMS";
import OSMSource from "ol/source/OSM";

import GML2 from "ol/format/GML2";
import GML3 from "ol/format/GML3";
import GeoJSON from "ol/format/GeoJSON";
import GPX from "ol/format/GPX";

import WMTSTileGrid from "ol/tilegrid/WMTS";

import {
    Fill as FillStyle,
    Icon as IconStyle,
    Stroke as StrokeStyle,
    Style,
    Text as TextStyle
} from "ol/style";

import Collection from "ol/Collection";
import { unByKey as olObservableUnByKey } from "ol/Observable";
import { bbox as olStrategyBBOX } from "ol/loadingstrategy";
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
    if (layerOpts.type !== "elevation") {
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
                    constructorOpts.source = new TileWMSSource(sourceOpts);
                } else {
                    constructorOpts.source = new ImageWMSSource(sourceOpts);
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
                    tileGrid : new WMTSTileGrid({
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
                constructorOpts.source = new OSMSource({
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
                layer = new ImageLayer(constructorOpts);
            } else {
                layer = new TileLayer(constructorOpts);
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
    var self = this
    // FIXME : ajout d'un parametre projection pour les donnees
    var layerId = Object.keys(layerObj)[0];
    var layerOpts = layerObj[layerId];
    var constructorOpts = this._applyCommonLayerParams(layerOpts);

    var layerStyleOptions = layerOpts.styleOptions || {};
    var defaultMapOptions = this.mapOptions.defaultFeaturesStyle || {};
    var defaultOptions = IMap.DEFAULT_VECTORLAYERS_STYLES;
    var styleOptions = {};
    styleOptions.image = new IconStyle({
        src : layerStyleOptions.markerSrc || defaultMapOptions.markerSrc || defaultOptions.markerSrc,
        anchor : [
            layerStyleOptions.markerXAnchor || defaultMapOptions.markerXAnchor || defaultOptions.markerXAnchor,
            layerStyleOptions.markerYAnchor || defaultMapOptions.markerYAnchor || defaultOptions.markerYAnchor
        ],
        anchorOrigin : "top-left",
        anchorXUnits : "pixels",
        anchorYUnits : "pixels"
    });
    styleOptions.stroke = new StrokeStyle({
        color : IMap.prototype._hexToRgba.call(this, layerStyleOptions.strokeColor || defaultMapOptions.strokeColor || defaultOptions.strokeColor, layerStyleOptions.strokeOpacity || defaultMapOptions.strokeOpacity || defaultOptions.strokeOpacity),
        width : layerStyleOptions.strokeWidth || defaultMapOptions.strokeWidth || defaultOptions.strokeWidth
    });
    styleOptions.fill = new FillStyle({
        color : IMap.prototype._hexToRgba.call(this, layerStyleOptions.polyFillColor || defaultMapOptions.polyFillColor || defaultOptions.polyFillColor, layerStyleOptions.polyFillOpacity || defaultMapOptions.polyFillOpacity || defaultOptions.polyFillOpacity)
    });
    styleOptions.text = new TextStyle({
        font : "16px Sans",
        textAlign : "left",
        fill : new FillStyle({
            color : IMap.prototype._hexToRgba.call(this, layerStyleOptions.textColor || defaultMapOptions.textColor || defaultOptions.textColor, 1)
        })
    });
    if (layerStyleOptions.textStrokeColor) {
        styleOptions.text.stroke = new StrokeStyle({
            color : IMap.prototype._hexToRgba.call(this, layerStyleOptions.textStrokeColor || defaultMapOptions.textStrokeColor || defaultOptions.textStrokeColor, 1),
            width : 1
        });
    }
    var vectorStyle = new Style(styleOptions);

    switch (layerOpts.format.toUpperCase()) {
        case "KML":
            this.logger.trace("[_addVectorLayer] : ajout d'une couche KML");

            // FIXME !?
            // constructorOpts.source = new VectorSource({
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
            constructorOpts.source = new VectorSource({
                features : new Collection(),
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
                            self.logger.info("[_addVectorLayer] : Kml request failed : ", error);
                        }
                    });
                }
            });
            break;
        case "GPX":
            this.logger.trace("[_addVectorLayer] : ajout d'une couche GPX");
            constructorOpts.source = new VectorSource({
                url : this.setProxy(layerOpts.url),
                format : new GPX()
            });
            constructorOpts.style = vectorStyle;
            break;
        case "GEORSS":
            // TODO GeoRSS
            break;
        case "GEOJSON":
            this.logger.trace("[_addVectorLayer] : ajout d'une couche GeoJSON");
            constructorOpts.source = new VectorSource({
                url : this.setProxy(layerOpts.url),
                format : new GeoJSON()
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
                    format = new GML2(formatOptions);
                } else {
                    // GML => defaults to GML3
                    format = new GML3(formatOptions);
                }
            } else {
                // Defaults format to GeoJSON
                format = new GeoJSON(formatOptions);
            }
            constructorOpts.source = new VectorSource({
                format : format,
                // envoi de la requête WFS
                url : function (extent, resolution, projection) {
                    return layerUrl + "?service=WFS&request=GetFeature" +
                    "&version=" + layerOpts.version + "&typename=" + layerOpts.typeNames +
                    "&outputFormat=" + layerOpts.outputFormat + "&srsname=" + projection.getCode() +
                    "&bbox=" + extent.join(",") + "," + projection.getCode() + maxFeatures + sld;
                },
                strategy : olStrategyBBOX
            });

            break;
        case "drawing":
            // à tester avec les outils de dessins
            this.logger.trace("[_addVectorLayer] : ajout d'une couche de dessin");

            constructorOpts.source = new VectorSource({});
            break;
        default:
            break;
    }

    if (constructorOpts.hasOwnProperty("source")) {
        // le controle geoportalAttribution exploite la propriete _originators
        if (layerOpts.hasOwnProperty("originators")) {
            constructorOpts.source._originators = layerOpts.originators;
        }

        var layer = new VectorLayer(constructorOpts);
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
                        olObservableUnByKey(key);
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
 * @param {Object} layerConf - options of the layer conf (Gp.Config)
 *
 * @private
 */
OlMap.prototype._addGeoportalLayer = function (layerObj, layerConf) {
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
    // transmission du style demandé au LayerWMTS/LayerWMS
    // WMTS : styleName (string)
    if (layerOpts.hasOwnProperty("styleName")) {
        olParams.sourceParams = {};
        olParams.sourceParams.style = layerOpts.styleName;
    }
    // WMS : styleNames (array[string]) --> on prend le premier style spécifié
    if (layerOpts.hasOwnProperty("styleNames")) {
        olParams.sourceParams = {};
        olParams.sourceParams.params = {};
        olParams.sourceParams.params.STYLES = layerOpts.styleNames[0];
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
            // Il n'est pas possible de creer une instance pour le format MAPBOX
            // car le type n'est determiné qu'après le téléchargement du style...
            // Donc, il nous faut les infos suivantes :
            //     format: "MapBox",
            //     url : "", // -> autoconf
            //     urlService : "", // -> opts
            //     projection : "", // -> autoconf / opts
            //     outputFormat : "", // -> autoconf / opts
            //     defaultStyleThumbnail : "", // -> autoconf / opts
            //     defaultStyleName : "", // -> autoconf / opts
            //     defaultStyleDescription : "", // -> autoconf / opts
            //     stylesSummary : "", // not used !
            //     styles : [ // -> autoconf / opts
            //         {
            //             thumbnail : "",
            //             name : "",
            //             description : "",
            //             url : ""
            //         }
            //     ],
            //     filtersSummary : "", // not used !
            //     filters : [ // ->  opts
            //         {
            //             propertyName : "",
            //             filterName : "",
            //             configuration : ""
            //         }
            //     ],
            //     opacity : 1, / opts
            //     visibility : true, / opts
            //     queryable : true, / opts
            //     position : 0, / opts
            //     title : "", // -> autoconf / opts
            //     description : "", // -> autoconf / opts
            //     quicklookurl : "", // -> autoconf / opts
            //     metadata : [], // -> autoconf / opts
            //     legends : [], // -> autoconf / opts
            //     originators: [] // -> autoconf / opts
            this.logger.info("[_addGeoportalLayer] --> [_addMapBoxLayer]...");
            if (layerConf) {
                var bfirst = true;
                for (var i = 0; i < layerConf.styles.length; i++) {
                    var s = layerConf.styles[i];
                    if (s.current) {
                        if (!layerOpts.hasOwnProperty("url")) {
                            layerObj[layerId].url = s.url;
                        }
                        if (!layerOpts.hasOwnProperty("defaultStyleName")) {
                            layerObj[layerId].defaultStyleName = s.name;
                        }
                        if (!layerOpts.hasOwnProperty("defaultStyleDescription")) {
                            layerObj[layerId].defaultStyleDescription = s.title;
                        }
                        if (!layerOpts.hasOwnProperty("defaultStyleThumbnail")) {
                            layerObj[layerId].defaultStyleThumbnail = s.thumbnail;
                        }
                    } else {
                        // 1. false true -> true
                        //    true false -> true ...
                        // 2. true true  -> false
                        if ((function (a, b) { return (a || b) && !(a && b); })(layerOpts.hasOwnProperty("styles"), bfirst)) {
                            bfirst = false;
                            if (!layerObj[layerId].styles) {
                                layerObj[layerId].styles = [];
                            }
                            layerObj[layerId].styles.push({
                                thumbnail : s.thumbnail,
                                name : s.name,
                                description : s.title,
                                url : s.url
                            });
                        }
                    }
                }
            }
            this._addMapBoxLayer(layerObj);
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
    } else if (layerId.indexOf("layerimport:MAPBOX") === 0) {
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

    // La propriéte "target" de CustomEvent est en "read-only" !?
    // Et, on la surcharge afin d'eviter des exceptions dy type :
    //  TypeError: Cannot assign to read only property 'target' of object '#<CustomEvent>'
    Object.defineProperty(event, "target", {
        writable : true
    });

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
        if (source instanceof ImageWMSSource) {
            source.loadstartListenerKey = source.on("imageloadstart", imageloadstartHandler);
            source.loadendListenerKey = source.on("imageloadend", imageloadendHandler);
        } else {
            source.loadstartListenerKey = source.on("tileloadstart", tileloadstartHandler);
            source.loadendListenerKey = source.on("tileloadend", tileloadendHandler);
        }
    } else {
        olObservableUnByKey(source.loadstartListenerKey);
        olObservableUnByKey(source.loadendListenerKey);
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
