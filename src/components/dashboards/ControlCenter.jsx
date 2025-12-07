import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Settings, 
  Power, 
  AlertTriangle, 
  CheckCircle, 
  Droplet,
  Gauge,
  Zap,
  Wind,
  Activity,
  Thermometer,
  PlayCircle,
  StopCircle,
  Clock,
  RotateCcw
} from 'lucide-react';

/**
 * ControlCenter Component
 * - Allows technicians to simulate different states for testing
 * - Control pumps, pipelines, tanks, valves, water quality
 * - Set anomalies, leaks, pressure issues, etc.
 * - Testing dashboard to see how the system responds
 */
export const ControlCenter = ({ 
  systemState, 
  onTogglePump, 
  onToggleValve,
  forceAnomaly,
  onSimulateState 
}) => {
  const { t } = useTranslation();
  
  // Load persisted state from localStorage
  const loadPersistedState = () => {
    try {
      const saved = localStorage.getItem('gjj_control_center_state');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load control center state:', e);
    }
    return { component: 'pump', mode: 'normal' };
  };
  
  const persistedState = loadPersistedState();
  const [selectedComponent, setSelectedComponent] = useState(persistedState.component || 'pump');
  const [simulationMode, setSimulationMode] = useState(persistedState.mode || 'normal');
  const [customValues, setCustomValues] = useState({
    pumpSpeed: 100,
    waterLevel: 75,
    pressure: 3.5,
    flowRate: 1500,
    ph: 7.2,
    turbidity: 2.5,
    chlorine: 0.5,
    temperature: 25
  });

  const components = [
    { 
      id: 'pump', 
      label: 'Pump Station', 
      icon: Power,
      color: 'blue',
      states: ['normal', 'overheating', 'low-efficiency', 'vibration', 'offline']
    },
    { 
      id: 'pipeline', 
      label: 'Pipeline', 
      icon: Activity,
      color: 'green',
      states: ['normal', 'leak', 'burst', 'blockage', 'low-pressure', 'high-pressure']
    },
    { 
      id: 'tank', 
      label: 'Water Tank', 
      icon: Droplet,
      color: 'cyan',
      states: ['normal', 'low-level', 'overflow', 'contamination', 'sensor-error']
    },
    { 
      id: 'valve', 
      label: 'Valves', 
      icon: Settings,
      color: 'purple',
      states: ['normal', 'stuck-open', 'stuck-closed', 'partial-failure', 'sensor-error']
    },
    { 
      id: 'quality', 
      label: 'Water Quality', 
      icon: Thermometer,
      color: 'orange',
      states: ['normal', 'high-ph', 'low-ph', 'high-turbidity', 'low-chlorine', 'contaminated']
    },
    { 
      id: 'energy', 
      label: 'Energy System', 
      icon: Zap,
      color: 'yellow',
      states: ['normal', 'high-consumption', 'power-surge', 'fluctuation', 'offline']
    }
  ];

  const stateDescriptions = {
    // Pump states
    'normal': 'All systems operating normally',
    'overheating': 'Pump temperature exceeds safe limits',
    'low-efficiency': 'Pump operating below optimal efficiency',
    'vibration': 'Excessive vibration detected',
    'offline': 'Component is offline/not responding',
    
    // Pipeline states
    'leak': 'Leak detected in pipeline',
    'burst': 'Pipeline burst - critical failure',
    'blockage': 'Flow blockage detected',
    'low-pressure': 'Pressure below normal range',
    'high-pressure': 'Pressure above safe limits',
    
    // Tank states
    'low-level': 'Water level critically low',
    'overflow': 'Tank overflow condition',
    'contamination': 'Contamination detected in tank',
    'sensor-error': 'Sensor malfunction',
    
    // Valve states
    'stuck-open': 'Valve stuck in open position',
    'stuck-closed': 'Valve stuck in closed position',
    'partial-failure': 'Valve partially responsive',
    
    // Quality states
    'high-ph': 'pH level above acceptable range',
    'low-ph': 'pH level below acceptable range',
    'high-turbidity': 'Water clarity issues detected',
    'low-chlorine': 'Chlorine levels below safe minimum',
    'contaminated': 'Water contamination detected',
    
    // Energy states
    'high-consumption': 'Energy usage above normal',
    'power-surge': 'Power surge detected',
    'fluctuation': 'Voltage fluctuation detected'
  };

  const selectedComponentData = components.find(c => c.id === selectedComponent);

  const handleApplySimulation = () => {
    console.log('Apply Simulation clicked:', {
      component: selectedComponent,
      mode: simulationMode,
      customValues,
      hasCallback: !!onSimulateState
    });
    
    if (onSimulateState) {
      try {
        const result = onSimulateState(selectedComponent, simulationMode, customValues);
        console.log('Simulation applied, result:', result);
      } catch (error) {
        console.error('Error applying simulation:', error);
        const errorNotification = document.createElement('div');
        errorNotification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999]';
        errorNotification.textContent = `✗ Error: ${error.message}`;
        document.body.appendChild(errorNotification);
        setTimeout(() => errorNotification.remove(), 3000);
        return;
      }
    } else {
      console.error('onSimulateState callback not provided!');
      const errorNotification = document.createElement('div');
      errorNotification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999]';
      errorNotification.textContent = '✗ Error: Simulation callback not available';
      document.body.appendChild(errorNotification);
      setTimeout(() => errorNotification.remove(), 3000);
      return;
    }
    
    // Persist the state to localStorage
    try {
      localStorage.setItem('gjj_control_center_state', JSON.stringify({
        component: selectedComponent,
        mode: simulationMode,
        values: customValues,
        timestamp: new Date().toISOString()
      }));
    } catch (e) {
      console.error('Failed to persist control center state:', e);
    }
    
    // Show visual feedback
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] animate-fade-in';
    notification.textContent = `✓ ${selectedComponentData.label} set to: ${simulationMode}`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const handleResetAll = () => {
    components.forEach(comp => {
      if (onSimulateState) {
        onSimulateState(comp.id, 'normal', customValues);
      }
    });
    
    setSimulationMode('normal');
    setCustomValues({
      pumpSpeed: 100,
      waterLevel: 75,
      pressure: 3.5,
      flowRate: 1500,
      ph: 7.2,
      turbidity: 2.5,
      chlorine: 0.5,
      temperature: 25
    });

    // Clear persisted state
    try {
      localStorage.removeItem('gjj_control_center_state');
    } catch (e) {
      console.error('Failed to clear control center state:', e);
    }

    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] animate-fade-in';
    notification.textContent = '↻ All systems reset to normal';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const getStateColor = (state) => {
    if (state === 'normal') return 'bg-green-100 text-green-800 border-green-300';
    if (state.includes('critical') || state.includes('burst') || state === 'contaminated') {
      return 'bg-red-100 text-red-800 border-red-300';
    }
    return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  };

  const getComponentIcon = (component) => {
    const IconComponent = component.icon;
    return <IconComponent className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Settings className="w-10 h-10" />
                Control Center
              </h1>
              <p className="text-indigo-100 text-lg">
                Simulate different system states for testing and verification
              </p>
            </div>
            <button
              onClick={handleResetAll}
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-all shadow-lg flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reset All
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Component Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                Select Component
              </h2>
              <div className="space-y-2">
                {components.map(component => {
                  const IconComponent = component.icon;
                  const isSelected = selectedComponent === component.id;
                  return (
                    <button
                      key={component.id}
                      onClick={() => {
                        setSelectedComponent(component.id);
                        setSimulationMode('normal');
                      }}
                      className={`
                        w-full flex items-center gap-3 p-4 rounded-lg transition-all border-2
                        ${isSelected 
                          ? `bg-${component.color}-50 border-${component.color}-500 shadow-md` 
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className={`
                        p-2 rounded-lg
                        ${isSelected ? `bg-${component.color}-100` : 'bg-white'}
                      `}>
                        <IconComponent className={`
                          w-6 h-6
                          ${isSelected ? `text-${component.color}-600` : 'text-gray-600'}
                        `} />
                      </div>
                      <span className={`
                        font-semibold text-left
                        ${isSelected ? 'text-gray-900' : 'text-gray-700'}
                      `}>
                        {component.label}
                      </span>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* State Selection & Control */}
          <div className="lg:col-span-2 space-y-6">
            {/* State Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                {getComponentIcon(selectedComponentData)}
                {selectedComponentData.label} - Simulation States
              </h2>
              
              <div className="grid md:grid-cols-2 gap-3 mb-6">
                {selectedComponentData.states.map(state => {
                  const isSelected = simulationMode === state;
                  return (
                    <button
                      key={state}
                      onClick={() => setSimulationMode(state)}
                      className={`
                        p-4 rounded-lg border-2 transition-all text-left
                        ${isSelected 
                          ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`
                          font-bold capitalize
                          ${isSelected ? 'text-indigo-900' : 'text-gray-800'}
                        `}>
                          {state.replace(/-/g, ' ')}
                        </span>
                        {isSelected && <CheckCircle className="w-5 h-5 text-indigo-600" />}
                      </div>
                      <p className={`
                        text-sm
                        ${isSelected ? 'text-indigo-700' : 'text-gray-600'}
                      `}>
                        {stateDescriptions[state]}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Current Selection Info */}
              <div className={`p-4 rounded-lg border-2 ${getStateColor(simulationMode)}`}>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6" />
                  <div>
                    <p className="font-bold">Current Selection:</p>
                    <p className="text-sm">
                      {selectedComponentData.label} → {simulationMode.replace(/-/g, ' ').toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Values */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Gauge className="w-5 h-5 text-indigo-600" />
                Custom Values (Optional)
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pump Speed (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={customValues.pumpSpeed}
                    onChange={(e) => setCustomValues({...customValues, pumpSpeed: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Water Level (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={customValues.waterLevel}
                    onChange={(e) => setCustomValues({...customValues, waterLevel: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pressure (bar)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={customValues.pressure}
                    onChange={(e) => setCustomValues({...customValues, pressure: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Flow Rate (L/min)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5000"
                    value={customValues.flowRate}
                    onChange={(e) => setCustomValues({...customValues, flowRate: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    pH Level
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="14"
                    value={customValues.ph}
                    onChange={(e) => setCustomValues({...customValues, ph: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Turbidity (NTU)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={customValues.turbidity}
                    onChange={(e) => setCustomValues({...customValues, turbidity: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Chlorine (mg/L)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={customValues.chlorine}
                    onChange={(e) => setCustomValues({...customValues, chlorine: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={customValues.temperature}
                    onChange={(e) => setCustomValues({...customValues, temperature: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <button
                onClick={handleApplySimulation}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <PlayCircle className="w-6 h-6" />
                Apply Simulation
              </button>
              
              <p className="text-center text-sm text-gray-600 mt-4">
                Navigate to the respective component page to see the simulated state in action
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Test Scenarios</h2>
          <div className="grid md:grid-cols-4 gap-3">
            <button
              onClick={() => {
                setSelectedComponent('pipeline');
                setSimulationMode('leak');
                handleApplySimulation();
              }}
              className="p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 transition-all"
            >
              <AlertTriangle className="w-6 h-6 text-red-600 mb-2" />
              <p className="font-semibold text-red-900">Pipeline Leak</p>
            </button>
            
            <button
              onClick={() => {
                setSelectedComponent('pump');
                setSimulationMode('overheating');
                handleApplySimulation();
              }}
              className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg hover:bg-orange-100 transition-all"
            >
              <Thermometer className="w-6 h-6 text-orange-600 mb-2" />
              <p className="font-semibold text-orange-900">Pump Overheating</p>
            </button>
            
            <button
              onClick={() => {
                setSelectedComponent('tank');
                setSimulationMode('low-level');
                handleApplySimulation();
              }}
              className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg hover:bg-yellow-100 transition-all"
            >
              <Droplet className="w-6 h-6 text-yellow-600 mb-2" />
              <p className="font-semibold text-yellow-900">Low Water Level</p>
            </button>
            
            <button
              onClick={() => {
                setSelectedComponent('quality');
                setSimulationMode('contaminated');
                handleApplySimulation();
              }}
              className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100 transition-all"
            >
              <AlertTriangle className="w-6 h-6 text-purple-600 mb-2" />
              <p className="font-semibold text-purple-900">Water Contamination</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
