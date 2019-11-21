import Logger from "../../../../Utils/LoggerByDefault";

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
    this.logger = Logger.getLogger("Position");
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

export default Position;
