import React from 'react';
import { useSimulationData } from '../../hooks/useSimulationData';
import { Gauge, ArrowLeft, Activity, Clock, AlertTriangle } from 'lucide-react';

export const ValvesDashboard = ({ onBack }) => {
  const { state, toggleValve, isLive } = useSimulationData();
  
  // Get valves from digital twin pipelines
  const valves = state?.pipelines?.map(p => ({
    id: `V-${p.pipelineId}`,
    pipelineId: p.pipelineId,
    location: p.pipelineName?.replace(/.*- /, '') || `Ward ${p.pipelineId}`,
    state: p.valveStatus,
    automation: 'Manual',
    lastAction: 'Just now',
    flow: p.inlet?.flowSensor?.value || 0,
    pressure: p.inlet?.pressureSensor?.value || 0,
    leakageProbability: p.leakageProbability || 0,
  })) || [];

  const handleValveToggle = (valve) => {
    if (valve.pipelineId && toggleValve) {
      toggleValve(valve.pipelineId);
    }
  };

  const openCount = valves.filter(v => v.state === 'OPEN').length;
  const totalCount = valves.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 transition-colors"
            style={{
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--gray-light)',
              color: 'var(--gray-text-dark)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-border)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-light)'}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 
              className="flex items-center gap-3"
              style={{ 
                fontSize: 'var(--font-size-3xl)', 
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--gray-text-dark)'
              }}
            >
              <Gauge size={32} style={{ color: 'var(--primary-blue)' }} /> Valve Control System
            </h2>
            <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--gray-text)' }}>
              Monitor and control all distribution valves
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isLive && (
            <div className="flex items-center gap-2 px-3 py-2" style={{ backgroundColor: '#D1FAE5', borderRadius: 'var(--radius-sm)' }}>
              <Activity size={14} style={{ color: '#059669' }} />
              <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: '#059669' }}>
                Live Data
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-3 gap-2 md:gap-6">
        <div className="p-2 md:p-6" style={{ backgroundColor: 'var(--bg-white)', border: '1px solid var(--gray-border)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)' }}>
          <p className="text-[10px] md:text-lg" style={{ color: 'var(--gray-text)', marginBottom: '4px' }}>Total Valves</p>
          <p className="text-sm md:text-3xl font-black" style={{ color: 'var(--gray-text-dark)' }}>
            {totalCount}
          </p>
        </div>
        <div className="p-2 md:p-6" style={{ backgroundColor: '#D1FAE5', border: '1px solid #86EFAC', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)' }}>
          <p className="text-[10px] md:text-lg" style={{ color: '#059669', marginBottom: '4px' }}>Open Valves</p>
          <p className="text-sm md:text-3xl font-black" style={{ color: '#059669' }}>
            {openCount}
          </p>
        </div>
        <div className="p-2 md:p-6" style={{ backgroundColor: '#F3F4F6', border: '1px solid var(--gray-border)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)' }}>
          <p className="text-[10px] md:text-lg" style={{ color: 'var(--gray-text)', marginBottom: '4px' }}>Closed Valves</p>
          <p className="text-sm md:text-3xl font-black" style={{ color: 'var(--gray-text-dark)' }}>
            {totalCount - openCount}
          </p>
        </div>
      </div>

      {/* Valve Control Grid */}
      <div className="p-3 md:p-6" style={{ backgroundColor: 'var(--bg-white)', border: '1px solid var(--gray-border)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)' }}>
        <div className="flex items-center justify-between mb-3 md:mb-6">
          <h3 className="text-sm md:text-2xl font-bold" style={{ color: 'var(--gray-text-dark)' }}>
            Valve Control Matrix
          </h3>
          <span className="text-[10px] md:text-base font-semibold" style={{ color: '#059669' }}>
            {openCount} OPEN / {totalCount} TOTAL
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
          {valves.map(valve => (
            <div 
              key={valve.id} 
              className="p-2 md:p-4"
              style={{ 
                border: `2px solid ${valve.state === 'OPEN' ? '#86EFAC' : 'var(--gray-border)'}`,
                backgroundColor: valve.state === 'OPEN' ? '#D1FAE5' : 'var(--bg-white)',
                borderRadius: 'var(--radius-sm)',
                transition: 'all 0.3s'
              }}
            >
              <div className="flex items-center justify-between mb-1 md:mb-3">
                <p className="text-xs md:text-xl font-bold" style={{ color: 'var(--gray-text-dark)' }}>
                  {valve.id}
                </p>
                <span 
                  className="px-2 py-0.5 md:px-3 md:py-1 text-[9px] md:text-sm font-bold"
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: valve.state === 'OPEN' ? '#059669' : '#6B7280',
                    color: 'var(--bg-white)'
                  }}
                >
                  {valve.state}
                </span>
              </div>
              
              <p className="text-[10px] md:text-base mb-2 md:mb-3" style={{ color: 'var(--gray-text)' }}>
                {valve.location}
              </p>

              {/* Metrics */}
              {valve.state === 'OPEN' && (
                <div className="space-y-1 mb-2 md:mb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] md:text-base" style={{ color: 'var(--gray-text)' }}>Flow:</span>
                    <span className="text-[10px] md:text-xl font-semibold" style={{ color: 'var(--primary-blue)' }}>
                      {valve.flow.toFixed(0)} L/min
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] md:text-base" style={{ color: 'var(--gray-text)' }}>Pressure:</span>
                    <span className="text-[10px] md:text-xl font-semibold" style={{ color: 'var(--primary-blue)' }}>
                      {valve.pressure.toFixed(2)} bar
                    </span>
                  </div>
                  {valve.leakageProbability > 20 && (
                    <div className="flex items-center gap-1 mt-1 p-1 md:p-2" style={{ backgroundColor: '#FEF3C7', borderRadius: 'var(--radius-sm)' }}>
                      <AlertTriangle size={12} className="md:w-4 md:h-4" style={{ color: '#D97706' }} />
                      <span className="text-[8px] md:text-sm" style={{ color: '#78350F' }}>
                        Leakage Risk: {valve.leakageProbability.toFixed(0)}%
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-1 text-[9px] md:text-sm mb-2 md:mb-4" style={{ color: 'var(--gray-text)' }}>
                <div className="flex items-center gap-1">
                  <span>Mode: {valve.automation}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={10} className="md:w-4 md:h-4" />
                  <span>Last action: {valve.lastAction}</span>
                </div>
              </div>

              {/* Control Button */}
              <button
                onClick={() => handleValveToggle(valve)}
                className="w-full py-1.5 md:py-3 text-[10px] md:text-base font-bold transition-opacity"
                style={{
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: valve.state === 'OPEN' ? '#DC2626' : '#059669',
                  color: 'var(--bg-white)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                {valve.state === 'OPEN' ? 'CLOSE VALVE' : 'OPEN VALVE'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
