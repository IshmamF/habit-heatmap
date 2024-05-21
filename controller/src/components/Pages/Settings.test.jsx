import React from 'react';
import { render } from '@testing-library/react';
import Settings from './Settings';

const mockProps = {
    username: 'test',
    setUsername: jest.fn(),
};

describe('Settings Component', () => {
  it('renders without crashing', () => {
    render(<Settings {...mockProps} />);
  });
});
