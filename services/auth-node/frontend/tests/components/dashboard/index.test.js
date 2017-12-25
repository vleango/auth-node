import React from 'react';
import { shallow } from 'enzyme';
import { DashboardPage } from '../../../components/dashboard/index';

let wrapper = shallow(<DashboardPage />);

describe('Components', () => {
  describe('Dashboard', () => {
    describe('Index', () => {

      it('should correctly render DashboardPage', () => {
      	expect(wrapper).toMatchSnapshot();
      });

    });
  });
});
