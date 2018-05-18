"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Custom error thrown when cancelling commands. Allows the caller to act differently if needed.
 * @class
 * @param {Command} command
 */
var CancelledCommandException = function () {
    function CancelledCommandException(command) {
        (0, _classCallCheck3.default)(this, CancelledCommandException);

        this.command = command;
    }

    (0, _createClass3.default)(CancelledCommandException, [{
        key: "toString",
        value: function toString() {
            return "Cancelled command " + this.command.requester.id + "/" + this.command.layer.id;
        }
    }]);
    return CancelledCommandException;
}();

exports.default = CancelledCommandException;