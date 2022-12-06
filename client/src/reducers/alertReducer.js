import { SET_ALERT, REMOVE_ALERT } from '../components/actions/types';

const initialState = [];

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      return state.filter((el) => el.id !== payload.id);
    default:
      return state;
  }
};
