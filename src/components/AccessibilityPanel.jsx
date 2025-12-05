import React from 'react';
import { Settings, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AccessibilityPanel = ({
  isOpen,
  onClose,
  darkMode,
  setDarkMode,
  textSize,
  setTextSize,
  highContrast,
  setHighContrast,
  reducedMotion,
  setReducedMotion,
  onReset,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border-4 border-green-600 animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div
          className="p-6 flex items-center justify-between"
          style={{
            backgroundColor: 'var(--primary-blue)',
            borderBottom: '3px solid var(--gray-border)',
          }}
        >
          <h2
            className="text-2xl font-black text-white uppercase tracking-wide flex items-center gap-3"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <Settings size={28} className="text-amber-400" /> {t('accessibility.title')}
          </h2>
          <button
            onClick={onClose}
            className="transition-all duration-300"
            style={{ color: 'var(--bg-white)' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Text Size Slider */}
          <TextSizeControl textSize={textSize} setTextSize={setTextSize} t={t} />

          {/* Dark Mode Toggle */}
          <ToggleControl
            label={t('accessibility.darkMode')}
            hint={t('accessibility.darkModeHint')}
            isEnabled={darkMode}
            onChange={setDarkMode}
          />

          {/* High Contrast Toggle */}
          <ToggleControl
            label={t('accessibility.highContrast')}
            hint={t('accessibility.highContrastHint')}
            isEnabled={highContrast}
            onChange={setHighContrast}
          />

          {/* Reduced Motion Toggle */}
          <ToggleControl
            label={t('accessibility.reducedMotion')}
            hint={t('accessibility.reducedMotionHint')}
            isEnabled={reducedMotion}
            onChange={setReducedMotion}
          />

          {/* Info */}
          <div
            className="p-5"
            style={{
              backgroundColor: 'var(--bg-persona)',
              borderRadius: 'var(--radius-sm)',
              borderLeft: '3px solid var(--primary-blue)',
            }}
          >
            <p
              style={{
                fontSize: 'var(--font-size-base)',
                color: 'var(--primary-blue-dark)',
                fontWeight: 'var(--font-weight-semibold)',
              }}
            >
              ℹ️ {t('accessibility.info')}
            </p>
          </div>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="w-full py-3 uppercase tracking-widest transition-all duration-300"
            style={{
              fontFamily: 'var(--font-family)',
              fontWeight: 'var(--font-weight-bold)',
              backgroundColor: 'var(--gray-text-dark)',
              color: 'var(--bg-white)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-md)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-navy)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--gray-text-dark)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
          >
            {t('accessibility.resetButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

const TextSizeControl = ({ textSize, setTextSize, t }) => {
  return (
    <div
      className="p-5"
      style={{
        backgroundColor: 'var(--gray-light)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--gray-border)',
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <label
          className="block uppercase tracking-widest"
          style={{
            fontFamily: 'var(--font-family)',
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--gray-text-dark)',
          }}
        >
          {t('accessibility.textSize')}
        </label>
        <span
          style={{
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--gray-text-dark)',
          }}
        >
          {typeof textSize === 'string' ? '100%' : (textSize * 100).toFixed(0) + '%'}
        </span>
      </div>
      <input
        type="range"
        min="0.75"
        max="1.5"
        step="0.05"
        value={typeof textSize === 'string' ? 1 : textSize}
        onChange={(e) => setTextSize(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-green-600"
      />
      <div className="flex justify-between mt-2 text-xs text-gray-500 font-bold">
        <span>A-</span>
        <span>A+</span>
      </div>
    </div>
  );
};

const ToggleControl = ({ label, hint, isEnabled, onChange }) => {
  return (
    <div
      className="p-5 flex items-center justify-between"
      style={{
        backgroundColor: 'var(--gray-light)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--gray-border)',
      }}
    >
      <div>
        <label
          className="block uppercase tracking-widest mb-1"
          style={{
            fontFamily: 'var(--font-family)',
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--gray-text-dark)',
          }}
        >
          {label}
        </label>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--gray-text-dark)' }}>{hint}</p>
      </div>
      <button
        onClick={() => onChange(!isEnabled)}
        className="w-16 h-8 rounded-full transition-all duration-300 relative"
        style={{ backgroundColor: isEnabled ? '#059669' : 'var(--gray-border)' }}
      >
        <div
          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
            isEnabled ? 'transform translate-x-8' : ''
          }`}
        ></div>
      </button>
    </div>
  );
};
