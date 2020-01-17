"use strict";

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

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
var react_edit_inline_1 = require("../components/libs/react-edit-inline");
var mobx_1 = require("mobx");
var mobx_react_1 = require("mobx-react");
var ReactDOM = require("react-dom");
// if (typeof window === 'undefined') {
//   global.window = {document:{createElement:()=>{}}}
//   global.document = {}
// }
var index_1 = require("../components/libs/google-maps-react/index"); //"../libraries/google-maps-react";

var _require = require("../components/libs/google-maps-react/index"),
    Polyline = _require.Polyline;
// import Map from "google-maps-react-irio";


var index_2 = require("../components/libs/google-maps-react/index");
// import * as Parse from "parse";
var Database_1 = require("../components/Database");
var semantic_ui_react_1 = require("semantic-ui-react");
// Parse.initialize("ABCDEFG12345");
// Parse.serverURL = "http://psign.iriosystems.com:1380/parse";
function round(value, decimals) {
    return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}
exports.round = round;
function time(d) {
    var h = (d.getHours() < 10 ? "0" : "") + d.getHours(),
        m = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
    return h + ":" + m;
}

var _TestGoogleMaps = function (_React$Component) {
    (0, _inherits3.default)(_TestGoogleMaps, _React$Component);

    function _TestGoogleMaps() {
        (0, _classCallCheck3.default)(this, _TestGoogleMaps);

        var _this = (0, _possibleConstructorReturn3.default)(this, (_TestGoogleMaps.__proto__ || (0, _getPrototypeOf2.default)(_TestGoogleMaps)).apply(this, arguments));

        _this.markers = [];
        _this.onMarkerClick = function (props, marker, e) {
            console.log("marker clicked", { marker: marker, props: props, e: e });
            _this.setState({
                selectedPlace: props,
                activeMarker: marker,
                showingInfoWindow: true
            });
        };
        _this.state = {
            activeMarker: null,
            selectedPlace: {
                name: "Cool",
                route: null
            },
            device: null,
            showingInfoWindow: false
        };
        // onClick={this.onMarkerClick}
        // initialCenter={{
        //   lat: 0.347596,
        //   lng: 32.58252
        // }}
        _this.clearMarkers = function () {
            for (var i = 0; i < _this.markers.length; i++) {
                var marker = _this.markers[i];
                try {
                    marker.setMap(null);
                    window["google"].maps.event.removeListener(marker, "click");
                } catch (e) {}
            }
            _this.markers = new Array();
        };
        return _this;
    }

    (0, _createClass3.default)(_TestGoogleMaps, [{
        key: "onInfoWindowClose",
        value: function onInfoWindowClose() {
            // alert("onInfoWindowClose");
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.updateMap(this.props);
        }
    }, {
        key: "updateMap",
        value: function updateMap(props) {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var _this2 = this;

                var device, mapref, map, routes, flightPlanCoordinates;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                device = props.device;

                                this.setState({
                                    device: device
                                });

                                if (this.refs.map) {
                                    _context.next = 4;
                                    break;
                                }

                                return _context.abrupt("return");

                            case 4:
                                mapref = ReactDOM.findDOMNode(this.refs.map);

                                console.log({ device: device, mapref: mapref, refmap: this.refs.map });
                                map = this.refs.map["map"];

                                map.setCenter({
                                    lat: parseFloat(device.location.latitude),
                                    lng: parseFloat(device.location.longitude)
                                });
                                this.clearMarkers();
                                // new window["google"].maps.Map(mapref, {
                                //   zoom: 12,
                                //   center: { lat: parseFloat(device.latitude), lng: parseFloat(device.longitude) }
                                //   // mapTypeId: "terrain"
                                // });
                                routes = device.routes; //await Database.getRouteToday(device.objectId);
                                //Get all movements today
                                // var flightPlanCoordinates = [
                                //   { lat: 37.772, lng: -122.214 },
                                //   { lat: 21.291, lng: -157.821 },
                                //   { lat: -18.142, lng: 178.431 },
                                //   { lat: -27.467, lng: 153.027 }
                                // ];

                                if (routes.length > 0) {
                                    flightPlanCoordinates = routes.map(function (route) {
                                        return {
                                            lat: parseFloat(route.location.latitude),
                                            lng: parseFloat(route.location.longitude)
                                        };
                                    });

                                    routes.forEach(function (route) {
                                        var mprops = {
                                            position: {
                                                lat: parseFloat(route.location.latitude),
                                                lng: parseFloat(route.location.longitude)
                                            },
                                            route: route,
                                            map: map,
                                            label: time(new Date(route.createdAt)),
                                            animation: window["google"].maps.Animation.DROP,
                                            name: "<b style='color:black;'>" + time(new Date(route.createdAt)) + "</b>"
                                        };
                                        var marker = new window["google"].maps.Marker(mprops);
                                        window["google"].maps.event.addListener(marker, "click", function (e) {
                                            return _this2.onMarkerClick(mprops, marker, e);
                                        });
                                        _this2.markers.push(marker);
                                    });
                                    console.log({ flightPlanCoordinates: flightPlanCoordinates });
                                    this.flightPath = new window["google"].maps.Polyline({
                                        path: flightPlanCoordinates,
                                        geodesic: true,
                                        strokeColor: "#FF0000",
                                        strokeOpacity: 1.0,
                                        strokeWeight: 2
                                    });
                                    this.flightPath.setMap(map);
                                } else {
                                    this.flightPath.setMap(null);
                                }

                            case 11:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(props) {
            this.updateMap(props);
        }
    }, {
        key: "render",
        value: function render() {
            var device = this.state.device;

            if (!device) {
                return React.createElement("div", { style: { width: "100%", height: 600, bottom: 0 } }, "Loading Map...");
            }
            return React.createElement(index_2.default, { ref: "map", google: this.props.google, zoom: 12, style: { width: "100%", height: 600, bottom: 0 }, initialCenter: {
                    lat: device.latitude,
                    lng: device.longitude
                } }, React.createElement(index_1.Marker, { onClick: this.onMarkerClick, name: (device.vehicle_no || device.uuid) + " , " + device.address, title: device.address, position: {
                    lat: device.location.latitude,
                    lng: device.location.longitude
                } }), React.createElement(index_1.InfoWindow, { marker: this.state.activeMarker, visible: this.state.showingInfoWindow, onClose: this.onInfoWindowClose }, React.createElement("div", null, React.createElement("h1", { dangerouslySetInnerHTML: {
                    __html: this.state.selectedPlace.name
                } }), this.state.selectedPlace.route ? this.state.selectedPlace.route.photo ? React.createElement("img", { style: { height: 50, width: 50 }, src: this.state.selectedPlace.route.photo.url }) : null : null)));
        }
    }]);

    return _TestGoogleMaps;
}(React.Component);

var SingleGoogleMaps = index_1.GoogleApiWrapper({
    apiKey: "AIzaSyAP6y4sWwmNFYZojY438WqjeX-rK00DdDQ"
})(_TestGoogleMaps);
// <InfoWindow onClose={this.onInfoWindowClose}>
// <div>
//   <h1>{this.state.selectedPlace.name}</h1>
// </div>
// </InfoWindow>

var _TestGoogleMapsAll = function (_React$Component2) {
    (0, _inherits3.default)(_TestGoogleMapsAll, _React$Component2);

    function _TestGoogleMapsAll() {
        (0, _classCallCheck3.default)(this, _TestGoogleMapsAll);

        var _this3 = (0, _possibleConstructorReturn3.default)(this, (_TestGoogleMapsAll.__proto__ || (0, _getPrototypeOf2.default)(_TestGoogleMapsAll)).apply(this, arguments));

        _this3.state = {
            activeMarker: null,
            showingInfoWindow: false,
            selectedPlace: {
                name: "Cool"
            }
        };
        // onClick={this.onMarkerClick}
        // initialCenter={{
        //   lat: 0.347596,
        //   lng: 32.58252
        // }}
        _this3.onMarkerClick = function (props, marker, e) {
            _this3.setState({
                selectedPlace: props,
                activeMarker: marker,
                showingInfoWindow: true
            });
        };
        return _this3;
    }

    (0, _createClass3.default)(_TestGoogleMapsAll, [{
        key: "onInfoWindowClose",
        value: function onInfoWindowClose() {
            alert("onInfoWindowClose");
        }
    }, {
        key: "render",
        value: function render() {
            var _this4 = this;

            var devices = this.props.devices;

            return React.createElement(index_2.default, { google: this.props.google, zoom: 12, style: { width: "100%", height: 500 }, initialCenter: {
                    lat: 0.347596,
                    lng: 32.58252
                } }, devices.map(function (dev) {
                return React.createElement(index_1.Marker, { name: (dev.vehicle_no || dev.uuid) + ", " + dev.address, onClick: _this4.onMarkerClick, title: "The marker`s title will appear as a tooltip.", position: {
                        lat: dev.location.latitude,
                        lng: dev.location.longitude
                    } });
            }), React.createElement(index_1.InfoWindow, { marker: this.state.activeMarker, visible: this.state.showingInfoWindow, onClose: this.onInfoWindowClose }, React.createElement("div", null, React.createElement("h1", null, this.state.selectedPlace.name))));
        }
    }]);

    return _TestGoogleMapsAll;
}(React.Component);

var GoogleMapsLocations = index_1.GoogleApiWrapper({
    apiKey: "AIzaSyAP6y4sWwmNFYZojY438WqjeX-rK00DdDQ"
})(_TestGoogleMapsAll);
var DEFAULT_GROUP = {
    uuid: null,
    updatedAt: null,
    vehicle_no: null,
    address: null,
    photo: { url: null },
    snapshotsEnabled: false,
    objectId: null
};
var Login = function (_React$Component3) {
    (0, _inherits3.default)(Login, _React$Component3);

    function Login() {
        (0, _classCallCheck3.default)(this, Login);

        var _this5 = (0, _possibleConstructorReturn3.default)(this, (Login.__proto__ || (0, _getPrototypeOf2.default)(Login)).apply(this, arguments));

        _this5.LIQ_API_KEY = "9afb27b67fe07f";
        _this5.addYo = mobx_1.action(function () {
            _this5.props.app.appName += "YOOO TO MA";
        });
        _this5.setCurrentGroup = function (group) {
            return __awaiter(_this5, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                // console.log({ group });
                                // if (!group.routes)
                                //   group.routes = await Database.getRouteToday(group.objectId);
                                // var geocoder = new window["google"].maps.Geocoder();
                                // console.log({ geocoder });
                                // var latlng = {
                                //   lat: parseFloat(group.latitude),
                                //   lng: parseFloat(group.longitude)
                                // };
                                // if (!group.address) {
                                //   geocoder.geocode({ location: latlng }, (results, status) => {
                                //     group.address = results[0] ? results[0].formatted_address : "";
                                //     this.setState({ currentDevice: group });
                                //   });
                                // } else
                                this.setState({ currentGroup: group, currentGroupName: group.name });

                            case 1:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));
        };
        _this5.state = {
            groups: [],
            currentRoute: { photo: {} },
            currentGroup: DEFAULT_GROUP,
            currentGroupName: null
        };
        _this5.saveGroup = function () {
            return __awaiter(_this5, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                var _state, currentGroupName, currentGroup;

                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _state = this.state, currentGroupName = _state.currentGroupName, currentGroup = _state.currentGroup;

                                if (!currentGroupName) {
                                    _context3.next = 12;
                                    break;
                                }

                                _context3.prev = 2;
                                _context3.next = 5;
                                return Database_1.Database.saveGroup(currentGroup.objectId, currentGroupName);

                            case 5:
                                this.setState({ currentGroup: DEFAULT_GROUP });
                                _context3.next = 8;
                                return this.getGroups();

                            case 8:
                                _context3.next = 12;
                                break;

                            case 10:
                                _context3.prev = 10;
                                _context3.t0 = _context3["catch"](2);

                            case 12:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[2, 10]]);
            }));
        };
        return _this5;
    }

    (0, _createClass3.default)(Login, [{
        key: "getGroups",
        value: function getGroups() {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                var groups;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return Database_1.Database.fetchGroups();

                            case 2:
                                groups = _context4.sent;

                                this.setState({ groups: groups });

                            case 4:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.getGroups();
        }
    }, {
        key: "render",
        value: function render() {
            var _this6 = this;

            var _state2 = this.state,
                groups = _state2.groups,
                currentGroup = _state2.currentGroup,
                currentGroupName = _state2.currentGroupName;

            return React.createElement(react_native_web_1.View, null, React.createElement(react_native_web_1.View, { style: { flex: 1, flexDirection: "row" } }, React.createElement(react_native_web_1.View, { className: "", style: {
                    height: 30,
                    flexDirection: "row",
                    width: "60%",
                    alignItems: "center",
                    backgroundColor: "black",
                    padding: 5
                } }, React.createElement(react_native_web_1.View, { style: { flex: 1.5, color: "white" } }, React.createElement(react_native_web_1.Text, null, "Group ID")), React.createElement(react_native_web_1.View, { style: { flex: 1, color: "white" } }, React.createElement(react_native_web_1.Text, null, "Name")), React.createElement(react_native_web_1.View, { style: { flex: 1, color: "white" } }, React.createElement(react_native_web_1.Text, null, "Last Updated"))), React.createElement(react_native_web_1.View, { className: "", style: {
                    height: 30,
                    flexDirection: "row",
                    width: "60%",
                    alignItems: "center",
                    backgroundColor: "darkblue",
                    padding: 5
                } }, React.createElement(react_native_web_1.View, { style: { flex: 1.5, color: "white" } }, React.createElement(react_native_web_1.Text, null, "Group Information")))), React.createElement(react_native_web_1.View, { className: "container-fluid", style: {
                    height: "auto",
                    overflow: "hidden",
                    padding: 2,
                    flex: 0.5,
                    flexDirection: "row"
                } }, React.createElement(react_native_web_1.View, { className: "col-md-8", style: { flex: 0.6 } }, React.createElement(react_native_web_1.View, { style: {
                    float: "none" /* not needed, just for clarification */
                    , /* the next props are meant to keep this block independent from the other floated one */
                    width: "auto",
                    overflow: "scroll",
                    height: "90%",
                    backgroundColor: "#FAFAFA"
                } }, React.createElement(react_native_web_1.ScrollView, { style: { flex: 1, width: "100%", height: 800 } }, this.state.groups.map(function (group) {
                return React.createElement(react_native_web_1.View, { key: group.objectId, style: {
                        backgroundColor: group.objectId == currentGroup.objectId ? "lightgray" : "",
                        flexDirection: "row",
                        flex: 1,
                        margin: 2,
                        justifyContent: "space-between"
                    }, onClick: function onClick() {
                        return _this6.setCurrentGroup(group);
                    } }, React.createElement("th", { scope: "row", style: { textAlign: "left", flex: 1.5 } }, group.objectId), React.createElement("th", { scope: "row", style: { textAlign: "left", flex: 1.5 } }, group.name), React.createElement("td", { style: { textAlign: "left", flex: 1 } }, new Date(group.updatedAt).toLocaleString()));
            }), React.createElement(semantic_ui_react_1.Button, { color: "green", content: "New Group", size: "small", onClick: function onClick() {
                    return _this6.setCurrentGroup({
                        updatedAt: new Date(),
                        name: "New Group"
                    });
                } })))), currentGroup && currentGroup.updatedAt ? React.createElement(react_native_web_1.View, { style: {
                    backgroundColor: "#EFEFEF",
                    flex: 0.4
                } }, React.createElement(react_native_web_1.Text, null, React.createElement(semantic_ui_react_1.Segment, null, React.createElement(semantic_ui_react_1.Form, null, React.createElement("legend", null, "Edit Group"), React.createElement(semantic_ui_react_1.Form.Field, null, React.createElement("label", null, "name"), React.createElement("input", { value: currentGroupName, onChange: function onChange(e) {
                    return _this6.setState({ currentGroupName: e.target.value });
                } })), React.createElement(semantic_ui_react_1.Button, { disabled: !currentGroupName, primary: true, type: "submit", content: "Save", onClick: this.saveGroup }))))) : null));
        }
    }]);

    return Login;
}(React.Component);
Login = __decorate([mobx_react_1.observer], Login);
function DeviceInfo(_ref) {
    var currentDevice = _ref.currentDevice,
        devices = _ref.devices,
        currentRoute = _ref.currentRoute,
        changeRoute = _ref.changeRoute,
        toggleSnapshots = _ref.toggleSnapshots,
        updateVehicleName = _ref.updateVehicleName;

    // console.log({ currentDevice })
    return React.createElement(react_native_web_1.View, { style: {
            backgroundColor: "#EFEFEF",
            flex: 0.4
        } }, currentDevice.uuid ? React.createElement(react_native_web_1.View, null, React.createElement(react_native_web_1.View, { style: {
            backgroundColor: "#EFEFEF",
            flex: 1,
            flexDirection: "row"
        } }, React.createElement(react_native_web_1.View, { style: { flex: 1, padding: 5 } }, React.createElement("b", null, "Device:"), React.createElement("p", null, currentDevice.uuid), React.createElement("b", null, "Vehicle:"), React.createElement("p", null, React.createElement(react_edit_inline_1.default, { activeClassName: "editing", text: currentDevice.vehicle_no, paramName: "message", onSelect: function onSelect() {}, change: function change(e) {
            updateVehicleName(e["message"]);
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
        } })), React.createElement("b", null, "Last Address:"), React.createElement("p", null, currentDevice.address), React.createElement("b", null, "Latest Snap: "), currentDevice.photo ? React.createElement("p", null, React.createElement("img", { style: { width: 100, height: 100 }, src: currentDevice.photo.url }), React.createElement("p", null, new Date(currentDevice.updatedAt).toTimeString())) : null, React.createElement("p", null, React.createElement("b", null, "Toggle Snapshots:"), React.createElement("p", { style: {
            width: 50,
            height: 20,
            backgroundColor: currentDevice.snapshotsEnabled ? "green" : "red",
            borderBottomLeftRadius: 5,
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
            borderTopLeftRadius: 5,
            padding: 5,
            color: "white",
            textAlign: "center",
            cursor: "pointer"
        }, onClick: toggleSnapshots }, currentDevice.snapshotsEnabled ? "ON" : "OFF"))), React.createElement(react_native_web_1.View, { style: {
            flex: 1,
            borderLeftStyle: "solid",
            borderLeftWidth: 2,
            padding: 5
        } }, React.createElement(react_native_web_1.Text, null, React.createElement("p", null, React.createElement("b", null, "Movement & Snapshots"))), React.createElement("p", null, React.createElement("select", { onChange: function onChange(op) {
            return changeRoute(JSON.parse(op.target.value));
        }, value: currentRoute.objectId }, React.createElement("option", null, " -- Select -- "), currentDevice.routes.map(function (route) {
        return React.createElement("option", { value: (0, _stringify2.default)(route) }, new Date(route.createdAt).toTimeString());
    }), ";")), React.createElement("b", null, "Location: "), React.createElement(react_native_web_1.Text, null, currentRoute.actualLocation, " "), React.createElement("img", { src: currentRoute && currentRoute.photo ? currentRoute.photo.url : "", style: { width: "100%" } }))), React.createElement(react_native_web_1.View, { style: { flex: 1 } }, React.createElement(SingleGoogleMaps, { device: currentDevice }))) : React.createElement("div", { style: {
            backgroundColor: "#EFEFEF"
        } }, React.createElement(react_native_web_1.Text, null, "ALL DEVICES -- Last Location"), React.createElement(GoogleMapsLocations, { devices: devices })));
}
exports.default = mobx_react_1.observer(Page_1.ComposedComponent(Login));