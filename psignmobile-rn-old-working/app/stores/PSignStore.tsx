import { AsyncStorage } from "react-native";


// var setTimeout = /*BackgroundTimer.*/setTimeout.bind(BackgroundTimer);
// var setInterval = /*BackgroundTimer.*/setInterval.bind(BackgroundTimer);
// var clearTimeout = BackgroundTimer.clearTimeout.bind(BackgroundTimer);
// var clearInterval = BackgroundTimer.clearInterval.bind(BackgroundTimer);

import * as moment from "moment";
import { observable, action, toJS } from "mobx";
// import * as Datastore from "react-native-local-mongodb";

import autobind from "autobind-decorator";
import * as Expo from "expo";
import { Permissions } from "expo";
import * as _ from "lodash";

// window.navigator.userAgent = "react-native";
// import PouchDB from "pouchdb-react-native";
// PouchDB.plugin(require('pouchdb-find'));

// const db = new PouchDB("psignStore");

interface IDatabase {
  findAsync: (options) => Promise<any>;
  insertAsync: (options) => Promise<any>;
  insert;
  find;
}
// Type 3: Persistent datastore with automatic loading
var Datastore = require("react-native-local-mongodb");
const db: IDatabase = new Datastore({ filename: "psignStore", autoload: true });

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

import { Asset } from "../components/enhancedAsset";

import * as Parse from "parse/react-native";
Parse.setAsyncStorage(AsyncStorage);

const CONFIG = {
  PARSE_SERVER: "https://psign.zeus.iriosystems.com/parse",
  PARSE_APP_ID: "psignApp",
  PARSE_REST_API_KEY: "psignApp"
};

Parse.initialize(CONFIG.PARSE_APP_ID);
Parse.serverURL = CONFIG.PARSE_SERVER;

export const BASE_SERVER_URL = "psign.zeus.iriosystems.com";
export const SERVER_URL = "https://" + BASE_SERVER_URL;
export const WS_SERVER_URL = "wss://" + BASE_SERVER_URL;

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

interface ISettings {
  defaultBanner?: string;
  defaultVideo?: string;
  defaultRSS?: string;
}
const MODULE = "PSignStore";
@autobind
export class PSignStore {
  static subscriptionTimeSlots: any;
  static subscriptionSettings: any;
  location: {
    latitude: number;
    longitude: number;
    altitude: number;
    accuracy: number;
    heading: number;
    speed: number;
  };

  @observable latestSnapshot = null;

