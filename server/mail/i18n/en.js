module.exports = {
  verifyMail: {
    subject: "Verify your account",
    text: `You're attempting to change your email address on {{site_name}}.

Please verify your email address using the link below.

https://{{domain}}/verify/{{verification}}`,
  },
  
  changeEmail: {
    subject: "Verify your new email address",
    text: `Thanks for creating an account on {{site_name}}.

Please verify your email address using the link below.

https://{{domain}}/verify-email/{{verification}}`,
  },
  
  resetPassword: {
    subject: "Reset your password",
    text: `A password reset has been requested for your account.

Please click on the button below to reset your password. There's no need to take any action if you didn't request this.

https://{{domain}}/reset-password/{{resetpassword}}`,
  },

  report: {
    subject: "[REPORT]",
  }
};
