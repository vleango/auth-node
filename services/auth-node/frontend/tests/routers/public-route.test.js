import React from 'react';
import { shallow } from 'enzyme';
import { Route } from 'react-router-dom';

import { mockComponent, getRouteElements } from './helper';
import { PublicRoute } from '../../routers/public-route';

describe('Routers', () => {
  describe('PublicRoute', () => {

    describe('isAuthenticated', () => {
      it('should redirect to dashboard', () => {
        let wrapper = shallow(<PublicRoute isAuthenticated={true} component={mockComponent} />);
        const elements = getRouteElements(wrapper.find(Route));
        expect(elements).toMatch(/\/dashboard/);
      });
    });

    describe('isNotAuthenticated', () => {
      it('should contain the PublicHeader component', () => {
        let wrapper = shallow(<PublicRoute isAuthenticated={false} component={mockComponent} />);
        const elements = getRouteElements(wrapper.find(Route));
        expect(elements).toMatch(/PublicHeader/);
      });
    });

  });
});
