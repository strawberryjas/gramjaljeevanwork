const fs = require('fs');
const path = require('path');

// Icon mapping from lucide-react to iconMap
const iconMap = {
    'Droplet': 'droplet',
    'Activity': 'activity',
    'Gauge': 'gauge',
    'Power': 'power',
    'Zap': 'power',
    'Thermometer': 'thermometer',
    'Beaker': 'beaker',
    'FlaskConical': 'flask',
    'Microscope': 'microscope',
    'Server': 'gauge',
    'Map': 'map',
    'MapPin': 'mapPin',
    'Navigation': 'navigation',
    'Layers': 'layers',
    'AlertTriangle': 'alertTriangle',
    'CheckCircle': 'checkCircle',
    'Radio': 'radio',
    'Settings': 'settings',
    'Clock': 'clock',
    'X': 'x',
    'Menu': 'menu',
    'Filter': 'filter',
    'PlusCircle': 'plusCircle',
    'TrendingUp': 'trendingUp',
    'BarChart3': 'activity',
    'Users': 'activity',
    'Star': 'checkCircle',
    'FileCheck': 'checkCircle',
    'LayoutDashboard': 'gauge',
    'Clipboard': 'checkCircle',
    'LogOut': 'x',
    'WifiOff': 'alertTriangle',
    'ClipboardList': 'checkCircle',
    'PenTool': 'settings',
    'Wrench': 'settings',
    'DollarSign': 'trendingUp',
    'CalendarClock': 'clock',
    'Calendar': 'clock',
    'AlertCircle': 'alertTriangle',
    'Table': 'layers',
    'FileText': 'checkCircle',
    'Ticket': 'checkCircle',
    'CheckSquare': 'checkCircle',
    'Languages': 'settings',
    'Landmark': 'map',
    'Play': 'checkCircle',
    'Square': 'x',
    'Download': 'trendingUp',
    'FileBarChart': 'trendingUp',
    'Upload': 'trendingUp',
    'Share2': 'navigation',
    'Leaf': 'checkCircle',
    'Sun': 'settings',
    'Wind': 'activity',
};

// Size to Tailwind class mapping
const sizeToClass = (size) => {
    const sizeMap = {
        10: 'w-[10px] h-[10px]',
        16: 'w-4 h-4',
        18: 'w-[18px] h-[18px]',
        20: 'w-5 h-5',
        24: 'w-6 h-6',
        28: 'w-7 h-7',
        32: 'w-8 h-8',
    };
    return sizeMap[size] || `w-[${size}px] h-[${size}px]`;
};

function replaceIconsInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let replacementCount = 0;

    // Pattern: <IconName size={number} ... />
    Object.entries(iconMap).forEach(([lucideIcon, iconKey]) => {
        const regex = new RegExp(`<${lucideIcon}\\s+size={(\\d+)}[^/>]*/>`, 'g');
        content = content.replace(regex, (match, size) => {
            replacementCount++;
            const sizeClass = sizeToClass(parseInt(size));
            return `<img src={getIconPath('${iconKey}')} alt="${lucideIcon}" className="${sizeClass}" />`;
        });
    });

    if (replacementCount > 0) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ ${path.basename(filePath)}: ${replacementCount} icons replaced`);
    }

    return replacementCount;
}

// Files to process
const files = [
    'src/App.jsx',
    'src/components/dashboards/TechnicianDashboard.jsx',
    'src/components/dashboards/ResearcherDashboard.jsx',
    'src/components/dashboards/GuestDashboard.jsx',
    'src/components/dashboards/PumpDetails.jsx',
    'src/components/dashboards/PipelineDetails.jsx',
    'src/components/dashboards/WaterTankDetails.jsx',
    'src/components/dashboards/PipelinesOverview.jsx',
    'src/components/dashboards/SystemContainer.jsx',
    'src/components/PipelineMapViewer.jsx',
    'src/components/VoiceAssistant.jsx',
    'src/components/ErrorBoundary.jsx',
    'src/components/auth/LoginScreen.jsx',
];

console.log('🚀 Starting automated icon replacement...\n');

let totalReplacements = 0;
files.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        totalReplacements += replaceIconsInFile(fullPath);
    } else {
        console.log(`⚠️  ${file}: File not found`);
    }
});

console.log(`\n✨ Complete! ${totalReplacements} total icons replaced.`);
console.log('\n📝 Next steps:');
console.log('1. Check the dev server for any errors');
console.log('2. Test the website at http://127.0.0.1:5179');
console.log('3. If there are issues, run: git checkout -- src/');
