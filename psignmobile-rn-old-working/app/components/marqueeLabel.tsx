import { Component } from "react";

import * as React from "react";
import {
  AppRegistry,
  Animated,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  DeviceEventEmitter,
  View
} from "react-native";

export class MarqueeLabel extends Component<any, any> {
  constructor(props) {
    super(props);
    var charSize = this.props.textSize / 2;
    var totalTextWidth = charSize * this.props.text.length;
    this.state = {
      right: totalTextWidth,
      totalTextWidth,
      charSize,
      textOpacity: new Animated.Value(totalTextWidth)
    };
    this.updateRight = this.updateRight.bind(this);
    this.textAnimate = this.textAnimate.bind(this);
  }

  updateRight() {
    var newRight = this.state.right - 1;

    if (this.state.right < -this.state.totalTextWidth * this.state.charSize) {
      newRight = this.state.totalTextWidth;
    }
    this.setState({ right: newRight }, () => {
      // console.log("new Right",{newRight,totalTextWidth:this.state.totalTextWidth*this.state.charSize});
    });
  }

  textAnimate = () => {
    Animated.timing(this.state.right, {
      toValue: -this.state.totalTextWidth,
      duration: 10000
    }).start(() => {
      this.setState(
        {
          textOpacity: new Animated.Value(this.state.totalTextWidth)
        },
        () => {
          Animated.timing(this.state.textOpacity, {
            toValue: this.state.totalTextWidth,
            duration: 10000
          }).start(() => {
            this.textAnimate();
          });
        }
      );
    });
  };

  state = {
    right: new Animated.Value(0)
  };

  componentDidMount() {
    // this.state.right.setValue(1);
    // this.textAnimate();
    setInterval(this.updateRight, 30);
  }
  render() {
    return (
      <View style={{ backgroundColor: "black", height: "100%", width: 1280 }}>
        <View
          style={{
            height: "100%",
            width: this.state.totalTextWidth * 2,
            bottom: 0,
            marginLeft: this.state.right,
            flexDirection: "row"
          }}
        >
          <Text
            style={{
              position: "absolute",
              color: "yellow",
              fontSize: this.props.textSize,
              textAlign: "right",
              fontWeight: "500"
            }}
          >
            {this.props.text}
          </Text>
        </View>
      </View>
    );
  }
}

/* 
// <Text style={{ color: "red", marginLeft: 100 }}>{this.state.right} - TTW: {this.state.totalTextWidth}</Text> -- Debug purposes
//uses animated ... less smooth though
  <Animated.Text
                style={[
                    { color: "yellow", fontSize: this.props.textSize, textAlign: 'right', fontWeight: '500' },
                    {
                        transform: [
                            { translateX: this.state.textOpacity },
                        ],
                    }
                ]
                }>
                {this.props.text}
            </Animated.Text>
 */
