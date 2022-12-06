import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../actions/register';
import PropTypes from 'prop-types';

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { email, password } = formData;
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    //https://stackoverflow.com/questions/32515598/square-brackets-javascript-object-key
  };

  const onSubmit = (e) => {
    e.preventDefault();

    login(email, password);
  };

  //Redirect  if not destructuring we can use props.isAuthenticated
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
    //return <Redirect to='/create-profile' />;
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Sign Into Your Account
      </p>
      <form action='dashboard.html' className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input type='email' placeholder='Email Address' name='email' value={email} onChange={(e) => onChange(e)} required />
        </div>
        <div className='form-group'>
          <input type='password' placeholder='Password' name='password' value={password} onChange={(e) => onChange(e)} minLength='6' />
        </div>

        <input type='submit' value='Login' className='btn btn-primary' />
      </form>
      <p className='my-1'>
        Don't have an account? <Link to='/register'>Sign Up</Link>
      </p>
    </Fragment>
  );
};
Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => {
  const { registerReducer } = state;
  return { isAuthenticated: registerReducer.isAuthenticated };
};
export default connect(mapStateToProps, { login })(Login);
