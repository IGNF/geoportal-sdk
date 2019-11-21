
import Logger from "../../../../Utils/LoggerByDefault";

/**
 * @classdesc
 * Classe de gestion des param. des requêtes du service altimetrique.
 *
 * @constructor
 * @alias Gp.Services.Alti.Request.AltiRequest
 * @param {Object} options - options
 * @param {Object}   options.positions - tableau de coordonnées lon/lat
 * @param {String}   options.delimiter - "|"
 * @param {Boolean}  options.indent - false|true
 * @param {String}   options.crs - "CRS:84"
 * @param {String}   options.format - "JSON|XML"
 *
 * @private
 */
function AltiRequest (options) {
    if (!(this instanceof AltiRequest)) {
        throw new TypeError("AltiRequest constructor cannot be called as a function.");
    }

    this.logger = Logger.getLogger();
    this.logger.trace("[Constructeur AltiRequest ()]");

    /**
     * Options en paramêtres du constructeur.
     */
    this.options = options || {};

    /**
     * Liste des coordonnées.
     * @example
     * var c = [{lon : "", lat : ""}, {lon : "", lat : ""}];
     */
    this.positions = this.options.positions || [];

    /**
     * Caractère de séparation.
     * Par defaut, "|".
     */
    this.delimiter = this.options.delimiter || "|";

    /**
     * Indentation.
     * true|false
     */
    this.indent = this.options.indent || false;

    /**
     * Projection.
     * Par defaut, CRS:84.
     */
    this.crs = this.options.crs || "CRS:84";

    /**
     * format de sortie.
     * Par defaut, "json".
     */
    this.format = this.options.format || "json";
}

/**
 * CLASSNAME
 */
AltiRequest.CLASSNAME = "AltiRequest";

AltiRequest.prototype = {

    /**
     * @lends module:AltiRequest#
     */

    /**
     * Constructeur (alias)
     */
    constructor : AltiRequest,

    /**
     * Ajout d"une liste de coordonnées.
     *
     * @param {Object[]} lstPosition - liste de positions
     * @example
     * obj.setPositions ([{lon : "0.15", lat : "0.15"}, {lon : "1.15", lat : "1.15"}]);
     */
    setPositions : function (lstPosition) {
        var positions = [];
        for (var i = 0; i < lstPosition.length; i++) {
            var o = lstPosition[i];
            if (o.lon && o.lat) {
                positions.push(o);
            }
        }

        this.positions = positions;
    },

    /**
     * Liste des coordonnées.
     *
     * @param {Int} pos - position
     * @returns {positions}
     * @example
     * obj.getPositions ();  // [{lon : "", lat : ""}, {lon : "", lat : ""}]
     * obj.getPositions (0); // [{lon : "", lat : ""}]
     */
    getPositions : function (pos) {
        // FIXME test if not a number !?
        if (!pos) {
            return this.positions;
        }

        var index = this.positions.length - 1;
        if (pos > index || pos < index) {
            this.logger.warn("index out of range !");
            return this.positions;
        }

        return this.positions[pos];
    },

    /**
     * Ajout d"une liste de coordonnées.
     *
     * @param {Object[]} lstPosition - liste de positions
     * @example
     * obj.addPositions ([{lon : "0.15", lat : "0.15"}, {lon : "1.15", lat : "1.15"}]);
     */
    addPositions : function (lstPosition) {
        for (var i = 0; i < lstPosition.length; i++) {
            var o = lstPosition[i];
            if (o.lon && o.lat) {
                this.positions.push(lstPosition[i]);
            }
        }
    },

    /**
     * Retourne la liste des longitudes avec un caractère de séparation.
     *
     * @returns {String} - une liste de longitudes
     * @example
     * // out : 0.2367|2.1570|43.789|...
     */
    getLon : function () {
        var lstLon = [];
        for (var i = 0; i < this.positions.length; i++) {
            lstLon.push(this.positions[i].lon);
        }
        this.logger.trace(lstLon);
        return lstLon.join(this.delimiter);
    },

    /**
     * Retourne la liste des lattitudes avec un caractère de séparation.
     *
     * @returns {String} - une liste de lattitudes
     * @example
     * // out : 0.2367|2.1570|43.789|...
     */
    getLat : function () {
        var lstLat = [];
        for (var i = 0; i < this.positions.length; i++) {
            lstLat.push(this.positions[i].lat);
        }
        this.logger.trace(lstLat);
        return lstLat.join(this.delimiter);
    }

};

/**
 * Tableau de clefs/valeurs pour param.
 *
 * @returns {Object[]}
 */
AltiRequest.prototype.getData = function () {
    var map = [];

    map.push({
        k : "lon",
        v : this.getLon()
    });
    map.push({
        k : "lat",
        v : this.getLat()
    });
    map.push({
        k : "delimiter",
        v : this.delimiter
    });
    map.push({
        k : "indent",
        v : this.indent
    });
    map.push({
        k : "crs",
        v : this.crs
    });
    map.push({
        k : "format",
        v : this.format
    });

    return map;
};

export default AltiRequest;
