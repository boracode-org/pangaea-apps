import express = require("express");
var process = require("process");
var app = express();
var path = require("path"),
  multer = require("multer"),
  bodyParser = require("body-parser"),
  MulterImpl = require("./multerImpl");
var numeral = require("numeral");
var sanitize = require("sanitize-filename");
var querystring = require("querystring");

var http = require("http"),
  os = require("os"),
  fs = require("fs");

var Busboy = require("busboy");
var moment = require("moment");

import httpServer = require("http");
import socket_io = require("socket.io");

import * as Parse from "parse";
import { CONSTANTS } from "server/CONSTANTS";

(Parse as any).serverURL = CONSTANTS.SERVER_URL;
Parse.initialize(CONSTANTS.APP_ID, undefined, CONSTANTS.MASTER_KEY);

// var mongoose = require("mongoose");

export function enableVideoApi(app: express.Application) {
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
    socket.on("device_location", async locinfo => {
      console.log("location message: ", { locinfo });
      if (locinfo.uuid) {
        //check if device in DB and if not, register it.

        try {
          var device: Parse.Object = await new Parse.Query("Devices").get(locinfo.uuid);
          console.log("device", device);

          if (!device) {
            console.log("Adding device " + locinfo.uuid + " at location ", {
              lat: locinfo.latitude,
              lng: locinfo.longitude
            });
            device = new Parse.Object("Devices");
            device.set("uuid", locinfo.uuid);
            device.set("location", new Parse.GeoPoint({ latitude: locinfo.latitude, longitude: locinfo.longitude }));
            await device.save(null);
          }
          //Emit to all listeners
          io.emit("updateDevice", { for: "everyone", device });
          console.log("Device saved:", device);
        } catch (e) {
          console.log("Failed to save device:", locinfo);
        }
      }
    });
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
