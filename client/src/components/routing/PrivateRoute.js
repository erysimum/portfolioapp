import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import Spinner from '../layouts/Spinner';

const PrivateRoute = ({ registerReducer: { isAuthenticated, loading }, component: Component, ...rest }) => (
  // <Route {...rest} render={(props) => (!isAuthenticated ? <Redirect to='/login' /> : <Component {...props} />)} />
  <Route {...rest} render={(props) => (!isAuthenticated && !loading ? <Redirect to='/login' /> : <Component {...props} />)} />
  //<Route {...rest} render={(props) => (loading ? <Spinner /> : isAuthenticated ? <Component {...props} /> : <Redirect to='/login' />)} />
);

PrivateRoute.propTypes = {
  registerReducer: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return { registerReducer: state.registerReducer };
};

export default connect(mapStateToProps)(PrivateRoute);
