import * as React from "react";
import MyComponent from "../components/MyComponent";
import { View, Text, Button, ScrollView } from "react-native-web";
import { ComposedComponent } from "../components/Page";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from "react-native-table-component";

import { AppStore } from "../stores/appStore";
import { action } from "mobx";

import { inject, observer } from "mobx-react";
import PropTypes from "prop-types";
import * as ReactDOM from "react-dom";
import { Scheduler } from "../components/Scheduler/Scheduler";

@observer
class Default extends React.Component<{ app: AppStore }, any> {
  state = {
    devices:null,
    currentDevice: null
  };
  addYo = action(() => {
    this.props.app.appName += "YOOO TO MA";
  });

  public render() {
    const { devices, currentDevice } = this.state;
    return (
      <View>
        <Scheduler />
      </View>
    );
  }
}

export default observer(ComposedComponent(Default));
