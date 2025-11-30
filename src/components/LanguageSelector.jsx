import React from 'react';
import { INDIC_LANGUAGES, getLanguageDisplayName } from '../i18n/languages';

const sizeClasses = {
  sm: 'text-xs px-2 py-1.5',
  md: 'text-sm px-3 py-2',
  lg: 'text-base px-4 py-2.5',
};

export const LanguageSelector = ({
  value,
  onChange,
  className = '',
  size = 'md',
  label,
  hideLabel = false,
  id = 'language-selector',
}) => {
  const selectClasses = sizeClasses[size] ?? sizeClasses.md;

  return (
    <div className={`space-y-1 ${className}`}>
      {!hideLabel && (
        <label htmlFor={id} className="block text-2xs font-black uppercase tracking-widest text-gray-900">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          className={`w-full rounded-lg border border-gray-300 bg-white font-medium text-black outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-200 appearance-none ${selectClasses}`}
        >
          {INDIC_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {getLanguageDisplayName(lang.code)}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500 text-xs">
          ⌄
        </span>
      </div>
    </div>
  );
};

