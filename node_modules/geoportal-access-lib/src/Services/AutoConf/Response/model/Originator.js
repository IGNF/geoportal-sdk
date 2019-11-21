
/**
 * Object used to describe an Originator of geoportal resource.
 *
 * @property {String} name - originator name
 * @property {String} attribution - originator full name
 * @property {String} logo - originator logo file URL
 * @property {String} url - originator web site URL
 * @property {Array.<Gp.Services.Config.Constraint>} constraints - where and when the originator applies for the ressource.
 *
 * @namespace
 * @alias Gp.Services.Config.Originator
 */

function Originator () {
    if (!(this instanceof Originator)) {
        throw new TypeError("Originator constructor cannot be called as a function.");
    }

    this.name = null;

    this.attribution = null;

    this.logo = null;

    this.url = null;

    this.constraints = [];
}

Originator.prototype = {

    constructor : Originator

};

export default Originator;
