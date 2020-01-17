"use strict";

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

var _defineProperty = require("babel-runtime/core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = (0, _getOwnPropertyDescriptor2.default)(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : (0, _typeof3.default)(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && (0, _defineProperty2.default)(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_native_web_1 = require("react-native-web");
var Page_1 = require("../components/Page");
var mobx_1 = require("mobx");
var mobx_react_1 = require("mobx-react");
var Scheduler_1 = require("../components/Scheduler/Scheduler");
var Default = function (_React$Component) {
    (0, _inherits3.default)(Default, _React$Component);

    function Default() {
        (0, _classCallCheck3.default)(this, Default);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Default.__proto__ || (0, _getPrototypeOf2.default)(Default)).apply(this, arguments));

        _this.state = {
            devices: null,
            currentDevice: null
        };
        _this.addYo = mobx_1.action(function () {
            _this.props.app.appName += "YOOO TO MA";
        });
        return _this;
    }

    (0, _createClass3.default)(Default, [{
        key: "render",
        value: function render() {
            var _state = this.state,
                devices = _state.devices,
                currentDevice = _state.currentDevice;

            return React.createElement(react_native_web_1.View, null, React.createElement(Scheduler_1.Scheduler, null));
        }
    }]);

    return Default;
}(React.Component);
Default = __decorate([mobx_react_1.observer], Default);
exports.default = mobx_react_1.observer(Page_1.ComposedComponent(Default));