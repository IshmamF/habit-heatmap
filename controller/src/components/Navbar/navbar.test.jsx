import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

const mockProps = {
  theme: 'light',
  toggleTheme: jest.fn(),
};

describe('Navbar Component', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <Navbar {...mockProps} />
      </MemoryRouter>
    );
  });
});
