import axios from 'axios';

export const getStatus = () => async (dispatch) => {
  const res = await axios.get('/api/user/status');

  if (res.data.user) {
    dispatch({
      type: 'USER_STATUS',
      payload: 1,
    });

    dispatch({
      type: 'USER',
      payload: res.data.user,
    });
  } else {
    dispatch({
      type: 'USER_STATUS',
      payload: 0,
    });
  }
};

export const login = (usn, psw) => async (dispatch) => {
  const res = await axios.post('/api/user/login', {
    username: usn,
    password: psw,
  });

  const { status, message, user } = res.data;

  if (status) {
    dispatch({
      type: 'USER_STATUS',
      payload: 1,
    });

    dispatch({
      type: 'USER',
      payload: user,
    });
  }

  return { status, message };
};

export const logout = () => async (dispatch) => {
  const res = await axios.get('/api/user/logout');
  const { status, message } = res.data;

  if (status) {
    dispatch({
      type: 'USER_STATUS',
      payload: 0,
    });

    dispatch({
      // TODO
      type: 'CLEAR_USER',
      payload: {
        userId: -1,
      },
    });
  }

  return { status, message };
};
