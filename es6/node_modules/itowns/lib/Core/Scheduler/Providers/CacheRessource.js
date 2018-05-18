"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    instanceCache = instanceCache || new CacheRessource();
    return instanceCache;
};

var instanceCache = null;

function CacheRessource() {
    this.cacheObjects = [];
    this._maximumSize = null;
}

CacheRessource.prototype.getRessource = function (url) {
    return this.cacheObjects[url];
};

CacheRessource.prototype.addRessource = function (url, ressource) {
    this.cacheObjects[url] = ressource;
};

CacheRessource.prototype.getRessourceByID = function () /* id */{
    // TODO: Implement Me

};