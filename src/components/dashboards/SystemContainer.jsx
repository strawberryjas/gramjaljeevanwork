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

            {/* Pump Control Buttons */}
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isPumpOn) togglePump();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg ${
                  isPumpOn
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-700 hover:bg-green-500 hover:text-white'
                }`}
              >
                ON
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isPumpOn) togglePump();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg ${
                  !isPumpOn
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-300 text-gray-700 hover:bg-red-500 hover:text-white'
                }`}
              >
                OFF
              </button>
            </div>
          </div>

          {/* Water Tank - Center (Realistic Side View with Details) */}
          <div
            className="absolute top-2 left-1/2 transform -translate-x-1/2 transition-transform group z-10"
            style={{ width: '500px', pointerEvents: 'none' }}
          >
            <svg
              viewBox="0 0 800 700"
              className="w-full h-auto"
              style={{ maxHeight: '480px', filter: 'drop-shadow(0 10px 22px rgba(0,0,0,0.4))', pointerEvents: 'none' }}
            >
              <g transform="scale(0.75) translate(75, 65)">
                {/* Clickable overlay for tank navigation */}
                <rect
                  x="220"
                  y="-65"
                  width="360"
                  height="200"
                  fill="transparent"
                  style={{ cursor: 'pointer', pointerEvents: 'all' }}
                  onClick={() => onNavigate && onNavigate('water-tank')}
                />
                  <defs>
                    {/* Dirty shaded yellow gradient for support columns */}
                    <linearGradient id="concreteGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#92722c" />
                      <stop offset="30%" stopColor="#b8923e" />
                      <stop offset="70%" stopColor="#a07f38" />
                      <stop offset="100%" stopColor="#7a5e28" />
                    </linearGradient>

                    {/* Tank body gradient - light yellow with dirt */}
                    <linearGradient id="tankMetalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.4" />
                      <stop offset="30%" stopColor="#fde68a" stopOpacity="0.35" />
                      <stop offset="70%" stopColor="#d4a574" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.45" />
                    </linearGradient>

                    {/* Water gradient */}
                    <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
                      <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#0891b2" stopOpacity="1.0" />
                    </linearGradient>

                    {/* Pipe gradient */}
                    <linearGradient id="blueMetalPipe" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1e40af" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1e40af" />
                    </linearGradient>

                    {/* Clip path for water in tank */}
                    <clipPath id="waterClip">
                      <rect x="220" y="-40" width="360" height="170" rx="3" />
                    </clipPath>
                  </defs>

                  {/* Ground level */}
                  <rect x="100" y="650" width="600" height="10" fill="#6b7280" opacity="0.8" />

                  {/* Four Support Columns (tall, slender) */}
                  <g id="supportColumns">
                    {/* Left front column */}
                    <rect
                      x="215"
                      y="165"
                      width="25"
                      height="485"
                      fill="url(#concreteGradient)"
                      stroke="#6b7280"
                      strokeWidth="2"
                    />
                    <rect x="217" y="165" width="3" height="485" fill="#c4a858" opacity="0.6" />

                    {/* Left back column */}
                    <rect
                      x="280"
                      y="165"
                      width="25"
                      height="485"
                      fill="url(#concreteGradient)"
                      stroke="#6b7280"
                      strokeWidth="2"
                    />
                    <rect x="282" y="165" width="3" height="485" fill="#c4a858" opacity="0.6" />

                    {/* Right back column */}
                    <rect
                      x="495"
                      y="165"
                      width="25"
                      height="485"
                      fill="url(#concreteGradient)"
                      stroke="#6b7280"
                      strokeWidth="2"
                    />
                    <rect x="497" y="165" width="3" height="485" fill="#c4a858" opacity="0.6" />

                    {/* Right front column */}
                    <rect
                      x="560"
                      y="165"
                      width="25"
                      height="485"
                      fill="url(#concreteGradient)"
                      stroke="#6b7280"
                      strokeWidth="2"
                    />
                    <rect x="562" y="165" width="3" height="485" fill="#c4a858" opacity="0.6" />
                  </g>

                  {/* Horizontal Support Beams */}
                  <g id="supportBeams">
                    {/* Bottom beams (near ground) */}
                    <rect
                      x="215"
                      y="630"
                      width="370"
                      height="20"
                      fill="url(#concreteGradient)"
                      stroke="#6b7280"
                      strokeWidth="2"
                    />

                    {/* Mid-section beams */}
                    <rect
                      x="215"
                      y="420"
                      width="370"
                      height="20"
                      fill="url(#concreteGradient)"
                      stroke="#6b7280"
                      strokeWidth="2"
                    />

                    {/* Top beams (just below tank) */}
                    <rect
                      x="215"
                      y="145"
                      width="370"
                      height="20"
                      fill="url(#concreteGradient)"
                      stroke="#6b7280"
                      strokeWidth="2"
                    />
                  </g>





                  {/* Vertical Inlet/Outlet Pipes (running along column) */}
                  <g id="verticalPipes">
                    {/* Main pipe from ground to tank */}
                    <rect
                      x="390"
                      y="165"
                      width="20"
                      height="485"
                      fill="url(#blueMetalPipe)"
                      rx="2"
                    />
                    <rect x="392" y="165" width="3" height="485" fill="#60a5fa" opacity="0.6" />

                    {/* Pipe joints/flanges */}
                    <rect x="385" y="630" width="30" height="12" fill="#1e3a8a" rx="2" />
                    <rect x="385" y="420" width="30" height="12" fill="#1e3a8a" rx="2" />
                    <rect x="385" y="165" width="30" height="12" fill="#1e3a8a" rx="2" />
                  </g>

                  {/* Cylindrical Water Tank (true side view) */}
                  <g id="waterTank" opacity="0.95">
                    {/* Tank bottom - straight line */}
                    <line x1="220" y1="135" x2="580" y2="135" stroke="#ca8a04" strokeWidth="3" />

                    {/* Tank body (cylindrical sides) */}
                    <rect
                      x="220"
                      y="-40"
                      width="360"
                      height="170"
                      fill="url(#tankMetalGradient)"
                      stroke="#ca8a04"
                      strokeWidth="3"
                    />

                    {/* Tank flat top */}
                    <line x1="220" y1="-40" x2="580" y2="-40" stroke="#ca8a04" strokeWidth="3" />

                    {/* Left edge highlight */}
                    <line x1="220" y1="-40" x2="220" y2="130" stroke="#fef3c7" strokeWidth="2" />

                    {/* Right edge shadow */}
                    <line x1="580" y1="-40" x2="580" y2="130" stroke="#92400e" strokeWidth="2" />

                    {/* Clickable overlay for tank navigation */}
                    <rect
                      x="220"
                      y="-65"
                      width="360"
                      height="200"
                      fill="transparent"
                      style={{ cursor: 'pointer', pointerEvents: 'all' }}
                      onClick={() => onNavigate && onNavigate('water-tank')}
                    />

                    {/* Small hatch/door */}
                    <rect
                      x="500"
                      y="75"
                      width="40"
                      height="45"
                      fill="#6b7280"
                      stroke="#4b5563"
                      strokeWidth="2"
                      rx="2"
                    />
                    <circle cx="532" cy="97" r="3" fill="#374151" />
                  </g>

                  {/* Tank Platform (walkway around tank) - Moved in front of tank */}
                  <g id="tankPlatform">
                    <rect
                      x="205"
                      y="140"
                      width="390"
                      height="25"
                      fill="url(#concreteGradient)"
                      stroke="#6b7280"
                      strokeWidth="2"
                    />

                    {/* Platform railing */}
                    <line x1="205" y1="140" x2="595" y2="140" stroke="#000000" strokeWidth="3" />
                    {/* Vertical rail posts */}
                    {[225, 285, 345, 405, 465, 525, 575].map((x, i) => (
                      <line
                        key={i}
                        x1={x}
                        y1="130"
                        x2={x}
                        y2="140"
                        stroke="#000000"
                        strokeWidth="2"
                      />
                    ))}
                    {/* Top rail */}
                    <line x1="205" y1="130" x2="595" y2="130" stroke="#000000" strokeWidth="3" />
                    
                    {/* End caps to close grills */}
                    <line x1="205" y1="130" x2="205" y2="140" stroke="#000000" strokeWidth="3" />
                    <line x1="595" y1="130" x2="595" y2="140" stroke="#000000" strokeWidth="3" />
                  </g>

                  {/* Water Level (animated) */}
                  <g clipPath="url(#waterClip)">
                    {tank.tankLevel > 0 && (
                      <>
                        {/* Main Water Body */}
                        <rect
                          x="220"
                          y={-40 + 170 * (1 - tank.tankLevel / 100)}
                          width="360"
                          height={170 * (tank.tankLevel / 100)}
                          fill="url(#waterGradient)"
                          className="transition-all duration-1000 ease-in-out"
                        />

                        {/* Water surface with realistic wave animation */}
                        <path
                          d={`M 220 ${-40 + 170 * (1 - tank.tankLevel / 100)} 
                              Q 280 ${-40 + 170 * (1 - tank.tankLevel / 100) - 3}, 340 ${-40 + 170 * (1 - tank.tankLevel / 100)} 
                              T 460 ${-40 + 170 * (1 - tank.tankLevel / 100)} 
                              T 580 ${-40 + 170 * (1 - tank.tankLevel / 100)} 
                              L 580 ${-40 + 170 * (1 - tank.tankLevel / 100) + 5} 
                              L 220 ${-40 + 170 * (1 - tank.tankLevel / 100) + 5} Z`}
                          fill="#22d3ee"
                          opacity="0.6"
                          className="transition-all duration-1000 ease-in-out"
                        >
                          <animate
                            attributeName="d"
                            values={`M 220 ${-40 + 170 * (1 - tank.tankLevel / 100)} 
                                     Q 280 ${-40 + 170 * (1 - tank.tankLevel / 100) - 3}, 340 ${-40 + 170 * (1 - tank.tankLevel / 100)} 
                                     T 460 ${-40 + 170 * (1 - tank.tankLevel / 100)} 
                                     T 580 ${-40 + 170 * (1 - tank.tankLevel / 100)} 
                                     L 580 ${-40 + 170 * (1 - tank.tankLevel / 100) + 5} 
                                     L 220 ${-40 + 170 * (1 - tank.tankLevel / 100) + 5} Z;
                                   M 220 ${-40 + 170 * (1 - tank.tankLevel / 100)} 
                                     Q 280 ${-40 + 170 * (1 - tank.tankLevel / 100) + 3}, 340 ${-40 + 170 * (1 - tank.tankLevel / 100)} 
                                     T 460 ${-40 + 170 * (1 - tank.tankLevel / 100)} 
                                     T 580 ${-40 + 170 * (1 - tank.tankLevel / 100)} 
                                     L 580 ${-40 + 170 * (1 - tank.tankLevel / 100) + 5} 
                                     L 220 ${-40 + 170 * (1 - tank.tankLevel / 100) + 5} Z;
                                   M 220 ${-40 + 170 * (1 - tank.tankLevel / 100)} 
                                     Q 280 ${-40 + 170 * (1 - tank.tankLevel / 100) - 3}, 340 ${-40 + 170 * (1 - tank.tankLevel / 100)} 
                                     T 460 ${-40 + 170 * (1 - tank.tankLevel / 100)} 
                                     T 580 ${-40 + 170 * (1 - tank.tankLevel / 100)} 
                                     L 580 ${-40 + 170 * (1 - tank.tankLevel / 100) + 5} 
                                     L 220 ${-40 + 170 * (1 - tank.tankLevel / 100) + 5} Z`}
                            dur="3s"
                            repeatCount="indefinite"
                          />
                        </path>

                        {/* Water surface shimmer with gentle motion */}
                        <ellipse
                          cx="400"
                          cy={-40 + 170 * (1 - tank.tankLevel / 100)}
                          rx="178"
                          ry="4"
                          fill="#ffffff"
                          opacity="0.5"
                          className="transition-all duration-1000 ease-in-out"
                        >
                          <animate
                            attributeName="ry"
                            values="4;8;4"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.5;0.7;0.5"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </ellipse>

                        {/* Realistic water turbulence when filling */}
                        {tank.isFilling && (
                          <>
                            {/* Splash effect at inlet */}
                            <circle cx="535" cy={-40 + 170 * (1 - tank.tankLevel / 100) + 10} r="4" fill="#ffffff" opacity="0.7">
                              <animate
                                attributeName="r"
                                values="4;8;4"
                                dur="0.8s"
                                repeatCount="indefinite"
                              />
                              <animate
                                attributeName="opacity"
                                values="0.7;0.3;0.7"
                                dur="0.8s"
                                repeatCount="indefinite"
                              />
                            </circle>
                            
                            {/* Rising bubbles - more natural paths */}
                            <circle cx="260" cy="110" r="2.5" fill="#ffffff" opacity="0.7">
                              <animate
                                attributeName="cy"
                                values={`130;${-40 + 170 * (1 - tank.tankLevel / 100)};130`}
                                dur="4s"
                                repeatCount="indefinite"
                              />
                              <animate
                                attributeName="opacity"
                                values="0;0.7;0"
                                dur="4s"
                                repeatCount="indefinite"
                              />
                            </circle>
                            <circle cx="320" cy="100" r="3" fill="#ffffff" opacity="0.6">
                              <animate
                                attributeName="cy"
                                values={`130;${-40 + 170 * (1 - tank.tankLevel / 100)};130`}
                                dur="3.5s"
                                repeatCount="indefinite"
                              />
                              <animate
                                attributeName="opacity"
                                values="0;0.6;0"
                                dur="3.5s"
                                repeatCount="indefinite"
                              />
                            </circle>
                            <circle cx="380" cy="105" r="2" fill="#ffffff" opacity="0.7">
                              <animate
                                attributeName="cy"
                                values={`130;${-40 + 170 * (1 - tank.tankLevel / 100)};130`}
                                dur="4.2s"
                                repeatCount="indefinite"
                              />
                              <animate
                                attributeName="opacity"
                                values="0;0.7;0"
                                dur="4.2s"
                                repeatCount="indefinite"
                              />
                            </circle>
                            <circle cx="440" cy="115" r="3.5" fill="#ffffff" opacity="0.5">
                              <animate
                                attributeName="cy"
                                values={`130;${-40 + 170 * (1 - tank.tankLevel / 100)};130`}
                                dur="3.8s"
                                repeatCount="indefinite"
                              />
                              <animate
                                attributeName="opacity"
                                values="0;0.5;0"
                                dur="3.8s"
                                repeatCount="indefinite"
                              />
                            </circle>
                            <circle cx="500" cy="108" r="2.5" fill="#ffffff" opacity="0.6">
                              <animate
                                attributeName="cy"
                                values={`130;${-40 + 170 * (1 - tank.tankLevel / 100)};130`}
                                dur="4.5s"
                                repeatCount="indefinite"
                              />
                              <animate
                                attributeName="opacity"
                                values="0;0.6;0"
                                dur="4.5s"
                                repeatCount="indefinite"
                              />
                            </circle>
                            <circle cx="550" cy="120" r="2" fill="#ffffff" opacity="0.7">
                              <animate
                                attributeName="cy"
                                values={`130;${-40 + 170 * (1 - tank.tankLevel / 100)};130`}
                                dur="3.3s"
                                repeatCount="indefinite"
                              />
                              <animate
                                attributeName="opacity"
                                values="0;0.7;0"
                                dur="3.3s"
                                repeatCount="indefinite"
                              />
                            </circle>
                          </>
                        )}
                        
                        {/* Water draining effect when emptying */}
                        {!tank.isFilling && tank.tankLevel < 50 && (
                          <>
                            {/* Swirling effect near drain */}
                            <ellipse cx="400" cy={-40 + 170 * (1 - tank.tankLevel / 100) + 160} rx="30" ry="8" fill="#0891b2" opacity="0.4">
                              <animateTransform
                                attributeName="transform"
                                type="rotate"
                                from="0 400 130"
                                to="360 400 130"
                                dur="2s"
                                repeatCount="indefinite"
                              />
                            </ellipse>
                          </>
                        )}
                      </>
                    )}
                  </g>

                  {/* Flat Tank Top with Safety Grills - Side View */}
                  <g id="tankRoof">
                    {/* Flat roof top line */}
                    <rect
                      x="220"
                      y="-45"
                      width="360"
                      height="5"
                      fill="#fde68a"
                      stroke="#ca8a04"
                      strokeWidth="2"
                    />

                    {/* Safety grill bars on top */}
                    {[240, 260, 280, 300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500, 520, 540, 560].map((x, i) => (
                      <line
                        key={i}
                        x1={x}
                        y1="-65"
                        x2={x}
                        y2="-40"
                        stroke="#000000"
                        strokeWidth="2"
                      />
                    ))}
                    
                    {/* Side rails */}
                    <line x1="220" y1="-45" x2="580" y2="-45" stroke="#000000" strokeWidth="3" />
                    <line x1="220" y1="-65" x2="580" y2="-65" stroke="#000000" strokeWidth="3" />
                    
                    {/* End caps to close grills */}
                    <line x1="220" y1="-65" x2="220" y2="-40" stroke="#000000" strokeWidth="3" />
                    <line x1="580" y1="-65" x2="580" y2="-40" stroke="#000000" strokeWidth="3" />
                  </g>

                  {/* Pipe connection to tank */}
                  <g id="tankPipeConnection">
                    {/* Left vertical pipe (stand) from tank head to ground */}
                    <rect
                      x="180"
                      y="-40"
                      width="15"
                      height="690"
                      fill="url(#blueMetalPipe)"
                      rx="2"
                    />
                    <rect x="182" y="-38" width="3" height="686" fill="#60a5fa" opacity="0.6" />
                    
                    {/* Center-left vertical pipe (stand) */}
                    <rect
                      x="328"
                      y="180"
                      width="15"
                      height="470"
                      fill="url(#blueMetalPipe)"
                      rx="2"
                    />
                    <rect x="330" y="182" width="3" height="466" fill="#60a5fa" opacity="0.6" />
                    
                    {/* Left horizontal pipe from vertical pipe to tank head */}
                    <rect
                      x="180"
                      y="-47"
                      width="45"
                      height="15"
                      fill="url(#blueMetalPipe)"
                      rx="2"
                    />
                    <rect x="182" y="-45" width="3" height="11" fill="#60a5fa" opacity="0.6" />
                    
                    {/* Center-left horizontal pipe */}
                    <rect
                      x="320"
                      y="165"
                      width="30"
                      height="15"
                      fill="url(#blueMetalPipe)"
                      rx="2"
                    />
                    <rect x="322" y="167" width="3" height="11" fill="#60a5fa" opacity="0.6" />
                  </g>

                  {/* Water Level Display Overlay */}
                  {tank.tankLevel > 0 && (
                    <g id="waterLevelDisplay">
                      {/* Percentage display - positioned based on water level to avoid collision */}
                      <text
                        x="400"
                        y={Math.max(-20, -35 + 170 * (1 - tank.tankLevel / 100) - 15)}
                        fontSize="36"
                        fill="#0891b2"
                        textAnchor="middle"
                        fontWeight="bold"
                        stroke="#ffffff"
                        strokeWidth="3"
                        paintOrder="stroke"
                      >
                        {(tank.tankLevel || 0).toFixed(0)}%
                      </text>
                    </g>
                  )}
              </g>
            </svg>
          </div>

          {/* Volume Indicator - Separate from Tank */}
          <div className="absolute top-8 right-8 z-20">
            <svg width="100" height="300" viewBox="0 0 100 300">
              <defs>
                <linearGradient id="volumeWaterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="1.0" />
                </linearGradient>
              </defs>
              
              {/* Title */}
              <text x="50" y="15" fontSize="12" fill="#0f172a" textAnchor="middle" fontWeight="bold">
                Tank Volume
              </text>
              
              {/* Outer container box with color-coded border */}
              <rect
                x="10"
                y="30"
                width="80"
                height="220"
                fill="#f8fafc"
                stroke={tank.tankLevel > 60 ? "#22c55e" : tank.tankLevel > 30 ? "#eab308" : "#ef4444"}
                strokeWidth="3"
                rx="8"
                className="transition-all duration-1000 ease-in-out"
              />
              
              {/* Color gradients based on tank level */}
              <defs>
                <linearGradient id="volumeWaterGreen" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#86efac" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#22c55e" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity="1.0" />
                </linearGradient>
                <linearGradient id="volumeWaterYellow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fde047" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#eab308" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#ca8a04" stopOpacity="1.0" />
                </linearGradient>
                <linearGradient id="volumeWaterRed" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#ef4444" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity="1.0" />
                </linearGradient>
              </defs>
              
              {/* Water fill - animated based on tank level with color coding */}
              <rect
                x="15"
                y={30 + 210 * (1 - tank.tankLevel / 100)}
                width="70"
                height={210 * (tank.tankLevel / 100)}
                fill={tank.tankLevel > 60 ? "url(#volumeWaterGreen)" : tank.tankLevel > 30 ? "url(#volumeWaterYellow)" : "url(#volumeWaterRed)"}
                rx="5"
                className="transition-all duration-1000 ease-in-out"
              >
                {tank.isFilling && (
                  <animate
                    attributeName="y"
                    from={30 + 210}
                    to={30 + 210 * (1 - tank.tankLevel / 100)}
                    dur="1s"
                    fill="freeze"
                  />
                )}
              </rect>
              
              {/* Water shimmer effect with color matching */}
              <rect
                x="15"
                y={30 + 210 * (1 - tank.tankLevel / 100)}
                width="70"
                height="20"
                fill={tank.tankLevel > 60 ? "#86efac" : tank.tankLevel > 30 ? "#fde047" : "#fca5a5"}
                opacity="0.5"
                rx="5"
                className="transition-all duration-1000 ease-in-out"
              >
                <animate
                  attributeName="opacity"
                  values="0.3;0.7;0.3"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </rect>
              
              {/* Draining wave effect */}
              {!tank.isFilling && tank.tankLevel < 50 && (
                <path
                  d={`M 15 ${30 + 210 * (1 - tank.tankLevel / 100)} Q 35 ${30 + 210 * (1 - tank.tankLevel / 100) - 3}, 55 ${30 + 210 * (1 - tank.tankLevel / 100)} T 85 ${30 + 210 * (1 - tank.tankLevel / 100)} L 85 ${30 + 210 * (1 - tank.tankLevel / 100) + 10} L 15 ${30 + 210 * (1 - tank.tankLevel / 100) + 10} Z`}
                  fill={tank.tankLevel > 30 ? "#eab308" : "#ef4444"}
                  opacity="0.4"
                >
                  <animate
                    attributeName="d"
                    values={`M 15 ${30 + 210 * (1 - tank.tankLevel / 100)} Q 35 ${30 + 210 * (1 - tank.tankLevel / 100) - 3}, 55 ${30 + 210 * (1 - tank.tankLevel / 100)} T 85 ${30 + 210 * (1 - tank.tankLevel / 100)} L 85 ${30 + 210 * (1 - tank.tankLevel / 100) + 10} L 15 ${30 + 210 * (1 - tank.tankLevel / 100) + 10} Z;
                            M 15 ${30 + 210 * (1 - tank.tankLevel / 100)} Q 35 ${30 + 210 * (1 - tank.tankLevel / 100) + 3}, 55 ${30 + 210 * (1 - tank.tankLevel / 100)} T 85 ${30 + 210 * (1 - tank.tankLevel / 100)} L 85 ${30 + 210 * (1 - tank.tankLevel / 100) + 10} L 15 ${30 + 210 * (1 - tank.tankLevel / 100) + 10} Z;
                            M 15 ${30 + 210 * (1 - tank.tankLevel / 100)} Q 35 ${30 + 210 * (1 - tank.tankLevel / 100) - 3}, 55 ${30 + 210 * (1 - tank.tankLevel / 100)} T 85 ${30 + 210 * (1 - tank.tankLevel / 100)} L 85 ${30 + 210 * (1 - tank.tankLevel / 100) + 10} L 15 ${30 + 210 * (1 - tank.tankLevel / 100) + 10} Z`}
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </path>
              )}
              
              {/* Percentage display in center */}
              <text
                x="50"
                y={40 + 210 * (1 - tank.tankLevel / 100) - 15}
                fontSize="24"
                fill="#0f172a"
                textAnchor="middle"
                fontWeight="bold"
                stroke="#ffffff"
                strokeWidth="2"
                paintOrder="stroke"
              >
                {(tank.tankLevel || 0).toFixed(0)}%
              </text>
              
              {/* Volume text display */}
              <text
                x="50"
                y="270"
                fontSize="14"
                fill="#0f172a"
                textAnchor="middle"
                fontWeight="bold"
              >
                {(tank.currentVolume || 0).toLocaleString()} L
              </text>
              <text
                x="50"
                y="285"
                fontSize="10"
                fill="#475569"
                textAnchor="middle"
                fontWeight="600"
              >
                of {(tank.tankCapacity || 10000).toLocaleString()} L
              </text>
              
              {/* Bubbles animation when filling */}
              {tank.isFilling && (
                <>
                  {[20, 35, 50, 65].map((offset, i) => (
                    <circle
                      key={i}
                      cx={20 + offset}
                      cy="230"
                      r="3"
                      fill="#ffffff"
                      opacity="0.7"
                    >
                      <animate
                        attributeName="cy"
                        values={`230;${30 + 210 * (1 - tank.tankLevel / 100)};230`}
                        dur={`${2 + i * 0.3}s`}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;0.7;0"
                        dur={`${2 + i * 0.3}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  ))}
                </>
              )}
            </svg>
          </div>

          {/* Pipelines Connected Directly (Below Tank) */}
          <div className="absolute top-[22rem] left-0 right-0 flex justify-center gap-4 px-8 z-30">
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
                        x="51"
                        y="0"
                        width="18"
                        height="130"
                        fill={`url(#pipeGrad${idx})`}
                        stroke={hasLeakage ? '#ef4444' : isOpen ? '#22c55e' : '#1e3a8a'}
                        strokeWidth="2"
                        rx="4"
                        opacity="0.6"
                      />
                      <rect
                        x="54"
                        y="0"
                        width="6"
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
                            strokeWidth="18"
                            strokeLinecap="round"
                            opacity="0.6"
                          />
                          <path
                            d="M 60 130 L 60 160 Q 60 170, 50 170 L 10 170"
                            fill="none"
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="6"
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
                            strokeWidth="18"
                            strokeLinecap="round"
                            opacity="0.6"
                          />
                          <path
                            d="M 60 130 L 60 190 Q 60 200, 50 200 L 20 200"
                            fill="none"
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="6"
                            strokeLinecap="round"
                          />
                        </>
                      )}
                      {idx === 2 && (
                        <>
                          {/* Straight down to center bottom */}
                          <rect
                            x="51"
                            y="130"
                            width="18"
                            height="110"
                            fill={`url(#pipeGrad${idx})`}
                            stroke={hasLeakage ? '#ef4444' : isOpen ? '#22c55e' : '#1e3a8a'}
                            strokeWidth="2"
                            rx="4"
                            opacity="0.6"
                          />
                          <rect
                            x="54"
                            y="130"
                            width="6"
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
                            strokeWidth="18"
                            strokeLinecap="round"
                            opacity="0.6"
                          />
                          <path
                            d="M 60 130 L 60 190 Q 60 200, 70 200 L 130 200"
                            fill="none"
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="6"
                            strokeLinecap="round"
                          />
                        </>
                      )}
                      {idx === 4 && (
                        <>
                          {/* Right bend with 2 bends - down, right, then down again to ward 5 */}
                          <path
                            d="M 60 130 L 60 150 Q 60 160, 70 160 L 200 160 Q 210 160, 210 170 L 210 255"
                            fill="none"
                            stroke={`url(#pipeGrad${idx})`}
                            strokeWidth="18"
                            strokeLinecap="round"
                            opacity="0.6"
                          />
                          <path
                            d="M 60 130 L 60 150 Q 60 160, 70 160 L 200 160 Q 210 160, 210 170 L 210 255"
                            fill="none"
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="6"
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
                              d="M 60 0 L 60 130 L 60 150 Q 60 160, 70 160 L 200 160 Q 210 160, 210 170 L 210 255"
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
                    <img 
                      src="/home.svg" 
                      alt="Home" 
                      className="w-full h-full object-contain"
                    />

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
