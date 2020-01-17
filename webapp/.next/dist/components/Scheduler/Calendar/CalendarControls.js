'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
  year: _propTypes2.default.number.isRequired,
  onPrevYear: _propTypes2.default.func,
  onNextYear: _propTypes2.default.func,
  goToToday: _propTypes2.default.func,
  showTodayButton: _propTypes2.default.bool
};

var CalendarControls = function (_React$Component) {
  (0, _inherits3.default)(CalendarControls, _React$Component);

  function CalendarControls() {
    (0, _classCallCheck3.default)(this, CalendarControls);

    return (0, _possibleConstructorReturn3.default)(this, (CalendarControls.__proto__ || (0, _getPrototypeOf2.default)(CalendarControls)).apply(this, arguments));
  }

  (0, _createClass3.default)(CalendarControls, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          showTodayButton = _props.showTodayButton,
          goToToday = _props.goToToday,
          onPrevYear = _props.onPrevYear,
          onNextYear = _props.onNextYear;

      var todayButton = void 0;
      if (showTodayButton) {
        todayButton = _react2.default.createElement('div', {
          className: 'control today',
          onClick: function onClick() {
            return goToToday();
          }
        }, 'Today');
      }

      return _react2.default.createElement('div', { className: 'calendar-controls' }, _react2.default.createElement('div', {
        className: 'control',
        onClick: function onClick() {
          return onPrevYear();
        }
      }, '\xAB'), _react2.default.createElement('div', { className: 'current-year' }, this.props.year), _react2.default.createElement('div', {
        className: 'control',
        onClick: function onClick() {
          return onNextYear();
        }
      }, '\xBB'), todayButton);
    }
  }]);

  return CalendarControls;
}(_react2.default.Component);

exports.default = CalendarControls;