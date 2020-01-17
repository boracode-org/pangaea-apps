import * as React from "react";
import MyComponent from "../components/MyComponent";
import { View, Text, Button, ScrollView } from "react-native-web";
import { ComposedComponent } from "../components/Page";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell
} from "react-native-table-component";
import InlineEdit from "../components/libs/react-edit-inline";

import { AppStore } from "../stores/appStore";
import { action } from "mobx";

import { inject, observer } from "mobx-react";
import PropTypes from "prop-types";
import * as ReactDOM from "react-dom";

// if (typeof window === 'undefined') {
//   global.window = {document:{createElement:()=>{}}}
//   global.document = {}

// }

import {
  GoogleApiWrapper,
  Marker,
  InfoWindow
} from "../components/libs/google-maps-react/index"; //"../libraries/google-maps-react";
var { Polyline } = require("../components/libs/google-maps-react/index");
// import Map from "google-maps-react-irio";
import Map from "../components/libs/google-maps-react/index";

// import * as Parse from "parse";
import { Database } from "../components/Database";
import { Form, Dropdown } from "semantic-ui-react";
// Parse.initialize("ABCDEFG12345");
// Parse.serverURL = "http://psign.iriosystems.com:1380/parse";

export function round(value, decimals) {
  return Number(Math.round((value + "e" + decimals) as any) + "e-" + decimals);
}

function time(d) {
  var h = (d.getHours() < 10 ? "0" : "") + d.getHours(),
    m = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
  return h + ":" + m;
}

class _TestGoogleMaps extends React.Component<any, any> {
  markers = [];
  flightPath: any;
  onInfoWindowClose() {
    // alert("onInfoWindowClose");
  }

  onMarkerClick = (props, marker, e) => {
    console.log("marker clicked", { marker, props, e });
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  };

  state = {
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

  clearMarkers = () => {
    for (var i = 0; i < this.markers.length; i++) {
      var marker = this.markers[i];
      try {
        marker.setMap(null);
        window["google"].maps.event.removeListener(marker, "click");
      } catch (e) {}
    }
    this.markers = new Array();
  };

  componentDidMount() {
    this.updateMap(this.props);
  }

  async updateMap(props) {
    var device = props.device;
    this.setState({
      device
    });

    if (!this.refs.map) return;

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
            name:
              "<b style='color:black;'>" +
              time(new Date(route.createdAt)) +
              "</b>"
          };
          var marker = new window["google"].maps.Marker(mprops);
          window["google"].maps.event.addListener(marker, "click", e =>
            this.onMarkerClick(mprops, marker, e)
          );

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
      } else {
        this.flightPath.setMap(null);
      }
    } catch (e) {}
  }

  componentWillReceiveProps(props) {
    this.updateMap(props);
  }

  render() {
    const { device } = this.state;
    if (!device) {
      return (
        <div style={{ width: "100%", height: 600, bottom: 0 }}>
          Loading Map...
        </div>
      );
    }
    return (
      <Map
        ref="map"
        google={this.props.google}
        zoom={12}
        style={{ width: "100%", height: 600, bottom: 0 }}
        initialCenter={{
          lat: device.latitude,
          lng: device.longitude
        }}
      >
        <Marker
          onClick={this.onMarkerClick}
          name={(device.vehicle_no || device.uuid) + " , " + device.address}
          title={device.address}
          position={{
            lat: device.location.latitude,
            lng: device.location.longitude
          }}
        />
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onInfoWindowClose}
        >
          <div>
            <h1
              dangerouslySetInnerHTML={{
                __html: this.state.selectedPlace.name
              }}
            />
            {this.state.selectedPlace.route ? (
              this.state.selectedPlace.route.photo ? (
                <img
                  style={{ height: 50, width: 50 }}
                  src={this.state.selectedPlace.route.photo.url}
                />
              ) : null
            ) : null}
          </div>
        </InfoWindow>
      </Map>
    );
  }
}
var SingleGoogleMaps = GoogleApiWrapper({
  apiKey: "AIzaSyAP6y4sWwmNFYZojY438WqjeX-rK00DdDQ"
})(_TestGoogleMaps);
// <InfoWindow onClose={this.onInfoWindowClose}>
// <div>
//   <h1>{this.state.selectedPlace.name}</h1>
// </div>
// </InfoWindow>
class _TestGoogleMapsAll extends React.Component<any, any> {
  onInfoWindowClose() {
    alert("onInfoWindowClose");
  }

  state = {
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
  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  };

