'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _reactHtml5video = require('react-html5video');

var _reactHtml5video2 = _interopRequireDefault(_reactHtml5video);

require('whatwg-fetch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReactDOMServer = require('react-dom/server');
var Parse = require('parse');
// Parse.initialize("ABCDEFG12345");
// Parse.serverURL = 'http://psign.iriosystems.com:1380/parse'
// /**
//  * Example "A", see results on the left-side
//  */
// var id = setInterval(function() {
//     if ( new Date().getSeconds() === 0 ) {
//         setInterval(onTheMinFuncA, delay);
//         onTheMinFuncA();
//         clearInterval(id);
//     }
// },1000);

/**
 * Example "B", see results on the right-side
 */

// /**
//  * Two equivalent functions, just for this example
//  */

// function onTheMinFuncA() {
//     var time = new Date().toTimeString();
//     var p = document.createElement('p');
//     p.innerHTML = time;
//     document.getElementById('a').appendChild(p)
// }


// idea, add two playlist items  at each tick, placing default item when there is nothing to display the beginning


var Player = function (_React$Component) {
    (0, _inherits3.default)(Player, _React$Component);

    function Player(props) {
        (0, _classCallCheck3.default)(this, Player);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Player.__proto__ || (0, _getPrototypeOf2.default)(Player)).call(this, props));

        _this.state = {
            scrollingText: "Nothing to show ... ",
            elapsed: 0,
            start: Date.now(),
            // videourl: "/upload?filename=signal.mp4",
            // playlist: ["/upload?filename=signal.mp4"],
            // defaultVideo: "/upload?filename=signal.mp4",
            playlistIndex: 0,
            title: "",
            currentTime: "12"
        };
        _this.tick = _this.tick.bind(_this);
        _this.getTimeSlot = _this.getTimeSlot.bind(_this);
        _this.loadSlot = _this.loadSlot.bind(_this);
        _this.onThehalfMinFunc = _this.onThehalfMinFunc.bind(_this);
        _this.getSettings = _this.getSettings.bind(_this);

        return _this;
    }

    (0, _createClass3.default)(Player, [{
        key: 'getTimeSlot',
        value: function getTimeSlot(date, hour, min, seconds) {
            var dateSelected = date;
            var duration = _moment2.default.duration();
            var min = min;
            var seconds = seconds;
            duration.add({ 'hours': hour });
            duration.add({ 'minutes': min });
            duration.add({ 'seconds': seconds });
            return dateSelected.add(duration);
        }
    }, {
        key: 'loadSlot',
        value: function loadSlot(date, hour, min, seconds) {
            var _this2 = this;

            var timeSlot = this.getTimeSlot(date, hour, min, seconds);

            fetch('/loadSlot?time=' + timeSlot.format()).then(function (response) {
                return response.json();
            }).then(function (video) {
                console.log('parsed video', video);
                var newPlaylist = [_this2.state.videourl]; //this.state.playlist;
                newPlaylist.push(video.video);
                // this.setState({ start: new Date(), title: video.title, scrollingText: video.scrolling_text, videourl: video.video, playlist: newPlaylist, currentVideo: video.video });
                // this.refs.video.load();
                // this.refs.video.play();
                _this2.setState({ nextvideo: video.video });
                console.log(_this2.state.nextvideo);
            }).catch(function (ex) {
                // var newPlaylist = this.state.playlist;
                // var newPlaylist = [this.state.videourl];
                // newPlaylist.push(this.state.defaultVideo);
                // // console.log('parsing failed', ex)
                // // loaddefaultvideo instead
                // // this.setState({ nextVideo: defaultVideo });
                // this.setState({ nextvideo: this.state.defaultVideo });

                // console.log(this.state.nextvideo);
                _this2.getSettings();
            });
        }
    }, {
        key: 'handleChange',
        value: function handleChange(event) {
            this.setState({ scrollingText: event.target.value });
        }
    }, {
        key: 'handleTitleChange',
        value: function handleTitleChange(event) {
            this.setState({ title: event.target.value });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this3 = this;

            // componentDidMount is called by react when the component 
            // has been rendered on the page. We can set the interval here:
            // this.loadSlot();
            var now = new Date();
            var delay = 30 * 1000; // 1 min in msec
            var start = delay - now.getSeconds() * 1000 + now.getMilliseconds();

            // setTimeout(() => {
            //     setInterval(this.onThehalfMinFunc, delay);
            //     console.log("calling half min ...");
            //     this.onThehalfMinFunc();
            // }, start);
            var id = setInterval(function () {
                if (new Date().getSeconds() === 0) {
                    setInterval(_this3.onThehalfMinFunc, delay);
                    _this3.onThehalfMinFunc();
                    clearInterval(id);
                }
            }, 1000);
        }
    }, {
        key: 'onThehalfMinFunc',
        value: function onThehalfMinFunc() {
            var _this4 = this;

            var time = new Date().toTimeString();
            // var p = document.createElement('p');
            // p.innerHTML = time;
            // document.getElementById('b').appendChild(p)
            this.setState({ currentTime: time });
            // console.log("half min ...", time);
            // console.log(this.state.currentTime);
            // if (this.timer)
            //     clearInterval(this.timer);    
            // //load next2 videos
            // this.timer = setInterval(this.tick, 25000);
            // eos/small.mp4
            //http://media.w3.org/2010/05/video/movie_300.mp4
            var lastVideo = this.state.videourl;
            this.setState({ start: new Date(), videourl: this.state.nextvideo }, function () {
                if (lastVideo != _this4.state.videourl) {
                    _this4.refs.video.load();
                    _this4.refs.video.play();
                }
            });

            this.tick();
        }
    }, {
        key: 'getSettings',
        value: function getSettings() {
            var _this5 = this;

            // fetch("/settings").then((response) => {
            //     return response.json()
            // }).then(k => {
            //     console.log("/settings", k);
            //     var videourl = "/upload?filename=" + k.defaultVideo;
            //     this.setState({
            //         settings: k, videourl, bannerurl: "/upload?filename=" + k.defaultBanner,
            //         nextvideo: videourl,
            //         playlist: [videourl],
            //     }, () => {
            //         // console.log("default:" +  this.state.videourl);
            //         this.refs.video.load();
            //         this.refs.video.pause();
            //         this.refs.video.play();
            //     });
            // }).catch(e => {

            // });
            var Settings = Parse.Object.extend("Settings");
            var query = new Parse.Query(Settings);
            query.find(null).then(function (settings) {
                var setting = settings[0];

                console.log({ settings: settings });
                var videourl = "/upload?filename=" + setting.get('defaultVideo');

                _this5.setState({
                    settings: {
                        defaultVideo: setting.get('defaultVideo'),
                        defaultBanner: setting.get('defaultBanner')
                    }, videourl: videourl, bannerurl: "/upload?filename=" + setting.get('defaultBanner'),
                    playlist: [videourl]
                }, function () {
                    // console.log("default:" +  this.state.videourl);
                    _this5.refs.video.load();
                    _this5.refs.video.pause();
                    _this5.refs.video.play();
                });
            });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {

            // This method is called immediately before the component is removed
            // from the page and destroyed. We can clear the interval here:

            clearInterval(this.timer);
        }
    }, {
        key: 'tick',
        value: function tick() {
            var tickDate = new Date();
            var otherDate = new Date();
            // This function is called every 1s. It updates the 
            // elapsed counter. Calling setState causes the component to be re-rendered

            // this.setState({ elapsed: new Date() - this.state.start });
            // var elapsed = Math.round(this.state.elapsed / 100);

            // // This will give a number with one digit after the decimal dot (xx.x):
            // var seconds = (elapsed / 10).toFixed(1);
            // if (seconds == 25) {
            //load next video
            console.log('loading next videos ... @' + tickDate.toTimeString());
            var date = tickDate.setHours(0, 0, 0, 0);
            // console.log
            // }
            // http://techslides.com/demos/sample-vid
            this.loadSlot((0, _moment2.default)(date), otherDate.getHours(), otherDate.getMinutes(), (Math.floor(otherDate.getSeconds() / 30) + 1) * 30);
        }
    }, {
        key: 'render',
        value: function render() {
            var elapsed = Math.round(this.state.elapsed / 100);

            // This will give a number with one digit after the decimal dot (xx.x):
            var seconds = (elapsed / 10).toFixed(1);
            var now = (0, _moment2.default)().format("HH:mm A");
            // console.log(now);

            return _react2.default.createElement('div', null, _react2.default.createElement('h3', { style: { color: "red" } }, 'Player '), _react2.default.createElement('div', { id: 'calendar', align: 'center', style: { width: "100%", height: "100%", position: "relative", backgroundColor: "lightgray" } }, _react2.default.createElement('img', { style: { color: "yellow", backgroundColor: "black", fontSize: 30, position: "absolute", top: 0, right: 0, height: 80, width: "100%" }, src: this.state.bannerurl }), _react2.default.createElement(_reactHtml5video2.default, { style: { width: "100%", height: "500px" }, autoPlay: true, loop: true, ref: 'video',
                poster: 'https://camo.githubusercontent.com/e87d73e52109c623ea0e315993ab8b5f037fb00f/687474703a2f2f6d6465727269636b2e6769746875622e696f2f72656163742d68746d6c35766964656f2f6578616d706c652e706e673f763d31',
                onCanPlayThrough: function onCanPlayThrough() {
                    // Do stuff
                } }, _react2.default.createElement('source', { src: this.state.videourl, type: 'video/mp4' })), _react2.default.createElement('marquee', { style: { color: "yellow", backgroundColor: "black", fontSize: 30, position: "absolute", bottom: 0, right: 80 }, behavior: 'scroll', direction: 'left' }, this.state.scrollingText), _react2.default.createElement('div', { style: { color: "red", backgroundColor: "teal", fontSize: 30, position: "absolute", paddingRight: 8, paddingLeft: 8, bottom: 0, right: 0 } }, ' ', now)), this.currentTime, _react2.default.createElement('button', { onClick: this.props.parent.closeModal }, 'Close'));
        }
    }]);

    return Player;
}(_react2.default.Component);

exports.default = Player;