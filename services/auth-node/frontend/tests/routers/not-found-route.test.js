import React from 'react';
import { shallow } from 'enzyme';
import { Route } from 'react-router-dom';

import { mockComponent, getRouteElements } from './helper';
import { NotFoundRoute } from '../../routers/not-found-route';

describe('Routers', () => {
  describe('NotFoundRoute', () => {

    describe('isAuthenticated', () => {
      it('should contain the PrivateHeader component', () => {
        let wrapper = shallow(<NotFoundRoute isAuthenticated={true} component={mockComponent} />);
        const elements = getRouteElements(wrapper.find(Route));
        expect(elements).toMatch(/PrivateHeader/);
      });
    });

    describe('isNotAuthenticated', () => {
      it('should contain the PublicHeader component', () => {
        let wrapper = shallow(<NotFoundRoute isAuthenticated={false} component={mockComponent} />);
        const elements = getRouteElements(wrapper.find(Route));
        expect(elements).toMatch(/PublicHeader/);
      });
    });

  });
});
