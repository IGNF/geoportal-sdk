
import Logger from "../../Utils/LoggerByDefault";
import _ from "../../Utils/MessagesResources";
import ErrorService from "../../Exceptions/ErrorService";
import CommonService from "../CommonService";
import DefaultUrlService from "../DefaultUrlService";
import ProcessIsoCurveRequest from "./Request/ProcessIsoCurveRequest";
import ProcessIsoCurveResponseFactory from "./Response/ProcessIsoCurveResponseFactory";

/**
 * @classdesc
 * Appel du service d'isochrone/distance du Géoportail :
 *     envoi de la requête construite selon les paramètres en options,
 *     éventuellement parsing et analyse  de la réponse,
 *     retour d'une réponse en paramètre de la fonction onSuccess.
 * @constructor
 * @extends {Gp.Services.CommonService}
 * @alias Gp.Services.ProcessIsoCurve
 * @param {Object} options - options spécifiques au service (+ les options heritées)
 *
 * @param {String} options.outputFormat - Le format de la réponse du service iso : 'xml' ou 'json'.
 *      Ce paramètre déterminera l'extension '.xml' ou '.json' du service.
 *      Nécessaire si serverUrl est renseigné pour connaître le format dans lequel sera fournie la réponse (pour son traitement).
 *      Par défaut, ce paramètre vaut 'json'.
 *
 * @param {Object} options.position - Point de départ du calcul.
 *      Coordonnées exprimées en longitudes, latitudes (EPSG:4326)
 *      @param {Float} options.position.x - Abcisse du point de départ du calcul d'isochrone/distance.
 *      @param {Float} options.position.y - Ordonnée du point de départ du calcul d'isochrone/distance.
 *
 * @param {String} options.srs - Projection.
 *      Système de coordonnées dans lequel les coordonnées du point « location » sont exprimées et
 *      dans lequel la géométrie de la courbe résultante sera exprimée.
 *      Par défaut, le système de coordonnées utilisé sera « EPSG:4326 ».
 *
 * @param {String} [options.graph = "voiture"] - Nom du graphe à utiliser pour le calcul (« Pieton » ou « Voiture »).
 *      La valeur par défaut est : «voiture»
 *
 * @param {Array.<String>} [options.exclusions] - Critères d'exclusions à appliquer pour le calcul.
 *      On précise ici le type de tronçons que l'on ne veut pas que l'isochrone/distance emprunte
 *      (valeurs possibles : « toll » (éviter les péages), « bridge », « tunnel »).
 *
 * @param {String} [options.method = "time"] - Méthode utilisée pour le calcul de la courbe iso.
 *      Les valeurs possible sont "time" pour un calcul d'isochrone, "distance" pour un calcul d'isodistance.
 *      Pas de valeur spécifié équivaut à un calcul d'isochrone.
 *
 * @param {Float} options.time - Durée maximum (exprimée en secondes) à utiliser pour le calcul de la courbe à partir du ou jusqu'au point « location ».
 *      Ce paramètre doit être renseigné si l'option "méthod" a la valeur "time".
 *      Si l'option method n'est pas renseignée, ce paramètre doit être renseigné.
 *
 * @param {Float} options.distance - Distance maximum (exprimée en metres) à utiliser pour le calcul de la courbe à partir du ou j'usqu'au point « location ».
 *      Ce paramètre doit être renseigné si l'option "méthod" a la valeur "DISTANCE".
 *      Si l'option "method" n'est pas renseignée, ce paramètre sera ignoré.
 *
 * @param {Boolean} [options.reverse = false] - Indique si la géométrie résultante doit être lissée (« true ») pour ne pas avoir d'effet d'escalier.
 *      Par défaut, la valeur « false » est appliquée.
 *
 * @param {Boolean} [options.smoothing = false] - Indique si la géométrie résultante doit être lissée (« true ») pour ne pas avoir d'effet d'escalier.
 *      Par défaut, la valeur « false » est appliquée.
 *
 * @param {Boolean} [options.holes = false] - Indique si la géométrie résultante (surface) doit être retournée avec des trous (« true »).
 *      Par défaut, la valeur « false » est appliquée.
 *
 * @example
 *   var options = {
 *      // options communes aux services
 *      apiKey : null,
 *      serverUrl : 'http://localhost/service/',
 *      protocol : 'JSONP', // JSONP|XHR
 *      proxyURL : null,
 *      httpMethod : 'GET', // GET|POST
 *      timeOut : 10000, // ms
 *      rawResponse : false, // true|false
 *      scope : null, // this
 *      onSuccess : function (response) {},
 *      onFailure : function (error) {},
 *      // spécifique au service
 *      position : {
 *           x : 2.3242664298058053,
 *           y : 48.86118017324745
 *      },
 *      distance : 200,
 *      [time : ]
 *      method : "distance",
 *      exclusions : ["Bridge", "Tunnel", "Toll"],
 *      graph : "voiture",
 *      reverse : false,
 *      smoothing : false,
 *      holes : false
 *  };
 * @private
 */

