
/**
 * Response object for {@link module:Services~isoCurve Gp.Services.isoCurve ()} invocation when successful. Received as the argument of onSuccess callback function.
 *
 * @property {Float} distance - distance (expressed in meters) used for the request.
 * @property {Float} time - time (expressed in seconds) used for the request.
 * @property {Object} geometry - Geometry (expressed in [GeoJSON]{@link http://geojson.org/}) of the isocurve.
 * @property {String} id - request id (used by underlying webservice).
 * @property {Gp.Point} location - Position of the start or end point used for the request (expressed in "srs" coordinates system).
 * @property {String} message - message
 * @property {String} srs - Identifier of the coordinates system used for the isocurve.
 *
 * @namespace
 * @alias Gp.Services.IsoCurveResponse
 *
 */
function ProcessIsoCurveResponse () {
    if (!(this instanceof ProcessIsoCurveResponse)) {
        throw new TypeError("ProcessIsoCurveResponse constructor cannot be called as a function.");
    }

    this.message = null;

    this.id = null;

    this.location = {};
    this.location.x = null;
    this.location.y = null;

    this.srs = null;

    this.geometry = null;

    this.time = null;

    this.distance = null;
}

ProcessIsoCurveResponse.prototype = {

    constructor : ProcessIsoCurveResponse

};

export default ProcessIsoCurveResponse;
