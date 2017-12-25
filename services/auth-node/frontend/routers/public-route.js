import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import PublicHeader from '../components/shared/headers/public-header';

export const PublicRoute = ({
  isAuthenticated,
  component: Component,
  ...rest
 }) => (
  <Route {...rest} component={(props) => (
    isAuthenticated ? (
      <Redirect to="/dashboard" />
    ) : (
      <div>
        <PublicHeader {...props} />
        <Component {...props} />
      </div>
    )
  )} />
);

const mapStateToProps = (state) => ({
  isAuthenticated: !!state.auth.token
});

export default connect(mapStateToProps)(PublicRoute);