function ProcessIsoCurve (options) {
    if (!(this instanceof ProcessIsoCurve)) {
        throw new TypeError(_.getMessage("CLASS_CONSTRUCTOR", "ProcessIsoCurve"));
    }

    /**
     * Nom de la classe (heritage)
     * FIXME instance ou classe ?
     */
    this.CLASSNAME = "ProcessIsoCurve";

    // appel du constructeur par heritage
    CommonService.apply(this, arguments);

    this.logger = Logger.getLogger("Gp.Services.ProcessIsoCurve");
    this.logger.trace("[Constructeur ProcessIsoCurve (options)]");

    if (!options.position) {
        throw new Error(_.getMessage("PARAM_MISSING", "position"));
    }

    // on lance une exception afin d'eviter au service de le faire...
    if (options.position.x === null) {
        throw new Error(_.getMessage("PARAM_MISSING", "position.x"));
    }

    if (options.position.y === null) {
        throw new Error(_.getMessage("PARAM_MISSING", "position.y"));
    }

    if (!options.time && !options.distance) {
        throw new Error("Parameter (s) 'distance' missing. Parameter time to calculate an isochrone, parameter distance for an isodistance");
    }

    // si on a que le paramètre "distance" en entrée, on calcule une isodistance.
    // Le paramètre "méthode" doit pour avoir une réponse du service, être passé à "distance"
    if (!options.time && options.distance) {
        this.options.method = "distance";
        // on supprime l'éventuel attribut time, résidu d'un appel antérieur
        if (this.options.time) {
            delete this.options.time;
        }
    }

    // si on a que le paramètre "time" en entrée, on calcule une isochrone.
    // Le paramètre "méthode" doit pour avoir une réponse du service, être passé à "time"
    if (options.time && !options.distance) {
        this.options.method = "time";
        // on supprime l'éventuel attribut time, résidu d'un appel antérieur
        if (this.options.distance) {
            delete this.options.distance;
        }
    }

    // au cas où on a ni l'un, ni l'autre...
    this.options.method = this.options.method || "time";

    // options par defaut du service
    this.options.exclusions = options.exclusions || null;
    this.options.graph = options.graph || "Voiture"; // TODO test de la valeur à faire !
    this.options.reverse = options.reverse || false;
    this.options.smoothing = options.smoothing || false;
    this.options.holes = options.holes || false;
    this.options.srs = options.srs || "EPSG:4326";

    // on passe l'option outputFormat en minuscules afin d'éviter des exceptions.
    this.options.outputFormat = (typeof options.outputFormat === "string") ? options.outputFormat.toLowerCase() : "json";

    // gestion de l'url du service par defaut
    // si l'url n'est pas renseignée, il faut utiliser les urls par defaut
    if (!this.options.serverUrl) {
        var lstUrlByDefault = DefaultUrlService.ProcessIsoCurve.url(this.options.apiKey);

        var urlFound = lstUrlByDefault["iso" + "-" + this.options.outputFormat];
        if (!urlFound) {
            throw new Error("Url by default not found !");
        }
        this.options.serverUrl = urlFound;
        this.logger.trace("Serveur URL par defaut : " + this.options.serverUrl);
    }

    // gestion du type de service
    // si l'extension de l'url est .json ou .xml, on surcharge le format de sortie (outputFormat)
    var idx = this.options.serverUrl.lastIndexOf(".");
    if (idx !== -1) {
        var extension = this.options.serverUrl.substring(idx + 1);
        if (extension && extension.length < 5) { // FIXME extension de moins de 4 car. ...
            this.logger.trace("Serveur Extension URL : " + extension);
            switch (extension.toLowerCase()) {
                case "json":
                case "xml":
                    this.options.outputFormat = extension.toLowerCase();
                    break;
                default:
                    throw new Error("type of service : unknown or unsupported (json or xml) !");
            }
        }
    }
}

/**
 * @lends module:ProcessIsoCurve#
 */
ProcessIsoCurve.prototype = Object.create(CommonService.prototype, {
    // todo
    // getter/setter
});

/*
 * Constructeur (alias)
 */
ProcessIsoCurve.prototype.constructor = ProcessIsoCurve;

/**
 * Création de la requête (overwrite)
 *
 * @param {Function} error   - callback des erreurs
 * @param {Function} success - callback
 */
ProcessIsoCurve.prototype.buildRequest = function (error, success) {
    try {
        var oIsoCurve = new ProcessIsoCurveRequest(this.options);
        if (!oIsoCurve.processRequestString()) {
            throw new Error(_.getMessage("SERVICE_REQUEST_BUILD"));
        }

        this.request = oIsoCurve.requestString;
    } catch (e) {
        error.call(this, new ErrorService(e.message));
        return;
    }

    success.call(this, this.request);
};

/**
 * (overwrite)
 * Analyse de la reponse
 *
 * @param {Function} onError   - callback des erreurs
 * @param {Function} onSuccess - callback de succès de l'analyse de la réponse
 */
ProcessIsoCurve.prototype.analyzeResponse = function (onError, onSuccess) {
    if (this.response) {
        var options = {
            response : this.response,
            outputFormat : this.options.outputFormat,
            rawResponse : this.options.rawResponse,
            onSuccess : onSuccess,
            onError : onError,
            scope : this
        };

        ProcessIsoCurveResponseFactory.build(options);
    } else {
        onError.call(this, new ErrorService(_.getMessage("SERVICE_RESPONSE_EMPTY")));
    }
};

export default ProcessIsoCurve;
