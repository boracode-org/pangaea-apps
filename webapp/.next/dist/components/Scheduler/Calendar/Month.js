'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Month = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

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

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _Day = require('./Day');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {};
var defaultProps = {};

var Month = exports.Month = function (_React$Component) {
  (0, _inherits3.default)(Month, _React$Component);

  function Month(props) {
    (0, _classCallCheck3.default)(this, Month);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Month.__proto__ || (0, _getPrototypeOf2.default)(Month)).call(this, props));

    _this.state = {};
    return _this;
  }

  (0, _createClass3.default)(Month, [{
    key: '_dayClicked',
    value: function _dayClicked(day) {
      this.props.dayClicked(day);
    }
  }, {
    key: '_dayHovered',
    value: function _dayHovered(day) {
      var _props = this.props,
          selectRange = _props.selectRange,
          dayHovered = _props.dayHovered;

      if (selectRange) {
        dayHovered(day);
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      var _props2 = this.props,
          month = _props2.month,
          selectingRange = _props2.selectingRange,
          selectedRange = _props2.selectedRange;
      var _state = this.state,
          selectingRangeStart = _state.selectingRangeStart,
          selectingRangeEnd = _state.selectingRangeEnd;

      //full repaint for some global-affecting rendering props

      if (this.props.year !== nextProps.year || this.props.forceFullWeeks !== nextProps.forceFullWeeks || this.props.showWeekSeparators !== nextProps.showWeekSeparators || this.props.firstDayOfWeek !== nextProps.firstDayOfWeek || this.props.selectRange !== nextProps.selectRange || this.props.customClasses !== nextProps.customClasses) {
        return true;
      }

      // if we get to this point and we are in 'selectRange' mode then it's likely that we have a change in selectingRange
      if (this.props.selectRange) {
        if (selectingRange == undefined) {
          var oldRangeStart = selectedRange[0].month();
          var oldRangeEnd = selectedRange[1].month();
          if (oldRangeStart > oldRangeEnd) {
            ;

            var _ref = [oldRangeEnd, oldRangeStart];
            oldRangeStart = _ref[0];
            oldRangeEnd = _ref[1];
          }var newRangeStart = nextProps.selectingRange[0].month();
          var newRangeEnd = nextProps.selectingRange[1].month();
          if (newRangeStart > newRangeEnd) {
            ;

            var _ref2 = [newRangeEnd, newRangeStart];
            newRangeStart = _ref2[0];
            newRangeEnd = _ref2[1];
          } // first time it's called, repaint months in old selectedRange and next selectingRange
          return oldRangeStart <= month && month <= oldRangeEnd || newRangeStart <= month && month <= newRangeEnd;
        } else if (nextProps.selectingRange == undefined) {
          // last time it's called, repaint months in previous selectingRange
          var _oldRangeStart = selectingRangeStart;
          var _oldRangeEnd = selectingRangeEnd;
          if (_oldRangeStart > _oldRangeEnd) {
            ;

            var _ref3 = [_oldRangeEnd, _oldRangeStart];
            _oldRangeStart = _ref3[0];
            _oldRangeEnd = _ref3[1];
          }var _newRangeStart = nextProps.selectedRange[0].month();
          var _newRangeEnd = nextProps.selectedRange[1].month();
          if (_newRangeStart > _newRangeEnd) {
            ;

            var _ref4 = [_newRangeEnd, _newRangeStart];
            _newRangeStart = _ref4[0];
            _newRangeEnd = _ref4[1];
          } // called on day hovering changed
          return _oldRangeStart <= month && month <= _oldRangeEnd || _newRangeStart <= month && month <= _newRangeEnd;
        } else {
          // called on day hovering changed
          var _oldRangeStart2 = selectingRangeStart;
          var _oldRangeEnd2 = selectingRangeEnd;
          if (_oldRangeStart2 > _oldRangeEnd2) {
            ;

            var _ref5 = [_oldRangeEnd2, _oldRangeStart2];
            _oldRangeStart2 = _ref5[0];
            _oldRangeEnd2 = _ref5[1];
          }var _newRangeStart2 = nextProps.selectingRange[0].month();
          var _newRangeEnd2 = nextProps.selectingRange[1].month();
          if (_newRangeStart2 > _newRangeEnd2) {
            ;

            var _ref6 = [_newRangeEnd2, _newRangeStart2];
            _newRangeStart2 = _ref6[0];
            _newRangeEnd2 = _ref6[1];
          }return _oldRangeStart2 <= month && month <= _oldRangeEnd2 || _newRangeStart2 <= month && month <= _newRangeEnd2;
        }
      }
      // single selectedDay changed: repaint months where selectedDay was and where will be
      else if (this.props.selectedDay.month() == month || nextProps.selectedDay.month() == month) {
          return true;
        }

      return false;
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.selectingRange !== undefined) {
        this.setState({
          selectingRangeStart: nextProps.selectingRange[0].month(),
          selectingRangeEnd: nextProps.selectingRange[1].month()
        });
      }
    }
  }, {
    key: '_monthDays',
    value: function _monthDays() {
      var _this2 = this;

      var _props3 = this.props,
          year = _props3.year,
          month = _props3.month,
          forceFullWeeks = _props3.forceFullWeeks,
          showWeekSeparators = _props3.showWeekSeparators,
          selectedDay = _props3.selectedDay,
          onPickDate = _props3.onPickDate,
          firstDayOfWeek = _props3.firstDayOfWeek,
          selectingRange = _props3.selectingRange,
          selectRange = _props3.selectRange,
          selectedRange = _props3.selectedRange,
          customClasses = _props3.customClasses;

      var monthStart = (0, _moment2.default)([year, month, 1]); // current day

      // number of days to insert before the first of the month to correctly align the weekdays
      var prevMonthDaysCount = monthStart.weekday();
      while (prevMonthDaysCount < firstDayOfWeek) {
        prevMonthDaysCount += 7;
      }
      // days in month
      var numberOfDays = monthStart.daysInMonth();
      // insert days at the end to match up 37 (max number of days in a month + 6)
      // or 42 (if user prefers seeing the week closing with Sunday)
      var totalDays = forceFullWeeks ? 42 : 37;

      // day-generating loop
      var days = [];
      (0, _utils.range)(firstDayOfWeek + 1, totalDays + firstDayOfWeek + 1).map(function (i) {
        var day = (0, _moment2.default)([year, month, i - prevMonthDaysCount]);

        // pick appropriate classes
        var classes = [];
        if (i <= prevMonthDaysCount) {
          classes.push('prev-month');
        } else if (i > numberOfDays + prevMonthDaysCount) {
          classes.push('next-month');
        } else {
          if (selectRange) {
            // selectingRange is used while user is selecting a range
            // (has clicked on start day, and is hovering end day - but not yet clicked)
            var start = (selectingRange || selectedRange)[0];
            var end = (selectingRange || selectedRange)[1];

            // validate range
            if (end.isBefore(start)) {
              start = (selectingRange || selectedRange)[1];
              end = (selectingRange || selectedRange)[0];
            }

            if (day.isBetween(start, end, 'day')) {
              classes.push('range');
            }

            if (day.isSame(start, 'day')) {
              classes.push('range');
              classes.push('range-left');
            } else if (day.isSame(end, 'day')) {
              classes.push('range');
              classes.push('range-right');
            }
          } else {
            if (day.isSame(selectedDay, 'day')) {
              classes.push('selected');
            }
          }

          // call here customClasses function to avoid giving improper classses to prev/next month
          if (customClasses instanceof Function) {
            classes.push(customClasses(day));
          }
        }

        if ((i - 1) % 7 === 0) {
          // sunday
          classes.push('bolder');
        }

        if (customClasses) {
          (0, _keys2.default)(customClasses).map(function (k) {
            var obj = customClasses[k];
            // Order here is important! Everything is instance of Object in js
            if (typeof obj === "string") {
              if (obj.indexOf(day.format('ddd')) > -1) {
                classes.push(k);
              }
            } else if (obj instanceof Array) {
              obj.map(function (d) {
                if (day.format("YYYY-MM-DD") === d) classes.push(k);
              });
            } else if (obj instanceof Function) {
              if (obj(day)) {
                classes.push(k);
              }
            } else /*if( obj instanceof Object )*/{
                if (obj.start && obj.end) {
                  var startDate = (0, _moment2.default)(obj.start, "YYYY-MM-DD").add(-1, 'days');
                  var endDate = (0, _moment2.default)(obj.end, "YYYY-MM-DD").add(1, 'days');
                  if (day.isBetween(startDate, endDate)) {
                    classes.push(k);
                  }
                }
              }
          });
        }

        if (showWeekSeparators) {
          if ((i - 1) % 7 === firstDayOfWeek && days.length) {
            // push week separator
            days.push(_react2.default.createElement('td', {
              className: 'week-separator',
              key: 'seperator-' + i
            }));
          }
        }
        days.push(_react2.default.createElement(_Day.Day, {
          key: 'day-' + i,
          day: day,
          classes: classes.join(' '),
          dayClicked: function dayClicked(d) {
            return _this2._dayClicked(d);
          },
          dayHovered: function dayHovered(d) {
            return _this2._dayHovered(d);
          }
        }));
      });

      return days;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props4 = this.props,
          month = _props4.month,
          year = _props4.year;

      return _react2.default.createElement('tr', null, _react2.default.createElement('td', { className: 'month-name' }, (0, _moment2.default)([year, month, 1]).format('MMM')), this._monthDays());
    }
  }]);

  return Month;
}(_react2.default.Component);

Month.defaultProps = defaultProps;