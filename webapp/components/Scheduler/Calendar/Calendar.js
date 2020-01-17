import React from "react";
import moment from "moment";
import { Month } from "./Month";
import { range } from "./utils";
import PropTypes from "prop-types";

const propTypes = {
  year: PropTypes.number.isRequired,
  forceFullWeeks: PropTypes.bool,
  showDaysOfWeek: PropTypes.bool,
  showWeekSeparators: PropTypes.bool,
  firstDayOfWeek: PropTypes.number,
  selectRange: PropTypes.bool,
  onPickDate: PropTypes.func,
  onPickRange: PropTypes.func,
  customClasses: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
};

const defaultProps = {
  year: moment().year(),
  forceFullWeeks: false,
  showDaysOfWeek: true,
  showWeekSeparators: true,
  firstDayOfWeek: 0,
  selectRange: false,
  onPickDate: null,
  onPickRange: null,
  selectedDay: moment(),
  customClasses: null
};

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectingRange: undefined
    };
  }

  dayClicked(date) {
    let { selectingRange, useless } = this.state;
    const { selectRange, onPickRange, onPickDate } = this.props;

    if (!selectRange) {
      onPickDate && onPickDate(date);
      return;
    }

    if (!selectingRange) {
      selectingRange = [date, date];
    } else {
      onPickRange && onPickRange(selectingRange[0], date);
      selectingRange = undefined;
    }

    this.setState({
      selectingRange
    });
  }

  dayHovered(hoveredDay) {
    let { selectingRange } = this.state;

    if (selectingRange) {
      selectingRange[1] = hoveredDay;

      this.setState({
        selectingRange
      });
    }
  }

  _daysOfWeek() {
    const { firstDayOfWeek, forceFullWeeks, showWeekSeparators } = this.props;
    const totalDays = forceFullWeeks ? 42 : 37;

    const days = [];
    range(firstDayOfWeek, totalDays + firstDayOfWeek).map(i => {
      let day = moment()
        .weekday(i)
        .format("dd")
        .charAt(0);

      if (showWeekSeparators) {
        if (i % 7 === firstDayOfWeek && days.length) {
          // push week separator
          days.push(<th className="week-separator" key={`seperator-${i}`} />);
        }
      }
      days.push(
        <th key={`weekday-${i}`} className={i % 7 === 0 ? "bolder" : ""}>
          {day}
        </th>
      );
    });

    return (
      <tr>
        <th>&nbsp;</th>
        {days}
      </tr>
    );
  }

  render() {
    const { year, firstDayOfWeek } = this.props;
    const { selectingRange } = this.state;

    const months = range(0, 12).map(month => (
      <Month
        month={month}
        key={`month-${month}`}
        dayClicked={d => this.dayClicked(d)}
        dayHovered={d => this.dayHovered(d)}
        {...this.props}
        selectingRange={selectingRange}
      />
    ));

    return (
      <div style={{padding:5}}>
        <style
          dangerouslySetInnerHTML={{
            __html: `
      table.calendar {
        border-collapse: collapse;
      }
      
      table.calendar thead {
        background-color: #5A5A5A;
        color: white;
        margin-bottom: 0px;
        border-bottom: 0px solid white
      }
      
      
      table.calendar thead th {
        font-weight: normal;
        padding: 1px 3px;
      }
      
      table.calendar thead th.bolder {
        font-weight: bold;
      }
      
      table.calendar tbody {
        font-size: 0.8em;
      }
      
      table.calendar td {
        text-align: center;
        padding: 8px;
        cursor: pointer;
        border: 1px solid rgba(185, 185, 185, 0.13);
        background-color: white;
        min-width: 15px;
      }
      
      table.calendar tr:last-child td {
        border-bottom: none;
      }
      
      table.calendar td.month-name {
        font-weight: bold;
        text-align: left;
        cursor: default;
        border-left: none;
      }
      
      table.calendar td.prev-month,
      table.calendar td.next-month {
        color: transparent;
        cursor: default;
        pointer-events: none;
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAAXNSR0IArs4c6QAAABZJREFUCB1jYEADmzdv/o8iRA0BoIEAKngPeSAlnXcAAAAASUVORK5CYII=');
      }
      
      table.calendar td.week-separator {
        pointer-events: none;
        padding: 0;
        width: 8px;
        min-width: 0;
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAAXNSR0IArs4c6QAAABZJREFUCB1jYEADmzdv/o8iRA0BoIEAKngPeSAlnXcAAAAASUVORK5CYII=');
      }
      
      table.calendar td.bolder {
        font-weight: bold;
      }
      
      /* Single selected day */
      table.calendar td.selected {
        background-color: orangered;
        color: white;
        font-weight: bold;
      }
      
      /* Selected range */
      table.calendar td.range {
        background-color: rgba(255,69,0, 0.7);
        font-weight: bold;
        color: white;
      }
      
      table.calendar td.range-left {
        border-top-left-radius: 15px;
        border-bottom-left-radius: 15px;
        overflow: hidden;
        background: orangered;
      }
      
      table.calendar td.range-right {
        border-top-right-radius: 15px;
        border-bottom-right-radius: 15px;
        overflow: hidden;
        background: orangered;
      }
      
      div.calendar-controls {
        margin: 5px auto;
        display: table;
        font-size: 20px;
        line-height: 25px;
      }
      
      div.calendar-controls div {
        display: inline;
      }
      
      div.calendar-controls .current-year {
        margin: 0 10px;
      }
      
      div.calendar-controls .control {
        font-weight: bolder;
        color: #323232;
        font-size: 30px;//0.8em;
        cursor: pointer;
      }
      
      div.calendar-controls .today {
        position: absolute;
        right: 15px;
        line-height: 35px;
        font-size: 0.6em;
        text-transform: uppercase;
      }
      
      /* Demo */
      
      div#calendar {
        position: relative;
        border-radius: 5px;
        border: 1px solid #5A5A5A;
        background-color: white;
        overflow: hidden;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      
      div#demo {
        display: table;
        margin: 50px auto;
      }
      
      h2,h3,h4,h5 {
        text-align: center;
        color: #404040;
      }
      
      h1 {
        text-align: center;
        color: #B10909;
      }
      
      a {
        color: #B10909;
        font-weight: bolder;
        text-decoration: none;
      }
      
      a.demoLink {
        text-decoration: underline;
      }
      
      div.options {
        border: 1px solid #B9B9B9;
        border-radius: 5px;
        padding: 10px 15px;
        margin-top: 30px;
      }
      
      div.options select {
        margin-left: 10px;
      }`
          }}
        />
        <table className="calendar">
          <thead className="day-headers">
            {this.props.showDaysOfWeek ? this._daysOfWeek() : null}
          </thead>
          <tbody>{months}</tbody>
        </table>
      </div>
    );
  }
}

Calendar.propTypes = propTypes;
Calendar.defaultProps = defaultProps;
