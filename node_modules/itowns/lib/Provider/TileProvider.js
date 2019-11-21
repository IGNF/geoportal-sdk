"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _CancelledCommandException = _interopRequireDefault(require("../Core/Scheduler/CancelledCommandException"));

var _default = {
  executeCommand: function executeCommand(command) {
    var promises = [];
    var layer = command.layer;
    var requester = command.requester;
    var extentsSource = command.extentsSource;

    if (requester && !requester.material) {
      return Promise.reject(new _CancelledCommandException["default"](command));
    }

    for (var i = 0, size = extentsSource.length; i < size; i++) {
      promises.push(layer.convert(requester, extentsSource[i]));
    }

    return Promise.all(promises);
  }
};
exports["default"] = _default;