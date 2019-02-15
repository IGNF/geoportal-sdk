/* global __SWITCH2D3D_ALLOWED__ */

import Logger from "../Utils/LoggerByDefault";
import { transform as olTransformProj } from "ol/proj";
import {Services, ProxyUtils} from "geoportal-extensions-openlayers";
import {MapLoader} from "../Utils/MapLoader";

/**
 * Reloads the map with a new cartographic library. The current view options (camera position, layers, controls) will be conserved.
 * This function only works with the GpSDK3D bundle (run the "build:3d" npm task to generate it)
 *
 * @param {Integer} viewMode - The cartographic view mode. "2d" (for a 2D map) or "3d" (for a 3D map).
 *
 * @return {Object} the new map
 */
var switch2D3D = function (viewMode) {
    var oldMap = {};
    oldMap.projection = this.getProjection();
    oldMap.center = this.getCenter();
    oldMap.tilt = this.getTilt();
    oldMap.azimuth = this.getAzimuth();
    oldMap.zoom = this.getZoom();
    oldMap.layersOptions = this.getLayersOptions();
    oldMap.controlsOptions = this.getControlsOptions();
    oldMap.mapDiv = this.div.id;
    oldMap.apiKey = this.apiKey;
    oldMap.enginePath3d = this.mapOptions.enginePath3d || null;
    oldMap.enableRotation = this.mapOptions.enableRotation !== undefined ? this.mapOptions.enableRotation : null;

    // remove old controls and associated listeners
    for (var controlId in oldMap.controlsOptions) {
        this.removeControls(controlId);
    }
    if (viewMode === "3d") {
        // récupération des couches 3D qui n'étaient pas affichées en 2D
        if (this._3Dlayers) {
            for (var l = 0; l < this._3Dlayers.length; l++) {
                oldMap.layersOptions[this._3Dlayers[l].id] = this._3Dlayers[l].options;
            }
        }
        oldMap.center = [oldMap.center.x, oldMap.center.y];
        // transformation des coordonnées de planes en géographiques
        // FIXME : ne devrait pas se faire avec ol.proj mais avec proj4 car dans IMap, ol n'est pas forcement chargée !
        var lonlat = olTransformProj(oldMap.center, oldMap.projection, "EPSG:4326");
        oldMap.center = {
            x : lonlat[0],
            y : lonlat[1]
        };
        oldMap.azimuth = this.getAzimuth();
        this.libMap.setTarget(null);
    } else if (viewMode === "2d") {
        oldMap.center = [oldMap.center.lon, oldMap.center.lat];
        // transformation des coordonnées de géographiques en planes
        // FIXME : ne devrait pas se faire avec ol.proj mais avec proj4 car dans IMap, ol n'est pas forcement chargée !
        var xy = olTransformProj(oldMap.center, "EPSG:4326", "EPSG:3857");
        oldMap.center = {
            x : xy[0],
            y : xy[1]
        };
        // 1 - suppression de tous les listeners
        for (var listeners in this._events) {
            var keyIdx = 0;
            var eventName = Object.keys(this._events)[keyIdx];
            for (var i = 0; i < this._events[listeners].length; i++) {
                this.forget(eventName, this._events[listeners][i].action);
            }
            keyIdx++;
        }
        // 2 - suppression de la div
        while (this.div.firstChild) {
            this.div.removeChild(this.div.firstChild);
        }
    } else {
        this.logger.info("Unknown viewing mode");
        return;
    }
    // this.libMap = null;
    var newMap = MapLoader.load(
        // FIXME faut-il rajouter un acces aux clés API directement dans Map getApiKeys()
        // this.libMap.getApiKeys(),
        // FIXME faut-il rajouter un acces à la div directement dans Map getDiv()
        // this.libMap.getDiv(),
        oldMap.mapDiv,
        // récupére le paramétrage courant de la carte (par les librairies) et pas le paramétrage initial (par this.mapOptions)
        {
            apiKey : oldMap.apiKey,
            enginePath3d : oldMap.enginePath3d,
            enableRotation : oldMap.enableRotation,
            projection : oldMap.projection,
            center : oldMap.center,
            azimuth : oldMap.azimuth,
            tilt : oldMap.tilt,
            zoom : oldMap.zoom,
            // maxZoom : this.
            // minZoom : this.
            // markerOptions :
            viewMode : viewMode,
            // proxyUrl
            // noProxyDomains
            // reloadConfig
            // FIXME autoconfUrl ou configUrl ?
            layersOptions : oldMap.layersOptions,
            controlsOptions : oldMap.controlsOptions
            // mapEventsOptions :
        }
    );
    return newMap;
};

/**
 * Map Object. Returned by {@link module:Map Gp.Map.load()} function. Provides methods to interact with map view.
 *
 * @param {Object} opts - map options
 *
 * @namespace
 * @alias Gp.Map
 */
