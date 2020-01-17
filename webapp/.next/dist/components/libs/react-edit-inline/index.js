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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = require("prop-types");
function selectInputText(element) {
    element.setSelectionRange(0, element.value.length);
}

var InlineEdit = function (_React$Component) {
    (0, _inherits3.default)(InlineEdit, _React$Component);

    function InlineEdit() {
        (0, _classCallCheck3.default)(this, InlineEdit);

        var _this = (0, _possibleConstructorReturn3.default)(this, (InlineEdit.__proto__ || (0, _getPrototypeOf2.default)(InlineEdit)).apply(this, arguments));

        _this.state = {
            editing: _this.props.editing,
            text: _this.props.text,
            minLength: _this.props.minLength,
            maxLength: _this.props.maxLength
        };
        _this.startEditing = function (e) {
            if (_this.props.stopPropagation) {
                e.stopPropagation();
            }
            _this.setState({ editing: true, text: _this.props.text });
        };
        _this.finishEditing = function () {
            if (_this.isInputValid(_this.state.text) && _this.props.text != _this.state.text) {
                _this.commitEditing();
            } else if (_this.props.text === _this.state.text || !_this.isInputValid(_this.state.text)) {
                _this.cancelEditing();
            }
        };
        _this.cancelEditing = function () {
            _this.setState({ editing: false, text: _this.props.text });
        };
        _this.commitEditing = function () {
            _this.setState({ editing: false, text: _this.state.text });
            var newProp = {};
            newProp[_this.props.paramName] = _this.state.text;
            _this.props.change(newProp);
        };
        _this.clickWhenEditing = function (e) {
            if (_this.props.stopPropagation) {
                e.stopPropagation();
            }
        };
        _this.isInputValid = function (text) {
            return text.length >= _this.state.minLength && text.length <= _this.state.maxLength;
        };
        _this.keyDown = function (event) {
            if (event.keyCode === 13) {
                _this.finishEditing();
            } else if (event.keyCode === 27) {
                _this.cancelEditing();
            }
        };
        _this.textChanged = function (event) {
            _this.setState({
                text: event.target.value.trim()
            });
        };
        return _this;
    }

    (0, _createClass3.default)(InlineEdit, [{
        key: "componentWillMount",
        value: function componentWillMount() {
            this.isInputValid = this.props.validate || this.isInputValid;
            // Warn about deprecated elements
            if (this.props.element) {
                console.warn('`element` prop is deprecated: instead pass editingElement or staticElement to InlineEdit component');
            }
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {
            var isTextChanged = nextProps.text !== this.props.text;
            var isEditingChanged = nextProps.editing !== this.props.editing;
            var nextState = {};
            if (isTextChanged) {
                nextState.text = nextProps.text;
            }
            if (isEditingChanged) {
                nextState.editing = nextProps.editing;
            }
            if (isTextChanged || isEditingChanged) {
                this.setState(nextState);
            }
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps, prevState) {
            var inputElem = ReactDOM.findDOMNode(this.refs.input);
            if (this.state.editing && !prevState.editing) {
                inputElem.focus();
                selectInputText(inputElem);
            } else if (this.state.editing && prevProps.text != this.props.text) {
                this.finishEditing();
            }
        }
    }, {
        key: "render",
        value: function render() {
            if (this.props.isDisabled) {
                var Element = this.props.element || this.props.staticElement;
                return React.createElement(Element, { className: this.props.className, style: this.props.style }, this.state.text || this.props.placeholder);
            } else if (!this.state.editing) {
                var _Element = this.props.element || this.props.staticElement;
                return React.createElement(_Element, { className: this.props.className, onClick: this.startEditing, tabIndex: this.props.tabIndex, style: this.props.style }, this.state.text || this.props.placeholder);
            } else {
                var _Element2 = this.props.element || this.props.editingElement;
                return React.createElement(_Element2, { onClick: this.clickWhenEditing, onKeyDown: this.keyDown, onBlur: this.finishEditing, className: this.props.activeClassName, placeholder: this.props.placeholder, defaultValue: this.state.text, onChange: this.textChanged, style: this.props.style, ref: "input" });
            }
        }
    }]);

    return InlineEdit;
}(React.Component);

InlineEdit.defaultProps = {
    minLength: 1,
    maxLength: 256,
    editingElement: 'input',
    staticElement: 'span',
    tabIndex: 0,
    isDisabled: false,
    editing: false
};
exports.default = InlineEdit;