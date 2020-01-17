import * as React from "react";
import { Component } from "react";
import * as moment from "moment";
import { Calendar, CalendarControls } from "./Calendar";
import { Text, Button, View } from "react-native-web";
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
import Player from "react-player";

import "whatwg-fetch";
import Constants from "../Constants";
import Gallery from "./Gallery";
import { Database } from "../Database";

var DropzoneComponent = require("react-dropzone-component");
var ReactDOMServer = require("react-dom/server");
var Modal = require("react-modal");

var Parse = require("parse");
// Parse.initialize("ABCDEFG12345");
// Parse.serverURL = "http://psign.iriosystems.com:1380/parse";

class Preview extends React.Component<any,any> {
  timer: any;
  constructor(props) {
    super(props);

    this.state = {
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

    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.tick = this.tick.bind(this);
    this.saveEvent = this.saveEvent.bind(this);
    this.getTimeSlot = this.getTimeSlot.bind(this);
    this.loadSlot = this.loadSlot.bind(this);
    this.select = this.select.bind(this);
    this.getSettings = this.getSettings.bind(this);
  }

  async getSettings() {
    try {
      var setting = await Database.getSettings();
      var videourl = setting.defaultVideo.url; //Constants.SERVER_URL + "/upload?filename=" + setting.get("defaultVideo");
      this.setState(
        {
          settings: {
            defaultVideo: setting.defaultVideo,
            defaultBanner: setting.defaultBanner
          },
          videourl,
          bannerurl: setting.defaultBanner.url,
          playlist: [videourl],
          playing: true
        },
        () => {
          // console.log("default:" +  this.state.videourl);
          //   this.refs.video.load();
          //   this.refs.video.pause();
          //   this.refs.video.play();
        }
      );
    } catch (e) {
      alert("Failed to load settings..." + e.message);
    }
  }

  select(file) {
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
    this.setState(
      {
        start: new Date(),
        videourl: videourl,
        playlist: newPlaylist,
        isDefaultVideo: false,
        settings: this.state.settings,
        currentVideo: videourl,
        file
      },
      () => {
        // this.refs.video.load();
        // this.refs.video.pause();
        // this.refs.video.play();
        console.log("videourl: ", this.state.videourl);
      }
    );
    // this.refs.video.stop();
  }

  closeModal() {
    this.setState({ galleryOpen: false });
  }

  openModal() {
    this.setState({ galleryOpen: true });
  }

  getTimeSlot() {
    var dateSelected = moment(this.props.dateSelected.format &&  this.props.dateSelected.format() || this.props.dateSelected);
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

  async loadSlot() {
    var timeSlotT = this.getTimeSlot();

    console.log("timeSlot", { timeSlotT });

    try {
      var timeSlot = await Database.loadSlot(timeSlotT.toDate(), this.props.selectedGroup);
      if (!timeSlot) {
        alert("No Timeslot!");
        return this.getSettings();
      }
      console.log("got media", timeSlot);
      var newPlaylist = [timeSlot.video];
      this.setState({
        start: new Date(),
        title: timeSlot.title,
        scrollingText: timeSlot.scrolling_text,
        settings: this.state.settings,
        isDefaultVideo: false,
        videourl: timeSlot.video.file.url,
        playlist: newPlaylist,
        currentVideo: timeSlot.video,
        file: timeSlot.video//{ duration: timeSlot.duration }
      });
      console.log(this.state.videourl);
    } catch (e) {
      return this.getSettings();
    }

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
  }

  async saveEvent() {
    var timeSlot = this.getTimeSlot();
    console.log("timeSlot", moment(timeSlot));
    var file = this.state.file;
    console.log("saveEvent", { file: file });
    if (file) {
      try {
        await Database.saveSlot(
          file,
          timeSlot,
          this.state.title,
          this.state.scrolling_text,
          this.props.selectedGroup
        );
        this.props.parent.closeModal(); // We done
      } catch (e) {
        alert("Failed to save slot: " + e.message);
      }
    }
  }

  handleChange(event) {
    this.setState({ scrollingText: event.target.value });
  }

  handleTitleChange(event) {
    this.setState({ title: event.target.value });
  }

  componentDidMount() {
    // componentDidMount is called by react when the component
    // has been rendered on the page. We can set the interval here:
    this.loadSlot();
    this.timer = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    // This method is called immediately before the component is removed
    // from the page and destroyed. We can clear the interval here:

    clearInterval(this.timer);
  }

  tick() {
    // This function is called every 50 ms. It updates the
    // elapsed counter. Calling setState causes the component to be re-rendered

    this.setState({ elapsed: new Date() as any - this.state.start });
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
  render() {
    var elapsed = Math.round(this.state.elapsed / 100);

    // This will give a number with one digit after the decimal dot (xx.x):
    var seconds = (elapsed / 10).toFixed(1);
    var now = moment().format("HH:mm A");
    // console.log(now);

    return (
      <View>
        <h1>
          Settings for {this.state.title} Ad at {this.props.hourSelected}:{this.props.timeSelected[0]}-{" "}
          {this.props.hourSelected}: {this.props.timeSelected[1]} on
        </h1>
        <h3 style={{ color: "red" }}>Preview</h3>
        <center>
          <View
            id="calendar"
            align="center"
            style={{
              width: 640,
              height: 400,
              position: "relative",
              backgroundColor: "lightgray",
              lignContent: "center",
              flex: 1
            }}
          >
            <img
              style={{
                color: "yellow",
                backgroundColor: "black",
                fontSize: 30,
                position: "absolute",
                top: 0,
                right: 0,
                height: 80,
                width: "100%"
              }}
              src={this.state.bannerurl}
            />

            <Player
              style={{ width: "100%", height: 400 }}
              autoPlay
              loop
              ref="video"
              playing
              playsinline
              poster="https://camo.githubusercontent.com/e87d73e52109c623ea0e315993ab8b5f037fb00f/687474703a2f2f6d6465727269636b2e6769746875622e696f2f72656163742d68746d6c35766964656f2f6578616d706c652e706e673f763d31"
              url={this.state.videourl}
            />
            <marquee
              style={{
                color: "yellow",
                backgroundColor: "black",
                fontSize: 30,
                position: "absolute",
                bottom: 0,
                right: 80
              }}
              behavior="scroll"
              direction="left"
            >
              {this.state.scrollingText}
            </marquee>
            <div
              style={{
                color: "red",
                backgroundColor: "teal",
                fontSize: 30,
                position: "absolute",
                paddingRight: 8,
                paddingLeft: 8,
                bottom: 0,
                right: 0
              }}
            >
              {" "}
              {now}
            </div>
          </View>
        </center>
        <h3>
          Preview video started <b>{seconds}seconds</b> ago.
        </h3>

        <p>
          <b>Title</b>
        </p>
        <textarea
          onChange={this.handleTitleChange}
          value={this.state.title}
          ref="title"
          rows={1}
          style={{ width: "100%" }}
        />

        {/*<p>
          <b>Scrolling Text</b>
        </p>
        <textarea
          ref="scrollingText"
          value={this.state.scrollingText}
          onChange={this.handleChange}
          rows="3"
          style={{ width: "100%" }}
        />*/}
        <p>
          <b>
            Video (Current:
            {this.state.isDefaultVideo ? "Default" : this.state.videourl}){" "}
          </b>
        </p>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <b style={{ margin: 5 }}>
            <Button title="Pick An Ad from Gallery" onPress={this.openModal} />
          </b>

          <b style={{ margin: 5, width: 100 }}>
            <Button title="Save" color="darkgreen" onPress={this.saveEvent} />
          </b>
          <b style={{ margin: 5, width: 100 }}>
            <Button title="Cancel" onPress={this.props.parent.closeModal} />
          </b>
        </View>
        <Modal
          style={modalStyle}
          isOpen={this.state.galleryOpen}
          onRequestClose={this.closeModal}
        >
          <Gallery onSelect={this.select} closeModal={this.closeModal} />
        </Modal>
      </View>
    );
  }
}
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

export default Preview;
