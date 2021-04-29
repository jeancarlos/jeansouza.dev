import React from 'react';
import { render } from '@testing-library/react';

import Article from '../../Article';


describe('Article', () => {
  test('should show child text', () => {
    const text = 'test article component'
    const { getByText } = render(<Article>{text}</Article>);
    expect(getByText(text)).toBeInTheDocument()
  });
})
