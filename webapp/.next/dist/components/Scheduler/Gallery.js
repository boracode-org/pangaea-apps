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
var react_edit_inline_1 = require("../libs/react-edit-inline");
// import Box, { ScrollView, Page, Container } from "react-layout-components"; // https://github.com/rofrischmann/react-layout-components/issues/27
var react_dropzone_component_1 = require("react-dropzone-component");
var Constants_1 = require("../Constants");
var ReactDOMServer = require("react-dom/server");
var react_native_web_1 = require("react-native-web");
var Database_1 = require("../Database");
var componentConfig = {
    iconFiletypes: [".mp4"],
    showFiletypeIcon: true,
    postUrl: Constants_1.default.SERVER_URL + "/upload"
    // previewTemplate: ReactDOMServer.renderToStaticMarkup(<div/>)
    //   <div className="dz-preview dz-file-preview">
    //     <div className="dz-details">
    //       <div className="dz-filename">
    //         <span data-dz-name="true" />
    //       </div>
    //       <img data-dz-thumbnail="true" />
    //     </div>
    //     <div className="dz-progress">
    //       <span className="dz-upload" data-dz-uploadprogress="true" />
    //     </div>
    //     <div className="dz-success-mark">
    //       <span>✔</span>
    //     </div>
    //     <div className="dz-error-mark">
    //       <span>✘</span>
    //     </div>
    //     <div className="dz-error-message">
    //       <span data-dz-errormessage="true" />
    //     </div>
    //   </div>
    // )
};
// idea, add two playlist items  at each tick, placing default item when there is nothing to display the beginning

