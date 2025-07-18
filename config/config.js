import dotenv from 'dotenv';
dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    database: {
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        name: process.env.MYSQL_DATABASE || 'railway',
        port: process.env.MYSQL_PORT || 3308,
        connectionLimit: 10
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'school_app_secret_key',
        expiresIn: '2h'
    },
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

validateConfig();
export default config;
