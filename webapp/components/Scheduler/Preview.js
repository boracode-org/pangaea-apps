"use strict";
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
const moment = require("moment");
const react_native_web_1 = require("react-native-web");
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
const react_player_1 = require("react-player");
require("whatwg-fetch");
const Gallery_1 = require("./Gallery");
const Database_1 = require("../Database");
var DropzoneComponent = require("react-dropzone-component");
var ReactDOMServer = require("react-dom/server");
var Modal = require("react-modal");
var Parse = require("parse");
// Parse.initialize("ABCDEFG12345");
// Parse.serverURL = "http://psign.iriosystems.com:1380/parse";
class Preview extends React.Component {
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
    getSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var setting = yield Database_1.Database.getSettings();
                var videourl = setting.defaultVideo.url; //Constants.SERVER_URL + "/upload?filename=" + setting.get("defaultVideo");
                this.setState({
                    settings: {
                        defaultVideo: setting.defaultVideo,
                        defaultBanner: setting.defaultBanner
                    },
                    videourl,
                    bannerurl: setting.defaultBanner.url,
                    playlist: [videourl],
                    playing: true
                }, () => {
                    // console.log("default:" +  this.state.videourl);
                    //   this.refs.video.load();
                    //   this.refs.video.pause();
                    //   this.refs.video.play();
                });
            }
            catch (e) {
                alert("Failed to load settings..." + e.message);
            }
        });
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
        this.setState({
            start: new Date(),
            videourl: videourl,
            playlist: newPlaylist,
            isDefaultVideo: false,
            settings: this.state.settings,
            currentVideo: videourl,
            file
        }, () => {
            // this.refs.video.load();
            // this.refs.video.pause();
            // this.refs.video.play();
            console.log("videourl: ", this.state.videourl);
        });
        // this.refs.video.stop();
    }
    closeModal() {
        this.setState({ galleryOpen: false });
    }
    openModal() {
        this.setState({ galleryOpen: true });
    }
    getTimeSlot() {
        var dateSelected = moment(this.props.dateSelected.format && this.props.dateSelected.format() || this.props.dateSelected);
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
    loadSlot() {
        return __awaiter(this, void 0, void 0, function* () {
            var timeSlotT = this.getTimeSlot();
            console.log("timeSlot", { timeSlotT });
            try {
                var timeSlot = yield Database_1.Database.loadSlot(timeSlotT.toDate(), this.props.selectedGroup);
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
                    file: timeSlot.video //{ duration: timeSlot.duration }
                });
                console.log(this.state.videourl);
            }
            catch (e) {
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
        });
    }
    saveEvent() {
        return __awaiter(this, void 0, void 0, function* () {
            var timeSlot = this.getTimeSlot();
            console.log("timeSlot", moment(timeSlot));
            var file = this.state.file;
            console.log("saveEvent", { file: file });
            if (file) {
                try {
                    yield Database_1.Database.saveSlot(file, timeSlot, this.state.title, this.state.scrolling_text, this.props.selectedGroup);
                    this.props.parent.closeModal(); // We done
                }
                catch (e) {
                    alert("Failed to save slot: " + e.message);
                }
            }
        });
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
        this.setState({ elapsed: new Date() - this.state.start });
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
        return (React.createElement(react_native_web_1.View, null,
            React.createElement("h1", null,
                "Settings for ",
                this.state.title,
                " Ad at ",
                this.props.hourSelected,
                ":",
                this.props.timeSelected[0],
                "-",
                " ",
                this.props.hourSelected,
                ": ",
                this.props.timeSelected[1],
                " on"),
            React.createElement("h3", { style: { color: "red" } }, "Preview"),
            React.createElement("center", null,
                React.createElement(react_native_web_1.View, { id: "calendar", align: "center", style: {
                        width: 640,
                        height: 400,
                        position: "relative",
                        backgroundColor: "lightgray",
                        lignContent: "center",
                        flex: 1
                    } },
                    React.createElement("img", { style: {
                            color: "yellow",
                            backgroundColor: "black",
                            fontSize: 30,
                            position: "absolute",
                            top: 0,
                            right: 0,
                            height: 80,
                            width: "100%"
                        }, src: this.state.bannerurl }),
                    React.createElement(react_player_1.default, { style: { width: "100%", height: 400 }, autoPlay: true, loop: true, ref: "video", playing: true, playsinline: true, poster: "https://camo.githubusercontent.com/e87d73e52109c623ea0e315993ab8b5f037fb00f/687474703a2f2f6d6465727269636b2e6769746875622e696f2f72656163742d68746d6c35766964656f2f6578616d706c652e706e673f763d31", url: this.state.videourl }),
                    React.createElement("marquee", { style: {
                            color: "yellow",
                            backgroundColor: "black",
                            fontSize: 30,
                            position: "absolute",
                            bottom: 0,
                            right: 80
                        }, behavior: "scroll", direction: "left" }, this.state.scrollingText),
                    React.createElement("div", { style: {
                            color: "red",
                            backgroundColor: "teal",
                            fontSize: 30,
                            position: "absolute",
                            paddingRight: 8,
                            paddingLeft: 8,
                            bottom: 0,
                            right: 0
                        } },
                        " ",
                        now))),
            React.createElement("h3", null,
                "Preview video started ",
                React.createElement("b", null,
                    seconds,
                    "seconds"),
                " ago."),
            React.createElement("p", null,
                React.createElement("b", null, "Title")),
            React.createElement("textarea", { onChange: this.handleTitleChange, value: this.state.title, ref: "title", rows: 1, style: { width: "100%" } }),
            React.createElement("p", null,
                React.createElement("b", null,
                    "Video (Current:",
                    this.state.isDefaultVideo ? "Default" : this.state.videourl,
                    ")",
                    " ")),
            React.createElement(react_native_web_1.View, { style: { flex: 1, flexDirection: "row" } },
                React.createElement("b", { style: { margin: 5 } },
                    React.createElement(react_native_web_1.Button, { title: "Pick An Ad from Gallery", onPress: this.openModal })),
                React.createElement("b", { style: { margin: 5, width: 100 } },
                    React.createElement(react_native_web_1.Button, { title: "Save", color: "darkgreen", onPress: this.saveEvent })),
                React.createElement("b", { style: { margin: 5, width: 100 } },
                    React.createElement(react_native_web_1.Button, { title: "Cancel", onPress: this.props.parent.closeModal }))),
            React.createElement(Modal, { style: modalStyle, isOpen: this.state.galleryOpen, onRequestClose: this.closeModal },
                React.createElement(Gallery_1.default, { onSelect: this.select, closeModal: this.closeModal }))));
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
exports.default = Preview;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJldmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlByZXZpZXcudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSwrQkFBK0I7QUFFL0IsaUNBQWlDO0FBRWpDLHVEQUFzRDtBQUN0RCxXQUFXO0FBRVgseUJBQXlCO0FBQ3pCLFNBQVM7QUFDVCxjQUFjO0FBQ2QsVUFBVTtBQUNWLFVBQVU7QUFDVixVQUFVO0FBQ1YsZ0JBQWdCO0FBQ2hCLFVBQVU7QUFDVixZQUFZO0FBQ1osNkJBQTZCO0FBRTdCLDJEQUEyRDtBQUMzRCx5REFBeUQ7QUFDekQsK0NBQWtDO0FBRWxDLHdCQUFzQjtBQUV0Qix1Q0FBZ0M7QUFDaEMsMENBQXVDO0FBRXZDLElBQUksaUJBQWlCLEdBQUcsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDNUQsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDakQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBRW5DLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QixvQ0FBb0M7QUFDcEMsK0RBQStEO0FBRS9ELGFBQWMsU0FBUSxLQUFLLENBQUMsU0FBa0I7SUFFNUMsWUFBWSxLQUFLO1FBQ2YsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRWIsSUFBSSxDQUFDLEtBQUssR0FBRztZQUNYLGFBQWEsRUFBRSx3Q0FBd0M7WUFDdkQsT0FBTyxFQUFFLENBQUM7WUFDVixLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNqQiwyQ0FBMkM7WUFDM0MsNkNBQTZDO1lBQzdDLGFBQWEsRUFBRSxDQUFDO1lBQ2hCLEtBQUssRUFBRSxFQUFFO1lBQ1QsV0FBVyxFQUFFLEtBQUs7WUFDbEIsY0FBYyxFQUFFLElBQUk7U0FDckIsQ0FBQztRQUVGLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUs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ZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0ICogYXMgbW9tZW50IGZyb20gXCJtb21lbnRcIjtcbmltcG9ydCB7IENhbGVuZGFyLCBDYWxlbmRhckNvbnRyb2xzIH0gZnJvbSBcIi4vQ2FsZW5kYXJcIjtcbmltcG9ydCB7IFRleHQsIEJ1dHRvbiwgVmlldyB9IGZyb20gXCJyZWFjdC1uYXRpdmUtd2ViXCI7XG4vLyBpbXBvcnQge1xuXG4vLyAvLyAgIGRlZmF1bHQgYXMgVmlkZW8sXG4vLyBWaWRlbyxcbi8vICAgQ29udHJvbHMsXG4vLyAgIFBsYXksXG4vLyAgIE11dGUsXG4vLyAgIFNlZWssXG4vLyAgIEZ1bGxzY3JlZW4sXG4vLyAgIFRpbWUsXG4vLyAgIE92ZXJsYXlcbi8vIH0gZnJvbSBcInJlYWN0LWh0bWw1dmlkZW9cIjtcblxuLy8gaW1wb3J0IFwidmlkZW8tcmVhY3QvZGlzdC92aWRlby1yZWFjdC5jc3NcIjsgLy8gaW1wb3J0IGNzc1xuLy8gaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcInZpZGVvLXJlYWN0L2Rpc3QvdmlkZW8tcmVhY3RcIjtcbmltcG9ydCBQbGF5ZXIgZnJvbSBcInJlYWN0LXBsYXllclwiO1xuXG5pbXBvcnQgXCJ3aGF0d2ctZmV0Y2hcIjtcbmltcG9ydCBDb25zdGFudHMgZnJvbSBcIi4uL0NvbnN0YW50c1wiO1xuaW1wb3J0IEdhbGxlcnkgZnJvbSBcIi4vR2FsbGVyeVwiO1xuaW1wb3J0IHsgRGF0YWJhc2UgfSBmcm9tIFwiLi4vRGF0YWJhc2VcIjtcblxudmFyIERyb3B6b25lQ29tcG9uZW50ID0gcmVxdWlyZShcInJlYWN0LWRyb3B6b25lLWNvbXBvbmVudFwiKTtcbnZhciBSZWFjdERPTVNlcnZlciA9IHJlcXVpcmUoXCJyZWFjdC1kb20vc2VydmVyXCIpO1xudmFyIE1vZGFsID0gcmVxdWlyZShcInJlYWN0LW1vZGFsXCIpO1xuXG52YXIgUGFyc2UgPSByZXF1aXJlKFwicGFyc2VcIik7XG4vLyBQYXJzZS5pbml0aWFsaXplKFwiQUJDREVGRzEyMzQ1XCIpO1xuLy8gUGFyc2Uuc2VydmVyVVJMID0gXCJodHRwOi8vcHNpZ24uaXJpb3N5c3RlbXMuY29tOjEzODAvcGFyc2VcIjtcblxuY2xhc3MgUHJldmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksYW55PiB7XG4gIHRpbWVyOiBhbnk7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHNjcm9sbGluZ1RleHQ6IFwiRW50ZXIgc29tZSB0ZXh0IGJlbG93IHRvIHNlZSBpdCBzY3JvbGxcIixcbiAgICAgIGVsYXBzZWQ6IDAsXG4gICAgICBzdGFydDogRGF0ZS5ub3coKSxcbiAgICAgIC8vIHZpZGVvdXJsOiBcIi91cGxvYWQ/ZmlsZW5hbWU9c2lnbmFsLm1wNFwiLFxuICAgICAgLy8gcGxheWxpc3Q6IFtcIi91cGxvYWQ/ZmlsZW5hbWU9c2lnbmFsLm1wNFwiXSxcbiAgICAgIHBsYXlsaXN0SW5kZXg6IDAsXG4gICAgICB0aXRsZTogXCJcIixcbiAgICAgIGdhbGxlcnlPcGVuOiBmYWxzZSxcbiAgICAgIGlzRGVmYXVsdFZpZGVvOiB0cnVlXG4gICAgfTtcblxuICAgIHRoaXMuY2xvc2VNb2RhbCA9IHRoaXMuY2xvc2VNb2RhbC5iaW5kKHRoaXMpO1xuICAgIHRoaXMub3Blbk1vZGFsID0gdGhpcy5vcGVuTW9kYWwuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVUaXRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlVGl0bGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLnRpY2sgPSB0aGlzLnRpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLnNhdmVFdmVudCA9IHRoaXMuc2F2ZUV2ZW50LmJpbmQodGhpcyk7XG4gICAgdGhpcy5nZXRUaW1lU2xvdCA9IHRoaXMuZ2V0VGltZVNsb3QuYmluZCh0aGlzKTtcbiAgICB0aGlzLmxvYWRTbG90ID0gdGhpcy5sb2FkU2xvdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2VsZWN0ID0gdGhpcy5zZWxlY3QuYmluZCh0aGlzKTtcbiAgICB0aGlzLmdldFNldHRpbmdzID0gdGhpcy5nZXRTZXR0aW5ncy5iaW5kKHRoaXMpO1xuICB9XG5cbiAgYXN5bmMgZ2V0U2V0dGluZ3MoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciBzZXR0aW5nID0gYXdhaXQgRGF0YWJhc2UuZ2V0U2V0dGluZ3MoKTtcbiAgICAgIHZhciB2aWRlb3VybCA9IHNldHRpbmcuZGVmYXVsdFZpZGVvLnVybDsgLy9Db25zdGFudHMuU0VSVkVSX1VSTCArIFwiL3VwbG9hZD9maWxlbmFtZT1cIiArIHNldHRpbmcuZ2V0KFwiZGVmYXVsdFZpZGVvXCIpO1xuICAgICAgdGhpcy5zZXRTdGF0ZShcbiAgICAgICAge1xuICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICBkZWZhdWx0VmlkZW86IHNldHRpbmcuZGVmYXVsdFZpZGVvLFxuICAgICAgICAgICAgZGVmYXVsdEJhbm5lcjogc2V0dGluZy5kZWZhdWx0QmFubmVyXG4gICAgICAgICAgfSxcbiAgICAgICAgICB2aWRlb3VybCxcbiAgICAgICAgICBiYW5uZXJ1cmw6IHNldHRpbmcuZGVmYXVsdEJhbm5lci51cmwsXG4gICAgICAgICAgcGxheWxpc3Q6IFt2aWRlb3VybF0sXG4gICAgICAgICAgcGxheWluZzogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coXCJkZWZhdWx0OlwiICsgIHRoaXMuc3RhdGUudmlkZW91cmwpO1xuICAgICAgICAgIC8vICAgdGhpcy5yZWZzLnZpZGVvLmxvYWQoKTtcbiAgICAgICAgICAvLyAgIHRoaXMucmVmcy52aWRlby5wYXVzZSgpO1xuICAgICAgICAgIC8vICAgdGhpcy5yZWZzLnZpZGVvLnBsYXkoKTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBhbGVydChcIkZhaWxlZCB0byBsb2FkIHNldHRpbmdzLi4uXCIgKyBlLm1lc3NhZ2UpO1xuICAgIH1cbiAgfVxuXG4gIHNlbGVjdChmaWxlKSB7XG4gICAgY29uc29sZS5sb2coXCJzZWxlY3RlZDogXCIsIGZpbGUpO1xuICAgIHRoaXMuY2xvc2VNb2RhbCgpO1xuICAgIC8vIHZhciB1cGxvYWRmaWxlbmFtZSA9IGZpbGUuZmlsZS51cmw7IC8vIEpTT04ucGFyc2UoZmlsZS54aHIucmVzcG9uc2UpLm5hbWU7XG4gICAgLy8gLy8gY29uc29sZS5sb2coJ0Ryb3B6b25lQ29tcG9uZW50IGNvbXBsZXRlJywgdXBsb2FkZmlsZW5hbWUpO1xuICAgIC8vIHZhciBuZXdQbGF5bGlzdCA9IHRoaXMuc3RhdGUucGxheWxpc3Q7XG4gICAgdmFyIHZpZGVvdXJsID0gZmlsZS5maWxlLnVybDsgLy9Db25zdGFudHMuU0VSVkVSX1VSTCArIFwiL3VwbG9hZD9maWxlbmFtZT1cIiArIHVwbG9hZGZpbGVuYW1lO1xuXG4gICAgLy8gbmV3UGxheWxpc3QgPSBbdmlkZW91cmxdO1xuICAgIC8vIC8vIHRoaXMuc2V0U3RhdGUoeyBwbGF5bGlzdDogbmV3UGxheWxpc3QgfSk7XG4gICAgLy8gdGhpcy5zZXRTdGF0ZSh7IHN0YXJ0OiBuZXcgRGF0ZSgpLCB2aWRlb3VybDogdmlkZW91cmwsIHBsYXlsaXN0OiBuZXdQbGF5bGlzdCwgY3VycmVudFZpZGVvOiB2aWRlb3VybCB9KTtcbiAgICAvLyB0aGlzLnJlZnMudmlkZW8ubG9hZCgpO1xuICAgIC8vIHRoaXMucmVmcy52aWRlby5wbGF5KCk7XG4gICAgdmFyIG5ld1BsYXlsaXN0ID0gW3ZpZGVvdXJsXTtcbiAgICB0aGlzLnNldFN0YXRlKFxuICAgICAge1xuICAgICAgICBzdGFydDogbmV3IERhdGUoKSxcbiAgICAgICAgdmlkZW91cmw6IHZpZGVvdXJsLFxuICAgICAgICBwbGF5bGlzdDogbmV3UGxheWxpc3QsXG4gICAgICAgIGlzRGVmYXVsdFZpZGVvOiBmYWxzZSxcbiAgICAgICAgc2V0dGluZ3M6IHRoaXMuc3RhdGUuc2V0dGluZ3MsXG4gICAgICAgIGN1cnJlbnRWaWRlbzogdmlkZW91cmwsXG4gICAgICAgIGZpbGVcbiAgICAgIH0sXG4gICAgICAoKSA9PiB7XG4gICAgICAgIC8vIHRoaXMucmVmcy52aWRlby5sb2FkKCk7XG4gICAgICAgIC8vIHRoaXMucmVmcy52aWRlby5wYXVzZSgpO1xuICAgICAgICAvLyB0aGlzLnJlZnMudmlkZW8ucGxheSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcInZpZGVvdXJsOiBcIiwgdGhpcy5zdGF0ZS52aWRlb3VybCk7XG4gICAgICB9XG4gICAgKTtcbiAgICAvLyB0aGlzLnJlZnMudmlkZW8uc3RvcCgpO1xuICB9XG5cbiAgY2xvc2VNb2RhbCgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgZ2FsbGVyeU9wZW46IGZhbHNlIH0pO1xuICB9XG5cbiAgb3Blbk1vZGFsKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBnYWxsZXJ5T3BlbjogdHJ1ZSB9KTtcbiAgfVxuXG4gIGdldFRpbWVTbG90KCkge1xuICAgIHZhciBkYXRlU2VsZWN0ZWQgPSBtb21lbnQodGhpcy5wcm9wcy5kYXRlU2VsZWN0ZWQuZm9ybWF0ICYmICB0aGlzLnByb3BzLmRhdGVTZWxlY3RlZC5mb3JtYXQoKSB8fCB0aGlzLnByb3BzLmRhdGVTZWxlY3RlZCk7XG4gICAgdmFyIGR1cmF0aW9uID0gbW9tZW50LmR1cmF0aW9uKCk7XG4gICAgdmFyIG1pbiA9IHRoaXMucHJvcHMudGltZVNlbGVjdGVkWzBdLnNwbGl0KFwiOlwiKVswXTtcbiAgICB2YXIgc2Vjb25kcyA9IHRoaXMucHJvcHMudGltZVNlbGVjdGVkWzBdLnNwbGl0KFwiOlwiKVsxXTtcbiAgICBjb25zb2xlLmxvZyhcImhvdXJzXCIsIHRoaXMucHJvcHMuaG91clNlbGVjdGVkKTtcbiAgICBjb25zb2xlLmxvZyhcIm1pbnV0ZXNcIiwgbWluKTtcbiAgICBjb25zb2xlLmxvZyhcInNlY29uZHNcIiwgc2Vjb25kcyk7XG4gICAgZHVyYXRpb24uYWRkKHsgaG91cnM6IHRoaXMucHJvcHMuaG91clNlbGVjdGVkIH0pO1xuICAgIGR1cmF0aW9uLmFkZCh7IG1pbnV0ZXM6IG1pbiB9KTtcbiAgICBkdXJhdGlvbi5hZGQoeyBzZWNvbmRzOiBzZWNvbmRzIH0pO1xuICAgIHJldHVybiBkYXRlU2VsZWN0ZWQuYWRkKGR1cmF0aW9uKTtcbiAgfVxuXG4gIGFzeW5jIGxvYWRTbG90KCkge1xuICAgIHZhciB0aW1lU2xvdFQgPSB0aGlzLmdldFRpbWVTbG90KCk7XG5cbiAgICBjb25zb2xlLmxvZyhcInRpbWVTbG90XCIsIHsgdGltZVNsb3RUIH0pO1xuXG4gICAgdHJ5IHtcbiAgICAgIHZhciB0aW1lU2xvdCA9IGF3YWl0IERhdGFiYXNlLmxvYWRTbG90KHRpbWVTbG90VC50b0RhdGUoKSwgdGhpcy5wcm9wcy5zZWxlY3RlZEdyb3VwKTtcbiAgICAgIGlmICghdGltZVNsb3QpIHtcbiAgICAgICAgYWxlcnQoXCJObyBUaW1lc2xvdCFcIik7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFNldHRpbmdzKCk7XG4gICAgICB9XG4gICAgICBjb25zb2xlLmxvZyhcImdvdCBtZWRpYVwiLCB0aW1lU2xvdCk7XG4gICAgICB2YXIgbmV3UGxheWxpc3QgPSBbdGltZVNsb3QudmlkZW9dO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSgpLFxuICAgICAgICB0aXRsZTogdGltZVNsb3QudGl0bGUsXG4gICAgICAgIHNjcm9sbGluZ1RleHQ6IHRpbWVTbG90LnNjcm9sbGluZ190ZXh0LFxuICAgICAgICBzZXR0aW5nczogdGhpcy5zdGF0ZS5zZXR0aW5ncyxcbiAgICAgICAgaXNEZWZhdWx0VmlkZW86IGZhbHNlLFxuICAgICAgICB2aWRlb3VybDogdGltZVNsb3QudmlkZW8uZmlsZS51cmwsXG4gICAgICAgIHBsYXlsaXN0OiBuZXdQbGF5bGlzdCxcbiAgICAgICAgY3VycmVudFZpZGVvOiB0aW1lU2xvdC52aWRlbyxcbiAgICAgICAgZmlsZTogdGltZVNsb3QudmlkZW8vL3sgZHVyYXRpb246IHRpbWVTbG90LmR1cmF0aW9uIH1cbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS52aWRlb3VybCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0U2V0dGluZ3MoKTtcbiAgICB9XG5cbiAgICAvLyBmZXRjaChDb25zdGFudHMuU0VSVkVSX1VSTCArIFwiL2xvYWRTbG90P3RpbWU9XCIgKyB0aW1lU2xvdC5mb3JtYXQoKSlcbiAgICAvLyAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAvLyAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICAvLyAgIH0pXG4gICAgLy8gICAudGhlbih2aWRlbyA9PiB7XG5cbiAgICAvLyAgIH0pXG4gICAgLy8gICAuY2F0Y2goZXggPT4ge1xuICAgIC8vICAgICAvLyBjb25zb2xlLmxvZygncGFyc2luZyBmYWlsZWQnLCBleClcbiAgICAvLyAgICAgdGhpcy5nZXRTZXR0aW5ncygpO1xuICAgIC8vICAgfSk7XG4gIH1cblxuICBhc3luYyBzYXZlRXZlbnQoKSB7XG4gICAgdmFyIHRpbWVTbG90ID0gdGhpcy5nZXRUaW1lU2xvdCgpO1xuICAgIGNvbnNvbGUubG9nKFwidGltZVNsb3RcIiwgbW9tZW50KHRpbWVTbG90KSk7XG4gICAgdmFyIGZpbGUgPSB0aGlzLnN0YXRlLmZpbGU7XG4gICAgY29uc29sZS5sb2coXCJzYXZlRXZlbnRcIiwgeyBmaWxlOiBmaWxlIH0pO1xuICAgIGlmIChmaWxlKSB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBEYXRhYmFzZS5zYXZlU2xvdChcbiAgICAgICAgICBmaWxlLFxuICAgICAgICAgIHRpbWVTbG90LFxuICAgICAgICAgIHRoaXMuc3RhdGUudGl0bGUsXG4gICAgICAgICAgdGhpcy5zdGF0ZS5zY3JvbGxpbmdfdGV4dCxcbiAgICAgICAgICB0aGlzLnByb3BzLnNlbGVjdGVkR3JvdXBcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5wcm9wcy5wYXJlbnQuY2xvc2VNb2RhbCgpOyAvLyBXZSBkb25lXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGFsZXJ0KFwiRmFpbGVkIHRvIHNhdmUgc2xvdDogXCIgKyBlLm1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUNoYW5nZShldmVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzY3JvbGxpbmdUZXh0OiBldmVudC50YXJnZXQudmFsdWUgfSk7XG4gIH1cblxuICBoYW5kbGVUaXRsZUNoYW5nZShldmVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyB0aXRsZTogZXZlbnQudGFyZ2V0LnZhbHVlIH0pO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgLy8gY29tcG9uZW50RGlkTW91bnQgaXMgY2FsbGVkIGJ5IHJlYWN0IHdoZW4gdGhlIGNvbXBvbmVudFxuICAgIC8vIGhhcyBiZWVuIHJlbmRlcmVkIG9uIHRoZSBwYWdlLiBXZSBjYW4gc2V0IHRoZSBpbnRlcnZhbCBoZXJlOlxuICAgIHRoaXMubG9hZFNsb3QoKTtcbiAgICB0aGlzLnRpbWVyID0gc2V0SW50ZXJ2YWwodGhpcy50aWNrLCAxMDAwKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIC8vIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBpbW1lZGlhdGVseSBiZWZvcmUgdGhlIGNvbXBvbmVudCBpcyByZW1vdmVkXG4gICAgLy8gZnJvbSB0aGUgcGFnZSBhbmQgZGVzdHJveWVkLiBXZSBjYW4gY2xlYXIgdGhlIGludGVydmFsIGhlcmU6XG5cbiAgICBjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xuICB9XG5cbiAgdGljaygpIHtcbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBldmVyeSA1MCBtcy4gSXQgdXBkYXRlcyB0aGVcbiAgICAvLyBlbGFwc2VkIGNvdW50ZXIuIENhbGxpbmcgc2V0U3RhdGUgY2F1c2VzIHRoZSBjb21wb25lbnQgdG8gYmUgcmUtcmVuZGVyZWRcblxuICAgIHRoaXMuc2V0U3RhdGUoeyBlbGFwc2VkOiBuZXcgRGF0ZSgpIGFzIGFueSAtIHRoaXMuc3RhdGUuc3RhcnQgfSk7XG4gICAgdmFyIGVsYXBzZWQgPSBNYXRoLnJvdW5kKHRoaXMuc3RhdGUuZWxhcHNlZCAvIDEwMCk7XG5cbiAgICAvLyBUaGlzIHdpbGwgZ2l2ZSBhIG51bWJlciB3aXRoIG9uZSBkaWdpdCBhZnRlciB0aGUgZGVjaW1hbCBkb3QgKHh4LngpOlxuICAgIHZhciBzZWNvbmRzID0gKGVsYXBzZWQgLyAxMCkudG9GaXhlZCgxKTtcbiAgICAvLyBodHRwOi8vdGVjaHNsaWRlcy5jb20vZGVtb3Mvc2FtcGxlLXZpZFxuICAgIC8vIGlmIChzZWNvbmRzID49IDMwKSB7XG4gICAgLy8gICAgIC8vIGVvcy9zbWFsbC5tcDRcbiAgICAvLyAgICAgLy9odHRwOi8vbWVkaWEudzMub3JnLzIwMTAvMDUvdmlkZW8vbW92aWVfMzAwLm1wNFxuXG4gICAgLy8gICAgIHRoaXMuc2V0U3RhdGUoeyBzdGFydDogbmV3IERhdGUoKSwgdmlkZW91cmw6IHRoaXMuc3RhdGUucGxheWxpc3RbKHRoaXMuc3RhdGUucGxheWxpc3RJbmRleCsrKSAlIHRoaXMuc3RhdGUucGxheWxpc3QubGVuZ3RoXSB9KTtcbiAgICAvLyAgICAgdGhpcy5yZWZzLnZpZGVvLmxvYWQoKTtcbiAgICAvLyAgICAgdGhpcy5yZWZzLnZpZGVvLnBsYXkoKTtcbiAgICAvLyB9XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIHZhciBlbGFwc2VkID0gTWF0aC5yb3VuZCh0aGlzLnN0YXRlLmVsYXBzZWQgLyAxMDApO1xuXG4gICAgLy8gVGhpcyB3aWxsIGdpdmUgYSBudW1iZXIgd2l0aCBvbmUgZGlnaXQgYWZ0ZXIgdGhlIGRlY2ltYWwgZG90ICh4eC54KTpcbiAgICB2YXIgc2Vjb25kcyA9IChlbGFwc2VkIC8gMTApLnRvRml4ZWQoMSk7XG4gICAgdmFyIG5vdyA9IG1vbWVudCgpLmZvcm1hdChcIkhIOm1tIEFcIik7XG4gICAgLy8gY29uc29sZS5sb2cobm93KTtcblxuICAgIHJldHVybiAoXG4gICAgICA8Vmlldz5cbiAgICAgICAgPGgxPlxuICAgICAgICAgIFNldHRpbmdzIGZvciB7dGhpcy5zdGF0ZS50aXRsZX0gQWQgYXQge3RoaXMucHJvcHMuaG91clNlbGVjdGVkfTp7dGhpcy5wcm9wcy50aW1lU2VsZWN0ZWRbMF19LXtcIiBcIn1cbiAgICAgICAgICB7dGhpcy5wcm9wcy5ob3VyU2VsZWN0ZWR9OiB7dGhpcy5wcm9wcy50aW1lU2VsZWN0ZWRbMV19IG9uXG4gICAgICAgIDwvaDE+XG4gICAgICAgIDxoMyBzdHlsZT17eyBjb2xvcjogXCJyZWRcIiB9fT5QcmV2aWV3PC9oMz5cbiAgICAgICAgPGNlbnRlcj5cbiAgICAgICAgICA8Vmlld1xuICAgICAgICAgICAgaWQ9XCJjYWxlbmRhclwiXG4gICAgICAgICAgICBhbGlnbj1cImNlbnRlclwiXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICB3aWR0aDogNjQwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IDQwMCxcbiAgICAgICAgICAgICAgcG9zaXRpb246IFwicmVsYXRpdmVcIixcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcImxpZ2h0Z3JheVwiLFxuICAgICAgICAgICAgICBsaWduQ29udGVudDogXCJjZW50ZXJcIixcbiAgICAgICAgICAgICAgZmxleDogMVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8aW1nXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgY29sb3I6IFwieWVsbG93XCIsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcImJsYWNrXCIsXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IDMwLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogODAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IFwiMTAwJVwiXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIHNyYz17dGhpcy5zdGF0ZS5iYW5uZXJ1cmx9XG4gICAgICAgICAgICAvPlxuXG4gICAgICAgICAgICA8UGxheWVyXG4gICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiBcIjEwMCVcIiwgaGVpZ2h0OiA0MDAgfX1cbiAgICAgICAgICAgICAgYXV0b1BsYXlcbiAgICAgICAgICAgICAgbG9vcFxuICAgICAgICAgICAgICByZWY9XCJ2aWRlb1wiXG4gICAgICAgICAgICAgIHBsYXlpbmdcbiAgICAgICAgICAgICAgcGxheXNpbmxpbmVcbiAgICAgICAgICAgICAgcG9zdGVyPVwiaHR0cHM6Ly9jYW1vLmdpdGh1YnVzZXJjb250ZW50LmNvbS9lODdkNzNlNTIxMDljNjIzZWEwZTMxNTk5M2FiOGI1ZjAzN2ZiMDBmLzY4NzQ3NDcwM2EyZjJmNmQ2NDY1NzI3MjY5NjM2YjJlNjc2OTc0Njg3NTYyMmU2OTZmMmY3MjY1NjE2Mzc0MmQ2ODc0NmQ2YzM1NzY2OTY0NjU2ZjJmNjU3ODYxNmQ3MDZjNjUyZTcwNmU2NzNmNzYzZDMxXCJcbiAgICAgICAgICAgICAgdXJsPXt0aGlzLnN0YXRlLnZpZGVvdXJsfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxtYXJxdWVlXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgY29sb3I6IFwieWVsbG93XCIsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcImJsYWNrXCIsXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IDMwLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG4gICAgICAgICAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICAgICAgICAgIHJpZ2h0OiA4MFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICBiZWhhdmlvcj1cInNjcm9sbFwiXG4gICAgICAgICAgICAgIGRpcmVjdGlvbj1cImxlZnRcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5zY3JvbGxpbmdUZXh0fVxuICAgICAgICAgICAgPC9tYXJxdWVlPlxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGNvbG9yOiBcInJlZFwiLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogXCJ0ZWFsXCIsXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IDMwLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG4gICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiA4LFxuICAgICAgICAgICAgICAgIHBhZGRpbmdMZWZ0OiA4LFxuICAgICAgICAgICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgICAgICAgICByaWdodDogMFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7XCIgXCJ9XG4gICAgICAgICAgICAgIHtub3d9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L1ZpZXc+XG4gICAgICAgIDwvY2VudGVyPlxuICAgICAgICA8aDM+XG4gICAgICAgICAgUHJldmlldyB2aWRlbyBzdGFydGVkIDxiPntzZWNvbmRzfXNlY29uZHM8L2I+IGFnby5cbiAgICAgICAgPC9oMz5cblxuICAgICAgICA8cD5cbiAgICAgICAgICA8Yj5UaXRsZTwvYj5cbiAgICAgICAgPC9wPlxuICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVUaXRsZUNoYW5nZX1cbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS50aXRsZX1cbiAgICAgICAgICByZWY9XCJ0aXRsZVwiXG4gICAgICAgICAgcm93cz17MX1cbiAgICAgICAgICBzdHlsZT17eyB3aWR0aDogXCIxMDAlXCIgfX1cbiAgICAgICAgLz5cblxuICAgICAgICB7Lyo8cD5cbiAgICAgICAgICA8Yj5TY3JvbGxpbmcgVGV4dDwvYj5cbiAgICAgICAgPC9wPlxuICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICByZWY9XCJzY3JvbGxpbmdUZXh0XCJcbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5zY3JvbGxpbmdUZXh0fVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgICByb3dzPVwiM1wiXG4gICAgICAgICAgc3R5bGU9e3sgd2lkdGg6IFwiMTAwJVwiIH19XG4gICAgICAgIC8+Ki99XG4gICAgICAgIDxwPlxuICAgICAgICAgIDxiPlxuICAgICAgICAgICAgVmlkZW8gKEN1cnJlbnQ6XG4gICAgICAgICAgICB7dGhpcy5zdGF0ZS5pc0RlZmF1bHRWaWRlbyA/IFwiRGVmYXVsdFwiIDogdGhpcy5zdGF0ZS52aWRlb3VybH0pe1wiIFwifVxuICAgICAgICAgIDwvYj5cbiAgICAgICAgPC9wPlxuICAgICAgICA8VmlldyBzdHlsZT17eyBmbGV4OiAxLCBmbGV4RGlyZWN0aW9uOiBcInJvd1wiIH19PlxuICAgICAgICAgIDxiIHN0eWxlPXt7IG1hcmdpbjogNSB9fT5cbiAgICAgICAgICAgIDxCdXR0b24gdGl0bGU9XCJQaWNrIEFuIEFkIGZyb20gR2FsbGVyeVwiIG9uUHJlc3M9e3RoaXMub3Blbk1vZGFsfSAvPlxuICAgICAgICAgIDwvYj5cblxuICAgICAgICAgIDxiIHN0eWxlPXt7IG1hcmdpbjogNSwgd2lkdGg6IDEwMCB9fT5cbiAgICAgICAgICAgIDxCdXR0b24gdGl0bGU9XCJTYXZlXCIgY29sb3I9XCJkYXJrZ3JlZW5cIiBvblByZXNzPXt0aGlzLnNhdmVFdmVudH0gLz5cbiAgICAgICAgICA8L2I+XG4gICAgICAgICAgPGIgc3R5bGU9e3sgbWFyZ2luOiA1LCB3aWR0aDogMTAwIH19PlxuICAgICAgICAgICAgPEJ1dHRvbiB0aXRsZT1cIkNhbmNlbFwiIG9uUHJlc3M9e3RoaXMucHJvcHMucGFyZW50LmNsb3NlTW9kYWx9IC8+XG4gICAgICAgICAgPC9iPlxuICAgICAgICA8L1ZpZXc+XG4gICAgICAgIDxNb2RhbFxuICAgICAgICAgIHN0eWxlPXttb2RhbFN0eWxlfVxuICAgICAgICAgIGlzT3Blbj17dGhpcy5zdGF0ZS5nYWxsZXJ5T3Blbn1cbiAgICAgICAgICBvblJlcXVlc3RDbG9zZT17dGhpcy5jbG9zZU1vZGFsfVxuICAgICAgICA+XG4gICAgICAgICAgPEdhbGxlcnkgb25TZWxlY3Q9e3RoaXMuc2VsZWN0fSBjbG9zZU1vZGFsPXt0aGlzLmNsb3NlTW9kYWx9IC8+XG4gICAgICAgIDwvTW9kYWw+XG4gICAgICA8L1ZpZXc+XG4gICAgKTtcbiAgfVxufVxuLy8gIGV2ZW50SGFuZGxlcnM9e2V2ZW50SGFuZGxlcnN9XG4vL2Rqc0NvbmZpZz17ZGpzQ29uZmlnfVxuXG52YXIgbW9kYWxTdHlsZSA9IHtcbiAgb3ZlcmxheToge1xuICAgIC8vIHpJbmRleDogLTEsXG4gICAgcG9zaXRpb246IFwiZml4ZWRcIixcbiAgICB0b3A6IDAsXG4gICAgbGVmdDogMCxcbiAgICByaWdodDogMCxcbiAgICBib3R0b206IDAsXG4gICAgYmFja2dyb3VuZENvbG9yOiBcInJnYmEoMTUsIDE1LCAxNSwgMSlcIlxuICB9LFxuICBjb250ZW50OiB7XG4gICAgLy8gekluZGV4OiAtNSxcbiAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLFxuICAgIHRvcDogXCIxMHB4XCIsXG4gICAgbGVmdDogXCIxMHB4XCIsXG4gICAgcmlnaHQ6IFwiMTBweFwiLFxuICAgIGJvdHRvbTogXCIxMHB4XCIsXG4gICAgYm9yZGVyOiBcIjFweCBzb2xpZCAjY2NjXCIsXG4gICAgYmFja2dyb3VuZENvbG9yOiBcInJnYmEoMTUsIDE1LCAxNSwgMSlcIixcbiAgICBvdmVyZmxvdzogXCJhdXRvXCIsXG4gICAgV2Via2l0T3ZlcmZsb3dTY3JvbGxpbmc6IFwidG91Y2hcIixcbiAgICBib3JkZXJSYWRpdXM6IFwiNHB4XCIsXG4gICAgb3V0bGluZTogXCJub25lXCIsXG4gICAgcGFkZGluZzogXCIyMHB4XCJcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgUHJldmlldztcbiJdfQ==