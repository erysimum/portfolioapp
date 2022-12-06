import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class AlertDisplay extends React.Component {
  renderAlertMessage() {
    return this.props.alertMessageDisplay.map((alert) => {
      return (
        <div className={`alert alert-${alert.alertType}`} key={alert.id}>
          {alert.msg}
        </div>
      );
    });
  }
  render() {
    return <div>{this.renderAlertMessage()}</div>;
  }
}

//propTypes  , this component expects props as an array from the reducer

AlertDisplay.propTypes = {
  alertMessageDisplay: PropTypes.array.isRequired
};

const mapStateToProps = (state) => {
  return { alertMessageDisplay: state.alertReducer };
};

export default connect(mapStateToProps)(AlertDisplay);
