import React, { useState } from 'react';
import IconImage from './IconImage';
import { useTranslation } from 'react-i18next';

const ministryLogoUrl = '/ministry-logo.svg';
const jalsenseLogoUrl = '/jalsense-logo.svg';

/**
 * SidebarNavigation Component
 * - Collapsible sidebar for dashboard navigation
 * - Section-based organization with expandable menus
 * - Role-based item visibility
 * - Mobile responsive with hamburger toggle
 */
export const SidebarNavigation = ({
  activeTab,
  setActiveTab,
  user,
  isOpen,
  setIsOpen,
  offlineMode,
  lastSync,
  onAccessibility,
  onLogout,
  alertBlinkTargets = new Set(),
}) => {
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState({
    infrastructure: true,
    operations: true,
    monitoring: true,
    analysis: true,
  });

  const isPublicUser = user?.role === 'public';
  const isTechnician = user?.role === 'technician';
  const isResearcher = user?.role === 'researcher';

  // Open sidebar when navigation changes (so external buttons that change `activeTab` also open it)
  React.useEffect(() => {
    try {
      if (typeof setIsOpen === 'function' && !isOpen) {
        setIsOpen(true);
      }
    } catch (e) {
      // ignore
    }
  }, [activeTab]);

  // Define navigation sections based on user role
  // Icons are names of files in `public/images/icons` (with or without extension)
  const navigationSections = isPublicUser
    ? [
        {
          id: 'infrastructure',
          label: t('nav.infrastructure'),
          icon: 'layers-stack.svg',
          items: [
            { id: 'overview', label: t('nav.overview'), icon: 'layers-stack.svg' },
            { id: 'pump-station', label: t('nav.pumpStation'), icon: 'pump-machine.svg' },
            { id: 'water-tank', label: t('nav.waterTank'), icon: 'water-droplet.png' },
            { id: 'pipeline', label: t('nav.pipeline'), icon: 'pipeline-pipe.svg' },
            { id: 'valves', label: t('nav.valves'), icon: 'valve-control.svg' },
          ],
        },
        {
          id: 'monitoring',
          label: t('nav.monitoring'),
          icon: 'radio-signal.svg',
          items: [
            { id: 'quality', label: t('nav.quality'), icon: 'beaker-flask.png' },
            { id: 'analytics', label: t('nav.analytics'), icon: 'trending-up.svg' },
          ],
        },
      ]
    : [
        {
          id: 'infrastructure',
          label: t('nav.infrastructure'),
          icon: 'layers-stack.svg',
          items: [
            { id: 'overview', label: t('nav.overview'), icon: 'layers-stack.svg' },
            { id: 'pump-station', label: t('nav.pumpStation'), icon: 'pump-machine.svg' },
            { id: 'water-tank', label: t('nav.waterTank'), icon: 'water-droplet.png' },
            { id: 'pipeline', label: t('nav.pipeline'), icon: 'pipeline-pipe.svg' },
            { id: 'valves', label: t('nav.valves'), icon: 'valve-control.svg' },
          ],
        },
        {
          id: 'operations',
          label: t('nav.operations'),
          icon: 'settings-gear.svg',
          items: [
            { id: 'quality', label: t('nav.quality'), icon: 'beaker-flask.png' },
            { id: 'service-requests', label: t('nav.serviceRequests'), icon: 'check-success.svg' },
            ...(isResearcher ? [{ id: 'reports', label: t('nav.reports'), icon: 'check-success.svg' }] : []),
          ],
        },
        {
          id: 'monitoring',
          label: t('nav.monitoring'),
          icon: 'radio-signal.svg',
          items: [
            { id: 'accountability', label: t('nav.accountability'), icon: 'check-success.svg' },
            { id: 'energy', label: t('nav.energy'), icon: 'gauge-meter.png' },
          ],
        },
        {
          id: 'analysis',
          label: t('nav.analysis'),
          icon: 'trending-up.svg',
          items: [
            { id: 'analytics', label: t('nav.analytics'), icon: 'trending-up.svg' },
            { id: 'gis', label: t('nav.gis'), icon: 'map-location.svg' },
          ],
        },
      ];

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleItemClick = (itemId) => {
    setActiveTab(itemId);
    // Close sidebar on mobile when item is clicked
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Government Design System */}
      <div
        className={`fixed lg:sticky top-0 left-0 h-screen z-40 lg:z-10 flex flex-col justify-between transition-all duration-300 ease-in-out ${
          isOpen ? 'w-72' : 'w-0 lg:w-20'
        } overflow-hidden lg:overflow-visible`}
        style={{ 
          backgroundColor: 'var(--bg-white)',
          borderRight: '1px solid var(--gray-border)',
          boxShadow: 'var(--shadow-subtle)'
        }}
      >
        {/* Header Section with Logo - Government Style */}
        <div 
          className="p-4"
          style={{ 
            backgroundColor: 'var(--bg-white)',
            borderBottom: '1px solid var(--gray-border)'
          }}
        >
          <div className="flex items-center justify-between">
            {/* Jalsense Logo - Rectangle */}
            <div className="flex-1">
              <img
                src={jalsenseLogoUrl}
                alt="Jalsense Logo"
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            {/* Toggle Button */}
              <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 transition-colors ml-2"
              style={{ 
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'transparent',
                color: 'var(--primary-blue)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-light)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title={isOpen ? 'Collapse' : 'Expand'}
              aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {isOpen ? (
                <IconImage name="close-x.svg" className="h-9 w-9" aria-hidden="true" />
              ) : (
                <IconImage name="menu-bars.svg" className="h-9 w-9" aria-hidden="true" />
              )}
            </button>
          </div>
          {/* Location Text */}
          {isOpen && (
            <div 
              className="text-center mt-3 pt-3" 
              style={{ 
                borderTop: '3px solid var(--primary-blue)'
              }}
            >
              <p 
                style={{ 
                  fontSize: 'var(--font-size-sm)', 
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--gray-text-darker)',
                  letterSpacing: '0.5px'
                }}
              >
                SONALUR
              </p>
            </div>
          )}
        </div>

        {/* Status Bar - Government Style */}
        {isOpen && (
          <div 
            className="px-4 py-3"
            style={{
              backgroundColor: 'var(--gray-light)',
              borderBottom: '1px solid var(--gray-border)'
            }}
          >
            <div className="space-y-2" style={{ fontSize: 'var(--font-size-xs)' }}>
                <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 ${
                    offlineMode ? 'bg-red-600' : 'bg-green-600'
                  }`}
                  style={{ borderRadius: '50%' }}
                />
                <span 
                  style={{ 
                    color: 'var(--gray-text-dark)',
                    fontWeight: 'var(--font-weight-medium)'
                  }}
                >
                  {offlineMode ? 'Offline Mode' : 'Connected'}
                </span>
              </div>
              {lastSync && (
                <div 
                  className="flex items-center gap-2"
                  style={{ color: 'var(--gray-text)' }}
                >
                  <IconImage name="clock.svg" className="h-8 w-8" aria-hidden="true" />
                  <span>Last sync: {lastSync}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Sections - Scrollable */}
        <nav 
          className="flex-1 p-3"
          style={{ 
            backgroundColor: 'var(--bg-white)',
            overflowY: 'auto',
            overflowX: 'hidden',
            maxHeight: 'calc(100vh - 350px)'
          }}
        >
          <div className="space-y-2">
            {navigationSections.map(section => {
              const isExpanded = expandedSections[section.id];
              const hasSomeActive = section.items.some(item => item.id === activeTab);
              const sectionHasAlert = section.items.some(item => alertBlinkTargets.has(item.id));

              return (
                <div key={section.id}>
                  {/* Section Header - Government Style */}
                  <button
                    onClick={() => {
                      if (!isOpen && typeof setIsOpen === 'function') {
                        setIsOpen(true);
                        // wait for open animation then toggle
                        setTimeout(() => toggleSection(section.id), 220);
                      } else {
                        toggleSection(section.id);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 transition-all ${sectionHasAlert ? 'animate-pulse-subtle' : ''}`}
                    style={{
                      backgroundColor: hasSomeActive ? 'var(--bg-persona)' : 'transparent',
                      borderLeft: hasSomeActive ? '3px solid var(--primary-blue)' : 'none',
                      color: hasSomeActive ? 'var(--primary-blue)' : 'var(--gray-text-dark)',
                      fontSize: 'var(--font-size-md)',
                      fontWeight: hasSomeActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                      borderRadius: 'var(--radius-none)',
                      ...(sectionHasAlert && !hasSomeActive
                        ? {
                          borderLeft: '3px solid #f97316',
                          backgroundColor: 'rgba(249, 115, 22, 0.08)',
                          boxShadow: '0 0 14px rgba(249, 115, 22, 0.35)'
                        }
                        : sectionHasAlert
                          ? {
                            boxShadow: '0 0 14px rgba(249, 115, 22, 0.35)'
                          }
                          : {})
                    }}
                    onMouseEnter={(e) => {
                      if (!hasSomeActive) {
                        e.currentTarget.style.backgroundColor = 'var(--gray-light)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!hasSomeActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                    title={!isOpen ? section.label : ''}
                    aria-label={section.label}
                  >
                      <IconImage name={section.icon} className="h-9 w-9 flex-shrink-0" aria-hidden="true" />
                    {isOpen && (
                      <>
                        <span className="flex-1 text-left text-sm font-bold">
                          {section.label}
                        </span>
                        <IconImage name="chevron-right.svg" className={`h-9 w-9 flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} aria-hidden="true" />
                      </>
                    )}
                  </button>

                  {/* Section Items - Government Style */}
                  {isOpen && isExpanded && (
                    <div 
                      className="ml-3 mt-1 space-y-1 pl-3"
                      style={{ borderLeft: '1px solid var(--gray-border)' }}
                    >
                      {section.items.map(item => {
                        const isActive = item.id === activeTab;
                        const isItemBlinking = alertBlinkTargets.has(item.id);
                        const itemTextColor = isActive
                          ? 'var(--primary-blue)'
                          : isItemBlinking
                            ? '#c2410c'
                            : 'var(--gray-text-dark)';
                        const itemBackground = isActive
                          ? 'var(--bg-persona)'
                          : isItemBlinking
                            ? 'rgba(249, 115, 22, 0.08)'
                            : 'transparent';
                        const itemBorderLeft = isItemBlinking
                          ? '3px solid #f97316'
                          : isActive
                            ? '2px solid var(--primary-blue)'
                            : 'none';
                        const itemPaddingLeft = isActive || isItemBlinking ? '14px' : '12px';
                        const itemBoxShadow = isItemBlinking ? '0 0 12px rgba(249, 115, 22, 0.35)' : 'none';

                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              if (!isOpen && typeof setIsOpen === 'function') {
                                setIsOpen(true);
                                setTimeout(() => handleItemClick(item.id), 220);
                              } else {
                                handleItemClick(item.id);
                              }
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 transition-all ${isItemBlinking ? 'animate-pulse-subtle' : ''}`}
                            style={{
                              fontSize: 'var(--font-size-base)',
                              color: itemTextColor,
                              fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
                              backgroundColor: itemBackground,
                              borderRadius: 'var(--radius-sm)',
                              borderLeft: itemBorderLeft,
                              paddingLeft: itemPaddingLeft,
                              textDecoration: isActive ? 'underline' : 'none',
                              boxShadow: itemBoxShadow
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.backgroundColor = 'var(--gray-light)';
                                e.currentTarget.style.textDecoration = 'underline';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.textDecoration = 'none';
                              }
                            }}
                            aria-label={item.label}
                          >
                            <IconImage name={item.icon} className="h-8 w-8 flex-shrink-0" aria-hidden="true" />
                            <span className="flex-1 text-left">{item.label}</span>
                            {isItemBlinking && (
                              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce-slow" aria-hidden="true"></span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Footer - Government Style - Always at Bottom */}
        <div 
          className="p-4 space-y-3 mt-auto"
          style={{
            backgroundColor: 'var(--gray-light)',
            borderTop: '1px solid var(--gray-border)'
          }}
        >
          {isOpen && (
            <>
            {/* Ministry Logo - Rectangle */}
            <div className="flex justify-center py-2">
              <img
                src={ministryLogoUrl}
                alt="Ministry Logo"
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

            {/* Accessibility & Logout Buttons - Government Style */}
                <div className="space-y-2">
              <button 
                onClick={() => {
                  if (onAccessibility) {
                    onAccessibility();
                  }
                }}
                className="w-full flex items-center gap-3 px-3 py-2 transition-colors"
                style={{
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  borderRadius: 'var(--radius-sm)',
                  border: '2px solid var(--primary-blue)',
                  backgroundColor: 'var(--bg-white)',
                  color: 'var(--primary-blue)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-persona)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-white)';
                }}
                aria-label="Accessibility"
              >
                <IconImage name="accessibility-icon.svg" className="h-8 w-8" aria-hidden="true" />
                <span>Accessibility</span>
              </button>
              <button
                onClick={() => {
                  console.log('Logout clicked');
                  if (onLogout) {
                    onLogout();
                  } else {
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.href = '/login';
                  }
                }}
                className="w-full flex items-center gap-3 px-3 py-2 transition-opacity"
                style={{
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--primary-blue)',
                  color: 'var(--bg-white)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                title="Click to logout"
                aria-label="Logout"
              >
                <IconImage name="logout-icon.svg" className="h-8 w-8" aria-hidden="true" />
                <span>Logout</span>
              </button>
            </div>
            </>
          )}

          {/* Always show ministry logo, accessibility, and logout at bottom even when closed */}
          {!isOpen && (
            <>
              {/* Ministry Logo - Small when closed */}
              <div className="flex justify-center py-2">
                <img
                  src={ministryLogoUrl}
                  alt="Ministry Logo"
                  className="h-8 w-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              {/* Icon-only buttons when closed */}
              <div className="space-y-2">
                <button 
                  onClick={() => {
                    if (onAccessibility) {
                      onAccessibility();
                    }
                  }}
                  className="w-full flex items-center justify-center p-2 transition-colors"
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    border: '2px solid var(--primary-blue)',
                    backgroundColor: 'var(--bg-white)',
                    color: 'var(--primary-blue)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-persona)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-white)';
                  }}
                  title="Accessibility"
                aria-label="Accessibility"
                >
                  <IconImage name="accessibility-icon.svg" className="h-8 w-8" aria-hidden="true" />
                </button>
                <button
                  onClick={() => {
                    console.log('Logout clicked');
                    if (onLogout) {
                      onLogout();
                    } else {
                      localStorage.clear();
                      sessionStorage.clear();
                      window.location.href = '/login';
                    }
                  }}
                  className="w-full flex items-center justify-center p-2 transition-opacity"
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--primary-blue)',
                    color: 'var(--bg-white)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  title="Logout"
                aria-label="Logout"
                >
                  <IconImage name="logout-icon.svg" className="h-8 w-8" aria-hidden="true" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
