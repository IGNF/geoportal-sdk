/* global __SWITCH2D3D_ALLOWED__ */
import Logger from "../Utils/LoggerByDefault";
import { transform as olTransformProj } from "ol/proj";
import {
    Services,
    ProxyUtils
} from "geoportal-extensions-openlayers";
import { MapLoader } from "../Utils/MapLoader";

/**
 * Reloads the map with a new cartographic library. The current view options (camera position, layers, controls) will be conserved.
 * This function only works with the GpSDK3D bundle (run the "build:3d" npm task to generate it)
 *
 * @param {String} viewMode - The cartographic view mode. "2d" (for a 2D map) or "3d" (for a 3D map).
 *
 * @return {Object} the new map
 * @static
 * @private
 */
var switch2D3D = function (viewMode) {
    var oldMap = {};
    oldMap.projection = this.getProjection();
    oldMap.center = this.getCenter();
    oldMap.tilt = this.getTilt();
    oldMap.azimuth = this.getAzimuth();
    oldMap.zoom = this.getZoom();
    oldMap.layersOptions = this.getLayersOptions();
    oldMap.markersOptions = this.getMarkersOptions();
    oldMap.controlsOptions = this.getControlsOptions();
    oldMap.mapDiv = this.div.id;
    oldMap.apiKey = this.apiKey;
    oldMap.extent = this.mapOptions.extent;
    oldMap.isWebGL2 = this.mapOptions.isWebGL2;
    oldMap.enableRotation = this.mapOptions.enableRotation !== undefined ? this.mapOptions.enableRotation : null;
    oldMap.mapEventsOptions = this.mapOptions.mapEventsOptions !== undefined ? this.mapOptions.mapEventsOptions : null;

    // add all compute layer to 3D map with layersOptions
    if (viewMode === "3d") {
        for (var index = 0; index < this._layers.length; index++) {
            var layer = this._layers[index];
            // traitement des couches de calcul
            if (layer.options.format.toUpperCase() === "COMPUTE") {
                // INFO :
                // les styles pour la 2D et 3D sont ajoutés à la volée,
                // une evolution est à mettre en place sur les contrôles,
                // les contrôles doivent transmettre les styles à la couche 2D & 3D.
                // ex.     isocurve   = fill-color   : "rgba(0,183,152,0.7)"
                // ex.     itineraire = stroke-color : "rgba(0,183,152,0.9)",
                //                      stroke-width : 12

                // les controles fournissent leurs méta-informations utiles à leur reconstruction en 2D.
                // les infos issues de la methode getData() :
                // * point de départ
                // * point intermédiares
                // * point d'arrivée
                // * mode de transport
                // * mode de calcul
                // * passage
                // * résultats
                // idem pour la couche..., on récupere uniquement le tracé au format GeoJSON.
                // la couche au format natif n'est pas utile pour la switch 2D<->3D.
                var geojsonStr = null;
                var geojsonObj = null;
                switch (layer.options.control.toUpperCase()) {
                    case "ROUTE":
                    case "ISOCURVE":
                    case "ELEVATIONPATH":
                        // on distingue le cas d'un import de calcul et un calcul en cours...
                        oldMap.layersOptions[layer.id].controlOptions = (Object.keys(layer.options.controlOptions).length === 0)
                            ? this.getLibMapControl(layer.options.control.toLowerCase()).getData() : layer.options.controlOptions;
                        // on distingue le cas d'un import de calcul et un calcul en cours...
                        geojsonStr = (Object.keys(layer.options.data).length === 0)
                            ? this.getLibMapControl(layer.options.control.toLowerCase()).getGeoJSON() : layer.options.data;
                        // on parse le geojson pour y ajouter des properties de styles (2D et 3D)
                        geojsonObj = JSON.parse(geojsonStr);
                        geojsonObj.features.forEach(feature => {
                            if (!feature.properties) {
                                feature.properties = {};
                            }
                            // style propre à la 3D
                            if (feature.geometry.type === "Point") {
                                feature.properties.icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAQxSURBVFiF3ZldaBxVFMd/d2ayTRtjQpo2mlilWBEMshoj+FAERZIHIdA3iw+V1icRREFIQAKNgsUHQfBFwZI2WgWxqYUiVTDBBj9ILC5Nu2tjdjemsR+mSZNNNvsxO8eHTTRuk+zMnQmCf9iHnXvO+Z//nDvn3rmjRIT/C6zAI4ZVFRbtKDpQNCM0AvXANIo/EC4inMbmLBFZDJJaBVaZJ9Sd2HQCrwDbXHikgfewOMKPMh9ECsGIeVx1IHxEsQJeMY3iEMNy2m8aht8AtKpOhH70hADUI/TTqjr9puKvMsUE3vabxCp0MSJHdJ31xRSnVj9BVPcfOCj26U45PTHFh30c/am1EaaxuF+nKejd1WLX2gwhAPXL8T3De2XCqooKbuCu/eoiTZ6dXtch75WxaMeNENOyOXx8kHOpGMPOIudSMQ4fH8S0bBcs25Z5PMF7ZVpVL3BgQxvTsvn6+kVq6sK3jc3NRGhraKZgl9t9HGNEXvCSmvfKKJrL2nQfHVpTCEBNXZjuo0OB8JTAu5jiXmtjPL3vLl/jbnlKoNPN6spaVFbt8jXulqcEOmKSZS0yi5O+xt3ylEBHTLSsxbf913yNu+UpgU4DKE/Sc3AvczORNcfmZiL0HNwbCE8JvItxWDvJ1SjYFm0NzZzpG2RpIYbIIksLMc70Dbpsy+54SqCzzlQAY8B9Xsk8YAJ4gBHJe3HyXpkRyaN407OfN7zlVQjobjTv4BgQ1/ItjzjV9Oo46okZEBuhS8u3PDoZEDf7t9vg903zBLBfP8C/4cAnD87teclIGyFlLoVyllWh8vmQYRgVAOI4OQmFciKSFZFsMpmck1UC/Il5VNViEgHu9StkQYyb7bNNH1wrmDm3PgqWUHLBhl+SyeRV/6czLepJDAbw8fos4HTNb+/9PFv9u3YMU/X6f38/L98B7/gJ8U2uasiPEADTcRqDOozoBn7WcbzqmFOvpnYM+uTPpvP5SDBiimvP8xRPKV3DFpV7fX7HyYyD44M96xicmpqaSgd3TDQsv6J4zYvLx5nqsz/kK29qcyq5kFpafD+RSMSKf4P+CvCY+hJFRzmzmB2KPTvb+JnX8CsdzDGM8/F4/PrqseC/AggvZlGXtyipXc8kLcbCy6mdrg/6lBIbR41DYXR8cjIqIoW17IIXc17+nHnEOnS3VfhiHQt5d7HmVMK2Nn6+DHLiOGMmRLdMVI+NymjZ9Sf4abaMqZbQp01G/rnS60P5rT8duNXw1TpuGaXksmMYlxKJxLiIt23NponhKVV5a874rdZwmlYuTTvmjWdmGj9Mifl3kkpJ2hGJGY4THb9yJS4i2p0t+Gm2ggHJxMNb94eNzIAJZgEKbyxsP5kS00ZJSkG0oFQ0mZyYkKDuqIhs6u/7hyt75luM2RMPVfft3rW7bU9T0z2bxbV50+w/wF8f81R5OpwBhwAAAABJRU5ErkJggg==";
                            }
                            // style pour la 2D et 3D
                            if (feature.geometry.type === "LineString") {
                                feature.properties["stroke"] = "#00B798";
                                feature.properties["stroke-opacity"] = 0.9;
                                feature.properties["stroke-width"] = 12;
                            }
                            // style pour la 2D et 3D
                            if (feature.geometry.type === "Polygon") {
                                feature.properties["fill"] = "#00B798";
                                feature.properties["fill-opacity"] = 0.7;
                            }
                        });
                        oldMap.layersOptions[layer.id].data = JSON.stringify(geojsonObj);
                        break;
                    default:
                        // TODO other format...
                        break;
                }
            }
        }
    }

    // remove old controls and associated listeners
    for (var controlId in oldMap.controlsOptions) {
        this.removeControls(controlId);
    }

    // récupération des couches 3D qui n'étaient pas affichées en 2D
    if (viewMode === "3d") {
        if (this._3Dlayers) {
            for (var l = 0; l < this._3Dlayers.length; l++) {
                oldMap.layersOptions[this._3Dlayers[l].id] = this._3Dlayers[l].options;
            }
        }
    }

    // récupération de l'azimut
    if (viewMode === "3d") {
        oldMap.azimuth = this.getAzimuth();
    }

    // gestion du centre
    function switch4center (mode, center, projection) {
        var _center = null;
        if (mode === "3d") {
            // transformation des coordonnées de planes en géographiques
            // FIXME : ne devrait pas se faire avec ol.proj mais avec proj4 car dans IMap, ol n'est pas forcement chargée !
            var lonlat = olTransformProj([center.x, center.y], projection, "EPSG:4326");
            _center = {
                x : lonlat[0],
                y : lonlat[1]
            };
        }

        if (mode === "2d") {
            // transformation des coordonnées de géographiques en planes
            // FIXME : ne devrait pas se faire avec ol.proj mais avec proj4 car dans IMap, ol n'est pas forcement chargée !
            var xy = olTransformProj([center.lon, center.lat], "EPSG:4326", "EPSG:3857");
            _center = {
                x : xy[0],
                y : xy[1]
            };
        }

        return _center;
    }
    oldMap.center = switch4center(viewMode, oldMap.center, oldMap.projection);

    // gestion du controle overview
    function switch4overview (mode, overview) {
        // 2d <-> 3d
        // * maximised <-> maximised
        // * layers <-> layerId ou layer (mapping)
        // * minZoom <-> layer.source.zoom.min
        // * maxZoom <-> layer.source.zoom.max
        // * projection <-> layer.source.projection.toUpperCase()

        // mapping layer 3d <-> 2d :
        //  *protocol : format.toLowerCase(),
        //  *version : version,
        //  *url : url,
        //  *projection : projection.toUpperCase(),
        //  *networkOptions : {crossOrigin : "omit"},
        //  *tileMatrixSet :tileMatrixSet,
        //  *tileMatrixSetLimits :tileMatrixSetLimits,
        //  *format :outputFormat,
        //  *name :layer,
        //  *style :styleName,
        //  *zoom.min : minZoom || 1,
        //  *zoom.max : maxZoom || 21
        //  *extent : bbox

        var _overview = {};
        if (mode === "3d") {
            // 2d -> 3d
            if (overview.layers) {
                if (overview.layers.length) {
                    // on prend le 1er element car la 3d ne peut pas avoir
                    // plusieurs couches...
                    var l = overview.layers[0];
                    if (typeof l === "object") {
                        // conf d'une couche : mapping des params
                        _overview.layer = {
                            id : l.layer,
                            type : "color",
                            visible : l.visible,
                            opacity : l.opacity || 1,
                            source : {
                                protocol : (l.format) ? l.format.toLowerCase() : "wmts",
                                version : l.version || "1.0.0",
                                projection : (l.projection) ? l.projection.toUpperCase() : null,
                                url : l.url,
                                // networkOptions: {
                                //     crossOrigin: "anonymous"
                                // },
                                format : l.outputFormat || "image/jpeg",
                                name : l.layer,
                                tileMatrixSet : l.tileMatrixSet || "PM",
                                style : l.styleName || "normal",
                                // tileMatrixSetLimits : [],
                                // extent : {},
                                zoom : {
                                    min : l.minZoom || 1,
                                    max : l.maxZoom || 21
                                }
                            }
                        };
                    } else {
                        // id de couche
                        _overview.layerId = l;
                    }
                }
            }
        }

        if (mode === "2d") {
            // 3d -> 2d
            _overview.layers = [];
            if (overview.layerId) {
                // id de couche
                _overview.layers.push(overview.layerId);
            }
            if (overview.layer) {
                var ly = overview.layer;
                // conf d'une couche : mapping des params
                _overview.layers.push({
                    format : (ly.source.protocol) ? ly.source.protocol.toLowerCase() : "wmts",
                    minZoom : ly.source.zoom.min || 1,
                    maxZoom : ly.source.zoom.max || 21,
                    visibility : ly.visibility,
                    opacity : ly.opacity || 1,
                    url : ly.source.url,
                    layer : ly.source.name,
                    tileMatrixSet : ly.source.tileMatrixSet || "PM",
                    version : ly.source.version || "1.0.0",
                    styleName : ly.source.style || "normal",
                    outputFormat : ly.source.format || "image/jpeg",
                    projection : (ly.source.projection) ? ly.source.projection.toUpperCase() : null
                });
            }
        }

        // options communes
        _overview.maximised = overview.maximised;
        // options à garder lors du switch :
        // 2d
        _overview.minZoom = overview.minZoom;
        _overview.maxZoom = overview.maxZoom;
        _overview.projection = overview.projection;
        // 3d
        _overview.width = overview.width;
        _overview.height = overview.height;
        _overview.x = overview.x;
        _overview.y = overview.y;
        _overview.position = overview.position;

        return _overview;
    }
    if (oldMap.controlsOptions.overview) {
        oldMap.controlsOptions.overview = switch4overview(viewMode, oldMap.controlsOptions.overview);
    }

    this.destroyMap();

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
            enableRotation : oldMap.enableRotation,
            projection : oldMap.projection,
            center : oldMap.center,
            extent : oldMap.extent,
            azimuth : oldMap.azimuth,
            tilt : oldMap.tilt,
            zoom : oldMap.zoom,
            // maxZoom : this.
            // minZoom : this.
            markersOptions : oldMap.markersOptions,
            viewMode : viewMode,
            isWebGL2 : oldMap.isWebGL2,
            // proxyUrl
            // noProxyDomains
            // reloadConfig
            layersOptions : oldMap.layersOptions,
            controlsOptions : oldMap.controlsOptions,
            mapEventsOptions : oldMap.mapEventsOptions
        }
    );

    // une fois la carte chargée en 2D, on reconstruit les controles avec les couches
    // de calcul...
    if (viewMode === "2d") {
        newMap.listen("mapLoaded", function () {
            for (var i = 0; i < this._layers.length; i++) {
                var clayer = this._layers[i];
                // traitement des couches de calcul
                if (clayer.options.format.toUpperCase() === "COMPUTE") {
                    var control = null;
                    switch (clayer.options.control.toUpperCase()) {
                        case "ROUTE":
                        case "ISOCURVE":
                        case "ELEVATIONPATH":
                            control = this.getLibMapControl(clayer.options.control.toLowerCase());
                            break;
                        default:
                            // TODO other format...
                            break;
                    }
                    if (control) {
                        control.setData(clayer.options.controlOptions);
                        control.setLayer(clayer.obj);
                        // control.setGeoJSON(clayer.options.data); // inutile ?
                        control.init();
                    }
                }
            }
        });
    }

    return newMap;
};

