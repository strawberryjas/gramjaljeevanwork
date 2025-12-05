// System Thresholds and Limits
export const THRESHOLDS = {
  pressureLow: 3.0,
  tempHigh: 85,
  phMin: 6.5,
  phMax: 8.5,
  turbidityMax: 5.0,
  flowLeakThreshold: 400,
};

// Initial Sensor Data
export const INITIAL_SENSORS = {
  pumpStatus: 'STOPPED',
  valveStatus: 'OPEN',

  // 1. INFRASTRUCTURE
  pumpRunningHours: 124.5,
  pumpLastStartTime: 'Today, 06:00 AM',
  pumpLastStopTime: 'Today, 09:30 AM',
  pumpEfficiency: 0,
  pumpFlowRate: 0,
  pumpPower: 0,
  pumpMotorTemp: 45,
  pumpVoltage: 220,
  pipePressure: 0.5,
  areaFlowA: 0,
  areaFlowB: 0,
  areaFlowC: 0,
  pipeLeakDropDetected: false,
  pipeBurstDetected: false,
  tankLevel: 78,
  tankTimeFill: 0,
  tankTimeEmpty: 0,
  tankOverflow: false,
  tankSupplyDuration: 3.5,
  valveLastOpTime: 1.2,
  valveFault: false,
  leakUnexpectedUsage: false,
  leakHighRunHours: false,

  // 2. OPERATIONS
  dailyEnergyKWh: 42.5,
  dailyWaterProduction: 18500,
  dailyWaterDistributed: 17800,
  dailySupplyHours: 3.2,
  dailyDistributionCycles: 1,
  monthlyFaults: 2,
  avgDetectionTime: 15,
  avgRepairTime: 140,
  lastRepairCategory: 'Minor (Seal)',
  lastInspectionDate: 'Today, 08:00 AM',
  lastInspectionOperator: 'Ramesh Kumar',
  lastVisualLeakCheck: 'Clear',

  // 3. WATER QUALITY
  qualityPH: 7.2,
  qualityTurbidity: 2.1,
  qualityChlorine: 0.5,
  qualityTDS: 250,
  qualityIron: 0.1,
  qualityFluoride: 0.8,
  qualityNitrate: 15,
  qualityHardness: 180,
  qualityColiform: 0,
  lastTestTime: 'Today, 07:30 AM',
  lastTestLocation: 'Source Outlet',
  lastTestOperator: 'System Auto-Log',

  // 4. FORECASTING
  predFlowDropPercent: 0,
  predEnergySpikePercent: 0,
  predTempTrend: 'Stable',
  predTankDelayPercent: 0,
  predLowFlowEvents: 0,

  // Maintenance Scheduling
  nextPumpService: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
  nextValveService: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
  nextQualityTest: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),

  // 5. ACCOUNTABILITY
  communityFeedbackScore: 4.2,
  activeComplaints: 3,
  avgFaultResponseTime: 45,

  // 6. ENERGY
  powerFactor: 0.92,
  gridFrequency: 50.1,
};
