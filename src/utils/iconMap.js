/**
 * Centralized Icon System
 * Maps icon names to realistic image paths
 * Use this instead of lucide-react icons
 */

// Icon path mapping
export const iconMap = {
  // Water & Flow
  droplet: '/images/icons/water-droplet.png',
  activity: '/images/icons/activity-wave.png',
  gauge: '/images/icons/gauge-meter.png',

  // Power & Energy
  power: '/images/icons/power-bolt.png',
  zap: '/images/icons/power-bolt.png',

  // Temperature & Science
  thermometer: '/images/icons/thermometer.png',
  beaker: '/images/icons/beaker-flask.png',
  flask: '/images/icons/beaker-flask.png',
  microscope: '/images/icons/microscope.svg',

  // Infrastructure
  pump: '/images/icons/pump-machine.svg',
  valve: '/images/icons/valve-control.svg',
  sensor: '/images/icons/sensor-device.svg',
  pipeline: '/images/icons/pipeline-pipe.svg',

  // Navigation & Location
  map: '/images/icons/map-location.svg',
  mapPin: '/images/icons/map-location.svg',
  navigation: '/images/icons/navigation-compass.svg',
  layers: '/images/icons/layers-stack.svg',

  // Status & Alerts
  alertTriangle: '/images/icons/alert-warning.png',
  checkCircle: '/images/icons/check-success.svg',
  radio: '/images/icons/radio-signal.svg',

  // UI Controls
  settings: '/images/icons/settings-gear.svg',
  clock: '/images/icons/clock-time.svg',
  x: '/images/icons/close-x.svg',
  menu: '/images/icons/menu-bars.svg',
  filter: '/images/icons/filter-funnel.svg',
  plusCircle: '/images/icons/plus-add.svg',

  // Data & Analytics
  trendingUp: '/images/icons/trending-up.svg',
  barChart: '/images/icons/activity-wave.png',
  pieChart: '/images/icons/gauge-meter.png',

  // Fallback for unmapped icons
  default: '/images/icons/settings-gear.svg',
};

/**
 * Icon Component - Drop-in replacement for lucide-react icons
 * @param {string} name - Icon name from iconMap
 * @param {number} size - Icon size in pixels (default: 20)
 * @param {string} className - Additional CSS classes
 * @param {object} style - Inline styles
 */
export const Icon = ({ name, size = 20, className = '', style = {}, ...props }) => {
  const iconPath = iconMap[name] || iconMap.default;

  return (
    <img
      src={iconPath}
      alt={name}
      className={`inline-block ${className}`}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        ...style,
      }}
      {...props}
    />
  );
};

/**
 * Get icon path by name
 * @param {string} name - Icon name
 * @returns {string} Icon file path
 */
export const getIconPath = (name) => {
  return iconMap[name] || iconMap.default;
};

/**
 * Preload all icons for better performance
 */
export const preloadIcons = () => {
  const paths = Object.values(iconMap);
  paths.forEach((path) => {
    const img = new Image();
    img.src = path;
  });
};

export default Icon;
