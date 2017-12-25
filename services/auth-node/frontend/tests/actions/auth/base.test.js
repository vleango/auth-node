import { ROOT_API_URL, access, logout } from '../../../actions/auth/base';

describe('Actions', () => {
  describe('Auth', () => {
    describe('Base', () => {

      describe('ROOT_API_URL', () => {
        it('should return the url', async () => {
          expect(ROOT_API_URL).toBe('http://localhost:3000/api');
        });
      });

      describe('access', () => {
        it('should return the access object', () => {
          expect(access('abc123')).toEqual({
            type: 'ACCESS',
            token: 'abc123'
          });
        });
      });

      describe('logout', () => {
        it('should return the logout object', () => {
          expect(logout()).toEqual({
            type: 'LOGOUT'
          });
        });
      });

    });

  });

});
