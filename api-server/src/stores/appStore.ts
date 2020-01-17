import * as Parse from "parse";

function setupParse(parse) {
  parse.initialize("ABCDEFG12345");
  parse.serverURL = "http://psign.iriosystems.com:1380/parse";
}

setupParse(Parse);

import { action, observable, runInAction, toJS, computed } from "mobx";

function Query(className): Parse.Query {
  return new Parse.Query(className);
}

interface IDevice {
  longitude: number;
  latitude: number;

  createdAt: string;
  updatedAt: string;

  vehicle_no: string;
  uuid: string;
}

interface IAppState {
  user: any | undefined;

  devices: IDevice[];
  isLoggedIn: boolean;
  error: any;
}
export class AppStore {
  @action
  logout() {
    try {
      Parse.User.logOut();
      if (localStorage) localStorage.removeItem("@Psign:User");
      this.state.isLoggedIn = false;
      this.state.user = null;
    } catch (e) {}
  }

  @action
  public async fetchDevices() {
    // throw new Error("Method not implemented.");
    var devices = await Query("Devices").find();
    this.state.devices = devices.map(d => d.toJSON());
    return devices;
  }

  @computed
  public get User() {
    return this.state.user;
  }

  @action
  public async login(username, password) {
    try {
      var user = await Parse.User.logIn(username, password);
      if (localStorage) localStorage.setItem("@Psign:User", JSON.stringify(user));
      this.state.user = user.toJSON();
      this.state.isLoggedIn = true;
      return user;
    } catch (e) {
      console.log(e);
    }
    return null;
  }
  @observable public readonly state: IAppState;

  constructor(state?: IAppState) {
    if (state) {
      this.state = state;
      return;
    }

    this.state = {
      user: undefined,
      error: undefined,
      isLoggedIn: false,
      devices: []
    };
  }

  public serialize() {
    return toJS(this.state);
  }
}
