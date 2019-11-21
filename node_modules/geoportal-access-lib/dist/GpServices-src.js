/*!
 * @brief Geoportal resources access library
 *
 * This software is released under the licence CeCILL-B (Free BSD compatible)
 * @see http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt
 * @see http://www.cecill.info/licences/Licence_CeCILL-B_V1-fr.txt
 * @see http://www.cecill.info/
 *
 * copyright CeCILL-B
 * copyright IGN
 * @author IGN
 * @version 2.1.5
 * @date 12/09/2019
 *
 */
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   v4.2.4
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("xmldom"), require("request"));
	else if(typeof define === 'function' && define.amd)
		define("Gp", ["require", "require"], factory);
	else if(typeof exports === 'object')
		exports["Gp"] = factory(require("xmldom"), require("request"));
	else
		root["Gp"] = factory(root[undefined], root[undefined]);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_20__, __WEBPACK_EXTERNAL_MODULE_53__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 44);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_loglevel__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_loglevel___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_loglevel__);


var LoggerByDefault = {
    /**
     * logger statique
     *
     * @static
     * @param {String} name - nom du logger
     * @returns {Object} retourne un logger
     */
    getLogger : function (name) {
        // Substitute global constants configured at compile time
        // cf. webpack.config.js
        // FIXME howtodo !? DefineWebpackPlugin ? EnvironmentWebpackPlugin ?
        ("false".match(/true/))
            ? __WEBPACK_IMPORTED_MODULE_0_loglevel__["disableAll"]() : __WEBPACK_IMPORTED_MODULE_0_loglevel__["enableAll"]();
        var logname = name || "default";
        return __WEBPACK_IMPORTED_MODULE_0_loglevel__["getLogger"](logname);
    }
};

/* harmony default export */ __webpack_exports__["a"] = (LoggerByDefault);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/* harmony default export */ __webpack_exports__["a"] = (MessagesResources);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Errors raised by API for one among three reasons : wrong API usage, underlying service error or unknown reason.
 *
 * @property {String} message - Error message
 * @property {Number} status - Error status : when {@link Gp.Error.TYPE_SRVERR}, gives the [HTTP status of the underlying web service response]{@link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes} ; -1 otherwise.
 * @property {String} type - Error type ({@link Gp.Error.TYPE_SRVERR}, {@link Gp.Error.TYPE_USEERR} or {@link Gp.Error.TYPE_UNKERR}).
 *
 * @namespace
 * @alias Gp.Error
 * @param {Object|String} error - Options for creating error object. Can be a String (message) or an Object.
 * @param {String} error.message - Error message to return to user.
 * @param {enum} [error.type=TYPE_UNKERR] - Error type
 * @param {status} [error.status=-1] - Error status : when {@link Gp.Error.TYPE_SRVERR}, gives the [HTTP status of the underlying web service response]{@link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes}.
 *
 */
function ErrorService (error) {
    if (!(this instanceof ErrorService)) {
        throw new TypeError("ErrorService constructor cannot be called as a function.");
    }

    var e = error;
    if (typeof error === "string" || error instanceof String) {
        this.message = error;
        this.status = -1;
        this.type = ErrorService.TYPE_UNKERR;
    } else {
        this.message = e.message || "undefined!?";
        this.type = e.type;
        this.status = e.status || -1;
    }

    this.name = "ErrorService";
    this.stack = (new Error()).stack;
}

/**
 * Error raised when underlying geoportal service answers on error.
 *
 * @type {String}
 * @constant
 * @static
 */
ErrorService.TYPE_SRVERR = "SERVICE_ERROR";
/**
 * Error raised when funcion use is inappropriate
 *
 * @type {String}
 * @constant
 * @static
 */
ErrorService.TYPE_USEERR = "USAGE_ERROR";
/**
 * Error raised when API can't perform the job for a reason other than the two other ones.
 *
 * @type {String}
 * @constant
 * @static
 */
ErrorService.TYPE_UNKERR = "UNKNOWN_ERROR";

/**
 * @lends module:ErrorService
 */
ErrorService.prototype = Object.create(Error.prototype, {
    constructor : {
        value : ErrorService,
        writable : true,
        configurable : true
    }
});

/* harmony default export */ __webpack_exports__["a"] = (ErrorService);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Utils_Helper__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Utils_MessagesResources__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Protocols_Protocol__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Exceptions_ErrorService__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__DefaultUrlService__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__package_json__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__package_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__package_json__);






// package.json (extract version)


/**
 * @classdesc
 * Composant Service
 *
 * @constructor
 * @alias Gp.Services.CommonService
 * @param {Object} options - options communes à tous les services
 *
 * @param {String} options.apiKey - Clef d'accès à la plateforme Géoportail,
 *      nécessaire pour franchir la couche de contrôle des accès pour avoir une réponse du service invoqué.
 *      Plusieurs clefs peuvent être passées dans le cas de l'invocation du service d'autoconfiguration.
 *      Si ce paramètre n'est pas renseigné, alors le paramètre serverUrl doit être renseigné (comprenant alors, si nécessaire la clef API).
 *
 * @param {String} options.serverUrl - URL d'accès au service.
 *      Permet de forcer l'utilisation d'un service équivalent déployé derrière une éventuelle autre URL d'accès.
 *      Si ce paramètre est renseigné alors, le paramètre apiKey est ignoré.
 *
 * @param {String} [options.protocol] - Le protocole à utiliser pour récupérer les informations du service :
 *      peut valoir 'JSONP' ou 'XHR'.
 *      Par défaut, c'est le protocole XHR qui sera utilisé.
 *      Attention, le protocole JSONP n'est pas valide dans un environnement NodeJS (Utilisation du mode XHR).
 *
 * @param {Boolean} [options.ssl] - Indique si l'on souhaite intérroger les services en https.
 *      Ce paramètre ne fonctionne que pour une utilisation hors navigateur (ex. NodeJS).
 *      Sur un navigateur, le protocole est automatiquement extrait de l'url du site...
 *      Par défaut, on utilise le protocole http (ssl=false).
 *
 * @param {String} [options.proxyURL] - Le proxy à utiliser pour pallier au problème de cross-domain dans le cas d'une requête XHR.
 *      Utile si le paramètre 'protocol' vaut 'XHR', il ne sera pas pris en compte si protocol vaut JSONP.
 *
 * @param {String} [options.callbackSuffix] - Suffixe de la fonction de callback à utiliser, dans le cas du protocole JSONP.
 *      Par défaut, la fonction de callback portera un nom du type "callback"+ID, où ID est soit un identifiant unique généré à chaque requête,
 *      soit le paramètre callbackSuffix s'il est spécifié. Par exemple, si callbackSuffix="_2", la fonction sera "callback_2 ()".
 *      Utile pour utiliser une réponse déjà encapsulée dans une fonction de callback, dont le nom est connu (ex : chargement de l'autoconfiguration en local)
 *      Utile seulement si le paramètre 'protocol' vaut 'JSONP', il ne sera pas pris en compte si protocol vaut 'XHR'.
 *
 * @param {String} [options.httpMethod] - La méthode HTTP
 *      à utiliser dans le cas d'une requête XHR : peut valoir 'GET' ou 'POST'.
 *      Non pris en compte si 'protocol' vaut JSONP qui fonctionne obligatoirement en GET.
 *      Par défaut, c'est la méthode GET qui est utilisée.
 *
 * @param {String} [options.contentType] - Content-Type de la requete
 *      à utiliser dans le cas d'une requête XHR en mode POST.
 *      Non pris en compte si 'protocol' vaut JSONP et/ou la méthode HTTP vaut GET.
 *      Par défaut, c'est la méthode GET qui est utilisée donc on n'utilise pas de Content-Type.
 *
 * @param {Number} [options.timeOut] - Délai d'attente maximal (en ms) de la réponse du service (à partir de l'envoi de la requête).
 *      Par défaut, aucun timeOut n'est pris en compte (timeoutDelay= 0).
 *
 * @param {Boolean} [options.rawResponse] - Indique si l'on souhaite que la réponse du service ne soit pas parsée par l'API avant d'être restituée.
 *      (Cf. paramètre « onSuccess » pour plus de détails).
 *
 * @param {Function} [options.onSuccess] - Fonction appelée lorsque le service répond correctement à la requête
 *      (code HTTP 200, sans message d'erreur).
 *      Cette fonction prend en paramètre la réponse du service,
 *      soit sous la forme d'un Object Javascript formaté par le parseur dédié à la syntaxe du service (comportement par défaut) ;
 *      soit brute au format String non prétraité si le paramètre « rawResponse » a été précisé avec la valeur « true ».
 *
 * @param {Function} [options.onFailure] - Fonction appelée lorsque le service ne répond pas correctement
 *      (code HTTP de retour différent de 200 ou pas de réponse).
 *
 * @param {Function} [options.onBeforeParse] - Fonction appelée avant le parsing de la réponse
 *      Permet de modifier la réponse avant parsing et la fonction doit retourner une String.
 *      Cette fonction prend en paramètre la réponse telle que renvoyée par le service
 *      (cad au format json ou xml).
 *      Pour le JSONP, si le paramètre "rawResponse" a été précisé avec la valeur "true",
 *      la fonction prend en paramètre un Object JavaScript contenant la réponse XML.
 *
 * @example
 *   var options = {
 *      apiKey : null,
 *      serverUrl : 'http://localhost/service/',
 *      protocol : 'JSONP', // JSONP|XHR
 *      ssl : false,
 *      proxyURL : null,
 *      callbackName : null,
 *      httpMethod : 'GET', // GET|POST
 *      timeOut : 10000, // ms
 *      rawResponse : false, // true|false
 *      scope : null, // this
 *      onSuccess : function (response) {},
 *      onFailure : function (error) {},
 *      onBeforeParse : function (rawResponse) {}
 *   };
 * @private
 */
function CommonService (options) {
    if (!(this instanceof CommonService)) {
        throw new TypeError(__WEBPACK_IMPORTED_MODULE_2__Utils_MessagesResources__["a" /* default */].getMessage("CLASS_CONSTRUCTOR"));
    }

    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("CommonService");
    this.logger.trace("[Constructeur CommonService (options)]");

    // #####################
    // récupération des options par défaut pour les paramètres optionnels
    // #####################

    /**
     * Options du service
     * @type {Object}
     */
    this.options = {
        // protocol : "JSONP",
        protocol : "XHR",
        ssl : true,
        proxyURL : "",
        // callbackName : "",
        callbackSuffix : null,
        httpMethod : "GET",
        timeOut : 0,
        rawResponse : false,
        scope : this,
        /**
        * callback par defaut pour la reponse
        * @param {Object} response - response
        * @private
        */
        onSuccess : function (response) {
            console.log("onSuccess - la reponse est la suivante : ", response);
        },
        /**
        * callback par defaut pour les erreurs
        * @param {Object} error - error
        * @private
        */
        onFailure : function (error) {
            if (error.status === 200 || !error.status) {
                console.log("onFailure : ", error.message);
            } else {
                console.log("onFailure - Erreur (", error.status, ") : ", error.message);
            }
        }
    };

    // et on ajoute les options en paramètre aux options par défaut
    for (var opt in options) {
        if (options.hasOwnProperty(opt)) {
            this.options[opt] = options[opt];
        }
    }

    // #####################
    // analyse des options
    // #####################

    // gestion des clefs API
    if (!this.options.apiKey && !this.options.serverUrl) {
        throw new Error(__WEBPACK_IMPORTED_MODULE_2__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_MISSING", "apiKey", "serverUrl"));
    }

    // modification de la fonction de callback onSuccess dans le cas où la réponse brute est demandée
    if (this.options.rawResponse && !this.options.onSuccess) {
        /**
        * callback par defaut pour la reponse
        * @param {Object} response - response
        * @private
        */
        this.options.onSuccess = function (response) {
            console.log("onSuccess - la réponse brute du service est la suivante : ", response);
        };
    }

    // gestion du callback onSuccess
    var bOnSuccess = !!((this.options.onSuccess !== null && typeof this.options.onSuccess === "function"));
    if (!bOnSuccess) {
        throw new Error(__WEBPACK_IMPORTED_MODULE_2__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_MISSING", "onSuccess()"));
    }

    // gestion de l'url du service par defaut
    if (!this.options.serverUrl) {
        // INFO
        // gestion de l'url du service par defaut pour les services qui ne possèdent qu'une seul url par defaut
        // les cas particuliers des services avec plusieurs urls (ex. Alti) devront être traité dans la classe du composant
        // donc si l'url n'est pas renseignée, il faut utiliser les urls par defaut
        __WEBPACK_IMPORTED_MODULE_5__DefaultUrlService__["a" /* default */].ssl = this.options.ssl;
        var urlByDefault = __WEBPACK_IMPORTED_MODULE_5__DefaultUrlService__["a" /* default */][this.CLASSNAME].url(this.options.apiKey);
        if (typeof urlByDefault === "string") {
            this.options.serverUrl = urlByDefault;
        } else {
            this.logger.trace("URL par defaut à determiner au niveau du composant...");
        }
    }

    // FIXME nettoyage des KVP dans l'url du service
    // if (this.options.serverUrl) {
    //     // INFO
    //     // si l'url est renseignée, il faut la nettoyer de tous ses KVP
    //     // ex. on ne veut pas de params. 'callback' ou 'output' car ceci declencherait
    //     // des opérations d'encapsulations des reponses légèrement farfelues ...
    //     var urlsource = this.options.serverUrl;
    //     var urlparts = urlsource.split("?");
    //     this.options.serverUrl = urlparts[0];
    // }

    // gestion de la methode HTTP
    this.options.httpMethod = (typeof options.httpMethod === "string") ? options.httpMethod.toUpperCase() : "GET";

    switch (this.options.httpMethod) {
        case "POST":
        case "GET":
            break;
        case "PUT":
        case "DELETE":
        case "HEAD":
        case "OPTIONS":
            throw new Error(__WEBPACK_IMPORTED_MODULE_2__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_NOT_SUPPORT", "httpMethod"));
        default:
            throw new Error(__WEBPACK_IMPORTED_MODULE_2__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_UNKNOWN", "httpMethod"));
    }

    // gestion du protocole
    // this.options.protocol = (typeof options.protocol === "string" ) ? options.protocol.toUpperCase() : "JSONP";
    this.options.protocol = (typeof options.protocol === "string") ? options.protocol.toUpperCase() : "XHR";

    switch (this.options.protocol) {
        case "JSONP":
        case "XHR":
            break;
        default:
            throw new Error(__WEBPACK_IMPORTED_MODULE_2__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_UNKNOWN", "protocol"));
    }

    // on determine l'environnement d'execution : browser ou non ?
    // et on lance une exception sur l'utilisation du protocole JSONP pour nodeJS...
    if (typeof window === "undefined" && this.options.protocol === "JSONP") {
        throw new Error(__WEBPACK_IMPORTED_MODULE_2__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_NOT_SUPPORT_NODEJS", "protocol=JSONP (instead use XHR)"));
    }

    // le protocole JSONP ne fonctionne qu'en GET.
    if (this.options.protocol === "JSONP") {
        this.options.httpMethod = "GET";
    }

    // gestion du cache
    this.options.nocache = options.nocache || false;

    // #####################
    // attributs d'instances
    // #####################

    /**
     * Format de réponse du service
     */
    this.options.outputFormat = null;
    /**
     * Requête envoyée au service
     */
    this.request = null;
    /**
     * Reponse du service
     */
    this.response = null;
}

/**
 * @lends module:CommonService
 */
CommonService.prototype = {

    /*
     * Constructeur (alias)
     */
    constructor : CommonService,

    /**
     * Appel du service Géoportail
     */
    call : function () {
        /* jshint validthis : true */
        this.logger.trace("CommonService::call ()");

        var context = this;
        /** fonction d'execution */
        function run () {
            this.logger.trace("CommonService::run ()");
            this.buildRequest.call(context, onError, onBuildRequest);
        }

        run.call(context);

        // callback de fin de construction de la requête
        function onBuildRequest (result) {
            this.logger.trace("CommonService::onBuildRequest : ", result);
            this.callService.call(context, onError, onCallService);
        }

        // callback de fin d'appel au service
        function onCallService (result) {
            this.logger.trace("CommonService::onCallService : ", result);
            this.analyzeResponse.call(context, onError, onAnalyzeResponse);
        }

        // callback de fin de lecture de la reponse
        function onAnalyzeResponse (result) {
            this.logger.trace("CommonService::onAnalyzeResponse : ", result);
            if (result) {
                this.options.onSuccess.call(this, result);
            } else {
                return onError.call(this, new __WEBPACK_IMPORTED_MODULE_4__Exceptions_ErrorService__["a" /* default */]("Analyse de la reponse en échec !?"));
            }
        }

        // callback de gestion des erreurs : renvoit un objet de type ErrorService
        function onError (error) {
            this.logger.trace("CommonService::onError()");
            // error : l'objet est du type ErrorService ou Error
            var e = error;
            if (!(e instanceof __WEBPACK_IMPORTED_MODULE_4__Exceptions_ErrorService__["a" /* default */])) {
                e = new __WEBPACK_IMPORTED_MODULE_4__Exceptions_ErrorService__["a" /* default */](error.message);
            }
            this.options.onFailure.call(this, e);
        }
    },

    /**
     * Création de la requête
     * @param {Function} error - callback
     * @param {Function} success - callback
     */
    buildRequest : function (error, success) {
        // INFO
        this.logger.error("overwritten method !");
        // retourne l'objet 'this.request'
        if (error) {
            error.call(this, "This method must be overwritten !");
        }
        success.call(this, "This method must be overwritten !");
    },

    /**
     * Appel du service
     * @param {Function} error - callback
     * @param {Function} success - callback
     */
    callService : function (error, success) {
        // INFO
        // retourne l'objet 'this.response'

        // NOTES
        //  Pour le mode XHR, on recupère une reponse sous forme d'un json ou xml (#document).
        //  Pour le mode JSONP, on a toujours un objet JSON mais sous 2 formes :
        //      - natif
        //      - XML encapsulé :
        //          {http : {status:200, error:null},xml :'réponse du service'}
        //          {http : {status:400, error:'reponse du service'},xml :null}
        //  En XHR, la reponse est directement sauvegardée dans 'this.response'.
        //  Par contre, en JSONP, on doit analyser la reponse (status ou non vide),
        //  et ne renvoyer que le contenu (xml ou l'objet)

        // gestion de la proxification du service
        var strUrlProxified = null;
        var strData = this.request;

        // a t on mis en place un proxy ?
        // la proxyfication est valable uniquement en mode XHR !
        var bUrlProxified = !!((this.options.proxyURL && this.options.protocol === "XHR"));

        // rajout de l'option gpbibaccess
        // INFO : acces au numero de version de package.conf aprés compilation !
        this.options.serverUrl = __WEBPACK_IMPORTED_MODULE_1__Utils_Helper__["a" /* default */].normalyzeUrl(this.options.serverUrl, {
            "gp-access-lib" : __WEBPACK_IMPORTED_MODULE_6__package_json___default.a.version
        }, false);

        // si le proxy est renseigné, on proxifie l'url du service
        if (bUrlProxified) {
            if (this.options.httpMethod === "GET") {
                strUrlProxified = this.options.proxyURL + __WEBPACK_IMPORTED_MODULE_1__Utils_Helper__["a" /* default */].normalyzeUrl(this.options.serverUrl, this.request, true);
                strData = null;
            }

            if (this.options.httpMethod === "POST") {
                strUrlProxified = this.options.proxyURL + __WEBPACK_IMPORTED_MODULE_1__Utils_Helper__["a" /* default */].normalyzeUrl(this.options.serverUrl, null, true);
                strData = this.request;
            }
        }

        // contexte du composant spécifique !
        var self = this;

        var options = {
            url : strUrlProxified || this.options.serverUrl,
            method : this.options.httpMethod,
            protocol : this.options.protocol,
            timeOut : this.options.timeOut || 0,
            format : this.options.outputFormat, // ceci declenche le parsing de la reponse du service, mais on souhaite toujours une reponse brute (string) !
            nocache : this.options.nocache || false, // ceci permet d'ajouter un timestamp dans la requête
            wrap : this.options.protocol !== "XHR", // ceci declenche l'encapsulation de la reponse XML du service dans du JSON, mais pas en mode XHR !
            callbackSuffix : this.options.callbackSuffix,
            // callbackName : this.options.callbackName || null,
            data : strData,
            headers : null, // TODO...
            content : this.options.contentType || "application/xml",
            scope : this.options.scope || this,
            // callback de reponse
            onResponse : function (response) {
                self.logger.trace("callService::onResponse()");

                // le contenu de la reponse à renvoyer !
                var content = null;

                // XHR : on renvoie toujours la reponse brute du service (json ou xml)
                // au parser du composant...
                if (self.options.protocol === "XHR") {
                    self.logger.trace("Response XHR", response);
                    content = response; // par defaut, la reponse du service  !
                }

                // JSONP : on pre-analyse la reponse brute du service (encapsuler ou pas)
                // avant de l'envoyer au parser du composant...
                if (self.options.protocol === "JSONP") {
                    self.logger.trace("Response JSON", response);
                    if (response) {
                        if (response.http) {
                            // reponse encapsulée :
                            // ex. reponse du service en xml
                            // > {http : {status:200, error:null},xml :'réponse du service'}
                            if (response.http.status !== 200) {
                                error.call(self, new __WEBPACK_IMPORTED_MODULE_4__Exceptions_ErrorService__["a" /* default */]({
                                    status : response.http.status,
                                    message : response.http.error,
                                    type : __WEBPACK_IMPORTED_MODULE_4__Exceptions_ErrorService__["a" /* default */].TYPE_SRVERR
                                }));
                                return;
                            } else {
                                content = response.xml; // par defaut !
                                if (self.options.rawResponse) {
                                    content = response;
                                }
                            }
                        } else {
                            // reponse non encapsulée :
                            // ex. reponse du service en json ou xml
                            content = response;
                        }
                    } else {
                        error.call(self, new __WEBPACK_IMPORTED_MODULE_4__Exceptions_ErrorService__["a" /* default */]("Le contenu de la reponse est vide !?"));
                        return;
                    }
                }

                // si on souhaite parser la reponse du service
                if (typeof self.options.onBeforeParse === "function") {
                    var newResponse = self.options.onBeforeParse(content);
                    if (typeof newResponse === "string") {
                        // la reponse parsée par l'utilisateur est retournée sous
                        // forme de string !
                        content = newResponse;
                    }
                }
                // sauvegarde de la reponse dans l'objet parent (CommonService)
                self.response = content;
                // on renvoie la reponse...
                success.call(self, content);
            },
            // callback des erreurs
            onFailure : function (e) {
                self.logger.trace("callService::onFailure()");
                // on est forcement sur une erreur levée par un service !
                e.type = __WEBPACK_IMPORTED_MODULE_4__Exceptions_ErrorService__["a" /* default */].TYPE_SRVERR;
                error.call(self, new __WEBPACK_IMPORTED_MODULE_4__Exceptions_ErrorService__["a" /* default */](e));
            },
            // callback de timeOut
            onTimeOut : function () {
                self.logger.trace("callService::onTimeOut()");
                error.call(self, new __WEBPACK_IMPORTED_MODULE_4__Exceptions_ErrorService__["a" /* default */]("TimeOut!"));
            }
        };

        __WEBPACK_IMPORTED_MODULE_3__Protocols_Protocol__["a" /* default */].send(options);
    },

    /**
     * Analyse de la réponse
     * @param {Function} error - callback
     * @param {Function} success - callback
     */
    analyzeResponse : function (error, success) {
        // INFO
        this.logger.error("overwritten method !");
        // retourne l'objet spécifique au type de composant (json)
        if (error) {
            error.call(this, "This method must be overwritten !");
        }
        success.call(this, "This method must be overwritten !");
    }

};

/* harmony default export */ __webpack_exports__["a"] = (CommonService);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Classe utilitaire
 *
 * @module Helper
 * @alias Gp.Helper
 */
var Helper = {

    /**
     * concatenation des parametres key/value dans les urls
     *
     * @method normalyzeParameters
     * @static
     * @param {Object} params - tableau de clef/valeur
     *
     * @example
     *  Gp.Utils.Helper.normalyzeParameters ({
     *         key1:value1,
     *         key2:value2,
     *         key3:value3
     *  });
     *  // out : "key1=value1&key2=value2&key3=value3"
     *
     * @returns {String} retourne les paramètres concaténés
     */
    normalyzeParameters : function (params) {
        var myParams = null;

        if (params) {
            var tabParams = [];
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    var value = params[key];
                    if (!value) {
                        value = "";
                    }
                    tabParams.push(key + "=" + value);
                }
            }

            myParams = tabParams.join("&");
        }

        return myParams;
    },

    /**
     * Concaténation et encodage des urls.
     *
     * @method normalyzeUrl
     * @static
     * @param {String} url - url
     * @param {Object|String} params - tableau de clef/valeur ou string
     * @param {Boolean} encode - true|false, false par defaut
     *
     * @example
     *  Gp.Utils.Helper.normalyzeUrl (url, {
     *         key1:value1,
     *         key2=:value2,
     *         key3:value3
     *  });
     *  // out : "url?key1=value1&key2=value2&key3=value3"
     *
     * @returns {String} retourne une url normalisée
     */
    normalyzeUrl : function (url, params, encode) {
        var myUrl = url;

        if (url) {
            var k = url.indexOf("?");
            if (k === -1) { // pas de ? et KVP
                myUrl += "?";
            }

            if (k !== -1 && k !== url.length - 1) { // KVP
                myUrl += "&";
            }
        }

        if (params) {
            if (typeof params === "string") {
                myUrl += params;
            } else {
                myUrl += this.normalyzeParameters(params);
            }
        }

        if (encode) {
            // FIXME bonne idée ?
            myUrl = encodeURIComponent(myUrl);
        }

        return myUrl;
    },

    /**
     * Indentation d'une chaine
     *
     * @method indent
     * @static
     * @param {Number} n - nombre de tabulation
     * @param {String} msg - chaine
     *
     * @example
     * Gp.Utils.Helper.indent (2, "message à indenter")
     * // out
     * // ........message à indenter
     *
     * @returns {String} retourne une chaine indentée
     */
    indent : function (n, msg) {
        var num = n || 0;
        return new Array(num + 1).join("\t") + msg;
    }
};

/* harmony default export */ __webpack_exports__["a"] = (Helper);


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// cette classe contient les URLs par defaut des services.
//  DefaultUrlService.Alti.url(key)[elevation-json]
//  DefaultUrlService.Alti.url(key)[elevation-xml]
//  DefaultUrlService.Alti.url(key)[profil-json]
//  DefaultUrlService.Alti.url(key)[profil-xml]
//  DefaultUrlService.Alti.url(key)[wps]
//  DefaultUrlService.ProcessIsoCurve.url(key)
//  DefaultUrlService.AutoComplete.url(key)
//  DefaultUrlService.ReverseGeocode.url(key)
//  DefaultUrlService.AutoConf.url(key)[apiKey]
//  DefaultUrlService.AutoConf.url(key)[apiKeys]
//  DefaultUrlService.AutoConf.url(key)[aggregate]
//  DefaultUrlService.Geocode.url(key)
//  DefaultUrlService.Route.url(key)

// Example :
//
// DefaultUrlService.Alti.url('efe4r54tj4uy5i78o7545eaz7e87a')[elevation-json]
//  output {String} -> http://wxs.ign.fr/efe4r54tj4uy5i78o7545eaz7e87a/alti/rest/elevation.json
//
// DefaultUrlService.Alti.url('efe4r54tj4uy5i78o7545eaz7e87a')
// output {Object|String}
// -> http://wxs.ign.fr/efe4r54tj4uy5i78o7545eaz7e87a/alti/rest/elevation.json
// -> http://wxs.ign.fr/efe4r54tj4uy5i78o7545eaz7e87a/alti/rest/elevation.xml
// -> http://wxs.ign.fr/efe4r54tj4uy5i78o7545eaz7e87a/alti/rest/elevationLine.json
// -> http://wxs.ign.fr/efe4r54tj4uy5i78o7545eaz7e87a/alti/rest/elevationLine.xml
// -> http://wxs.ign.fr/efe4r54tj4uy5i78o7545eaz7e87a/alti/wps
//
// ssl by default.
//
// Force to not do ssl :
// DefaultUrlService.ssl = false;
//
// DefaultUrlService.AutoComplete.url('efe4r54tj4uy5i78o7545eaz7e87a')
// output {Object|String}
// -> https://wxs.ign.fr/efe4r54tj4uy5i78o7545eaz7e87a/ols/apis/completion

// constantes internes
var HOSTNAME = "wxs.ign.fr";

/**
 * Default Geoportal web services URLs access.
 *
 * @namespace
 * @alias Gp.Services.DefaultUrl
 */
var DefaultUrlService = {

    /** if set true, require the use of https protocol */
    ssl : true,

    /**
    * base url of services (ssl protocol management)
    * @param {String} key - key
    * @param {String} path - path
    * @returns {String} url
    */
    url : function (key, path) {
        // comportement par défaut => https
        // sinon, il est fixé par l'option 'ssl' (false => http)
        var _protocol;
        if (DefaultUrlService.ssl === false) {
            _protocol = "http://";
        } else {
            _protocol = "https://";
        }

        return _protocol + HOSTNAME.concat("/", key, path);
    },

    /**
     * Elevation web service access
     *
     * @member {Object}
     * @property {Function} url (key) - Returns elevation service default urls with or without geoportal access key given as a parameter. The result is a javascript object with different urls given used protocols ("elevation-json", "elevation-xml", "profil-json" or "profil-xml").
     */
    Alti : {
        _key : {
            // rest
            "elevation-json" : "/alti/rest/elevation.json",
            "elevation-xml" : "/alti/rest/elevation.xml",
            "profil-json" : "/alti/rest/elevationLine.json",
            "profil-xml" : "/alti/rest/elevationLine.xml",
            // other
            wps : "/alti/wps"
        },
        /**
        * url
        * @param {String} key - key
        * @returns {String} url
        */
        url : function (key) {
            return {
                // rest
                "elevation-json" : DefaultUrlService.url(key, this._key["elevation-json"]),
                "elevation-xml" : DefaultUrlService.url(key, this._key["elevation-xml"]),
                "profil-json" : DefaultUrlService.url(key, this._key["profil-json"]),
                "profil-xml" : DefaultUrlService.url(key, this._key["profil-xml"]),
                // other
                wps : DefaultUrlService.url(key, this._key["wps"])
            };
        }
    },
    /**
     * IsoCurve web service access
     *
     * @member {Object}
     * @property {Function} url (key) - Returns isocurve service default urls with or without geoportal access key given as a parameter. The result is a javascript object with different urls given used protocols ("iso-json" or "iso-xml").
     */
    ProcessIsoCurve : {
        _key : {
            "iso-json" : "/isochrone/isochrone.json", // rest (geoconcept)
            "iso-xml" : "/isochrone/isochrone.xml" // rest (geoconcept)
        },
        /**
        * url
        * @param {String} key - key
        * @returns {String} url
        */
        url : function (key) {
            return {
                "iso-json" : DefaultUrlService.url(key, this._key["iso-json"]),
                "iso-xml" : DefaultUrlService.url(key, this._key["iso-xml"])
            };
        }
    },
    /**
     * Autocompletion web service access
     *
     * @member {Object}
     * @property {Function} url (key) - Returns autocomplete service default urls with or without geoportal access key given as a parameter. The result is a String.
     */
    AutoComplete : {
        _key : "/ols/apis/completion",
        /**
        * url
        * @param {String} key - key
        * @returns {String} url
        */
        url : function (key) {
            return DefaultUrlService.url(key, this._key);
        }
    },
    /**
     * Reverse geocoding web service access
     *
     * @member {Object}
     * @property {Function} url (key) - Returns reverse geocoding service default urls with or without geoportal access key given as a parameter. The result is a String.
     */
    ReverseGeocode : {
        _key : "/geoportail/ols",
        /**
        * url
        * @param {String} key - key
        * @returns {String} url
        */
        url : function (key) {
            return DefaultUrlService.url(key, this._key);
        }
    },
    /**
     * Autoconfiguration web service access
     *
     * @member {Object}
     * @property {Function} url ([key1,...]) - Returns autoconfiguration service default urls with geoportal access key (s) given as a String array parameter. The result is a javascript object with different urls given the access mode ("apiKey", "apiKeys" or "aggregate").
     */
    AutoConf : {
        _key : {
            apiKey : "/autoconf",
            apiKeys : "/autoconf?keys=%KEYS%",
            aggregate : "/autoconf/id/"
        },
        /**
        * url
        * @param {String} key - key
        * @returns {String} url
        */
        url : function (key) {
            var keys = "";
            if (Array.isArray(key) && key.length > 0) {
                keys = key[0];
                for (var i = 1; i < key.length; i++) {
                    keys += "," + key[i];
                }
            }
            return {
                apiKey : DefaultUrlService.url(key, this._key["apiKey"]), // une seule clé
                apiKeys : DefaultUrlService.url(key[0], this._key["apiKeys"]).replace("%KEYS%", keys), // autoconf de plusieurs clés
                aggregate : DefaultUrlService.url(key, this._key["aggregate"])
            };
        }
    },
    /**
     * Geocoding web service access
     *
     * @member {Object}
     * @property {Function} url (key) - Returns geocoding service default urls with or without geoportal access key given as a parameter. The result is a String.
     */
    Geocode : {
        _key : "/geoportail/ols",
        /**
        * url
        * @param {String} key - key
        * @returns {String} url
        */
        url : function (key) {
            return DefaultUrlService.url(key, this._key);
        }
    },
    /**
     * Routing web service access
     *
     * @member {Object}
     * @property {Function} url (key) - Returns routing service default urls with or without geoportal access key given as a parameter. The result is a javascript object with different urls given used protocols ("route-json" or "route-xml").
     */
    Route : {
        _key : {
            ols : "/itineraire/ols", // openLS
            "route-json" : "/itineraire/rest/route.json", // rest (geoconcept)
            "route-xml" : "/itineraire/rest/route.xml" // rest (geoconcept)
        },
        /**
        * url
        * @param {String} key - key
        * @returns {String} url
        */
        url : function (key) {
            return {
                ols : DefaultUrlService.url(key, this._key["ols"]),
                "route-json" : DefaultUrlService.url(key, this._key["route-json"]),
                "route-xml" : DefaultUrlService.url(key, this._key["route-xml"])
            };
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (DefaultUrlService);


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* global require */


// import __xmldom from "xmldom";

/**
 * @classdesc
 *
 * Classe permettant d'écrire ou de lire du XML, sous forme de document DOM,
 * éventuellement selon des clés de lecture (readers) ou d'écriture (writers) spécifiques.
 *
 * @constructor
 * @alias Gp.Formats.XML
 *
 * @param {Object} [options] - options du format XML
 *
 * @param {Object} [options.reader] - Instance d'un Reader de service (AltiResponseReader, GeocodeRequestReader, etc.)
 *      utile pour interpréter le XML lorsque sa structure est connue.
 *      Ce reader doit comporter au moins une fonction statique read (root) permettant d'initialiser la lecture.
 *
 * @param {Object} [options.writers] - writers
 *
 * @param {String} [options.xmlString] - chaîne de caractère contenant du XML à interpréter.
 *
 * @private
 */
function XML (options) {
    if (!(this instanceof XML)) {
        throw new TypeError("XML constructor cannot be called as a function.");
    }

    // FIXME : notion de singleton

    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger();
    this.logger.trace("[Constructeur XML ()]");

    /**
     * Chaîne de caractères contenant le texte XML
     * @type {String}
     */
    this.xmlString = null;

    /**
     * DOM Element correspondant à la structure du XML.
     * @type {DOMElement}
     */
    this.xmlDoc = null;

    /**
     * Objet contenant des fonctions de lecture des différentes balises XML.
     * @type {Object}
     */
    this.reader = null;

    // traitement des paramètres d'options s'il y en a
    if (options) {
        if (options.xmlString && typeof options.xmlString === "string") {
            this.xmlString = options.xmlString;
            // Si une chaine de caractère a été passée en entrée : on la transforme aussi en XML document
            this.xmlDoc = __getXMLDOC(options.xmlString);
        }
        if (options.reader) {
            this.setReader(options.reader);
        }
    }
}

XML.prototype = {

    /**
     * @lends module:XML
     */

    /*
     * Constructeur (alias)
     */
    constructor : XML,

    /**
     * Méthode permettant de récupérer la chaîne de caractères associée au format XML
     *
     * @returns {String} xmlString - la chaîne de caractères correspondant au format XML
     */
    getXMLString : function () {
        return this.xmlString;
    },

    /**
     * Méthode permettant d'attribuer une chaîne de caractères au format XML (attribut xmlString).
     * La méthode va aussi transformer cette chaîne de caractères en document XML,
     * afin de remplir l'attribut xmlDoc.
     *
     * @param {String} xmlString - la chaîne de caractères correspondant au format XML
     */
    setXMLString : function (xmlString) {
        if (xmlString && typeof xmlString === "string") {
            this.xmlString = xmlString;
            this.xmlDoc = __getXMLDOC(xmlString);
        }
    },

    /**
     * Méthode permettant de récupérer les readers associés au format XML, s'ils ont été définis
     *
     * @return {Object} readers - les readers associés au format XML, s'ils existent,
     *      sous forme d'une collection de fonctions
     */
    getReader : function () {
        return this.reader;
    },

    /**
     * Méthode permettant d'attribuer des readers, sous la forme d'un objet de fonctions (node, data),
     *      lorsqu'ils n'ont pas été définis lors de l'instanciation par exemple (new XML (options)).
     *
     * @param {Object} reader - Instance d'un Reader de service (AltiResponseReader, GeocodeRequestReader, etc.)
     *      utile pour interpréter le XML lorsque sa structure est connue.
     *      Ce reader doit comporter au moins une fonction statique read (root) permettant d'initialiser la lecture.
     */
    setReader : function (reader) {
        if (reader && reader.read && typeof reader.read === "function") {
            this.reader = reader;
        }
    },

    /**
     * Méthode permettant de récupérer le document XML associé au format, s'il existe.
     *
     * @return {DOMElement} xmlDoc - le document XML (DOM document node) s'il existe
     */
    getXMLDoc : function () {
        return this.xmlDoc;
    },

    /**
     * Setter
     */
    setXMLDoc : function (doc) {
        this.xmlDoc = doc;
    },
    /**
     * Méthode initialisant la lecture du XML, à partir d'un XML Document :
     *      création d'un objet JavaScript contenant les informations du XML,
     *      sauf dans le cas où il n'existe pas de XML Document à interpréter (retourne un objet vide).
     *
     * @return {Object} [parserOutput] - un objet JavaScript contenant les informations du XML :
     * - soit toutes les informations si aucun reader n'a été spécifié à la création du format
     * - soit les informations spécifiées dans le reader.
     */
    parse : function () {
        // build xml document from xmlString
        if (!this.xmlDoc && this.xmlString) {
            this.xmlDoc = __getXMLDOC(this.xmlString);
        }
        if (this.xmlDoc) {
            var root = __getRootNode(this.xmlDoc);
            if (root) {
                var parserOutput;
                // call reader if exists
                if (this.reader && this.reader.read) {
                    parserOutput = this.reader.read(root);
                } else {
                    parserOutput = {};
                    parserOutput[root.nodeName] = __readDefault(root);
                }
                return parserOutput;
            } else {
                return {};
            }
        }
    }

};

/**
 * Méthode de la classe (privée) permettant de créer un XML Document à partir d'une chaîne de caractères XML,
 *      en utilisant DOMParser () lorsque c'est possible.
 *      For more information, see: https://dvcs.w3.org/hg/innerhtml/raw-file/tip/index.html#the-domparser-interface
 *
 * @private
 * @memberof XML
 * @method __getXMLDOC
 * @param {String} xmlString - xml string to be converted into DOM element
 * @return {DOMElement} - the corresponding XML Document
 */
function __getXMLDOC (xmlString) {
    if (typeof window === "undefined") {
        // env. nodejs
        var DOMParser = __webpack_require__(20).DOMParser; // __xmldom.DOMParser;
        return new DOMParser().parseFromString(xmlString, "text/xml");
    } else {
        // env. browser

        var parser;
        var xmlDoc;
        var errorMsg = "Erreur lors du parsing de la réponse du service : XML non conforme";

        if (window.ActiveXObject) {
            // Internet Explorer < 9
            xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(xmlString);
            var parseError = xmlDoc.parseError;
            if (parseError.errorCode) {
                if (parseError.line && parseError.linepos) {
                    errorMsg += "( ligne " + parseError.line + ", colonne " + parseError.linepos;
                }
                if (parseError.reason) {
                    errorMsg += ":  " + parseError.reason + ")";
                }
                throw new Error(errorMsg);
            }
            return xmlDoc;
        } else if (window.DOMParser) {
            // les autres (Chrome, Mozilla, IE >= 9)
            parser = new window.DOMParser();
            try {
                xmlDoc = parser.parseFromString(xmlString, "text/xml");
            } catch (e) {
                // Internet Explorer browser raises exception if xmlString is not valid XML
                if (e.message === "SyntaxError") {
                    throw new Error(errorMsg);
                } else {
                    throw new Error("Erreur lors du parsing de la réponse du service : " + e.message);
                }
            }
            // look for parsing error in case no exception was raised
            if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
                var parsererror = xmlDoc.getElementsByTagName("parsererror");
                for (var i = 0; i < parsererror.length; i++) {
                    var content = parsererror[i].innerHTML;
                    // except in case parsererror is just because of huge xml, but parsing is done.
                    if (content.indexOf("Huge input lookup") === -1) {
                        errorMsg += "(" + content + ")";
                        throw new Error(errorMsg);
                    }
                }
            } else if (!xmlDoc.documentElement) { // may happen in chrome browser
                throw new Error(errorMsg);
            }
            return xmlDoc;
        } else {
            // FIXME
            throw new Error("Incompatible DOM Parser pour ce navigateur !");
        }
    }
}

/**
 * Méthode de la classe (privée) permettant de récupérer le noeud racine du document,
 *      à partir d'un document node (nodeType=9), puis lecture de ce noeud (readNode)
 *
 * @private
 * @memberof XML
 * @method __getRootNode
 * @param {DOMElement} [xmlDoc] - a Document Node
 * @return {DOMElement} root - the document root node
 */
function __getRootNode (xmlDoc) {
    var root;
    if (xmlDoc.nodeType === 9) {
        // INFO : nodeType 9 represents the entire document (the root-node of the DOM tree)
        root = xmlDoc.documentElement;
    } else if (xmlDoc.nodeType === 1) {
        root = xmlDoc;
    }
    return root;
}

/**
 * Méthode de la classe (privée) permettant de lire automatiquement un noeud XML,
 *      lorsqu'aucun reader spécifique n'a été spécifié (parser brut)
 *
 * @private
 * @memberof XML
 * @method readDefault
 * @param {DOMElement} node - a DOM element node
 * @example final data object looks like :
 *          data = {
 *              attributeName: attributeValue,
 *              childName: {
 *                  attributeName: attributeValue,
 *                  attributeName: attributeValue,
 *                  childName: {
 *                      "textContent": textContent
 *                  },
 *                  childName: {
 *                      childName: {
 *                          attributeName:attributeValue
 *                      }
 *                  }
 *              }
 *          }
 */
function __readDefault (node) {
    var data = {};

    // if element node has attributes, set their values to data
    if (node.attributes.length > 0) {
        var dataAttributes = __getAttributes(node);
        data["attributes"] = dataAttributes;
    }

    // if element node has childNodes, read them and set them to data
    if (node.hasChildNodes()) {
        var childData = {};
        var child;
        var children = node.childNodes;

        for (var i = 0; i < children.length; i++) {
            child = children[i];

            if (child.nodeType === 3) { // TEXT_NODE
                data["textContent"] = child.nodeValue;
            } else if (child.nodeType === 1) {
                childData = __readDefault(child);

                if (!data[child.nodeName]) {
                    // store childData in an object
                    data[child.nodeName] = childData;
                } else {
                    // in case several childNodes has the same name : store them in an array.
                    // if data[nodeName] already exists but is not an array
                    if (!Array.isArray(data[child.nodeName])) {
                        var old = data[child.nodeName];
                        data[child.nodeName] = [];
                        data[child.nodeName].push(old);
                    }
                    data[child.nodeName].push(childData);
                }
            }
            // TODO : manage other node types (4=CDATA, etc)
        }
    }

    return data;
}

/**
 * Méthode de la classe (privée) permettant de récupérer les attributs d'un noeud élément
 *
 * @private
 * @memberof XML
 * @method __getAttributes
 * @param {DOMElement} node - noeud contenant l'attribut recherché
 * @return {Object} nodeAttributes - objet contenant les noms et valeurs des différents attributs
 */
function __getAttributes (node) {
    if (node.attributes.length > 0) {
        var nodeAttributes = {};
        var attributes = node.attributes;
        for (var i = 0; i < attributes.length; i++) {
            var attribute = attributes[i];
            nodeAttributes[attribute.nodeName] = attribute.nodeValue;
        }
        return nodeAttributes;
    }
}

/* harmony default export */ __webpack_exports__["a"] = (XML);


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * @classdesc
 *
 * Liste des attributs des tables de geocodage
 * @constructor
 * @alias Gp.Services.Geocode.Request.GeocodeLocation
 * @private
 */
function GeocodeLocation () {
    if (!(this instanceof GeocodeLocation)) {
        throw new TypeError("GeocodeLocation constructor cannot be called as a function.");
    }

    /**
     * Objet qui peut prendre comme propriétés les valeurs du tableau serviceAttributes
     * @type {Object}
     */
    this.placeAttributes = {};

    /**
     * Tableau qui liste les attributs spécifiques selon le type de la GeocodeLocation.
     * Ces attributs correspondent à ceux saisis par l'utilisateur (légèrement différents de ceux du service)
     * @type {String[]}
     */
    this.attributesList = [];

    /**
     * Tableau qui liste les attributs spécifiques selon le type de la GeocodeLocation
     * Ces attributs correspondent à ceux interprétés par le service (balises Place).
     * @type {String[]}
     */
    this.serviceAttributes = [];
}

/**
 * @lends module:GeocodeLocation
 */
GeocodeLocation.prototype = {

    /**
     * Constructeur (alias)
     */
    constructor : GeocodeLocation

};

/* harmony default export */ __webpack_exports__["a"] = (GeocodeLocation);


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);


/**
 * Lecture / Ecriture du format WKT
 *
 * Les besoins sont assez simples :
 * 1. lecture des types suivants :
 *  - LINESTRING
 *  - POLYGON
 *  - (TODO)
 * 2. convertir aux formats suivants :
 *  - json
 *  - (TODO)
 *
 *
 * @example
 *  var strWKT = "LINESTRING (2.416907 48.846577, 2.416916 48.846613)";
 *  WKT.toJson (strWKT,
 *      function onSuccess (json) {
 *          // {
 *          //      type : 'LINESTRING',
 *          //      coordinates : [
 *          //          [2.416907, 48.846577],
 *          //          [2.416916, 48.846613]
 *          //      ]
 *          // }
 *      },
 *      function onError (error) {
 *          console.log(error);
 *      }
 *  );
 *
 * @module WKT
 * @alias Gp.Formats.WKT
 * @private
 */

var WKT = {

    /**
     * Parsing d'une chaine WKT
     *
     * @method toJson
     * @param {String} strWkt - chaine de type WKT
     * @param {Function} success - fonction callback
     * @param {Function} error   - fonction callback
     */
    toJson : function (strWkt, success, error) {
        var logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger();

        var json = null;

        try {
            if (!strWkt) {
                throw new Error("La chaine WKT n'est pas renseignée !");
            }

            if (!success) {
                // callback success par defaut
                success = function (json) {
                    console.log(json);
                };
            }

            if (!error) {
                // callback error par defaut
                error = function (e) {
                    console.log(e);
                };
            }

            var regex;
            var subst;

            // regex coordinates
            regex = /(-?\d+\.?[0-9]*)\s(-?\d+\.?[0-9]+)/g;
            subst = "[$1,$2]";
            strWkt = strWkt.replace(regex, subst);

            // regex type
            regex = /^(\w+)/;
            regex.exec(strWkt);
            if (RegExp.$1 === "POLYGON") {
                subst = "{\"type\" : \"Polygon\",";
                strWkt = strWkt.replace(RegExp.$1, subst);
                // clean
                // (( --> coordinates : [[
                regex = /(\({2}?)/;
                subst = "\"coordinates\" : [[";
                strWkt = strWkt.replace(regex, subst);
                // )) --> ]]}
                regex = /(\){2}?)/;
                subst = "]]}";
                strWkt = strWkt.replace(regex, subst);
                // all ( --> [
                regex = /(\()/g;
                subst = "[";
                strWkt = strWkt.replace(regex, subst);
                // all ) --> ]
                regex = /(\))/g;
                subst = "]";
                strWkt = strWkt.replace(regex, subst);
            } else if (RegExp.$1 === "LINESTRING") {
                subst = "{\"type\" : \"LineString\",";
                strWkt = strWkt.replace(RegExp.$1, subst);
                // clean
                regex = /(\(\(?)/;
                subst = "\"coordinates\" : [";
                strWkt = strWkt.replace(regex, subst);
                regex = /(\)\)?)/;
                subst = "]}";
                strWkt = strWkt.replace(regex, subst);
            }

            logger.trace(strWkt);

            json = JSON.parse(strWkt);

            if (!json) {
                throw new Error("Le JSON est vide !");
            }

            if (!json.type) {
                throw new Error("Le type de geometrie n'est pas connu !");
            }

            if (!json.coordinates) {
                throw new Error("La liste des points est vide !");
            }

            success.call(this, json);
        } catch (e) {
            if (e.name === "SyntaxError") {
                error.call(this, "Erreur de parsing JSON !");
                return;
            }
            error.call(this, e);
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (WKT);


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Response object for {@link module:Services~getAltitude Gp.Services.getAltitude ()} invocation when successful. Received as the argument of onSuccess callback function.
 *
 * @property {Array.<Gp.Services.Alti.Elevation>} elevations - Elevations array.
 *
 * @namespace
 * @alias Gp.Services.AltiResponse
 */
function AltiResponse () {
    if (!(this instanceof AltiResponse)) {
        throw new TypeError("AltiResponse constructor cannot be called as a function.");
    }

    this.elevations = [];
}

AltiResponse.prototype = {

    constructor : AltiResponse

};

/* harmony default export */ __webpack_exports__["a"] = (AltiResponse);


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * Single elevation object returned by underlying web service. Contains at least, one elevation (z). May also contain point coordinates and elevation accuracy if "zonly" parameter wasn't set to true.
 *
 * @property {Float} lat - Point latitude. (only if zonly=false)
 * @property {Float} lon - Point longitude. (only if zonly=false)
 * @property {Float} z - Point elevation.
 * @property {Float} acc - Accuracy of elevation for this point. (only if zonly=false)
 *
 * @namespace
 * @alias Gp.Services.Alti.Elevation
 */
function Elevation () {
    if (!(this instanceof Elevation)) {
        throw new TypeError("Elevation constructor cannot be called as a function.");
    }

    this.z = null;
}

Elevation.prototype = {

    constructor : Elevation

};

/* harmony default export */ __webpack_exports__["a"] = (Elevation);


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__XLS_RequestHeader__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__XLS_Request__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__XLS_AbstractService__ = __webpack_require__(12);





/**
 * @classdesc
 *
 * standard OpenLS
 * standard XLS
 * (version 1.2)
 *
 * Réfs :
 *     - {@link http://schemas.opengis.net/ols/1.2/}
 *     - {@link http://www.opengeospatial.org/standards/ols}
 *     - {@link http://wxs.ign.fr/schemas/}
 *
 *
 * Création du template XLS (avec gestion des namespaces)
 * ------------------------
 * ```
 *   balise xsd : element name="XLS" attribute name="version" [(attribute ref="lang")]
 * ```
 *
 * Exemple :
 * ```
 * <XLS xmlns="http://www.opengis.net/xls" version="1.2">
 *   < (ref. OLS) />
 * </XLS>
 * ```
 * ```
 * <xls:XLS xmlns:xls="http://www.opengis.net/xls" version="1.2">
 *   <xls: (ref. OLS) />
 * </xls:XLS>
 * ```
 *
 * Création des templates OLS pour LocationUtilityService
 * ------------------------------------------------------
 *
 * Exemple :
 *
 * ```
 * <RequestHeader srsName="epsg:4326"/>
 * <Request maximumResponses="26" methodName="GeocodeRequest" requestID="uid1349081498314_388" version="1.2">
 *      <GeocodeRequest>
 *          <Address countryCode="PositionOfInterest">
 *              <freeFormAddress>saint mandé</freeFormAddress>
 *          </Address>
 *      </GeocodeRequest>
 *  </Request>
 * ```
 * ```
 * <RequestHeader sessionID="" />
 * <Request methodName="ReverseGeocodeRequest" version="1.2" requestID="" maximumResponses="10">
 *   <ReverseGeocodeRequest>
 *     <Position>
 *       <gml:Point xmlns:gml="http://www.opengis.net/gml">
 *           <gml:pos>50.347775 3.205098</gml:pos>
 *       </gml:Point>
 *     </Position>
 *     <ReverseGeocodePreference>StreetAddress</ReverseGeocodePreference>
 *  </ReverseGeocodeRequest>
 * </Request>
 * ```
 * ```
 * Geocodage direct (balise xsd) :
 *   element ref="RequestHeader" [ (attribute name="clientName" attribute name="clientPassword" attribute name="sessionID" attribute name="srsName" attribute name="MSID") ]
 *     element name="Request" attribute name="methodName" attribute name="version" attribute name="requestID" [ attribute name="maximumResponses" ]
 *       element name="GeocodeRequest" attribute name="returnFreeForm"
 *         element ref="xls:Address"
 * ```
 * ```
 * Geocodage inverse (balise xsd) :
 *   element ref="RequestHeader" [ (attribute name="clientName" attribute name="clientPassword" attribute name="sessionID" attribute name="srsName" attribute name="MSID") ]
 *     element name="Request" attribute name="methodName" attribute name="version" attribute name="requestID" [ attribute name="maximumResponses" ]
 *       element name="ReverseGeocodeRequest"
 *         element ref="xls:Position"
 *         element name="ReverseGeocodePreference" (enumeration)
 * ```
 *
 * Il existe 3 sous ensembles d'objets :
 *     - RequestHeader
 *     - Request
 *     - ReverseGeocodeRequest, GeocodeRequest
 *
 * GeocodeRequest est composé d'un objet {@link Gp.Services.Geocode.Response.GeocodeLocation}.
 * ReverseGeocodeRequest est composé d'un objet {@link Gp.Services.ReverseGeocode.Response.ReverseGeocodeLocation}.
 *
 * Les locations font appels aux objets suivants qui possèdent des attributs spécifiques
 * en fonction du type de table de geocodage interrogé :
 *     - StreetAddress
 *     - CadastralParcel
 *     - PositionOfInterest
 *     - Administratif
 *
 *
 * et des élements sous jacents tels que :
 *     - ReverseGeocodePreference -> tables de geocodages :
 *         - StreetAddress
 *         - CadastralParcel
 *         - PositionOfInterest
 *         - Administratif (une balise par table)
 *     - Position -> standard GML 3.2.1
 *     - Address  -> cf. ci-dessous
 *
 * ```
 * Position (balise xsd) :
 *   ex. <Position><gml:Point xmlns:gml="http://www.opengis.net/gml"><gml:pos>50.347775 3.205098</gml:pos></gml:Point></Position>
 *   ex. <Position><gml:CircleByCenterPoint xmlns:gml="http://www.opengis.net/gml"><gml:pos>48.85978570614691 2.2913572761128878</gml:pos><gml:radius>1000</gml:radius></gml:CircleByCenterPoint></Position>
 *   (au choix)
 *   element ref="gml:Point"
 *   element ref="gml:CircleByCenterPoint"
 *   element ref="gml:Polygon"
 *   element ref="gml:MultiPolygon"
 *   les autres elemennts ne sont pas implémentés (QoP, Speed, Direction, Time, ...)
 *
 * Address (balise xsd) :
 *   ex. <Address countryCode="StreetAddress"><freeFormAddress>1 r de paris saint denis</freeFormAddress></Address>
 *   attribute name="countryCode"
 *     element name="freeFormAddress"
 *     element ref="xls:Place"
 *     element ref="gml:Envelope"
 *  ou
 *   ex. <Address countryCode="StreetAddress"><StreetAddress><Street>1 rue Marconi</Street></StreetAddress><Place type="Municipality">Metz</Place><PostalCode>57000</PostalCode></Address>
 *   attribute name="countryCode"
 *     element ref="xls:StreetAddress"
 *     element ref="xls:PostalCode"
 *     element ref="xls:Place"
 *     element ref="gml:Envelope"
 *
 * Place  (balise xsd) :
 *  ex. <Place type="Municipality">Metz</Place>
 *  attribute name="type"
 *   enumeration value="CountrySubdivision"
 *   enumeration value="CountrySecondarySubdivision"
 *   enumeration value="Municipality"
 *   enumeration value="MunicipalitySubdivision"
 *   enumeration value="choume-banchi-go"
 *   enumeration value="Qualite"
 *   enumeration value="Departement"
 *   enumeration value="Bbox"
 *   enumeration value="Commune"
 *   enumeration value="Territoire"
 *   enumeration value="Importance"
 *   enumeration value="Nature"
 *   (la liste n'est pas exhaustives...)
 *
 * StreetAddress (balise xsd) :
 *   ex. <StreetAddress><Street>1 rue Marconi</Street></StreetAddress>
 *   attribute name="locator"
 *    element name="xls:Building"
 *    element ref="xls:Street"
 *
 * Street (balise xsd) :
 *   ex. <Street>1 rue Marconi</Street>
 *   attribute name="officialName" (...)
 *
 * Building (balise xsd) :
 *   ex. <Building number="800"/>
 *   attribute name="number" attribute name="subdivision" attribute name="buildingName"
 *
 * PostalCode (balise xsd) :
 *   ex. <PostalCode>77182</PostalCode>
 *
 * ```
 *
 * Requête
 * -------
 *
 * 2 modes de requête sur les services : GET ou POST.
 *
 * Le mode GET n'est que l'encodage du XML en param (qxml) de la requête (donc pas d'implementation particulière ?)
 *
 * Modèle de classes
 * -----------------
 *
 * ```
 *                 ________  XLS ____________
 *               /            |               \
 *   RequestHeader      AbstractService    Request
 *                            ^
 *                      ______|________________________
 *           (extends) /                               \ (extends)
 *          LocationUtilityService                    RouteService
 *                    |                                    |
 *         ___________|___________                       (...)
 *       /                        \
 * GeocodeRequest          ReverseGeocodeRequest
 *      |                          |
 *      |                     _____|______
 *      |                    /            \
 *   Address              Preference  Position
 *      |
 *    /   \
 * Place   StreetAddress
 *               |
 *             /   \
 *       Street   Building
 * ```
 *
 * @example
 * // encapsule un objet 'LocationUtilityService'
 * // dans une coquille XSL (avec/sans namespace)
 * xsl = new XSL ();
 * xsl.namespace = false;
 * xsl.srsName = "epsg:4326";
 * xsl.maximumResponses = 26;
 * //   methodName fournit par l'objet 'lus'
 * //   requestID est calculé
 * xsl.setService (lus);
 * xsl.build ();
 * // out ->
 * // <XLS xmlns="http://www.opengis.net/xls" version="1.2">
 * // <RequestHeader srsName="epsg:4326"/>
 * // <Request maximumResponses="26" methodName="GeocodeRequest" requestID="uid1349081498314_388" version="1.2">
 * //   < (ref. LocationUtilityService ou vide) />
 * //  </Request>
 * // </XLS>
 *
 *
 * @constructor
 * @alias Gp.Formats.XLS
 * @param {Object} options - options du constructeur
 * @param {Object} options.srsName - identifiant du Systeme de Coordonnees
 * @param {String}   options.maximumResponses - nombre de reponses max d'une requete
 * @param {Function} options.onsuccess - function callback success (TODO)
 * @param {Function} options.onerror   - function callback error   (TODO)
 *
 * @private
 */
function XLS (options) {
    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger();
    this.logger.trace("[Constructeur XLS()]");

    if (!(this instanceof XLS)) {
        throw new TypeError("XLS constructor cannot be called as a function.");
    }

    // options par defaut
    this.options = {
        srsName : "EPSG:4326",
        maximumResponses : 25
    };

    // et on ajoute les options en paramètre aux options par défaut
    for (var opt in options) {
        if (options.hasOwnProperty(opt)) {
            if (options[opt]) {
                this.options[opt] = options[opt];
            }
        }
    }
}

/**
 * Version
 */
XLS.VERSION = "1.2";

XLS.prototype = {

    /**
     * @lends module:XLS#
     */

    /**
     * request (out)
     * @type {String}
     */
    requestString : null,

    /**
     * namespace
     * Surcharge les balises XLS d'un prefixe.
     * Par defaut, false
     * @type {Boolean}
     */
    namespace : false,

    /**
     * Objet Service
     * LocationUtilityService ou RouteService
     * @type {AbstractService}
     */
    oService : null,

    /**
     * Constructeur (alias)
     */
    constructor : XLS,

    /**
     * Template de la requête.
     * substitution des valeurs suivantes :
     * __VERSION__, __NAMESPACE__, __SCHEMALOCATION__
     * __REQUESTHEADER__, __REQUEST__
     */
    template : "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
        "<XLS version=\"__VERSION__\"\n" +
        "__NAMESPACE__ \n" +
        "__SCHEMALOCATION__>\n" +
        "__REQUESTHEADER__\n" +
        "__REQUEST__\n" +
        "</XLS>\n",

    /**
     * Namespace par defaut.
     *
     * @returns {String} namespace
     */
    namespaceByDefault : function () {
        var ns = [
            "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"",
            "xmlns:xls=\"http://www.opengis.net/xls\"",
            "xmlns:gml=\"http://www.opengis.net/gml\""
        ];

        return ns.join(" ");
    },

    /**
     * Schemalocation par defaut
     *
     * @returns {String} schemaLocation
     */
    schemaLocationByDefault : function () {
        return "xsi:schemaLocation=\"http://www.opengis.net/xls http://schemas.opengis.net/ols/1.2/olsAll.xsd\"";
    },

    /**
     * Setter Service
     * Ajout d'un objet de type LocationUtilityService (LUS) ou RouteService
     *
     * @param {Object} oService - GeoceodeRequest / ReverseGeocodeRequest ou RouteRequest
     */
    setService : function (oService) {
        if (!oService) {
            this.logger.trace("L'objet de type Service XSL n'est pas encore defini !?");
            return;
        }

        if (oService instanceof __WEBPACK_IMPORTED_MODULE_3__XLS_AbstractService__["a" /* default */]) {
            this.oService = oService;
        } else {
            this.logger.error("L'objet n'est pas du type 'LocationUtilityService' ou 'RouteService' !?");
        }
    },

    /**
     * Getter Service
     * Retourne un objet de type LocationUtilityService (LUS) ou RouteService
     * ex. GeoceodeRequest / ReverseGeocodeRequest ou RouteRequest
     *
     * @returns {Object} service (LocationUtilityService|RouteService)
     */
    getService : function () {
        return this.oService;
    }
};

/**
 * Ajout d'un prefixe de namespace
 *
 * @todo impl. l'ajout de namespace
 * @param {Object} ns - ex. {key:xls, url:http://www.opengis.net/xls}
 * @param {String} request - requête
 * @returns {String} requête
 */
XLS.prototype.addNamespace = function (ns, request) {
    // INFO
    // on recherche la clef dans les namespaces par defaut.
    // si la clef n'existe pas dans les namespaceByDefault (), on l'ajoute.
    // on surcharge toutes les balises, ex. XLS -> xls:XLS
    // sauf celles qui sont déjà prefixées !

    var keyNS = ns.key;
    // var urlNS = ns.url; // TODO not yet implemented !

    // recherche la clef dans les namespaces par defaut
    var bFound = false;
    var allNS = this.namespaceByDefault().split(" ");
    for (var index = 0; index < allNS.length; index++) {
        var element = allNS[index];
        var map = element.split("=");
        var key = map[0];
        // var url = map[1]; // TODO not yet implemented !

        if (key === "xmlns:" + keyNS) {
            bFound = true;
            break;
        }
    }

    // TODO
    // si on a une nouvelle clef, on l'ajoute...
    if (!bFound) {
        this.logger.warn("L'ajout d'un nouvel namespace n'est pas encore implémenté !");
        return request;
    }

    // surcharge toutes les balises
    var regex;
    var subst;

    // regex balise ouvrante
    regex = /<(\w+[\s>])/g;
    subst = "<" + keyNS + ":$1";
    request = request.replace(regex, subst);

    // regex balise fermante
    regex = /<\/(\w+[\s>])/g;
    subst = "</" + keyNS + ":$1";
    request = request.replace(regex, subst);

    this.logger.trace("namespace", request);

    return request;
};

/**
 * Construction de la requête
 * @returns {String} requête
 */
XLS.prototype.build = function () {
    // out ->
    // <XLS xmlns="http://www.opengis.net/xls" version="1.2">
    // <RequestHeader srsName="epsg:4326"/>
    // <Request maximumResponses="26" methodName="GeocodeRequest" requestID="uid1349081498314_388" version="1.2">
    //   < (ref. LocationUtilityService ou vide) />
    //  </Request>
    // </XLS>

    // as t on un objet de type Service XLS à disposition ?
    var bService = !!this.getService();

    var template = "";
    template = this.template;
    template = template.replace(/__VERSION__/g, XLS.VERSION);
    template = template.replace(/__NAMESPACE__/g, this.namespaceByDefault);
    template = template.replace(/__SCHEMALOCATION__/g, this.schemaLocationByDefault);

    // header
    var oHeader = new __WEBPACK_IMPORTED_MODULE_1__XLS_RequestHeader__["a" /* default */]({
        srsName : this.options.srsName
    });
    template = template.replace(/__REQUESTHEADER__/g, oHeader.toString());

    // request
    var oRequest = new __WEBPACK_IMPORTED_MODULE_2__XLS_Request__["a" /* default */]({
        maximumResponses : this.options.maximumResponses,
        version : XLS.VERSION, // FIXME même version ?
        methodName : bService ? this.getService().CLASSTYPE : null
    });
    template = template.replace(/__REQUEST__/g, oRequest.toString());

    // objet lus ou route
    if (bService) { // INFO : clef __REQUESTSERVICE__ dispo dans l'objet 'Request'
        template = template.replace(/<!-- __REQUESTSERVICE__ -->/g, this.getService().toString());
    }

    if (!template) {
        this.logger.warn("traduction tmpl : empty request !?");
        return;
    }

    // ajout d'un namespace
    if (this.namespace) {
        // ajout de xls par defaut
        template = this.addNamespace({
            key : "xls",
            url : "http://www.opengis.net/xls"
        }, template);
    }

    this.requestString = template;
    this.logger.trace("traduction tmpl", template);

    // on retourne qqchose !
    return this.requestString;
};

/* harmony default export */ __webpack_exports__["a"] = (XLS);


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);


/**
 * @classdesc
 * @private
 *
 * @constructor
 * @alias Gp.Formats.XLS.AbstractService
 *
 * @param {Object} [options] - options
 */
function AbstractService (options) {
    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger();
    this.logger.trace("[Constructeur AbstractService ()]");

    if (!(this instanceof AbstractService)) {
        throw new TypeError("AbstractService constructor cannot be called as a function.");
    }

    // options par defaut
    this.options = options || {};

    // et on ajoute les options en paramètre aux options par défaut
    for (var opt in options) {
        if (options.hasOwnProperty(opt)) {
            this.options[opt] = options[opt];
        }
    }
}

/**
 * @lends module:AbstractService#
 */
AbstractService.prototype = {

    /**
     * request (out)
     * @type {String}
     */
    strRequest : null,

    /**
     * objet Request
     * @type {Request}
     */
    oRequest : null,

    /**
     * Filter
     * @type {FilterExtension}
     */
    oFilter : null,

    /**
     * Constructeur (alias)
     */
    constructor : AbstractService,

    /**
     * Ajout d'un objet de type Request : GeocodeRequest / ReverseGeocodeRequest / RouteRequest
     *
     * @param {Object} oRequest - GeocodeRequest / ReverseGeocodeRequest / RouteRequest
     */
    addRequest : function (oRequest) {
        this.logger.error("overwritten method !");
    },

    /**
     * Ajout d'un objet de type FilterExtension : GeocodeFilterExtension ou RouteRequestExtension
     *
     * @param {Object} oFilter - GeocodeFilterExtension ou RouteRequestExtension
     */
    addFilter : function (oFilter) {
        this.logger.error("overwritten method !");
    },

    /**
     * toString
     */
    toString : function () {
        this.logger.error("overwritten method !");
    }
};

/* harmony default export */ __webpack_exports__["a"] = (AbstractService);


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);



/**
 * @classdesc
 *
 * Ajouter des extensions de filtres spécifiques au service de geocodage de l'IGN.
 * Ceci permet de contrôler les options spécifiques de la table de geocodage intérrogées.
 *
 * @example
 * var ext =  new GeocodeFiltersExtension ();
 *     ext.add (new Administratif ());
 *     ext.add (new StreetAddress ());
 *     ext.add (new PositionOfInterest ());
 *     ext.add (new CadastralParcel ());
 *
 * ext.getNames ()
 * // --> out
 * // [Administratif, StreetAddress, PositionOfInterest, CadastralParcel]
 *
 * ext.getFilters ()
 * // --> out
 * // [Object, Object, Object, Object] = tableau d'objet GeocodeLocation
 *
 * ext.getFilter ('StreetAddress')
 * // --> out
 * // {Object} = objet GeocodeLocation
 *
 * ext.getAttributs ('StreetAddress')
 * // --> out
 * // ["bbox", "number", "ID", "IDTR", "postalCode", "quality", "street", "territoire", "commune", "department", "insee", "municipality"]
 *
 * ext.setPlaceAttributs ('StreetAddress', {number:'', territoire:'', quality:'', fake:''})
 * // --> out
 * // (fake est écarté car il n'appartient pas à la liste !)
 *
 * ext.getPlaceAttributs ('StreetAddress')
 * // --> out
 * // {number : '', territoire : '', quality : ''}
 *
 * // Comment ajouter des filtres spécifiques au service de geocodage ?
 * var req = new GeocodeRequest ({
 *      location : "saint mandé",
 *      returnFreeForm : true,
 *      filterOptions : {
 *          type : ['PositionOfInterest'], <-- ajouter une extension afin de gerer les attributs de cette table de geocodage !
 *          (...)
 *      }
 *  })
 *  req.addFilter (new PositionOfInterest ());
 * @constructor
 * @alias Gp.Formats.XLS.LocationUtilityService.GeocodeFilterExtension
 *
 * @private
 */
function GeocodeFilterExtension () {
    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("GeocodeFilterExtension");
    this.logger.trace("[Constructeur GeocodeFilterExtension ()]");

    if (!(this instanceof GeocodeFilterExtension)) {
        throw new TypeError("GeocodeFilterExtension constructor cannot be called as a function.");
    }

    /**
     * Tableau de filtres (table de geocodage)
     */
    this.filters = [];
}

/**
 * @lends module:GeocodeFilterExtension#
 */
GeocodeFilterExtension.prototype = {

    /**
     * Constructeur (alias)
     */
    constructor : GeocodeFilterExtension,

    /**
     * Ajout d'un filtre
     *
     * @param {Object} oGeocodeLocation - objet de type 'GeocodeLocation'
     */
    addFilterExtensions : function (oGeocodeLocation) {
        // FIXME test sur le type d'objet !
        if (oGeocodeLocation) {
            // FIXME ou test sur ses propriétés !
            this.filters.push(oGeocodeLocation);
        }
    },

    // getter

    /**
     * Tableau de noms (tables de geocodage)
     *
     * @returns {Array.<String>} liste des noms de filtres
     */
    getNames : function () {
        var names = [];
        for (var idx in this.filters) {
            names.push(this.filters[idx].CLASSNAME);
        }
        this.logger.trace(names);
        return names;
    },

    /**
     * Retourne une table de geocodage
     *
     * @param {String} name - nom de la table de geocodage
     * @returns {Object} filtre
     */
    getFilter : function (name) {
        var filter = null;
        for (var idx in this.filters) {
            if (this.filters[idx].CLASSNAME === name) {
                filter = this.filters[idx];
            }
        }
        this.logger.trace(filter);
        return filter;
    },

    /**
     * Tableau d'objects (tables de geocodage)
     *
     * @returns {Array.<Object>} liste des filtres
     */
    getFilters : function () {
        this.logger.trace(this.filters);
        return this.filters;
    },

    /**
     * Récupère la liste des attributs (filtres) sur une table de geocodage
     *
     * @param {String} name - nom de la table de geocodage
     * @returns {Array} liste des attributs d'un filtre
     */
    getAttributs : function (name) {
        var attributs = [];
        for (var idx in this.filters) {
            if (this.filters[idx].CLASSNAME === name) {
                attributs = this.filters[idx].attributesList;
            }
        }
        this.logger.trace(attributs);
        return attributs;
    },

    /**
     * Ajout des attributs (filtres) sur une table de geocodage
     *
     * @param {String} name - nom de la table de geocodage
     * @param {Object} options - options de la table de geocodage
     */
    setPlaceAttributs : function (name, options) {
        var filter = this.getFilter(name);
        var attributs = this.getAttributs(name);
        for (var idx in attributs) {
            var value = attributs[idx];
            if (options[value]) {
                filter.placeAttributes[value] = options[value];
            }
        }
    },

    /**
     * Retourne les attributs (filtres) sur une table de geocodage
     *
     * @param {String} name - nom de la table de geocodage
     * @returns {Array} liste des attributs d'un filtre
     */
    getPlaceAttributs : function (name) {
        var places = {};
        for (var idx in this.filters) {
            if (this.filters[idx].CLASSNAME === name) {
                places = this.filters[idx].placeAttributes;
            }
        }
        this.logger.trace(places);
        return places;
    }
};

/* harmony default export */ __webpack_exports__["a"] = (GeocodeFilterExtension);


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * Response object for {@link module:Services~geocode Gp.Services.geocode ()} or {@link module:Services~reverseGeocode Gp.Services.reverseGeocode ()} invocation when successful. Received as the argument of onSuccess callback function.
 *
 * @property {Array.<Gp.Services.Geocode.DirectGeocodedLocation|Gp.Services.Geocode.ReverseGeocodedLocation>} locations - locations array.
 *
 * @namespace
 * @alias Gp.Services.GeocodeResponse
 */
function GeocodeResponse () {
    if (!(this instanceof GeocodeResponse)) {
        throw new TypeError("GeocodeResponse constructor cannot be called as a function.");
    }

    this.locations = [];
}

GeocodeResponse.prototype = {

    constructor : GeocodeResponse

};

/* harmony default export */ __webpack_exports__["a"] = (GeocodeResponse);


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * Location object holding common properties returned by the underlying geocoding and reverse geocoding web service.
 *
 * @property {Gp.Point} position - Position of the location given in the requested coordinates system.
 * @property {String} type - location type "StreetAddress" (for an address), "PositionOfInterest" (for a place name) or "CadastralParcel" (for cadastral parcel).
 * @property {String} matchType - how geocoding is performed : "street number" (exact address), "street enhanced" (street number calculated by interpolation), "street" (only the street), "city" (only the city).
 * @property {Object} placeAttributes - Associative array matching the following attributes with their values given by the underlying web service :
 *
 * *Common attributes : *
 *
 * - **freeform** - freeform complete Address.
 * - **bbox** - Bounding Box *{@link Gp.BBox}*.
 * - **municipality** - Municipality
 *
 * *if type === "StreetAddress" : *
 *
 * - **number** - Street number.
 * - **ID** - Identifier of the address in the [BD ADRESSE Database]{@link http://professionnels.ign.fr/bdadresse}.
 * - **IDTR** - Identifier of the lineString in the [BD ADRESSE Database]{@link http://professionnels.ign.fr/bdadresse}.
 * - **postalCode** - PostCode
 * - **quality** - Geocoding quality ([see]{@link http://api.ign.fr/tech-docs-js/developpeur/search.html})
 * - **street** - Street name
 * - **territory** - French Territory code
 * - **commune** - City
 * - **department** - Department
 * - **insee** - INSEE Code
 *
 *
 * *if type === "PositionOfInterest" :*
 *
 * - **importance** - Place name importance
 * - **nature** - Place name nature
 * - **postalCode** - PostCode
 * - **territory** - French Territory code
 * - **commune** - City
 * - **department** - Department
 * - **insee** - INSEE Code
 *
 *
 * *si type = "CadastralParcel" :*
 *
 * - **absorbedCity** - when a parcel comes from a city that was absorbed by another, code of that old city. "000" otherwise.
 * - **arrondissement** - arrondissement
 * - **cadastralParcel** - cadastral parcel code
 * - **district** - district
 * - **sheet** - Parcel Sheet (eg. "1").
 * - **number** - Parcel Number (eg. "0041")
 * - **section** - Parcel Section (eg. "0D").
 * - **commune** - Parcel municipality.
 * - **department** - Parcel Department.
 * - **insee** - INSEE Code.
 * - **origin** - Parcel origin (see "type" attribute in the [underlying web service response]{@link http://api.ign.fr/tech-docs-js/developpeur/search.html#Cadastral_parcels_search})
 *
 * @namespace
 * @alias Gp.Services.Geocode.GeocodedLocation
 */
function GeocodedLocation () {
    if (!(this instanceof GeocodedLocation)) {
        throw new TypeError("GeocodedLocation constructor cannot be called as a function.");
    }

    this.position = {
        x : null,
        y : null
    };

    this.matchType = null;

    this.placeAttributes = {};

    this.type = null;
}

GeocodedLocation.prototype = {

    constructor : GeocodedLocation

};

/* harmony default export */ __webpack_exports__["a"] = (GeocodedLocation);


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Response object for {@link module:Services~route Gp.Services.route ()} invocation when successful. Received as the argument of onSuccess callback function.
 *
 * @property {Gp.BBox} bbox - Bounding Box of the route. Given when provideBBox parameter is used in function call.
 * @property {Object} routeGeometry - Geometry (expressed in [GeoJSON]{@link http://geojson.org/}) of the route.
 * @property {Array.<Gp.Services.Route.RouteInstruction>} routeInstructions - Instructions of the route.
 * @property {String} totalDistance - Length of the route. If distanceUnit parameter was set to "km" (default), totalDistance is a string containing the total distance expressed in kilometers, followed by " Km" (e.g. : "19.6 Km"). If distanceUnit parameter was set to "m", totalDistance is a string containing the total distance expressed in meters (e.g. : "19599.14").
 * @property {Float} totalTime - Route duration in seconds.
 *
 * @namespace
 * @alias Gp.Services.RouteResponse
 */
function RouteResponse () {
    if (!(this instanceof RouteResponse)) {
        throw new TypeError("RouteResponse constructor cannot be called as a function.");
    }

    this.totalTime = null;

    this.totalDistance = null;

    this.bbox = {
        left : null,
        right : null,
        top : null,
        bottom : null
    };

    this.routeGeometry = null; // FIXME can be null if option 'geometryInInstructions' is true !

    this.routeInstructions = [];
}

RouteResponse.prototype = {

    constructor : RouteResponse

};

/* harmony default export */ __webpack_exports__["a"] = (RouteResponse);


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * Single Route Instruction object.
 *
 * @property {String} code - Instruction code :
 *
 * - "F" : Straight forward
 * - "B" : U-turn
 * - "L" : turn left
 * - "R" : turn right
 * - "BL" : turn left strongly
 * - "BR" : turn right strongly
 * - "FL" : turn lightly to the left
 * - "FR" : turn lightly to the right
 * - "round_about_entry" : round about entry
 * - "round_about_exit" : round about exit
 *
 * @property {String} instruction - Instruction text : translated code + street name
 * @property {Object} geometry - Geometry (expressed in [GeoJSON]{@link http://geojson.org/}) of the street.
 * @property {Float} distance - Length of the instruction. Expressed in km or m, depending on distanceUnit parameter.
 * @property {Float} duration - Instruction duration in seconds.
 *
 * @namespace
 * @alias Gp.Services.Route.RouteInstruction
 */
function RouteInstruction () {
    if (!(this instanceof RouteInstruction)) {
        throw new TypeError("RouteInstruction constructor cannot be called as a function.");
    }

    this.duration = null;

    this.distance = null;

    this.code = null;

    this.instruction = null;

    this.geometry = null; // FIXME can be null if option 'geometryInInstructions' is false !
}

RouteInstruction.prototype = {

    constructor : RouteInstruction

};

/* harmony default export */ __webpack_exports__["a"] = (RouteInstruction);


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * Response object for {@link module:Services~isoCurve Gp.Services.isoCurve ()} invocation when successful. Received as the argument of onSuccess callback function.
 *
 * @property {Float} distance - distance (expressed in meters) used for the request.
 * @property {Float} time - time (expressed in seconds) used for the request.
 * @property {Object} geometry - Geometry (expressed in [GeoJSON]{@link http://geojson.org/}) of the isocurve.
 * @property {String} id - request id (used by underlying webservice).
 * @property {Gp.Point} location - Position of the start or end point used for the request (expressed in "srs" coordinates system).
 * @property {String} message - message
 * @property {String} srs - Identifier of the coordinates system used for the isocurve.
 *
 * @namespace
 * @alias Gp.Services.IsoCurveResponse
 *
 */
function ProcessIsoCurveResponse () {
    if (!(this instanceof ProcessIsoCurveResponse)) {
        throw new TypeError("ProcessIsoCurveResponse constructor cannot be called as a function.");
    }

    this.message = null;

    this.id = null;

    this.location = {};
    this.location.x = null;
    this.location.y = null;

    this.srs = null;

    this.geometry = null;

    this.time = null;

    this.distance = null;
}

ProcessIsoCurveResponse.prototype = {

    constructor : ProcessIsoCurveResponse

};

/* harmony default export */ __webpack_exports__["a"] = (ProcessIsoCurveResponse);


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Utils_Helper__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_es6_promise__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_es6_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_es6_promise__);
/* global Promise, require */




// import __request from "request";
// import __xmldom from "xmldom";

/**
 * Ajax Request (use of Promises)
 *
 * @module XHR
 * @alias Gp.Protocols.XHR
 * @see dependance 'es6-promise'
 */

// cf. https://xhr.spec.whatwg.org/
// cf. https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest

var XHR = {

    /**
     * Interface unique d'envoi d'une requête.
     *
     * @method call
     * @static
     * @param {Object} settings - options generales
     * @param {String} settings.url    - url du service
     * @param {String} settings.method - GET, POST, PUT, DELETE
     * @param {String} settings.format - format de la reponse du service : json, xml ou null (brute)
     * @param {String} settings.data   - content (post) ou param (get)
     * @param {String} settings.proxy  - proxy url
     * @param {Object|String} settings.headers - (post) ex. referer
     * @param {Object|String} settings.content - (post) ex. 'application/json'
     * @param {String} settings.timeOut - timeout = 0 par defaut
     * @param {String} settings.scope - this
     * @param {Function} settings.onResponse - callback
     * @param {Function} settings.onFailure  - callback
     */
    call : function (settings) {
        // logger
        var logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("XHR");
        logger.trace("[XHR::call()]");

        // FIXME
        // To polyfill the global environment
        __WEBPACK_IMPORTED_MODULE_2_es6_promise___default.a.polyfill();

        // test sur les settings obligatoires
        if (!settings.url) {
            throw new Error("missing parameter : url is not defined !");
        }

        if (!settings.method) {
            throw new Error("missing parameter : method is not defined !");
        }

        if (!settings.format) {
            settings.format = "text"; // reponse brute !
        }

        var options = {};
        options.url = settings.url;
        options.data = settings.data ? settings.data : null;
        options.method = settings.method;
        options.timeOut = settings.timeOut || 0;
        options.scope = settings.scope || this;
        options.proxy = settings.proxy || null;
        options.content = settings.content || null;
        options.headers = settings.headers || {
            referer : "http://localhost"
        };

        // test sur les valeurs de 'settings.method'
        switch (settings.method) {
            case "DELETE":
            case "GET":
                break;
            case "PUT":
            case "POST":
                // on force sur ces params spécifiques au mode POST
                options.content = settings.content ? settings.content : "application/x-www-form-urlencoded"; // FIXME en attente des services : bascule en "application/xml" ou "application/json"
                options.headers = settings.headers ? settings.headers : {
                    referer : "http://localhost" // todo ...
                };
                break;
            case "HEAD":
            case "OPTIONS":
                throw new Error("HTTP method not yet supported !");
            default:
                throw new Error("HTTP method unknown !");
        }

        // test sur les valeurs de 'settings.format'
        switch (settings.format) {
            case "text":
                this.__call(options)
                    .then(function (response) {
                        logger.trace(response);
                        settings.onResponse.call(this, response);
                    })
                    .catch(function (error) {
                        settings.onFailure.call(this, error);
                    });
                break;
            case "json":
                this.__callJSON(options)
                    .then(function (response) {
                        logger.trace(response);
                        settings.onResponse.call(this, response);
                    })
                    .catch(function (error) {
                        settings.onFailure.call(this, error);
                    });
                break;
            case "xml":
                this.__callXML(options)
                    .then(function (response) {
                        logger.trace(response);
                        settings.onResponse.call(this, response);
                    })
                    .catch(function (error) {
                        settings.onFailure.call(this, error);
                    });
                break;
            default:
                throw new Error("This output Format is not yet supported !");
        }
    },

    /**
     * Requete
     *
     * @method __call
     * @private
     * @param  {Object} options - options
     * @return {Object} promise
     */
    __call : function (options) {
        var logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("XHR");
        logger.trace("[XHR::__call()]");

        var promise = new Promise(
            function (resolve, reject) {
                // traitement du corps de la requête
                var corps = (options.method === "POST" || options.method === "PUT") ? 1 : 0;

                // seulement si options.data n'est pas vide (peut être un objet ou une chaine de caractères)
                if (options.data && ((typeof options.data === "object" && Object.keys(options.data).length) || (typeof options.data === "string" && options.data.length)) && !corps) {
                    options.url = __WEBPACK_IMPORTED_MODULE_1__Utils_Helper__["a" /* default */].normalyzeUrl(options.url, options.data);
                }

                logger.trace("URL = ", options.url);

                var hXHR = null;

                // test on env. nodejs or browser
                if (typeof window === "undefined") {
                    // Utilisation du module :
                    // cf. http://blog.modulus.io/node.js-tutorial-how-to-use-request-module

                    var req = __webpack_require__(53);// __request

                    // mapping data avec body param. pour le mode POST ou PUT (?)
                    if (options.data && typeof options.data === "string" && corps) {
                        options.body = options.data;
                    }

                    // FIXME ERROR : self signed certificate in certificate chain
                    options.rejectUnauthorized = false;

                    req(options, function (error, response, body) {
                        if (!error && response.statusCode === 200 && body) {
                            resolve(body);
                        } else {
                            reject("Errors Occured on Http Request (nodejs) : " + error);
                        }
                    });
                } else {
                    if (window.XMLHttpRequest) {
                        logger.trace("XMLHttpRequest");

                        hXHR = new XMLHttpRequest();
                        hXHR.open(options.method, options.url, true); // async
                        hXHR.overrideMimeType = options.content;

                        // gestion du timeout
                        var onTimeOutTrigger = null;
                        if (options.timeOut > 0) {
                            // FIXME le timeout interne ne me permet pas de declencher le bon message...
                            // hXHR.timeout = options.timeOut;
                            logger.trace("XHR - TimeOut actif !");
                            /**
                             * Description
                             *
                             * @method onTimeOutTrigger
                             * @private
                             */
                            onTimeOutTrigger = window.setTimeout(
                                function () {
                                    var message = "TimeOut Occured on Http Request with XMLHttpRequest !";
                                    reject({
                                        message : message,
                                        status : -1
                                    });
                                }, options.timeOut);
                        }

                        if (corps) {
                            // headers, data, content of data
                            // cf. https://dvcs.w3.org/hg/xhr/raw-file/tip/Overview.html#dom-xmlhttprequest-setrequestheader
                            logger.trace("data = ", options.data);
                            hXHR.setRequestHeader("Content-type", options.content);
                            // FIXME refused to set unsafe header content-length javascript
                            // hXHR.setRequestHeader ("Content-length", options.data.length);
                            // hXHR.setRequestHeader ("Referer", options.headers.referer);
                        }

                        /**
                         * On Error
                         * FIXME ne se declenche pas !?
                         *
                         * @param {Object} e - Event
                         * @method onerror
                         * @private
                         */
                        hXHR.onerror = function (e) {
                            console.log(e);
                            reject(new Error("Errors Occured on Http Request with XMLHttpRequest !"));
                        };

                        /**
                         * On Timeout
                         * FIXME ne se declenche pas !?
                         *
                         * @param {Object} e - Event
                         * @method ontimeout
                         * @private
                         */
                        hXHR.ontimeout = function (e) {
                            console.log(e);
                            reject(new Error("TimeOut Occured on Http Request with XMLHttpRequest !"));
                        };

                        /**
                         * Description
                         *
                         * @method onreadystatechange
                         * @private
                         */
                        hXHR.onreadystatechange = function (e) {
                            if (hXHR.readyState === 4) { // DONE
                                if (hXHR.status === 200) {
                                    window.clearTimeout(onTimeOutTrigger);
                                    resolve(hXHR.response);
                                } else {
                                    var message = "Errors Occured on Http Request (status : '" + e.target.statusText + "' | url : '" + e.target.responseURL + "')";
                                    var status = e.target.status;
                                    reject({
                                        message : message,
                                        status : status
                                    });
                                }
                            }
                        };

                        // gestion du content data
                        var data4xhr = (options.data && corps) ? options.data : null;

                        hXHR.send(data4xhr);
                    } else if (window.XDomainRequest) {
                        // worked in Internet Explorer 8–10 only !
                        logger.trace("XDomainRequest");

                        hXHR = new XDomainRequest();
                        hXHR.open(options.method, options.url);

                        hXHR.overrideMimeType = options.content;

                        if (options.timeOut > 0) {
                            hXHR.timeout = options.timeout;
                            logger.trace("XHR - TimeOut actif !");
                        }

                        if (corps) {
                            // headers, data, content of data
                            // cf. https://dvcs.w3.org/hg/xhr/raw-file/tip/Overview.html#dom-xmlhttprequest-setrequestheader
                            hXHR.setRequestHeader("Content-type", options.content);
                            // FIXME refused to set unsafe header content-length javascript
                            // hXHR.setRequestHeader ("Content-length", options.data.length);
                            // hXHR.setRequestHeader ("Referer", options.headers.referer);
                        }

                        /**
                         * Description
                         *
                         * @method onerror
                         * @private
                         */
                        hXHR.onerror = function () {
                            reject(new Error("Errors Occured on Http Request with XMLHttpRequest !"));
                        };

                        /**
                         * Description
                         *
                         * @method ontimeout
                         * @private
                         */
                        hXHR.ontimeout = function () {
                            reject(new Error("TimeOut Occured on Http Request with XMLHttpRequest !"));
                        };

                        /**
                         * On Load
                         *
                         * @method onload
                         * @private
                         */
                        hXHR.onload = function (e) {
                            if (hXHR.status === 200) {
                                resolve(hXHR.responseText);
                            } else {
                                var message = "Errors Occured on Http Request (status : '" + e.target.statusText + "' | url : '" + e.target.responseURL + "')";
                                var status = e.target.status;
                                reject({
                                    message : message,
                                    status : status
                                });
                            }
                        };

                        var data4xdr = (options.data && corps) ? options.data : null;

                        hXHR.send(data4xdr);
                    } else {
                        throw new Error("CORS not supported");
                    }
                }
            }
        );

        return promise;
    },

    /**
     * Requete avec parser JSON
     *
     * @method __callJSON
     * @private
     * @param  {Object} options - options
     * @return {Object} promise
     */
    __callJSON : function (options) {
        return this.__call(options)
            .then(JSON.parse)
            .catch(function (error) {
                console.log("_callJSON failed on : ", options.url, error);
                // FIXME pas d'exception, laissons le fil se derouler...
                // throw error;
            });
    },

    /**
     * Requete avec parser XML
     *
     * @method __callXML
     * @private
     * @param  {Object} options - options
     * @return {Object} promise
     */
    __callXML : function (options) {
        return this.__call(options)
            .then(function (response) {
                var xmlDoc;

                // test on env. nodejs or browser
                if (typeof window === "undefined") {
                    var DOMParser = __webpack_require__(20).DOMParser; // __xmldom.DOMParser
                    xmlDoc = new DOMParser().parseFromString(response, "text/xml");
                } else {
                    if (window.DOMParser) {
                        var parser = new window.DOMParser();
                        xmlDoc = parser.parseFromString(response, "text/xml");
                    } else { // IE
                        xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
                        xmlDoc.async = false;
                        xmlDoc.loadXML(response);
                    }
                }

                return xmlDoc;
            })
            .catch(function (error) {
                console.log("__callXML failed on : ", options.url, error);
                // FIXME pas d'exception, laissons le fil se derouler...
                // throw error;
            });
    }

};

/* harmony default export */ __webpack_exports__["a"] = (XHR);


/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_20__;

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = {"name":"geoportal-access-lib","version":"2.1.5","date":"12/09/2019","description":"French Geoportal resources access library","module":"src/Gp.js","main":"dist/GpServices-src.js","homepage":"https://github.com/IGNF/geoportal-access-lib#readme","scripts":{"clean":"echo \"Warning: no yet implemented!\" && exit 0","setup":"npm install","cover":"nyc --reporter=lcov --reporter=text npm run test","build":"webpack","build:prod":"webpack --env.production","build:dev":"webpack --env.development","test":"mocha-webpack --webpack-config webpack.test.js --glob \"test_*.js\" test/spec/","test:serve":"webpack-dev-server --hot --config webpack.test.serve.js","test:end-to-end:serve":"webpack-dev-server --hot --config webpack.end-to-end.serve.js","sample":"npm run sample:serve","sample:serve":"webpack-dev-server --open-page samples/index-src.html --https --content-base .  --output-public-path '/dist/' --port 9001 --open 'google-chrome'","sample:serve:prod":"webpack-dev-server --env.production --open-page samples/index.html --content-base . --output-public-path '/dist/' --port 9001 --open 'google-chrome","sample:serve:dev":"webpack-dev-server --env.development --open-page samples/index-map.html --content-base . --output-public-path '/dist/' --port 9001 --open 'google-chrome","doc":"npm run doc:serve","doc:serve":"webpack-dev-server --content-base jsdoc --port 9001 --open"},"nyc":{"include":["src/**/*.js"],"instrument":false,"sourceMap":false},"repository":{"type":"git","url":"https://github.com/IGNF/geoportal-access-lib.git"},"keywords":["geoportail","webservice","javascript","es6"],"author":"IGNF","license":"CECILL-B","dependencies":{"es6-promise":"^4.2.4","request":"^2.87.0","xmldom":"^0.1.27"},"devDependencies":{"babel-core":"^6.26.3","babel-loader":"^7.1.2","babel-preset-env":"^1.7.0","chai":"^4.1.2","clean-webpack-plugin":"^0.1.18","copy-webpack-plugin":"^4.5.1","eslint":"^4.18.2","eslint-config-standard":"^11.0.0","eslint-loader":"^2.0.0","eslint-plugin-import":"^2.9.0","eslint-plugin-node":"^6.0.1","eslint-plugin-promise":"^3.7.0","eslint-plugin-standard":"^3.0.1","glob":"^7.1.2","handlebars-layouts":"^3.1.4","handlebars-webpack-plugin":"^1.4.1","html-webpack-plugin":"^2.30.1","istanbul-instrumenter-loader":"^3.0.1","jsdoc-webpack-plugin":"0.0.1","loglevel":"^1.6.1","mocha":"^4.0.0","mocha-loader":"^1.1.3","mocha-webpack":"^1.0.1","nyc":"^12.0.2","path":"^0.12.7","replace-bundle-webpack-plugin":"^1.0.0","sinon":"^4.3.0","sinon-es6":"0.0.3","speed-measure-webpack-plugin":"^1.2.2","string-template":"^1.0.0","webpack":"^3.11.0","webpack-dev-server":"^2.11.3","webpack-node-externals":"^1.6.0","webpack-shell-plugin":"^0.5.0"},"bundledDependencies":[],"peerDependencies":{},"optionalDependencies":{}}

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__AltiRequest__ = __webpack_require__(23);




/**
 * @classdesc
 *
 * Classe de gestion des param. des requêtes de type POINT du service altimetrique.
 *
 * @constructor
 * @alias Gp.Services.Alti.Request.AltiElevationRequest
 * @param {Object} options - options
 * @param {Boolean}  options.zonly - false|true
 *
 * @private
 */
function AltiElevationRequest (options) {
    if (!(this instanceof AltiElevationRequest)) {
        throw new TypeError("AltiElevationRequest constructor cannot be called as a function.");
    }

    /**
     * Nom de la classe (heritage)
     */
    this.CLASSNAME = "AltiElevationRequest";

    // appel du constructeur par heritage
    __WEBPACK_IMPORTED_MODULE_1__AltiRequest__["a" /* default */].apply(this, arguments);

    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger();
    this.logger.trace("[Constructeur AltiElevationRequest ()]");

    /**
     * Z uniquement.
     * true|false
     */
    this.zonly = this.options.zonly || false; // test des options héritées !
}

/**
 * @lends module:AltiElevationRequest#
 */

AltiElevationRequest.prototype = Object.create(__WEBPACK_IMPORTED_MODULE_1__AltiRequest__["a" /* default */].prototype, {

    /**
     * Setter/getter pour "zonly"
     */
    zonly : {
        /** getter */
        get : function () {
            return this._zonly;
        },
        /** setter */
        set : function (z) {
            this._zonly = z;
        }
    }

});

/**
 * Constructeur (alias)
 */
AltiElevationRequest.prototype.constructor = AltiElevationRequest;

/**
 * Tableau de clefs/valeurs pour param.
 *
 * @returns {Array}
 */
AltiElevationRequest.prototype.getData = function () {
    // par glop..., appel de AltiRequest::getData () !
    var map = [];
    map.push({
        k : "lon",
        v : this.getLon()
    });
    map.push({
        k : "lat",
        v : this.getLat()
    });
    // map.push({k : "delimiter", v : this.delimiter}); // FIXME on retire le param "delimiter"
    map.push({
        k : "indent",
        v : this.indent
    });
    map.push({
        k : "crs",
        v : this.crs
    });
    map.push({
        k : "zonly",
        v : this.zonly
    });
    map.push({
        k : "format",
        v : this.format
    });

    return map;
};

/* harmony default export */ __webpack_exports__["a"] = (AltiElevationRequest);


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);



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

    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger();
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

/* harmony default export */ __webpack_exports__["a"] = (AltiRequest);


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__AltiRequest__ = __webpack_require__(23);




/**
 * @classdesc
 * Classe de gestion des param. des requêtes de type PROFIL du service altimetrique.
 *
 * @constructor
 * @alias Gp.Services.Alti.Request.AltiProfilRequest
 * @param {Object}   options - options
 * @param {String}   options.sampling - 3
 *
 * @private
 */
function AltiProfilRequest (options) {
    if (!(this instanceof AltiProfilRequest)) {
        throw new TypeError("AltiProfilRequest constructor cannot be called as a function.");
    }

    /**
     * Nom de la classe (heritage)
     */
    this.CLASSNAME = "AltiProfilRequest";

    // appel du constructeur par heritage
    __WEBPACK_IMPORTED_MODULE_1__AltiRequest__["a" /* default */].apply(this, arguments);

    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger();
    this.logger.trace("[Constructeur AltiProfilRequest ()]");

    /**
     * Sampling
     * Par defaut, 3
     */
    this.sampling = this.options.sampling || 3; // test des options héritées !
}

/**
 * @lends module:AltiProfilRequest#
 */

AltiProfilRequest.prototype = Object.create(__WEBPACK_IMPORTED_MODULE_1__AltiRequest__["a" /* default */].prototype, {

    /**
     * Setter/getter pour "sampling"
     */
    sampling : {
        /** getter */
        get : function () {
            return this._sampling;
        },
        /** setter */
        set : function (value) {
            this._sampling = value;
        }
    }
});

/**
 * Constructeur (alias)
 */
AltiProfilRequest.prototype.constructor = AltiProfilRequest;

/**
 * Tableau de clefs/valeurs pour param.
 *
 * @returns {Object[]}
 */
AltiProfilRequest.prototype.getData = function () {
    // par glop..., appel de AltiRequest::getData () !
    var map = [];
    map.push({
        k : "lon",
        v : this.getLon()
    });
    map.push({
        k : "lat",
        v : this.getLat()
    });
    // map.push({k : "delimiter", v : this.delimiter}); // FIXME on retire le param "delimiter"
    map.push({
        k : "indent",
        v : this.indent
    });
    map.push({
        k : "crs",
        v : this.crs
    });
    map.push({
        k : "sampling",
        v : this.sampling
    });
    map.push({
        k : "format",
        v : this.format
    });

    return map;
};

/* harmony default export */ __webpack_exports__["a"] = (AltiProfilRequest);


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * Response object for {@link module:Services~getConfig Gp.Services.getConfig ()} invocation when successful. Received as the argument of onSuccess callback function.
 *
 * @property {Object} generalOptions - General properties for default map configuration resources.
 * @property {Object} generalOptions.apiKeys - Object that associates apiKey (s) with an array of resources IDs availables with that key.
 * @property {String} generalOptions.title - Underlying web service Title.
 * @property {String} generalOptions.defaultGMLGFIStyle - XSL URL used by default to translate an XML GetFeatureInfo response into an HTML array.
 * @property {String} generalOptions.theme - default theme (FIXME : for what ?)
 * @property {Array.<Float>} generalOptions.wgs84Resolutions - geographical resolutions Array for each [zoom level of the Geoportal platform]{@link http://api.ign.fr/tech-docs-js/webmaster/layers.html#Geoportal_resolutions} from 0 to 21. Expressed in degrees/pixel.
 * @property {Object} layers - Associative array mapping resources availables IDs (keys) with their properties (values given as {@link Gp.Services.Config.Layer}).
 * @property {Object} territories - Associative array mapping french territories IDs (keys) with their properties (values given as {@link Gp.Services.Config.Territory}).
 * @property {Object} tileMatrixSets - Associative Array mapping TileMatrixSets IDs (keys) availables with their properties (values given as {@link Gp.Services.Config.TileMatrixSet}).
 * @property {Object} services - Associative Array mapping Geoportal web services IDs (keys) availables with their properties (values given as {@link Gp.Services.Config.Service}).
 *
 * @namespace
 * @alias Gp.Services.GetConfigResponse
 */
function AutoConfResponse () {
    if (!(this instanceof AutoConfResponse)) {
        throw new TypeError("AutoConfResponse constructor cannot be called as a function.");
    }

    this.generalOptions = {
        apiKeys : {},
        title : null,
        defaultGMLGFIStyle : null,
        theme : null,
        wgs84Resolutions : []
    };

    this.layers = {};

    this.territories = {};

    this.tileMatrixSets = {};

    this.services = {};
}

AutoConfResponse.prototype = {

    /*
     * Constructor (alias)
     */
    constructor : AutoConfResponse,

    /**
     * Check if config is loaded for a given key
     *
     * @param {String} apiKey - Access key to Geoportal platform
     * @returns {Boolean} isConfLoaded - true if config is already loaded, false otherwise
     */
    isConfLoaded : function (apiKey) {
        if (!apiKey) {
            return;
        }
        if (this.generalOptions.apiKeys[apiKey]) {
            return true;
        }
        return false;
    },

    /**
     * Returns an array of Geoportal layers identifiers, corresponding to an API contract key.
     *
     * @param {String} apiKey - Access key to Geoportal platform
     * @returns {Array} apiKeys - Array of geoportal layers identifiers
     */
    getLayersId : function (apiKey) {
        return this.generalOptions.apiKeys[apiKey];
    },

    /**
     * Returns an associative array of Geoportal layers configurations, corresponding to an API contract key.
     * If no key is specified, all layers from configuration are returned.
     *
     * @param {String} apiKey - Access key to Geoportal platform
     * @returns {Object} layers - Object which properties are layers identifiers, and corresponding
     *      values are instances of <Gp.Services.Config.Layer>.
     */
    getLayersConf : function (apiKey) {
        var layers = {};
        var layersIdArray = this.getLayersId(apiKey);
        if (layersIdArray) {
            for (var i = 0; i < layersIdArray.length; i++) {
                var lyrId = layersIdArray[i];
                layers[lyrId] = this.layers[lyrId];
            }
        }
        return layers;
    },

    /**
     * Returns a geoportal layer configuration, given its identifier
     *
     * @param {String} layerId - Geoportal layer identifier (e.g. "GEOGRAPHICALGRIDSYSTEMS.MAPS$GEOPORTAIL:OGC:WMTS")
     * @return {Object} layer - Layer configuration : instance of {@link Gp.Services.Config.Layer}
     */
    getLayerConf : function (layerId) {
        if (!this.layers) {
            return;
        }
        return this.layers[layerId];
    },

    /**
     * Returns an associative array of Tile Matrix Sets configurations.
     *
     * @return {Object} tileMatrixSets - Object which properties are TMS identifiers,
     *      and corresponding values are instances of {@link Gp.Services.Config.TileMatrixSet}.
     */
    getTileMatrixSets : function () {
        return this.tileMatrixSets;
    },

    /**
     * Returns a Tile Matrix Sets configuration, given its identifier.
     *
     * @param {String} tmsID - Tile Matrix Set identifier (e.g. : "PM")
     * @return {Object} tileMatrixSet - Tile Matrix Set configuration, instance of {@link Gp.Services.Config.TileMatrixSet}
     */
    getTMSConf : function (tmsID) {
        if (!this.tileMatrixSets) {
            return;
        }
        return this.tileMatrixSets[tmsID];
    },

    /**
     * Returns an associative array of territories configurations.
     *
     * @return {Object} territories - Object which properties are territory identifiers,
     *      and corresponding values are instances of {@link Gp.Services.Config.Territory}.
     */
    getTerritories : function () {
        return this.territories;
    },

    /**
     * Returns a territory configuration, given its identifier.
     *
     * @param {String} territoryID - territory identifier (e.g. "FXX")
     * @return {Object} territory - Territory configuration, instance of {@link Gp.Services.Config.Territory}
     */
    getTerritoryConf : function (territoryID) {
        if (!this.territories) {
            return;
        }
        return this.territories[territoryID];
    },

    /**
     * Returns an associative array of services configurations.
     *
     * @return {Object} services - Object which properties are services identifiers,
     *      and corresponding values are instances of {@link Gp.Services.Config.Service}.
     */
    getServices : function () {
        return this.services;
    },

    /**
     * Returns a service configuration, given its identifier.
     *
     * @param {String} serviceID - service identifier (e.g. "OGC:WMTS")
     * @return {Object} service - service configuration, instance of {@link Gp.Services.Config.Service}
     */
    getServiceConf : function (serviceID) {
        if (!this.services) {
            return;
        }
        return this.services[serviceID];
    }

};

/* harmony default export */ __webpack_exports__["a"] = (AutoConfResponse);


/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 *
 * Object used to express a geographical (BBOX, scale) and temporal constraint.
 *
 * @property {String} crs - Coordinates System ID used to express coordinates contraints.
 * @property {Gp.BBox} bbox - Constraint Bounding Box.
 * @property {Number} minScaleDenominator - Minimum scale denominator where constraint applies.
 * @property {Number} maxScaleDenominator - Maximum scale denominator where constraint applies.
 * @property {Array.<String>} temporalExtent - Array expressing the time interval of the constraint [minT, maxT]. Dates are expressed in the [ISO-8601]{@link https://en.wikipedia.org/wiki/ISO_8601} way.
 *
 * @namespace
 * @alias Gp.Services.Config.Constraint
 */

function Constraint () {
    if (!(this instanceof Constraint)) {
        throw new TypeError("Constraint constructor cannot be called as a function.");
    }

    this.crs = null;

    this.bbox = {
        left : null,
        right : null,
        top : null,
        bottom : null
    };

    this.minScaleDenominator = null;

    this.maxScaleDenominator = null;

    this.temporalExtent = [null, null];
}

Constraint.prototype = {

    constructor : Constraint

};

/* harmony default export */ __webpack_exports__["a"] = (Constraint);


/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * Object used to describe a format to use with Geoportal resources.
 *
 * @property {Boolean} current - If true, then this format is used by default.
 * @property {String} name - Format mime-type.
 *
 * @namespace
 * @alias Gp.Services.Config.Format
 */

function Format () {
    if (!(this instanceof Format)) {
        throw new TypeError("Format constructor cannot be called as a function.");
    }

    this.current = null;

    this.name = null;
}

Format.prototype = {

    constructor : Format

};

/* harmony default export */ __webpack_exports__["a"] = (Format);


/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * Object used to describe geoportal resource (WMTS, WMS, WFS layers, geocoding resources or elevation service) parameters. Properties may be used or not depending on the resource type.
 *
 * @property {String} name - name of the resource to use with the webservice that serves it (eg : "GEOGRAPHICALGRIDSYSTEMS.MAPS").
 * @property {String} title - Human readable name for the resource.
 * @property {String} description - Resource description.
 * @property {String} layerId - Unique resource Identifier (eg : "GEOGRAPHICALGRIDSYSTEMS.MAPS$GEOPORTAIL:OGC:WMTS")
 * @property {String} quicklookUrl - Image URL for the resource.
 * @property {Object} serviceParams - Informations about the webservice that serves the resource (OpenLS, WFS, WMTS)
 * @property {String} serviceParams.id - Web Service identifier ("OGC:WMTS", "OGC:OPENLS;ReverseGeocode", etc...)
 * @property {Object} serviceParams.serverUrl - Associative array mapping geoportal access key (keys) with their properties (URLs of the web service, with the geoportal access key).
 * @property {String} serviceParams.version - webservice version.
 * @property {String} defaultProjection - coordinates system ID used by default for the resource (WMS or WFS layer) or of the TileMatrixSet used by the WMTS layer.
 * @property {Array.<String>} additionalProjections - additional coordinates systems IDs availables for the resource, others than the default one (see defaultProjection) (WMS and WFS layers only).
 * @property {Array.<Gp.Services.Config.Format>} formats - Formats availables for the resource.
 * @property {Array.<Gp.Services.Config.Legend>} legends - Informations about legends associated to the resource.
 * @property {Array.<Gp.Services.Config.Metadata>} metadata - Informations about metadata associated to the resource.
 * @property {Array.<Gp.Services.Config.Style>} styles - Informations about styles availables for the resources (WMS, WFS and WMTS only).
 * @property {Array.<Gp.Services.Config.Thematic>} thematics - Informations about thematics associated to the resource.
 * @property {Gp.Services.Config.Constraint} globalConstraint - geographical constraint for the resource.
 * @property {Array.<Gp.Services.Config.Constraint>} constraints - additionnal geographical constraints for the resource.
 * @property {Array.<Gp.Services.Config.Originator>} originators - Informations about originator of the resource.
 * @property {Object} wmtsOptions - Informations associated to WMTS resources.
 * @property {String} wmtsOptions.tileMatrixSetLink - TileMatrixSet identifier used by the resource (see {@link Gp.Services.Config.TileMatrixSet})
 * @property {Gp.Services.Config.TileMatrixLimit} wmtsOptions.tileMatrixSetLimits - limits of the resource for that TileMAtrixSet.
 * @property {Boolean} queryable - true if a getFeatureInfo request may be done for the resource (WMS or WMTS only).
 * @property {Boolean} hidden - true if the resource is not visible.
 * @property {Boolean} isAggregate - true if the resource is an aggregate of other resources (@see aggregatedLayers).
 * @property {Array.<String>} aggregatedLayers - Layers IDs composing the being described aggregated layer.
 * @property {Array.<String>} apiKeys - Array of access keys that grant access to that resource.
 * @property {Object} dimensions - Dimensions informations associated with the resource.
 * @property {String} dimensions.type
 * @property {String} dimensions.visibilityRange
 * @property {String} dimensions.visibilityMode
 * @property {String} dimensions.noDataValue
 * @property {String} dimensions.geometricType
 *
 * @namespace
 * @alias Gp.Services.Config.Layer
 */
function Layer () {
    if (!(this instanceof Layer)) {
        throw new TypeError("Layer constructor cannot be called as a function.");
    }

    // info : une instance de la classe Layer n'a aucune propriété au départ,.
    // les attributs possibles sont documentés ci-dessus,
    // et seront implémentés au fur et à mesure de la lecture de la réponse de l'autoconf, lorsque l'information est rencontrée.
}

Layer.prototype = {

    constructor : Layer,

    /**
     * Returns the layer name
     *
     * @returns {String} name - name of the resource to use with the webservice that serves it (eg : "GEOGRAPHICALGRIDSYSTEMS.MAPS").
     */
    getName : function () {
        return this.name;
    },

    /**
     * Returns the layer title
     *
     * @returns {String} title - Human readable name for the resource.
     */
    getTitle : function () {
        return this.title;
    },

    /**
     * Returns the layer description
     *
     * @returns {String} description - Resource description.
     */
    getDescription : function () {
        return this.description;
    },

    /**
     * Returns the layer identifier
     *
     * @returns {String} layerId - Unique resource Identifier (eg : "GEOGRAPHICALGRIDSYSTEMS.MAPS$GEOPORTAIL:OGC:WMTS")
     */
    getLayerId : function () {
        return this.layerId;
    },

    /**
     * Returns the layer quicklookUrl
     *
     * @returns {String} quicklookUrl - Image URL for the resource.
     */
    getQuicklookUrl : function () {
        return this.quicklookUrl;
    },

    /**
     * Returns the layer default projection
     *
     * @returns {String} defaultProjection - coordinates system ID used by default for the resource (WMS or WFS layer) or of the TileMatrixSet used by the WMTS layer.
     */
    getDefaultProjection : function () {
        return this.defaultProjection;
    },

    /**
     * Returns the layer projections
     *
     * @returns {Array.<String>} projections - coordinates systems IDs availables for the resource, including the default one.
     */
    getProjections : function () {
        var projections = [];
        projections.push(this.defaultProjection);
        var proj = projections.concat(this.additionalProjections);
        return proj;
    },

    /**
     * Returns the global BBOX
     *
     * @returns {Gp.BBox} bbox - the layer global bounding box, expressed in CRS system.
     */
    getBBOX : function () {
        if (!this.globalConstraint) {
            return;
        }
        return this.globalConstraint.bbox;
    },

    /**
     * Returns the layer minimum scale denominator
     *
     * @returns {Number} minScaleDenominator - minimum scale denominator for this layer
     */
    getMinScaleDenominator : function () {
        if (!this.globalConstraint) {
            return;
        }
        return this.globalConstraint.minScaleDenominator;
    },

    /**
     * Returns the layer maximum scale denominator
     *
     * @returns {Number} maxScaleDenominator - maximum scale denominator for this layer
     */
    getMaxScaleDenominator : function () {
        if (!this.globalConstraint) {
            return;
        }
        return this.globalConstraint.maxScaleDenominator;
    },

    /**
     * Returns layer Tile Matrix Set identifier if exists
     *
     * @returns {String} tileMatrixSetLink - Tile Matrix Set identifier (for instance : "PM")
     */
    getTMSID : function () {
        if (this.wmtsOptions) {
            return this.wmtsOptions.tileMatrixSetLink;
        }
    },

    /**
     * Returns information about the webservice that serves the resource
     *
     * @returns {Object} serviceParams - Information about the webservice that serves the resource (OpenLS, WFS, WMTS)
     */
    getServiceParams : function () {
        return this.serviceParams;
    },

    /**
     * Returns Geoportal server url for a given key
     *
     * @param {String} apiKey - Access key to Geoportal platform
     * @returns {String} serverUrl - general URL of the web service (with the geoportal access key)
     */
    getServerUrl : function (apiKey) {
        if (!apiKey || !this.serviceParams || !this.serviceParams.serverUrl) {
            return;
        }
        return this.serviceParams.serverUrl[apiKey];
    },

    /**
     * Returns information about legends associated to the resource.
     *
     * @returns {Array.<Gp.Services.Config.Legend>} legends - Informations about legends associated to the resource.
     */
    getLegends : function () {
        return this.legends;
    },

    /**
     * Returns information about metadata associated to the resource.
     *
     * @returns {Array.<Gp.Services.Config.Metadata>} metadata - Informations about metadata associated to the resource.
     */
    getMetadata : function () {
        return this.metadata;
    },

    /**
     * Returns information about styles availables for the resources (WMS, WFS and WMTS only).
     *
     * @returns {Array.<Gp.Services.Config.Style>} styles - Informations about styles availables for the resources (WMS, WFS and WMTS only).
     */
    getStyles : function () {
        return this.styles;
    },

    /**
     * Returns layer default style
     *
     * @returns {String} styleName - style identifier (eg : "normal", "bdparcellaire", ...)
     */
    getDefaultStyle : function () {
        if (!this.styles) {
            return;
        }
        var style;
        var s = this.styles;
        for (var i = 0; i < s.length; i++) {
            if (s[i].current === true) {
                style = s[i].name;
                break;
            }
        }
        return style;
    },

    /**
     * Returns information about thematics associated to the resource.
     *
     * @returns {Array.<Gp.Services.Config.Thematic>} thematics - Informations about thematics associated to the resource.
     */
    getThematics : function () {
        return this.thematics;
    },

    /**
     * Returns layer default format
     *
     * @returns {String} formatName - Format mime-type. (eg. "image/jpeg")
     */
    getDefaultFormat : function () {
        if (!this.formats) {
            return;
        }
        var format;
        var f = this.formats;
        for (var i = 0; i < f.length; i++) {
            if (f[i].current === true) {
                format = f[i].name;
                break;
            }
        }
        return format;
    },

    /**
     * Returns information about geographical or temporal constraints for the resource
     *
     * @returns {Array.<Gp.Services.Config.Constraint>} constraints - Informations about geographical or temporal constraints for the resource
     */
    getConstraints : function () {
        return this.constraints;
    },

    /**
     * Returns information about originators of this resource
     *
     * @returns {Array.<Gp.Services.Config.Originator>} originators - Informations about originators of this resource
     */
    getOriginators : function () {
        return this.originators;
    },

    /**
     * Returns information about dimensions associated with this resource
     *
     * @returns {Object} dimensions - Dimensions informations associated with the resource.
     */
    getDimensions : function () {
        return this.dimensions;
    },

    /**
     * Returns information about aggregated layers composing the being described layer, in case the resource is an aggregate of other resources.
     *
     * @returns {Object} aggregatedLayers - Layers IDs composing the being described aggregated layer.
     */
    getAggregatedLayers : function () {
        if (this.isAggregate) {
            return this.aggregatedLayers;
        } else {

        }
    }

};

/* harmony default export */ __webpack_exports__["a"] = (Layer);


/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * Object used to describe a legend file associated with a geoportal resource (WMTS, WMS, WFS layers).
 *
 * @property {String} format - mime-type of the legend file.
 * @property {String} url - legend file URL
 * @property {Number} minScaleDenominator - minimum scale denominator where this legend applies.
 *
 * @namespace
 * @alias Gp.Services.Config.Legend
 */

function Legend () {
    if (!(this instanceof Legend)) {
        throw new TypeError("Legend constructor cannot be called as a function.");
    }

    this.format = null;

    this.url = null;

    this.minScaleDenominator = null;
}

Legend.prototype = {

    constructor : Legend

};

/* harmony default export */ __webpack_exports__["a"] = (Legend);


/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * Object used to describe a metadata file associated with a geoportal resource.
 *
 * @property {String} format - mime-type of the metadata file.
 * @property {String} url - metadata file URL
 *
 * @namespace
 * @alias Gp.Services.Config.Metadata
 */

function Metadata () {
    if (!(this instanceof Metadata)) {
        throw new TypeError("Metadata constructor cannot be called as a function.");
    }

    this.format = null;

    this.url = null;
}

Metadata.prototype = {

    constructor : Metadata

};

/* harmony default export */ __webpack_exports__["a"] = (Metadata);


/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * Object used to describe an Originator of geoportal resource.
 *
 * @property {String} name - originator name
 * @property {String} attribution - originator full name
 * @property {String} logo - originator logo file URL
 * @property {String} url - originator web site URL
 * @property {Array.<Gp.Services.Config.Constraint>} constraints - where and when the originator applies for the ressource.
 *
 * @namespace
 * @alias Gp.Services.Config.Originator
 */

function Originator () {
    if (!(this instanceof Originator)) {
        throw new TypeError("Originator constructor cannot be called as a function.");
    }

    this.name = null;

    this.attribution = null;

    this.logo = null;

    this.url = null;

    this.constraints = [];
}

Originator.prototype = {

    constructor : Originator

};

/* harmony default export */ __webpack_exports__["a"] = (Originator);


/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * Object used to describe a web service of the geoportal platform.
 *
 * @property {String} title - Web service name
 * @property {Object} serverUrl - Associative array mapping geoportal access key (keys) with their properties (URLs of the web service, with the geoportal access key).
 * @property {String} version - web service version.
 *
 * @namespace
 * @alias Gp.Services.Config.Service
 */
function Service () {
    if (!(this instanceof Service)) {
        throw new TypeError("Service constructor cannot be called as a function.");
    }

    this.title = null;

    this.serverUrl = null;

    this.version = null;
}

Service.prototype = {

    constructor : Service

};

/* harmony default export */ __webpack_exports__["a"] = (Service);


/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * Object used to describe a style that may be used for a geoportal resource.
 *
 * @property {String} name - Style identifier (eg : "normal", "bdparcellaire", ...)
 * @property {String} title - human readable name of the style.
 * @property {Boolean} current - true if this is the default style.
 * @property {String} url - Url Style (eg: vectortile).
 *
 * @namespace
 * @alias Gp.Services.Config.Style
 */

function Style () {
    if (!(this instanceof Style)) {
        throw new TypeError("Style constructor cannot be called as a function.");
    }

    this.name = null;

    this.title = null;

    this.current = null;

    this.url = null;
}

Style.prototype = {

    constructor : Style

};

/* harmony default export */ __webpack_exports__["a"] = (Style);


/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * Object used to describe properties of a french territory covered by geoportal resources.
 *
 * @property {Boolean} isDefault - if this territory is to use by default.
 * @property {String} defaultCRS - Identifier of the coordinates system to use by default for that territory.
 * @property {Array.<String>} additionalCRS - Identifiers of additional coordinates systems availables for that territory.
 * @property {Array.<String>} defaultLayers - Identifiers of layers to load by default for that territory.
 * @property {Object} defaultOptions - options to use by default for that territory.
 * @property {Number} defaultOptions.resolution - resolution to use by default for that territory (in meter per pixel).
 * @property {Number} defaultOptions.minScaleDenominator - minimum scaleDenominator accessible for that territory.
 * @property {Number} defaultOptions.maxScaleDenominator - maximum scaleDenominator accessible for that territory.
 * @property {Gp.BBox} geoBBox - Bounding Box of the territory (expressed in geographical coordinates)
 * @property {Object} geoCenter - center of the territory (expressed in geographical coordinates)
 * @property {Float} geoCenter.lon - center longitude
 * @property {Float} geoCenter.lat - center latitude
 *
 * @namespace
 * @alias Gp.Services.Config.Territory
 */
function Territory () {
    if (!(this instanceof Territory)) {
        throw new TypeError("Territory constructor cannot be called as a function.");
    }

    this.isDefault = null;

    this.defaultCRS = null;

    this.additionalCRS = [];

    this.geoBBOX = {
        left : null,
        right : null,
        top : null,
        bottom : null
    };

    this.geoCenter = {
        lon : null,
        lat : null
    };

    this.defaultOptions = {
        resolution : null,
        minScaleDenominator : null,
        maxScaleDenominator : null
    };

    this.defaultLayers = [];
}

Territory.prototype = {

    constructor : Territory

};

/* harmony default export */ __webpack_exports__["a"] = (Territory);


/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * Object used to describe a thematic
 *
 * @property {String} name - Thematic name
 * @property {Boolean} inspire - true if the thematic name is an [INSPIRE one]{@link http://inspire.ec.europa.eu/index.cfm/pageid/2/list/7}.
 *
 * @namespace
 * @alias Gp.Services.Config.Thematic
 */

function Thematic () {
    if (!(this instanceof Thematic)) {
        throw new TypeError("Thematic constructor cannot be called as a function.");
    }

    this.inspire = null;

    this.name = null;
}

Thematic.prototype = {

    constructor : Thematic

};

/* harmony default export */ __webpack_exports__["a"] = (Thematic);


/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 *
 * Object used to describe a TileMatrix set (for WMTS use).
 *
 * @property {Array.<String>} matrixIds - Array of IDs for each TileMatrix of the set.
 * @property {Array.<Gp.Services.Config.TileMatrix>} tileMatrices - Array of TileMatrix descriptions.
 * @property {Array.<Float>} nativeResolutions - Array of resolutions (in meter per pixel) applying for each TileMatrix of the set.
 * @property {String} projection - Identifier of the Cordinates System used for the tileMatrixSet.
 *
 * @namespace
 * @alias Gp.Services.Config.TileMatrixSet
 */
function TileMatrixSet () {
    if (!(this instanceof TileMatrixSet)) {
        throw new TypeError("TileMatrixSet constructor cannot be called as a function.");
    }

    this.projection = null;

    this.nativeResolutions = [];

    this.matrixIds = [];

    this.tileMatrices = {};
}

TileMatrixSet.prototype = {

    constructor : TileMatrixSet,

    /**
     * Returns Tile Matrix Set resolutions
     *
     * @returns {Array} nativeResolutions - Array of resolutions (in meter per pixel) applying for each TileMatrix of the set.
     */
    getResolutions : function () {
        return this.nativeResolutions;
    },

    /**
     * Returns Tile Matrix Set identifiers
     *
     * @returns {Array} matrixIds - Array of IDs for each TileMatrix of the set.
     */
    getMatrixIds : function () {
        return this.matrixIds;
    },

    /**
     * Returns Tile Matrix Set projection
     *
     * @returns {String} projection - Identifier of the Cordinates System used for the tileMatrixSet.
     */
    getProjection : function () {
        return this.projection;
    },

    /**
     * Returns Tile Matrices descriptions.
     *
     * @returns {Array.<Gp.Services.Config.TileMatrix>} tileMatrices - Array of TileMatrix descriptions.
     */
    getTileMatrices : function () {
        return this.tileMatrices;
    },

    /**
     * Returns top left corner point of matrices
     *
     * @returns {Gp.Point} topLeftCorner - Top Left Corner Point of TMS matrices, expressed in the tileMatrixSet coordinates system.
     */
    getTopLeftCorner : function () {
        var topLeftCorner;
        var matrices = this.getTileMatrices();
        if (matrices) {
            for (var id in matrices) {
                if (matrices.hasOwnProperty(id)) {
                    topLeftCorner = matrices[id].topLeftCorner;
                    break;
                }
            }
        }
        return topLeftCorner;
    }

};

/* harmony default export */ __webpack_exports__["a"] = (TileMatrixSet);


/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * Object used to describe a TileMatrix.
 *
 * @property {String} matrixId - matrix Identifier
 * @property {Number} matrixHeight - Number of tiles from the top to the bottom of the matrix.
 * @property {Number} matrixWidth - Number of tiles from the left to the right of the matrix.
 * @property {Number} scaleDenominator - Scale denominator associated to that matrix.
 * @property {Number} tileHeight - tile height in number of pixels
 * @property {Number} tileWidth - tile width in number of pixels
 * @property {Gp.Point} topLeftCorner - Top Left Corner Point of the matrix expressed in the tileMatrixSet coordinates system.
 *
 * @namespace
 * @alias Gp.Services.Config.TileMatrix
 */

function TileMatrix () {
    if (!(this instanceof TileMatrix)) {
        throw new TypeError("TileMatrix constructor cannot be called as a function.");
    }

    this.matrixId = null;

    this.matrixHeight = null;

    this.matrixWidth = null;

    this.scaleDenominator = null;

    this.tileHeight = null;

    this.tileWidth = null;

    this.topLeftCorner = null;
}

TileMatrix.prototype = {

    constructor : TileMatrix,

    /**
     * Returns top left corner point of the matrix
     *
     * @returns {Gp.Point} topLeftCorner - Top Left Corner Point of the matrix expressed in the tileMatrixSet coordinates system.
     */
    getTopLeftCorner : function () {
        return this.topLeftCorner;
    },

    /**
     * Returns Scale denominator associated to that matrix.
     *
     * @returns {Number} scaleDenominator - Scale denominator associated to that matrix.
     */
    getScaleDenominator : function () {
        return this.scaleDenominator;
    },

    /**
     * Returns tile height of matrix
     *
     * @returns {Number} tileHeight - tile height in number of pixels
     */
    getTileHeight : function () {
        return this.tileHeight;
    },

    /**
     * Returns tile width of matrix
     *
     * @returns {Number} tileWidth - tile width in number of pixels
     */
    getTileWidth : function () {
        return this.tileWidth;
    },

    /**
     * Returns matrix height (number of tiles)
     *
     * @returns {Number} matrixHeight - Number of tiles from the top to the bottom of the matrix.
     */
    getMatrixHeight : function () {
        return this.matrixHeight;
    },

    /**
     * Returns matrix width (number of tiles)
     *
     * @returns {Number} matrixWidth - Number of tiles from the left to the right of the matrix.
     */
    getMatrixWidth : function () {
        return this.matrixWidth;
    }

};

/* harmony default export */ __webpack_exports__["a"] = (TileMatrix);


/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * Object used to describe a layer extent on a Tile Matrix.
 *
 * @property {Number} minTileCol - minimum column index where tile can be found on the Tile matrix.
 * @property {Number} maxTileCol - maximum column index where tile can be found on the Tile matrix.
 * @property {Number} minTileRow - minimum row index where tile can be found on the Tile matrix.
 * @property {Number} maxTileCol - maximum row index where tile can be found on the Tile matrix.
 *
 * @namespace
 * @alias Gp.Services.Config.TileMatrixLimit
 */

function TileMatrixLimit () {
    if (!(this instanceof TileMatrixLimit)) {
        throw new TypeError("TileMatrixLimit constructor cannot be called as a function.");
    }

    this.minTileRow = null;

    this.maxTileRow = null;

    this.minTileCol = null;

    this.maxTileCol = null;
}

/**
 * @lends module:Autoconf/Response/TileMatrixLimit
 */
TileMatrixLimit.prototype = {

    constructor : TileMatrixLimit
};

/* harmony default export */ __webpack_exports__["a"] = (TileMatrixLimit);


/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__AbstractService__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__LocationUtilityService_GeocodeRequest__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__LocationUtilityService_ReverseGeocodeRequest__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__LocationUtilityService_GeocodeFilterExtension__ = __webpack_require__(13);






/**
 * @classdesc
 *
 * Requête de type LocationUtilityService (LUS)
 * (Factory)
 *
 * @example
 * // encapsule un objet dans une coquille XSL, Factory sur les objets Geocode/ReverseGeocode
 * lus = new LocationUtilityService ();
 * lus.addRequest (req);
 * lus.toString();
 *  ou
 * lus = new LocationUtilityService ({
 *      location : "saint mandé",
 *      returnFreeForm : true,
 *      filterOptions : {
 *          type :  ['PositionOfInterest']
 *      }
 * });
 * lus.toString();
 *
 * // out ->
 * // <GeocodeRequest>
 * //   <Address countryCode="PositionOfInterest">
 * //     <freeFormAddress>saint mandé</freeFormAddress>
 * //   </Address>
 * // </GeocodeRequest>
 *
 * // creation de l'objet Geocode
 * req = new GeocodeRequest ();
 * req.addAddress (new Address (/*todo/*));
 * req.toString();
 * // out ->
 * // <GeocodeRequest>
 * //   <Address countryCode="PositionOfInterest">
 * //     <freeFormAddress>saint mandé</freeFormAddress>
 * //   </Address>
 * // </GeocodeRequest>
 *
 * // creation de l'objet ReverseGeocode
 * req = new ReverseGeocodeRequest ();
 * req.addPosition (new Position (position:{x: , y: }));
 * req.addPreference (['StreetAddress']);
 * req.toString();
 * // out ->
 * // <ReverseGeocodeRequest>
 * //     <Position>
 * //       <gml:Point xmlns:gml="http://www.opengis.net/gml">
 * //           <gml:pos>50.347775 3.205098</gml:pos>
 * //       </gml:Point>
 * //     </Position>
 * //     <ReverseGeocodePreference>StreetAddress</ReverseGeocodePreference>
 * //  </ReverseGeocodeRequest>
 *
 * @constructor
 * @alias Gp.Formats.XLS.LocationUtilityService
 * @param {Object} options - options
 * @param {Object}   options.location - location
 * @param {String}   options.position - position : {x : "", y : ""}
 * @param {String}   options.returnFreeForm - true|false
 * @param {Object}   options.filterOptions - filtres
 * @param {Function} options.onsuccess - function callback success (TODO)
 * @param {Function} options.onerror   - function callback error   (TODO)
 *
 * @private
 */
function LocationUtilityService (options) {
    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger();
    this.logger.trace("[Constructeur LocationUtilityService ()]");

    if (!(this instanceof LocationUtilityService)) {
        throw new TypeError("LocationUtilityService constructor cannot be called as a function.");
    }

    /**
     * Nom de la classe
     */
    this.CLASSNAME = "LocationUtilityService";

    /**
     * Type de classe de geocodage
     * ex. GeocodeRequest ou ReverseGeocodeRequest
     */
    this.CLASSTYPE = null;

    // appel du constructeur par heritage
    __WEBPACK_IMPORTED_MODULE_1__AbstractService__["a" /* default */].apply(this, arguments);

    // on determine le type de geocodage si les options sont renseignées
    if (this.options) {
        this.CLASSTYPE = (this.options.location) ? "GeocodeRequest" : (this.options.position) ? "ReverseGeocodeRequest" : null;
    }
}

/**
 * @lends module:LocationUtilityService#
 */
LocationUtilityService.prototype = Object.create(__WEBPACK_IMPORTED_MODULE_1__AbstractService__["a" /* default */].prototype, {
    // todo
    // getter/setter
});

/**
 * Constructeur (alias)
 */
LocationUtilityService.prototype.constructor = LocationUtilityService;

/**
 * (overwrite) Ajout d'un objet de type LUS : GeocodeRequest ou ReverseGeocodeRequest
 *
 * @param {Object} oLUSRequest - objet de type LUS
 */
LocationUtilityService.prototype.addRequest = function (oLUSRequest) {
    // on determine le type de geocodage
    this.CLASSTYPE = oLUSRequest.CLASSNAME;

    // on controle les types acceptés
    switch (this.CLASSTYPE) {
        case "GeocodeRequest":
        case "ReverseGeocodeRequest":
            this.oRequest = oLUSRequest;
            break;
        default:
            throw new Error("Ce n'est pas un objet de type 'LUS Request' !?");
    }
};

/**
 * (overwrite) Ajout d'un objet de type GeocodeFilterExtension
 *
 * @param {Object} oFilter - objet de type Filtre
 */
LocationUtilityService.prototype.addFilter = function (oFilter) {
    // FIXME gestion des filtres à partir des tables de geocodages
    if (oFilter instanceof __WEBPACK_IMPORTED_MODULE_4__LocationUtilityService_GeocodeFilterExtension__["a" /* default */]) {
        this.oFilter = oFilter;
    }
};

/**
 * (overwrite) toString
 *
 * @returns {String} requête
 */
LocationUtilityService.prototype.toString = function () {
    // soit, on a un objet LUS Request déjà instancié
    // sinon, il faut le construire à partir des options à disposition
    if (!this.oRequest) {
        // il nous faut des options
        if (!this.options) {
            throw new Error("Les options ne sont pas renseignées, impossible de construire la requête !");
        }

        // si les options 'location' et 'position' sont renseignées,
        // on prendra par defaut le choix du geocodage direct
        if (this.CLASSTYPE === "GeocodeRequest") {
            var settingsDirect = {
                location : this.options.location,
                returnFreeForm : this.options.returnFreeForm,
                filterOptions : this.options.filterOptions || {}
            };
            this.oRequest = new __WEBPACK_IMPORTED_MODULE_2__LocationUtilityService_GeocodeRequest__["a" /* default */](settingsDirect);
            // ajout des filtres spécifiques au service du geocodage direct de l'IGN
            if (this.oFilter) {
                this.oRequest.addFilter(this.oFilter);
            }
        } else if (this.CLASSTYPE === "ReverseGeocodeRequest") {
            var settingsInv = {
                position : this.options.position,
                returnFreeForm : this.options.returnFreeForm,
                filterOptions : this.options.filterOptions || {}
            };
            this.oRequest = new __WEBPACK_IMPORTED_MODULE_3__LocationUtilityService_ReverseGeocodeRequest__["a" /* default */](settingsInv);
        } else {
            this.logger.error("impossible de determiner le type de geocodage : Direct ou Inverse !?");
        }
    }

    // objet indefini !?
    if (!this.oRequest) {
        throw new Error("Type de Geocodage indefini !");
    }

    this.strRequest = this.oRequest.toString();
    return this.strRequest;
};

/* harmony default export */ __webpack_exports__["a"] = (LocationUtilityService);


/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__GeocodedLocation__ = __webpack_require__(15);



/**
 * Single location object returned by the underlying geocoding web service.
 *
 * @property {Float} accuracy - Accuracy of the response towards the requested location between 0 (unaccurate) and 1 (exact match).
 *
 * @namespace
 * @extends {Gp.Services.Geocode.GeocodedLocation}
 * @alias Gp.Services.Geocode.DirectGeocodedLocation
 */
function DirectGeocodedLocation () {
    if (!(this instanceof DirectGeocodedLocation)) {
        throw new TypeError("DirectGeocodedLocation constructor cannot be called as a function.");
    }

    // INFO
    // appel du constructeur de la classe mère
    // avec passage de param.
    __WEBPACK_IMPORTED_MODULE_0__GeocodedLocation__["a" /* default */].apply(this, arguments);

    /**
     * Nom de la classe (heritage) : "DirectGeocodedLocation"
     * @type {String}
     */
    this.CLASSNAME = "DirectGeocodedLocation";

    this.accuracy = null;
}

DirectGeocodedLocation.prototype = Object.create(__WEBPACK_IMPORTED_MODULE_0__GeocodedLocation__["a" /* default */].prototype);

DirectGeocodedLocation.prototype.constructor = DirectGeocodedLocation;

/* harmony default export */ __webpack_exports__["a"] = (DirectGeocodedLocation);


/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__GeocodedLocation__ = __webpack_require__(15);



/**
 * Single location object returned by the underlying reverse geocoding web service.
 *
 * @property {Float} searchCenterDistance - Distance between the requested point and the location.
 *
 * @namespace
 * @extends {Gp.Services.Geocode.GeocodedLocation}
 * @alias Gp.Services.Geocode.ReverseGeocodedLocation
 */
function ReverseGeocodedLocation () {
    if (!(this instanceof ReverseGeocodedLocation)) {
        throw new TypeError("ReverseGeocodedLocation constructor cannot be called as a function.");
    }

    // INFO
    // appel du constructeur de la classe mère
    // avec passage de param.
    __WEBPACK_IMPORTED_MODULE_0__GeocodedLocation__["a" /* default */].apply(this, arguments);

    /**
     * Nom de la classe (heritage) : "ReverseGeocodedLocation"
     * @type {String}
     */
    this.CLASSNAME = "ReverseGeocodedLocation";

    this.searchCenterDistance = null;
}

ReverseGeocodedLocation.prototype = Object.create(__WEBPACK_IMPORTED_MODULE_0__GeocodedLocation__["a" /* default */].prototype);

ReverseGeocodedLocation.prototype.constructor = ReverseGeocodedLocation;

/* harmony default export */ __webpack_exports__["a"] = (ReverseGeocodedLocation);


/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Response object for {@link module:Services~autoComplete Gp.Services.autoComplete ()} invocation when successful. Received as the argument of onSuccess callback function.
 *
 * @property {Array.<Gp.Services.AutoComplete.SuggestedLocation>} suggestedLocations - SuggestedLocations array.
 *
 * @namespace
 * @alias Gp.Services.AutoCompleteResponse
 */
function AutoCompleteResponse () {
    if (!(this instanceof AutoCompleteResponse)) {
        throw new TypeError("AutoCompleteResponse constructor cannot be called as a function.");
    }

    this.suggestedLocations = [];
}

AutoCompleteResponse.prototype = {

    constructor : AutoCompleteResponse

};

/* harmony default export */ __webpack_exports__["a"] = (AutoCompleteResponse);


/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * Single SuggestedLocation Object returned by underlying web service.
 * Each suggested location represents a street address ("StreetAddress") or a place name ("PositionOfInterest").
 *
 * @property {String} type - Suggested location type : "StreetAddress" ou "PositionOfInterest"
 * @property {Gp.Point} position - Position of the suggested location given in requested coordinates system.
 * @property {String} commune - Suggested municipality
 * @property {String} fullText - Full text representation of the suggested location.
 * @property {String} postalCode - Suggested location postcode
 * @property {Integer} classification - Number used to classify the importance of the place where is the suggested location from 1 (most important) to 7 (less important).
 * @property {String} street - Street name of the suggested location ("StreetAddress" only).
 * @property {String} kind - Nature of the suggested location : "prefecture", "monument", "commune", ... for instance ("PositionOfInterest" only).
 *
 * @namespace
 * @alias Gp.Services.AutoComplete.SuggestedLocation
 */
function SuggestedLocation () {
    if (!(this instanceof SuggestedLocation)) {
        throw new TypeError("SuggestedLocation constructor cannot be called as a function.");
    }

    /* REPONSE :
        {
           "status" : "OK",
           "results" : [
              {
                 "country":"PositionOfInterest",
                 "x":-1.559185,
                 "y":47.952603,
                 "city":"Brie",
                 "zipcode":"35150",
                 "street":"corbe",
                 "kind":"Lieu-dit habité",
                 "fulltext":"corbe, 35150 Brie",
                 "classification":6
              },
              {
                 "country":"StreetAddress",
                 "x":1.538295,
                 "y":43.19646,
                 "city":"Brie",
                 "zipcode":"09700",
                 "street":"courreste",
                 "kind":"",
                 "fulltext":"courreste, 09700 Brie",
                 "classification":7
              }
           ]
        }
    */

    /* REPONSE EN ERREUR
        {
            status : "ERROR",
            results : [ ]
        }
    */

    /**
     * Suggested location type : "StreetAddress" ou "PositionOfInterest"
     * @type {String}
     */
    this.type = null;

    /**
     * Position of the suggested location given in requested coordinates system.
     * @type {Gp.Point}
     */
    this.position = {
        x : null,
        y : null
    };

    /**
     * Suggested municipality
     * @type {String}
     */
    this.commune = null;

    /**
     * Full text representation of the suggested location.
     * @type {String}
     */
    this.fullText = null;

    /**
     * Suggested location postcode
     * @type {Number}
     */
    this.postalCode = null;

    /**
     * Number used to classify the importance of the place where is the suggested location from 1 (most important) to 7 (less important).
     * @type {Integer}
     */
    this.classification = null;

    /**
     * Street name of the suggested location ("StreetAddress" only).
     * @type {String}
     */
    this.street = null;

    /**
     * Place name of the suggested location ("PositionOfInterest" only).
     * @type {String}
     */
    this.poi = null;

    /**
     * Nature of the suggested location : "prefecture", "monument", "commune", ... for instance ("PositionOfInterest" only).
     * @type {String}
     */
    this.kind = null;
}

SuggestedLocation.prototype = {

    constructor : SuggestedLocation
};

/* harmony default export */ __webpack_exports__["a"] = (SuggestedLocation);


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(45);


/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Services_Services__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Services_DefaultUrlService__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Services_Alti_Response_model_AltiResponse__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Services_Alti_Response_model_Elevation__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Services_AutoComplete_Response_model_AutoCompleteResponse__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Services_AutoComplete_Response_model_SuggestedLocation__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Services_AutoConf_Response_model_AutoConfResponse__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Services_AutoConf_Response_model_Constraint__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__Services_AutoConf_Response_model_Format__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__Services_AutoConf_Response_model_Layer__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__Services_AutoConf_Response_model_Legend__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__Services_AutoConf_Response_model_Metadata__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__Services_AutoConf_Response_model_Originator__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__Services_AutoConf_Response_model_Service__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__Services_AutoConf_Response_model_Style__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__Services_AutoConf_Response_model_Territory__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__Services_AutoConf_Response_model_Thematic__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__Services_AutoConf_Response_model_TileMatrix__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__Services_AutoConf_Response_model_TileMatrixLimit__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__Services_AutoConf_Response_model_TileMatrixSet__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__Services_Geocode_Response_model_GeocodeResponse__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__Services_Geocode_Response_model_GeocodedLocation__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__Services_Geocode_Response_model_DirectGeocodedLocation__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__Services_Geocode_Response_model_ReverseGeocodedLocation__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__Services_ProcessIsoCurve_Response_model_ProcessIsoCurveResponse__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__Services_Route_Response_model_RouteResponse__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__Services_Route_Response_model_RouteInstruction__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__Protocols_XHR__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__Exceptions_ErrorService__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__Utils_Helper__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__package_json__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__package_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_30__package_json__);
/**
* Global variable Gp.
*
* @module Gp
* @alias Gp
* @description
*
* This is the global variable that is exposed in the browser environment.
* Content is composed of constructor, functions and properties...
*
* > {@link Gp.Error Error()}
*     - .TYPE_SRVERR : "SERVICE_ERROR"
*     - .TYPE_UNKERR : "UNKNOWN_ERROR"
*     - .TYPE_USEERR : "USAGE_ERROR"
*
* > {@link module:Helper Helper}
*     - .indent()
*     - .normalyzeParameters()
*     - .normalyzeUrl()
*
* > {@link module:XHR Protocols.XHR}
*     - .call()
*
* > {@link module:Services Services (objects)}
*     - .Alti
*         - {@link Gp.Services.Alti.Elevation .Elevation()}
*     - {@link Gp.Services.AltiResponse .AltiResponse()}
*     - .AutoComplete
*         - {@link Gp.Services.AutoComplete.SuggestedLocation .SuggestedLocation()}
*     - {@link Gp.Services.AutoCompleteResponse .AutoCompleteResponse()}
*     - {@link Gp.Services.Config .Config()}
*     - {@link Gp.Services.DefaultUrl .DefaultUrl()}
*     - .Geocode
*         - {@link Gp.Services.Geocode.GeocodedLocation .GeocodedLocation()}
*         - {@link Gp.Services.Geocode.ReverseGeocodedLocation .ReverseGeocodedLocation()}
*         - {@link Gp.Services.Geocode.DirectGeocodedLocation .DirectGeocodedLocation()}
*     - {@link Gp.Services.GeocodeResponse .GeocodeResponse()}
*     - {@link Gp.Services.GetConfigResponse .GetConfigResponse()}
*     - {@link Gp.Services.IsoCurveResponse .IsoCurveResponse()}
*     - .Route
*         - {@link Gp.Services.Route.RouteInstruction .RouteInstruction()}
*     - {@link Gp.Services.RouteResponse .RouteResponse()}
*
* > Services (factory)
*     - {@link module:Services~autoComplete .autoComplete()}
*     - {@link module:Services~geocode .geocode()}
*     - {@link module:Services~getAltitude .getAltitude()}
*     - {@link module:Services~getConfig .getConfig()}
*     - {@link module:Services~isoCurve .isoCurve()}
*     - {@link module:Services~reverseGeocode .reverseGeocode()}
*     - {@link module:Services~route .route()}
*
* > servicesDate : "YYYY-MM-DD"
*
* > servicesVersion : "X.X.X"
*
*/


































/** Version */
const servicesVersion = __WEBPACK_IMPORTED_MODULE_30__package_json___default.a.version;
/* harmony export (immutable) */ __webpack_exports__["servicesVersion"] = servicesVersion;

/** Publication date */
const servicesDate = __WEBPACK_IMPORTED_MODULE_30__package_json___default.a.date;
/* harmony export (immutable) */ __webpack_exports__["servicesDate"] = servicesDate;


// on declare les ns dans root global
var Gp = {};

Gp.servicesVersion = servicesVersion;
Gp.servicesDate = servicesDate;

// Export Protocols
Gp.Protocols = {};
Gp.Protocols.XHR = __WEBPACK_IMPORTED_MODULE_27__Protocols_XHR__["a" /* default */];
// Export services
Gp.Services = __WEBPACK_IMPORTED_MODULE_0__Services_Services__["a" /* default */];
// Export DefaultUrls
Gp.Services.DefaultUrl = __WEBPACK_IMPORTED_MODULE_1__Services_DefaultUrlService__["a" /* default */];
// Export Alti
Gp.Services.AltiResponse = __WEBPACK_IMPORTED_MODULE_2__Services_Alti_Response_model_AltiResponse__["a" /* default */];
Gp.Services.Alti = {};
Gp.Services.Alti.Elevation = __WEBPACK_IMPORTED_MODULE_3__Services_Alti_Response_model_Elevation__["a" /* default */];
// Export Autocomplete
Gp.Services.AutoCompleteResponse = __WEBPACK_IMPORTED_MODULE_4__Services_AutoComplete_Response_model_AutoCompleteResponse__["a" /* default */];
Gp.Services.AutoComplete = {};
Gp.Services.AutoComplete.SuggestedLocation = __WEBPACK_IMPORTED_MODULE_5__Services_AutoComplete_Response_model_SuggestedLocation__["a" /* default */];
// Export Autoconf
Gp.Services.GetConfigResponse = __WEBPACK_IMPORTED_MODULE_6__Services_AutoConf_Response_model_AutoConfResponse__["a" /* default */];
Gp.Services.Config = {};
Gp.Services.Config.Constraint = __WEBPACK_IMPORTED_MODULE_7__Services_AutoConf_Response_model_Constraint__["a" /* default */];
Gp.Services.Config.Format = __WEBPACK_IMPORTED_MODULE_8__Services_AutoConf_Response_model_Format__["a" /* default */];
Gp.Services.Config.Layer = __WEBPACK_IMPORTED_MODULE_9__Services_AutoConf_Response_model_Layer__["a" /* default */];
Gp.Services.Config.Legend = __WEBPACK_IMPORTED_MODULE_10__Services_AutoConf_Response_model_Legend__["a" /* default */];
Gp.Services.Config.Metadata = __WEBPACK_IMPORTED_MODULE_11__Services_AutoConf_Response_model_Metadata__["a" /* default */];
Gp.Services.Config.Originator = __WEBPACK_IMPORTED_MODULE_12__Services_AutoConf_Response_model_Originator__["a" /* default */];
Gp.Services.Config.Service = __WEBPACK_IMPORTED_MODULE_13__Services_AutoConf_Response_model_Service__["a" /* default */];
Gp.Services.Config.Style = __WEBPACK_IMPORTED_MODULE_14__Services_AutoConf_Response_model_Style__["a" /* default */];
Gp.Services.Config.Territory = __WEBPACK_IMPORTED_MODULE_15__Services_AutoConf_Response_model_Territory__["a" /* default */];
Gp.Services.Config.Thematic = __WEBPACK_IMPORTED_MODULE_16__Services_AutoConf_Response_model_Thematic__["a" /* default */];
Gp.Services.Config.TileMatrix = __WEBPACK_IMPORTED_MODULE_17__Services_AutoConf_Response_model_TileMatrix__["a" /* default */];
Gp.Services.Config.TileMatrixLimit = __WEBPACK_IMPORTED_MODULE_18__Services_AutoConf_Response_model_TileMatrixLimit__["a" /* default */];
Gp.Services.Config.TileMatrixSet = __WEBPACK_IMPORTED_MODULE_19__Services_AutoConf_Response_model_TileMatrixSet__["a" /* default */];
// Export Geocode
Gp.Services.GeocodeResponse = __WEBPACK_IMPORTED_MODULE_20__Services_Geocode_Response_model_GeocodeResponse__["a" /* default */];
Gp.Services.Geocode = {};
Gp.Services.Geocode.GeocodedLocation = __WEBPACK_IMPORTED_MODULE_21__Services_Geocode_Response_model_GeocodedLocation__["a" /* default */];
Gp.Services.Geocode.DirectGeocodedLocation = __WEBPACK_IMPORTED_MODULE_22__Services_Geocode_Response_model_DirectGeocodedLocation__["a" /* default */];
Gp.Services.Geocode.ReverseGeocodedLocation = __WEBPACK_IMPORTED_MODULE_23__Services_Geocode_Response_model_ReverseGeocodedLocation__["a" /* default */];
// Export IsoCurve
Gp.Services.IsoCurveResponse = __WEBPACK_IMPORTED_MODULE_24__Services_ProcessIsoCurve_Response_model_ProcessIsoCurveResponse__["a" /* default */];
// Export Route
Gp.Services.RouteResponse = __WEBPACK_IMPORTED_MODULE_25__Services_Route_Response_model_RouteResponse__["a" /* default */];
Gp.Services.Route = {};
Gp.Services.Route.RouteInstruction = __WEBPACK_IMPORTED_MODULE_26__Services_Route_Response_model_RouteInstruction__["a" /* default */];
// Export Erreurs et Outils
Gp.Error = __WEBPACK_IMPORTED_MODULE_28__Exceptions_ErrorService__["a" /* default */];
Gp.Helper = __WEBPACK_IMPORTED_MODULE_29__Utils_Helper__["a" /* default */];

/* harmony default export */ __webpack_exports__["default"] = (Gp);


/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Alti_Alti__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__AutoConf_AutoConf__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Geocode_Geocode__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Geocode_ReverseGeocode__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__AutoComplete_AutoComplete__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Route_Route__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ProcessIsoCurve_ProcessIsoCurve__ = __webpack_require__(97);
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "point|circle|bbox" }] */

/**
* Geoportal web services invocation namespace.
*
* @module Services
* @alias Gp.Services
*/








var Services = {
    /**
     * Access to Geoportal resources metadata availables with one ore several keys, using [Auto-configuration service]{@link https://wxs.ign.fr/APIKEY/autoconf} of the Geoportal platform.
     *
     * @method getConfig
     * @param {Object} options - Options for function call.
     * @param {String} options.apiKey - Access key to Geoportal platform, obtained [here]{@link http://professionnels.ign.fr/ign/contrats}.
     * @param {Function} options.onSuccess - Callback function for getting successful service response. Takes a {@link Gp.Services.GetConfigResponse} object as a parameter except if "rawResponse" parameter is set to true : a String will be returned.
     * @param {Function} [options.onFailure] - Callback function for handling unsuccessful service responses (timeOut, missing rights, ...). Takes a {@link Gp.Error} object as parameter.
     * @param {Number} [options.timeOut=0] - Number of milliseconds above which a timeOut response will be returned with onFailure callback (see above). Default value is 0 which means timeOut will not be handled.
     * @param {String} [options.serverUrl=http (s)://wxs.ign.fr/APIKEY/autoconf] - Web service URL. If used, options.apiKey parameter is ignored. Only use if you know what you're doing.
     * @param {Boolean} [options.ssl = true] - Use of HTTPS or HTTP protocol to request the services. HTTPS by default (ssl=true).
     * @param {String} [options.protocol=JSONP] - Protocol used to handle dialog with web service. Possible values are 'JSONP' ({@link https://en.wikipedia.org/wiki/JSONP}) and 'XHR' ({@link https://en.wikipedia.org/wiki/XMLHttpRequest}). Only XHR protocol is supported in a NodeJS environment. Only use if you know what you're doing.
     * @param {String} [options.proxyURL] - Proxy URL to use when requesting an underlying web service. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you're doing.
     * @param {String} [options.callbackSuffix] - Callback function name suffix to use in case of a JSONP protocol use (see above), to set your own suffix instead of auto-increment. Ignored when options.protocol is set to 'XHR' value. Only use if you know what you're doing.
     * @param {String} [options.httpMethod=GET] - HTTP method to use when requesting underlying web service in case of a XHR protocol use (see above). Possible values are 'GET' and 'POST'. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you are doing.
     * @param {String} [options.contentType="application/xml"] - Content-Type to use when requesting underlying web service in case of a XHR protocol use (see above) and if method HTTP is POST. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you are doing.
     * @param {Boolean} [options.rawResponse=false] - Setting this parameter to true implies you want to handle the service response by yourself : it will be returned as an unparsed String in onSuccess callback parameter. Only use if you know what you are doing.
     * @param {Function} [options.onBeforeParse] - Callback function for handling service response before parsing (as an unparsed String). Takes a String as a parameter (the raw service response). Returns a String that will be parsed as the service response. Only use if you know what you are doing.
     */
    getConfig : function (options) {
        var autoconfService = new __WEBPACK_IMPORTED_MODULE_1__AutoConf_AutoConf__["a" /* default */](options);
        autoconfService.call();
    },

    /**
     * Getting elevations in or along of one or several points on french territories using the [elevation services of the Geoportal Platform]{@link https://geoservices.ign.fr/documentation/geoservices/alti.html}.<br/>
     * Two use cases are availables :<br/>
     * 1. getting elevations of the given points : don't use the options.sampling parameter ;<br/>
     * 2. getting a regular set of elevations along the given points : use the options.sampling parameter.
     *
     * @method getAltitude
     * @param {Object} options - Options for function call.
     * @param {String} options.apiKey - Access key to Geoportal platform, obtained [here]{@link http://professionnels.ign.fr/ign/contrats}.
     * @param {Array.<Object>} options.positions - Array of positions ({lon:float, lat:float}) expressed in CRS:84 coordinates system, where to get elevations. 50 positions maximum may be given. 2 positions minimum are required if you use the options.sampling parameter.
     * @param {Number} [options.sampling] - Number of points to use (between 2 and 5000) in order to compute an elevation path. The points given with the options.positions parameter are used to fix the planimetric path along which the elevations will be computed.<br/>
     * If not used, only elevations of these positions will be returned.
     * @param {Boolean} [options.zonly=false] - Set this parameter to true if you only want to have elevations returned without corresponding coordinates.
     * @param {Function} options.onSuccess - Callback function for getting successful service response. Takes a {@link Gp.Services.AltiResponse} object as a parameter, except if "rawResponse" is set to true.
     * @param {Function} [options.onFailure] - Callback function for handling unsuccessful service responses (timeOut, missing rights, ...). Takes a {@link Gp.Error} object as parameter.
     * @param {Number} [options.timeOut=0] - Number of milliseconds above which a timeOut response will be returned with onFailure callback (see above). Default value is 0 which means timeOut will not be handled.
     * @param {String} [options.serverUrl=http (s)://wxs.ign.fr/APIKEY/alti/rest/elevation.json] - Web service URL. If used, options.apiKey parameter is ignored. Only use if you know what you're doing.
     * @param {Boolean} [options.ssl = true] - Use of HTTPS or HTTP protocol to request the services. HTTPS by default (ssl=true).
     * @param {String} [options.protocol=XHR] - Protocol used to handle dialog with web service. Possible values are 'JSONP' ({@link https://en.wikipedia.org/wiki/JSONP}) and 'XHR' ({@link https://en.wikipedia.org/wiki/XMLHttpRequest}). Only XHR protocol is supported in a NodeJS environment. Only use if you know what you're doing.
     * @param {String} [options.proxyURL] - Proxy URL to use when requesting underlying web service. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you're doing.
     * @param {String} [options.callbackSuffix] - Callback function name suffix to use in case of a JSONP protocol use (see above), to set your own suffix instead of auto-increment. Ignored when options.protocol is set to 'XHR' value. Only use if you know what you're doing.
     * @param {String} [options.httpMethod=GET] - HTTP method to use when requesting underlying web service in case of a XHR protocol use (see above). Possible values are 'GET' and 'POST'. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you are doing.
     * @param {String} [options.contentType="application/xml"] - Content-Type to use when requesting underlying web service in case of a XHR protocol use (see above) and if method HTTP is POST. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you are doing.
     * @param {Boolean} [options.rawResponse=false] - Setting this parameter to true implies you want to handle the service response by yourself : it will be returned as an unparsed String in onSuccess callback parameter. Only use if you know what you are doing.
     * @param {Function} [options.onBeforeParse] - Callback function for handling service response before parsing (as an unparsed String). Takes a String as a parameter (the raw service response). Returns a String that will be parsed as the service response. Only use if you know what you are doing.
     * @param {String} [options.api='REST'] - What API to use for interacting with underlying web service : 'REST' or 'WPS'. Only use if you know what you are doing.
     * @param {String} [options.outputFormat='xml'] - Output format for underlying web service response : 'xml' or 'json'. Only use if you know what you are doing.
     */
    getAltitude : function (options) {
        var altiService = new __WEBPACK_IMPORTED_MODULE_0__Alti_Alti__["a" /* default */](options);
        altiService.call();
    },
    /**
     * Getting positon of a geographic identifier (places names, address, cadastral parcel, other...) using the [geocoding web service of the Geoportal Platform]{@link https://geoservices.ign.fr/documentation/geoservices/geocodage.html}.
     *
     * @example
     * Gp.Services.geocode ({
     *     apiKey : "jhyvi0fgmnuxvfv0zjzorvdn",
     *     location : "73 avenue de Paris, Saint-Mandé",
     *     // traitement des resultats
     *     onSuccess  : function (result) {
     *         console.log("found (x:"+result.position.x+", y:"+result.position.y+")") ;
     *     }
     * }) ;
     *
     *
     * @method geocode
     * @param {Object} options - Options for function call.
     * @param {String} options.apiKey - Access key to Geoportal platform, obtained [here]{@link http://professionnels.ign.fr/ign/contrats}.
     * @param {String|Object} options.location - Geographic identifier to locate. May be provided as a single String or a structured Object for an address search. In this last case, the following properties are availaibles.
     *      @param {Number} [options.location.number] - Street number.
     *      @param {String} [options.location.street] - Street name.
     *      @param {String} [options.location.city] - City name.
     *      @param {Number} [options.location.postalCode] - Postal Code
     * @param {Object} [options.filterOptions] - Additional filters to apply to search. The following properties may be given.
     *      @param {Gp.BBox} [options.filterOptions.bbox] - Bounding box where to perform the search. Properties expressed in options.srs coordinates system.
     *      @param {Array.<String>} [options.filterOptions.type] - Geographical identifier types to search. Values currently availables are : "PositionOfInterest" for place names, "StreetAddress" for address search, "CadastralParcel" for Cadastral parcels search. Default is "StreetAddress".
     *
     *      @param {String} [options.filterOptions.[prop]] - Additionnal properties to filter search. Properties depends on options.filterOptions.type, and values type should be "String".
     *      <br/><br/>
     *      Common Properties availables for all search types :<br/>
     *      "municipality", "insee", "department".
     *      <br/><br/>
     *      Properties availables for address search :<br/>
     *      "quality", "ID", "ID_TR" and "territory".
     *      <br/><br/>
     *      Properties availables for place names search :<br/>
     *      "importance", "nature" and "territory".
     *      <br/><br/>
     *      Properties availables for cadastral parcels search :<br/>
     *      "sheet", "section", and "absorbedcity".
     * @param {Number} [options.maximumResponses = 25] - Maximum number of responses. Default underlying service value applies (25) if not provided.
     * @param {Boolean} [options.returnFreeForm = false] - Set this parameter to true if you wish to have an address returned in a single String (unstructured). If unset, default underlying service value (false) applies.
     * @param {String} [options.srs = EPSG:4326] - Coordinates System used to expres coordinates for parameters and responses. Default underlying service value (EPSG:4326) applies.
     * @param {Function} options.onSuccess - Callback function for getting successful service response. Takes a {@link Gp.Services.GeocodeResponse} object as a parameter except if "rawResponse" is set to true.
     * @param {Function} [options.onFailure] - Callback function for handling unsuccessful service responses (timeOut, missing rights, ...). Takes a {@link Gp.Error} object as parameter.
     * @param {Number} [options.timeOut=0] - Number of milliseconds above which a timeOut response will be returned with onFailure callback (see above). Default value is 0 which means timeOut will not be handled.
     * @param {String} [options.serverUrl=http (s)://wxs.ign.fr/APIKEY/geoportail/ols] - Web service URL. If used, options.apiKey parameter is ignored. Only use if you know what you're doing.
     * @param {Boolean} [options.ssl = true] - Use of HTTPS or HTTP protocol to request the services. HTTPS by default (ssl=true).
     * @param {String} [options.protocol=XHR] - Protocol used to handle dialog with web service. Possible values are 'JSONP' ({@link https://en.wikipedia.org/wiki/JSONP}) and 'XHR' ({@link https://en.wikipedia.org/wiki/XMLHttpRequest}). Only XHR protocol is supported in a NodeJS environment. Only use if you know what you're doing.
     * @param {String} [options.proxyURL] - Proxy URL to use when requesting underlying web service. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you're doing.
     * @param {String} [options.callbackSuffix] - Callback function name suffix to use in case of a JSONP protocol use (see above), to set your own suffix instead of auto-increment. Ignored when options.protocol is set to 'XHR' value. Only use if you know what you're doing.
     * @param {String} [options.httpMethod=GET] - HTTP method to use when requesting underlying web service in case of a XHR protocol use (see above). Possible values are 'GET' and 'POST'. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you are doing.
     * @param {String} [options.contentType="application/xml"] - Content-Type to use when requesting underlying web service in case of a XHR protocol use (see above) and if method HTTP is POST. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you are doing.
     * @param {Boolean} [options.rawResponse=false] - Setting this parameter to true implies you want to handle the service response by yourself : it will be returned as an unparsed String in onSuccess callback parameter. Only use if you know what you are doing.
     * @param {Function} [options.onBeforeParse] - Callback function for handling service response before parsing (as an unparsed String). Takes a String as a parameter (the raw service response). Returns a String that will be parsed as the service response. Only use if you know what you are doing.
     */
    geocode : function (options) {
        var geocodeService = new __WEBPACK_IMPORTED_MODULE_2__Geocode_Geocode__["a" /* default */](options);
        geocodeService.call();
    },
    /**
     * Retrieving geographical identifiers (place names, address, cadastral parcels, ...) near a given position, using the [reverse geocoding web service of the Geoportal Platform]{@link https://geoservices.ign.fr/documentation/geoservices/geocodage-inverse.html}.
     *
     * @method reverseGeocode
     * @param {Object} options - Options for function call.
     * @param {String} options.apiKey - Access key to Geoportal platform, obtained [here]{@link http://professionnels.ign.fr/ign/contrats}.
     * @param {Gp.Point} options.position - Reference position where to search geographical identifiers. Its coordinates are expressed in the coordinates system given with options.srs parameter. (default is CRS:84, that means position.x is the longitude and position.y the latitude)
     * @param {Object} [options.filterOptions] - Additional filters to apply to search. The following properties may be given.
     *      @param {Array.<String>} [options.filterOptions.type] - Geographical identifier types to search. Values currently availables are : "PositionOfInterest" for place names, "StreetAddress" for address search, "CadastralParcel" for Cadastral parcels search. Default is "StreetAddress".
     *      @param {Gp.BBox} [options.filterOptions.bbox] - Bounding box where to perform the search. Expressed in options.srs coordinates system.
     *      @param {Gp.Circle} [options.filterOptions.circle] - Circle where to perform the search. Expressed in options.srs coordinates system.
     * @param {Array.<Gp.Point>} [options.filterOptions.polygon] - Polygon where to perform the search. Expressed in options.srs coordinates system.
     * @param {Number} [options.maximumResponses] - Maximum number of responses. Default underlying service value applies (25) if not provided.
     * @param {Boolean} [options.returnFreeForm = false] - Set this parameter to true if you wish to have an address returned in a single String (unstructured). If unset, default underlying service value (false) applies.
     * @param {String} [options.srs = CRS:84] - Coordinates System used to express coordinates for parameters and responses. Only WGS 84 geographical positioning is supported. Therefore, two values are allowed : "CRS:84" (position.x is the longitude and position.y the latitude) and "EPSG:4326" (position.x is the latitude and position.y the longitude) . Default is CRS:84.
     * @param {Function} options.onSuccess - Callback function for getting successful service response. Takes a {@link Gp.Services.GeocodeResponse} object as a parameter except if "rawResponse" is set to true.
     * @param {Function} [options.onFailure] - Callback function for handling unsuccessful service responses (timeOut, missing rights, ...). Takes a {@link Gp.Error} object as parameter.
     * @param {Number} [options.timeOut=0] - Number of milliseconds above which a timeOut response will be returned with onFailure callback (see above). Default value is 0 which means timeOut will not be handled.
     * @param {String} [options.serverUrl=http (s)://wxs.ign.fr/APIKEY/geoportail/ols] - Web service URL. If used, options.apiKey parameter is ignored. Only use if you know what you're doing.
     * @param {Boolean} [options.ssl = true] - Use of HTTPS or HTTP protocol to request the services. HTTPS by default (ssl=true).
     * @param {String} [options.protocol=XHR] - Protocol used to handle dialog with web service. Possible values are 'JSONP' ({@link https://en.wikipedia.org/wiki/JSONP}) and 'XHR' ({@link https://en.wikipedia.org/wiki/XMLHttpRequest}). Only XHR protocol is supported in a NodeJS environment. Only use if you know what you're doing.
     * @param {String} [options.proxyURL] - Proxy URL to use when requesting underlying web service. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you're doing.
     * @param {String} [options.callbackSuffix] - Callback function name suffix to use in case of a JSONP protocol use (see above), to set your own suffix instead of auto-increment. Ignored when options.protocol is set to 'XHR' value. Only use if you know what you're doing.
     * @param {String} [options.httpMethod=GET] - HTTP method to use when requesting underlying web service in case of a XHR protocol use (see above). Possible values are 'GET' and 'POST'. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you are doing.
     * @param {String} [options.contentType="application/xml"] - Content-Type to use when requesting underlying web service in case of a XHR protocol use (see above) and if method HTTP is POST. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you are doing.
     * @param {Boolean} [options.rawResponse=false] - Setting this parameter to true implies you want to handle the service response by yourself : it will be returned as an unparsed String in onSuccess callback parameter. Only use if you know what you are doing.
     * @param {Function} [options.onBeforeParse] - Callback function for handling service response before parsing (as an unparsed String). Takes a String as a parameter (the raw service response). Returns a String that will be parsed as the service response. Only use if you know what you are doing.
     */
    reverseGeocode : function (options) {
        var reverseGeocodeService = new __WEBPACK_IMPORTED_MODULE_3__Geocode_ReverseGeocode__["a" /* default */](options);
        reverseGeocodeService.call();
    },
    /**
     * Getting suggestions of probable places names or address based on uncomplete texts, using the [autocompletion service of the Geoportal Platform]{@link https://geoservices.ign.fr/documentation/geoservices/autocompletion.html}
     *
     * @method autoComplete
     * @param {Object} options - Options for function call.
     * @param {String} options.apiKey - Access key to Geoportal platform, obtained [here]{@link http://professionnels.ign.fr/ign/contrats}.
     * @param {String} options.text - Text input to complete.
     * @param {Array.<String>} [options.filterOptions.type = "StreetAddress"] - Suggestion types to provide : address ("StreetAddress") and/or place name ("PositionOfInterest").
     * @param {Array.<String>} [options.filterOptions.territory] - Places where to limit the search of suggestions : "METROPOLE" (Corsica and metropolitan France), "DOMTOM" (French overseas departments and territories), or an INSEE code of a department. No limitation by default. For instance : ['METROPOLE', '31']
     * @param {Number} [options.maximumResponses = 10] - Maximum number of responses.
     * @param {Function} options.onSuccess - Callback function for getting successful service response. Takes a {@link Gp.Services.AutoCompleteResponse} object as a parameter except if "rawResponse" is set to true.
     * @param {Function} [options.onFailure] - Callback function for handling unsuccessful service responses (timeOut, missing rights, ...). Takes a {@link Gp.Error} object as parameter.
     * @param {Number} [options.timeOut=0] - Number of milliseconds above which a timeOut response will be returned with onFailure callback (see above). Default value is 0 which means timeOut will not be handled.
     * @param {String} [options.serverUrl=http (s)://wxs.ign.fr/APIKEY/ols/apis/completion] - Web service URL. If used, options.apiKey parameter is ignored. Only use if you know what you're doing.
     * @param {Boolean} [options.ssl = true] - Use of HTTPS or HTTP protocol to request the services. HTTPS by default (ssl=true).
     * @param {String} [options.protocol=XHR] - Protocol used to handle dialog with web service. Possible values are 'JSONP' ({@link https://en.wikipedia.org/wiki/JSONP}) and 'XHR' ({@link https://en.wikipedia.org/wiki/XMLHttpRequest}). Only XHR protocol is supported in a NodeJS environment. Only use if you know what you're doing.
     * @param {String} [options.proxyURL] - Proxy URL to use when requesting underlying web service. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you're doing.
     * @param {String} [options.callbackSuffix] - Callback function name suffix to use in case of a JSONP protocol use (see above), to set your own suffix instead of auto-increment. Ignored when options.protocol is set to 'XHR' value. Only use if you know what you're doing.
     * @param {String} [options.httpMethod=GET] - HTTP method to use when requesting underlying web service in case of a XHR protocol use (see above). Possible values are 'GET' and 'POST'. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you are doing.
     * @param {String} [options.contentType="application/xml"] - Content-Type to use when requesting underlying web service in case of a XHR protocol use (see above) and if method HTTP is POST. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you are doing.
     * @param {Boolean} [options.rawResponse=false] - Setting this parameter to true implies you want to handle the service response by yourself : it will be returned as an unparsed String in onSuccess callback parameter. Only use if you know what you are doing.
     * @param {Function} [options.onBeforeParse] - Callback function for handling service response before parsing (as an unparsed String). Takes a String as a parameter (the raw service response). Returns a String that will be parsed as the service response. Only use if you know what you are doing.
     */
    autoComplete : function (options) {
        var autoCompleteService = new __WEBPACK_IMPORTED_MODULE_4__AutoComplete_AutoComplete__["a" /* default */](options);
        autoCompleteService.call();
    },
    /**
     * Getting a route from one point to another using the [route service of the Geoportal Platform]{@link https://geoservices.ign.fr/documentation/geoservices/itineraires.html}.
     *
     * @method route
     * @param {Object} options - Options for function call.
     * @param {String} options.apiKey - Access key to Geoportal platform, obtained [here]{@link http://professionnels.ign.fr/ign/contrats}.
     * @param {String} [options.routePreference = "fastest"] - Indicates the way to compute the route : "fastest" (time optimisation) or "shortest" (distance optimisation).
     * @param {Gp.Point} options.startPoint - Start point of the route. Expressed in CRS:84 coordinates system (startPoint.x corresponds to longitude, startPoint.y corresponds to latitude).
     * @param {Gp.Point} options.endPoint - End point of the route. Expressed in CRS:84 coordinates system (endPoint.x corresponds to longitude, endPoint.y corresponds to latitude).
     * @param {Array.<Gp.Point>} [options.viaPoints] - Ordered via Points of the route. Expressed in CRS:84 coordinates system (viaPoints[i].x corresponds to longitude, viaPoints[i].y corresponds to latitude).
     * @param {String} [options.graph = "Voiture"] - User profile to use to compute the route : "Voiture" (using a vehicule) or "Pieton" (pedestrian). Has an influence on the kind of roads the route may use and the average speed.
     * @param {Array.<String>} [options.exclusions] - Indicates if route has to avoid some features ("toll", "bridge" or "tunnel").
     * @param {Boolean} [options.geometryInInstructions = false] - Indicates if route geometry has to be also returned with route instructions.
     * @param {Boolean} [options.provideBoundingBox = true] - Indicates if route instructions has to be localised with a BBOX in the response.
     * @param {String} [options.distanceUnit = "km"] - The unit used to provide distances in the response ("m" or "km").
     * @param {Function} options.onSuccess - Callback function for getting successful service response. Takes a {@link Gp.Services.RouteResponse} object as a parameter except if "rawResponse" is set to true.
     * @param {Function} [options.onFailure] - Callback function for handling unsuccessful service responses (timeOut, missing rights, ...). Takes a {@link Gp.Error} object as parameter.
     * @param {Number} [options.timeOut=0] - Number of milliseconds above which a timeOut response will be returned with onFailure callback (see above). Default value is 0 which means timeOut will not be handled.
     * @param {String} [options.outputFormat='json'] - Output format ("json" or "xml") to use for underlying webService. Only use if you know what you are doing.
     * @param {String} [options.serverUrl=http (s)://wxs.ign.fr/APIKEY/itineraire/rest/route.json] - Web service URL. If used, options.apiKey parameter is ignored. Only use if you know what you're doing.
     * @param {Boolean} [options.ssl = true] - Use of HTTPS or HTTP protocol to request the services. HTTPS by default (ssl=true).
     * @param {String} [options.protocol=XHR] - Protocol used to handle dialog with web service. Possible values are 'JSONP' ({@link https://en.wikipedia.org/wiki/JSONP}) and 'XHR' ({@link https://en.wikipedia.org/wiki/XMLHttpRequest}). Only XHR protocol is supported in a NodeJS environment. Only use if you know what you're doing.
     * @param {String} [options.proxyURL] - Proxy URL to use when requesting underlying web service. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you're doing.
     * @param {String} [options.callbackSuffix] - Callback function name suffix to use in case of a JSONP protocol use (see above), to set your own suffix instead of auto-increment. Ignored when options.protocol is set to 'XHR' value. Only use if you know what you're doing.
     * @param {String} [options.httpMethod=GET] - HTTP method to use when requesting underlying web service in case of a XHR protocol use (see above). Possible values are 'GET' and 'POST'. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you are doing.
     * @param {String} [options.contentType="application/xml"] - Content-Type to use when requesting underlying web service in case of a XHR protocol use (see above) and if method HTTP is POST. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you are doing.
     * @param {Boolean} [options.rawResponse=false] - Setting this parameter to true implies you want to handle the service response by yourself : it will be returned as an unparsed String in onSuccess callback parameter. Only use if you know what you are doing.
     * @param {Function} [options.onBeforeParse] - Callback function for handling service response before parsing (as an unparsed String). Takes a String as a parameter (the raw service response). Returns a String that will be parsed as the service response. Only use if you know what you are doing.
     */
    route : function (options) {
        var routeService = new __WEBPACK_IMPORTED_MODULE_5__Route_Route__["a" /* default */](options);
        routeService.call();
    },
    /**
     * Computing a set of places (curve) reachable from a given point (or from where to start to reach a given point) within a time or distance constraint using the [isochrone service of the Geoportal Platform]{@link https://geoservices.ign.fr/documentation/geoservices/isochrones.html}.
     *
     * @method isoCurve
     * @param {Object} options - Options for function call.
     * @param {String} options.apiKey - Access key to Geoportal platform, obtained [here]{@link http://professionnels.ign.fr/ign/contrats}.
     * @param {Gp.Point} options.position - Start or Arrival (options.reverse===true) Point for the computing. Expressed in CRS:84 coordinates system (position.x corresponds to longitude, position.y corresponds to latitude).
     * @param {String} [options.graph = "Voiture"] - User profile to use to compute the isoCurve : "Voiture" (using a vehicule) or "Pieton" (pedestrian). Has an influence on the kind of roads to use and the average speed.
     * @param {Array.<String>} [options.exclusions] - Indicates if route has to avoid some features ("toll", "bridge" or "tunnel").
     * @param {String} [options.method = "time"] - Computing method to use : "time" (using a duration as a constraint) or "distance" (using a distance as a constraint).
     * @param {Float} options.time - Maximum duration (expressed in seconds) to use when options.method is set to "time".
     * @param {Float} options.distance - Maximum distance (expressed in meters) to use when options.method is set to "distance".
     * @param {Boolean} [options.reverse = false] - Set this parameter to true if you want options.position to be the destination (instead of departure) for the computing.
     * @param {Boolean} [options.smoothing = false] - Set this parameter to true if you want the resulting geometry to be smoothed.
     * @param {Boolean} [options.holes = false] - Set this parameter to true if you want the resulting geometry (polygon) to have holes if pertinent.
     * @param {Function} options.onSuccess - Callback function for getting successful service response. Takes a {@link Gp.Services.IsoCurveResponse} object as a parameter except if "rawResponse" is set to true.
     * @param {Function} [options.onFailure] - Callback function for handling unsuccessful service responses (timeOut, missing rights, ...). Takes a {@link Gp.Error} object as parameter.
     * @param {Number} [options.timeOut=0] - Number of milliseconds above which a timeOut response will be returned with onFailure callback (see above). Default value is 0 which means timeOut will not be handled.
     * @param {String} [options.outputFormat='json'] - Output format ("json" or "xml") to use for underlying webService. Only use if you know what you are doing.
     * @param {String} [options.serverUrl=http (s)://wxs.ign.fr/APIKEY/isochrone/isochrone.json] - Web service URL. If used, options.apiKey parameter is ignored. Only use if you know what you're doing.
     * @param {Boolean} [options.ssl = true] - Use of HTTPS or HTTP protocol to request the services. HTTPS by default (ssl=true).
     * @param {String} [options.protocol=XHR] - Protocol used to handle dialog with web service. Possible values are 'JSONP' ({@link https://en.wikipedia.org/wiki/JSONP}) and 'XHR' ({@link https://en.wikipedia.org/wiki/XMLHttpRequest}). Only XHR protocol is supported in a NodeJS environment. Only use if you know what you're doing.
     * @param {String} [options.proxyURL] - Proxy URL to use when requesting underlying web service. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you're doing.
     * @param {String} [options.callbackSuffix] - Callback function name suffix to use in case of a JSONP protocol use (see above), to set your own suffix instead of auto-increment. Ignored when options.protocol is set to 'XHR' value. Only use if you know what you're doing.
     * @param {String} [options.httpMethod=GET] - HTTP method to use when requesting underlying web service in case of a XHR protocol use (see above). Possible values are 'GET' and 'POST'. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you are doing.
     * @param {String} [options.contentType="application/xml"] - Content-Type to use when requesting underlying web service in case of a XHR protocol use (see above) and if method HTTP is POST. Ignored when options.protocol is set to 'JSONP' value. Only use if you know what you are doing.
     * @param {Boolean} [options.rawResponse=false] - Setting this parameter to true implies you want to handle the service response by yourself : it will be returned as an unparsed String in onSuccess callback parameter. Only use if you know what you are doing.
     * @param {Function} [options.onBeforeParse] - Callback function for handling service response before parsing (as an unparsed String). Takes a String as a parameter (the raw service response). Returns a String that will be parsed as the service response. Only use if you know what you are doing.
     */
    isoCurve : function (options) {
        var processIsoCurveService = new __WEBPACK_IMPORTED_MODULE_6__ProcessIsoCurve_ProcessIsoCurve__["a" /* default */](options);
        processIsoCurveService.call();
    }
};

/**
 * Point object.
 *
 * @namespace
 * @alias Gp.Point
 *
 * @property {Float} x - Point abscissa
 * @property {Float} y - Point ordinate
 */
var point = {};

/**
 * Circle object.
 *
 * @namespace
 * @alias Gp.Circle
 *
 * @property {Float} x - Circle center abscissa.
 * @property {Float} y - Circle center ordinate.
 * @property {Float} radius - Circle radius.
 */
var circle = {};

/**
 * Bounding box object, expressed with four coordinates.
 *
 * @namespace
 * @alias Gp.BBox
 *
 * @property {Float} left - minimum abscissa
 * @property {Float} right - maximum abscissa
 * @property {Float} bottom - minimum ordinate
 * @property {Float} top - maximum ordinate
 */
var bbox = {};

/* harmony default export */ __webpack_exports__["a"] = (Services);


/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__CommonService__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__DefaultUrlService__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Request_AltiRequestFactory__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Response_AltiResponseFactory__ = __webpack_require__(59);









/**
 * @classdesc
 *
 * Appel du service d'altimétrie du Géoportail
 *
 * @todo gestion du parma. output et callback
 * @todo outputFormat (REST) et format (WPS)
 * @todo La reponse JSON peut encapsuler un XML !
 *
 * @constructor
 * @extends {Gp.Services.CommonService}
 * @alias Gp.Services.Alti
 * @param {Object} options - options spécifiques au service (+ les options heritées)
 *
 * @param {Array.<Object>} options.positions - Tableau ({lon:float,lat:float}) contenant les coordonnées des points (CRS:84)
 *      dont on veut connaître les altitudes (ou à partir desquelles on va calculer le profil).
 *      Chaque élément du tableau est un objet JavaScript avec deux attributs : lon et lat, qui sont des flottants.
 *      Minimum 2 éléments si on souhaite calculer un profil altimétrique (ElevationLine).
 *      Maximum 50 éléments.
 *
 * @param {String} options.outputFormat - Le format de la réponse du service alti : 'xml' ou 'json'.
 *      Ce paramètre déterminera l'extension '.xml' ou '.json' du service dans le cas de l'API REST,
 *      ou la valeur du paramètre 'format' dans le cas de la norme WPS.
 *      Nécessaire si serverUrl est renseigné, et qu'on souhaite passer par l'API REST,
 *      pour connaître le format dans lequel sera fournie la réponse (pour son traitement).
 *      Non nécessaire pour la norme WPS. Par défaut, ce paramètre vaut 'json'.
 *
 * @param {Number} [options.sampling] - Nombre de points à utiliser pour déterminer le tracé d'un profil altimétrique, compris entre 2 et 5000.
 *      A spécifier lorsqu'on souhaite accéder à cette fonctionnalité.
 *      Dans ce cas, les points fournis en entrée (au minimum de deux) servent à déterminer l'axe planimétrique
 *      le long duquel le profil doit être calculé.
 *      Si le paramètre sampling n'est pas spécifié ou moins de deux points sont fournis,
 *      c'est le service Elevation qui sera interrogé (altitudes simples calculées pour les points fournis).
 *      Une valeur de sampling strictement inférieure à 2 déclenchera un échantillonnage avec la valeur par défaut du service (3 points).
 *
 * @param {String} [options.api] - Manière d'accéder au service : 'REST' (via l'API REST) ou 'WPS' (via la norme WPS).
 *      Par défaut, on utilise l'API REST.
 *
 * @param {Boolean} [options.zonly] - Permet de ne récupérer que les altitudes en sortie s'il vaut 'true'.
 *      Vaut 'false' par défaut.
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
 *      outputFormat : 'json' // json|xml
 *      sampling : 3,
 *      api : 'REST', // REST|WPS
 *      zonly : false // false|true
 *   };
 *
 * @private
 */
function Alti (options) {
    if (!(this instanceof Alti)) {
        throw new TypeError(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("CLASS_CONSTRUCTOR", "Alti"));
    }

    /**
     * Nom de la classe (heritage)
     * FIXME instance ou classe ?
     */
    this.CLASSNAME = "Alti";

    // appel du constructeur par heritage
    __WEBPACK_IMPORTED_MODULE_3__CommonService__["a" /* default */].apply(this, arguments);

    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("Gp.Services.Alti");
    this.logger.trace("[Constructeur Alti (options)]");

    // #####################
    // analyse des options
    // #####################

    if (!options.positions) {
        throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_MISSING", "positions"));
    }

    if (options.positions.length === 0) {
        throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_EMPTY", "positions"));
    }

    // ajout des options spécifiques au service
    this.options.positions = options.positions;

    // format de réponse du service : "json" ou "xml" (valeur par défaut), en minuscule !
    this.options.outputFormat = (typeof options.outputFormat === "string") ? options.outputFormat.toLowerCase() : "xml";

    // sampling
    this.options.sampling = options.sampling || null;

    // type d'api utilisé pour requeter le service, en majuscule !
    this.options.api = (typeof options.api === "string") ? options.api.toUpperCase() : "REST";

    // l'api ne peut être interrogée qu'en GET.
    if (this.options.api === "REST") {
        this.options.httpMethod = "GET";
    }

    // param. zonly
    this.options.zonly = options.zonly || false;

    // gestion de l'url du service par defaut
    // si l'url n'est pas renseignée, il faut utiliser les urls par defaut
    // en fonction du type d'api, REST ou WPS, du format de reponse demandé (outputFormat)
    // ainsi que sur le type de service (profil ou elevation)
    if (!this.options.serverUrl) {
        var lstUrlByDefault = __WEBPACK_IMPORTED_MODULE_4__DefaultUrlService__["a" /* default */].Alti.url(this.options.apiKey);
        var urlFound = null;
        switch (this.options.api) {
            case "WPS":
                urlFound = lstUrlByDefault.wps;
                break;
            case "REST":
                var key = (options.sampling ? "profil" : "elevation") + "-" + this.options.outputFormat;
                urlFound = lstUrlByDefault[key];
                break;
            default:
                throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_UNKNOWN", "api"));
        }

        if (!urlFound) {
            throw new Error("Url by default not found !");
        }
        this.options.serverUrl = urlFound;
        this.logger.trace("Server URL by default : " + this.options.serverUrl);
    }

    // gestion du type de service
    // si l'extension de l'url est .json ou .xml, on surcharge le format de sortie (outputFormat)
    var idx = this.options.serverUrl.lastIndexOf(".");
    if (idx !== -1) {
        var extension = this.options.serverUrl.substring(idx + 1);
        if (extension && extension.length < 5) { // FIXME extension de moins de 4 car. ...
            this.logger.trace("Server Extension URL : " + extension);
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
 * @lends module:Alti#
 */
Alti.prototype = Object.create(__WEBPACK_IMPORTED_MODULE_3__CommonService__["a" /* default */].prototype, {
    // todo
    // getter/setter
});

/**
 * Constructeur (alias)
 */
Alti.prototype.constructor = Alti;

/**
 * Création de la requête (overwrite)
 *
 * @param {Function} error   - callback des erreurs
 * @param {Function} success - callback
 */
Alti.prototype.buildRequest = function (error, success) {
    // utilisation en mode callback
    var options = {
        httpMethod : this.options.httpMethod,
        // callback
        onSuccess : function (result) {
            // sauvegarde de la requete !
            this.request = result;
            success.call(this, this.request);
        },
        onError : error,
        scope : this,
        // spécifique au service :
        positions : this.options.positions,
        outputFormat : this.options.outputFormat,
        sampling : this.options.sampling,
        api : this.options.api,
        zonly : this.options.zonly
    };

    __WEBPACK_IMPORTED_MODULE_5__Request_AltiRequestFactory__["a" /* default */].build(options);
};

/**
 * Analyse de la reponse (overwrite)
 *
 * @param {Function} error   - callback des erreurs
 * @param {Function} success - callback
 */
Alti.prototype.analyzeResponse = function (error, success) {
    // INFO
    // Factory pour masquer la complexité du retour du service qui renvoie soit
    //  - une 'string' qui contient du XML ou JSON natif en mode XHR
    //  - un objet JSON qui est natif ou encapsulé

    if (this.response) {
        var options = {
            response : this.response,
            outputFormat : this.options.outputFormat, // utile pour parser la string en mode XHR : JSON ou XML !
            rawResponse : this.options.rawResponse,
            onError : error,
            onSuccess : success,
            scope : this
        };

        __WEBPACK_IMPORTED_MODULE_6__Response_AltiResponseFactory__["a" /* default */].build(options);
    } else {
        error.call(this, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EMPTY")));
    }
};

/* harmony default export */ __webpack_exports__["a"] = (Alti);


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
* loglevel - https://github.com/pimterry/loglevel
*
* Copyright (c) 2013 Tim Perry
* Licensed under the MIT license.
*/
(function (root, definition) {
    "use strict";
    if (true) {
        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof module === 'object' && module.exports) {
        module.exports = definition();
    } else {
        root.log = definition();
    }
}(this, function () {
    "use strict";

    // Slightly dubious tricks to cut down minimized file size
    var noop = function() {};
    var undefinedType = "undefined";

    var logMethods = [
        "trace",
        "debug",
        "info",
        "warn",
        "error"
    ];

    // Cross-browser bind equivalent that works at least back to IE6
    function bindMethod(obj, methodName) {
        var method = obj[methodName];
        if (typeof method.bind === 'function') {
            return method.bind(obj);
        } else {
            try {
                return Function.prototype.bind.call(method, obj);
            } catch (e) {
                // Missing bind shim or IE8 + Modernizr, fallback to wrapping
                return function() {
                    return Function.prototype.apply.apply(method, [obj, arguments]);
                };
            }
        }
    }

    // Build the best logging method possible for this env
    // Wherever possible we want to bind, not wrap, to preserve stack traces
    function realMethod(methodName) {
        if (methodName === 'debug') {
            methodName = 'log';
        }

        if (typeof console === undefinedType) {
            return false; // No method possible, for now - fixed later by enableLoggingWhenConsoleArrives
        } else if (console[methodName] !== undefined) {
            return bindMethod(console, methodName);
        } else if (console.log !== undefined) {
            return bindMethod(console, 'log');
        } else {
            return noop;
        }
    }

    // These private functions always need `this` to be set properly

    function replaceLoggingMethods(level, loggerName) {
        /*jshint validthis:true */
        for (var i = 0; i < logMethods.length; i++) {
            var methodName = logMethods[i];
            this[methodName] = (i < level) ?
                noop :
                this.methodFactory(methodName, level, loggerName);
        }

        // Define log.log as an alias for log.debug
        this.log = this.debug;
    }

    // In old IE versions, the console isn't present until you first open it.
    // We build realMethod() replacements here that regenerate logging methods
    function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
        return function () {
            if (typeof console !== undefinedType) {
                replaceLoggingMethods.call(this, level, loggerName);
                this[methodName].apply(this, arguments);
            }
        };
    }

    // By default, we use closely bound real methods wherever possible, and
    // otherwise we wait for a console to appear, and then try again.
    function defaultMethodFactory(methodName, level, loggerName) {
        /*jshint validthis:true */
        return realMethod(methodName) ||
               enableLoggingWhenConsoleArrives.apply(this, arguments);
    }

    function Logger(name, defaultLevel, factory) {
      var self = this;
      var currentLevel;
      var storageKey = "loglevel";
      if (name) {
        storageKey += ":" + name;
      }

      function persistLevelIfPossible(levelNum) {
          var levelName = (logMethods[levelNum] || 'silent').toUpperCase();

          if (typeof window === undefinedType) return;

          // Use localStorage if available
          try {
              window.localStorage[storageKey] = levelName;
              return;
          } catch (ignore) {}

          // Use session cookie as fallback
          try {
              window.document.cookie =
                encodeURIComponent(storageKey) + "=" + levelName + ";";
          } catch (ignore) {}
      }

      function getPersistedLevel() {
          var storedLevel;

          if (typeof window === undefinedType) return;

          try {
              storedLevel = window.localStorage[storageKey];
          } catch (ignore) {}

          // Fallback to cookies if local storage gives us nothing
          if (typeof storedLevel === undefinedType) {
              try {
                  var cookie = window.document.cookie;
                  var location = cookie.indexOf(
                      encodeURIComponent(storageKey) + "=");
                  if (location !== -1) {
                      storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
                  }
              } catch (ignore) {}
          }

          // If the stored level is not valid, treat it as if nothing was stored.
          if (self.levels[storedLevel] === undefined) {
              storedLevel = undefined;
          }

          return storedLevel;
      }

      /*
       *
       * Public logger API - see https://github.com/pimterry/loglevel for details
       *
       */

      self.name = name;

      self.levels = { "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3,
          "ERROR": 4, "SILENT": 5};

      self.methodFactory = factory || defaultMethodFactory;

      self.getLevel = function () {
          return currentLevel;
      };

      self.setLevel = function (level, persist) {
          if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
              level = self.levels[level.toUpperCase()];
          }
          if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
              currentLevel = level;
              if (persist !== false) {  // defaults to true
                  persistLevelIfPossible(level);
              }
              replaceLoggingMethods.call(self, level, name);
              if (typeof console === undefinedType && level < self.levels.SILENT) {
                  return "No console available for logging";
              }
          } else {
              throw "log.setLevel() called with invalid level: " + level;
          }
      };

      self.setDefaultLevel = function (level) {
          if (!getPersistedLevel()) {
              self.setLevel(level, false);
          }
      };

      self.enableAll = function(persist) {
          self.setLevel(self.levels.TRACE, persist);
      };

      self.disableAll = function(persist) {
          self.setLevel(self.levels.SILENT, persist);
      };

      // Initialize with the right level
      var initialLevel = getPersistedLevel();
      if (initialLevel == null) {
          initialLevel = defaultLevel == null ? "WARN" : defaultLevel;
      }
      self.setLevel(initialLevel, false);
    }

    /*
     *
     * Top-level API
     *
     */

    var defaultLogger = new Logger();

    var _loggersByName = {};
    defaultLogger.getLogger = function getLogger(name) {
        if (typeof name !== "string" || name === "") {
          throw new TypeError("You must supply a name when creating a logger.");
        }

        var logger = _loggersByName[name];
        if (!logger) {
          logger = _loggersByName[name] = new Logger(
            name, defaultLogger.getLevel(), defaultLogger.methodFactory);
        }
        return logger;
    };

    // Grab the current global log variable in case of overwrite
    var _log = (typeof window !== undefinedType) ? window.log : undefined;
    defaultLogger.noConflict = function() {
        if (typeof window !== undefinedType &&
               window.log === defaultLogger) {
            window.log = _log;
        }

        return defaultLogger;
    };

    defaultLogger.getLoggers = function getLoggers() {
        return _loggersByName;
    };

    return defaultLogger;
}));


/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_Helper__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__XHR__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__JSONP__ = __webpack_require__(54);
/**
 * Interface de dialogue avec les webservices
 *
 * @module Protocols
 * @private
 * @alias Gp.Protocols
 */




var Protocol = {

    /**
     * Interface unique d"envoi d"une requête.
     *
     * @method send
     * @static
     * @param {Object} options - options generales
     * @param {String} options.url      - url du service
     * @param {String} options.method   - GET, POST, PUT, DELETE
     * @param {String} options.protocol - XHR | JSONP
     * @param {String} options.format   - format de la reponse du service : json, xml ou null (brute)...
     * @param {String} options.wrap     - encapsuler la reponse du service dans du JSON : true|false (true par defaut sur le protocole JSONP)
     * @param {String} options.callbackSuffix - suffixe de la fonction de callback (JSONP uniquement) (ex: si callbackSuffix="", la fonction s'appellera "callback")
     * @param {String} options.timeOut  - 0 ms
     * @param {Boolean} options.nocache  - true|false
     * @param {Object|String} options.data        - content (post) ou param (get)
     * @param {Object|String} options.headers     - (post) ex. referer
     * @param {Object|String} options.content - (post) ex. "application/json"
     * @param {String} options.scope       - this (TODO)
     * @param {Function} options.onResponse - callback
     * @param {Function} options.onFailure - callback
     * @param {Function} options.onTimeOut - callback
     * @param {String} options.proxyUrl -  (TODO)
     */
    send : function (options) {
        // INFO
        // "output" - param est interne à la classe "Protocol" (parametrable via "wrap"), et à ajouter à l"url
        //      ce param est independant du service car il est géré par le filtre LUA :
        //          ex. json|xml (json par defaut).
        //          Ce param. permet d"encapsuler du XML dans du JSON :
        //              {http : {status:200, error:null},xml :"réponse du service"}
        //          Utile pour les services qui ne repondent que du XML (ex. Geocodage)
        //
        // |-------------------------------------------------|
        // |      \service |      |     |                    |
        // | output\ format| json | xml |     remarques      |
        // |--------\------|------|-----|--------------------|
        // |    json       | json | json| json/xml encapsulé |
        // |    xml        | json | xml | param inactif      |
        // |-------------------------------------------------|
        // ex. le service demande une reponse native au "format" json et avec un "output" json.
        // on a donc une reponse json encapsulé dans un json : ce qu'on ne souhaite pas !
        // dans ce cas on ne renseigne pas output=json

        // INFO
        // "wrap" - choix d"encapsuler ou non les reponses dans du JSON.
        //      Par defaut, on encapsule uniquement les reponses sur le protocole JSONP (et qui sont en xml) !

        // INFO
        // "callback" - param est interne à la classe "Protocol" (non parametrable), et à ajouter à l"url
        //      ce param est independant du service car il est géré aussi par le filtre LUA :
        //          ex. callback|null
        //          Ce param. permet de renvoyer une reponse javascript :
        //              callback ({http : {status:200, error:null},xml :"réponse du service"})
        //          Ce param. est non renseigné par defaut car pour du JSONP, on utilise le
        //          le protocol JSONP, et ce dernier implemente déjà le callback !

        // settings par defaut
        var settings = options || {
            method : "GET",
            // protocol : "JSONP",
            protocol : "XHR",
            timeOut : 0,
            format : null,
            wrap : true,
            nocache : true,
            output : "json",
            callback : null,
            callbackSuffix : null
        };

        // on determine l'environnement d'execution : browser ou non ?
        // et on stoppe pour nodeJS... sur un protocole JSONP !
        if (typeof window === "undefined" && options.protocol === "JSONP") {
            console.log("Value (s) for parameter (s) 'protocol=JSONP (instead use XHR)' not supported to NodeJS");
            return;
        }

        if (options.protocol === "XHR" || options.format === "json") {
            settings.wrap = false;
        } else if (options.protocol === "JSONP" && options.format === "xml") {
            settings.wrap = true;
        }

        settings.callback = (options.protocol === "JSONP") ? null : null; // FIXME non géré !?
        settings.output = settings.wrap ? "json" : null;

        // on encapsule les reponses dans un objet JSON
        if (settings.wrap) {
            var params = {};
            params.output = settings.output;
            params.callback = settings.callback;
            delete params.callback; // FIXME non géré !?
            settings.url = __WEBPACK_IMPORTED_MODULE_0__Utils_Helper__["a" /* default */].normalyzeUrl(options.url, params);
        }

        // choix de l"implementation :
        // XHR ou JSONP
        switch (settings.protocol) {
            case "XHR":
                // on normalise l'url (gestion du cache)
                if (options.method === "GET" && options.nocache) {
                    settings.url = __WEBPACK_IMPORTED_MODULE_0__Utils_Helper__["a" /* default */].normalyzeUrl(settings.url, {
                        t : new Date().getTime()
                    });
                }
                // appel du service en XHR
                __WEBPACK_IMPORTED_MODULE_1__XHR__["a" /* default */].call(settings);
                break;
            case "JSONP":

                // on normalise l'url si les params. sont renseignés dans la string|object "data"
                if (settings.data) {
                    settings.url = __WEBPACK_IMPORTED_MODULE_0__Utils_Helper__["a" /* default */].normalyzeUrl(settings.url, settings.data);
                }

                // appel du service en JSONP
                __WEBPACK_IMPORTED_MODULE_2__JSONP__["a" /* default */].call(settings);
                break;
            default:
                throw new Error("protocol not supported (XHR|JSONP) !");
        }
    }

};

/* harmony default export */ __webpack_exports__["a"] = (Protocol);


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   v4.2.8+1e68dce6
 */

(function (global, factory) {
	 true ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  var type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

function isFunction(x) {
  return typeof x === 'function';
}



var _isArray = void 0;
if (Array.isArray) {
  _isArray = Array.isArray;
} else {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
}

var isArray = _isArray;

var len = 0;
var vertxNext = void 0;
var customSchedulerFn = void 0;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var vertx = Function('return this')().require('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = void 0;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && "function" === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;


  if (_state) {
    var callback = arguments[_state - 1];
    asap(function () {
      return invokeCallback(_state, child, callback, parent._result);
    });
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve$1(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(2);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
  try {
    then$$1.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then$$1) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then$$1, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return resolve(promise, value);
    }, function (reason) {
      return reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$1) {
  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$1 === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$1)) {
      handleForeignThenable(promise, maybeThenable, then$$1);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function resolve(promise, value) {
  if (promise === value) {
    reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    var then$$1 = void 0;
    try {
      then$$1 = value.then;
    } catch (error) {
      reject(promise, error);
      return;
    }
    handleMaybeThenable(promise, value, then$$1);
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;


  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = void 0,
      callback = void 0,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = void 0,
      error = void 0,
      succeeded = true;

  if (hasCallback) {
    try {
      value = callback(detail);
    } catch (e) {
      succeeded = false;
      error = e;
    }

    if (promise === value) {
      reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
    resolve(promise, value);
  } else if (succeeded === false) {
    reject(promise, error);
  } else if (settled === FULFILLED) {
    fulfill(promise, value);
  } else if (settled === REJECTED) {
    reject(promise, value);
  }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      resolve(promise, value);
    }, function rejectPromise(reason) {
      reject(promise, reason);
    });
  } catch (e) {
    reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

var Enumerator = function () {
  function Enumerator(Constructor, input) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor(noop);

    if (!this.promise[PROMISE_ID]) {
      makePromise(this.promise);
    }

    if (isArray(input)) {
      this.length = input.length;
      this._remaining = input.length;

      this._result = new Array(this.length);

      if (this.length === 0) {
        fulfill(this.promise, this._result);
      } else {
        this.length = this.length || 0;
        this._enumerate(input);
        if (this._remaining === 0) {
          fulfill(this.promise, this._result);
        }
      }
    } else {
      reject(this.promise, validationError());
    }
  }

  Enumerator.prototype._enumerate = function _enumerate(input) {
    for (var i = 0; this._state === PENDING && i < input.length; i++) {
      this._eachEntry(input[i], i);
    }
  };

  Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
    var c = this._instanceConstructor;
    var resolve$$1 = c.resolve;


    if (resolve$$1 === resolve$1) {
      var _then = void 0;
      var error = void 0;
      var didError = false;
      try {
        _then = entry.then;
      } catch (e) {
        didError = true;
        error = e;
      }

      if (_then === then && entry._state !== PENDING) {
        this._settledAt(entry._state, i, entry._result);
      } else if (typeof _then !== 'function') {
        this._remaining--;
        this._result[i] = entry;
      } else if (c === Promise$1) {
        var promise = new c(noop);
        if (didError) {
          reject(promise, error);
        } else {
          handleMaybeThenable(promise, entry, _then);
        }
        this._willSettleAt(promise, i);
      } else {
        this._willSettleAt(new c(function (resolve$$1) {
          return resolve$$1(entry);
        }), i);
      }
    } else {
      this._willSettleAt(resolve$$1(entry), i);
    }
  };

  Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
    var promise = this.promise;


    if (promise._state === PENDING) {
      this._remaining--;

      if (state === REJECTED) {
        reject(promise, value);
      } else {
        this._result[i] = value;
      }
    }

    if (this._remaining === 0) {
      fulfill(promise, this._result);
    }
  };

  Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
    var enumerator = this;

    subscribe(promise, undefined, function (value) {
      return enumerator._settledAt(FULFILLED, i, value);
    }, function (reason) {
      return enumerator._settledAt(REJECTED, i, reason);
    });
  };

  return Enumerator;
}();

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject$1(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {Function} resolver
  Useful for tooling.
  @constructor
*/

var Promise$1 = function () {
  function Promise(resolver) {
    this[PROMISE_ID] = nextId();
    this._result = this._state = undefined;
    this._subscribers = [];

    if (noop !== resolver) {
      typeof resolver !== 'function' && needsResolver();
      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
    }
  }

  /**
  The primary way of interacting with a promise is through its `then` method,
  which registers callbacks to receive either a promise's eventual value or the
  reason why the promise cannot be fulfilled.
   ```js
  findUser().then(function(user){
    // user is available
  }, function(reason){
    // user is unavailable, and you are given the reason why
  });
  ```
   Chaining
  --------
   The return value of `then` is itself a promise.  This second, 'downstream'
  promise is resolved with the return value of the first promise's fulfillment
  or rejection handler, or rejected if the handler throws an exception.
   ```js
  findUser().then(function (user) {
    return user.name;
  }, function (reason) {
    return 'default name';
  }).then(function (userName) {
    // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
    // will be `'default name'`
  });
   findUser().then(function (user) {
    throw new Error('Found user, but still unhappy');
  }, function (reason) {
    throw new Error('`findUser` rejected and we're unhappy');
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
    // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
  });
  ```
  If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
   ```js
  findUser().then(function (user) {
    throw new PedagogicalException('Upstream error');
  }).then(function (value) {
    // never reached
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // The `PedgagocialException` is propagated all the way down to here
  });
  ```
   Assimilation
  ------------
   Sometimes the value you want to propagate to a downstream promise can only be
  retrieved asynchronously. This can be achieved by returning a promise in the
  fulfillment or rejection handler. The downstream promise will then be pending
  until the returned promise is settled. This is called *assimilation*.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // The user's comments are now available
  });
  ```
   If the assimliated promise rejects, then the downstream promise will also reject.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // If `findCommentsByAuthor` fulfills, we'll have the value here
  }, function (reason) {
    // If `findCommentsByAuthor` rejects, we'll have the reason here
  });
  ```
   Simple Example
  --------------
   Synchronous Example
   ```javascript
  let result;
   try {
    result = findResult();
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
  findResult(function(result, err){
    if (err) {
      // failure
    } else {
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findResult().then(function(result){
    // success
  }, function(reason){
    // failure
  });
  ```
   Advanced Example
  --------------
   Synchronous Example
   ```javascript
  let author, books;
   try {
    author = findAuthor();
    books  = findBooksByAuthor(author);
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
   function foundBooks(books) {
   }
   function failure(reason) {
   }
   findAuthor(function(author, err){
    if (err) {
      failure(err);
      // failure
    } else {
      try {
        findBoooksByAuthor(author, function(books, err) {
          if (err) {
            failure(err);
          } else {
            try {
              foundBooks(books);
            } catch(reason) {
              failure(reason);
            }
          }
        });
      } catch(error) {
        failure(err);
      }
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findAuthor().
    then(findBooksByAuthor).
    then(function(books){
      // found books
  }).catch(function(reason){
    // something went wrong
  });
  ```
   @method then
  @param {Function} onFulfilled
  @param {Function} onRejected
  Useful for tooling.
  @return {Promise}
  */

  /**
  `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
  as the catch block of a try/catch statement.
  ```js
  function findAuthor(){
  throw new Error('couldn't find that author');
  }
  // synchronous
  try {
  findAuthor();
  } catch(reason) {
  // something went wrong
  }
  // async with promises
  findAuthor().catch(function(reason){
  // something went wrong
  });
  ```
  @method catch
  @param {Function} onRejection
  Useful for tooling.
  @return {Promise}
  */


  Promise.prototype.catch = function _catch(onRejection) {
    return this.then(null, onRejection);
  };

  /**
    `finally` will be invoked regardless of the promise's fate just as native
    try/catch/finally behaves
  
    Synchronous example:
  
    ```js
    findAuthor() {
      if (Math.random() > 0.5) {
        throw new Error();
      }
      return new Author();
    }
  
    try {
      return findAuthor(); // succeed or fail
    } catch(error) {
      return findOtherAuther();
    } finally {
      // always runs
      // doesn't affect the return value
    }
    ```
  
    Asynchronous example:
  
    ```js
    findAuthor().catch(function(reason){
      return findOtherAuther();
    }).finally(function(){
      // author was either found, or not
    });
    ```
  
    @method finally
    @param {Function} callback
    @return {Promise}
  */


  Promise.prototype.finally = function _finally(callback) {
    var promise = this;
    var constructor = promise.constructor;

    if (isFunction(callback)) {
      return promise.then(function (value) {
        return constructor.resolve(callback()).then(function () {
          return value;
        });
      }, function (reason) {
        return constructor.resolve(callback()).then(function () {
          throw reason;
        });
      });
    }

    return promise.then(callback, callback);
  };

  return Promise;
}();

Promise$1.prototype.then = then;
Promise$1.all = all;
Promise$1.race = race;
Promise$1.resolve = resolve$1;
Promise$1.reject = reject$1;
Promise$1._setScheduler = setScheduler;
Promise$1._setAsap = setAsap;
Promise$1._asap = asap;

/*global self*/
function polyfill() {
  var local = void 0;

  if (typeof global !== 'undefined') {
    local = global;
  } else if (typeof self !== 'undefined') {
    local = self;
  } else {
    try {
      local = Function('return this')();
    } catch (e) {
      throw new Error('polyfill failed because global object is unavailable in this environment');
    }
  }

  var P = local.Promise;

  if (P) {
    var promiseToString = null;
    try {
      promiseToString = Object.prototype.toString.call(P.resolve());
    } catch (e) {
      // silently ignored
    }

    if (promiseToString === '[object Promise]' && !P.cast) {
      return;
    }
  }

  local.Promise = Promise$1;
}

// Strange compat..
Promise$1.polyfill = polyfill;
Promise$1.Promise = Promise$1;

return Promise$1;

})));



//# sourceMappingURL=es6-promise.map

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(51), __webpack_require__(52)))

/***/ }),
/* 51 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 52 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_53__;

/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/**
 * JSONP : Implémentation du protocole JSONP de la plateforme Géoportail
 *
 * @module JSONP
 * @private
 * @alias Gp.Protocols.JSONP
 */


// cf. https://github.com/sobstel/jsonp.js
var JSONP = {

    /**
     * Construction d'un identifiant statique basé sur le timestamp,
     * et qui s'incremente de +1 à chaque appel
     */
    uuid : (function () {
        var id = Math.floor(Date.now());
        return function () {
            return id++;
        };
    })(),

    /**
     * Cette fonction réalise l'appel du service fourni via le paramètre "options.url"
     * en mettant en œuvre le protocole JSONP.
     *
     * @method call
     * @static
     * @param {Object} options - parametres d'invocation du service en JSONP
     * @param {String} options.url - URL du service à invoquer (indépendamment du protocole JSONP).
     *  Cette URL contient déjà les paramètres du service.
     *  Si le paramètre dédié à la mise en oeuvre du protocole JSONP (callback=xxx) n'est pas présent, il est rajouté par la fonction ;
     *  sa valeur est déterminée en fonction du paramètre callbackName.
     * @param {Number} [options.timeOut = 0] - Nombre de ms au bout duquel on considère que le service n'a pas répondu.
     *  Une valeur de 0 pour ce paramètre permet de désactiver la gestion du timeOut.
     * @param {String} [options.callbackSuffix = null] - Suffixe de la fonction de callback à rajouter sur l'URL.
     *  Si aucun suffixe n'est spécifié (cas par défaut), on utilisera l'identifiant this.uuid () comme suffixe. Ex: "callback1458574396582 ()"
     * @param {String} [options.callbackName = gp.protocol.jsonp] - Valeur du paramètre callback à rajouter sur l'URL.
     *  Si l'URL fournie contient déjà le paramètre callback, le paramètre callbackName ne sera pas pris en compte.
     *  La fonction de callback est créée dynamiquement par la fonction JSONP ;
     *  elle a deux fonctions :
     *    elle annule la condition de timeOut
     *    puis appelle la fonction fournie par l'utilisateur via le paramètre onResponse.
     * @param {Function} options.onResponse - Nom de la fonction qui sera appelée lors de la réception des résultats du service.
     *  Ce paramètre sera ignoré si l'URL contient déjà le paramètre callback.
     *  La fonction de rappel appelée sera alors celle ayant pour nom la valeur de ce paramètre.
     * @param {Function} [options.onTimeOut] - Nom de la fonction qui sera appelée en cas de non réponse du service.
     *  Le temps au bout duquel on considère que le service n'a pas répondu est déterminé par le paramètre timeOut.
     *  @example
     *  var options = {
     *      url : 'http://localhost/some/test.json&callback=myResults',
     *      timeOut : 100,
     *      callbackName : 'myResults',
     *      callbackSuffix : "",
     *      onResponse : function (response) {
     *          console.log('results : ', response);
     *      },
     *
     *   };
     *   JSONP.call(options);
     */
    call : function (options) {
        // logger
        var logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("JSONP");
        logger.trace("[JSONP::call ()]");

        // analyse parametres

        if (!options) {
            logger.error("missing parameter : options !");
            throw new Error("missing parameter : options !");
        }

        if (!options.url) {
            logger.error("missing parameter : options.url !");
            throw new Error("missing parameter : options.url !");
        }

        if (!options.timeOut) {
            logger.info("setting 'options.timeOut' default value");
            options.timeOut = 0;
        }

        // FIXME si un callback coté client a été mis en place,
        // cette condition sur cette methode n'a pas de sens !?
        if (!options.onResponse) {
            logger.error("missing parameter : options.onResponse !");
            throw new Error("missing parameter : options.onResponse !");
            // FIXME doit on definir un callback interne par defaut !?
            // options.onResponse = function (data) {
            //    console.log("response callback (inner) : ", data);
            // };
        }

        // ID du callback à utiliser : null ou string.
        // si l'utilisateur a spécifié un suffixe pour le callback, on le récupère comme un ID (ex: options.callbackSuffix = "")
        // sinon, on utilise un timestamp : this.uuid ()
        var callbackId = (typeof options.callbackSuffix === "string") ? options.callbackSuffix : this.uuid();

        // on recherche le parametre callback et son nom de fonction dans l'url
        var urlHasCallbackKey = false;
        var urlHasCallbackName = false;

        var idx = options.url.indexOf("callback=");

        if (idx !== -1) {
            urlHasCallbackKey = true;
            // extraction callbackName de l'url : entre "callback=" et "&" ou fin de ligne
            var j = options.url.indexOf("&", idx);
            if (j === -1) {
                j = options.url.length;
            }

            // on ecrase le parametre options.callbackName s'il avait été défini
            var callbackName = options.url.substring(idx + 9, j);

            if (callbackName) {
                urlHasCallbackName = true;
                options.callbackName = callbackName;
                logger.info("setting 'options.callbackName' value (" + options.callbackName + ") from 'options.url' parameter");
            }
        }

        // on ajoute le parametre callback dans l'URL s'il n'existe pas
        if (!urlHasCallbackKey) {
            // gestion des autres param. et "?"
            var k = options.url.indexOf("?");
            if (k === -1) {
                // aucun param., ni de '?'
                options.url = options.url + "?" + "callback=";
            } else if (k === options.url.length) {
                // uniquement le '?'
                options.url = options.url + "callback=";
            } else {
                // le '?' et les param. existent
                options.url = options.url + "&" + "callback=";
            }
            logger.info("setting callback default key in 'options.url' : " + options.url);
        }

        // utilisation de la fonction callback coté client ?
        var HasCallbackName = options.callbackName ? true : urlHasCallbackName;

        // on ajoute le nom de la fonction callback dans l'URL si elle n'existe pas
        if (!urlHasCallbackName) {
            // fonction callback par defaut
            if (!options.callbackName) {
                logger.info("setting 'options.callbackName' default value");
                options.callbackName = "callback"; // ou "gp.protocol.jsonp" ?
                // info : si on ne veut pas gerer d'ID dans le callback,
                // options.callbackSuffix = ""
                if (callbackId || callbackId === "") {
                    options.callbackName += callbackId;
                }
            }
            options.url = options.url.replace("callback=", "callback=" + options.callbackName);
            logger.info("setting callback function name in 'options.url' : " + options.url);
        }

        // timeOut par defaut
        if (!options.onTimeOut) {
            logger.info("setting 'options.onTimeOut' default value");
            /** callback timeout par defaut */
            options.onTimeOut = function (/* error */) {
                console.log("TimeOut while invoking url : " + options.url);
            };
        }

        if (!HasCallbackName) {
            var self = this;

            // event du timeout
            var onTimeOutTrigger = null;

            // declenche le timeout si > à 0 !
            if (options.timeOut > 0) {
                onTimeOutTrigger = window.setTimeout(
                    function () {
                        /** fonction de reponse du service */
                        window[options.callbackName] = function () {};
                        options.onTimeOut();
                        self._deleteScript(callbackId);
                    }, options.timeOut);
            }

            // FIXME le nom de la fonction n'accepte pas de namespace !
            // ex. Gp.Function.callback
            /**
            * fonction de reponse du service
            * @param {Object} data - data
            * @private
            */
            window[options.callbackName] = function (data) {
                window.clearTimeout(onTimeOutTrigger);
                options.onResponse(data);
                self._deleteScript(callbackId);
            };
        }

        this._createScript(callbackId, options.url);
    },

    /**
    * create Script
    * @param {String} callbackId - callback Id
    * @param {String} url - url
    * @private
    */
    _createScript : function (callbackId, url) {
        var scriptu;
        var scripto = document.getElementById("results" + callbackId);

        scriptu = document.createElement("script");
        scriptu.setAttribute("type", "text/javascript");
        scriptu.setAttribute("src", url);
        scriptu.setAttribute("charset", "UTF-8");
        scriptu.setAttribute("id", "results" + callbackId);
        scriptu.setAttribute("async", "true"); // FIXME async ?
        // head ou body ou autres ?
        var node = document.documentElement || document.getElementsByTagName("head")[0];
        if (scripto === null) {
            node.appendChild(scriptu);
        } else {
            // s'il existe déjà, on le remplace !
            node.replaceChild(scriptu, scripto);
        }
    },

    /**
    * delete Script
    * @param {String} callbackId - callback Id
    * @private
    */
    _deleteScript : function (callbackId) {
        var script = document.getElementById("results" + callbackId);
        if (script) {
            var node = script.parentNode || document.documentElement;
            if (!node) {
                return;
            }
            node.removeChild(script);
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (JSONP);


/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Exceptions_ErrorService__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__AltiRequestREST__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__AltiRequestWPS__ = __webpack_require__(57);
/**
 * Creation d'une requête en REST ou WPS
 * (Factory)
 *
 * @module AltiRequestFactory
 * @alias Gp.Services.Alti.Request.AltiRequestFactory
 * @private
 */





var AltiRequestFactory = {

    /**
     * interface unique
     *
     * @method build
     * @static
     * @param {Object} options - options definies dans le composant Alti
     *
     * @example
     *   var options = {
     *      httpMethod : 'GET', // GET|POST
     *      onSuccess : function (response) {},
     *      onError : function (error) {},
     *      scope : this,
     *      positions : [{lon:, lat:}, {lon:, lat:}],
     *      outputFormat : 'json' // json|xml
     *      sampling : 3,
     *      api : 'REST', // REST|WPS
     *      zonly : false // false|true
     *   };
     *
     */
    build : function (options) {
        // logger
        var logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("AltiRequestFactory");
        logger.trace(["AltiRequestFactory::build()"]);

        var request = null;

        // on factorise les options par groupe;
        // - global,
        // - param, les params pour les data inputs
        // - wps, les param du service
        // - callback

        var settings = {
            // ajout des valeurs par defaut spécifiques au service
            type : options.sampling ? "Profil" : "Elevation",
            method : options.httpMethod,
            param : {
                positions : null,
                delimiter : null, // FIXME par defaut, on ne le met pas en place car ça fait planter la requête !?
                indent : null, // par defaut
                crs : null, // par defaut
                format : null, // (only to POST)
                sampling : null, // (only use by Profil)
                zonly : null // (only use by Elevation)
            }
        };

        // surcharge des valeurs obligatoires
        settings.param.positions = options.positions;
        settings.param.format = options.outputFormat;
        settings.param.sampling = options.sampling;
        settings.param.zonly = options.zonly;

        // gestion des callback
        var bOnError = !!((options.onError !== null && typeof options.onError === "function"));
        var bOnSuccess = !!((options.onSuccess !== null && typeof options.onSuccess === "function"));

        var message = null;
        switch (options.api) {
            case "REST":
                // FIXME les exceptions ne sont pas 'catchées' sur le constructeur !
                var myReq = new __WEBPACK_IMPORTED_MODULE_2__AltiRequestREST__["a" /* default */](settings);
                if (!myReq.processRequestString()) {
                    message = "Error in process request (rest) !";
                    if (bOnError) {
                        options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_1__Exceptions_ErrorService__["a" /* default */](message));
                        return;
                    }
                    throw new Error(message);
                }
                request = myReq.requestString;
                break;
            case "WPS":
                // ajout des valeurs par defaut spécifiques au service WPS
                settings.wps = {
                    service : null, // par defaut
                    version : null, // par defaut
                    identifier : null, // par defaut
                    rawdataoutput : null, // par defaut
                    request : null // par defaut
                };

                request = __WEBPACK_IMPORTED_MODULE_3__AltiRequestWPS__["a" /* default */].build(settings);
                if (!request) {
                    message = "Error in process request (wps) !";
                    if (bOnError) {
                        options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_1__Exceptions_ErrorService__["a" /* default */](message));
                        return;
                    }
                    throw new Error(message);
                }
                break;
            default:
                message = "Type of API is not supported by service (REST or WPS) !";
                if (bOnError) {
                    options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_1__Exceptions_ErrorService__["a" /* default */](message));
                    return;
                }
                throw new Error(message);
        }

        if (bOnSuccess) {
            options.onSuccess.call(options.scope, request);
        }

        return request;
    }
};

/* harmony default export */ __webpack_exports__["a"] = (AltiRequestFactory);


/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__model_AltiElevationRequest__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__model_AltiProfilRequest__ = __webpack_require__(24);
/* jshint multistr : true */






/**
 * @classdesc
 * Classe de gestion des requêtes de type REST sur le service altimetrique.
 *
 * @todo Le service Alti n'implemente pas le POST !?
 * @constructor
 * @alias Gp.Services.Alti.Request.AltiRequestREST
 * @param {Object} options - options
 * @param {Object}   options.param.positions - tableau de coordonnées lon/lat
 * @param {String}   options.param.delimiter - '|'
 * @param {Boolean}  options.param.indent - false|true
 * @param {String}   options.param.crs - 'CRS:84'
 * @param {String}   options.param.sampling - 3
 * @param {Boolean}  options.param.zonly - false|true
 * @param {String}   options.param.format - "JSON|XML"
 * @param {String}   options.type - "Profil|Elevation"
 * @param {String}   options.method - GET|POST
 *
 * @example
 *      var options = {
 *           type : 'Profil', // Elevation
 *           method : 'GET',  // par defaut
 *           param : {
 *               positions : [
 *                   {lon:'1.11', lat:'1.11'},
 *                   {lon:'1.10', lat:'1.10'},
 *                   {lon:'1.12', lat:'1.12'}
 *               ],
 *               delimiter : ";",         // par defaut
 *               indent    : true,        // par defaut
 *               crs       : 'EPSG:4326', // par defaut
 *               format    : 'json',      // par defaut (only to POST)
 *               sampling  : 3 ,          // par defaut (only use by Profil)
 *               zonly     : false        // par defaut (only use by Elevation)
 *           }
 *      };
 *
 *      var result;
 *      try {
 *          var obj = new AltiRequestREST (options);
 *          if (! obj.processRequestString ()) {
 *              throw new Error("Request empty !?")
 *          }
 *          result = obj.requestString;
 *      } catch (e) {
 *          // exceptions...
 *      }
 * @private
 */
function AltiRequestREST (options) {
    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("AltiRequestREST");
    this.logger.trace("[Constructeur AltiRequestREST ()]");

    if (!(this instanceof AltiRequestREST)) {
        throw new TypeError("AltiRequestREST constructor cannot be called as a function.");
    }

    this.options = options || {};

    // existance des options
    if (!this.options) {
        throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_EMPTY", "options"));
    }

    // type de requete : Altitude ou Profil
    // (param. à determiner en fonction des parametres d'entrée)
    if (!this.options.type) {
        throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_EMPTY", "type (Elevation or Profil)"));
    }

    // construction du modele de requête
    // (test du type d'objet candidat)
    this.DataObject = null;
    switch (this.options.type) {
        case "Elevation":
            this.DataObject = new __WEBPACK_IMPORTED_MODULE_2__model_AltiElevationRequest__["a" /* default */](this.options.param);
            break;
        case "Profil":
            this.DataObject = new __WEBPACK_IMPORTED_MODULE_3__model_AltiProfilRequest__["a" /* default */](this.options.param);
            break;
        default:
            throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_TYPE", "type (Elevation or Profil)"));
    }

    /**
     * methode.
     * Par defaut, "GET".
     */
    this.method = this.options.method || "GET";
}

AltiRequestREST.prototype = {

    /**
     * request
     * @type {String}
     */
    requestString : null,

    /**
     * Constructeur (alias)
     */
    constructor : AltiRequestREST,

    /**
     * Template de la requête.
     */
    template : {
        get : {
            // FIXME on retire le param 'delimiter' : &delimiter='__DELIMITER__'
            value : "lon=__LON__&lat=__LAT__&indent=__INDENT__&crs='__CRS__'",
            input : {
                point : "&zonly=__ZONLY__",
                profil : "&sampling=__SAMPLING__"
            }
        },
        post : {
            // FIXME on retire le param 'delimiter' : delimiter='__DELIMITER__'\n\
            value : "lon=__LON__\n" +
                "lat=__LAT__\n" +
                "indent=__INDENT__\n" +
                "crs='__CRS__'\n",
            input : {
                point : "zonly=__ZONLY__",
                profil : "sampling=__SAMPLING__"
            }
        }
    },

    /**
     * Construction de la requête.
     *
     * @example
     * // GET  out : lon=0.2367,2.1570&lat=48.0551,46.6077&delimiter=,&indent=true&zonly=true&crs='CRS:84'
     * // POST out : Not yet supported method POST !
     * @returns {String}
     */
    processRequestString : function () {
        this.logger.trace("AltiRequestREST::processRequestString ()");

        var template = "";
        if (this.method === "POST") {
            template = this.template.post.value;
        } else if (this.method === "GET") {
            template = this.template.get.value;
        }

        template = template.replace(/__LON__/g, this.DataObject.getLon());
        template = template.replace(/__LAT__/g, this.DataObject.getLat());
        // FIXME on retire le param 'delimiter'
        // template = template.replace(/__DELIMITER__/g, this.DataObject.delimiter);
        template = template.replace(/__INDENT__/g, this.DataObject.indent);
        template = template.replace(/__CRS__/g, this.DataObject.crs);

        // ajout +
        template = template + this.__addDataInputs();
        this.logger.trace("traduction tmpl", template);

        // sauvegarde
        this.requestString = template;

        return this.requestString;
    },

    /**
     * Ajout de parametres spécifiques (ex. zonly)
     *
     * @returns {String}
     */
    __addDataInputs : function () {
        this.logger.trace("AltiRequestREST::addDataInput ()");

        var myTemplate;
        if (this.method === "POST") {
            myTemplate = this.template.post;
        } else if (this.method === "GET") {
            myTemplate = this.template.get;
        } else {
            throw new Error("No other HTTP method supported by the service !");
        }

        var tmpl = null;
        if (this.DataObject.CLASSNAME === "AltiElevationRequest") {
            tmpl = myTemplate.input.point;
            return tmpl.replace(/__ZONLY__/g, this.DataObject.zonly);
        } else if (this.DataObject.CLASSNAME === "AltiProfilRequest") {
            tmpl = myTemplate.input.profil;
            return tmpl.replace(/__SAMPLING__/g, this.DataObject.sampling);
        } else {
            throw new Error("No other object supported than elevation or profil !?");
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (AltiRequestREST);


/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Formats_WPS__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__model_AltiElevationRequest__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__model_AltiProfilRequest__ = __webpack_require__(24);
/**
 * Classe d'interface des requêtes de type WPS sur le service altimetrique.
 * (Factory)
 *
 * @module Gp.Services.Alti.Request.AltiRequestWPS
 * @alias Gp.Services.Alti.Request.AltiRequestWPS
 * @private
 */






var AltiRequestWPS = {

    /**
     * Interface unique de construction de la requête.
     *
     * @method build
     * @param {Object} options - options
     * @param {Object}   options.param.positions - tableau de coordonnées lon/lat
     * @param {String}   options.param.delimiter - '|'
     * @param {Boolean}  options.param.indent - false|true
     * @param {String}   options.param.crs - 'CRS:84'
     * @param {String}   options.param.sampling - 3
     * @param {Boolean}  options.param.zonly - false|true
     * @param {String}   options.param.format - "JSON|XML" (only to POST)
     * @param {String}   options.wps.service - "WPS"
     * @param {String}   options.wps.version - "1.0.0"
     * @param {String}   options.wps.identifier - "gs:WPSElevation|gs:WPSLineElevation"
     * @param {String}   options.wps.rawdataoutput - "result"
     * @param {String}   options.wps.request - "Execute"
     * @param {String}   options.type - "Profil|Elevation"
     * @param {String}   options.method - GET|POST
     * @example
     *      var options = {
     *           type : 'Profil', // Elevation
     *           method : 'GET',  // par defaut
     *           param : {
     *               positions : [
     *                   {lon:'1.11', lat:'1.11'},
     *                   {lon:'1.10', lat:'1.10'},
     *                   {lon:'1.12', lat:'1.12'}
     *               ],
     *               delimiter : ";",         // par defaut
     *               indent    : true,        // par defaut
     *               crs       : 'EPSG:4326', // par defaut
     *               format    : 'json',      // par defaut (only to POST)
     *               sampling  : 3 ,          // par defaut (only use by Profil)
     *               zonly     : false,       // par defaut (only use by Elevation)
     *           },
     *           wps : {
     *                 service : 'WPS',         // par defaut
     *                 version : '1.0.0',       // par defaut
     *                 identifier : 'gs:WPS',   // par defaut, Elevation = gs:WPSElevation, Profil = gs:WPSLineElevation
     *                 rawdataoutput : 'result',// par defaut
     *                 request : 'Execute'      // par defaut
     *           }
     *       };
     */
    build : function (options) {
        // logger
        var logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("AltiRequestWPS");
        logger.trace(["AltiRequestWPS::build()"]);

        // existance des options
        if (!options) {
            throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_EMPTY", "options"));
        }

        // type de requete : Altitude ou Profil
        // (param. à determiner en fonction des parametres d'entrée)
        if (!options.type) {
            throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_EMPTY", "type (Elevation or Profil)"));
        }

        // construction du modele de requête
        // (test du type d'objet candidat)
        var DataObject = null;
        switch (options.type) {
            case "Elevation":
                // surcharge
                options.wps.identifier = "gs:WPSElevation";
                DataObject = new __WEBPACK_IMPORTED_MODULE_3__model_AltiElevationRequest__["a" /* default */](options.param);
                break;
            case "Profil":
                // surcharge
                options.wps.identifier = "gs:WPSLineElevation";
                DataObject = new __WEBPACK_IMPORTED_MODULE_4__model_AltiProfilRequest__["a" /* default */](options.param);
                break;
            default:
                throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_TYPE", "type (Elevation or Profil)"));
        }

        // construction de la requête WPS
        var settings = {
            data : DataObject,
            method : options.method,
            param : options.wps
        };

        var rqstWPS = new __WEBPACK_IMPORTED_MODULE_2__Formats_WPS__["a" /* default */](settings);

        if (!rqstWPS.processRequestString()) {
            throw new Error("Enable to process request !");
        }

        return rqstWPS.requestString;
    }
};

/* harmony default export */ __webpack_exports__["a"] = (AltiRequestWPS);


/***/ }),
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);


/**
 * @classdesc
 * Standard WPS
 *
 * @constructor
 * @alias Gp.Formats.WPS
 * @param {Object} options - options
 * @param {Object}   options.data - objet
 * @param {String}   options.method - POST|GET
 * @param {String}   options.param.service - "WPS"
 * @param {String}   options.param.version - "1.0.0"
 * @param {String}   options.param.identifier - "gs:WPSElevation|gs:WPSLineElevation"
 * @param {String}   options.param.rawdataoutput - "result"
 * @param {String}   options.param.request - "Execute"
 * @param {Function} options.onsuccess - function callback success (TODO)
 * @param {Function} options.onerror   - function callback error   (TODO)
 * @private
 */
function WPS (options) {
    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger();
    this.logger.trace("[Constructeur WPS()]");

    if (!(this instanceof WPS)) {
        throw new TypeError("WPS constructor cannot be called as a function.");
    }

    this.options = options || {};

    /**
     * Objet DATA
     */
    this.DataObject = this.options.data;

    if (!this.DataObject) {
        throw new TypeError("This data object is not defined !");
    }

    /**
     * param service.
     * Par defaut, "WPS".
     */
    this.paramservice = this.options.param.service || "WPS";

    /**
     * param version.
     * Par defaut, "1.0.0".
     */
    this.paramversion = this.options.param.version || "1.0.0";

    /**
     * param identifier
     * Par defaut, "gs:WPS"
     */
    this.paramidentifier = this.options.param.identifier || "gs:WPS";

    /**
     * param rawdataoutput
     * Par defaut, "result".
     */
    this.paramrawdataoutput = this.options.param.rawdataoutput || "result";

    /**
     * param request
     * Par defaut, "Execute".
     */
    this.paramrequest = this.options.param.request || "Execute";

    /**
     * methode.
     * Par defaut, "GET".
     */
    this.method = this.options.method || "GET";
}

WPS.prototype = {

    /**
     * @lends module:WPS#
     */

    /**
     * request
     * @type {String}
     */
    requestString : null,

    /**
     * Constructeur (alias)
     */
    constructor : WPS,

    /**
     * Template de la requête.
     */
    template : {
        get : {
            value : "service=__SERVICE__" +
                "&version=__VERSION__" +
                "&rawdataoutput=__RAWDATAOUTPUT__" +
                "&identifier=__IDENTIFIER__" +
                "&request=__REQUEST__" +
                "&datainputs=<!-- __DATAINPUTS__ -->",

            input : "__KEY__=__DATA__"

        },
        post : {

            value : "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<wps:__REQUEST__ version=\"__VERSION__\" service=\"__SERVICE__\" " +
                "__NAMESPACE__ __SCHEMALOCATION__>" +
                "<ows:Identifier>__IDENTIFIER__</ows:Identifier>" +
                "<wps:DataInputs>" +
                "<!-- __DATAINPUTS__ -->" +
                "</wps:DataInputs>" +
                "<wps:ResponseForm>" +
                "<wps:RawDataOutput>" +
                "<ows:Identifier>__RAWDATAOUTPUT__</ows:Identifier>" +
                "</wps:RawDataOutput>" +
                "</wps:ResponseForm>" +
                "</wps:__REQUEST__>",

            input : "<wps:Input>" +
                "<ows:Identifier>__KEY__</ows:Identifier>" +
                "<wps:Data>" +
                "<wps:LiteralData>__DATA__</wps:LiteralData>" +
                "</wps:Data>" +
                "</wps:Input>"
        }
    },

    /**
     * Namespace par defaut de la requete POST.
     *
     * @returns {String} namespace
     */
    namespaceByDefault : function () {
        var ns = [
            "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"",
            "xmlns=\"http://www.opengis.net/wps/1.0.0\"",
            "xmlns:wfs=\"http://www.opengis.net/wfs\"",
            "xmlns:wps=\"http://www.opengis.net/wps/1.0.0\"",
            "xmlns:ows=\"http://www.opengis.net/ows/1.1\"",
            "xmlns:gml=\"http://www.opengis.net/gml\"",
            "xmlns:ogc=\"http://www.opengis.net/ogc\"",
            "xmlns:wcs=\"http://www.opengis.net/wcs/1.1.1\"",
            "xmlns:xlink=\"http://www.w3.org/1999/xlink\""
        ];

        return ns.join(" ");
    },

    /**
     * Schemalocation par defaut.
     *
     * @returns {String} schemaLocation
     */
    schemaLocationByDefault : function () {
        return "xsi:schemaLocation=\"http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd\"";
    },

    /**
     * Construction de la requête.
     *
     * @example
     * // GET  out :
     * //  service=__SERVICE__
     * //  &version=__VERSION__
     * //  &rawdataoutput=__RAWDATAOUTPUT__
     * //  &identifier=__IDENTIFIER__
     * //  &request=__REQUEST__
     * //  &datainputs="__DATAINPUTS__"
     * //  avec __DATAINPUTS__ = __KEY__=__DATA__;...
     *
     * // POST out :
     * //      <?xml version=\"1.0\" encoding=\"UTF-8\"?>
     * //      <wps:__REQUEST__ version=\"__VERSION__\" service=\"__SERVICE__\"
     * //         __NAMESPACE__ __SCHEMALOCATION__>
     * //          <ows:Identifier>__IDENTIFIER__</ows:Identifier>
     * //          <wps:DataInputs>
     * //              <!-- __DATAINPUTS__ -->
     * //          </wps:DataInputs>
     * //          <wps:ResponseForm>
     * //              <wps:RawDataOutput>
     * //              <ows:Identifier>__RAWDATAOUTPUT__</ows:Identifier>
     * //              </wps:RawDataOutput>
     * //          </wps:ResponseForm>
     * //      </wps:__REQUEST__>",
     * //      avec __DATAINPUTS__
     * //             <wps:Input>
     * //                  <ows:Identifier>__KEY__</ows:Identifier>
     * //                  <wps:Data>
     * //                    <wps:LiteralData>__DATA__</wps:LiteralData>
     * //                  </wps:Data>
     * //              </wps:Input>
     *
     * @returns {Boolean} validation de la construction de la requete
     */
    processRequestString : function () {
        this.logger.trace("WPS::processRequestString ()");

        var template = "";
        if (this.method === "POST") {
            template = this.template.post.value;
        } else if (this.method === "GET") {
            template = this.template.get.value;
        } else {
            this.logger.error("No other method supported by the service !");
            return false;
        }

        template = template.replace(/__SERVICE__/g, this.paramservice);
        template = template.replace(/__VERSION__/g, this.paramversion);
        template = template.replace(/__RAWDATAOUTPUT__/g, this.paramrawdataoutput);
        template = template.replace(/__IDENTIFIER__/g, this.paramidentifier);
        template = template.replace(/__REQUEST__/g, this.paramrequest);

        // ajout +
        if (this.method === "POST") {
            template = template.replace(/__NAMESPACE__/g, this.namespaceByDefault);
            template = template.replace(/__SCHEMALOCATION__/g, this.schemaLocationByDefault);
        }

        // ajout des datainputs
        template = template.replace(/<!-- __DATAINPUTS__ -->/g, this.__addDataInputs());

        if (!template) {
            this.logger.warn("traduction tmpl : empty request !?");
            return false;
        }

        this.requestString = template;
        this.logger.trace("traduction tmpl", template);

        return true;
    },

    /**
     * Ajout des données
     *
     * @returns {String} Données concaténées dans une chaine
     */
    __addDataInputs : function () {
        this.logger.trace("WPS::__addDataInputs ()");

        // c'est un peu grossier...
        var tmpl = this.method === "GET" ? this.template.get.input : this.template.post.input;
        var sep = this.method === "GET" ? ";" : "";

        var result = "";
        var that = this;
        var map = this.DataObject.getData();
        for (var i = 0; i < map.length; i++) {
            // FIXME closure ?
            (function (j) {
                if (sep) {
                    sep = (j === map.length - 1) ? "" : ";";
                }
                result = result.concat(that.__addDataInput(tmpl, map[j].k, map[j].v), sep);
            })(i);
        }

        return result;
    },

    /**
     * Ajout d'une donnée.
     *
     * @param {String} tmpl - template
     * @param {String} key - clef
     * @param {String} data - valeur
     * @returns {String} chaine avec les substitutions clef/valeur
     */
    __addDataInput : function (tmpl, key, data) {
        var tmp = tmpl;
        tmp = tmp.replace(/__KEY__/g, key);
        tmp = tmp.replace(/__DATA__/g, data);
        return tmp;
    },

    /**
     * Definir le mode de requête
     *
     * @param {String} method - GET|POST
     */
    setMethod : function (method) {
        if (method === "GET" || method === "POST") {
            this.method = method;
        } else {
            this.logger.warn("support only GET and POST method !");
        }
    },

    /**
     * Retourne le mode de requete (GET|POST).
     *
     * @returns {AltiRequest.options.mode|String} methode (GET|POST)
     */
    getMethod : function () {
        return this.method;
    }
};

/* harmony default export */ __webpack_exports__["a"] = (WPS);


/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Formats_XML__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Formats_AltiResponseReader__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__model_AltiResponse__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__model_Elevation__ = __webpack_require__(10);
/**
 * Factory pour générer une reponse JSON à partir d'un XML ou d'un JSON
 * (Factory)
 *
 * @module AltiResponseFactory
 * @private
 * @alias Gp.Services.Alti.Response.AltiResponseFactory
 */








var AltiResponseFactory = {

    /**
     * interface unique
     *
     * @method build
     * @static
     * @param {Object} options - options definies dans le composant Alti
     *
     * @example
     *   var options = {
     *      response :
     *      outputFormat :
     *      rawResponse :
     *      scope :
     *      onSuccess :
     *      onError :
     *   };
     *
     */
    build : function (options) {
        // logger
        var logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("AltiResponseFactory");
        logger.trace(["AltiResponseFactory::build()"]);

        var data = null;

        if (options.response) {
            if (options.rawResponse) {
                logger.trace("analyze response : raw");
                data = options.response;
            } else {
                switch (options.outputFormat) {
                    case "xml":
                        logger.trace("analyze response : xml");

                        try {
                            var p = new __WEBPACK_IMPORTED_MODULE_3__Formats_XML__["a" /* default */]({
                                reader : __WEBPACK_IMPORTED_MODULE_4__Formats_AltiResponseReader__["a" /* default */]
                            });

                            if (typeof options.response === "string") {
                                p.setXMLString(options.response);
                            } else {
                                p.setXMLDoc(options.response);
                            }

                            data = p.parse();

                            if (!data) {
                                throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EXCEPTION_2"));
                            }
                        } catch (e) {
                            var message = e.message;
                            options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */]({
                                message : __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EXCEPTION", message),
                                status : 200,
                                type : __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */].TYPE_SRVERR
                            }));
                            return;
                        }

                        break;

                    case "json":
                        logger.trace("analyze response : json");
                        logger.trace("analyze response : ", typeof options.response);

                        var JSONResponse;
                        if (typeof options.response === "string") {
                            JSONResponse = JSON.parse(options.response);
                        } else {
                            JSONResponse = options.response;
                        }

                        // le service renvoie t il une erreur ?
                        if (JSONResponse.error) {
                            // ex. {"error": {"code": "BAD_PARAMETER","description": "The values () cannot be parsed as a valid longitude (double value such as -180 < lat < 180)."}}
                            options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */]({
                                message : __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EXCEPTION", JSONResponse.error.description),
                                status : 200,
                                type : __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */].TYPE_SRVERR
                            }));
                            return;
                        }

                        // analyse de la reponse
                        if (JSONResponse) {
                            var elevations = JSONResponse.elevations;
                            var altiResponse = new __WEBPACK_IMPORTED_MODULE_5__model_AltiResponse__["a" /* default */]();
                            var elevation;
                            if (Array.isArray(elevations) && elevations.length) {
                                for (var i = 0; i < elevations.length; i++) {
                                    elevation = new __WEBPACK_IMPORTED_MODULE_6__model_Elevation__["a" /* default */]();

                                    if (typeof elevations[i] === "object") {
                                        // elevations[i] est un objet elevation
                                        if (elevations[i].lon) {
                                            elevation.lon = elevations[i].lon;
                                        }
                                        if (elevations[i].lat) {
                                            elevation.lat = elevations[i].lat;
                                        }
                                        if (elevations[i].z) {
                                            elevation.z = elevations[i].z;
                                        }
                                        if (elevations[i].acc) {
                                            elevation.acc = elevations[i].acc;
                                        }
                                    } else if (typeof elevations[i] === "number") {
                                        // elevations[i] est un nombre, dans le cas de zonly=true notamment
                                        elevation.z = elevations[i];
                                    }

                                    if (Array.isArray(altiResponse.elevations)) {
                                        altiResponse.elevations.push(elevation);
                                    }
                                }
                            }
                            data = altiResponse;
                        }

                        if (!data) {
                            options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */]({
                                message : __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_ANALYSE_2"),
                                type : __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */].TYPE_UNKERR,
                                status : -1
                            }));
                            return;
                        }
                        break;

                    default:
                        options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */]({
                            message : __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_FORMAT_2"),
                            type : __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */].TYPE_UNKERR,
                            status : -1
                        }));
                        return;
                }

                // Si la réponse contenait une exception renvoyée par le service
                if (data.exceptionReport) {
                    options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */]({
                        message : __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EXCEPTION", data.exceptionReport),
                        type : __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */].TYPE_SRVERR,
                        status : 200
                    }));
                    return;
                } else if (data.error) {
                    var errorMess = data.error.description;
                    options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */]({
                        message : __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EXCEPTION", errorMess),
                        type : __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */].TYPE_SRVERR,
                        status : 200
                    }));
                    return;
                }
            }
        } else {
            options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EMPTY")));
            return;
        }

        options.onSuccess.call(options.scope, data);
    }
};

/* harmony default export */ __webpack_exports__["a"] = (AltiResponseFactory);


/***/ }),
/* 60 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Response_model_AltiResponse__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Response_model_Elevation__ = __webpack_require__(10);

/**
 * Fonction retournant un objet contenant des clés de lecture (readers)
 *      qui permettent de parser des réponses XML du service Altimétrique du Géoportail
 *      (calcul altimétrique simple ou profil altimétrique d'une courbe),
 *      lorsque le paramètre output = xml,
 *      afin de récupérer les élévations retournées.
 *
 * @module AltiResponseReader
 * @alias Gp.Services.Alti.Formats.AltiResponseReader
 * @private
 */

// import Logger from "../../../Utils/LoggerByDefault";



/**
 *
 * Objet AltiResponseReader
 *
 * @member {Object} AltiResponseReader
 *
 * @property {Object} AltiResponseReader.READERS - Objet contenant des fonctions de lecture, appelées "readers"
 *      dont chaque clé correspond au nom d'un tag du XML que l'on souhaite lire
 *      et la valeur associée est une fonction (node, data)
 *      où node est un noeud du document DOM
 *      et data est un objet où l'on stocke les informations lues dans le XML.
 *
 * @property {Method} AltiResponseReader.READERS.elevations -  Lecture d'un noeud "elevations" de la réponse XML
 *      du service alti, correspondant logiquement à la racine du document
 *      (contient un ou plusieurs childNodes correspondant chacun à une élévation retournée)
 *
 * @property {Method} AltiResponseReader.READERS.elevation - ecture d'un noeud "elevation" de la réponse xml du service alti.
 *      (contient un ou 4 childNode (s) correspondant à l'altitude (z) et éventuellement lat, lon, et acc)
 *
 * @property {Method} AltiResponseReader.READERS.lat - Lecture d'un noeud "lat" de la réponse xml du service alti.
 *      (contient une valeur de latitude, qui est un flottant)
 *
 * @property {Method} AltiResponseReader.READERS.lon - Lecture d'un noeud "lon" de la réponse xml du service alti.
 *      (contient une valeur de longitude, qui est un flottant)
 *
 * @property {Method} AltiResponseReader.READERS.z - Lecture d'un noeud "z" de la réponse xml du service alti.
 *      (contient une valeur d'altitude, qui est un flottant)
 *
 * @property {Method} AltiResponseReader.READERS.acc - Lecture d'un noeud "acc" de la réponse xml du service alti.
 *      (contient une valeur de précision, qui est un flottant)
 *
 * @property {Method} AltiResponseReader.READERS.exceptionreport - Lecture d'un noeud "ExceptionReport" de la réponse xml du service alti.
 *
 * @property {Method} AltiResponseReader.READERS.exception - Lecture d'un noeud "Exception" de la réponse xml du service alti.
 *
 * @property {Method} AltiResponseReader.read - Méthode permettant de lancer la lecture d'une réponse XML du service altimétrique,
 *      à l'aide des readers de la classe.
 *
 */
var AltiResponseReader = {};

AltiResponseReader.READERS = {

    /**
     * Lecture d'un noeud "elevations" de la réponse XML du service alti, correspondant logiquement à la racine du document
     *      (contient un ou plusieurs childNodes correspondant chacun à une élévation retournée)
     *
     * @param {DOMElement} root - racine de la réponse XML
     * @static
     * @memberof AltiResponseReader
     * @returns {Object} Retourne un objet de type AltiResponse
     */
    elevations : function (root) {
        // INFO : on passe en paramètre l'objet en entrée elevations, vide, à remplir.
        var altiResponse = new __WEBPACK_IMPORTED_MODULE_0__Response_model_AltiResponse__["a" /* default */]();

        if (root.hasChildNodes()) {
            var children = root.childNodes;
            var child;
            var elevation;

            for (var i = 0; i < children.length; i++) {
                child = children[i];

                if (AltiResponseReader.READERS[child.nodeName]) {
                    elevation = AltiResponseReader.READERS[child.nodeName](child);
                    altiResponse.elevations.push(elevation);
                }
            }
        }

        return altiResponse;
    },

    /**
     * Lecture d'un noeud "elevation" de la réponse xml du service alti.
     *      (contient un ou 4 childNode (s) correspondant à l'altitude (z) et éventuellement lat, lon, et acc)
     *
     * @param {DOMElement} node - noeud elevation à lire pour récupérer les informations de l'élévation retournée (z [, lon, lat, acc])
     * @return {Array} elevationResponse - format de la réponse en sortie, instance de AltiResponse
     * @static
     * @memberof AltiResponseReader
     */
    elevation : function (node) {
        var elevation = new __WEBPACK_IMPORTED_MODULE_1__Response_model_Elevation__["a" /* default */]();

        if (node.hasChildNodes()) {
            var children = node.childNodes;
            var child;
            for (var i = 0; i < children.length; i++) {
                child = children[i];
                if (AltiResponseReader.READERS[child.nodeName]) {
                    // INFO : on passe en paramètre l'objet en entrée elevation, vide, à remplir.
                    AltiResponseReader.READERS[child.nodeName](child, elevation);
                }
            }
        }
        return elevation;
    },

    /**
     * Lecture d'un noeud "lat" de la réponse xml du service alti.
     *      (contient une valeur de latitude, qui est un flottant)
     *
     * @param {DOMElement} node - noeud à lire pour récupérer la latitude
     * @param {Object} elevation - objet dans lequel stocker la latitude retournée
     * @static
     * @memberof AltiResponseReader
     */
    lat : function (node, elevation) {
        var textNode = node.firstChild;
        if (textNode && textNode.nodeType === 3) { // 3 === node.TEXT_NODE
            elevation.lat = parseFloat(textNode.nodeValue);
        } else {
            throw new Error("Erreur dans la lecture de la réponse du service : latitude attendue mais absente");
        }
    },

    /**
     * Lecture d'un noeud "lon" de la réponse xml du service alti.
     *      (contient une valeur de longitude, qui est un flottant)
     *
     * @param {DOMElement} node - noeud à lire pour récupérer la longitude
     * @param {Object} elevation - objet dans lequel stocker la longitude retournée
     * @static
     * @memberof AltiResponseReader
     */
    lon : function (node, elevation) {
        var textNode = node.firstChild;
        if (textNode && textNode.nodeType === 3) { // 3 === node.TEXT_NODE
            elevation.lon = parseFloat(textNode.nodeValue);
        } else {
            throw new Error("Erreur dans la lecture de la réponse du service : longitude attendue mais absente");
        }
    },

    /**
     * Lecture d'un noeud "z" de la réponse xml du service alti.
     *      (contient une valeur d'altitude, qui est un flottant)
     *
     * @param {DOMElement} node - noeud à lire pour récupérer l'altitude
     * @param {Object} elevation - objet dans lequel stocker l'altitude retournée
     * @static
     * @memberof AltiResponseReader
     */
    z : function (node, elevation) {
        var textNode = node.firstChild;
        if (textNode && textNode.nodeType === 3) { // 3 === node.TEXT_NODE
            if (elevation) {
                elevation.z = parseFloat(textNode.nodeValue);
            } else {
                elevation = new __WEBPACK_IMPORTED_MODULE_1__Response_model_Elevation__["a" /* default */]();
                elevation.z = parseFloat(textNode.nodeValue);
                return elevation;
            }
        } else {
            throw new Error("Erreur dans la lecture de la réponse du service : altitude attendue mais absente");
        }
    },

    /**
     * Lecture d'un noeud "acc" de la réponse xml du service alti.
     *      (contient une valeur de précision, qui est un flottant)
     *
     * @param {DOMElement} node - noeud à lire pour récupérer la précision
     * @param {Object} elevation - objet dans lequel stocker la précision retournée
     * @static
     * @memberof AltiResponseReader
     */
    acc : function (node, elevation) {
        var textNode = node.firstChild;
        if (textNode && textNode.nodeType === 3) { // 3 === node.TEXT_NODE
            elevation.acc = parseFloat(textNode.nodeValue);
        } else {
            throw new Error("Erreur dans la lecture de la réponse du service : précision (acc) attendue mais absente");
        }
    },

    /**
     * Lecture d'un noeud "ExceptionReport" de la réponse xml du service alti.
     *
     * @param {DOMElement} node - noeud à lire pour récupérer l'exception
     * @return {Object} exceptionReport - objet contenant l'exception
     * @static
     * @memberof AltiResponseReader
     */
    exceptionreport : function (node) {
        var response = {};

        if (node.hasChildNodes()) {
            var children = node.childNodes;
            var child;
            for (var i = 0; i < children.length; i++) {
                child = children[i];
                if (child.nodeName === "Exception") {
                    response.exceptionReport = AltiResponseReader.READERS.exception(child);
                }
            }
        }

        return response;
    },

    /**
     * Lecture d'un noeud "Exception" de la réponse xml du service alti.
     *
     * @param {DOMElement} node - noeud à lire pour récupérer l'exception
     * @return {Object} exceptionReport - objet contenant l'exception, avec deux attributs :
     *      {String} exceptionReport.exceptionCode - qui contient l'identifiant du code de l'exception
     *      {String} exceptionReport.exception - qui contient le message de l'exception
     * @static
     * @memberof AltiResponseReader
     */
    exception : function (node) {
        var exceptionReport = {};

        // get exception code
        var exceptionCode = node.getAttribute("exceptionCode");
        if (exceptionCode) {
            exceptionReport.exceptionCode = exceptionCode;
        }

        // get exception message
        var textNode = node.firstChild;
        if (textNode && textNode.nodeType === 3) { // 3 === node.TEXT_NODE
            exceptionReport.exception = textNode.nodeValue;
        }

        return exceptionReport;
    },

    /**
     * Lecture d'un noeud "Error" de la réponse xml du service alti.
     *
     * @param {DOMElement} node - noeud à lire pour récupérer l'exception
     * @return {Object} error - objet contenant l'exception
     * @static
     */
    error : function (node) {
        var response = {
            error : {}
        };
        // get error code and description
        if (node.hasChildNodes()) {
            var children = node.childNodes;
            var child;
            for (var i = 0; i < children.length; i++) {
                child = children[i];
                var textNode;
                // get error code
                if (child.nodeType === 1 && child.nodeName === "code") { // 1 === node.ELEMENT_NODE
                    textNode = child.firstChild;
                    if (textNode && textNode.nodeType === 3) { // 3 === node.TEXT_NODE
                        response.error.code = textNode.nodeValue;
                    }
                }
                // get error description
                if (child.nodeType === 1 && child.nodeName === "description") { // 1 === node.ELEMENT_NODE
                    textNode = child.firstChild;
                    if (textNode && textNode.nodeType === 3) { // 3 === node.TEXT_NODE
                        response.error.description = textNode.nodeValue;
                    }
                }
            }
        }
        return response;
    }

};

/**
 * Méthode permettant de lancer la lecture d'une réponse XML du service altimétrique,
 *      à l'aide des readers de la classe.
 *
 * @method AltiResponseReader.read
 * @param {DOMElement} root - racine de la réponse XML à lire
 * @static
 * @memberof AltiResponseReader
 */
AltiResponseReader.read = function (root) {
    if (root.nodeName === "elevations") {
        var altiResponse = AltiResponseReader.READERS.elevations(root);
        return altiResponse;
    } else if (root.nodeName === "ExceptionReport") {
        var exceptionReport = AltiResponseReader.READERS.exceptionreport(root);
        return exceptionReport;
    } else if (root.nodeName === "error") {
        var error = AltiResponseReader.READERS.error(root);
        return error;
    } else {
        throw new Error("Erreur lors de la lecture de la réponse : elle n'est pas au format attendu.");
    }
};

/* harmony default export */ __webpack_exports__["a"] = (AltiResponseReader);


/***/ }),
/* 61 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Utils_Helper__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Exceptions_ErrorService__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__DefaultUrlService__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__CommonService__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Response_AutoConfResponseFactory__ = __webpack_require__(62);









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
        throw new TypeError(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("CLASS_CONSTRUCTOR", "AutoConf"));
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
    __WEBPACK_IMPORTED_MODULE_5__CommonService__["a" /* default */].apply(this, arguments);

    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("Gp.Services.AutoConf");
    this.logger.trace("[Constructeur AutoConf (options)]");

    // #####################
    // analyse des options
    // #####################

    // gestion de l'url du service par defaut
    if (!this.options.serverUrl) {
        // si l'url n'est pas renseignée, il faut utiliser les urls par defaut
        // en fonction du nombre de clés en entrée et du paramètre layerId
        if (!this.options.serverUrl) {
            var lstUrlByDefault = __WEBPACK_IMPORTED_MODULE_4__DefaultUrlService__["a" /* default */].AutoConf.url(this.options.apiKey);

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

AutoConf.prototype = Object.create(__WEBPACK_IMPORTED_MODULE_5__CommonService__["a" /* default */].prototype, {
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
        this.request = __WEBPACK_IMPORTED_MODULE_2__Utils_Helper__["a" /* default */].normalyzeParameters({
            layerId : this.layerId
        });
    }

    // normalement pas d'erreur d'autoconf...
    (this.request || this.request === "")
        ? success.call(this, this.request)
        : error.call(this, new __WEBPACK_IMPORTED_MODULE_3__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_REQUEST_BUILD")));
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

        __WEBPACK_IMPORTED_MODULE_6__Response_AutoConfResponseFactory__["a" /* default */].build(options);
    } else {
        error.call(this, new __WEBPACK_IMPORTED_MODULE_3__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EMPTY")));
    }
};

/* harmony default export */ __webpack_exports__["a"] = (AutoConf);


/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Formats_XML__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Formats_AutoConfResponseReader__ = __webpack_require__(63);
/**
 * Factory pour générer une reponse JSON à partir d'un XML
 *
 * @module AutoConfReponseFactory
 * @private
 * @alias Gp.Services.AutoConf.Response.AutoConfResponseFactory
 * @todo gérer le cas du JSONP qui encapsule du XML ?
 */






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
        var logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("AutoConfResponseFactory");
        logger.trace(["AutoConfResponseFactory::build()"]);

        // data de type AutoConfResponse
        var data = null;

        if (options.response) {
            if (options.rawResponse) {
                data = options.response;
            } else {
                try {
                    var p = new __WEBPACK_IMPORTED_MODULE_3__Formats_XML__["a" /* default */]({
                        reader : __WEBPACK_IMPORTED_MODULE_4__Formats_AutoConfResponseReader__["a" /* default */]
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

                    options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */]({
                        message : __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EXCEPTION", message),
                        status : 200,
                        type : __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */].TYPE_SRVERR
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
                    options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EMPTY_2")));
                    return;
                }

                // Si la réponse contenait une exception renvoyée par le service, on appelle le callback d'erreur
                if (data.exceptionReport) {
                    options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */]({
                        message : __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EXCEPTION", data.exceptionReport),
                        type : __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */].TYPE_SRVERR,
                        status : 200
                    }));
                    return;
                }
            }
        } else {
            // si la réponse (xmlString) est vide, on appelle le callback d'erreur
            options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EMPTY")));
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

/* harmony default export */ __webpack_exports__["a"] = (AutoConfReponseFactory);


/***/ }),
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Response_model_AutoConfResponse__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Response_model_Constraint__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Response_model_Format__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Response_model_Layer__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Response_model_Legend__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Response_model_Metadata__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Response_model_Originator__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Response_model_Service__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__Response_model_Style__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__Response_model_Territory__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__Response_model_Thematic__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__Response_model_TileMatrixSet__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__Response_model_TileMatrix__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__Response_model_TileMatrixLimit__ = __webpack_require__(38);

/**
 * Fonction retournant un objet contenant des clés de lecture (readers)
 *      qui permettent de parser des réponses XML du service d'autoconfiguration du Géoportail
 *      afin de récupérer les informations retournées.
 * @module AutoConfResponseReader
 * @private
 * @alias Gp.Services.AutoConf.Formats.AutoConfResponseReader
 */

// import Logger from "../../../Utils/LoggerByDefault";















var AutoConfResponseReader = {};

/**
 * version du service d'autoconf
 */
AutoConfResponseReader.VERSION = "1.1.0";

/**
 * Objet stockant les différents namespaces et les URI associées
 */
AutoConfResponseReader.NAMESPACES = {
    xmlns : "http://www.opengis.net/context",
    gpp : "http://api.ign.fr/geoportail",
    ows : "http://www.opengis.net/ows/1.1",
    sld : "http://www.opengis.net/sld",
    wmts : "http://www.opengis.net/wmts/1.0",
    xlink : "http://www.w3.org/1999/xlink",
    xsi : "http://www.w3.org/2001/XMLSchema-instance"
};

/**
 * Localisation (URL) du schema de définition du XML (XSD)
 */
AutoConfResponseReader.SCHEMALOCATION = [
    "http://www.opengis.net/context http://wxs.ign.fr/schemas/extContext.xsd http://api.ign.fr/geoportail http://wxs.ign.fr/schemas/autoconf/autoconf.xsd",
    "http://www.opengis.net/context http://wxs.ign.fr/schemas/extContext.xsd http://api.ign.fr/geoportail http://wxs.ign.fr/schemas/autoconf.xsd"
];

/**
 * Namespace par défaut du format
 */
AutoConfResponseReader.DEFAULTPREFIX = "context";

/**
 * Objet contenant des fonctions de lecture, appelées "READERS"
 *      dont chaque clé correspond au nom d'un tag du XML que l'on souhaite lire
 *      et la valeur associée est une fonction (node, data)
 *      où node est un noeud du document DOM
 *      et data est un objet où l'on stocke les informations lues dans le XML.
 */
AutoConfResponseReader.READERS = {

    context : {

        /** ViewContext */
        ViewContext : function (viewContextNode) {
            // info : balise "racine" de la réponse de l'autoconf

            // vérification de la version du service, et des namespaces de l'en-tête
            __checkServiceAttributes(viewContextNode);

            // create AutoConfResponse
            var config = new __WEBPACK_IMPORTED_MODULE_0__Response_model_AutoConfResponse__["a" /* default */]();

            __getChildNodes(viewContextNode, config);

            return config;
        },

        // info : /General/Title
        // ou : /LayerList/Layer/Title
        /** Title */
        Title : function (titleNode, data) {
            if (data && data.generalOptions) { // cas de la variable config générale
                data.generalOptions.title = __getChildValue(titleNode);
            } else if (data && data.lyr) { // cas d'une layer
                data.lyr.title = __getChildValue(titleNode);
            }
        },

        // info : /LayerList/Layer/Abstract
        /** Abstract */
        Abstract : function (node, data) {
            if (data && data.lyr) {
                data.lyr.description = __getChildValue(node);
            }
        },

        // info : /General/Extension/gpp:General/gpp:Services/Server
        // ou : /LayerList/Server
        /** Server */
        Server : function (node, data) {
            var serverId = node.getAttribute("service");
            var title = node.getAttribute("title");
            var version = node.getAttribute("version");
            if (serverId) {
                if (data && data.services && typeof data.services === "object" && !data.services[serverId]) {
                    // on est dans la balise Services
                    var s = new __WEBPACK_IMPORTED_MODULE_7__Response_model_Service__["a" /* default */]();
                    s.title = title;
                    s.version = version;
                    // récupération de l'url du service, dans une balise enfant "OnlineResource"
                    __getChildNodes(node, s);
                    // ajout du service à la variable config
                    data.services[serverId] = s;
                } else if (data && data.lyr) {
                    // on est dans la balise Layer
                    if (!data.lyr.serviceParams) {
                        // si l'objet serviceParams n'a pas encore été créé, on le crée.
                        data.lyr.serviceParams = {};
                    }
                    data.lyr.serviceParams.id = serverId;
                    data.lyr.serviceParams.version = version;
                }
            }
        },

        // info : /General/Extension/gpp:General/gpp:Services/Server/OnlineResource
        // ou : /LayerList/Layer/Server/OnlineResource
        // ou : /LayerList/Layer/Extention/gpp:Layer/gpp:QuickLook/OnlineResource
        // ou : /LayerList/Layer/Extension/gpp:Layer/gpp:Legends/gpp:Legend/gpp:LegendURL/OnlineResource
        // ou : /LayerList/Layer/Extension/gpp:Layer/gpp:MetadataURL/OnlineResource
        /** OnlineResource */
        OnlineResource : function (node, service) {
            if (service && service.hasOwnProperty("serverUrl")) {
                service.serverUrl = node.getAttribute("xlink:href");
            }
        },

        // info : /LayerList
        /** LayerList */
        LayerList : function (layerListNode, config) {
            // liste de balises "layer"
            __getChildNodes(layerListNode, config);

            if (config && config.layers && config.generalOptions && config.services) {
                // récupération des clés et des couches associées
                for (var lyr in config.layers) {
                    if (config.layers.hasOwnProperty(lyr)) {
                        var layerConfig = config.layers[lyr];

                        // récupération de la clé associée
                        var apiKeys = layerConfig.apiKeys;
                        if (apiKeys && Array.isArray(apiKeys)) {
                            for (var i = 0; i < apiKeys.length; i++) {
                                // pour chaque clé API, on ajoute la couche
                                var key = apiKeys[i];
                                if (config.generalOptions.apiKeys) {
                                    if (!config.generalOptions.apiKeys[key] || !Array.isArray(config.generalOptions.apiKeys[key])) {
                                        config.generalOptions.apiKeys[key] = [];
                                    }
                                    config.generalOptions.apiKeys[key].push(lyr);
                                }
                            }
                        }

                        // récupération du service associé
                        var serviceParams = layerConfig.serviceParams;
                        if (serviceParams && serviceParams.id) {
                            if (!config.services[serviceParams.id]) {
                                var s = new __WEBPACK_IMPORTED_MODULE_7__Response_model_Service__["a" /* default */]();
                                if (serviceParams.serverUrl) {
                                    s.serverUrl = serviceParams.serverUrl;
                                }
                                if (serviceParams.version) {
                                    s.version = serviceParams.version;
                                }
                                config.services[serviceParams.id] = s;
                            }
                        }

                        // récupération de la projection associée (dans le cas d'une couche WMTS)
                        if (layerConfig.wmtsOptions && layerConfig.wmtsOptions.tileMatrixSetLink && config.tileMatrixSets) {
                            var tmsLink = layerConfig.wmtsOptions.tileMatrixSetLink;
                            var tileMatrixSets = config.tileMatrixSets;
                            for (var tms in tileMatrixSets) {
                                if (tileMatrixSets.hasOwnProperty(tms) && tms === tmsLink) {
                                    layerConfig.defaultProjection = tileMatrixSets[tms].projection;
                                }
                            }
                        }
                    }
                }
            }
        },

        // info : /LayerList/Layer
        /** Layer */
        Layer : function (layerNode, config) {
            if (config && config.layers) {
                var lyrData = {
                    lyr : new __WEBPACK_IMPORTED_MODULE_3__Response_model_Layer__["a" /* default */](),
                    lyrId : null
                };

                var hidden = layerNode.getAttribute("hidden");
                if (hidden === "1") {
                    lyrData.lyr.hidden = true;
                } else {
                    lyrData.lyr.hidden = false;
                }

                var queryable = layerNode.getAttribute("queryable");
                if (queryable === "1") {
                    lyrData.lyr.queryable = true;
                } else {
                    lyrData.lyr.queryable = false;
                }

                // on peut avoir les balises : Server, Name, Title, Abstract, DataURL, MetadataURL,
                // sld:MinScaleDenominator, sld:MaxScaleDenominator, SRS, FormatList, StyleList
                // DimensionList, Extension
                __getChildNodes(layerNode, lyrData);

                // si on a bien récupéré l'identifiant de la couche, on s'en sert pour l'ajouter au tableau associatif des couches disponibles
                if (lyrData.lyrId) {
                    // Dans le cas des services, on modifie le contexte de l'identifiant.
                    if (lyrData.lyr.serviceParams && lyrData.lyr.serviceParams.id) {
                        var serviceid = lyrData.lyr.serviceParams.id;
                        if (serviceid.toUpperCase().indexOf("OPENLS") !== -1 || serviceid.toUpperCase().indexOf("ELEVATION") !== -1) {
                            // Il faut changer l'identifiant de la ressource.
                            var resourceId = lyrData.lyrId.split("$")[0];
                            lyrData.lyrId = resourceId + "$" + serviceid;
                        }
                    }

                    // on ajoute l'information dans les attributs de la couche
                    lyrData.lyr.layerId = lyrData.lyrId;
                    // et dans le tableau Gp.Config.layers
                    config.layers[lyrData.lyrId] = lyrData.lyr;
                }
            }
        },

        // info : /LayerList/Layer/Name
        /** TODO : jsdoc block */
        Name : function (node, lyrData) {
            if (lyrData && lyrData.lyr) {
                lyrData.lyr.name = __getChildValue(node);
            }
        },

        // info : /LayerList/Layer/SRS (dans le cas des couches WMS ou WFS)
        /** TODO : jsdoc block */
        SRS : function (node, lyrData) {
            // on récupère la projection de la couche (SRS)
            if (lyrData && lyrData.lyr) {
                lyrData.lyr.defaultProjection = __getChildValue(node);
            }
        },

        // info : /LayerList/Layer/FormatList/Format
        /** TODO : jsdoc block */
        Format : function (node, lyrData) {
            if (lyrData && lyrData.lyr) {
                var f = new __WEBPACK_IMPORTED_MODULE_2__Response_model_Format__["a" /* default */]();
                var current = node.getAttribute("current");
                if (current === "1") {
                    f.current = true;
                } else {
                    f.current = false;
                }
                f.name = __getChildValue(node);
                // si on n'a pas encore ajouté de format, on crée le tableau vide
                if (!lyrData.lyr.formats || !Array.isArray(lyrData.lyr.formats)) {
                    lyrData.lyr.formats = [];
                }
                lyrData.lyr.formats.push(f);
            }
        },

        // info : /LayerList/Layer/StyleList/Style
        /** TODO : jsdoc block */
        Style : function (node, lyrData) {
            if (lyrData && lyrData.lyr) {
                var s = new __WEBPACK_IMPORTED_MODULE_8__Response_model_Style__["a" /* default */]();
                var current = node.getAttribute("current");
                if (current === "1" || current === 1) {
                    s.current = true;
                } else {
                    s.current = false;
                }
                if (node.hasChildNodes) {
                    var children = node.childNodes;
                    var child;
                    var childName;
                    for (var i = 0; i < children.length; i++) {
                        child = children[i];
                        if (child.nodeType === 1) { // 1 === node.ELEMENT_NODE
                            childName = child.localName || child.baseName || child.nodeName;
                            if (childName === "Name") {
                                s.name = __getChildValue(child);
                            } else if (childName === "Title") {
                                s.title = __getChildValue(child);
                            } else if (childName === "URL") {
                                s.url = __getChildValue(child);
                            }
                        }
                    }
                }
                // si on n'a pas encore ajouté de style, on crée le tableau vide
                if (!lyrData.lyr.styles || !Array.isArray(lyrData.lyr.styles)) {
                    lyrData.lyr.styles = [];
                }
                lyrData.lyr.styles.push(s);
            }
        },

        // info : /LayerList/Layer/DimensionList/Dimension
        /** TODO : jsdoc block */
        Dimension : function (node, lyrData) {
            // possède des attributs obligatoires : name, units, unitSymbol et userValue
            // et d'autres attributs facultatifs : default, multipleValues, nearestValue, current
            var name = node.getAttribute("name");
            var dim = __getChildValue(node);
            if (lyrData && lyrData.lyr) {
                // si on n'a pas encore ajouté de dimension, on crée l'objet vide
                if (!lyrData.lyr.dimensions) {
                    lyrData.lyr.dimensions = {};
                }
                if (name === "Type") {
                    lyrData.lyr.dimensions.type = dim;
                } else if (name === "VisibilityRange") {
                    lyrData.lyr.dimensions.visibilityRange = dim;
                } else if (name === "VisibilityMode ") {
                    lyrData.lyr.dimensions.visibilityMode = dim;
                } else if (name === "GeometricType") {
                    lyrData.lyr.dimensions.geometricType = dim;
                } else if (name === "NoDataValue") {
                    lyrData.lyr.dimensions.noDataValue = dim;
                }
            }
        }

    },

    gpp : {

        // info : /General/Extension/gpp:General/gpp:Theme
        /** TODO : jsdoc block */
        Theme : function (themeNode, config) {
            if (config && config.generalOptions && config.generalOptions.hasOwnProperty("theme")) {
                config.generalOptions.theme = __getChildValue(themeNode);
            }
        },

        // info : /General/Extension/gpp:General/gpp:defaultGMLGFIStyleUrl
        /** TODO : jsdoc block */
        defaultGMLGFIStyleUrl : function (node, config) {
            if (config && config.generalOptions && config.generalOptions.hasOwnProperty("defaultGMLGFIStyle")) {
                config.generalOptions.defaultGMLGFIStyle = __getChildValue(node);
            }
        },

        // info : /General/Extension/gpp:General/gpp:Territories/gpp:Territory
        /** TODO : jsdoc block */
        Territory : function (territoryNode, config) {
            // info : Information to configure the API for this territory
            var tid = territoryNode.getAttribute("id");
            if (tid) {
                // create a new Territory
                var t = new __WEBPACK_IMPORTED_MODULE_9__Response_model_Territory__["a" /* default */]();

                var isDefault = territoryNode.getAttribute("default");
                if (isDefault === "1") {
                    t.isDefault = true;
                } else {
                    t.isDefault = false;
                }
                // read territory informations
                __getChildNodes(territoryNode, t);
                // add territory to config
                if (config && config.territories && typeof config.territories === "object") {
                    config.territories[tid] = t;
                }
            }
        },

        // info : /General/Extension/gpp:General/gpp:Territories/gpp:Territory/gpp:defaultCRS
        /** TODO : jsdoc block */
        defaultCRS : function (node, territory) {
            // info : Identifier for the default Coordinate Reference System (CRS).
            if (territory && territory.hasOwnProperty("defaultCRS")) {
                territory.defaultCRS = __getChildValue(node);
            }
        },

        // info : /General/Extension/gpp:General/gpp:Territories/gpp:Territory/gpp:AdditionalCRS
        // ou : /LayerList/Extension/gpp:Layer/gpp:AdditionalCRS
        /** TODO : jsdoc block */
        AdditionalCRS : function (node, data) {
            // info : Identifier for additional Coordinate Reference System (CRS).
            // info : data peut être une instance de Territory.js, ou une instance de Layer.js
            var addCRS = __getChildValue(node);
            if (addCRS && data) {
                if (Array.isArray(data.additionalCRS)) { // cas d'un territoire
                    data.additionalCRS.push(addCRS);
                } else { // cas d'une couche
                    // si le tableau n'est pas encore créé
                    if (!data.additionalProjections || !Array.isArray(data.additionalProjections)) {
                        data.additionalProjections = [];
                    }
                    data.additionalProjections.push(addCRS);
                }
            }
        },

        // info : /General/Extension/gpp:General/gpp:Territories/gpp:Territory/gpp:DefaultLayer
        /** TODO : jsdoc block */
        DefaultLayer : function (node, territory) {
            var lyr = node.getAttribute("layerId");
            if (lyr && territory && Array.isArray(territory.defaultLayers)) {
                territory.defaultLayers.push(lyr);
            }
        },

        // info : /General/Extension/gpp:General/gpp:Territories/gpp:Territory/gpp:BoundingBox
        // ou : /LayerList/Extension/gpp:Layer/gpp:BoundingBox
        // ou : /LayerList/Layer/Extension/gpp:Layer/gpp:Constraints/gpp:Constraint/gpp:BoundingBox
        // ou : /LayerList/Extension/gpp:Layer/gpp:Originators/gpp:Originator/gpp:Constraints/gpp:Constraint/gpp:BoundingBox
        /** TODO : jsdoc block */
        BoundingBox : function (node, data) {
            if (data) {
                var values = __getChildValue(node).split(",");
                if (values.length === 4) {
                    // get bbox coordinates (wgs84)
                    var bbox = {
                        left : parseFloat(values[0]),
                        right : parseFloat(values[2]),
                        top : parseFloat(values[3]),
                        bottom : parseFloat(values[1])
                    };
                    // get temporal extent params (constraint or layer)
                    var minT = node.getAttribute("minT");
                    var maxT = node.getAttribute("maxT");

                    if (data.hasOwnProperty("geoBBOX")) { // cas d'un territoire
                        data.geoBBOX = bbox;
                    } else if (data.hasOwnProperty("bbox")) { // cas d'une constraint
                        if (data.bbox.left || data.bbox.right || data.bbox.top || data.bbox.bottom) {
                            // si on a déjà une bbox, il faut stocker d'autres contraintes
                            if (!data.multiConstraints) {
                                data.multiConstraints = [];
                            }
                            var newConstraint = new __WEBPACK_IMPORTED_MODULE_1__Response_model_Constraint__["a" /* default */]();
                            newConstraint.bbox = bbox;
                            newConstraint.temporalExtent = [minT, maxT];
                            data.multiConstraints.push(newConstraint);
                        } else {
                            // contrainte classique
                            data.bbox = bbox;
                            data.temporalExtent = [minT, maxT];
                        }
                    } else { // cas d'une layer
                        if (!data.globalConstraint) {
                            data.globalConstraint = new __WEBPACK_IMPORTED_MODULE_1__Response_model_Constraint__["a" /* default */]();
                        }
                        data.globalConstraint.bbox = bbox;
                        data.globalConstraint.temporalExtent = [minT, maxT];
                    }
                }
            }
        },

        // info : /General/Extension/gpp:General/gpp:Territories/gpp:Territory/gpp:Resolution
        /** TODO : jsdoc block */
        Resolution : function (node, territory) {
            // info : The default resolution to display on this territory, in CRS coordinate system
            var res = __getChildValue(node);
            if (res && territory && territory.defaultOptions && territory.defaultOptions.hasOwnProperty("resolution")) {
                territory.defaultOptions.resolution = parseFloat(res);
            }
        },

        // info : /General/Extension/gpp:General/gpp:Territories/gpp:Territory/gpp:Center/gpp:x
        /** TODO : jsdoc block */
        x : function (node, territory) {
            var lon = __getChildValue(node);
            if (lon && territory && territory.geoCenter && territory.geoCenter.hasOwnProperty("lon")) {
                territory.geoCenter.lon = parseFloat(lon);
            }
        },

        // info : /General/Extension/gpp:General/gpp:Territories/gpp:Territory/gpp:Center/gpp:y
        /** TODO : jsdoc block */
        y : function (node, territory) {
            var lat = __getChildValue(node);
            if (lat && territory && territory.geoCenter && territory.geoCenter.hasOwnProperty("lat")) {
                territory.geoCenter.lat = parseFloat(lat);
            }
        },

        // info : /General/Extension/gpp:General/gpp:Resolutions
        /** TODO : jsdoc block */
        Resolutions : function (resNode, config) {
            // info : List of resolutions in CRS:84 (comma separated values)
            if (config && config.generalOptions && config.generalOptions.hasOwnProperty("wgs84Resolutions")) {
                config.generalOptions.wgs84Resolutions = __getChildValue(resNode).split(",");
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer
        /** TODO : jsdoc block */
        Layer : function (node, lyrData) {
            // attributs : id, opacity, order, visibleInCatalog, aggregate, more
            if (lyrData && lyrData.hasOwnProperty("lyrId") && lyrData.lyr) {
                lyrData.lyrId = node.getAttribute("id");
                var aggregate = node.getAttribute("aggregate");
                var more = node.getAttribute("more");
                if (aggregate || more) {
                    lyrData.lyr.isAggregate = true;
                }
                __getChildNodes(node, lyrData.lyr);
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer/gpp:Constraints/gpp:Constraint
        // ou : /LayerList/Extension/gpp:Layer/gpp:Originators/gpp:Originator/gpp:Constraints/gpp:Constraint
        /** TODO : jsdoc block */
        Constraint : function (node, data) {
            var c = new __WEBPACK_IMPORTED_MODULE_1__Response_model_Constraint__["a" /* default */]();
            __getChildNodes(node, c);
            if (data) {
                // on peut être dans le cas d'un originator ou d'une layer, tous les deux ont l'attribut constraints
                if (!data.constraints || !Array.isArray(data.constraints)) {
                    data.constraints = [];
                }

                // cas de plusieurs contraintes (par ex différents territoires)
                if (c.multiConstraints && Array.isArray(c.multiConstraints)) {
                    // on récupère la première contrainte, stockée normalement
                    var constraint = new __WEBPACK_IMPORTED_MODULE_1__Response_model_Constraint__["a" /* default */]();
                    constraint.crs = c.crs;
                    constraint.bbox = c.bbox;
                    constraint.minScaleDenominator = c.minScaleDenominator;
                    constraint.maxScaleDenominator = c.maxScaleDenominator;
                    constraint.temporalExtent = c.temporalExtent;
                    data.constraints.push(constraint);

                    // puis on récupère les autres contraintes, à partir de multiConstraints
                    for (var i = 0; i < c.multiConstraints.length; i++) {
                        constraint = new __WEBPACK_IMPORTED_MODULE_1__Response_model_Constraint__["a" /* default */]();
                        constraint.crs = c.crs;
                        constraint.minScaleDenominator = c.minScaleDenominator;
                        constraint.maxScaleDenominator = c.maxScaleDenominator;
                        constraint.bbox = c.multiConstraints[i].bbox;
                        constraint.temporalExtent = c.multiConstraints[i].temporalExtent;
                        data.constraints.push(constraint);
                    }
                } else {
                    // cas d'une contrainte classique
                    data.constraints.push(c);
                }
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer/gpp:Originators/gpp:Originator/gpp:Constraints/gpp:Constraint/gpp:CRS
        // ou : /LayerList/Layer/Extension/gpp:Layer/gpp:Constraints/gpp:Constraint/gpp:CRS
        /** TODO : jsdoc block */
        CRS : function (node, data) {
            // nothing to do.
            if (data && data.hasOwnProperty("crs")) {
                data.crs = __getChildValue(node);
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer/gpp:Thematics/gpp:Thematic
        /** TODO : jsdoc block */
        Thematic : function (node, lyr) {
            if (lyr) {
                var t = new __WEBPACK_IMPORTED_MODULE_10__Response_model_Thematic__["a" /* default */]();
                t.inspire = false;
                t.name = __getChildValue(node);
                // si aucune thématique n'a été ajoutée, on crée le tableau vide
                if (!lyr.thematics || !Array.isArray(lyr.thematics)) {
                    lyr.thematics = [];
                }
                lyr.thematics.push(t);
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer/gpp:Thematics/gpp:InspireThematic
        /** TODO : jsdoc block */
        InspireThematic : function (node, lyr) {
            if (lyr) {
                var t = new __WEBPACK_IMPORTED_MODULE_10__Response_model_Thematic__["a" /* default */]();
                t.inspire = true;
                t.name = __getChildValue(node);
                // si aucune thématique n'a été ajoutée, on crée le tableau vide
                if (!lyr.thematics || !Array.isArray(lyr.thematics)) {
                    lyr.thematics = [];
                }
                lyr.thematics.push(t);
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer/gpp:Originators/gpp:Originator
        /** TODO : jsdoc block */
        Originator : function (node, lyr) {
            if (lyr) {
                // info : contient des balises Attribution, Logo, URL, et Constraints
                var o = new __WEBPACK_IMPORTED_MODULE_6__Response_model_Originator__["a" /* default */]();
                o.name = node.getAttribute("name");
                __getChildNodes(node, o);
                // si aucun originator n'a été ajouté, on crée le tableau vide
                if (!lyr.originators || !Array.isArray(lyr.originators)) {
                    lyr.originators = [];
                }
                lyr.originators.push(o);
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer/gpp:Originators/gpp:Originator/gpp:Attribution
        /** TODO : jsdoc block */
        Attribution : function (node, originator) {
            if (originator && originator.hasOwnProperty("attribution")) {
                originator.attribution = __getChildValue(node);
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer/gpp:Originators/gpp:Originator/gpp:Logo
        /** TODO : jsdoc block */
        Logo : function (node, originator) {
            if (originator && originator.hasOwnProperty("logo")) {
                originator.logo = __getChildValue(node);
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer/gpp:Originators/gpp:Originator/gpp:URL
        /** TODO : jsdoc block */
        URL : function (node, originator) {
            if (originator && originator.hasOwnProperty("url")) {
                originator.url = __getChildValue(node);
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer/gpp:Legends/gpp:Legend
        /** TODO : jsdoc block */
        Legend : function (node, lyr) {
            // 2 balises : sld:MinScaleDenominator et gpp:LegendURL
            var l = new __WEBPACK_IMPORTED_MODULE_4__Response_model_Legend__["a" /* default */]();
            __getChildNodes(node, l);
            if (lyr) {
                // si aucune légende n'a encore été ajoutée, on crée le tableau vide
                if (!lyr.legends || !Array.isArray(lyr.legends)) {
                    lyr.legends = [];
                }
                lyr.legends.push(l);
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer/gpp:Legends/gpp:Legend/gpp:LegendURL
        /** TODO : jsdoc block */
        LegendURL : function (node, legend) {
            if (legend && legend.hasOwnProperty("format")) {
                legend.format = node.getAttribute("format");
                if (node.hasChildNodes) {
                    var child = node.childNodes[0];
                    var childName = child.localName || child.baseName || child.nodeName;
                    if (childName === "OnlineResource" && legend.hasOwnProperty("url")) {
                        legend.url = child.getAttribute("xlink:href");
                    }
                }
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer/gpp:QuickLook
        /** TODO : jsdoc block */
        QuickLook : function (node, lyr) {
            // info : contient une balise OnlineResource avec l'url dans l'attribut "xlink:href"
            if (node.hasChildNodes) {
                var child = node.childNodes[0];
                var childName = child.localName || child.baseName || child.nodeName;
                if (childName === "OnlineResource" && lyr) {
                    lyr.quicklookUrl = child.getAttribute("xlink:href");
                }
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer/gpp:MetadataURL
        /** TODO : jsdoc block */
        MetadataURL : function (node, lyr) {
            if (lyr) {
                // info : contient une balise OnlineResource avec l'url dans l'attribut "xlink:href"
                var m = new __WEBPACK_IMPORTED_MODULE_5__Response_model_Metadata__["a" /* default */]();
                m.format = node.getAttribute("format");
                if (node.hasChildNodes) {
                    var child = node.childNodes[0];
                    var childName = child.localName || child.baseName || child.nodeName;
                    if (childName === "OnlineResource") {
                        m.url = child.getAttribute("xlink:href");
                    }
                }
                // si aucune metadata n'a été ajoutée, on crée le tableau vide
                if (!lyr.metadata && !Array.isArray(lyr.metadata)) {
                    lyr.metadata = [];
                }
                lyr.metadata.push(m);
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer/gpp:Keys/gpp:Key
        /** TODO : jsdoc block */
        Key : function (node, lyr) {
            if (lyr) {
                // récupération de la clé API
                var key = node.getAttribute("id");
                // si on n'a pas encore ajouté de clé, on crée le tableau vide
                if (!lyr.apiKeys || !Array.isArray(lyr.apiKeys)) {
                    lyr.apiKeys = [];
                }
                lyr.apiKeys.push(key);

                // récupération de l'url du service avec la clé API
                var serverUrl = __getChildValue(node);
                if (!lyr.serviceParams) {
                    lyr.serviceParams = {};
                }
                if (!lyr.serviceParams.serverUrl) {
                    lyr.serviceParams.serverUrl = {};
                }
                if (!lyr.serviceParams.serverUrl[key]) {
                    lyr.serviceParams.serverUrl[key] = serverUrl;
                }
            }
        }

    },

    ows : {
        /** TODO : jsdoc block */
        Identifier : function (node, data) {
            if (data && data.hasOwnProperty("TMS")) { // dans le cas d'un TileMatrixSet
                data.identifier = __getChildValue(node);
            } else if (data && data.hasOwnProperty("matrixId")) { // dans le cas d'une TileMatrix
                data.matrixId = __getChildValue(node);
            }
        },

        /** TODO : jsdoc block */
        SupportedCRS : function (node, tmsData) {
            if (tmsData && tmsData.TMS && tmsData.TMS.hasOwnProperty("projection")) {
                tmsData.TMS.projection = __getChildValue(node);
            }
        }
    },

    sld : {
        // info : /General/Extension/gpp:General/gpp:Territories/gpp:Territory/sld:MinScaleDenominator
        // ou : /LayerList/Layer/sld:MinScaleDenominator
        // ou : /LayerList/Layer/Extension/gpp:Layer/gpp:Originators/gpp:Originator/gpp:Constraints/sld:MinScaleDenominator
        // ou : /LayerList/Layer/Extension/gpp:Layer/gpp:Legends/gpp:Legend/sld:MinScaleDenominator
        /** TODO : jsdoc block */
        MinScaleDenominator : function (node, data) {
            var minScale = __getChildValue(node);
            if (minScale && data) {
                if (data.hasOwnProperty("defaultOptions")) { // cas d'un territoire
                    data.defaultOptions.minScaleDenominator = parseFloat(minScale);
                } else if (data.lyr) { // cas d'une layer
                    if (!data.lyr.globalConstraint) {
                        data.lyr.globalConstraint = new __WEBPACK_IMPORTED_MODULE_1__Response_model_Constraint__["a" /* default */]();
                    }
                    data.lyr.globalConstraint.minScaleDenominator = parseFloat(minScale);
                } else if (data.hasOwnProperty("minScaleDenominator")) { // cas d'une contrainte ou d'une légende
                    data.minScaleDenominator = parseFloat(minScale);
                }
            }
        },

        // info : /General/Extension/gpp:General/gpp:Territories/gpp:Territory/sld:MaxScaleDenominator
        // ou : /LayerList/Layer/sld:MaxScaleDenominator
        // ou : /LayerList/Layer/Extension/gpp:Layer/gpp:Originators/gpp:Originator/gpp:Constraints/sld:MaxScaleDenominator
        /** TODO : jsdoc block */
        MaxScaleDenominator : function (node, data) {
            var maxScale = __getChildValue(node);
            if (maxScale && data) {
                if (data.hasOwnProperty("defaultOptions")) { // cas d'un territoire
                    data.defaultOptions.maxScaleDenominator = parseFloat(maxScale);
                } else if (data.lyr) { // cas d'une layer
                    if (!data.lyr.globalConstraint) {
                        data.lyr.globalConstraint = new __WEBPACK_IMPORTED_MODULE_1__Response_model_Constraint__["a" /* default */]();
                    }
                    data.lyr.globalConstraint.maxScaleDenominator = parseFloat(maxScale);
                } else if (data.hasOwnProperty("maxScaleDenominator")) { // cas d'une contrainte
                    data.maxScaleDenominator = parseFloat(maxScale);
                }
            }
        }
    },

    wmts : {

        // info : /LayerList/Layer/Extension/gpp:Layer/wmts:TileMatrixSetLink/wmts:TileMatrixSetLimits
        /** TODO : jsdoc block */
        TileMatrixSetLimits : function (node, lyr) {
            // info : contient des balises wmts:TileMatrixLimits
            if (lyr) {
                var limits = {};
                // on récupère les limites dans les balises TileMatrixLimits
                __getChildNodes(node, limits);

                if (!lyr.wmtsOptions) {
                    lyr.wmtsOptions = {};
                }
                lyr.wmtsOptions.tileMatrixSetLimits = limits;
            }
        },

        // info : /LayerList/Layer/Extension/gpp:Layer/wmts:TileMatrixSetLink/wmts:TileMatrixSetLimits/wmts:TileMatrixLimits
        /** TODO : jsdoc block */
        TileMatrixLimits : function (node, limits) {
            var limit = new __WEBPACK_IMPORTED_MODULE_13__Response_model_TileMatrixLimit__["a" /* default */]();
            var limitId;
            if (node.hasChildNodes) {
                var children = node.childNodes;
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    var childName = child.localName || child.baseName || child.nodeName;
                    if (childName === "TileMatrix") {
                        limitId = __getChildValue(child);
                    } else if (childName === "MinTileRow") {
                        limit.minTileRow = __getChildValue(child);
                    } else if (childName === "MaxTileRow") {
                        limit.maxTileRow = __getChildValue(child);
                    } else if (childName === "MinTileCol") {
                        limit.minTileCol = __getChildValue(child);
                    } else if (childName === "MaxTileCol") {
                        limit.maxTileCol = __getChildValue(child);
                    }
                }
                if (limitId && limits && !limits[limitId]) {
                    limits[limitId] = limit;
                }
            }
        },

        // info : /General/Extension/gpp:General/gpp:TileMatrixSets/wmts:TileMatrixSet
        // ou : // info : /LayerList/Layer/Extension/gpp:Layer/wmts:TileMatrixSetLink/wmts:TileMatrixSet
        /** TODO : jsdoc block */
        TileMatrixSet : function (node, data) {
            // info : Describes a particular set of tile matrices.

            if (data && data.tileMatrixSets) { // les tileMatrixSets de General
                // nouvel objet TileMatrixSet
                var tmsData = {};
                tmsData.TMS = new __WEBPACK_IMPORTED_MODULE_11__Response_model_TileMatrixSet__["a" /* default */]();
                tmsData.resolutions = [];

                // lecture des informations du TMS
                __getChildNodes(node, tmsData);

                // récupération des identifiants des niveaux de matrice (pour faciliter l'accès au WMTS via les API carto)
                var tileMatrices = tmsData.TMS.tileMatrices;
                for (var tm in tileMatrices) {
                    if (tileMatrices.hasOwnProperty(tm)) {
                        tmsData.TMS.matrixIds.push(tm);
                    }
                }

                if (tmsData.TMS.getProjection() === "IGNF:WGS84G" || tmsData.TMS.getProjection() === "EPSG:4326") {
                    if (data.generalOptions && Array.isArray(data.generalOptions.wgs84Resolutions)) {
                        var wgs84Resolutions = data.generalOptions.wgs84Resolutions;
                        for (var i = 0; i < wgs84Resolutions.length; i++) {
                            // info : les résolutions stockées dans wgs84Resolutions, issues de l'autoconf, sont des string
                            tmsData.resolutions[i] = parseFloat(wgs84Resolutions[i]);
                        }
                    }
                }

                // tri des résolutions (par ordre décroissant cette fois)
                if (Array.isArray(tmsData.resolutions) && tmsData.resolutions.sort !== undefined) {
                    tmsData.resolutions.sort(
                        function (x, y) {
                            return y - x;
                        }
                    );
                }
                tmsData.TMS.nativeResolutions = tmsData.resolutions;

                // ajout du TileMatrixSet à la variable config
                data.tileMatrixSets[tmsData.identifier] = tmsData.TMS;
            } else { // le TileMatrixSetLink d'une couche (layer)
                if (data && !data.wmtsOptions) {
                    data.wmtsOptions = {};
                }
                // ajout du lien vers le TMS
                data.wmtsOptions.tileMatrixSetLink = __getChildValue(node);
            }
        },

        // info : /General/Extension/gpp:General/gpp:TileMatrixSets/wmts:TileMatrixSet/wmts:TileMatrix
        /** TODO : jsdoc block */
        TileMatrix : function (node, tmsData) {
            // info : Describes a particular tile matrix.

            if (tmsData) {
                // nouveau niveau de matrice : TileMatrix
                var tileMatrix = new __WEBPACK_IMPORTED_MODULE_12__Response_model_TileMatrix__["a" /* default */]();

                // lecture des information du TileMatrix
                __getChildNodes(node, tileMatrix);

                // calcul de la résolution associée au dénominateur d'échelle du niveau de pyramide, selon la projection.
                if (tmsData.TMS && tmsData.TMS.getProjection()) {
                    var proj = tmsData.TMS.getProjection();
                    if (proj === "EPSG:3857" || proj === "EPSG:2154") {
                        // calcul de la résolution associée, en m/px
                        // en se basant sur une "taille standard de pixel" de 0.28mm*0.28mm (standard WMTS 1.0)
                        var r = tileMatrix.scaleDenominator * 0.00028;
                        if (tmsData.resolutions && Array.isArray(tmsData.resolutions)) {
                            tmsData.resolutions.push(r);
                        }
                    }
                }

                // ajout du TileMatrix au TileMatrixSet
                if (tmsData.TMS && tmsData.TMS.tileMatrices) {
                    tmsData.TMS.tileMatrices[tileMatrix.matrixId] = tileMatrix;
                }
            }
        },

        // info : /General/Extension/gpp:General/gpp:TileMatrixSets/wmts:TileMatrixSet/wmts:TileMatrix/wmts:ScaleDenominator
        /** TODO : jsdoc block */
        ScaleDenominator : function (node, tileMatrix) {
            var scale = __getChildValue(node);
            if (scale && tileMatrix && tileMatrix.hasOwnProperty("scaleDenominator")) {
                tileMatrix.scaleDenominator = parseFloat(scale);
            }
        },

        // info : /General/Extension/gpp:General/gpp:TileMatrixSets/wmts:TileMatrixSet/wmts:TileMatrix/wmts:TopLeftCorner
        /** TODO : jsdoc block */
        TopLeftCorner : function (node, tileMatrix) {
            var values = __getChildValue(node).split(" ");
            if (values && tileMatrix) {
                tileMatrix.topLeftCorner = {};
                tileMatrix.topLeftCorner.x = parseFloat(values[0]);
                tileMatrix.topLeftCorner.y = parseFloat(values[1]);
            }
        },

        // info : /General/Extension/gpp:General/gpp:TileMatrixSets/wmts:TileMatrixSet/wmts:TileMatrix/wmts:TileWidth
        /** TODO : jsdoc block */
        TileWidth : function (node, tileMatrix) {
            var value = __getChildValue(node);
            if (value && tileMatrix && tileMatrix.hasOwnProperty("tileWidth")) {
                tileMatrix.tileWidth = parseInt(value, 10);
            }
        },

        // info : /General/Extension/gpp:General/gpp:TileMatrixSets/wmts:TileMatrixSet/wmts:TileMatrix/wmts:TileHeight
        /** TODO : jsdoc block */
        TileHeight : function (node, tileMatrix) {
            var value = __getChildValue(node);
            if (value && tileMatrix && tileMatrix.hasOwnProperty("tileHeight")) {
                tileMatrix.tileHeight = parseInt(value, 10);
            }
        },

        // info : /General/Extension/gpp:General/gpp:TileMatrixSets/wmts:TileMatrixSet/wmts:TileMatrix/wmts:MatrixWidth
        /** TODO : jsdoc block */
        MatrixWidth : function (node, tileMatrix) {
            var value = __getChildValue(node);
            if (value && tileMatrix && tileMatrix.hasOwnProperty("matrixWidth")) {
                tileMatrix.matrixWidth = parseInt(value, 10);
            }
        },

        // info : /General/Extension/gpp:General/gpp:TileMatrixSets/wmts:TileMatrixSet/wmts:TileMatrix/wmts:MatrixHeight
        /** TODO : jsdoc block */
        MatrixHeight : function (node, tileMatrix) {
            var value = __getChildValue(node);
            if (value && tileMatrix && tileMatrix.hasOwnProperty("matrixHeight")) {
                tileMatrix.matrixHeight = parseInt(value, 10);
            }
        }
    },

    /** TODO : jsdoc block */
    serviceException : function (node) {
        var response = {};
        if (node.hasChildNodes()) {
            var children = node.childNodes;
            var child;
            for (var i = 0; i < children.length; i++) {
                child = children[i];
                if (child.nodeName === "exception") {
                    response.exceptionReport = AutoConfResponseReader.READERS["exception"](child);
                }
            }
        }
        return response;
    },

    /** TODO : jsdoc block */
    exception : function (node) {
        var exceptionReport = {};

        // get exception code
        var exceptionCode = node.getAttribute("code");
        if (exceptionCode) {
            exceptionReport.exceptionCode = exceptionCode;
        }

        // get exception message
        var textNode = node.firstChild;
        if (textNode && textNode.nodeType === 3) { // 3 === node.TEXT_NODE
            exceptionReport.exception = textNode.nodeValue;
        }

        return exceptionReport;
    }

};

/**
 * Méthode permettant de lancer la lecture d'une réponse XML du service d'autoconf,
 *      à l'aide des READERS de la classe.
 *
 * @method AutoConfResponseReader.read
 * @param {DOMElement} root - racine de la réponse XML à lire
 * @return {Object} config|exceptionReport : l'objet contenant les informations de la réponse XML,
 *      sous la forme d'un objet AutoConfResponse, ou un objet littéral exceptionReport si le service a renvoyé une exception.
 * @static
 * @memberof AutoConfResponseReader
 */
AutoConfResponseReader.read = function (root) {
    if (root.nodeName === "ViewContext") {
        var nsPrefix = root.prefix || AutoConfResponseReader.DEFAULTPREFIX;
        var config = AutoConfResponseReader.READERS[nsPrefix][root.nodeName](root);
        return config;
    } else if (root.nodeName === "serviceException") {
        var exceptionReport = AutoConfResponseReader.READERS[root.nodeName](root);
        return exceptionReport;
    } else {
        throw new Error("Erreur lors de la lecture de la réponse : elle n'est pas au format attendu.");
    }
};

/**
 * Récupération des attributs d'un noeud élément
 *
 * @private
 * @memberof AutoConfResponseReader
 * @method __getAttributes
 * @param {DOMElement} node - noeud contenant l'attribut recherché
 * @return {Object} nodeAttributes - objet contenant les noms et valeurs des différents attributs
 */
function __getAttributes (node) {
    if (node.attributes.length > 0) {
        var nodeAttributes = {};
        var attributes = node.attributes;
        for (var i = 0; i < attributes.length; i++) {
            var attribute = attributes[i];
            nodeAttributes[attribute.nodeName] = attribute.nodeValue;
        }
        return nodeAttributes;
    }
}

/**
 * Récupération des noeuds enfants (seulement de type ELEMENT), à partir d'un noeud donné, pour lecture (readNode).
 *
 * @private
 * @memberof AutoConfResponseReader
 * @method __getChildNodes
 * @param {DOMElement} node - a DOM node
 * @param {Array|Object} [data] - an object to be filled with node data
 */
function __getChildNodes (node, data) {
    if (node.hasChildNodes()) {
        var children = node.childNodes;
        var child;
        var childName;
        var childPrefix;

        for (var i = 0; i < children.length; i++) {
            child = children[i];

            if (child.nodeType === 1) { // 1 === node.ELEMENT_NODE
                childName = child.localName || child.baseName || child.nodeName;
                childPrefix = child.prefix || AutoConfResponseReader.DEFAULTPREFIX;

                if (AutoConfResponseReader.READERS[childPrefix][childName]) {
                    var reader = AutoConfResponseReader.READERS[childPrefix][childName];
                    reader(child, data);
                } else {
                    __getChildNodes(child, data);
                }
            }
        }
    }
}

/**
 * Lecture de la valeur du premier child d'un noeud, si elle existe.
 *
 * @private
 * @memberof AutoConfResponseReader
 * @method __getChildValue
 * @param {DOMElement} node - a DOM node
 * @return {String} value - valeur du firstChild du noeud en entrée, ou chaîne vide.
 */
function __getChildValue (node) {
    var textNode;
    var value = "";

    if (node.hasChildNodes()) {
        textNode = node.firstChild;
        if (textNode.nodeType === 3 || textNode.nodeType === 4) { // 3 === node.TEXT_NODE
            value = textNode.nodeValue;
        }
    }
    return value;
}

/**
 * Vérification des attributs du service, dans la balise XLS de la réponse :
 *      version, namespaces, et namespace par défaut doivent correspondre à ceux attendus.
 *
 * @private
 * @memberof AutoConfResponseReader
 * @method __checkServiceAttributes
 * @param {DOMElement} viewContextNode - a DOM node, corresponding to XLS first tag.
 */
function __checkServiceAttributes (viewContextNode) {
    if (viewContextNode.attributes.length > 0) {
        // on récupère et parcourt les attributs de la balise XLS de la réponse
        var xlsAttributes = __getAttributes(viewContextNode);
        for (var att in xlsAttributes) {
            if (xlsAttributes.hasOwnProperty(att)) {
                // vérification de la version
                if (att === "version") {
                    if (xlsAttributes["version"] !== AutoConfResponseReader.VERSION) {
                        console.log("[AutoConfResponseReader] autoconf version is not the expected one : there may be errors in parsing");
                        return;
                    }
                }

                // on vérifie que l'uri du namespace par défaut est bien celle que l'on attend
                if (att === "xmlns") {
                    if (xlsAttributes[att] !== AutoConfResponseReader.NAMESPACES.xmlns) {
                        console.log("[AutoConfResponseReader] autoconf response default namespace is not the expected one");
                        return;
                    }
                    continue;
                }

                var prefix = att.split(":")[0];
                var ns = att.split(":")[1];

                // si on a un autre xmlns, on vérifie aussi les URI
                if (prefix === "xmlns" && ns) {
                    // si l'attribut correspond à un namespace défini dans le reader
                    if (AutoConfResponseReader.NAMESPACES[ns]) {
                        // il faut que les URI correspondent aussi.
                        if (AutoConfResponseReader.NAMESPACES[ns] !== xlsAttributes[att]) {
                            console.log("[AutoConfResponseReader] autoconf response " + att + " namespace is not the expected one");
                            return;
                        }
                    }
                }

                // pour finir on vérifie la localisation du schema XSD du service
                if (ns === "schemaLocation") {
                    if (xlsAttributes[att] !== AutoConfResponseReader.SCHEMALOCATION[0] && xlsAttributes[att] !== AutoConfResponseReader.SCHEMALOCATION[1]) {
                        console.log("[AutoConfResponseReader] autoconf response schema location is not the expected one");
                        return;
                    }
                }
            }
        }
    }
}

/* harmony default export */ __webpack_exports__["a"] = (AutoConfResponseReader);


/***/ }),
/* 64 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__CommonService__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Request_DirectGeocodeRequestFactory__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Response_DirectGeocodeResponseFactory__ = __webpack_require__(77);








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
        throw new TypeError(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("CLASS_CONSTRUCTOR", "Geocode"));
    }

    /**
     * Nom de la classe (heritage)
     * FIXME instance ou classe ?
     */
    this.CLASSNAME = "Geocode";

    // appel du constructeur par heritage
    __WEBPACK_IMPORTED_MODULE_3__CommonService__["a" /* default */].apply(this, arguments);

    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("Gp.Services.Geocode");
    this.logger.trace("[Constructeur Geocode (options)]");

    if (!options.location) {
        throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_MISSING", "location"));
    }

    // FIXME ECMAScript 5 support
    if (typeof options.location === "object" && Object.keys(options.location).length === 0) {
        throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_EMPTY", "location"));
    } else if (typeof options.location === "string" && options.location.length === 0) {
        throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_EMPTY", "location"));
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
Geocode.prototype = Object.create(__WEBPACK_IMPORTED_MODULE_3__CommonService__["a" /* default */].prototype, {
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

    this.request = __WEBPACK_IMPORTED_MODULE_4__Request_DirectGeocodeRequestFactory__["a" /* default */].build(options);

    // on teste si la requete a bien été construite !
    (!this.request)
        ? error.call(this, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_REQUEST_BUILD")))
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

        __WEBPACK_IMPORTED_MODULE_5__Response_DirectGeocodeResponseFactory__["a" /* default */].build(options);
    } else {
        error.call(this, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EMPTY")));
    }
};

/* harmony default export */ __webpack_exports__["a"] = (Geocode);


/***/ }),
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Formats_XLS__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Formats_XLS_LocationUtilityService__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Formats_XLS_LocationUtilityService_GeocodeFilterExtension__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Request_model_StreetAddress__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Request_model_PositionOfInterest__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Request_model_CadastralParcel__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Request_model_Administratif__ = __webpack_require__(76);
/**
 * Creation d'une requête OpenLS en mode POST ou GET
 * (Factory)
 *
 * @module DirectGeocodeRequestFactory
 * @alias Gp.Services.Geocode.Request.DirectGeocodeRequestFactory
 * @private
 */









var DirectGeocodeRequestFactory = {

    /**
     * interface unique
     *
     * @method build
     * @static
     * @param {Object} options - options definies dans le composant Geocode
     *
     * @example
     *   var options = {
     *      httpMethod:
     *      // options specifiques du service
     *      location:
     *      returnFreeForm:
     *      filterOptions:
     *      srs:
     *      maximumResponses:
     *   };
     *   var result = DirectGeocodeRequestFactory.build(options);
     *   if (!result) {
     *       // error...
     *   }
     * @returns {String} request
     */
    build : function (options) {
        // logger
        var logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("DirectGeocodeRequestFactory");
        logger.trace(["DirectGeocodeRequestFactory::build()"]);

        var request = null;

        // gestion des filtres (table de geocodage) !
        // par defaut, on les ajoute toute ...
        var oFilter = new __WEBPACK_IMPORTED_MODULE_3__Formats_XLS_LocationUtilityService_GeocodeFilterExtension__["a" /* default */]();
        oFilter.addFilterExtensions(new __WEBPACK_IMPORTED_MODULE_7__Request_model_Administratif__["a" /* default */]());
        oFilter.addFilterExtensions(new __WEBPACK_IMPORTED_MODULE_4__Request_model_StreetAddress__["a" /* default */]());
        oFilter.addFilterExtensions(new __WEBPACK_IMPORTED_MODULE_5__Request_model_PositionOfInterest__["a" /* default */]());
        oFilter.addFilterExtensions(new __WEBPACK_IMPORTED_MODULE_6__Request_model_CadastralParcel__["a" /* default */]());

        // objet LUS
        // on peut aussi par un objet XLS::GeocodeRequest
        var oLUS = new __WEBPACK_IMPORTED_MODULE_2__Formats_XLS_LocationUtilityService__["a" /* default */]({
            location : options.location,
            returnFreeForm : options.returnFreeForm,
            filterOptions : options.filterOptions
        });
        oLUS.addFilter(oFilter);

        // Format XLS
        var oXLS = new __WEBPACK_IMPORTED_MODULE_1__Formats_XLS__["a" /* default */]({
            srsName : options.srs,
            maximumResponses : options.maximumResponses
        });
        oXLS.namespace = true;
        oXLS.setService(oLUS);

        // request brute !
        request = oXLS.build();

        // en mode GET, la requête est encodée
        // et le param. 'qxml' est ajouté
        if (options.httpMethod === "GET") {
            var myRequest = "qxml=" +
                encodeURIComponent(request)
                    .replace(/-/g, "%2D")
                    .replace(/_/g, "%5F")
                    .replace(/\./g, "%2E")
                    .replace(/!/g, "%21")
                    .replace(/~/g, "%7E")
                    .replace(/\*/g, "%2A")
                    .replace(/'/g, "%27")
                    .replace(/\(/g, "%28")
                    .replace(/\)/g, "%29");
            request = myRequest;
        }

        logger.trace(request);

        return request;
    }
};

/* harmony default export */ __webpack_exports__["a"] = (DirectGeocodeRequestFactory);


/***/ }),
/* 66 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);


/**
 * @classdesc
 *
 * Entête de la requête XSL
 *
 * @example
 * // header XSL
 * header = new RequestHeader ();
 * header.srsName = "epsg:4326";
 * header.toString();
 * // out ->
 * // <RequestHeader srsName="epsg:4326"/>
 *
 * @constructor
 * @alias Gp.Formats.XLS.RequestHeader
 * @param {Object} options - options
 * @param {Object}   options.srsName - projection
 * @param {Function} options.onsuccess - function callback success (TODO)
 * @param {Function} options.onerror   - function callback error   (TODO)
 *
 * @private
 */
function RequestHeader (options) {
    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger();
    this.logger.trace("[Constructeur RequestHeader ()]");

    if (!(this instanceof RequestHeader)) {
        throw new TypeError("RequestHeader constructor cannot be called as a function.");
    }

    // options par defaut
    this.options = options || {
        srsName : "EPSG:4326"
    };

    // et on ajoute les options en paramètre aux options par défaut
    for (var opt in options) {
        if (options.hasOwnProperty(opt)) {
            this.options[opt] = options[opt];
        }
    }
}

RequestHeader.prototype = {

    /**
     * @lends module:RequestHeader#
     */

    /**
     * request (out)
     * @type {String}
     */
    requestString : null,

    /**
     * Template de la requête.
     * substitution des valeurs suivantes :
     * __SRSNAME__
     */
    template : "<RequestHeader srsName=\"__SRSNAME__\"/>",

    /**
     * Constructeur (alias)
     */
    constructor : RequestHeader,

    /**
     * toString
     * @returns {String} requête
     */
    toString : function () {
        var template = null;
        template = this.template;
        template = template.replace(/__SRSNAME__/g, this.options.srsName);
        this.requestString = template;
        return this.requestString;
    }
};

/* harmony default export */ __webpack_exports__["a"] = (RequestHeader);


/***/ }),
/* 67 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* jshint bitwise: false */


/**
 * @classdesc
 *
 * Requête XLS
 *
 * @example
 * // request XSL
 * request = new Request ();
 * request.maximumResponses = 26;
 * request.methodName = "GeocodeRequest";
 * request.version = "1.2";
 * request.toString();
 * // out ->
 * // <Request maximumResponses="26" methodName="GeocodeRequest" requestID="uid1349081498314_388" version="1.2">
 * //   <!-- __LUS__ -->
 * //  </Request>
 *
 * @constructor
 * @alias Gp.Formats.XLS.Request
 * @param {Object} options - options
 * @param {Object}   options.maximumResponses - 25
 * @param {String}   options.methodName - nom de l'objet LUS, "GeocodeRequest" | "ReverseGeocodeRequest"
 * @param {String}   options.version - '1.2'
 * @param {Function} options.onsuccess - function callback success (TODO)
 * @param {Function} options.onerror   - function callback error   (TODO)
 *
 * @private
 */
function Request (options) {
    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger();
    this.logger.trace("[Constructeur Request ()]");

    if (!(this instanceof Request)) {
        throw new TypeError("Request constructor cannot be called as a function.");
    }

    // options par defaut
    this.options = options || {
        maximumResponses : 25,
        methodName : null,
        version : "1.2"
    };

    // et on ajoute les options en paramètre aux options par défaut
    for (var opt in options) {
        if (options.hasOwnProperty(opt)) {
            this.options[opt] = options[opt];
        }
    }
}

Request.prototype = {

    /**
     * @lends module:Request#
     */

    /**
     * request (out)
     * @type {String}
     */
    requestString : null,

    /**
     * Template de la requête.
     * substitution des valeurs suivantes :
     * __MAXRESPONSES__, __METHODNAME__, __UUID__, __VERSION__
     * __REQUESTSERVICE__
     */
    template : "<Request maximumResponses=\"__MAXRESPONSES__\" methodName=\"__METHODNAME__\" requestID=\"__UUID__\" version=\"__VERSION__\">" +
        "<!-- __REQUESTSERVICE__ -->" +
        "</Request>",

    /**
     * Constructeur (alias)
     */
    constructor : Request,

    /**
     * an rfc4122 version 4 compliant guid
     * @returns {String} guid
     */
    guid : function () {
        // INFO
        // cf. http://byronsalau.com/blog/how-to-create-a-guid-uuid-in-javascript/
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    /**
     * toString
     * @returns {String} requête
     */
    toString : function () {
        var template = null;
        template = this.template;
        template = template.replace(/__MAXRESPONSES__/g, this.options.maximumResponses);
        template = template.replace(/__METHODNAME__/g, this.options.methodName);
        template = template.replace(/__UUID__/g, this.guid());
        template = template.replace(/__VERSION__/g, this.options.version);

        this.requestString = template;
        return this.requestString;
    }
};

/* harmony default export */ __webpack_exports__["a"] = (Request);


/***/ }),
/* 68 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model_Address__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__GeocodeFilterExtension__ = __webpack_require__(13);




/**
 * @classdesc
 * Requête de geocodage direct
 *
 * ```
 * XSD
 * Geocodage direct (balise xsd) :
 *   element ref="RequestHeader" [ (attribute name="clientName" attribute name="clientPassword" attribute name="sessionID" attribute name="srsName" attribute name="MSID") ]
 *     element name="Request" attribute name="methodName" attribute name="version" attribute name="requestID" [ attribute name="maximumResponses" ]
 *       element name="GeocodeRequest" attribute name="returnFreeForm"
 *         element ref="xls:Address"
 * ```
 *
 * @example
 * // creation de l'objet Geocode an ajoutant un objet Address
 * req = new GeocodeRequest ();
 * req.returnFreeForm = true; // TODO !
 * req.addAddress (new Address ({
 *      location : "saint mandé",
 *      type : ['PositionOfInterest'],
 *      filter : {
 *          (...)
 *      }
 * }));
 * req.toString();
 * // out ->
 * // <GeocodeRequest>
 * //   <Address countryCode="PositionOfInterest">
 * //     <freeFormAddress>saint mandé</freeFormAddress>
 * //   </Address>
 * // </GeocodeRequest>
 *
 * // creation de l'objet Geocode avec les options uniquement
 * req = new GeocodeRequest ({
 *      location : "saint mandé",
 *      returnFreeForm : true,
 *      filterOptions : {
 *          type : ['PositionOfInterest'],
 *          (...)
 *      }
 * });
 * req.toString();
 * // out ->
 * // <GeocodeRequest>
 * //   <Address countryCode="PositionOfInterest">
 * //     <freeFormAddress>saint mandé</freeFormAddress>
 * //   </Address>
 * // </GeocodeRequest>
 * @constructor
 *
 * @alias Gp.Formats.XLS.LocationUtilityService.GeocodeRequest
 * @param {Object} options - options
 * @param {Object}   options.location - location
 * @param {String}   options.returnFreeForm - returnFreeForm
 * @param {String}   options.filterOptions - filtres
 * @param {Function} options.onsuccess - function callback success (TODO)
 * @param {Function} options.onerror   - function callback error   (TODO)
 *
 * @private
 */
function GeocodeRequest (options) {
    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger();
    this.logger.trace("[Constructeur GeocodeRequest ()]");

    if (!(this instanceof GeocodeRequest)) {
        throw new TypeError("GeocodeRequest constructor cannot be called as a function.");
    }

    // options par defaut
    this.options = options || {};

    // et on ajoute les options en paramètre aux options par défaut
    for (var opt in options) {
        if (options.hasOwnProperty(opt)) {
            this.options[opt] = options[opt];
        }
    }

    // TODO
    // gestion de l'option 'returnFreeForm' si elle n'est pas renseignée dans les options !

    /**
     * Nom de la classe (heritage)
     */
    this.CLASSNAME = "GeocodeRequest";
}

GeocodeRequest.prototype = {

    /**
     * @lends module:GeocodeRequest#
     */

    /**
     * request (out)
     * @type {String}
     */
    strRequest : null,

    /**
     * Addresse
     * @type {Address}
     */
    oAddress : null,

    /**
     * Filter
     * @type {GeocodeFilterExtension}
     */
    oFilter : null,

    /**
     * Template de la requête.
     * substitution des valeurs suivantes :
     * __ADDRESS__, __RETURNFREEFORM__
     */
    template : "<GeocodeRequest returnFreeForm=\"__RETURNFREEFORM__\">" +
        "__ADDRESS__" +
        "</GeocodeRequest>",

    /**
     * Ajout d'un objet de type Adresse
     *
     * @param {Object} oAddress - Adresse
     */
    addAddress : function (oAddress) {
        if (oAddress instanceof __WEBPACK_IMPORTED_MODULE_1__model_Address__["a" /* default */]) {
            this.oAddress = oAddress;
        }
    },

    /**
     * Ajout d'un objet de type GeocodeFilterExtension
     *
     * @param {Object} oFilter - GeocodeFilterExtension
     */
    addFilter : function (oFilter) {
        // FIXME gestion des filtres à partir des tables de geocodages
        if (oFilter instanceof __WEBPACK_IMPORTED_MODULE_2__GeocodeFilterExtension__["a" /* default */]) {
            this.oFilter = oFilter;
        }
    },

    /**
     * Constructeur (alias)
     */
    constructor : GeocodeRequest,

    /**
     * toString
     *
     * @returns {String} requête
     */
    toString : function () {
        var template = "";
        template = this.template;

        // soit on a déjà un objet Address instancié,
        // sinon, on le fabrique via les options
        if (!this.oAddress) {
            var settings = {};
            settings.location = this.options.location;
            settings.type = this.options.filterOptions.type || ["StreetAddress"];
            settings.filter = this.options.filterOptions;
            delete settings.filter.type; // on ne met pas le 'type' dans les filtres...

            // gestion des filtres
            if (this.oFilter) {
                // on reconstruit les filtres
                settings.filter = {};

                // on determine la liste des filtres possibles
                // pour chaque table de geocodage en param
                for (var idx in settings.type) {
                    var filter = settings.type[idx];
                    var oFilter = this.oFilter.getFilter(filter);

                    if (!oFilter) {
                        this.logger.warn("Le filtre '" + filter + "' n'existe pas !?");
                        continue;
                    }

                    var mFilter = this.options.filterOptions;

                    // correspondances des attributs de filtres possibles avec ceux qui sont en options
                    var attributs = oFilter.attributesList;
                    for (var idxe = 0; idxe < attributs.length; idxe++) {
                        var key = attributs[idxe];
                        if (mFilter[key]) {
                            var matchingKey = oFilter.serviceAttributes[idxe];
                            oFilter.placeAttributes[matchingKey] = mFilter[key];
                            this.logger.trace("Selection du filtre '" + key + "' sur le type '" + filter + "'.");
                        }
                    }

                    // ajout des valeurs des filtres
                    var places = oFilter.placeAttributes;
                    for (var kplace in places) {
                        if (places.hasOwnProperty(kplace)) {
                            settings.filter[kplace] = places[kplace];
                        }
                    }
                }
            }

            this.oAddress = new __WEBPACK_IMPORTED_MODULE_1__model_Address__["a" /* default */](settings);
            if (!this.oAddress) {
                throw new Error("La construction de l'adresse n'est pas correctement definie !?");
            }
        }

        // FIXME gestion des filtres pour un objet Address déjà instancié ?

        template = template.replace(/__ADDRESS__/g, this.oAddress.toString());
        template = template.replace(/__RETURNFREEFORM__/g, (this.options.returnFreeForm) ? "true" : "false");

        this.strRequest = template;
        return this.strRequest;
    }
};

/* harmony default export */ __webpack_exports__["a"] = (GeocodeRequest);


/***/ }),
/* 69 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);



/**
 * @classdesc
 *
 * Location type "Address".
 *
 * Modèles de classes :
 * ------------------
 * ```
 *
 *                Address
 *            (est composé de)
 *           ______ | _________ _________________
 *          /       |          \                 \
 *      Place (StreetAddress ou FreeFormAddress) PostalCode
 *       (*)       _|_
 *                /   \
 *           Street   Building
 * ```
 * ```
 * XSD
 * Address (balise xsd) :
 *   ex. <Address countryCode="StreetAddress"><freeFormAddress>1 r de paris saint denis</freeFormAddress></Address>
 *   attribute name="countryCode"
 *     element name="freeFormAddress"
 *     element ref="xls:Place"
 *     element ref="gml:Envelope"
 *  ou
 *   ex. <Address countryCode="StreetAddress"><StreetAddress><Street>1 rue Marconi</Street></StreetAddress><Place type="Municipality">Metz</Place><PostalCode>57000</PostalCode></Address>
 *   attribute name="countryCode"
 *     element ref="xls:StreetAddress"
 *     element ref="xls:PostalCode"
 *     element ref="xls:Place"
 *     element ref="gml:Envelope"
 * ```
 *
 * @example
 * // simple
 * adr = new Address ({
 *    location : "2 av pasteur, Saint-Mandée",
 *    type : ["StreetAddress"],
 *    filter : {}
 * });
 * adr.toString();
 * // -> out
 * // <Address countryCode="StreetAddress">
 * //   <freeFormAddress>2 av pasteur, Saint-Mandée</freeFormAddress>
 * // </Address>
 *
 * // avec filtre
 * adr = new Address ({
 *    location : {
 *      number : 2,
 *      street : "av pasteur",
 *      city : "Saint-Mandée", // FIXME filter Place "commune" ou "municipality" ?
 *      postalCode : "94166"   // FIXME filter Place ou balise PostalCode ?
 *    },
 *    type : ["StreetAddress"],
 *    filter : {
 *      territory : "FR",
 *      department : "94"
 *    }
 * });
 * adr.toString();
 * // -> out
 * // <Address countryCode="StreetAddress">
 * //   <StreetAddress>
 * //   <Building number="2"/>
 * //   <Street>2 av pasteur</Street>
 * // </StreetAddress>
 * // <Place type="municipality">Saint-Mandée</Place>
 * // <Place type="departement">94</Place>
 * // <Place type="territoire">FR</Place>
 * // <PostalCode>94166</PostalCode>
 * // </Address>
 *
 * // avec bbox
 * adr = new Address ({
 *    location : "2 av pasteur, Saint-Mandée",
 *    type : ["StreetAddress"],
 *    filter : {
 *      bbox : {left:1, right:2, top:2, bottom:0}
 *    }
 * });
 * adr.toString();
 * // -> out
 * // <Address countryCode="StreetAddress">
 * //   <freeFormAddress>2 av pasteur, Saint-Mandée</freeFormAddress>
 * //   <gml:Envelope>
 * //     <gml:lowerCorner>1 0</gml:lowerCorner>
 * //     <gml:upperCorner>2 2</gml:upperCorner>
 * //   </gl:Envelope>
 * // </Address>
 *
 * @constructor
 * @alias Gp.Formats.XLS.LocationUtilityService.Address
 * @param {Object} options - options
 * @param {Object} options.location - location
 * @param {String} options.type - type
 * @param {String} options.filter - filtres
 * @param {String} options.filter.* - Filtré en fonction des tables de geocodage interrogées
 *
 * @private
 */
function Address (options) {
    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("Address");
    this.logger.trace("[Constructeur Address ()]");

    if (!(this instanceof Address)) {
        throw new TypeError("Address constructor cannot be called as a function.");
    }

    // param par defaut
    this.options = options || {
        location : {},
        type : ["StreetAddress"],
        filter : {}
    };

    // param obligatoire
    if (!options.location) {
        throw new Error("l'option 'location' n'est pas renseignée !");
    }

    // et on ajoute les options en paramètre aux options par défaut
    for (var opt in options) {
        if (options.hasOwnProperty(opt)) {
            this.options[opt] = options[opt];
        }
    }
}

/**
 * @lends module:Address#
 */
Address.prototype = {

    /**
     * Constructeur (alias)
     */
    constructor : Address,

    /**
     * request (out)
     * @type {String}
     */
    requestString : null,

    /**
     * Template de la requête.
     *
     * substitution des valeurs suivantes :
     * - address :  __COUNTRYCODE__, __LOCATION__, __PLACE__, __POSTALCODE__, __ENVELOPE__
     * - freeFormAddress : __FREEFORMADDRESSVALUE__
     * - streetAddress : __STREET__, __BUILDING__
     * - street : __STREETVALUE__
     * - building : __BUILDINGVALUE__
     * - place : __PLACEATYPE__, __PLACEVALUE__
     * - postalCode : __POSTALCODEVALUE__
     * - gml:envelope : __LEFT__ __BOTTOM__ __RIGHT__ __TOP__
     *
     * @todo gestion de l"indentation
     */
    template : {
        address : "<Address countryCode=\"__COUNTRYCODE__\">" +
            "__LOCATION__" +
            "__PLACE__" +
            "__POSTALCODE__" +
            "__ENVELOPE__" +
            "</Address>",
        location : {
            freeFormAddress : "<freeFormAddress>__FREEFORMADDRESSVALUE__</freeFormAddress>",
            streetAddress : {
                container : "<StreetAddress>" +
                    "__STREET__" +
                    "__BUILDING__" +
                    "</StreetAddress>",
                building : "<Building number=\"__BUILDINGVALUE__\"/>",
                street : "<Street>__STREETVALUE__</Street>"
            }
        },
        place : "<Place type=\"__PLACETYPE__\">__PLACEVALUE__</Place>",
        postalCode : "<PostalCode>__POSTALCODEVALUE__</PostalCode>",
        envelope : "<gml:Envelope>" +
            "<gml:lowerCorner>__LEFT__ __BOTTOM__</gml:lowerCorner>" +
            "<gml:upperCorner>__RIGHT__ __TOP__</gml:upperCorner>" +
            "</gml:Envelope>"
    }

};

/**
 * toString
 *
 * @returns {String} requête
 */
Address.prototype.toString = function () {
    var template = null;
    template = this.template.address;
    template = template.replace(/__COUNTRYCODE__/g, this.options.type);

    // on a une adresse structurée ou libre ?
    if (typeof this.options.location === "string") {
        // balise freeFormeAddress
        var tmplFreeFormAddress = this.template.location.freeFormAddress;
        tmplFreeFormAddress = tmplFreeFormAddress.replace(/__FREEFORMADDRESSVALUE__/g, this.options.location);
        template = template.replace(/__LOCATION__/g, tmplFreeFormAddress);
    } else {
        // balises Street et Building
        var tmplBuilding = "";
        var tmplStreet = "";

        if (this.options.location.number) {
            tmplBuilding = this.template.location.streetAddress.building;
            tmplBuilding = tmplBuilding.replace(/__BUILDINGVALUE__/g, this.options.location.number);
        }

        if (this.options.location.street) {
            tmplStreet = this.template.location.streetAddress.street;
            tmplStreet = tmplStreet.replace(/__STREETVALUE__/g, this.options.location.street);
        }

        // balise streetAddress
        var tmplStreetAddress = this.template.location.streetAddress.container;
        tmplStreetAddress = tmplStreetAddress.replace(/__STREET__/g, tmplStreet);
        tmplStreetAddress = tmplStreetAddress.replace(/__BUILDING__/g, tmplBuilding);
        template = template.replace(/__LOCATION__/g, tmplStreetAddress);
    }

    // a t on un filtre de type PostalCode ?
    var tmplPostalCode = "";
    if (this.options.location.postalCode) {
        tmplPostalCode = this.template.postalCode;
        tmplPostalCode = tmplPostalCode.replace(/__POSTALCODEVALUE__/g, this.options.location.postalCode);
    }

    // a t on un filtre de type GML::Envelope ?
    var tmplEnvelope = "";
    if (this.options.filter) {
        var bbox = this.options.filter.bbox;
        if (bbox) {
            tmplEnvelope = this.template.envelope;
            tmplEnvelope = tmplEnvelope.replace(/__LEFT__/g, bbox.left);
            tmplEnvelope = tmplEnvelope.replace(/__BOTTOM__/g, bbox.bottom);
            tmplEnvelope = tmplEnvelope.replace(/__RIGHT__/g, bbox.right);
            tmplEnvelope = tmplEnvelope.replace(/__TOP__/g, bbox.top);
        }
    }

    // liste des filtres Place
    var Places = [];

    // a t on des filtres de type Place ?
    var tmplPlace = "";
    if (this.options.filter) {
        var filters = this.options.filter;
        for (var filter in filters) {
            if (filter === "bbox") {
                continue;
            }
            // FIXME gestion des filtres spécifiques IGN ?
            tmplPlace = this.template.place;
            tmplPlace = tmplPlace.replace(/__PLACETYPE__/g, filter);
            tmplPlace = tmplPlace.replace(/__PLACEVALUE__/g, filters[filter]);
            Places.push(tmplPlace);
        }
    }

    // a t on un filtre de type Place dans location ?
    var tmplPlaceCity = "";
    if (this.options.location.city) {
        tmplPlaceCity = this.template.place;
        tmplPlaceCity = tmplPlaceCity.replace(/__PLACETYPE__/g, "Municipality");
        tmplPlaceCity = tmplPlaceCity.replace(/__PLACEVALUE__/g, this.options.location.city);
        Places.push(tmplPlaceCity);
    }

    template = template.replace(/__POSTALCODE__/g, tmplPostalCode);
    template = template.replace(/__PLACE__/g, Places.join("\n"));
    template = template.replace(/__ENVELOPE__/g, tmplEnvelope);

    this.requestString = template;
    return this.requestString;
};

/* harmony default export */ __webpack_exports__["a"] = (Address);


/***/ }),
/* 70 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model_Position__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__model_Preference__ = __webpack_require__(72);





/**
 * @classdesc
 *
 * Requête de geocodage inverse
 *
 * XSD
 * ```
 * Geocodage inverse (balise xsd) :
 *   element ref="RequestHeader" [ (attribute name="clientName" attribute name="clientPassword" attribute name="sessionID" attribute name="srsName" attribute name="MSID") ]
 *     element name="Request" attribute name="methodName" attribute name="version" attribute name="requestID" [ attribute name="maximumResponses" ]
 *       element name="ReverseGeocodeRequest"
 *         element ref="xls:Position"
 *         element name="ReverseGeocodePreference" (enumeration)
 * ```
 *
 * @example
 * // creation de l"objet ReverseGeocode
 * req = new ReverseGeocodeRequest ();
 * req.addPosition (new Position (position:{x: , y: }));
 * req.addPreference (["StreetAddress"]);
 * req.toString();
 * // out ->
 * // <ReverseGeocodeRequest>
 * //     <Position>
 * //       <gml:Point xmlns:gml="http://www.opengis.net/gml">
 * //           <gml:pos>50.347775 3.205098</gml:pos>
 * //       </gml:Point>
 * //     </Position>
 * //     <ReverseGeocodePreference>StreetAddress</ReverseGeocodePreference>
 * //  </ReverseGeocodeRequest>
 * @constructor
 * @alias Gp.Formats.XLS.ReverseGeocodeRequest
 * @param {Object} options - options
 * @param {Object}   options.position - position
 * @param {String}   options.returnFreeForm - returnFreeForm
 * @param {String}   options.filterOptions - filtres
 * @param {Function} options.onsuccess - function callback success (TODO)
 * @param {Function} options.onerror   - function callback error   (TODO)
 *
 * @private
 */
function ReverseGeocodeRequest (options) {
    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger();
    this.logger.trace("[Constructeur ReverseGeocodeRequest ()]");

    if (!(this instanceof ReverseGeocodeRequest)) {
        throw new TypeError("ReverseGeocodeRequest constructor cannot be called as a function.");
    }

    // options par defaut
    this.options = options || {};

    // et on ajoute les options en paramètre aux options par défaut
    for (var opt in options) {
        if (options.hasOwnProperty(opt)) {
            this.options[opt] = options[opt];
        }
    }

    /**
     * Nom de la classe (heritage)
     */
    this.CLASSNAME = "ReverseGeocodeRequest";
}

ReverseGeocodeRequest.prototype = {

    /**
     * @lends module:ReverseGeocodeRequest#
     */

    /**
     * request (out)
     * @type {String}
     */
    strRequest : null,

    /**
     * Position
     * @type {Position}
     */
    oPosition : null,

    /**
     * Preference
     * @type {Preference}
     */
    oPreference : null,

    /**
     * Constructeur (alias)
     */
    constructor : ReverseGeocodeRequest,

    /**
     * Template de la requête.
     * substitution des valeurs suivantes :
     * __POSITION__, __PREFERENCE__, __RETURNFREEFORM__
     */
    template : "<ReverseGeocodeRequest returnFreeForm=\"__RETURNFREEFORM__\">" +
        "__POSITION__" +
        "__PREFERENCE__" +
        "</ReverseGeocodeRequest>",

    /**
     * Ajout d"un objet de type Position
     *
     * @param {Object} oPosition - Position
     */
    addPosition : function (oPosition) {
        if (oPosition instanceof __WEBPACK_IMPORTED_MODULE_1__model_Position__["a" /* default */]) {
            this.oPosition = oPosition;
        }
    },

    /**
     * Ajout d"une liste de table de référence LUS :
     * [StreetAddress, PointOfInterest, CadastralParcel, Administrativ]
     *
     * @param {Object} oPreference - Preference
     */
    addPreferences : function (oPreference) {
        if (oPreference instanceof __WEBPACK_IMPORTED_MODULE_2__model_Preference__["a" /* default */]) {
            this.oPreference = oPreference;
        }
    },

    /**
     * toString
     * @returns {String} requête
     */
    toString : function () {
        var template = "";
        template = this.template;

        // si on a déjà un objet Preference instancié,
        // sinon, on le fabrique via les options
        if (!this.oPreference) {
            this.oPreference = new __WEBPACK_IMPORTED_MODULE_2__model_Preference__["a" /* default */](this.options.filterOptions.type || ["StreetAddress"]);
            if (!this.oPreference) {
                throw new Error("Les preferences ne sont pas definies !?");
            }
        }
        template = template.replace(/__PREFERENCE__/g, this.oPreference.toString());

        // si on a déjà un objet Position instancié,
        // sinon, on le fabrique via les options
        if (!this.oPosition) {
            var settings = {
                position : this.options.position,
                filter : {}
            };

            // FIXME gestion des filtres ?
            if (this.options.filterOptions) {
                settings.filter = this.options.filterOptions;
                delete settings.filter.type; // pas besoin ?
            }
            this.oPosition = new __WEBPACK_IMPORTED_MODULE_1__model_Position__["a" /* default */](settings);
            if (!this.oPosition) {
                throw new Error("La position et ses filtres ne sont pas definis !?");
            }
        }
        template = template.replace(/__POSITION__/g, this.oPosition.toString());
        template = template.replace(/__RETURNFREEFORM__/g, (this.options.returnFreeForm) ? "true" : "false");

        this.strRequest = template;
        return this.strRequest;
    }
};

/* harmony default export */ __webpack_exports__["a"] = (ReverseGeocodeRequest);


/***/ }),
/* 71 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);


/**
 * @classdesc
 * Location de type Position
 *
 * ```
 * XSD
 * Position (balise xsd) :
 *   ex. <Position><gml:Point xmlns:gml="http://www.opengis.net/gml"><gml:pos>50.347775 3.205098</gml:pos></gml:Point></Position>
 *   ex. <Position><gml:CircleByCenterPoint xmlns:gml="http://www.opengis.net/gml"><gml:pos>48.85978570614691 2.2913572761128878</gml:pos><gml:radius>1000</gml:radius></gml:CircleByCenterPoint></Position>
 *   (au choix)
 *   element ref="gml:Point"
 *   element ref="gml:CircleByCenterPoint"
 *   element ref="gml:Polygon"
 *   element ref="gml:MultiPolygon"
 * ```
 *
 * FIXME les autres elements ne sont pas implémentés (QoP, Speed, Direction, Time, ...) ?
 *
 * ```
 * template : "<Position>
 *                  __GMLPOINT__
 *                  __GMLFILTER__
 *             </Position>"
 * ```
 * ```
 * GML : {
 *  pos     : "<gml:pos>__X__ __Y__</gml:pos>",
 *  point   : "<gml:Point xmlns:gml=\"http://www.opengis.net/gml\">__POS__</gml:Point>",
 *  circle  : "<gml:CircleByCenterPoint xmlns:gml=\"http://www.opengis.net/gml\">__POS__<gml:radius>__RADIUS__</gml:radius></gml:CircleByCenterPoint>",
 *  // not yet implemented !
 *  polygon      : "",
 *  multipolygon : ""
 * }
 * ```
 *
 * @constructor
 * @alias Gp.Formats.XLS.LocationUtilityService.Position
 * @param {Object} options - options données en entrée
 * @param {Object} options.position - x/y
 * @param {Object} options.filter - filtre
 * @param {Object} options.filter.circle - un cercle
 * @param {Object} options.filter.polygon - un polygone
 *
 * @private
 */
function Position (options) {
    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("Position");
    this.logger.trace("[Constructeur Position ()]");

    if (!(this instanceof Position)) {
        throw new TypeError("Position constructor cannot be called as a function.");
    }

    // param par defaut
    this.options = options || {};

    // param obligatoire
    if (!options.position) {
        throw new Error("l'option 'position' n'est pas renseignée !");
    }

    // et on ajoute les options en paramètre aux options par défaut
    for (var opt in options) {
        if (options.hasOwnProperty(opt)) {
            this.options[opt] = options[opt];
        }
    }
}

/**
 * @lends module:Position#
 */
Position.prototype = {

    /**
     * Constructeur (alias)
     */
    constructor : Position,

    /**
     * request (out)
     * @type {String}
     */
    requestString : null,

    /**
     * Template de la requête.
     *
     * substitution des valeurs suivantes :
     * __GMLPOINT__ __GMLFILTER__
     * __X__ __Y__ __RADIUS__
     * __XY__
     * @todo indentation XML
     * @todo implementation classe GML
     */
    template : {
        position : "<Position>" +
            "__GMLPOINT__" +
            "__GMLFILTER__" +
            "</Position>",
        gml : {
            point : "<gml:Point xmlns:gml=\"http://www.opengis.net/gml\"><gml:pos>__X__ __Y__</gml:pos></gml:Point>",
            pos : null,
            filter : {
                bbox : "<gml:Envelope xmlns:gml=\"http://www.opengis.net/gml\">" +
                    "<gml:lowerCorner>__LEFT__ __BOTTOM__</gml:lowerCorner>" +
                    "<gml:upperCorner>__RIGHT__ __TOP__</gml:upperCorner>" +
                    "</gml:Envelope>",
                circle : "<gml:CircleByCenterPoint xmlns:gml=\"http://www.opengis.net/gml\"><gml:pos>__X__ __Y__</gml:pos><gml:radius>__RADIUS__</gml:radius></gml:CircleByCenterPoint>",
                polygon : "<gml:Polygon xmlns:gml=\"http://www.opengis.net/gml\"><gml:exterior><gml:LinearRing><gml:posList>__XY__</gml:posList></gml:LinearRing></gml:exterior></gml:Polygon>",
                multipolygon : null
            }
        }
    }
};

/**
 * toString
 *
 * @returns {String} requête
 */
Position.prototype.toString = function () {
    var template = this.template.position;

    var tmplGmlPoint = this.template.gml.point;
    tmplGmlPoint = tmplGmlPoint.replace(/__X__/g, this.options.position.x);
    tmplGmlPoint = tmplGmlPoint.replace(/__Y__/g, this.options.position.y);

    var tmplGmlFilter = "";
    if (this.options.filter) {
        var filter = this.options.filter;

        for (var name in filter) {
            switch (name) {
                case "circle":
                    tmplGmlFilter = this.template.gml.filter[name];
                    tmplGmlFilter = tmplGmlFilter.replace(/__X__/g, filter[name].x);
                    tmplGmlFilter = tmplGmlFilter.replace(/__Y__/g, filter[name].y);
                    tmplGmlFilter = tmplGmlFilter.replace(/__RADIUS__/g, filter[name].radius);
                    break;
                case "bbox":
                    tmplGmlFilter = this.template.gml.filter[name];
                    tmplGmlFilter = tmplGmlFilter.replace(/__LEFT__/g, filter[name].left);
                    tmplGmlFilter = tmplGmlFilter.replace(/__BOTTOM__/g, filter[name].bottom);
                    tmplGmlFilter = tmplGmlFilter.replace(/__RIGHT__/g, filter[name].right);
                    tmplGmlFilter = tmplGmlFilter.replace(/__TOP__/g, filter[name].top);
                    break;
                case "polygon":
                    // FIXME implementation simple du polygone !
                    // aucun test de fermeture du polygone, ni de gestion des trous !
                    tmplGmlFilter = this.template.gml.filter[name];
                    var strPoints = "";
                    var lstPoints = filter[name];
                    for (var i = 0; i < lstPoints.length; i++) {
                        var coord = lstPoints[i];
                        if (Array.isArray(coord)) {
                            this.logger.error("Holes are not implemented !");
                            break;
                        }
                        if ((coord.x && coord.y) || (coord.x === 0 || coord.y === 0)) {
                            strPoints += coord.x + " " + coord.y;
                        }
                        if (lstPoints.length !== i + 1) {
                            strPoints += " ";
                        }
                    }
                    tmplGmlFilter = tmplGmlFilter.replace(/__XY__/g, strPoints);
                    break;
                case "multipolygon":
                    this.logger.warn("Filter '" + name + "' is not yet implemented !");
                    break;
                default:
                    this.logger.error("This filter '" + name + "' is not useful !");
            }
        }
    }

    template = template.replace(/__GMLPOINT__/g, tmplGmlPoint);
    template = template.replace(/__GMLFILTER__/g, tmplGmlFilter);

    this.requestString = template;
    return this.requestString;
};

/* harmony default export */ __webpack_exports__["a"] = (Position);


/***/ }),
/* 72 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);


/**
 * @classdesc
 *
 * Preference (Reverse)
 *
 * FIXME liste des types de tables de geocodage
 *
 * ```
 * template : "<ReverseGeocodePreference>__TYPE__</ReverseGeocodePreference>"
 * ```
 *
 * @constructor
 * @alias Gp.Formats.XLS.LocationUtilityService.Preference
 * @param {String} type - type de table de geocodage
 *
 * @private
 *
 */

function Preference (type) {
    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("Preference");
    this.logger.trace("[Constructeur Preference ()]");

    if (!(this instanceof Preference)) {
        throw new TypeError("Preference constructor cannot be called as a function.");
    }

    /**
     * type de table de geocodage
     * @type {Array.<String>}
     */
    this.type = type;
}

/**
 * @lends module:Preference#
 */
Preference.prototype = {

    /**
     * Constructeur (alias)
     */
    constructor : Preference,

    /**
     * request (out)
     * @type {String}
     */
    requestString : null,

    /**
     * Template de la requête.
     *
     * substitution des valeurs suivantes :
     *  __TYPE__
     *
     */
    template : "<ReverseGeocodePreference>__TYPE__</ReverseGeocodePreference>"
};

/**
 * toString
 *
 * @returns {String} requête
 */
Preference.prototype.toString = function () {
    var Preferences = [];
    var tmplPreference = "";
    for (var idx = 0; idx < this.type.length; idx++) {
        tmplPreference = this.template;
        tmplPreference = tmplPreference.replace(/__TYPE__/g, this.type[idx]);
        Preferences.push(tmplPreference);
    }

    this.strRequest = Preferences.join("\n");
    return this.strRequest;
};

/* harmony default export */ __webpack_exports__["a"] = (Preference);


/***/ }),
/* 73 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__GeocodeLocation__ = __webpack_require__(7);



/**
 * @classdesc
 * Format des attributs d'un résultat de géocodage de type StreetAddress.
 *
 * @constructor
 * @alias Gp.Services.Geocode.Request.StreetAddress
 * @private
 */
function StreetAddress () {
    if (!(this instanceof StreetAddress)) {
        throw new TypeError("StreetAddress constructor cannot be called as a function.");
    }

    // INFO
    // appel du constructeur de la classe mère
    // avec passage de param.
    __WEBPACK_IMPORTED_MODULE_0__GeocodeLocation__["a" /* default */].apply(this, arguments);

    /**
     * Nom de la classe (heritage)
     * @type {String}
     */
    this.CLASSNAME = "StreetAddress";

    /**
     * Liste des attributs possibles pour une GeocodeLocation de type StreetAddress
     * - **bbox** : Emprise de l'adresse dans le système de coordonnées demandé {left, right, top, bottom}. *{Object}*
     * - **ID** : Identifiant BD ADRESSE dans le cas où le résultat est une adresse. *{String}*
     * - **IDTR** : Identifiant "Route Adresse" de la voie portant l'adresse dans la base BD ADRESSE. *{String}*
     * - **quality** : Indicateur de qualité du géocodage (pour plus d'infos : http://api.ign.fr/tech-docs-js/fr/developpeur/search.html *{String}*
     * - **territory** : Code du territoire français où se situe l'adresse *{String}*
     * - **commune** : Ville l'adresse. *{String}*
     * - **department** : Département l'adresse. *{String}*
     * - **insee** : Code INSEE de l'adresse. *{Number}*
     * - **municipality** : Municipalité de l'adresse. *{String}*
     */

    this.attributesList = ["bbox", "ID", "IDTR", "quality", "territory", "commune", "department", "insee", "municipality"];

    this.serviceAttributes = ["bbox", "ID", "IDTR", "Qualite", "Territoire", "Commune", "Departement", "INSEE", "Municipality"];
}

/**
 * @lends module:StreetAdress#
 */
StreetAddress.prototype = Object.create(__WEBPACK_IMPORTED_MODULE_0__GeocodeLocation__["a" /* default */].prototype);

/**
 * Constructeur (alias)
 */
StreetAddress.prototype.constructor = StreetAddress;

/* harmony default export */ __webpack_exports__["a"] = (StreetAddress);


/***/ }),
/* 74 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__GeocodeLocation__ = __webpack_require__(7);



/**
 * @classdesc
 * Format des attributs d'un résultat de géocodage de type PositionOfInterest
 *
 * @constructor
 * @alias Gp.Services.Geocode.Request.PositionOfInterest
 * @private
 */
function PositionOfInterest () {
    if (!(this instanceof PositionOfInterest)) {
        throw new TypeError("PositionOfInterest constructor cannot be called as a function.");
    }

    // INFO
    // appel du constructeur de la classe mère
    // avec passage de param.
    __WEBPACK_IMPORTED_MODULE_0__GeocodeLocation__["a" /* default */].apply(this, arguments);

    /**
     * Nom de la classe (heritage)
     * @type {String}
     */
    this.CLASSNAME = "PositionOfInterest";

    /**
     * Liste des attributs possibles pour une GeocodeLocation de type PositionOfInterest
     * - **bbox** : Emprise du toponyme dans le système de coordonnées demandé {left, right, top, bottom} *{Object}*
     * - **importance** : Importance du toponyme *{number}*
     * - **nature** : Nature du toponyme. *{String}*
     * - **territory** : Code du territoire français où se situe le toponyme *{String}*
     * - **commune** : Ville du toponyme. *{String}*
     * - **department** : Département du toponyme. *{String}*
     * - **insee** : Code INSEE de la commune où se situe le toponyme. *{Number}*
     * - **municipality** : Municipalité du toponyme. *{String}*
     */

    this.attributesList = ["bbox", "importance", "nature", "territory", "commune", "department", "insee", "municipality"];

    this.serviceAttributes = ["bbox", "Importance", "Nature", "Territoire", "Commune", "Departement", "INSEE", "Municipality"];
}

/**
 * @lends module:PositionOfInterest#
 */
PositionOfInterest.prototype = Object.create(__WEBPACK_IMPORTED_MODULE_0__GeocodeLocation__["a" /* default */].prototype);

/**
 * Constructeur (alias)
 */
PositionOfInterest.prototype.constructor = PositionOfInterest;

/* harmony default export */ __webpack_exports__["a"] = (PositionOfInterest);


/***/ }),
/* 75 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__GeocodeLocation__ = __webpack_require__(7);



/**
 * @classdesc
 * Format des attributs d'un filtre de géocodage de type CadastralParcel.
 *
 * @constructor
 * @alias Gp.Services.Geocode.Request.CadastralParcel
 * @private
 */
function CadastralParcel () {
    if (!(this instanceof CadastralParcel)) {
        throw new TypeError("CadastralParcel constructor cannot be called as a function.");
    }

    // INFO
    // appel du constructeur de la classe mère
    // avec passage de param.
    __WEBPACK_IMPORTED_MODULE_0__GeocodeLocation__["a" /* default */].apply(this, arguments);

    /**
     * Nom de la classe (heritage)
     */
    this.CLASSNAME = "CadastralParcel";

    /**
     * Liste des attributs possibles pour une GeocodeLocation de type CadastralParcel
     * - **absorbedCity** : Code commune absorbée de la parcelle :
     *      lorsqu'une parcelle est issue p d'une ancienne commune qui a fusionné avec une autre.
     *      Sinon, le code vaut '000'. *{String}*
     * - **sheet** : Feuille de la parcelle (ex 1). *{String}*
     * - **number** : Numéro de la parcelle (ex. 0041) *{String}*
     * - **section** : Section de la parcelle (ex 0D). *{String}*
     * - **commune** : Ville du filtre. *{String}*
     * - **department** : Département du filtre. *{String}*
     * - **insee** : Code INSEE du filtre. *{Number}*
     * - **municipality** : Municipalité du filtre. *{String}*
     * - **origin** : L'origine de l'objet parcellaire renvoyé
     *      (correspond à l'attribut "type" dans la réponse XML)
     *      Pour plus d'informations : http://api.ign.fr/tech-docs-js/fr/developpeur/search.html#Recherche_par_parcelles_cadastrales *{Number}*
     *
     */

    this.attributesList = ["absorbedCity", "sheet", "number", "section", "commune", "department", "insee", "municipality", "origin"];

    this.serviceAttributes = ["CommuneAbsorbee", "Feuille", "Numero", "Section", "Commune", "Departement", "INSEE", "Municipality", "Type"];
}

/**
 * @lends module:CadastralParcel#
 */
CadastralParcel.prototype = Object.create(__WEBPACK_IMPORTED_MODULE_0__GeocodeLocation__["a" /* default */].prototype);

/**
 * Constructeur (alias)
 */
CadastralParcel.prototype.constructor = CadastralParcel;

/* harmony default export */ __webpack_exports__["a"] = (CadastralParcel);


/***/ }),
/* 76 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__GeocodeLocation__ = __webpack_require__(7);



/**
 * @classdesc
 * Format des attributs d'un filtre de géocodage de type Administratif.
 * @constructor
 * @alias Gp.Services.Geocode.Request.Administratif
 * @private
 */
function Administratif () {
    if (!(this instanceof Administratif)) {
        throw new TypeError("Administratif constructor cannot be called as a function.");
    }

    // INFO
    // appel du constructeur de la classe mère
    // avec passage de param.
    __WEBPACK_IMPORTED_MODULE_0__GeocodeLocation__["a" /* default */].apply(this, arguments);

    /**
     * Nom de la classe (heritage)
     * @type {String}
     */
    this.CLASSNAME = "Administratif";

    /**
     * Liste des attributs possibles pour une GeocodedLocation de type Administratif
     * - **bbox** : Emprise de l'unité administrative dans le système de coordonnées demandé *{left, right, top, bottom}*
     * - **prefecture** - Nom de la préfécture de la région ou du département *{String}*
     * - **inseeRegion** - Numéro INSEE de la région *{String}*
     * - **inseeDepartment** - Numéro INSEE du département *{String}*
     * - **municipality** - Nom de l'unité administrative *{String}*
     *
     */

    this.attributesList = ["bbox", "prefecture", "inseeRegion", "inseeDepartment", "municipality"];

    this.serviceAttributes = ["bbox", "Prefecture", "InseeRegion", "InseeDepartement", "Municipality"];
}

/**
 * @lends module:Administratif#
 */
Administratif.prototype = Object.create(__WEBPACK_IMPORTED_MODULE_0__GeocodeLocation__["a" /* default */].prototype);

/**
 * Constructeur (alias)
 */
Administratif.prototype.constructor = Administratif;

/* harmony default export */ __webpack_exports__["a"] = (Administratif);


/***/ }),
/* 77 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Exceptions_ErrorService__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Formats_XML__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Formats_DirectGeocodeResponseReader__ = __webpack_require__(78);
/**
 * Factory pour générer une reponse JSON à partir d'un XML
 * ou d'un JSON encapsulant du XML
 * (Factory)
 *
 * @module GeocodeResponseFactory
 * @alias Gp.Services.Geocode.Response.GeocodeResponseFactory
 * @todo La reponse JSON peut encapsuler un XML !
 * @private
 */
// import Logger from "../../../Utils/LoggerByDefault";





var DirectGeocodeReponseFactory = {

    /**
     * interface unique
     *
     * @method build
     * @static
     * @param {Object} options - options definies dans le composant Geocode
     *
     * @example
     *   var options = {
     *      response :
     *      rawResponse :
     *      scope :
     *      onSuccess :
     *      onError :
     *   };
     *
     */
    build : function (options) {
        // data de type GeocodeResponse
        var data = null;

        if (options.response) {
            if (options.rawResponse) {
                data = options.response;
            } else {
                try {
                    var p = new __WEBPACK_IMPORTED_MODULE_2__Formats_XML__["a" /* default */]({
                        reader : __WEBPACK_IMPORTED_MODULE_3__Formats_DirectGeocodeResponseReader__["a" /* default */]
                    });

                    if (typeof options.response === "string") {
                        p.setXMLString(options.response);
                    } else {
                        p.setXMLDoc(options.response);
                    }

                    data = p.parse();

                    if (!data) {
                        throw new Error("L'analyse de la réponse du service !?");
                    }
                } catch (e) {
                    var message = e.message;
                    if (typeof options.response === "string") {
                        message += "('" + options.response + "')";
                    } else {
                        message += "('" + options.response.documentElement.innerHTML + "')";
                    }
                    options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_0__Exceptions_ErrorService__["a" /* default */]({
                        message : __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_ANALYSE", message),
                        type : __WEBPACK_IMPORTED_MODULE_0__Exceptions_ErrorService__["a" /* default */].TYPE_UNKERR,
                        status : -1
                    }));
                    return;
                }

                // Si la réponse contenait une exception renvoyée par le service
                if (data.exceptionReport) {
                    options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_0__Exceptions_ErrorService__["a" /* default */]({
                        message : __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EXCEPTION", data.exceptionReport),
                        type : __WEBPACK_IMPORTED_MODULE_0__Exceptions_ErrorService__["a" /* default */].TYPE_SRVERR,
                        status : 200 // FIXME : 200 ?
                    }));
                    return;
                }
            }
        } else {
            options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_0__Exceptions_ErrorService__["a" /* default */]({
                message : __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EMPTY"),
                type : __WEBPACK_IMPORTED_MODULE_0__Exceptions_ErrorService__["a" /* default */].TYPE_SRVERR,
                status : -1 // FIXME : status response
            }));
            return;
        }

        options.onSuccess.call(options.scope, data);
    }
};

/* harmony default export */ __webpack_exports__["a"] = (DirectGeocodeReponseFactory);


/***/ }),
/* 78 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_MessagesResources__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Exceptions_ErrorService__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Response_model_GeocodeResponse__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Response_model_DirectGeocodedLocation__ = __webpack_require__(40);

/**
 * Fonction retournant un objet contenant des clés de lecture (readers)
 *      qui permettent de parser des réponses XML du service de géocodage direct du Géoportail
 *      afin de récupérer les résultats retournés.
 * @module DirectGeocodeResponseReader
 * @alias Gp.Services.Geocode.Formats.DirectGeocodeResponseReader
 * @private
 */

// import Logger from "../../../Utils/LoggerByDefault";





/**
 * @member DirectGeocodeResponseReader
 */
var DirectGeocodeResponseReader = {};

/**
 * @property {String} DirectGeocodeResponseReader.VERSION - version du service de géocodage
 */
DirectGeocodeResponseReader.VERSION = "1.2";

/**
 * Objet stockant les différents namespaces et les URI associées
 */
DirectGeocodeResponseReader.NAMESPACES = {
    xmlns : "http://www.opengis.net/xls",
    gml : "http://www.opengis.net/gml",
    xls : "http://www.opengis.net/xls",
    xlsext : "http://www.opengis.net/xlsext",
    xsi : "http://www.w3.org/2001/XMLSchema-instance"
};

/**
 * Localisation (URL) du schema de définition du XML (XSD)
 */
DirectGeocodeResponseReader.SCHEMALOCATION = "http://wxs.ign.fr/schemas/olsAll.xsd";

/**
 * Namespace par défaut du format
 */
DirectGeocodeResponseReader.DEFAULTPREFIX = "xls";

/**
 * Objet contenant des fonctions de lecture, appelées "READERS"
 *      dont chaque clé correspond au nom d'un tag du XML que l'on souhaite lire
 *      et la valeur associée est une fonction (node, data)
 *      où node est un noeud du document DOM
 *      et data est un objet où l'on stocke les informations lues dans le XML.
 */
DirectGeocodeResponseReader.READERS = {

    xls : {

        /** TODO : jsdoc block */
        XLS : function (root) {
            var geocodeResponse = new __WEBPACK_IMPORTED_MODULE_2__Response_model_GeocodeResponse__["a" /* default */]();

            // vérification de la version du service, et des namespaces de l'en-tête
            __checkServiceAttributes(root);

            // puis lancement de la lecture de l'ensemble des noeuds, en bouclant sur les childNodes
            __getChildNodes(root, geocodeResponse);

            return geocodeResponse;
        },

        /** TODO : jsdoc block */
        GeocodedAddress : function (node, geocodeResponse) {
            var geocodedLocation = new __WEBPACK_IMPORTED_MODULE_3__Response_model_DirectGeocodedLocation__["a" /* default */]();

            __getChildNodes(node, geocodedLocation);

            // Ajout du résultat au tableau geocodedLocations de geocodeReponse
            if (geocodeResponse && Array.isArray(geocodeResponse.locations)) {
                geocodeResponse.locations.push(geocodedLocation);
            }
        },

        /** TODO : jsdoc block */
        GeocodeMatchCode : function (node, geocodedLocation) {
            var acc = node.getAttribute("accuracy");
            if (acc && geocodedLocation) {
                geocodedLocation.accuracy = parseFloat(acc);
            }
            var matchType = node.getAttribute("matchType");
            if (matchType && geocodedLocation) {
                geocodedLocation.matchType = matchType;
            }
        },

        /** TODO : jsdoc block */
        Address : function (node, geocodedLocation) {
            var countrycode = node.getAttribute("countryCode");
            if (geocodedLocation && countrycode) {
                geocodedLocation.type = countrycode;
            }
            // on va récupérer les autres informations (StreetAddress, place, postalCode...)
            __getChildNodes(node, geocodedLocation);
        },

        /** TODO : jsdoc block */
        freeFormAddress : function (node, geocodedLocation) {
            if (geocodedLocation && geocodedLocation.hasOwnProperty("placeAttributes")) {
                geocodedLocation.placeAttributes.freeform = __getChildValue(node);
            }
        },

        /** TODO : jsdoc block */
        Building : function (node, geocodedLocation) {
            var num = node.getAttribute("number");
            if (geocodedLocation && geocodedLocation.hasOwnProperty("placeAttributes")) {
                if (num) {
                    geocodedLocation.placeAttributes.number = num;
                } else if (node.getAttribute("buildingName")) {
                    geocodedLocation.placeAttributes.number = node.getAttribute("buildingName");
                } else if (node.getAttribute("subdivision")) {
                    geocodedLocation.placeAttributes.number = node.getAttribute("subdivision");
                }
            }
        },

        /** TODO : jsdoc block */
        Street : function (node, geocodedLocation) {
            if (geocodedLocation && geocodedLocation.hasOwnProperty("placeAttributes")) {
                // in case of a streetAddress result : street represents the street name
                if (geocodedLocation.type === "StreetAddress") {
                    geocodedLocation.placeAttributes.street = __getChildValue(node);

                    // in case of a cadastral parcel result : street represents the cadastral parcel identifier
                } else if (geocodedLocation.type === "CadastralParcel") {
                    geocodedLocation.placeAttributes.cadastralParcel = __getChildValue(node);
                }
            }
        },

        /** TODO : jsdoc block */
        Place : function (node, geocodedLocation) {
            var placeType = node.getAttribute("type");
            var placeName = __getChildValue(node);

            if (geocodedLocation && geocodedLocation.hasOwnProperty("placeAttributes")) {
                if (placeType === "Municipality") {
                    geocodedLocation.placeAttributes.municipality = placeName;
                } else if (placeType === "Bbox") {
                    var values = placeName.split(";");
                    if (values.length === 4) {
                        geocodedLocation.placeAttributes.bbox = {
                            left : parseFloat(values[0]),
                            right : parseFloat(values[2]),
                            top : parseFloat(values[1]),
                            bottom : parseFloat(values[3])
                        };
                    }
                } else if (placeType === "Commune") {
                    geocodedLocation.placeAttributes.commune = placeName;
                } else if (placeType === "Departement") {
                    geocodedLocation.placeAttributes.department = placeName;
                } else if (placeType === "INSEE") {
                    geocodedLocation.placeAttributes.insee = placeName;
                } else if (placeType === "Qualite") {
                    geocodedLocation.placeAttributes.quality = placeName;
                } else if (placeType === "Territoire") {
                    geocodedLocation.placeAttributes.territory = placeName;
                } else if (placeType === "ID") {
                    geocodedLocation.placeAttributes.ID = placeName;
                } else if (placeType === "ID_TR") {
                    geocodedLocation.placeAttributes.IDTR = placeName;
                } else if (placeType === "Importance") {
                    geocodedLocation.placeAttributes.importance = parseInt(placeName, 10);
                } else if (placeType === "Nature") {
                    geocodedLocation.placeAttributes.nature = placeName;
                } else if (placeType === "Numero") {
                    geocodedLocation.placeAttributes.number = placeName;
                } else if (placeType === "Feuille") {
                    geocodedLocation.placeAttributes.sheet = placeName;
                } else if (placeType === "Section") {
                    geocodedLocation.placeAttributes.section = placeName;
                } else if (placeType === "CommuneAbsorbee") {
                    geocodedLocation.placeAttributes.absorbedCity = placeName;
                } else if (placeType === "Arrondissement") {
                    if (placeName) {
                        geocodedLocation.placeAttributes.arrondissement = placeName;
                    }
                } else if (placeType === "Type") {
                    geocodedLocation.placeAttributes.origin = placeName;
                } else if (placeType === "Prefecture") {
                    geocodedLocation.placeAttributes.prefecture = placeName;
                } else if (placeType === "InseeRegion") {
                    geocodedLocation.placeAttributes.inseeRegion = placeName;
                } else if (placeType === "InseeDepartment") {
                    geocodedLocation.placeAttributes.inseeDepartment = placeName;
                }
            }
        },

        /** TODO : jsdoc block */
        PostalCode : function (node, geocodedLocation) {
            if (geocodedLocation && geocodedLocation.hasOwnProperty("placeAttributes")) {
                geocodedLocation.placeAttributes.postalCode = __getChildValue(node);
            }
        },

        /** TODO : jsdoc block */
        Error : function (node) {
            // on imagine qu'on a une balise ainsi :
            // <Error message="Message..." errorCode="InternalServerError"/>
            var srvMess = node.getAttribute("message");
            var errorCode = node.getAttribute("errorCode");
            var message = __WEBPACK_IMPORTED_MODULE_0__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EXCEPTION",
                "(" + errorCode + ") : " + srvMess);
            throw new __WEBPACK_IMPORTED_MODULE_1__Exceptions_ErrorService__["a" /* default */]({
                message : message,
                type : __WEBPACK_IMPORTED_MODULE_1__Exceptions_ErrorService__["a" /* default */].TYPE_SRVERR
            });
        }
    },

    gml : {

        /** TODO : jsdoc block */
        pos : function (node, geocodedLocation) {
            var pos = __getChildValue(node);
            if (geocodedLocation && pos) {
                geocodedLocation.position = {
                    x : parseFloat(pos.split(" ")[0]),
                    y : parseFloat(pos.split(" ")[1])
                };
            }
        }
    },

    /** TODO : jsdoc block */
    ExceptionReport : function (node) {
        var response = {};
        if (node.hasChildNodes()) {
            var children = node.childNodes;
            var child;
            for (var i = 0; i < children.length; i++) {
                child = children[i];
                if (child.nodeName === "Exception") {
                    response.exceptionReport = DirectGeocodeResponseReader.READERS["Exception"](child);
                }
            }
        }
        return response;
    },

    /** TODO : jsdoc block */
    Exception : function (node) {
        var exceptionReport = {};

        // get exception code
        var exceptionCode = node.getAttribute("exceptionCode");
        if (exceptionCode) {
            exceptionReport.exceptionCode = exceptionCode;
        }

        // get exception message
        var textNode = node.firstChild;
        if (textNode && textNode.nodeType === 3) { // 3 === node.TEXT_NODE
            exceptionReport.exception = textNode.nodeValue;
        }

        return exceptionReport;
    }

};

/**
 * Méthode permettant de lancer la lecture d'une réponse XML du service de géocodage,
 *      à l'aide des READERS de la classe.
 *
 * @method DirectGeocodeResponseReader.read
 * @param {DOMElement} root - racine de la réponse XML à lire
 * @return {Object} geocodeResponse|exceptionReport : l'objet contenant les informations de la réponse XML,
 *      sous la forme d'un objet GeocodeResponse, ou un objet littéral exceptionReport si le service a renvoyé une exception.
 * @static
 * @memberof DirectGeocodeResponseReader
 */
DirectGeocodeResponseReader.read = function (root) {
    if (root.nodeName === "XLS") {
        var nsPrefix = root.prefix;
        if (!nsPrefix) {
            nsPrefix = DirectGeocodeResponseReader.DEFAULTPREFIX;
        }
        var geocodeResponse = DirectGeocodeResponseReader.READERS[nsPrefix][root.nodeName](root);
        return geocodeResponse;
    } else if (root.nodeName === "ExceptionReport") {
        var exceptionReport = DirectGeocodeResponseReader.READERS[root.nodeName](root);
        return exceptionReport;
    } else {
        var mess = __WEBPACK_IMPORTED_MODULE_0__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_ANALYSE", root.nodeName);
        throw new __WEBPACK_IMPORTED_MODULE_1__Exceptions_ErrorService__["a" /* default */]({
            message : mess,
            type : __WEBPACK_IMPORTED_MODULE_1__Exceptions_ErrorService__["a" /* default */].TYPE_UNKERR,
            status : 200
        });
    }
};

/**
 * Récupération des attributs d'un noeud élément
 *
 * @private
 * @memberof DirectGeocodeResponseReader
 * @method __getAttributes
 * @param {DOMElement} node - noeud contenant l'attribut recherché
 * @return {Object} nodeAttributes - objet contenant les noms et valeurs des différents attributs
 */
function __getAttributes (node) {
    if (node.attributes.length > 0) {
        var nodeAttributes = {};
        var attributes = node.attributes;
        for (var i = 0; i < attributes.length; i++) {
            var attribute = attributes[i];
            nodeAttributes[attribute.nodeName] = attribute.nodeValue;
        }
        return nodeAttributes;
    }
}

/**
 * Récupération des noeuds enfants à partir d'un noeud donné, pour lecture (readNode).
 *
 * @private
 * @memberof DirectGeocodeResponseReader
 * @method __getChildNodes
 * @param {DOMElement} node - a DOM node
 * @param {Array|Object} [data] - an object to be filled with node data
 */
function __getChildNodes (node, data) {
    if (node.hasChildNodes()) {
        var children = node.childNodes;
        var child;
        var childName;
        var childPrefix;

        for (var i = 0; i < children.length; i++) {
            child = children[i];

            if (child.nodeType === 1) { // 1 === node.ELEMENT_NODE
                childName = child.localName || child.baseName || child.nodeName;
                childPrefix = child.prefix || DirectGeocodeResponseReader.DEFAULTPREFIX;

                if (DirectGeocodeResponseReader.READERS[childPrefix][childName]) {
                    var reader = DirectGeocodeResponseReader.READERS[childPrefix][childName];
                    reader(child, data);
                } else {
                    __getChildNodes(child, data);
                }
            }
        }
    }
}

/**
 * Lecture de la valeur du premier child d'un noeud, si elle existe.
 *
 * @private
 * @memberof DirectGeocodeResponseReader
 * @method __getChildValue
 * @param {DOMElement} node - a DOM node
 * @return {String} value - valeur du firstChild du noeud en entrée, ou chaîne vide.
 */
function __getChildValue (node) {
    var textNode;
    var value = "";

    if (node.hasChildNodes()) {
        textNode = node.firstChild;
        if (textNode.nodeType === 3) { // 3 === node.TEXT_NODE
            value = textNode.nodeValue;
        }
    }
    return value;
}

/**
 * Vérification des attributs du service, dans la balise XLS de la réponse :
 *      version, namespaces, et namespace par défaut doivent correspondre à ceux attendus.
 *
 * @private
 * @memberof DirectGeocodeResponseReader
 * @method __checkServiceAttributes
 * @param {DOMElement} XLSNode - a DOM node, corresponding to XLS first tag.
 */
function __checkServiceAttributes (XLSNode) {
    if (XLSNode.attributes.length > 0) {
        // on récupère et parcourt les attributs de la balise XLS de la réponse
        var xlsAttributes = __getAttributes(XLSNode);
        for (var att in xlsAttributes) {
            if (xlsAttributes.hasOwnProperty(att)) {
                // vérification de la version
                if (att === "version") {
                    if (xlsAttributes["version"] !== DirectGeocodeResponseReader.VERSION) {
                        console.log("[DirectGeocodeResponseReader] geocode version is not the expected one : there may be errors in parsing");
                        return;
                    }
                }

                // on vérifie que l'uri du namespace par défaut est bien celle que l'on attend
                if (att === "xmlns") {
                    if (xlsAttributes[att] !== DirectGeocodeResponseReader.NAMESPACES[DirectGeocodeResponseReader.DEFAULTPREFIX]) {
                        console.log("[DirectGeocodeResponseReader] geocode response default namespace is not the expected one");
                        return;
                    }
                    continue;
                }

                var prefix = att.split(":")[0];
                var ns = att.split(":")[1];

                // si on a un autre xmlns, on vérifie aussi les URI
                if (prefix === "xmlns" && ns) {
                    // si l'attribut correspond à un namespace défini dans le reader
                    if (DirectGeocodeResponseReader.NAMESPACES[ns]) {
                        // il faut que les URI correspondent aussi.
                        if (DirectGeocodeResponseReader.NAMESPACES[ns] !== xlsAttributes[att]) {
                            console.log("[DirectGeocodeResponseReader] geocode response " + att + " namespace is not the expected one");
                            return;
                        }
                    }
                }

                // pour finir on vérifie la localisation du schema XSD du service
                if (ns === "schemaLocation") {
                    if (DirectGeocodeResponseReader.SCHEMALOCATION !== xlsAttributes[att]) {
                        console.log("[DirectGeocodeResponseReader] geocode response schema location is not the expected one");
                        return;
                    }
                }
            }
        }
    }
}

/* harmony default export */ __webpack_exports__["a"] = (DirectGeocodeResponseReader);


/***/ }),
/* 79 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__CommonService__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Request_ReverseGeocodeRequestFactory__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Response_ReverseGeocodeResponseFactory__ = __webpack_require__(81);








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
        throw new TypeError(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("CLASS_CONSTRUCTOR", "ReverseGeocode"));
    }

    /**
     * Nom de la classe (heritage)
     * FIXME instance ou classe ?
     */
    this.CLASSNAME = "ReverseGeocode";

    // appel du constructeur par heritage
    __WEBPACK_IMPORTED_MODULE_3__CommonService__["a" /* default */].apply(this, arguments);

    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("Gp.Services.ReverseGeocode");
    this.logger.trace("[Constructeur ReverseGeocode (options)]");

    if (!options.position) {
        throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_MISSING", "position"));
    }

    // on lance une exception afin d'eviter au service de le faire...
    if (options.position.x === null) {
        throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_MISSING", "position.x"));
    }

    if (options.position.y === null) {
        throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_MISSING", "position.y"));
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
        throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_TYPE", "filterOptions.type"));
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
ReverseGeocode.prototype = Object.create(__WEBPACK_IMPORTED_MODULE_3__CommonService__["a" /* default */].prototype, {
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

    this.request = __WEBPACK_IMPORTED_MODULE_4__Request_ReverseGeocodeRequestFactory__["a" /* default */].build(options);

    // on teste si la requete a bien été construite !
    (!this.request)
        ? error.call(this, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_REQUEST_BUILD")))
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

        __WEBPACK_IMPORTED_MODULE_5__Response_ReverseGeocodeResponseFactory__["a" /* default */].build(options);
    } else {
        error.call(this, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EMPTY")));
    }
};

/**
 * Codes EPSG géographiques (lat/lon). Utiles car les coordonnées doivent être inversées.
 */
ReverseGeocode.geoEPSG = ["EPSG:4326"];

/* harmony default export */ __webpack_exports__["a"] = (ReverseGeocode);


/***/ }),
/* 80 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Formats_XLS__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Formats_XLS_LocationUtilityService__ = __webpack_require__(39);
/**
 * Creation d'une requête OpenLS en mode POST ou GET
 * (Factory)
 *
 * @module ReverseGeocodeRequestFactory
 * @alias Gp.Services.Geocode.Request.ReverseGeocodeRequestFactory
 * @private
 */




var ReverseGeocodeRequestFactory = {

    /**
     * interface unique
     *
     * @method build
     * @static
     * @param {Object} options - options definies dans le composant Geocode
     *
     * @example
     *   var options = {
     *      httpMethod :
     *      // options specifiques du service
     *      position :
     *      returnFreeForm :
     *      filterOptions :
     *      srs :
     *      maximumResponses :
     *   };
     *   var result = ReverseGeocodeRequestFactory.build(options);
     *   if (!result) {
     *       // error...
     *   }
     * @returns {String} request
     */
    build : function (options) {
        // logger
        var logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("ReverseGeocodeRequestFactory");
        logger.trace(["ReverseGeocodeRequestFactory::build()"]);

        // options non definies
        var settings = options || {};

        var request = null;

        // objet LUS
        var oLUS = new __WEBPACK_IMPORTED_MODULE_2__Formats_XLS_LocationUtilityService__["a" /* default */]({
            position : settings.position,
            returnFreeForm : settings.returnFreeForm,
            filterOptions : settings.filterOptions
        });

        // Format XLS
        var oXLS = new __WEBPACK_IMPORTED_MODULE_1__Formats_XLS__["a" /* default */]({
            srsName : settings.srs,
            maximumResponses : settings.maximumResponses
        });
        oXLS.namespace = true;
        oXLS.setService(oLUS);

        // request brute !
        request = oXLS.build();

        // en mode GET, la requête est encodée
        // et le param. 'qxml' est ajouté
        if (settings.httpMethod === "GET") {
            var myRequest = "qxml=" +
                encodeURIComponent(request)
                    .replace(/-/g, "%2D")
                    .replace(/_/g, "%5F")
                    .replace(/\./g, "%2E")
                    .replace(/!/g, "%21")
                    .replace(/~/g, "%7E")
                    .replace(/\*/g, "%2A")
                    .replace(/'/g, "%27")
                    .replace(/\(/g, "%28")
                    .replace(/\)/g, "%29");
            request = myRequest;
        }

        logger.trace(request);

        return request;
    }
};

/* harmony default export */ __webpack_exports__["a"] = (ReverseGeocodeRequestFactory);


/***/ }),
/* 81 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_MessagesResources__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Exceptions_ErrorService__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Formats_XML__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Formats_ReverseGeocodeResponseReader__ = __webpack_require__(82);
/**
 * Factory pour générer une reponse JSON à partir d'un XML
 * ou d'un JSON encapsulant du XML
 * (Factory)
 *
 * @module ReverseGeocodeResponseFactory
 * @alias Gp.Services.ReverseGeocode.Response.ReverseGeocodeResponseFactory
 * @todo La reponse JSON peut encapsuler un XML !
 * @private
 */






var ReverseGeocodeReponseFactory = {

    /**
     * interface unique
     *
     * @method build
     * @static
     * @param {Object} options - options definies dans le composant ReverseGeocode
     *
     * @example
     *   var options = {
     *      response :
     *      rawResponse :
     *      scope :
     *      onSuccess :
     *      onError :
     *   };
     *
     */
    build : function (options) {
        // data de type ReverseGeocodeResponse
        var data = null;

        if (options.response) {
            if (options.rawResponse) {
                data = options.response;
            } else {
                try {
                    var p = new __WEBPACK_IMPORTED_MODULE_2__Formats_XML__["a" /* default */]({
                        reader : __WEBPACK_IMPORTED_MODULE_3__Formats_ReverseGeocodeResponseReader__["a" /* default */]
                    });

                    if (typeof options.response === "string") {
                        p.setXMLString(options.response);
                    } else {
                        p.setXMLDoc(options.response);
                    }

                    data = p.parse();

                    if (!data) {
                        throw new Error("L'analyse de la réponse du service !?");
                    }
                } catch (e) {
                    // on relaye l'erreur reçue
                    e.status = 200;
                    options.onError.call(options.scope, e);
                    return;
                }

                // Si la réponse contenait une exception renvoyée par le service
                // TODO : quand cela arrive-t-il ?
                if (data.exceptionReport) {
                    options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_1__Exceptions_ErrorService__["a" /* default */]({
                        message : __WEBPACK_IMPORTED_MODULE_0__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EXCEPTION", data.exceptionReport),
                        type : __WEBPACK_IMPORTED_MODULE_1__Exceptions_ErrorService__["a" /* default */].TYPE_SRVERR,
                        status : 200
                    }));
                    return;
                }

                // dans le cas d'un srs non EPSG géographique, il faut réinverser les coordonnées (lat,lon => lon,lat)
                if (options.scope && options.scope.options && options.scope.options.srs && options.scope.options.srs !== "EPSG:4326") {
                    var location;
                    var pos;
                    if (data || data.locations || data.locations.length) {
                        for (var i = 0; i < data.locations.length; i++) {
                            location = data.locations[i];
                            if (location) {
                                pos = location.position;
                                if (pos) {
                                    // on inverse les 2 coordonnées
                                    location.position = {
                                        x : pos.y,
                                        y : pos.x
                                    };
                                }
                            }
                        }
                    }
                }
            }
        } else {
            options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_1__Exceptions_ErrorService__["a" /* default */]({
                message : __WEBPACK_IMPORTED_MODULE_0__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EMPTY"),
                type : __WEBPACK_IMPORTED_MODULE_1__Exceptions_ErrorService__["a" /* default */].TYPE_SRVERR,
                status : -1 // FIXME : status response
            }));
            return;
        }

        options.onSuccess.call(options.scope, data);
    }
};

/* harmony default export */ __webpack_exports__["a"] = (ReverseGeocodeReponseFactory);


/***/ }),
/* 82 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_MessagesResources__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Exceptions_ErrorService__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Response_model_GeocodeResponse__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Response_model_ReverseGeocodedLocation__ = __webpack_require__(41);

/**
 * Fonction retournant un objet contenant des clés de lecture (readers)
 *      qui permettent de parser des réponses XML du service de géocodage inverse du Géoportail
 *      afin de récupérer les résultats retournés.
 * @module ReverseGeocodeResponseReader
 * @alias Gp.Services.Geocode.Formats.ReverseGeocodeResponseReader
 * @private
 */

// import Logger from "../../../Utils/LoggerByDefault";





/**
 * Objet ReverseGeocodeResponseReader
 * @member {Object} ReverseGeocodeResponseReader
 *
 * @property {String} ReverseGeocodeResponseReader.VERSION - Version du service de géocodage
 *
 * @property {Object} ReverseGeocodeResponseReader.NAMESPACES - Objet stockant les différents namespaces et les URI associées
 *
 * @property {String} ReverseGeocodeResponseReader.SCHEMALOCATION - Localisation (URL) du schema de définition du XML (XSD)
 *
 * @property {String} ReverseGeocodeResponseReader.DEFAULTPREFIX - Namespace par défaut du format
 *
 * @property {Object} ReverseGeocodeResponseReader.READERS - Objet contenant des fonctions de lecture, appelées "READERS"
 *      dont chaque clé correspond au nom d'un tag du XML que l'on souhaite lire
 *      et la valeur associée est une fonction (node, data)
 *      où node est un noeud du document DOM
 *      et data est un objet où l'on stocke les informations lues dans le XML.
 *
 * @property {Method} ReverseGeocodeResponseReader.read - Méthode permettant de lancer la lecture d'une réponse XML du service de géocodage,
 *      à l'aide des READERS de la classe.
 *
 */

var ReverseGeocodeResponseReader = {};

/**
 * version du service de géocodage
 */
ReverseGeocodeResponseReader.VERSION = "1.2";

/**
 * Objet stockant les différents namespaces et les URI associées
 */
ReverseGeocodeResponseReader.NAMESPACES = {
    xmlns : "http://www.opengis.net/xls",
    gml : "http://www.opengis.net/gml",
    xls : "http://www.opengis.net/xls",
    xlsext : "http://www.opengis.net/xlsext",
    xsi : "http://www.w3.org/2001/XMLSchema-instance"
};

/**
 * Localisation (URL) du schema de définition du XML (XSD)
 */
ReverseGeocodeResponseReader.SCHEMALOCATION = "http://wxs.ign.fr/schemas/olsAll.xsd";

/**
 * Namespace par défaut du format
 */
ReverseGeocodeResponseReader.DEFAULTPREFIX = "xls";

/**
 * Objet contenant des fonctions de lecture, appelées "READERS"
 *      dont chaque clé correspond au nom d'un tag du XML que l'on souhaite lire
 *      et la valeur associée est une fonction (node, data)
 *      où node est un noeud du document DOM
 *      et data est un objet où l'on stocke les informations lues dans le XML.
 */
ReverseGeocodeResponseReader.READERS = {

    xls : {

        /** TODO : jsdoc block */
        XLS : function (root) {
            var reverseGeocodeResponse = new __WEBPACK_IMPORTED_MODULE_2__Response_model_GeocodeResponse__["a" /* default */]();

            // vérification de la version du service, et des namespaces de l'en-tête
            __checkServiceAttributes(root);

            // puis lancement de la lecture de l'ensemble des noeuds, en bouclant sur les childNodes
            __getChildNodes(root, reverseGeocodeResponse);

            return reverseGeocodeResponse;
        },

        /** TODO : jsdoc block */
        ReverseGeocodedLocation : function (node, reverseGeocodeResponse) {
            var reverseGeocodedLocation = new __WEBPACK_IMPORTED_MODULE_3__Response_model_ReverseGeocodedLocation__["a" /* default */]();

            __getChildNodes(node, reverseGeocodedLocation);

            // Ajout du résultat au tableau locations de reverseGeocodeResponse
            if (reverseGeocodeResponse && Array.isArray(reverseGeocodeResponse.locations)) {
                reverseGeocodeResponse.locations.push(reverseGeocodedLocation);
            }
        },

        /** TODO : jsdoc block */
        Address : function (node, reverseGeocodedLocation) {
            var countrycode = node.getAttribute("countryCode");
            if (reverseGeocodedLocation && countrycode) {
                reverseGeocodedLocation.type = countrycode;
            }
            // on va récupérer les autres informations (StreetAddress, place, postalCode...)
            __getChildNodes(node, reverseGeocodedLocation);
        },

        /** TODO : jsdoc block */
        Building : function (node, reverseGeocodedLocation) {
            var num = node.getAttribute("number");
            if (reverseGeocodedLocation && reverseGeocodedLocation.hasOwnProperty("placeAttributes")) {
                if (num) {
                    reverseGeocodedLocation.placeAttributes.number = num;
                } else if (node.getAttribute("buildingName")) {
                    reverseGeocodedLocation.placeAttributes.number = node.getAttribute("buildingName");
                } else if (node.getAttribute("subdivision")) {
                    reverseGeocodedLocation.placeAttributes.number = node.getAttribute("subdivision");
                }
            }
        },

        /** TODO : jsdoc block */
        Street : function (node, reverseGeocodedLocation) {
            // in case of a streetAddress result : street represents the street name
            if (reverseGeocodedLocation.type === "StreetAddress") {
                reverseGeocodedLocation.placeAttributes.street = __getChildValue(node);

                // in case of a cadastral parcel result : street represents the cadastral parcel identifier
            } else if (reverseGeocodedLocation.type === "CadastralParcel") {
                reverseGeocodedLocation.placeAttributes.cadastralParcel = __getChildValue(node);
            }
        },

        /** TODO : jsdoc block */
        Place : function (node, reverseGeocodedLocation) {
            var placeType = node.getAttribute("type");
            var placeName = __getChildValue(node);

            if (reverseGeocodedLocation && reverseGeocodedLocation.hasOwnProperty("placeAttributes")) {
                if (placeType === "Municipality") {
                    reverseGeocodedLocation.placeAttributes.municipality = placeName;
                } else if (placeType === "Bbox") {
                    var values = placeName.split(";");
                    if (values.length === 4) {
                        reverseGeocodedLocation.placeAttributes.bbox = {
                            left : parseFloat(values[0]),
                            right : parseFloat(values[2]),
                            top : parseFloat(values[1]),
                            bottom : parseFloat(values[3])
                        };
                    }
                } else if (placeType === "Commune") {
                    reverseGeocodedLocation.placeAttributes.commune = placeName;
                } else if (placeType === "Departement") {
                    reverseGeocodedLocation.placeAttributes.department = placeName;
                } else if (placeType === "INSEE") {
                    reverseGeocodedLocation.placeAttributes.insee = placeName;
                } else if (placeType === "Qualite") {
                    reverseGeocodedLocation.placeAttributes.quality = placeName;
                } else if (placeType === "Territoire") {
                    reverseGeocodedLocation.placeAttributes.territory = placeName;
                } else if (placeType === "ID") {
                    reverseGeocodedLocation.placeAttributes.ID = placeName;
                } else if (placeType === "ID_TR") {
                    reverseGeocodedLocation.placeAttributes.IDTR = placeName;
                } else if (placeType === "Importance") {
                    reverseGeocodedLocation.placeAttributes.importance = parseInt(placeName, 10);
                } else if (placeType === "Nature") {
                    reverseGeocodedLocation.placeAttributes.nature = placeName;
                } else if (placeType === "Numero") {
                    reverseGeocodedLocation.placeAttributes.number = placeName;
                } else if (placeType === "Feuille") {
                    reverseGeocodedLocation.placeAttributes.sheet = placeName;
                } else if (placeType === "Section") {
                    reverseGeocodedLocation.placeAttributes.section = placeName;
                } else if (placeType === "CommuneAbsorbee") {
                    reverseGeocodedLocation.placeAttributes.absorbedCity = placeName;
                } else if (placeType === "Arrondissement") {
                    if (placeName) {
                        reverseGeocodedLocation.placeAttributes.arrondissement = placeName;
                    }
                } else if (placeType === "Type") {
                    reverseGeocodedLocation.placeAttributes.origin = placeName;
                } else if (placeType === "Prefecture") {
                    reverseGeocodedLocation.placeAttributes.prefecture = placeName;
                } else if (placeType === "InseeRegion") {
                    reverseGeocodedLocation.placeAttributes.inseeRegion = placeName;
                } else if (placeType === "InseeDepartment") {
                    reverseGeocodedLocation.placeAttributes.inseeDepartment = placeName;
                }
            }
        },

        /** TODO : jsdoc block */
        PostalCode : function (node, reverseGeocodedLocation) {
            if (reverseGeocodedLocation && reverseGeocodedLocation.hasOwnProperty("placeAttributes")) {
                reverseGeocodedLocation.placeAttributes.postalCode = __getChildValue(node);
            }
        },

        /** TODO : jsdoc block */
        SearchCentreDistance : function (node, reverseGeocodedLocation) {
            if (reverseGeocodedLocation) {
                reverseGeocodedLocation.searchCenterDistance = parseFloat(node.getAttribute("value"));
            }
        },

        /** TODO : jsdoc block */
        Error : function (node) {
            // <Error message="For input string : &quot;2,45&quot;" errorCode="InternalServerError"/>
            var srvMess = node.getAttribute("message");
            var errorCode = node.getAttribute("errorCode");
            var message = __WEBPACK_IMPORTED_MODULE_0__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EXCEPTION",
                "(" + errorCode + ") : " + srvMess);
            throw new __WEBPACK_IMPORTED_MODULE_1__Exceptions_ErrorService__["a" /* default */]({
                message : message,
                type : __WEBPACK_IMPORTED_MODULE_1__Exceptions_ErrorService__["a" /* default */].TYPE_SRVERR
            });
        }
    },

    gml : {

        /** TODO : jsdoc block */
        pos : function (node, reverseGeocodedLocation) {
            var pos = __getChildValue(node);
            if (reverseGeocodedLocation && pos) {
                reverseGeocodedLocation.position = {
                    x : parseFloat(pos.split(" ")[0]),
                    y : parseFloat(pos.split(" ")[1])
                };
            }
        }
    },

    xlsext : {
        /** TODO : jsdoc block */
        ExtendedGeocodeMatchCode : function (node, reverseGeocodedLocation) {
            if (reverseGeocodedLocation) {
                reverseGeocodedLocation.matchType = __getChildValue(node);
            }
        }
    },

    /** TODO : jsdoc block */
    ExceptionReport : function (node) {
        var response = {};
        if (node.hasChildNodes()) {
            var children = node.childNodes;
            var child;
            for (var i = 0; i < children.length; i++) {
                child = children[i];
                if (child.nodeName === "Exception") {
                    response.exceptionReport = ReverseGeocodeResponseReader.READERS["Exception"](child);
                }
            }
        }
        return response;
    },

    /** TODO : jsdoc block */
    Exception : function (node) {
        var exceptionReport = {};

        // get exception code
        var exceptionCode = node.getAttribute("exceptionCode");
        if (exceptionCode) {
            exceptionReport.exceptionCode = exceptionCode;
        }

        // get exception message
        var textNode = node.firstChild;
        if (textNode && textNode.nodeType === 3) { // 3 === node.TEXT_NODE
            exceptionReport.exception = textNode.nodeValue;
        }

        return exceptionReport;
    }

};

/**
 * Méthode permettant de lancer la lecture d'une réponse XML du service de géocodage,
 *      à l'aide des READERS de la classe.
 *
 * @method ReverseGeocodeResponseReader.read
 * @param {DOMElement} root - racine de la réponse XML à lire
 * @return {Object} geocodeResponse|exceptionReport : l'objet contenant les informations de la réponse XML,
 *      sous la forme d'un objet GeocodeResponse, ou un objet littéral exceptionReport si le service a renvoyé une exception.
 * @static
 * @memberof ReverseGeocodeResponseReader
 */
ReverseGeocodeResponseReader.read = function (root) {
    if (root.nodeName === "XLS") {
        var nsPrefix = root.prefix;
        if (!nsPrefix) {
            nsPrefix = ReverseGeocodeResponseReader.DEFAULTPREFIX;
        }
        var geocodeResponse = ReverseGeocodeResponseReader.READERS[nsPrefix][root.nodeName](root);
        return geocodeResponse;
    } else if (root.nodeName === "ExceptionReport") {
        var exceptionReport = ReverseGeocodeResponseReader.READERS[root.nodeName](root);
        return exceptionReport;
    } else {
        throw new Error("Erreur lors de la lecture de la réponse : elle n'est pas au format attendu.");
    }
};

/**
 * Récupération des attributs d'un noeud élément
 *
 * @private
 * @memberof ReverseGeocodeResponseReader
 * @method __getAttributes
 * @param {DOMElement} node - noeud contenant l'attribut recherché
 * @return {Object} nodeAttributes - objet contenant les noms et valeurs des différents attributs
 */
function __getAttributes (node) {
    if (node.attributes.length > 0) {
        var nodeAttributes = {};
        var attributes = node.attributes;
        for (var i = 0; i < attributes.length; i++) {
            var attribute = attributes[i];
            nodeAttributes[attribute.nodeName] = attribute.nodeValue;
        }
        return nodeAttributes;
    }
}

/**
 * Récupération des noeuds enfants à partir d'un noeud donné, pour lecture (readNode).
 *
 * @private
 * @memberof ReverseGeocodeResponseReader
 * @method __getChildNodes
 * @param {DOMElement} node - a DOM node
 * @param {Array|Object} [data] - an object to be filled with node data
 */
function __getChildNodes (node, data) {
    if (node.hasChildNodes()) {
        var children = node.childNodes;
        var child;
        var childName;
        var childPrefix;

        for (var i = 0; i < children.length; i++) {
            child = children[i];

            if (child.nodeType === 1) { // 1 === node.ELEMENT_NODE
                childName = child.localName || child.baseName || child.nodeName;
                childPrefix = child.prefix || ReverseGeocodeResponseReader.DEFAULTPREFIX;

                if (ReverseGeocodeResponseReader.READERS[childPrefix][childName]) {
                    var reader = ReverseGeocodeResponseReader.READERS[childPrefix][childName];
                    reader(child, data);
                } else {
                    __getChildNodes(child, data);
                }
            }
        }
    }
}

/**
 * Lecture de la valeur du premier child d'un noeud, si elle existe.
 *
 * @private
 * @memberof ReverseGeocodeResponseReader
 * @method __getChildValue
 * @param {DOMElement} node - a DOM node
 * @return {String} value - valeur du firstChild du noeud en entrée, ou chaîne vide.
 */
function __getChildValue (node) {
    var textNode;
    var value = "";

    if (node.hasChildNodes()) {
        textNode = node.firstChild;
        if (textNode.nodeType === 3) { // 3 === node.TEXT_NODE
            value = textNode.nodeValue;
        }
    }
    return value;
}

/**
 * Vérification des attributs du service, dans la balise XLS de la réponse :
 *      version, namespaces, et namespace par défaut doivent correspondre à ceux attendus.
 *
 * @private
 * @memberof ReverseGeocodeResponseReader
 * @method __checkServiceAttributes
 * @param {DOMElement} XLSNode - a DOM node, corresponding to XLS first tag.
 */
function __checkServiceAttributes (XLSNode) {
    if (XLSNode.attributes.length > 0) {
        // on récupère et parcourt les attributs de la balise XLS de la réponse
        var xlsAttributes = __getAttributes(XLSNode);
        for (var att in xlsAttributes) {
            if (xlsAttributes.hasOwnProperty(att)) {
                // vérification de la version
                if (att === "version") {
                    if (xlsAttributes["version"] !== ReverseGeocodeResponseReader.VERSION) {
                        console.log("[ReverseGeocodeResponseReader] geocode version is not the expected one : there may be errors in parsing");
                        return;
                    }
                }

                // on vérifie que l'uri du namespace par défaut est bien celle que l'on attend
                if (att === "xmlns") {
                    if (xlsAttributes[att] !== ReverseGeocodeResponseReader.NAMESPACES[ReverseGeocodeResponseReader.DEFAULTPREFIX]) {
                        console.log("[ReverseGeocodeResponseReader] geocode response default namespace is not the expected one");
                        return;
                    }
                    continue;
                }

                var prefix = att.split(":")[0];
                var ns = att.split(":")[1];

                // si on a un autre xmlns, on vérifie aussi les URI
                if (prefix === "xmlns" && ns) {
                    // si l'attribut correspond à un namespace défini dans le reader
                    if (ReverseGeocodeResponseReader.NAMESPACES[ns]) {
                        // il faut que les URI correspondent aussi.
                        if (ReverseGeocodeResponseReader.NAMESPACES[ns] !== xlsAttributes[att]) {
                            console.log("[ReverseGeocodeResponseReader] geocode response " + att + " namespace is not the expected one");
                            return;
                        }
                    }
                }

                // pour finir on vérifie la localisation du schema XSD du service
                if (ns === "schemaLocation") {
                    if (ReverseGeocodeResponseReader.SCHEMALOCATION !== xlsAttributes[att]) {
                        console.log("[ReverseGeocodeResponseReader] geocode response schema location is not the expected one");
                        return;
                    }
                }
            }
        }
    }
}

/* harmony default export */ __webpack_exports__["a"] = (ReverseGeocodeResponseReader);


/***/ }),
/* 83 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CommonService__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Response_AutoCompleteResponseFactory__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Utils_MessagesResources__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Utils_Helper__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Exceptions_ErrorService__ = __webpack_require__(2);







/**
 * @classdesc
 * Appel du service d'autocomplétion du Géoportail :
 * envoi de la requête construite selon les paramètres en options,
 * éventuellement parsing et analyse  de la réponse,
 * retour d'une réponse en paramètre de la fonction onSuccess.
 * @constructor
 * @extends {Gp.Services.CommonService}
 * @alias Gp.Services.AutoComplete
 *
 * @param {Object} options - options spécifiques au service (+ les options heritées)
 *
 * @param {String} options.text - La chaîne de caractère à compléter.
 *      Cette chaîne n'est pas "URL encodée".
 *      C'est l'API qui s'occupe de l'encoder pour l'inclure dans la requête.
 *
 * @param {Array.<String>} [options.filterOptions.type = "StreetAddress"] - Type de l'objet recherché.
 *      Le service d'autocomplétion du Géoportail permet de rechercher des toponymes 'PostionOfInterest' et/ou des adresses postales 'StreetAddress'.
 *      D'autres types pourront être rajoutés selon l'évolution du service.
 *      Par défaut, type = ['StreetAddress'].
 *
 * @param {Array.<String>} [options.filterOptions.territory] - Limitation de la zone de recherche de localisants.
 *      Le service d'autocomplétion du Géoportail permet de limiter la recherche à la métropole et la Corse : options.filterOptions.territory = ['METROPOLE'],
 *      DOMS TOMS : options.filterOptions.territory = ['DOMTOM'], ou à une liste de départements : options.filterOptions.territory = ['31', '34']
 *      Pas de valeur par défaut.
 *      La valeur par défaut est donc celle du service.
 *      Le service d'autocomplétion du Géoportail renvoie toutes les informations quand aucun territoire n'est spécifié.
 *
 * @param {Number} [options.maximumResponses = 10] - Nombre de réponses maximal que l'on souhaite recevoir.
 *      Pas de valeur par défaut.
 *      La valeur par défaut sera donc celle du service : 10.
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
 *      text : "",
 *      filterOptions : {
 *          type : ["StreetAddress"],
 *          territory : ['METROPOLE', 'DOMTOM', '31']
 *      },
 *      maximumResponses : 10
 *   };
 * @private
 */
function AutoComplete (options) {
    if (!(this instanceof AutoComplete)) {
        throw new TypeError(__WEBPACK_IMPORTED_MODULE_3__Utils_MessagesResources__["a" /* default */].getMessage("CLASS_CONSTRUCTOR", "AutoComplete"));
    }

    /**
     * Nom de la classe (heritage)
     * FIXME instance ou classe ?
     */
    this.CLASSNAME = "AutoComplete";

    // appel du constructeur par heritage
    __WEBPACK_IMPORTED_MODULE_0__CommonService__["a" /* default */].apply(this, arguments);

    this.logger = __WEBPACK_IMPORTED_MODULE_2__Utils_LoggerByDefault__["a" /* default */].getLogger("Gp.Services.AutoComplete");
    this.logger.trace("[Constructeur AutoComplete (options)]");

    if (!options.text) {
        throw new Error(__WEBPACK_IMPORTED_MODULE_3__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_MISSING", "text"));
    }

    // ajout des options spécifiques au service
    this.options.text = options.text;

    // on definit des filtres par defaut
    if (!options.filterOptions || typeof options.filterOptions !== "object") {
        this.options.filterOptions = options.filterOptions = {
            territory : [],
            type : ["StreetAddress"]
        };
    }

    // FIXME ECMAScript 5 support (valable pour un objet uniquement !)
    // ceci permet de tester le cas où : object = {}
    if (Object.keys(options.filterOptions).length === 0) {
        this.options.filterOptions = {
            territory : [],
            type : ["StreetAddress"]
        };
    }

    this.options.filterOptions.type = options.filterOptions.type || ["StreetAddress"];
    this.options.filterOptions.territory = options.filterOptions.territory || [];
    this.options.maximumResponses = options.maximumResponses || 10;

    // INFO
    // le service ne repond pas en mode POST (405 Method Not Allowed)
    if (this.options.protocol === "XHR" && this.options.httpMethod === "POST") {
        this.logger.warn("Le service ne gére pas le mode d'interrogation en POST, on bascule sur du GET !");
        this.options.httpMethod = "GET"; // on surcharge !
    }

    // attributs d'instances

    /**
     * Format forcé de la réponse du service : "json"
     * sauf si l'on souhaite une reponse brute (options.rawResponse)
     */
    this.options.outputFormat = (this.options.rawResponse) ? "" : "json";
}

/**
 * @lends module:AutoComplete#
 */

AutoComplete.prototype = Object.create(__WEBPACK_IMPORTED_MODULE_0__CommonService__["a" /* default */].prototype, {
    // todo
    // getter/setter
});

/*
 * Constructeur (alias)
 */
AutoComplete.prototype.constructor = AutoComplete;

/**
 * (overwrite)
 * Création de la requête
 *
 * @param {Function} error   - callback des erreurs
 * @param {Function} success - callback
 */
AutoComplete.prototype.buildRequest = function (error, success) {
    // ex.
    // http://wxs.ign.fr/CLEF/ols/apis/completion?
    // text=Brie-Comt&
    // type=StreetAddress,PositionOfInterest&
    // territory=METROPOLE&
    // maximumResponses=10

    // traitement des param KPV sous forme de tableau
    var territories = "";
    if (this.options.filterOptions.territory) {
        territories = this.options.filterOptions.territory.join(";");
    }

    var types = "";
    if (this.options.filterOptions.type) {
        types = this.options.filterOptions.type.join(",");
    }

    // normalisation de la requete avec param KPV
    this.request = __WEBPACK_IMPORTED_MODULE_4__Utils_Helper__["a" /* default */].normalyzeParameters({
        text : encodeURIComponent(this.options.text),
        type : types,
        terr : territories,
        maximumResponses : this.options.maximumResponses
    });

    (!this.request)
        ? error.call(this, new __WEBPACK_IMPORTED_MODULE_5__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_3__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_REQUEST_BUILD")))
        : success.call(this, this.request);
};

/**
 * (overwrite)
 * Analyse de la reponse
 *
 * @param {Function} error   - callback des erreurs
 * @param {Function} success - callback de succès de l'analyse de la réponse
 */
AutoComplete.prototype.analyzeResponse = function (error, success) {
    if (this.response) {
        var options = {
            response : this.response,
            rawResponse : this.options.rawResponse,
            onSuccess : success,
            onError : error,
            scope : this
        };

        __WEBPACK_IMPORTED_MODULE_1__Response_AutoCompleteResponseFactory__["a" /* default */].build(options);
    } else {
        error.call(this, new __WEBPACK_IMPORTED_MODULE_5__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_3__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EMPTY")));
    }
};

/* harmony default export */ __webpack_exports__["a"] = (AutoComplete);


/***/ }),
/* 84 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__model_AutoCompleteResponse__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__model_SuggestedLocation__ = __webpack_require__(43);
/**
 * Factory pour générer une reponse JSON à partir d'un XML ou d'un JSON
 * (Factory)
 *
 * @module AutoCompleteResponseFactory
 * @private
 * @alias Gp.Services.AutoComplete.Response.AutoCompleteResponseFactory
 */






var AutoCompleteResponseFactory = {

    /**
     * interface unique
     *
     * @method build
     * @static
     * @param {Object} options - options definies dans le composant Alti
     *
     * @example
     *   var options = {
     *      response :
     *      outputFormat :
     *      rawResponse :
     *      scope :
     *      onSuccess :
     *      onError :
     *   };
     *
     */
    build : function (options) {
        // logger
        var logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("AutoCompleteResponseFactory");
        logger.trace(["AutoCompleteResponseFactory::build()"]);

        var data = null;

        if (options.response) {
            if (options.rawResponse) {
                logger.trace("analyze response : raw");
                data = options.response;
            } else {
                var JSONResponse;
                if (typeof options.response === "string") {
                    JSONResponse = JSON.parse(options.response);
                } else {
                    JSONResponse = options.response;
                }

                // analyse de la réponse
                if (JSONResponse) {
                    // le service renvoie t il une erreur ?
                    if (JSONResponse.error) {
                        // ex. ?
                        options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */]({
                            message : __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EXCEPTION", JSONResponse.error.description),
                            status : JSONResponse.error.code,
                            type : __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */].TYPE_SRVERR
                        }));
                        return;
                    }

                    // création de l'objet réponse
                    data = new __WEBPACK_IMPORTED_MODULE_3__model_AutoCompleteResponse__["a" /* default */]();

                    // boucle sur les résultats de l'autocomplétion
                    if (JSONResponse.results && Array.isArray(JSONResponse.results)) {
                        var suggestedLocation;

                        for (var i = 0; i < JSONResponse.results.length; i++) {
                            var result = JSONResponse.results[i];
                            suggestedLocation = new __WEBPACK_IMPORTED_MODULE_4__model_SuggestedLocation__["a" /* default */]();

                            if (suggestedLocation) {
                                if (result && result.country === "StreetAddress") {
                                    suggestedLocation.street = result.street;
                                    suggestedLocation.type = "StreetAddress";
                                } else if (result && result.country === "PositionOfInterest") {
                                    suggestedLocation.poi = result.street;
                                    suggestedLocation.kind = result.kind;
                                    suggestedLocation.type = "PositionOfInterest";
                                }

                                if (suggestedLocation.position) {
                                    suggestedLocation.position.x = result.x;
                                    suggestedLocation.position.y = result.y;
                                }

                                suggestedLocation.commune = result.city;
                                suggestedLocation.fullText = result.fulltext;
                                suggestedLocation.postalCode = result.zipcode;
                                suggestedLocation.classification = result.classification;
                            }
                            // Ajout du résultat au tableau reverseGeocodedLocations de geocodedLocation
                            data.suggestedLocations.push(suggestedLocation);
                        }
                    } else {
                        options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_FORMAT_3")));
                        return;
                    }

                    if (!data.suggestedLocations.length) {
                        options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_FORMAT_3")));
                        return;
                    }
                }

                if (!data) {
                    options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */]({
                        message : __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_ANALYSE_2"),
                        type : __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */].TYPE_UNKERR,
                        status : -1
                    }));
                    return;
                }

                // Si la réponse contenait une exception renvoyée par le service
                if (data.exceptionReport) {
                    options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */]({
                        message : __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EXCEPTION", data.exceptionReport),
                        type : __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */].TYPE_SRVERR,
                        status : 200
                    }));
                    return;
                }
            }
        } else {
            // si la réponse (xmlString) est vide, on appelle le callback d'erreur
            options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EMPTY")));
            return;
        }

        // si tout s'est bien passé, on appelle le callback de succès
        options.onSuccess.call(options.scope, data);
    }
};

/* harmony default export */ __webpack_exports__["a"] = (AutoCompleteResponseFactory);


/***/ }),
/* 85 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__CommonService__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__DefaultUrlService__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Request_RouteRequestFactory__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Response_RouteResponseFactory__ = __webpack_require__(94);









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
        throw new TypeError(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("CLASS_CONSTRUCTOR", "Route"));
    }

    /**
     * Nom de la classe (heritage)
     */
    this.CLASSNAME = "Route";

    // appel du constructeur par heritage
    __WEBPACK_IMPORTED_MODULE_3__CommonService__["a" /* default */].apply(this, arguments);

    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("Gp.Services.Route");
    this.logger.trace("[Constructeur Route (options)]");

    if (!options.startPoint) {
        throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_MISSING", "startPoint"));
    }

    // on lance une exception afin d'eviter au service de le faire...
    if (options.startPoint.x === null) {
        throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_MISSING", "startPoint.x"));
    }

    if (options.startPoint.y === null) {
        throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_MISSING", "startPoint.y"));
    }

    if (!options.endPoint) {
        throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_MISSING", "endPoint"));
    }

    // on lance une exception afin d'eviter au service de le faire...
    if (options.endPoint.x === null) {
        throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_MISSING", "endPoint.x"));
    }

    if (options.endPoint.y === null) {
        throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_MISSING", "endPoint.y"));
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
        var lstUrlByDefault = __WEBPACK_IMPORTED_MODULE_4__DefaultUrlService__["a" /* default */].Route.url(this.options.apiKey);
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
                throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_UNKNOWN", "api"));
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
Route.prototype = Object.create(__WEBPACK_IMPORTED_MODULE_3__CommonService__["a" /* default */].prototype, {
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

    this.request = __WEBPACK_IMPORTED_MODULE_5__Request_RouteRequestFactory__["a" /* default */].build(options);

    // on teste si la requete a bien été construite !
    if (!this.request) {
        error.call(this, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_REQUEST_BUILD")));
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

        __WEBPACK_IMPORTED_MODULE_6__Response_RouteResponseFactory__["a" /* default */].build(options);
    } else {
        error.call(this, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EMPTY")));
    }
};

/* harmony default export */ __webpack_exports__["a"] = (Route);


/***/ }),
/* 86 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Exceptions_ErrorService__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__RouteRequestOLS__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__RouteRequestREST__ = __webpack_require__(92);
/**
 * Creation d'une requête OpenLS ou REST en mode POST ou GET
 * (Factory)
 *
 * @module RouteRequestFactory
 * @alias Gp.Services.Route.Request.RouteRequestFactory
 * @private
 */





var RouteRequestFactory = {

    /**
     * interface unique
     *
     * @method build
     * @static
     * @param {Object} options - options definies dans le composant Route
     *
     * @example
     *   // utilisation avec les callback
     *   var options = {
     *      (...)
     *      onSuccess : function (response) {},
     *      onError : function (error) {},
     *      // spécifique au service
     *      api : 'OLS',
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
     *   };
     *   RouteRequestFactory.build(options);
     *
     *   // utilisation sans callback
     *   var options = {...};
     *   try {
     *      var result = RouteRequestFactory.build(options);
     *      if (! result) { throw new Error("..."):}
     *   } catch (e) {
     *      // todo
     *   }
     * @returns {String} request
     */
    build : function (options) {
        // logger
        var logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("RouteRequestFactory");
        logger.trace(["RouteRequestFactory::build()"]);

        var request = null;

        var settings = options || {};

        // gestion des callback
        var bOnError = !!((options.onError !== null && typeof options.onError === "function"));

        var message = null;
        // choix entre les 2 types d'API pour consulter le service
        switch (options.api) {
            case "REST":
                // FIXME les exceptions ne sont pas 'catchées' sur le constructeur !
                var myReq = new __WEBPACK_IMPORTED_MODULE_3__RouteRequestREST__["a" /* default */](settings);
                if (!myReq.processRequestString()) {
                    message = "Error process request (rest) !";
                    if (bOnError) {
                        options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_1__Exceptions_ErrorService__["a" /* default */](message));
                        return;
                    }
                    throw new Error(message);
                }
                request = myReq.requestString;
                break;
            case "OLS":
                request = __WEBPACK_IMPORTED_MODULE_2__RouteRequestOLS__["a" /* default */].build(settings);
                if (!request) {
                    message = "Error process request (ols) !";
                    if (bOnError) {
                        options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_1__Exceptions_ErrorService__["a" /* default */](message));
                        return;
                    }
                    throw new Error(message);
                }
                break;
            default:
                message = "Type of API is not supported by service (REST or OLS) !";
                if (bOnError) {
                    options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_1__Exceptions_ErrorService__["a" /* default */](message));
                    return;
                }
                throw new Error(message);
        }

        return request;
    }
};

/* harmony default export */ __webpack_exports__["a"] = (RouteRequestFactory);


/***/ }),
/* 87 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Formats_XLS__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Formats_XLS_RouteService__ = __webpack_require__(88);
/**
 * Creation d'une requête OpenLS en mode POST ou GET
 * (Factory)
 *
 * @module RouteRequestOLS
 * @alias Gp.Services.Route.Request.RouteRequestOLS
 * @private
 */




var RouteRequestOLS = {

    /**
     * interface unique
     *
     * @method build
     * @static
     * @param {Object} options - options definies dans le composant Route
     *
     * @example
     *   var options = {
     *      (...)
     *   };
     *
     * @returns {String} request
     */
    build : function (options) {
        // logger
        var logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("RouteRequestOLS");
        logger.trace(["RouteRequestOLS::build()"]);

        var request = null;

        // spécifique au service
        var settings = {
            startPoint : options.startPoint,
            endPoint : options.endPoint,
            viaPoint : options.viaPoints, // mapping OLS et options
            provideBoundingBox : options.provideBbox, // mapping OLS et options
            avoidFeature : options.exclusions, // mapping OLS et options
            expectedStartTime : options.expectedStartTime, // TODO format ?
            distanceUnit : options.distanceUnit,
            graph : options.graph,
            provideGeometry : options.geometryInInstructions, // mapping OLS et options
            routePreference : options.routePreference
        };

        // objet RouteService
        var oRS = new __WEBPACK_IMPORTED_MODULE_2__Formats_XLS_RouteService__["a" /* default */](settings);

        // Format XLS
        var oXLS = new __WEBPACK_IMPORTED_MODULE_1__Formats_XLS__["a" /* default */]({
            srsName : options.srs,
            maximumResponses : options.maximumResponses
        });
        oXLS.namespace = true;
        oXLS.setService(oRS);

        // request brute !
        request = oXLS.build();

        // en mode GET, la requête est encodée
        // et le param. 'qxml' est ajouté
        if (options.httpMethod === "GET") {
            var myRequest = "qxml=" +
                encodeURIComponent(request)
                    .replace(/-/g, "%2D")
                    .replace(/_/g, "%5F")
                    .replace(/\./g, "%2E")
                    .replace(/!/g, "%21")
                    .replace(/~/g, "%7E")
                    .replace(/\*/g, "%2A")
                    .replace(/'/g, "%27")
                    .replace(/\(/g, "%28")
                    .replace(/\)/g, "%29");
            request = myRequest;
        }

        return request;
    }
};

/* harmony default export */ __webpack_exports__["a"] = (RouteRequestOLS);


/***/ }),
/* 88 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__AbstractService__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__RouteService_DetermineRouteRequest__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__RouteService_RouteRequestExtension__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__RouteService_RouteRequestExtension___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__RouteService_RouteRequestExtension__);





/**
 * @classdesc
 *
 * Requête de type RouteService
 * (Factory)
 *
 * XSD :
 * ----
 * [] => non implementé !
 *
 * ```
 * element name="DetermineRouteRequest"
 *  [attribute name="provideRouteHandle" default="false"]
 *  attribute name="distanceUnit"       default="M"
 *      [element ref="xls:RouteHandle" || element ref="xls:RoutePlan"]
 *      element ref="xls:RoutePlan"
 *      element ref="xls:RouteInstructionsRequest"
 *      [element ref="xls:RouteGeometryRequest"]
 *      [element ref="xls:RouteMapRequest"]
 * ```
 * ```
 * element name="RoutePlan"
 *  [attribute name="useRealTimeTraffic" default="false"]
 *  [attribute name="expectedStartTime"  type="dateTime"]
 *  [attribute name="expectedEndTime"    type="dateTime"]
 *      element ref="xls:RoutePreference"
 *      element ref="xls:WayPointList"
 *      element ref="xls:AvoidList"
 * ```
 * ```
 * element name="RoutePreference" => value = Fastest | Shortest | Pedestrian
 * ```
 * ```
 * element name="WayPointList"
 *      element ref="xls:StartPoint"
 *      element ref="xls:ViaPoint" minOccurs="0"
 *      element ref="xls:EndPoint"
 * ```
 * ```
 * element name="StartPoint"
 *    [element name="GeocodeMatchCode"]
 *      [attribute name="accuracy"]
 *      [attribute name="matchType"] => value = City, Street, Street number, Street enhanced, ...
 *    element name="Position"
 *      element ref="gml:Point"
 * ```
 * ```
 * element name="ViaPoint"
 *    [element name="GeocodeMatchCode"]
 *      [attribute name="accuracy"]
 *      [attribute name="matchType"] => value = City, Street, Street number, Street enhanced, ...
 *    element name="Position"
 *      element ref="gml:Point"
 * ```
 * ```
 * element name="EndPoint"
 *    [element name="GeocodeMatchCode"]
 *      [attribute name="accuracy"]
 *      [attribute name="matchType"] => value = City, Street, Street number, Street enhanced, ...
 *    element name="Position"
 *      element ref="gml:Point"
 * ```
 * ```
 * element name="AvoidList"
 *      [element ref="xls:AOI"]
 *      [element ref="xls:_Location"] (cf. element name="Position")
 *      element ref="xls:AvoidFeature"
 * ```
 * ```
 * [element name="AOI"]
 *      [element ref="gml:CircleByCenterPoint" || element ref="gml:Polygon" || element ref="gml:Envelope"]
 * ```
 * ```
 * element name="AvoidFeature" => value = highway | tollway | tunnel | bridge
 * ```
 * ```
 * [element name="RouteMapRequest"]
 *      [element name="Output"]
 *          attribute name="width"
 *          attribute name="height"
 *          attribute name="format"
 *          attribute name="BGcolor"
 *          attribute name="transparent"
 *          attribute name="style" => value = Overview | Maneuver
 *          element name="BBoxContext" type="gml:EnvelopeType"
 * ```
 * ```
 * element name="RouteInstructionsRequest"
 *  [attribute name="format"]           default="text/plain"
 *  attribute name="provideGeometry"    default="false"
 *  attribute name="provideBoundingBox" default="false"
 * ```
 * ```
 * [element name="RouteGeometryRequest"]
 *  [attribute name="scale"]                  default="1"
 *  [attribute name="provideStartingPortion"] default="false"
 *  [attribute name="maxPoints"]              default="100"
 *      [element name="BoundingBox" type="gml:EnvelopeType" ]
 * ```
 *
 * --------
 * Requête :
 * --------
 * ```
 * <?xml version="1.0" encoding="UTF-8"?>
 * <XLS
 * xmlns:xls="http://www.opengis.net/xls"
 * xmlns:sch="http://www.ascc.net/xml/schematron"
 * xmlns:gml="http://www.opengis.net/gml"
 * xmlns:xlsext="http://www.opengis.net/xlsext"
 * xmlns:xlink="http://www.w3.org/1999/xlink"
 * xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 * xsi:schemaLocation="http://www.opengis.net/xls http://schemas.opengis.net/ols/1.1.0/RouteService.xsd"
 * version="1.1" xls:lang="en">
 * <RequestHeader/>
 * <Request methodName="RouteRequest" requestID="123456789" version="1.1">
 *   <DetermineRouteRequest distanceUnit="KM">
 *     <RoutePlan>
 *       <RoutePreference>Fastest</RoutePreference>
 *       <xlsext:vehicle name="Car" />
 *       <WayPointList>
 *         <StartPoint>
 *           <Position><gml:Point srsName="EPSG:4326"><gml:pos>2.29993 48.87228</gml:pos></gml:Point></Position>
 *         </StartPoint>
 *         <EndPoint>
 *           <Position><gml:Point srsName="EPSG:4326"><gml:pos>-1.53604 47.21548</gml:pos></gml:Point></Position>
 *         </EndPoint>
 *       </WayPointList>
 *     </RoutePlan>
 *     <RouteInstructionsRequest provideGeometry="true"/>
 *     <RouteGeometryRequest/>
 *   </DetermineRouteRequest>
 * </Request>
 * </XLS
 * ```
 * -----------
 * References :
 * -----------
 * - {@link https://geoportail.forge.ign.fr/jira/browse/GPP-CI}
 * - {@link https://geoportail.forge.ign.fr/jira/browse/GPP-CI-1 Specif. ols}
 * - {@link https://geoportail.forge.ign.fr/jira/browse/GPP-CI-9 Extension}
 * - {@link https://github.com/Emergya/openlayers/blob/master/lib/OpenLayers/Format/XLS/v1_2_0.js}
 *
 * @example
 * // encapsule un objet dans une coquille XSL, Factory sur les objets ''
 * rs = new RouteService ();
 * rs.addRequest (req);
 * rs.toString();
 *  ou
 * rs = new RouteService ({
 *      ...
 * });
 * rs.toString();
 *
 * @extends {Gp.Formats.XLS}
 * @constructor
 * @alias Gp.Formats.XLS.RouteService
 * @param {Object} options - options
 * @param {Object}   options.routePreference - « fastest », « shortest » ou « pedestrian »
 * @param {String}   options.startPoint - Point de départ (coordonnées exprimées en WGS84G)
 * @param {String}   options.viaPoint - Liste de points intermédiaires
 * @param {String}   options.endPoint - Point d'arrivée (coordonnées)
 * @param {Object}   options.avoidFeature - « highway », « tollway », « tunnel » ou « bridge »
 * @param {Object}   options.graph - « car »
 * @param {Object}   options.expectedStartTime - Date et heure de départ
 * @param {Object}   options.provideGeometry - true | false
 * @param {Object}   options.provideBoundingBox - true | false
 * @param {Object}   options.distanceUnit - Unité dans lesquelles la distance est exprimée (« m » ou « km »)
 * @param {Function} options.onsuccess - function callback success (TODO)
 * @param {Function} options.onerror   - function callback error   (TODO)
 *
 * @example
 * var options = {
 *      // spécifique au service
 *      startPoint: {
 *          x: 42.1121,
 *          y: 1.5557
 *      },
 *      endPoint: {
 *          x: 42.1121,
 *          y: 1.5557
 *      },
 *      viaPoint : [
 *          {x: 42.1121,y: 1.5557},
 *          {x: 42.1121,y: 1.5557},
 *          {x: 42.1121,y: 1.5557}
 *      ],
 *      provideBoundingBox : false,
 *      avoidFeature : ["bridge", "tunnel", "tollway"],
 *      expectedStartTime : "2015-12-23", // YYYY-MM-DDThh:mm:ssZ
 *      distanceUnit : "km",
 *      vehicle: "car",
 *      provideGeometry : false,
 *      routePreference : "fastest"
 * };
 *
 * @private
 */
function RouteService (options) {
    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger();
    this.logger.trace("[Constructeur RouteService ()]");

    if (!(this instanceof RouteService)) {
        throw new TypeError("RouteService constructor cannot be called as a function.");
    }

    /**
     * Nom de la classe
     */
    this.CLASSNAME = "RouteService";

    /**
     * Type de classe
     * RouteRequest par defaut
     */
    this.CLASSTYPE = "RouteRequest";

    // appel du constructeur par heritage
    __WEBPACK_IMPORTED_MODULE_1__AbstractService__["a" /* default */].apply(this, arguments);
}

/**
 * @lends module:RouteService#
 */
RouteService.prototype = Object.create(__WEBPACK_IMPORTED_MODULE_1__AbstractService__["a" /* default */].prototype, {
    // todo
    // getter/setter
});

/**
 * Constructeur (alias)
 */
RouteService.prototype.constructor = RouteService;

/**
 * (overwrite) Ajout d'un objet de type  : RouteRequest
 *
 * @param {Object} oRequest - RouteRequest
 */
RouteService.prototype.addRequest = function (oRequest) {
    // on controle les types acceptés
    if (oRequest.CLASSNAME === "DetermineRouteRequest") {
        this.oRequest = oRequest;
    } else {
        throw new Error("Ce n'est pas un objet de type 'Route Request' !?");
    }
};

/**
 * (overwrite) Ajout d'un objet de type RouteFilterExtension
 *
 * @param {Object} oFilter - RouteFilterExtension
 */
RouteService.prototype.addFilter = function (oFilter) {
    // gestion des extensions (vehicle)
    if (oFilter instanceof __WEBPACK_IMPORTED_MODULE_3__RouteService_RouteRequestExtension___default.a) {
        this.oFilter = oFilter;
    }
};

/**
 * (overwrite) toString
 *
 * @returns {String} requête
 */
RouteService.prototype.toString = function () {
    // soit, on a un objet Request déjà instancié
    // sinon, il faut le construire à partir des options à disposition
    if (!this.oRequest) {
        // il nous faut des options
        if (!this.options) {
            throw new Error("Les options ne sont pas renseignées, impossible de construire la requête !");
        }

        if (this.CLASSTYPE === "RouteRequest") {
            var settings = {
                distanceUnit : this.options.distanceUnit || null,
                provideGeometry : this.options.provideGeometry || null,
                provideBoundingBox : this.options.provideBoundingBox || null,
                route : {
                    routePreference : this.options.routePreference || null,
                    startPoint : this.options.startPoint,
                    viaPoint : this.options.viaPoint || null,
                    endPoint : this.options.endPoint,
                    avoidFeature : this.options.avoidFeature || null,
                    graph : this.options.graph || null,
                    expectedStartTime : this.options.expectedStartTime || null
                }
            };
            this.oRequest = new __WEBPACK_IMPORTED_MODULE_2__RouteService_DetermineRouteRequest__["a" /* default */](settings);
            // ajout des filtres spécifiques au service
            if (this.oFilter) {
                this.oRequest.addFilter(this.oFilter);
            }
        }
    }

    // objet indefini !?
    if (!this.oRequest) {
        throw new Error("Type de requête indefini !");
    }

    this.strRequest = this.oRequest.toString();
    return this.strRequest;
};

/* harmony default export */ __webpack_exports__["a"] = (RouteService);


/***/ }),
/* 89 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model_RoutePlan__ = __webpack_require__(90);



/**
 * @classdesc
 *
 * Requête de calcul d'itinéraire
 *
 * ----
 * XSD :
 * ----
 * [] => non implementé !
 *
 * ```
 * element name="DetermineRouteRequest"
 *  [attribute name="provideRouteHandle" default="false"]
 *  attribute name="distanceUnit"       default="M"
 *      [element ref="xls:RouteHandle" || element ref="xls:RoutePlan"]
 *      element ref="xls:RoutePlan"
 *      element ref="xls:RouteInstructionsRequest"
 *      [element ref="xls:RouteGeometryRequest"]
 *      [element ref="xls:RouteMapRequest"]
 * ```
 * ```
 * element name="RouteInstructionsRequest"
 *  [attribute name="format"]           default="text/plain"
 *  attribute name="provideGeometry"    default="false"
 *  attribute name="provideBoundingBox" default="false"
 * ```
 * ```
 * element name="RouteGeometryRequest"
 *  [attribute name="scale"]                  default="1"
 *  [attribute name="provideStartingPortion"] default="false"
 *  [attribute name="maxPoints"]              default="100"
 *      [element name="BoundingBox" type="gml:EnvelopeType" ]
 * ```
 * ```
 * [element name="RouteMapRequest"]
 *      [element name="Output"]
 *          [attribute name="width"]
 *          [attribute name="height"]
 *          [attribute name="format"]
 *          [attribute name="BGcolor"]
 *          [attribute name="transparent"]
 *          [attribute name="style"] => value = Overview | Maneuver
 *          [element name="BBoxContext" type="gml:EnvelopeType"]
 * ```
 *
 * --------
 * Requête :
 * --------
 * ```
 *   <DetermineRouteRequest distanceUnit="KM">
 *     <RoutePlan>
 *              <RoutePreference>Fastest</RoutePreference>
 *              <xlsext:vehicle name="Car" />
 *              <WayPointList>
 *                  <StartPoint>
 *                      <Position><gml:Point srsName="EPSG:4326"><gml:pos>2.29993 48.87228</gml:pos></gml:Point></Position>
 *                  </StartPoint>
 *                  <EndPoint>
 *                      <Position><gml:Point srsName="EPSG:4326"><gml:pos>-1.53604 47.21548</gml:pos></gml:Point></Position>
 *                  </EndPoint>
 *              </WayPointList>
 *     </RoutePlan>
 *     <RouteInstructionsRequest provideGeometry="true"/>
 *     <RouteGeometryRequest/>
 *   </DetermineRouteRequest>
 * ```
 *
 * @constructor
 * @alias Gp.Formats.XLS.RouteService.DetermineRouteRequest
 * @param {Object} options - options
 * @param {Object}   options.route.routePreference - « fastest », « shortest » ou « pedestrian »
 * @param {String}   options.route.startPoint - Point de départ (coordonnées exprimées en WGS84G)
 * @param {String}   options.route.viaPoint - Liste de points intermédiaires
 * @param {String}   options.route.endPoint - Point d'arrivée (coordonnées)
 * @param {Object}   options.route.avoidFeature - « highway », « tollway », « tunnel » ou « bridge »
 * @param {Object}   options.route.vehicle - « car »
 * @param {Object}   options.route.expectedStartTime - Date et heure de départ
 * @param {Object}   options.provideGeometry - true | false
 * @param {Object}   options.provideBoundingBox - true | false
 * @param {Object}   options.distanceUnit - Unité dans lesquelles la distance est exprimée (« m » ou « km »)
 * @param {Function} options.onsuccess - function callback success (TODO)
 * @param {Function} options.onerror   - function callback error   (TODO)
 *
 * @private
 */
function DetermineRouteRequest (options) {
    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger();
    this.logger.trace("[Constructeur DetermineRouteRequest ()]");

    if (!(this instanceof DetermineRouteRequest)) {
        throw new TypeError("DetermineRouteRequest constructor cannot be called as a function.");
    }

    // options par defaut
    this.options = options || {};

    // et on ajoute les options en paramètre aux options par défaut
    for (var opt in options) {
        if (options.hasOwnProperty(opt)) {
            this.options[opt] = options[opt];
        }
    }

    /**
     * Nom de la classe (heritage)
     */
    this.CLASSNAME = "DetermineRouteRequest";
}

DetermineRouteRequest.prototype = {

    /**
     * @lends module:DetermineRouteRequest#
     */

    /**
     * request (out)
     * @type {String}
     */
    strRequest : null,

    /**
     * RoutePlan
     * @type {Address}
     */
    oRoutePlan : null,

    /**
     * Template de la requête.
     * substitution des valeurs suivantes :
     * __DISTANCEUNIT__,
     * __ROUTEPLAN__, __ROUTEINSTRUCTIONREQUEST__, __ROUTEGEOMETRYREQUEST__, __ROUTEMAPREQUEST__
     * __PROVIDEGEOMETRY__, __PROVIDEBBOX__
     */
    template : {
        determineRouteRequest : "<DetermineRouteRequest distanceUnit=\"__DISTANCEUNIT__\">" +
            "__ROUTEPLAN__" +
            "__ROUTEINSTRUCTIONREQUEST__" +
            "__ROUTEGEOMETRYREQUEST__" +
            "__ROUTEMAPREQUEST__" +
            "</DetermineRouteRequest>",
        routeInstructionRequest : "<RouteInstructionsRequest " +
            "provideGeometry=\"__PROVIDEGEOMETRY__\" " +
            "provideBoundingBox=\"__PROVIDEBBOX__\" />",
        routeGeometryRequest : "<RouteGeometryRequest />",
        routeMapRequest : "" // FIXME <RouteMapRequest/> not yet implemented !
    },

    /**
     * Ajout d'un objet de type RoutePlan
     *
     * @param {Object} oRoutePlan - RoutePlan
     */
    addRoute : function (oRoutePlan) {
        if (oRoutePlan instanceof __WEBPACK_IMPORTED_MODULE_1__model_RoutePlan__["a" /* default */]) {
            this.oRoutePlan = oRoutePlan;
        }
    },

    /**
     * Constructeur (alias)
     */
    constructor : DetermineRouteRequest,

    /**
     * toString
     *
     * @returns {String} requête
     */
    toString : function () {
        var template = "";
        template = this.template.determineRouteRequest;
        template = template.replace(/__DISTANCEUNIT__/g, this.options.distanceUnit || "KM");

        // soit on a déjà un objet RoutePlan instancié,
        // sinon, on le fabrique via les options
        if (!this.oRoutePlan) {
            var settings = this.options.route;

            this.oRoutePlan = new __WEBPACK_IMPORTED_MODULE_1__model_RoutePlan__["a" /* default */](settings);
            if (!this.oRoutePlan) {
                throw new Error("La construction du calcul d'initineraire n'est pas correctement definie !?");
            }
        }

        // routeplan
        template = template.replace(/__ROUTEPLAN__/g, this.oRoutePlan.toString());

        // instruction
        var tmplInstruction = this.template.routeInstructionRequest;
        tmplInstruction = tmplInstruction.replace(/__PROVIDEGEOMETRY__/g, this.options.provideGeometry || false);
        tmplInstruction = tmplInstruction.replace(/__PROVIDEBBOX__/g, this.options.provideBoundingBox || false);
        template = template.replace(/__ROUTEINSTRUCTIONREQUEST__/g, tmplInstruction);

        // geometry
        var tmplGeometry = this.template.routeGeometryRequest;
        template = template.replace(/__ROUTEGEOMETRYREQUEST__/g, tmplGeometry);

        // map
        var tmplMap = this.template.routeMapRequest;
        template = template.replace(/__ROUTEMAPREQUEST__/g, tmplMap);

        this.strRequest = template;
        return this.strRequest;
    }
};

/* harmony default export */ __webpack_exports__["a"] = (DetermineRouteRequest);


/***/ }),
/* 90 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);


/**
 * @classdesc
 *  * Élément regroupant l'ensemble des données et paramètres pour le calcul d'itinéraire : points de navigation, configuration.
 *
 * ----
 * XSD :
 * ----
 * [] => non implementé !
 *
 * ```
 * element name="RoutePlan"
 *  [attribute name="useRealTimeTraffic" default="false"]
 *  [attribute name="expectedStartTime"  type="dateTime"]
 *  [attribute name="expectedEndTime"    type="dateTime"]
 *      element ref="xls:RoutePreference"
 *      element ref="xls:WayPointList"
 *      element ref="xls:AvoidList"
 * ```
 * ```
 * element name="RoutePreference"
 *  => value = fastest | shortest | pedestrian
 * ```
 * ```
 * element name="WayPointList"
 *      element ref="xls:StartPoint"
 *      element ref="xls:ViaPoint" minOccurs="0"
 *      element ref="xls:EndPoint"
 * ```
 * ```
 * element name="StartPoint"
 *    [element name="GeocodeMatchCode"]
 *      [attribute name="accuracy"]
 *      [attribute name="matchType"] => value = City, Street, Street number, Street enhanced, ...
 *    element name="Position"
 *      element ref="gml:Point"
 * ```
 * ```
 * element name="ViaPoint"
 *    [element name="GeocodeMatchCode"]
 *      [attribute name="accuracy"]
 *      [attribute name="matchType"] => value = City, Street, Street number, Street enhanced, ...
 *    element name="Position"
 *      element ref="gml:Point"
 * ```
 * ```
 * element name="EndPoint"
 *    [element name="GeocodeMatchCode"]
 *      [attribute name="accuracy"]
 *      [attribute name="matchType"] => value = City, Street, Street number, Street enhanced, ...
 *    element name="Position"
 *      element ref="gml:Point"
 * ```
 * ```
 * element name="AvoidList"
 *      [element ref="xls:AOI"]
 *      [element ref="xls:_Location"] (cf. element name="Position")
 *      element ref="xls:AvoidFeature"
 * ```
 * ```
 * [element name="AOI"]
 *      [element ref="gml:CircleByCenterPoint" || element ref="gml:Polygon" || element ref="gml:Envelope"]
 * ```
 * ```
 * element name="AvoidFeature" => value = highway | tollway | tunnel | bridge
 * ```
 *
 * --------
 * Requête :
 * --------
 * ```
 *     <RoutePlan>
 *       <RoutePreference>Fastest</RoutePreference>
 *       <xlsext:vehicle name="Car" />
 *       <WayPointList>
 *         <StartPoint>
 *           <Position><gml:Point srsName="EPSG:4326"><gml:pos>2.29993 48.87228</gml:pos></gml:Point></Position>
 *         </StartPoint>
 *         <EndPoint>
 *           <Position><gml:Point srsName="EPSG:4326"><gml:pos>-1.53604 47.21548</gml:pos></gml:Point></Position>
 *         </EndPoint>
 *       </WayPointList>
 *       <AvoidList>
 *          <AvoidFeature>highway</AvoidFeature>
 *          <AvoidFeature>tollway</AvoidFeature>
 *          <AvoidFeature>tunnel</AvoidFeature>
 *       </AvoidList>
 *     </RoutePlan>
 * ```
 * @constructor
 * @alias Gp.Formats.XLS.RouteService.RoutePlan
 * @param {Object} options - options
 *
 * @private
 */
function RoutePlan (options) {
    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("RoutePlan");
    this.logger.trace("[Constructeur RoutePlan ()]");

    if (!(this instanceof RoutePlan)) {
        throw new TypeError("RoutePlan constructor cannot be called as a function.");
    }

    // param par defaut
    this.options = options || {};

    // param obligatoire
    if (!options.startPoint) {
        throw new Error("l'option 'startPoint' n'est pas renseignée !");
    }

    if (!options.endPoint) {
        throw new Error("l'option 'endPoint' n'est pas renseignée !");
    }

    // et on ajoute les options en paramètre aux options par défaut
    for (var opt in options) {
        if (options.hasOwnProperty(opt)) {
            this.options[opt] = options[opt];
        }
    }
}

RoutePlan.prototype = {

    /**
     * Constructeur (alias)
     */
    constructor : RoutePlan,

    /**
     * request (out)
     * @type {String}
     */
    requestString : null,

    /**
     * Template de la requête.
     * substitution des valeurs suivantes :
     * - __ROUTEPREFERENCE__, __VALUEROUTEPREFERENCE__
     * - __GRAPH__, __VALUEGRAPH__
     * - __WAYPOINTLIST__ (lst?), __STARTPOINT__, __VIAPOINT__, __ENDPOINT__, __POINT__, __X__, __Y__
     * - __AVOIDLIST__ (lst!), __AVOIDFEATURE__, __VALUEAVOIDFEATURE__
     */
    template : {
        routePlan : "<RoutePlan>" +
            "__ROUTEPREFERENCE__" +
            "__GRAPH__" +
            "__WAYPOINTLIST__" +
            "__AVOIDLIST__" +
            "</RoutePlan>",
        routePreference : "<RoutePreference>__VALUEROUTEPREFERENCE__</RoutePreference>",
        graph : "<xlsext:graphName xmlns:xlsext=\"http://www.opengis.net/xlsext\" name=\"__VALUEGRAPH__\"/>",
        wayPointList : {
            container : "<WayPointList>" +
                "__STARTPOINT__" +
                "__VIAPOINT__" +
                "__ENDPOINT__" +
                "</WayPointList>",
            point : "<Position><gml:Point xmlns:gml=\"http://www.opengis.net/gml\"><gml:pos>__X__ __Y__</gml:pos></gml:Point></Position>",
            startPoint : "<StartPoint>" +
                "__POINT__" +
                "</StartPoint>",
            endPoint : "<EndPoint>" +
                "__POINT__" +
                "</EndPoint>",
            viaPoint : "<ViaPoint>" +
                "__POINT__" +
                "</ViaPoint>" // implémentation de plusieurs étapes...
        },
        avoidList : {
            container : "<AvoidList>" +
                "__AVOIDFEATURE__" +
                "</AvoidList>",
            avoidFeature : "<AvoidFeature>__VALUEAVOIDFEATURE__</AvoidFeature>"
        }
    },

    /**
     * toString
     *
     * @returns {String} requête
     */
    toString : function () {
        var template = "";
        template = this.template.routePlan;

        // preference
        if (this.options.routePreference) {
            var tmplPreference = this.template.routePreference;
            tmplPreference = tmplPreference.replace(/__VALUEROUTEPREFERENCE__/, this.options.routePreference);
            template = template.replace(/__ROUTEPREFERENCE__/g, tmplPreference);
        }
        // clean preference
        template = template.replace(/__ROUTEPREFERENCE__/g, "");

        // exclusions
        if (this.options.avoidFeature) {
            var tmplAvoidList = this.template.avoidList.container;
            var avoidFeatures = [];
            for (var i = 0; i < this.options.avoidFeature.length; i++) {
                var tmplAvoidFeature = this.template.avoidList.avoidFeature;
                tmplAvoidFeature = tmplAvoidFeature.replace(/__VALUEAVOIDFEATURE__/, this.options.avoidFeature[i]);
                avoidFeatures.push(tmplAvoidFeature);
            }
            tmplAvoidList = tmplAvoidList.replace(/__AVOIDFEATURE__/, avoidFeatures.join("\n"));
            template = template.replace(/__AVOIDLIST__/g, tmplAvoidList);
        }
        // clean exclusions
        template = template.replace(/__AVOIDLIST__/g, "");

        // graph
        if (this.options.graph) {
            var tmplVehicle = this.template.graph;
            tmplVehicle = tmplVehicle.replace(/__VALUEGRAPH__/, this.options.graph);
            template = template.replace(/__GRAPH__/g, tmplVehicle);
        }
        // clean vehicle
        template = template.replace(/__GRAPH__/g, "");

        // points
        var tmplWayPointList = this.template.wayPointList.container;
        var tmplPoint = "";
        // start
        tmplPoint = this.template.wayPointList.point;
        tmplPoint = tmplPoint.replace(/__X__/, this.options.startPoint.x);
        tmplPoint = tmplPoint.replace(/__Y__/, this.options.startPoint.y);
        tmplWayPointList = tmplWayPointList.replace(/__STARTPOINT__/,
            this.template.wayPointList.startPoint.replace(/__POINT__/, tmplPoint));
        // end
        tmplPoint = this.template.wayPointList.point;
        tmplPoint = tmplPoint.replace(/__X__/, this.options.endPoint.x);
        tmplPoint = tmplPoint.replace(/__Y__/, this.options.endPoint.y);
        tmplWayPointList = tmplWayPointList.replace(/__ENDPOINT__/,
            this.template.wayPointList.endPoint.replace(/__POINT__/, tmplPoint));
        // via
        if (this.options.viaPoint) {
            var points = [];
            for (var j = 0; j < this.options.viaPoint.length; j++) {
                var p = this.options.viaPoint[j];
                tmplPoint = this.template.wayPointList.point;
                tmplPoint = tmplPoint.replace(/__X__/, p.x);
                tmplPoint = tmplPoint.replace(/__Y__/, p.y);
                points.push(tmplPoint);
            }

            tmplWayPointList = tmplWayPointList.replace(/__VIAPOINT__/,
                this.template.wayPointList.viaPoint.replace(/__POINT__/, points.join("\n")));
        } else {
            // clean viaPoint
            tmplWayPointList = tmplWayPointList.replace(/__VIAPOINT__/, "");
        }

        template = template.replace(/__WAYPOINTLIST__/g, tmplWayPointList);

        this.requestString = template;
        return this.requestString;
    }
};

/* harmony default export */ __webpack_exports__["a"] = (RoutePlan);


/***/ }),
/* 91 */
/***/ (function(module, exports) {

/**
 * not implemented !
 *
 * Extension de type 'graphName' de l'objet RoutePlan'
 *
 * FIXME L'extension 'graphName' est intégré comme étant du standard OLS.
 *       La balise <xlsext:GraphName> viendrait surcharger le comportement de RoutePreference...
 *
 * ex. <xlsext:graphName name="Voiture" />
 */


/***/ }),
/* 92 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__model_RouteParamREST__ = __webpack_require__(93);





/**
 * @classdesc
 * Classe de gestion des requêtes de type REST sur le service de calcul d'itineraire
 * (uniquement en GET)
 *
 * @constructor
 * @alias Gp.Services.Route.Request.RouteRequestREST
 * @param {Object} options - options definies dans le composant Route
 *
 * @example
 * var options = {
 *      (...)
 * };
 *
 * @private
 */
function RouteRequestREST (options) {
    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("RouteRequestREST");
    this.logger.trace("[Constructeur RouteRequestREST ()]");

    if (!(this instanceof RouteRequestREST)) {
        throw new TypeError("RouteRequestREST constructor cannot be called as a function.");
    }

    // existance des options
    if (!options) {
        throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_EMPTY", "options"));
    }

    /** liste des options */
    this.settings = options;
}

RouteRequestREST.prototype = {

    /**
     * @lends module:RouteRequestREST#
     */

    /**
     * request
     * @type {String}
     */
    requestString : null,

    /**
     * Constructeur (alias)
     */
    constructor : RouteRequestREST,

    /**
     * Construction de la requête.
     *
     * @example
     * // GET  out : origin=2.416907353809513,48.8465772142297&destination=2.4248037771493673,48.84591353161838
     * // POST out : Not yet supported method POST !
     * @returns {String} request
     */
    processRequestString : function () {
        // INFO
        // construction simple sans template...,
        // mais en attendant que les services soient fixés, on taggue ce composant en mode PROTOTYPE !
        this.logger.warn(" PROTOTYPE !");

        // Mapping des options avec le service de l'API REST
        var oParams = new __WEBPACK_IMPORTED_MODULE_2__model_RouteParamREST__["a" /* default */](this.settings);
        var params = oParams.getParams();

        var request = "";
        for (var i = 0; i < params.length; i++) {
            var o = params[i];
            if (request) {
                request += "&";
            }
            request += o.k + "=" + o.v;
        }

        // Exemple :
        //  http://wxs.ign.fr/KEY/itineraire/rest/route.json?
        //  origin=&
        //  destination=&
        //  waypoints=&
        //  method=DISTANCE&
        //  graph=Pieton&
        //  graphName=Pieton&
        //  exclusions=&
        //  tolerance=10&
        //  srs=

        this.logger.trace(request);
        this.requestString = request;

        return this.requestString;
    }
};

/* harmony default export */ __webpack_exports__["a"] = (RouteRequestREST);


/***/ }),
/* 93 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);



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

    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger();
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

/* harmony default export */ __webpack_exports__["a"] = (RouteParamREST);


/***/ }),
/* 94 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Formats_XML__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Formats_WKT__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Formats_RouteResponseRESTReader__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Formats_RouteResponseOLSReader__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__model_RouteResponse__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__model_RouteInstruction__ = __webpack_require__(17);
/**
 * Factory pour générer une reponse JSON à partir d'un XML ou d'un JSON
 * (Factory)
 *
 * @module RouteResponseFactory
 * @alias Gp.Services.Route.Response.RouteResponseFactory
 * @private
 */










var RouteResponseFactory = {

    /**
     * interface unique
     *
     * @method build
     * @static
     * @param {Object} options - options definies dans le composant Alti
     *
     * @example
     *   var options = {
     *      response :
     *      outputFormat :
     *      rawResponse :
     *      scope :
     *      onSuccess :
     *      onError :
     *   };
     *
     */
    build : function (options) {
        // logger
        var logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("RouteResponseFactory");
        logger.trace("RouteResponseFactory::build()");

        var data = null;

        if (options.response) {
            if (options.rawResponse) {
                logger.trace("analyze response : raw");
                data = options.response;
            } else {
                switch (options.outputFormat) {
                    case "xml":
                        logger.trace("analyze response : xml");

                        // type de reader en fonction de l'API
                        var routeReader = options.api === "REST" ? __WEBPACK_IMPORTED_MODULE_5__Formats_RouteResponseRESTReader__["a" /* default */] : __WEBPACK_IMPORTED_MODULE_6__Formats_RouteResponseOLSReader__["a" /* default */];

                        try {
                            var p = new __WEBPACK_IMPORTED_MODULE_3__Formats_XML__["a" /* default */]({
                                reader : routeReader
                            });

                            // FIXME : mode XHR ne retourne que des string ? JSONP aussi à ce niveau ?
                            if (typeof options.response === "string") {
                                p.setXMLString(options.response);
                            } else {
                                p.setXMLDoc(options.response);
                            }

                            data = p.parse();

                            if (!data) {
                                throw new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_FORMAT", "xml"));
                            }
                        } catch (e) {
                            options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_ANALYSE", options.response)));
                            return;
                        }

                        break;

                    case "json":
                        logger.trace("analyze response : json");

                        var JSONResponse;
                        if (typeof options.response === "string") {
                            JSONResponse = JSON.parse(options.response);
                        } else {
                            JSONResponse = options.response;
                        }

                        // le service renvoie t il une erreur ?
                        if (JSONResponse.message) {
                            // ex. {"message":"message not null", "status":"ERROR"}
                            options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EXCEPTION", JSONResponse.message)));
                            return;
                        }

                        // construction de l'objet réponse JSON
                        if (JSONResponse) {
                            var legs = [];
                            var legSteps = [];
                            var steps = [];

                            data = new __WEBPACK_IMPORTED_MODULE_7__model_RouteResponse__["a" /* default */]();

                            if (data.hasOwnProperty("totalTime")) {
                                // info : il y a aussi JSONResponse.duration, qui donne la durée en hh:mm:ss.
                                data.totalTime = parseFloat(JSONResponse.durationSeconds);
                            }
                            if (data.hasOwnProperty("totalDistance")) {
                                data.totalDistance = (options.distanceUnit === "m") ? JSONResponse.distanceMeters : JSONResponse.distance;
                            }

                            if (data.hasOwnProperty("bbox")) {
                                var coords = JSONResponse.bounds.split(/[,;]/);
                                data.bbox.left = parseFloat(coords[0]);
                                data.bbox.bottom = parseFloat(coords[1]);
                                data.bbox.right = parseFloat(coords[2]);
                                data.bbox.top = parseFloat(coords[3]);
                            }
                            /**
                            * callback success
                            * @param {Object} json - json
                            * @private
                            */
                            var onWKTSuccess = function (json) {
                                data.routeGeometry = json;
                            };
                            /**
                            * callback failed
                            * @param {Object} e - event
                            * @private
                            */
                            var onWKTError = function (e) {
                                console.log(e);
                                options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_FORMAT", ["geometryWkt"])));
                            };

                            if (data.hasOwnProperty("routeGeometry")) {
                                var geometry = JSONResponse.geometryWkt || JSONResponse.simplifiedWkt;
                                if (geometry) {
                                    __WEBPACK_IMPORTED_MODULE_4__Formats_WKT__["a" /* default */].toJson(geometry, onWKTSuccess, onWKTError);
                                    if (!data.routeGeometry) {
                                        return;
                                    }
                                }
                            }

                            if (data.hasOwnProperty("routeInstructions")) {
                                var legList = JSONResponse.legs;
                                var i;
                                if (Array.isArray(legList) && legList.length) {
                                    for (i = 0; i < legList.length; i++) {
                                        legs.push(legList[i]);
                                    }
                                }
                                if (Array.isArray(legs) && legs.length) {
                                    for (i = 0; i < legs.length; i++) {
                                        legSteps.push(legs[i].steps);
                                    }
                                }
                                if (Array.isArray(legSteps) && legSteps.length) {
                                    for (i = 0; i < legSteps.length; i++) {
                                        steps = steps.concat(legSteps[i]);
                                    }
                                }

                                steps.forEach(function (step) {
                                    data.routeInstructions.push(new __WEBPACK_IMPORTED_MODULE_8__model_RouteInstruction__["a" /* default */]());
                                    data.routeInstructions[data.routeInstructions.length - 1].duration = step.durationSeconds;
                                    data.routeInstructions[data.routeInstructions.length - 1].distance = (options.distanceUnit === "m") ? step.distanceMeters : step.distance;
                                    data.routeInstructions[data.routeInstructions.length - 1].code = step.navInstruction;
                                    // geometrie en geojson
                                    var points = [];
                                    for (var i = 0; i < step.points.length; i++) {
                                        var point = step.points[i].split(",");
                                        if (point) {
                                            points.push(point);
                                        }
                                    }
                                    if (points && points.length !== 0) {
                                        data.routeInstructions[data.routeInstructions.length - 1].geometry = {
                                            coordinates : points,
                                            type : "LineString"
                                        };
                                    } else {
                                        data.routeInstructions[data.routeInstructions.length - 1].geometry = null;
                                    }

                                    /*
                                    Traduction du code en instruction
                                    * - F : tout droit
                                    * - B : demi-tour
                                    * - L : tourner à gauche
                                    * - R : tourner à droite
                                    * - BL : tourner très à gauche
                                    * - BR : tourner très à droite
                                    * - FL : tourner légèrement à gauche
                                    * - FR : tourner légèrement à droite
                                    * - round_about_entry : entrée rond-point
                                    * - round_about_exit : sortie rond-point
                                    */

                                    // on ne souhaite pas de ce type de valeur...
                                    if (step.name === "Valeur non renseignée") {
                                        step.name = "";
                                    }

                                    switch (step.navInstruction) {
                                        case "F":
                                            if (step.name) {
                                                data.routeInstructions[data.routeInstructions.length - 1].instruction = "Tout droit " + step.name;
                                            } else {
                                                data.routeInstructions[data.routeInstructions.length - 1].instruction = "Continuer tout droit ";
                                            }
                                            break;
                                        case "B":
                                            data.routeInstructions[data.routeInstructions.length - 1].instruction = "Demi-tour " + step.name;
                                            break;
                                        case "L":
                                            data.routeInstructions[data.routeInstructions.length - 1].instruction = "Tourner à gauche " + step.name;
                                            break;
                                        case "R":
                                            data.routeInstructions[data.routeInstructions.length - 1].instruction = "Tourner à droite " + step.name;
                                            break;
                                        case "BL":
                                            data.routeInstructions[data.routeInstructions.length - 1].instruction = "Tourner très à gauche " + step.name;
                                            break;
                                        case "BR":
                                            data.routeInstructions[data.routeInstructions.length - 1].instruction = "Tourner très à droite " + step.name;
                                            break;
                                        case "FL":
                                            data.routeInstructions[data.routeInstructions.length - 1].instruction = "Tourner légèrement à gauche " + step.name;
                                            break;
                                        case "FR":
                                            data.routeInstructions[data.routeInstructions.length - 1].instruction = "Tourner légèrement à droite " + step.name;
                                            break;
                                        case "round_about_entry":
                                            data.routeInstructions[data.routeInstructions.length - 1].instruction = "Entrée rond-point " + step.name;
                                            break;
                                        case "round_about_exit":
                                            data.routeInstructions[data.routeInstructions.length - 1].instruction = "Sortie rond-point " + step.name;
                                            break;
                                        case null:
                                            data.routeInstructions[data.routeInstructions.length - 1].instruction = "Prendre tout droit " + step.name;
                                            break;
                                        default:
                                            data.routeInstructions[data.routeInstructions.length - 1].instruction = "?" + step.navInstruction + "? " + step.name;
                                            break;
                                    }
                                });
                            }
                        }

                        if (!data) {
                            options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_ANALYSE", "json")));
                            return;
                        }
                        break;

                    default:
                        options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_FORMAT", "json", "xml")));
                        return;
                }

                // Si la réponse contenait une exception renvoyée par le service
                if (data && data.exceptionReport) {
                    options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EXCEPTION_2")));
                    return;
                }
            }
        } else {
            options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EMPTY")));
            return;
        }

        options.onSuccess.call(options.scope, data);
    }
};

/* harmony default export */ __webpack_exports__["a"] = (RouteResponseFactory);


/***/ }),
/* 95 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_MessagesResources__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Formats_WKT__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Response_model_RouteResponse__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Response_model_RouteInstruction__ = __webpack_require__(17);
/**
 * Analyse de la reponse REST
 *
 * @module RouteResponseRESTReader
 * @alias Gp.Services.Route.Formats.RouteResponseRESTReader
 * @todo not yet implemented !
 * @private
 */

// import Logger from "../../../Utils/LoggerByDefault";






/**
 * Objet RouteResponseRestReader
 * @member {Object} RouteResponseRestReader
 *
 * @property {Object} RouteResponseRestReader.READERS - Objet contenant des fonctions de lecture, appelées "readers"
 *      dont chaque clé correspond au nom d'un tag du XML que l'on souhaite lire
 *      et la valeur associée est une fonction (node, data)
 *      où node est un noeud du document DOM
 *      et data est un objet où l'on stocke les informations lues dans le XML.
 *
 * @property {Method} RouteResponseRestReader.read - Méthode permettant de lancer la lecture d'une réponse XML du
 *      service de calcul d'itineraire, à l'aide des readers de la classe.
 *
 */

var RouteResponseRESTReader = {};

RouteResponseRESTReader.READERS = {

    /**
     * Route response
     * @param {Object} node - node
     * @returns {Object} response
     */
    routeResult : function (node) {
        var response = new __WEBPACK_IMPORTED_MODULE_3__Response_model_RouteResponse__["a" /* default */]();

        // on boucle sur les balises "enfant" de la réponse :
        // status, distance, duration, distanceMeters, durationSeconds, bounds, geometryWkt, simplifiedWkt, leg
        __getChildNodes(node, response);

        if (response.status === "error") {
            var message = __WEBPACK_IMPORTED_MODULE_0__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EXCEPTION",
                response.message);
            throw new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */]({
                message : message,
                type : __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */].TYPE_SRVERR
            });
        }

        return response;
    },

    /**
     * Route status
     * @param {Object} node - node
     * @param {Object} response - response
     */
    status : function (node, response) {
        var status = __getChildValue(node);
        if (status === "ERROR" || status === "error") {
            if (response) {
                response.status = "error";
            }
        }
    },

    /**
     * Route message
     * @param {Object} node - node
     * @param {Object} response - response
     */
    message : function (node, response) {
        if (response) {
            response.message = __getChildValue(node);
        }
    },

    /**
     * Route distance
     * @param {Object} node - node
     * @param {Object} response - response
     */
    distance : function (node, response) {
        if (response) {
            response.totalDistance = __getChildValue(node);
        }
    },

    /**
     * Route duration
     * @param {Object} node - node
     * @param {Object} response - response
     */
    durationSeconds : function (node, response) {
        if (response) {
            response.totalTime = parseFloat(__getChildValue(node));
        }
    },

    /**
     * Route bounds
     * @param {Object} node - node
     * @param {Object} response - response
     */
    bounds : function (node, response) {
        // get value et split et parseFloat
        if (response && response.bbox) {
            var coords = __getChildValue(node).split(/[,;]/);
            response.bbox.left = parseFloat(coords[0]);
            response.bbox.bottom = parseFloat(coords[1]);
            response.bbox.right = parseFloat(coords[2]);
            response.bbox.top = parseFloat(coords[3]);
        }
    },

    /**
     * Route geometry
     * @param {Object} node - node
     * @param {Object} response - response
     */
    geometryWkt : function (node, response) {
        if (response) {
            var geomWkt = node.innerHTML;

            var onWKTSuccess = function (json) {
                response.routeGeometry = json;
            };

            var onWKTError = function () {
                var msg = __WEBPACK_IMPORTED_MODULE_0__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_FORMAT", ["geometryWkt"]);
                throw new Error(msg);
            };
            // get WKT Geometry from string
            __WEBPACK_IMPORTED_MODULE_1__Formats_WKT__["a" /* default */].toJson(geomWkt, onWKTSuccess, onWKTError);
        }
    },

    /**
     * Route step
     * @param {Object} node - node
     * @param {Object} response - response
     */
    step : function (node, response) {
        // création d'une nouvelle instruction
        var routeInstruction = new __WEBPACK_IMPORTED_MODULE_4__Response_model_RouteInstruction__["a" /* default */]();
        var name;

        // lecture des informations de l'instruction (balises enfants)
        if (node.hasChildNodes) {
            var children = node.childNodes;
            var child;
            var childName;

            for (var i = 0; i < children.length; i++) {
                child = children[i];

                if (child.nodeType === 1) { // 1 === node.ELEMENT_NODE
                    childName = child.localName || child.baseName || child.nodeName;

                    if (childName === "durationSeconds") {
                        routeInstruction.duration = __getChildValue(child);
                    } else if (childName === "distance") {
                        routeInstruction.distance = __getChildValue(child);
                    } else if (childName === "navInstruction") {
                        routeInstruction.code = __getChildValue(child);
                    } else if (childName === "name") {
                        name = __getChildValue(child);
                    }
                }
            }
        }

        // on teste le code de l'instruction pour y ajouter la bonne description
        if (routeInstruction.code) {
            switch (routeInstruction.code) {
                case "F":
                    if (name !== "Valeur non renseignée") {
                        routeInstruction.instruction = "Tout droit " + name;
                    } else {
                        routeInstruction.instruction = "Continuer tout droit ";
                    }
                    break;
                case "B":
                    routeInstruction.instruction = "Demi-tour " + name;
                    break;
                case "L":
                    routeInstruction.instruction = "Tourner à gauche " + name;
                    break;
                case "R":
                    routeInstruction.instruction = "Tourner à droite " + name;
                    break;
                case "BL":
                    routeInstruction.instruction = "Tourner très à gauche " + name;
                    break;
                case "BR":
                    routeInstruction.instruction = "Tourner très à droite " + name;
                    break;
                case "FL":
                    routeInstruction.instruction = "Tourner légèrement à gauche " + name;
                    break;
                case "FR":
                    routeInstruction.instruction = "Tourner légèrement à droite " + name;
                    break;
                case "round_about_entry":
                    routeInstruction.instruction = "Entrée rond-point " + name;
                    break;
                case "round_about_exit":
                    routeInstruction.instruction = "Sortie rond-point " + name;
                    break;
                case null:
                    routeInstruction.instruction = "Prendre " + name;
                    break;
                default:
                    routeInstruction.instruction = "?" + routeInstruction.code + "? " + name;
                    break;
            }
        }

        if (Array.isArray(response.routeInstructions)) {
            response.routeInstructions.push(routeInstruction);
        }
    }

};

/**
 * Méthode permettant de lancer la lecture d'une réponse XML du service de calcul d'itineraire,
 * à l'aide des readers de la classe.
 *
 * @method RouteResponseRESTReader.read
 * @param {DOMElement} root - racine de la réponse XML à lire
 * @static
 * @memberof RouteResponseRESTReader
 * @returns {DOMElement} response
 */
RouteResponseRESTReader.read = function (root) {
    var response;

    if (root.nodeName === "routeResult") {
        response = RouteResponseRESTReader.READERS["routeResult"](root);
        return response;
    } else {
        throw new Error("Erreur lors de la lecture de la réponse : elle n'est pas au format attendu.");
    }
};

/**
 * Lecture de la valeur du premier child d'un noeud, si elle existe.
 *
 * @private
 * @memberof RouteResponseRESTReader
 * @method __getChildValue
 * @param {DOMElement} node - a DOM node
 * @return {String} value - valeur du firstChild du noeud en entrée, ou chaîne vide.
 */
function __getChildValue (node) {
    var textNode;
    var value = "";

    if (node.hasChildNodes()) {
        textNode = node.firstChild;
        if (textNode && textNode.nodeType === 3) { // 3 === node.TEXT_NODE
            value = textNode.nodeValue;
        }
    }
    return value;
}

/**
 * Récupération des noeuds enfants à partir d'un noeud donné, pour lecture (readNode).
 *
 * @private
 * @memberof RouteResponseRESTReader
 * @method __getChildNodes
 * @param {DOMElement} node - a DOM node
 * @param {Array|Object} [data] - an object to be filled with node data
 */
function __getChildNodes (node, data) {
    if (node.hasChildNodes()) {
        var children = node.childNodes;
        var child;
        var childName;

        for (var i = 0; i < children.length; i++) {
            child = children[i];

            if (child.nodeType === 1) { // 1 === node.ELEMENT_NODE
                childName = child.localName || child.baseName || child.nodeName;

                if (RouteResponseRESTReader.READERS[childName]) {
                    var reader = RouteResponseRESTReader.READERS[childName];
                    reader(child, data);
                } else {
                    __getChildNodes(child, data);
                }
            }
        }
    }
}

/* harmony default export */ __webpack_exports__["a"] = (RouteResponseRESTReader);


/***/ }),
/* 96 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/**
 * Analyse de la reponse OLS
 *
 * @module RouteResponseOLSReader
 * @alias Gp.Services.Route.Formats.RouteResponseOLSReader
 * @todo not yet implemented !
 * @private
 */



/**
 * Objet RouteResponseOLSReader
 * @member {Object} RouteResponseOLSReader
 *
 * @property {Object} RouteResponseOLSReader.READERS - Objet contenant des fonctions de lecture, appelées "readers"
 *      dont chaque clé correspond au nom d'un tag du XML que l'on souhaite lire
 *      et la valeur associée est une fonction (node, data)
 *      où node est un noeud du document DOM
 *      et data est un objet où l'on stocke les informations lues dans le XML.
 *
 * @property {Method} RouteResponseOLSReader.read -  Méthode permettant de lancer la lecture d'une réponse
 *      XML du service de calcul d'itineraire, à l'aide des readers de la classe.
 */
var RouteResponseOLSReader = {};

/**
 * Objet contenant des fonctions de lecture, appelées "readers"
 *      dont chaque clé correspond au nom d'un tag du XML que l'on souhaite lire
 *      et la valeur associée est une fonction (node, data)
 *      où node est un noeud du document DOM
 *      et data est un objet où l'on stocke les informations lues dans le XML.
 * @static
 * @memberof RouteResponseOLSReader
 */
RouteResponseOLSReader.READERS = {
    /*
        // INFO
        // pas de reponse en JSON pour l'API OLS, uniquement du XML !

        // INFO
        // Exemple d'erreur du service
        // <?xml version= "1.0" encoding= "UTF-8" standalone= "yes" ?>
        // <XLS version="1.2" xsi : schemaLocation = "http://www.opengis.net/xls http://schemas.opengis.net/ols/1.2/olsAll.xsd" xmlns : xls = "http://www.opengis.net/xls" xmlns= "http://www.opengis.net/xls" xmlns : xlsext = "http://www.opengis.net/xlsext" xmlns : gml = "http://www.opengis.net/gml" // xmlns : xsi = "http://www.w3.org/2001/XMLSchema-instance" >
        // <ResponseHeader>
        //     <ErrorList>
        //         <Error message="Routing error : Error in smartrouting com.geoconcept.smartrouting.SmartRoutingNativeException : failed to connect waypoint { 48.846577, 2.416907, 0.000000 } failed to connect waypoint { 48.846577, 2.416907, 0.000000 } " errorCode="InternalServerError"/>
        //     </ErrorList>
        // </ResponseHeader>
        // <Response version= "1.2" requestID= "f8358c74-8aee-4203-90b9-2c70db5996a1" />
        // </XLS>

        // INFO
        // Exemple d'erreur NGinx
        // <ExceptionReport><Exception exceptionCode="MissingParameter">Resource parameter not found</Exception></ExceptionReport>
    */
};

/**
 * Méthode permettant de lancer la lecture d'une réponse XML du service de calcul d'itineraire,
 * à l'aide des readers de la classe.
 *
 * @method RouteResponseOLSReader.read
 * @param {DOMElement} root - racine de la réponse XML à lire
 * @static
 * @memberof RouteResponseOLSReader
 */
RouteResponseOLSReader.read = function (root) {
    // logger
    var logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("RouteResponseOLSReader");
    logger.error("not yet implemented !");
};

/* harmony default export */ __webpack_exports__["a"] = (RouteResponseOLSReader);


/***/ }),
/* 97 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__CommonService__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__DefaultUrlService__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Request_ProcessIsoCurveRequest__ = __webpack_require__(98);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Response_ProcessIsoCurveResponseFactory__ = __webpack_require__(100);









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
        throw new TypeError(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("CLASS_CONSTRUCTOR", "ProcessIsoCurve"));
    }

    /**
     * Nom de la classe (heritage)
     * FIXME instance ou classe ?
     */
    this.CLASSNAME = "ProcessIsoCurve";

    // appel du constructeur par heritage
    __WEBPACK_IMPORTED_MODULE_3__CommonService__["a" /* default */].apply(this, arguments);

    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("Gp.Services.ProcessIsoCurve");
    this.logger.trace("[Constructeur ProcessIsoCurve (options)]");

    if (!options.position) {
        throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_MISSING", "position"));
    }

    // on lance une exception afin d'eviter au service de le faire...
    if (options.position.x === null) {
        throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_MISSING", "position.x"));
    }

    if (options.position.y === null) {
        throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_MISSING", "position.y"));
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
        var lstUrlByDefault = __WEBPACK_IMPORTED_MODULE_4__DefaultUrlService__["a" /* default */].ProcessIsoCurve.url(this.options.apiKey);

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
ProcessIsoCurve.prototype = Object.create(__WEBPACK_IMPORTED_MODULE_3__CommonService__["a" /* default */].prototype, {
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
        var oIsoCurve = new __WEBPACK_IMPORTED_MODULE_5__Request_ProcessIsoCurveRequest__["a" /* default */](this.options);
        if (!oIsoCurve.processRequestString()) {
            throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_REQUEST_BUILD"));
        }

        this.request = oIsoCurve.requestString;
    } catch (e) {
        error.call(this, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */](e.message));
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

        __WEBPACK_IMPORTED_MODULE_6__Response_ProcessIsoCurveResponseFactory__["a" /* default */].build(options);
    } else {
        onError.call(this, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EMPTY")));
    }
};

/* harmony default export */ __webpack_exports__["a"] = (ProcessIsoCurve);


/***/ }),
/* 98 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__model_ProcessIsoCurveParam__ = __webpack_require__(99);





/**
 * @classdesc
 * Classe de gestion des requêtes sur le service de calcul d'isoschrone/isodistance.
 *  Les requêtes peuvent être en mode GET ou POST,
 *  et le format de sorti est en JSON ou en XML.
 *
 * @constructor
 * @alias Gp.Services.ProcessIsoCurve.Request.ProcessIsoCurveRequest
 * @param {Object} options - options
 *
 * @example
 * var options = {
 *      httpMethod : 'GET', // GET|POST
 *      // spécifique au service
 *      exclusions : ['Bridge', 'Tunnel'],
 *      position : {
 *          x : 2.3242664298058053,
 *          y : 48.86118017324745
 *      },
 *      graph : "Voiture",
 *      method : 'time',
 *      time : 1000, //distance : 200
 *      reverse : false,
 *      smoothing : false,
 *      holes : false,
 *      srs : 'EPSG:4326'
 *  };
 *
 * try {
 *
 *      var oIsoCurve = new ProcessIsoCurveRequest (options);
 *      if (!oIsoCurve.processRequestString ()) {
 *          // error
 *      }
 *
 *      var request = oIsoCurve.requestString;
 *
 * } catch (e) {
 *      // error
 * }
 * @private
 */
function ProcessIsoCurveRequest (options) {
    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("ProcessIsoCurveRequest");
    this.logger.trace("[Constructeur ProcessIsoCurveRequest ()]");

    if (!(this instanceof ProcessIsoCurveRequest)) {
        throw new TypeError("ProcessIsoCurveRequest constructor cannot be called as a function.");
    }

    // existance des options
    if (!options) {
        throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_EMPTY", "options"));
    }

    /**
     * Liste des options
     */
    this.settings = options;

    /**
     * Mode HTPP.
     * Par defaut, "GET".
     * @type {String}
     */
    this.mode = this.settings.httpMethod || "GET";
}

ProcessIsoCurveRequest.prototype = {

    /**
     * @lends module:ProcessIsoCurveRequest#
     */

    /**
     * Requête
     * @type {String}
     */
    requestString : null,

    /**
     * Constructeur (alias)
     */
    constructor : ProcessIsoCurveRequest,

    /**
     * Template de la requête (POST)
     * * __X__ __Y__ __SRS__ __GRAPHNAME__ __METHOD__  (obligatoire)
     * * __REVERSE__ __SMOOTHING__ __HOLES__           (par defaut)
     * * __TIME__ __TIMEVALUE__                        (choix)
     * * __DISTANCE__ __DISTANCEVALUE__                (choix)
     * * __EXCLUSIONS__ __EXCLUSIONFEATURE__ __EXCLUSIONVALUE__ (optionnel)
     * * __PROFIL__ __PROFILID__ __PROFILNAME__                 (très optionnel)
     * * __ID__ __IDVALUE__                                     (très optionnel)
     */
    template : {
        container : "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
            "<isochroneRequest>\n" +
            "__ID__" +
            "\t<location>\n" +
            "\t\t<x>__X__</x>\n" +
            "\t\t<y>__Y__</y>\n" +
            "\t</location>\n" +
            "\t<srs>__SRS__</srs>\n" +
            "\t<graphName>__GRAPHNAME__</graphName>\n" +
            "__PROFIL__" +
            "__EXCLUSIONS__" +
            "\t<method>__METHOD__</method>\n" +
            "__TIME__" +
            "__DISTANCE__" +
            "\t<reverse>__REVERSE__</reverse>\n" +
            "\t<smoothing>__SMOOTHING__</smoothing>\n" +
            "\t<holes>__HOLES__</holes>\n" +
            "</isochroneRequest>",
        id : "\t<id>__IDVALUE__</id>\n",
        profil : "\t<profileId>__PROFILID__</profileId>\n" + "\t<profileName>__PROFILNAME__</profileName>\n",
        exclusions : {
            container : "\t<exclusions>\n" +
                "__EXCLUSIONFEATURE__\n" +
                "\t</exclusions>\n",
            feature : "\t\t<exclusion>__EXCLUSIONVALUE__</exclusion>"
        },
        time : "\t<time>__TIMEVALUE__</time>\n",
        distance : "\t<distance>__DISTANCEVALUE__</distance>\n"
    },

    /**
     * Construction de la requête.
     *
     * @example
     * // GET  out :
     *   //  (http://wxs.ign.fr/KEY/isochrone/isochrone.json?)
     *   //  location=&
     *   //  time=& ou distance=&
     *   //  method="DISTANCE|TIME"&
     *   //  graph=Pieton&
     *   //  graphName=Pieton&
     *   //  exclusions=&
     *   //  reverse=10&
     *   //  smoothing=&
     *   //  holes=&
     *   //  srs=
     *
     * // POST out :
     *   // <?xml version="1.0" encoding="UTF-8"?>
     *   // <isochroneRequest>
     *   //   <id>1</id>
     *   //   <location>
     *   //     <x>-1.557189</x>
     *   //     <y>47.217122</y>
     *   //   </location>
     *   //   <srs></srs>
     *   //   <graphName></graphName>
     *   //   <profileId></profileId>
     *   //   <profileName></profileName>
     *   //   <exclusions>
     *   //     <exclusion></exclusion>
     *   //     <exclusion></exclusion>
     *   //   </exclusions>
     *   //   <method></method>
     *   //   <time>50</time>
     *   //   <distance></distance>
     *   //   <reverse></reverse>
     *   //   <smoothing></smoothing>
     *   //   <holes></holes>
     *   // </isochroneRequest>
     *
     * @returns {String} request
     */
    processRequestString : function () {
        var request = "";
        var i = 0;

        switch (this.mode) {
            case "GET":
                this.logger.trace("Process GET Request");

                // Mapping des options avec le service de l'API REST
                var oParams = new __WEBPACK_IMPORTED_MODULE_2__model_ProcessIsoCurveParam__["a" /* default */](this.settings);
                var params = oParams.getParams();

                for (i = 0; i < params.length; i++) {
                    var o = params[i];
                    if (request) {
                        request += "&";
                    }
                    request += o.k + "=" + o.v;
                }

                break;

            case "POST":
                this.logger.trace("Process POST Request");

                request = this.template.container;

                // options non prises en compte car non implémentées !
                // clean : id
                request = request.replace(/__ID__/g, "");
                // clean : profil
                request = request.replace(/__PROFIL__/g, "");

                // options obligatoires
                request = request.replace(/__X__/g, this.settings.position.x);
                request = request.replace(/__Y__/g, this.settings.position.y);
                request = request.replace(/__GRAPHNAME__/g, this.settings.graph);

                // options par defaut
                request = request.replace(/__SRS__/g, this.settings.srs);
                request = request.replace(/__SMOOTHING__/g, this.settings.smoothing);
                request = request.replace(/__HOLES__/g, this.settings.holes);
                request = request.replace(/__REVERSE__/g, this.settings.reverse);

                // options conditionnelles

                // exclusions
                if (this.settings.exclusions) {
                    var tmplExclusions = this.template.exclusions.container;
                    var exclusions = [];
                    for (i = 0; i < this.settings.exclusions.length; i++) {
                        var tmplFeature = this.template.exclusions.feature;
                        tmplFeature = tmplFeature.replace(/__EXCLUSIONVALUE__/, this.settings.exclusions[i]);
                        exclusions.push(tmplFeature);
                    }
                    tmplExclusions = tmplExclusions.replace(/__EXCLUSIONFEATURE__/, exclusions.join("\n"));
                    request = request.replace(/__EXCLUSIONS__/g, tmplExclusions);
                }
                // clean exclusions
                request = request.replace(/__EXCLUSIONS__/g, "");

                // distance
                if (this.settings.distance) {
                    var tmplDistance = this.template.distance;
                    tmplDistance = tmplDistance.replace(/__DISTANCEVALUE__/g, this.settings.distance);
                    request = request.replace(/__DISTANCE__/g, tmplDistance);
                    // method
                    request = request.replace(/__METHOD__/g, "distance");
                }
                // clean
                request = request.replace(/__DISTANCE__/g, "");

                // time
                if (this.settings.time) {
                    var tmplTime = this.template.time;
                    tmplTime = tmplTime.replace(/__TIMEVALUE__/g, this.settings.time);
                    request = request.replace(/__TIME__/g, tmplTime);
                    // method
                    request = request.replace(/__METHOD__/g, "time");
                }
                // clean
                request = request.replace(/__TIME__/g, "");
                break;

            default:
                this.logger.error("No other HTTP method supported by the service !");
        }

        this.logger.trace(request);
        this.requestString = request;

        return this.requestString;
    }
};

/* harmony default export */ __webpack_exports__["a"] = (ProcessIsoCurveRequest);


/***/ }),
/* 99 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);



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

    this.logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger();
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

/* harmony default export */ __webpack_exports__["a"] = (ProcessIsoCurveParam);


/***/ }),
/* 100 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Formats_XML__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Formats_WKT__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Formats_ProcessIsoCurveResponseReader__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__model_ProcessIsoCurveResponse__ = __webpack_require__(18);
/**
 * Factory pour générer une reponse JSON à partir d'un XML ou d'un JSON
 * (Factory)
 *
 * @module ProcessIsoCurveResponseFactory
 * @alias Gp.Services.ProcessIsoCurve.Response.ProcessIsoCurveResponseFactory
 * @private
 */








var ProcessIsoCurveResponseFactory = {

    /**
     * interface unique
     *
     * @method build
     * @static
     * @param {Object} options - options definies dans le composant ProcessIsoCurve
     *
     * @example
     *   var options = {
     *      response :
     *      outputFormat :
     *      rawResponse :
     *      scope :
     *      onSuccess :
     *      onError :
     *   };
     *
     */
    build : function (options) {
        // logger
        var logger = __WEBPACK_IMPORTED_MODULE_0__Utils_LoggerByDefault__["a" /* default */].getLogger("ProcessIsoCurveResponseFactory");
        logger.trace(["ProcessIsoCurveResponseFactory::build()"]);

        var data = null;

        if (options.response) {
            if (options.rawResponse) {
                logger.trace("analyze response : raw");
                data = options.response;
            } else {
                switch (options.outputFormat) {
                    case "xml":
                        logger.trace("analyze response : xml");

                        try {
                            var p = new __WEBPACK_IMPORTED_MODULE_3__Formats_XML__["a" /* default */]({
                                reader : __WEBPACK_IMPORTED_MODULE_5__Formats_ProcessIsoCurveResponseReader__["a" /* default */]
                            });

                            // FIXME : mode XHR ne retourne que des string ? JSONP aussi à ce niveau ?
                            if (typeof options.response === "string") {
                                p.setXMLString(options.response);
                            } else {
                                p.setXMLDoc(options.response);
                            }

                            data = p.parse();

                            if (!data) {
                                throw new Error(__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EXCEPTION_2"));
                            }
                        } catch (e) {
                            var message = e.message;
                            message += "\n (raw response service : '" + options.response + "')";
                            options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */]({
                                message : __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EXCEPTION", message),
                                status : 200,
                                type : __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */].TYPE_SRVERR
                            }));
                            return;
                        }

                        break;

                    case "json":
                        logger.trace("analyze response : json");

                        var JSONResponse;
                        if (typeof options.response === "string") {
                            JSONResponse = JSON.parse(options.response);
                        } else {
                            JSONResponse = options.response;
                        }

                        // analyse de la reponse
                        if (JSONResponse.status === "OK" || JSONResponse.status === "ok") {
                            // création de l'objet de réponse
                            data = new __WEBPACK_IMPORTED_MODULE_6__model_ProcessIsoCurveResponse__["a" /* default */]();

                            // remplissage de l'objet créé avec les attribtuts de la réponse du service
                            if (data) {
                                data.time = JSONResponse.time;
                                data.distance = JSONResponse.distance;
                                data.message = JSONResponse.message;
                                data.id = JSONResponse.id;
                                data.srs = JSONResponse.srs;
                                // callback de la reponse
                                var onWKTSuccess = function (json) {
                                    data.geometry = json;
                                };
                                // callback d'erreur
                                var onWKTError = function () {
                                    options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */]({
                                        message : __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_FORMAT", "wktGeometry")
                                    }));
                                };
                                if (data.hasOwnProperty("geometry")) {
                                    __WEBPACK_IMPORTED_MODULE_4__Formats_WKT__["a" /* default */].toJson(JSONResponse.wktGeometry, onWKTSuccess, onWKTError);
                                    if (!data.geometry) {
                                        return;
                                    }
                                }
                                var coords = JSONResponse.location.split(",");
                                if (data.location) {
                                    data.location.x = coords[0];
                                    data.location.y = coords[1];
                                }
                            } else {
                                options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_ANALYSE", options.response)));
                                return;
                            }
                        } else if (JSONResponse.status === "ERROR" || JSONResponse.status === "error") {
                            // JSHint bug if var message is used !?
                            var mess = JSONResponse.message;
                            mess += "\n (raw response service : '" + JSONResponse + "')";
                            options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EXCEPTION", mess)));
                            return;
                        }
                        break;

                    default:
                        options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_FORMAT", "json", "xml")));
                        return;
                }

                // info : en cas de problèmes de droits (clé invalide ou autre), la réponse est au format XML !!
                // ex. <ExceptionReport><Exception exceptionCode="MissingParameter">Key does not exist or has expired</Exception></ExceptionReport>
                // mais le statut est 403, l'erreur est donc remontée plus tôt.
                if (data && data.exceptionReport) {
                    options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */]({
                        message : __WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EXCEPTION", data.exceptionReport),
                        type : __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */].TYPE_SRVERR,
                        status : 200
                    }));
                    return;
                }
            }
        } else {
            // si la réponse est vide, on appelle le callback d'erreur
            options.onError.call(options.scope, new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EMPTY")));
            return;
        }

        // si tout s'est bien passé, on appelle le callback de succès
        options.onSuccess.call(options.scope, data);
    }
};

/* harmony default export */ __webpack_exports__["a"] = (ProcessIsoCurveResponseFactory);


/***/ }),
/* 101 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils_MessagesResources__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Formats_WKT__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Response_model_ProcessIsoCurveResponse__ = __webpack_require__(18);
/**
 * Analyse de la reponse XML
 *
 * @module ProcessIsoCurveResponseReader
 * @alias Gp.Services.ProcessIsoCurve.Formats.ProcessIsoCurveResponseReader
 * @todo not yet implemented !
 * @private
 */






/**
 * Objet ProcessIsoCurveResponseReader
 *
 * @member {Object} ProcessIsoCurveResponseReader
 *
 * @property {Object} ProcessIsoCurveResponseReader.READERS - Objet contenant des fonctions de lecture, appelées "readers"
 *      dont chaque clé correspond au nom d'un tag du XML que l'on souhaite lire
 *      et la valeur associée est une fonction (node, data)
 *      où node est un noeud du document DOM
 *      et data est un objet où l'on stocke les informations lues dans le XML.
 *
 * @property {Method} ProcessIsoCurveResponseReader.read -  Méthode permettant de lancer la lecture d'une réponse XML
 *       du service de calcul isochrone/isodistance, à l'aide des readers de la classe.
 *
 */

var ProcessIsoCurveResponseReader = {};

/*
    // INFO
    // Exemple d'erreur du service
    // <?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
    // <isochroneResult>
    //  <message>Location point must have 2 components separated with a ,</message>
    //  <status>ERROR</status>
    // </isochroneResult>

    // <?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
    // <serviceResult>
    //   <message>ServiceException : Error in isochron computation Error in smartrouting null</message>
    //   <status>ERROR</status>
    // </serviceResult>

    // INFO
    // Exemple d'erreur NGinx
    // <ExceptionReport><Exception exceptionCode="MissingParameter">Resource parameter not found</Exception></ExceptionReport>
*/

/*
    // INFO
    // Exemple de réponse du service

     // <IsochroneResult>
     //    <status>OK</status>
     //    <id/>
     //    <location>-1.557189,47.217122</location>
     //    <srs/>
     //    <distance>5000</distance>
     //    <wktGeometry>POLYGON ((-1.545312 47.178178, -1.545312 47.180418, ...))</wktGeometry>
     // </IsochroneResult>

    // <isochronResult>
    //    <status>OK</status>
    //    <id>1</id>
    //    <location>-1.557189,47.217122</location>
    //    <srs/>
    //    <time>50</time>
    //    <wktGeometry>POLYGON ((-1.556864 47.216487, -1.556864 47.216948, ...))</wktGeometry>
    // </isochronResult>
*/

ProcessIsoCurveResponseReader.READERS = {

    /** TODO : jsdoc block */
    isochronResult : function (root) {
        // racine de la réponse XML : on crée l'objet de réponse
        var response = new __WEBPACK_IMPORTED_MODULE_3__Response_model_ProcessIsoCurveResponse__["a" /* default */]();

        if (root.hasChildNodes()) {
            var children = root.childNodes;
            var child;

            for (var i = 0; i < children.length; i++) {
                child = children[i];

                if (ProcessIsoCurveResponseReader.READERS[child.nodeName]) {
                    ProcessIsoCurveResponseReader.READERS[child.nodeName](child, response);
                }
            }
        }

        if (response.status === "error") {
            var message = __WEBPACK_IMPORTED_MODULE_0__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EXCEPTION",
                response.message);
            throw new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */]({
                message : message,
                type : __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */].TYPE_SRVERR
            });
        }
        return response;
    },

    /** TODO : jsdoc block */
    message : function (node, response) {
        if (response) {
            response.message = __getChildValue(node);
        }
    },

    /** TODO : jsdoc block */
    status : function (node, response) {
        var status = __getChildValue(node);
        if (status === "ERROR" || status === "error") {
            if (response) {
                response.status = "error";
            }
        }
    },

    /** TODO : jsdoc block */
    id : function (node, response) {
        if (response) {
            response.id = __getChildValue(node);
        }
    },

    /** TODO : jsdoc block */
    location : function (node, response) {
        var coords = __getChildValue(node);
        if (response && response.location) {
            response.location.x = parseFloat(coords.split(",")[0]);
            response.location.y = parseFloat(coords.split(",")[1]);
        }
    },

    /** TODO : jsdoc block */
    srs : function (node, response) {
        if (response) {
            response.srs = __getChildValue(node);
        }
    },

    /** TODO : jsdoc block */
    distance : function (node, response) {
        if (response) {
            response.distance = parseFloat(__getChildValue(node));
        }
    },

    /** TODO : jsdoc block */
    time : function (node, response) {
        if (response) {
            response.time = parseFloat(__getChildValue(node));
        }
    },

    /** TODO : jsdoc block */
    wktGeometry : function (node, response) {
        if (response) {
            var wktGeometry = node.innerHTML;
            /** TODO : jsdoc block */
            var onWKTSuccess = function (json) {
                response.geometry = json;
            };
            /** TODO : jsdoc block */
            var onWKTError = function () {
                var msg = __WEBPACK_IMPORTED_MODULE_0__Utils_MessagesResources__["a" /* default */].getMessage("PARAM_FORMAT", ["wktGeometry"]);
                throw new Error(msg);
            };
            if (response.hasOwnProperty("geometry")) {
                __WEBPACK_IMPORTED_MODULE_1__Formats_WKT__["a" /* default */].toJson(wktGeometry, onWKTSuccess, onWKTError);
            }
        }
    },

    /** TODO : jsdoc block */
    serviceResult : function (node) {
        // en cas d'exception du service
        var response = {};
        if (node.hasChildNodes()) {
            var children = node.childNodes;
            var child;
            for (var i = 0; i < children.length; i++) {
                child = children[i];
                if (ProcessIsoCurveResponseReader.READERS[child.nodeName]) {
                    ProcessIsoCurveResponseReader.READERS[child.nodeName](child, response);
                }
            }
        }
        return response;
    },

    /** TODO : jsdoc block */
    ExceptionReport : function (node) {
        var response = {};
        if (node.hasChildNodes()) {
            var children = node.childNodes;
            var child;
            for (var i = 0; i < children.length; i++) {
                child = children[i];
                if (child.nodeName === "Exception") {
                    response.exceptionReport = ProcessIsoCurveResponseReader.READERS["Exception"](child);
                }
            }
        }
        return response;
    },

    /** TODO : jsdoc block */
    Exception : function (node) {
        var exceptionReport = {};

        // get exception code
        var exceptionCode = node.getAttribute("exceptionCode");
        if (exceptionCode) {
            exceptionReport.exceptionCode = exceptionCode;
        }

        // get exception message
        var textNode = node.firstChild;
        if (textNode && textNode.nodeType === 3) { // 3 === node.TEXT_NODE
            exceptionReport.exception = textNode.nodeValue;
        }

        return exceptionReport;
    }
};

/** TODO : jsdoc block */
ProcessIsoCurveResponseReader.read = function (root) {
    var response;

    if (root.nodeName === "isochronResult" || root.nodeName === "isochroneResult" || root.nodeName === "IsochroneResult") {
        response = ProcessIsoCurveResponseReader.READERS["isochronResult"](root);
        return response;
    } else if (root.nodeName === "ExceptionReport") {
        response = ProcessIsoCurveResponseReader.READERS[root.nodeName](root);
        return response;
    } else if (ProcessIsoCurveResponseReader.READERS[root.nodeName]) {
        response = ProcessIsoCurveResponseReader.READERS[root.nodeName](root);
        if (response.status === "error") {
            var errMsg = __WEBPACK_IMPORTED_MODULE_0__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_EXCEPTION",
                response.message);
            throw new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */]({
                message : errMsg,
                type : __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */].TYPE_SRVERR
            });
        }
        return response;
    } else {
        throw new __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */]({
            message : __WEBPACK_IMPORTED_MODULE_0__Utils_MessagesResources__["a" /* default */].getMessage("SERVICE_RESPONSE_ANALYSE", root.nodeName),
            type : __WEBPACK_IMPORTED_MODULE_2__Exceptions_ErrorService__["a" /* default */].TYPE_UNKERR
        });
    }
};

/**
 * Lecture de la valeur du premier child d'un noeud, si elle existe.
 *
 * @private
 * @memberof ProcessIsoCurveResponseReader
 * @method __getChildValue
 * @param {DOMElement} node - a DOM node
 * @return {String} value - valeur du firstChild du noeud en entrée, ou chaîne vide.
 */
function __getChildValue (node) {
    var textNode;
    var value = "";

    if (node.hasChildNodes()) {
        textNode = node.firstChild;
        if (textNode && textNode.nodeType === 3) { // 3 === node.TEXT_NODE
            value = textNode.nodeValue;
        }
    }
    return value;
}

/* harmony default export */ __webpack_exports__["a"] = (ProcessIsoCurveResponseReader);


/***/ })
/******/ ])["default"];
});