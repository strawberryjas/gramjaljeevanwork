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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-200 animate-in slide-in-from-bottom-4 duration-300" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Settings size={24} className="text-white" /> {t('accessibility.title')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-300 text-white"
          >
            <X size={20} />
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
          <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
            <p className="text-sm text-blue-800 font-medium">
              ℹ️ {t('accessibility.info')}
            </p>
          </div>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="w-full py-3 font-bold text-white bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
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
    <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <label className="block font-bold text-gray-800">
          {t('accessibility.textSize')}
        </label>
        <span className="text-lg font-bold text-blue-600">
          {typeof textSize === 'string' ? '100%' : (textSize * 100).toFixed(0) + '%'}
        </span>
      </div>
      <style>{`
        .accessibility-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 12px;
          border-radius: 6px;
          outline: none;
          transition: all 0.15s ease;
        }
        .accessibility-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
          transition: all 0.15s ease;
        }
        .accessibility-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
        }
        .accessibility-slider::-webkit-slider-thumb:active {
          transform: scale(1.05);
        }
        .accessibility-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
          transition: all 0.15s ease;
        }
        .accessibility-slider::-moz-range-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
        }
        .accessibility-slider::-moz-range-thumb:active {
          transform: scale(1.05);
        }
      `}</style>
      <input
        type="range"
        min="0.75"
        max="1.5"
        step="0.01"
        value={typeof textSize === 'string' ? 1 : textSize}
        onChange={(e) => setTextSize(parseFloat(e.target.value))}
        className="w-full accessibility-slider cursor-pointer"
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((typeof textSize === 'string' ? 1 : textSize) - 0.75) / 0.75 * 100}%, #e5e7eb ${((typeof textSize === 'string' ? 1 : textSize) - 0.75) / 0.75 * 100}%, #e5e7eb 100%)`
        }}
      />
      <div className="flex justify-between mt-3 text-sm text-gray-600 font-semibold">
        <span className="flex items-center gap-1"><span className="text-xs">A</span><span className="text-[10px]">−</span></span>
        <span className="text-xs text-gray-400">Normal</span>
        <span className="flex items-center gap-1"><span className="text-base">A</span><span className="text-xs">+</span></span>
      </div>
    </div>
  );
};

const ToggleControl = ({ label, hint, isEnabled, onChange }) => {
  return (
    <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
      <div>
        <label className="block font-bold text-gray-800 mb-1">
          {label}
        </label>
        <p className="text-sm text-gray-500">{hint}</p>
      </div>
      <button
        onClick={() => onChange(!isEnabled)}
        className="w-16 h-8 rounded-full transition-all duration-300 relative shadow-inner"
        style={{ backgroundColor: isEnabled ? '#3b82f6' : '#d1d5db' }}
      >
        <div
          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-md ${
            isEnabled ? 'transform translate-x-8' : ''
          }`}
        ></div>
      </button>
    </div>
  );
};
