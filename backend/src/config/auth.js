module.exports = {
    AUTH: {
        JWT_SECRET: process.env.JWT_SECRET || 'default-jwt-secret-key',
        JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1h',
        JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || '7d',
        OAUTH_CLIENT_ID: process.env.OAUTH_CLIENT_ID || 'default-oauth-client-id',
        OAUTH_CLIENT_SECRET: process.env.OAUTH_CLIENT_SECRET || 'default-oauth-client-secret',
        OAUTH_REDIRECT_URI: process.env.OAUTH_REDIRECT_URI || 'https://yourapp.com/auth/callback',
    }
};