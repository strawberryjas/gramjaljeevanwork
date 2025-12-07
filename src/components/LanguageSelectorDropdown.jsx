import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Languages } from 'lucide-react';
import { LANGUAGES } from '../constants/translations';
import { useLanguage } from '../hooks/useAppState';

export const LanguageSelectorDropdown = () => {
  const { language, changeLanguage } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isLanguageExpanded, setIsLanguageExpanded] = useState(false);
  const languageMenuRef = useRef(null);

  const currentLang = useMemo(
    () => LANGUAGES.find((lang) => lang.code === language) || LANGUAGES[0],
    [language]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        if (showLanguageMenu) {
          setShowLanguageMenu(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLanguageMenu]);

  const handleLanguageChange = (langCode) => {
    if (langCode === language) {
      setShowLanguageMenu(false);
      return;
    }
    changeLanguage(langCode);
    setShowLanguageMenu(false);
  };

  return (
    <div ref={languageMenuRef} className="relative z-[60]">
      {!isLanguageExpanded ? (
        <button
          onClick={() => {
            setIsLanguageExpanded(true);
            setShowLanguageMenu(true);
          }}
          className="p-2 rounded-xl bg-white/60 backdrop-blur-md shadow-sm border border-gray-200 hover:border-blue-300 transition-all duration-300"
        >
          <Languages size={18} className="text-blue-600" />
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 bg-white shadow-lg border-2 border-blue-500"
          >
            <Languages size={18} className="text-blue-600" />
            <div className="text-left min-w-[60px]">
              <div className="text-xs font-bold text-gray-800 leading-tight">
                {currentLang.nativeName}
              </div>
            </div>
          </button>
          <button
            onClick={() => {
              setIsLanguageExpanded(false);
              setShowLanguageMenu(false);
            }}
            className="p-2 rounded-xl bg-white/60 backdrop-blur-md shadow-sm border border-gray-200 hover:border-red-300 transition-all duration-300"
            title="Close language selector"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-600 hover:text-red-600"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}

      {showLanguageMenu && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-[100]">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2">
            <h3 className="text-white font-bold text-xs flex items-center gap-2">
              <Languages size={14} />
              Select Language
            </h3>
          </div>
          <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-100">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full px-3 py-2 text-left hover:bg-blue-50 transition-all border-b border-gray-100 last:border-0 ${
                  language === lang.code ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-gray-800">{lang.nativeName}</div>
                    <div className="text-[10px] text-gray-500">{lang.name}</div>
                  </div>
                  {language === lang.code && (
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
