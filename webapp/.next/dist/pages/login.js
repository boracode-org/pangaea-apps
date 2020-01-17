"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

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

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

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
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = _promise2.default))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_native_web_1 = require("react-native-web");
var Page_1 = require("../components/Page");
var mobx_react_1 = require("mobx-react");
var mobx_1 = require("mobx");
var Database_1 = require("../components/Database");
var Login = function (_React$Component) {
    (0, _inherits3.default)(Login, _React$Component);

    function Login() {
        (0, _classCallCheck3.default)(this, Login);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Login.__proto__ || (0, _getPrototypeOf2.default)(Login)).apply(this, arguments));

        _this.state = {
            username: null,
            password: null
        };
        _this.addYo = mobx_1.action(function () {
            _this.props.app.appName += "YOOO TO MA";
        });
        _this.login = function () {
            return __awaiter(_this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var _state, username, password;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _state = this.state, username = _state.username, password = _state.password;
                                // alert(JSON.stringify({username,password}));

                                _context.prev = 1;
                                _context.next = 4;
                                return Database_1.Database.login(username, password);

                            case 4:
                                alert("Successfully logged you in...");
                                window.location = "/scheduler";
                                _context.next = 11;
                                break;

                            case 8:
                                _context.prev = 8;
                                _context.t0 = _context["catch"](1);

                                alert("Failed to log you in: " + _context.t0.message);

                            case 11:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[1, 8]]);
            }));
        };
        return _this;
    }

    (0, _createClass3.default)(Login, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            var _state2 = this.state,
                username = _state2.username,
                password = _state2.password;

            return React.createElement(react_native_web_1.View, { style: { flex: 1, justifyContent: "center", alignItems: "center", alignContent: "center" } }, React.createElement(react_native_web_1.View, { style: {
                    backgroundColor: "#FAFAFA",
                    width: 400,
                    height: 300,
                    padding: 10,
                    marginTop: 100
                } }, React.createElement(react_native_web_1.Text, { style: {
                    backgroundColor: "white",
                    color: "black",
                    width: "100%",
                    fontSize: 30,
                    marginBottom: 20
                } }, "Login"), React.createElement(react_native_web_1.TextInput, { placeholder: "Username", value: username, style: {
                    margin: 5,
                    fontSize: 20,
                    padding: 5,
                    border: "1px solid lightblue",
                    borderRadius: 5
                }, onChange: function onChange(e) {
                    return _this2.setState({ username: e.nativeEvent.text });
                } }), React.createElement(react_native_web_1.TextInput, { placeholder: "Password", value: password, secureTextEntry: true, style: {
                    margin: 5,
                    fontSize: 20,
                    padding: 5,
                    border: "1px solid lightblue",
                    borderRadius: 5
                }, onChange: function onChange(e) {
                    return _this2.setState({ password: e.nativeEvent.text });
                } }), React.createElement(react_native_web_1.View, { style: { width: 100, padding: 5 } }, React.createElement(react_native_web_1.Button, { title: "Login", onPress: this.login }))));
        }
    }]);

    return Login;
}(React.Component);
Login = __decorate([mobx_react_1.observer], Login);
exports.default = mobx_react_1.observer(Page_1.ComposedComponent(Login));