
/**
 * Object used to describe a TileMatrix.
 *
 * @property {String} matrixId - matrix Identifier
 * @property {Number} matrixHeight - Number of tiles from the top to the bottom of the matrix.
 * @property {Number} matrixWidth - Number of tiles from the left to the right of the matrix.
 * @property {Number} scaleDenominator - Scale denominator associated to that matrix.
 * @property {Number} tileHeight - tile height in number of pixels
 * @property {Number} tileWidth - tile width in number of pixels
 * @property {Gp.Point} topLeftCorner - Top Left Corner Point of the matrix expressed in the tileMatrixSet coordinates system.
 *
 * @namespace
 * @alias Gp.Services.Config.TileMatrix
 */

function TileMatrix () {
    if (!(this instanceof TileMatrix)) {
        throw new TypeError("TileMatrix constructor cannot be called as a function.");
    }

    this.matrixId = null;

    this.matrixHeight = null;

    this.matrixWidth = null;

    this.scaleDenominator = null;

    this.tileHeight = null;

    this.tileWidth = null;

    this.topLeftCorner = null;
}

TileMatrix.prototype = {

    constructor : TileMatrix,

    /**
     * Returns top left corner point of the matrix
     *
     * @returns {Gp.Point} topLeftCorner - Top Left Corner Point of the matrix expressed in the tileMatrixSet coordinates system.
     */
    getTopLeftCorner : function () {
        return this.topLeftCorner;
    },

    /**
     * Returns Scale denominator associated to that matrix.
     *
     * @returns {Number} scaleDenominator - Scale denominator associated to that matrix.
     */
    getScaleDenominator : function () {
        return this.scaleDenominator;
    },

    /**
     * Returns tile height of matrix
     *
     * @returns {Number} tileHeight - tile height in number of pixels
     */
    getTileHeight : function () {
        return this.tileHeight;
    },

    /**
     * Returns tile width of matrix
     *
     * @returns {Number} tileWidth - tile width in number of pixels
     */
    getTileWidth : function () {
        return this.tileWidth;
    },

    /**
     * Returns matrix height (number of tiles)
     *
     * @returns {Number} matrixHeight - Number of tiles from the top to the bottom of the matrix.
     */
    getMatrixHeight : function () {
        return this.matrixHeight;
    },

    /**
     * Returns matrix width (number of tiles)
     *
     * @returns {Number} matrixWidth - Number of tiles from the left to the right of the matrix.
     */
    getMatrixWidth : function () {
        return this.matrixWidth;
    }

};

export default TileMatrix;
