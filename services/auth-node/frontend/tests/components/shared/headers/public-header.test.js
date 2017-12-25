import React from 'react';
import { shallow } from 'enzyme';

import { PublicHeader } from '../../../../components/shared/headers/public-header';

describe('Components', () => {
  describe('Shared', () => {
    describe('Headers', () => {
      describe('PublicHeader', () => {

        it('should render PublicHeader correctly', () => {
        	const wrapper = shallow(<PublicHeader />);
        	expect(wrapper).toMatchSnapshot();
        });

      });

    });
  });
});
