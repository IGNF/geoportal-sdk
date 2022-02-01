import { IMap } from "./IMapBase";
import { Services } from "geoportal-extensions-openlayers";

/**
 * envoie d'une requête de geocodage.
 *
 * @param {Object} opts - opts de geocodage
 * @param {String} opts.location - localisant
 * @param {Array.<String>} opts.locationType - types de localisants
 * @fires located
 * @private
 */
IMap.prototype.centerGeocode = function (opts) {
    // FIXME Config est créé en runtime dans la variable globale Gp
    var scope = typeof window !== "undefined" ? window : {};
    var Config = scope.Gp ? scope.Gp.Config : undefined;
    var keys;

    // le centrage par geocodage n'est possible que si l'utilisateur a les
    // droits sur le service.
    if (this.apiKey) {
        // on transforme la liste de clés en tableau
        this.logger.info("retrieve apiKeys from apiKey list");
        keys = this.apiKey.split(",");
    } else if (Config && Config.generalOptions && Config.generalOptions.apiKeys) {
        this.logger.info("retrieve apiKeys from config");
        keys = Object.keys(Config.generalOptions.apiKeys);
    } else {
        this.logger.info("no rights for geocoding services");
        return;
    }

    // On cherche les types de géocodage disponibles
    var layersIds = {};

    // si plusieurs clés en entrée, on récupère toutes les ressources par clé
    for (var i = 0; i < keys.length; i++) {
        layersIds[keys[i]] = Config.getLayersId(keys[i]);
    }
    var locTypes = opts.locationType || ["StreetAddress", "PositionOfInterest"];
    var fo = {};
    fo.type = [];
    fo.keys = [];
    // pour chaque clé en entrée, on va vérifier à quelle ressource de géocodage elle a accès
    var checkLocTypes;
    for (var k = 0; k < keys.length; k++) {
        checkLocTypes = locTypes.slice();
        while (checkLocTypes.length > 0) {
            var lt = checkLocTypes.pop();
            if (layersIds[keys[k]].indexOf(lt + "$OGC:OPENLS;Geocode") >= 0) {
                this.logger.trace("[IMap] centerGeocode : found rights for " + lt);
                fo.type.push(lt);
                // on récupère toutes les clés ayant accès à au moins une ressource de géocodage
                fo.keys.push(keys[k]);
            }
        }
    }
    // Si on n'a rien trouve, on ne peut pas geocoder
    if (fo.type.length === 0) {
        this.logger.info("no rights for geocoding services");
        return;
    }
    var map = this;
    // On appelle le service de geocodage avec la première clé ayant accès à une ressource de géocodage
    Services.geocode({
        apiKey: fo.keys[0],
        location: opts.location,
        filterOptions: fo,
        // si le service de geocodage répond
        onSuccess: function (geocodeResponse) {
            map.logger.trace("[IMap] found center by geocoding (" + geocodeResponse.locations[0].position.x + ", " + geocodeResponse.locations[0].position.y + ")");
            var point = {
                x: geocodeResponse.locations[0].position.y,
                y: geocodeResponse.locations[0].position.x,
                projection: "EPSG:4326"
            };
            map.setAutoCenter(point);
            // declenchement de l'evenement "located"
            var e = IMap.CustomEvent("located", {
                detail: {
                    position: point
                }
            });
            map.div.dispatchEvent(e);
        },
        // si le service de géocodage échoue
        onFailure: function () {
            this.logger.info("Erreur du service de géocodage !!!");
        }
    });
};

/**
 * envoie d'une requête de géolocalisation par IP.
 *
 * @fires geolocated
 * @private
 */
