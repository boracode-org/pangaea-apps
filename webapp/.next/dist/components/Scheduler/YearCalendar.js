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

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _Calendar = require('./Calendar');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var YearCalendar = function (_React$Component) {
  (0, _inherits3.default)(YearCalendar, _React$Component);

  function YearCalendar(props) {
    (0, _classCallCheck3.default)(this, YearCalendar);

    var _this = (0, _possibleConstructorReturn3.default)(this, (YearCalendar.__proto__ || (0, _getPrototypeOf2.default)(YearCalendar)).call(this, props));

    var today = (0, _moment2.default)();

    _this.state = {
      year: today.year(),
      selectedDay: today,
      selectedRange: [today, (0, _moment2.default)(today).add(15, 'day')],
      showDaysOfWeek: true,
      showTodayBtn: true,
      showWeekSeparators: true,
      selectRange: false,
      firstDayOfWeek: 0 // sunday
    };
    return _this;
  }

  (0, _createClass3.default)(YearCalendar, [{
    key: 'onPrevYear',
    value: function onPrevYear() {
      this.setState({ year: this.state.year - 1 });
    }
  }, {
    key: 'onNextYear',
    value: function onNextYear() {
      this.setState({ year: this.state.year + 1 });
    }
  }, {
    key: 'goToToday',
    value: function goToToday() {
      var today = (0, _moment2.default)();

      this.setState({
        selectedDay: today,
        selectedRange: [today, (0, _moment2.default)(today).add(15, 'day')],
        year: today.year()
      });
    }
  }, {
    key: 'datePicked',
    value: function datePicked(date) {
      this.props.onPickDate(date);
      this.setState({
        selectedDay: date,
        selectedRange: [date, (0, _moment2.default)(date).add(15, 'day')]
      });
    }
  }, {
    key: 'rangePicked',
    value: function rangePicked(start, end) {
      this.setState({
        selectedRange: [start, end],
        selectedDay: start
      });
    }
  }, {
    key: 'toggleShowDaysOfWeek',
    value: function toggleShowDaysOfWeek() {
      this.setState({ showDaysOfWeek: !this.state.showDaysOfWeek });
    }
  }, {
    key: 'toggleForceFullWeeks',
    value: function toggleForceFullWeeks() {
      var next_forceFullWeeks = !this.state.forceFullWeeks;
      this.setState({
        showDaysOfWeek: next_forceFullWeeks,
        forceFullWeeks: next_forceFullWeeks
      });
    }
  }, {
    key: 'toggleShowTodayBtn',
    value: function toggleShowTodayBtn() {
      this.setState({ showTodayBtn: !this.state.showTodayBtn });
    }
  }, {
    key: 'toggleShowWeekSeparators',
    value: function toggleShowWeekSeparators() {
      this.setState({ showWeekSeparators: !this.state.showWeekSeparators });
    }
  }, {
    key: 'toggleSelectRange',
    value: function toggleSelectRange() {
      this.setState({ selectRange: !this.state.selectRange });
    }
  }, {
    key: 'selectFirstDayOfWeek',
    value: function selectFirstDayOfWeek(e) {
      this.setState({ firstDayOfWeek: parseInt(e.target.value) });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var customCSSclasses = {
        holidays: ["2016-04-25", "2016-05-01", "2016-06-02", "2016-08-15", "2016-11-01"],
        spring: {
          start: "2016-03-21",
          end: "2016-6-20"
        },
        summer: {
          start: "2016-06-21",
          end: "2016-09-22"
        },
        autumn: {
          start: "2016-09-23",
          end: "2016-12-21"
        },
        weekend: "Sat,Sun",
        winter: function winter(day) {
          return day.isBefore((0, _moment2.default)([2016, 2, 21])) || day.isAfter((0, _moment2.default)([2016, 11, 21]));
        }
        // alternatively, customClasses can be a function accepting a moment object
        //var customCSSclasses = day => ( day.isBefore( moment([day.year(),2,21]) ) || day.isAfter( moment([day.year(),11,21]) ) ) ? 'winter': 'summer'

      };var _state = this.state,
          year = _state.year,
          showTodayBtn = _state.showTodayBtn,
          selectedDay = _state.selectedDay,
          showDaysOfWeek = _state.showDaysOfWeek,
          forceFullWeeks = _state.forceFullWeeks,
          showWeekSeparators = _state.showWeekSeparators,
          firstDayOfWeek = _state.firstDayOfWeek,
          selectRange = _state.selectRange,
          selectedRange = _state.selectedRange;

      return _react2.default.createElement('div', null, _react2.default.createElement('div', { id: 'calendar' }, _react2.default.createElement(_Calendar.CalendarControls, {
        year: year,
        showTodayButton: showTodayBtn,
        onPrevYear: function onPrevYear() {
          return _this2.onPrevYear();
        },
        onNextYear: function onNextYear() {
          return _this2.onNextYear();
        },
        goToToday: function goToToday() {
          return _this2.goToToday();
        }
      }), _react2.default.createElement(_Calendar.Calendar, {
        year: year,
        selectedDay: selectedDay,
        showDaysOfWeek: showDaysOfWeek,
        forceFullWeeks: forceFullWeeks,
        showWeekSeparators: showWeekSeparators,
        firstDayOfWeek: firstDayOfWeek,
        selectRange: selectRange,
        selectedRange: selectedRange,
        onPickDate: function onPickDate(date) {
          return _this2.datePicked(date);
        },
        onPickRange: function onPickRange(start, end) {
          return _this2.rangePicked(start, end);
        },
        customClasses: customCSSclasses
      })));
    }
  }]);

  return YearCalendar;
}(_react2.default.Component);

