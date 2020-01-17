import { PropTypes, Component } from "react";
import * as React from "react";
import * as moment from "moment";
import { default as Video, Controls, Play, Mute, Seek, Fullscreen, Time, Overlay } from "react-html5video";
var ReactDOMServer = require("react-dom/server");
import "whatwg-fetch";
var DropzoneComponent = require("react-dropzone-component");
import Box, { ScrollView, Page, Container } from "react-layout-components"; // https://github.com/rofrischmann/react-layout-components/issues/27
var Modal = require("react-modal");
import Gallery from "./Gallery";
var Parse = require("parse");
Parse.initialize("ABCDEFG12345");
Parse.serverURL = "http://psign.iriosystems.com:1380/parse";
// idea, add two playlist items  at each tick, placing default item when there is nothing to display the beginning

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: []
    };
    this.selectBanner = this.selectBanner.bind(this);
    this.selectVideo = this.selectVideo.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
    this.getSettings = this.getSettings.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  saveSettings() {
    console.log("Saving settings...");

    var Settings = Parse.Object.extend("Settings");
    var query = new Parse.Query(Settings);
    query
      .find(null)
      .then(settings => {
        var setting = settings[0];
        // console.log({ settings });
        // // this.setState({
        // //     settings: {
        // //         defaultVideo: setting.get('defaultVideo'),
        // //         defaultBanner: setting.get('defaultBanner')
        // //     }
        // // });
        setting.set("defaultVideo", this.state.settings.defaultVideo);
        setting.set("defaultBanner", this.state.settings.defaultBanner);
        setting
          .save(null)
          .then(k => console.log(k))
          .catch(err => console.log(err));
      })
      .then(() => this.props.parent.closeModal())
      .catch(err => console.log(err));
  }

  getSettings() {
    // fetch("/settings").then((response) => {
    //     return response.json()
    // }).then(k => {
    //     console.log("/settings", k);
    //     this.setState({ settings: k });
    // }).catch(e => {

    // });
    var Settings = Parse.Object.extend("Settings");
    var query = new Parse.Query(Settings);
    query.find(null).then(settings => {
      var setting = settings[0];
      console.log({ settings });
      this.setState({
        settings: {
          defaultVideo: setting.get("defaultVideo"),
          defaultBanner: setting.get("defaultBanner")
        }
      });
    });

    // var testObject = new TestObject();
    // testObject.save({ foo: "bar" }).then(function (object) {
    //     alert("yay! lsit worked");
    // });
    // Parse.Query()
  }

  componentDidMount() {
    this.getSettings();
    // componentDidMount is called by react when the component
    // has been rendered on the page. We can set the interval here:
  }

  componentWillUnmount() {}
  // this.props.parent.select(this.state.galleryItems[i])

  selectVideo(item) {
    console.log("selected video:", item);
    this.setState({ settings: { defaultVideo: item.name, defaultBanner: this.state.settings.defaultBanner }, selectVideoOpen: false, selectBannerOpen: false });
  }

  selectBanner(item) {
    console.log("selected banner:", item);
    this.setState({ settings: { defaultBanner: item.name, defaultVideo: this.state.settings.defaultVideo }, selectVideoOpen: false, selectBannerOpen: false });
  }

  closeModal() {
    this.setState({ selectVideoOpen: false, selectBannerOpen: false });
  }

  render() {
    return (
      <div style={{ backgroundColor: "white", marginLeft: 180, paddingLeft: 20, height: 600 }}>
        <h3 style={{ color: "blue" }}>Settings </h3>
        <p>Gif Banner</p>
        <img src={"/upload?filename=" + this.state.settings.defaultBanner} style={{ height: 80, width: 150 }} />
        <Modal style={modalStyle} isOpen={this.state.selectBannerOpen} onRequestClose={this.closeModal}>
          <Gallery onSelect={this.selectBanner} types=".jpg,.png,.gif" closeModal={this.closeModal} />
        </Modal>
        <button onClick={() => this.setState({ selectBannerOpen: true })}>Change Banner</button>

        <p>Default Video</p>
        <img src={"/upload?filename=" + this.state.settings.defaultVideo + ".thumb.png"} style={{ height: 150, width: 150 }} />
        <Modal style={modalStyle} isOpen={this.state.selectVideoOpen} onRequestClose={this.closeModal}>
          <Gallery onSelect={this.selectVideo} closeModal={this.closeModal} />
        </Modal>
        <button onClick={() => this.setState({ selectVideoOpen: true })}>Change Video</button>
        <br />
        <br />
        <br />

        <button onClick={this.saveSettings}>Save</button>
        <button onClick={this.props.parent.closeModal}>Close</button>
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
