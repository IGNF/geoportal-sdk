/* globals Gp: true */
define([
        "Utils/LoggerByDefault"
    ],
    function (
        Logger
    ) {

        "use strict";

        /**
         * Map Object. Returned by {@link module:Map Gp.Map.load()} function. Provides methods to interact with map view.
         *
         * @namespace
         * @alias Gp.Map
         */
        function IMap (opts) {
            var iMap = this;

            if (!(this instanceof IMap)) {
                throw new TypeError("IMap constructor cannot be called as a function.");
            }

            // sauvegarde des options du constructeur.
            this._opts = opts ;

            // logger
            this.logger = Logger.getLogger("IMap");
            this.logger.trace("[Constructeur IMap (options)]");

            /**
             * Couches enregistrées par l'AHN
             * Structure des objets stockés :
             * {
             *     id : layerId
             *     obj : objet couche géré par l'implémentation.
             *     options : propriétés de la couche (de type layerOptions)
             * }
             */
            this._layers = [] ;

            /**
             * Couches enregistrées par l'AHN et supprimées
             * Structure des objets stockés :
             * {
             *     id : layerId
             *     obj : objet couche géré par l'implémentation.
             *     options : propriétés de la couche (de type layerOptions)
             * }
             */
            this._layersRemoved = [] ;

            /**
             * Controlss enregistrés par l'AHN
             * Structure des objets stockés :
             * {
             *     id : controlId
             *     obj : objet control géré par l'implémentation.
             *     options : propriétés du controle (de type controlOptions)
             * }
             */
            this._controls = [] ;

            /**
             * object d'enriegistrements des evenements.
             * Les propriétés sont les identifiants de l'evenement associées à un tableau :
             * "eventId" : [{
             *      action : // function
             *      key : "clef retournée par OL3 pour l'enregistrement de l'evt"
             *      context : objet d'execution de l'action
             *  }]
             */
            this._events = {} ;

            if (this._opts.mapOptions) {
                this.apiKey = this._opts.mapOptions.apiKey;
            }
            this.div = this._opts.div;

            // récupère les options par défaut pour les paramètres optionnels
            // /!\ on duplique l'objet pour ne pas partager les mêmes options entre
            //     differentes cartes.
            this.mapOptions = Object.create(IMap.DEFAULTOPTIONS) ;

            // et on ajoute les options en paramètres aux options par défaut
            for ( var opt in this._opts.mapOptions ) {
                if ( this._opts.mapOptions.hasOwnProperty(opt)) {
                    this.mapOptions[opt] = this._opts.mapOptions[opt];
                    // FIXME : ne marche qu'au premier niveau...
                    this.logger.trace("option " + opt + " récupérée");
                }
            }

            // intialisation de la carte (à vide)
            this._initMap() ;

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
                locationType : ["StreetAddress","PositionOfInterest"]
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

        /**
         * Default autoPanOptions
         * @private
         */
        IMap.DEFAULT_AUTOPAN_OPTIONS = {
            autoPan : true,
            duration : 250,
            margin : 5
        };

        /**
         * Options par défaut des styles de dessin
         * @private
         */
        IMap.DEFAULT_MEAS_STYLES = {
            pointer : {
                strokeColor : "#002A50",
                strokeWidth : 2,
                radius : 5,
                fillColor : "rgba(255, 155, 0, 0.7)"
            },
            start : {
                strokeColor : "#002A50",
                strokeWidth : 2,
                strokeLineDash : "[10, 10]",
                fillColor : "rgba(0, 183, 152, 0.2)"
            },
            finish : {
                strokeColor : "#002A50",
                strokeWidth : 3,
                fillColor : "rgba(0, 183, 152, 0.3)"
            }
        } ;

        /**
         * Options par défaut des styles des couches vecteur (KML, GPX, GeoJSON)
         * @private
         */
        IMap.DEFAULT_VECTORLAYERS_STYLES = {
            markerSrc : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAARDSURBVFiF3ZndaxxVGMZ/Z/YjX00Nadpo1qrFBgu56D9QbAtiLoRC7ywSNK1NURRREBKRFlSwFBW0gnSrJXY1CmISgyjFiyYSFC9ajE3MmpjdjWlMUtNos9lN9mteLzbRuCbZmTMTBB+Yi51znvd5n3nPnjnnjBIR/i/wuh4xpCpI0ojiENAA1AE1wCzwKzCE0EM5l2iShJvSyrXKnFVb8dOK4hmg3AIjifAmaU7ztMy7kYI7Zs6rQwjvka+AXcyiOMZx6XGahuE0AEHVitCFnhGAGoQugqrVaSrOKpNP4FWnSaxCGy1yWpesbyY/tLpwo7p/w0RxWHfI6Zk5q7ZSwhj6Q2sjzJLiXp1JQe+p+mllc4wA1CzHtw37lQmpCha5gbXpVxdJythh9z1kvzJJGrFixPBmOXixl+Z4mONmguZ4mIMXezG8WQsq5cs6tmDfTP7NXiSqN0vTzBD1TQfwbdmDUhX4tuyhvukATTNDlgxZ0SmUtUsgv0TZGPsv9FNSvXfNtpLqvey/0O+KTgF0zNQV7XHP4dsdtVvVKYCOmeqiPbwVOx21W9UpgI6ZWNEe2cSEo3arOgWwb0YYLp5G17Sjdqs6BdCZzYqL9B3dR2puYM221NwAfUf3uaJTAB0zaye5GmbWS6i2gdFQL5mFMCIJMgthRkO9hGobMLPFN4VWdAoptlcAQeUDRoG77YrZwDhQT4tk7JDsV6ZFMggv2+bZwyt2jYDuQnOa94GIFrc4IkzRrkPUM3NKsijatLjF0copsbJ++xec7TTPqw6EI/oB/glT+PC+13Y/aSQNv/Is+tNer09lMn7DMHwAYppp8fvTIpISkVQsFrslqww4M9OuqkgzANzl1MhCyrjZGAycm573pK1yFCyi5FoWvo/FYlPOT2fOqftRXMbB9lkEs+3zbe2f/FD5i3YMj2p3vn8/IV8DZ5yE+Gqkot+JEQCPada5dRhxEriiQ5ya90w+272916F+KpnJDLhjpkUy5HgESNqhZU2Vfr5ne+dSFtOBeso06J6cnEy6d0z0hPwEPGeH8sGVykvfjpfe1NZUci2+mHg7Go2G8z/d/goQVJ9B8S1veMYffujduo/thl+ZwUzDuBqJRGZWt7n/FcDH46lFNVLilar1uiTTxsJTnTssH/QpJVlMNQa5wbGJiWERya3Vz30zzfLb3OveY3dU5j5dp4e80Xdbd3TOu/H/yyAtpjnqgeGS8crRQRks+v5xf5gtY/KM/6NAVebhwvv90bLvHu2o/XId2pJSMmIaxo/RaHRMxN6yZtPM0K5K/7hl/FxVZgZWbs0mPDceeKcuGE95/kpSKUmaImHDNIfHrl+PiIj2zOb+MFvBY7IUOVl2ZG9g6bJH4ckJuRe/2NYZT3myKIkrGM4pNRyLjY+LW09URDb1+uaF0pfm3zJ+7zhRGdq1c9eDuwOBOzdLa/OG2X+APwE8DU64Y/5gfAAAAABJRU5ErkJggg==",
            markerXAnchor : 25.5,
            markerYAnchor : 38,
            strokeColor : "#002A50",
            strokeWidth : 4,
            strokeOpacity : 0.8,
            polyFillColor : "#00B798",
            polyFillOpacity : 0.5,
            textStrokeColor : "#000000",
            textColor : "#FFFFFF"
        };

        /**
         * Caractéristiques par defaut pour les TMS Géoportail
         * @private
         */
        IMap.WMTSDEFAULTS = {
            "EPSG:3857" : {
                resolutions : [156543.033928041,78271.51696402048,39135.758482010235,19567.87924100512,9783.93962050256,4891.96981025128,2445.98490512564,1222.99245256282,611.49622628141,305.7481131407048,152.8740565703525,76.43702828517624,38.21851414258813,19.10925707129406,9.554628535647032,4.777314267823516,2.388657133911758,1.194328566955879,0.5971642834779395,0.2985821417389697,0.1492910708694849,0.0746455354347424],
                scales : {
                    0 : 559082264,
                    1 : 279541132,
                    2 : 139770566,
                    3 : 69885283,
                    4 : 34942642,
                    5 : 17471321,
                    6 : 8735660,
                    7 : 4367830,
                    8 : 2183915,
                    9 : 1091958,
                    10 : 545979,
                    11 : 272989,
                    12 : 136495,
                    13 : 68247,
                    14 : 34124,
                    15 : 17062,
                    16 : 8531,
                    17 : 4265,
                    18 : 2133,
                    19 : 1066,
                    20 : 533,
                    21 : 267
                },
                threshold : 0.0000001,
                topLeftCorner : {
                     x : -20037508,
                     y : 20037508
                 }
            },
            "EPSG:4326" : {
                resolutions : [1.40625,0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,0.0006866455078125,0.00034332275390625,0.000171661376953126,0.0000858306884765628,0.0000429153442382813,0.0000214576721191407,0.0000107288360595703,0.00000536441802978517,0.00000268220901489259,0.0000013411045074463,0.000000670552253723145,0.00000033527612686157],
                threshold : 0.0000000001,
                topLeftCorner : {
                     x : 90,
                     y : -180
                 }
            },
            "EPSG:2154" : {
                resolutions : [104579.22454989408,52277.53235379051,26135.487078595408,13066.891381800004,6533.228604113456,3266.5595244626675,1633.2660045974187,816.6295549860224,408.31391467683596,204.15674151090204,102.07831678324082,51.0391448966112,25.519569074269395,12.759783693647506,6.379891635966491,3.18994576530532,1.5949728694977277,0.7974864315474559,0.398743214900604,0.19937160727567999,0.099685803696052,0.049842901818919996],
                threshold : 0.00000001,
                topLeftCorner : {
                     x : 0,
                     y : 12000000
                 }
            }
        } ;

        /**
         * Converts hex color and opacity value to rgba String.
         * (Code adapted from : http://stackoverflow.com/a/5624139)
         * TODO : mettre ailleurs (extension)
         *
         * @private
         */
        IMap._hexToRgba = function (hex,opacity) {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                return r + r + g + g + b + b;
            });

            var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            rgb = rgb ? {
                r : parseInt(rgb[1], 16),
                g : parseInt(rgb[2], 16),
                b : parseInt(rgb[3], 16)
            } : null;
            var result = rgb ? "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + opacity + ")" : null ;
            return result ;
        } ;

        /**
         * cree un CustomEvent de maniere IE compatible
         *
         * @private
         */
        IMap.CustomEvent = function (eventId, eventObj) {
            // creation d'un CustomEvent "IE" compatible
            // cf. http://caniuse.com/#feat=customevent
            // cf. https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
            if ( typeof CustomEvent === "function" ) {
                eventObj.bubbles = false ;
                eventObj.cancelable = true ;
                return new CustomEvent(eventId, eventObj) ;
            }
            var e = document.createEvent("CustomEvent") ;
            e.initCustomEvent(eventId,
                false,
                true,
                eventObj.detail
            ) ;
            return e ;
        };

        IMap.prototype = {

            /*
             * Constructeur (alias)
             */
            constructor : IMap,

            /**
             * Returns default Controls for the map
             *
             * @returns {Object} associative array mapping default controlIds with their ControlOptions.
             * @private
             */
            _getDefaultControls : function () {
                return {
                    draggable : true,
                    keyboard : true,
                    selectable : false,
                    zoom : {},
                    attributions : {
                        maximised : false
                    }
                } ;
            },

            /**
             * Map initialisation with constructor parameters (after _initMap call)
             * needed for asynchronous _initMap implementation.
             *
             * @private
             */
            _afterInitMap : function () {
                // abonnement aux evenements demandes
                var meOptions = this.mapOptions.mapEventsOptions ;
                if (meOptions) {
                    for (var evtId in meOptions) {
                        this.listen(evtId,meOptions[evtId],this) ;
                    }
                }

                // abonnement perso à l'evnement layerChanged pour tenir à jour l'objet this._layers
                this.listen("layerChanged", this._onLayerChanged, this) ;

                // centrage avec les coordonnées x,y (s'il y en a)
                this.setXYCenter(this.mapOptions.center) ;

                // Gestion du paramètre apiKeys
                var needsGetConfig = false ;
                if (this.apiKey ||
                    this._opts.mapOptions.configUrl ||
                    this._opts.mapOptions.autoconfUrl  ) { // une clef est fournie
                    // on recharge l'autoconf si l'utilisateur l'a demandé
                    // ou si aucun n'appel d'autoocnf n'a ete fait pour cette cle
                    // TODO : this.apiKey.length > 1
                    needsGetConfig = ( this._opts.reloadConfig ||
                                      !Gp.Config ||
                                      !Gp.Config.isConfLoaded((Array.isArray(this.apiKey) ? this.apiKey[0] : this.apiKey))
                                     ) ;
                } else {           // une clef n'est pas fournie
                    // on essaye de trouver une configuration existante
                    if (Gp.Config) {
                        this.apiKey = Object.keys(Gp.Config.generalOptions.apiKeys) ;
                    }
                }

                // appel du service d'autoconfiguration si nécessaire
                // Dans tous les cas, le reste s'exécute dans _afterGetConfig
                if (needsGetConfig) {
                    // autoconf locale ? on met par defaut un callbackSuffix à ""
                    // à moins qu'on ne le surcharge (non documenté).
                    var callbackSuffix = this._opts.mapOptions.callbackSuffix ;
                    // deprecated param autoconfUrl
                    if (this._opts.mapOptions.configUrl  ||
                        this._opts.mapOptions.autoconfUrl  ) {
                        callbackSuffix = callbackSuffix || "" ;
                    }
                    var map = this ;
                    Gp.Services.getConfig({
                        apiKey : this.apiKey,
                        serverUrl : this._opts.mapOptions.configUrl || this._opts.mapOptions.autoconfUrl,
                        callbackSuffix : callbackSuffix,
                        /** fonction de rappel onSuccess */
                        onSuccess : function (configResponse) {
                            map._afterGetConfig(configResponse) ;
                        },
                        /** fonction de rappel onSuccess */
                        onFailure : function (error) {
                            console.log(error) ;
                            map._afterGetConfig(null) ;
                        }
                    });
                } else {
                    this._afterGetConfig(Gp.Config);
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
                }) ;
                this.div.dispatchEvent(e) ;

                // recuperation couche par defaut si aucune specifiee
                if (configResponse && !this.mapOptions.hasOwnProperty("layersOptions")) {
                    // FIXME : trouver l'info dans l'autoconf ... ou pas ?
                    this.mapOptions.layersOptions = {
                        "ORTHOIMAGERY.ORTHOPHOTOS" : {}
                    } ;
                }

                // recuperation du centre par défaut si aucun spécifié
                if (configResponse &&
                    (!this.mapOptions.center.hasOwnProperty("x") || this.mapOptions.center.x == 0) &&
                    (!this.mapOptions.center.hasOwnProperty("y") || this.mapOptions.center.y == 0)) {
                    var autoconfCenter;
                    var autoconfProj;
                    var defaultCenter;
                    var territories = configResponse.getTerritories();
                    for (var terrCode in territories) {
                        if (territories[terrCode].isDefault) {
                            autoconfCenter = territories[terrCode].geoCenter;
                            // autoconfProj = territories[terrCode].defaultCRS;
                        }
                    }
                    this.logger.trace("[IMap] : _afterGetConfig : setting default map center to (" + autoconfCenter.lon + "," + autoconfCenter.lat + ")");
                    this.mapOptions.center.x = autoconfCenter.lon ;
                    this.mapOptions.center.y = autoconfCenter.lat ;
                    this.mapOptions.center.projection = "EPSG:4326" ;
                }

                // Centrage de la carte avec les options demandées
                this.setCenter(this.mapOptions.center) ;

                // ajout des markers : TODO
                if (this.mapOptions.hasOwnProperty("markersOptions")) {
                    this._addMarkers(this.mapOptions.markersOptions) ;
                }

                // ajout des couches
                this.addLayers(this.mapOptions.layersOptions) ;

                // ajout des controles
                // ... par defaut
                this.addControls(this._getDefaultControls()) ;
                // ceux demandés par l'utilisateur
                this.addControls(this.mapOptions.controlsOptions) ;

                // declenchement de l'evenement "configured"
                var eMapLoaded = IMap.CustomEvent("mapLoaded", {
                    detail : {
                        map : this
                    }
                }) ;
                this.div.dispatchEvent(eMapLoaded) ;
                return ;
            },

            /**
             * Empty Map initialization : abstract
             * Implementation has to call _afterInitMap() function.
             *
             * @private
             */
            _initMap : function () {
                this.logger.trace("[IMap] : _initMap") ;
            },

            /**
             * Get zoom level from resolution
             *
             * @private
             */
            _getZoomFromResolution : function (resolution, projCode) {
                this.logger.trace("[IMap] : _getZoomFromResolution") ;
                var mapProj = this.getProjection() ;
                var wmtsDefaults = IMap.WMTSDEFAULTS[projCode] ||
                                   IMap.WMTSDEFAULTS[mapProj] ||
                                   IMap.WMTSDEFAULTS["EPSG:3857"] ;

                var zoom = 0 ;
                var diffMin = Math.abs(wmtsDefaults.resolutions[0] - resolution) ;

                for ( var i = 1 ; i < wmtsDefaults.resolutions.length ; i++ ) {
                    var diff = Math.abs(wmtsDefaults.resolutions[i] - resolution) ;
                    if ( diff >= diffMin ) {
                        break ;
                    }
                    zoom = i ;
                    diffMin = diff;
                }
                return zoom ;
            },

            /**
             * Get resolution from zoomLevel
             *
             * @private
             */
            _getResolutionFromZoomLevel : function (zoom, projCode) {
                this.logger.trace("[IMap] : _getResolutionFromZoomLevel") ;
                var mapProj = this.getProjection() ;
                var wmtsDefaults = IMap.WMTSDEFAULTS[projCode] ||
                                   IMap.WMTSDEFAULTS[mapProj] ||
                                   IMap.WMTSDEFAULTS["EPSG:3857"] ;
                var res = -1 ;
                if ( zoom >= 0 && zoom < wmtsDefaults.resolutions.length ) {
                    res = wmtsDefaults.resolutions[zoom] ;
                } else {
                    console.log("unhandled zoom level : " + zoom) ;
                }
                return res ;
            },
            /**
             * Defautl options for WMTS layers
             *
             * @private
             */
            _getWMTSDefaultOpts : function () {
                this.logger.trace("[IMap] : _getWMTSDefaultOpts") ;

                var wmtsOpts = {
                    version : "1.0.0",
                    outputFormat : "image/jpeg"
                } ;
                // identifiants des niveaux de zooms : 0, 1, 2, ...
                var matrixIds = [] ;
                for (var i = 0 ; i <= 20 ; i++) {
                    matrixIds.push("" + i) ;
                }
                wmtsOpts.matrixIds = matrixIds ;

                // resolutions par defaut :
                var resolutions = null ;
                var topLeftCorner = null ;
                var mapProj = this.getProjection() ;
                // topLeftCorner par defaut :
                if ( typeof mapProj != "string" || ["EPSG:3857"].indexOf( mapProj.toUpperCase()) >= 0 ) {
                    resolutions = IMap.WMTSDEFAULTS["EPSG:3857"].resolutions ;
                    topLeftCorner = IMap.WMTSDEFAULTS["EPSG:3857"].topLeftCorner ;
                } else if ( ["EPSG:4326", "CRS:84"].indexOf(mapProj.toUpperCase()) >= 0 ) {
                    resolutions = IMap.WMTSDEFAULTS["EPSG:4326"].resolution7s ;
                    topLeftCorner = IMap.WMTSDEFAULTS["EPSG:4326"].topLeftCorner ;
                } else if ( ["EPSG:2154"].indexOf(mapProj.toUpperCase()) >= 0 ) {
                    resolutions = IMap.WMTSDEFAULTS["EPSG:2154"].resolution7s ;
                    topLeftCorner = IMap.WMTSDEFAULTS["EPSG:2154"].topLeftCorner ;
                }
                if (resolutions) {
                    wmtsOpts.resolutions = resolutions ;
                    wmtsOpts.topLeftCorner = topLeftCorner ;
                }

                return wmtsOpts ;
            },

            /**
             * envoie d'une requête de geocodage.
             *
             * @param {Object} opts - opts de geocodage
             * @param {String} opts.location - localisant
             * @param {Array.<String>} opts.locationType - types de localisants
             * @private
             */
            centerGeocode : function (opts) {
                // le centrage par geocodage n'est possible que si l'utilisateur a les
                // droits sur le service.
                if (!Gp.Config || !this.apiKey) {
                    console.log("no rights for geocoding services") ;
                    return ;
                }
                // On cherche les types de géocodage disponibles
                var layersIds = Gp.Config.getLayersId(this.apiKey) ;
                var locTypes = opts.locationType || ["StreetAddress","PositionOfInterest"] ;
                var fo = {} ;
                fo.type = [] ;
                while (locTypes.length > 0) {
                    var lt = locTypes.pop() ;
                    if (layersIds.indexOf(lt + "$OGC:OPENLS;Geocode") >= 0 ) {
                        this.logger.trace("[IMap] centerGeocode : found rights for " + lt);
                        fo.type.push(lt) ;
                    }
                }
                // Si on n'a rien trouve, on ne peut pas geocoder
                if (fo.type.length == 0) {
                    console.log("no rights for geocoding services") ;
                    return ;
                }
                var map = this ;
                Gp.Services.geocode({
                    apiKey : this.apiKey,
                    location : opts.location,
                    filterOptions : fo,
                    /**
                     * si le service de geocodage répond
                     */
                    onSuccess : function (geocodeResponse) {
                        map.logger.trace("[IMap] found center by geocoding (" + geocodeResponse.locations[0].position.x + "," + geocodeResponse.locations[0].position.y + ")") ;
                        var point = {
                            x : geocodeResponse.locations[0].position.y,
                            y : geocodeResponse.locations[0].position.x,
                            projection : "EPSG:4326"
                        } ;
                        map.setAutoCenter(point) ;
                        // declenchement de l'evenement "located"
                        var e = IMap.CustomEvent("located", {
                            detail : {
                                position : point
                            }
                        }) ;
                        map.div.dispatchEvent(e) ;
                    },
                    /**
                     * si le service de géocodage échoue
                     */
                    onFailure : function (error) {
                        console.log("Erreur du service de géocodage !!!");
                    }
                });
            },

            /**
             * envoie d'une requête de géolocalisation par IP.
             *
             * @private
             */
            centerGeolocate : function () {
                var map = this ;
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        /**
                         * callback pour geolocalisation OK
                         */
                        function (position) {
                            map.logger.trace("[IMap] found center by geolocation (" + position.coords.longitude + "," + position.coords.latitude + ")") ;
                            var point = {
                                x : position.coords.longitude,
                                y : position.coords.latitude,
                                projection : "EPSG:4326"
                            } ;
                            // paramater zoomLevel (=17 by default) used for 3D setAutoCenter function only
                            map.setAutoCenter(point, 17) ;
                            // declenchement de l'evenement "geolocated"
                            var e = IMap.CustomEvent("geolocated", {
                                detail : {
                                    position : point
                                }
                            }) ;
                            map.div.dispatchEvent(e) ;
                        },
                        /**
                         * callback pour geolocalisation nOK
                         */
                        function (error) {
                            var info = "Erreur lors de la géolocalisation : ";
                            switch (error.code) {
                                case error.TIMEOUT:
                                    info += "Timeout !";
                                    break;
                                case error.PERMISSION_DENIED:
                                    info += "Vous n’avez pas donné la permission";
                                    break;
                                case error.POSITION_UNAVAILABLE:
                                    info += "La position n’a pu être déterminée";
                                    break;
                                case error.UNKNOWN_ERROR:
                                    info += "Erreur inconnue";
                                    break;
                            }
                            console.log(info);
                        }
                    );
                } else {
                    console.log("Geolocate impossible");
                }
            },

            /**
             * ajoute un proxy aux url des couches vecteurs si besoin.
             *
             * @private
             */
            setProxy : function (url) {
                return Gp.ProxyUtils.proxifyUrl(url,this.mapOptions);
            },

            /**
             * Returns the current map's projection code (EPSG or IGNF).
             *
             * @summary Specific 2D function
             * @returns {String} The current map's projection.
             */
            getProjection : function () {
                return "" ;
            },

            /**
             * Returns the current coordinates of the map's center in the current projection.
             *
             * @returns {Gp.Point} - The current map's center.
             */
            getCenter : function () {
                return {} ;
            },

            /**
             * Returns the current bounding box of the map in the current projection.
             *
             * @summary Specific 2D function
             * @param {String} [projection=map projection] - Coordinate Reference System of returned extent.
             * @returns {Gp.BBox} - The current map's extent.
             *
             */
            getViewExtent : function () {
                return {} ;
            },

            /**
             * Returns the current camera's tilt.
             *
             * @summary Specific 3D function
             * @returns {Number} - The current camera's tilt.
             */
            getTilt : function () {
                return 0 ;
            },

            /**
             * Returns the current map's azimuth.
             *
             * @returns {Number} - The current map's azimuth expressed in decimal degrees clockwise to the north.
             */
            getAzimuth : function () {
                return 0 ;
            },

            /**
             * Returns the current map's zoom level.
             *
             * @returns {Number} - The current map's zoom.
             */
            getZoom : function () {
                return 0 ;
            },

            /**
             * Returns the current map's resolution.
             *
             * @summary Specific 2D function
             * @returns {Number} - The current map's resolution (in meter per pixel).
             */
            getResolution : function () {
                return 0 ;
            },

            /**
             * Returns the current cartographic library used.
             * (undocumented for the moment)
             *
             * @returns {String} - The current cartographic library used.
             * @private
             */
            getLib : function () {
                return this.mapOptions.library;
            },

            /**
             * Returns the layers Obj identified by layerIds
             *
             * @param {Array.<String>} layerIds - A list of layer's id.
             * @returns {Array.<Object>} - The internal objects layers identified by layerIds.
             * @private
             */
            _getLayersObj : function (layerIds) {
                var _layerObjs = [] ;
                this._layers.forEach(function (layer,i,array) {
                    if (layerIds.indexOf(layer.id) < 0) {
                        this.logger.trace("[IMap] _getLayersObj : " + layer.id + " not found.") ;
                        return ;
                    }
                    this.logger.trace("[IMap] _getLayersObj : found obj for : " + layer.id) ;
                    _layerObjs.push(layer) ;
                },
                this) ;
                return _layerObjs ;
            },

            /**
             * Returns the current layers options. If layerIds is precised, returns just the options of the layers listed. If layerIds = null, returns the options of all the map's layers.
             *
             * @param {Array.<String> | null} layerIds - A list of layer's id or null.
             * @returns {Object} - The options of map's layers. Associative array mapping given layers ids with their {@link Gp.LayerOptions} properties.
             */
            getLayersOptions : function (layerIds) {
                // aucun layerIds fourni => on les retourne tous
                if (!layerIds || (Array.isArray(layerIds) && layerIds.length == 0)) {
                    layerIds = [] ;
                    this._layers.forEach(function (layer) {
                        layerIds.push(layer.id) ;
                    },
                    this) ;
                }
                var layersOptions = {} ;
                // tri du tableau dans l'ordre des positions.
                this._layers.sort(function (l1,l2) {
                    return (l1.options.position - l2.options.position) ;
                }) ;
                if (!Array.isArray(layerIds)) {
                    layerIds = [layerIds] ;
                }
                this._layers.forEach(function (layer) {
                    if (layerIds.indexOf(layer.id) < 0) {
                        return ;
                    }
                    layersOptions[layer.id] = layer.options ;
                },
                this) ;
                return layersOptions ;
            },

            /**
             * Returns the current control options. If controlIds is precised, returns just the options of the controls listed. If controlIds = null, returns the options of all the map's controls.<br/>
             *
             * @param {Array.<String> | null} controlIds - A list of control's id or null.
             * @returns {Object} - The options of the map's controls : Associative Array, mapping given controls Ids with their {@link Gp.ControlOptions} properties.
             */
            getControlsOptions : function (controlIds) {
                // aucun controlIds fourni => on les retourne tous
                if (!controlIds || (Array.isArray(controlIds) && controlIds.length == 0)) {
                    controlIds = [] ;
                    this._controls.forEach(function (control) {
                        controlIds.push(control.id) ;
                    },
                    this) ;
                }
                var controlsOptions = {} ;
                if (!Array.isArray(controlIds)) {
                    controlIds = [controlIds] ;
                }
                this._controls.forEach(function (control) {
                    if (controlIds.indexOf(control.id) < 0) {
                        return ;
                    }
                    controlsOptions[control.id] = control.options ;
                },
                this) ;
                return controlsOptions ;
            },

            /**
             * Returns underlying implementation of the control identified by controlId. Can be :
             * - an [ol.control.Control](http://openlayers.org/en/latest/apidoc/ol.control.Control.html) subclass with current OpenLayers 3 implementation if the current map is in 2D.
             * - an [itowns.control.Widget](https://ignf.github.io/geoportal-extensions/current/jsdoc/itowns/itowns.control.Widget.html) subclass with current OpenLayers 3 implementation if the current map is in 2D.
             *
             * @param {String} controlId - identifier of the control
             * @returns {Object} - implementation object of the control if it is on the map. null otherwise.
             */
            getLibMapControl : function (controlId) {
                // TO BE OVERRIDDEN
                var olControl = null ;
                return olControl ;
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
                return {} ;
            },

            /**
             * Sets current map's projection to given projection code (EPSG or IGNF).
             * (FIXME : non visible pour l'instant car le changement de
             *          projection à la volée ne fonctionne pas)
             *
             * @param {String} projection - The new map's projection code.
             * @private
             */
            setProjection : function (projection) {
                // TO BE OVERRIDDEN
            },

            /**
             * Sets new center to the map.<br/>
             *
             * * Use x,y and projection properties to center the map with coordinates ;
             * * Use location and locationType properties to center the map thanks to [Geoportal geocoding web service](http://api.ign.fr/tech-docs-js/fr/developpeur/search.html).
             * * Use geolocate to center the map with user position.
             *
             * @param {Gp.Center} center - options for centering the map
             */
            setCenter : function (center) {
                this.logger.trace("[IMap] : setCenter") ;
                if (!center) {
                    return ;
                }
                if (center.hasOwnProperty("x") && center.hasOwnProperty("y")) {
                    this.logger.trace("[IMap] : setCenter - x,y") ;
                    this.setXYCenter(center) ;
                }
                if (center.geolocate) {
                    this.logger.trace("[IMap] : setCenter - geolocate") ;
                    this.centerGeolocate() ;
                }
                if (center.location && center.location.trim().length > 0 ) {
                    this.logger.trace("[IMap] : setCenter - geocode") ;
                    this.centerGeocode(center) ;
                }
            },

            /**
             * center Map on a given point
             *
             * @param {Object} point - center point
             * @param {Float} point.x - x coordinates for center
             * @param {Float} point.y - y coordinates for center
             * @param {String} point.projection - srs center coordinates
             * @private
             *
             */
            setXYCenter : function (point) {
            },

            /**
             * center Map on a given point in case of auto centering
             *
             * @param {Object} point - center point
             * @param {Float} point.x - x coordinates for center
             * @param {Float} point.y - y coordinates for center
             * @param {String} point.projection - srs center coordinates
             * @private
             *
             */
            setAutoCenter : function (point) {
            },

            /**
             * Sets a new camera's tilt (3D only).
             *
             * @summary Specific 3D function
             * @param {Float} tilt - The camera's tilt.
             */
            setTilt : function (tilt) {
            },

            /**
             * Sets a new map's azimuth.
             *
             * @param {Float} azimuth - The new map's azimuth expressed in decimal degrees clockwise to the north.
             */
            setAzimuth : function (azimuth) {
            },

            /**
             * Sets a new map's zoom level.
             *
             * @param {Integer} zoom - The new map's zoom.
             */
            setZoom : function (zoom) {
            },

            /**
             * Sets a new map's resolution.
             *
             * @summary Specific 2D function
             * @param {Float} resolution - The new map's resolution (in meter per pixel).
             */
            setResolution : function (resolution) {
            },

            /**
             * Increases the current map's zoom level by 1.
             *
             */
            zoomIn : function () {
            },

            /**
             * Decreases the current map's zoom level by 1.
             *
             */
            zoomOut : function () {
            },

            /**
             * Reloads the map with a new cartographic library. The current view options (camera position, layers, controls) will be conserved.
             * This function only works with the GpOL3Itowns bundle (run the "build:mix" npm task to generate it)
             *
             * @param {Integer} library - The cartographic library to use. "ol3" (for a 2D map) or "itowns" (for a 3D map).
             *
             */
            switchToLibITOL3 : function (library) {
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

                // remove old controls and associated listeners
                for (var controlId in oldMap.controlsOptions) {
                    this.removeControls(controlId);
                }
                if (library === "itowns") {
                    // récupération des couches 3D qui n'étaient pas affichées en 2D
                    if ( this._3Dlayers ) {
                        for (var l = 0; l < this._3Dlayers.length; l++ ) {
                            oldMap.layersOptions[this._3Dlayers[l].id] = this._3Dlayers[l].options;
                        }
                    }
                    oldMap.center = [oldMap.center.x, oldMap.center.y];
                    // transformation des coordonnées de planes en géographiques
                    // FIXME : ne devrait pas se faire avec ol.proj mais avec proj4 car dans IMap, ol n'est pas forcement chargée !
                    var lonlat = ol.proj.transform(oldMap.center, oldMap.projection, "EPSG:4326");
                    oldMap.center = {
                        x : lonlat[0],
                        y : lonlat[1]
                    };
                    oldMap.azimuth = this.getAzimuth();
                    this.libMap.setTarget(null);
                } else if (library === "ol3") {
                    oldMap.center = [oldMap.center.lon, oldMap.center.lat];
                    // transformation des coordonnées de géographiques en planes
                    // FIXME : ne devrait pas se faire avec ol.proj mais avec proj4 car dans IMap, ol n'est pas forcement chargée !
                    var xy = ol.proj.transform(oldMap.center, "EPSG:4326", "EPSG:3857");
                    oldMap.center = {
                        x : xy[0],
                        y : xy[1]
                    };
                    // 1 - suppression de tous les listeners
                    for (var listeners in this._events) {
                        var keyIdx = 0;
                        var eventName = Object.keys(this._events)[keyIdx] ;
                        for (var i = 0; i < this._events[listeners].length; i++) {
                            this.forget(eventName, this._events[listeners][i].action);
                        }
                        keyIdx ++;
                    }
                    // 2 - suppression de la div
                    while (this.div.firstChild) {
                        this.div.removeChild(this.div.firstChild);
                    }
                } else {
                    console.log("Unknown Library");
                    return;
                }
                // this.libMap = null;
                var newMap = Gp.Map.load(
                    // FIXME faut-il rajouter un acces aux clés API directement dans Map getApiKeys()
                    // this.libMap.getApiKeys(),
                    // FIXME faut-il rajouter un acces à la div directement dans Map getDiv()
                    // this.libMap.getDiv(),
                    oldMap.mapDiv,
                    // récupére le paramétrage courant de la carte (par les librairies) et pas le paramétrage initial (par this.mapOptions)
                    {
                        apiKey : oldMap.apiKey,
                        enginePath3d : oldMap.enginePath3d || null,
                        projection : oldMap.projection,
                        center : oldMap.center,
                        azimuth : oldMap.azimuth,
                        tilt : oldMap.tilt,
                        zoom : oldMap.zoom,
                        // maxZoom : this.
                        // minZoom : this.
                        // markerOptions :
                        library : library,
                        // proxyUrl
                        // noProxyDomains
                        // reloadConfig
                        // autoconfUrl
                        layersOptions : oldMap.layersOptions,
                        controlsOptions : oldMap.controlsOptions
                        // mapEventsOptions :
                    }
                );
                return newMap;
            },

            /**
             * Add the markers to the map
             * FIXME : make it public ?
             *
             * @param {Array.<Gp.MarkerOptions>} markersOptions - Markers to add to the Map.
             * @private
             */
            _addMarkers : function (markersOptions) {
                this.logger.trace("[IMap] _addMarkers : generic function") ;
            },

            /**
             * Adds a list of layers to the map.<br/>
             * The **layersOptions** parameter is an associative array mapping ids of layers to display and their properties.<br/>
             * For each layer, the id may be either the name of a Geoportal layer (eg : "ORTHOIMAGERY.ORTHOPHOTOS") available with the given [apiKey used to initialize the map](Gp.MapOptions.html) or an id of your choice for external resources.<br/>
             * The properties associated to each ID are given as {@link Gp.LayerOptions} objects.<br/>
             * For Geoportal Layers availables with the given apiKey, values are automaticaly fetched from key configuration. You only need to specify a {@link Gp.LayerOptions} object with properties you want to overide or an empty object if you don't want to overide anything.
             *
             * @param {Object} layersOptions - Layers to add to the map and their options. Associative array mapping ids of layers to add (keys) and their properties (values given as {@link Gp.LayerOptions}).
             */
            addLayers : function (layersOptions) {
                if (!layersOptions) {
                    this.logger.trace("[IMap] addLayers : no layers to add") ;
                    return ;
                }
                // abonnement perso à l'evnement layerChanged pour tenir à jour l'objet this._layers
                this.listen("layerChanged", this._onLayerChanged, this) ;
                var layerId = null ;
                for (layerId in layersOptions) {
                    // on ne peut pas rajouter la même couche avec le même identifiant
                    if (this._getLayersObj([layerId]).length > 0) {
                        console.log("Layer [" + layerId + "] already added to map.") ;
                        return ;
                    }
                    this.logger.trace("[IMap] addLayers : adding : [" + layerId + "]") ;
                    var layerOpts = layersOptions[layerId];
                    // parametre pour l'ajout individuel de couche
                    var addLayerParam = {} ;
                    addLayerParam[layerId] = layerOpts ;
                    // Est-ce un layer Geoportail ?
                    // si on a donné une URL, on ne cherche pas à découvrir la couche Géoportail
                    if (!layerOpts.hasOwnProperty("url") && Gp.Config) {
                        var format = null ;
                        if (layerOpts && layerOpts.format) {
                            format = layerOpts.format ;
                        }
                        var layerConf = null ;
                        // on essaye d'abord WMTS
                        if (format == null || format.toUpperCase() == "WMTS" ) {
                            layerConf = Gp.Config.getLayerConf(layerId + "$GEOPORTAIL:OGC:WMTS") ;
                            if (layerConf) {
                                format = "WMTS" ;
                            }
                        }
                        // ... puis WMS GEOPORTAIL
                        if (format == null || format.toUpperCase() == "WMS" ) {
                            layerConf = Gp.Config.getLayerConf(layerId + "$GEOPORTAIL:OGC:WMS") ;
                            if (layerConf) {
                                format = "WMS" ;
                            } else {
                                // ... puis WMS INSPIRE
                                layerConf = Gp.Config.getLayerConf(layerId + "$INSPIRE:OGC:WMS") ;
                                if (layerConf) {
                                    format = "WMS" ;
                                }
                            }
                        }
                        // FIXME / TODO : WFS Geoportail ?
                        if (layerConf) {
                            // on a trouve la couche Geoportail : on rajoute sa configuration à ses options.
                            this.logger.trace("[IMap] addLayers : [" + layerId + "] is a geoportalLayer. Adding inner properties.") ;
                            addLayerParam[layerId].format = format ;
                            addLayerParam[layerId].originators = addLayerParam[layerId].originators || layerConf.originators ;
                            // options du layerswitcher
                            addLayerParam[layerId] = this._layerOptions2layerConf(layerConf,addLayerParam[layerId]) ;
                        }
                        switch (format) {
                            case "WMTS" :
                            case "WMS" :
                                this._addGeoportalLayer(addLayerParam, layerConf) ;
                                continue ;
                            default :
                                this.logger.trace("[IMap] addLayers : [" + layerId + "] is not a Geoportal Layer") ;
                        }
                    }
                    // Si on est ici, c'est que ce n'est pas un layer Geoportail
                    // on a besoin du format et de l'URL (à minima)
                    if (!layerOpts.hasOwnProperty("format") || typeof layerOpts.format != "string" ) {
                        console.log("Impossible to add layer [" + layerId + "] : no format given") ;
                        continue ;
                    }
                    if (!layerOpts.hasOwnProperty("url") || typeof layerOpts.url != "string" ) {
                        console.log("Impossible to add layer [" + layerId + "] : no url given") ;
                        continue ;
                    }
                    // verification des parametres obligatoires en fonction du format
                    if (!this._checkLayerParams(layerOpts)) {
                        console.log("Impossible to add layer [" + layerId + "] : unsufficient or inadapted parameters given") ;
                        continue ;
                    }
                    switch (layerOpts.format.toUpperCase()) {
                        case "georss":
                            // TODO GeoRSS
                            break;
                        case "KML":
                        case "GPX":
                        case "GEOJSON":
                        case "WFS":
                        case "DRAWING":
                            this._addVectorLayer(addLayerParam) ;
                            break;
                        case "WMS":
                        case "WMTS":
                        case "OSM":
                            this._addRasterLayer(addLayerParam) ;
                            break;
                        default:
                            console.log("Impossible to add layer [" + layerId + "] : unhandled format [" + layerOpts.format + "]") ;
                            break;
                    }

                }

                // re-abonnement à l'evenement layerChanged
                // nécessaire pour ecouter les changements de propriétés sur la nouvelle couche
                this._resetLayerChangedEvent();
            },

            /**
             * Check params for layerDisplay
             *
             * @param {Gp.LayerOptions} layerOpts - options of the layer
             * @returns {Boolean} true if parameters are OK, false otherwise
             *
             * @private
             */
            _checkLayerParams : function (layerOpts) {
                // La vérification peut être surchargée selon les spécificités de l'implémentation.
                var missingParams = [] ;
                switch (layerOpts.format.toUpperCase()) {
                    case "WMS":
                        if (!layerOpts.hasOwnProperty("layers") || !(layerOpts.layers instanceof Array)) {
                            missingParams.push("layers") ;
                        }
                        break ;
                    case "WMTS":
                        if (!layerOpts.hasOwnProperty("layer") || typeof layerOpts.layer != "string" ) {
                            missingParams.push("layer") ;
                        }
                        if (!layerOpts.hasOwnProperty("tileMatrixSet") || typeof layerOpts.tileMatrixSet != "string" ) {
                            missingParams.push("tileMatrixSet") ;
                        }
                        if (!layerOpts.hasOwnProperty("styleName") || typeof layerOpts.styleName != "string" ) {
                            missingParams.push("styleName") ;
                        }
                        break ;
                    case "WFS":
                        if (!layerOpts.hasOwnProperty("typeNames") || typeof layerOpts.typeNames != "string" ) {
                            missingParams.push("typeNames") ;
                        }
                        break ;
                }
                if (missingParams.length > 0) {
                    console.log("Impossible to add " + layerOpts.format + " layer : missing mandatory parameter(s) : " + missingParams.toString()) ;
                    return false ;
                }
                return true ;
            },

            /**
             * Add a Raster Layer to the map
             *
             * @param {Object} layerObj - geoportalLayer to add.
             * @param {Gp.LayerOptions} layerObj.geoportalLayerID - options of the layer
             *
             * @private
             */
            _addRasterLayer : function (layerObj) {
                // Abstract method to be overridden
            },

            /**
             * Add a vector Layer to the map
             *
             * @param {Object} layerObj - geoportalLayer to add.
             * @param {Gp.LayerOptions} layerObj.geoportalLayerID - options of the layer
             *
             * @private
             */
            _addVectorLayer : function (layerObj) {
                // Abstract method to be overridden
            },

            /**
             * Add a geoportal Layer to the map
             *
             * @param {Object} layerObj - geoportalLayer to add.
             * @param {Gp.LayerOptions} layerObj.geoportalLayerID - options of the layer
             *
             * @private
             */
            _addGeoportalLayer : function (layerObj) {
                // Abstract method to be overridden
            },

            /**
             * Remove layers from the map.
             *
             * @param {Array.<String>} layerIds - A list of layer's id to be removed.
             * @returns {Boolean} - true if OK, false otherwise.
             */
            removeLayers : function (layerIds) {
                if (!layerIds || (Array.isArray(layerIds) && layerIds.length == 0)) {
                    console.log("removeLayers : nothing to remove !") ;
                    return false ;
                }
                if (!Array.isArray(layerIds)) {
                    layerIds = [layerIds] ;
                }
                return true ;
            },

            /**
             * Apply params common to all kind of layers :
             * opacity, visibility, minZoom, maxZoom
             *
             * @param {Gp.LayerOptions} layerOpts - options of the layer
             * @returns {Object} the modified implementation layer object
             *
             * @private
             */
            _applyCommonLayerParams : function (layerOpts) {
                // TO BE OVERRIDDEN
                return {} ;
            },

            /**
             * Modify the layers given with layersOptions parameter
             *
             * @param {Object} layersOptions - Layers to modify and their options. Associative array mapping official name of the Geoportal layer or the id of a personal layer (keys) with their properties (values given as {@link Gp.LayerOptions}). Only following options are modified : opacity, visibility, maxZoom and minZoom.
             */
            modifyLayers : function (layersOptions) {
                if (!layersOptions) {
                    console.log("modifyLayers : nothing to modify !") ;
                    return false ;
                }
                var layerIds = Object.keys(layersOptions) ;
                if (!layerIds || !Array.isArray(layerIds) ) {
                    console.log("modifyLayers : wrong format for layersOptions !") ;
                    return false ;
                }
                return true ;
            },

            /**
             * returns registerd Control in this._controls array.
             *
             * @param {String} controlId - control identifier
             * @returns {Integer} registered control index in this.controls array ; -1 if not found.
             * @private
             */
            _findRegisteredControl : function (controlId) {
                var regCtrl = -1 ;
                if ( !controlId || typeof controlId != "string" ) {
                    this.logger.warn("[IMap] _findRegisteredControl : controlId is not a straight string") ;
                    return regCtrl ;
                }
                for (var i = 0 ; i < this._controls.length ; i++ ) {
                    if (this._controls[i].id.toLowerCase() == controlId.toLowerCase()) {
                        this.logger.trace("[IMap] _findRegisteredControl : found control " + controlId + " at index : " + i) ;
                        return i ;
                    }
                }
                this.logger.trace("[IMap] _findRegisteredControl : control " + controlId + " not found.") ;

                return regCtrl ;
            },

            /**
             * Add the list of controls to the map
             *
             * @param {Object} controlsOptions - Controls to add to the map and their options. Associative array mapping the control's name (keys) with a Boolean (value) for activating / deactivating or with their properties (values given as {@link Gp.ControlOptions}).
             *
             *
             * **Common 2D/3D controls :**
             *
             * | Key | Control Description |
             * |-|-|
             * | 'layerswitcher' | Adds layers selector widget to the map. See [options availables](./Gp.ControlOptions.html#layerswitcher) |
             * | 'graphicscale' | Adds scale line widget to the map. See [options availables](./Gp.ControlOptions.html#graphicscale) |
             * | 'mouseposition' | Adds mouse position widget to the map. See [options availables](./Gp.ControlOptions.html#mouseposition) |
             * | 'overview' | Adds mini overview map to the map. See [options availables](./Gp.ControlOptions.html#overview) |
             * | 'attributions' | Adds layers originators display to the map. See [options availables](./Gp.ControlOptions.html#attributions) |
             *
             * **Specific 2D controls :**
             *
             * | Key | Control Description |
             * |-|-|
             * | 'draggable' | Enable (true) / disable (false) map dragging/zoomming by mouse or pointer interaction.|
             * | 'keyboard' | Enable (true) / disable (false) map dragging/zoomming by keybord interaction. |
             * | 'selectable' | Enable (true) / disable (false) feature selection on the map. [**DEPRECATED**] : use ['getfeatureinfo'](./Gp.ControlOptions.html#getfeatureinfo) control instead to allow users to interact with features.|
             * | 'zoom' | Adds Zoom widget to the map. See [options availables](./Gp.ControlOptions.html#zoom) |
             * | 'orientation' | Adds orientation widget to the map. See [options availables](./Gp.ControlOptions.html#orientation) |
             * | 'length' | Adds length measurement widget to the map. See [options availables](./Gp.ControlOptions.html#length).|
             * | 'area' | Adds area measurment widget to the map. See [options availables](./Gp.ControlOptions.html#area) |
             * | 'azimuth' | Adds azimuth measurment to the map. See [options availables](./Gp.ControlOptions.html#azimuth) |
             * | 'elevationpath' | Adds elevationpath computation widget to the map. See [options availables](./Gp.ControlOptions.html#elevationpath) |
             * | 'search' | Adds search widget to the map. See [options availables](./Gp.ControlOptions.html#searchctrl) |
             * | 'reversesearch' | Adds reverse search widget to the map. See [options availables](./Gp.ControlOptions.html#reversesearch) |
             * | 'layerimport' | Adds layer import widget to the map. See [options availables](./Gp.ControlOptions.html#layerimport) |
             * | 'drawing' | Adds drawing tools widget to the map. See [options availables](./Gp.ControlOptions.html#drawing) |
             * | 'route' | Adds route control to the map. See [options availables](./Gp.ControlOptions.html#route) |
             * | 'isocurve' | Adds isocurve control to the map. See [options availables](./Gp.ControlOptions.html#isocurve) |
             * | 'graticule' | Adds graticule control to the map. See [options availables](./Gp.ControlOptions.html#graticule) |
             * | 'getfeatureinfo' | Adds capability to retrieve and display information about layer features. See [options availables](./Gp.ControlOptions.html#getfeatureinfo) |
             *
             */
            addControls : function (controlsOptions) {
                this.logger.trace("[IMap] addControls") ;
                var controlId = null ;
                for (controlId in controlsOptions) {
                    var controlObj = null ;
                    var controlOpts = controlsOptions[controlId];
                    // on regarde s'il existe dejà :
                    // d'abord dans le registre this._controls
                    var idx = -1 ;
                    var libControl = this.getLibMapControl(controlId) ;
                    idx = this._findRegisteredControl(controlId) ;
                    if (idx >= 0 || libControl) {
                        // trouve sur la carte et / ou dans le registre
                        this.logger.info("[IMap] addControls : [" + controlId + "] déjà présent.") ;
                        // on l'enleve
                        this.removeControls([controlId]) ;
                        if (controlOpts === null || controlOpts === undefined ) {
                            // si l'objet options associé est null : simple suppression.
                            // FIXME : comportement à maintenir ?
                            continue ;
                        }
                    }
                    this.logger.trace("[IMap] addControls : adding : [" + controlId + "]") ;
                    switch (controlId.toLowerCase()) {
                        case "draggable":
                            controlObj = this.setDraggable(controlOpts) ;
                            break ;
                        case "keyboard":
                            controlObj = this.setKeyboard(controlOpts) ;
                            break ;
                        case "selectable":
                            controlObj = this.setSelectable(controlOpts) ;
                            break ;
                        case "zoom":
                            controlObj = this.addZoomControl(controlOpts) ;
                            break ;
                        /* A REVOIR
                         * Le control n'a pas le comportement attendu
                         */
                        case "zoombox":
                            controlObj = this._addZoomBoxControl(controlOpts) ;
                            break ;
                        case "overview":
                            controlObj = this.addOverviewControl(controlOpts) ;
                            break ;
                        case "orientation":
                            controlObj = this.addOrientationControl(controlOpts) ;
                            break ;
                        case "graphicscale":
                            controlObj = this.addGraphicScaleControl(controlOpts) ;
                            break ;
                        case "mouseposition":
                            controlObj = this.addMousePositionControl(controlOpts) ;
                            break ;
                        case "route":
                            controlObj = this.addRouteControl(controlOpts) ;
                            break ;
                        case "isocurve":
                            controlObj = this.addIsocurveControl(controlOpts) ;
                            break ;
                        case "graticule":
                            controlObj = this.addGraticuleControl(controlOpts) ;
                            break ;
                        case "layerswitcher":
                            controlObj = this.addLayerSwitcherControl(controlOpts) ;
                            break ;
                        case "layerimport":
                            controlObj = this.addLayerImportControl(controlOpts) ;
                            break ;
                        case "length":
                            controlObj = this.addLengthControl(controlOpts) ;
                            break ;
                        case "area":
                            controlObj = this.addAreaControl(controlOpts) ;
                            break ;
                        case "azimuth":
                            controlObj = this.addAzimuthControl(controlOpts) ;
                            break ;
                        case "elevationpath":
                            controlObj = this.addElevationPathControl(controlOpts) ;
                            break ;
                        case "search":
                            controlObj = this.addSearchControl(controlOpts) ;
                            break ;
                        case "reversesearch":
                            controlObj = this.addReverseSearchControl(controlOpts) ;
                            break ;
                        case "drawing":
                            controlObj = this.addDrawingControl(controlOpts) ;
                            break ;
                        case "attributions":
                            controlObj = this.addAttributionsControl(controlOpts) ;
                            break ;
                        case "camera":
                            controlObj = this.addCameraControl(controlOpts) ;
                            break ;
                        case "getfeatureinfo":
                            controlObj = this.addGetFeatureInfoControl(controlOpts) ;
                            break ;
                        default :
                            console.log("Controle " + controlId + "inconnu.") ;
                            // if the controlId is not recognized, we skip it
                            continue;
                    }
                    this.logger.trace("[IMap] addControls : registering : [" + controlId + "]") ;
                    // if the control is not implemented in 3D, controlObj doesn't exist
                    // then we register it as "2D-only-control", to re-add it in case of switch 3D->2D
                    this._controls.push({
                        obj : controlObj || "2D-only-control",
                        id : controlId.toLowerCase(),
                        options : controlOpts
                    }) ;
                }
            },

            /**
             * Activate / Deactivate the ability to navigate on the map with mouse or pointer interaction.
             *
             * @param {Boolean} controlOpts - true for activation / false otherwise.
             * @private
             */
            setDraggable : function (controlOpts) {},

            /**
             * Activate / Deactivate the ability to navigate on the map with keyborad.
             *
             * @param {Boolean} controlOpts - true for activation / false otherwise.
             * @private
             */
            setKeyboard : function (controlOpts) {},

            /**
             * Activate / Deactivate the ability to select features on the map.
             *
             * @param {Boolean} controlOpts - true for activation / false otherwise.
             * @private
             */
            setSelectable : function (controlOpts) {},

            /**
             * Adds zoom control to the Map.
             *
             * @param {Gp.ControlOptions} controlOpts - control options
             * @private
             */
            addZoomControl : function (controlOpts) {},

            /**
             * Adds zoombox control to the Map.
             *
             * @param {Gp.ControlOptions} controlOpts - control options
             * @private
             */
            addZoomBoxControl : function (controlOpts) {},

            /**
             * Adds overview map to the map.
             *
             * @param {Object} controlOpts - control options
             * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
             * @param {Boolean} controlOpts.maximised - if the control has to be opened or not.
             * @param {Array.<String>} controlOpts.layers - List of layers Ids to be displayed on the overview map (may be part of main map layersId or a geoportal WMTS layer ID).
             * @private
             */
            addOverviewControl : function (controlOpts) {},

            /**
             * Adds orientation control to the map.
             *
             * @param {Object} controlOpts - control options
             * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
             * @private
             */
            addOrientationControl : function (controlOpts) {},

            /**
             * Adds graphicScale control to the map.
             *
             * @param {Object} controlOpts - control options
             * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
             * @param {String} controlOpts.units - units of distances shown ("m" for metric display or "deg" for geographical display). Implementation values may also be supported.
             * @param {Number} controlOpts.minWidth - minimum size (in pixels) if the widget.
             * @private
             */
            addGraphicScaleControl : function (controlOpts) {},

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
             * @private
             */
            addMousePositionControl : function (controlOpts) {},

            /**
             * Adds route control to the map.
             *
             * @param {Object} controlOpts - control options
             * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
             * @param {Boolean} controlOpts.maximised - if the control has to be opened or not.
             * @param {Object} controlOpts.exclusions - exclusions to be proposed for control. Il null all exclusions will be proposed by default.
             * @param {Boolean} controlOpts.exclusions.toll - proposing toll exclusion. If true, this exclusion will be checked by default.
             * @param {Boolean} controlOpts.exclusions.bridge - proposing bridge exclusion. If true, this exclusion will be checked by default.
             * @param {Boolean} controlOpts.exclusions.tunnel - proposing tunnel exclusion. If true, this exclusion will be checked by default.
             * @param {Array.<String>} controlOpts.graphs - available graphs to be proposed by control among "Pieton" (pedestrian) and "Voiture" (car). The first element of the array will be the default proposition of the control.
             * @param {Object} controlOpts.routeOptions - route service options. For advanced use only. See {@link http://depot.ign.fr/geoportail/bibacces/develop/doc/module-Services.html#~route Gp.Services.route()} to know all route options.
             * @param {Object} controlOpts.autocompleteOptions - autocomplete service options. See {@link http://depot.ign.fr/geoportail/bibacces/develop/doc/module-Services.html#~autoComplete Gp.Services.autoComplete()} to know all autocomplete options.
             * @private
             */
            addRouteControl : function (controlOpts) {},

            /**
             * Adds isocurve control to the map.
             *
             * @param {Object} controlOpts - control options
             * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
             * @param {Boolean} controlOpts.maximised - if the control has to be opened or not.
             * @param {Object} controlOpts.exclusions - exclusions to be proposed for control. Il null all exclusions will be proposed by default.
             * @param {Boolean} controlOpts.exclusions.toll - proposing toll exclusion. If true, this exclusion will be checked by default.
             * @param {Boolean} controlOpts.exclusions.bridge - proposing bridge exclusion. If true, this exclusion will be checked by default.
             * @param {Boolean} controlOpts.exclusions.tunnel - proposing tunnel exclusion. If true, this exclusion will be checked by default.
             * @param {Array.<String>} controlOpts.graphs - available graphs to be proposed by control among "Pieton" (pedestrian) and "Voiture" (car). The first element of the array will be the default proposition of the control.
             * @param {Array.<String>} controlOpts.methods - available methods of computation to be proposed by control among "time" (isochron) and "distance" (isodistance). The first element of the array will be the default proposition of the control.
             * @param {Array.<String>} controlOpts.directions - available directions to be proposed by control among "arrival" (isocurve to arrival point) and "departure" (isocruve from departure point). The first element of the array will be the default proposition of the control.
             * @param {Object} controlOpts.isocurveOptions - isocurve service options. For advanced use only. See {@link http://depot.ign.fr/geoportail/bibacces/develop/doc/module-Services.html#~isocurve Gp.Services.isocurve()} to know all isocurve options.
             * @param {Object} controlOpts.autocompleteOptions - autocomplete service options. See {@link http://depot.ign.fr/geoportail/bibacces/develop/doc/module-Services.html#~autoComplete Gp.Services.autoComplete()} to know all autocomplete options.
             * @private
             */
            addIsocurveControl : function (controlOpts) {},

            /**
             * Adds graticule control to the map.
             *
             * @param {Object} controlOpts - control options
             * @param {String} controlOpts.strokeColor - stroke color expressed in hex format (default : #000000)
             * @param {Number} controlOpts.strokeOpacity - stroke opacity expressed between 0 and 1 (default : 0.2).
             * @param {Number} controlOpts.strokeWidth - stroke width expressed in pixels (default : 1).
             * @private
             */
            addGraticuleControl : function (controlOpts) {},

            /**
             * Adds LayerSwitcher control to the map.
             *
             * @param {Object} controlOpts - control options
             * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
             * @param {Boolean} controlOpts.maximised - if the control has to be opened or not.
             * @private
             */
            addLayerSwitcherControl : function (controlOpts) {},

            /**
             * Adds layer import control to the map.
             *
             * @param {Object} controlOpts - control options
             * @private
             */
            addLayerImportControl : function (controlOpts) {},

            /**
             * Adds length measurment tool to the map.
             *
             * @param {Object} controlOpts - control options
             * @private
             */
            addLengthControl : function (controlOpts) {},

            /**
             * Adds area measurment tool to the map.
             *
             * @param {Object} controlOpts - control options
             * @private
             */
            addAreaControl : function (controlOpts) {},

            /**
             * Adds azimuth measurment tool to the map.
             *
             * @param {Object} controlOpts - control options
             * @private
             */
            addAzimuthControl : function (controlOpts) {},

            /**
             * Adds elevation profile control to the map.
             *
             * @param {Object} controlOpts - control options
             * @private
             */
            addElevationPathControl : function (controlOpts) {},

            /**
             * Adds search control to the map.
             *
             * @param {Object} controlOpts - control options
             * @private
             */
            addSearchControl : function (controlOpts) {},

            /**
             * Adds reverse geocoding control to the map.
             *
             * @param {Object} controlOpts - control options
             * @private
             */
            addReverseSearchControl : function (controlOpts) {},

            /**
             * Adds drawing tool bar control to the map.
             *
             * @param {Object} controlOpts - control options
             * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
             * @param {Boolean} controlOpts.maximised - if the control has to be opened or not.
             * @param {String} controlOpts.layer - layerId to be used by drawing tool. If none, an empty layer will be created, with id : "drawing-xxx".
             * @param {Object} controlOpts.tools - tools to be proposed by drawing tools box. All tools will be proposed by default.
             * @param {Boolean} [controlOpts.tools.points = true] - Display points drawing tool
             * @param {Boolean} [controlOpts.tools.lines = true] - Display lines drawing tool
             * @param {Boolean} [controlOpts.tools.polygons = true] - Display polygons drawing tool
             * @param {Boolean} [controlOpts.tools.text = true] - Display text drawing tool
             * @param {Boolean} [controlOpts.tools.remove = true] - Display feature removing tool
             * @param {Boolean} [controlOpts.tools.display = true] - Display style editing tool
             * @param {Boolean} [controlOpts.tools.edit = true] - Display editing tool
             * @param {Boolean} [controlOpts.tools.export = true] - Display exporting tool
             * @param {Object} controlOpts.labels - labels to be used instead of defaults for drawing tools.
             * @param {String} [controlOpts.labels.control] - Label for Control
             * @param {String} [controlOpts.labels.points] - Label for points drawing tool
             * @param {String} [controlOpts.labels.lines] - Label for lines drawing tool
             * @param {String} [controlOpts.labels.polygons] - Label for polygons drawing tool
             * @param {String} [controlOpts.labels.text] - Label for text drawing tool
             * @param {String} [controlOpts.labels.edit] - Label for editing tool
             * @param {String} [controlOpts.labels.display] - Label for style editing tool
             * @param {String} [controlOpts.labels.remove] - Label for feature removing tool
             * @param {String} [controlOpts.labels.export] - Label for exporting tool.
             * @param {String} [controlOpts.labels.exportTitle] - Title for exporting tool.
             * @param {String} [controlOpts.labels.applyToObject] - Label for apply to object button.
             * @param {String} [controlOpts.labels.saveDescription] - Label for save description button.
             * @param {String} [controlOpts.labels.setAsDefault] - Label for set as default style button.
             * @param {String} [controlOpts.labels.strokeColor] - Label for stroke color.
             * @param {String} [controlOpts.labels.strokeWidth] - Label for stroke width.
             * @param {String} [controlOpts.labels.fillColor] - Label for fill color.
             * @param {String} [controlOpts.labels.fillOpacity] - Label for fillOpacity.
             * @param {Array.<Object>} controlOpts.markersList - Array of markers urls and offsets to be used for points styling.
             * @param {String} controlOpts.markersList.src - URL of a marker image.
             * @param {Float} controlOpts.markersList.xAnchor - position of marker anchor in X from left of the image expressed in proportion of 1.
             * @param {Float} controlOpts.markersList.yAnchor - position of marker anchor in Y from top of the image expressed in proportion of 1.
             * @param {Float} controlOpts.markersList.yAnchor - URL of a marker image.
             * @param {Object} controlOpts.defaultStyles - Styles to apply by default to drawn features.
             * @param {String} [controlOpts.defaultStyles.textFillColor = "#000000"] - Text fill color for labels (RGB hex value).
             * @param {String} [controlOpts.defaultStyles.textStrokeColor = "#FFFFFF"] - Text surrounding color for labels (RGB hex value).
             * @param {String} [controlOpts.defaultStyles.strokeColor = "#ffcc33"] - Stroke color (RGB hex value).
             * @param {Number} [controlOpts.defaultStyles.strokeWidth = 2] - Stroke width in pixels.
             * @param {String} [controlOpts.defaultStyles.polyStrokeColor = "#ffcc33"] - Stroke color for polygons (RGB hex value).
             * @param {Number} [controlOpts.defaultStyles.polyStrokeWidth = 2] - Stroke width in pixels for polygons.
             * @param {String} [controlOpts.defaultStyles.polyFillColor = "#ffffff"] - Polygons fill color (RGB hex value).
             * @param {Number} [controlOpts.defaultStyles.polyFillOpacity = 0.2] - Polygon fill opacity (alpha value between 0:transparent and 1:opaque).
             * @param {Object} controlOpts.cursorStyle - cursor (circle) style when drawing or editing.
             * @param {String} [controlOpts.cursorStyle.fillColor = "rgba(0, 153, 255, 1)"] - Cursor fill color.
             * @param {String} [controlOpts.cursorStyle.strokeColor = "#FFF"] - Cursor stroke color.
             * @param {String} [controlOpts.cursorStyle.strokeWidth = 1] - Cursor surrounding stroke width.
             * @param {String} [controlOpts.cursorStyle.radius = 6] - Cursor radius.
             * @private
             */
            addDrawingControl : function (controlOpts) {},

            /**
             * Adds attribution control to the map.
             *
             * @param {Object} controlOpts - control options
             * @param {String|Element} controlOpts.div - target HTML element container. Default is chosen by implementation.
             * @param {Boolean} controlOpts.maximised - if the control has to be opened or not.
             * @private
             */
            addAttributionsControl : function (controlOpts) {},

            /**
             * Adds camera orientation control to the map.
             *
             * @param {Object} controlOpts - control options
             * @private
             */
            addCameraControl : function (controlOpts) {},

            /**
             * Adds getFeatureInfo control to the map.
             *
             * @param {Object} controlOpts - control options
             * @private
             */
            addGetFeatureInfoControl : function (controlOpts) {},

            /**
             * Removes given controls from the map.
             *
             * @param {Array.<String>} controlIds - A list of control's id to be removed.
             */
            removeControls : function (controlIds) {
                // TO BE OVERRIDDEN
            },

            /**
             * Modify the control'options listed to the map
             *
             * @param {Object} controlsOptions - Controls to modify on the map and their options. Associative array mapping the control's name (keys) with a Boolean (value) for activating / deactivating or with their properties (values given as {@link Gp.ControlOptions}). See [Gp.Map.addControls()](Gp.Map.html#addControls) for availables controls keys.
             */
            modifyControls : function (controlsOptions) {
                this.logger.trace("[IMap] : modifyControls ... ");
                var controlIds = Object.keys(controlsOptions) ;
                if (!controlIds || controlIds.length == 0 ) {
                    console.log("No control to modify.") ;
                    return ;
                }
                var controlId = null ;
                for (var i = 0 ; i < controlIds.length ; i++ ) {
                    controlId = controlIds[i] ;
                    // presence du controle sur la carte ?
                    var controlObj = this.getLibMapControl(controlId) ;
                    // si le controle est enregistre, on recupere ses options initiales.
                    var idx = this._findRegisteredControl(controlId) ;
                    if (idx >= 0) {
                        // si le controle n'est plus sur la carte mais qu'il est enregistre, on se contente de le supprimmer
                        if (!controlObj) {
                            this.logger.trace("[IMap] : modifyControls : removing control : " + controlId);
                            this.removeControls([controlId]) ;
                            // on enleve le controle de controlsOptions
                            delete controlsOptions[controlId] ;
                            continue ;
                        }
                        // on enrichit les anciennes options des nouvelles
                        var newCtrlOptions = this._controls[idx].options ;
                        for ( var opt in controlsOptions[controlId]) {
                            newCtrlOptions[opt] = controlsOptions[controlId][opt] ;
                        }
                        controlsOptions[controlId] = newCtrlOptions ;

                    } else if (!controlObj) {
                        // controle absent de la carte et du registre :
                        // on enleve le controle de controlsOptions
                        delete controlsOptions[controlId] ;
                        continue ;
                    }
                }
                // ici, controlsOptions contient uniquement les controles
                // pouvant être modifiés avec toutes les propriétés voulues.
                // => il suffit de faire un addcontrols
                this.addControls(controlsOptions) ;
            },

            /**
             * Recherche une couche dans le tableau this._layers à partir de son objet descriptif.
             *
             * @param {Gp.LayerOptions} layerOpts - objet de descrition de la couche
             * @return {Integer} l'index de la couche dans le tableau ; -1 si non trouvé.
             * @private
             */
            _getLayerIndexByLayerOpts : function (layerOpts) {
                if (!layerOpts) {
                    return -1 ;
                }
                for (var i = 0 ; i < this._layers.length ; i++) {
                    var l = this._layers[i] ;
                    if (layerOpts.hasOwnProperty(l.id)) {
                        return i ;
                    }
                }
                return -1 ;
            },

            /**
             * Recherche une couche dans le tableau this._layers à partir de son identifiant.
             *
             * @param {String} layerId - identifiant de la couche
             * @return {Integer} l'index de la couche dans le tableau ; -1 si non trouvé.
             * @private
             */
            _getLayerIndexByLayerId : function (layerId) {
                for (var i = 0 ; i < this._layers.length ; i++) {
                    var l = this._layers[i] ;
                    if (layerId === l.id) {
                        return i ;
                    }
                }
                return -1 ;
            },

            /**
             * Rajoute une configuration de couche au LayerSwitcher
             *
             * @param {Object} layerReg - element de this._layers correspondant à la couche
             * @param {Object} layerConf - options à rajouter au layerSwitcher.
             * @private
             */
            _addLayerConfToLayerSwitcher : function (layerReg,layerConf) {
                // TO BE OVERRIDEN
            },

            /**
             * Ecouteur de changements sur les couches pour gerer le tableau this._layers.
             *
             * @param {Gp.LayerChangedEvent} evt - evenement de changement sur les couches
             * @private
             */
            _onLayerChanged : function (evt) {
                var layerOpts = null ;
                var idx = -1 ;
                var layerId = null ;
                if (evt.hasOwnProperty("layerAdded")) {
                    layerOpts = evt.layerAdded ;
                    idx = this._getLayerIndexByLayerOpts(layerOpts) ;
                    this.logger.trace("[IMap] _onLayerChanged : layerAdded : " + idx ) ;
                    if (idx >= 0 && idx < this._layers.length) {
                        layerId = this._layers[idx].id ;
                        this._layers[idx].options.position = evt.position ;
                        this.logger.trace("[IMap] _onLayerChanged : setting position value to " + evt.position + " for layer : " + layerId ) ;
                    } else {
                        this.logger.warn("[IMap] _onLayerChanged : layerOpts (" + Object.keys(layerOpts)[0] + ") not found for layerAdded Event") ;
                    }
                } else if (evt.hasOwnProperty("layerRemoved")) {
                    layerOpts = evt.layerRemoved ;
                    idx = this._getLayerIndexByLayerOpts(layerOpts) ;
                    if (idx >= 0 && idx < this._layers.length) {
                        this.logger.trace("[IMap] _onLayerChanged : removing layer at index " + idx) ;
                        // il faut garder trace de la couche supprimmée pour
                        // d'autres abonnements à layerChanged.layerRemoved
                        var layerRemoved = {} ;
                        layerRemoved["id"] = this._layers[idx].id ;
                        layerRemoved["options"] = this._layers[idx].options ;
                        layerRemoved["obj"] = this._layers[idx].obj ;
                        this._layersRemoved.push(layerRemoved) ;
                        this._layers.splice(idx,1) ;
                        this.logger.trace("[IMap] _onLayerChanged : #(layers) == " + this._layers.length) ;
                    } else {
                        this.logger.warn("[IMap] _onLayerChanged : layerOpts not found for layerRemoved Event") ;
                    }
                } else if (evt.hasOwnProperty("layerChanged")) {
                    layerOpts = evt.layerChanged ;
                    var idxx = this._getLayerIndexByLayerOpts(layerOpts) ;
                    if (idxx >= 0 && idxx < this._layers.length) {
                        layerId = this._layers[idxx].id ;
                        this._layers[idxx].options[evt.property] = evt.newValue ;
                        this.logger.trace("[IMap] _onLayerChanged : setting " + evt.property + " value to " + evt.newValue + " for layer : " + layerId ) ;
                    } else {
                        this.logger.warn("[IMap] _onLayerChanged : layerOpts (" + Object.keys(layerOpts)[0] + ") not found for layerChanged Event") ;
                    }
                }
            },

            /**
             * Filtre les metadata avec un url vide.
             *
             * @param {Array.<Object>} metadata - metadata objects array to filter
             * @returns {Array.<Object>} - filtered metadata objects array.
             * @private
             */
            _filterEmptyMetadata : function ( metadata ) {
                if (!metadata || !Array.isArray(metadata)) {
                    return metadata ;
                }
                var fullMetadata = [] ;
                for (var i = 0 ; i < metadata.length ; i++) {
                    if (metadata[i].url && metadata[i].url.trim().length > 0) {
                        fullMetadata.push(metadata[i]) ;
                    }
                }
                return fullMetadata ;
            },

            /**
             * Copie les proprietes des couches (layerOptions) en configuration pour le layerSwitcher (layerOpts)
             *
             * @param {Object} layerOptions - options de configuration d'une couche
             * @param {Object} layerConf - options de configuration de la couche pour le LayerSwitcher à completer.
             * @returns {Object} - options de configuration pour le layerSwitcher.
             * @private
             */
            _layerOptions2layerConf : function ( layerOptions, layerConf ) {
                var lConf = layerConf || {} ;

                lConf.title = lConf.title || layerOptions.title ;
                lConf.description = lConf.description || layerOptions.description ;
                lConf.quicklookUrl = lConf.quicklookUrl || layerOptions.quicklookUrl ;
                lConf.legends = lConf.legends || layerOptions.legends ;
                lConf.metadata = lConf.metadata || layerOptions.metadata ;
                lConf.metadata = this._filterEmptyMetadata(lConf.metadata) ;
                return lConf ;
            },

            /**
             * Gets Layer Container div ID for a given layerId.
             *
             * @param {String} layerId - layer identifier
             * @returns {String} - Layer Container div Id in the LayerSwitcher
             */
            getLSLayerContainerDivId : function ( layerId ) {
                // TO BE OVERRIDDEN
                var id = null ;
                return id ;

            },

            /**
             * enregistre un evenement avec sa clef, sa fonction et sonID
             *
             * @param {Object} eventKey - ol3 layer
             * @param {String} eventId - id evenement pour l'AHN
             * @param {Function} action - fonction associée à l'evt
             * @param {Object} context - contexte d'execution de l'action (context == this)
             * @private
             */
            _registerEvent : function ( eventKey, eventId, action, context ) {
                this.logger.trace("[IMap] : listen registering : " + eventKey) ;
                if (eventKey) {
                    if (!this._events.hasOwnProperty(eventId)) {
                        this._events[eventId] = [] ;
                    }
                    this._events[eventId].push({
                        action   : action,
                        key : eventKey,
                        context : context
                    }) ;
                }

                return this._events[eventId][this._events[eventId].length - 1];
            },

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
             */
            listen : function (eventId, action, context) {
                // verifications de base
                if ( typeof(action) != "function") {
                    console.log("no action provided for event : " + eventId) ;
                    return false ;
                }
                context = context || this ;
                var map = this;
                switch (eventId) {
                    case "mapFailure" :
                        break ;
                    case "mapLoaded" :
                    case "geolocated" :
                    case "located" :
                    case "configured" :
                        this.logger.trace("[IMap] listening event : [" + eventId + "]") ;

                        /** callback */
                        var callBack = function (evt) {
                            action.call(context,evt.detail) ;
                        };

                        var registredEvent = map._registerEvent(callBack,eventId,action,context) ;
                        registredEvent.eventOrigin = this.div;
                        registredEvent.eventType = eventId;
                        registredEvent.eventOrigin.addEventListener(registredEvent.eventType, callBack, this) ;
                        break ;
                    case "centerChanged" :
                    case "zoomChanged" :
                    case "azimuthChanged" :
                    case "tiltChanged" :
                    case "layerChanged" :
                        // evenements traites par l'implementation
                        break ;
                    case "projectionChanged" :
                    case "controlChanged" :
                        // Interet de ces evenements ?
                        break ;
                    default :
                        console.log("unhandled event : " + eventId ) ;
                        return false ;
                } ;
                return true ;
            },

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
             */
            forget : function (eventId, action) {
                // verifications de base
                if ( typeof(action) != "function") {
                    console.log("no action provided for event : " + eventId) ;
                    return false ;
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
                        var rEvents = this._events[eventId] ;
                        if (!rEvents) {
                            console.log("nothing to forget for  : " + eventId) ;
                            return false ;
                        }
                        var itCallback = null;
                        for (var i = rEvents.length - 1 ; i >= 0 ; i--) {
                            if (rEvents[i].action == action) {
                                if ( !rEvents[i].eventOrigin ) {
                                    continue;
                                }
                                itCallback = rEvents[i].key ;
                                var eventOrigin = rEvents[i].eventOrigin;
                                var eventType = rEvents[i].eventType;
                                if (!itCallback) {
                                    console.log("action to forget not found for  : " + eventId) ;
                                    return false ;
                                }
                                rEvents.splice(i,1) ;
                                this.logger.trace("[IT]  : forgetting  : " + eventId + " (" + itCallback + ")") ;

                                eventOrigin.removeEventListener(eventType, itCallback);
                            }
                        }
                        if (!rEvents) {
                            console.log("action to forget not found for  : " + eventId) ;
                            return false ;
                        }
                        break ;
                    default :
                        console.log("unhandled event : " + eventId ) ;
                        return false ;
                } ;
                return true ;
            },

            /**
             *  Remove and re-initialize layerChanged event
             *
             * @private
             */
            _resetLayerChangedEvent : function () {
                // re-abonnement à l'evenement layerChanged
                // nécessaire pour ecouter les changements de propriétés sur la nouvelle couche
                if (this._events.hasOwnProperty("layerChanged")) {
                    var actions = [] ;
                    var contexts = [] ;

                    this._events["layerChanged"].forEach(function (eventObj) {
                        if ( actions.indexOf(eventObj.action) < 0 ) {
                            actions.push(eventObj.action);
                            contexts.push(eventObj.context);
                        }
                    },
                    this) ;
                    for (var i = 0 ; i < actions.length ; ++i) {
                        // on oublie ...
                        this.forget("layerChanged", actions[i]) ;
                        // ... pour mieux se souvenir
                        this.listen("layerChanged", actions[i] , contexts[i]) ;
                    }
                }
            },

            /**
             *  Function to disable/enable layer color (grayscale or color mode).
             *
             * @param {String} layerId - layer identifier
             * @param {Boolean} colorToGray - indicate transformation direction (from or to grayscale)
             *
             * @private
             */
            _changeLayerColor : function (layerId,colorToGray) {
                return;
            }
        };

        return IMap;
    }
);
