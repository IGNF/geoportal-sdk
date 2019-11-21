
import GeocodeLocation from "../GeocodeLocation";

/**
 * @classdesc
 * Format des attributs d'un filtre de géocodage de type CadastralParcel.
 *
 * @constructor
 * @alias Gp.Services.Geocode.Request.CadastralParcel
 * @private
 */
function CadastralParcel () {
    if (!(this instanceof CadastralParcel)) {
        throw new TypeError("CadastralParcel constructor cannot be called as a function.");
    }

    // INFO
    // appel du constructeur de la classe mère
    // avec passage de param.
    GeocodeLocation.apply(this, arguments);

    /**
     * Nom de la classe (heritage)
     */
    this.CLASSNAME = "CadastralParcel";

    /**
     * Liste des attributs possibles pour une GeocodeLocation de type CadastralParcel
     * - **absorbedCity** : Code commune absorbée de la parcelle :
     *      lorsqu'une parcelle est issue p d'une ancienne commune qui a fusionné avec une autre.
     *      Sinon, le code vaut '000'. *{String}*
     * - **sheet** : Feuille de la parcelle (ex 1). *{String}*
     * - **number** : Numéro de la parcelle (ex. 0041) *{String}*
     * - **section** : Section de la parcelle (ex 0D). *{String}*
     * - **commune** : Ville du filtre. *{String}*
     * - **department** : Département du filtre. *{String}*
     * - **insee** : Code INSEE du filtre. *{Number}*
     * - **municipality** : Municipalité du filtre. *{String}*
     * - **origin** : L'origine de l'objet parcellaire renvoyé
     *      (correspond à l'attribut "type" dans la réponse XML)
     *      Pour plus d'informations : http://api.ign.fr/tech-docs-js/fr/developpeur/search.html#Recherche_par_parcelles_cadastrales *{Number}*
     *
     */

    this.attributesList = ["absorbedCity", "sheet", "number", "section", "commune", "department", "insee", "municipality", "origin"];

    this.serviceAttributes = ["CommuneAbsorbee", "Feuille", "Numero", "Section", "Commune", "Departement", "INSEE", "Municipality", "Type"];
}

/**
 * @lends module:CadastralParcel#
 */
CadastralParcel.prototype = Object.create(GeocodeLocation.prototype);

/**
 * Constructeur (alias)
 */
CadastralParcel.prototype.constructor = CadastralParcel;

export default CadastralParcel;
