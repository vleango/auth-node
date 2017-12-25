import React from 'react';

import Header from './base';

export class PublicHeader extends React.Component {

  loginBtnClicked = () => {
    this.props.history.push('/login');
  };

  render() {
    return (
      <Header
        headerLink='/'
        buttonText='Login'
        onClickPressed={this.loginBtnClicked} />
    );
  }

}

export default PublicHeader;
