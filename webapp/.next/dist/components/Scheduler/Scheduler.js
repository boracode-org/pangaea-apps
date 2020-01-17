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
var TimeScale_1 = require("./TimeScale");
var Modal = require("react-modal");
var Player_1 = require("./Player");
var Gallery_1 = require("./Gallery");
var Settings_1 = require("./Settings");
var semantic_ui_react_1 = require("semantic-ui-react");
var Database_1 = require("../Database");

var Scheduler = function (_React$Component) {
    (0, _inherits3.default)(Scheduler, _React$Component);

    function Scheduler(props) {
        (0, _classCallCheck3.default)(this, Scheduler);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Scheduler.__proto__ || (0, _getPrototypeOf2.default)(Scheduler)).call(this, props));

        _this.state = {
            playerOpen: false,
            groups: [{
                key: "Aisha Williamson",
                text: "Aisha Williamson",
                value: "aisha_williamson"
            }]
        };
        _this.closeModal = _this.closeModal.bind(_this);
        _this.openModal = _this.openModal.bind(_this);
        _this.openGalleryModal = _this.openGalleryModal.bind(_this);
        _this.openSettingsModal = _this.openSettingsModal.bind(_this);
        return _this;
    }

    (0, _createClass3.default)(Scheduler, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            this.refreshGroups();
        }
    }, {
        key: "refreshGroups",
        value: function refreshGroups() {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var groups;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return Database_1.Database.getGroups();

                            case 2:
                                groups = _context.sent;

                                this.setState({
                                    groups: groups.map(function (k) {
                                        return k.toJSON();
                                    }).map(function (k) {
                                        return {
                                            key: k.objectId,
                                            text: k.name,
                                            value: k.objectId
                                        };
                                    })
                                });

                            case 4:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
        }
    }, {
        key: "closeModal",
        value: function closeModal() {
            this.setState({
                playerOpen: false,
                galleryOpen: false,
                settingsOpen: false
            });
        }
    }, {
        key: "openModal",
        value: function openModal() {
            this.setState({ playerOpen: true });
        }
    }, {
        key: "openGalleryModal",
        value: function openGalleryModal() {
            this.setState({ galleryOpen: true });
        }
    }, {
        key: "openSettingsModal",
        value: function openSettingsModal() {
            this.setState({ settingsOpen: true });
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            var groups = this.state.groups;

            return React.createElement("div", null, React.createElement(Modal, { style: modalStyle, isOpen: this.state.playerOpen, onRequestClose: this.closeModal }, React.createElement(Player_1.default, { parent: this, closeModal: this.closeModal })), React.createElement(Modal, { style: modalStyle, isOpen: this.state.galleryOpen, onRequestClose: this.closeModal }, React.createElement(Gallery_1.default, { parent: this, closeModal: this.closeModal })), React.createElement(Modal, { style: modalStyle, isOpen: this.state.settingsOpen, onRequestClose: this.closeModal }, React.createElement(Settings_1.default, { parent: this, closeModal: this.closeModal })), React.createElement("div", { className: "container-fluid" }, React.createElement("div", { className: "row" }, React.createElement("div", { className: "col-lg-12" }, React.createElement("b", { style: { margin: 5 } }, "Scheduler"), React.createElement("b", null, React.createElement("button", { className: "btn btn-primary btn-large", style: { margin: 5 }, onClick: this.openModal }, "Open Player")), React.createElement("b", null, React.createElement("button", { className: "btn btn-primary btn-large", style: { margin: 5 }, onClick: this.openGalleryModal }, "Gallery")), React.createElement("b", null, React.createElement("button", { className: "btn btn-primary btn-large", style: { margin: 5 }, onClick: this.openSettingsModal }, "Settings")), React.createElement(semantic_ui_react_1.Segment, { basic: true }, React.createElement(semantic_ui_react_1.Form, null, React.createElement(semantic_ui_react_1.Form.Field, null, React.createElement("label", null, "Current Group"), React.createElement(semantic_ui_react_1.Dropdown, { placeholder: "Select Group", fluid: true, selection: true, onChange: function onChange(e, data) {
                    console.log({ data: data });
                    _this2.setState({ selectedGroup: data.value });
                }, options: groups })))), React.createElement(TimeScale_1.default, { selectedGroup: this.state.selectedGroup })))));
        }
    }]);

    return Scheduler;
}(React.Component);

exports.Scheduler = Scheduler;
var modalStyle = {
    overlay: {
        zIndex: 0,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
        // backgroundColor: "rgba(15, 15, 15, 0.75)"
    },
    content: {
        zIndex: -5,
        position: "absolute",
        top: "10px",
        left: "10px",
        right: "10px",
        bottom: "10px",
        border: "1px solid #ccc",
        // backgroundColor: "rgba(15, 15, 15, 0.95)",
        backgroundColor: "#EFEFEF",
        overflow: "auto",
        WebkitOverflowScrolling: "touch",
        borderRadius: "4px",
        outline: "none",
        padding: "20px"
    }
};
exports.default = Scheduler;