
/**
 * Object used to describe a layer extent on a Tile Matrix.
 *
 * @property {Number} minTileCol - minimum column index where tile can be found on the Tile matrix.
 * @property {Number} maxTileCol - maximum column index where tile can be found on the Tile matrix.
 * @property {Number} minTileRow - minimum row index where tile can be found on the Tile matrix.
 * @property {Number} maxTileCol - maximum row index where tile can be found on the Tile matrix.
 *
 * @namespace
 * @alias Gp.Services.Config.TileMatrixLimit
 */

function TileMatrixLimit () {
    if (!(this instanceof TileMatrixLimit)) {
        throw new TypeError("TileMatrixLimit constructor cannot be called as a function.");
    }

    this.minTileRow = null;

    this.maxTileRow = null;

    this.minTileCol = null;

    this.maxTileCol = null;
}

/**
 * @lends module:Autoconf/Response/TileMatrixLimit
 */
TileMatrixLimit.prototype = {

    constructor : TileMatrixLimit
};

export default TileMatrixLimit;
