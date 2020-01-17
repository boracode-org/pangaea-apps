import { RouterStore } from "../../../stores/router";
import { AppStore } from "../../../stores/appStore";
import { IAsyncRoutes, links } from "../../../routing";
import { px } from "csx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Helmet } from "react-helmet";
import { style } from "typestyle";
import { IStores } from "stores";

@inject((stores: IStores) => ({
  appStore: stores.appStore,
  router: stores.router
}))
@observer
export default class Login extends React.Component<
  { appStore: AppStore; router: RouterStore },
  {}
> {
  state = { username: "", password: "" };
  login = async () => {
    const { router, appStore } = this.props;
    const { username, password } = this.state;
    var user = await appStore.login(username, password);
    if (user) {
      router.navigate(links.home().path);
    } else {
      alert("Sorry, we could not log you in...");
    }
  };
  public render() {
    const aboutClass = style({
      padding: px(10)
    });

    return (
      <div className={aboutClass}>
        <Helmet>
          <title>Login</title>
        </Helmet>
        Welcome to the login page<br />
        <input placeholder="USERNAME" onChange={e => this.setState({ username: e.target.value })} />
        <input placeholder="PASSWORD" onChange={e => this.setState({ password: e.target.value })} />
        <button title="Login" onClick={this.login}>
          Login
        </button>
      </div>
    );
  }
}
