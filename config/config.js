import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration object with default values
const config = {
    // Server configuration
    port: process.env.PORT || 3000,
    
    // Database configuration
    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        name: process.env.DB_NAME || 'school_app',
        connectionLimit: process.env.DB_CONNECTION_LIMIT || 10
    },
    
    // JWT configuration
    jwt: {
        secret: process.env.JWT_SECRET || 'school_app_secret_key_2024_secure_token',
        expiresIn: '2h'
    },
    
    // Environment
    env: process.env.NODE_ENV || 'development'
};

// Validate required configuration
const validateConfig = () => {
    const requiredEnvVars = {
        'JWT_SECRET': config.jwt.secret,
        'DB_NAME': config.database.name,
        'DB_USER': config.database.user,
        'DB_HOST': config.database.host
    };

    for (const [name, value] of Object.entries(requiredEnvVars)) {
        if (!value) {
            throw new Error(`${name} is required in environment variables`);
        }
    }
};

// Validate configuration on startup
validateConfig();

export default config;