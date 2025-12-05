import React, { useState, useRef, useEffect } from 'react';
import { useSimulationData } from '../../hooks/useSimulationData';
import IconImage from '../IconImage';

export const SystemContainer = ({ onNavigate }) => {
  const { state, isLive, togglePump, toggleValve, toggleTankOutlet } = useSimulationData();

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
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)',
        }}
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
            transformOrigin: 'center center',
          }}
        >
          {/* Horizontal Centrifugal Pump Station - Left Side */}
          <div
            className="absolute top-8 left-8 flex flex-col items-center gap-3 z-20 cursor-pointer"
            onClick={() => onNavigate && onNavigate('pump-station')}
          >
            {/* Realistic Centrifugal Pump - External View Only */}
            <div
              className="relative transition-all hover:scale-105"
              style={{ width: '220px', height: '140px' }}
            >
              <svg
                viewBox="0 0 800 500"
                className="w-full h-auto"
                style={{ maxHeight: '140px', filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.6))' }}
              >
                <defs>
                  {/* Enhanced 3D Gradients for Realistic Centrifugal Pump */}
                  <radialGradient id="pumpBodyGradient" cx="35%" cy="30%">
                    <stop offset="0%" stopColor="#93c5fd" />
                    <stop offset="20%" stopColor="#60a5fa" />
                    <stop offset="40%" stopColor="#3b82f6" />
                    <stop offset="60%" stopColor="#2563eb" />
                    <stop offset="80%" stopColor="#1e40af" />
                    <stop offset="100%" stopColor="#1e3a8a" />
                  </radialGradient>

                  <radialGradient id="motorBodyGradient" cx="30%" cy="25%">
                    <stop offset="0%" stopColor="#71717a" />
                    <stop offset="25%" stopColor="#52525b" />
                    <stop offset="50%" stopColor="#3f3f46" />
                    <stop offset="75%" stopColor="#27272a" />
                    <stop offset="100%" stopColor="#18181b" />
                  </radialGradient>

                  <linearGradient id="pipeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#52525b" />
                    <stop offset="15%" stopColor="#71717a" />
                    <stop offset="30%" stopColor="#9ca3af" />
                    <stop offset="50%" stopColor="#d1d5db" />
                    <stop offset="70%" stopColor="#9ca3af" />
                    <stop offset="85%" stopColor="#71717a" />
                    <stop offset="100%" stopColor="#3f3f46" />
                  </linearGradient>

                  <radialGradient id="metalShine" cx="35%" cy="25%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                    <stop offset="30%" stopColor="#e0e7ff" stopOpacity="0.6" />
                    <stop offset="60%" stopColor="#bfdbfe" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </radialGradient>

                  <radialGradient id="vibrationGlow" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
                  </radialGradient>

                  <radialGradient id="statusGlow" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#16a34a" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#15803d" stopOpacity="0" />
                  </radialGradient>

                  <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
                    <feOffset dx="4" dy="8" result="offsetblur" />
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.65" />
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <filter id="insetShadow">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
                    <feOffset dx="-3" dy="-3" />
                    <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
                  </filter>

                  <filter id="bevelEdge">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                    <feOffset dx="2" dy="2" />
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Concrete Foundation Base */}
                <g>
                  <ellipse cx="400" cy="460" rx="300" ry="20" fill="#000000" opacity="0.3" />
                  <rect x="150" y="420" width="500" height="50" fill="#52525b" rx="6" />
                  <rect x="150" y="420" width="500" height="8" fill="#71717a" rx="6" />
                  <rect x="160" y="428" width="480" height="38" fill="#3f3f46" rx="4" />
                </g>

                {/* Inlet Suction Pipe */}
                <g filter="url(#pumpShadow)">
                  <rect
                    x="50"
                    y="320"
                    width="150"
                    height="45"
                    fill="url(#pipeMetalGradient)"
                    rx="8"
                  />
                  <rect x="50" y="320" width="150" height="8" fill="#d4d4d8" opacity="0.6" rx="8" />
                  <rect x="55" y="328" width="140" height="32" fill="#52525b" rx="6" />

                  {/* Flange */}
                  <ellipse
                    cx="200"
                    cy="342"
                    rx="30"
                    ry="35"
                    fill="#71717a"
                    stroke="#3f3f46"
                    strokeWidth="3"
                  />
                  <ellipse cx="200" cy="342" rx="22" ry="27" fill="#52525b" />

                  {/* Flange bolts */}
                  {[0, 90, 180, 270].map((angle) => (
                    <circle
                      key={`in-bolt-${angle}`}
                      cx={200 + Math.cos((angle * Math.PI) / 180) * 24}
                      cy={342 + Math.sin((angle * Math.PI) / 180) * 29}
                      r="4"
                      fill="#3f3f46"
                      stroke="#18181b"
                      strokeWidth="1.5"
                    />
                  ))}

                  {isPumpOn && (
                    <>
                      {[0, 1, 2].map((i) => (
                        <circle
                          key={`in-flow-${i}`}
                          cx="80"
                          cy={335 + i * 10}
                          r="4"
                          fill="#3b82f6"
                          opacity="0.6"
                        >
                          <animate
                            attributeName="cx"
                            from="80"
                            to="190"
                            dur="1.5s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            from="0.7"
                            to="0"
                            dur="1.5s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      ))}
                    </>
                  )}
                </g>

                {/* Enhanced 3D Centrifugal Pump Body (Volute Casing) */}
                <g filter="url(#dropShadow)">
                  {/* Base shadow for depth */}
                  <ellipse cx="355" cy="250" rx="148" ry="138" fill="#000000" opacity="0.2" />

                  {/* Outer Casing Shell with 3D gradient */}
                  <ellipse
                    cx="350"
                    cy="240"
                    rx="145"
                    ry="135"
                    fill="url(#pumpBodyGradient)"
                    stroke="#1e3a8a"
                    strokeWidth="6"
                  />
                  <ellipse
                    cx="350"
                    cy="240"
                    rx="137"
                    ry="127"
                    fill="#1e40af"
                    filter="url(#insetShadow)"
                  />

                  {/* Metallic shine overlay */}
                  <ellipse
                    cx="320"
                    cy="210"
                    rx="80"
                    ry="70"
                    fill="url(#metalShine)"
                    opacity="0.6"
                  />

                  {/* Volute spiral chamber outline (3D depth) */}
                  <path
                    d="M 350 240 Q 380 200, 420 210 Q 450 220, 460 250 Q 465 280, 440 310 Q 410 340, 370 340 Q 330 340, 300 320 Q 270 300, 260 270 Q 255 240, 270 210 Q 290 180, 320 170"
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="3"
                    opacity="0.4"
                    filter="url(#bevelEdge)"
                  />

                  {/* Inner volute detail */}
                  <ellipse
                    cx="350"
                    cy="240"
                    rx="100"
                    ry="92"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    opacity="0.3"
                  />
                  <ellipse
                    cx="360"
                    cy="248"
                    rx="70"
                    ry="65"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2"
                    opacity="0.25"
                  />

                  {/* Impeller housing indication (center) */}
                  <circle
                    cx="350"
                    cy="240"
                    r="55"
                    fill="#1e3a8a"
                    stroke="#1e293b"
                    strokeWidth="3"
                  />
                  <circle cx="350" cy="240" r="50" fill="#0f172a" filter="url(#insetShadow)" />

                  {/* Impeller eye (water inlet) */}
                  <circle
                    cx="350"
                    cy="240"
                    r="25"
                    fill="#1e40af"
                    stroke="#1e3a8a"
                    strokeWidth="2"
                  />
                  <circle cx="350" cy="240" r="20" fill="#0c1e3f" />

                  {/* Assembly Bolts with 3D effect */}
                  {[
                    [275, 155],
                    [425, 155],
                    [470, 240],
                    [425, 325],
                    [275, 325],
                    [230, 240],
                  ].map(([x, y], i) => (
                    <g key={`bolt-${i}`} filter="url(#dropShadow)">
                      <circle
                        cx={x}
                        cy={y}
                        r="12"
                        fill="#71717a"
                        stroke="#1f2937"
                        strokeWidth="3"
                      />
                      <circle cx={x} cy={y} r="9" fill="#52525b" />
                      <circle cx={x} cy={y} r="6" fill="#27272a" />
                      <circle cx={x} cy={y} r="3" fill="#1f2937" />
                      {/* Bolt shine */}
                      <ellipse cx={x - 3} cy={y - 3} rx="4" ry="3" fill="#94a3b8" opacity="0.6" />
                    </g>
                  ))}

                  {/* Drain plug at bottom */}
                  <g>
                    <circle
                      cx="350"
                      cy="360"
                      r="10"
                      fill="#64748b"
                      stroke="#27272a"
                      strokeWidth="2"
                    />
                    <circle cx="350" cy="360" r="6" fill="#3f3f46" />
                    <path
                      d="M 348 360 L 352 360 M 350 358 L 350 362"
                      stroke="#1f2937"
                      strokeWidth="1.5"
                    />
                  </g>

                  {/* Casing ribs for strength */}
                  {[0, 72, 144, 216, 288].map((angle) => (
                    <line
                      key={`rib-${angle}`}
                      x1={350 + Math.cos((angle * Math.PI) / 180) * 130}
                      y1={240 + Math.sin((angle * Math.PI) / 180) * 120}
                      x2={350 + Math.cos((angle * Math.PI) / 180) * 138}
                      y2={240 + Math.sin((angle * Math.PI) / 180) * 128}
                      stroke="#1e3a8a"
                      strokeWidth="4"
                      opacity="0.6"
                    />
                  ))}

                  {/* Vibration/Running Effect */}
                  {isPumpOn && (
                    <>
                      <ellipse
                        cx="350"
                        cy="240"
                        rx="150"
                        ry="140"
                        fill="url(#vibrationGlow)"
                        opacity="0.5"
                      >
                        <animate
                          attributeName="opacity"
                          values="0.3;0.7;0.3"
                          dur="1.8s"
                          repeatCount="indefinite"
                        />
                      </ellipse>
                      <ellipse
                        cx="350"
                        cy="240"
                        rx="160"
                        ry="150"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="3"
                        opacity="0.3"
                      >
                        <animate
                          attributeName="opacity"
                          values="0.1;0.4;0.1"
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="rx"
                          values="160;165;160"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="ry"
                          values="150;155;150"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </ellipse>

                      {/* Rotating impeller effect */}
                      <g opacity="0.3">
                        <animateTransform
                          attributeName="transform"
                          attributeType="XML"
                          type="rotate"
                          from="0 350 240"
                          to="360 350 240"
                          dur="0.8s"
                          repeatCount="indefinite"
                        />
                        {[0, 60, 120, 180, 240, 300].map((angle) => (
                          <line
                            key={`impeller-${angle}`}
                            x1="350"
                            y1="240"
                            x2={350 + Math.cos((angle * Math.PI) / 180) * 45}
                            y2={240 + Math.sin((angle * Math.PI) / 180) * 42}
                            stroke="#22d3ee"
                            strokeWidth="3"
                          />
                        ))}
                      </g>
                    </>
                  )}

                  {/* Brand Nameplate with 3D effect */}
                  <g filter="url(#dropShadow)">
                    <rect
                      x="300"
                      y="278"
                      width="100"
                      height="40"
                      fill="#fcd34d"
                      stroke="#f59e0b"
                      strokeWidth="3"
                      rx="5"
                    />
                    <rect x="300" y="278" width="100" height="5" fill="#fef3c7" rx="5" />
                    <text
                      x="350"
                      y="296"
                      fontSize="12"
                      fill="#78350f"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      KIRLOSKAR
                    </text>
                    <text
                      x="350"
                      y="308"
                      fontSize="9"
                      fill="#92400e"
                      textAnchor="middle"
                      fontWeight="600"
                    >
                      KDS-2050
                    </text>
                    <text x="350" y="316" fontSize="7" fill="#92400e" textAnchor="middle">
                      5HP MONO
                    </text>
                  </g>
                </g>

                {/* Enhanced 3D Outlet/Discharge Pipe */}
                <g filter="url(#dropShadow)">
                  {/* Pipe shadow */}
                  <rect
                    x="60"
                    y="188"
                    width="175"
                    height="60"
                    fill="#000000"
                    opacity="0.15"
                    rx="6"
                  />

                  {/* Outer pipe casing */}
                  <rect x="55" y="175" width="180" height="65" fill="url(#pipeGradient)" rx="8" />
                  <rect x="55" y="175" width="180" height="10" fill="#cbd5e1" rx="8" />

                  {/* Inner pipe bore */}
                  <rect
                    x="62"
                    y="183"
                    width="166"
                    height="49"
                    fill="#1f2937"
                    rx="6"
                    filter="url(#insetShadow)"
                  />

                  {/* Pipe highlights and shadows for 3D */}
                  <line
                    x1="65"
                    y1="185"
                    x2="225"
                    y2="185"
                    stroke="#94a3b8"
                    strokeWidth="3"
                    opacity="0.6"
                  />
                  <line
                    x1="65"
                    y1="228"
                    x2="225"
                    y2="228"
                    stroke="#0f172a"
                    strokeWidth="3"
                    opacity="0.7"
                  />

                  {/* Pipe ribs/reinforcement */}
                  {[85, 135, 185].map((x) => (
                    <rect
                      key={`rib-dis-${x}`}
                      x={x}
                      y="178"
                      width="8"
                      height="59"
                      fill="#64748b"
                      opacity="0.5"
                      rx="2"
                    />
                  ))}

                  {/* Enhanced Flange Connection with 3D depth */}
                  <ellipse
                    cx="235"
                    cy="207"
                    rx="45"
                    ry="53"
                    fill="#64748b"
                    stroke="#1f2937"
                    strokeWidth="4"
                  />
                  <ellipse cx="235" cy="207" rx="35" ry="43" fill="#475569" />
                  <ellipse
                    cx="235"
                    cy="207"
                    rx="30"
                    ry="38"
                    fill="#1f2937"
                    filter="url(#insetShadow)"
                  />

                  {/* Flange shine */}
                  <ellipse cx="225" cy="195" rx="18" ry="22" fill="#cbd5e1" opacity="0.4" />

                  {/* Flange bolts with 3D */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                    <g key={`discharge-${angle}`}>
                      <circle
                        cx={235 + Math.cos((angle * Math.PI) / 180) * 37}
                        cy={207 + Math.sin((angle * Math.PI) / 180) * 45}
                        r="6"
                        fill="#71717a"
                        stroke="#1f2937"
                        strokeWidth="2"
                      />
                      <circle
                        cx={235 + Math.cos((angle * Math.PI) / 180) * 37}
                        cy={207 + Math.sin((angle * Math.PI) / 180) * 45}
                        r="3"
                        fill="#27272a"
                      />
                    </g>
                  ))}

                  {/* Water Flow Animation (Opposite Direction - Discharge) */}
                  {isPumpOn && (
                    <>
                      {[0, 1, 2, 3, 4].map((i) => (
                        <circle
                          key={`discharge-flow-${i}`}
                          cx="210"
                          cy={192 + i * 9}
                          r={6 + Math.random() * 3}
                          fill="#22d3ee"
                          opacity="0.6"
                        >
                          <animate
                            attributeName="cx"
                            from="210"
                            to="70"
                            dur={`${0.8 + i * 0.2}s`}
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            from="0.7"
                            to="0"
                            dur={`${0.8 + i * 0.2}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                      ))}
                      {/* High pressure flow effect */}
                      <circle
                        cx="140"
                        cy="207"
                        r="12"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        opacity="0.4"
                      >
                        <animate
                          attributeName="r"
                          from="8"
                          to="18"
                          dur="1.2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.5"
                          to="0"
                          dur="1.2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </>
                  )}

                  {/* Pressure gauge mounting */}
                  <g>
                    <circle
                      cx="145"
                      cy="175"
                      r="18"
                      fill="#e2e8f0"
                      stroke="#475569"
                      strokeWidth="3"
                    />
                    <circle
                      cx="145"
                      cy="175"
                      r="14"
                      fill="#f8fafc"
                      stroke="#64748b"
                      strokeWidth="1.5"
                    />
                    <text
                      x="145"
                      y="180"
                      fontSize="10"
                      fill="#1e293b"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      PSI
                    </text>
                  </g>
                </g>

                {/* Enhanced 3D Coupling/Shaft Housing */}
                <g filter="url(#dropShadow)">
                  {/* Coupling guard cover */}
                  <rect
                    x="475"
                    y="210"
                    width="75"
                    height="60"
                    fill="#4b5563"
                    rx="6"
                    stroke="#1f2937"
                    strokeWidth="3"
                  />
                  <rect x="475" y="210" width="75" height="8" fill="#6b7280" rx="6" />
                  <rect
                    x="480"
                    y="218"
                    width="65"
                    height="47"
                    fill="#374151"
                    rx="4"
                    filter="url(#insetShadow)"
                  />

                  {/* Ventilation slots */}
                  {[225, 240, 255].map((y) => (
                    <g key={`vent-${y}`}>
                      <rect
                        x="485"
                        y={y}
                        width="55"
                        height="3"
                        fill="#1f2937"
                        rx="1"
                        opacity="0.8"
                      />
                      <rect x="485" y={y} width="55" height="1" fill="#0f172a" rx="1" />
                    </g>
                  ))}

                  {/* Flexible coupling (visible through design) */}
                  <ellipse
                    cx="512"
                    cy="240"
                    rx="22"
                    ry="20"
                    fill="#fbbf24"
                    stroke="#f59e0b"
                    strokeWidth="2"
                  />
                  <ellipse cx="512" cy="240" rx="18" ry="16" fill="#f59e0b" />

                  {/* Coupling rubber elements */}
                  {[0, 60, 120, 180, 240, 300].map((angle) => (
                    <rect
                      key={`rubber-${angle}`}
                      x={512 + Math.cos((angle * Math.PI) / 180) * 14 - 2}
                      y={240 + Math.sin((angle * Math.PI) / 180) * 12 - 4}
                      width="4"
                      height="8"
                      fill="#27272a"
                      rx="1"
                    />
                  ))}

                  {/* Guard mounting bolts */}
                  {[
                    [480, 215],
                    [545, 215],
                    [480, 265],
                    [545, 265],
                  ].map(([x, y], i) => (
                    <g key={`coupling-bolt-${i}`}>
                      <circle
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#71717a"
                        stroke="#1f2937"
                        strokeWidth="1.5"
                      />
                      <circle cx={x} cy={y} r="2" fill="#27272a" />
                    </g>
                  ))}

                  {/* Alignment indicator */}
                  <line
                    x1="512"
                    y1="215"
                    x2="512"
                    y2="223"
                    stroke="#22c55e"
                    strokeWidth="2"
                    opacity={isPumpOn ? '0.8' : '0.3'}
                  />
                </g>

                {/* Enhanced 3D Electric Motor Assembly */}
                <g filter="url(#dropShadow)">
                  {/* Motor shadow */}
                  <ellipse cx="605" cy="250" rx="115" ry="138" fill="#000000" opacity="0.2" />

                  {/* Motor Housing with enhanced gradient */}
                  <ellipse
                    cx="600"
                    cy="240"
                    rx="115"
                    ry="135"
                    fill="url(#motorBodyGradient)"
                    stroke="#1f2937"
                    strokeWidth="6"
                  />
                  <ellipse
                    cx="600"
                    cy="240"
                    rx="107"
                    ry="127"
                    fill="#111827"
                    filter="url(#insetShadow)"
                  />

                  {/* Metallic shine on motor */}
                  <ellipse
                    cx="570"
                    cy="200"
                    rx="60"
                    ry="70"
                    fill="url(#metalShine)"
                    opacity="0.4"
                  />

                  {/* Enhanced Cooling Fins (External Ribs) with 3D depth */}
                  {[...Array(18)].map((_, i) => (
                    <g key={`fin-${i}`}>
                      <rect
                        x="535"
                        y={130 + i * 12}
                        width="130"
                        height="7"
                        fill="#4b5563"
                        rx="2"
                        opacity="0.95"
                      />
                      <rect
                        x="535"
                        y={130 + i * 12}
                        width="130"
                        height="2"
                        fill="#6b7280"
                        rx="2"
                        opacity="0.7"
                      />
                      <rect
                        x="537"
                        y={135 + i * 12}
                        width="126"
                        height="2"
                        fill="#1f2937"
                        rx="1"
                        opacity="0.6"
                      />
                    </g>
                  ))}

                  {/* Motor end covers */}
                  <ellipse
                    cx="600"
                    cy="125"
                    rx="108"
                    ry="25"
                    fill="#374151"
                    stroke="#1f2937"
                    strokeWidth="3"
                  />
                  <ellipse
                    cx="600"
                    cy="355"
                    rx="108"
                    ry="25"
                    fill="#374151"
                    stroke="#1f2937"
                    strokeWidth="3"
                  />
                  <ellipse cx="600" cy="125" rx="100" ry="20" fill="#1f2937" />
                  <ellipse cx="600" cy="355" rx="100" ry="20" fill="#1f2937" />

                  {/* Shaft outlet */}
                  <circle
                    cx="600"
                    cy="125"
                    r="18"
                    fill="#52525b"
                    stroke="#27272a"
                    strokeWidth="2"
                  />
                  <circle cx="600" cy="125" r="12" fill="#3f3f46" />

                  {/* Enhanced Terminal Box with 3D */}
                  <g filter="url(#dropShadow)">
                    <rect
                      x="668"
                      y="205"
                      width="58"
                      height="58"
                      fill="#4b5563"
                      stroke="#1f2937"
                      strokeWidth="3"
                      rx="4"
                    />
                    <rect x="668" y="205" width="58" height="8" fill="#6b7280" rx="4" />
                    <rect
                      x="673"
                      y="213"
                      width="48"
                      height="45"
                      fill="#1f2937"
                      rx="3"
                      filter="url(#insetShadow)"
                    />

                    {/* Terminal cover screws */}
                    {[
                      [678, 210],
                      [718, 210],
                      [678, 253],
                      [718, 253],
                    ].map(([x, y], i) => (
                      <g key={`screw-${i}`}>
                        <circle
                          cx={x}
                          cy={y}
                          r="3"
                          fill="#52525b"
                          stroke="#27272a"
                          strokeWidth="1"
                        />
                        <line
                          x1={x - 2}
                          y1={y}
                          x2={x + 2}
                          y2={y}
                          stroke="#1f2937"
                          strokeWidth="0.5"
                        />
                      </g>
                    ))}

                    {/* Three-Phase Terminals with realistic connectors */}
                    <circle
                      cx="697"
                      cy="228"
                      r="5"
                      fill="#dc2626"
                      stroke="#7f1d1d"
                      strokeWidth="2"
                    />
                    <circle
                      cx="697"
                      cy="242"
                      r="5"
                      fill="#facc15"
                      stroke="#a16207"
                      strokeWidth="2"
                    />
                    <circle
                      cx="697"
                      cy="256"
                      r="5"
                      fill="#2563eb"
                      stroke="#1e3a8a"
                      strokeWidth="2"
                    />

                    {/* Terminal labels */}
                    <text x="711" y="231" fontSize="8" fill="#d1d5db" fontWeight="bold">
                      R
                    </text>
                    <text x="711" y="245" fontSize="8" fill="#d1d5db" fontWeight="bold">
                      Y
                    </text>
                    <text x="711" y="259" fontSize="8" fill="#d1d5db" fontWeight="bold">
                      B
                    </text>

                    {/* Earth terminal */}
                    <circle
                      cx="697"
                      cy="218"
                      r="4"
                      fill="#10b981"
                      stroke="#065f46"
                      strokeWidth="1.5"
                    />
                    <text x="711" y="221" fontSize="7" fill="#d1d5db">
                      ⏚
                    </text>
                  </g>

                  {/* Enhanced Motor Nameplate with 3D */}
                  <g filter="url(#dropShadow)">
                    <rect
                      x="543"
                      y="282"
                      width="114"
                      height="48"
                      fill="#fcd34d"
                      stroke="#f59e0b"
                      strokeWidth="3"
                      rx="5"
                    />
                    <rect x="543" y="282" width="114" height="6" fill="#fef3c7" rx="5" />
                    <text
                      x="600"
                      y="300"
                      fontSize="13"
                      fill="#78350f"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      KIRLOSKAR
                    </text>
                    <text
                      x="600"
                      y="313"
                      fontSize="10"
                      fill="#92400e"
                      textAnchor="middle"
                      fontWeight="600"
                    >
                      5.0 HP • 3.7kW
                    </text>
                    <text x="600" y="323" fontSize="8" fill="#92400e" textAnchor="middle">
                      415V • 2900RPM
                    </text>
                    <text x="600" y="330" fontSize="7" fill="#92400e" textAnchor="middle">
                      50Hz • 3Ph • IP55
                    </text>
                  </g>

                  {/* Enhanced Status Indicator LED with 3D */}
                  <g filter="url(#dropShadow)">
                    <circle
                      cx="693"
                      cy="170"
                      r="15"
                      fill={isPumpOn ? '#15803d' : '#3f3f46'}
                      stroke={isPumpOn ? '#14532d' : '#1f2937'}
                      strokeWidth="3"
                    />
                    {isPumpOn && (
                      <circle cx="693" cy="170" r="22" fill="url(#statusGlow)" opacity="0.7">
                        <animate
                          attributeName="opacity"
                          values="0.4;0.9;0.4"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                    <circle cx="693" cy="170" r="10" fill={isPumpOn ? '#22c55e' : '#52525b'} />
                    <ellipse
                      cx="688"
                      cy="166"
                      rx="4"
                      ry="3"
                      fill={isPumpOn ? '#86efac' : '#6b7280'}
                      opacity="0.8"
                    />
                  </g>

                  {/* Motor mounting feet */}
                  {[530, 670].map((x) => (
                    <g key={`foot-${x}`}>
                      <rect x={x} y="350" width="30" height="15" fill="#4b5563" rx="2" />
                      <rect x={x + 2} y="352" width="26" height="11" fill="#374151" rx="1" />
                      <circle
                        cx={x + 15}
                        cy="360"
                        r="4"
                        fill="#1f2937"
                        stroke="#0f172a"
                        strokeWidth="1"
                      />
                    </g>
                  ))}
                </g>
              </svg>
            </div>

            {/* Pump Label */}
            <div className="text-center">
              <p className="text-sm font-bold text-slate-800">Pump Station</p>
              <p className="text-xs text-slate-600">{pump.pumpModel || 'Submersible Pump'}</p>
              <p className="text-xs text-slate-600">{isPumpOn ? 'Running' : 'Stopped'}</p>
            </div>

            {/* Pump Control Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePump();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg ${
                isPumpOn
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              {isPumpOn ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Water Tank - Center (Overhead Tank SVG with Enhanced 3D) */}
          <div
            onClick={() => onNavigate && onNavigate('water-tank')}
            className="absolute top-2 left-1/2 transform -translate-x-1/2 cursor-pointer hover:scale-105 transition-transform group z-20"
            style={{ width: '580px' }}
          >
            <svg
              viewBox="0 0 800 550"
              className="w-full h-auto"
              style={{ maxHeight: '520px', filter: 'drop-shadow(0 12px 25px rgba(0,0,0,0.4))' }}
            >
              <defs>
                <linearGradient id="tankBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6b7280" />
                  <stop offset="30%" stopColor="#9ca3af" />
                  <stop offset="70%" stopColor="#6b7280" />
                  <stop offset="100%" stopColor="#4b5563" />
                </linearGradient>
                <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="pillarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#374151" />
                  <stop offset="50%" stopColor="#6b7280" />
                  <stop offset="100%" stopColor="#1f2937" />
                </linearGradient>
                <radialGradient id="tankShineGradient" cx="30%" cy="30%">
                  <stop offset="0%" stopColor="#d1d5db" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#9ca3af" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#4b5563" stopOpacity="0.3" />
                </radialGradient>
                <filter id="dropShadowTank" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
                  <feOffset dx="4" dy="8" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.5" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="innerShadow">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
                  <feOffset dx="-2" dy="-2" />
                  <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" />
                  <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0" />
                </filter>
              </defs>

              {/* Ground/Base Platform with 3D depth */}
              <rect x="100" y="480" width="600" height="60" fill="#1f2937" rx="6" />
              <rect x="100" y="480" width="600" height="12" fill="#374151" rx="6" />
              <rect x="110" y="488" width="580" height="48" fill="#111827" rx="4" />

              {/* Base shadow for depth */}
              <ellipse cx="400" cy="540" rx="300" ry="20" fill="#000" opacity="0.3" />

              {/* Supporting Pillars with enhanced 3D - Only 2 pillars slightly inside corners */}
              {[170, 630].map((x, i) => (
                <g key={i} filter="url(#dropShadowTank)">
                  {/* Main pillar body */}
                  <rect
                    x={x - 26}
                    y="220"
                    width="52"
                    height="260"
                    fill="url(#pillarGradient)"
                    rx="4"
                  />
                  {/* Highlight edge */}
                  <rect
                    x={x - 26}
                    y="220"
                    width="8"
                    height="260"
                    fill="#9ca3af"
                    opacity="0.4"
                    rx="4"
                  />
                  {/* Shadow edge */}
                  <rect
                    x={x + 16}
                    y="220"
                    width="8"
                    height="260"
                    fill="#1f2937"
                    opacity="0.6"
                    rx="4"
                  />

                  {/* Steel bands with depth */}
                  {[250, 320, 390, 460].map((y, j) => (
                    <g key={j}>
                      <rect x={x - 30} y={y} width="60" height="10" fill="#52525b" rx="2" />
                      <rect
                        x={x - 30}
                        y={y}
                        width="60"
                        height="3"
                        fill="#9ca3af"
                        opacity="0.5"
                        rx="2"
                      />
                    </g>
                  ))}

                  {/* Pillar base with 3D effect */}
                  <rect x={x - 36} y="465" width="72" height="25" fill="#52525b" rx="3" />
                  <rect x={x - 34} y="467" width="68" height="20" fill="#374151" rx="2" />
                </g>
              ))}

              {/* Support Beams with 3D depth */}
              <rect x="140" y="215" width="520" height="18" fill="#52525b" rx="3" />
              <rect x="140" y="215" width="520" height="5" fill="#9ca3af" opacity="0.5" rx="3" />

              {/* Main Water Tank Body - Side View with Full Transparency like pipes */}
              <g filter="url(#dropShadowTank)">
                {/* Main tank body - rectangular side view with full transparency */}
                <rect
                  x="140"
                  y="60"
                  width="520"
                  height="160"
                  fill="url(#tankBodyGradient)"
                  rx="6"
                  opacity="0.15"
                />

                {/* Metallic shine overlay for 3D effect */}
                <ellipse
                  cx="340"
                  cy="110"
                  rx="180"
                  ry="70"
                  fill="url(#tankShineGradient)"
                  opacity="0.1"
                />

                {/* Inner tank wall - fully transparent */}
                <rect
                  x="145"
                  y="65"
                  width="510"
                  height="155"
                  fill="#52525b"
                  rx="4"
                  opacity="0.15"
                />

                {/* Inner shadow for depth */}
                <rect
                  x="150"
                  y="70"
                  width="500"
                  height="145"
                  fill="none"
                  stroke="#1f2937"
                  strokeWidth="3"
                  opacity="0.2"
                  rx="4"
                />

                {/* Vertical Bands with 3D depth */}
                {[200, 280, 360, 440, 520, 600].map((x, i) => (
                  <g key={i}>
                    <rect
                      x={x}
                      y="60"
                      width="10"
                      height="160"
                      fill="#3f3f46"
                      opacity="0.3"
                      rx="2"
                    />
                    <rect x={x} y="60" width="3" height="160" fill="#9ca3af" opacity="0.2" rx="1" />
                  </g>
                ))}

                {/* Horizontal Bands with highlights */}
                {[90, 130, 170, 200].map((y, i) => (
                  <g key={i}>
                    <rect
                      x="140"
                      y={y}
                      width="520"
                      height="8"
                      fill="#3f3f46"
                      opacity="0.3"
                      rx="2"
                    />
                    <rect
                      x="140"
                      y={y}
                      width="520"
                      height="2"
                      fill="#9ca3af"
                      opacity="0.3"
                      rx="2"
                    />
                  </g>
                ))}

                {/* Water Inside Tank */}
                <g clipPath="url(#tankClip)">
                  <clipPath id="tankClip">
                    <rect x="145" y="65" width="510" height="155" rx="4" />
                  </clipPath>

                  {tank.tankLevel > 0 && (
                    <>
                      {/* Main Water Body */}
                      <rect
                        x="145"
                        y={220 - (tank.tankLevel / 100) * 155}
                        width="510"
                        height={(tank.tankLevel / 100) * 155}
                        fill="url(#waterGradient)"
                      >
                        <animate
                          attributeName="opacity"
                          values="0.9;1;0.9"
                          dur="3s"
                          repeatCount="indefinite"
                        />
                      </rect>

                      {/* Water Surface with Wave Effect */}
                      {tank.isFilling && (
                        <>
                          {/* Primary wave */}
                          <ellipse
                            cx="400"
                            cy={220 - (tank.tankLevel / 100) * 155}
                            rx="255"
                            ry="10"
                            fill="#22d3ee"
                            opacity="0.5"
                          >
                            <animate
                              attributeName="ry"
                              values="8;14;8"
                              dur="2s"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="opacity"
                              values="0.4;0.7;0.4"
                              dur="2s"
                              repeatCount="indefinite"
                            />
                          </ellipse>
                          {/* Secondary wave */}
                          <ellipse
                            cx="400"
                            cy={220 - (tank.tankLevel / 100) * 155}
                            rx="240"
                            ry="8"
                            fill="#06b6d4"
                            opacity="0.4"
                          >
                            <animate
                              attributeName="ry"
                              values="6;12;6"
                              dur="2.5s"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="opacity"
                              values="0.3;0.6;0.3"
                              dur="2.5s"
                              repeatCount="indefinite"
                            />
                          </ellipse>
                          {/* Water bubbles rising */}
                          {[0, 1, 2, 3, 4].map((i) => (
                            <circle
                              key={i}
                              cx={300 + i * 50}
                              cy="200"
                              r="3"
                              fill="#fff"
                              opacity="0.5"
                            >
                              <animate
                                attributeName="cy"
                                from="210"
                                to={220 - (tank.tankLevel / 100) * 135 - 10}
                                dur={`${2 + i * 0.3}s`}
                                begin={`${i * 0.4}s`}
                                repeatCount="indefinite"
                              />
                              <animate
                                attributeName="opacity"
                                from="0.6"
                                to="0"
                                dur={`${2 + i * 0.3}s`}
                                begin={`${i * 0.4}s`}
                                repeatCount="indefinite"
                              />
                              <animate
                                attributeName="r"
                                from="2"
                                to="5"
                                dur={`${2 + i * 0.3}s`}
                                begin={`${i * 0.4}s`}
                                repeatCount="indefinite"
                              />
                            </circle>
                          ))}
                        </>
                      )}

                      {/* Water reducing effect */}
                      {!tank.isFilling && tank.outletValveStatus === 'OPEN' && (
                        <>
                          {/* Ripples when draining */}
                          <ellipse
                            cx="400"
                            cy={220 - (tank.tankLevel / 100) * 135}
                            rx="215"
                            ry="6"
                            fill="#0891b2"
                            opacity="0.3"
                          >
                            <animate
                              attributeName="ry"
                              values="6;9;6"
                              dur="1.8s"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="opacity"
                              values="0.3;0.5;0.3"
                              dur="1.8s"
                              repeatCount="indefinite"
                            />
                          </ellipse>
                        </>
                      )}

                      <text
                        x="400"
                        y={Math.max(100, 215 - (tank.tankLevel / 100) * 135)}
                        fontSize="32"
                        fill="#fff"
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        {(tank.tankLevel || 0).toFixed(0)}%
                      </text>
                      <rect
                        x="330"
                        y={Math.max(123, 238 - (tank.tankLevel / 100) * 135)}
                        width="140"
                        height="22"
                        fill="rgba(0,0,0,0.3)"
                        rx="4"
                      />
                      <text
                        x="400"
                        y={Math.max(138, 253 - (tank.tankLevel / 100) * 135)}
                        fontSize="16"
                        fill="#fff"
                        textAnchor="middle"
                        fontWeight="600"
                      >
                        {(tank.currentVolume || 0).toLocaleString()} L
                      </text>
                    </>
                  )}
                </g>
              </g>

              {/* Inlet Pipe from Left Side - PVC Style */}
              <g filter="url(#dropShadowTank)">
                {/* Horizontal inlet pipe from left */}
                <defs>
                  <linearGradient id="pvcPipeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="50%" stopColor="#64748b" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>
                </defs>
                <rect x="80" y="135" width="110" height="20" fill="url(#pvcPipeGradient)" rx="10" />
                <rect x="80" y="137" width="110" height="6" fill="rgba(255,255,255,0.3)" rx="3" />

                {/* Pipe connection flange */}
                <rect x="175" y="130" width="15" height="30" fill="#334155" rx="2" />
                <circle cx="182.5" cy="140" r="2" fill="#64748b" />
                <circle cx="182.5" cy="150" r="2" fill="#64748b" />

                {/* Valve on inlet pipe */}
                <rect x="120" y="128" width="35" height="34" fill="#52525b" rx="4" />
                <rect x="123" y="131" width="29" height="28" fill="#3f3f46" rx="3" />
                <circle
                  cx="137.5"
                  cy="145"
                  r="10"
                  fill={tank.inletValveStatus === 'OPEN' ? '#22c55e' : '#ef4444'}
                  stroke="#fff"
                  strokeWidth="2.5"
                />
                <circle cx="135" cy="142" r="3" fill="#fff" opacity="0.6" />
              </g>

              {/* Outlet Pipe from Center Bottom - PVC Style */}
              <g filter="url(#dropShadowTank)">
                {/* Vertical outlet pipe going down */}
                <rect x="390" y="220" width="20" height="80" fill="url(#pvcPipeGradient)" rx="10" />
                <rect x="392" y="220" width="6" height="80" fill="rgba(255,255,255,0.3)" rx="3" />

                {/* Pipe connection flange at tank */}
                <rect x="385" y="215" width="30" height="15" fill="#334155" rx="2" />
                <circle cx="395" cy="222.5" r="2" fill="#64748b" />
                <circle cx="405" cy="222.5" r="2" fill="#64748b" />

                {/* Valve on outlet pipe */}
                <rect x="383" y="250" width="34" height="35" fill="#52525b" rx="4" />
                <rect x="386" y="253" width="28" height="29" fill="#3f3f46" rx="3" />
                <circle
                  cx="400"
                  cy="267.5"
                  r="10"
                  fill={tank.outletValveStatus === 'OPEN' ? '#22c55e' : '#ef4444'}
                  stroke="#fff"
                  strokeWidth="2.5"
                />
                <circle cx="397" cy="264.5" r="3" fill="#fff" opacity="0.6" />
              </g>
            </svg>
          </div>

          {/* Pipelines Connected Directly (Below Tank) */}
          <div className="absolute top-[22rem] left-0 right-0 flex justify-center gap-4 px-8 z-10">
            {pipelines.map((pipeline, idx) => {
              const isOpen = pipeline.valveStatus === 'OPEN';
              const hasLeakage = pipeline.leakageProbability > 30;
              const inletFlow = pipeline.inlet?.flowSensor?.value || 0;
              const inletPressure = pipeline.inlet?.pressureSensor?.value || 0;
              const canFlow = isOpen && tank.outletValveStatus === 'OPEN';

              return (
                <div
                  key={pipeline.pipelineId}
                  className="flex flex-col items-center gap-2 relative"
                  style={{ width: '120px' }}
                >
                  {/* Pipeline Valve - Direct Control (No Redirect) */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleValve(pipeline.pipelineId);
                    }}
                    className={`relative w-12 h-12 rounded-full border-4 shadow-xl cursor-pointer transition-all hover:scale-110 z-30 ${
                      isOpen
                        ? 'bg-green-500 border-green-700 animate-pulse-subtle'
                        : 'bg-red-600 border-red-800'
                    }`}
                    title={`Valve ${pipeline.pipelineId}: ${isOpen ? 'OPEN' : 'CLOSED'} - Click to toggle`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <IconImage name="settings" alt="Valve" size={18} />
                    </div>
                    {/* Valve Handle (Rotates when open) */}
                    <div
                      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded transition-transform duration-300 ${
                        isOpen ? 'rotate-45' : 'rotate-0'
                      }`}
                    ></div>
                  </div>

                  {/* Enhanced 3D Main Pipeline with Extension and Bends */}
                  <div className="relative w-full" style={{ height: '280px' }}>
                    <svg
                      onClick={() =>
                        onNavigate && onNavigate(`pipeline-details-${pipeline.pipelineId}`)
                      }
                      className="absolute top-0 left-0 w-full h-full cursor-pointer hover:opacity-90 transition-all"
                      viewBox="0 0 120 280"
                      style={{ overflow: 'visible' }}
                    >
                      <defs>
                        <linearGradient id={`pipeGrad${idx}`} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgba(219, 234, 254, 0.3)" />
                          <stop offset="10%" stopColor="rgba(147, 197, 253, 0.4)" />
                          <stop offset="50%" stopColor="rgba(59, 130, 246, 0.5)" />
                          <stop offset="90%" stopColor="rgba(30, 64, 175, 0.4)" />
                          <stop offset="100%" stopColor="rgba(30, 58, 138, 0.3)" />
                        </linearGradient>
                      </defs>

                      {/* Main vertical pipe */}
                      <rect
                        x="54"
                        y="0"
                        width="12"
                        height="130"
                        fill={`url(#pipeGrad${idx})`}
                        stroke={hasLeakage ? '#ef4444' : isOpen ? '#22c55e' : '#1e3a8a'}
                        strokeWidth="2"
                        rx="4"
                        opacity="0.6"
                      />
                      <rect
                        x="56"
                        y="0"
                        width="4"
                        height="130"
                        fill="rgba(255,255,255,0.2)"
                        rx="2"
                      />

                      {/* Bend/Elbow joint based on ward position */}
                      {idx === 0 && (
                        <>
                          {/* Left bend - down then left */}
                          <path
                            d="M 60 130 L 60 160 Q 60 170, 50 170 L 10 170"
                            fill="none"
                            stroke={`url(#pipeGrad${idx})`}
                            strokeWidth="12"
                            strokeLinecap="round"
                            opacity="0.6"
                          />
                          <path
                            d="M 60 130 L 60 160 Q 60 170, 50 170 L 10 170"
                            fill="none"
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                        </>
                      )}
                      {idx === 1 && (
                        <>
                          {/* Left bend lower - down then left */}
                          <path
                            d="M 60 130 L 60 190 Q 60 200, 50 200 L 20 200"
                            fill="none"
                            stroke={`url(#pipeGrad${idx})`}
                            strokeWidth="12"
                            strokeLinecap="round"
                            opacity="0.6"
                          />
                          <path
                            d="M 60 130 L 60 190 Q 60 200, 50 200 L 20 200"
                            fill="none"
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                        </>
                      )}
                      {idx === 2 && (
                        <>
                          {/* Straight down to center bottom */}
                          <rect
                            x="54"
                            y="130"
                            width="12"
                            height="110"
                            fill={`url(#pipeGrad${idx})`}
                            stroke={hasLeakage ? '#ef4444' : isOpen ? '#22c55e' : '#1e3a8a'}
                            strokeWidth="2"
                            rx="4"
                            opacity="0.6"
                          />
                          <rect
                            x="56"
                            y="130"
                            width="4"
                            height="110"
                            fill="rgba(255,255,255,0.2)"
                            rx="2"
                          />
                        </>
                      )}
                      {idx === 3 && (
                        <>
                          {/* Right bend lower - down then right */}
                          <path
                            d="M 60 130 L 60 190 Q 60 200, 70 200 L 130 200"
                            fill="none"
                            stroke={`url(#pipeGrad${idx})`}
                            strokeWidth="12"
                            strokeLinecap="round"
                            opacity="0.6"
                          />
                          <path
                            d="M 60 130 L 60 190 Q 60 200, 70 200 L 130 200"
                            fill="none"
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                        </>
                      )}
                      {idx === 4 && (
                        <>
                          {/* Right bend with 2 bends - down, right, then down again to ward 5 */}
                          <path
                            d="M 60 130 L 60 150 Q 60 160, 70 160 L 145 160 Q 155 160, 155 170 L 155 220"
                            fill="none"
                            stroke={`url(#pipeGrad${idx})`}
                            strokeWidth="12"
                            strokeLinecap="round"
                            opacity="0.6"
                          />
                          <path
                            d="M 60 130 L 60 150 Q 60 160, 70 160 L 145 160 Q 155 160, 155 170 L 155 220"
                            fill="none"
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                        </>
                      )}

                      {/* Continuous water flow animation */}
                      {canFlow && (
                        <>
                          <defs>
                            <linearGradient
                              id={`waterFlow${idx}`}
                              x1="0%"
                              y1="0%"
                              x2="0%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0">
                                <animate
                                  attributeName="offset"
                                  values="0;1"
                                  dur="2s"
                                  repeatCount="indefinite"
                                />
                              </stop>
                              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8">
                                <animate
                                  attributeName="offset"
                                  values="0;1"
                                  dur="2s"
                                  repeatCount="indefinite"
                                />
                              </stop>
                              <stop offset="25%" stopColor="#22d3ee" stopOpacity="0.9">
                                <animate
                                  attributeName="offset"
                                  values="0.25;1.25"
                                  dur="2s"
                                  repeatCount="indefinite"
                                />
                              </stop>
                              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8">
                                <animate
                                  attributeName="offset"
                                  values="0.5;1.5"
                                  dur="2s"
                                  repeatCount="indefinite"
                                />
                              </stop>
                              <stop offset="75%" stopColor="#0891b2" stopOpacity="0.7">
                                <animate
                                  attributeName="offset"
                                  values="0.75;1.75"
                                  dur="2s"
                                  repeatCount="indefinite"
                                />
                              </stop>
                              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0">
                                <animate
                                  attributeName="offset"
                                  values="1;2"
                                  dur="2s"
                                  repeatCount="indefinite"
                                />
                              </stop>
                            </linearGradient>
                          </defs>

                          {/* Flowing water stream effect */}
                          {idx === 0 && (
                            <path
                              d="M 60 0 L 60 130 L 60 160 Q 60 170, 50 170 L 10 170"
                              fill="none"
                              stroke={`url(#waterFlow${idx})`}
                              strokeWidth="6"
                              strokeLinecap="round"
                              opacity="0.8"
                            />
                          )}
                          {idx === 1 && (
                            <path
                              d="M 60 0 L 60 130 L 60 190 Q 60 200, 50 200 L 20 200"
                              fill="none"
                              stroke={`url(#waterFlow${idx})`}
                              strokeWidth="6"
                              strokeLinecap="round"
                              opacity="0.8"
                            />
                          )}
                          {idx === 2 && (
                            <rect
                              x="57"
                              y="0"
                              width="6"
                              height="240"
                              fill={`url(#waterFlow${idx})`}
                              rx="3"
                              opacity="0.8"
                            />
                          )}
                          {idx === 3 && (
                            <path
                              d="M 60 0 L 60 130 L 60 190 Q 60 200, 70 200 L 130 200"
                              fill="none"
                              stroke={`url(#waterFlow${idx})`}
                              strokeWidth="6"
                              strokeLinecap="round"
                              opacity="0.8"
                            />
                          )}
                          {idx === 4 && (
                            <path
                              d="M 60 0 L 60 130 L 60 150 Q 60 160, 70 160 L 145 160 Q 155 160, 155 170 L 155 220"
                              fill="none"
                              stroke={`url(#waterFlow${idx})`}
                              strokeWidth="6"
                              strokeLinecap="round"
                              opacity="0.8"
                            />
                          )}
                        </>
                      )}

                      {/* Pressure sensor */}
                      <circle
                        cx="60"
                        cy="110"
                        r="8"
                        fill="radial-gradient(circle, #6ee7b7, #10b981)"
                        stroke="#059669"
                        strokeWidth="2"
                      />

                      {/* Leakage indicator */}
                      {hasLeakage && (
                        <circle cx="68" cy="70" r="4" fill="#ef4444" opacity="0.8">
                          <animate
                            attributeName="opacity"
                            values="0.8;0.3;0.8"
                            dur="1s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}

                      {/* Pipeline label */}
                      <text
                        x="60"
                        y="65"
                        fontSize="12"
                        fill="#fff"
                        textAnchor="middle"
                        fontWeight="bold"
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                      >
                        P{pipeline.pipelineId}
                      </text>
                      <text
                        x="60"
                        y="80"
                        fontSize="8"
                        fill="#fff"
                        textAnchor="middle"
                        fontWeight="600"
                      >
                        {inletFlow} L/min
                      </text>
                      <text
                        x="60"
                        y="92"
                        fontSize="8"
                        fill="#fff"
                        textAnchor="middle"
                        fontWeight="600"
                      >
                        {inletPressure.toFixed(1)} bar
                      </text>
                    </svg>
                  </div>

                  {/* Rural Village with Realistic 3D House */}
                  <div
                    className="absolute w-28 h-28 rounded-lg overflow-visible shadow-2xl"
                    style={{
                      left:
                        idx === 0
                          ? '-60px'
                          : idx === 1
                            ? '-30px'
                            : idx === 2
                              ? '50%'
                              : idx === 3
                                ? 'calc(100% + 10px)'
                                : 'calc(100% + 80px)',
                      top:
                        idx === 0
                          ? '160px'
                          : idx === 1
                            ? '220px'
                            : idx === 2
                              ? '250px'
                              : idx === 3
                                ? '220px'
                                : '200px',
                      transform: idx === 2 ? 'translateX(-50%)' : 'none',
                      filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.4))',
                    }}
                  >
                    <svg viewBox="0 0 120 100" className="w-full h-full">
                      <defs>
                        <linearGradient id={`groundGrad${idx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#86efac" />
                          <stop offset="50%" stopColor="#4ade80" />
                          <stop offset="100%" stopColor="#22c55e" />
                        </linearGradient>
                        <linearGradient id={`skyGrad${idx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#7dd3fc" />
                          <stop offset="100%" stopColor="#bae6fd" />
                        </linearGradient>
                        <radialGradient id={`sunGrad${idx}`}>
                          <stop offset="0%" stopColor="#fef08a" />
                          <stop offset="100%" stopColor="#fde047" />
                        </radialGradient>
                      </defs>

                      {/* Sky background */}
                      <rect x="0" y="0" width="120" height="70" fill={`url(#skyGrad${idx})`} />

                      {/* Sun */}
                      <circle cx="100" cy="15" r="8" fill={`url(#sunGrad${idx})`} opacity="0.9" />

                      {/* Mountains background */}
                      <path
                        d="M 0 60 L 30 35 L 50 50 L 70 30 L 90 45 L 120 40 L 120 70 L 0 70 Z"
                        fill="#94a3b8"
                        opacity="0.6"
                      />
                      <path
                        d="M 0 65 L 25 45 L 45 55 L 65 40 L 85 50 L 120 48 L 120 70 L 0 70 Z"
                        fill="#64748b"
                        opacity="0.5"
                      />

                      {/* Ground with gradient */}
                      <rect x="0" y="70" width="120" height="30" fill={`url(#groundGrad${idx})`} />

                      {/* Dirt path */}
                      <path
                        d="M 0 85 Q 30 83, 60 85 Q 90 87, 120 85 L 120 88 Q 90 90, 60 88 Q 30 86, 0 88 Z"
                        fill="#92400e"
                        opacity="0.7"
                      />

                      {/* Back house (smaller, for depth) */}
                      <g opacity="0.75">
                        <rect
                          x="8"
                          y="55"
                          width="22"
                          height="18"
                          fill="#f59e0b"
                          stroke="#92400e"
                          strokeWidth="0.8"
                        />
                        <path
                          d="M 5 55 L 19 45 L 33 55 Z"
                          fill="#dc2626"
                          stroke="#7f1d1d"
                          strokeWidth="0.8"
                        />
                        <rect x="13" y="60" width="5" height="8" fill="#78350f" />
                        <rect
                          x="21"
                          y="60"
                          width="4"
                          height="4"
                          fill="#93c5fd"
                          stroke="#1e3a8a"
                          strokeWidth="0.5"
                        />
                      </g>

                      {/* Trees on left */}
                      <g>
                        <rect x="38" y="60" width="3" height="12" fill="#78350f" />
                        <ellipse cx="39.5" cy="58" rx="5" ry="7" fill="#15803d" />
                        <ellipse cx="37" cy="56" rx="4" ry="5" fill="#16a34a" />
                        <ellipse cx="42" cy="56" rx="4" ry="5" fill="#16a34a" />
                      </g>

                      {/* Main house - 3D effect */}
                      <g>
                        {/* Shadow */}
                        <ellipse cx="72" cy="93" rx="28" ry="5" fill="#000" opacity="0.25" />

                        {/* House front wall */}
                        <rect
                          x="55"
                          y="50"
                          width="34"
                          height="25"
                          fill="#fbbf24"
                          stroke="#92400e"
                          strokeWidth="1.5"
                        />

                        {/* House side wall (3D) */}
                        <path
                          d="M 89 50 L 89 75 L 97 70 L 97 45 Z"
                          fill="#f59e0b"
                          stroke="#92400e"
                          strokeWidth="1.5"
                        />

                        {/* Roof front */}
                        <path
                          d="M 50 50 L 72 32 L 94 50 Z"
                          fill="#dc2626"
                          stroke="#7f1d1d"
                          strokeWidth="1.5"
                        />

                        {/* Roof side (3D) */}
                        <path
                          d="M 94 50 L 72 32 L 80 27 L 102 45 Z"
                          fill="#b91c1c"
                          stroke="#7f1d1d"
                          strokeWidth="1.5"
                        />

                        {/* Roof ridge highlight */}
                        <line
                          x1="72"
                          y1="32"
                          x2="80"
                          y2="27"
                          stroke="#ef4444"
                          strokeWidth="1"
                          opacity="0.6"
                        />

                        {/* Door with frame */}
                        <rect
                          x="64"
                          y="58"
                          width="12"
                          height="17"
                          fill="#78350f"
                          stroke="#451a03"
                          strokeWidth="1.5"
                          rx="1"
                        />
                        <rect x="64" y="58" width="2" height="17" fill="#92400e" />
                        <circle cx="73" cy="67" r="1" fill="#fbbf24" />

                        {/* Windows with 3D frames */}
                        <g>
                          <rect
                            x="57"
                            y="54"
                            width="8"
                            height="8"
                            fill="#60a5fa"
                            stroke="#1e3a8a"
                            strokeWidth="1.2"
                          />
                          <line x1="57" y1="58" x2="65" y2="58" stroke="#1e3a8a" strokeWidth="1" />
                          <line x1="61" y1="54" x2="61" y2="62" stroke="#1e3a8a" strokeWidth="1" />
                          <rect x="58" y="55" width="2" height="2" fill="#dbeafe" opacity="0.7" />
                        </g>

                        <g>
                          <rect
                            x="79"
                            y="54"
                            width="8"
                            height="8"
                            fill="#60a5fa"
                            stroke="#1e3a8a"
                            strokeWidth="1.2"
                          />
                          <line x1="79" y1="58" x2="87" y2="58" stroke="#1e3a8a" strokeWidth="1" />
                          <line x1="83" y1="54" x2="83" y2="62" stroke="#1e3a8a" strokeWidth="1" />
                          <rect x="80" y="55" width="2" height="2" fill="#dbeafe" opacity="0.7" />
                        </g>

                        {/* Side window */}
                        <rect
                          x="91"
                          y="54"
                          width="4"
                          height="6"
                          fill="#60a5fa"
                          stroke="#1e3a8a"
                          strokeWidth="0.8"
                        />
                      </g>

                      {/* Trees on right */}
                      <g>
                        <rect x="103" y="58" width="4" height="14" fill="#78350f" />
                        <ellipse cx="105" cy="56" rx="6" ry="8" fill="#15803d" />
                        <ellipse cx="102" cy="53" rx="5" ry="6" fill="#16a34a" />
                        <ellipse cx="108" cy="53" rx="5" ry="6" fill="#16a34a" />
                        <ellipse cx="105" cy="50" rx="4" ry="5" fill="#22c55e" />
                      </g>

                      {/* Small bushes */}
                      <ellipse cx="48" cy="73" rx="4" ry="3" fill="#15803d" />
                      <ellipse cx="52" cy="74" rx="3" ry="2.5" fill="#16a34a" />
                      <ellipse cx="98" cy="72" rx="3.5" ry="3" fill="#15803d" />
                    </svg>

                    {/* Ward label */}
                    <div className="absolute -bottom-6 left-0 right-0 text-center bg-amber-700 text-white text-[10px] font-bold py-0.5 rounded shadow">
                      Ward {pipeline.pipelineId}
                    </div>

                    {/* Connection indicator */}
                    {canFlow && (
                      <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-white shadow-lg"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend - Positioned below the system container */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs pt-3 pb-3 border-t-2 border-slate-400 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-lg mt-4">
        <span className="flex items-center gap-2 text-slate-700 font-semibold">
          <span className="w-4 h-4 rounded-full bg-green-500 border-2 border-green-700"></span>{' '}
          Valve Open / Flow Active
        </span>
        <span className="flex items-center gap-2 text-slate-700 font-semibold">
          <span className="w-4 h-4 rounded-full bg-red-500 border-2 border-red-700"></span> Valve
          Closed / Flow Stopped
        </span>
        <span className="flex items-center gap-2 text-slate-700 font-semibold">
          <span className="w-4 h-4 rounded-full bg-amber-500 border-2 border-amber-700 animate-pulse"></span>{' '}
          Leakage Alert
        </span>
        <span className="text-slate-600 italic font-semibold">
          💡 Click any component for detailed view & control
        </span>
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
          <p className="text-[10px] sm:text-xs md:text-base text-green-600 font-bold">
            Open Pipelines
          </p>
          <p className="text-sm sm:text-2xl md:text-2xl font-black text-green-700">
            {pipelines.filter((p) => p.valveStatus === 'OPEN').length} / 5
          </p>
        </div>
        <div className="p-2 sm:p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-[10px] sm:text-xs md:text-base text-amber-600 font-bold">
            Avg Pressure
          </p>
          <p className="text-sm sm:text-2xl md:text-2xl font-black text-amber-700">
            {(pump.pumpPressureOutput || 0).toFixed(1)} bar
          </p>
        </div>
        <div className="p-2 sm:p-4 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-[10px] sm:text-xs md:text-base text-purple-600 font-bold">
            System Efficiency
          </p>
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
