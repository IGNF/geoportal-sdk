
import Logger from "../../Utils/LoggerByDefault";
import _ from "../../Utils/MessagesResources";
import Helper from "../../Utils/Helper";
import ErrorService from "../../Exceptions/ErrorService";
import DefaultUrlService from "../DefaultUrlService";
import CommonService from "../CommonService";
import AutoConfResponseFactory from "./Response/AutoConfResponseFactory";

/**
 * @classdesc
 * Appel du service d'autoconfiguration du Géoportail
 *
 * @private
 * @constructor
 * @extends {Gp.Services.CommonService}
 * @alias Gp.Services.AutoConf
 *
 * @param {Object} options - options spécifiques au service (+ les options heritées)
 *
 * @param {String} [options.layerId] - Le nom de l'agrégat (couche) dont on veut connaître les informations détaillées.
 *      La présence de cette propriété implique l'utilisation de la deuxième opération du service pour accéder aux informations d'une couche aggrégée.
 *      Dans ce cas, la fonction effectuera quand même dans un premier temps la récupération des informations de l'auto-
 *      configuration complète, sauf si un premier appel à l'autoconf a déjà été fait avec cette clé (i.e. si la variable globale est définie
 *      pour la clé de contrat). Elle ira ensuite chercher les informations des couches agrégées, qui seront ajoutées à la variable globale Gp.Config.
 *
 * @example
 *   var options = {
 *      // options communes aux services
 *      apiKey : "apikey",
 *      protocol : 'JSONP', // JSONP|XHR
 *      timeOut : 10000, // ms
 *      rawResponse : false, // true|false
 *      scope : null, // this
 *      onSuccess : function (response) {},
 *      onFailure : function (error) {},
 *      layerId : "ORTHOIMAGERY.ORTHOPHOTOS.3D$GEOPORTAIL:OGC:WMTS@aggregate"
 *   };
 */
function AutoConf (options) {
    if (!(this instanceof AutoConf)) {
        throw new TypeError(_.getMessage("CLASS_CONSTRUCTOR", "AutoConf"));
    }

    /**
     * Nom de la classe (heritage)
     * FIXME instance ou classe ?
     */
    this.CLASSNAME = "AutoConf";

    // Autoconf default protocol remains JSONP (#see http://ignf.github.io/geoportal-access-lib/latest/jsdoc/tutorial-optimize-getconfig.html)
    if (!options) {
        options = {};
    }
    options.protocol = options.protocol || "JSONP";

    // appel du constructeur par heritage
    CommonService.apply(this, arguments);

    this.logger = Logger.getLogger("Gp.Services.AutoConf");
    this.logger.trace("[Constructeur AutoConf (options)]");

    // #####################
    // analyse des options
    // #####################

    // gestion de l'url du service par defaut
    if (!this.options.serverUrl) {
        // si l'url n'est pas renseignée, il faut utiliser les urls par defaut
        // en fonction du nombre de clés en entrée et du paramètre layerId
        if (!this.options.serverUrl) {
            var lstUrlByDefault = DefaultUrlService.AutoConf.url(this.options.apiKey);

            if (!this.options.layerId) {
                // cas d'une autoconf simple
                if (Array.isArray(this.options.apiKey) && this.options.apiKey.length > 0) {
                    // cas d'un tableau de clés en entrée
                    this.options.serverUrl = lstUrlByDefault.apiKeys;
                } else {
                    this.options.serverUrl = lstUrlByDefault.apiKey;
                }
            } else {
                // cas d'une autoconf pour des couches aggrégées
                this.options.serverUrl = lstUrlByDefault.aggregate + this.options.layerId;
            }
        }
    }

    // INFO
    // le service ne repond pas en mode POST (405 Method Not Allowed)
    if (this.options.protocol === "XHR" && this.options.httpMethod === "POST") {
        this.logger.warn("Le service ne gére pas le mode d'interrogation en POST, on bascule sur du GET !");
        this.options.httpMethod = "GET"; // on surcharge !
    }

    // #####################
    // attributs d'instances
    // #####################

    /**
     * Format forcé de la réponse du service : "xml"
     * sauf si l'on souhaite une reponse brute (options.rawResponse)
     */
    this.options.outputFormat = (this.options.rawResponse) ? "" : "xml";
}

/**
 * @lends module:AutoConf#
 */

AutoConf.prototype = Object.create(CommonService.prototype, {
    // todo
    // getter/setter
});

/*
 * Constructeur (alias)
 */
AutoConf.prototype.constructor = AutoConf;

/**
 * Création de la requête (overwrite)
 *
 * @param {Function} error   - callback des erreurs
 * @param {Function} success - callback de succès de la création de la requête
 */
AutoConf.prototype.buildRequest = function (error, success) {
    var scope = typeof window !== "undefined" ? window : {};

    if (scope.Gp && scope.Gp.Config && scope.Gp.Config.generalOptions && scope.Gp.Config.layers) {
        if (scope.Gp.Config.generalOptions.apiKeys[this.options.apiKey]) {
            if (this.options.layerId) { // cas d'une autoconf + détaillée sur une couche agrégée
                if (scope.Gp.Config.layers[this.options.layerId] && scope.Gp.Config.layers[this.options.layerId].aggregatedLayers) {
                    this.logger.warn("Gp.Config existe déjà pour cette clé et cette couche");
                    this.options.onSuccess.call(this, scope.Gp.Config);
                    return;
                }
            } else {
                this.logger.warn("Gp.Config existe déjà pour cette clé");
                this.options.onSuccess.call(this, scope.Gp.Config);
                return;
            }
        }
    }

    // requete par defaut
    this.request = "";

    // gestion de l'autoconf local
    // Le fichier en local doit respecter le format de sortie du service.
    //  - En XHR, le format est en xml
    //  - En JSONP, le format est en xml encapsulé dans un json avec une fonction de callback
    //    ex. callback ({"http":{"status":200,"error":null},"xml":"..."})
    var bLocal;
    if (this.options.serverUrl.indexOf("http://") === -1) {
        bLocal = true;
    } else {
        bLocal = false;
    }

    // FIXME param. KVP optionnel sur un service uniquement (pas sur un autoconf local !)
    if (!bLocal && this.layerId) {
        this.request = Helper.normalyzeParameters({
            layerId : this.layerId
        });
    }

    // normalement pas d'erreur d'autoconf...
    (this.request || this.request === "")
        ? success.call(this, this.request)
        : error.call(this, new ErrorService(_.getMessage("SERVICE_REQUEST_BUILD")));
};

/**
 * Analyse de la reponse (overwrite)
 *
 * @param {Function} error   - callback des erreurs
 * @param {Function} success - callback de succès de l'analyse de la réponse
 */
AutoConf.prototype.analyzeResponse = function (error, success) {
    if (this.response) {
        var options = {
            layerId : this.options.layerId,
            response : this.response,
            rawResponse : this.options.rawResponse,
            onSuccess : success,
            onError : error,
            scope : this
        };

        AutoConfResponseFactory.build(options);
    } else {
        error.call(this, new ErrorService(_.getMessage("SERVICE_RESPONSE_EMPTY")));
    }
};

export default AutoConf;
