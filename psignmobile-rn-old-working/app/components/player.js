"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mobx_1 = require("mobx");
const react_1 = require("react");
const React = require("react");
const react_native_1 = require("react-native");
// import * as ReactNative from "react-native";
const Expo = require("expo");
const react_native_2 = require("react-native");
const react_native_background_timer_1 = require("react-native-background-timer");
// import MediaPlayer from 'react-native-android-video-player'
var uuid = Expo.Constants.deviceId;
const native_1 = require("mobx-react/native");
// var Video = require("react-native-video").default;
const moment = require("moment");
var TimerMixin = require("react-timer-mixin");
const enhancedAsset_1 = require("./enhancedAsset");
// import MediaPlayer from './MediaPlayer';
const react_native_media_kit_1 = require("react-native-media-kit");
//import {Video} from "expo";
var Parse = require("parse/react-native");
const CONFIG = {
    PARSE_SERVER: "https://psign.zeus.iriosystems.com/parse",
    PARSE_APP_ID: "psignApp",
    PARSE_REST_API_KEY: "psignApp"
};
Parse.initialize(CONFIG.PARSE_APP_ID);
Parse.serverURL = CONFIG.PARSE_SERVER;
var { height, width } = react_native_1.Dimensions.get("window");
var subscription = react_native_2.DeviceEventEmitter.addListener("locationUpdated", (location) => {
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
let Player = class Player extends react_1.Component {
    constructor(props) {
        super(props);
        this.rssTimer = null;
        this.RSS = "Welcome to Pangaea Media Platform...";
        this.currentRSS = null;
        this.updateRSSFeed = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var timerThread = mobx_1.action(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                try {
                    if (this.currentRSS != this.props.store.settings.defaultRSS) {
                        console.log("", {
                            currentRSS: this.currentRSS,
                            defaultRSS: this.props.store.settings.defaultRSS
                        });
                        var rss = yield this.props.store.fetchRss(this.props.store.settings.defaultRSS);
                        console.log("initPlayer rss", { rss });
                        this.RSS = rss.query.results.feed.entry.map(k => k.title).join("       ");
                        this.currentRSS = this.props.store.settings.defaultRSS || "http://newsrss.bbc.co.uk/rss/newsonline_uk_edition/world/rss.xml";
                        // console.log({ RSS: this.RSS });
                    }
                }
                catch (e) {
                    // console.log("initPlayer rss", { e });
                }
            }));
            timerThread();
            this.rssTimer = setInterval(timerThread, RSSTIMER_INTERVAL);
        });
        this.videourl = "";
        this.getVideoUrl = (url) => {
            return url;
            // ? this.props.store.SERVER_URL +
            //     (url.indexOf("/upload") != -1 ? url : "/upload?filename=" + url)
            // : this.props.store.settings.defaultVideo;
        };
        this._downloadUpdateVideo = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
            const videoAsset = new enhancedAsset_1.Asset({
                name: videoUrl && videoUrl.replace(/(?!\.[^.]+$)\.|[^\w.]+/g, "").replace(".mp4", ""),
                type: "mp4",
                // path to the file somewhere on the internet
                uri: videoUrl,
                hash: videoUrl && videoUrl.replace(".", "_")
            });
            this.setState({
                video: videoAsset,
                start: new Date(),
                videourl: this.state.nextvideo
                // scrolling_text: this.state.nexttext
            }, () => {
                //Only start from zero if we have a new video for this slot, otherwise, play away.
                // (this.refs["video"] as any).load();
                // (this.refs["video"] as any).play();
                console.log("this.state.nextvideo", this.state.nextvideo);
            });
            try {
                //As the file is remote, we can't calculate its hash beforehand
                //so we download it without hash
                //downloadAsyncWithoutHash in enhancedAsset.js
                /**
                 * @type {Boolean} cache
                 *                    true: downloads asset to app cache
                 *                    false: downloads asset to app data
                 */
                yield videoAsset.downloadAsyncWithoutHash({ cache: true });
                console.log("videoAsset downloaded", videoAsset);
                this.setState({ video: videoAsset });
            }
            catch (e) {
                console.warn("There was an error caching assets (see: main.js), perhaps due to a " + "network timeout, so we skipped caching. Reload the app to try again.");
                console.log(e.message);
            }
            finally {
                this.setState({ appIsReady: true });
            }
            // }
        });
        this.getBannerUrl = () => {
            var bannerUrl = this.props.store.settings.defaultBanner;
            return bannerUrl;
        };
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
    initPlayer() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var settings = yield this.props.store.getDefaultSettings(true);
            console.log("initPlayer", settings);
            this.props.store.watchLocation();
            this.updateRSSFeed();
            this.setState({
                videourl: this.props.store.settings.defaultVideo,
                settings: this.props.store.settings,
                nextvideo: this.props.store.settings.defaultVideo,
                scrolling_text: "Welcome to PSign..."
            }, () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                this._downloadUpdateVideo();
            }));
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
                        react_native_background_timer_1.default.clearInterval(timer);
                    }
                }, 1000);
            }, start);
        });
    }
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
    loadSlot(date, hour, min, seconds) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var timeSlot = moment(this.getTimeSlot(date, hour, min, seconds));
            // moment(req.query.time)
            try {
                // console.log("timeSlot", timeSlot);
                var slot = timeSlot.toDate().getTime();
                console.log("timeSlot", slot);
                var video = null;
                try {
                    // Finding all video that fits
                    var videos = yield this.props.store.db.findAsync({
                        timestamp: slot
                    });
                    // docs is an array containing documents Mars, Earth, Jupiter
                    // If no document is found, docs is equal to []
                    video = videos[0];
                    console.log("db Slots", { video, videos });
                    // console.log('parsed video', video)
                }
                catch (e) {
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
                }
                else {
                    console.log("move along nothing to see here...");
                    if (this.state.videourl != this.props.store.settings.defaultVideo) {
                        this.setState({
                            videourl: this.props.store.settings.defaultVideo,
                            nextvideo: this.props.store.settings.defaultVideo,
                            settings: this.props.store.settings,
                            scrolling_text: "Welcome to PSign..."
                        }, () => {
                            this._downloadUpdateVideo();
                        });
                    }
                }
                // var result = await db.query(function (doc, emit) {
                //   emit(doc.scrolling_text);
                // }, {key: "Work work work work"});
                // "scrolling_text":"Work work work work"
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    componentDidMount() {
        this.initPlayer();
    }
    componentWillReceiveProps(newProps) { }
    onThehalfMinFunc() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var time = new Date().toTimeString();
            this.setState({ currentTime: time });
            console.log("timer halfmin", time);
            var lastVideo = this.state.videourl; //videourl
            console.log({ lastVideo, nextvid: this.state.nextvideo });
            if (this.state.nextvideo !== undefined && lastVideo != this.state.nextvideo) {
                // Feed.load("https://codek.tv/feed/", (err, rss)=> {
                //   console.log(rss);
                // });
                yield this._downloadUpdateVideo();
            }
            try {
                console.log("taking snapshot");
                if (this.camera) {
                    var snap = yield this.camera.takePictureAsync({
                        quality: 0.2,
                        base64: true,
                        exif: false
                    });
                    // alert("we have a snap: " + snap.length)
                    // console.log(snap);
                    // console.log("saved snapshot...",  snap.base64 );
                    // var file = await Expo.FileSystem.readFile(snap.uri, "base64");
                    // console.log("file", file);
                    if (snap)
                        this.props.store.latestSnapshot = snap.base64;
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
            }
            catch (e) {
                console.log("An Error occured saving snapshot", { e });
            }
            this.tick();
        });
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
    render() {
        return (<react_native_1.View style={{
            flex: 1,
            width: "100%",
            height: "100%",
            backgroundColor: "white"
        }}>
        <Viewer ref={view => {
            this._viewer = view;
        }} RSS={this.RSS} bannerUrl={this.getBannerUrl()} videoVisible={this.state.video && this.state.video.localUri} videoUrl={this.state.video ? this.state.video.localUri : this.props.store.settings.defaultVideo}/>
        
      </react_native_1.View>);
    }
};
tslib_1.__decorate([
    mobx_1.observable
], Player.prototype, "RSS", void 0);
tslib_1.__decorate([
    mobx_1.observable
], Player.prototype, "videourl", void 0);
Player = tslib_1.__decorate([
    native_1.observer
], Player);
class Viewer extends React.Component {
    render() {
        const { bannerUrl, RSS, videoVisible, videoUrl } = this.props;
        console.log({ width, height });
        return (<react_native_1.View style={styles.container}>
        <react_native_1.View style={{ height: 104 }}>
          <react_native_1.Image style={{
            top: 0,
            left: 0,
            height: "100%",
            width: height > width ? height : width,
            backgroundColor: "white"
        }} resizeMode="contain" source={bannerUrl ? { uri: bannerUrl } : null}/>
        </react_native_1.View>
        <react_native_1.View style={{
            flex: 1.8,
            backgroundColor: "black",
            width: "100%",
            height: "100%"
        }}>
          {videoVisible ? (<react_native_media_kit_1.Video source={{ uri: videoUrl }} src={videoUrl} 
        // src="http://v.yoai.com/femme_tampon_tutorial.mp4"
        style={styles.backgroundVideo} onLoad={params => {
            console.log(params);
        }} onError={e => {
            console.log(e);
        }} 
        // poster={"http://static.yoaicdn.com/shoppc/images/cover_img_e1e9e6b.jpg"}
        controls={false} shouldPlay autoplay={true} isLooping loop={true} resizeMode="stretch" muted={false} volume={1.0} rate={1.0}/>) : (<react_native_1.View style={[
            styles.backgroundVideo,
            {
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center"
            }
        ]}>
              <react_native_1.Image source={require("../../assets/ajax-loader.gif")}/>
              <react_native_1.Text style={{ color: "white" }}>Updating Content ... </react_native_1.Text>
            </react_native_1.View>)}
        </react_native_1.View>
        
      </react_native_1.View>);
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
const styles = react_native_1.StyleSheet.create({
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
exports.default = Player;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGxheWVyLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSwrQkFBZ0Q7QUFDaEQsaUNBQWtDO0FBRWxDLCtCQUErQjtBQUMvQiwrQ0FVc0I7QUFDdEIsK0NBQStDO0FBQy9DLDZCQUE2QjtBQUU3QiwrQ0FBK0U7QUFDL0UsaUZBQTREO0FBQzVELDhEQUE4RDtBQUU5RCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztBQUVuQyw4Q0FBNkM7QUFFN0MscURBQXFEO0FBQ3JELGlDQUFpQztBQUVqQyxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUc5QyxtREFBd0M7QUFFeEMsMkNBQTJDO0FBRTNDLG1FQUErQztBQUMvQyw2QkFBNkI7QUFDN0IsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDMUMsTUFBTSxNQUFNLEdBQUc7SUFDYixZQUFZLEVBQUUsMENBQTBDO0lBQ3hELFlBQVksRUFBRSxVQUFVO0lBQ3hCLGtCQUFrQixFQUFFLFVBQVU7Q0FDL0IsQ0FBQztBQUNGLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3RDLEtBQUssQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztBQUV0QyxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLHlCQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRWpELElBQUksWUFBWSxHQUFHLGlDQUFrQixDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLFFBQW1DLEVBQUUsRUFBRTtJQUMzRyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFDMUMsTUFBTTtJQUNOLElBQUksT0FBTyxHQUFHLEtBQUssQ0FB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TSxFQUFFLEVBQUU7S0FDWDtJQUNELFlBQVksRUFBRTtRQUNaLFNBQVMsRUFBRSxRQUFRO1FBQ25CLEtBQUssRUFBRSxTQUFTO1FBQ2hCLFlBQVksRUFBRSxDQUFDO0tBQ2hCO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsa0JBQWUsTUFBTSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUFNpZ25TdG9yZSB9IGZyb20gXCIuLi9zdG9yZXMvUFNpZ25TdG9yZVwiO1xuaW1wb3J0IE1hcnF1ZWUgZnJvbSBcIi4vbWFycXVlZTNcIjtcbmltcG9ydCB7IG9ic2VydmFibGUsIHRvSlMsIGFjdGlvbiB9IGZyb20gXCJtb2J4XCI7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwicmVhY3RcIjtcblxuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQge1xuICBBcHBSZWdpc3RyeSxcbiAgQW5pbWF0ZWQsXG4gIEltYWdlLFxuICBTdHlsZVNoZWV0LFxuICBEaW1lbnNpb25zLFxuICBUZXh0LFxuICBWaWV3LFxuICBXZWJWaWV3XG4gIC8vIHRha2VTbmFwc2hvdFxufSBmcm9tIFwicmVhY3QtbmF0aXZlXCI7XG4vLyBpbXBvcnQgKiBhcyBSZWFjdE5hdGl2ZSBmcm9tIFwicmVhY3QtbmF0aXZlXCI7XG5pbXBvcnQgKiBhcyBFeHBvIGZyb20gXCJleHBvXCI7XG5cbmltcG9ydCB7IERldmljZUV2ZW50RW1pdHRlciwgVUlNYW5hZ2VyLCBUb3VjaGFibGVPcGFjaXR5IH0gZnJvbSBcInJlYWN0LW5hdGl2ZVwiO1xuaW1wb3J0IEJhY2tncm91bmRUaW1lciBmcm9tIFwicmVhY3QtbmF0aXZlLWJhY2tncm91bmQtdGltZXJcIjtcbi8vIGltcG9ydCBNZWRpYVBsYXllciBmcm9tICdyZWFjdC1uYXRpdmUtYW5kcm9pZC12aWRlby1wbGF5ZXInXG5cbnZhciB1dWlkID0gRXhwby5Db25zdGFudHMuZGV2aWNlSWQ7XG5cbmltcG9ydCB7IG9ic2VydmVyIH0gZnJvbSBcIm1vYngtcmVhY3QvbmF0aXZlXCI7XG5pbXBvcnQgeyBNYXJxdWVlTGFiZWwgfSBmcm9tIFwiLi9tYXJxdWVlTGFiZWxcIjtcbi8vIHZhciBWaWRlbyA9IHJlcXVpcmUoXCJyZWFjdC1uYXRpdmUtdmlkZW9cIikuZGVmYXVsdDtcbmltcG9ydCAqIGFzIG1vbWVudCBmcm9tIFwibW9tZW50XCI7XG5pbXBvcnQgeyBkb3dubG9hZFZpZGVvIH0gZnJvbSBcIi4uL3N0b3Jlcy9GaWxlQ2FjaGVcIjtcbnZhciBUaW1lck1peGluID0gcmVxdWlyZShcInJlYWN0LXRpbWVyLW1peGluXCIpO1xuXG5pbXBvcnQgeyBDb25zdGFudHMsIENhbWVyYSB9IGZyb20gXCJleHBvXCI7XG5pbXBvcnQgeyBBc3NldCB9IGZyb20gXCIuL2VuaGFuY2VkQXNzZXRcIjtcbmltcG9ydCBNYXJxdWVlVGV4dCBmcm9tIFwiLi9tYXJxdWVlXCI7XG4vLyBpbXBvcnQgTWVkaWFQbGF5ZXIgZnJvbSAnLi9NZWRpYVBsYXllcic7XG5cbmltcG9ydCB7IFZpZGVvIH0gZnJvbSBcInJlYWN0LW5hdGl2ZS1tZWRpYS1raXRcIjtcbi8vaW1wb3J0IHtWaWRlb30gZnJvbSBcImV4cG9cIjtcbnZhciBQYXJzZSA9IHJlcXVpcmUoXCJwYXJzZS9yZWFjdC1uYXRpdmVcIik7XG5jb25zdCBDT05GSUcgPSB7XG4gIFBBUlNFX1NFUlZFUjogXCJodHRwczovL3BzaWduLnpldXMuaXJpb3N5c3RlbXMuY29tL3BhcnNlXCIsXG4gIFBBUlNFX0FQUF9JRDogXCJwc2lnbkFwcFwiLFxuICBQQVJTRV9SRVNUX0FQSV9LRVk6IFwicHNpZ25BcHBcIlxufTtcblBhcnNlLmluaXRpYWxpemUoQ09ORklHLlBBUlNFX0FQUF9JRCk7XG5QYXJzZS5zZXJ2ZXJVUkwgPSBDT05GSUcuUEFSU0VfU0VSVkVSO1xuXG52YXIgeyBoZWlnaHQsIHdpZHRoIH0gPSBEaW1lbnNpb25zLmdldChcIndpbmRvd1wiKTtcblxudmFyIHN1YnNjcmlwdGlvbiA9IERldmljZUV2ZW50RW1pdHRlci5hZGRMaXN0ZW5lcihcImxvY2F0aW9uVXBkYXRlZFwiLCAobG9jYXRpb246IHsgbG9uZ2l0dWRlPzsgbGF0aXR1ZGU/IH0pID0+IHtcbiAgY29uc29sZS5sb2coXCJnb3QgbG9jYXRpb25cIiwgeyBsb2NhdGlvbiB9KTtcbiAgLy91dWlkXG4gIHZhciBEZXZpY2VzID0gUGFyc2UuT2JqZWN0LmV4dGVuZChcIkRldmljZXNcIik7XG4gIHZhciBxdWVyeSA9IG5ldyBQYXJzZS5RdWVyeShEZXZpY2VzKTtcblxuICBxdWVyeVxuICAgIC5lcXVhbFRvKFwidXVpZFwiLCB1dWlkKVxuICAgIC5maW5kKG51bGwpXG4gICAgLnRoZW4oZGV2aWNlcyA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcImZvdW5kIGRldmljZVwiLCB7IGRldmljZXMgfSk7XG4gICAgICB2YXIgZGV2aWNlID0gbmV3IERldmljZXMoKTtcbiAgICAgIGlmIChkZXZpY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJmb3VuZCBpdFwiLCBkZXZpY2VzKTtcbiAgICAgICAgZGV2aWNlID0gZGV2aWNlc1swXTtcbiAgICAgIH1cblxuICAgICAgdmFyIGxvbmdpdHVkZSA9IGxvY2F0aW9uLmxvbmdpdHVkZTtcbiAgICAgIHZhciBsYXRpdHVkZSA9IGxvY2F0aW9uLmxhdGl0dWRlO1xuICAgICAgLy8gICA8Vmlld2VyXG4gICAgICAvLyAgIFJTUz17dGhpcy5SU1N9XG4gICAgICAvLyAgIGJhbm5lclVybD17dGhpcy5nZXRCYW5uZXJVcmwoKX1cbiAgICAgIC8vICAgdmlkZW9WaXNpYmxlPXt0aGlzLnN0YXRlLnZpZGVvICYmIHRoaXMuc3RhdGUudmlkZW8ubG9jYWxVcml9XG4gICAgICAvLyAgIHZpZGVvVXJsPXt0aGlzLnN0YXRlLnZpZGVvID8gdGhpcy5zdGF0ZS52aWRlby5sb2NhbFVyaSA6IG51bGx9XG4gICAgICAvLyAvPlxuICAgICAgZGV2aWNlLnNldChcInV1aWRcIiwgdXVpZCk7XG4gICAgICBkZXZpY2Uuc2V0KFwibG9uZ2l0dWRlXCIsIGxvbmdpdHVkZS50b1N0cmluZygpKTtcbiAgICAgIGRldmljZS5zZXQoXCJsYXRpdHVkZVwiLCBsYXRpdHVkZS50b1N0cmluZygpKTtcbiAgICAgIGNvbnNvbGUubG9nKFwic2F2aW5nIGRldmljZVwiLCB7IHV1aWQsIGxvbmdpdHVkZSwgbGF0aXR1ZGUgfSk7XG4gICAgICBkZXZpY2VcbiAgICAgICAgLnNhdmUobnVsbClcbiAgICAgICAgLnRoZW4oayA9PiBjb25zb2xlLmxvZyhrKSlcbiAgICAgICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcbiAgICB9KTsgLy8udGhlbigoKSA9PiB0aGlzLnByb3BzLnBhcmVudC5jbG9zZU1vZGFsKCkpLmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTs7XG4gIC8qIEV4YW1wbGUgbG9jYXRpb24gcmV0dXJuZWRcbiAgICAgICAge1xuICAgICAgICAgIHNwZWVkOiAtMSxcbiAgICAgICAgICBsb25naXR1ZGU6IC0wLjEzMzcsXG4gICAgICAgICAgbGF0aXR1ZGU6IDUxLjUwOTk4LFxuICAgICAgICAgIGFjY3VyYWN5OiA1LFxuICAgICAgICAgIGhlYWRpbmc6IC0xLFxuICAgICAgICAgIGFsdGl0dWRlOiAwLFxuICAgICAgICAgIGFsdGl0dWRlQWNjdXJhY3k6IC0xXG4gICAgICAgIH1cbiAgICAgICAgKi9cbn0pO1xuXG5jb25zdCBSU1NTb3VyY2UgPSBgPCFET0NUWVBFIGh0bWw+XG48aHRtbCBsYW5nPVwiZW5cIj5cbjxoZWFkPlxuXHQ8bWV0YSBodHRwLWVxdWl2PVwiY29udGVudC10eXBlXCIgY29udGVudD1cInRleHQvaHRtbDsgY2hhcnNldD11dGYtOFwiIC8+XG5cdDxtZXRhIGh0dHAtZXF1aXY9XCJYLVVBLUNvbXBhdGlibGVcIiBjb250ZW50PVwiY2hyb21lPTE7IElFPWVkZ2VcIiAvPiBcdFxuXHRcblx0XG5cdDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiB0eXBlPVwidGV4dC9jc3NcIiBocmVmPVwiaHR0cDovL2luZXR3ZWJkZXNpZ24uY29tL2pRdWVyeVRvb2xzL3RpY2tlcnMvaG9yaXpvbnRhbC1uZXdzLXRpY2tlcjIvdGlja2Vyc3R5bGUuY3NzXCIgbWVkaWE9XCJzY3JlZW5cIiAvPlxuXHRcdFxuXHRcblx0XG5cblx0PHRpdGxlPmpRdWVyeSBOZXdzIFRpY2tlciB3aXRoIEdvb2dsZSDCp0FQSSA8L3RpdGxlPlxuXHRcblx0PHN0eWxlPlxuYm9keSB7ICAgIFxuICAgIG1hcmdpbjogMCAhaW1wb3J0YW50O1xuICAgIHBhZGRpbmc6IDAgIWltcG9ydGFudDtcbn0gXG4qIHtcbiAgIG1hcmdpbjogMHB4O1xuICAgcGFkZGluZzogMHB4O1xuICAgdGV4dC10cmFuc2Zvcm06IGNhcGl0YWxpemU7XG59XG5hIHsgY29sb3I6IGluaGVyaXQ7IHRleHQtdHJhbnNmb3JtOmluaGVyaXQ7IH1cbjwvc3R5bGU+XG4gIFx0XHRcblx0XG48L2hlYWQ+XG48Ym9keT5cblxuXHRcbjxkaXY+XG5cdFxuXHRcblxuXHQ8ZGl2IGlkPVwidGlja2VyLWNvbnRhaW5lclwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7aGVpZ2h0OjgwO2ZvbnQtc2l6ZTogMzc7bWFyZ2luVG9wOjBcIj5cblx0ICAgIDxkaXYgaWQ9XCJ0aWNrZXJcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6IGJsYWNrOztoZWlnaHQ6ODA7Zm9udC1zaXplOiA0MFwiID5cblxuXHQgICAgXHQ8c3BhbiBpZD1cInRpY2tlci1jb250ZW50XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztjb2xvcjogeWVsbG93OyBoZWlnaHQ6ODA7IGZvbnQtc2l6ZTogMzdweFwiPlxuICAgICAgICAgICAgXG4gICAgICAgICAgICA8L3NwYW4+XHRcdFx0ICAgXG5cdCAgICA8L2Rpdj5cblx0ICAgXG5cdFx0PGRpdiBjbGFzcz1cImNsZWFyXCI+PC9kaXY+XG5cdDwvZGl2PlxuXG5cdFxuXHQ8ZGl2IGlkPVwiY29udGVudFwiPlxuXHRcdDx1bD5cblx0XHRcdFxuXHRcdDwvdWw+XG5cdDwvZGl2PlxuXHRcbjwvZGl2Plx0XG48c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIiBzcmM9XCJodHRwOi8vaW5ldHdlYmRlc2lnbi5jb20valF1ZXJ5VG9vbHMvdGlja2Vycy9ob3Jpem9udGFsLW5ld3MtdGlja2VyMi9qcy9qcXVlcnktMS4zLjIuanNcIj48L3NjcmlwdD5cblx0XG5cblx0PHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIgc3JjPVwiaHR0cDovL2luZXR3ZWJkZXNpZ24uY29tL2pRdWVyeVRvb2xzL3RpY2tlcnMvaG9yaXpvbnRhbC1uZXdzLXRpY2tlcjIvanMvdGlja2Vyc2NyaXB0LmpzXCI+PC9zY3JpcHQ+XG48L2JvZHk+XG48L2h0bWw+XG5gO1xuXG5jb25zdCBIVE1MID0gYFxuPCFET0NUWVBFIGh0bWw+XFxuXG48aHRtbD5cbiAgPGhlYWQ+XG4gICAgPHRpdGxlPkhlbGxvIFN0YXRpYyBXb3JsZDwvdGl0bGU+XG4gICAgPG1ldGEgaHR0cC1lcXVpdj1cImNvbnRlbnQtdHlwZVwiIGNvbnRlbnQ9XCJ0ZXh0L2h0bWw7IGNoYXJzZXQ9dXRmLThcIj5cbiAgICA8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9MzIwLCB1c2VyLXNjYWxhYmxlPW5vXCI+XG4gICAgPHN0eWxlIHR5cGU9XCJ0ZXh0L2Nzc1wiPlxuICAgICAgYm9keSB7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgcGFkZGluZzogMDtcbiAgICAgICAgZm9udDogNjIuNSUgYXJpYWwsIHNhbnMtc2VyaWY7XG4gICAgICAgIGJhY2tncm91bmQ6ICNjY2M7XG4gICAgICB9XG4gICAgICBoMSB7XG4gICAgICAgIHBhZGRpbmc6IDQ1cHg7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICBjb2xvcjogIzMzZjtcbiAgICAgIH1cbiAgICA8L3N0eWxlPlxuICA8L2hlYWQ+XG4gIDxib2R5PlxuICAgIDxoMT5IZWxsbyBTdGF0aWMgV29ybGQ8L2gxPlxuICA8L2JvZHk+XG48L2h0bWw+XG5gO1xuXG5jb25zdCBSU1NUSU1FUl9JTlRFUlZBTCA9IDEwMDAgKiA2MCAqIDI7XG5cbkBvYnNlcnZlclxuY2xhc3MgUGxheWVyIGV4dGVuZHMgQ29tcG9uZW50PHsgc3RvcmU6IFBTaWduU3RvcmUgfSwgYW55PiB7XG4gIGNhbWVyYTogYW55O1xuICBfdmlld2VyOiBhbnk7XG4gIHJzc1RpbWVyID0gbnVsbDtcbiAgQG9ic2VydmFibGUgUlNTID0gXCJXZWxjb21lIHRvIFBhbmdhZWEgTWVkaWEgUGxhdGZvcm0uLi5cIjtcblxuICBjdXJyZW50UlNTID0gbnVsbDtcbiAgdXBkYXRlUlNTRmVlZCA9IGFzeW5jICgpID0+IHtcbiAgICB2YXIgdGltZXJUaHJlYWQgPSBhY3Rpb24oYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFJTUyAhPSB0aGlzLnByb3BzLnN0b3JlLnNldHRpbmdzLmRlZmF1bHRSU1MpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlwiLCB7XG4gICAgICAgICAgICBjdXJyZW50UlNTOiB0aGlzLmN1cnJlbnRSU1MsXG4gICAgICAgICAgICBkZWZhdWx0UlNTOiB0aGlzLnByb3BzLnN0b3JlLnNldHRpbmdzLmRlZmF1bHRSU1NcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB2YXIgcnNzID0gYXdhaXQgdGhpcy5wcm9wcy5zdG9yZS5mZXRjaFJzcyh0aGlzLnByb3BzLnN0b3JlLnNldHRpbmdzLmRlZmF1bHRSU1MpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW5pdFBsYXllciByc3NcIiwgeyByc3MgfSk7XG4gICAgICAgICAgdGhpcy5SU1MgPSByc3MucXVlcnkucmVzdWx0cy5mZWVkLmVudHJ5Lm1hcChrID0+IGsudGl0bGUpLmpvaW4oXCIgICAgICAgXCIpO1xuXG4gICAgICAgICAgdGhpcy5jdXJyZW50UlNTID0gdGhpcy5wcm9wcy5zdG9yZS5zZXR0aW5ncy5kZWZhdWx0UlNTIHx8IFwiaHR0cDovL25ld3Nyc3MuYmJjLmNvLnVrL3Jzcy9uZXdzb25saW5lX3VrX2VkaXRpb24vd29ybGQvcnNzLnhtbFwiO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHsgUlNTOiB0aGlzLlJTUyB9KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImluaXRQbGF5ZXIgcnNzXCIsIHsgZSB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRpbWVyVGhyZWFkKCk7XG4gICAgdGhpcy5yc3NUaW1lciA9IHNldEludGVydmFsKHRpbWVyVGhyZWFkLCBSU1NUSU1FUl9JTlRFUlZBTCk7XG4gIH07XG5cbiAgYXN5bmMgaW5pdFBsYXllcigpIHtcbiAgICB2YXIgc2V0dGluZ3MgPSBhd2FpdCB0aGlzLnByb3BzLnN0b3JlLmdldERlZmF1bHRTZXR0aW5ncyh0cnVlKTtcbiAgICBjb25zb2xlLmxvZyhcImluaXRQbGF5ZXJcIiwgc2V0dGluZ3MpO1xuICAgIHRoaXMucHJvcHMuc3RvcmUud2F0Y2hMb2NhdGlvbigpO1xuICAgIHRoaXMudXBkYXRlUlNTRmVlZCgpO1xuICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICB7XG4gICAgICAgIHZpZGVvdXJsOiB0aGlzLnByb3BzLnN0b3JlLnNldHRpbmdzLmRlZmF1bHRWaWRlbyxcbiAgICAgICAgc2V0dGluZ3M6IHRoaXMucHJvcHMuc3RvcmUuc2V0dGluZ3MsXG4gICAgICAgIG5leHR2aWRlbzogdGhpcy5wcm9wcy5zdG9yZS5zZXR0aW5ncy5kZWZhdWx0VmlkZW8sXG4gICAgICAgIHNjcm9sbGluZ190ZXh0OiBcIldlbGNvbWUgdG8gUFNpZ24uLi5cIlxuICAgICAgfSxcbiAgICAgIGFzeW5jICgpID0+IHtcbiAgICAgICAgdGhpcy5fZG93bmxvYWRVcGRhdGVWaWRlbygpO1xuICAgICAgfVxuICAgICk7XG5cbiAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcbiAgICB2YXIgZGVsYXkgPSAzMCAqIDEwMDA7IC8vIDEgbWluIGluIG1zZWNcbiAgICB2YXIgc3RhcnQgPSBkZWxheSAtIG5vdy5nZXRTZWNvbmRzKCkgKiAxMDAwICsgbm93LmdldE1pbGxpc2Vjb25kcygpO1xuICAgIGNvbnNvbGUubG9nKFwidGltZXJcIiwgeyBkZWxheSwgc3RhcnQgfSk7XG5cbiAgICAvKkJhY2tncm91bmRUaW1lci4qLyBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHZhciB0aW1lciA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgdmFyIHNlY29uZHMgPSBuZXcgRGF0ZSgpLmdldFNlY29uZHMoKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0aW1lclwiLCB7IHNlY29uZHMgfSk7XG4gICAgICAgIGlmIChzZWNvbmRzID09IDAgfHwgc2Vjb25kcyA9PSAzMCkge1xuICAgICAgICAgIC8qQmFja2dyb3VuZFRpbWVyLiovIHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgIC8vIHZhciBzZWNvbmRzID0gbmV3IERhdGUoKS5nZXRTZWNvbmRzKCk7XG5cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwidGltZXJcIiwgeyBzZWNvbmRzIH0pO1xuICAgICAgICAgICAgLy8gaWYgKHRoaXMuc3RhdGUudmlkZW91cmwgPT0gXCJcIikge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIHZpZGVvdXJsOiB0aGlzLnN0YXRlLnZpZGVvdXJsID09IFwiXCIgfHwgdGhpcy5zdGF0ZS52aWRlb3VybCA9PSBudWxsID8gdGhpcy5wcm9wcy5zdG9yZS5zZXR0aW5ncy5kZWZhdWx0VmlkZW8gOiB0aGlzLnN0YXRlLnZpZGVvdXJsLFxuICAgICAgICAgICAgICBzZXR0aW5nczogdGhpcy5wcm9wcy5zdG9yZS5zZXR0aW5ncyxcbiAgICAgICAgICAgICAgc2Nyb2xsaW5nX3RleHQ6IFwiV2VsY29tZSB0byBQU2lnbi4uLlwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAvKkJhY2tncm91bmRUaW1lci4qLyBzZXRJbnRlcnZhbCh0aGlzLm9uVGhlaGFsZk1pbkZ1bmMsIGRlbGF5KTtcbiAgICAgICAgICB0aGlzLm9uVGhlaGFsZk1pbkZ1bmMoKTtcbiAgICAgICAgICBCYWNrZ3JvdW5kVGltZXIuY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgICAgIH1cbiAgICAgIH0sIDEwMDApO1xuICAgIH0sIHN0YXJ0KTtcbiAgfVxuICB0aW1lcjogYW55O1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbmFtZTogXCJsb3MgcG95b3MgZ3Jvc3NvIGhlcm1hbm9zXCIsXG4gICAgICBzZXR0aW5nczoge1xuICAgICAgICBkZWZhdWx0VmlkZW86IFwiXCIsXG4gICAgICAgIGRlZmF1bHRCYW5uZXI6IFwiXCJcbiAgICAgIH0sXG4gICAgICBzY3JvbGxpbmdfdGV4dDogXCJXZWxjb21lIHRvIFBTaWduIC4uLlwiLFxuICAgICAgc3luY01lc3NhZ2U6IFwiXCJcbiAgICB9O1xuICAgIHRoaXMudGljayA9IHRoaXMudGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZ2V0VGltZVNsb3QgPSB0aGlzLmdldFRpbWVTbG90LmJpbmQodGhpcyk7XG4gICAgdGhpcy5sb2FkU2xvdCA9IHRoaXMubG9hZFNsb3QuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uVGhlaGFsZk1pbkZ1bmMgPSB0aGlzLm9uVGhlaGFsZk1pbkZ1bmMuYmluZCh0aGlzKTtcbiAgfVxuXG4gIEBvYnNlcnZhYmxlIHZpZGVvdXJsID0gXCJcIjtcbiAgZ2V0VGltZVNsb3QoZGF0ZSwgaG91ciwgbWluLCBzZWNvbmRzKSB7XG4gICAgdmFyIGRhdGVTZWxlY3RlZCA9IGRhdGU7XG4gICAgdmFyIGR1cmF0aW9uID0gbW9tZW50LmR1cmF0aW9uKCk7XG4gICAgdmFyIG1pbiA9IG1pbjtcbiAgICB2YXIgc2Vjb25kcyA9IHNlY29uZHM7XG4gICAgZHVyYXRpb24uYWRkKGhvdXIsIFwiaG91cnNcIik7XG4gICAgZHVyYXRpb24uYWRkKG1pbiwgXCJtaW51dGVzXCIpO1xuICAgIGR1cmF0aW9uLmFkZChzZWNvbmRzLCBcInNlY29uZHNcIik7XG4gICAgcmV0dXJuIGRhdGVTZWxlY3RlZC5hZGQoZHVyYXRpb24pO1xuICB9XG5cbiAgZ2V0VmlkZW9VcmwgPSAodXJsOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIHJldHVybiB1cmw7XG4gICAgLy8gPyB0aGlzLnByb3BzLnN0b3JlLlNFUlZFUl9VUkwgK1xuICAgIC8vICAgICAodXJsLmluZGV4T2YoXCIvdXBsb2FkXCIpICE9IC0xID8gdXJsIDogXCIvdXBsb2FkP2ZpbGVuYW1lPVwiICsgdXJsKVxuICAgIC8vIDogdGhpcy5wcm9wcy5zdG9yZS5zZXR0aW5ncy5kZWZhdWx0VmlkZW87XG4gIH07XG5cbiAgX2Rvd25sb2FkVXBkYXRlVmlkZW8gPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJfZG93bmxvYWRWaWRlbyAuLi4gc3RhcnRcIik7XG4gICAgdmFyIHZpZGVvVXJsID0gdGhpcy5nZXRWaWRlb1VybCh0aGlzLnN0YXRlLm5leHR2aWRlbyk7XG4gICAgdmFyIHZpZGVvU3RhdGVVcmwgPSAodGhpcy5zdGF0ZS52aWRlbyAmJiB0aGlzLnN0YXRlLnZpZGVvLnVyaSkgfHwgbnVsbDtcbiAgICBjb25zb2xlLmxvZyhcIl9kb3dubG9hZFZpZGVvXCIsIHsgdmlkZW9VcmwgfSk7XG4gICAgY29uc29sZS5sb2coXCJfZG93bmxvYWRWaWRlb1wiLCB2aWRlb1VybCwgeyB2aWRlb1N0YXRlVXJsIH0pO1xuXG4gICAgaWYgKHZpZGVvVXJsID09IG51bGwgfHwgdmlkZW9VcmwubGVuZ3RoID09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhcIl9kb3dubG9hZFZpZGVvXCIsIHZpZGVvVXJsLCB7IHZpZGVvU3RhdGVVcmwgfSk7XG4gICAgLy8gaWYgKCF0aGlzLnN0YXRlLnZpZGVvdXJsIHx8IHZpZGVvVXJsICE9IHZpZGVvU3RhdGVVcmwpIHtcbiAgICBjb25zdCB2aWRlb0Fzc2V0ID0gbmV3IEFzc2V0KHtcbiAgICAgIG5hbWU6IHZpZGVvVXJsICYmIHZpZGVvVXJsLnJlcGxhY2UoLyg/IVxcLlteLl0rJClcXC58W15cXHcuXSsvZywgXCJcIikucmVwbGFjZShcIi5tcDRcIiwgXCJcIiksXG4gICAgICB0eXBlOiBcIm1wNFwiLFxuICAgICAgLy8gcGF0aCB0byB0aGUgZmlsZSBzb21ld2hlcmUgb24gdGhlIGludGVybmV0XG4gICAgICB1cmk6IHZpZGVvVXJsLFxuICAgICAgaGFzaDogdmlkZW9VcmwgJiYgdmlkZW9VcmwucmVwbGFjZShcIi5cIiwgXCJfXCIpXG4gICAgfSBhcyBhbnkpO1xuXG4gICAgdGhpcy5zZXRTdGF0ZShcbiAgICAgIHtcbiAgICAgICAgdmlkZW86IHZpZGVvQXNzZXQsXG4gICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSgpLFxuICAgICAgICB2aWRlb3VybDogdGhpcy5zdGF0ZS5uZXh0dmlkZW9cbiAgICAgICAgLy8gc2Nyb2xsaW5nX3RleHQ6IHRoaXMuc3RhdGUubmV4dHRleHRcbiAgICAgIH0sXG4gICAgICAoKSA9PiB7XG4gICAgICAgIC8vT25seSBzdGFydCBmcm9tIHplcm8gaWYgd2UgaGF2ZSBhIG5ldyB2aWRlbyBmb3IgdGhpcyBzbG90LCBvdGhlcndpc2UsIHBsYXkgYXdheS5cbiAgICAgICAgLy8gKHRoaXMucmVmc1tcInZpZGVvXCJdIGFzIGFueSkubG9hZCgpO1xuICAgICAgICAvLyAodGhpcy5yZWZzW1widmlkZW9cIl0gYXMgYW55KS5wbGF5KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwidGhpcy5zdGF0ZS5uZXh0dmlkZW9cIiwgdGhpcy5zdGF0ZS5uZXh0dmlkZW8pO1xuICAgICAgfVxuICAgICk7XG5cbiAgICB0cnkge1xuICAgICAgLy9BcyB0aGUgZmlsZSBpcyByZW1vdGUsIHdlIGNhbid0IGNhbGN1bGF0ZSBpdHMgaGFzaCBiZWZvcmVoYW5kXG4gICAgICAvL3NvIHdlIGRvd25sb2FkIGl0IHdpdGhvdXQgaGFzaFxuICAgICAgLy9kb3dubG9hZEFzeW5jV2l0aG91dEhhc2ggaW4gZW5oYW5jZWRBc3NldC5qc1xuICAgICAgLyoqXG4gICAgICAgKiBAdHlwZSB7Qm9vbGVhbn0gY2FjaGVcbiAgICAgICAqICAgICAgICAgICAgICAgICAgICB0cnVlOiBkb3dubG9hZHMgYXNzZXQgdG8gYXBwIGNhY2hlXG4gICAgICAgKiAgICAgICAgICAgICAgICAgICAgZmFsc2U6IGRvd25sb2FkcyBhc3NldCB0byBhcHAgZGF0YVxuICAgICAgICovXG4gICAgICBhd2FpdCB2aWRlb0Fzc2V0LmRvd25sb2FkQXN5bmNXaXRob3V0SGFzaCh7IGNhY2hlOiB0cnVlIH0pO1xuICAgICAgY29uc29sZS5sb2coXCJ2aWRlb0Fzc2V0IGRvd25sb2FkZWRcIiwgdmlkZW9Bc3NldCk7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgdmlkZW86IHZpZGVvQXNzZXQgfSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICBcIlRoZXJlIHdhcyBhbiBlcnJvciBjYWNoaW5nIGFzc2V0cyAoc2VlOiBtYWluLmpzKSwgcGVyaGFwcyBkdWUgdG8gYSBcIiArIFwibmV0d29yayB0aW1lb3V0LCBzbyB3ZSBza2lwcGVkIGNhY2hpbmcuIFJlbG9hZCB0aGUgYXBwIHRvIHRyeSBhZ2Fpbi5cIlxuICAgICAgKTtcbiAgICAgIGNvbnNvbGUubG9nKGUubWVzc2FnZSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBhcHBJc1JlYWR5OiB0cnVlIH0pO1xuICAgIH1cbiAgICAvLyB9XG4gIH07XG5cbiAgYXN5bmMgbG9hZFNsb3QoZGF0ZSwgaG91ciwgbWluLCBzZWNvbmRzKSB7XG4gICAgdmFyIHRpbWVTbG90ID0gbW9tZW50KHRoaXMuZ2V0VGltZVNsb3QoZGF0ZSwgaG91ciwgbWluLCBzZWNvbmRzKSk7XG4gICAgLy8gbW9tZW50KHJlcS5xdWVyeS50aW1lKVxuICAgIHRyeSB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcInRpbWVTbG90XCIsIHRpbWVTbG90KTtcbiAgICAgIHZhciBzbG90ID0gdGltZVNsb3QudG9EYXRlKCkuZ2V0VGltZSgpO1xuXG4gICAgICBjb25zb2xlLmxvZyhcInRpbWVTbG90XCIsIHNsb3QpO1xuICAgICAgdmFyIHZpZGVvID0gbnVsbDtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIEZpbmRpbmcgYWxsIHZpZGVvIHRoYXQgZml0c1xuICAgICAgICB2YXIgdmlkZW9zID0gYXdhaXQgdGhpcy5wcm9wcy5zdG9yZS5kYi5maW5kQXN5bmMoe1xuICAgICAgICAgIHRpbWVzdGFtcDogc2xvdFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBkb2NzIGlzIGFuIGFycmF5IGNvbnRhaW5pbmcgZG9jdW1lbnRzIE1hcnMsIEVhcnRoLCBKdXBpdGVyXG4gICAgICAgIC8vIElmIG5vIGRvY3VtZW50IGlzIGZvdW5kLCBkb2NzIGlzIGVxdWFsIHRvIFtdXG4gICAgICAgIHZpZGVvID0gdmlkZW9zWzBdO1xuICAgICAgICBjb25zb2xlLmxvZyhcImRiIFNsb3RzXCIsIHsgdmlkZW8sIHZpZGVvcyB9KTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3BhcnNlZCB2aWRlbycsIHZpZGVvKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkRCIEVycm9yXCIsIGUpO1xuICAgICAgfVxuICAgICAgaWYgKHZpZGVvKSB7XG4gICAgICAgIHZhciBuZXdQbGF5bGlzdCA9IFt0aGlzLnN0YXRlLnZpZGVvdXJsXTsgLy90aGlzLnN0YXRlLnBsYXlsaXN0O1xuICAgICAgICBuZXdQbGF5bGlzdC5wdXNoKHZpZGVvLnZpZGVvKTtcbiAgICAgICAgLy9jYWxsIHRoZSBkb3dubG9hZFZpZGVvIGZ1bmN0aW9uXG5cbiAgICAgICAgLy8gdGhpcy5zZXRTdGF0ZSh7IHN0YXJ0OiBuZXcgRGF0ZSgpLCB0aXRsZTogdmlkZW8udGl0bGUsIHNjcm9sbGluZ1RleHQ6IHZpZGVvLnNjcm9sbGluZ190ZXh0LCB2aWRlb3VybDogdmlkZW8udmlkZW8sIHBsYXlsaXN0OiBuZXdQbGF5bGlzdCwgY3VycmVudFZpZGVvOiB2aWRlby52aWRlbyB9KTtcbiAgICAgICAgLy8gdGhpcy5yZWZzLnZpZGVvLmxvYWQoKTtcbiAgICAgICAgLy8gdGhpcy5yZWZzLnZpZGVvLnBsYXkoKTtcblxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBuZXh0dmlkZW86IHZpZGVvLnZpZGVvLFxuICAgICAgICAgIG5leHR0ZXh0OiB2aWRlby5zY3JvbGxpbmdfdGV4dFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5sb2coXCJuZXh0dmlkXCIsIHRoaXMuc3RhdGUubmV4dHZpZGVvKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwibW92ZSBhbG9uZyBub3RoaW5nIHRvIHNlZSBoZXJlLi4uXCIpO1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS52aWRlb3VybCAhPSB0aGlzLnByb3BzLnN0b3JlLnNldHRpbmdzLmRlZmF1bHRWaWRlbykge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHZpZGVvdXJsOiB0aGlzLnByb3BzLnN0b3JlLnNldHRpbmdzLmRlZmF1bHRWaWRlbyxcbiAgICAgICAgICAgICAgbmV4dHZpZGVvOiB0aGlzLnByb3BzLnN0b3JlLnNldHRpbmdzLmRlZmF1bHRWaWRlbyxcbiAgICAgICAgICAgICAgc2V0dGluZ3M6IHRoaXMucHJvcHMuc3RvcmUuc2V0dGluZ3MsXG4gICAgICAgICAgICAgIHNjcm9sbGluZ190ZXh0OiBcIldlbGNvbWUgdG8gUFNpZ24uLi5cIlxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLl9kb3dubG9hZFVwZGF0ZVZpZGVvKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gdmFyIHJlc3VsdCA9IGF3YWl0IGRiLnF1ZXJ5KGZ1bmN0aW9uIChkb2MsIGVtaXQpIHtcbiAgICAgIC8vICAgZW1pdChkb2Muc2Nyb2xsaW5nX3RleHQpO1xuICAgICAgLy8gfSwge2tleTogXCJXb3JrIHdvcmsgd29yayB3b3JrXCJ9KTtcbiAgICAgIC8vIFwic2Nyb2xsaW5nX3RleHRcIjpcIldvcmsgd29yayB3b3JrIHdvcmtcIlxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLmluaXRQbGF5ZXIoKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV3UHJvcHMpIHt9XG5cbiAgYXN5bmMgb25UaGVoYWxmTWluRnVuYygpIHtcbiAgICB2YXIgdGltZSA9IG5ldyBEYXRlKCkudG9UaW1lU3RyaW5nKCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRUaW1lOiB0aW1lIH0pO1xuICAgIGNvbnNvbGUubG9nKFwidGltZXIgaGFsZm1pblwiLCB0aW1lKTtcblxuICAgIHZhciBsYXN0VmlkZW8gPSB0aGlzLnN0YXRlLnZpZGVvdXJsOyAvL3ZpZGVvdXJsXG5cbiAgICBjb25zb2xlLmxvZyh7IGxhc3RWaWRlbywgbmV4dHZpZDogdGhpcy5zdGF0ZS5uZXh0dmlkZW8gfSk7XG4gICAgaWYgKHRoaXMuc3RhdGUubmV4dHZpZGVvICE9PSB1bmRlZmluZWQgJiYgbGFzdFZpZGVvICE9IHRoaXMuc3RhdGUubmV4dHZpZGVvKSB7XG4gICAgICAvLyBGZWVkLmxvYWQoXCJodHRwczovL2NvZGVrLnR2L2ZlZWQvXCIsIChlcnIsIHJzcyk9PiB7XG4gICAgICAvLyAgIGNvbnNvbGUubG9nKHJzcyk7XG4gICAgICAvLyB9KTtcblxuICAgICAgYXdhaXQgdGhpcy5fZG93bmxvYWRVcGRhdGVWaWRlbygpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBjb25zb2xlLmxvZyhcInRha2luZyBzbmFwc2hvdFwiKTtcbiAgICAgIGlmICh0aGlzLmNhbWVyYSkge1xuICAgICAgICB2YXIgc25hcCA9IGF3YWl0IHRoaXMuY2FtZXJhLnRha2VQaWN0dXJlQXN5bmMoe1xuICAgICAgICAgIHF1YWxpdHk6IDAuMixcbiAgICAgICAgICBiYXNlNjQ6IHRydWUsXG4gICAgICAgICAgZXhpZjogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIGFsZXJ0KFwid2UgaGF2ZSBhIHNuYXA6IFwiICsgc25hcC5sZW5ndGgpXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHNuYXApO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInNhdmVkIHNuYXBzaG90Li4uXCIsICBzbmFwLmJhc2U2NCApO1xuICAgICAgICAvLyB2YXIgZmlsZSA9IGF3YWl0IEV4cG8uRmlsZVN5c3RlbS5yZWFkRmlsZShzbmFwLnVyaSwgXCJiYXNlNjRcIik7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZmlsZVwiLCBmaWxlKTtcbiAgICAgICAgaWYgKHNuYXApIHRoaXMucHJvcHMuc3RvcmUubGF0ZXN0U25hcHNob3QgPSBzbmFwLmJhc2U2NDtcbiAgICAgIH1cbiAgICAgIC8vIHZhciB1cmkgPSBhd2FpdCB0YWtlU25hcHNob3QoXCJ3aW5kb3dcIix7XG4gICAgICAvLyAgIGZvcm1hdDpcInBuZ1wiLFxuICAgICAgLy8gICBxdWFsaXR5OiAwLjBcbiAgICAgIC8vIH0pXG4gICAgICAvLyAvLyAvLyAgICAgICB2YXIgc25hcFNob3QgPSBhd2FpdCBFeHBvLnRha2VTbmFwc2hvdEFzeW5jKHRoaXMuX3ZpZXdlciwge1xuICAgICAgLy8gLy8gLy8gICBmb3JtYXQ6IFwicG5nXCIsXG4gICAgICAvLyAvLyAvLyAgIHJlc3VsdDogXCJiYXNlNjRcIixcbiAgICAgIC8vIC8vIC8vICAgcXVhbGl0eTogMS4wXG4gICAgICAvLyAvLyAvLyB9KTtcbiAgICAgIC8vIC8vIC8vICBhd2FpdFxuICAgICAgLy8gLy8gLy8gICBcInZpZXdTaG90XCIsXG4gICAgICAvLyAvLyAvLyAgIHtcbiAgICAgIC8vIC8vIC8vICAgICBmb3JtYXQ6IFwianBnXCIsXG4gICAgICAvLyAvLyAvLyAgICAgcmVzdWx0OiBcImJhc2U2NFwiXG4gICAgICAvLyAvLyAvLyAgIH1cbiAgICAgIC8vIC8vIC8vICk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcInNhdmVkIHNuYXBzaG90Li4uXCIsIHsgdXJpIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiQW4gRXJyb3Igb2NjdXJlZCBzYXZpbmcgc25hcHNob3RcIiwgeyBlIH0pO1xuICAgIH1cbiAgICB0aGlzLnRpY2soKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIC8vIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBpbW1lZGlhdGVseSBiZWZvcmUgdGhlIGNvbXBvbmVudCBpcyByZW1vdmVkXG4gICAgLy8gZnJvbSB0aGUgcGFnZSBhbmQgZGVzdHJveWVkLiBXZSBjYW4gY2xlYXIgdGhlIGludGVydmFsIGhlcmU6XG5cbiAgICBjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5yc3NUaW1lcik7XG4gIH1cblxuICB0aWNrKCkge1xuICAgIHZhciB0aWNrRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgdmFyIG90aGVyRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgLy8gVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgZXZlcnkgMXMuIEl0IHVwZGF0ZXMgdGhlXG4gICAgLy8gZWxhcHNlZCBjb3VudGVyLiBDYWxsaW5nIHNldFN0YXRlIGNhdXNlcyB0aGUgY29tcG9uZW50IHRvIGJlIHJlLXJlbmRlcmVkXG5cbiAgICAvLyB0aGlzLnNldFN0YXRlKHsgZWxhcHNlZDogbmV3IERhdGUoKSAtIHRoaXMuc3RhdGUuc3RhcnQgfSk7XG4gICAgLy8gdmFyIGVsYXBzZWQgPSBNYXRoLnJvdW5kKHRoaXMuc3RhdGUuZWxhcHNlZCAvIDEwMCk7XG5cbiAgICAvLyAvLyBUaGlzIHdpbGwgZ2l2ZSBhIG51bWJlciB3aXRoIG9uZSBkaWdpdCBhZnRlciB0aGUgZGVjaW1hbCBkb3QgKHh4LngpOlxuICAgIC8vIHZhciBzZWNvbmRzID0gKGVsYXBzZWQgLyAxMCkudG9GaXhlZCgxKTtcbiAgICAvLyBpZiAoc2Vjb25kcyA9PSAyNSkge1xuICAgIC8vbG9hZCBuZXh0IHZpZGVvXG4gICAgY29uc29sZS5sb2coXCJsb2FkaW5nIG5leHQgdmlkZW9zIC4uLiBAXCIgKyB0aWNrRGF0ZS50b1RpbWVTdHJpbmcoKSk7XG4gICAgdmFyIGRhdGUgPSB0aWNrRGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgICAvLyBjb25zb2xlLmxvZ1xuICAgIC8vIH1cbiAgICAvLyBodHRwOi8vdGVjaHNsaWRlcy5jb20vZGVtb3Mvc2FtcGxlLXZpZFxuICAgIHRoaXMubG9hZFNsb3QobW9tZW50KGRhdGUpLCBvdGhlckRhdGUuZ2V0SG91cnMoKSwgb3RoZXJEYXRlLmdldE1pbnV0ZXMoKSwgKE1hdGguZmxvb3Iob3RoZXJEYXRlLmdldFNlY29uZHMoKSAvIDMwKSArIDEpICogMzApOyAvL1RvZG8gZml4IHRoaXMgZG9udCBrbm93IHdoeSBwcmV2aWV3IHN0b3JlcyB0aW1lIHdyb25nXG4gIH1cblxuICBnZXRCYW5uZXJVcmwgPSAoKSA9PiB7XG4gICAgdmFyIGJhbm5lclVybCA9IHRoaXMucHJvcHMuc3RvcmUuc2V0dGluZ3MuZGVmYXVsdEJhbm5lcjtcbiAgICByZXR1cm4gYmFubmVyVXJsO1xuICB9O1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxWaWV3XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgZmxleDogMSxcbiAgICAgICAgICB3aWR0aDogXCIxMDAlXCIsXG4gICAgICAgICAgaGVpZ2h0OiBcIjEwMCVcIixcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwid2hpdGVcIlxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8Vmlld2VyXG4gICAgICAgICAgcmVmPXt2aWV3ID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3ZpZXdlciA9IHZpZXc7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBSU1M9e3RoaXMuUlNTfVxuICAgICAgICAgIGJhbm5lclVybD17dGhpcy5nZXRCYW5uZXJVcmwoKX1cbiAgICAgICAgICB2aWRlb1Zpc2libGU9e3RoaXMuc3RhdGUudmlkZW8gJiYgdGhpcy5zdGF0ZS52aWRlby5sb2NhbFVyaX1cbiAgICAgICAgICB2aWRlb1VybD17dGhpcy5zdGF0ZS52aWRlbyA/IHRoaXMuc3RhdGUudmlkZW8ubG9jYWxVcmkgOiB0aGlzLnByb3BzLnN0b3JlLnNldHRpbmdzLmRlZmF1bHRWaWRlb31cbiAgICAgICAgLz5cbiAgICAgICAgey8qIDxDYW1lcmFcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIixcbiAgICAgICAgICAgIG92ZXJmbG93OiBcImhpZGRlblwiLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcInJnYmEoMCwwLDAsMC4xKVwiLFxuICAgICAgICAgICAgaGVpZ2h0OiA1MCxcbiAgICAgICAgICAgIHdpZHRoOiA1MFxuICAgICAgICAgIH19XG4gICAgICAgICAgcmVmPXtyZWYgPT4ge1xuICAgICAgICAgICAgdGhpcy5jYW1lcmEgPSByZWY7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBmbGFzaE1vZGU9e0NhbWVyYS5Db25zdGFudHMuRmxhc2hNb2RlLm9mZn1cbiAgICAgICAgICB0eXBlPXtDYW1lcmEuQ29uc3RhbnRzLlR5cGUuZnJvbnR9XG4gICAgICAgICAgYXV0b0ZvY3VzPXtDYW1lcmEuQ29uc3RhbnRzLkF1dG9Gb2N1cy5vZmZ9XG4gICAgICAgIC8+ICovfVxuICAgICAgPC9WaWV3PlxuICAgICk7XG4gIH1cbn1cblxuY2xhc3MgVmlld2VyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PHsgUlNTOyBiYW5uZXJVcmw7IHZpZGVvVmlzaWJsZTsgdmlkZW9VcmwgfSwgYW55PiB7XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGJhbm5lclVybCwgUlNTLCB2aWRlb1Zpc2libGUsIHZpZGVvVXJsIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnNvbGUubG9nKHt3aWR0aCxoZWlnaHR9KVxuICAgIHJldHVybiAoXG4gICAgICA8VmlldyBzdHlsZT17c3R5bGVzLmNvbnRhaW5lcn0+XG4gICAgICAgIDxWaWV3IHN0eWxlPXt7ICBoZWlnaHQ6MTA0IH19PlxuICAgICAgICAgIDxJbWFnZVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IFwiMTAwJVwiLFxuICAgICAgICAgICAgICB3aWR0aDogaGVpZ2h0ID4gd2lkdGggPyBoZWlnaHQgOiB3aWR0aCxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcIndoaXRlXCJcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICByZXNpemVNb2RlPVwiY29udGFpblwiXG4gICAgICAgICAgICBzb3VyY2U9e2Jhbm5lclVybCA/IHsgdXJpOiBiYW5uZXJVcmwgfSA6IG51bGx9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9WaWV3PlxuICAgICAgICA8Vmlld1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBmbGV4OiAxLjgsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiYmxhY2tcIixcbiAgICAgICAgICAgIHdpZHRoOiBcIjEwMCVcIixcbiAgICAgICAgICAgIGhlaWdodDogXCIxMDAlXCJcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAge3ZpZGVvVmlzaWJsZSA/IChcbiAgICAgICAgICAgIDxWaWRlb1xuICAgICAgICAgICAgICBzb3VyY2U9e3sgdXJpOiB2aWRlb1VybCB9IGFzIGFueX1cbiAgICAgICAgICAgICAgc3JjPXt2aWRlb1VybH1cbiAgICAgICAgICAgICAgLy8gc3JjPVwiaHR0cDovL3YueW9haS5jb20vZmVtbWVfdGFtcG9uX3R1dG9yaWFsLm1wNFwiXG4gICAgICAgICAgICAgIHN0eWxlPXtzdHlsZXMuYmFja2dyb3VuZFZpZGVvfVxuICAgICAgICAgICAgICBvbkxvYWQ9e3BhcmFtcyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocGFyYW1zKTtcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgb25FcnJvcj17ZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIC8vIHBvc3Rlcj17XCJodHRwOi8vc3RhdGljLnlvYWljZG4uY29tL3Nob3BwYy9pbWFnZXMvY292ZXJfaW1nX2UxZTllNmIuanBnXCJ9XG4gICAgICAgICAgICAgIGNvbnRyb2xzPXtmYWxzZX1cbiAgICAgICAgICAgICAgc2hvdWxkUGxheVxuICAgICAgICAgICAgICBhdXRvcGxheT17dHJ1ZX1cbiAgICAgICAgICAgICAgaXNMb29waW5nXG4gICAgICAgICAgICAgIGxvb3A9e3RydWV9XG4gICAgICAgICAgICAgIHJlc2l6ZU1vZGU9XCJzdHJldGNoXCJcbiAgICAgICAgICAgICAgbXV0ZWQ9e2ZhbHNlfVxuICAgICAgICAgICAgICB2b2x1bWU9ezEuMH1cbiAgICAgICAgICAgICAgcmF0ZT17MS4wfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPFZpZXdcbiAgICAgICAgICAgICAgc3R5bGU9e1tcbiAgICAgICAgICAgICAgICBzdHlsZXMuYmFja2dyb3VuZFZpZGVvLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGFsaWduQ29udGVudDogXCJjZW50ZXJcIixcbiAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxuICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPEltYWdlIHNvdXJjZT17cmVxdWlyZShcIi4uLy4uL2Fzc2V0cy9hamF4LWxvYWRlci5naWZcIil9IC8+XG4gICAgICAgICAgICAgIDxUZXh0IHN0eWxlPXt7IGNvbG9yOiBcIndoaXRlXCIgfX0+VXBkYXRpbmcgQ29udGVudCAuLi4gPC9UZXh0PlxuICAgICAgICAgICAgPC9WaWV3PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvVmlldz5cbiAgICAgICAgey8qIDxWaWV3IHN0eWxlPXt7IGZsZXg6IDAuMiB9fT5cbiAgICAgICAgICA8TWFycXVlZUxhYmVsXG4gICAgICAgICAgICBzdHlsZT17c3R5bGVzLm1hcnF1ZWVMYWJlbH1cbiAgICAgICAgICAgIHRleHQ9e1JTU31cbiAgICAgICAgICAgIHRleHRTaXplPXs0MH1cbiAgICAgICAgICAgIG1hcnF1ZWVUeXBlPVwiTUxDb250aW51b3VzXCJcbiAgICAgICAgICAgIHNjcm9sbER1cmF0aW9uPXszLjB9XG4gICAgICAgICAgICBmYWRlTGVuZ3RoPXswLjB9XG4gICAgICAgICAgICBsZWFkaW5nQnVmZmVyPXswLjB9XG4gICAgICAgICAgICB0cmFpbGluZ0J1ZmZlcj17NTAwfVxuICAgICAgICAgICAgdGV4dENvbG9yPVwicmVkXCJcbiAgICAgICAgICAgIGZvbnQ9e3sgZm9udFNpemU6IDYwLCBmb250V2VpZ2h0OiAwLjQgfX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1ZpZXc+ICovfVxuICAgICAgPC9WaWV3PlxuICAgICk7XG4gIH1cbn1cblxuLy8gPE1hcnF1ZWVUZXh0XG4vLyBzdHlsZT17eyBmb250U2l6ZTogMjQsIGZsZXg6MX19XG4vLyBkdXJhdGlvbj17MzAwMH1cbi8vIG1hcnF1ZWVPblN0YXJ0XG4vLyB1c2VOYXRpdmVEcml2ZXI9e3RydWV9XG4vLyBsb29wXG4vLyBtYXJxdWVlRGVsYXk9ezEwMDB9XG4vLyBtYXJxdWVlUmVzZXREZWxheT17MzAwMDB9XG4vLyA+XG4vLyBMb3JlbSBJcHN1bSBpcyBzaW1wbHkgZHVtbXkgdGV4dCBvZiB0aGUgcHJpbnRpbmcgYW5kIHR5cGVzZXR0aW5nIGluZHVzdHJ5IGFuZCB0eXBlc2V0dGluZyBpbmR1c3RyeS5cbi8vIDwvTWFycXVlZVRleHQ+XG5cbi8vIDxXZWJWaWV3XG4vLyBzb3VyY2U9e3sgaHRtbDogUlNTU291cmNlIH19XG4vLyBzdHlsZT17eyB3aWR0aDogd2lkdGgsIGhlaWdodDogMCB9fVxuLy8gYXV0b21hdGljYWxseUFkanVzdENvbnRlbnRJbnNldHM9e2ZhbHNlfVxuLy8gamF2YVNjcmlwdEVuYWJsZWQ9e3RydWV9XG4vLyBkb21TdG9yYWdlRW5hYmxlZD17dHJ1ZX1cbi8vIGRlY2VsZXJhdGlvblJhdGU9XCJub3JtYWxcIlxuLy8gc3RhcnRJbkxvYWRpbmdTdGF0ZT17dHJ1ZX1cbi8vIHNjYWxlc1BhZ2VUb0ZpdD17dGhpcy5zdGF0ZS5zY2FsZXNQYWdlVG9GaXR9XG4vLyAvPlxuXG4vLyA8VmlldyBzdHlsZT17eyBib3R0b206IDAsIHJpZ2h0OiAwLCBmbGV4OiA1IH19PlxuLy8gPFRleHQgc3R5bGU9e3sgY29sb3I6IFwicmVkXCIgfX0+XG4vLyAgIHt0aGlzLnN0YXRlLnN5bmNNZXNzYWdlfVxuLy8gICB7IXRoaXMuc3RhdGUubmV4dHZpZGVvID8gXCJcIiA6IFwiXCJ9e1wiIFwifVxuLy8gPC9UZXh0PlxuLy8gPC9WaWV3PlxuLy8gPFZpZXcgc3R5bGU9e3sgYm90dG9tOiAwLCByaWdodDogMCwgZmxleDogMS4zIH19PlxuLy8gPFdlYlZpZXdcbi8vICAgc291cmNlPXt7IGh0bWw6IFJTU1NvdXJjZSB9fVxuLy8gICBzdHlsZT17eyB3aWR0aDogd2lkdGgsIGhlaWdodDogMCB9fVxuLy8gICBhdXRvbWF0aWNhbGx5QWRqdXN0Q29udGVudEluc2V0cz17ZmFsc2V9XG4vLyAgIGphdmFTY3JpcHRFbmFibGVkPXt0cnVlfVxuLy8gICBkb21TdG9yYWdlRW5hYmxlZD17dHJ1ZX1cbi8vICAgZGVjZWxlcmF0aW9uUmF0ZT1cIm5vcm1hbFwiXG4vLyAgIHN0YXJ0SW5Mb2FkaW5nU3RhdGU9e3RydWV9XG4vLyAgIHNjYWxlc1BhZ2VUb0ZpdD17dGhpcy5zdGF0ZS5zY2FsZXNQYWdlVG9GaXR9XG4vLyAvPlxuLy8gPC9WaWV3PlxuXG4vLyA8Q2FjaGluZ1ZpZGVvUGxheWVyXG4vLyBkZWZhdWx0VmlkZW89e3RoaXMucHJvcHMuc3RvcmUuc2V0dGluZ3MuZGVmYXVsdFZpZGVvfVxuLy8gdXJsPXt2aWRlb1VybH1cbi8vIHJhdGU9ezEuMH0gLy8gMCBpcyBwYXVzZWQsIDEgaXMgbm9ybWFsLlxuLy8gdm9sdW1lPXsxLjB9IC8vIDAgaXMgbXV0ZWQsIDEgaXMgbm9ybWFsLlxuLy8gbXV0ZWQ9e2ZhbHNlfSAvLyBNdXRlcyB0aGUgYXVkaW8gZW50aXJlbHkuXG4vLyBwYXVzZWQ9e2ZhbHNlfSAvLyBQYXVzZXMgcGxheWJhY2sgZW50aXJlbHkuXG4vLyByZXNpemVNb2RlPVwiY292ZXJcIiAvLyBGaWxsIHRoZSB3aG9sZSBzY3JlZW4gYXQgYXNwZWN0IHJhdGlvLlxuLy8gcmVwZWF0PXt0cnVlfSAvLyBSZXBlYXQgZm9yZXZlci5cbi8vIHN0eWxlPXtzdHlsZXMuYmFja2dyb3VuZFZpZGVvfVxuLy8gLz5cblxuLy8gPE1hcnF1ZWVMYWJlbCBzdHlsZT17IHN0eWxlcy5tYXJxdWVlTGFiZWwgfSB0ZXh0ID0geyB0aGlzLnN0YXRlLnNjcm9sbGluZ190ZXh0IH1cbi8vICAgICAgICAgICAgICAgICAgICAgdGV4dFNpemUgPSB7IDQwfVxuLy8gICAgICAgICAgICAgICAgICAgICBtYXJxdWVlVHlwZSA9IFwiTUxDb250aW51b3VzXCJcbi8vICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsRHVyYXRpb24gPSB7IDMuMH1cbi8vICAgICAgICAgICAgICAgICAgICAgZmFkZUxlbmd0aCA9IHsgMC4wfVxuLy8gICAgICAgICAgICAgICAgICAgICBsZWFkaW5nQnVmZmVyID0geyAwLjB9XG4vLyAgICAgICAgICAgICAgICAgICAgIHRyYWlsaW5nQnVmZmVyID0geyA1MH1cbi8vICAgICAgICAgICAgICAgICAgICAgdGV4dENvbG9yID0gJ3JlZCdcbi8vICAgICAgICAgICAgICAgICAgICAgZm9udCA9IHt7IGZvbnRTaXplOiA2MCwgZm9udFdlaWdodDogMC40IH19Lz5cbi8qXG4gICAgPFZpZGVvIHNvdXJjZT17IHsgdXJpOiB2aWRlb1VybCB9IH0gLy8gQ2FuIGJlIGEgVVJMIG9yIGEgbG9jYWwgZmlsZS5cbiAgICAgICAgICAgICAgICByYXRlID0gezEuMH0gICAgICAgICAgICAgICAgICAgLy8gMCBpcyBwYXVzZWQsIDEgaXMgbm9ybWFsLlxuICAgICAgICAgICAgICAgIHZvbHVtZSA9IHsxLjB9ICAgICAgICAgICAgICAgICAvLyAwIGlzIG11dGVkLCAxIGlzIG5vcm1hbC5cbiAgICAgICAgICAgICAgICBtdXRlZCA9IHtmYWxzZX0gICAgICAgICAgICAgICAgLy8gTXV0ZXMgdGhlIGF1ZGlvIGVudGlyZWx5LlxuICAgICAgICAgICAgICAgIHBhdXNlZCA9IHtmYWxzZX0gICAgICAgICAgICAgICAvLyBQYXVzZXMgcGxheWJhY2sgZW50aXJlbHkuXG4gICAgICAgICAgICAgICAgcmVzaXplTW9kZSA9IFwiY292ZXJcIiAgICAgICAgICAgLy8gRmlsbCB0aGUgd2hvbGUgc2NyZWVuIGF0IGFzcGVjdCByYXRpby5cbiAgICAgICAgICAgICAgICByZXBlYXQgPSB7dHJ1ZX0gICAgICAgICAgICAgICAgLy8gUmVwZWF0IGZvcmV2ZXIuXG4gICAgICAgICAgICAgICAgc3R5bGUgPSB7c3R5bGVzLmJhY2tncm91bmRWaWRlbyB9PjwvVmlkZW8+XG4gICAgICAgICAgICA8SW1hZ2Ugc3R5bGU9eyB7IHRvcDogMCwgbGVmdDogMCwgaGVpZ2h0OiA1MCwgd2lkdGg6IDEwMCwgYmFja2dyb3VuZENvbG9yOiBcInllbGxvd1wiIH0gfSByZXNpemVNb2RlID0gXCJzdHJldGNoXCIgc291cmNlPSB7eyB1cmk6IGJhbm5lclVybCB9fT48L0ltYWdlPlxuICAgICAgICAgICAgPFZpZXcgc3R5bGU9IHt7IGJvdHRvbTogMCwgcmlnaHQ6IDAsIGZsZXg6IDUgfX0+XG4gICAgICAgICAgICAgICAgPFRleHQgc3R5bGU9eyB7IGNvbG9yOiBcInJlZFwiIH0gfT57IHRoaXMuc3RhdGUuc3luY01lc3NhZ2UgfXshdGhpcy5zdGF0ZS5uZXh0dmlkZW8gPyBcIlwiIDogXCJcIiB9IDwvVGV4dD5cbiAgICAgICAgICAgIDwvVmlldz5cbiAgICAgICAgICAgIDxWaWV3IHN0eWxlPXsgeyBib3R0b206IDAsIHJpZ2h0OiAwLCBmbGV4OiAxIH0gfT5cbiAgICAgICAgICAgICAgICA8TWFycXVlZUxhYmVsIHN0eWxlPXsgc3R5bGVzLm1hcnF1ZWVMYWJlbCB9IHRleHQgPSB7IHRoaXMuc3RhdGUuc2Nyb2xsaW5nX3RleHQgfVxuICAgICAgICAgICAgICAgICAgICB0ZXh0U2l6ZSA9IHsgNDB9XG4gICAgICAgICAgICAgICAgICAgIG1hcnF1ZWVUeXBlID0gXCJNTENvbnRpbnVvdXNcIlxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxEdXJhdGlvbiA9IHsgMy4wfVxuICAgICAgICAgICAgICAgICAgICBmYWRlTGVuZ3RoID0geyAwLjB9XG4gICAgICAgICAgICAgICAgICAgIGxlYWRpbmdCdWZmZXIgPSB7IDAuMH1cbiAgICAgICAgICAgICAgICAgICAgdHJhaWxpbmdCdWZmZXIgPSB7IDUwfVxuICAgICAgICAgICAgICAgICAgICB0ZXh0Q29sb3IgPSAncmVkJ1xuICAgICAgICAgICAgICAgICAgICBmb250ID0ge3sgZm9udFNpemU6IDYwLCBmb250V2VpZ2h0OiAwLjQgfX0vPlxuICAgICAgICAgICAgPC9WaWV3PlxuKi9cblxuY29uc3Qgc3R5bGVzID0gU3R5bGVTaGVldC5jcmVhdGUoe1xuICBtYXJxdWVlTGFiZWw6IHtcbiAgICBmbGV4OiAxXG4gIH0sXG4gIGJhY2tncm91bmRWaWRlbzoge1xuICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG4gICAgdG9wOiAwLFxuICAgIGxlZnQ6IDAsXG4gICAgYm90dG9tOiAwLFxuICAgIHJpZ2h0OiAwLFxuICAgIGZsZXg6IDEsXG4gICAgLy8gaGVpZ2h0OjkwMCxcbiAgICB3aWR0aDogXCIxMDAlXCJcbiAgfSxcbiAgY29udGFpbmVyOiB7XG4gICAgZmxleDogMSxcbiAgICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcbiAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxuICAgIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsXG4gICAgYmFja2dyb3VuZENvbG9yOiBcIndoaXRlXCIsXG4gICAgd2lkdGg6IFwiMTAwJVwiXG4gIH0sXG4gIHdlbGNvbWU6IHtcbiAgICBmb250U2l6ZTogMjAsXG4gICAgdGV4dEFsaWduOiBcImNlbnRlclwiLFxuICAgIG1hcmdpbjogMTBcbiAgfSxcbiAgaW5zdHJ1Y3Rpb25zOiB7XG4gICAgdGV4dEFsaWduOiBcImNlbnRlclwiLFxuICAgIGNvbG9yOiBcIiMzMzMzMzNcIixcbiAgICBtYXJnaW5Cb3R0b206IDVcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllcjtcbiJdfQ==