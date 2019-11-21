
import Logger from "../../Utils/LoggerByDefault";
import _ from "../../Utils/MessagesResources";
import ErrorService from "../../Exceptions/ErrorService";
import CommonService from "../CommonService";
import DirectGeocodeRequestFactory from "./Request/DirectGeocodeRequestFactory";
import DirectGeocodeResponseFactory from "./Response/DirectGeocodeResponseFactory";

/**
 * @classdesc
 * Appel du service de géocodage direct du Géoportail :
 *     envoi de la requête construite selon les paramètres en options,
 *     éventuellement parsing et analyse  de la réponse,
 *     retour d'une réponse en paramètre de la fonction onSuccess.
 *
 *
 * @constructor
 * @extends {Gp.Services.CommonService}
 * @alias Gp.Services.Geocode
 *
 * @param {Object} options - options spécifiques au service (+ les options heritées)
 *
 * @param {String|Object} options.location - Nom de l'adresse, du toponyme, de l'unité administrative ou de la parcelle cadastrale recherchée.
 *      Sous forme de String, la propriété permet de faire une recherche déstructurée.
 *      Sous forme d'objet, la propriété permet de structurer la recherche.
 *      Dans ce cas, les propriétés possibles de cet objet sont décrites ci-après.
 *      @param {Number} [options.location.number] - Numéro du bâtiment de l'adresse recherchée, dans le cas d'une recherche structurée
 *      (si options.location est un objet Javascript).
 *      @param {String} [options.location.street] - Nom de la rue de l'adresse recherchée, dans le cas d'une recherche structurée
 *      (si options.location est un objet Javascript).
 *      @param {String} [options.location.city] - Nom de la ville de l'adresse recherchée, dans le cas d'une recherche structurée
 *      (si options.location est un objet Javascript).
 *      @param {Number} [options.location.postalCode] - Numéro du code postal de l'adresse recherchée, dans le cas d'une recherche structurée
 *      (si options.location est un objet Javascript).
 *
 * @param {Object} [options.filterOptions] - Les propriétés possibles de cet objet sont décrites ci-après.
 * @param {Object} [options.filterOptions.bbox] - Emprise dans laquelle on souhaite effectuer la recherche.
 *      Les propriétés possibles de cet objet sont décrites ci-après.
 *      @param {Float} options.filterOptions.bbox.left - Abscisse du côté gauche de la BBOX
 *      @param {Float} options.filterOptions.bbox.right - Abscisse du côté droit de la BBOX
 *      @param {Float} options.filterOptions.bbox.top - Ordonnée supérieure de la BBOX
 *      @param {Float} options.filterOptions.bbox.bottom - Ordonnée inférieure de la BBOX
 *
 * @param {Array.<String>} [options.filterOptions.type = "StreetAddress"] - Type de l'objet recherché.
 *      Le service de géocodage du Géoportail permet de rechercher des 'PostionOfInterest' pour des toponymes, des 'StreetAddress'
 *      pour des adresses postales, et/ou des 'CadastralParcel' pour des parcelles cadastrales.
 *      D'autres types pourront être rajoutés selon l'évolution du service.
 *      Par défaut, type = ['StreetAddress'].
 *
 * @param {String} [options.filterOptions.[proprietes du filtre]] - Critère supplémentaire pour filtrer la recherche sous la forme
 *      d'un couple clé/valeur à définir selon les possibilités du serveur ajouté à la requête.
 *      Le service de géocodage du Géoportail permet de filtrer tous les résultats avec les propriétés :
 *          "municipality", "insee", et "department".
 *      Il permet aussi de filtrer les adresses postales avec les propriétés :
 *          "quality", "ID", "ID_TR" et "territory".
 *      Il permet de filtrer les toponymes avec les propriétés :
 *          "importance", "nature" et "territory".
 *      Enfin, il permet de filtrer les parcelles cadastrales avec les propriétés :
 *          "sheet", "section", et "absorbedcity". Pas de valeur par défaut.
 *
 * @param {Number} [options.maximumResponses] - Nombre de réponses maximal que l'on souhaite recevoir.
 *      Pas de valeur par défaut.
 *      Si le serveur consulté est celui du Géoportail, la valeur par défaut sera donc celle du service : 25.
 *
 * @param {Boolean} [options.returnFreeForm] - Indique si l'on souhaite en réponse un localisant concaténée plutôt que structuré.
 *      Pas de valeur par défaut. Si le serveur consulté est celui du Géoportail, la valeur par défaut sera donc celle du service : 'false'.
 *
 * @param {String} [options.srs] - Système de coordonnées dans lequel les paramètres géographiques en entrée et la réponse du service sont exprimés.
 *      Pas de valeur par défaut. Si le serveur consulté est celui du Géoportail, la valeur par défaut sera donc celle du service : 'EPSG:4326'.
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
 *      positions : [{lon:, lat:}, {lon:, lat:}],
 *      (...)
 *   };
 * @private
 */
