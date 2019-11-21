
import Logger from "../../Utils/LoggerByDefault";
import _ from "../../Utils/MessagesResources";
import ErrorService from "../../Exceptions/ErrorService";
import CommonService from "../CommonService";
import DefaultUrlService from "../DefaultUrlService";
import RouteRequestFactory from "./Request/RouteRequestFactory";
import RouteResponseFactory from "./Response/RouteResponseFactory";

/**
 * @classdesc
 * Appel du service d'itinéraire du Géoportail :
 *     envoi de la requête construite selon les paramètres en options,
 *     éventuellement parsing et analyse  de la réponse,
 *     retour d'une réponse en paramètre de la fonction onSuccess.
 *
 * @alias Gp.Services.Route
 * @constructor
 * @extends {Gp.Services.CommonService}
 * @param {Object} options - options spécifiques au service (+ les options heritées)
 *
 * @param {String} [options.api] - Manière d'accéder au service : 'REST' (via l'API REST) ou 'OLS' (via la norme XLS).
 * Par défaut, on utilise l'API REST.
 *
 * @param {String} options.outputFormat - Le format de la réponse du service itineraire : 'xml' ou 'json'.
 *      Ce paramètre déterminera l'extension '.xml' ou '.json' du service dans le cas de l'API REST.
 *      Nécessaire si serverUrl est renseigné, et qu'on souhaite passer par l'API REST,
 *      pour connaître le format dans lequel sera fournie la réponse (pour son traitement).
 *      Non nécessaire pour la norme OLS. Par défaut, ce paramètre vaut 'json'.
 *
 * @param {String} [options.routePreference = "fastest"] - Mode de calcul à utiliser :
 * - le plus rapide « fastest »
 * - le plus court « shortest »
 * Par défaut : « fastest ».
 *
 * @param {Object} options.startPoint - Point de départ du calcul. Coordonnées exprimées en longitudes, latitudes (EPSG:4326)
 * @param {Float} options.startPoint.x - Abcisse du point de départ du calcul d'itinéraire.
 * @param {Float} options.startPoint.y - Ordonnée du point de départ du calcul d'itinéraire.
 *
 * @param {Object} options.endPoint - Point d'arrivée du calcul. Coordonnées exprimées en longitudes, latitudes (EPSG:4326)
 * @param {Float} options.endPoint.x - Abcisse du point d'arrivée du calcul d'itinéraire.
 * @param {Float} options.endPoint.y - Ordonnée du point d'arrivée du calcul d'itinéraire.
 *
 * @param {Object[]} [options.viaPoints] - Liste de point ({x:Float,y:Float}) intermédaires que l'itinéraire doit emprunter dans l'ordre du tableau.
 *      Coordonnées exprimées en longitudes, latitudes (EPSG:4326) :{x:float, y:float}
 *
 * @param {String} [options.graph = "voiture"] - Type de graphe utilisé : "Voiture" ou "Pieton".
 *      Détermine le profil de vitesses utilisé pour le calcul ainsi que les tronçons autorisés ou non.
 *      Par défaut, c'est la valeur "Voiture" qui sera utilisée.
 *
 * @param {String[]} [options.exclusions] - Critères d'exclusions à appliquer pour le calcul. (correspond au paramètre "avoidFeature" d'OpenLS)
 *      On précise ici le type de tronçons que l'on ne veut pas que l'itinéraire emprunte
 *      (valeurs possibles : « toll » (éviter les péages), « bridge », « tunnel »).
 *
 * @param {Boolean} [options.geometryInInstructions = false] - Indique si la géométrie de l'itinéraire doit être reprise morceau par morceau dans les instructions.
 *      (correspond au paramètre "provideGeometry" d'OpenLS) Par défaut : false.
 *
 * @param {Boolean} [options.provideBbox = true] - Indique si les instructions doivent être localisées par une bbox dans la réponse.
 *      Par défaut : true.
 *
 * @param {String} [options.distanceUnit = "km"] - Indique si la distance doit être exprimée en km ou m dans la réponse.
 *      Par défaut : km.
 *
 * @param {String} [options.srs] - Système de coordonnées dans lequel les paramètres géographiques en entrée et la réponse du service sont exprimés.
 *      Pas de valeur par défaut. Si le serveur consulté est celui du Géoportail, la valeur par défaut sera donc celle du service : 'EPSG:4326'.
 *
 * @example
 *  var options = {
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
 *      api : 'OLS',
 *      outputFormat : 'xml',
 *      startPoint : {
 *          x : 42.1121,
 *          y : 1.5557
 *      },
 *      endPoint : {
 *          x : 42.1121,
 *          y : 1.5557
 *      },
 *      provideBbox : false,
 *      exclusions : ["Bridge", "Tunnel", "Toll"],
 *      distanceUnit : "km",
 *      graph : "Voiture",
 *      geometryInInstructions : false,
 *      routePreference : "fastest"
 *  };
 *
 * @private
 */
