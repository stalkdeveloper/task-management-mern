module.exports = {
    MAIL: {
        SMTP_HOST: 'smtp.yourmailserver.com',
        SMTP_PORT: 587,
        USER: 'your-email@example.com',
        PASSWORD: 'your-email-password',
        FROM: 'no-reply@yourdomain.com',
        SUPPORT_EMAIL: 'support@yourdomain.com',
        EMAIL_TEMPLATES: {
            WELCOME: 'welcome-template',
            PASSWORD_RESET: 'password-reset-template',
        }
    }
};
  