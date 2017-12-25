import React from 'react';
import { shallow } from 'enzyme';

import { PrivateHeader } from '../../../../components/shared/headers/private-header';

describe('Components', () => {
  describe('Shared', () => {
    describe('Headers', () => {
      describe('PrivateHeader', () => {

        it('should render PrivateHeader correctly', () => {
        	const wrapper = shallow(<PrivateHeader />);
        	expect(wrapper).toMatchSnapshot();
        });

      });

    });
  });
});
