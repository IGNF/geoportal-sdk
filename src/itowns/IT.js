define([
    "Utils/LoggerByDefault",
    "it",
    "gp",
    "IMap"
],
function (
    Logger,
    it,
    plugins, // Gp globale !?
    IMap
) {

    "use strict";

    /**
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

        // appel du constructeur par heritage
        IMap.apply(this, arguments);

        this.logger = Logger.getLogger("IT");
        this.logger.trace("[Constructeur IT (options)]");

    }

    /**
     * Proprietes observables des couches pour l'AHN
     */
    IT.LAYERPROPERTIES = {
        visible : "visibility",
        opacity : "opacity"
    };

    /**
     * Association controlId <-> classe VirtualGeo d'implemenation
     */
    /*IT.CONTROLSCLASSES = {
        mouseposition : itowns.MousePosition,
        layerswitcher : itowns.LayerSwitcher
    } ;
    */

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
        this.logger.trace("[IT] : _initMap") ;
        // position à l'initialisation
        var positionOnGlobe = {
            longitude : 0,
            latitude : 0,
            altitude : 25000000
        };

        var viewerDiv = this.div;
        // creation de la map vide
        this.libMap = new itowns.GlobeView(viewerDiv, positionOnGlobe);
        var self = this;
        // when globe is loaded, we set the user map parameters
        this.libMap.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, function () {
            self._afterInitMap();
        });

    } ;

    /**
     * Add a geoportal Layer to the map
     *
     * @param {Object} layerObj - geoportalLayer to add.
     * @param {Gp.LayerOptions} layerObj.geoportalLayerID - options of the layer
     *
     * @private
     */
    IT.prototype._addGeoportalLayer = function (layerObj, layerConf) {
        var layerId = Object.keys(layerObj)[0] ;
        // Si on a bien un objet layerConf passé, on ajoute les params spécifiques Itowns
        if (layerConf) {
            layerObj[layerId].url = layerConf.getServerUrl(layerConf.apiKeys[0]) ;
            layerObj[layerId].outputFormat = layerObj[layerId].outputFormat || layerConf.getDefaultFormat() ;
            // Paramètres spécifiques aux couches WMS pour ajout avec itowns
            if (layerObj[layerId].format === "WMS") {
                layerObj[layerId].version = layerObj[layerId].version || layerConf.serviceParams.version;
                layerObj[layerId].stylesName = layerObj[layerId].stylesName || layerConf.styles;
            }
            // Paramètres spécifiques aux couches WMTS pour ajout avec itowns
            if (layerObj[layerId].format === "WMTS") {
                layerObj[layerId].tileMatrixSet = layerObj[layerId].tileMatrixSet || layerConf.getTMSID() ;
                layerObj[layerId].tileMatrixSetLimits = layerObj[layerId].tileMatrixSetLimits || layerConf.wmtsOptions.tileMatrixSetLimits;
                layerObj[layerId].layer = layerId || layerConf.getName() ;
                layerObj[layerId].styleName = layerObj[layerId].styleName || layerConf.getStyles()[0].name ;
            }
        }
        // Ajout de la couche avec itowns
        this._addRasterLayer(layerObj);

    } ;

    /**
     * Add a Raster Layer to the map
     *
     * @param {Object} layerObj - raster layer to add.
     * @param {Gp.LayerOptions} layerObj.geoportalLayerID - options of the layer
     *
     * @private
     */
    IT.prototype._addRasterLayer = function (layerObj) {
        var layerId = Object.keys(layerObj)[0] ;
        var layerOpts = layerObj[layerId] ;
        var layerNames;
        switch (layerOpts.format.toUpperCase()) {
            case "WMS":
                // FIXME : ajout d'un parametre projection pour les donnees
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
                if (layerOpts.minZoom) {
                    var maxScaleDenominator = this._getResolutionFromZoomLevel(layerOpts.minZoom) / 0.00028;
                }
                if (layerOpts.maxZoom) {
                    var minScaleDenominator = this._getResolutionFromZoomLevel(layerOpts.maxZoom) / 0.00028;
                }
                var layer = {
                    type : layerOpts.type || "color",
                    url : layerOpts.url,
                    protocol : layerOpts.format,
                    id : layerId,
                    name : layerNames,
                    style : layerOpts.styleName || "normal",
                    title : layerOpts.title || layerId,
                    projection : layerOpts.projection || "EPSG:4326",
                    bbox : layerOpts.bbox || [-180, -90, 180, 90],
                    transparent : true,
                    waterMask : false,
                    options : {
                        mimetype : layerOpts.outputFormat
                    },
                    updateStrategy : {
                        type : 0,
                        options : {}
                    },
                    version : layerOpts.version
                };
                break;
            case "WMTS":
                this.logger.trace("ajout d'une couche WMTS");
                // chargement des options par defaut
                var lOpts = this._getWMTSDefaultOpts() ;
                // surcharge avec les options utilisateurs
                for (var opt in layerOpts) {
                    lOpts[opt] = layerOpts[opt];
                }
                layerOpts = lOpts ;
                layer = {
                    type : layerOpts.type || "color",
                    url : layerOpts.url,
                    protocol : layerOpts.format.toLowerCase(),
                    id : layerId,
                    title : layerOpts.title || layerId,
                    updateStrategy : {
                        type : "0",
                        options : {}
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
                break;
            default:
        }
        if (layer) {
            // le controle geoportalAttribution exploite la propriete _originators
            if (layerOpts.hasOwnProperty("originators")) {
                layer._originators = layerOpts.originators ;
            }

            // Dans le cas où aucune opacité n'est spécifiée
            if (!layerOpts.hasOwnProperty("opacity") || typeof(layerOpts.opacity) === "undefined") {
                // on la règle à 1 par défaut
                layerOpts.opacity = 1;
            }

            // Dans le cas où aucune visibilité n'est spécifiée
            if (!layerOpts.hasOwnProperty("visibility") || typeof(layerOpts.visibility) === "undefined") {
                // on la règle à "true" par défaut
                layerOpts.visibility = 1;
            }

            // on met à jour le tableau des couches
            this._layers.push({
                id : layerId,
                options : layerOpts
            }) ;
            if (layerOpts.isElevation === true) {
                // we add the noDataValue if it is given
                if (layerOpts.noDataValue) {
                    layer.noDataValue = layerOpts.noDataValue.toString();
                }
                // we add the noDataValueTolerance if it is given and if a nodata is given
                if (layerOpts.noDataValueTolerance && layerOpts.noDataValue) {
                    layer.noDataValueTolerance = layerOpts.noDataValueTolerance.toString();
                }
                // this will launch the addedLayer callback (dans "IT._onLayerChanged")
                this.libMap.addLayer(layer) ;
                // this.libMap.viewer.init();
            } else {
                var LSControl = this.getLibMapControl("layerswitcher");
                // if the LS already exists, we have to save the conf of the layer to add it to the LS
                if (LSControl) {
                    LSControl._addedLayerConf[layerId] = layerOpts;
                }
                var layerConf = JSON.parse(JSON.stringify(layerOpts));

                // we add the layer and refresh the itowns viewer
                this.libMap.addLayer(layer) ;
            }

        }
    } ;

    /**
     * center Map on a given point
     *
     * @param {Object} point - center point
     * @param {Float} point.x - x coordinates for center
     * @param {Float} point.y - y coordinates for center
     *
     */
    IT.prototype.setXYCenter = function (point) {
        this.logger.trace("[IT] - setXYCenter") ;
        if ( !point.hasOwnProperty("x") || !point.hasOwnProperty("y")) {
            console.log("no valid coordinates for map center") ;
            return ;
        }

        var coordinates = {
            longitude : point.x,
            latitude : point.y
        };
        // set the camera aimed point on the specified coords
        this.libMap.controls.setCameraTargetGeoPositionAdvanced(coordinates, false);
        this.logger.trace("[IT] - setXYCenter(" + point.x + "," + point.y + ")") ;
    };

    /**
     * retourne les coordonnées courantes du centre de la carte
     */
    IT.prototype.getCenter = function () {
        var cameraCenter = this.libMap.controls.getCameraTargetGeoPosition();
        var center = {
            lon : cameraCenter.longitude(),
            lat : cameraCenter.latitude(),
            alt : cameraCenter.altitude()
        };
        return center;
    };

    /**
     * retourne le zoom Géoportail de la carte à partir de l'echelle courante de la carte
     */
    IT.prototype.getZoom = function () {
        // -1 pour se baser sur les zooms Gp
        var zoom = this.libMap.controls.getZoom() - 1;
        return zoom;
    };

    /**
     * Définit le niveau de zoom de la carte
     */
    IT.prototype.setZoom = function (zoom) {
        if ((parseFloat(zoom) !== parseInt(zoom, 10)) || isNaN(zoom)) {
            console.log("no valid zoomLevel") ;
            return ;
        }
        // On utilise la méthode setZoom d'iTowns (+1 pour se baser sur les zooms Gp)
        this.libMap.controls.setZoom(zoom + 1, false);
        this.logger.trace("[IT] - setZoom(" + zoom + ")") ;
    };

    /**
     * Incrémente le niveau de zoom de la carte de 1.
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
     * Décrémente le niveau de zoom de la carte de 1.
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
     * retourne l'azimut courant de la carte
     */
    IT.prototype.getAzimuth = function () {
        return this.libMap.controls.getCameraOrientation()[1];
    };

    /**
     * définit le niveau de zoom de la carte
     */
    IT.prototype.setAzimuth = function (azimuth) {
        if (isNaN(azimuth)) {
            console.log("Not a valid azimuth : must be a float") ;
            return ;
        }
        // IT method to set the camera orientation
        this.libMap.controls.setHeading(azimuth, true);
        this.logger.trace("[VG] - setAzimuth(" + azimuth + ")") ;
    };

    /**
     * retourne l'inclinaison courante de la carte
     */
    IT.prototype.getTilt = function () {
        return this.libMap.controls.getCameraOrientation()[0];
    };

    /**
     * définit l'inclinaison de la caméra
     */
    IT.prototype.setTilt = function (tilt) {
        if (isNaN(tilt) || tilt < 0 || tilt > 90) {
            console.log("no valid tilt angle") ;
            return ;
        }
        // methode setTilt d'itowns pour régler l'inclinaison
        this.libMap.controls.setTilt(tilt, false);
        this.logger.trace("[VG] - setTilt(" + tilt + ")") ;
    };

    /**
     * Remove of the map the layers given as parameters
     *
     * @param {Array.<String>} layerIds - A list of layer's id or null.
     */
    IT.prototype.removeLayers = function (layerIds) {
        if (!IMap.prototype.removeLayers.apply(this,arguments)) {
            return false ;
        }
        if (!Array.isArray(layerIds)) {
            layerIds = [layerIds] ;
        }
        // ici on sait que layerIds est un tableau
        layerIds.forEach(function (_layerId) {
            this.libMap.removeLayer(_layerId) ;
        },
        this) ;

    } ;

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
    IT.prototype.listen = function (eventId, action,context) {
        this.logger.trace("[IT] : listen...") ;
        // verifications de base de la classe mère
        if (!IMap.prototype.listen.apply(this,arguments)) {
            return false ;
        }
        context = context || this ;
        var map = this ;
        var itEventKey = null ;
        switch (eventId) {
            case "mapLoaded" :
            case "mapFailure" :
                break ;
            case "located" :
                // handled in IMap
                break ;
            case "geolocated" :
                // handled in IMap
                break ;
            case "configured" :
                // handled in IMap
                break ;
            case "centerChanged" :
                /**
                * centerChanged callback
                */
                var callBackCenterChanged = function (itEvent) {
                    var centerChangedEvt = {} ;
                    if (!itEvent) {
                        return;
                    }
                    if (itEvent.previous) {
                        var oldCoords = itEvent.previous.cameraTarget.as("EPSG:4326");
                        centerChangedEvt.oldCenter = {
                            x : oldCoords.longitude(),
                            y : oldCoords.latitude()
                        } ;
                    }

                    if (itEvent.new) {
                        var newCoords = itEvent.new.cameraTarget.as("EPSG:4326");
                        centerChangedEvt.newCenter = {
                            x : newCoords.longitude(),
                            y : newCoords.latitude()
                        } ;
                    }
                    action.call(context,centerChangedEvt) ;
                };
                // ajout de l'evenement au tableau des événements
                this._registerEvent(callBackCenterChanged,eventId,action,context) ;
                this.libMap.controls.addEventListener("camera-target-changed", callBackCenterChanged, this) ;
                break ;
            case "zoomChanged" :
                var oldZoom = this.libMap.controls.getZoom();
                /**
                * zoomChanged callback
                */
                var callbackZoomchange = function (itEvent) {
                    // on récupère le zoom
                    var newZoom = context.libMap.controls.getZoom();
                    // si le zoom n'a pas changé, on sort
                    if (newZoom === oldZoom) {
                        return;
                    }
                    action.call(context,{
                        oldZoom : oldZoom,
                        newZoom : newZoom
                    }) ;
                    // update the oldZoom vale
                    oldZoom = newZoom;
                };

                // ajout de l'evenement au tableau des événements
                this._registerEvent(callbackZoomchange,eventId,action,context) ;
                // on écoute le range (et non le zoom, non implémenté côté itowns)
                this.libMap.controls.addEventListener("range-changed", callbackZoomchange, this);
                break ;
            case "azimuthChanged" :
                /**
                * azimuthChanged callback
                */
                var callbackAzimuthchange = function (itEvent) {
                    if (itEvent.new.heading === itEvent.previous.heading) {
                        return;
                    }
                    action.call(context,{
                        oldAzimuth : itEvent.previous.heading,
                        newAzimuth : itEvent.new.heading
                    }) ;
                };
                // ajout de l'evenement au tableau des événements
                this._registerEvent(callbackAzimuthchange,eventId,action,context) ;
                this.libMap.controls.addEventListener("orientation-changed", callbackAzimuthchange, this);
                break ;
            case "tiltChanged" :
                /**
                * tiltChanged callback
                */
                var callbackTiltchange = function (itEvent) {
                    if (itEvent.new.tilt === itEvent.previous.tilt) {
                        return;
                    }
                    action.call(context,{
                        oldTilt : itEvent.previous.tilt,
                        newTilt : itEvent.new.tilt
                    }) ;
                };
                // ajout de l'evenement au tableau des événements
                this._registerEvent(callbackTiltchange,eventId,action,context) ;
                this.libMap.controls.addEventListener("orientation-changed", callbackTiltchange, this);
                break ;
            case "projectionChanged" :
                // TODO : interet ?
                break ;
            case "layerChanged" :
                break ;
            case "controlChanged" :
                break ;
            default :
                console.log("unhandled event : " + eventId ) ;
        } ;
        // enregistrement de l'evenement
        if (itEventKey) {
            this._registerEvent(itEventKey,eventId,action,context) ;
        }
        return true ;
    } ;

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
    IT.prototype.forget = function (eventId, action) {
        // interface entre les Ids de l'AHN et ceux de VG
        var eventsMapping = {
            tiltChanged : {
                id : "orientation-changed",
                parent : this.libMap.controls
            },
            azimuthChanged : {
                id : "orientation-changed",
                parent : this.libMap.controls
            },
            zoomChanged : {
                id : "range-changed",
                parent : this.libMap.controls
            },
            centerChanged : {
                id : "camera-target-changed",
                parent : this.libMap.controls
            }
        };
        this.logger.trace("[IT] : forget...") ;
        // verifications de base de la classe mère
        if (!IMap.prototype.forget.apply(this,arguments)) {
            return false ;
        }
        // on cherche l'enregistrement de l'evenement
        var rEvents = this._events[eventId] ;
        if (!rEvents) {
            console.log("nothing to forget for : " + eventId) ;
            return false ;
        }
        var itCallback = null;
        for (var i = 0 ; i < rEvents.length ; i ++) {
            if (rEvents[i].action == action) {
                itCallback = rEvents[i].key ;
                if (!itCallback) {
                    console.log("action to forget not found for : " + eventId) ;
                    return false ;
                }
                rEvents.splice(i,1) ;
                this.logger.trace("[IT] : forgetting : " + eventId + " (" + itCallback + ")") ;
                var eventOrigin = eventsMapping[eventId].parent;
                eventOrigin.removeEventListener(eventsMapping[eventId].id, itCallback);
                // on decale i d'un cran en arriere pour ne pas sauter d'elements
                i -= 1 ;
            }
        }
        if (!rEvents) {
            console.log("action to forget not found for : " + eventId) ;
            return false ;
        }

    } ;

    /**
     * retourne l'objet Itowns.GlobeView
     */
    IT.prototype.getLibMap = function () {
        return this.libMap;
    };

    return IT;
});
