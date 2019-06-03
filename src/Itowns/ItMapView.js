import { ItMap } from "./ItMapBase";
import { itownsExtended as Itowns } from "geoportal-extensions-itowns";

/**
 * Centers the map on the given coordinates at the specified zoom
 *
 * @param {Object} point - center point
 * @param {Float} point.x - x coordinates for center
 * @param {Float} point.y - y coordinates for center
 * @param {Number} zoom - zoom level (optional, used for geolocate)
 *
 */
ItMap.prototype.setXYCenter = function (point, zoom) {
    this.logger.trace("[ItMap] - setXYCenter");
    if (!point.hasOwnProperty("x") || !point.hasOwnProperty("y")) {
        this.logger.info("no valid coordinates for map center");
        return;
    }
    if (point.location && point.location.trim().length > 0) {
        this.logger.info("point object has location property to center on...");
        return;
    }
    // si le proj4 d'itowns ne connait pas la projection demandée, on lui rajoute si elle est definie dans les CRS
    if (point.hasOwnProperty("projection") && !Itowns.proj4.defs(point.projection) && Itowns.CRS && Itowns.CRS[point.projection]) {
        Itowns.proj4.defs(point.projection, Itowns.CRS[point.projection]);
    }
    if (point.hasOwnProperty("projection") && point.projection !== "EPSG:4326" && Itowns.proj4.defs(point.projection)) {
        var wgs84Coords = Itowns.proj4(point.projection, "EPSG:4326", [point.x, point.y]);
        point = {
            x : wgs84Coords[0],
            y : wgs84Coords[1]
        };
    } else if (point.hasOwnProperty("projection") && Itowns.proj4.defs(point.projection) === undefined) {
        this.logger.trace("[ItMap] - setXYCenter(" + point.projection + " not handled ! )");
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
    this.logger.trace("[ItMap] - setXYCenter(" + point.x + "," + point.y + ")");
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
ItMap.prototype.setAutoCenter = function (point, zoom) {
    this.logger.trace("[ItMap] - setAutoCenter");
    if (!point.hasOwnProperty("x") || !point.hasOwnProperty("y")) {
        this.logger.info("no valid coordinates for map center");
        return;
    }
    // si le proj4 d'itowns ne connait pas la projection demandée, on lui rajoute si elle est definie dans les CRS
    if (point.hasOwnProperty("projection") && !Itowns.proj4.defs(point.projection) && Itowns.CRS && Itowns.CRS[point.projection]) {
        Itowns.proj4.defs(point.projection, Itowns.CRS[point.projection]);
    }
    if (point.hasOwnProperty("projection") && point.projection !== "EPSG:4326" && Itowns.proj4.defs(point.projection)) {
        var wgs84Coords = Itowns.proj4(point.projection, "EPSG:4326", [point.x, point.y]);
        point = {
            x : wgs84Coords[0],
            y : wgs84Coords[1]
        };
    } else if (point.hasOwnProperty("projection") && Itowns.proj4.defs(point.projection) === undefined) {
        this.logger.trace("[ItMap] - setAutoCenter(" + point.projection + " not handled ! )");
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
    this.logger.trace("[ItMap] - setAutoCenter(" + point.x + "," + point.y + ")");
};

/**
 * Returns the coordinates of the current map center
 *
 * @returns {Object} - Coordinates of the map center
 */
ItMap.prototype.getCenter = function () {
    return this.libMap.getCenter();
};

/**
 * Returns the geoportal zoom level of the map calculated with the current map scale
 *
 * @returns {Number} - ZoomLevel of the map
 */
ItMap.prototype.getZoom = function () {
    // -1 pour se baser sur les zooms Gp
    var zoom = this.libMap.getZoom() - 1;
    return zoom;
};

/**
 * Sets the zoom Level of the map
 *
 * @param {Number} zoom - ZoomLevel
 */
ItMap.prototype.setZoom = function (zoom) {
    if ((parseFloat(zoom) !== parseInt(zoom, 10)) || isNaN(zoom)) {
        this.logger.info("no valid zoomLevel");
        return;
    }
    zoom = parseInt(zoom, 10);
    // On utilise la méthode setZoom d'iTowns (+1 pour se baser sur les zooms Gp)
    this.libMap.setZoom(zoom + 1);
    this.logger.trace("[ItMap] - setZoom(" + zoom + ")");
};

/**
 * Increments the zoom level of the map by 1
 */
ItMap.prototype.zoomIn = function () {
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
ItMap.prototype.zoomOut = function () {
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
ItMap.prototype.getAzimuth = function () {
    return this.libMap.getAzimuth();
};

/**
 * Sets the orientation of the map
 *
 * @param {Number} azimuth - Azimuth of the map
 */
ItMap.prototype.setAzimuth = function (azimuth) {
    if (isNaN(azimuth)) {
        this.logger.info("Not a valid azimuth  : must be a float");
        return;
    }
    // IT method to set the camera orientation
    this.libMap.setAzimuth(azimuth);
    this.logger.trace("[ItMap] - setAzimuth(" + azimuth + ")");
};

/**
 * Returns the current tilt of the map
 *
 * @returns {Number} tilt - tilt of the map
 */
ItMap.prototype.getTilt = function () {
    return this.libMap.getTilt();
};

/**
 * Sets the tilt of the map
 *
 * @param {Number} tilt - Tilt of the map
 */
ItMap.prototype.setTilt = function (tilt) {
    tilt = parseFloat(tilt);
    if (isNaN(tilt) || tilt < 0 || tilt > 90) {
        this.logger.info("no valid tilt angle");
        return;
    }
    // methode setTilt d'itowns pour régler l'inclinaison
    this.libMap.setTilt(tilt);
    this.logger.trace("[ItMap] - setTilt(" + tilt + ")");
};
