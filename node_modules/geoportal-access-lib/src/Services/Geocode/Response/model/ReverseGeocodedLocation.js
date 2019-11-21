
import GeocodedLocation from "./GeocodedLocation";

/**
 * Single location object returned by the underlying reverse geocoding web service.
 *
 * @property {Float} searchCenterDistance - Distance between the requested point and the location.
 *
 * @namespace
 * @extends {Gp.Services.Geocode.GeocodedLocation}
 * @alias Gp.Services.Geocode.ReverseGeocodedLocation
 */
function ReverseGeocodedLocation () {
    if (!(this instanceof ReverseGeocodedLocation)) {
        throw new TypeError("ReverseGeocodedLocation constructor cannot be called as a function.");
    }

    // INFO
    // appel du constructeur de la classe mère
    // avec passage de param.
    GeocodedLocation.apply(this, arguments);

    /**
     * Nom de la classe (heritage) : "ReverseGeocodedLocation"
     * @type {String}
     */
    this.CLASSNAME = "ReverseGeocodedLocation";

    this.searchCenterDistance = null;
}

ReverseGeocodedLocation.prototype = Object.create(GeocodedLocation.prototype);

ReverseGeocodedLocation.prototype.constructor = ReverseGeocodedLocation;

export default ReverseGeocodedLocation;
