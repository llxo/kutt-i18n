const path = require('path');
const fs = require('fs');

// 加载所有语言文件
const supportedLanguages = {};
const languageFolder = path.join(__dirname);

// 读取当前目录下的所有 .js 文件（排除 index.js）
fs.readdirSync(languageFolder)
  .filter(file => file !== 'index.js' && file.endsWith('.js'))
  .forEach(file => {
    const languageCode = file.replace('.js', '');
    supportedLanguages[languageCode] = require(path.join(languageFolder, file));
  });

/**
 * 获取指定语言的邮件翻译
 * @param {string} language 语言代码
 * @param {string} type 邮件类型 (verifyMail, changeEmail, resetPassword, report)
 * @param {object} defaultLang 默认语言对象
 * @returns {object} 翻译对象
 */
function getMailTranslation(language, type, defaultLang = 'en') {
  if (!language || !supportedLanguages[language]) {
    return supportedLanguages[defaultLang][type];
  }

  return supportedLanguages[language][type] || supportedLanguages[defaultLang][type];
}

module.exports = {
  getMailTranslation,
  supportedLanguages
};
