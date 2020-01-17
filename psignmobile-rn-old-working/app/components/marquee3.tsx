"use strict";

import * as React from "react";
import { StyleSheet, View, Text, Animated, Easing } from "react-native";
import PropTypes from "prop-types";
import * as _ from "lodash";

function until(test, iterator, callback) {
  if (!test()) {
    iterator(err => {
      if (err) {
        return callback(err);
      }
      until(test, iterator, callback);
    });
  } else {
    callback();
  }
}

export default class Marquee extends React.Component<any, any> {
  twidth: any;
  spaceWidth: number;
  width: any;
  animateEnable: boolean;
  propTypes = {
    children: PropTypes.string.isRequired,
    speed: PropTypes.number,
    spaceRatio: PropTypes.number
  };
  defaultProps = { speed: 30, spaceRatio: 0.5 };
  alpha = {};

  state = {
    left1: new Animated.Value(0),
    left2: new Animated.Value(0),
    list: this.props.children.split("")
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.children != nextProps.children) {
      this.animateEnable = false;
      //this.width = 0;
      this.state.left1.stopAnimation(() => {
        this.state.left2.stopAnimation(() => {
          Animated.timing(this.state.left1, {
            toValue: 0,
            duration: 0
          }).start(() => {
            Animated.timing(this.state.left2, {
              toValue: this.width,
              duration: 0
            }).start(() => {
              this.setState({ list: nextProps.children.split("") });
              if (!this.animateEnable) {
                this.animateEnable = true;
                until(
                  () => this.width > 0,
                  cb => setTimeout(cb, 100),
                  () => this.startMoveFirstLabelHead()
                );
              }
            });
          });
        });
      });
    }
  }
  onLayout(i, e) {
    this.alpha[i] = e.nativeEvent.layout.width;
    if (_.size(this.alpha) === this.state.list.length) {
      this.twidth = _.sum(_.values(this.alpha));
      this.alpha = {};
      if (!this.animateEnable) {
        this.animateEnable = true;
        until(
          () => this.width > 0,
          cb => setTimeout(cb, 100),
          () => this.startMoveFirstLabelHead()
        );
      }
    }
  }
  onLayoutContainer(e) {
    if (!this.width) {
      this.width = e.nativeEvent.layout.width;
      this.spaceWidth = this.props.spaceRatio * this.width;
      this.setState({ left1: new Animated.Value(0) });
      this.setState({ left2: new Animated.Value(this.width) });
    }
  }
  startMoveFirstLabelHead() {
    const { width, twidth, props } = this;
    const { speed } = props;
    return Animated.timing(this.state.left1, {
      toValue: -twidth + this.spaceWidth,
      duration: (twidth - this.spaceWidth) * speed,
      easing: Easing.linear,
      delay: 500
    }).start(() => {
      this.animateEnable &&
        Animated.parallel([
          this.moveFirstLabelTail(),
          this.moveSecondLabelHead()
        ] as any);
    });
  }
  moveFirstLabelHead() {
    const { width, twidth, props } = this;
    const { speed } = props;
    Animated.timing(this.state.left1, {
      toValue: -twidth + this.spaceWidth,
      duration: (twidth + this.spaceWidth) * speed,
      easing: Easing.linear
    }).start(() => {
      this.animateEnable &&
        Animated.parallel([
          this.moveFirstLabelTail(),
          this.moveSecondLabelHead()
        ] as any);
    });
  }
  moveFirstLabelTail() {
    const { width, twidth, props } = this;
    const { speed } = props;
    return Animated.timing(this.state.left1, {
      toValue: -twidth,
      duration: this.spaceWidth * speed,
      easing: Easing.linear
    }).start(() => {
      this.animateEnable &&
        this.setState({
          left1: new Animated.Value(width)
        });
    });
  }
  moveSecondLabelHead() {
    const { width, twidth, props } = this;
    const { speed } = props;
    return Animated.timing(this.state.left2, {
      toValue: -twidth + this.spaceWidth,
      duration: (twidth + this.spaceWidth) * speed,
      easing: Easing.linear
    }).start(() => {
      this.animateEnable &&
        Animated.parallel([
          this.moveFirstLabelHead(),
          this.moveSecondLabelTail()
        ] as any);
    });
  }
  moveSecondLabelTail() {
    const { width, twidth, props } = this;
    const { speed } = props;
    return Animated.timing(this.state.left2, {
      toValue: -twidth,
      duration: this.spaceWidth * speed,
      easing: Easing.linear
    }).start(() => {
      this.animateEnable &&
        this.setState({
          left2: new Animated.Value(twidth)
        });
    });
  }
  render() {
    const { left1, left2, list } = this.state;
    const s = StyleSheet.flatten(this.props.style);
    const textStyleKeys = [
      "color",
      "fontSize",
      "fontWeight",
      "letterSpacing",
      "fontStyle",
      "lineHeight",
      "fontFamily",
      "textDecorationLine"
    ];
    const textStyle = _.pick(s, textStyleKeys);
    const containerStyle = _.omit(s, textStyleKeys);
    return (
      <View
        style={[containerStyle, { flexDirection: "row" }]}
        onLayout={this.onLayoutContainer}
      >
        <Animated.View style={{ flexDirection: "row", left: left1 }}>
          {list.map((o, i) => (
            <Text
              key={i}
              onLayout={this.onLayout.bind(null, i)}
              style={textStyle}
            >
              {o}
            </Text>
          ))}
        </Animated.View>
        <Animated.View
          style={{ flexDirection: "row", position: "absolute", left: left2 }}
        >
          {list.map((o, i) => (
            <Text key={i} style={textStyle}>
              {o}
            </Text>
          ))}
        </Animated.View>
      </View>
    );
  }
}
