import * as Chalk from "chalk";
import * as express from "express";
import * as fs from "fs";
import * as path from "path";
import * as spdy from "spdy";
import { appMiddleware } from "./middleware";
import { enableVideoApi } from "./videoApi";
import { CONSTANTS, PORT } from "./Constants";
var ParseDashboard = require("parse-dashboard");
var ParseServer = require("parse-server").ParseServer;

const app = express();

// Hide this, could be security risk
app.disable("x-powered-by");

//Apply CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Serve static files
const statics = path.resolve("./build/public");
app.use(express.static(statics));

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
    ]
  },
  allowInsecureHTTP
);

var api = new ParseServer({
  databaseURI: CONSTANTS.DATABASE_URI, // Connection string for your MongoDB database
  cloud: "src/server/cloud/main.js", // Absolute path to your Cloud Code
  appId: CONSTANTS.APP_ID,
  masterKey: CONSTANTS.MASTER_KEY, // Keep this key secret!
  fileKey: "optionalFileKey",
  serverURL: CONSTANTS.SERVER_URL, // Don't forget to change to https if needed,
  filesAdapter: {
    "module": "parse-server-fs-adapter",
    "options": {
      "filesSubDirectory": CONSTANTS.UPLOAD_FOLDER // optional
    }
  }
});

// Serve the Parse API on the /parse URL prefix
app.use("/parse", api);

// make the Parse Dashboard available at /dashboard
app.use("/dashboard", dashboard);

//load api pages
// enableVideoApi(app);

// Handle requests to pages
app.get("*", appMiddleware);



const options: spdy.ServerOptions = {
  spdy: {
    plain: true,
    protocols: ["h2", "spdy/3.1", "spdy/3", "http/1.1"]
  }
};

const tlsDir = process.env.TLSDIR || "/tls";
const key = process.env.TLSKEY || "current.key";
const chain = process.env.TLSCHAIN || "current.chain";

if (fs.existsSync(path.join(tlsDir, key))) {
  options.key = fs.readFileSync(path.join(tlsDir, key));
  options.spdy!.plain = false;
  if (process.env.NODE_ENV === "production") {
    // CONSTANTS.PORT = 443;
    express()
      .get("*", (req, res, next) => {
        if (req.secure) {
          next();
        }
        // tslint:disable-next-line:no-console
        console.log(Chalk.black.bgCyan(`\n\n🐙  Redirecting to https://${req.hostname}`));
        res.redirect(`https://${req.hostname}`);
      })
      .listen(80);
  }
}

if (fs.existsSync(path.join(tlsDir, chain))) {
  options.cert = fs.readFileSync(path.join(tlsDir, chain));
}

// Start server
spdy.createServer(options, app as any).listen(PORT, (err: any) => {
  if (err) {
    console.error(Chalk.bgRed(err));
  } else {
    // tslint:disable-next-line:no-console
    console.log(
      Chalk.black.bgGreen(
        `\n\n🐙  Listening at http${!options.spdy!.plain ? "s" : ""}://:${PORT}\n`
      )
    );
  }
});

process.on("SIGINT", () => {
  console.info("Captured SIGINT! Exiting.");
  process.exit();
});

process.on("SIGTERM", () => {
  console.info("Captured SIGTERM. Exiting.");
  process.exit();
});
