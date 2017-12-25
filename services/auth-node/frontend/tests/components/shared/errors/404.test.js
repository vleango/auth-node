import React from 'react';
import { shallow } from 'enzyme';
import { NotFoundPage } from '../../../../components/shared/errors/404';

let wrapper = shallow(<NotFoundPage />);

describe('Components', () => {
  describe('Shared', () => {
    describe('Errors', () => {
      describe('404', () => {

        it('should correctly render NotFoundPage', () => {
        	expect(wrapper).toMatchSnapshot();
        });

      });

    });
  });
});
