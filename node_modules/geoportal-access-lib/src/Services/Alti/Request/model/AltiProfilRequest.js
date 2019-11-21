
import Logger from "../../../../Utils/LoggerByDefault";
import AltiRequest from "./AltiRequest";

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
    AltiRequest.apply(this, arguments);

    this.logger = Logger.getLogger();
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

AltiProfilRequest.prototype = Object.create(AltiRequest.prototype, {

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

export default AltiProfilRequest;
