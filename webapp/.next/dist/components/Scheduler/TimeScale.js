"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _parseInt = require("babel-runtime/core-js/number/parse-int");

var _parseInt2 = _interopRequireDefault(_parseInt);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require("react-bootstrap");

var _YearCalendar = require("./YearCalendar");

var _YearCalendar2 = _interopRequireDefault(_YearCalendar);

var _Preview = require("./Preview");

var _Preview2 = _interopRequireDefault(_Preview);

var _reactNativeWeb = require("react-native-web");

var _reactModal = require("react-modal");

var _reactModal2 = _interopRequireDefault(_reactModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// var TimeScale = React.createClass({

//   render: function() {
//     return (

//         <div>
//         <div className="container-fluid">
//           <div className="row">
//             <div className="col-lg-12">
//               <PageHeader>TimeScale </PageHeader>
//             </div>
//           </div>
//         </div>
//         </div>

//     );
//   }

// });

function pad(num, size) {
  var s = num + "";
  while (s.length < size) {
    s = "0" + s;
  }return s;
}
// var y = k * 30;
// return "yon ";//pad(Number.parseInt(y / 60),2) + ":" + pad(y%60,2);
// }),//["00:00","00:30","01:00","01:30","02:00","02:30","03:00","03:30","04:00","04:30","05:00"],

function generateSeconds(minute) {
  return Array.apply(null, { length: 10 }).map(Number.call, function (k) {
    return [pad((0, _parseInt2.default)((minute * 60 + k * 30) / 60), 2) + ":" + pad((minute * 60 + k * 30) % 60, 2), pad((0, _parseInt2.default)((minute * 60 + (k + 1) * 30) / 60), 2) + ":" + pad((minute * 60 + (k + 1) * 30) % 60, 2)];
  });
}

var TimeScale = function (_React$Component) {
  (0, _inherits3.default)(TimeScale, _React$Component);

  function TimeScale(props) {
    (0, _classCallCheck3.default)(this, TimeScale);

    var _this = (0, _possibleConstructorReturn3.default)(this, (TimeScale.__proto__ || (0, _getPrototypeOf2.default)(TimeScale)).call(this, props));

    _this.state = {
      hours: Array.apply(null, { length: 24 }).map(Number.call, function (k) {
        return k;
      }),
      minutes: Array.apply(null, { length: 12 }).map(Number.call, function (k) {
        return k * 5;
      }),
      seconds: generateSeconds(0),
      previewOpen: false,
      currentHour: 6,
      currentMinute: 5,
      hover: false,
      hoverSecond: -1,
      selectSecond: -1,
      hoverHour: -1,
      selectHour: -1,
      hoverMinute: -1,
      selectMinute: -1
    };
    _this.onMouseHoverSecond = _this.onMouseHoverSecond.bind(_this);
    _this.onMouseSelectSecond = _this.onMouseSelectSecond.bind(_this);
    _this.onMouseHoverHour = _this.onMouseHoverHour.bind(_this);
    _this.onMouseSelectHour = _this.onMouseSelectHour.bind(_this);
    _this.onMouseHoverMinute = _this.onMouseHoverMinute.bind(_this);
    _this.onMouseSelectMinute = _this.onMouseSelectMinute.bind(_this);
    _this.onDatePicked = _this.onDatePicked.bind(_this);
    _this.afterOpenModal = _this.afterOpenModal.bind(_this);
    _this.closeModal = _this.closeModal.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(TimeScale, [{
    key: "afterOpenModal",
    value: function afterOpenModal() {
      // references are now sync'd and can be accessed.
      if (this.refs.subtitle) this.refs.subtitle.style.color = "#f00";
    }
  }, {
    key: "closeModal",
    value: function closeModal() {
      this.setState({ previewOpen: false });
    }
  }, {
    key: "onMouseHoverSecond",
    value: function onMouseHoverSecond(second) {
      if (this.state.hoverSecond == second) this.setState({ hoverSecond: -1 });else this.setState({ hoverSecond: second });
    }
  }, {
    key: "onMouseSelectSecond",
    value: function onMouseSelectSecond(second) {
      if (this.state.selectMinute != -1) this.setState({ selectSecond: second });
      //Show popup
      this.setState({
        previewOpen: true,
        timeSelected: this.state.seconds[second],
        hourSelected: pad(this.state.currentHour, 1),
        dateSelected: this.state.dateSelected
      });
    }
  }, {
    key: "onMouseHoverHour",
    value: function onMouseHoverHour(hour) {
      if (this.state.hoverHour == hour) this.setState({ hoverHour: -1 });else this.setState({ hoverHour: hour });
    }
  }, {
    key: "onMouseSelectHour",
    value: function onMouseSelectHour(hour) {
      this.setState({ selectHour: hour, currentHour: hour, selectMinute: 0, selectSecond: 0 });
      // console.log("selectHour", hour);
    }
  }, {
    key: "onMouseHoverMinute",
    value: function onMouseHoverMinute(min) {
      if (this.state.hoverMinute == min) this.setState({ hoverMinute: -1 });else this.setState({ hoverMinute: min });
    }
  }, {
    key: "onMouseSelectMinute",
    value: function onMouseSelectMinute(min) {
      this.setState({
        selectMinute: min,
        currentMinute: this.state.minutes[min],
        selectSecond: 0,
        seconds: generateSeconds(this.state.minutes[min])
      });
      console.log("selectMinute", this.state.minutes[min]);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement("div", null, _react2.default.createElement(_reactModal2.default, {
        isOpen: this.state.previewOpen,
        onAfterOpen: this.afterOpenModal,
        onRequestClose: this.closeModal
      }, _react2.default.createElement(_Preview2.default, {
        parent: this,
        timeSelected: this.state.timeSelected || 0,
        dateSelected: this.state.dateSelected || new Date(),
        hourSelected: this.state.hourSelected || 0,
        selectedGroup: this.props.selectedGroup
      })), _react2.default.createElement(_YearCalendar2.default, { year: 2016, onPickDate: this.onDatePicked }), _react2.default.createElement("br", null), _react2.default.createElement("b", null, "Hours: "), _react2.default.createElement("br", null), _react2.default.createElement(_reactNativeWeb.View, {
        style: {
          width: "100%",
          float: "left",
          margin: 5,
          flex: 1,
          flexDirection: "row",
          flexWrap: "wrap"
        }
      }, this.state.hours.map(function (listValue, it) {
        return _react2.default.createElement(_reactNativeWeb.View, {
          key: it,
          style: {
            backgroundColor: _this2.state.hoverHour == it ? "red" : _this2.state.selectHour == it ? "green" : "orange",
            width: "30",
            margin: 2,
            color: "white",
            fontWeight: "bold",
            padding: 5
          },
          onMouseEnter: _this2.onMouseHoverHour.bind(null, it),
          onMouseLeave: _this2.onMouseHoverHour.bind(null, it),
          onClick: _this2.onMouseSelectHour.bind(null, it)
        }, _react2.default.createElement(_reactNativeWeb.Text, { style: { fontSize: 18 } }, pad(listValue, 2), ": 00-", pad(listValue + 1, 2), ": 00"));
      })), _react2.default.createElement("br", null), _react2.default.createElement("b", null, "Minutes: "), _react2.default.createElement("br", null), _react2.default.createElement(_reactNativeWeb.View, {
        style: {
          width: "100%",
          float: "left",
          margin: 5,
          flex: 1,
          flexDirection: "row",
          flexWrap: "wrap"
        }
      }, this.state.minutes.map(function (listValue, it) {
        return _react2.default.createElement(_reactNativeWeb.View, {
          key: it,
          style: {
            backgroundColor: _this2.state.hoverMinute == it ? "red" : _this2.state.selectMinute == it ? "green" : "black",
            width: "30",
            margin: 2,
            fontSize: 25,
            color: "white",
            fontWeight: "bold",
            padding: 5
          },
          onMouseEnter: _this2.onMouseHoverMinute.bind(null, it),
          onMouseLeave: _this2.onMouseHoverMinute.bind(null, it),
          onClick: _this2.onMouseSelectMinute.bind(null, it)
        }, _react2.default.createElement(_reactNativeWeb.Text, { style: { fontSize: 18 } }, pad(_this2.state.currentHour, 2), ": ", pad(listValue, 2)));
      })), _react2.default.createElement("b", null, "Seconds: "), " ", _react2.default.createElement("br", null), _react2.default.createElement(_reactNativeWeb.View, {
        style: {
          width: "100%",
          float: "left",
          margin: 5,
          flex: 1,
          flexDirection: "row",
          flexWrap: "wrap"
        }
      }, this.state.seconds.map(function (it, listValue) {
        return _react2.default.createElement(_reactNativeWeb.View, {
          key: it,
          style: {
            backgroundColor: _this2.state.hoverSecond == listValue ? "red" : _this2.state.selectSecond == listValue ? "green" : "blue",
            margin: 2,
            fontSize: 25,
            color: "white",
            fontWeight: "bold",
            padding: 5
          },
          onMouseEnter: _this2.onMouseHoverSecond.bind(null, listValue),
          onMouseLeave: _this2.onMouseHoverSecond.bind(null, listValue),
          onClick: _this2.onMouseSelectSecond.bind(null, listValue)
        }, _react2.default.createElement(_reactNativeWeb.Text, { style: { fontSize: 18 } }, pad(_this2.state.currentHour, 1), ":", pad(it[0], 2) + "-" + pad(_this2.state.currentHour, 1), ": ", pad(it[1], 2)));
      })));
    }
  }, {
    key: "renderTime",
    value: function renderTime(time) {
      return _react2.default.createElement("li", null);
    }
  }, {
    key: "onDatePicked",
    value: function onDatePicked(date) {
      // alert(date);
      this.setState({
        selectHour: 0,
        currentHour: 6,
        selectMinute: 0,
        selectSecond: 0,
        dateSelected: date
      });
    }
  }]);

  return TimeScale;
}(_react2.default.Component);

exports.default = TimeScale;