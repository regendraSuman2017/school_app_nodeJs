import dotenv from 'dotenv';
dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        name: process.env.DB_NAME || 'railway',
        port: process.env.DB_PORT || 3307,
        connectionLimit: 10
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'school_app_secret_key',
        expiresIn: '2h'
    },
    env: process.env.NODE_ENV || 'development'
};

export default config;
