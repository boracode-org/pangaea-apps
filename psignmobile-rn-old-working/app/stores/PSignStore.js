"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
var PSignStore_1;
const react_native_1 = require("react-native");
// var setTimeout = /*BackgroundTimer.*/setTimeout.bind(BackgroundTimer);
// var setInterval = /*BackgroundTimer.*/setInterval.bind(BackgroundTimer);
// var clearTimeout = BackgroundTimer.clearTimeout.bind(BackgroundTimer);
// var clearInterval = BackgroundTimer.clearInterval.bind(BackgroundTimer);
const moment = require("moment");
const mobx_1 = require("mobx");
// import * as Datastore from "react-native-local-mongodb";
const autobind_decorator_1 = require("autobind-decorator");
const Expo = require("expo");
const expo_1 = require("expo");
// Type 3: Persistent datastore with automatic loading
var Datastore = require("react-native-local-mongodb");
const db = new Datastore({ filename: "psignStore", autoload: true });
db.findAsync = options => {
    return new Promise((res, reject) => {
        db.find(options, (err, docs) => {
            if (err) {
                return reject(err);
            }
            return res(docs);
        });
    });
};
db.insertAsync = options => {
    return new Promise((res, reject) => {
        db.insert(options, (err, docs) => {
            if (err) {
                return reject(err);
            }
            return res(docs);
        });
    });
};
const enhancedAsset_1 = require("../components/enhancedAsset");
const Parse = require("parse/react-native");
Parse.setAsyncStorage(react_native_1.AsyncStorage);
const CONFIG = {
    PARSE_SERVER: "https://psign.zeus.iriosystems.com/parse",
    PARSE_APP_ID: "psignApp",
    PARSE_REST_API_KEY: "psignApp"
};
Parse.initialize(CONFIG.PARSE_APP_ID);
Parse.serverURL = CONFIG.PARSE_SERVER;
exports.BASE_SERVER_URL = "psign.zeus.iriosystems.com";
exports.SERVER_URL = "https://" + exports.BASE_SERVER_URL;
exports.WS_SERVER_URL = "wss://" + exports.BASE_SERVER_URL;
Parse.liveQueryServerURL = "ws://173.212.207.222:58080"; //`ws://${BASE_SERVER_URL}`
Parse.LiveQuery.on("open", () => {
    console.log("socket connection established");
});
Parse.LiveQuery.on("close", () => {
    console.log("socket connection closed");
});
Parse.LiveQuery.on("error", error => {
    console.log("socket error", error);
});
const MODULE = "PSignStore";
let PSignStore = PSignStore_1 = class PSignStore {
    constructor() {
        this.latestSnapshot = null;
        this.updateTimer = null;
        this.SERVER_URL = exports.SERVER_URL;
        // Type 3: Persistent datastore with automatic loading
        //  db = new Datastore({ filename: "asyncStorageKey", autoload: true });
        this.db = db;
        this.current_location = {};
        this.syncMessage = "";
        this.settings = {
            defaultBanner: "",
            defaultVideo: "",
            defaultRSS: ""
        };
        this.initStore();
    }
    watchLocation() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var updateThread = () => {
                //
                console.log("updateThread started...");
                //uuid
                var Devices = Parse.Object.extend("Devices");
                var query = new Parse.Query(Devices);
                var uuid = Expo.Constants.deviceId;
                var coords = this.location || {};
                query
                    .equalTo("uuid", uuid)
                    .find(null)
                    .then((devices) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    console.log("found device", { devices });
                    console.log("updateThread watchLocation...");
                    try {
                        var device = new Devices();
                        if (devices.length > 0) {
                            console.log("found it", devices);
                            device = devices[0];
                        }
                        var longitude = coords.longitude || "";
                        var latitude = coords.latitude || "";
                        var name = "photo.jpg";
                        var parseFile = null;
                        // if (toJS(this.latestSnapshot) != null) {
                        try {
                            parseFile = new Parse.File(name, {
                                base64: mobx_1.toJS(this.latestSnapshot)
                            });
                            yield parseFile.save(null);
                        }
                        catch (e) {
                            console.log("failed to upload: ", e);
                        }
                        // }
                        device.set("uuid", uuid);
                        device.set("location", new Parse.GeoPoint({
                            longitude: longitude.toString(),
                            latitude: latitude.toString()
                        }));
                        device.set("photo", parseFile);
                        console.log("saving device", {
                            uuid,
                            longitude,
                            latitude,
                            ss: mobx_1.toJS(this.latestSnapshot)
                        });
                        yield device.save(null);
                        // add snapshot to route listing
                        var snapshot = new Parse.Object("Snapshots");
                        snapshot.set("device", device);
                        snapshot.set("location", new Parse.GeoPoint({
                            longitude: longitude.toString(),
                            latitude: latitude.toString()
                        }));
                        snapshot.set("photo", parseFile);
                        try {
                            yield snapshot.save(null);
                        }
                        catch (err) {
                            console.log("failed to upload snapshot");
                        }
                        // .then(k => console.log(k))
                        // .catch(err => console.log(err));
                    }
                    catch (err) {
                        console.log("ERROR", err);
                    }
                }));
            };
            let { status } = yield expo_1.Permissions.askAsync(expo_1.Permissions.LOCATION);
            // alert("status: " + status);
            if (status !== "granted") {
                alert("Permission to access location was denied");
            }
            else {
                // alert("Permission to access location was granted");
                console.log("Location access granted");
                this.updateTimer = setInterval(updateThread, 1000 * 60 * 5);
                Expo.Location.watchPositionAsync({
                    enableHighAccuracy: true,
                    timeInterval: 1000 * 60 * 5 /*, distanceInterval: 5  -- might have to optimize this */
                }, ({ coords }) => {
                    this.lion = coords;
                });
                var location = yield Expo.Location.getCurrentPositionAsync({
                    enableHighAccuracy: true
                });
                this.location = location.coords;
                // Run atleast once ...
                updateThread();
            }
        });
    }
    fetchRss(_url) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let url = _url;
            url = `http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20feednormalizer%20where%20url=%27${url}%27%20and%20output=%27atom_1.0%27&format=json`;
            console.log(url);
            return yield fetch(url).then(res => {
                console.log("fetchRss", { res });
                return res.json();
            });
        });
    }
    initStore() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // setup indexes
            // try {
            //   var result = await this.db.createIndex({
            //     index: {
            //       fields: ["timestamp"]
            //     }
            //   });
            //   console.log("index created: ", result);
            // } catch (err) {
            //   console.log(err);
            // }
            let query = new Parse.Query("Settings");
            PSignStore_1.subscriptionSettings = query.subscribe();
            PSignStore_1.subscriptionSettings.on("open", () => {
                console.log(`${MODULE}: Subscribed to Settings`);
                this.getDefaultSettings();
            });
            PSignStore_1.subscriptionSettings.on("update", (setting) => {
                console.log(`=================${MODULE}: Settings updated================`);
                var video = setting.get("defaultVideo");
                var banner = setting.get("defaultBanner");
                console.log("setting: ", setting);
                this.settings = {
                    defaultVideo: video && video.url(),
                    defaultRSS: setting.get("defaultRSS"),
                    defaultBanner: banner && banner.url()
                };
                console.log("settings: ", mobx_1.toJS(this.settings));
                //Should start downloading new assets immediately
                // this.syncDB(); //lets update.
            });
            PSignStore_1.subscriptionSettings.on("error", error => {
                console.log("connection error", error);
            });
            query = new Parse.Query("TimeSlots");
            PSignStore_1.subscriptionTimeSlots = query.subscribe();
            PSignStore_1.subscriptionTimeSlots.on("open", () => {
                console.log(`${MODULE}: Subscribed to TimeSlots`);
                this.getDefaultSettings();
            });
            PSignStore_1.subscriptionTimeSlots.on("create", (timeslot) => {
                console.log(`=================${MODULE}: TimeSlots new================`, timeslot);
                this.syncDB();
            });
            PSignStore_1.subscriptionTimeSlots.on("update", (timeslot) => {
                console.log(`=================${MODULE}: TimeSlots updated================`, timeslot);
                this.syncDB();
            });
            PSignStore_1.subscriptionTimeSlots.on("error", error => {
                console.log("connection error", error);
            });
            var doSync = (just5Mins) => {
                this.getDefaultSettings();
                this.syncDB(just5Mins); //lets update.
            };
            /*BackgroundTimer.*/ setTimeout(() => {
                doSync(true);
            }, 1000 * 60 * 1);
            doSync();
            try {
                let { status } = yield expo_1.Permissions.getAsync(expo_1.Permissions.CAMERA);
                if (status !== "granted") {
                    /*BackgroundTimer.*/ setTimeout(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        let { status } = yield expo_1.Permissions.askAsync(expo_1.Permissions.CAMERA);
                        if (status == "granted") {
                            console.log("Granted!", status);
                        }
                        else {
                            alert("Permission to access camera was denied");
                        }
                    }));
                    let { status } = yield expo_1.Permissions.getAsync(expo_1.Permissions.LOCATION);
                    if (status !== "granted") {
                        /*BackgroundTimer.*/ setTimeout(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                            let { status } = yield expo_1.Permissions.askAsync(expo_1.Permissions.LOCATION);
                            if (status == "granted") {
                                console.log("Granted!", status);
                                // now you can set the listenner to watch the user geo location
                            }
                            else {
                                alert("Permission to access location was denied");
                            }
                        }));
                    }
                    else {
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    getDefaultSettings() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var Settings = Parse.Object.extend("Settings");
            var query = new Parse.Query(Settings);
            try {
                console.log("getting settings ...");
                var setting = yield query.first(null);
                console.log("getting settings 2...");
                var video = setting.get("defaultVideo");
                var banner = setting.get("defaultBanner");
                console.log("setting: ", setting);
                this.settings = {
                    defaultVideo: video && video.url(),
                    defaultRSS: setting.get("defaultRSS"),
                    defaultBanner: banner && banner.url()
                };
                this.cacheMedia(this.settings.defaultVideo);
                this.cacheMedia(this.settings.defaultBanner);
                console.log("settings: ", mobx_1.toJS(this.settings));
                return this.settings;
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    syncDB(just5Mins = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            //Should start downloading new assets immediately
            try {
                this.syncMessage = "Updating Local DB ...";
                console.log(`${MODULE}: Updating Local DB ... ${just5Mins ? "5 min" : ""}`);
                var dateistore = JSON.parse(yield react_native_1.AsyncStorage.getItem("@lastSyncedDate"));
                // console.log({ dateistore, parsed: Date.parse(dateistore) });
                var lastSyncedDate = new Date(Date.parse(dateistore || "01/01/1970"));
                console.log("Only syncing stuff newer than: " + lastSyncedDate.toString());
                // let response = await fetch(SERVER_URL + "/loadAllNewSlots");
                // let responseJson = await response.json();
                var date = moment(new Date())
                    .add(-5, "minutes")
                    .toDate();
                var slotsQuery = new Parse.Query("TimeSlots").include("video").addDescending("createdAt");
                // if (just5Mins) {
                slotsQuery.greaterThanOrEqualTo("updatedAt", just5Mins ? date : lastSyncedDate);
                // }
                var slots = (yield slotsQuery.find(null))
                    .map(k => k.toJSON())
                    .map(k => {
                    var { video } = k;
                    k.video = (video && video.file && video.file.url) || "";
                    return k;
                });
                // return responseJson.users;
                //                 db.bulkDocs(responseJson).then((result) =>{
                //   // handle result
                //   console.log("bulkInsert result",result);
                //         this.setState({syncMessage:""});
                // }).catch( (err) =>{
                //   console.log(err);
                //         this.setState({syncMessage:"syncError:" + err});
                console.log("oslots", slots);
                slots = slots.map(k => {
                    k.serverId = k._id;
                    //Lets share the serverId so it becomes an update instead
                    // delete k._id;
                    //   console.log(moment(k.timestamp).getDate());
                    // k.otimestamp = k.timestamp;
                    k.timestamp =
                        moment(k.timestamp.iso)
                            .toDate()
                            .getTime() * 1;
                    return k;
                });
                console.log("slots", slots);
                //Pre-cache all videos
                slots.map((slot) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    yield this.cacheMedia(slot.video);
                }));
                // });
                var doInsert = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    try {
                        // var result = await this.db.bulkDocs(slots);
                        var result = yield this.db.insertAsync(slots);
                        // result is an array with these documents, augmented with their _id
                        console.log("insert successful", { result });
                        lastSyncedDate = new Date();
                        yield react_native_1.AsyncStorage.setItem("@lastSyncedDate", JSON.stringify(lastSyncedDate));
                        this.syncMessage = "";
                    }
                    catch (err) {
                        console.log("error on insert", err);
                        this.syncMessage = "syncError:" + err;
                    }
                });
                if (!just5Mins) {
                    //Clear DB first, might not be needed
                    try {
                        var numRemoved = this.db.remove({}, { multi: true });
                        console.log(`${MODULE}: cleared db`, numRemoved);
                    }
                    catch (err) {
                        console.log("error on remove", err);
                    }
                    doInsert();
                    // });
                }
                else {
                    doInsert();
                }
                // console.log(responseJson);
            }
            catch (error) {
                // Handle error
                this.syncMessage = "syncError:" + error;
                console.log("ERROR", error);
            }
        });
    }
    cacheMedia(videoUrl) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("caching: ", videoUrl);
            if (videoUrl && videoUrl.length > 0) {
                const videoAsset = new enhancedAsset_1.Asset({
                    name: videoUrl && videoUrl.replace(/(?!\.[^.]+$)\.|[^\w.]+/g, "").replace(".mp4", ""),
                    type: "mp4",
                    // path to the file somewhere on the internet
                    uri: videoUrl,
                    hash: videoUrl && videoUrl.replace(".", "_")
                });
                yield videoAsset.downloadAsyncWithoutHash({ cache: true });
            }
        });
    }
};
tslib_1.__decorate([
    mobx_1.observable
], PSignStore.prototype, "latestSnapshot", void 0);
tslib_1.__decorate([
    mobx_1.observable
], PSignStore.prototype, "UUID", void 0);
tslib_1.__decorate([
    mobx_1.observable
], PSignStore.prototype, "current_location", void 0);
tslib_1.__decorate([
    mobx_1.observable
], PSignStore.prototype, "syncMessage", void 0);
tslib_1.__decorate([
    mobx_1.observable
], PSignStore.prototype, "settings", void 0);
tslib_1.__decorate([
    mobx_1.action
], PSignStore.prototype, "getDefaultSettings", null);
tslib_1.__decorate([
    mobx_1.action
], PSignStore.prototype, "syncDB", null);
PSignStore = PSignStore_1 = tslib_1.__decorate([
    autobind_decorator_1.default
], PSignStore);
exports.PSignStore = PSignStore;
exports.psignStore = new PSignStore();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUFNpZ25TdG9yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlBTaWduU3RvcmUudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSwrQ0FBNEM7QUFHNUMseUVBQXlFO0FBQ3pFLDJFQUEyRTtBQUMzRSx5RUFBeUU7QUFDekUsMkVBQTJFO0FBRTNFLGlDQUFpQztBQUNqQywrQkFBZ0Q7QUFDaEQsMkRBQTJEO0FBRTNELDJEQUEwQztBQUMxQyw2QkFBNkI7QUFDN0IsK0JBQW1DO0FBZW5DLHNEQUFzRDtBQUN0RCxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUN0RCxNQUFNLEVBQUUsR0FBYyxJQUFJLFNBQVMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFFaEYsRUFBRSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsRUFBRTtJQUN2QixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ2pDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQzdCLElBQUksR0FBRyxFQUFFO2dCQUNQLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3BCO1lBQ0QsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQUVGLEVBQUUsQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLEVBQUU7SUFDekIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNqQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUMvQixJQUFJLEdBQUcsRUFB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QztLQUFBO0lBRWEsVUFBVSxDQUFDLFFBQWdCOztZQUN2QyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNuQyxJQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDbkMsTUFBTSxVQUFVLEdBQUcsSUFBSSxxQkFBSyxDQUFDO29CQUMzQixJQUFJLEVBQUUsUUFBUSxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMseUJBQXlCLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUM7b0JBQ3JGLElBQUksRUFBRSxLQUFLO29CQUNYLDZDQUE2QztvQkFDN0MsR0FBRyxFQUFFLFFBQVE7b0JBQ2IsSUFBSSxFQUFFLFFBQVEsSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7aUJBQ3RDLENBQUMsQ0FBQztnQkFDVixNQUFNLFVBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO2FBQzVEO1FBQ0gsQ0FBQztLQUFBO0NBd0NGLENBQUE7QUE3YmE7SUFBWCxpQkFBVTtrREFBdUI7QUE0T3RCO0lBQVgsaUJBQVU7d0NBQWM7QUFHekI7SUFEQyxpQkFBVTtvREFTSjtBQUVLO0lBQVgsaUJBQVU7K0NBQTBCO0FBR3JDO0lBREMsaUJBQVU7NENBS1Q7QUFPRjtJQURDLGFBQU07b0RBNEJOO0FBR0Q7SUFEQyxhQUFNO3dDQW1HTjtBQW5aVSxVQUFVO0lBRHRCLDRCQUFRO0dBQ0ksVUFBVSxDQXljdEI7QUF6Y1ksZ0NBQVU7QUEyY1YsUUFBQSxVQUFVLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFzeW5jU3RvcmFnZSB9IGZyb20gXCJyZWFjdC1uYXRpdmVcIjtcblxuXG4vLyB2YXIgc2V0VGltZW91dCA9IC8qQmFja2dyb3VuZFRpbWVyLiovc2V0VGltZW91dC5iaW5kKEJhY2tncm91bmRUaW1lcik7XG4vLyB2YXIgc2V0SW50ZXJ2YWwgPSAvKkJhY2tncm91bmRUaW1lci4qL3NldEludGVydmFsLmJpbmQoQmFja2dyb3VuZFRpbWVyKTtcbi8vIHZhciBjbGVhclRpbWVvdXQgPSBCYWNrZ3JvdW5kVGltZXIuY2xlYXJUaW1lb3V0LmJpbmQoQmFja2dyb3VuZFRpbWVyKTtcbi8vIHZhciBjbGVhckludGVydmFsID0gQmFja2dyb3VuZFRpbWVyLmNsZWFySW50ZXJ2YWwuYmluZChCYWNrZ3JvdW5kVGltZXIpO1xuXG5pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xuaW1wb3J0IHsgb2JzZXJ2YWJsZSwgYWN0aW9uLCB0b0pTIH0gZnJvbSBcIm1vYnhcIjtcbi8vIGltcG9ydCAqIGFzIERhdGFzdG9yZSBmcm9tIFwicmVhY3QtbmF0aXZlLWxvY2FsLW1vbmdvZGJcIjtcblxuaW1wb3J0IGF1dG9iaW5kIGZyb20gXCJhdXRvYmluZC1kZWNvcmF0b3JcIjtcbmltcG9ydCAqIGFzIEV4cG8gZnJvbSBcImV4cG9cIjtcbmltcG9ydCB7IFBlcm1pc3Npb25zIH0gZnJvbSBcImV4cG9cIjtcbmltcG9ydCAqIGFzIF8gZnJvbSBcImxvZGFzaFwiO1xuXG4vLyB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCA9IFwicmVhY3QtbmF0aXZlXCI7XG4vLyBpbXBvcnQgUG91Y2hEQiBmcm9tIFwicG91Y2hkYi1yZWFjdC1uYXRpdmVcIjtcbi8vIFBvdWNoREIucGx1Z2luKHJlcXVpcmUoJ3BvdWNoZGItZmluZCcpKTtcblxuLy8gY29uc3QgZGIgPSBuZXcgUG91Y2hEQihcInBzaWduU3RvcmVcIik7XG5cbmludGVyZmFjZSBJRGF0YWJhc2Uge1xuICBmaW5kQXN5bmM6IChvcHRpb25zKSA9PiBQcm9taXNlPGFueT47XG4gIGluc2VydEFzeW5jOiAob3B0aW9ucykgPT4gUHJvbWlzZTxhbnk+O1xuICBpbnNlcnQ7XG4gIGZpbmQ7XG59XG4vLyBUeXBlIDM6IFBlcnNpc3RlbnQgZGF0YXN0b3JlIHdpdGggYXV0b21hdGljIGxvYWRpbmdcbnZhciBEYXRhc3RvcmUgPSByZXF1aXJlKFwicmVhY3QtbmF0aXZlLWxvY2FsLW1vbmdvZGJcIik7XG5jb25zdCBkYjogSURhdGFiYXNlID0gbmV3IERhdGFzdG9yZSh7IGZpbGVuYW1lOiBcInBzaWduU3RvcmVcIiwgYXV0b2xvYWQ6IHRydWUgfSk7XG5cbmRiLmZpbmRBc3luYyA9IG9wdGlvbnMgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqZWN0KSA9PiB7XG4gICAgZGIuZmluZChvcHRpb25zLCAoZXJyLCBkb2NzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiByZWplY3QoZXJyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXMoZG9jcyk7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuZGIuaW5zZXJ0QXN5bmMgPSBvcHRpb25zID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlamVjdCkgPT4ge1xuICAgIGRiLmluc2VydChvcHRpb25zLCAoZXJyLCBkb2NzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiByZWplY3QoZXJyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXMoZG9jcyk7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuaW1wb3J0IHsgQXNzZXQgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9lbmhhbmNlZEFzc2V0XCI7XG5cbmltcG9ydCAqIGFzIFBhcnNlIGZyb20gXCJwYXJzZS9yZWFjdC1uYXRpdmVcIjtcblBhcnNlLnNldEFzeW5jU3RvcmFnZShBc3luY1N0b3JhZ2UpO1xuXG5jb25zdCBDT05GSUcgPSB7XG4gIFBBUlNFX1NFUlZFUjogXCJodHRwczovL3BzaWduLnpldXMuaXJpb3N5c3RlbXMuY29tL3BhcnNlXCIsXG4gIFBBUlNFX0FQUF9JRDogXCJwc2lnbkFwcFwiLFxuICBQQVJTRV9SRVNUX0FQSV9LRVk6IFwicHNpZ25BcHBcIlxufTtcblxuUGFyc2UuaW5pdGlhbGl6ZShDT05GSUcuUEFSU0VfQVBQX0lEKTtcblBhcnNlLnNlcnZlclVSTCA9IENPTkZJRy5QQVJTRV9TRVJWRVI7XG5cbmV4cG9ydCBjb25zdCBCQVNFX1NFUlZFUl9VUkwgPSBcInBzaWduLnpldXMuaXJpb3N5c3RlbXMuY29tXCI7XG5leHBvcnQgY29uc3QgU0VSVkVSX1VSTCA9IFwiaHR0cHM6Ly9cIiArIEJBU0VfU0VSVkVSX1VSTDtcbmV4cG9ydCBjb25zdCBXU19TRVJWRVJfVVJMID0gXCJ3c3M6Ly9cIiArIEJBU0VfU0VSVkVSX1VSTDtcblxuUGFyc2UubGl2ZVF1ZXJ5U2VydmVyVVJMID0gXCJ3czovLzE3My4yMTIuMjA3LjIyMjo1ODA4MFwiOyAvL2B3czovLyR7QkFTRV9TRVJWRVJfVVJMfWBcblxuUGFyc2UuTGl2ZVF1ZXJ5Lm9uKFwib3BlblwiLCAoKSA9PiB7XG4gIGNvbnNvbGUubG9nKFwic29ja2V0IGNvbm5lY3Rpb24gZXN0YWJsaXNoZWRcIik7XG59KTtcblxuUGFyc2UuTGl2ZVF1ZXJ5Lm9uKFwiY2xvc2VcIiwgKCkgPT4ge1xuICBjb25zb2xlLmxvZyhcInNvY2tldCBjb25uZWN0aW9uIGNsb3NlZFwiKTtcbn0pO1xuXG5QYXJzZS5MaXZlUXVlcnkub24oXCJlcnJvclwiLCBlcnJvciA9PiB7XG4gIGNvbnNvbGUubG9nKFwic29ja2V0IGVycm9yXCIsIGVycm9yKTtcbn0pO1xuXG5pbnRlcmZhY2UgSVNldHRpbmdzIHtcbiAgZGVmYXVsdEJhbm5lcj86IHN0cmluZztcbiAgZGVmYXVsdFZpZGVvPzogc3RyaW5nO1xuICBkZWZhdWx0UlNTPzogc3RyaW5nO1xufVxuY29uc3QgTU9EVUxFID0gXCJQU2lnblN0b3JlXCI7XG5AYXV0b2JpbmRcbmV4cG9ydCBjbGFzcyBQU2lnblN0b3JlIHtcbiAgc3RhdGljIHN1YnNjcmlwdGlvblRpbWVTbG90czogYW55O1xuICBzdGF0aWMgc3Vic2NyaXB0aW9uU2V0dGluZ3M6IGFueTtcbiAgbG9jYXRpb246IHtcbiAgICBsYXRpdHVkZTogbnVtYmVyO1xuICAgIGxvbmdpdHVkZTogbnVtYmVyO1xuICAgIGFsdGl0dWRlOiBudW1iZXI7XG4gICAgYWNjdXJhY3k6IG51bWJlcjtcbiAgICBoZWFkaW5nOiBudW1iZXI7XG4gICAgc3BlZWQ6IG51bWJlcjtcbiAgfTtcblxuICBAb2JzZXJ2YWJsZSBsYXRlc3RTbmFwc2hvdCA9IG51bGw7XG5cbiAgdXBkYXRlVGltZXIgPSBudWxsO1xuICBhc3luYyB3YXRjaExvY2F0aW9uKCkge1xuICAgIHZhciB1cGRhdGVUaHJlYWQgPSAoKSA9PiB7XG4gICAgICAvL1xuICAgICAgY29uc29sZS5sb2coXCJ1cGRhdGVUaHJlYWQgc3RhcnRlZC4uLlwiKTtcblxuICAgICAgLy91dWlkXG4gICAgICB2YXIgRGV2aWNlcyA9IFBhcnNlLk9iamVjdC5leHRlbmQoXCJEZXZpY2VzXCIpO1xuICAgICAgdmFyIHF1ZXJ5ID0gbmV3IFBhcnNlLlF1ZXJ5KERldmljZXMpO1xuICAgICAgdmFyIHV1aWQgPSBFeHBvLkNvbnN0YW50cy5kZXZpY2VJZDtcblxuICAgICAgdmFyIGNvb3JkczogYW55ID0gdGhpcy5sb2NhdGlvbiB8fCB7fTtcblxuICAgICAgcXVlcnlcbiAgICAgICAgLmVxdWFsVG8oXCJ1dWlkXCIsIHV1aWQpXG4gICAgICAgIC5maW5kKG51bGwpXG4gICAgICAgIC50aGVuKGFzeW5jIGRldmljZXMgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiZm91bmQgZGV2aWNlXCIsIHsgZGV2aWNlcyB9KTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcInVwZGF0ZVRocmVhZCB3YXRjaExvY2F0aW9uLi4uXCIpO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgZGV2aWNlID0gbmV3IERldmljZXMoKTtcbiAgICAgICAgICAgIGlmIChkZXZpY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmb3VuZCBpdFwiLCBkZXZpY2VzKTtcbiAgICAgICAgICAgICAgZGV2aWNlID0gZGV2aWNlc1swXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBsb25naXR1ZGUgPSBjb29yZHMubG9uZ2l0dWRlIHx8IFwiXCI7XG4gICAgICAgICAgICB2YXIgbGF0aXR1ZGUgPSBjb29yZHMubGF0aXR1ZGUgfHwgXCJcIjtcbiAgICAgICAgICAgIHZhciBuYW1lID0gXCJwaG90by5qcGdcIjtcbiAgICAgICAgICAgIHZhciBwYXJzZUZpbGUgPSBudWxsO1xuICAgICAgICAgICAgLy8gaWYgKHRvSlModGhpcy5sYXRlc3RTbmFwc2hvdCkgIT0gbnVsbCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcGFyc2VGaWxlID0gbmV3IFBhcnNlLkZpbGUobmFtZSwge1xuICAgICAgICAgICAgICAgIGJhc2U2NDogdG9KUyh0aGlzLmxhdGVzdFNuYXBzaG90KVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgYXdhaXQgcGFyc2VGaWxlLnNhdmUobnVsbCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZmFpbGVkIHRvIHVwbG9hZDogXCIsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICBkZXZpY2Uuc2V0KFwidXVpZFwiLCB1dWlkKTtcbiAgICAgICAgICAgIGRldmljZS5zZXQoXG4gICAgICAgICAgICAgIFwibG9jYXRpb25cIixcbiAgICAgICAgICAgICAgbmV3IFBhcnNlLkdlb1BvaW50KHtcbiAgICAgICAgICAgICAgICBsb25naXR1ZGU6IGxvbmdpdHVkZS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgIGxhdGl0dWRlOiBsYXRpdHVkZS50b1N0cmluZygpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZGV2aWNlLnNldChcInBob3RvXCIsIHBhcnNlRmlsZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNhdmluZyBkZXZpY2VcIiwge1xuICAgICAgICAgICAgICB1dWlkLFxuICAgICAgICAgICAgICBsb25naXR1ZGUsXG4gICAgICAgICAgICAgIGxhdGl0dWRlLFxuICAgICAgICAgICAgICBzczogdG9KUyh0aGlzLmxhdGVzdFNuYXBzaG90KVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGF3YWl0IGRldmljZS5zYXZlKG51bGwpO1xuXG4gICAgICAgICAgICAvLyBhZGQgc25hcHNob3QgdG8gcm91dGUgbGlzdGluZ1xuICAgICAgICAgICAgdmFyIHNuYXBzaG90ID0gbmV3IFBhcnNlLk9iamVjdChcIlNuYXBzaG90c1wiKTtcbiAgICAgICAgICAgIHNuYXBzaG90LnNldChcImRldmljZVwiLCBkZXZpY2UpO1xuICAgICAgICAgICAgc25hcHNob3Quc2V0KFxuICAgICAgICAgICAgICBcImxvY2F0aW9uXCIsXG4gICAgICAgICAgICAgIG5ldyBQYXJzZS5HZW9Qb2ludCh7XG4gICAgICAgICAgICAgICAgbG9uZ2l0dWRlOiBsb25naXR1ZGUudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICBsYXRpdHVkZTogbGF0aXR1ZGUudG9TdHJpbmcoKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHNuYXBzaG90LnNldChcInBob3RvXCIsIHBhcnNlRmlsZSk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBhd2FpdCBzbmFwc2hvdC5zYXZlKG51bGwpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZmFpbGVkIHRvIHVwbG9hZCBzbmFwc2hvdFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIC50aGVuKGsgPT4gY29uc29sZS5sb2coaykpXG4gICAgICAgICAgICAvLyAuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUlwiLCBlcnIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGxldCB7IHN0YXR1cyB9ID0gYXdhaXQgUGVybWlzc2lvbnMuYXNrQXN5bmMoUGVybWlzc2lvbnMuTE9DQVRJT04pO1xuICAgIC8vIGFsZXJ0KFwic3RhdHVzOiBcIiArIHN0YXR1cyk7XG4gICAgaWYgKHN0YXR1cyAhPT0gXCJncmFudGVkXCIpIHtcbiAgICAgIGFsZXJ0KFwiUGVybWlzc2lvbiB0byBhY2Nlc3MgbG9jYXRpb24gd2FzIGRlbmllZFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gYWxlcnQoXCJQZXJtaXNzaW9uIHRvIGFjY2VzcyBsb2NhdGlvbiB3YXMgZ3JhbnRlZFwiKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiTG9jYXRpb24gYWNjZXNzIGdyYW50ZWRcIik7XG4gICAgICB0aGlzLnVwZGF0ZVRpbWVyID0gc2V0SW50ZXJ2YWwodXBkYXRlVGhyZWFkLCAxMDAwICogNjAgKiA1KTtcblxuICAgICAgRXhwby5Mb2NhdGlvbi53YXRjaFBvc2l0aW9uQXN5bmMoXG4gICAgICAgIHtcbiAgICAgICAgICBlbmFibGVIaWdoQWNjdXJhY3k6IHRydWUsXG4gICAgICAgICAgdGltZUludGVydmFsOiAxMDAwICogNjAgKiA1IC8qLCBkaXN0YW5jZUludGVydmFsOiA1ICAtLSBtaWdodCBoYXZlIHRvIG9wdGltaXplIHRoaXMgKi9cbiAgICAgICAgfSxcbiAgICAgICAgKHsgY29vcmRzIH0pID0+IHtcbiAgICAgICAgICB0aGlzLmxpb24gPSBjb29yZHM7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgICB2YXIgbG9jYXRpb24gPSBhd2FpdCBFeHBvLkxvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbkFzeW5jKHtcbiAgICAgICAgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHRoaXMubG9jYXRpb24gPSBsb2NhdGlvbi5jb29yZHM7XG4gICAgICAvLyBSdW4gYXRsZWFzdCBvbmNlIC4uLlxuICAgICAgdXBkYXRlVGhyZWFkKCk7XG4gICAgfVxuICB9XG4gIGFzeW5jIGZldGNoUnNzKF91cmwpIHtcbiAgICBsZXQgdXJsID0gX3VybDtcbiAgICB1cmwgPSBgaHR0cDovL3F1ZXJ5LnlhaG9vYXBpcy5jb20vdjEvcHVibGljL3lxbD9xPXNlbGVjdCUyMColMjBmcm9tJTIwZmVlZG5vcm1hbGl6ZXIlMjB3aGVyZSUyMHVybD0lMjcke3VybH0lMjclMjBhbmQlMjBvdXRwdXQ9JTI3YXRvbV8xLjAlMjcmZm9ybWF0PWpzb25gO1xuICAgIGNvbnNvbGUubG9nKHVybCk7XG4gICAgcmV0dXJuIGF3YWl0IGZldGNoKHVybCkudGhlbihyZXMgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJmZXRjaFJzc1wiLCB7IHJlcyB9KTtcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgaW5pdFN0b3JlKCkge1xuICAgIC8vIHNldHVwIGluZGV4ZXNcbiAgICAvLyB0cnkge1xuICAgIC8vICAgdmFyIHJlc3VsdCA9IGF3YWl0IHRoaXMuZGIuY3JlYXRlSW5kZXgoe1xuICAgIC8vICAgICBpbmRleDoge1xuICAgIC8vICAgICAgIGZpZWxkczogW1widGltZXN0YW1wXCJdXG4gICAgLy8gICAgIH1cbiAgICAvLyAgIH0pO1xuICAgIC8vICAgY29uc29sZS5sb2coXCJpbmRleCBjcmVhdGVkOiBcIiwgcmVzdWx0KTtcbiAgICAvLyB9IGNhdGNoIChlcnIpIHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgLy8gfVxuICAgIGxldCBxdWVyeSA9IG5ldyBQYXJzZS5RdWVyeShcIlNldHRpbmdzXCIpO1xuICAgIFBTaWduU3RvcmUuc3Vic2NyaXB0aW9uU2V0dGluZ3MgPSBxdWVyeS5zdWJzY3JpYmUoKTtcblxuICAgIFBTaWduU3RvcmUuc3Vic2NyaXB0aW9uU2V0dGluZ3Mub24oXCJvcGVuXCIsICgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGAke01PRFVMRX06IFN1YnNjcmliZWQgdG8gU2V0dGluZ3NgKTtcbiAgICAgIHRoaXMuZ2V0RGVmYXVsdFNldHRpbmdzKCk7XG4gICAgfSk7XG5cbiAgICBQU2lnblN0b3JlLnN1YnNjcmlwdGlvblNldHRpbmdzLm9uKFwidXBkYXRlXCIsIChzZXR0aW5nOiBQYXJzZS5PYmplY3QpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGA9PT09PT09PT09PT09PT09PSR7TU9EVUxFfTogU2V0dGluZ3MgdXBkYXRlZD09PT09PT09PT09PT09PT1gKTtcbiAgICAgIHZhciB2aWRlbyA9IHNldHRpbmcuZ2V0KFwiZGVmYXVsdFZpZGVvXCIpO1xuICAgICAgdmFyIGJhbm5lciA9IHNldHRpbmcuZ2V0KFwiZGVmYXVsdEJhbm5lclwiKTtcblxuICAgICAgY29uc29sZS5sb2coXCJzZXR0aW5nOiBcIiwgc2V0dGluZyk7XG5cbiAgICAgIHRoaXMuc2V0dGluZ3MgPSB7XG4gICAgICAgIGRlZmF1bHRWaWRlbzogdmlkZW8gJiYgdmlkZW8udXJsKCksXG4gICAgICAgIGRlZmF1bHRSU1M6IHNldHRpbmcuZ2V0KFwiZGVmYXVsdFJTU1wiKSxcbiAgICAgICAgZGVmYXVsdEJhbm5lcjogYmFubmVyICYmIGJhbm5lci51cmwoKVxuICAgICAgfTtcbiAgICAgIGNvbnNvbGUubG9nKFwic2V0dGluZ3M6IFwiLCB0b0pTKHRoaXMuc2V0dGluZ3MpKTtcblxuICAgICAgLy9TaG91bGQgc3RhcnQgZG93bmxvYWRpbmcgbmV3IGFzc2V0cyBpbW1lZGlhdGVseVxuICAgICAgLy8gdGhpcy5zeW5jREIoKTsgLy9sZXRzIHVwZGF0ZS5cbiAgICB9KTtcblxuICAgIFBTaWduU3RvcmUuc3Vic2NyaXB0aW9uU2V0dGluZ3Mub24oXCJlcnJvclwiLCBlcnJvciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcImNvbm5lY3Rpb24gZXJyb3JcIiwgZXJyb3IpO1xuICAgIH0pO1xuXG4gICAgcXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkoXCJUaW1lU2xvdHNcIik7XG4gICAgUFNpZ25TdG9yZS5zdWJzY3JpcHRpb25UaW1lU2xvdHMgPSBxdWVyeS5zdWJzY3JpYmUoKTtcblxuICAgIFBTaWduU3RvcmUuc3Vic2NyaXB0aW9uVGltZVNsb3RzLm9uKFwib3BlblwiLCAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhgJHtNT0RVTEV9OiBTdWJzY3JpYmVkIHRvIFRpbWVTbG90c2ApO1xuICAgICAgdGhpcy5nZXREZWZhdWx0U2V0dGluZ3MoKTtcbiAgICB9KTtcblxuICAgIFBTaWduU3RvcmUuc3Vic2NyaXB0aW9uVGltZVNsb3RzLm9uKFwiY3JlYXRlXCIsICh0aW1lc2xvdDogUGFyc2UuT2JqZWN0KSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhgPT09PT09PT09PT09PT09PT0ke01PRFVMRX06IFRpbWVTbG90cyBuZXc9PT09PT09PT09PT09PT09YCwgdGltZXNsb3QpO1xuXG4gICAgICB0aGlzLnN5bmNEQigpO1xuICAgIH0pO1xuXG4gICAgUFNpZ25TdG9yZS5zdWJzY3JpcHRpb25UaW1lU2xvdHMub24oXCJ1cGRhdGVcIiwgKHRpbWVzbG90OiBQYXJzZS5PYmplY3QpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGA9PT09PT09PT09PT09PT09PSR7TU9EVUxFfTogVGltZVNsb3RzIHVwZGF0ZWQ9PT09PT09PT09PT09PT09YCwgdGltZXNsb3QpO1xuXG4gICAgICB0aGlzLnN5bmNEQigpO1xuICAgIH0pO1xuXG4gICAgUFNpZ25TdG9yZS5zdWJzY3JpcHRpb25UaW1lU2xvdHMub24oXCJlcnJvclwiLCBlcnJvciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcImNvbm5lY3Rpb24gZXJyb3JcIiwgZXJyb3IpO1xuICAgIH0pO1xuXG4gICAgdmFyIGRvU3luYyA9IChqdXN0NU1pbnM/KSA9PiB7XG4gICAgICB0aGlzLmdldERlZmF1bHRTZXR0aW5ncygpO1xuICAgICAgdGhpcy5zeW5jREIoanVzdDVNaW5zKTsgLy9sZXRzIHVwZGF0ZS5cbiAgICB9O1xuXG4gICAgLypCYWNrZ3JvdW5kVGltZXIuKi8gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBkb1N5bmModHJ1ZSk7XG4gICAgfSwgMTAwMCAqIDYwICogMSk7XG5cbiAgICBkb1N5bmMoKTtcblxuICAgIHRyeSB7XG4gICAgICBsZXQgeyBzdGF0dXMgfSA9IGF3YWl0IFBlcm1pc3Npb25zLmdldEFzeW5jKFBlcm1pc3Npb25zLkNBTUVSQSk7XG5cbiAgICAgIGlmIChzdGF0dXMgIT09IFwiZ3JhbnRlZFwiKSB7XG4gICAgICAgIC8qQmFja2dyb3VuZFRpbWVyLiovIHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGxldCB7IHN0YXR1cyB9ID0gYXdhaXQgUGVybWlzc2lvbnMuYXNrQXN5bmMoUGVybWlzc2lvbnMuQ0FNRVJBKTtcbiAgICAgICAgICBpZiAoc3RhdHVzID09IFwiZ3JhbnRlZFwiKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdyYW50ZWQhXCIsIHN0YXR1cyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFsZXJ0KFwiUGVybWlzc2lvbiB0byBhY2Nlc3MgY2FtZXJhIHdhcyBkZW5pZWRcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgeyBzdGF0dXMgfSA9IGF3YWl0IFBlcm1pc3Npb25zLmdldEFzeW5jKFBlcm1pc3Npb25zLkxPQ0FUSU9OKTtcblxuICAgICAgICBpZiAoc3RhdHVzICE9PSBcImdyYW50ZWRcIikge1xuICAgICAgICAgIC8qQmFja2dyb3VuZFRpbWVyLiovIHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHsgc3RhdHVzIH0gPSBhd2FpdCBQZXJtaXNzaW9ucy5hc2tBc3luYyhQZXJtaXNzaW9ucy5MT0NBVElPTik7XG4gICAgICAgICAgICBpZiAoc3RhdHVzID09IFwiZ3JhbnRlZFwiKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR3JhbnRlZCFcIiwgc3RhdHVzKTtcbiAgICAgICAgICAgICAgLy8gbm93IHlvdSBjYW4gc2V0IHRoZSBsaXN0ZW5uZXIgdG8gd2F0Y2ggdGhlIHVzZXIgZ2VvIGxvY2F0aW9uXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhbGVydChcIlBlcm1pc3Npb24gdG8gYWNjZXNzIGxvY2F0aW9uIHdhcyBkZW5pZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICB9XG4gIH1cbiAgd2F0Y2hJRDogbnVtYmVyO1xuICBpbml0aWFsUG9zaXRpb246IENvb3JkaW5hdGVzO1xuXG4gIFNFUlZFUl9VUkwgPSBTRVJWRVJfVVJMO1xuICAvLyBUeXBlIDM6IFBlcnNpc3RlbnQgZGF0YXN0b3JlIHdpdGggYXV0b21hdGljIGxvYWRpbmdcbiAgLy8gIGRiID0gbmV3IERhdGFzdG9yZSh7IGZpbGVuYW1lOiBcImFzeW5jU3RvcmFnZUtleVwiLCBhdXRvbG9hZDogdHJ1ZSB9KTtcbiAgZGIgPSBkYjtcbiAgQG9ic2VydmFibGUgVVVJRDogc3RyaW5nO1xuXG4gIEBvYnNlcnZhYmxlXG4gIGN1cnJlbnRfbG9jYXRpb246IHtcbiAgICBMb25naXR1ZGU/OiBhbnk7XG4gICAgTGF0aXR1ZGU/OiBhbnk7XG4gICAgc3BlZWQ/OiBhbnk7XG4gICAgYWNjdXJhY3k/OiBhbnk7XG4gICAgaGVhZGluZz86IGFueTtcbiAgICBhbHRpdHVkZT86IGFueTtcbiAgICBhbHRpdHVkZUFjY3VyYWN5PzogYW55O1xuICB9ID0ge307XG5cbiAgQG9ic2VydmFibGUgc3luY01lc3NhZ2U6IHN0cmluZyA9IFwiXCI7XG5cbiAgQG9ic2VydmFibGVcbiAgc2V0dGluZ3M6IElTZXR0aW5ncyA9IHtcbiAgICBkZWZhdWx0QmFubmVyOiBcIlwiLFxuICAgIGRlZmF1bHRWaWRlbzogXCJcIixcbiAgICBkZWZhdWx0UlNTOiBcIlwiXG4gIH07XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5pbml0U3RvcmUoKTtcbiAgfVxuXG4gIEBhY3Rpb25cbiAgYXN5bmMgZ2V0RGVmYXVsdFNldHRpbmdzKCkge1xuICAgIHZhciBTZXR0aW5ncyA9IFBhcnNlLk9iamVjdC5leHRlbmQoXCJTZXR0aW5nc1wiKTtcbiAgICB2YXIgcXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkoU2V0dGluZ3MpO1xuICAgIHRyeSB7XG4gICAgICBjb25zb2xlLmxvZyhcImdldHRpbmcgc2V0dGluZ3MgLi4uXCIpO1xuICAgICAgdmFyIHNldHRpbmcgPSBhd2FpdCBxdWVyeS5maXJzdChudWxsKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiZ2V0dGluZyBzZXR0aW5ncyAyLi4uXCIpO1xuXG4gICAgICB2YXIgdmlkZW8gPSBzZXR0aW5nLmdldChcImRlZmF1bHRWaWRlb1wiKTtcbiAgICAgIHZhciBiYW5uZXIgPSBzZXR0aW5nLmdldChcImRlZmF1bHRCYW5uZXJcIik7XG5cbiAgICAgIGNvbnNvbGUubG9nKFwic2V0dGluZzogXCIsIHNldHRpbmcpO1xuXG4gICAgICB0aGlzLnNldHRpbmdzID0ge1xuICAgICAgICBkZWZhdWx0VmlkZW86IHZpZGVvICYmIHZpZGVvLnVybCgpLFxuICAgICAgICBkZWZhdWx0UlNTOiBzZXR0aW5nLmdldChcImRlZmF1bHRSU1NcIiksXG4gICAgICAgIGRlZmF1bHRCYW5uZXI6IGJhbm5lciAmJiBiYW5uZXIudXJsKClcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuY2FjaGVNZWRpYSh0aGlzLnNldHRpbmdzLmRlZmF1bHRWaWRlbyk7XG4gICAgICB0aGlzLmNhY2hlTWVkaWEodGhpcy5zZXR0aW5ncy5kZWZhdWx0QmFubmVyKTtcblxuICAgICAgY29uc29sZS5sb2coXCJzZXR0aW5nczogXCIsIHRvSlModGhpcy5zZXR0aW5ncykpO1xuICAgICAgcmV0dXJuIHRoaXMuc2V0dGluZ3M7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICB9XG4gIH1cblxuICBAYWN0aW9uXG4gIGFzeW5jIHN5bmNEQihqdXN0NU1pbnMgPSBmYWxzZSkge1xuICAgIC8vU2hvdWxkIHN0YXJ0IGRvd25sb2FkaW5nIG5ldyBhc3NldHMgaW1tZWRpYXRlbHlcbiAgICB0cnkge1xuICAgICAgdGhpcy5zeW5jTWVzc2FnZSA9IFwiVXBkYXRpbmcgTG9jYWwgREIgLi4uXCI7XG4gICAgICBjb25zb2xlLmxvZyhgJHtNT0RVTEV9OiBVcGRhdGluZyBMb2NhbCBEQiAuLi4gJHtqdXN0NU1pbnMgPyBcIjUgbWluXCIgOiBcIlwifWApO1xuXG4gICAgICB2YXIgZGF0ZWlzdG9yZSA9IEpTT04ucGFyc2UoYXdhaXQgQXN5bmNTdG9yYWdlLmdldEl0ZW0oXCJAbGFzdFN5bmNlZERhdGVcIikpO1xuICAgICAgLy8gY29uc29sZS5sb2coeyBkYXRlaXN0b3JlLCBwYXJzZWQ6IERhdGUucGFyc2UoZGF0ZWlzdG9yZSkgfSk7XG4gICAgICB2YXIgbGFzdFN5bmNlZERhdGUgPSBuZXcgRGF0ZShEYXRlLnBhcnNlKGRhdGVpc3RvcmUgfHwgXCIwMS8wMS8xOTcwXCIpKTtcblxuICAgICAgY29uc29sZS5sb2coXCJPbmx5IHN5bmNpbmcgc3R1ZmYgbmV3ZXIgdGhhbjogXCIgKyBsYXN0U3luY2VkRGF0ZS50b1N0cmluZygpKTtcbiAgICAgIC8vIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFNFUlZFUl9VUkwgKyBcIi9sb2FkQWxsTmV3U2xvdHNcIik7XG4gICAgICAvLyBsZXQgcmVzcG9uc2VKc29uID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgdmFyIGRhdGUgPSBtb21lbnQobmV3IERhdGUoKSlcbiAgICAgICAgLmFkZCgtNSwgXCJtaW51dGVzXCIpXG4gICAgICAgIC50b0RhdGUoKTtcbiAgICAgIHZhciBzbG90c1F1ZXJ5ID0gbmV3IFBhcnNlLlF1ZXJ5KFwiVGltZVNsb3RzXCIpLmluY2x1ZGUoXCJ2aWRlb1wiKS5hZGREZXNjZW5kaW5nKFwiY3JlYXRlZEF0XCIpO1xuICAgICAgLy8gaWYgKGp1c3Q1TWlucykge1xuICAgICAgc2xvdHNRdWVyeS5ncmVhdGVyVGhhbk9yRXF1YWxUbyhcInVwZGF0ZWRBdFwiLCBqdXN0NU1pbnMgPyBkYXRlIDogbGFzdFN5bmNlZERhdGUpO1xuICAgICAgLy8gfVxuXG4gICAgICB2YXIgc2xvdHMgPSAoYXdhaXQgc2xvdHNRdWVyeS5maW5kKG51bGwpKVxuICAgICAgICAubWFwKGsgPT4gay50b0pTT04oKSlcbiAgICAgICAgLm1hcChrID0+IHtcbiAgICAgICAgICB2YXIgeyB2aWRlbyB9ID0gaztcbiAgICAgICAgICBrLnZpZGVvID0gKHZpZGVvICYmIHZpZGVvLmZpbGUgJiYgdmlkZW8uZmlsZS51cmwpIHx8IFwiXCI7XG4gICAgICAgICAgcmV0dXJuIGs7XG4gICAgICAgIH0pO1xuXG4gICAgICAvLyByZXR1cm4gcmVzcG9uc2VKc29uLnVzZXJzO1xuICAgICAgLy8gICAgICAgICAgICAgICAgIGRiLmJ1bGtEb2NzKHJlc3BvbnNlSnNvbikudGhlbigocmVzdWx0KSA9PntcbiAgICAgIC8vICAgLy8gaGFuZGxlIHJlc3VsdFxuICAgICAgLy8gICBjb25zb2xlLmxvZyhcImJ1bGtJbnNlcnQgcmVzdWx0XCIscmVzdWx0KTtcbiAgICAgIC8vICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7c3luY01lc3NhZ2U6XCJcIn0pO1xuICAgICAgLy8gfSkuY2F0Y2goIChlcnIpID0+e1xuICAgICAgLy8gICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgLy8gICAgICAgICB0aGlzLnNldFN0YXRlKHtzeW5jTWVzc2FnZTpcInN5bmNFcnJvcjpcIiArIGVycn0pO1xuXG4gICAgICBjb25zb2xlLmxvZyhcIm9zbG90c1wiLCBzbG90cyk7XG5cbiAgICAgIHNsb3RzID0gc2xvdHMubWFwKGsgPT4ge1xuICAgICAgICBrLnNlcnZlcklkID0gay5faWQ7XG4gICAgICAgIC8vTGV0cyBzaGFyZSB0aGUgc2VydmVySWQgc28gaXQgYmVjb21lcyBhbiB1cGRhdGUgaW5zdGVhZFxuICAgICAgICAvLyBkZWxldGUgay5faWQ7XG5cbiAgICAgICAgLy8gICBjb25zb2xlLmxvZyhtb21lbnQoay50aW1lc3RhbXApLmdldERhdGUoKSk7XG4gICAgICAgIC8vIGsub3RpbWVzdGFtcCA9IGsudGltZXN0YW1wO1xuICAgICAgICBrLnRpbWVzdGFtcCA9XG4gICAgICAgICAgbW9tZW50KGsudGltZXN0YW1wLmlzbylcbiAgICAgICAgICAgIC50b0RhdGUoKVxuICAgICAgICAgICAgLmdldFRpbWUoKSAqIDE7XG4gICAgICAgIHJldHVybiBrO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnNvbGUubG9nKFwic2xvdHNcIiwgc2xvdHMpO1xuXG4gICAgICAvL1ByZS1jYWNoZSBhbGwgdmlkZW9zXG4gICAgICBzbG90cy5tYXAoYXN5bmMgc2xvdCA9PiB7XG4gICAgICAgIGF3YWl0IHRoaXMuY2FjaGVNZWRpYShzbG90LnZpZGVvKTtcbiAgICAgIH0pO1xuICAgICAgLy8gfSk7XG4gICAgICB2YXIgZG9JbnNlcnQgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gdmFyIHJlc3VsdCA9IGF3YWl0IHRoaXMuZGIuYnVsa0RvY3Moc2xvdHMpO1xuICAgICAgICAgIHZhciByZXN1bHQgPSBhd2FpdCB0aGlzLmRiLmluc2VydEFzeW5jKHNsb3RzKTtcbiAgICAgICAgICAvLyByZXN1bHQgaXMgYW4gYXJyYXkgd2l0aCB0aGVzZSBkb2N1bWVudHMsIGF1Z21lbnRlZCB3aXRoIHRoZWlyIF9pZFxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW5zZXJ0IHN1Y2Nlc3NmdWxcIiwgeyByZXN1bHQgfSk7XG4gICAgICAgICAgbGFzdFN5bmNlZERhdGUgPSBuZXcgRGF0ZSgpO1xuXG4gICAgICAgICAgYXdhaXQgQXN5bmNTdG9yYWdlLnNldEl0ZW0oXCJAbGFzdFN5bmNlZERhdGVcIiwgSlNPTi5zdHJpbmdpZnkobGFzdFN5bmNlZERhdGUpKTtcbiAgICAgICAgICB0aGlzLnN5bmNNZXNzYWdlID0gXCJcIjtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBvbiBpbnNlcnRcIiwgZXJyKTtcblxuICAgICAgICAgIHRoaXMuc3luY01lc3NhZ2UgPSBcInN5bmNFcnJvcjpcIiArIGVycjtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgaWYgKCFqdXN0NU1pbnMpIHtcbiAgICAgICAgLy9DbGVhciBEQiBmaXJzdCwgbWlnaHQgbm90IGJlIG5lZWRlZFxuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhciBudW1SZW1vdmVkID0gdGhpcy5kYi5yZW1vdmUoe30sIHsgbXVsdGk6IHRydWUgfSk7XG4gICAgICAgICAgY29uc29sZS5sb2coYCR7TU9EVUxFfTogY2xlYXJlZCBkYmAsIG51bVJlbW92ZWQpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIG9uIHJlbW92ZVwiLCBlcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZG9JbnNlcnQoKTtcbiAgICAgICAgLy8gfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb0luc2VydCgpO1xuICAgICAgfVxuICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2VKc29uKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgLy8gSGFuZGxlIGVycm9yXG4gICAgICB0aGlzLnN5bmNNZXNzYWdlID0gXCJzeW5jRXJyb3I6XCIgKyBlcnJvcjtcbiAgICAgIGNvbnNvbGUubG9nKFwiRVJST1JcIiwgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgY2FjaGVNZWRpYSh2aWRlb1VybDogc3RyaW5nKSB7XG4gICAgY29uc29sZS5sb2coXCJjYWNoaW5nOiBcIiwgdmlkZW9VcmwpO1xuICAgIGlmICh2aWRlb1VybCAmJiB2aWRlb1VybC5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCB2aWRlb0Fzc2V0ID0gbmV3IEFzc2V0KHtcbiAgICAgICAgbmFtZTogdmlkZW9VcmwgJiYgdmlkZW9VcmwucmVwbGFjZSgvKD8hXFwuW14uXSskKVxcLnxbXlxcdy5dKy9nLCBcIlwiKS5yZXBsYWNlKFwiLm1wNFwiLCBcIlwiKSxcbiAgICAgICAgdHlwZTogXCJtcDRcIixcbiAgICAgICAgLy8gcGF0aCB0byB0aGUgZmlsZSBzb21ld2hlcmUgb24gdGhlIGludGVybmV0XG4gICAgICAgIHVyaTogdmlkZW9VcmwsXG4gICAgICAgIGhhc2g6IHZpZGVvVXJsICYmIHZpZGVvVXJsLnJlcGxhY2UoXCIuXCIsIFwiX1wiKVxuICAgICAgfSBhcyBhbnkpO1xuICAgICAgYXdhaXQgdmlkZW9Bc3NldC5kb3dubG9hZEFzeW5jV2l0aG91dEhhc2goeyBjYWNoZTogdHJ1ZSB9KTtcbiAgICB9XG4gIH1cbiAgLy8gdXBsb2FkUGhvdG9Ub1BhcnNlKHBob3RvVVJMKSB7XG4gIC8vICAgLy8gcGhvdG9VUkw9XCJmaWxlOi8vL1VzZXJzL3dvb2tpZW0vbG9nby5qcGdcIlxuICAvLyAgIHZhciB1dWlkID0gQ29uc3RhbnRzLmRldmljZUlkO1xuXG4gIC8vICAgdmFyIHBob3RvID0ge1xuICAvLyAgICAgdXJpOiB1cmlGcm9tQ2FtZXJhUm9sbCxcbiAgLy8gICAgIHR5cGU6IFwiaW1hZ2UvanBlZ1wiLFxuICAvLyAgICAgbmFtZTogXCJwaG90by5qcGdcIlxuICAvLyAgIH07XG5cbiAgLy8gICB2YXIgYm9keSA9IG5ldyBGb3JtRGF0YSgpO1xuICAvLyAgIGJvZHkuYXBwZW5kKFwiYXV0aFRva2VuXCIsIFwic2VjcmV0XCIpO1xuICAvLyAgIGJvZHkuYXBwZW5kKFwicGhvdG9cIiwgcGhvdG8pO1xuICAvLyAgIGJvZHkuYXBwZW5kKFwidGl0bGVcIiwgXCJBIGJlYXV0aWZ1bCBwaG90byFcIik7XG5cbiAgLy8gICB4aHIub3BlbihcIlBPU1RcIiwgc2VydmVyVVJMKTtcbiAgLy8gICB4aHIuc2VuZChib2R5KTtcblxuICAvLyAgIGZldGNoKFwiaHR0cHM6Ly9hcGkucGFyc2UuY29tLzEvZmlsZXMvcGljLmpwZ1wiLCB7XG4gIC8vICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAvLyAgICAgaGVhZGVyczoge1xuICAvLyAgICAgICBcIlgtUGFyc2UtQXBwbGljYXRpb24tSWRcIjogQ09ORklHLlBBUlNFX0FQUF9JRCxcbiAgLy8gICAgICAgXCJYLVBhcnNlLVJFU1QtQVBJLUtleVwiOiBDT05GSUcuUEFSU0VfUkVTVF9BUElfS0VZLFxuICAvLyAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImltYWdlL2pwZWdcIlxuICAvLyAgICAgfSxcbiAgLy8gICAgIGJvZHk6IFwiZGF0YT1cIiArIGVuY29kZVVSSUNvbXBvbmVudChwaG90b1VSTClcbiAgLy8gICB9KVxuICAvLyAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAvLyAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDAgfHwgcmVzcG9uc2Uuc3RhdHVzID09PSAyMDEpIHtcbiAgLy8gICAgICAgICByZXR1cm4ge307XG4gIC8vICAgICAgIH0gZWxzZSB7XG4gIC8vICAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UocmVzcG9uc2UuX2JvZHlJbml0KTtcbiAgLy8gICAgICAgICB0aHJvdyByZXM7XG4gIC8vICAgICAgIH1cbiAgLy8gICAgIH0pXG4gIC8vICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAvLyAgICAgICB0aHJvdyBlcnJvcjtcbiAgLy8gICAgIH0pO1xuICAvLyB9XG59XG5cbmV4cG9ydCBjb25zdCBwc2lnblN0b3JlID0gbmV3IFBTaWduU3RvcmUoKTtcbiJdfQ==