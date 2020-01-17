import * as React from "react";
import MyComponent from "../components/MyComponent";
import { View, Text } from "react-native-web";
import { Database } from "../components/Database";



export default class Test extends React.Component<any, any> {

  async subscribe() {
    var subscription = Database.Subscribe('Settings');
   
    subscription.on('open', () => {
        console.log('subscription opened'); // <<---- THIS WORKS!!!!
    });
    
    subscription.on('update', (player) => {
        console.log(player); // <<---- NEVER TRIGGERED :(
    });
    
    subscription.on('enter', (object) => {
      console.log('object entered');
    });

    subscription.on('leave', (object) => {
      console.log('object left');
    });

    subscription.on('error', (error) => {
      console.log("error", error);
    });

    subscription.on('delete', (object) => {
      console.log('object deleted');
    });

    subscription.on('close', () => {
      console.log('subscription closed');
    });

    subscription.on('insert', (player) => {
        console.log(player); // <<---- NEVER TRIGGERED :(
    });

  }

  componentDidMount(){
    this.subscribe();
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
          height: "100%"
        }}
      >
        <Text style={{ flex: 1, fontSize: 30, fontWeight: "bold" }}>
          Welcome To Pangaea Media Manager
        </Text>
      </View>
    );
  }
}
