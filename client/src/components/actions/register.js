import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOG_OUT,
  CLEAR_PROFILE
} from '../actions/types';
import { setAlert } from '../actions/index';
import setAuthToken from '../../utility/setAuthToken';

//setting the token as header action, verify token in the backend
//if the token is verified, retun user properties who bears that token

export const loadUser = () => async (dispatch) => {
  //console.log('get state', getState().registerReducer.token);
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_FAIL
    });
  }
};

//register action
export const register = (name, email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post('/api/users', body, config);
    //  console.log('REGISTER.JS payload', res.data);   //res.data => {token: "eyJhbGciOiJIUzI1NiIsI"}
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data //payload is an object consiting of token i.e {token: "eyJhbGciOiJIUzI1NiIsIn"}
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// err.response.data.errors   returns an array of error
// (3) [{…}, {…}, {…}]
// 0: {value: "", msg: "Name should not be empty", param: "name", location: "body"}
// 1: {value: "", msg: "Please provide valid email", param: "email", location: "body"}
// 2: {value: "", msg: "Password should not be less than 6 characters", param: "password", location: "body"}
// length: 3
// __proto__: Array(0)

//login action
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/auth', body, config);
    //  console.log('REGISTER.JS payload', res.data);   //res.data => {token: "eyJhbGciOiJIUzI1NiIsI"}
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data //payload is an object consiting of token i.e {token: "eyJhbGciOiJIUzI1NiIsIn"}
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: LOGIN_FAIL
    });
  }
};
//LOGOUT
export const logout = () => (dispatch) => {
  dispatch({
    type: LOG_OUT
  });
  dispatch({
    type: CLEAR_PROFILE
  });
};
