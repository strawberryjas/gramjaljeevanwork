import React, { useState } from 'react';
import {
    Activity, Server, ClipboardList, Wrench, DollarSign,
    FlaskConical, TrendingUp, Map, Zap, Settings,
    ChevronLeft, ChevronRight, Menu, X
} from 'lucide-react';

/**
 * Collapsible Sidebar Navigation
 * Organized menu with collapse functionality
 */
export const Sidebar = ({ activeTab, onTabChange, userRole, isOpen, onToggle }) => {
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        {
            id: 'overview',
            label: 'Overview',
            icon: Activity,
            roles: ['all']
        },
        {
            label: 'Operations',
            isGroup: true,
            items: [
                { id: 'infrastructure', label: 'Infrastructure', icon: Server },
                { id: 'operations', label: 'Daily Operations', icon: ClipboardList },
                { id: 'maintenance', label: 'Maintenance', icon: Wrench },
            ]
        },
        {
            label: 'Predictive Analytics',
            isGroup: true,
            items: [
                { id: 'quality', label: 'Water Quality', icon: FlaskConical },
                { id: 'forecasting', label: 'Forecasting', icon: TrendingUp },
                { id: 'analytics', label: 'Predictive Insights', icon: TrendingUp },
            ]
        },
        {
            label: 'Resources',
            isGroup: true,
            items: [
                { id: 'gis', label: 'GIS Map', icon: Map },
                { id: 'energy', label: 'Energy', icon: Zap },
                { id: 'finance', label: 'Finance', icon: DollarSign },
            ]
        },
    ];

    const handleItemClick = (id) => {
        onTabChange(id);
        if (window.innerWidth < 1024) {
            onToggle(); // Close sidebar on mobile after selection
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed lg:sticky top-0 left-0 h-screen bg-white border-r z-50
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-16' : 'w-64'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                {/* Header */}
                <div className="h-16 border-b flex items-center justify-between px-4">
                    {!collapsed && (
                        <h2 className="font-bold text-lg text-gray-900">Navigation</h2>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                    <button
                        onClick={onToggle}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)]">
                    {menuItems.map((item, index) => {
                        if (item.isGroup) {
                            return (
                                <div key={index} className="space-y-1">
                                    {!collapsed && (
                                        <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            {item.label}
                                        </div>
                                    )}
                                    {item.items.map((subItem) => (
                                        <button
                                            key={subItem.id}
                                            onClick={() => handleItemClick(subItem.id)}
                                            className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                        transition-all duration-200
                        ${activeTab === subItem.id
                                                    ? 'bg-green-600 text-white shadow-sm'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                }
                        ${collapsed ? 'justify-center' : ''}
                      `}
                                            title={collapsed ? subItem.label : ''}
                                        >
                                            <subItem.icon size={20} className="flex-shrink-0" />
                                            {!collapsed && (
                                                <span className="font-medium text-sm">{subItem.label}</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            );
                        }

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleItemClick(item.id)}
                                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-all duration-200
                  ${activeTab === item.id
                                        ? 'bg-green-600 text-white shadow-sm'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }
                  ${collapsed ? 'justify-center' : ''}
                `}
                                title={collapsed ? item.label : ''}
                            >
                                <item.icon size={20} className="flex-shrink-0" />
                                {!collapsed && (
                                    <span className="font-medium text-sm">{item.label}</span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Footer */}
                {!collapsed && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
                        <button
                            onClick={() => handleItemClick('settings')}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            <Settings size={20} />
                            <span className="font-medium text-sm">Settings</span>
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
};

export default Sidebar;
