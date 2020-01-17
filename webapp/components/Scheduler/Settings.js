import React, { PropTypes, Component } from "react";
import moment from "moment";
import {
  default as Video,
  Controls,
  Play,
  Mute,
  Seek,
  Fullscreen,
  Time,
  Overlay
} from "react-html5video";
import ReactDOMServer from "react-dom/server";
import "whatwg-fetch";
import DropzoneComponent from "react-dropzone-component";
import Box, { ScrollView, Page, Container } from "react-layout-components"; // https://github.com/rofrischmann/react-layout-components/issues/27
import Modal from "react-modal";
import Gallery from "./Gallery";
// import Parse from "parse";
import Constants from "../Constants";
import { Button, View, TextInput } from "react-native-web";
import { Database } from "../Database";

// Parse.initialize("ABCDEFG12345");
// Parse.serverURL = "http://psign.iriosystems.com:1380/parse";
// idea, add two playlist items  at each tick, placing default item when there is nothing to display the beginning

class Settings extends React.Component {
  state = {
    settings: {
      defaultVideo: { file: {} },
      defaultRSS: {},
      defaultBanner: { file: {} }
    }
  };

  constructor(props) {
    super(props);

    this.selectBanner = this.selectBanner.bind(this);
    this.selectVideo = this.selectVideo.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
    this.getSettings = this.getSettings.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  saveSettings = async () => {
    console.log("Saving settings...");
    var { defaultBanner, defaultRSS, defaultVideo } = this.state.settings;
    

    try {
      await Database.saveSettings(defaultVideo, defaultBanner, defaultRSS);
      this.props.parent.closeModal();
    } catch (e) {
      alert("Error saving settings: " + JSON.stringify(e));
      // .then(settings => {
      //   var setting = settings[0];
      //   // console.log({ settings });
      //   // // this.setState({
      //   // //     settings: {
      //   // //         defaultVideo: setting.get('defaultVideo'),
      //   // //         defaultBanner: setting.get('defaultBanner')
      //   // //     }
      //   // // });

      //   setting
      //     .save(null)
      //     .then(k => console.log(k))
      //     .catch(err => console.log(err));
      // })
      // .then(() => )
      // .catch(err => console.log(err));
    }
  };

  getSettings = async () => {
    // fetch("/settings").then((response) => {
    //     return response.json()
    // }).then(k => {
    //     console.log("/settings", k);
    //     this.setState({ settings: k });
    // }).catch(e => {

    // });
    var setting = await Database.getSettings();

    this.setState({
      settings: {
        defaultVideo: setting.defaultVideo,
        defaultBanner: setting.defaultBanner,
        defaultRSS: setting.defaultRSS
      }
    });

    // var testObject = new TestObject();
    // testObject.save({ foo: "bar" }).then(function (object) {
    //     alert("yay! lsit worked");
    // });
    // Parse.Query()
  };

  componentDidMount() {
    this.getSettings();
    // componentDidMount is called by react when the component
    // has been rendered on the page. We can set the interval here:
  }

  componentWillUnmount() {}
  // this.props.parent.select(this.state.galleryItems[i])

  selectVideo=(item)=> {
    console.log("selected video:", item);
    this.setState({
      settings: { defaultVideo: item.file, defaultBanner: this.state.settings.defaultBanner },
      selectVideoOpen: false,
      selectBannerOpen: false
    });
  }

  selectBanner=(item)=> {
    console.log("selected banner:", item);
    this.setState({
      settings: { defaultBanner: item.file, defaultVideo: this.state.settings.defaultVideo },
      selectVideoOpen: false,
      selectBannerOpen: false
    });
  }

  closeModal=()=> {
    this.setState({ selectVideoOpen: false, selectBannerOpen: false });
  }

  render() {
    var { defaultBanner, defaultRSS, defaultVideo } = this.state.settings;

    return (
      <div style={{ backgroundColor: "white", paddingLeft: 0, height: "100%", marginBottom: 50 }}>
        <h3
          style={{
            color: "black",
            height: 40,
            backgroundColor: "lightgray",
            textAlign: "center",
            verticalAlign: "center",
            paddingTop: 10
          }}
        >
          {`Default Settings`.toUpperCase()}
        </h3>
        <div className="panel panel-default" style={{ padding: 10, margin: 10 }}>
          <p>GIF Banner</p>
          <img
            src={defaultBanner ? defaultBanner.url : null}
            style={{ height: 80, width: 150 }}
          />
          <Modal
            style={modalStyle}
            isOpen={this.state.selectBannerOpen}
            onRequestClose={this.closeModal}
          >
            <Gallery
              onSelect={this.selectBanner}
              types=".jpg,.png,.gif"
              closeModal={this.closeModal}
            />
          </Modal>
          <View style={{ margin: 5, width: 200 }}>
            <Button
              title="Change Banner"
              onPress={() => this.setState({ selectBannerOpen: true })}
            />
          </View>
        </div>

        <div className="panel panel-default" style={{ padding: 10, margin: 10 }}>
          <p>Default Video:</p>
          <img
            src={defaultVideo ? defaultVideo.url + ".thumb.png" : null}
            style={{ height: 150, width: 150 }}
          />
          <Modal
            style={modalStyle}
            isOpen={this.state.selectVideoOpen}
            onRequestClose={this.closeModal}
          >
            <Gallery onSelect={this.selectVideo} closeModal={this.closeModal} />
          </Modal>

          <View style={{ margin: 5, width: 200 }}>
            <Button title="Change Video" onPress={() => this.setState({ selectVideoOpen: true })} />
          </View>
        </div>
        <div className="panel panel-default" style={{ padding: 10, margin: 10 }}>
          <p>RSS</p>
          <TextInput
            style={{
              fontSize: 20,
              border: "1px solid black",
              width: 500,
              borderRadius: 5,
              padding: 5
            }}
            value={this.state.settings.defaultRSS}
            onChange={e =>
              this.setState({ settings: { ...this.state.settings, defaultRSS: e.target.value } })}
          />
        </div>
        <br />

        <View style={{ flexDirection: "row" }}>
          <View style={{ margin: 5, width: 200 }}>
            <Button title="Save" color="darkgreen" onPress={this.saveSettings} />
          </View>

          <View style={{ margin: 5, width: 200 }}>
            <Button title="Close" onPress={this.props.parent.closeModal} />
          </View>
        </View>
      </div>
    );
  }
}

var modalStyle = {
  overlay: {
    zIndex: 0,
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 15, 15, 0.75)"
  },
  content: {
    zIndex: -5,
    position: "absolute",
    top: "10px",
    left: "10px",
    right: "10px",
    bottom: "10px",
    border: "1px solid #ccc",
    backgroundColor: "rgba(15, 15, 15, 0.95)",
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    borderRadius: "4px",
    outline: "none",
    padding: "20px"
  }
};

export default Settings;
