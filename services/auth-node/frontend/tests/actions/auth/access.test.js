import axios from 'axios';

import { ROOT_API_URL } from '../../../actions/auth/base';
import { startAccess } from '../../../actions/auth/access';

// thunk methods
let dispatch, getState;

describe('Actions', () => {
  describe('Auth', () => {
    describe('Access', () => {
      beforeEach(() => {
        dispatch = jest.fn();
        getState = jest.fn();
      });

      describe('Success', () => {
        const token = '123token';

        beforeEach(() => {
          axios.post = jest.fn((url) =>
            Promise.resolve({ headers: { 'x-auth': token }}));

        });
        it('should dispatch login with token', async () => {
          await startAccess('login')(dispatch, getState);
          expect(axios.post).toHaveBeenLastCalledWith(`${ROOT_API_URL}/auth/login`, {});
          expect(dispatch.mock.calls[0][0]).toEqual({
            type: 'ACCESS',
            token
          });
        });

        it('should dispatch register with token', async () => {
          await startAccess('register')(dispatch, getState);
          expect(axios.post).toHaveBeenLastCalledWith(`${ROOT_API_URL}/auth/register`, {});
          expect(dispatch.mock.calls[0][0]).toEqual({
            type: 'ACCESS',
            token
          });
        });

        it('should dispatch provider with token', async () => {
          await startAccess('provider')(dispatch, getState);
          expect(axios.post).toHaveBeenLastCalledWith(`${ROOT_API_URL}/auth/provider`, {});
          expect(dispatch.mock.calls[0][0]).toEqual({
            type: 'ACCESS',
            token
          });
        });
      });

      describe('Error', () => {
        it('should return the server error', async () => {
          const error = { error: 'error login' };
          axios.post = jest.fn((url) => Promise.reject(error));

          try {
            await startAccess()(dispatch, getState);
            expect('should not come here').toEqual('here');
          }
          catch (err) { expect(err).toEqual(error);}
        })
      });
    });

  });

});
