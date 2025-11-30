import React from 'react';
import { useSimulationData } from '../../hooks/useSimulationData';
import { Activity, Droplet, Power, AlertTriangle, CheckCircle, Gauge, Settings, Radio, ArrowDown, ArrowRight } from 'lucide-react';

export const SystemContainer = ({ onNavigate }) => {
  const {
    state,
    isLive,
    togglePump,
    toggleValve,
    toggleTankOutlet,
  } = useSimulationData();

  const tank = state?.overheadTank || {};
  const pump = state?.pumpHouse || {};
  const pipelines = state?.pipelines || [];
  const isPumpOn = pump.pumpStatus === 'ON';

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      {/* Components rearranged: Diagram is now top, others moved below */}

      {/* Realistic Indian Rural Water Infrastructure Network */}
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-xl p-8 border-2 border-amber-300 shadow-2xl" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)' }}>
        <div className="relative" style={{ minHeight: '700px' }}>
          {/* Realistic Mechanical Pump Motor - Left Side */}
          <div className="absolute top-8 left-8 flex flex-col items-center gap-3 z-20">
            {/* Pump Motor Assembly - Realistic Industrial Design */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePump();
              }}
              className="relative transition-all hover:scale-105"
              style={{ width: '140px', height: '160px' }}
            >
              {/* Mounting Base */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-gradient-to-b from-stone-600 to-stone-800 rounded-sm border-2 border-stone-900"
                style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.4)' }}>
                {/* Bolt Holes */}
                <div className="absolute top-1/2 left-2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-stone-900 border border-stone-700"></div>
                <div className="absolute top-1/2 right-2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-stone-900 border border-stone-700"></div>
              </div>

              {/* Motor Housing (Cylindrical Body) */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-28 rounded-lg overflow-hidden"
                style={{
                  background: isPumpOn
                    ? 'linear-gradient(90deg, #334155 0%, #475569 20%, #64748b 50%, #475569 80%, #334155 100%)'
                    : 'linear-gradient(90deg, #1e293b 0%, #334155 20%, #475569 50%, #334155 80%, #1e293b 100%)',
                  boxShadow: isPumpOn
                    ? '0 8px 25px rgba(34, 197, 94, 0.3), inset -4px 0 8px rgba(0,0,0,0.3), inset 4px 0 8px rgba(255,255,255,0.1)'
                    : '0 8px 25px rgba(0,0,0,0.5), inset -4px 0 8px rgba(0,0,0,0.4), inset 4px 0 8px rgba(255,255,255,0.05)',
                  border: '3px solid #1e293b'
                }}>

                {/* Cooling Fins (Horizontal Lines) */}
                <div className="absolute inset-0">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="absolute left-0 right-0 h-0.5 bg-slate-900/40"
                      style={{ top: `${12 + i * 10}%` }}></div>
                  ))}
                </div>

                {/* Motor Name Plate */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-yellow-600 px-2 py-0.5 rounded-sm border border-yellow-800">
                  <p className="text-[8px] font-bold text-slate-900">5HP MOTOR</p>
                </div>

                {/* Ventilation Grills */}
                <div className="absolute bottom-2 left-2 right-2 flex gap-1">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex-1 h-3 bg-slate-900/60 rounded-sm border border-slate-700"></div>
                  ))}
                </div>
              </div>

              {/* Pump Head (Front Casing) */}
              <div className="absolute bottom-4 right-0 w-16 h-20 rounded-r-xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #0c4a6e 0%, #075985 50%, #0c4a6e 100%)',
                  boxShadow: 'inset -3px 0 6px rgba(0,0,0,0.4), inset 3px 0 6px rgba(255,255,255,0.1), 0 6px 20px rgba(0,0,0,0.3)',
                  border: '2px solid #0a3a5a'
                }}>

                {/* Impeller Housing (Circular) */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-4 border-sky-900/50"
                  style={{
                    background: 'radial-gradient(circle, #0369a1 0%, #075985 50%, #0c4a6e 100%)',
                    boxShadow: 'inset 0 0 15px rgba(0,0,0,0.6)'
                  }}>

                  {/* Rotating Impeller */}
                  <div className={`absolute inset-0 ${isPumpOn ? 'animate-spin' : ''}`}
                    style={{ animationDuration: '1.5s' }}>
                    {/* Impeller Blades */}
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="absolute top-1/2 left-1/2 w-1 h-5 bg-cyan-400/70 rounded"
                        style={{
                          transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-8px)`,
                          transformOrigin: 'center'
                        }}></div>
                    ))}
                    {/* Center Hub */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-300 border-2 border-slate-600"></div>
                  </div>
                </div>

                {/* Outlet Flange */}
                <div className="absolute top-0 right-0 w-6 h-8 bg-gradient-to-r from-sky-800 to-sky-900 border-2 border-sky-950 rounded-r"
                  style={{ boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.5)' }}>
                  {/* Bolt Holes on Flange */}
                  <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-700"></div>
                  <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-700"></div>
                </div>
              </div>

              {/* Status Indicator Light */}
              <div className={`absolute top-2 left-2 w-4 h-4 rounded-full border-2 border-white ${isPumpOn
                ? 'bg-green-400 shadow-lg shadow-green-400/80 animate-pulse'
                : 'bg-red-500 shadow-lg shadow-red-500/50'
                }`}
                style={{
                  boxShadow: isPumpOn
                    ? '0 0 15px rgba(34, 197, 94, 0.8), inset 0 1px 2px rgba(255,255,255,0.5)'
                    : '0 0 10px rgba(239, 68, 68, 0.6), inset 0 1px 2px rgba(0,0,0,0.3)'
                }}>
              </div>

              {/* Vibration Effect when Running */}
              {isPumpOn && (
                <div className="absolute inset-0 animate-pulse opacity-30 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, transparent 70%)'
                  }}></div>
              )}
            </button>

            {/* Pump Label - Clickable for Details */}
            <div
              onClick={() => onNavigate && onNavigate('pump-details')}
              className="text-center cursor-pointer hover:scale-105 transition-transform group"
            >
              <p className="text-sm font-bold text-slate-800 group-hover:text-green-600">Borewell Pump</p>
              <p className="text-xs text-slate-600">{isPumpOn ? 'Running' : 'Stopped'}</p>
              <p className="text-[10px] text-blue-600 font-semibold">Click for details</p>
            </div>

            {/* Pump Control Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePump();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg ${isPumpOn
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-green-600 text-white hover:bg-green-700'
                }`}
            >
              {isPumpOn ? '⏹ STOP' : '▶ START'}
            </button>
          </div>


          {/* Realistic 3D Pipe from Pump to Tank */}
          <div className="absolute top-24 left-36 w-72 h-12 flex items-center z-10">
            {/* Main Pipe Body - Cylindrical 3D Effect */}
            <div className="relative w-full h-8 rounded-lg overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, #94a3b8 0%, #64748b 15%, #475569 50%, #334155 85%, #1e293b 100%)',
                boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.4), inset 0 -4px 8px rgba(255,255,255,0.1), 0 6px 15px rgba(0,0,0,0.3)',
                border: '2px solid #1e293b'
              }}>

              {/* Pipe Joints/Segments */}
              <div className="absolute left-1/4 top-0 bottom-0 w-2 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 border-l border-r border-slate-800"
                style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}></div>
              <div className="absolute left-2/4 top-0 bottom-0 w-2 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 border-l border-r border-slate-800"
                style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}></div>
              <div className="absolute left-3/4 top-0 bottom-0 w-2 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 border-l border-r border-slate-800"
                style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}></div>

              {/* Water Flow Animation Inside Pipe */}
              {isPumpOn && tank.inletValveStatus === 'OPEN' && (
                <div className="absolute inset-1 overflow-hidden rounded">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent animate-flow-horizontal"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-flow-horizontal-delayed"></div>
                </div>
              )}

              {/* Pipe Flanges at Both Ends */}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-10 bg-gradient-to-r from-stone-700 to-stone-600 rounded-l border-2 border-stone-900"
                style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.4), inset -2px 0 4px rgba(0,0,0,0.3)' }}>
                {/* Flange Bolts */}
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-700"></div>
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-700"></div>
              </div>

              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-10 bg-gradient-to-r from-stone-600 to-stone-700 rounded-r border-2 border-stone-900"
                style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.4), inset 2px 0 4px rgba(0,0,0,0.3)' }}>
                {/* Flange Bolts */}
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-700"></div>
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-700"></div>
              </div>
            </div>
          </div>


          {/* Water Tank - Center (Indian Rural Concrete Tank Style) */}
          <div
            onClick={() => onNavigate && onNavigate('tank-details')}
            className="absolute top-8 left-1/2 transform -translate-x-1/2 cursor-pointer hover:scale-105 transition-transform group z-20"
          >
            <div className="relative" style={{ paddingBottom: '40px' }}>
              {/* Enhanced Support Structure - Taller, Stronger Pillars */}
              <div className="absolute bottom-0 left-6 w-5 h-40 bg-gradient-to-r from-stone-700 via-stone-600 to-stone-700 rounded-t border-2 border-stone-900"
                style={{ boxShadow: '0 6px 12px rgba(0,0,0,0.5), inset -2px 0 6px rgba(0,0,0,0.4), inset 2px 0 6px rgba(255,255,255,0.15)' }}>
                {/* Pillar Reinforcement Rings - More Prominent */}
                <div className="absolute top-4 left-0 right-0 h-1.5 bg-stone-800 border-t border-b border-stone-900"
                  style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }}></div>
                <div className="absolute top-1/3 left-0 right-0 h-1.5 bg-stone-800 border-t border-b border-stone-900"
                  style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }}></div>
                <div className="absolute top-2/3 left-0 right-0 h-1.5 bg-stone-800 border-t border-b border-stone-900"
                  style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }}></div>
                <div className="absolute bottom-4 left-0 right-0 h-1.5 bg-stone-800 border-t border-b border-stone-900"
                  style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }}></div>
                {/* Bolt Details on Rings */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-700"></div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-700"></div>
              </div>
              <div className="absolute bottom-0 right-6 w-5 h-40 bg-gradient-to-r from-stone-700 via-stone-600 to-stone-700 rounded-t border-2 border-stone-900"
                style={{ boxShadow: '0 6px 12px rgba(0,0,0,0.5), inset -2px 0 6px rgba(0,0,0,0.4), inset 2px 0 6px rgba(255,255,255,0.15)' }}>
                {/* Pillar Reinforcement Rings - More Prominent */}
                <div className="absolute top-4 left-0 right-0 h-1.5 bg-stone-800 border-t border-b border-stone-900"
                  style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }}></div>
                <div className="absolute top-1/3 left-0 right-0 h-1.5 bg-stone-800 border-t border-b border-stone-900"
                  style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }}></div>
                <div className="absolute top-2/3 left-0 right-0 h-1.5 bg-stone-800 border-t border-b border-stone-900"
                  style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }}></div>
                <div className="absolute bottom-4 left-0 right-0 h-1.5 bg-stone-800 border-t border-b border-stone-900"
                  style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }}></div>
                {/* Bolt Details on Rings */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-700"></div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-700"></div>
              </div>

              {/* Cross Bracing Between Pillars for Structural Realism */}
              <div className="absolute bottom-20 left-11 right-11 h-1.5 bg-gradient-to-r from-stone-700 via-stone-600 to-stone-700 border-t border-b border-stone-900"
                style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.4), inset 0 1px 2px rgba(0,0,0,0.3)' }}></div>
              <div className="absolute bottom-10 left-11 right-11 h-1.5 bg-gradient-to-r from-stone-700 via-stone-600 to-stone-700 border-t border-b border-stone-900"
                style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.4), inset 0 1px 2px rgba(0,0,0,0.3)' }}></div>


              {/* Realistic Overhead Water Tank - Cylindrical Design */}
              <div className="relative w-48 h-56 rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(90deg, #57534e 0%, #78716c 10%, #a8a29e 30%, #d6d3d1 50%, #a8a29e 70%, #78716c 90%, #57534e 100%)',
                  boxShadow: 'inset -8px 0 16px rgba(0,0,0,0.4), inset 8px 0 16px rgba(255,255,255,0.2), 0 12px 35px rgba(0,0,0,0.4)',
                  border: '3px solid #44403c'
                }}>

                {/* Metallic Reinforcement Bands (Horizontal) */}
                <div className="absolute top-8 left-0 right-0 h-2 bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 border-t-2 border-b-2 border-stone-900"
                  style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)' }}></div>
                <div className="absolute top-24 left-0 right-0 h-2 bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 border-t-2 border-b-2 border-stone-900"
                  style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)' }}></div>
                <div className="absolute bottom-8 left-0 right-0 h-2 bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 border-t-2 border-b-2 border-stone-900"
                  style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)' }}></div>

                {/* Vertical Seam Lines (Cylindrical Effect) */}
                <div className="absolute top-0 bottom-0 left-1/4 w-1 bg-stone-700/40"></div>
                <div className="absolute top-0 bottom-0 right-1/4 w-1 bg-stone-700/40"></div>

                {/* Tank Top Dome/Cap */}
                <div className="absolute -top-3 left-0 right-0 h-8 rounded-t-2xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(90deg, #44403c 0%, #57534e 20%, #78716c 50%, #57534e 80%, #44403c 100%)',
                    boxShadow: 'inset -4px 0 8px rgba(0,0,0,0.4), inset 4px 0 8px rgba(255,255,255,0.1), 0 4px 10px rgba(0,0,0,0.3)',
                    border: '2px solid #292524'
                  }}>
                  {/* Inspection Hatch */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-4 bg-stone-800 rounded border-2 border-stone-900"
                    style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.6)' }}>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-stone-600"></div>
                  </div>
                </div>

                {/* Water Level Indicator */}
                <div
                  className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ${tank.isFilling ? 'bg-gradient-to-t from-blue-800 via-blue-600 to-cyan-500' : 'bg-gradient-to-t from-blue-700 via-blue-500 to-cyan-400'
                    }`}
                  style={{
                    height: `${Math.min(100, Math.max(0, tank.tankLevel || 0))}%`,
                    boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.3)'
                  }}
                >
                  {/* Water Surface Ripples */}
                  {tank.isFilling && (
                    <div className="absolute inset-0">
                      <div className="absolute top-0 left-0 right-0 h-4 bg-cyan-300/40 animate-wave"></div>
                      <div className="absolute top-2 left-0 right-0 h-3 bg-cyan-200/30 animate-wave-delayed"></div>
                    </div>
                  )}

                  {/* Water Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                </div>

                {/* Tank Level Display - Digital Style */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-black pointer-events-none z-30"
                  style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)' }}>
                  <span className="text-4xl drop-shadow-2xl">{(tank.tankLevel || 0).toFixed(0)}%</span>
                  <span className="text-sm font-semibold mt-1 drop-shadow-lg">{(tank.currentVolume || 0).toLocaleString()} L</span>
                </div>

                {/* Overflow Pipe (Side Outlet) */}
                <div className="absolute top-12 -right-2 w-6 h-3 bg-gradient-to-r from-stone-600 to-stone-700 rounded-r border-2 border-stone-900"
                  style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.4), inset -2px 0 4px rgba(0,0,0,0.3)' }}>
                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-1 h-1 rounded-full bg-stone-900"></div>
                </div>

                {/* Access Ladder (Right Side) */}
                <div className="absolute -right-3 top-16 w-2 h-36 bg-gradient-to-r from-yellow-700 to-yellow-600 rounded border-2 border-yellow-900"
                  style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.4), inset -1px 0 2px rgba(0,0,0,0.3)' }}>
                  {/* Ladder Rungs */}
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="absolute left-0 w-1.5 h-1 bg-yellow-800 rounded border border-yellow-900"
                      style={{ top: `${10 + i * 15}%`, boxShadow: '0 1px 2px rgba(0,0,0,0.3)' }}></div>
                  ))}
                </div>

                {/* Level Gauge (External) */}
                <div className="absolute -left-3 top-16 bottom-8 w-3 bg-gradient-to-b from-slate-700 to-slate-800 rounded border-2 border-slate-900"
                  style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.4), inset 2px 0 4px rgba(0,0,0,0.3)' }}>
                  {/* Gauge Markings */}
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="absolute left-0 right-0 h-0.5 bg-white/30"
                      style={{ top: `${i * 25}%` }}></div>
                  ))}
                </div>
              </div>
              <p className="text-center mt-3 text-sm font-bold text-slate-800 group-hover:text-blue-600">Overhead Tank</p>
              <p className="text-center text-xs text-slate-600">Water Storage</p>
            </div>
          </div>

          {/* Tank Outlet Valve - Controls flow to all pipelines */}
          <div className="absolute top-56 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20">
            {/* Realistic Outlet Pipe from Tank - Vertical 3D Pipe */}
            <div className="relative w-14 h-12 flex items-center justify-center">
              <div className="relative w-10 h-full rounded-lg overflow-hidden"
                style={{
                  background: 'linear-gradient(90deg, #57534e 0%, #78716c 20%, #a8a29e 50%, #78716c 80%, #57534e 100%)',
                  boxShadow: 'inset -4px 0 8px rgba(0,0,0,0.4), inset 4px 0 8px rgba(255,255,255,0.1), 0 4px 10px rgba(0,0,0,0.3)',
                  border: '2px solid #44403c'
                }}>
                {/* Water Flow Inside */}
                {tank.outletValveStatus === 'OPEN' && (
                  <div className="absolute inset-1 overflow-hidden rounded">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent animate-flow-vertical"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Tank Outlet Valve - Direct Control */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                toggleTankOutlet();
              }}
              className={`relative w-14 h-14 rounded-full border-4 shadow-xl cursor-pointer transition-all hover:scale-110 z-20 ${tank.outletValveStatus === 'OPEN'
                ? 'bg-green-500 border-green-700 animate-pulse-subtle'
                : 'bg-red-600 border-red-800'
                }`}
              title={`Tank Outlet Valve: ${tank.outletValveStatus || 'CLOSED'} - Click to toggle`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Settings size={18} className="text-white" />
              </div>
              {/* Valve Handle */}
              <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded transition-transform duration-300 ${tank.outletValveStatus === 'OPEN' ? 'rotate-45' : 'rotate-0'
                }`}></div>
            </div>

            {/* Main Distribution Header - Realistic 3D Horizontal Pipe */}
            <div className="relative w-full max-w-5xl h-10 mt-2 flex items-center">
              <div className="relative w-full h-8 rounded-lg overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, #94a3b8 0%, #64748b 15%, #475569 50%, #334155 85%, #1e293b 100%)',
                  boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.4), inset 0 -4px 8px rgba(255,255,255,0.1), 0 6px 15px rgba(0,0,0,0.3)',
                  border: '2px solid #1e293b'
                }}>
                {/* Pipe Segments/Joints */}
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="absolute top-0 bottom-0 w-2 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 border-l border-r border-slate-800"
                    style={{
                      left: `${i * 20}%`,
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                    }}></div>
                ))}

                {/* Water Flow Animation */}
                {tank.outletValveStatus === 'OPEN' && (
                  <div className="absolute inset-1 overflow-hidden rounded">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent animate-flow-horizontal"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-flow-horizontal-delayed"></div>
                  </div>
                )}

                {/* Flow Direction Indicator */}
                {tank.outletValveStatus === 'OPEN' && (
                  <ArrowRight size={16} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-300 animate-pulse" />
                )}
              </div>
            </div>
          </div>

          {/* Pipelines Connected to Distribution Pipe (Below Tank) */}
          <div className="absolute top-[22rem] left-0 right-0 flex justify-center gap-4 px-8 z-10">
            {pipelines.map((pipeline, idx) => {
              const isOpen = pipeline.valveStatus === 'OPEN';
              const hasLeakage = pipeline.leakageProbability > 30;
              const inletFlow = pipeline.inlet?.flowSensor?.value || 0;
              const inletPressure = pipeline.inlet?.pressureSensor?.value || 0;
              const canFlow = isOpen && tank.outletValveStatus === 'OPEN';

              return (
                <div key={pipeline.pipelineId} className="flex flex-col items-center gap-2 relative" style={{ width: '120px' }}>
                  {/* Realistic Connection Pipe from Distribution Header - 3D Vertical Pipe */}
                  <div className="relative w-12 h-14 flex items-center justify-center">
                    <div className="relative w-10 h-full rounded-lg overflow-hidden"
                      style={{
                        background: 'linear-gradient(90deg, #57534e 0%, #78716c 20%, #a8a29e 50%, #78716c 80%, #57534e 100%)',
                        boxShadow: 'inset -4px 0 8px rgba(0,0,0,0.4), inset 4px 0 8px rgba(255,255,255,0.1), 0 4px 10px rgba(0,0,0,0.3)',
                        border: '2px solid #44403c'
                      }}>
                      {/* Water Flow Inside */}
                      {canFlow && (
                        <div className="absolute inset-1 overflow-hidden rounded">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent animate-flow-vertical"></div>
                        </div>
                      )}
                      {/* Flow Sensor Device */}
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-600 rounded-full border-2 border-blue-900 shadow-lg flex items-center justify-center z-30"
                        style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.4), inset 0 1px 3px rgba(255,255,255,0.2)' }}>
                        <Radio size={10} className="text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Pipeline Valve - Direct Control (No Redirect) */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleValve(pipeline.pipelineId);
                    }}
                    className={`relative w-12 h-12 rounded-full border-4 shadow-xl cursor-pointer transition-all hover:scale-110 z-30 ${isOpen
                      ? 'bg-green-500 border-green-700 animate-pulse-subtle'
                      : 'bg-red-600 border-red-800'
                      }`}
                    title={`Valve ${pipeline.pipelineId}: ${isOpen ? 'OPEN' : 'CLOSED'} - Click to toggle`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Settings size={16} className="text-white" />
                    </div>
                    {/* Valve Handle (Rotates when open) */}
                    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'
                      }`}></div>
                  </div>

                  {/* Main Pipeline Segment - Realistic 3D Vertical Pipe */}
                  <div
                    onClick={() => onNavigate && onNavigate(`pipeline-details-${pipeline.pipelineId}`)}
                    className="relative w-full h-32 cursor-pointer hover:scale-105 transition-all flex items-center justify-center"
                  >
                    <div className="relative w-12 h-full rounded-lg overflow-hidden"
                      style={{
                        background: 'linear-gradient(90deg, #57534e 0%, #78716c 20%, #a8a29e 50%, #78716c 80%, #57534e 100%)',
                        boxShadow: hasLeakage
                          ? 'inset -4px 0 8px rgba(0,0,0,0.4), inset 4px 0 8px rgba(255,255,255,0.1), 0 0 20px rgba(239, 68, 68, 0.6), 0 4px 10px rgba(0,0,0,0.3)'
                          : 'inset -4px 0 8px rgba(0,0,0,0.4), inset 4px 0 8px rgba(255,255,255,0.1), 0 4px 10px rgba(0,0,0,0.3)',
                        border: hasLeakage ? '3px solid #ef4444' : isOpen ? '3px solid #22c55e' : '3px solid #44403c'
                      }}>

                      {/* Pipe Joint in Middle */}
                      <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 h-3 bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 border-t-2 border-b-2 border-stone-900"
                        style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}></div>

                      {/* Water Flow Inside */}
                      {canFlow && (
                        <div className="absolute inset-1 overflow-hidden rounded">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent animate-flow-vertical"></div>
                        </div>
                      )}

                      {/* Pressure Sensor Device */}
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-emerald-600 rounded-full border-2 border-emerald-900 shadow-lg flex items-center justify-center z-30"
                        style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.4), inset 0 1px 3px rgba(255,255,255,0.2)' }}>
                        <Gauge size={10} className="text-white" />
                      </div>

                      {/* Leakage Indicator with Drip Effect */}
                      {hasLeakage && (
                        <>
                          <div className="absolute top-1/3 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping border border-white"></div>
                          <div className="absolute top-1/3 right-0 w-1 h-6 bg-blue-400/60 animate-pulse"></div>
                        </>
                      )}

                      {/* Pipeline Info Overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-xs font-bold pointer-events-none z-20"
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                        <span className="text-base drop-shadow-lg">P{pipeline.pipelineId}</span>
                        <span className="text-[10px] mt-1">{inletFlow} L/min</span>
                        <span className="text-[10px]">{inletPressure.toFixed(1)} bar</span>
                      </div>
                    </div>
                  </div>

                  {/* Valve Control Button - Direct Control */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleValve(pipeline.pipelineId);
                    }}
                    className={`w-full px-2 py-1 rounded text-xs font-bold transition-all shadow ${isOpen
                      ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-300'
                      : 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300'
                      }`}
                  >
                    {isOpen ? '🔒 Close Valve' : '🔓 Open Valve'}
                  </button>
                </div>
              );
            })}
          </div>



          {/* Legend - Positioned at bottom */}
          <div className="absolute bottom-4 left-0 right-0 flex flex-wrap items-center justify-center gap-4 text-xs pt-4 border-t-2 border-slate-400 bg-white/80 backdrop-blur-sm rounded-lg p-3 mx-4 shadow-lg z-10">
            <span className="flex items-center gap-2 text-slate-700 font-semibold">
              <span className="w-4 h-4 rounded-full bg-green-500 border-2 border-green-700"></span> Valve Open / Flow Active
            </span>
            <span className="flex items-center gap-2 text-slate-700 font-semibold">
              <span className="w-4 h-4 rounded-full bg-red-500 border-2 border-red-700"></span> Valve Closed / Flow Stopped
            </span>
            <span className="flex items-center gap-2 text-slate-700 font-semibold">
              <span className="w-4 h-4 rounded-full bg-amber-500 border-2 border-amber-700 animate-pulse"></span> Leakage Alert
            </span>
            <span className="text-slate-600 italic font-semibold">💡 Click any component for detailed view & control</span>
          </div>
        </div>
      </div>


      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-600 font-bold">Total Flow</p>
          <p className="text-2xl font-black text-blue-700">
            {pipelines.reduce((sum, p) => sum + (p.outlet?.flowSensor?.value || 0), 0)} L/min
          </p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xs text-green-600 font-bold">Open Pipelines</p>
          <p className="text-2xl font-black text-green-700">
            {pipelines.filter(p => p.valveStatus === 'OPEN').length} / 5
          </p>
        </div>
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-xs text-amber-600 font-bold">Avg Pressure</p>
          <p className="text-2xl font-black text-amber-700">
            {(pump.pumpPressureOutput || 0).toFixed(1)} bar
          </p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-xs text-purple-600 font-bold">System Efficiency</p>
          <p className="text-2xl font-black text-purple-700">
            {state?.systemMetrics?.systemEfficiency || 0}%
          </p>
        </div>
      </div>


      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 mt-8 border-t border-slate-200 pt-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="text-blue-600" />
            Junja Network Monitoring
          </h2>
          <p className="text-sm text-slate-500">Real-time pipeline status & control</p>
        </div>

        <div className="flex items-center gap-3">
          {isLive && (
            <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold animate-pulse">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              LIVE
            </span>
          )}
          <button
            onClick={togglePump}
            className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${isPumpOn
              ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200'
              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
          >
            <Power size={16} />
            Pump {isPumpOn ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* IoT Sensors Network - Moved to Bottom */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl p-4 shadow-lg mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg">
              <Radio size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">IoT Sensors Network</p>
              <p className="text-xs text-slate-600">{pipelines.length * 2} Active Sensors Monitoring</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate && onNavigate('pipelines-overview')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-lg transition-all"
            >
              View All Pipelines
            </button>
            <button
              onClick={() => onNavigate && onNavigate('infrastructure')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 shadow-lg transition-all"
            >
              View All Sensors
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          {pipelines.map((p) => (
            <div key={p.pipelineId} className="bg-white rounded-lg p-3 border border-blue-200 shadow-sm hover:shadow-md transition-all">
              <p className="font-bold text-slate-800 mb-1">P{p.pipelineId}</p>
              <div className="space-y-1">
                <p className="text-slate-600">
                  <span className="text-blue-600 font-semibold">Flow:</span> {p.inlet?.flowSensor?.value || 0} L/min
                </p>
                <p className="text-slate-600">
                  <span className="text-emerald-600 font-semibold">Press:</span> {(p.inlet?.pressureSensor?.value || 0).toFixed(1)} bar
                </p>
                <p className={`text-xs font-bold ${p.valveStatus === 'OPEN' ? 'text-green-600' : 'text-red-600'}`}>
                  Valve: {p.valveStatus}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animations for Realistic Water Flow and Effects */}
      <style>{`
        @keyframes flow-horizontal {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes flow-horizontal-delayed {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes flow-vertical {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-flow-horizontal {
          animation: flow-horizontal 2s linear infinite;
        }
        
        .animate-flow-horizontal-delayed {
          animation: flow-horizontal-delayed 2.5s linear infinite;
        }
        
        .animate-flow-vertical {
          animation: flow-vertical 3s linear infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
        
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
