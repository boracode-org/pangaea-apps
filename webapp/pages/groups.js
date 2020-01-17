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
const DEFAULT_GROUP = {
    uuid: null,
    updatedAt: null,
    vehicle_no: null,
    address: null,
    photo: { url: null },
    snapshotsEnabled: false,
    objectId: null
};
let Login = class Login extends React.Component {
    constructor() {
        super(...arguments);
        this.LIQ_API_KEY = "9afb27b67fe07f";
        this.addYo = mobx_1.action(() => {
            this.props.app.appName += "YOOO TO MA";
        });
        this.setCurrentGroup = (group) => __awaiter(this, void 0, void 0, function* () {
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
        });
        this.state = {
            groups: [],
            currentRoute: { photo: {} },
            currentGroup: DEFAULT_GROUP,
            currentGroupName: null
        };
        this.saveGroup = () => __awaiter(this, void 0, void 0, function* () {
            var { currentGroupName, currentGroup } = this.state;
            if (currentGroupName) {
                try {
                    yield Database_1.Database.saveGroup(currentGroup.objectId, currentGroupName);
                    this.setState({ currentGroup: DEFAULT_GROUP });
                    yield this.getGroups();
                }
                catch (e) { }
            }
        });
    }
    getGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            //Get and display devices
            // alert("getting devices!!");
            var groups = yield Database_1.Database.fetchGroups();
            this.setState({ groups });
        });
    }
    componentDidMount() {
        this.getGroups();
    }
    render() {
        const { groups, currentGroup, currentGroupName } = this.state;
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
                        React.createElement(react_native_web_1.Text, null, "Group ID")),
                    React.createElement(react_native_web_1.View, { style: { flex: 1, color: "white" } },
                        React.createElement(react_native_web_1.Text, null, "Name")),
                    React.createElement(react_native_web_1.View, { style: { flex: 1, color: "white" } },
                        React.createElement(react_native_web_1.Text, null, "Last Updated"))),
                React.createElement(react_native_web_1.View, { className: "", style: {
                        height: 30,
                        flexDirection: "row",
                        width: "60%",
                        alignItems: "center",
                        backgroundColor: "darkblue",
                        padding: 5
                    } },
                    React.createElement(react_native_web_1.View, { style: { flex: 1.5, color: "white" } },
                        React.createElement(react_native_web_1.Text, null, "Group Information")))),
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
                        React.createElement(react_native_web_1.ScrollView, { style: { flex: 1, width: "100%", height: 800 } },
                            this.state.groups.map(group => {
                                return (React.createElement(react_native_web_1.View, { key: group.objectId, style: {
                                        backgroundColor: group.objectId == currentGroup.objectId
                                            ? "lightgray"
                                            : "",
                                        flexDirection: "row",
                                        flex: 1,
                                        margin: 2,
                                        justifyContent: "space-between"
                                    }, onClick: () => this.setCurrentGroup(group) },
                                    React.createElement("th", { scope: "row", style: { textAlign: "left", flex: 1.5 } }, group.objectId),
                                    React.createElement("th", { scope: "row", style: { textAlign: "left", flex: 1.5 } }, group.name),
                                    React.createElement("td", { style: { textAlign: "left", flex: 1 } }, new Date(group.updatedAt).toLocaleString())));
                            }),
                            React.createElement(semantic_ui_react_1.Button, { color: "green", content: "New Group", size: "small", onClick: () => this.setCurrentGroup({
                                    updatedAt: new Date(),
                                    name: "New Group"
                                }) })))),
                currentGroup && currentGroup.updatedAt ? (React.createElement(react_native_web_1.View, { style: {
                        backgroundColor: "#EFEFEF",
                        flex: 0.4
                    } },
                    React.createElement(react_native_web_1.Text, null,
                        React.createElement(semantic_ui_react_1.Segment, null,
                            React.createElement(semantic_ui_react_1.Form, null,
                                React.createElement("legend", null, "Edit Group"),
                                React.createElement(semantic_ui_react_1.Form.Field, null,
                                    React.createElement("label", null, "name"),
                                    React.createElement("input", { value: currentGroupName, onChange: e => this.setState({ currentGroupName: e.target.value }) })),
                                React.createElement(semantic_ui_react_1.Button, { disabled: !currentGroupName, primary: true, type: "submit", content: "Save", onClick: this.saveGroup })))))) : null)));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXBzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ3JvdXBzLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsK0JBQStCO0FBRS9CLHVEQUEwRDtBQUMxRCw2Q0FBdUQ7QUFVdkQsNEVBQThEO0FBRzlELCtCQUE4QjtBQUU5QiwyQ0FBOEM7QUFFOUMsc0NBQXNDO0FBRXRDLHVDQUF1QztBQUN2QyxzREFBc0Q7QUFDdEQseUJBQXlCO0FBRXpCLElBQUk7QUFFSixzRUFJb0QsQ0FBQyxtQ0FBbUM7QUFDeEYsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLE9BQU8sQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO0FBQ3pFLDRDQUE0QztBQUM1QyxzRUFBNkQ7QUFFN0Qsa0NBQWtDO0FBQ2xDLHFEQUFrRDtBQUNsRCx5REFBMEQ7QUFDMUQsb0NBQW9DO0FBQ3BDLCtEQUErRDtBQUUvRCxlQUFzQixLQUFLLEVBQUUsUUFBUTtJQUNuQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxHQUFHLFFBQVEsQ0FBUSxDQUFDLEdBQUcsSUFBSSxHQUFHLFFBQVEsQ0FBQyxDQUFDO0FBQy9FLENBQUM7QUFGRCxzQkFFQztBQUVELGNBQWMsQ0FBQztJQUNiLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQ25ELENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3hELE1BQU0sQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FB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QUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FDeEIsQ0FDRyxDQUNGO1FBQ1Asb0JBQUMsdUJBQUksSUFBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFO1lBQ3RCLG9CQUFDLGdCQUFnQixJQUFDLE1BQU0sRUFBRSxhQUFhLEdBQUksQ0FDdEMsQ0FDRixDQUNSLENBQUMsQ0FBQyxDQUFDLENBQ0YsNkJBQ0UsS0FBSyxFQUFFO1lBQ0wsZUFBZSxFQUFFLFNBQVM7U0FDM0I7UUFFRCxvQkFBQyx1QkFBSSx1Q0FBb0M7UUFDekMsb0JBQUMsbUJBQW1CLElBQUMsT0FBTyxFQUFFLE9BQU8sR0FBSSxDQUNyQyxDQUNQLENBQ0ksQ0FDUixDQUFDO0FBQ0osQ0FBQztBQUNELGtCQUFlLHFCQUFRLENBQUMsd0JBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IE15Q29tcG9uZW50IGZyb20gXCIuLi9jb21wb25lbnRzL015Q29tcG9uZW50XCI7XG5pbXBvcnQgeyBWaWV3LCBUZXh0LCBTY3JvbGxWaWV3IH0gZnJvbSBcInJlYWN0LW5hdGl2ZS13ZWJcIjtcbmltcG9ydCB7IENvbXBvc2VkQ29tcG9uZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvUGFnZVwiO1xuaW1wb3J0IHtcbiAgVGFibGUsXG4gIFRhYmxlV3JhcHBlcixcbiAgUm93LFxuICBSb3dzLFxuICBDb2wsXG4gIENvbHMsXG4gIENlbGxcbn0gZnJvbSBcInJlYWN0LW5hdGl2ZS10YWJsZS1jb21wb25lbnRcIjtcbmltcG9ydCBJbmxpbmVFZGl0IGZyb20gXCIuLi9jb21wb25lbnRzL2xpYnMvcmVhY3QtZWRpdC1pbmxpbmVcIjtcblxuaW1wb3J0IHsgQXBwU3RvcmUgfSBmcm9tIFwiLi4vc3RvcmVzL2FwcFN0b3JlXCI7XG5pbXBvcnQgeyBhY3Rpb24gfSBmcm9tIFwibW9ieFwiO1xuXG5pbXBvcnQgeyBpbmplY3QsIG9ic2VydmVyIH0gZnJvbSBcIm1vYngtcmVhY3RcIjtcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSBcInByb3AtdHlwZXNcIjtcbmltcG9ydCAqIGFzIFJlYWN0RE9NIGZyb20gXCJyZWFjdC1kb21cIjtcblxuLy8gaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4vLyAgIGdsb2JhbC53aW5kb3cgPSB7ZG9jdW1lbnQ6e2NyZWF0ZUVsZW1lbnQ6KCk9Pnt9fX1cbi8vICAgZ2xvYmFsLmRvY3VtZW50ID0ge31cblxuLy8gfVxuXG5pbXBvcnQge1xuICBHb29nbGVBcGlXcmFwcGVyLFxuICBNYXJrZXIsXG4gIEluZm9XaW5kb3dcbn0gZnJvbSBcIi4uL2NvbXBvbmVudHMvbGlicy9nb29nbGUtbWFwcy1yZWFjdC9pbmRleFwiOyAvL1wiLi4vbGlicmFyaWVzL2dvb2dsZS1tYXBzLXJlYWN0XCI7XG52YXIgeyBQb2x5bGluZSB9ID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvbGlicy9nb29nbGUtbWFwcy1yZWFjdC9pbmRleFwiKTtcbi8vIGltcG9ydCBNYXAgZnJvbSBcImdvb2dsZS1tYXBzLXJlYWN0LWlyaW9cIjtcbmltcG9ydCBNYXAgZnJvbSBcIi4uL2NvbXBvbmVudHMvbGlicy9nb29nbGUtbWFwcy1yZWFjdC9pbmRleFwiO1xuXG4vLyBpbXBvcnQgKiBhcyBQYXJzZSBmcm9tIFwicGFyc2VcIjtcbmltcG9ydCB7IERhdGFiYXNlIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvRGF0YWJhc2VcIjtcbmltcG9ydCB7IEZvcm0sIEJ1dHRvbiwgU2VnbWVudCB9IGZyb20gXCJzZW1hbnRpYy11aS1yZWFjdFwiO1xuLy8gUGFyc2UuaW5pdGlhbGl6ZShcIkFCQ0RFRkcxMjM0NVwiKTtcbi8vIFBhcnNlLnNlcnZlclVSTCA9IFwiaHR0cDovL3BzaWduLmlyaW9zeXN0ZW1zLmNvbToxMzgwL3BhcnNlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiByb3VuZCh2YWx1ZSwgZGVjaW1hbHMpIHtcbiAgcmV0dXJuIE51bWJlcihNYXRoLnJvdW5kKCh2YWx1ZSArIFwiZVwiICsgZGVjaW1hbHMpIGFzIGFueSkgKyBcImUtXCIgKyBkZWNpbWFscyk7XG59XG5cbmZ1bmN0aW9uIHRpbWUoZCkge1xuICB2YXIgaCA9IChkLmdldEhvdXJzKCkgPCAxMCA/IFwiMFwiIDogXCJcIikgKyBkLmdldEhvdXJzKCksXG4gICAgbSA9IChkLmdldE1pbnV0ZXMoKSA8IDEwID8gXCIwXCIgOiBcIlwiKSArIGQuZ2V0TWludXRlcygpO1xuICByZXR1cm4gaCArIFwiOlwiICsgbTtcbn1cblxuY2xhc3MgX1Rlc3RHb29nbGVNYXBzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XG4gIG1hcmtlcnMgPSBbXTtcbiAgZmxpZ2h0UGF0aDogYW55O1xuICBvbkluZm9XaW5kb3dDbG9zZSgpIHtcbiAgICAvLyBhbGVydChcIm9uSW5mb1dpbmRvd0Nsb3NlXCIpO1xuICB9XG5cbiAgb25NYXJrZXJDbGljayA9IChwcm9wcywgbWFya2VyLCBlKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJtYXJrZXIgY2xpY2tlZFwiLCB7IG1hcmtlciwgcHJvcHMsIGUgfSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3RlZFBsYWNlOiBwcm9wcyxcbiAgICAgIGFjdGl2ZU1hcmtlcjogbWFya2VyLFxuICAgICAgc2hvd2luZ0luZm9XaW5kb3c6IHRydWVcbiAgICB9KTtcbiAgfTtcblxuICBzdGF0ZSA9IHtcbiAgICBhY3RpdmVNYXJrZXI6IG51bGwsXG4gICAgc2VsZWN0ZWRQbGFjZToge1xuICAgICAgbmFtZTogXCJDb29sXCIsXG4gICAgICByb3V0ZTogbnVsbFxuICAgIH0sXG4gICAgZGV2aWNlOiBudWxsLFxuICAgIHNob3dpbmdJbmZvV2luZG93OiBmYWxzZVxuICB9O1xuXG4gIC8vIG9uQ2xpY2s9e3RoaXMub25NYXJrZXJDbGlja31cbiAgLy8gaW5pdGlhbENlbnRlcj17e1xuICAvLyAgIGxhdDogMC4zNDc1OTYsXG4gIC8vICAgbG5nOiAzMi41ODI1MlxuICAvLyB9fVxuXG4gIGNsZWFyTWFya2VycyA9ICgpID0+IHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG1hcmtlciA9IHRoaXMubWFya2Vyc1tpXTtcbiAgICAgIHRyeSB7XG4gICAgICAgIG1hcmtlci5zZXRNYXAobnVsbCk7XG4gICAgICAgIHdpbmRvd1tcImdvb2dsZVwiXS5tYXBzLmV2ZW50LnJlbW92ZUxpc3RlbmVyKG1hcmtlciwgXCJjbGlja1wiKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgfVxuICAgIHRoaXMubWFya2VycyA9IG5ldyBBcnJheSgpO1xuICB9O1xuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMudXBkYXRlTWFwKHRoaXMucHJvcHMpO1xuICB9XG5cbiAgYXN5bmMgdXBkYXRlTWFwKHByb3BzKSB7XG4gICAgdmFyIGRldmljZSA9IHByb3BzLmRldmljZTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGRldmljZVxuICAgIH0pO1xuXG4gICAgaWYgKCF0aGlzLnJlZnMubWFwKSByZXR1cm47XG5cbiAgICB2YXIgbWFwcmVmID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcy5yZWZzLm1hcCk7XG5cbiAgICBjb25zb2xlLmxvZyh7IGRldmljZSwgbWFwcmVmLCByZWZtYXA6IHRoaXMucmVmcy5tYXAgfSk7XG5cbiAgICB2YXIgbWFwID0gdGhpcy5yZWZzLm1hcFtcIm1hcFwiXTtcblxuICAgIG1hcC5zZXRDZW50ZXIoe1xuICAgICAgbGF0OiBwYXJzZUZsb2F0KGRldmljZS5sb2NhdGlvbi5sYXRpdHVkZSksXG4gICAgICBsbmc6IHBhcnNlRmxvYXQoZGV2aWNlLmxvY2F0aW9uLmxvbmdpdHVkZSlcbiAgICB9KTtcbiAgICB0aGlzLmNsZWFyTWFya2VycygpO1xuICAgIC8vIG5ldyB3aW5kb3dbXCJnb29nbGVcIl0ubWFwcy5NYXAobWFwcmVmLCB7XG4gICAgLy8gICB6b29tOiAxMixcbiAgICAvLyAgIGNlbnRlcjogeyBsYXQ6IHBhcnNlRmxvYXQoZGV2aWNlLmxhdGl0dWRlKSwgbG5nOiBwYXJzZUZsb2F0KGRldmljZS5sb25naXR1ZGUpIH1cbiAgICAvLyAgIC8vIG1hcFR5cGVJZDogXCJ0ZXJyYWluXCJcbiAgICAvLyB9KTtcblxuICAgIHZhciByb3V0ZXMgPSBkZXZpY2Uucm91dGVzOyAvL2F3YWl0IERhdGFiYXNlLmdldFJvdXRlVG9kYXkoZGV2aWNlLm9iamVjdElkKTtcbiAgICAvL0dldCBhbGwgbW92ZW1lbnRzIHRvZGF5XG4gICAgLy8gdmFyIGZsaWdodFBsYW5Db29yZGluYXRlcyA9IFtcbiAgICAvLyAgIHsgbGF0OiAzNy43NzIsIGxuZzogLTEyMi4yMTQgfSxcbiAgICAvLyAgIHsgbGF0OiAyMS4yOTEsIGxuZzogLTE1Ny44MjEgfSxcbiAgICAvLyAgIHsgbGF0OiAtMTguMTQyLCBsbmc6IDE3OC40MzEgfSxcbiAgICAvLyAgIHsgbGF0OiAtMjcuNDY3LCBsbmc6IDE1My4wMjcgfVxuICAgIC8vIF07XG4gICAgaWYgKHJvdXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgZmxpZ2h0UGxhbkNvb3JkaW5hdGVzID0gcm91dGVzLm1hcChyb3V0ZSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbGF0OiBwYXJzZUZsb2F0KHJvdXRlLmxvY2F0aW9uLmxhdGl0dWRlKSxcbiAgICAgICAgICBsbmc6IHBhcnNlRmxvYXQocm91dGUubG9jYXRpb24ubG9uZ2l0dWRlKVxuICAgICAgICB9O1xuICAgICAgfSk7XG5cbiAgICAgIHJvdXRlcy5mb3JFYWNoKHJvdXRlID0+IHtcbiAgICAgICAgdmFyIG1wcm9wcyA9IHtcbiAgICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgICAgbGF0OiBwYXJzZUZsb2F0KHJvdXRlLmxvY2F0aW9uLmxhdGl0dWRlKSxcbiAgICAgICAgICAgIGxuZzogcGFyc2VGbG9hdChyb3V0ZS5sb2NhdGlvbi5sb25naXR1ZGUpXG4gICAgICAgICAgfSxcbiAgICAgICAgICByb3V0ZSxcbiAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICBsYWJlbDogdGltZShuZXcgRGF0ZShyb3V0ZS5jcmVhdGVkQXQpKSxcbiAgICAgICAgICBhbmltYXRpb246IHdpbmRvd1tcImdvb2dsZVwiXS5tYXBzLkFuaW1hdGlvbi5EUk9QLFxuICAgICAgICAgIG5hbWU6XG4gICAgICAgICAgICBcIjxiIHN0eWxlPSdjb2xvcjpibGFjazsnPlwiICtcbiAgICAgICAgICAgIHRpbWUobmV3IERhdGUocm91dGUuY3JlYXRlZEF0KSkgK1xuICAgICAgICAgICAgXCI8L2I+XCJcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIG1hcmtlciA9IG5ldyB3aW5kb3dbXCJnb29nbGVcIl0ubWFwcy5NYXJrZXIobXByb3BzKTtcbiAgICAgICAgd2luZG93W1wiZ29vZ2xlXCJdLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCBcImNsaWNrXCIsIGUgPT5cbiAgICAgICAgICB0aGlzLm9uTWFya2VyQ2xpY2sobXByb3BzLCBtYXJrZXIsIGUpXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5tYXJrZXJzLnB1c2gobWFya2VyKTtcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2coeyBmbGlnaHRQbGFuQ29vcmRpbmF0ZXMgfSk7XG5cbiAgICAgIHRoaXMuZmxpZ2h0UGF0aCA9IG5ldyB3aW5kb3dbXCJnb29nbGVcIl0ubWFwcy5Qb2x5bGluZSh7XG4gICAgICAgIHBhdGg6IGZsaWdodFBsYW5Db29yZGluYXRlcyxcbiAgICAgICAgZ2VvZGVzaWM6IHRydWUsXG4gICAgICAgIHN0cm9rZUNvbG9yOiBcIiNGRjAwMDBcIixcbiAgICAgICAgc3Ryb2tlT3BhY2l0eTogMS4wLFxuICAgICAgICBzdHJva2VXZWlnaHQ6IDJcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmZsaWdodFBhdGguc2V0TWFwKG1hcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZmxpZ2h0UGF0aC5zZXRNYXAobnVsbCk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuICAgIHRoaXMudXBkYXRlTWFwKHByb3BzKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGRldmljZSB9ID0gdGhpcy5zdGF0ZTtcbiAgICBpZiAoIWRldmljZSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogXCIxMDAlXCIsIGhlaWdodDogNjAwLCBib3R0b206IDAgfX0+XG4gICAgICAgICAgTG9hZGluZyBNYXAuLi5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPE1hcFxuICAgICAgICByZWY9XCJtYXBcIlxuICAgICAgICBnb29nbGU9e3RoaXMucHJvcHMuZ29vZ2xlfVxuICAgICAgICB6b29tPXsxMn1cbiAgICAgICAgc3R5bGU9e3sgd2lkdGg6IFwiMTAwJVwiLCBoZWlnaHQ6IDYwMCwgYm90dG9tOiAwIH19XG4gICAgICAgIGluaXRpYWxDZW50ZXI9e3tcbiAgICAgICAgICBsYXQ6IGRldmljZS5sYXRpdHVkZSxcbiAgICAgICAgICBsbmc6IGRldmljZS5sb25naXR1ZGVcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPE1hcmtlclxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMub25NYXJrZXJDbGlja31cbiAgICAgICAgICBuYW1lPXsoZGV2aWNlLnZlaGljbGVfbm8gfHwgZGV2aWNlLnV1aWQpICsgXCIgLCBcIiArIGRldmljZS5hZGRyZXNzfVxuICAgICAgICAgIHRpdGxlPXtkZXZpY2UuYWRkcmVzc31cbiAgICAgICAgICBwb3NpdGlvbj17e1xuICAgICAgICAgICAgbGF0OiBkZXZpY2UubG9jYXRpb24ubGF0aXR1ZGUsXG4gICAgICAgICAgICBsbmc6IGRldmljZS5sb2NhdGlvbi5sb25naXR1ZGVcbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgICA8SW5mb1dpbmRvd1xuICAgICAgICAgIG1hcmtlcj17dGhpcy5zdGF0ZS5hY3RpdmVNYXJrZXJ9XG4gICAgICAgICAgdmlzaWJsZT17dGhpcy5zdGF0ZS5zaG93aW5nSW5mb1dpbmRvd31cbiAgICAgICAgICBvbkNsb3NlPXt0aGlzLm9uSW5mb1dpbmRvd0Nsb3NlfVxuICAgICAgICA+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxoMVxuICAgICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTD17e1xuICAgICAgICAgICAgICAgIF9faHRtbDogdGhpcy5zdGF0ZS5zZWxlY3RlZFBsYWNlLm5hbWVcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB7dGhpcy5zdGF0ZS5zZWxlY3RlZFBsYWNlLnJvdXRlID8gKFxuICAgICAgICAgICAgICB0aGlzLnN0YXRlLnNlbGVjdGVkUGxhY2Uucm91dGUucGhvdG8gPyAoXG4gICAgICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgaGVpZ2h0OiA1MCwgd2lkdGg6IDUwIH19XG4gICAgICAgICAgICAgICAgICBzcmM9e3RoaXMuc3RhdGUuc2VsZWN0ZWRQbGFjZS5yb3V0ZS5waG90by51cmx9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgKSA6IG51bGxcbiAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0luZm9XaW5kb3c+XG4gICAgICA8L01hcD5cbiAgICApO1xuICB9XG59XG52YXIgU2luZ2xlR29vZ2xlTWFwcyA9IEdvb2dsZUFwaVdyYXBwZXIoe1xuICBhcGlLZXk6IFwiQUl6YVN5QVA2eTRzV3dtTkZZWm9qWTQzOFdxamVYLXJLMDBEZERRXCJcbn0pKF9UZXN0R29vZ2xlTWFwcyk7XG4vLyA8SW5mb1dpbmRvdyBvbkNsb3NlPXt0aGlzLm9uSW5mb1dpbmRvd0Nsb3NlfT5cbi8vIDxkaXY+XG4vLyAgIDxoMT57dGhpcy5zdGF0ZS5zZWxlY3RlZFBsYWNlLm5hbWV9PC9oMT5cbi8vIDwvZGl2PlxuLy8gPC9JbmZvV2luZG93PlxuY2xhc3MgX1Rlc3RHb29nbGVNYXBzQWxsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XG4gIG9uSW5mb1dpbmRvd0Nsb3NlKCkge1xuICAgIGFsZXJ0KFwib25JbmZvV2luZG93Q2xvc2VcIik7XG4gIH1cblxuICBzdGF0ZSA9IHtcbiAgICBhY3RpdmVNYXJrZXI6IG51bGwsXG4gICAgc2hvd2luZ0luZm9XaW5kb3c6IGZhbHNlLFxuICAgIHNlbGVjdGVkUGxhY2U6IHtcbiAgICAgIG5hbWU6IFwiQ29vbFwiXG4gICAgfVxuICB9O1xuXG4gIC8vIG9uQ2xpY2s9e3RoaXMub25NYXJrZXJDbGlja31cbiAgLy8gaW5pdGlhbENlbnRlcj17e1xuICAvLyAgIGxhdDogMC4zNDc1OTYsXG4gIC8vICAgbG5nOiAzMi41ODI1MlxuICAvLyB9fVxuICBvbk1hcmtlckNsaWNrID0gKHByb3BzLCBtYXJrZXIsIGUpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGVkUGxhY2U6IHByb3BzLFxuICAgICAgYWN0aXZlTWFya2VyOiBtYXJrZXIsXG4gICAgICBzaG93aW5nSW5mb1dpbmRvdzogdHJ1ZVxuICAgIH0pO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGRldmljZXMgfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxNYXBcbiAgICAgICAgZ29vZ2xlPXt0aGlzLnByb3BzLmdvb2dsZX1cbiAgICAgICAgem9vbT17MTJ9XG4gICAgICAgIHN0eWxlPXt7IHdpZHRoOiBcIjEwMCVcIiwgaGVpZ2h0OiA1MDAgfX1cbiAgICAgICAgaW5pdGlhbENlbnRlcj17e1xuICAgICAgICAgIGxhdDogMC4zNDc1OTYsXG4gICAgICAgICAgbG5nOiAzMi41ODI1MlxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7ZGV2aWNlcy5tYXAoZGV2ID0+IHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPE1hcmtlclxuICAgICAgICAgICAgICBuYW1lPXsoZGV2LnZlaGljbGVfbm8gfHwgZGV2LnV1aWQpICsgXCIsIFwiICsgZGV2LmFkZHJlc3N9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMub25NYXJrZXJDbGlja31cbiAgICAgICAgICAgICAgdGl0bGU9e1wiVGhlIG1hcmtlcmBzIHRpdGxlIHdpbGwgYXBwZWFyIGFzIGEgdG9vbHRpcC5cIn1cbiAgICAgICAgICAgICAgcG9zaXRpb249e3tcbiAgICAgICAgICAgICAgICBsYXQ6IGRldi5sb2NhdGlvbi5sYXRpdHVkZSxcbiAgICAgICAgICAgICAgICBsbmc6IGRldi5sb2NhdGlvbi5sb25naXR1ZGVcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSl9XG5cbiAgICAgICAgPEluZm9XaW5kb3dcbiAgICAgICAgICBtYXJrZXI9e3RoaXMuc3RhdGUuYWN0aXZlTWFya2VyfVxuICAgICAgICAgIHZpc2libGU9e3RoaXMuc3RhdGUuc2hvd2luZ0luZm9XaW5kb3d9XG4gICAgICAgICAgb25DbG9zZT17dGhpcy5vbkluZm9XaW5kb3dDbG9zZX1cbiAgICAgICAgPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8aDE+e3RoaXMuc3RhdGUuc2VsZWN0ZWRQbGFjZS5uYW1lfTwvaDE+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvSW5mb1dpbmRvdz5cbiAgICAgIDwvTWFwPlxuICAgICk7XG4gIH1cbn1cbnZhciBHb29nbGVNYXBzTG9jYXRpb25zID0gR29vZ2xlQXBpV3JhcHBlcih7XG4gIGFwaUtleTogXCJBSXphU3lBUDZ5NHNXd21ORllab2pZNDM4V3FqZVgtckswMERkRFFcIlxufSkoX1Rlc3RHb29nbGVNYXBzQWxsKTtcblxuY29uc3QgREVGQVVMVF9HUk9VUCA9IHtcbiAgdXVpZDogbnVsbCxcbiAgdXBkYXRlZEF0OiBudWxsLFxuICB2ZWhpY2xlX25vOiBudWxsLFxuICBhZGRyZXNzOiBudWxsLFxuICBwaG90bzogeyB1cmw6IG51bGwgfSxcbiAgc25hcHNob3RzRW5hYmxlZDogZmFsc2UsXG4gIG9iamVjdElkOiBudWxsXG59O1xuQG9ic2VydmVyXG5jbGFzcyBMb2dpbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDx7IGFwcDogQXBwU3RvcmUgfSwgYW55PiB7XG4gIExJUV9BUElfS0VZID0gXCI5YWZiMjdiNjdmZTA3ZlwiO1xuICBhZGRZbyA9IGFjdGlvbigoKSA9PiB7XG4gICAgdGhpcy5wcm9wcy5hcHAuYXBwTmFtZSArPSBcIllPT08gVE8gTUFcIjtcbiAgfSk7XG5cbiAgc2V0Q3VycmVudEdyb3VwID0gYXN5bmMgZ3JvdXAgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKHsgZ3JvdXAgfSk7XG5cbiAgICAvLyBpZiAoIWdyb3VwLnJvdXRlcylcbiAgICAvLyAgIGdyb3VwLnJvdXRlcyA9IGF3YWl0IERhdGFiYXNlLmdldFJvdXRlVG9kYXkoZ3JvdXAub2JqZWN0SWQpO1xuXG4gICAgLy8gdmFyIGdlb2NvZGVyID0gbmV3IHdpbmRvd1tcImdvb2dsZVwiXS5tYXBzLkdlb2NvZGVyKCk7XG4gICAgLy8gY29uc29sZS5sb2coeyBnZW9jb2RlciB9KTtcbiAgICAvLyB2YXIgbGF0bG5nID0ge1xuICAgIC8vICAgbGF0OiBwYXJzZUZsb2F0KGdyb3VwLmxhdGl0dWRlKSxcbiAgICAvLyAgIGxuZzogcGFyc2VGbG9hdChncm91cC5sb25naXR1ZGUpXG4gICAgLy8gfTtcbiAgICAvLyBpZiAoIWdyb3VwLmFkZHJlc3MpIHtcbiAgICAvLyAgIGdlb2NvZGVyLmdlb2NvZGUoeyBsb2NhdGlvbjogbGF0bG5nIH0sIChyZXN1bHRzLCBzdGF0dXMpID0+IHtcbiAgICAvLyAgICAgZ3JvdXAuYWRkcmVzcyA9IHJlc3VsdHNbMF0gPyByZXN1bHRzWzBdLmZvcm1hdHRlZF9hZGRyZXNzIDogXCJcIjtcbiAgICAvLyAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnREZXZpY2U6IGdyb3VwIH0pO1xuICAgIC8vICAgfSk7XG4gICAgLy8gfSBlbHNlXG4gICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRHcm91cDogZ3JvdXAsIGN1cnJlbnRHcm91cE5hbWU6IGdyb3VwLm5hbWUgfSk7XG4gIH07XG5cbiAgc3RhdGUgPSB7XG4gICAgZ3JvdXBzOiBbXSxcbiAgICBjdXJyZW50Um91dGU6IHsgcGhvdG86IHt9IH0sXG4gICAgY3VycmVudEdyb3VwOiBERUZBVUxUX0dST1VQLFxuICAgIGN1cnJlbnRHcm91cE5hbWU6IG51bGxcbiAgfTtcblxuICBzYXZlR3JvdXAgPSBhc3luYyAoKSA9PiB7XG4gICAgdmFyIHsgY3VycmVudEdyb3VwTmFtZSwgY3VycmVudEdyb3VwIH0gPSB0aGlzLnN0YXRlO1xuICAgIGlmIChjdXJyZW50R3JvdXBOYW1lKSB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBEYXRhYmFzZS5zYXZlR3JvdXAoY3VycmVudEdyb3VwLm9iamVjdElkLCBjdXJyZW50R3JvdXBOYW1lKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRHcm91cDogREVGQVVMVF9HUk9VUCB9KTtcbiAgICAgICAgYXdhaXQgdGhpcy5nZXRHcm91cHMoKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgfVxuICB9O1xuXG4gIGFzeW5jIGdldEdyb3VwcygpIHtcbiAgICAvL0dldCBhbmQgZGlzcGxheSBkZXZpY2VzXG4gICAgLy8gYWxlcnQoXCJnZXR0aW5nIGRldmljZXMhIVwiKTtcbiAgICB2YXIgZ3JvdXBzID0gYXdhaXQgRGF0YWJhc2UuZmV0Y2hHcm91cHMoKTtcbiAgICB0aGlzLnNldFN0YXRlKHsgZ3JvdXBzIH0pO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5nZXRHcm91cHMoKTtcbiAgfVxuXG4gIHB1YmxpYyByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBncm91cHMsIGN1cnJlbnRHcm91cCwgY3VycmVudEdyb3VwTmFtZSB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIHJldHVybiAoXG4gICAgICA8Vmlldz5cbiAgICAgICAgPFZpZXcgc3R5bGU9e3sgZmxleDogMSwgZmxleERpcmVjdGlvbjogXCJyb3dcIiB9fT5cbiAgICAgICAgICA8Vmlld1xuICAgICAgICAgICAgY2xhc3NOYW1lPVwiXCJcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGhlaWdodDogMzAsXG4gICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246IFwicm93XCIsXG4gICAgICAgICAgICAgIHdpZHRoOiBcIjYwJVwiLFxuICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiYmxhY2tcIixcbiAgICAgICAgICAgICAgcGFkZGluZzogNVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8VmlldyBzdHlsZT17eyBmbGV4OiAxLjUsIGNvbG9yOiBcIndoaXRlXCIgfX0+XG4gICAgICAgICAgICAgIDxUZXh0Pkdyb3VwIElEPC9UZXh0PlxuICAgICAgICAgICAgPC9WaWV3PlxuICAgICAgICAgICAgPFZpZXcgc3R5bGU9e3sgZmxleDogMSwgY29sb3I6IFwid2hpdGVcIiB9fT5cbiAgICAgICAgICAgICAgPFRleHQ+TmFtZTwvVGV4dD5cbiAgICAgICAgICAgIDwvVmlldz5cbiAgICAgICAgICAgIDxWaWV3IHN0eWxlPXt7IGZsZXg6IDEsIGNvbG9yOiBcIndoaXRlXCIgfX0+XG4gICAgICAgICAgICAgIDxUZXh0Pkxhc3QgVXBkYXRlZDwvVGV4dD5cbiAgICAgICAgICAgIDwvVmlldz5cbiAgICAgICAgICA8L1ZpZXc+XG4gICAgICAgICAgPFZpZXdcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cIlwiXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxuICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiBcInJvd1wiLFxuICAgICAgICAgICAgICB3aWR0aDogXCI2MCVcIixcbiAgICAgICAgICAgICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcImRhcmtibHVlXCIsXG4gICAgICAgICAgICAgIHBhZGRpbmc6IDVcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFZpZXcgc3R5bGU9e3sgZmxleDogMS41LCBjb2xvcjogXCJ3aGl0ZVwiIH19PlxuICAgICAgICAgICAgICA8VGV4dD5Hcm91cCBJbmZvcm1hdGlvbjwvVGV4dD5cbiAgICAgICAgICAgIDwvVmlldz5cbiAgICAgICAgICA8L1ZpZXc+XG4gICAgICAgIDwvVmlldz5cbiAgICAgICAgPFZpZXdcbiAgICAgICAgICBjbGFzc05hbWU9XCJjb250YWluZXItZmx1aWRcIlxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBoZWlnaHQ6IFwiYXV0b1wiLFxuICAgICAgICAgICAgb3ZlcmZsb3c6IFwiaGlkZGVuXCIsXG4gICAgICAgICAgICBwYWRkaW5nOiAyLFxuICAgICAgICAgICAgZmxleDogMC41LFxuICAgICAgICAgICAgZmxleERpcmVjdGlvbjogXCJyb3dcIlxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8VmlldyBjbGFzc05hbWU9XCJjb2wtbWQtOFwiIHN0eWxlPXt7IGZsZXg6IDAuNiB9fT5cbiAgICAgICAgICAgIDxWaWV3XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZmxvYXQ6IFwibm9uZVwiIC8qIG5vdCBuZWVkZWQsIGp1c3QgZm9yIGNsYXJpZmljYXRpb24gKi8sXG4gICAgICAgICAgICAgICAgLyogdGhlIG5leHQgcHJvcHMgYXJlIG1lYW50IHRvIGtlZXAgdGhpcyBibG9jayBpbmRlcGVuZGVudCBmcm9tIHRoZSBvdGhlciBmbG9hdGVkIG9uZSAqL1xuICAgICAgICAgICAgICAgIHdpZHRoOiBcImF1dG9cIixcbiAgICAgICAgICAgICAgICBvdmVyZmxvdzogXCJzY3JvbGxcIixcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IFwiOTAlXCIsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcIiNGQUZBRkFcIlxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8U2Nyb2xsVmlldyBzdHlsZT17eyBmbGV4OiAxLCB3aWR0aDogXCIxMDAlXCIsIGhlaWdodDogODAwIH19PlxuICAgICAgICAgICAgICAgIHt0aGlzLnN0YXRlLmdyb3Vwcy5tYXAoZ3JvdXAgPT4ge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgPFZpZXdcbiAgICAgICAgICAgICAgICAgICAgICBrZXk9e2dyb3VwLm9iamVjdElkfVxuICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwLm9iamVjdElkID09IGN1cnJlbnRHcm91cC5vYmplY3RJZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJsaWdodGdyYXlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246IFwicm93XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGV4OiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAyLFxuICAgICAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiXG4gICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnNldEN1cnJlbnRHcm91cChncm91cCl9XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICA8dGggc2NvcGU9XCJyb3dcIiBzdHlsZT17eyB0ZXh0QWxpZ246IFwibGVmdFwiLCBmbGV4OiAxLjUgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7Z3JvdXAub2JqZWN0SWR9XG4gICAgICAgICAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICA8dGggc2NvcGU9XCJyb3dcIiBzdHlsZT17eyB0ZXh0QWxpZ246IFwibGVmdFwiLCBmbGV4OiAxLjUgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7Z3JvdXAubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT17eyB0ZXh0QWxpZ246IFwibGVmdFwiLCBmbGV4OiAxIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAge25ldyBEYXRlKGdyb3VwLnVwZGF0ZWRBdCkudG9Mb2NhbGVTdHJpbmcoKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgIHsvKiA8dGRcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZmxleDogMC41LFxuICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiZGFya2dyZWVuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIndoaXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogMTUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogMzAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IDVcbiAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAge2RldmljZS52ZWhpY2xlX25vfVxuICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+ICovfVxuICAgICAgICAgICAgICAgICAgICA8L1ZpZXc+XG4gICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgIGNvbG9yPVwiZ3JlZW5cIlxuICAgICAgICAgICAgICAgICAgY29udGVudD1cIk5ldyBHcm91cFwiXG4gICAgICAgICAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRDdXJyZW50R3JvdXAoe1xuICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIk5ldyBHcm91cFwiXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9TY3JvbGxWaWV3PlxuICAgICAgICAgICAgPC9WaWV3PlxuICAgICAgICAgIDwvVmlldz5cbiAgICAgICAgICB7Y3VycmVudEdyb3VwICYmIGN1cnJlbnRHcm91cC51cGRhdGVkQXQgPyAoXG4gICAgICAgICAgICA8Vmlld1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogXCIjRUZFRkVGXCIsXG4gICAgICAgICAgICAgICAgZmxleDogMC40XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxUZXh0PlxuICAgICAgICAgICAgICAgIDxTZWdtZW50PlxuICAgICAgICAgICAgICAgICAgPEZvcm0+XG4gICAgICAgICAgICAgICAgICAgIDxsZWdlbmQ+RWRpdCBHcm91cDwvbGVnZW5kPlxuICAgICAgICAgICAgICAgICAgICA8Rm9ybS5GaWVsZD5cbiAgICAgICAgICAgICAgICAgICAgICA8bGFiZWw+bmFtZTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Y3VycmVudEdyb3VwTmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBjdXJyZW50R3JvdXBOYW1lOiBlLnRhcmdldC52YWx1ZSB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvRm9ybS5GaWVsZD5cbiAgICAgICAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXshY3VycmVudEdyb3VwTmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICBwcmltYXJ5XG4gICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInN1Ym1pdFwiXG4gICAgICAgICAgICAgICAgICAgICAgY29udGVudD1cIlNhdmVcIlxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuc2F2ZUdyb3VwfVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICB7LyogPEJ1dHRvbiBjb2xvcj1cInJlZFwiIHR5cGU9XCJidXR0b25cIj5cbiAgICAgICAgICAgICAgICAgICAgICBEZWxldGUgR3JvdXBcbiAgICAgICAgICAgICAgICAgICAgPC9CdXR0b24+ICovfVxuICAgICAgICAgICAgICAgICAgPC9Gb3JtPlxuICAgICAgICAgICAgICAgIDwvU2VnbWVudD5cbiAgICAgICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgICAgPC9WaWV3PlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgIHsvKiA8RGV2aWNlSW5mb1xuICAgICAgICAgICAgY3VycmVudERldmljZT17Y3VycmVudERldmljZX1cbiAgICAgICAgICAgIGRldmljZXM9e2RldmljZXN9XG4gICAgICAgICAgICBjdXJyZW50Um91dGU9e3RoaXMuc3RhdGUuY3VycmVudFJvdXRlfVxuICAgICAgICAgICAgdXBkYXRlVmVoaWNsZU5hbWU9e25ld05hbWUgPT4ge1xuICAgICAgICAgICAgICB2YXIgeyBjdXJyZW50RGV2aWNlIH0gPSB0aGlzLnN0YXRlO1xuICAgICAgICAgICAgICBjdXJyZW50RGV2aWNlLnZlaGljbGVfbm8gPSBuZXdOYW1lO1xuICAgICAgICAgICAgICBEYXRhYmFzZS5zZXRWZWhpY2xlKGN1cnJlbnREZXZpY2Uub2JqZWN0SWQsIG5ld05hbWUpO1xuICAgICAgICAgICAgICB0aGlzLnNldEN1cnJlbnREZXZpY2UoY3VycmVudERldmljZSk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgdG9nZ2xlU25hcHNob3RzPXsoKSA9PiB7XG4gICAgICAgICAgICAgIHZhciB7IGN1cnJlbnREZXZpY2UgfSA9IHRoaXMuc3RhdGU7XG4gICAgICAgICAgICAgIGN1cnJlbnREZXZpY2Uuc25hcHNob3RzRW5hYmxlZCA9ICFjdXJyZW50RGV2aWNlLnNuYXBzaG90c0VuYWJsZWQ7XG4gICAgICAgICAgICAgIERhdGFiYXNlLnNldFNuYXBob3RzKFxuICAgICAgICAgICAgICAgIGN1cnJlbnREZXZpY2Uub2JqZWN0SWQsXG4gICAgICAgICAgICAgICAgY3VycmVudERldmljZS5zbmFwc2hvdHNFbmFibGVkXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIHRoaXMuc2V0Q3VycmVudERldmljZShjdXJyZW50RGV2aWNlKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBjaGFuZ2VSb3V0ZT17YXN5bmMgb3AgPT4ge1xuICAgICAgICAgICAgICB2YXIgbG9jYXRpb24gPSBhd2FpdCBmZXRjaChcbiAgICAgICAgICAgICAgICBgaHR0cHM6Ly9sb2NhdGlvbmlxLm9yZy92MS9yZXZlcnNlLnBocD9mb3JtYXQ9anNvbiZrZXk9JHt0aGlzXG4gICAgICAgICAgICAgICAgICAuTElRX0FQSV9LRVl9JmxhdD0ke29wLmxvY2F0aW9uLmxhdGl0dWRlfSZsb249JHtvcC5sb2NhdGlvblxuICAgICAgICAgICAgICAgICAgLmxvbmdpdHVkZX1gXG4gICAgICAgICAgICAgICkudGhlbihrID0+IGsuanNvbigpKTtcbiAgICAgICAgICAgICAgb3AuYWN0dWFsTG9jYXRpb24gPSBsb2NhdGlvbi5kaXNwbGF5X25hbWU7XG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBjdXJyZW50Um91dGU6IG9wIH0pO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPiAqL31cbiAgICAgICAgPC9WaWV3PlxuICAgICAgPC9WaWV3PlxuICAgICk7XG4gIH1cbn1cblxuZnVuY3Rpb24gRGV2aWNlSW5mbyh7XG4gIGN1cnJlbnREZXZpY2UsXG4gIGRldmljZXMsXG4gIGN1cnJlbnRSb3V0ZSxcbiAgY2hhbmdlUm91dGUsXG4gIHRvZ2dsZVNuYXBzaG90cyxcbiAgdXBkYXRlVmVoaWNsZU5hbWVcbn0pIHtcbiAgLy8gY29uc29sZS5sb2coeyBjdXJyZW50RGV2aWNlIH0pXG5cbiAgcmV0dXJuIChcbiAgICA8Vmlld1xuICAgICAgc3R5bGU9e3tcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcIiNFRkVGRUZcIixcbiAgICAgICAgZmxleDogMC40XG4gICAgICB9fVxuICAgID5cbiAgICAgIHtjdXJyZW50RGV2aWNlLnV1aWQgPyAoXG4gICAgICAgIDxWaWV3PlxuICAgICAgICAgIDxWaWV3XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiI0VGRUZFRlwiLFxuICAgICAgICAgICAgICBmbGV4OiAxLFxuICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiBcInJvd1wiXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxWaWV3IHN0eWxlPXt7IGZsZXg6IDEsIHBhZGRpbmc6IDUgfX0+XG4gICAgICAgICAgICAgIDxiPkRldmljZTo8L2I+XG4gICAgICAgICAgICAgIDxwPntjdXJyZW50RGV2aWNlLnV1aWR9PC9wPlxuICAgICAgICAgICAgICA8Yj5WZWhpY2xlOjwvYj5cbiAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgPElubGluZUVkaXRcbiAgICAgICAgICAgICAgICAgIGFjdGl2ZUNsYXNzTmFtZT1cImVkaXRpbmdcIlxuICAgICAgICAgICAgICAgICAgdGV4dD17Y3VycmVudERldmljZS52ZWhpY2xlX25vfVxuICAgICAgICAgICAgICAgICAgcGFyYW1OYW1lPVwibWVzc2FnZVwiXG4gICAgICAgICAgICAgICAgICBvblNlbGVjdD17KCkgPT4ge319XG4gICAgICAgICAgICAgICAgICBjaGFuZ2U9e2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVWZWhpY2xlTmFtZShlW1wibWVzc2FnZVwiXSk7XG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcImdyYXlcIixcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwid2hpdGVcIixcbiAgICAgICAgICAgICAgICAgICAgLy8gbWluV2lkdGg6IDE1MCxcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJpbmxpbmUtYmxvY2tcIixcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAwLFxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAxMCxcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDE1LFxuICAgICAgICAgICAgICAgICAgICBvdXRsaW5lOiAwLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6IDBcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICA8Yj5MYXN0IEFkZHJlc3M6PC9iPlxuICAgICAgICAgICAgICA8cD57Y3VycmVudERldmljZS5hZGRyZXNzfTwvcD5cbiAgICAgICAgICAgICAgPGI+TGF0ZXN0IFNuYXA6IDwvYj5cbiAgICAgICAgICAgICAge2N1cnJlbnREZXZpY2UucGhvdG8gPyAoXG4gICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICA8aW1nXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiAxMDAsIGhlaWdodDogMTAwIH19XG4gICAgICAgICAgICAgICAgICAgIHNyYz17Y3VycmVudERldmljZS5waG90by51cmx9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPHA+e25ldyBEYXRlKGN1cnJlbnREZXZpY2UudXBkYXRlZEF0KS50b1RpbWVTdHJpbmcoKX08L3A+XG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgPGI+VG9nZ2xlIFNuYXBzaG90czo8L2I+XG4gICAgICAgICAgICAgICAgPHBcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiA1MCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBjdXJyZW50RGV2aWNlLnNuYXBzaG90c0VuYWJsZWRcbiAgICAgICAgICAgICAgICAgICAgICA/IFwiZ3JlZW5cIlxuICAgICAgICAgICAgICAgICAgICAgIDogXCJyZWRcIixcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyQm90dG9tTGVmdFJhZGl1czogNSxcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyVG9wUmlnaHRSYWRpdXM6IDUsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzOiA1LFxuICAgICAgICAgICAgICAgICAgICBib3JkZXJUb3BMZWZ0UmFkaXVzOiA1LFxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiA1LFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCJ3aGl0ZVwiLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgICAgICAgICAgICAgIGN1cnNvcjogXCJwb2ludGVyXCJcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0b2dnbGVTbmFwc2hvdHN9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAge2N1cnJlbnREZXZpY2Uuc25hcHNob3RzRW5hYmxlZCA/IFwiT05cIiA6IFwiT0ZGXCJ9XG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L1ZpZXc+XG4gICAgICAgICAgICA8Vmlld1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGZsZXg6IDEsXG4gICAgICAgICAgICAgICAgYm9yZGVyTGVmdFN0eWxlOiBcInNvbGlkXCIsXG4gICAgICAgICAgICAgICAgYm9yZGVyTGVmdFdpZHRoOiAyLFxuICAgICAgICAgICAgICAgIHBhZGRpbmc6IDVcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFRleHQ+XG4gICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICA8Yj5Nb3ZlbWVudCAmIFNuYXBzaG90czwvYj5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgPHNlbGVjdFxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e29wID0+IGNoYW5nZVJvdXRlKEpTT04ucGFyc2Uob3AudGFyZ2V0LnZhbHVlKSl9XG4gICAgICAgICAgICAgICAgICB2YWx1ZT17Y3VycmVudFJvdXRlLm9iamVjdElkfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxvcHRpb24+IC0tIFNlbGVjdCAtLSA8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgIHtjdXJyZW50RGV2aWNlLnJvdXRlcy5tYXAocm91dGUgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtKU09OLnN0cmluZ2lmeShyb3V0ZSl9PlxuICAgICAgICAgICAgICAgICAgICAgIHtuZXcgRGF0ZShyb3V0ZS5jcmVhdGVkQXQpLnRvVGltZVN0cmluZygpfVxuICAgICAgICAgICAgICAgICAgICA8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDxiPkxvY2F0aW9uOiA8L2I+XG4gICAgICAgICAgICAgIDxUZXh0PntjdXJyZW50Um91dGUuYWN0dWFsTG9jYXRpb259IDwvVGV4dD5cbiAgICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICAgIHNyYz17XG4gICAgICAgICAgICAgICAgICBjdXJyZW50Um91dGUgJiYgY3VycmVudFJvdXRlLnBob3RvXG4gICAgICAgICAgICAgICAgICAgID8gY3VycmVudFJvdXRlLnBob3RvLnVybFxuICAgICAgICAgICAgICAgICAgICA6IFwiXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6IFwiMTAwJVwiIH19XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L1ZpZXc+XG4gICAgICAgICAgPC9WaWV3PlxuICAgICAgICAgIDxWaWV3IHN0eWxlPXt7IGZsZXg6IDEgfX0+XG4gICAgICAgICAgICA8U2luZ2xlR29vZ2xlTWFwcyBkZXZpY2U9e2N1cnJlbnREZXZpY2V9IC8+XG4gICAgICAgICAgPC9WaWV3PlxuICAgICAgICA8L1ZpZXc+XG4gICAgICApIDogKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogXCIjRUZFRkVGXCJcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFRleHQ+QUxMIERFVklDRVMgLS0gTGFzdCBMb2NhdGlvbjwvVGV4dD5cbiAgICAgICAgICA8R29vZ2xlTWFwc0xvY2F0aW9ucyBkZXZpY2VzPXtkZXZpY2VzfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgPC9WaWV3PlxuICApO1xufVxuZXhwb3J0IGRlZmF1bHQgb2JzZXJ2ZXIoQ29tcG9zZWRDb21wb25lbnQoTG9naW4pKTtcbiJdfQ==