import { Header } from "../components/header";
import { NotFound, Route } from "../components/routing";
import { observer } from "mobx-react";
import * as React from "react";
import { Helmet } from "react-helmet";
import { links, IAsyncRoutes } from "../routing";

@observer
export class AppContainer extends React.Component<{}, {}> {
  public render() {
    return (
      <section>
        <Helmet>
          <title>PSign Backend</title>
        </Helmet>
        <Header />
        
        {Object.keys(links).map(key => {
          var link = links[key]();
          return <Route key={key} path={link.path} asyncComponent={key as IAsyncRoutes} />;
        })}
        <Route path="*" component={NotFound} />
      </section>
    );
  }
}
