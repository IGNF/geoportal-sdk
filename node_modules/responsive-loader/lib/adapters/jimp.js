'use strict';

var jimp = require('jimp');

module.exports = function (imagePath) {
  var readImage = jimp.read(imagePath);

  return {
    metadata: function metadata() {
      return readImage.then(function (image) {
        return { width: image.bitmap.width, height: image.bitmap.height };
      });
    },
    resize: function resize(_ref) {
      var width = _ref.width,
          mime = _ref.mime,
          options = _ref.options;
      return new Promise(function (resolve, reject) {
        readImage.then(function (image) {
          image.clone().resize(width, jimp.AUTO).quality(options.quality).background(parseInt(options.background, 16) || 0xFFFFFFFF).getBuffer(mime, function (err, data) {
            // eslint-disable-line func-names
            if (err) {
              reject(err);
            } else {
              resolve({
                data,
                width,
                height: this.bitmap.height
              });
            }
          });
        });
      });
    }
  };
};