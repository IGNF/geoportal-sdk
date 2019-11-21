/**
 * Response object for {@link module:Services~getAltitude Gp.Services.getAltitude ()} invocation when successful. Received as the argument of onSuccess callback function.
 *
 * @property {Array.<Gp.Services.Alti.Elevation>} elevations - Elevations array.
 *
 * @namespace
 * @alias Gp.Services.AltiResponse
 */
function AltiResponse () {
    if (!(this instanceof AltiResponse)) {
        throw new TypeError("AltiResponse constructor cannot be called as a function.");
    }

    this.elevations = [];
}

AltiResponse.prototype = {

    constructor : AltiResponse

};

export default AltiResponse;