  updateTimer = null;
  async watchLocation() {
    var updateThread = () => {
      //
      console.log("updateThread started...");

      //uuid
      var Devices = Parse.Object.extend("Devices");
      var query = new Parse.Query(Devices);
      var uuid = Expo.Constants.deviceId;

      var coords: any = this.location || {};

      query
        .equalTo("uuid", uuid)
        .find(null)
        .then(async devices => {
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
                base64: toJS(this.latestSnapshot)
              });
              await parseFile.save(null);
            } catch (e) {
              console.log("failed to upload: ", e);
            }
            // }

            device.set("uuid", uuid);
            device.set(
              "location",
              new Parse.GeoPoint({
                longitude: longitude.toString(),
                latitude: latitude.toString()
              })
            );
            device.set("photo", parseFile);
            console.log("saving device", {
              uuid,
              longitude,
              latitude,
              ss: toJS(this.latestSnapshot)
            });

            await device.save(null);

            // add snapshot to route listing
            var snapshot = new Parse.Object("Snapshots");
            snapshot.set("device", device);
            snapshot.set(
              "location",
              new Parse.GeoPoint({
                longitude: longitude.toString(),
                latitude: latitude.toString()
              })
            );
            snapshot.set("photo", parseFile);
            try {
              await snapshot.save(null);
            } catch (err) {
              console.log("failed to upload snapshot");
            }
            // .then(k => console.log(k))
            // .catch(err => console.log(err));
          } catch (err) {
            console.log("ERROR", err);
          }
        });
    };

    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    // alert("status: " + status);
    if (status !== "granted") {
      alert("Permission to access location was denied");
    } else {
      // alert("Permission to access location was granted");
      console.log("Location access granted");
      this.updateTimer = setInterval(updateThread, 1000 * 60 * 5);

      Expo.Location.watchPositionAsync(
        {
          enableHighAccuracy: true,
          timeInterval: 1000 * 60 * 5 /*, distanceInterval: 5  -- might have to optimize this */
        },
        ({ coords }) => {
          this.lion = coords;
        }
      );
      var location = await Expo.Location.getCurrentPositionAsync({
        enableHighAccuracy: true
      });
      this.location = location.coords;
      // Run atleast once ...
      updateThread();
    }
  }
  async fetchRss(_url) {
    let url = _url;
    url = `http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20feednormalizer%20where%20url=%27${url}%27%20and%20output=%27atom_1.0%27&format=json`;
    console.log(url);
    return await fetch(url).then(res => {
      console.log("fetchRss", { res });
      return res.json();
    });
  }

  async initStore() {
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
    PSignStore.subscriptionSettings = query.subscribe();

    PSignStore.subscriptionSettings.on("open", () => {
      console.log(`${MODULE}: Subscribed to Settings`);
      this.getDefaultSettings();
    });

    PSignStore.subscriptionSettings.on("update", (setting: Parse.Object) => {
      console.log(`=================${MODULE}: Settings updated================`);
      var video = setting.get("defaultVideo");
      var banner = setting.get("defaultBanner");

      console.log("setting: ", setting);

      this.settings = {
        defaultVideo: video && video.url(),
        defaultRSS: setting.get("defaultRSS"),
        defaultBanner: banner && banner.url()
      };
      console.log("settings: ", toJS(this.settings));

      //Should start downloading new assets immediately
      // this.syncDB(); //lets update.
    });

    PSignStore.subscriptionSettings.on("error", error => {
      console.log("connection error", error);
    });

    query = new Parse.Query("TimeSlots");
    PSignStore.subscriptionTimeSlots = query.subscribe();

    PSignStore.subscriptionTimeSlots.on("open", () => {
      console.log(`${MODULE}: Subscribed to TimeSlots`);
      this.getDefaultSettings();
    });

    PSignStore.subscriptionTimeSlots.on("create", (timeslot: Parse.Object) => {
      console.log(`=================${MODULE}: TimeSlots new================`, timeslot);

      this.syncDB();
    });

    PSignStore.subscriptionTimeSlots.on("update", (timeslot: Parse.Object) => {
      console.log(`=================${MODULE}: TimeSlots updated================`, timeslot);

      this.syncDB();
    });

    PSignStore.subscriptionTimeSlots.on("error", error => {
      console.log("connection error", error);
    });

    var doSync = (just5Mins?) => {
      this.getDefaultSettings();
      this.syncDB(just5Mins); //lets update.
    };

    /*BackgroundTimer.*/ setTimeout(() => {
      doSync(true);
    }, 1000 * 60 * 1);

    doSync();

    try {
      let { status } = await Permissions.getAsync(Permissions.CAMERA);

      if (status !== "granted") {
        /*BackgroundTimer.*/ setTimeout(async () => {
          let { status } = await Permissions.askAsync(Permissions.CAMERA);
          if (status == "granted") {
            console.log("Granted!", status);
          } else {
            alert("Permission to access camera was denied");
          }
        });

        let { status } = await Permissions.getAsync(Permissions.LOCATION);

        if (status !== "granted") {
          /*BackgroundTimer.*/ setTimeout(async () => {
            let { status } = await Permissions.askAsync(Permissions.LOCATION);
            if (status == "granted") {
              console.log("Granted!", status);
              // now you can set the listenner to watch the user geo location
            } else {
              alert("Permission to access location was denied");
            }
          });
        } else {
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  watchID: number;
  initialPosition: Coordinates;

  SERVER_URL = SERVER_URL;
  // Type 3: Persistent datastore with automatic loading
  //  db = new Datastore({ filename: "asyncStorageKey", autoload: true });
  db = db;
  @observable UUID: string;

  @observable
  current_location: {
    Longitude?: any;
    Latitude?: any;
    speed?: any;
    accuracy?: any;
    heading?: any;
    altitude?: any;
    altitudeAccuracy?: any;
  } = {};

  @observable syncMessage: string = "";

  @observable
  settings: ISettings = {
    defaultBanner: "",
    defaultVideo: "",
    defaultRSS: ""
  };

  constructor() {
    this.initStore();
  }

  @action
  async getDefaultSettings() {
    var Settings = Parse.Object.extend("Settings");
    var query = new Parse.Query(Settings);
    try {
      console.log("getting settings ...");
      var setting = await query.first(null);
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

      console.log("settings: ", toJS(this.settings));
      return this.settings;
    } catch (e) {
      console.error(e);
    }
  }

  @action
  async syncDB(just5Mins = false) {
    //Should start downloading new assets immediately
    try {
      this.syncMessage = "Updating Local DB ...";
      console.log(`${MODULE}: Updating Local DB ... ${just5Mins ? "5 min" : ""}`);

      var dateistore = JSON.parse(await AsyncStorage.getItem("@lastSyncedDate"));
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

      var slots = (await slotsQuery.find(null))
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
      slots.map(async slot => {
        await this.cacheMedia(slot.video);
      });
      // });
      var doInsert = async () => {
        try {
          // var result = await this.db.bulkDocs(slots);
          var result = await this.db.insertAsync(slots);
          // result is an array with these documents, augmented with their _id
          console.log("insert successful", { result });
          lastSyncedDate = new Date();

          await AsyncStorage.setItem("@lastSyncedDate", JSON.stringify(lastSyncedDate));
          this.syncMessage = "";
        } catch (err) {
          console.log("error on insert", err);

          this.syncMessage = "syncError:" + err;
        }
      };

      if (!just5Mins) {
        //Clear DB first, might not be needed
        try {
          var numRemoved = this.db.remove({}, { multi: true });
          console.log(`${MODULE}: cleared db`, numRemoved);
        } catch (err) {
          console.log("error on remove", err);
        }

        doInsert();
        // });
      } else {
        doInsert();
      }
      // console.log(responseJson);
    } catch (error) {
      // Handle error
      this.syncMessage = "syncError:" + error;
      console.log("ERROR", error);
    }
  }

  private async cacheMedia(videoUrl: string) {
    console.log("caching: ", videoUrl);
    if (videoUrl && videoUrl.length > 0) {
      const videoAsset = new Asset({
        name: videoUrl && videoUrl.replace(/(?!\.[^.]+$)\.|[^\w.]+/g, "").replace(".mp4", ""),
        type: "mp4",
        // path to the file somewhere on the internet
        uri: videoUrl,
        hash: videoUrl && videoUrl.replace(".", "_")
      } as any);
      await videoAsset.downloadAsyncWithoutHash({ cache: true });
    }
  }
  // uploadPhotoToParse(photoURL) {
  //   // photoURL="file:///Users/wookiem/logo.jpg"
  //   var uuid = Constants.deviceId;

  //   var photo = {
  //     uri: uriFromCameraRoll,
  //     type: "image/jpeg",
  //     name: "photo.jpg"
  //   };

  //   var body = new FormData();
  //   body.append("authToken", "secret");
  //   body.append("photo", photo);
  //   body.append("title", "A beautiful photo!");

  //   xhr.open("POST", serverURL);
  //   xhr.send(body);

  //   fetch("https://api.parse.com/1/files/pic.jpg", {
  //     method: "POST",
  //     headers: {
  //       "X-Parse-Application-Id": CONFIG.PARSE_APP_ID,
  //       "X-Parse-REST-API-Key": CONFIG.PARSE_REST_API_KEY,
  //       "Content-Type": "image/jpeg"
  //     },
  //     body: "data=" + encodeURIComponent(photoURL)
  //   })
  //     .then(response => {
  //       if (response.status === 200 || response.status === 201) {
  //         return {};
  //       } else {
  //         var res = JSON.parse(response._bodyInit);
  //         throw res;
  //       }
  //     })
  //     .catch(error => {
  //       throw error;
  //     });
  // }
}

export const psignStore = new PSignStore();