function IMap (opts) {
    if (!(this instanceof IMap)) {
        throw new TypeError("IMap constructor cannot be called as a function.");
    }

    // sauvegarde des options du constructeur.
    this._opts = opts;

    // logger
    this.logger = Logger.getLogger("IMap");
    this.logger.trace("[Constructeur IMap (options)]");

    /**
     * Couches enregistrées par le SDK
     * Structure des objets stockés :
     * {
     *     id : layerId
     *     obj : objet couche géré par l'implémentation.
     *     options : propriétés de la couche (de type layerOptions)
     * }
     */
    this._layers = [];

    /**
     * Couches enregistrées par le SDK et supprimées
     * Structure des objets stockés :
     * {
     *     id : layerId
     *     obj : objet couche géré par l'implémentation.
     *     options : propriétés de la couche (de type layerOptions)
     * }
     */
    this._layersRemoved = [];

    /**
     * Controlss enregistrés par le SDK
     * Structure des objets stockés :
     * {
     *     id : controlId
     *     obj : objet control géré par l'implémentation.
     *     options : propriétés du controle (de type controlOptions)
     * }
     */
    this._controls = [];

    /**
     * object d'enriegistrements des evenements.
     * Les propriétés sont les identifiants de l'evenement associées à un tableau :
     * "eventId" : [{
     *      action : // function
     *      key : "clef retournée par OL pour l'enregistrement de l'evt"
     *      context : objet d'execution de l'action
     *  }]
     */
    this._events = {};

    if (this._opts.mapOptions) {
        this.apiKey = this._opts.mapOptions.apiKey;
    }
    this.div = this._opts.div;

    // récupère les options par défaut pour les paramètres optionnels
    // /!\ on duplique l'objet pour ne pas partager les mêmes options entre
    //     differentes cartes.
    this.mapOptions = Object.create(IMap.DEFAULTOPTIONS);

    // et on ajoute les options en paramètres aux options par défaut
    for (var opt in this._opts.mapOptions) {
        if (this._opts.mapOptions.hasOwnProperty(opt)) {
            this.mapOptions[opt] = this._opts.mapOptions[opt];
            // FIXME : ne marche qu'au premier niveau...
            this.logger.trace("option " + opt + " récupérée");
        }
    }

    // intialisation de la carte (à vide)
    this._initMap();

    if (__SWITCH2D3D_ALLOWED__) {
        this.switch2D3D = switch2D3D.bind(this);
    }
};

/**
 * Options par défaut du service
 * (pour les options facultatives seulement)
 * @private
 */
IMap.DEFAULTOPTIONS = {
    projection : "EPSG:3857",
    center : {
        x : 0,
        y : 0,
        projection : "EPSG:4326",
        geolocate : false,
        location : null,
        locationType : ["StreetAddress", "PositionOfInterest"]
    },
    azimuth : 0,
    enableRotation : true,
    tilt : 0,
    zoom : 10,
    minZoom : 0,
    maxZoom : 21,
    reloadConfig : false,
    controlsOptions : {
        draggable : true,
        keyboard : true,
        selectable : true
    },
    mapEventsOptions : {},
    noProxyDomains : ["wxs.ign.fr"]
};

