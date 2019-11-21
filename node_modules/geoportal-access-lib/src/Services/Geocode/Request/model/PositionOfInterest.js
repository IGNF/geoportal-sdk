
import GeocodeLocation from "../GeocodeLocation";

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
    GeocodeLocation.apply(this, arguments);

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
PositionOfInterest.prototype = Object.create(GeocodeLocation.prototype);

/**
 * Constructeur (alias)
 */
PositionOfInterest.prototype.constructor = PositionOfInterest;

export default PositionOfInterest;
