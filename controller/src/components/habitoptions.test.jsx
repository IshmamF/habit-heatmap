import React from 'react';
import { render, screen } from '@testing-library/react';
import HabitOptions from './habitoptions';

const mockHandleChange = jest.fn();

const habits = [
  { habitName: "Habit 1", metric: "metric 1", color: "color 1", data: [] },
  { habitName: "Habit 2", metric: "metric 2", color: "color 2", data: [] },
];

describe('HabitOptions Component', () => {
  it('renders without crashing', () => {
    render(<HabitOptions habits={habits} handleChange={mockHandleChange} />);
    expect(screen.getByText('Select Habit:')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
