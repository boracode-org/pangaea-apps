"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

var _reactHtml5video = require("react-html5video");

var _reactHtml5video2 = _interopRequireDefault(_reactHtml5video);

var _server = require("react-dom/server");

var _server2 = _interopRequireDefault(_server);

require("whatwg-fetch");

var _reactDropzoneComponent = require("react-dropzone-component");

var _reactDropzoneComponent2 = _interopRequireDefault(_reactDropzoneComponent);

var _reactLayoutComponents = require("react-layout-components");

var _reactLayoutComponents2 = _interopRequireDefault(_reactLayoutComponents);

var _reactModal = require("react-modal");

var _reactModal2 = _interopRequireDefault(_reactModal);

var _Gallery = require("./Gallery");

var _Gallery2 = _interopRequireDefault(_Gallery);

var _Constants = require("../Constants");

var _Constants2 = _interopRequireDefault(_Constants);

var _reactNativeWeb = require("react-native-web");

var _Database = require("../Database");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Parse.initialize("ABCDEFG12345");
// Parse.serverURL = "http://psign.iriosystems.com:1380/parse";
// idea, add two playlist items  at each tick, placing default item when there is nothing to display the beginning

var Settings = function (_React$Component) {
  (0, _inherits3.default)(Settings, _React$Component);

  function Settings(props) {
    var _this2 = this;

    (0, _classCallCheck3.default)(this, Settings);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Settings.__proto__ || (0, _getPrototypeOf2.default)(Settings)).call(this, props));

    _this.state = {
      settings: {
        defaultVideo: { file: {} },
        defaultRSS: {},
        defaultBanner: { file: {} }
      }
    };
    _this.saveSettings = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var _this$state$settings, defaultBanner, defaultRSS, defaultVideo;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log("Saving settings...");
              _this$state$settings = _this.state.settings, defaultBanner = _this$state$settings.defaultBanner, defaultRSS = _this$state$settings.defaultRSS, defaultVideo = _this$state$settings.defaultVideo;
              _context.prev = 2;
              _context.next = 5;
              return _Database.Database.saveSettings(defaultVideo, defaultBanner, defaultRSS);

            case 5:
              _this.props.parent.closeModal();
              _context.next = 11;
              break;

            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](2);

              alert("Error saving settings: " + (0, _stringify2.default)(_context.t0));
            // .then(settings => {
            //   var setting = settings[0];
            //   // console.log({ settings });
            //   // // this.setState({
            //   // //     settings: {
            //   // //         defaultVideo: setting.get('defaultVideo'),
            //   // //         defaultBanner: setting.get('defaultBanner')
            //   // //     }
            //   // // });

            //   setting
            //     .save(null)
            //     .then(k => console.log(k))
            //     .catch(err => console.log(err));
            // })
            // .then(() => )
            // .catch(err => console.log(err));

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this2, [[2, 8]]);
    }));
    _this.getSettings = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
      var setting;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _Database.Database.getSettings();

            case 2:
              setting = _context2.sent;

              _this.setState({
                settings: {
                  defaultVideo: setting.defaultVideo,
                  defaultBanner: setting.defaultBanner,
                  defaultRSS: setting.defaultRSS
                }
              });

            // var testObject = new TestObject();
            // testObject.save({ foo: "bar" }).then(function (object) {
            //     alert("yay! lsit worked");
            // });
            // Parse.Query()

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, _this2);
    }));

    _this.selectVideo = function (item) {
      console.log("selected video:", item);
      _this.setState({
        settings: { defaultVideo: item.file, defaultBanner: _this.state.settings.defaultBanner },
        selectVideoOpen: false,
        selectBannerOpen: false
      });
    };

    _this.selectBanner = function (item) {
      console.log("selected banner:", item);
      _this.setState({
        settings: { defaultBanner: item.file, defaultVideo: _this.state.settings.defaultVideo },
        selectVideoOpen: false,
        selectBannerOpen: false
      });
    };

    _this.closeModal = function () {
      _this.setState({ selectVideoOpen: false, selectBannerOpen: false });
    };

    _this.selectBanner = _this.selectBanner.bind(_this);
    _this.selectVideo = _this.selectVideo.bind(_this);
    _this.saveSettings = _this.saveSettings.bind(_this);
    _this.getSettings = _this.getSettings.bind(_this);
    _this.closeModal = _this.closeModal.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(Settings, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.getSettings();
      // componentDidMount is called by react when the component
      // has been rendered on the page. We can set the interval here:
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {}
    // this.props.parent.select(this.state.galleryItems[i])

  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _state$settings = this.state.settings,
          defaultBanner = _state$settings.defaultBanner,
          defaultRSS = _state$settings.defaultRSS,
          defaultVideo = _state$settings.defaultVideo;

      return _react2.default.createElement("div", { style: { backgroundColor: "white", paddingLeft: 0, height: "100%", marginBottom: 50 } }, _react2.default.createElement("h3", {
        style: {
          color: "black",
          height: 40,
          backgroundColor: "lightgray",
          textAlign: "center",
          verticalAlign: "center",
          paddingTop: 10
        }
      }, "Default Settings".toUpperCase()), _react2.default.createElement("div", { className: "panel panel-default", style: { padding: 10, margin: 10 } }, _react2.default.createElement("p", null, "GIF Banner"), _react2.default.createElement("img", {
        src: defaultBanner ? defaultBanner.url : null,
        style: { height: 80, width: 150 }
      }), _react2.default.createElement(_reactModal2.default, {
        style: modalStyle,
        isOpen: this.state.selectBannerOpen,
        onRequestClose: this.closeModal
      }, _react2.default.createElement(_Gallery2.default, {
        onSelect: this.selectBanner,
        types: ".jpg,.png,.gif",
        closeModal: this.closeModal
      })), _react2.default.createElement(_reactNativeWeb.View, { style: { margin: 5, width: 200 } }, _react2.default.createElement(_reactNativeWeb.Button, {
        title: "Change Banner",
        onPress: function onPress() {
          return _this3.setState({ selectBannerOpen: true });
        }
      }))), _react2.default.createElement("div", { className: "panel panel-default", style: { padding: 10, margin: 10 } }, _react2.default.createElement("p", null, "Default Video:"), _react2.default.createElement("img", {
        src: defaultVideo ? defaultVideo.url + ".thumb.png" : null,
        style: { height: 150, width: 150 }
      }), _react2.default.createElement(_reactModal2.default, {
        style: modalStyle,
        isOpen: this.state.selectVideoOpen,
        onRequestClose: this.closeModal
      }, _react2.default.createElement(_Gallery2.default, { onSelect: this.selectVideo, closeModal: this.closeModal })), _react2.default.createElement(_reactNativeWeb.View, { style: { margin: 5, width: 200 } }, _react2.default.createElement(_reactNativeWeb.Button, { title: "Change Video", onPress: function onPress() {
          return _this3.setState({ selectVideoOpen: true });
        } }))), _react2.default.createElement("div", { className: "panel panel-default", style: { padding: 10, margin: 10 } }, _react2.default.createElement("p", null, "RSS"), _react2.default.createElement(_reactNativeWeb.TextInput, {
        style: {
          fontSize: 20,
          border: "1px solid black",
          width: 500,
          borderRadius: 5,
          padding: 5
        },
        value: this.state.settings.defaultRSS,
        onChange: function onChange(e) {
          return _this3.setState({ settings: (0, _extends3.default)({}, _this3.state.settings, { defaultRSS: e.target.value }) });
        }
      })), _react2.default.createElement("br", null), _react2.default.createElement(_reactNativeWeb.View, { style: { flexDirection: "row" } }, _react2.default.createElement(_reactNativeWeb.View, { style: { margin: 5, width: 200 } }, _react2.default.createElement(_reactNativeWeb.Button, { title: "Save", color: "darkgreen", onPress: this.saveSettings })), _react2.default.createElement(_reactNativeWeb.View, { style: { margin: 5, width: 200 } }, _react2.default.createElement(_reactNativeWeb.Button, { title: "Close", onPress: this.props.parent.closeModal }))));
    }
  }]);

  return Settings;
}(_react2.default.Component);
// import Parse from "parse";
// https://github.com/rofrischmann/react-layout-components/issues/27


var modalStyle = {
  overlay: {
    zIndex: 0,
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 15, 15, 0.75)"
  },
  content: {
    zIndex: -5,
    position: "absolute",
    top: "10px",
    left: "10px",
    right: "10px",
    bottom: "10px",
    border: "1px solid #ccc",
    backgroundColor: "rgba(15, 15, 15, 0.95)",
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    borderRadius: "4px",
    outline: "none",
    padding: "20px"
  }
};

exports.default = Settings;