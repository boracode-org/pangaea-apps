"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = _promise2.default))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var Parse = require("parse");
// Parse.initialize("ABCDEFG12345");
// Parse.serverURL = "http://psign.iriosystems.com:1380/parse";
exports.PORT = parseInt(process.env.PORT, 10) || 80;
exports.IP = "localhost";
var SERVER_URL = "https://" + exports.IP + ":" + exports.PORT + "/parse";
if (typeof window != "undefined") {
    SERVER_URL = window.location.origin + "/parse";
    // alert(SERVER_URL);
}
console.log("SERVER_URL", SERVER_URL);
Parse.initialize("psignApp");
Parse.serverURL = SERVER_URL;
var moment = require("moment");
function Query(className) {
    return new Parse.Query(className);
}
Parse.LiveQuery.on("open", function () {
    console.log("socket connection established");
});
// When we establish the WebSocket connection to the LiveQuery server, you’ll get this event.
// CLOSE EVENT
Parse.LiveQuery.on("close", function () {
    console.log("socket connection closed");
});
// When we lose the WebSocket connection to the LiveQuery server, you’ll get this event.
// ERROR EVENT
Parse.LiveQuery.on("error", function (error) {
    console.log("Error", error);
});
// Parse.liveQueryServerURL = `ws://${SERVER_URL}:8000`;

