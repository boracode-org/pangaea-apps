"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_web_1 = require("react-native-web");
const Page_1 = require("../components/Page");
const react_edit_inline_1 = require("../components/libs/react-edit-inline");
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const ReactDOM = require("react-dom");
// if (typeof window === 'undefined') {
//   global.window = {document:{createElement:()=>{}}}
//   global.document = {}
// }
const index_1 = require("../components/libs/google-maps-react/index"); //"../libraries/google-maps-react";
var { Polyline } = require("../components/libs/google-maps-react/index");
// import Map from "google-maps-react-irio";
const index_2 = require("../components/libs/google-maps-react/index");
// import * as Parse from "parse";
const Database_1 = require("../components/Database");
const semantic_ui_react_1 = require("semantic-ui-react");
// Parse.initialize("ABCDEFG12345");
// Parse.serverURL = "http://psign.iriosystems.com:1380/parse";
function round(value, decimals) {
    return Number(Math.round((value + "e" + decimals)) + "e-" + decimals);
}
exports.round = round;
function time(d) {
    var h = (d.getHours() < 10 ? "0" : "") + d.getHours(), m = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
    return h + ":" + m;
}
class _TestGoogleMaps extends React.Component {
    constructor() {
        super(...arguments);
        this.markers = [];
        this.onMarkerClick = (props, marker, e) => {
            console.log("marker clicked", { marker, props, e });
            this.setState({
                selectedPlace: props,
                activeMarker: marker,
                showingInfoWindow: true
            });
        };
        this.state = {
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
        this.clearMarkers = () => {
            for (var i = 0; i < this.markers.length; i++) {
                var marker = this.markers[i];
                try {
                    marker.setMap(null);
                    window["google"].maps.event.removeListener(marker, "click");
                }
                catch (e) { }
            }
            this.markers = new Array();
        };
    }
    onInfoWindowClose() {
        // alert("onInfoWindowClose");
    }
    componentDidMount() {
        this.updateMap(this.props);
    }
    updateMap(props) {
        return __awaiter(this, void 0, void 0, function* () {
            var device = props.device;
            this.setState({
                device
            });
            if (!this.refs.map)
                return;
            var mapref = ReactDOM.findDOMNode(this.refs.map);
            // console.log({ device, mapref, refmap: this.refs.map });
            var map = this.refs.map["map"];
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
            try {
                var routes = device.routes; //await Database.getRouteToday(device.objectId);
                //Get all movements today
                if (routes.length > 0) {
                    var flightPlanCoordinates = routes.map(route => {
                        return {
                            lat: parseFloat(route.location.latitude),
                            lng: parseFloat(route.location.longitude)
                        };
                    });
                    routes.forEach(route => {
                        var mprops = {
                            position: {
                                lat: parseFloat(route.location.latitude),
                                lng: parseFloat(route.location.longitude)
                            },
                            route,
                            map: map,
                            label: time(new Date(route.createdAt)),
                            animation: window["google"].maps.Animation.DROP,
                            name: "<b style='color:black;'>" +
                                time(new Date(route.createdAt)) +
                                "</b>"
                        };
                        var marker = new window["google"].maps.Marker(mprops);
                        window["google"].maps.event.addListener(marker, "click", e => this.onMarkerClick(mprops, marker, e));
                        this.markers.push(marker);
                    });
                    console.log({ flightPlanCoordinates });
                    this.flightPath = new window["google"].maps.Polyline({
                        path: flightPlanCoordinates,
                        geodesic: true,
                        strokeColor: "#FF0000",
                        strokeOpacity: 1.0,
                        strokeWeight: 2
                    });
                    this.flightPath.setMap(map);
                }
                else {
                    this.flightPath.setMap(null);
                }
            }
            catch (e) { }
        });
    }
    componentWillReceiveProps(props) {
        this.updateMap(props);
    }
    render() {
        const { device } = this.state;
        if (!device) {
            return (React.createElement("div", { style: { width: "100%", height: 600, bottom: 0 } }, "Loading Map..."));
        }
        return (React.createElement(index_2.default, { ref: "map", google: this.props.google, zoom: 12, style: { width: "100%", height: 600, bottom: 0 }, initialCenter: {
                lat: device.latitude,
                lng: device.longitude
            } },
            React.createElement(index_1.Marker, { onClick: this.onMarkerClick, name: (device.vehicle_no || device.uuid) + " , " + device.address, title: device.address, position: {
                    lat: device.location.latitude,
                    lng: device.location.longitude
                } }),
            React.createElement(index_1.InfoWindow, { marker: this.state.activeMarker, visible: this.state.showingInfoWindow, onClose: this.onInfoWindowClose },
                React.createElement("div", null,
                    React.createElement("h1", { dangerouslySetInnerHTML: {
                            __html: this.state.selectedPlace.name
                        } }),
                    this.state.selectedPlace.route ? (this.state.selectedPlace.route.photo ? (React.createElement("img", { style: { height: 50, width: 50 }, src: this.state.selectedPlace.route.photo.url })) : null) : null))));
    }
}
var SingleGoogleMaps = index_1.GoogleApiWrapper({
    apiKey: "AIzaSyAP6y4sWwmNFYZojY438WqjeX-rK00DdDQ"
})(_TestGoogleMaps);
// <InfoWindow onClose={this.onInfoWindowClose}>
// <div>
//   <h1>{this.state.selectedPlace.name}</h1>
// </div>
// </InfoWindow>
class _TestGoogleMapsAll extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
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
        this.onMarkerClick = (props, marker, e) => {
            this.setState({
                selectedPlace: props,
                activeMarker: marker,
                showingInfoWindow: true
            });
        };
    }
    onInfoWindowClose() {
        alert("onInfoWindowClose");
    }
    render() {
        const { devices } = this.props;
        return (React.createElement(index_2.default, { google: this.props.google, zoom: 12, style: { width: "100%", height: 500 }, initialCenter: {
                lat: 0.347596,
                lng: 32.58252
            } },
            devices.map(dev => {
                return (React.createElement(index_1.Marker, { name: (dev.vehicle_no || dev.uuid) + ", " + dev.address, onClick: this.onMarkerClick, title: "The marker`s title will appear as a tooltip.", position: {
                        lat: dev.location.latitude,
                        lng: dev.location.longitude
                    } }));
            }),
            React.createElement(index_1.InfoWindow, { marker: this.state.activeMarker, visible: this.state.showingInfoWindow, onClose: this.onInfoWindowClose },
                React.createElement("div", null,
                    React.createElement("h1", null, this.state.selectedPlace.name)))));
    }
}
var GoogleMapsLocations = index_1.GoogleApiWrapper({
    apiKey: "AIzaSyAP6y4sWwmNFYZojY438WqjeX-rK00DdDQ"
})(_TestGoogleMapsAll);
let Login = class Login extends React.Component {
    constructor() {
        super(...arguments);
        this.LIQ_API_KEY = "9afb27b67fe07f";
        this.addYo = mobx_1.action(() => {
            this.props.app.appName += "YOOO TO MA";
        });
        this.setCurrentDevice = (device) => __awaiter(this, void 0, void 0, function* () {
            // console.log({ device });
            if (!device.routes)
                device.routes = yield Database_1.Database.getRouteToday(device.objectId);
            var geocoder = new window["google"].maps.Geocoder();
            // console.log({ geocoder });
            var latlng = {
                lat: parseFloat(device.latitude),
                lng: parseFloat(device.longitude)
            };
            if (!device.address) {
                geocoder.geocode({ location: latlng }, (results, status) => {
                    device.address = results[0] ? results[0].formatted_address : "";
                    this.setState({ currentDevice: device });
                });
            }
            else
                this.setState({ currentDevice: device });
        });
        this.state = {
            devices: [],
            groups: [],
            currentRoute: { photo: {} },
            currentDevice: {
                uuid: null,
                updatedAt: null,
                vehicle_no: null,
                address: null,
                photo: { url: null },
                snapshotsEnabled: false,
                objectId: null
            }
        };
    }
    getDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            //Get and display devices
            // alert("getting devices!!");
            var devices = yield Database_1.Database.fetchDevices();
            this.setState({ devices });
        });
    }
    componentDidMount() {
        this.getDevices();
        this.refreshGroups();
    }
    refreshGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            var groups = yield Database_1.Database.getGroups();
            this.setState({
                groups: groups.map(k => k.toJSON()).map(k => ({
                    key: k.objectId,
                    text: k.name,
                    value: k.objectId
                }))
            });
        });
    }
    render() {
        const { devices, currentDevice } = this.state;
        return (React.createElement(react_native_web_1.View, null,
            React.createElement(react_native_web_1.View, { style: { flex: 1, flexDirection: "row" } },
                React.createElement(react_native_web_1.View, { className: "", style: {
                        height: 30,
                        flexDirection: "row",
                        width: "60%",
                        alignItems: "center",
                        backgroundColor: "black",
                        padding: 5
                    } },
                    React.createElement(react_native_web_1.View, { style: { flex: 1.5, color: "white" } },
                        React.createElement(react_native_web_1.Text, null, "Device ID")),
                    React.createElement(react_native_web_1.View, { style: { flex: 1, color: "white" } },
                        React.createElement(react_native_web_1.Text, null, "Last Online")),
                    React.createElement(react_native_web_1.View, { style: { flex: 0.5, color: "white" } },
                        React.createElement(react_native_web_1.Text, null, "Vehicle")),
                    React.createElement(react_native_web_1.View, { style: { flex: 1, color: "white" } },
                        React.createElement(react_native_web_1.Text, null, " Last Location (Lng,Lat)"))),
                React.createElement(react_native_web_1.View, { className: "", style: {
                        height: 30,
                        flexDirection: "row",
                        width: "60%",
                        alignItems: "center",
                        backgroundColor: "darkblue",
                        padding: 5
                    } },
                    React.createElement(react_native_web_1.View, { style: { flex: 1.5, color: "white" } },
                        React.createElement(react_native_web_1.Text, null, "Device Information")))),
            React.createElement(react_native_web_1.View, { className: "container-fluid", style: {
                    height: "auto",
                    overflow: "hidden",
                    padding: 2,
                    flex: 0.5,
                    flexDirection: "row"
                } },
                React.createElement(react_native_web_1.View, { className: "col-md-8", style: { flex: 0.6 } },
                    React.createElement(react_native_web_1.View, { style: {
                            float: "none" /* not needed, just for clarification */,
                            /* the next props are meant to keep this block independent from the other floated one */
                            width: "auto",
                            overflow: "scroll",
                            height: "90%",
                            backgroundColor: "#FAFAFA"
                        } },
                        React.createElement(react_native_web_1.ScrollView, { style: { flex: 1, width: "100%", height: 800 } }, this.state.devices.map(device => {
                            return (React.createElement(react_native_web_1.View, { key: device.uuid, style: {
                                    backgroundColor: device.uuid == currentDevice.uuid ? "lightgray" : "",
                                    flexDirection: "row",
                                    flex: 1,
                                    margin: 2,
                                    justifyContent: "space-between"
                                }, onClick: () => this.setCurrentDevice(device) },
                                React.createElement("th", { scope: "row", style: { textAlign: "left", flex: 1.5 } }, device.uuid),
                                React.createElement("td", { style: { textAlign: "left", flex: 1 } }, new Date(device.updatedAt).toLocaleString()),
                                React.createElement("td", { style: {
                                        textAlign: "center",
                                        flex: 0.5,
                                        backgroundColor: "darkgreen",
                                        color: "white",
                                        borderRadius: 15,
                                        height: 30,
                                        padding: 5
                                    } }, device.vehicle_no),
                                React.createElement("td", { style: { textAlign: "center", flex: 1 } },
                                    round(device.location.longitude, 2),
                                    ",",
                                    round(device.location.latitude, 2)),
                                React.createElement("td", null)));
                        })))),
                React.createElement(DeviceInfo, { groups: this.state.groups, currentDevice: currentDevice, devices: devices, currentRoute: this.state.currentRoute, updateVehicleName: newName => {
                        var { currentDevice } = this.state;
                        currentDevice.vehicle_no = newName;
                        Database_1.Database.setVehicle(currentDevice.objectId, newName);
                        this.setCurrentDevice(currentDevice);
                        this.getDevices();
                    }, updateVehicleGroup: newGroup => {
                        var { currentDevice } = this.state;
                        Database_1.Database.setVehicleGroup(currentDevice.objectId, newGroup);
                        if (!currentDevice.group) {
                            currentDevice.group = {};
                        }
                        currentDevice.group.objectId = newGroup;
                        this.setCurrentDevice(currentDevice);
                        this.getDevices();
                    }, toggleSnapshots: () => {
                        var { currentDevice } = this.state;
                        currentDevice.snapshotsEnabled = !currentDevice.snapshotsEnabled;
                        Database_1.Database.setSnaphots(currentDevice.objectId, currentDevice.snapshotsEnabled);
                        this.setCurrentDevice(currentDevice);
                    }, changeRoute: (op) => __awaiter(this, void 0, void 0, function* () {
                        var location = yield fetch(`https://locationiq.org/v1/reverse.php?format=json&key=${this.LIQ_API_KEY}&lat=${op.location.latitude}&lon=${op.location.longitude}`).then(k => k.json());
                        op.actualLocation = location.display_name;
                        this.setState({ currentRoute: op });
                    }) }))));
    }
};
Login = __decorate([
    mobx_react_1.observer
], Login);
function DeviceInfo({ currentDevice, devices, currentRoute, changeRoute, toggleSnapshots, updateVehicleName, updateVehicleGroup, groups }) {
    // console.log({ currentDevice })
    return (React.createElement(react_native_web_1.View, { style: {
            backgroundColor: "#EFEFEF",
            flex: 0.4
        } }, currentDevice.uuid ? (React.createElement(react_native_web_1.View, null,
        React.createElement(react_native_web_1.View, { style: {
                backgroundColor: "#EFEFEF",
                flex: 1,
                flexDirection: "row"
            } },
            React.createElement(react_native_web_1.View, { style: { flex: 1, padding: 5 } },
                React.createElement("b", null, "Device:"),
                React.createElement("p", null, currentDevice.uuid),
                React.createElement("b", null, "Vehicle:"),
                React.createElement("p", null,
                    React.createElement(react_edit_inline_1.default, { activeClassName: "editing", text: currentDevice.vehicle_no, paramName: "message", onSelect: () => { }, change: e => {
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
                        } }),
                    React.createElement(semantic_ui_react_1.Form.Field, null,
                        React.createElement("label", null, "Current Group"),
                        React.createElement(semantic_ui_react_1.Dropdown, { placeholder: "Select Group", fluid: true, selection: true, value: currentDevice.group && currentDevice.group.objectId, onChange: (e, data) => {
                                // console.log({ data });
                                // this.setState({ selectedGroup: data.value });
                                updateVehicleGroup(data.value);
                            }, options: groups }))),
                React.createElement("b", null, "Last Address:"),
                React.createElement("p", null, currentDevice.address),
                React.createElement("b", null, "Latest Snap: "),
                currentDevice.photo ? (React.createElement("p", null,
                    React.createElement("img", { style: { width: 100, height: 100 }, src: currentDevice.photo.url }),
                    React.createElement("p", null, new Date(currentDevice.updatedAt).toTimeString()))) : null,
                React.createElement("p", null,
                    React.createElement("b", null, "Toggle Snapshots:"),
                    React.createElement("p", { style: {
                            width: 50,
                            height: 20,
                            backgroundColor: currentDevice.snapshotsEnabled
                                ? "green"
                                : "red",
                            borderBottomLeftRadius: 5,
                            borderTopRightRadius: 5,
                            borderBottomRightRadius: 5,
                            borderTopLeftRadius: 5,
                            padding: 5,
                            color: "white",
                            textAlign: "center",
                            cursor: "pointer"
                        }, onClick: toggleSnapshots }, currentDevice.snapshotsEnabled ? "ON" : "OFF"))),
            React.createElement(react_native_web_1.View, { style: {
                    flex: 1,
                    borderLeftStyle: "solid",
                    borderLeftWidth: 2,
                    padding: 5
                } },
                React.createElement(react_native_web_1.Text, null,
                    React.createElement("p", null,
                        React.createElement("b", null, "Movement & Snapshots"))),
                React.createElement("p", null,
                    React.createElement("select", { onChange: op => changeRoute(JSON.parse(op.target.value)), value: currentRoute.objectId },
                        React.createElement("option", null, " -- Select -- "),
                        currentDevice.routes.map(route => (React.createElement("option", { value: JSON.stringify(route) }, new Date(route.createdAt).toTimeString()))),
                        ";")),
                React.createElement("b", null, "Location: "),
                React.createElement(react_native_web_1.Text, null,
                    currentRoute.actualLocation,
                    " "),
                React.createElement("img", { src: currentRoute && currentRoute.photo
                        ? currentRoute.photo.url
                        : "", style: { width: "100%" } }))),
        React.createElement(react_native_web_1.View, { style: { flex: 1 } },
            React.createElement(SingleGoogleMaps, { device: currentDevice })))) : (React.createElement("div", { style: {
            backgroundColor: "#EFEFEF"
        } },
        React.createElement(react_native_web_1.Text, null, "ALL DEVICES -- Last Location"),
        React.createElement(GoogleMapsLocations, { devices: devices })))));
}
exports.default = mobx_react_1.observer(Page_1.ComposedComponent(Login));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2aWNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRldmljZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQkFBK0I7QUFFL0IsdURBQWtFO0FBQ2xFLDZDQUF1RDtBQVV2RCw0RUFBOEQ7QUFHOUQsK0JBQThCO0FBRTlCLDJDQUE4QztBQUU5QyxzQ0FBc0M7QUFFdEMsdUNBQXVDO0FBQ3ZDLHNEQUFzRDtBQUN0RCx5QkFBeUI7QUFFekIsSUFBSTtBQUVKLHNFQUlvRCxDQUFDLG1DQUFtQztBQUN4RixJQUFJLEVBQUUsUUFBUSxFQUFFLEdBQUcsT0FBTyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7QUFDekUsNENBQTRDO0FBQzVDLHNFQUE2RDtBQUU3RCxrQ0FBa0M7QUFDbEMscURBQWtEO0FBQ2xELHlEQUFtRDtBQUNuRCxvQ0FBb0M7QUFDcEMsK0RBQStEO0FBRS9ELGVBQXNCLEtBQUssRUFBRSxRQUFRO0lBQ25DLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssR0FBRyxHQUFHLEdBQUcsUUFBUSxDQUFRLENBQUMsR0FBRyxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUM7QUFDL0UsQ0FBQztBQUZELHNCQUVDO0FBRUQsY0FBYyxDQUFDO0lBQ2IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFDbkQsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDeEQsTUFBTSxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxD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QUNQLG9CQUFDLHVCQUFJLElBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRTtZQUN0QixvQkFBQyxnQkFBZ0IsSUFBQyxNQUFNLEVBQUUsYUFBYSxHQUFJLENBQ3RDLENBQ0YsQ0FDUixDQUFDLENBQUMsQ0FBQyxDQUNGLDZCQUNFLEtBQUssRUFBRTtZQUNMLGVBQWUsRUFBRSxTQUFTO1NBQzNCO1FBRUQsb0JBQUMsdUJBQUksdUNBQW9DO1FBQ3pDLG9CQUFDLG1CQUFtQixJQUFDLE9BQU8sRUFBRSxPQUFPLEdBQUksQ0FDckMsQ0FDUCxDQUNJLENBQ1IsQ0FBQztBQUNKLENBQUM7QUFDRCxrQkFBZSxxQkFBUSxDQUFDLHdCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBNeUNvbXBvbmVudCBmcm9tIFwiLi4vY29tcG9uZW50cy9NeUNvbXBvbmVudFwiO1xuaW1wb3J0IHsgVmlldywgVGV4dCwgQnV0dG9uLCBTY3JvbGxWaWV3IH0gZnJvbSBcInJlYWN0LW5hdGl2ZS13ZWJcIjtcbmltcG9ydCB7IENvbXBvc2VkQ29tcG9uZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvUGFnZVwiO1xuaW1wb3J0IHtcbiAgVGFibGUsXG4gIFRhYmxlV3JhcHBlcixcbiAgUm93LFxuICBSb3dzLFxuICBDb2wsXG4gIENvbHMsXG4gIENlbGxcbn0gZnJvbSBcInJlYWN0LW5hdGl2ZS10YWJsZS1jb21wb25lbnRcIjtcbmltcG9ydCBJbmxpbmVFZGl0IGZyb20gXCIuLi9jb21wb25lbnRzL2xpYnMvcmVhY3QtZWRpdC1pbmxpbmVcIjtcblxuaW1wb3J0IHsgQXBwU3RvcmUgfSBmcm9tIFwiLi4vc3RvcmVzL2FwcFN0b3JlXCI7XG5pbXBvcnQgeyBhY3Rpb24gfSBmcm9tIFwibW9ieFwiO1xuXG5pbXBvcnQgeyBpbmplY3QsIG9ic2VydmVyIH0gZnJvbSBcIm1vYngtcmVhY3RcIjtcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSBcInByb3AtdHlwZXNcIjtcbmltcG9ydCAqIGFzIFJlYWN0RE9NIGZyb20gXCJyZWFjdC1kb21cIjtcblxuLy8gaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4vLyAgIGdsb2JhbC53aW5kb3cgPSB7ZG9jdW1lbnQ6e2NyZWF0ZUVsZW1lbnQ6KCk9Pnt9fX1cbi8vICAgZ2xvYmFsLmRvY3VtZW50ID0ge31cblxuLy8gfVxuXG5pbXBvcnQge1xuICBHb29nbGVBcGlXcmFwcGVyLFxuICBNYXJrZXIsXG4gIEluZm9XaW5kb3dcbn0gZnJvbSBcIi4uL2NvbXBvbmVudHMvbGlicy9nb29nbGUtbWFwcy1yZWFjdC9pbmRleFwiOyAvL1wiLi4vbGlicmFyaWVzL2dvb2dsZS1tYXBzLXJlYWN0XCI7XG52YXIgeyBQb2x5bGluZSB9ID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvbGlicy9nb29nbGUtbWFwcy1yZWFjdC9pbmRleFwiKTtcbi8vIGltcG9ydCBNYXAgZnJvbSBcImdvb2dsZS1tYXBzLXJlYWN0LWlyaW9cIjtcbmltcG9ydCBNYXAgZnJvbSBcIi4uL2NvbXBvbmVudHMvbGlicy9nb29nbGUtbWFwcy1yZWFjdC9pbmRleFwiO1xuXG4vLyBpbXBvcnQgKiBhcyBQYXJzZSBmcm9tIFwicGFyc2VcIjtcbmltcG9ydCB7IERhdGFiYXNlIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvRGF0YWJhc2VcIjtcbmltcG9ydCB7IEZvcm0sIERyb3Bkb3duIH0gZnJvbSBcInNlbWFudGljLXVpLXJlYWN0XCI7XG4vLyBQYXJzZS5pbml0aWFsaXplKFwiQUJDREVGRzEyMzQ1XCIpO1xuLy8gUGFyc2Uuc2VydmVyVVJMID0gXCJodHRwOi8vcHNpZ24uaXJpb3N5c3RlbXMuY29tOjEzODAvcGFyc2VcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHJvdW5kKHZhbHVlLCBkZWNpbWFscykge1xuICByZXR1cm4gTnVtYmVyKE1hdGgucm91bmQoKHZhbHVlICsgXCJlXCIgKyBkZWNpbWFscykgYXMgYW55KSArIFwiZS1cIiArIGRlY2ltYWxzKTtcbn1cblxuZnVuY3Rpb24gdGltZShkKSB7XG4gIHZhciBoID0gKGQuZ2V0SG91cnMoKSA8IDEwID8gXCIwXCIgOiBcIlwiKSArIGQuZ2V0SG91cnMoKSxcbiAgICBtID0gKGQuZ2V0TWludXRlcygpIDwgMTAgPyBcIjBcIiA6IFwiXCIpICsgZC5nZXRNaW51dGVzKCk7XG4gIHJldHVybiBoICsgXCI6XCIgKyBtO1xufVxuXG5jbGFzcyBfVGVzdEdvb2dsZU1hcHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcbiAgbWFya2VycyA9IFtdO1xuICBmbGlnaHRQYXRoOiBhbnk7XG4gIG9uSW5mb1dpbmRvd0Nsb3NlKCkge1xuICAgIC8vIGFsZXJ0KFwib25JbmZvV2luZG93Q2xvc2VcIik7XG4gIH1cblxuICBvbk1hcmtlckNsaWNrID0gKHByb3BzLCBtYXJrZXIsIGUpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIm1hcmtlciBjbGlja2VkXCIsIHsgbWFya2VyLCBwcm9wcywgZSB9KTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGVkUGxhY2U6IHByb3BzLFxuICAgICAgYWN0aXZlTWFya2VyOiBtYXJrZXIsXG4gICAgICBzaG93aW5nSW5mb1dpbmRvdzogdHJ1ZVxuICAgIH0pO1xuICB9O1xuXG4gIHN0YXRlID0ge1xuICAgIGFjdGl2ZU1hcmtlcjogbnVsbCxcbiAgICBzZWxlY3RlZFBsYWNlOiB7XG4gICAgICBuYW1lOiBcIkNvb2xcIixcbiAgICAgIHJvdXRlOiBudWxsXG4gICAgfSxcbiAgICBkZXZpY2U6IG51bGwsXG4gICAgc2hvd2luZ0luZm9XaW5kb3c6IGZhbHNlXG4gIH07XG5cbiAgLy8gb25DbGljaz17dGhpcy5vbk1hcmtlckNsaWNrfVxuICAvLyBpbml0aWFsQ2VudGVyPXt7XG4gIC8vICAgbGF0OiAwLjM0NzU5NixcbiAgLy8gICBsbmc6IDMyLjU4MjUyXG4gIC8vIH19XG5cbiAgY2xlYXJNYXJrZXJzID0gKCkgPT4ge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5tYXJrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbWFya2VyID0gdGhpcy5tYXJrZXJzW2ldO1xuICAgICAgdHJ5IHtcbiAgICAgICAgbWFya2VyLnNldE1hcChudWxsKTtcbiAgICAgICAgd2luZG93W1wiZ29vZ2xlXCJdLm1hcHMuZXZlbnQucmVtb3ZlTGlzdGVuZXIobWFya2VyLCBcImNsaWNrXCIpO1xuICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9XG4gICAgdGhpcy5tYXJrZXJzID0gbmV3IEFycmF5KCk7XG4gIH07XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy51cGRhdGVNYXAodGhpcy5wcm9wcyk7XG4gIH1cblxuICBhc3luYyB1cGRhdGVNYXAocHJvcHMpIHtcbiAgICB2YXIgZGV2aWNlID0gcHJvcHMuZGV2aWNlO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZGV2aWNlXG4gICAgfSk7XG5cbiAgICBpZiAoIXRoaXMucmVmcy5tYXApIHJldHVybjtcblxuICAgIHZhciBtYXByZWYgPSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzLnJlZnMubWFwKTtcblxuICAgIC8vIGNvbnNvbGUubG9nKHsgZGV2aWNlLCBtYXByZWYsIHJlZm1hcDogdGhpcy5yZWZzLm1hcCB9KTtcblxuICAgIHZhciBtYXAgPSB0aGlzLnJlZnMubWFwW1wibWFwXCJdO1xuXG4gICAgbWFwLnNldENlbnRlcih7XG4gICAgICBsYXQ6IHBhcnNlRmxvYXQoZGV2aWNlLmxvY2F0aW9uLmxhdGl0dWRlKSxcbiAgICAgIGxuZzogcGFyc2VGbG9hdChkZXZpY2UubG9jYXRpb24ubG9uZ2l0dWRlKVxuICAgIH0pO1xuICAgIHRoaXMuY2xlYXJNYXJrZXJzKCk7XG4gICAgLy8gbmV3IHdpbmRvd1tcImdvb2dsZVwiXS5tYXBzLk1hcChtYXByZWYsIHtcbiAgICAvLyAgIHpvb206IDEyLFxuICAgIC8vICAgY2VudGVyOiB7IGxhdDogcGFyc2VGbG9hdChkZXZpY2UubGF0aXR1ZGUpLCBsbmc6IHBhcnNlRmxvYXQoZGV2aWNlLmxvbmdpdHVkZSkgfVxuICAgIC8vICAgLy8gbWFwVHlwZUlkOiBcInRlcnJhaW5cIlxuICAgIC8vIH0pO1xuXG4gICAgdHJ5IHtcbiAgICAgIHZhciByb3V0ZXMgPSBkZXZpY2Uucm91dGVzOyAvL2F3YWl0IERhdGFiYXNlLmdldFJvdXRlVG9kYXkoZGV2aWNlLm9iamVjdElkKTtcbiAgICAgIC8vR2V0IGFsbCBtb3ZlbWVudHMgdG9kYXlcblxuICAgICAgaWYgKHJvdXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBmbGlnaHRQbGFuQ29vcmRpbmF0ZXMgPSByb3V0ZXMubWFwKHJvdXRlID0+IHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGF0OiBwYXJzZUZsb2F0KHJvdXRlLmxvY2F0aW9uLmxhdGl0dWRlKSxcbiAgICAgICAgICAgIGxuZzogcGFyc2VGbG9hdChyb3V0ZS5sb2NhdGlvbi5sb25naXR1ZGUpXG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcm91dGVzLmZvckVhY2gocm91dGUgPT4ge1xuICAgICAgICAgIHZhciBtcHJvcHMgPSB7XG4gICAgICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgICAgICBsYXQ6IHBhcnNlRmxvYXQocm91dGUubG9jYXRpb24ubGF0aXR1ZGUpLFxuICAgICAgICAgICAgICBsbmc6IHBhcnNlRmxvYXQocm91dGUubG9jYXRpb24ubG9uZ2l0dWRlKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJvdXRlLFxuICAgICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgICAgICBsYWJlbDogdGltZShuZXcgRGF0ZShyb3V0ZS5jcmVhdGVkQXQpKSxcbiAgICAgICAgICAgIGFuaW1hdGlvbjogd2luZG93W1wiZ29vZ2xlXCJdLm1hcHMuQW5pbWF0aW9uLkRST1AsXG4gICAgICAgICAgICBuYW1lOlxuICAgICAgICAgICAgICBcIjxiIHN0eWxlPSdjb2xvcjpibGFjazsnPlwiICtcbiAgICAgICAgICAgICAgdGltZShuZXcgRGF0ZShyb3V0ZS5jcmVhdGVkQXQpKSArXG4gICAgICAgICAgICAgIFwiPC9iPlwiXG4gICAgICAgICAgfTtcbiAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IHdpbmRvd1tcImdvb2dsZVwiXS5tYXBzLk1hcmtlcihtcHJvcHMpO1xuICAgICAgICAgIHdpbmRvd1tcImdvb2dsZVwiXS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgXCJjbGlja1wiLCBlID0+XG4gICAgICAgICAgICB0aGlzLm9uTWFya2VyQ2xpY2sobXByb3BzLCBtYXJrZXIsIGUpXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIHRoaXMubWFya2Vycy5wdXNoKG1hcmtlcik7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zb2xlLmxvZyh7IGZsaWdodFBsYW5Db29yZGluYXRlcyB9KTtcblxuICAgICAgICB0aGlzLmZsaWdodFBhdGggPSBuZXcgd2luZG93W1wiZ29vZ2xlXCJdLm1hcHMuUG9seWxpbmUoe1xuICAgICAgICAgIHBhdGg6IGZsaWdodFBsYW5Db29yZGluYXRlcyxcbiAgICAgICAgICBnZW9kZXNpYzogdHJ1ZSxcbiAgICAgICAgICBzdHJva2VDb2xvcjogXCIjRkYwMDAwXCIsXG4gICAgICAgICAgc3Ryb2tlT3BhY2l0eTogMS4wLFxuICAgICAgICAgIHN0cm9rZVdlaWdodDogMlxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmZsaWdodFBhdGguc2V0TWFwKG1hcCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmZsaWdodFBhdGguc2V0TWFwKG51bGwpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgdGhpcy51cGRhdGVNYXAocHJvcHMpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgZGV2aWNlIH0gPSB0aGlzLnN0YXRlO1xuICAgIGlmICghZGV2aWNlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiBcIjEwMCVcIiwgaGVpZ2h0OiA2MDAsIGJvdHRvbTogMCB9fT5cbiAgICAgICAgICBMb2FkaW5nIE1hcC4uLlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8TWFwXG4gICAgICAgIHJlZj1cIm1hcFwiXG4gICAgICAgIGdvb2dsZT17dGhpcy5wcm9wcy5nb29nbGV9XG4gICAgICAgIHpvb209ezEyfVxuICAgICAgICBzdHlsZT17eyB3aWR0aDogXCIxMDAlXCIsIGhlaWdodDogNjAwLCBib3R0b206IDAgfX1cbiAgICAgICAgaW5pdGlhbENlbnRlcj17e1xuICAgICAgICAgIGxhdDogZGV2aWNlLmxhdGl0dWRlLFxuICAgICAgICAgIGxuZzogZGV2aWNlLmxvbmdpdHVkZVxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8TWFya2VyXG4gICAgICAgICAgb25DbGljaz17dGhpcy5vbk1hcmtlckNsaWNrfVxuICAgICAgICAgIG5hbWU9eyhkZXZpY2UudmVoaWNsZV9ubyB8fCBkZXZpY2UudXVpZCkgKyBcIiAsIFwiICsgZGV2aWNlLmFkZHJlc3N9XG4gICAgICAgICAgdGl0bGU9e2RldmljZS5hZGRyZXNzfVxuICAgICAgICAgIHBvc2l0aW9uPXt7XG4gICAgICAgICAgICBsYXQ6IGRldmljZS5sb2NhdGlvbi5sYXRpdHVkZSxcbiAgICAgICAgICAgIGxuZzogZGV2aWNlLmxvY2F0aW9uLmxvbmdpdHVkZVxuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICAgIDxJbmZvV2luZG93XG4gICAgICAgICAgbWFya2VyPXt0aGlzLnN0YXRlLmFjdGl2ZU1hcmtlcn1cbiAgICAgICAgICB2aXNpYmxlPXt0aGlzLnN0YXRlLnNob3dpbmdJbmZvV2luZG93fVxuICAgICAgICAgIG9uQ2xvc2U9e3RoaXMub25JbmZvV2luZG93Q2xvc2V9XG4gICAgICAgID5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGgxXG4gICAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7XG4gICAgICAgICAgICAgICAgX19odG1sOiB0aGlzLnN0YXRlLnNlbGVjdGVkUGxhY2UubmFtZVxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIHt0aGlzLnN0YXRlLnNlbGVjdGVkUGxhY2Uucm91dGUgPyAoXG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2VsZWN0ZWRQbGFjZS5yb3V0ZS5waG90byA/IChcbiAgICAgICAgICAgICAgICA8aW1nXG4gICAgICAgICAgICAgICAgICBzdHlsZT17eyBoZWlnaHQ6IDUwLCB3aWR0aDogNTAgfX1cbiAgICAgICAgICAgICAgICAgIHNyYz17dGhpcy5zdGF0ZS5zZWxlY3RlZFBsYWNlLnJvdXRlLnBob3RvLnVybH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApIDogbnVsbFxuICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvSW5mb1dpbmRvdz5cbiAgICAgIDwvTWFwPlxuICAgICk7XG4gIH1cbn1cbnZhciBTaW5nbGVHb29nbGVNYXBzID0gR29vZ2xlQXBpV3JhcHBlcih7XG4gIGFwaUtleTogXCJBSXphU3lBUDZ5NHNXd21ORllab2pZNDM4V3FqZVgtckswMERkRFFcIlxufSkoX1Rlc3RHb29nbGVNYXBzKTtcbi8vIDxJbmZvV2luZG93IG9uQ2xvc2U9e3RoaXMub25JbmZvV2luZG93Q2xvc2V9PlxuLy8gPGRpdj5cbi8vICAgPGgxPnt0aGlzLnN0YXRlLnNlbGVjdGVkUGxhY2UubmFtZX08L2gxPlxuLy8gPC9kaXY+XG4vLyA8L0luZm9XaW5kb3c+XG5jbGFzcyBfVGVzdEdvb2dsZU1hcHNBbGwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcbiAgb25JbmZvV2luZG93Q2xvc2UoKSB7XG4gICAgYWxlcnQoXCJvbkluZm9XaW5kb3dDbG9zZVwiKTtcbiAgfVxuXG4gIHN0YXRlID0ge1xuICAgIGFjdGl2ZU1hcmtlcjogbnVsbCxcbiAgICBzaG93aW5nSW5mb1dpbmRvdzogZmFsc2UsXG4gICAgc2VsZWN0ZWRQbGFjZToge1xuICAgICAgbmFtZTogXCJDb29sXCJcbiAgICB9XG4gIH07XG5cbiAgLy8gb25DbGljaz17dGhpcy5vbk1hcmtlckNsaWNrfVxuICAvLyBpbml0aWFsQ2VudGVyPXt7XG4gIC8vICAgbGF0OiAwLjM0NzU5NixcbiAgLy8gICBsbmc6IDMyLjU4MjUyXG4gIC8vIH19XG4gIG9uTWFya2VyQ2xpY2sgPSAocHJvcHMsIG1hcmtlciwgZSkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0ZWRQbGFjZTogcHJvcHMsXG4gICAgICBhY3RpdmVNYXJrZXI6IG1hcmtlcixcbiAgICAgIHNob3dpbmdJbmZvV2luZG93OiB0cnVlXG4gICAgfSk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgZGV2aWNlcyB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPE1hcFxuICAgICAgICBnb29nbGU9e3RoaXMucHJvcHMuZ29vZ2xlfVxuICAgICAgICB6b29tPXsxMn1cbiAgICAgICAgc3R5bGU9e3sgd2lkdGg6IFwiMTAwJVwiLCBoZWlnaHQ6IDUwMCB9fVxuICAgICAgICBpbml0aWFsQ2VudGVyPXt7XG4gICAgICAgICAgbGF0OiAwLjM0NzU5NixcbiAgICAgICAgICBsbmc6IDMyLjU4MjUyXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHtkZXZpY2VzLm1hcChkZXYgPT4ge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8TWFya2VyXG4gICAgICAgICAgICAgIG5hbWU9eyhkZXYudmVoaWNsZV9ubyB8fCBkZXYudXVpZCkgKyBcIiwgXCIgKyBkZXYuYWRkcmVzc31cbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5vbk1hcmtlckNsaWNrfVxuICAgICAgICAgICAgICB0aXRsZT17XCJUaGUgbWFya2VyYHMgdGl0bGUgd2lsbCBhcHBlYXIgYXMgYSB0b29sdGlwLlwifVxuICAgICAgICAgICAgICBwb3NpdGlvbj17e1xuICAgICAgICAgICAgICAgIGxhdDogZGV2LmxvY2F0aW9uLmxhdGl0dWRlLFxuICAgICAgICAgICAgICAgIGxuZzogZGV2LmxvY2F0aW9uLmxvbmdpdHVkZVxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApO1xuICAgICAgICB9KX1cblxuICAgICAgICA8SW5mb1dpbmRvd1xuICAgICAgICAgIG1hcmtlcj17dGhpcy5zdGF0ZS5hY3RpdmVNYXJrZXJ9XG4gICAgICAgICAgdmlzaWJsZT17dGhpcy5zdGF0ZS5zaG93aW5nSW5mb1dpbmRvd31cbiAgICAgICAgICBvbkNsb3NlPXt0aGlzLm9uSW5mb1dpbmRvd0Nsb3NlfVxuICAgICAgICA+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxoMT57dGhpcy5zdGF0ZS5zZWxlY3RlZFBsYWNlLm5hbWV9PC9oMT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9JbmZvV2luZG93PlxuICAgICAgPC9NYXA+XG4gICAgKTtcbiAgfVxufVxudmFyIEdvb2dsZU1hcHNMb2NhdGlvbnMgPSBHb29nbGVBcGlXcmFwcGVyKHtcbiAgYXBpS2V5OiBcIkFJemFTeUFQNnk0c1d3bU5GWVpvalk0MzhXcWplWC1ySzAwRGREUVwiXG59KShfVGVzdEdvb2dsZU1hcHNBbGwpO1xuXG5Ab2JzZXJ2ZXJcbmNsYXNzIExvZ2luIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PHsgYXBwOiBBcHBTdG9yZSB9LCBhbnk+IHtcbiAgTElRX0FQSV9LRVkgPSBcIjlhZmIyN2I2N2ZlMDdmXCI7XG4gIGFkZFlvID0gYWN0aW9uKCgpID0+IHtcbiAgICB0aGlzLnByb3BzLmFwcC5hcHBOYW1lICs9IFwiWU9PTyBUTyBNQVwiO1xuICB9KTtcblxuICBzZXRDdXJyZW50RGV2aWNlID0gYXN5bmMgZGV2aWNlID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZyh7IGRldmljZSB9KTtcblxuICAgIGlmICghZGV2aWNlLnJvdXRlcylcbiAgICAgIGRldmljZS5yb3V0ZXMgPSBhd2FpdCBEYXRhYmFzZS5nZXRSb3V0ZVRvZGF5KGRldmljZS5vYmplY3RJZCk7XG5cbiAgICB2YXIgZ2VvY29kZXIgPSBuZXcgd2luZG93W1wiZ29vZ2xlXCJdLm1hcHMuR2VvY29kZXIoKTtcbiAgICAvLyBjb25zb2xlLmxvZyh7IGdlb2NvZGVyIH0pO1xuICAgIHZhciBsYXRsbmcgPSB7XG4gICAgICBsYXQ6IHBhcnNlRmxvYXQoZGV2aWNlLmxhdGl0dWRlKSxcbiAgICAgIGxuZzogcGFyc2VGbG9hdChkZXZpY2UubG9uZ2l0dWRlKVxuICAgIH07XG4gICAgaWYgKCFkZXZpY2UuYWRkcmVzcykge1xuICAgICAgZ2VvY29kZXIuZ2VvY29kZSh7IGxvY2F0aW9uOiBsYXRsbmcgfSwgKHJlc3VsdHMsIHN0YXR1cykgPT4ge1xuICAgICAgICBkZXZpY2UuYWRkcmVzcyA9IHJlc3VsdHNbMF0gPyByZXN1bHRzWzBdLmZvcm1hdHRlZF9hZGRyZXNzIDogXCJcIjtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnREZXZpY2U6IGRldmljZSB9KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB0aGlzLnNldFN0YXRlKHsgY3VycmVudERldmljZTogZGV2aWNlIH0pO1xuICB9O1xuXG4gIHN0YXRlID0ge1xuICAgIGRldmljZXM6IFtdLFxuICAgIGdyb3VwczogW10sXG4gICAgY3VycmVudFJvdXRlOiB7IHBob3RvOiB7fSB9LFxuICAgIGN1cnJlbnREZXZpY2U6IHtcbiAgICAgIHV1aWQ6IG51bGwsXG4gICAgICB1cGRhdGVkQXQ6IG51bGwsXG4gICAgICB2ZWhpY2xlX25vOiBudWxsLFxuICAgICAgYWRkcmVzczogbnVsbCxcbiAgICAgIHBob3RvOiB7IHVybDogbnVsbCB9LFxuICAgICAgc25hcHNob3RzRW5hYmxlZDogZmFsc2UsXG4gICAgICBvYmplY3RJZDogbnVsbFxuICAgIH1cbiAgfTtcbiAgYXN5bmMgZ2V0RGV2aWNlcygpIHtcbiAgICAvL0dldCBhbmQgZGlzcGxheSBkZXZpY2VzXG4gICAgLy8gYWxlcnQoXCJnZXR0aW5nIGRldmljZXMhIVwiKTtcbiAgICB2YXIgZGV2aWNlcyA9IGF3YWl0IERhdGFiYXNlLmZldGNoRGV2aWNlcygpO1xuICAgIHRoaXMuc2V0U3RhdGUoeyBkZXZpY2VzIH0pO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5nZXREZXZpY2VzKCk7XG4gICAgdGhpcy5yZWZyZXNoR3JvdXBzKCk7XG4gIH1cblxuICBhc3luYyByZWZyZXNoR3JvdXBzKCkge1xuICAgIHZhciBncm91cHMgPSBhd2FpdCBEYXRhYmFzZS5nZXRHcm91cHMoKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGdyb3VwczogZ3JvdXBzLm1hcChrID0+IGsudG9KU09OKCkpLm1hcChrID0+ICh7XG4gICAgICAgIGtleTogay5vYmplY3RJZCxcbiAgICAgICAgdGV4dDogay5uYW1lLFxuICAgICAgICB2YWx1ZTogay5vYmplY3RJZFxuICAgICAgfSkpXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgZGV2aWNlcywgY3VycmVudERldmljZSB9ID0gdGhpcy5zdGF0ZTtcbiAgICByZXR1cm4gKFxuICAgICAgPFZpZXc+XG4gICAgICAgIDxWaWV3IHN0eWxlPXt7IGZsZXg6IDEsIGZsZXhEaXJlY3Rpb246IFwicm93XCIgfX0+XG4gICAgICAgICAgPFZpZXdcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cIlwiXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxuICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiBcInJvd1wiLFxuICAgICAgICAgICAgICB3aWR0aDogXCI2MCVcIixcbiAgICAgICAgICAgICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcImJsYWNrXCIsXG4gICAgICAgICAgICAgIHBhZGRpbmc6IDVcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFZpZXcgc3R5bGU9e3sgZmxleDogMS41LCBjb2xvcjogXCJ3aGl0ZVwiIH19PlxuICAgICAgICAgICAgICA8VGV4dD5EZXZpY2UgSUQ8L1RleHQ+XG4gICAgICAgICAgICA8L1ZpZXc+XG4gICAgICAgICAgICA8VmlldyBzdHlsZT17eyBmbGV4OiAxLCBjb2xvcjogXCJ3aGl0ZVwiIH19PlxuICAgICAgICAgICAgICA8VGV4dD5MYXN0IE9ubGluZTwvVGV4dD5cbiAgICAgICAgICAgIDwvVmlldz5cbiAgICAgICAgICAgIDxWaWV3IHN0eWxlPXt7IGZsZXg6IDAuNSwgY29sb3I6IFwid2hpdGVcIiB9fT5cbiAgICAgICAgICAgICAgPFRleHQ+VmVoaWNsZTwvVGV4dD5cbiAgICAgICAgICAgIDwvVmlldz5cbiAgICAgICAgICAgIDxWaWV3IHN0eWxlPXt7IGZsZXg6IDEsIGNvbG9yOiBcIndoaXRlXCIgfX0+XG4gICAgICAgICAgICAgIDxUZXh0PiBMYXN0IExvY2F0aW9uIChMbmcsTGF0KTwvVGV4dD5cbiAgICAgICAgICAgIDwvVmlldz5cbiAgICAgICAgICA8L1ZpZXc+XG4gICAgICAgICAgPFZpZXdcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cIlwiXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxuICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiBcInJvd1wiLFxuICAgICAgICAgICAgICB3aWR0aDogXCI2MCVcIixcbiAgICAgICAgICAgICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcImRhcmtibHVlXCIsXG4gICAgICAgICAgICAgIHBhZGRpbmc6IDVcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFZpZXcgc3R5bGU9e3sgZmxleDogMS41LCBjb2xvcjogXCJ3aGl0ZVwiIH19PlxuICAgICAgICAgICAgICA8VGV4dD5EZXZpY2UgSW5mb3JtYXRpb248L1RleHQ+XG4gICAgICAgICAgICA8L1ZpZXc+XG4gICAgICAgICAgPC9WaWV3PlxuICAgICAgICA8L1ZpZXc+XG4gICAgICAgIDxWaWV3XG4gICAgICAgICAgY2xhc3NOYW1lPVwiY29udGFpbmVyLWZsdWlkXCJcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgaGVpZ2h0OiBcImF1dG9cIixcbiAgICAgICAgICAgIG92ZXJmbG93OiBcImhpZGRlblwiLFxuICAgICAgICAgICAgcGFkZGluZzogMixcbiAgICAgICAgICAgIGZsZXg6IDAuNSxcbiAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246IFwicm93XCJcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFZpZXcgY2xhc3NOYW1lPVwiY29sLW1kLThcIiBzdHlsZT17eyBmbGV4OiAwLjYgfX0+XG4gICAgICAgICAgICA8Vmlld1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGZsb2F0OiBcIm5vbmVcIiAvKiBub3QgbmVlZGVkLCBqdXN0IGZvciBjbGFyaWZpY2F0aW9uICovLFxuICAgICAgICAgICAgICAgIC8qIHRoZSBuZXh0IHByb3BzIGFyZSBtZWFudCB0byBrZWVwIHRoaXMgYmxvY2sgaW5kZXBlbmRlbnQgZnJvbSB0aGUgb3RoZXIgZmxvYXRlZCBvbmUgKi9cbiAgICAgICAgICAgICAgICB3aWR0aDogXCJhdXRvXCIsXG4gICAgICAgICAgICAgICAgb3ZlcmZsb3c6IFwic2Nyb2xsXCIsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBcIjkwJVwiLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogXCIjRkFGQUZBXCJcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFNjcm9sbFZpZXcgc3R5bGU9e3sgZmxleDogMSwgd2lkdGg6IFwiMTAwJVwiLCBoZWlnaHQ6IDgwMCB9fT5cbiAgICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5kZXZpY2VzLm1hcChkZXZpY2UgPT4ge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgPFZpZXdcbiAgICAgICAgICAgICAgICAgICAgICBrZXk9e2RldmljZS51dWlkfVxuICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRldmljZS51dWlkID09IGN1cnJlbnREZXZpY2UudXVpZCA/IFwibGlnaHRncmF5XCIgOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogXCJyb3dcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsZXg6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW46IDIsXG4gICAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCJcbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMuc2V0Q3VycmVudERldmljZShkZXZpY2UpfVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPHRoIHNjb3BlPVwicm93XCIgc3R5bGU9e3sgdGV4dEFsaWduOiBcImxlZnRcIiwgZmxleDogMS41IH19PlxuICAgICAgICAgICAgICAgICAgICAgICAge2RldmljZS51dWlkfVxuICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPXt7IHRleHRBbGlnbjogXCJsZWZ0XCIsIGZsZXg6IDEgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7bmV3IERhdGUoZGV2aWNlLnVwZGF0ZWRBdCkudG9Mb2NhbGVTdHJpbmcoKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgIDx0ZFxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBmbGV4OiAwLjUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogXCJkYXJrZ3JlZW5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwid2hpdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAxNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogNVxuICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICB7ZGV2aWNlLnZlaGljbGVfbm99XG4gICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9e3sgdGV4dEFsaWduOiBcImNlbnRlclwiLCBmbGV4OiAxIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAge3JvdW5kKGRldmljZS5sb2NhdGlvbi5sb25naXR1ZGUsIDIpfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtyb3VuZChkZXZpY2UubG9jYXRpb24ubGF0aXR1ZGUsIDIpfVxuICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvVmlldz5cbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgIDwvU2Nyb2xsVmlldz5cbiAgICAgICAgICAgIDwvVmlldz5cbiAgICAgICAgICA8L1ZpZXc+XG4gICAgICAgICAgPERldmljZUluZm9cbiAgICAgICAgICAgIGdyb3Vwcz17dGhpcy5zdGF0ZS5ncm91cHN9XG4gICAgICAgICAgICBjdXJyZW50RGV2aWNlPXtjdXJyZW50RGV2aWNlfVxuICAgICAgICAgICAgZGV2aWNlcz17ZGV2aWNlc31cbiAgICAgICAgICAgIGN1cnJlbnRSb3V0ZT17dGhpcy5zdGF0ZS5jdXJyZW50Um91dGV9XG4gICAgICAgICAgICB1cGRhdGVWZWhpY2xlTmFtZT17bmV3TmFtZSA9PiB7XG4gICAgICAgICAgICAgIHZhciB7IGN1cnJlbnREZXZpY2UgfSA9IHRoaXMuc3RhdGU7XG4gICAgICAgICAgICAgIGN1cnJlbnREZXZpY2UudmVoaWNsZV9ubyA9IG5ld05hbWU7XG4gICAgICAgICAgICAgIERhdGFiYXNlLnNldFZlaGljbGUoY3VycmVudERldmljZS5vYmplY3RJZCwgbmV3TmFtZSk7XG4gICAgICAgICAgICAgIHRoaXMuc2V0Q3VycmVudERldmljZShjdXJyZW50RGV2aWNlKTtcbiAgICAgICAgICAgICAgdGhpcy5nZXREZXZpY2VzKCk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgdXBkYXRlVmVoaWNsZUdyb3VwPXtuZXdHcm91cCA9PiB7XG4gICAgICAgICAgICAgIHZhciB7IGN1cnJlbnREZXZpY2UgfSA9IHRoaXMuc3RhdGU7XG4gICAgICAgICAgICAgIERhdGFiYXNlLnNldFZlaGljbGVHcm91cChjdXJyZW50RGV2aWNlLm9iamVjdElkLCBuZXdHcm91cCk7XG4gICAgICAgICAgICAgIGlmICghY3VycmVudERldmljZS5ncm91cCkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnREZXZpY2UuZ3JvdXAgPSB7fTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjdXJyZW50RGV2aWNlLmdyb3VwLm9iamVjdElkID0gbmV3R3JvdXA7XG4gICAgICAgICAgICAgIHRoaXMuc2V0Q3VycmVudERldmljZShjdXJyZW50RGV2aWNlKTtcbiAgICAgICAgICAgICAgdGhpcy5nZXREZXZpY2VzKCk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgdG9nZ2xlU25hcHNob3RzPXsoKSA9PiB7XG4gICAgICAgICAgICAgIHZhciB7IGN1cnJlbnREZXZpY2UgfSA9IHRoaXMuc3RhdGU7XG4gICAgICAgICAgICAgIGN1cnJlbnREZXZpY2Uuc25hcHNob3RzRW5hYmxlZCA9ICFjdXJyZW50RGV2aWNlLnNuYXBzaG90c0VuYWJsZWQ7XG4gICAgICAgICAgICAgIERhdGFiYXNlLnNldFNuYXBob3RzKFxuICAgICAgICAgICAgICAgIGN1cnJlbnREZXZpY2Uub2JqZWN0SWQsXG4gICAgICAgICAgICAgICAgY3VycmVudERldmljZS5zbmFwc2hvdHNFbmFibGVkXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIHRoaXMuc2V0Q3VycmVudERldmljZShjdXJyZW50RGV2aWNlKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBjaGFuZ2VSb3V0ZT17YXN5bmMgb3AgPT4ge1xuICAgICAgICAgICAgICB2YXIgbG9jYXRpb24gPSBhd2FpdCBmZXRjaChcbiAgICAgICAgICAgICAgICBgaHR0cHM6Ly9sb2NhdGlvbmlxLm9yZy92MS9yZXZlcnNlLnBocD9mb3JtYXQ9anNvbiZrZXk9JHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuTElRX0FQSV9LRVlcbiAgICAgICAgICAgICAgICB9JmxhdD0ke29wLmxvY2F0aW9uLmxhdGl0dWRlfSZsb249JHtvcC5sb2NhdGlvbi5sb25naXR1ZGV9YFxuICAgICAgICAgICAgICApLnRoZW4oayA9PiBrLmpzb24oKSk7XG4gICAgICAgICAgICAgIG9wLmFjdHVhbExvY2F0aW9uID0gbG9jYXRpb24uZGlzcGxheV9uYW1lO1xuICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudFJvdXRlOiBvcCB9KTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9WaWV3PlxuICAgICAgPC9WaWV3PlxuICAgICk7XG4gIH1cbn1cblxuZnVuY3Rpb24gRGV2aWNlSW5mbyh7XG4gIGN1cnJlbnREZXZpY2UsXG4gIGRldmljZXMsXG4gIGN1cnJlbnRSb3V0ZSxcbiAgY2hhbmdlUm91dGUsXG4gIHRvZ2dsZVNuYXBzaG90cyxcbiAgdXBkYXRlVmVoaWNsZU5hbWUsXG4gIHVwZGF0ZVZlaGljbGVHcm91cCxcbiAgZ3JvdXBzXG59KSB7XG4gIC8vIGNvbnNvbGUubG9nKHsgY3VycmVudERldmljZSB9KVxuXG4gIHJldHVybiAoXG4gICAgPFZpZXdcbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogXCIjRUZFRkVGXCIsXG4gICAgICAgIGZsZXg6IDAuNFxuICAgICAgfX1cbiAgICA+XG4gICAgICB7Y3VycmVudERldmljZS51dWlkID8gKFxuICAgICAgICA8Vmlldz5cbiAgICAgICAgICA8Vmlld1xuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcIiNFRkVGRUZcIixcbiAgICAgICAgICAgICAgZmxleDogMSxcbiAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogXCJyb3dcIlxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8VmlldyBzdHlsZT17eyBmbGV4OiAxLCBwYWRkaW5nOiA1IH19PlxuICAgICAgICAgICAgICA8Yj5EZXZpY2U6PC9iPlxuICAgICAgICAgICAgICA8cD57Y3VycmVudERldmljZS51dWlkfTwvcD5cbiAgICAgICAgICAgICAgPGI+VmVoaWNsZTo8L2I+XG4gICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgIDxJbmxpbmVFZGl0XG4gICAgICAgICAgICAgICAgICBhY3RpdmVDbGFzc05hbWU9XCJlZGl0aW5nXCJcbiAgICAgICAgICAgICAgICAgIHRleHQ9e2N1cnJlbnREZXZpY2UudmVoaWNsZV9ub31cbiAgICAgICAgICAgICAgICAgIHBhcmFtTmFtZT1cIm1lc3NhZ2VcIlxuICAgICAgICAgICAgICAgICAgb25TZWxlY3Q9eygpID0+IHt9fVxuICAgICAgICAgICAgICAgICAgY2hhbmdlPXtlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlVmVoaWNsZU5hbWUoZVtcIm1lc3NhZ2VcIl0pO1xuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogXCJncmF5XCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIndoaXRlXCIsXG4gICAgICAgICAgICAgICAgICAgIC8vIG1pbldpZHRoOiAxNTAsXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiaW5saW5lLWJsb2NrXCIsXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbjogMCxcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogMTAsXG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxNSxcbiAgICAgICAgICAgICAgICAgICAgb3V0bGluZTogMCxcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAwXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPEZvcm0uRmllbGQ+XG4gICAgICAgICAgICAgICAgICA8bGFiZWw+Q3VycmVudCBHcm91cDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8RHJvcGRvd25cbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWxlY3QgR3JvdXBcIlxuICAgICAgICAgICAgICAgICAgICBmbHVpZFxuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2N1cnJlbnREZXZpY2UuZ3JvdXAgJiYgY3VycmVudERldmljZS5ncm91cC5vYmplY3RJZH1cbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlLCBkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coeyBkYXRhIH0pO1xuICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuc2V0U3RhdGUoeyBzZWxlY3RlZEdyb3VwOiBkYXRhLnZhbHVlIH0pO1xuICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVZlaGljbGVHcm91cChkYXRhLnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucz17Z3JvdXBzfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L0Zvcm0uRmllbGQ+XG4gICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgPGI+TGFzdCBBZGRyZXNzOjwvYj5cbiAgICAgICAgICAgICAgPHA+e2N1cnJlbnREZXZpY2UuYWRkcmVzc308L3A+XG4gICAgICAgICAgICAgIDxiPkxhdGVzdCBTbmFwOiA8L2I+XG4gICAgICAgICAgICAgIHtjdXJyZW50RGV2aWNlLnBob3RvID8gKFxuICAgICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyB3aWR0aDogMTAwLCBoZWlnaHQ6IDEwMCB9fVxuICAgICAgICAgICAgICAgICAgICBzcmM9e2N1cnJlbnREZXZpY2UucGhvdG8udXJsfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDxwPntuZXcgRGF0ZShjdXJyZW50RGV2aWNlLnVwZGF0ZWRBdCkudG9UaW1lU3RyaW5nKCl9PC9wPlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgIDxiPlRvZ2dsZSBTbmFwc2hvdHM6PC9iPlxuICAgICAgICAgICAgICAgIDxwXG4gICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogNTAsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMjAsXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogY3VycmVudERldmljZS5zbmFwc2hvdHNFbmFibGVkXG4gICAgICAgICAgICAgICAgICAgICAgPyBcImdyZWVuXCJcbiAgICAgICAgICAgICAgICAgICAgICA6IFwicmVkXCIsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlckJvdHRvbUxlZnRSYWRpdXM6IDUsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlclRvcFJpZ2h0UmFkaXVzOiA1LFxuICAgICAgICAgICAgICAgICAgICBib3JkZXJCb3R0b21SaWdodFJhZGl1czogNSxcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyVG9wTGVmdFJhZGl1czogNSxcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogNSxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwid2hpdGVcIixcbiAgICAgICAgICAgICAgICAgICAgdGV4dEFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICAgICAgICAgICAgICBjdXJzb3I6IFwicG9pbnRlclwiXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17dG9nZ2xlU25hcHNob3RzfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHtjdXJyZW50RGV2aWNlLnNuYXBzaG90c0VuYWJsZWQgPyBcIk9OXCIgOiBcIk9GRlwifVxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9WaWV3PlxuICAgICAgICAgICAgPFZpZXdcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBmbGV4OiAxLFxuICAgICAgICAgICAgICAgIGJvcmRlckxlZnRTdHlsZTogXCJzb2xpZFwiLFxuICAgICAgICAgICAgICAgIGJvcmRlckxlZnRXaWR0aDogMixcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiA1XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxUZXh0PlxuICAgICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgICAgPGI+TW92ZW1lbnQgJiBTbmFwc2hvdHM8L2I+XG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgIDxzZWxlY3RcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtvcCA9PiBjaGFuZ2VSb3V0ZShKU09OLnBhcnNlKG9wLnRhcmdldC52YWx1ZSkpfVxuICAgICAgICAgICAgICAgICAgdmFsdWU9e2N1cnJlbnRSb3V0ZS5vYmplY3RJZH1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8b3B0aW9uPiAtLSBTZWxlY3QgLS0gPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICB7Y3VycmVudERldmljZS5yb3V0ZXMubWFwKHJvdXRlID0+IChcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17SlNPTi5zdHJpbmdpZnkocm91dGUpfT5cbiAgICAgICAgICAgICAgICAgICAgICB7bmV3IERhdGUocm91dGUuY3JlYXRlZEF0KS50b1RpbWVTdHJpbmcoKX1cbiAgICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICA8Yj5Mb2NhdGlvbjogPC9iPlxuICAgICAgICAgICAgICA8VGV4dD57Y3VycmVudFJvdXRlLmFjdHVhbExvY2F0aW9ufSA8L1RleHQ+XG4gICAgICAgICAgICAgIDxpbWdcbiAgICAgICAgICAgICAgICBzcmM9e1xuICAgICAgICAgICAgICAgICAgY3VycmVudFJvdXRlICYmIGN1cnJlbnRSb3V0ZS5waG90b1xuICAgICAgICAgICAgICAgICAgICA/IGN1cnJlbnRSb3V0ZS5waG90by51cmxcbiAgICAgICAgICAgICAgICAgICAgOiBcIlwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiBcIjEwMCVcIiB9fVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9WaWV3PlxuICAgICAgICAgIDwvVmlldz5cbiAgICAgICAgICA8VmlldyBzdHlsZT17eyBmbGV4OiAxIH19PlxuICAgICAgICAgICAgPFNpbmdsZUdvb2dsZU1hcHMgZGV2aWNlPXtjdXJyZW50RGV2aWNlfSAvPlxuICAgICAgICAgIDwvVmlldz5cbiAgICAgICAgPC9WaWV3PlxuICAgICAgKSA6IChcbiAgICAgICAgPGRpdlxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiI0VGRUZFRlwiXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxUZXh0PkFMTCBERVZJQ0VTIC0tIExhc3QgTG9jYXRpb248L1RleHQ+XG4gICAgICAgICAgPEdvb2dsZU1hcHNMb2NhdGlvbnMgZGV2aWNlcz17ZGV2aWNlc30gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgIDwvVmlldz5cbiAgKTtcbn1cbmV4cG9ydCBkZWZhdWx0IG9ic2VydmVyKENvbXBvc2VkQ29tcG9uZW50KExvZ2luKSk7XG4iXX0=