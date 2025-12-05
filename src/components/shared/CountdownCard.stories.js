import { CountdownCard } from './CountdownCard';
import { Calendar, Clock, AlertCircle, CheckSquare } from 'lucide-react';

export default {
  title: 'Shared/CountdownCard',
  component: CountdownCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Title of the countdown',
    },
    targetDate: {
      control: 'date',
      description: 'Target date for countdown',
    },
  },
};

// Calculate dates relative to today
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);

const nextMonth = new Date(today);
nextMonth.setMonth(nextMonth.getMonth() + 1);

export const Urgent = {
  args: {
    title: 'Maintenance Due',
    targetDate: tomorrow.toISOString(),
    icon: AlertCircle,
  },
};

export const Normal = {
  args: {
    title: 'Next Inspection',
    targetDate: nextWeek.toISOString(),
    icon: Calendar,
  },
};

export const Future = {
  args: {
    title: 'Annual Review',
    targetDate: nextMonth.toISOString(),
    icon: CheckSquare,
  },
};

export const Custom = {
  args: {
    title: 'Service Deadline',
    targetDate: nextWeek.toISOString(),
    icon: Clock,
  },
};
