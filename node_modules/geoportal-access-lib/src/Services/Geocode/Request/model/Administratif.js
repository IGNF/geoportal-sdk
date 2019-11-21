
import GeocodeLocation from "../GeocodeLocation";

/**
 * @classdesc
 * Format des attributs d'un filtre de géocodage de type Administratif.
 * @constructor
 * @alias Gp.Services.Geocode.Request.Administratif
 * @private
 */
function Administratif () {
    if (!(this instanceof Administratif)) {
        throw new TypeError("Administratif constructor cannot be called as a function.");
    }

    // INFO
    // appel du constructeur de la classe mère
    // avec passage de param.
    GeocodeLocation.apply(this, arguments);

    /**
     * Nom de la classe (heritage)
     * @type {String}
     */
    this.CLASSNAME = "Administratif";

    /**
     * Liste des attributs possibles pour une GeocodedLocation de type Administratif
     * - **bbox** : Emprise de l'unité administrative dans le système de coordonnées demandé *{left, right, top, bottom}*
     * - **prefecture** - Nom de la préfécture de la région ou du département *{String}*
     * - **inseeRegion** - Numéro INSEE de la région *{String}*
     * - **inseeDepartment** - Numéro INSEE du département *{String}*
     * - **municipality** - Nom de l'unité administrative *{String}*
     *
     */

    this.attributesList = ["bbox", "prefecture", "inseeRegion", "inseeDepartment", "municipality"];

    this.serviceAttributes = ["bbox", "Prefecture", "InseeRegion", "InseeDepartement", "Municipality"];
}

/**
 * @lends module:Administratif#
 */
Administratif.prototype = Object.create(GeocodeLocation.prototype);

/**
 * Constructeur (alias)
 */
Administratif.prototype.constructor = Administratif;

export default Administratif;
