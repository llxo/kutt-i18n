const nodemailer = require("nodemailer");
const path = require("node:path");
const fs = require("node:fs");

const { resetMailText, verifyMailText, changeEmailText } = require("./text");
const { CustomError } = require("../utils");
const env = require("../env");
const { getMailTranslation } = require("./i18n");

const mailConfig = {
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: env.MAIL_SECURE,
  auth: env.MAIL_USER
    ? {
        user: env.MAIL_USER,
        pass: env.MAIL_PASSWORD
      }
    : undefined
};

const transporter = nodemailer.createTransport(mailConfig);

// Read email templates
const resetEmailTemplatePath = path.join(__dirname, "template-reset.html");
const verifyEmailTemplatePath = path.join(__dirname, "template-verify.html");
const changeEmailTemplatePath = path.join(__dirname,"template-change-email.html");


let resetEmailTemplate, 
    verifyEmailTemplate,
    changeEmailTemplate;

// only read email templates if email is enabled
if (env.MAIL_ENABLED) {
  resetEmailTemplate = fs
    .readFileSync(resetEmailTemplatePath, { encoding: "utf-8" })
    .replace(/{{domain}}/gm, env.DEFAULT_DOMAIN)
    .replace(/{{site_name}}/gm, env.SITE_NAME);
  verifyEmailTemplate = fs
    .readFileSync(verifyEmailTemplatePath, { encoding: "utf-8" })
    .replace(/{{domain}}/gm, env.DEFAULT_DOMAIN)
    .replace(/{{site_name}}/gm, env.SITE_NAME);
  changeEmailTemplate = fs
    .readFileSync(changeEmailTemplatePath, { encoding: "utf-8" })
    .replace(/{{domain}}/gm, env.DEFAULT_DOMAIN)
    .replace(/{{site_name}}/gm, env.SITE_NAME);
}

async function verification(user) {
  if (!env.MAIL_ENABLED) {
    throw new Error("Attempting to send verification email but email is not enabled.");
  };

  // 获取用户语言设置，如果没有则使用默认语言
  const userLang = user.language || env.DEFAULT_LANGUAGE || 'en';
  const translation = getMailTranslation(userLang, 'verifyMail');
  
  const mail = await transporter.sendMail({
    from: env.MAIL_FROM || env.MAIL_USER,
    to: user.email,
    subject: translation.subject,
    text: translation.text
      .replace(/{{verification}}/gim, user.verification_token)
      .replace(/{{domain}}/gm, env.DEFAULT_DOMAIN)
      .replace(/{{site_name}}/gm, env.SITE_NAME),
    html: verifyEmailTemplate
      .replace(/{{verification}}/gim, user.verification_token)
      .replace(/{{domain}}/gm, env.DEFAULT_DOMAIN)
      .replace(/{{site_name}}/gm, env.SITE_NAME)
  });

  if (!mail.accepted.length) {
    throw new CustomError("Couldn't send verification email. Try again later.");
  }
}

async function changeEmail(user) {
  if (!env.MAIL_ENABLED) {
    throw new Error("Attempting to send change email token but email is not enabled.");
  };
  
  // 获取用户语言设置
  const userLang = user.language || env.DEFAULT_LANGUAGE || 'en';
  const translation = getMailTranslation(userLang, 'changeEmail');
  
  const mail = await transporter.sendMail({
    from: env.MAIL_FROM || env.MAIL_USER,
    to: user.change_email_address,
    subject: translation.subject,
    text: translation.text
      .replace(/{{verification}}/gim, user.change_email_token)
      .replace(/{{domain}}/gm, env.DEFAULT_DOMAIN)
      .replace(/{{site_name}}/gm, env.SITE_NAME),
    html: changeEmailTemplate
      .replace(/{{verification}}/gim, user.change_email_token)
      .replace(/{{domain}}/gm, env.DEFAULT_DOMAIN)
      .replace(/{{site_name}}/gm, env.SITE_NAME)
  });
  
  if (!mail.accepted.length) {
    throw new CustomError("Couldn't send verification email. Try again later.");
  }
}

async function resetPasswordToken(user) {
  if (!env.MAIL_ENABLED) {
    throw new Error("Attempting to send reset password email but email is not enabled.");
  };
  
  // 获取用户语言设置
  const userLang = user.language || env.DEFAULT_LANGUAGE || 'en';
  const translation = getMailTranslation(userLang, 'resetPassword');
  const mail = await transporter.sendMail({
    from: env.MAIL_FROM || env.MAIL_USER,
    to: user.email,
    subject: translation.subject,
    text: translation.text
      .replace(/{{resetpassword}}/gm, user.reset_password_token)
      .replace(/{{domain}}/gm, env.DEFAULT_DOMAIN)
      .replace(/{{site_name}}/gm, env.SITE_NAME),
    html: resetEmailTemplate
      .replace(/{{resetpassword}}/gm, user.reset_password_token)
      .replace(/{{domain}}/gm, env.DEFAULT_DOMAIN)
      .replace(/{{site_name}}/gm, env.SITE_NAME)
  });

  if (!mail.accepted.length) {
    throw new CustomError(
      "Couldn't send reset password email. Try again later."
    );
  }
}

async function sendReportEmail(link, language = 'en') {
  if (!env.MAIL_ENABLED) {
    throw new Error("Attempting to send report email but email is not enabled.");
  };

  // 获取语言设置
  const translation = getMailTranslation(language, 'report');

  const mail = await transporter.sendMail({
    from: env.MAIL_FROM || env.MAIL_USER,
    to: env.REPORT_EMAIL,
    subject: translation.subject,
    text: link,
    html: link
  });

  if (!mail.accepted.length) {
    throw new CustomError("Couldn't submit the report. Try again later.");
  }
}

module.exports = {
  changeEmail,
  verification,
  resetPasswordToken,
  sendReportEmail,
}
