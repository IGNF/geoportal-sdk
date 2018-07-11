import {IMap} from "./IBase";

/**
 * cree un CustomEvent de maniere IE compatible
 *
 * @param {String} eventId - event id
 * @param {Object} eventObj - event
 *
 * @return {Object} custom event
 *
 * @private
 */
IMap.CustomEvent = function (eventId, eventObj) {
    // creation d'un CustomEvent "IE" compatible
    // cf. http://caniuse.com/#feat=customevent
    // cf. https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
    if (typeof CustomEvent === "function") {
        eventObj.bubbles = false;
        eventObj.cancelable = true;
        return new CustomEvent(eventId, eventObj);
    }
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent(eventId,
        false,
        true,
        eventObj.detail
    );
    return e;
};

/**
 * Activate / Deactivate the ability to navigate on the map with mouse or pointer interaction.
 *
 * @param {Boolean} controlOpts - true for activation / false otherwise.
 * @private
 */
IMap.prototype.setDraggable = function (controlOpts) {};

/**
 * Activate / Deactivate the ability to navigate on the map with keyborad.
 *
 * @param {Boolean} controlOpts - true for activation / false otherwise.
 * @private
 */
IMap.prototype.setKeyboard = function (controlOpts) {};

/**
 * Activate / Deactivate the ability to select features on the map.
 *
 * @param {Boolean} controlOpts - true for activation / false otherwise.
 * @private
 */
IMap.prototype.setSelectable = function (controlOpts) {};

/**
 * Associate a function to trigger when an event is received.
 *
 * @param {String} eventId - The map's event listened. Possible values are :
 *
 *
 * ** Common 2D/3D events **
 *
 * | eventId  | description |
 * |-|-|
 * | mapLoaded | fired when map has finished loading.  |
 * | geolocated | fired when map has finished centering by geolocation. Callback function handles a {@link Gp.GeolocatedEvent} object.|
 * | located | fired when map has finished centering by geocoding. Callback function handles a {@link Gp.LocatedEvent} object. |
 * | configured | fired when map has finished loading geoportal configuration. Callback function handles a {@link Gp.ConfiguredEvent} object |
 * | centerChanged | fired when map center has changed. Callback function handles a {@link Gp.CenterChangedEvent} object |
 * | zoomChanged | fired when map zoom has changed. Callback function handles a {@link Gp.ZoomChangedEvent} object |
 * | azimuthChanged | fired when map orientation has changed. Callback function handles a {@link Gp.AzimuthChangedEvent} object |
 * | layerChanged | fired when map's layer(s) has changed someway. Callback function handles a {@link Gp.LayerChangedEvent} object |
 *
 * ** Specific 3D events **
 *
 * | eventId  | description |
 * |-|-|
 * | tiltChanged | fired when map tilt has changed. Callback function handles a {@link Gp.TiltChangedEvent} object |
 *
 *
 * @param {Function} action - The function to execute when the event occures.
 * @param {Object} context - The object that will be used as "this" in the action function
 *
 * @return {Boolean} indicates if an event has been listened
 */
IMap.prototype.listen = function (eventId, action, context) {
    // verifications de base
    if (typeof action !== "function") {
        this.logger.info("no action provided for event : " + eventId);
        return false;
    }
    context = context || this;
    var map = this;
    switch (eventId) {
        case "mapFailure" :
            break;
        case "mapLoaded" :
        case "geolocated" :
        case "located" :
        case "configured" :
            this.logger.trace("[IMap] listening event : [" + eventId + "]");

            var callBack = function (evt) {
                action.call(context, evt.detail);
            };

            var registredEvent = map._registerEvent(callBack, eventId, action, context);
            registredEvent.eventOrigin = this.div;
            registredEvent.eventType = eventId;
            registredEvent.eventOrigin.addEventListener(registredEvent.eventType, callBack, this);
            break;
        case "centerChanged" :
        case "zoomChanged" :
        case "azimuthChanged" :
        case "tiltChanged" :
        case "layerChanged" :
            // evenements traites par l'implementation
            break;
        case "projectionChanged" :
        case "controlChanged" :
            // Interet de ces evenements ?
            break;
        default :
            this.logger.info("unhandled event : " + eventId);
            return false;
    };
    return true;
};

/**
 * Cancels an event listening previousely set with [Gp.Map.listen()](Gp.Map.html#listen) method.
 *
 * @param {String} eventId - The map's event to forget. Possible values are :
 *
 * ** Common 2D/3D events **
 *
 * | eventId  | description |
 * |-|-|
 * | mapLoaded | fired when map has finished loading |
 * | geolocated | fired when map has finished centering by geolocation |
 * | located | fired when map has finished centering by geocoding |
 * | configured | fired when map has finished loading geoportal configuration |
 * | centerChanged | fired when map center has changed |
 * | zoomChanged | fired when map zoom has changed |
 * | azimuthChanged | fired when map orientation has changed |
 * | layerChanged | fired when map's layer(s) has changed someway |
 *
 * ** Specific 3D events **
 *
 * | eventId  | description |
 * |-|-|
 * | tiltChanged | fired when map tilt has changed |
 * @param {Function} action - The function associated to the event.
 *
 * @return {Boolean} indicates if an event has been forgotten
 */
