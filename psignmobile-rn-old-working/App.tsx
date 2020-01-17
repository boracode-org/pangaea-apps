import * as React from "react";
import { StyleSheet, Text, View } from "react-native";

import PlayerApp from "./app/app";
import * as Expo from "expo";

// XMLHttpRequest = GLOBAL.originalXMLHttpRequest ?
//   GLOBAL.originalXMLHttpRequest : GLOBAL.XMLHttpRequest;

Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.LANDSCAPE);
export default class App extends React.Component<any, any> {
  render() {
    return (
      <PlayerApp />
      // <View style={styles.container}>
      //   <Text style={{ color: "blue", fontSize: 25 }}>
      //     Open up App.js to start working on your app!
      //   </Text>
      //   <Text>Changes you make will automatically reload.</Text>
      //   <Text>Shake your phone to open the developer menu.</Text>
      // </View>
    );
  }
}
// <PlayerApp/>
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center"
  }
});
