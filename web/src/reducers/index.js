import { combineReducers } from 'redux';

const userReducers = (state = { userId: -1 }, action) => {
  switch (action.type) {
    case 'USER':
      return { ...state, ...action.payload };
    case 'CLEAR_USER':
      return action.payload;
    default:
      return state;
  }
};

// 0: not login 1: login 2: unknown
const statusReducers = (state = 2, action) => {
  if (action.type === 'USER_STATUS') {
    return action.payload;
  } else {
    return state;
  }
};

const PORTAL_INIT_STATE = {
  open: false,
  color: '',
  header: '',
  body: '',
};

const portalReducers = (state = PORTAL_INIT_STATE, action) => {
  if (action.type === 'SET_PORTAL') {
    return { ...state, ...action.payload };
  } else {
    return state;
  }
};

export default combineReducers({
  status: statusReducers,
  user: userReducers,
  portal: portalReducers,
});
