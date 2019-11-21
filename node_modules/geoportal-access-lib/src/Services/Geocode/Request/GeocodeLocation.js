
/**
 * @classdesc
 *
 * Liste des attributs des tables de geocodage
 * @constructor
 * @alias Gp.Services.Geocode.Request.GeocodeLocation
 * @private
 */
function GeocodeLocation () {
    if (!(this instanceof GeocodeLocation)) {
        throw new TypeError("GeocodeLocation constructor cannot be called as a function.");
    }

    /**
     * Objet qui peut prendre comme propriétés les valeurs du tableau serviceAttributes
     * @type {Object}
     */
    this.placeAttributes = {};

    /**
     * Tableau qui liste les attributs spécifiques selon le type de la GeocodeLocation.
     * Ces attributs correspondent à ceux saisis par l'utilisateur (légèrement différents de ceux du service)
     * @type {String[]}
     */
    this.attributesList = [];

    /**
     * Tableau qui liste les attributs spécifiques selon le type de la GeocodeLocation
     * Ces attributs correspondent à ceux interprétés par le service (balises Place).
     * @type {String[]}
     */
    this.serviceAttributes = [];
}

/**
 * @lends module:GeocodeLocation
 */
GeocodeLocation.prototype = {

    /**
     * Constructeur (alias)
     */
    constructor : GeocodeLocation

};

export default GeocodeLocation;
