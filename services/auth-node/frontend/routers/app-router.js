import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

import HomePage from '../components/home';
import DashboardPage from '../components/dashboard/index';
import LoginPage from '../components/auth/login';
import RegisterPage from '../components/auth/register';
import NotFoundPage from '../components/shared/errors/404';
import PrivateRoute from './private-route';
import PublicRoute from './public-route';
import NotFoundRoute from './not-found-route';

export const history = createHistory();

const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        <PublicRoute path="/" component={HomePage} exact={true} />
        <PrivateRoute path="/dashboard" component={DashboardPage} />
        <PublicRoute path="/login" component={LoginPage} />
        <PublicRoute path="/register" component={RegisterPage} />
        <NotFoundRoute component={NotFoundPage} />
      </Switch>
    </div>
  </Router>
);

export default AppRouter;
