import { OlMap } from "./OlMapBase";
import View from "ol/View";
import {
    transform as olTransformProj,
    transformExtent as olTransformExtentProj
} from "ol/proj";

/**
 * retourne le code de la projection courante de la carte
 * @return {String} projection code
 */
OlMap.prototype.getProjection = function () {
    return this.libMap.getView().getProjection().getCode();
};

/**
 * retourne les coordonnées courantes du centre de la carte
 * @return {Object} center
 */
OlMap.prototype.getCenter = function () {
    var center = {
        x : this.libMap.getView().getCenter()[0],
        y : this.libMap.getView().getCenter()[1]
    };
    return center;
};

/**
 * Returns the current bounding box of the map in the current projection.
 *
 * @param {String} [projection=map projection] - Coordinate Reference System of returned extent.
 * @returns {Object} - The current map's extent.
 */
OlMap.prototype.getViewExtent = function (projection) {
    var bbox = {};
    if (this.libMap && this.libMap.getView()) {
        var extent = this.libMap.getView().calculateExtent(this.libMap.getSize());
        var mapProj = this.libMap.getView().getProjection().getCode();
        if (projection &&
             projection !== mapProj) {
            extent = olTransformExtentProj(extent, mapProj, projection);
        }
        // extent OL :
        // [-136845.07118250668, 5803180.6192946555, -124691.58368516366, 5810852.986008779]
        bbox.left = extent[0];
        bbox.right = extent[2];
        bbox.bottom = extent[1];
        bbox.top = extent[3];
    }
    return bbox;
};

/**
 * retourne l'azimut courant de la carte
 * @return {Number} azimuth
 */
OlMap.prototype.getAzimuth = function () {
    return this.libMap.getView().getRotation() * 180 / Math.PI;
};

/**
 * retourne le zoom courant de la carte
 * @return {Integer} zoom
 */
OlMap.prototype.getZoom = function () {
    return this._getZoomFromResolution(this.getResolution());
};

/**
 * retourne le zoom courant de la carte
 * @return {Number} resolution
 */
OlMap.prototype.getResolution = function () {
    return this.libMap.getView().getResolution();
};

/**
 * définit la projection de la carte
 * Si certaines couches ne sont pas compatibles avec la nouvelle projection, elles ne seront pas affichées.
 * // TODO : vérifier que ça fonctionne : un view.setProjection semblerait plus adapte ?
 * @param {String} projection - projection
 */
OlMap.prototype.setProjection = function (projection) {
    var view = new View({
        center : this.libMap.getView().getCenter(),
        // minZoom : this.mapOptions.minZoom,
        // maxZoom : this.mapOptions.maxZoom,
        projection : projection,
        rotation : this.libMap.getView().getRotation(),
        zoom : this.getZoom()
    });
    this.libMap.setView(view);
};

/**
 * center Map on a given point
 *
 * @param {Object} point - center point
 * @param {Float} point.x - x coordinates for center
 * @param {Float} point.y - y coordinates for center
 * @param {String} point.projection - srs center coordinates
 */
OlMap.prototype.setXYCenter = function (point) {
    this.logger.trace("[OlMap] - setXYCenter");
    if (!point.hasOwnProperty("x") || !point.hasOwnProperty("y")) {
        this.logger.info("no valid coordinates for map center");
        return;
    }

    var center = [point.x, point.y];
    var mapProj = this.libMap.getView().getProjection().getCode();
    if (point.projection &&
         point.projection !== mapProj) {
        center = olTransformProj(center, point.projection, mapProj);
    }
    this.libMap.getView().setCenter(center);
    this.logger.trace("[OlMap] - setXYCenter(" + point.x + "," + point.y + "), projection Map : " + mapProj);

    // FIXME : markerFeature
    // if (this.markerFeature)
    //    this.markerFeature.setGeometry(new ol.geom.Point(geocodeCenter));
};

/**
 * center Map on a given point in case of auto centering
 *
 * @param {Object} point - center point
 * @param {Float} point.x - x coordinates for center
 * @param {Float} point.y - y coordinates for center
 * @param {Number} zoom - zoom level (optional, used for geolocate)
 *
 */
OlMap.prototype.setAutoCenter = function (point, zoom) {
    this.logger.trace("[IT] - setAutoCenter");
    this.setXYCenter(point, zoom);
};

/**
 * définit l'azimut de la carte.
 * @param {Number} azimuth - azimuth
 */
OlMap.prototype.setAzimuth = function (azimuth) {
    this.libMap.getView().setRotation(azimuth * Math.PI / 180);
};

/**
 * définit le niveau de zoom de la carte
 * @param {Integer} zoom - zoom
 */
OlMap.prototype.setZoom = function (zoom) {
    this.libMap.getView().setZoom(zoom);
};

/**
 * Définit la résolution de la carte
 * @param {Number} resolution - resolution
 */
OlMap.prototype.setResolution = function (resolution) {
    this.libMap.getView().setResolution(resolution);
};

/**
 * Incrémente le niveau de zoom de la carte de 1.
 */
OlMap.prototype.zoomIn = function () {
    this.libMap.getView().setZoom(this.getZoom() + 1);
};

/**
 * Décrémente le niveau de zoom de la carte de 1.
 */
OlMap.prototype.zoomOut = function () {
    this.libMap.getView().setZoom(this.getZoom() - 1);
};
