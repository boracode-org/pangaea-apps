"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var PORT = exports.PORT = 4000;
var IP = exports.IP = "localhost";
var SERVER_URL = "http://" + IP + ":" + PORT + "/parse";
if (typeof window != "undefined") {
  SERVER_URL = window.location.hostname + (":" + PORT + "/parse");
  // alert(SERVER_URL);
}
exports.default = {
  SERVER_URL: "http://psign.iriosystems.com:8080"
};