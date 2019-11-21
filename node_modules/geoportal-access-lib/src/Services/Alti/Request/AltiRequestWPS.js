/**
 * Classe d'interface des requêtes de type WPS sur le service altimetrique.
 * (Factory)
 *
 * @module Gp.Services.Alti.Request.AltiRequestWPS
 * @alias Gp.Services.Alti.Request.AltiRequestWPS
 * @private
 */
import Logger from "../../../Utils/LoggerByDefault";
import _ from "../../../Utils/MessagesResources";
import WPS from "../../../Formats/WPS";
import AltiElevationRequest from "./model/AltiElevationRequest";
import AltiProfilRequest from "./model/AltiProfilRequest";

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
        var logger = Logger.getLogger("AltiRequestWPS");
        logger.trace(["AltiRequestWPS::build()"]);

        // existance des options
        if (!options) {
            throw new Error(_.getMessage("PARAM_EMPTY", "options"));
        }

        // type de requete : Altitude ou Profil
        // (param. à determiner en fonction des parametres d'entrée)
        if (!options.type) {
            throw new Error(_.getMessage("PARAM_EMPTY", "type (Elevation or Profil)"));
        }

        // construction du modele de requête
        // (test du type d'objet candidat)
        var DataObject = null;
        switch (options.type) {
            case "Elevation":
                // surcharge
                options.wps.identifier = "gs:WPSElevation";
                DataObject = new AltiElevationRequest(options.param);
                break;
            case "Profil":
                // surcharge
                options.wps.identifier = "gs:WPSLineElevation";
                DataObject = new AltiProfilRequest(options.param);
                break;
            default:
                throw new Error(_.getMessage("PARAM_TYPE", "type (Elevation or Profil)"));
        }

        // construction de la requête WPS
        var settings = {
            data : DataObject,
            method : options.method,
            param : options.wps
        };

        var rqstWPS = new WPS(settings);

        if (!rqstWPS.processRequestString()) {
            throw new Error("Enable to process request !");
        }

        return rqstWPS.requestString;
    }
};

export default AltiRequestWPS;
