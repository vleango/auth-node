import React from 'react';
import { shallow } from 'enzyme';
import {
  RegisterPage,
  INVALID_EMAIL_PW_MSG,
  PASSWORD_NOT_MATCH_MSG,
  DEFAULT_FAILURE_MSG
} from '../../../components/auth/register';

let wrapper = shallow(<RegisterPage />);

describe('Components', () => {
  describe('Auth', () => {
    describe('Register', () => {

      it('should correctly render RegisterPage', () => {
      	expect(wrapper).toMatchSnapshot();
      });

      describe('onInputChange', () => {
        it('should set first_name on input change', () => {
          const field = { value: 'Bob', name: 'first_name' };
          wrapper.find('input').at(0).simulate('change', { target: field });
          expect(wrapper.state(field.name)).toBe(field.value);
        });

        it('should set last_name on input change', () => {
          const field = { value: 'Hope', name: 'last_name' };
          wrapper.find('input').at(1).simulate('change', { target: field });
          expect(wrapper.state(field.name)).toBe(field.value);
        });

        it('should set email on input change', () => {
          const field = { value: 'test@example.com', name: 'email' };
          wrapper.find('input').at(2).simulate('change', { target: field });
          expect(wrapper.state(field.name)).toBe(field.value);
        });

        it('should set password on input change', () => {
          const field = { value: 'hogehoge', name: 'password' };
          wrapper.find('input').at(3).simulate('change', { target: field });
          expect(wrapper.state(field.name)).toBe(field.value);
        });

        it('should set password_confirmation on input change', () => {
          const field = { value: 'hogehoge', name: 'password_confirmation' };
          wrapper.find('input').at(4).simulate('change', { target: field });
          expect(wrapper.state(field.name)).toBe(field.value);
        });

      });

      describe('onSubmit', () => {
        let valid_state = {
          first_name: 'Bob',
          last_name: 'Hope',
          email: 'test@example.com',
          password: 'hogehoge',
          password_confirmation: 'hogehoge'
        };

        describe('Resolved', () => {
          const startAccess = jest.fn(() => Promise.resolve());

          beforeEach(() => {
            wrapper = shallow(<RegisterPage startAccess={startAccess} />);
          });

          it('should not call action on bad email', () => {
            wrapper.setState({
              ...valid_state,
              email: 'test'
             });
            wrapper.find('form').simulate('submit', { preventDefault: () => {} });
            expect(wrapper.state('error')).toBe(INVALID_EMAIL_PW_MSG);
            expect(wrapper.state('submitting')).toBe(false);
            expect(startAccess).not.toHaveBeenCalled();
          });

          it('should not call action on password less than 8 characters', () => {
            wrapper.setState({
              ...valid_state,
              password: '1234567'
            });
            wrapper.find('form').simulate('submit', { preventDefault: () => {} });
            expect(wrapper.state('error')).toBe(INVALID_EMAIL_PW_MSG);
            expect(wrapper.state('submitting')).toBe(false);
            expect(startAccess).not.toHaveBeenCalled();
          });

          it('should not call action on password not matching with confirmation', () => {
            wrapper.setState({
              ...valid_state,
              password_confirmation: 'piyopiyo'
            });
            wrapper.find('form').simulate('submit', { preventDefault: () => {} });
            expect(wrapper.state('error')).toBe(PASSWORD_NOT_MATCH_MSG);
            expect(wrapper.state('submitting')).toBe(false);
            expect(startAccess).not.toHaveBeenCalled();
          });

          it('should call action for valid form submission', async () => {
            wrapper.setState({ ...valid_state });
            await wrapper.find('form').simulate('submit', { preventDefault: () => {} });
            expect(wrapper.state('error')).toBe('');
            expect(wrapper.state('submitting')).toBe(true);
            expect(startAccess).toHaveBeenLastCalledWith('register', { ...valid_state });
          });
        });

        describe('Rejected', () => {
          const startAccess = jest.fn(() => Promise.reject());

          beforeEach(async () => {
            wrapper = shallow(<RegisterPage startAccess={startAccess} />);
            wrapper.setState({ ...valid_state });
            await wrapper.find('form').simulate('submit', { preventDefault: () => {} });
          });

          it('should call the action', () => {
            expect(startAccess).toHaveBeenLastCalledWith('register', { ...valid_state });
          });

          it('should set the error message', () => {
            expect(wrapper.state('error')).toBe(DEFAULT_FAILURE_MSG);
          });

          it('should set submitting', () => {
            expect(wrapper.state('submitting')).toBe(false);
          });
        });
      });

    });
  });
});
