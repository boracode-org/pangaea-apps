import { PropTypes, Component } from "react";
import React from "react";
import { PageHeader } from "react-bootstrap";
import YearCalendar from "./YearCalendar";
import Preview from "./Preview";
import { View, Text } from "react-native-web";

import Modal from "react-modal";

// var TimeScale = React.createClass({

//   render: function() {
//     return (

//         <div>
//         <div className="container-fluid">
//           <div className="row">
//             <div className="col-lg-12">
//               <PageHeader>TimeScale </PageHeader>
//             </div>
//           </div>
//         </div>
//         </div>

//     );
//   }

// });

function pad(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}
// var y = k * 30;
// return "yon ";//pad(Number.parseInt(y / 60),2) + ":" + pad(y%60,2);
// }),//["00:00","00:30","01:00","01:30","02:00","02:30","03:00","03:30","04:00","04:30","05:00"],

function generateSeconds(minute) {
  return Array.apply(null, { length: 10 }).map(Number.call, k => {
    return [
      pad(Number.parseInt((minute * 60 + k * 30) / 60), 2) +
        ":" +
        pad((minute * 60 + k * 30) % 60, 2),
      pad(Number.parseInt((minute * 60 + (k + 1) * 30) / 60), 2) +
        ":" +
        pad((minute * 60 + (k + 1) * 30) % 60, 2)
    ];
  });
}

class TimeScale extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hours: Array.apply(null, { length: 24 }).map(Number.call, k => k ),
      minutes: Array.apply(null, { length: 12 }).map(Number.call, k => k * 5),
      seconds: generateSeconds(0),
      previewOpen: false,
      currentHour: 6,
      currentMinute: 5,
      hover: false,
      hoverSecond: -1,
      selectSecond: -1,
      hoverHour: -1,
      selectHour: -1,
      hoverMinute: -1,
      selectMinute: -1
    };
    this.onMouseHoverSecond = this.onMouseHoverSecond.bind(this);
    this.onMouseSelectSecond = this.onMouseSelectSecond.bind(this);
    this.onMouseHoverHour = this.onMouseHoverHour.bind(this);
    this.onMouseSelectHour = this.onMouseSelectHour.bind(this);
    this.onMouseHoverMinute = this.onMouseHoverMinute.bind(this);
    this.onMouseSelectMinute = this.onMouseSelectMinute.bind(this);
    this.onDatePicked = this.onDatePicked.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    if (this.refs.subtitle) this.refs.subtitle.style.color = "#f00";
  }

  closeModal() {
    this.setState({ previewOpen: false });
  }

  onMouseHoverSecond(second) {
    if (this.state.hoverSecond == second) this.setState({ hoverSecond: -1 });
    else this.setState({ hoverSecond: second });
  }

  onMouseSelectSecond(second) {
    if (this.state.selectMinute != -1) this.setState({ selectSecond: second });
    //Show popup
    this.setState({
      previewOpen: true,
      timeSelected: this.state.seconds[second],
      hourSelected: pad(this.state.currentHour, 1),
      dateSelected: this.state.dateSelected
    });
  }

  onMouseHoverHour(hour) {
    if (this.state.hoverHour == hour) this.setState({ hoverHour: -1 });
    else this.setState({ hoverHour: hour });
  }

  onMouseSelectHour(hour) {
    this.setState({ selectHour: hour, currentHour: hour , selectMinute: 0, selectSecond: 0 });
    // console.log("selectHour", hour);
  }

  onMouseHoverMinute(min) {
    if (this.state.hoverMinute == min) this.setState({ hoverMinute: -1 });
    else this.setState({ hoverMinute: min });
  }

  onMouseSelectMinute(min) {
    this.setState({
      selectMinute: min,
      currentMinute: this.state.minutes[min],
      selectSecond: 0,
      seconds: generateSeconds(this.state.minutes[min])
    });
    console.log("selectMinute", this.state.minutes[min]);
  }

  render() {
    return (
      <div>
        <Modal
          isOpen={this.state.previewOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
        >
          <Preview
            parent={this}
            timeSelected={this.state.timeSelected || 0}
            dateSelected={this.state.dateSelected || new Date()}
            hourSelected={this.state.hourSelected || 0}
            selectedGroup={this.props.selectedGroup}
          />
        </Modal>
        <YearCalendar year={2016} onPickDate={this.onDatePicked} />
        <br />
        <b>Hours: </b>
        <br />
        <View
          style={{
            width: "100%",
            float: "left",
            margin: 5,
            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap"
          }}
        >
          {this.state.hours.map((listValue, it) => {
            return (
              <View
                key={it}
                style={{
                  backgroundColor:
                    this.state.hoverHour == it
                      ? "red"
                      : this.state.selectHour == it ? "green" : "orange",
                  width: "30",
                  margin: 2,
                  color: "white",
                  fontWeight: "bold",
                  padding: 5
                }}
                onMouseEnter={this.onMouseHoverHour.bind(null, it)}
                onMouseLeave={this.onMouseHoverHour.bind(null, it)}
                onClick={this.onMouseSelectHour.bind(null, it)}
              >
                <Text style={{ fontSize: 18 }}>
                  {pad(listValue, 2)}: 00-{pad(listValue + 1, 2)}: 00
                </Text>
              </View>
            );
          })}
        </View>
        <br />
        <b>Minutes: </b>
        <br />
        <View
          style={{
            width: "100%",
            float: "left",
            margin: 5,
            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap"
          }}
        >
          {this.state.minutes.map((listValue, it) => {
            return (
              <View
                key={it}
                style={{
                  backgroundColor:
                    this.state.hoverMinute == it
                      ? "red"
                      : this.state.selectMinute == it ? "green" : "black",
                  width: "30",
                  margin: 2,
                  fontSize: 25,
                  color: "white",
                  fontWeight: "bold",
                  padding: 5
                }}
                onMouseEnter={this.onMouseHoverMinute.bind(null, it)}
                onMouseLeave={this.onMouseHoverMinute.bind(null, it)}
                onClick={this.onMouseSelectMinute.bind(null, it)}
              >
                <Text style={{ fontSize: 18 }}>
                  {pad(this.state.currentHour, 2)}: {pad(listValue, 2)}
                </Text>
              </View>
            );
          })}
        </View>
        <b>Seconds: </b> <br />
        <View
          style={{
            width: "100%",
            float: "left",
            margin: 5,
            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap"
          }}
        >
          {this.state.seconds.map((it, listValue) => {
            return (
              <View
                key={it}
                style={{
                  backgroundColor:
                    this.state.hoverSecond == listValue
                      ? "red"
                      : this.state.selectSecond == listValue ? "green" : "blue",
                  margin: 2,
                  fontSize: 25,
                  color: "white",
                  fontWeight: "bold",
                  padding: 5
                }}
                onMouseEnter={this.onMouseHoverSecond.bind(null, listValue)}
                onMouseLeave={this.onMouseHoverSecond.bind(null, listValue)}
                onClick={this.onMouseSelectSecond.bind(null, listValue)}
              >
                <Text style={{ fontSize: 18 }}>
                  {pad(this.state.currentHour, 1)}:
                  {pad(it[0], 2) + "-" + pad(this.state.currentHour, 1)}: {pad(it[1], 2)}
                </Text>
              </View>
            );
          })}
        </View>
      </div>
    );
  }

  renderTime(time) {
    return <li />;
  }

  onDatePicked(date) {
    // alert(date);
    this.setState({
      selectHour: 0,
      currentHour: 6,
      selectMinute: 0,
      selectSecond: 0,
      dateSelected: date
    });
  }
}

export default TimeScale;
