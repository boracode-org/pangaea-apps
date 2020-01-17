"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var express = require("express");
var process = require("process");
var app = express();
var path = require("path");
// import     MulterImpl = require("./multerImpl");
var numeral = require("numeral");
var querystring = require("querystring");
var ffmpeg = require("fluent-ffmpeg");
var mime = require("mime-types");
var http = require("http"), os = require("os"), fs = require("fs");
var Busboy = require("busboy");
var moment = require("moment");
var Constants_1 = require("../Constants");
var uploadFolder = path.resolve(Constants_1.CONSTANTS.UPLOAD_FOLDER + "/../files/uploads");
function readFiles(dirname) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (res, rej) {
                    return fs.readdir(dirname, function (err, filenames) {
                        if (err) {
                            return rej(err);
                        }
                        return res(filenames);
                    });
                })];
        });
    });
}
Parse.Cloud.afterSave("Media", function (request) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    var video, processedDate, processed, updatedAt, vidFile, filename, saveTo, filePath, thumbPath;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                video = request.object;
                processedDate = video.get("videoProcessedAt") || new Date();
                processed = video.get("processed");
                updatedAt = video.updatedAt;
                processedDate.setMilliseconds(0);
                updatedAt.setMilliseconds(0);
                if (!(!processed || processedDate < updatedAt)) return [3 /*break*/, 3];
                console.log("Processing media", video);
                vidFile = "";
                filename = video.get("file") ? video.get("file").name() : "";
                saveTo = path.join(uploadFolder, path.basename(filename));
                filePath = path.join(uploadFolder, filename);
                thumbPath = filePath + ".thumb.png";
                if (!(path.extname(filePath) == ".mp4")) return [3 /*break*/, 1];
                //screenshots for .mp4's only
                ffmpeg(filePath)
                    .on("filenames", function (filenames) {
                    console.log("Will generate " + filenames.join(", "));
                })
                    .on("end", function () { return __awaiter(_this, void 0, void 0, function () {
                    var props;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log("Screenshots taken");
                                return [4 /*yield*/, new Promise(function (resolve, reject) {
                                        return ffmpeg.ffprobe(filePath, function (err, meta) {
                                            if (err) {
                                                console.log(err);
                                                return reject(err);
                                            }
                                            else {
                                                console.dir(meta.format.duration);
                                                return resolve({
                                                    name: filename,
                                                    size: numeral(fs.statSync(filePath).size).format("0.00 b"),
                                                    thumbnail: querystring.escape(filename + ".thumb.png"),
                                                    duration: meta.format.duration
                                                });
                                            }
                                        });
                                    })];
                            case 1:
                                props = _a.sent();
                                video.set("video_duration", props.duration);
                                video.set("title", video.get("title") || filename.match(/_(.*)\./).pop());
                                video.set("video_thumbnail", Parse.File.fromJSON({ __type: "File", name: props.thumbnail, url: "http://" + props.thumbnail }));
                                video.set("video_size", props.size);
                                video.set("videoProcessedAt", new Date());
                                video.set("processed", true);
                                video.set("type", mime.lookup(filePath));
                                return [4 /*yield*/, video.save(null, { useMasterKey: true })];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); })
                    .screenshots({
                    // Will take screens at 20%, 40%, 60% and 80% of the video
                    timestamps: ["50%"],
                    filename: filename + ".thumb.png",
                    folder: uploadFolder,
                    size: "200x125"
                });
                return [3 /*break*/, 3];
            case 1:
                video.set("processed", true);
                video.set("title", filename.match(/_(.*)\./).pop());
                video.set("video_thumbnail", video.get("file"));
                video.set("video_size", numeral(fs.statSync(filePath).size).format("0.00 b"));
                video.set("type", mime.lookup(filePath));
                return [4 /*yield*/, video.save(null, { useMasterKey: true })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
Parse.Cloud.afterDelete("Media", function (req) { return __awaiter(_this, void 0, void 0, function () {
    var video, file, oldPath;
    return __generator(this, function (_a) {
        video = req.object;
        file = video.get("file");
        oldPath = path.join(uploadFolder, file.name());
        //Delete Video
        try {
            fs.unlinkSync(oldPath);
        }
        catch (e) { }
        oldPath = oldPath + ".thumb.png";
        // Delete Thumb Image
        try {
            fs.unlinkSync(oldPath);
        }
        catch (e) { }
        return [2 /*return*/];
    });
}); });
Parse.Cloud.define("getGallery", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var videos;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (new Parse.Query("Media").find())];
            case 1:
                videos = _a.sent();
                return [2 /*return*/, videos.map(function (video) { return video.toJSON(); }).map(function (video) { return ({
                        name: video.name,
                        size: video.video_size,
                        thumbnail: video.video_thumbnail,
                        duration: video.video_duration,
                        id: video.objectId
                    }); })];
        }
    });
}); });
Parse.Cloud.define("uploadVideo", function (req, res) {
    // var busboy = new Busboy({ headers: req.headers });
    // var filePath = "";
    // var folder = "./uploads/";
    // var vfilename = "";
    // busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    //     console.log(
    //         "File [" +
    //         fieldname +
    //         "]: filename: " +
    //         filename +
    //         ", encoding: " +
    //         encoding +
    //         ", mimetype: " +
    //         mimetype
    //     );
    //     filename = sanitize(filename);
    //     var saveTo = path.join("./uploads/", path.basename(filename));
    //     vfilename = filename;
    //     filePath = saveTo;
    //     file.pipe(fs.createWriteStream(saveTo));
    // });
    // busboy.on("finish", () => {
    //     var thumbPath = filePath + ".thumb.png";
    //     // res.writeHead(200, { 'Connection': 'close' });
    //     // res.end("That's all folks!");
    //     // thumbler.extract(filePath, '00:00:10', '200x125', function () {
    //     //     // console.log('snapshot saved to snapshot.png (200x125) with a frame at 00:00:22');
    //     //     res.json({ status: "succeeded", filepath: filePath, thumbnail: thumbPath });
    //     // });
    //     if (path.extname(filePath) == ".mp4") {
    //         //screenshots for .mp4's only
    //         ffmpeg(filePath)
    //             .on("filenames", filenames => {
    //                 console.log("Will generate " + filenames.join(", "));
    //             })
    //             .on("end", () => {
    //                 console.log("Screenshots taken");
    //                 res.json({ status: "succeeded", filepath: filePath, thumbnail: thumbPath });
    //             })
    //             .screenshots({
    //                 // Will take screens at 20%, 40%, 60% and 80% of the video
    //                 timestamps: ["50%"],
    //                 filename: vfilename + ".thumb.png",
    //                 folder: folder,
    //                 size: "200x125"
    //             });
    //     } else {
    //         res.json({ status: "succeeded", filepath: filePath, thumbnail: filePath });
    //     }
    //     // ffmpeg('/path/to/video.avi')
    //     //     .screenshots({
    //     //         timestamps: [30.5, '50%', '01:10.123'],
    //     //         filename: 'thumbnail-at-%s-seconds.png',
    //     //         folder: '/path/to/output',
    //     //         size: '320x240'
    //     //     });
    // });
    // return req.pipe(busboy);
});
