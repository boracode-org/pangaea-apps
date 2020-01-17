"use strict";

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault2(_assign);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault2(_getPrototypeOf);

var _setPrototypeOf = require("babel-runtime/core-js/object/set-prototype-of");

var _setPrototypeOf2 = _interopRequireDefault2(_setPrototypeOf);

var _create = require("babel-runtime/core-js/object/create");

var _create2 = _interopRequireDefault2(_create);

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault2(_typeof2);

var _defineProperty = require("babel-runtime/core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault2(_defineProperty);

function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "react", "react-dom", "./lib/ScriptCache", "./lib/GoogleApi"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("react"), require("react-dom"), require("./lib/ScriptCache"), require("./lib/GoogleApi"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.reactDom, global.ScriptCache, global.GoogleApi);
    global.GoogleApiComponent = mod.exports;
  }
})(undefined, function (exports, _react, _reactDom, _ScriptCache, _GoogleApi) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.wrapper = undefined;

  var _react2 = _interopRequireDefault(_react);

  var _reactDom2 = _interopRequireDefault(_reactDom);

  var _GoogleApi2 = _interopRequireDefault(_GoogleApi);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        (0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
    }

    subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var defaultMapConfig = {};
  var defaultCreateCache = function defaultCreateCache(options) {
    options = options || {};
    var apiKey = options.apiKey;
    var libraries = options.libraries || ["places"];
    var version = options.version || "3.24";
    var language = options.language || "en";

    return (0, _ScriptCache.ScriptCache)({
      google: (0, _GoogleApi2.default)({
        apiKey: apiKey,
        language: language,
        libraries: libraries,
        version: version
      })
    });
  };

  var wrapper = exports.wrapper = function wrapper(options) {
    return function (WrappedComponent) {
      var apiKey = options.apiKey;
      var libraries = options.libraries || ["places"];
      var version = options.version || "3";
      var createCache = options.createCache || defaultCreateCache;

      var Wrapper = function (_React$Component) {
        _inherits(Wrapper, _React$Component);

        function Wrapper(props, context) {
          _classCallCheck(this, Wrapper);

          var _this = _possibleConstructorReturn(this, (Wrapper.__proto__ || (0, _getPrototypeOf2.default)(Wrapper)).call(this, props, context));

          _this.scriptCache = createCache(options);
          _this.scriptCache.google.onLoad(_this.onLoad.bind(_this));

          _this.state = {
            loaded: false,
            map: null,
            google: null
          };
          return _this;
        }

        _createClass(Wrapper, [{
          key: "onLoad",
          value: function onLoad(err, tag) {
            if (typeof window !== "undefined") {
              this._gapi = window.google;
            }

            this.setState({ loaded: true, google: this._gapi });
          }
        }, {
          key: "render",
          value: function render() {
            if (typeof window !== "undefined") {
              var props = (0, _assign2.default)({}, this.props, {
                loaded: this.state.loaded,
                google: window.google
              });

              return _react2.default.createElement("div", null, _react2.default.createElement(WrappedComponent, props), _react2.default.createElement("div", { ref: "map" }));
            }
            return null;
          }
        }]);

        return Wrapper;
      }(_react2.default.Component);

      return Wrapper;
    };
  };

  exports.default = wrapper;
});