import Logger from "../../Utils/LoggerByDefault";

/**
 * @classdesc
 *
 * (non utilisé)
 * Construction GML des geometries du type suivant :
 * - Point
 * - Envelope
 * - Circle
 * - Polygon - http://erouault.blogspot.fr/2014/04/gml-madness.html
 * - ...
 *
 * @example
 * var gml = new Gp.Formats.GML.Geometry ({
 *      type: "Point",
 *      data : {
 *          x:
 *          y:
 *      }
 * });
 * gml.toString();
 * // out ->
 * // <gml:Point xmlns:gml="http://www.opengis.net/gml">
 * //   <gml:pos>42 1.5</gml:pos>
 * // </gml:Point>
 *
 * @constructor
 * @alias  Gp.Formats.GML.Geometry
 * @private
 * @param {Object} options - options
 */
function Geometry (options) {
    this.logger = Logger.getLogger("GML.Geometry");
    this.logger.trace("[Constructeur Geometry ()]");

    if (!(this instanceof Geometry)) {
        throw new TypeError("Geometry constructor cannot be called as a function.");
    }

    this.options = options || {};

    for (var opt in options) {
        if (options.hasOwnProperty(opt)) {
            if (options[opt]) {
                this.options[opt] = options[opt];
            }
        }
    }

    // gestion du type
    if (!this.options.type) {
        throw new Error("Type is not defined !");
    }

    // gestion des data
    if (!this.options.data) {
        throw new Error("Data is not defined !");
    }

    if (typeof this.options.data === "object" && Object.keys(this.options.data).length === 0) {
        throw new Error("Data is empty !");
    }
}

Geometry.prototype = {

    /** constructeur (alias) */
    constructor : Geometry,

    /** namespace GML par defaut */
    featureNS : "http://www.opengis.net/gml",

    /** namespace GML par defaut */
    featurePrefix : "gml",

    /** template */
    template : {
        point : "<Point>" +
            "<pos>__X__ __Y__</pos>" +
            "</Point>",
        envelop : "<Envelope>" +
            "<lowerCorner>__LEFT__ __BOTTOM__</lowerCorner>" +
            "<upperCorner>__RIGHT__ __TOP__</upperCorner>" +
            "</Envelope>",
        circle : "<CircleByCenterPoint>" +
            "<pos>__X__ __Y__</pos>" +
            "<radius>__RADIUS__</radius>" +
            "</CircleByCenterPoint>",
        polygon : "<Polygon>" +
            "<exterior>" +
            "<LinearRing>" +
            "<posList>__XY__</posList>" +
            "</LinearRing>" +
            "</exterior>" +
            "</Polygon>",
        multipolygon : "<Polygon></Polygon>"
    },

    /**
    * choix du template GML
    * @param {String} name - nom du template
    * @returns {String} le template avec les substitutions clef/valeur
    */
    getTemplate : function (name) {
        var template = this.template[name];

        if (!template) {
            throw new Error("Type of template is unknow !");
        }

        if (!this.featurePrefix) {
            return template;
        }

        var regex;
        var subst;

        // regex ns tag
        regex = /<(\w+[^\s>])/;
        subst = "<$1 xmlns:" + this.featurePrefix + "=\"" + this.featureNS + "\"";
        template = template.replace(regex, subst);

        // regex prefixe balise ouvrante
        regex = /<(\w+[\s>])/g;
        subst = "<" + this.featurePrefix + ":$1";
        template = template.replace(regex, subst);

        // regex prefixe balise fermante
        regex = /<\/(\w+[\s>])/g;
        subst = "</" + this.featurePrefix + ":$1";
        template = template.replace(regex, subst);

        return template;
    },

    /**
    * creation d'un point
    * @returns {String} le template avec les substitutions clef/valeur
    */
    toPoint : function () {
        var data = this.options.data;

        if (!data.x) {
            throw new Error("Coordinate X is undefined !");
        }

        if (!data.y) {
            throw new Error("Coordinate Y is undefined !");
        }
        // var template = "<gml:Point xmlns:gml=\"" + this.featureNS + "\"><gml:pos>__X__ __Y__</gml:pos></gml:Point>";
        var template = this.getTemplate("point");
        template = template.replace(/__X__/g, data.x);
        template = template.replace(/__Y__/g, data.y);
        return template;
    },

    /**
    * creation d'une bbox
    * @returns {String} le template avec les substitutions clef/valeur
    */
    toEnvelop : function () {
        var data = this.options.data;
        if (!data.left || !data.bottom || !data.right || !data.top) {
            throw new Error("One coordinate is undefined !");
        }
        var template = this.getTemplate("envelop"); ;
        template = template.replace(/__LEFT__/g, data.left);
        template = template.replace(/__BOTTOM__/g, data.bottom);
        template = template.replace(/__RIGHT__/g, data.right);
        template = template.replace(/__TOP__/g, data.top);
        return template;
    },

    /**
    * creation d'un cercle
    * @returns {String} le contenu du template
    */
    toCircle : function () {
        var data = this.options.data;
        if (!data.x || !data.y || !data.radius) {
            throw new Error("One parameter is undefined !");
        }
        var template = this.getTemplate("circle");
        template = template.replace(/__X__/g, data.x);
        template = template.replace(/__Y__/g, data.y);
        template = template.replace(/__RADIUS__/g, data.radius);
        return template;
    },

    /**
    * creation d'un polygone
    * @returns {String} le contenu du template
    */
    toPolygon : function () {
        var data = this.options.data;
        if (data.length === 0) {
            throw new Error("Array is empty !");
        }

        // fermeture du polygone
        if (JSON.stringify(data[0]) !== JSON.stringify(data[data.length - 1])) {
            data.push(data[0]);
        }
        var strCoordinates = "";
        for (var i = 0; i < data.length; i++) {
            var coord = data[i];
            if (Array.isArray(coord)) {
                throw new Error("Holes are not implemented !");
            }
            if ((coord.x && coord.y) || (coord.x === 0 || coord.y === 0)) {
                strCoordinates += coord.x + " " + coord.y;
                if (data.length !== i + 1) {
                    strCoordinates += " ";
                }
            }
        }

        if (!strCoordinates) {
            throw new Error("Coordinates are empty !");
        }

        var template = this.getTemplate("polygon");
        template = template.replace(/__XY__/g, strCoordinates);
        return template;
    },

    /**
    * creation d'un polygone
    */
    toMultiPolygon : function () {
        throw new Error("Not yet implemented !");
    },

    /**
     * to string
     * @returns {String} le contenu du template
     */
    toString : function () {
        var result = null;

        switch (this.options.type.toUpperCase()) {
            case "POINT":
                result = this.toPoint();
                break;
            case "ENVELOP":
                result = this.toEnvelop();
                break;
            case "CIRCLE":
                result = this.toCircle();
                break;
            case "POLYGON":
                result = this.toPolygon();
                break;
            case "MULTIPOLYGON":
                result = this.toMultiPolygon();
                break;
            default:
                this.logger.warn("Type is not supported !");
        }

        this.logger.trace("result :", result);
        return result;
    }
};

export default Geometry;
