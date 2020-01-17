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
const express = require("express");
var process = require("process");
var app = express();
var path = require("path"), multer = require("multer"), bodyParser = require("body-parser"), MulterImpl = require("./multerImpl");
var numeral = require("numeral");
var sanitize = require("sanitize-filename");
var querystring = require("querystring");
var http = require("http"), os = require("os"), fs = require("fs");
var Busboy = require("busboy");
var moment = require("moment");
const socket_io = require("socket.io");
const Parse = require("parse");
const Constants_1 = require("./Constants");
Parse.serverURL = Constants_1.CONSTANTS.SERVER_URL;
Parse.initialize(Constants_1.CONSTANTS.APP_ID, undefined, Constants_1.CONSTANTS.MASTER_KEY);
// var mongoose = require("mongoose");
function enableVideoApi(app) {
    var http = require("http").Server(app);
    var io = socket_io(http);
    // mongoose.connect("mongodb://localhost/psign_db");
    // var Video = mongoose.model("Video", {
    //     title: String,
    //     scrolling_text: String,
    //     video: String,
    //     timestamp: Date,
    //     created_at: Date,
    //     modified_at: Date,
    //     duration: Number
    // });
    // var Settings = mongoose.model("Settings", {
    //     defaultVideo: String,
    //     defaultBanner: String,
    //     created_at: Date,
    //     modified_at: Date
    // });
    // var Device = mongoose.model("Devices", {
    //     uuid: String,
    //     vehicle_no: String,
    //     longitude: String,
    //     latitude: String,
    //     created_at: Date,
    //     modified_at: Date
    // });
    io.on("connection", socket => {
        socket.emit("news", { hello: "world" });
        console.log("a user connected");
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
        socket.on("getLatest", msg => {
            console.log("message: ", { msg });
        });
        socket.on("device_location", (locinfo) => __awaiter(this, void 0, void 0, function* () {
            console.log("location message: ", { locinfo });
            if (locinfo.uuid) {
                //check if device in DB and if not, register it.
                try {
                    var device = yield (new Parse.Query("Devices").get(locinfo.uuid));
                    console.log("device", device);
                    if (!device) {
                        console.log("Adding device " + locinfo.uuid + " at location ", {
                            lat: locinfo.latitude,
                            lng: locinfo.longitude
                        });
                        device = new Parse.Object("Devices");
                        device.set("uuid", locinfo.uuid);
                        device.set("location", new Parse.GeoPoint({ latitude: locinfo.latitude, longitude: locinfo.longitude }));
                        yield device.save(null);
                    }
                    //Emit to all listeners
                    io.emit("updateDevice", { for: "everyone", device });
                    console.log("Device saved:", device);
                }
                catch (e) {
                    console.log("Failed to save device:", locinfo);
                }
            }
        }));
    });
    // app.use(express.static('./'));
    /************************************************************
     *
     * Express routes for:
     *   - app.js
     *   - style.css
     *   - index.html
     *
     *   Sample endpoints to demo async data fetching:
     *     - POST /landing
     *     - POST /home
     *
     ************************************************************/
    // var bodyParser = require("body-parser");
    // app.use(bodyParser.json()); // to support JSON-encoded bodies
    // app.use(
    //     bodyParser.urlencoded({
    //         // to support URL-encoded bodies
    //         extended: true
    //     })
    // );
    // app.use(express.static(__dirname + "/build"));
    // // app.use(new MulterImpl({}).init());
    // var upload = new MulterImpl({}).init();
    // // app.use(express.static('./'));
    // var thumb = require("node-thumbnail").thumb;
    // // var thumbler = require('video-thumb');
    // var ffmpeg = require("fluent-ffmpeg");
    // app.get("/deleteVideo", (req, res) => {
    //     var folder = "./uploads/";
    //     var { name } = req.query;
    //     console.log({ name });
    //     var oldPath = folder + name;
    //     try {
    //         fs.unlinkSync(oldPath);
    //     } catch (e) { }
    //     oldPath = oldPath + ".thumb.png";
    //     try {
    //         fs.unlinkSync(oldPath);
    //     } catch (e) { }
    //     console.log({ oldPath });
    //     var extensions: string[] = [];
    //     if (req.query.extensions) {
    //         extensions = req.query.extensions.split(",");
    //     }
    //     if (extensions.length == 0)
    //         extensions = [".mp4"];
    //     function readFiles(dirname, onFileContent, onError) {
    //         fs.readdir(dirname, (err, filenames) => {
    //             if (err) {
    //                 onError(err);
    //                 return;
    //             }
    //             return onFileContent(filenames);
    //         });
    //     }
    //     readFiles(
    //         folder,
    //         (filenames, content) => {
    //             var filesInfo = [];
    //             var current: any = Promise.resolve();
    //             Promise.all(
    //                 filenames.map(k => {
    //                     current = current.then(() => {
    //                         if (extensions.indexOf(path.extname(k).toLowerCase()) != -1) {
    //                             // filter out only .mp4's
    //                             if (path.extname(k) == ".mp4") {
    //                                 console.log("getting duration for: " + k);
    //                                 // if (path.extname(k) == ".mp4") {
    //                                 //     //get file duration
    //                                 return new Promise(resolve =>
    //                                     ffmpeg.ffprobe(folder + k, (err, meta) => {
    //                                         if (err) {
    //                                             console.log(err);
    //                                             resolve({});
    //                                         } else {
    //                                             console.dir(meta.format.duration);
    //                                             resolve({
    //                                                 name: querystring.escape(k),
    //                                                 size: numeral(fs.statSync(folder + k).size).format("0.00 b"),
    //                                                 thumbnail: !req.query.extensions
    //                                                     ? querystring.escape(k + ".thumb.png")
    //                                                     : querystring.escape(k),
    //                                                 duration: meta.format.duration
    //                                             });
    //                                         }
    //                                     })
    //                                 );
    //                             } else
    //                                 return new Promise(resolve =>
    //                                     resolve({
    //                                         name: querystring.escape(k),
    //                                         size: numeral(fs.statSync(folder + k).size).format("0.00 b"),
    //                                         thumbnail: !req.query.extensions
    //                                             ? querystring.escape(k + ".thumb.png")
    //                                             : querystring.escape(k)
    //                                     })
    //                                 );
    //                         } else {
    //                             return null;
    //                         }
    //                     });
    //                     return current;
    //                 })
    //             ).then((results: any) => {
    //                 console.log(results);
    //                 results = results.filter(k => k != null);
    //                 results.sort((a, b) => {
    //                     return a.name > b.name;
    //                 });
    //                 res.send(results);
    //             });
    //         },
    //         error => {
    //             // throw err;
    //             res.status(500).send("Couldnt stat folder ./uploads");
    //         }
    //     );
    // });
    // app.get("/changeName", (req, res) => {
    //     var folder = "./uploads/";
    //     var { oldName, newName } = req.query;
    //     console.log({ oldName, newName });
    //     var oldPath = folder + oldName;
    //     var newPath = folder + newName;
    //     console.log({ oldPath, newPath });
    //     try {
    //         fs.renameSync(oldPath, newPath);
    //     } catch (e) { }
    //     oldPath = oldPath + ".thumb.png";
    //     newPath = newPath + ".thumb.png";
    //     try {
    //         fs.renameSync(oldPath, newPath);
    //     } catch (e) { }
    //     console.log({ oldPath, newPath });
    //     var extensions: string[] = [];
    //     if (req.query.extensions) {
    //         extensions = req.query.extensions.split(",");
    //     }
    //     if (extensions.length <= 0) extensions = [".mp4"];
    //     function readFiles(dirname, onFileContent, onError) {
    //         fs.readdir(dirname, (err, filenames) => {
    //             if (err) {
    //                 onError(err);
    //                 return;
    //             }
    //             return onFileContent(filenames);
    //         });
    //     }
    //     readFiles(
    //         folder,
    //         (filenames, content) => {
    //             var filesInfo = [];
    //             var current: any = Promise.resolve();
    //             Promise.all(
    //                 filenames.map(k => {
    //                     current = current.then(() => {
    //                         if (extensions.indexOf(path.extname(k).toLowerCase()) != -1) {
    //                             // filter out only .mp4's
    //                             if (path.extname(k) == ".mp4") {
    //                                 console.log("getting duration for: " + k);
    //                                 // if (path.extname(k) == ".mp4") {
    //                                 //     //get file duration
    //                                 return new Promise(resolve =>
    //                                     ffmpeg.ffprobe(folder + k, (err, meta) => {
    //                                         if (err) {
    //                                             console.log(err);
    //                                             resolve({});
    //                                         } else {
    //                                             console.dir(meta.format.duration);
    //                                             resolve({
    //                                                 name: querystring.escape(k),
    //                                                 size: numeral(fs.statSync(folder + k).size).format("0.00 b"),
    //                                                 thumbnail: !req.query.extensions
    //                                                     ? querystring.escape(k + ".thumb.png")
    //                                                     : querystring.escape(k),
    //                                                 duration: meta.format.duration
    //                                             });
    //                                         }
    //                                     })
    //                                 );
    //                             } else
    //                                 return new Promise(resolve =>
    //                                     resolve({
    //                                         name: querystring.escape(k),
    //                                         size: numeral(fs.statSync(folder + k).size).format("0.00 b"),
    //                                         thumbnail: !req.query.extensions
    //                                             ? querystring.escape(k + ".thumb.png")
    //                                             : querystring.escape(k)
    //                                     })
    //                                 );
    //                         } else {
    //                             return null;
    //                         }
    //                     });
    //                     return current;
    //                 })
    //             ).then((results: any) => {
    //                 console.log(results);
    //                 results = results.filter(k => k != null);
    //                 results.sort((a, b) => {
    //                     return a.name > b.name;
    //                 });
    //                 res.send(results);
    //             });
    //         },
    //         error => {
    //             // throw err;
    //             res.status(500).send("Couldnt stat folder ./uploads");
    //         }
    //     );
    // });
    // app.get("/gallery", (req, res) => {
    //     var folder = "./uploads/";
    //     var extensions: string[] = [];
    //     if (req.query.extensions) {
    //         extensions = req.query.extensions.split(",");
    //     }
    //     if (extensions.length <= 0) extensions = [".mp4"];
    //     function readFiles(dirname, onFileContent, onError) {
    //         fs.readdir(dirname, (err, filenames) => {
    //             if (err) {
    //                 onError(err);
    //                 return;
    //             }
    //             return onFileContent(filenames);
    //         });
    //     }
    //     readFiles(
    //         folder,
    //         (filenames, content) => {
    //             var filesInfo = [];
    //             var current: any = Promise.resolve();
    //             Promise.all(
    //                 filenames.map((k: string) => {
    //                     current = current.then(() => {
    //                         if (extensions.indexOf(path.extname(k).toLowerCase()) != -1) {
    //                             // filter out only .mp4's
    //                             if (path.extname(k) == ".mp4") {
    //                                 console.log("getting duration for: " + k);
    //                                 // if (path.extname(k) == ".mp4") {
    //                                 //     //get file duration
    //                                 return new Promise(resolve =>
    //                                     ffmpeg.ffprobe(folder + k, (err, meta) => {
    //                                         if (err) {
    //                                             console.log(err);
    //                                             resolve({});
    //                                         } else {
    //                                             console.dir(meta.format.duration);
    //                                             resolve({
    //                                                 name: querystring.escape(k),
    //                                                 size: numeral(fs.statSync(folder + k).size).format("0.00 b"),
    //                                                 thumbnail: !req.query.extensions
    //                                                     ? querystring.escape(k + ".thumb.png")
    //                                                     : querystring.escape(k),
    //                                                 duration: meta.format.duration
    //                                             });
    //                                         }
    //                                     })
    //                                 );
    //                             } else
    //                                 return new Promise(resolve =>
    //                                     resolve({
    //                                         name: querystring.escape(k),
    //                                         size: numeral(fs.statSync(folder + k).size).format("0.00 b"),
    //                                         thumbnail: !req.query.extensions
    //                                             ? querystring.escape(k + ".thumb.png")
    //                                             : querystring.escape(k)
    //                                     })
    //                                 );
    //                         } else {
    //                             return null;
    //                         }
    //                     });
    //                     return current;
    //                 })
    //             ).then((results: any) => {
    //                 console.log(results);
    //                 results = results.filter(k => k != null);
    //                 results.sort((a, b) => {
    //                     return a.name > b.name;
    //                 });
    //                 res.send(results);
    //             });
    //         },
    //         error => {
    //             // throw err;
    //             res.status(500).send("Couldnt stat folder ./uploads");
    //         }
    //     );
    // });
    // app.post("/upload", (req, res) => {
    //     var busboy = new Busboy({ headers: req.headers });
    //     var filePath = "";
    //     var folder = "./uploads/";
    //     var vfilename = "";
    //     busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    //         console.log(
    //             "File [" +
    //             fieldname +
    //             "]: filename: " +
    //             filename +
    //             ", encoding: " +
    //             encoding +
    //             ", mimetype: " +
    //             mimetype
    //         );
    //         filename = sanitize(filename);
    //         var saveTo = path.join("./uploads/", path.basename(filename));
    //         vfilename = filename;
    //         filePath = saveTo;
    //         file.pipe(fs.createWriteStream(saveTo));
    //     });
    //     busboy.on("finish", () => {
    //         var thumbPath = filePath + ".thumb.png";
    //         // res.writeHead(200, { 'Connection': 'close' });
    //         // res.end("That's all folks!");
    //         // thumbler.extract(filePath, '00:00:10', '200x125', function () {
    //         //     // console.log('snapshot saved to snapshot.png (200x125) with a frame at 00:00:22');
    //         //     res.json({ status: "succeeded", filepath: filePath, thumbnail: thumbPath });
    //         // });
    //         if (path.extname(filePath) == ".mp4") {
    //             //screenshots for .mp4's only
    //             ffmpeg(filePath)
    //                 .on("filenames", filenames => {
    //                     console.log("Will generate " + filenames.join(", "));
    //                 })
    //                 .on("end", () => {
    //                     console.log("Screenshots taken");
    //                     res.json({ status: "succeeded", filepath: filePath, thumbnail: thumbPath });
    //                 })
    //                 .screenshots({
    //                     // Will take screens at 20%, 40%, 60% and 80% of the video
    //                     timestamps: ["50%"],
    //                     filename: vfilename + ".thumb.png",
    //                     folder: folder,
    //                     size: "200x125"
    //                 });
    //         } else {
    //             res.json({ status: "succeeded", filepath: filePath, thumbnail: filePath });
    //         }
    //         // ffmpeg('/path/to/video.avi')
    //         //     .screenshots({
    //         //         timestamps: [30.5, '50%', '01:10.123'],
    //         //         filename: 'thumbnail-at-%s-seconds.png',
    //         //         folder: '/path/to/output',
    //         //         size: '320x240'
    //         //     });
    //     });
    //     return req.pipe(busboy);
    // });
    // app.get("/upload", (req, res) => {
    //     var filename = req.query.filename;
    //     var filepath = __dirname + "/uploads/" + filename;
    //     console.log("reading: ", filepath);
    //     // var fs = require('fs');
    //     var stat = fs.statSync(filepath);
    //     // res.writeHead(200, {
    //     //   "Content-Type": "video/mp4",
    //     //   "Content-Length": stat.size
    //     // });
    //     console.log("file stats: ", stat);
    //     //define file path,time to seek the beegining and set ffmpeg binary
    //     // var pathToMovie = '../videos/test.mp4';
    //     // var seektime = 100;
    //     // proc.setFfmpegPath(__dirname + "/ffmpeg/ffmpeg");
    //     // //encoding the video source
    //     // var proc = new ffmpeg({source: pathToMovie})
    //     //        .seekInput(seektime)
    //     //        .withVideoBitrate(1024)
    //     //        .withVideoCodec('libx264')
    //     //        .withAspect('16:9')
    //     //        .withFps(24)
    //     //        .withAudioBitrate('128k')
    //     //        .withAudioCodec('libfaac')
    //     //        .toFormat('mp4');
    //     // //pipe
    //     //        res.pipe(res, {end: true});
    //     // console.log(req.params);
    //     // res.json({ filepath: req.query["filename"] });
    //     // console.log("sending file: ", filename);
    //     // res.download(filepath, filename);
    //     var mimeTypes = {
    //         html: "text/html; charset=utf-8",
    //         jpeg: "image/jpeg",
    //         jpg: "image/jpeg",
    //         png: "image/png",
    //         js: "text/javascript",
    //         css: "text/css",
    //         mp4: "video/mp4"
    //     };
    //     // if (stat.isFile()) {
    //     //   var extension = path.extname(filename).split('.').reverse()[0];
    //     //   if (extension === 'mp4') {
    //     //     // gotta chunk the response if serving an mp4
    //     //     var range = req.headers.range || "";
    //     //     var parts = range.replace(/bytes=/, "").split("-");
    //     //     var partialstart = parts[0];
    //     //     var partialend = parts[1];
    //     //     var total = stat.size;
    //     //     var start = parseInt(partialstart, 10);
    //     //     var end = partialend ? parseInt(partialend, 10) : total - 1;
    //     //     var chunksize = (end - start) + 1;
    //     //     var mimeType = mimeTypes[extension] || 'text/plain; charset=utf-8';
    //     //     res.writeHead(206, {
    //     //       'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
    //     //       'Accept-Ranges': 'bytes',
    //     //       'Content-Length': chunksize,
    //     //       'Content-Type': mimeType
    //     //     });
    //     //     var fileStream = fs.createReadStream(filepath, {
    //     //         start: start,
    //     //         end: end
    //     //     });
    //     //     fileStream.pipe(res);
    //     //     res.on('close', function() {
    //     //       console.log('response closed');
    //     //       if (res.fileStream) {
    //     //           res.fileStream.unpipe(this);
    //     //           if (this.fileStream.fd) {
    //     //               fs.close(this.fileStream.fd);
    //     //           }
    //     //       }
    //     //     });
    //     //   } else {
    //     //     var mimeType = mimeTypes[extension] || 'text/plain; charset=utf-8';
    //     //     res.writeHead(200, {'Content-Type': mimeType});
    //     //     var fileStream = fs.createReadStream(filepath);
    //     //     fileStream.pipe(res);
    //     //   }
    //     // }
    //     var stream = fs.createReadStream(filepath, { bufferSize: 64 * 1024 });
    //     stream.pipe(res);
    //     var had_error = false;
    //     stream.on("error", function (err) {
    //         had_error = true;
    //     });
    //     // stream.on('close', function(){
    //     //   if (!had_error) fs.unlink('<filepath>/example.pdf');
    //     // });
    // });
    // app.get("/repeatRSSFeed", (reqE, res) => {
    //     var rss_url = reqE.query.url;
    //     var FeedParser = require("feedparser");
    //     var request = require("request"); // for fetching the feed
    //     var req = request(rss_url);
    //     var feedparser = new FeedParser();
    //     req.on("error", (error) => {
    //         // handle any request errors
    //         console.log("req.on", { error });
    //         res.status(500).json({ error });
    //     });
    //     req.on("response", function (res) {
    //         var stream = this; // `this` is `req`, which is a stream
    //         console.log("req.on", { stream });
    //         if (res.statusCode !== 200) {
    //             this.emit("error", new Error("Bad status code"));
    //         } else {
    //             stream.pipe(feedparser);
    //         }
    //     });
    //     feedparser.on("error", (error) => {
    //         console.log("req.on", { error });
    //         // always handle errors
    //         res.status(500).json({ error });
    //     });
    //     feedparser.on("readable", function () {
    //         console.log("readable");
    //         // This is where the action is!
    //         var stream = this; // `this` is `feedparser`, which is a stream
    //         var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
    //         var item;
    //         // while (item = stream.read()) {
    //         //   console.log(item);
    //         // }
    //         reqE.pipe(stream);
    //     });
    // });
    // app.post("/saveSlot", (req, res) => {
    //     return Video.findOne(
    //         { timestamp: req.body.timestamp },
    //         "title scrolling_text video timestamp created_at modified_at duration",
    //         function (err, video) {
    //             console.log("video", video);
    //             // res.json(video);
    //             var vid: any = null;
    //             if (err || video == null) {
    //                 // new video
    //                 console.log("Saving " + req.body.title + " for time " + moment(req.body.timestamp));
    //                 vid = new Video({
    //                     title: req.body.title,
    //                     scrolling_text: req.body.scrolling_text,
    //                     video: req.body.video,
    //                     timestamp: req.body.timestamp,
    //                     duration: req.body.duration,
    //                     created_at: new Date(),
    //                     modified_at: new Date()
    //                 });
    //                 return vid.save(function (err) {
    //                     io.emit("saveSlot", { for: "everyone", video: vid });
    //                     if (err) {
    //                         console.log(err);
    //                         res.send("failed to save");
    //                     } else {
    //                         res.send("saved");
    //                     }
    //                 });
    //             } else {
    //                 vid = video;
    //                 vid.title = req.body.title;
    //                 vid.scrolling_text = req.body.scrolling_text;
    //                 vid.timestamp = req.body.timestamp;
    //                 vid.modified_at = new Date();
    //                 vid.video = req.body.video;
    //                 console.log(vid.video);
    //                 return vid.save(function (err) {
    //                     if (err) {
    //                         console.log(err);
    //                         res.send("failed to save");
    //                     } else {
    //                         res.send("updated");
    //                     }
    //                 });
    //             }
    //         }
    //     );
    // });
    // app.get("/loadSlot", (req, res) => {
    //     var time = moment(req.query.time);
    //     console.log("loadSlot :" + time.format() + " from: " + req.query.time);
    //     // find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
    //     return Video.findOne(
    //         { timestamp: time },
    //         "title scrolling_text video timestamp created_at modified_at duration",
    //         function (err, video) {
    //             if (err || video == null) return res.status(404).send("failed"); //return handleError(err);
    //             console.log("video", video);
    //             res.json(video);
    //         }
    //     );
    // });
    // app.get("/devices", (req, res) => {
    //     // find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
    //     return Device.find(
    //         {},
    //         "uuid longitude latitude vehicle_no created_at modified_at",
    //         (err, devices) => {
    //             if (err || devices == null) return res.status(404).send("failed"); //return handleError(err);
    //             console.log("devices", devices);
    //             res.json(devices);
    //         }
    //     );
    // });
    // app.get("/loadAllSlots", function (req, res) {
    //     var time = moment(req.query.time);
    //     console.log("loadAllSlots :" + time.format() + " from: " + req.query.time);
    //     // find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
    //     return Video.find(
    //         {},
    //         "title scrolling_text video timestamp created_at modified_at duration",
    //         function (err, videos) {
    //             if (err || videos == null) return res.status(404).send("failed"); //return handleError(err);
    //             console.log("video", videos);
    //             var newvideos = videos.map(k => {
    //                 //2016-05-24T13:09:30+03:00
    //                 // k.timestamp = moment(k.timestamp).format("DD-MM-YYYY HH:mm:ss");
    //                 return {
    //                     timestamp: moment(k.timestamp)
    //                         .toDate()
    //                         .getTime(),
    //                     title: k.title,
    //                     scrolling_text: k.scrolling_text,
    //                     video: k.video,
    //                     created_at: k.created_at,
    //                     modified_at: k.modified_at,
    //                     duration: k.duration
    //                 };
    //             });
    //             res.json(newvideos);
    //         }
    //     );
    // });
    // app.get("/loadAllNewSlots", function (req, res) {
    //     var time = moment(req.query.time);
    //     console.log("loadAllSlots :" + time.format() + " from: " + req.query.time);
    //     // find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
    //     return Video.find(
    //         { timestamp: { $gt: new Date() } },
    //         "title scrolling_text video timestamp created_at modified_at duration",
    //         function (err, videos) {
    //             if (err || videos == null) return res.status(404).send("failed"); //return handleError(err);
    //             console.log("video", videos);
    //             res.json(videos);
    //         }
    //     );
    // });
    // const defaultSettings = new Settings({
    //     defaultVideo: "/uploads/signal.mp4",
    //     defaultBanner: "/uploads/banners/banner.jpg",
    //     created_at: new Date(),
    //     modified_at: new Date()
    // });
    // app.get("/settings", function (req, res) {
    //     console.log("loadSettings :");
    //     // find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
    //     return Settings.find({}, "defaultVideo defaultBanner created_at modified_at", function (
    //         err,
    //         settings
    //     ) {
    //         if (err || settings == null) return res.status(404).send("failed"); //return handleError(err);
    //         // console.log('settings', settings) 
    //         if (settings.length == 0) {
    //             var setting = defaultSettings;
    //             return setting.save(function (err) {
    //                 if (err) {
    //                     console.log(err);
    //                     res.send("failed to save");
    //                 } else {
    //                     // res.send("saved");
    //                     res.json(setting);
    //                 }
    //             });
    //         } else res.json(settings[0]);
    //     });
    // });
    // app.post("/settings", function (req, res) {
    //     console.log("saveSettings :");
    //     // find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
    //     return Settings.find({}, "defaultVideo defaultBanner created_at modified_at", function (
    //         err,
    //         settings
    //     ) {
    //         if (err || settings == null) return res.status(404).send("failed"); //return handleError(err);
    //         var setting = settings[0];
    //         if (!setting) {
    //             setting = defaultSettings;
    //         }
    //         // console.log('settings', settings) 
    //         setting.defaultVideo = req.body.defaultVideo || setting.defaultVideo;
    //         setting.defaultBanner = req.body.defaultBanner || setting.defaultBanner;
    //         setting.modified_at = new Date();
    //         return setting.save(function (err) {
    //             if (err) {
    //                 console.log(err);
    //                 res.send("failed to save");
    //             } else {
    //                 // res.send("saved");
    //                 io.emit("saveSettings", { for: "everyone", setting: setting });
    //                 res.json(setting);
    //             }
    //         });
    //     });
    // });
    // app.post("/updateDevice", function (req, res) {
    //     var locinfo = req.body;
    //     console.log("location message: ", { locinfo });
    //     if (locinfo && locinfo.uuid) {
    //         //check if device in DB and if not, register it.
    //         Device.findOne(
    //             { uuid: locinfo.uuid },
    //             "uuid longitude latitude created_at modified_at",
    //             function (err, device) {
    //                 console.log("device", device);
    //                 // res.json(video);
    //                 var dev: any = null;
    //                 if (err || device == null) {
    //                     // new device
    //                     console.log("Adding device " + locinfo.uuid + " at location ", {
    //                         lat: locinfo.latitude,
    //                         lng: locinfo.longitude
    //                     });
    //                     dev = new Device({
    //                         uuid: locinfo.uuid,
    //                         longitude: locinfo.longitude,
    //                         latitude: locinfo.latitude,
    //                         created_at: new Date(),
    //                         modified_at: new Date()
    //                     });
    //                     dev.save(function (err) {
    //                         io.emit("updateDevice", { for: "everyone", device: dev });
    //                         if (err) {
    //                             console.log(err);
    //                             res.write("failed to save");
    //                         } else {
    //                             res.write("saved");
    //                             console.log("saved", { dev });
    //                         }
    //                     });
    //                 } else {
    //                     dev = device;
    //                     dev.longitude = locinfo.longitude;
    //                     dev.latitude = locinfo.latitude;
    //                     // vid.timestamp = req.body.timestamp;
    //                     dev.modified_at = new Date();
    //                     // vid.video = req.body.video;
    //                     // console.log(vid.video);
    //                     dev.save(function (err) {
    //                         if (err) {
    //                             console.log(err);
    //                             res.write("failed to save");
    //                         } else {
    //                             console.log("saved", { dev });
    //                             res.write("updated");
    //                         }
    //                     });
    //                 }
    //             }
    //         );
    //     }
    //     res.write("invalid");
    // });
    // // Serve index page
    // app.get("*", function (req, res) {
    //     res.sendFile(__dirname + "/build/index.html");
    // });
    // // app.post('/upload', upload.single("photo"), function (req, res) {
    // //   // This block is only relevant to users
    // //   // interested in custom parameters - you
    // //   // can delete/ignore it as you wish
    // //   if (req.body) {
    // //     console.dir(req.body);
    // //   }
    // //   res.sendStatus(200);
    // // });
    // app.post("/landing", function (req, res) {
    //     res.json({
    //         title: "Landing Page"
    //     });
    // });
    // app.post("/home", function (req, res) {
    //     res.json({
    //         title: "Home Page"
    //     });
    // });
}
exports.enableVideoApi = enableVideoApi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlkZW9BcGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2aWRlb0FwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsbUNBQW9DO0FBQ3BDLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqQyxJQUFJLEdBQUcsR0FBRyxPQUFPLEVBQUUsQ0FBQztBQUNwQixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQ3RCLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQzFCLFVBQVUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQ25DLFVBQVUsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDekMsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pDLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQzVDLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUV6QyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQ3RCLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQ2xCLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFdkIsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUcvQix1Q0FBd0M7QUFHeEMsK0JBQStCO0FBQy9CLDJDQUF3QztBQUV2QyxLQUFhLENBQUMsU0FBUyxHQUFHLHFCQUFTLENBQUMsVUFBVSxDQUFDO0FBQ2hELEtBQUssQ0FBQyxVQUFVLENBQUMscUJBQVMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLHFCQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7QUFHcEUsc0NBQXNDO0FBRXRDLHdCQUEr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RDtJQUM3RCxvREFBb0Q7SUFDcEQsNEJBQTRCO0lBQzVCLDBCQUEwQjtJQUMxQixvQkFBb0I7SUFDcEIsZ0JBQWdCO0lBQ2hCLGFBQWE7SUFDYixRQUFRO0lBQ1IsNEJBQTRCO0lBQzVCLE1BQU07SUFFTixzQkFBc0I7SUFDdEIscUNBQXFDO0lBQ3JDLHFEQUFxRDtJQUNyRCxNQUFNO0lBRU4sdUVBQXVFO0lBQ3ZFLCtDQUErQztJQUMvQyxnREFBZ0Q7SUFDaEQsMkNBQTJDO0lBQzNDLHVCQUF1QjtJQUN2QixnQ0FBZ0M7SUFDaEMsU0FBUztJQUVULDRCQUE0QjtJQUM1QixTQUFTO0lBRVQsNkNBQTZDO0lBQzdDLGlCQUFpQjtJQUNqQixnQ0FBZ0M7SUFDaEMsVUFBVTtJQUNWLE1BQU07SUFFTiwwQ0FBMEM7SUFDMUMsaUJBQWlCO0lBQ2pCLDZCQUE2QjtJQUM3QixVQUFVO0lBQ1YsTUFBTTtBQUVWLENBQUM7QUFoNEJELHdDQWc0QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXhwcmVzcyA9IHJlcXVpcmUoXCJleHByZXNzXCIpO1xudmFyIHByb2Nlc3MgPSByZXF1aXJlKFwicHJvY2Vzc1wiKTtcbnZhciBhcHAgPSBleHByZXNzKCk7XG52YXIgcGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpLFxuICAgIG11bHRlciA9IHJlcXVpcmUoXCJtdWx0ZXJcIiksXG4gICAgYm9keVBhcnNlciA9IHJlcXVpcmUoXCJib2R5LXBhcnNlclwiKSxcbiAgICBNdWx0ZXJJbXBsID0gcmVxdWlyZShcIi4vbXVsdGVySW1wbFwiKTtcbnZhciBudW1lcmFsID0gcmVxdWlyZShcIm51bWVyYWxcIik7XG52YXIgc2FuaXRpemUgPSByZXF1aXJlKFwic2FuaXRpemUtZmlsZW5hbWVcIik7XG52YXIgcXVlcnlzdHJpbmcgPSByZXF1aXJlKFwicXVlcnlzdHJpbmdcIik7XG5cbnZhciBodHRwID0gcmVxdWlyZShcImh0dHBcIiksXG4gICAgb3MgPSByZXF1aXJlKFwib3NcIiksXG4gICAgZnMgPSByZXF1aXJlKFwiZnNcIik7XG5cbnZhciBCdXNib3kgPSByZXF1aXJlKFwiYnVzYm95XCIpO1xudmFyIG1vbWVudCA9IHJlcXVpcmUoXCJtb21lbnRcIik7XG5cbmltcG9ydCBodHRwU2VydmVyID0gcmVxdWlyZShcImh0dHBcIik7XG5pbXBvcnQgc29ja2V0X2lvID0gcmVxdWlyZShcInNvY2tldC5pb1wiKTtcblxuXG5pbXBvcnQgKiBhcyBQYXJzZSBmcm9tIFwicGFyc2VcIjtcbmltcG9ydCB7IENPTlNUQU5UUyB9IGZyb20gXCIuL0NvbnN0YW50c1wiO1xuXG4oUGFyc2UgYXMgYW55KS5zZXJ2ZXJVUkwgPSBDT05TVEFOVFMuU0VSVkVSX1VSTDtcblBhcnNlLmluaXRpYWxpemUoQ09OU1RBTlRTLkFQUF9JRCwgdW5kZWZpbmVkLCBDT05TVEFOVFMuTUFTVEVSX0tFWSk7XG5cblxuLy8gdmFyIG1vbmdvb3NlID0gcmVxdWlyZShcIm1vbmdvb3NlXCIpO1xuXG5leHBvcnQgZnVuY3Rpb24gZW5hYmxlVmlkZW9BcGkoYXBwOiBleHByZXNzLkFwcGxpY2F0aW9uKSB7XG5cbiAgICB2YXIgaHR0cCA9IHJlcXVpcmUoXCJodHRwXCIpLlNlcnZlcihhcHApO1xuICAgIHZhciBpbyA9IHNvY2tldF9pbyhodHRwKTtcblxuICAgIC8vIG1vbmdvb3NlLmNvbm5lY3QoXCJtb25nb2RiOi8vbG9jYWxob3N0L3BzaWduX2RiXCIpO1xuXG4gICAgLy8gdmFyIFZpZGVvID0gbW9uZ29vc2UubW9kZWwoXCJWaWRlb1wiLCB7XG4gICAgLy8gICAgIHRpdGxlOiBTdHJpbmcsXG4gICAgLy8gICAgIHNjcm9sbGluZ190ZXh0OiBTdHJpbmcsXG4gICAgLy8gICAgIHZpZGVvOiBTdHJpbmcsXG4gICAgLy8gICAgIHRpbWVzdGFtcDogRGF0ZSxcbiAgICAvLyAgICAgY3JlYXRlZF9hdDogRGF0ZSxcbiAgICAvLyAgICAgbW9kaWZpZWRfYXQ6IERhdGUsXG4gICAgLy8gICAgIGR1cmF0aW9uOiBOdW1iZXJcbiAgICAvLyB9KTtcbiAgICAvLyB2YXIgU2V0dGluZ3MgPSBtb25nb29zZS5tb2RlbChcIlNldHRpbmdzXCIsIHtcbiAgICAvLyAgICAgZGVmYXVsdFZpZGVvOiBTdHJpbmcsXG4gICAgLy8gICAgIGRlZmF1bHRCYW5uZXI6IFN0cmluZyxcbiAgICAvLyAgICAgY3JlYXRlZF9hdDogRGF0ZSxcbiAgICAvLyAgICAgbW9kaWZpZWRfYXQ6IERhdGVcbiAgICAvLyB9KTtcbiAgICAvLyB2YXIgRGV2aWNlID0gbW9uZ29vc2UubW9kZWwoXCJEZXZpY2VzXCIsIHtcbiAgICAvLyAgICAgdXVpZDogU3RyaW5nLFxuICAgIC8vICAgICB2ZWhpY2xlX25vOiBTdHJpbmcsXG4gICAgLy8gICAgIGxvbmdpdHVkZTogU3RyaW5nLFxuICAgIC8vICAgICBsYXRpdHVkZTogU3RyaW5nLFxuICAgIC8vICAgICBjcmVhdGVkX2F0OiBEYXRlLFxuICAgIC8vICAgICBtb2RpZmllZF9hdDogRGF0ZVxuICAgIC8vIH0pO1xuXG4gICAgaW8ub24oXCJjb25uZWN0aW9uXCIsIHNvY2tldCA9PiB7XG4gICAgICAgIHNvY2tldC5lbWl0KFwibmV3c1wiLCB7IGhlbGxvOiBcIndvcmxkXCIgfSk7XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJhIHVzZXIgY29ubmVjdGVkXCIpO1xuICAgICAgICBzb2NrZXQub24oXCJkaXNjb25uZWN0XCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidXNlciBkaXNjb25uZWN0ZWRcIik7XG4gICAgICAgIH0pO1xuICAgICAgICBzb2NrZXQub24oXCJnZXRMYXRlc3RcIiwgbXNnID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibWVzc2FnZTogXCIsIHsgbXNnIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgc29ja2V0Lm9uKFwiZGV2aWNlX2xvY2F0aW9uXCIsIGFzeW5jIGxvY2luZm8gPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2NhdGlvbiBtZXNzYWdlOiBcIiwgeyBsb2NpbmZvIH0pO1xuICAgICAgICAgICAgaWYgKGxvY2luZm8udXVpZCkge1xuICAgICAgICAgICAgICAgIC8vY2hlY2sgaWYgZGV2aWNlIGluIERCIGFuZCBpZiBub3QsIHJlZ2lzdGVyIGl0LlxuXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRldmljZTogUGFyc2UuT2JqZWN0ID0gYXdhaXQgKG5ldyBQYXJzZS5RdWVyeShcIkRldmljZXNcIikuZ2V0KGxvY2luZm8udXVpZCkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRldmljZVwiLCBkZXZpY2UpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghZGV2aWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFkZGluZyBkZXZpY2UgXCIgKyBsb2NpbmZvLnV1aWQgKyBcIiBhdCBsb2NhdGlvbiBcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhdDogbG9jaW5mby5sYXRpdHVkZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsbmc6IGxvY2luZm8ubG9uZ2l0dWRlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldmljZSA9IG5ldyBQYXJzZS5PYmplY3QoXCJEZXZpY2VzXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGV2aWNlLnNldChcInV1aWRcIiwgbG9jaW5mby51dWlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldmljZS5zZXQoXCJsb2NhdGlvblwiLCBuZXcgUGFyc2UuR2VvUG9pbnQoeyBsYXRpdHVkZTogbG9jaW5mby5sYXRpdHVkZSwgbG9uZ2l0dWRlOiBsb2NpbmZvLmxvbmdpdHVkZSB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBkZXZpY2Uuc2F2ZShudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvL0VtaXQgdG8gYWxsIGxpc3RlbmVyc1xuICAgICAgICAgICAgICAgICAgICBpby5lbWl0KFwidXBkYXRlRGV2aWNlXCIsIHsgZm9yOiBcImV2ZXJ5b25lXCIsIGRldmljZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJEZXZpY2Ugc2F2ZWQ6XCIsIGRldmljZSk7XG5cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmFpbGVkIHRvIHNhdmUgZGV2aWNlOlwiLCBsb2NpbmZvKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG5cblxuICAgIC8vIGFwcC51c2UoZXhwcmVzcy5zdGF0aWMoJy4vJykpO1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqXG4gICAgICogRXhwcmVzcyByb3V0ZXMgZm9yOlxuICAgICAqICAgLSBhcHAuanNcbiAgICAgKiAgIC0gc3R5bGUuY3NzXG4gICAgICogICAtIGluZGV4Lmh0bWxcbiAgICAgKlxuICAgICAqICAgU2FtcGxlIGVuZHBvaW50cyB0byBkZW1vIGFzeW5jIGRhdGEgZmV0Y2hpbmc6XG4gICAgICogICAgIC0gUE9TVCAvbGFuZGluZ1xuICAgICAqICAgICAtIFBPU1QgL2hvbWVcbiAgICAgKlxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvLyB2YXIgYm9keVBhcnNlciA9IHJlcXVpcmUoXCJib2R5LXBhcnNlclwiKTtcbiAgICAvLyBhcHAudXNlKGJvZHlQYXJzZXIuanNvbigpKTsgLy8gdG8gc3VwcG9ydCBKU09OLWVuY29kZWQgYm9kaWVzXG4gICAgLy8gYXBwLnVzZShcbiAgICAvLyAgICAgYm9keVBhcnNlci51cmxlbmNvZGVkKHtcbiAgICAvLyAgICAgICAgIC8vIHRvIHN1cHBvcnQgVVJMLWVuY29kZWQgYm9kaWVzXG4gICAgLy8gICAgICAgICBleHRlbmRlZDogdHJ1ZVxuICAgIC8vICAgICB9KVxuICAgIC8vICk7XG4gICAgLy8gYXBwLnVzZShleHByZXNzLnN0YXRpYyhfX2Rpcm5hbWUgKyBcIi9idWlsZFwiKSk7XG4gICAgLy8gLy8gYXBwLnVzZShuZXcgTXVsdGVySW1wbCh7fSkuaW5pdCgpKTtcbiAgICAvLyB2YXIgdXBsb2FkID0gbmV3IE11bHRlckltcGwoe30pLmluaXQoKTtcbiAgICAvLyAvLyBhcHAudXNlKGV4cHJlc3Muc3RhdGljKCcuLycpKTtcblxuICAgIC8vIHZhciB0aHVtYiA9IHJlcXVpcmUoXCJub2RlLXRodW1ibmFpbFwiKS50aHVtYjtcbiAgICAvLyAvLyB2YXIgdGh1bWJsZXIgPSByZXF1aXJlKCd2aWRlby10aHVtYicpO1xuICAgIC8vIHZhciBmZm1wZWcgPSByZXF1aXJlKFwiZmx1ZW50LWZmbXBlZ1wiKTtcblxuICAgIC8vIGFwcC5nZXQoXCIvZGVsZXRlVmlkZW9cIiwgKHJlcSwgcmVzKSA9PiB7XG4gICAgLy8gICAgIHZhciBmb2xkZXIgPSBcIi4vdXBsb2Fkcy9cIjtcblxuICAgIC8vICAgICB2YXIgeyBuYW1lIH0gPSByZXEucXVlcnk7XG5cbiAgICAvLyAgICAgY29uc29sZS5sb2coeyBuYW1lIH0pO1xuXG4gICAgLy8gICAgIHZhciBvbGRQYXRoID0gZm9sZGVyICsgbmFtZTtcbiAgICAvLyAgICAgdHJ5IHtcbiAgICAvLyAgICAgICAgIGZzLnVubGlua1N5bmMob2xkUGF0aCk7XG4gICAgLy8gICAgIH0gY2F0Y2ggKGUpIHsgfVxuXG4gICAgLy8gICAgIG9sZFBhdGggPSBvbGRQYXRoICsgXCIudGh1bWIucG5nXCI7XG5cbiAgICAvLyAgICAgdHJ5IHtcbiAgICAvLyAgICAgICAgIGZzLnVubGlua1N5bmMob2xkUGF0aCk7XG4gICAgLy8gICAgIH0gY2F0Y2ggKGUpIHsgfVxuXG4gICAgLy8gICAgIGNvbnNvbGUubG9nKHsgb2xkUGF0aCB9KTtcblxuICAgIC8vICAgICB2YXIgZXh0ZW5zaW9uczogc3RyaW5nW10gPSBbXTtcblxuICAgIC8vICAgICBpZiAocmVxLnF1ZXJ5LmV4dGVuc2lvbnMpIHtcbiAgICAvLyAgICAgICAgIGV4dGVuc2lvbnMgPSByZXEucXVlcnkuZXh0ZW5zaW9ucy5zcGxpdChcIixcIik7XG4gICAgLy8gICAgIH1cblxuICAgIC8vICAgICBpZiAoZXh0ZW5zaW9ucy5sZW5ndGggPT0gMClcbiAgICAvLyAgICAgICAgIGV4dGVuc2lvbnMgPSBbXCIubXA0XCJdO1xuXG4gICAgLy8gICAgIGZ1bmN0aW9uIHJlYWRGaWxlcyhkaXJuYW1lLCBvbkZpbGVDb250ZW50LCBvbkVycm9yKSB7XG4gICAgLy8gICAgICAgICBmcy5yZWFkZGlyKGRpcm5hbWUsIChlcnIsIGZpbGVuYW1lcykgPT4ge1xuICAgIC8vICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgb25FcnJvcihlcnIpO1xuICAgIC8vICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgLy8gICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgICAgIHJldHVybiBvbkZpbGVDb250ZW50KGZpbGVuYW1lcyk7XG4gICAgLy8gICAgICAgICB9KTtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICByZWFkRmlsZXMoXG4gICAgLy8gICAgICAgICBmb2xkZXIsXG4gICAgLy8gICAgICAgICAoZmlsZW5hbWVzLCBjb250ZW50KSA9PiB7XG4gICAgLy8gICAgICAgICAgICAgdmFyIGZpbGVzSW5mbyA9IFtdO1xuICAgIC8vICAgICAgICAgICAgIHZhciBjdXJyZW50OiBhbnkgPSBQcm9taXNlLnJlc29sdmUoKTtcblxuICAgIC8vICAgICAgICAgICAgIFByb21pc2UuYWxsKFxuICAgIC8vICAgICAgICAgICAgICAgICBmaWxlbmFtZXMubWFwKGsgPT4ge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQudGhlbigoKSA9PiB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4dGVuc2lvbnMuaW5kZXhPZihwYXRoLmV4dG5hbWUoaykudG9Mb3dlckNhc2UoKSkgIT0gLTEpIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmlsdGVyIG91dCBvbmx5IC5tcDQnc1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGF0aC5leHRuYW1lKGspID09IFwiLm1wNFwiKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImdldHRpbmcgZHVyYXRpb24gZm9yOiBcIiArIGspO1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgKHBhdGguZXh0bmFtZShrKSA9PSBcIi5tcDRcIikge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vZ2V0IGZpbGUgZHVyYXRpb25cblxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT5cbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmZm1wZWcuZmZwcm9iZShmb2xkZXIgKyBrLCAoZXJyLCBtZXRhKSA9PiB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHt9KTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKG1ldGEuZm9ybWF0LmR1cmF0aW9uKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHF1ZXJ5c3RyaW5nLmVzY2FwZShrKSxcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplOiBudW1lcmFsKGZzLnN0YXRTeW5jKGZvbGRlciArIGspLnNpemUpLmZvcm1hdChcIjAuMDAgYlwiKSxcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHVtYm5haWw6ICFyZXEucXVlcnkuZXh0ZW5zaW9uc1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHF1ZXJ5c3RyaW5nLmVzY2FwZShrICsgXCIudGh1bWIucG5nXCIpXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogcXVlcnlzdHJpbmcuZXNjYXBlKGspLFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBtZXRhLmZvcm1hdC5kdXJhdGlvblxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PlxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBxdWVyeXN0cmluZy5lc2NhcGUoayksXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpemU6IG51bWVyYWwoZnMuc3RhdFN5bmMoZm9sZGVyICsgaykuc2l6ZSkuZm9ybWF0KFwiMC4wMCBiXCIpLFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHVtYm5haWw6ICFyZXEucXVlcnkuZXh0ZW5zaW9uc1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBxdWVyeXN0cmluZy5lc2NhcGUoayArIFwiLnRodW1iLnBuZ1wiKVxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBxdWVyeXN0cmluZy5lc2NhcGUoaylcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50O1xuICAgIC8vICAgICAgICAgICAgICAgICB9KVxuICAgIC8vICAgICAgICAgICAgICkudGhlbigocmVzdWx0czogYW55KSA9PiB7XG4gICAgLy8gICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdHMpO1xuICAgIC8vICAgICAgICAgICAgICAgICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIoayA9PiBrICE9IG51bGwpO1xuICAgIC8vICAgICAgICAgICAgICAgICByZXN1bHRzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhLm5hbWUgPiBiLm5hbWU7XG4gICAgLy8gICAgICAgICAgICAgICAgIH0pO1xuICAgIC8vICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXN1bHRzKTtcbiAgICAvLyAgICAgICAgICAgICB9KTtcbiAgICAvLyAgICAgICAgIH0sXG4gICAgLy8gICAgICAgICBlcnJvciA9PiB7XG4gICAgLy8gICAgICAgICAgICAgLy8gdGhyb3cgZXJyO1xuICAgIC8vICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5zZW5kKFwiQ291bGRudCBzdGF0IGZvbGRlciAuL3VwbG9hZHNcIik7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgICk7XG4gICAgLy8gfSk7XG4gICAgLy8gYXBwLmdldChcIi9jaGFuZ2VOYW1lXCIsIChyZXEsIHJlcykgPT4ge1xuICAgIC8vICAgICB2YXIgZm9sZGVyID0gXCIuL3VwbG9hZHMvXCI7XG5cbiAgICAvLyAgICAgdmFyIHsgb2xkTmFtZSwgbmV3TmFtZSB9ID0gcmVxLnF1ZXJ5O1xuICAgIC8vICAgICBjb25zb2xlLmxvZyh7IG9sZE5hbWUsIG5ld05hbWUgfSk7XG5cbiAgICAvLyAgICAgdmFyIG9sZFBhdGggPSBmb2xkZXIgKyBvbGROYW1lO1xuICAgIC8vICAgICB2YXIgbmV3UGF0aCA9IGZvbGRlciArIG5ld05hbWU7XG5cbiAgICAvLyAgICAgY29uc29sZS5sb2coeyBvbGRQYXRoLCBuZXdQYXRoIH0pO1xuXG4gICAgLy8gICAgIHRyeSB7XG4gICAgLy8gICAgICAgICBmcy5yZW5hbWVTeW5jKG9sZFBhdGgsIG5ld1BhdGgpO1xuICAgIC8vICAgICB9IGNhdGNoIChlKSB7IH1cblxuICAgIC8vICAgICBvbGRQYXRoID0gb2xkUGF0aCArIFwiLnRodW1iLnBuZ1wiO1xuICAgIC8vICAgICBuZXdQYXRoID0gbmV3UGF0aCArIFwiLnRodW1iLnBuZ1wiO1xuXG4gICAgLy8gICAgIHRyeSB7XG4gICAgLy8gICAgICAgICBmcy5yZW5hbWVTeW5jKG9sZFBhdGgsIG5ld1BhdGgpO1xuICAgIC8vICAgICB9IGNhdGNoIChlKSB7IH1cblxuICAgIC8vICAgICBjb25zb2xlLmxvZyh7IG9sZFBhdGgsIG5ld1BhdGggfSk7XG5cbiAgICAvLyAgICAgdmFyIGV4dGVuc2lvbnM6IHN0cmluZ1tdID0gW107XG5cbiAgICAvLyAgICAgaWYgKHJlcS5xdWVyeS5leHRlbnNpb25zKSB7XG4gICAgLy8gICAgICAgICBleHRlbnNpb25zID0gcmVxLnF1ZXJ5LmV4dGVuc2lvbnMuc3BsaXQoXCIsXCIpO1xuICAgIC8vICAgICB9XG5cbiAgICAvLyAgICAgaWYgKGV4dGVuc2lvbnMubGVuZ3RoIDw9IDApIGV4dGVuc2lvbnMgPSBbXCIubXA0XCJdO1xuXG4gICAgLy8gICAgIGZ1bmN0aW9uIHJlYWRGaWxlcyhkaXJuYW1lLCBvbkZpbGVDb250ZW50LCBvbkVycm9yKSB7XG4gICAgLy8gICAgICAgICBmcy5yZWFkZGlyKGRpcm5hbWUsIChlcnIsIGZpbGVuYW1lcykgPT4ge1xuICAgIC8vICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgb25FcnJvcihlcnIpO1xuICAgIC8vICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgLy8gICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgICAgIHJldHVybiBvbkZpbGVDb250ZW50KGZpbGVuYW1lcyk7XG4gICAgLy8gICAgICAgICB9KTtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICByZWFkRmlsZXMoXG4gICAgLy8gICAgICAgICBmb2xkZXIsXG4gICAgLy8gICAgICAgICAoZmlsZW5hbWVzLCBjb250ZW50KSA9PiB7XG4gICAgLy8gICAgICAgICAgICAgdmFyIGZpbGVzSW5mbyA9IFtdO1xuICAgIC8vICAgICAgICAgICAgIHZhciBjdXJyZW50OiBhbnkgPSBQcm9taXNlLnJlc29sdmUoKTtcblxuICAgIC8vICAgICAgICAgICAgIFByb21pc2UuYWxsKFxuICAgIC8vICAgICAgICAgICAgICAgICBmaWxlbmFtZXMubWFwKGsgPT4ge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQudGhlbigoKSA9PiB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4dGVuc2lvbnMuaW5kZXhPZihwYXRoLmV4dG5hbWUoaykudG9Mb3dlckNhc2UoKSkgIT0gLTEpIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmlsdGVyIG91dCBvbmx5IC5tcDQnc1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGF0aC5leHRuYW1lKGspID09IFwiLm1wNFwiKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImdldHRpbmcgZHVyYXRpb24gZm9yOiBcIiArIGspO1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgKHBhdGguZXh0bmFtZShrKSA9PSBcIi5tcDRcIikge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vZ2V0IGZpbGUgZHVyYXRpb25cblxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT5cbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmZm1wZWcuZmZwcm9iZShmb2xkZXIgKyBrLCAoZXJyLCBtZXRhKSA9PiB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHt9KTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKG1ldGEuZm9ybWF0LmR1cmF0aW9uKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHF1ZXJ5c3RyaW5nLmVzY2FwZShrKSxcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplOiBudW1lcmFsKGZzLnN0YXRTeW5jKGZvbGRlciArIGspLnNpemUpLmZvcm1hdChcIjAuMDAgYlwiKSxcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHVtYm5haWw6ICFyZXEucXVlcnkuZXh0ZW5zaW9uc1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHF1ZXJ5c3RyaW5nLmVzY2FwZShrICsgXCIudGh1bWIucG5nXCIpXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogcXVlcnlzdHJpbmcuZXNjYXBlKGspLFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBtZXRhLmZvcm1hdC5kdXJhdGlvblxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PlxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBxdWVyeXN0cmluZy5lc2NhcGUoayksXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpemU6IG51bWVyYWwoZnMuc3RhdFN5bmMoZm9sZGVyICsgaykuc2l6ZSkuZm9ybWF0KFwiMC4wMCBiXCIpLFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHVtYm5haWw6ICFyZXEucXVlcnkuZXh0ZW5zaW9uc1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBxdWVyeXN0cmluZy5lc2NhcGUoayArIFwiLnRodW1iLnBuZ1wiKVxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBxdWVyeXN0cmluZy5lc2NhcGUoaylcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50O1xuICAgIC8vICAgICAgICAgICAgICAgICB9KVxuICAgIC8vICAgICAgICAgICAgICkudGhlbigocmVzdWx0czogYW55KSA9PiB7XG4gICAgLy8gICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdHMpO1xuICAgIC8vICAgICAgICAgICAgICAgICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIoayA9PiBrICE9IG51bGwpO1xuICAgIC8vICAgICAgICAgICAgICAgICByZXN1bHRzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhLm5hbWUgPiBiLm5hbWU7XG4gICAgLy8gICAgICAgICAgICAgICAgIH0pO1xuICAgIC8vICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXN1bHRzKTtcbiAgICAvLyAgICAgICAgICAgICB9KTtcbiAgICAvLyAgICAgICAgIH0sXG4gICAgLy8gICAgICAgICBlcnJvciA9PiB7XG4gICAgLy8gICAgICAgICAgICAgLy8gdGhyb3cgZXJyO1xuICAgIC8vICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5zZW5kKFwiQ291bGRudCBzdGF0IGZvbGRlciAuL3VwbG9hZHNcIik7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgICk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyBhcHAuZ2V0KFwiL2dhbGxlcnlcIiwgKHJlcSwgcmVzKSA9PiB7XG4gICAgLy8gICAgIHZhciBmb2xkZXIgPSBcIi4vdXBsb2Fkcy9cIjtcblxuICAgIC8vICAgICB2YXIgZXh0ZW5zaW9uczogc3RyaW5nW10gPSBbXTtcblxuICAgIC8vICAgICBpZiAocmVxLnF1ZXJ5LmV4dGVuc2lvbnMpIHtcbiAgICAvLyAgICAgICAgIGV4dGVuc2lvbnMgPSByZXEucXVlcnkuZXh0ZW5zaW9ucy5zcGxpdChcIixcIik7XG4gICAgLy8gICAgIH1cblxuICAgIC8vICAgICBpZiAoZXh0ZW5zaW9ucy5sZW5ndGggPD0gMCkgZXh0ZW5zaW9ucyA9IFtcIi5tcDRcIl07XG5cbiAgICAvLyAgICAgZnVuY3Rpb24gcmVhZEZpbGVzKGRpcm5hbWUsIG9uRmlsZUNvbnRlbnQsIG9uRXJyb3IpIHtcbiAgICAvLyAgICAgICAgIGZzLnJlYWRkaXIoZGlybmFtZSwgKGVyciwgZmlsZW5hbWVzKSA9PiB7XG4gICAgLy8gICAgICAgICAgICAgaWYgKGVycikge1xuICAgIC8vICAgICAgICAgICAgICAgICBvbkVycm9yKGVycik7XG4gICAgLy8gICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAvLyAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICAgICAgcmV0dXJuIG9uRmlsZUNvbnRlbnQoZmlsZW5hbWVzKTtcbiAgICAvLyAgICAgICAgIH0pO1xuICAgIC8vICAgICB9XG4gICAgLy8gICAgIHJlYWRGaWxlcyhcbiAgICAvLyAgICAgICAgIGZvbGRlcixcbiAgICAvLyAgICAgICAgIChmaWxlbmFtZXMsIGNvbnRlbnQpID0+IHtcbiAgICAvLyAgICAgICAgICAgICB2YXIgZmlsZXNJbmZvID0gW107XG4gICAgLy8gICAgICAgICAgICAgdmFyIGN1cnJlbnQ6IGFueSA9IFByb21pc2UucmVzb2x2ZSgpO1xuXG4gICAgLy8gICAgICAgICAgICAgUHJvbWlzZS5hbGwoXG4gICAgLy8gICAgICAgICAgICAgICAgIGZpbGVuYW1lcy5tYXAoKGs6IHN0cmluZykgPT4ge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQudGhlbigoKSA9PiB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4dGVuc2lvbnMuaW5kZXhPZihwYXRoLmV4dG5hbWUoaykudG9Mb3dlckNhc2UoKSkgIT0gLTEpIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmlsdGVyIG91dCBvbmx5IC5tcDQnc1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGF0aC5leHRuYW1lKGspID09IFwiLm1wNFwiKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImdldHRpbmcgZHVyYXRpb24gZm9yOiBcIiArIGspO1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgKHBhdGguZXh0bmFtZShrKSA9PSBcIi5tcDRcIikge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vZ2V0IGZpbGUgZHVyYXRpb25cblxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT5cbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmZm1wZWcuZmZwcm9iZShmb2xkZXIgKyBrLCAoZXJyLCBtZXRhKSA9PiB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHt9KTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKG1ldGEuZm9ybWF0LmR1cmF0aW9uKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHF1ZXJ5c3RyaW5nLmVzY2FwZShrKSxcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplOiBudW1lcmFsKGZzLnN0YXRTeW5jKGZvbGRlciArIGspLnNpemUpLmZvcm1hdChcIjAuMDAgYlwiKSxcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHVtYm5haWw6ICFyZXEucXVlcnkuZXh0ZW5zaW9uc1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHF1ZXJ5c3RyaW5nLmVzY2FwZShrICsgXCIudGh1bWIucG5nXCIpXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogcXVlcnlzdHJpbmcuZXNjYXBlKGspLFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBtZXRhLmZvcm1hdC5kdXJhdGlvblxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PlxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBxdWVyeXN0cmluZy5lc2NhcGUoayksXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpemU6IG51bWVyYWwoZnMuc3RhdFN5bmMoZm9sZGVyICsgaykuc2l6ZSkuZm9ybWF0KFwiMC4wMCBiXCIpLFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHVtYm5haWw6ICFyZXEucXVlcnkuZXh0ZW5zaW9uc1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBxdWVyeXN0cmluZy5lc2NhcGUoayArIFwiLnRodW1iLnBuZ1wiKVxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBxdWVyeXN0cmluZy5lc2NhcGUoaylcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50O1xuICAgIC8vICAgICAgICAgICAgICAgICB9KVxuICAgIC8vICAgICAgICAgICAgICkudGhlbigocmVzdWx0czogYW55KSA9PiB7XG4gICAgLy8gICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdHMpO1xuICAgIC8vICAgICAgICAgICAgICAgICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIoayA9PiBrICE9IG51bGwpO1xuICAgIC8vICAgICAgICAgICAgICAgICByZXN1bHRzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhLm5hbWUgPiBiLm5hbWU7XG4gICAgLy8gICAgICAgICAgICAgICAgIH0pO1xuICAgIC8vICAgICAgICAgICAgICAgICByZXMuc2VuZChyZXN1bHRzKTtcbiAgICAvLyAgICAgICAgICAgICB9KTtcbiAgICAvLyAgICAgICAgIH0sXG4gICAgLy8gICAgICAgICBlcnJvciA9PiB7XG4gICAgLy8gICAgICAgICAgICAgLy8gdGhyb3cgZXJyO1xuICAgIC8vICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5zZW5kKFwiQ291bGRudCBzdGF0IGZvbGRlciAuL3VwbG9hZHNcIik7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgICk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyBhcHAucG9zdChcIi91cGxvYWRcIiwgKHJlcSwgcmVzKSA9PiB7XG4gICAgLy8gICAgIHZhciBidXNib3kgPSBuZXcgQnVzYm95KHsgaGVhZGVyczogcmVxLmhlYWRlcnMgfSk7XG4gICAgLy8gICAgIHZhciBmaWxlUGF0aCA9IFwiXCI7XG4gICAgLy8gICAgIHZhciBmb2xkZXIgPSBcIi4vdXBsb2Fkcy9cIjtcbiAgICAvLyAgICAgdmFyIHZmaWxlbmFtZSA9IFwiXCI7XG4gICAgLy8gICAgIGJ1c2JveS5vbihcImZpbGVcIiwgKGZpZWxkbmFtZSwgZmlsZSwgZmlsZW5hbWUsIGVuY29kaW5nLCBtaW1ldHlwZSkgPT4ge1xuICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXG4gICAgLy8gICAgICAgICAgICAgXCJGaWxlIFtcIiArXG4gICAgLy8gICAgICAgICAgICAgZmllbGRuYW1lICtcbiAgICAvLyAgICAgICAgICAgICBcIl06IGZpbGVuYW1lOiBcIiArXG4gICAgLy8gICAgICAgICAgICAgZmlsZW5hbWUgK1xuICAgIC8vICAgICAgICAgICAgIFwiLCBlbmNvZGluZzogXCIgK1xuICAgIC8vICAgICAgICAgICAgIGVuY29kaW5nICtcbiAgICAvLyAgICAgICAgICAgICBcIiwgbWltZXR5cGU6IFwiICtcbiAgICAvLyAgICAgICAgICAgICBtaW1ldHlwZVxuICAgIC8vICAgICAgICAgKTtcbiAgICAvLyAgICAgICAgIGZpbGVuYW1lID0gc2FuaXRpemUoZmlsZW5hbWUpO1xuICAgIC8vICAgICAgICAgdmFyIHNhdmVUbyA9IHBhdGguam9pbihcIi4vdXBsb2Fkcy9cIiwgcGF0aC5iYXNlbmFtZShmaWxlbmFtZSkpO1xuICAgIC8vICAgICAgICAgdmZpbGVuYW1lID0gZmlsZW5hbWU7XG4gICAgLy8gICAgICAgICBmaWxlUGF0aCA9IHNhdmVUbztcbiAgICAvLyAgICAgICAgIGZpbGUucGlwZShmcy5jcmVhdGVXcml0ZVN0cmVhbShzYXZlVG8pKTtcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gICAgIGJ1c2JveS5vbihcImZpbmlzaFwiLCAoKSA9PiB7XG4gICAgLy8gICAgICAgICB2YXIgdGh1bWJQYXRoID0gZmlsZVBhdGggKyBcIi50aHVtYi5wbmdcIjtcbiAgICAvLyAgICAgICAgIC8vIHJlcy53cml0ZUhlYWQoMjAwLCB7ICdDb25uZWN0aW9uJzogJ2Nsb3NlJyB9KTtcbiAgICAvLyAgICAgICAgIC8vIHJlcy5lbmQoXCJUaGF0J3MgYWxsIGZvbGtzIVwiKTtcbiAgICAvLyAgICAgICAgIC8vIHRodW1ibGVyLmV4dHJhY3QoZmlsZVBhdGgsICcwMDowMDoxMCcsICcyMDB4MTI1JywgZnVuY3Rpb24gKCkge1xuICAgIC8vICAgICAgICAgLy8gICAgIC8vIGNvbnNvbGUubG9nKCdzbmFwc2hvdCBzYXZlZCB0byBzbmFwc2hvdC5wbmcgKDIwMHgxMjUpIHdpdGggYSBmcmFtZSBhdCAwMDowMDoyMicpO1xuICAgIC8vICAgICAgICAgLy8gICAgIHJlcy5qc29uKHsgc3RhdHVzOiBcInN1Y2NlZWRlZFwiLCBmaWxlcGF0aDogZmlsZVBhdGgsIHRodW1ibmFpbDogdGh1bWJQYXRoIH0pO1xuICAgIC8vICAgICAgICAgLy8gfSk7XG4gICAgLy8gICAgICAgICBpZiAocGF0aC5leHRuYW1lKGZpbGVQYXRoKSA9PSBcIi5tcDRcIikge1xuICAgIC8vICAgICAgICAgICAgIC8vc2NyZWVuc2hvdHMgZm9yIC5tcDQncyBvbmx5XG4gICAgLy8gICAgICAgICAgICAgZmZtcGVnKGZpbGVQYXRoKVxuICAgIC8vICAgICAgICAgICAgICAgICAub24oXCJmaWxlbmFtZXNcIiwgZmlsZW5hbWVzID0+IHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiV2lsbCBnZW5lcmF0ZSBcIiArIGZpbGVuYW1lcy5qb2luKFwiLCBcIikpO1xuICAgIC8vICAgICAgICAgICAgICAgICB9KVxuICAgIC8vICAgICAgICAgICAgICAgICAub24oXCJlbmRcIiwgKCkgPT4ge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTY3JlZW5zaG90cyB0YWtlblwiKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHJlcy5qc29uKHsgc3RhdHVzOiBcInN1Y2NlZWRlZFwiLCBmaWxlcGF0aDogZmlsZVBhdGgsIHRodW1ibmFpbDogdGh1bWJQYXRoIH0pO1xuICAgIC8vICAgICAgICAgICAgICAgICB9KVxuICAgIC8vICAgICAgICAgICAgICAgICAuc2NyZWVuc2hvdHMoe1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gV2lsbCB0YWtlIHNjcmVlbnMgYXQgMjAlLCA0MCUsIDYwJSBhbmQgODAlIG9mIHRoZSB2aWRlb1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wczogW1wiNTAlXCJdLFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWU6IHZmaWxlbmFtZSArIFwiLnRodW1iLnBuZ1wiLFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgZm9sZGVyOiBmb2xkZXIsXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBzaXplOiBcIjIwMHgxMjVcIlxuICAgIC8vICAgICAgICAgICAgICAgICB9KTtcbiAgICAvLyAgICAgICAgIH0gZWxzZSB7XG4gICAgLy8gICAgICAgICAgICAgcmVzLmpzb24oeyBzdGF0dXM6IFwic3VjY2VlZGVkXCIsIGZpbGVwYXRoOiBmaWxlUGF0aCwgdGh1bWJuYWlsOiBmaWxlUGF0aCB9KTtcbiAgICAvLyAgICAgICAgIH1cblxuICAgIC8vICAgICAgICAgLy8gZmZtcGVnKCcvcGF0aC90by92aWRlby5hdmknKVxuICAgIC8vICAgICAgICAgLy8gICAgIC5zY3JlZW5zaG90cyh7XG4gICAgLy8gICAgICAgICAvLyAgICAgICAgIHRpbWVzdGFtcHM6IFszMC41LCAnNTAlJywgJzAxOjEwLjEyMyddLFxuICAgIC8vICAgICAgICAgLy8gICAgICAgICBmaWxlbmFtZTogJ3RodW1ibmFpbC1hdC0lcy1zZWNvbmRzLnBuZycsXG4gICAgLy8gICAgICAgICAvLyAgICAgICAgIGZvbGRlcjogJy9wYXRoL3RvL291dHB1dCcsXG4gICAgLy8gICAgICAgICAvLyAgICAgICAgIHNpemU6ICczMjB4MjQwJ1xuICAgIC8vICAgICAgICAgLy8gICAgIH0pO1xuICAgIC8vICAgICB9KTtcbiAgICAvLyAgICAgcmV0dXJuIHJlcS5waXBlKGJ1c2JveSk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyBhcHAuZ2V0KFwiL3VwbG9hZFwiLCAocmVxLCByZXMpID0+IHtcbiAgICAvLyAgICAgdmFyIGZpbGVuYW1lID0gcmVxLnF1ZXJ5LmZpbGVuYW1lO1xuICAgIC8vICAgICB2YXIgZmlsZXBhdGggPSBfX2Rpcm5hbWUgKyBcIi91cGxvYWRzL1wiICsgZmlsZW5hbWU7XG5cbiAgICAvLyAgICAgY29uc29sZS5sb2coXCJyZWFkaW5nOiBcIiwgZmlsZXBhdGgpO1xuICAgIC8vICAgICAvLyB2YXIgZnMgPSByZXF1aXJlKCdmcycpO1xuICAgIC8vICAgICB2YXIgc3RhdCA9IGZzLnN0YXRTeW5jKGZpbGVwYXRoKTtcbiAgICAvLyAgICAgLy8gcmVzLndyaXRlSGVhZCgyMDAsIHtcbiAgICAvLyAgICAgLy8gICBcIkNvbnRlbnQtVHlwZVwiOiBcInZpZGVvL21wNFwiLFxuICAgIC8vICAgICAvLyAgIFwiQ29udGVudC1MZW5ndGhcIjogc3RhdC5zaXplXG4gICAgLy8gICAgIC8vIH0pO1xuXG4gICAgLy8gICAgIGNvbnNvbGUubG9nKFwiZmlsZSBzdGF0czogXCIsIHN0YXQpO1xuXG4gICAgLy8gICAgIC8vZGVmaW5lIGZpbGUgcGF0aCx0aW1lIHRvIHNlZWsgdGhlIGJlZWdpbmluZyBhbmQgc2V0IGZmbXBlZyBiaW5hcnlcbiAgICAvLyAgICAgLy8gdmFyIHBhdGhUb01vdmllID0gJy4uL3ZpZGVvcy90ZXN0Lm1wNCc7XG4gICAgLy8gICAgIC8vIHZhciBzZWVrdGltZSA9IDEwMDtcbiAgICAvLyAgICAgLy8gcHJvYy5zZXRGZm1wZWdQYXRoKF9fZGlybmFtZSArIFwiL2ZmbXBlZy9mZm1wZWdcIik7XG5cbiAgICAvLyAgICAgLy8gLy9lbmNvZGluZyB0aGUgdmlkZW8gc291cmNlXG4gICAgLy8gICAgIC8vIHZhciBwcm9jID0gbmV3IGZmbXBlZyh7c291cmNlOiBwYXRoVG9Nb3ZpZX0pXG4gICAgLy8gICAgIC8vICAgICAgICAuc2Vla0lucHV0KHNlZWt0aW1lKVxuICAgIC8vICAgICAvLyAgICAgICAgLndpdGhWaWRlb0JpdHJhdGUoMTAyNClcbiAgICAvLyAgICAgLy8gICAgICAgIC53aXRoVmlkZW9Db2RlYygnbGlieDI2NCcpXG4gICAgLy8gICAgIC8vICAgICAgICAud2l0aEFzcGVjdCgnMTY6OScpXG4gICAgLy8gICAgIC8vICAgICAgICAud2l0aEZwcygyNClcbiAgICAvLyAgICAgLy8gICAgICAgIC53aXRoQXVkaW9CaXRyYXRlKCcxMjhrJylcbiAgICAvLyAgICAgLy8gICAgICAgIC53aXRoQXVkaW9Db2RlYygnbGliZmFhYycpXG4gICAgLy8gICAgIC8vICAgICAgICAudG9Gb3JtYXQoJ21wNCcpO1xuXG4gICAgLy8gICAgIC8vIC8vcGlwZVxuICAgIC8vICAgICAvLyAgICAgICAgcmVzLnBpcGUocmVzLCB7ZW5kOiB0cnVlfSk7XG5cbiAgICAvLyAgICAgLy8gY29uc29sZS5sb2cocmVxLnBhcmFtcyk7XG4gICAgLy8gICAgIC8vIHJlcy5qc29uKHsgZmlsZXBhdGg6IHJlcS5xdWVyeVtcImZpbGVuYW1lXCJdIH0pO1xuICAgIC8vICAgICAvLyBjb25zb2xlLmxvZyhcInNlbmRpbmcgZmlsZTogXCIsIGZpbGVuYW1lKTtcblxuICAgIC8vICAgICAvLyByZXMuZG93bmxvYWQoZmlsZXBhdGgsIGZpbGVuYW1lKTtcblxuICAgIC8vICAgICB2YXIgbWltZVR5cGVzID0ge1xuICAgIC8vICAgICAgICAgaHRtbDogXCJ0ZXh0L2h0bWw7IGNoYXJzZXQ9dXRmLThcIixcbiAgICAvLyAgICAgICAgIGpwZWc6IFwiaW1hZ2UvanBlZ1wiLFxuICAgIC8vICAgICAgICAganBnOiBcImltYWdlL2pwZWdcIixcbiAgICAvLyAgICAgICAgIHBuZzogXCJpbWFnZS9wbmdcIixcbiAgICAvLyAgICAgICAgIGpzOiBcInRleHQvamF2YXNjcmlwdFwiLFxuICAgIC8vICAgICAgICAgY3NzOiBcInRleHQvY3NzXCIsXG4gICAgLy8gICAgICAgICBtcDQ6IFwidmlkZW8vbXA0XCJcbiAgICAvLyAgICAgfTtcblxuICAgIC8vICAgICAvLyBpZiAoc3RhdC5pc0ZpbGUoKSkge1xuICAgIC8vICAgICAvLyAgIHZhciBleHRlbnNpb24gPSBwYXRoLmV4dG5hbWUoZmlsZW5hbWUpLnNwbGl0KCcuJykucmV2ZXJzZSgpWzBdO1xuICAgIC8vICAgICAvLyAgIGlmIChleHRlbnNpb24gPT09ICdtcDQnKSB7XG4gICAgLy8gICAgIC8vICAgICAvLyBnb3R0YSBjaHVuayB0aGUgcmVzcG9uc2UgaWYgc2VydmluZyBhbiBtcDRcbiAgICAvLyAgICAgLy8gICAgIHZhciByYW5nZSA9IHJlcS5oZWFkZXJzLnJhbmdlIHx8IFwiXCI7XG4gICAgLy8gICAgIC8vICAgICB2YXIgcGFydHMgPSByYW5nZS5yZXBsYWNlKC9ieXRlcz0vLCBcIlwiKS5zcGxpdChcIi1cIik7XG4gICAgLy8gICAgIC8vICAgICB2YXIgcGFydGlhbHN0YXJ0ID0gcGFydHNbMF07XG4gICAgLy8gICAgIC8vICAgICB2YXIgcGFydGlhbGVuZCA9IHBhcnRzWzFdO1xuICAgIC8vICAgICAvLyAgICAgdmFyIHRvdGFsID0gc3RhdC5zaXplO1xuICAgIC8vICAgICAvLyAgICAgdmFyIHN0YXJ0ID0gcGFyc2VJbnQocGFydGlhbHN0YXJ0LCAxMCk7XG4gICAgLy8gICAgIC8vICAgICB2YXIgZW5kID0gcGFydGlhbGVuZCA/IHBhcnNlSW50KHBhcnRpYWxlbmQsIDEwKSA6IHRvdGFsIC0gMTtcbiAgICAvLyAgICAgLy8gICAgIHZhciBjaHVua3NpemUgPSAoZW5kIC0gc3RhcnQpICsgMTtcbiAgICAvLyAgICAgLy8gICAgIHZhciBtaW1lVHlwZSA9IG1pbWVUeXBlc1tleHRlbnNpb25dIHx8ICd0ZXh0L3BsYWluOyBjaGFyc2V0PXV0Zi04JztcbiAgICAvLyAgICAgLy8gICAgIHJlcy53cml0ZUhlYWQoMjA2LCB7XG4gICAgLy8gICAgIC8vICAgICAgICdDb250ZW50LVJhbmdlJzogJ2J5dGVzICcgKyBzdGFydCArICctJyArIGVuZCArICcvJyArIHRvdGFsLFxuICAgIC8vICAgICAvLyAgICAgICAnQWNjZXB0LVJhbmdlcyc6ICdieXRlcycsXG4gICAgLy8gICAgIC8vICAgICAgICdDb250ZW50LUxlbmd0aCc6IGNodW5rc2l6ZSxcbiAgICAvLyAgICAgLy8gICAgICAgJ0NvbnRlbnQtVHlwZSc6IG1pbWVUeXBlXG4gICAgLy8gICAgIC8vICAgICB9KTtcbiAgICAvLyAgICAgLy8gICAgIHZhciBmaWxlU3RyZWFtID0gZnMuY3JlYXRlUmVhZFN0cmVhbShmaWxlcGF0aCwge1xuICAgIC8vICAgICAvLyAgICAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAvLyAgICAgLy8gICAgICAgICBlbmQ6IGVuZFxuICAgIC8vICAgICAvLyAgICAgfSk7XG4gICAgLy8gICAgIC8vICAgICBmaWxlU3RyZWFtLnBpcGUocmVzKTtcbiAgICAvLyAgICAgLy8gICAgIHJlcy5vbignY2xvc2UnLCBmdW5jdGlvbigpIHtcbiAgICAvLyAgICAgLy8gICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlIGNsb3NlZCcpO1xuICAgIC8vICAgICAvLyAgICAgICBpZiAocmVzLmZpbGVTdHJlYW0pIHtcbiAgICAvLyAgICAgLy8gICAgICAgICAgIHJlcy5maWxlU3RyZWFtLnVucGlwZSh0aGlzKTtcbiAgICAvLyAgICAgLy8gICAgICAgICAgIGlmICh0aGlzLmZpbGVTdHJlYW0uZmQpIHtcbiAgICAvLyAgICAgLy8gICAgICAgICAgICAgICBmcy5jbG9zZSh0aGlzLmZpbGVTdHJlYW0uZmQpO1xuICAgIC8vICAgICAvLyAgICAgICAgICAgfVxuICAgIC8vICAgICAvLyAgICAgICB9XG4gICAgLy8gICAgIC8vICAgICB9KTtcbiAgICAvLyAgICAgLy8gICB9IGVsc2Uge1xuICAgIC8vICAgICAvLyAgICAgdmFyIG1pbWVUeXBlID0gbWltZVR5cGVzW2V4dGVuc2lvbl0gfHwgJ3RleHQvcGxhaW47IGNoYXJzZXQ9dXRmLTgnO1xuICAgIC8vICAgICAvLyAgICAgcmVzLndyaXRlSGVhZCgyMDAsIHsnQ29udGVudC1UeXBlJzogbWltZVR5cGV9KTtcbiAgICAvLyAgICAgLy8gICAgIHZhciBmaWxlU3RyZWFtID0gZnMuY3JlYXRlUmVhZFN0cmVhbShmaWxlcGF0aCk7XG4gICAgLy8gICAgIC8vICAgICBmaWxlU3RyZWFtLnBpcGUocmVzKTtcbiAgICAvLyAgICAgLy8gICB9XG5cbiAgICAvLyAgICAgLy8gfVxuICAgIC8vICAgICB2YXIgc3RyZWFtID0gZnMuY3JlYXRlUmVhZFN0cmVhbShmaWxlcGF0aCwgeyBidWZmZXJTaXplOiA2NCAqIDEwMjQgfSk7XG4gICAgLy8gICAgIHN0cmVhbS5waXBlKHJlcyk7XG5cbiAgICAvLyAgICAgdmFyIGhhZF9lcnJvciA9IGZhbHNlO1xuICAgIC8vICAgICBzdHJlYW0ub24oXCJlcnJvclwiLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgLy8gICAgICAgICBoYWRfZXJyb3IgPSB0cnVlO1xuICAgIC8vICAgICB9KTtcbiAgICAvLyAgICAgLy8gc3RyZWFtLm9uKCdjbG9zZScsIGZ1bmN0aW9uKCl7XG4gICAgLy8gICAgIC8vICAgaWYgKCFoYWRfZXJyb3IpIGZzLnVubGluaygnPGZpbGVwYXRoPi9leGFtcGxlLnBkZicpO1xuICAgIC8vICAgICAvLyB9KTtcbiAgICAvLyB9KTtcblxuICAgIC8vIGFwcC5nZXQoXCIvcmVwZWF0UlNTRmVlZFwiLCAocmVxRSwgcmVzKSA9PiB7XG5cbiAgICAvLyAgICAgdmFyIHJzc191cmwgPSByZXFFLnF1ZXJ5LnVybDtcbiAgICAvLyAgICAgdmFyIEZlZWRQYXJzZXIgPSByZXF1aXJlKFwiZmVlZHBhcnNlclwiKTtcbiAgICAvLyAgICAgdmFyIHJlcXVlc3QgPSByZXF1aXJlKFwicmVxdWVzdFwiKTsgLy8gZm9yIGZldGNoaW5nIHRoZSBmZWVkXG5cbiAgICAvLyAgICAgdmFyIHJlcSA9IHJlcXVlc3QocnNzX3VybCk7XG4gICAgLy8gICAgIHZhciBmZWVkcGFyc2VyID0gbmV3IEZlZWRQYXJzZXIoKTtcblxuICAgIC8vICAgICByZXEub24oXCJlcnJvclwiLCAoZXJyb3IpID0+IHtcbiAgICAvLyAgICAgICAgIC8vIGhhbmRsZSBhbnkgcmVxdWVzdCBlcnJvcnNcbiAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwicmVxLm9uXCIsIHsgZXJyb3IgfSk7XG4gICAgLy8gICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yIH0pO1xuICAgIC8vICAgICB9KTtcblxuICAgIC8vICAgICByZXEub24oXCJyZXNwb25zZVwiLCBmdW5jdGlvbiAocmVzKSB7XG4gICAgLy8gICAgICAgICB2YXIgc3RyZWFtID0gdGhpczsgLy8gYHRoaXNgIGlzIGByZXFgLCB3aGljaCBpcyBhIHN0cmVhbVxuICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXCJyZXEub25cIiwgeyBzdHJlYW0gfSk7XG5cbiAgICAvLyAgICAgICAgIGlmIChyZXMuc3RhdHVzQ29kZSAhPT0gMjAwKSB7XG4gICAgLy8gICAgICAgICAgICAgdGhpcy5lbWl0KFwiZXJyb3JcIiwgbmV3IEVycm9yKFwiQmFkIHN0YXR1cyBjb2RlXCIpKTtcbiAgICAvLyAgICAgICAgIH0gZWxzZSB7XG4gICAgLy8gICAgICAgICAgICAgc3RyZWFtLnBpcGUoZmVlZHBhcnNlcik7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgIH0pO1xuXG4gICAgLy8gICAgIGZlZWRwYXJzZXIub24oXCJlcnJvclwiLCAoZXJyb3IpID0+IHtcbiAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwicmVxLm9uXCIsIHsgZXJyb3IgfSk7XG5cbiAgICAvLyAgICAgICAgIC8vIGFsd2F5cyBoYW5kbGUgZXJyb3JzXG4gICAgLy8gICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yIH0pO1xuICAgIC8vICAgICB9KTtcblxuICAgIC8vICAgICBmZWVkcGFyc2VyLm9uKFwicmVhZGFibGVcIiwgZnVuY3Rpb24gKCkge1xuICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXCJyZWFkYWJsZVwiKTtcblxuICAgIC8vICAgICAgICAgLy8gVGhpcyBpcyB3aGVyZSB0aGUgYWN0aW9uIGlzIVxuICAgIC8vICAgICAgICAgdmFyIHN0cmVhbSA9IHRoaXM7IC8vIGB0aGlzYCBpcyBgZmVlZHBhcnNlcmAsIHdoaWNoIGlzIGEgc3RyZWFtXG4gICAgLy8gICAgICAgICB2YXIgbWV0YSA9IHRoaXMubWV0YTsgLy8gKipOT1RFKiogdGhlIFwibWV0YVwiIGlzIGFsd2F5cyBhdmFpbGFibGUgaW4gdGhlIGNvbnRleHQgb2YgdGhlIGZlZWRwYXJzZXIgaW5zdGFuY2VcbiAgICAvLyAgICAgICAgIHZhciBpdGVtO1xuXG4gICAgLy8gICAgICAgICAvLyB3aGlsZSAoaXRlbSA9IHN0cmVhbS5yZWFkKCkpIHtcbiAgICAvLyAgICAgICAgIC8vICAgY29uc29sZS5sb2coaXRlbSk7XG4gICAgLy8gICAgICAgICAvLyB9XG4gICAgLy8gICAgICAgICByZXFFLnBpcGUoc3RyZWFtKTtcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyBhcHAucG9zdChcIi9zYXZlU2xvdFwiLCAocmVxLCByZXMpID0+IHtcbiAgICAvLyAgICAgcmV0dXJuIFZpZGVvLmZpbmRPbmUoXG4gICAgLy8gICAgICAgICB7IHRpbWVzdGFtcDogcmVxLmJvZHkudGltZXN0YW1wIH0sXG4gICAgLy8gICAgICAgICBcInRpdGxlIHNjcm9sbGluZ190ZXh0IHZpZGVvIHRpbWVzdGFtcCBjcmVhdGVkX2F0IG1vZGlmaWVkX2F0IGR1cmF0aW9uXCIsXG4gICAgLy8gICAgICAgICBmdW5jdGlvbiAoZXJyLCB2aWRlbykge1xuICAgIC8vICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidmlkZW9cIiwgdmlkZW8pO1xuICAgIC8vICAgICAgICAgICAgIC8vIHJlcy5qc29uKHZpZGVvKTtcbiAgICAvLyAgICAgICAgICAgICB2YXIgdmlkOiBhbnkgPSBudWxsO1xuICAgIC8vICAgICAgICAgICAgIGlmIChlcnIgfHwgdmlkZW8gPT0gbnVsbCkge1xuICAgIC8vICAgICAgICAgICAgICAgICAvLyBuZXcgdmlkZW9cbiAgICAvLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTYXZpbmcgXCIgKyByZXEuYm9keS50aXRsZSArIFwiIGZvciB0aW1lIFwiICsgbW9tZW50KHJlcS5ib2R5LnRpbWVzdGFtcCkpO1xuICAgIC8vICAgICAgICAgICAgICAgICB2aWQgPSBuZXcgVmlkZW8oe1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHJlcS5ib2R5LnRpdGxlLFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsaW5nX3RleHQ6IHJlcS5ib2R5LnNjcm9sbGluZ190ZXh0LFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgdmlkZW86IHJlcS5ib2R5LnZpZGVvLFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiByZXEuYm9keS50aW1lc3RhbXAsXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogcmVxLmJvZHkuZHVyYXRpb24sXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBjcmVhdGVkX2F0OiBuZXcgRGF0ZSgpLFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgbW9kaWZpZWRfYXQ6IG5ldyBEYXRlKClcbiAgICAvLyAgICAgICAgICAgICAgICAgfSk7XG4gICAgLy8gICAgICAgICAgICAgICAgIHJldHVybiB2aWQuc2F2ZShmdW5jdGlvbiAoZXJyKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBpby5lbWl0KFwic2F2ZVNsb3RcIiwgeyBmb3I6IFwiZXZlcnlvbmVcIiwgdmlkZW86IHZpZCB9KTtcblxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQoXCJmYWlsZWQgdG8gc2F2ZVwiKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQoXCJzYXZlZFwiKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgICAgICAgICAgfSk7XG4gICAgLy8gICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgdmlkID0gdmlkZW87XG4gICAgLy8gICAgICAgICAgICAgICAgIHZpZC50aXRsZSA9IHJlcS5ib2R5LnRpdGxlO1xuICAgIC8vICAgICAgICAgICAgICAgICB2aWQuc2Nyb2xsaW5nX3RleHQgPSByZXEuYm9keS5zY3JvbGxpbmdfdGV4dDtcblxuICAgIC8vICAgICAgICAgICAgICAgICB2aWQudGltZXN0YW1wID0gcmVxLmJvZHkudGltZXN0YW1wO1xuICAgIC8vICAgICAgICAgICAgICAgICB2aWQubW9kaWZpZWRfYXQgPSBuZXcgRGF0ZSgpO1xuXG4gICAgLy8gICAgICAgICAgICAgICAgIHZpZC52aWRlbyA9IHJlcS5ib2R5LnZpZGVvO1xuICAgIC8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2aWQudmlkZW8pO1xuICAgIC8vICAgICAgICAgICAgICAgICByZXR1cm4gdmlkLnNhdmUoZnVuY3Rpb24gKGVycikge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQoXCJmYWlsZWQgdG8gc2F2ZVwiKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQoXCJ1cGRhdGVkXCIpO1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgICAgICAgICB9KTtcbiAgICAvLyAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgICk7XG4gICAgLy8gfSk7XG4gICAgLy8gYXBwLmdldChcIi9sb2FkU2xvdFwiLCAocmVxLCByZXMpID0+IHtcbiAgICAvLyAgICAgdmFyIHRpbWUgPSBtb21lbnQocmVxLnF1ZXJ5LnRpbWUpO1xuICAgIC8vICAgICBjb25zb2xlLmxvZyhcImxvYWRTbG90IDpcIiArIHRpbWUuZm9ybWF0KCkgKyBcIiBmcm9tOiBcIiArIHJlcS5xdWVyeS50aW1lKTtcblxuICAgIC8vICAgICAvLyBmaW5kIGVhY2ggcGVyc29uIHdpdGggYSBsYXN0IG5hbWUgbWF0Y2hpbmcgJ0dob3N0Jywgc2VsZWN0aW5nIHRoZSBgbmFtZWAgYW5kIGBvY2N1cGF0aW9uYCBmaWVsZHNcbiAgICAvLyAgICAgcmV0dXJuIFZpZGVvLmZpbmRPbmUoXG4gICAgLy8gICAgICAgICB7IHRpbWVzdGFtcDogdGltZSB9LFxuICAgIC8vICAgICAgICAgXCJ0aXRsZSBzY3JvbGxpbmdfdGV4dCB2aWRlbyB0aW1lc3RhbXAgY3JlYXRlZF9hdCBtb2RpZmllZF9hdCBkdXJhdGlvblwiLFxuICAgIC8vICAgICAgICAgZnVuY3Rpb24gKGVyciwgdmlkZW8pIHtcbiAgICAvLyAgICAgICAgICAgICBpZiAoZXJyIHx8IHZpZGVvID09IG51bGwpIHJldHVybiByZXMuc3RhdHVzKDQwNCkuc2VuZChcImZhaWxlZFwiKTsgLy9yZXR1cm4gaGFuZGxlRXJyb3IoZXJyKTtcbiAgICAvLyAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInZpZGVvXCIsIHZpZGVvKTtcbiAgICAvLyAgICAgICAgICAgICByZXMuanNvbih2aWRlbyk7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgICk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyBhcHAuZ2V0KFwiL2RldmljZXNcIiwgKHJlcSwgcmVzKSA9PiB7XG4gICAgLy8gICAgIC8vIGZpbmQgZWFjaCBwZXJzb24gd2l0aCBhIGxhc3QgbmFtZSBtYXRjaGluZyAnR2hvc3QnLCBzZWxlY3RpbmcgdGhlIGBuYW1lYCBhbmQgYG9jY3VwYXRpb25gIGZpZWxkc1xuICAgIC8vICAgICByZXR1cm4gRGV2aWNlLmZpbmQoXG4gICAgLy8gICAgICAgICB7fSxcbiAgICAvLyAgICAgICAgIFwidXVpZCBsb25naXR1ZGUgbGF0aXR1ZGUgdmVoaWNsZV9ubyBjcmVhdGVkX2F0IG1vZGlmaWVkX2F0XCIsXG4gICAgLy8gICAgICAgICAoZXJyLCBkZXZpY2VzKSA9PiB7XG4gICAgLy8gICAgICAgICAgICAgaWYgKGVyciB8fCBkZXZpY2VzID09IG51bGwpIHJldHVybiByZXMuc3RhdHVzKDQwNCkuc2VuZChcImZhaWxlZFwiKTsgLy9yZXR1cm4gaGFuZGxlRXJyb3IoZXJyKTtcbiAgICAvLyAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRldmljZXNcIiwgZGV2aWNlcyk7XG4gICAgLy8gICAgICAgICAgICAgcmVzLmpzb24oZGV2aWNlcyk7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgICk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyBhcHAuZ2V0KFwiL2xvYWRBbGxTbG90c1wiLCBmdW5jdGlvbiAocmVxLCByZXMpIHtcbiAgICAvLyAgICAgdmFyIHRpbWUgPSBtb21lbnQocmVxLnF1ZXJ5LnRpbWUpO1xuICAgIC8vICAgICBjb25zb2xlLmxvZyhcImxvYWRBbGxTbG90cyA6XCIgKyB0aW1lLmZvcm1hdCgpICsgXCIgZnJvbTogXCIgKyByZXEucXVlcnkudGltZSk7XG5cbiAgICAvLyAgICAgLy8gZmluZCBlYWNoIHBlcnNvbiB3aXRoIGEgbGFzdCBuYW1lIG1hdGNoaW5nICdHaG9zdCcsIHNlbGVjdGluZyB0aGUgYG5hbWVgIGFuZCBgb2NjdXBhdGlvbmAgZmllbGRzXG4gICAgLy8gICAgIHJldHVybiBWaWRlby5maW5kKFxuICAgIC8vICAgICAgICAge30sXG4gICAgLy8gICAgICAgICBcInRpdGxlIHNjcm9sbGluZ190ZXh0IHZpZGVvIHRpbWVzdGFtcCBjcmVhdGVkX2F0IG1vZGlmaWVkX2F0IGR1cmF0aW9uXCIsXG4gICAgLy8gICAgICAgICBmdW5jdGlvbiAoZXJyLCB2aWRlb3MpIHtcbiAgICAvLyAgICAgICAgICAgICBpZiAoZXJyIHx8IHZpZGVvcyA9PSBudWxsKSByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLnNlbmQoXCJmYWlsZWRcIik7IC8vcmV0dXJuIGhhbmRsZUVycm9yKGVycik7XG4gICAgLy8gICAgICAgICAgICAgY29uc29sZS5sb2coXCJ2aWRlb1wiLCB2aWRlb3MpO1xuICAgIC8vICAgICAgICAgICAgIHZhciBuZXd2aWRlb3MgPSB2aWRlb3MubWFwKGsgPT4ge1xuICAgIC8vICAgICAgICAgICAgICAgICAvLzIwMTYtMDUtMjRUMTM6MDk6MzArMDM6MDBcbiAgICAvLyAgICAgICAgICAgICAgICAgLy8gay50aW1lc3RhbXAgPSBtb21lbnQoay50aW1lc3RhbXApLmZvcm1hdChcIkRELU1NLVlZWVkgSEg6bW06c3NcIik7XG4gICAgLy8gICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IG1vbWVudChrLnRpbWVzdGFtcClcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAudG9EYXRlKClcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0VGltZSgpLFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGsudGl0bGUsXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBzY3JvbGxpbmdfdGV4dDogay5zY3JvbGxpbmdfdGV4dCxcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHZpZGVvOiBrLnZpZGVvLFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgY3JlYXRlZF9hdDogay5jcmVhdGVkX2F0LFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgbW9kaWZpZWRfYXQ6IGsubW9kaWZpZWRfYXQsXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogay5kdXJhdGlvblxuICAgIC8vICAgICAgICAgICAgICAgICB9O1xuICAgIC8vICAgICAgICAgICAgIH0pO1xuICAgIC8vICAgICAgICAgICAgIHJlcy5qc29uKG5ld3ZpZGVvcyk7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgICk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyBhcHAuZ2V0KFwiL2xvYWRBbGxOZXdTbG90c1wiLCBmdW5jdGlvbiAocmVxLCByZXMpIHtcbiAgICAvLyAgICAgdmFyIHRpbWUgPSBtb21lbnQocmVxLnF1ZXJ5LnRpbWUpO1xuICAgIC8vICAgICBjb25zb2xlLmxvZyhcImxvYWRBbGxTbG90cyA6XCIgKyB0aW1lLmZvcm1hdCgpICsgXCIgZnJvbTogXCIgKyByZXEucXVlcnkudGltZSk7XG5cbiAgICAvLyAgICAgLy8gZmluZCBlYWNoIHBlcnNvbiB3aXRoIGEgbGFzdCBuYW1lIG1hdGNoaW5nICdHaG9zdCcsIHNlbGVjdGluZyB0aGUgYG5hbWVgIGFuZCBgb2NjdXBhdGlvbmAgZmllbGRzXG4gICAgLy8gICAgIHJldHVybiBWaWRlby5maW5kKFxuICAgIC8vICAgICAgICAgeyB0aW1lc3RhbXA6IHsgJGd0OiBuZXcgRGF0ZSgpIH0gfSxcbiAgICAvLyAgICAgICAgIFwidGl0bGUgc2Nyb2xsaW5nX3RleHQgdmlkZW8gdGltZXN0YW1wIGNyZWF0ZWRfYXQgbW9kaWZpZWRfYXQgZHVyYXRpb25cIixcbiAgICAvLyAgICAgICAgIGZ1bmN0aW9uIChlcnIsIHZpZGVvcykge1xuICAgIC8vICAgICAgICAgICAgIGlmIChlcnIgfHwgdmlkZW9zID09IG51bGwpIHJldHVybiByZXMuc3RhdHVzKDQwNCkuc2VuZChcImZhaWxlZFwiKTsgLy9yZXR1cm4gaGFuZGxlRXJyb3IoZXJyKTtcbiAgICAvLyAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInZpZGVvXCIsIHZpZGVvcyk7XG4gICAgLy8gICAgICAgICAgICAgcmVzLmpzb24odmlkZW9zKTtcbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgKTtcbiAgICAvLyB9KTtcblxuICAgIC8vIGNvbnN0IGRlZmF1bHRTZXR0aW5ncyA9IG5ldyBTZXR0aW5ncyh7XG4gICAgLy8gICAgIGRlZmF1bHRWaWRlbzogXCIvdXBsb2Fkcy9zaWduYWwubXA0XCIsXG4gICAgLy8gICAgIGRlZmF1bHRCYW5uZXI6IFwiL3VwbG9hZHMvYmFubmVycy9iYW5uZXIuanBnXCIsXG4gICAgLy8gICAgIGNyZWF0ZWRfYXQ6IG5ldyBEYXRlKCksXG4gICAgLy8gICAgIG1vZGlmaWVkX2F0OiBuZXcgRGF0ZSgpXG4gICAgLy8gfSk7XG5cbiAgICAvLyBhcHAuZ2V0KFwiL3NldHRpbmdzXCIsIGZ1bmN0aW9uIChyZXEsIHJlcykge1xuICAgIC8vICAgICBjb25zb2xlLmxvZyhcImxvYWRTZXR0aW5ncyA6XCIpO1xuXG4gICAgLy8gICAgIC8vIGZpbmQgZWFjaCBwZXJzb24gd2l0aCBhIGxhc3QgbmFtZSBtYXRjaGluZyAnR2hvc3QnLCBzZWxlY3RpbmcgdGhlIGBuYW1lYCBhbmQgYG9jY3VwYXRpb25gIGZpZWxkc1xuICAgIC8vICAgICByZXR1cm4gU2V0dGluZ3MuZmluZCh7fSwgXCJkZWZhdWx0VmlkZW8gZGVmYXVsdEJhbm5lciBjcmVhdGVkX2F0IG1vZGlmaWVkX2F0XCIsIGZ1bmN0aW9uIChcbiAgICAvLyAgICAgICAgIGVycixcbiAgICAvLyAgICAgICAgIHNldHRpbmdzXG4gICAgLy8gICAgICkge1xuICAgIC8vICAgICAgICAgaWYgKGVyciB8fCBzZXR0aW5ncyA9PSBudWxsKSByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLnNlbmQoXCJmYWlsZWRcIik7IC8vcmV0dXJuIGhhbmRsZUVycm9yKGVycik7XG4gICAgLy8gICAgICAgICAvLyBjb25zb2xlLmxvZygnc2V0dGluZ3MnLCBzZXR0aW5ncykgXG4gICAgLy8gICAgICAgICBpZiAoc2V0dGluZ3MubGVuZ3RoID09IDApIHtcbiAgICAvLyAgICAgICAgICAgICB2YXIgc2V0dGluZyA9IGRlZmF1bHRTZXR0aW5ncztcbiAgICAvLyAgICAgICAgICAgICByZXR1cm4gc2V0dGluZy5zYXZlKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKFwiZmFpbGVkIHRvIHNhdmVcIik7XG4gICAgLy8gICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyByZXMuc2VuZChcInNhdmVkXCIpO1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgcmVzLmpzb24oc2V0dGluZyk7XG4gICAgLy8gICAgICAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgICAgICB9KTtcbiAgICAvLyAgICAgICAgIH0gZWxzZSByZXMuanNvbihzZXR0aW5nc1swXSk7XG4gICAgLy8gICAgIH0pO1xuICAgIC8vIH0pO1xuXG4gICAgLy8gYXBwLnBvc3QoXCIvc2V0dGluZ3NcIiwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKFwic2F2ZVNldHRpbmdzIDpcIik7XG5cbiAgICAvLyAgICAgLy8gZmluZCBlYWNoIHBlcnNvbiB3aXRoIGEgbGFzdCBuYW1lIG1hdGNoaW5nICdHaG9zdCcsIHNlbGVjdGluZyB0aGUgYG5hbWVgIGFuZCBgb2NjdXBhdGlvbmAgZmllbGRzXG4gICAgLy8gICAgIHJldHVybiBTZXR0aW5ncy5maW5kKHt9LCBcImRlZmF1bHRWaWRlbyBkZWZhdWx0QmFubmVyIGNyZWF0ZWRfYXQgbW9kaWZpZWRfYXRcIiwgZnVuY3Rpb24gKFxuICAgIC8vICAgICAgICAgZXJyLFxuICAgIC8vICAgICAgICAgc2V0dGluZ3NcbiAgICAvLyAgICAgKSB7XG4gICAgLy8gICAgICAgICBpZiAoZXJyIHx8IHNldHRpbmdzID09IG51bGwpIHJldHVybiByZXMuc3RhdHVzKDQwNCkuc2VuZChcImZhaWxlZFwiKTsgLy9yZXR1cm4gaGFuZGxlRXJyb3IoZXJyKTtcbiAgICAvLyAgICAgICAgIHZhciBzZXR0aW5nID0gc2V0dGluZ3NbMF07XG4gICAgLy8gICAgICAgICBpZiAoIXNldHRpbmcpIHtcbiAgICAvLyAgICAgICAgICAgICBzZXR0aW5nID0gZGVmYXVsdFNldHRpbmdzO1xuICAgIC8vICAgICAgICAgfVxuXG4gICAgLy8gICAgICAgICAvLyBjb25zb2xlLmxvZygnc2V0dGluZ3MnLCBzZXR0aW5ncykgXG4gICAgLy8gICAgICAgICBzZXR0aW5nLmRlZmF1bHRWaWRlbyA9IHJlcS5ib2R5LmRlZmF1bHRWaWRlbyB8fCBzZXR0aW5nLmRlZmF1bHRWaWRlbztcbiAgICAvLyAgICAgICAgIHNldHRpbmcuZGVmYXVsdEJhbm5lciA9IHJlcS5ib2R5LmRlZmF1bHRCYW5uZXIgfHwgc2V0dGluZy5kZWZhdWx0QmFubmVyO1xuICAgIC8vICAgICAgICAgc2V0dGluZy5tb2RpZmllZF9hdCA9IG5ldyBEYXRlKCk7XG4gICAgLy8gICAgICAgICByZXR1cm4gc2V0dGluZy5zYXZlKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAvLyAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG5cbiAgICAvLyAgICAgICAgICAgICAgICAgcmVzLnNlbmQoXCJmYWlsZWQgdG8gc2F2ZVwiKTtcbiAgICAvLyAgICAgICAgICAgICB9IGVsc2Uge1xuICAgIC8vICAgICAgICAgICAgICAgICAvLyByZXMuc2VuZChcInNhdmVkXCIpO1xuICAgIC8vICAgICAgICAgICAgICAgICBpby5lbWl0KFwic2F2ZVNldHRpbmdzXCIsIHsgZm9yOiBcImV2ZXJ5b25lXCIsIHNldHRpbmc6IHNldHRpbmcgfSk7XG5cbiAgICAvLyAgICAgICAgICAgICAgICAgcmVzLmpzb24oc2V0dGluZyk7XG4gICAgLy8gICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgfSk7XG4gICAgLy8gICAgIH0pO1xuICAgIC8vIH0pO1xuXG4gICAgLy8gYXBwLnBvc3QoXCIvdXBkYXRlRGV2aWNlXCIsIGZ1bmN0aW9uIChyZXEsIHJlcykge1xuICAgIC8vICAgICB2YXIgbG9jaW5mbyA9IHJlcS5ib2R5O1xuICAgIC8vICAgICBjb25zb2xlLmxvZyhcImxvY2F0aW9uIG1lc3NhZ2U6IFwiLCB7IGxvY2luZm8gfSk7XG4gICAgLy8gICAgIGlmIChsb2NpbmZvICYmIGxvY2luZm8udXVpZCkge1xuICAgIC8vICAgICAgICAgLy9jaGVjayBpZiBkZXZpY2UgaW4gREIgYW5kIGlmIG5vdCwgcmVnaXN0ZXIgaXQuXG4gICAgLy8gICAgICAgICBEZXZpY2UuZmluZE9uZShcbiAgICAvLyAgICAgICAgICAgICB7IHV1aWQ6IGxvY2luZm8udXVpZCB9LFxuICAgIC8vICAgICAgICAgICAgIFwidXVpZCBsb25naXR1ZGUgbGF0aXR1ZGUgY3JlYXRlZF9hdCBtb2RpZmllZF9hdFwiLFxuICAgIC8vICAgICAgICAgICAgIGZ1bmN0aW9uIChlcnIsIGRldmljZSkge1xuICAgIC8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRldmljZVwiLCBkZXZpY2UpO1xuICAgIC8vICAgICAgICAgICAgICAgICAvLyByZXMuanNvbih2aWRlbyk7XG4gICAgLy8gICAgICAgICAgICAgICAgIHZhciBkZXY6IGFueSA9IG51bGw7XG4gICAgLy8gICAgICAgICAgICAgICAgIGlmIChlcnIgfHwgZGV2aWNlID09IG51bGwpIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIC8vIG5ldyBkZXZpY2VcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWRkaW5nIGRldmljZSBcIiArIGxvY2luZm8udXVpZCArIFwiIGF0IGxvY2F0aW9uIFwiLCB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgbGF0OiBsb2NpbmZvLmxhdGl0dWRlLFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIGxuZzogbG9jaW5mby5sb25naXR1ZGVcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgZGV2ID0gbmV3IERldmljZSh7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgdXVpZDogbG9jaW5mby51dWlkLFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIGxvbmdpdHVkZTogbG9jaW5mby5sb25naXR1ZGUsXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgbGF0aXR1ZGU6IGxvY2luZm8ubGF0aXR1ZGUsXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlZF9hdDogbmV3IERhdGUoKSxcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBtb2RpZmllZF9hdDogbmV3IERhdGUoKVxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBkZXYuc2F2ZShmdW5jdGlvbiAoZXJyKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgaW8uZW1pdChcInVwZGF0ZURldmljZVwiLCB7IGZvcjogXCJldmVyeW9uZVwiLCBkZXZpY2U6IGRldiB9KTtcblxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLndyaXRlKFwiZmFpbGVkIHRvIHNhdmVcIik7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLndyaXRlKFwic2F2ZWRcIik7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2F2ZWRcIiwgeyBkZXYgfSk7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgLy8gICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBkZXYgPSBkZXZpY2U7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBkZXYubG9uZ2l0dWRlID0gbG9jaW5mby5sb25naXR1ZGU7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBkZXYubGF0aXR1ZGUgPSBsb2NpbmZvLmxhdGl0dWRlO1xuXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyB2aWQudGltZXN0YW1wID0gcmVxLmJvZHkudGltZXN0YW1wO1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgZGV2Lm1vZGlmaWVkX2F0ID0gbmV3IERhdGUoKTtcblxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gdmlkLnZpZGVvID0gcmVxLmJvZHkudmlkZW87XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh2aWQudmlkZW8pO1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgZGV2LnNhdmUoZnVuY3Rpb24gKGVycikge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLndyaXRlKFwiZmFpbGVkIHRvIHNhdmVcIik7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYXZlZFwiLCB7IGRldiB9KTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLndyaXRlKFwidXBkYXRlZFwiKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAvLyAgICAgICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgICk7XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgcmVzLndyaXRlKFwiaW52YWxpZFwiKTtcbiAgICAvLyB9KTtcblxuICAgIC8vIC8vIFNlcnZlIGluZGV4IHBhZ2VcbiAgICAvLyBhcHAuZ2V0KFwiKlwiLCBmdW5jdGlvbiAocmVxLCByZXMpIHtcbiAgICAvLyAgICAgcmVzLnNlbmRGaWxlKF9fZGlybmFtZSArIFwiL2J1aWxkL2luZGV4Lmh0bWxcIik7XG4gICAgLy8gfSk7XG5cbiAgICAvLyAvLyBhcHAucG9zdCgnL3VwbG9hZCcsIHVwbG9hZC5zaW5nbGUoXCJwaG90b1wiKSwgZnVuY3Rpb24gKHJlcSwgcmVzKSB7XG4gICAgLy8gLy8gICAvLyBUaGlzIGJsb2NrIGlzIG9ubHkgcmVsZXZhbnQgdG8gdXNlcnNcbiAgICAvLyAvLyAgIC8vIGludGVyZXN0ZWQgaW4gY3VzdG9tIHBhcmFtZXRlcnMgLSB5b3VcbiAgICAvLyAvLyAgIC8vIGNhbiBkZWxldGUvaWdub3JlIGl0IGFzIHlvdSB3aXNoXG4gICAgLy8gLy8gICBpZiAocmVxLmJvZHkpIHtcbiAgICAvLyAvLyAgICAgY29uc29sZS5kaXIocmVxLmJvZHkpO1xuICAgIC8vIC8vICAgfVxuXG4gICAgLy8gLy8gICByZXMuc2VuZFN0YXR1cygyMDApO1xuICAgIC8vIC8vIH0pO1xuXG4gICAgLy8gYXBwLnBvc3QoXCIvbGFuZGluZ1wiLCBmdW5jdGlvbiAocmVxLCByZXMpIHtcbiAgICAvLyAgICAgcmVzLmpzb24oe1xuICAgIC8vICAgICAgICAgdGl0bGU6IFwiTGFuZGluZyBQYWdlXCJcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyBhcHAucG9zdChcIi9ob21lXCIsIGZ1bmN0aW9uIChyZXEsIHJlcykge1xuICAgIC8vICAgICByZXMuanNvbih7XG4gICAgLy8gICAgICAgICB0aXRsZTogXCJIb21lIFBhZ2VcIlxuICAgIC8vICAgICB9KTtcbiAgICAvLyB9KTtcblxufVxuIl19