import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// const Landing = ({ registerReducer: representingregisterReducerAlias }) => { //object
//const Landing = ({ isAuthenticated }) => {   //object
//const Landing = ({ isAuthenticated }) => {     //boolean

const Landing = ({ registerReducer: { isAuthenticated } }) => {
  // pull out isAuthenticate from registerReducer
  // console.log('AUth1', representingregisterReducerAlias.isAuthenticated);
  //console.log('AUth1', isAuthenticated.isAuthenticated);

  //if (representingregisterReducerAlias.isAuthenticated) {
  //if (isAuthenticated.isAuthenticated) {
  if (isAuthenticated) {
    // console.log('AUth22', representingregisterReducerAlias.isAuthenticated);
    return <Redirect to='/dashboard' />;
  }

  return (
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <h1 className='x-large'>Developer Conglomerates</h1>
          <p className='lead'>Create developer profile/portfolio, share posts and get help from other developers</p>
          <div className='buttons'>
            <Link to='/register' className='btn btn-primary'>
              Sign Up
            </Link>
            <Link to='/login' className='btn btn'>
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

Landing.propTypes = {
  registerReducer: PropTypes.object.isRequired
  //registerReducer: PropTypes.object.isRequired
  //isAuthenticated: PropTypes.object.isRequired
  //isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
  registerReducer: state.registerReducer
  // registerReducer: state.registerReducer
  //isAuthenticated: state.registerReducer
  //isAuthenticated: state.registerReducer.isAuthenticated   //bool
});
export default connect(mapStateToProps)(Landing);
