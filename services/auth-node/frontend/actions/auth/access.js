import axios from 'axios';

import { ROOT_API_URL, access } from './base';

export const startAccess = (action, data = {}) => {
  return (dispatch, getState) => {
    return new Promise(async(resolve, reject) => {
      try {
        const response = await axios.post(`${ROOT_API_URL}/auth/${action}`, data);
        const token = response.headers['x-auth'];
        dispatch(access(token));
        resolve(response.body);
      }
      catch (error) {
        reject(error);
      }
    });
  }
};
