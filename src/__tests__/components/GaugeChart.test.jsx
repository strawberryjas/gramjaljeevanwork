import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GaugeChart } from '../../components/shared/GaugeChart';

describe('GaugeChart', () => {
  it('renders label correctly', () => {
    render(<GaugeChart value={75} max={100} label="Test Gauge" color="#3B82F6" />);

    expect(screen.getByText('Test Gauge')).toBeInTheDocument();
  });

  it('displays correct percentage value', () => {
    render(<GaugeChart value={50} max={100} label="Test" color="#3B82F6" />);

    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('calculates percentage correctly for different max values', () => {
    render(<GaugeChart value={250} max={500} label="Test" color="#3B82F6" />);

    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('clamps value to 0-100% range', () => {
    const { rerender } = render(<GaugeChart value={150} max={100} label="Test" color="#3B82F6" />);

    expect(screen.getByText('100%')).toBeInTheDocument();

    rerender(<GaugeChart value={-10} max={100} label="Test" color="#3B82F6" />);

    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});
