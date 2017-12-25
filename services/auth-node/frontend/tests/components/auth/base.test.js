import React from 'react';
import { shallow } from 'enzyme';
import { pick } from 'lodash';
import { AuthComponentBase, PROVIDER_ERR_MSG } from '../../../components/auth/base';

let wrapper = shallow(<AuthComponentBase />);
let startAccess;
let valid_state = {
  email: 'test@example.com',
  password: 'hogehoge'
}

describe('Components', () => {
  describe('Auth', () => {
    describe('Base', () => {

      describe('onInputChange', () => {
        it('should set state for input change', () => {
          const target = { name: 'test', value: '123'};
          wrapper.instance().onInputChange({ target });
          expect(wrapper.state(target.name)).toBe(target.value);
        });
      });

      describe('isValidEmailPasswordLength', () => {
        describe('email', () => {
          it('should return true for valid email', () => {
            wrapper.setState({ ...valid_state });
            expect(wrapper.instance().isValidEmailPasswordLength()).toBe(true);
          });

          it('should return false for invalid email', () => {
            wrapper.setState({ ...valid_state, email: 'test' });
            expect(wrapper.instance().isValidEmailPasswordLength()).toBe(false);
          });
        });

        describe('password', () => {
          it('should return true for password length of 8 characters', () => {
            wrapper.setState({ ...valid_state });
            expect(wrapper.instance().isValidEmailPasswordLength()).toBe(true);
          });

          it('should return true for password length > 8', () => {
            wrapper.setState({ ...valid_state, password: '123456789' });
            expect(wrapper.instance().isValidEmailPasswordLength()).toBe(true);
          });

          it('should return false for password length < 8', () => {
            wrapper.setState({ ...valid_state, password: '1234567' });
            expect(wrapper.instance().isValidEmailPasswordLength()).toBe(false);
          });
        });

      });

      describe('isValidPasswordMatch', () => {
        const password_state = {
          password: 'hogehoge',
          password_confirmation: 'hogehoge'
        };

        it('should return true if passwords matches', () => {
          wrapper.setState({ ...password_state });
          expect(wrapper.instance().isValidPasswordMatch()).toBe(true);
        });

        it('should return false if passwords do not match', () => {
          wrapper.setState({ ...password_state, password_confirmation: 'piyopiyo' });
          expect(wrapper.instance().isValidPasswordMatch()).toBe(false);
        });
      });

      describe('authorizeWithFacebook', () => {
        const response = {
          accessToken: "abc123",
          email: "bob@tester.com",
          id: "1234",
          name: "Bob Hope",
          userID: "1234"
        };

        describe('Success', () => {
          startAccess = jest.fn(() => Promise.resolve());

          it('should call action for response', async () => {
            const wrapper = shallow(<AuthComponentBase startAccess={startAccess} />);
            wrapper.instance().authorizeWithFacebook(response);
            expect(startAccess).toHaveBeenLastCalledWith('provider', {
              ...(pick(response, ['email', 'name', 'accessToken', 'userID'])),
              first_name: 'Bob',
              last_name: 'Hope',
              access: 'facebook'
            });
          });
        });

        describe('Error', async () => {
          beforeEach(() => {
            startAccess = jest.fn(() => Promise.reject());
            wrapper = shallow(<AuthComponentBase startAccess={startAccess} />);
          });

          it('should call action for response', async () => {
            await wrapper.instance().authorizeWithFacebook(response);
            expect(wrapper.instance().state).toEqual({
              error: PROVIDER_ERR_MSG,
              submitting: false
            });
          });

          describe('Response', () => {
            describe('Incorrect Length', () => {
              it('should not call action nor set state', () => {
                ['name', 'email', 'accessToken', 'userID'].forEach(async (property) => {
                  await wrapper.instance().authorizeWithFacebook({
                    ...response,
                    [property]: ''
                  });
                  expect(startAccess).not.toHaveBeenCalled();
                });
              });
            });
          });
        });
      });

    });
  });
});
