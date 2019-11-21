'use strict';

var _loaderUtils = require('loader-utils');

var _loaderUtils2 = _interopRequireDefault(_loaderUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Note: no export default here cause of Babel 6
module.exports = function includeFilesLoader(sourceCode) {
  var _this = this;

  if (this.cacheable) {
    this.cacheable();
  }
  var loaderOptions = _loaderUtils2.default.getOptions(this);

  if (loaderOptions.include && loaderOptions.include.length) {
    var includes = loaderOptions.include.map(function (modPath) {
      return 'require(' + _loaderUtils2.default.stringifyRequest(_this, modPath) + ');';
    }).join('\n');

    var code = [includes, sourceCode].join('\n');

    this.callback(null, code, null);
    return;
  }

  this.callback(null, sourceCode, null);
};