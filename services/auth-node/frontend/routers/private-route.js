import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import PrivateHeader from '../components/shared/headers/private-header';

export const PrivateRoute = ({
  isAuthenticated,
  component: Component,
  ...rest
 }) => (
  <Route {...rest} component={(props) => (
    isAuthenticated ? (
      <div>
        <PrivateHeader {...props} />
        <Component {...props} />
      </div>
    ) : (
      <Redirect to="/login" />
    )
  )} />
);

const mapStateToProps = (state) => ({
  isAuthenticated: !!state.auth.token
});

export default connect(mapStateToProps)(PrivateRoute);
