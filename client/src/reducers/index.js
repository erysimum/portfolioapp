import { combineReducers } from 'redux';
import alertReducer from './alertReducer';
import registerReducer from './registerReducer';
import profileReducer from './profileReducer';

export default combineReducers({
  alertReducer,
  registerReducer,
  profileReducer
});
