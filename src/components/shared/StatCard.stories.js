import { StatCard } from './StatCard';
import { Activity, Droplet, Zap, Gauge } from 'lucide-react';

export default {
  title: 'Shared/StatCard',
  component: StatCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['neutral', 'good', 'warning', 'critical', 'highlight'],
      description: 'Status color variant',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler',
    },
  },
};

export const Default = {
  args: {
    icon: Activity,
    label: 'Water Pumped',
    value: 2458,
    unit: 'Liters',
    status: 'neutral',
  },
};

export const Good = {
  args: {
    icon: Droplet,
    label: 'Tank Level',
    value: 85,
    unit: '%',
    status: 'good',
    subLabel: 'Optimal',
  },
};

export const Warning = {
  args: {
    icon: Gauge,
    label: 'System Pressure',
    value: 1.2,
    unit: 'bar',
    status: 'warning',
    subLabel: 'Low pressure',
  },
};

export const Critical = {
  args: {
    icon: Zap,
    label: 'Power Consumption',
    value: 95,
    unit: '%',
    status: 'critical',
    subLabel: 'High usage',
  },
};

export const Highlight = {
  args: {
    icon: Activity,
    label: 'System Status',
    value: 'Online',
    unit: '',
    status: 'highlight',
    subLabel: 'All systems operational',
  },
};

export const WithSubLabel = {
  args: {
    icon: Droplet,
    label: 'Flow Rate',
    value: 420,
    unit: 'L/min',
    status: 'good',
    subLabel: '+12% from last hour',
  },
};
