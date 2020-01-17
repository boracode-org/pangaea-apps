"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var link_1 = require("next/dist/lib/link.js");
var react_native_web_1 = require("react-native-web");
var React = require("react");
var Database_1 = require("./Database");
exports.Header = function (_ref) {
        var url = _ref.url;
        return React.createElement(react_native_web_1.View, { style: {
                        flexDirection: "row",
                        flex: 1,
                        width: "100%",
                        justifyContent: "space-between",
                        backgroundColor: "lightgray",
                        padding: 5
                } }, React.createElement(react_native_web_1.Text, { style: {
                        backgroundColor: "darkred",
                        color: "white",
                        fontSize: 20,
                        padding: 4,
                        borderRadius: 3,
                        margin: 2
                } }, url.replace("/", "").toUpperCase() || "HOME"), React.createElement(react_native_web_1.View, { style: {
                        flexDirection: "row",
                        backgroundColor: "lightgray"
                } }, !Database_1.Database.isLoggedIn ? React.createElement(link_1.default, { href: "/login", prefetch: true }, React.createElement("a", { style: {
                        backgroundColor: "yellow",
                        fontSize: 20,
                        padding: 4,
                        borderRadius: 3,
                        margin: 2
                } }, "LOGIN")) : null, Database_1.Database.isLoggedIn ? React.createElement(react_native_web_1.View, { style: { flex: 1, flexDirection: "row" } }, React.createElement(link_1.default, { href: "/", prefetch: true }, React.createElement("a", { style: {
                        backgroundColor: "white",
                        fontSize: 20,
                        padding: 4,
                        borderRadius: 3,
                        margin: 2
                } }, "HOME")), React.createElement(link_1.default, { href: "/scheduler", prefetch: true }, React.createElement("a", { style: {
                        backgroundColor: "white",
                        fontSize: 20,
                        padding: 4,
                        borderRadius: 3,
                        margin: 2
                } }, "SCHED.")), React.createElement(link_1.default, { href: "/devices", prefetch: true }, React.createElement("a", { style: {
                        backgroundColor: "white",
                        fontSize: 20,
                        padding: 4,
                        borderRadius: 3,
                        margin: 2
                } }, "DEVICES")), React.createElement(link_1.default, { href: "/groups", prefetch: true }, React.createElement("a", { style: {
                        backgroundColor: "white",
                        fontSize: 20,
                        padding: 4,
                        borderRadius: 3,
                        margin: 2
                } }, "GROUPS")), React.createElement(link_1.default, { href: "/logout", prefetch: true }, React.createElement("a", { style: {
                        backgroundColor: "orange",
                        fontSize: 20,
                        padding: 4,
                        borderRadius: 3,
                        margin: 2
                } }, "LOGOUT"))) : null));
};