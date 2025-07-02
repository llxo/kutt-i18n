// i18n module
const en = require('./en');
const zhCN = require('./zh-CN');
const env = require('../env');

// Available languages
const languages = {
  en,
  'zh-CN': zhCN
};

// Default language
const defaultLanguage = env.DEFAULT_LANGUAGE || 'en';

/**
 * Get translation for a key
 * @param {string} key - Dot notation key (e.g. "common.welcome")
 * @param {string} lang - Language code
 * @param {object} params - Parameters to replace in the translation
 * @returns {string} - Translated text
 */
function translate(key, lang = defaultLanguage, params = {}) {
  // Get requested language or fallback to default
  const language = languages[lang] || languages[defaultLanguage];
  
  // Split key by dots
  const keys = key.split('.');
  
  // Get translation
  let translation = language;
  for (const k of keys) {
    translation = translation[k];
    
    // Return key if translation not found
    if (!translation) return key;
  }
  
  // Return translation if it's a string
  if (typeof translation === 'string') {
    // Replace parameters
    return translation.replace(/{{([^}]+)}}/g, (_, param) => params[param] || '');
  }
  
  // Return key if translation is not a string
  return key;
}

/**
 * Get language from request
 * @param {object} req - Express request object
 * @returns {string} - Language code
 */
function getLanguage(req) {
  // 从用户信息中获取语言首选项（如果用户已登录）
  if (req.user && req.user.language && languages[req.user.language]) {
    return req.user.language;
  }
  
  // Get language from cookie
  const cookieLang = req.cookies?.lang;
  if (cookieLang && languages[cookieLang]) {
    return cookieLang;
  }
  
  // Get language from accept-language header
  const acceptLanguage = req.headers['accept-language'];
  if (acceptLanguage) {
    const langs = acceptLanguage.split(',')
      .map(lang => lang.split(';')[0].trim());
    
    for (const lang of langs) {
      if (languages[lang]) {
        return lang;
      }
      // Try language without region code
      const mainLang = lang.split('-')[0];
      if (languages[mainLang]) {
        return mainLang;
      }
    }
  }
  
  // Return default language
  return defaultLanguage;
}

/**
 * Create translate function for a specific language
 * @param {string} lang - Language code
 * @returns {function} - Translate function
 */
function createTranslator(lang) {
  return (key, params) => translate(key, lang, params);
}

/**
 * Get available languages
 * @returns {Array} - Array of language objects
 */
function getAvailableLanguages() {
  return Object.keys(languages).map(code => ({
    code,
    name: languages[code].common?.name || code
  }));
}

// Add language names to language files
languages.en.common.name = 'English';
languages['zh-CN'].common.name = '中文 (简体)';

/**
 * Check if a language code is valid
 * @param {string} lang - Language code
 * @returns {boolean} - True if language is valid
 */
function isValidLanguage(lang) {
  return Boolean(languages[lang]);
}

module.exports = {
  translate,
  getLanguage,
  createTranslator,
  getAvailableLanguages,
  isValidLanguage,
  defaultLanguage,
};
