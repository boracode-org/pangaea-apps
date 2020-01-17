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
var process = require("process");
var path = require("path");
// var multer = require("multer");
// var bodyParser = require("body-parser");
// import     MulterImpl = require("./multerImpl");
var numeral = require("numeral");
// var sanitize = require("sanitize-filename");
var querystring = require("querystring");
var ffmpeg = require("fluent-ffmpeg");
var mime = require("mime-types");
var http = require("http"), os = require("os"), fs = require("fs");
var moment = require("moment");
var httpServer = require("http");
const Constants_1 = require("../Constants");
const uploadFolder = path.resolve(Constants_1.CONSTANTS.UPLOAD_FOLDER); // + "/../files/uploads");
function readFiles(dirname) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((res, rej) => {
            return fs.readdir(dirname, (err, filenames) => {
                if (err) {
                    return rej(err);
                }
                return res(filenames);
            });
        });
    });
}
Parse.Cloud.afterSave("Media", (request) => __awaiter(this, void 0, void 0, function* () {
    var video = request.object;
    //check if video has already been processed.
    var processedDate = video.get("videoProcessedAt") || new Date();
    var processed = video.get("processed");
    var updatedAt = video.updatedAt;
    processedDate.setMilliseconds(0);
    updatedAt.setMilliseconds(0);
    if (!processed || processedDate < updatedAt) {
        // only process new files
        console.log("Processing media", video);
        // var uploadFolder = CONSTANTS.UPLOAD_FOLDER + "/Projects/server/uploads";
        //Create thumbnails etc ...
        var vidFile = "";
        // var filename = video.get("file").name;
        var file = video.get("file");
        var filename = file ? file.name() : "";
        var saveTo = path.join(uploadFolder, path.basename(filename));
        var filePath = path.join(uploadFolder, filename);
        console.log("uploadFolder", { uploadFolder, filePath });
        var thumbPath = filePath + ".thumb.png";
        if (path.extname(filePath) == ".mp4") {
            try {
                //screenshots for .mp4's only
                ffmpeg(filePath)
                    .on("filenames", filenames => {
                    console.log("Will generate " + filenames.join(", "));
                })
                    .on("end", () => __awaiter(this, void 0, void 0, function* () {
                    console.log("Screenshots taken");
                    try {
                        var props = yield new Promise((resolve, reject) => ffmpeg.ffprobe(filePath, (err, meta) => {
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
                        }));
                        video.set("video_duration", props.duration);
                        video.set("title", video.get("title") || filename.match(/_(.*)\./).pop());
                        video.set("video_thumbnail", Parse.File.fromJSON({
                            __type: "File",
                            name: props.thumbnail,
                            url: "http://" + props.thumbnail
                        }));
                        video.set("video_size", props.size);
                        video.set("videoProcessedAt", new Date());
                        video.set("processed", true);
                        video.set("type", mime.lookup(filePath));
                        yield video.save(null, { useMasterKey: true });
                    }
                    catch (e) {
                        console.log("Crashed: ", e);
                    }
                    // res.json({ status: "succeeded", filepath: filePath, thumbnail: thumbPath });
                }))
                    .screenshots({
                    // Will take screens at 20%, 40%, 60% and 80% of the video
                    timestamps: ["50%"],
                    filename: filename + ".thumb.png",
                    folder: uploadFolder,
                    size: "300x160"
                });
            }
            catch (e) {
                console.log("Crashed: ", e);
            }
            // Store info about thumbnail and get file info like size etc ...
        }
        else {
            try {
                video.set("processed", true);
                video.set("title", filename.match(/_(.*)\./).pop());
                video.set("video_thumbnail", video.get("file"));
                video.set("video_size", numeral(fs.statSync(filePath).size).format("0.00 b"));
                video.set("type", mime.lookup(filePath));
                yield video.save(null, { useMasterKey: true });
            }
            catch (e) {
                console.log("Crashed: ", e);
            }
        }
        console.log({ ps: global["ParseServer"], hs: global["httpServer"] });
        var parseLiveQueryServer = global["ParseServer"].createLiveQueryServer(global["httpServer"]);
        console.log(parseLiveQueryServer);
    }
}));
Parse.Cloud.afterDelete("Media", (req) => __awaiter(this, void 0, void 0, function* () {
    var video = req.object;
    var file = video.get("file");
    var oldPath = path.join(uploadFolder, file.name());
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
}));
Parse.Cloud.define("getGallery", (req, res) => __awaiter(this, void 0, void 0, function* () {
    var videos = yield new Parse.Query("Media").find();
    return videos.map(video => video.toJSON()).map(video => ({
        name: video.name,
        size: video.video_size,
        thumbnail: video.video_thumbnail,
        duration: video.video_duration,
        id: video.objectId
    }));
}));
Parse.Cloud.define("uploadVideo", (req, res) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqQyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0Isa0NBQWtDO0FBQ2xDLDJDQUEyQztBQUMzQyxtREFBbUQ7QUFDbkQsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pDLCtDQUErQztBQUMvQyxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDekMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3RDLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUVqQyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQ3hCLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQ2xCLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFckIsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRS9CLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNqQyw0Q0FBeUM7QUFFekMsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxxQkFBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsMEJBQTBCO0FBRXRGLG1CQUF5QixPQUFPOztRQUM5QixNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7WUFDOUIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxFQUFFO2dCQUM1QyxFQUFFLENB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O0lBQ3JELHFCQUFxQjtJQUNyQiw2QkFBNkI7SUFDN0Isc0JBQXNCO0lBQ3RCLHlFQUF5RTtJQUN6RSxtQkFBbUI7SUFDbkIscUJBQXFCO0lBQ3JCLHNCQUFzQjtJQUN0Qiw0QkFBNEI7SUFDNUIscUJBQXFCO0lBQ3JCLDJCQUEyQjtJQUMzQixxQkFBcUI7SUFDckIsMkJBQTJCO0lBQzNCLG1CQUFtQjtJQUNuQixTQUFTO0lBQ1QscUNBQXFDO0lBQ3JDLHFFQUFxRTtJQUNyRSw0QkFBNEI7SUFDNUIseUJBQXlCO0lBQ3pCLCtDQUErQztJQUMvQyxNQUFNO0lBQ04sOEJBQThCO0lBQzlCLCtDQUErQztJQUMvQyx3REFBd0Q7SUFDeEQsdUNBQXVDO0lBQ3ZDLHlFQUF5RTtJQUN6RSxrR0FBa0c7SUFDbEcsMEZBQTBGO0lBQzFGLGFBQWE7SUFDYiw4Q0FBOEM7SUFDOUMsd0NBQXdDO0lBQ3hDLDJCQUEyQjtJQUMzQiw4Q0FBOEM7SUFDOUMsd0VBQXdFO0lBQ3hFLGlCQUFpQjtJQUNqQixpQ0FBaUM7SUFDakMsb0RBQW9EO0lBQ3BELCtGQUErRjtJQUMvRixpQkFBaUI7SUFDakIsNkJBQTZCO0lBQzdCLDZFQUE2RTtJQUM3RSx1Q0FBdUM7SUFDdkMsc0RBQXNEO0lBQ3RELGtDQUFrQztJQUNsQyxrQ0FBa0M7SUFDbEMsa0JBQWtCO0lBQ2xCLGVBQWU7SUFDZixzRkFBc0Y7SUFDdEYsUUFBUTtJQUNSLHNDQUFzQztJQUN0Qyw0QkFBNEI7SUFDNUIseURBQXlEO0lBQ3pELDBEQUEwRDtJQUMxRCw0Q0FBNEM7SUFDNUMsaUNBQWlDO0lBQ2pDLGlCQUFpQjtJQUNqQixNQUFNO0lBQ04sMkJBQTJCO0FBQzdCLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHByb2Nlc3MgPSByZXF1aXJlKFwicHJvY2Vzc1wiKTtcbnZhciBwYXRoID0gcmVxdWlyZShcInBhdGhcIik7XG4vLyB2YXIgbXVsdGVyID0gcmVxdWlyZShcIm11bHRlclwiKTtcbi8vIHZhciBib2R5UGFyc2VyID0gcmVxdWlyZShcImJvZHktcGFyc2VyXCIpO1xuLy8gaW1wb3J0ICAgICBNdWx0ZXJJbXBsID0gcmVxdWlyZShcIi4vbXVsdGVySW1wbFwiKTtcbnZhciBudW1lcmFsID0gcmVxdWlyZShcIm51bWVyYWxcIik7XG4vLyB2YXIgc2FuaXRpemUgPSByZXF1aXJlKFwic2FuaXRpemUtZmlsZW5hbWVcIik7XG52YXIgcXVlcnlzdHJpbmcgPSByZXF1aXJlKFwicXVlcnlzdHJpbmdcIik7XG52YXIgZmZtcGVnID0gcmVxdWlyZShcImZsdWVudC1mZm1wZWdcIik7XG52YXIgbWltZSA9IHJlcXVpcmUoXCJtaW1lLXR5cGVzXCIpO1xuXG52YXIgaHR0cCA9IHJlcXVpcmUoXCJodHRwXCIpLFxuICBvcyA9IHJlcXVpcmUoXCJvc1wiKSxcbiAgZnMgPSByZXF1aXJlKFwiZnNcIik7XG5cbnZhciBtb21lbnQgPSByZXF1aXJlKFwibW9tZW50XCIpO1xuXG52YXIgaHR0cFNlcnZlciA9IHJlcXVpcmUoXCJodHRwXCIpO1xuaW1wb3J0IHsgQ09OU1RBTlRTIH0gZnJvbSBcIi4uL0NvbnN0YW50c1wiO1xuXG5jb25zdCB1cGxvYWRGb2xkZXIgPSBwYXRoLnJlc29sdmUoQ09OU1RBTlRTLlVQTE9BRF9GT0xERVIpOyAvLyArIFwiLy4uL2ZpbGVzL3VwbG9hZHNcIik7XG5cbmFzeW5jIGZ1bmN0aW9uIHJlYWRGaWxlcyhkaXJuYW1lKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcbiAgICByZXR1cm4gZnMucmVhZGRpcihkaXJuYW1lLCAoZXJyLCBmaWxlbmFtZXMpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIHJlaihlcnIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcyhmaWxlbmFtZXMpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuaW50ZXJmYWNlIElQcm9iZVR5cGUge1xuICBkdXJhdGlvbjtcbiAgdGh1bWJuYWlsO1xuICBzaXplO1xuICBuYW1lO1xufVxuXG5QYXJzZS5DbG91ZC5hZnRlclNhdmUoXCJNZWRpYVwiLCBhc3luYyByZXF1ZXN0ID0+IHtcbiAgdmFyIHZpZGVvID0gcmVxdWVzdC5vYmplY3Q7XG4gIC8vY2hlY2sgaWYgdmlkZW8gaGFzIGFscmVhZHkgYmVlbiBwcm9jZXNzZWQuXG4gIHZhciBwcm9jZXNzZWREYXRlOiBEYXRlID0gdmlkZW8uZ2V0KFwidmlkZW9Qcm9jZXNzZWRBdFwiKSB8fCBuZXcgRGF0ZSgpO1xuICB2YXIgcHJvY2Vzc2VkOiBib29sZWFuID0gdmlkZW8uZ2V0KFwicHJvY2Vzc2VkXCIpO1xuICB2YXIgdXBkYXRlZEF0OiBEYXRlID0gdmlkZW8udXBkYXRlZEF0O1xuXG4gIHByb2Nlc3NlZERhdGUuc2V0TWlsbGlzZWNvbmRzKDApO1xuICB1cGRhdGVkQXQuc2V0TWlsbGlzZWNvbmRzKDApO1xuXG4gIGlmICghcHJvY2Vzc2VkIHx8IHByb2Nlc3NlZERhdGUgPCB1cGRhdGVkQXQpIHtcbiAgICAvLyBvbmx5IHByb2Nlc3MgbmV3IGZpbGVzXG4gICAgY29uc29sZS5sb2coXCJQcm9jZXNzaW5nIG1lZGlhXCIsIHZpZGVvKTtcbiAgICAvLyB2YXIgdXBsb2FkRm9sZGVyID0gQ09OU1RBTlRTLlVQTE9BRF9GT0xERVIgKyBcIi9Qcm9qZWN0cy9zZXJ2ZXIvdXBsb2Fkc1wiO1xuICAgIC8vQ3JlYXRlIHRodW1ibmFpbHMgZXRjIC4uLlxuICAgIHZhciB2aWRGaWxlID0gXCJcIjtcbiAgICAvLyB2YXIgZmlsZW5hbWUgPSB2aWRlby5nZXQoXCJmaWxlXCIpLm5hbWU7XG4gICAgdmFyIGZpbGU6IFBhcnNlLkZpbGUgPSB2aWRlby5nZXQoXCJmaWxlXCIpO1xuICAgIHZhciBmaWxlbmFtZSA9IGZpbGUgPyBmaWxlLm5hbWUoKSA6IFwiXCI7XG5cbiAgICB2YXIgc2F2ZVRvID0gcGF0aC5qb2luKHVwbG9hZEZvbGRlciwgcGF0aC5iYXNlbmFtZShmaWxlbmFtZSkpO1xuICAgIHZhciBmaWxlUGF0aCA9IHBhdGguam9pbih1cGxvYWRGb2xkZXIsIGZpbGVuYW1lKTtcblxuICAgIGNvbnNvbGUubG9nKFwidXBsb2FkRm9sZGVyXCIsIHsgdXBsb2FkRm9sZGVyLCBmaWxlUGF0aCB9KTtcblxuICAgIHZhciB0aHVtYlBhdGggPSBmaWxlUGF0aCArIFwiLnRodW1iLnBuZ1wiO1xuICAgIGlmIChwYXRoLmV4dG5hbWUoZmlsZVBhdGgpID09IFwiLm1wNFwiKSB7XG4gICAgICB0cnkge1xuICAgICAgICAvL3NjcmVlbnNob3RzIGZvciAubXA0J3Mgb25seVxuICAgICAgICBmZm1wZWcoZmlsZVBhdGgpXG4gICAgICAgICAgLm9uKFwiZmlsZW5hbWVzXCIsIGZpbGVuYW1lcyA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIldpbGwgZ2VuZXJhdGUgXCIgKyBmaWxlbmFtZXMuam9pbihcIiwgXCIpKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vbihcImVuZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNjcmVlbnNob3RzIHRha2VuXCIpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgdmFyIHByb3BzOiBJUHJvYmVUeXBlID0gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgICAgICAgICAgICBmZm1wZWcuZmZwcm9iZShmaWxlUGF0aCwgKGVyciwgbWV0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihtZXRhLmZvcm1hdC5kdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBmaWxlbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICBzaXplOiBudW1lcmFsKGZzLnN0YXRTeW5jKGZpbGVQYXRoKS5zaXplKS5mb3JtYXQoXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjAuMDAgYlwiXG4gICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICB0aHVtYm5haWw6IHF1ZXJ5c3RyaW5nLmVzY2FwZShmaWxlbmFtZSArIFwiLnRodW1iLnBuZ1wiKSxcbiAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogbWV0YS5mb3JtYXQuZHVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICB2aWRlby5zZXQoXCJ2aWRlb19kdXJhdGlvblwiLCBwcm9wcy5kdXJhdGlvbik7XG4gICAgICAgICAgICAgIHZpZGVvLnNldChcbiAgICAgICAgICAgICAgICBcInRpdGxlXCIsXG4gICAgICAgICAgICAgICAgdmlkZW8uZ2V0KFwidGl0bGVcIikgfHwgZmlsZW5hbWUubWF0Y2goL18oLiopXFwuLykucG9wKClcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgdmlkZW8uc2V0KFxuICAgICAgICAgICAgICAgIFwidmlkZW9fdGh1bWJuYWlsXCIsXG4gICAgICAgICAgICAgICAgUGFyc2UuRmlsZS5mcm9tSlNPTih7XG4gICAgICAgICAgICAgICAgICBfX3R5cGU6IFwiRmlsZVwiLFxuICAgICAgICAgICAgICAgICAgbmFtZTogcHJvcHMudGh1bWJuYWlsLFxuICAgICAgICAgICAgICAgICAgdXJsOiBcImh0dHA6Ly9cIiArIHByb3BzLnRodW1ibmFpbFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIHZpZGVvLnNldChcInZpZGVvX3NpemVcIiwgcHJvcHMuc2l6ZSk7XG4gICAgICAgICAgICAgIHZpZGVvLnNldChcInZpZGVvUHJvY2Vzc2VkQXRcIiwgbmV3IERhdGUoKSk7XG4gICAgICAgICAgICAgIHZpZGVvLnNldChcInByb2Nlc3NlZFwiLCB0cnVlKTtcbiAgICAgICAgICAgICAgdmlkZW8uc2V0KFwidHlwZVwiLCBtaW1lLmxvb2t1cChmaWxlUGF0aCkpO1xuICAgICAgICAgICAgICBhd2FpdCB2aWRlby5zYXZlKG51bGwsIHsgdXNlTWFzdGVyS2V5OiB0cnVlIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNyYXNoZWQ6IFwiLCBlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcmVzLmpzb24oeyBzdGF0dXM6IFwic3VjY2VlZGVkXCIsIGZpbGVwYXRoOiBmaWxlUGF0aCwgdGh1bWJuYWlsOiB0aHVtYlBhdGggfSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2NyZWVuc2hvdHMoe1xuICAgICAgICAgICAgLy8gV2lsbCB0YWtlIHNjcmVlbnMgYXQgMjAlLCA0MCUsIDYwJSBhbmQgODAlIG9mIHRoZSB2aWRlb1xuICAgICAgICAgICAgdGltZXN0YW1wczogW1wiNTAlXCJdLFxuICAgICAgICAgICAgZmlsZW5hbWU6IGZpbGVuYW1lICsgXCIudGh1bWIucG5nXCIsXG4gICAgICAgICAgICBmb2xkZXI6IHVwbG9hZEZvbGRlcixcbiAgICAgICAgICAgIHNpemU6IFwiMzAweDE2MFwiXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJDcmFzaGVkOiBcIiwgZSk7XG4gICAgICB9XG4gICAgICAvLyBTdG9yZSBpbmZvIGFib3V0IHRodW1ibmFpbCBhbmQgZ2V0IGZpbGUgaW5mbyBsaWtlIHNpemUgZXRjIC4uLlxuICAgIH0gZWxzZSB7XG4gICAgICB0cnkge1xuICAgICAgICB2aWRlby5zZXQoXCJwcm9jZXNzZWRcIiwgdHJ1ZSk7XG4gICAgICAgIHZpZGVvLnNldChcInRpdGxlXCIsIGZpbGVuYW1lLm1hdGNoKC9fKC4qKVxcLi8pLnBvcCgpKTtcbiAgICAgICAgdmlkZW8uc2V0KFwidmlkZW9fdGh1bWJuYWlsXCIsIHZpZGVvLmdldChcImZpbGVcIikpO1xuICAgICAgICB2aWRlby5zZXQoXG4gICAgICAgICAgXCJ2aWRlb19zaXplXCIsXG4gICAgICAgICAgbnVtZXJhbChmcy5zdGF0U3luYyhmaWxlUGF0aCkuc2l6ZSkuZm9ybWF0KFwiMC4wMCBiXCIpXG4gICAgICAgICk7XG4gICAgICAgIHZpZGVvLnNldChcInR5cGVcIiwgbWltZS5sb29rdXAoZmlsZVBhdGgpKTtcbiAgICAgICAgYXdhaXQgdmlkZW8uc2F2ZShudWxsLCB7IHVzZU1hc3RlcktleTogdHJ1ZSB9KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJDcmFzaGVkOiBcIiwgZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKHtwczpnbG9iYWxbXCJQYXJzZVNlcnZlclwiXSxoczpnbG9iYWxbXCJodHRwU2VydmVyXCJdfSlcbiAgICB2YXIgcGFyc2VMaXZlUXVlcnlTZXJ2ZXIgPSBnbG9iYWxbXCJQYXJzZVNlcnZlclwiXS5jcmVhdGVMaXZlUXVlcnlTZXJ2ZXIoZ2xvYmFsW1wiaHR0cFNlcnZlclwiXSk7XG4gICAgXG4gICAgY29uc29sZS5sb2cocGFyc2VMaXZlUXVlcnlTZXJ2ZXIpO1xuICB9XG59KTtcblxuUGFyc2UuQ2xvdWQuYWZ0ZXJEZWxldGUoXCJNZWRpYVwiLCBhc3luYyByZXEgPT4ge1xuICB2YXIgdmlkZW8gPSByZXEub2JqZWN0O1xuICB2YXIgZmlsZTogUGFyc2UuRmlsZSA9IHZpZGVvLmdldChcImZpbGVcIik7XG5cbiAgdmFyIG9sZFBhdGggPSBwYXRoLmpvaW4odXBsb2FkRm9sZGVyLCBmaWxlLm5hbWUoKSk7XG4gIC8vRGVsZXRlIFZpZGVvXG4gIHRyeSB7XG4gICAgZnMudW5saW5rU3luYyhvbGRQYXRoKTtcbiAgfSBjYXRjaCAoZSkge31cblxuICBvbGRQYXRoID0gb2xkUGF0aCArIFwiLnRodW1iLnBuZ1wiO1xuXG4gIC8vIERlbGV0ZSBUaHVtYiBJbWFnZVxuICB0cnkge1xuICAgIGZzLnVubGlua1N5bmMob2xkUGF0aCk7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KTtcblxuXG5cblBhcnNlLkNsb3VkLmRlZmluZShcImdldEdhbGxlcnlcIiwgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gIHZhciB2aWRlb3MgPSBhd2FpdCBuZXcgUGFyc2UuUXVlcnkoXCJNZWRpYVwiKS5maW5kKCk7XG4gIHJldHVybiB2aWRlb3MubWFwKHZpZGVvID0+IHZpZGVvLnRvSlNPTigpKS5tYXAodmlkZW8gPT4gKHtcbiAgICBuYW1lOiB2aWRlby5uYW1lLFxuICAgIHNpemU6IHZpZGVvLnZpZGVvX3NpemUsXG4gICAgdGh1bWJuYWlsOiB2aWRlby52aWRlb190aHVtYm5haWwsXG4gICAgZHVyYXRpb246IHZpZGVvLnZpZGVvX2R1cmF0aW9uLFxuICAgIGlkOiB2aWRlby5vYmplY3RJZFxuICB9KSk7XG59KTtcblxuUGFyc2UuQ2xvdWQuZGVmaW5lKFwidXBsb2FkVmlkZW9cIiwgKHJlcSwgcmVzKSA9PiB7XG4gIC8vIHZhciBidXNib3kgPSBuZXcgQnVzYm95KHsgaGVhZGVyczogcmVxLmhlYWRlcnMgfSk7XG4gIC8vIHZhciBmaWxlUGF0aCA9IFwiXCI7XG4gIC8vIHZhciBmb2xkZXIgPSBcIi4vdXBsb2Fkcy9cIjtcbiAgLy8gdmFyIHZmaWxlbmFtZSA9IFwiXCI7XG4gIC8vIGJ1c2JveS5vbihcImZpbGVcIiwgKGZpZWxkbmFtZSwgZmlsZSwgZmlsZW5hbWUsIGVuY29kaW5nLCBtaW1ldHlwZSkgPT4ge1xuICAvLyAgICAgY29uc29sZS5sb2coXG4gIC8vICAgICAgICAgXCJGaWxlIFtcIiArXG4gIC8vICAgICAgICAgZmllbGRuYW1lICtcbiAgLy8gICAgICAgICBcIl06IGZpbGVuYW1lOiBcIiArXG4gIC8vICAgICAgICAgZmlsZW5hbWUgK1xuICAvLyAgICAgICAgIFwiLCBlbmNvZGluZzogXCIgK1xuICAvLyAgICAgICAgIGVuY29kaW5nICtcbiAgLy8gICAgICAgICBcIiwgbWltZXR5cGU6IFwiICtcbiAgLy8gICAgICAgICBtaW1ldHlwZVxuICAvLyAgICAgKTtcbiAgLy8gICAgIGZpbGVuYW1lID0gc2FuaXRpemUoZmlsZW5hbWUpO1xuICAvLyAgICAgdmFyIHNhdmVUbyA9IHBhdGguam9pbihcIi4vdXBsb2Fkcy9cIiwgcGF0aC5iYXNlbmFtZShmaWxlbmFtZSkpO1xuICAvLyAgICAgdmZpbGVuYW1lID0gZmlsZW5hbWU7XG4gIC8vICAgICBmaWxlUGF0aCA9IHNhdmVUbztcbiAgLy8gICAgIGZpbGUucGlwZShmcy5jcmVhdGVXcml0ZVN0cmVhbShzYXZlVG8pKTtcbiAgLy8gfSk7XG4gIC8vIGJ1c2JveS5vbihcImZpbmlzaFwiLCAoKSA9PiB7XG4gIC8vICAgICB2YXIgdGh1bWJQYXRoID0gZmlsZVBhdGggKyBcIi50aHVtYi5wbmdcIjtcbiAgLy8gICAgIC8vIHJlcy53cml0ZUhlYWQoMjAwLCB7ICdDb25uZWN0aW9uJzogJ2Nsb3NlJyB9KTtcbiAgLy8gICAgIC8vIHJlcy5lbmQoXCJUaGF0J3MgYWxsIGZvbGtzIVwiKTtcbiAgLy8gICAgIC8vIHRodW1ibGVyLmV4dHJhY3QoZmlsZVBhdGgsICcwMDowMDoxMCcsICcyMDB4MTI1JywgZnVuY3Rpb24gKCkge1xuICAvLyAgICAgLy8gICAgIC8vIGNvbnNvbGUubG9nKCdzbmFwc2hvdCBzYXZlZCB0byBzbmFwc2hvdC5wbmcgKDIwMHgxMjUpIHdpdGggYSBmcmFtZSBhdCAwMDowMDoyMicpO1xuICAvLyAgICAgLy8gICAgIHJlcy5qc29uKHsgc3RhdHVzOiBcInN1Y2NlZWRlZFwiLCBmaWxlcGF0aDogZmlsZVBhdGgsIHRodW1ibmFpbDogdGh1bWJQYXRoIH0pO1xuICAvLyAgICAgLy8gfSk7XG4gIC8vICAgICBpZiAocGF0aC5leHRuYW1lKGZpbGVQYXRoKSA9PSBcIi5tcDRcIikge1xuICAvLyAgICAgICAgIC8vc2NyZWVuc2hvdHMgZm9yIC5tcDQncyBvbmx5XG4gIC8vICAgICAgICAgZmZtcGVnKGZpbGVQYXRoKVxuICAvLyAgICAgICAgICAgICAub24oXCJmaWxlbmFtZXNcIiwgZmlsZW5hbWVzID0+IHtcbiAgLy8gICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiV2lsbCBnZW5lcmF0ZSBcIiArIGZpbGVuYW1lcy5qb2luKFwiLCBcIikpO1xuICAvLyAgICAgICAgICAgICB9KVxuICAvLyAgICAgICAgICAgICAub24oXCJlbmRcIiwgKCkgPT4ge1xuICAvLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTY3JlZW5zaG90cyB0YWtlblwiKTtcbiAgLy8gICAgICAgICAgICAgICAgIHJlcy5qc29uKHsgc3RhdHVzOiBcInN1Y2NlZWRlZFwiLCBmaWxlcGF0aDogZmlsZVBhdGgsIHRodW1ibmFpbDogdGh1bWJQYXRoIH0pO1xuICAvLyAgICAgICAgICAgICB9KVxuICAvLyAgICAgICAgICAgICAuc2NyZWVuc2hvdHMoe1xuICAvLyAgICAgICAgICAgICAgICAgLy8gV2lsbCB0YWtlIHNjcmVlbnMgYXQgMjAlLCA0MCUsIDYwJSBhbmQgODAlIG9mIHRoZSB2aWRlb1xuICAvLyAgICAgICAgICAgICAgICAgdGltZXN0YW1wczogW1wiNTAlXCJdLFxuICAvLyAgICAgICAgICAgICAgICAgZmlsZW5hbWU6IHZmaWxlbmFtZSArIFwiLnRodW1iLnBuZ1wiLFxuICAvLyAgICAgICAgICAgICAgICAgZm9sZGVyOiBmb2xkZXIsXG4gIC8vICAgICAgICAgICAgICAgICBzaXplOiBcIjIwMHgxMjVcIlxuICAvLyAgICAgICAgICAgICB9KTtcbiAgLy8gICAgIH0gZWxzZSB7XG4gIC8vICAgICAgICAgcmVzLmpzb24oeyBzdGF0dXM6IFwic3VjY2VlZGVkXCIsIGZpbGVwYXRoOiBmaWxlUGF0aCwgdGh1bWJuYWlsOiBmaWxlUGF0aCB9KTtcbiAgLy8gICAgIH1cbiAgLy8gICAgIC8vIGZmbXBlZygnL3BhdGgvdG8vdmlkZW8uYXZpJylcbiAgLy8gICAgIC8vICAgICAuc2NyZWVuc2hvdHMoe1xuICAvLyAgICAgLy8gICAgICAgICB0aW1lc3RhbXBzOiBbMzAuNSwgJzUwJScsICcwMToxMC4xMjMnXSxcbiAgLy8gICAgIC8vICAgICAgICAgZmlsZW5hbWU6ICd0aHVtYm5haWwtYXQtJXMtc2Vjb25kcy5wbmcnLFxuICAvLyAgICAgLy8gICAgICAgICBmb2xkZXI6ICcvcGF0aC90by9vdXRwdXQnLFxuICAvLyAgICAgLy8gICAgICAgICBzaXplOiAnMzIweDI0MCdcbiAgLy8gICAgIC8vICAgICB9KTtcbiAgLy8gfSk7XG4gIC8vIHJldHVybiByZXEucGlwZShidXNib3kpO1xufSk7XG4iXX0=