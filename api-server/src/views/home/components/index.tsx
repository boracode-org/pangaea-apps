import { RouterStore } from "../../../stores/router";
import { AppStore } from "../../../stores/appStore";
import { IStores } from "../../../stores";
import { px } from "csx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Helmet } from "react-helmet";
import { style } from "typestyle";

@inject((stores: IStores) => ({
  appStore: stores.appStore,
  router: stores.router
}))
@observer
export default class Home extends React.Component<{ appStore: AppStore; router: RouterStore }, {}> {
  logout() {
    const { router, appStore } = this.props;
    appStore.logout();
    this.checkLoggedIn(appStore, router);
  }
  componentDidMount() {
    const { router, appStore } = this.props;
    console.log("Home", { props: this.props });
    this.checkLoggedIn(appStore, router);
  }
  public render() {
    const { router, appStore } = this.props;

    const homeClass = style({
      padding: px(10)
    });

    return (
      <div className={homeClass}>
        <Helmet>
          <title>Home</title>
        </Helmet>
        <i style={{ fontSize: 20, fontWeight: "bold" }}>Home Page!</i>
        <br />
        <b>{appStore.state.isLoggedIn ? "Logged In" : "Logged Out"}</b>
        <br />
        {JSON.stringify(appStore.User)}
        <br />
        <button onClick={() => this.logout()}>Logout</button>
      </div>
    );
  }

  private checkLoggedIn(appStore: AppStore, router: RouterStore) {
    if (!appStore.state.isLoggedIn) {
      alert("You are Not Logged In...");
      router.navigate("/login");
    }
  }
}
