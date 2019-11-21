/**
 * Factory pour générer une reponse JSON à partir d'un XML
 *
 * @module AutoConfReponseFactory
 * @private
 * @alias Gp.Services.AutoConf.Response.AutoConfResponseFactory
 * @todo gérer le cas du JSONP qui encapsule du XML ?
 */
import Logger from "../../../Utils/LoggerByDefault";
import MRes from "../../../Utils/MessagesResources";
import ErrorService from "../../../Exceptions/ErrorService";
import XML from "../../../Formats/XML";
import AutoConfResponseReader from "../Formats/AutoConfResponseReader";

var AutoConfReponseFactory = {

    /**
     * interface unique
     * Fabrique d'analyse des réponses (xml) du service d'autoconfiguration.
     * Création d'un format XML, auquel on associe un reader et une chaîne XML, et qui renverra un objet JavaScript correspondant.
     * Si une erreur est levée lors de l'analyse, ou si l'objet est vide ou contient une exception : appel de la fonction de callback onError
     * Sinon, appel de la fonction de callback onSuccess (définies dans Autoconf.analyzeResponse)
     *
     * @method build
     * @static
     * @param {Object} options - options definies dans le composant AutoConf
     *
     * @example
     *   var options = {
     *      layerId :
     *      response :
     *      rawResponse :
     *      scope :
     *      onSuccess :
     *      onError :
     *   };
     */
    build : function (options) {
        // logger
        var logger = Logger.getLogger("AutoConfResponseFactory");
        logger.trace(["AutoConfResponseFactory::build()"]);

        // data de type AutoConfResponse
        var data = null;

        if (options.response) {
            if (options.rawResponse) {
                data = options.response;
            } else {
                try {
                    var p = new XML({
                        reader : AutoConfResponseReader
                    });

                    if (typeof options.response === "string") {
                        p.setXMLString(options.response);
                    } else {
                        p.setXMLDoc(options.response);
                    }

                    data = p.parse();
                } catch (e) {
                    // si une exception a été levée, on appelle le callback d'erreur avec le message renvoyé
                    var message = e.message;
                    if (typeof options.response === "string") {
                        message += "\n (raw response service'" + options.response + "')";
                    } else {
                        message += "\n (raw response service'" + options.response.documentElement.innerHTML + "')";
                    }

                    options.onError.call(options.scope, new ErrorService({
                        message : MRes.getMessage("SERVICE_RESPONSE_EXCEPTION", message),
                        status : 200,
                        type : ErrorService.TYPE_SRVERR
                    }));
                    return;
                }

                // Si la réponse est vide, on appelle le callback d'erreur
                var isEmpty = true;
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        isEmpty = false;
                    }
                }
                if (isEmpty) {
                    options.onError.call(options.scope, new ErrorService(MRes.getMessage("SERVICE_RESPONSE_EMPTY_2")));
                    return;
                }

                // Si la réponse contenait une exception renvoyée par le service, on appelle le callback d'erreur
                if (data.exceptionReport) {
                    options.onError.call(options.scope, new ErrorService({
                        message : MRes.getMessage("SERVICE_RESPONSE_EXCEPTION", data.exceptionReport),
                        type : ErrorService.TYPE_SRVERR,
                        status : 200
                    }));
                    return;
                }
            }
        } else {
            // si la réponse (xmlString) est vide, on appelle le callback d'erreur
            options.onError.call(options.scope, new ErrorService(MRes.getMessage("SERVICE_RESPONSE_EMPTY")));
            return;
        }

        // définition de la variable globale Gp.Config à partir de la réponse
        var scope = typeof window !== "undefined" ? window : {};

        if (!scope.Gp) {
            scope.Gp = {};
        }
        if (!scope.Gp.Config) {
            scope.Gp.Config = data;
        } else {
            this.mergeConfig(scope.Gp.Config, data, options.layerId);
        }

        // si tout s'est bien passé, on appelle le callback de succès
        options.onSuccess.call(options.scope, scope.Gp.Config);
    },

    /**
     * Fonction utilisée dans le cas où l'autoconfiguration est appelée plusieurs fois
     * (par exemple pour des clés différentes ou pour des infos sur une couche agrégée)
     *
     * @method mergeConfig
     * @static
     * @param {Object} GpConfig - Variable Gp.Config préexistante
     * @param {Object} data - la nouvelle réponse de l'autoconf, à fusionner avec GpConfig
     * @param {String} [layerId] - l'identifiant d'une couche agrégée dans le cas d'une 2è opération de l'autoconf
     */
    mergeConfig : function (GpConfig, data, layerId) {
        if (data && GpConfig) {
            // on boucle sur les propriétés (generalOptions, layers, projections, services, tileMatrixSets, territories)
            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    // on récupère la nouvelle clé dans generalOptions
                    if (prop === "generalOptions") {
                        for (var key in data[prop].apiKeys) {
                            if (data[prop].apiKeys.hasOwnProperty(key) && !GpConfig.generalOptions.apiKeys[key]) {
                                GpConfig.generalOptions.apiKeys[key] = data[prop].apiKeys[key];
                            }
                        }
                        // on récupère les nouveaux objets (TMS, layers, projections...)
                    } else {
                        if (GpConfig[prop]) {
                            for (var obj in data[prop]) {
                                if (data[prop].hasOwnProperty(obj) && !GpConfig[prop][obj]) {
                                    GpConfig[prop][obj] = data[prop][obj];
                                }
                            }
                        }
                    }
                }
            }

            // dans le cas d'une autoconf pour une couche agrégée, on récupère l'info
            if (layerId) {
                var aggregatedLayers = [];

                for (var lyr in data.layers) {
                    if (data.layers.hasOwnProperty(lyr)) {
                        aggregatedLayers.push(lyr);
                    }
                }

                if (GpConfig.layers[layerId]) {
                    GpConfig.layers[layerId].aggregatedLayers = aggregatedLayers;
                }
            }
        }
    }
};

export default AutoConfReponseFactory;
