import { OlMap } from "./OlMapBase";
import { IMap } from "../Interface/IMap";
import { unByKey as olObservableUnByKey } from "ol/Observable";

/**
 * Associate a function to trigger when an event is received.
 *
 * @param {String} eventId - The map's event listened. Possible values are : 'loaded', 'failure', 'geolocated', 'located', 'zoomchanged', 'azimuthchanged', 'tiltchanged', 'dragstart', 'drag', 'dragend', 'projectionchanged', 'layerchanged', 'controlchanged'.
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
OlMap.prototype.listen = function (eventId, action, context) {
    this.logger.trace("[OlMap] : listen...");
    // verifications de base de la classe mère
    if (!IMap.prototype.listen.apply(this, arguments)) {
        return;
    }
    context = context || this;
    var map = this;
    var olEventKey = null;
    switch (eventId) {
        case "mapLoaded" :
            break;
        case "mapFailure" :
            break;
        case "located" :
            // handled in IMap
            break;
        case "geolocated" :
            // handled in IMap
            break;
        case "configured" :
            // handled in IMap
            break;
        case "centerChanged" :
            var callBackCenterChanged = function (olEvt) {
                var centerChangedEvt = {};
                if (olEvt.oldValue) {
                    centerChangedEvt.oldCenter = {
                        x : olEvt.oldValue[0],
                        y : olEvt.oldValue[1]
                    };
                }
                centerChangedEvt.newCenter = {
                    x : this.libMap.getView().getCenter()[0],
                    y : this.libMap.getView().getCenter()[1]
                };
                action.call(context, centerChangedEvt);
            }.bind(this);
            olEventKey = this.libMap.getView().on("change:center", callBackCenterChanged);
            break;
        case "zoomChanged" :
            var callbackZoomchange = function (olEvt) {
                action.call(context, {
                    // NB : quand on n'a precise aucun tableau de resolutions à
                    //      la creation de la vue, OL utilise les résolutions
                    //      Géographiques.
                    oldZoom : this._getZoomFromResolution(olEvt.oldValue/* , "EPSG:4326" */),
                    newZoom : this._getZoomFromResolution(this.libMap.getView().getResolution()/* , "EPSG:4326" */)
                });
            }.bind(this);
            olEventKey = this.libMap.getView().on("change:resolution", callbackZoomchange);
            break;
        case "azimuthChanged" :
            var callbackAzimuthChange = function (olEvt) {
                action.call(context, {
                    oldAzimuth : olEvt.oldValue * 180 / Math.PI,
                    newAzimuth : this.libMap.getView().getRotation() * 180 / Math.PI
                });
            }.bind(this);
            olEventKey = this.libMap.getView().on("change:rotation", callbackAzimuthChange);
            break;
        case "tiltChanged" :
            // non pertinent en 2D
            break;
        case "projectionChanged" :
            // TODO : interet ?
            break;
        case "layerChanged" :
            // abonnement à un ajout de couche
            var callbackLayerAdded = function (olEvt) {
                var ladded = olEvt.element;
                var layerOpts = this._getLayerOpts(ladded);
                if (!layerOpts) {
                    map.logger.trace("[OlMap] listen : enregistrement d'une couche 'inconnue'.");
                    layerOpts = this._registerUnknownLayer(ladded);
                }
                action.call(context, {
                    layerAdded : layerOpts,
                    position : ladded.getZIndex()
                });
            }.bind(this);
            olEventKey = this.libMap.getLayers().on("add", callbackLayerAdded);
            this._registerEvent(olEventKey, eventId, action, context);
            
            // abonnement à un retrait de couche
            var callbackLayerRemoved = function (olEvt) {
                var lremoved = olEvt.element;
                // on cherche la couche a éventuellement déjà été
                // enlevée de this._layers
                var layerOpts = this._getLayerOpts(lremoved) ||
                this._getLayerOpts(lremoved, this._layersRemoved);
                
                var self = context.getLibMap();
                if (self.featuresOverlay && layerOpts[self.featuresOverlay.getId()]) {
                    self.removeOverlay(self.featuresOverlay);
                    self.featuresOverlay = null;
                }
                action.call(context, {
                    layerRemoved : layerOpts
                });
                // desabonnement des ecouteurs internes...
                this._resetLayerChangedEvent();
            }.bind(this);
            olEventKey = this.libMap.getLayers().on("remove", callbackLayerRemoved);
            this._registerEvent(olEventKey, eventId, action, context);
            
            // doit on s'abonner s'il n'y'a pas de couches !?
            // if (this.libMap.getLayers().getLength()) {
            // abonnement à un changement de propriete sur chaque couche
            for (var obsProperty in OlMap.LAYERPROPERTIES) {
                map.logger.trace("[OlMap] listen : abonnement layerProperty : " + obsProperty);
                this.libMap.getLayers().forEach((olLayer, i, array) => {
                    var layerOpts = this._getLayerOpts(olLayer);
                    if (obsProperty === "grayScaled") {
                        // layerChangeGrayScaled callback
                        var layerChangeGrayScaledCallBack = function (evt) {
                            action.call(context, {
                                property : "grayScaled",
                                oldValue : evt.detail.oldValue,
                                newValue : evt.detail.newValue,
                                layerChanged : layerOpts
                            });
                        };

                        var registredEvent = map._registerEvent(layerChangeGrayScaledCallBack, eventId, action, context);
                        registredEvent.eventOrigin = olLayer;
                        registredEvent.eventType = "change:" + obsProperty;
                        registredEvent.eventOrigin.addEventListener(registredEvent.eventType, layerChangeGrayScaledCallBack, this);
                    } else {
                        var callbackLayerChanged = function (olEvt) {
                            // la fonction _getCommonLayerParams permet de faire la conversion
                            // propriete ol => propriete commune
                            var oldOlObj = {};
                            oldOlObj[olEvt.key] = olEvt.oldValue;
                            var oldCommonProp = map._getCommonLayerParams(oldOlObj);
                            var newOlObj = {};
                            newOlObj[olEvt.key] = olLayer.get(olEvt.key);
                            var newCommonProp = map._getCommonLayerParams(newOlObj);
                            action.call(context, {
                                property : OlMap.LAYERPROPERTIES[olEvt.key],
                                oldValue : oldCommonProp[OlMap.LAYERPROPERTIES[olEvt.key]],
                                newValue : newCommonProp[OlMap.LAYERPROPERTIES[olEvt.key]],
                                layerChanged : layerOpts
                            });
                        };

                        olEventKey = olLayer.on("change:" + obsProperty, callbackLayerChanged);
                        this._registerEvent(olEventKey, eventId, action, context);
                    }
                },
                map);
            }
            // }
            olEventKey = null;
            break;
        case "controlChanged" :
            break;
        default :
            this.logger.info("unhandled event : " + eventId);
    };
    // enregistrement de l'evenement
    if (olEventKey) {
        this._registerEvent(olEventKey, eventId, action, context);
    }
};

