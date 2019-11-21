
import Logger from "../../Utils/LoggerByDefault";
import _ from "../../Utils/MessagesResources";
import ErrorService from "../../Exceptions/ErrorService";
import CommonService from "../CommonService";
import ReverseGeocodeRequestFactory from "./Request/ReverseGeocodeRequestFactory";
import ReverseGeocodeResponseFactory from "./Response/ReverseGeocodeResponseFactory";

/**
 * @classdesc
 * Appel du service de géocodage inverse du Géoportail :
 *     envoi de la requête construite selon les paramètres en options,
 *     éventuellement parsing et analyse  de la réponse,
 *     retour d'une réponse en paramètre de la fonction onSuccess.
 * @constructor
 * @extends {Gp.Services.CommonService}
 * @alias Gp.Services.ReverseGeocode
 *
 * @param {Object} options - options spécifiques au service (+ les options heritées)
 *
 * @param {Object} options.position - Position du point de référence pour le calcul de proximité exprimée dans le système de référence spécifié par le srs.
 *      @param {Float} options.position.x - Abcisse du point de référence pour le calcul de proximité exprimée dans le système de référence spécifié par le srs. (= longitude si srs = "CRS:84", latitude si srs = "EPSG:4326")
 *      @param {Float} options.position.y - Ordonnée du point de référence pour le calcul de proximité exprimée dans le système de référence spécifié par le srs. (= latitude si srs = "CRS:84", longitude si srs = "EPSG:4326")
 *
 * @param {Object} [options.filterOptions] - Les propriétés possibles de cet objet sont décrites ci-après.
 * @param {Object} [options.filterOptions.bbox] - Emprise dans laquelle on souhaite effectuer la recherche.
 *      Les propriétés possibles de cet objet sont décrites ci-après.
 *      @param {Float} options.filterOptions.bbox.left   - Abscisse du côté gauche de la BBOX
 *      @param {Float} options.filterOptions.bbox.right  - Abscisse du côté droit de la BBOX
 *      @param {Float} options.filterOptions.bbox.top    - Ordonnée supérieure de la BBOX
 *      @param {Float} options.filterOptions.bbox.bottom - Ordonnée inférieure de la BBOX
 *
 * @param {Object} [options.filterOptions.circle] - Cercle dans lequel on souhaite effectuer la recherche.
 *      Les propriétés possibles de cet objet sont décrites ci-après.
 *      @param {Float} options.filterOptions.circle.x      - Abscisse du centre du cercle de recherche.
 *      @param {Float} options.filterOptions.circle.y      - Ordonnée du centre du cercle de recherche.
 *      @param {Float} options.filterOptions.circle.radius - Rayon du cercle de recherche.
 *
 * @param {Array.<Object>} [options.filterOptions.polygon] - Polygone dans lequel on souhaite effectuer la recherche.
 *      Liste des couples x et y pour chaque point constituant le polygone.
 *
 * @param {Array.<String>} [options.filterOptions.type = "StreetAddress"] - Type de l'objet recherché.
 *      Le service de géocodage du Géoportail permet de rechercher des 'PostionOfInterest' pour des toponymes, des 'StreetAddress'
 *      pour des adresses postales et/ou des 'CadastralParcel' pour des parcelles cadastrales.
 *      D'autres types pourront être rajoutés selon l'évolution du service.
 *      Par défaut, type = ['StreetAddress'].
 *
 * @param {Number} [options.maximumResponses] - Nombre de réponses maximal que l'on souhaite recevoir.
 *      Pas de valeur par défaut. Si le serveur consulté est celui du Géoportail, la valeur par défaut sera donc celle du service : 25.
 *
 * @param {String} [options.srs = CRS:84] - Système de coordonnées dans lequel les paramètres géographiques en entrée et la réponse du service sont exprimés.
 *      Pas de valeur par défaut.
 *      Si le serveur consulté est celui du Géoportail, la valeur par défaut est : "CRS:84".
 *
 * @example
 *   var options = {
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
 *      position : {x:0 , y:0},
 *      filterOptions :{
 *          bbox : {left : 0, right : 1, top : 1, bottom : 0},
 *          [circle : {
 *              x : 0,
 *              y : 0,
 *              radius : 100
 *          }]
 *          [polygon  : [{x:0,y:0}, {x:1,y:1}, {x:2,y:2}, {x:3,y:2}, {x:4,y:1}, {x:0,y:0}]]
 *          type : ['StreetAddress']
 *      },
 *      maximumResponses : 25,
 *      srs : 'EPSG:4326'
 *   };
 *
 * @private
 */
