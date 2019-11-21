
import Logger from "../../../../Utils/LoggerByDefault";
import AltiRequest from "./AltiRequest";

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
    AltiRequest.apply(this, arguments);

    this.logger = Logger.getLogger();
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

AltiElevationRequest.prototype = Object.create(AltiRequest.prototype, {

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

export default AltiElevationRequest;
