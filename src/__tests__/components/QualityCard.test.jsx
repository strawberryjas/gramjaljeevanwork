import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QualityCard } from '../../components/shared/QualityCard';
import { Beaker } from 'lucide-react';

describe('QualityCard', () => {
  it('renders label and value correctly', () => {
    render(
      <QualityCard
        label="pH Level"
        value={7.2}
        unit="pH"
        safeMax={8.5}
        safeMin={6.5}
        icon={Beaker}
      />
    );

    expect(screen.getByText('pH Level')).toBeInTheDocument();
    expect(screen.getByText('7.20')).toBeInTheDocument();
    expect(screen.getByText('pH')).toBeInTheDocument();
  });

  it('shows SAFE status when value is within range', () => {
    render(
      <QualityCard
        label="pH Level"
        value={7.2}
        unit="pH"
        safeMax={8.5}
        safeMin={6.5}
        icon={Beaker}
      />
    );

    expect(screen.getByText('SAFE')).toBeInTheDocument();
    const card = screen.getByText('pH Level').closest('div');
    expect(card).toHaveClass('bg-white', 'border-emerald-200');
  });

  it('shows ALERT status when value is below minimum', () => {
    render(
      <QualityCard
        label="pH Level"
        value={5.2}
        unit="pH"
        safeMax={8.5}
        safeMin={6.5}
        icon={Beaker}
      />
    );

    expect(screen.getByText('ALERT')).toBeInTheDocument();
    const card = screen.getByText('pH Level').closest('div');
    expect(card).toHaveClass('bg-red-50', 'border-red-200');
  });

  it('shows ALERT status when value is above maximum', () => {
    render(
      <QualityCard
        label="pH Level"
        value={9.5}
        unit="pH"
        safeMax={8.5}
        safeMin={6.5}
        icon={Beaker}
      />
    );

    expect(screen.getByText('ALERT')).toBeInTheDocument();
  });

  it('displays standard range correctly', () => {
    render(
      <QualityCard
        label="pH Level"
        value={7.2}
        unit="pH"
        safeMax={8.5}
        safeMin={6.5}
        icon={Beaker}
      />
    );

    expect(screen.getByText(/Standard: 6.5-8.5 pH/)).toBeInTheDocument();
  });

  it('handles zero minimum correctly', () => {
    render(
      <QualityCard
        label="Turbidity"
        value={2.5}
        unit="NTU"
        safeMax={5.0}
        safeMin={0}
        icon={Beaker}
      />
    );

    expect(screen.getByText(/Standard: <5.0 NTU/)).toBeInTheDocument();
  });
});