/**
 * Map Object. Returned by {@link module:Map Gp.Map.load()} function. Provides methods to interact with map view.
 *
 * @param {Object} opts - map options
 * @constructor
 * @private
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

    /**
     * object d'enriegistrements des overlays.
     * Markers enregistrés par le SDK
     */
    this._markers = [];

    // la configuration est elle chargée ?
    this._isConfLoaded = false;

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

    // Substitute global constants configured at compile time
    // cf. webpack.config.js
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
        locationType : "location"
    },
    azimuth : 0,
    enableRotation : true,
    tilt : 90,
    zoom : 10,
    minZoom : 0,
    maxZoom : 21,
    reloadConfig : true,
    controlsOptions : {
        draggable : true,
        keyboard : true,
        selectable : false
    },
    mapEventsOptions : {},
    noProxyDomains : ["wxs.ign.fr"]
};

/**
 * Couche par défaut
 * @param {String} apiKey - api key
 * @returns {Object} - config
 * @private
 */
IMap.DEFAULTLAYER = function (apiKey) {
    return {
        "ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS" : {
            minZoom : 0,
            maxZoom : 19,
            queryable : true,
            opacity : 1,
            format : "wmts",
            position : 0,
            title : "Photographies aériennes",
            description : "Photographies aériennes",
            url : "https://wxs.ign.fr/" + apiKey + "/geoportail/wmts",
            layer : "ORTHOIMAGERY.ORTHOPHOTOS",
            projection : "EPSG:3857",
            tileMatrixSet : "PM",
            topLeftCorner : {
                x : -20037508,
                y : 20037508
            },
            resolutions : [156543.033928041, 78271.51696402048, 39135.758482010235, 19567.87924100512, 9783.93962050256, 4891.96981025128, 2445.98490512564, 1222.99245256282, 611.49622628141, 305.7481131407048, 152.8740565703525, 76.43702828517624, 38.21851414258813, 19.10925707129406, 9.554628535647032, 4.777314267823516, 2.388657133911758, 1.194328566955879, 0.5971642834779395, 0.2985821417389697, 0.1492910708694849, 0.0746455354347424],
            matrixIds : ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21"],
            styleName : "normal",
            outputFormat : "image/jpeg",
            originators : [{
                name : "IGN",
                attribution : "Institut National de l'Information Géographique et Forestière",
                url : "https://www.ign.fr"
            }],
            quicklookUrl : "https://wxs.ign.fr/static/pictures/ign_ortho.jpg",
            metadata : [
                { url : "" },
                { format : "xml", url : "https://wxs.ign.fr/geoportail/csw?service=CSW&version=2.0.2&request=GetRecordById&Id=IGNF_BDORTHOr_2-0.xml" },
                { format : "xml", url : "https://wxs.ign.fr/geoportail/csw?service=CSW&version=2.0.2&request=GetRecordById&Id=SPOT5.xml" },
                { format : "xml", url : "https://wxs.ign.fr/geoportail/csw?service=CSW&version=2.0.2&request=GetRecordById&Id=NCL-DITTT-ORTHO.xml" },
                { format : "xml", url : "https://wxs.ign.fr/geoportail/csw?service=CSW&version=2.0.2&request=GetRecordById&Id=IGNF_BDORTHOr_2-0.xml" },
                { format : "xml", url : "https://wxs.ign.fr/geoportail/csw?service=CSW&version=2.0.2&request=GetRecordById&Id=IGNF_ORTHOHR_1-0.xml" }
            ],
            legends : [
                {
                    format : "application/pdf",
                    url : "https://www.geoportail.gouv.fr/depot/fiches/photographiesaeriennes/geoportail_dates_des_prises_de_vues_aeriennes.pdf",
                    minScaleDenominator : null
                }
            ]
        }
    };
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
        if (this.getViewMode() === "2d") {
            this.setXYCenter(this.mapOptions.center);
        }

        // FIXME Config est créé en runtime dans la variable globale Gp
        var scope = typeof window !== "undefined" ? window : {};
        var Config = scope.Gp ? scope.Gp.Config : undefined;

        // Gestion du paramètre apiKeys
        var needsGetConfig = false;
        if (this.apiKey && !this.mapOptions.reloadConfig) { // une clef est fournie
            // et l'utilisateur ne souhaite pas faire un appel à la configuration
            needsGetConfig = false;
        } else if (this.apiKey || this.mapOptions.customConfigFile) {
            // TODO : this.apiKey.length > 1
            needsGetConfig = (this.mapOptions.reloadConfig || !Config || !Config.isKeyConfLoaded((Array.isArray(this.apiKey) ? this.apiKey[0] : this.apiKey))
            );
        } else { // une clef n'est pas fournie
            // on essaye de trouver une configuration existante
            if (Config) {
                this.apiKey = Object.keys(Config.generalOptions.apiKeys);
            }
        }

        // appel de la configuration si nécessaire
        // Dans tous les cas, le reste s'exécute dans _afterGetConfig
        var map = this;
        if (needsGetConfig) {
            // config locale ? on met par defaut un callbackSuffix à ""
            // à moins qu'on ne le surcharge (non documenté).
            var callbackSuffix = this.mapOptions.callbackSuffix;
            if (this.mapOptions.customConfigFile) {
                callbackSuffix = callbackSuffix || "";
            }
            Services.getConfig({
                apiKey : this.apiKey,
                customConfigFile : this.mapOptions.customConfigFile,
                callbackSuffix : callbackSuffix,
                // fonction de rappel onSuccess
                onSuccess : function (configResponse) {
                    map._afterGetConfig(configResponse);
                },
                // fonction de rappel onFailure
                onFailure : function (error) {
                    this.logger.error(error);
                    map._afterGetConfig(null);
                }
            });
        } else {
            // HACK : je mets cette fonction dans la pile des callbacks afin que son
            // execution soit differée par le moteur javascript !
            // ceci afin qu'un abonnement à l'event "mapLoaded" puisse se faire...
            setTimeout(function () {
                map._afterGetConfig(Config);
            });
        }
    },

    /**
     * callback d'appel à la configuration (ou non).
     *
     * @param {Object} configResponse - configuration associée à apiKey.
     * @fires mapLoaded
     * @fires configured
     * @private
     */
    _afterGetConfig : function (configResponse) {
        this.logger.trace("[IMap] : Configuration chargée ... ou pas");

        // TODO : detecter si on a le bon objet (error ou success)
        this._isConfLoaded = !(typeof configResponse === "undefined");

        // declenchement de l'evenement "configured"
        var e = IMap.CustomEvent("configured", {
            detail : {
                config : configResponse
            }
        });
        this.div.dispatchEvent(e);

        // recuperation couche par defaut si aucune specifiee
        if (!this.mapOptions.hasOwnProperty("layersOptions")) {
            if (this._isConfLoaded) {
                this.mapOptions.layersOptions = {
                    "ORTHOIMAGERY.ORTHOPHOTOS" : {}
                };
            } else {
                this.mapOptions.layersOptions = IMap.DEFAULTLAYER(this.apiKey);
            }
        }

        // recuperation du centre par défaut si aucun spécifié
        if (this._isConfLoaded &&
            (!this.mapOptions.center.hasOwnProperty("x") || this.mapOptions.center.x === 0) &&
            (!this.mapOptions.center.hasOwnProperty("y") || this.mapOptions.center.y === 0)) {
            // default autoconf "FXX" territory from the old autoconf
            this.logger.trace("[IMap] : _afterGetConfig : setting default map center to (2.345274398, 48.860832558)");
            this.mapOptions.center.x = "2.345274398";
            this.mapOptions.center.y = "48.860832558";
            this.mapOptions.center.projection = "EPSG:4326";
        }

        // centrage par location ou geolocalisation (s'il y en a). Centrage en x,y réalisé au chargement du globe (3d:initMap / 2d:_afterInitMap)
        if (this.mapOptions.center.location || this.mapOptions.center.geolocate) {
            this.setCenter(this.mapOptions.center);
        }
        // ajout des markers : en 3D, uniquement un enregistrement dans this._markers
        if (this.mapOptions.hasOwnProperty("markersOptions")) {
            this.setMarkersOptions(this.mapOptions.markersOptions);
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
     * @alias Gp.Map.setProxy
     * @param {String} url - url
     *
     * @returns {String} - proxified url
     */
    setProxy : function (url) {
        return ProxyUtils.proxifyUrl(url, this.mapOptions);
    },

    /**
     * Returns the current viewing mode (either 2D or 3d).
     *
     * @alias Gp.Map.getViewMode
     * @returns {String} - The current viewing mode
     */
    getViewMode : function () {
        return this.mapOptions.viewMode;
    },

    /**
     * Returns wrapped map object implemented by the underlying library. Can be :
     * - an [ol.Map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html) object with current OpenLayers 3 implementation if the current map is in 2D.
     * - an [Itowns.GlobeView](http://www.itowns-project.org/itowns/docs/#api/View/GlobeView) object, ie the iTowns GlobeView object overloaded by Geoportal Extension for iTowns, if the current map is in 3D.
     *
     * @alias Gp.Map.getLibMap
     * @returns {Object} - wrapped map object.
     */
    getLibMap : function () {
        // TO BE OVERRIDDEN
        return {};
    },

    /**
     * Destroy map by canceling all events listening and removing DOM elements
     */
    destroyMap : function () {
        // TO BE OVERRIDDEN
    }
};

export { IMap };
