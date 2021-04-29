import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Button from '../../Button';


describe('Button', () => {
  test('should show child text', () => {
    const text = 'test button component'
    const { getByText } = render(<Button>{text}</Button>);
    expect(getByText(text)).toBeInTheDocument()
  });

  test('should have no link if a link is not defined', () => {
    const { container } = render(<Button>teste</Button>);
    expect(container.querySelector('.Button')).toHaveAttribute('href', '#')
  })

  test('should have an link if a link is defined', () => {
    const { container } = render(<Button href="test-url">teste</Button>);
    expect(container.querySelector('.Button')).toHaveAttribute('href', 'test-url')
  })

  test('should have empty link relations for internal links', () => {
    const { container } = render(<Button>teste</Button>);
    expect(container.querySelector('.Button')).toHaveAttribute('rel', '')
  })

  test('should have link relations for a external url', () => {
    const { container } = render(<Button href="test-url">teste</Button>);
    expect(container.querySelector('.Button')).toHaveAttribute('rel', 'noopener noreferrer')
  })

  /*
  todo: teste click
  test('should handle click', () => {
    const fn = jest.fn()
    const { container } = render(<Button href="test-url">teste</Button>);

    fireEvent.click(getByText('Submit')
    fireEvent(
      getByText(container, 'Submit'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    )
    expect(container.querySelector('.Button')).toHaveAttribute('rel', 'noopener noreferrer')
  })
  */
})
