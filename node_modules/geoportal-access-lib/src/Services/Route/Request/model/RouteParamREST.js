
import Logger from "../../../../Utils/LoggerByDefault";

/**
 * @classdesc
 * Classe de gestion des param. des requêtes du service de calcul d'itineraire (REST).
 *      Permet le mapping avec les options du service.
 * @constructor
 * @alias Gp.Services.Route.Request.RouteParamREST
 * @param {Object} options - options
 *
 * @private
 */
function RouteParamREST (options) {
    if (!(this instanceof RouteParamREST)) {
        throw new TypeError("RouteParamREST constructor cannot be called as a function.");
    }

    this.logger = Logger.getLogger();
    this.logger.trace("[Constructeur RouteParamREST ()]");

    /**
     * Options en paramêtres du constructeur.
     */
    this.options = options || {};

    // mapping des options avec l'API REST

    /** Coordonnées du point de départ. */
    this.origin = this.options.startPoint.x + "," + this.options.startPoint.y;

    /** Coordonnées du point d’arrivée. */
    this.destination = this.options.endPoint.x + "," + this.options.endPoint.y;

    /** Coordonnées des étapes point de départ. */
    this.waypoints = this.options.viaPoints || null;

    /** Date et heure de départ */
    this.startDateTime = this.options.expectedStartTime || null; // TODO format !?

    /** Nom du graphe à utiliser */
    this.graphName = this.options.graph;

    /** projection (code EPSG comme epsg:4326 ou wgs84) */
    this.srs = this.options.srs;

    /** Liste des règles de restrictions à utiliser, séparés pas le caractère , ou ; (Exemple : Toll, Tunnel, Bridge) */
    this.exclusions = this.options.exclusions;

    /**
     * itinéraire le plus court (DISTANCE) ou le plus rapide (TIME)
     * Par defaut, DISTANCE...
     * cf. mapping ci dessous
     */
    this.method = "TIME";

    // mapping particulier sur l'option 'routePreference'
    if (this.options.routePreference) {
        var value = this.options.routePreference;
        switch (value) {
            case "fastest":
                this.method = "TIME";
                break;
            case "shortest":
                this.method = "DISTANCE";
                break;
            default:
                this.logger.warn("Par defaut, on prend l'itinéraire le plus rapide !");
                this.method = "TIME";
        }
    }

    /** Format de sortie (résumé de l’itinéraire) */
    this.format = (this.options.geometryInInstructions) ? "STANDARDEXT" : "STANDARD";

    // y'a t-il d'autres options à ajouter (par defaut) ?

    /** Distance de tolérance (en mètre) de simplification de la géométrie. */
    this.tolerance = 10;

    /** identifiant du véhicule (enregistré dans les profils de véhicule) à utiliser */
    this.profileId = null;

    /** Profil du véhicule (enregistré dans les profils de véhicule) à utiliser */
    this.profileName = null;

    // options dont le mapping n'est pas possible :
    // - distanceUnit
    // - provideBoundingBox
}

/**
 * CLASSNAME
 */
RouteParamREST.CLASSNAME = "RouteParamREST";

RouteParamREST.prototype = {

    /**
     * @lends module:RouteParamREST#
     */

    /**
     * Constructeur (alias)
     */
    constructor : RouteParamREST,

    /**
     * Retourne une liste de points
     * @returns {Array} une liste de points (sep ';')
     */
    getWaypoints : function () {
        if (!this.waypoints) {
            return;
        }
        var array = [];
        for (var i = 0; i < this.waypoints.length; i++) {
            var obj = this.waypoints[i];
            array.push(obj.x + "," + obj.y);
        }

        return array.join(";");
    },

    /**
     * Retourne la liste des exclusions
     * @returns {Array} une liste d'exclusions (sep ';')
     */
    getExclusions : function () {
        return this.exclusions.join(";");
    }
};

/**
 * Tableau de clefs/valeurs pour param.
 *
 * @returns {Array} liste de paramêtres
 */
RouteParamREST.prototype.getParams = function () {
    var map = [];

    map.push({
        k : "origin",
        v : this.origin
    });

    map.push({
        k : "destination",
        v : this.destination
    });

    map.push({
        k : "method",
        v : this.method
    });

    if (this.waypoints) {
        map.push({
            k : "waypoints",
            v : this.getWaypoints()
        });
    }

    if (this.startDateTime) {
        map.push({
            k : "startDateTime",
            v : this.startDateTime
        });
    }

    if (this.graphName) {
        map.push({
            k : "graphName",
            v : this.graphName
        });
    }

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

    if (this.format) {
        map.push({
            k : "format",
            v : this.format
        });
    }

    return map;
};

export default RouteParamREST;
