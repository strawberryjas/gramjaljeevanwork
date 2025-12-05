import { GaugeChart } from './GaugeChart';

export default {
  title: 'Shared/GaugeChart',
  component: GaugeChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Current value to display',
    },
    max: {
      control: { type: 'number', min: 1 },
      description: 'Maximum value for the gauge',
    },
    label: {
      control: 'text',
      description: 'Label text below the gauge',
    },
    color: {
      control: 'color',
      description: 'Color of the gauge arc',
    },
  },
};

export const Default = {
  args: {
    value: 75,
    max: 100,
    label: 'Tank Level',
    color: '#3B82F6',
  },
};

export const Low = {
  args: {
    value: 25,
    max: 100,
    label: 'Water Pressure',
    color: '#EF4444',
  },
};

export const High = {
  args: {
    value: 95,
    max: 100,
    label: 'System Efficiency',
    color: '#10B981',
  },
};

export const CustomColor = {
  args: {
    value: 60,
    max: 100,
    label: 'Flow Rate',
    color: '#F59E0B',
  },
};

export const DifferentMax = {
  args: {
    value: 450,
    max: 500,
    label: 'Liters',
    color: '#8B5CF6',
  },
};