IMap.prototype = {

    /*
     * Constructeur (alias)
     */
    constructor : IMap,

    /**
     * Map initialisation with constructor parameters (after _initMap call)
     * needed for asynchronous _initMap implementation.
     *
     * @private
     */
    _afterInitMap : function () {
        // abonnement aux evenements demandes
        var meOptions = this.mapOptions.mapEventsOptions;
        if (meOptions) {
            for (var evtId in meOptions) {
                this.listen(evtId, meOptions[evtId], this);
            }
        }

        // abonnement perso à l'evnement layerChanged pour tenir à jour l'objet this._layers
        this.listen("layerChanged", this._onLayerChanged, this);

        // centrage avec les coordonnées x, y (s'il y en a)
        this.setXYCenter(this.mapOptions.center);

        // FIXME Config est créé en runtime dans la variable globale Gp
        var scope = typeof window !== "undefined" ? window : {};
        var Config = scope.Gp ? scope.Gp.Config : undefined;

        // Gestion du paramètre apiKeys
        var needsGetConfig = false;
        if (this.apiKey ||
            this._opts.mapOptions.configUrl ||
            this._opts.mapOptions.autoconfUrl) { // une clef est fournie
            // on recharge l'autoconf si l'utilisateur l'a demandé
            // ou si aucun n'appel d'autoconf n'a ete fait pour cette cle
            // TODO : this.apiKey.length > 1
            needsGetConfig = (this._opts.reloadConfig ||
                              !Config ||
                              !Config.isConfLoaded((Array.isArray(this.apiKey) ? this.apiKey[0] : this.apiKey))
            );
        } else { // une clef n'est pas fournie
            // on essaye de trouver une configuration existante
            if (Config) {
                this.apiKey = Object.keys(Config.generalOptions.apiKeys);
            }
        }

        // appel du service d'autoconfiguration si nécessaire
        // Dans tous les cas, le reste s'exécute dans _afterGetConfig
        if (needsGetConfig) {
            // autoconf locale ? on met par defaut un callbackSuffix à ""
            // à moins qu'on ne le surcharge (non documenté).
            var callbackSuffix = this._opts.mapOptions.callbackSuffix;
            // deprecated param autoconfUrl
            if (this._opts.mapOptions.configUrl ||
                this._opts.mapOptions.autoconfUrl) {
                callbackSuffix = callbackSuffix || "";
            }
            var map = this;
            Services.getConfig({
                apiKey : this.apiKey,
                serverUrl : this._opts.mapOptions.configUrl || this._opts.mapOptions.autoconfUrl,
                callbackSuffix : callbackSuffix,
                // fonction de rappel onSuccess
                onSuccess : function (configResponse) {
                    map._afterGetConfig(configResponse);
                },
                // fonction de rappel onSuccess
                onFailure : function (error) {
                    this.logger.info(error);
                    map._afterGetConfig(null);
                }
            });
        } else {
            this._afterGetConfig(Config);
        }
    },

    /**
     * callback d'appel à l'autoconf (ou non).
     *
     * @param {Object} configResponse - configuration associée à apiKey.
     * @private
     */
    _afterGetConfig : function (configResponse) {
        this.logger.trace("[IMap] : Autoconfiguration chargée ... ou pas");
        // TODO : detecter si on a le bon objet (error ou success)

        // declenchement de l'evenement "configured"
        var e = IMap.CustomEvent("configured", {
            detail : {
                config : configResponse
            }
        });
        this.div.dispatchEvent(e);

        // recuperation couche par defaut si aucune specifiee
        if (configResponse && !this.mapOptions.hasOwnProperty("layersOptions")) {
            // FIXME : trouver l'info dans l'autoconf ... ou pas ?
            this.mapOptions.layersOptions = {
                "ORTHOIMAGERY.ORTHOPHOTOS" : {}
            };
        }

        // recuperation du centre par défaut si aucun spécifié
        if (configResponse &&
            (!this.mapOptions.center.hasOwnProperty("x") || this.mapOptions.center.x === 0) &&
            (!this.mapOptions.center.hasOwnProperty("y") || this.mapOptions.center.y === 0)) {
            var autoconfCenter;
            var territories = configResponse.getTerritories();
            for (var terrCode in territories) {
                if (territories[terrCode].isDefault) {
                    autoconfCenter = territories[terrCode].geoCenter;
                    // autoconfProj = territories[terrCode].defaultCRS;
                }
            }
            this.logger.trace("[IMap] : _afterGetConfig : setting default map center to (" + autoconfCenter.lon + ", " + autoconfCenter.lat + ")");
            this.mapOptions.center.x = autoconfCenter.lon;
            this.mapOptions.center.y = autoconfCenter.lat;
            this.mapOptions.center.projection = "EPSG:4326";
        }

        // Centrage de la carte avec les options demandées
        this.setCenter(this.mapOptions.center);

        // ajout des markers : TODO
        if (this.mapOptions.hasOwnProperty("markersOptions")) {
            this._addMarkers(this.mapOptions.markersOptions);
        }

        // ajout des couches
        this.addLayers(this.mapOptions.layersOptions);

        // ajout des controles
        // ... par defaut
        this.addControls(this._getDefaultControls());
        // ceux demandés par l'utilisateur
        this.addControls(this.mapOptions.controlsOptions);

        // declenchement de l'evenement "mapLoaded"
        var eMapLoaded = IMap.CustomEvent("mapLoaded", {
            detail : {
                map : this
            }
        });
        this.div.dispatchEvent(eMapLoaded);
    },

    /**
     * Empty Map initialization : abstract
     * Implementation has to call _afterInitMap() function.
     *
     * @private
     */
    _initMap : function () {
        this.logger.trace("[IMap] : _initMap");
    },

    /**
     * ajoute un proxy aux url des couches vecteurs si besoin.
     *
     * @param {String} url - url
     *
     * @return {String} proxified url
     *
     * @private
     */
    setProxy : function (url) {
        return ProxyUtils.proxifyUrl(url, this.mapOptions);
    },

    /**
     * Returns the current viewing mode (either 2D or 3d).
     *
     * @returns {String} - The current viewing mode
     * @private
     */
    getViewMode : function () {
        return this.mapOptions.viewMode;
    },

    /**
     * Returns wrapped map object implemented by the underlying library. Can be :
     * - an [ol.Map](http://openlayers.org/en/latest/apidoc/ol.Map.html) object with current OpenLayers 3 implementation if the current map is in 2D.
     * - an [Itowns.GlobeView](https://www.itowns-project.org/itowns/API_Doc/GlobeView.html) object, ie the iTowns GlobeView object overloaded by Geoportal Extension for iTowns, if the current map is in 3D.
     *
     * @returns {Object} wrapped map object.
     */
    getLibMap : function () {
        // TO BE OVERRIDDEN
        return {};
    }
};

export {IMap};
