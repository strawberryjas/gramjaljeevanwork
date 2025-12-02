import React from 'react';
import IconImage from './IconImage';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';

export const Navigation = ({
  activeTab,
  setActiveTab,
  user,
  mobileMenuOpen,
  setMobileMenuOpen,
  showUserMenu,
  setShowUserMenu,
  showAccessibility,
  setShowAccessibility,
  offlineMode,
  lastSync,
  handleLogout,
  jalsenseLogoUrl,
}) => {
  const { t } = useTranslation();

  const isPublicUser = user?.role === 'public';

  return (
    <>
      {/* Top Navbar */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 shadow-2xl border-b-4 border-amber-500">
        <div className="max-w-full mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Left Section: Logos & Branding */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-xl p-3 border-4 border-amber-500 transform hover:scale-110 transition-all duration-300">
                <img
                  src={jalsenseLogoUrl}
                  alt="Jalsense Logo"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div className="hidden xl:flex flex-col bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border-l-4 border-amber-500 shadow-lg">
                <div className="flex items-center gap-2">
                  <IconImage name="landmark.svg" className="h-9 w-9" aria-hidden="true" />
                  <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Gram Panchayat
                  </div>
                </div>
                <div className="text-sm font-bold text-white leading-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Shivpur
                </div>
              </div>
            </div>

            {/* Center Section: Primary Navigation (Desktop) */}
            <nav className="hidden lg:flex items-center gap-2 flex-1 justify-center max-w-4xl">
              {isPublicUser ? (
                <PublicNavigation activeTab={activeTab} setActiveTab={setActiveTab} setMobileMenuOpen={setMobileMenuOpen} t={t} />
              ) : (
                <TechnicianNavigation activeTab={activeTab} setActiveTab={setActiveTab} setMobileMenuOpen={setMobileMenuOpen} t={t} />
              )}
            </nav>

            {/* Right Section: Mobile Menu Toggle */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border-2 border-white/30 transition-all duration-300 text-white transform hover:scale-110 shadow-lg"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? (
                  <IconImage name="close-x.svg" className="h-9 w-9" aria-hidden="true" />
                ) : (
                  <IconImage name="menu-bars.svg" className="h-9 w-9" aria-hidden="true" />
                )}
              </button>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2.5 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border-2 border-white/30 transition-all duration-300 text-white transform hover:scale-110 shadow-lg"
              >
                {user?.name?.charAt(0) || 'U'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Menu Dropdown */}
      {showUserMenu && (
        <UserMenuDropdown
          user={user}
          showAccessibility={showAccessibility}
          setShowAccessibility={setShowAccessibility}
          offlineMode={offlineMode}
          lastSync={lastSync}
          handleLogout={handleLogout}
          setShowUserMenu={setShowUserMenu}
          t={t}
        />
      )}

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <MobileNavigation
          isPublicUser={isPublicUser}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setMobileMenuOpen={setMobileMenuOpen}
          handleLogout={handleLogout}
          t={t}
        />
      )}
    </>
  );
};

const PublicNavigation = ({ activeTab, setActiveTab, setMobileMenuOpen, t }) => {
  const navItems = [
    { id: 'energy', label: t('nav.energy'), icon: 'zap.svg' },
    { id: 'ticketing', label: t('nav.ticketing'), icon: 'ticket.svg' },
  ];

  return (
    <>
      {navItems.map(item => (
        <NavButton
          key={item.id}
          isActive={activeTab === item.id}
          onClick={() => {
            setActiveTab(item.id);
            setMobileMenuOpen(false);
          }}
          icon={item.icon}
          label={item.label}
          showLabel={true}
        />
      ))}
    </>
  );
};

