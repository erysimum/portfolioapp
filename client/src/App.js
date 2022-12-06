import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import AlertDisplay from './components/layouts/AlertDisplay';
//Redux
import { Provider } from 'react-redux';
import store from './store';
//setAuthenticationToken
import setAuthToken from './utility/setAuthToken';
import { loadUser } from './components/actions/register';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/Profiles/Profiles';
import Profile from './components/profile/Profile';
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  // useEffect(() => {
  //   //console.log('localstorage.token', localStorage.token);
  //   // console.log(store.getState().registerReducer.token); //gives token
  //   // var accessTokenObj = localStorage.getItem('token');
  //   // console.log(accessTokenObj);
  //   //store.dispatch(setAuthToken(store.getState().registerReducer.token));
  //   store.dispatch(loadUser());
  // }, []);

  useEffect(() => {
    console.log('localstorage.token', localStorage.token);
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route path='/' exact component={Landing} />
          <section className='container'>
            <AlertDisplay />
            <Switch>
              <Route path='/register' exact component={Register} />
              <Route path='/login' exact component={Login} />
              <Route path='/profiles' exact component={Profiles} />
              <Route path='/profile/:id' exact component={Profile} />
              <PrivateRoute exact path='/dashboard' exact component={Dashboard} />
              <PrivateRoute exact path='/create-profile' exact component={CreateProfile} />
              <PrivateRoute exact path='/edit-profile' exact component={EditProfile} />
              <PrivateRoute exact path='/add-experience' exact component={AddExperience} />
              <PrivateRoute exact path='/add-education' exact component={AddEducation} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