  render() {
    const { devices } = this.props;
    return (
      <Map
        google={this.props.google}
        zoom={12}
        style={{ width: "100%", height: 500 }}
        initialCenter={{
          lat: 0.347596,
          lng: 32.58252
        }}
      >
        {devices.map(dev => {
          return (
            <Marker
              name={(dev.vehicle_no || dev.uuid) + ", " + dev.address}
              onClick={this.onMarkerClick}
              title={"The marker`s title will appear as a tooltip."}
              position={{
                lat: dev.location.latitude,
                lng: dev.location.longitude
              }}
            />
          );
        })}

        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onInfoWindowClose}
        >
          <div>
            <h1>{this.state.selectedPlace.name}</h1>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}
var GoogleMapsLocations = GoogleApiWrapper({
  apiKey: "AIzaSyAP6y4sWwmNFYZojY438WqjeX-rK00DdDQ"
})(_TestGoogleMapsAll);

@observer
class Login extends React.Component<{ app: AppStore }, any> {
  LIQ_API_KEY = "9afb27b67fe07f";
  addYo = action(() => {
    this.props.app.appName += "YOOO TO MA";
  });

  setCurrentDevice = async device => {
    // console.log({ device });

    if (!device.routes)
      device.routes = await Database.getRouteToday(device.objectId);

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
    } else this.setState({ currentDevice: device });
  };

