import React from 'react';
import { shallow } from 'enzyme';

import { Header } from '../../../../components/shared/headers/base';

describe('Components', () => {
  describe('Shared', () => {
    describe('Headers', () => {
      describe('Base', () => {

        it('should render Header correctly', () => {
        	const wrapper = shallow(<Header headerLink='/' />);
        	expect(wrapper).toMatchSnapshot();
        });

        it('should call action on button click', () => {
        	const action = jest.fn();
        	const wrapper = shallow(<Header headerLink='/' onClickPressed={action} />);
        	wrapper.find('button').simulate('click');
        	expect(action).toHaveBeenCalled();
        });

      });

    });
  });
});
