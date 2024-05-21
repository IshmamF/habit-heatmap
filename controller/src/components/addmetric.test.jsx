import React from 'react';
import { render } from '@testing-library/react';
import AddMetric from './addmetric';

// Mock props
const mockProps = {
  openAdd: true,
  closeAddModal: jest.fn(),
  submitMetric: jest.fn((e) => e.preventDefault()), 
  date: '2024-05-21',
  selectedHabit: {
    metric: 'pages'
  }
};

describe('Add Metric Component', () => {
  it('renders without crashing', () => {
    render(<AddMetric {...mockProps} />);
  });
});
