'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AnimatedExpression = exports.Animation = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FRAMERATE = 60;
var FRAME_DURATION = 1000 / FRAMERATE;
// if is true console.log are enabled to sniff animation'state
var debugAnimation = false;

// player statut
var PLAYER_STATE = {
    // player is stopped
    STOP: 0,
    // player plays animation
    PLAY: 1,
    // player is at the end of an animation
    END: 2,
    // player is paused
    PAUSE: 3
};

var debugMsg = ['Stop', 'Play', 'End', 'Pause'];

// if debugAnimation is true console.log are enabled to sniff animation'state
var _DEBUG = null;

_DEBUG = function () {};

// Private functions
// stop timer and re-init parameter
var resetTimer = function (player) {
    if (player.id) {
        clearInterval(player.id);
        player.id = undefined;
    }
    if (player.waitTimer) {
        clearInterval(player.waitTimer);
        player.waitTimer = undefined;
    }
    player.keyframe = 0;
};

// finish animation and re-init parameter
var finishAnimation = function (player) {
    resetTimer(player);
    if (player.isEnded()) {
        player.dispatchEvent({
            type: 'animation-ended',
            animation: player.animation
        });
    }
    player.dispatchEvent({
        type: 'animation-stopped',
        animation: player.animation
    });
    player.animation = null;
    if (player.resolve) {
        player.resolve();
        player.resolve = null;
        player.promise = null;
    }
};

var setPlayerState = function (player, state) {
    player.state = state;
    _DEBUG(debugMsg[state], player.animation);
};

/**
 * It can play, pause or stop Animation or AnimationExpression (See below).
 * AnimationPlayer is needed to use Animation or AnimationExpression
 * AnimationPlayer emits events :
 *       - for each animation's frame;
 *       - when Animation is stopped
 *       - when Animation is ending
 */

var AnimationPlayer = function (_THREE$EventDispatche) {
    (0, _inherits3.default)(AnimationPlayer, _THREE$EventDispatche);

    function AnimationPlayer() {
        (0, _classCallCheck3.default)(this, AnimationPlayer);

        var _this = (0, _possibleConstructorReturn3.default)(this, (AnimationPlayer.__proto__ || (0, _getPrototypeOf2.default)(AnimationPlayer)).call(this));

        _this.id = null;
        _this.keyframe = 0;
        _this.animation = null;
        _this.resolve = null;
        _this.promise = null;
        _this.state = PLAYER_STATE.STOP;
        _this.waitTimer = null;
        return _this;
    }

    (0, _createClass3.default)(AnimationPlayer, [{
        key: 'isPlaying',
        value: function isPlaying() {
            return this.state === PLAYER_STATE.PLAY;
        }
    }, {
        key: 'isStopped',
        value: function isStopped() {
            return this.state === PLAYER_STATE.STOP;
        }
    }, {
        key: 'isEnded',
        value: function isEnded() {
            return this.state === PLAYER_STATE.END;
        }

        // Public functions

        /**
         * Play one animation.
         * If another animation is playing, it's stopped and the new animation is played.
         *
         * @param {Animation} animation - The animation to play
         * @return {Promise<void>} - Promise is resolved when animation is stopped or finished
         */

    }, {
        key: 'play',
        value: function play(animation) {
            var _this2 = this;

            this.animation = animation;
            this.dispatchEvent({
                type: 'animation-started',
                animation: animation });
            setPlayerState(this, PLAYER_STATE.PLAY);
            resetTimer(this);
            this.id = setInterval(this.frame.bind(this), FRAME_DURATION);
            this.promise = new _promise2.default(function (r) {
                _this2.resolve = r;
            });
            return this.promise;
        }

        /**
         * Play an animation after a number of frames.
         *
         * @param      {Animation}  animation    The animation to play
         * @param      {number}  waitingFrame    The waiting time before start animation (time in frame)
         * @return     {Promise<void>} Promise is resolved when animation is stopped or finished
         */

    }, {
        key: 'playLater',
        value: function playLater(animation, waitingFrame) {
            var _this3 = this;

            this.resolveWait = null;
            var promise = new _promise2.default(function (r) {
                _this3.resolveWait = r;
            });
            var timew = Math.floor(FRAME_DURATION * waitingFrame);
            window.clearInterval(this.waitTimer);
            this.waitTimer = window.setTimeout(function () {
                _this3.play(animation).then(function () {
                    return _this3.resolveWait();
                });
            }, timew);
            return promise;
        }

        /**
         * Stop the current animation.
         *
         * @return  {Promise<void>}  Promise is resolved when animation is stopped or finished
         */

    }, {
        key: 'stop',
        value: function stop() {
            setPlayerState(this, PLAYER_STATE.STOP);
            finishAnimation(this);
            // needed to return promise to wait sync
            return _promise2.default.resolve();
        }

        /**
         * Executed for each frame.
         *
         * @private
         */

    }, {
        key: 'frame',
        value: function frame() {
            if (this.keyframe < this.animation.duration) {
                if (this.animation.animate) {
                    this.animation.animate(this.keyframe);
                }
                this.keyframe++;
                this.dispatchEvent({
                    type: 'animation-frame'
                });
            } else {
                setPlayerState(this, PLAYER_STATE.END);
                finishAnimation(this);
            }
        }
    }]);
    return AnimationPlayer;
}(THREE.EventDispatcher);

/**
 * Animation is played by the AnimationPlayer during the time of duration
 * During playback, the AnimationPlayer emits events for each frame
 * Animation is used to execute a callback to each frame
 */


var Animation =
/**
 * @param {Object}  params
 * @param {?number} params.duration - The animation's duration in number of frames. {@link FRAMERATE} is number of frames in one seconde.
 * @param {string}  params.name     - The animation's name. It's used for debug message.
 */
function Animation(params) {
    (0, _classCallCheck3.default)(this, Animation);

    this.duration = params.duration || FRAMERATE;
    this.name = params.name;
};

/**
 * AnimatedExpression is played by the AnimationPlayer during the time of duration
 * During playback, the AnimationPlayer emits event for each frame and
 * it applies expression on root.
 * AnimatedExpression is used to change object's values for each frame
 */


var AnimatedExpression = function (_Animation) {
    (0, _inherits3.default)(AnimatedExpression, _Animation);

    /**
     * @param {Object}   params
     * @param {?number}  params.duration   - Duration in number of frames. {@link FRAMERATE} is number of frames in one seconde.
     * @param {Object}   params.root       - Object in scene to animate
     * @param {function(Object,number):void} params.expression - Function applied to root for each frame, arguments are the root object and the ratio of completion.
     * @param {string}   params.name       - The animation's name. It's used for debug message
     */
    function AnimatedExpression(params) {
        (0, _classCallCheck3.default)(this, AnimatedExpression);

        var _this4 = (0, _possibleConstructorReturn3.default)(this, (AnimatedExpression.__proto__ || (0, _getPrototypeOf2.default)(AnimatedExpression)).call(this, params));

        _this4.root = params.root;
        _this4.expression = params.expression;
        return _this4;
    }

    (0, _createClass3.default)(AnimatedExpression, [{
        key: 'animate',
        value: function animate(keyFrame) {
            this.expression(this.root, keyFrame / (this.duration - 1));
        }
    }]);
    return AnimatedExpression;
}(Animation);

exports.Animation = Animation;
exports.AnimatedExpression = AnimatedExpression;
exports.default = AnimationPlayer;