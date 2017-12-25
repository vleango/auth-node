import axios from 'axios';

import { ROOT_API_URL, logout } from './base';

export const startLogout = (data = {}) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    // always logout the user
    dispatch(logout());

    return new Promise(async(resolve, reject) => {
      try {
        const response = await axios.delete(`${ROOT_API_URL}/auth/logout`, {
          headers: { "x-auth": token }
        });
        resolve(response.body);
      }
      catch (error) {
        reject(error);
      }
    });
  };
};
