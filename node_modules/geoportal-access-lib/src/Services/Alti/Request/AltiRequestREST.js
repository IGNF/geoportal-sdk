/* jshint multistr : true */

import Logger from "../../../Utils/LoggerByDefault";
import _ from "../../../Utils/MessagesResources";
import AltiElevationRequest from "./model/AltiElevationRequest";
import AltiProfilRequest from "./model/AltiProfilRequest";

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
    this.logger = Logger.getLogger("AltiRequestREST");
    this.logger.trace("[Constructeur AltiRequestREST ()]");

    if (!(this instanceof AltiRequestREST)) {
        throw new TypeError("AltiRequestREST constructor cannot be called as a function.");
    }

    this.options = options || {};

    // existance des options
    if (!this.options) {
        throw new Error(_.getMessage("PARAM_EMPTY", "options"));
    }

    // type de requete : Altitude ou Profil
    // (param. à determiner en fonction des parametres d'entrée)
    if (!this.options.type) {
        throw new Error(_.getMessage("PARAM_EMPTY", "type (Elevation or Profil)"));
    }

    // construction du modele de requête
    // (test du type d'objet candidat)
    this.DataObject = null;
    switch (this.options.type) {
        case "Elevation":
            this.DataObject = new AltiElevationRequest(this.options.param);
            break;
        case "Profil":
            this.DataObject = new AltiProfilRequest(this.options.param);
            break;
        default:
            throw new Error(_.getMessage("PARAM_TYPE", "type (Elevation or Profil)"));
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

export default AltiRequestREST;
