
/**
 * Response object for {@link module:Services~geocode Gp.Services.geocode ()} or {@link module:Services~reverseGeocode Gp.Services.reverseGeocode ()} invocation when successful. Received as the argument of onSuccess callback function.
 *
 * @property {Array.<Gp.Services.Geocode.DirectGeocodedLocation|Gp.Services.Geocode.ReverseGeocodedLocation>} locations - locations array.
 *
 * @namespace
 * @alias Gp.Services.GeocodeResponse
 */
function GeocodeResponse () {
    if (!(this instanceof GeocodeResponse)) {
        throw new TypeError("GeocodeResponse constructor cannot be called as a function.");
    }

    this.locations = [];
}

GeocodeResponse.prototype = {

    constructor : GeocodeResponse

};

export default GeocodeResponse;