const TechnicianNavigation = ({ activeTab, setActiveTab, setMobileMenuOpen, t }) => {
  const navItems = [
    { id: 'quality', label: t('nav.quality'), icon: 'beaker-flask.png' },
    { id: 'analytics', label: t('nav.analytics'), icon: 'trending-up.svg' },
    { id: 'gis', label: t('nav.gis'), icon: 'map-location.svg' },
  ];

  return (
    <>
      {navItems.map(item => (
        <NavButton
          key={item.id}
          isActive={activeTab === item.id}
          onClick={() => {
            setActiveTab(item.id);
            setMobileMenuOpen(false);
          }}
          icon={item.icon}
          label={item.label}
          showLabel={true}
        />
      ))}
    </>
  );
};

const NavButton = ({ isActive, onClick, icon, label, showLabel }) => {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-black text-xs transition-all duration-300 uppercase tracking-widest transform hover:scale-105 shadow-lg ${
        isActive
          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-2xl'
          : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border-2 border-white/20'
      }`}
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <IconImage name={icon} className="h-8 w-8" aria-hidden="true" />
      {showLabel && <span>{label}</span>}
    </button>
  );
};

const UserMenuDropdown = ({
  user,
  showAccessibility,
  setShowAccessibility,
  offlineMode,
  lastSync,
  handleLogout,
  setShowUserMenu,
  t,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 shadow-lg">
      <div className="p-6">
        <div className="mb-4 pb-4 border-b border-gray-200">
          <p className="font-black text-gray-900 text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {user?.name}
          </p>
          <p className="text-sm text-gray-500">{user?.role}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <label className="block text-xs font-black text-blue-950 uppercase mb-2 tracking-widest flex items-center gap-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <IconImage name="language-icon.svg" className="h-8 w-8" aria-hidden="true" /> {t('language.selectorLabel')}
          </label>
          <LanguageSelector size="sm" hideLabel={false} />
        </div>

        <button
          onClick={() => {
            setShowAccessibility(!showAccessibility);
            setShowUserMenu(false);
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border-2 border-amber-300 hover:bg-amber-100 transition-all duration-300 transform hover:scale-105 mt-4"
        >
          <IconImage name="settings-gear.svg" className="h-8 w-8" aria-hidden="true" />
          <span className="text-sm font-bold text-amber-900 uppercase tracking-wide" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {t('accessibility.button')}
          </span>
        </button>

        {offlineMode && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500 text-white mt-4">
            <IconImage name="wifi-off.svg" className="h-8 w-8" aria-hidden="true" />
            <div>
              <p className="text-sm font-bold uppercase tracking-wide">{t('offline.mode')}</p>
              <p className="text-xs opacity-90">Last sync: {lastSync}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black uppercase tracking-widest transition-all duration-300 transform hover:scale-105 shadow-xl mt-4"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          <IconImage name="logout-icon.svg" className="h-8 w-8" aria-hidden="true" /> {t('nav.logout')}
        </button>
      </div>
    </div>
  );
};

const MobileNavigation = ({
  isPublicUser,
  activeTab,
  setActiveTab,
  setMobileMenuOpen,
  handleLogout,
  t,
}) => {
  const getMenuItems = () => {
    if (isPublicUser) {
      return [
        { id: 'energy', label: t('nav.energy'), icon: 'zap.svg' },
        { id: 'ticketing', label: t('nav.ticketing'), icon: 'ticket.svg' },
      ];
    }
    return [
      { id: 'quality', label: t('nav.quality'), icon: 'beaker-flask.png' },
      { id: 'analytics', label: t('nav.analytics'), icon: 'trending-up.svg' },
      { id: 'gis', label: t('nav.gis'), icon: 'map-location.svg' },
    ];
  };

  return (
    <div className="lg:hidden border-t border-gray-200 bg-white">
      <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
        {getMenuItems().map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                activeTab === item.id
                  ? 'bg-green-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <IconImage name={item.icon} className="h-8 w-8" aria-hidden="true" /> {item.label}
            </button>
          );
        })}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 border border-red-200 transition-all mt-4"
        >
          <IconImage name="logout-icon.svg" className="h-8 w-8" aria-hidden="true" /> {t('nav.logout')}
        </button>
      </div>
    </div>
  );
};