IMap.prototype.forget = function (eventId, action) {
    // verifications de base
    if (typeof action !== "function") {
        this.logger.info("no action provided for event : " + eventId);
        return false;
    }
    switch (eventId) {
        case "mapLoaded" :
        case "geolocated" :
        case "located" :
        case "configured" :
        case "mapFailure" :
        case "centerChanged" :
        case "zoomChanged" :
        case "azimuthChanged" :
        case "tiltChanged" :
        case "projectionChanged" :
        case "layerChanged" :
        case "controlChanged" :
        case "pickFeature" :
            // on cherche l'enregistrement de l'evenement
            var rEvents = this._events[eventId];
            if (!rEvents) {
                this.logger.info("nothing to forget for  : " + eventId);
                return false;
            }
            var itCallback = null;
            for (var i = rEvents.length - 1; i >= 0; i--) {
                if (rEvents[i].action == action) {
                    if (!rEvents[i].eventOrigin) {
                        continue;
                    }
                    itCallback = rEvents[i].key;
                    var eventOrigin = rEvents[i].eventOrigin;
                    var eventType = rEvents[i].eventType;
                    if (!itCallback) {
                        this.logger.info("action to forget not found for  : " + eventId);
                        return false;
                    }
                    rEvents.splice(i, 1);
                    this.logger.trace("[IT]  : forgetting  : " + eventId + " (" + itCallback + ")");

                    eventOrigin.removeEventListener(eventType, itCallback);
                }
            }
            if (!rEvents) {
                this.logger.info("action to forget not found for  : " + eventId);
                return false;
            }
            break;
        default :
            this.logger.info("unhandled event : " + eventId);
            return false;
    };
    return true;
};

/**
 * Ecouteur de changements sur les couches pour gerer le tableau this._layers.
 *
 * @param {Gp.LayerChangedEvent} evt - evenement de changement sur les couches
 * @private
 */
IMap.prototype._onLayerChanged = function (evt) {
    var layerOpts = null;
    var idx = -1;
    var layerId = null;
    if (evt.hasOwnProperty("layerAdded")) {
        layerOpts = evt.layerAdded;
        idx = this._getLayerIndexByLayerOpts(layerOpts);
        this.logger.trace("[IMap] _onLayerChanged : layerAdded : " + idx);
        if (idx >= 0 && idx < this._layers.length) {
            layerId = this._layers[idx].id;
            this._layers[idx].options.position = evt.position;
            this.logger.trace("[IMap] _onLayerChanged : setting position value to " + evt.position + " for layer : " + layerId);
        } else {
            this.logger.warn("[IMap] _onLayerChanged : layerOpts (" + Object.keys(layerOpts)[0] + ") not found for layerAdded Event");
        }
    } else if (evt.hasOwnProperty("layerRemoved")) {
        layerOpts = evt.layerRemoved;
        idx = this._getLayerIndexByLayerOpts(layerOpts);
        if (idx >= 0 && idx < this._layers.length) {
            this.logger.trace("[IMap] _onLayerChanged : removing layer at index " + idx);
            // il faut garder trace de la couche supprimmée pour
            // d'autres abonnements à layerChanged.layerRemoved
            var layerRemoved = {};
            layerRemoved["id"] = this._layers[idx].id;
            layerRemoved["options"] = this._layers[idx].options;
            layerRemoved["obj"] = this._layers[idx].obj;
            this._layersRemoved.push(layerRemoved);
            this._layers.splice(idx, 1);
            this.logger.trace("[IMap] _onLayerChanged : #(layers) == " + this._layers.length);
        } else {
            this.logger.warn("[IMap] _onLayerChanged : layerOpts not found for layerRemoved Event");
        }
    } else if (evt.hasOwnProperty("layerChanged")) {
        layerOpts = evt.layerChanged;
        var idxx = this._getLayerIndexByLayerOpts(layerOpts);
        if (idxx >= 0 && idxx < this._layers.length) {
            layerId = this._layers[idxx].id;
            this._layers[idxx].options[evt.property] = evt.newValue;
            this.logger.trace("[IMap] _onLayerChanged : setting " + evt.property + " value to " + evt.newValue + " for layer : " + layerId);
        } else {
            this.logger.warn("[IMap] _onLayerChanged : layerOpts (" + Object.keys(layerOpts)[0] + ") not found for layerChanged Event");
        }
    }
};

/**
 * enregistre un evenement avec sa clef, sa fonction et sonID
 *
 * @param {Object} eventKey - ol layer
 * @param {String} eventId - id evenement pour le SDK
 * @param {Function} action - fonction associée à l'evt
 * @param {Object} context - contexte d'execution de l'action (context == this)
 *
 * @return {Object} the registred event
 * @private
 */
IMap.prototype._registerEvent = function (eventKey, eventId, action, context) {
    this.logger.trace("[IMap] : listen registering : " + eventKey);
    if (eventKey) {
        if (!this._events.hasOwnProperty(eventId)) {
            this._events[eventId] = [];
        }
        this._events[eventId].push({
            action : action,
            key : eventKey,
            context : context
        });
    }

    return this._events[eventId][this._events[eventId].length - 1];
};

/**
 *  Remove and re-initialize layerChanged event
 *
 * @private
 */
IMap.prototype._resetLayerChangedEvent = function () {
    // re-abonnement à l'evenement layerChanged
    // nécessaire pour ecouter les changements de propriétés sur la nouvelle couche
    if (this._events.hasOwnProperty("layerChanged")) {
        var actions = [];
        var contexts = [];

        this._events["layerChanged"].forEach(function (eventObj) {
            if (actions.indexOf(eventObj.action) < 0) {
                actions.push(eventObj.action);
                contexts.push(eventObj.context);
            }
        },
        this);
        for (var i = 0; i < actions.length; ++i) {
            // on oublie ...
            this.forget("layerChanged", actions[i]);
            // ... pour mieux se souvenir
            this.listen("layerChanged", actions[i], contexts[i]);
        }
    }
};

/**
 *  Function to disable/enable layer color (grayscale or color mode).
 *
 * @param {String} layerId - layer identifier
 * @param {Boolean} colorToGray - indicate transformation direction (from or to grayscale)
 *
 * @private
 */
IMap.prototype._changeLayerColor = function (layerId, colorToGray) {
};