function Route (options) {
    if (!(this instanceof Route)) {
        throw new TypeError(_.getMessage("CLASS_CONSTRUCTOR", "Route"));
    }

    /**
     * Nom de la classe (heritage)
     */
    this.CLASSNAME = "Route";

    // appel du constructeur par heritage
    CommonService.apply(this, arguments);

    this.logger = Logger.getLogger("Gp.Services.Route");
    this.logger.trace("[Constructeur Route (options)]");

    if (!options.startPoint) {
        throw new Error(_.getMessage("PARAM_MISSING", "startPoint"));
    }

    // on lance une exception afin d'eviter au service de le faire...
    if (options.startPoint.x === null) {
        throw new Error(_.getMessage("PARAM_MISSING", "startPoint.x"));
    }

    if (options.startPoint.y === null) {
        throw new Error(_.getMessage("PARAM_MISSING", "startPoint.y"));
    }

    if (!options.endPoint) {
        throw new Error(_.getMessage("PARAM_MISSING", "endPoint"));
    }

    // on lance une exception afin d'eviter au service de le faire...
    if (options.endPoint.x === null) {
        throw new Error(_.getMessage("PARAM_MISSING", "endPoint.x"));
    }

    if (options.endPoint.y === null) {
        throw new Error(_.getMessage("PARAM_MISSING", "endPoint.y"));
    }

    // options par defaut
    // on passe l'option api en majuscules afin d'éviter des exceptions.
    this.options.api = (typeof options.api === "string") ? options.api.toUpperCase() : "REST";

    // on passe l'option outputFormat en minuscules afin d'éviter des exceptions.
    this.options.outputFormat = (typeof options.outputFormat === "string") ? options.outputFormat.toLowerCase() : "json";

    this.options.startPoint = options.startPoint;
    this.options.endPoint = options.endPoint;
    this.options.viaPoints = options.viaPoints || null; // INFO mapping viaPoints <=> xls:viaPoint
    this.options.exclusions = options.exclusions || null; // INFO mapping exclusions <=> xls:avoidFeature
    this.options.routePreference = options.routePreference || "fastest";
    this.options.graph = options.graph || "Voiture";
    this.options.geometryInInstructions = options.geometryInInstructions || false; // INFO mapping geometryInInstructions <=> xls:provideGeometry
    this.options.provideBbox = options.provideBbox || true; // INFO mapping provideBbox <=> xls:provideBoundingBox
    this.options.distanceUnit = options.distanceUnit || "km";
    this.options.expectedStartTime = null; // FIXME not yet implemented !
    this.options.srs = options.srs || "EPSG:4326";

    // FIXME : les readers OLS ne sont pas implémentés. on utilise donc l'API REST.
    this.options.api = "REST";
    this.logger.warn("Surcharge option 'api' : REST (readers OLS non implémentés)");
    if (this.options.protocol === "XHR") {
        this.options.httpMethod = "GET";
        this.logger.trace("Surcharge option 'HttpMethod' : " + this.options.httpMethod);
    }

    // gestion de l'url du service par defaut
    // si l'url n'est pas renseignée, il faut utiliser les urls par defaut
    // en fonction du type d'api, REST ou OLS
    if (!this.options.serverUrl) {
        var lstUrlByDefault = DefaultUrlService.Route.url(this.options.apiKey);
        var urlFound = null;
        switch (this.options.api) {
            case "OLS":
                urlFound = lstUrlByDefault.ols;
                break;
            case "REST":
                var key = "route" + "-" + this.options.outputFormat;
                urlFound = lstUrlByDefault[key];
                break;
            default:
                throw new Error(_.getMessage("PARAM_UNKNOWN", "api"));
        }

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
 * @lends module:Route#
 */
Route.prototype = Object.create(CommonService.prototype, {
    // todo
    // getter/setter
});

/*
 * Constructeur (alias)
 */
Route.prototype.constructor = Route;

/**
 * (overwrite)
 * Création de la requête
 *
 * @param {Function} error   - callback des erreurs
 * @param {Function} success - callback
 */
Route.prototype.buildRequest = function (error, success) {
    var options = {
        // spécifique au service
        api : this.options.api,
        startPoint : this.options.startPoint,
        endPoint : this.options.endPoint,
        viaPoints : this.options.viaPoints,
        provideBbox : this.options.provideBbox,
        exclusions : this.options.exclusions,
        distanceUnit : this.options.distanceUnit,
        graph : this.options.graph,
        geometryInInstructions : this.options.geometryInInstructions,
        routePreference : this.options.routePreference,
        srs : this.options.srs
    };

    this.request = RouteRequestFactory.build(options);

    // on teste si la requete a bien été construite !
    if (!this.request) {
        error.call(this, new ErrorService(_.getMessage("SERVICE_REQUEST_BUILD")));
    } else {
        success.call(this, this.request);
    }
};

/**
 * (overwrite)
 * Analyse de la reponse
 *
 * @param {Function} error   - callback des erreurs
 * @param {Function} success - callback
 */
Route.prototype.analyzeResponse = function (error, success) {
    // INFO
    // Factory pour masquer la complexité du retour du service qui renvoie soit
    //  - une 'string' qui contient du XML ou JSON natif en mode XHR
    //  - un objet JSON qui est natif ou encapsulé

    if (this.response) {
        var options = {
            distanceUnit : this.options.distanceUnit, // FIXME ce parametre nous permet de choisir le type d'unité dans la reponse !
            response : this.response,
            outputFormat : this.options.outputFormat, // utile pour parser la string en mode XHR : JSON ou XML !
            api : this.options.api, // utile de connaitre le type d'API car la reponse est differente !
            rawResponse : this.options.rawResponse,
            onError : error,
            onSuccess : success,
            scope : this
        };

        RouteResponseFactory.build(options);
    } else {
        error.call(this, new ErrorService(_.getMessage("SERVICE_RESPONSE_EMPTY")));
    }
};

export default Route;
