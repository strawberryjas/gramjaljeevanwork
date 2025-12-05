/**
 * Utility functions for App.jsx refactoring
 * Contains formatting, data transformation, and helper functions
 */

export const formatMetric = (value, decimals = 2, fallback = 0) => {
  const parsed = Number(value);
  if (Number.isFinite(parsed)) {
    return Number(parsed.toFixed(decimals));
  }
  const fb = Number(fallback);
  return Number.isFinite(fb) ? Number(fb.toFixed(decimals)) : 0;
};

export const formatDurationLabel = (ms = 0) => {
  if (!ms || ms <= 0) return '0s';
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  return `${seconds}s`;
};

export const toLocalInputString = (date) => {
  if (!(date instanceof Date)) return '';
  const pad = (num) => `${num}`.padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const transformStateToData = (state) => {
  const defaultData = {
    pumpStatus: 'OFF',
    pumpFlowRate: 0,
    pipePressure: 0,
    tankLevel: 0,
    pumpPower: 0,
    pumpMotorTemp: 25,
    pumpRunningHours: 0,
    pumpEfficiency: 65,
    powerFactor: 0.95,
    qualityTDS: 0,
    qualityPH: 7,
    qualityTurbidity: 0,
    qualityChlorine: 0,
    qualityTemperature: 26,
    qualityHardness: 180,
    qualityEC: 450,
    lastInspectionDate: '',
    lastInspectionOperator: '',
    lastWaterTest: '',
    dailyEnergyKWh: 0,
    dailyWaterDistributed: 0,
    predFlowDropPercent: 0,
    predEnergySpikePercent: 0,
    nextPumpService: '',
    nextValveService: '',
    efficiency: 0,
    leakage: 0,
    communityFeedbackScore: 4.2,
    dailySupplyHours: 4.5,
    pipelineQualities: [],
    pumpSchedule: {
      mode: 'MANUAL',
      timerRemainingMs: 0,
      timerEnd: null,
    },
    pumpScheduleMode: 'MANUAL',
    pumpScheduleRemainingMs: 0,
    pumpScheduleStopsAt: null,
  };

  if (!state) return defaultData;

  const tank = state.overheadTank || {};
  const pump = state.pumpHouse || {};
  const metrics = state.systemMetrics || {};
  const quality = tank.waterQuality || {};
  const pipelines = state.pipelines || [];
  const pumpSchedule = state.pumpSchedule || {};

  const runtimeHours = pump.pumpStatus === 'ON' ? 10 : 6;
  const avgFlow = metrics.totalFlowRate || pump.pumpFlowOutput || 0;
  const pumpLoad = pump.powerConsumption || 0;

  const dailyEnergyKWh = formatMetric(pumpLoad * runtimeHours, 1, 0);
  const dailyWaterDistributed = Math.max(5000, Math.round(avgFlow * 60 * runtimeHours));
  const predFlowDropPercent = Math.min(95, Math.max(5, (metrics.totalLeakage || 0) * 2));
  const predEnergySpikePercent = Math.min(
    95,
    Math.max(5, pump.motorTemperature ? (pump.motorTemperature - 25) * 2 : 15)
  );

  const formatDate = (date) =>
    new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);

  const pipelineQualities = pipelines.map((pipeline) => {
    const inletQuality = pipeline.inlet?.qualitySensor || {};
    const outletQuality = pipeline.outlet?.qualitySensor || {};
    const shortName =
      pipeline.pipelineName?.split(' - ').pop() || `Pipeline ${pipeline.pipelineId}`;

    return {
      pipelineId: pipeline.pipelineId,
      pipelineName: pipeline.pipelineName || `Pipeline ${pipeline.pipelineId}`,
      shortName,
      valveStatus: pipeline.valveStatus,
      deviation: formatMetric(pipeline.qualityDeviation ?? 0, 1, 0),
      inlet: {
        turbidity: formatMetric(inletQuality.turbidity ?? quality.turbidity, 2, quality.turbidity),
        pH: formatMetric(inletQuality.pH ?? quality.pH, 2, quality.pH),
        chlorine: formatMetric(inletQuality.chlorine ?? quality.chlorine, 2, quality.chlorine),
        TDS: formatMetric(inletQuality.TDS ?? quality.TDS, 0, quality.TDS),
      },
      outlet: {
        turbidity: formatMetric(
          outletQuality.turbidity ?? inletQuality.turbidity ?? quality.turbidity,
          2,
          quality.turbidity
        ),
        pH: formatMetric(outletQuality.pH ?? inletQuality.pH ?? quality.pH, 2, quality.pH),
        chlorine: formatMetric(
          outletQuality.chlorine ?? inletQuality.chlorine ?? quality.chlorine,
          2,
          quality.chlorine
        ),
        TDS: formatMetric(outletQuality.TDS ?? inletQuality.TDS ?? quality.TDS, 0, quality.TDS),
      },
    };
  });

  return {
    ...defaultData,
    pumpStatus: pump.pumpStatus || 'OFF',
    pumpFlowRate: pump.pumpFlowOutput || 0,
    pipePressure: pump.pumpPressureOutput || 0,
    tankLevel: tank.tankLevel || 0,
    pumpPower: pumpLoad,
    pumpMotorTemp: pump.motorTemperature || 25,
    pumpRunningHours: pump.pumpRunningHours || 0,
    pumpEfficiency: pump.pumpEfficiency ?? 65,
    powerFactor: pump.powerFactor ?? 0.95,
    qualityTDS: quality.TDS || 0,
    qualityPH: quality.pH || 7,
    qualityTurbidity: quality.turbidity || 0,
    qualityChlorine: quality.chlorine || 0,
    qualityTemperature: tank.temperature ?? 26,
    qualityHardness: quality.hardness || 180,
    qualityEC: quality.EC || 450,
    lastInspectionDate: formatDate(new Date()),
    lastInspectionOperator: 'TECH-OPS-01',
    lastWaterTest: formatDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
    dailyEnergyKWh,
    dailyWaterDistributed,
    predFlowDropPercent,
    predEnergySpikePercent,
    nextPumpService: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    nextValveService: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    pipelineQualities,
    // Additional fields for compatibility
    flowRate: avgFlow,
    pressure: pump.pumpPressureOutput || 0,
    powerConsumption: pumpLoad,
    turbidity: quality.turbidity || 0,
    chlorine: quality.chlorine || 0,
    pH: quality.pH || 7,
    efficiency: metrics.systemEfficiency || 0,
    leakage: metrics.totalLeakage || 0,
    pumpSchedule,
    pumpScheduleMode: pumpSchedule.mode || 'MANUAL',
    pumpScheduleRemainingMs: pumpSchedule.timerRemainingMs || 0,
    pumpScheduleStopsAt: pumpSchedule.timerEnd
      ? new Date(pumpSchedule.timerEnd).toISOString()
      : null,
  };
};
