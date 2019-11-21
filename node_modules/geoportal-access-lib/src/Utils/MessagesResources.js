/**
 * Classe de gestion des erreurs qui permer d'associer un message d'erreur à l'exception lancée.
 *
 * @example
 * MessagesResources.getMessage("ERROR_PARAM_MISSING", "x", "y", "z")));
 * // --> output : Parameter(s) 'x - y - z' missing
 *
 * @module MessagesResources
 * @alias Gp.Utils.MessagesResources
 * @private
 */
var MessagesResources = {

    // Paramètres
    PARAM_MISSING : "Parameter(s) '%var%' missing",
    PARAM_EMPTY : "Parameter(s) '%var%' empty",
    PARAM_TYPE : "Wrong type(s) for parameter(s) '%var%'",
    PARAM_FORMAT : "Parameter(s) '%var%' not correctly formatted",
    PARAM_NOT_SUPPORT : "Value(s) for parameter(s) '%var%' not supported",
    PARAM_NOT_SUPPORT_NODEJS : "Value(s) for parameter(s) '%var%' not supported to NodeJS",
    PARAM_UNKNOWN : "Value(s) for parameter(s) '%var%' unknown",

    // Services
    // Requête
    SERVICE_REQUEST_BUILD : "An error occurred during the request building of the service",
    SERVICE_REQUEST_EMPTY : "The request sent to the service is empty",

    // Réponse
    SERVICE_RESPONSE_EXCEPTION : "The service returned an exception : '%var%'",
    SERVICE_RESPONSE_EXCEPTION_2 : "The service returned an exception",
    SERVICE_RESPONSE_ANALYSE : "An error occurred while parsing the response '%var%' of the service",
    SERVICE_RESPONSE_ANALYSE_2 : "An unknown error occurred while parsing the response",
    SERVICE_RESPONSE_EMPTY : "The response of the service is empty",
    SERVICE_RESPONSE_EMPTY_2 : "The response from the service could not be analyzed or is empty",
    SERVICE_RESPONSE_FORMAT : "The format of the service response is not supported (handled format(s) : '%var%')",
    SERVICE_RESPONSE_FORMAT_2 : "The format of the service response is not supported",
    SERVICE_RESPONSE_FORMAT_3 : "No suggestion matching the search",

    // Classes
    CLASS_CONSTRUCTOR : "'%var%' constructor cannot be called as a function.",

    /**
     * Fonction qui va retourner le message d'erreur associé à la clé donnée
     *
     * @method getMessage
     * @param {String} clef - Clef de l'erreur (ex : ERROR_PARAM)
     * @param {String[]} parametres - Paramètres/variables concernés par le message d'erreur associé à la clef donnée
     * @return {String} message - String contenant le message de l'exception
     */
    getMessage : function (clef, parametres) {
        // param de la fonction uniquement pour la documentation...

        if (Object.keys(arguments).length === 0) {
            return "Message indefined !";
        }

        var params = Array.prototype.slice.call(arguments);
        var key = params.shift();
        var args = params;

        var message = this[key];

        try {
            if (Array.isArray(args) && args.length > 0) {
                message = message.replace("%var%", args.join(" - "));
            } else {
                message = message.replace("%var%", "%var% (not specified)");
            }
        } catch (e) {
            // error de string.replace()

        }

        return message;
    }
};

export default MessagesResources;
