import React, { useState, useRef, useEffect } from 'react';
import { useSimulationData } from '../../hooks/useSimulationData';
import IconImage from '../IconImage';

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

  // Pinch-to-zoom state
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const containerRef = useRef(null);
  const lastTouchDistance = useRef(0);
  const lastTouchCenter = useRef({ x: 0, y: 0 });
  const isPinching = useRef(false);

  // Get distance between two touch points
  const getTouchDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Get center point between two touches
  const getTouchCenter = (touches) => {
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    };
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      isPinching.current = true;
      lastTouchDistance.current = getTouchDistance(e.touches);
      lastTouchCenter.current = getTouchCenter(e.touches);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && isPinching.current) {
      e.preventDefault();
      
      const currentDistance = getTouchDistance(e.touches);
      const currentCenter = getTouchCenter(e.touches);
      
      // Calculate scale change
      const scaleChange = currentDistance / lastTouchDistance.current;
      const newScale = Math.min(Math.max(0.5, scale * scaleChange), 3);
      
      // Calculate translation to keep zoom centered on pinch point
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = (currentCenter.x - rect.left) / rect.width;
      const relativeY = (currentCenter.y - rect.top) / rect.height;
      
      const deltaX = currentCenter.x - lastTouchCenter.current.x;
      const deltaY = currentCenter.y - lastTouchCenter.current.y;
      
      setScale(newScale);
      setTranslateX(translateX + deltaX);
      setTranslateY(translateY + deltaY);
      
      lastTouchDistance.current = currentDistance;
      lastTouchCenter.current = currentCenter;
    }
  };

  const handleTouchEnd = (e) => {
    if (e.touches.length < 2) {
      isPinching.current = false;
    }
  };

  // Mouse wheel zoom (for desktop)
  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.min(Math.max(0.5, scale * delta), 3);
      setScale(newScale);
    }
  };

  // Reset zoom
  const handleResetZoom = () => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      {/* Components rearranged: Diagram is now top, others moved below */}

      {/* Realistic Indian Rural Water Infrastructure Network */}
      <div 
        ref={containerRef}
        className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-xl p-2 lg:p-8 border-2 border-amber-300 shadow-2xl overflow-auto relative"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        <div 
          className="relative scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100 origin-top-left" 
          style={{ 
            minHeight: '700px', 
            minWidth: '1200px',
            transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
            transformOrigin: 'center center'
          }}
        >
          {/* Horizontal Centrifugal Pump Station - Left Side */}
          <div className="absolute top-8 left-8 flex flex-col items-center gap-3 z-20">
            {/* Pump Assembly - Exact Design from PumpDetails */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                togglePump();
              }}
              className="relative transition-all hover:scale-105 cursor-pointer"
              style={{ width: '250px', height: '130px' }}
            >
              <svg viewBox="0 0 900 450" className="w-full h-auto" style={{ maxHeight: '130px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}>
                <defs>
                  <linearGradient id="pipeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#71717a" />
                    <stop offset="50%" stopColor="#a1a1aa" />
                    <stop offset="100%" stopColor="#52525b" />
                  </linearGradient>
                  
                  <linearGradient id="motorBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#27272a" />
                    <stop offset="30%" stopColor="#3f3f46" />
                    <stop offset="70%" stopColor="#27272a" />
                    <stop offset="100%" stopColor="#18181b" />
                  </linearGradient>
                  
                  <linearGradient id="pumpBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e3a8a" />
                    <stop offset="40%" stopColor="#2563eb" />
                    <stop offset="70%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1e40af" />
                  </linearGradient>
                  
                  <radialGradient id="statusGlow">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8"/>
                    <stop offset="50%" stopColor="#22c55e" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
                  </radialGradient>
                  
                  <radialGradient id="vibrationGlow">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6"/>
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/>
                  </radialGradient>
                  
                  <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="6"/>
                    <feOffset dx="3" dy="6" result="offsetblur"/>
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.4"/>
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  
                  <filter id="insetShadow">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                    <feOffset dx="2" dy="2"/>
                    <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1"/>
                    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                    <feBlend in2="SourceGraphic" mode="multiply"/>
                  </filter>
                </defs>

                {/* Concrete Foundation with Mounting */}
                <g>
                  <rect x="120" y="340" width="660" height="70" fill="#3f3f46" rx="6"/>
                  <rect x="120" y="340" width="660" height="12" fill="#52525b" rx="6"/>
                  <rect x="130" y="348" width="640" height="55" fill="#27272a" rx="4" filter="url(#insetShadow)"/>
                  
                  {/* Anchor Bolts */}
                  {[180, 720].map((x) => (
                    <g key={x}>
                      <rect x={x-10} y="325" width="20" height="35" fill="#52525b" rx="3"/>
                      <circle cx={x} cy="322" r="12" fill="#71717a" stroke="#27272a" strokeWidth="2.5"/>
                      <circle cx={x} cy="322" r="6" fill="#18181b"/>
                      <circle cx={x} cy="322" r="3" fill="#3f3f46"/>
                    </g>
                  ))}
                </g>

                {/* Inlet/Suction Pipe */}
                <g filter="url(#dropShadow)">
                  <rect x="60" y="280" width="170" height="55" fill="url(#pipeGradient)" rx="6"/>
                  <rect x="65" y="285" width="160" height="45" fill="#27272a" rx="5" filter="url(#insetShadow)"/>
                  <line x1="70" y1="292" x2="220" y2="292" stroke="#52525b" strokeWidth="2.5"/>
                  <line x1="70" y1="322" x2="220" y2="322" stroke="#18181b" strokeWidth="2.5"/>
                  
                  {/* Flange Connection */}
                  <ellipse cx="230" cy="307" rx="40" ry="48" fill="#52525b" stroke="#27272a" strokeWidth="3.5"/>
                  <ellipse cx="230" cy="307" rx="28" ry="36" fill="#18181b"/>
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                    <circle 
                      key={`suction-${angle}`}
                      cx={230 + Math.cos(angle * Math.PI / 180) * 32} 
                      cy={307 + Math.sin(angle * Math.PI / 180) * 40}
                      r="5" 
                      fill="#27272a"
                      stroke="#18181b"
                      strokeWidth="1.5"
                    />
                  ))}
                  
                  {/* Water Flow Animation */}
                  {isPumpOn && (
                    <>
                      {[0, 1, 2, 3].map((i) => (
                        <circle 
                          key={`suction-flow-${i}`}
                          cx="80" 
                          cy={295 + (i * 8)} 
                          r={4 + Math.random() * 2} 
                          fill="#3b82f6" 
                          opacity="0.4"
                        >
                          <animate attributeName="cx" from="80" to="220" dur={`${1.2 + i * 0.3}s`} repeatCount="indefinite"/>
                          <animate attributeName="opacity" from="0.5" to="0" dur={`${1.2 + i * 0.3}s`} repeatCount="indefinite"/>
                        </circle>
                      ))}
                    </>
                  )}
                </g>

                {/* Main Pump Body (Closed Volute Casing) */}
                <g filter="url(#dropShadow)">
                  {/* Outer Casing Shell */}
                  <ellipse cx="350" cy="240" rx="140" ry="130" fill="url(#pumpBodyGradient)" stroke="#1e3a8a" strokeWidth="5"/>
                  <ellipse cx="350" cy="240" rx="130" ry="120" fill="#1e40af" filter="url(#insetShadow)"/>
                  
                  {/* Metallic Highlights */}
                  <ellipse cx="340" cy="220" rx="60" ry="55" fill="none" stroke="#60a5fa" strokeWidth="2" opacity="0.3"/>
                  <ellipse cx="360" cy="250" rx="45" ry="40" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.2"/>
                  
                  {/* Assembly Bolts */}
                  {[[280, 160], [420, 160], [460, 240], [420, 320], [280, 320], [240, 240]].map(([x, y], i) => (
                    <g key={`bolt-${i}`}>
                      <circle cx={x} cy={y} r="10" fill="#64748b" stroke="#27272a" strokeWidth="2.5"/>
                      <circle cx={x} cy={y} r="5" fill="#27272a"/>
                      <circle cx={x} cy={y} r="2" fill="#18181b"/>
                    </g>
                  ))}
                  
                  {/* Vibration/Running Effect */}
                  {isPumpOn && (
                    <>
                      <ellipse cx="350" cy="240" rx="145" ry="135" fill="url(#vibrationGlow)" opacity="0.4">
                        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite"/>
                      </ellipse>
                      <ellipse cx="350" cy="240" rx="155" ry="145" fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.2">
                        <animate attributeName="opacity" values="0.1;0.3;0.1" dur="1.5s" repeatCount="indefinite"/>
                        <animate attributeName="rx" values="155;160;155" dur="2s" repeatCount="indefinite"/>
                        <animate attributeName="ry" values="145;150;145" dur="2s" repeatCount="indefinite"/>
                      </ellipse>
                    </>
                  )}
                  
                  {/* Brand Nameplate */}
                  <rect x="305" y="280" width="90" height="35" fill="#fcd34d" stroke="#f59e0b" strokeWidth="2.5" rx="4"/>
                  <text x="350" y="297" fontSize="11" fill="#78350f" textAnchor="middle" fontWeight="bold">KIRLOSKAR</text>
                  <text x="350" y="308" fontSize="8" fill="#92400e" textAnchor="middle" fontWeight="600">KDS-2050</text>
                </g>

                {/* Outlet/Discharge Pipe */}
                <g filter="url(#dropShadow)">
                  <rect x="60" y="180" width="170" height="55" fill="url(#pipeGradient)" rx="6"/>
                  <rect x="65" y="185" width="160" height="45" fill="#27272a" rx="5" filter="url(#insetShadow)"/>
                  <line x1="70" y1="192" x2="220" y2="192" stroke="#52525b" strokeWidth="2.5"/>
                  <line x1="70" y1="222" x2="220" y2="222" stroke="#18181b" strokeWidth="2.5"/>
                  
                  {/* Flange Connection */}
                  <ellipse cx="230" cy="207" rx="40" ry="48" fill="#52525b" stroke="#27272a" strokeWidth="3.5"/>
                  <ellipse cx="230" cy="207" rx="28" ry="36" fill="#18181b"/>
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                    <circle 
                      key={`discharge-${angle}`}
                      cx={230 + Math.cos(angle * Math.PI / 180) * 32} 
                      cy={207 + Math.sin(angle * Math.PI / 180) * 40}
                      r="5" 
                      fill="#27272a"
                      stroke="#18181b"
                      strokeWidth="1.5"
                    />
                  ))}
                  
                  {/* Water Flow Animation (Opposite Direction) */}
                  {isPumpOn && (
                    <>
                      {[0, 1, 2, 3].map((i) => (
                        <circle 
                          key={`discharge-flow-${i}`}
                          cx="200" 
                          cy={195 + (i * 8)} 
                          r={5 + Math.random() * 2} 
                          fill="#22c55e" 
                          opacity="0.5"
                        >
                          <animate attributeName="cx" from="200" to="70" dur={`${0.9 + i * 0.2}s`} repeatCount="indefinite"/>
                          <animate attributeName="opacity" from="0.6" to="0" dur={`${0.9 + i * 0.2}s`} repeatCount="indefinite"/>
                        </circle>
                      ))}
                    </>
                  )}
                </g>

                {/* Coupling/Shaft Housing */}
                <g>
                  <rect x="480" y="220" width="60" height="40" fill="#52525b" rx="4"/>
                  <rect x="485" y="225" width="50" height="30" fill="#3f3f46" rx="2" filter="url(#insetShadow)"/>
                  <line x1="490" y1="235" x2="530" y2="235" stroke="#71717a" strokeWidth="2"/>
                  <line x1="490" y1="245" x2="530" y2="245" stroke="#27272a" strokeWidth="2"/>
                  
                  {/* Coupling Bolts */}
                  {[[495, 230], [525, 230], [495, 250], [525, 250]].map(([x, y], i) => (
                    <circle key={`coupling-${i}`} cx={x} cy={y} r="3" fill="#18181b"/>
                  ))}
                </g>

                {/* Electric Motor Assembly */}
                <g filter="url(#dropShadow)">
                  {/* Motor Housing */}
                  <ellipse cx="600" cy="240" rx="110" ry="130" fill="url(#motorBodyGradient)" stroke="#52525b" strokeWidth="5"/>
                  <ellipse cx="600" cy="240" rx="100" ry="120" fill="#18181b"/>
                  
                  {/* Cooling Fins (External Ribs) */}
                  {[...Array(16)].map((_, i) => (
                    <rect 
                      key={`fin-${i}`}
                      x="540" 
                      y={135 + i * 13} 
                      width="120" 
                      height="6" 
                      fill="#3f3f46"
                      rx="1.5"
                      opacity="0.9"
                    />
                  ))}
                  
                  {/* Terminal Box */}
                  <rect x="670" y="210" width="50" height="50" fill="#3f3f46" stroke="#52525b" strokeWidth="2.5" rx="3"/>
                  <rect x="675" y="215" width="40" height="40" fill="#27272a" rx="2"/>
                  
                  {/* Three-Phase Terminals */}
                  <circle cx="695" cy="230" r="4" fill="#ef4444"/>
                  <circle cx="695" cy="242" r="4" fill="#eab308"/>
                  <circle cx="695" cy="254" r="4" fill="#3b82f6"/>
                  <text x="708" y="233" fontSize="7" fill="#a1a1aa">R</text>
                  <text x="708" y="245" fontSize="7" fill="#a1a1aa">Y</text>
                  <text x="708" y="257" fontSize="7" fill="#a1a1aa">B</text>
                  
                  {/* Motor Nameplate */}
                  <rect x="548" y="285" width="104" height="42" fill="#fcd34d" stroke="#f59e0b" strokeWidth="2.5" rx="4"/>
                  <text x="600" y="301" fontSize="12" fill="#78350f" textAnchor="middle" fontWeight="bold">KIRLOSKAR</text>
                  <text x="600" y="313" fontSize="9" fill="#92400e" textAnchor="middle" fontWeight="600">5.0 HP • 415V</text>
                  <text x="600" y="323" fontSize="7" fill="#92400e" textAnchor="middle">2900 RPM • 50Hz • 3Ph</text>
                  
                  {/* Status Indicator LED */}
                  <circle 
                    cx="690" 
                    cy="175" 
                    r="12" 
                    fill={isPumpOn ? '#22c55e' : '#3f3f46'}
                    stroke={isPumpOn ? '#10b981' : '#27272a'}
                    strokeWidth="2.5"
                  />
                  {isPumpOn && (
                    <circle cx="690" cy="175" r="18" fill="url(#statusGlow)" opacity="0.6">
                      <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite"/>
                    </circle>
                  )}
                  <circle cx="690" cy="175" r="7" fill={isPumpOn ? '#86efac' : '#52525b'}/>
                </g>
              </svg>
            </div>

            {/* Pump Label - Clickable for Details */}
            <div
              onClick={() => onNavigate && onNavigate('pump-details')}
              className="text-center cursor-pointer hover:scale-105 transition-transform group"
            >
              <p className="text-sm font-bold text-slate-800 group-hover:text-green-600">Pump Station</p>
              <p className="text-xs text-slate-600">{pump.pumpModel || 'Submersible Pump'}</p>
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
              {/* Removed background tank labels for cleaner look */}
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
                <IconImage name="settings" alt="Tank Outlet" size={20} />
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
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <IconImage name="arrow-right" alt="Flow Right" size={20} className="opacity-80" />
                  </div>
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
                        <IconImage name="radio" alt="Flow Sensor" size={14} />
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
                      <IconImage name="settings" alt="Valve" size={18} />
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
                        <IconImage name="gauge" alt="Pressure Sensor" size={14} />
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
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        <div className="p-2 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-[10px] sm:text-xs md:text-base text-blue-600 font-bold">Total Flow</p>
          <p className="text-sm sm:text-2xl md:text-2xl font-black text-blue-700">
            {pipelines.reduce((sum, p) => sum + (p.outlet?.flowSensor?.value || 0), 0)} L/min
          </p>
        </div>
        <div className="p-2 sm:p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-[10px] sm:text-xs md:text-base text-green-600 font-bold">Open Pipelines</p>
          <p className="text-sm sm:text-2xl md:text-2xl font-black text-green-700">
            {pipelines.filter(p => p.valveStatus === 'OPEN').length} / 5
          </p>
        </div>
        <div className="p-2 sm:p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-[10px] sm:text-xs md:text-base text-amber-600 font-bold">Avg Pressure</p>
          <p className="text-sm sm:text-2xl md:text-2xl font-black text-amber-700">
            {(pump.pumpPressureOutput || 0).toFixed(1)} bar
          </p>
        </div>
        <div className="p-2 sm:p-4 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-[10px] sm:text-xs md:text-base text-purple-600 font-bold">System Efficiency</p>
          <p className="text-sm sm:text-2xl md:text-4xl font-black text-purple-700">
            {state?.systemMetrics?.systemEfficiency || 0}%
          </p>
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
