import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../actions/register';
import PropTypes from 'prop-types';

const Navbar = ({ registerReducer: { isAuthenticated, loading }, logout }) => {
  //JSX in a variable
  const authLink = (
    <ul>
      <li>
        <Link to='/dashboard'>
          <i className='fas fa-user' />
          <span className='hide-sm'>Dashboard</span>
        </Link>
      </li>
      <li>
        <Link to='/profiles'>Developer's Profile</Link>
      </li>
      <li>
        <a href='#!' onClick={logout}>
          <i className='fas fa-sign-out-alt' />
          <span className='hide-sm'>Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLink = (
    <ul>
      <li>
        <Link to='/profiles'>Developer's Profile</Link>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          {' '}
          <i className='fas fa-code'></i> DevConnector{' '}
        </Link>
      </h1>
      <Fragment>{isAuthenticated ? authLink : guestLink}</Fragment>
    </nav>
  );
};

//  return (
//    <nav className='navbar bg-dark'>
//      <h1>
//        <Link to='/'>
//          {' '}
//          <i className='fas fa-code'></i> DevConnector{' '}
//        </Link>
//      </h1>
//      <ul>
//        <li>
//          <Link to='profiles.html'>Developers</Link>
//        </li>
//        <li>
//          <Link to='/register'>Register</Link>
//        </li>
//        <li>
//          <Link to='/login'>Login</Link>
//        </li>
//      </ul>
//    </nav>
//  );

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  registerReducer: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return { registerReducer: state.registerReducer };
};
//this style of code also valid
// const mapStateToProps = (state) => ({
//   registerReducer: state.registerReducer
// });

export default connect(mapStateToProps, { logout })(Navbar);
