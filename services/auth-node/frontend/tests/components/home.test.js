import React from 'react';
import { shallow } from 'enzyme';
import { HomePage } from '../../components/home';

let wrapper = shallow(<HomePage />);

describe('Components', () => {
  describe('Home', () => {

    it('should correctly render HomePage', () => {
      expect(wrapper).toMatchSnapshot();
    });

  });
});
