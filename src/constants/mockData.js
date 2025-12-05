// Mock Data Generators for Simulation

export const generateMock24hFlow = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    const isPeak = (i >= 6 && i <= 9) || (i >= 17 && i <= 19);
    const baseFlow = isPeak ? 450 : 50;
    const randomFlow = Math.max(0, baseFlow + (Math.random() - 0.5) * 100);
    const finalFlow = i === 14 ? 20 : randomFlow;
    data.push({
      hour: `${i}:00`,
      flow: finalFlow,
      avg: baseFlow,
      anomaly: i === 14 ? finalFlow : null,
    });
  }
  return data;
};

export const generateMockTickets = () => [
  {
    id: 'TKT-101',
    date: 'Today, 10:00 AM',
    user: 'Villager A',
    issue: 'Low Pressure in Lane 4',
    status: 'Open',
    priority: 'High',
  },
  {
    id: 'TKT-102',
    date: 'Yesterday, 06:00 PM',
    user: 'Villager B',
    issue: 'Turbid water observed',
    status: 'Resolved',
    priority: 'Medium',
  },
  {
    id: 'TKT-103',
    date: 'Yesterday, 09:00 AM',
    user: 'School HM',
    issue: 'Tank overflow noted',
    status: 'Resolved',
    priority: 'Low',
  },
  {
    id: 'TKT-104',
    date: '22 Nov, 02:00 PM',
    user: 'Health Center',
    issue: 'No Supply',
    status: 'Open',
    priority: 'High',
  },
  {
    id: 'TKT-105',
    date: '21 Nov, 11:30 AM',
    user: 'Panchayat Office',
    issue: 'Leakage near gate',
    status: 'Open',
    priority: 'Medium',
  },
];

export const generateResponseTimeData = () => [
  { day: 'Mon', time: 45 },
  { day: 'Tue', time: 30 },
  { day: 'Wed', time: 55 },
  { day: 'Thu', time: 25 },
  { day: 'Fri', time: 40 },
  { day: 'Sat', time: 60 },
  { day: 'Sun', time: 35 },
];

export const HAZARD_LOGS = [
  {
    id: 1,
    time: 'Today, 10:42 AM',
    type: 'Major Leak',
    area: 'Sector A - Pipe 4',
    coordinates: '23.455, 85.321',
    status: 'Active',
  },
  {
    id: 2,
    time: 'Yesterday, 04:20 PM',
    type: 'Pressure Drop',
    area: 'Sector B - Junction',
    coordinates: '23.461, 85.310',
    status: 'Resolved',
  },
  {
    id: 3,
    time: '22 Nov, 09:15 AM',
    type: 'Valve Fault',
    area: 'Tank Output',
    coordinates: '23.442, 85.335',
    status: 'Resolved',
  },
];
