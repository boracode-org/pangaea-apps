"use strict";
// The Page Hoc used to wrap all our Page components.
// It serves 3 main purposes :
// 1. Handles global styling
// 2. Handles global layout
// 3. Construct and provide the Mobx stores

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

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
var mobx_react_1 = require("mobx-react");
var stores_1 = require("../stores");
function ComposedComponent(Component) {
    return function (_React$Component) {
        (0, _inherits3.default)(_class, _React$Component);

        (0, _createClass3.default)(_class, null, [{
            key: "getInitialProps",
            value: function getInitialProps(ctx) {
                return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                    var userState, isServer, appStore, appState;
                    return _regenerator2.default.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    userState = null;
                                    isServer = !!ctx.req;
                                    //   if (isServer === true) {
                                    //     const User = Stores("__userStore__");
                                    //     userState = User.getUserFromCookie(ctx.req);
                                    //   }

                                    appStore = stores_1.default("__appStore__");
                                    _context.next = 5;
                                    return appStore.fetchTodos();

                                case 5:
                                    appState = appStore.toJSON();
                                    return _context.abrupt("return", {
                                        isServer: isServer,
                                        userState: userState,
                                        appState: appState
                                    });

                                case 7:
                                case "end":
                                    return _context.stop();
                            }
                        }
                    }, _callee, this);
                }));
            }
        }]);

        function _class(props) {
            (0, _classCallCheck3.default)(this, _class);

            var _this = (0, _possibleConstructorReturn3.default)(this, (_class.__proto__ || (0, _getPrototypeOf2.default)(_class)).call(this, props));

            _this.state = {
                stores: {
                    //   user: Stores("__userStore__", props.userState),
                    app: stores_1.default("__appStore__", props.appState)
                }
            };
            return _this;
        }

        (0, _createClass3.default)(_class, [{
            key: "render",
            value: function render() {
                // alert("stores:" + JSON.stringify(this.state.stores))
                return React.createElement(mobx_react_1.Provider, (0, _assign2.default)({}, this.state.stores), React.createElement(Component, { user: this.props, app: this.state.stores.app }));
            }
        }]);

        return _class;
    }(React.Component);
}
exports.ComposedComponent = ComposedComponent;