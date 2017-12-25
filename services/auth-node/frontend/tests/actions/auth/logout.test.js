import axios from 'axios';

import { ROOT_API_URL } from '../../../actions/auth/base';
import { startLogout } from '../../../actions/auth/logout';

// thunk methods
let dispatch, getState;

describe('Actions', () => {
  describe('Auth', () => {
    beforeEach(() => {
      dispatch = jest.fn();
      getState = jest.fn();
    });

    describe('Logout', () => {
      beforeEach(() => {
        getState.mockReturnValue({ auth: { access: 'auth', token: 'loggedintoken' } });
      });

      describe('Success', () => {
        it('should return logout action without any payload', async () => {
          axios.delete = jest.fn((url) => Promise.resolve(() => {
            body: {success: true}
          }));
          await startLogout()(dispatch, getState);
          expect(axios.delete).toHaveBeenLastCalledWith(`${ROOT_API_URL}/auth/logout`, {
            headers: { "x-auth": 'loggedintoken' }
          });
          expect(dispatch.mock.calls[0][0]).toEqual({ type: 'LOGOUT' });
        });
      });

      describe('Error', () => {
        it('should return the server error', async () => {
          const error = { error: 'error logout' };
          axios.delete = jest.fn((url) => Promise.reject(error));

          try {
            await startLogout()(dispatch, getState);
            expect('should not come here').toEqual('here');
          }
          catch (err) {
            expect(err).toEqual(error);
            expect(dispatch.mock.calls[0][0]).toEqual({ type: 'LOGOUT' });
          }
        });
      });

    });
  });

});
