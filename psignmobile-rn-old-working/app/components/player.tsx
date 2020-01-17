import { PSignStore } from "../stores/PSignStore";
import Marquee from "./marquee3";
import { observable, toJS, action } from "mobx";
import { Component } from "react";

import * as React from "react";
import {
  AppRegistry,
  Animated,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  View,
  WebView
  // takeSnapshot
} from "react-native";
// import * as ReactNative from "react-native";
import * as Expo from "expo";

import { DeviceEventEmitter, UIManager, TouchableOpacity } from "react-native";
import BackgroundTimer from "react-native-background-timer";
// import MediaPlayer from 'react-native-android-video-player'

var uuid = Expo.Constants.deviceId;

import { observer } from "mobx-react/native";
import { MarqueeLabel } from "./marqueeLabel";
// var Video = require("react-native-video").default;
import * as moment from "moment";
import { downloadVideo } from "../stores/FileCache";
var TimerMixin = require("react-timer-mixin");

import { Constants, Camera } from "expo";
import { Asset } from "./enhancedAsset";
import MarqueeText from "./marquee";
// import MediaPlayer from './MediaPlayer';

import { Video } from "react-native-media-kit";
//import {Video} from "expo";
var Parse = require("parse/react-native");
const CONFIG = {
  PARSE_SERVER: "https://psign.zeus.iriosystems.com/parse",
  PARSE_APP_ID: "psignApp",
  PARSE_REST_API_KEY: "psignApp"
};
Parse.initialize(CONFIG.PARSE_APP_ID);
Parse.serverURL = CONFIG.PARSE_SERVER;

var { height, width } = Dimensions.get("window");

var subscription = DeviceEventEmitter.addListener("locationUpdated", (location: { longitude?; latitude? }) => {
  console.log("got location", { location });
  //uuid
  var Devices = Parse.Object.extend("Devices");
  var query = new Parse.Query(Devices);

  query
    .equalTo("uuid", uuid)
    .find(null)
    .then(devices => {
      console.log("found device", { devices });
      var device = new Devices();
      if (devices.length > 0) {
        console.log("found it", devices);
        device = devices[0];
      }

      var longitude = location.longitude;
      var latitude = location.latitude;
      //   <Viewer
      //   RSS={this.RSS}
      //   bannerUrl={this.getBannerUrl()}
      //   videoVisible={this.state.video && this.state.video.localUri}
      //   videoUrl={this.state.video ? this.state.video.localUri : null}
      // />
      device.set("uuid", uuid);
      device.set("longitude", longitude.toString());
      device.set("latitude", latitude.toString());
      console.log("saving device", { uuid, longitude, latitude });
      device
        .save(null)
        .then(k => console.log(k))
        .catch(err => console.log(err));
    }); //.then(() => this.props.parent.closeModal()).catch(err => console.log(err));;
  /* Example location returned
        {
          speed: -1,
          longitude: -0.1337,
          latitude: 51.50998,
          accuracy: 5,
          heading: -1,
          altitude: 0,
          altitudeAccuracy: -1
        }
        */
});

const RSSSource = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<meta http-equiv="X-UA-Compatible" content="chrome=1; IE=edge" /> 	
	
	
	<link rel="stylesheet" type="text/css" href="http://inetwebdesign.com/jQueryTools/tickers/horizontal-news-ticker2/tickerstyle.css" media="screen" />
		
	
	

	<title>jQuery News Ticker with Google §API </title>
	
	<style>
body {    
    margin: 0 !important;
    padding: 0 !important;
} 
* {
   margin: 0px;
   padding: 0px;
   text-transform: capitalize;
}
a { color: inherit; text-transform:inherit; }
</style>
  		
	
</head>
<body>

	
<div>
	
	

	<div id="ticker-container" style="background-color: black;height:80;font-size: 37;marginTop:0">
	    <div id="ticker" style="background-color: black;;height:80;font-size: 40" >

	    	<span id="ticker-content" style="background-color: black;color: yellow; height:80; font-size: 37px">
            
            </span>			   
	    </div>
	   
		<div class="clear"></div>
	</div>

	
	<div id="content">
		<ul>
			
		</ul>
	</div>
	
</div>	
<script type="text/javascript" src="http://inetwebdesign.com/jQueryTools/tickers/horizontal-news-ticker2/js/jquery-1.3.2.js"></script>
	

	<script type="text/javascript" src="http://inetwebdesign.com/jQueryTools/tickers/horizontal-news-ticker2/js/tickerscript.js"></script>
