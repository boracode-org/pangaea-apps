import * as React from "react";
import MyComponent from "../components/MyComponent";
import { View, Text, Button, TextInput } from "react-native-web";
import { ComposedComponent } from "../components/Page";
import { observer } from "mobx-react";
import { AppStore } from "../stores/appStore";
import { action } from "mobx";
import { Database } from "../components/Database";

@observer
class Login extends React.Component<{ app: AppStore }, any> {
  state = {
    username: null,
    password: null
  };
  addYo = action(() => {
    this.props.app.appName += "YOOO TO MA";
  });

  login = async () => {
    var { username, password } = this.state;
    // alert(JSON.stringify({username,password}));
    try {
      await Database.login(username, password);
      alert("Successfully logged you in...");
      window.location = "/scheduler";
    } catch (e) {
      alert("Failed to log you in: " + e.message);
    }
  };

  render() {
    var { username, password } = this.state;

    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center", alignContent: "center" }}
      >
        <View
          style={{
            backgroundColor: "#FAFAFA",
            width: 400,
            height: 300,
            padding: 10,
            marginTop: 100
          }}
        >
          <Text
            style={{
              backgroundColor: "white",
              color: "black",
              width: "100%",
              fontSize: 30,
              marginBottom: 20
            }}
          >
            Login
          </Text>
          <TextInput
            placeholder="Username"
            value={username}
            style={{
              margin: 5,
              fontSize: 20,
              padding: 5,
              border: "1px solid lightblue",
              borderRadius: 5
            }}
            onChange={e => this.setState({ username: e.nativeEvent.text })}
          />
          <TextInput
            placeholder="Password"
            value={password}
            secureTextEntry={true}
            style={{
              margin: 5,
              fontSize: 20,
              padding: 5,
              border: "1px solid lightblue",
              borderRadius: 5
            }}
            onChange={e => this.setState({ password: e.nativeEvent.text })}
          />
          <View style={{ width: 100, padding: 5 }}>
            <Button title="Login" onPress={this.login} />
          </View>
        </View>
      </View>
    );
  }
}
export default observer(ComposedComponent(Login));
