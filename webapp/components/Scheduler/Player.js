import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import { default as Video, Controls, Play, Mute, Seek, Fullscreen, Time, Overlay } from 'react-html5video';
import 'whatwg-fetch';
var ReactDOMServer = require('react-dom/server');
var Parse = require('parse');
// Parse.initialize("ABCDEFG12345");
// Parse.serverURL = 'http://psign.iriosystems.com:1380/parse'
// /**
//  * Example "A", see results on the left-side
//  */
// var id = setInterval(function() {
//     if ( new Date().getSeconds() === 0 ) {
//         setInterval(onTheMinFuncA, delay);
//         onTheMinFuncA();
//         clearInterval(id);
//     }
// },1000);

/**
 * Example "B", see results on the right-side
 */



// /**
//  * Two equivalent functions, just for this example
//  */

// function onTheMinFuncA() {
//     var time = new Date().toTimeString();
//     var p = document.createElement('p');
//     p.innerHTML = time;
//     document.getElementById('a').appendChild(p)
// }



// idea, add two playlist items  at each tick, placing default item when there is nothing to display the beginning


class Player extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            scrollingText: "Nothing to show ... ",
            elapsed: 0,
            start: Date.now(),
            // videourl: "/upload?filename=signal.mp4",
            // playlist: ["/upload?filename=signal.mp4"],
            // defaultVideo: "/upload?filename=signal.mp4",
            playlistIndex: 0,
            title: "",
            currentTime: "12"
        };
        this.tick = this.tick.bind(this);
        this.getTimeSlot = this.getTimeSlot.bind(this);
        this.loadSlot = this.loadSlot.bind(this);
        this.onThehalfMinFunc = this.onThehalfMinFunc.bind(this);
        this.getSettings = this.getSettings.bind(this);


    }

    getTimeSlot(date, hour, min, seconds) {
        var dateSelected = date;
        var duration = moment.duration();
        var min = min;
        var seconds = seconds;
        duration.add({ 'hours': hour });
        duration.add({ 'minutes': min });
        duration.add({ 'seconds': seconds });
        return dateSelected.add(duration);
    }

    loadSlot(date, hour, min, seconds) {
        var timeSlot = this.getTimeSlot(date, hour, min, seconds);

        fetch('/loadSlot?time=' + timeSlot.format())
            .then((response) => {
                return response.json()
            }).then((video) => {
                console.log('parsed video', video)
                var newPlaylist = [this.state.videourl];//this.state.playlist;
                newPlaylist.push(video.video);
                // this.setState({ start: new Date(), title: video.title, scrollingText: video.scrolling_text, videourl: video.video, playlist: newPlaylist, currentVideo: video.video });
                // this.refs.video.load();
                // this.refs.video.play();
                this.setState({ nextvideo: video.video });
                console.log(this.state.nextvideo);
            }).catch((ex) => {
                // var newPlaylist = this.state.playlist;
                // var newPlaylist = [this.state.videourl];
                // newPlaylist.push(this.state.defaultVideo);
                // // console.log('parsing failed', ex)
                // // loaddefaultvideo instead
                // // this.setState({ nextVideo: defaultVideo });
                // this.setState({ nextvideo: this.state.defaultVideo });

                // console.log(this.state.nextvideo);
                this.getSettings();

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
        // this.loadSlot();
        var now = new Date();
        var delay = 30 * 1000; // 1 min in msec
        var start = delay - (now.getSeconds()) * 1000 + now.getMilliseconds();

        // setTimeout(() => {
        //     setInterval(this.onThehalfMinFunc, delay);
        //     console.log("calling half min ...");
        //     this.onThehalfMinFunc();
        // }, start);
        var id = setInterval(() => {
            if (new Date().getSeconds() === 0) {
                setInterval(this.onThehalfMinFunc, delay);
                this.onThehalfMinFunc();
                clearInterval(id);
            }
        }, 1000);
    }

    onThehalfMinFunc() {
        var time = new Date().toTimeString();
        // var p = document.createElement('p');
        // p.innerHTML = time;
        // document.getElementById('b').appendChild(p)
        this.setState({ currentTime: time });
        // console.log("half min ...", time);
        // console.log(this.state.currentTime);
        // if (this.timer)
        //     clearInterval(this.timer);    
        // //load next2 videos
        // this.timer = setInterval(this.tick, 25000);
        // eos/small.mp4
        //http://media.w3.org/2010/05/video/movie_300.mp4
        var lastVideo = this.state.videourl;
        this.setState({ start: new Date(), videourl: this.state.nextvideo }, () => {
            if (lastVideo != this.state.videourl) {
                this.refs.video.load();
                this.refs.video.play();
            }
        });

        this.tick();
    }

    getSettings() {
        // fetch("/settings").then((response) => {
        //     return response.json()
        // }).then(k => {
        //     console.log("/settings", k);
        //     var videourl = "/upload?filename=" + k.defaultVideo;
        //     this.setState({
        //         settings: k, videourl, bannerurl: "/upload?filename=" + k.defaultBanner,
        //         nextvideo: videourl,
        //         playlist: [videourl],
        //     }, () => {
        //         // console.log("default:" +  this.state.videourl);
        //         this.refs.video.load();
        //         this.refs.video.pause();
        //         this.refs.video.play();
        //     });
        // }).catch(e => {

        // });
        var Settings = Parse.Object.extend("Settings");
        var query = new Parse.Query(Settings);
        query.find(null).then(settings => {
            var setting = settings[0];

            console.log({ settings });
            var videourl = "/upload?filename=" + setting.get('defaultVideo');

            this.setState({
                settings: {
                    defaultVideo: setting.get('defaultVideo'),
                    defaultBanner: setting.get('defaultBanner')
                }, videourl, bannerurl: "/upload?filename=" + setting.get('defaultBanner'),
                playlist: [videourl]
            }, () => {
                // console.log("default:" +  this.state.videourl);
                this.refs.video.load();
                this.refs.video.pause();
                this.refs.video.play();
            });
        });
    }

    componentWillUnmount() {

        // This method is called immediately before the component is removed
        // from the page and destroyed. We can clear the interval here:

        clearInterval(this.timer);
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
        console.log('loading next videos ... @' + tickDate.toTimeString());
        var date = tickDate.setHours(0, 0, 0, 0);
        // console.log
        // }
        // http://techslides.com/demos/sample-vid
        this.loadSlot(moment(date), otherDate.getHours(), otherDate.getMinutes(),
            (Math.floor(otherDate.getSeconds() / 30) + 1) * 30);

    }
    render() {
        var elapsed = Math.round(this.state.elapsed / 100);

        // This will give a number with one digit after the decimal dot (xx.x):
        var seconds = (elapsed / 10).toFixed(1);
        var now = moment().format("HH:mm A");
        // console.log(now);

        return (
            <div>
                <h3 style={{ color: "red" }}>Player </h3>
                <div id='calendar' align="center" style={{ width: "100%", height: "100%", position: "relative", backgroundColor: "lightgray" }}>
                    <img style={{ color: "yellow", backgroundColor: "black", fontSize: 30, position: "absolute", top: 0, right: 0, height: 80, width: "100%" }} src={this.state.bannerurl}></img>


                    <Video style={{ width: "100%", height: "500px" }} autoPlay loop ref="video"
                        poster="https://camo.githubusercontent.com/e87d73e52109c623ea0e315993ab8b5f037fb00f/687474703a2f2f6d6465727269636b2e6769746875622e696f2f72656163742d68746d6c35766964656f2f6578616d706c652e706e673f763d31"
                        onCanPlayThrough={() => {
                            // Do stuff
                        } }>
                        <source src={this.state.videourl} type="video/mp4" />
                    </Video>
                    <marquee style={{ color: "yellow", backgroundColor: "black", fontSize: 30, position: "absolute", bottom: 0, right: 80 }} behavior="scroll" direction="left" >{this.state.scrollingText}</marquee>
                    <div style={{ color: "red", backgroundColor: "teal", fontSize: 30, position: "absolute", paddingRight: 8, paddingLeft: 8, bottom: 0, right: 0 }}> {now}</div>

                </div>
                {this.currentTime}
                <button onClick={this.props.parent.closeModal}>Close</button>
            </div>
        );
    }
}

export default Player;