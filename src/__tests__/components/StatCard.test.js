import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from '../../components/shared/StatCard';
import { Activity } from 'lucide-react';

describe('StatCard', () => {
  it('renders label and value correctly', () => {
    render(
      <StatCard
        label="Test Label"
        value={100}
        unit="L"
        icon={Activity}
      />
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('L')).toBeInTheDocument();
  });

  it('renders with different status colors', () => {
    const { rerender } = render(
      <StatCard
        label="Test"
        value={50}
        unit="%"
        icon={Activity}
        status="good"
      />
    );

    const card = screen.getByText('Test').closest('div');
    expect(card).toHaveClass('bg-emerald-50');

    rerender(
      <StatCard
        label="Test"
        value={50}
        unit="%"
        icon={Activity}
        status="critical"
      />
    );

    expect(card).toHaveClass('bg-red-50');
  });

  it('displays subLabel when provided', () => {
    render(
      <StatCard
        label="Test"
        value={100}
        unit="L"
        icon={Activity}
        subLabel="Test sublabel"
      />
    );

    expect(screen.getByText('Test sublabel')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(
      <StatCard
        label="Test"
        value={100}
        unit="L"
        icon={Activity}
        onClick={handleClick}
      />
    );

    const card = screen.getByText('Test').closest('div');
    card.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('formats decimal numbers correctly', () => {
    render(
      <StatCard
        label="Test"
        value={123.456}
        unit="L"
        icon={Activity}
      />
    );

    expect(screen.getByText('123.5')).toBeInTheDocument();
  });

  it('formats integer numbers correctly', () => {
    render(
      <StatCard
        label="Test"
        value={100}
        unit="L"
        icon={Activity}
      />
    );

    expect(screen.getByText('100')).toBeInTheDocument();
  });
});

