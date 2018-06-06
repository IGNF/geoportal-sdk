import Loader from "../Utils/Loader";
import IMap from "../IMap";
import Logger from "../Utils/LoggerByDefault";
import {itownsExtended as Itowns} from "gp";

/**
* @param {Object} opts - map options
* Itowns IMap implementation class.
*/
function IT (opts) {
    if (!(this instanceof IT)) {
        throw new TypeError("IT constructor cannot be called as a function.");
    }

    /**
    * Nom de la classe (heritage)
    */
    this.CLASSNAME = "IT";

    // appel du constructeur par heritage,
    IMap.apply(this, arguments);

    this.logger = Logger.getLogger("IT");
    this.logger.trace("[Constructeur IT (options)]");
}

/**
 * Proprietes observables des couches pour l'AHN
 */
IT.LAYERPROPERTIES = {
    visible : "visibility",
    opacity : "opacity",
    sequence : "position"
};

/**
 * Association controlId <-> classe iTowns d'implemenation
 */
IT.CONTROLSCLASSES = {
    mouseposition : "itowns.control.MousePosition",
    layerswitcher : "itowns.control.LayerSwitcher",
    attributions : "itowns.control.Attributions",
    overview : "itowns.control.MiniGlobe",
    graphicscale : "itowns.control.Scale"

};

// heritage
IT.prototype = Object.create(IMap.prototype, {
    // getter/setter
});

/*
* Constructeur (alias)
*/
IT.prototype.constructor = IT;

/**
 * Empty Map initialization
 */
IT.prototype._initMap = function () {
    this.logger.trace("[IT]  : _initMap");

    var _enginePath3d = Loader.getEnginePath(this.mapOptions.enginePath3d);

    Loader.loadEngine(_enginePath3d,
        function (itowns) {
            this.logger.warn("Itowns engine, loaded...", itowns);

            function deepCopy (source, target) {
                for (var prop in source) {
                    if (source.hasOwnProperty(prop)) {
                        if (!target.hasOwnProperty(prop)) {
                            target[prop] = source[prop];
                        } else if (typeof source[prop] === "object") {
                            deepCopy(source[prop], target[prop]);
                        }
                    }
                }
            }

            // On fusionne les extensions et la librairie itowns
            deepCopy(itowns, Itowns);
            deepCopy(Itowns, itowns);

            // position à l'initialisation
            var positionOnGlobe = {
                longitude : this.mapOptions.center.x || 2,
                latitude : this.mapOptions.center.y || 48,
                altitude : 25000000
            };

            var viewerDiv = this.div;

            // creation de la map vide
            this.libMap = new Itowns.GlobeViewExtended(viewerDiv, positionOnGlobe, {
                // to display the last zoom level of Ortho layer
                maxSubdivisionLevel : 18
            });

            var self = this;
            // when globe is loaded, we set the user map parameters
            var key = this.libMap.listen(Itowns.GlobeViewExtended.EVENTS.GLOBE_INITIALIZED, function () {
                // because itowns dispatch this event at each layer adding
                self.libMap.forgetByKey(key);

                // we show the div when globe is loaded
                window.setTimeout(function () {
                    self.div.style.visibility = "";
                }, 1);
                // FIXME en attendant que la variable positionOnGlobe puisse prendre
                // un zoom / une echelle (et non une altitude) et les params necessaires.
                self.setZoom(parseFloat(self.mapOptions.zoom) || 10);
                self.setAzimuth(parseFloat(self.mapOptions.azimuth) || 0);
                self.setTilt(parseFloat(self.mapOptions.tilt) || 0);

                // evenements pour faire la distinction entre le click et le drag
                var isDragging = false;

                var mousedownHandler = function () {
                    isDragging = false;
                };
                var registredEvent = self._registerEvent(mousedownHandler, "pickFeature", mousedownHandler, self);
                registredEvent.eventOrigin = self.div;
                registredEvent.eventType = "mousedown";
                registredEvent.eventOrigin.addEventListener(registredEvent.eventType, mousedownHandler, self);

                var mousemoveHandler = function () {
                    isDragging = true;
                };
                registredEvent = self._registerEvent(mousemoveHandler, "pickFeature", mousemoveHandler, self);
                registredEvent.eventOrigin = self.div;
                registredEvent.eventType = "mousemove";
                registredEvent.eventOrigin.addEventListener(registredEvent.eventType, mousemoveHandler, self);

                var mouseupHandler = function (evt) {
                    // if clicking right or dragging
                    if (evt.which === 3 || isDragging) {
                        self._removeInfoDivs();
                    } else {
                        self._onMapClick(evt);
                    }
                };
                registredEvent = self._registerEvent(mouseupHandler, "pickFeature", mouseupHandler, self);
                registredEvent.eventOrigin = self.div;
                registredEvent.eventType = "mouseup";
                registredEvent.eventOrigin.addEventListener(registredEvent.eventType, mouseupHandler, self);

                self._afterInitMap();
            });
        },
        function (error) {
            this.logger.warn("Itowns engine, failed...", error);
        },
        this);
};

/**
 * Action triggered when map is clicked
 *
 * @param {Object} evt - evenement sent on map click
 *
 * @private
 */
IT.prototype._onMapClick = function (evt) {
    this.logger.trace("[IT] : _onMapClick...");
    this._removeInfoDivs();

    var visibleFeatures = this.libMap.getFeaturesAtMousePosition(evt);

    if (visibleFeatures.length === 0) {
        // no visible features
        return;
    }

    var content = this._features2html(visibleFeatures);
    // Affichage des features.
    var position = {
        x : evt.layerX,
        y : evt.layerY
    };
    this._displayInfo(position, content.innerHTML);
};

