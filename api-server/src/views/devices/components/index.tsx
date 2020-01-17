// import { round } from "../../../utils";
import { height, width } from "csstips/lib";
import { px } from "csx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Helmet } from "react-helmet";
import { IStores } from "stores";
import { style } from "typestyle";
import { Grid, Row, Col } from "react-flexbox-grid";
import {} from "react-native-web";
import { GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";
import Map from "google-maps-react";

// const WithMarkers = React.createClass({
//   getInitialState: function() {
//     return {
//       showingInfoWindow: false,
//       activeMarker: {},
//       selectedPlace: {}
//     };
//   },

//   onMarkerClick: function(props, marker, e) {
//     this.setState({
//       selectedPlace: props,
//       activeMarker: marker,
//       showingInfoWindow: true
//     });
//   },

//   onInfoWindowClose: function() {
//     this.setState({
//       showingInfoWindow: false,
//       activeMarker: null
//     });
//   },

//   onMapClicked: function(props) {
//     if (this.state.showingInfoWindow) {
//       this.setState({
//         showingInfoWindow: false,
//         activeMarker: null
//       });
//     }
//   },

//   render: function() {
//     if (!this.props.loaded) {
//       return <div>Loading...</div>;
//     }

//     return (
//       <Map
//         google={this.props.google}
//         style={{ width: "100%", height: "100%", position: "relative" }}
//         className={"map"}
//         zoom={14}
//         onClick={this.onMapClicked}
//       >
//         <Marker
//           onClick={this.onMarkerClick}
//           name={"SOMA"}
//           position={{ lat: 37.778519, lng: -122.40564 }}
//         />
//         <Marker
//           onClick={this.onMarkerClick}
//           name={"Dolores park"}
//           position={{ lat: 37.759703, lng: -122.428093 }}
//         />
//         <Marker onClick={this.onMarkerClick} name={"Current location"} />

//         <InfoWindow
//           marker={this.state.activeMarker}
//           visible={this.state.showingInfoWindow}
//           onClose={this.onInfoWindowClose}
//         >
//           <div>
//             <h1>{this.state.selectedPlace.name}</h1>
//           </div>
//         </InfoWindow>

//         <InfoWindow position={{ lat: 37.765703, lng: -122.42564 }} visible={true}>
//           <small>Click on any of the markers to display an additional info.</small>
//         </InfoWindow>
//       </Map>
//     );
//   }
// });

export function round(value, decimals) {
  return Number(Math.round((value + "e" + decimals) as any) + "e-" + decimals);
}

const currencyClass = style({
  padding: px(10)
});

const moneyClass = style({
  color: "green"
});

interface IDevicesProps {
  appStore: IStores["appStore"];
}

class _TestGoogleMaps extends React.Component<any, any> {
  onInfoWindowClose() {
    alert("onInfoWindowClose");
  }
  onMarkerClick() {
    alert("onMarkerClick");
  }

  state = {
    selectedPlace: {
      name: "Cool"
    }
  };

  // onClick={this.onMarkerClick}
  // initialCenter={{
  //   lat: 0.347596,
  //   lng: 32.58252
  // }}

  render() {
    const { device } = this.props;
    return (
      <Map
        google={this.props.google}
        zoom={12}
        style={{ width: 700, height: 400 }}
        initialCenter={{
          lat: 0.347596,
          lng: 32.58252
        }}
      >
        <Marker name={"Current location"} title={"The marker`s title will appear as a tooltip."} position={{ lat: device.latitude, lng: device.longitude }} />
      </Map>
    );
  }
}
var SingleGoogleMaps = GoogleApiWrapper({
  apiKey: "AIzaSyCHvixG0VdOVVBoVBd6deTRUjnADzOjZbc"
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
        style={{ width: 700, height: 400 }}
        initialCenter={{
          lat: 0.347596,
          lng: 32.58252
        }}
      >
        {devices.map(dev => {
          return (
            <Marker
              name={dev.uuid}
              onClick={this.onMarkerClick}
              title={"The marker`s title will appear as a tooltip."}
              position={{ lat: dev.latitude, lng: dev.longitude }}
            />
          );
        })}

        <InfoWindow marker={this.state.activeMarker} visible={this.state.showingInfoWindow} onClose={this.onInfoWindowClose}>
          <div>
            <h1>{this.state.selectedPlace.name}</h1>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}
var GoogleMapsLocations = GoogleApiWrapper({
  apiKey: "AIzaSyCHvixG0VdOVVBoVBd6deTRUjnADzOjZbc"
})(_TestGoogleMapsAll);

@inject((stores: IStores) => ({
  appStore: stores.appStore
}))
@observer
export default class Devices extends React.Component<IDevicesProps, {}> {
  state = {
    devices: [],
    currentDevice: {
      uuid: null
    }
  };
  getDevices() {
    //Get and display devices
  }

  componentDidMount() {
    this.getDevices();
  }
  public render() {
    const { devices, currentDevice } = this.state;
    const { appStore } = this.props;
    return (
      <div>
        <Helmet>
          <title>Devices</title>
        </Helmet>
        <div style={{ height: "auto", overflow: "hidden" }}>
          <div
            style={{
              width: 700,
              float: "right"
            }}
          >
            {currentDevice.uuid ? (
              <div>
                <b>Device Details</b>
                <p>{currentDevice.uuid}</p>
                <SingleGoogleMaps device={currentDevice} />
              </div>
            ) : (
              <div>
                ALL DEVICES -- Last Location
                <GoogleMapsLocations devices={appStore.state.devices} />
              </div>
            )}
          </div>
          <div
            style={{
              float: "none" /* not needed, just for clarification */,
              /* the next props are meant to keep this block independent from the other floated one */
              width: "auto",
              overflow: "hidden"
            }}
          >
            <table style={{ border: "1px solid lightgray", width: 500 }}>
              <thead style={{ border: "1px solid lightgray" }}>
                <th> Last Online</th>
                <th> Device ID </th>
                <th> Vehicle </th>
                <th> Last Location (Lng,Lat) </th>
                <th> Actions </th>
              </thead>
              {appStore.state.devices.map(device => {
                return (
                  <tr
                    key={device.uuid}
                    style={{
                      border: "1px solid lightgray",
                      backgroundColor: device.uuid == currentDevice.uuid ? "lightgray" : "white"
                    }}
                    onClick={() => this.setState({ currentDevice: device })}
                  >
                    <td style={{ border: "1px solid lightgray" }}>{new Date(device.updatedAt).toLocaleString()}</td>
                    <td style={{ border: "1px solid lightgray" }}>{device.uuid}</td>
                    <td style={{ border: "1px solid lightgray" }}>{device.vehicle_no}</td>
                    <td style={{ border: "1px solid lightgray" }}>
                      {round(device.longitude, 2)},{round(device.latitude, 2)}
                    </td>
                    <td>Movement</td>
                  </tr>
                );
              })}
            </table>
          </div>
        </div>
      </div>
    );
  }
}
