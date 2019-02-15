import {ItMap} from "./ItMapBase";
import {itownsExtended as Itowns} from "geoportal-extensions-itowns";
import {IMap} from "../Interface/IMap";

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
ItMap.prototype.listen = function (eventId, action, context) {
    this.logger.trace("[ItMap]  : listen...");
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
                    map.logger.trace("[ItMap] listen  : enregistrement d'une couche 'inconnue'.");
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
            for (var obsProperty in ItMap.LAYERPROPERTIES) {
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
                            property : ItMap.LAYERPROPERTIES[key],
                            oldValue : oldCommonProp[ItMap.LAYERPROPERTIES[key]],
                            newValue : newCommonProp[ItMap.LAYERPROPERTIES[key]],
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
ItMap.prototype.forget = function (eventId, action) {
    this.logger.trace("[ItMap] : forget...");

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
        if (rEvents[i].action === action) {
            evKey = rEvents[i].key;
            rEvents.splice(i, 1);
            this.logger.trace("[ItMap] : forgetting : " + eventId + " (" + evKey + ")");
            this.libMap.forgetByKey(evKey);
        }
    }
};

/**
 * Action triggered when map is clicked
 *
 * @param {Object} evt - evenement sent on map click
 *
 * @private
 */
ItMap.prototype._onMapClick = function (evt) {
    this.logger.trace("[ItMap] : _onMapClick...");
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
ItMap.prototype._removeInfoDivs = function () {
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
ItMap.prototype._features2html = function (features) {
    this.logger.trace("[ItMap] : _features2html...");
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
ItMap.prototype._displayInfo = function (position, content) {
    this.logger.trace("[ItMap] : _displayInfo...");

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
ItMap.prototype._addVectorLayer = function (layerObj) {
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
ItMap.prototype._addRasterLayer = function (layerObj) {
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
        // this will launch the addedLayer callback (dans "ItMap._onLayerChanged")
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
ItMap.prototype._addGeoportalLayer = function (layerObj, layerConf) {
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
