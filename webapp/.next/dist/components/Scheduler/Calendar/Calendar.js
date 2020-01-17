"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _Month = require("./Month");

var _utils = require("./utils");

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  year: _propTypes2.default.number.isRequired,
  forceFullWeeks: _propTypes2.default.bool,
  showDaysOfWeek: _propTypes2.default.bool,
  showWeekSeparators: _propTypes2.default.bool,
  firstDayOfWeek: _propTypes2.default.number,
  selectRange: _propTypes2.default.bool,
  onPickDate: _propTypes2.default.func,
  onPickRange: _propTypes2.default.func,
  customClasses: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.func])
};

var defaultProps = {
  year: (0, _moment2.default)().year(),
  forceFullWeeks: false,
  showDaysOfWeek: true,
  showWeekSeparators: true,
  firstDayOfWeek: 0,
  selectRange: false,
  onPickDate: null,
  onPickRange: null,
  selectedDay: (0, _moment2.default)(),
  customClasses: null
};

var Calendar = function (_React$Component) {
  (0, _inherits3.default)(Calendar, _React$Component);

  function Calendar(props) {
    (0, _classCallCheck3.default)(this, Calendar);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Calendar.__proto__ || (0, _getPrototypeOf2.default)(Calendar)).call(this, props));

    _this.state = {
      selectingRange: undefined
    };
    return _this;
  }

  (0, _createClass3.default)(Calendar, [{
    key: "dayClicked",
    value: function dayClicked(date) {
      var _state = this.state,
          selectingRange = _state.selectingRange,
          useless = _state.useless;
      var _props = this.props,
          selectRange = _props.selectRange,
          onPickRange = _props.onPickRange,
          onPickDate = _props.onPickDate;

      if (!selectRange) {
        onPickDate && onPickDate(date);
        return;
      }

      if (!selectingRange) {
        selectingRange = [date, date];
      } else {
        onPickRange && onPickRange(selectingRange[0], date);
        selectingRange = undefined;
      }

      this.setState({
        selectingRange: selectingRange
      });
    }
  }, {
    key: "dayHovered",
    value: function dayHovered(hoveredDay) {
      var selectingRange = this.state.selectingRange;

      if (selectingRange) {
        selectingRange[1] = hoveredDay;

        this.setState({
          selectingRange: selectingRange
        });
      }
    }
  }, {
    key: "_daysOfWeek",
    value: function _daysOfWeek() {
      var _props2 = this.props,
          firstDayOfWeek = _props2.firstDayOfWeek,
          forceFullWeeks = _props2.forceFullWeeks,
          showWeekSeparators = _props2.showWeekSeparators;

      var totalDays = forceFullWeeks ? 42 : 37;

      var days = [];
      (0, _utils.range)(firstDayOfWeek, totalDays + firstDayOfWeek).map(function (i) {
        var day = (0, _moment2.default)().weekday(i).format("dd").charAt(0);

        if (showWeekSeparators) {
          if (i % 7 === firstDayOfWeek && days.length) {
            // push week separator
            days.push(_react2.default.createElement("th", { className: "week-separator", key: "seperator-" + i }));
          }
        }
        days.push(_react2.default.createElement("th", { key: "weekday-" + i, className: i % 7 === 0 ? "bolder" : "" }, day));
      });

      return _react2.default.createElement("tr", null, _react2.default.createElement("th", null, "\xA0"), days);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _props3 = this.props,
          year = _props3.year,
          firstDayOfWeek = _props3.firstDayOfWeek;
      var selectingRange = this.state.selectingRange;

      var months = (0, _utils.range)(0, 12).map(function (month) {
        return _react2.default.createElement(_Month.Month, (0, _extends3.default)({
          month: month,
          key: "month-" + month,
          dayClicked: function dayClicked(d) {
            return _this2.dayClicked(d);
          },
          dayHovered: function dayHovered(d) {
            return _this2.dayHovered(d);
          }
        }, _this2.props, {
          selectingRange: selectingRange
        }));
      });

      return _react2.default.createElement("div", { style: { padding: 5 } }, _react2.default.createElement("style", {
        dangerouslySetInnerHTML: {
          __html: "\n      table.calendar {\n        border-collapse: collapse;\n      }\n      \n      table.calendar thead {\n        background-color: #5A5A5A;\n        color: white;\n        margin-bottom: 0px;\n        border-bottom: 0px solid white\n      }\n      \n      \n      table.calendar thead th {\n        font-weight: normal;\n        padding: 1px 3px;\n      }\n      \n      table.calendar thead th.bolder {\n        font-weight: bold;\n      }\n      \n      table.calendar tbody {\n        font-size: 0.8em;\n      }\n      \n      table.calendar td {\n        text-align: center;\n        padding: 8px;\n        cursor: pointer;\n        border: 1px solid rgba(185, 185, 185, 0.13);\n        background-color: white;\n        min-width: 15px;\n      }\n      \n      table.calendar tr:last-child td {\n        border-bottom: none;\n      }\n      \n      table.calendar td.month-name {\n        font-weight: bold;\n        text-align: left;\n        cursor: default;\n        border-left: none;\n      }\n      \n      table.calendar td.prev-month,\n      table.calendar td.next-month {\n        color: transparent;\n        cursor: default;\n        pointer-events: none;\n        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAAXNSR0IArs4c6QAAABZJREFUCB1jYEADmzdv/o8iRA0BoIEAKngPeSAlnXcAAAAASUVORK5CYII=');\n      }\n      \n      table.calendar td.week-separator {\n        pointer-events: none;\n        padding: 0;\n        width: 8px;\n        min-width: 0;\n        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAAXNSR0IArs4c6QAAABZJREFUCB1jYEADmzdv/o8iRA0BoIEAKngPeSAlnXcAAAAASUVORK5CYII=');\n      }\n      \n      table.calendar td.bolder {\n        font-weight: bold;\n      }\n      \n      /* Single selected day */\n      table.calendar td.selected {\n        background-color: orangered;\n        color: white;\n        font-weight: bold;\n      }\n      \n      /* Selected range */\n      table.calendar td.range {\n        background-color: rgba(255,69,0, 0.7);\n        font-weight: bold;\n        color: white;\n      }\n      \n      table.calendar td.range-left {\n        border-top-left-radius: 15px;\n        border-bottom-left-radius: 15px;\n        overflow: hidden;\n        background: orangered;\n      }\n      \n      table.calendar td.range-right {\n        border-top-right-radius: 15px;\n        border-bottom-right-radius: 15px;\n        overflow: hidden;\n        background: orangered;\n      }\n      \n      div.calendar-controls {\n        margin: 5px auto;\n        display: table;\n        font-size: 20px;\n        line-height: 25px;\n      }\n      \n      div.calendar-controls div {\n        display: inline;\n      }\n      \n      div.calendar-controls .current-year {\n        margin: 0 10px;\n      }\n      \n      div.calendar-controls .control {\n        font-weight: bolder;\n        color: #323232;\n        font-size: 30px;//0.8em;\n        cursor: pointer;\n      }\n      \n      div.calendar-controls .today {\n        position: absolute;\n        right: 15px;\n        line-height: 35px;\n        font-size: 0.6em;\n        text-transform: uppercase;\n      }\n      \n      /* Demo */\n      \n      div#calendar {\n        position: relative;\n        border-radius: 5px;\n        border: 1px solid #5A5A5A;\n        background-color: white;\n        overflow: hidden;\n        -webkit-touch-callout: none;\n        -webkit-user-select: none;\n        -khtml-user-select: none;\n        -moz-user-select: none;\n        -ms-user-select: none;\n        user-select: none;\n      }\n      \n      div#demo {\n        display: table;\n        margin: 50px auto;\n      }\n      \n      h2,h3,h4,h5 {\n        text-align: center;\n        color: #404040;\n      }\n      \n      h1 {\n        text-align: center;\n        color: #B10909;\n      }\n      \n      a {\n        color: #B10909;\n        font-weight: bolder;\n        text-decoration: none;\n      }\n      \n      a.demoLink {\n        text-decoration: underline;\n      }\n      \n      div.options {\n        border: 1px solid #B9B9B9;\n        border-radius: 5px;\n        padding: 10px 15px;\n        margin-top: 30px;\n      }\n      \n      div.options select {\n        margin-left: 10px;\n      }"
        }
      }), _react2.default.createElement("table", { className: "calendar" }, _react2.default.createElement("thead", { className: "day-headers" }, this.props.showDaysOfWeek ? this._daysOfWeek() : null), _react2.default.createElement("tbody", null, months)));
    }
  }]);

  return Calendar;
}(_react2.default.Component);

exports.default = Calendar;


Calendar.defaultProps = defaultProps;