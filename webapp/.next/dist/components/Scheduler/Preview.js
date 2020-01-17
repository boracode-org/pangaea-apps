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
var moment = require("moment");
var react_native_web_1 = require("react-native-web");
// import {
// //   default as Video,
// Video,
//   Controls,
//   Play,
//   Mute,
//   Seek,
//   Fullscreen,
//   Time,
//   Overlay
// } from "react-html5video";
// import "video-react/dist/video-react.css"; // import css
// import { Player } from "video-react/dist/video-react";
var react_player_1 = require("react-player");
require("whatwg-fetch");
var Gallery_1 = require("./Gallery");
var Database_1 = require("../Database");
var DropzoneComponent = require("react-dropzone-component");
var ReactDOMServer = require("react-dom/server");
var Modal = require("react-modal");
var Parse = require("parse");
// Parse.initialize("ABCDEFG12345");
// Parse.serverURL = "http://psign.iriosystems.com:1380/parse";

var Preview = function (_React$Component) {
    (0, _inherits3.default)(Preview, _React$Component);

    function Preview(props) {
        (0, _classCallCheck3.default)(this, Preview);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Preview.__proto__ || (0, _getPrototypeOf2.default)(Preview)).call(this, props));

        _this.state = {
            scrollingText: "Enter some text below to see it scroll",
            elapsed: 0,
            start: Date.now(),
            // videourl: "/upload?filename=signal.mp4",
            // playlist: ["/upload?filename=signal.mp4"],
            playlistIndex: 0,
            title: "",
            galleryOpen: false,
            isDefaultVideo: true
        };
        _this.closeModal = _this.closeModal.bind(_this);
        _this.openModal = _this.openModal.bind(_this);
        _this.handleChange = _this.handleChange.bind(_this);
        _this.handleTitleChange = _this.handleTitleChange.bind(_this);
        _this.tick = _this.tick.bind(_this);
        _this.saveEvent = _this.saveEvent.bind(_this);
        _this.getTimeSlot = _this.getTimeSlot.bind(_this);
        _this.loadSlot = _this.loadSlot.bind(_this);
        _this.select = _this.select.bind(_this);
        _this.getSettings = _this.getSettings.bind(_this);
        return _this;
    }

    (0, _createClass3.default)(Preview, [{
        key: "getSettings",
        value: function getSettings() {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var setting, videourl;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                _context.next = 3;
                                return Database_1.Database.getSettings();

                            case 3:
                                setting = _context.sent;
                                videourl = setting.defaultVideo.url; //Constants.SERVER_URL + "/upload?filename=" + setting.get("defaultVideo");

                                this.setState({
                                    settings: {
                                        defaultVideo: setting.defaultVideo,
                                        defaultBanner: setting.defaultBanner
                                    },
                                    videourl: videourl,
                                    bannerurl: setting.defaultBanner.url,
                                    playlist: [videourl],
                                    playing: true
                                }, function () {
                                    // console.log("default:" +  this.state.videourl);
                                    //   this.refs.video.load();
                                    //   this.refs.video.pause();
                                    //   this.refs.video.play();
                                });
                                _context.next = 11;
                                break;

                            case 8:
                                _context.prev = 8;
                                _context.t0 = _context["catch"](0);

                                alert("Failed to load settings..." + _context.t0.message);

                            case 11:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 8]]);
            }));
        }
    }, {
        key: "select",
        value: function select(file) {
            var _this2 = this;

            console.log("selected: ", file);
            this.closeModal();
            // var uploadfilename = file.file.url; // JSON.parse(file.xhr.response).name;
            // // console.log('DropzoneComponent complete', uploadfilename);
            // var newPlaylist = this.state.playlist;
            var videourl = file.file.url; //Constants.SERVER_URL + "/upload?filename=" + uploadfilename;
            // newPlaylist = [videourl];
            // // this.setState({ playlist: newPlaylist });
            // this.setState({ start: new Date(), videourl: videourl, playlist: newPlaylist, currentVideo: videourl });
            // this.refs.video.load();
            // this.refs.video.play();
            var newPlaylist = [videourl];
            this.setState({
                start: new Date(),
                videourl: videourl,
                playlist: newPlaylist,
                isDefaultVideo: false,
                settings: this.state.settings,
                currentVideo: videourl,
                file: file
            }, function () {
                // this.refs.video.load();
                // this.refs.video.pause();
                // this.refs.video.play();
                console.log("videourl: ", _this2.state.videourl);
            });
            // this.refs.video.stop();
        }
    }, {
        key: "closeModal",
        value: function closeModal() {
            this.setState({ galleryOpen: false });
        }
    }, {
        key: "openModal",
        value: function openModal() {
            this.setState({ galleryOpen: true });
        }
    }, {
        key: "getTimeSlot",
        value: function getTimeSlot() {
            var dateSelected = moment(this.props.dateSelected.format && this.props.dateSelected.format() || this.props.dateSelected);
            var duration = moment.duration();
            var min = this.props.timeSelected[0].split(":")[0];
            var seconds = this.props.timeSelected[0].split(":")[1];
            console.log("hours", this.props.hourSelected);
            console.log("minutes", min);
            console.log("seconds", seconds);
            duration.add({ hours: this.props.hourSelected });
            duration.add({ minutes: min });
            duration.add({ seconds: seconds });
            return dateSelected.add(duration);
        }
    }, {
        key: "loadSlot",
        value: function loadSlot() {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                var timeSlotT, timeSlot, newPlaylist;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                timeSlotT = this.getTimeSlot();

                                console.log("timeSlot", { timeSlotT: timeSlotT });
                                _context2.prev = 2;
                                _context2.next = 5;
                                return Database_1.Database.loadSlot(timeSlotT.toDate(), this.props.selectedGroup);

                            case 5:
                                timeSlot = _context2.sent;

                                if (timeSlot) {
                                    _context2.next = 9;
                                    break;
                                }

                                alert("No Timeslot!");
                                return _context2.abrupt("return", this.getSettings());

                            case 9:
                                console.log("got media", timeSlot);
                                newPlaylist = [timeSlot.video];

                                this.setState({
                                    start: new Date(),
                                    title: timeSlot.title,
                                    scrollingText: timeSlot.scrolling_text,
                                    settings: this.state.settings,
                                    isDefaultVideo: false,
                                    videourl: timeSlot.video.file.url,
                                    playlist: newPlaylist,
                                    currentVideo: timeSlot.video,
                                    file: timeSlot.video //{ duration: timeSlot.duration }
                                });
                                console.log(this.state.videourl);
                                _context2.next = 18;
                                break;

                            case 15:
                                _context2.prev = 15;
                                _context2.t0 = _context2["catch"](2);
                                return _context2.abrupt("return", this.getSettings());

                            case 18:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[2, 15]]);
            })
            // fetch(Constants.SERVER_URL + "/loadSlot?time=" + timeSlot.format())
            //   .then(response => {
            //     return response.json();
            //   })
            //   .then(video => {
            //   })
            //   .catch(ex => {
            //     // console.log('parsing failed', ex)
            //     this.getSettings();
            //   });
            );
        }
    }, {
        key: "saveEvent",
        value: function saveEvent() {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                var timeSlot, file;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                timeSlot = this.getTimeSlot();

                                console.log("timeSlot", moment(timeSlot));
                                file = this.state.file;

                                console.log("saveEvent", { file: file });

                                if (!file) {
                                    _context3.next = 14;
                                    break;
                                }

                                _context3.prev = 5;
                                _context3.next = 8;
                                return Database_1.Database.saveSlot(file, timeSlot, this.state.title, this.state.scrolling_text, this.props.selectedGroup);

                            case 8:
                                this.props.parent.closeModal(); // We done
                                _context3.next = 14;
                                break;

                            case 11:
                                _context3.prev = 11;
                                _context3.t0 = _context3["catch"](5);

                                alert("Failed to save slot: " + _context3.t0.message);

                            case 14:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[5, 11]]);
            }));
        }
    }, {
        key: "handleChange",
        value: function handleChange(event) {
            this.setState({ scrollingText: event.target.value });
        }
    }, {
        key: "handleTitleChange",
        value: function handleTitleChange(event) {
            this.setState({ title: event.target.value });
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            // componentDidMount is called by react when the component
            // has been rendered on the page. We can set the interval here:
            this.loadSlot();
            this.timer = setInterval(this.tick, 1000);
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            // This method is called immediately before the component is removed
            // from the page and destroyed. We can clear the interval here:
            clearInterval(this.timer);
        }
    }, {
        key: "tick",
        value: function tick() {
            // This function is called every 50 ms. It updates the
            // elapsed counter. Calling setState causes the component to be re-rendered
            this.setState({ elapsed: new Date() - this.state.start });
            var elapsed = Math.round(this.state.elapsed / 100);
            // This will give a number with one digit after the decimal dot (xx.x):
            var seconds = (elapsed / 10).toFixed(1);
            // http://techslides.com/demos/sample-vid
            // if (seconds >= 30) {
            //     // eos/small.mp4
            //     //http://media.w3.org/2010/05/video/movie_300.mp4
            //     this.setState({ start: new Date(), videourl: this.state.playlist[(this.state.playlistIndex++) % this.state.playlist.length] });
            //     this.refs.video.load();
            //     this.refs.video.play();
            // }
        }
    }, {
        key: "render",
        value: function render() {
            var elapsed = Math.round(this.state.elapsed / 100);
            // This will give a number with one digit after the decimal dot (xx.x):
            var seconds = (elapsed / 10).toFixed(1);
            var now = moment().format("HH:mm A");
            // console.log(now);
            return React.createElement(react_native_web_1.View, null, React.createElement("h1", null, "Settings for ", this.state.title, " Ad at ", this.props.hourSelected, ":", this.props.timeSelected[0], "-", " ", this.props.hourSelected, ": ", this.props.timeSelected[1], " on"), React.createElement("h3", { style: { color: "red" } }, "Preview"), React.createElement("center", null, React.createElement(react_native_web_1.View, { id: "calendar", align: "center", style: {
                    width: 640,
                    height: 400,
                    position: "relative",
                    backgroundColor: "lightgray",
                    lignContent: "center",
                    flex: 1
                } }, React.createElement("img", { style: {
                    color: "yellow",
                    backgroundColor: "black",
                    fontSize: 30,
                    position: "absolute",
                    top: 0,
                    right: 0,
                    height: 80,
                    width: "100%"
                }, src: this.state.bannerurl }), React.createElement(react_player_1.default, { style: { width: "100%", height: 400 }, autoPlay: true, loop: true, ref: "video", playing: true, playsinline: true, poster: "https://camo.githubusercontent.com/e87d73e52109c623ea0e315993ab8b5f037fb00f/687474703a2f2f6d6465727269636b2e6769746875622e696f2f72656163742d68746d6c35766964656f2f6578616d706c652e706e673f763d31", url: this.state.videourl }), React.createElement("marquee", { style: {
                    color: "yellow",
                    backgroundColor: "black",
                    fontSize: 30,
                    position: "absolute",
                    bottom: 0,
                    right: 80
                }, behavior: "scroll", direction: "left" }, this.state.scrollingText), React.createElement("div", { style: {
                    color: "red",
                    backgroundColor: "teal",
                    fontSize: 30,
                    position: "absolute",
                    paddingRight: 8,
                    paddingLeft: 8,
                    bottom: 0,
                    right: 0
                } }, " ", now))), React.createElement("h3", null, "Preview video started ", React.createElement("b", null, seconds, "seconds"), " ago."), React.createElement("p", null, React.createElement("b", null, "Title")), React.createElement("textarea", { onChange: this.handleTitleChange, value: this.state.title, ref: "title", rows: 1, style: { width: "100%" } }), React.createElement("p", null, React.createElement("b", null, "Video (Current:", this.state.isDefaultVideo ? "Default" : this.state.videourl, ")", " ")), React.createElement(react_native_web_1.View, { style: { flex: 1, flexDirection: "row" } }, React.createElement("b", { style: { margin: 5 } }, React.createElement(react_native_web_1.Button, { title: "Pick An Ad from Gallery", onPress: this.openModal })), React.createElement("b", { style: { margin: 5, width: 100 } }, React.createElement(react_native_web_1.Button, { title: "Save", color: "darkgreen", onPress: this.saveEvent })), React.createElement("b", { style: { margin: 5, width: 100 } }, React.createElement(react_native_web_1.Button, { title: "Cancel", onPress: this.props.parent.closeModal }))), React.createElement(Modal, { style: modalStyle, isOpen: this.state.galleryOpen, onRequestClose: this.closeModal }, React.createElement(Gallery_1.default, { onSelect: this.select, closeModal: this.closeModal })));
        }
    }]);

    return Preview;
}(React.Component);
//  eventHandlers={eventHandlers}
//djsConfig={djsConfig}


var modalStyle = {
    overlay: {
        // zIndex: -1,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 15, 15, 1)"
    },
    content: {
        // zIndex: -5,
        position: "absolute",
        top: "10px",
        left: "10px",
        right: "10px",
        bottom: "10px",
        border: "1px solid #ccc",
        backgroundColor: "rgba(15, 15, 15, 1)",
        overflow: "auto",
        WebkitOverflowScrolling: "touch",
        borderRadius: "4px",
        outline: "none",
        padding: "20px"
    }
};
exports.default = Preview;