IMap.prototype.centerGeolocate = function () {
    var self = this;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            // callback pour geolocalisation OK
            function (position) {
                self.logger.trace("[IMap] found center by geolocation (" + position.coords.longitude + ", " + position.coords.latitude + ")");
                var point = {
                    x: position.coords.longitude,
                    y: position.coords.latitude,
                    projection: "EPSG:4326"
                };
                // paramater zoomLevel (=17 by default) used for 3D setAutoCenter function only
                self.setAutoCenter(point, 17);
                // declenchement de l'evenement "geolocated"
                var e = IMap.CustomEvent("geolocated", {
                    detail: {
                        position: point
                    }
                });
                self.div.dispatchEvent(e);
            },
            // callback pour geolocalisation nOK
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
                        // FIXME :
                        // La geolocalisation ne semble plus fonctionner sous FireFox,
                        // ce message personnalisé est envoyé dans les log...
                        // Il semble que l'API sous jacent ne reponde plus.
                        //  Geolocation error:
                        //    Network location provider at 'https://www.googleapis.com/' :
                        //      Returned error code 403
                        // Test :
                        //   about:config "geo.wifi.uri" is set to :
                        //     https://www.googleapis.com/geolocation/v1/geolocate?key=%GOOGLE_API_KEY%
                        //   modify to set :
                        //      https://location.services.mozilla.com/v1/geolocate?key=test
                        // Console :
                        //   navigator.geolocation.getCurrentPosition(function(r){console.log("response", r);}, function(e){console.log("error", e);});
                        info += "La position n’a pu être déterminée";
                        break;
                    case error.UNKNOWN_ERROR:
                        info += "Erreur inconnue";
                        break;
                }
                self.logger.info(info);
            }
        );
    } else {
        this.logger.info("Geolocate impossible");
    }
};

/**
 * Returns the current coordinates of the map's center in the current projection.
 *
 * @alias Gp.Map.getCenter
 * @returns {Gp.Point} - The current map's center.
 */
IMap.prototype.getCenter = function () {
    return {};
};

/**
 * Sets new center to the map.<br/>
 *
 * * Use x, y and projection properties to center the map with coordinates;
 * * Use location and locationType properties to center the map thanks to [Geoportal geocoding web service](https://geoservices.ign.fr/documentation/geoservices/geocodage.html).
 * * Use geolocate to center the map with user position.
 *
 * @alias Gp.Map.setCenter
 * @param {Gp.Center} center - options for centering the map
 */
IMap.prototype.setCenter = function (center) {
    this.logger.trace("[IMap] : setCenter");
    if (!center) {
        return;
    }
    if (center.hasOwnProperty("x") && center.hasOwnProperty("y")) {
        this.logger.trace("[IMap] : setCenter - x, y");
        this.setXYCenter(center);
    }
    if (center.geolocate) {
        this.logger.trace("[IMap] : setCenter - geolocate");
        this.centerGeolocate();
    }
    if (center.location && center.location.trim().length > 0) {
        this.logger.trace("[IMap] : setCenter - geocode");
        this.centerGeocode(center);
    }
};

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
IMap.prototype.setXYCenter = function (point) {
};

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
IMap.prototype.setAutoCenter = function (point) {
};

/**
 * Returns the current bounding box of the map in the current projection.
 *
 * @alias Gp.Map.getViewExtent
 * @summary Specific 2D function
 * @param {String} [projection=map projection] - Coordinate Reference System of returned extent.
 * @returns {Object} - The current map's extent.
 *
 */
IMap.prototype.getViewExtent = function () {
    return {};
};

/**
 * Returns the current map's projection code (EPSG or IGNF).
 *
 * @alias Gp.Map.getProjection
 * @summary Specific 2D function
 * @returns {String} The current map's projection.
 */
IMap.prototype.getProjection = function () {
    return "";
};

/**
 * Sets current map's projection to given projection code (EPSG or IGNF).
 * (FIXME : non visible pour l'instant car le changement de
 *          projection à la volée ne fonctionne pas)
 *
 * @param {String} projection - The new map's projection code.
 * @private
 */
IMap.prototype.setProjection = function (projection) {
    // TO BE OVERRIDDEN
};

/**
 * Returns the current camera's tilt.
 *
 * @alias Gp.Map.getTilt
 * @summary Specific 3D function
 * @returns {Number} - The current camera's tilt. 90 by default.
 */