/**
* Remove all the feature info PopUp displayed on the map.
*
* @private
*/
IT.prototype._removeInfoDivs = function () {
    var featureInfoDivs = document.getElementsByClassName("gp-feature-info-div-it");
    if (featureInfoDivs.length > 0) {
        for (var i = 0; i < featureInfoDivs.length; i++) {
            featureInfoDivs[i].parentNode.removeChild(featureInfoDivs[i]);
        }
    }
};

/**
 * Gets HTML content from features array
 *
 * @param {Array} features - itowns features Array
 * @returns {String} HTML content.
 *
 * @private
 */
IT.prototype._features2html = function (features) {
    this.logger.trace("[IT] : _features2html...");
    var content = document.createElement("div");
    features.forEach(function (f) {
        var props = {};
        if (f.properties) {
            props = f.properties;
        }
        var nameDiv;
        nameDiv = document.createElement("div");
        nameDiv.className = "gp-att-name-div";
        if (props.hasOwnProperty("name")) {
            nameDiv.innerHTML = props.name;
            content.appendChild(nameDiv);
        } else if (f.properties.description) {
            nameDiv.innerHTML = props.description;
            content.appendChild(nameDiv);
        } else {
            nameDiv.innerHTML = "UNKNOWN FEATURE NAME";
            content.appendChild(nameDiv);
        }
        if (props.hasOwnProperty("description")) {
            var descDiv = document.createElement("div");
            descDiv.className = "gp-att-description-div";
            descDiv.innerHTML = props["description"];
            content.appendChild(descDiv);
        }
        var p = null;
        var others = false;
        var oDiv = null;
        var ul = null;
        var li = null;
        for (p in props) {
            if (p === "name" || p === "description" || p === "styleUrl" || p === "styleHash") {
                continue;
            }

            // patch en attendant que les proprietes de style et autres attributs indesirables soient dissocies des autres proprietes dans itowns
            if (p === "stroke" || p === "stroke-opacity" || p === "stroke-width" || p === "fill" || p === "fill-opacity" || p === "_idx" || p === "_meshIdx" || p === "coordTimes") {
                continue;
            }

            if (!others) {
                oDiv = document.createElement("div");
                oDiv.className = "gp-att-others-div";
                ul = document.createElement("ul");
                others = true;
            }
            li = document.createElement("li");
            var span = document.createElement("span");
            span.className = "gp-attname-others-span";
            span.innerHTML = p + " : ";
            li.appendChild(span);
            li.appendChild(document.createTextNode(props[p]));
            ul.appendChild(li);
        }
        if (ul) {
            oDiv.appendChild(ul);
            content.appendChild(oDiv);
        }
    }, this);

    return content;
};

/**
 * Info Popup creation and display
 *
 * @param {Object} position - position on the screen where to display the popUp
 * @param {HTMLElement} content - content to display
 *
 * @private
 */
IT.prototype._displayInfo = function (position, content) {
    this.logger.trace("[IT] : _displayInfo...");

    // Affichage des features.
    var element = document.createElement("div");
    element.className = "gp-feature-info-div-it";

    var closer = document.createElement("input");
    closer.type = "button";
    closer.className = "gp-styling-button closer";

    closer.onclick = function (evt) {
        element.parentNode.removeChild(element);
        return false;
    };

    closer.addEventListener("mouseup", function (evt) {
        // to not fire _onMapClick function
        evt.stopPropagation();
    }, false);

    var contentDiv = document.createElement("div");
    var mapDiv = document.getElementById(this.div.id);
    contentDiv.className = "gp-features-content-div-it";
    contentDiv.innerHTML = content;
    element.appendChild(contentDiv);
    element.appendChild(closer);
    // You can use native DOM methods to insert the fragment:

    mapDiv.appendChild(element);

    var posX = mapDiv.offsetWidth / 2 - parseInt(element.offsetWidth, 10) / 2;
    var posY = mapDiv.offsetHeight / 2 - parseInt(element.offsetHeight, 10) / 2;
    element.style.left = posX + "px";
    element.style.top = posY + "px";
};

/**
 * Adds a vector Layer to the map
 *
 * @param {Object} layerObj - geoportalLayer to add.
 * @param {Gp.LayerOptions} layerObj.geoportalLayerID - options of the layer
 *
 * @private
 */
IT.prototype._addVectorLayer = function (layerObj) {
    // FIXME : ajout d'un parametre projection pour les donnees
    var layerId = Object.keys(layerObj)[0];
    var layerOpts = layerObj[layerId];
    var layer;
    var layerStyleOptions = layerOpts.styleOptions || {};
    var defaultMapOptions = this.mapOptions.defaultFeaturesStyle || {};
    var defaultOptions = IMap.DEFAULT_VECTORLAYERS_STYLES;
    layerOpts.format = layerOpts.format.toLowerCase();
    switch (layerOpts.format.toUpperCase()) {
        case "KML":
        case "GEOJSON":
            this.logger.trace("ajout d'une couche KML / GEOJSON");
            layer = {
                url : layerOpts.url,
                id : layerId,
                type : "color",
                protocol : "rasterizer",
                visible : (layerOpts.visibility === undefined) ? true : layerOpts.visibility,
                opacity : (layerOpts.opacity === undefined) ? 1 : layerOpts.opacity
            };
            // if extractStyles is true, we do not specify a style for the layer (itowns will automatically retrieve the KML style)
            if (this.mapOptions.extractStyles === true) {
                layer.style = {};
            } else {
                layer.style = {
                    stroke : layerStyleOptions.strokeColor || defaultMapOptions.strokeColor || defaultOptions.strokeColor,
                    strokeWidth : layerStyleOptions.strokeWidth || defaultMapOptions.strokeWidth || defaultOptions.strokeWidth,
                    strokeOpacity : layerStyleOptions.strokeOpacity || defaultMapOptions.strokeOpacity || defaultOptions.strokeOpacity,
                    fill : layerStyleOptions.polyFillColor || defaultMapOptions.polyFillColor || defaultOptions.polyFillColor,
                    fillOpacity : layerStyleOptions.polyFillOpacity || defaultMapOptions.polyFillOpacity || defaultOptions.polyFillOpacity
                };
            }
            break;
        case "GPX":
            this.logger.trace("ajout d'une couche GPX");
            layer = {
                url : layerOpts.url,
                id : layerId,
                type : "color",
                protocol : "rasterizer",
                visible : (layerOpts.visibility === undefined) ? true : layerOpts.visibility,
                opacity : (layerOpts.opacity === undefined) ? 1 : layerOpts.opacity,
                style : {
                    stroke : layerStyleOptions.strokeColor || defaultMapOptions.strokeColor || defaultOptions.strokeColor,
                    strokeWidth : layerStyleOptions.strokeWidth || defaultMapOptions.strokeWidth || defaultOptions.strokeWidth,
                    strokeOpacity : layerStyleOptions.strokeOpacity || defaultMapOptions.strokeOpacity || defaultOptions.strokeOpacity
                }
            };
            break;
        case "GEORSS":
            // TODO GeoRSS
            break;
        case "WFS":
            // TODO ???
            break;
        case "drawing":
            // TODO ??
            break;
        default:
            break;
    }
    if (layer) {
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

        this.libMap.addLayer(layer);
    }
};

