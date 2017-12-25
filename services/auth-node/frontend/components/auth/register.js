import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { pick } from 'lodash';

import { AuthComponentBase } from './base';
import { startAccess } from '../../actions/auth/access';

export const INVALID_EMAIL_PW_MSG = 'Invalid email or password';
export const PASSWORD_NOT_MATCH_MSG = 'Passwords do not match';
export const DEFAULT_FAILURE_MSG = 'Failed Registering';

export class RegisterPage extends AuthComponentBase {

  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirmation: '',
      submitting: false,
      error: ''
    }
  }

  onSubmit = async (e) => {
    e.preventDefault();

    if(!this.isValidEmailPasswordLength()) {
      this.setState(() => ({ error: INVALID_EMAIL_PW_MSG, submitting: false }));
      return;
    }

    if(!this.isValidPasswordMatch()) {
      this.setState(() => ({ error: PASSWORD_NOT_MATCH_MSG, submitting: false }));
      return;
    }

    const values = pick(this.state, ['first_name', 'last_name', 'email', 'password', 'password_confirmation']);

    this.setState(() => ({ error: '', submitting: true }));
    try { await this.props.startAccess('register', { ...values }) }
    catch(error) {
      let message = DEFAULT_FAILURE_MSG;
      try { message = error.response.data.message }
      catch(error) {}
      this.setState(() => ({ error: message, submitting: false }));
    }
  }

  render() {
    return (
      <div>
        <h1>Create New Account</h1>
        <form onSubmit={this.onSubmit}>
          {this.state.error && <p>{this.state.error}</p> }
          <input
            type="text"
            placeholder="John"
            autoFocus
            required
            name="first_name"
            value={this.state.first_name}
            onChange={this.onInputChange}
          />

          <input
            type="text"
            placeholder="Smith"
            required
            name="last_name"
            value={this.state.last_name}
            onChange={this.onInputChange}
          />

          <input
            type="email"
            placeholder="john@email.com"
            required
            name="email"
            value={this.state.email}
            onChange={this.onInputChange}
          />

          <input
            type="password"
            placeholder="password"
            required
            name="password"
            value={this.state.password}
            onChange={this.onInputChange}
          />

          <input
            type="password"
            placeholder="confirm password"
            required
            name="password_confirmation"
            value={this.state.password_confirmation}
            onChange={this.onInputChange}
          />

          <button disabled={this.props.submitting}>Create</button>
        </form>

        <Link to="/login">Already have an account?</Link>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  startAccess: async (action, userData) => await dispatch(startAccess(action, userData))
});

export default connect(undefined, mapDispatchToProps)(RegisterPage);
