import Logger from "../../../../Utils/LoggerByDefault";

/**
 * @classdesc
 *
 * Preference (Reverse)
 *
 * FIXME liste des types de tables de geocodage
 *
 * ```
 * template : "<ReverseGeocodePreference>__TYPE__</ReverseGeocodePreference>"
 * ```
 *
 * @constructor
 * @alias Gp.Formats.XLS.LocationUtilityService.Preference
 * @param {String} type - type de table de geocodage
 *
 * @private
 *
 */

function Preference (type) {
    this.logger = Logger.getLogger("Preference");
    this.logger.trace("[Constructeur Preference ()]");

    if (!(this instanceof Preference)) {
        throw new TypeError("Preference constructor cannot be called as a function.");
    }

    /**
     * type de table de geocodage
     * @type {Array.<String>}
     */
    this.type = type;
}

/**
 * @lends module:Preference#
 */
Preference.prototype = {

    /**
     * Constructeur (alias)
     */
    constructor : Preference,

    /**
     * request (out)
     * @type {String}
     */
    requestString : null,

    /**
     * Template de la requête.
     *
     * substitution des valeurs suivantes :
     *  __TYPE__
     *
     */
    template : "<ReverseGeocodePreference>__TYPE__</ReverseGeocodePreference>"
};

/**
 * toString
 *
 * @returns {String} requête
 */
Preference.prototype.toString = function () {
    var Preferences = [];
    var tmplPreference = "";
    for (var idx = 0; idx < this.type.length; idx++) {
        tmplPreference = this.template;
        tmplPreference = tmplPreference.replace(/__TYPE__/g, this.type[idx]);
        Preferences.push(tmplPreference);
    }

    this.strRequest = Preferences.join("\n");
    return this.strRequest;
};

export default Preference;