  state = {
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
  async getDevices() {
    //Get and display devices
    // alert("getting devices!!");
    var devices = await Database.fetchDevices();
    this.setState({ devices });
  }

  componentDidMount() {
    this.getDevices();
    this.refreshGroups();
  }

  async refreshGroups() {
    var groups = await Database.getGroups();
    this.setState({
      groups: groups.map(k => k.toJSON()).map(k => ({
        key: k.objectId,
        text: k.name,
        value: k.objectId
      }))
    });
  }

  public render() {
    const { devices, currentDevice } = this.state;
    return (
      <View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View
            className=""
            style={{
              height: 30,
              flexDirection: "row",
              width: "60%",
              alignItems: "center",
              backgroundColor: "black",
              padding: 5
            }}
          >
            <View style={{ flex: 1.5, color: "white" }}>
              <Text>Device ID</Text>
            </View>
            <View style={{ flex: 1, color: "white" }}>
              <Text>Last Online</Text>
            </View>
            <View style={{ flex: 0.5, color: "white" }}>
              <Text>Vehicle</Text>
            </View>
            <View style={{ flex: 1, color: "white" }}>
              <Text> Last Location (Lng,Lat)</Text>
            </View>
          </View>
          <View
            className=""
            style={{
              height: 30,
              flexDirection: "row",
              width: "60%",
              alignItems: "center",
              backgroundColor: "darkblue",
              padding: 5
            }}
          >
            <View style={{ flex: 1.5, color: "white" }}>
              <Text>Device Information</Text>
            </View>
          </View>
        </View>
        <View
          className="container-fluid"
          style={{
            height: "auto",
            overflow: "hidden",
            padding: 2,
            flex: 0.5,
            flexDirection: "row"
          }}
        >
          <View className="col-md-8" style={{ flex: 0.6 }}>
            <View
              style={{
                float: "none" /* not needed, just for clarification */,
                /* the next props are meant to keep this block independent from the other floated one */
                width: "auto",
                overflow: "scroll",
                height: "90%",
                backgroundColor: "#FAFAFA"
              }}
            >
              <ScrollView style={{ flex: 1, width: "100%", height: 800 }}>
                {this.state.devices.map(device => {
                  return (
                    <View
                      key={device.uuid}
                      style={{
                        backgroundColor:
                          device.uuid == currentDevice.uuid ? "lightgray" : "",
                        flexDirection: "row",
                        flex: 1,
                        margin: 2,
                        justifyContent: "space-between"
                      }}
                      onClick={() => this.setCurrentDevice(device)}
                    >
                      <th scope="row" style={{ textAlign: "left", flex: 1.5 }}>
                        {device.uuid}
                      </th>
                      <td style={{ textAlign: "left", flex: 1 }}>
                        {new Date(device.updatedAt).toLocaleString()}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          flex: 0.5,
                          backgroundColor: "darkgreen",
                          color: "white",
                          borderRadius: 15,
                          height: 30,
                          padding: 5
                        }}
                      >
                        {device.vehicle_no}
                      </td>
                      <td style={{ textAlign: "center", flex: 1 }}>
                        {round(device.location.longitude, 2)},
                        {round(device.location.latitude, 2)}
                      </td>
                      <td />
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>
          <DeviceInfo
            groups={this.state.groups}
            currentDevice={currentDevice}
            devices={devices}
            currentRoute={this.state.currentRoute}
            updateVehicleName={newName => {
              var { currentDevice } = this.state;
              currentDevice.vehicle_no = newName;
              Database.setVehicle(currentDevice.objectId, newName);
              this.setCurrentDevice(currentDevice);
              this.getDevices();
            }}
            updateVehicleGroup={newGroup => {
              var { currentDevice } = this.state;
              Database.setVehicleGroup(currentDevice.objectId, newGroup);
              if (!currentDevice.group) {
                currentDevice.group = {};
              }
              currentDevice.group.objectId = newGroup;
              this.setCurrentDevice(currentDevice);
              this.getDevices();
            }}
            toggleSnapshots={() => {
              var { currentDevice } = this.state;
              currentDevice.snapshotsEnabled = !currentDevice.snapshotsEnabled;
              Database.setSnaphots(
                currentDevice.objectId,
                currentDevice.snapshotsEnabled
              );
              this.setCurrentDevice(currentDevice);
            }}
            changeRoute={async op => {
              var location = await fetch(
                `https://locationiq.org/v1/reverse.php?format=json&key=${
                  this.LIQ_API_KEY
                }&lat=${op.location.latitude}&lon=${op.location.longitude}`
              ).then(k => k.json());
              op.actualLocation = location.display_name;
              this.setState({ currentRoute: op });
            }}
          />
        </View>
      </View>
    );
  }
}

function DeviceInfo({
  currentDevice,
  devices,
  currentRoute,
  changeRoute,
  toggleSnapshots,
  updateVehicleName,
  updateVehicleGroup,
  groups
}) {
  // console.log({ currentDevice })

  return (
    <View
      style={{
        backgroundColor: "#EFEFEF",
        flex: 0.4
      }}
    >
      {currentDevice.uuid ? (
        <View>
          <View
            style={{
              backgroundColor: "#EFEFEF",
              flex: 1,
              flexDirection: "row"
            }}
          >
            <View style={{ flex: 1, padding: 5 }}>
              <b>Device:</b>
              <p>{currentDevice.uuid}</p>
              <b>Vehicle:</b>
              <p>
                <InlineEdit
                  activeClassName="editing"
                  text={currentDevice.vehicle_no}
                  paramName="message"
                  onSelect={() => {}}
                  change={e => {
                    updateVehicleName(e["message"]);
                  }}
                  style={{
                    backgroundColor: "gray",
                    color: "white",
                    // minWidth: 150,
                    display: "inline-block",
                    margin: 0,
                    padding: 10,
                    fontSize: 15,
                    outline: 0,
                    border: 0
                  }}
                />
                <Form.Field>
                  <label>Current Group</label>
                  <Dropdown
                    placeholder="Select Group"
                    fluid
                    selection
                    value={currentDevice.group && currentDevice.group.objectId}
                    onChange={(e, data) => {
                      // console.log({ data });
                      // this.setState({ selectedGroup: data.value });
                      updateVehicleGroup(data.value);
                    }}
                    options={groups}
                  />
                </Form.Field>
              </p>
              <b>Last Address:</b>
              <p>{currentDevice.address}</p>
              <b>Latest Snap: </b>
              {currentDevice.photo ? (
                <p>
                  <img
                    style={{ width: 100, height: 100 }}
                    src={currentDevice.photo.url}
                  />
                  <p>{new Date(currentDevice.updatedAt).toTimeString()}</p>
                </p>
              ) : null}
              <p>
                <b>Toggle Snapshots:</b>
                <p
                  style={{
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
                  }}
                  onClick={toggleSnapshots}
                >
                  {currentDevice.snapshotsEnabled ? "ON" : "OFF"}
                </p>
              </p>
            </View>
            <View
              style={{
                flex: 1,
                borderLeftStyle: "solid",
                borderLeftWidth: 2,
                padding: 5
              }}
            >
              <Text>
                <p>
                  <b>Movement & Snapshots</b>
                </p>
              </Text>
              <p>
                <select
                  onChange={op => changeRoute(JSON.parse(op.target.value))}
                  value={currentRoute.objectId}
                >
                  <option> -- Select -- </option>
                  {currentDevice.routes.map(route => (
                    <option value={JSON.stringify(route)}>
                      {new Date(route.createdAt).toTimeString()}
                    </option>
                  ))}
                  ;
                </select>
              </p>
              <b>Location: </b>
              <Text>{currentRoute.actualLocation} </Text>
              <img
                src={
                  currentRoute && currentRoute.photo
                    ? currentRoute.photo.url
                    : ""
                }
                style={{ width: "100%" }}
              />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <SingleGoogleMaps device={currentDevice} />
          </View>
        </View>
      ) : (
        <div
          style={{
            backgroundColor: "#EFEFEF"
          }}
        >
          <Text>ALL DEVICES -- Last Location</Text>
          <GoogleMapsLocations devices={devices} />
        </div>
      )}
    </View>
  );
}
export default observer(ComposedComponent(Login));
