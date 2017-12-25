import React from 'react';
import { shallow } from 'enzyme';
import {
  LoginPage,
  INVALID_INPUT_MSG,
  RECORD_NOT_FOUND_MSG,
} from '../../../components/auth/login';

let wrapper = shallow(<LoginPage />);

describe('Components', () => {
  describe('Auth', () => {
    describe('Login', () => {

      it('should correctly render LoginPage', () => {
      	expect(wrapper).toMatchSnapshot();
      });

      describe('onInputChange', () => {
        it('should set email on input change', () => {
          const field = { value: 'test@example.com', name: 'email' };
          wrapper.find('input').at(0).simulate('change', { target: field });
          expect(wrapper.state(field.name)).toBe(field.value);
        });

        it('should set password on input change', () => {
          const field = { value: 'hogehoge', name: 'password' };
          wrapper.find('input').at(1).simulate('change', { target: field });
          expect(wrapper.state(field.name)).toBe(field.value);
        });
      });

      describe('onSubmit', () => {
        const valid_state = {
          email: 'test@example.com',
          password: 'hogehoge'
        }
        describe('Resolved', () => {
          const startAccess = jest.fn(() => Promise.resolve());

          beforeEach(() => {
            wrapper = shallow(<LoginPage startAccess={startAccess} />);
          });

          it('should not call action on bad email', () => {
            wrapper.setState({
              ...valid_state,
              email: 'test' });
            wrapper.find('form').simulate('submit', { preventDefault: () => {} });
            expect(wrapper.state('error')).toBe(INVALID_INPUT_MSG);
            expect(wrapper.state('submitting')).toBe(false);
            expect(startAccess).not.toHaveBeenCalled();
          });

          it('should not call action on password less than 8 characters', () => {
            wrapper.setState({
              ...valid_state,
              password: '1234567' });
            wrapper.find('form').simulate('submit', { preventDefault: () => {} });
            expect(wrapper.state('error')).toBe(INVALID_INPUT_MSG);
            expect(wrapper.state('submitting')).toBe(false);
            expect(startAccess).not.toHaveBeenCalled();
          });

          it('should call action for valid form submission', async () => {
            wrapper.setState({ ...valid_state });
            await wrapper.find('form').simulate('submit', { preventDefault: () => {} });
            expect(wrapper.state('error')).toBe('');
            expect(wrapper.state('submitting')).toBe(true);
            expect(startAccess).toHaveBeenLastCalledWith('login', { ...valid_state });
          });
        });

        describe('Rejected', () => {
          const startAccess = jest.fn(() => Promise.reject());

          beforeEach(async () => {
            wrapper = shallow(<LoginPage startAccess={startAccess} />);
            wrapper.setState({ ...valid_state });
            await wrapper.find('form').simulate('submit', { preventDefault: () => {} });
          });

          it('should call the action', () => {
            expect(startAccess).toHaveBeenLastCalledWith('login', { ...valid_state });
          });

          it('should set the error message', () => {
            expect(wrapper.state('error')).toBe(RECORD_NOT_FOUND_MSG);
          });

          it('should set submitting', () => {
            expect(wrapper.state('submitting')).toBe(false);
          });
        });

      });

    });
  });
});
