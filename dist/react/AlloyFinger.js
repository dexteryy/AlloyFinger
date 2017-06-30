'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* AlloyFinger v0.1.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * By dntzhang
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * Github: https://github.com/AlloyTeam/AlloyFinger
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var AlloyFinger = function (_React$Component) {
    _inherits(AlloyFinger, _React$Component);

    function AlloyFinger(props) {
        _classCallCheck(this, AlloyFinger);

        var _this = _possibleConstructorReturn(this, (AlloyFinger.__proto__ || Object.getPrototypeOf(AlloyFinger)).call(this, props));

        _this.preV = { x: null, y: null };
        _this.pinchStartLen = null;
        _this.scale = 1;
        _this.isDoubleTap = false;
        _this.delta = null;
        _this.last = null;
        _this.now = null;
        _this.tapTimeout = null;
        _this.longTapTimeout = null;
        _this.swipeTimeout = null;
        _this.x1 = _this.x2 = _this.y1 = _this.y2 = null;
        _this.preTapPosition = { x: null, y: null };
        return _this;
    }

    _createClass(AlloyFinger, [{
        key: 'getLen',
        value: function getLen(v) {
            return Math.sqrt(v.x * v.x + v.y * v.y);
        }
    }, {
        key: 'dot',
        value: function dot(v1, v2) {
            return v1.x * v2.x + v1.y * v2.y;
        }
    }, {
        key: 'getAngle',
        value: function getAngle(v1, v2) {
            var mr = this.getLen(v1) * this.getLen(v2);
            if (mr === 0) return 0;
            var r = this.dot(v1, v2) / mr;
            if (r > 1) r = 1;
            return Math.acos(r);
        }
    }, {
        key: 'cross',
        value: function cross(v1, v2) {
            return v1.x * v2.y - v2.x * v1.y;
        }
    }, {
        key: 'getRotateAngle',
        value: function getRotateAngle(v1, v2) {
            var angle = this.getAngle(v1, v2);
            if (this.cross(v1, v2) > 0) {
                angle *= -1;
            }

            return angle * 180 / Math.PI;
        }
    }, {
        key: '_resetState',
        value: function _resetState() {
            this.setState({ x: null, y: null, swiping: false, start: 0 });
        }
    }, {
        key: '_emitEvent',
        value: function _emitEvent(name, e) {
            if (this.props[name]) {
                this.props[name](e);
            }
        }
    }, {
        key: '_handleTouchStart',
        value: function _handleTouchStart(evt) {
            evt.persist();
            this.now = Date.now();
            this.x1 = evt.touches[0].pageX;
            this.y1 = evt.touches[0].pageY;
            this.delta = this.now - (this.last || this.now);
            if (this.preTapPosition.x !== null) {
                this.isDoubleTap = this.delta > 0 && this.delta <= 250 && Math.abs(this.preTapPosition.x - this.x1) < 30 && Math.abs(this.preTapPosition.y - this.y1) < 30;
            }
            this.preTapPosition.x = this.x1;
            this.preTapPosition.y = this.y1;
            this.last = this.now;
            var preV = this.preV,
                len = evt.touches.length;
            if (len > 1) {
                var v = { x: evt.touches[1].pageX - this.x1, y: evt.touches[1].pageY - this.y1 };
                preV.x = v.x;
                preV.y = v.y;
                this.pinchStartLen = this.getLen(preV);
                this._emitEvent('onMultipointStart', evt);
            }
            this.longTapTimeout = setTimeout(function () {
                this._emitEvent('onLongTap', evt);
            }.bind(this), 750);
        }
    }, {
        key: '_handleTouchMove',
        value: function _handleTouchMove(evt) {
            evt.persist();
            var preV = this.preV,
                len = evt.touches.length,
                currentX = evt.touches[0].pageX,
                currentY = evt.touches[0].pageY;
            this.isDoubleTap = false;
            if (len > 1) {
                var v = { x: evt.touches[1].pageX - currentX, y: evt.touches[1].pageY - currentY };

                if (preV.x !== null) {
                    if (this.pinchStartLen > 0) {
                        evt.scale = this.getLen(v) / this.pinchStartLen;
                        this._emitEvent('onPinch', evt);
                    }

                    evt.angle = this.getRotateAngle(v, preV);
                    this._emitEvent('onRotate', evt);
                }
                preV.x = v.x;
                preV.y = v.y;
            } else {
                if (this.x2 !== null) {
                    evt.deltaX = currentX - this.x2;
                    evt.deltaY = currentY - this.y2;
                } else {
                    evt.deltaX = 0;
                    evt.deltaY = 0;
                }
                this._emitEvent('onPressMove', evt);
            }
            this._cancelLongTap();
            this.x2 = currentX;
            this.y2 = currentY;
            if (len > 1) {
                evt.preventDefault();
            }
        }
    }, {
        key: '_handleTouchCancel',
        value: function _handleTouchCancel() {
            clearInterval(this.tapTimeout);
            clearInterval(this.longTapTimeout);
            clearInterval(this.swipeTimeout);
        }
    }, {
        key: '_handleTouchEnd',
        value: function _handleTouchEnd(evt) {

            this._cancelLongTap();
            var self = this;
            if (evt.touches.length < 2) {
                this._emitEvent('onMultipointEnd', evt);
            }

            if (this.x2 && Math.abs(this.x1 - this.x2) > 30 || this.y2 && Math.abs(this.preV.y - this.y2) > 30) {
                evt.direction = this._swipeDirection(this.x1, this.x2, this.y1, this.y2);
                this.swipeTimeout = setTimeout(function () {
                    self._emitEvent('onSwipe', evt);
                }, 0);
            } else {
                this.tapTimeout = setTimeout(function () {
                    self._emitEvent('onTap', evt);
                    if (self.isDoubleTap) {
                        self._emitEvent('onDoubleTap', evt);
                        self.isDoubleTap = false;
                    }
                }, 0);
            }

            this.preV.x = 0;
            this.preV.y = 0;
            this.scale = 1;
            this.pinchStartLen = null;
            this.x1 = this.x2 = this.y1 = this.y2 = null;
        }
    }, {
        key: '_cancelLongTap',
        value: function _cancelLongTap() {
            clearTimeout(this.longTapTimeout);
        }
    }, {
        key: '_swipeDirection',
        value: function _swipeDirection(x1, x2, y1, y2) {
            return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? x1 - x2 > 0 ? 'Left' : 'Right' : y1 - y2 > 0 ? 'Up' : 'Down';
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.cloneElement(_react2.default.Children.only(this.props.children), {
                onTouchStart: this._handleTouchStart.bind(this),
                onTouchMove: this._handleTouchMove.bind(this),
                onTouchCancel: this._handleTouchCancel.bind(this),
                onTouchEnd: this._handleTouchEnd.bind(this)
            });
        }
    }]);

    return AlloyFinger;
}(_react2.default.Component);

exports.default = AlloyFinger;
module.exports = exports['default'];