/**
 * Cancel an event listening.
 *
 * @param {String} eventId - The map's event to forget. Possible values are :
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
OlMap.prototype.forget = function (eventId, action) {
    this.logger.trace("[OlMap] : forget...");

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
            this.logger.trace("[OlMap] : forgetting : " + eventId + " (" + evKey + ")");
            olObservableUnByKey(evKey);
        }
    }
};

/**
 * Activate / Deactivate the ability to navigate on the map with mouse or pointer interaction.
 *
 * @param {Boolean} controlOpts - true for activation / false otherwise.
 *
 * @return {Object[]} interactions
 */
OlMap.prototype.setDraggable = function (controlOpts) {
    return this._toggleInteractions("draggable", controlOpts);
};

/**
 * Activate / Deactivate the ability to navigate on the map with keyborad.
 *
 * @param {Boolean} controlOpts - true for activation / false otherwise.
 *
 * @return {Object[]} interactions
 */
OlMap.prototype.setKeyboard = function (controlOpts) {
    return this._toggleInteractions("keyboard", controlOpts);
};

/**
 * Activate / Deactivate the ability to select features on the map.
 *
 * @param {Boolean} controlOpts - true for activation / false otherwise.
 *
 * @return {Object[]} interactions
 */
OlMap.prototype.setSelectable = function (controlOpts) {
    return this._toggleInteractions("selectable", controlOpts);
};

