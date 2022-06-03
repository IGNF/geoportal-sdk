import { ItMap } from "./ItMapBase";
import { IMap } from "../Interface/IMap";
import { itownsExtended } from "geoportal-extensions-itowns";

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
                    centerChangedEvt.oldCenter = {
                        x : itEvent.previous.x,
                        y : itEvent.previous.y
                    };
                }

                if (itEvent.new) {
                    centerChangedEvt.newCenter = {
                        x : itEvent.new.x,
                        y : itEvent.new.y
                    };
                }
                action.call(context, centerChangedEvt);
            };
            key = map.libMap.listen(itownsExtended.GlobeViewExtended.EVENTS.CENTER_CHANGED, callBackCenterChanged);
            break;
        case "zoomChanged" :
            var callbackZoomchange = function (itEvent) {
                // si le zoom n'a pas changé, on sort
                if (itEvent.new === itEvent.previous) {
                    return;
                }
                action.call(context, {
                    oldZoom : itEvent.previous,
                    newZoom : itEvent.new
                });
            };
            key = map.libMap.listen(itownsExtended.GlobeViewExtended.EVENTS.RANGE_CHANGED, callbackZoomchange);
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
            key = map.libMap.listen(itownsExtended.GlobeViewExtended.EVENTS.ORIENTATION_CHANGED, callbackAzimuthChange);
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
            key = map.libMap.listen(itownsExtended.GlobeViewExtended.EVENTS.ORIENTATION_CHANGED, callbackTiltChange);
            break;
        case "projectionChanged" :
            // TODO  : interet ?
            break;
        case "layerChanged" :
            var callbackLayerAdded = function (itevt) {
                var ladded = itevt;
                var layerIndex;
                var layerOpts = map._getLayerOpts(ladded.layerId);

                // mapbox label layer overlay
                if (!layerOpts) {
                    return;
                }

                var itColorLayer = map.libMap.getColorLayerById(Object.keys(layerOpts)[0]);

                if (itColorLayer && itColorLayer.sequence >= 0) {
                    layerIndex = itColorLayer.sequence;
                } else {
                    // if itColorLayer is not defined, the layer is an MNT  : we set its layerIndex to -1
                    layerIndex = -1;
                }
                // if (!layerOpts) {
                //    map.logger.trace("[ItMap] listen  : enregistrement d'une couche 'inconnue'.");
                //    layerOpts = map._registerUnknownLayer(ladded) ;
                // }

                // if itColorLayer is undefined, it is an MNT  : the sequence is set to -1
                action.call(context, {
                    layerAdded : layerOpts,
                    position : layerIndex
                });
            };
            key = map.libMap.listen(itownsExtended.GlobeViewExtended.EVENTS.LAYER_ADDED, callbackLayerAdded);
            map._registerEvent(key, eventId, action, context);

            var callbackLayerRemoved = function (itevt) {
                var lremoved = itevt;
                var layerOpts = map._getLayerOpts(lremoved.layerId) || map._getLayerOpts(lremoved.layerId, map._layersRemoved);

                // mapbox label layer overlay
                if (!layerOpts) {
                    return;
                }

                action.call(context, {
                    layerRemoved : layerOpts
                });
                // FIXME comment faire le menage des ecouteurs internes ?
                setTimeout(function () {
                    context._resetLayerChangedEvent(); // trop violent ?
                }, 0);
            };
            key = map.libMap.listen(itownsExtended.GlobeViewExtended.EVENTS.LAYER_REMOVED, callbackLayerRemoved);
            map._registerEvent(key, eventId, action, context);

            // abonnement à un changement de propriete sur chaque couche
            for (var obsProperty in ItMap.LAYERPROPERTIES) {
                map.libMap.getColorLayers().forEach(function (itLayer) {
                    var layerOpts = map._getLayerOpts(itLayer.id);

                    var callbackLayerChanged = function (itevt) {
                        var layerEvtinfos = map.libMap.getLayerEventInfos(itevt);
                        var k = layerEvtinfos.propertyName;
                        var oldItObj = {};
                        oldItObj[k] = layerEvtinfos.previousValue;
                        var oldCommonProp = map._getCommonLayerParams(oldItObj);
                        var newItObj = {};
                        newItObj[k] = layerEvtinfos.newValue;
                        var newCommonProp = map._getCommonLayerParams(newItObj);

                        action.call(context, {
                            property : ItMap.LAYERPROPERTIES[k],
                            oldValue : oldCommonProp[ItMap.LAYERPROPERTIES[k]],
                            newValue : newCommonProp[ItMap.LAYERPROPERTIES[k]],
                            layerChanged : layerOpts
                        });
                    };

                    var type = (obsProperty === "visible") ? itownsExtended.GlobeViewExtended.EVENTS.VISIBLE_PROPERTY_CHANGED
                        : (obsProperty === "opacity") ? itownsExtended.GlobeViewExtended.EVENTS.OPACITY_PROPERTY_CHANGED
                            : itownsExtended.GlobeViewExtended.EVENTS.SEQUENCE_PROPERTY_CHANGED;

                    key = map.libMap.addLayerListener(itLayer, type, callbackLayerChanged);
                    map._registerEvent(key, eventId, action, context);
                });
            };
            key = null;
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

    var self = this;
    this.libMap.getFeaturesAtMousePosition(evt).then(feats => {
        if (feats.length !== 0) {
            var content = self._features2html(feats);
            // Affichage des features.
            var position = {
                x : evt.layerX,
                y : evt.layerY
            };
            self._displayInfo(position, content.innerHTML);
        }
    });
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
        if (f.geometry.properties) {
            props = f.geometry.properties;
        }
        var nameDiv;
        nameDiv = document.createElement("div");
        nameDiv.className = "gp-att-name-div";
        if (props.hasOwnProperty("name")) {
            nameDiv.innerHTML = props.name;
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
            if (p === "stroke" || p === "stroke-opacity" || p === "stroke-width" || p === "fill" || p === "fill-opacity" || p === "_idx" || p === "_meshIdx" || p === "coordTimes" || p === "style") {
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
