import React from 'react';
import { connect } from 'react-redux';

import Header from './base';
import { startLogout } from '../../../actions/auth/logout';

export const PrivateHeader = ({ startLogout }) => (
  <Header
    headerLink='/dashboard'
    buttonText='Logout'
    onClickPressed={startLogout} />
);

const mapDispatchToProps = (dispatch) => ({
  startLogout: async () => await dispatch(startLogout())
});

export default connect(undefined, mapDispatchToProps)(PrivateHeader);
