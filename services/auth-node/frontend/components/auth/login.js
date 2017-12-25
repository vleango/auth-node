import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { pick } from 'lodash';
import FacebookLogin from 'react-facebook-login';

import { AuthComponentBase } from './base';
import { startAccess } from '../../actions/auth/access';

export const INVALID_INPUT_MSG = 'Invalid email or password';
export const RECORD_NOT_FOUND_MSG = 'no record for this email and password';

export class LoginPage extends AuthComponentBase {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      submitting: false,
      error: ''
    }
  }

  onSubmit = async (e) => {
    e.preventDefault();

    if(!this.isValidEmailPasswordLength()) {
      this.setState(() => ({ error: INVALID_INPUT_MSG, submitting: false } ));
      return;
    }

    const values = pick(this.state, ['email', 'password']);
    this.setState(() => ({ error: '', submitting: true }));
    try { await this.props.startAccess('login', { ...values }) }
    catch(error) { this.setState(() => ({ error: RECORD_NOT_FOUND_MSG, submitting: false })) }
  }

  render() {
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.onSubmit}>
          {this.state.error && <p>{this.state.error}</p> }
          <input
            type="email"
            placeholder="john@email.com"
            autoFocus
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

          <button disabled={this.state.submitting}>Login</button>
        </form>

        <FacebookLogin
          appId={this.FACEBOOK_APP_ID}
          fields="name,email"
          size="small"
          callback={this.authorizeWithFacebook}
        />

        <Link to="/register">Create new account?</Link>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  startAccess: async (action, data) => await dispatch(startAccess(action, data))
});

export default connect(undefined, mapDispatchToProps)(LoginPage);
