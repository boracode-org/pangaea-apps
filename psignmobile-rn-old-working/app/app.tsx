import { SERVER_URL, psignStore } from "./stores/PSignStore";

import { Component } from "react";
import * as React from "react";

import { AppRegistry, StyleSheet, Text, View } from "react-native";

import { default as Player } from "./components/player";

import * as Expo from "expo";
Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.LANDSCAPE);

console.ignoredYellowBox = ['Setting a timer'];


export default class App extends Component<any, any> {
  render() {
    return <Player store={psignStore} />;
  }
}

//<Player store={psignStore}/>
