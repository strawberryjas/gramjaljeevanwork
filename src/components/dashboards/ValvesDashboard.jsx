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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6" style={{ backgroundColor: 'var(--bg-white)', border: '1px solid var(--gray-border)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-text)', marginBottom: '8px' }}>Total Valves</p>
          <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--gray-text-dark)' }}>
            {totalCount}
          </p>
        </div>
        <div className="p-6" style={{ backgroundColor: '#D1FAE5', border: '1px solid #86EFAC', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ fontSize: 'var(--font-size-sm)', color: '#059669', marginBottom: '8px' }}>Open Valves</p>
          <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: '#059669' }}>
            {openCount}
          </p>
        </div>
        <div className="p-6" style={{ backgroundColor: '#F3F4F6', border: '1px solid var(--gray-border)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-text)', marginBottom: '8px' }}>Closed Valves</p>
          <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--gray-text-dark)' }}>
            {totalCount - openCount}
          </p>
        </div>
      </div>

      {/* Valve Control Grid */}
      <div className="p-6" style={{ backgroundColor: 'var(--bg-white)', border: '1px solid var(--gray-border)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--gray-text-dark)' }}>
            Valve Control Matrix
          </h3>
          <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: '#059669' }}>
            {openCount} OPEN / {totalCount} TOTAL
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {valves.map(valve => (
            <div 
              key={valve.id} 
              className="p-4"
              style={{ 
                border: `2px solid ${valve.state === 'OPEN' ? '#86EFAC' : 'var(--gray-border)'}`,
                backgroundColor: valve.state === 'OPEN' ? '#D1FAE5' : 'var(--bg-white)',
                borderRadius: 'var(--radius-sm)',
                transition: 'all 0.3s'
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <p style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--gray-text-dark)' }}>
                  {valve.id}
                </p>
                <span 
                  className="px-3 py-1"
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'var(--font-weight-bold)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: valve.state === 'OPEN' ? '#059669' : '#6B7280',
                    color: 'var(--bg-white)'
                  }}
                >
                  {valve.state}
                </span>
              </div>
              
              <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--gray-text)', marginBottom: '12px' }}>
                {valve.location}
              </p>

              {/* Metrics */}
              {valve.state === 'OPEN' && (
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between items-center">
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-text)' }}>Flow:</span>
                    <span style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--primary-blue)' }}>
                      {valve.flow.toFixed(0)} L/min
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-text)' }}>Pressure:</span>
                    <span style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--primary-blue)' }}>
                      {valve.pressure.toFixed(2)} bar
                    </span>
                  </div>
                  {valve.leakageProbability > 20 && (
                    <div className="flex items-center gap-2 mt-2 p-2" style={{ backgroundColor: '#FEF3C7', borderRadius: 'var(--radius-sm)' }}>
                      <AlertTriangle size={14} style={{ color: '#D97706' }} />
                      <span style={{ fontSize: 'var(--font-size-xs)', color: '#78350F' }}>
                        Leakage Risk: {valve.leakageProbability.toFixed(0)}%
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2 text-xs mb-4" style={{ color: 'var(--gray-text)' }}>
                <div className="flex items-center gap-2">
                  <span>Mode: {valve.automation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={12} />
                  <span>Last action: {valve.lastAction}</span>
                </div>
              </div>

              {/* Control Button */}
              <button
                onClick={() => handleValveToggle(valve)}
                className="w-full py-3 font-bold transition-opacity"
                style={{
                  fontSize: 'var(--font-size-base)',
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