IMap.prototype.getTilt = function () {
    return 90;
};

/**
 * Sets a new camera's tilt (3D only).
 *
 * @alias Gp.Map.setTilt
 * @summary Specific 3D function
 * @param {Float} tilt - The camera's tilt.
 */
IMap.prototype.setTilt = function (tilt) {
};

/**
 * Returns the current map's azimuth.
 *
 * @alias Gp.Map.getAzimuth
 * @returns {Number} - The current map's azimuth expressed in decimal degrees clockwise to the north.
 */
IMap.prototype.getAzimuth = function () {
    return 0;
};

/**
 * Sets a new map's azimuth.
 *
 * @alias Gp.Map.setAzimuth
 * @param {Float} azimuth - The new map's azimuth expressed in decimal degrees clockwise to the north.
 */
IMap.prototype.setAzimuth = function (azimuth) {
};

/**
 * Returns the current map's zoom level.
 *
 * @alias Gp.Map.getZoom
 * @returns {Number} - The current map's zoom.
 */
IMap.prototype.getZoom = function () {
    return 0;
};

/**
 * Sets a new map's zoom level.
 *
 * @alias Gp.Map.setZoom
 * @param {Integer} zoom - The new map's zoom.
 */
IMap.prototype.setZoom = function (zoom) {
};

/**
 * Increases the current map's zoom level by 1.
 *
 * @alias Gp.Map.zoomIn
 */
IMap.prototype.zoomIn = function () {
};

/**
 * Decreases the current map's zoom level by 1.
 *
 * @alias Gp.Map.zoomOut
 */
IMap.prototype.zoomOut = function () {
};

/**
 * Returns the current map's resolution.
 *
 * @alias Gp.Map.getResolution
 * @summary Specific 2D function
 * @returns {Number} - The current map's resolution (in meter per pixel).
 */
IMap.prototype.getResolution = function () {
    return 0;
};

/**
 * Sets a new map's resolution.
 *
 * @alias Gp.Map.setResolution
 * @summary Specific 2D function
 * @param {Float} resolution - The new map's resolution (in meter per pixel).
 */
IMap.prototype.setResolution = function (resolution) {
};

/**
 * Get zoom level from resolution
 *
 * @param {Number} resolution - resolution
 * @param {String} projCode - projection code
 *
 * @return {Integer} zoom level
 *
 * @private
 */
IMap.prototype._getZoomFromResolution = function (resolution, projCode) {
    this.logger.trace("[IMap] : _getZoomFromResolution");
    var mapProj = this.getProjection();
    var wmtsDefaults = IMap.WMTSDEFAULTS[projCode] ||
        IMap.WMTSDEFAULTS[mapProj] ||
        IMap.WMTSDEFAULTS["EPSG:3857"];

    var zoom = 0;
    var diffMin = Math.abs(wmtsDefaults.resolutions[0] - resolution);

    for (var i = 1; i < wmtsDefaults.resolutions.length; i++) {
        var diff = Math.abs(wmtsDefaults.resolutions[i] - resolution);
        if (diff >= diffMin) {
            break;
        }
        zoom = i;
        diffMin = diff;
    }
    return zoom;
};

/**
 * Get resolution from zoomLevel
 *
 * @param {Integer} zoom - zoom level
 * @param {String} projCode - projection code
 *
 * @return {Number} resolution
 *
 * @private
 */
IMap.prototype._getResolutionFromZoomLevel = function (zoom, projCode) {
    this.logger.trace("[IMap] : _getResolutionFromZoomLevel");
    var mapProj = this.getProjection();
    var wmtsDefaults = IMap.WMTSDEFAULTS[projCode] ||
        IMap.WMTSDEFAULTS[mapProj] ||
        IMap.WMTSDEFAULTS["EPSG:3857"];
    var res = -1;
    if (zoom >= 0 && zoom < wmtsDefaults.resolutions.length) {
        res = wmtsDefaults.resolutions[zoom];
    } else {
        this.logger.info("unhandled zoom level : " + zoom);
    }
    return res;
};