function Geocode (options) {
    if (!(this instanceof Geocode)) {
        throw new TypeError(_.getMessage("CLASS_CONSTRUCTOR", "Geocode"));
    }

    /**
     * Nom de la classe (heritage)
     * FIXME instance ou classe ?
     */
    this.CLASSNAME = "Geocode";

    // appel du constructeur par heritage
    CommonService.apply(this, arguments);

    this.logger = Logger.getLogger("Gp.Services.Geocode");
    this.logger.trace("[Constructeur Geocode (options)]");

    if (!options.location) {
        throw new Error(_.getMessage("PARAM_MISSING", "location"));
    }

    // FIXME ECMAScript 5 support
    if (typeof options.location === "object" && Object.keys(options.location).length === 0) {
        throw new Error(_.getMessage("PARAM_EMPTY", "location"));
    } else if (typeof options.location === "string" && options.location.length === 0) {
        throw new Error(_.getMessage("PARAM_EMPTY", "location"));
    }

    // ajout des options spécifiques au service
    this.options.location = options.location;

    // on definit des filtres apr defaut
    if (!options.filterOptions || typeof options.filterOptions !== "object") {
        this.options.filterOptions = options.filterOptions = {
            type : ["StreetAddress"]
        };
    }

    // FIXME ECMAScript 5 support (valable pour un objet uniquement !)
    // ceci permet de tester le cas où 'options.filterOptions' : {}
    if (Object.keys(options.filterOptions).length === 0) {
        this.options.filterOptions = {
            type : ["StreetAddress"]
        };
    }

    var filter = Object.keys(options.filterOptions);
    for (var i = 0; i < filter.length; i++) {
        var key = filter[i];
        // on transforme certains filtres qui pourraient être numériques en string
        var filtersCouldBeNumberList = ["department", "number", "postalCode", "insee", "importance", "ID", "IDTR", "absorbedCity", "sheet", "section", "inseeRegion", "inseeDepartment"];
        if (filtersCouldBeNumberList.indexOf(key) !== -1 && typeof options.filterOptions[key] !== "string") {
            options.filterOptions[key] = options.filterOptions[key].toString();
        }
        // on supprime les filtres vides
        if (!options.filterOptions[key]) {
            delete this.options.filterOptions[key];
        }
    }

    this.options.filterOptions.type = options.filterOptions.type || ["StreetAddress"];
    this.options.maximumResponses = options.maximumResponses || 25;
    this.options.returnFreeForm = options.returnFreeForm || false;
    this.options.srs = options.srs || "EPSG:4326";

    // attributs d'instances

    /**
     * Format forcé de la réponse du service : "xml"
     * sauf si l'on souhaite une reponse brute (options.rawResponse)
     */
    this.options.outputFormat = (this.options.rawResponse) ? "" : "xml";
}

/**
 * @lends module:Geocode#
 */
Geocode.prototype = Object.create(CommonService.prototype, {
    // todo
    // getter/setter
});

/*
 * Constructeur (alias)
 */
Geocode.prototype.constructor = Geocode;

/**
 * Création de la requête (overwrite)
 *
 * @param {Function} error   - callback des erreurs
 * @param {Function} success - callback
 */
Geocode.prototype.buildRequest = function (error, success) {
    var options = {
        httpMethod : this.options.httpMethod,
        // options specifiques du service
        location : this.options.location,
        returnFreeForm : this.options.returnFreeForm,
        filterOptions : this.options.filterOptions,
        srs : this.options.srs,
        maximumResponses : this.options.maximumResponses
    };

    this.request = DirectGeocodeRequestFactory.build(options);

    // on teste si la requete a bien été construite !
    (!this.request)
        ? error.call(this, new ErrorService(_.getMessage("SERVICE_REQUEST_BUILD")))
        : success.call(this, this.request);
};

/**
 * Analyse de la reponse (overwrite)
 *
 * @param {Function} error   - callback des erreurs
 * @param {Function} success - callback
 */
Geocode.prototype.analyzeResponse = function (error, success) {
    /* INFO :
         Etape 1 : Création de la requête
            -> Appel du format OpenLS pour créer une requête à partir des paramètres (par exemple)
              (soit directement une URL si GET, soit une requête XML si POST)
            /!\ tester si apiKey && serverUrl => on ne garde que serverUrl
            -> stockage de la requête dans this.request
         Etape 2 : Envoi de la requête selon le bon protocole
            -> appel du protocol JSONP ou XHR, et envoi (par ex send ()) (this.protocol)
            -> récupération de la réponse xml dans la fonction onSuccess () (this.response)
            -> si code HTTP 200 et pas de message d'erreur : etape 3
            -> si code HTTP != 200 : lancement de la fonction de callback onFailure avec le message d'erreur
         Etape 3 : Analyse de la réponse xml et construction du JSON (si rawResponse === false )
            -> appel du parser pour récupérer le xmlDocument
            -> appel du reader OpenLS pour lire les éléments et récupérer l'objet JSON
               correspondant au type de géocodage (défini dans les specs)
         Etape 4 : Lancement de la fonction de callback onSuccess avec la réponse :
            -> xmlResponse (si rawResponse === true)
            -> ou geocodedLocations
    */

    if (this.response) {
        var options = {
            response : this.response,
            rawResponse : this.options.rawResponse,
            onError : error,
            onSuccess : success,
            scope : this
        };

        DirectGeocodeResponseFactory.build(options);
    } else {
        error.call(this, new ErrorService(_.getMessage("SERVICE_RESPONSE_EMPTY")));
    }
};

export default Geocode;