var Gallery = function (_React$Component) {
    (0, _inherits3.default)(Gallery, _React$Component);

    function Gallery(props) {
        (0, _classCallCheck3.default)(this, Gallery);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Gallery.__proto__ || (0, _getPrototypeOf2.default)(Gallery)).call(this, props));

        _this.state = {
            galleryItems: [],
            playlist: {},
            loading: false
        };
        _this.updateVideoList = function () {
            return __awaiter(_this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                var _this2 = this;

                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                this.setState({ loading: true });
                                setTimeout(function () {
                                    return __awaiter(_this2, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                                        var ext, galleryItems;
                                        return _regenerator2.default.wrap(function _callee$(_context) {
                                            while (1) {
                                                switch (_context.prev = _context.next) {
                                                    case 0:
                                                        ext = "";

                                                        if (this.props.types) {
                                                            ext = "?extensions=" + this.props.types;
                                                        }
                                                        // var galleryItems = await fetch(Constants.SERVER_URL + "/gallery" + ext).then(response => {
                                                        //   console.log({ response });
                                                        //   return response.json();
                                                        // });
                                                        _context.next = 4;
                                                        return Database_1.Database.getGalleryItems();

                                                    case 4:
                                                        galleryItems = _context.sent;

                                                        console.log({ galleryItems: galleryItems });
                                                        console.log("/gallery", galleryItems);
                                                        this.setState({ galleryItems: galleryItems, loading: false });

                                                    case 8:
                                                    case "end":
                                                        return _context.stop();
                                                }
                                            }
                                        }, _callee, this);
                                    }));
                                }, 300);

                            case 2:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));
        };
        _this.changeName = function (item, valueMessage) {
            return __awaiter(_this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                var value, vidIndex;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                value = valueMessage["message"];

                                console.log("changeName", {
                                    item: item,
                                    valueMessage: valueMessage,
                                    value: value,
                                    galleryItems: this.state.galleryItems
                                });
                                vidIndex = this.state.galleryItems.findIndex(function (k, i, arr) {
                                    return k.name == item.name;
                                });

                                console.log("changeName", { item: item, vidIndex: vidIndex });
                                _context3.next = 6;
                                return Database_1.Database.changeMediaTitle(item, value);

                            case 6:
                                this.updateVideoList();
                            // fetch(Constants.SERVER_URL + "/changeName" + "?oldName=" + item.name + "&newName=" + value)
                            //   .then(response => {
                            //     return response.json();
                            //   })
                            //   .then(items => {
                            //     console.log("/gallery", items);
                            //     this.setState({ galleryItems: items });
                            //   })
                            //   .catch(e => {});

                            case 7:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));
        };
        _this.eventHandlers = {
            addedfile: function addedfile(file) {
                return __awaiter(_this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                    var newPlaylist, videourl;
                    return _regenerator2.default.wrap(function _callee4$(_context4) {
                        while (1) {
                            switch (_context4.prev = _context4.next) {
                                case 0:
                                    _context4.prev = 0;
                                    _context4.next = 3;
                                    return Database_1.Database.addMedia(file);

                                case 3:
                                    newPlaylist = this.state.playlist;
                                    videourl = "/upload?filename=" + file.name;

                                    newPlaylist = [videourl];
                                    // this.setState({ playlist: newPlaylist });
                                    // this.setState({ start: new Date(), videourl: videourl, playlist: newPlaylist, currentVideo: videourl });
                                    // this.refs.video.load();
                                    // this.refs.video.play();
                                    // this.setState({})
                                    this.updateVideoList();
                                    _context4.next = 12;
                                    break;

                                case 9:
                                    _context4.prev = 9;
                                    _context4.t0 = _context4["catch"](0);

                                    alert("Attempted to upload invalid file");

                                case 12:
                                case "end":
                                    return _context4.stop();
                            }
                        }
                    }, _callee4, this, [[0, 9]]);
                }));
            },
            complete: function complete(file) {
                var uploadfilename = file.name; // JSON.parse(file.xhr.response).name;
                console.log("DropzoneComponent complete", uploadfilename);
                var newPlaylist = _this.state.playlist;
                var videourl = "/upload?filename=" + uploadfilename;
                newPlaylist = [videourl];
                // this.setState({ playlist: newPlaylist });
                // this.setState({ start: new Date(), videourl: videourl, playlist: newPlaylist, currentVideo: videourl });
                // this.refs.video.load();
                // this.refs.video.play();
                // this.setState({})
                _this.updateVideoList();
            }
        };
        _this.changeName = _this.changeName.bind(_this);
        _this.deleteVideo = _this.deleteVideo.bind(_this);
        return _this;
    }

    (0, _createClass3.default)(Gallery, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            this.updateVideoList();
            // componentDidMount is called by react when the component
            // has been rendered on the page. We can set the interval here:
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {}
    }, {
        key: "deleteVideo",
        value: function deleteVideo(item) {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                console.log("delete", { item: item });
                                _context5.prev = 1;
                                _context5.next = 4;
                                return Database_1.Database.deleteMedia(item.objectId);

                            case 4:
                                alert("Successfully deleted Media: " + item.title);
                                this.updateVideoList();
                                _context5.next = 11;
                                break;

                            case 8:
                                _context5.prev = 8;
                                _context5.t0 = _context5["catch"](1);

                                alert("Failed to delete media: " + _context5.t0.message);

                            case 11:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[1, 8]]);
            })
            // fetch(Constants.SERVER_URL + "/deleteVideo" + "?name=" + item.name)
            //   .then(response => {
            //     return response.json();
            //   })
            //   .then(items => {
            //     console.log("/gallery", items);
            //     this.setState({ galleryItems: items });
            //   })
            //   .catch(e => {});
            );
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            return React.createElement(react_native_web_1.View, { style: {
                    backgroundColor: "white",
                    flex: 1,
                    width: "100%",
                    padding: 5,
                    borderRadius: 5
                } }, React.createElement(react_native_web_1.View, { style: {
                    flexDirection: "row",
                    width: "100%",
                    flex: 1,
                    backgroundColor: "lightgray",
                    justifyContent: "space-between",
                    marginBottom: 10,
                    padding: 5
                } }, React.createElement(react_native_web_1.Text, { style: {
                    color: "black",
                    height: 40,
                    fontWeight: "bold",
                    fontSize: 20,
                    textAlign: "center",
                    verticalAlign: "center",
                    paddingTop: 10
                } }, "Gallery".toUpperCase()), React.createElement(react_native_web_1.View, { style: { margin: 5 } }, React.createElement(react_native_web_1.Button, { title: "Close", onPress: this.props.closeModal }))), React.createElement(react_native_web_1.ScrollView, { style: { height: 500, backgroundColor: "#FAFAFA" } }, React.createElement(react_native_web_1.View, null), React.createElement(react_native_web_1.View, { borderWidth: "10", borderColor: "red", borderTop: true, borderRight: true, padding: "10" }, React.createElement(react_native_web_1.View, { style: {
                    flex: 1,
                    flexWrap: "wrap",
                    flexDirection: "row",
                    justifyContent: "flex-start"
                } }, this.state.loading ? React.createElement(react_native_web_1.Text, { style: {
                    flex: 1,
                    justifyContent: "center",
                    verticalAlign: "center",
                    textAlign: "center",
                    alignContent: "center"
                } }, "Loading Gallery ... please wait...") : null, this.state.galleryItems.length > 0 ? this.state.galleryItems.map(function (k, i) {
                return React.createElement(react_native_web_1.View, { key: i, column: true, style: {
                        width: 150,
                        backgroundColor: "lightgrey",
                        marginBottom: 10,
                        marginRight: 10,
                        padding: 5
                    }, onClick: function onClick() {
                        if (_this3.props.onSelect) {
                            _this3.props.onSelect(_this3.state.galleryItems[i]);
                        }
                    } }, React.createElement(react_native_web_1.View, { flex: "5" }, React.createElement("img", { src: k.video_thumbnail ? k.video_thumbnail.url : "" /*Constants.SERVER_URL + "/upload/?filename=" + k.thumbnail*/, width: "140", height: "100" })), React.createElement(react_native_web_1.View, { flex: "1", style: {
                        backgroundColor: "white",
                        fontSize: 10,
                        wordWrap: "break-word"
                    } }, React.createElement("b", null, "Type - Size: \xA0 \xA0 "), React.createElement(react_native_web_1.Text, null, k.type, " - ", k.video_size)), React.createElement(react_native_web_1.View, { flex: "2", style: {
                        backgroundColor: "white",
                        fontSize: 10,
                        wordWrap: "break-word",
                        width: "100%"
                    } }, React.createElement("b", null, "Filename: \xA0 \xA0 "), React.createElement(react_edit_inline_1.default, { activeClassName: "editing", text: k.title, paramName: "message", onSelect: function onSelect() {}, change: function change(e) {
                        _this3.changeName(k, e);
                    }, style: {
                        backgroundColor: "gray",
                        color: "white",
                        // minWidth: 150,
                        display: "inline-block",
                        margin: 0,
                        padding: 10,
                        fontSize: 15,
                        outline: 0,
                        border: 0
                    } })), React.createElement(react_native_web_1.View, { flex: "1", style: {
                        backgroundColor: "white",
                        fontSize: 10,
                        wordWrap: "break-word",
                        width: "100%"
                    } }, React.createElement(react_native_web_1.Button, { title: "Delete", color: "red", style: { left: 20 }, onPress: function onPress() {
                        return _this3.deleteVideo(k);
                    } })));
            }) : React.createElement(react_native_web_1.Text, null, "Sorry there are no items in your gallery, add some below")))), React.createElement(react_native_web_1.View, { style: {
                    margin: 5,
                    height: 200,
                    border: "1px solid gray",
                    padding: 5,
                    backgroundColor: "lightgray"
                } }, React.createElement(react_dropzone_component_1.default, { djsConfig: {
                    autoProcessQueue: false,
                    previewTemplate: ReactDOMServer.renderToStaticMarkup(React.createElement("div", null))
                }, config: componentConfig, eventHandlers: this.eventHandlers })), React.createElement(react_native_web_1.Button, { title: "Close", onPress: this.props.closeModal, style: { margin: 5 } }));
        }
    }]);

    return Gallery;
}(React.Component);

exports.default = Gallery;