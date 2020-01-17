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
            console.log({ device, mapref, refmap: this.refs.map });
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
            var routes = device.routes; //await Database.getRouteToday(device.objectId);
            //Get all movements today
            // var flightPlanCoordinates = [
            //   { lat: 37.772, lng: -122.214 },
            //   { lat: 21.291, lng: -157.821 },
            //   { lat: -18.142, lng: 178.431 },
            //   { lat: -27.467, lng: 153.027 }
            // ];
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
            console.log({ device });
            if (!device.routes)
                device.routes = yield Database_1.Database.getRouteToday(device.objectId);
            var geocoder = new window["google"].maps.Geocoder();
            console.log({ geocoder });
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
                React.createElement(DeviceInfo, { currentDevice: currentDevice, devices: devices, currentRoute: this.state.currentRoute, updateVehicleName: newName => {
                        var { currentDevice } = this.state;
                        currentDevice.vehicle_no = newName;
                        Database_1.Database.setVehicle(currentDevice.objectId, newName);
                        this.setCurrentDevice(currentDevice);
                    }, toggleSnapshots: () => {
                        var { currentDevice } = this.state;
                        currentDevice.snapshotsEnabled = !currentDevice.snapshotsEnabled;
                        Database_1.Database.setSnaphots(currentDevice.objectId, currentDevice.snapshotsEnabled);
                        this.setCurrentDevice(currentDevice);
                    }, changeRoute: (op) => __awaiter(this, void 0, void 0, function* () {
                        var location = yield fetch(`https://locationiq.org/v1/reverse.php?format=json&key=${this
                            .LIQ_API_KEY}&lat=${op.location.latitude}&lon=${op.location
                            .longitude}`).then(k => k.json());
                        op.actualLocation = location.display_name;
                        this.setState({ currentRoute: op });
                    }) }))));
    }
};
Login = __decorate([
    mobx_react_1.observer
], Login);
function DeviceInfo({ currentDevice, devices, currentRoute, changeRoute, toggleSnapshots, updateVehicleName }) {
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
                        } })),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2aWNlcy4xLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGV2aWNlcy4xLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsK0JBQStCO0FBRS9CLHVEQUFrRTtBQUNsRSw2Q0FBdUQ7QUFVdkQsNEVBQThEO0FBRzlELCtCQUE4QjtBQUU5QiwyQ0FBOEM7QUFFOUMsc0NBQXNDO0FBRXRDLHVDQUF1QztBQUN2QyxzREFBc0Q7QUFDdEQseUJBQXlCO0FBRXpCLElBQUk7QUFFSixzRUFJb0QsQ0FBQyxtQ0FBbUM7QUFDeEYsSUFBSSxFQUFDLFFBQVEsRUFBQyxHQUFHLE9BQU8sQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO0FBQ3ZFLDRDQUE0QztBQUM1QyxzRUFBNkQ7QUFFN0Qsa0NBQWtDO0FBQ2xDLHFEQUFrRDtBQUNsRCxvQ0FBb0M7QUFDcEMsK0RBQStEO0FBRS9ELGVBQXNCLEtBQUssRUFBRSxRQUFRO0lBQ25DLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxHQUFHLFFBQVEsQ0FBUSxDQUFDLEdBQUcsSUFBSSxHQUFHLFFBQVEsQ0FBQyxDQUFDO0FBQy9FLENBQUM7QUFGRCxzQkFFQztBQUVELGNBQWMsQ0FBQztJQUNiLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQ25ELENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3hELE9BQU8sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDckIsQ0FBQztBQUVE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eUNvbXBvbmVudCBmcm9tIFwiLi4vY29tcG9uZW50cy9NeUNvbXBvbmVudFwiO1xuaW1wb3J0IHsgVmlldywgVGV4dCwgQnV0dG9uLCBTY3JvbGxWaWV3IH0gZnJvbSBcInJlYWN0LW5hdGl2ZS13ZWJcIjtcbmltcG9ydCB7IENvbXBvc2VkQ29tcG9uZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvUGFnZVwiO1xuaW1wb3J0IHtcbiAgVGFibGUsXG4gIFRhYmxlV3JhcHBlcixcbiAgUm93LFxuICBSb3dzLFxuICBDb2wsXG4gIENvbHMsXG4gIENlbGxcbn0gZnJvbSBcInJlYWN0LW5hdGl2ZS10YWJsZS1jb21wb25lbnRcIjtcbmltcG9ydCBJbmxpbmVFZGl0IGZyb20gXCIuLi9jb21wb25lbnRzL2xpYnMvcmVhY3QtZWRpdC1pbmxpbmVcIjtcblxuaW1wb3J0IHsgQXBwU3RvcmUgfSBmcm9tIFwiLi4vc3RvcmVzL2FwcFN0b3JlXCI7XG5pbXBvcnQgeyBhY3Rpb24gfSBmcm9tIFwibW9ieFwiO1xuXG5pbXBvcnQgeyBpbmplY3QsIG9ic2VydmVyIH0gZnJvbSBcIm1vYngtcmVhY3RcIjtcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSBcInByb3AtdHlwZXNcIjtcbmltcG9ydCAqIGFzIFJlYWN0RE9NIGZyb20gXCJyZWFjdC1kb21cIjtcblxuLy8gaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4vLyAgIGdsb2JhbC53aW5kb3cgPSB7ZG9jdW1lbnQ6e2NyZWF0ZUVsZW1lbnQ6KCk9Pnt9fX1cbi8vICAgZ2xvYmFsLmRvY3VtZW50ID0ge31cblxuLy8gfVxuXG5pbXBvcnQge1xuICBHb29nbGVBcGlXcmFwcGVyLFxuICBNYXJrZXIsXG4gIEluZm9XaW5kb3dcbn0gZnJvbSBcIi4uL2NvbXBvbmVudHMvbGlicy9nb29nbGUtbWFwcy1yZWFjdC9pbmRleFwiOyAvL1wiLi4vbGlicmFyaWVzL2dvb2dsZS1tYXBzLXJlYWN0XCI7XG52YXIge1BvbHlsaW5lfSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2xpYnMvZ29vZ2xlLW1hcHMtcmVhY3QvaW5kZXhcIik7XG4vLyBpbXBvcnQgTWFwIGZyb20gXCJnb29nbGUtbWFwcy1yZWFjdC1pcmlvXCI7XG5pbXBvcnQgTWFwIGZyb20gXCIuLi9jb21wb25lbnRzL2xpYnMvZ29vZ2xlLW1hcHMtcmVhY3QvaW5kZXhcIjtcblxuLy8gaW1wb3J0ICogYXMgUGFyc2UgZnJvbSBcInBhcnNlXCI7XG5pbXBvcnQgeyBEYXRhYmFzZSB9IGZyb20gXCIuLi9jb21wb25lbnRzL0RhdGFiYXNlXCI7XG4vLyBQYXJzZS5pbml0aWFsaXplKFwiQUJDREVGRzEyMzQ1XCIpO1xuLy8gUGFyc2Uuc2VydmVyVVJMID0gXCJodHRwOi8vcHNpZ24uaXJpb3N5c3RlbXMuY29tOjEzODAvcGFyc2VcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHJvdW5kKHZhbHVlLCBkZWNpbWFscykge1xuICByZXR1cm4gTnVtYmVyKE1hdGgucm91bmQoKHZhbHVlICsgXCJlXCIgKyBkZWNpbWFscykgYXMgYW55KSArIFwiZS1cIiArIGRlY2ltYWxzKTtcbn1cblxuZnVuY3Rpb24gdGltZShkKSB7XG4gIHZhciBoID0gKGQuZ2V0SG91cnMoKSA8IDEwID8gXCIwXCIgOiBcIlwiKSArIGQuZ2V0SG91cnMoKSxcbiAgICBtID0gKGQuZ2V0TWludXRlcygpIDwgMTAgPyBcIjBcIiA6IFwiXCIpICsgZC5nZXRNaW51dGVzKCk7XG4gIHJldHVybiBoICsgXCI6XCIgKyBtO1xufVxuXG5jbGFzcyBfVGVzdEdvb2dsZU1hcHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcbiAgbWFya2VycyA9IFtdO1xuICBmbGlnaHRQYXRoOiBhbnk7XG4gIG9uSW5mb1dpbmRvd0Nsb3NlKCkge1xuICAgIC8vIGFsZXJ0KFwib25JbmZvV2luZG93Q2xvc2VcIik7XG4gIH1cblxuICBvbk1hcmtlckNsaWNrID0gKHByb3BzLCBtYXJrZXIsIGUpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIm1hcmtlciBjbGlja2VkXCIsIHsgbWFya2VyLCBwcm9wcywgZSB9KTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGVkUGxhY2U6IHByb3BzLFxuICAgICAgYWN0aXZlTWFya2VyOiBtYXJrZXIsXG4gICAgICBzaG93aW5nSW5mb1dpbmRvdzogdHJ1ZVxuICAgIH0pO1xuICB9O1xuXG4gIHN0YXRlID0ge1xuICAgIGFjdGl2ZU1hcmtlcjpudWxsLFxuICAgIHNlbGVjdGVkUGxhY2U6IHtcbiAgICAgIG5hbWU6IFwiQ29vbFwiLFxuICAgICAgcm91dGU6bnVsbFxuICAgIH0sXG4gICAgZGV2aWNlOiBudWxsLFxuICAgIHNob3dpbmdJbmZvV2luZG93OiBmYWxzZVxuICB9O1xuXG4gIC8vIG9uQ2xpY2s9e3RoaXMub25NYXJrZXJDbGlja31cbiAgLy8gaW5pdGlhbENlbnRlcj17e1xuICAvLyAgIGxhdDogMC4zNDc1OTYsXG4gIC8vICAgbG5nOiAzMi41ODI1MlxuICAvLyB9fVxuXG4gIGNsZWFyTWFya2VycyA9ICgpID0+IHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG1hcmtlciA9IHRoaXMubWFya2Vyc1tpXTtcbiAgICAgIHRyeSB7XG4gICAgICAgIG1hcmtlci5zZXRNYXAobnVsbCk7XG4gICAgICAgIHdpbmRvd1tcImdvb2dsZVwiXS5tYXBzLmV2ZW50LnJlbW92ZUxpc3RlbmVyKG1hcmtlciwgXCJjbGlja1wiKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgfVxuICAgIHRoaXMubWFya2VycyA9IG5ldyBBcnJheSgpO1xuICB9O1xuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMudXBkYXRlTWFwKHRoaXMucHJvcHMpO1xuICB9XG5cbiAgYXN5bmMgdXBkYXRlTWFwKHByb3BzKSB7XG4gICAgdmFyIGRldmljZSA9IHByb3BzLmRldmljZTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGRldmljZVxuICAgIH0pO1xuXG4gICAgaWYgKCF0aGlzLnJlZnMubWFwKSByZXR1cm47XG5cbiAgICB2YXIgbWFwcmVmID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcy5yZWZzLm1hcCk7XG5cbiAgICBjb25zb2xlLmxvZyh7IGRldmljZSwgbWFwcmVmLCByZWZtYXA6IHRoaXMucmVmcy5tYXAgfSk7XG5cbiAgICB2YXIgbWFwID0gdGhpcy5yZWZzLm1hcFtcIm1hcFwiXTtcblxuICAgIG1hcC5zZXRDZW50ZXIoe1xuICAgICAgbGF0OiBwYXJzZUZsb2F0KGRldmljZS5sb2NhdGlvbi5sYXRpdHVkZSksXG4gICAgICBsbmc6IHBhcnNlRmxvYXQoZGV2aWNlLmxvY2F0aW9uLmxvbmdpdHVkZSlcbiAgICB9KTtcbiAgICB0aGlzLmNsZWFyTWFya2VycygpO1xuICAgIC8vIG5ldyB3aW5kb3dbXCJnb29nbGVcIl0ubWFwcy5NYXAobWFwcmVmLCB7XG4gICAgLy8gICB6b29tOiAxMixcbiAgICAvLyAgIGNlbnRlcjogeyBsYXQ6IHBhcnNlRmxvYXQoZGV2aWNlLmxhdGl0dWRlKSwgbG5nOiBwYXJzZUZsb2F0KGRldmljZS5sb25naXR1ZGUpIH1cbiAgICAvLyAgIC8vIG1hcFR5cGVJZDogXCJ0ZXJyYWluXCJcbiAgICAvLyB9KTtcblxuICAgIHZhciByb3V0ZXMgPSBkZXZpY2Uucm91dGVzOyAvL2F3YWl0IERhdGFiYXNlLmdldFJvdXRlVG9kYXkoZGV2aWNlLm9iamVjdElkKTtcbiAgICAvL0dldCBhbGwgbW92ZW1lbnRzIHRvZGF5XG4gICAgLy8gdmFyIGZsaWdodFBsYW5Db29yZGluYXRlcyA9IFtcbiAgICAvLyAgIHsgbGF0OiAzNy43NzIsIGxuZzogLTEyMi4yMTQgfSxcbiAgICAvLyAgIHsgbGF0OiAyMS4yOTEsIGxuZzogLTE1Ny44MjEgfSxcbiAgICAvLyAgIHsgbGF0OiAtMTguMTQyLCBsbmc6IDE3OC40MzEgfSxcbiAgICAvLyAgIHsgbGF0OiAtMjcuNDY3LCBsbmc6IDE1My4wMjcgfVxuICAgIC8vIF07XG4gICAgaWYgKHJvdXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgZmxpZ2h0UGxhbkNvb3JkaW5hdGVzID0gcm91dGVzLm1hcChyb3V0ZSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbGF0OiBwYXJzZUZsb2F0KHJvdXRlLmxvY2F0aW9uLmxhdGl0dWRlKSxcbiAgICAgICAgICBsbmc6IHBhcnNlRmxvYXQocm91dGUubG9jYXRpb24ubG9uZ2l0dWRlKVxuICAgICAgICB9O1xuICAgICAgfSk7XG5cbiAgICAgIHJvdXRlcy5mb3JFYWNoKHJvdXRlID0+IHtcbiAgICAgICAgdmFyIG1wcm9wcyA9IHtcbiAgICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgICAgbGF0OiBwYXJzZUZsb2F0KHJvdXRlLmxvY2F0aW9uLmxhdGl0dWRlKSxcbiAgICAgICAgICAgIGxuZzogcGFyc2VGbG9hdChyb3V0ZS5sb2NhdGlvbi5sb25naXR1ZGUpXG4gICAgICAgICAgfSxcbiAgICAgICAgICByb3V0ZSxcbiAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICBsYWJlbDogdGltZShuZXcgRGF0ZShyb3V0ZS5jcmVhdGVkQXQpKSxcbiAgICAgICAgICBhbmltYXRpb246IHdpbmRvd1tcImdvb2dsZVwiXS5tYXBzLkFuaW1hdGlvbi5EUk9QLFxuICAgICAgICAgIG5hbWU6XG4gICAgICAgICAgICBcIjxiIHN0eWxlPSdjb2xvcjpibGFjazsnPlwiICtcbiAgICAgICAgICAgIHRpbWUobmV3IERhdGUocm91dGUuY3JlYXRlZEF0KSkgK1xuICAgICAgICAgICAgXCI8L2I+XCJcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIG1hcmtlciA9IG5ldyB3aW5kb3dbXCJnb29nbGVcIl0ubWFwcy5NYXJrZXIobXByb3BzKTtcbiAgICAgICAgd2luZG93W1wiZ29vZ2xlXCJdLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCBcImNsaWNrXCIsIGUgPT5cbiAgICAgICAgICB0aGlzLm9uTWFya2VyQ2xpY2sobXByb3BzLCBtYXJrZXIsIGUpXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5tYXJrZXJzLnB1c2gobWFya2VyKTtcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2coeyBmbGlnaHRQbGFuQ29vcmRpbmF0ZXMgfSk7XG5cbiAgICAgIHRoaXMuZmxpZ2h0UGF0aCA9IG5ldyB3aW5kb3dbXCJnb29nbGVcIl0ubWFwcy5Qb2x5bGluZSh7XG4gICAgICAgIHBhdGg6IGZsaWdodFBsYW5Db29yZGluYXRlcyxcbiAgICAgICAgZ2VvZGVzaWM6IHRydWUsXG4gICAgICAgIHN0cm9rZUNvbG9yOiBcIiNGRjAwMDBcIixcbiAgICAgICAgc3Ryb2tlT3BhY2l0eTogMS4wLFxuICAgICAgICBzdHJva2VXZWlnaHQ6IDJcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmZsaWdodFBhdGguc2V0TWFwKG1hcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZmxpZ2h0UGF0aC5zZXRNYXAobnVsbCk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuICAgIHRoaXMudXBkYXRlTWFwKHByb3BzKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGRldmljZSB9ID0gdGhpcy5zdGF0ZTtcbiAgICBpZiAoIWRldmljZSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogXCIxMDAlXCIsIGhlaWdodDogNjAwLCBib3R0b206IDAgfX0+XG4gICAgICAgICAgTG9hZGluZyBNYXAuLi5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPE1hcFxuICAgICAgICByZWY9XCJtYXBcIlxuICAgICAgICBnb29nbGU9e3RoaXMucHJvcHMuZ29vZ2xlfVxuICAgICAgICB6b29tPXsxMn1cbiAgICAgICAgc3R5bGU9e3sgd2lkdGg6IFwiMTAwJVwiLCBoZWlnaHQ6IDYwMCwgYm90dG9tOiAwIH19XG4gICAgICAgIGluaXRpYWxDZW50ZXI9e3tcbiAgICAgICAgICBsYXQ6IGRldmljZS5sYXRpdHVkZSxcbiAgICAgICAgICBsbmc6IGRldmljZS5sb25naXR1ZGVcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPE1hcmtlclxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMub25NYXJrZXJDbGlja31cbiAgICAgICAgICBuYW1lPXsoZGV2aWNlLnZlaGljbGVfbm8gfHwgZGV2aWNlLnV1aWQpICsgXCIgLCBcIiArIGRldmljZS5hZGRyZXNzfVxuICAgICAgICAgIHRpdGxlPXtkZXZpY2UuYWRkcmVzc31cbiAgICAgICAgICBwb3NpdGlvbj17e1xuICAgICAgICAgICAgbGF0OiBkZXZpY2UubG9jYXRpb24ubGF0aXR1ZGUsXG4gICAgICAgICAgICBsbmc6IGRldmljZS5sb2NhdGlvbi5sb25naXR1ZGVcbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgICA8SW5mb1dpbmRvd1xuICAgICAgICAgIG1hcmtlcj17dGhpcy5zdGF0ZS5hY3RpdmVNYXJrZXJ9XG4gICAgICAgICAgdmlzaWJsZT17dGhpcy5zdGF0ZS5zaG93aW5nSW5mb1dpbmRvd31cbiAgICAgICAgICBvbkNsb3NlPXt0aGlzLm9uSW5mb1dpbmRvd0Nsb3NlfVxuICAgICAgICA+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxoMVxuICAgICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTD17e1xuICAgICAgICAgICAgICAgIF9faHRtbDogdGhpcy5zdGF0ZS5zZWxlY3RlZFBsYWNlLm5hbWVcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB7dGhpcy5zdGF0ZS5zZWxlY3RlZFBsYWNlLnJvdXRlID8gKFxuICAgICAgICAgICAgICB0aGlzLnN0YXRlLnNlbGVjdGVkUGxhY2Uucm91dGUucGhvdG8gPyAoXG4gICAgICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgaGVpZ2h0OiA1MCwgd2lkdGg6IDUwIH19XG4gICAgICAgICAgICAgICAgICBzcmM9e3RoaXMuc3RhdGUuc2VsZWN0ZWRQbGFjZS5yb3V0ZS5waG90by51cmx9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgKSA6IG51bGxcbiAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0luZm9XaW5kb3c+XG4gICAgICA8L01hcD5cbiAgICApO1xuICB9XG59XG52YXIgU2luZ2xlR29vZ2xlTWFwcyA9IEdvb2dsZUFwaVdyYXBwZXIoe1xuICBhcGlLZXk6IFwiQUl6YVN5Q0h2aXhHMFZkT1ZWQm9WQmQ2ZGVUUlVqbkFEek9qWmJjXCJcbn0pKF9UZXN0R29vZ2xlTWFwcyk7XG4vLyA8SW5mb1dpbmRvdyBvbkNsb3NlPXt0aGlzLm9uSW5mb1dpbmRvd0Nsb3NlfT5cbi8vIDxkaXY+XG4vLyAgIDxoMT57dGhpcy5zdGF0ZS5zZWxlY3RlZFBsYWNlLm5hbWV9PC9oMT5cbi8vIDwvZGl2PlxuLy8gPC9JbmZvV2luZG93PlxuY2xhc3MgX1Rlc3RHb29nbGVNYXBzQWxsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XG4gIG9uSW5mb1dpbmRvd0Nsb3NlKCkge1xuICAgIGFsZXJ0KFwib25JbmZvV2luZG93Q2xvc2VcIik7XG4gIH1cblxuICBzdGF0ZSA9IHtcbiAgICBhY3RpdmVNYXJrZXI6IG51bGwsXG4gICAgc2hvd2luZ0luZm9XaW5kb3c6IGZhbHNlLFxuICAgIHNlbGVjdGVkUGxhY2U6IHtcbiAgICAgIG5hbWU6IFwiQ29vbFwiXG4gICAgfVxuICB9O1xuXG4gIC8vIG9uQ2xpY2s9e3RoaXMub25NYXJrZXJDbGlja31cbiAgLy8gaW5pdGlhbENlbnRlcj17e1xuICAvLyAgIGxhdDogMC4zNDc1OTYsXG4gIC8vICAgbG5nOiAzMi41ODI1MlxuICAvLyB9fVxuICBvbk1hcmtlckNsaWNrID0gKHByb3BzLCBtYXJrZXIsIGUpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGVkUGxhY2U6IHByb3BzLFxuICAgICAgYWN0aXZlTWFya2VyOiBtYXJrZXIsXG4gICAgICBzaG93aW5nSW5mb1dpbmRvdzogdHJ1ZVxuICAgIH0pO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGRldmljZXMgfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxNYXBcbiAgICAgICAgZ29vZ2xlPXt0aGlzLnByb3BzLmdvb2dsZX1cbiAgICAgICAgem9vbT17MTJ9XG4gICAgICAgIHN0eWxlPXt7IHdpZHRoOiBcIjEwMCVcIiwgaGVpZ2h0OiA1MDAgfX1cbiAgICAgICAgaW5pdGlhbENlbnRlcj17e1xuICAgICAgICAgIGxhdDogMC4zNDc1OTYsXG4gICAgICAgICAgbG5nOiAzMi41ODI1MlxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7ZGV2aWNlcy5tYXAoZGV2ID0+IHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPE1hcmtlclxuICAgICAgICAgICAgICBuYW1lPXsoZGV2LnZlaGljbGVfbm8gfHwgZGV2LnV1aWQpICsgXCIsIFwiICsgZGV2LmFkZHJlc3N9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMub25NYXJrZXJDbGlja31cbiAgICAgICAgICAgICAgdGl0bGU9e1wiVGhlIG1hcmtlcmBzIHRpdGxlIHdpbGwgYXBwZWFyIGFzIGEgdG9vbHRpcC5cIn1cbiAgICAgICAgICAgICAgcG9zaXRpb249e3tcbiAgICAgICAgICAgICAgICBsYXQ6IGRldi5sb2NhdGlvbi5sYXRpdHVkZSxcbiAgICAgICAgICAgICAgICBsbmc6IGRldi5sb2NhdGlvbi5sb25naXR1ZGVcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSl9XG5cbiAgICAgICAgPEluZm9XaW5kb3dcbiAgICAgICAgICBtYXJrZXI9e3RoaXMuc3RhdGUuYWN0aXZlTWFya2VyfVxuICAgICAgICAgIHZpc2libGU9e3RoaXMuc3RhdGUuc2hvd2luZ0luZm9XaW5kb3d9XG4gICAgICAgICAgb25DbG9zZT17dGhpcy5vbkluZm9XaW5kb3dDbG9zZX1cbiAgICAgICAgPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8aDE+e3RoaXMuc3RhdGUuc2VsZWN0ZWRQbGFjZS5uYW1lfTwvaDE+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvSW5mb1dpbmRvdz5cbiAgICAgIDwvTWFwPlxuICAgICk7XG4gIH1cbn1cbnZhciBHb29nbGVNYXBzTG9jYXRpb25zID0gR29vZ2xlQXBpV3JhcHBlcih7XG4gIGFwaUtleTogXCJBSXphU3lDSHZpeEcwVmRPVlZCb1ZCZDZkZVRSVWpuQUR6T2paYmNcIlxufSkoX1Rlc3RHb29nbGVNYXBzQWxsKTtcblxuQG9ic2VydmVyXG5jbGFzcyBMb2dpbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDx7IGFwcDogQXBwU3RvcmUgfSwgYW55PiB7XG4gIExJUV9BUElfS0VZID0gXCI5YWZiMjdiNjdmZTA3ZlwiO1xuICBhZGRZbyA9IGFjdGlvbigoKSA9PiB7XG4gICAgdGhpcy5wcm9wcy5hcHAuYXBwTmFtZSArPSBcIllPT08gVE8gTUFcIjtcbiAgfSk7XG5cbiAgc2V0Q3VycmVudERldmljZSA9IGFzeW5jIGRldmljZSA9PiB7XG4gICAgY29uc29sZS5sb2coeyBkZXZpY2UgfSk7XG5cbiAgICBpZiAoIWRldmljZS5yb3V0ZXMpXG4gICAgICBkZXZpY2Uucm91dGVzID0gYXdhaXQgRGF0YWJhc2UuZ2V0Um91dGVUb2RheShkZXZpY2Uub2JqZWN0SWQpO1xuXG4gICAgdmFyIGdlb2NvZGVyID0gbmV3IHdpbmRvd1tcImdvb2dsZVwiXS5tYXBzLkdlb2NvZGVyKCk7XG4gICAgY29uc29sZS5sb2coeyBnZW9jb2RlciB9KTtcbiAgICB2YXIgbGF0bG5nID0ge1xuICAgICAgbGF0OiBwYXJzZUZsb2F0KGRldmljZS5sYXRpdHVkZSksXG4gICAgICBsbmc6IHBhcnNlRmxvYXQoZGV2aWNlLmxvbmdpdHVkZSlcbiAgICB9O1xuICAgIGlmICghZGV2aWNlLmFkZHJlc3MpIHtcbiAgICAgIGdlb2NvZGVyLmdlb2NvZGUoeyBsb2NhdGlvbjogbGF0bG5nIH0sIChyZXN1bHRzLCBzdGF0dXMpID0+IHtcbiAgICAgICAgZGV2aWNlLmFkZHJlc3MgPSByZXN1bHRzWzBdID8gcmVzdWx0c1swXS5mb3JtYXR0ZWRfYWRkcmVzcyA6IFwiXCI7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBjdXJyZW50RGV2aWNlOiBkZXZpY2UgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnREZXZpY2U6IGRldmljZSB9KTtcbiAgfTtcblxuICBzdGF0ZSA9IHtcbiAgICBkZXZpY2VzOiBbXSxcbiAgICBjdXJyZW50Um91dGU6IHsgcGhvdG86IHt9IH0sXG4gICAgY3VycmVudERldmljZToge1xuICAgICAgdXVpZDogbnVsbCxcbiAgICAgIHVwZGF0ZWRBdDogbnVsbCxcbiAgICAgIHZlaGljbGVfbm86IG51bGwsXG4gICAgICBhZGRyZXNzOiBudWxsLFxuICAgICAgcGhvdG86IHsgdXJsOiBudWxsIH0sXG4gICAgICBzbmFwc2hvdHNFbmFibGVkOiBmYWxzZSxcbiAgICAgIG9iamVjdElkOiBudWxsXG4gICAgfVxuICB9O1xuICBhc3luYyBnZXREZXZpY2VzKCkge1xuICAgIC8vR2V0IGFuZCBkaXNwbGF5IGRldmljZXNcbiAgICAvLyBhbGVydChcImdldHRpbmcgZGV2aWNlcyEhXCIpO1xuICAgIHZhciBkZXZpY2VzID0gYXdhaXQgRGF0YWJhc2UuZmV0Y2hEZXZpY2VzKCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGRldmljZXMgfSk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLmdldERldmljZXMoKTtcbiAgfVxuXG4gIHB1YmxpYyByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBkZXZpY2VzLCBjdXJyZW50RGV2aWNlIH0gPSB0aGlzLnN0YXRlO1xuICAgIHJldHVybiAoXG4gICAgICA8Vmlldz5cbiAgICAgICAgPFZpZXcgc3R5bGU9e3sgZmxleDogMSwgZmxleERpcmVjdGlvbjogXCJyb3dcIiB9fT5cbiAgICAgICAgICA8Vmlld1xuICAgICAgICAgICAgY2xhc3NOYW1lPVwiXCJcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGhlaWdodDogMzAsXG4gICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246IFwicm93XCIsXG4gICAgICAgICAgICAgIHdpZHRoOiBcIjYwJVwiLFxuICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiYmxhY2tcIixcbiAgICAgICAgICAgICAgcGFkZGluZzogNVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8VmlldyBzdHlsZT17eyBmbGV4OiAxLjUsIGNvbG9yOiBcIndoaXRlXCIgfX0+XG4gICAgICAgICAgICAgIDxUZXh0PkRldmljZSBJRDwvVGV4dD5cbiAgICAgICAgICAgIDwvVmlldz5cbiAgICAgICAgICAgIDxWaWV3IHN0eWxlPXt7IGZsZXg6IDEsIGNvbG9yOiBcIndoaXRlXCIgfX0+XG4gICAgICAgICAgICAgIDxUZXh0Pkxhc3QgT25saW5lPC9UZXh0PlxuICAgICAgICAgICAgPC9WaWV3PlxuICAgICAgICAgICAgPFZpZXcgc3R5bGU9e3sgZmxleDogMC41LCBjb2xvcjogXCJ3aGl0ZVwiIH19PlxuICAgICAgICAgICAgICA8VGV4dD5WZWhpY2xlPC9UZXh0PlxuICAgICAgICAgICAgPC9WaWV3PlxuICAgICAgICAgICAgPFZpZXcgc3R5bGU9e3sgZmxleDogMSwgY29sb3I6IFwid2hpdGVcIiB9fT5cbiAgICAgICAgICAgICAgPFRleHQ+IExhc3QgTG9jYXRpb24gKExuZyxMYXQpPC9UZXh0PlxuICAgICAgICAgICAgPC9WaWV3PlxuICAgICAgICAgIDwvVmlldz5cbiAgICAgICAgICA8Vmlld1xuICAgICAgICAgICAgY2xhc3NOYW1lPVwiXCJcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGhlaWdodDogMzAsXG4gICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246IFwicm93XCIsXG4gICAgICAgICAgICAgIHdpZHRoOiBcIjYwJVwiLFxuICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiZGFya2JsdWVcIixcbiAgICAgICAgICAgICAgcGFkZGluZzogNVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8VmlldyBzdHlsZT17eyBmbGV4OiAxLjUsIGNvbG9yOiBcIndoaXRlXCIgfX0+XG4gICAgICAgICAgICAgIDxUZXh0PkRldmljZSBJbmZvcm1hdGlvbjwvVGV4dD5cbiAgICAgICAgICAgIDwvVmlldz5cbiAgICAgICAgICA8L1ZpZXc+XG4gICAgICAgIDwvVmlldz5cbiAgICAgICAgPFZpZXdcbiAgICAgICAgICBjbGFzc05hbWU9XCJjb250YWluZXItZmx1aWRcIlxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBoZWlnaHQ6IFwiYXV0b1wiLFxuICAgICAgICAgICAgb3ZlcmZsb3c6IFwiaGlkZGVuXCIsXG4gICAgICAgICAgICBwYWRkaW5nOiAyLFxuICAgICAgICAgICAgZmxleDogMC41LFxuICAgICAgICAgICAgZmxleERpcmVjdGlvbjogXCJyb3dcIlxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8VmlldyBjbGFzc05hbWU9XCJjb2wtbWQtOFwiIHN0eWxlPXt7IGZsZXg6IDAuNiB9fT5cbiAgICAgICAgICAgIDxWaWV3XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZmxvYXQ6IFwibm9uZVwiIC8qIG5vdCBuZWVkZWQsIGp1c3QgZm9yIGNsYXJpZmljYXRpb24gKi8sXG4gICAgICAgICAgICAgICAgLyogdGhlIG5leHQgcHJvcHMgYXJlIG1lYW50IHRvIGtlZXAgdGhpcyBibG9jayBpbmRlcGVuZGVudCBmcm9tIHRoZSBvdGhlciBmbG9hdGVkIG9uZSAqL1xuICAgICAgICAgICAgICAgIHdpZHRoOiBcImF1dG9cIixcbiAgICAgICAgICAgICAgICBvdmVyZmxvdzogXCJzY3JvbGxcIixcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IFwiOTAlXCIsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcIiNGQUZBRkFcIlxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8U2Nyb2xsVmlldyBzdHlsZT17eyBmbGV4OiAxLCB3aWR0aDogXCIxMDAlXCIsIGhlaWdodDogODAwIH19PlxuICAgICAgICAgICAgICAgIHt0aGlzLnN0YXRlLmRldmljZXMubWFwKGRldmljZSA9PiB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICA8Vmlld1xuICAgICAgICAgICAgICAgICAgICAgIGtleT17ZGV2aWNlLnV1aWR9XG4gICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGV2aWNlLnV1aWQgPT0gY3VycmVudERldmljZS51dWlkID8gXCJsaWdodGdyYXlcIiA6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiBcInJvd1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmxleDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbjogMixcbiAgICAgICAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIlxuICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5zZXRDdXJyZW50RGV2aWNlKGRldmljZSl9XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICA8dGggc2NvcGU9XCJyb3dcIiBzdHlsZT17eyB0ZXh0QWxpZ246IFwibGVmdFwiLCBmbGV4OiAxLjUgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7ZGV2aWNlLnV1aWR9XG4gICAgICAgICAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9e3sgdGV4dEFsaWduOiBcImxlZnRcIiwgZmxleDogMSB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtuZXcgRGF0ZShkZXZpY2UudXBkYXRlZEF0KS50b0xvY2FsZVN0cmluZygpfVxuICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZsZXg6IDAuNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcImRhcmtncmVlblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCJ3aGl0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDE1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiA1XG4gICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtkZXZpY2UudmVoaWNsZV9ub31cbiAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT17eyB0ZXh0QWxpZ246IFwiY2VudGVyXCIsIGZsZXg6IDEgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7cm91bmQoZGV2aWNlLmxvY2F0aW9uLmxvbmdpdHVkZSwgMil9LHtyb3VuZChkZXZpY2UubG9jYXRpb24ubGF0aXR1ZGUsIDIpfVxuICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvVmlldz5cbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgIDwvU2Nyb2xsVmlldz5cbiAgICAgICAgICAgIDwvVmlldz5cbiAgICAgICAgICA8L1ZpZXc+XG4gICAgICAgICAgPERldmljZUluZm9cbiAgICAgICAgICAgIGN1cnJlbnREZXZpY2U9e2N1cnJlbnREZXZpY2V9XG4gICAgICAgICAgICBkZXZpY2VzPXtkZXZpY2VzfVxuICAgICAgICAgICAgY3VycmVudFJvdXRlPXt0aGlzLnN0YXRlLmN1cnJlbnRSb3V0ZX1cbiAgICAgICAgICAgIHVwZGF0ZVZlaGljbGVOYW1lPXtuZXdOYW1lID0+IHtcbiAgICAgICAgICAgICAgdmFyIHsgY3VycmVudERldmljZSB9ID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgICAgICAgY3VycmVudERldmljZS52ZWhpY2xlX25vID0gbmV3TmFtZTtcbiAgICAgICAgICAgICAgRGF0YWJhc2Uuc2V0VmVoaWNsZShjdXJyZW50RGV2aWNlLm9iamVjdElkLCBuZXdOYW1lKTtcbiAgICAgICAgICAgICAgdGhpcy5zZXRDdXJyZW50RGV2aWNlKGN1cnJlbnREZXZpY2UpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIHRvZ2dsZVNuYXBzaG90cz17KCkgPT4ge1xuICAgICAgICAgICAgICB2YXIgeyBjdXJyZW50RGV2aWNlIH0gPSB0aGlzLnN0YXRlO1xuICAgICAgICAgICAgICBjdXJyZW50RGV2aWNlLnNuYXBzaG90c0VuYWJsZWQgPSAhY3VycmVudERldmljZS5zbmFwc2hvdHNFbmFibGVkO1xuICAgICAgICAgICAgICBEYXRhYmFzZS5zZXRTbmFwaG90cyhcbiAgICAgICAgICAgICAgICBjdXJyZW50RGV2aWNlLm9iamVjdElkLFxuICAgICAgICAgICAgICAgIGN1cnJlbnREZXZpY2Uuc25hcHNob3RzRW5hYmxlZFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB0aGlzLnNldEN1cnJlbnREZXZpY2UoY3VycmVudERldmljZSk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgY2hhbmdlUm91dGU9e2FzeW5jIG9wID0+IHtcbiAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uID0gYXdhaXQgZmV0Y2goXG4gICAgICAgICAgICAgICAgYGh0dHBzOi8vbG9jYXRpb25pcS5vcmcvdjEvcmV2ZXJzZS5waHA/Zm9ybWF0PWpzb24ma2V5PSR7dGhpc1xuICAgICAgICAgICAgICAgICAgLkxJUV9BUElfS0VZfSZsYXQ9JHtvcC5sb2NhdGlvbi5sYXRpdHVkZX0mbG9uPSR7b3AubG9jYXRpb25cbiAgICAgICAgICAgICAgICAgIC5sb25naXR1ZGV9YFxuICAgICAgICAgICAgICApLnRoZW4oayA9PiBrLmpzb24oKSk7XG4gICAgICAgICAgICAgIG9wLmFjdHVhbExvY2F0aW9uID0gbG9jYXRpb24uZGlzcGxheV9uYW1lO1xuICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudFJvdXRlOiBvcCB9KTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9WaWV3PlxuICAgICAgPC9WaWV3PlxuICAgICk7XG4gIH1cbn1cblxuZnVuY3Rpb24gRGV2aWNlSW5mbyh7XG4gIGN1cnJlbnREZXZpY2UsXG4gIGRldmljZXMsXG4gIGN1cnJlbnRSb3V0ZSxcbiAgY2hhbmdlUm91dGUsXG4gIHRvZ2dsZVNuYXBzaG90cyxcbiAgdXBkYXRlVmVoaWNsZU5hbWVcbn0pIHtcbiAgLy8gY29uc29sZS5sb2coeyBjdXJyZW50RGV2aWNlIH0pXG5cbiAgcmV0dXJuIChcbiAgICA8Vmlld1xuICAgICAgc3R5bGU9e3tcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcIiNFRkVGRUZcIixcbiAgICAgICAgZmxleDogMC40XG4gICAgICB9fVxuICAgID5cbiAgICAgIHtjdXJyZW50RGV2aWNlLnV1aWQgPyAoXG4gICAgICAgIDxWaWV3PlxuICAgICAgICAgIDxWaWV3XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiI0VGRUZFRlwiLFxuICAgICAgICAgICAgICBmbGV4OiAxLFxuICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiBcInJvd1wiXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxWaWV3IHN0eWxlPXt7IGZsZXg6IDEsIHBhZGRpbmc6IDUgfX0+XG4gICAgICAgICAgICAgIDxiPkRldmljZTo8L2I+XG4gICAgICAgICAgICAgIDxwPntjdXJyZW50RGV2aWNlLnV1aWR9PC9wPlxuICAgICAgICAgICAgICA8Yj5WZWhpY2xlOjwvYj5cbiAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgPElubGluZUVkaXRcbiAgICAgICAgICAgICAgICAgIGFjdGl2ZUNsYXNzTmFtZT1cImVkaXRpbmdcIlxuICAgICAgICAgICAgICAgICAgdGV4dD17Y3VycmVudERldmljZS52ZWhpY2xlX25vfVxuICAgICAgICAgICAgICAgICAgcGFyYW1OYW1lPVwibWVzc2FnZVwiXG4gICAgICAgICAgICAgICAgICBvblNlbGVjdD17KCkgPT4ge319XG4gICAgICAgICAgICAgICAgICBjaGFuZ2U9e2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVWZWhpY2xlTmFtZShlW1wibWVzc2FnZVwiXSk7XG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcImdyYXlcIixcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwid2hpdGVcIixcbiAgICAgICAgICAgICAgICAgICAgLy8gbWluV2lkdGg6IDE1MCxcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJpbmxpbmUtYmxvY2tcIixcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAwLFxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAxMCxcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDE1LFxuICAgICAgICAgICAgICAgICAgICBvdXRsaW5lOiAwLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6IDBcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICA8Yj5MYXN0IEFkZHJlc3M6PC9iPlxuICAgICAgICAgICAgICA8cD57Y3VycmVudERldmljZS5hZGRyZXNzfTwvcD5cbiAgICAgICAgICAgICAgPGI+TGF0ZXN0IFNuYXA6IDwvYj5cbiAgICAgICAgICAgICAge2N1cnJlbnREZXZpY2UucGhvdG8gPyAoXG4gICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICA8aW1nXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiAxMDAsIGhlaWdodDogMTAwIH19XG4gICAgICAgICAgICAgICAgICAgIHNyYz17Y3VycmVudERldmljZS5waG90by51cmx9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPHA+e25ldyBEYXRlKGN1cnJlbnREZXZpY2UudXBkYXRlZEF0KS50b1RpbWVTdHJpbmcoKX08L3A+XG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgPGI+VG9nZ2xlIFNuYXBzaG90czo8L2I+XG4gICAgICAgICAgICAgICAgPHBcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiA1MCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBjdXJyZW50RGV2aWNlLnNuYXBzaG90c0VuYWJsZWRcbiAgICAgICAgICAgICAgICAgICAgICA/IFwiZ3JlZW5cIlxuICAgICAgICAgICAgICAgICAgICAgIDogXCJyZWRcIixcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyQm90dG9tTGVmdFJhZGl1czogNSxcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyVG9wUmlnaHRSYWRpdXM6IDUsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzOiA1LFxuICAgICAgICAgICAgICAgICAgICBib3JkZXJUb3BMZWZ0UmFkaXVzOiA1LFxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiA1LFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCJ3aGl0ZVwiLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgICAgICAgICAgICAgIGN1cnNvcjogXCJwb2ludGVyXCJcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0b2dnbGVTbmFwc2hvdHN9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAge2N1cnJlbnREZXZpY2Uuc25hcHNob3RzRW5hYmxlZCA/IFwiT05cIiA6IFwiT0ZGXCJ9XG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L1ZpZXc+XG4gICAgICAgICAgICA8Vmlld1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGZsZXg6IDEsXG4gICAgICAgICAgICAgICAgYm9yZGVyTGVmdFN0eWxlOiBcInNvbGlkXCIsXG4gICAgICAgICAgICAgICAgYm9yZGVyTGVmdFdpZHRoOiAyLFxuICAgICAgICAgICAgICAgIHBhZGRpbmc6IDVcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFRleHQ+XG4gICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICA8Yj5Nb3ZlbWVudCAmIFNuYXBzaG90czwvYj5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgPHNlbGVjdFxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e29wID0+IGNoYW5nZVJvdXRlKEpTT04ucGFyc2Uob3AudGFyZ2V0LnZhbHVlKSl9XG4gICAgICAgICAgICAgICAgICB2YWx1ZT17Y3VycmVudFJvdXRlLm9iamVjdElkfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxvcHRpb24+IC0tIFNlbGVjdCAtLSA8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgIHtjdXJyZW50RGV2aWNlLnJvdXRlcy5tYXAocm91dGUgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtKU09OLnN0cmluZ2lmeShyb3V0ZSl9PlxuICAgICAgICAgICAgICAgICAgICAgIHtuZXcgRGF0ZShyb3V0ZS5jcmVhdGVkQXQpLnRvVGltZVN0cmluZygpfVxuICAgICAgICAgICAgICAgICAgICA8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICkpfTtcbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICA8Yj5Mb2NhdGlvbjogPC9iPlxuICAgICAgICAgICAgICA8VGV4dD57Y3VycmVudFJvdXRlLmFjdHVhbExvY2F0aW9ufSA8L1RleHQ+XG4gICAgICAgICAgICAgIDxpbWdcbiAgICAgICAgICAgICAgICBzcmM9e1xuICAgICAgICAgICAgICAgICAgY3VycmVudFJvdXRlICYmIGN1cnJlbnRSb3V0ZS5waG90b1xuICAgICAgICAgICAgICAgICAgICA/IGN1cnJlbnRSb3V0ZS5waG90by51cmxcbiAgICAgICAgICAgICAgICAgICAgOiBcIlwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiBcIjEwMCVcIiB9fVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9WaWV3PlxuICAgICAgICAgIDwvVmlldz5cbiAgICAgICAgICA8VmlldyBzdHlsZT17eyBmbGV4OiAxIH19PlxuICAgICAgICAgICAgPFNpbmdsZUdvb2dsZU1hcHMgZGV2aWNlPXtjdXJyZW50RGV2aWNlfSAvPlxuICAgICAgICAgIDwvVmlldz5cbiAgICAgICAgPC9WaWV3PlxuICAgICAgKSA6IChcbiAgICAgICAgPGRpdlxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiI0VGRUZFRlwiXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxUZXh0PkFMTCBERVZJQ0VTIC0tIExhc3QgTG9jYXRpb248L1RleHQ+XG4gICAgICAgICAgPEdvb2dsZU1hcHNMb2NhdGlvbnMgZGV2aWNlcz17ZGV2aWNlc30gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgIDwvVmlldz5cbiAgKTtcbn1cbmV4cG9ydCBkZWZhdWx0IG9ic2VydmVyKENvbXBvc2VkQ29tcG9uZW50KExvZ2luKSk7XG4iXX0=