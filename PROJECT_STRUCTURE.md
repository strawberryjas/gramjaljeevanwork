# Project Structure

## 📁 Directory Organization

```
gramjaljeevanwork/
├── public/                          # Static assets
│   ├── favicon.svg                  # Website favicon
│   ├── jalsense-logo.svg           # Application logo
│   └── ministry-logo.svg           # Government logo
│
├── src/                            # Source code
│   ├── components/                 # React components
│   │   ├── auth/                   # Authentication components
│   │   │   └── LoginScreen.jsx     # Login page component
│   │   │
│   │   ├── dashboards/             # Role-based dashboards
│   │   │   ├── GuestDashboard.jsx      # Public view (read-only)
│   │   │   ├── TechnicianDashboard.jsx # Operations & maintenance
│   │   │   ├── ResearcherDashboard.jsx # Analytics & data export
│   │   │   └── index.js                # Dashboard exports
│   │   │
│   │   ├── shared/                 # Reusable UI components
│   │   │   ├── StatCard.jsx        # Metric display card
│   │   │   ├── GaugeChart.jsx      # Gauge visualization
│   │   │   ├── QualityCard.jsx     # Water quality card
│   │   │   ├── CountdownCard.jsx   # Countdown timer
│   │   │   └── OperatorLogTable.jsx # Log table
│   │   │
│   │   ├── PipelineMapViewer.jsx   # GIS map component
│   │   └── VoiceAssistant.jsx      # Voice control (legacy)
│   │
│   ├── constants/                  # Application constants
│   │   ├── translations.js         # Multi-language support
│   │   ├── thresholds.js          # Sensor thresholds & parameters
│   │   └── mockData.js            # Mock data generators
│   │
│   ├── data/                       # Data files
│   │   └── samplePipelineData.js  # GeoJSON pipeline data
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useStickyState.js      # Persistent state hook
│   │   └── useIoTSimulation.js    # IoT data simulation
│   │
│   ├── utils/                      # Utility functions
│   │   └── helpers.js             # Helper functions
│   │
│   ├── App.jsx                     # Main application component
│   ├── main.jsx                    # Application entry point
│   └── index.css                   # Global styles
│
├── .gitignore                      # Git ignore rules
├── package.json                    # Dependencies & scripts
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS config
├── postcss.config.js              # PostCSS config
├── README.md                       # Project documentation
└── PROJECT_STRUCTURE.md           # This file

```

## 🎯 Component Architecture

### **Authentication Layer**

- `LoginScreen.jsx` - Handles user authentication and role selection

### **Dashboard Layer (Role-Based)**

- `GuestDashboard.jsx` - Limited read-only view for public users
- `TechnicianDashboard.jsx` - Full operational control for technicians
- `ResearcherDashboard.jsx` - Advanced analytics for researchers

### **Shared Components**

Reusable UI components used across different dashboards

### **GIS/Mapping**

- `PipelineMapViewer.jsx` - Interactive map with Leaflet.js

## 📊 Data Flow

```
main.jsx
    ↓
App.jsx (State Management)
    ↓
LoginScreen (Authentication)
    ↓
Role-Based Dashboard
    ↓
Shared Components + Data Hooks
```

## 🔧 Key Technologies

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Leaflet.js** - Interactive maps
- **Lucide React** - Icons

## 📝 Naming Conventions

- **Components**: PascalCase (e.g., `LoginScreen.jsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useStickyState.js`)
- **Utils**: camelCase (e.g., `helpers.js`)
- **Constants**: camelCase for files, UPPER_CASE for exports
- **CSS**: kebab-case for custom classes

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 👥 User Roles

1. **Guest/Public** - View-only access to basic information
2. **Technician** - Full operational control and maintenance tools
3. **Researcher** - Advanced analytics and data export capabilities

## 🔐 Access Control

Access is controlled at the component level based on `user.role`:

- Guest → `GuestDashboard`
- Technician → `TechnicianDashboard` + all tabs
- Researcher → `ResearcherDashboard` + analytics tools

## 📦 Build Output

Production build creates optimized files in `dist/` directory.
