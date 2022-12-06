import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProfileById } from '../actions/profile';
import Spinner from '../layouts/Spinner';
import { Link } from 'react-router-dom';
import ProfileTop from '../profile/ProfileTop';
import ProfileAbout from '../profile/ProfileAbout';
import ProfileExperience from '../profile/ProfileExperience';
import ProfileEducation from '../profile/ProfileEducation';
import ProfileGithub from '../profile/ProfileGithub';

// const Profile = ({ getProfileById, profileReducer: { profile }, registerReducer: { isAuthenticated, loading, user }, match }) => {
const Profile = ({ getProfileById, profileReducer, registerReducer, match }) => {
  useEffect(() => {
    getProfileById(match.params.id);
  }, [getProfileById, match.params.id]);
  return (
    <Fragment>
      {profileReducer.profile === null || profileReducer.loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to='/profiles' className='btn btn-light'>
            Back To Profiles
          </Link>
          {/* //isAuthenticated, loading, and user._id is extracted from registerReducer and profile.user._id extracted from profileReducer */}
          {/* {isAuthenticated &&
            loading === false &&
            user._id === profile.user._id && (
              <Link to='/edit-profile' className='btn btn-dark'>
                Edit Profile
              </Link>
            )} */}
          {registerReducer.isAuthenticated &&
            registerReducer.loading === false &&
            registerReducer.user._id === profileReducer.profile.user._id && (
              <Link to='/edit-profile' className='btn btn-dark'>
                Edit Profile
              </Link>
            )}
          <div className='profile-grid my-1'>
            <ProfileTop profile={profileReducer.profile} />
            <ProfileAbout profile={profileReducer.profile} />
            <div className='profile-exp bg-white p-2'>
              <h2 className='text-primary'>Experience</h2>
              {profileReducer.profile.experience.length > 0 ? (
                <Fragment>
                  {profileReducer.profile.experience.map((experience) => (
                    <ProfileExperience key={experience._id} experience={experience} />
                  ))}
                </Fragment>
              ) : (
                <h4>No experience credentials</h4>
              )}
            </div>
          </div>
          <div className='profile-edu bg-white p-2'>
            <h2 className='text-primary'>Education</h2>
            {profileReducer.profile.education.length > 0 ? (
              <Fragment>
                {profileReducer.profile.education.map((education) => (
                  <ProfileEducation key={education._id} education={education} />
                ))}
              </Fragment>
            ) : (
              <h4>No education credentials</h4>
            )}
          </div>
          {profileReducer.profile.githubusername && <ProfileGithub username={profileReducer.profile.githubusername} />}
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  registerReducer: PropTypes.object.isRequired,
  profileReducer: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  registerReducer: state.registerReducer,
  profileReducer: state.profileReducer
});

// const mapStateToProps = (state) => {
//   return {
//     registerReducer: state.registerReducer,
//     profileReducer: state.profileReducer
//   };
// };
export default connect(mapStateToProps, { getProfileById })(Profile);
