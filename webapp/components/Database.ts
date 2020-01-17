import * as Parse from "parse";
// Parse.initialize("ABCDEFG12345");
// Parse.serverURL = "http://psign.iriosystems.com:1380/parse";
export let PORT = parseInt(process.env.PORT, 10) || 80;

export const IP = "localhost";

var SERVER_URL = `https://${IP}:${PORT}/parse`;
if (typeof window != "undefined") {
  SERVER_URL = window.location.origin + "/parse";
  // alert(SERVER_URL);
}
console.log("SERVER_URL", SERVER_URL);

Parse.initialize("psignApp");
Parse.serverURL = SERVER_URL;

import * as moment from "moment";

function Query(className): Parse.Query {
  return new Parse.Query(className);
}

Parse.LiveQuery.on("open", () => {
  console.log("socket connection established");
});
// When we establish the WebSocket connection to the LiveQuery server, you’ll get this event.

// CLOSE EVENT
Parse.LiveQuery.on("close", () => {
  console.log("socket connection closed");
});
// When we lose the WebSocket connection to the LiveQuery server, you’ll get this event.

// ERROR EVENT
Parse.LiveQuery.on("error", error => {
  console.log("Error", error);
});

// Parse.liveQueryServerURL = `ws://${SERVER_URL}:8000`;

export class Database {
  public static Subscribe(className) {
    let query = new Parse.Query(className);
    // query.equalTo("playerName", "John Doe");
    let subscription = query.subscribe();
    return subscription;
  }

  public static async addMedia(file: File) {
    var sfname = file.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    var parseFile = new Parse.File(sfname, file);
    await parseFile.save();
    var medium = new Parse.Object("Media");
    medium.set("file", parseFile);
    await medium.save(null);
    return medium;
  }

  public static async saveGroup(objectId: string, currentGroupName: string) {
    var group: Parse.Object = null;
    if (objectId) {
      group = await new Parse.Query("Groups").get(objectId);
    } else {
      group = new Parse.Object("Groups");
    }
    group.set("name", currentGroupName);
    await group.save(null);
  }

  public static async deleteMedia(id: string) {
    var medium = await new Parse.Query("Media").get(id);
    await medium.destroy(null);
    return medium;
  }

  public static async login(username, password) {
    var user = await Parse.User.logIn(username, password);
    return user;
  }

  public static async getSettings() {
    var query = new Parse.Query("Settings");
    return await query.first(null).then(k => k.toJSON());
  }

  public static async getGroups() {
    var query = new Parse.Query("Groups");
    return await query.find(null); //.then(k => k.toJSON());
  }

  public static async getSettingsParse() {
    var query = new Parse.Query("Settings");
    return await query.first(null);
  }

  public static async loadSlot(date: Date, selectedGroup = null) {
    try {
      var query = new Parse.Query("TimeSlots")
        .include("video")
        .equalTo("timestamp", date);
      if (selectedGroup) {
        query.equalTo("group", selectedGroup);
      }
      return await query.first(null).then(k => k && k.toJSON());
    } catch (e) {
      alert("error:" + e.message);
      return null;
    }
  }

  public static async loadSlotOrNew(date: Date) {
    try {
      var query = new Parse.Query("TimeSlots").equalTo("timestamp", date);
      return (await query.first(null)) || new Parse.Object("TimeSlots");
    } catch (e) {
      return new Parse.Object("TimeSlots");
    }
  }

  public static async setVehicle(id, name) {
    var device = await Query("Devices").get(id);
    device.set("vehicle_no", name);
    await device.save(null);
  }

  public static async setVehicleGroup(id, groupId) {
    var device = await Query("Devices").get(id);
    var group = new Parse.Object("Groups");
    group.id = groupId;
    device.set("group", group);
    await device.save(null);
  }

  public static async setSnaphots(id, status) {
    var device = await Query("Devices").get(id);
    device.set("ve", status);
    await device.save(null);
  }

  public static async saveSlot(
    media,
    timeSlot,
    title,
    scrolling_text,
    selectedGroup = null
  ) {
    var durations = media.video_duration / 30;
    if (durations < 1) durations = 1;
    var dCount = 0;
    console.error("has multiple durations", { durations });
    var medium = new Parse.Object("Media");
    medium.id = media.objectId;

    for (let dCount = 0; dCount < durations; dCount++) {
      console.log("saving duration: ", dCount * 30);
      var myTimeSlot = moment(timeSlot)
        .add(dCount * 30, "seconds")
        .toDate();
      var slot = await this.loadSlotOrNew(myTimeSlot);
      slot.set("title", title);
      if (selectedGroup) {
        var group = new Parse.Object("Groups");
        group.id = selectedGroup;
        slot.set("group", group);
      }

      slot.set("scrolling_text", scrolling_text);
      slot.set("video", medium);
      slot.set("timestamp", myTimeSlot);
      slot.set("duration", 30);
      await slot.save(null);
    }
    this.forceReload();
  }

  public static async forceReload() {
    try {
      var setting = await this.getSettingsParse();
      setting.set("lastUpdate", new Date()); // Force all players to update their playlists
      await setting.save(null);
    } catch (err) {
      console.log("err", err);
    }
  }

  public static async saveSettings(defaultVideo, defaultBanner, defaultRSS) {
    var query = new Parse.Query("Settings");
    var setting = await query.first(null);

    setting.set("defaultVideo", defaultVideo);
    setting.set("defaultBanner", defaultBanner);
    setting.set("defaultRSS", defaultRSS);
    return await setting.save(null);
  }

  public static isLoggedIn() {
    return Parse.User.current();
  }
  public static async changeMediaTitle(oitem: any, title: string) {
    var item = await Query("Media").get(oitem.objectId);
    item.set("title", title);
    await item.save();
  }
  public static async getGalleryItems() {
    // console.log("Database getGalleryItems",Parse.serverURL)
    var items = await Query("Media").find();
    return items.map(d => d.toJSON());
  }
  public static async fetchDevices() {
    var devices = await Query("Devices").find();
    return devices.map(d => d.toJSON());
  }

  public static async fetchGroups() {
    var groups = await Query("Groups").find();
    return groups.map(d => d.toJSON());
  }

  public static async getRouteToday(objectId) {
    var start = moment()
      .utc()
      .startOf("day")
      .toDate(); // set to 12:00 am today
    var end = moment()
      .utc()
      .endOf("day")
      .toDate(); // set to 23:59 pm today

    var device = new Parse.Object("Devices");
    device.id = objectId;

    var snapshots = await Query("Snapshots")
      .greaterThanOrEqualTo("createdAt", start)
      .lessThanOrEqualTo("createdAt", end)
      .exists("location")
      .equalTo("device", device)
      .ascending("createdAt")
      .find();
    return snapshots.map(d => d.toJSON());
  }
}
