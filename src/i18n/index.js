import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translationResources } from './resources';
import { SUPPORTED_LANGUAGE_CODES } from './languages';

// Get initial language - prefer stored, default to English
const getInitialLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  
  // Check if we've migrated to English-first version
  const migrationKey = 'gjj_lang_v2';
  const hasMigrated = localStorage.getItem(migrationKey);
  
  if (!hasMigrated) {
    // First time with new version - reset to English
    localStorage.setItem('gjj_language', 'en');
    localStorage.setItem(migrationKey, 'true');
    return 'en';
  }
  
  const stored = localStorage.getItem('gjj_language');
  
  // If user has explicitly chosen a valid language, use it
  if (stored && SUPPORTED_LANGUAGE_CODES.includes(stored)) {
    return stored;
  }
  
  // Default to English for new users
  return 'en';
};

const initialLang = getInitialLanguage();

// Set English in localStorage if not already set correctly
if (typeof window !== 'undefined') {
  localStorage.setItem('gjj_language', initialLang);
}

i18n
  .use(initReactI18next)
  .init({
    resources: translationResources,
    supportedLngs: SUPPORTED_LANGUAGE_CODES,
    lng: initialLang, // Use determined initial language
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    // NO language detector - we manage language ourselves
    detection: false,
    react: {
      useSuspense: false,
    },
  });

export default i18n;
