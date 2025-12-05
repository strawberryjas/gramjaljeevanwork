export const INDIC_LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'as', label: 'Assamese', nativeLabel: 'অসমীয়া' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { code: 'brx', label: 'Bodo', nativeLabel: 'बोड़ो' },
  { code: 'doi', label: 'Dogri', nativeLabel: 'डोगरी' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { code: 'ks', label: 'Kashmiri', nativeLabel: 'کٲشُر' },
  { code: 'gom', label: 'Konkani', nativeLabel: 'कोंकणी' },
  { code: 'mai', label: 'Maithili', nativeLabel: 'मैथिली' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം' },
  { code: 'mni', label: 'Meitei (Manipuri)', nativeLabel: 'ꯃꯤꯇꯩ ꯂꯣꯟ' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
  { code: 'ne', label: 'Nepali', nativeLabel: 'नेपाली' },
  { code: 'or', label: 'Odia', nativeLabel: 'ଓଡ଼ିଆ' },
  { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ' },
  { code: 'sa', label: 'Sanskrit', nativeLabel: 'संस्कृतम्' },
  { code: 'sat', label: 'Santali', nativeLabel: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'sd', label: 'Sindhi', nativeLabel: 'سنڌي' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'ur', label: 'Urdu', nativeLabel: 'اردو' },
];

export const LANGUAGE_METADATA = INDIC_LANGUAGES.reduce((acc, lang) => {
  acc[lang.code] = lang;
  return acc;
}, {});

export const SUPPORTED_LANGUAGE_CODES = INDIC_LANGUAGES.map((lang) => lang.code);

export const LEGACY_LANGUAGE_MAP = {
  English: 'en',
  Hindi: 'hi',
  Kannada: 'kn',
  Tamil: 'ta',
  'Hindi (हिंदी)': 'hi',
  'Kannada (ಕನ್ನಡ)': 'kn',
  'Tamil (தமிழ்)': 'ta',
  'English (US)': 'en',
};

export const getLanguageDisplayName = (code) => {
  const lang = LANGUAGE_METADATA[code];
  if (!lang) return LANGUAGE_METADATA.en.label;
  if (!lang.nativeLabel || lang.nativeLabel === lang.label) {
    return lang.label;
  }
  return `${lang.label} • ${lang.nativeLabel}`;
};

export const getLanguageLabel = (code) =>
  LANGUAGE_METADATA[code]?.label ?? LANGUAGE_METADATA.en.label;
