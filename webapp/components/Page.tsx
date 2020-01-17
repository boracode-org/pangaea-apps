// The Page Hoc used to wrap all our Page components.
// It serves 3 main purposes :
// 1. Handles global styling
// 2. Handles global layout
// 3. Construct and provide the Mobx stores

import * as React from "react";
import Head from "next/head";
import { Provider } from "mobx-react";

import Stores from "../stores";
import { AppStore } from "../stores/appStore";

export function ComposedComponent(Component) {
  return class extends React.Component<any, any> {
    static async getInitialProps(ctx) {
      let userState = null;
      const isServer = !!ctx.req;

      //   if (isServer === true) {
      //     const User = Stores("__userStore__");
      //     userState = User.getUserFromCookie(ctx.req);
      //   }

      const appStore: AppStore = Stores("__appStore__");
      await appStore.fetchTodos();
      const appState = appStore.toJSON();
      return {
        isServer,
        userState,
        appState
      };
    }

    constructor(props) {
      super(props);
      this.state = {
        stores: {
          //   user: Stores("__userStore__", props.userState),
          app: Stores("__appStore__", props.appState)
        }
      };
    }

    render() {
        // alert("stores:" + JSON.stringify(this.state.stores))
      return (
        <Provider {...this.state.stores}>
          <Component user={this.props} app={this.state.stores.app} />
        </Provider>
      );
    }
  };
}
