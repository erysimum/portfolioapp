import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../actions/profile';
import Spinner from '../layouts/Spinner';
import { Link } from 'react-router-dom';
import DashboardActions from './DashboardActions';
import Experience from '../dashboard/Experience';
import Education from '../dashboard/Education';
import { deleteAccount } from '../actions/profile';
const Dashboard = ({
  getCurrentProfile,
  deleteAccount,
  registerReducer: { user, isAuthenticated },
  profileReducer: { profile, profiles, error, repos, loading }
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, []);

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <Fragment>
          <DashboardActions />
          <Experience experiences={profile.experience} />
          <Education educations={profile.education} />

          <div className='my-2'>
            <button className='btn btn-danger' onClick={() => deleteAccount()}>
              <i className='fas fa-user-minus' /> Delete My Account
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p>You donot have a profile yet, set up a profile</p>
          <Link to='/create-profile' className='btn btn-primary my-1'>
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  registerReducer: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  profileReducer: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return { registerReducer: state.registerReducer, profileReducer: state.profileReducer };
};
export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard);
