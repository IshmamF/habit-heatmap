import React from 'react';
import { render } from '@testing-library/react';
import AddHabit from './AddHabit';


describe('Add Habit Component', () => {
  it('renders without crashing', () => {
    render(<AddHabit />);
  });
});
