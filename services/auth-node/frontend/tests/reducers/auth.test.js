import authReducer from '../../reducers/auth';

describe('Reducers', () => {
  describe('Auth', () => {
    describe('Access', () => {
      it('should set token for access', () => {
      	const action = {
      		type: 'ACCESS',
      		token: 'abc123'
      	};
      	const state = authReducer({}, action);
      	expect(state.token).toBe(action.token);
      });
    });

    describe('Logout', () => {
      it('should clear token for logout', () => {
        const action = {
          type: 'LOGOUT'
        };
        const state = authReducer({ uid: 'anything' }, action);
        expect(state).toEqual({});
      });
    });
  });
});
