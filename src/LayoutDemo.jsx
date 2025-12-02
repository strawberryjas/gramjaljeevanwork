import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Card } from './components/layout/Card';
import { Breadcrumbs } from './components/layout/Breadcrumbs';
import { Activity, Droplet, Gauge, AlertTriangle } from 'lucide-react';

/**
 * Demo Page - Showcases new layout components
 * This demonstrates the sidebar, cards, breadcrumbs, and enhanced typography
 */
export const LayoutDemo = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                userRole="admin"
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
            />

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-white border-b p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Layout Demo</h1>
                            <p className="text-sm text-gray-500">Showcasing new UX improvements</p>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <Activity size={24} />
                        </button>
                    </div>
                </header>

                {/* Content */}
                <main className="p-6 space-y-6">
                    {/* Breadcrumbs */}
                    <Breadcrumbs items={[
                        { label: 'Dashboard', onClick: () => setActiveTab('overview') },
                        { label: 'Layout Demo' }
                    ]} />

                    {/* Metrics with Enhanced Typography */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <div className="text-center">
                                <div className="metric-label mb-2">Tank Level</div>
                                <div className="metric-value metric-success">
                                    75<span className="metric-unit">%</span>
                                </div>
                                <div className="mt-2 text-xs text-gray-500">Normal Range</div>
                            </div>
                        </Card>

                        <Card>
                            <div className="text-center">
                                <div className="metric-label mb-2">Flow Rate</div>
                                <div className="metric-value metric-info">
                                    245<span className="metric-unit">L/min</span>
                                </div>
                                <div className="mt-2 text-xs text-gray-500">Optimal</div>
                            </div>
                        </Card>

                        <Card>
                            <div className="text-center">
                                <div className="metric-label mb-2">Pressure</div>
                                <div className="metric-value metric-warning">
                                    3.2<span className="metric-unit">bar</span>
                                </div>
                                <div className="mt-2 text-xs text-gray-500">Slightly Low</div>
                            </div>
                        </Card>

                        <Card>
                            <div className="text-center">
                                <div className="metric-label mb-2">Active Alerts</div>
                                <div className="metric-value metric-danger">
                                    2<span className="metric-unit"></span>
                                </div>
                                <div className="mt-2 text-xs text-gray-500">Requires Attention</div>
                            </div>
                        </Card>
                    </div>

                    {/* Card with Title and Icon */}
                    <Card title="System Status" icon={Activity}>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Droplet size={20} className="text-green-600" />
                                    <div>
                                        <div className="font-medium text-gray-900">Water Supply</div>
                                        <div className="text-sm text-gray-500">Operating normally</div>
                                    </div>
                                </div>
                                <span className="text-green-600 font-bold">✓</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Gauge size={20} className="text-blue-600" />
                                    <div>
                                        <div className="font-medium text-gray-900">Pressure System</div>
                                        <div className="text-sm text-gray-500">Stable</div>
                                    </div>
                                </div>
                                <span className="text-blue-600 font-bold">✓</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle size={20} className="text-amber-600" />
                                    <div>
                                        <div className="font-medium text-gray-900">Maintenance Due</div>
                                        <div className="text-sm text-gray-500">Pump #2 - Next week</div>
                                    </div>
                                </div>
                                <span className="text-amber-600 font-bold">!</span>
                            </div>
                        </div>
                    </Card>

                    {/* Card with Header Action */}
                    <Card
                        title="Recent Activity"
                        icon={Activity}
                        headerAction={
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                View All
                            </button>
                        }
                    >
                        <div className="space-y-3">
                            <div className="text-sm">
                                <div className="font-medium text-gray-900">Pump #1 started</div>
                                <div className="text-gray-500">2 minutes ago</div>
                            </div>
                            <div className="text-sm">
                                <div className="font-medium text-gray-900">Tank level reached 80%</div>
                                <div className="text-gray-500">15 minutes ago</div>
                            </div>
                            <div className="text-sm">
                                <div className="font-medium text-gray-900">Valve V-3 adjusted</div>
                                <div className="text-gray-500">1 hour ago</div>
                            </div>
                        </div>
                    </Card>

                    {/* Instructions */}
                    <Card title="How to Use These Components">
                        <div className="prose prose-sm max-w-none">
                            <h4 className="font-bold text-gray-900 mb-2">Sidebar</h4>
                            <ul className="text-gray-600 space-y-1 mb-4">
                                <li>Click the collapse button (desktop) to save screen space</li>
                                <li>On mobile, tap the menu icon to open the sidebar</li>
                                <li>Menu items are organized into logical groups</li>
                            </ul>

                            <h4 className="font-bold text-gray-900 mb-2">Cards</h4>
                            <ul className="text-gray-600 space-y-1 mb-4">
                                <li>Consistent visual design across all sections</li>
                                <li>Optional titles with icons</li>
                                <li>Support for header actions (buttons, badges)</li>
                            </ul>

                            <h4 className="font-bold text-gray-900 mb-2">Enhanced Metrics</h4>
                            <ul className="text-gray-600 space-y-1 mb-4">
                                <li>Large, bold numbers for quick scanning</li>
                                <li>Color-coded by status (success, warning, danger, info)</li>
                                <li>Clear labels and units</li>
                            </ul>

                            <h4 className="font-bold text-gray-900 mb-2">Breadcrumbs</h4>
                            <ul className="text-gray-600 space-y-1">
                                <li>Shows your current location in the app</li>
                                <li>Click any segment to navigate back</li>
                                <li>Automatically updates as you navigate</li>
                            </ul>
                        </div>
                    </Card>
                </main>
            </div>
        </div>
    );
};

export default LayoutDemo;
