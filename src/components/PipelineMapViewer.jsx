import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Layers, ZoomIn, ZoomOut, Navigation, X, Map as MapIcon, Satellite, Filter, Info, Activity, Droplet, AlertTriangle, Zap, Gauge, Database, Settings } from 'lucide-react';

export const PipelineMapViewer = ({ pipelineData, infrastructureData }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapView, setMapView] = useState('satellite');
  const [showFilters, setShowFilters] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    pipelines: true,
    sensors: true,
    pumps: true,
    tanks: true,
    valves: true,
    alerts: true
  });
  const markersRef = useRef([]);

  useEffect(() => {
    const loadLeaflet = async () => {
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        document.head.appendChild(script);

        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      initializeMap();
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && mapView) {
      changeMapLayer();
    }
  }, [mapView]);

  useEffect(() => {
    if (mapInstanceRef.current && pipelineData && infrastructureData) {
      renderMapData();
    }
  }, [pipelineData, infrastructureData, activeFilters]);

  const initializeMap = () => {
    if (!window.L || !mapRef.current || mapInstanceRef.current) return;

    const L = window.L;

    try {
      const mapInstance = L.map(mapRef.current, {
        center: [12.9150, 80.2250],
        zoom: 15,
        zoomControl: false
      });

      L.tileLayer('https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }).addTo(mapInstance);

      mapInstanceRef.current = mapInstance;
      setMapLoaded(true);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const changeMapLayer = () => {
    if (!window.L || !mapInstanceRef.current) return;

    const L = window.L;

    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    let tileUrl;
    switch (mapView) {
      case 'satellite':
        tileUrl = 'https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}';
        break;
      case 'street':
        tileUrl = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
        break;
      case 'hybrid':
        tileUrl = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
        break;
      default:
        tileUrl = 'https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}';
    }

    L.tileLayer(tileUrl, {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(mapInstanceRef.current);
  };

  const renderMapData = () => {
    if (!window.L || !mapInstanceRef.current) return;

    const L = window.L;

    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Render pipelines
    if (activeFilters.pipelines && pipelineData) {
      pipelineData.features.forEach((feature) => {
        const coords = feature.geometry.coordinates.map(coord => [coord[1], coord[0]]);

        let color, weight, dashArray;
        switch (feature.properties.status) {
          case 'critical':
            color = '#ef4444';
            weight = 6;
            dashArray = '8, 4';
            break;
          case 'warning':
            color = '#f59e0b';
            weight = 5;
            dashArray = null;
            break;
          default:
            color = '#3b82f6';
            weight = 4;
            dashArray = null;
        }

        const pipeline = L.polyline(coords, {
          color: color,
          weight: weight,
          opacity: 0.8,
          dashArray: dashArray
        }).addTo(mapInstanceRef.current);

        markersRef.current.push(pipeline);
        pipeline.on('click', () => setSelectedFeature(feature));

        pipeline.bindTooltip(`
          <div style="font-family: sans-serif; padding: 8px; min-width: 250px;">
            <div style="font-weight: 700; font-size: 14px; color: #000; margin-bottom: 8px; border-bottom: 2px solid #3b82f6; padding-bottom: 4px;">
              ${feature.properties.name}
            </div>
            <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 4px 0; color: #666; font-weight: 600;">ID:</td>
                <td style="padding: 4px 0; text-align: right; color: #000; font-weight: 700;">${feature.properties.id}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 4px 0; color: #666; font-weight: 600;">Diameter:</td>
                <td style="padding: 4px 0; text-align: right; color: #000; font-weight: 700;">${feature.properties.diameter} mm</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 4px 0; color: #666; font-weight: 600;">Pressure:</td>
                <td style="padding: 4px 0; text-align: right; font-weight: 700; color: ${feature.properties.pressure > 3 ? '#059669' : feature.properties.pressure > 2 ? '#d97706' : '#dc2626'};">
                  ${feature.properties.pressure} Bar
                </td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 4px 0; color: #666; font-weight: 600;">Material:</td>
                <td style="padding: 4px 0; text-align: right; color: #000; font-weight: 700;">${feature.properties.material}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 4px 0; color: #666; font-weight: 600;">Status:</td>
                <td style="padding: 4px 0; text-align: right; font-weight: 700; color: ${feature.properties.status === 'operational' ? '#059669' : feature.properties.status === 'warning' ? '#d97706' : '#dc2626'};">
                  ${feature.properties.status.toUpperCase()}
                </td>
              </tr>
              ${feature.properties.installDate ? `
              <tr>
                <td style="padding: 4px 0; color: #666; font-weight: 600;">Installed:</td>
                <td style="padding: 4px 0; text-align: right; color: #000; font-weight: 700;">${feature.properties.installDate}</td>
              </tr>
              ` : ''}
            </table>
            ${feature.properties.alert ? `
            <div style="margin-top: 8px; padding: 6px; background: #fef2f2; border: 1px solid #dc2626; border-radius: 4px;">
              <div style="color: #dc2626; font-weight: 700; font-size: 11px; margin-bottom: 2px;">⚠ ALERT</div>
              <div style="color: #991b1b; font-size: 11px;">${feature.properties.alert}</div>
            </div>
            ` : ''}
          </div>
        `, {
          className: 'custom-tooltip',
          permanent: false,
          direction: 'top',
          offset: [0, -10]
        });
      });
    }

    // Render infrastructure with SVG icons
    if (infrastructureData) {
      infrastructureData.features.forEach((feature) => {
        const coords = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
        const props = feature.properties;

        const shouldShow = (
          (props.type === 'sensor' && activeFilters.sensors) ||
          (props.type === 'pump' && activeFilters.pumps) ||
          (props.type === 'tank' && activeFilters.tanks) ||
          (props.type === 'valve' && activeFilters.valves) ||
          (props.type === 'alert' && activeFilters.alerts) ||
          (props.type === 'treatment_plant' && activeFilters.pipelines)
        );

        if (!shouldShow) return;

        let iconHtml, iconSize;
        const baseStyle = 'border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);';

        switch (props.type) {
          case 'treatment_plant':
            iconHtml = `<div style="background:#3b82f6;width:36px;height:36px;${baseStyle}">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <rect x="3" y="3" width="7" height="18" />
                <rect x="14" y="3" width="7" height="18" />
                <line x1="3" y1="9" x2="10" y2="9" />
                <line x1="14" y1="9" x2="21" y2="9" />
              </svg>
            </div>`;
            iconSize = [36, 36];
            break;
          case 'tank':
            iconHtml = `<div style="background:${props.status === 'warning' ? '#f59e0b' : '#10b981'};width:32px;height:32px;${baseStyle}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
              </svg>
            </div>`;
            iconSize = [32, 32];
            break;
          case 'pump':
            iconHtml = `<div style="background:#8b5cf6;width:30px;height:30px;${baseStyle}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>`;
            iconSize = [30, 30];
            break;
          case 'sensor':
            iconHtml = `<div style="background:#10b981;width:24px;height:24px;${baseStyle}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <circle cx="12" cy="12" r="2"/>
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
              </svg>
            </div>`;
            iconSize = [24, 24];
            break;
          case 'valve':
            iconHtml = `<div style="background:#6366f1;width:24px;height:24px;${baseStyle}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v10"/>
              </svg>
            </div>`;
            iconSize = [24, 24];
            break;
          case 'alert':
            iconHtml = `<div style="background:#ef4444;width:34px;height:34px;${baseStyle}animation:pulse 2s infinite;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>`;
            iconSize = [34, 34];
            break;
          default:
            return;
        }

        const icon = L.divIcon({
          html: iconHtml,
          iconSize: iconSize,
          className: ''
        });

        const marker = L.marker(coords, { icon }).addTo(mapInstanceRef.current);
        markersRef.current.push(marker);
        marker.on('click', () => setSelectedFeature(feature));

        let tooltipContent = `
          <div style="font-family: sans-serif; padding: 8px; min-width: 250px;">
            <div style="font-weight: 700; font-size: 14px; color: #000; margin-bottom: 8px; border-bottom: 2px solid ${props.type === 'treatment_plant' ? '#3b82f6' :
            props.type === 'tank' ? '#059669' :
              props.type === 'pump' ? '#7c3aed' :
                props.type === 'sensor' ? '#059669' :
                  props.type === 'valve' ? '#4f46e5' :
                    '#dc2626'
          }; padding-bottom: 4px;">
              ${props.name}
            </div>
            <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 4px 0; color: #666; font-weight: 600;">ID:</td>
                <td style="padding: 4px 0; text-align: right; color: #000; font-weight: 700;">${props.id}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 4px 0; color: #666; font-weight: 600;">Type:</td>
                <td style="padding: 4px 0; text-align: right; color: #000; font-weight: 700;">${props.type.replace('_', ' ').toUpperCase()}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 4px 0; color: #666; font-weight: 600;">Status:</td>
                <td style="padding: 4px 0; text-align: right; font-weight: 700; color: ${props.status === 'operational' ? '#059669' : props.status === 'warning' ? '#d97706' : '#dc2626'};">
                  ${props.status.toUpperCase()}
                </td>
              </tr>`;

        // Sensor specific details
        if (props.type === 'sensor') {
          tooltipContent += `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 4px 0; color: #666; font-weight: 600;">Reading:</td>
                <td style="padding: 4px 0; text-align: right; color: #000; font-weight: 700;">${props.value} ${props.unit}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 4px 0; color: #666; font-weight: 600;">Battery:</td>
                <td style="padding: 4px 0; text-align: right; font-weight: 700; color: ${props.battery > 60 ? '#059669' : props.battery > 30 ? '#d97706' : '#dc2626'};">
                  ${props.battery}%
                </td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 4px 0; color: #666; font-weight: 600;">Last Update:</td>
                <td style="padding: 4px 0; text-align: right; color: #000; font-weight: 700;">Just now</td>
              </tr>`;
        }

        // Tank specific details
        if (props.type === 'tank') {
          tooltipContent += `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 4px 0; color: #666; font-weight: 600;">Capacity:</td>
                <td style="padding: 4px 0; text-align: right; color: #000; font-weight: 700;">${props.capacity.toLocaleString()} L</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 4px 0; color: #666; font-weight: 600;">Current Level:</td>
                <td style="padding: 4px 0; text-align: right; font-weight: 700; color: ${props.currentLevel > 60 ? '#059669' : props.currentLevel > 30 ? '#d97706' : '#dc2626'};">
                  ${props.currentLevel}%
                </td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 4px 0; color: #666; font-weight: 600;">Volume:</td>
                <td style="padding: 4px 0; text-align: right; color: #000; font-weight: 700;">${Math.round(props.capacity * props.currentLevel / 100).toLocaleString()} L</td>
              </tr>`;
        }

        // Pump specific details
        if (props.type === 'pump') {
          tooltipContent += `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 4px 0; color: #666; font-weight: 600;">Capacity:</td>
                <td style="padding: 4px 0; text-align: right; color: #000; font-weight: 700;">${props.capacity} L/min</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 4px 0; color: #666; font-weight: 600;">Power:</td>
                <td style="padding: 4px 0; text-align: right; color: #000; font-weight: 700;">${props.powerConsumption} kW</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 4px 0; color: #666; font-weight: 600;">Runtime:</td>
                <td style="padding: 4px 0; text-align: right; color: #000; font-weight: 700;">24/7</td>
              </tr>`;
        }

        // Treatment plant details
        if (props.type === 'treatment_plant') {
          tooltipContent += `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 4px 0; color: #666; font-weight: 600;">Capacity:</td>
                <td style="padding: 4px 0; text-align: right; color: #000; font-weight: 700;">${props.capacity.toLocaleString()} L/day</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 4px 0; color: #666; font-weight: 600;">Output:</td>
                <td style="padding: 4px 0; text-align: right; color: #000; font-weight: 700;">Normal</td>
              </tr>`;
        }

        // Valve details
        if (props.type === 'valve') {
          tooltipContent += `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 4px 0; color: #666; font-weight: 600;">Position:</td>
                <td style="padding: 4px 0; text-align: right; color: #000; font-weight: 700;">Open</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 4px 0; color: #666; font-weight: 600;">Control:</td>
                <td style="padding: 4px 0; text-align: right; color: #000; font-weight: 700;">Automatic</td>
              </tr>`;
        }

        // Alert details
        if (props.type === 'alert') {
          tooltipContent += `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 4px 0; color: #666; font-weight: 600;">Severity:</td>
                <td style="padding: 4px 0; text-align: right; color: #dc2626; font-weight: 700;">CRITICAL</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 4px 0; color: #666; font-weight: 600;">Time:</td>
                <td style="padding: 4px 0; text-align: right; color: #000; font-weight: 700;">5 min ago</td>
              </tr>`;
        }

        // Installation date
        if (props.installDate) {
          tooltipContent += `
              <tr>
                <td style="padding: 4px 0; color: #666; font-weight: 600;">Installed:</td>
                <td style="padding: 4px 0; text-align: right; color: #000; font-weight: 700;">${props.installDate}</td>
              </tr>`;
        }

        tooltipContent += `</table>`;

        // Alert message
        if (props.alert) {
          tooltipContent += `
            <div style="margin-top: 8px; padding: 6px; background: #fef2f2; border: 1px solid #dc2626; border-radius: 4px;">
              <div style="color: #dc2626; font-weight: 700; font-size: 11px; margin-bottom: 2px;">⚠ ALERT</div>
              <div style="color: #991b1b; font-size: 11px;">${props.alert}</div>
            </div>`;
        }

        tooltipContent += `</div>`;

        marker.bindTooltip(tooltipContent, {
          className: 'custom-tooltip',
          permanent: false,
          direction: 'top',
          offset: [0, -10]
        });
      });
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([12.9150, 80.2250], 15);
    }
  };

  const toggleFilter = (filter) => {
    setActiveFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  return (
    <div className="relative w-full h-full bg-gray-100">
      {/* Loading Indicator */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-[2000]" style={{ backgroundColor: 'var(--bg-white)' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 mb-3 mx-auto" style={{ borderColor: 'var(--gray-border)', borderTopColor: 'var(--primary-blue)' }}></div>
            <p className="text-sm font-bold" style={{ color: 'var(--gray-text-dark)' }}>Loading Map...</p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: '500px' }}></div>

      {/* Top Bar - Map Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-[1000]">
        {/* Left: Map View Switcher */}
        <div className="flex gap-2">
          <button
            onClick={() => setMapView('satellite')}
            className="px-3 py-2 font-semibold text-xs transition-all flex items-center gap-2"
            style={{
              borderRadius: 'var(--radius-sm)',
              backgroundColor: mapView === 'satellite' ? 'var(--primary-blue)' : 'var(--bg-white)',
              color: mapView === 'satellite' ? 'var(--bg-white)' : 'var(--gray-text-dark)',
              boxShadow: mapView === 'satellite' ? 'var(--shadow-lg)' : 'var(--shadow-md)'
            }}
          >
            <Satellite size={14} /> Satellite
          </button>
          <button
            onClick={() => setMapView('street')}
            className="px-3 py-2 font-semibold text-xs transition-all flex items-center gap-2"
            style={{
              borderRadius: 'var(--radius-sm)',
              backgroundColor: mapView === 'street' ? 'var(--primary-blue)' : 'var(--bg-white)',
              color: mapView === 'street' ? 'var(--bg-white)' : 'var(--gray-text-dark)',
              boxShadow: mapView === 'street' ? 'var(--shadow-lg)' : 'var(--shadow-md)'
            }}
          >
            <MapPin size={14} /> Street
          </button>
          <button
            onClick={() => setMapView('hybrid')}
            className={`px-3 py-2 rounded-lg font-semibold text-xs transition-all flex items-center gap-2 ${mapView === 'hybrid'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-black shadow-md hover:shadow-lg'
              }`}
          >
            <MapIcon size={14} /> Hybrid
          </button>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="bg-white px-3 py-2 rounded-lg shadow-md hover:shadow-lg transition-all font-semibold text-xs flex items-center gap-2"
          >
            <Info size={14} /> Legend
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white px-3 py-2 rounded-lg shadow-md hover:shadow-lg transition-all font-semibold text-xs flex items-center gap-2"
          >
            <Filter size={14} /> Layers
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="absolute top-20 right-4 rounded-lg shadow-xl z-[1000] w-64" style={{ backgroundColor: 'var(--bg-white)', borderRadius: 'var(--radius-sm)' }}>
          <div className="p-3 flex items-center justify-between" style={{ backgroundColor: 'var(--primary-blue)', borderTopLeftRadius: 'var(--radius-sm)', borderTopRightRadius: 'var(--radius-sm)' }}>
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Layers size={14} /> Map Layers
            </h4>
            <button onClick={() => setShowFilters(false)} className="text-white hover:text-gray-200">
              <X size={16} />
            </button>
          </div>
          <div className="p-3 space-y-2">
            {[
              { key: 'pipelines', label: 'Pipeline Network', icon: Activity },
              { key: 'sensors', label: 'IoT Sensors', icon: Database },
              { key: 'pumps', label: 'Pump Stations', icon: Zap },
              { key: 'tanks', label: 'Water Tanks', icon: Droplet },
              { key: 'valves', label: 'Control Valves', icon: Settings },
              { key: 'alerts', label: 'Active Alerts', icon: AlertTriangle }
            ].map(({ key, label, icon: Icon }) => (
              <label
                key={key}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all ${activeFilters[key]
                    ? 'bg-blue-50 border border-blue-600'
                    : 'bg-gray-50 hover:bg-gray-100'
                  }`}
              >
                <input
                  type="checkbox"
                  checked={activeFilters[key]}
                  onChange={() => toggleFilter(key)}
                  className="w-4 h-4 accent-blue-600"
                />
                <Icon size={14} className="text-gray-600" />
                <span className="text-xs font-semibold text-black">{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Zoom Controls - Right Side */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-[1000]">
        <button
          onClick={handleZoomIn}
          className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-all"
          title="Zoom In"
        >
          <ZoomIn size={18} className="text-black" />
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-all"
          title="Zoom Out"
        >
          <ZoomOut size={18} className="text-black" />
        </button>
        <button
          onClick={handleResetView}
          className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-all"
          title="Reset View"
        >
          <Navigation size={18} className="text-black" />
        </button>
      </div>

      {/* Legend - Bottom Left */}
      {showLegend && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-xl p-3 z-[1000] w-56">
          <h4 className="font-bold text-xs text-black mb-2 flex items-center gap-1">
            <Info size={12} /> LEGEND
          </h4>
          <div className="space-y-2 text-xs">
            <div>
              <div className="font-semibold text-black mb-1.5 text-2xs uppercase tracking-wide">Pipeline Status</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-1.5 rounded" style={{ backgroundColor: 'var(--primary-blue)' }}></div>
                  <span style={{ color: 'var(--gray-text-dark)' }}>Operational</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-1.5 bg-amber-500 rounded"></div>
                  <span className="text-black">Warning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-1.5 bg-red-500 rounded border-t-2 border-dashed border-red-500"></div>
                  <span className="text-black">Critical</span>
                </div>
              </div>
            </div>
            <div className="border-t pt-2">
              <div className="font-semibold text-black mb-1.5 text-2xs uppercase tracking-wide">Infrastructure</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 shadow" style={{ backgroundColor: 'var(--primary-blue)', borderColor: 'var(--bg-white)' }}></div>
                  <span style={{ color: 'var(--gray-text-dark)' }}>Treatment Plant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-600 border-2 border-white shadow"></div>
                  <span className="text-black">Water Tank</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-600 border-2 border-white shadow"></div>
                  <span className="text-black">Pump Station</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-600 border border-white shadow"></div>
                  <span className="text-black">Sensor</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 border border-white shadow"></div>
                  <span className="text-black">Valve</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-600 border-2 border-white shadow animate-pulse"></div>
                  <span className="text-black">Alert</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature Details Panel */}
      {selectedFeature && (
        <div className="absolute bottom-4 right-4 rounded-lg shadow-xl z-[1000] w-80 max-h-96 overflow-hidden" style={{ backgroundColor: 'var(--bg-white)', borderRadius: 'var(--radius-sm)' }}>
          <div className="p-3 flex items-center justify-between" style={{ backgroundColor: 'var(--primary-blue)' }}>
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <MapPin size={14} />
              {selectedFeature.properties.name}
            </h4>
            <button
              onClick={() => setSelectedFeature(null)}
              className="text-white hover:text-gray-200"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-4 space-y-2 overflow-y-auto max-h-80">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 font-semibold">ID</span>
              <span className="font-bold text-black">{selectedFeature.properties.id}</span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-gray-600 font-semibold">Type</span>
              <span className="font-bold text-black capitalize">{selectedFeature.properties.type.replace('_', ' ')}</span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-gray-600 font-semibold">Status</span>
              <span className={`font-bold px-2 py-0.5 rounded text-xs ${selectedFeature.properties.status === 'operational' ? 'bg-green-100 text-green-700' :
                  selectedFeature.properties.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                }`}>
                {selectedFeature.properties.status.toUpperCase()}
              </span>
            </div>

            {selectedFeature.properties.diameter && (
              <>
                <div className="flex justify-between text-xs pt-2 border-t">
                  <span className="text-gray-600 font-semibold">Diameter</span>
                  <span className="font-bold text-black">{selectedFeature.properties.diameter} mm</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 font-semibold">Pressure</span>
                  <span className={`font-bold ${selectedFeature.properties.pressure > 3 ? 'text-green-700' :
                      selectedFeature.properties.pressure > 2 ? 'text-amber-700' : 'text-red-700'
                    }`}>
                    {selectedFeature.properties.pressure} Bar
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 font-semibold">Material</span>
                  <span className="font-bold text-black">{selectedFeature.properties.material}</span>
                </div>
              </>
            )}

            {selectedFeature.properties.capacity && selectedFeature.properties.type === 'tank' && (
              <>
                <div className="flex justify-between text-xs pt-2 border-t">
                  <span className="text-gray-600 font-semibold">Capacity</span>
                  <span className="font-bold text-black">{selectedFeature.properties.capacity.toLocaleString()} L</span>
                </div>
                <div className="pt-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 font-semibold">Current Level</span>
                    <span className="font-bold text-black">{selectedFeature.properties.currentLevel}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${selectedFeature.properties.currentLevel > 60 ? 'bg-green-600' :
                          selectedFeature.properties.currentLevel > 30 ? 'bg-amber-500' : 'bg-red-600'
                        }`}
                      style={{ width: `${selectedFeature.properties.currentLevel}%` }}
                    ></div>
                  </div>
                </div>
              </>
            )}

            {selectedFeature.properties.value && (
              <>
                <div className="flex justify-between text-xs pt-2 border-t">
                  <span className="text-gray-600 font-semibold">Reading</span>
                  <span className="font-bold text-black">{selectedFeature.properties.value} {selectedFeature.properties.unit}</span>
                </div>
                {selectedFeature.properties.battery && (
                  <div className="pt-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 font-semibold">Battery</span>
                      <span className="font-bold text-black">{selectedFeature.properties.battery}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${selectedFeature.properties.battery > 60 ? 'bg-green-600' :
                            selectedFeature.properties.battery > 30 ? 'bg-amber-500' : 'bg-red-600'
                          }`}
                        style={{ width: `${selectedFeature.properties.battery}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </>
            )}

            {selectedFeature.properties.powerConsumption && (
              <div className="flex justify-between text-xs pt-2 border-t">
                <span className="text-gray-600 font-semibold">Power Consumption</span>
                <span className="font-bold text-black">{selectedFeature.properties.powerConsumption} kW</span>
              </div>
            )}

            {selectedFeature.properties.alert && (
              <div className="bg-red-50 border border-red-600 rounded p-2 mt-2">
                <div className="flex items-center gap-1 text-red-800 font-bold text-xs mb-1">
                  <AlertTriangle size={12} /> ALERT
                </div>
                <p className="text-xs text-red-700">{selectedFeature.properties.alert}</p>
              </div>
            )}

            {selectedFeature.properties.installDate && (
              <div className="text-2xs text-gray-500 text-center pt-2 border-t">
                Installed: {selectedFeature.properties.installDate}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