</body>
</html>
`;

const HTML = `
<!DOCTYPE html>\n
<html>
  <head>
    <title>Hello Static World</title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=320, user-scalable=no">
    <style type="text/css">
      body {
        margin: 0;
        padding: 0;
        font: 62.5% arial, sans-serif;
        background: #ccc;
      }
      h1 {
        padding: 45px;
        margin: 0;
        text-align: center;
        color: #33f;
      }
    </style>
  </head>
  <body>
    <h1>Hello Static World</h1>
  </body>
</html>
`;

const RSSTIMER_INTERVAL = 1000 * 60 * 2;

@observer
class Player extends Component<{ store: PSignStore }, any> {
  camera: any;
  _viewer: any;
  rssTimer = null;
  @observable RSS = "Welcome to Pangaea Media Platform...";

  currentRSS = null;
  updateRSSFeed = async () => {
    var timerThread = action(async () => {
      try {
        if (this.currentRSS != this.props.store.settings.defaultRSS) {
          console.log("", {
            currentRSS: this.currentRSS,
            defaultRSS: this.props.store.settings.defaultRSS
          });
          var rss = await this.props.store.fetchRss(this.props.store.settings.defaultRSS);
          console.log("initPlayer rss", { rss });
          this.RSS = rss.query.results.feed.entry.map(k => k.title).join("       ");

          this.currentRSS = this.props.store.settings.defaultRSS || "http://newsrss.bbc.co.uk/rss/newsonline_uk_edition/world/rss.xml";
          // console.log({ RSS: this.RSS });
        }
      } catch (e) {
        // console.log("initPlayer rss", { e });
      }
    });

    timerThread();
    this.rssTimer = setInterval(timerThread, RSSTIMER_INTERVAL);
  };

  async initPlayer() {
    var settings = await this.props.store.getDefaultSettings(true);
    console.log("initPlayer", settings);
    this.props.store.watchLocation();
    this.updateRSSFeed();
    this.setState(
      {
        videourl: this.props.store.settings.defaultVideo,
        settings: this.props.store.settings,
        nextvideo: this.props.store.settings.defaultVideo,
        scrolling_text: "Welcome to PSign..."
      },
      async () => {
        this._downloadUpdateVideo();
      }
    );

    var now = new Date();
    var delay = 30 * 1000; // 1 min in msec
    var start = delay - now.getSeconds() * 1000 + now.getMilliseconds();
    console.log("timer", { delay, start });

    /*BackgroundTimer.*/ setTimeout(() => {
      var timer = setInterval(() => {
        var seconds = new Date().getSeconds();
        // console.log("timer", { seconds });
        if (seconds == 0 || seconds == 30) {
          /*BackgroundTimer.*/ setInterval(() => {
            // var seconds = new Date().getSeconds();

            // console.log("timer", { seconds });
            // if (this.state.videourl == "") {
            this.setState({
              videourl: this.state.videourl == "" || this.state.videourl == null ? this.props.store.settings.defaultVideo : this.state.videourl,
              settings: this.props.store.settings,
              scrolling_text: "Welcome to PSign..."
            });
            // }
          }, 1000);
          /*BackgroundTimer.*/ setInterval(this.onThehalfMinFunc, delay);
          this.onThehalfMinFunc();
          BackgroundTimer.clearInterval(timer);
        }
      }, 1000);
    }, start);
  }
  timer: any;
  constructor(props) {
    super(props);
    this.state = {
      name: "los poyos grosso hermanos",
      settings: {
        defaultVideo: "",
        defaultBanner: ""
      },
      scrolling_text: "Welcome to PSign ...",
      syncMessage: ""
    };
    this.tick = this.tick.bind(this);
    this.getTimeSlot = this.getTimeSlot.bind(this);
    this.loadSlot = this.loadSlot.bind(this);
    this.onThehalfMinFunc = this.onThehalfMinFunc.bind(this);
  }

  @observable videourl = "";
  getTimeSlot(date, hour, min, seconds) {
    var dateSelected = date;
    var duration = moment.duration();
    var min = min;
    var seconds = seconds;
    duration.add(hour, "hours");
    duration.add(min, "minutes");
    duration.add(seconds, "seconds");
    return dateSelected.add(duration);
  }

  getVideoUrl = (url: string): string => {
    return url;
    // ? this.props.store.SERVER_URL +
    //     (url.indexOf("/upload") != -1 ? url : "/upload?filename=" + url)
    // : this.props.store.settings.defaultVideo;
  };

  _downloadUpdateVideo = async () => {
    console.log("_downloadVideo ... start");
    var videoUrl = this.getVideoUrl(this.state.nextvideo);
    var videoStateUrl = (this.state.video && this.state.video.uri) || null;
    console.log("_downloadVideo", { videoUrl });
    console.log("_downloadVideo", videoUrl, { videoStateUrl });

    if (videoUrl == null || videoUrl.length == 0) {
      return;
    }

    console.log("_downloadVideo", videoUrl, { videoStateUrl });
    // if (!this.state.videourl || videoUrl != videoStateUrl) {
    const videoAsset = new Asset({
      name: videoUrl && videoUrl.replace(/(?!\.[^.]+$)\.|[^\w.]+/g, "").replace(".mp4", ""),
      type: "mp4",
      // path to the file somewhere on the internet
      uri: videoUrl,
      hash: videoUrl && videoUrl.replace(".", "_")
    } as any);

    this.setState(
      {
        video: videoAsset,
        start: new Date(),
        videourl: this.state.nextvideo
        // scrolling_text: this.state.nexttext
      },
      () => {
        //Only start from zero if we have a new video for this slot, otherwise, play away.
        // (this.refs["video"] as any).load();
        // (this.refs["video"] as any).play();
        console.log("this.state.nextvideo", this.state.nextvideo);
      }
    );

    try {
      //As the file is remote, we can't calculate its hash beforehand
      //so we download it without hash
      //downloadAsyncWithoutHash in enhancedAsset.js
      /**
       * @type {Boolean} cache
       *                    true: downloads asset to app cache
       *                    false: downloads asset to app data
       */
      await videoAsset.downloadAsyncWithoutHash({ cache: true });
      console.log("videoAsset downloaded", videoAsset);
      this.setState({ video: videoAsset });
    } catch (e) {
      console.warn(
        "There was an error caching assets (see: main.js), perhaps due to a " + "network timeout, so we skipped caching. Reload the app to try again."
      );
      console.log(e.message);
    } finally {
      this.setState({ appIsReady: true });
    }
    // }
  };

  async loadSlot(date, hour, min, seconds) {
    var timeSlot = moment(this.getTimeSlot(date, hour, min, seconds));
    // moment(req.query.time)
    try {
      // console.log("timeSlot", timeSlot);
      var slot = timeSlot.toDate().getTime();

      console.log("timeSlot", slot);
      var video = null;
      try {
        // Finding all video that fits
        var videos = await this.props.store.db.findAsync({
          timestamp: slot
        });

        // docs is an array containing documents Mars, Earth, Jupiter
        // If no document is found, docs is equal to []
        video = videos[0];
        console.log("db Slots", { video, videos });
        // console.log('parsed video', video)
      } catch (e) {
        console.log("DB Error", e);
      }
      if (video) {
        var newPlaylist = [this.state.videourl]; //this.state.playlist;
        newPlaylist.push(video.video);
        //call the downloadVideo function

        // this.setState({ start: new Date(), title: video.title, scrollingText: video.scrolling_text, videourl: video.video, playlist: newPlaylist, currentVideo: video.video });
        // this.refs.video.load();
        // this.refs.video.play();

        this.setState({
          nextvideo: video.video,
          nexttext: video.scrolling_text
        });
        console.log("nextvid", this.state.nextvideo);
      } else {
        console.log("move along nothing to see here...");
        if (this.state.videourl != this.props.store.settings.defaultVideo) {
          this.setState(
            {
              videourl: this.props.store.settings.defaultVideo,
              nextvideo: this.props.store.settings.defaultVideo,
              settings: this.props.store.settings,
              scrolling_text: "Welcome to PSign..."
            },

            () => {
              this._downloadUpdateVideo();
            }
          );
        }
      }
      // var result = await db.query(function (doc, emit) {
      //   emit(doc.scrolling_text);
      // }, {key: "Work work work work"});
      // "scrolling_text":"Work work work work"
    } catch (err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this.initPlayer();
  }

  componentWillReceiveProps(newProps) {}

  async onThehalfMinFunc() {
    var time = new Date().toTimeString();
    this.setState({ currentTime: time });
    console.log("timer halfmin", time);

    var lastVideo = this.state.videourl; //videourl

    console.log({ lastVideo, nextvid: this.state.nextvideo });
    if (this.state.nextvideo !== undefined && lastVideo != this.state.nextvideo) {
      // Feed.load("https://codek.tv/feed/", (err, rss)=> {
      //   console.log(rss);
      // });

      await this._downloadUpdateVideo();
    }

    try {
      console.log("taking snapshot");
      if (this.camera) {
        var snap = await this.camera.takePictureAsync({
          quality: 0.2,
          base64: true,
          exif: false
        });
        // alert("we have a snap: " + snap.length)
        // console.log(snap);
        // console.log("saved snapshot...",  snap.base64 );
        // var file = await Expo.FileSystem.readFile(snap.uri, "base64");
        // console.log("file", file);
        if (snap) this.props.store.latestSnapshot = snap.base64;
      }
      // var uri = await takeSnapshot("window",{
      //   format:"png",
      //   quality: 0.0
      // })
      // // //       var snapShot = await Expo.takeSnapshotAsync(this._viewer, {
      // // //   format: "png",
      // // //   result: "base64",
      // // //   quality: 1.0
      // // // });
      // // //  await
      // // //   "viewShot",
      // // //   {
      // // //     format: "jpg",
      // // //     result: "base64"
      // // //   }
      // // // );
      // console.log("saved snapshot...", { uri });
    } catch (e) {
      console.log("An Error occured saving snapshot", { e });
    }
    this.tick();
  }

  componentWillUnmount() {
    // This method is called immediately before the component is removed
    // from the page and destroyed. We can clear the interval here:

    clearInterval(this.timer);
    clearInterval(this.rssTimer);
  }

  tick() {
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
    console.log("loading next videos ... @" + tickDate.toTimeString());
    var date = tickDate.setHours(0, 0, 0, 0);
    // console.log
    // }
    // http://techslides.com/demos/sample-vid
    this.loadSlot(moment(date), otherDate.getHours(), otherDate.getMinutes(), (Math.floor(otherDate.getSeconds() / 30) + 1) * 30); //Todo fix this dont know why preview stores time wrong
  }

  getBannerUrl = () => {
    var bannerUrl = this.props.store.settings.defaultBanner;
    return bannerUrl;
  };
  render() {
    return (
      <View
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          backgroundColor: "white"
        }}
      >
        <Viewer
          ref={view => {
            this._viewer = view;
          }}
          RSS={this.RSS}
          bannerUrl={this.getBannerUrl()}
          videoVisible={this.state.video && this.state.video.localUri}
          videoUrl={this.state.video ? this.state.video.localUri : this.props.store.settings.defaultVideo}
        />
        {/* <Camera
          style={{
            position: "absolute",
            overflow: "hidden",
            backgroundColor: "rgba(0,0,0,0.1)",
            height: 50,
            width: 50
          }}
          ref={ref => {
            this.camera = ref;
          }}
          flashMode={Camera.Constants.FlashMode.off}
          type={Camera.Constants.Type.front}
          autoFocus={Camera.Constants.AutoFocus.off}
        /> */}
      </View>
    );
  }
}

class Viewer extends React.Component<{ RSS; bannerUrl; videoVisible; videoUrl }, any> {
  render() {
    const { bannerUrl, RSS, videoVisible, videoUrl } = this.props;
    console.log({width,height})
    return (
      <View style={styles.container}>
        <View style={{  height:104 }}>
          <Image
            style={{
              top: 0,
              left: 0,
              height: "100%",
              width: height > width ? height : width,
              backgroundColor: "white"
            }}
            resizeMode="contain"
            source={bannerUrl ? { uri: bannerUrl } : null}
          />
        </View>
        <View
          style={{
            flex: 1.8,
            backgroundColor: "black",
            width: "100%",
            height: "100%"
          }}
        >
          {videoVisible ? (
            <Video
              source={{ uri: videoUrl } as any}
              src={videoUrl}
              // src="http://v.yoai.com/femme_tampon_tutorial.mp4"
              style={styles.backgroundVideo}
              onLoad={params => {
                console.log(params);
              }}
              onError={e => {
                console.log(e);
              }}
              // poster={"http://static.yoaicdn.com/shoppc/images/cover_img_e1e9e6b.jpg"}
              controls={false}
              shouldPlay
              autoplay={true}
              isLooping
              loop={true}
              resizeMode="stretch"
              muted={false}
              volume={1.0}
              rate={1.0}
            />
          ) : (
            <View
              style={[
                styles.backgroundVideo,
                {
                  alignContent: "center",
                  justifyContent: "center",
                  alignItems: "center"
                }
              ]}
            >
              <Image source={require("../../assets/ajax-loader.gif")} />
              <Text style={{ color: "white" }}>Updating Content ... </Text>
            </View>
          )}
        </View>
        {/* <View style={{ flex: 0.2 }}>
          <MarqueeLabel
            style={styles.marqueeLabel}
            text={RSS}
            textSize={40}
            marqueeType="MLContinuous"
            scrollDuration={3.0}
            fadeLength={0.0}
            leadingBuffer={0.0}
            trailingBuffer={500}
            textColor="red"
            font={{ fontSize: 60, fontWeight: 0.4 }}
          />
        </View> */}
      </View>
    );
  }
}

// <MarqueeText
// style={{ fontSize: 24, flex:1}}
// duration={3000}
// marqueeOnStart
// useNativeDriver={true}
// loop
// marqueeDelay={1000}
// marqueeResetDelay={30000}
// >
// Lorem Ipsum is simply dummy text of the printing and typesetting industry and typesetting industry.
// </MarqueeText>

// <WebView
// source={{ html: RSSSource }}
// style={{ width: width, height: 0 }}
// automaticallyAdjustContentInsets={false}
// javaScriptEnabled={true}
// domStorageEnabled={true}
// decelerationRate="normal"
// startInLoadingState={true}
// scalesPageToFit={this.state.scalesPageToFit}
// />

// <View style={{ bottom: 0, right: 0, flex: 5 }}>
// <Text style={{ color: "red" }}>
//   {this.state.syncMessage}
//   {!this.state.nextvideo ? "" : ""}{" "}
// </Text>
// </View>
// <View style={{ bottom: 0, right: 0, flex: 1.3 }}>
// <WebView
//   source={{ html: RSSSource }}
//   style={{ width: width, height: 0 }}
//   automaticallyAdjustContentInsets={false}
//   javaScriptEnabled={true}
//   domStorageEnabled={true}
//   decelerationRate="normal"
//   startInLoadingState={true}
//   scalesPageToFit={this.state.scalesPageToFit}
// />
// </View>

// <CachingVideoPlayer
// defaultVideo={this.props.store.settings.defaultVideo}
// url={videoUrl}
// rate={1.0} // 0 is paused, 1 is normal.
// volume={1.0} // 0 is muted, 1 is normal.
// muted={false} // Mutes the audio entirely.
// paused={false} // Pauses playback entirely.
// resizeMode="cover" // Fill the whole screen at aspect ratio.
// repeat={true} // Repeat forever.
// style={styles.backgroundVideo}
// />

// <MarqueeLabel style={ styles.marqueeLabel } text = { this.state.scrolling_text }
//                     textSize = { 40}
//                     marqueeType = "MLContinuous"
//                     scrollDuration = { 3.0}
//                     fadeLength = { 0.0}
//                     leadingBuffer = { 0.0}
//                     trailingBuffer = { 50}
//                     textColor = 'red'
//                     font = {{ fontSize: 60, fontWeight: 0.4 }}/>
/*
    <Video source={ { uri: videoUrl } } // Can be a URL or a local file.
                rate = {1.0}                   // 0 is paused, 1 is normal.
                volume = {1.0}                 // 0 is muted, 1 is normal.
                muted = {false}                // Mutes the audio entirely.
                paused = {false}               // Pauses playback entirely.
                resizeMode = "cover"           // Fill the whole screen at aspect ratio.
                repeat = {true}                // Repeat forever.
                style = {styles.backgroundVideo }></Video>
            <Image style={ { top: 0, left: 0, height: 50, width: 100, backgroundColor: "yellow" } } resizeMode = "stretch" source= {{ uri: bannerUrl }}></Image>
            <View style= {{ bottom: 0, right: 0, flex: 5 }}>
                <Text style={ { color: "red" } }>{ this.state.syncMessage }{!this.state.nextvideo ? "" : "" } </Text>
            </View>
            <View style={ { bottom: 0, right: 0, flex: 1 } }>
                <MarqueeLabel style={ styles.marqueeLabel } text = { this.state.scrolling_text }
                    textSize = { 40}
                    marqueeType = "MLContinuous"
                    scrollDuration = { 3.0}
                    fadeLength = { 0.0}
                    leadingBuffer = { 0.0}
                    trailingBuffer = { 50}
                    textColor = 'red'
                    font = {{ fontSize: 60, fontWeight: 0.4 }}/>
            </View>
*/

const styles = StyleSheet.create({
  marqueeLabel: {
    flex: 1
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
    // height:900,
    width: "100%"
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "white",
    width: "100%"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});

export default Player;
