import React from 'react';
import { render } from '@testing-library/react';
import AddHabit from './AddHabit';

const mockProps = {
    username: 'test',
};

describe('Add Habit Component', () => {
  it('renders without crashing', () => {
    render(<AddHabit {...mockProps} />);
  });
});