function ReverseGeocode (options) {
    if (!(this instanceof ReverseGeocode)) {
        throw new TypeError(_.getMessage("CLASS_CONSTRUCTOR", "ReverseGeocode"));
    }

    /**
     * Nom de la classe (heritage)
     * FIXME instance ou classe ?
     */
    this.CLASSNAME = "ReverseGeocode";

    // appel du constructeur par heritage
    CommonService.apply(this, arguments);

    this.logger = Logger.getLogger("Gp.Services.ReverseGeocode");
    this.logger.trace("[Constructeur ReverseGeocode (options)]");

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

    // ajout des options spécifiques au service
    this.options.position = options.position;

    // on definit des filtres par defaut
    if (!options.filterOptions || typeof options.filterOptions !== "object") {
        this.options.filterOptions = options.filterOptions = {
            type : ["StreetAddress"]
        };
    }

    // FIXME ECMAScript 5 support (valable pour un objet uniquement !)
    // ceci permet de tester le cas où : object = {}
    if (Object.keys(options.filterOptions).length === 0) {
        this.options.filterOptions = {
            type : ["StreetAddress"]
        };
    }

    // on teste pour chaque filtre, les conditions suivantes : null ou vide !
    var filter = Object.keys(options.filterOptions);
    for (var i = 0; i < filter.length; i++) {
        var key = filter[i];
        if (!options.filterOptions[key] || Object.keys(options.filterOptions[key]).length === 0) {
            delete this.options.filterOptions[key];
        }
    }

    this.options.filterOptions.type = options.filterOptions.type || ["StreetAddress"];
    // on vérifie que le type est bien dans un tableau
    if (!Array.isArray(this.options.filterOptions.type)) {
        throw new Error(_.getMessage("PARAM_TYPE", "filterOptions.type"));
    }

    this.options.maximumResponses = options.maximumResponses || 25;

    // FIXME : cet attribut (returnFreeForm) n'est pas spécifié dans la doc du constructeur ?
    // Il est inutile en effet, mais présent dans les specs...
    this.options.returnFreeForm = options.returnFreeForm || false;
    // info : en réalité le service ne reconnait que EPSG:4326. this.options.srs permet essentiellement de différencier EPSG:4326 (lat,lon) et CRS:84 (lon,lat)
    this.options.srs = options.srs || "CRS:84";

    // si on n'a pas un systeme de coordonnées EPSG géographique, il faut inverser les coordonnées
    // (car elles sont en lon, lat alors que le service attend une position en lat, lon).
    // dans le cas d'EPSG:4326 par exemple, les coordonnées sont bien en lat, lon donc on ne fait rien.
    if (ReverseGeocode.geoEPSG.indexOf(this.options.srs) === -1) {
        // pour la position
        this.options.position = {
            x : this.options.position.y,
            y : this.options.position.x
        };
        // pour les filtres spatiaux s'ils sont spécifiés
        if (this.options.filterOptions && this.options.filterOptions.circle) {
            var circle = this.options.filterOptions.circle;
            this.options.filterOptions.circle = {
                x : circle.y,
                y : circle.x,
                radius : circle.radius
            };
        }
        if (this.options.filterOptions && this.options.filterOptions.polygon) {
            var polygon = this.options.filterOptions.polygon;
            for (i = 0; i < polygon.length; i++) {
                var coords = polygon[i];
                this.options.filterOptions.polygon[i] = {
                    x : coords.y,
                    y : coords.x
                };
            }
        }
    }

    // attributs d'instances

    /**
     * Format forcé de la réponse du service : "xml"
     * sauf si l'on souhaite une reponse brute (options.rawResponse)
     */
    this.options.outputFormat = (this.options.rawResponse) ? "" : "xml";
}

/**
 * @lends module:ReverseGeocode#
 */
ReverseGeocode.prototype = Object.create(CommonService.prototype, {
    // todo
    // getter/setter
});

/*
 * Constructeur (alias)
 */
ReverseGeocode.prototype.constructor = ReverseGeocode;

/**
 * (overwrite)
 * Création de la requête
 *
 * @param {Function} error   - callback des erreurs
 * @param {Function} success - callback
 */
ReverseGeocode.prototype.buildRequest = function (error, success) {
    var options = {
        httpMethod : this.options.httpMethod,
        // options specifiques du service
        position : this.options.position,
        returnFreeForm : this.options.returnFreeForm,
        filterOptions : this.options.filterOptions,
        srs : "EPSG:4326", // info : en réalité le service ne reconnait que EPSG:4326. this.options.srs permet essentiellement de différencier EPSG:4326 (lat,lon) et CRS:84 (lon,lat)
        maximumResponses : this.options.maximumResponses
    };

    this.request = ReverseGeocodeRequestFactory.build(options);

    // on teste si la requete a bien été construite !
    (!this.request)
        ? error.call(this, new ErrorService(_.getMessage("SERVICE_REQUEST_BUILD")))
        : success.call(this, this.request);
};

/**
 * (overwrite)
 * Analyse de la reponse
 *
 * @param {Function} error   - callback des erreurs
 * @param {Function} success - callback
 */
ReverseGeocode.prototype.analyzeResponse = function (error, success) {
    if (this.response) {
        var options = {
            response : this.response,
            rawResponse : this.options.rawResponse,
            onError : error,
            onSuccess : success,
            scope : this
        };

        ReverseGeocodeResponseFactory.build(options);
    } else {
        error.call(this, new ErrorService(_.getMessage("SERVICE_RESPONSE_EMPTY")));
    }
};

/**
 * Codes EPSG géographiques (lat/lon). Utiles car les coordonnées doivent être inversées.
 */
ReverseGeocode.geoEPSG = ["EPSG:4326"];

export default ReverseGeocode;
