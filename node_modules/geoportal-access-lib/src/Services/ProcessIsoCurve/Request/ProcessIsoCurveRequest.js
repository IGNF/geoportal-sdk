
import Logger from "../../../Utils/LoggerByDefault";
import _ from "../../../Utils/MessagesResources";
import ProcessIsoCurveParam from "./model/ProcessIsoCurveParam";

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
    this.logger = Logger.getLogger("ProcessIsoCurveRequest");
    this.logger.trace("[Constructeur ProcessIsoCurveRequest ()]");

    if (!(this instanceof ProcessIsoCurveRequest)) {
        throw new TypeError("ProcessIsoCurveRequest constructor cannot be called as a function.");
    }

    // existance des options
    if (!options) {
        throw new Error(_.getMessage("PARAM_EMPTY", "options"));
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
                var oParams = new ProcessIsoCurveParam(this.settings);
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

export default ProcessIsoCurveRequest;
