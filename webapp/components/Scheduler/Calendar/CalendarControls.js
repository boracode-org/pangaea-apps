import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  year: PropTypes.number.isRequired,
  onPrevYear: PropTypes.func,
  onNextYear: PropTypes.func,
  goToToday: PropTypes.func,
  showTodayButton: PropTypes.bool
};

export default class CalendarControls extends React.Component {
  render() {
    const { showTodayButton, goToToday, onPrevYear, onNextYear } = this.props;
    let todayButton;
    if( showTodayButton ) {
      todayButton = (
        <div
          className='control today'
          onClick={() => goToToday()}
        >
          Today
        </div>
      );
    }

    return (
      <div className='calendar-controls'>
        <div
          className='control'
          onClick={() => onPrevYear()}
        >
          &laquo;
        </div>
        <div className='current-year'>
          {this.props.year}
        </div>
        <div
          className='control'
          onClick={() => onNextYear()}
        >
          &raquo;
        </div>
        {todayButton}
      </div>
    );
  }
}

CalendarControls.propTypes = propTypes;
