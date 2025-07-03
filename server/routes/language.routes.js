// Language routes
const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const auth = require("../handlers/auth.handler");
const locals = require("../handlers/locals.handler");
const router = express.Router();

// Get available languages
router.get("/api/languages", locals.config, (req, res) => {
  const languages = req.app.locals.i18n.getAvailableLanguages();
  res.json(languages);
});

// Change language
router.post("/api/language/:code", locals.config, asyncHandler(auth.jwtLoose), async (req, res) => {
  const { code } = req.params;
  const languages = req.app.locals.i18n.getAvailableLanguages();
  const isValidLanguage = languages.some(lang => lang.code === code);
  
  if (isValidLanguage) {
    // Set cookie for 1 year
    res.cookie("lang", code, { 
      maxAge: 365 * 24 * 60 * 60 * 1000,
      httpOnly: true
    });
    
    // 如果用户已登录，则更新其语言偏好
    if (req.user) {
      try {
        const query = require('../queries');
        await query.user.update({ id: req.user.id }, { language: code });
      } catch (error) {
        console.error('Error updating user language preference:', error);
      }
    }
    
    res.json({ success: true, language: code });
  } else {
    res.status(400).json({ 
      success: false, 
      error: "Invalid language code" 
    });
  }
});

module.exports = router;
