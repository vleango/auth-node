import React from 'react';
import Validator from 'validator';
import { pick } from 'lodash';
import FacebookLogin from 'react-facebook-login';

export const PROVIDER_ERR_MSG = 'Error using provider';

export class AuthComponentBase extends React.Component {

  FACEBOOK_APP_ID = `${process.env.FACEBOOK_APP_ID}`;

  constructor(props) {
    super(props);
  }

  onInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(() => ({ [field]: value }));
  }

  isValidEmailPasswordLength() {
    const {email, password} = this.state;
    return Validator.isEmail(email) && password.length >= 8;
  }

  isValidPasswordMatch() {
    const {password, password_confirmation} = this.state;
    return password === password_confirmation;
  }

  authorizeWithFacebook = async (response) => {
    const values = pick(response, ['name', 'email', 'accessToken', 'userID']);
    if(values.accessToken && values.name && values.email && values.userID) {
      const [first_name, last_name] = response.name.split(' ');
      try { await this.props.startAccess('provider', { ...values, first_name, last_name, access: 'facebook' }) }
      catch(error) { await this.setState(() => ({ error: PROVIDER_ERR_MSG, submitting: false })) }
    }
    else {
      console.log('Facebook Login Cancelled');
    }
  }

  render() { }

}
