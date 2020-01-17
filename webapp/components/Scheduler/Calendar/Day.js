import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  classes: PropTypes.string,
  dayClicked: PropTypes.func,
  dayHovered: PropTypes.func
};

const defaultProps = {
  classes: ''
};

export class Day extends React.Component {
  _onClick() {
    const { dayClicked, day } = this.props;
    dayClicked(day);
  }

  _onHover() {
    const { dayHovered, day } = this.props;
    dayHovered(day);
  }

  render() {
    const { classes, day } = this.props;
    return (
      <td
        onClick={() => this._onClick()}
        onMouseEnter={() => this._onHover()}
        className={classes}
      >
        <span className='day-number'>
          {isNaN(day.date())? "": day.date()}
        </span>
      </td>
    );
  }
}

Day.propTypes = propTypes;
Day.defaultProps = defaultProps;
