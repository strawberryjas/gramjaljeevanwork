import { QualityCard } from './QualityCard';
import { Droplet, Thermometer, Beaker, Gauge } from 'lucide-react';

export default {
  title: 'Shared/QualityCard',
  component: QualityCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Quality parameter label',
    },
    value: {
      control: { type: 'number', step: 0.1 },
      description: 'Current measured value',
    },
    unit: {
      control: 'text',
      description: 'Unit of measurement',
    },
    safeMax: {
      control: { type: 'number', step: 0.1 },
      description: 'Maximum safe value',
    },
    safeMin: {
      control: { type: 'number', step: 0.1 },
      description: 'Minimum safe value',
    },
  },
};

export const Safe = {
  args: {
    label: 'pH Level',
    value: 7.2,
    unit: 'pH',
    safeMax: 8.5,
    safeMin: 6.5,
    icon: Beaker,
  },
};

export const Alert = {
  args: {
    label: 'pH Level',
    value: 5.2,
    unit: 'pH',
    safeMax: 8.5,
    safeMin: 6.5,
    icon: Beaker,
  },
};

export const Turbidity = {
  args: {
    label: 'Turbidity',
    value: 2.5,
    unit: 'NTU',
    safeMax: 5.0,
    safeMin: 0,
    icon: Droplet,
  },
};

export const Chlorine = {
  args: {
    label: 'Chlorine',
    value: 0.8,
    unit: 'mg/L',
    safeMax: 2.0,
    safeMin: 0.2,
    icon: Thermometer,
  },
};

export const TDS = {
  args: {
    label: 'Total Dissolved Solids',
    value: 450,
    unit: 'ppm',
    safeMax: 500,
    safeMin: 0,
    icon: Gauge,
  },
};

export const Critical = {
  args: {
    label: 'pH Level',
    value: 4.5,
    unit: 'pH',
    safeMax: 8.5,
    safeMin: 6.5,
    icon: Beaker,
  },
};
