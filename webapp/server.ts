//DATABASE_URL

// add route to show this database url env

const express = require("express");
const next = require("next");
import * as path from "path";
import * as fs from "fs";

const port = parseInt(process.env.PORT, 10);
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });

import { enableVideoApi } from "./videoApi";
import { CONSTANTS, PORT } from "./Constants";
var ParseDashboard = require("parse-dashboard");
var ParseServer = require("parse-server").ParseServer;

import StaticFileSystemAdapter from "./StaticFileSystemAdapter";

const uploadFolder = path.resolve(CONSTANTS.UPLOAD_FOLDER); // + "/../files/uploads");

const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();

  // // Hide this, could be security risk
  // app.disable("x-powered-by");

  // //Apply CORS
  // app.use(function(req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.header(
  //     "Access-Control-Allow-Headers",
  //     "Origin, X-Requested-With, Content-Type, Accept"
  //   );
  //   next();
  // });

  var allowInsecureHTTP = true;

  var dashboard = new ParseDashboard(
    {
      apps: [
        {
          serverURL: CONSTANTS.SERVER_URL,
          appId: CONSTANTS.APP_ID,
          masterKey: CONSTANTS.MASTER_KEY,
          appName: CONSTANTS.APP_NAME
        }
      ],
      users: [
        {
          user: "ronald.adonyo@gmail.com",
          pass: "adonyo123"
        }
      ],
      trustProxy: 1
    },
    allowInsecureHTTP
  );

  var fsAdapter = new StaticFileSystemAdapter({
    filesSubDirectory: CONSTANTS.UPLOAD_FOLDER // optional
  });

  var parse = new ParseServer({
    databaseURI: CONSTANTS.DATABASE_URI, // Connection string for your MongoDB database
    cloud: "cloud/main.js", // Absolute path to your Cloud Code
    appId: CONSTANTS.APP_ID,
    masterKey: CONSTANTS.MASTER_KEY, // Keep this key secret!
    fileKey: "optionalFileKey",
    serverURL: "http://localhost:" + process.env.PORT + "/parse", //CONSTANTS.SERVER_URL, // Don't forget to change to https if needed,
    // filesAdapter: {
    //   module: "parse-server-fs-adapter",
    //   options: {
    //     filesSubDirectory: CONSTANTS.UPLOAD_FOLDER // optional
    //   }
    // },

    filesAdapter: fsAdapter,
    maxUploadSize: "5000mb",
    liveQuery: {
      classNames: ["Devices", "Media", "Settings", "Snapshots", "TimeSlots"]
    },
    startLiveQueryServer: true
  });

  // Serve the Parse API on the /parse URL prefix
  app.use("/parse", parse);

  // make the Parse Dashboard available at /dashboard
  app.use("/dashboard", dashboard);

  app.get("/videoIOS", (req, res) => {
    var { filename } = req.query;
    var saveTo = path.join(uploadFolder, path.basename(filename));
    var filePath = path.join(uploadFolder, filename);
    var file = filePath; ///path.resolve(__dirname, "movie.mp4");
    fs.stat(file, function(err, stats) {
      if (err) {
        if (err.code === "ENOENT") {
          // 404 Error if file not found
          return res.sendStatus(404);
        }
        res.end(err);
      }
      var total = stats.size;
      var range = req.headers.range;
      if (!range) {
        // 416 Wrong range
        // return res.sendStatus(416);
        console.log("ALL: " + total);
        res.writeHead(200, {
          "Content-Length": total,
          "Content-Type": "video/mp4"
        });
        return fs.createReadStream(file).pipe(res);
      }
      var positions = range.replace(/bytes=/, "").split("-");
      var start = parseInt(positions[0], 10);

      var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
      var chunksize = end - start + 1;

      res.writeHead(206, {
        "Content-Range": "bytes " + start + "-" + end + "/" + total,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4"
      });

      var stream = fs
        .createReadStream(file, { start: start, end: end })
        .on("open", function() {
          stream.pipe(res);
        })
        .on("error", function(err) {
          res.end(err);
        });
    });
  });

  app.get("/status", (req, res) => {
    return res.json({
      PORT: port,
      DATABASE_URL: process.env.DATABASE_URL
    });
  });

  //   server.get('/a', (req, res) => {
  //     return app.render(req, res, '/b', req.query)
  //   })

  //   server.get('/b', (req, res) => {
  //     return app.render(req, res, '/a', req.query)
  //   })

  //   server.get('/posts/:id', (req, res) => {
  //     return app.render(req, res, '/posts', { id: req.params.id })
  //   })

  app.get("*", (req, res) => {
    return handle(req, res);
  });

  // Initialize a LiveQuery server instance, app is the express app of your Parse Server

  var httpServer = require("http").createServer(app);
  // httpServer.listen(port, err => {
  //   if (err) throw err;
  //   console.log(`> Ready on http://localhost:${port}`);
  //   // Live Query server started...
  // });

  httpServer.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);

    // Live Query server started...
  });
  // var parseLiveQueryServer = ParseServer.createLiveQueryServer(null, {
  //   appId: CONSTANTS.APP_ID,
  //   masterKey: CONSTANTS.MASTER_KEY,
  //   serverURL: `http://localhost:${port}/parse`,
  //   port:8000,
  //   host:"0.0.0.0"
  //   // redisURL: 'redis://localhost:6379'
  // });

  global["httpServer"] = httpServer;
  global["ParseServer"] = ParseServer;

  var parseLiveQueryServer = global["ParseServer"].createLiveQueryServer(
    global["httpServer"]
  );
  console.log(parseLiveQueryServer);
  // parseLiveQueryServer.
  /*, {
    appId: 'appId',
    masterKey: 'masterKey',
    serverURL: 'http://localhost:4000/parse',
    // redisURL: 'redis://localhost:6379'
  });*/
  // console.log("live query ..", parseLiveQueryServer);
});
