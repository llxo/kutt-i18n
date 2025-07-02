module.exports = {
  verifyMail: {
    subject: "验证您的账户",
    text: `您正在尝试更改您在 {{site_name}} 上的邮箱地址。

请使用以下链接验证您的邮箱地址。

https://{{domain}}/verify/{{verification}}`,
  },
  
  changeEmail: {
    subject: "验证您的新邮箱地址",
    text: `感谢您在 {{site_name}} 创建账户。

请使用以下链接验证您的邮箱地址。

https://{{domain}}/verify-email/{{verification}}`,
  },
  
  resetPassword: {
    subject: "重置您的密码",
    text: `有人请求重置您的账户密码。

请点击下面的按钮重置您的密码。如果不是您发起的请求，则无需采取任何操作。

https://{{domain}}/reset-password/{{resetpassword}}`,
  },

  report: {
    subject: "[举报]",
  }
};