/**
 * Adds a Raster Layer to the map
 *
 * @param {Object} layerObj - raster layer to add.
 * @param {Gp.LayerOptions} layerObj.geoportalLayerID - options of the layer
 *
 * @private
 */
IT.prototype._addRasterLayer = function (layerObj) {
    var layerId = Object.keys(layerObj)[0];
    var layerOpts = layerObj[layerId];
    var layerNames;
    var maxScaleDenominator;
    var minScaleDenominator;
    var boundingBox;
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
            // itowns needs a bbox to display the layer
            // if the layer is in PM, the bbox needs to be in planar coordinates
            if (layerOpts.bbox) {
                boundingBox = {
                    west : layerOpts.bbox[0],
                    east : layerOpts.bbox[2],
                    south : layerOpts.bbox[1],
                    north : layerOpts.bbox[3]
                };
            } else if (!layerOpts.bbox && layerOpts.projection === "EPSG:3857") {
                // world bbox in PM (EPSG:3857)
                boundingBox = {
                    west : -20026376.39,
                    east : 20026376.39,
                    south : -20048966.10,
                    north : 20048966.10
                };
            } else {
                // world bbox in WGS84 (EPSG:4326)
                boundingBox = {
                    west : -180,
                    east : 180,
                    south : -90,
                    north : 90
                };
            }
            if (layerOpts.minZoom) {
                maxScaleDenominator = this._getResolutionFromZoomLevel(layerOpts.minZoom) / 0.00028;
            }
            if (layerOpts.maxZoom) {
                minScaleDenominator = this._getResolutionFromZoomLevel(layerOpts.maxZoom) / 0.00028;
            }
            var layer = {
                type : layerOpts.type || "color",
                url : layerOpts.url,
                protocol : layerOpts.format,
                id : layerId,
                name : layerNames,
                style : layerOpts.styleName || "",
                title : (layerOpts.title === undefined) ? layerId : layerOpts.title,
                visible : (layerOpts.visibility === undefined) ? true : layerOpts.visibility,
                opacity : (layerOpts.opacity === undefined) ? 1 : layerOpts.opacity,
                projection : layerOpts.projection || "EPSG:4326",
                extent : boundingBox,
                transparent : true,
                waterMask : false,
                featureInfoMimeType : "",
                dateTime : "",
                heightMapWidth : 256,
                options : {
                    mimetype : layerOpts.outputFormat,
                    zoom : {
                        min : layerOpts.minZoom || 1,
                        max : layerOpts.maxZoom || 21
                    }
                },
                networkOptions : {
                    crossOrigin : "omit"
                },
                updateStrategy : {
                    type : 0,
                    options : {}
                },
                version : layerOpts.version || "1.3.0"
            };
            break;
        case "WMTS" :
            this.logger.trace("ajout d'une couche WMTS");
            // chargement des options par defaut
            var lOpts = this._getWMTSDefaultOpts();
            // surcharge avec les options utilisateurs
            for (var opt in layerOpts) {
                lOpts[opt] = layerOpts[opt];
            }
            if (layerOpts.minZoom) {
                maxScaleDenominator = this._getResolutionFromZoomLevel(layerOpts.minZoom) / 0.00028;
            }
            if (layerOpts.maxZoom) {
                minScaleDenominator = this._getResolutionFromZoomLevel(layerOpts.maxZoom) / 0.00028;
            }
            layerOpts = lOpts;
            if (!layerOpts.tileMatrixSetLimits) {
                layerOpts.tileMatrixSetLimits = this._getTMSLimits(layerOpts.tileMatrixSet);
            }
            layer = {
                type : layerOpts.type || "color",
                url : layerOpts.url,
                protocol : layerOpts.format.toLowerCase(),
                id : layerId,
                title : (layerOpts.title === undefined) ? layerId : layerOpts.title,
                visible : (layerOpts.visibility === undefined) ? true : layerOpts.visibility,
                opacity : (layerOpts.opacity === undefined) ? 1 : layerOpts.opacity,
                updateStrategy : {
                    type : "0",
                    options : {}
                },
                networkOptions : {
                    crossOrigin : "omit"
                },
                options : {
                    tileMatrixSet : layerOpts.tileMatrixSet,
                    tileMatrixSetLimits : layerOpts.tileMatrixSetLimits,
                    mimetype : layerOpts.outputFormat,
                    name : layerOpts.layer,
                    style : layerOpts.styleName
                },
                version : layerOpts.version,
                minScaleDenominator : minScaleDenominator || null,
                maxScaleDenominator : maxScaleDenominator || null,
                processingOptions : layerOpts.processingOptions
            };
            if (layerOpts.minZoom && layerOpts.maxZoom) {
                layer.options.zoom = {
                    min : layerOpts.minZoom,
                    max : layerOpts.maxZoom
                };
            } else if (layerOpts.minZoom && !layerOpts.maxZoom) {
                layer.options.zoom = {
                    min : layerOpts.minZoom,
                    max : Math.max.apply(null, (Object.keys(layerOpts.tileMatrixSetLimits).map(Number)))
                };
            } else if (!layerOpts.minZoom && layerOpts.maxZoom) {
                layer.options.zoom = {
                    min : Math.min.apply(null, (Object.keys(layerOpts.tileMatrixSetLimits).map(Number))),
                    max : layerOpts.maxZoom
                };
            }
            if (layerOpts.levelsToLoad) {
                layer.updateStrategy = {
                    type : 1,
                    options : {
                        groups : layerOpts.levelsToLoad
                    }
                };
            }
            break;
        default :
    }
    if (layer) {
        // le controle geoportalAttribution exploite la propriete options.originators
        if (layerOpts.hasOwnProperty("originators")) {
            layer.options.originators = layerOpts.originators;
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
        if (layerOpts.isElevation === true) {
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
        // this will launch the addedLayer callback (dans "IT._onLayerChanged")
        this.libMap.addLayer(layer);
    }
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
IT.prototype._addGeoportalLayer = function (layerObj, layerConf) {
    // FIXME à faire ailleurs
    var layerId = Object.keys(layerObj)[0];
    // Si on a bien un objet layerConf passé, on ajoute les params spécifiques iTowns
    if (layerConf) {
        layerObj[layerId].url = layerConf.getServerUrl(layerConf.apiKeys[0]);
        layerObj[layerId].outputFormat = layerObj[layerId].outputFormat || layerConf.getDefaultFormat();
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
 * Centers the map on the given coordinates at the specified zoom
 *
 * @param {Object} point - center point
 * @param {Float} point.x - x coordinates for center
 * @param {Float} point.y - y coordinates for center
 * @param {Number} zoom - zoom level (optional, used for geolocate)
 *
 */
IT.prototype.setXYCenter = function (point, zoom) {
    this.logger.trace("[IT] - setXYCenter");
    if (!point.hasOwnProperty("x") || !point.hasOwnProperty("y")) {
        this.logger.info("no valid coordinates for map center");
        return;
    }
    if (point.location && point.location.trim().length > 0) {
        this.logger.info("point object has location property to center on...");
        return;
    }
    if (point.hasOwnProperty("projection") && point.projection !== "EPSG:4326" && Itowns.proj4.defs(point.projection)) {
        var wgs84Coords = Itowns.proj4(point.projection, "EPSG:4326", [point.x, point.y]);
        point = {
            x : wgs84Coords[0],
            y : wgs84Coords[1]
        };
    } else if (point.hasOwnProperty("projection") && Itowns.proj4.defs(point.projection) === undefined) {
        this.logger.trace("[IT] - setXYCenter(" + point.projection + " not handled ! )");
        return;
    }

    var position = {
        longitude : point.x,
        latitude : point.y
    };

    if (zoom) {
        position.zoom = zoom;
    }
    // set the camera aimed point on the specified coords
    this.libMap.setCameraTargetGeoPosition(position);
    this.logger.trace("[IT] - setXYCenter(" + point.x + "," + point.y + ")");
};

/**
 * Centers the map on the given coordinates at the specified zoom, with a 45 degrees tilt (autocenter 3D)
 *
 * @param {Object} point - center point
 * @param {Float} point.x - x coordinates for center
 * @param {Float} point.y - y coordinates for center
 * @param {Number} zoom - zoom level (optional, used for geolocate)
 *
 */
IT.prototype.setAutoCenter = function (point, zoom) {
    this.logger.trace("[IT] - setAutoCenter");
    if (!point.hasOwnProperty("x") || !point.hasOwnProperty("y")) {
        this.logger.info("no valid coordinates for map center");
        return;
    }

    if (point.hasOwnProperty("projection") && point.projection !== "EPSG:4326" && Itowns.proj4.defs(point.projection)) {
        var wgs84Coords = Itowns.proj4(point.projection, "EPSG:4326", [point.x, point.y]);
        point = {
            x : wgs84Coords[0],
            y : wgs84Coords[1]
        };
    } else if (point.hasOwnProperty("projection") && Itowns.proj4.defs(point.projection) === undefined) {
        this.logger.trace("[IT] - setAutoCenter(" + point.projection + " not handled ! )");
        return;
    }

    var position = {
        tilt : 45,
        heading : 0,
        longitude : point.x,
        latitude : point.y
    };

    if (zoom) {
        position.zoom = zoom;
    }
    // set the camera aimed point on the specified coords
    this.libMap.onCameraMoveStop(function () {
        this.libMap.setCameraTargetGeoPosition(position);
    }.bind(this));
    this.logger.trace("[IT] - setAutoCenter(" + point.x + "," + point.y + ")");
};

/**
 * Returns the coordinates of the current map center
 *
 * @returns {Object} - Coordinates of the map center
 */
IT.prototype.getCenter = function () {
    return this.libMap.getCenter();
};

/**
 * Returns the geoportal zoom level of the map calculated with the current map scale
 *
 * @returns {Number} - ZoomLevel of the map
 */
IT.prototype.getZoom = function () {
    // -1 pour se baser sur les zooms Gp
    var zoom = this.libMap.getZoom() - 1;
    return zoom;
};

/**
 * Sets the zoom Level of the map
 *
 * @param {Number} zoom - ZoomLevel
 */
IT.prototype.setZoom = function (zoom) {
    if ((parseFloat(zoom) !== parseInt(zoom, 10)) || isNaN(zoom)) {
        this.logger.info("no valid zoomLevel");
        return;
    }
    zoom = parseInt(zoom, 10);
    // On utilise la méthode setZoom d'iTowns (+1 pour se baser sur les zooms Gp)
    this.libMap.setZoom(zoom + 1);
    this.logger.trace("[IT] - setZoom(" + zoom + ")");
};

/**
 * Increments the zoom level of the map by 1
 */
IT.prototype.zoomIn = function () {
    var zoom = this.getZoom();
    // On ne zoom pas si le zoom est à 21 (max)
    if (zoom === 20) {
        return;
    }
    this.setZoom(zoom + 1);
};

/**
 * Decrements the zoom level of the map by 1
 */
IT.prototype.zoomOut = function () {
    var zoom = this.getZoom();
    // On ne dézoome pas si le zoom est à 0 (min)
    if (zoom === -1) {
        return;
    }
    this.setZoom(zoom - 1);
};

/**
 * Returns the current azimuth of the map
 *
 * @returns {Number} azimuth - orientation of the map
 */
IT.prototype.getAzimuth = function () {
    return this.libMap.getAzimuth();
};

/**
 * Sets the orientation of the map
 *
 * @param {Number} azimuth - Azimuth of the map
 */
IT.prototype.setAzimuth = function (azimuth) {
    if (isNaN(azimuth)) {
        this.logger.info("Not a valid azimuth  : must be a float");
        return;
    }
    // IT method to set the camera orientation
    this.libMap.setAzimuth(azimuth);
    this.logger.trace("[IT] - setAzimuth(" + azimuth + ")");
};

/**
 * Returns the current tilt of the map
 *
 * @returns {Number} tilt - tilt of the map
 */
IT.prototype.getTilt = function () {
    return this.libMap.getTilt();
};

/**
 * Sets the tilt of the map
 *
 * @param {Number} tilt - Tilt of the map
 */
IT.prototype.setTilt = function (tilt) {
    tilt = parseFloat(tilt);
    if (isNaN(tilt) || tilt < 0 || tilt > 90) {
        this.logger.info("no valid tilt angle");
        return;
    }
    // methode setTilt d'itowns pour régler l'inclinaison
    this.libMap.setTilt(tilt);
    this.logger.trace("[IT] - setTilt(" + tilt + ")");
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
IT.prototype.addMousePositionControl = function (controlOpts) {
    var mpOpts = {};
    if (controlOpts.div) {
        mpOpts.target = controlOpts.div;
    }
    mpOpts.collapsed = !controlOpts.maximised;
    if (controlOpts.systems &&
        Array.isArray(controlOpts.systems) &&
        controlOpts.systems.length > 0) {
        for (var i = 0; i < controlOpts.systems.length; i++) {
            /*
            if (!ol.proj.get(controlOpts.systems[i].crs)) {
                // on retire les systèmes non définis
                this.logger.trace("[IT] addMousePositionControl  : crs [" + controlOpts.systems[i].crs + "] not found." ) ;
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
                this.logger.trace("[IT] addMousePositionControl : adding unit   [" + controlOpts.units[j].toUpperCase());
                mpOpts.units.push(controlOpts.units[j]);
            }
        }
    }
    mpOpts.displayAltitude = controlOpts.displayAltitude;
    mpOpts.displayCoordinates = controlOpts.displayCoordinates;
    if (controlOpts.altitude) {
        mpOpts.altitude = controlOpts.altitude;
    }
    var control = new Itowns.control.MousePosition(mpOpts);
    this.libMap.addWidget(control);
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
IT.prototype.addLayerSwitcherControl = function (controlOpts) {
    this.logger.trace("[IT]  : addLayerSwitcherControl ... ");
    // TODO  : parametrage des couches
    var lsOpts = {
        layers : controlOpts.layers || [],
        options : {
            collapsed : !(controlOpts && controlOpts.maximised)
        }
    };
    if (controlOpts.div) {
        lsOpts.options.target = controlOpts.div;
    }
    // application des configuration des couches  :
    for (var i = 0; i < this._layers.length; i++) {
        var layer = this._layers[i];
        // Si la couche est un MNT, on ne l'ajoute pas au layerSwitcher
        if (layer.obj.type !== "color") {
            continue;
        }
        this.logger.trace("[IT]  : layerSwitcher  : configuring layer  : " + layer.id);
        // INFO  : les couches Geoportail sont aussi configurées.
        var layerConf = {
            id : layer.id,
            layer : layer.obj,
            config : {}
        };
        if (layer.options.title) {
            this.logger.trace("[IT]  : layerSwitcher  : setting title to [" + layer.options.title + "] for layer " + layer.id);
            layerConf.config.title = layer.options.title;
        }
        if (layer.options.description) {
            this.logger.trace("[IT  : layerSwitcher  : setting description to [" + layer.options.description + "] for layer " + layer.id);
            layerConf.config.description = layer.options.description;
        }
        if (layer.options.quicklookUrl) {
            this.logger.trace("[IT]  : layerSwitcher  : setting quicklookUrl to [" + layer.options.quicklookUrl + "] for layer " + layer.id);
            layerConf.config.quicklookUrl = layer.options.quicklookUrl;
        }
        if (layer.options.legends) {
            this.logger.trace("[IT]  : layerSwitcher  : setting legends to [" + layer.options.legends + "] for layer " + layer.id);
            layerConf.config.legends = layer.options.legends;
        }
        if (layer.options.metadata) {
            this.logger.trace("[IT]  : layerSwitcher  : setting metadata to [" + layer.options.metadata + "] for layer " + layer.id);
            layerConf.config.metadata = layer.options.metadata;
        }
        lsOpts.layers.push(layerConf);
    }

    this.logger.trace("[IT]  : layerSwitcher Opts  : ... ");
    var control = new Itowns.control.LayerSwitcher(lsOpts);
    this.libMap.addWidget(control);
    return control;
};

/**
 * Adds overview map to the map.
 *
 * @param {Object} controlOpts - control options
 * @param {HTMLElement} controlOpts.div - The HTML Element where the overview is put
 * @param {Boolean} controlOpts.maximised - Display or not the control
 * @param {String} controlOpts.position - The type of positionment of the overview element inside its container
 * @param {Number} controlOpts.width - The width of the minimap (100px by default)
 * @param {Number} controlOpts.height - The height of the minimap (100px by default)
 * @param {Number} controlOpts.x - The position of the minimap from the left of the container div (20px by default)
 * @param {Number} controlOpts.y - The position of the minimap from the bottom of the container div (20px by default)
 *
 * @returns {Object} control - overview control
 */
IT.prototype.addOverviewControl = function (controlOpts) {
    this.logger.trace("[IT] addOverviewControl : ... ");
    var ovControlOptions = {};
    if (controlOpts.position) {
        ovControlOptions.position = controlOpts.position;
    } else {
        ovControlOptions.position = "absolute";
    }
    if (controlOpts.div) {
        ovControlOptions.target = controlOpts.div;
    }
    var control = new Itowns.control.MiniGlobe(ovControlOptions);
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
        }
        if (!isNaN(controlOpts.y)) {
            control.getElement().style.bottom = Number(controlOpts.y) + "px";
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
IT.prototype.addGraphicScaleControl = function (controlOpts) {
    this.logger.trace("[IT] addGraphicScaleControl...");
    var scaleControlOptions = {};
    if (controlOpts.position) {
        scaleControlOptions.position = controlOpts.position;
    } else {
        scaleControlOptions.position = "absolute";
    }
    if (controlOpts.div) {
        scaleControlOptions.target = controlOpts.div;
    }
    var control = new Itowns.control.Scale(scaleControlOptions);
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
        }
        if (!isNaN(controlOpts.y)) {
            control.getElement().style.bottom = Number(controlOpts.y) + "px";
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
IT.prototype.addAttributionsControl = function (controlOpts) {
    var attOpts = {};
    attOpts.options = {};
    if (controlOpts.div) {
        attOpts.options.target = controlOpts.div;
    }
    attOpts.options.collapsed = !controlOpts.maximised;
    var control = new Itowns.control.Attributions(attOpts);
    this.libMap.addWidget(control);
    return control;
};

/**
 * Removes the listed controls of the map.
 *
 * @param {Array.<String>} controlIds - A list of control's id or null.
 */
IT.prototype.removeControls = function (controlIds) {
    this.logger.trace("[IT]  : removeControls ... ");
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
            this.logger.trace("[IT]  : removeControls  : removing [" + controlId + "] from register.");
            this._controls.splice(idx, 1);
        }

        var itownsControl = this.getLibMapControl(controlId);

        if (!itownsControl) {
            this.logger.info("Impossible to remove control [" + controlId + "]  : not found or unhandled");
            continue;
        }

        this.logger.trace("[IT]  : removeControls  : removing [" + controlId + "] from Map.");
        this.libMap.removeWidget(itownsControl);
    }
};

/**
 * Returns implementation of the control
 *
 * @param {String} controlId - identifier of the control
 * @returns {Object} - implementation object of the control if it is on the map. null otherwise.
 */
IT.prototype.getLibMapControl = function (controlId) {
    var foundItControl = null;
    // verifications de base  : controlId est bien gere.
    if (!IT.CONTROLSCLASSES.hasOwnProperty(controlId.toLowerCase()) ||
        !IT.CONTROLSCLASSES[controlId.toLowerCase()]) {
        this.logger.trace("[IT] getLibMapControl  : control " + controlId + " non implémenté.");
        return foundItControl;
    }
    // on regarde du cote des controles
    var itControls = this.libMap.getWidgets();
    if (!itControls || itControls.length === 0) {
        this.logger.trace("[IT] getLibMapControl  : no control found on map");
        return foundItControl;
    }
    for (var j = 0; j < itControls.length; j++) {
        this.logger.trace("[IT] getLibMapControl  : analyzing  : " + controlId);
        // test on control Name
        if (itControls[j].name && itControls[j].name.toLowerCase() === controlId.toLowerCase()) {
            foundItControl = itControls[j];
            this.logger.trace("[IT] getLibMapControl  : found GP Plugin Control ! ");
            break;
        }
    }
    if (!foundItControl) {
        this.logger.trace("[IT] getLibMapControl  : control " + controlId + " not found ! ");
    }

    return foundItControl;
};

/**
 * Removes of the map the layers given as parameters
 *
 * @param {Array.<String>} layerIds - A list of layer's id or null.
 */
IT.prototype.removeLayers = function (layerIds) {
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
            this.logger.info("[IT]  : Impossible to remove " + _layerId + " - not Found");
        }
    },
    this);
};

/**
 * Modifies the listed layers'options of the map
 *
 * @param {Object} layersOptions - Layers to add to the map and their options. Associative array mapping official name of the Geoportal layer or the id of a personal layer (keys) with their properties (values given as {@link Gp.LayerOptions}).
 */
IT.prototype.modifyLayers = function (layersOptions) {
    if (!IMap.prototype.modifyLayers.apply(this, arguments)) {
        return;
    }
    var layerIds = Object.keys(layersOptions);
    // on recupere les objets correspondants dejà sur la carte
    var _layerObjs = this._getLayersObj(layerIds);
    _layerObjs.forEach(function (_layerObj) {
        this.logger.trace("[IMap] modifyLayers  : modifying  : [" + _layerObj.id + "]");
        // traduction options ahn => options IT
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
 * Gets layer parameterss from IT layer params
 * opacity, visibility, sequence
 *
 * @param {Object} itlayerOpts - options of the layer
 * @returns {Gp.LayerOptions} - object with common options
 *
 * @private
 */
IT.prototype._getCommonLayerParams = function (itlayerOpts) {
    var commonOpts = {};
    this.logger.trace("[IT] : _getCommonLayerParams ");
    if (itlayerOpts.hasOwnProperty("opacity")) {
        this.logger.trace("[IT] : _getCommonLayerParams - opacity : " + itlayerOpts.opacity);
        commonOpts.opacity = itlayerOpts.opacity;
    }
    if (itlayerOpts.hasOwnProperty("visible")) {
        this.logger.trace("[IT] : _getCommonLayerParams - visibility : " + itlayerOpts.visible);
        commonOpts.visibility = itlayerOpts.visible;
    }
    if (itlayerOpts.hasOwnProperty("sequence")) {
        this.logger.trace("[IT] : _getCommonLayerParams - position : " + itlayerOpts.sequence);
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
IT.prototype._applyCommonLayerParams = function (layerOpts) {
    var commonOpts = {};
    this.logger.trace("[IT]  : _applyCommonLayerParams ");
    if (layerOpts.hasOwnProperty("opacity")) {
        this.logger.trace("[IT]  : _applyCommonLayerParams - opacity  : " + layerOpts.opacity);
        commonOpts.opacity = layerOpts.opacity;
    }
    if (layerOpts.hasOwnProperty("visibility")) {
        this.logger.trace("[IT]  : _applyCommonLayerParams - visibility  : " + layerOpts.visibility);
        commonOpts.visible = layerOpts.visibility;
    }
    if (layerOpts.hasOwnProperty("position")) {
        this.logger.trace("[IT]  : _applyCommonLayerParams - position  : " + layerOpts.position);
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
* Associate a function to trigger when an event is received.
*
* @param {String} eventId - The map's event listened. Possible values are  : 'loaded', 'failure', 'geolocated', 'located', 'zoomchanged', 'azimuthchanged', 'tiltchanged', 'dragstart', 'drag', 'dragend', 'projectionchanged', 'layerchanged', 'controlchanged'.
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
IT.prototype.listen = function (eventId, action, context) {
    this.logger.trace("[IT]  : listen...");
    // verifications de base de la classe mère
    if (!IMap.prototype.listen.apply(this, arguments)) {
        return;
    }
    context = context || this;
    var map = this;
    var key = null;
    switch (eventId) {
        case "mapFailure" :
            break;
        case "mapLoaded" :
        case "located" :
        case "geolocated" :
        case "configured" :
            // handled in IMap
            break;
        case "centerChanged" :
            var callBackCenterChanged = function (itEvent) {
                var centerChangedEvt = {};
                if (!itEvent) {
                    return;
                }
                if (itEvent.previous) {
                    var oldCoords = itEvent.previous.cameraTarget.as("EPSG:4326");
                    centerChangedEvt.oldCenter = {
                        x : oldCoords.longitude(),
                        y : oldCoords.latitude()
                    };
                }

                if (itEvent.new) {
                    var newCoords = itEvent.new.cameraTarget.as("EPSG:4326");
                    centerChangedEvt.newCenter = {
                        x : newCoords.longitude(),
                        y : newCoords.latitude()
                    };
                }
                action.call(context, centerChangedEvt);
            };
            key = map.libMap.listen(Itowns.GlobeViewExtended.EVENTS.CENTER_CHANGED, callBackCenterChanged);
            break;
        case "zoomChanged" :
            var oldZoom = context.getZoom();
            var callbackZoomchange = function (itEvent) {
                // on récupère le zoom
                var newZoom = context.getZoom();
                // si le zoom n'a pas changé, on sort
                if (newZoom === oldZoom) {
                    return;
                }
                action.call(context, {
                    oldZoom : oldZoom,
                    newZoom : newZoom
                });
                // update the oldZoom vale
                oldZoom = newZoom;
            };
            key = map.libMap.listen(Itowns.GlobeViewExtended.EVENTS.RANGE_CHANGED, callbackZoomchange);
            break;
        case "azimuthChanged" :
            var callbackAzimuthChange = function (itEvent) {
                if (itEvent.new.heading === itEvent.previous.heading) {
                    return;
                }
                action.call(context, {
                    oldAzimuth : itEvent.previous.heading,
                    newAzimuth : itEvent.new.heading
                });
            };
            key = map.libMap.listen(Itowns.GlobeViewExtended.EVENTS.ORIENTATION_CHANGED, callbackAzimuthChange);
            break;
        case "tiltChanged" :
            var callbackTiltChange = function (itEvent) {
                if (itEvent.new.tilt === itEvent.previous.tilt) {
                    return;
                }
                action.call(context, {
                    oldTilt : itEvent.previous.tilt,
                    newTilt : itEvent.new.tilt
                });
            };
            key = map.libMap.listen(Itowns.GlobeViewExtended.EVENTS.ORIENTATION_CHANGED, callbackTiltChange);
            break;
        case "projectionChanged" :
            // TODO  : interet ?
            break;
        case "layerChanged" :
            var callbackLayerAdded = function (itevt) {
                var ladded = itevt;
                var layerIndex;
                var layerOpts = map._getLayerOpts(ladded.layerId);
                var itColorLayer = map.libMap.getColorLayerById(Object.keys(layerOpts)[0]);

                if (itColorLayer && itColorLayer.sequence >= 0) {
                    layerIndex = itColorLayer.sequence;
                } else {
                    // if itColorLayer is not defined, the layer is an MNT  : we set its layerIndex to -1
                    layerIndex = -1;
                }
                if (!layerOpts) {
                    map.logger.trace("[IT] listen  : enregistrement d'une couche 'inconnue'.");
                    // layerOpts = map._registerUnknownLayer(ladded) ;
                }

                // if itColorLayer is undefined, it is an MNT  : the sequence is set to -1
                action.call(context, {
                    layerAdded : layerOpts,
                    position : layerIndex
                });
            };
            key = map.libMap.listen(Itowns.GlobeViewExtended.EVENTS.LAYER_ADDED, callbackLayerAdded);
            map._registerEvent(key, eventId, action, context);

            var callbackLayerRemoved = function (itevt) {
                var lremoved = itevt;
                var layerOpts = map._getLayerOpts(lremoved.layerId) || map._getLayerOpts(lremoved.layerId, map._layersRemoved);
                action.call(context, {
                    layerRemoved : layerOpts
                });
            };
            key = map.libMap.listen(Itowns.GlobeViewExtended.EVENTS.LAYER_REMOVED, callbackLayerRemoved);
            map._registerEvent(key, eventId, action, context);

            // abonnement à un changement de propriete sur chaque couche
            for (var obsProperty in IT.LAYERPROPERTIES) {
                map.libMap.getColorLayers().forEach(function (itLayer) {
                    var layerOpts = map._getLayerOpts(itLayer.id);

                    var callbackLayerChanged = function (itevt) {
                        var layerEvtinfos = map.libMap.getLayerEventInfos(itevt);
                        var key = layerEvtinfos.propertyName;
                        var oldItObj = {};
                        oldItObj[key] = layerEvtinfos.previousValue;
                        var oldCommonProp = map._getCommonLayerParams(oldItObj);
                        var newItObj = {};
                        newItObj[key] = layerEvtinfos.newValue;
                        var newCommonProp = map._getCommonLayerParams(newItObj);

                        action.call(context, {
                            property : IT.LAYERPROPERTIES[key],
                            oldValue : oldCommonProp[IT.LAYERPROPERTIES[key]],
                            newValue : newCommonProp[IT.LAYERPROPERTIES[key]],
                            layerChanged : layerOpts
                        });
                    };

                    var type = (obsProperty === "visible") ? Itowns.GlobeViewExtended.EVENTS.VISIBLE_PROPERTY_CHANGED
                        : (obsProperty === "opacity") ? Itowns.GlobeViewExtended.EVENTS.OPACITY_PROPERTY_CHANGED
                            : Itowns.GlobeViewExtended.EVENTS.SEQUENCE_PROPERTY_CHANGED;

                    key = map.libMap.addLayerListener(itLayer, type, callbackLayerChanged);
                    map._registerEvent(key, eventId, action, context);
                    key = null;
                });
            };
            break;
        case "controlChanged" :
            break;
        default :
            this.logger.info("unhandled event  : " + eventId);
    } ;
    if (key) {
        // ajout de l'evenement au tableau des événements
        this._registerEvent(key, eventId, action, context);
    }
};

/**
* Cancel an event listening.
*
* @param {String} eventId - The map's event to forget. Possible values are  :
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
IT.prototype.forget = function (eventId, action) {
    this.logger.trace("[IT] : forget...");

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
            this.logger.trace("[IT] : forgetting : " + eventId + " (" + evKey + ")");
            this.libMap.forgetByKey(evKey);
        }
    }
};

/**
 * returns the Itowns.GlobeView object
 *
 * @return {Object} itowns globe
 */
IT.prototype.getLibMap = function () {
    return this.libMap;
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
IT.prototype._getLayerOpts = function (layerId, layersStack) {
    var layerOpts = null;
    layersStack = layersStack || this._layers;
    for (var i = 0; i < layersStack.length; i++) {
        var l = layersStack[i];
        if (l.id === layerId) {
            this.logger.trace("[IT]  : found layer  : " + l.id);
            layerOpts = {};
            layerOpts[l.id] = l.options;
            break;
        }
    }
    return layerOpts;
};

/**
 * Gets Layer Container div ID for a given layerId.
 *
 * @param {String} layerId - layer identifier
 * @returns {String} - Layer Container div Id in the LayerSwitcher
 */
IT.prototype.getLSLayerContainerDivId = function (layerId) {
    var id = null;
    var idxLS = this._findRegisteredControl("layerswitcher");
    if (idxLS < 0) {
        this.logger.trace("[IT] : getLSLayerContainerDivId : no layerswitcher on map !");
        return id;
    }
    var itlayers = this._getLayersObj([layerId]);
    if (itlayers.length > 0) {
        var itLayerList = this._controls[idxLS].obj._layerListContainer;
        var divId = itLayerList.id;
        var uid = divId.substring(divId.indexOf("-"));
        if (itLayerList && itLayerList.childNodes) {
            for (var layerDivKey = 0; layerDivKey < itLayerList.childNodes.length; layerDivKey++) {
                if (itLayerList.childNodes[layerDivKey].id === "GPlayerSwitcher_ID_" + layerId + uid) {
                    var foundId = "GPlayerSwitcher_ID_" + layerId + uid;
                    return foundId;
                }
            }
        }
    }
    this.logger.trace("[IT] : getLSLayerContainerDivId : layer [" + layerId + "] not found on map !");
    return id;
};

/**
 * Registers unknown unregistered layer
 *
 * @param {Object} layerObj -  IT layer
 * @returns {Object} - new layer index in this._layers
 *
 * @private
 */
IT.prototype._registerUnknownLayer = function (layerObj) {
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
  * Retrieves max TMSLimits with its id
  *
  * @param {String} TMSID - Id of the tileMatrixSet
  * @returns {Object} TMSLimits - limits of the tileMatrixSet
  *
  * @private
  */
IT.prototype._getTMSLimits = function (TMSID) {
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
    this.logger.trace("[IT]  : no TMS Limits found for this TMS id");
};

export default IT;
