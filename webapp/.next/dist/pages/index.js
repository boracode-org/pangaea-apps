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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
var Database_1 = require("../components/Database");

var Test = function (_React$Component) {
    (0, _inherits3.default)(Test, _React$Component);

    function Test() {
        (0, _classCallCheck3.default)(this, Test);

        return (0, _possibleConstructorReturn3.default)(this, (Test.__proto__ || (0, _getPrototypeOf2.default)(Test)).apply(this, arguments));
    }

    (0, _createClass3.default)(Test, [{
        key: "subscribe",
        value: function subscribe() {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var subscription;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                subscription = Database_1.Database.Subscribe('Settings');

                                subscription.on('open', function () {
                                    console.log('subscription opened'); // <<---- THIS WORKS!!!!
                                });
                                subscription.on('update', function (player) {
                                    console.log(player); // <<---- NEVER TRIGGERED :(
                                });
                                subscription.on('enter', function (object) {
                                    console.log('object entered');
                                });
                                subscription.on('leave', function (object) {
                                    console.log('object left');
                                });
                                subscription.on('error', function (error) {
                                    console.log("error", error);
                                });
                                subscription.on('delete', function (object) {
                                    console.log('object deleted');
                                });
                                subscription.on('close', function () {
                                    console.log('subscription closed');
                                });
                                subscription.on('insert', function (player) {
                                    console.log(player); // <<---- NEVER TRIGGERED :(
                                });

                            case 9:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.subscribe();
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(react_native_web_1.View, { style: {
                    flex: 1,
                    backgroundColor: "white",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%"
                } }, React.createElement(react_native_web_1.Text, { style: { flex: 1, fontSize: 30, fontWeight: "bold" } }, "Welcome To Pangaea Media Manager"));
        }
    }]);

    return Test;
}(React.Component);

exports.default = Test;