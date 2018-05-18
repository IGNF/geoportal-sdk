'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _three = require('three');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var textureLoader = new _three.TextureLoader();

function checkResponse(response) {
    if (!response.ok) {
        var error = new Error('Error loading ' + response.url + ': status ' + response.status);
        error.status = response.status;
        throw error;
    }
}

exports.default = {

    /**
     * Little wrapper over fetch to get some json
     *
     * @param {string} url
     * @param {Object} options - fetch options (passed directly to fetch)
     *
     * @return {Promise}
     */
    json: function json(url) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        return fetch(url, options).then(function (response) {
            checkResponse(response);
            return response.json();
        });
    },


    /**
     * Wrapper over fetch to get some xml.
     *
     * @param {string} url
     * @param {Object} options - fetch options (passed directly to fetch)
     *
     * @return {Promise}
     */
    xml: function xml(url) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        return fetch(url, options).then(function (response) {
            checkResponse(response);
            return response.text();
        }).then(function (text) {
            return new window.DOMParser().parseFromString(text, 'text/xml');
        });
    },


    /**
     * @typedef {Object} TexturePromise
     * @property {Promise} promise - a promise that resolves when the texture is loaded
     * @property {Object} texture - the loading texture
     */
    /**
     * Wrapper around TextureLoader
     *
     * @param {string} url
     * @param {Object} options - options to pass to TextureLoader. Note that
     * THREE.js docs mention withCredentials, but it is not actually used in TextureLoader.js.
     * @param {string} options.crossOrigin - passed directly to html elements supporting it
     *
     * @return {TexturePromise}
     */
    texture: function (url) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var res = void 0;
        var rej = void 0;

        textureLoader.crossOrigin = options.crossOrigin;

        var promise = new _promise2.default(function (resolve, reject) {
            res = resolve;
            rej = reject;
        });

        var texture = textureLoader.load(url, res, function () {}, rej);
        return { texture: texture, promise: promise };
    },


    /**
     * Wrapper over fetch to get some ArrayBuffer
     *
     * @param {string} url
     * @param {Object} options - fetch options (passed directly to fetch)
     *
     * @return {Promise}
     */
    arrayBuffer: function arrayBuffer(url) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        return fetch(url, options).then(function (response) {
            checkResponse(response);
            return response.arrayBuffer();
        });
    }
};