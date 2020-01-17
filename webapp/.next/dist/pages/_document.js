"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

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
var document_1 = require("next/dist/server/document.js");
var React = require("react");
var react_native_web_1 = require("react-native-web");
var Header_1 = require("../components/Header");

var MyDocument = function (_document_1$default) {
    (0, _inherits3.default)(MyDocument, _document_1$default);

    function MyDocument() {
        (0, _classCallCheck3.default)(this, MyDocument);

        return (0, _possibleConstructorReturn3.default)(this, (MyDocument.__proto__ || (0, _getPrototypeOf2.default)(MyDocument)).apply(this, arguments));
    }

    (0, _createClass3.default)(MyDocument, [{
        key: "render",
        value: function render() {
            return React.createElement("html", null, React.createElement("link", { rel: "stylesheet", href: "//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css" }), React.createElement(document_1.Head, null, React.createElement("title", null, "My page")), React.createElement("body", null, React.createElement(Header_1.Header, { url: this.props.asPath }), React.createElement(document_1.Main, null), React.createElement(document_1.NextScript, null)));
        }
    }], [{
        key: "getInitialProps",
        value: function getInitialProps(_ref) {
            var renderPage = _ref.renderPage,
                asPath = _ref.asPath;

            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var _react_native_web_1$A, stylesheet, page, styles;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                react_native_web_1.AppRegistry.registerComponent("Main", function () {
                                    return document_1.Main;
                                });
                                _react_native_web_1$A = react_native_web_1.AppRegistry.getApplication("Main"), stylesheet = _react_native_web_1$A.stylesheet;
                                page = renderPage();
                                styles = React.createElement("style", { dangerouslySetInnerHTML: { __html: stylesheet } });
                                return _context.abrupt("return", (0, _assign2.default)({}, page, { styles: styles, asPath: asPath }));

                            case 5:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
        }
    }]);

    return MyDocument;
}(document_1.default);

exports.default = MyDocument;