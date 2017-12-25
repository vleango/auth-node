import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import PrivateHeader from '../components/shared/headers/private-header';
import PublicHeader from '../components/shared/headers/public-header';

export const NotFoundRoute = ({
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

export default connect(mapStateToProps)(NotFoundRoute);
