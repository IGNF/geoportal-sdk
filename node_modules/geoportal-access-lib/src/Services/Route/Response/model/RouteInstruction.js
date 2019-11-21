
/**
 * Single Route Instruction object.
 *
 * @property {String} code - Instruction code :
 *
 * - "F" : Straight forward
 * - "B" : U-turn
 * - "L" : turn left
 * - "R" : turn right
 * - "BL" : turn left strongly
 * - "BR" : turn right strongly
 * - "FL" : turn lightly to the left
 * - "FR" : turn lightly to the right
 * - "round_about_entry" : round about entry
 * - "round_about_exit" : round about exit
 *
 * @property {String} instruction - Instruction text : translated code + street name
 * @property {Object} geometry - Geometry (expressed in [GeoJSON]{@link http://geojson.org/}) of the street.
 * @property {Float} distance - Length of the instruction. Expressed in km or m, depending on distanceUnit parameter.
 * @property {Float} duration - Instruction duration in seconds.
 *
 * @namespace
 * @alias Gp.Services.Route.RouteInstruction
 */
function RouteInstruction () {
    if (!(this instanceof RouteInstruction)) {
        throw new TypeError("RouteInstruction constructor cannot be called as a function.");
    }

    this.duration = null;

    this.distance = null;

    this.code = null;

    this.instruction = null;

    this.geometry = null; // FIXME can be null if option 'geometryInInstructions' is false !
}

RouteInstruction.prototype = {

    constructor : RouteInstruction

};

export default RouteInstruction;
