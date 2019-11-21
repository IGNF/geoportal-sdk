
import GeocodeLocation from "../GeocodeLocation";

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
    GeocodeLocation.apply(this, arguments);

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
StreetAddress.prototype = Object.create(GeocodeLocation.prototype);

/**
 * Constructeur (alias)
 */
StreetAddress.prototype.constructor = StreetAddress;

export default StreetAddress;
