import Document, { Head, Main, NextScript } from "next/document";
import * as React from "react";
import { AppRegistry } from "react-native-web";
import { Header } from "../components/Header";
import Router from "next/router";

export default class MyDocument extends Document {
  static async getInitialProps({ renderPage, asPath }) {
    AppRegistry.registerComponent("Main", () => Main);
    const { stylesheet } = AppRegistry.getApplication("Main");
    const page = renderPage();
    const styles = <style dangerouslySetInnerHTML={{ __html: stylesheet }} />;
    return { ...page, styles, asPath };
  }

  render() {
    return (
      <html>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"
        />
        <Head>
          <title>My page</title>
        </Head>
        <body>
          <Header url={this.props.asPath} />
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
