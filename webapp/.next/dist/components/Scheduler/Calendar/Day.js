'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Day = undefined;

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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  classes: _propTypes2.default.string,
  dayClicked: _propTypes2.default.func,
  dayHovered: _propTypes2.default.func
};

var defaultProps = {
  classes: ''
};

var Day = exports.Day = function (_React$Component) {
  (0, _inherits3.default)(Day, _React$Component);

  function Day() {
    (0, _classCallCheck3.default)(this, Day);

    return (0, _possibleConstructorReturn3.default)(this, (Day.__proto__ || (0, _getPrototypeOf2.default)(Day)).apply(this, arguments));
  }

  (0, _createClass3.default)(Day, [{
    key: '_onClick',
    value: function _onClick() {
      var _props = this.props,
          dayClicked = _props.dayClicked,
          day = _props.day;

      dayClicked(day);
    }
  }, {
    key: '_onHover',
    value: function _onHover() {
      var _props2 = this.props,
          dayHovered = _props2.dayHovered,
          day = _props2.day;

      dayHovered(day);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props3 = this.props,
          classes = _props3.classes,
          day = _props3.day;

      return _react2.default.createElement('td', {
        onClick: function onClick() {
          return _this2._onClick();
        },
        onMouseEnter: function onMouseEnter() {
          return _this2._onHover();
        },
        className: classes
      }, _react2.default.createElement('span', { className: 'day-number' }, isNaN(day.date()) ? "" : day.date()));
    }
  }]);

  return Day;
}(_react2.default.Component);

Day.defaultProps = defaultProps;