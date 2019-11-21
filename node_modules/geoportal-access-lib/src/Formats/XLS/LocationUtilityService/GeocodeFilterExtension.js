
import Logger from "../../../Utils/LoggerByDefault";

/**
 * @classdesc
 *
 * Ajouter des extensions de filtres spécifiques au service de geocodage de l'IGN.
 * Ceci permet de contrôler les options spécifiques de la table de geocodage intérrogées.
 *
 * @example
 * var ext =  new GeocodeFiltersExtension ();
 *     ext.add (new Administratif ());
 *     ext.add (new StreetAddress ());
 *     ext.add (new PositionOfInterest ());
 *     ext.add (new CadastralParcel ());
 *
 * ext.getNames ()
 * // --> out
 * // [Administratif, StreetAddress, PositionOfInterest, CadastralParcel]
 *
 * ext.getFilters ()
 * // --> out
 * // [Object, Object, Object, Object] = tableau d'objet GeocodeLocation
 *
 * ext.getFilter ('StreetAddress')
 * // --> out
 * // {Object} = objet GeocodeLocation
 *
 * ext.getAttributs ('StreetAddress')
 * // --> out
 * // ["bbox", "number", "ID", "IDTR", "postalCode", "quality", "street", "territoire", "commune", "department", "insee", "municipality"]
 *
 * ext.setPlaceAttributs ('StreetAddress', {number:'', territoire:'', quality:'', fake:''})
 * // --> out
 * // (fake est écarté car il n'appartient pas à la liste !)
 *
 * ext.getPlaceAttributs ('StreetAddress')
 * // --> out
 * // {number : '', territoire : '', quality : ''}
 *
 * // Comment ajouter des filtres spécifiques au service de geocodage ?
 * var req = new GeocodeRequest ({
 *      location : "saint mandé",
 *      returnFreeForm : true,
 *      filterOptions : {
 *          type : ['PositionOfInterest'], <-- ajouter une extension afin de gerer les attributs de cette table de geocodage !
 *          (...)
 *      }
 *  })
 *  req.addFilter (new PositionOfInterest ());
 * @constructor
 * @alias Gp.Formats.XLS.LocationUtilityService.GeocodeFilterExtension
 *
 * @private
 */
function GeocodeFilterExtension () {
    this.logger = Logger.getLogger("GeocodeFilterExtension");
    this.logger.trace("[Constructeur GeocodeFilterExtension ()]");

    if (!(this instanceof GeocodeFilterExtension)) {
        throw new TypeError("GeocodeFilterExtension constructor cannot be called as a function.");
    }

    /**
     * Tableau de filtres (table de geocodage)
     */
    this.filters = [];
}

/**
 * @lends module:GeocodeFilterExtension#
 */
GeocodeFilterExtension.prototype = {

    /**
     * Constructeur (alias)
     */
    constructor : GeocodeFilterExtension,

    /**
     * Ajout d'un filtre
     *
     * @param {Object} oGeocodeLocation - objet de type 'GeocodeLocation'
     */
    addFilterExtensions : function (oGeocodeLocation) {
        // FIXME test sur le type d'objet !
        if (oGeocodeLocation) {
            // FIXME ou test sur ses propriétés !
            this.filters.push(oGeocodeLocation);
        }
    },

    // getter

    /**
     * Tableau de noms (tables de geocodage)
     *
     * @returns {Array.<String>} liste des noms de filtres
     */
    getNames : function () {
        var names = [];
        for (var idx in this.filters) {
            names.push(this.filters[idx].CLASSNAME);
        }
        this.logger.trace(names);
        return names;
    },

    /**
     * Retourne une table de geocodage
     *
     * @param {String} name - nom de la table de geocodage
     * @returns {Object} filtre
     */
    getFilter : function (name) {
        var filter = null;
        for (var idx in this.filters) {
            if (this.filters[idx].CLASSNAME === name) {
                filter = this.filters[idx];
            }
        }
        this.logger.trace(filter);
        return filter;
    },

    /**
     * Tableau d'objects (tables de geocodage)
     *
     * @returns {Array.<Object>} liste des filtres
     */
    getFilters : function () {
        this.logger.trace(this.filters);
        return this.filters;
    },

    /**
     * Récupère la liste des attributs (filtres) sur une table de geocodage
     *
     * @param {String} name - nom de la table de geocodage
     * @returns {Array} liste des attributs d'un filtre
     */
    getAttributs : function (name) {
        var attributs = [];
        for (var idx in this.filters) {
            if (this.filters[idx].CLASSNAME === name) {
                attributs = this.filters[idx].attributesList;
            }
        }
        this.logger.trace(attributs);
        return attributs;
    },

    /**
     * Ajout des attributs (filtres) sur une table de geocodage
     *
     * @param {String} name - nom de la table de geocodage
     * @param {Object} options - options de la table de geocodage
     */
    setPlaceAttributs : function (name, options) {
        var filter = this.getFilter(name);
        var attributs = this.getAttributs(name);
        for (var idx in attributs) {
            var value = attributs[idx];
            if (options[value]) {
                filter.placeAttributes[value] = options[value];
            }
        }
    },

    /**
     * Retourne les attributs (filtres) sur une table de geocodage
     *
     * @param {String} name - nom de la table de geocodage
     * @returns {Array} liste des attributs d'un filtre
     */
    getPlaceAttributs : function (name) {
        var places = {};
        for (var idx in this.filters) {
            if (this.filters[idx].CLASSNAME === name) {
                places = this.filters[idx].placeAttributes;
            }
        }
        this.logger.trace(places);
        return places;
    }
};

export default GeocodeFilterExtension;
