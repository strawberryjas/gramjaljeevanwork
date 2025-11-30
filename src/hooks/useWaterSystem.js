import { useState, useEffect, useRef } from 'react';

/**
 * Hook to simulate water system dynamics
 * Generates live data for sensors
 */
export const useWaterSystem = (initialState = { valveOpen: true }) => {
  const [sensors, setSensors] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Use refs for value persistence across renders without triggering effects
  const systemState = useRef({
    ...initialState,
    inletFlow: 50,
    mainTankLevel: 85,
    leakFactor: 0 // 0 to 1, where 1 is massive leak
  });

  useEffect(() => {
    // Initialize mock sensors for a larger network
    const initialSensors = [
      // Main Trunk Line
      { id: 'S-IN-01', type: 'flow', value: 50, location: 'Main Intake' },
      { id: 'S-OUT-01', type: 'flow', value: 50, location: 'Junction Hub' },
      
      // Northern Branch (District A)
      { id: 'S-IN-02', type: 'flow', value: 24, location: 'North Dist. Inlet' },
      { id: 'S-OUT-02', type: 'flow', value: 24, location: 'Village North' },
      
      // Southern Branch (District B)
      { id: 'S-IN-03', type: 'flow', value: 24, location: 'South Dist. Inlet' },
      { id: 'S-OUT-03', type: 'flow', value: 24, location: 'Village South' },

      // Quality Sensors
      { id: 'S-PH-01', type: 'quality', value: 7.2, location: 'Main Tank' },
      { id: 'S-PH-02', type: 'quality', value: 7.1, location: 'Village North Tap' },
    ];
    setSensors(initialSensors);

    // Heartbeat simulation
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      
      const { valveOpen } = systemState.current;
      
      // 1. Calculate Main Inlet Flow
      systemState.current.inletFlow = valveOpen 
        ? 50 + (Math.random() * 2 - 1) // Fluctuate around 50
        : 0;

      // 2. Simulate Leak Event Logic
      // Randomly induce leak event every ~10 seconds
      if (Math.random() > 0.95) {
        systemState.current.leakFactor = Math.random() * 0.4; // Up to 40% loss
      } else if (Math.random() > 0.8) {
        systemState.current.leakFactor = Math.max(0, systemState.current.leakFactor - 0.05); // Self-heal / Fix
      }

      const mainFlow = systemState.current.inletFlow;
      const leakLoss = mainFlow * systemState.current.leakFactor;
      
      // Distribute flow to branches (approx 50/50 split of the remaining flow)
      const effectiveFlow = Math.max(0, mainFlow - leakLoss);
      const branchFlow = effectiveFlow / 2;

      setSensors(prev => prev.map(sensor => {
        let newValue = sensor.value;
        const noise = (Math.random() * 0.4 - 0.2); // Small jitter

        if (sensor.type === 'flow') {
          switch (sensor.id) {
            case 'S-IN-01': // Main Inlet
              newValue = mainFlow;
              break;
            case 'S-OUT-01': // Main Outlet (affected by leak)
              newValue = effectiveFlow + noise;
              break;
            case 'S-IN-02': // Branch A Inlet
            case 'S-IN-03': // Branch B Inlet
              newValue = branchFlow + noise;
              break;
            case 'S-OUT-02': // Branch A Outlet (Loss over distance)
            case 'S-OUT-03': // Branch B Outlet
              // Simulate minor normal transmission loss (1-2%)
              newValue = (branchFlow * 0.98) + noise; 
              break;
            default:
              newValue = sensor.value;
          }
        }
        
        // Ensure non-negative
        return { ...sensor, value: Math.max(0, newValue) };
      }));

    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleValve = () => {
    systemState.current.valveOpen = !systemState.current.valveOpen;
  };

  return {
    sensors,
    lastUpdate,
    toggleValve,
    isValveOpen: systemState.current.valveOpen
  };
};
