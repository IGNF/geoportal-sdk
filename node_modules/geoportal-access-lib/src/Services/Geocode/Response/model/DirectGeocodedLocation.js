
import GeocodedLocation from "./GeocodedLocation";

/**
 * Single location object returned by the underlying geocoding web service.
 *
 * @property {Float} accuracy - Accuracy of the response towards the requested location between 0 (unaccurate) and 1 (exact match).
 *
 * @namespace
 * @extends {Gp.Services.Geocode.GeocodedLocation}
 * @alias Gp.Services.Geocode.DirectGeocodedLocation
 */
function DirectGeocodedLocation () {
    if (!(this instanceof DirectGeocodedLocation)) {
        throw new TypeError("DirectGeocodedLocation constructor cannot be called as a function.");
    }

    // INFO
    // appel du constructeur de la classe mère
    // avec passage de param.
    GeocodedLocation.apply(this, arguments);

    /**
     * Nom de la classe (heritage) : "DirectGeocodedLocation"
     * @type {String}
     */
    this.CLASSNAME = "DirectGeocodedLocation";

    this.accuracy = null;
}

DirectGeocodedLocation.prototype = Object.create(GeocodedLocation.prototype);

DirectGeocodedLocation.prototype.constructor = DirectGeocodedLocation;

export default DirectGeocodedLocation;