var Database = function () {
    function Database() {
        (0, _classCallCheck3.default)(this, Database);
    }

    (0, _createClass3.default)(Database, null, [{
        key: "Subscribe",
        value: function Subscribe(className) {
            var query = new Parse.Query(className);
            // query.equalTo("playerName", "John Doe");
            var subscription = query.subscribe();
            return subscription;
        }
    }, {
        key: "addMedia",
        value: function addMedia(file) {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var sfname, parseFile, medium;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                sfname = file.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
                                parseFile = new Parse.File(sfname, file);
                                _context.next = 4;
                                return parseFile.save();

                            case 4:
                                medium = new Parse.Object("Media");

                                medium.set("file", parseFile);
                                _context.next = 8;
                                return medium.save(null);

                            case 8:
                                return _context.abrupt("return", medium);

                            case 9:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
        }
    }, {
        key: "saveGroup",
        value: function saveGroup(objectId, currentGroupName) {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                var group;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                group = null;

                                if (!objectId) {
                                    _context2.next = 7;
                                    break;
                                }

                                _context2.next = 4;
                                return new Parse.Query("Groups").get(objectId);

                            case 4:
                                group = _context2.sent;
                                _context2.next = 8;
                                break;

                            case 7:
                                group = new Parse.Object("Groups");

                            case 8:
                                group.set("name", currentGroupName);
                                _context2.next = 11;
                                return group.save(null);

                            case 11:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));
        }
    }, {
        key: "deleteMedia",
        value: function deleteMedia(id) {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                var medium;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return new Parse.Query("Media").get(id);

                            case 2:
                                medium = _context3.sent;
                                _context3.next = 5;
                                return medium.destroy(null);

                            case 5:
                                return _context3.abrupt("return", medium);

                            case 6:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));
        }
    }, {
        key: "login",
        value: function login(username, password) {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                var user;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return Parse.User.logIn(username, password);

                            case 2:
                                user = _context4.sent;
                                return _context4.abrupt("return", user);

                            case 4:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));
        }
    }, {
        key: "getSettings",
        value: function getSettings() {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
                var query;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                query = new Parse.Query("Settings");
                                _context5.next = 3;
                                return query.first(null).then(function (k) {
                                    return k.toJSON();
                                });

                            case 3:
                                return _context5.abrupt("return", _context5.sent);

                            case 4:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));
        }
    }, {
        key: "getGroups",
        value: function getGroups() {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
                var query;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                query = new Parse.Query("Groups");
                                _context6.next = 3;
                                return query.find(null);

                            case 3:
                                return _context6.abrupt("return", _context6.sent);

                            case 4:
                            case "end":
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }) //.then(k => k.toJSON());
            );
        }
    }, {
        key: "getSettingsParse",
        value: function getSettingsParse() {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
                var query;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                query = new Parse.Query("Settings");
                                _context7.next = 3;
                                return query.first(null);

                            case 3:
                                return _context7.abrupt("return", _context7.sent);

                            case 4:
                            case "end":
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));
        }
    }, {
        key: "loadSlot",
        value: function loadSlot(date) {
            var selectedGroup = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
                var query;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.prev = 0;
                                query = new Parse.Query("TimeSlots").include("video").equalTo("timestamp", date);

                                if (selectedGroup) {
                                    query.equalTo("group", selectedGroup);
                                }
                                _context8.next = 5;
                                return query.first(null).then(function (k) {
                                    return k && k.toJSON();
                                });

                            case 5:
                                return _context8.abrupt("return", _context8.sent);

                            case 8:
                                _context8.prev = 8;
                                _context8.t0 = _context8["catch"](0);

                                alert("error:" + _context8.t0.message);
                                return _context8.abrupt("return", null);

                            case 12:
                            case "end":
                                return _context8.stop();
                        }
                    }
                }, _callee8, this, [[0, 8]]);
            }));
        }
    }, {
        key: "loadSlotOrNew",
        value: function loadSlotOrNew(date) {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
                var query;
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.prev = 0;
                                query = new Parse.Query("TimeSlots").equalTo("timestamp", date);
                                _context9.next = 4;
                                return query.first(null);

                            case 4:
                                _context9.t0 = _context9.sent;

                                if (_context9.t0) {
                                    _context9.next = 7;
                                    break;
                                }

                                _context9.t0 = new Parse.Object("TimeSlots");

                            case 7:
                                return _context9.abrupt("return", _context9.t0);

                            case 10:
                                _context9.prev = 10;
                                _context9.t1 = _context9["catch"](0);
                                return _context9.abrupt("return", new Parse.Object("TimeSlots"));

                            case 13:
                            case "end":
                                return _context9.stop();
                        }
                    }
                }, _callee9, this, [[0, 10]]);
            }));
        }
    }, {
        key: "setVehicle",
        value: function setVehicle(id, name) {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
                var device;
                return _regenerator2.default.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return Query("Devices").get(id);

                            case 2:
                                device = _context10.sent;

                                device.set("vehicle_no", name);
                                _context10.next = 6;
                                return device.save(null);

                            case 6:
                            case "end":
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));
        }
    }, {
        key: "setVehicleGroup",
        value: function setVehicleGroup(id, groupId) {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
                var device, group;
                return _regenerator2.default.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                _context11.next = 2;
                                return Query("Devices").get(id);

                            case 2:
                                device = _context11.sent;
                                group = new Parse.Object("Groups");

                                group.id = groupId;
                                device.set("group", group);
                                _context11.next = 8;
                                return device.save(null);

                            case 8:
                            case "end":
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));
        }
    }, {
        key: "setSnaphots",
        value: function setSnaphots(id, status) {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee12() {
                var device;
                return _regenerator2.default.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                _context12.next = 2;
                                return Query("Devices").get(id);

                            case 2:
                                device = _context12.sent;

                                device.set("ve", status);
                                _context12.next = 6;
                                return device.save(null);

                            case 6:
                            case "end":
                                return _context12.stop();
                        }
                    }
                }, _callee12, this);
            }));
        }
    }, {
        key: "saveSlot",
        value: function saveSlot(media, timeSlot, title, scrolling_text) {
            var selectedGroup = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee13() {
                var durations, dCount, medium, _dCount, myTimeSlot, slot, group;

                return _regenerator2.default.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                durations = media.video_duration / 30;

                                if (durations < 1) durations = 1;
                                dCount = 0;

                                console.error("has multiple durations", { durations: durations });
                                medium = new Parse.Object("Media");

                                medium.id = media.objectId;
                                _dCount = 0;

                            case 7:
                                if (!(_dCount < durations)) {
                                    _context13.next = 24;
                                    break;
                                }

                                console.log("saving duration: ", _dCount * 30);
                                myTimeSlot = moment(timeSlot).add(_dCount * 30, "seconds").toDate();
                                _context13.next = 12;
                                return this.loadSlotOrNew(myTimeSlot);

                            case 12:
                                slot = _context13.sent;

                                slot.set("title", title);
                                if (selectedGroup) {
                                    group = new Parse.Object("Groups");

                                    group.id = selectedGroup;
                                    slot.set("group", group);
                                }
                                slot.set("scrolling_text", scrolling_text);
                                slot.set("video", medium);
                                slot.set("timestamp", myTimeSlot);
                                slot.set("duration", 30);
                                _context13.next = 21;
                                return slot.save(null);

                            case 21:
                                _dCount++;
                                _context13.next = 7;
                                break;

                            case 24:
                                this.forceReload();

                            case 25:
                            case "end":
                                return _context13.stop();
                        }
                    }
                }, _callee13, this);
            }));
        }
    }, {
        key: "forceReload",
        value: function forceReload() {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee14() {
                var setting;
                return _regenerator2.default.wrap(function _callee14$(_context14) {
                    while (1) {
                        switch (_context14.prev = _context14.next) {
                            case 0:
                                _context14.prev = 0;
                                _context14.next = 3;
                                return this.getSettingsParse();

                            case 3:
                                setting = _context14.sent;

                                setting.set("lastUpdate", new Date()); // Force all players to update their playlists
                                _context14.next = 7;
                                return setting.save(null);

                            case 7:
                                _context14.next = 12;
                                break;

                            case 9:
                                _context14.prev = 9;
                                _context14.t0 = _context14["catch"](0);

                                console.log("err", _context14.t0);

                            case 12:
                            case "end":
                                return _context14.stop();
                        }
                    }
                }, _callee14, this, [[0, 9]]);
            }));
        }
    }, {
        key: "saveSettings",
        value: function saveSettings(defaultVideo, defaultBanner, defaultRSS) {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee15() {
                var query, setting;
                return _regenerator2.default.wrap(function _callee15$(_context15) {
                    while (1) {
                        switch (_context15.prev = _context15.next) {
                            case 0:
                                query = new Parse.Query("Settings");
                                _context15.next = 3;
                                return query.first(null);

                            case 3:
                                setting = _context15.sent;

                                setting.set("defaultVideo", defaultVideo);
                                setting.set("defaultBanner", defaultBanner);
                                setting.set("defaultRSS", defaultRSS);
                                _context15.next = 9;
                                return setting.save(null);

                            case 9:
                                return _context15.abrupt("return", _context15.sent);

                            case 10:
                            case "end":
                                return _context15.stop();
                        }
                    }
                }, _callee15, this);
            }));
        }
    }, {
        key: "isLoggedIn",
        value: function isLoggedIn() {
            return Parse.User.current();
        }
    }, {
        key: "changeMediaTitle",
        value: function changeMediaTitle(oitem, title) {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee16() {
                var item;
                return _regenerator2.default.wrap(function _callee16$(_context16) {
                    while (1) {
                        switch (_context16.prev = _context16.next) {
                            case 0:
                                _context16.next = 2;
                                return Query("Media").get(oitem.objectId);

                            case 2:
                                item = _context16.sent;

                                item.set("title", title);
                                _context16.next = 6;
                                return item.save();

                            case 6:
                            case "end":
                                return _context16.stop();
                        }
                    }
                }, _callee16, this);
            }));
        }
    }, {
        key: "getGalleryItems",
        value: function getGalleryItems() {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee17() {
                var items;
                return _regenerator2.default.wrap(function _callee17$(_context17) {
                    while (1) {
                        switch (_context17.prev = _context17.next) {
                            case 0:
                                _context17.next = 2;
                                return Query("Media").find();

                            case 2:
                                items = _context17.sent;
                                return _context17.abrupt("return", items.map(function (d) {
                                    return d.toJSON();
                                }));

                            case 4:
                            case "end":
                                return _context17.stop();
                        }
                    }
                }, _callee17, this);
            }));
        }
    }, {
        key: "fetchDevices",
        value: function fetchDevices() {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee18() {
                var devices;
                return _regenerator2.default.wrap(function _callee18$(_context18) {
                    while (1) {
                        switch (_context18.prev = _context18.next) {
                            case 0:
                                _context18.next = 2;
                                return Query("Devices").find();

                            case 2:
                                devices = _context18.sent;
                                return _context18.abrupt("return", devices.map(function (d) {
                                    return d.toJSON();
                                }));

                            case 4:
                            case "end":
                                return _context18.stop();
                        }
                    }
                }, _callee18, this);
            }));
        }
    }, {
        key: "fetchGroups",
        value: function fetchGroups() {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee19() {
                var groups;
                return _regenerator2.default.wrap(function _callee19$(_context19) {
                    while (1) {
                        switch (_context19.prev = _context19.next) {
                            case 0:
                                _context19.next = 2;
                                return Query("Groups").find();

                            case 2:
                                groups = _context19.sent;
                                return _context19.abrupt("return", groups.map(function (d) {
                                    return d.toJSON();
                                }));

                            case 4:
                            case "end":
                                return _context19.stop();
                        }
                    }
                }, _callee19, this);
            }));
        }
    }, {
        key: "getRouteToday",
        value: function getRouteToday(objectId) {
            return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee20() {
                var start, end, device, snapshots;
                return _regenerator2.default.wrap(function _callee20$(_context20) {
                    while (1) {
                        switch (_context20.prev = _context20.next) {
                            case 0:
                                start = moment().utc().startOf("day").toDate(); // set to 12:00 am today

                                end = moment().utc().endOf("day").toDate(); // set to 23:59 pm today

                                device = new Parse.Object("Devices");

                                device.id = objectId;
                                _context20.next = 6;
                                return Query("Snapshots").greaterThanOrEqualTo("createdAt", start).lessThanOrEqualTo("createdAt", end).exists("location").equalTo("device", device).ascending("createdAt").find();

                            case 6:
                                snapshots = _context20.sent;
                                return _context20.abrupt("return", snapshots.map(function (d) {
                                    return d.toJSON();
                                }));

                            case 8:
                            case "end":
                                return _context20.stop();
                        }
                    }
                }, _callee20, this);
            }));
        }
    }]);

    return Database;
}();

exports.Database = Database;