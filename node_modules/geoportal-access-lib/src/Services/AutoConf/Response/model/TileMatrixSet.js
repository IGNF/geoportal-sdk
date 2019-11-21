
/**
 *
 * Object used to describe a TileMatrix set (for WMTS use).
 *
 * @property {Array.<String>} matrixIds - Array of IDs for each TileMatrix of the set.
 * @property {Array.<Gp.Services.Config.TileMatrix>} tileMatrices - Array of TileMatrix descriptions.
 * @property {Array.<Float>} nativeResolutions - Array of resolutions (in meter per pixel) applying for each TileMatrix of the set.
 * @property {String} projection - Identifier of the Cordinates System used for the tileMatrixSet.
 *
 * @namespace
 * @alias Gp.Services.Config.TileMatrixSet
 */
function TileMatrixSet () {
    if (!(this instanceof TileMatrixSet)) {
        throw new TypeError("TileMatrixSet constructor cannot be called as a function.");
    }

    this.projection = null;

    this.nativeResolutions = [];

    this.matrixIds = [];

    this.tileMatrices = {};
}

TileMatrixSet.prototype = {

    constructor : TileMatrixSet,

    /**
     * Returns Tile Matrix Set resolutions
     *
     * @returns {Array} nativeResolutions - Array of resolutions (in meter per pixel) applying for each TileMatrix of the set.
     */
    getResolutions : function () {
        return this.nativeResolutions;
    },

    /**
     * Returns Tile Matrix Set identifiers
     *
     * @returns {Array} matrixIds - Array of IDs for each TileMatrix of the set.
     */
    getMatrixIds : function () {
        return this.matrixIds;
    },

    /**
     * Returns Tile Matrix Set projection
     *
     * @returns {String} projection - Identifier of the Cordinates System used for the tileMatrixSet.
     */
    getProjection : function () {
        return this.projection;
    },

    /**
     * Returns Tile Matrices descriptions.
     *
     * @returns {Array.<Gp.Services.Config.TileMatrix>} tileMatrices - Array of TileMatrix descriptions.
     */
    getTileMatrices : function () {
        return this.tileMatrices;
    },

    /**
     * Returns top left corner point of matrices
     *
     * @returns {Gp.Point} topLeftCorner - Top Left Corner Point of TMS matrices, expressed in the tileMatrixSet coordinates system.
     */
    getTopLeftCorner : function () {
        var topLeftCorner;
        var matrices = this.getTileMatrices();
        if (matrices) {
            for (var id in matrices) {
                if (matrices.hasOwnProperty(id)) {
                    topLeftCorner = matrices[id].topLeftCorner;
                    break;
                }
            }
        }
        return topLeftCorner;
    }

};

export default TileMatrixSet;
