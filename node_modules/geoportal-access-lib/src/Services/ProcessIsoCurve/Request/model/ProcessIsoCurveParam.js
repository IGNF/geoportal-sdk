
import Logger from "../../../../Utils/LoggerByDefault";

/**
 * @classdesc
 *
 * Classe de gestion des param. des requêtes du service de calcul des iso.
 * Permet le mapping avec les options du service.
 *
 * @constructor
 * @alias Gp.Services.ProcessIsoCurve.Request.ProcessIsoCurveParam
 * @param {Object} options - options
 * @private
 *
 */
function ProcessIsoCurveParam (options) {
    if (!(this instanceof ProcessIsoCurveParam)) {
        throw new TypeError("ProcessIsoCurveParam constructor cannot be called as a function.");
    }

    this.logger = Logger.getLogger();
    this.logger.trace("[Constructeur ProcessIsoCurveParam ()]");

    /**
     * Options en paramêtres du constructeur.
     */
    this.options = options || {};

    // mapping des options avec l'API REST

    /** Identifiant de l’isochrone */
    this.id = this.options.id;

    /** Coordonnées de départ (ou arrivée si le reverse est à true). */
    this.location = this.options.position;

    /** projection (code EPSG comme epsg:4326 ou wgs84) */
    this.srs = this.options.srs;

    /**
     * Profil de véhicule à utiliser pour le calcul.
     * Voiture ou Pieton
     */
    this.graphName = this.options.graph;

    /**
     * Identifiant et nom du véhicule
     * FIXME non utilisé
     */
    this.profileId = this.options.profileId || null; // TODO !
    this.profileName = this.options.profileName || null; // TODO !

    /** Liste des règles de restrictions à utiliser */
    this.exclusions = this.options.exclusions;

    this.reverse = this.options.reverse;
    this.smoothing = this.options.smoothing;
    this.holes = this.options.holes;

    /**
     * "time" pour isochrone ou "distance" for isodistance.
     * Par defaut, time...
     */
    var value = this.options.method;
    switch (value) {
        case "time":
            this.method = "time";
            this.time = this.options.time;
            break;
        case "distance":
            this.method = "distance";
            this.distance = this.options.distance;
            break;
        default:
            this.logger.warn("Par defaut, on calcule un isochrone !");
            this.method = "time";
    }
}

/**
 * CLASSNAME
 */
ProcessIsoCurveParam.CLASSNAME = "ProcessIsoCurveParam";

ProcessIsoCurveParam.prototype = {

    /**
     * @lends module:ProcessIsoCurveParam#
     */

    /**
     * Constructeur (alias)
     */
    constructor : ProcessIsoCurveParam,

    /**
     * Retourne la liste des exclusions
     * @returns {String} x,y
     */
    getLocation : function () {
        return this.location.x + "," + this.location.y;
    },

    /**
     * Retourne la liste des exclusions
     * @returns {String} exclusions
     */
    getExclusions : function () {
        return this.exclusions.join(";");
    }
};

/**
 * Tableau de clefs/valeurs pour param.
 *
 * @returns {Object[]} KVP
 */
ProcessIsoCurveParam.prototype.getParams = function () {
    var map = [];

    map.push({
        k : "location",
        v : this.getLocation()
    });

    map.push({
        k : "smoothing",
        v : this.smoothing
    });

    map.push({
        k : "holes",
        v : this.holes
    });

    map.push({
        k : "reverse",
        v : this.reverse
    });

    map.push({
        k : "method",
        v : this.method
    });

    if (this.time) {
        map.push({
            k : "time",
            v : this.time
        });
    }

    if (this.distance) {
        map.push({
            k : "distance",
            v : this.distance
        });
    }

    map.push({
        k : "graphName",
        v : this.graphName
    });

    if (this.exclusions) {
        map.push({
            k : "exclusions",
            v : this.getExclusions()
        });
    }

    if (this.srs) {
        map.push({
            k : "srs",
            v : this.srs
        });
    }

    return map;
};

export default ProcessIsoCurveParam;
