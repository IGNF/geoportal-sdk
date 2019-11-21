
/**
 * Location object holding common properties returned by the underlying geocoding and reverse geocoding web service.
 *
 * @property {Gp.Point} position - Position of the location given in the requested coordinates system.
 * @property {String} type - location type "StreetAddress" (for an address), "PositionOfInterest" (for a place name) or "CadastralParcel" (for cadastral parcel).
 * @property {String} matchType - how geocoding is performed : "street number" (exact address), "street enhanced" (street number calculated by interpolation), "street" (only the street), "city" (only the city).
 * @property {Object} placeAttributes - Associative array matching the following attributes with their values given by the underlying web service :
 *
 * *Common attributes : *
 *
 * - **freeform** - freeform complete Address.
 * - **bbox** - Bounding Box *{@link Gp.BBox}*.
 * - **municipality** - Municipality
 *
 * *if type === "StreetAddress" : *
 *
 * - **number** - Street number.
 * - **ID** - Identifier of the address in the [BD ADRESSE Database]{@link http://professionnels.ign.fr/bdadresse}.
 * - **IDTR** - Identifier of the lineString in the [BD ADRESSE Database]{@link http://professionnels.ign.fr/bdadresse}.
 * - **postalCode** - PostCode
 * - **quality** - Geocoding quality ([see]{@link http://api.ign.fr/tech-docs-js/developpeur/search.html})
 * - **street** - Street name
 * - **territory** - French Territory code
 * - **commune** - City
 * - **department** - Department
 * - **insee** - INSEE Code
 *
 *
 * *if type === "PositionOfInterest" :*
 *
 * - **importance** - Place name importance
 * - **nature** - Place name nature
 * - **postalCode** - PostCode
 * - **territory** - French Territory code
 * - **commune** - City
 * - **department** - Department
 * - **insee** - INSEE Code
 *
 *
 * *si type = "CadastralParcel" :*
 *
 * - **absorbedCity** - when a parcel comes from a city that was absorbed by another, code of that old city. "000" otherwise.
 * - **arrondissement** - arrondissement
 * - **cadastralParcel** - cadastral parcel code
 * - **district** - district
 * - **sheet** - Parcel Sheet (eg. "1").
 * - **number** - Parcel Number (eg. "0041")
 * - **section** - Parcel Section (eg. "0D").
 * - **commune** - Parcel municipality.
 * - **department** - Parcel Department.
 * - **insee** - INSEE Code.
 * - **origin** - Parcel origin (see "type" attribute in the [underlying web service response]{@link http://api.ign.fr/tech-docs-js/developpeur/search.html#Cadastral_parcels_search})
 *
 * @namespace
 * @alias Gp.Services.Geocode.GeocodedLocation
 */
function GeocodedLocation () {
    if (!(this instanceof GeocodedLocation)) {
        throw new TypeError("GeocodedLocation constructor cannot be called as a function.");
    }

    this.position = {
        x : null,
        y : null
    };

    this.matchType = null;

    this.placeAttributes = {};

    this.type = null;
}

GeocodedLocation.prototype = {

    constructor : GeocodedLocation

};

export default GeocodedLocation;
