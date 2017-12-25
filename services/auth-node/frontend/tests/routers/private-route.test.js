import React from 'react';
import { shallow } from 'enzyme';
import { Route } from 'react-router-dom';

import { mockComponent, getRouteElements } from './helper';
import { PrivateRoute } from '../../routers/private-route';

describe('Routers', () => {
  describe('PrivateRoute', () => {

    describe('isAuthenticated', () => {
      it('should contain the PrivateHeader component', () => {
        let wrapper = shallow(<PrivateRoute isAuthenticated={true} component={mockComponent} />);
        const elements = getRouteElements(wrapper.find(Route));
        expect(elements).toMatch(/PrivateHeader/);
      });
    });

    describe('isNotAuthenticated', () => {
      it('should redirect to login', () => {
        let wrapper = shallow(<PrivateRoute isAuthenticated={false} component={mockComponent} />);
        const elements = getRouteElements(wrapper.find(Route));
        expect(elements).toMatch(/\/login/);
      });
    });

  });
});
