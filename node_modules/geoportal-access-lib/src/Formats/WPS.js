import Logger from "../Utils/LoggerByDefault";

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
    this.logger = Logger.getLogger();
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

export default WPS;