/**
 * Active / desactive les interactions correspondant à controlId
 *
 * @param {String} controlId - identifiant du controle
 * @param {Boolean} controlOpts - etat à positionner pour les interactions.
 *
 * @return {Object[]} interactions
 */
OlMap.prototype._toggleInteractions = function (controlId, controlOpts) {
    var interactions = this.getLibMapControl(controlId);
    if (interactions == null) {
        interactions = [];
        // les interactions ne sont pas sur la carte, on les rajoute, quitte à les désactiver après !
        for (var i = 0; i < OlMap.CONTROLSCLASSES[controlId].length; i++) {
            this.logger.trace("[OlMap] : adding interaction " + OlMap.CONTROLSCLASSES[controlId][i].name + " to the map.");
            var interaction = new OlMap.CONTROLSCLASSES[controlId][i]();
            this.libMap.addInteraction(interaction);
            interactions.push(interaction);
        }
    }
    // on active / desactive toutes les interactions correspondantes
    for (var ii = 0; ii < interactions.length; ii++) {
        var _interaction = interactions[ii];
        this.logger.trace("[OlMap] : setting interaction to " + controlOpts + " for control : " + controlId);
        _interaction.setActive(controlOpts);
    }
    return interactions;
};

/**
 * get layer params from OL layer params
 * opacity, visibility, minZoom, maxZoom
 *
 * @param {Object} olLayerOpts - options of the layer
 * @returns {Gp.LayerOptions} - object with common options
 *
 * @private
 */
OlMap.prototype._getCommonLayerParams = function (olLayerOpts) {
    var commonOpts = {};
    this.logger.trace("[OlMap] : _getCommonLayerParams ");
    if (olLayerOpts.hasOwnProperty("opacity")) {
        this.logger.trace("[OlMap] : _getCommonLayerParams - opacity : " + olLayerOpts.opacity);
        commonOpts.opacity = olLayerOpts.opacity;
    }
    if (olLayerOpts.hasOwnProperty("visible")) {
        this.logger.trace("[OlMap] : _getCommonLayerParams - visibility : " + olLayerOpts.visible);
        commonOpts.visibility = olLayerOpts.visible;
    }
    if (olLayerOpts.hasOwnProperty("zIndex")) {
        this.logger.trace("[OlMap] : _getCommonLayerParams - position : " + olLayerOpts.zIndex);
        commonOpts.position = olLayerOpts.zIndex;
    }
    if (olLayerOpts.hasOwnProperty("mapbox-status")) {
        this.logger.trace("[OlMap] : _getCommonLayerParams - mapbox-status : " + olLayerOpts["mapbox-status"]);
        commonOpts["mapbox-status"] = olLayerOpts["mapbox-status"];
    }
    if (olLayerOpts.hasOwnProperty("maxResolution")) {
        var minZoom = this._getZoomFromResolution(olLayerOpts.maxResolution);
        this.logger.trace("[OlMap] : _getCommonLayerParams - minZoom : " + minZoom);
        commonOpts.minZoom = minZoom;
    }
    if (olLayerOpts.hasOwnProperty("minResolution")) {
        var maxZoom = this._getZoomFromResolution(olLayerOpts.minResolution);
        this.logger.trace("[OlMap] : _getCommonLayerParams - maxZoom : " + maxZoom);
        commonOpts.maxZoom = maxZoom;
    }

    return commonOpts;
};
