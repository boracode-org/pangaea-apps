"use strict";
exports.__esModule = true;
// Basic settings
exports.PORT = 4000;
exports.IP = "localhost";
// if (process.env.NODE_ENV === "production") {
//   PORT = 80;
// }
var SERVER_URL = "http://" + exports.IP + ":" + exports.PORT + "/parse";
if (typeof window != "undefined") {
    SERVER_URL = window.location.hostname + (":" + exports.PORT + "/parse");
    alert(SERVER_URL);
}
exports.CONSTANTS = {
    APP_ID: "psignApp",
    MASTER_KEY: "psignApp",
    APP_NAME: "Pangaea Server",
    SERVER_URL: SERVER_URL,
    DATABASE_URI: "postgres://psign:psign@localhost:5432/psign",
    UPLOAD_FOLDER: "./uploads" // __dirname + "./uploads"
};
