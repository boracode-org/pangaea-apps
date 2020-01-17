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

var http = require("http"),
  os = require("os"),
  fs = require("fs");

var moment = require("moment");

var httpServer = require("http");
import { CONSTANTS } from "../Constants";

const uploadFolder = path.resolve(CONSTANTS.UPLOAD_FOLDER); // + "/../files/uploads");

async function readFiles(dirname) {
  return new Promise((res, rej) => {
    return fs.readdir(dirname, (err, filenames) => {
      if (err) {
        return rej(err);
      }
      return res(filenames);
    });
  });
}

interface IProbeType {
  duration;
  thumbnail;
  size;
  name;
}

Parse.Cloud.afterSave("Media", async request => {
  var video = request.object;
  //check if video has already been processed.
  var processedDate: Date = video.get("videoProcessedAt") || new Date();
  var processed: boolean = video.get("processed");
  var updatedAt: Date = video.updatedAt;

  processedDate.setMilliseconds(0);
  updatedAt.setMilliseconds(0);

  if (!processed || processedDate < updatedAt) {
    // only process new files
    console.log("Processing media", video);
    // var uploadFolder = CONSTANTS.UPLOAD_FOLDER + "/Projects/server/uploads";
    //Create thumbnails etc ...
    var vidFile = "";
    // var filename = video.get("file").name;
    var file: Parse.File = video.get("file");
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
          .on("end", async () => {
            console.log("Screenshots taken");
            try {
              var props: IProbeType = await new Promise((resolve, reject) =>
                ffmpeg.ffprobe(filePath, (err, meta) => {
                  if (err) {
                    console.log(err);
                    return reject(err);
                  } else {
                    console.dir(meta.format.duration);
                    return resolve({
                      name: filename,
                      size: numeral(fs.statSync(filePath).size).format(
                        "0.00 b"
                      ),
                      thumbnail: querystring.escape(filename + ".thumb.png"),
                      duration: meta.format.duration
                    });
                  }
                })
              );

              video.set("video_duration", props.duration);
              video.set(
                "title",
                video.get("title") || filename.match(/_(.*)\./).pop()
              );
              video.set(
                "video_thumbnail",
                Parse.File.fromJSON({
                  __type: "File",
                  name: props.thumbnail,
                  url: "http://" + props.thumbnail
                })
              );
              video.set("video_size", props.size);
              video.set("videoProcessedAt", new Date());
              video.set("processed", true);
              video.set("type", mime.lookup(filePath));
              await video.save(null, { useMasterKey: true });
            } catch (e) {
              console.log("Crashed: ", e);
            }

            // res.json({ status: "succeeded", filepath: filePath, thumbnail: thumbPath });
          })
          .screenshots({
            // Will take screens at 20%, 40%, 60% and 80% of the video
            timestamps: ["50%"],
            filename: filename + ".thumb.png",
            folder: uploadFolder,
            size: "300x160"
          });

          
      } catch (e) {
        console.log("Crashed: ", e);
      }
      // Store info about thumbnail and get file info like size etc ...
    } else {
      try {
        video.set("processed", true);
        video.set("title", filename.match(/_(.*)\./).pop());
        video.set("video_thumbnail", video.get("file"));
        video.set(
          "video_size",
          numeral(fs.statSync(filePath).size).format("0.00 b")
        );
        video.set("type", mime.lookup(filePath));
        await video.save(null, { useMasterKey: true });
      } catch (e) {
        console.log("Crashed: ", e);
      }
    }
    console.log({ps:global["ParseServer"],hs:global["httpServer"]})
    var parseLiveQueryServer = global["ParseServer"].createLiveQueryServer(global["httpServer"]);
    
    console.log(parseLiveQueryServer);
  }
});

Parse.Cloud.afterDelete("Media", async req => {
  var video = req.object;
  var file: Parse.File = video.get("file");

  var oldPath = path.join(uploadFolder, file.name());
  //Delete Video
  try {
    fs.unlinkSync(oldPath);
  } catch (e) {}

  oldPath = oldPath + ".thumb.png";

  // Delete Thumb Image
  try {
    fs.unlinkSync(oldPath);
  } catch (e) {}
});



Parse.Cloud.define("getGallery", async (req, res) => {
  var videos = await new Parse.Query("Media").find();
  return videos.map(video => video.toJSON()).map(video => ({
    name: video.name,
    size: video.video_size,
    thumbnail: video.video_thumbnail,
    duration: video.video_duration,
    id: video.objectId
  }));
});

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