exports.default = YearCalendar;

// <div className='options'>
//           <b>Demo Options</b>
//           <br />
//           <ul>
//             <li>
//               <input
//                 id='showDaysOfWeek'
//                 type='checkbox'
//                 checked={showDaysOfWeek}
//                 onChange={() => this.toggleShowDaysOfWeek()}
//               />
//               <label htmlFor='showDaysOfWeek'>Show days of week</label>
//             </li>
//             <li>
//               <input
//                 id='forceFullWeeks'
//                 type='checkbox'
//                 checked={forceFullWeeks}
//                 onChange={() => this.toggleForceFullWeeks()}
//               />
//               <label htmlFor='forceFullWeeks'>Force full weeks</label>
//             </li>
//             <li>
//               <input
//                 id='showTodayBtn'
//                 type='checkbox'
//                 checked={showTodayBtn}
//                 onChange={() => this.toggleShowTodayBtn()}
//               />
//               <label htmlFor='showTodayBtn'>Show 'Today' button</label>
//             </li>
//             <li>
//               <input
//                 id='showWeekSeparators'
//                 type='checkbox'
//                 checked={showWeekSeparators}
//                 onChange={() => this.toggleShowWeekSeparators()}
//               />
//             <label htmlFor='showWeekSeparators'>Show week separators</label>
//             </li>
//             <li>
//               <label htmlFor='firstDayOfWeek'>First day of week</label>
//               <select
//                 id='firstDayOfWeek'
//                 value={firstDayOfWeek}
//                 onChange={(e) => this.selectFirstDayOfWeek(e)}
//               >
//                 {[0,1,2,3,4,5,6].map( i =>
//                   <option key={i} value={i}>{moment().weekday(i).format("ddd")}</option>
//                 )}
//               </select>
//             </li>
//             <li>
//               <input
//                 id='selectRange'
//                 type='checkbox'
//                 checked={selectRange}
//                 onChange={() => this.toggleSelectRange()}
//               />
//               <label htmlFor='selectRange'>Select Date range</label>
//             </li>
//           </ul>
//           <br />
//           <i>All these options are available as Calendar props. Colors are assigned with an object mapping class names to week days, periods or single days.</i>
//         </div>