/**
 * Icon Replacement Helper Script
 * Run this to see all icon replacements needed
 */

const fs = require('fs');
const path = require('path');

// Icon mapping from lucide-react to iconMap
const iconReplacements = {
  // Direct mappings
  Droplet: 'droplet',
  Activity: 'activity',
  Gauge: 'gauge',
  Power: 'power',
  Zap: 'power',
  Thermometer: 'thermometer',
  Beaker: 'beaker',
  FlaskConical: 'flask',
  Microscope: 'microscope',
  Server: 'gauge',
  Map: 'map',
  MapPin: 'mapPin',
  Navigation: 'navigation',
  Layers: 'layers',
  AlertTriangle: 'alertTriangle',
  CheckCircle: 'checkCircle',
  Radio: 'radio',
  Settings: 'settings',
  Clock: 'clock',
  X: 'x',
  Menu: 'menu',
  Filter: 'filter',
  PlusCircle: 'plusCircle',
  TrendingUp: 'trendingUp',
  BarChart3: 'activity',
  PieChartIcon: 'gauge',
};

// Pattern to find: <IconName size={number} ... />
// Replace with: <img src={getIconPath('iconname')} className="w-X h-X" ... />

const sizeToTailwind = {
  10: 'w-[10px] h-[10px]',
  16: 'w-4 h-4',
  18: 'w-[18px] h-[18px]',
  20: 'w-5 h-5',
  24: 'w-6 h-6',
  28: 'w-7 h-7',
  32: 'w-8 h-8',
};

console.log('Icon Replacement Mappings:');
console.log('==========================\n');

Object.entries(iconReplacements).forEach(([lucideIcon, iconMapKey]) => {
  console.log(`${lucideIcon} → getIconPath('${iconMapKey}')`);
});

console.log('\n\nExample Replacements:');
console.log('====================\n');

console.log('// Before:');
console.log('<Server size={32} className="text-indigo-600" />');
console.log('\n// After:');
console.log('<img src={getIconPath(\'gauge\')} alt="Server" className="w-8 h-8" />');

console.log('\n\n// Before:');
console.log('<Droplet size={20} />');
console.log('\n// After:');
console.log('<img src={getIconPath(\'droplet\')} alt="Droplet" className="w-5 h-5" />');
